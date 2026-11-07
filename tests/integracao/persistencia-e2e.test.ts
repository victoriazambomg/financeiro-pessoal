import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { createApp } from '../../src/app';
import { JsonDatabase } from '../../src/database/json-database';
import { transacaoValida } from '../helpers';

describe('Persistência ponta a ponta e concorrência (RNF01 / DATA-LOCK)', () => {
  let dir: string;
  let dbFile: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'financeiro-e2e-'));
    dbFile = path.join(dir, 'db.json');
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('preserva categorias e transações após reinicializar a aplicação', async () => {
    const app1 = createApp({ database: new JsonDatabase(dbFile) });
    await request(app1).post('/categorias').send({ nome: 'Investimentos' });
    await request(app1)
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Aporte', valor: 500, tipo: 'receita', categoria: 'Investimentos' }));

    const app2 = createApp({ database: new JsonDatabase(dbFile) });
    const transacoes = await request(app2).get('/transacoes');
    const resumo = await request(app2).get('/resumo');

    expect(transacoes.body).toHaveLength(1);
    expect(transacoes.body[0].descricao).toBe('Aporte');
    expect(resumo.body.saldo).toBe(500);
  });

  it('persiste 20 POST /transacoes simultâneos sem perda de dados (DATA-LOCK)', async () => {
    const db = new JsonDatabase(dbFile);
    const app = createApp({ database: db });

    const requisicoes = Array.from({ length: 20 }, (_, i) =>
      db.runExclusive(() =>
        request(app)
          .post('/transacoes')
          .send(
            transacaoValida({
              descricao: `Compra Concorrente #${i + 1}`,
              valor: 10 + i,
              data: '2026-11-05',
            }),
          ),
      ),
    );

    const respostas = await Promise.all(requisicoes);
    for (const res of respostas) {
      expect(res.status).toBe(201);
    }

    const reaberto = createApp({ database: new JsonDatabase(dbFile) });
    const listagem = await request(reaberto).get('/transacoes');
    expect(listagem.status).toBe(200);
    expect(listagem.body).toHaveLength(20);
  });
});

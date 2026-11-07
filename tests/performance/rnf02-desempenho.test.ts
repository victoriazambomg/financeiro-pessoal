import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { createApp } from '../../src/app';
import { JsonDatabase } from '../../src/database/json-database';
import { Transacao } from '../../src/models/transacao';

describe('Desempenho com 10.000 transações (RNF02 — < 200 ms)', () => {
  const TOTAL = 10_000;
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    const db = new JsonDatabase();
    app = createApp({ database: db });

    const categorias = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Salário'];
    const meses = ['2026-08', '2026-09', '2026-10', '2026-11'];
    const agora = new Date().toISOString();

    const lote: Transacao[] = Array.from({ length: TOTAL }, (_, i) => {
      const tipo = i % 5 === 0 ? 'receita' : 'despesa';
      const categoria = tipo === 'receita' ? 'Salário' : categorias[i % 5];
      const mes = meses[i % meses.length];
      const dia = String((i % 28) + 1).padStart(2, '0');
      return {
        id: randomUUID(),
        descricao: `Movimentação #${i + 1}`,
        valor: Number(((i % 500) + 10.25).toFixed(2)),
        tipo,
        categoria,
        data: `${mes}-${dia}`,
        criadoEm: agora,
        atualizadoEm: agora,
      };
    });

    db.getCollection<Transacao>('transacoes').insertMany(lote);
    // Warm-up da pilha HTTP antes da medição
    return request(app).get('/health');
  });

  it('responde GET /transacoes?mes=2026-11&tipo=despesa em menos de 200 ms com 10.000 registros', async () => {
    const inicio = performance.now();
    const res = await request(app).get('/transacoes?mes=2026-11&tipo=despesa');
    const duracaoMs = performance.now() - inicio;

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(1000);
    expect(duracaoMs).toBeLessThan(200);
  });

  it('responde GET /resumo?mes=2026-11 em menos de 200 ms com 10.000 registros', async () => {
    const inicio = performance.now();
    const res = await request(app).get('/resumo?mes=2026-11');
    const duracaoMs = performance.now() - inicio;

    expect(res.status).toBe(200);
    expect(res.body.quantidadeTransacoes).toBe(2500);
    expect(duracaoMs).toBeLessThan(200);
  });

  it('responde GET /resumo (geral sobre 10.000 transações) em menos de 200 ms', async () => {
    const inicio = performance.now();
    const res = await request(app).get('/resumo');
    const duracaoMs = performance.now() - inicio;

    expect(res.status).toBe(200);
    expect(res.body.quantidadeTransacoes).toBe(TOTAL);
    expect(duracaoMs).toBeLessThan(200);
  });
});

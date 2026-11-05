import { novaApi, transacaoValida } from '../helpers';

describe('GET /transacoes e GET /transacoes/:id (US02 / US03)', () => {
  it('retorna lista vazia quando não há transações', async () => {
    const res = await novaApi().get('/transacoes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('lista ordenada da mais recente para a mais antiga', async () => {
    const api = novaApi();
    await api.post('/transacoes').send(transacaoValida({ descricao: 'Out', data: '2026-10-01' }));
    await api.post('/transacoes').send(transacaoValida({ descricao: 'Nov5', data: '2026-11-05' }));
    await api.post('/transacoes').send(transacaoValida({ descricao: 'Nov1', data: '2026-11-01' }));

    const res = await api.get('/transacoes');

    expect(res.status).toBe(200);
    expect(res.body.map((t: { descricao: string }) => t.descricao)).toEqual(['Nov5', 'Nov1', 'Out']);
  });

  it('consulta transação por id existente e retorna 404 para inexistente', async () => {
    const api = novaApi();
    const criada = await api.post('/transacoes').send(transacaoValida());

    const encontrada = await api.get(`/transacoes/${criada.body.id}`);
    expect(encontrada.status).toBe(200);
    expect(encontrada.body.id).toBe(criada.body.id);

    const inexistente = await api.get('/transacoes/id-inexistente');
    expect(inexistente.status).toBe(404);
  });

  it('filtra por tipo, categoria (case-insensitive) e mês de forma combinada', async () => {
    const api = novaApi();
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Salário', valor: 3000, tipo: 'receita', categoria: 'Salário', data: '2026-11-01' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Mercado Nov', valor: 200, tipo: 'despesa', categoria: 'Alimentação', data: '2026-11-05' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Mercado Out', valor: 180, tipo: 'despesa', categoria: 'Alimentação', data: '2026-10-10' }));

    const porMes = await api.get('/transacoes?mes=2026-11');
    expect(porMes.body).toHaveLength(2);

    const combinado = await api.get('/transacoes?tipo=despesa&categoria=alimentação&mes=2026-11');
    expect(combinado.body).toHaveLength(1);
    expect(combinado.body[0].descricao).toBe('Mercado Nov');
  });

  it('rejeita filtros inválidos com 400', async () => {
    const api = novaApi();

    const mesInvalido = await api.get('/transacoes?mes=2026-13');
    expect(mesInvalido.status).toBe(400);

    const tipoInvalido = await api.get('/transacoes?tipo=outro');
    expect(tipoInvalido.status).toBe(400);

    const catVazia = await api.get('/transacoes?categoria=%20%20');
    expect(catVazia.status).toBe(400);
  });
});

import { novaApi, transacaoValida } from '../helpers';

describe('GET /resumo (US08 / US09)', () => {
  it('retorna zeros quando não há transações', async () => {
    const res = await novaApi().get('/resumo');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalReceitas: 0,
      totalDespesas: 0,
      saldo: 0,
      quantidadeTransacoes: 0,
      porCategoria: [],
    });
  });

  it('calcula saldo geral com receitas e despesas', async () => {
    const api = novaApi();
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Salário', valor: 5000, tipo: 'receita', categoria: 'Salário', data: '2026-10-05' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Aluguel', valor: 3000, tipo: 'despesa', categoria: 'Moradia', data: '2026-11-05' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Mercado', valor: 250.4, tipo: 'despesa', categoria: 'Alimentação', data: '2026-11-06' }));

    const res = await api.get('/resumo');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      totalReceitas: 5000,
      totalDespesas: 3250.4,
      saldo: 1749.6,
      quantidadeTransacoes: 3,
    });
  });

  it('filtra resumo por mês e agrupa por categoria', async () => {
    const api = novaApi();
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Salário', valor: 3000, tipo: 'receita', categoria: 'Salário', data: '2026-11-01' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Aluguel', valor: 1000, tipo: 'despesa', categoria: 'Moradia', data: '2026-11-05' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Mercado', valor: 200.5, tipo: 'despesa', categoria: 'Alimentação', data: '2026-11-06' }));
    await api
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'Outubro', valor: 99.9, tipo: 'despesa', categoria: 'Lazer', data: '2026-10-15' }));

    const res = await api.get('/resumo?mes=2026-11');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      mes: '2026-11',
      totalReceitas: 3000,
      totalDespesas: 1200.5,
      saldo: 1799.5,
      quantidadeTransacoes: 3,
      porCategoria: [
        { categoria: 'Salário', tipo: 'receita', total: 3000, quantidade: 1 },
        { categoria: 'Moradia', tipo: 'despesa', total: 1000, quantidade: 1 },
        { categoria: 'Alimentação', tipo: 'despesa', total: 200.5, quantidade: 1 },
      ],
    });
  });

  it('soma centavos com precisão (0.1 + 0.2 === 0.3)', async () => {
    const api = novaApi();
    await api.post('/transacoes').send(transacaoValida({ valor: 0.1, data: '2026-11-01' }));
    await api.post('/transacoes').send(transacaoValida({ valor: 0.2, data: '2026-11-02' }));

    const res = await api.get('/resumo?mes=2026-11');

    expect(res.body.totalDespesas).toBe(0.3);
    expect(res.body.saldo).toBe(-0.3);
  });

  it('retorna 400 para mês em formato inválido', async () => {
    const res = await novaApi().get('/resumo?mes=11-2026');

    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('Filtro inválido.');
  });
});

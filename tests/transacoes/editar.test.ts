import { novaApi, transacaoValida } from '../helpers';

describe('PUT /transacoes/:id (US04)', () => {
  it('atualiza uma transação preservando id e criadoEm', async () => {
    const api = novaApi();
    const criada = await api.post('/transacoes').send(transacaoValida({ valor: 150.75 }));

    const atualizada = await api
      .put(`/transacoes/${criada.body.id}`)
      .send(transacaoValida({ descricao: 'Supermercado', valor: 180 }));

    expect(atualizada.status).toBe(200);
    expect(atualizada.body).toMatchObject({
      id: criada.body.id,
      descricao: 'Supermercado',
      valor: 180,
      criadoEm: criada.body.criadoEm,
    });
    expect(atualizada.body.atualizadoEm >= criada.body.criadoEm).toBe(true);
  });

  it('retorna 404 para transação inexistente', async () => {
    const res = await novaApi().put('/transacoes/nao-existe').send(transacaoValida());

    expect(res.status).toBe(404);
  });

  it('retorna 400 para dados inválidos e mantém a transação original', async () => {
    const api = novaApi();
    const criada = await api.post('/transacoes').send(transacaoValida({ valor: 150.75 }));

    const invalida = await api
      .put(`/transacoes/${criada.body.id}`)
      .send(transacaoValida({ tipo: 'investimento' }));

    expect(invalida.status).toBe(400);

    const consultada = await api.get(`/transacoes/${criada.body.id}`);
    expect(consultada.body.valor).toBe(150.75);
  });
});

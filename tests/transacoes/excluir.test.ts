import { novaApi, transacaoValida } from '../helpers';

describe('DELETE /transacoes/:id (US05)', () => {
  it('exclui uma transação existente e retorna 204', async () => {
    const api = novaApi();
    const criada = await api.post('/transacoes').send(transacaoValida());

    const del = await api.delete(`/transacoes/${criada.body.id}`);
    expect(del.status).toBe(204);

    const busca = await api.get(`/transacoes/${criada.body.id}`);
    expect(busca.status).toBe(404);
  });

  it('retorna 404 ao tentar excluir transação inexistente', async () => {
    const res = await novaApi().delete('/transacoes/nao-existe');

    expect(res.status).toBe(404);
  });
});

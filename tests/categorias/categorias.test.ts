import { CATEGORIAS_PADRAO } from '../../src/models/categoria';
import { novaApi, transacaoValida } from '../helpers';

describe('Categorias (US06 / US07)', () => {
  it('inicia com as categorias padrão em ordem alfabética', async () => {
    const res = await novaApi().get('/categorias');

    expect(res.status).toBe(200);
    expect(res.body.map((c: { nome: string }) => c.nome)).toEqual([...CATEGORIAS_PADRAO]);
  });

  it('cadastra uma nova categoria e retorna 201', async () => {
    const api = novaApi();
    const criada = await api.post('/categorias').send({ nome: '  Pets  ' });

    expect(criada.status).toBe(201);
    expect(criada.body.nome).toBe('Pets');

    const lista = await api.get('/categorias');
    expect(lista.body.map((c: { nome: string }) => c.nome)).toContain('Pets');
  });

  it('rejeita categoria duplicada (case-insensitive) com 409', async () => {
    const res = await novaApi().post('/categorias').send({ nome: ' lazer ' });

    expect(res.status).toBe(409);
  });

  it.each([{}, { nome: '   ' }, { nome: 'a'.repeat(51) }, []])(
    'rejeita corpo inválido %p com 400',
    async (payload) => {
      const res = await novaApi().post('/categorias').send(payload as object);

      expect(res.status).toBe(400);
    },
  );

  it('exclui categoria sem uso e retorna 204', async () => {
    const api = novaApi();
    const criada = await api.post('/categorias').send({ nome: 'Pets' });

    const del = await api.delete(`/categorias/${criada.body.id}`);
    expect(del.status).toBe(204);
  });

  it('impede exclusão de categoria em uso por transações (409)', async () => {
    const api = novaApi();
    await api.post('/transacoes').send(transacaoValida({ categoria: 'Alimentação' }));

    const lista = await api.get('/categorias');
    const alimentacao = lista.body.find((c: { nome: string }) => c.nome === 'Alimentação');

    const del = await api.delete(`/categorias/${alimentacao.id}`);
    expect(del.status).toBe(409);
  });

  it('retorna 404 ao tentar excluir categoria inexistente', async () => {
    const res = await novaApi().delete('/categorias/id-inexistente');

    expect(res.status).toBe(404);
  });

  it('rejeita transação com categoria não cadastrada e normaliza nome canônico', async () => {
    const api = novaApi();

    const invalida = await api
      .post('/transacoes')
      .send(transacaoValida({ categoria: 'Viagem Espacial' }));
    expect(invalida.status).toBe(400);

    const normalizada = await api
      .post('/transacoes')
      .send(transacaoValida({ categoria: 'alimentação' }));
    expect(normalizada.status).toBe(201);
    expect(normalizada.body.categoria).toBe('Alimentação');
  });
});

import { novaApi, transacaoValida } from '../helpers';

describe('POST /transacoes (US01)', () => {
  it('cadastra uma despesa válida e retorna 201', async () => {
    const res = await novaApi().post('/transacoes').send(transacaoValida());

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(transacaoValida());
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.criadoEm).toEqual(expect.any(String));
    expect(res.body.atualizadoEm).toBe(res.body.criadoEm);
  });

  it('gera ids únicos', async () => {
    const api = novaApi();
    const a = await api.post('/transacoes').send(transacaoValida());
    const b = await api.post('/transacoes').send(transacaoValida());

    expect(a.body.id).not.toBe(b.body.id);
  });

  it('remove espaços extras de descrição e categoria', async () => {
    const res = await novaApi()
      .post('/transacoes')
      .send(transacaoValida({ descricao: '  Mercado  ', categoria: ' Alimentação ' }));

    expect(res.status).toBe(201);
    expect(res.body.descricao).toBe('Mercado');
    expect(res.body.categoria).toBe('Alimentação');
  });

  it.each([0, -10, '150', null])('rejeita valor inválido %p', async (valor) => {
    const res = await novaApi().post('/transacoes').send(transacaoValida({ valor }));

    expect(res.status).toBe(400);
    expect(res.body.detalhes).toContain('valor deve ser um número maior que zero.');
  });

  it('rejeita valor com mais de 2 casas decimais', async () => {
    const res = await novaApi().post('/transacoes').send(transacaoValida({ valor: 10.999 }));

    expect(res.status).toBe(400);
    expect(res.body.detalhes).toContain('valor deve ter no máximo 2 casas decimais.');
  });

  it('rejeita valor acima do limite', async () => {
    const res = await novaApi().post('/transacoes').send(transacaoValida({ valor: 1_000_000_001 }));

    expect(res.status).toBe(400);
  });

  it('rejeita data inexistente', async () => {
    const res = await novaApi().post('/transacoes').send(transacaoValida({ data: '2026-02-30' }));

    expect(res.status).toBe(400);
    expect(res.body.detalhes).toContain('data deve ser uma data válida no formato AAAA-MM-DD.');
  });

  it('rejeita tipo inválido', async () => {
    const res = await novaApi().post('/transacoes').send(transacaoValida({ tipo: 'investimento' }));

    expect(res.status).toBe(400);
    expect(res.body.detalhes).toContain("tipo deve ser 'receita' ou 'despesa'.");
  });

  it('lista todos os problemas de uma vez', async () => {
    const res = await novaApi().post('/transacoes').send({});

    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('Dados inválidos.');
    expect(res.body.detalhes).toHaveLength(5);
  });

  it('rejeita corpo que não é objeto', async () => {
    const res = await novaApi().post('/transacoes').send([transacaoValida()]);

    expect(res.status).toBe(400);
    expect(res.body.detalhes).toEqual(['O corpo da requisição deve ser um objeto JSON.']);
  });

  it('rejeita descrição maior que 100 caracteres', async () => {
    const res = await novaApi()
      .post('/transacoes')
      .send(transacaoValida({ descricao: 'a'.repeat(101) }));

    expect(res.status).toBe(400);
  });
});

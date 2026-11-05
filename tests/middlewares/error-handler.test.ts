import express from 'express';
import request from 'supertest';
import { createApp } from '../../src/app';
import { ConflictError, NotFoundError, ValidationError } from '../../src/errors/app-error';
import { errorHandler, notFoundHandler } from '../../src/middlewares/error-handler';

/** App mínimo que lança erros sob demanda para testar o middleware isoladamente. */
function appQueLanca(erro: unknown) {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.post('/eco', (req, res) => {
    res.json(req.body);
  });
  app.get('/falha', () => {
    throw erro;
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

describe('errorHandler', () => {
  it('converte ValidationError em 400 com detalhes', async () => {
    const res = await request(appQueLanca(new ValidationError(['campo x inválido.']))).get('/falha');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: 'Dados inválidos.', detalhes: ['campo x inválido.'] });
  });

  it('converte NotFoundError em 404 sem detalhes', async () => {
    const res = await request(appQueLanca(new NotFoundError('Transação'))).get('/falha');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: 'Transação não encontrado(a).' });
  });

  it('converte ConflictError em 409', async () => {
    const res = await request(appQueLanca(new ConflictError('Já existe.'))).get('/falha');

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ erro: 'Já existe.' });
  });

  it('retorna 500 genérico para erros inesperados, sem stack trace', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const res = await request(appQueLanca(new Error('segredo interno'))).get('/falha');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ erro: 'Erro interno do servidor.' });
    expect(JSON.stringify(res.body)).not.toContain('segredo');
    spy.mockRestore();
  });

  it('retorna 400 para JSON malformado', async () => {
    const res = await request(appQueLanca(null))
      .post('/eco')
      .set('Content-Type', 'application/json')
      .send('{"descricao": ');

    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('JSON malformado no corpo da requisição.');
  });

  it('retorna 413 para corpo acima de 100kb', async () => {
    const grande = { texto: 'x'.repeat(110 * 1024) };

    const res = await request(appQueLanca(null)).post('/eco').send(grande);

    expect(res.status).toBe(413);
  });
});

describe('notFoundHandler', () => {
  it('retorna 404 em português para rotas inexistentes', async () => {
    const res = await request(createApp()).get('/nao-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: 'Rota GET /nao-existe não encontrada.' });
  });
});

import express from 'express';

/**
 * Cria e configura a aplicação Express.
 * Separada do `server.ts` para permitir testes com Supertest sem abrir porta.
 */
export function createApp() {
  const app = express();

  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

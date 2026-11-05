import express from 'express';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';

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

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

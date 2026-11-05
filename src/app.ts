import path from 'node:path';
import express from 'express';
import { JsonDatabase } from './database/json-database';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { Transacao } from './models/transacao';
import { transacoesRouter } from './routes/transacoes.routes';
import { TransacaoService } from './services/transacao.service';

export interface AppOptions {
  database?: JsonDatabase;
}

const DEFAULT_DATA_FILE = path.resolve(process.cwd(), process.env.DATA_FILE ?? 'data/db.json');

/**
 * Cria e configura a aplicação Express.
 * Separada do `server.ts` para permitir testes com Supertest sem abrir porta.
 */
export function createApp(options: AppOptions = {}) {
  const db = options.database ?? new JsonDatabase(DEFAULT_DATA_FILE);
  const transacaoService = new TransacaoService(db.getCollection<Transacao>('transacoes'));

  const app = express();

  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/transacoes', transacoesRouter(transacaoService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

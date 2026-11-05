import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../errors/app-error';

/** Formato padrão de erro da API (RNF04). */
export interface ErrorBody {
  erro: string;
  detalhes?: string[];
}

interface BodyParserError {
  type?: string;
}

/** Responde 404 para qualquer rota não mapeada. */
export const notFoundHandler: RequestHandler = (req, res) => {
  const body: ErrorBody = { erro: `Rota ${req.method} ${req.originalUrl} não encontrada.` };
  res.status(404).json(body);
};

/**
 * Converte exceções em respostas JSON padronizadas.
 * Erros inesperados retornam 500 sem expor detalhes internos (RNF07).
 */
export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: ErrorBody = { erro: err.message };
    if (err.detalhes.length > 0) body.detalhes = err.detalhes;
    res.status(err.statusCode).json(body);
    return;
  }

  const tipo = (err as BodyParserError | null)?.type;
  if (tipo === 'entity.parse.failed') {
    res.status(400).json({ erro: 'JSON malformado no corpo da requisição.' } satisfies ErrorBody);
    return;
  }
  if (tipo === 'entity.too.large') {
    res.status(413).json({ erro: 'Corpo da requisição excede o limite de 100kb.' } satisfies ErrorBody);
    return;
  }

  console.error('[erro inesperado]', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' } satisfies ErrorBody);
};

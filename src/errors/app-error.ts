/**
 * Erro de aplicação com status HTTP associado.
 * Lançado pelos serviços e convertido em resposta JSON pelo `errorHandler`.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly detalhes: string[] = [],
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** 400 — dados de entrada inválidos (RF12). */
export class ValidationError extends AppError {
  constructor(detalhes: string[], mensagem = 'Dados inválidos.') {
    super(400, mensagem, detalhes);
  }
}

/** 404 — recurso não encontrado. */
export class NotFoundError extends AppError {
  constructor(recurso: string) {
    super(404, `${recurso} não encontrado(a).`);
  }
}

/** 409 — conflito com o estado atual (ex.: duplicidade, recurso em uso). */
export class ConflictError extends AppError {
  constructor(mensagem: string) {
    super(409, mensagem);
  }
}

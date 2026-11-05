import { randomUUID } from 'node:crypto';
import { Collection } from '../database/json-database';
import { Transacao } from '../models/transacao';
import { validarDadosTransacao } from '../validation/transacao.validator';

/** Regras de negócio de transações. */
export class TransacaoService {
  constructor(private readonly transacoes: Collection<Transacao>) {}

  /** RF01 — cadastra uma nova transação. */
  criar(body: unknown): Transacao {
    const dados = validarDadosTransacao(body);
    const agora = new Date().toISOString();

    return this.transacoes.insert({
      id: randomUUID(),
      ...dados,
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }
}

import { randomUUID } from 'node:crypto';
import { Collection } from '../database/json-database';
import { NotFoundError } from '../errors/app-error';
import { Transacao } from '../models/transacao';
import { FiltrosTransacao, validarDadosTransacao, validarFiltros } from '../validation/transacao.validator';

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

  /** RF02/RF03 — lista transações (mais recentes primeiro), com filtros opcionais combináveis. */
  listar(query: unknown = {}): Transacao[] {
    const filtros = validarFiltros(query);
    return this.filtrar(filtros).sort(compararPorDataDesc);
  }

  /** RF04 — consulta uma transação pelo id. */
  buscarPorId(id: string): Transacao {
    const transacao = this.transacoes.findById(id);
    if (!transacao) throw new NotFoundError('Transação');
    return transacao;
  }

  private filtrar({ tipo, categoria, mes }: FiltrosTransacao): Transacao[] {
    const categoriaAlvo = categoria?.toLocaleLowerCase('pt-BR');

    return this.transacoes
      .findAll()
      .filter((t) => !tipo || t.tipo === tipo)
      .filter((t) => !categoriaAlvo || t.categoria.toLocaleLowerCase('pt-BR') === categoriaAlvo)
      .filter((t) => !mes || t.data.startsWith(`${mes}-`));
  }
}

function compararPorDataDesc(a: Transacao, b: Transacao): number {
  return b.data.localeCompare(a.data) || b.criadoEm.localeCompare(a.criadoEm);
}

import { randomUUID } from 'node:crypto';
import { Collection } from '../database/json-database';
import { NotFoundError, ValidationError } from '../errors/app-error';
import { DadosTransacao, Transacao } from '../models/transacao';
import { FiltrosTransacao, validarDadosTransacao, validarFiltros } from '../validation/transacao.validator';
import { CategoriaService } from './categoria.service';

/** Regras de negócio de transações. */
export class TransacaoService {
  constructor(
    private readonly transacoes: Collection<Transacao>,
    private readonly categorias: CategoriaService,
  ) {}

  /** RF01 — cadastra uma nova transação. */
  criar(body: unknown): Transacao {
    const dados = this.validar(body);
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

  /** RF05 — substitui os dados de uma transação, preservando id e criadoEm. */
  atualizar(id: string, body: unknown): Transacao {
    const atual = this.buscarPorId(id);
    const dados = this.validar(body);

    return this.transacoes.update(id, {
      ...atual,
      ...dados,
      atualizadoEm: new Date().toISOString(),
    })!;
  }

  /** RF06 — exclui uma transação. */
  excluir(id: string): void {
    if (!this.transacoes.delete(id)) throw new NotFoundError('Transação');
  }

  /** Usado pela regra RN02 (categoria em uso não pode ser excluída). */
  existeComCategoria(nomeCategoria: string): boolean {
    const alvo = nomeCategoria.toLocaleLowerCase('pt-BR');
    return this.transacoes.findAll().some((t) => t.categoria.toLocaleLowerCase('pt-BR') === alvo);
  }

  /** Validação de formato + verificação de categoria cadastrada (usa o nome canônico). */
  private validar(body: unknown): DadosTransacao {
    const dados = validarDadosTransacao(body);
    const categoria = this.categorias.buscarPorNome(dados.categoria);
    if (!categoria) {
      throw new ValidationError([
        `categoria '${dados.categoria}' não está cadastrada. Consulte GET /categorias.`,
      ]);
    }
    return { ...dados, categoria: categoria.nome };
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

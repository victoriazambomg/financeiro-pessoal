import { randomUUID } from 'node:crypto';
import { Collection } from '../database/json-database';
import { ConflictError, NotFoundError } from '../errors/app-error';
import { CATEGORIAS_PADRAO, Categoria } from '../models/categoria';
import { validarDadosCategoria } from '../validation/categoria.validator';

/** Função que informa se uma categoria está sendo usada por alguma transação (RN02). */
export type VerificadorDeUso = (nomeCategoria: string) => boolean;

const normalizar = (nome: string) => nome.trim().toLocaleLowerCase('pt-BR');

/** Regras de negócio de categorias. */
export class CategoriaService {
  constructor(
    private readonly categorias: Collection<Categoria>,
    private readonly estaEmUso: VerificadorDeUso = () => false,
  ) {}

  /** Cria as categorias padrão quando ainda não existe nenhuma (RF07). */
  garantirPadroes(): void {
    if (this.categorias.count() > 0) return;
    CATEGORIAS_PADRAO.forEach((nome) => this.inserir(nome));
  }

  /** RF07 — lista categorias em ordem alfabética. */
  listar(): Categoria[] {
    return this.categorias.findAll().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  /** Busca por nome sem diferenciar maiúsculas/minúsculas (RN03). */
  buscarPorNome(nome: string): Categoria | undefined {
    const alvo = normalizar(nome);
    return this.categorias.findAll().find((c) => normalizar(c.nome) === alvo);
  }

  /** RF08 — cadastra uma categoria com nome único. */
  criar(body: unknown): Categoria {
    const { nome } = validarDadosCategoria(body);
    const existente = this.buscarPorNome(nome);
    if (existente) {
      throw new ConflictError(`Já existe uma categoria chamada '${existente.nome}'.`);
    }
    return this.inserir(nome);
  }

  /** RF09 — exclui uma categoria que não esteja em uso (RN02). */
  excluir(id: string): void {
    const categoria = this.categorias.findById(id);
    if (!categoria) throw new NotFoundError('Categoria');

    if (this.estaEmUso(categoria.nome)) {
      throw new ConflictError(
        `A categoria '${categoria.nome}' está em uso por transações e não pode ser excluída.`,
      );
    }
    this.categorias.delete(id);
  }

  private inserir(nome: string): Categoria {
    return this.categorias.insert({ id: randomUUID(), nome, criadoEm: new Date().toISOString() });
  }
}

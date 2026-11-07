import fs from 'node:fs';
import path from 'node:path';

/** Toda entidade persistida precisa de um identificador único. */
export interface Entity {
  id: string;
}

/**
 * Contrato de repositório desacoplado do mecanismo de armazenamento (`[DATA-LOCK]`).
 * Permite substituir `Collection<T>` (JSON) por uma implementação SQLite sem alterar os serviços.
 */
export interface Repository<T extends Entity> {
  findAll(): T[];
  findById(id: string): T | undefined;
  insert(item: T): T;
  update(id: string, item: T): T | undefined;
  delete(id: string): boolean;
  count(): number;
}

type DatabaseState = Record<string, Entity[]>;

/**
 * Banco de dados baseado em arquivo JSON (RNF01) com controle de concorrência (`[DATA-LOCK]`).
 *
 * - Carrega o arquivo na inicialização e mantém o estado sincronizado em memória.
 * - Escrita atômica com arquivo temporário exclusivo por operação + rename.
 * - Fila/mutex de exclusão mútua (`runExclusive`) que serializa operações concorrentes
 *   (ex.: 20 requisições `POST /transacoes` simultâneas sem perda de registros).
 * - Sem `filePath`, opera somente em memória (útil para testes).
 */
export class JsonDatabase {
  private readonly state: DatabaseState;
  private writeQueue: Promise<void> = Promise.resolve();
  private writeSeq = 0;

  constructor(private readonly filePath?: string) {
    this.state = this.load();
  }

  /** Retorna uma coleção tipada que implementa `Repository<T>`. */
  getCollection<T extends Entity>(name: string): Collection<T> {
    return new Collection<T>(this, name);
  }

  /** Acesso interno à lista de itens de uma coleção. */
  read<T extends Entity>(name: string): T[] {
    if (!this.state[name]) {
      this.state[name] = [];
    }
    return this.state[name] as T[];
  }

  /**
   * Executa uma tarefa na fila de exclusão mútua (mutex), garantindo que
   * operações concorrentes sejam processadas em série sem condição de corrida.
   */
  runExclusive<R>(task: () => R | Promise<R>): Promise<R> {
    const next = this.writeQueue.then(() => task());
    this.writeQueue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  /** Persiste o estado atual no disco de forma atômica (no-op em modo memória). */
  save(): void {
    if (!this.filePath) return;

    this.writeSeq += 1;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tmpFile = `${this.filePath}.${process.pid}.${this.writeSeq}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(this.state, null, 2), 'utf-8');
    fs.renameSync(tmpFile, this.filePath);
  }

  private load(): DatabaseState {
    if (!this.filePath || !fs.existsSync(this.filePath)) return {};

    const raw = fs.readFileSync(this.filePath, 'utf-8');
    if (!raw.trim()) return {};

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`Arquivo de dados inválido: ${this.filePath}`);
    }
    return parsed as DatabaseState;
  }
}

/**
 * Coleção de entidades com operações CRUD que implementa `Repository<T>`.
 * Sempre retorna cópias para que alterações externas não modifiquem o estado sem `save()`.
 */
export class Collection<T extends Entity> implements Repository<T> {
  constructor(
    private readonly db: JsonDatabase,
    private readonly name: string,
  ) {}

  findAll(): T[] {
    return this.items().map((item) => ({ ...item }));
  }

  findById(id: string): T | undefined {
    const item = this.items().find((i) => i.id === id);
    return item ? { ...item } : undefined;
  }

  insert(item: T): T {
    this.items().push({ ...item });
    this.db.save();
    return { ...item };
  }

  /** Insere múltiplos registros em lote com uma única gravação em disco (útil para seeds). */
  insertMany(novos: T[]): number {
    const lista = this.items();
    for (const item of novos) {
      lista.push({ ...item });
    }
    this.db.save();
    return novos.length;
  }

  update(id: string, item: T): T | undefined {
    const items = this.items();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return undefined;

    items[index] = { ...item, id };
    this.db.save();
    return { ...items[index] };
  }

  delete(id: string): boolean {
    const items = this.items();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    items.splice(index, 1);
    this.db.save();
    return true;
  }

  count(): number {
    return this.items().length;
  }

  private items(): T[] {
    return this.db.read<T>(this.name);
  }
}

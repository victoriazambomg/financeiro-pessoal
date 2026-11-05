import fs from 'node:fs';
import path from 'node:path';

/** Toda entidade persistida precisa de um identificador único. */
export interface Entity {
  id: string;
}

type DatabaseState = Record<string, Entity[]>;

/**
 * Banco de dados simples baseado em arquivo JSON (RNF01).
 *
 * - Carrega o arquivo uma única vez na inicialização e mantém o estado em memória.
 * - Cada escrita é atômica: grava em um arquivo temporário e depois renomeia,
 *   evitando arquivos corrompidos caso o processo seja interrompido.
 * - Sem `filePath`, opera somente em memória (útil para testes).
 */
export class JsonDatabase {
  private readonly state: DatabaseState;

  constructor(private readonly filePath?: string) {
    this.state = this.load();
  }

  /** Retorna uma coleção tipada (equivalente a uma "tabela"). */
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

  /** Persiste o estado atual no disco (no-op em modo memória). */
  save(): void {
    if (!this.filePath) return;

    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tmpFile = `${this.filePath}.tmp`;
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
 * Coleção de entidades com operações CRUD.
 * Sempre retorna cópias para que alterações externas não modifiquem o estado sem `save()`.
 */
export class Collection<T extends Entity> {
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

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { JsonDatabase } from '../../src/database/json-database';

interface Item {
  id: string;
  nome: string;
}

describe('JsonDatabase (memória)', () => {
  let db: JsonDatabase;

  beforeEach(() => {
    db = new JsonDatabase();
  });

  it('inicia com coleção vazia', () => {
    expect(db.getCollection<Item>('itens').findAll()).toEqual([]);
  });

  it('insere e busca por id', () => {
    const itens = db.getCollection<Item>('itens');
    itens.insert({ id: '1', nome: 'A' });

    expect(itens.findById('1')).toEqual({ id: '1', nome: 'A' });
    expect(itens.findById('x')).toBeUndefined();
    expect(itens.count()).toBe(1);
  });

  it('atualiza preservando o id', () => {
    const itens = db.getCollection<Item>('itens');
    itens.insert({ id: '1', nome: 'A' });

    const atualizado = itens.update('1', { id: 'outro', nome: 'B' });

    expect(atualizado).toEqual({ id: '1', nome: 'B' });
    expect(itens.update('x', { id: 'x', nome: 'C' })).toBeUndefined();
  });

  it('remove itens', () => {
    const itens = db.getCollection<Item>('itens');
    itens.insert({ id: '1', nome: 'A' });

    expect(itens.delete('1')).toBe(true);
    expect(itens.delete('1')).toBe(false);
    expect(itens.findAll()).toEqual([]);
  });

  it('retorna cópias para proteger o estado interno', () => {
    const itens = db.getCollection<Item>('itens');
    itens.insert({ id: '1', nome: 'A' });

    const copia = itens.findById('1')!;
    copia.nome = 'alterado';
    itens.findAll()[0].nome = 'alterado';

    expect(itens.findById('1')!.nome).toBe('A');
  });
});

describe('JsonDatabase (arquivo)', () => {
  let dir: string;
  let file: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'financeiro-'));
    file = path.join(dir, 'sub', 'db.json');
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('cria o arquivo (e diretórios) ao gravar', () => {
    new JsonDatabase(file).getCollection<Item>('itens').insert({ id: '1', nome: 'A' });

    expect(fs.existsSync(file)).toBe(true);
    expect(fs.existsSync(`${file}.tmp`)).toBe(false);
  });

  it('mantém os dados após "reiniciar" a aplicação', () => {
    new JsonDatabase(file).getCollection<Item>('itens').insert({ id: '1', nome: 'A' });

    const reaberto = new JsonDatabase(file);

    expect(reaberto.getCollection<Item>('itens').findAll()).toEqual([{ id: '1', nome: 'A' }]);
  });

  it('trata arquivo vazio como banco vazio', () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '   ');

    expect(new JsonDatabase(file).getCollection<Item>('itens').findAll()).toEqual([]);
  });

  it('falha com mensagem clara se o arquivo não contém um objeto', () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '[]');

    expect(() => new JsonDatabase(file)).toThrow('Arquivo de dados inválido');
  });
});

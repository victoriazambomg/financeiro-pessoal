import request from 'supertest';
import { createApp } from '../src/app';
import { JsonDatabase } from '../src/database/json-database';

/** Cria uma aplicação isolada com banco em memória para cada teste. */
export function novaApi() {
  return request(createApp({ database: new JsonDatabase() }));
}

/** Payload válido de transação, com possibilidade de sobrescrever campos. */
export function transacaoValida(sobrescrever: Record<string, unknown> = {}) {
  return {
    descricao: 'Mercado',
    valor: 150.75,
    tipo: 'despesa',
    categoria: 'Alimentação',
    data: '2026-11-05',
    ...sobrescrever,
  };
}

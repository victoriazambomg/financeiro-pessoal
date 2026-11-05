import { ValidationError } from '../errors/app-error';
import { DadosTransacao, TIPOS_TRANSACAO, TipoTransacao } from '../models/transacao';
import { isDataValida, isObjeto, temNoMaximoDuasCasas, textoLimpo } from './common';

const VALOR_MAXIMO = 1_000_000_000;

/**
 * Valida o corpo de criação/edição de transação (RF12).
 * Acumula todos os problemas encontrados para devolvê-los de uma vez ao usuário.
 */
export function validarDadosTransacao(body: unknown): DadosTransacao {
  if (!isObjeto(body)) {
    throw new ValidationError(['O corpo da requisição deve ser um objeto JSON.']);
  }

  const erros: string[] = [];
  const descricao = textoLimpo(body.descricao);
  const categoria = textoLimpo(body.categoria);
  const { valor, tipo, data } = body;

  if (descricao.length < 1 || descricao.length > 100) {
    erros.push('descricao é obrigatória e deve ter entre 1 e 100 caracteres.');
  }

  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
    erros.push('valor deve ser um número maior que zero.');
  } else if (!temNoMaximoDuasCasas(valor)) {
    erros.push('valor deve ter no máximo 2 casas decimais.');
  } else if (valor > VALOR_MAXIMO) {
    erros.push('valor deve ser menor ou igual a 1.000.000.000.');
  }

  if (!TIPOS_TRANSACAO.includes(tipo as TipoTransacao)) {
    erros.push("tipo deve ser 'receita' ou 'despesa'.");
  }

  if (categoria.length < 1 || categoria.length > 50) {
    erros.push('categoria é obrigatória e deve ter entre 1 e 50 caracteres.');
  }

  if (!isDataValida(data)) {
    erros.push('data deve ser uma data válida no formato AAAA-MM-DD.');
  }

  if (erros.length > 0) throw new ValidationError(erros);

  return {
    descricao,
    valor: valor as number,
    tipo: tipo as TipoTransacao,
    categoria,
    data: data as string,
  };
}

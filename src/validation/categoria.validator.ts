import { ValidationError } from '../errors/app-error';
import { isObjeto, textoLimpo } from './common';

/** Valida o corpo de criação de categoria e retorna o nome normalizado (RF08). */
export function validarDadosCategoria(body: unknown): { nome: string } {
  if (!isObjeto(body)) {
    throw new ValidationError(['O corpo da requisição deve ser um objeto JSON.']);
  }

  const nome = textoLimpo(body.nome);
  if (nome.length < 1 || nome.length > 50) {
    throw new ValidationError(['nome é obrigatório e deve ter entre 1 e 50 caracteres.']);
  }

  return { nome };
}

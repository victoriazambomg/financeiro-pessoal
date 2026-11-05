const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Verifica se o valor é uma data real no formato AAAA-MM-DD (rejeita 2026-02-30, por exemplo). */
export function isDataValida(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !REGEX_DATA.test(valor)) return false;

  const [ano, mes, dia] = valor.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

/** Verifica se o valor é um mês no formato AAAA-MM (mês de 01 a 12). */
export function isMesValido(valor: unknown): valor is string {
  return typeof valor === 'string' && REGEX_MES.test(valor);
}

/** Verifica se o número possui no máximo duas casas decimais. */
export function temNoMaximoDuasCasas(valor: number): boolean {
  const centavos = valor * 100;
  return Math.abs(Math.round(centavos) - centavos) < 1e-6;
}

/** Garante que o corpo da requisição é um objeto JSON. */
export function isObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

/** Retorna a string sem espaços nas extremidades ou string vazia se não for texto. */
export function textoLimpo(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : '';
}

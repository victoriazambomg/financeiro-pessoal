/** Agrupador de transações (ex.: Alimentação, Moradia, Salário). */
export interface Categoria {
  id: string;
  /** Nome canônico e único (sem diferenciar maiúsculas/minúsculas — RN03). */
  nome: string;
  criadoEm: string;
}

/** Categorias criadas automaticamente na primeira execução (RF07). */
export const CATEGORIAS_PADRAO = [
  'Alimentação',
  'Educação',
  'Lazer',
  'Moradia',
  'Outros',
  'Salário',
  'Saúde',
  'Transporte',
] as const;

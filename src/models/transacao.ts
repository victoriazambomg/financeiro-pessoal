export const TIPOS_TRANSACAO = ['receita', 'despesa'] as const;

export type TipoTransacao = (typeof TIPOS_TRANSACAO)[number];

/** Movimentação financeira: receita (entrada) ou despesa (saída). */
export interface Transacao {
  id: string;
  descricao: string;
  /** Valor sempre positivo, em reais, com até 2 casas decimais (RN01). */
  valor: number;
  tipo: TipoTransacao;
  /** Nome canônico da categoria. */
  categoria: string;
  /** Data da movimentação no formato AAAA-MM-DD. */
  data: string;
  criadoEm: string;
  atualizadoEm: string;
}

/** Campos informados pelo usuário ao criar ou editar uma transação. */
export type DadosTransacao = Pick<Transacao, 'descricao' | 'valor' | 'tipo' | 'categoria' | 'data'>;

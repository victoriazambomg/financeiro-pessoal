import { TipoTransacao } from './transacao';

/** Totais agrupados por categoria e tipo (RF11). */
export interface ResumoCategoria {
  categoria: string;
  tipo: TipoTransacao;
  total: number;
  quantidade: number;
}

/** Resumo financeiro geral ou mensal (RF10 / RF11). */
export interface ResumoFinanceiro {
  mes?: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  quantidadeTransacoes: number;
  porCategoria: ResumoCategoria[];
}

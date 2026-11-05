import { ValidationError } from '../errors/app-error';
import { ResumoCategoria, ResumoFinanceiro } from '../models/resumo';
import { Transacao } from '../models/transacao';
import { isMesValido } from '../validation/common';
import { TransacaoService } from './transacao.service';

const paraCentavos = (reais: number): number => Math.round(reais * 100);
const paraReais = (centavos: number): number => Number((centavos / 100).toFixed(2));

/**
 * Calcula o saldo geral (RF10) e o resumo mensal por categoria (RF11).
 * Todas as somas são feitas em centavos inteiros para evitar erros de ponto flutuante (RNF08).
 */
export class ResumoService {
  constructor(private readonly transacoes: TransacaoService) {}

  gerar(mes?: unknown): ResumoFinanceiro {
    if (mes !== undefined && !isMesValido(mes)) {
      throw new ValidationError(['mes deve estar no formato AAAA-MM.'], 'Filtro inválido.');
    }

    const filtroMes = typeof mes === 'string' ? mes : undefined;
    const lista = this.transacoes.listar(filtroMes ? { mes: filtroMes } : {});

    let receitasCentavos = 0;
    let despesasCentavos = 0;

    for (const t of lista) {
      const c = paraCentavos(t.valor);
      if (t.tipo === 'receita') receitasCentavos += c;
      else despesasCentavos += c;
    }

    const resultado: ResumoFinanceiro = {
      totalReceitas: paraReais(receitasCentavos),
      totalDespesas: paraReais(despesasCentavos),
      saldo: paraReais(receitasCentavos - despesasCentavos),
      quantidadeTransacoes: lista.length,
      porCategoria: agruparPorCategoria(lista),
    };

    if (filtroMes) resultado.mes = filtroMes;
    return resultado;
  }
}

function agruparPorCategoria(transacoes: Transacao[]): ResumoCategoria[] {
  const mapa = new Map<string, { categoria: string; tipo: Transacao['tipo']; centavos: number; quantidade: number }>();

  for (const t of transacoes) {
    const chave = `${t.tipo}:${t.categoria}`;
    const item = mapa.get(chave) ?? { categoria: t.categoria, tipo: t.tipo, centavos: 0, quantidade: 0 };
    item.centavos += paraCentavos(t.valor);
    item.quantidade += 1;
    mapa.set(chave, item);
  }

  return Array.from(mapa.values())
    .map(({ categoria, tipo, centavos, quantidade }) => ({
      categoria,
      tipo,
      total: paraReais(centavos),
      quantidade,
    }))
    .sort((a, b) => b.total - a.total || a.categoria.localeCompare(b.categoria, 'pt-BR'));
}

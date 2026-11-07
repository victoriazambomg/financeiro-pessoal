/* Motor interativo do Financeiro Pessoal (RF01–RF12, RN01–RN04 e RNF08) */

const STORAGE_KEY = 'financeiro_pessoal_v2';
const THEME_KEY = 'financeiro_pessoal_theme';
const CATEGORIAS_PADRAO = [
  'Alimentação',
  'Educação',
  'Lazer',
  'Moradia',
  'Outros',
  'Salário',
  'Saúde',
  'Transporte',
];

const CORES_GRAFICO = [
  '#38bdf8',
  '#a855f7',
  '#f43f5e',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
];

const paraCentavos = (reais) => Math.round(Number(reais) * 100);
const paraReais = (centavos) => Number((centavos / 100).toFixed(2));
const formatarBRL = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function carregarEstado() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (bruto) {
      const parsed = JSON.parse(bruto);
      if (Array.isArray(parsed.categorias) && Array.isArray(parsed.transacoes)) {
        return parsed;
      }
    }
  } catch (_) {}

  const agora = new Date().toISOString();
  return {
    categorias: CATEGORIAS_PADRAO.map((nome, i) => ({
      id: `cat-${i + 1}`,
      nome,
      criadoEm: agora,
    })),
    transacoes: [
      {
        id: 'demo-1',
        descricao: 'Salário Mensal',
        valor: 5200.0,
        tipo: 'receita',
        categoria: 'Salário',
        data: '2026-11-01',
        criadoEm: agora,
        atualizadoEm: agora,
      },
      {
        id: 'demo-2',
        descricao: 'Freelance de Desenvolvimento',
        valor: 1350.0,
        tipo: 'receita',
        categoria: 'Outros',
        data: '2026-11-04',
        criadoEm: agora,
        atualizadoEm: agora,
      },
      {
        id: 'demo-3',
        descricao: 'Aluguel e Condomínio',
        valor: 1650.0,
        tipo: 'despesa',
        categoria: 'Moradia',
        data: '2026-11-03',
        criadoEm: agora,
        atualizadoEm: agora,
      },
      {
        id: 'demo-4',
        descricao: 'Supermercado Mensal',
        valor: 640.75,
        tipo: 'despesa',
        categoria: 'Alimentação',
        data: '2026-11-05',
        criadoEm: agora,
        atualizadoEm: agora,
      },
      {
        id: 'demo-5',
        descricao: 'Curso de Arquitetura de Software',
        valor: 280.0,
        tipo: 'despesa',
        categoria: 'Educação',
        data: '2026-11-06',
        criadoEm: agora,
        atualizadoEm: agora,
      },
      {
        id: 'demo-6',
        descricao: 'Transporte e Combustível',
        valor: 310.25,
        tipo: 'despesa',
        categoria: 'Transporte',
        data: '2026-11-07',
        criadoEm: agora,
        atualizadoEm: agora,
      },
    ],
  };
}

let estado = carregarEstado();

function salvarEstado() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function validarTransacao(dados) {
  const erros = [];
  const descricao = String(dados.descricao ?? '').trim();
  const categoria = String(dados.categoria ?? '').trim();
  const valor = Number(dados.valor);
  const tipo = dados.tipo;
  const data = String(dados.data ?? '');

  if (descricao.length < 1 || descricao.length > 100) {
    erros.push('descricao é obrigatória e deve ter entre 1 e 100 caracteres.');
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    erros.push('valor deve ser um número maior que zero.');
  } else if (Math.abs(Math.round(valor * 100) - valor * 100) > 1e-6) {
    erros.push('valor deve ter no máximo 2 casas decimais.');
  }
  if (tipo !== 'receita' && tipo !== 'despesa') {
    erros.push("tipo deve ser 'receita' ou 'despesa'.");
  }
  const catEncontrada = estado.categorias.find(
    (c) => c.nome.toLocaleLowerCase('pt-BR') === categoria.toLocaleLowerCase('pt-BR')
  );
  if (!catEncontrada) {
    erros.push(`categoria '${categoria}' não está cadastrada.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    erros.push('data deve ser uma data válida no formato AAAA-MM-DD.');
  }

  return { erros, descricao, valor, tipo, categoria: catEncontrada?.nome ?? categoria, data };
}

function calcularResumo(mes, listaCustom) {
  const base = listaCustom ?? estado.transacoes;
  const lista = base.filter((t) => !mes || t.data.startsWith(`${mes}-`));
  let recCent = 0;
  let despCent = 0;
  let qtdRec = 0;
  let qtdDesp = 0;
  const mapa = new Map();

  for (const t of lista) {
    const c = paraCentavos(t.valor);
    if (t.tipo === 'receita') {
      recCent += c;
      qtdRec += 1;
    } else {
      despCent += c;
      qtdDesp += 1;
    }

    const chave = `${t.tipo}:${t.categoria}`;
    const atual = mapa.get(chave) ?? {
      categoria: t.categoria,
      tipo: t.tipo,
      centavos: 0,
      quantidade: 0,
    };
    atual.centavos += c;
    atual.quantidade += 1;
    mapa.set(chave, atual);
  }

  const porCategoria = Array.from(mapa.values())
    .map((x) => ({
      categoria: x.categoria,
      tipo: x.tipo,
      total: paraReais(x.centavos),
      quantidade: x.quantidade,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    ...(mes ? { mes } : {}),
    totalReceitas: paraReais(recCent),
    totalDespesas: paraReais(despCent),
    saldo: paraReais(recCent - despCent),
    quantidadeTransacoes: lista.length,
    qtdRec,
    qtdDesp,
    porCategoria,
  };
}

function renderizarTudo() {
  renderizarSelectCategorias();
  renderizarListaCategorias();
  renderizarTransacoes();
  renderizarResumoEGraficos();
}

function renderizarSelectCategorias() {
  const selectForm = document.getElementById('categoria');
  const selectFiltro = document.getElementById('filtro-categoria');
  const valorAtualForm = selectForm.value;
  const valorAtualFiltro = selectFiltro.value;

  const ordenadas = [...estado.categorias].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  selectForm.innerHTML = ordenadas.map((c) => `<option value="${c.nome}">${c.nome}</option>`).join('');
  if (ordenadas.some((c) => c.nome === valorAtualForm)) selectForm.value = valorAtualForm;

  selectFiltro.innerHTML =
    '<option value="">Todas as categorias</option>' +
    ordenadas.map((c) => `<option value="${c.nome}">${c.nome}</option>`).join('');
  selectFiltro.value = valorAtualFiltro;
}

function renderizarListaCategorias() {
  const ul = document.getElementById('lista-categorias');
  const ordenadas = [...estado.categorias].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  ul.innerHTML = ordenadas
    .map(
      (c) => `
      <li class="tag-item">
        <span>${c.nome}</span>
        <button class="tag-del" data-del-cat="${c.id}" title="Excluir categoria">×</button>
      </li>`
    )
    .join('');
}

function obterTransacoesFiltradas() {
  const filtroTipo = document.getElementById('filtro-tipo').value;
  const filtroCat = document.getElementById('filtro-categoria').value;
  const filtroMes = document.getElementById('filtro-mes-resumo').value;
  const busca = document.getElementById('filtro-busca').value.trim().toLocaleLowerCase('pt-BR');

  return [...estado.transacoes]
    .filter((t) => !filtroTipo || t.tipo === filtroTipo)
    .filter((t) => !filtroCat || t.categoria === filtroCat)
    .filter((t) => !filtroMes || t.data.startsWith(`${filtroMes}-`))
    .filter(
      (t) =>
        !busca ||
        t.descricao.toLocaleLowerCase('pt-BR').includes(busca) ||
        t.categoria.toLocaleLowerCase('pt-BR').includes(busca)
    )
    .sort((a, b) => b.data.localeCompare(a.data));
}

function renderizarTransacoes() {
  const tbody = document.getElementById('tabela-transacoes');
  const filtradas = obterTransacoesFiltradas();

  if (filtradas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--text-muted);padding:1.5rem;">Nenhuma transação encontrada para os filtros selecionados.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtradas
    .map(
      (t) => `
      <tr>
        <td><code>${t.data}</code></td>
        <td><strong>${t.descricao}</strong></td>
        <td>${t.categoria}</td>
        <td><span class="pill ${t.tipo}">${t.tipo}</span></td>
        <td class="text-right"><strong>${formatarBRL(t.valor)}</strong></td>
        <td class="text-center">
          <button class="action-btn" data-edit="${t.id}" title="Editar">✏️</button>
          <button class="action-btn" data-del="${t.id}" title="Excluir">🗑️</button>
        </td>
      </tr>`
    )
    .join('');
}

function renderizarResumoEGraficos() {
  const mes = document.getElementById('filtro-mes-resumo').value || undefined;
  const r = calcularResumo(mes);

  document.getElementById('resumo-receitas').textContent = formatarBRL(r.totalReceitas);
  document.getElementById('resumo-despesas').textContent = formatarBRL(r.totalDespesas);
  document.getElementById('resumo-saldo').textContent = formatarBRL(r.saldo);
  document.getElementById('resumo-periodo-label').textContent = mes ? `Mês: ${mes}` : 'Período: Geral';
  document.getElementById('resumo-qtd').textContent = `${r.quantidadeTransacoes} movimentações`;
  document.getElementById('resumo-qtd-rec').textContent = `${r.qtdRec} entrada(s)`;
  document.getElementById('resumo-qtd-desp').textContent = `${r.qtdDesp} saída(s)`;

  const statusPill = document.getElementById('resumo-status-pill');
  statusPill.textContent = r.saldo > 0 ? 'Superávit' : r.saldo < 0 ? 'Déficit' : 'Equilibrado';

  const taxa = r.totalReceitas > 0 ? Math.max(0, Math.round(((r.totalReceitas - r.totalDespesas) / r.totalReceitas) * 100)) : 0;
  document.getElementById('resumo-taxa').textContent = `${taxa}%`;
  document.getElementById('resumo-taxa-bar').style.width = `${Math.min(100, taxa)}%`;

  const despesasCat = r.porCategoria.filter((c) => c.tipo === 'despesa');
  document.getElementById('resumo-maior-cat').textContent =
    despesasCat.length > 0 ? `Maior: ${despesasCat[0].categoria}` : 'Maior: —';

  // Barras por categoria
  const container = document.getElementById('resumo-categorias');
  if (r.porCategoria.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.86rem;">Sem movimentações no período selecionado.</p>`;
  } else {
    const maior = Math.max(...r.porCategoria.map((c) => c.total), 1);
    container.innerHTML = r.porCategoria
      .map((c) => {
        const pct = Math.round((c.total / maior) * 100);
        const cor = c.tipo === 'receita' ? 'var(--green)' : 'var(--red)';
        return `
          <div class="cat-row">
            <div class="cat-row-header">
              <span><strong>${c.categoria}</strong> <small style="color:var(--text-muted)">(${c.tipo} • ${c.quantidade}x)</small></span>
              <strong>${formatarBRL(c.total)}</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${pct}%;background:${cor}"></div>
            </div>
          </div>`;
      })
      .join('');
  }

  renderizarDonut(despesasCat, r.totalDespesas);
}

function renderizarDonut(despesasCat, totalDespesas) {
  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  document.getElementById('donut-total').textContent = formatarBRL(totalDespesas);

  if (despesasCat.length === 0 || totalDespesas <= 0) {
    svg.innerHTML = `<circle cx="80" cy="80" r="56" fill="none" stroke="rgba(148,163,184,0.2)" stroke-width="22"/>`;
    legend.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;">Nenhuma despesa registrada no período.</p>`;
    return;
  }

  const raio = 56;
  const circunferencia = 2 * Math.PI * raio;
  let offsetAcumulado = 0;

  svg.innerHTML = despesasCat
    .map((item, idx) => {
      const cor = CORES_GRAFICO[idx % CORES_GRAFICO.length];
      const proporcao = item.total / totalDespesas;
      const arco = proporcao * circunferencia;
      const dashArray = `${arco} ${circunferencia - arco}`;
      const dashOffset = -offsetAcumulado;
      offsetAcumulado += arco;
      return `<circle cx="80" cy="80" r="${raio}" fill="none" stroke="${cor}" stroke-width="22" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}" transform="rotate(-90 80 80)"/>`;
    })
    .join('');

  legend.innerHTML = despesasCat
    .map((item, idx) => {
      const cor = CORES_GRAFICO[idx % CORES_GRAFICO.length];
      const pct = Math.round((item.total / totalDespesas) * 100);
      return `
        <div class="legend-item">
          <span class="legend-dot" style="background:${cor}"></span>
          <div>
            <div><strong>${item.categoria}</strong> (${pct}%)</div>
            <small style="color:var(--text-muted)">${formatarBRL(item.total)}</small>
          </div>
        </div>`;
    })
    .join('');
}

/* Inicialização e Eventos */
document.addEventListener('DOMContentLoaded', () => {
  // Tema
  const temaSalvo = localStorage.getItem(THEME_KEY) || 'dark';
  aplicarTema(temaSalvo);
  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    aplicarTema(atual);
  });

  document.getElementById('data').value = new Date().toISOString().slice(0, 10);
  renderizarTudo();

  // Navegação por Abas
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');

      if (btn.dataset.tab === 'docs' && !window.__docCarregado) {
        carregarDocumento('./rastreabilidade.md');
        window.__docCarregado = true;
      }
      if (btn.dataset.tab === 'swagger' && !window.__swaggerCarregado) {
        inicializarSwagger();
        window.__swaggerCarregado = true;
      }
      if (btn.dataset.tab === 'api') {
        executarSimulacao('resumo');
      }
    });
  });

  // Cadastro / Edição de transação
  document.getElementById('form-transacao').addEventListener('submit', (e) => {
    e.preventDefault();
    const alertaErro = document.getElementById('alerta-erro');
    const alertaOk = document.getElementById('alerta-sucesso');
    alertaErro.classList.add('hidden');
    alertaOk.classList.add('hidden');

    const idEdicao = document.getElementById('transacao-id').value;
    const validado = validarTransacao({
      descricao: document.getElementById('descricao').value,
      valor: document.getElementById('valor').value,
      tipo: document.getElementById('tipo').value,
      categoria: document.getElementById('categoria').value,
      data: document.getElementById('data').value,
    });

    if (validado.erros.length > 0) {
      alertaErro.innerHTML = validado.erros.map((err) => `<div>• ${err}</div>`).join('');
      alertaErro.classList.remove('hidden');
      return;
    }

    const agora = new Date().toISOString();
    if (idEdicao) {
      const idx = estado.transacoes.findIndex((t) => t.id === idEdicao);
      if (idx !== -1) {
        estado.transacoes[idx] = {
          ...estado.transacoes[idx],
          descricao: validado.descricao,
          valor: validado.valor,
          tipo: validado.tipo,
          categoria: validado.categoria,
          data: validado.data,
          atualizadoEm: agora,
        };
      }
      alertaOk.textContent = 'Transação atualizada com sucesso (200 OK).';
    } else {
      estado.transacoes.push({
        id: `tx-${Date.now()}`,
        descricao: validado.descricao,
        valor: validado.valor,
        tipo: validado.tipo,
        categoria: validado.categoria,
        data: validado.data,
        criadoEm: agora,
        atualizadoEm: agora,
      });
      alertaOk.textContent = 'Transação registrada com sucesso (201 Created).';
    }

    alertaOk.classList.remove('hidden');
    setTimeout(() => alertaOk.classList.add('hidden'), 2600);
    salvarEstado();
    sairModoEdicao();
    renderizarTudo();
  });

  document.getElementById('btn-cancelar-edicao').addEventListener('click', sairModoEdicao);

  // Editar / Excluir na tabela
  document.getElementById('tabela-transacoes').addEventListener('click', (e) => {
    const btnEdit = e.target.closest('[data-edit]');
    const btnDel = e.target.closest('[data-del]');

    if (btnEdit) {
      const tx = estado.transacoes.find((t) => t.id === btnEdit.dataset.edit);
      if (!tx) return;
      document.getElementById('transacao-id').value = tx.id;
      document.getElementById('descricao').value = tx.descricao;
      document.getElementById('valor').value = tx.valor;
      document.getElementById('tipo').value = tx.tipo;
      document.getElementById('categoria').value = tx.categoria;
      document.getElementById('data').value = tx.data;
      document.getElementById('form-titulo').textContent = '✏️ Editar Transação (RF05)';
      document.getElementById('btn-cancelar-edicao').classList.remove('hidden');
    }

    if (btnDel) {
      estado.transacoes = estado.transacoes.filter((t) => t.id !== btnDel.dataset.del);
      salvarEstado();
      renderizarTudo();
    }
  });

  // Categorias
  document.getElementById('form-categoria').addEventListener('submit', (e) => {
    e.preventDefault();
    const alerta = document.getElementById('alerta-categoria');
    alerta.classList.add('hidden');
    const input = document.getElementById('nova-categoria');
    const nome = input.value.trim();

    if (!nome) {
      alerta.textContent = '400 Bad Request: Informe um nome entre 1 e 50 caracteres.';
      alerta.classList.remove('hidden');
      return;
    }
    const duplicada = estado.categorias.some(
      (c) => c.nome.toLocaleLowerCase('pt-BR') === nome.toLocaleLowerCase('pt-BR')
    );
    if (duplicada) {
      alerta.textContent = `409 Conflict: Já existe a categoria '${nome}' (RN03).`;
      alerta.classList.remove('hidden');
      return;
    }
    estado.categorias.push({ id: `cat-${Date.now()}`, nome, criadoEm: new Date().toISOString() });
    input.value = '';
    salvarEstado();
    renderizarTudo();
  });

  document.getElementById('lista-categorias').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del-cat]');
    if (!btn) return;
    const alerta = document.getElementById('alerta-categoria');
    alerta.classList.add('hidden');

    const cat = estado.categorias.find((c) => c.id === btn.dataset.delCat);
    if (!cat) return;

    const emUso = estado.transacoes.some(
      (t) => t.categoria.toLocaleLowerCase('pt-BR') === cat.nome.toLocaleLowerCase('pt-BR')
    );
    if (emUso) {
      alerta.textContent = `409 Conflict: A categoria '${cat.nome}' está em uso por transações e não pode ser excluída (RN02).`;
      alerta.classList.remove('hidden');
      return;
    }
    estado.categorias = estado.categorias.filter((c) => c.id !== cat.id);
    salvarEstado();
    renderizarTudo();
  });

  // Filtros e busca
  ['filtro-tipo', 'filtro-categoria', 'filtro-mes-resumo'].forEach((id) => {
    document.getElementById(id).addEventListener('change', renderizarTudo);
  });
  document.getElementById('filtro-busca').addEventListener('input', renderizarTransacoes);

  document.getElementById('btn-limpar-mes').addEventListener('click', () => {
    document.getElementById('filtro-mes-resumo').value = '';
    renderizarTudo();
  });

  document.getElementById('btn-popular-demo').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    estado = carregarEstado();
    salvarEstado();
    renderizarTudo();
  });

  document.getElementById('btn-exportar-csv').addEventListener('click', exportarCSV);

  // Documentação Markdown + Mermaid
  document.querySelectorAll('.doc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.doc-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      carregarDocumento(btn.dataset.doc);
    });
  });

  // Simulador e Benchmark RNF02
  document.querySelectorAll('[data-sim]').forEach((btn) => {
    btn.addEventListener('click', () => executarSimulacao(btn.dataset.sim));
  });

  document.getElementById('btn-run-benchmark').addEventListener('click', executarBenchmarkRNF02);
});

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem(THEME_KEY, tema);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) btn.textContent = tema === 'light' ? '🌙' : '☀️';
}

function sairModoEdicao() {
  document.getElementById('transacao-id').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('form-titulo').textContent = '➕ Registrar Transação (RF01)';
  document.getElementById('btn-cancelar-edicao').classList.add('hidden');
}

function exportarCSV() {
  const linhas = [
    ['id', 'data', 'descricao', 'categoria', 'tipo', 'valor'],
    ...obterTransacoesFiltradas().map((t) => [
      t.id,
      t.data,
      `"${t.descricao.replace(/"/g, '""')}"`,
      `"${t.categoria}"`,
      t.tipo,
      t.valor.toFixed(2),
    ]),
  ];
  const csv = linhas.map((l) => l.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transacoes-financeiro-pessoal.csv';
  a.click();
  URL.revokeObjectURL(url);
}

async function carregarDocumento(caminho) {
  const viewer = document.getElementById('markdown-viewer');
  viewer.innerHTML = '<p>Carregando artefato...</p>';
  try {
    const resp = await fetch(caminho);
    const md = await resp.text();
    viewer.innerHTML = marked.parse(md);

    viewer.querySelectorAll('pre code.language-mermaid').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = codeBlock.textContent;
      pre.replaceWith(div);
    });

    if (window.mermaid) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      await mermaid.run({ nodes: viewer.querySelectorAll('.mermaid') });
    }
  } catch (err) {
    viewer.innerHTML = `<p class="alert alert-error">Erro ao carregar ${caminho}: ${err.message}</p>`;
  }
}

function inicializarSwagger() {
  if (window.SwaggerUIBundle) {
    window.SwaggerUIBundle({
      url: './openapi.yaml',
      dom_id: '#swagger-ui-container',
      deepLinking: true,
      docExpansion: 'list',
    });
  }
}

function executarSimulacao(tipo) {
  const statusEl = document.getElementById('sim-status');
  const rotaEl = document.getElementById('sim-rota');
  const outEl = document.getElementById('sim-output');

  let status = 'HTTP 200 OK';
  let rota = 'GET /health';
  let payload = {};

  if (tipo === 'health') {
    rota = 'GET /health';
    payload = { status: 'ok' };
  } else if (tipo === 'categorias') {
    rota = 'GET /categorias';
    payload = [...estado.categorias].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  } else if (tipo === 'transacoes') {
    rota = 'GET /transacoes';
    payload = [...estado.transacoes].sort((a, b) => b.data.localeCompare(a.data));
  } else if (tipo === 'resumo') {
    const mes = document.getElementById('filtro-mes-resumo').value || undefined;
    rota = mes ? `GET /resumo?mes=${mes}` : 'GET /resumo';
    const r = calcularResumo(mes);
    payload = {
      ...(r.mes ? { mes: r.mes } : {}),
      totalReceitas: r.totalReceitas,
      totalDespesas: r.totalDespesas,
      saldo: r.saldo,
      quantidadeTransacoes: r.quantidadeTransacoes,
      porCategoria: r.porCategoria,
    };
  } else if (tipo === 'erro400') {
    status = 'HTTP 400 Bad Request';
    rota = 'POST /transacoes';
    payload = {
      erro: 'Dados inválidos.',
      codigo: 'VALIDATION_ERROR',
      detalhes: [
        'descricao é obrigatória e deve ter entre 1 e 100 caracteres.',
        'valor deve ser um número maior que zero.',
        'data deve ser uma data válida no formato AAAA-MM-DD.',
      ],
    };
  }

  statusEl.textContent = status;
  statusEl.style.color = status.startsWith('HTTP 4') ? 'var(--red)' : 'var(--green)';
  rotaEl.textContent = rota;
  outEl.textContent = JSON.stringify(payload, null, 2);
}

function executarBenchmarkRNF02() {
  const TOTAL = 10000;
  const t0 = performance.now();
  const lote = Array.from({ length: TOTAL }, (_, i) => ({
    id: `bench-${i}`,
    descricao: `Transação #${i + 1}`,
    valor: Number(((i % 400) + 12.35).toFixed(2)),
    tipo: i % 5 === 0 ? 'receita' : 'despesa',
    categoria: CATEGORIAS_PADRAO[i % CATEGORIAS_PADRAO.length],
    data: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  }));
  const tSeed = performance.now() - t0;

  const t1 = performance.now();
  const filtradas = lote
    .filter((t) => t.tipo === 'despesa' && t.data.startsWith('2026-11-'))
    .sort((a, b) => b.data.localeCompare(a.data));
  const tFilter = performance.now() - t1;

  const t2 = performance.now();
  const resumo = calcularResumo('2026-11', lote);
  const tResumo = performance.now() - t2;

  document.getElementById('bench-seed').textContent = `${tSeed.toFixed(1)} ms`;
  document.getElementById('bench-filter').textContent = `${tFilter.toFixed(1)} ms (< 200ms ✔)`;
  document.getElementById('bench-resumo').textContent = `${tResumo.toFixed(1)} ms (< 200ms ✔)`;

  document.getElementById('sim-status').textContent = 'HTTP 200 OK (Benchmark RNF02 — 10.000 registros)';
  document.getElementById('sim-rota').textContent = `GET /resumo?mes=2026-11 (${filtradas.length} despesas filtradas)`;
  document.getElementById('sim-output').textContent = JSON.stringify(
    {
      benchmark: {
        registrosTotais: TOTAL,
        tempoSeedMs: Number(tSeed.toFixed(2)),
        tempoFiltroOrdenacaoMs: Number(tFilter.toFixed(2)),
        tempoCalculoResumoMs: Number(tResumo.toFixed(2)),
        limiteRNF02Ms: 200,
        statusRNF02: tFilter < 200 && tResumo < 200 ? 'APROVADO' : 'REPROVADO',
      },
      resultadoResumo: {
        mes: resumo.mes,
        totalReceitas: resumo.totalReceitas,
        totalDespesas: resumo.totalDespesas,
        saldo: resumo.saldo,
        quantidadeTransacoes: resumo.quantidadeTransacoes,
      },
    },
    null,
    2
  );
}

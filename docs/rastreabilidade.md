# 🔗 Matriz de Rastreabilidade Bidirecional (Requisito ↔ Código ↔ Teste)

| Metadado | Valor |
|---|---|
| **Projeto** | Financeiro Pessoal — API de Controle de Finanças |
| **Versão do documento** | 2.0 |
| **Última atualização** | 07/11/2026 |
| **Responsável** | Victória de Gouveia Zambom (`@victoriazambomg`) |

Este documento estabelece a **rastreabilidade bidirecional completa (Nível N3)** entre os Requisitos Funcionais (`RF01–RF12`), Requisitos Não Funcionais (`RNF01–RNF09`), Regras de Negócio (`RN01–RN04`), Casos de Uso (`UC01–UC06`), Histórias de Usuário (`US01–US09`), Issues do GitHub, módulos de código-fonte (`src/`) e suítes de testes automatizados (`tests/`).

---

## 1. Rastreabilidade dos Requisitos Funcionais (RF01 a RF12)

| Requisito | Descrição Resumida | Caso de Uso | User Story | Issue | Implementação (`src/`) | Arquivo de Teste (`tests/`) |
|---|---|---|---|---|---|---|
| **[RF01]** | Cadastrar transação (receita ou despesa) | UC01 | US01 | #9 | `src/routes/transacoes.routes.ts`<br>`src/services/transacao.service.ts` | `tests/transacoes/criar.test.ts` |
| **[RF02]** | Listar transações ordenadas por data decrescente | UC02 | US02 | #10 | `src/routes/transacoes.routes.ts`<br>`src/services/transacao.service.ts` | `tests/transacoes/listar-filtrar.test.ts` |
| **[RF03]** | Filtrar transações por `tipo`, `categoria` e `mes` (`AAAA-MM`) | UC02 | US03 | #10 | `src/validation/transacao.validator.ts`<br>`src/services/transacao.service.ts` | `tests/transacoes/listar-filtrar.test.ts` |
| **[RF04]** | Consultar transação específica por `id` | UC02 | US02 | #10 | `src/routes/transacoes.routes.ts`<br>`src/services/transacao.service.ts` | `tests/transacoes/listar-filtrar.test.ts` |
| **[RF05]** | Editar transação existente e atualizar `atualizadoEm` | UC03 | US04 | #11 | `src/routes/transacoes.routes.ts`<br>`src/services/transacao.service.ts` | `tests/transacoes/editar.test.ts` |
| **[RF06]** | Excluir transação existente | UC04 | US05 | #12 | `src/routes/transacoes.routes.ts`<br>`src/services/transacao.service.ts` | `tests/transacoes/excluir.test.ts` |
| **[RF07]** | Listar categorias e semear 8 categorias padrão iniciais | UC05 | US06 | #13 | `src/models/categoria.ts`<br>`src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **[RF08]** | Cadastrar nova categoria sem duplicidade (*case-insensitive*) | UC05 | US06 | #13 | `src/validation/categoria.validator.ts`<br>`src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **[RF09]** | Excluir categoria impedindo remoção se estiver em uso | UC05 | US07 | #13 | `src/routes/categorias.routes.ts`<br>`src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **[RF10]** | Calcular saldo geral (receitas − despesas) | UC06 | US08 | #14 | `src/routes/resumo.routes.ts`<br>`src/services/resumo.service.ts` | `tests/resumo/resumo.test.ts` |
| **[RF11]** | Calcular resumo mensal (`AAAA-MM`) com totais por categoria | UC06 | US09 | #14 | `src/models/resumo.ts`<br>`src/services/resumo.service.ts` | `tests/resumo/resumo.test.ts` |
| **[RF12]** | Validar dados de entrada e retornar lista detalhada de erros | UC01, UC03, UC05 | US01, US04, US06 | #8, #9 | `src/validation/common.ts`<br>`src/validation/transacao.validator.ts`<br>`src/validation/categoria.validator.ts` | `tests/validation/common.test.ts`<br>`tests/transacoes/criar.test.ts`<br>`tests/categorias/categorias.test.ts` |

---

## 2. Rastreabilidade dos Requisitos Não Funcionais (RNF01 a RNF09)

| Requisito | Categoria | Meta / Critério Objetivo | Issue | Implementação / Evidência (`src/` / `.github/`) | Arquivo de Teste (`tests/`) |
|---|---|---|---|---|---|
| **[RNF01]** | Persistência e Concorrência | Persistência em arquivo JSON com escrita atômica e fila de exclusão mútua (mutex) para escritas concorrentes | #7, #44 | `src/database/json-database.ts` | `tests/database/json-database.test.ts`<br>`tests/integracao/persistencia-e2e.test.ts` |
| **[RNF02]** | Desempenho | Tempo de resposta `< 200 ms` com base populada de `10.000` transações | #42 | `src/services/transacao.service.ts`<br>`src/services/resumo.service.ts` | `tests/performance/rnf02-desempenho.test.ts` |
| **[RNF03]** | Portabilidade | Execução multiplataforma em Node.js >= 20 e endpoint `GET /health` | #1 | `src/app.ts`<br>`src/server.ts`<br>`.env.example` | `tests/health.test.ts` |
| **[RNF04]** | Usabilidade (API REST) | Respostas JSON padronizadas (`erro`, `detalhes`, `codigo`) e especificação OpenAPI 3.0 | #8, #45 | `src/middlewares/error-handler.ts`<br>`docs/openapi.yaml` | `tests/middlewares/error-handler.test.ts` |
| **[RNF05]** | Confiabilidade | Cobertura de testes automatizados `>= 80%` (branches, functions, lines, statements) validada no Jest e badge gerado do `lcov` | #15, #41 | `jest.config.js`<br>`scripts/generate-coverage-badge.js` | Todas as suítes em `tests/**/*.test.ts` |
| **[RNF06]** | Manutenibilidade | TypeScript `strict: true`, arquitetura em camadas, Conventional Commits e guia `CONTRIBUTING.md` | #1, #49 | `tsconfig.json`<br>`CONTRIBUTING.md`<br>`docs/README.md` | Verificação estática `npm run typecheck` no CI |
| **[RNF07]** | Segurança | Limite de payload de `100kb`, ocultação de *stack trace* em erros `500` e auditoria no CI | #8, #50 | `src/app.ts`<br>`src/middlewares/error-handler.ts`<br>`.github/workflows/ci.yml` | `tests/middlewares/error-handler.test.ts` |
| **[RNF08]** | Precisão Monetária | Aritmética em centavos inteiros (`Math.round(valor * 100)`) sem erro de ponto flutuante (`0.1 + 0.2 === 0.3`) | #14 | `src/services/resumo.service.ts`<br>`src/validation/common.ts` | `tests/resumo/resumo.test.ts`<br>`tests/validation/common.test.ts` |
| **[RNF09]** | Integração e Entrega Contínua | Workflows automatizados de CI (testes, cobertura, desempenho, auditoria) e CD (GitHub Pages) | #16, #40 | `.github/workflows/ci.yml`<br>`.github/workflows/pages.yml` | Execução automática em cada Push e Pull Request |

---

## 3. Rastreabilidade das Regras de Negócio (RN01 a RN04)

| Regra | Descrição | Requisito Associado | Código-Fonte | Teste Automatizado |
|---|---|---|---|---|
| **RN01** | Valor sempre positivo (`> 0`); sinal definido por `tipo` (`receita` soma, `despesa` subtrai) | RF01, RF10, RF12 | `src/validation/transacao.validator.ts`<br>`src/services/resumo.service.ts` | `tests/transacoes/criar.test.ts`<br>`tests/resumo/resumo.test.ts` |
| **RN02** | Categoria em uso por transações não pode ser excluída (`409 Conflict`) | RF09 | `src/services/categoria.service.ts`<br>`src/services/transacao.service.ts` | `tests/categorias/categorias.test.ts` |
| **RN03** | Nomes de categoria são únicos sem diferenciar maiúsculas/minúsculas e espaços laterais | RF08 | `src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **RN04** | O mês de referência da transação é determinado pelo campo `data` (`AAAA-MM-DD`) | RF03, RF11 | `src/services/transacao.service.ts`<br>`src/services/resumo.service.ts` | `tests/transacoes/listar-filtrar.test.ts`<br>`tests/resumo/resumo.test.ts` |

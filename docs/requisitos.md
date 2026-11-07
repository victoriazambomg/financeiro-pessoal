# 📋 Especificação de Requisitos

Este documento lista os **Requisitos Funcionais (RF)** e **Não Funcionais (RNF)** do Financeiro Pessoal. Cada requisito tem um identificador único que é usado nos casos de uso, nas histórias de usuário, nas issues do GitHub, no código-fonte e nos arquivos de teste, garantindo a **rastreabilidade de ponta a ponta (Nível N3)**.

**Prioridade (MoSCoW):** `M` = Must have (obrigatório) · `S` = Should have (importante) · `C` = Could have (desejável) · `W` = Won't have (fora desta versão)

---

## 1. Requisitos Funcionais (RF)

### 1.1 Transações

| ID | Requisito | Prioridade |
|---|---|---|
| **[RF01]** | O sistema deve permitir **cadastrar uma transação** informando descrição, valor, tipo (`receita` ou `despesa`), categoria e data. | M |
| **[RF02]** | O sistema deve permitir **listar todas as transações**, ordenadas da data mais recente para a mais antiga. | M |
| **[RF03]** | O sistema deve permitir **filtrar transações** por tipo, categoria e mês (`AAAA-MM`), de forma combinável. | S |
| **[RF04]** | O sistema deve permitir **consultar uma transação** específica pelo seu identificador. | M |
| **[RF05]** | O sistema deve permitir **editar** todos os dados de uma transação existente, registrando a data da última atualização. | M |
| **[RF06]** | O sistema deve permitir **excluir** uma transação existente. | M |

### 1.2 Categorias

| ID | Requisito | Prioridade |
|---|---|---|
| **[RF07]** | O sistema deve permitir **listar as categorias** cadastradas, oferecendo um conjunto de categorias padrão na primeira execução (Alimentação, Moradia, Transporte, Saúde, Lazer, Educação, Salário, Outros). | M |
| **[RF08]** | O sistema deve permitir **cadastrar uma nova categoria**, sem permitir nomes duplicados (comparação sem diferenciar maiúsculas/minúsculas). | S |
| **[RF09]** | O sistema deve permitir **excluir uma categoria**, impedindo a exclusão de categorias utilizadas por alguma transação. | S |

### 1.3 Relatórios

| ID | Requisito | Prioridade |
|---|---|---|
| **[RF10]** | O sistema deve informar o **saldo geral** (total de receitas − total de despesas) considerando todas as transações. | M |
| **[RF11]** | O sistema deve apresentar o **resumo de um mês** com total de receitas, total de despesas, saldo, quantidade de transações e totais agrupados por categoria. | M |

### 1.4 Validação

| ID | Requisito | Prioridade |
|---|---|---|
| **[RF12]** | O sistema deve **validar os dados de entrada** e rejeitar requisições inválidas, informando todos os campos com problema. Regras: descrição obrigatória (1–100 caracteres); valor numérico > 0 com no máximo 2 casas decimais; tipo `receita` ou `despesa`; categoria obrigatória e cadastrada; data válida no formato `AAAA-MM-DD`. | M |

### 1.5 Backlog Futuro (Won't have na Week_01)

| ID | Requisito | Prioridade |
|---|---|---|
| [RF13] | Autenticação de usuários e múltiplas contas. | W |
| [RF14] | Transações recorrentes e metas de orçamento. | W |
| [RF15] | Importação de extratos bancários (OFX/CSV). | W |

---

## 2. Requisitos Não Funcionais (RNF)

| ID | Categoria | Requisito | Critério de verificação automatizado |
|---|---|---|---|
| **[RNF01]** | Persistência | Os dados devem ser persistidos em arquivo JSON local (`data/db.json`, configurável via `DATA_FILE`) e preservados entre reinicializações. A escrita deve ser atômica (arquivo temporário + renomeação) e protegida por fila de exclusão mútua contra condições de corrida. | `tests/database/json-database.test.ts` e `tests/integracao/persistencia-e2e.test.ts` |
| **[RNF02]** | Desempenho | As requisições de listagem, filtragem e resumo devem responder em menos de **200 ms** com **10.000 transações** cadastradas. | `tests/performance/rnf02-desempenho.test.ts` (executado no CI) |
| **[RNF03]** | Portabilidade | A aplicação deve executar em **Windows, Linux e macOS** com Node.js 20 ou superior, sem dependências nativas externas, expondo `GET /health`. | `tests/health.test.ts` e matriz Node 20/22 no CI |
| **[RNF04]** | Usabilidade (API) | A API deve seguir convenções REST, usar códigos HTTP adequados (200, 201, 204, 400, 404, 409, 413, 500), retornar erros padronizados em português (`{ "erro": string, "codigo"?: string, "detalhes"?: string[] }`) e possuir especificação OpenAPI 3.0. | `tests/middlewares/error-handler.test.ts` e `docs/openapi.yaml` |
| **[RNF05]** | Confiabilidade | O código deve ter **cobertura de testes >= 80%** (linhas, funções, branches e statements) imposta no Jest e badge gerado a partir do relatório `lcov`/`coverage-summary`. | `npm run test:coverage` + `scripts/generate-coverage-badge.js` |
| **[RNF06]** | Manutenibilidade | O código deve ser escrito em **TypeScript com `strict`**, organizado em camadas (rotas → serviços → persistência) e versionado com Conventional Commits. | `npm run typecheck` e `CONTRIBUTING.md` |
| **[RNF07]** | Segurança | O corpo das requisições deve ser limitado a **100 kb**; erros inesperados não devem expor *stack trace* ao cliente; dependências e segredos devem ser auditados no CI. | `tests/middlewares/error-handler.test.ts` e job de segurança no CI |
| **[RNF08]** | Precisão | Cálculos monetários devem ser realizados em **centavos inteiros**, evitando erros de ponto flutuante (ex.: `0,1 + 0,2 = 0,3`). | `tests/resumo/resumo.test.ts` e `tests/validation/common.test.ts` |
| **[RNF09]** | Integração contínua | Todo *push* e *pull request* para `main` e `develop` deve executar automaticamente typecheck, build, cobertura, desempenho e deploy no GitHub Pages via GitHub Actions. | `.github/workflows/ci.yml` e `.github/workflows/pages.yml` |

---

## 3. Regras de Negócio (RN)

| ID | Regra |
|---|---|
| **RN01** | O valor de uma transação é sempre positivo; o sinal é determinado pelo tipo (`receita` soma, `despesa` subtrai). |
| **RN02** | Uma categoria em uso por transações não pode ser excluída. |
| **RN03** | Nomes de categoria são únicos, sem diferenciar maiúsculas/minúsculas e espaços nas extremidades. |
| **RN04** | O mês de referência de uma transação é determinado pelo campo `data` (e não pela data de cadastro). |

---

## 4. Matriz de Rastreabilidade (RF / RNF → UC → US → Issue → Código → Teste)

> A versão expandida desta matriz encontra-se em [`docs/rastreabilidade.md`](./rastreabilidade.md).

| Requisito | Caso de Uso | História de Usuário | Issue | Módulo Principal (`src/`) | Arquivo de Teste (`tests/`) |
|---|---|---|---|---|---|
| **RF01** | UC01 | US01 | #9 | `src/services/transacao.service.ts` | `tests/transacoes/criar.test.ts` |
| **RF02** | UC02 | US02 | #10 | `src/services/transacao.service.ts` | `tests/transacoes/listar-filtrar.test.ts` |
| **RF03** | UC02 | US03 | #10 | `src/validation/transacao.validator.ts` | `tests/transacoes/listar-filtrar.test.ts` |
| **RF04** | UC02 | US02 | #10 | `src/services/transacao.service.ts` | `tests/transacoes/listar-filtrar.test.ts` |
| **RF05** | UC03 | US04 | #11 | `src/services/transacao.service.ts` | `tests/transacoes/editar.test.ts` |
| **RF06** | UC04 | US05 | #12 | `src/services/transacao.service.ts` | `tests/transacoes/excluir.test.ts` |
| **RF07** | UC05 | US06 | #13 | `src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **RF08** | UC05 | US06 | #13 | `src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **RF09** | UC05 | US07 | #13 | `src/services/categoria.service.ts` | `tests/categorias/categorias.test.ts` |
| **RF10** | UC06 | US08 | #14 | `src/services/resumo.service.ts` | `tests/resumo/resumo.test.ts` |
| **RF11** | UC06 | US09 | #14 | `src/services/resumo.service.ts` | `tests/resumo/resumo.test.ts` |
| **RF12** | UC01, UC03, UC05 | US01, US04, US06 | #8, #9 | `src/validation/*.validator.ts` | `tests/validation/common.test.ts`, `tests/transacoes/criar.test.ts` |
| **RNF01** | UC01–UC05 | US01–US07 | #7, #44 | `src/database/json-database.ts` | `tests/database/json-database.test.ts`, `tests/integracao/persistencia-e2e.test.ts` |
| **RNF02** | UC02, UC06 | US02, US03, US09 | #42 | `src/services/transacao.service.ts`, `src/services/resumo.service.ts` | `tests/performance/rnf02-desempenho.test.ts` |
| **RNF03** | — | — | #1 | `src/app.ts`, `src/server.ts` | `tests/health.test.ts` |
| **RNF04** | UC01–UC06 | US01–US09 | #8, #45 | `src/middlewares/error-handler.ts`, `docs/openapi.yaml` | `tests/middlewares/error-handler.test.ts` |
| **RNF05** | — | — | #15, #41 | `jest.config.js`, `scripts/generate-coverage-badge.js` | `tests/**/*.test.ts` |
| **RNF06** | — | — | #1, #49 | `tsconfig.json`, `CONTRIBUTING.md` | `tests/health.test.ts` (`npm run typecheck`) |
| **RNF07** | — | — | #8, #50 | `src/middlewares/error-handler.ts` | `tests/middlewares/error-handler.test.ts` |
| **RNF08** | UC06 | US08, US09 | #14 | `src/services/resumo.service.ts` | `tests/resumo/resumo.test.ts` |
| **RNF09** | — | — | #16, #40 | `.github/workflows/ci.yml`, `.github/workflows/pages.yml` | `tests/**/*.test.ts` (executados no GitHub Actions) |

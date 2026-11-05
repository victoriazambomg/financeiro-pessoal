# 📋 Especificação de Requisitos

Este documento lista os **Requisitos Funcionais (RF)** e **Não Funcionais (RNF)** do Financeiro Pessoal. Cada requisito tem um identificador único que é usado nos casos de uso, nas histórias de usuário, nas issues do GitHub e nas mensagens de commit, garantindo a **rastreabilidade** de ponta a ponta.

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

### 1.5 Fora desta versão (Won't have)

| ID | Requisito | Prioridade |
|---|---|---|
| [RF13] | Autenticação de usuários e múltiplas contas. | W |
| [RF14] | Transações recorrentes e metas de orçamento. | W |
| [RF15] | Importação de extratos bancários (OFX/CSV). | W |

---

## 2. Requisitos Não Funcionais (RNF)

| ID | Categoria | Requisito | Critério de verificação |
|---|---|---|---|
| **[RNF01]** | Persistência | Os dados devem ser persistidos em arquivo JSON local (`data/db.json`, configurável via `DATA_FILE`) e preservados entre reinicializações. A escrita deve ser atômica (arquivo temporário + renomeação). | Teste que grava, recria a instância e lê novamente |
| **[RNF02]** | Desempenho | As requisições devem responder em menos de **200 ms** com até 10.000 transações em ambiente local. | Medição manual / teste de carga simples |
| **[RNF03]** | Portabilidade | A aplicação deve executar em **Windows, Linux e macOS** com Node.js 20 ou superior, sem dependências nativas ou servidor de banco de dados. | Execução no CI (Ubuntu) e localmente (Windows) |
| **[RNF04]** | Usabilidade (API) | A API deve seguir convenções REST, trocar dados em JSON, usar códigos HTTP adequados (200, 201, 204, 400, 404, 409, 413, 500) e retornar erros em português no formato `{ "erro": string, "detalhes"?: string[] }`. | Testes de integração |
| **[RNF05]** | Confiabilidade | O código deve ter **cobertura de testes ≥ 80%** (linhas, funções, branches e statements). | `npm run test:coverage` com `coverageThreshold` |
| **[RNF06]** | Manutenibilidade | O código deve ser escrito em **TypeScript com `strict`**, organizado em camadas (rotas → serviços → persistência) e versionado com Conventional Commits. | Revisão de código e `npm run typecheck` |
| **[RNF07]** | Segurança | O corpo das requisições deve ser limitado a **100 kb**; erros inesperados não devem expor *stack trace* ao cliente; toda entrada deve ser validada antes de ser persistida. | Testes de integração |
| **[RNF08]** | Precisão | Cálculos monetários devem ser realizados em **centavos inteiros**, evitando erros de ponto flutuante (ex.: 0,1 + 0,2 = 0,3). | Teste unitário do resumo |
| **[RNF09]** | Integração contínua | Todo *push* e *pull request* para `main` e `develop` deve executar automaticamente typecheck, build e testes via GitHub Actions. | Badge de status do CI |

---

## 3. Regras de Negócio (RN)

| ID | Regra |
|---|---|
| **RN01** | O valor de uma transação é sempre positivo; o sinal é determinado pelo tipo (`receita` soma, `despesa` subtrai). |
| **RN02** | Uma categoria em uso por transações não pode ser excluída. |
| **RN03** | Nomes de categoria são únicos, sem diferenciar maiúsculas/minúsculas e espaços nas extremidades. |
| **RN04** | O mês de referência de uma transação é determinado pelo campo `data` (e não pela data de cadastro). |

---

## 4. Matriz de Rastreabilidade

| Requisito | Caso de Uso | História de Usuário | Issue |
|---|---|---|---|
| RF01 | UC01 | US01 | #9 |
| RF02 | UC02 | US02 | #10 |
| RF03 | UC02 | US03 | #10 |
| RF04 | UC02 | US02 | #10 |
| RF05 | UC03 | US04 | #11 |
| RF06 | UC04 | US05 | #12 |
| RF07 | UC05 | US06 | #13 |
| RF08 | UC05 | US06 | #13 |
| RF09 | UC05 | US07 | #13 |
| RF10 | UC06 | US08 | #14 |
| RF11 | UC06 | US09 | #14 |
| RF12 | UC01, UC03, UC05 | US01, US04, US06 | #8, #9 |
| RNF01 | — | — | #7 |
| RNF03, RNF06 | — | — | #1 |
| RNF04, RNF07 | — | — | #8 |
| RNF05 | — | — | #15 |
| RNF08 | UC06 | US09 | #14 |
| RNF09 | — | — | #16 |

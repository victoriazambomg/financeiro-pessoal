# 🏦 Financeiro Pessoal — API de Controle de Finanças Pessoais

[![CI](https://github.com/victoriazambomg/financeiro-pessoal/actions/workflows/ci.yml/badge.svg)](https://github.com/victoriazambomg/financeiro-pessoal/actions/workflows/ci.yml)
[![Versão](https://img.shields.io/github/v/release/victoriazambomg/financeiro-pessoal?label=vers%C3%A3o&color=blue)](https://github.com/victoriazambomg/financeiro-pessoal/releases)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20(strict)-3178C6.svg)](https://www.typescriptlang.org/)
[![Cobertura](https://img.shields.io/badge/cobertura-100%25-brightgreen.svg)](#%EF%B8%8F-execu%C3%A7%C3%A3o-dos-testes)

---

## 📌 O Problema e a Solução

Controlar para onde vai o dinheiro todos os meses costuma esbarrar em dois extremos: planilhas manuais que exigem manutenção de fórmulas ou aplicativos comerciais complexos que cobram assinaturas e exigem compartilhamento de dados bancários.

O **Financeiro Pessoal** resolve esse problema oferecendo uma **API REST leve, aberta e auto-hospedável** desenvolvida em **Node.js + TypeScript + Express**. Com ela é possível registrar receitas e despesas classificadas por categoria, filtrar movimentações por período e obter instantaneamente o saldo geral e o resumo mensal detalhado por categoria — tudo com persistência local atômica em JSON, sem necessidade de configurar servidores de banco de dados.

---

## ✨ Funcionalidades: Implementadas vs. Planejadas

| Funcionalidade | Requisito | Status | Versão |
|---|---|---|---|
| Endpoint de verificação de saúde (`GET /health`) | RNF03 | ✅ Implementada | `v0.1.0` |
| Persistência local em arquivo JSON com escrita atômica | RNF01 | ✅ Implementada | `v0.2.0` |
| Tratamento centralizado de erros e validação de entrada | RF12, RNF04, RNF07 | ✅ Implementada | `v0.2.0` |
| Cadastrar transação — receita ou despesa (`POST /transacoes`) | RF01 | ✅ Implementada | `v0.2.0` |
| Listar transações ordenadas por data (`GET /transacoes`) | RF02 | ✅ Implementada | `v0.2.0` |
| Filtrar transações por `tipo`, `categoria` e `mes` (`AAAA-MM`) | RF03 | ✅ Implementada | `v0.2.0` |
| Consultar transação por ID (`GET /transacoes/:id`) | RF04 | ✅ Implementada | `v0.2.0` |
| Editar transação existente (`PUT /transacoes/:id`) | RF05 | ✅ Implementada | `v0.2.0` |
| Excluir transação (`DELETE /transacoes/:id`) | RF06 | ✅ Implementada | `v0.2.0` |
| Listar categorias e semear 8 categorias padrão (`GET /categorias`) | RF07 | ✅ Implementada | `v0.3.0` |
| Cadastrar categoria personalizada sem duplicidade (`POST /categorias`) | RF08 | ✅ Implementada | `v0.3.0` |
| Excluir categoria com bloqueio se estiver em uso (`DELETE /categorias/:id`) | RF09 | ✅ Implementada | `v0.3.0` |
| Consultar saldo geral (`GET /resumo`) | RF10 | ✅ Implementada | `v0.3.0` |
| Consultar resumo mensal com totais por categoria (`GET /resumo?mes=AAAA-MM`) | RF11, RNF08 | ✅ Implementada | `v0.3.0` |
| Suíte de testes automatizados com cobertura ≥ 80% | RNF05 | ✅ Implementada | `v0.3.0` |
| Pipeline de CI no GitHub Actions (Node 20.x e 22.x) | RNF09 | ✅ Implementada | `v0.4.0` |
| Autenticação JWT e múltiplos usuários | RF13 | 🗓️ Planejada (Backlog futuro) | `v1.0.0` |
| Transações recorrentes e metas de orçamento por categoria | RF14 | 🗓️ Planejada (Backlog futuro) | `v1.1.0` |
| Importação e exportação de extratos (CSV / OFX) | RF15 | 🗓️ Planejada (Backlog futuro) | `v1.2.0` |

---

## 📚 Documentação de Engenharia (`docs/`)

Toda a especificação e modelagem do projeto está documentada na pasta [`docs/`](./docs):

| Documento | Descrição |
|---|---|
| 📜 [**Project Charter (Termo de Abertura)**](./docs/project-charter.md) | Justificativa, visão do produto, objetivos SMART, escopo (dentro/fora), stakeholders, público-alvo, riscos e milestones. |
| 📋 [**Requisitos Funcionais e Não Funcionais**](./docs/requisitos.md) | Lista rastreável de RFs (`[RF01]`–`[RF15]`), RNFs (`[RNF01]`–`[RNF09]`), Regras de Negócio (`RN01`–`RN04`) e Matriz de Rastreabilidade (`RF → UC → US → Issue`). |
| 🎭 [**Especificação de Casos de Uso**](./docs/casos-de-uso.md) | Descrição dos atores, diagrama de casos de uso e fluxos principal, alternativos e de exceção (`UC01` a `UC06`). |
| 📖 [**Histórias de Usuário (User Stories)**](./docs/user-stories.md) | Histórias `US01` a `US09` no padrão canônico com critérios de aceite em BDD/Gherkin (*Dado / Quando / Então*) e estimativa em Story Points. |
| 🏗️ [**Arquitetura e Modelagem**](./docs/arquitetura.md) | Diagramas C4 (Contexto, Contêineres e Componentes), Diagrama de Classes, Modelo Entidade-Relacionamento (DER), Diagrama de Sequência e ADRs. |
| 📦 [**Changelog**](./CHANGELOG.md) | Histórico de versões seguindo SemVer (`v0.1.0` a `v0.4.0`). |

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/) (v20+)
- **Linguagem:** [TypeScript 5](https://www.typescriptlang.org/) (`strict: true`)
- **Framework HTTP:** [Express 5](https://expressjs.com/)
- **Persistência:** Arquivo JSON local (`data/db.json`) com escrita atômica via arquivo temporário
- **Testes:** [Jest 29](https://jestjs.io/) + `ts-jest` + [Supertest](https://github.com/ladjs/supertest)
- **CI/CD:** [GitHub Actions](./.github/workflows/ci.yml)

---

## 📂 Estrutura do Repositório

```text
financeiro-pessoal/
├── .github/
│   └── workflows/
│       └── ci.yml                   # Pipeline de Integração Contínua (GitHub Actions)
├── docs/
│   ├── project-charter.md           # Termo de Abertura do Projeto
│   ├── requisitos.md                # Requisitos Funcionais (RF), Não Funcionais (RNF) e Matriz
│   ├── casos-de-uso.md              # Especificação de Casos de Uso (UC01-UC06)
│   ├── user-stories.md              # Histórias de Usuário com Critérios de Aceite (BDD/Gherkin)
│   └── arquitetura.md               # C4 Model, Diagrama de Classes, DER, Sequência e ADRs
├── src/
│   ├── database/
│   │   └── json-database.ts         # Persistência JSON atômica e Collection<T>
│   ├── errors/
│   │   └── app-error.ts             # Hierarquia de erros HTTP (400, 404, 409)
│   ├── middlewares/
│   │   └── error-handler.ts         # Tratamento global de erros e 404
│   ├── models/
│   │   ├── categoria.ts             # Modelo Categoria e categorias padrão
│   │   ├── resumo.ts                # Modelo ResumoFinanceiro
│   │   └── transacao.ts             # Modelo Transacao
│   ├── routes/
│   │   ├── categorias.routes.ts     # Rotas /categorias
│   │   ├── resumo.routes.ts         # Rotas /resumo
│   │   └── transacoes.routes.ts     # Rotas /transacoes
│   ├── services/
│   │   ├── categoria.service.ts     # Regras de negócio de categorias
│   │   ├── resumo.service.ts        # Cálculo de saldo e resumo mensal em centavos
│   │   └── transacao.service.ts     # Regras de negócio de transações
│   ├── validation/
│   │   ├── categoria.validator.ts   # Validação de categorias
│   │   ├── common.ts                # Utilitários de validação (datas, meses, decimais)
│   │   └── transacao.validator.ts   # Validação de transações e filtros
│   ├── app.ts                       # Composição da aplicação Express
│   └── server.ts                    # Ponto de entrada HTTP
├── tests/                           # Testes unitários e de integração
├── .gitattributes
├── .gitignore
├── CHANGELOG.md
├── jest.config.js
├── LICENSE
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Configuração, Instalação e Execução Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) **20.x** ou superior
- [Git](https://git-scm.com/)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/victoriazambomg/financeiro-pessoal.git
cd financeiro-pessoal

# 2. Instale as dependências
npm install

# 3. Inicie em modo de desenvolvimento (com hot-reload)
npm run dev
```

A API estará disponível em `http://localhost:3000`.

### Build para produção

```bash
npm run build
npm start
```

### Variáveis de ambiente (opcionais)

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta HTTP em que o servidor escuta |
| `DATA_FILE` | `data/db.json` | Caminho do arquivo JSON de persistência |

---

## 🧪 Execução dos Testes

```bash
# Executar todos os testes
npm test

# Executar testes com relatório de cobertura (meta >= 80%)
npm run test:coverage

# Verificar tipagem TypeScript
npm run typecheck
```

---

## 🔌 Exemplos de Uso da API

### 1. Listar categorias (`GET /categorias`)

```bash
curl http://localhost:3000/categorias
```

### 2. Cadastrar uma transação (`POST /transacoes`)

```bash
curl -X POST http://localhost:3000/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Supermercado",
    "valor": 150.75,
    "tipo": "despesa",
    "categoria": "Alimentação",
    "data": "2026-11-05"
  }'
```

### 3. Listar e filtrar transações (`GET /transacoes`)

```bash
# Todas as transações
curl http://localhost:3000/transacoes

# Filtrar despesas de Alimentação em novembro/2026
curl "http://localhost:3000/transacoes?tipo=despesa&categoria=Alimentação&mes=2026-11"
```

### 4. Consultar resumo mensal (`GET /resumo?mes=2026-11`)

```bash
curl "http://localhost:3000/resumo?mes=2026-11"
```

Resposta:

```json
{
  "mes": "2026-11",
  "totalReceitas": 3000,
  "totalDespesas": 1200.5,
  "saldo": 1799.5,
  "quantidadeTransacoes": 3,
  "porCategoria": [
    { "categoria": "Salário", "tipo": "receita", "total": 3000, "quantidade": 1 },
    { "categoria": "Moradia", "tipo": "despesa", "total": 1000, "quantidade": 1 },
    { "categoria": "Alimentação", "tipo": "despesa", "total": 200.5, "quantidade": 1 }
  ]
}
```

---

## 🌿 Fluxo de Branches (Git Flow) e Padrões de Versionamento

O desenvolvimento segue o **Git Flow**, com commits atômicos no padrão **Conventional Commits** e **Versionamento Semântico (SemVer)**:

```mermaid
flowchart LR
    main["main (produção / tags v0.1.0..v0.4.0)"]
    develop["develop (integração)"]
    feat["feature/issue-NN-descricao"]
    rel["release/vX.Y.Z"]

    develop -->|checkout -b| feat
    feat -->|PR + Closes #NN| develop
    develop -->|checkout -b| rel
    rel -->|PR + tag SemVer| main
    main -->|back-merge| develop
```

### Estrutura de Branches

| Branch | Propósito | Origem | Destino (Merge) |
|---|---|---|---|
| `main` | Código estável de produção; cada merge gera uma tag anotada SemVer (`v0.1.0`, `v0.2.0`, `v0.3.0`, `v0.4.0`) | — | — |
| `develop` | Branch principal de integração das funcionalidades da sprint | `main` | `release/*` |
| `feature/issue-NN-*` | Desenvolvimento isolado de cada Issue do backlog (ex.: `feature/issue-09-cadastrar-transacao`) | `develop` | `develop` (via Pull Request com `Closes #NN`) |
| `release/vX.Y.Z` | Preparação de versão estável e fechamento de milestone | `develop` | `main` (via Pull Request) e de volta para `develop` |

### Padrão de Commits (Conventional Commits)

Todos os commits são atômicos e referenciam a Issue correspondente:

- `feat(escopo): descrição (#issue)` — nova funcionalidade
- `docs(escopo): descrição (#issue)` — criação/atualização de documentação
- `test(escopo): descrição (#issue)` — adição ou ajuste de testes
- `build(escopo): descrição (#issue)` — dependências e configuração de build
- `ci: descrição (#issue)` — pipelines de integração contínua
- `chore(escopo): descrição (#issue)` — manutenção e setup

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](./LICENSE) para mais detalhes.

# 📦 Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto adota o [Versionamento Semântico (SemVer)](https://semver.org/lang/pt-BR/).

---

## [v0.5.0] - 2026-11-05 — Portal Interativo no GitHub Pages

### Adicionado
- Painel web interativo (`docs/index.html`, `docs/app.js`, `docs/styles.css`) publicado no GitHub Pages com simulação completa das regras de negócio (RF01–RF12 e RNF08), visualizador dos artefatos Markdown/Mermaid e playground da API (#39).
- Workflow `.github/workflows/pages.yml` para publicação contínua no GitHub Pages (#39).

---

## [v0.4.0] - 2026-11-05 — Qualidade e Documentação

### Adicionado
- Pipeline de Integração Contínua no GitHub Actions (`.github/workflows/ci.yml`) validando `typecheck`, `build` e `test:coverage` em Node.js 20 e 22 (#16).
- Documentação principal (`README.md`) com badges, sumário de funcionalidades, instruções de execução, exemplos de requisições, links para `docs/` e diagrama Git Flow (#17).
- `CHANGELOG.md` documentando todas as releases SemVer (#17).

---

## [v0.3.0] - 2026-11-05 — Categorias e Relatórios

### Adicionado
- Gerenciamento de categorias (`GET /categorias`, `POST /categorias`, `DELETE /categorias/:id`) com 8 categorias padrão iniciais, bloqueio de duplicidade e proteção contra exclusão de categorias em uso (#13).
- Vínculo entre transações e categorias cadastradas com normalização do nome canônico (#13).
- Cálculo de saldo geral (`GET /resumo`) e resumo financeiro mensal por categoria (`GET /resumo?mes=AAAA-MM`) utilizando aritmética em centavos inteiros (#14).
- Meta mínima de 80% de cobertura de testes (`coverageThreshold`) no Jest e teste de integração de persistência ponta a ponta (#15).

---

## [v0.2.0] - 2026-11-05 — Persistência e CRUD de Transações

### Adicionado
- Camada de persistência `JsonDatabase` e `Collection<T>` em arquivo JSON com escrita atômica e modo em memória para testes (#7).
- Hierarquia de erros (`AppError`, `ValidationError`, `NotFoundError`, `ConflictError`) e middlewares `notFoundHandler` e `errorHandler` (#8).
- Cadastro de transações `POST /transacoes` com validação de campos (#9).
- Listagem ordenada, consulta por ID e filtros combináveis (`tipo`, `categoria`, `mes`) em `GET /transacoes` e `GET /transacoes/:id` (#10).
- Edição de transações `PUT /transacoes/:id` (#11).
- Exclusão de transações `DELETE /transacoes/:id` (#12).

---

## [v0.1.0] - 2026-11-05 — Fundação e Especificação

### Adicionado
- Configuração inicial do projeto Node.js + TypeScript (`strict`) + Express 5 + Jest + Supertest, `.gitignore`, licença MIT e endpoint `GET /health` (#1).
- Termo de Abertura do Projeto (`docs/project-charter.md`) (#2).
- Especificação de Requisitos Funcionais, Não Funcionais, Regras de Negócio e Matriz de Rastreabilidade (`docs/requisitos.md`) (#3).
- Especificação de Casos de Uso `UC01`–`UC06` e diagrama de atores (`docs/casos-de-uso.md`) (#4).
- Histórias de Usuário `US01`–`US09` com critérios de aceite em BDD/Gherkin (`docs/user-stories.md`) (#5).
- Documentação de Arquitetura com diagramas C4, Diagrama de Classes, DER, Sequência e ADRs (`docs/arquitetura.md`) (#6).

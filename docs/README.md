# 📚 Índice da Documentação de Engenharia (`docs/`)

Este diretório concentra todos os artefatos de especificação, modelagem, contratos de API, rastreabilidade e o portal interativo publicado no GitHub Pages do projeto **Financeiro Pessoal**.

---

## 🗂️ Catálogo de Artefatos

| Artefato | Arquivo | Versão | Última Atualização | Conteúdo Principal |
|---|---|---|---|---|
| **Termo de Abertura (Project Charter)** | [`project-charter.md`](./project-charter.md) | `1.1` | `07/11/2026` | Justificativa, visão do produto, 5 objetivos SMART, escopo, stakeholders, riscos e milestones. |
| **Especificação de Requisitos (RF/RNF)** | [`requisitos.md`](./requisitos.md) | `2.0` | `07/11/2026` | `RF01–RF15`, `RNF01–RNF09`, Regras de Negócio `RN01–RN04` e matriz resumida com coluna de testes. |
| **Matriz de Rastreabilidade Completa** | [`rastreabilidade.md`](./rastreabilidade.md) | `2.0` | `07/11/2026` | Mapeamento bidirecional `Requisito ↔ Caso de Uso ↔ User Story ↔ Issue ↔ Código (src/) ↔ Teste (tests/)`. |
| **Especificação de Casos de Uso** | [`casos-de-uso.md`](./casos-de-uso.md) | `1.0` | `05/11/2026` | Atores, diagrama Mermaid e fluxos principal, alternativos e de exceção (`UC01` a `UC06`). |
| **Histórias de Usuário (User Stories)** | [`user-stories.md`](./user-stories.md) | `1.0` | `05/11/2026` | Histórias `US01` a `US09` com critérios de aceite em BDD/Gherkin (*Dado / Quando / Então*). |
| **Arquitetura e Modelagem** | [`arquitetura.md`](./arquitetura.md) | `1.1` | `07/11/2026` | Diagramas C4 (Contexto, Contêineres, Componentes), Classes, DER, Sequência e ADRs. |
| **Especificação OpenAPI 3.0** | [`openapi.yaml`](./openapi.yaml) | `1.0` | `07/11/2026` | Contrato formal das 9 rotas REST com esquemas JSON e exemplos de erro `400`, `404`, `409` e `413`. |
| **Portal Interativo (GitHub Pages)** | [`index.html`](./index.html) | `2.0` | `07/11/2026` | Aplicação web interativa, gráficos financeiros, leitor de documentação Mermaid e Swagger UI. |

---

## 🔄 Regra de Sincronização Documentação ↔ Código

Para manter 100% de aderência entre especificação e implementação:

1. **Alteração de Requisito (`RF` / `RNF`):** todo Pull Request que adicione, altere ou remova um requisito deve atualizar simultaneamente [`requisitos.md`](./requisitos.md) e [`rastreabilidade.md`](./rastreabilidade.md).
2. **Alteração de Rota ou Contrato HTTP:** todo PR que modifique rotas em `src/routes/`, validadores em `src/validation/` ou formato de erro em `src/middlewares/error-handler.ts` deve atualizar [`openapi.yaml`](./openapi.yaml) e [`arquitetura.md`](./arquitetura.md).
3. **Alteração de Testes:** todo novo arquivo em `tests/` deve ser vinculado ao(s) requisito(s) correspondente(s) em [`rastreabilidade.md`](./rastreabilidade.md).
4. **Revisão em Pull Request:** o checklist de PR (`.github/pull_request_template.md`) exige a verificação explícita desta sincronização antes do merge em `develop`.

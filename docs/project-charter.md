# 📜 Termo de Abertura do Projeto (Project Charter)

| Campo | Valor |
|---|---|
| **Projeto** | Financeiro Pessoal — API de Controle de Finanças Pessoais |
| **Responsável (Gerente/Desenvolvedora)** | Victoria |
| **Data de abertura** | 05/11/2026 |
| **Duração prevista (fase atual)** | 1 semana (05/11/2026 a 12/11/2026) |
| **Repositório** | https://github.com/victoriazambomg/financeiro-pessoal |
| **Versão do documento** | 1.0 |

---

## 1. Justificativa

Grande parte das pessoas não sabe exatamente para onde vai o próprio dinheiro ao final do mês. Planilhas exigem disciplina e conhecimento de fórmulas, e aplicativos comerciais costumam ser complexos, cheios de anúncios ou exigem compartilhar dados bancários com terceiros.

Existe, portanto, espaço para uma solução **simples, leve e sob controle do próprio usuário**, que permita registrar receitas e despesas, organizá-las por categoria e visualizar rapidamente o saldo e o resumo do mês — servindo também como base técnica (API) para futuras interfaces web ou mobile.

## 2. Visão Geral do Produto

O **Financeiro Pessoal** é uma **API REST** desenvolvida em **Node.js + TypeScript + Express** que permite:

- registrar **transações** (receitas e despesas) com descrição, valor, categoria e data;
- consultar, filtrar, editar e excluir transações;
- gerenciar **categorias** de gastos e ganhos;
- obter o **saldo geral** e um **resumo mensal** com totais por categoria.

Os dados são persistidos localmente em um arquivo JSON, sem dependência de servidores de banco de dados, o que torna a aplicação portátil e fácil de executar.

> **Declaração de visão:** *Para pessoas que desejam organizar suas finanças sem complicação, o Financeiro Pessoal é uma API leve que registra receitas e despesas e entrega o saldo e o resumo do mês em uma única requisição. Diferente de planilhas e apps comerciais, é simples, aberto e mantém os dados sob controle do usuário.*

## 3. Objetivos SMART

| # | Objetivo | Específico | Mensurável | Atingível | Relevante | Temporal |
|---|---|---|---|---|---|---|
| OBJ01 | Disponibilizar o CRUD completo de transações | Endpoints `POST/GET/PUT/DELETE /transacoes` | 100% dos critérios de aceite das US01–US05 aprovados em testes automatizados | Escopo pequeno e stack conhecida | É o núcleo do produto | Até 08/11/2026 (release v0.2.0) |
| OBJ02 | Oferecer resumo financeiro mensal | Endpoint `GET /resumo?mes=AAAA-MM` com receitas, despesas, saldo e totais por categoria | Cálculos corretos em 100% dos cenários de teste, inclusive casos de ponto flutuante | Regra de negócio simples (somatórios) | Entrega o principal valor percebido pelo usuário | Até 10/11/2026 (release v0.3.0) |
| OBJ03 | Garantir qualidade do código | Testes automatizados com Jest + Supertest | Cobertura ≥ 80% de linhas, funções e branches | Ferramentas maduras e gratuitas | Reduz regressões durante a evolução | Até 10/11/2026 |
| OBJ04 | Automatizar a verificação de qualidade | Pipeline de CI no GitHub Actions | 100% dos PRs para `develop`/`main` validados automaticamente | GitHub Actions é gratuito para repositórios públicos | Garante rastreabilidade e confiança nas entregas | Até 11/11/2026 (release v0.4.0) |
| OBJ05 | Manter rastreabilidade do desenvolvimento | Issues, branches por issue, Conventional Commits e tags SemVer | 100% das issues fechadas por PR referenciado; ≥ 4 tags de versão | Fluxo Git Flow simplificado | Exigência de engenharia profissional | Durante toda a semana |

## 4. Escopo Preliminar

### ✅ Dentro do escopo (esta semana)

- API REST com endpoints de **transações** (criar, listar, filtrar, consultar, editar, excluir).
- **Categorias**: listagem, criação, exclusão (com proteção para categorias em uso) e categorias padrão.
- **Resumo financeiro**: saldo geral e resumo mensal por categoria.
- **Validação** dos dados de entrada com mensagens de erro em português.
- **Persistência** em arquivo JSON local.
- **Testes automatizados** (unitários e de integração) e **CI** com GitHub Actions.
- **Documentação**: charter, requisitos, casos de uso, user stories, arquitetura e README.

### ❌ Fora do escopo (esta semana)

- Interface gráfica (front-end web ou mobile).
- Autenticação, autorização e múltiplos usuários.
- Integração com bancos (Open Finance), importação de extratos (OFX/CSV).
- Banco de dados relacional/servidor (PostgreSQL, MySQL etc.).
- Metas de orçamento, alertas, notificações e transações recorrentes.
- Múltiplas moedas e conversão cambial.
- Deploy em ambiente de produção na nuvem.

## 5. Stakeholders

| Stakeholder | Papel | Interesse / Expectativa | Influência |
|---|---|---|---|
| Victoria | Desenvolvedora, Product Owner e gerente do projeto | Entregar um produto funcional e bem documentado, aplicando boas práticas de SDLC | Alta |
| Professor(a) da disciplina | Avaliador(a) / patrocinador(a) acadêmico | Verificar especificação, rastreabilidade, Git Flow, commits atômicos e SemVer | Alta |
| Usuários finais (pessoas físicas) | Usuários do produto | Registrar gastos e ver o saldo de forma simples e rápida | Média |
| Colegas de turma | Revisores / pares | Trocar feedback sobre arquitetura e workflow | Baixa |
| Futuros desenvolvedores front-end | Consumidores da API | Contratos de API claros, estáveis e documentados | Média |

## 6. Público-alvo

- **Pessoas físicas** (estudantes, jovens profissionais, autônomos) que querem acompanhar receitas e despesas pessoais.
- **Desenvolvedores** que precisam de um back-end simples de finanças para construir interfaces (web/mobile/CLI).

## 7. Premissas

- O uso é individual (um único usuário por instância da API).
- O usuário possui Node.js 20+ instalado.
- Os valores são em Real (BRL).

## 8. Restrições

- Prazo de **1 semana** e desenvolvimento **individual**.
- Uso exclusivo de ferramentas gratuitas e de código aberto.
- Todo o fluxo deve seguir Git Flow, Conventional Commits e SemVer.

## 9. Riscos Iniciais

| Risco | Probabilidade | Impacto | Resposta |
|---|---|---|---|
| Prazo curto para implementar e documentar | Média | Alto | Escopo enxuto e priorização MoSCoW |
| Erros de arredondamento em valores monetários | Média | Alto | Cálculos em centavos inteiros (RNF08) |
| Corrupção do arquivo JSON durante escrita | Baixa | Alto | Escrita atômica (arquivo temporário + rename) |
| Mudanças de requisitos durante a semana | Baixa | Médio | Backlog em Issues e releases incrementais |

## 10. Marcos (Milestones)

| Versão | Marco | Data prevista |
|---|---|---|
| `v0.1.0` | Fundação: setup do projeto e documentação de planejamento | 05/11/2026 |
| `v0.2.0` | Transações: persistência, tratamento de erros e CRUD | 07/11/2026 |
| `v0.3.0` | Categorias e relatórios: categorias, resumo e cobertura de testes | 09/11/2026 |
| `v0.4.0` | Qualidade e documentação: CI e README completo | 11/11/2026 |

## 11. Aprovação

| Nome | Papel | Data |
|---|---|---|
| Victoria | Responsável pelo projeto | 05/11/2026 |

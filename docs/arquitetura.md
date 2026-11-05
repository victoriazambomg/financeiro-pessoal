# 🏗️ Arquitetura e Modelagem

Este documento reúne os diagramas de engenharia do Financeiro Pessoal: **C4 Model** (contexto, contêineres e componentes), **diagrama de classes**, **modelo entidade-relacionamento (DER)**, **diagrama de sequência** e a **especificação dos endpoints** da API.

> Todos os diagramas são escritos em [Mermaid](https://mermaid.js.org/) e renderizados automaticamente pelo GitHub.

---

## 1. C4 — Nível 1: Diagrama de Contexto

```mermaid
flowchart TB
    user(["👤 Usuário<br/>Pessoa que controla<br/>as próprias finanças"])
    client["💻 Aplicação Cliente<br/>(Insomnia, Postman, curl<br/>ou futuro front-end)"]
    system["🏦 Financeiro Pessoal<br/>API REST para registrar<br/>receitas, despesas e<br/>consultar resumos"]

    user -->|usa| client
    client -->|"requisições HTTP/JSON"| system
```

## 2. C4 — Nível 2: Diagrama de Contêineres

```mermaid
flowchart TB
    client["💻 Aplicação Cliente<br/>[HTTP Client]"]

    subgraph boundary["Financeiro Pessoal"]
        api["⚙️ API REST<br/>[Node.js 20 + TypeScript + Express 5]<br/>Regras de negócio, validação<br/>e exposição dos endpoints"]
        db[("🗄️ data/db.json<br/>[Arquivo JSON]<br/>Transações e categorias")]
    end

    client -->|"JSON sobre HTTP<br/>porta 3000"| api
    api -->|"leitura na inicialização /<br/>escrita atômica (fs)"| db
```

## 3. C4 — Nível 3: Componentes (Arquitetura em Camadas)

```mermaid
flowchart TB
    subgraph http["Camada HTTP"]
        app["app.ts<br/>(composição / injeção de dependências)"]
        rt["routes/transacoes.routes.ts"]
        rc["routes/categorias.routes.ts"]
        rr["routes/resumo.routes.ts"]
        mw["middlewares/error-handler.ts"]
    end

    subgraph domain["Camada de Serviços (regras de negócio)"]
        st["TransacaoService"]
        sc["CategoriaService"]
        sr["ResumoService"]
        val["validation/*.validator.ts"]
        err["errors/app-error.ts"]
    end

    subgraph data["Camada de Persistência"]
        jdb["JsonDatabase"]
        col["Collection&lt;T&gt;"]
    end

    file[("data/db.json")]

    app --> rt & rc & rr & mw
    rt --> st
    rc --> sc
    rr --> sr
    st --> val
    sc --> val
    st --> sc
    sr --> st
    st & sc --> col
    col --> jdb --> file
    st & sc & sr -. lançam .-> err
    mw -. trata .-> err
```

**Responsabilidades**

| Camada | Responsabilidade | Não deve |
|---|---|---|
| Rotas (HTTP) | Traduzir requisição/resposta HTTP, extrair parâmetros e status codes | Conter regra de negócio |
| Serviços | Validar entradas, aplicar regras de negócio (RN01–RN04), orquestrar persistência | Conhecer `req`/`res` do Express |
| Persistência | Ler e gravar coleções no arquivo JSON de forma atômica | Conhecer regras de negócio |
| Middleware de erros | Converter exceções em respostas JSON padronizadas | Expor *stack trace* |

## 4. Diagrama de Classes

```mermaid
classDiagram
    direction LR

    class Transacao {
        <<interface>>
        +string id
        +string descricao
        +number valor
        +TipoTransacao tipo
        +string categoria
        +string data
        +string criadoEm
        +string atualizadoEm
    }

    class TipoTransacao {
        <<enumeration>>
        receita
        despesa
    }

    class Categoria {
        <<interface>>
        +string id
        +string nome
        +string criadoEm
    }

    class JsonDatabase {
        -string filePath
        -DatabaseState state
        +getCollection~T~(nome) Collection~T~
        +read~T~(nome) T[]
        +save() void
    }

    class Collection~T~ {
        -JsonDatabase db
        -string nome
        +findAll() T[]
        +findById(id) T
        +insert(item) T
        +update(id, item) T
        +delete(id) boolean
        +count() number
    }

    class TransacaoService {
        +criar(dados) Transacao
        +listar(filtros) Transacao[]
        +buscarPorId(id) Transacao
        +atualizar(id, dados) Transacao
        +excluir(id) void
        +existeComCategoria(nome) boolean
    }

    class CategoriaService {
        +garantirPadroes() void
        +listar() Categoria[]
        +criar(dados) Categoria
        +excluir(id) void
        +buscarPorNome(nome) Categoria
    }

    class ResumoService {
        +gerar(mes?) Resumo
    }

    class Resumo {
        <<interface>>
        +string mes
        +number totalReceitas
        +number totalDespesas
        +number saldo
        +number quantidadeTransacoes
        +ResumoCategoria[] porCategoria
    }

    class AppError {
        +number statusCode
        +string[] detalhes
    }
    class ValidationError
    class NotFoundError
    class ConflictError

    Transacao --> TipoTransacao
    JsonDatabase "1" o-- "*" Collection
    TransacaoService --> Collection : usa Collection~Transacao~
    CategoriaService --> Collection : usa Collection~Categoria~
    TransacaoService --> CategoriaService : valida categoria
    CategoriaService ..> TransacaoService : verifica uso (callback)
    ResumoService --> TransacaoService
    ResumoService ..> Resumo : cria
    AppError <|-- ValidationError
    AppError <|-- NotFoundError
    AppError <|-- ConflictError
```

## 5. Modelo Entidade-Relacionamento (DER)

Embora a persistência seja em arquivo JSON, o modelo de dados é conceitualmente relacional. O relacionamento entre transação e categoria é feito pelo **nome canônico** da categoria (chave natural única).

```mermaid
erDiagram
    CATEGORIA ||--o{ TRANSACAO : classifica

    CATEGORIA {
        string id PK "UUID v4"
        string nome UK "1-50 caracteres, único (case-insensitive)"
        string criadoEm "ISO 8601"
    }

    TRANSACAO {
        string id PK "UUID v4"
        string descricao "1-100 caracteres"
        number valor "maior que 0, ate 2 casas decimais"
        string tipo "receita ou despesa"
        string categoria FK "nome da categoria"
        string data "AAAA-MM-DD"
        string criadoEm "ISO 8601"
        string atualizadoEm "ISO 8601"
    }
```

**Exemplo do arquivo `data/db.json`:**

```json
{
  "categorias": [
    { "id": "6f1c...", "nome": "Alimentação", "criadoEm": "2026-11-05T19:00:00.000Z" }
  ],
  "transacoes": [
    {
      "id": "b7e2...",
      "descricao": "Mercado",
      "valor": 150.75,
      "tipo": "despesa",
      "categoria": "Alimentação",
      "data": "2026-11-05",
      "criadoEm": "2026-11-05T19:10:00.000Z",
      "atualizadoEm": "2026-11-05T19:10:00.000Z"
    }
  ]
}
```

## 6. Diagrama de Sequência — Registrar Transação (UC01)

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuário
    participant R as transacoes.routes
    participant S as TransacaoService
    participant C as CategoriaService
    participant DB as Collection / JsonDatabase
    participant E as errorHandler

    U->>R: POST /transacoes {descricao, valor, tipo, categoria, data}
    R->>S: criar(body)
    S->>S: validarTransacao(body)
    alt dados inválidos
        S-->>E: throw ValidationError(detalhes)
        E-->>U: 400 { erro, detalhes }
    else dados válidos
        S->>C: buscarPorNome(categoria)
        alt categoria inexistente
            S-->>E: throw ValidationError
            E-->>U: 400 { erro, detalhes }
        else categoria encontrada
            S->>DB: insert(transacao)
            DB->>DB: escrita atômica em data/db.json
            S-->>R: transacao
            R-->>U: 201 Created + transacao
        end
    end
```

## 7. Endpoints da API

| Método | Rota | Descrição | Sucesso | Erros | Requisito |
|---|---|---|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar | 200 | — | RNF03 |
| `POST` | `/transacoes` | Cadastra transação | 201 | 400, 413 | RF01, RF12 |
| `GET` | `/transacoes?tipo=&categoria=&mes=` | Lista/filtra transações | 200 | 400 | RF02, RF03 |
| `GET` | `/transacoes/:id` | Consulta transação | 200 | 404 | RF04 |
| `PUT` | `/transacoes/:id` | Edita transação | 200 | 400, 404 | RF05, RF12 |
| `DELETE` | `/transacoes/:id` | Exclui transação | 204 | 404 | RF06 |
| `GET` | `/categorias` | Lista categorias | 200 | — | RF07 |
| `POST` | `/categorias` | Cadastra categoria | 201 | 400, 409 | RF08 |
| `DELETE` | `/categorias/:id` | Exclui categoria sem uso | 204 | 404, 409 | RF09 |
| `GET` | `/resumo?mes=` | Saldo geral ou resumo mensal | 200 | 400 | RF10, RF11 |

**Formato padrão de erro (RNF04):**

```json
{
  "erro": "Dados inválidos.",
  "detalhes": ["valor deve ser um número maior que zero.", "data deve ser uma data válida no formato AAAA-MM-DD."]
}
```

## 8. Decisões de Arquitetura (ADR resumido)

| # | Decisão | Motivação | Consequência |
|---|---|---|---|
| ADR01 | TypeScript em modo `strict` | Segurança de tipos e manutenibilidade (RNF06) | Etapa de build (`tsc`) |
| ADR02 | Express 5 | Maduro, simples e com tratamento nativo de erros em handlers assíncronos | — |
| ADR03 | Persistência em arquivo JSON | Zero infraestrutura, portabilidade (RNF01, RNF03) | Não indicado para alto volume ou concorrência; migração futura para SQLite/PostgreSQL facilitada pela camada `Collection` |
| ADR04 | `createApp()` separado de `server.ts` com injeção do banco | Testes de integração rápidos com Supertest e banco em memória | — |
| ADR05 | Valores monetários calculados em centavos | Precisão (RNF08) | Conversão na entrada/saída dos cálculos |
| ADR06 | Categoria referenciada por nome canônico | Legibilidade do JSON e dos filtros | Renomear categoria exigiria atualizar transações (fora do escopo) |

# 📖 Histórias de Usuário

Histórias escritas no formato canônico **"Como [ator], quero [ação] para que [valor de negócio]"**, com critérios de aceite em **Gherkin** (Dado / Quando / Então).

**Estimativa:** story points (escala de Fibonacci: 1, 2, 3, 5, 8).

| ID | História | Requisitos | Pontos | Prioridade | Issue |
|---|---|---|---|---|---|
| US01 | Registrar transação | RF01, RF12 | 3 | Must | #9 |
| US02 | Listar e consultar transações | RF02, RF04 | 2 | Must | #10 |
| US03 | Filtrar transações | RF03 | 3 | Should | #10 |
| US04 | Editar transação | RF05, RF12 | 2 | Must | #11 |
| US05 | Excluir transação | RF06 | 1 | Must | #12 |
| US06 | Listar e criar categorias | RF07, RF08 | 3 | Must | #13 |
| US07 | Excluir categoria com segurança | RF09 | 2 | Should | #13 |
| US08 | Consultar saldo geral | RF10 | 2 | Must | #14 |
| US09 | Consultar resumo mensal | RF11, RNF08 | 3 | Must | #14 |

---

## US01 — Registrar transação

> **Como** usuário,
> **quero** registrar uma receita ou despesa com descrição, valor, categoria e data
> **para que** eu tenha um histórico fiel de para onde vai o meu dinheiro.

**Critérios de aceite**

```gherkin
Funcionalidade: Registrar transação

  Cenário: Cadastro de despesa válida
    Dado que a categoria "Alimentação" está cadastrada
    Quando eu envio POST /transacoes com descricao "Mercado", valor 150.75, tipo "despesa", categoria "Alimentação" e data "2026-11-05"
    Então recebo o status 201
    E a resposta contém um "id" único, "criadoEm" e "atualizadoEm"

  Cenário: Valor inválido
    Quando eu envio POST /transacoes com valor 0
    Então recebo o status 400
    E "detalhes" contém "valor deve ser um número maior que zero."

  Cenário: Valor com mais de duas casas decimais
    Quando eu envio POST /transacoes com valor 10.999
    Então recebo o status 400

  Cenário: Data inexistente
    Quando eu envio POST /transacoes com data "2026-02-30"
    Então recebo o status 400
    E "detalhes" informa que a data é inválida

  Cenário: Categoria não cadastrada
    Quando eu envio POST /transacoes com categoria "Viagem Espacial"
    Então recebo o status 400
    E a mensagem informa que a categoria não está cadastrada
```

---

## US02 — Listar e consultar transações

> **Como** usuário,
> **quero** ver todas as minhas transações, das mais recentes para as mais antigas, e consultar uma específica
> **para que** eu acompanhe minhas movimentações e confira os detalhes de cada uma.

```gherkin
Funcionalidade: Listar e consultar transações

  Cenário: Listagem ordenada
    Dado que existem transações nas datas "2026-10-01", "2026-11-05" e "2026-11-01"
    Quando eu envio GET /transacoes
    Então recebo o status 200
    E as transações estão na ordem "2026-11-05", "2026-11-01", "2026-10-01"

  Cenário: Nenhuma transação
    Dado que não existem transações
    Quando eu envio GET /transacoes
    Então recebo o status 200 e uma lista vazia

  Cenário: Consulta por id existente
    Dado que existe uma transação com id "abc"
    Quando eu envio GET /transacoes/abc
    Então recebo o status 200 com os dados da transação

  Cenário: Consulta por id inexistente
    Quando eu envio GET /transacoes/nao-existe
    Então recebo o status 404
```

---

## US03 — Filtrar transações

> **Como** usuário,
> **quero** filtrar minhas transações por tipo, categoria e mês
> **para que** eu analise rapidamente gastos específicos, como "quanto gastei com Alimentação em novembro".

```gherkin
Funcionalidade: Filtrar transações

  Cenário: Filtro por mês
    Dado que existem transações em outubro e novembro de 2026
    Quando eu envio GET /transacoes?mes=2026-11
    Então recebo apenas as transações de novembro de 2026

  Cenário: Filtros combinados
    Quando eu envio GET /transacoes?tipo=despesa&categoria=Alimentação&mes=2026-11
    Então recebo apenas despesas de Alimentação de novembro de 2026

  Cenário: Filtro de categoria sem diferenciar maiúsculas
    Quando eu envio GET /transacoes?categoria=alimentação
    Então recebo as transações da categoria "Alimentação"

  Cenário: Filtro inválido
    Quando eu envio GET /transacoes?mes=2026-13
    Então recebo o status 400
```

---

## US04 — Editar transação

> **Como** usuário,
> **quero** corrigir os dados de uma transação já registrada
> **para que** meus relatórios reflitam a realidade mesmo quando eu cometer um erro de digitação.

```gherkin
Funcionalidade: Editar transação

  Cenário: Edição válida
    Dado que existe uma transação "Mercado" de 150.75
    Quando eu envio PUT /transacoes/{id} com valor 180.00 e os demais campos válidos
    Então recebo o status 200
    E o valor passa a ser 180
    E "atualizadoEm" é posterior a "criadoEm"
    E "id" e "criadoEm" permanecem iguais

  Cenário: Transação inexistente
    Quando eu envio PUT /transacoes/nao-existe com dados válidos
    Então recebo o status 404

  Cenário: Dados inválidos
    Quando eu envio PUT /transacoes/{id} com tipo "investimento"
    Então recebo o status 400
    E a transação permanece inalterada
```

---

## US05 — Excluir transação

> **Como** usuário,
> **quero** excluir uma transação registrada por engano
> **para que** ela não distorça meu saldo e meus relatórios.

```gherkin
Funcionalidade: Excluir transação

  Cenário: Exclusão de transação existente
    Dado que existe uma transação com id "abc"
    Quando eu envio DELETE /transacoes/abc
    Então recebo o status 204
    E GET /transacoes/abc retorna 404

  Cenário: Exclusão de transação inexistente
    Quando eu envio DELETE /transacoes/nao-existe
    Então recebo o status 404
```

---

## US06 — Listar e criar categorias

> **Como** usuário,
> **quero** ter categorias prontas e poder criar as minhas
> **para que** eu organize as transações do jeito que faz sentido para a minha vida.

```gherkin
Funcionalidade: Listar e criar categorias

  Cenário: Categorias padrão
    Dado que a aplicação foi iniciada pela primeira vez
    Quando eu envio GET /categorias
    Então recebo Alimentação, Educação, Lazer, Moradia, Outros, Salário, Saúde e Transporte

  Cenário: Criar categoria nova
    Quando eu envio POST /categorias com nome "Pets"
    Então recebo o status 201
    E "Pets" passa a aparecer em GET /categorias

  Cenário: Nome duplicado
    Dado que existe a categoria "Lazer"
    Quando eu envio POST /categorias com nome " lazer "
    Então recebo o status 409

  Cenário: Nome vazio
    Quando eu envio POST /categorias com nome ""
    Então recebo o status 400
```

---

## US07 — Excluir categoria com segurança

> **Como** usuário,
> **quero** excluir categorias que não uso mais, sem perder a consistência dos meus dados
> **para que** a lista de categorias fique enxuta sem deixar transações "órfãs".

```gherkin
Funcionalidade: Excluir categoria

  Cenário: Categoria sem uso
    Dado que a categoria "Pets" não é usada por nenhuma transação
    Quando eu envio DELETE /categorias/{id}
    Então recebo o status 204

  Cenário: Categoria em uso
    Dado que existe uma transação na categoria "Alimentação"
    Quando eu envio DELETE /categorias/{id de Alimentação}
    Então recebo o status 409
    E a categoria continua existindo

  Cenário: Categoria inexistente
    Quando eu envio DELETE /categorias/nao-existe
    Então recebo o status 404
```

---

## US08 — Consultar saldo geral

> **Como** usuário,
> **quero** saber meu saldo geral considerando todas as transações
> **para que** eu saiba quanto dinheiro tenho disponível.

```gherkin
Funcionalidade: Saldo geral

  Cenário: Saldo com receitas e despesas
    Dado receitas totais de 5000.00 e despesas totais de 3250.40
    Quando eu envio GET /resumo
    Então recebo totalReceitas 5000, totalDespesas 3250.4 e saldo 1749.6

  Cenário: Sem transações
    Quando eu envio GET /resumo
    Então recebo totalReceitas 0, totalDespesas 0 e saldo 0
```

---

## US09 — Consultar resumo mensal

> **Como** usuário,
> **quero** ver o resumo de um mês com totais por categoria
> **para que** eu identifique onde estou gastando mais e ajuste meus hábitos.

```gherkin
Funcionalidade: Resumo mensal

  Cenário: Resumo de novembro
    Dado receita de 3000.00 (Salário) e despesas de 1000.00 (Moradia) e 200.50 (Alimentação) em novembro de 2026
    E uma despesa de 99.90 em outubro de 2026
    Quando eu envio GET /resumo?mes=2026-11
    Então recebo totalReceitas 3000, totalDespesas 1200.5 e saldo 1799.5
    E "porCategoria" lista Moradia 1000, Alimentação 200.5 e Salário 3000

  Cenário: Precisão monetária
    Dado despesas de 0.10 e 0.20 em novembro de 2026
    Quando eu envio GET /resumo?mes=2026-11
    Então totalDespesas é exatamente 0.3

  Cenário: Mês inválido
    Quando eu envio GET /resumo?mes=11-2026
    Então recebo o status 400
```

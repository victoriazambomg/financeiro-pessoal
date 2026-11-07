# 🤝 Guia de Contribuição (CONTRIBUTING.md)

Obrigado pelo interesse em contribuir com o **Financeiro Pessoal**! Este documento descreve o fluxo de trabalho de engenharia, padrões de código, commits, testes e documentação adotados no repositório.

---

## 1. Fluxo de Branches (Git Flow)

Nunca realize commits diretamente na branch `main`. Todo trabalho deve partir de uma Issue cadastrada no GitHub e seguir o fluxo:

1. **Crie ou selecione uma Issue** no [GitHub Issues](https://github.com/victoriazambomg/financeiro-pessoal/issues).
2. A partir da branch `develop` atualizada, crie uma branch temática:
   - `feature/issue-NN-descricao-curta` — novas funcionalidades
   - `fix/issue-NN-descricao-curta` — correções de bugs
   - `docs/issue-NN-descricao-curta` — documentação e especificações
   - `test/issue-NN-descricao-curta` — testes automatizados e desempenho
   - `chore/issue-NN-descricao-curta` — governança, CI/CD e configuração
3. Faça **commits atômicos** referenciando a issue (`#NN`).
4. Abra um **Pull Request** para `develop` incluindo `Closes #NN` na descrição.
5. Para publicar uma versão estável, crie uma branch `release/vX.Y.Z` a partir de `develop`, abra PR para `main`, gere a **tag anotada SemVer** (`git tag -a vX.Y.Z`) e sincronize `main` de volta em `develop`.

---

## 2. Padrão de Commits (Conventional Commits)

Seguimos a especificação [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/):

```text
<tipo>(<escopo>): <descrição curta no imperativo> (#<numero-da-issue>)
```

### Tipos permitidos
- `feat`: nova funcionalidade (`feat(transacoes): cadastrar transacao (#9)`)
- `fix`: correção de bug (`fix(persistencia): serializar escritas concorrentes com mutex (#44)`)
- `docs`: documentação (`docs(rastreabilidade): estender matriz a todos os RNFs e testes (#43)`)
- `test`: criação ou ajuste de testes (`test(perf): validar RNF02 com 10.000 transacoes < 200ms (#42)`)
- `ci`: pipelines e workflows do GitHub Actions
- `build`: dependências, TypeScript e scripts de build
- `chore`: templates, governança e manutenção

---

## 3. Qualidade, Testes e Regra de Sincronização

Antes de abrir um Pull Request, execute localmente:

```bash
npm run typecheck       # Verifica tipos TypeScript (strict: true)
npm run build           # Compila para dist/
npm run test:coverage   # Executa todos os testes e valida cobertura >= 80%
```

### Regra de Sincronização Documentação ↔ Código
Qualquer Pull Request que crie ou altere um Requisito Funcional (`RF`), Requisito Não Funcional (`RNF`) ou contrato de rota HTTP **deve obrigatoriamente atualizar no mesmo PR**:
- [`docs/requisitos.md`](./docs/requisitos.md) e [`docs/rastreabilidade.md`](./docs/rastreabilidade.md)
- [`docs/openapi.yaml`](./docs/openapi.yaml)
- [`README.md`](./README.md) e [`docs/README.md`](./docs/README.md)

# Desafio: implementar a álgebra relacional

Um "banco de dados relacional" nasce da teoria de relações que você estudou:
**uma tabela é uma relação (conjunto de tuplas), e as operações de query são
operações de conjunto/relação.** Neste desafio você implementa cada uma dessas
operações como um método da classe `Relation`, com API encadeável:

```ts
usuarios.select(u => u.cidade === "SP").project(["nome"]).orderBy(r => r.nome);
```

O foco é **só o modelo relacional** — nada de disco, índice ou transação.

## Como rodar

```bash
npm install
npm run check   # roda o verificador: mostra ✅ / ❌ / ⚪ por operação
npm run play    # seu playground pra experimentar queries
```

Cada método começa lançando `"não implementado"` → aparece como ⚪ pendente.
Implemente em `src/Relation.ts`, rode `npm run check` e veja virar ✅.

## Ordem sugerida (do mais simples ao que reaproveita os anteriores)

0. **`rowKey`** — a "impressão digital" de conteúdo de uma linha. É a **base**
   de todas as operações de conjunto: transforma a linha numa string canônica
   pra comparar por conteúdo (e não por identidade de objeto). Comece por aqui.
1. **`distinct`** — Regra 1 do conjunto (sem repetição). Base pra vários outros.
2. **`select`** (σ / WHERE) — subconjunto por condição. É o `filter`.
3. **`project`** (π / SELECT colunas) — reduz colunas; lembre de deduplicar.
4. **`union`** (∪), **`intersect`** (∩), **`except`** (∖) — as operações de conjunto.
   Repare: `except` **não é simétrico** (`A∖B ≠ B∖A`).
5. **`cross`** (× / CROSS JOIN) — produto cartesiano: `|A| × |B|` linhas.
6. **`join`** (⋈ / JOIN ON) — **produto cartesiano + seleção**. Reaproveite `cross` + `select`.
7. **`orderBy`** (ORDER BY) — ordem total (uma fila).
8. **`groupBy`** (GROUP BY) — classes de equivalência: particiona em grupos disjuntos.

## Mapa teoria ↔ operação ↔ SQL

| Método | Álgebra | SQL | Teoria (do seu material) |
|---|---|---|---|
| `distinct` | — | `DISTINCT` | conjunto não tem repetição |
| `select` | σ | `WHERE` | relação = subconjunto do produto (filtra tuplas) |
| `project` | π | `SELECT col` | fica com algumas posições da tupla |
| `union` | ∪ | `UNION` | união de conjuntos |
| `intersect` | ∩ | `INTERSECT` | interseção |
| `except` | ∖ | `EXCEPT` | diferença (não simétrica) |
| `cross` | × | `CROSS JOIN` | produto cartesiano (`\|A\|×\|B\|`) |
| `join` | ⋈ | `JOIN ON` | produto cartesiano **+** seleção |
| `orderBy` | — | `ORDER BY` | ordem total |
| `groupBy` | — | `GROUP BY` | relação de equivalência → partição |

## Dicas que já estão no código

- Você vai implementar `rowKey(row)` (passo 0): ele gera uma chave por
  **conteúdo** da linha. Use nos métodos de conjunto (`distinct`, `union`,
  `intersect`, `except`), porque objetos são comparados por *identidade* — não
  por conteúdo (aquele "cuidado" do material de conjuntos).
- Tudo é **imutável**: retorne sempre uma **nova** `Relation`, nunca altere
  `this.rows`. É isso que permite encadear sem efeitos colaterais.
- `join` fica curtinho se você chamar `this.cross(other).select(...)`.

## Quando terminar

Rode `npm run play` e monte a query "total de pedidos por usuário"
(`join` + `groupBy` + soma). Se ela sair certa, você reconstruiu o núcleo
conceitual de um banco relacional usando só teoria de conjuntos e relações.

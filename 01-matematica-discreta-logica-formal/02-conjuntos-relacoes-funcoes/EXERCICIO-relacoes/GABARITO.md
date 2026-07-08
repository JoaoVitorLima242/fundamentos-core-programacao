# Gabarito — álgebra relacional

Para cada método: **como funciona** (código comentado), **o que representa na
teoria** (produto cartesiano / conjunto / relação) e **como um banco de dados
real faz isso** no mundo real. Não abra antes de tentar — o valor está em travar
e destravar sozinho.

> Regra que atravessa tudo: **uma tabela é uma relação = um conjunto de tuplas.**
> Toda query é uma composição de operações de conjunto/relação sobre esse conjunto.

---

## 0) `rowKey` — a impressão digital de conteúdo

```ts
protected rowKey(row: T): string {
  const ordenado = Object.keys(row)
    .sort()                                    // chaves em ordem canônica
    .reduce<Row>((acc, k) => ((acc[k] = row[k]), acc), {});
  return JSON.stringify(ordenado);             // conteúdo -> string
}
```

**Como funciona.** Ordena as chaves alfabeticamente, reconstrói o objeto nessa
ordem e serializa. Assim `{a:1,b:2}` e `{b:2,a:1}` — o mesmo conteúdo em ordem
diferente — geram a **mesma** string. Comparar strings é comparar por conteúdo.

**Teoria.** Resolve o "cuidado" do material de conjuntos: em JS, objetos são
comparados por **identidade** (`{x:1} === {x:1}` é `false`), mas um conjunto
precisa de igualdade por **conteúdo**. `rowKey` é a ponte: transforma a pergunta
"essas duas tuplas são iguais?" numa comparação de strings. É a base de `∈`
(pertinência) para tuplas.

**No banco real.** Bancos comparam linhas por **valor** o tempo todo, e a
"chave canônica" aparece de formas mais eficientes que uma string JSON:
- **hashing de tupla** — um hash dos bytes dos campos (usado em hash join, hash
  aggregation, `DISTINCT`). Nosso `rowKey` é um hash "de pobre".
- **chave de ordenação** (sort key) — a forma binária comparável usada em
  índices B-tree e `ORDER BY`.

---

## 1) `distinct` — σ do conjunto: sem repetição

```ts
distinct(): Relation<T> {
  const vistos = new Set<string>();
  const out: T[] = [];
  for (const row of this.rows) {
    const k = this.rowKey(row);
    if (!vistos.has(k)) { vistos.add(k); out.push(row); }
  }
  return new Relation(out);
}
```

**Teoria.** Regra 1 do conjunto: **nenhum elemento se repete**. Toda operação de
conjunto termina "normalizando" pra essa forma.

**No banco real.** `SELECT DISTINCT` (e `UNION`, que deduplica). O motor usa uma
das duas estratégias:
- **hash aggregate** — joga cada linha num hash table pela sua chave; colisão de
  conteúdo = duplicata, descarta. É o nosso `Set<string>`.
- **sort + unique** — ordena tudo e remove vizinhos iguais (duplicatas ficam
  adjacentes depois do sort). Escolhido quando a saída já precisa vir ordenada.

---

## 2) `select` (σ) — WHERE

```ts
select(predicate: (row: T) => boolean): Relation<T> {
  return new Relation(this.rows.filter(predicate));
}
```

**Teoria.** A **seleção** σ é `{ x ∈ R | predicate(x) }` — o **subconjunto** das
tuplas que satisfazem a condição. É a definição de "relação é subconjunto do
produto cartesiano" em ação: você recorta as linhas verdadeiras.

**No banco real.** `WHERE`. Aqui mora a maior otimização de todas:
- **full table scan** — lê todas as linhas e testa o predicado (nosso `filter`).
- **index scan** — se existe um índice B-tree na coluna do `WHERE`
  (`WHERE id = 3`), o banco **não** varre tudo: desce a árvore em O(log n) e vai
  direto nas linhas. É a diferença entre 3 leituras e 10 milhões.
O **query planner** decide qual usar estimando quantas linhas cada caminho lê.

---

## 3) `project` (π) — SELECT colunas

```ts
project<K extends keyof T>(keys: K[]): Relation<Pick<T, K>> {
  const reduzidas = this.rows.map((row) => {
    const o = {} as Pick<T, K>;
    for (const k of keys) o[k] = row[k];
    return o;
  });
  return new Relation(reduzidas).distinct();   // <- dedup é obrigatório
}
```

**Teoria.** A **projeção** π mantém só **algumas posições** de cada tupla (algumas
colunas). Detalhe crucial: jogar colunas fora pode criar **duplicatas** —
`{nome:"Ana",cidade:"SP"}` e `{nome:"Ana",cidade:"RJ"}` viram ambos `{nome:"Ana"}`.
Como o resultado é um **conjunto**, precisa deduplicar. Por isso `project` termina
com `.distinct()`.

**No banco real.** A lista de colunas do `SELECT`. Na prática, o SQL padrão
**não** deduplica automaticamente (é `SELECT ALL` por padrão, por performance) —
você pede `SELECT DISTINCT` explicitamente. Nosso modelo é o conjunto "puro", que
sempre deduplica. Bancos colunares (BigQuery, Redshift) adoram projeção: guardam
cada coluna separada, então "ficar com 2 de 50 colunas" lê só 2/50 do disco.

---

## 4) `union` (∪) — UNION

```ts
union(other: Relation<T>): Relation<T> {
  return new Relation([...this.rows, ...other.rows]).distinct();
}
```

**Teoria.** Tudo que está em A **ou** em B, sem repetição. Concatena e deduplica.

**No banco real.** `UNION` (com dedup) vs `UNION ALL` (sem dedup, mais barato).
O `UNION` puro custa uma passada de deduplicação (hash ou sort) depois de juntar —
é por isso que `UNION ALL` é preferido quando você **sabe** que não há sobreposição.

---

## 5) `intersect` (∩) — INTERSECT

```ts
intersect(other: Relation<T>): Relation<T> {
  const chavesOutro = new Set(other.rows.map((r) => this.rowKey(r)));
  return new Relation(
    this.rows.filter((r) => chavesOutro.has(this.rowKey(r)))
  ).distinct();
}
```

**Teoria.** Só o que está em A **e** em B. A dica do código é o padrão-ouro:
monte um `Set` das chaves de `other` uma vez, e o teste `∈` vira O(1) por linha —
o `has` é literalmente a pertinência `∈`.

**No banco real.** `INTERSECT`. É um **semi-join**: o motor constrói um hash das
chaves de um lado e sonda (probe) com o outro. Mesma mecânica do hash join, só que
devolve a linha em vez de combinar.

---

## 6) `except` (∖) — EXCEPT

```ts
except(other: Relation<T>): Relation<T> {
  const chavesOutro = new Set(other.rows.map((r) => this.rowKey(r)));
  return new Relation(
    this.rows.filter((r) => !chavesOutro.has(this.rowKey(r)))
  ).distinct();
}
```

**Teoria.** O que está em A e **não** está em B. Igual ao `intersect`, só troca
`has` por `!has`. **Não é simétrico**: `A∖B ≠ B∖A` (é a propriedade de
não-simetria de relações — a ordem importa).

**No banco real.** `EXCEPT` (ou `MINUS` no Oracle). É um **anti-join**: hash de um
lado, e mantém do outro só quem **não** casa. Aparece muito em "clientes sem
pedidos", "registros órfãos", diffs.

---

## 7) `cross` (×) — CROSS JOIN = produto cartesiano

```ts
cross<U extends Row>(other: Relation<U>): Relation<T & U> {
  const out: (T & U)[] = [];
  for (const a of this.rows)
    for (const b of other.rows)
      out.push({ ...a, ...b });               // funde o par num objeto só
  return new Relation(out);
}
```

**Teoria.** ESTE método **É** o produto cartesiano: **todos** os pares `(a,b)`
com `a ∈ this` e `b ∈ other`. Cardinalidade `|this| × |other|` — dois loops
aninhados. É o "possível" do material: o espaço inteiro de combinações, antes de
qualquer filtro. Todas as outras junções são recortes deste conjunto.

**No banco real.** `CROSS JOIN`. Raramente escrito de propósito (explode: 10k × 10k
= 100 milhões de linhas), mas é o **fundamento teórico** de todo JOIN. O planner
**nunca** materializa o produto inteiro quando pode evitar — ele empurra o filtro
pra dentro do loop (é o próximo método).

---

## 8) `join` (⋈) — JOIN ON = produto cartesiano + seleção

```ts
join<U extends Row>(other: Relation<U>, on: (a: T, b: U) => boolean): Relation<T & U> {
  const out: (T & U)[] = [];
  for (const a of this.rows)
    for (const b of other.rows)
      if (on(a, b)) out.push({ ...a, ...b });  // só os pares que casam
  return new Relation(out);
  // equivalente conceitual: this.cross(other).select(par => on(...))
}
```

**Teoria.** JOIN = **produto cartesiano seguido de seleção**: forme todos os pares
(×) e mantenha só os que satisfazem `on` (σ). É a operação mais importante do
modelo relacional — reconstrói dados que foram **normalizados** em tabelas
separadas (usuários numa, pedidos noutra, ligados por `usuarioId`).

**No banco real.** É onde o motor mais sua, e onde a teoria "×then σ" NUNCA é
executada literalmente (seria O(n×m) sempre). Três algoritmos, o planner escolhe:
- **nested loop join** — os dois loops do código acima. Bom quando um lado é
  pequeno ou há índice no lado interno.
- **hash join** — constrói hash table da chave de um lado, sonda com o outro.
  O(n+m). O cavalo de batalha de `JOIN ... ON a = b` em tabelas grandes.
- **merge join** — ordena os dois lados pela chave e faz um "zíper". Ótimo quando
  os dados já vêm ordenados (ex.: de um índice).
A escolha entre `id = usuarioId` virar 100M de comparações (nested loop ingênuo)
ou n+m (hash) é literalmente a diferença entre uma query de horas e de segundos.

---

## 9) `orderBy` — ORDER BY = ordem total

```ts
orderBy(keyFn, direction = "asc"): Relation<T> {
  const sinal = direction === "asc" ? 1 : -1;
  const ordenadas = [...this.rows].sort((a, b) => {   // [...] = cópia, não muta
    const ka = keyFn(a), kb = keyFn(b);
    if (ka < kb) return -1 * sinal;
    if (ka > kb) return  1 * sinal;
    return 0;
  });
  return new Relation(ordenadas);
}
```

**Teoria.** Impõe uma **ordem total** — uma fila única onde quaisquer dois
elementos são comparáveis (`<`, `>` ou `=`). Um conjunto **não tem** ordem
semântica; `orderBy` é uma forma de **apresentar** o resultado, por isso vive no
fim da cadeia. Contraste com a ordem **parcial** do material: aqui todo par é
comparável, então dá pra enfileirar tudo.

**No banco real.** `ORDER BY`. Se existe um índice B-tree na coluna, a saída já
sai ordenada de graça (o índice **é** uma estrutura ordenada). Senão, o motor faz
um sort explícito — em memória se couber, senão um **external merge sort** que
usa disco em pedaços. `LIMIT` + `ORDER BY` vira um top-N sort (mantém só os N
melhores num heap, sem ordenar tudo).

---

## 10) `groupBy` — GROUP BY = classes de equivalência

```ts
groupBy<K>(keyFn: (row: T) => K): Map<K, Relation<T>> {
  const buckets = new Map<K, T[]>();
  for (const row of this.rows) {
    const k = keyFn(row);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(row);
  }
  const out = new Map<K, Relation<T>>();
  for (const [k, rows] of buckets) out.set(k, new Relation(rows));
  return out;
}
```

**Teoria.** `keyFn` define a relação de equivalência **"ter a mesma chave"**
(reflexiva + simétrica + transitiva). Ela **particiona** o conjunto: cada linha
cai em **exatamente um** balde (classe de equivalência), **nada sobra** e **nada
se sobrepõe**. O `Map` retornado É a partição. Por isso agrupar *sempre* dá grupos
disjuntos que cobrem tudo — não é sorte de implementação, é a matemática da
equivalência garantindo isso.

**No banco real.** `GROUP BY`, quase sempre com uma agregação em cima
(`COUNT`, `SUM`, `AVG`). Duas estratégias:
- **hash aggregation** — hash table pela chave do grupo, acumula o agregado em
  cada balde. É o nosso `Map`.
- **sort + group** — ordena pela chave, e grupos viram trechos adjacentes.
O agregado normalmente é calculado **junto** com o agrupamento (running sum por
balde), sem materializar as linhas — mais enxuto que devolver `Relation` por grupo
como fazemos aqui pra fins didáticos.

---

## A query final: "total de pedidos por usuário"

Junta três conceitos — reconstrução via JOIN, partição via GROUP BY, e a soma:

```ts
const porUsuario = usuarios
  .join(pedidos, (u, p) => u.id === p.usuarioId)  // ⋈ : reconecta o que normalizamos
  .groupBy((r) => r.nome);                        // partição por usuário

for (const [nome, rel] of porUsuario) {
  const total = rel.toArray().reduce((s, r) => s + (r.valor as number), 0);
  console.log(nome, "=>", total);                 // Ana => 80, Bia => 20, Caio => 95
}
```

Em SQL, exatamente o mesmo:

```sql
SELECT u.nome, SUM(p.valor) AS total
FROM usuarios u
JOIN pedidos p ON u.id = p.usuarioId
GROUP BY u.nome;
```

O que você reconstruiu: **produto cartesiano → seleção (JOIN) → partição por
equivalência (GROUP BY) → agregação.** É o núcleo conceitual de todo banco
relacional, saído direto da teoria de conjuntos e relações — sem disco, índice ou
transação, só a álgebra.

---

## Resumo — teoria ↔ operação ↔ banco real

| Método | Teoria | O que o banco faz de verdade |
|---|---|---|
| `rowKey` | igualdade por conteúdo (`∈` de tuplas) | hash de tupla / sort key |
| `distinct` | conjunto sem repetição | hash aggregate ou sort+unique |
| `select` | σ: subconjunto do produto | index scan vs full table scan |
| `project` | π: algumas posições da tupla | leitura colunar; dedup opcional |
| `union` | A ∪ B | UNION (dedup) vs UNION ALL |
| `intersect` | A ∩ B | semi-join (hash + probe) |
| `except` | A ∖ B (não simétrico) | anti-join |
| `cross` | produto cartesiano `|A|×|B|` | base teórica; nunca materializado à toa |
| `join` | × + σ | nested loop / hash / merge join |
| `orderBy` | ordem total | índice B-tree ou external merge sort |
| `groupBy` | equivalência → partição | hash aggregation ou sort+group |

/**
 * Relation — uma "tabela" é uma relação no sentido matemático:
 * um conjunto de tuplas (linhas). Cada método abaixo é uma operação da
 * ÁLGEBRA RELACIONAL, que é a base matemática do SQL.
 *
 * Regras do jogo:
 *  - Toda operação é IMUTÁVEL: retorna uma NOVA Relation, nunca altera `this`.
 *    (Isso permite o encadeamento: r.select(...).project(...).orderBy(...))
 *  - Uma relação é um CONJUNTO: sem linhas duplicadas e sem ordem semântica.
 *    (Na prática guardamos num array por conveniência — mas o significado é de conjunto.)
 *
 * Implemente cada método marcado com TODO. Rode `npm run check` a cada um
 * para ver ✅/❌. Sugestão de ordem no README.
 */

export type Row = Record<string, unknown>;

export class Relation<T extends Row = Row> {
  constructor(public readonly rows: readonly T[]) {}

  /** Atalho pra criar uma relação a partir de um array de linhas. */
  static of<R extends Row>(rows: R[]): Relation<R> {
    return new Relation(rows);
  }

  /** Devolve as linhas como array simples (fim da cadeia). */
  toArray(): T[] {
    return [...this.rows];
  }

  // ──────────────────────────────────────────────────────────────
  // 0) rowKey — a "impressão digital" de conteúdo de uma linha (BASE DE TUDO)
  //
  //    Problema: no material de conjuntos vimos que `Set`/`===` comparam
  //    objetos por IDENTIDADE (mesmo objeto na memória), não por conteúdo:
  //        { x: 1 } === { x: 1 }   // false!  são dois objetos distintos
  //    Então um Set nunca deduplicaria linhas iguais, e as operações de
  //    conjunto (distinct/union/intersect/except) não funcionariam.
  //
  //    Solução: transformar cada linha numa STRING canônica. Strings comparam
  //    por CONTEÚDO ("foo" === "foo" é true), então viram uma chave confiável.
  //
  //    TODO: retornar uma string que represente o CONTEÚDO de `row`, de forma
  //    CANÔNICA — duas linhas com o mesmo conteúdo devem gerar a MESMA string,
  //    não importa em que ordem as chaves foram escritas:
  //        rowKey({ a: 1, b: 2 })  deve ser IGUAL a  rowKey({ b: 2, a: 1 })
  //        rowKey({ x: 1 })        deve ser DIFERENTE de  rowKey({ x: 2 })
  //    Dica: ordene as chaves (Object.keys + .sort()), reconstrua o objeto
  //    nessa ordem e serialize com JSON.stringify.
  // ──────────────────────────────────────────────────────────────
  protected rowKey(row: T): string {
    throw new Error("rowKey: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 1) distinct — remove duplicatas (Regra 1 do conjunto: sem repetição)
  //    Teoria: um conjunto não tem elementos repetidos.
  //    TODO: retornar uma nova Relation sem linhas de conteúdo repetido.
  //    Dica: use rowKey(row) pra detectar repetição por conteúdo.
  // ──────────────────────────────────────────────────────────────
  distinct(): Relation<T> {
    throw new Error("distinct: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 2) select — σ (seleção)  |  SQL: WHERE
  //    Teoria: relação é subconjunto do produto cartesiano; a seleção mantém
  //    só as tuplas que satisfazem a condição: { x ∈ R | predicate(x) }.
  //    TODO: retornar uma Relation só com as linhas em que predicate(row) é true.
  // ──────────────────────────────────────────────────────────────
  select(predicate: (row: T) => boolean): Relation<T> {
    throw new Error("select: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 3) project — π (projeção)  |  SQL: SELECT col1, col2
  //    Teoria: fica só com ALGUMAS "posições" de cada tupla (algumas colunas).
  //    Atenção: projetar pode gerar linhas repetidas — o resultado, como conjunto,
  //    NÃO deveria ter duplicatas.
  //    TODO: retornar uma Relation só com as chaves pedidas, SEM duplicatas.
  //    Dica: monte o objeto reduzido e reaproveite a lógica de distinct.
  // ──────────────────────────────────────────────────────────────
  project<K extends keyof T>(keys: K[]): Relation<Pick<T, K>> {
    throw new Error("project: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 4) union — ∪  |  SQL: UNION
  //    Teoria: tudo que está em A OU em B, sem repetição.
  //    TODO: retornar a união das duas relações (sem duplicatas por conteúdo).
  // ──────────────────────────────────────────────────────────────
  union(other: Relation<T>): Relation<T> {
    throw new Error("union: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 5) intersect — ∩  |  SQL: INTERSECT
  //    Teoria: só o que está em A E em B ao mesmo tempo.
  //    TODO: retornar a interseção (linhas presentes nas duas, por conteúdo).
  //    Dica: um Set das chaves de `other` deixa a checagem O(1) (has = ∈).
  // ──────────────────────────────────────────────────────────────
  intersect(other: Relation<T>): Relation<T> {
    throw new Error("intersect: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 6) except — ∖ (diferença)  |  SQL: EXCEPT
  //    Teoria: o que está em A e NÃO está em B.
  //    ATENÇÃO: diferença NÃO é simétrica. a.except(b) ≠ b.except(a).
  //    TODO: retornar as linhas de `this` que não existem em `other`.
  // ──────────────────────────────────────────────────────────────
  except(other: Relation<T>): Relation<T> {
    throw new Error("except: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 7) cross — × (produto cartesiano)  |  SQL: CROSS JOIN
  //    Teoria: TODOS os pares (a, b) com a ∈ this e b ∈ other.
  //    Cardinalidade: |this| × |other|  (é aqui que as coisas explodem!)
  //    TODO: retornar todas as combinações, fundindo cada par num objeto só
  //          (ex.: { ...a, ...b }).
  // ──────────────────────────────────────────────────────────────
  cross<U extends Row>(other: Relation<U>): Relation<T & U> {
    throw new Error("cross: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 8) join — ⋈ (junção)  |  SQL: JOIN ... ON
  //    Teoria: JOIN = produto cartesiano SEGUIDO de uma seleção.
  //
  //    O QUE RETORNAR: uma Relation com as linhas FUNDIDAS { ...a, ...b } —
  //    mesmo formato do cross() — mas SÓ dos pares (a, b) em que on(a, b) é true.
  //    Ex.: usuarios.join(pedidos, (u,p) => u.id === p.usuarioId) devolve
  //         linhas tipo { id, nome, cidade, pedidoId, usuarioId, valor }.
  //
  //    Jeito mais simples: DOIS loops + if (igual ao cross, mas com o filtro):
  //        for (const a of this.rows)
  //          for (const b of other.rows)
  //            if (on(a, b)) result.push({ ...a, ...b });
  //
  //    Obs.: NÃO dá pra fazer this.cross(other).select(on) direto, porque o
  //    `select` passa UMA linha (já fundida) ao predicado, mas `on` espera DOIS
  //    argumentos (a, b) separados. As assinaturas não batem.
  // ──────────────────────────────────────────────────────────────
  join<U extends Row>(
    other: Relation<U>,
    on: (a: T, b: U) => boolean
  ): Relation<T & U> {
    throw new Error("join: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 9) orderBy — ordem TOTAL  |  SQL: ORDER BY
  //    Teoria: uma ordem total enfileira todos os elementos (todos comparáveis).
  //    Obs.: conjunto não tem ordem; orderBy é uma forma de APRESENTAR o
  //    resultado, no fim da cadeia.
  //    TODO: retornar uma nova Relation com as linhas ordenadas por keyFn.
  //    `direction` = "asc" | "desc". Não mute o array original (use [...].sort()).
  // ──────────────────────────────────────────────────────────────
  orderBy(
    keyFn: (row: T) => number | string,
    direction: "asc" | "desc" = "asc"
  ): Relation<T> {
    throw new Error("orderBy: não implementado");
  }

  // ──────────────────────────────────────────────────────────────
  // 10) groupBy — classes de equivalência  |  SQL: GROUP BY
  //    Teoria: a relação de equivalência "ter a mesma chave" PARTICIONA o
  //    conjunto em grupos disjuntos que cobrem tudo (nada sobra, nada se sobrepõe).
  //    Cada grupo é uma CLASSE DE EQUIVALÊNCIA.
  //    TODO: retornar um Map onde a chave é o resultado de keyFn e o valor é a
  //          Relation com as linhas daquele grupo.
  // ──────────────────────────────────────────────────────────────
  groupBy<K>(keyFn: (row: T) => K): Map<K, Relation<T>> {
    throw new Error("groupBy: não implementado");
  }
}

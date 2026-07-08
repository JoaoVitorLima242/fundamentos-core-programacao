/**
 * Verificador do desafio. Rode com:  npm run check
 *
 * Cada operação ainda não implementada aparece como ⚪ (pendente).
 * Quando você implementa e acerta, vira ✅. Se implementou mas o resultado
 * diverge do esperado, vira ❌ com o diff.
 *
 * Comparação por CONTEÚDO e sem depender de ordem (relação é conjunto):
 * ordenamos as duas listas por uma chave canônica antes de comparar.
 */
import { Relation, Row } from "./Relation";
import { usuarios, pedidos, A, B } from "./data";

// ---- utilidades do verificador -------------------------------------------

const canon = (row: Row) =>
  JSON.stringify(
    Object.keys(row)
      .sort()
      .reduce<Row>((acc, k) => ((acc[k] = row[k]), acc), {})
  );

/** Igualdade de duas listas de linhas como CONJUNTOS (ignora ordem). */
function sameSet(got: Row[], expected: Row[]): boolean {
  const g = got.map(canon).sort();
  const e = expected.map(canon).sort();
  return g.length === e.length && g.every((v, i) => v === e[i]);
}

/** Igualdade respeitando a ordem (pra orderBy). */
function sameSeq(got: Row[], expected: Row[]): boolean {
  return (
    got.length === expected.length &&
    got.every((v, i) => canon(v) === canon(expected[i]))
  );
}

/**
 * rowKey é `protected` (uso interno da Relation). Pra testá-lo diretamente,
 * expomos numa subclasse — subclasses enxergam membros protected.
 */
class RelationExposta extends Relation {
  key(row: Row) {
    return this.rowKey(row);
  }
}
const rk = (row: Row) => new RelationExposta([]).key(row);

let ok = 0;
let done = 0;
const total = 12;

function testar(
  nome: string,
  fn: () => Row[],
  esperado: Row[],
  ordenado = false
) {
  try {
    const got = fn();
    const passou = ordenado ? sameSeq(got, esperado) : sameSet(got, esperado);
    if (passou) {
      console.log(`✅ ${nome}`);
      ok++;
    } else {
      console.log(`❌ ${nome}`);
      console.log(`   esperado: ${JSON.stringify(esperado)}`);
      console.log(`   obtido:   ${JSON.stringify(got)}`);
    }
    done++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("não implementado")) {
      console.log(`⚪ ${nome} — pendente`);
    } else {
      console.log(`❌ ${nome} — erro: ${msg}`);
      done++;
    }
  }
}

console.log("\n== Verificando implementações ==\n");

// 0) rowKey — a chave canônica de conteúdo (base das operações de conjunto)
testar(
  "rowKey (canônica: ordem das chaves não importa)",
  () => {
    const mesmoConteudo = rk({ a: 1, b: 2 }) === rk({ b: 2, a: 1 });
    const conteudoDif = rk({ x: 1 }) !== rk({ x: 2 });
    return [{ mesmoConteudo, conteudoDif }];
  },
  [{ mesmoConteudo: true, conteudoDif: true }]
);

// 1) distinct
testar(
  "distinct",
  () =>
    Relation.of([{ x: 1 }, { x: 1 }, { x: 2 }])
      .distinct()
      .toArray(),
  [{ x: 1 }, { x: 2 }]
);

// 2) select — usuários de SP
testar(
  "select (cidade = SP)",
  () => usuarios.select((u) => u.cidade === "SP").toArray(),
  [
    { id: 1, nome: "Ana", cidade: "SP" },
    { id: 3, nome: "Caio", cidade: "SP" },
  ]
);

// 3) project — só nome e cidade (com dedup: SP aparece 2x mas cidade sozinha não)
testar(
  "project (nome)",
  () => usuarios.project(["nome"]).toArray(),
  [{ nome: "Ana" }, { nome: "Bia" }, { nome: "Caio" }, { nome: "Duda" }]
);

// 4) union
testar("union (A ∪ B)", () => A.union(B).toArray(), [
  { x: 1 },
  { x: 2 },
  { x: 3 },
  { x: 4 },
  { x: 5 },
]);

// 5) intersect
testar("intersect (A ∩ B)", () => A.intersect(B).toArray(), [{ x: 3 }]);

// 6) except (não simétrico!)
testar("except (A ∖ B)", () => A.except(B).toArray(), [{ x: 1 }, { x: 2 }]);
testar("except (B ∖ A)", () => B.except(A).toArray(), [{ x: 4 }, { x: 5 }]);

// 7) cross — |A| × |B| = 3 × 3 = 9 pares
testar(
  "cross (A × B) tem 9 linhas",
  () => {
    const r = A.cross(B).toArray();
    // valida só a cardinalidade aqui (o conteúdo é grande)
    return [{ n: r.length }];
  },
  [{ n: 9 }]
);

// 8) join — usuarios ⋈ pedidos ON id = usuarioId
testar(
  "join (usuarios ⋈ pedidos)",
  () =>
    usuarios
      .join(pedidos, (u, p) => u.id === p.usuarioId)
      .project(["nome", "valor"])
      .toArray(),
  [
    { nome: "Ana", valor: 50 },
    { nome: "Ana", valor: 30 },
    { nome: "Bia", valor: 20 },
    { nome: "Caio", valor: 80 },
    { nome: "Caio", valor: 15 },
  ]
);

// 9) orderBy — valores decrescentes (ordem TOTAL, respeita sequência)
testar(
  "orderBy (valor desc)",
  () =>
    pedidos
      .orderBy((p) => p.valor as number, "desc")
      .project(["valor"])
      .toArray(),
  [{ valor: 80 }, { valor: 50 }, { valor: 30 }, { valor: 20 }, { valor: 15 }],
  true // respeitar ordem
);

// 10) groupBy — classes de equivalência por cidade
testar(
  "groupBy (cidade) — SP tem 2",
  () => {
    const grupos = usuarios.groupBy((u) => u.cidade);
    const sp = grupos.get("SP");
    return [{ n: sp ? sp.toArray().length : -1 }];
  },
  [{ n: 2 }]
);

console.log(
  `\n== ${ok}/${total} passando  |  ${total - done} pendente(s) ==\n`
);

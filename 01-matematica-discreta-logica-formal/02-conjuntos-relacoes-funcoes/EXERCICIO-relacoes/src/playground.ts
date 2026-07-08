/**
 * Playground — seu espaço pra experimentar. Rode com:  npm run play
 *
 * Depois de implementar os métodos em Relation.ts, monte queries encadeadas
 * e veja o resultado. Exemplos pra descomentar conforme for implementando:
 */
import { usuarios, pedidos } from "./data";

// SELECT nome FROM usuarios WHERE cidade = 'SP'
// console.log(
//   usuarios.select((u) => u.cidade === "SP").project(["nome"]).toArray()
// );

// Total de pedidos por usuário (join + groupBy):
// const porUsuario = usuarios
//   .join(pedidos, (u, p) => u.id === p.usuarioId)
//   .groupBy((r) => r.nome);
// for (const [nome, rel] of porUsuario) {
//   const total = rel.toArray().reduce((s, r) => s + (r.valor as number), 0);
//   console.log(nome, "=>", total);
// }

console.log("Implemente os métodos em src/Relation.ts e descomente os exemplos acima.");

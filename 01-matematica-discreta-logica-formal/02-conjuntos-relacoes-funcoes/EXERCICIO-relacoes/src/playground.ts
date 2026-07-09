import { usuarios, pedidos } from "./data";

console.log(
  usuarios.select((u) => u.cidade === "SP").project(["nome"]).toArray()
);

const porUsuario = usuarios
  .join(pedidos, (u, p) => u.id === p.usuarioId)
  .groupBy((r) => r.nome);

for (const [nome, rel] of porUsuario) {
  const total = rel.toArray().reduce((s, r) => s + (r.valor as number), 0);
  console.log(nome, "=>", total);
}

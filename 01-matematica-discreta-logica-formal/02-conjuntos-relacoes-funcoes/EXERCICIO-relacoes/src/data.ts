import { Relation } from "./Relation";

/** "Tabela" usuarios — uma relação de grau 3 (id, nome, cidade). */
export const usuarios = Relation.of([
  { id: 1, nome: "Ana", cidade: "SP" },
  { id: 2, nome: "Bia", cidade: "RJ" },
  { id: 3, nome: "Caio", cidade: "SP" },
  { id: 4, nome: "Duda", cidade: "MG" },
]);

/** "Tabela" pedidos — cada pedido aponta pra um usuario via usuarioId. */
export const pedidos = Relation.of([
  { pedidoId: 10, usuarioId: 1, valor: 50 },
  { pedidoId: 11, usuarioId: 1, valor: 30 },
  { pedidoId: 12, usuarioId: 2, valor: 20 },
  { pedidoId: 13, usuarioId: 3, valor: 80 },
  { pedidoId: 14, usuarioId: 3, valor: 15 },
]);

/**
 * Duas relações pequenas pra testar operações de CONJUNTO (union/intersect/except).
 * Elas compartilham a coluna `x` de propósito: essas operações só fazem sentido
 * entre relações do MESMO esquema (comparar maçã com maçã).
 */
export const A = Relation.of([{ x: 1 }, { x: 2 }, { x: 3 }]);
export const B = Relation.of([{ x: 3 }, { x: 4 }, { x: 5 }]);

/**
 * Par para o PRODUTO CARTESIANO (cross). Aqui as colunas são DIFERENTES
 * (`cor` e `tam`) — assim a fusão { ...a, ...b } não colide, e cada par
 * combinado fica visível: cor × tamanho.
 */
export const cores = Relation.of([{ cor: "vermelho" }, { cor: "azul" }]);
export const tamanhos = Relation.of([{ tam: "P" }, { tam: "G" }]);

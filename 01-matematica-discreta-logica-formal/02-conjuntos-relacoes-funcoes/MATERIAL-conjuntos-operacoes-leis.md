# Operações e leis dos conjuntos

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em JavaScript, lado a lado. Aqui os conjuntos deixam de ser estáticos e passam a se **combinar**: juntar permissões, achar o que dois usuários têm em comum, descobrir o que falta. **E tem um segredo no fim: cada operação de conjunto é um operador lógico da aula 01 disfarçado — quem entende isso simplifica query e filtro sem esforço.**

> Este documento cobre: as quatro operações (união, interseção, diferença, complemento) e as leis que as governam (comutativa, associativa, distributiva, De Morgan, identidades, absorção). Apoia-se nos fundamentos e em subconjuntos.

---

## Parte 1 — As operações

### 1. União (`∪`) — "tudo, junto"

Tudo que está em $A$ **ou** em $B$ (ou nos dois):

$$A \cup B = \{x \mid x \in A \ \text{ou}\ x \in B\}$$

Aquele **"ou"** é o `∨` da lógica — inclusivo (vale até se estiver nos dois).

$$A = \{1,2,3\} \quad B = \{3,4,5\} \quad A \cup B = \{1,2,3,4,5\}$$

O 3 estava nos dois mas aparece **uma vez só** — a Regra 1 (sem repetição) continua valendo.

```js
const A = new Set([1, 2, 3]);
const B = new Set([3, 4, 5]);
const uniao = new Set([...A, ...B]);
console.log(uniao); // Set(5) { 1, 2, 3, 4, 5 }
```

**Caso real:** juntar permissões de dois papéis — quem é "editor" e "revisor" tem a união das permissões dos dois.

### 2. Interseção (`∩`) — "só o que é comum"

O que está em $A$ **e** em $B$ ao mesmo tempo:

$$A \cap B = \{x \mid x \in A \ \text{e}\ x \in B\}$$

Agora é o **"e"** (`∧` da lógica).

$$A = \{1,2,3\} \quad B = \{3,4,5\} \quad A \cap B = \{3\}$$

```js
const inter = new Set([...A].filter(x => B.has(x)));
console.log(inter); // Set(1) { 3 }
```

O `filter` é o "tal que"; o `B.has(x)` é o `x ∈ B`. A condição é "$x \in A$ **e** $x \in B$".

**Caso real:** "amigos em comum", "produtos nas duas listas de desejo", "esse usuário tem algum papel com acesso a isto?".

### 3. Diferença (`\`) — "o que está em um mas não no outro"

O que está em $A$ **e não** em $B$:

$$A \setminus B = \{x \mid x \in A \ \text{e}\ x \notin B\}$$

$$A = \{1,2,3\} \quad B = \{3,4,5\} \quad A \setminus B = \{1,2\}$$

```js
const dif = new Set([...A].filter(x => !B.has(x)));
console.log(dif); // Set(2) { 1, 2 }
```

É o filter com a condição **negada**.

> **Cuidado — diferença não é simétrica.** $A \setminus B \neq B \setminus A$. Com os conjuntos acima: $A \setminus B = \{1,2\}$, mas $B \setminus A = \{4,5\}$. A ordem muda a **pergunta**: "o que é exclusivo de $A$?" vs "o que é exclusivo de $B$?". (União e interseção, ao contrário, são simétricas.) Trocar a ordem no código não é detalhe estético — é responder a pergunta errada. "Campos obrigatórios que faltaram" ($\text{obrigatórios} \setminus \text{recebidos}$) é o oposto de "campos extras enviados" ($\text{recebidos} \setminus \text{obrigatórios}$).

**Caso real:** "quais campos obrigatórios faltaram?", "quem estava na lista de ontem e não está na de hoje?".

### 4. Complemento (`Ā`) — "tudo que está fora"

Tudo que **não** está em $A$ — mas só faz sentido dentro de um **universo** $U$:

$$\overline{A} = U \setminus A = \{x \mid x \in U \ \text{e}\ x \notin A\}$$

Complemento é um caso especial de diferença, com o universo à esquerda. Universo = dígitos 0–9, $A$ = pares:

$$U = \{0,...,9\} \quad A = \{0,2,4,6,8\} \quad \overline{A} = \{1,3,5,7,9\}$$

```js
const U = new Set([0,1,2,3,4,5,6,7,8,9]);
const A = new Set([0,2,4,6,8]);
const compl = new Set([...U].filter(x => !A.has(x)));
console.log(compl); // Set(5) { 1, 3, 5, 7, 9 }
```

> **Cuidado:** complemento **depende do universo**. "Não-pares" entre dígitos é $\{1,3,5,7,9\}$; entre todos os inteiros seria infinito. Sem definir $U$, complemento não tem resposta — e isso vira bug quando o código assume um universo que não garante.

### Resumo das quatro

| Operação | Símbolo | Pergunta | Lógica | Código |
|---|---|---|---|---|
| União | $A \cup B$ | "tudo dos dois" | ou (`∨`) | `new Set([...A, ...B])` |
| Interseção | $A \cap B$ | "o que é comum" | e (`∧`) | `[...A].filter(x => B.has(x))` |
| Diferença | $A \setminus B$ | "só em A" | e não (`∧¬`) | `[...A].filter(x => !B.has(x))` |
| Complemento | $\overline{A}$ | "tudo fora de A" | não (`¬`) | `[...U].filter(x => !A.has(x))` |

---

## Parte 2 — As leis

O dicionário que torna tudo óbvio — é só uma tradução da lógica da aula 01:

| Lógica | Conjunto | Significa |
|---|---|---|
| `∧` (e) | `∩` (interseção) | "o que é comum" |
| `∨` (ou) | `∪` (união) | "tudo junto" |
| `¬` (não) | complemento | "o que está fora" |

Com esse dicionário, toda lei de lógica se traduz direto pra conjunto.

### Comutativa — a ordem não importa

$$A \cup B = B \cup A \qquad A \cap B = B \cap A$$

(A diferença **não** tem essa lei — ela tem direção embutida.)

### Associativa — o agrupamento não importa

$$(A \cup B) \cup C = A \cup (B \cup C) \qquad (A \cap B) \cap C = A \cap (B \cap C)$$

Unir permissões de 3 papéis dá no mesmo, não importa quais dois você junta primeiro.

### Distributiva — a que fatora

$$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$$
$$A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$$

É a mesma `a && (b || c) === (a && b) || (a && c)` da aula 01, com `&&`→`∩` e `||`→`∪`. Serve pra reorganizar filtro composto: "VIP que é (de SP ou do RJ)" = "(VIP e de SP) ou (VIP e do RJ)".

### De Morgan — a mais importante

O complemento de um grupo **inverte a operação**:

$$\overline{A \cup B} = \overline{A} \cap \overline{B} \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}$$

"O que está fora de (A **ou** B)" = "o que está fora de A **e** fora de B". A negação entra e o `∪` vira `∩`. Dá pra ver a máquina confirmar:

```js
const U = new Set([1,2,3,4,5,6,7,8]);
const A = new Set([1,2,3]);
const B = new Set([3,4,5]);
const compl = (S) => new Set([...U].filter(x => !S.has(x)));

const esq = compl(new Set([...A, ...B]));               // ‾(A ∪ B)
const cA = compl(A), cB = compl(B);
const dir = new Set([...cA].filter(x => cB.has(x)));    // Ā ∩ B̄

console.log([...esq]); // [6, 7, 8]
console.log([...dir]); // [6, 7, 8]  -> idênticos
```

> **Cuidado — De Morgan é o erro nº 1.** Não basta trocar a operação: **cada termo também é negado**. $\overline{A \cap B}$ **não** é $A \cup B$, é $\overline{A} \cup \overline{B}$ (a união dos *complementos*). Igual à lógica: `!(a && b)` não é `!(a || b)`, é `!a || !b`.

### Identidades — o vazio e o universo

$\emptyset$ e $U$ funcionam como o **0** e o **1** da aritmética:

$$A \cup \emptyset = A \qquad A \cap U = A \qquad A \cap \emptyset = \emptyset \qquad A \cup U = U$$

E os dois com complemento, que fecham a lógica:

$$A \cup \overline{A} = U \qquad A \cap \overline{A} = \emptyset$$

Um conjunto e seu complemento não têm nada em comum (interseção vazia) e juntos formam tudo (união é o universo) — a versão em conjunto de "algo não pode ser verdadeiro e falso ao mesmo tempo".

### Idempotente e absorção — as que limpam código

$$A \cup A = A \qquad A \cap A = A \qquad \text{(idempotente)}$$
$$A \cup (A \cap B) = A \qquad A \cap (A \cup B) = A \qquad \text{(absorção)}$$

Absorção é a mesma `a || (a && b) === a`: quando um termo já contém o outro, o interno é **redundante**. Ouro pra simplificar condição composta.

---

## O grande recado

> **Lógica proposicional e teoria dos conjuntos são a mesma estrutura matemática** (uma "álgebra booleana"). Um `if` com `&&`, `||`, `!` e uma manipulação de conjuntos com `∩`, `∪`, complemento obedecem às **mesmas leis**. Aprender uma é aprender a outra. Por isso quem domina De Morgan em lógica simplifica query e filtro sem esforço.

# Subconjuntos

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em JavaScript, lado a lado. Até aqui toda pergunta era sobre **um elemento** ("o 2 está em A?"). Subconjunto muda o nível: agora a gente compara **dois conjuntos inteiros**. **É a matemática por trás de "todo X é Y" — e é isso que decide se um usuário entra, se um plano libera uma feature e se seus testes cobrem os casos.**

> Este documento cobre: subconjunto (`⊆`), subconjunto próprio (`⊂`), igualdade de conjuntos e a distinção `∈` vs `⊆`. Apoia-se nos fundamentos (pertinência, cardinalidade, vazio) do material anterior.

---

## 1. Subconjunto (`⊆`) — a virada de chave

$A$ é **subconjunto** de $B$ quando **todo elemento de $A$ também está em $B$**:

$$A \subseteq B \quad \text{quando} \quad \text{para todo } x \in A,\ \text{vale } x \in B$$

Lê-se "$A$ está contido em $B$". A imagem é de encaixe: $A$ cabe inteiro dentro de $B$, sem sobrar nada de fora.

$$A = \{2, 4\} \qquad B = \{1, 2, 3, 4, 5\} \qquad A \subseteq B \ (\text{V})$$

O 2 está em $B$, o 4 está em $B$ — nenhum elemento de $A$ ficou de fora.

**O ponto central:** subconjunto não é uma checagem nova. É a **pertinência (`∈`) aplicada a todos os elementos de uma vez**. Você já tinha a peça (`has`); subconjunto só a embrulha num "para todo". Em código, isso é `every` (o "para todo" do JS) por cima de `has` (o `∈`):

```js
const A = new Set([2, 4]);
const B = new Set([1, 2, 3, 4, 5]);

// A ⊆ B ?  ->  "para TODO x em A, x ∈ B ?"
const contido = [...A].every(x => B.has(x));
console.log(contido); // true
```

A matemática e o código são a mesma frase:

| Matemática | Código |
|---|---|
| $A \subseteq B$ | `[...A].every(x => B.has(x))` |
| "para todo $x$ em $A$…" | `[...A].every(x => ...)` |
| "…$x \in B$" | `B.has(x)` |

> **Um contra-exemplo já basta.** Se **um só** elemento de $A$ falhar, já não é subconjunto — por mais que todos os outros passem. É exatamente o comportamento do `every`, que retorna `false` no primeiro que falha. Isso reaparece a carreira inteira: para afirmar um "para todo" você checa todos; para refutá-lo, basta achar **um** que quebra.

---

## 2. Os dois casos que pegam todo mundo

Saem direto da definição, mas parecem estranhos na primeira vez.

**Todo conjunto é subconjunto de si mesmo:** $A \subseteq A$, sempre. Todo elemento de $A$ está em $A$, trivialmente.

**O vazio é subconjunto de qualquer conjunto:** $\emptyset \subseteq B$, para todo $B$. Aplicando a definição ao pé da letra: "todo elemento de $\emptyset$ está em $B$?" — como $\emptyset$ não tem elemento nenhum, não existe ninguém pra violar a regra, então vale. Isso se chama **verdadeiro por vacuidade**, e é o mesmo "para todo sobre conjunto vazio é sempre verdadeiro" da lógica.

```js
const A = new Set([1, 2]);
const vazio = new Set();

[...A].every(x => A.has(x));     // true  -> A ⊆ A
[...vazio].every(x => A.has(x)); // true  -> ∅ ⊆ A (every de vazio é sempre true)
```

---

## 3. Subconjunto próprio (`⊂`)

O subconjunto próprio é a versão mais exigente: $A$ cabe em $B$ **e** $B$ tem pelo menos um elemento a mais.

$$A \subset B \quad \text{quando} \quad A \subseteq B \ \text{ e }\ A \neq B$$

O atalho pra nunca errar é a analogia com os números:

| Conjuntos | Números | Permite igual? |
|---|---|---|
| $A \subseteq B$ (contido) | $a \leq b$ | **sim** |
| $A \subset B$ (próprio) | $a < b$ | **não** |

`⊆` é o "≤"; `⊂` é o "<". Assim como $3 < 3$ é falso, $B \subset B$ é falso — um conjunto **nunca** é subconjunto próprio de si mesmo.

Com $B = \{1,2,3\}$:

$$\{1,2\} \subset B \ (\text{V}) \qquad \{1,2,3\} \subset B \ (\text{F}) \qquad \{1,2,3\} \subseteq B \ (\text{V})$$

O caso do meio é o pulo do gato: $\{1,2,3\}$ **é igual** a $B$, então cabe (`⊆` vale), mas não é próprio (`⊂` é falso), porque não sobra nada. Em código:

```js
const A = new Set([1, 2]);
const B = new Set([1, 2, 3]);

const contido = [...A].every(x => B.has(x));  // A ⊆ B ?
const proprio = contido && A.size !== B.size; // A ⊂ B ?
console.log(contido, proprio); // true true
```

> **Cuidado com a notação:** alguns autores usam `⊂` no sentido geral (permitindo igual, como o nosso `⊆`). É uma inconsistência histórica. Sem ambiguidade: **`⊆` = contido (permite igual)** e **`⊊` = contido próprio (estritamente menor)**. Se vir `⊂` por aí, confira o que o autor quis dizer.

---

## 4. Igualdade de conjuntos

Dois conjuntos são iguais quando têm exatamente os mesmos elementos. A forma precisa usa subconjunto nos **dois sentidos**:

$$A = B \quad\Longleftrightarrow\quad A \subseteq B \ \text{ e }\ B \subseteq A$$

Cada um cabe dentro do outro. Se todo elemento de $A$ está em $B$ *e* todo elemento de $B$ está em $A$, não podem diferir em nada. É assim que se **prova** que dois conjuntos são iguais: mostra as duas continências.

---

## 5. `∈` vs `⊆` — a distinção que mais confunde

Este é *o* clássico do tópico. Os dois "falam de estar dentro", mas ligam tipos diferentes:

- **`∈`** liga um **elemento** a um **conjunto**: `2 ∈ A`.
- **`⊆`** liga um **conjunto** a outro **conjunto**: `{2} ⊆ A`.

A diferença entre `2` e `{2}` é a diferença entre **o número** e **a caixa contendo o número**:

| Afirmação | Tipos | Veredito |
|---|---|---|
| $2 \in A$ | elemento ∈ conjunto | **V** |
| $2 \subseteq A$ | elemento ⊆ conjunto → **mal formado** | **F** |
| $\{2\} \subseteq A$ | conjunto ⊆ conjunto | **V** |

$2 \in A$ (o número está lá) e $\{2\} \subseteq A$ (a caixa cabe lá) são ambos verdadeiros — mas por relações diferentes. $2 \subseteq A$ usa a relação errada pro tipo errado.

> **A regra que resolve de vez:** olhe o símbolo primeiro. **`∈` espera elemento à esquerda; `⊆` espera conjunto à esquerda.** O símbolo diz que tipo cada lado precisa ser.

---

## 6. Por que isso importa no seu dia a dia como dev

Sempre que você precisa garantir que *um grupo inteiro* está dentro de *outro grupo*, é `⊆` trabalhando — mesmo sem ninguém escrever o símbolo.

**Autorização (o exemplo nº 1).** "Esse usuário pode entrar?" é uma pergunta de subconjunto: os papéis exigidos estão contidos nos papéis que o usuário tem?

```js
const exigidos = new Set(["editor"]);
const doUsuario = new Set(["editor", "revisor", "leitor"]);

// exigidos ⊆ doUsuario ?  -> "tem TODOS os papéis exigidos?"
const podeEntrar = [...exigidos].every(p => doUsuario.has(p));
console.log(podeEntrar); // true
```

**Planos / feature flags.** Grátis `⊂` Pro `⊂` Enterprise — cada plano superior contém as features do de baixo e acrescenta mais. É continência encadeada.

**Validação de schema.** "Os campos recebidos são um subconjunto dos permitidos?" Se vier campo fora do conjunto permitido, rejeita.

```js
const permitidos = new Set(["nome", "email", "idade"]);
const recebidos = Object.keys(payload);
const valido = recebidos.every(campo => permitidos.has(campo)); // recebidos ⊆ permitidos ?
```

**Tipos e herança.** Quando a linguagem aceita `Cachorro` onde se espera `Animal`, é porque trata `Cachorro` como **subtipo** — subconjunto aplicado a tipos. "Todo Cachorro é um Animal." É a base do polimorfismo.

**Cobertura de teste.** Se o conjunto testado é subconjunto *próprio* do conjunto de casos reais ($\text{testado} \subset \text{possível}$), sobra caso não coberto — e é aí que o bug se esconde. O `⊂` carrega justamente a informação "está contido **mas ainda falta coisa**".

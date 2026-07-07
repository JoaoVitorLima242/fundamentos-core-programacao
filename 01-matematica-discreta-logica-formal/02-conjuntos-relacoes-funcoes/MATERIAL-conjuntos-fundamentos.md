# Conjuntos — fundamentos

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em JavaScript, lado a lado, pra você rodar e testar. A ideia não é decorar símbolo — é enxergar que `Set`, deduplicação, contagem de distintos e checagem de permissão são todos a **mesma** ideia matemática vestida de código. **É isso que separa quem usa `Set` por hábito de quem usa por saber exatamente o que ganha.**

> Este documento cobre os **fundamentos** de conjuntos: o que é, as duas regras, pertinência, formas de descrever, cardinalidade e o conjunto vazio. Subconjunto, operações (união/interseção/diferença) e leis vêm nos próximos materiais e se apoiam inteiramente no que está aqui.

---

## 1. O que é um conjunto

Um **conjunto** é uma coleção de objetos — os **elementos** — considerada como um todo. Escrevemos com chaves:

$$A = \{1, 2, 3\}$$

Em código, o equivalente direto é o `Set`:

```js
const A = new Set([1, 2, 3]);
```

O que dá vida ao conceito são **duas regras** que todo conjunto obedece. É nelas que mora tudo.

---

## 2. Regra 1 — não existe elemento repetido

Um objeto ou está no conjunto, ou não está. Não existe "estar dentro duas vezes". Então:

$$\{1, 2, 2, 3\} = \{1, 2, 3\}$$

Os dois lados são o **mesmo** conjunto — repetir não acrescenta nada. O código faz isso sozinho:

```js
const A = new Set([1, 2, 2, 3]);
console.log(A); // Set(3) { 1, 2, 3 }  -> o 2 repetido sumiu
```

O `Set` **descarta a repetição automaticamente**. Isso não é um detalhe do JS — é a Regra 1 da matemática acontecendo na tela.

---

## 3. Regra 2 — não existe ordem

Num conjunto não há "primeiro" nem "último". Só importa *quem está lá*, não em que sequência:

$$\{1, 2, 3\} = \{3, 1, 2\}$$

São o mesmo conjunto. Isso é o que separa conjunto de **array** (lista), que é ordenada e aceita repetidos:

```js
// Array: ORDEM importa e repetição é permitida
[1, 2, 3] // diferente de [3, 2, 1]

// Conjunto: ordem não define identidade, repetição não existe
```

> **Cuidado:** o `Set` do JS, por conveniência, *preserva a ordem de inserção* quando você itera sobre ele. Não se engane com isso: matematicamente um conjunto **não tem ordem**. Nunca escreva lógica que dependa da "posição" de um elemento num `Set` — se você precisa de ordem, o que você quer é um array.

Mental model que resolve 90% das dúvidas: **array = lista ordenada que aceita repetidos; conjunto = "quem está no clube", sem ordem e sem sócio duplicado.**

---

## 4. Pertinência — a pergunta fundamental (`∈`)

A operação mais básica de um conjunto é perguntar se algo está dentro. Chama-se **pertinência**, símbolo `∈`:

$$2 \in A \quad (\text{"2 pertence a } A\text{"}) \qquad 5 \notin A \quad (\text{"5 não pertence a } A\text{"})$$

Em código, é o `has`:

```js
const A = new Set([1, 2, 3]);
A.has(2); // true   -> 2 ∈ A
A.has(5); // false  -> 5 ∉ A
```

Repara na ponte com lógica booleana: "$2 \in A$" é uma **proposição** — só pode ser `true` ou `false`. E `A.has(2)` retorna exatamente isso. Conjuntos e lógica são a mesma conversa por ângulos diferentes.

> **Convenção de notação:** em `x ∈ A`, o **símbolo define os papéis** — o que está à esquerda do `∈` é tratado como *elemento*, o que está à direita é o *conjunto*. Costuma-se usar minúscula pra elemento (`x`, `a`) e maiúscula pra conjunto (`A`, `B`), mas isso é só costume; quem manda é a relação usada.

---

## 5. Duas formas de descrever um conjunto

**Por extensão** — você lista os elementos:

$$A = \{2, 4, 6, 8\}$$

```js
const A = new Set([2, 4, 6, 8]);
```

**Por compreensão** — você dá a **regra** que os elementos obedecem. A barra `|` lê-se "**tal que**":

$$A = \{x \mid x \text{ é par e } 0 < x < 10\}$$

Em código, isso é literalmente um filtro:

```js
// {x | x é par e 0 < x < 10}
const A = new Set([1,2,3,4,5,6,7,8,9].filter(x => x % 2 === 0));
console.log(A); // Set(4) { 2, 4, 6, 8 }
```

A condição `x => x % 2 === 0` **é** o "tal que" da matemática. A forma por compreensão é a mais poderosa porque descreve conjuntos que você jamais listaria à mão — inclusive infinitos ("o conjunto de todos os primos").

---

## 6. Cardinalidade — quantos elementos (`|A|`)

O número de elementos de um conjunto é a **cardinalidade**, escrita entre barras:

$$A = \{2, 4, 6, 8\} \implies |A| = 4$$

```js
const A = new Set([2, 4, 6, 8]);
A.size; // 4  -> |A|
```

Aqui mora a distinção que separa os enrolados dos que entenderam. Olha:

$$B = \{x \mid x \text{ é uma letra da palavra "ARARA"}\}$$

A palavra tem **5 letras**, mas o conjunto das suas letras é $\{A, R\}$ — pela Regra 1, as repetições colapsam. Então $|B| = 2$, **não** 5:

```js
const B = new Set("ARARA"); // percorre A,R,A,R,A e descarta repetidos
console.log(B);      // Set(2) { 'A', 'R' }
console.log(B.size); // 2  -> |B| = 2, não 5
```

**O tamanho da fonte de dados e a cardinalidade do conjunto são coisas diferentes** — a diferença entre eles é exatamente quanta repetição existia. Isso é, palavra por palavra, a diferença entre *"quantos registros eu tenho"* e *"quantos valores distintos eu tenho"*.

---

## 7. O conjunto vazio (`∅`)

Um conjunto pode não ter elemento nenhum. Esse é o **conjunto vazio**, escrito `∅` ou `{}`:

$$|\emptyset| = 0$$

```js
const vazio = new Set();
vazio.size; // 0
```

Parece bobo agora, mas ele é o "zero" da teoria dos conjuntos — vai ter papel central em subconjuntos e operações.

---

## 8. Por que isso importa no seu dia a dia como dev

Toda a teoria acima aparece em código real com três usos que você faz (ou deveria fazer) toda semana.

### 8.1. Deduplicar — Regra 1 de graça

Precisa remover repetidos de uma lista? É a Regra 1 direto:

```js
const ids = [1, 2, 2, 3, 3, 3];
const unicos = [...new Set(ids)]; // [1, 2, 3]
```

Você não escreve loop, não compara par a par. Joga no `Set`, a repetição some, tira de volta. **Quando você vê `[...new Set(arr)]`, é a Regra 1 trabalhando.**

### 8.2. Contar distintos — cardinalidade na prática

"Quantos **usuários** acessaram?" é diferente de "quantos **acessos** houve". O primeiro é cardinalidade de conjunto; o segundo é tamanho da lista:

```js
const acessos = ["ana", "bruno", "ana", "ana", "bruno", "carla"];
acessos.length;        // 6  -> quantos acessos (registros)
new Set(acessos).size; // 3  -> quantos usuários distintos (cardinalidade)
```

É o mesmo "ARARA" da seção 6, agora valendo dinheiro num dashboard. No SQL, isso é a diferença entre `COUNT(*)` e `COUNT(DISTINCT usuario)` — mesma ideia, mesma pegadinha.

### 8.3. Checagem de pertinência — `∈` que é rápido

"Esse papel tem permissão?", "esse ID já foi processado?", "esse e-mail está na blocklist?" — tudo isso é `∈`. E aqui vem o motivo nº 1 pra usar `Set` em vez de array:

```js
const permitidos = new Set(["admin", "editor", "revisor"]);
permitidos.has(papel); // ∈ -> tempo constante, O(1)

// O array faz a MESMA pergunta, mas varrendo item a item:
["admin", "editor", "revisor"].includes(papel); // O(n)
```

Para 3 papéis não muda nada. Para uma blocklist de 100 mil IDs consultada num loop, `Set.has` é o que separa uma resposta instantânea de um endpoint travando. (O *porquê* do `O(1)` vs `O(n)` você fecha no módulo de complexidade — guarde o gancho.)

> **Cuidado — a pegadinha do `Set` com objetos:** `Set` compara valores primitivos por igualdade, mas **objetos por identidade** (é o mesmo objeto na memória?), não por conteúdo. Então:
> ```js
> const s = new Set();
> s.add({ id: 1 });
> s.has({ id: 1 }); // false! -> é outro objeto, mesmo conteúdo
> ```
> Para deduplicar objetos por conteúdo, use uma chave estável (ex.: `new Set(itens.map(i => i.id))`). Isso não muda a matemática — é limitação da ferramenta.

---

## 9. Erros clássicos (guarde estes)

1. **Confundir `length` com `size`** — quantos registros (`.length`) não é quantos distintos (`Set.size`). É a diferença entre "acessos" e "usuários".
2. **Varrer array quando `Set` resolve** — `array.includes()` em caminho quente é `O(n)`; `Set.has()` é `O(1)`. Para checagem repetida de pertinência, `Set`.
3. **Esperar que `Set` deduplique objetos por conteúdo** — ele compara objetos por identidade. Deduplique por uma chave (`id`).
4. **Raciocinar sobre "ordem" num conjunto** — o `Set` do JS preserva ordem de inserção por conveniência, mas conjunto não tem ordem. Se você depende da posição, você queria um array.

---

## 10. Exercícios (com gabarito)

1. **Deduplicação.** Sem usar `Set`, você removeria repetidos de `[3,1,3,2,1]` com mais trabalho. Com `Set`, faça em uma linha e diga qual é o resultado.
2. **Registros vs distintos.** Dado `const tags = ["js","css","js","html","css","js"]`, diga o valor de `tags.length` e de `new Set(tags).size`, e explique em uma frase por que diferem.
3. **Compreensão → código.** Traduza para `Set` em JS: `{ x | x é múltiplo de 3 e 0 < x ≤ 20 }`. Qual a cardinalidade?
4. **Pertinência.** Dado `const bloqueados = new Set(["u1","u4","u9"])`, o que retorna `bloqueados.has("u4")` e `bloqueados.has("u2")`? Escreva em notação matemática as duas afirmações.
5. **Pegadinha.** Explique por que `new Set([{id:1},{id:1}]).size` é `2` e não `1`, e como corrigir para contar por `id`.

> **Gabarito**
> 1. `[...new Set([3,1,3,2,1])]` → `[3, 1, 2]`.
> 2. `tags.length` = `6` (registros); `new Set(tags).size` = `3` (distintos: js, css, html). Diferem porque o array conta cada ocorrência e o conjunto colapsa repetidos.
> 3. `new Set([3,6,9,12,15,18])` (ou via `filter`: `[...Array(21).keys()].filter(x => x>0 && x%3===0)`). Cardinalidade = **6**.
> 4. `has("u4")` → `true` (`u4 ∈ bloqueados`); `has("u2")` → `false` (`u2 ∉ bloqueados`).
> 5. São **dois objetos diferentes** na memória, mesmo com conteúdo igual — `Set` compara objetos por identidade. Para contar por id: `new Set([{id:1},{id:1}].map(o => o.id)).size` → `1`.

---

## Resumo

- **Conjunto** = coleção de elementos, com duas regras: **sem repetição** e **sem ordem**. Em código, é o `Set`.
- **Pertinência** (`∈`) é a pergunta fundamental — sim/não, elemento por elemento. Em JS, `Set.has(x)`, e é `O(1)`.
- Descreve-se um conjunto **por extensão** (listando) ou **por compreensão** (dando a regra — que vira um `filter`).
- **Cardinalidade** (`|A|`) é o número de elementos → `Set.size`. Não confunda com o tamanho da fonte de dados: **registros ≠ distintos**.
- **Conjunto vazio** (`∅`) não tem elementos; é o "zero" da teoria.
- No trabalho, isso é: **deduplicar** (Regra 1), **contar distintos** (cardinalidade) e **checar pertinência rápido** (`Set.has` vs `array.includes`).
- Ressalva de ferramenta: `Set` compara **objetos por identidade**, não por conteúdo.

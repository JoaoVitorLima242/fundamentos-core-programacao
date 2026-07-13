# Produto cartesiano

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em JavaScript, lado a lado. Até agora as operações devolviam elementos do mesmo tipo dos originais. O produto cartesiano é diferente: ele **combina** dois conjuntos e produz **pares**. **É o alicerce de relações, funções e do `JOIN` do SQL — e entender a fórmula dele te explica de uma vez por que uma query mal escrita trava o banco.**

> Este documento cobre: produto cartesiano (`A × B`), sua cardinalidade, o par ordenado e a conexão com SQL, relações e funções. Fecha o tópico de conjuntos.

---

## 1. O que é o produto cartesiano

O **produto cartesiano** $A \times B$ é o conjunto de **todos os pares ordenados** com o primeiro elemento vindo de $A$ e o segundo vindo de $B$:

$$A \times B = \{(a, b) \mid a \in A \ \text{e}\ b \in B\}$$

Todas as combinações possíveis, uma a uma.

$$A = \{1, 2\} \qquad B = \{x, y\}$$
$$A \times B = \{(1,x),\ (1,y),\ (2,x),\ (2,y)\}$$

O processo: pega cada elemento de $A$ e casa com **cada** elemento de $B$. O 1 casa com x e y; o 2 casa com x e y. Quatro pares. Em código, é um loop dentro do outro:

```js
const A = [1, 2];
const B = ["x", "y"];

const produto = [];
for (const a of A) {
  for (const b of B) {
    produto.push([a, b]);
  }
}
console.log(produto);
// [ [1,'x'], [1,'y'], [2,'x'], [2,'y'] ]
```

Os dois `for` aninhados **são** a definição: "para cada $a$ em $A$, para cada $b$ em $B$, forme o par $(a,b)$".

---

## 2. Cardinalidade — a fórmula que conecta com contagem

Cada um dos $|A|$ elementos vira $|B|$ pares. Então:

$$|A \times B| = |A| \times |B|$$

No exemplo: $2 \times 2 = 4$ pares. Esse é o **princípio da multiplicação** da combinatória (o próximo módulo, `03-combinatoria-contagem`) aparecendo já aqui — não é coincidência, é a mesma ideia. E é essa fórmula que explica a explosão de linhas no SQL (seção 4).

---

## 3. O par é ordenado

Dentro do par, **a ordem importa** — o oposto de conjunto: $(1, x)$ é diferente de $(x, 1)$. Consequência: $A \times B \neq B \times A$ em geral.

$$B \times A = \{(x,1),\ (x,2),\ (y,1),\ (y,2)\}$$

Mesmos ingredientes, pares diferentes — porque a posição tem significado (primeiro sempre de $A$, segundo sempre de $B$).

> **Cuidado — dois níveis de ordem.** Não confunda "conjunto sem ordem" com "par sem ordem". O *conjunto de pares* continua sem ordem (tanto faz listar $(1,x)$ antes ou depois de $(2,y)$). Mas **dentro** de cada par, a ordem é sagrada. São dois níveis diferentes.

**Por que "cartesiano"?** É o mesmo "cartesiano" do plano da escola: os pontos $(x, y)$ são exatamente $\mathbb{R} \times \mathbb{R}$ — todos os pares de um real com outro. Descartes é o mesmo nome nos dois lugares.

---

## 4. Onde isso vive no seu dia a dia como dev

Esta é a parte que amarra o tópico inteiro com o que vem depois.

**No SQL, é o `CROSS JOIN`.** Cruzar duas tabelas sem condição produz o produto cartesiano — cada linha de uma com cada linha da outra. É por isso que um `JOIN` sem `ON` **explode**: se uma tabela tem 10 mil linhas e a outra 10 mil, o resultado tenta ter $10^4 \times 10^4 = 10^8$ linhas. A fórmula $|A| \times |B|$ é **literalmente** o motivo de a query travar — você acabou de entender uma das causas mais comuns de query lenta.

**É a base de relações e funções** — os próximos dois temas. Uma **relação** é um *subconjunto* de um produto cartesiano (só alguns pares, não todos). Uma **função** é um tipo especial de relação. Sem produto cartesiano, não existe o resto: ele é o alicerce.

**Combinações de configuração.** "Todos os tamanhos × todas as cores" de um produto, "todos os dias × todos os horários" de uma agenda — sempre que você precisa de *todas as combinações* de duas listas, é produto cartesiano.

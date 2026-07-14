# Combinatória — o núcleo da contagem

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em JavaScript, lado a lado. Combinatória parece uma lista de fórmulas pra decorar (`n!`, `C(n,k)`, arranjo, permutação), mas não é: são **dois princípios** e o resto sai deles. **É o que explica por que uma busca em força bruta explode, por que uma senha de 12 caracteres é absurdamente melhor que uma de 8, por que colisão de hash é inevitável e por que teste exaustivo não existe.**

> Este documento cobre: os dois princípios (multiplicação e adição), as duas perguntas que classificam qualquer problema (repete? a ordem importa?), os quatro casos daí decorrentes (arranjo com repetição, arranjo, permutação, combinação), contagem por complemento, inclusão-exclusão e estrelas-e-barras. Apoia-se inteiramente em **conjuntos** e **produto cartesiano** — leia aqueles materiais antes deste.

---

## 1. O que combinatória realmente é

É **descobrir a cardinalidade de um conjunto sem listar seus elementos**.

Você já sabe o que é cardinalidade (`|A|`, o `Set.size`). O problema é que enumerar só funciona enquanto o conjunto é pequeno. Quantas senhas de 12 caracteres existem? São mais de 10²¹ — nenhum computador vai listá-las pra você contar. Combinatória é o conjunto de técnicas pra dizer `|A|` **por raciocínio**.

Toda pergunta do tipo *"de quantas maneiras…?"* é, no fundo, *"qual a cardinalidade do conjunto dessas possibilidades?"*.

Guarde essa diferença desde já, porque ela é a razão de o tópico existir:

```js
// ENUMERAR: constrói o conjunto e mede. Só funciona enquanto cabe na memória.
const senhas = [];
for (const a of "abc") for (const b of "abc") for (const c of "abc") senhas.push(a + b + c);
console.log(senhas.length); // 27

// CONTAR: responde sem construir nada.
console.log(3 ** 3);        // 27
```

As duas linhas dão 27. Troque `"abc"` pelas 26 letras e um comprimento de 12: a primeira trava a máquina, a segunda responde na hora. **Combinatória é a segunda linha.**

---

## 2. Princípio da multiplicação — o "E"

Quando uma escolha é feita em **etapas encadeadas**, e cada etapa tem um número de opções que não depende do que foi escolhido antes, o total é o **produto** das opções de cada etapa.

O mecanismo — grave isto, não a fórmula:

> Para **cada** resultado da etapa 1, existem **todas** as opções da etapa 2. Então a etapa 2 multiplica cada ramo aberto pela etapa 1.

Isso não é novo: é exatamente o que você provou no produto cartesiano, `|A × B| = |A| × |B|`. Cada um dos `|A|` elementos abre `|B|` continuações. Três etapas? `|A| × |B| × |C|`.

Identificadores de deploy no formato `ambiente-região-tier`:

```js
const ambientes = ["dev", "staging", "prod"];   // 3
const regioes   = ["us", "eu", "sa", "ap"];     // 4
const tiers     = ["free", "pro"];              // 2

// ENUMERANDO (os três for aninhados SÃO o princípio da multiplicação):
const ids = [];
for (const a of ambientes) for (const r of regioes) for (const t of tiers) ids.push(`${a}-${r}-${t}`);
console.log(ids.length);                        // 24

// CONTANDO:
console.log(3 * 4 * 2);                         // 24
```

Os `for` aninhados **são** a multiplicação escrita como código. O sinal na linguagem natural é **"e depois"** / **"e também"**: escolho isto **e** aquilo **e** aquilo.

---

## 3. Princípio da adição — o "OU"

Quando o total se divide em **casos mutuamente exclusivos**, o total é a **soma** dos casos.

> Se todo resultado cai no caso A **ou** no caso B, e **nenhum** resultado está nos dois ao mesmo tempo, o total é `|A| + |B|`.

Isso é a **união de conjuntos disjuntos**. Um menu com 4 pratos quentes e 3 frios, e você vai comer **um prato só**:

```js
const quentes = ["lasanha", "risoto", "feijoada", "moqueca"];  // 4
const frios   = ["ceviche", "salada", "carpaccio"];            // 3

new Set([...quentes, ...frios]).size;  // 7  -> |A ∪ B|
quentes.length + frios.length;         // 7  -> |A| + |B|
```

As duas contas batem — mas **só porque nenhum prato é quente e frio ao mesmo tempo**. O sinal na frase é **"ou então"**: é deste tipo **ou** daquele tipo.

> **Cuidado — a soma exige disjunção.** Se o menu tivesse um prato "morno" listado nas duas categorias, `4 + 3` contaria ele **duas vezes** e o total estaria errado. O princípio da adição não é "quando tem 'ou', soma" — é "quando tem 'ou' **e os casos não se sobrepõem**, soma". Quando se sobrepõem, você precisa da inclusão-exclusão (seção 10).
> **Frase-âncora:** *somar sem checar disjunção é contar gente duas vezes.*

---

## 4. A ponte: os princípios já eram seus conhecidos

Não é coincidência que os dois princípios sejam multiplicação e soma. São os operadores da lógica e dos conjuntos que você já estudou, agora **contando** em vez de decidir verdadeiro/falso:

| Combinatória | Lógica (aula 01) | Conjuntos | Sinal na frase |
|---|---|---|---|
| multiplicar (etapas) | `∧` (E) | `×` produto cartesiano | "e depois" |
| somar (casos disjuntos) | `∨` (OU) | `∪` união disjunta | "ou então" |
| subtrair (complemento) | `¬` (NÃO) | `Ā = U ∖ A` | "pelo menos", "nenhum" |

É o mesmo recado do `MATERIAL-conjuntos-operacoes-leis`: **lógica, conjuntos e contagem são a mesma álgebra vista de ângulos diferentes.** `∧` casa com `×`, `∨` casa com `+`, `¬` casa com `−`.

> **Cuidado — o erro nº 1 de combinatória não é errar a fórmula, é multiplicar quando devia somar (ou vice-versa).** A fórmula é a parte fácil; identificar o caso é o trabalho. Antes de qualquer conta, ache o "e depois" ou o "ou então" na frase.

---

## 5. As duas perguntas que organizam tudo

Toda pergunta "de quantas maneiras…?" se responde depois de responder duas perguntas sobre o objeto que você está formando:

1. **Repete?** — depois de usar um elemento, ele volta pro estoque ou sai?
2. **A ordem importa?** — trocar a ordem gera um objeto diferente ou o mesmo?

Você já tem as duas, dos conjuntos:

| Pergunta | De onde vem |
|---|---|
| Repete? | **Regra 1** dos conjuntos (sem repetição) |
| A ordem importa? | **Regra 2** dos conjuntos (sem ordem) vs. o **par ordenado** do produto cartesiano |

Duas perguntas binárias → quatro casos. Cada um ganhou um nome de escola, e é só isso que a tabela de fórmulas é:

| | **Ordem importa** (é uma *sequência*) | **Ordem não importa** (é um *conjunto*) |
|---|---|---|
| **Com repetição** | arranjo com repetição — `nᵏ` | combinação com repetição — estrelas e barras |
| **Sem repetição** | arranjo — `n × (n−1) × …` (`k` fatores) | combinação — `C(n,k)` |

E a **permutação** (`n!`) é um caso particular do arranjo: quando `k = n`, ou seja, você usa todos os elementos.

**A pergunta operacional que decide o eixo da ordem:** *existe posição com significado?* Se as posições têm papel (primeiro caractere, segundo caractere; ouro, prata, bronze), a ordem importa. Se o resultado é só "quem está no grupo", não importa.

---

## 6. Caso 1 — arranjo com repetição (`nᵏ`)

Estoque **cheio** a cada etapa: o elemento usado volta pro bolo.

Senha de 3 caracteres, 26 letras minúsculas:

$$26 \times 26 \times 26 = 26^3 = 17.576$$

```js
const n = 26, k = 3;
console.log(n ** k); // 17576
```

Por que `26` na segunda posição também: **a letra usada na posição 1 continua disponível**. `aaa` é senha válida. É multiplicação pura, com todas as etapas iguais.

$$\text{arranjo com repetição} = n^k \qquad (n \text{ opções}, k \text{ posições})$$

Reconhecimento no código: **é o `for` aninhado sobre a mesma lista** — `for (a of L) for (b of L) for (c of L)`.

---

## 7. Caso 2 — arranjo sem repetição (estoque decrescente)

Mesma senha, mas **não pode repetir letra**:

$$26 \times 25 \times 24 = 15.600$$

```js
function arranjo(n, k) {          // n × (n−1) × … com k fatores
  let total = 1;
  for (let i = 0; i < k; i++) total *= n - i;
  return total;
}
console.log(arranjo(26, 3)); // 15600
```

**O mecanismo, e ele é sutil:** o número não cai porque "removemos as senhas ruins depois". Cai porque **na hora de escolher a segunda letra só restam 25 disponíveis** — a primeira saiu do estoque. A terceira etapa vê 24. Nada foi removido; o estoque simplesmente encolheu.

Essa distinção é operacional, não filosófica. A leitura "removi as ruins" exige que você saiba *quantas* eram as ruins — e contar isso é mais difícil que o problema original. A leitura do estoque decrescente te dá a resposta direto.

> **Cuidado — o princípio da multiplicação exige que o número de opções de cada etapa seja FIXO, não que seja IGUAL.** `26×25×24` é tão legítimo quanto `26³`. O que quebraria o princípio seria a etapa 2 ter 25 opções em alguns ramos e 24 em outros — aí não dá pra multiplicar, e você precisa quebrar em casos e somar.
> **Frase-âncora:** *fixo por etapa, não igual entre etapas.*

---

## 8. Caso 3 — permutação e o fatorial (`n!`)

Permutação é o arranjo levado até o fim: reordenar **todos** os `n` elementos. O estoque decresce até acabar.

$$n! = n \times (n-1) \times \dots \times 2 \times 1$$

```js
const fat = (n) => (n <= 1 ? 1 : n * fat(n - 1));
console.log(fat(3)); // 6   -> as 6 ordens de 3 coisas distintas
console.log(fat(5)); // 120
```

`3! = 3 × 2 × 1 = 6` são as ordens de `{A, B, C}`:

```
ABC  ACB  BAC  BCA  CAB  CBA
```

**`n!` não é uma definição arbitrária pra decorar** — é o produto do estoque caindo até zerar. Escolho quem vai na 1ª posição (3 opções), quem vai na 2ª (restam 2), quem vai na 3ª (resta 1).

> Convenção: `0! = 1`. Não é truque de fórmula — existe exatamente **uma** maneira de ordenar o conjunto vazio: não fazer nada. É o mesmo "verdadeiro por vacuidade" do material de subconjuntos.

---

## 9. Caso 4 — combinação (`C(n,k)`): conte demais e divida

Aqui está a única do núcleo que não sai direto da multiplicação — e a técnica que a resolve é a mais reutilizável do tópico.

**Problema:** de 5 devs, escolher 3 pro code review de um PR. Não há papéis — os três são só "os revisores".

**Por que a ordem não importa:** *não existe posição com significado*. Não há "revisor nº 1" e "revisor nº 2"; o resultado é um **conjunto** de pessoas, e conjunto não tem ordem (Regra 2). Se o PR tivesse papéis (um revisor de arquitetura, um de testes, um de segurança), a ordem voltaria a importar.

**A derivação:**

1. Conte **como se a ordem importasse** (isso você sabe fazer): `5 × 4 × 3 = 60`.
2. Esse 60 está grande demais. Pegue o trio `{Ana, Bia, Caio}` — quantas linhas dos 60 são esse trio? Todas as ordens dessas 3 pessoas: `3! = 6`.
3. **Todo** trio foi contado exatamente 6 vezes. Divida: `60 ÷ 6 = 10`.

$$C(n,k) = \frac{n \times (n-1) \times \dots}{k!} = \frac{\text{arranjo}}{k!}$$

```js
function combinacao(n, k) {
  return arranjo(n, k) / fat(k);       // conta com ordem, desfaz a ordem
}
console.log(combinacao(5, 3)); // 10
```

O 60 não estava "errado" — estava contando **outra coisa**: trios *com papéis*. Dividir por `3!` colapsa as 6 cópias de cada trio em 1. A técnica tem nome: **sobrecontagem controlada** — conte demais de propósito, desde que saiba **exatamente** por quanto cada objeto foi multiplicado.

### A armadilha que separa arranjo de combinação

Mesmo `8 × 7 × 6` serve dois problemas completamente diferentes:

| Problema | Ordem? | Conta | Resultado |
|---|---|---|---|
| De 8 corredores: **ouro, prata e bronze** | **sim** — as medalhas são papéis | `8 × 7 × 6` | **336** |
| De 8 devs: **comitê de 3 pessoas** | **não** — não há papéis | `(8 × 7 × 6) ÷ 3!` | **56** |

Ana-Bia-Caio no pódio é `Ana ouro, Bia prata, Caio bronze`. Caio-Ana-Bia é **outro resultado**, com gente diferente chorando na TV. São 6 pódios distintos — dividir por `3!` os apagaria.

> **Cuidado — "3 de 8" não é pergunta suficiente.** `3 de 8 com papéis` e `3 de 8 sem papéis` diferem por um fator de `3! = 6`. A diferença entre 336 e 56 é uma decisão de **modelagem**, não de matemática.
> **Frase-âncora:** *existe posição com significado? Se sim, pare no arranjo. Se não, divida.*

### A condição que torna a divisão legal

> **Cuidado — dividir só é lícito se todo objeto foi contado o MESMO número de vezes.** Aqui, todo trio de pessoas distintas foi contado exatamente 6 vezes. Se a sobrecontagem fosse desigual, dividir daria um número sem sentido. (É exatamente o que acontece no caso com repetição — seção 11.)
> **Frase-âncora:** *divide-se pelo excesso uniforme.*

### Simetria: escolher quem entra é escolher quem fica de fora

$$C(n,k) = C(n, n-k)$$

Escolher 6 de 9 pra receber estrela **é a mesma coisa** que escolher as 3 que não recebem — um aponta o outro automaticamente. É o **complemento** aplicado à escolha em si. Na prática, é um atalho de cálculo: `C(9,6)` tem 6 fatores; `C(9,3)` tem 3 e dá o mesmo **84**.

```js
console.log(combinacao(9, 6), combinacao(9, 3)); // 84 84
```

---

## 10. Contar pelo complemento — "pelo menos" é o gatilho

Quantas senhas de 3 letras têm **pelo menos uma** letra repetida?

Do jeito direto: senhas com exatamente duas iguais (e qual par de posições repete? três escolhas…) **mais** senhas com as três iguais. Dois casos, um deles chato.

Do jeito torto — conte **o que sobra**:

```js
const todas       = 26 ** 3;        // 17576  -> U
const semRepetir  = arranjo(26, 3); // 15600  -> A
console.log(todas - semRepetir);    // 1976   -> Ā = U ∖ A
```

Em notação de conjuntos: `U` = todas as senhas, `A` = as sem repetição, e a resposta é `Ā = U ∖ A`. As leis que tornam isso válido estão no seu `MATERIAL-conjuntos-operacoes-leis`:

$$A \cup \overline{A} = U \qquad A \cap \overline{A} = \emptyset$$

Ou seja: **toda senha ou tem repetição ou não tem, nunca as duas, e não existe terceira opção.** É só por isso que subtrair funciona.

E o gatilho de reconhecimento é linguístico: **"pelo menos"**. `pelo menos uma repetida` = `¬(nenhuma repetida)`. É **De Morgan** — negar o "para todo" dá "existe um", e o "para todo" é justamente o lado fácil de contar.

> **Cuidado — complemento exige um universo definido e fechado.** Você precisa saber contar `U` e ter certeza de que `A` está inteiro dentro dele. É o mesmo `Cuidado:` do material de conjuntos ("complemento depende do universo"), agora como condição de contagem.
> **Frase-âncora:** *leu "pelo menos", pense complemento.*

---

## 11. Inclusão-exclusão — quando a soma mente

> Numa turma de **30 devs**: **18** sabem TypeScript, **15** sabem Python, **7** sabem **os dois**. Quantos sabem pelo menos uma das duas?

`18 + 15 = 33` — numa turma de 30. Absurdo. **O que aconteceu com os 7?**

- cada um deles está dentro dos 18 (sabe TS ✓)
- cada um deles está dentro dos 15 (sabe Python ✓)
- logo, no `18 + 15` cada um foi contado **duas vezes**

Devia ter sido contado **uma**. O erro por pessoa é de **1 a mais** — e são 7 pessoas. Subtrai 7 **uma vez só**:

$$|A \cup B| = |A| + |B| - |A \cap B| \qquad 18 + 15 - 7 = 26$$

E os que não sabem nenhuma? Complemento, de novo: `30 − 26 = 4`.

```js
const A = new Set([1, 2, 3]);
const B = new Set([3, 4, 5]);

const uniao = new Set([...A, ...B]);
const inter = new Set([...A].filter((x) => B.has(x)));

console.log(uniao.size);                    // 5  -> construiu a união e mediu
console.log(A.size + B.size - inter.size);  // 5  -> calculou sem construir
```

**Isto não é fórmula nova — é o princípio da adição com um remendo.** A adição exigia casos disjuntos; quando eles não são, a soma conta a sobreposição duas vezes e você devolve o excesso. Se `A ∩ B = ∅`, o termo de correção some e volta a ser `4 + 3 = 7` (o menu). **O princípio da adição é o caso particular da inclusão-exclusão em que a interseção é vazia.**

E repara: isso já estava disfarçado no seu material de conjuntos. Lá, `A = {1,2,3}`, `B = {3,4,5}`, `A ∪ B = {1,2,3,4,5}`. Se a união somasse, daria 6. Deu 5. O material explicou: *"o 3 estava nos dois mas aparece uma vez só — a Regra 1 continua valendo."* Aquele "aparece uma vez só" **é** a inclusão-exclusão. **A Regra 1 é a causa; a inclusão-exclusão é a fatura quando você conta.**

> **Cuidado — subtrai-se a interseção, não o dobro dela.** A tentação é pensar "estão duplicados, tira os dois": `33 − 14 = 19`. Isso **apaga** os 7 do resultado, quando eles *sabem* TS e devem entrar na conta. Você não quer removê-los; quer removê-los **uma vez**.
> **Frase-âncora:** *quem foi contado 2×, você tira 1×.*

As duas linhas de JS acima são o tópico inteiro em miniatura: uma **enumera** (constrói pra medir), a outra **conta** (calcula sem construir). Quando o conjunto tem 10¹⁵ elementos, a primeira trava e a segunda responde.

---

## 12. Combinação com repetição — estrelas e barras

O quarto caso: **sem ordem, com repetição**. É o único que resiste, e vale entender **por quê** antes da técnica.

> Uma sorveteria tem **5 sabores**. Você monta uma casquinha de **3 bolas**. Pode repetir sabor, e as bolas não têm posição — é uma casquinha, não um pódio.

**Por que `5³ = 125` está errado:** essa conta pensa em "primeira bola, **e depois** segunda bola" — ou seja, ela **cria posições**. `5³` conta pilhas ordenadas. No balcão, choco-morango-baunilha e baunilha-choco-morango são **o mesmo pedido**.

**Por que `125 ÷ 3!` também está errado:** aqui está a descoberta. Conte quantas vezes cada casquinha aparece dentro dos 125:

| Casquinha | Vezes contada nos 125 | Por quê |
|---|---|---|
| `{C, M, B}` | **6** | 3 bolas distintas → `3!` ordens |
| `{C, C, M}` | **3** | as duas `C` são intercambiáveis → só `CCM`, `CMC`, `MCC` |
| `{C, C, C}` | **1** | trocar bolas idênticas não gera linha nova |

**6, 3, 1 — a sobrecontagem é desigual.** Dividir por `3!` assumiria que todo mundo foi contado 6 vezes. O resultado seria `125/6 = 20,83…` — nem inteiro dá, e isso já é alarme: **contagem é sempre inteira**.

> **Cuidado — a técnica "conte com ordem e divida pelo excesso" MORRE quando existe repetição**, porque a repetição faz cada objeto ter um excesso diferente. Quanto mais repetido, menos ordens ele tem.
> **Frase-âncora:** *repetição e ausência de ordem brigam entre si — não há excesso uniforme pra dividir.*

### A ideia nova: troque o objeto por um sem simetria

Se a ordem não existe, uma casquinha **não é uma sequência**. Ela é só a resposta a: *quantas de cada sabor?*

```
{C, M, B}   ->  C:1  M:1  B:1  L:0  U:0
{C, C, C}   ->  C:3  M:0  B:0  L:0  U:0
```

Agora **cada casquinha tem uma representação única** — o problema da sobrecontagem evaporou, porque paramos de modelar como sequência. O problema virou: *quantas soluções tem `c + m + b + l + u = 3` com cada número ≥ 0?*

**O truque:** bolas viram **estrelas** (`*`); **barras** (`|`) separam os sabores.

```
C:1 M:1 B:1 L:0 U:0   ->   * | * | * |   |
C:3 M:0 B:0 L:0 U:0   ->   *** |  |  |  |
C:2 M:1 B:0 L:0 U:0   ->   ** | * |  |  |
```

Toda casquinha vira uma fileira; toda fileira válida é uma casquinha. **É uma bijeção** (o conceito do `MATERIAL-funcoes`: um-a-um, sem sobra dos dois lados) — logo contar fileiras **é** contar casquinhas, exatamente.

### O pulo do gato

A fileira tem `3` estrelas e `4` barras → **7 caixinhas**:

```
[ ] [ ] [ ] [ ] [ ] [ ] [ ]
 1   2   3   4   5   6   7
```

Montar uma fileira é decidir **quais caixinhas levam estrela** — as que sobram viram barra automaticamente, sem escolha nenhuma. Ordem importa? Não (`{1,3,5}` e `{5,1,3}` são as mesmas caixinhas). Repete? Não (uma caixinha ou é estrela ou não é). **Sem ordem, sem repetição → é uma combinação.**

$$\text{estrelas} = k \quad\quad \text{barras} = n_{\text{tipos}} - 1 \quad\quad \text{caixinhas} = k + (n_{\text{tipos}} - 1)$$

$$C(7, 3) = \frac{7 \times 6 \times 5}{3!} = 35$$

```js
function combRepeticao(tipos, k) {
  const caixinhas = k + (tipos - 1);
  return combinacao(caixinhas, k);
}
console.log(combRepeticao(5, 3)); // 35  -> casquinhas de 3 bolas com 5 sabores
```

### Reconhecendo em outro problema

> **4 devs**, **6 bugs** idênticos no backlog. Só interessa *quantos* cada dev pega. Um dev pode pegar zero, um dev pode pegar todos.

| | Sorveteria | Bugs |
|---|---|---|
| estrela | bola | bug |
| tipo (compartimento) | sabor | dev |
| estrelas (`k`) | 3 | **6** |
| barras (`tipos − 1`) | 5 − 1 = 4 | 4 − 1 = **3** |
| **caixinhas (`n`)** | 3 + 4 = **7** | 6 + 3 = **9** |
| conta | `C(7,3)` = 35 | `C(9,6) = C(9,3)` = **84** |

> **Cuidado — a barra separa, não representa.** `n` compartimentos pedem `n − 1` divisórias. É o **off-by-one** de novo — o mesmo dos postes e vãos, o mesmo de "0 a 9 são 10 dígitos, não 9", o mesmo de `for (i = 0; i <= 9; i++)` rodar 10 vezes. Quando o enunciado disser "de X a Y", são `Y − X + 1` elementos.
> **Frase-âncora:** *barras = tipos − 1.*

> **Cuidado — os números do enunciado NÃO são os números da fileira.** Na sorveteria o enunciado dava 3 e 5, e a resposta foi `C(7,3)` — o 5 nem apareceu, e o 7 não estava em lugar nenhum. O `n` **sempre** nasce de `estrelas + barras`. Escrever `C(6,4)` pro problema dos bugs é usar os números crus.
> **Frase-âncora:** *o `n` de estrelas-e-barras nasce da soma, nunca vem pronto.*

---

## 13. Por que isso importa no seu dia a dia como dev

| Conceito de combinatória | No código, isso é… |
|---|---|
| `nᵏ` (arranjo com repetição) | **espaço de senhas**; por que "+1 caractere" (× n) vale mais que trocar símbolos |
| `n!` (permutação) | **`O(n!)`** — caixeiro-viajante por força bruta, ordenar por tentativa. Explode aos 12 |
| `2ⁿ` (cada elemento entra ou não) | **`O(2ⁿ)`** — todos os subconjuntos, força bruta em backtracking |
| `C(n,k)` (combinação) | quantos **pares/trios** dá pra formar — comparação par-a-par é `C(n,2)` ≈ `n²/2`, daí o `O(n²)` |
| produto cartesiano | **`CROSS JOIN`** e a explosão de linhas (`10⁴ × 10⁴ = 10⁸`) |
| explosão combinatória | **testes**: 7 flags booleanas = `2⁷` = 128 casos. É por isso que o Gate de Deploy te obrigou à tabela-verdade — e por que teste exaustivo não escala (daí o *pairwise testing*) |
| casa dos pombos (`n+1` em `n` caixas) | **colisão de hash é inevitável** — mais chaves que buckets, sempre |
| complemento | contar o caminho de fora: "quantos requests **não** falharam", "pelo menos um retry" |
| inclusão-exclusão | **dedupe entre fontes**: `|A| + |B| − |A ∩ B|` é literalmente `UNION` (que deduplica) vs `UNION ALL` (que soma cru) |

O fio condutor: **combinatória é o que explica por que força bruta explode.** Complexidade (`O(2ⁿ)`, `O(n!)`, `O(n²)`) não é uma tabela pra decorar — cada símbolo desses é um problema de contagem. `O(2ⁿ)` *é* o número de subconjuntos. `O(n!)` *é* o número de ordens. Quando você entende que enumerar todas as possibilidades tem um tamanho **calculável**, você para de otimizar constante e começa a atacar o expoente.

---

## 14. Erros clássicos (guarde estes)

1. **Multiplicar quando devia somar** (ou vice-versa). Ache o "e depois" (× ) ou o "ou então" (+) na frase **antes** de contar.
2. **Somar casos que se sobrepõem.** `18 + 15 = 33` numa turma de 30. Se há interseção, é inclusão-exclusão: subtrai `|A ∩ B|` **uma** vez, não duas.
3. **Dividir por `k!` onde a posição tem significado.** Pódio ≠ comitê. `8×7×6` = 336 (com medalhas) vs 56 (sem papéis).
4. **Dividir onde a sobrecontagem é desigual.** `125 ÷ 3!` na casquinha. `{C,M,B}` conta 6×, `{C,C,C}` conta 1×. Se der não-inteiro, você já sabe que errou.
5. **Off-by-one.** 0 a 9 são **10** dígitos. 5 sabores pedem **4** barras. Contou os *vãos* em vez dos *postes*.
6. **Usar os números crus do enunciado em estrelas-e-barras.** O `n` nasce de `estrelas + barras`, não vem no texto.
7. **Achar que "estoque decrescente" quebra a multiplicação.** `26×25×24` é multiplicação legítima — o princípio pede número **fixo** por etapa, não **igual** entre etapas.

---

## 15. Resumo

- **Combinatória = cardinalidade sem enumerar.** Você já sabia `|A|`; aqui você aprende a calculá-lo quando o conjunto é grande demais pra listar.
- **Dois princípios só.** Multiplicação (etapas encadeadas, "e depois", `∧`, `×`) e adição (casos **disjuntos**, "ou então", `∨`, `∪`). Todo o resto sai daí.
- **Duas perguntas classificam qualquer problema:** *repete?* (Regra 1) e *a ordem importa?* (Regra 2 / par ordenado). Quatro casos, quatro nomes de escola.
- **`n!` não é definição, é mecanismo:** o estoque decrescente indo até o fim.
- **`C(n,k)` = arranjo ÷ `k!`:** conte demais de propósito e divida pelo **excesso uniforme**. Se o excesso for desigual, a divisão é lixo.
- **Complemento:** leu "pelo menos", conte o que sobra (`Ā = U ∖ A`). É De Morgan — o "para todo" é o lado fácil.
- **Inclusão-exclusão:** o princípio da adição com remendo. Quem foi contado 2×, tira 1×. É a Regra 1 dos conjuntos cobrando a fatura.
- **Estrelas e barras:** quando repetição e ausência de ordem brigam, **troque o objeto** por um sem simetria. `n = estrelas + barras`, `barras = tipos − 1`.
- No trabalho, isso é: **espaço de senhas** (`nᵏ`), **por que força bruta explode** (`2ⁿ`, `n!`), **explosão de casos de teste** (`2ⁿ` flags), **colisão de hash** e `UNION` vs `UNION ALL`.

---

## 16. Como isso conecta com o resto

- **Conjuntos** é o alicerce: contagem é cardinalidade; as duas perguntas são as duas Regras; complemento e inclusão-exclusão são as operações e leis, contando.
- **Produto cartesiano** É o princípio da multiplicação. `|A × B| = |A| × |B|` é a mesma frase.
- **Lógica** (aula 01): `∧`→`×`, `∨`→`+`, `¬`→`−`. E "pelo menos um" ↔ "nenhum" é De Morgan.
- **Funções** (tema anterior): a bijeção é o que **licencia** estrelas-e-barras (contar fileiras = contar casquinhas). E o gancho de lá se paga aqui: quantas funções de `A` em `B` existem? `|B|^|A|` (arranjo com repetição). Quantas injetoras? Arranjo. Quantas bijetoras? `n!`.
- **Indução** (próximo módulo): a identidade `C(n,k) = C(n−1,k−1) + C(n−1,k)` ("esse elemento entra ou não entra") é o triângulo de Pascal — e o exemplo canônico de prova por indução.
- **Complexidade** (skill 04): `O(2ⁿ)` são subconjuntos, `O(n!)` são permutações, `O(n²)` são pares. Combinatória é o **porquê** da tabela de complexidade.
- **Testes** (skill 05): `2ⁿ` combinações de flags — por que teste exaustivo não escala e existe *pairwise*.
- **Segurança** (skill 08): espaço de senhas é `nᵏ`; entropia é o log dele.

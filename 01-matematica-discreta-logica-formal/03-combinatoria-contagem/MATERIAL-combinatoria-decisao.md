# Combinatória — o procedimento de decisão

Material de estudo. O material anterior (`MATERIAL-combinatoria-nucleo.md`) explica **o mecanismo**: por que `n!` é o estoque caindo até o fim, por que a combinação é o arranjo dividido. Este aqui é outra coisa: **o que rodar na cabeça quando um enunciado chega.**

Porque a fórmula nunca foi o problema.

> Este documento cobre: as quatro perguntas que classificam qualquer problema, o teste "objeto vs rótulo", os dois motivos para o estoque descer (física ou frase), o teste da troca para o eixo da ordem, e a regra da divisão que justifica o `÷ k!`. Apoia-se no `-nucleo` e em `MATERIAL-relacoes.md`.

---

## 1. Por que este documento existe

Olha estes dois problemas:

> **A)** De 8 corredores, quantos resultados de **ouro, prata e bronze**?
> **B)** De 8 devs, quantos **comitês de 3 pessoas**?

Mesmos 8. Mesmos 3. E os dois começam com a **mesma conta**: `8 × 7 × 6 = 336`.

Mas as respostas são **336** e **56** — diferem por um fator de 6. E nenhuma matemática nova separa as duas: o que separa é uma decisão de **modelagem**, tomada antes de escrever qualquer conta.

**"3 de 8" não é pergunta suficiente.** É por isso que decorar `C(n,k)` não resolve nada: você vai aplicar a fórmula certa no problema errado.

Este material é o procedimento que evita isso. Quatro perguntas, em ordem, cada uma com um teste concreto — nada de "sinta qual é o caso".

---

## 2. As quatro perguntas

Rode nesta ordem. Cada uma tem sua seção.

| # | Pergunta | Decide | Seção |
|---|---|---|---|
| ① | Faço **uma** escolha ou **várias** combinadas? | somar ou multiplicar | 3 |
| ② | Quem é `n` e quem é `k`? | base e expoente | 4 |
| ③ | O elemento usado fica **indisponível**? | estoque cheio ou decrescente | 5 |
| ④ | Trocar dois muda o resultado? | dividir ou não por `k!` | 6 |

Nenhuma delas pergunta "qual fórmula?". A fórmula é o que **sai** no fim.

---

## 3. Pergunta ① — uma escolha ou várias

> **Você faz UMA escolha, ou VÁRIAS que se combinam?**

O sinal está no enunciado, sempre:

| Na frase | O que é | Operação |
|---|---|---|
| "ou então", "um prato **só**", "escolha **um** destino" | uma escolha entre grupos | **soma** |
| "e depois", "**uma de cada**", "um X **e** um Y" | etapas encadeadas | **multiplica** |

```js
// "5 sabores de sorvete, 3 de picolé. Você compra UMA coisa."
5 + 3;      // 8   -> uma escolha, grupos disjuntos

// "3 entradas, 4 pratos, 2 sobremesas. Uma DE CADA."
3 * 4 * 2;  // 24  -> três escolhas encadeadas
```

O mesmo cardápio responde 9 ou 24 dependendo da frase. `3 + 4 + 2 = 9` não é "errado" — é a resposta de *"vou comer um item só, quantas opções?"*.

> **Cuidado — inclusão-exclusão fantasma.** Vendo dois grupos, a mão quer subtrair a interseção. Mas `|A ∪ B| = |A| + |B| − |A ∩ B|` só corrige quando os grupos **se sobrepõem**. Numa urna com 4 bolas vermelhas e 3 azuis, nenhuma bola é vermelha **e** azul → `|A ∩ B| = 0` → o termo some → a resposta é `4 + 3 = 7`, não 6.
> **Frase-âncora:** *sem sobreposição, a soma crua já está certa.*

---

## 4. Pergunta ② — quem é `n`, quem é `k`

Esta é a fonte nº 1 de erro, e ela tem um gatilho linguístico exato: a palavra **"cada"**.

> "3 questões, **cada uma** com 2 alternativas"
> "4 campos, **cada um** com 3 opções"
> "5 interruptores, **cada um** ligado ou desligado"

Nesse formato, os dois números do enunciado **não se multiplicam**. Eles têm papéis diferentes:

$$\underbrace{n}_{\text{quantas coisas cabem em cada escolha}} \quad\text{elevado a}\quad \underbrace{k}_{\text{quantas vezes eu escolho}}$$

Escreva estas duas linhas **antes** de qualquer conta:

```
posições (k) = ____   <- quantas vezes eu escolho?
opções (n)   = ____   <- quantas coisas cabem em cada escolha?
```

| Enunciado | `k` | `n` | Errado | Certo |
|---|---|---|---|---|
| 5 questões, 4 alternativas cada | 5 | 4 | `5 × 4 = 20` | `4⁵ = 1024` |
| 3 questões, V ou F | 3 | 2 | `3 × 2 = 6` | `2³ = 8` |
| 6 quadros, 6 pregos | 6 | 6 | `6 × 6 = 36` | `6! = 720` |
| 5 interruptores, liga/desliga | 5 | 2 | `5² = 25` | `2⁵ = 32` |

**A base é o que se repete; o expoente é quantas vezes.** No interruptor, o que se repete é o par liga/desliga — uma vez por interruptor.

### Dois testes de sanidade

**Enumere.** Quando o número é pequeno, não discuta:

```
VVV  VVF  VFV  VFF  FVV  FVF  FFV  FFF
```

Oito. Se sua fórmula deu 6, a lista te desmente.

**Cresça de um em um.** 1 interruptor → 2 estados. Adicione o segundo: cada um dos 2 estados vira 2 → 4. O terceiro → 8. **Cada interruptor dobra o total.** Uma coisa que dobra 5 vezes é `2⁵`, jamais `5 × 2`.

> **Cuidado — `nᵏ` não é "os dois números do enunciado multiplicados".** É `n` multiplicado por si mesmo `k` vezes.
> **Frase-âncora:** *quantas vezes escolho → expoente. Quantas cabem em cada → base.*

---

## 5. Pergunta ③ — desce ou não desce

Aqui mora o "estoque cheio" (`nᵏ`) vs "estoque decrescente" (`n × (n−1) × …`). E o teste ingênuo — *"o elemento sai do estoque?"* — é circular: pra responder, você já precisa saber a resposta.

O teste que funciona:

> **Se o mesmo elemento aparecesse duas vezes no resultado, ele teria que estar em dois lugares ao mesmo tempo?**

- **Sim, seria impossível** → desce.
- **Não, é normal** → não desce.

```
"Trovão em 1º E Trovão em 2º"     -> um cavalo cruzando a linha duas vezes: IMPOSSÍVEL -> desce
"saiu 5 no 1º lance E 5 no 2º"    -> dois lançamentos, dois momentos: NORMAL -> não desce
```

### 5.1 Objeto vs rótulo

O teste rápido. Existem **dois tipos de coisa** sendo escolhida:

| | O que é | Exemplos | Escolher… |
|---|---|---|---|
| **Objeto** | existe **um só** no mundo | pessoa, cavalo, quadro, livro, carta, cadeira | **consome** |
| **Rótulo** | é uma **categoria**, tem infinitos | dígito, face, cara/coroa, V/F, letra, cor, liga/desliga | **carimba** |

Ana não pode ser presidente **e** vice — ela é uma pessoa só. Mas marcar `V` na questão 1 **não gasta** o `V`: `V` não é um objeto que saiu da caixa, é um carimbo. **E carimbo não acaba.**

> **Objeto se retira; rótulo se carimba.**

### 5.2 Física ou frase — os dois únicos motivos

O tipo é um atalho, não a regra. A regra é: o elemento fica indisponível por **um de dois motivos**, e só:

| Motivo | Exemplo | Precisa estar escrito? |
|---|---|---|
| **Física** — o objeto é único e está ocupado | pessoa em dois cargos, cavalo em duas posições | **não** — é óbvio |
| **Frase** — o enunciado proíbe | "sem repetir dígito", "sem devolver" | **sim, sempre** |

**Se nenhum dos dois existe, não desce.**

Ninguém escreve "escolha 3 pessoas, sem repetir pessoa" — seria redundante, a física já garante. Mas "senha de 4 dígitos **sem repetir**" **precisa** estar escrito, porque sem essa frase o dígito repete à vontade.

> **Frase-âncora:** *objeto desce por natureza; rótulo só desce por ordem escrita.*

### 5.3 A urna que prova que o tipo não decide sozinho

Mesma urna. Mesmas bolas. Três enunciados:

| Enunciado | Desce? | Motivo | Conta |
|---|---|---|---|
| 50 bolinhas, sorteia 3, **sem devolver** | sim | **frase** | `50 × 49 × 48` |
| 50 bolinhas, sorteia 3, **devolvendo** cada uma | **não** | nenhum | `50 × 50 × 50` |
| 50 bolinhas, sorteia 3 (não diz nada) | **ambíguo** | — | enunciado ruim |

A bola **é** um objeto físico — e mesmo assim não desce no segundo caso. Porque ela **volta pro estoque**.

**O que muda a conta é a frase, não a natureza da bola.** Se fosse física, desceria nos três. Bola em urna nunca é física: é sempre frase.

### 5.4 O procedimento

```
1. O que estou escolhendo? -> objeto ou rótulo?
2. Objeto  -> desce (física).
   Rótulo  -> NÃO desce, a menos que o texto diga "sem repetir".
3. Confirme: dois iguais no resultado seria impossível?
```

---

## 6. Pergunta ④ — a ordem importa

### 6.1 O teste da troca

Pare de perguntar "importa?" — é vago e você responde por intuição.

> **Pegue dois elementos do resultado e troque-os de lugar. Você obteve OUTRA coisa ou A MESMA coisa?**

- **Outra coisa** → a ordem importa → **não divida**
- **A mesma coisa** → a ordem não importa → **divida por `k!`**

### 6.2 Posição com nome

O mesmo teste por outro ângulo: **existe posição com significado?**

| O resultado é… | Ordem | Sinal |
|---|---|---|
| uma **sequência** — cada lugar tem nome | importa | 1º/2º/3º, presidente/vice, ouro/prata |
| um **conjunto** — só interessa quem está | não importa | "um grupo de", "uma comissão", "quais", "os que se classificam" |

Cargo é **categoria**; categoria é **posição com nome**. Se você precisa dizer **onde** cada um ficou, importa. Se basta dizer **quem** entrou, não importa.

**O sintoma de que você não fez o teste:** a palavra *"primeira"* apareceu no seu raciocínio e não estava no enunciado. Você inventou uma posição — e vai contar demais.

### 6.3 A armadilha: ordem do processo ≠ ordem do resultado

Esta derruba mais gente que qualquer outra coisa do tópico.

| Cenário | O processo | O resultado | Ordem importa? |
|---|---|---|---|
| Mega-Sena | o globo cospe os números **em sequência** | o bilhete é `{7, 13, 42}` | **não** |
| Mão de pôquer | você tira as cartas **uma por uma** | a mão é um conjunto de 5 | **não** |
| Classificados | os cavalos cruzam a linha **em sequência** | a lista dos 3 que passaram | **não** |
| Pódio | os cavalos cruzam a linha em sequência | 1º Trovão, 2º Relâmpago, 3º Furacão | **sim** |

Os quatro **acontecem em ordem**. Só um **registra** a ordem.

> **Cuidado — não pergunte se aconteceu em sequência. Pergunte se o resultado guarda a sequência.**
> **Frase-âncora:** *importa não é como saiu — é se o lugar tem nome.*

**O teste operacional que resolve de vez: escreva o resultado.** O pódio você não consegue escrever sem dizer quem foi ouro. A classificação você escreve `{A, B, C}` e está completo. **Se o resultado precisa de rótulos para existir, a ordem importa.**

### 6.4 Os pares que provam

Cada par: mesmos objetos, mesma quantidade, **uma palavra trocada**.

| | Não importa | Importa | O que mudou |
|---|---|---|---|
| Cartas | sua **mão** de 5 | 5 cartas, **uma para cada** jogador | as pessoas são posições |
| Corrida | os **3 que se classificam** | o **pódio** (1º, 2º, 3º) | as medalhas são posições |
| Pizza | **2 pizzas** que chegam juntas | uma de **entrada**, uma de **prato** | os tempos são posições |
| Alunos | **3 representantes** | **presidente, vice, secretário** | os cargos são posições |

Reordenar as cartas entre os dedos não te dá outro royal flush. Trocar a carta do João com a da Ana muda quem tem o quê.

---

## 7. Por que se divide — a regra da divisão

O `÷ k!` não é um passo mecânico da fórmula. É um **teorema**, com hipótese. Aqui está ele.

### 7.1 Contar o mesmo conjunto de dois jeitos

Encolha até caber na mão. **4 pessoas** (`a, b, c, d`), escolher **2**.

Conte **com ordem**: `4 × 3 = 12`. E dá pra listar:

```
ab  ba  ac  ca  ad  da  bc  cb  bd  db  cd  dc
```

Agora **agrupe** as 12 pela pergunta *"quais pessoas estão aqui?"*:

```
{a,b} ->  ab  ba
{a,c} ->  ac  ca
{a,d} ->  ad  da
{b,c} ->  bc  cb
{b,d} ->  bd  db
{c,d} ->  cd  dc
```

As 12 linhas se organizaram em **6 grupos de 2**. Nada sobrou, nada ficou em dois grupos, **todos os grupos têm o mesmo tamanho**.

$$12 = 6 \times 2 \quad\Longrightarrow\quad 6 = \frac{12}{2}$$

Os 6 grupos **são** as escolhas sem ordem. `C(4,2) = 6` — e não foi preciso acreditar em ninguém: as 12 estão listadas ali.

> **Regra da divisão:** se um conjunto de tamanho `T` é particionado em grupos **todos do mesmo tamanho `m`**, o número de grupos é `T / m`.

Não tem mistério: **dividir é desagrupar.** 12 sapatos, 2 por pessoa → 6 pessoas.

### 7.2 O divisor é o TAMANHO; a resposta é a QUANTIDADE

Esta é a inversão que confunde:

| | Valor | O que é |
|---|---|---|
| **total** (`T`) | 12 | as sequências |
| **tamanho de cada grupo** (`m`) | 2 | ← **você divide por isto** |
| **quantidade de grupos** (`T/m`) | 6 | ← **isto é a resposta** |

$$\frac{\text{total}}{\text{tamanho de cada grupo}} = \text{quantidade de grupos}$$

Você divide por **2**, não por 6. Dividir pela quantidade de grupos exigiria já saber a resposta pra calcular a resposta.

> **Frase-âncora:** *o divisor é o tamanho do grupo; a resposta é o número de grupos.*

### 7.3 Por que `m = k!`

Congele um grupo: `{a, b}`. Quais das 12 sequências caem nele? **Todas as ordens dessas 2 pessoas**: `ab`, `ba`. São `2! = 2`.

Com 3 escolhidos, o grupo teria `3! = 6` sequências dentro. Com `k`: **`k!`**.

> **O tamanho do grupo é a permutação dos `k` escolhidos** — "de quantos jeitos essas `k` coisas específicas podiam ter sido enfileiradas".

$$C(n,k) = \frac{\text{quantas sequências}}{\text{quantas sequências por escolha}} = \frac{n \times (n-1) \times \dots}{k!}$$

### 7.4 Isso é o `groupBy` que você implementou

O agrupamento da seção 7.1 tem nome, e está no seu `MATERIAL-relacoes.md`: a relação de equivalência **"tem as mesmas pessoas"** (reflexiva + simétrica + transitiva) **particiona** o conjunto em **classes de equivalência** — grupos disjuntos que cobrem tudo.

Não foi sorte da lista. **É a matemática da equivalência garantindo** que nada sobra e nada se sobrepõe.

E dá pra ver rodando, com o `groupBy` do `EXERCICIO-relacoes`:

```js
const pessoas = ["ana", "bia", "caio", "duda", "eva", "gil"];

// as sequências: 6 × 5 × 4 = 120 escalações (presidente, vice, tesoureiro)
const escalacoes = [];
for (const p of pessoas)
  for (const v of pessoas)
    for (const t of pessoas)
      if (p !== v && v !== t && p !== t) escalacoes.push([p, v, t]);

// a equivalência "tem as mesmas pessoas" -> particiona
const grupos = new Map();
for (const e of escalacoes) {
  const chave = [...e].sort().join(",");       // <- o keyFn do groupBy
  if (!grupos.has(chave)) grupos.set(chave, []);
  grupos.get(chave).push(e);
}

console.log(escalacoes.length);                        // 120  -> o total (T)
console.log([...grupos.values()][0].length);           // 6    -> o tamanho (m = 3!)
console.log(grupos.size);                              // 20   -> a quantidade (T/m)

// todos os grupos têm mesmo tamanho? (a HIPÓTESE da regra da divisão)
console.log([...grupos.values()].every((g) => g.length === 6));  // true
console.log(120 / 6);                                  // 20   -> bate
```

**A combinação é um `groupBy` seguido de `.size`.** Dividir por `k!` é o atalho — e ele funciona *porque* todo balde tem o mesmo tamanho. A última linha do código é a hipótese sendo verificada.

### 7.5 A hipótese é a alma da coisa

> **Cuidado — a regra da divisão exige grupos TODOS do mesmo tamanho.** Sem isso, `T / m` não conta grupos: conta ficção. Se os 12 caíssem em grupos de `3, 2, 2, 1, 4`, dividir por quê? Não existe um `m`.

E é exatamente isso que quebra quando há **repetição**. Casquinha de 3 bolas, 5 sabores, contada com ordem (`5³ = 125`):

| Casquinha | Sequências dentro | Por quê |
|---|---|---|
| `{C, M, B}` | **6** | 3 bolas distintas → `3!` ordens |
| `{C, C, M}` | **3** | as duas `C` são intercambiáveis |
| `{C, C, C}` | **1** | trocar bolas idênticas não gera nada novo |

A partição existe — mas as classes têm tamanhos **6, 3, 1**. A hipótese foi violada, e `125 ÷ 6 = 20,83…`.

> **O não-inteiro é o teorema avisando que a hipótese não valia.** Contagem é sempre inteira. É por isso que o caso "sem ordem + com repetição" precisa de estrelas e barras: **não há excesso uniforme pra dividir.**
> **Frase-âncora:** *dividir conta grupos — mas só se todos tiverem o mesmo tamanho.*

---

## 8. A árvore, com o procedimento inteiro

```
① uma escolha ou várias?
   uma  -> SOMA os grupos disjuntos. fim.
   várias -> multiplica, siga.

② quem é k (quantas vezes escolho) e quem é n (quantas cabem em cada)?

③ desce? (física / frase / nenhum)
④ a ordem importa? (teste da troca)

         │ ordem IMPORTA            │ ordem NÃO importa
─────────┼──────────────────────────┼─────────────────────────
não desce│ nᵏ                       │ C(n+k−1, k)  estrelas/barras
desce    │ n × (n−1) × …  (k fatores)│ C(n, k) = arranjo ÷ k!
```

E a permutação (`n!`) é a célula "desce + importa" com `k = n` — o estoque indo até zerar. **Não é uma sexta fórmula.**

---

## 9. Mapa de sinais

| Na frase | Ferramenta |
|---|---|
| "ou então", "um só" (grupos disjuntos) | **soma** |
| "e depois", "uma de cada" | **multiplica** |
| **"cada"** ("N coisas, cada uma com M opções") | `n^k` — **nunca** `N × M` |
| "pode repetir", "`aaa` vale", nada dito sobre rótulo | estoque **cheio** |
| "sem repetir", "sem devolver", "cada um uma vez" | estoque **decrescente** (frase) |
| pessoas, cavalos, quadros, cadeiras | estoque **decrescente** (física) |
| 1º/2º/3º, cargos, medalhas, "em ordem" | ordem importa → **não divida** |
| "um grupo de", "uma comissão", "quais", "os que passam" | ordem não importa → **divida** |
| **"pelo menos"** | **complemento** — reescreva e volte à árvore |
| "os dois", "ambos", "também" | **inclusão-exclusão** — conserte e volte à árvore |
| itens **idênticos** + "quantos cada um leva" | **estrelas e barras** |

> **Complemento e inclusão-exclusão não são casos da árvore** — são **reescritas da pergunta**. "Pelo menos um dígito repetido" vira `10⁴ − (10×9×8×7)`: **dois casos da árvore**, ligados por uma subtração. Rode-os antes; a árvore vem depois. (Detalhe no `-nucleo`.)

---

## 10. Erros clássicos (guarde estes)

1. **`5 × 4` em vez de `4⁵`** — os dois números do enunciado não se multiplicam. *Quantas vezes escolho → expoente; quantas cabem em cada → base.*
2. **`5²` em vez de `2⁵`** — base e expoente invertidos. *A base é o que se repete.*
3. **`9³` no pódio de cavalos** — usou estoque cheio onde a física obriga a descer. *Um cavalo não cruza a linha duas vezes.*
4. **`6 × 5 × 5`** — o estoque desceu uma vez e congelou. *Ele desce a CADA etapa.*
5. **`8 × 7` num dado de 8 faces lançado 2×** — desceu sem motivo. *Dado não tem memória; sem física nem frase, não desce.*
6. **`÷ 3!` onde há cargos** — dividiu onde a posição tem nome. *Divide-se só quando a troca não muda nada.*
7. **`4 + 3 − 1` sem sobreposição** — inclusão-exclusão fantasma. *Sem interseção, a soma crua está certa.*
8. **Off-by-one** — 0 a 9 são **10** dígitos; `n` compartimentos pedem `n−1` barras. *Contou os vãos em vez dos postes.*
9. **Confundir ordem do processo com ordem do resultado** — a Mega-Sena sorteia em sequência e premia um conjunto.
10. **Dividir com grupos de tamanhos diferentes** — `125 ÷ 3!`. *Se der não-inteiro, a hipótese não valia.*

---

## 11. Resumo

- **A fórmula nunca foi o problema.** Mesmos `8 × 7 × 6` dão 336 (pódio) ou 56 (comitê). A diferença é **modelagem**.
- **Quatro perguntas, nesta ordem:** ① uma escolha ou várias? ② quem é `n`, quem é `k`? ③ desce? ④ a ordem importa?
- **② tem um gatilho: a palavra "cada".** "N coisas, cada uma com M opções" é `M^N`, nunca `N × M`.
- **③ tem dois motivos, e só dois:** desce por **física** (o objeto é único) ou por **frase** (o texto proibiu). Sem um deles, **não desce**. *Objeto se retira; rótulo se carimba.*
- **④ tem um teste:** troque dois elementos. Outra coisa → importa. A mesma coisa → divida. *Importa não é como saiu — é se o lugar tem nome.*
- **O `÷ k!` é um teorema com hipótese:** a regra da divisão conta grupos, e exige que **todos tenham o mesmo tamanho**. O divisor é o **tamanho** (`k!`); a resposta é a **quantidade**.
- **É o seu `groupBy`:** a equivalência "tem os mesmos elementos" particiona as sequências em classes. A combinação é `groupBy(...).size`.
- Quando a hipótese quebra (tamanhos 6, 3, 1), a divisão morre e entra **estrelas e barras**. O **não-inteiro** é o aviso.

---

## 12. Como isso conecta com o resto

- **`-nucleo`** é o gêmeo: lá está o *mecanismo* (por que `n!` é o estoque caindo); aqui está a *decisão* (quando usar cada um).
- **Relações**: a regra da divisão é **equivalência → partição → classes**. O `÷ k!` é `groupBy` com todos os baldes do mesmo tamanho.
- **Conjuntos**: "repete?" é a Regra 1; "a ordem importa?" é a Regra 2 (conjunto) vs o par ordenado (produto cartesiano). "Sequência ou conjunto?" é literalmente a pergunta.
- **Lógica**: "e depois" é `∧`; "ou então" é `∨`; "pelo menos" é a negação de "nenhum" (De Morgan).
- **Testes** (skill 05): o hábito de **enumerar quando o número é pequeno** é o mesmo do oráculo de força bruta — a lista de 8 linhas `VVV…FFF` desmente sua fórmula sem discussão.# Combinatória — o procedimento de decisão

Material de estudo. O material anterior (`MATERIAL-combinatoria-nucleo.md`) explica **o mecanismo**: por que `n!` é o estoque caindo até o fim, por que a combinação é o arranjo dividido. Este aqui é outra coisa: **o que rodar na cabeça quando um enunciado chega.**

Porque a fórmula nunca foi o problema.

> Este documento cobre: as quatro perguntas que classificam qualquer problema, o teste "objeto vs rótulo", os dois motivos para o estoque descer (física ou frase), o teste da troca para o eixo da ordem, e a regra da divisão que justifica o `÷ k!`. Apoia-se no `-nucleo` e em `MATERIAL-relacoes.md`.

---

## 1. Por que este documento existe

Olha estes dois problemas:

> **A)** De 8 corredores, quantos resultados de **ouro, prata e bronze**?
> **B)** De 8 devs, quantos **comitês de 3 pessoas**?

Mesmos 8. Mesmos 3. E os dois começam com a **mesma conta**: `8 × 7 × 6 = 336`.

Mas as respostas são **336** e **56** — diferem por um fator de 6. E nenhuma matemática nova separa as duas: o que separa é uma decisão de **modelagem**, tomada antes de escrever qualquer conta.

**"3 de 8" não é pergunta suficiente.** É por isso que decorar `C(n,k)` não resolve nada: você vai aplicar a fórmula certa no problema errado.

Este material é o procedimento que evita isso. Quatro perguntas, em ordem, cada uma com um teste concreto — nada de "sinta qual é o caso".

---

## 2. As quatro perguntas

Rode nesta ordem. Cada uma tem sua seção.

| # | Pergunta | Decide | Seção |
|---|---|---|---|
| ① | Faço **uma** escolha ou **várias** combinadas? | somar ou multiplicar | 3 |
| ② | Quem é `n` e quem é `k`? | base e expoente | 4 |
| ③ | O elemento usado fica **indisponível**? | estoque cheio ou decrescente | 5 |
| ④ | Trocar dois muda o resultado? | dividir ou não por `k!` | 6 |

Nenhuma delas pergunta "qual fórmula?". A fórmula é o que **sai** no fim.

---

## 3. Pergunta ① — uma escolha ou várias

> **Você faz UMA escolha, ou VÁRIAS que se combinam?**

O sinal está no enunciado, sempre:

| Na frase | O que é | Operação |
|---|---|---|
| "ou então", "um prato **só**", "escolha **um** destino" | uma escolha entre grupos | **soma** |
| "e depois", "**uma de cada**", "um X **e** um Y" | etapas encadeadas | **multiplica** |

```js
// "5 sabores de sorvete, 3 de picolé. Você compra UMA coisa."
5 + 3;      // 8   -> uma escolha, grupos disjuntos

// "3 entradas, 4 pratos, 2 sobremesas. Uma DE CADA."
3 * 4 * 2;  // 24  -> três escolhas encadeadas
```

O mesmo cardápio responde 9 ou 24 dependendo da frase. `3 + 4 + 2 = 9` não é "errado" — é a resposta de *"vou comer um item só, quantas opções?"*.

> **Cuidado — inclusão-exclusão fantasma.** Vendo dois grupos, a mão quer subtrair a interseção. Mas `|A ∪ B| = |A| + |B| − |A ∩ B|` só corrige quando os grupos **se sobrepõem**. Numa urna com 4 bolas vermelhas e 3 azuis, nenhuma bola é vermelha **e** azul → `|A ∩ B| = 0` → o termo some → a resposta é `4 + 3 = 7`, não 6.
> **Frase-âncora:** *sem sobreposição, a soma crua já está certa.*

---

## 4. Pergunta ② — quem é `n`, quem é `k`

Esta é a fonte nº 1 de erro, e ela tem um gatilho linguístico exato: a palavra **"cada"**.

> "3 questões, **cada uma** com 2 alternativas"
> "4 campos, **cada um** com 3 opções"
> "5 interruptores, **cada um** ligado ou desligado"

Nesse formato, os dois números do enunciado **não se multiplicam**. Eles têm papéis diferentes:

$$\underbrace{n}_{\text{quantas coisas cabem em cada escolha}} \quad\text{elevado a}\quad \underbrace{k}_{\text{quantas vezes eu escolho}}$$

Escreva estas duas linhas **antes** de qualquer conta:

```
posições (k) = ____   <- quantas vezes eu escolho?
opções (n)   = ____   <- quantas coisas cabem em cada escolha?
```

| Enunciado | `k` | `n` | Errado | Certo |
|---|---|---|---|---|
| 5 questões, 4 alternativas cada | 5 | 4 | `5 × 4 = 20` | `4⁵ = 1024` |
| 3 questões, V ou F | 3 | 2 | `3 × 2 = 6` | `2³ = 8` |
| 6 quadros, 6 pregos | 6 | 6 | `6 × 6 = 36` | `6! = 720` |
| 5 interruptores, liga/desliga | 5 | 2 | `5² = 25` | `2⁵ = 32` |

**A base é o que se repete; o expoente é quantas vezes.** No interruptor, o que se repete é o par liga/desliga — uma vez por interruptor.

### Dois testes de sanidade

**Enumere.** Quando o número é pequeno, não discuta:

```
VVV  VVF  VFV  VFF  FVV  FVF  FFV  FFF
```

Oito. Se sua fórmula deu 6, a lista te desmente.

**Cresça de um em um.** 1 interruptor → 2 estados. Adicione o segundo: cada um dos 2 estados vira 2 → 4. O terceiro → 8. **Cada interruptor dobra o total.** Uma coisa que dobra 5 vezes é `2⁵`, jamais `5 × 2`.

> **Cuidado — `nᵏ` não é "os dois números do enunciado multiplicados".** É `n` multiplicado por si mesmo `k` vezes.
> **Frase-âncora:** *quantas vezes escolho → expoente. Quantas cabem em cada → base.*

---

## 5. Pergunta ③ — desce ou não desce

Aqui mora o "estoque cheio" (`nᵏ`) vs "estoque decrescente" (`n × (n−1) × …`). E o teste ingênuo — *"o elemento sai do estoque?"* — é circular: pra responder, você já precisa saber a resposta.

O teste que funciona:

> **Se o mesmo elemento aparecesse duas vezes no resultado, ele teria que estar em dois lugares ao mesmo tempo?**

- **Sim, seria impossível** → desce.
- **Não, é normal** → não desce.

```
"Trovão em 1º E Trovão em 2º"     -> um cavalo cruzando a linha duas vezes: IMPOSSÍVEL -> desce
"saiu 5 no 1º lance E 5 no 2º"    -> dois lançamentos, dois momentos: NORMAL -> não desce
```

### 5.1 Objeto vs rótulo

O teste rápido. Existem **dois tipos de coisa** sendo escolhida:

| | O que é | Exemplos | Escolher… |
|---|---|---|---|
| **Objeto** | existe **um só** no mundo | pessoa, cavalo, quadro, livro, carta, cadeira | **consome** |
| **Rótulo** | é uma **categoria**, tem infinitos | dígito, face, cara/coroa, V/F, letra, cor, liga/desliga | **carimba** |

Ana não pode ser presidente **e** vice — ela é uma pessoa só. Mas marcar `V` na questão 1 **não gasta** o `V`: `V` não é um objeto que saiu da caixa, é um carimbo. **E carimbo não acaba.**

> **Objeto se retira; rótulo se carimba.**

### 5.2 Física ou frase — os dois únicos motivos

O tipo é um atalho, não a regra. A regra é: o elemento fica indisponível por **um de dois motivos**, e só:

| Motivo | Exemplo | Precisa estar escrito? |
|---|---|---|
| **Física** — o objeto é único e está ocupado | pessoa em dois cargos, cavalo em duas posições | **não** — é óbvio |
| **Frase** — o enunciado proíbe | "sem repetir dígito", "sem devolver" | **sim, sempre** |

**Se nenhum dos dois existe, não desce.**

Ninguém escreve "escolha 3 pessoas, sem repetir pessoa" — seria redundante, a física já garante. Mas "senha de 4 dígitos **sem repetir**" **precisa** estar escrito, porque sem essa frase o dígito repete à vontade.

> **Frase-âncora:** *objeto desce por natureza; rótulo só desce por ordem escrita.*

### 5.3 A urna que prova que o tipo não decide sozinho

Mesma urna. Mesmas bolas. Três enunciados:

| Enunciado | Desce? | Motivo | Conta |
|---|---|---|---|
| 50 bolinhas, sorteia 3, **sem devolver** | sim | **frase** | `50 × 49 × 48` |
| 50 bolinhas, sorteia 3, **devolvendo** cada uma | **não** | nenhum | `50 × 50 × 50` |
| 50 bolinhas, sorteia 3 (não diz nada) | **ambíguo** | — | enunciado ruim |

A bola **é** um objeto físico — e mesmo assim não desce no segundo caso. Porque ela **volta pro estoque**.

**O que muda a conta é a frase, não a natureza da bola.** Se fosse física, desceria nos três. Bola em urna nunca é física: é sempre frase.

### 5.4 O procedimento

```
1. O que estou escolhendo? -> objeto ou rótulo?
2. Objeto  -> desce (física).
   Rótulo  -> NÃO desce, a menos que o texto diga "sem repetir".
3. Confirme: dois iguais no resultado seria impossível?
```

---

## 6. Pergunta ④ — a ordem importa

### 6.1 O teste da troca

Pare de perguntar "importa?" — é vago e você responde por intuição.

> **Pegue dois elementos do resultado e troque-os de lugar. Você obteve OUTRA coisa ou A MESMA coisa?**

- **Outra coisa** → a ordem importa → **não divida**
- **A mesma coisa** → a ordem não importa → **divida por `k!`**

### 6.2 Posição com nome

O mesmo teste por outro ângulo: **existe posição com significado?**

| O resultado é… | Ordem | Sinal |
|---|---|---|
| uma **sequência** — cada lugar tem nome | importa | 1º/2º/3º, presidente/vice, ouro/prata |
| um **conjunto** — só interessa quem está | não importa | "um grupo de", "uma comissão", "quais", "os que se classificam" |

Cargo é **categoria**; categoria é **posição com nome**. Se você precisa dizer **onde** cada um ficou, importa. Se basta dizer **quem** entrou, não importa.

**O sintoma de que você não fez o teste:** a palavra *"primeira"* apareceu no seu raciocínio e não estava no enunciado. Você inventou uma posição — e vai contar demais.

### 6.3 A armadilha: ordem do processo ≠ ordem do resultado

Esta derruba mais gente que qualquer outra coisa do tópico.

| Cenário | O processo | O resultado | Ordem importa? |
|---|---|---|---|
| Mega-Sena | o globo cospe os números **em sequência** | o bilhete é `{7, 13, 42}` | **não** |
| Mão de pôquer | você tira as cartas **uma por uma** | a mão é um conjunto de 5 | **não** |
| Classificados | os cavalos cruzam a linha **em sequência** | a lista dos 3 que passaram | **não** |
| Pódio | os cavalos cruzam a linha em sequência | 1º Trovão, 2º Relâmpago, 3º Furacão | **sim** |

Os quatro **acontecem em ordem**. Só um **registra** a ordem.

> **Cuidado — não pergunte se aconteceu em sequência. Pergunte se o resultado guarda a sequência.**
> **Frase-âncora:** *importa não é como saiu — é se o lugar tem nome.*

**O teste operacional que resolve de vez: escreva o resultado.** O pódio você não consegue escrever sem dizer quem foi ouro. A classificação você escreve `{A, B, C}` e está completo. **Se o resultado precisa de rótulos para existir, a ordem importa.**

### 6.4 Os pares que provam

Cada par: mesmos objetos, mesma quantidade, **uma palavra trocada**.

| | Não importa | Importa | O que mudou |
|---|---|---|---|
| Cartas | sua **mão** de 5 | 5 cartas, **uma para cada** jogador | as pessoas são posições |
| Corrida | os **3 que se classificam** | o **pódio** (1º, 2º, 3º) | as medalhas são posições |
| Pizza | **2 pizzas** que chegam juntas | uma de **entrada**, uma de **prato** | os tempos são posições |
| Alunos | **3 representantes** | **presidente, vice, secretário** | os cargos são posições |

Reordenar as cartas entre os dedos não te dá outro royal flush. Trocar a carta do João com a da Ana muda quem tem o quê.

---

## 7. Por que se divide — a regra da divisão

O `÷ k!` não é um passo mecânico da fórmula. É um **teorema**, com hipótese. Aqui está ele.

### 7.1 Contar o mesmo conjunto de dois jeitos

Encolha até caber na mão. **4 pessoas** (`a, b, c, d`), escolher **2**.

Conte **com ordem**: `4 × 3 = 12`. E dá pra listar:

```
ab  ba  ac  ca  ad  da  bc  cb  bd  db  cd  dc
```

Agora **agrupe** as 12 pela pergunta *"quais pessoas estão aqui?"*:

```
{a,b} ->  ab  ba
{a,c} ->  ac  ca
{a,d} ->  ad  da
{b,c} ->  bc  cb
{b,d} ->  bd  db
{c,d} ->  cd  dc
```

As 12 linhas se organizaram em **6 grupos de 2**. Nada sobrou, nada ficou em dois grupos, **todos os grupos têm o mesmo tamanho**.

$$12 = 6 \times 2 \quad\Longrightarrow\quad 6 = \frac{12}{2}$$

Os 6 grupos **são** as escolhas sem ordem. `C(4,2) = 6` — e não foi preciso acreditar em ninguém: as 12 estão listadas ali.

> **Regra da divisão:** se um conjunto de tamanho `T` é particionado em grupos **todos do mesmo tamanho `m`**, o número de grupos é `T / m`.

Não tem mistério: **dividir é desagrupar.** 12 sapatos, 2 por pessoa → 6 pessoas.

### 7.2 O divisor é o TAMANHO; a resposta é a QUANTIDADE

Esta é a inversão que confunde:

| | Valor | O que é |
|---|---|---|
| **total** (`T`) | 12 | as sequências |
| **tamanho de cada grupo** (`m`) | 2 | ← **você divide por isto** |
| **quantidade de grupos** (`T/m`) | 6 | ← **isto é a resposta** |

$$\frac{\text{total}}{\text{tamanho de cada grupo}} = \text{quantidade de grupos}$$

Você divide por **2**, não por 6. Dividir pela quantidade de grupos exigiria já saber a resposta pra calcular a resposta.

> **Frase-âncora:** *o divisor é o tamanho do grupo; a resposta é o número de grupos.*

### 7.3 Por que `m = k!`

Congele um grupo: `{a, b}`. Quais das 12 sequências caem nele? **Todas as ordens dessas 2 pessoas**: `ab`, `ba`. São `2! = 2`.

Com 3 escolhidos, o grupo teria `3! = 6` sequências dentro. Com `k`: **`k!`**.

> **O tamanho do grupo é a permutação dos `k` escolhidos** — "de quantos jeitos essas `k` coisas específicas podiam ter sido enfileiradas".

$$C(n,k) = \frac{\text{quantas sequências}}{\text{quantas sequências por escolha}} = \frac{n \times (n-1) \times \dots}{k!}$$

### 7.4 Isso é o `groupBy` que você implementou

O agrupamento da seção 7.1 tem nome, e está no seu `MATERIAL-relacoes.md`: a relação de equivalência **"tem as mesmas pessoas"** (reflexiva + simétrica + transitiva) **particiona** o conjunto em **classes de equivalência** — grupos disjuntos que cobrem tudo.

Não foi sorte da lista. **É a matemática da equivalência garantindo** que nada sobra e nada se sobrepõe.

E dá pra ver rodando, com o `groupBy` do `EXERCICIO-relacoes`:

```js
const pessoas = ["ana", "bia", "caio", "duda", "eva", "gil"];

// as sequências: 6 × 5 × 4 = 120 escalações (presidente, vice, tesoureiro)
const escalacoes = [];
for (const p of pessoas)
  for (const v of pessoas)
    for (const t of pessoas)
      if (p !== v && v !== t && p !== t) escalacoes.push([p, v, t]);

// a equivalência "tem as mesmas pessoas" -> particiona
const grupos = new Map();
for (const e of escalacoes) {
  const chave = [...e].sort().join(",");       // <- o keyFn do groupBy
  if (!grupos.has(chave)) grupos.set(chave, []);
  grupos.get(chave).push(e);
}

console.log(escalacoes.length);                        // 120  -> o total (T)
console.log([...grupos.values()][0].length);           // 6    -> o tamanho (m = 3!)
console.log(grupos.size);                              // 20   -> a quantidade (T/m)

// todos os grupos têm mesmo tamanho? (a HIPÓTESE da regra da divisão)
console.log([...grupos.values()].every((g) => g.length === 6));  // true
console.log(120 / 6);                                  // 20   -> bate
```

**A combinação é um `groupBy` seguido de `.size`.** Dividir por `k!` é o atalho — e ele funciona *porque* todo balde tem o mesmo tamanho. A última linha do código é a hipótese sendo verificada.

### 7.5 A hipótese é a alma da coisa

> **Cuidado — a regra da divisão exige grupos TODOS do mesmo tamanho.** Sem isso, `T / m` não conta grupos: conta ficção. Se os 12 caíssem em grupos de `3, 2, 2, 1, 4`, dividir por quê? Não existe um `m`.

E é exatamente isso que quebra quando há **repetição**. Casquinha de 3 bolas, 5 sabores, contada com ordem (`5³ = 125`):

| Casquinha | Sequências dentro | Por quê |
|---|---|---|
| `{C, M, B}` | **6** | 3 bolas distintas → `3!` ordens |
| `{C, C, M}` | **3** | as duas `C` são intercambiáveis |
| `{C, C, C}` | **1** | trocar bolas idênticas não gera nada novo |

A partição existe — mas as classes têm tamanhos **6, 3, 1**. A hipótese foi violada, e `125 ÷ 6 = 20,83…`.

> **O não-inteiro é o teorema avisando que a hipótese não valia.** Contagem é sempre inteira. É por isso que o caso "sem ordem + com repetição" precisa de estrelas e barras: **não há excesso uniforme pra dividir.**
> **Frase-âncora:** *dividir conta grupos — mas só se todos tiverem o mesmo tamanho.*

---

## 8. A árvore, com o procedimento inteiro

```
① uma escolha ou várias?
   uma  -> SOMA os grupos disjuntos. fim.
   várias -> multiplica, siga.

② quem é k (quantas vezes escolho) e quem é n (quantas cabem em cada)?

③ desce? (física / frase / nenhum)
④ a ordem importa? (teste da troca)

         │ ordem IMPORTA            │ ordem NÃO importa
─────────┼──────────────────────────┼─────────────────────────
não desce│ nᵏ                       │ C(n+k−1, k)  estrelas/barras
desce    │ n × (n−1) × …  (k fatores)│ C(n, k) = arranjo ÷ k!
```

E a permutação (`n!`) é a célula "desce + importa" com `k = n` — o estoque indo até zerar. **Não é uma sexta fórmula.**

---

## 9. Mapa de sinais

| Na frase | Ferramenta |
|---|---|
| "ou então", "um só" (grupos disjuntos) | **soma** |
| "e depois", "uma de cada" | **multiplica** |
| **"cada"** ("N coisas, cada uma com M opções") | `n^k` — **nunca** `N × M` |
| "pode repetir", "`aaa` vale", nada dito sobre rótulo | estoque **cheio** |
| "sem repetir", "sem devolver", "cada um uma vez" | estoque **decrescente** (frase) |
| pessoas, cavalos, quadros, cadeiras | estoque **decrescente** (física) |
| 1º/2º/3º, cargos, medalhas, "em ordem" | ordem importa → **não divida** |
| "um grupo de", "uma comissão", "quais", "os que passam" | ordem não importa → **divida** |
| **"pelo menos"** | **complemento** — reescreva e volte à árvore |
| "os dois", "ambos", "também" | **inclusão-exclusão** — conserte e volte à árvore |
| itens **idênticos** + "quantos cada um leva" | **estrelas e barras** |

> **Complemento e inclusão-exclusão não são casos da árvore** — são **reescritas da pergunta**. "Pelo menos um dígito repetido" vira `10⁴ − (10×9×8×7)`: **dois casos da árvore**, ligados por uma subtração. Rode-os antes; a árvore vem depois. (Detalhe no `-nucleo`.)

---

## 10. Erros clássicos (guarde estes)

1. **`5 × 4` em vez de `4⁵`** — os dois números do enunciado não se multiplicam. *Quantas vezes escolho → expoente; quantas cabem em cada → base.*
2. **`5²` em vez de `2⁵`** — base e expoente invertidos. *A base é o que se repete.*
3. **`9³` no pódio de cavalos** — usou estoque cheio onde a física obriga a descer. *Um cavalo não cruza a linha duas vezes.*
4. **`6 × 5 × 5`** — o estoque desceu uma vez e congelou. *Ele desce a CADA etapa.*
5. **`8 × 7` num dado de 8 faces lançado 2×** — desceu sem motivo. *Dado não tem memória; sem física nem frase, não desce.*
6. **`÷ 3!` onde há cargos** — dividiu onde a posição tem nome. *Divide-se só quando a troca não muda nada.*
7. **`4 + 3 − 1` sem sobreposição** — inclusão-exclusão fantasma. *Sem interseção, a soma crua está certa.*
8. **Off-by-one** — 0 a 9 são **10** dígitos; `n` compartimentos pedem `n−1` barras. *Contou os vãos em vez dos postes.*
9. **Confundir ordem do processo com ordem do resultado** — a Mega-Sena sorteia em sequência e premia um conjunto.
10. **Dividir com grupos de tamanhos diferentes** — `125 ÷ 3!`. *Se der não-inteiro, a hipótese não valia.*

---

## 11. Resumo

- **A fórmula nunca foi o problema.** Mesmos `8 × 7 × 6` dão 336 (pódio) ou 56 (comitê). A diferença é **modelagem**.
- **Quatro perguntas, nesta ordem:** ① uma escolha ou várias? ② quem é `n`, quem é `k`? ③ desce? ④ a ordem importa?
- **② tem um gatilho: a palavra "cada".** "N coisas, cada uma com M opções" é `M^N`, nunca `N × M`.
- **③ tem dois motivos, e só dois:** desce por **física** (o objeto é único) ou por **frase** (o texto proibiu). Sem um deles, **não desce**. *Objeto se retira; rótulo se carimba.*
- **④ tem um teste:** troque dois elementos. Outra coisa → importa. A mesma coisa → divida. *Importa não é como saiu — é se o lugar tem nome.*
- **O `÷ k!` é um teorema com hipótese:** a regra da divisão conta grupos, e exige que **todos tenham o mesmo tamanho**. O divisor é o **tamanho** (`k!`); a resposta é a **quantidade**.
- **É o seu `groupBy`:** a equivalência "tem os mesmos elementos" particiona as sequências em classes. A combinação é `groupBy(...).size`.
- Quando a hipótese quebra (tamanhos 6, 3, 1), a divisão morre e entra **estrelas e barras**. O **não-inteiro** é o aviso.

---

## 12. Como isso conecta com o resto

- **`-nucleo`** é o gêmeo: lá está o *mecanismo* (por que `n!` é o estoque caindo); aqui está a *decisão* (quando usar cada um).
- **Relações**: a regra da divisão é **equivalência → partição → classes**. O `÷ k!` é `groupBy` com todos os baldes do mesmo tamanho.
- **Conjuntos**: "repete?" é a Regra 1; "a ordem importa?" é a Regra 2 (conjunto) vs o par ordenado (produto cartesiano). "Sequência ou conjunto?" é literalmente a pergunta.
- **Lógica**: "e depois" é `∧`; "ou então" é `∨`; "pelo menos" é a negação de "nenhum" (De Morgan).
- **Testes** (skill 05): o hábito de **enumerar quando o número é pequeno** é o mesmo do oráculo de força bruta — a lista de 8 linhas `VVV…FFF` desmente sua fórmula sem discussão.

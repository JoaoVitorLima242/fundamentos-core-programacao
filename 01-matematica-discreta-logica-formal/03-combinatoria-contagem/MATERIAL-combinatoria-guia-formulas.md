# Combinatória — guia rápido das 8 fórmulas

Material de referência. Uma página por fórmula: **o que conta**, **como montar**, **um exercício resolvido** e **quando usar**. No fim, a tabela que separa cada par que costuma confundir. Complementa o `-nucleo` (o mecanismo) e o `-decisao` (o procedimento); este é o cartão de consulta.

> Regra de ouro que atravessa tudo: **decorar as 8 fórmulas não adianta** — você aplica a certa no problema errado. Decore **as perguntas** (última seção). A fórmula é o que sai no fim.

---

## A — `nᵏ` — arranjo com repetição

**O que conta.** `k` ações, cada uma escolhe entre `n` opções, e a opção **volta pro estoque** (pode repetir).

**Como montar.** Um fator por ação, cada fator é o cardápio: `n × n × … × n` (`k` vezes) = `nᵏ`.

**Exercício.** Placa com 3 letras (26 opções), pode repetir.
> 3 posições, 26 opções cada, `aaa` é válida → `26 × 26 × 26 = 26³ = 17.576`.

**Quando usar.** O item escolhido **não some** — dígito, letra, face de dado, cara/coroa. Sinal: **"cada uma com"** ("5 perguntas, cada uma com 3 opções" → `3⁵`). *A base é o cardápio; o expoente é quantas vezes você age. Quando duvidar, escreva a multiplicação estendida — ela não deixa inverter base e expoente.*

---

## B — `n × (n−1) × …` (`k` fatores) — arranjo

**O que conta.** Escolher `k` de `n`, **a ordem importa**, **sem repetir**.

**Como montar.** Comece em `n`, desça de 1 em 1, pare com `k` fatores. (O estoque desce porque o usado saiu.)

**Exercício.** De 8 corredores, o pódio (ouro, prata, bronze).
> `8 × 7 × 6 = 336`. Trocar ouro e prata dá outro pódio — posição com nome.

**Quando usar.** Há **posições com nome** (cargos, medalhas, 1º/2º/3º) **e** não repete. Também: **número, senha, placa, PIN** são *sempre* ordenados — a posição de cada símbolo muda o valor.

---

## C — `n!` — permutação

**O que conta.** Ordenar **todos** os `n` elementos.

**Como montar.** `n × (n−1) × … × 2 × 1`. É o arranjo com `k = n` (o estoque desce até zerar). Convenção: `0! = 1`.

**Exercício.** 5 migrations, roda todas em sequência.
> `5! = 120`.

**Quando usar.** "Arrume/ordene **todos**", "de quantas ordens". Se sobrou gente de fora (`k < n`), é arranjo (B), não permutação.

---

## D — `C(n,k) = arranjo ÷ k!` — combinação

**O que conta.** Escolher `k` de `n`, **sem ordem**, **sem repetir**.

**Como montar.** O arranjo (B), dividido por `k!` — cada grupo foi contado `k!` vezes (as ordens internas dos escolhidos). **`k` fatores em cima, `k!` embaixo — o mesmo `k`.**

**Exercício.** De 8 devs, um comitê de 3.
> `(8 × 7 × 6) ÷ 3! = 336 ÷ 6 = 56`. Trocar dois no comitê dá o mesmo comitê.

**Quando usar.** "Um grupo de", "uma comissão", "quais" — sem papéis. *Atalho: `C(n,k) = C(n, n−k)`; se `k` passar da metade, conte o complemento.*

---

## E — `C(n+k−1, k)` — estrelas e barras

**O que conta.** Distribuir `k` itens **idênticos** entre `slots` destinos distintos, **sem ordem, com repetição**.

**Como montar.**
```
estrelas (k) = quantos ITENS distribuo   (o que se reparte)
cortes       = slots − 1                  (divisórias)
n            = estrelas + cortes
resposta     = C(n, k)
```

**Exercício.** 3 pães, padaria de 5 tipos (pode repetir).
> estrelas 3, cortes `5−1=4`, n `3+4=7` → `C(7,3) = 35`.

**Quando usar.** Itens **idênticos** + "quantos cada um leva" + mesma sacola. Disfarces: equação `x+y+z=n` (inteiros ≥ 0), "comprar X de Y tipos". *Estrela é o que você leva (o que sai na sacola); slot é a prateleira de onde veio. O `n` nasce da soma — nunca vem do enunciado.*

---

## F — soma — princípio aditivo

**O que conta.** Uma escolha entre grupos que **não se sobrepõem**.

**Como montar.** `|A| + |B| + …`.

**Exercício.** Comer um prato: 4 quentes ou 3 frios.
> `4 + 3 = 7`. Nenhum prato é quente e frio.

**Quando usar.** **"Um só"**, "ou então", grupos disjuntos. *Sem sobreposição, a soma crua já está certa — nada de `−1` fantasma.*

---

## G — `U − Ā` — complemento

**O que conta.** Casos que satisfazem "**pelo menos**" — contando o **contrário** e subtraindo.

**Como montar.** `U` (total sem restrição) menos `Ā` (o contrário da condição).

**Exercício.** PIN de 4 dígitos com **pelo menos** um repetido.
> `U = 10⁴ = 10.000`. `Ā` = todos diferentes = `10 × 9 × 8 × 7 = 5.040`. Resposta: `10.000 − 5.040 = 4.960`.

**Quando usar.** A palavra **"pelo menos"**. O contrário ("nenhum", "todos distintos") é sempre o lado fácil de contar — força cada posição a um único valor. *Leu "pelo menos" → `U − Ā`.*

---

## H — `|A| + |B| − |A∩B|` — inclusão-exclusão

**O que conta.** Quantos estão em **A ou B** quando os grupos **se sobrepõem**.

**Como montar.** Soma os dois, subtrai a interseção **uma vez** (quem estava nos dois foi contado 2×).

**Exercício.** Turma de 40 — 18 sabem TS, 15 Python, 7 os dois. Quantos sabem algo?
> `18 + 15 − 7 = 26`.

**Quando usar.** **"Os dois", "ambos"** — sobreposição. *Quem foi contado 2×, tira 1×.* Virada do avesso: se você tem `|A∪B|` e quer a interseção, isola `|A∩B|`. Teste de sanidade: as regiões (só A, os dois, só B, nenhum) somam o total.

---

## A dica final — o que separa cada par

A confusão nunca é entre as 8 de uma vez. É sempre entre **duas vizinhas**. A pergunta única que separa cada par:

| Confundo… | Pergunta que decide | Sim → | Não → |
|---|---|---|---|
| **A vs B** (`nᵏ` vs arranjo) | o item pode **repetir**? | A | B |
| **B vs D** (arranjo vs combinação) | trocar dois muda o resultado? (**tem posição?**) | B | D |
| **B vs C** (arranjo vs permutação) | uso **todos** os elementos? | C | B |
| **D vs E** (combinação vs estrelas-barras) | pode **repetir** item? | E | D |
| **F vs H** (soma vs incl-exclusão) | os grupos **se sobrepõem**? | H | F |
| **direto vs G** (contar vs complemento) | tem a palavra **"pelo menos"**? | G | direto |

## O procedimento que gera tudo

Rode nesta ordem:

1. **"pelo menos"?** → G (complemento). Reescreve e volta ao passo 3.
2. **grupos se sobrepõem?** → H (inclusão-exclusão).
3. **uma escolha ou várias?** → F (soma) ou segue.
4. **repete?** (o item some — por física ou por frase?)
5. **a ordem importa?** (troca dois — muda?)

As perguntas 4 e 5 cruzadas dão as quatro células centrais:

| | ordem importa | ordem não importa |
|---|---|---|
| **repete** | A — `nᵏ` | E — estrelas e barras |
| **não repete** | B — arranjo (C = `n!` se usa todos) | D — combinação |

E as frases-âncora que cobrem os erros mais comuns:

- *A base é o cardápio; o expoente é quantas vezes.* (não inverter `nᵏ`)
- *"Sem repetir" diz que desce, não diz que é combinação.* (número/senha são sempre B)
- *Divide-se só quando a troca não muda nada.* (não dividir onde há cargo)
- *Estrela é o que você leva; slot é onde cai.* (não trocar os papéis em E)
- *Leu "pelo menos" → complemento.*
- *Quem foi contado 2×, tira 1×.* (inclusão-exclusão)

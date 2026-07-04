# Lógica booleana e proposicional

Material de estudo. Cada conceito vem com exemplo em JavaScript pra você rodar e testar. A ideia não é decorar — é entender por que a mesma lógica pode ser escrita de várias formas, e saber transformar uma na outra. **É isso que separa quem acerta condicional por sorte de quem acerta por saber.**

---

## 1. O que é uma proposição

Uma **proposição** é qualquer afirmação que é verdadeira ou falsa — nunca as duas. "O usuário é premium" é uma proposição. "3 + 2" não é (não dá pra dizer se é verdadeira).

No código, proposição é qualquer expressão que resulta em `true` ou `false`:

```js
const ehPremium = usuario.plano === "premium";  // proposição: true ou false
const temSaldo = saldo > 0;                       // proposição
```

Lógica booleana é sobre **combinar** essas proposições e raciocinar sobre o resultado.

---

## 2. Os operadores

Três operadores formam a base. Todo o resto se constrói com eles.

### NÃO (`!`) — negação
Inverte o valor.

```js
!true   // false
!false  // true
```

### E (`&&`) — conjunção
Verdadeiro **só quando os dois** são verdadeiros.

```js
true  && true   // true
true  && false  // false
```

### OU (`||`) — disjunção
Verdadeiro quando **pelo menos um** é verdadeiro.

```js
true  || false  // true
false || false  // false
```

> **Cuidado com o OU:** na linguagem natural, "ou" muitas vezes é exclusivo ("café **ou** chá" = um ou outro). Na lógica, `||` é **inclusivo**: verdadeiro até se os dois forem verdadeiros. O "ou exclusivo" (um OU outro, mas não os dois) é outro operador — o XOR — que em JS se escreve `a !== b` pra booleanos.

---

## 3. Tabela-verdade — a ferramenta que resolve qualquer dúvida

Uma tabela-verdade lista **todas as combinações** de entrada e o resultado de cada uma. Quando você não tem certeza se uma expressão está certa, você não discute — enumera.

Para `a && b`:

| a | b | a && b |
|---|---|--------|
| V | V | V |
| V | F | F |
| F | V | F |
| F | F | F |

Com **N** variáveis, a tabela tem **2^N** linhas. 2 variáveis = 4 linhas. 3 = 8. 7 = 128. É por isso que, com muitas variáveis, **é impossível conferir de cabeça** — e achar que dá é a fonte de bugs.

Você pode gerar qualquer tabela-verdade em JS:

```js
function tabelaVerdade(fn, nomes) {
  const n = nomes.length;
  for (let i = 0; i < (1 << n); i++) {
    const vals = nomes.map((_, b) => Boolean(i & (1 << b)));
    console.log(vals.map(v => v ? "V" : "F").join(" "), "=>", fn(...vals));
  }
}

// Testa a && (b || c)
tabelaVerdade((a, b, c) => a && (b || c), ["a", "b", "c"]);
```

Rode isso: você vê as 8 linhas e o resultado de cada. **Essa função é sua melhor amiga** pra provar que duas expressões são iguais — gere a tabela das duas e compare.

---

## 4. Equivalências — o coração do tópico

Duas expressões são **equivalentes** quando dão o mesmo resultado em **todas** as linhas da tabela-verdade. Saber trocar uma pela outra é a habilidade central.

### De Morgan (a mais importante)

**Negar um grupo inverte o operador.**

```js
!(a && b)  ===  !a || !b   // o E virou OU
!(a || b)  ===  !a && !b   // o OU virou E
```

Por que importa: toda regra escrita na forma **negativa** ("não libera a menos que...", "bloqueia se não...") esconde um De Morgan. Traduzir errado é o bug nº 1 em condicional.

```js
// Regra: "bloqueia se NÃO tiver testes E NÃO for hotfix"
// bloqueia = !testes && !hotfix
// Então LIBERA = !(!testes && !hotfix) = testes || hotfix   (De Morgan)
function podeIr(testes, hotfix) {
  return testes || hotfix;
}
```

O erro clássico: achar que `!(a && b)` é `!a && !b`. **É falso.** Prove você mesmo gerando as duas tabelas — elas diferem.

### Dupla negação

```js
!!a === a   // negar duas vezes volta ao original
```

Útil pra simplificar: se você vê `!(!premium)`, é só `premium`.

### Implicação — e a pegadinha da recíproca

"Se A então B" (implicação) em código é:

```js
// "se é premium, então tem acesso"
// A -> B  é equivalente a  !A || B
const implica = !ehPremium || temAcesso;
```

**A pegadinha mais perigosa da lógica:** "A implica B" **NÃO** é o mesmo que "B implica A".

```js
// "se é premium -> tem acesso"  NÃO quer dizer
// "se tem acesso -> é premium"
```

Alguém pode ter acesso por outro motivo (é admin, ganhou trial). Confundir a implicação com a recíproca é um erro de **raciocínio**, não de sintaxe — e é o que faz a pessoa ler uma regra como se fosse mão dupla. (Testei isso em código: as duas divergem no caso `A=false, B=true`.)

### Outras equivalências úteis (pra simplificar código)

```js
// Absorção — a condição interna é redundante
a || (a && b)  ===  a
a && (a || b)  ===  a

// Distributiva — fatorar o comum
(a && b) || (a && c)  ===  a && (b || c)
```

A distributiva é ouro pra limpar condicional: se você vê `a` repetido, fatore.

---

## 5. Um detalhe de JS: curto-circuito

`&&` e `||` param de avaliar assim que sabem o resultado — isso se chama **curto-circuito**:

```js
// Se 'usuario' for null, 'usuario.ativo' daria erro.
// Mas o && para no primeiro false e nem avalia o segundo:
if (usuario && usuario.ativo) { /* seguro */ }

// O || para no primeiro true — útil pra valor padrão:
const nome = nomeInformado || "Anônimo";
```

Isso é lógica booleana com um efeito prático: a **ordem** dos operandos importa pra segurança do código, não só pro resultado.

---

## 6. Erros clássicos (guarde estes)

1. **Distribuir a negação sem trocar o operador** — `!(a && b)` NÃO é `!a && !b`. É De Morgan: vira `!a || !b`.
2. **Ler implicação como mão dupla** — "A → B" não é "B → A".
3. **Confundir OU inclusivo com exclusivo** — `||` é verdadeiro até quando os dois são.
4. **Achar que dá pra conferir de cabeça** — com 4+ variáveis, monte a tabela.

---

## 7. Pra se aprofundar (exercícios)

1. **Prove De Morgan você mesmo.** Escreva `tabelaVerdade` (seção 3) e gere a tabela de `!(a && b)` e de `!a || !b`. Confirme que batem linha a linha. Depois faça o mesmo com `!a && !b` e veja que NÃO bate.

2. **Simplifique.** Reescreva cada uma na forma mais simples e prove por tabela-verdade que é equivalente:
   ```js
   !(!a || !b)
   a && (a || b)
   (a && b) || (a && !b)
   !(a && b) || (a && b)
   ```

3. **Traduza da linguagem natural.** Vire cada regra em expressão booleana:
   - "Só entra quem é maior de idade e tem convite, exceto se for VIP."
   - "Bloqueia todo mundo que não confirmou o e-mail, a menos que seja conta de teste."

4. **Ache o bug.** Este condicional deveria liberar acesso pra quem é admin OU (premium E com conta ativa). Está errado — conserte e prove com tabela:
   ```js
   function temAcesso(admin, premium, ativa) {
     return admin || premium && !ativa;
   }
   ```

> Gabarito do exercício 4: o certo é `admin || (premium && ativa)` — o original nega `ativa` e não parenteseia a intenção. Monte a tabela das duas versões pra ver onde divergem.

---

## Resumo

- Proposição = algo verdadeiro ou falso. Operadores `!`, `&&`, `||` combinam proposições.
- Tabela-verdade enumera todos os casos — é como você **prova** que algo está certo.
- Equivalências deixam você reescrever a mesma lógica de formas diferentes. As que mais importam: **De Morgan**, **implicação como `!a || b`**, e **implicação ≠ recíproca**.
- Quando a lógica ficar confusa, não chute: **enumere**.

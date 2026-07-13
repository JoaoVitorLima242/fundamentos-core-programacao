# Funções

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em código, lado a lado. "Função" parece um assunto de escola ("f de x"), mas é o modelo exato do que você faz o dia todo: **transformar uma entrada numa saída de forma previsível** — `map`, hash, roteamento de URL, `id → registro`, serializar/desserializar. **Quando você enxerga que injetora, sobrejetora e inversa são propriedades de comportamento, para de decorar casos e passa a saber, de antemão, quando uma transformação pode ser desfeita, quando ela perde informação e quando ela pode colidir.**

> Este documento cobre: o que é uma função (relação com uma restrição), domínio/contradomínio/imagem, as três propriedades (injetora, sobrejetora, bijetora), composição e função inversa. Apoia-se diretamente em **relações** — leia aquele material antes deste.

---

## 1. O que é uma função

Uma função é uma **relação com uma regra a mais**: cada entrada se relaciona com **exatamente uma** saída. Nada de "a Ana mora em SP *e* no RJ" — uma entrada, uma saída, sem ambiguidade.

$$\text{quadrado} = \{(1,1),\ (2,4),\ (3,9)\}$$

Cada número da esquerda aparece **uma única vez** e leva a **um** resultado. É isso que separa função de relação qualquer. Em código, é o modelo de qualquer transformação determinística:

```js
const quadrado = (x) => x * x;
quadrado(3); // 9  -> sempre 9, nunca outra coisa
```

A palavra-chave é **determinístico**: mesma entrada, sempre a mesma saída. `Math.random()` **não é uma função** nesse sentido matemático — a mesma entrada (nenhuma) devolve valores diferentes. `x => x * x` é.

Notação:

$$f: A \to B \qquad f(a) = b$$

Lê-se "$f$ leva de $A$ para $B$" e "$f$ aplicada a $a$ dá $b$". O `f(a)` que você digita todo dia é exatamente essa notação.

---

## 2. Função = relação com a "regra do menu"

Formalmente, uma função é uma relação $f \subseteq A \times B$ que obedece a uma restrição:

$$\text{para todo } a \in A,\ \text{existe } \textbf{exatamente um}\ b \in B \text{ com } (a,b) \in f$$

Pense num **cardápio**: cada prato tem **um** preço. Pode dois pratos custarem o mesmo (tudo bem), mas **um prato não pode ter dois preços**. Traduzindo a relação numa tabela, a regra é sobre a coluna da **esquerda**:

| entrada | saída | é função? |
|---|---|---|
| `1 → a`, `2 → b`, `3 → c` | cada entrada uma vez | ✅ sim |
| `1 → a`, `1 → b` | `1` aparece com **duas** saídas | ❌ não (é relação, não função) |
| `1 → a`, `2 → a` | duas entradas, **mesma** saída | ✅ sim (permitido!) |

O teste em código: uma relação (lista de pares) é função se **nenhuma entrada se repete com saídas diferentes**.

```js
const ehFuncao = (pares) => {
  const visto = new Map();
  for (const [a, b] of pares) {
    if (visto.has(a) && visto.get(a) !== b) return false; // mesma entrada, saída diferente
    visto.set(a, b);
  }
  return true;
};

ehFuncao([[1, "a"], [2, "b"]]);         // true
ehFuncao([[1, "a"], [1, "b"]]);         // false -> 1 tem duas saídas
ehFuncao([[1, "a"], [2, "a"]]);         // true  -> saída repetida é OK
```

> **Cuidado — a restrição é só na entrada.** Saídas podem repetir à vontade (duas entradas caindo na mesma saída). O que **não pode** é uma entrada apontar pra duas saídas. Confundir os dois lados é o erro clássico — e é justamente o que separa "injetora" de "sobrejetora" mais à frente.

---

## 3. Domínio, contradomínio e imagem

Três conjuntos descrevem uma função. A diferença entre os dois últimos é onde mora metade da confusão do tema.

- **Domínio** ($A$) — de onde as entradas podem vir. O "tipo de entrada".
- **Contradomínio** ($B$) — onde as saídas **podem** cair. O "tipo de saída" prometido.
- **Imagem** — os valores que a função **de fato** produz. Subconjunto do contradomínio: $\text{Im}(f) \subseteq B$.

O contradomínio é a **promessa**; a imagem é a **entrega**.

```js
const sinal = (x) => x < 0 ? -1 : x > 0 ? 1 : 0;
//  domínio:       todos os números  (o que aceita)
//  contradomínio: todos os números  (o "tipo" da saída, ex. TS: number)
//  imagem:        { -1, 0, 1 }       (o que realmente sai)
```

Em tipos, você declara **domínio** e **contradomínio** (`(x: number) => number`); a **imagem** é um fato sobre o comportamento, mais estreito que o tipo. `sinal` promete `number`, mas só entrega três valores. Essa folga entre "o que o tipo permite" e "o que a função gera" é onde bugs se escondem — e é exatamente o que "sobrejetora" mede.

$$\text{Im}(f) = \{\, f(a) : a \in A \,\} \subseteq B$$

Em código, a imagem é o conjunto (Regra 1 dos conjuntos: sem repetição) das saídas sobre todo o domínio:

```js
const dominio = [-2, -1, 0, 1, 2];
const imagem = new Set(dominio.map(sinal)); // Set { -1, 0, 1 }
```

---

## 4. As três propriedades

Toda a riqueza do tema vem de duas perguntas sobre como entradas e saídas se emparelham. O jeito de testar é o de sempre: **procure um contra-exemplo.**

| Propriedade | Definição | Pergunta | Frase-âncora |
|---|---|---|---|
| Injetora (1-a-1) | $f(a_1)=f(a_2) \Rightarrow a_1=a_2$ | saídas nunca colidem? | "cada saída vem de no máximo uma entrada" |
| Sobrejetora (sobre) | $\text{Im}(f) = B$ | toda a saída prometida é atingida? | "não sobra ninguém no contradomínio" |
| Bijetora | injetora **e** sobrejetora | emparelhamento perfeito? | "cada saída vem de exatamente uma entrada" |

### Injetora — sem colisões

Entradas diferentes dão saídas diferentes. **Nada colide.** É a propriedade que garante que você consegue "voltar": se toda saída é única, dá pra saber de qual entrada ela veio.

```js
const injetora = (dom, f) =>
  new Set(dom.map(f)).size === dom.length; // nº de saídas distintas == nº de entradas

injetora([1, 2, 3], (x) => x * 2);      // true  -> 2,4,6 (dobrar não colide)
injetora([-2, -1, 1, 2], (x) => x * x); // false -> (-2)²=(2)²=4  COLISÃO
```

`x * x` não é injetora: `-2` e `2` batem em `4`. É por isso que, dado só o resultado `4`, você **não** sabe se a entrada era `2` ou `-2` — a informação do sinal se perdeu. **Hash e "lossy" são não-injetoras de propósito.**

### Sobrejetora — sem sobras

A imagem cobre **todo** o contradomínio: cada valor prometido é produzido por *alguma* entrada. "Não sobra ninguém do lado direito."

```js
const sobrejetora = (dom, contradom, f) => {
  const imagem = new Set(dom.map(f));
  return contradom.every((b) => imagem.has(b)); // todo b prometido é atingido?
};

const dom = [1, 2, 3, 4];
sobrejetora(dom, [0, 1], (x) => x % 2);       // true  -> 0 e 1 ambos saem
sobrejetora(dom, [0, 1, 2], (x) => x % 2);    // false -> 2 nunca é produzido
```

### Bijetora — o emparelhamento perfeito

Injetora **e** sobrejetora ao mesmo tempo: cada entrada tem sua saída exclusiva **e** nenhuma saída fica de fora. Domínio e contradomínio ficam **perfeitamente pareados**, um-a-um, sem sobra dos dois lados.

```js
// f(x) = x + 1  sobre os inteiros: bijetora
//  injetora:    x+1 nunca colide
//  sobrejetora: todo inteiro é "alguém + 1"
```

> **Cuidado — as três propriedades dependem do domínio e do contradomínio, não só da "fórmula".** `x * x` **é** injetora se o domínio for só os não-negativos (aí `-2` nem existe). A mesma expressão vira bijetora, injetora-só ou nenhuma dependendo dos conjuntos que você escolhe. Propriedade é da função **inteira** (fórmula + domínio + contradomínio), não da fórmula solta.

---

## 5. Composição — encaixar funções

Compor é **encadear**: a saída de uma vira a entrada da outra. É o cano de dados de todo pipeline.

$$(g \circ f)(x) = g(f(x))$$

Lê-se "$g$ após $f$": aplica $f$ **primeiro**, depois $g$ no resultado. Para encaixar, o contradomínio de $f$ precisa caber no domínio de $g$ (os canos têm que ter o mesmo diâmetro).

```js
const dobro = (x) => x * 2;
const maisUm = (x) => x + 1;

const g_apos_f = (x) => maisUm(dobro(x)); // dobra, DEPOIS soma 1
g_apos_f(3); // 7  =  (3*2)+1

// composição genérica (direita p/ esquerda, como na matemática):
const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
const h = compose(maisUm, dobro);  // maisUm ∘ dobro
h(3); // 7
```

> **Cuidado — a ordem importa: $g \circ f \neq f \circ g$.** `dobrar-depois-somar` (7) é diferente de `somar-depois-dobrar` (`(3+1)*2 = 8`). Composição **não é comutativa**. Ler da direita pra esquerda (`g ∘ f` = "f primeiro") é a convenção matemática; muitos `pipe()` de libs invertem pra ler da esquerda pra direita — saiba qual você está usando.

Um fato que se herda: compor duas injetoras dá injetora; compor duas sobrejetoras dá sobrejetora; logo **compor duas bijetoras dá bijetora**. Pipelines reversíveis continuam reversíveis.

---

## 6. Função inversa — desfazer

A inversa $f^{-1}$ **desfaz** o que $f$ fez: se $f$ leva $a$ em $b$, a inversa leva $b$ de volta em $a$.

$$f(a) = b \iff f^{-1}(b) = a \qquad\qquad f^{-1}(f(x)) = x$$

**Só funções bijetoras têm inversa** — e esse é o resultado central do tema:

- **Não injetora** → há colisão → dado o resultado, você não sabe de qual entrada veio → **não dá pra voltar**. (`x*x`: o `4` veio de `2` ou `-2`?)
- **Não sobrejetora** → há saídas que ninguém produz → a inversa não teria o que devolver pra elas → indefinida.

Precisa dos dois: injetora **para não haver ambiguidade** na volta, sobrejetora **para a volta estar sempre definida**.

```js
// bijeção: constrói o "de-para" e o inverte
const codificar = { a: "01", b: "10", c: "11" };
const decodificar = Object.fromEntries(
  Object.entries(codificar).map(([k, v]) => [v, k]) // inverte os pares
);
decodificar[codificar["b"]]; // "b"  ->  f⁻¹(f(x)) === x
```

Inverter é literalmente **trocar os pares $(a,b)$ por $(b,a)$** — a mesma operação de simetria que você viu em relações. A inversão só produz uma função de novo (uma entrada → uma saída) **se a original for bijetora**; senão os pares invertidos teriam entradas repetidas com saídas diferentes, e aí não é função (volte ao teste da seção 2).

> **Cuidado — "tem inversa" é uma promessa forte.** `JSON.parse` inverte `JSON.stringify` **só no domínio certo**: `stringify` não é injetora sobre todos os valores JS (`undefined`, funções, `NaN` viram `null`/somem → colisão → perda), então `parse(stringify(x))` nem sempre devolve `x`. Toda vez que você espera "desserializar desfaz serializar", está apostando numa bijeção. Se ela não vale, há perda de dados — e o bug aparece longe da causa.

---

## 7. Por que isso importa no seu dia a dia como dev

| Conceito de função | No código, isso é… |
|---|---|
| Função (determinística) | função **pura**: mesma entrada → mesma saída, sem efeito colateral |
| Domínio → contradomínio | a **assinatura de tipo** `(x: A) => B` |
| Imagem ⊊ contradomínio | a folga entre "o tipo permite" e "o valor realmente ocorre" (onde bugs moram) |
| Injetora | **sem colisão** — `id → registro`, chave única, `slug` reversível |
| Não injetora **de propósito** | **hash**, compressão com perda, mascarar/anonimizar (não dá pra voltar) |
| Sobrejetora | **exaustividade** — todo case do enum é produzido/tratado (nada "morto") |
| Bijetora | **de-para reversível** — encode/decode, mapa e seu inverso |
| Composição | **pipeline** — `pipe`/`compose`, middleware, transducers |
| Inversa | **desfazer** — `parse` ∘ `stringify`, `decode` ∘ `encode`, migração pra frente/pra trás |

O fio condutor: **toda transformação que você escreve é uma função com propriedades — e as propriedades decidem o que ela pode prometer.** Dá pra desfazer? Só se for injetora. A volta está sempre definida? Só se for sobrejetora. Encaixa nesse pipeline? Só se os tipos (domínio/contradomínio) baterem. Você não precisa testar caso a caso: reconhece a propriedade e já sabe a consequência. `map` aplica uma função a cada elemento; um hash é injetora quebrada de propósito; `JSON.parse/stringify` é uma bijeção que só vale num domínio restrito. A teoria não era sobre "f de x" — era sobre quando uma transformação pode ser confiada.

## 8. Como isso conecta com o resto

- **Relações** (tema anterior) é o gênero; **função é a espécie**: relação + "uma entrada, uma saída". Toda função é relação; nem toda relação é função.
- **Inverter** uma função é trocar os pares $(a,b)$ por $(b,a)$ — a mesma **simetria** das relações; e a inversa só existe (é função) quando a original é bijetora.
- **Conjuntos** reaparecem: domínio, contradomínio e imagem são conjuntos; a imagem se calcula com `Set` (sem repetição); injetividade é "as saídas formam um conjunto do mesmo tamanho do domínio".
- **Produto cartesiano**: função continua sendo subconjunto de $A \times B$ — só que com a restrição da coluna da esquerda.
- **Lógica** (aula 01): as propriedades se escrevem com "para todo" e implicação (`f(a₁)=f(a₂) ⇒ a₁=a₂` é o `!A || B` de novo).
- **Próximo tema — combinatória**: contar **quantas** funções, injeções e bijeções existem entre dois conjuntos é a ponte natural pra contagem (e explica de onde vêm $n^k$, permutações e $n!$).

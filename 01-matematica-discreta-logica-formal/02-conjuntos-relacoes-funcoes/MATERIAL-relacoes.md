# Relações

Material de estudo. Cada conceito da matemática vem com o mesmo conceito em código, lado a lado. Uma relação parece abstrata ("subconjunto de pares"), mas é o que está por baixo de **tabela de banco de dados, "seguir" numa rede social, `GROUP BY` e `sort`**. **Quando você entende que agrupar e ordenar são relações com propriedades específicas, para de aprender cada operação do zero e passa a reconhecer o mesmo padrão em toda parte.**

> Este documento cobre: o que é uma relação, relação sobre um conjunto, as cinco propriedades (reflexiva, irreflexiva, simétrica, antissimétrica, transitiva) e as duas estruturas que elas formam (equivalência e ordem parcial). Apoia-se diretamente no produto cartesiano.

---

## 1. O que é uma relação

Uma relação é uma **regra que diz quais coisas estão conectadas com quais**. "Mora em" conecta pessoas a cidades; "é menor que" conecta números a números. Você anota cada conexão como um **par ordenado**, e a coleção dos pares que são **verdade** é a relação.

$$\text{moraEm} = \{(\text{Ana}, \text{SP}),\ (\text{Bia}, \text{RJ})\}$$

Isso diz, em uma linha: "Ana mora em SP e Bia mora no RJ". Em código, é uma lista de pares:

```js
const moraEm = [
  ["Ana", "SP"],
  ["Bia", "RJ"],
];
```

É a **mesma coisa que uma tabela de banco**: cada linha é um par, a tabela inteira é a relação. (Não é coincidência que bancos SQL sejam "relacionais" — Edgar Codd fundou o modelo relacional, em 1970, sobre relações no sentido matemático.)

| pessoa | cidade |
|--------|--------|
| Ana    | SP     |
| Bia    | RJ     |

A única pergunta que se faz a uma relação é: **"esse par está na lista?"**

```js
const relaciona = (R, a, b) => R.some(([x, y]) => x === a && y === b);

relaciona(moraEm, "Ana", "SP"); // true  -> o par está lá
relaciona(moraEm, "Ana", "RJ"); // false -> não está
```

Aquele `x === a && y === b` é o coração: os **dois** elementos têm que casar na **mesma linha**. Não basta a pessoa aparecer *ou* a cidade aparecer — tem que ser o par exato. Perguntar "o par está na relação?" é **pertinência** (`∈`), a mesma pergunta de sempre, agora aplicada a pares.

Notação equivalente (três formas de dizer o mesmo):

$$(a, b) \in R \quad\Longleftrightarrow\quad aRb \quad\Longleftrightarrow\quad \text{"}a\text{ se relaciona com }b\text{"}$$

Você já usa isso sem perceber: em `3 < 5`, o `<` é uma relação e `3 < 5` é a notação `aRb`. O par `(3,5)` está na relação "<"; `(5,3)` não. **Operadores de comparação são relações.**

---

## 2. Relação = subconjunto do produto cartesiano

Formalmente:

$$R \subseteq A \times B$$

O **produto cartesiano** `A × B` é a lista de **todas as combinações possíveis**. A **relação** é o recorte das que são **verdade**. Com Pessoas = {Ana, Bia} e Cidades = {SP, RJ}:

| pessoa | cidade | está na relação "mora em"? |
|--------|--------|------|
| Ana | SP | ✅ sim |
| Ana | RJ | ❌ não |
| Bia | RJ | ✅ sim |
| Bia | SP | ❌ não |

Os 4 pares são o produto cartesiano (o **possível**); os 2 marcados são a relação (o **verdadeiro**). Por isso "relação é subconjunto do produto cartesiano": todo par da relação obrigatoriamente é uma das combinações que já existiam no produto. O produto cartesiano é a planilha com todas as linhas; a relação é o marca-texto nas que valem.

---

## 3. Relação sobre um único conjunto

O caso mais rico é quando a relação conecta um conjunto **com ele mesmo** (`R ⊆ A × A`): descreve como os elementos se relacionam **entre si**.

- "$x < y$" sobre números
- "$x$ é amigo de $y$" sobre pessoas (base de um grafo social)
- "$x$ segue $y$" numa rede social
- "página $x$ tem link para $y$" na web

É aqui que a relação ganha **propriedades** — características de comportamento que determinam o que ela é capaz de fazer.

---

## 4. As cinco propriedades

O jeito de testar qualquer uma é sempre o mesmo: **procure um contra-exemplo.** Um único caso que quebra a regra derruba a propriedade; se não há contra-exemplo possível, ela vale.

| Propriedade | Definição | Pergunta |
|---|---|---|
| Reflexiva | $(a,a) \in R$ sempre | todo elemento se relaciona consigo? |
| Irreflexiva | $(a,a) \notin R$ nunca | nenhum se relaciona consigo? |
| Simétrica | $aRb \Rightarrow bRa$ | se vai, volta? |
| Antissimétrica | $aRb$ e $bRa \Rightarrow a=b$ | só volta se for o mesmo? |
| Transitiva | $aRb$ e $bRc \Rightarrow aRc$ | encadeia? |

**Reflexiva** — "$=$" é reflexiva ($3=3$); "$<$" não é.
**Irreflexiva** — "$<$" é irreflexiva (nada é menor que si); "é pai de" também.
**Simétrica** — "é irmão de" é simétrica; "segue" não é (mão única).
**Antissimétrica** — "$\leq$" é: se $a \leq b$ e $b \leq a$, então $a=b$. "Segue" não é (A e B, pessoas diferentes, podem se seguir mutuamente).
**Transitiva** — "$<$" é ($2<5$ e $5<9 \Rightarrow 2<9$); "é pai de" não é (vira avô).

Um verificador em código transforma a definição abstrata em algo que roda:

```js
const reflexiva  = (E, R) => E.every(a => R(a, a));
const simetrica  = (E, R) => E.every(a => E.every(b => !R(a, b) || R(b, a)));
const transitiva = (E, R) => E.every(a => E.every(b => E.every(c =>
  !(R(a, b) && R(b, c)) || R(a, c))));

const nums = [1, 2, 3];
simetrica(nums,  (a, b) => a < b);   // false -> "<" não é simétrica
transitiva(nums, (a, b) => a < b);   // true  -> "<" é transitiva
reflexiva(nums,  (a, b) => a === b); // true  -> "=" é reflexiva
```

O `!R(a,b) || R(b,a)` é a **implicação** ("se vai, volta") escrita em código — o `!A || B` da lógica.

> **Cuidado — antissimétrica não é "não-simétrica".** Simétrica = "sempre volta". Antissimétrica = "só volta se for o mesmo elemento". Uma relação pode não ser nenhuma das duas. O nome engana; vale a definição.

---

## 5. As estruturas: quando as propriedades se juntam

Certas combinações são tão importantes que ganharam nome. A diferença entre as duas grandes está em **uma** propriedade trocada.

### Relação de equivalência = reflexiva + simétrica + transitiva

Funciona como uma **"igualdade relaxada"**: diz que coisas são equivalentes *para um propósito*, sem serem idênticas. Ex.: "tem a mesma idade que", "tem o mesmo CEP", "pertence à mesma categoria".

**A consequência:** toda relação de equivalência **particiona** o conjunto em grupos disjuntos chamados **classes de equivalência**. Com idades 20, 20, 25, 30, 30:

$$\{P_1, P_2\}_{(20)} \qquad \{P_3\}_{(25)} \qquad \{P_4, P_5\}_{(30)}$$

Uma **partição** obedece a duas regras: **nada se sobrepõe** (classes disjuntas) e **nada sobra** (a união é o conjunto todo). Cada elemento cai em exatamente uma classe.

> Relação de equivalência e partição são a **mesma coisa** vista de dois ângulos: toda equivalência gera uma partição, e toda partição define uma equivalência ("estar no mesmo grupo").

Em código, particionar por uma chave de equivalência:

```js
// equivalência: "tem a mesma idade" -> particiona por idade
const pessoas = [{n:"A", idade:20}, {n:"B", idade:20}, {n:"C", idade:30}];
const classes = {};
for (const p of pessoas) (classes[p.idade] ??= []).push(p.n);
// { 20: ["A","B"], 30: ["C"] }  -> as classes de equivalência
```

> **Cuidado:** as três propriedades não são decoração — são o **mínimo** que garante "cada um em um balde só". Sem simetria, a pertinência ao grupo fica ambígua; sem transitividade, o grupo deixa de ser coerente.

### Ordem parcial = reflexiva + antissimétrica + transitiva

Troque simétrica por **antissimétrica** e você sai de "agrupar" e entra em "**ordenar**". Uma ordem parcial organiza elementos numa hierarquia, mas permite **elementos incomparáveis** — pares onde nenhum vem antes do outro.

- "$\leq$" nos números: reflexiva, antissimétrica, transitiva → ordem. E é **total** (quaisquer dois são comparáveis).
- "$\subseteq$" (subconjunto): ordem **parcial**. `{1,2}` e `{2,3}` são **incomparáveis** — nenhum contém o outro. A antissimetria aqui é a própria definição de igualdade de conjuntos (`A ⊆ B` e `B ⊆ A ⇒ A = B`).
- "$A$ depende de $B$" (módulos/pacotes): ordem parcial.

### Parcial vs total

- **Total** = uma **fila** única; todo par é comparável. É o que o `sort` de números faz.
- **Parcial** = uma **árvore/rede**; há "acima" e "abaixo", mas ramos paralelos não se comparam.

Dependências entre tarefas são ordem parcial: "A depende de B" ordena A e B, mas dois módulos independentes são incomparáveis. Achatar essa ordem parcial numa fila executável é a **ordenação topológica** — como `make`, builds e o resolvedor do npm decidem a sequência.

> **Cuidado — "parcial" não é "incompleta/quebrada".** Quer dizer que comparar tudo com tudo não faz parte da definição. É uma estrutura legítima que modela hierarquias com ramos paralelos (dependências, herança, versionamento). Forçar uma fila única onde não existe é erro de modelagem.

---

## 6. Por que isso importa no seu dia a dia como dev

| Conceito de relação | No código, isso é… |
|---|---|
| Relação (lista de pares) | uma **tabela** de banco de dados (cada linha = um par) |
| Simétrica vs não-simétrica | **"amizade"** (uma linha vale pros dois) vs **"seguir"** (precisa de duas linhas p/ ser mútuo) |
| Relação de equivalência | **`GROUP BY`** / agrupar em baldes disjuntos |
| Classes de equivalência = partição | por que agrupar **sempre** gera grupos sem sobra e sem sobreposição |
| Ordem parcial | **resolver dependências** (build, npm), hierarquia, herança |
| Ordem total | **`sort`** — enfileirar do menor ao maior |
| Ordenação topológica | achatar dependências (ordem parcial) numa sequência executável (ordem total) |

O fio condutor: **agrupar e ordenar** — duas das operações que você mais faz — não são truques isolados, são relações com propriedades específicas. `GROUP BY` é uma relação de equivalência produzindo uma partição; `sort` é uma ordem total; resolver build é achatar uma ordem parcial. A teoria não era sobre pessoas e cidades — esse era o andaime. É sobre por que essas operações se comportam como se comportam.

## 7. Como isso conecta com o resto

- **Produto cartesiano** é o alicerce: relação é subconjunto dele.
- **Subconjunto** (`⊆`) reaparece: relação *é* um subconjunto; e "$\subseteq$" é o exemplo canônico de ordem parcial.
- **Lógica** (aula 01) reaparece: testar propriedade usa "para todo" e implicação (`!A || B`).
- **Próximo tema — funções**: uma função é uma relação com uma restrição a mais (cada entrada se relaciona com no máximo uma saída). Relação é o gênero; função é a espécie.

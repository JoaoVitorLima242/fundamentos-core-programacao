# Simulado de revisão: conjuntos, relações e funções

Simulado teórico do tópico inteiro. Cobre os quatro blocos de **conjuntos**
(fundamentos, subconjuntos, operações e leis, produto cartesiano), as
**propriedades das relações** (reflexiva, simétrica, antissimétrica, transitiva)
e as duas **estruturas** (equivalência e ordem parcial), mais as **três
propriedades de função** (injetora, sobrejetora, bijetora).

## Como usar

Responda cada questão **antes** de olhar o gabarito. Regra de ouro: **toda V/F
exige uma frase de "porquê"**. Sem o porquê, não conta, é o que separa saber de
chutar. Para afirmar um "sempre", cheque todos os casos; para refutar, ache
**UM** contra-exemplo.

O gabarito fica no fim, longe das perguntas. Cada resposta traz: como se resolve,
o que representa na teoria, e uma **âncora** curta pra fixar.

---

# PARTE 1: QUESTÕES

## Bloco 1: Conjuntos: fundamentos

**1.** (V/F) `{1, 2, 2, 3}` e `{1, 2, 3}` são o mesmo conjunto. Justifique.

**2.** (V/F) `{1, 2, 3}` e `{3, 2, 1}` são conjuntos **diferentes**. Justifique.

**3.** Seja `B` o conjunto das letras da palavra **"BANANA"**. Qual é `|B|`?
Explique por que não é 6.

**4.** Explique a diferença entre descrever um conjunto **por extensão** e **por
compreensão**. Dê um exemplo de cada para `{2, 4, 6}`.

**5.** (V/F) Em JS, `new Set([{id:1}, {id:1}]).size` é `1`. Justifique.

## Bloco 2: Subconjuntos

**6.** (V/F) `∅ ⊆ ∅` (o vazio é subconjunto dele mesmo). Justifique.

**7.** Com `C = {7, 8, 9}`, classifique (V/F + porquê quando for F):
(a) `8 ∈ C`  (b) `{8} ∈ C`  (c) `{7, 9} ⊆ C`  (d) `7 ⊆ C`

**8.** (V/F) Com `D = {1, 2}`: vale `{1} ⊂ D` (subconjunto **próprio**)? Justifique.

**9.** (V/F) Todo conjunto é subconjunto **próprio** de si mesmo. Justifique.

**10.** Seja `E = {a, {b}}` (dois elementos: o `a` e a caixa `{b}`). Classifique:
(a) `{b} ∈ E`  (b) `b ∈ E`  (c) `{{b}} ⊆ E`

**11.** Como se **prova** que dois conjuntos `A` e `B` são iguais?

## Bloco 3: Operações e leis

Contexto: `A = {1, 2, 3}`, `B = {3, 4, 5}`, universo `U = {1, 2, 3, 4, 5, 6}`.

**12.** Calcule: (a) `A ∪ B`  (b) `A ∩ B`

**13.** Calcule `A ∖ B` **e** `B ∖ A`. Por que diferem? O que isso diz sobre a
operação?

**14.** (V/F) O `3` aparece em `A ∪ B` duas vezes, por estar em `A` e em `B`.
Justifique.

**15.** Calcule o complemento de `A` usando `U`. O complemento faz sentido sem um
universo definido? Por quê?

**16.** **De Morgan.** Reescreva `‾(A ∪ B)` empurrando o complemento pra dentro.

**17.** (V/F) `‾(A ∩ B)` é igual a `‾A ∩ ‾B`. Justifique.

**18.** Ligue cada operação ao operador lógico (`∧`, `∨`, `¬`): união, interseção,
diferença, complemento.

**19.** A distributiva `A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)` é a tradução de qual lei
booleana? Escreva com `&&` e `||`.

**20.** (V/F) A diferença é comutativa: `A ∖ B = B ∖ A` sempre. Justifique.

## Bloco 4: Produto cartesiano

Contexto: `A = {1, 2}`, `B = {x, y}`.

**21.** Liste todos os pares de `A × B`.

**22.** Qual é `|A × B|`? Escreva a **fórmula** da cardinalidade.

**23.** (V/F) `A × B = B × A`. Justifique.

**24.** (V/F) Dentro de um par, tanto faz a ordem: `(1, x)` é o mesmo que `(x, 1)`.
Justifique.

**25.** Um `CROSS JOIN` entre duas tabelas de 10.000 linhas tenta produzir quantas
linhas? Use a fórmula e diga por que isso trava o banco.

**26.** Complete: `A × B = { (a, b) | a ∈ ___ e b ∈ ___ }`.

**27.** (V/F) Uma **relação** é um subconjunto de um produto cartesiano. Explique o
que é o "possível" e o que é a "relação".

**28.** Explique os dois níveis de ordem no produto cartesiano (o conjunto de
pares vs. dentro do par) e por que não se contradizem.

## Bloco 5: Relações: propriedades e estruturas

**29.** "`=`" (igualdade) sobre números é **reflexiva**? (V/F + porquê)

**30.** "`<`" sobre números é **reflexiva**? (V/F + porquê)

**31.** "`x` é irmão de `y`" é **simétrica**? E "`x` segue `y`" numa rede social?
Explique a diferença.

**32.** "`x` é pai de `y`" é **transitiva**? (V/F + porquê)

**33.** "`≤`" é **antissimétrica**? O que a antissimetria exige aqui?

**34.** (V/F) "Antissimétrica" é o mesmo que "não-simétrica". Justifique.

**35.** Pode uma relação ser **simétrica E antissimétrica** ao mesmo tempo?

**36.** "`x` segue `y`" no Instagram é **antissimétrica**? (V/F + porquê)

**37.** Uma relação **reflexiva + simétrica + transitiva** chama-se o quê? Qual o
efeito estrutural sobre o conjunto?

**38.** Uma relação **reflexiva + antissimétrica + transitiva** chama-se o quê? Dê
um exemplo do dia a dia de dev.

**39.** (V/F) Toda relação de equivalência é também uma ordem parcial. Justifique.

**40.** Reflexiva sozinha vs transitiva sozinha: dê uma relação que tem **só**
reflexiva (não transitiva) e uma que tem **só** transitiva (não reflexiva).

## Bloco 6: Classificar a estrutura

Para cada uma: **equivalência**, **ordem parcial**, ou **nenhuma** (com porquê).

**41.** "`x` tem o mesmo aniversário que `y`" (mesmo dia/mês).

**42.** "`x` é ancestral de `y`" numa árvore genealógica.

**43.** "`x` segue `y`" no Instagram.

**44.** "`x` divide `y` sem deixar resto" sobre os inteiros positivos.

## Bloco 7: Funções: injetora, sobrejetora, bijetora

Para cada uma: **injetora? sobrejetora? bijetora?** (ou nenhuma), com o porquê.
Atenção ao **domínio e ao contradomínio**, eles mudam o veredito.

**45.** `f(x) = x + 10`, de `ℤ → ℤ`.

**46.** `f(x) = x²`, de `ℤ → ℤ`.

**47.** `f = toLowerCase`, de strings → strings.

**48.** `f(pessoa) = CPF da pessoa`, de pessoas → todos os CPFs válidos.

**49.** `f(x) = 2x`, de `ℤ → ℤ`.

**50.** `f(x) = 2x`, de `ℤ → Pares` (mesma fórmula, contradomínio diferente).

**51.** `f(pessoa) = primeiro nome`, de pessoas → nomes.

---

# PARTE 2: GABARITO COMENTADO

> Não leia antes de tentar. O valor está em travar primeiro; o gabarito explica
> por que travou.

## Bloco 1: Fundamentos

**1. V.** Conjunto não tem elemento repetido (Regra 1), então o `2` a mais não
acrescenta nada: os dois lados são o mesmo conjunto.
*Âncora: repetir não muda o conjunto.*

**2. F.** Conjunto não tem ordem (Regra 2), então `{1,2,3}` e `{3,2,1}` são
**iguais**, logo a afirmação "são diferentes" é falsa.
*Cuidado clássico: casar o V/F com o porquê. "Não tem ordem" prova que são
iguais, então a resposta a "são diferentes?" é F.*

**3. `|B| = 3`.** As letras distintas de "BANANA" são `{B, A, N}`. A palavra tem
6 letras, mas as repetições de A e N colapsam (Regra 1), sobrando 3.
*Âncora: tamanho da fonte de dados ≠ cardinalidade do conjunto (registros ≠
distintos, como `COUNT(*)` vs `COUNT(DISTINCT)`).*

**4.** Por **extensão** você lista: `{2, 4, 6}`. Por **compreensão** você dá a
regra: `{ x | x é par e 0 < x < 8 }`. A compreensão é o "tal que" (a barra `|`) e
vira um `filter` no código; descreve até conjuntos infinitos.

**5. F.** `Set` compara objetos por **identidade**, não por conteúdo. Dois
`{id:1}` são objetos distintos na memória, então nenhum é duplicata → `size` é 2.
*Âncora: para deduplicar por conteúdo, use uma chave estável (`.map(o => o.id)`).*

## Bloco 2: Subconjuntos

**6. V.** Subconjunto é "todo elemento de A está em B?". O vazio não tem elemento
nenhum, então não há quem viole a regra → vale **por vacuidade**.
*Âncora: pra derrubar um "para todo" você precisa de UM contra-exemplo; o vazio
não fornece nenhum, então `∅ ⊆ qualquer coisa` é sempre V.*

**7.** (a) **V**, o número 8 é elemento de C. (b) **F**, `{8}` é uma caixa
(conjunto), não o elemento `8`; os elementos de C são números soltos. (c) **V**,
todo elemento de `{7,9}` está em C. (d) **F**, `7` é elemento, não conjunto;
"`7 ⊆ C`" está mal formado.
*Âncora: olhe o símbolo primeiro. `∈` espera elemento à esquerda; `⊆` espera
conjunto (caixa) à esquerda.*

**8. V.** `{1}` cabe em `{1,2}` (o 1 está lá) **e** `{1} ≠ {1,2}` (falta o 2) →
cabe e ainda sobra, que é a exigência do próprio.
*Âncora: `⊆` é como `≤`; `⊂` é como `<`.*

**9. F.** `⊂` (próprio) exige `A ⊆ B` **e** `A ≠ B`. Um conjunto é igual a si
mesmo, então o "`≠`" quebra: nunca é subconjunto próprio de si.
*Âncora: assim como `3 < 3` é falso, `B ⊂ B` é falso.*

**10.** (a) **V**, a caixa `{b}` é um dos dois elementos de E. (b) **F**, o `b`
solto não é elemento de E; lá tem a caixa `{b}`, não o `b` pelado. (c) **V**, o
único elemento de `{{b}}` é `{b}`, que está em E.
*Âncora: `{b}` (a caixa) e `b` (o valor) são tipos diferentes. Igual a `["b"]`
vs `"b"` num array.*

**11.** Pela **dupla continência**: `A = B` sse `A ⊆ B` **e** `B ⊆ A`. Se todo
elemento de A está em B e vice-versa, não podem diferir em nada.

## Bloco 3: Operações e leis

**12.** (a) `A ∪ B = {1,2,3,4,5}` (o 3 entra uma vez só). (b) `A ∩ B = {3}`.

**13.** `A ∖ B = {1,2}` e `B ∖ A = {4,5}`. Diferem porque a diferença **não é
simétrica**: cada uma pergunta "o que é exclusivo de um em relação ao outro".
*Âncora: "obrigatórios ∖ recebidos" (o que faltou) é o oposto de "recebidos ∖
obrigatórios" (o que veio a mais). Trocar a ordem responde outra pergunta.*

**14. F.** Conjunto não repete (Regra 1); o 3 aparece **uma vez só** em `A ∪ B`,
mesmo estando nos dois.

**15. `‾A = {4,5,6}`** (tudo de `U` que não está em A). O complemento **não** faz
sentido sem universo: "tudo que está fora" só existe dentro de um `U` definido.
*Âncora: "pra perder algo, preciso saber da existência dele", sem universo, não
há de onde tirar o complemento.*

**16.** `‾(A ∪ B) = ‾A ∩ ‾B`. A barra entra e o `∪` vira `∩`.

**17. F.** `‾(A ∩ B)` é `‾A ∪ ‾B` (a **união** dos complementos), não `‾A ∩ ‾B`.
*Âncora do De Morgan: a negação entra, a operação inverte (∪↔∩), E cada termo é
negado. Igual à lógica: `!(a && b)` = `!a || !b`.*

**18.** União → `∨` (ou). Interseção → `∧` (e). Diferença → `∧¬` (e não).
Complemento → `¬` (não). Cada operação é o operador lógico dentro do `filter`.

**19.** É a **distributiva** booleana: `a && (b || c) === (a && b) || (a && c)`.
Fatorar o termo comum, como `3 × (4+5) = 3×4 + 3×5`.
*Cuidado: distributiva ≠ De Morgan. De Morgan mexe com negação entrando num
grupo; distributiva fatora um termo comum. Sem negação aqui.*

**20. F.** A diferença não é comutativa (ver 13): `A ∖ B ≠ B ∖ A` em geral.
União e interseção são comutativas; diferença tem direção embutida.

## Bloco 4: Produto cartesiano

**21.** `{ (1,x), (1,y), (2,x), (2,y) }`.

**22.** `|A × B| = |A| × |B| = 2 × 2 = 4`.

**23. F.** `A × B ≠ B × A`. A cardinalidade é a mesma (4), mas os **pares** diferem:
em `A × B` o primeiro elemento vem de A (`(1,x)`); em `B × A`, de B (`(x,1)`). A
posição dentro do par tem significado.

**24. F.** A ordem dentro do par importa: `(1,x) ≠ (x,1)`. É um par **ordenado**;
primeiro e segundo slot são papéis distintos.

**25.** `10.000 × 10.000 = 100.000.000` (cem milhões, `10⁸`). A fórmula `|A|×|B|`
é literalmente o motivo de um JOIN sem condição travar: tenta materializar o
produto inteiro.

**26.** `a ∈ A` e `b ∈ B`.

**27.** O produto cartesiano é o **possível** (todas as combinações); a **relação**
é o **verdadeiro** (o subconjunto dos pares que valem, segundo uma regra).
`relação ⊆ A × B`. É uma tabela de banco: cada linha um par, a tabela a relação.
*Âncora: produto = planilha com todas as linhas; relação = marca-texto nas que
valem.*

**28.** O **conjunto de pares** não tem ordem (nível de fora, é um conjunto:
Regra 2). **Dentro** de cada par a ordem é sagrada (nível de dentro, é um par
ordenado). Não colidem porque são dois objetos diferentes (conjunto vs par).

## Bloco 5: Propriedades e estruturas

**29. V.** `a = a` sempre, todo elemento se relaciona consigo.

**30. F.** Nada é menor que si mesmo (`a < a` é falso). Como falha para **todo**
`a`, "`<`" é **irreflexiva** (a oposta, não só "falta a reflexiva").

**31.** "Irmão de" é **simétrica** (se A é irmão de B, B é de A, a volta é
automática). "Segue" **não** é simétrica (mão única: A seguir B não faz B seguir
A). É o que decide modelar com 1 linha (amizade) ou 2 linhas (seguir) no banco.
*Cuidado: simetria ("a volta é automática?") ≠ cardinalidade N-pra-N ("quantos se
ligam a quantos?"). "Seguir" é N-pra-N mas não é simétrica.*

**32. F.** Se A é pai de B e B é pai de C, A **não** é pai de C, é **avô**. A
cadeia encadeia *outra* relação (avô), não a mesma.
*Âncora: transitiva = a MESMA relação chega direto no fim. "Pai de pai = avô"
não é transitividade.*

**33. V.** "`≤`" é antissimétrica: se `a ≤ b` e `b ≤ a`, então `a = b`. A
antissimetria exige que a única "ida-e-volta" seja entre um elemento e ele mesmo.

**34. F.** Antissimétrica ("se vai e volta, é o mesmo elemento") não é o mesmo que
"não-simétrica" ("não é simétrica"). Uma relação pode não ser nenhuma das duas.

**35. Sim.** A igualdade "`=`" é as duas: simétrica (`a=b ⇒ b=a`) e antissimétrica
(`a=b` e `b=a ⇒ a=b`, trivial). Convivem quando a relação só liga cada elemento a
si mesmo, aí nunca há ida-e-volta entre diferentes pra violar a antissimetria.
*Âncora: simétrica e antissimétrica NÃO são opostas.*

**36. F.** "Seguir" não é antissimétrica: X e Y (pessoas diferentes) podem se
seguir mutuamente, violando a exigência de `X = Y`.

**37. Equivalência.** Efeito: **particiona** o conjunto em **classes de
equivalência**, baldes disjuntos que cobrem tudo (nada sobra, nada se sobrepõe).
É o `GROUP BY`.

**38. Ordem parcial.** Ex.: dependência entre módulos/pacotes ("A depende de B"),
ordenada topologicamente no build; ou "`⊆`", ou versionamento. É a equivalência
com simétrica trocada por antissimétrica, de "agrupar" pra "ordenar".

**39. F.** Equivalência pede **simétrica**; ordem parcial pede **antissimétrica**.
Uma equivalência não-trivial (grupos de 2+) liga elementos diferentes ida-e-volta,
logo não é antissimétrica → não é ordem parcial. A única exceção é "`=`" (o caso
degenerado com baldes de 1 elemento).

**40.** Só reflexiva (não transitiva): "é amigo de" (você é amigo de si; mas amigo
do amigo não é seu amigo). Só transitiva (não reflexiva): "`<`" (encadeia, mas
`a < a` é falso).

## Bloco 6: Classificar a estrutura

**41. Equivalência.** Reflexiva (mesmo aniversário que si), simétrica (mão dupla),
transitiva (encadeia). Particiona em até 366 baldes. É "mesmo ___" = `GROUP BY`.

**42. Ordem parcial.** Antissimétrica (se X é ancestral de Y, Y não é de X, sem
ciclos) e transitiva (ancestral de ancestral ainda é ancestral). É uma hierarquia.
*(Rigor: "ancestral" estrito é irreflexivo → ordem parcial **estrita**; no nível
introdutório, classificar como ordem parcial está correto.)*

**43. Nenhuma.** Não é simétrica (seguir é mão única) nem antissimétrica (dois
podem se seguir mutuamente), fica no meio-termo, e ainda não é transitiva.
*Cuidado (o erro mais fino do tópico): classifique a RELAÇÃO que te deram, não o
que dá pra construir com os dados. "Agrupar quem segue o Y" usa outra relação
("ter o mesmo alvo"), não "seguir".*

**44. Ordem parcial.** Reflexiva (todo n se divide), antissimétrica (se a divide b
e b divide a, então a=b), transitiva (a|b e b|c ⇒ a|c). Há **incomparáveis** (9 e
12 não se dividem).
*Âncora: incomparáveis não quebram a ordem, eles a tornam PARCIAL. Contraste com
"`≤`", onde todo par se compara (ordem total).*

## Bloco 7: Funções

**45. Bijetora.** Injetora (`a+10 = b+10 ⇒ a=b`, sem colisão) e sobrejetora (todo
inteiro `y` vem de `y-10`). Reversível: `f⁻¹(y) = y - 10`.

**46. Nenhuma.** Não injetora (`-3` e `3` batem em `9`, colisão) e não
sobrejetora (nenhum inteiro ao quadrado dá negativo; o `-4` do contradomínio sobra).

**47. Nenhuma.** Não injetora (`"OI"` e `"oi"` colapsam em `"oi"`) e não
sobrejetora sobre "todas as strings" (nunca produz maiúsculas). Normalização é
lossy de propósito.

**48. Injetora (só).** Duas pessoas têm CPFs diferentes (sem colisão), mas há CPFs
válidos sem dono (sobra no contradomínio) → não sobrejetora.
*Âncora: todo bom identificador é injetora; raramente sobrejetora, sempre sobra
espaço de chaves não usado.*

**49. Injetora (só).** `2x` não colide, mas nenhum inteiro dobrado dá um ímpar (o
`3` sobra) → não sobrejetora sobre `ℤ`.

**50. Bijetora.** MESMA fórmula do 49, mas o contradomínio virou os **Pares**:
agora todo par é o dobro de algum inteiro → sobrejetora, e continua injetora.
*Âncora (a lição do bloco): sobrejetividade é da fórmula + domínio +
CONTRADOMÍNIO, não da fórmula sozinha. Encolha o contradomínio até a imagem e a
função vira sobrejetora.*

**51. Sobrejetora (só).** Todo nome do contradomínio pertence a alguém (senão não
estaria lá), mas duas pessoas podem ter o mesmo primeiro nome (colisão) → não
injetora. É o espelho do CPF (injetora mas não sobrejetora).

---

## Quadro dos quatro cantos (funções)

| | sobrejetora | não sobrejetora |
|---|---|---|
| **injetora** | `x+10`, `2x` em ℤ→Pares (**bijetoras**) | `2x` em ℤ→ℤ, CPF |
| **não injetora** | primeiro nome | `x²`, `toLowerCase` |

Os dois eixos (colisão e cobertura) são independentes, existe exemplo em cada
canto.

## Armadilhas recorrentes (as que mais pegam)

- **Casar o V/F com o porquê.** Às vezes o raciocínio está certo e a letra sai
  trocada (ver Q2, Q41 do simulado original).
- **`∈` vs `⊆`.** O símbolo define o tipo de cada lado: `∈` quer elemento, `⊆`
  quer conjunto.
- **`⊂` é `<`, não `≤`.** Próprio exige que sobre algo no maior.
- **De Morgan.** A operação inverte E cada termo é negado.
- **Transitiva ≠ antissimétrica.** Uma é sobre encadear pra frente; a outra sobre
  a volta ser proibida. "Pai de pai = avô" (não transitiva) é o teste.
- **Classificar a relação, não os dados.** "Seguir" é o objeto; "mesmo alvo" é
  outro objeto que você construiu.
- **Incomparável = parcial, não "nenhuma".** Divisibilidade é ordem parcial
  justamente por ter incomparáveis.
- **Sobrejetividade depende do CONTRADOMÍNIO.** A mesma fórmula muda de veredito
  quando o alvo muda (Q49 vs Q50).

# Como criar desafios de lógica booleana

Guia pra gerar exercícios no formato do "Gate de Deploy": um enunciado com regras que se cruzam, saída testável, e um validador que roda e diz se passou.

---

## O princípio

Um bom desafio de lógica booleana não testa se a pessoa **conhece** os operadores (E, OU, NÃO — todo dev conhece). Testa se ela consegue **traduzir regras confusas em condições corretas** e **verificar** que acertou. O aprendizado mora em três lugares:

- **Ordem de avaliação** — descobrir qual regra tem que ser testada primeiro.
- **De Morgan** — desemaranhar regras escritas na forma negativa.
- **Enumeração** — perceber que, com muitas variáveis, não dá pra conferir "no olho"; tem que montar tabela.

Se o seu desafio força esses três, ele ensina. Se não, é só um `if` disfarçado.

---

## A receita (passo a passo)

### 1. Escolha um domínio que a pessoa entende sem explicação
Frete, gate de deploy, permissão de acesso, aprovação de pedido, elegibilidade pra desconto, regra de plantão. **Autocontido** — todas as regras vêm no enunciado, nada depende de conhecimento externo (nada de "regra real de imposto"). O domínio é só o vestido; a lógica é o corpo.

### 2. Defina as variáveis de entrada (as flags)
Comece com 5–7 booleanos. Menos que 5 é fácil demais (cabe na cabeça). Cada flag deve **interagir** com pelo menos uma outra — flag que decide sozinha não ensina nada.

### 3. Defina a saída
- **Booleana** (true/false): lógica mais pura, treina De Morgan direto.
- **Múltipla** (categorias): treina também ordem e exclusão entre casos.
Comece pela booleana pra treinar lógica pura.

### 4. Escreva as regras cruzando de propósito
Aqui está o trabalho de verdade. Use os três eixos abaixo.

### 5. Monte o gabarito como tabela de casos
Cada linha é uma combinação de entradas + a saída esperada. **Inclua os casos-armadilha** (os que quebram quem não entendeu). A tabela É o teste.

### 6. Escreva a solução de referência e valide
Rode a solução contra a tabela. Se não passa em tudo, ou a solução ou o gabarito está errado — conserte antes de entregar.

---

## Os três eixos de dificuldade

Combine-os pra endurecer. O desafio de deploy usava os três.

### Eixo 1 — Muitas flags combinando (força a tabela-verdade)
Quanto mais variáveis interagem, mais impossível fica segurar na cabeça. Com 7 flags são 128 combinações. A pessoa é **obrigada** a enumerar pra ter certeza. Regra prática: se dá pra conferir de cabeça, tem flags de menos.

### Eixo 2 — Regras na forma negativa (força De Morgan)
Escreva regras com "não", "a menos que", "exceto", "sem". Exemplo:
> "Não se libera deploy **a menos que** os testes passem, **exceto** se for hotfix."

O cérebro traduz errado na primeira vez. A tradução correta é `libera se (testes || hotfix)`. Cada regra negativa é um De Morgan que a pessoa tem que fazer certo. **Essa é a fonte nº 1 de dificuldade real.**

### Eixo 3 — Regras que se contradizem (força deduzir precedência)
Ponha duas regras que colidem em certos cenários e **não diga explicitamente qual vence** — deixe a pista no texto. Exemplo do deploy:
> Regra 5: "líder não precisa de aprovação."
> Regra 4: "na sexta, não se deploya sem aprovação — **até pra líder**."

O "até pra líder" é a pista de que a sexta vence. Quem lê no automático erra. Isso mata quem empilha `if` na ordem em que leu.

---

## Como escrever o gabarito (parte mais importante)

Os casos-teste não podem ser aleatórios. Cada um deve **provar** uma coisa:

- **1 caso feliz** — tudo certo, retorna o resultado positivo. (âncora)
- **1 caso por regra** — isola cada regra disparando sozinha.
- **Os casos-armadilha** — onde duas regras se cruzam e a resposta "óbvia" está errada. São eles que separam quem entendeu de quem chutou.
- **1 caso da regra absoluta** — a que vence todas (ex.: conflito de merge), pra provar que ela vem primeiro.

Regra de ouro: pra cada caso, você tem que conseguir escrever **"por quê"** numa frase. Se não consegue, o caso é inútil.

---

## Anti-padrões (o que estraga o desafio)

- **Ambiguidade** — regra que dá pra interpretar de dois jeitos. Aí não é lógica, é adivinhação. Toda entrada precisa de UMA saída defensável.
- **Conhecimento externo** — exigir que a pessoa saiba uma regra do mundo real. Tudo no enunciado.
- **Flags independentes** — se cada flag decide sozinha, não há combinação, não há aprendizado.
- **Poucos casos** — com poucos casos, dá pra passar chutando. Cubra as armadilhas.
- **Dar o conteúdo antes** — se você ensina De Morgan e depois aplica, mata a descoberta. Deixe a pessoa travar primeiro; o conteúdo explica por que travou.

---

## Template do validador (reutilizável)

Troque a função e a tabela de casos. Roda com `node valida.js`.

```javascript
// O aluno escreve só o corpo desta função:
function resolver(/* suas flags aqui */) {
  // solução do aluno
}

// ============================================================
// GABARITO — não mexer. Cada linha: { in: [...flags], esperado: ... }
// ============================================================
const casos = [
  { in: [/* ... */], esperado: /* true/false ou categoria */ },
  // ... mais casos, incluindo as armadilhas
];

const nomes = [/* nomes das flags, na ordem */];

let passou = 0;
console.log("\n=== Validando ===\n");

casos.forEach((caso, i) => {
  const resultado = resolver(...caso.in);
  const ok = resultado === caso.esperado;
  if (ok) passou++;

  const flags = caso.in
    .map((v, j) => (v === true ? nomes[j] : v === false ? null : `${nomes[j]}=${v}`))
    .filter(Boolean).join(", ") || "(nenhuma)";

  const detalhe = ok ? "" : `  -> esperado: ${caso.esperado} | obtido: ${resultado}`;
  console.log(`Caso ${String(i + 1).padStart(2)}: ${ok ? "PASSOU" : "FALHOU"} [${flags}]${detalhe}`);
});

console.log(`\n=== ${passou}/${casos.length} casos ===`);
console.log(passou === casos.length ? "✔ Correto.\n" : `✘ ${casos.length - passou} falhando.\n`);
```

### Versão rigorosa (avaliação)
Pra impedir que passem chutando, troque a tabela fixa por **todas as combinações** e compare contra a solução de referência:

```javascript
// Gera as 2^N combinações de N flags booleanas e compara
// aluno vs. referência. Impossível passar sem a lógica 100% certa.
const N = 7; // número de flags
let falhas = 0;
for (let i = 0; i < (1 << N); i++) {
  const flags = Array.from({ length: N }, (_, b) => Boolean(i & (1 << b)));
  if (resolver(...flags) !== referencia(...flags)) falhas++;
}
console.log(falhas === 0 ? "✔ 100% correto" : `✘ ${falhas}/${1 << N} combinações erradas`);
```

A versão fixa é **didática** (mostra qual caso específico quebrou). A exaustiva é **de avaliação** (não dá pra enganar). Tenha as duas.

---

## Checklist antes de entregar

- [ ] 5+ flags que interagem entre si
- [ ] Pelo menos 2 regras na forma negativa (De Morgan)
- [ ] Pelo menos 1 par de regras que se contradiz (precedência a deduzir)
- [ ] 1 regra "absoluta" que vence todas
- [ ] Gabarito com casos-armadilha, cada um com um "porquê" de uma frase
- [ ] Solução de referência roda e passa em 100% dos casos
- [ ] Nenhuma regra ambígua ou que dependa de conhecimento externo

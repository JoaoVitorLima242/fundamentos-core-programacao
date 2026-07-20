# Simulado de combinatória — com gabarito comentado

15 questões, todas as fórmulas misturadas. Resolva **antes** de abrir o gabarito. Para cada uma, escreva a **fórmula** e o **número** — e, de preferência, o teste que te levou até ela (a troca, o "cada", o "pelo menos").

**Regra de ouro:** rode o procedimento, não o instinto.
1. tem "pelo menos"? → complemento
2. os grupos se sobrepõem? → inclusão-exclusão
3. uma escolha ou várias? → soma / segue
4. repete? (o item some — física ou frase?)
5. **a ordem importa? (troca dois — muda?)** ← faça ANTES de escolher a fórmula

---

## Parte 1 — enunciados

1. Um alarme tem código de 5 dígitos (0 a 9). Quantos códigos existem?

2. De 10 jogadores, escolher os 5 titulares (sem posição definida). Quantos times?

3. Distribuir 7 chamados idênticos de suporte entre 3 atendentes. Um atendente pode ficar sem. Quantas distribuições?

4. Quantas senhas de 4 letras (26) têm **pelo menos** uma letra repetida?

5. 6 palestrantes, 6 horários. Cada um fala uma vez, um por horário. Quantas agendas?

6. Você vai assistir **uma** série: há 8 de drama e 5 de comédia. Quantas opções?

7. De 12 funcionários, montar uma diretoria com **CEO, CFO e CTO** (cargos distintos). Quantas diretorias?

8. Numa conferência de 100 pessoas: 60 falam inglês, 45 falam espanhol, 25 falam os dois. Quantas falam **pelo menos um** dos dois idiomas?

9. `a + b + c + d = 12`, inteiros ≥ 0. Quantas soluções?

10. Uma pizzaria tem 9 sabores. Você monta uma pizza de **3 sabores diferentes** (sem ordem entre os pedaços). Quantas pizzas?

11. Um formulário tem 6 campos, cada um com um seletor de 4 opções. Quantos preenchimentos?

12. Comprar 5 refrigerantes numa loja de 4 marcas (pode repetir a marca). Quantas compras distintas?

13. De 8 livros, quantas maneiras de arrumar 3 deles numa prateleira, um ao lado do outro (a ordem conta)?

14. Quantos números de 3 algarismos **distintos** existem (de 0 a 9, pode começar com 0)?

15. Numa turma de 35: 20 fazem musculação, 15 fazem corrida, **8 não fazem nenhuma**. Quantas fazem **as duas**?

---

## Parte 2 — gabarito comentado

### 1. `nᵏ` → 100.000

Código de 5 dígitos, cada posição de 0 a 9, **repetição permitida** (`00000` vale). 5 ações, cardápio de 10, o dígito não some.
$$10^5 = 100.000$$
*Sinal: dígito é rótulo, nada proíbe repetir → estoque cheio.*

### 2. combinação → 252

5 titulares **sem posição** — trocar dois titulares dá o mesmo time. Ordem não importa, sem repetir.
$$C(10,5) = \frac{10 \times 9 \times 8 \times 7 \times 6}{5!} = \frac{30240}{120} = 252$$
*Teste da troca: trocar dois jogadores → mesmo time → divide.*

### 3. estrelas e barras → 36

7 chamados **idênticos**, 3 atendentes, pode ficar sem. Itens iguais + destinos distintos + "quantos cada um".
```
estrelas (k) = 7      cortes = 3−1 = 2      n = 7+2 = 9
```
$$C(9,7) = C(9,2) = \frac{9 \times 8}{2!} = 36$$
*Estrela = chamado (o que se reparte); slot = atendente.*

### 4. complemento → 98.176

**"Pelo menos"** uma repetida → conte o contrário (todas diferentes) e subtraia.
$$U = 26^4 = 456.976 \qquad \bar{A} = 26 \times 25 \times 24 \times 23 = 358.800$$
$$456.976 - 358.800 = 98.176$$
*Leu "pelo menos" → `U − Ā`. "Todas diferentes" é o lado fácil.*

### 5. permutação → 720

6 palestrantes usam **todos** os 6 horários, um por horário, sem repetir. E a ordem importa: trocar quem fala às 9h e às 10h dá outra agenda.
$$6! = 720$$
*Armadilha: não é `6²`. "Cada um fala uma vez, um por horário" = ordenar todos = permutação.*

### 6. soma → 13

Uma série **só**, drama **ou** comédia, grupos disjuntos.
$$8 + 5 = 13$$
*Sinal: "uma" + "ou". Sem sobreposição, soma crua.*

### 7. arranjo → 1.320

CEO, CFO, CTO são **cargos distintos** = posições com nome. Trocar quem é CEO com quem é CFO **muda** a diretoria → a ordem importa → **não divide**.
$$12 \times 11 \times 10 = 1.320$$
*Armadilha clássica: cargo tem posição. É pódio, não comitê. Faça a troca ANTES de decidir dividir.*

### 8. inclusão-exclusão → 80

Os grupos se sobrepõem (25 falam os dois). Soma e tira a interseção uma vez.
$$60 + 45 - 25 = 80$$
*Cuidado: o 100 (total) não entra nesta conta — ele serviria só se a pergunta fosse "quantos não falam nenhum" (`100 − 80 = 20`).*

### 9. estrelas e barras → 455

Equação `a+b+c+d=12`, inteiros ≥ 0 = distribuir 12 unidades entre 4 variáveis.
```
estrelas (k) = 12      cortes = 4−1 = 3      n = 12+3 = 15
```
$$C(15,12) = C(15,3) = \frac{15 \times 14 \times 13}{3!} = 455$$
*Disfarce: a equação é estrelas e barras. O número da direita são as estrelas; as variáveis são os slots.*

### 10. combinação → 84

Pizza de 3 sabores **diferentes** → **sem repetir**. Sem ordem entre os pedaços → combinação simples.
$$C(9,3) = \frac{9 \times 8 \times 7}{3!} = 84$$
*Armadilha: "diferentes" = NÃO repete → combinação, não estrelas e barras. Estrelas e barras é quando PODE repetir.*

### 11. `nᵏ` → 4.096

6 campos, **cada um** com 4 opções, o seletor não some. Base = cardápio (4), expoente = ações (6).
$$4^6 = 4.096$$
*Cuidado com a inversão: é `4⁶`, não `6⁴`. Um fator por campo, cada fator = 4.*

### 12. estrelas e barras → 56

5 refrigerantes, 4 marcas, **pode repetir**, mesma sacola → combinação com repetição.
```
estrelas (k) = 5      cortes = 4−1 = 3      n = 5+3 = 8
```
$$C(8,5) = C(8,3) = \frac{8 \times 7 \times 6}{3!} = 56$$
*Estrela = refrigerante (o que você leva, `k=5`); slot = marca (4). Não trocar: o item é o refri, não a marca.*

### 13. arranjo → 336

3 de 8 livros numa prateleira, **a ordem conta** (posições lado a lado), sem repetir.
$$8 \times 7 \times 6 = 336$$
*Prateleira tem posição → arranjo, não divide.*

### 14. arranjo → 720

Número de 3 algarismos **distintos**. Número **é ordenado** — `347 ≠ 743`, trocar muda o valor. Distintos → sem repetir.
$$10 \times 9 \times 8 = 720$$
*Armadilha clássica: "distinto" diz que DESCE, não que é combinação. Número, senha, placa, PIN têm posição → arranjo.*

### 15. inclusão-exclusão (virada) → 8

**8 não fazem nenhuma** → fazem pelo menos uma: `35 − 8 = 27` (complemento). Agora isole a interseção:
$$|A \cup B| = |A| + |B| - |A \cap B| \;\Rightarrow\; 27 = 20 + 15 - x \;\Rightarrow\; x = 8$$
*Duas etapas: complemento (acha o 27) + inclusão-exclusão virada do avesso (isola a interseção). Não parar no 27 — ele é "faz alguma", não "faz as duas".*

---

## Diagnóstico — os padrões de erro deste simulado

| Padrão | Questões | A frase que resolve |
|---|---|---|
| **dividir onde há posição** | 7, 14 (e 5, como `nᵏ`) | *"distinto/cargo/horário" diz que DESCE, não que é combinação. Número, cargo, prateleira têm posição → arranjo* |
| **"diferentes" ≠ estrelas e barras** | 10 | *"diferentes" = não repete → combinação simples; estrelas e barras é quando PODE repetir* |
| **trocar estrela e slot** | 12 | *estrela é o que você leva (refri), não os tipos (marca)* |
| **parar antes do fim** | 8, 15 | *o setup certo não é a resposta — termine a conta* |
| **inverter base/expoente** | (11, evitado) | *a base é o cardápio; o expoente é quantas vezes* |

## A regra única que cobre o padrão mais comum

> **Faça o teste da troca ANTES de escolher a fórmula, não depois.**
> Dividir por `k!` é dizer "as ordens dos escolhidos são a mesma coisa". Só vale quando são. Troque dois: se dá **outro** resultado (número, cargo, horário, senha, prateleira), a ordem **importa** → **arranjo, não divide**.

**Gabarito rápido:** 1) 100.000 · 2) 252 · 3) 36 · 4) 98.176 · 5) 720 · 6) 13 · 7) 1.320 · 8) 80 · 9) 455 · 10) 84 · 11) 4.096 · 12) 56 · 13) 336 · 14) 720 · 15) 8

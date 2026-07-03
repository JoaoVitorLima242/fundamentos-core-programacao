// ============================================================
// DESAFIO: Gate de Deploy — validador automático
// ============================================================
// O aluno escreve a função abaixo. O resto do arquivo roda
// os cenários e diz se passou. É só rodar: node index.js
// ============================================================

function podeDeployar(testesPassaram, temAprovacao, temConflito, ehHotfix, congelamento, ehSexta, autorEhLider) {
  if (temConflito) return false;

  if (congelamento && !(ehHotfix && temAprovacao)) return false;

  if (ehHotfix && temAprovacao) return true;

  if (!testesPassaram && !ehHotfix) return false;

  if (ehSexta && !!(!testesPassaram || !temAprovacao )) return false;

  if (autorEhLider) return true;

  if (!testesPassaram || !temAprovacao) return false;

  return true;
}


// ============================================================
// CASOS DE TESTE (gabarito) — não mexer
// ordem: testes, aprov, conflito, hotfix, congel, sexta, lider
// ============================================================
const casos = [
  { in: [true,  true,  false, false, false, false, false], esperado: true  },
  { in: [true,  true,  true,  false, false, false, true ], esperado: false },
  { in: [false, true,  false, false, false, false, false], esperado: false },
  { in: [false, true,  false, true,  false, false, false], esperado: true  },
  { in: [true,  true,  false, true,  true,  false, false], esperado: true  },
  { in: [true,  false, false, true,  true,  false, false], esperado: false },
  { in: [true,  false, false, false, false, true,  true ], esperado: false },
  { in: [true,  true,  false, false, false, true,  true ], esperado: true  },
  { in: [true,  false, false, false, false, false, true ], esperado: true  },
  { in: [true,  false, false, false, false, false, false], esperado: false },
  { in: [false, false, false, true,  false, true,  false], esperado: false },
  { in: [true,  true,  true,  true,  false, false, true ], esperado: false },
];

const nomes = ["testes","aprov","conflito","hotfix","congel","sexta","lider"];

// ============================================================
// RUNNER
// ============================================================
let passou = 0;
console.log("\n=== Validando podeDeployar ===\n");

casos.forEach((caso, i) => {
  const resultado = podeDeployar(...caso.in);
  const ok = resultado === caso.esperado;
  if (ok) passou++;

  const flags = caso.in
    .map((v, j) => v ? nomes[j] : null)
    .filter(Boolean)
    .join(", ") || "(nenhuma flag)";

  const status = ok ? "PASSOU " : "FALHOU ";
  const detalhe = ok
    ? ""
    : `  -> esperado: ${caso.esperado}  |  obtido: ${resultado}`;

  console.log(`Caso ${String(i + 1).padStart(2)}: ${status} [${flags}]${detalhe}`);
});

console.log(`\n=== Resultado: ${passou}/${casos.length} casos ===`);
if (passou === casos.length) {
  console.log("✔ TODOS OS CASOS PASSARAM — solução correta.\n");
  process.exit(0);
} else {
  console.log(`✘ ${casos.length - passou} caso(s) falhando — solução incorreta.\n`);
  process.exit(1);
}

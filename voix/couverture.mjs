// Mesure ce que l'app dit encore avec la voix de la tablette pendant les jeux à questions.
// Lancer : node voix/couverture.mjs [jeu]   → le nombre de textes sans voix par jeu ; avec un jeu, les morceaux qui manquent.
import { fichiers, cle } from '../js/voix-cle.js';
import { VOIX_PRETES } from './liste.js';
import { textesDits, morceaux } from './simuler.mjs';

const seul = process.argv[2], total = {}, manque = new Set();
for (const [jeu, textes] of Object.entries(textesDits())) {
  const sans = [...textes].filter((t) => !fichiers(t, VOIX_PRETES)), m = new Set(sans.flatMap(morceaux).filter((p) => !VOIX_PRETES.has(cle(p))));
  total[jeu] = { textes: textes.size, sansVoix: sans.length, morceauxAEnregistrer: m.size };
  for (const p of m) manque.add(p);
  if (seul === jeu) console.log([...m].slice(0, 60).join(String.fromCharCode(10)));
}
console.table(total);
console.log(`${manque.size} morceaux différents à enregistrer, ${[...manque].join('').length} lettres`);

// La bibliothèque : la chasse aux syllabes. On touche les syllabes dans l'ordre pour former le mot ;
// son image (floue mais en couleurs au début) devient nette, et le mot est lu à voix haute.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';
import { MOTS_FACILES, MOTS_DIFFICILES } from './syllabes-mots.js';

export const niveau = (age) => (age <= 7 ? 1 : 2);
export const etoilesParBonneReponse = (age) => etoilesDuJeu('syllabes', age);

export { MOTS_FACILES, MOTS_DIFFICILES };

// Des syllabes qui se ressemblent : on change une lettre ou un son proche.
const PROCHES = [['p', 'b'], ['b', 'p'], ['t', 'd'], ['d', 't'], ['f', 'v'], ['ch', 'j'], ['m', 'n'], ['n', 'm'], ['on', 'an'], ['an', 'on'], ['ou', 'o'], ['c', 'g'], ['l', 'r'], ['r', 'l']];
export function piege(syllabe) {
  for (const [a, b] of PROCHES) if (syllabe.includes(a)) return syllabe.replace(a, b);
  return null;
}

// reglage : { age } ; vus : les mots déjà posés (on prend d'abord ceux qui ne l'ont pas encore été)
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const niv = niveau(age);
  const banque = niv === 1 ? MOTS_FACILES : MOTS_DIFFICILES;
  const [decoupe, image, savaisTu] = parmiLesNouveaux(banque, (m) => m[0].replaceAll('-', ''), vus, aleatoire);
  const syllabes = decoupe.split('-'), mot = syllabes.join('');
  // en plus des bonnes syllabes : 1 syllabe d'un autre mot (6 ans), ou 2 pièges qui se ressemblent (9 ans)
  // pas d'intrus venant d'un mot qui partage une syllabe avec celui-ci (« sa » + « pin » ferait « sapin » au lieu de « lapin »)
  const voisins = new Set(banque.filter(([d]) => d.split('-').some((x) => syllabes.includes(x))).flatMap(([d]) => d.split('-')));
  const autres = banque.flatMap(([d]) => d.split('-')).filter((s) => !voisins.has(s));
  const pieges = niv === 1 ? [] : melanger(syllabes.map(piege).filter((s) => s && !syllabes.includes(s)), aleatoire);
  const intrus = [...new Set([...pieges, ...melanger(autres, aleatoire)])].slice(0, niv === 1 ? 1 : 2);
  return {
    mode: 'syllabes', texte: mot, titre: 'Forme le mot !', reponse: mot, syllabes, image, savaisTu,
    consigne: 'Touche les syllabes dans le bon ordre pour former le mot de l’image.',
    tuiles: melanger([...syllabes, ...intrus], aleatoire),
    trouve: `${mot[0].toUpperCase()}${mot.slice(1)} !`,
    solution: '', // le mot est déjà formé et lu à voix haute
  };
}

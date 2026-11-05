// L'école : additions, soustractions, multiplications, divisions. La difficulté dépend de l'âge.
import { choixAutour } from '../partie.js';
import { ETOILES_ECOLE } from '../reglages.js';

export const OPERATIONS = {
  addition: { nom: 'Additions', signe: '+', mot: 'plus' },
  soustraction: { nom: 'Soustractions', signe: '−', mot: 'moins' },
  multiplication: { nom: 'Multiplications', signe: '×', mot: 'fois' },
  division: { nom: 'Divisions', signe: '÷', mot: 'divisé par' },
};

// Trois paliers d'âge : 1 = 6 ans et moins (avec des images), 2 = 7–8 ans, 3 = 9 ans et plus.
export const palier = (age) => (age <= 6 ? 1 : age <= 8 ? 2 : 3);

export function etoilesParBonneReponse(age, operation) {
  return (ETOILES_ECOLE.find((l) => age <= l.jusqua) ?? ETOILES_ECOLE.at(-1))[operation];
}

const LIMITES = { // plus grand résultat (addition) ou plus grand nombre de départ (soustraction)
  addition: { 1: 10, 2: 20, 3: 100 },
  soustraction: { 1: 10, 2: 20, 3: 100 },
};
const TABLES = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 10], 3: [2, 3, 4, 5, 6, 7, 8, 9, 10] };
const MULTIPLICATEUR_MAX = { 1: 5, 2: 10, 3: 10 }; // au palier 1, au plus 20 objets à dessiner
const DIVISEURS = { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 10], 3: [2, 3, 4, 5, 6, 7, 8, 9, 10] };
const QUOTIENT_MAX = { 1: 5, 2: 10, 3: 10 };

// reglage : { operation, age }
export function question({ operation, age }, aleatoire = Math.random) {
  const p = palier(age);
  const entre = (min, max) => min + Math.floor(aleatoire() * (max - min + 1));
  const parmi = (l) => l[Math.floor(aleatoire() * l.length)];
  const { signe, mot } = OPERATIONS[operation];
  let a, b, r, aide = null;

  if (operation === 'addition') {
    const max = LIMITES.addition[p];
    a = entre(1, max - 1); b = entre(1, max - a); r = a + b;
    if (p === 1) aide = { type: 'addition', a, b };
  } else if (operation === 'soustraction') {
    a = entre(2, LIMITES.soustraction[p]); b = entre(1, a - 1); r = a - b;
    if (p === 1) aide = { type: 'soustraction', a, b };
  } else if (operation === 'multiplication') {
    do { a = parmi(TABLES[p]); b = entre(1, MULTIPLICATEUR_MAX[p]); r = a * b; } while (p === 1 && r > 20);
    if (p === 1) aide = { type: 'multiplication', a, b };
  } else {
    do { b = parmi(DIVISEURS[p]); r = entre(1, QUOTIENT_MAX[p]); a = b * r; } while (p === 1 && a > 20); // toujours une division exacte
    if (p === 1) aide = { type: 'division', a, b };
  }

  const consigne = aide?.type === 'division'
    ? `On partage ${a} bonbons entre ${b} enfants. Combien de bonbons pour chacun ?`
    : `Combien font ${a} ${mot} ${b} ?`;
  const n = p === 1 ? 3 : 4;
  const ecart = r >= 20 ? [r - 10, r + 10] : [];
  const pieges = operation === 'multiplication' ? [a * (b - 1), a * (b + 1), (a - 1) * b, (a + 1) * b, r + 1, r - 1]
    : [r - 1, r + 1, r - 2, r + 2, ...ecart];
  return { texte: `${a} ${signe} ${b}`, consigne, aide, reponse: r, choix: choixAutour(r, pieges, n, aleatoire, 0, Infinity) };
}

// Les objets dessinés au tableau pour les plus jeunes (emojis, aucune donnée de l'utilisateur).
export function illustration(aide) {
  if (!aide) return '';
  const objets = (n, e, classe = '') => `<span class="objets ${classe}">${e.repeat(n)}</span>`;
  const { a, b } = aide;
  switch (aide.type) {
    case 'addition': return `${objets(a, '🍎')}<span>+</span>${objets(b, '🍐')}`;
    case 'soustraction': return `${objets(a - b, '🍎')}${objets(b, '🍎', 'barres')}`;
    case 'multiplication': return Array.from({ length: b }, () => objets(a, '🍓', 'groupe')).join('');
    case 'division': return `${objets(a, '🍬')}<span>→</span>${objets(b, '🧒')}`;
    default: return '';
  }
}

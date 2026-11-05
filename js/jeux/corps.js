// L'hôpital : des questions de culture sur le corps, avec « Le savais-tu ? ». Les plus jeunes commencent par toucher le patient.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';
import { FACILES, DIFFICILES } from './corps-questions.js';
import { dessinerAvatar, proportions } from '../avatar.js';

export const niveau = (age) => (age <= 7 ? 1 : 2);
export const etoilesParBonneReponse = (age) => etoilesDuJeu('corps', age);

export const PATIENT = { peau: 'claire', yeux: 'bleus', coiffure: 'courts', cheveux: 'blond', tenue: 'tshirt-bleu', accessoires: [] };
export const AGE_PATIENT = 8;

// Zones à toucher, dans le dessin de l'avatar (js/avatar.js) : [partie du dessin, x, y, rayon].
// 'tete' et 'corps' : la tête et le corps grandissent différemment avec l'âge.
const T = 'tete', C = 'corps';
export const PARTIES = {
  tete: { nom: 'la tête', zones: [[T, 120, 118, 68]] },
  oeil: { nom: "l'œil", zones: [[T, 96, 131, 17], [T, 144, 131, 17]] },
  nez: { nom: 'le nez', zones: [[T, 120, 149, 11]] },
  bouche: { nom: 'la bouche', zones: [[T, 120, 166, 13]] },
  oreille: { nom: "l'oreille", zones: [[T, 55, 132, 15], [T, 185, 132, 15]] },
  front: { nom: 'le front', zones: [[T, 120, 90, 22]] },
  sourcil: { nom: 'le sourcil', zones: [[T, 95, 109, 10], [T, 145, 109, 10]] },
  joue: { nom: 'la joue', zones: [[T, 78, 157, 13], [T, 162, 157, 13]] },
  menton: { nom: 'le menton', zones: [[T, 120, 182, 11]] },
  cou: { nom: 'le cou', zones: [[C, 120, 194, 12]] },
  epaule: { nom: "l'épaule", zones: [[C, 84, 207, 13], [C, 156, 207, 13]] },
  bras: { nom: 'le bras', zones: [[C, 70, 230, 13], [C, 58, 259, 11], [C, 170, 230, 13], [C, 182, 259, 11]] },
  coude: { nom: 'le coude', zones: [[C, 63, 244, 9], [C, 177, 244, 9]] },
  poignet: { nom: 'le poignet', zones: [[C, 54, 267, 7], [C, 186, 267, 7]] },
  main: { nom: 'la main', zones: [[C, 53, 280, 13], [C, 187, 280, 13]] },
  ventre: { nom: 'le ventre', zones: [[C, 120, 245, 24]] },
  cuisse: { nom: 'la cuisse', zones: [[C, 102, 285, 11], [C, 138, 285, 11]] },
  jambe: { nom: 'la jambe', zones: [[C, 104, 312, 13], [C, 103, 338, 11], [C, 136, 312, 13], [C, 137, 338, 11]] },
  genou: { nom: 'le genou', zones: [[C, 103, 322, 9], [C, 137, 322, 9]] },
  cheville: { nom: 'la cheville', zones: [[C, 102, 356, 7], [C, 138, 356, 7]] },
  pied: { nom: 'le pied', zones: [[C, 100, 368, 14], [C, 140, 368, 14]] },
};
const BASE = ['tete', 'oeil', 'nez', 'bouche', 'oreille', 'cou', 'epaule', 'bras', 'main', 'ventre', 'jambe', 'genou', 'pied'];
const SENS = [
  ['oeil', 'Avec quoi regardes-tu ?'], ['oreille', 'Avec quoi entends-tu la musique ?'], ['nez', 'Avec quoi sens-tu les fleurs ?'],
  ['bouche', 'Avec quoi manges-tu ?'], ['main', 'Avec quoi attrapes-tu un ballon ?'], ['pied', 'Avec quoi tapes-tu dans un ballon ?'],
];
export const TOUCHER_AU_DEBUT = 3; // 7 ans et moins : les 3 premières questions, on touche le patient ; ensuite, de la culture

// reglage : { age } ; numero : la place de la question dans la partie (0 à 9)
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const niv = niveau(age);
  const parmi = (l) => l[Math.floor(aleatoire() * l.length)];
  if (niv === 1 && numero < TOUCHER_AU_DEBUT) {
    if (aleatoire() < 0.3) {
      const [cible, texte] = parmi(SENS);
      return { mode: 'toucher', texte, titre: texte, consigne: `${texte} Montre sur le patient.`, reponse: cible, solution: `C'est ${PARTIES[cible].nom}, ici !` };
    }
    const cible = parmi(BASE), nom = PARTIES[cible].nom;
    return { mode: 'toucher', texte: `Touche ${nom}`, titre: `Touche ${nom}`, consigne: `Touche ${nom} du patient.`, reponse: cible, solution: `${nom[0].toUpperCase()}${nom.slice(1)}, c'est ici !` };
  }
  const [texte, bonne, autres, savaisTu] = parmiLesNouveaux(niv === 1 ? FACILES : DIFFICILES, (q) => q[0], vus, aleatoire);
  return { mode: 'choix', texte, titre: texte, consigne: texte, reponse: bonne, choix: melanger([bonne, ...autres], aleatoire), solution: `La bonne réponse : ${bonne}.`, savaisTu };
}

// Une zone [partie, x, y, r] placée dans le dessin final (viewBox 0 0 240 390), selon les proportions de l'âge.
export function versDessin([partie, x, y, r], age) {
  const p = proportions(age), pieds = 196 + 182 * p.corps;
  const [X, Y, R] = partie === T ? [120 + (x - 120) * p.tete, 196 + (y - 196) * p.tete, r * p.tete] : [x, 196 + (y - 196) * p.corps, r];
  return [120 + (X - 120) * p.taille, 378 + (Y - pieds) * p.taille, R * p.taille];
}

const dedans = (zone, x, y, age, marge = 0) => { const [cx, cy, r] = versDessin(zone, age); return Math.hypot(x - cx, y - cy) <= r + marge; };

// Le doigt est-il sur cette partie ? (un peu de marge : les doigts sont gros)
export const touche = (partie, x, y, age) => PARTIES[partie].zones.some((z) => dedans(z, x, y, age, 6));

// La partie la plus précise sous le doigt (le nez plutôt que la tête), ou null à côté du patient.
export function partieTouchee(x, y, age) {
  let meilleure = null, rayon = Infinity;
  for (const [id, { zones }] of Object.entries(PARTIES)) for (const z of zones) if (z[3] < rayon && dedans(z, x, y, age)) [meilleure, rayon] = [id, z[3]];
  return meilleure;
}

// Des cercles pour montrer une partie (classe : 'juste' ou 'faux')
export const marques = (partie, classe, age) => PARTIES[partie].zones.map((z) => {
  const [cx, cy, r] = versDessin(z, age);
  return `<circle class="marque ${classe}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(r, 9).toFixed(1)}"/>`;
}).join('');

// La docteure : un avatar avec un stéthoscope autour du cou.
export function docteure(avatar, age) {
  const p = proportions(age), pieds = 196 + 182 * p.corps;
  const stetho = `<g transform="translate(120 378) scale(${p.taille}) translate(-120 ${-pieds}) translate(0 196) scale(1 ${p.corps}) translate(0 -196)">
    <path d="M102 202 Q100 230 116 244 M138 202 Q140 230 124 244 M116 244 Q120 248 124 244" fill="none" stroke="#3a3f4a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M124 244 Q138 256 136 268" fill="none" stroke="#3a3f4a" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="136" cy="272" r="7" fill="#c9ced6" stroke="#3a3f4a" stroke-width="3"/></g>`;
  return dessinerAvatar(avatar, 'entier', age).replace(/<\/svg>\s*$/, `${stetho}</svg>`);
}

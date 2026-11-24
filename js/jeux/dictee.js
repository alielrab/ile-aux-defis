// La dictée magique (dans la bibliothèque) : on entend un mot, on l'écrit en touchant ses lettres dans l'ordre.
// L'image du mot reste cachée jusqu'à la fin : c'est l'oreille qui travaille. Les mots sont ceux de la chasse aux syllabes.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';
import { MOTS_FACILES, MOTS_DIFFICILES } from './syllabes-mots.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('dictee', age);

const sansTirets = (m) => m[0].replaceAll('-', '');
// 7 ans et moins : des mots courts. Dès 8 ans : des mots plus longs.
export const MOTS_PETITS = MOTS_FACILES.filter((m) => sansTirets(m).length <= 6);
export const MOTS_GRANDS = [...MOTS_FACILES.filter((m) => sansTirets(m).length >= 6), ...MOTS_DIFFICILES.filter((m) => sansTirets(m).length <= 9)];

// Des lettres qu'on confond : les accents, et les sons ou les formes proches
const PROCHES = { e: 'éè', é: 'eè', è: 'eé', ê: 'eè', a: 'àâ', â: 'a', à: 'a', o: 'ôu', ô: 'o', u: 'ûo', i: 'îy', î: 'i', c: 'sk', s: 'cz', k: 'cq', q: 'kp', b: 'dp', d: 'bt', p: 'bq', t: 'd', m: 'n', n: 'm', f: 'v', v: 'f', g: 'j', j: 'g', l: 'r', r: 'l', ç: 'cs', z: 's' };
const ALPHABET = [...'abcdefghijlmnoprstuv'];

// reglage : { age } ; vus : les mots déjà dictés (on prend d'abord ceux qui ne l'ont pas encore été)
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const petits = age <= 7;
  const m = parmiLesNouveaux(petits ? MOTS_PETITS : MOTS_GRANDS, sansTirets, vus, aleatoire);
  const mot = sansTirets(m), lettres = [...mot];
  // en plus des bonnes lettres : 1 lettre au hasard (petits), ou 3 lettres qui se confondent avec celles du mot (grands)
  const pieges = petits ? [] : melanger(lettres.flatMap((l) => [...(PROCHES[l] ?? '')]), aleatoire);
  const intrus = [...new Set([...pieges, ...melanger(ALPHABET, aleatoire)])].filter((l) => !lettres.includes(l)).slice(0, petits ? 1 : 3);
  return {
    mode: 'syllabes', texte: mot, titre: 'Écris le mot que tu entends !', reponse: mot, syllabes: lettres, image: m[1], cache: '👂', colonnes: 4, savaisTu: m[2],
    consigne: `Écris le mot : ${mot}.`,
    tuiles: melanger([...lettres, ...intrus], aleatoire),
    trouve: `${mot[0].toUpperCase()}${mot.slice(1)} !`,
    solution: '', // le mot est déjà écrit et lu à voix haute
  };
}

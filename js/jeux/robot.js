// L'atelier des robots (île des créateurs) : programmer un robot avec des flèches pour qu'il rejoigne l'étoile.
// On prépare tout le chemin d'abord, puis on lance : c'est le début de la programmation.
import { etoilesDuJeu } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('robot', age);

export const FLECHES = { haut: [0, -1, '⬆️'], droite: [1, 0, '➡️'], bas: [0, 1, '⬇️'], gauche: [-1, 0, '⬅️'] };
export const PROGRAMME_MAX = 12; // au plus 12 flèches

const cle = ([x, y]) => `${x},${y}`;
const libre = (n, x, y) => x >= 0 && y >= 0 && x < n.taille && y < n.taille && !n.rochers.some((r) => r[0] === x && r[1] === y);

// Le robot suit le programme, flèche après flèche. Il s'arrête s'il se cogne (bord ou rocher) ou s'il arrive sur l'étoile.
// Renvoie { chemin : les cases traversées, cogne : le numéro de la flèche qui bloque (ou -1), gagne }
export function executer(n, programme) {
  let [x, y] = n.depart;
  const chemin = [[x, y]];
  for (const [i, f] of programme.entries()) {
    const [dx, dy] = FLECHES[f];
    if (!libre(n, x + dx, y + dy)) return { chemin, cogne: i, gagne: false };
    chemin.push([x += dx, y += dy]);
    if (x === n.but[0] && y === n.but[1]) return { chemin, cogne: -1, gagne: true };
  }
  return { chemin, cogne: -1, gagne: false };
}

// Le plus court chemin (en nombre de flèches) du départ à l'étoile, ou null s'il n'y en a pas
export function plusCourt(n) {
  const vus = new Map([[cle(n.depart), []]]), file = [n.depart];
  while (file.length) {
    const [x, y] = file.shift(), p = vus.get(cle([x, y]));
    if (x === n.but[0] && y === n.but[1]) return p;
    for (const [f, [dx, dy]] of Object.entries(FLECHES)) {
      const s = [x + dx, y + dy];
      if (libre(n, ...s) && !vus.has(cle(s))) { vus.set(cle(s), [...p, f]); file.push(s); }
    }
  }
  return null;
}

// Un niveau au hasard. Les niveaux grandissent avec le numéro de la question.
// 7 ans et moins : grille de 4, chemins de 2 à 6 flèches. Dès 8 ans : grille de 5, plus de rochers, chemins de 4 à 9 flèches.
export function question({ age }, aleatoire = Math.random, numero = 0) {
  const petits = age <= 7, taille = petits ? 4 : 5;
  const min = (petits ? 2 : 4) + Math.floor(numero / 3), max = min + (petits ? 2 : 3);
  const hasard = () => [Math.floor(aleatoire() * taille), Math.floor(aleatoire() * taille)];
  for (let essai = 0; ; essai++) {
    const depart = hasard(), but = hasard();
    const nbRochers = (petits ? 2 : 4) + Math.floor(numero / 4);
    const rochers = [];
    while (rochers.length < nbRochers) {
      const r = hasard();
      if (![depart, but, ...rochers].some((c) => cle(c) === cle(r))) rochers.push(r);
    }
    const n = { taille, depart, but, rochers }, chemin = plusCourt(n);
    // après beaucoup d'essais sans trouver la bonne longueur, on accepte tout niveau faisable
    if (chemin && chemin.length >= 1 && ((chemin.length >= min && chemin.length <= max) || essai > 300)) {
      const titre = 'Guide le robot jusqu’à l’étoile !';
      return { mode: 'robot', ...n, texte: `${cle(depart)}>${cle(but)}|${rochers.map(cle).join(';')}`, titre, reponse: 'ok', pas: chemin.length, trouve: 'Le robot est arrivé à l’étoile !',
        consigne: `${titre} Touche les flèches pour préparer son chemin, puis touche Lancer.`, solution: '' };
    }
  }
}

// Le labyrinthe (île de la nature) : trouver la sortie, case après case.
// Chaque labyrinthe est tiré au hasard et n'a qu'un seul chemin entre deux cases (pas de boucle).
import { melanger, etoilesDuJeu } from '../partie.js';

export const etoilesParLabyrinthe = (age) => etoilesDuJeu('labyrinthe', age);
export const DIRECTIONS = { haut: [0, -1], droite: [1, 0], bas: [0, 1], gauche: [-1, 0] };
const CONTRAIRE = { haut: 'bas', bas: 'haut', gauche: 'droite', droite: 'gauche' };

// 7 ans et moins : 5 cases de côté, puis 6. Dès 8 ans : 7, puis 8, puis 9. niveau : le nombre de labyrinthes déjà réussis.
export const taille = (age, niveau = 0) => (age <= 7 ? Math.min(5 + Math.floor(niveau / 2), 6) : Math.min(7 + Math.floor(niveau / 2), 9));

// Un labyrinthe : { taille, ouvert : pour chaque case (y * taille + x), les directions où l'on peut aller }, départ en haut à gauche, sortie en bas à droite
export function creer(n, aleatoire = Math.random) {
  const ouvert = Array.from({ length: n * n }, () => []), vues = new Set([0]), pile = [[0, 0]];
  while (pile.length) {
    const [x, y] = pile.at(-1);
    const voisins = melanger(Object.entries(DIRECTIONS), aleatoire).map(([d, [dx, dy]]) => [d, x + dx, y + dy]).filter(([, a, b]) => a >= 0 && b >= 0 && a < n && b < n && !vues.has(b * n + a));
    if (!voisins.length) { pile.pop(); continue; }
    const [d, a, b] = voisins[0];
    ouvert[y * n + x].push(d);
    ouvert[b * n + a].push(CONTRAIRE[d]);
    vues.add(b * n + a);
    pile.push([a, b]);
  }
  return { taille: n, ouvert, depart: [0, 0], sortie: [n - 1, n - 1] };
}

// Un pas dans une direction : la nouvelle case, ou la même s'il y a un mur
export function avancer(l, [x, y], direction) {
  if (!l.ouvert[y * l.taille + x].includes(direction)) return [x, y];
  const [dx, dy] = DIRECTIONS[direction];
  return [x + dx, y + dy];
}

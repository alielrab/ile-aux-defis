// L'atelier d'écriture (dans la bibliothèque) : tracer les lettres majuscules au doigt, trait après trait, dans le bon sens.
// Chaque lettre : ses traits, dans l'ordre ; chaque trait : des points [x, y] dans un carré de 100 (le doigt part du premier point).
import { etoilesDuJeu } from '../partie.js';

export const etoilesParLettre = (age) => etoilesDuJeu('ecriture', age);

const O = [[50, 0], [25, 8], [10, 30], [10, 70], [25, 92], [50, 100], [75, 92], [90, 70], [90, 30], [75, 8], [50, 0]];
const P = [[[15, 0], [15, 100]], [[15, 0], [62, 0], [82, 12], [82, 40], [62, 52], [15, 52]]];
export const LETTRES = {
  A: [[[10, 100], [50, 0], [90, 100]], [[28, 62], [72, 62]]],
  B: [[[15, 0], [15, 100]], [[15, 0], [60, 0], [78, 12], [78, 36], [60, 48], [15, 48]], [[15, 48], [65, 48], [85, 62], [85, 86], [65, 100], [15, 100]]],
  C: [[[85, 20], [65, 3], [40, 0], [18, 15], [10, 50], [18, 85], [40, 100], [65, 97], [85, 80]]],
  D: [[[15, 0], [15, 100]], [[15, 0], [50, 0], [78, 18], [88, 50], [78, 82], [50, 100], [15, 100]]],
  E: [[[80, 0], [15, 0], [15, 100], [80, 100]], [[15, 50], [65, 50]]],
  F: [[[80, 0], [15, 0], [15, 100]], [[15, 50], [65, 50]]],
  G: [[[85, 20], [65, 3], [40, 0], [18, 15], [10, 50], [18, 85], [40, 100], [65, 97], [85, 80], [85, 55], [55, 55]]],
  H: [[[15, 0], [15, 100]], [[85, 0], [85, 100]], [[15, 50], [85, 50]]],
  I: [[[50, 0], [50, 100]]],
  J: [[[70, 0], [70, 75], [58, 95], [40, 100], [22, 92], [15, 75]]],
  K: [[[15, 0], [15, 100]], [[80, 0], [15, 55]], [[38, 38], [85, 100]]],
  L: [[[15, 0], [15, 100], [80, 100]]],
  M: [[[10, 100], [10, 0], [50, 60], [90, 0], [90, 100]]],
  N: [[[15, 100], [15, 0], [85, 100], [85, 0]]],
  O: [O],
  P,
  Q: [O, [[60, 70], [92, 102]]],
  R: [...P, [[45, 52], [85, 100]]],
  S: [[[82, 15], [62, 2], [38, 0], [18, 12], [18, 35], [38, 48], [62, 54], [82, 66], [82, 88], [62, 100], [38, 98], [15, 85]]],
  T: [[[10, 0], [90, 0]], [[50, 0], [50, 100]]],
  U: [[[15, 0], [15, 70], [28, 92], [50, 100], [72, 92], [85, 70], [85, 0]]],
  V: [[[10, 0], [50, 100], [90, 0]]],
  W: [[[5, 0], [28, 100], [50, 35], [72, 100], [95, 0]]],
  X: [[[12, 0], [88, 100]], [[88, 0], [12, 100]]],
  Y: [[[10, 0], [50, 50], [90, 0]], [[50, 50], [50, 100]]],
  Z: [[[12, 0], [88, 0], [12, 100], [88, 100]]],
};
// 7 ans et moins : d'abord les lettres aux traits droits
export const FACILES = [...'ILTHEFVXAZNMK'];
export const alphabet = (age) => (age <= 7 ? [...FACILES, ...Object.keys(LETTRES).filter((l) => !FACILES.includes(l))] : Object.keys(LETTRES));

const PAS = 9; // un repère tous les 9 (sur 100) le long du trait
// Les repères d'un trait : des points rapprochés, à suivre dans l'ordre
export function reperes(trait) {
  const r = [trait[0]];
  for (let i = 1; i < trait.length; i++) {
    const [ax, ay] = trait[i - 1], [bx, by] = trait[i], n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / PAS));
    for (let k = 1; k <= n; k++) r.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  return r;
}

// Le doigt est en (x, y) : il valide le repère suivant s'il est assez près (tolérance). Renvoie le nouveau numéro de repère.
export const TOLERANCE = 16;
export function suivre(points, fait, x, y) {
  while (fait < points.length && Math.hypot(points[fait][0] - x, points[fait][1] - y) <= TOLERANCE) fait++;
  return fait;
}

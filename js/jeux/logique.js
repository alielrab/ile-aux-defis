// La tour des énigmes, suite : sudoku, taquin, parking bloqué, code des couleurs, tour à déplacer, dessins cachés, déduction.
// Seulement les règles et les niveaux : rien ici ne touche à l'écran. Un niveau est le même pour tout le monde (hasard à graine fixe).
import { melanger } from '../partie.js';

function hasardDe(graine) {
  let x = graine % 2147483647 || 1;
  return () => ((x = (x * 48271) % 2147483647) - 1) / 2147483646;
}
const serie = (age) => (age <= 7 ? 'petits' : 'grands');
const graineDe = (jeu, n, age) => hasardDe((n + 1) * 7919 + jeu.length * 1000003 + jeu.charCodeAt(0) * 4099 + (age <= 7 ? 0 : 500000));

// Les jeux : [nom, ce qu'il faut faire, âge minimum, nombre de niveaux]
export const JEUX_LOGIQUE = {
  sudoku: ['Le sudoku', 'Chaque image une seule fois par ligne, par colonne et par carré', 0, 18],
  taquin: ['Le taquin', 'Fais glisser les cases pour refaire l’image', 0, 16],
  parking: ['Le parking bloqué', 'Déplace les véhicules pour faire sortir la voiture rouge', 0, 16],
  tour: ['La tour à déplacer', 'Déplace toute la tour, sans jamais poser un grand disque sur un petit', 8, 6],
  code: ['Le code des couleurs', 'Devine la suite de couleurs cachée', 8, 11],
  dessins: ['Les dessins cachés', 'Colorie les bonnes cases grâce aux nombres', 8, 18],
  deduction: ['Les énigmes de déduction', 'Lis les indices et trouve qui a quel animal', 8, 18],
};
export const jeuxPourAge = (age) => Object.keys(JEUX_LOGIQUE).filter((j) => age >= JEUX_LOGIQUE[j][2]);

// Les niveaux se débloquent un par un. Chaque âge (7 ans et moins, 8 ans et plus) a sa série.
export const ETOILES_NIVEAU = 2; // la première fois qu'on réussit un niveau
export const niveauxFaits = (profil, jeu) => profil.niveaux?.[`${jeu}:${serie(profil.age)}`] ?? 0;
export function terminerNiveau(profil, jeu, n) {
  const faits = niveauxFaits(profil, jeu);
  if (n > faits || n >= JEUX_LOGIQUE[jeu][3]) throw new Error('Ce niveau n’est pas encore ouvert.');
  if (n < faits) return 0;
  profil.niveaux = { ...profil.niveaux, [`${jeu}:${serie(profil.age)}`]: faits + 1 };
  profil.etoiles += ETOILES_NIVEAU;
  return ETOILES_NIVEAU;
}

// ——— Sudoku. Une grille : des lignes de nombres de 0 à taille-1, ou null pour une case vide. Les carrés font hauteur x largeur cases.
const VIDES_SUDOKU = { petits: [...[4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10].map((v) => [4, v]), ...[8, 10, 12, 14, 16, 18].map((v) => [6, v])], grands: [[4, 7], [4, 9], [4, 10], [6, 10], [6, 12], [6, 14], [6, 16], [6, 18], [6, 19], [6, 20], [6, 21], [6, 22], [9, 30], [9, 34], [9, 38], [9, 42], [9, 45], [9, 48]] }; // les derniers niveaux : une grille plus grande (6x6 pour les petits, 9x9 pour les grands)
const carre = (taille) => ({ 4: [2, 2], 6: [2, 3], 9: [3, 3] })[taille];
function permis(g, r, c, v) {
  const t = g.length, [h, l] = carre(t), r0 = r - (r % h), c0 = c - (c % l);
  for (let i = 0; i < t; i++) if (g[r][i] === v || g[i][c] === v) return false;
  for (let i = 0; i < h; i++) for (let j = 0; j < l; j++) if (g[r0 + i][c0 + j] === v) return false;
  return true;
}
// Combien de façons de finir la grille (on s'arrête à « max »). ordre : dans quel ordre essayer les nombres.
function solutions(g, max = 2, ordre = g.map((_, i) => i)) {
  for (let r = 0; r < g.length; r++) for (let c = 0; c < g.length; c++) {
    if (g[r][c] !== null) continue;
    let n = 0;
    for (const v of ordre) {
      if (!permis(g, r, c, v)) continue;
      g[r][c] = v;
      n += solutions(g, max - n, ordre);
      if (n >= max) break; // on garde la grille remplie : c'est comme ça qu'on fabrique une solution
      g[r][c] = null;
    }
    return n;
  }
  return 1;
}
export function sudokuDuNiveau(n, age) {
  const [taille, vides] = VIDES_SUDOKU[serie(age)][n], aleatoire = graineDe('sudoku', n, age);
  const solution = Array.from({ length: taille }, () => Array(taille).fill(null));
  solutions(solution, 1, melanger(solution.map((_, i) => i), aleatoire));
  const depart = solution.map((l) => [...l]);
  let enleves = 0;
  for (const i of melanger(Array.from({ length: taille * taille }, (_, k) => k), aleatoire)) { // on vide des cases tant qu'il reste une seule solution
    if (enleves >= vides) break;
    const r = Math.floor(i / taille), c = i % taille, v = depart[r][c];
    depart[r][c] = null;
    if (solutions(depart.map((l) => [...l])) === 1) enleves++; else depart[r][c] = v;
  }
  return { taille, carre: carre(taille), solution, depart, images: taille === 4 };
}
export const sudokuUnique = (depart) => solutions(depart.map((l) => [...l])) === 1;

// ——— Taquin. Les cases : une liste, la case n°i doit finir à la place i ; la dernière (cote*cote - 1) est le trou.
const TAQUINS = { petits: [...[4, 6, 8, 10, 12, 15, 18, 22, 26, 30, 35, 40].map((m) => [3, m]), [4, 15], [4, 25], [4, 35], [4, 50]], grands: [[3, 20], [3, 30], [3, 40], [3, 50], [3, 60], [3, 80], [4, 20], [4, 30], [4, 40], [4, 55], [4, 70], [4, 90], [5, 30], [5, 50], [5, 80], [5, 120]] }; // les derniers niveaux : une image plus grande (4x4 pour les petits, 5x5 pour les grands)
export const taquinRange = (cases) => cases.every((v, i) => v === i);
// Faire glisser la case de la place i vers le trou, s'il est juste à côté. Renvoie les nouvelles cases, ou null.
export function glisser(cases, i) {
  const cote = Math.sqrt(cases.length), trou = cases.indexOf(cases.length - 1);
  const voisins = Math.abs(i - trou) === cote || (Math.abs(i - trou) === 1 && Math.floor(i / cote) === Math.floor(trou / cote));
  if (!voisins) return null;
  const s = [...cases];
  [s[i], s[trou]] = [s[trou], s[i]];
  return s;
}
export function taquinDuNiveau(n, age) {
  const [cote, coups] = TAQUINS[serie(age)][n], aleatoire = graineDe('taquin', n, age);
  let cases = Array.from({ length: cote * cote }, (_, i) => i), avant = -1;
  for (let k = 0; k < coups || taquinRange(cases); k++) { // on mélange en jouant à l'envers : le niveau est toujours faisable
    const trou = cases.indexOf(cases.length - 1);
    const possibles = cases.map((_, i) => i).filter((i) => i !== avant && glisser(cases, i));
    const i = possibles[Math.floor(aleatoire() * possibles.length)];
    cases = glisser(cases, i);
    avant = trou;
  }
  return { cote, cases };
}

// ——— Parking bloqué, sur 6 x 6 cases. Un véhicule : [ligne, colonne, longueur, 'h' (couché) ou 'v' (debout)].
// Le premier est la voiture rouge, sur la 3e ligne : elle doit atteindre le bord droit.
export const COTE_PARKING = 6;
const casesDe = ([r, c, l, d]) => Array.from({ length: l }, (_, i) => (d === 'h' ? r * COTE_PARKING + c + i : (r + i) * COTE_PARKING + c));
// Avancer le véhicule i d'une case (pas = 1 : vers la droite ou le bas ; -1 : vers la gauche ou le haut). Renvoie le nouveau parking, ou null.
export function deplacer(vehicules, i, pas) {
  const [r, c, l, d] = vehicules[i], apres = d === 'h' ? [r, c + pas, l, d] : [r + pas, c, l, d];
  if (apres[0] < 0 || apres[1] < 0 || (d === 'h' ? apres[1] + l : apres[0] + l) > COTE_PARKING) return null;
  const prises = new Set(vehicules.flatMap((v, j) => (j === i ? [] : casesDe(v))));
  if (casesDe(apres).some((x) => prises.has(x))) return null;
  return vehicules.map((v, j) => (j === i ? apres : v));
}
export const parkingLibre = (vehicules) => vehicules[0][1] + vehicules[0][2] === COTE_PARKING;
// Le plus petit nombre de glissades pour sortir (une glissade : un véhicule avance d'autant de cases qu'on veut). null si c'est impossible.
export function glissadesMin(depart, limite = 40000) {
  const cle = (v) => v.map((x) => x[0] * 6 + x[1]).join(','), vus = new Set([cle(depart)]);
  let vague = [depart];
  for (let n = 0; vague.length && vus.size < limite; n++) {
    const suivante = [];
    for (const v of vague) {
      if (parkingLibre(v)) return n;
      for (let i = 0; i < v.length; i++) for (const pas of [-1, 1]) for (let s = deplacer(v, i, pas); s; s = deplacer(s, i, pas)) {
        const k = cle(s);
        if (!vus.has(k)) { vus.add(k); suivante.push(s); }
      }
    }
    vague = suivante;
  }
  return null;
}
// Les niveaux, cherchés une fois pour toutes par un petit programme (les tests revérifient chacun avec glissadesMin) : de plus en plus de glissades. « ligne colonne longueur sens » par véhicule.
const PARKINGS = {
  petits: ['212h 302h 342v 142v 512h 452v', '202h 422h 113h 513h 312v 142v 322h 303v 052v 542h', '212h 233v 532h 132h 303h 412v', '212h 332v 402v 323v 252v 133h 412v 442h 532h', '202h 413h 312h 113h 232v 242v 452v 042v 513h 013h', '202h 422h 512h 153v 113h 533h 002v 323h 402h 012h',
    '202h 242v 302h 012h 332v 442v 323v 032v 253v 122v', '212h 053v 102h 423h 312h 133v 143v', '202h 122h 142v 152v 342v 223v 303v 532h 233v 003h', '212h 142v 202v 022h 442h 333v 053v 112h', '202h 332v 142h 242v 122h 022h 313v 452v 302v 002v 042h 252v', '202h 012h 302h 512h 143v 232v 542h 253v 032h 402v',
    '202h 022h 153v 332v 442h 422v 532h 042v 132v 242v 102h', '202h 423h 032h 303v 022v 312v 222v 132v 053v', '202h 152v 123v 302h 242v 452v 102h 232v 002h 532h 502h 423h', '202h 122h 013h 432h 352v 303h 533h 422v 043v'],
  grands: ['202h 132h 122v 542h 332h 502h 002v 042h 422v 433h 252v 012v', '202h 252v 243v 013h 312h 532h 102h 512h', '212h 253v 313v 542h 232v 032h 422h 122h', '202h 132v 542h 032h 522h 332h 002h 302h 402h 442h 153v 022v', '202h 132v 332h 122v 542h 503h 432h 012v 412h 042h 142v 152v', '212h 303h 522h 133h 402h 242v 442h 332v 022h 003v 042h 502h',
    '212h 322v 512h 332h 433h 022h 542h 252v 043v', '202h 322h 143v 432v 022h 402v 042h 442h 112h 422v 152v 132v', '202h 442v 402h 232v 033h 132h 512h 023v 312h 002v 012v 422h', '202h 342v 002v 132v 322h 023v 302h 152v 413h 522h 012v 452v', '202h 402v 233v 322v 043v 302h 513h 452v 122v 252v 032v', '202h 032h 532h 232v 142v 003h 252v 422v 112h 452v 302v 432h',
    '202h 512h 412h 042h 402v 242v 023v 442v 033v', '202h 042v 052v 402v 442h 242v 302h 033v 003h 322h 542h 122v', '202h 432h 322v 342h 452v 003h 232v 412v 122v 522h 042v', '202h 142h 022h 413h 302v 042h 322h 012v 122v 343v 502h'],
};
export const parkingDuNiveau = (n, age) => PARKINGS[serie(age)][n].split(' ').map((t) => [Number(t[0]), Number(t[1]), Number(t[2]), t[3]]);

// ——— Le code des couleurs : une suite de couleurs cachée. Une couleur peut revenir plusieurs fois : c'est voulu (plus de réflexion), et la consigne le dit. [longueur, nombre de couleurs, essais]
export const CODES = [[3, 3, 8], [3, 4, 8], [3, 5, 8], [4, 4, 8], [4, 5, 9], [4, 6, 10], [5, 5, 10], [5, 6, 12], [6, 5, 12], [6, 6, 12], [6, 6, 10]];
export const nouveauCode = (n, aleatoire = Math.random) => Array.from({ length: CODES[n][0] }, () => Math.floor(aleatoire() * CODES[n][1]));
// [bien placées, bonnes couleurs mais mal placées]
export function indicesCode(secret, essai) {
  const bien = secret.filter((c, i) => essai[i] === c).length;
  const communes = [...new Set(secret)].reduce((n, c) => n + Math.min(secret.filter((x) => x === c).length, essai.filter((x) => x === c).length), 0);
  return [bien, communes - bien];
}

// ——— La tour à déplacer : trois piquets, des disques de tailles différentes (le plus grand nombre = le plus grand disque, en bas).
export const TOURS = [3, 4, 5, 6, 7, 8]; // nombre de disques
export const tourDuNiveau = (n) => [Array.from({ length: TOURS[n] }, (_, i) => TOURS[n] - i), [], []];
export function poser(piquets, de, vers) {
  const a = piquets[de], b = piquets[vers];
  if (de === vers || !a?.length || !b || (b.length && b.at(-1) < a.at(-1))) return null;
  return piquets.map((p, i) => (i === de ? p.slice(0, -1) : i === vers ? [...p, a.at(-1)] : p));
}
export const tourFinie = (piquets) => !piquets[0].length && !piquets[1].length;
export const coupsMinTour = (n) => 2 ** TOURS[n] - 1;

// ——— Les dessins cachés : les nombres au bord disent combien de cases se suivent, coloriées, dans la ligne ou la colonne.
export const DESSINS = [
  ['un escalier', '#....', '##...', '###..', '####.', '#####'],
  ['une croix', '..#..', '..#..', '#####', '..#..', '..#..'],
  ['un diamant', '..#..', '.###.', '#####', '.###.', '..#..'],
  ['un cœur', '.#.#.', '#####', '#####', '.###.', '..#..'],
  ['un sapin', '..#..', '.###.', '.###.', '#####', '..#..'],
  ['un champignon', '.###.', '#####', '#####', '..#..', '..#..'],
  ['une maison', '..#..', '.###.', '#####', '.###.', '.#.#.'],
  ['une fusée', '..#..', '.###.', '.###.', '.###.', '#.#.#'],
  ['un bateau', '..#..', '..##.', '..#..', '#####', '.###.'],
  ['un papillon', '#...#', '##.##', '#####', '##.##', '#...#'],
  ['un sourire', '.#.#.', '.#.#.', '.....', '#...#', '.###.'],
  ['un poisson', '.##.#', '#####', '#####', '.##.#', '.....'],
  // les derniers niveaux : 7 cases de côté
  ['un arbre', '..###..', '.#####.', '#######', '.#####.', '..###..', '...#...', '..###..'],
  ['un parapluie', '..###..', '.#####.', '#######', '...#...', '...#...', '.#.#...', '.###...'],
  ['une ancre', '...#...', '..###..', '...#...', '...#...', '#..#..#', '##.#.##', '.#####.'],
  ['une fleur', '.##.##.', '#######', '.#####.', '..###..', '...#...', '.#.#.#.', '..###..'],
  ['un chat', '#.....#', '##...##', '#######', '#.###.#', '#######', '.#####.', '..#.#..'],
  ['un château', '#.#.#.#', '#######', '.#####.', '.##.##.', '.##.##.', '.#####.', '#######'],
];
// Les nombres d'une ligne de cases (vrai = coloriée) : [2, 1] pour « ##.#. ». Une ligne vide donne [0].
export function nombresDe(ligne) {
  const blocs = ligne.map((v) => (v ? '#' : '.')).join('').split('.').filter(Boolean).map((b) => b.length);
  return blocs.length ? blocs : [0];
}
export function dessinDuNiveau(n) {
  const [nom, ...lignes] = DESSINS[n], cases = lignes.map((l) => [...l].map((x) => x === '#'));
  return { nom, cases, lignes: cases.map(nombresDe), colonnes: cases[0].map((_, c) => nombresDe(cases.map((l) => l[c]))) };
}
// Réussi quand les nombres de chaque ligne et de chaque colonne sont respectés (même si le dessin est un peu différent)
export const dessinJuste = (niveau, cases) => cases.every((l, r) => String(nombresDe(l)) === String(niveau.lignes[r])) && niveau.colonnes.every((x, c) => String(nombresDe(cases.map((l) => l[c]))) === String(x));

// ——— Déduction : chaque enfant a un animal différent. Les indices suffisent pour trouver, sans deviner.
export const ENFANTS = ['Léa', 'Tom', 'Inès', 'Noé', 'Lina'], ANIMAUX = ['chat', 'chien', 'lapin', 'poisson', 'tortue']; // les animaux : des clés d'images de l'intrus
export const ARTICLES = { chat: 'le chat', chien: 'le chien', lapin: 'le lapin', poisson: 'le poisson', tortue: 'la tortue' };
const arrangements = (n) => (n === 1 ? [[0]] : arrangements(n - 1).flatMap((p) => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)])));
// Un indice : [enfant, animal, vrai ou faux]. Les répartitions encore possibles avec ces indices :
const possibles = (n, indices) => arrangements(n).filter((p) => indices.every(([e, a, oui]) => (p[e] === a) === oui));
export function deductionDuNiveau(n) {
  const taille = n < 6 ? 3 : n < 12 ? 4 : 5, aleatoire = graineDe('deduction', n, 9);
  const solution = melanger(Array.from({ length: taille }, (_, i) => i), aleatoire); // solution[enfant] = animal
  const non = melanger(solution.flatMap((a, e) => Array.from({ length: taille }, (_, x) => x).filter((x) => x !== a).map((x) => [e, x, false])), aleatoire);
  let indices = n % 6 < 2 ? [[0, solution[0], true]] : []; // les premiers niveaux donnent une réponse pour démarrer
  for (const i of non) { if (possibles(taille, indices).length === 1) break; indices.push(i); }
  for (const i of [...indices]) { // on retire les indices qui ne servent à rien
    const sans = indices.filter((x) => x !== i);
    if (possibles(taille, sans).length === 1) indices = sans;
  }
  const texte = ([e, a, oui]) => `${ENFANTS[e]} ${oui ? 'a' : 'n’a pas'} ${ARTICLES[ANIMAUX[a]]}.`;
  return { taille, solution, indices: melanger(indices, aleatoire).map(texte), uniques: possibles(taille, indices).length === 1 };
}
// choix[enfant] = l'animal coché (ou null)
export const deductionJuste = (niveau, choix) => niveau.solution.every((a, e) => choix[e] === a);

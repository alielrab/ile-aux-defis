import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as x from '../js/jeux/logique.js';

test('niveaux : ils s’ouvrent un par un, 2 étoiles la première fois, chaque âge a sa série ; les jeux « dès 8 ans » sont cachés aux petits', () => {
  const p = { age: 6, etoiles: 0 };
  assert.throws(() => x.terminerNiveau(p, 'taquin', 1));
  assert.deepEqual([x.terminerNiveau(p, 'taquin', 0), x.terminerNiveau(p, 'taquin', 0), x.terminerNiveau(p, 'taquin', 1)], [x.ETOILES_NIVEAU, 0, x.ETOILES_NIVEAU]);
  assert.deepEqual([x.niveauxFaits(p, 'taquin'), x.niveauxFaits(p, 'sudoku'), x.niveauxFaits({ ...p, age: 9 }, 'taquin'), p.etoiles], [2, 0, 0, 2 * x.ETOILES_NIVEAU]);
  assert.deepEqual(x.jeuxPourAge(6), ['sudoku', 'taquin', 'parking']);
  assert.equal(x.jeuxPourAge(9).length, 7);
});

test('sudoku : une seule solution, le bon nombre de cases vides, des images en 4x4 et des chiffres en 6x6', () => {
  for (const age of [6, 9]) for (let n = 0; n < 12; n++) {
    const s = x.sudokuDuNiveau(n, age), vides = s.depart.flat().filter((v) => v === null).length;
    assert.ok(x.sudokuUnique(s.depart), `niveau ${n + 1}, ${age} ans`);
    assert.ok(vides >= 4 && s.depart.every((l, r) => l.every((v, c) => v === null || v === s.solution[r][c])));
    for (const l of s.solution) assert.equal(new Set(l).size, s.taille);
    assert.equal(s.images, s.taille === 4);
    assert.deepEqual(x.sudokuDuNiveau(n, age).depart, s.depart);
  }
  assert.equal(x.sudokuDuNiveau(11, 9).taille, 6);
});

test('taquin : seule une case voisine du trou glisse ; chaque niveau est mélangé et faisable', () => {
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  assert.ok(x.taquinRange(range) && x.glisser(range, 0) === null);
  assert.deepEqual(x.glisser(range, 7), [0, 1, 2, 3, 4, 5, 6, 8, 7]);
  assert.equal(x.glisser([0, 1, 2, 8, 3, 4, 5, 6, 7], 2), null); // la case au bout de la ligne du dessus n'est pas voisine
  for (const age of [6, 9]) for (let n = 0; n < 12; n++) {
    const t = x.taquinDuNiveau(n, age);
    assert.ok(!x.taquinRange(t.cases) && t.cases.length === t.cote ** 2);
    // faisable : dans un taquin, la parité des échanges suit la distance du trou à sa place
    const echanges = t.cases.reduce((s, v, i) => s + t.cases.slice(i + 1).filter((w) => w < v).length, 0), trou = t.cases.indexOf(t.cases.length - 1);
    const distance = (t.cote - 1 - Math.floor(trou / t.cote)) + (t.cote - 1 - (trou % t.cote));
    assert.equal(echanges % 2, distance % 2, `niveau ${n + 1}, ${age} ans`);
  }
});

test('parking : un véhicule ne traverse pas les autres ni les murs ; chaque niveau a une sortie, de plus en plus longue', () => {
  const p = [[2, 0, 2, 'h'], [1, 2, 3, 'v']];
  assert.equal(x.deplacer(p, 0, 1), null); // le camion bloque
  assert.equal(x.deplacer(p, 0, -1), null); // le mur
  assert.deepEqual(x.deplacer(p, 1, 1)[1], [2, 2, 3, 'v']);
  assert.equal(x.glissadesMin(p), 2);
  for (const age of [6, 9]) {
    const coups = Array.from({ length: 12 }, (_, n) => x.glissadesMin(x.parkingDuNiveau(n, age)));
    assert.ok(coups.every((c, i) => c >= 2 && (i === 0 || c >= coups[i - 1])), `${age} ans : ${coups}`);
    for (let n = 0; n < 12; n++) assert.deepEqual(x.parkingDuNiveau(n, age)[0].slice(0, 1).concat(x.parkingDuNiveau(n, age)[0].slice(2)), [2, 2, 'h']);
  }
});

test('code des couleurs : bien placées et mal placées, même avec des couleurs en double', () => {
  assert.deepEqual(x.indicesCode([0, 1, 2], [0, 1, 2]), [3, 0]);
  assert.deepEqual(x.indicesCode([0, 1, 2], [2, 0, 1]), [0, 3]);
  assert.deepEqual(x.indicesCode([0, 0, 1], [0, 1, 0]), [1, 2]);
  assert.deepEqual(x.indicesCode([0, 0, 1], [2, 2, 2]), [0, 0]);
  assert.deepEqual(x.indicesCode([1, 1, 2], [1, 3, 1]), [1, 1]);
  for (let n = 0; n < x.CODES.length; n++) { const c = x.nouveauCode(n); assert.ok(c.length === x.CODES[n][0] && c.every((v) => v >= 0 && v < x.CODES[n][1])); }
});

test('tour à déplacer : jamais un grand disque sur un petit ; finie quand tout est sur un autre piquet', () => {
  let t = x.tourDuNiveau(0);
  assert.deepEqual(t, [[3, 2, 1], [], []]);
  t = x.poser(t, 0, 1);
  assert.equal(x.poser(t, 0, 1), null); // le 2 sur le 1
  assert.equal(x.poser(t, 2, 0), null); // un piquet vide
  assert.ok(!x.tourFinie(t) && x.tourFinie([[], [], [3, 2, 1]]));
  assert.equal(x.coupsMinTour(0), 7);
});

test('dessins cachés : les nombres du bord ; le dessin attendu est accepté, une grille vide non', () => {
  assert.deepEqual(x.nombresDe([true, true, false, true, false]), [2, 1]);
  assert.deepEqual(x.nombresDe([false, false]), [0]);
  for (let n = 0; n < x.DESSINS.length; n++) {
    const d = x.dessinDuNiveau(n);
    assert.ok(d.cases.length === 5 && d.cases.every((l) => l.length === 5), d.nom);
    assert.ok(x.dessinJuste(d, d.cases) && !x.dessinJuste(d, d.cases.map((l) => l.map(() => false))), d.nom);
  }
  assert.equal(new Set(x.DESSINS.map((d) => d[0])).size, x.JEUX_LOGIQUE.dessins[3]);
});

test('déduction : les indices donnent une seule réponse, et pas tous la réponse toute faite', () => {
  for (let n = 0; n < 12; n++) {
    const d = x.deductionDuNiveau(n);
    assert.ok(d.uniques && d.indices.length >= 2, `niveau ${n + 1}`);
    assert.ok(d.indices.filter((i) => !i.includes('n’a pas')).length <= 1, `niveau ${n + 1} : ${d.indices}`);
    assert.ok(x.deductionJuste(d, d.solution) && !x.deductionJuste(d, [...d.solution].reverse()));
    assert.equal(d.taille, n < 6 ? 3 : 4);
  }
});

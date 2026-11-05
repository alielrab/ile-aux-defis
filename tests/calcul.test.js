import { test } from 'node:test';
import assert from 'node:assert/strict';
import { question, palier, etoilesParBonneReponse, illustration, OPERATIONS } from '../js/jeux/calcul.js';
import { graine } from './hasard.js';

const echantillon = (operation, age, n = 400) => {
  const h = graine(age * 7 + operation.length);
  return Array.from({ length: n }, () => question({ operation, age }, h));
};
const termes = (q) => q.texte.split(/ [+−×÷] /).map(Number);

test('paliers d’âge', () => {
  assert.deepEqual([4, 6, 7, 8, 9, 12].map(palier), [1, 1, 2, 2, 3, 3]);
});

test('toutes les opérations : bonne réponse juste, choix distincts et positifs', () => {
  for (const op in OPERATIONS) for (const age of [6, 7, 9]) for (const q of echantillon(op, age)) {
    const [a, b] = termes(q);
    const attendu = { addition: a + b, soustraction: a - b, multiplication: a * b, division: a / b }[op];
    assert.equal(q.reponse, attendu, q.texte);
    assert.ok(Number.isInteger(q.reponse) && q.reponse >= 0, q.texte);
    assert.equal(q.choix.length, age <= 6 ? 3 : 4);
    assert.equal(new Set(q.choix).size, q.choix.length);
    assert.ok(q.choix.includes(q.reponse) && q.choix.every((c) => c >= 0));
  }
});

test('6 ans : petits nombres et des images ; 9 ans : nombres plus grands, sans images', () => {
  for (const op in OPERATIONS) {
    for (const q of echantillon(op, 6)) {
      const [a, b] = termes(q);
      assert.ok(q.aide, q.texte);
      assert.ok(Math.max(a, q.reponse) <= 20, q.texte); // au plus 20 objets à dessiner
      if (op === 'division') assert.ok([2, 3, 4, 5].includes(b) && a <= 20, q.texte);
      assert.ok(illustration(q.aide).length > 0);
    }
    const grands = echantillon(op, 9);
    assert.ok(grands.every((q) => !q.aide));
    assert.ok(Math.max(...grands.map((q) => Math.max(...termes(q), q.reponse))) > 20, op);
  }
});

test('divisions toujours exactes, soustractions jamais négatives', () => {
  for (const age of [6, 8, 10]) {
    for (const q of echantillon('division', age)) assert.equal(termes(q)[0] % termes(q)[1], 0);
    for (const q of echantillon('soustraction', age)) assert.ok(q.reponse >= 1);
  }
});

test('étoiles par bonne réponse : les valeurs du réglage', () => {
  assert.deepEqual(Object.keys(OPERATIONS).map((op) => etoilesParBonneReponse(6, op)), [1, 1.5, 2, 2]);
  assert.deepEqual(Object.keys(OPERATIONS).map((op) => etoilesParBonneReponse(9, op)), [0.5, 0.5, 1, 1]);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choixAutour, nouvellePartie, repondre, terminee, etoilesGagnees, questionEnCours, formatEtoiles } from '../js/partie.js';
import { graine } from './hasard.js';


test('étoiles : 1 par bonne réponse, +2 si 10/10', () => {
  assert.equal(etoilesGagnees(0), 0);
  assert.equal(etoilesGagnees(7), 7);
  assert.equal(etoilesGagnees(9), 9);
  assert.equal(etoilesGagnees(10), 12);
  assert.equal(etoilesGagnees(7, 0.5), 3.5);
  assert.equal(etoilesGagnees(10, 1.5), 17);
  assert.equal(etoilesGagnees(3, 2), 6);
  assert.equal(formatEtoiles(3.5), '3,5');
  assert.equal(formatEtoiles(12), '12');
});

test('choixAutour : n choix distincts dans les bornes, avec la réponse', () => {
  const h = graine(1);
  for (let r = 0; r <= 10; r++) {
    const c = choixAutour(r, [r - 1, r + 1, r - 2, r + 2], 3, h, 0, 10);
    assert.equal(c.length, 3);
    assert.equal(new Set(c).size, 3);
    assert.ok(c.includes(r));
    assert.ok(c.every((x) => x >= 0 && x <= 10));
  }
  // pas assez de candidats : complété par les voisins
  assert.equal(choixAutour(5, [], 4, h).length, 4);
});

test('une partie : 10 questions différentes, score compté', () => {
  let i = 0;
  const gen = () => ({ texte: String(i % 15), reponse: i++ % 15 });
  const p = nouvellePartie(gen, 1);
  assert.equal(p.questions.length, 10);
  assert.equal(new Set(p.questions.map((q) => q.texte)).size, 10);
  while (!terminee(p)) repondre(p, p.index < 7 ? questionEnCours(p).reponse : -1);
  assert.equal(p.bonnes, 7);
});

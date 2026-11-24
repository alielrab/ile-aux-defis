import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as suisse from '../js/jeux/suisse.js';
import { graine } from './hasard.js';

test('Suisse : 26 cantons, chacun avec son chef-lieu et sa langue', () => {
  assert.equal(suisse.CANTONS.length, 26);
  assert.equal(new Set(suisse.CANTONS.map((c) => c[0])).size, 26);
  assert.equal(new Set(suisse.CANTONS.map((c) => c[2])).size, 26);
  for (const c of suisse.CANTONS) assert.ok(c[1] && c[2] && ['allemand', 'français', 'italien'].includes(c[3]), c[0]);
});

test('Suisse : chaque question a des choix différents dont la bonne réponse ; 3 choix pour les petits, 4 ensuite', () => {
  for (const [age, n, min] of [[6, 3, 20], [9, 4, 50]]) {
    const b = suisse.banque(age);
    assert.ok(b.length >= min, `${b.length} questions à ${age} ans`);
    assert.equal(new Set(b.map((q) => q.cle)).size, b.length);
    for (const q of b) assert.ok(q.autres.length >= n - 1 && !q.autres.includes(q.bonne) && new Set(q.autres).size === q.autres.length, q.cle);
    for (let g = 1; g < 60; g++) {
      const q = suisse.question({ age }, graine(g));
      assert.equal(q.choix.length, n);
      assert.equal(new Set(q.choix).size, n);
      assert.ok(q.choix.includes(q.reponse) && q.image);
    }
  }
});

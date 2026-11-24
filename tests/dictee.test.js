import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as dictee from '../js/jeux/dictee.js';
import { graine } from './hasard.js';

test('dictée : assez de mots, courts pour les petits', () => {
  assert.ok(dictee.MOTS_PETITS.length >= 15 && dictee.MOTS_GRANDS.length >= 20);
  assert.ok(dictee.MOTS_PETITS.every((m) => m[0].replaceAll('-', '').length <= 6));
});

test('dictée : les tuiles contiennent toutes les lettres du mot, et des intrus qui ne sont pas dans le mot', () => {
  for (const [age, intrus] of [[6, 1], [9, 3]]) for (let g = 1; g < 40; g++) {
    const q = dictee.question({ age }, graine(g));
    assert.equal(q.syllabes.join(''), q.reponse);
    assert.equal(q.tuiles.length, q.reponse.length + intrus, q.reponse);
    const reste = [...q.tuiles];
    for (const l of q.syllabes) { const i = reste.indexOf(l); assert.ok(i >= 0, `${l} manque pour ${q.reponse}`); reste.splice(i, 1); }
    assert.ok(reste.every((l) => !q.reponse.includes(l)), `intrus dans ${q.reponse}`);
    assert.ok(q.consigne.includes(q.reponse) && !q.titre.includes(q.reponse)); // le mot est dit, pas écrit
  }
});

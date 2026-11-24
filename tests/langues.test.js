import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as langues from '../js/jeux/langues.js';
import { graine } from './hasard.js';

test('école des langues : chaque mot a son image et ses deux langues ; pas de doublon dans un thème', () => {
  for (const t of langues.THEMES) {
    assert.ok(t.mots.length >= 7, t.cle);
    for (const i of [0, 1, 2, 3]) assert.equal(new Set(t.mots.map((m) => (i < 2 ? m[i] : m[i][0]))).size, t.mots.length, `${t.cle} ${i}`);
    for (const m of t.mots) for (const l of [m[2], m[3]]) assert.ok(l[0] && l[1], m[0]);
  }
});

test('10 questions avec 4 choix dont la bonne ; « lire » seulement dès 8 ans ; les mots ratés d’abord', () => {
  for (const age of [6, 9]) for (const langue of Object.keys(langues.LANGUES)) for (const t of langues.THEMES) for (let g = 1; g < 6; g++) {
    const qs = langues.questions({ age, langue, theme: t.cle, rates: ['le chat', 'deux'] }, graine(g));
    assert.equal(qs.length, 10);
    for (const q of qs) {
      assert.equal(q.choix.length, 4);
      assert.equal(new Set(q.choix).size, 4);
      assert.ok(q.choix.includes(q.reponse));
    }
    assert.equal(qs.some((q) => q.mode === 'lire'), age > 7);
    if (t.cle === 'animaux') assert.equal(qs[0].fr, 'le chat');
    if (t.cle === 'nombres') assert.equal(qs[0].fr, 'deux');
  }
});

test('révision : un mot raté est gardé (une fois), un mot réussi s’en va', () => {
  const p = {};
  langues.noter(p, 'anglais', 'le chat', false);
  langues.noter(p, 'anglais', 'le chat', false);
  assert.deepEqual(langues.aRevoir(p, 'anglais', 'animaux'), ['le chat']);
  assert.deepEqual(langues.aRevoir(p, 'allemand', 'animaux'), []);
  assert.deepEqual(langues.aRevoir(p, 'anglais', 'couleurs'), []);
  langues.noter(p, 'anglais', 'le chat', true);
  assert.deepEqual(p.langues.anglais, []);
});

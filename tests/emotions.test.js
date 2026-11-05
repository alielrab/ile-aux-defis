import { test } from 'node:test';
import assert from 'node:assert/strict';
import { question, EMOTIONS, SITUATIONS, CONSEILS, VISAGES, METEO, proches, visage, nom } from '../js/jeux/emotions.js';
import { nouvellePartie } from '../js/partie.js';
import { graine } from './hasard.js';

test('chaque émotion a un nom et un conseil ; chaque situation une émotion connue ; pas de doublon', () => {
  for (const e of Object.keys(EMOTIONS)) assert.ok(nom(e) && CONSEILS[e], e);
  for (const [texte, e] of SITUATIONS) assert.ok(EMOTIONS[e], texte);
  assert.equal(new Set(SITUATIONS.map((s) => s[0])).size, SITUATIONS.length);
  for (const e of VISAGES) assert.match(visage(e), /<svg[\s\S]*<\/svg>/, e);
  assert.ok(METEO.length >= 4 && METEO.every((m) => m[3].length > 20));
});

test('7 ans et moins : les 6 émotions de base, 3 choix ; jamais deux émotions proches ensemble', () => {
  const base = ['joie', 'tristesse', 'colere', 'peur', 'surprise', 'degout'];
  for (let g = 1; g < 25; g++) {
    for (const q of nouvellePartie(question, { age: 6 }, graine(g)).questions) {
      assert.equal(q.choix.length, 3);
      assert.ok(q.choix.every((c) => base.includes(c)), q.texte);
      assert.ok(q.choix.includes(q.reponse) && q.savaisTu);
      for (const c of q.choix) if (c !== q.reponse) assert.ok(!proches(c, q.reponse), `${q.texte} : ${c} / ${q.reponse}`);
    }
  }
});

test('8 ans et plus : 4 choix, des émotions plus fines, une consigne avec le prénom', () => {
  const vues = new Set();
  for (let g = 1; g < 25; g++) {
    for (const q of nouvellePartie(question, { age: 9 }, graine(g)).questions) {
      vues.add(q.reponse);
      assert.equal(new Set(q.choix).size, 4);
      for (const c of q.choix) if (c !== q.reponse) assert.ok(!proches(c, q.reponse));
      if (q.mode === 'situation') assert.match(q.consigne, /Que ressent [A-ZÉ][a-zé]+ \?$/, q.consigne);
    }
  }
  assert.ok(['fierte', 'jalousie', 'deception'].every((e) => vues.has(e)));
});

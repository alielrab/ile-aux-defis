import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SYSTEMES, question, decouvrir, dessinerSysteme, fiche } from '../js/jeux/atlas.js';
import { nouvellePartie } from '../js/partie.js';
import { graine } from './hasard.js';

test('8 pages ; chaque organe a sa fiche simple et détaillée, son « Le savais-tu ? » et sa zone à toucher', () => {
  assert.deepEqual(Object.keys(SYSTEMES), ['squelette', 'muscles', 'coeur', 'respiration', 'digestion', 'cerveau', 'sens', 'dents']);
  for (const [cle, s] of Object.entries(SYSTEMES)) {
    assert.ok(s.organes.length >= 4, cle);
    assert.equal(new Set(s.organes.map((o) => o.id)).size, s.organes.length, cle);
    for (const o of s.organes) {
      assert.ok(o.petit && o.grand && o.savais && o.grand.length > o.petit.length, `${cle} : ${o.id}`);
      assert.ok(o.hit[0] >= 0 && o.hit[0] <= 240 && o.hit[1] >= 0 && o.hit[1] <= 420, `${cle} : ${o.id}`);
    }
    const svg = dessinerSysteme(cle, [s.organes[0].id], s.organes[1].id);
    for (const o of s.organes) assert.ok(svg.includes(`data-organe="${o.id}"`), `${cle} : ${o.id}`);
    assert.match(svg, /class="organe actif"/);
  }
  assert.equal(fiche(SYSTEMES.squelette.organes[0], 6), SYSTEMES.squelette.organes[0].petit);
});

test('quiz : 10 questions différentes par page et par âge, 4 choix différents', () => {
  for (const [cle, s] of Object.entries(SYSTEMES)) {
    for (const niveau of ['petit', 'grand']) {
      assert.ok(s[niveau].length >= 10, `${cle} ${niveau}`);
      for (const [q, bonne, autres] of s[niveau]) assert.equal(new Set([bonne, ...autres]).size, 4, q);
    }
    for (const age of [6, 9]) {
      const { questions } = nouvellePartie(question, { age, systeme: cle }, graine(age));
      assert.equal(new Set(questions.map((q) => q.texte)).size, 10, `${cle} ${age} ans`);
      const banque = s[age <= 7 ? 'petit' : 'grand'].map((q) => q[0]);
      assert.ok(questions.every((q) => banque.includes(q.texte) && q.choix.length === 4 && q.choix.includes(q.reponse)));
    }
  }
});

test('découvrir une page : la récompense ne vient qu’une fois, quand tous les organes sont vus', () => {
  const p = {};
  const ids = SYSTEMES.respiration.organes.map((o) => o.id);
  const resultats = ids.map((id) => decouvrir(p, 'respiration', id));
  assert.deepEqual(resultats, [false, false, false, true]);
  assert.equal(decouvrir(p, 'respiration', ids[0]), false); // revoir une fiche ne redonne rien
  assert.deepEqual(p.atlas.respiration, ids);
});

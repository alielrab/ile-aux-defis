import { test } from 'node:test';
import assert from 'node:assert/strict';
import { question, TOUCHER_AU_DEBUT, PARTIES, versDessin, touche, partieTouchee, marques, docteure } from '../js/jeux/corps.js';
import { graine } from './hasard.js';
import { FACILES, DIFFICILES } from '../js/jeux/corps-questions.js';
import { nouvellePartie } from '../js/partie.js';

const centre = (id, age) => versDessin(PARTIES[id].zones[0], age);

test('toucher le centre d’une partie la trouve, à tous les âges', () => {
  for (const age of [4, 8, 12]) for (const id in PARTIES) {
    const [x, y] = centre(id, age);
    assert.ok(touche(id, x, y, age), `${id} à ${age} ans`);
    const trouve = partieTouchee(x, y, age);
    assert.ok(trouve === id || touche(id, ...versDessin(PARTIES[trouve].zones[0], age).slice(0, 2), age), `${id} → ${trouve}`);
  }
});

test('le nez est le nez (pas la tête), la tête accepte tout le visage, à côté du patient : rien', () => {
  const [x, y] = centre('nez', 8);
  assert.equal(partieTouchee(x, y, 8), 'nez');
  assert.ok(touche('tete', x, y, 8));
  assert.equal(partieTouchee(5, 5, 8), null);
  assert.ok(!touche('pied', x, y, 8));
});

test('banque de questions : au moins 40 faciles et 50 difficiles, 4 choix, sans doublon, chacune avec « Le savais-tu ? »', () => {
  for (const [banque, min, autres] of [[FACILES, 40, 3], [DIFFICILES, 50, 3]]) {
    assert.ok(banque.length >= min);
    assert.equal(new Set(banque.map((q) => q[0])).size, banque.length);
    for (const [texte, bonne, faux, savais] of banque) {
      assert.equal(faux.length, autres, texte);
      assert.equal(new Set([bonne, ...faux]).size, autres + 1, texte);
      assert.ok(savais.length > 20 && savais.length < 200, texte);
    }
  }
});

test('6 ans : on touche le patient au début, puis des questions faciles à 4 choix ; 9 ans : que des questions difficiles à 4 choix', () => {
  const partie = (age, graineN) => nouvellePartie(question, { age }, graine(graineN)).questions;
  for (let n = 1; n < 20; n++) {
    const petite = partie(6, n);
    assert.ok(petite.slice(0, TOUCHER_AU_DEBUT).every((q) => q.mode === 'toucher' && q.reponse in PARTIES));
    assert.ok(petite.slice(TOUCHER_AU_DEBUT).every((q) => q.mode === 'choix' && q.choix.length === 4 && q.savaisTu));
    const grande = partie(9, n);
    assert.ok(grande.every((q) => q.mode === 'choix' && q.choix.length === 4 && q.choix.includes(q.reponse) && q.savaisTu));
    assert.equal(new Set(grande.map((q) => q.texte)).size, 10);
  }
});

test('dessins : marques et docteure', () => {
  assert.equal((marques('main', 'juste', 8).match(/<circle/g) ?? []).length, 2);
  assert.match(docteure({ peau: 'brune', yeux: 'noirs', coiffure: 'queue', cheveux: 'noir', tenue: 'tshirt-turquoise' }, 14), /#c9ced6[\s\S]*<\/svg>$/);
});

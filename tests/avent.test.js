import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JOURS, enSaison, ouvrables, ouvrir, ETOILES_CASE, ETOILES_DERNIERE } from '../js/jeux/avent.js';

test('24 cases, chacune avec un emoji, un titre et un texte', () => {
  assert.equal(JOURS.length, 24);
  for (const [emoji, titre, texte] of JOURS) assert.ok(emoji && titre && texte.length > 10);
});

test('le calendrier ne vit qu’en décembre, et on ouvre les jours déjà passés', () => {
  assert.equal(enSaison(new Date(2026, 10, 30)), false);
  assert.equal(ouvrables(new Date(2026, 10, 30)), 0);
  assert.equal(ouvrables(new Date(2026, 11, 1)), 1);
  assert.equal(ouvrables(new Date(2026, 11, 10)), 10);
  assert.equal(ouvrables(new Date(2026, 11, 28)), 24); // après le 24 : tout reste ouvert jusqu’à la fin du mois
  assert.equal(ouvrables(new Date(2027, 0, 2)), 0);
});

test('ouvrir une case : les étoiles une seule fois, pas de case du futur, 5 étoiles le 24', () => {
  const p = { etoiles: 0 }, le10 = new Date(2026, 11, 10);
  assert.equal(ouvrir(p, 11, le10), null); // demain : encore fermée
  assert.equal(ouvrir(p, 3, le10), ETOILES_CASE); // un jour oublié se rattrape
  assert.equal(ouvrir(p, 3, le10), 0);
  assert.equal(p.etoiles, ETOILES_CASE);
  assert.equal(ouvrir(p, 24, new Date(2026, 11, 24)), ETOILES_DERNIERE);
  assert.equal(ouvrir(p, 0, le10), null);
  assert.equal(ouvrir(p, '2', le10), null);
  assert.deepEqual(p.avent, [3, 24]);
});

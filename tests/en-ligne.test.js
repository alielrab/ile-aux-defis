import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dater, fusionner, copieDe, appliquer, aEnvoyer, disponible } from '../js/en-ligne.js';

const etat = (profils, code = '1234') => ({ version: 2, code, reglages: { suivante: 'auto' }, profils });
const enfant = (id, etoiles, maj) => ({ id, prenom: id, etoiles, ...(maj ? { maj } : {}) });

test('sans configuration, pas de compte en ligne', () => {
  assert.equal(disponible(), false);
});

test('seul ce qui a changé depuis la dernière synchronisation est daté', () => {
  const local = etat([enfant('lea', 5, 100), enfant('tom', 3, 100)]);
  const copie = copieDe(local);
  local.profils[0].etoiles = 8; // Léa a joué ici
  dater(local, copie, 500);
  assert.equal(local.profils[0].maj, 500);
  assert.equal(local.profils[1].maj, 100); // Tom n'a pas changé
  assert.equal(local.majParent, undefined); // ni le code ni les réglages
});

test('profil par profil, la version la plus récente gagne, et rien ne se perd', () => {
  const local = etat([enfant('lea', 8, 500), enfant('tom', 3, 100), enfant('zoe', 1, 600)]);
  const distant = { ...etat([enfant('lea', 6, 300), enfant('tom', 9, 400), enfant('max', 2, 200)], '9999'), majParent: 50 };
  const r = fusionner(local, distant);
  assert.deepEqual(r.profils.map((p) => [p.id, p.etoiles]), [['lea', 8], ['tom', 9], ['zoe', 1], ['max', 2]]);
  assert.equal(r.code, '9999'); // le code changé en ligne (local sans date)
  assert.deepEqual(fusionner(null, distant), distant); // appareil neuf
  assert.deepEqual(fusionner(local, null), local); // premier envoi
});

test('appliquer garde les mêmes objets (la joueuse en cours reste la même)', () => {
  const local = etat([enfant('lea', 5, 100)]);
  const joueuse = local.profils[0];
  const change = appliquer(local, fusionner(local, etat([enfant('lea', 9, 200), enfant('max', 2, 200)])));
  assert.equal(change, true);
  assert.equal(local.profils[0], joueuse);
  assert.equal(joueuse.etoiles, 9);
  assert.equal(local.profils.length, 2);
  assert.equal(appliquer(local, structuredClone(local)), false);
});

test('deux enfants sur deux appareils : chacun n’envoie que son propre enfant', () => {
  // en ligne : Léa et Tom ; les clés dans un autre ordre (la base de données les réordonne)
  const distant = { majParent: 10, reglages: { suivante: 'auto' }, code: '1234', version: 2, profils: [{ prenom: 'lea', maj: 100, etoiles: 5, id: 'lea' }, enfant('tom', 3, 100)] };
  const ici = etat([enfant('lea', 5, 100), enfant('tom', 7, 900)]); // sur cet appareil, seul Tom a joué
  ici.majParent = 10;
  const { envoyerParent, envoyerEnfants } = aEnvoyer(fusionner(ici, distant), distant);
  assert.equal(envoyerParent, null);
  assert.deepEqual(envoyerEnfants.map((p) => p.id), ['tom']);
});

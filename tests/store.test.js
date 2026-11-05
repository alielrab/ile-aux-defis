import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nouvelEtat, ajouterProfil, charger, sauver } from '../js/store.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';

const faux = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
};
const lea = { prenom: ' Léa ', age: 6, avatar: AVATAR_PAR_DEFAUT };
const zoe = { prenom: 'Zoé', avatar: { ...AVATAR_PAR_DEFAUT, coiffure: 'afro', peau: 'foncee' }, age: 9 };

test('le code parent doit avoir 4 chiffres', () => {
  assert.equal(nouvelEtat('0420').code, '0420');
  for (const mauvais of ['123', '12345', 'abcd', '']) assert.throws(() => nouvelEtat(mauvais));
});

test('deux profils séparés, pas de troisième', () => {
  const etat = nouvelEtat('1234');
  const a = ajouterProfil(etat, lea);
  const b = ajouterProfil(etat, zoe);
  assert.equal(a.prenom, 'Léa');
  assert.notEqual(a.id, b.id);
  a.etoiles = 5;
  assert.equal(b.etoiles, 0);
  assert.throws(() => ajouterProfil(etat, zoe));
});

test('profil invalide refusé', () => {
  const etat = nouvelEtat('1234');
  assert.throws(() => ajouterProfil(etat, { ...lea, prenom: '   ' }));
  assert.throws(() => ajouterProfil(etat, { ...lea, prenom: 'x'.repeat(21) }));
  assert.throws(() => ajouterProfil(etat, { ...lea, avatar: '🦊' }));
  assert.throws(() => ajouterProfil(etat, { ...lea, avatar: { ...AVATAR_PAR_DEFAUT, cheveux: 'vert' } }));
  for (const age of [undefined, 2, 15, 6.5, '6']) assert.throws(() => ajouterProfil(etat, { ...lea, age }));
  assert.equal(etat.profils.length, 0);
});

test('sauvegarde puis rechargement', () => {
  const s = faux();
  const etat = nouvelEtat('1234');
  ajouterProfil(etat, lea);
  assert.equal(sauver(etat, s), true);
  assert.deepEqual(charger(s), etat);
});

test('les profils des premiers essais (sans yeux ni maison) sont complétés', () => {
  const s = faux();
  s.setItem('ile-aux-defis', JSON.stringify({ version: 2, code: '1234', profils: [{ id: 0, prenom: 'A', avatar: { peau: 'claire' } }] }));
  const p = charger(s).profils[0];
  assert.equal(p.avatar.yeux, 'marron');
  assert.deepEqual(p.maison, { piece: 'chambre', papiers: {}, places: [] });
  assert.deepEqual(p.avatar.accessoires, []);
  s.setItem('ile-aux-defis', JSON.stringify({ version: 2, code: '1234', profils: [{ id: 0, avatar: {}, maison: { papier: 'pois', places: ['meuble:lit'] } }] }));
  assert.deepEqual(charger(s).profils[0].maison, { piece: 'chambre', papiers: { chambre: 'pois' }, places: ['meuble:lit'] });
});

test('stockage vide, illisible ou bloqué', () => {
  const s = faux();
  assert.equal(charger(s), null);
  s.setItem('ile-aux-defis', '{"version":1,"code":"1234","profils":[]}');
  assert.equal(charger(s), null); // ancienne version d'essai : on recommence
  s.setItem('ile-aux-defis', '{pas du json');
  assert.equal(charger(s), null);
  const bloque = { getItem() { throw new Error(); }, setItem() { throw new Error(); } };
  assert.equal(charger(bloque), null);
  assert.equal(sauver(nouvelEtat('1234'), bloque), false);
});

test('écran parent : modifier prénom et âge, remettre à zéro, changer le code', async () => {
  const { modifierProfil, remettreAZero, changerCode } = await import('../js/store.js');
  const etat = nouvelEtat('1234');
  const p = ajouterProfil(etat, lea);
  modifierProfil(p, { prenom: ' Léa-Rose ', age: 7 });
  assert.equal(p.prenom, 'Léa-Rose');
  assert.equal(p.age, 7);
  assert.throws(() => modifierProfil(p, { prenom: '', age: 7 }));
  assert.throws(() => modifierProfil(p, { prenom: 'Léa', age: 40 }));
  assert.equal(p.age, 7);
  Object.assign(p, { etoiles: 12, objets: ['tenue:princesse', 'meuble:lit'] });
  Object.assign(p.avatar, { tenue: 'princesse', cheveux: 'rose', peau: 'foncee', accessoires: ['couronne'] });
  p.maison.places.push('meuble:lit');
  remettreAZero(p);
  assert.equal(p.etoiles, 0);
  assert.deepEqual(p.objets, []);
  assert.deepEqual(p.maison.places, []);
  assert.deepEqual([p.avatar.tenue, p.avatar.cheveux, p.avatar.peau, p.avatar.accessoires], [AVATAR_PAR_DEFAUT.tenue, AVATAR_PAR_DEFAUT.cheveux, 'foncee', []]);
  changerCode(etat, '9876');
  assert.equal(etat.code, '9876');
  assert.throws(() => changerCode(etat, '98'));
});

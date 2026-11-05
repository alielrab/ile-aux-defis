import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGUE, MAGASINS, article, possede, acheter, utiliser, estUtilise, modifierAvatar, pieceManquante } from '../js/catalogue.js';
import { AVATAR_PAR_DEFAUT, TENUES_DE_DEPART } from '../js/avatar.js';
import { maisonVide } from '../js/store.js';

const profil = (etoiles) => ({ etoiles, objets: [], avatar: { ...AVATAR_PAR_DEFAUT, accessoires: [] }, maison: maisonVide() });
const aVendre = (type) => CATALOGUE.filter((a) => a.type === type && a.prix > 0).length;

test('le catalogue : beaucoup d’objets à gagner, ids uniques', () => {
  assert.ok(aVendre('meuble') >= 12 && aVendre('jouet') >= 6 && aVendre('animal') >= 5);
  assert.ok(aVendre('tenue') >= 8 && aVendre('accessoire') >= 6 && aVendre('coiffure') >= 3 && aVendre('cheveux') >= 3);
  assert.equal(aVendre('piece'), 2);
  assert.equal(new Set(CATALOGUE.map((a) => a.id)).size, CATALOGUE.length);
});

test('chaque type d’objet est vendu dans un magasin', () => {
  const vendus = new Set(Object.values(MAGASINS).flatMap((m) => m.rayons.flatMap(([, types]) => types)));
  for (const a of CATALOGUE) if (a.type !== 'ustensile') assert.ok(vendus.has(a.type), a.type); // la cuisine : gagnée avec les recettes
});

test('achat : débite les étoiles, garde l’objet, l’installe tout de suite', () => {
  const p = profil(21);
  acheter(p, 'meuble:lit');
  assert.equal(p.etoiles, 6);
  assert.deepEqual(p.objets, ['meuble:lit']);
  assert.ok(estUtilise(p, article('meuble:lit')));
  acheter(p, 'meuble:plante');
  assert.deepEqual(p.maison.places, ['meuble:lit', 'meuble:plante']);
});

test('achat refusé : pas assez d’étoiles, déjà acheté, inconnu, gratuit', () => {
  const p = profil(7);
  assert.throws(() => acheter(p, 'meuble:tapis'), /manque 1 étoile/);
  assert.equal(p.etoiles, 7);
  acheter(p, 'meuble:plante');
  assert.throws(() => acheter(p, 'meuble:plante'), /déjà/);
  assert.throws(() => acheter(p, 'meuble:fusee'), /inconnu/);
  assert.throws(() => acheter(p, `tenue:${TENUES_DE_DEPART[1]}`), /déjà/);
  assert.throws(() => acheter(p, 'piece:chambre'), /déjà/); // la chambre est à elle dès le départ
  assert.equal(p.etoiles, 1);
});

test('pièces : les meubles du salon demandent d’abord le salon', () => {
  const p = profil(100);
  assert.equal(pieceManquante(p, article('meuble:canape')), 'Salon');
  assert.throws(() => acheter(p, 'meuble:canape'), /pièce : Salon/);
  assert.equal(p.etoiles, 100);
  acheter(p, 'piece:salon');
  assert.equal(p.maison.piece, 'salon'); // on y va tout de suite
  acheter(p, 'meuble:canape');
  assert.equal(pieceManquante(p, article('meuble:canape')), null);
  assert.equal(pieceManquante(p, article('jouet:ours')), null); // l'ours va dans la chambre
});

test('papier peint : un par pièce', () => {
  const p = profil(100);
  acheter(p, 'papier:pois');
  assert.deepEqual(p.maison.papiers, { chambre: 'pois' });
  acheter(p, 'piece:jeux');
  utiliser(p, 'papier:pois');
  assert.deepEqual(p.maison.papiers, { chambre: 'pois', jeux: 'pois' });
  utiliser(p, 'papier:pois');
  assert.equal(p.maison.papiers.jeux, null);
  assert.equal(p.maison.papiers.chambre, 'pois');
});

test('placer/ranger, porter, bijoux cumulables', () => {
  const p = profil(200);
  acheter(p, 'meuble:tapis');
  utiliser(p, 'meuble:tapis');
  assert.deepEqual(p.maison.places, []);
  acheter(p, 'tenue:princesse');
  assert.equal(p.avatar.tenue, 'princesse');
  utiliser(p, `tenue:${TENUES_DE_DEPART[0]}`);
  assert.equal(p.avatar.tenue, TENUES_DE_DEPART[0]);
  acheter(p, 'accessoire:couronne');
  acheter(p, 'accessoire:collier');
  assert.deepEqual(p.avatar.accessoires, ['couronne', 'collier']);
  utiliser(p, 'accessoire:couronne');
  assert.deepEqual(p.avatar.accessoires, ['collier']);
  acheter(p, 'animal:chien');
  assert.ok(p.maison.places.includes('animal:chien'));
  assert.throws(() => utiliser(p, 'coiffure:couettes'), /pas encore/);
  assert.ok(possede(p, article('coiffure:longs')));
});

test('modifier son avatar : seulement avec ce qu’elle possède', () => {
  const p = profil(30);
  modifierAvatar(p, { ...p.avatar, yeux: 'verts', peau: 'mate', coiffure: 'boucles' });
  assert.equal(p.avatar.yeux, 'verts');
  assert.throws(() => modifierAvatar(p, { ...p.avatar, coiffure: 'couettes' }), /pas encore/);
  assert.throws(() => modifierAvatar(p, { ...p.avatar, tenue: 'princesse' }), /pas encore/);
  assert.throws(() => modifierAvatar(p, { ...p.avatar, accessoires: ['couronne'] }), /bijou/);
  assert.throws(() => modifierAvatar(p, { ...p.avatar, yeux: 'violets' }));
  acheter(p, 'coiffure:couettes');
  acheter(p, 'accessoire:lunettes');
  modifierAvatar(p, { ...p.avatar, coiffure: 'couettes', pirate: true });
  assert.equal(p.avatar.coiffure, 'couettes');
  assert.deepEqual(p.avatar.accessoires, ['lunettes']); // les bijoux portés sont gardés
  assert.equal(p.avatar.pirate, undefined);
});

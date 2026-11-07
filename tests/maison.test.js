import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dessinerPiece, apercu } from '../js/maison.js';
import { CATALOGUE, acheter, utiliser } from '../js/catalogue.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';
import { maisonVide } from '../js/store.js';

const profil = () => ({ age: 6, etoiles: 999, objets: [], avatar: { ...AVATAR_PAR_DEFAUT, accessoires: [] }, maison: maisonVide() });

test('chaque objet du catalogue a un aperçu', () => {
  for (const a of CATALOGUE) {
    const svg = apercu(a, profil());
    assert.match(svg, /^<svg[\s\S]*<\/svg>$/, a.id);
    assert.ok(!svg.includes('undefined'), a.id);
    if (!['tenue', 'coiffure', 'accessoire', 'cheveux'].includes(a.type)) assert.doesNotMatch(svg, /\p{Extended_Pictographic}/u, `${a.id} : dessiné, pas d'emoji`);
  }
});

test('chaque pièce montre ses objets posés, et les animaux suivent l’enfant', () => {
  const p = profil();
  const vide = dessinerPiece(p);
  for (const id of ['meuble:lit', 'jouet:ours', 'animal:chat', 'papier:pois', 'piece:salon', 'meuble:canape']) acheter(p, id);
  const chambre = dessinerPiece(p, 'chambre'), salon = dessinerPiece(p, 'salon');
  assert.ok(chambre.length > vide.length);
  assert.ok(chambre.includes('#b9773e') && chambre.includes('url(#papier-piece)'));
  assert.ok(!salon.includes('#b9773e') && salon.includes('#5b84c4')); // pas l'ours, mais le canapé
  assert.ok(salon.includes('#f2a654') && chambre.includes('#f2a654')); // le chat est partout
  utiliser(p, 'animal:chat');
  assert.ok(!dessinerPiece(p, 'chambre').includes('#f2a654'));
  for (const piece of ['chambre', 'salon', 'jeux']) assert.ok(!dessinerPiece(p, piece).includes('undefined'));
});

test('chaque meuble et jouet vendu a un dessin qui apparaît dans sa pièce ; la couleur du lit change le dessin', async () => {
  const { MEUBLES, JOUETS, COULEURS_LIT, CATALOGUE, acheter, estUtilise } = await import('../js/catalogue.js');
  const { dessinerPiece, apercu } = await import('../js/maison.js');
  const { AVATAR_PAR_DEFAUT } = await import('../js/avatar.js');
  for (const [type, liste] of [['meuble', MEUBLES], ['jouet', JOUETS]]) {
    for (const [cle, o] of Object.entries(liste)) {
      const vide = { avatar: AVATAR_PAR_DEFAUT, age: 8, maison: { piece: o.piece, papiers: {}, places: [], tableaux: {} } };
      const avec = { ...vide, maison: { ...vide.maison, places: [`${type}:${cle}`] } };
      assert.ok(dessinerPiece(avec).length > dessinerPiece(vide).length, `${cle} n'est pas dessiné`);
    }
  }
  for (const a of CATALOGUE) assert.ok(apercu(a, { avatar: AVATAR_PAR_DEFAUT, age: 8 }).includes('<svg'), a.id);
  const p = { etoiles: 100, objets: [], avatar: AVATAR_PAR_DEFAUT, age: 8, maison: { piece: 'chambre', papiers: {}, places: ['meuble:lit'], tableaux: {} } };
  assert.ok(estUtilise(p, CATALOGUE.find((a) => a.id === 'lit:rose')));
  acheter(p, 'lit:bleu');
  assert.equal(p.maison.lit, 'bleu');
  assert.ok(dessinerPiece(p).includes(COULEURS_LIT.bleu.couleur));
  assert.equal(p.etoiles, 100 - COULEURS_LIT.bleu.prix);
});

test('animaux : prénom, vêtement, accessoires à côté de l’animal ; chaque animal et objet a un dessin', async () => {
  const { ANIMAUX, ACCESSOIRES_ANIMAUX, nommer, changerHabit, acheter } = await import('../js/catalogue.js');
  const p = profil();
  for (const k of Object.keys(ANIMAUX)) {
    const seul = { ...p, maison: { ...p.maison, places: [`animal:${k}`] } };
    assert.ok(dessinerPiece(seul).length > dessinerPiece(p).length, k);
  }
  assert.equal(nommer(p, 'animal:chien', '  Rex   le chien  '), 'Rex le chien');
  assert.equal(nommer(p, 'animal:chat', 'x'.repeat(40)).length, 15);
  nommer(p, 'animal:chat', '');
  assert.equal(p.noms['animal:chat'], undefined);
  acheter(p, 'animal:chien');
  acheter(p, 'habit-animal:pull-rouge');
  acheter(p, 'habit-animal:noeud-rose');
  assert.equal(changerHabit(p, 'animal:chien'), 'noeud-rose'); // dans l'ordre du catalogue
  assert.equal(changerHabit(p, 'animal:chien'), 'pull-rouge');
  assert.equal(changerHabit(p, 'animal:chien'), null); // puis aucun
  changerHabit(p, 'animal:chien');
  changerHabit(p, 'animal:chien');
  const svg = dessinerPiece(p);
  assert.match(svg, /Rex le chien/);
  assert.ok(svg.includes('#e05252')); // le pull rouge
  // un prénom tapé est échappé dans le dessin
  nommer(p, 'animal:chien', '<b>Max</b>');
  assert.ok(!dessinerPiece(p).includes('<b>'));
  for (const k of Object.keys(ACCESSOIRES_ANIMAUX)) {
    acheter(p, `acc-animal:${k}`);
    assert.ok(p.maison.places.includes(`acc-animal:${k}`), k);
  }
  assert.ok(dessinerPiece(p).length > 0);
});

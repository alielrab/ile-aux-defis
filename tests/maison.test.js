import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dessinerPiece, apercu } from '../js/maison.js';
import { CATALOGUE, article, acheter, utiliser } from '../js/catalogue.js';
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
  acheter(p, 'habit-animal:collier-bleu');
  assert.equal(changerHabit(p, 'animal:chien'), 'collier-bleu'); // dans l'ordre du catalogue
  assert.equal(changerHabit(p, 'animal:chien'), 'noeud-rose'); // le pull, objet de collection, ne se porte pas
  assert.equal(changerHabit(p, 'animal:chien'), null); // puis aucun
  changerHabit(p, 'animal:chien');
  changerHabit(p, 'animal:chien');
  const svg = dessinerPiece(p);
  assert.match(svg, /Rex le chien/);
  assert.ok(svg.includes('#ff5d8f')); // le nœud rose
  // un prénom tapé est échappé dans le dessin
  nommer(p, 'animal:chien', '<b>Max</b>');
  assert.ok(!dessinerPiece(p).includes('<b>'));
  for (const k of Object.keys(ACCESSOIRES_ANIMAUX)) {
    acheter(p, `acc-animal:${k}`);
    assert.ok(p.maison.places.includes(`acc-animal:${k}`), k);
  }
  assert.ok(dessinerPiece(p).length > 0);
});

test('nouveau style : un animal dont l’image est prête est montré en image, les autres gardent leur dessin', () => {
  const p = { avatar: AVATAR_PAR_DEFAUT, age: 8, objets: [], maison: { piece: 'chambre', papiers: {}, places: ['animal:chat', 'animal:chien'], tableaux: {} } };
  assert.ok(!dessinerPiece(p).includes('<image'));
  globalThis.IMAGES = ['images/animaux/chat.webp'];
  try {
    assert.equal(dessinerPiece(p).match(/<image href="images\/animaux\/chat\.webp"/g).length, 1);
    assert.ok(apercu(article('animal:chat'), p).includes('images/animaux/chat.webp'));
    assert.ok(!apercu(article('animal:chien'), p).includes('<image'));
    globalThis.IMAGES.push('images/animaux/habit-chapeau-fete.webp', 'images/animaux/habit-collier-bleu.webp');
    p.habits = { 'animal:chat': 'chapeau-fete' };
    assert.ok(dessinerPiece(p).includes('habit-chapeau-fete.webp'));
    p.habits = { 'animal:chat': 'collier-bleu', 'animal:chien': 'chapeau-fete' }; // pas de collier sur une image ; le chien dessiné garde son chapeau dessiné
    assert.ok(!dessinerPiece(p).includes('habit-'));
    p.habits = {};
    p.maison.places.push('acc-animal:gamelle', 'acc-animal:panier', 'acc-animal:griffoir');
    globalThis.IMAGES.push('images/animaux/acc-gamelle.webp', 'images/animaux/acc-griffoir.webp');
    assert.equal(dessinerPiece(p).match(/<image href="images\/animaux\/acc-/g).length, 2); // le panier garde son dessin
    assert.ok(apercu(article('acc-animal:gamelle'), p).includes('acc-gamelle.webp') && !apercu(article('acc-animal:panier'), p).includes('<image'));
  } finally { delete globalThis.IMAGES; }
});

test('nouveau style : un meuble en image garde sa place ; le lit a une image par couleur, sinon son dessin', () => {
  const p = { avatar: AVATAR_PAR_DEFAUT, age: 8, objets: [], maison: { piece: 'chambre', papiers: {}, places: ['meuble:lit', 'meuble:plante', 'meuble:bureau'], tableaux: {}, lit: 'bleu' } };
  globalThis.IMAGES = ['images/maison/plante.webp', 'images/maison/lit-bleu.webp'];
  try {
    const svg = dessinerPiece(p);
    assert.ok(svg.includes('maison/plante.webp') && svg.includes('maison/lit-bleu.webp') && !svg.includes('undefined'));
    assert.equal(svg.match(/<image href="images\/maison/g).length, 2); // le bureau garde son dessin
    p.maison.lit = 'vert';
    assert.ok(!dessinerPiece(p).includes('lit-') && dessinerPiece(p).includes('#5cb85c')); // pas d'image du lit vert : le dessin, en vert
    assert.ok(apercu(article('lit:bleu'), p).includes('lit-bleu.webp') && !apercu(article('lit:rose'), p).includes('<image'));
    assert.ok(apercu(article('meuble:plante'), p).includes('plante.webp'));
  } finally { delete globalThis.IMAGES; }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PEAUX, CHEVEUX, COIFFURES, TENUES, YEUX, ACCESSOIRES, avatarValide, dessinerAvatar, AVATAR_PAR_DEFAUT, proportions,
  TENUES_DE_DEPART, COIFFURES_DE_DEPART, CHEVEUX_DE_DEPART } from '../js/avatar.js';

test('chaque combinaison donne un SVG avec la bonne peau et les bons cheveux', () => {
  for (const peau in PEAUX) for (const coiffure in COIFFURES) for (const cheveux in CHEVEUX) {
    const a = { peau, coiffure, cheveux, yeux: 'verts', tenue: 'robe-rose' };
    assert.ok(avatarValide(a));
    const svg = dessinerAvatar(a);
    assert.match(svg, /^<svg[\s\S]*<\/svg>$/);
    assert.ok(svg.includes(PEAUX[peau]) && svg.includes(CHEVEUX[cheveux]) && svg.includes(YEUX.verts), `${peau} ${coiffure} ${cheveux}`);
    assert.ok(!svg.includes('undefined'));
  }
  for (const tenue in TENUES) assert.ok(dessinerAvatar({ ...AVATAR_PAR_DEFAUT, tenue }).includes(TENUES[tenue].haut));
});

test('avatar invalide refusé, et dessiné avec les valeurs par défaut', () => {
  for (const a of [null, {}, '🦊', { ...AVATAR_PAR_DEFAUT, peau: 'verte' }, { ...AVATAR_PAR_DEFAUT, tenue: 'x' }, { ...AVATAR_PAR_DEFAUT, yeux: undefined }]) {
    assert.equal(avatarValide(a), false);
  }
  assert.equal(dessinerAvatar({ peau: '"><script>' }), dessinerAvatar(AVATAR_PAR_DEFAUT));
});

test("l'avatar grandit avec l'âge : plus grand, tête plus petite en proportion", () => {
  const p6 = proportions(6), p9 = proportions(9), p10 = proportions(10);
  assert.ok(p6.taille < p9.taille && p9.taille < p10.taille);
  assert.ok(p6.tete > p9.tete);
  assert.ok(p6.corps < p9.corps);
  assert.deepEqual(proportions(1), proportions(4)); // bornes
  assert.deepEqual(proportions(20), proportions(12));
  assert.notEqual(dessinerAvatar(AVATAR_PAR_DEFAUT, 'entier', 6), dessinerAvatar(AVATAR_PAR_DEFAUT, 'entier', 9));
});

test('au départ : bouclés oui, couettes et cheveux roses non (à gagner), plus de tenues', () => {
  assert.ok(COIFFURES_DE_DEPART.includes('boucles'));
  assert.ok(!COIFFURES_DE_DEPART.includes('couettes'));
  assert.ok(!CHEVEUX_DE_DEPART.includes('rose'));
  assert.ok(TENUES_DE_DEPART.length >= 8);
  assert.ok(TENUES_DE_DEPART.every((t) => !TENUES[t].prix));
  assert.ok(Object.keys(TENUES).some((t) => TENUES[t].prix)); // il reste des tenues à gagner
});

test('bijoux : plusieurs à la fois, connus, sans doublon', () => {
  const tous = Object.keys(ACCESSOIRES);
  assert.ok(avatarValide({ ...AVATAR_PAR_DEFAUT, accessoires: tous }));
  assert.ok(avatarValide({ ...AVATAR_PAR_DEFAUT, accessoires: undefined })); // anciens profils
  assert.equal(avatarValide({ ...AVATAR_PAR_DEFAUT, accessoires: ['couronne', 'couronne'] }), false);
  assert.equal(avatarValide({ ...AVATAR_PAR_DEFAUT, accessoires: ['cape-magique'] }), false);
  const svg = dessinerAvatar({ ...AVATAR_PAR_DEFAUT, accessoires: tous });
  assert.ok(svg.length > dessinerAvatar(AVATAR_PAR_DEFAUT).length && !svg.includes('undefined'));
});

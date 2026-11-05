import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dessinerIle, LIEUX } from '../js/carte.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';

const profils = [
  { id: 0, prenom: 'Léa', age: 6, avatar: AVATAR_PAR_DEFAUT },
  { id: 1, prenom: '<b>Zoé</b>', age: 9, avatar: AVATAR_PAR_DEFAUT },
];

test('un lieu cliquable par mini-jeu, et seulement la maison de la joueuse', () => {
  const svg = dessinerIle(profils, profils[0]);
  for (const l of LIEUX) assert.ok(svg.includes(`data-lieu="${l.id}"`));
  assert.equal(svg.match(/data-lieu="maison"/g).length, 1);
  assert.match(svg, /aria-label="Ma maison \(Léa\)"/);
  for (const id of ['coiffeur', 'mode', 'meubles', 'refuge']) assert.ok(svg.includes(`data-lieu="${id}"`), id);
});

test('les prénoms sont échappés', () => {
  const svg = dessinerIle(profils, profils[1]);
  assert.ok(!svg.includes('<b>'));
  assert.ok(svg.includes('&#60;b&#62;Zoé'));
});

test('un prénom long rétrécit pour ne pas déborder sur la maison voisine', () => {
  const longs = [{ ...profils[0], prenom: 'Marie-Charlotte-Anne' }, profils[1]];
  assert.match(dessinerIle(longs, longs[1]), /font-size="18"[^>]*textLength="112"[^>]*>Marie-Charlotte-Anne</);
  assert.match(dessinerIle(profils, profils[1]), /font-size="26"[^>]*>Léa</); // un prénom court ne change pas
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nouvelleBD, nombreDeCases, ajouterBD, enleverBD, texteALire, dessinerCase, lignes, nettoyer, DECORS, PHRASES, CREATURES, BD_MAX, TEXTE_MAX, dessinCreature } from '../js/jeux/bd.js';

const sansPerso = () => '';

test('3 cases à 7 ans et moins, 4 pour les grands ; chaque décor se dessine', () => {
  assert.equal(nouvelleBD(6).cases.length, 3);
  assert.equal(nombreDeCases(9), 4);
  for (const d of Object.keys(DECORS)) assert.match(dessinerCase({ decor: d, perso: [null, null], bulles: ['', ''], autocollant: null }, sansPerso), /<svg[\s\S]*<\/svg>$/, d);
  assert.ok(PHRASES.length >= 10 && CREATURES.length >= 6);
  assert.match(dessinCreature('dragon', 0, 0, 100, 160), /🐉/);
});

test('les bulles : texte échappé, coupé en lignes, 40 caractères au plus', () => {
  const svg = dessinerCase({ decor: 'plage', perso: ['x', null], bulles: ['<b>Coucou</b> & toi', ''], autocollant: '⭐' }, () => '<g id="perso"/>');
  assert.ok(!svg.includes('<b>'));
  assert.match(svg, /&#60;b&#62;Coucou/);
  assert.match(svg, /id="perso"/);
  assert.match(svg, /⭐/);
  assert.deepEqual(lignes('Il était une fois un dragon tout vert'), ['Il était une fois', 'un dragon tout', 'vert']);
  assert.equal(nettoyer('  Bonjour   toi  '), 'Bonjour toi');
  assert.equal(nettoyer('x'.repeat(80)).length, TEXTE_MAX);
});

test('garder ses BD : 8 au plus, pas de BD vide ; lire à voix haute', () => {
  const p = { bds: [] };
  const b = nouvelleBD(6);
  assert.throws(() => ajouterBD(p, b), /vide/);
  b.titre = '  Le dragon  ';
  b.cases[0].perso = ['creature:dragon', 'profil:1'];
  b.cases[0].bulles = ['Bonjour !', ''];
  b.cases[1].bulles = ['', 'Au secours !'];
  const garde = ajouterBD(p, b);
  assert.equal(garde.titre, 'Le dragon');
  const noms = { 'creature:dragon': 'le dragon', 'profil:1': 'Léa' };
  assert.equal(texteALire(garde, (id) => noms[id]), 'Le dragon Case 1. le dragon dit : Bonjour ! Case 2. Quelqu’un dit : Au secours ! Case 3. Personne ne parle.');
  for (let i = 1; i < BD_MAX; i++) ajouterBD(p, b);
  assert.throws(() => ajouterBD(p, b), new RegExp(`${BD_MAX} BD`));
  enleverBD(p, garde.id);
  assert.equal(p.bds.length, BD_MAX - 1);
});

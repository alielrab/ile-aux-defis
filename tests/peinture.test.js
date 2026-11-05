import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODELES, COULEURS, couleur, magique, bonneCouleur, etoilesMagique, dessinerModele, dessinerOeuvre, ajouterOeuvre, enleverOeuvre, accrocher, modeleOuvert, debloquerModele, GALERIE_MAX } from '../js/jeux/peinture.js';
import { graine } from './hasard.js';

// « 3 × 4 », « 7 + 5 », « 15 − 3 » → le résultat
const calculer = (t) => {
  const [a, op, b] = t.split(' ');
  return op === '×' ? a * b : op === '+' ? Number(a) + Number(b) : a - b;
};

test('chaque dessin : des zones uniques, des couleurs connues, au moins 3 dessins gratuits', () => {
  for (const [cle, m] of Object.entries(MODELES)) {
    assert.equal(new Set(m.zones.map((z) => z[0])).size, m.zones.length, cle);
    for (const [id, forme, c, pos] of m.zones) {
      assert.ok(couleur(c), `${cle} : ${id}`);
      assert.match(forme, /^<(rect|circle|ellipse|path) /, `${cle} : ${id}`);
      assert.ok(pos[0] >= 0 && pos[0] <= 400 && pos[1] >= 0 && pos[1] <= 300, `${cle} : ${id}`);
    }
    assert.match(dessinerModele(cle), /<svg/);
  }
  assert.ok(Object.values(MODELES).filter((m) => m.prix === 0).length >= 3);
  assert.ok(Object.values(MODELES).some((m) => m.prix > 0));
});

test('coloriage magique, grands : chaque calcul donne le nombre de la bonne couleur', () => {
  for (const age of [8, 9, 11]) for (const cle of Object.keys(MODELES)) {
    const { palette, zones } = magique(cle, age, graine(age));
    assert.equal(new Set(Object.values(palette)).size, Object.keys(palette).length, cle); // une étiquette par couleur
    assert.ok(Object.values(palette).every((v) => /^\d+$/.test(v)), cle);
    assert.equal(new Set(Object.values(zones)).size, Object.keys(zones).length, cle); // pas deux zones pareilles
    for (const [id, , c] of MODELES[cle].zones) assert.equal(calculer(zones[id]), Number(palette[c]), `${cle} ${id} : ${zones[id]}`);
    if (age === 8) assert.ok(!Object.values(zones).some((t) => t.includes('×')), 'pas de tables à 8 ans');
  }
});

test('coloriage magique, petits : la syllabe de la zone contient le son de sa couleur', () => {
  for (const cle of Object.keys(MODELES)) {
    const { palette, zones } = magique(cle, 6, graine(3));
    for (const son of Object.values(palette)) assert.match(son, /^(a|i|o|u|é|ou|on|an)$/, `${cle} : ${son}`);
    assert.equal(new Set(Object.values(palette)).size, Object.keys(palette).length, cle);
    for (const [id, , c] of MODELES[cle].zones) assert.ok(zones[id].endsWith(palette[c]) && zones[id].length === palette[c].length + 1, `${cle} ${id} : ${zones[id]} / ${palette[c]}`);
  }
});

test('bonne couleur, étoiles, étiquettes affichées', () => {
  assert.ok(bonneCouleur('maison', 'soleil', 'jaune'));
  assert.ok(!bonneCouleur('maison', 'soleil', 'bleu'));
  assert.ok(etoilesMagique('maison', 9) > 0);
  assert.match(dessinerModele('maison', { soleil: '#f7d038' }, { toit: '3 × 4' }, { cliquable: true }), /data-zone="toit"[\s\S]*3 × 4/);
});

test('galerie : 12 dessins au plus, enlever décroche aussi le tableau ; un tableau par pièce', () => {
  const p = { etoiles: 0, dessins: [], maison: { tableaux: {} } };
  const premier = ajouterOeuvre(p, { type: 'modele', modele: 'maison', remplissage: {} });
  for (let i = 1; i < GALERIE_MAX; i++) ajouterOeuvre(p, { type: 'libre', image: 'data:image/jpeg;base64,AAAA' });
  assert.throws(() => ajouterOeuvre(p, { type: 'libre', image: 'x' }), /pleine/);
  accrocher(p, premier.id, 'chambre');
  assert.equal(p.maison.tableaux.chambre, premier.id);
  accrocher(p, premier.id, 'chambre'); // toucher encore : décrocher
  assert.equal(p.maison.tableaux.chambre, undefined);
  accrocher(p, premier.id, 'salon');
  enleverOeuvre(p, premier.id);
  assert.equal(p.dessins.length, GALERIE_MAX - 1);
  assert.deepEqual(p.maison.tableaux, {});
  assert.match(dessinerOeuvre(p.dessins[0]), /<image href="data:image\/jpeg/);
});

test('débloquer un dessin avec des étoiles', () => {
  const p = { etoiles: 6, modeles: [] };
  assert.ok(modeleOuvert(p, 'maison'));
  assert.ok(!modeleOuvert(p, 'papillon'));
  debloquerModele(p, 'papillon');
  assert.equal(p.etoiles, 6 - MODELES.papillon.prix);
  assert.ok(modeleOuvert(p, 'papillon'));
  assert.throws(() => debloquerModele(p, 'papillon'), /déjà/);
  assert.throws(() => debloquerModele({ etoiles: 1, modeles: [] }, 'glace'), /étoiles/);
  assert.equal(COULEURS.length, 14);
});

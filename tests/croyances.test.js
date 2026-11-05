import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graine } from './hasard.js';
import { CROYANCES, RELIGIONS, CONTENUS, question, batiment } from '../js/croyances.js';
import { nouvellePartie } from '../js/partie.js';
import { nouvelEtat, ajouterProfil, reglerCroyance, charger, sauver } from '../js/store.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';
import { dessinerIle } from '../js/carte.js';

test('chaque contenu : présentation, fêtes, symboles, et au moins 10 questions par âge', () => {
  for (const [cle, c] of Object.entries(CONTENUS)) {
    assert.ok(c.presentation && c.fetes.length && c.symboles.length >= 3, cle);
    assert.ok(c.questions.filter((q) => !q[4]).length >= 10, `${cle} : 10 questions pour les 6 ans`);
    assert.equal(new Set(c.questions.map((q) => q[0])).size, c.questions.length, cle);
    for (const [q, bonne, autres, savais] of c.questions) {
      assert.equal(autres.length, 3, q);
      assert.ok(!autres.includes(bonne) && new Set(autres).size === 3 && savais, q);
    }
    for (const f of [...c.fetes, ...c.symboles]) assert.equal(f.length, 4, `${cle} : ${f[1]}`);
  }
});

test('petites questions : 3 choix à 6 ans (sans les questions « grand »), 4 à 9 ans, pas de doublon', () => {
  for (const croyance of Object.keys(CROYANCES)) {
    const petite = nouvellePartie(question, { age: 6, croyance }, graine(1)).questions;
    assert.ok(petite.every((q) => q.choix.length === 3 && q.choix.includes(q.reponse) && q.savaisTu), croyance);
    assert.equal(new Set(petite.map((q) => q.texte)).size, 10, croyance);
    const grands = CONTENUS[CROYANCES[croyance].contenu].questions.filter((q) => q[4]).map((q) => q[0]);
    assert.ok(!petite.some((q) => grands.includes(q.texte)), croyance);
    const grande = nouvellePartie(question, { age: 9, croyance }, graine(2)).questions;
    assert.ok(grande.every((q) => q.choix.length === 4), croyance);
  }
});

test('dessins : un bâtiment par croyance, seulement des formes et des symboles (pas de personnage)', () => {
  for (const cle of Object.keys(CROYANCES)) {
    const svg = batiment(cle);
    assert.ok(svg && svg.includes('<path'), cle);
    assert.doesNotMatch(svg, /avatar|<text/, cle);
  }
});

test('espace parents : croyance de la famille et religions à découvrir ; le lieu apparaît au village', () => {
  const etat = nouvelEtat('1234');
  const p = ajouterProfil(etat, { prenom: 'Léa', age: 6, avatar: AVATAR_PAR_DEFAUT });
  assert.deepEqual(etat.croyance, { famille: null, decouvrir: [], illustrations: true });
  assert.ok(!dessinerIle(etat.profils, p, etat.croyance.famille).includes('data-lieu="croyance"'));
  reglerCroyance(etat, 'protestant', ['protestant', 'islam', 'bouddhisme']);
  assert.deepEqual(etat.croyance, { famille: 'protestant', decouvrir: ['islam', 'bouddhisme'], illustrations: true }); // pas sa propre croyance
  assert.match(dessinerIle(etat.profils, p, 'protestant'), /data-lieu="croyance"[\s\S]*Le temple/);
  reglerCroyance(etat, 'athee', []);
  assert.match(dessinerIle(etat.profils, p, 'athee'), /La maison des sages/);
  assert.throws(() => reglerCroyance(etat, 'licorne', []));
  assert.throws(() => reglerCroyance(etat, 'islam', ['sagesse']));
  reglerCroyance(etat, null, ['islam']);
  assert.deepEqual(etat.croyance, { famille: null, decouvrir: [], illustrations: true });
  assert.ok(RELIGIONS.every((r) => r in CROYANCES));
  // un ancien enregistrement sans croyance se recharge
  const m = new Map(), stockage = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  delete etat.croyance;
  sauver(etat, stockage);
  assert.deepEqual(charger(stockage).croyance, { famille: null, decouvrir: [], illustrations: true });
});

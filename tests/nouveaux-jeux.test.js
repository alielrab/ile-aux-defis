import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graine } from './hasard.js';
import * as syllabes from '../js/jeux/syllabes.js';
import * as espace from '../js/jeux/espace.js';
import * as cuisine from '../js/jeux/cuisine.js';
import { nouvellePartie, etoilesGagnees } from '../js/partie.js';
import { nouvelEtat, ajouterProfil } from '../js/store.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';
import { BONUS_RECETTE_REELLE } from '../js/reglages.js';
import { dessinerIle, LIEUX } from '../js/carte.js';
import { dessinerPiece } from '../js/maison.js';
import { possede, article } from '../js/catalogue.js';

test('syllabes : 2 syllabes à 6 ans, plus longs à 9 ans, chaque mot avec image et « Le savais-tu ? »', () => {
  assert.ok(syllabes.MOTS_FACILES.length >= 20 && syllabes.MOTS_DIFFICILES.length >= 20);
  assert.ok(syllabes.MOTS_FACILES.every(([d]) => d.split('-').length === 2));
  assert.ok(syllabes.MOTS_DIFFICILES.every(([d]) => d.split('-').length >= 3));
  for (const [d, image, savais] of [...syllabes.MOTS_FACILES, ...syllabes.MOTS_DIFFICILES]) assert.ok(image && savais.length > 15, d);
  assert.equal(syllabes.piege('pa'), 'ba');
  for (const age of [6, 9]) {
    const h = graine(age);
    for (let i = 0; i < 300; i++) {
      const q = syllabes.question({ age }, h);
      assert.equal(q.syllabes.join(''), q.reponse);
      assert.equal(q.tuiles.length, q.syllabes.length + (age === 6 ? 1 : 2), q.reponse);
      assert.equal(new Set(q.tuiles).size, q.tuiles.length, q.reponse); // pas deux tuiles pareilles
      assert.ok(q.syllabes.every((s) => q.tuiles.includes(s)));
    }
  }
});

test('système solaire : poids sur chaque planète, et quiz avec « Le savais-tu ? »', () => {
  const astre = (c) => espace.ASTRES.find((a) => a.cle === c);
  assert.equal(espace.poidsSur(astre('lune'), 30), 5);
  assert.equal(espace.poidsSur(astre('jupiter'), 30), 76);
  assert.equal(espace.poidsSur(astre('mars'), 30), 11);
  assert.equal(espace.ASTRES.filter((a) => a.gravite).length, 9); // 8 planètes + la Lune
  assert.ok(espace.ASTRES.every((a) => a.faits.length === 3));
  assert.match(espace.dessinerVoyage(3), /<svg[\s\S]*fusee/);
  assert.match(espace.dessinerTailles(), /<svg/);
  for (const [banque, n] of [[espace.QUIZ_FACILE, 2], [espace.QUIZ_DIFFICILE, 3]]) {
    assert.ok(banque.length >= 15);
    assert.equal(new Set(banque.map((q) => q[0])).size, banque.length);
    for (const [q, bonne, autres, savais] of banque) assert.ok(autres.length === n && !autres.includes(bonne) && savais, q);
  }
  const p = nouvellePartie(espace.question, { age: 9 }, graine(2)).questions;
  assert.ok(p.every((q) => q.choix.length === 4 && q.savaisTu));
});

test('cuisine : 5 recettes, étapes dans l’ordre, pesées adaptées à l’âge', () => {
  assert.equal(Object.keys(cuisine.RECETTES).length, 5);
  for (const [cle, r] of Object.entries(cuisine.RECETTES)) {
    for (const age of [6, 9]) {
      const qs = cuisine.etapes(cle, age, graine(age));
      const ingredients = qs.filter((q) => q.mode === 'ingredient');
      assert.deepEqual(ingredients.map((q) => q.reponse), r.jeu.map((x) => x[1]));
      for (const q of ingredients) assert.ok(q.choix.includes(q.reponse) && new Set(q.choix).size === q.choix.length && q.choix.length === (age === 6 ? 3 : 4), cle);
      for (const q of qs.filter((x) => x.mode === 'peser')) {
        if (age === 6) assert.equal(q.reponse % 50, 0); // atteignable avec les boutons de 50 g
        assert.equal(q.reponse % Math.min(...q.boutons.map(Math.abs)), 0);
      }
      assert.equal(new Set(qs.map((q) => q.texte)).size, qs.length);
    }
    assert.ok(r.vraie.ingredients.length && r.vraie.etapes.length && r.savaisTu && r.plat, cle);
  }
  assert.equal(etoilesGagnees(7, 1, 7), 9); // sans-faute sur une recette de 7 étapes : bonus
});

test('cuisine : la vraie recette, débloquée en jouant puis validée une seule fois par le parent', () => {
  const etat = nouvelEtat('1234');
  const p = ajouterProfil(etat, { prenom: 'Léa', age: 6, avatar: AVATAR_PAR_DEFAUT });
  assert.ok(!p.objets.length && !possede(p, article('ustensile:poele'))); // pas d'objet de cuisine au départ
  assert.throws(() => cuisine.validerRecette(p, 'crepes'), /Joue d'abord/);
  cuisine.debloquer(p, 'crepes');
  cuisine.validerRecette(p, 'crepes');
  assert.equal(p.etoiles, BONUS_RECETTE_REELLE);
  assert.ok(p.objets.includes('ustensile:poele') && p.maison.places.includes('ustensile:poele'));
  assert.throws(() => cuisine.validerRecette(p, 'crepes'), /déjà/);
  cuisine.debloquer(p, 'crepes');
  assert.equal(p.recettes.crepes, 'faite');
  assert.ok(dessinerPiece(p, 'cuisine').includes('#f2c27a')); // la crêpe dans la poêle
});

test('carte : les 3 nouveaux lieux sont sur l’île', () => {
  for (const id of ['syllabes', 'espace', 'cuisine']) assert.ok(LIEUX.some((l) => l.id === id && l.ouvert));
  const etat = nouvelEtat('1234');
  const p = ajouterProfil(etat, { prenom: 'Léa', age: 6, avatar: AVATAR_PAR_DEFAUT });
  for (const [id, ile] of [['syllabes', 'savoir'], ['espace', 'savoir'], ['cuisine', 'createurs']]) assert.ok(dessinerIle(ile, etat.profils, p).includes(`data-lieu="${id}"`));
});

test('variété : au moins 100 mots et 40 questions d’hôpital par âge, sans doublon', async () => {
  const { FACILES, DIFFICILES } = await import('../js/jeux/corps-questions.js');
  assert.ok(syllabes.MOTS_FACILES.length >= 100 && syllabes.MOTS_DIFFICILES.length >= 100);
  assert.ok(FACILES.length >= 40 && DIFFICILES.length >= 40);
  const mots = [...syllabes.MOTS_FACILES, ...syllabes.MOTS_DIFFICILES].map(([d]) => d.replaceAll('-', ''));
  assert.equal(new Set(mots).size, mots.length);
  for (const [d] of [...syllabes.MOTS_FACILES, ...syllabes.MOTS_DIFFICILES]) assert.equal(new Set(d.split('-')).size, d.split('-').length, d); // pas deux syllabes pareilles
  for (const banque of [FACILES, DIFFICILES]) assert.equal(new Set(banque.map((q) => q[0])).size, banque.length);
});

test('une question ne revient pas tant que les autres n’ont pas été posées', async () => {
  const { FACILES } = await import('../js/jeux/corps-questions.js');
  const corps = await import('../js/jeux/corps.js');
  for (const [jeu, banque, cle, reglage] of [
    [syllabes, syllabes.MOTS_FACILES, (m) => m[0].replaceAll('-', ''), { age: 6 }],
    [espace, espace.QUIZ_DIFFICILE, (q) => q[0], { age: 9 }],
  ]) {
    const vus = new Set(), poses = [];
    const parties = Math.floor(banque.length / 10);
    for (let i = 0; i < parties; i++) poses.push(...nouvellePartie(jeu.question, reglage, graine(i + 1), vus).questions.map((q) => q.texte));
    assert.equal(new Set(poses).size, poses.length, 'pas de répétition avant d’avoir tout vu');
    const suite = nouvellePartie(jeu.question, reglage, graine(99), vus).questions.map((q) => q.texte); // fin du tour, puis nouveau tour
    assert.equal(new Set(suite).size, 10);
    assert.ok(banque.map(cle).every((t) => poses.includes(t) || suite.includes(t)), 'tout a été posé avant de recommencer');
  }
  // l'hôpital à 6 ans : les questions de culture aussi, sur plusieurs parties
  const vus = new Set(), poses = [];
  for (let i = 0; i < 6; i++) poses.push(...nouvellePartie(corps.question, { age: 6 }, graine(i + 7), vus).questions.filter((q) => q.mode === 'choix').map((q) => q.texte));
  assert.equal(new Set(poses).size, poses.length);
  assert.equal(poses.length, 42);
  assert.ok(FACILES.length >= 42);
});

test('restaurant : on lit le mot de l’ingrédient ; courts et différents à 6 ans, proches à 9 ans', () => {
  const nu = (m) => m.replace(/^(la |le |les |l'|l’)/, '');
  for (const cle of Object.keys(cuisine.RECETTES)) {
    for (const age of [6, 9]) {
      for (const q of cuisine.etapes(cle, age, graine(age + 3)).filter((x) => x.mode === 'ingredient')) {
        assert.ok(q.image && q.consigne.includes(q.reponse), q.texte);
        assert.ok(!q.choix.some((c) => /\p{Extended_Pictographic}/u.test(c)), 'pas d’emoji dans les boutons');
        for (const c of q.choix.filter((x) => x !== q.reponse)) {
          assert.ok(!nu(q.reponse).includes(nu(c)) && !nu(c).includes(nu(q.reponse)), `${q.reponse} / ${c}`);
          if (age === 6) assert.ok(nu(c).length <= 5 && nu(c)[0] !== nu(q.reponse)[0], `${q.reponse} / ${c}`);
          else assert.ok(cuisine.distance(nu(c), nu(q.reponse)) <= Math.max(5, nu(q.reponse).length - 1), `${q.reponse} / ${c}`);
        }
      }
    }
  }
  assert.equal(cuisine.distance('farine', 'fraise'), 3);
});

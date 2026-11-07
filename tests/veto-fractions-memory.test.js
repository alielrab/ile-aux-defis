import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as veto from '../js/jeux/veto.js';
import * as fractions from '../js/jeux/fractions.js';
import * as memory from '../js/jeux/memory.js';
import { nouvellePartie } from '../js/partie.js';
import { ANIMAUX } from '../js/catalogue.js';
import { graine } from './hasard.js';

test('vétérinaire : chaque espèce du refuge a sa fiche ; 10 questions justes, sans doublon de choix', () => {
  for (const a of Object.values(ANIMAUX)) assert.ok(veto.FICHES[a.espece]?.besoins && veto.FICHES[a.espece].savais, a.espece);
  for (const age of [6, 9]) {
    const p = nouvellePartie(veto.question, { age, patients: veto.PATIENTS_CLINIQUE }, graine(age));
    assert.equal(p.questions.length, 10);
    for (const q of p.questions) {
      assert.ok(q.choix.includes(q.reponse) && new Set(q.choix).size === q.choix.length, q.texte);
      assert.equal(q.choix.length, age <= 7 ? 3 : 4);
      assert.ok(q.savaisTu, q.texte);
      if (age <= 7) assert.equal(q.mode, 'soin'); // les questions de fiches : pour les grands
    }
  }
});

test('vétérinaire : on soigne ses propres animaux, avec leur prénom ; un seul animal depuis le refuge', () => {
  const profil = { objets: ['animal:chat-noir', 'animal:poisson', 'meuble:lit'], noms: { 'animal:chat-noir': 'Réglisse' } };
  assert.deepEqual(veto.patients(profil), [['animal:chat-noir', 'Réglisse'], ['animal:poisson', 'ton animal']]);
  assert.deepEqual(veto.patients({ objets: [] }), veto.PATIENTS_CLINIQUE);
  const seul = veto.patients(profil, 'animal:poisson');
  const p = nouvellePartie(veto.question, { age: 6, patients: seul }, graine(3));
  for (const q of p.questions) assert.equal(q.patient, 'animal:poisson'); // un poisson : il a seulement faim
  const q = veto.question({ age: 6, patients: [['animal:chat-noir', 'Réglisse']] }, graine(1));
  assert.match(q.consigne, /Réglisse/);
  assert.equal(q.espece, 'chat');
  assert.equal(veto.libelle('🩹 Bander la patte'), 'Bander la patte');
});

test('fractions : les noms, les dessins, et des questions justes pour 6 et 9 ans', () => {
  assert.equal(fractions.dire('1/2'), 'un demi');
  assert.equal(fractions.dire('3/8'), 'trois huitièmes');
  assert.equal(fractions.dire('2/1'), 'deux sur un');
  assert.equal(fractions.libelle('1/4', 6), '1/4 : un quart');
  assert.equal(fractions.libelle('1/4', 9), '1/4');
  const svg = fractions.pizza(4, [0, 1], { cliquable: true });
  assert.equal((svg.match(/data-part=/g) ?? []).length, 4);
  assert.match(svg, /Part 1, garnie/);
  for (const age of [6, 9]) {
    const hasard = graine(age);
    for (let i = 0; i < 400; i++) {
      const q = fractions.question({ age }, hasard);
      if (q.mode === 'garnir') { assert.ok(q.reponse >= 1 && q.reponse < q.d); continue; }
      assert.ok(q.choix.includes(q.reponse) && new Set(q.choix).size === q.choix.length, q.texte);
      if (age <= 7) assert.ok(!['lire', 'comparer', 'egale'].some((t) => q.texte.startsWith(`${t}:`)), q.texte); // pas de vraies fractions à 6 ans
      if (q.mode === 'fraction') assert.ok(fractions.aDire(q).includes(fractions.dire(q.reponse)));
    }
  }
});

test('memory : 6 paires à 6 ans, 10 à 9 ans ; une paire fait rejouer, une erreur passe la main', () => {
  for (const [cle, t] of Object.entries(memory.THEMES)) {
    const cartes = t.cartes();
    assert.ok(cartes.length >= 10, cle);
    assert.equal(new Set(cartes.map((c) => c.cle)).size, cartes.length, cle);
    for (const c of cartes) assert.ok(c.nom && c.dessin && c.savais, `${cle} : ${c.cle}`);
  }
  assert.equal(memory.nouvellePartie('animaux', [{ age: 6 }]).cartes.length, 12);
  assert.equal(memory.nouvellePartie('drapeaux', [{ age: 9 }]).cartes.length, 20);
  const p = memory.nouvellePartie('planetes', [{ prenom: 'A', age: 9 }, { prenom: 'B', age: 6 }], graine(5));
  assert.equal(p.cartes.length, 12); // à deux : selon le plus jeune
  const i = 0, j = p.cartes.findIndex((c, k) => k !== 0 && c.cle === p.cartes[0].cle), autre = p.cartes.findIndex((c) => c.cle !== p.cartes[0].cle);
  assert.equal(memory.retourner(p, i), 'premiere');
  assert.equal(memory.retourner(p, i), 'non');
  assert.equal(memory.retourner(p, j), 'paire');
  assert.deepEqual(p.paires, [1, 0]);
  assert.equal(p.tour, 0); // elle rejoue
  memory.retourner(p, autre);
  const faux = p.cartes.findIndex((c, k) => c.trouvee === null && k !== autre && c.cle !== p.cartes[autre].cle);
  assert.equal(memory.retourner(p, faux), 'ratee');
  assert.equal(memory.retourner(p, 3), 'non'); // deux cartes déjà ouvertes
  memory.cacher(p);
  assert.equal(p.tour, 1);
  // on finit la partie : le joueur 2 trouve tout le reste
  for (const c of [...new Set(p.cartes.filter((x) => x.trouvee === null).map((x) => x.cle))]) {
    const [a, b] = p.cartes.flatMap((x, k) => (x.cle === c ? [k] : []));
    memory.retourner(p, a);
    assert.ok(['paire', 'fini'].includes(memory.retourner(p, b)));
  }
  assert.deepEqual(p.paires, [1, 5]);
  assert.equal(memory.gagnant(p), 1);
  assert.deepEqual(memory.etoiles(p), [0.5, 4]); // 1 × 0,5 (9 ans) ; 5 × 0,75 (6 ans) = 3,75 → 4
});

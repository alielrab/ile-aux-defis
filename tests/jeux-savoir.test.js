import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as dinos from '../js/jeux/dinos.js';
import * as passeport from '../js/jeux/passeport.js';
import * as urgences from '../js/jeux/urgences.js';
import { nouvellePartie } from '../js/partie.js';
import { graine } from './hasard.js';

test('musée : au moins 15 dinosaures, chacun avec ses 4 pièces, sa fiche et son « Le savais-tu ? »', () => {
  assert.ok(dinos.DINOS.length >= 15);
  assert.equal(new Set(dinos.DINOS.map((d) => d.cle)).size, dinos.DINOS.length);
  for (const d of dinos.DINOS) {
    const p = dinos.pieces(d);
    assert.deepEqual(Object.keys(p).sort(), [...dinos.PIECES].sort(), d.cle);
    for (const k of dinos.PIECES) assert.ok(p[k].includes('<path') || p[k].includes('<ellipse'), `${d.cle} ${k}`);
    assert.ok(d.savais && d.trait && d.longueur > 0 && d.ilya, d.cle);
    assert.match(dinos.fiche(d, 9), /mètres[\s\S]*pesait[\s\S]*vivait/);
    assert.match(dinos.dessinerSquelette(d, ['tete'], 'queue'), /a-remplir/);
  }
});

test('musée : quiz fait à partir des fiches ; 3 choix et pas de taille ni d’époque à 6 ans ; 4 choix à 9 ans', () => {
  for (const [age, n] of [[6, 3], [9, 4]]) {
    for (let g = 1; g < 15; g++) {
      for (const q of nouvellePartie(dinos.question, { age }, graine(g + age)).questions) {
        assert.equal(new Set(q.choix).size, n, q.titre);
        assert.ok(q.choix.includes(q.reponse) && q.savaisTu);
        if (age === 6) assert.match(q.texte, /^(regime|trait):/);
      }
    }
  }
});

test('passeport : 20 pays dont la Suisse et ses voisins ; 3 questions ; le tampon à 2 bonnes réponses, une seule fois', () => {
  assert.equal(passeport.PAYS.length, 20);
  for (const c of ['suisse', 'france', 'allemagne', 'italie', 'autriche', 'liechtenstein']) assert.ok(passeport.pays(c), c);
  for (const p of passeport.PAYS) for (const k of ['drapeau', 'capitale', 'savais', 'langue']) assert.ok(p[k], `${p.cle} ${k}`);
  for (const age of [6, 9]) {
    for (const p of passeport.PAYS) {
      const qs = passeport.questions(p.cle, age, graine(age));
      assert.equal(qs.length, 3);
      for (const q of qs) assert.ok(q.choix.length === (age === 6 ? 3 : 4) && new Set(q.choix).size === q.choix.length && q.choix.includes(q.reponse), `${p.cle} ${q.type}`);
      if (age === 6) assert.deepEqual(qs.map((q) => q.type), ['drapeau', 'animal', 'plat']);
    }
  }
  const profil = {};
  assert.equal(passeport.tamponner(profil, 'japon', 1), false);
  assert.equal(passeport.tamponner(profil, 'japon', 2), true);
  assert.equal(passeport.tamponner(profil, 'japon', 3), false);
  assert.deepEqual(profil.passeport, ['japon']);
  assert.match(passeport.dessinerCarte(['japon']), /class="avion"/);
});

test('urgences : 144, 117, 118 ; des situations pour chaque numéro et des cas qui ne sont pas des urgences ; quoi dire', () => {
  assert.deepEqual(urgences.NUMEROS.map((n) => n.numero), ['144', '117', '118']);
  for (const r of ['144', '117', '118', 'pas']) assert.ok(urgences.SITUATIONS.filter((s) => s[2] === r).length >= 3, r);
  assert.equal(urgences.QUOI_DIRE.length, 4);
  for (const age of [6, 9]) {
    for (let g = 1; g < 10; g++) {
      for (const q of nouvellePartie(urgences.question, { age }, graine(g)).questions) {
        assert.equal(q.choix.length, 4);
        assert.ok(q.choix.includes(q.reponse) && q.savaisTu, q.titre);
        if (q.mode === 'situation') assert.ok(q.image);
      }
    }
  }
  assert.ok(!urgences.SITUATIONS.some(([t]) => /mort|sang|tué|cadavre/i.test(t)), 'jamais effrayant');
});

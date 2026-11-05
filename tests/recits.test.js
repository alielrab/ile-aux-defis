import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RECITS, TRADITION, recitsDe, questions, illustration, texteALire } from '../js/recits.js';
import { CROYANCES, RELIGIONS, illustrationsParDefaut } from '../js/croyances.js';
import { cartes, groupes, disponible, CONCLUSION } from '../js/rapprochements.js';
import { nouvelEtat, reglerCroyance, sauver, charger } from '../js/store.js';
import { graine } from './hasard.js';

const toutes = Object.values(RECITS).flat();

test('une vingtaine d’histoires chrétiennes, environ 5 par autre religion ; chaque religion à découvrir en a', () => {
  assert.ok(RECITS.chretien.length >= 20);
  for (const t of ['judaisme', 'islam', 'hindouisme', 'bouddhisme']) assert.ok(RECITS[t].length >= 5, t);
  for (const r of RELIGIONS) assert.ok(recitsDe(CROYANCES[r].contenu).length >= 5, r);
  assert.deepEqual(recitsDe('sagesse'), []);
  assert.ok(Object.values(TRADITION).every((t) => t in RECITS));
});

test('chaque histoire : texte, source, 2 ou 3 questions valides', () => {
  assert.equal(new Set(toutes.map((r) => r.cle)).size, toutes.length);
  for (const r of toutes) {
    assert.ok(r.titre && r.source && r.texte.length >= 3, r.cle);
    assert.ok(r.questions.length >= 2 && r.questions.length <= 3, r.cle);
    for (const [q, bonne, autres, savais] of r.questions) {
      assert.equal(autres.length, 3, q);
      assert.ok(!autres.includes(bonne) && new Set(autres).size === 3 && savais, q);
    }
    assert.ok(texteALire(r).includes(r.texte.at(-1)), r.cle); // tout le texte est lu, pas seulement la première phrase
  }
});

test('questions d’une histoire : dans l’ordre, 3 choix à 6 ans, 4 à 9 ans', () => {
  const r = RECITS.chretien[1];
  const petite = questions(r, 6, graine(1)), grande = questions(r, 9, graine(2));
  assert.deepEqual(petite.map((q) => q.texte), r.questions.map((q) => q[0]));
  assert.ok(petite.every((q) => q.choix.length === 3 && q.choix.includes(q.reponse) && q.savaisTu));
  assert.ok(grande.every((q) => q.choix.length === 4 && q.choix.includes(q.reponse)));
});

test('dessins : aucun personnage sans le réglage ; Dieu jamais ; prophètes de l’islam et divinités hindoues jamais', () => {
  for (const r of toutes) {
    assert.doesNotMatch(illustration(r, false), /class="personnage"/, r.cle);
    assert.equal((illustration(r, true).match(/class="personnage"/g) ?? []).length, r.personnages.length, r.cle);
    assert.ok(!JSON.stringify(r.decor).match(/dieu|allah|divin/i), r.cle);
  }
  assert.ok(RECITS.islam.every((r) => r.personnages.length === 0));
  for (const cle of ['ganesh', 'rama-sita', 'krishna-beurre']) assert.equal(RECITS.hindouisme.find((r) => r.cle === cle).personnages.length, 0);
  // aucun élément de dessin ne porte un nom qui représenterait Dieu
  const src = readFileSync('js/recits.js', 'utf8').split('const ELEMENTS = {')[1].split('\n};')[0];
  assert.doesNotMatch(src, /^\s*(dieu|allah|seigneur|divin)\w*\s*:/im);
});

test('réglage des illustrations : non par défaut pour l’islam, modifiable, gardé sur l’appareil', () => {
  assert.equal(illustrationsParDefaut('islam'), false);
  for (const f of ['catholique', 'protestant', 'judaisme', 'bouddhisme', 'hindouisme', 'athee', null]) assert.equal(illustrationsParDefaut(f), true, f);
  const etat = nouvelEtat('1234');
  reglerCroyance(etat, 'islam', ['catholique']);
  assert.equal(etat.croyance.illustrations, false);
  reglerCroyance(etat, 'islam', ['catholique'], true);
  assert.equal(etat.croyance.illustrations, true);
  const m = new Map(), s = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  sauver(etat, s);
  assert.ok(!m.get('ile-aux-defis').includes('illustrations'));
  assert.equal(charger(s).croyance.illustrations, true);
  // ancien enregistrement sans le réglage : valeur par défaut de la croyance
  m.set('ile-aux-defis-appareil', JSON.stringify({ croyance: { famille: 'islam', decouvrir: [] } }));
  assert.equal(charger(s).croyance.illustrations, false);
});

test('ce qui nous rapproche : seulement les religions choisies, différences pour les 8 ans et plus', () => {
  const choix = { famille: 'catholique', decouvrir: ['islam'] };
  assert.deepEqual(groupes(choix), ['chretien', 'islam']);
  assert.ok(disponible(choix));
  assert.ok(!disponible({ famille: 'protestant', decouvrir: [] }));
  assert.ok(!disponible({ famille: 'catholique', decouvrir: ['orthodoxe'] })); // deux branches chrétiennes : un seul groupe
  const grande = cartes(choix, 9), petite = cartes(choix, 6);
  for (const c of grande) for (const [qui] of c.lignes) assert.match(qui, /chrétiens|musulmans/);
  assert.ok(grande.some((c) => c.titre === 'Qui est Jésus ?'));
  assert.ok(!petite.some((c) => c.grand));
  assert.ok(petite.some((c) => c.titre === "La règle d'or"));
  // « autre croyance » n'est pas présentée comme non croyante
  assert.deepEqual(groupes({ famille: 'autre', decouvrir: ['islam'] }), ['islam']);
  assert.match(CONCLUSION, /respecter/);
  assert.match(CONCLUSION, /parents/);
});

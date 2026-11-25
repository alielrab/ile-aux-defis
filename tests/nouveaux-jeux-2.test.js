import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as nature from '../js/jeux/nature.js';
import * as missions from '../js/jeux/missions.js';
import * as labyrinthe from '../js/jeux/labyrinthe.js';
import * as glacier from '../js/jeux/glacier.js';
import * as ecriture from '../js/jeux/ecriture.js';
import { graine } from './hasard.js';

test('nature et potager : des choix différents dont la bonne réponse ; 3 choix pour les petits, 4 ensuite', () => {
  for (const [banque, jeu] of [[nature.NATURALISTE, nature.naturaliste], [nature.POTAGER, nature.potager]]) {
    assert.ok(banque.faciles.length >= 12 && banque.difficiles.length >= 12);
    for (const [image, titre, bonne, autres] of [...banque.faciles, ...banque.difficiles]) assert.ok(image && titre.endsWith('?') && autres.length === 3 && !autres.includes(bonne) && new Set(autres).size === 3, titre);
    for (const [age, n] of [[6, 3], [9, 4]]) for (let g = 1; g < 40; g++) {
      const q = jeu.question({ age }, graine(g));
      assert.equal(new Set(q.choix).size, n);
      assert.ok(q.choix.includes(q.reponse));
    }
  }
});

test('missions : annoncer, puis un parent valide ; les étoiles une seule fois par jour', () => {
  const p = { etoiles: 0 };
  missions.annoncer(p, 'lit', '2026-11-24');
  assert.equal(missions.etat(p, 'lit', '2026-11-24'), 'attente');
  assert.equal(missions.valider(p, 'table', true, '2026-11-24'), 0); // pas annoncée
  assert.equal(missions.valider(p, 'lit', true, '2026-11-24'), missions.ETOILES_MISSION);
  assert.equal(p.etoiles, missions.ETOILES_MISSION);
  missions.annoncer(p, 'lit', '2026-11-24'); // déjà faite aujourd'hui
  assert.equal(missions.etat(p, 'lit', '2026-11-24'), 'faite');
  assert.equal(missions.valider(p, 'lit', true, '2026-11-24'), 0);
  missions.annoncer(p, 'table', '2026-11-24');
  assert.equal(missions.valider(p, 'table', false, '2026-11-24'), 0); // le parent dit non
  assert.equal(missions.etat(p, 'table', '2026-11-24'), 'libre');
  assert.equal(missions.etat(p, 'lit', '2026-11-25'), 'libre'); // le lendemain
  assert.throws(() => missions.annoncer(p, 'inconnue'));
});

test('labyrinthe : toutes les cases sont reliées, et les murs arrêtent', () => {
  for (const n of [5, 7, 9]) for (let g = 1; g < 15; g++) {
    const l = labyrinthe.creer(n, graine(g));
    const vues = new Set(['0,0']), file = [[0, 0]];
    while (file.length) {
      const c = file.shift();
      for (const d of Object.keys(labyrinthe.DIRECTIONS)) { const s = labyrinthe.avancer(l, c, d); if (!vues.has(String(s))) { vues.add(String(s)); file.push(s); } }
    }
    assert.equal(vues.size, n * n);
    assert.equal(l.ouvert.reduce((s, o) => s + o.length, 0), 2 * (n * n - 1)); // un seul chemin : pas de boucle
    assert.deepEqual(labyrinthe.avancer(l, [0, 0], 'haut'), [0, 0]);
  }
  assert.equal(labyrinthe.taille(6, 0), 5);
  assert.equal(labyrinthe.taille(9, 10), 9);
});

test('glacier : des commandes faisables, de plus en plus dures', () => {
  for (const age of [6, 9]) for (const servies of [0, 6, 30]) for (let g = 1; g < 20; g++) {
    const c = glacier.commande(age, servies, graine(g)), niv = glacier.niveau(servies);
    assert.ok(c.length >= 1 && c.length <= glacier.nbBoulesMax(age, niv));
    assert.ok(c.every((p) => glacier.PARFUMS.slice(0, glacier.nbParfums(age, niv)).some((x) => x.cle === p)));
  }
  assert.ok(glacier.temps(6, 0) > glacier.temps(6, 3) && glacier.temps(6, 99) >= 6);
  assert.ok(glacier.juste(['fraise', 'vanille'], ['fraise', 'vanille']) && !glacier.juste(['fraise', 'vanille'], ['vanille', 'fraise']) && !glacier.juste(['fraise'], []));
});

test('écriture : 26 lettres ; on suit les repères dans l’ordre, en partant du début', () => {
  assert.equal(Object.keys(ecriture.LETTRES).length, 26);
  assert.equal(new Set(ecriture.alphabet(6)).size, 26);
  for (const [l, traits] of Object.entries(ecriture.LETTRES)) for (const t of traits) {
    const r = ecriture.reperes(t);
    assert.ok(r.length >= 3, l);
    for (let i = 1; i < r.length; i++) assert.ok(Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]) <= ecriture.TOLERANCE, l); // pas de trou
    let fait = 0;
    for (const [x, y] of r) fait = ecriture.suivre(r, fait, x, y);
    assert.equal(fait, r.length, l);
  }
  const i = ecriture.reperes(ecriture.LETTRES.I[0]);
  assert.equal(ecriture.suivre(i, 0, 50, 100), 0); // on ne commence pas par la fin
});

test('tour des énigmes : intrus et suites ont 4 choix différents dont la bonne réponse', async () => {
  const x = await import('../js/jeux/enigmes.js');
  for (const age of [6, 9]) for (let g = 1; g < 200; g++) for (const jeu of [x.intrus, x.suites]) {
    const q = jeu.question({ age }, graine(g));
    assert.equal(new Set(q.choix).size, 4, q.texte);
    assert.ok(q.choix.includes(q.reponse) && q.solution && q.consigne, q.texte);
  }
  for (const [, ...listes] of [...x.FAMILLES, ...x.POINTS_COMMUNS]) for (const cle of listes.flat()) assert.ok(x.OBJETS[cle]?.[0], `${cle} : pas de mot`); // chaque image de l'intrus a son mot à lire
  // une suite de nombres suit bien sa règle : l'écart entre deux nombres ne saute jamais sans raison
  const s = x.suites.question({ age: 6 }, () => 0.99); // 0.99 : une suite de nombres, la dernière règle facile (à l'envers, de 1 en 1)
  const vues = s.texte.split(' ').map(Number);
  assert.deepEqual(vues.map((v, i) => (i ? vues[i - 1] - v : 1)), [1, 1, 1, 1, 1]);
  assert.equal(s.reponse, vues[4] - 1);
});

test('potions : on verse sur la même couleur ou dans une fiole vide ; chaque niveau est faisable ; un niveau réussi ouvre le suivant', async () => {
  const x = await import('../js/jeux/enigmes.js');
  const etat = [[0, 1, 1], [1, 0], [], [0, 0, 0]];
  assert.deepEqual(x.verser(etat, 0, 2, 3), [[0], [1, 0], [1, 1], [0, 0, 0]]); // les deux couches du dessus partent ensemble
  assert.equal(x.verser(etat, 0, 1, 3), null); // pas la même couleur
  assert.equal(x.verser(etat, 1, 3, 3), null); // fiole pleine
  assert.equal(x.verser(etat, 2, 0, 3), null); // rien à verser
  assert.deepEqual(x.verser([[1, 0, 0], [0], []], 0, 1, 3), [[1], [0, 0, 0], []]);
  assert.ok(x.potionsTriees([[0, 0, 0], [], [1, 1, 1]], 3) && !x.potionsTriees([[0, 0], [0], [1, 1, 1]], 3));
  assert.ok(!x.resoluble([[0, 1], [1, 0]], 2)); // sans fiole vide, on est bloqué
  for (const age of [6, 9]) {
    const niveaux = x.niveauxPotions(age);
    assert.ok(niveaux.length >= 10);
    niveaux.forEach(([couleurs, hauteur], n) => {
      const p = x.potionsDuNiveau(n, age);
      assert.equal(p.etat.length, couleurs + 2);
      assert.deepEqual(p.etat.flat().sort(), Array.from({ length: couleurs * hauteur }, (_, i) => i % couleurs).sort());
      assert.ok(!x.potionsTriees(p.etat, hauteur) && x.resoluble(p.etat, hauteur), `niveau ${n + 1}, ${age} ans`);
      assert.deepEqual(x.potionsDuNiveau(n, age).etat, p.etat); // le même niveau pour tout le monde
    });
  }
  const p = { age: 6, etoiles: 0 };
  assert.throws(() => x.terminerPotion(p, 1), /pas encore ouvert/);
  assert.equal(x.terminerPotion(p, 0), x.ETOILES_POTION);
  assert.equal(x.terminerPotion(p, 0), 0); // rejouer un niveau réussi ne redonne pas d'étoiles
  assert.equal(x.terminerPotion(p, 1), x.ETOILES_POTION);
  assert.deepEqual([p.etoiles, x.potionsReussies(p), x.potionsReussies({ ...p, age: 9 })], [2 * x.ETOILES_POTION, 2, 0]); // chaque âge a sa série
});

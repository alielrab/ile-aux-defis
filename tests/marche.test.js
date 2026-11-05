import { test } from 'node:test';
import assert from 'node:assert/strict';
import { question, ecrire, dire, decomposer, aDire, dessinArgent, ARGENT, ARTICLES } from '../js/jeux/marche.js';
import { nouvellePartie } from '../js/partie.js';
import { graine } from './hasard.js';

test('écrire et dire les prix comme en Suisse', () => {
  assert.equal(ecrire(300), 'Fr. 3.–');
  assert.equal(ecrire(740), 'Fr. 7.40');
  assert.equal(ecrire(5), 'Fr. 0.05');
  assert.equal(dire(100), '1 franc');
  assert.equal(dire(740), '7 francs 40');
  assert.equal(dire(50), '50 centimes');
});

test('décomposer un montant avec les pièces permises', () => {
  assert.deepEqual(decomposer(800, [100, 200, 500]), [500, 200, 100]);
  assert.deepEqual(decomposer(1785, [5, 10, 20, 50, 100, 200, 500, 1000]), [1000, 500, 200, 50, 20, 10, 5]);
  assert.equal(decomposer(3, [5, 10]), null);
});

test('7 ans et moins : prix ronds jusqu’à 10 francs, pièces de 1, 2, 5 francs, 3 choix', () => {
  for (let g = 1; g < 30; g++) {
    const { questions } = nouvellePartie(question, { age: 6 }, graine(g));
    for (const q of questions) {
      assert.ok(['compter', 'payer'].includes(q.mode), q.mode);
      if (q.mode === 'payer') {
        assert.ok(q.prix % 100 === 0 && q.prix >= 100 && q.prix <= 1000, q.texte);
        const [, , bas, haut] = ARTICLES.find(([, nom]) => q.titre.toLowerCase().startsWith(nom));
        assert.ok(q.prix <= Math.max(100, haut), q.texte); // prix réaliste
        assert.deepEqual(q.valeurs, [100, 200, 500]);
        assert.ok(decomposer(q.prix, q.valeurs));
      } else {
        assert.ok(q.pieces.every((p) => [100, 200, 500].includes(p)));
        assert.equal(q.choix.length, 3);
        assert.ok(q.choix.includes(q.reponse) && new Set(q.choix).size === 3 && q.choix.every((c) => c > 0));
      }
      assert.ok(aDire(q).length > 20);
    }
  }
});

test('8 ans et plus : centimes, rendre la monnaie juste, 4 choix proches', () => {
  const modes = new Set();
  for (let g = 1; g < 30; g++) {
    for (const q of nouvellePartie(question, { age: 9 }, graine(g)).questions) {
      modes.add(q.mode);
      if (q.mode === 'payer') assert.ok(q.prix % 5 === 0 && q.prix >= 50 && q.prix <= 1900 && decomposer(q.prix, q.valeurs));
      if (q.mode === 'rendre') {
        assert.equal(q.reponse, q.donne - q.prix);
        assert.ok(q.donne > q.prix);
        assert.ok(q.choix.every((c) => Math.abs(c - q.reponse) <= 200), q.texte); // pièges proches
      }
      if (q.choix) {
        assert.equal(q.choix.length, 4);
        assert.ok(q.choix.includes(q.reponse) && new Set(q.choix).size === 4 && q.choix.every((c) => c > 0), q.texte);
      }
    }
  }
  assert.deepEqual([...modes].sort(), ['compter', 'payer', 'rendre']);
});

test('les vraies erreurs sont proposées : oubli de la retenue, centimes recopiés', () => {
  let retenue = 0, recopie = 0;
  for (let g = 1; g < 300; g++) {
    const q = question({ age: 9 }, graine(g));
    if (q.mode !== 'rendre' || !(q.prix % 100)) continue;
    if (q.choix.includes(q.reponse + 100)) retenue++;
    if (q.choix.includes(q.donne - Math.floor(q.prix / 100) * 100 + (q.prix % 100))) recopie++; // 10 − 7.40 → 3.40
  }
  assert.ok(retenue > 5 && recopie > 5, `${retenue} / ${recopie}`);
});

test('chaque pièce et billet a un dessin', () => {
  for (const [v] of ARGENT) assert.match(dessinArgent(v), /<svg/);
});

test('accord : « les carottes coûtent », « la pomme coûte »', () => {
  for (let g = 1; g < 200; g++) {
    const q = question({ age: 9 }, graine(g));
    if (q.titre.startsWith('Les ')) assert.match(q.titre, /coûtent/);
    else if (q.prix) assert.match(q.titre, /coûte /);
  }
});

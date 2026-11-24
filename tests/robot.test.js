import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as robot from '../js/jeux/robot.js';
import { graine } from './hasard.js';

const niveau = { taille: 3, depart: [0, 0], but: [2, 0], rochers: [[1, 0]] };

test('robot : il suit les flèches, se cogne aux rochers et aux bords, et gagne sur l’étoile', () => {
  assert.deepEqual(robot.executer(niveau, ['droite']), { chemin: [[0, 0]], cogne: 0, gagne: false }); // le rocher
  assert.equal(robot.executer(niveau, ['haut']).cogne, 0); // le bord
  assert.equal(robot.executer(niveau, ['bas']).gagne, false); // pas arrivé
  const r = robot.executer(niveau, ['bas', 'droite', 'droite', 'haut', 'gauche']); // s'arrête sur l'étoile
  assert.equal(r.gagne, true);
  assert.equal(r.chemin.length, 5);
  assert.deepEqual(robot.plusCourt(niveau), ['bas', 'droite', 'droite', 'haut']);
  assert.equal(robot.plusCourt({ ...niveau, rochers: [[1, 0], [0, 1]] }), null); // enfermé
});

test('robot : chaque niveau est faisable, dans la limite de flèches, et grandit avec l’âge', () => {
  for (const age of [6, 9]) for (let g = 1; g < 30; g++) for (const numero of [0, 5, 9]) {
    const q = robot.question({ age }, graine(g * 10 + numero), numero);
    const chemin = robot.plusCourt(q);
    assert.ok(chemin && chemin.length >= 1 && chemin.length <= robot.PROGRAMME_MAX, q.texte);
    assert.equal(robot.executer(q, chemin).gagne, true);
    assert.equal(q.taille, age <= 7 ? 4 : 5);
  }
});

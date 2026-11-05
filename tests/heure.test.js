import { test } from 'node:test';
import assert from 'node:assert/strict';
import { question, ecrire, dire, avecMinutes, avecHeure, minutesDepuisAngle, angleHeures, dessinerHorloge } from '../js/jeux/heure.js';
import { graine } from './hasard.js';

const echantillon = (age, n = 400) => { const h = graine(age); return Array.from({ length: n }, () => question({ age }, h)); };

test('écrire et dire l’heure', () => {
  assert.deepEqual([0, 60, 210, 185, 765 % 720].map(ecrire), ['12 h', '1 h', '3 h 30', '3 h 05', '12 h 45']);
  assert.deepEqual([60, 195, 210, 225, 705, 200].map(dire),
    ['1 heure', '3 heures et quart', '3 heures et demie', '4 heures moins le quart', '12 heures moins le quart', '3 heures 20']);
});

test('la grande aiguille fait avancer l’heure en passant le 12, comme une vraie horloge', () => {
  assert.equal(avecMinutes(3 * 60 + 55, 0), 4 * 60); // 3 h 55 → 4 h
  assert.equal(avecMinutes(4 * 60 + 5, 50), 3 * 60 + 50); // 4 h 05 → 3 h 50
  assert.equal(avecMinutes(11 * 60 + 50, 5), 5); // 11 h 50 → 12 h 05
  assert.equal(avecMinutes(2 * 60, 30), 2 * 60 + 30);
  assert.equal(minutesDepuisAngle(358, 5), 0);
  assert.equal(minutesDepuisAngle(95, 15), 15);
  assert.equal(avecHeure(30, angleHeures(7 * 60 + 30)), 7 * 60 + 30); // petite aiguille sur 7 h 30, minutes gardées
  assert.equal(avecHeure(0, 359), 0);
});

test('7 ans et moins : heures pile et demies, 3 choix ; 8 ans et plus : quarts et 5 minutes, 4 choix', () => {
  for (const [age, n, minutes] of [[6, 3, [0, 30]], [9, 4, null]]) {
    const qs = echantillon(age);
    for (const q of qs) {
      assert.ok(q.reponse >= 0 && q.reponse < 720 && q.reponse % 5 === 0);
      if (minutes) assert.ok(minutes.includes(q.reponse % 60));
      if (q.mode === 'lire') {
        assert.equal(q.choix.length, n);
        assert.equal(new Set(q.choix).size, n);
        assert.ok(q.choix.includes(q.reponse) && q.choix.every((c) => c >= 0 && c < 720));
      } else {
        const ecart = (a, b, tour) => Math.min(Math.abs(a - b) % tour, tour - (Math.abs(a - b) % tour));
        assert.ok(ecart(q.depart % 60, q.reponse % 60, 60) >= 20, `grande aiguille loin : ${q.depart} / ${q.reponse}`);
        assert.ok(ecart(angleHeures(q.depart), angleHeures(q.reponse), 360) >= 60, `petite aiguille loin : ${q.depart} / ${q.reponse}`);
        assert.equal(q.reponse % q.pas, 0); // l'heure demandée est atteignable avec le pas de l'aiguille
      }
    }
    assert.ok(qs.some((q) => q.mode === 'lire') && qs.some((q) => q.mode === 'regler'));
    if (!minutes) assert.ok(qs.some((q) => ![0, 15, 30, 45].includes(q.reponse % 60)));
  }
});

test('l’horloge dessine ses 12 chiffres et ses deux aiguilles', () => {
  const svg = dessinerHorloge(210);
  for (let i = 1; i <= 12; i++) assert.ok(svg.includes(`>${i}</text>`));
  assert.ok(svg.includes('data-aiguille="h" transform="rotate(105 150 150)"') && svg.includes('data-aiguille="m" transform="rotate(180 150 150)"'));
  assert.ok(!svg.includes('3 h 30'), 'pas la réponse dans l’étiquette de lecture');
});

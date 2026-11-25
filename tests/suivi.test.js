import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as s from '../js/suivi.js';
import { enigmeDuJour } from '../js/jeux/enigmes.js';

const le = (j) => new Date(`${j}T10:00:00`);

test('série de jours : +1 par jour, 10 étoiles le 7e jour de suite, retour à 1 si on saute un jour', () => {
  const p = { etoiles: 0 };
  assert.deepEqual(s.visiter(p, le('2026-11-23')), { nouveau: true, serie: 1, gain: s.ETOILES_VISITE });
  assert.equal(s.visiter(p, le('2026-11-23')).nouveau, false); // une seule fois par jour
  for (let j = 24; j <= 28; j++) s.visiter(p, le(`2026-11-${j}`));
  assert.deepEqual(s.visiter(p, le('2026-11-29')), { nouveau: true, serie: 7, gain: s.ETOILES_SEPTIEME });
  assert.equal(p.etoiles, 6 * s.ETOILES_VISITE + s.ETOILES_SEPTIEME);
  assert.equal(s.visiter(p, le('2026-12-01')).serie, 1); // le 30 novembre a été sauté
  assert.equal(s.serieEnCours(p, le('2026-12-02')), 1);
  assert.equal(s.serieEnCours(p, le('2026-12-03')), 0);
});

test('coffre : une fois par semaine (du lundi au dimanche), entre 5 et 15 étoiles ; énigme du jour : une réponse par jour', () => {
  const p = { etoiles: 0 };
  assert.equal(s.semaine(le('2026-11-29')), '2026-11-23'); // un dimanche : la semaine du lundi 23
  assert.equal(s.ouvrirCoffre(p, le('2026-11-25'), () => 0.999), s.COFFRE[1]);
  assert.equal(s.ouvrirCoffre(p, le('2026-11-29')), 0);
  assert.equal(s.ouvrirCoffre(p, le('2026-11-30'), () => 0), s.COFFRE[0]); // lundi : un nouveau coffre
  assert.equal(s.repondreEnigme(p, true, le('2026-11-30')), s.ETOILES_ENIGME);
  assert.equal(s.repondreEnigme(p, true, le('2026-11-30')), 0);
  assert.ok(s.enigmeFaite(p, le('2026-11-30')) && !s.enigmeFaite(p, le('2026-12-01')));
  for (const age of [6, 9]) {
    const q = enigmeDuJour(age, '2026-11-30');
    assert.deepEqual(enigmeDuJour(age, '2026-11-30'), q); // la même pour tout le monde ce jour-là
    assert.ok(q.choix.includes(q.reponse) && q.consigne && q.solution && ['intrus', 'suites'].includes(q.jeu));
  }
  assert.ok(new Set(Array.from({ length: 30 }, (_, i) => enigmeDuJour(9, `2026-12-${String(i + 1).padStart(2, '0')}`).texte)).size > 20); // elle change d'un jour à l'autre
});

test('résumé pour les parents : jours joués, jeux les plus joués, ce qui est réussi et ce qui est à revoir ; 4 semaines gardées', () => {
  const p = { etoiles: 0 };
  s.noterPartie(p, 'calcul', 9, 10, le('2026-11-23'));
  s.noterPartie(p, 'calcul', 8, 10, le('2026-11-24'));
  s.noterPartie(p, 'heure', 3, 10, le('2026-11-24'));
  s.noterPartie(p, 'potions', null, null, le('2026-11-24'));
  s.noterPartie(p, 'tri', 5, 10, le('2026-11-17'));
  const r = s.resume(p, le('2026-11-26'));
  assert.deepEqual([r.jours, r.parties, r.partiesAvant], [2, 4, 1]);
  assert.equal(r.plusJoues[0], 'le calcul (2)');
  assert.deepEqual([r.reussis, r.aRevoir], [['le calcul'], ['lire l’heure']]);
  for (let i = 1; i <= 6; i++) s.noterPartie(p, 'calcul', 1, 1, le(`2027-01-${String(i * 4).padStart(2, '0')}`));
  assert.ok(Object.keys(p.journal).length <= 4);
  assert.deepEqual(s.resume({}, le('2026-11-26')).plusJoues, []); // un profil sans journal
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { messageReponse, auHasard, FELICITATIONS, ENCOURAGEMENTS, SERIES } from '../js/messages.js';
import { choisirVoix } from '../js/voix.js';
import { nouvellePartie, repondre, questionEnCours } from '../js/partie.js';
import { graine } from './hasard.js';

test('félicitations variées, jamais deux fois la même d’affilée', () => {
  const h = graine(3);
  const vus = [];
  for (let i = 0; i < 200; i++) vus.push(messageReponse(true, 1, h));
  assert.ok(vus.every((m) => m.type === 'felicitation' && FELICITATIONS.includes(m.texte)));
  assert.ok(new Set(vus.map((m) => m.texte)).size >= 8);
  for (let i = 1; i < vus.length; i++) assert.notEqual(vus[i].texte, vus[i - 1].texte);
});

test('encouragement en cas d’erreur, message spécial pour les séries', () => {
  const e = messageReponse(false, 0);
  assert.equal(e.type, 'encouragement');
  assert.ok(ENCOURAGEMENTS.includes(e.texte));
  assert.deepEqual(messageReponse(true, 3), { type: 'serie', texte: SERIES[3] });
  assert.deepEqual(messageReponse(true, 5), { type: 'serie', texte: SERIES[5] });
  assert.equal(messageReponse(true, 4).type, 'felicitation');
});

test('auHasard marche avec une seule phrase', () => {
  assert.equal(auHasard(['seule']), 'seule');
  assert.equal(auHasard(['seule']), 'seule');
});

test('série : compte les bonnes réponses d’affilée, repart à 0 après une erreur', () => {
  let i = 0;
  const p = nouvellePartie(() => ({ texte: String(i), reponse: i++ }), 1);
  const series = [];
  for (const juste of [true, true, true, false, true]) {
    repondre(p, juste ? questionEnCours(p).reponse : -1);
    series.push(p.serie);
  }
  assert.deepEqual(series, [1, 2, 3, 0, 1]);
});

test('voix : la plus naturelle en français, seulement les voix installées hors-ligne', () => {
  const v = (name, lang, localService) => ({ name, lang, localService });
  const voix = [
    v('Microsoft Hortense', 'fr-FR', true),
    v('Microsoft Denise Online (Natural)', 'fr-FR', false),
    v('Google français', 'fr-FR', true),
    v('Samantha', 'en-US', true),
    v('Amélie', 'fr-CA', true),
  ];
  assert.equal(choisirVoix(voix, true).name, 'Microsoft Denise Online (Natural)');
  assert.equal(choisirVoix(voix, false).name, 'Google français');
  assert.equal(choisirVoix([v('Samantha', 'en-US', true)]), null);
  assert.equal(choisirVoix([v('Amélie', 'fr_CA', true), v('Thomas', 'fr_FR', true)]).name, 'Thomas');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { accorder } from '../js/genre.js';
import { FELICITATIONS, SERIES } from '../js/messages.js';
import { nouvelEtat, ajouterProfil, modifierProfil, charger, sauver } from '../js/store.js';
import { AVATAR_DE_DEPART, COIFFURES_DE_DEPART, TENUES_DE_DEPART, avatarValide, dessinerAvatar } from '../js/avatar.js';
import { CATALOGUE, possede } from '../js/catalogue.js';

test('accorder : « {fort|forte} » selon le genre ; un texte sans marque ne change pas', () => {
  assert.equal(accorder('Tu es trop {fort|forte} !', 'garcon'), 'Tu es trop fort !');
  assert.equal(accorder('Tu es trop {fort|forte} !', 'fille'), 'Tu es trop forte !');
  assert.equal(accorder('Tu n’es pas {seul|seule}, {quel champion|quelle championne} !', 'garcon'), 'Tu n’es pas seul, quel champion !');
  assert.equal(accorder('Bonjour !', 'garcon'), 'Bonjour !');
  assert.ok(FELICITATIONS.includes('Tu es trop {fort|forte} !'));
  assert.match(SERIES[7], /\{quel champion\|quelle championne\}/);
});

test('aucun texte ne s’adresse à l’enfant au féminin seulement', () => {
  for (const f of ['js/messages.js', 'js/jeux/emotions.js', 'js/jeux/urgences.js', 'js/jeux/corps-questions.js', 'js/app.js', 'index.html']) {
    const s = readFileSync(f, 'utf8');
    assert.doesNotMatch(s, /trop forte|quelle championne !'|pas seule\.|fier ou fière|tu es enrhumé \?|Changer de joueuse/, f);
  }
});

test('profil : fille ou garçon à la création, modifiable ; les anciens profils sont des filles', () => {
  const etat = nouvelEtat('1234');
  const g = ajouterProfil(etat, { prenom: 'Noé', age: 6, avatar: AVATAR_DE_DEPART.garcon, genre: 'garcon' });
  assert.equal(g.genre, 'garcon');
  assert.throws(() => ajouterProfil(etat, { prenom: 'X', age: 6, avatar: AVATAR_DE_DEPART.fille, genre: 'autre' }), /fille ou garçon/);
  modifierProfil(g, { prenom: 'Noé', age: 7, genre: 'fille' });
  assert.equal(g.genre, 'fille');
  const m = new Map(), s = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  m.set('ile-aux-defis', JSON.stringify({ version: 2, code: '1234', profils: [{ id: 0, prenom: 'Léa', age: 6, avatar: { ...AVATAR_DE_DEPART.fille } }] }));
  assert.equal(charger(s).profils[0].genre, 'fille');
});

test('avatar de départ pour les garçons : coiffures et tenues gratuites, accessibles à tous ; rien n’est réservé', () => {
  assert.ok(avatarValide(AVATAR_DE_DEPART.garcon));
  for (const c of ['courts', 'tres-courts', 'meche', 'herisses']) assert.ok(COIFFURES_DE_DEPART.includes(c), c);
  for (const t of ['polo-vert', 'chemise-carreaux', 'sweat-gris', 'tshirt-rayures']) assert.ok(TENUES_DE_DEPART.includes(t), t);
  for (const c of ['tres-courts', 'meche', 'herisses']) assert.match(dessinerAvatar({ ...AVATAR_DE_DEPART.garcon, coiffure: c }), /<svg/);
  // le catalogue ne connaît pas le genre : les mêmes objets pour tous
  assert.ok(!CATALOGUE.some((a) => 'genre' in a || /fille|garçon/i.test(a.nom)));
  const fille = { objets: [] }, garcon = { objets: [] };
  for (const a of CATALOGUE) assert.equal(possede(fille, a), possede(garcon, a));
});

test('la liste des phrases à enregistrer a les deux versions', () => {
  const csv = readFileSync('voix/phrases.csv', 'utf8');
  assert.match(csv, /message\.felicitation\.5\.garcon;Messages;Tu es trop fort !/);
  assert.match(csv, /message\.felicitation\.5\.fille;Messages;Tu es trop forte !/);
  assert.ok(!csv.includes('{'));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dessinerIle, dessinerArchipel, LIEUX, lieuxDe } from '../js/carte.js';
import { ILES, ileOuverte, prixIle, debloquerIle } from '../js/archipel.js';
import { PRIX_ILES } from '../js/reglages.js';
import { nouvelEtat, ajouterProfil, charger, sauver, remettreAZero } from '../js/store.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';

const profils = [
  { id: 0, prenom: 'Léa', age: 6, avatar: AVATAR_PAR_DEFAUT, etoiles: 0, iles: [] },
  { id: 1, prenom: '<b>Zoé</b>', age: 9, avatar: AVATAR_PAR_DEFAUT, etoiles: 0, iles: [] },
];

test('chaque lieu est sur une île connue ; chaque île montre ses lieux et le bateau', () => {
  for (const l of LIEUX) assert.ok(ILES.some((i) => i.id === l.ile), l.id);
  for (const i of ILES) {
    const svg = dessinerIle(i.id, profils, profils[0]);
    for (const l of lieuxDe(i.id)) assert.ok(svg.includes(`data-lieu="${l.id}"`), `${i.id} : ${l.id}`);
    for (const l of LIEUX.filter((x) => x.ile !== i.id)) assert.ok(!svg.includes(`data-lieu="${l.id}"`), `${i.id} : pas ${l.id}`);
    assert.ok(svg.includes('data-lieu="archipel"'), i.id);
  }
});

test('les bonnes îles : village (maisons, magasins), savoir (école…), créateurs (cuisine), cœur (lieu de culte)', () => {
  const ou = (id) => LIEUX.find((l) => l.id === id)?.ile;
  for (const id of ['coiffeur', 'mode', 'meubles', 'chantier']) assert.equal(ou(id), 'village', id);
  for (const id of ['calcul', 'syllabes', 'espace', 'corps', 'heure']) assert.equal(ou(id), 'savoir', id);
  for (const id of ['cuisine', 'peinture', 'bd', 'musique']) assert.equal(ou(id), 'createurs', id);
  for (const id of ['confiance', 'emotions']) assert.equal(ou(id), 'coeur', id);
  assert.deepEqual(lieuxDe('coeur', 'islam').map((l) => l.id).sort(), ['confiance', 'croyance', 'emotions', 'missions']);
  // seule la maison de la joueuse s'ouvre, et seulement sur l'île du village
  const svg = dessinerIle('village', profils, profils[0]);
  assert.equal(svg.match(/data-lieu="maison"/g).length, 1);
  assert.match(svg, /aria-label="Ma maison \(Léa\)"/);
  assert.ok(!dessinerIle('savoir', profils, profils[0]).includes('data-lieu="maison"'));
});

test('les prénoms sont échappés', () => {
  const svg = dessinerIle('village', profils, profils[1]);
  assert.ok(!svg.includes('<b>'));
  assert.ok(svg.includes('&#60;b&#62;Zoé'));
});

test('un prénom long rétrécit pour ne pas déborder sur la maison voisine', () => {
  const longs = [{ ...profils[0], prenom: 'Marie-Charlotte-Anne' }, profils[1]];
  assert.match(dessinerIle('village', longs, longs[1]), /font-size="18"[^>]*textLength="112"[^>]*>Marie-Charlotte-Anne</);
  assert.match(dessinerIle('village', profils, profils[1]), /font-size="26"[^>]*>Léa</);
});

test('jusqu’à 4 maisons ; au-delà, celle de la joueuse et 3 autres', () => {
  const beaucoup = Array.from({ length: 6 }, (_, i) => ({ id: `e${i}`, prenom: `Enfant${i}`, age: 7, avatar: AVATAR_PAR_DEFAUT }));
  const maisons = (svg) => svg.match(/class="lieu maison/g).length;
  assert.equal(maisons(dessinerIle('village', beaucoup.slice(0, 3), beaucoup[0])), 3);
  const svg = dessinerIle('village', beaucoup, beaucoup[5]);
  assert.equal(maisons(svg), 4);
  assert.match(svg, /aria-label="Ma maison \(Enfant5\)"/);
});

test('archipel : village et savoir ouverts ; les autres îles ont un prix réglable, débloqué avec les étoiles', () => {
  const p = { etoiles: 50, iles: [] };
  assert.ok(ileOuverte(p, 'village') && ileOuverte(p, 'savoir'));
  assert.ok(!ileOuverte(p, 'createurs') && !ileOuverte(p, 'coeur'));
  assert.equal(prixIle('createurs'), PRIX_ILES.createurs);
  const svg = dessinerArchipel(p);
  for (const i of ILES) assert.ok(svg.includes(`data-ile="${i.id}"`), i.id);
  assert.match(svg, new RegExp(`⭐ ${PRIX_ILES.coeur}`));
  assert.equal(svg.match(/class="ile fermee"/g).length, 2);
  assert.match(svg, /Bientôt…/); // de la place pour d'autres îles
  debloquerIle(p, 'createurs');
  assert.equal(p.etoiles, 50 - PRIX_ILES.createurs);
  assert.deepEqual(p.iles, ['createurs']);
  assert.throws(() => debloquerIle(p, 'createurs'), /déjà/);
  assert.throws(() => debloquerIle({ etoiles: 3, iles: [] }, 'coeur'), /étoiles/);
  assert.throws(() => debloquerIle(p, 'village'), /déjà/);
  assert.match(dessinerArchipel(p, 'coeur'), /Touche encore/);
});

test('profils : les anciens profils gardent leurs données et reçoivent une liste d’îles vide ; la remise à zéro referme les îles', () => {
  const m = new Map(), s = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  const ancien = { id: 0, prenom: 'Léa', age: 6, avatar: { ...AVATAR_PAR_DEFAUT, accessoires: [] }, etoiles: 42, objets: ['meuble:lit'], maison: { piece: 'chambre', papiers: {}, places: ['meuble:lit'] }, recettes: { crepes: 'faite' }, vus: {} };
  m.set('ile-aux-defis', JSON.stringify({ version: 2, code: '1234', profils: [ancien] }));
  const p = charger(s).profils[0];
  assert.deepEqual(p.iles, []);
  assert.equal(p.etoiles, 42);
  assert.deepEqual([p.objets, p.recettes], [['meuble:lit'], { crepes: 'faite' }]);
  const etat = nouvelEtat('1234');
  const n = ajouterProfil(etat, { prenom: 'Zoé', age: 9, avatar: AVATAR_PAR_DEFAUT });
  assert.deepEqual(n.iles, []);
  n.etoiles = 30;
  debloquerIle(n, 'coeur');
  sauver(etat, s);
  assert.deepEqual(charger(s).profils[0].iles, ['coeur']);
  remettreAZero(n);
  assert.deepEqual(n.iles, []);
});

test('nouveau style : un bâtiment dont l’image est prête est montré en image, sur l’île et sur l’archipel ; les autres gardent leur dessin', async () => {
  const { dessinerIle, dessinerArchipel, lieuCroyance } = await import('../js/carte.js');
  const j = { id: 'a', prenom: 'Lina', age: 8, avatar: (await import('../js/avatar.js')).AVATAR_PAR_DEFAUT, iles: [] };
  assert.ok(!dessinerIle('village', [j], j).includes('<image'));
  globalThis.IMAGES = ['images/ile/refuge.webp', 'images/ile/maison.webp', 'images/ile/croyance-islam.webp'];
  try {
    const village = dessinerIle('village', [j], j);
    assert.equal(village.match(/<image href="images\/ile\/(refuge|maison)\.webp"/g).length, 2); // le coiffeur garde son dessin
    assert.match(village, /data-lieu="refuge"[\s\S]*?<image/);
    assert.equal(lieuCroyance('islam').fichier, 'croyance-islam');
    assert.equal(lieuCroyance('athee').fichier, 'croyance-sagesse');
    assert.ok(dessinerArchipel(j).includes('images/ile/'));
  } finally { delete globalThis.IMAGES; }
});

test('nouveau style : sur une île en image, les lieux et les maisons se posent sur ses emplacements', async () => {
  const { dessinerIle, dessinerArchipel } = await import('../js/carte.js');
  const j = { id: 'a', prenom: 'Lina', age: 8, avatar: (await import('../js/avatar.js')).AVATAR_PAR_DEFAUT, iles: ['coeur'] };
  const avant = dessinerIle('savoir', [j], j);
  globalThis.IMAGES = ['images/ile/fond-savoir.webp', 'images/ile/fond-coeur.webp', 'images/ile/fond-village.webp', 'images/ile/calcul.webp'];
  try {
    const savoir = dessinerIle('savoir', [j], j);
    assert.ok(savoir.includes('images/ile/fond-savoir.webp') && !savoir.includes('stroke="#ecd59a"'), 'le fond en image remplace l’île et ses chemins dessinés');
    assert.equal(savoir.match(/data-lieu="/g).length, avant.match(/data-lieu="/g).length); // les 8 lieux et le bateau sont toujours là
    assert.match(savoir, /<image href="images\/ile\/calcul\.webp" x="339" /); // l'école, sur le premier emplacement (au milieu, en haut)
    assert.ok(!savoir.includes('NaN') && !savoir.includes('undefined'));
    const coeur = dessinerIle('coeur', [j], j); // 2 lieux et le grand arbre, pour 4 emplacements
    assert.ok(coeur.includes('fond-coeur.webp') && !coeur.includes('NaN'));
    for (const n of [1, 2, 3, 4, 6]) { // le village : 8 lieux sur le tour, les maisons sur les deux emplacements du milieu
      const enfants = [j, ...[...Array(n - 1)].map((_, i) => ({ ...j, id: `b${i}`, prenom: `E${i}` }))];
      const village = dessinerIle('village', enfants, j);
      assert.ok(village.includes('fond-village.webp') && !village.includes('NaN') && !village.includes('undefined'), `${n} enfants`);
      assert.equal(village.match(/class="lieu maison/g).length, Math.min(n, 4));
      assert.equal(village.match(/data-lieu="/g).length, 10); // 8 lieux, ma maison, le bateau
    }
    const archipel = dessinerArchipel(j);
    assert.equal(archipel.match(/images\/ile\/fond-/g).length, 3); // savoir, cœur et village en image sur la carte de l'archipel
  } finally { delete globalThis.IMAGES; }
});

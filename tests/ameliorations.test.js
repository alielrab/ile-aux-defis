import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as jardinage from '../js/jeux/jardinage.js';
import * as nature from '../js/jeux/nature.js';
import { medaille, dessinerIle, LIEUX } from '../js/carte.js';
import { AVATAR_PAR_DEFAUT } from '../js/avatar.js';
import { graine } from './hasard.js';

test('potager : on sème en saison, on arrose une fois par jour, on récolte après 3 arrosages', () => {
  const p = { etoiles: 0 };
  assert.throws(() => jardinage.semer(p, 0, 'tomate', '2026-11-25'), /saison/);
  jardinage.semer(p, 0, 'ail', '2026-11-25');
  assert.throws(() => jardinage.semer(p, 0, 'cresson', '2026-11-25'), /déjà/);
  assert.equal(jardinage.arroser(p, 0, '2026-11-25'), true);
  assert.equal(jardinage.arroser(p, 0, '2026-11-25'), false); // déjà arrosé aujourd'hui
  assert.equal(jardinage.recolter(p, 0), 0); // pas encore prêt
  jardinage.arroser(p, 0, '2026-11-26');
  jardinage.arroser(p, 0, '2026-11-27');
  assert.equal(jardinage.image(jardinage.carres(p)[0]), '🧄');
  assert.equal(jardinage.recolter(p, 0), jardinage.ETOILES_RECOLTE);
  assert.deepEqual([p.etoiles, jardinage.carres(p)[0]], [jardinage.ETOILES_RECOLTE, null]);
  for (let m = 1; m <= 12; m++) assert.ok(jardinage.deSaison(`2026-${String(m).padStart(2, '0')}-15`).length >= 1, `mois ${m}`); // toujours quelque chose à semer
});

test('premiers secours : des choix différents dont la bonne réponse ; le 144 et le 145', () => {
  const tout = [...nature.SECOURS.faciles, ...nature.SECOURS.difficiles];
  assert.ok(nature.SECOURS.faciles.length >= 12 && nature.SECOURS.difficiles.length >= 12);
  for (const [image, titre, bonne, autres] of tout) assert.ok(image && titre.endsWith('?') && autres.length === 3 && !autres.includes(bonne) && new Set(autres).size === 3, titre);
  assert.ok(tout.some((q) => q[2] === 'Le 144') && tout.some((q) => q[2] === 'Le 145'));
  for (let g = 1; g < 30; g++) assert.equal(new Set(nature.secours.question({ age: 6 }, graine(g)).choix).size, 3);
});

test('carte : médaille selon les parties finies dans les jeux du bâtiment ; pastille « 3 jeux »', () => {
  assert.equal(medaille({ parties: {} }, 'calcul'), null);
  assert.equal(medaille({ parties: { calcul: 1 } }, 'calcul')[1], '🥉');
  assert.equal(medaille({ parties: { dictee: 3, ecriture: 2 } }, 'syllabes')[1], '🥈'); // les jeux de la bibliothèque s'additionnent
  assert.equal(medaille({ parties: { dinos: 15 } }, 'musee')[1], '🥇');
  const j = { id: 'a', prenom: 'Léa', age: 8, avatar: AVATAR_PAR_DEFAUT, iles: [], parties: { calcul: 5 } };
  const savoir = dessinerIle('savoir', [j], j);
  assert.equal(savoir.match(/>3 jeux</g).length, 2); // la bibliothèque et l'aéroport
  assert.ok(savoir.includes('🥈') && savoir.includes('médaille d’argent'));
  assert.ok(LIEUX.some((l) => l.id === 'secours' && l.ile === 'securite'));
});

test('cabane nature : des fiches complètes, et des questions tirées des fiches sans ambiguïté', async () => {
  const f = await import('../js/jeux/nature-fiches.js');
  assert.ok(f.ANIMAUX.length >= 15 && f.PLANTES.length >= 12);
  for (const a of f.ANIMAUX) assert.ok(a[3] in f.FAMILLES && a[4] in f.MILIEUX && a[5] in f.REGIMES && a[6] && a[7], a[0]);
  for (const p of f.PLANTES) { assert.ok(p[3] in f.STATUTS && p[4] && p[5], p[0]); assert.match(f.fichePlante(p), /sans un adulte/); }
  assert.ok(f.PLANTES.filter((p) => p[3] === 'dangereuse').every((p) => /jamais/.test(p[5]))); // une plante dangereuse : on dit toujours « jamais »
  for (const difficiles of [false, true]) for (const [image, titre, bonne, autres] of f.questionsDesFiches(difficiles)) {
    assert.ok(image && titre.endsWith('?') && autres.length === 3 && !autres.includes(bonne) && new Set(autres).size === 3, titre);
  }
  for (const [age, n] of [[6, 3], [9, 4]]) for (let g = 1; g < 60; g++) assert.equal(new Set(nature.naturaliste.question({ age }, graine(g)).choix).size, n);
});

test('hôpital : chaque page a son image, et chaque organe sa place à toucher sur l’image', async () => {
  const a = await import('../js/jeux/atlas.js');
  for (const [k, s] of Object.entries(a.SYSTEMES)) for (const o of s.organes) {
    const p = a.SUR_IMAGE[k][o.id];
    assert.ok(p && p[0] > 10 && p[0] < 230 && p[1] > 20 && p[1] < 400, `${k} : ${o.id}`);
  }
  assert.ok(!a.dessinerSysteme('squelette').includes('<image')); // sans image : le dessin
  globalThis.IMAGES = ['images/corps/squelette.webp'];
  try {
    const svg = a.dessinerSysteme('squelette', ['crane'], 'crane');
    assert.ok(svg.includes('images/corps/squelette.webp') && svg.match(/class="repere"/g).length === 6 && svg.includes('organe actif'));
    assert.equal(a.aDeuxFaces('squelette'), false); // pas d'image de dos : tout reste de face
    globalThis.IMAGES.push('images/corps/squelette-dos.webp'); // avec l'image de dos : la colonne se voit de dos
    assert.equal(a.aDeuxFaces('squelette'), true);
    assert.equal(a.faceDe('squelette', 'colonne'), 'dos');
    assert.equal(a.dessinerSysteme('squelette').match(/class="repere"/g).length, 5);
    const dos = a.dessinerSysteme('squelette', [], null, 'dos');
    assert.ok(dos.includes('squelette-dos.webp') && dos.match(/class="repere"/g).length === 1 && dos.includes('data-organe="colonne"'));
  } finally { delete globalThis.IMAGES; }
});

test('labo : des expériences complètes et sans danger ; les étoiles une seule fois', async () => {
  const x = await import('../js/jeux/experiences.js');
  assert.ok(x.EXPERIENCES.length >= 10);
  assert.equal(new Set(x.EXPERIENCES.map((e) => e.cle)).size, x.EXPERIENCES.length);
  for (const e of x.EXPERIENCES) {
    assert.ok(e.nom && e.image && e.duree && e.materiel.length >= 3 && e.etapes.length >= 3 && e.explication.length > 40, e.cle);
    assert.equal(new Set(e.devine.slice(1)).size, 3, e.cle); // trois réponses différentes à deviner
    const texte = [...e.materiel, ...e.etapes].join(' ').toLowerCase();
    assert.ok(!/bougie|allumette|feu |briquet|eau bouillante|javel|alcool|peroxyde/.test(texte), `${e.cle} : rien de dangereux`);
    assert.match(x.lire(e), /avec un adulte/);
  }
  const p = { etoiles: 0 };
  assert.equal(x.terminer(p, 'poivre'), x.ETOILES_EXPERIENCE);
  assert.equal(x.terminer(p, 'poivre'), 0);
  assert.deepEqual([p.etoiles, p.experiences], [x.ETOILES_EXPERIENCE, ['poivre']]);
  assert.throws(() => x.terminer(p, 'inconnue'));
});

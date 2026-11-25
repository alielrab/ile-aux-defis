// La liste de toutes les images à générer pour le nouveau style (voir images/PLAN.md), tirée du catalogue de l'app.
// Lancer : node images/lister-images.mjs   →   écrit images/liste.csv (etape;fichier;taille;transparent;sujet)
import { writeFileSync } from 'node:fs';

const racine = new URL('../', import.meta.url);
const js = (f) => import(new URL(`js/${f}`, racine));
const [{ CATALOGUE, MAGASINS, PIECES }, { LIEUX }, { ILES }, { CROYANCES }, { PEAUX, YEUX, COIFFURES }, { RECITS }, { DINOS }, { THEMES }, { ANIMAUX }, { SYSTEMES }, { EXPERIENCES }, { OBJETS }] = await Promise.all(
  [js('catalogue.js'), js('carte.js'), js('archipel.js'), js('croyances.js'), js('avatar.js'), js('recits.js'), js('jeux/dinos.js'), js('jeux/langues.js'), js('jeux/nature-fiches.js'), js('jeux/atlas.js'), js('jeux/experiences.js'), js('jeux/enigmes.js')]);

const lignes = [];
const ajouter = (etape, fichier, taille, sujet, transparent = true) => lignes.push([etape, `images/${fichier}.webp`, taille, transparent ? 'oui' : 'non', sujet]);
const plat = (t) => t.replace('\n', ' ');

// Étape 1 : le refuge. Étape 2 : la maison. Étape 5 : le personnage.
const DOSSIER = { animal: [1, 'animaux/', '512x512'], 'acc-animal': [1, 'animaux/acc-', '384x384'], 'habit-animal': [1, 'animaux/habit-', '256x256'],
  meuble: [2, 'maison/', '512x512'], jouet: [2, 'maison/', '512x512'], ustensile: [2, 'maison/', '512x512'], lit: [2, 'maison/lit-', '512x512'],
  tenue: [5, 'avatar/tenue-', '768x1024'], chaussures: [5, 'avatar/chaussures-', '768x1024'], chapeau: [5, 'avatar/chapeau-', '768x1024'], accessoire: [5, 'avatar/accessoire-', '768x1024'] };
for (const a of CATALOGUE) {
  if (a.id === 'lit:rose') continue; // c'est le lit de base (meuble:lit)
  const d = DOSSIER[a.type];
  if (d) ajouter(d[0], d[1] + a.cle, d[2], a.nom);
}
// papier (motifs) et cheveux (couleurs) restent faits par le code : pas d'image.
for (const k of Object.keys(PIECES)) ajouter(2, `maison/piece-${k}`, '1280x832', `${PIECES[k].nom} vide : sol${k === 'jardin' ? ', ciel et haie' : ' et fenêtre, mur transparent (le papier peint est derrière)'}`, k !== 'jardin');
ajouter(1, 'interface/feuillage-haut', '1280x256', 'Bordure de feuilles tropicales et fleurs, haut de l’écran');
ajouter(1, 'interface/feuillage-bas', '1280x256', 'Bordure de feuilles tropicales et fleurs, bas de l’écran');
ajouter(1, 'interface/etoile', '128x128', 'Étoile dorée brillante');

// Étape 3 : l'archipel et les îles
ajouter(3, 'ile/archipel', '1024x1280', 'La mer vue du ciel, vide (les îles sont posées dessus)', false);
for (const i of ILES) ajouter(3, `ile/fond-${i.id}`, '1024x1024', `${i.nom} vue du ciel, vide : plage, herbe, chemins`);
for (const l of LIEUX) ajouter(3, `ile/${l.id}`, '512x512', `Bâtiment : ${plat(l.nom)} (${l.detail})`);
ajouter(3, 'ile/maison', '512x512', 'Bâtiment : la maison d’un enfant');
for (const k of new Set(Object.values(CROYANCES).map((c) => c.contenu ?? c.lieu))) ajouter(3, `ile/croyance-${String(k).toLowerCase().replace(/[^a-z]+/g, '-')}`, '512x512', `Bâtiment : lieu de culte (${k})`);
for (const k of ['bateau', 'palmier']) ajouter(3, `ile/${k}`, '256x256', `Décoration : ${k}`);

// Étape 4 : l'intérieur des lieux (derrière les questions et dans les magasins) et leur personnage
const DECORS = ['calcul', 'heure', 'corps', 'syllabes', 'espace', 'cuisine', 'marche', 'musee', 'aeroport', 'urgences', 'route', 'tri', 'emotions', 'veto', 'fractions', 'memory', 'chantier', 'peinture', 'bd', 'musique'];
for (const id of [...Object.keys(MAGASINS), ...DECORS]) ajouter(4, `decors/${id}`, '1280x832', `Intérieur : ${plat(MAGASINS[id]?.nom ?? LIEUX.find((l) => l.id === id).nom)}, vide au milieu`, false);
for (const id of ['calcul', 'heure', 'corps', 'syllabes', 'espace', 'croyance', 'cuisine', 'marche', 'emotions', 'veto', 'fractions', 'musee', 'passeport', 'urgences', 'route']) ajouter(4, `personnages/${id}`, '512x768', `Personnage du lieu : ${id}`);

// Étape 6 : les scènes des histoires du lieu de croyance, en paysages sans personne (Dieu et les prophètes ne sont jamais représentés)
for (const l of Object.values(RECITS)) for (const r of l) ajouter(6, `recits/${r.cle}`, '768x480', `Histoire : ${r.titre}, sans personne`, false);

// Étape 7 : le calendrier de l'Avent, une illustration par case
for (let j = 1; j <= 24; j++) ajouter(7, `avent/${j}`, '384x384', `Calendrier de l’Avent, case ${j}`, false);

// Étape 5 : le personnage en calques, tous dans la même pose et le même cadre
for (const p of Object.keys(PEAUX)) for (const y of Object.keys(YEUX)) ajouter(5, `avatar/base-${p}-${y}`, '768x1024', `Enfant chauve en t-shirt et short beiges, peau ${p}, yeux ${y}`);
for (const [k, nom] of Object.entries(COIFFURES)) for (const c of ['devant', 'derriere']) ajouter(5, `avatar/coiffure-${k}-${c}`, '768x1024', `Cheveux gris clair (teintés par le code), ${nom}, partie ${c}`);

// Étape 8 : les dinosaures du musée (à toucher dans le musée et dans le quiz)
for (const d of DINOS) ajouter(8, `dinos/${d.cle}`, '512x320', `Dinosaure : ${d.nom}, en entier, de profil`);
// Étape 8 aussi : les thèmes de l'école des langues
for (const t of THEMES) ajouter(8, `langues/${t.cle}`, '512x320', `Thème de langue : ${t.nom}`);
// Les pages du corps, à l'hôpital : une image par page, à toucher
for (const [k, s] of Object.entries(SYSTEMES)) ajouter(8, `corps/${k}`, '640x1024', `Page du corps : ${s.nom}`);
for (const k of ['squelette', 'muscles', 'cerveau']) ajouter(8, `corps/${k}-dos`, '640x1024', `Page du corps, vue de dos : ${SYSTEMES[k].nom}`);
// Les étapes des expériences du labo : une image par étape
for (const [cle, [nom, , ailleurs]] of Object.entries(OBJETS)) if (!ailleurs) ajouter(8, `enigmes/${cle}`, '256x256', `Trouve l'intrus : ${nom}`);
for (const j of ['intrus', 'suites', 'potions']) ajouter(8, `enigmes/carte-${j}`, '400x250', `Tour des énigmes : la carte du jeu « ${j} »`);
for (const f of ['rouge', 'bleu', 'jaune', 'vert', 'violet', 'orange', 'etoile', 'coeur', 'triangle', 'carre']) ajouter(8, `enigmes/forme-${f}`, '128x128', `Suites logiques : la forme « ${f} »`);
ajouter(8, 'enigmes/fiole', '160x512', 'Potions du laboratoire : la fiole vide, posée par-dessus les couleurs');
for (const e of EXPERIENCES) e.etapes.forEach((t, i) => ajouter(8, `experiences/${e.cle}-${i + 1}`, '640x400', `Expérience « ${e.nom} », étape ${i + 1} : ${t}`, false));
// Les animaux de la cabane nature
for (const a of ANIMAUX) ajouter(8, `nature/${a[0]}`, '512x320', `Animal : ${a[1]}, en entier`);

lignes.sort((a, b) => a[0] - b[0]);
writeFileSync(new URL('images/liste.csv', racine), `﻿etape;fichier;taille;transparent;sujet\n${lignes.map((l) => l.join(';')).join('\n')}\n`); // BOM : les accents s'ouvrent bien dans Excel
// Poids estimé en WebP (Ko par image, selon la taille), pour garder l'app légère
const KO = { '128x128': 4, '256x256': 12, '384x384': 22, '512x512': 35, '512x768': 45, '768x1024': 45, '1280x256': 60, '1024x1024': 120, '1024x1280': 150, '1280x832': 110, '768x480': 60, '512x320': 25, '640x1024': 70, '640x400': 35 };
for (const e of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const l = lignes.filter((x) => x[0] === e);
  console.log(`étape ${e} : ${l.length} images, environ ${(l.reduce((s, x) => s + KO[x[2]], 0) / 1024).toFixed(1)} Mo`);
}
console.log(`total : ${lignes.length} images, environ ${(lignes.reduce((s, x) => s + KO[x[2]], 0) / 1024).toFixed(1)} Mo`);

// La liste de toutes les phrases fixes que l'app dit à voix haute, pour les enregistrer avec un outil de voix.
// Lancer : node voix/lister-phrases.mjs   →   écrit voix/phrases.csv (id;source;texte), une phrase par ligne, sans doublon.
// Les phrases qui changent (prénoms, nombres, scores) ne sont pas dans la liste : la voix de la tablette les dira toujours.
// L'identifiant servira de nom de fichier audio (ex. atlas.squelette.crane.petit.mp3).
import { readFileSync, writeFileSync } from 'node:fs';

const racine = new URL('../', import.meta.url);
const js = (f) => import(new URL(`js/${f}`, racine));
const [messages, corps, atlas, espace, syllabes, croyances, recits, rappr, emotions, cuisine, bd, peinture, catalogue] = await Promise.all([
  js('messages.js'), js('jeux/corps-questions.js'), js('jeux/atlas.js'), js('jeux/espace.js'), js('jeux/syllabes-mots.js'), js('croyances.js'),
  js('recits.js'), js('rapprochements.js'), js('jeux/emotions.js'), js('jeux/cuisine.js'), js('jeux/bd.js'), js('jeux/peinture.js'), js('catalogue.js'),
]);

const lignes = [], vus = new Set();
const ajouter = (id, source, texte) => {
  const t = String(texte ?? '').trim();
  if (!t || vus.has(t) || t.includes('${')) return;
  vus.add(t);
  lignes.push([id, source, t]);
};
// Une banque de questions [question, bonne, [autres], « Le savais-tu ? »] : la question, chaque réponse, le savais-tu
const banque = (id, source, liste) => liste.forEach(([q, bonne, autres, savais], i) => {
  ajouter(`${id}.${i + 1}.question`, source, q);
  [bonne, ...autres].forEach((r, k) => ajouter(`${id}.${i + 1}.reponse${k + 1}`, source, r));
  if (typeof savais === 'string') ajouter(`${id}.${i + 1}.savais`, source, `Le savais-tu ? ${savais}`);
});

messages.FELICITATIONS.forEach((t, i) => ajouter(`message.felicitation.${i + 1}`, 'Messages', t));
messages.ENCOURAGEMENTS.forEach((t, i) => ajouter(`message.encouragement.${i + 1}`, 'Messages', t));
Object.entries(messages.SERIES).forEach(([n, t]) => ajouter(`message.serie.${n}`, 'Messages', t));

banque('hopital.facile', 'Hôpital : le grand quiz', corps.FACILES);
banque('hopital.difficile', 'Hôpital : le grand quiz', corps.DIFFICILES);
for (const [k, s] of Object.entries(atlas.SYSTEMES)) {
  ajouter(`atlas.${k}.nom`, 'Hôpital : atlas du corps', s.nom);
  ajouter(`atlas.${k}.intro`, 'Hôpital : atlas du corps', s.intro);
  for (const o of s.organes) {
    ajouter(`atlas.${k}.${o.id}.nom`, 'Hôpital : atlas du corps', o.nom);
    ajouter(`atlas.${k}.${o.id}.petit`, 'Hôpital : atlas du corps', o.petit);
    ajouter(`atlas.${k}.${o.id}.grand`, 'Hôpital : atlas du corps', o.grand);
    ajouter(`atlas.${k}.${o.id}.savais`, 'Hôpital : atlas du corps', `Le savais-tu ? ${o.savais}`);
  }
  banque(`atlas.${k}.quiz.petit`, 'Hôpital : atlas du corps', s.petit);
  banque(`atlas.${k}.quiz.grand`, 'Hôpital : atlas du corps', s.grand);
}

for (const a of espace.ASTRES) {
  ajouter(`observatoire.${a.cle}.nom`, 'Observatoire', a.nom);
  a.faits.forEach((f, i) => ajouter(`observatoire.${a.cle}.fait${i + 1}`, 'Observatoire', f));
  if (a.pasDePoids) ajouter(`observatoire.${a.cle}.poids`, 'Observatoire', a.pasDePoids);
}
banque('observatoire.quiz.facile', 'Observatoire', espace.QUIZ_FACILE);
banque('observatoire.quiz.difficile', 'Observatoire', espace.QUIZ_DIFFICILE);

for (const [nom, liste] of [['facile', syllabes.MOTS_FACILES], ['difficile', syllabes.MOTS_DIFFICILES]]) {
  liste.forEach(([mot, , savais], i) => {
    ajouter(`bibliotheque.${nom}.${i + 1}.mot`, 'Bibliothèque', mot.replaceAll('-', ''));
    mot.split('-').forEach((s) => ajouter(`bibliotheque.syllabe.${s}`, 'Bibliothèque (syllabes)', s));
    if (savais) ajouter(`bibliotheque.${nom}.${i + 1}.savais`, 'Bibliothèque', `Le savais-tu ? ${savais}`);
  });
}

for (const [k, c] of Object.entries(croyances.CONTENUS)) {
  const src = 'Croyances (à faire relire)';
  ajouter(`croyance.${k}.presentation`, src, c.presentation);
  for (const [rub, liste] of [['fete', c.fetes], ['symbole', c.symboles]]) {
    liste.forEach(([, nom, texte, savais], i) => {
      ajouter(`croyance.${k}.${rub}${i + 1}.nom`, src, nom);
      ajouter(`croyance.${k}.${rub}${i + 1}.texte`, src, texte);
      ajouter(`croyance.${k}.${rub}${i + 1}.savais`, src, `Le savais-tu ? ${savais}`);
    });
  }
  (c.histoires ?? []).forEach(([titre, texte], i) => { ajouter(`croyance.${k}.question${i + 1}.titre`, src, titre); ajouter(`croyance.${k}.question${i + 1}.texte`, src, texte); });
  banque(`croyance.${k}.quiz`, src, c.questions);
}
for (const [t, liste] of Object.entries(recits.RECITS)) {
  for (const r of liste) {
    const src = 'Histoires (à faire relire)';
    ajouter(`histoire.${t}.${r.cle}.titre`, src, r.titre);
    r.texte.forEach((p, i) => ajouter(`histoire.${t}.${r.cle}.phrase${i + 1}`, src, p));
    banque(`histoire.${t}.${r.cle}.quiz`, src, r.questions);
  }
}
for (const p of rappr.POINTS) {
  const id = `ensemble.${p.titre.normalize('NFD').replace(/[^a-zA-Z]+/g, '-').toLowerCase()}`;
  ajouter(`${id}.titre`, 'Ce qui nous rapproche (à faire relire)', p.titre);
  if (p.intro) ajouter(`${id}.intro`, 'Ce qui nous rapproche (à faire relire)', p.intro);
  for (const [g, t] of Object.entries(p.pour)) ajouter(`${id}.${g}`, 'Ce qui nous rapproche (à faire relire)', `${rappr.POUR[g]} : ${t}`);
}
ajouter('ensemble.conclusion', 'Ce qui nous rapproche (à faire relire)', rappr.CONCLUSION);

for (const [k, e] of Object.entries(emotions.EMOTIONS)) ajouter(`emotion.${k}.nom`, 'Météo des émotions', e.nom);
for (const [k, t] of Object.entries(emotions.CONSEILS)) ajouter(`emotion.${k}.conseil`, 'Météo des émotions', `Le savais-tu ? ${t}`);
emotions.SITUATIONS.forEach(([t], i) => ajouter(`emotion.situation${i + 1}`, 'Météo des émotions', t));
for (const [k, , nom, reponse] of emotions.METEO) { ajouter(`meteo.${k}.nom`, 'Météo des émotions', nom); ajouter(`meteo.${k}.reponse`, 'Météo des émotions', reponse); }

for (const [k, r] of Object.entries(cuisine.RECETTES)) {
  ajouter(`restaurant.${k}.nom`, 'Restaurant', r.nom);
  r.jeu.forEach(([, nom]) => ajouter(`restaurant.ingredient.${nom.normalize('NFD').replace(/[^a-zA-Z]+/g, '-').toLowerCase()}`, 'Restaurant', nom));
  r.vraie.ingredients.forEach((t, i) => ajouter(`restaurant.${k}.ingredient${i + 1}`, 'Restaurant', t));
  r.vraie.etapes.forEach((t, i) => ajouter(`restaurant.${k}.etape${i + 1}`, 'Restaurant', t));
  ajouter(`restaurant.${k}.savais`, 'Restaurant', `Le savais-tu ? ${r.savaisTu}`);
}

bd.PHRASES.forEach((t, i) => ajouter(`bd.phrase${i + 1}`, 'Atelier BD', t));
bd.CREATURES.forEach(([k, , nom]) => ajouter(`bd.creature.${k}`, 'Atelier BD', nom));
for (const [k, [nom]] of Object.entries(bd.DECORS)) ajouter(`bd.decor.${k}`, 'Atelier BD', nom);
peinture.COULEURS.forEach(([k, nom]) => ajouter(`peinture.couleur.${k}`, 'Atelier de peinture', nom));
for (const [k, m] of Object.entries(peinture.MODELES)) ajouter(`peinture.dessin.${k}`, 'Atelier de peinture', m.nom);
for (const a of catalogue.CATALOGUE) ajouter(`objet.${a.id.replace(':', '.')}`, 'Magasins (noms des objets)', a.nom);

// Les phrases écrites telles quelles dans l'app : parler('…') sans partie variable
const app = readFileSync(new URL('js/app.js', racine), 'utf8');
let n = 0;
for (const [, , t] of app.matchAll(/parler\((['"`])((?:(?!\1)[^\\]|\\.)*)\1/g)) if (!t.includes('${')) ajouter(`app.${++n}`, "Phrases de l'app", t.replace(/\\'/g, "'"));

const csv = ['id;source;texte', ...lignes.map((l) => l.map((x) => (/[;"\n]/.test(x) ? `"${x.replaceAll('"', '""')}"` : x)).join(';'))].join('\n');
writeFileSync(new URL('voix/phrases.csv', racine), `﻿${csv}\n`); // BOM : les accents s'ouvrent bien dans Excel
console.log(`${lignes.length} phrases écrites dans voix/phrases.csv`);

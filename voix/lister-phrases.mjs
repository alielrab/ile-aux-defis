// La liste de toutes les phrases fixes que l'app dit à voix haute, pour les enregistrer avec un outil de voix.
// Lancer : node voix/lister-phrases.mjs   →   écrit voix/phrases.csv (id;source;texte), une phrase par ligne, sans doublon.
// Les phrases qui changent (prénoms, nombres, scores) ne sont pas dans la liste : la voix de la tablette les dira toujours.
// L'identifiant servira de nom de fichier audio (ex. atlas.squelette.crane.petit.mp3).
import { readFileSync, writeFileSync } from 'node:fs';
import { accorder } from '../js/genre.js';

const racine = new URL('../', import.meta.url);
const js = (f) => import(new URL(`js/${f}`, racine));
const [messages, corps, atlas, espace, syllabes, croyances, recits, rappr, emotions, cuisine, bd, peinture, catalogue, dinos, passeport, urgences, veto, fractions, memory, route] = await Promise.all([
  js('messages.js'), js('jeux/corps-questions.js'), js('jeux/atlas.js'), js('jeux/espace.js'), js('jeux/syllabes-mots.js'), js('croyances.js'),
  js('recits.js'), js('rapprochements.js'), js('jeux/emotions.js'), js('jeux/cuisine.js'), js('jeux/bd.js'), js('jeux/peinture.js'), js('catalogue.js'),
  js('jeux/dinos.js'), js('jeux/passeport.js'), js('jeux/urgences.js'), js('jeux/veto.js'), js('jeux/fractions.js'), js('jeux/memory.js'), js('jeux/route.js'),
]);

const lignes = [], vus = new Set();
// Une phrase qui s'accorde au genre ({fort|forte}) donne deux lignes : id.garcon et id.fille
const ajouter = (id, source, texte) => {
  const t = String(texte ?? '').trim();
  if (!t || t.includes('${')) return;
  const versions = /\{[^{}|]*\|[^{}|]*\}/.test(t) ? [[`${id}.garcon`, accorder(t, 'garcon')], [`${id}.fille`, accorder(t, 'fille')]] : [[id, t]];
  for (const [i, v] of versions) if (!vus.has(v)) { vus.add(v); lignes.push([i, source, v]); }
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

for (const d of dinos.DINOS) {
  ajouter(`musee.${d.cle}.nom`, 'Musée des dinosaures', d.nom);
  ajouter(`musee.${d.cle}.fiche.petit`, 'Musée des dinosaures', dinos.fiche(d, 6));
  ajouter(`musee.${d.cle}.fiche.grand`, 'Musée des dinosaures', dinos.fiche(d, 9));
  ajouter(`musee.${d.cle}.savais`, 'Musée des dinosaures', `Le savais-tu ? ${d.savais}`);
}
for (const p of passeport.PAYS) {
  ajouter(`passeport.${p.cle}.presentation.petit`, 'Passeport du monde', passeport.presentation(p, 6));
  ajouter(`passeport.${p.cle}.presentation.grand`, 'Passeport du monde', passeport.presentation(p, 9));
  ajouter(`passeport.${p.cle}.savais`, 'Passeport du monde', `Le savais-tu ? ${p.savais}`);
}
for (const n of urgences.NUMEROS) ajouter(`urgences.${n.numero}`, "Numéros d'urgence (à faire relire)", `${n.numero}. ${n.nom}. ${n.quand}`);
urgences.QUOI_DIRE.forEach(([, t, x], i) => ajouter(`urgences.quoidire${i + 1}`, "Numéros d'urgence (à faire relire)", `${t} ${x}`));
ajouter('urgences.rassurer', "Numéros d'urgence (à faire relire)", urgences.RASSURER);
Object.entries(urgences.REPONSES).forEach(([k, t]) => ajouter(`urgences.reponse.${k}`, "Numéros d'urgence (à faire relire)", t.replace(/^\S+ /, '')));
urgences.SITUATIONS.forEach(([t, , , s], i) => { ajouter(`urgences.situation${i + 1}`, "Numéros d'urgence (à faire relire)", t); ajouter(`urgences.situation${i + 1}.savais`, "Numéros d'urgence (à faire relire)", `Le savais-tu ? ${s}`); });
banque('urgences.quiz', "Numéros d'urgence (à faire relire)", urgences.QUESTIONS);
banque('route.quiz', 'Code de la route (à faire relire)', route.QUESTIONS);
const tri = await js('jeux/tri.js');
tri.DECHETS.forEach(([d, , s], i) => { ajouter(`tri.${i + 1}.question`, 'Centre de tri (à faire relire)', `Où va ${d} ?`); ajouter(`tri.${i + 1}.savais`, 'Centre de tri (à faire relire)', `Le savais-tu ? ${s}`); });
tri.POUBELLES.forEach((p, i) => ajouter(`tri.poubelle${i + 1}`, 'Centre de tri (à faire relire)', p));
for (const [k, f] of Object.entries(veto.FICHES)) {
  ajouter(`veto.${k}.nom`, 'Vétérinaire', f.nom);
  ajouter(`veto.${k}.besoins`, 'Vétérinaire', f.besoins);
  ajouter(`veto.${k}.repas`, 'Vétérinaire', f.repas);
  ajouter(`veto.${k}.savais`, 'Vétérinaire', `Le savais-tu ? ${f.savais}`);
}
{ // toutes les questions possibles du vétérinaire et de la pizzeria (tirées au hasard, en grand nombre)
  let x = 1; const hasard = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
  const vues = new Map();
  for (let i = 0; i < 4000; i++) for (const age of [6, 9]) {
    const q = veto.question({ age }, hasard);
    vues.set(`veto|${q.consigne}`, ['Vétérinaire', q.consigne]);
    for (const c of q.choix) vues.set(`veto|${veto.libelle(c)}`, ['Vétérinaire', veto.libelle(c)]);
    vues.set(`veto|${q.solution}`, ['Vétérinaire', q.solution]);
    vues.set(`veto|${q.savaisTu}`, ['Vétérinaire', `Le savais-tu ? ${q.savaisTu}`]);
    const f = fractions.question({ age }, hasard);
    for (const t of [f.mode === 'fraction' ? fractions.aDire(f) : f.consigne, f.solution, `Le savais-tu ? ${f.savaisTu}`]) vues.set(`fr|${t}`, ['Pizzeria (fractions)', t]);
  }
  let n = 0;
  for (const [cle, [src, t]] of vues) ajouter(`${cle.startsWith('veto') ? 'veto' : 'pizzeria'}.phrase${++n}`, src, t);
}
for (const [k, t] of Object.entries(memory.THEMES)) {
  ajouter(`memory.theme.${k}`, 'Memory', t.nom);
  for (const c of t.cartes()) { ajouter(`memory.${k}.${c.cle}`, 'Memory', c.nom); ajouter(`memory.${k}.${c.cle}.savais`, 'Memory', `Le savais-tu ? ${c.savais}`); }
}

bd.PHRASES.forEach((t, i) => ajouter(`bd.phrase${i + 1}`, 'Atelier BD', t));
bd.CREATURES.forEach(([k, , nom]) => ajouter(`bd.creature.${k}`, 'Atelier BD', nom));
for (const [k, [nom]] of Object.entries(bd.DECORS)) ajouter(`bd.decor.${k}`, 'Atelier BD', nom);
peinture.COULEURS.forEach(([k, nom]) => ajouter(`peinture.couleur.${k}`, 'Atelier de peinture', nom));
for (const [k, m] of Object.entries(peinture.MODELES)) ajouter(`peinture.dessin.${k}`, 'Atelier de peinture', m.nom);
for (const a of catalogue.CATALOGUE) ajouter(`objet.${a.id.replace(':', '.')}`, 'Magasins (noms des objets)', a.nom);

{ // le labo des expériences : les morceaux tels que l'app les dit (voir ouvrirLabo dans js/app.js)
  const x = await js('jeux/experiences.js'), src = 'Labo des expériences';
  ['Le labo des expériences !', x.REGLE, 'Choisis une expérience.', 'Bien deviné !', 'C’est en essayant qu’on découvre !', `Tu gagnes ${x.ETOILES_EXPERIENCE} étoiles.`,
    'Maintenant, fais l’expérience pour de vrai, avec un adulte !', 'Bravo, tu as fait l’expérience pour de vrai !', `Tu gagnes ${x.ETOILES_VRAIE} étoiles.`].forEach((t, i) => ajouter(`labo.phrase${i + 1}`, src, t));
  for (const e of x.EXPERIENCES) {
    ajouter(`labo.${e.cle}.nom`, src, `${e.nom}.`);
    ajouter(`labo.${e.cle}.materiel`, src, `Il te faut : ${e.materiel.join(', ')}.`);
    e.etapes.forEach((t, i) => ajouter(`labo.${e.cle}.etape${i + 1}`, src, `Étape ${i + 1}. ${t}`));
    if (e.adulte) ajouter(`labo.${e.cle}.adulte`, src, e.adulte);
    ajouter(`labo.${e.cle}.devine`, src, `Devine d’abord : ${e.devine[0]}`);
    ajouter(`labo.${e.cle}.envrai`, src, `En vrai : ${e.devine[1].toLowerCase()}.`);
    ajouter(`labo.${e.cle}.explication`, src, e.explication);
  }
}

{ // la tour des énigmes : les consignes et les explications de l'intrus et des suites, et la fin d'un niveau de potions
  const x = await js('jeux/enigmes.js'), src = 'Tour des énigmes';
  for (const [i, q] of [x.intrus.question({ age: 6 }), x.suites.question({ age: 6 })].entries()) ajouter(`enigmes.consigne${i + 1}`, src, q.consigne);
  [...x.FAMILLES, ...x.POINTS_COMMUNS].forEach(([commun], i) => ajouter(`enigmes.intrus${i + 1}`, src, `Les trois autres sont ${commun}.`));
  const regles = new Set();
  for (const age of [6, 9]) for (let i = 0; i < 400; i++) regles.add(x.suites.question({ age }).solution); // toutes les règles finissent par sortir
  [...regles].sort().forEach((t, i) => ajouter(`enigmes.suite${i + 1}`, src, t));
  ajouter('enigmes.potions.bravo', src, 'Bravo, tout est trié !');
  ajouter('enigmes.potions.etoiles', src, `Tu gagnes ${x.ETOILES_POTION} étoiles.`);
}
{ // l'accueil de chaque île (voir entrerLieu dans js/app.js)
  const { ILES } = await js('archipel.js');
  const { LIEUX } = await js('carte.js');
  for (const l of LIEUX.filter((x) => !x.ouvert)) ajouter(`lieu.${l.id}.bientot`, "Phrases de l'app", `${l.nom.replace('\n', ' ')} ouvre bientôt !`);
  for (const i of ILES) ajouter(`ile.${i.id}.bienvenue`, "Phrases de l'app", `Bienvenue sur ${i.nom.replace(/^L'île/, "l'île")} !`);
}

{ // les jeux à questions : tout ce que l'app dit et qui n'a pas encore de voix, morceau par morceau (voir voix/simuler.mjs)
  const { textesDits, morceaux, DEBUTS } = await import('./simuler.mjs');
  const { fichiers } = await js('voix-cle.js');
  const { VOIX_PRETES } = await import('./liste.js');
  ['ou', 'Le savais-tu ?', ...DEBUTS].forEach((t, i) => ajouter(`liaison.${i + 1}`, 'Petits mots de liaison', t));
  for (const [jeu, textes] of Object.entries(textesDits())) {
    let k = 0;
    for (const t of textes) if (!fichiers(t, VOIX_PRETES)) for (const m of morceaux(t)) ajouter(`jeu.${jeu}.${++k}`, `Jeu : ${jeu}`, m);
  }
}

{ // des phrases à nombre qu'on peut toutes écrire, et la suite de la tour des énigmes (voir js/app.js)
  const src = "Phrases de l'app";
  ajouter('etoiles.1', src, 'Tu gagnes 1 étoile.');
  for (let n = 2; n <= 30; n++) ajouter(`etoiles.${n}`, src, `Tu gagnes ${n} étoiles.`);
  const suivi = await js('suivi.js'), x = await js('jeux/logique.js'), tour = 'Tour des énigmes';
  for (let n = suivi.COFFRE[0]; n <= suivi.COFFRE[1]; n++) ajouter(`coffre.${n}`, src, `Dans le coffre, il y avait ${n} étoiles !`);
  for (const [k, [titre, but]] of Object.entries(x.JEUX_LOGIQUE)) { ajouter(`logique.${k}.titre`, tour, `${titre} !`); ajouter(`logique.${k}.but`, tour, `${but}.`); }
  ['Choisis un niveau.', 'Bravo, la grille est finie !', 'Bravo, tu as tout trouvé !', 'Bravo !', 'Pas cette fois.', 'Une nouvelle énigme t’attend demain !'].forEach((t, i) => ajouter(`logique.phrase${i + 1}`, tour, t));
  x.DESSINS.forEach(([nom], i) => ajouter(`logique.dessin${i + 1}`, tour, `Le dessin caché, c’était ${nom}.`));
  const indices = new Set();
  for (let n = 0; n < 12; n++) for (const i of x.deductionDuNiveau(n).indices) indices.add(i);
  [...indices].sort().forEach((t, i) => ajouter(`logique.indice${i + 1}`, tour, t));
}

{ // les textes rangés dans les données de ces modules (fiches, missions, maison de la confiance…) : chaque phrase, telle qu'elle est écrite
  const { phrases } = await js('voix-cle.js');
  const fiches = await js('jeux/nature-fiches.js');
  for (const f of ['confiance', 'nature-fiches', 'missions', 'jardinage', 'avent', 'chantier']) {
    const m = await js(`jeux/${f}.js`), vues = new Set();
    let k = 0;
    const voir = (v, prof = 0) => {
      if (typeof v === 'string') { // un vrai texte : au moins deux mots, pas un dessin ni un nom de fichier
        if (/\p{L}{2,} \p{L}/u.test(v) && !/[<>=]|^#|\.(webp|js|mp3)/.test(v)) for (const p of phrases(v)) ajouter(`${f}.${++k}`, `Textes : ${f}`, p);
        return;
      }
      if (!v || typeof v !== 'object' || vues.has(v) || prof > 8) return;
      vues.add(v);
      for (const x of Array.isArray(v) ? v : Object.values(v)) voir(x, prof + 1);
    };
    for (const v of Object.values(m)) if (typeof v !== 'function') voir(v);
  }
  for (const age of [6, 9]) { // les fiches de la cabane nature, telles qu'elles sont lues
    for (const a of fiches.ANIMAUX) phrases(fiches.ficheAnimal(a, age)).forEach((p, i) => ajouter(`fiche.animal.${fiches.ANIMAUX.indexOf(a) + 1}.${age}.${i + 1}`, 'Textes : nature-fiches', p));
    for (const a of fiches.PLANTES) phrases(fiches.fichePlante(a, age)).forEach((p, i) => ajouter(`fiche.plante.${fiches.PLANTES.indexOf(a) + 1}.${age}.${i + 1}`, 'Textes : nature-fiches', p));
  }
}

// Les phrases écrites telles quelles dans l'app : parler('…') sans partie variable
const app = readFileSync(new URL('js/app.js', racine), 'utf8');
let n = 0;
for (const [, , t] of app.matchAll(/parler\((['"`])((?:(?!\1)[^\\]|\\.)*)\1/g)) if (!t.includes('${')) ajouter(`app.${++n}`, "Phrases de l'app", t.replace(/\\'/g, "'"));

{ // parler(`Bravo, le squelette est complet ! ${texte}`) : les phrases entières qui ne changent jamais, autour des parties variables
  const { phrases } = await js('voix-cle.js');
  let k = 0;
  for (const [, t] of app.matchAll(/parler\(`([^`]*)/g)) {
    for (const p of phrases(t.replace(/\$\{[^}]*\}?/g, ' ◆ ').replace(/\\'/g, "'"))) if (!p.includes('◆') && /[.!?]$/.test(p)) ajouter(`app.trou.${++k}`, "Phrases de l'app", p);
  }
  ajouter('magasin.maison', "Phrases de l'app", 'Voici ta maison !');
  for (const [id, m] of Object.entries(catalogue.MAGASINS)) ajouter(`magasin.${id}`, "Phrases de l'app", `Bienvenue ${m.nom.replace(/^Le /, 'au ').replace(/^La /, 'à la ')} !`);
}

const csv = ['id;source;texte', ...lignes.map((l) => l.map((x) => (/[;"\n]/.test(x) ? `"${x.replaceAll('"', '""')}"` : x)).join(';'))].join('\n');
writeFileSync(new URL('voix/phrases.csv', racine), `﻿${csv}\n`); // BOM : les accents s'ouvrent bien dans Excel
console.log(`${lignes.length} phrases écrites dans voix/phrases.csv`);

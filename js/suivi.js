// Les rendez-vous : la série de jours, le coffre de la semaine, l'énigme du jour (profil.rdv).
// Et le journal de la semaine (profil.journal), pour le résumé de l'espace parents. Rien ici ne touche à l'écran.
const deux = (n) => String(n).padStart(2, '0');
export const jour = (d = new Date()) => `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
const decaler = (j, n) => { const d = new Date(`${j}T12:00:00`); d.setDate(d.getDate() + n); return d; };
// Une semaine porte la date de son lundi
export const semaine = (d = new Date()) => jour(decaler(jour(d), -((d.getDay() + 6) % 7)));

export const ETOILES_VISITE = 1; // chaque jour où l'enfant vient
export const ETOILES_SEPTIEME = 10; // le 7e jour de suite, puis le 14e, le 21e…
export const ETOILES_ENIGME = 3; // l'énigme du jour réussie
export const COFFRE = [5, 15]; // le coffre de la semaine : entre 5 et 15 étoiles

// L'enfant ouvre son île : le premier passage du jour compte pour la série et donne des étoiles.
export function visiter(profil, d = new Date()) {
  const r = (profil.rdv ??= {}), j = jour(d);
  if (r.dernier === j) return { nouveau: false, serie: r.serie, gain: 0 };
  r.serie = r.dernier === jour(decaler(j, -1)) ? (r.serie ?? 0) + 1 : 1;
  r.dernier = j;
  const gain = r.serie % 7 === 0 ? ETOILES_SEPTIEME : ETOILES_VISITE;
  profil.etoiles += gain;
  return { nouveau: true, serie: r.serie, gain };
}
// La série en cours : elle retombe à 0 si l'enfant a sauté un jour
export const serieEnCours = (profil, d = new Date()) => ([jour(d), jour(decaler(jour(d), -1))].includes(profil.rdv?.dernier) ? profil.rdv.serie : 0);

export const coffrePret = (profil, d = new Date()) => profil.rdv?.coffre !== semaine(d);
export function ouvrirCoffre(profil, d = new Date(), aleatoire = Math.random) {
  if (!coffrePret(profil, d)) return 0;
  const gain = COFFRE[0] + Math.floor(aleatoire() * (COFFRE[1] - COFFRE[0] + 1));
  (profil.rdv ??= {}).coffre = semaine(d);
  profil.etoiles += gain;
  return gain;
}

export const enigmeFaite = (profil, d = new Date()) => profil.rdv?.enigme === jour(d);
// Une seule réponse par jour. Renvoie les étoiles gagnées.
export function repondreEnigme(profil, juste, d = new Date()) {
  if (enigmeFaite(profil, d)) return 0;
  (profil.rdv ??= {}).enigme = jour(d);
  const gain = juste ? ETOILES_ENIGME : 0;
  profil.etoiles += gain;
  return gain;
}

// Le journal : pour chaque semaine, les jours joués et, par jeu, [parties, bonnes réponses, questions]. On garde 4 semaines.
export function noterPartie(profil, jeu, bonnes = null, questions = null, d = new Date()) {
  const journal = (profil.journal ??= {}), s = (journal[semaine(d)] ??= { jours: [], jeux: {} });
  if (!s.jours.includes(jour(d))) s.jours.push(jour(d));
  const l = (s.jeux[jeu] ??= [0, 0, 0]);
  l[0]++;
  if (questions) { l[1] += bonnes; l[2] += questions; }
  for (const k of Object.keys(journal).sort().slice(0, -4)) delete journal[k];
}

// La météo du cœur : l'émotion que l'enfant choisit, une par jour (le dernier choix du jour compte). On garde 14 jours.
export function noterMeteo(profil, cle, d = new Date()) {
  const m = (profil.meteo ??= {});
  m[jour(d)] = cle;
  for (const k of Object.keys(m).sort().slice(0, -14)) delete m[k];
}
const JOURS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
// Les 7 jours de la semaine en cours : [['lun.', 'joie'], ['mar.', null], …]
export const meteoSemaine = (profil, d = new Date()) => JOURS.map((nom, i) => [nom, profil.meteo?.[jour(decaler(semaine(d), i))] ?? null]);

export const NOMS_JEUX = {
  calcul: 'le calcul', heure: 'lire l’heure', corps: 'le corps humain', syllabes: 'les syllabes', dictee: 'la dictée magique', robot: 'l’atelier des robots', suisse: 'la Suisse',
  naturaliste: 'la cabane nature', potager: 'le quiz du potager', secours: 'les premiers secours', espace: 'l’observatoire', cuisine: 'le restaurant', marche: 'le marché', emotions: 'les émotions',
  atlas: 'l’atlas du corps', dinos: 'les dinosaures', passeport: 'le passeport', urgences: 'les numéros d’urgence', route: 'le code de la route', tri: 'le centre de tri', langues: 'l’école des langues',
  veto: 'le vétérinaire', fractions: 'la pizzeria', croyance: 'le lieu de croyance', recit: 'les histoires', intrus: 'trouve l’intrus', suites: 'les suites logiques', potions: 'les potions',
  missions: 'les missions de la maison', labyrinthe: 'le labyrinthe', glacier: 'le glacier', experiences: 'le labo des expériences', jardinage: 'le potager', defi: 'le défi à deux', ecriture: 'l’atelier d’écriture',
  chantier: 'le chantier', 'enigme-du-jour': 'l’énigme du jour', memory: 'le memory', sudoku: 'le sudoku', taquin: 'le taquin', parking: 'le parking bloqué', code: 'le code des couleurs', tour: 'la tour à déplacer', dessins: 'les dessins cachés', deduction: 'les énigmes de déduction',
};
const nom = (jeu) => NOMS_JEUX[jeu] ?? jeu;
// Le résumé de la semaine pour un parent. Un jeu « réussi » : au moins 8 bonnes réponses sur 10 ; « à revoir » : moins de 5 sur 10 (avec au moins 5 questions).
export function resume(profil, d = new Date()) {
  const s = profil.journal?.[semaine(d)] ?? { jours: [], jeux: {} }, avant = profil.journal?.[semaine(decaler(jour(d), -7))];
  const total = (x) => Object.values(x?.jeux ?? {}).reduce((n, l) => n + l[0], 0);
  const jeux = Object.entries(s.jeux).sort((a, b) => b[1][0] - a[1][0]);
  const taux = jeux.filter(([, l]) => l[2] >= 5).map(([jeu, l]) => [nom(jeu), l[1] / l[2]]);
  return {
    jours: s.jours.length, parties: total(s), partiesAvant: total(avant), serie: serieEnCours(profil, d),
    plusJoues: jeux.slice(0, 3).map(([jeu, l]) => `${nom(jeu)} (${l[0]})`),
    reussis: taux.filter(([, t]) => t >= 0.8).map(([n]) => n), aRevoir: taux.filter(([, t]) => t < 0.5).map(([n]) => n),
    meteo: meteoSemaine(profil, d).filter(([, m]) => m), // la météo du cœur choisie cette semaine : [['lun.', 'joie'], …]
  };
}

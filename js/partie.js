// Moteur commun des mini-jeux : une partie = 10 questions ; étoiles et bonus réglés dans reglages.js.
import { QUESTIONS_PAR_PARTIE as NB_QUESTIONS, BONUS_SANS_FAUTE, ETOILES_AUTRES_JEUX } from './reglages.js';

// Étoiles par bonne réponse d'un jeu (heure, corps, syllabes, espace, cuisine), selon l'âge : voir reglages.js
export const etoilesDuJeu = (jeu, age) => (ETOILES_AUTRES_JEUX.find((l) => age <= l.jusqua) ?? ETOILES_AUTRES_JEUX.at(-1))[jeu];

export function melanger(liste, aleatoire = Math.random) {
  const l = [...liste];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(aleatoire() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

// n choix distincts dans [min, max], dont la bonne réponse. Les pièges viennent de `candidats`,
// complétés par les nombres voisins de la réponse si besoin.
export function choixAutour(reponse, candidats, n, aleatoire = Math.random, min = 0, max = Infinity) {
  const ok = (c) => c !== reponse && c >= min && c <= max;
  const pieges = melanger([...new Set(candidats)].filter(ok), aleatoire).slice(0, n - 1);
  for (let k = 1; pieges.length < n - 1 && k < 1000; k++) {
    for (const c of [reponse + k, reponse - k]) if (pieges.length < n - 1 && ok(c) && !pieges.includes(c)) pieges.push(c);
  }
  return melanger([reponse, ...pieges], aleatoire);
}

// Une entrée au hasard parmi celles pas encore posées (cle : son identifiant). Si tout a été posé, parmi toutes.
export function parmiLesNouveaux(liste, cle, vus, aleatoire = Math.random) {
  const nouveaux = liste.filter((x) => !vus.has(cle(x)));
  const l = nouveaux.length ? nouveaux : liste;
  return l[Math.floor(aleatoire() * l.length)];
}

// reglage : ce que le jeu a besoin de savoir pour ses questions (ex. { operation, age }).
// vus : les questions déjà posées à cette joueuse (gardé dans son profil). Une question ne revient pas tant que
// les autres n'ont pas été posées ; quand tout a été posé, on recommence un tour. vus est mis à jour.
export function nouvellePartie(genererQuestion, reglage, aleatoire = Math.random, vus = new Set()) {
  const questions = [];
  let rates = 0, tours = 0;
  while (questions.length < NB_QUESTIONS) {
    const q = genererQuestion(reglage, aleatoire, questions.length, vus); // numéro de la question, pour les jeux qui en tiennent compte
    const nouvelle = !vus.has(q.texte) && !questions.some((x) => x.texte === q.texte);
    if (nouvelle || tours >= 2) { // tours >= 2 : moins de 10 questions possibles en tout, on accepte les doublons
      questions.push(q);
      vus.add(q.texte);
      rates = 0;
    } else if (++rates > 300) { // plus rien de nouveau : un nouveau tour commence (sans reprendre celles de cette partie)
      vus.clear();
      for (const x of questions) vus.add(x.texte);
      rates = 0;
      tours++;
    }
  }
  return { questions, index: 0, bonnes: 0, serie: 0 }; // serie : bonnes réponses d'affilée
}

export const questionEnCours = (partie) => partie.questions[partie.index];

export function repondre(partie, choix) {
  const juste = choix === questionEnCours(partie).reponse;
  if (juste) partie.bonnes++;
  partie.serie = juste ? partie.serie + 1 : 0;
  partie.index++;
  return juste;
}

export const terminee = (partie) => partie.index >= partie.questions.length;
// total : le nombre de questions (les recettes n'en ont pas toujours 10). Sans-faute = bonus.
export const etoilesGagnees = (bonnes, parBonneReponse = 1, total = NB_QUESTIONS) => bonnes * parBonneReponse + (bonnes === total ? BONUS_SANS_FAUTE : 0);

// 7.5 → « 7,5 »
export const formatEtoiles = (n) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });

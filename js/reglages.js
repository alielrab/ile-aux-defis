// ─────────────────────────────────────────────────────────────────────────────
//  RÉGLAGES — valeurs faciles à ajuster. Modifiez les nombres, enregistrez,
//  rechargez l'app. (Les virgules s'écrivent avec un point : 1.5 = 1,5)
// ─────────────────────────────────────────────────────────────────────────────

// Étoiles gagnées par bonne réponse à l'école, selon l'âge et l'opération.
// On prend la première ligne dont « jusqu'à » est ≥ à l'âge de l'enfant.
export const ETOILES_ECOLE = [
  { jusqua: 7, addition: 1, soustraction: 1.5, multiplication: 2, division: 2 }, // 7 ans et moins (ex. 6 ans)
  { jusqua: 99, addition: 0.5, soustraction: 0.5, multiplication: 1, division: 1 }, // 8 ans et plus (ex. 9 ans)
];

// Étoiles en plus pour un sans-faute (10 bonnes réponses sur 10).
export const BONUS_SANS_FAUTE = 2;

// Nombre de questions par partie.
export const QUESTIONS_PAR_PARTIE = 10;

// Étoiles par bonne réponse (ou par étape réussie en cuisine) dans les autres jeux, selon l'âge.
// croyance = le lieu de croyance du village (petites questions),
// heure = tour de l'horloge, corps = hôpital, syllabes = bibliothèque, espace = observatoire, cuisine = restaurant.
export const ETOILES_AUTRES_JEUX = [
  { jusqua: 7, heure: 1.5, corps: 1, syllabes: 1, espace: 1, cuisine: 1, croyance: 1 }, // 7 ans et moins
  { jusqua: 99, heure: 1, corps: 1, syllabes: 1, espace: 1, cuisine: 0.5, croyance: 1 }, // 8 ans et plus
];

// Recette faite pour de vrai avec un parent (validée avec le code) : étoiles en plus, et un objet pour la cuisine de la maison.
export const BONUS_RECETTE_REELLE = 10;

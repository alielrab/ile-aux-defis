// Ce que l'app dit après chaque réponse : varié, jamais deux fois la même phrase d'affilée.
export const FELICITATIONS = [
  'Bravo !', 'Super !', 'Excellent !', 'Continue comme ça !', 'Tu es trop forte !',
  'Génial !', 'Bien joué !', 'Waouh, bravo !', 'Tu assures !', 'Parfait !',
];
export const ENCOURAGEMENTS = [
  'Presque !', 'Pas grave, on continue !', 'Oups, presque !', 'Tu vas y arriver !', "Ce n'est pas grave !",
];
export const SERIES = {
  3: '3 de suite !',
  5: "5 d'affilée, incroyable !",
  7: '7 de suite, quelle championne !',
  10: 'Dix sur dix, un sans-faute !',
};

let dernier = null;
export function auHasard(liste, aleatoire = Math.random) {
  const possibles = liste.length > 1 ? liste.filter((m) => m !== dernier) : liste;
  return (dernier = possibles[Math.floor(aleatoire() * possibles.length)]);
}

// type : 'serie' (palier atteint), 'felicitation' ou 'encouragement'.
export function messageReponse(juste, serie, aleatoire = Math.random) {
  if (!juste) return { type: 'encouragement', texte: auHasard(ENCOURAGEMENTS, aleatoire) };
  if (SERIES[serie]) return { type: 'serie', texte: SERIES[serie] };
  return { type: 'felicitation', texte: auHasard(FELICITATIONS, aleatoire) };
}

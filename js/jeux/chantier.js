// Le chantier (île du village) : « La grue folle ». Une grue balance un bloc ; on touche l'écran pour le lâcher.
// Le bloc tient s'il tombe assez bien sur celui du dessous ; sinon la partie s'arrête. Chaque étage rapporte des étoiles.
// Une pièce achetée au magasin de meubles se construit ici : il faut une tour d'une certaine hauteur.
import { etoilesDuJeu } from '../partie.js';

export const HAUTEURS = { salon: 5, jeux: 6, jardin: 8, grenier: 7 }; // étages à atteindre pour construire la pièce
export const NOMS = { salon: 'le salon', jeux: 'la salle de jeux', jardin: 'le jardin', grenier: 'le grenier' }; // pour les phrases
export const LARGEUR = 90, AMPLITUDE = 120; // largeur d'un bloc, et jusqu'où la grue le balance de chaque côté du milieu

// 7 ans et moins : plus lent, et le bloc tient même posé de travers. tolerance : écart permis, en largeurs de bloc.
const reglage = (age) => (age <= 7 ? { vitesse: 1.5, tolerance: 0.8 } : { vitesse: 2.3, tolerance: 0.55 });
// La grue accélère un peu à chaque étage, jusqu'au double.
export const vitesse = (etage, age) => reglage(age).vitesse * Math.min(2, 1 + etage * 0.06);
// dessous, x : le milieu du bloc du dessous et celui du bloc lâché
export const tient = (dessous, x, age) => Math.abs(x - dessous) <= LARGEUR * reglage(age).tolerance;

export const chantierVide = () => ({ record: 0, aConstruire: [] });

// La fin d'une partie : les étoiles, le record, et les pièces en attente dont la hauteur est atteinte.
export function finir(profil, etages) {
  const c = profil.chantier ??= chantierVide();
  const gain = etages * etoilesDuJeu('chantier', profil.age);
  profil.etoiles += gain;
  const record = etages > c.record;
  if (record) c.record = etages;
  const construites = c.aConstruire.filter((k) => HAUTEURS[k] <= etages);
  c.aConstruire = c.aConstruire.filter((k) => !construites.includes(k));
  return { gain, record, construites };
}

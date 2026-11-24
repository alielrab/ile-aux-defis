// Mon potager (île de la nature) : semer, arroser, voir pousser, récolter. 4 carrés de terre.
// On sème seulement ce qui se sème ce mois-ci (les saisons). On arrose une fois par jour : après 3 jours d'arrosage, on récolte.
export const ETOILES_RECOLTE = 4;
export const NB_CARRES = 4;
export const ARROSAGES = 3; // jours d'arrosage avant la récolte
export const STADES = ['🌱', '🌿', '🪴']; // puis le légume lui-même, prêt à récolter

// mois : les mois où l'on sème ou plante en Suisse, au jardin (1 = janvier). Simplifié : à faire relire par un parent jardinier.
export const LEGUMES = [
  { cle: 'cresson', nom: 'Le cresson', image: '🥗', mois: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], note: 'Il pousse toute l’année, dans un pot près de la fenêtre.' },
  { cle: 'radis', nom: 'Les radis', image: '🔴', mois: [3, 4, 5, 6, 7, 8, 9] },
  { cle: 'salade', nom: 'La salade', image: '🥬', mois: [3, 4, 5, 6, 7, 8, 9] },
  { cle: 'carotte', nom: 'Les carottes', image: '🥕', mois: [3, 4, 5, 6, 7] },
  { cle: 'pois', nom: 'Les petits pois', image: '🫛', mois: [3, 4] },
  { cle: 'fraise', nom: 'Les fraisiers', image: '🍓', mois: [3, 4, 5, 8, 9] },
  { cle: 'tomate', nom: 'Les tomates', image: '🍅', mois: [5, 6] },
  { cle: 'courge', nom: 'La courge', image: '🎃', mois: [5, 6] },
  { cle: 'haricot', nom: 'Les haricots', image: '🫘', mois: [5, 6, 7] },
  { cle: 'mache', nom: 'La mâche', image: '🌿', mois: [8, 9, 10] },
  { cle: 'ail', nom: 'L’ail', image: '🧄', mois: [10, 11] },
  { cle: 'tulipe', nom: 'Les bulbes de tulipes', image: '🌷', mois: [10, 11] },
];
export const legume = (cle) => LEGUMES.find((l) => l.cle === cle);
const moisDe = (jour) => Number(jour.slice(5, 7));
export const deSaison = (jour) => LEGUMES.filter((l) => l.mois.includes(moisDe(jour)));

// Les carrés : null (vide) ou { legume, arrosages, arrose : le dernier jour d'arrosage }
export const carres = (profil) => ((profil.potager ??= { carres: Array(NB_CARRES).fill(null) }).carres);
export const pret = (c) => Boolean(c) && c.arrosages >= ARROSAGES;
export const image = (c) => (pret(c) ? legume(c.legume).image : STADES[c.arrosages]);

export function semer(profil, i, cle, jour) {
  const l = legume(cle), c = carres(profil);
  if (!l || !(i in c)) throw new Error('Carré ou légume inconnu.');
  if (c[i]) throw new Error('Ce carré est déjà planté.');
  if (!l.mois.includes(moisDe(jour))) throw new Error('Ce n’est pas la saison.');
  c[i] = { legume: cle, arrosages: 0, arrose: null };
}
// Renvoie true si l'eau a servi (une fois par jour et par carré)
export function arroser(profil, i, jour) {
  const c = carres(profil)[i];
  if (!c || pret(c) || c.arrose === jour) return false;
  c.arrosages++;
  c.arrose = jour;
  return true;
}
// Renvoie les étoiles gagnées (0 si ce n'est pas prêt)
export function recolter(profil, i) {
  const c = carres(profil);
  if (!pret(c[i])) return 0;
  c[i] = null;
  profil.etoiles += ETOILES_RECOLTE;
  return ETOILES_RECOLTE;
}

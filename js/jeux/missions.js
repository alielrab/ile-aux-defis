// Les missions de la maison (île du cœur) : de vraies petites tâches (ranger sa chambre, mettre la table…).
// L'enfant dit « C'est fait ! », puis un parent valide avec le code : la mission rapporte des étoiles. Chaque mission, une fois par jour.
export const ETOILES_MISSION = 3;

export const MISSIONS = [
  { cle: 'chambre', image: '🛏️', nom: 'Ranger ma chambre' },
  { cle: 'lit', image: '🛌', nom: 'Faire mon lit' },
  { cle: 'table', image: '🍽️', nom: 'Mettre la table' },
  { cle: 'debarrasser', image: '🧽', nom: 'Débarrasser la table' },
  { cle: 'jouets', image: '🧸', nom: 'Ranger mes jouets' },
  { cle: 'linge', image: '🧺', nom: 'Mettre mon linge au panier' },
  { cle: 'plantes', image: '🪴', nom: 'Arroser les plantes' },
  { cle: 'animal', image: '🐾', nom: 'M’occuper de l’animal de la maison' },
  { cle: 'cartable', image: '🎒', nom: 'Préparer mon cartable' },
  { cle: 'dents', image: '🪥', nom: 'Me brosser les dents sans qu’on me le dise' },
];

// Le jour, vu de l'appareil : « 2026-11-24 »
export const aujourdhui = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Les missions du jour : { jour, attente : à valider par un parent, faites : validées }. Un nouveau jour repart de zéro.
export function duJour(profil, jour = aujourdhui()) {
  if (profil.missions?.jour !== jour) profil.missions = { jour, attente: [], faites: [] };
  return profil.missions;
}
export const etat = (profil, cle, jour = aujourdhui()) => { const m = duJour(profil, jour); return m.faites.includes(cle) ? 'faite' : m.attente.includes(cle) ? 'attente' : 'libre'; };

// L'enfant : « C'est fait ! » (en attente d'un parent)
export function annoncer(profil, cle, jour = aujourdhui()) {
  if (!MISSIONS.some((m) => m.cle === cle)) throw new Error('Mission inconnue.');
  if (etat(profil, cle, jour) === 'libre') duJour(profil, jour).attente.push(cle);
}
// Le parent : oui (les étoiles sont gagnées) ou non (la mission redevient libre). Renvoie les étoiles gagnées.
export function valider(profil, cle, oui, jour = aujourdhui()) {
  const m = duJour(profil, jour), i = m.attente.indexOf(cle);
  if (i < 0) return 0;
  m.attente.splice(i, 1);
  if (!oui) return 0;
  m.faites.push(cle);
  profil.etoiles += ETOILES_MISSION;
  return ETOILES_MISSION;
}

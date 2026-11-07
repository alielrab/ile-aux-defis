// L'archipel : plusieurs îles thématiques reliées par un bateau. Chaque enfant débloque les îles avec ses étoiles.
// Pour ajouter une île plus tard : une entrée ici (position sur la carte de l'archipel), ses lieux dans js/carte.js (ile: 'son-id'),
// et son prix dans PRIX_ILES (js/reglages.js) si elle n'est pas ouverte dès le départ.
import { PRIX_ILES } from './reglages.js';

// x, y : centre de l'île sur la carte de l'archipel. herbe : la couleur de l'île. vitrine : les bâtiments montrés en petit.
export const ILES = [
  { id: 'village', nom: "L'île du village", ouverte: true, x: 225, y: 300, herbe: '#8fd16a', vitrine: ['coiffeur', 'maison', 'mode'] },
  { id: 'savoir', nom: "L'île du savoir", ouverte: true, x: 575, y: 285, herbe: '#9fd8a0', vitrine: ['calcul', 'heure', 'espace'] },
  { id: 'createurs', nom: "L'île des créateurs", x: 225, y: 640, herbe: '#cfe27a', vitrine: ['cuisine', 'peinture'] },
  { id: 'coeur', nom: "L'île du cœur", x: 575, y: 625, herbe: '#f4bfd0', vitrine: ['confiance', 'emotions'] },
  { id: 'securite', nom: "L'île de la sécurité", x: 225, y: 975, herbe: '#b8e0c8', vitrine: ['urgences', 'route'] },
];
// De la place pour les prochaines îles (dessinées dans la brume, « Bientôt »)
export const EMPLACEMENTS_LIBRES = [[400, 465], [575, 975]];

export const ile = (id) => ILES.find((i) => i.id === id);
export const prixIle = (id) => (ile(id).ouverte ? 0 : PRIX_ILES[id]);
export const ileOuverte = (profil, id) => !!ile(id).ouverte || prixIle(id) === 0 || (profil.iles ?? []).includes(id);

// Débloquer une île avec ses étoiles (une seule fois). Renvoie le prix payé.
export function debloquerIle(profil, id) {
  if (!ile(id)) throw new Error('Île inconnue.');
  if (ileOuverte(profil, id)) throw new Error('Cette île est déjà ouverte.');
  const prix = prixIle(id);
  if (profil.etoiles < prix) throw new Error(`Il te faut ${prix} étoiles.`);
  profil.etoiles -= prix;
  profil.iles = [...(profil.iles ?? []), id];
  return prix;
}

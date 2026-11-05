// Tout ce qui s'achète avec des étoiles, et les magasins de l'île qui le vendent.
// Prix 0 = disponible dès le départ (pour pouvoir y revenir). piece = la pièce de la maison où l'objet se place.
import { TENUES, COIFFURES, CHEVEUX, PRIX_LOOK, ACCESSOIRES, avatarValide } from './avatar.js';

export const PIECES = {
  chambre: { nom: 'Chambre', prix: 0 },
  salon: { nom: 'Salon', prix: 30 },
  jeux: { nom: 'Salle de jeux', prix: 30 },
  cuisine: { nom: 'Cuisine', prix: 0 }, // ses objets se gagnent en faisant les recettes du restaurant pour de vrai
};
export const MEUBLES = {
  plante: { nom: 'Plante', prix: 6, piece: 'chambre' },
  tapis: { nom: 'Tapis', prix: 8, piece: 'chambre' },
  lampe: { nom: 'Lampe', prix: 8, piece: 'chambre' },
  etagere: { nom: 'Étagère à livres', prix: 10, piece: 'chambre' },
  bureau: { nom: 'Bureau', prix: 12, piece: 'chambre' },
  lit: { nom: 'Lit', prix: 15, piece: 'chambre' },
  'table-basse': { nom: 'Table basse', prix: 8, piece: 'salon' },
  lampadaire: { nom: 'Lampadaire', prix: 8, piece: 'salon' },
  fauteuil: { nom: 'Fauteuil', prix: 10, piece: 'salon' },
  bibliotheque: { nom: 'Bibliothèque', prix: 12, piece: 'salon' },
  tele: { nom: 'Télévision', prix: 15, piece: 'salon' },
  canape: { nom: 'Canapé', prix: 18, piece: 'salon' },
};
export const JOUETS = {
  ballon: { nom: 'Ballon', prix: 4, piece: 'chambre' },
  ours: { nom: 'Ours en peluche', prix: 6, piece: 'chambre' },
  robot: { nom: 'Robot', prix: 8, piece: 'chambre' },
  'cerf-volant': { nom: 'Cerf-volant', prix: 6, piece: 'jeux' },
  train: { nom: 'Petit train', prix: 10, piece: 'jeux' },
  manege: { nom: 'Manège', prix: 15, piece: 'jeux' },
  toboggan: { nom: 'Toboggan', prix: 18, piece: 'jeux' },
};
export const PAPIERS = {
  menthe: { nom: 'Vert menthe', prix: 8 },
  rayures: { nom: 'Rayures roses', prix: 10 },
  pois: { nom: 'Pois bleus', prix: 10 },
  etoiles: { nom: 'Ciel étoilé', prix: 14 },
};
// Objets de cuisine : pas à vendre, on les gagne en faisant une recette du restaurant pour de vrai, avec un parent.
export const USTENSILES = {
  poele: { nom: 'Poêle à crêpes', piece: 'cuisine', prix: null },
  four: { nom: 'Four', piece: 'cuisine', prix: null },
  corbeille: { nom: 'Corbeille de fruits', piece: 'cuisine', prix: null },
  moule: { nom: 'Moule à gâteau', piece: 'cuisine', prix: null },
  tablier: { nom: 'Tablier de chef', piece: 'cuisine', prix: null },
};
export const ANIMAUX = {
  poisson: { nom: 'Poisson rouge', prix: 12 },
  hamster: { nom: 'Hamster', prix: 15 },
  lapin: { nom: 'Lapin', prix: 20 },
  chat: { nom: 'Chaton', prix: 30 },
  chien: { nom: 'Chiot', prix: 30 },
};

const articles = (type, liste, nom, prix = (k) => liste[k].prix ?? 0) =>
  Object.keys(liste).map((cle) => ({ id: `${type}:${cle}`, type, cle, nom: nom(cle), prix: prix(cle), piece: liste[cle].piece }));

export const CATALOGUE = [
  ...articles('piece', PIECES, (k) => PIECES[k].nom),
  ...articles('meuble', MEUBLES, (k) => MEUBLES[k].nom),
  ...articles('jouet', JOUETS, (k) => JOUETS[k].nom),
  ...articles('papier', PAPIERS, (k) => PAPIERS[k].nom),
  ...articles('animal', ANIMAUX, (k) => ANIMAUX[k].nom),
  ...articles('ustensile', USTENSILES, (k) => USTENSILES[k].nom, () => null), // pas de prix : pas à vendre
  ...articles('tenue', TENUES, (k) => TENUES[k].nom),
  ...articles('accessoire', ACCESSOIRES, (k) => ACCESSOIRES[k].nom),
  ...articles('coiffure', COIFFURES, (k) => COIFFURES[k], (k) => PRIX_LOOK.coiffure[k] ?? 0),
  ...articles('cheveux', CHEVEUX, (k) => `Cheveux ${k.replace('chatain', 'châtain')}`, (k) => PRIX_LOOK.cheveux[k] ?? 0),
];

// Les magasins de l'île : chaque rayon liste des types d'objets. apercu : ce qu'on voit en haut du magasin.
export const MAGASINS = {
  coiffeur: { nom: 'Le coiffeur', apercu: 'avatar', rayons: [['✂️ Coiffures', ['coiffure']], ['🎨 Couleurs', ['cheveux']]] },
  mode: { nom: 'La boutique', apercu: 'avatar', rayons: [['👗 Vêtements', ['tenue']], ['💍 Bijoux', ['accessoire']]] },
  meubles: { nom: 'Le magasin de meubles', apercu: 'piece', rayons: [['🛋️ Meubles', ['meuble']], ['🧸 Jouets', ['jouet']], ['🖌️ Murs', ['papier']], ['🏠 Pièces', ['piece']]] },
  refuge: { nom: 'Le refuge', apercu: 'piece', rayons: [['🐾 Animaux', ['animal']]] },
};

export const article = (id) => CATALOGUE.find((a) => a.id === id);
export const possede = (profil, a) => a.prix === 0 || profil.objets.includes(a.id);
// Un meuble ou un jouet du salon ne s'achète qu'une fois le salon acheté.
export const pieceManquante = (profil, a) => (a.piece && !possede(profil, article(`piece:${a.piece}`)) ? PIECES[a.piece].nom : null);

const DANS_LA_PIECE = ['meuble', 'jouet', 'animal', 'ustensile'];

// Est-ce que l'objet est en place dans la maison, ou porté par l'avatar ?
export function estUtilise(profil, a) {
  const m = profil.maison;
  if (DANS_LA_PIECE.includes(a.type)) return m.places.includes(a.id);
  if (a.type === 'papier') return m.papiers[m.piece] === a.cle;
  if (a.type === 'piece') return m.piece === a.cle;
  if (a.type === 'accessoire') return (profil.avatar.accessoires ?? []).includes(a.cle);
  return profil.avatar[a.type] === a.cle; // tenue, coiffure, cheveux
}

// Placer/ranger, mettre/enlever (papier peint de la pièce affichée, bijou), porter, aller dans une pièce.
export function utiliser(profil, id) {
  const a = article(id);
  if (!a || !possede(profil, a)) throw new Error("Tu n'as pas encore cet objet.");
  const m = profil.maison, avatar = profil.avatar;
  const bascule = (liste, x) => (liste.includes(x) ? liste.filter((y) => y !== x) : [...liste, x]);
  if (DANS_LA_PIECE.includes(a.type)) m.places = bascule(m.places, id);
  else if (a.type === 'papier') m.papiers[m.piece] = estUtilise(profil, a) ? null : a.cle;
  else if (a.type === 'piece') m.piece = a.cle;
  else if (a.type === 'accessoire') avatar.accessoires = bascule(avatar.accessoires ?? [], a.cle);
  else avatar[a.type] = a.cle;
}

export function acheter(profil, id) {
  const a = article(id);
  if (!a) throw new Error('Objet inconnu.');
  if (possede(profil, a)) throw new Error("Tu l'as déjà !");
  const piece = pieceManquante(profil, a);
  if (piece) throw new Error(`Achète d'abord la pièce : ${piece}.`);
  const manque = a.prix - profil.etoiles;
  if (manque > 0) throw new Error(`Il te manque ${manque.toLocaleString('fr-FR')} étoile${manque > 1 ? 's' : ''}.`);
  profil.etoiles -= a.prix;
  profil.objets.push(id);
  utiliser(profil, id); // un objet acheté est tout de suite installé (ou porté)
}

// Un cadeau (objet de cuisine) : gardé et installé tout de suite, sans payer.
export function recevoir(profil, id) {
  if (profil.objets.includes(id)) return;
  profil.objets.push(id);
  utiliser(profil, id);
}

// Modifier son personnage : peau et yeux libres ; le reste parmi ce qu'elle possède.
export function modifierAvatar(profil, avatar) {
  if (!avatarValide(avatar)) throw new Error('Termine ton personnage.');
  for (const type of ['coiffure', 'cheveux', 'tenue']) {
    const a = article(`${type}:${avatar[type]}`);
    if (!possede(profil, a)) throw new Error(`Tu n'as pas encore : ${a.nom}.`);
  }
  const accessoires = avatar.accessoires ?? profil.avatar.accessoires ?? [];
  if (!accessoires.every((x) => possede(profil, article(`accessoire:${x}`)))) throw new Error("Tu n'as pas encore ce bijou.");
  const { peau, yeux, coiffure, cheveux, tenue } = avatar;
  profil.avatar = { peau, yeux, coiffure, cheveux, tenue, accessoires: [...accessoires] };
}

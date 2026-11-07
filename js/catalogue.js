// Tout ce qui s'achète avec des étoiles, et les magasins de l'île qui le vendent.
// Prix 0 = disponible dès le départ (pour pouvoir y revenir). piece = la pièce de la maison où l'objet se place.
import { TENUES, COIFFURES, CHEVEUX, PRIX_LOOK, ACCESSOIRES, CHAUSSURES, CHAPEAUX, avatarValide } from './avatar.js';

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
  horloge: { nom: 'Horloge', prix: 8, piece: 'chambre' },
  pouf: { nom: 'Pouf', prix: 9, piece: 'chambre' },
  guirlande: { nom: 'Guirlande lumineuse', prix: 10, piece: 'chambre' },
  coffre: { nom: 'Coffre à jouets', prix: 12, piece: 'chambre' },
  miroir: { nom: 'Miroir', prix: 9, piece: 'salon' },
  'plante-salon': { nom: 'Grande plante', prix: 8, piece: 'salon' },
  'tapis-salon': { nom: 'Tapis du salon', prix: 10, piece: 'salon' },
  'tableau-noir': { nom: 'Tableau noir', prix: 12, piece: 'jeux' },
  // la cuisine complète (le four, la poêle… se gagnent au restaurant)
  'etagere-cuisine': { nom: 'Étagère à bocaux', prix: 8, piece: 'cuisine' },
  chaises: { nom: 'Chaises', prix: 10, piece: 'cuisine' },
  placard: { nom: 'Placard', prix: 12, piece: 'cuisine' },
  evier: { nom: 'Évier', prix: 14, piece: 'cuisine' },
  'table-cuisine': { nom: 'Table de cuisine', prix: 14, piece: 'cuisine' },
  'lave-vaisselle': { nom: 'Lave-vaisselle', prix: 15, piece: 'cuisine' },
  frigo: { nom: 'Frigo', prix: 20, piece: 'cuisine' },
};
// La couleur de la couverture du lit (rose au départ)
export const COULEURS_LIT = {
  rose: { nom: 'Lit rose', prix: 0, couleur: '#f080b0' }, bleu: { nom: 'Lit bleu', prix: 6, couleur: '#5b9ae0' },
  vert: { nom: 'Lit vert', prix: 6, couleur: '#5cb85c' }, jaune: { nom: 'Lit jaune', prix: 6, couleur: '#f2c230' },
  turquoise: { nom: 'Lit turquoise', prix: 6, couleur: '#2bb3a0' }, violet: { nom: 'Lit violet', prix: 8, couleur: '#8e6ad8' },
  rouge: { nom: 'Lit rouge', prix: 8, couleur: '#e05252' },
};
export const JOUETS = {
  ballon: { nom: 'Ballon', prix: 4, piece: 'chambre' },
  ours: { nom: 'Ours en peluche', prix: 6, piece: 'chambre' },
  robot: { nom: 'Robot', prix: 8, piece: 'chambre' },
  'cerf-volant': { nom: 'Cerf-volant', prix: 6, piece: 'jeux' },
  train: { nom: 'Petit train', prix: 10, piece: 'jeux' },
  manege: { nom: 'Manège', prix: 15, piece: 'jeux' },
  toboggan: { nom: 'Toboggan', prix: 18, piece: 'jeux' },
  cubes: { nom: 'Cubes à lettres', prix: 6, piece: 'jeux' },
  'piscine-balles': { nom: 'Piscine à balles', prix: 20, piece: 'jeux' },
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
// espece : le dessin de base ; couleurs : pour changer le pelage (couleur du dessin → nouvelle couleur) ; taches : en plus
export const ANIMAUX = {
  poisson: { nom: 'Poisson rouge', prix: 12, espece: 'poisson' },
  hamster: { nom: 'Hamster', prix: 15, espece: 'hamster' },
  lapin: { nom: 'Lapin blanc', prix: 20, espece: 'lapin' },
  'lapin-brun': { nom: 'Lapin brun', prix: 20, espece: 'lapin', couleurs: { '#f7f4ef': '#b9875a', '#ece6dc': '#9a6a40', '#d8cfc2': '#8a5a34', '#fff"': '#f7f4ef"' } },
  tortue: { nom: 'Tortue', prix: 25, espece: 'tortue' },
  chat: { nom: 'Chaton roux', prix: 30, espece: 'chat' },
  'chat-gris': { nom: 'Chaton gris', prix: 30, espece: 'chat', couleurs: { '#f2a654': '#9aa3ad' } },
  'chat-blanc': { nom: 'Chaton blanc', prix: 30, espece: 'chat', couleurs: { '#f2a654': '#f4f1ea' } },
  'chat-noir': { nom: 'Chaton noir', prix: 30, espece: 'chat', couleurs: { '#f2a654': '#3a3a44', '#2b2b3a': '#ffd84a' } },
  chien: { nom: 'Chiot', prix: 30, espece: 'chien' },
  'chien-gris': { nom: 'Chiot gris', prix: 30, espece: 'chien', couleurs: { '#c98b4f': '#7a7f8a', '#b8804a': '#686d78', '#b07440': '#686d78', '#7a4a28': '#4a4e58', '#e7c08e': '#b9bec8' } },
  dalmatien: { nom: 'Dalmatien', prix: 35, espece: 'chien', couleurs: { '#c98b4f': '#f7f7f2', '#b8804a': '#e8e8e0', '#b07440': '#e0e0d8', '#7a4a28': '#2b2b3a', '#e7c08e': '#ffffff' },
    taches: '<g fill="#2b2b3a"><circle cx="256" cy="476" r="4"/><circle cx="270" cy="488" r="3.5"/><circle cx="280" cy="474" r="3"/><circle cx="226" cy="446" r="3"/><circle cx="246" cy="492" r="3"/></g>' },
  perroquet: { nom: 'Perroquet', prix: 35, espece: 'perroquet' },
};
// Vêtements pour animaux : chaque animal en porte un (on le change dans la maison)
export const HABITS_ANIMAUX = {
  'collier-bleu': { nom: 'Collier bleu', prix: 6, forme: 'collier', couleur: '#4a90d9' },
  'noeud-rose': { nom: 'Nœud rose', prix: 6, forme: 'noeud', couleur: '#ff5d8f' },
  'collier-dore': { nom: 'Collier doré', prix: 8, forme: 'collier', couleur: '#f2c230' },
  'chapeau-fete': { nom: 'Chapeau de fête', prix: 8, forme: 'chapeau', couleur: '#8e6ad8' },
  'pull-rouge': { nom: 'Pull rouge', prix: 10, forme: 'pull', couleur: '#e05252' },
  'pull-bleu': { nom: 'Pull bleu', prix: 10, forme: 'pull', couleur: '#5b9ae0' },
};
// Accessoires pour animaux : placés dans la maison, à côté du premier animal qui s'en sert (pour)
export const ACCESSOIRES_ANIMAUX = {
  gamelle: { nom: 'Gamelle', prix: 5, pour: ['chien', 'chat', 'lapin', 'hamster', 'tortue'] },
  os: { nom: 'Os à mâchouiller', prix: 5, pour: ['chien'] },
  pelote: { nom: 'Pelote de laine', prix: 5, pour: ['chat'] },
  laisse: { nom: 'Laisse', prix: 6, pour: ['chien'] },
  coussin: { nom: 'Coussin', prix: 8, pour: ['chat', 'chien', 'lapin', 'hamster'] },
  roue: { nom: 'Roue', prix: 10, pour: ['hamster'] },
  perchoir: { nom: 'Perchoir', prix: 10, pour: ['perroquet'] },
  panier: { nom: 'Panier', prix: 12, pour: ['chien', 'chat'] },
  griffoir: { nom: 'Griffoir', prix: 12, pour: ['chat'] },
  aquarium: { nom: 'Aquarium', prix: 20, pour: ['poisson'] },
};

const articles = (type, liste, nom, prix = (k) => liste[k].prix ?? 0) =>
  Object.keys(liste).map((cle) => ({ id: `${type}:${cle}`, type, cle, nom: nom(cle), prix: prix(cle), piece: liste[cle].piece }));

export const CATALOGUE = [
  ...articles('piece', PIECES, (k) => PIECES[k].nom),
  ...articles('meuble', MEUBLES, (k) => MEUBLES[k].nom),
  ...articles('jouet', JOUETS, (k) => JOUETS[k].nom),
  ...articles('papier', PAPIERS, (k) => PAPIERS[k].nom),
  ...articles('lit', COULEURS_LIT, (k) => COULEURS_LIT[k].nom),
  ...articles('animal', ANIMAUX, (k) => ANIMAUX[k].nom),
  ...articles('habit-animal', HABITS_ANIMAUX, (k) => HABITS_ANIMAUX[k].nom),
  ...articles('acc-animal', ACCESSOIRES_ANIMAUX, (k) => ACCESSOIRES_ANIMAUX[k].nom),
  ...articles('ustensile', USTENSILES, (k) => USTENSILES[k].nom, () => null), // pas de prix : pas à vendre
  ...articles('tenue', TENUES, (k) => TENUES[k].nom),
  ...articles('accessoire', ACCESSOIRES, (k) => ACCESSOIRES[k].nom),
  ...articles('chaussures', CHAUSSURES, (k) => CHAUSSURES[k].nom),
  ...articles('chapeau', CHAPEAUX, (k) => CHAPEAUX[k].nom),
  ...articles('coiffure', COIFFURES, (k) => COIFFURES[k], (k) => PRIX_LOOK.coiffure[k] ?? 0),
  ...articles('cheveux', CHEVEUX, (k) => `Cheveux ${k.replace('chatain', 'châtain')}`, (k) => PRIX_LOOK.cheveux[k] ?? 0),
];

// Les magasins de l'île : chaque rayon liste des types d'objets. apercu : ce qu'on voit en haut du magasin.
export const MAGASINS = {
  coiffeur: { nom: 'Le coiffeur', apercu: 'avatar', rayons: [['✂️ Coiffures', ['coiffure']], ['🎨 Couleurs', ['cheveux']]] },
  mode: { nom: 'La boutique', apercu: 'avatar', rayons: [['👗 Vêtements', ['tenue']], ['👟 Chaussures', ['chaussures']], ['👒 Chapeaux', ['chapeau']], ['💍 Bijoux et accessoires', ['accessoire']]] },
  meubles: { nom: 'Le magasin de meubles', apercu: 'piece', rayons: [['🛋️ Meubles', ['meuble']], ['🛏️ Couleurs du lit', ['lit']], ['🧸 Jouets', ['jouet']], ['🖌️ Murs', ['papier']], ['🏠 Pièces', ['piece']]] },
  refuge: { nom: 'Le refuge', apercu: 'piece', rayons: [['🐾 Animaux', ['animal']], ['🧣 Vêtements pour animaux', ['habit-animal']], ['🦴 Accessoires pour animaux', ['acc-animal']]] },
};

export const article = (id) => CATALOGUE.find((a) => a.id === id);
export const possede = (profil, a) => a.prix === 0 || profil.objets.includes(a.id);
// Un meuble ou un jouet du salon ne s'achète qu'une fois le salon acheté.
export const pieceManquante = (profil, a) => (a.piece && !possede(profil, article(`piece:${a.piece}`)) ? PIECES[a.piece].nom : null);

const DANS_LA_PIECE = ['meuble', 'jouet', 'animal', 'ustensile', 'acc-animal'];

// Est-ce que l'objet est en place dans la maison, ou porté par l'avatar ?
export function estUtilise(profil, a) {
  const m = profil.maison;
  if (DANS_LA_PIECE.includes(a.type)) return m.places.includes(a.id);
  if (a.type === 'papier') return m.papiers[m.piece] === a.cle;
  if (a.type === 'piece') return m.piece === a.cle;
  if (a.type === 'lit') return (m.lit ?? 'rose') === a.cle;
  if (a.type === 'habit-animal') return Object.values(profil.habits ?? {}).includes(a.cle);
  if (a.type === 'accessoire') return (profil.avatar.accessoires ?? []).includes(a.cle);
  if (a.type === 'chaussures') return (profil.avatar.chaussures ?? 'baskets-rouges') === a.cle;
  if (a.type === 'chapeau') return profil.avatar.chapeau === a.cle;
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
  else if (a.type === 'lit') m.lit = a.cle;
  else if (a.type === 'habit-animal') return; // un vêtement d'animal se met dans la maison, sur un animal (habiller)
  else if (a.type === 'accessoire') avatar.accessoires = bascule(avatar.accessoires ?? [], a.cle);
  else if (a.type === 'chapeau') avatar.chapeau = avatar.chapeau === a.cle ? null : a.cle; // toucher encore : l'enlever
  else avatar[a.type] = a.cle;
}

// Donner un prénom à son animal (15 lettres au plus ; vide = pas de prénom)
export function nommer(profil, id, nom) {
  const n = String(nom ?? '').replace(/\s+/g, ' ').trim().slice(0, 15);
  profil.noms ??= {};
  if (n) profil.noms[id] = n; else delete profil.noms[id];
  return n;
}

// Habiller un animal : le vêtement suivant parmi ceux qu'on a (puis aucun). Renvoie la clé du vêtement, ou null.
export function changerHabit(profil, id) {
  const miens = Object.keys(HABITS_ANIMAUX).filter((k) => profil.objets.includes(`habit-animal:${k}`));
  const ordre = [null, ...miens], actuel = profil.habits?.[id] ?? null;
  const suivant = ordre[(ordre.indexOf(actuel) + 1) % ordre.length];
  profil.habits ??= {};
  if (suivant) profil.habits[id] = suivant; else delete profil.habits[id];
  return suivant;
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
  // les chaussures et le chapeau ne se changent pas dans cet écran : on les garde
  profil.avatar = { peau, yeux, coiffure, cheveux, tenue, accessoires: [...accessoires], chaussures: profil.avatar.chaussures, chapeau: profil.avatar.chapeau };
}

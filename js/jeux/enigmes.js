// La tour des énigmes (île des méninges) : des jeux de logique. Les premiers : trouve l'intrus, les suites logiques,
// et les potions du laboratoire (trier des liquides de couleur). La liste des jeux prévus est dans IDEES.md.
// 7 ans et moins : les questions faciles. Dès 8 ans : toutes les questions.
import { melanger, etoilesDuJeu } from '../partie.js';

const auHasard = (liste, aleatoire) => liste[Math.floor(aleatoire() * liste.length)];

// Trouve l'intrus. Chaque image a son mot, écrit dessous : l'enfant s'habitue à le lire.
// clé : [le mot, l'emoji qui remplace l'image tant qu'elle n'existe pas, l'image si elle est déjà dans un autre dossier]. Image : images/enigmes/<clé>.webp
export const OBJETS = {
  pomme: ['la pomme', '🍎'], banane: ['la banane', '🍌'], fraise: ['la fraise', '🍓'], raisin: ['le raisin', '🍇'], orange: ['l’orange', '🍊'], poire: ['la poire', '🍐'], cerises: ['les cerises', '🍒'], ananas: ['l’ananas', '🍍'],
  carotte: ['la carotte', '🥕'], brocoli: ['le brocoli', '🥦'], patate: ['la pomme de terre', '🥔'], oignon: ['l’oignon', '🧅'], mais: ['le maïs', '🌽'], concombre: ['le concombre', '🥒'], aubergine: ['l’aubergine', '🍆'], salade: ['la salade', '🥬'],
  chien: ['le chien', '🐶'], chat: ['le chat', '🐱'], lapin: ['le lapin', '🐰'], vache: ['la vache', '🐮'], cochon: ['le cochon', '🐷'], cheval: ['le cheval', '🐴'], lion: ['le lion', '🦁'], elephant: ['l’éléphant', '🐘'],
  voiture: ['la voiture', '🚗'], bus: ['le bus', '🚌'], velo: ['le vélo', '🚲'], tracteur: ['le tracteur', '🚜'], avion: ['l’avion', '✈️'], train: ['le train', '🚂'], voilier: ['le voilier', '⛵'], helicoptere: ['l’hélicoptère', '🚁'],
  scooter: ['le scooter', '🛵'], camion: ['le camion', '🚚'], fusee: ['la fusée', '🚀'], montgolfiere: ['la montgolfière', '🎈'],
  tshirt: ['le t-shirt', '👕'], pantalon: ['le pantalon', '👖'], robe: ['la robe', '👗'], chaussettes: ['les chaussettes', '🧦'], manteau: ['le manteau', '🧥'], gants: ['les gants', '🧤'], echarpe: ['l’écharpe', '🧣'], short: ['le short', '🩳'],
  basket: ['la basket', '👟'], chaussure: ['la chaussure de marche', '🥾'], botte: ['la botte', '👢'], tong: ['la tong', '🩴'], chapeau: ['le chapeau', '👒'],
  guitare: ['la guitare', '🎸'], piano: ['le piano', '🎹'], tambour: ['le tambour', '🥁'], trompette: ['la trompette', '🎺'], violon: ['le violon', '🎻'], flute: ['la flûte', '🪈'],
  foot: ['le ballon de foot', '⚽'], basketball: ['le ballon de basket', '🏀'], volley: ['le ballon de volley', '🏐'], tennis: ['la balle de tennis', '🎾'], rugby: ['le ballon de rugby', '🏉'],
  aigle: ['l’aigle', '🦅', 'nature/aigle'], papillon: ['le papillon', '🦋', 'nature/papillon'], abeille: ['l’abeille', '🐝', 'nature/abeille'], chauvesouris: ['la chauve-souris', '🦇', 'nature/chauve-souris'], colombe: ['la colombe', '🕊️'], hibou: ['le hibou', '🦉', 'nature/hibou'],
  manchot: ['le manchot', '🐧'], tortue: ['la tortue', '🐢'], poisson: ['le poisson', '🐟'], pieuvre: ['la pieuvre', '🐙'], dauphin: ['le dauphin', '🐬'], requin: ['le requin', '🦈'], baleine: ['la baleine', '🐳'], crabe: ['le crabe', '🦀'],
  renard: ['le renard', '🦊', 'nature/renard'], poule: ['la poule', '🐓'], canard: ['le canard', '🦆', 'nature/canard'], serpent: ['le serpent', '🐍'], crocodile: ['le crocodile', '🐊'], singe: ['le singe', '🐒'],
  soleil: ['le soleil', '☀️'], ampoule: ['l’ampoule', '💡'], bougie: ['la bougie', '🕯️'], lampe: ['la lampe de poche', '🔦'], etoile: ['l’étoile', '⭐'],
  boite: ['la boîte', '📦'], cuillere: ['la cuillère', '🥄'], livre: ['le livre', '📕'], brique: ['la brique', '🧱'], echelle: ['l’échelle', '🪜'],
  crayon: ['le crayon', '✏️'], stylo: ['le stylo', '🖊️'], feutre: ['le feutre', '🖍️'], pinceau: ['le pinceau', '🖌️'], ciseaux: ['les ciseaux', '✂️'], regle: ['la règle', '📏'], trombone: ['le trombone', '📎'],
  glacon: ['le glaçon', '🧊'], bonhomme: ['le bonhomme de neige', '⛄'], glace: ['la glace', '🍦'], flocon: ['le flocon', '❄️'], feu: ['le feu', '🔥'], chocolat: ['le chocolat chaud', '☕'], soupe: ['la soupe', '🍲'],
  piece: ['la pièce', '🪙'], horloge: ['l’horloge', '⏰'], biscuit: ['le biscuit', '🍪'],
};
// Faciles : trois images d'une famille, et une image d'une tout autre famille.
export const FAMILLES = [
  ['des fruits', ['pomme', 'banane', 'fraise', 'raisin', 'orange', 'poire', 'cerises', 'ananas']],
  ['des légumes', ['carotte', 'brocoli', 'patate', 'oignon', 'mais', 'concombre', 'aubergine', 'salade']],
  ['des animaux', ['chien', 'chat', 'lapin', 'vache', 'cochon', 'cheval', 'lion', 'elephant']],
  ['des véhicules', ['voiture', 'bus', 'velo', 'tracteur', 'avion', 'train', 'voilier', 'helicoptere']],
  ['des vêtements', ['tshirt', 'pantalon', 'robe', 'chaussettes', 'manteau', 'gants', 'echarpe', 'short']],
  ['des instruments de musique', ['guitare', 'piano', 'tambour', 'trompette', 'violon', 'flute']],
  ['des jeux de ballon', ['foot', 'basketball', 'volley', 'tennis', 'rugby']],
];
// Difficiles : il faut trouver ce que trois images ont en commun. [ce qu'elles ont en commun, les images, les intrus possibles]
export const POINTS_COMMUNS = [
  ['des animaux qui volent', ['aigle', 'papillon', 'abeille', 'chauvesouris', 'colombe', 'hibou'], ['manchot', 'elephant', 'tortue', 'poisson']],
  ['des animaux qui vivent dans l’eau', ['poisson', 'pieuvre', 'dauphin', 'requin', 'baleine', 'crabe'], ['chat', 'cheval', 'renard', 'poule']],
  ['des animaux à quatre pattes', ['chien', 'chat', 'cheval', 'vache', 'elephant', 'lion'], ['poule', 'canard', 'serpent', 'poisson']],
  ['des véhicules qui roulent', ['voiture', 'bus', 'velo', 'tracteur', 'scooter', 'camion'], ['voilier', 'avion', 'helicoptere', 'fusee']],
  ['des véhicules qui vont dans le ciel', ['avion', 'helicoptere', 'fusee', 'montgolfiere'], ['voiture', 'voilier', 'velo', 'train']],
  ['des fruits', ['pomme', 'banane', 'fraise', 'raisin', 'orange', 'poire'], ['carotte', 'brocoli', 'patate', 'oignon']],
  ['des choses qui donnent de la lumière', ['soleil', 'ampoule', 'bougie', 'lampe', 'etoile'], ['boite', 'chaussettes', 'cuillere', 'livre']],
  ['des objets pour écrire ou dessiner', ['crayon', 'stylo', 'feutre', 'pinceau'], ['ciseaux', 'regle', 'trombone', 'cuillere']],
  ['des choses très froides', ['glacon', 'bonhomme', 'glace', 'flocon'], ['soleil', 'feu', 'chocolat', 'soupe']],
  ['des choses qu’on porte aux pieds', ['basket', 'chaussure', 'chaussettes', 'botte', 'tong'], ['gants', 'echarpe', 'chapeau', 'tshirt']],
  ['des animaux qui pondent des œufs', ['poule', 'canard', 'tortue', 'serpent', 'crocodile', 'manchot'], ['vache', 'chien', 'cheval', 'singe']],
  ['des choses rondes', ['foot', 'orange', 'piece', 'horloge', 'biscuit'], ['boite', 'livre', 'brique', 'echelle']],
];
export const intrus = {
  etoilesParBonneReponse: (age) => etoilesDuJeu('intrus', age),
  question({ age }, aleatoire = Math.random) {
    let commun, images, reponse;
    if (age <= 7 || aleatoire() < 0.3) {
      const [a, b] = melanger(FAMILLES, aleatoire);
      [commun, images, reponse] = [a[0], a[1], auHasard(b[1], aleatoire)];
    } else {
      const p = auHasard(POINTS_COMMUNS, aleatoire);
      [commun, images, reponse] = [p[0], p[1], auHasard(p[2], aleatoire)];
    }
    const choix = melanger([reponse, ...melanger(images, aleatoire).slice(0, 3)], aleatoire);
    return { mode: 'choix', texte: [...choix].sort().join(' '), titre: 'Trouve l’intrus !', consigne: 'Trouve l’intrus : l’image qui ne va pas avec les autres.',
      image: '', reponse, choix, solution: `Les trois autres sont ${commun}.` };
  },
};

// Les suites logiques : trouver ce qui vient après. Faciles : un motif d'images qui se répète, ou compter de 1 en 1 ou de 2 en 2.
const FORMES = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⭐', '❤️', '🔺', '🟦'];
const MOTIFS_FACILES = ['AB', 'ABC', 'AAB', 'ABB'], MOTIFS_DIFFICILES = ['AABB', 'ABAC', 'ABCB', 'AABC', 'ABBC'];
function suiteDeFormes(motifs, aleatoire) {
  const motif = auHasard(motifs, aleatoire), formes = melanger(FORMES, aleatoire);
  const forme = (i) => formes[motif.charCodeAt(i % motif.length) - 65];
  const longueur = motif.length * 2 + 1 + Math.floor(aleatoire() * (motif.length - 1)); // deux tours du motif, et un bout du troisième
  const vues = Array.from({ length: longueur }, (_, i) => forme(i)), reponse = forme(longueur);
  const autres = melanger(formes.filter((f) => f !== reponse), aleatoire);
  const pieges = [...new Set([...vues.filter((f) => f !== reponse), ...autres])].slice(0, 3); // d'abord les formes de la suite, les plus tentantes
  return { vues, reponse, choix: melanger([reponse, ...pieges], aleatoire), solution: 'Le même motif se répète.' };
}
// [nom de la règle, le n-ième nombre de la suite]. depart : le premier nombre.
const REGLES_FACILES = [
  ['On compte de 1 en 1.', (d, n) => d + n, 12],
  ['On compte de 2 en 2.', (d, n) => d + 2 * n, 10],
  ['On compte de 10 en 10.', (d, n) => (d + n) * 10, 4],
  ['On compte à l’envers, de 1 en 1.', (d, n) => d + 9 - n, 8],
];
const REGLES_DIFFICILES = [
  ['On ajoute 3 à chaque fois.', (d, n) => d + 3 * n, 12],
  ['On ajoute 5 à chaque fois.', (d, n) => d + 5 * n, 20],
  ['On enlève 2 à chaque fois.', (d, n) => d + 30 - 2 * n, 10],
  ['On enlève 5 à chaque fois.', (d, n) => (d + 10 - n) * 5, 6],
  ['On double à chaque fois.', (d, n) => (d + 1) * 2 ** n, 3],
  ['On ajoute 1, puis 2, puis 3, et ainsi de suite.', (d, n) => d + (n * (n + 1)) / 2, 9],
  ['On ajoute 2, puis 1, puis 2, puis 1.', (d, n) => d + Math.ceil(n / 2) * 2 + Math.floor(n / 2), 12],
];
function suiteDeNombres(regles, aleatoire) {
  const [solution, terme, departMax] = auHasard(regles, aleatoire), depart = 1 + Math.floor(aleatoire() * departMax);
  const vues = Array.from({ length: 5 }, (_, n) => terme(depart, n)), reponse = terme(depart, 5), ecart = Math.abs(reponse - vues[4]) || 1;
  const pieges = [...new Set([reponse + 1, reponse - 1, reponse + ecart, vues[4] + 1, reponse + 2, reponse + 10, reponse - 2])].filter((x) => x !== reponse && x >= 0 && !vues.includes(x)).slice(0, 3);
  return { vues, reponse, choix: melanger([reponse, ...pieges], aleatoire), solution };
}
export const suites = {
  etoilesParBonneReponse: (age) => etoilesDuJeu('suites', age),
  question({ age }, aleatoire = Math.random) {
    const petits = age <= 7, formes = aleatoire() < 0.5;
    const s = formes ? suiteDeFormes(petits ? MOTIFS_FACILES : MOTIFS_DIFFICILES, aleatoire) : suiteDeNombres(petits ? REGLES_FACILES : REGLES_DIFFICILES, aleatoire);
    return { mode: 'choix', texte: s.vues.join(' '), titre: 'Qu’est-ce qui vient après ?', consigne: 'Regarde bien la suite. Qu’est-ce qui vient après ?',
      image: `${s.vues.join(' ')} ❓`, reponse: s.reponse, choix: s.choix, solution: s.solution };
  },
};

// Les potions du laboratoire : chaque fiole contient des couches de couleur. On verse le dessus d'une fiole dans une autre,
// seulement sur la même couleur ou dans une fiole vide, jusqu'à avoir une seule couleur par fiole.
// Un état : une liste de fioles ; une fiole : ses couches, du fond vers le haut (un numéro de couleur).
export const ETOILES_POTION = 2; // la première fois qu'on réussit un niveau
// [nombre de couleurs, hauteur des fioles] pour chaque niveau. Il y a toujours deux fioles vides en plus.
export const NIVEAUX_POTIONS = {
  petits: [[2, 3], [3, 3], [3, 3], [3, 4], [4, 3], [4, 3], [4, 4], [4, 4], [5, 3], [5, 3], [5, 4], [5, 4]],
  grands: [[3, 4], [4, 4], [4, 4], [5, 4], [5, 4], [6, 4], [6, 4], [7, 4], [7, 4], [8, 4], [8, 4], [9, 4]],
};
export const niveauxPotions = (age) => NIVEAUX_POTIONS[age <= 7 ? 'petits' : 'grands'];

const sommet = (f) => f[f.length - 1];
// Combien de couches du dessus de la fiole « de » ont la même couleur
const bloc = (f) => { let n = 0; while (n < f.length && f[f.length - 1 - n] === sommet(f)) n++; return n; };
// Verser le dessus de la fiole « de » dans la fiole « vers ». Renvoie le nouvel état, ou null si ce n'est pas permis.
export function verser(etat, de, vers, hauteur) {
  const a = etat[de], b = etat[vers];
  if (de === vers || !a?.length || !b || b.length >= hauteur || (b.length && sommet(b) !== sommet(a))) return null;
  const n = Math.min(bloc(a), hauteur - b.length);
  return etat.map((f, i) => (i === de ? f.slice(0, f.length - n) : i === vers ? [...f, ...a.slice(a.length - n)] : f));
}
export const potionsTriees = (etat, hauteur) => etat.every((f) => !f.length || (f.length === hauteur && bloc(f) === hauteur));

// Peut-on réussir depuis cet état ? (exploration avec mémoire ; au-delà de la limite, on répond non pour changer de mélange)
export function resoluble(depart, hauteur, limite = 60000) {
  const cle = (e) => e.map((f) => f.join(',')).sort().join('|'), vus = new Set([cle(depart)]), pile = [depart];
  while (pile.length && vus.size < limite) {
    const e = pile.pop();
    if (potionsTriees(e, hauteur)) return true;
    for (let i = 0; i < e.length; i++) {
      if (!e[i].length || (e[i].length === hauteur && bloc(e[i]) === hauteur)) continue; // une fiole finie ne se revide pas
      let videEssayee = false;
      for (let j = 0; j < e.length; j++) {
        if (!e[j].length) { if (videEssayee || bloc(e[i]) === e[i].length) continue; videEssayee = true; } // une seule fiole vide suffit ; déplacer une fiole d'une seule couleur ne sert à rien
        const s = verser(e, i, j, hauteur);
        if (!s) continue;
        const k = cle(s);
        if (!vus.has(k)) { vus.add(k); pile.push(s); }
      }
    }
  }
  return false;
}
// Un petit générateur de nombres au hasard, toujours le même pour une même graine : un niveau est le même pour tout le monde
function hasardDe(graine) {
  let x = graine % 2147483647 || 1;
  return () => ((x = (x * 48271) % 2147483647) - 1) / 2147483646;
}
// Le mélange de départ du niveau n (à partir de 0) : toujours résoluble, et jamais déjà trié
export function potionsDuNiveau(n, age) {
  const [couleurs, hauteur] = niveauxPotions(age)[n];
  for (let essai = 0; essai < 200; essai++) {
    const aleatoire = hasardDe((n + 1) * 7919 + (age <= 7 ? 0 : 500000) + essai * 104729);
    const couches = melanger(Array.from({ length: couleurs * hauteur }, (_, i) => i % couleurs), aleatoire);
    const etat = [...Array.from({ length: couleurs }, (_, i) => couches.slice(i * hauteur, (i + 1) * hauteur)), [], []];
    if (!etat.some((f) => bloc(f) === hauteur) && resoluble(etat, hauteur)) return { etat, hauteur, couleurs };
  }
  throw new Error(`Pas de mélange trouvé pour le niveau ${n + 1}.`);
}
// Combien de niveaux sont ouverts : ceux déjà réussis, et le suivant
export const potionsReussies = (profil) => profil.potions?.[profil.age <= 7 ? 'petits' : 'grands'] ?? 0;
// Le niveau n est réussi : des étoiles la première fois, et le niveau suivant s'ouvre. Renvoie les étoiles gagnées.
export function terminerPotion(profil, n) {
  const serie = profil.age <= 7 ? 'petits' : 'grands', faits = potionsReussies(profil);
  if (n > faits || n >= niveauxPotions(profil.age).length) throw new Error('Ce niveau n’est pas encore ouvert.');
  if (n < faits) return 0;
  profil.potions = { ...profil.potions, [serie]: faits + 1 };
  profil.etoiles += ETOILES_POTION;
  return ETOILES_POTION;
}

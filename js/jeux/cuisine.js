// Le restaurant : suivre une recette en jeu (les ingrédients dans l'ordre, les peser sur la balance), voir son plat réussi,
// puis la faire pour de vrai avec un parent (validée avec le code parent : étoiles en plus et un objet pour la cuisine de la maison).
import { melanger, etoilesDuJeu } from '../partie.js';
import { BONUS_RECETTE_REELLE } from '../reglages.js';
import { recevoir } from '../catalogue.js';

export const niveau = (age) => (age <= 7 ? 1 : 2);
export const etoilesParBonneReponse = (age) => etoilesDuJeu('cuisine', age);

// jeu : les ingrédients dans l'ordre de la recette [clé, nom, image, grammes à peser (ou rien)]
// vraie : la recette à faire avec un parent. objet : ce qu'on gagne pour la cuisine de la maison.
export const RECETTES = {
  crepes: {
    nom: 'Crêpes', plat: '🥞', objet: 'poele',
    jeu: [['farine', 'la farine', '🌾', 250], ['sucre', 'le sucre', '🍬'], ['oeufs', 'les œufs', '🥚'], ['lait', 'le lait', '🥛'], ['beurre', 'le beurre fondu', '🧈', 50]],
    vraie: {
      pour: 'environ 15 crêpes',
      ingredients: ['250 g de farine', '1 cuillère à soupe de sucre', '1 pincée de sel', '4 œufs', '50 cl de lait', '50 g de beurre fondu'],
      etapes: [
        'Verse la farine, le sucre et le sel dans un saladier, et creuse un puits au milieu.',
        'Casse les œufs dans le puits et mélange avec un fouet.',
        'Ajoute le lait petit à petit, en mélangeant bien pour éviter les grumeaux.',
        "Ajoute le beurre fondu (l'adulte le fait fondre).",
        'Laisse reposer la pâte une heure, si tu peux.',
        "L'adulte fait cuire les crêpes dans une poêle chaude légèrement beurrée. À toi de les garnir !",
      ],
    },
    savaisTu: 'Le 2 février, à la Chandeleur, on fait sauter les crêpes. On dit que si on les retourne en tenant une pièce dans l’autre main, on aura de la chance toute l’année !',
  },
  cookies: {
    nom: 'Cookies', plat: '🍪', objet: 'four',
    jeu: [['beurre', 'le beurre mou', '🧈', 100], ['sucre', 'le sucre roux', '🍬', 100], ['oeufs', "l'œuf", '🥚'], ['farine', 'la farine', '🌾', 200], ['chocolat', 'les pépites de chocolat', '🍫', 100]],
    vraie: {
      pour: 'environ 15 cookies',
      ingredients: ['100 g de beurre mou', '100 g de sucre roux', '1 œuf', '200 g de farine', '1/2 sachet de levure chimique', '1 pincée de sel', '100 g de pépites de chocolat'],
      etapes: [
        "L'adulte allume le four à 180 °C.",
        "Mélange le beurre mou et le sucre jusqu'à avoir une crème.",
        "Ajoute l'œuf et mélange.",
        'Ajoute la farine, la levure et le sel, et mélange.',
        'Ajoute les pépites de chocolat.',
        'Fais des petites boules et pose-les bien espacées sur une plaque avec du papier cuisson.',
        "L'adulte les fait cuire 10 à 12 minutes : les cookies doivent rester un peu mous au milieu.",
      ],
    },
    savaisTu: 'Les cookies aux pépites de chocolat ont été inventés vers 1938 aux États-Unis, par Ruth Wakefield, qui tenait une auberge.',
  },
  salade: {
    nom: 'Salade de fruits', plat: '🥗', objet: 'corbeille',
    jeu: [['pommes', 'les pommes', '🍎'], ['bananes', 'les bananes', '🍌'], ['orange', "l'orange", '🍊'], ['fraises', 'les fraises', '🍓', 250], ['citron', 'le jus de citron', '🍋']],
    vraie: {
      pour: '4 personnes',
      ingredients: ['2 pommes', '2 bananes', '1 orange', '250 g de fraises', "le jus d'un demi-citron", '1 cuillère à soupe de sucre (si tu veux)'],
      etapes: [
        'Lave les pommes et les fraises.',
        "Épluche les bananes et l'orange.",
        'Avec un adulte, coupe tous les fruits en petits morceaux.',
        'Mets-les dans un saladier et arrose-les de jus de citron : comme ça, ils ne noircissent pas.',
        'Ajoute le sucre si tu veux, mélange doucement et mets au frais.',
      ],
    },
    savaisTu: "Pour les savants, la banane est une baie… mais pas la fraise ! Les petits grains sur la fraise sont ses vrais fruits.",
  },
  yaourt: {
    nom: 'Gâteau au yaourt', plat: '🍰', objet: 'moule',
    jeu: [['yaourt', 'le yaourt', '🥣'], ['sucre', 'le sucre', '🍬'], ['oeufs', 'les œufs', '🥚'], ['farine', 'la farine', '🌾'], ['levure', 'la levure', '🧂'], ['huile', "l'huile", '🫒']],
    vraie: {
      pour: '6 personnes',
      ingredients: ['1 pot de yaourt nature', '2 pots de sucre', '3 œufs', '3 pots de farine', '1 sachet de levure chimique', "1/2 pot d'huile"],
      etapes: [
        "L'adulte allume le four à 180 °C et beurre un moule.",
        'Verse le yaourt dans un saladier. Garde le pot : il sert de mesure !',
        'Ajoute le sucre et les œufs, et mélange.',
        'Ajoute la farine et la levure, et mélange.',
        "Ajoute l'huile et mélange bien.",
        "Verse la pâte dans le moule. L'adulte fait cuire environ 30 à 35 minutes.",
      ],
    },
    savaisTu: "C'est souvent le premier gâteau qu'on apprend à faire : pas besoin de balance, le pot de yaourt sert de mesure !",
  },
  'pain-perdu': {
    nom: 'Pain perdu', plat: '🍞', objet: 'tablier',
    jeu: [['oeufs', 'les œufs', '🥚'], ['lait', 'le lait', '🥛'], ['sucre', 'le sucre', '🍬', 30], ['pain', 'le pain', '🍞'], ['beurre', 'le beurre', '🧈', 20]],
    vraie: {
      pour: '4 personnes',
      ingredients: ['4 tranches de pain sec (ou de brioche)', '2 œufs', '25 cl de lait', '30 g de sucre', '1 sachet de sucre vanillé', '20 g de beurre'],
      etapes: [
        'Dans une assiette creuse, bats les œufs avec le lait, le sucre et le sucre vanillé.',
        'Trempe chaque tranche de pain des deux côtés.',
        "L'adulte fait fondre le beurre dans une poêle.",
        "Fais dorer les tranches 2 minutes de chaque côté (l'adulte s'occupe de la poêle).",
        "Saupoudre d'un peu de sucre ou de cannelle, et déguste tiède !",
      ],
    },
    savaisTu: "Le pain perdu a été inventé pour ne pas jeter le pain sec : on l'appelle « perdu » parce qu'il était trop dur pour être mangé tel quel.",
  },
};

// Après la partie, la recette est débloquée : on peut la faire pour de vrai avec un parent.
export function debloquer(profil, cle) {
  profil.recettes[cle] ??= 'debloquee';
}

// Le parent a validé avec son code : étoiles en plus et l'objet de cuisine pour la maison (une seule fois par recette).
export function validerRecette(profil, cle) {
  if (profil.recettes[cle] !== 'debloquee') throw new Error(profil.recettes[cle] === 'faite' ? 'Cette recette est déjà validée.' : "Joue d'abord la recette au restaurant.");
  profil.recettes[cle] = 'faite';
  profil.etoiles += BONUS_RECETTE_REELLE;
  recevoir(profil, `ustensile:${RECETTES[cle].objet}`);
}

// 7 ans et moins : on pèse seulement les quantités rondes (par 50 g), avec des boutons de 50 et 100 g.
const aPeser = (grammes, niv) => grammes && (niv === 2 || grammes % 50 === 0);
export const boutonsBalance = (niv) => (niv === 1 ? [-50, 50, 100] : [-10, 10, 50, 100]);

// La partie : une question par ingrédient (« lequel vient maintenant ? »), puis sa pesée s'il y en a une.
export function etapes(cle, age, aleatoire = Math.random) {
  const niv = niveau(age), r = RECETTES[cle], questions = [];
  r.jeu.forEach(([id, nom, image, grammes], i) => {
    // on voit l'ingrédient et on entend son nom ; il faut lire le bon mot parmi des mots (pas lus à voix haute)
    questions.push({
      mode: 'ingredient', texte: `${cle}-${id}`, recette: cle, etape: i, reponse: nom, image, choix: motsAuChoix(nom, niv, aleatoire),
      titre: `Étape ${i + 1} : trouve le bon mot !`,
      consigne: `Ajoute ${nom}. Trouve le mot ${nom.replace(/^(la |le |les |l')/, '')} !`,
      solution: `C'était écrit : ${nom}.`,
    });
    if (aPeser(grammes, niv)) {
      questions.push({
        mode: 'peser', texte: `${cle}-${id}-pesee`, recette: cle, etape: i, reponse: grammes, image, boutons: boutonsBalance(niv),
        titre: `Pèse ${grammes} g de ${nom.replace(/^(la |le |les |l')/, '')}`,
        consigne: `Pèse ${grammes} grammes de ${nom.replace(/^(la |le |les |l')/, '')}, puis touche : c'est pesé !`,
        solution: `Il fallait ${grammes} grammes.`,
      });
    }
  });
  return questions;
}

// Des noms d'aliments pour les choix à lire
const MOTS = ['le sel', 'le riz', 'le thé', 'le miel', 'le pain', 'le jus', 'la noix', 'le kiwi', 'la pomme', 'la poire', 'le lait', 'le sucre',
  'le beurre', 'la farine', 'la fraise', 'la framboise', 'la frite', 'le fromage', 'la crème', 'la crêpe', 'le sirop', 'le citron', 'la cerise',
  'la banane', 'la vanille', 'la cannelle', 'la confiture', 'le chocolat', 'la compote', 'les céréales', 'la levure', 'les œufs', 'l’orange',
  'les olives', 'la salade', 'le yaourt', 'la tomate', 'la carotte', 'le melon', 'le persil'];
const sansArticle = (m) => m.replace(/^(la |le |les |l'|l’)/, '');
// Le nombre de lettres à changer pour passer d'un mot à l'autre (distance d'édition)
export function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// 7 ans et moins : 2 mots courts et bien différents (autre première lettre). Grands : 3 mots proches, parmi les plus ressemblants.
export function motsAuChoix(nom, niv, aleatoire = Math.random) {
  const mot = sansArticle(nom);
  // jamais un mot contenu dans l'autre (« le beurre » pour « le beurre fondu ») : il y aurait deux réponses presque justes
  const autres = [...new Set([...MOTS, ...Object.values(INGREDIENTS).map(([n]) => n)])].filter((m) => !sansArticle(m).includes(mot) && !mot.includes(sansArticle(m)));
  let pieges;
  if (niv === 1) {
    const courts = autres.filter((m) => sansArticle(m).length <= 5 && sansArticle(m)[0] !== mot[0] && distance(sansArticle(m), mot) >= 3);
    pieges = melanger(courts, aleatoire).slice(0, 2);
  } else {
    const proches = [...autres].sort((a, b) => distance(sansArticle(a), mot) - distance(sansArticle(b), mot) || aleatoire() - 0.5);
    pieges = melanger(proches.slice(0, 4), aleatoire).slice(0, 3);
  }
  return melanger([nom, ...pieges], aleatoire);
}

// Tous les ingrédients, par clé : [nom, image]
export const INGREDIENTS = Object.fromEntries(Object.values(RECETTES).flatMap((r) => r.jeu.map(([id, nom, image]) => [id, [nom, image]])));

// La carte de la recette pendant le jeu : les ingrédients dans l'ordre, cochés au fur et à mesure (fait = combien sont dans le saladier)
export function carte(cle, fait) {
  return `<ol class="carte-recette">${RECETTES[cle].jeu.map(([, nom, image], i) =>
    `<li class="${i < fait ? 'fait' : ''}"><span aria-hidden="true">${image}</span> ${nom}${i < fait ? ' ✓' : ''}</li>`).join('')}</ol>`;
}

// La balance : un cadran (0 à 500 g) et l'affichage en chiffres
export function dessinerBalance(grammes, image) {
  const angle = (Math.min(grammes, 500) / 500) * 300 - 150;
  const graduations = Array.from({ length: 11 }, (_, i) => {
    const a = ((i * 30 - 150) * Math.PI) / 180, [s, c] = [Math.sin(a), Math.cos(a)];
    return `<line x1="${150 + 70 * s}" y1="${150 - 70 * c}" x2="${150 + 80 * s}" y2="${150 - 80 * c}" stroke="#2b2b3a" stroke-width="3"/>
      <text x="${150 + 56 * s}" y="${155 - 56 * c}" font-size="12" text-anchor="middle" fill="#2b2b3a">${i * 50}</text>`;
  }).join('');
  return `<svg class="balance" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La balance indique ${grammes} grammes">
    <ellipse cx="150" cy="42" rx="110" ry="16" fill="#c9ced6"/><path d="M60 40 Q150 80 240 40" fill="#e8ebef"/>
    <text x="150" y="50" font-size="${grammes ? 34 : 0}" text-anchor="middle">${grammes ? image : ''}</text>
    <rect x="50" y="62" width="200" height="220" rx="40" fill="#f26b6b"/>
    <circle cx="150" cy="150" r="88" fill="#fffdf5" stroke="#c94a4a" stroke-width="6"/>${graduations}
    <line x1="150" y1="150" x2="150" y2="78" stroke="#d93030" stroke-width="5" stroke-linecap="round" transform="rotate(${angle} 150 150)"/>
    <circle cx="150" cy="150" r="7" fill="#2b2b3a"/>
    <rect x="100" y="246" width="100" height="28" rx="6" fill="#2b2b3a"/>
    <text x="150" y="267" font-size="20" font-weight="700" text-anchor="middle" fill="#7dff9a" font-family="monospace">${grammes} g</text>
  </svg>`;
}

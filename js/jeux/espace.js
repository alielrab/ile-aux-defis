// L'observatoire : voyage en fusée de planète en planète, tailles comparées, poids sur chaque planète, et un quiz.
// Chiffres : valeurs moyennes arrondies (NASA). gravite : combien on pèse là-bas par rapport à la Terre.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('espace', age);

export const ASTRES = [
  { cle: 'soleil', nom: 'Le Soleil', couleur: '#ffcf3f', diametre: 1392700, faits: [
    "Ce n'est pas une planète : c'est une étoile, une énorme boule de gaz brûlant.",
    "Plus d'un million de Terres pourraient tenir dedans !",
    'Sa lumière met environ 8 minutes pour arriver jusqu’à nous.',
  ], pasDePoids: 'Impossible de s’y poser : il fait plus de 5 000 °C à sa surface !' },
  { cle: 'mercure', nom: 'Mercure', couleur: '#a9a29a', diametre: 4879, gravite: 0.38, faits: [
    'La planète la plus proche du Soleil, et la plus petite.',
    'Une année y dure seulement 88 jours.',
    'Le jour, il y fait plus de 400 °C ; la nuit, environ −180 °C !',
  ] },
  { cle: 'venus', nom: 'Vénus', couleur: '#e8c47a', diametre: 12104, gravite: 0.91, faits: [
    'La planète la plus chaude : environ 460 °C, à cause de ses nuages épais.',
    "Elle tourne à l'envers : le Soleil s'y lève à l'ouest !",
    "Après la Lune, c'est le point le plus brillant du ciel de la nuit : on l'appelle l'étoile du Berger.",
  ] },
  { cle: 'terre', nom: 'La Terre', couleur: '#3f86d8', diametre: 12742, gravite: 1, faits: [
    'Notre planète ! La seule où l’on connaît la vie.',
    "Environ 70 % de sa surface est couverte d'eau : c'est la planète bleue.",
    'Elle fait le tour du Soleil en un an, et tourne sur elle-même en un jour.',
  ] },
  { cle: 'lune', nom: 'La Lune', couleur: '#cfcfcf', diametre: 3474, gravite: 0.17, faits: [
    "Ce n'est pas une planète : c'est le satellite de la Terre, elle tourne autour de nous.",
    '12 astronautes y ont marché, entre 1969 et 1972.',
    "Il n'y a pas de vent : leurs traces de pas y sont encore !",
  ] },
  { cle: 'mars', nom: 'Mars', couleur: '#d0603a', diametre: 6779, gravite: 0.38, faits: [
    'La planète rouge : son sol est plein de rouille.',
    'Elle a le plus grand volcan connu, Olympus Mons, deux fois et demie plus haut que l’Everest.',
    'Des robots explorent son sol, comme le rover Perseverance.',
  ] },
  { cle: 'jupiter', nom: 'Jupiter', couleur: '#d9a066', diametre: 139820, gravite: 2.53, faits: [
    'La plus grosse planète : plus de 1 000 Terres tiendraient dedans.',
    'Sa Grande Tache rouge est une tempête plus grande que la Terre.',
    "Elle n'a pas de sol : c'est une géante faite de gaz.",
  ] },
  { cle: 'saturne', nom: 'Saturne', couleur: '#e6cf8f', diametre: 116460, gravite: 1.07, faits: [
    'Ses anneaux sont faits de morceaux de glace et de roche.',
    'Pour sa taille, elle est si légère qu’elle flotterait dans une baignoire géante !',
    "C'est la planète qui a le plus de lunes connues.",
  ] },
  { cle: 'uranus', nom: 'Uranus', couleur: '#9fdde0', diametre: 50724, gravite: 0.89, faits: [
    'Elle tourne couchée sur le côté, comme une boule qui roule.',
    "Sa couleur bleu-vert vient d'un gaz : le méthane.",
    "Son air est le plus froid du système solaire : environ −224 °C.",
  ] },
  { cle: 'neptune', nom: 'Neptune', couleur: '#3d5fd0', diametre: 49244, gravite: 1.14, faits: [
    'La planète la plus loin du Soleil.',
    'Ses vents soufflent à plus de 2 000 km/h, plus vite qu’un avion !',
    'Une année sur Neptune dure 165 de nos années.',
  ] },
];

// Poids qu'on aurait sur cet astre (kg « comme sur Terre »), arrondi
export const poidsSur = (astre, poids) => Math.round(poids * astre.gravite);

// Un astre dessiné (rond avec relief ; anneaux pour Saturne ; bandes pour Jupiter)
export function dessinerAstre(a, x, y, r) {
  const bandes = a.cle === 'jupiter'
    ? [-0.45, -0.15, 0.2, 0.5].map((k) => `<rect x="${x - r}" y="${y + k * r}" width="${2 * r}" height="${r * 0.12}" fill="#b5764a" opacity=".55" clip-path="url(#clip-${a.cle}-${Math.round(x)})"/>`).join('')
      + `<ellipse cx="${x + r * 0.35}" cy="${y + r * 0.3}" rx="${r * 0.18}" ry="${r * 0.1}" fill="#c0503a"/>`
    : a.cle === 'terre' ? `<path d="M${x - r * 0.5} ${y - r * 0.3} q${r * 0.3} ${-r * 0.3} ${r * 0.5} 0 q${r * 0.1} ${r * 0.4} ${-r * 0.3} ${r * 0.6}z M${x + r * 0.2} ${y + r * 0.1} q${r * 0.4} ${-r * 0.1} ${r * 0.5} ${r * 0.3} q${-r * 0.2} ${r * 0.4} ${-r * 0.5} ${r * 0.2}z" fill="#5cb85c"/>`
      : a.cle === 'lune' || a.cle === 'mercure' ? `<circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#000" opacity=".12"/><circle cx="${x + r * 0.35}" cy="${y + r * 0.3}" r="${r * 0.12}" fill="#000" opacity=".12"/>`
        : '';
  const anneau = (devant) => (a.cle === 'saturne'
    ? `<path d="M${x - r * 1.9} ${y} A${r * 1.9} ${r * 0.5} 0 0 ${devant ? 0 : 1} ${x + r * 1.9} ${y}" fill="none" stroke="#c9b27a" stroke-width="${r * 0.22}" opacity=".9"/>` : '');
  return `${anneau(false)}<clipPath id="clip-${a.cle}-${Math.round(x)}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${a.couleur}"/>${bandes}
    <circle cx="${x}" cy="${y}" r="${r}" fill="url(#ombre-astre)"/>${anneau(true)}`;
}
const DEFS = `<defs><radialGradient id="ombre-astre" cx=".35" cy=".35" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>`;
const ETOILES_FOND = Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 197) % 1000}" cy="${(i * 89) % 200}" r="${i % 3 ? 1.2 : 2}" fill="#fff" opacity=".7"/>`).join('');

// Le voyage : tous les astres en ligne, la fusée au-dessus de celui qu'on visite (indice i)
export function dessinerVoyage(i) {
  const pas = 1000 / ASTRES.length;
  const astres = ASTRES.map((a, k) => `<g class="astre" data-astre="${k}" role="button" tabindex="0" aria-label="${a.nom}">
    ${dessinerAstre(a, pas * (k + 0.5), 125, a.cle === 'soleil' ? 34 : a.cle === 'lune' ? 12 : 22)}</g>`).join('');
  const fx = pas * (i + 0.5);
  return `<svg viewBox="0 0 1000 200" class="voyage" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Le système solaire">${DEFS}
    <rect width="1000" height="200" rx="16" fill="#141a3a"/>${ETOILES_FOND}${astres}
    <g class="fusee" style="transform: translate(${fx}px, 62px)">
      <path d="M0 -26 Q12 -12 10 12 L-10 12 Q-12 -12 0 -26Z" fill="#f2f2f2"/><circle cy="-6" r="5" fill="#6ac0d0" stroke="#3a4a6a" stroke-width="1.5"/>
      <path d="M-10 4 L-18 16 L-10 14Z M10 4 L18 16 L10 14Z" fill="#e05252"/><path d="M-6 12 Q0 30 6 12Z" fill="#ffb03a"/></g></svg>`;
}

// Les tailles comparées (à l'échelle) : le Soleil est si gros qu'on n'en voit qu'un bout
export function dessinerTailles() {
  const k = 150 / ASTRES.find((a) => a.cle === 'jupiter').diametre; // rayon de Jupiter = 75
  let x = 150;
  const planetes = ASTRES.filter((a) => a.cle !== 'soleil').map((a) => {
    const r = Math.max(1.5, (a.diametre * k) / 2), place = Math.max(r, 26); // les petites planètes gardent la place de leur nom
    x += place + 8;
    const s = `${dessinerAstre(a, x, 150, r)}<text x="${x}" y="${150 + Math.max(r, 20) + 26}" font-size="15" font-weight="700" text-anchor="middle" fill="#fff">${a.nom.replace(/^L[ae] /, '')}</text>`;
    x += place + (a.cle === 'saturne' ? 40 : 4);
    return s;
  }).join('');
  return `<svg viewBox="0 0 ${x + 20} 260" class="tailles" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les planètes à la même échelle : Jupiter est la plus grosse, Mercure la plus petite">${DEFS}
    <rect width="${x + 20}" height="260" rx="16" fill="#141a3a"/>${ETOILES_FOND}
    <circle cx="${150 - 1392700 * k / 2}" cy="150" r="${1392700 * k / 2}" fill="#ffcf3f"/><text x="30" y="40" font-size="16" font-weight="700" fill="#5a3a00">Soleil</text>
    ${planetes}</svg>`;
}

// [question, bonne réponse, [autres choix], « Le savais-tu ? »]
export const QUIZ_FACILE = [
  ['Sur quelle planète vivons-nous ?', 'La Terre', ['Mars', 'Le Soleil'], 'La Terre est la seule planète connue où il y a de la vie.'],
  ['Le Soleil est…', 'Une étoile', ['Une planète', 'Une lune'], "C'est l'étoile la plus proche de nous. Les autres sont si loin qu'on les voit toutes petites."],
  ['Quelle planète est appelée la planète rouge ?', 'Mars', ['Jupiter', 'La Terre'], 'Son sol est plein de rouille, comme un vieux vélo laissé dehors !'],
  ['Quelle planète a de grands anneaux ?', 'Saturne', ['Mars', 'Mercure'], 'Ses anneaux sont faits de morceaux de glace et de roche : certains petits comme des grains de sable, d’autres grands comme une maison !'],
  ['Quelle est la plus grosse planète ?', 'Jupiter', ['La Terre', 'Mars'], 'Plus de 1 000 Terres pourraient tenir dedans !'],
  ['Combien y a-t-il de planètes autour du Soleil ?', '8', ['3', '100'], 'Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus et Neptune.'],
  ['Qui tourne autour de la Terre ?', 'La Lune', ['Le Soleil', 'Jupiter'], 'La Lune met environ un mois pour faire le tour de la Terre.'],
  ['Qui a marché sur la Lune ?', 'Des astronautes', ['Des chats', 'Personne'], 'En 1969, Neil Armstrong a été le premier humain à marcher sur la Lune.'],
  ['Avec quoi voyage-t-on dans l’espace ?', 'Une fusée', ['Un vélo', 'Un bateau'], 'Une fusée doit aller très, très vite pour quitter la Terre : environ 40 000 km/h !'],
  ['Quelle planète est la plus proche du Soleil ?', 'Mercure', ['Neptune', 'La Terre'], 'Sur Mercure, une année ne dure que 88 jours !'],
  ['Pourquoi fait-il nuit ?', 'La Terre tourne sur elle-même', ["Le Soleil s'éteint", 'La Lune cache le Soleil'], 'Quand ton pays est tourné vers le Soleil, c’est le jour ; quand il est de l’autre côté, c’est la nuit.'],
  ['De quelle couleur est la Terre vue de l’espace ?', 'Bleue', ['Rouge', 'Violette'], "On l'appelle la planète bleue, parce qu'elle est en grande partie couverte d'eau."],
  ["Dans l'espace, les astronautes…", 'Flottent', ['Nagent', 'Courent très vite'], 'Dans la station spatiale, tout flotte : il faut même attacher son sac de couchage pour dormir !'],
  ["Qu'est-ce qu'une étoile filante ?", 'Un petit caillou qui brûle dans le ciel', ['Une étoile qui tombe', 'Un avion'], "Ce n'est pas une étoile ! C'est un petit caillou de l'espace qui brûle en entrant dans l'air."],
  ['Où serais-tu le plus léger ?', 'Sur la Lune', ['Sur la Terre', 'Sur Jupiter'], 'Sur la Lune, tu pourrais sauter environ 6 fois plus haut que sur la Terre !'],
  ['Quelle planète est la plus loin du Soleil ?', 'Neptune', ['Mars', 'Vénus'], 'Neptune est si loin qu’elle met 165 ans pour faire le tour du Soleil !'],
  ['Quand voit-on les étoiles ?', 'La nuit', ['À midi', 'Jamais'], 'Les étoiles sont aussi là le jour, mais la lumière du Soleil les cache !'],
  ['Quelle est la forme de la Terre ?', 'Ronde comme une boule', ['Plate comme une crêpe', 'Carrée'], "Les astronautes l'ont photographiée depuis l'espace : c'est une grosse boule !"],
  ['Qui brille parfois la nuit en forme de croissant ?', 'La Lune', ['Le Soleil', 'Mars'], 'La Lune ne brille pas toute seule : elle est éclairée par le Soleil.'],
  ["Comment s'appelle une personne qui voyage dans l'espace ?", 'Un astronaute', ['Un pilote de course', 'Un plongeur'], 'Les astronautes s’entraînent dans de grandes piscines pour apprendre à bouger comme dans l’espace.'],
  ['Avec quoi regarde-t-on les étoiles de près ?', 'Un télescope', ['Un microscope', 'Des jumelles de plongée'], 'Un télescope rassemble la lumière pour voir des étoiles trop pâles pour nos yeux.'],
  ['Le Soleil est-il chaud ou froid ?', 'Très chaud', ['Très froid', 'Tiède'], "Il fait plus de 5 000 °C à sa surface : bien plus chaud qu'un four !"],
  ['Peut-on respirer sur la Lune sans casque ?', 'Non', ['Oui', 'Seulement le matin'], "Il n'y a pas d'air sur la Lune : les astronautes emportent leur air dans leur combinaison."],
  ['Quelle planète est appelée la planète bleue ?', 'La Terre', ['Mars', 'Saturne'], 'Elle est bleue grâce à ses océans.'],
  ['Combien de lunes a la Terre ?', '1', ['0', '10'], 'Notre Lune est la cinquième plus grosse lune du système solaire !'],
  ["Qu'est-ce qui tourne autour du Soleil ?", 'Les planètes', ['Les nuages', 'Les avions'], 'La Terre fait le tour du Soleil en un an : à chaque anniversaire, tu as fait un tour de plus !'],
  ["Quelle est l'étoile la plus proche de la Terre ?", 'Le Soleil', ['La Lune', 'Mars'], 'Les autres étoiles sont tellement plus loin qu’elles nous paraissent minuscules.'],
  ["Que porte un astronaute pour sortir dans l'espace ?", 'Une combinaison spatiale', ['Un maillot de bain', 'Un pyjama'], "Elle le protège du froid et de la chaleur, et lui apporte de l'air à respirer."],
  ['Combien de temps dure une journée sur Terre ?', '24 heures', ['2 heures', '100 heures'], "C'est le temps que met la Terre pour faire un tour complet sur elle-même."],
  ["Quel animal a fait le tour de la Terre en fusée avant les humains ?", 'Une chienne, Laïka', ['Un éléphant', 'Un poisson rouge'], 'En 1957, la chienne Laïka a été le premier animal à faire le tour de la Terre dans l’espace.'],
];
export const QUIZ_DIFFICILE = [
  ['Quelle est la planète la plus chaude ?', 'Vénus', ['Mercure', 'Mars', 'Jupiter'], 'Vénus est plus chaude que Mercure, car ses nuages épais gardent la chaleur comme une couverture : environ 460 °C !'],
  ['Combien de Terres pourraient tenir dans Jupiter ?', 'Plus de 1 000', ['2', '10', "Plus d'un million"], "Et dans le Soleil, il en tiendrait plus d'un million !"],
  ['Combien de temps met la lumière du Soleil pour arriver sur Terre ?', 'Environ 8 minutes', ['1 seconde', 'Environ 8 heures', 'Environ 8 jours'], 'On voit donc le Soleil tel qu’il était il y a 8 minutes. (Ne le regarde jamais en face !)'],
  ['Quelle planète tourne couchée sur le côté ?', 'Uranus', ['Saturne', 'Mars', 'Vénus'], 'On pense qu’un énorme choc l’a fait basculer, il y a très longtemps.'],
  ["Sur quelle planète une journée dure-t-elle plus longtemps qu'une année ?", 'Vénus', ['La Terre', 'Jupiter', 'Neptune'], 'Vénus tourne très lentement sur elle-même : un tour lui prend 243 jours, alors que son année en dure 225 !'],
  ['Quelle planète flotterait dans une baignoire géante ?', 'Saturne', ['Jupiter', 'La Terre', 'Mars'], "Saturne est faite surtout de gaz : pour sa taille, elle est plus légère que l'eau !"],
  ['Comment s’appelle la grande tempête de Jupiter ?', 'La Grande Tache rouge', ['Le Grand Tourbillon bleu', "L'Œil vert", 'La Tempête de neige'], 'Cette tempête est plus grande que la Terre, et on l’observe depuis plus de 150 ans !'],
  ['Quel est le plus grand volcan connu du système solaire ?', 'Olympus Mons, sur Mars', ['Le Vésuve, en Italie', 'Le Cervin', 'Un volcan de la Lune'], "Il est environ deux fois et demie plus haut que l'Everest !"],
  ['Pourquoi Mars est-elle rouge ?', 'Son sol contient de la rouille', ['Elle est en feu', 'Elle est couverte de fraises', 'Elle est très chaude'], "La rouille, c'est du fer qui a réagi avec l'oxygène, comme sur un vieux clou."],
  ['Combien de lunes a Mars ?', '2', ['0', '1', '50'], 'Elles s’appellent Phobos et Déimos, et elles ont une forme de pomme de terre !'],
  ['Quelle est la plus petite planète ?', 'Mercure', ['Mars', 'Vénus', 'Neptune'], 'Mercure est à peine plus grande que notre Lune.'],
  ['Combien de temps met la Terre pour faire le tour du Soleil ?', 'Un an', ['Un jour', 'Un mois', 'Cent ans'], "365 jours et environ 6 heures : c'est pour ça qu'il y a une année bissextile tous les 4 ans !"],
  ['Combien de temps met la Terre pour tourner sur elle-même ?', 'Un jour', ['Une heure', 'Une semaine', 'Un an'], 'Pendant que tu dors, la Terre continue de tourner, et ramène le Soleil le matin.'],
  ['Si tu pèses 30 kg sur Terre, combien pèserais-tu sur la Lune ?', 'Environ 5 kg', ['Environ 30 kg', 'Environ 60 kg', 'Environ 300 kg'], 'Sur la Lune, tout pèse environ 6 fois moins que sur Terre.'],
  ['Sur quelle planète serais-tu le plus lourd ?', 'Jupiter', ['Mars', 'Mercure', 'Uranus'], 'Sur Jupiter, tu pèserais deux fois et demie plus que sur Terre !'],
  ['Qui a été le premier humain à marcher sur la Lune ?', 'Neil Armstrong', ['Christophe Colomb', 'Thomas Pesquet', 'Youri Gagarine'], 'C’était en 1969. Youri Gagarine, lui, a été le premier humain dans l’espace, en 1961.'],
  ['Pourquoi les traces de pas des astronautes sont-elles encore sur la Lune ?', "Il n'y a pas de vent pour les effacer", ['Elles sont en béton', 'Un robot les garde', 'Il y pleut tout le temps'], 'Sans air ni vent, des traces de pas peuvent y rester des millions d’années.'],
  ['Quelle planète a les vents les plus rapides ?', 'Neptune', ['La Terre', 'Mercure', 'Mars'], 'Sur Neptune, le vent peut souffler à plus de 2 000 km/h, plus vite qu’un avion !'],
  ['Quelle planète a le plus de lunes connues ?', 'Saturne', ['La Terre', 'Mars', 'Mercure'], 'Les astronomes lui en découvrent encore régulièrement : elle en a plus de 200 !'],
  ['De quoi sont faits les anneaux de Saturne ?', 'De glace et de roche', ['De métal', 'De nuages roses', "De poussière d'or"], 'Ils sont immenses, mais très fins : par endroits, pas plus épais qu’un immeuble !'],
  ["Qu'est-ce que la Voie lactée ?", 'Notre galaxie', ['Une rivière de lait', 'Une planète', 'Une fusée'], "Elle contient des centaines de milliards d'étoiles, et notre Soleil n'est que l'une d'elles !"],
  ["Qu'est-ce qu'une année-lumière ?", 'Une distance', ['Une durée', 'Une lampe', 'Une étoile'], 'C’est la distance que parcourt la lumière en un an : environ 9 500 milliards de kilomètres !'],
  ['Quelle planète est cachée sous des nuages si épais qu’on ne voit pas son sol ?', 'Vénus', ['Mars', 'Mercure', 'La Terre'], 'Ses nuages sont faits de gouttelettes d’acide : pas vraiment un endroit pour les vacances !'],
  ['Pourquoi y a-t-il des saisons sur Terre ?', 'La Terre est penchée', ["Le Soleil s'allume et s'éteint", 'La Lune nous cache', 'La Terre change de taille'], 'Quand notre côté de la Terre penche vers le Soleil, c’est l’été ; quand il penche de l’autre côté, c’est l’hiver.'],
  ['Quel astronaute suisse est allé dans l’espace ?', 'Claude Nicollier', ['Roger Federer', 'Guillaume Tell', 'Neil Armstrong'], 'Claude Nicollier est allé quatre fois dans l’espace, et il a même aidé à réparer le télescope Hubble !'],
  ["Quelle planète a l'air le plus froid du système solaire ?", 'Uranus', ['Mercure', 'Vénus', 'Mars'], 'Il peut y faire environ −224 °C : encore plus froid que sur Neptune, pourtant plus loin du Soleil !'],
  ['Combien de temps met la Lune pour faire le tour de la Terre ?', 'Environ un mois', ['Un jour', 'Une semaine', 'Dix ans'], 'Et c’est de la Lune que vient le nom du « lundi » !'],
  ['Quelle est la deuxième plus grosse planète ?', 'Saturne', ['Neptune', 'La Terre', 'Uranus'], 'Saturne est presque aussi grande que Jupiter, mais beaucoup plus légère.'],
  ['Quelle planète a presque la même taille que la Terre ?', 'Vénus', ['Mars', 'Jupiter', 'Mercure'], "On l'appelle parfois la jumelle de la Terre… mais il y fait bien trop chaud pour y vivre !"],
  ['Quel télescope spatial photographie les galaxies les plus lointaines depuis 2022 ?', 'James Webb', ['Galilée', 'Big Ben', 'Le Cervin'], "Son miroir doré mesure 6,5 mètres : plus que la hauteur d'une girafe !"],
  ["En quelle année des humains ont-ils marché sur la Lune pour la première fois ?", '1969', ['1492', '1915', '2001'], 'Ce jour-là, des centaines de millions de personnes ont regardé à la télévision !'],
  ['Pourquoi la Lune semble-t-elle changer de forme ?', 'On voit plus ou moins sa partie éclairée', ['Elle se mange petit à petit', 'Elle se dégonfle', 'Les nuages la coupent'], "La Lune est toujours ronde : c'est seulement la partie éclairée par le Soleil qu'on voit changer."],
];

// reglage : { age }
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const [texte, bonne, autres, savaisTu] = parmiLesNouveaux(age <= 7 ? QUIZ_FACILE : QUIZ_DIFFICILE, (q) => q[0], vus, aleatoire);
  return { mode: 'choix', texte, titre: texte, consigne: texte, reponse: bonne, choix: melanger([bonne, ...autres], aleatoire), solution: `La bonne réponse : ${bonne}.`, savaisTu };
}

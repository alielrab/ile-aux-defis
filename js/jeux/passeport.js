// Le passeport du monde (île du savoir) : voyager en avion de pays en pays, découvrir le drapeau, la capitale, un animal
// et un plat typique, puis un petit quiz de 3 questions. Au moins 2 bonnes réponses : le tampon du pays va dans le passeport.
import { melanger, etoilesDuJeu } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('passeport', age);
export const BONNES_POUR_TAMPON = 2;

// lon, lat : où il est sur la carte ; animal et plat : [image, nom]
export const PAYS = [
  { cle: 'suisse', nom: 'La Suisse', de: 'de la Suisse', drapeau: '🇨🇭', capitale: 'Berne', lon: 8.2, lat: 46.8, animal: ['🐐', 'le bouquetin'], plat: ['🫕', 'la fondue'], langue: 'l’allemand, le français, l’italien et le romanche',
    savais: 'La Suisse a quatre langues nationales ! Berne est sa « ville fédérale » : c’est là que travaille le gouvernement.' },
  { cle: 'france', nom: 'La France', de: 'de la France', drapeau: '🇫🇷', capitale: 'Paris', lon: 2.3, lat: 46.5, animal: ['🐓', 'le coq'], plat: ['🥐', 'le croissant'], langue: 'le français',
    savais: 'La tour Eiffel, à Paris, mesure 330 mètres : plus haut qu’un immeuble de 80 étages !' },
  { cle: 'allemagne', nom: 'L’Allemagne', de: 'de l’Allemagne', drapeau: '🇩🇪', capitale: 'Berlin', lon: 10.4, lat: 51.2, animal: ['🦅', 'l’aigle'], plat: ['🥨', 'le bretzel'], langue: 'l’allemand',
    savais: 'On y fabrique des milliers de sortes de pains différents !' },
  { cle: 'italie', nom: 'L’Italie', de: 'de l’Italie', drapeau: '🇮🇹', capitale: 'Rome', lon: 12.5, lat: 42.5, animal: ['🐺', 'le loup'], plat: ['🍕', 'la pizza'], langue: 'l’italien',
    savais: 'La pizza Margherita a les couleurs du drapeau italien : le vert du basilic, le blanc de la mozzarella et le rouge de la tomate.' },
  { cle: 'autriche', nom: 'L’Autriche', de: 'de l’Autriche', drapeau: '🇦🇹', capitale: 'Vienne', lon: 14.5, lat: 47.5, animal: ['🐴', 'le cheval lipizzan'], plat: ['🥧', 'le strudel aux pommes'], langue: 'l’allemand',
    savais: 'Le grand musicien Mozart est né en Autriche, à Salzbourg.' },
  { cle: 'liechtenstein', nom: 'Le Liechtenstein', de: 'du Liechtenstein', drapeau: '🇱🇮', capitale: 'Vaduz', lon: 9.55, lat: 47.15, animal: ['🦌', 'le cerf'], plat: ['🧀', 'les käsknöpfle, des pâtes au fromage'], langue: 'l’allemand',
    savais: 'Au Liechtenstein, on paie avec des francs suisses, comme en Suisse !' },
  { cle: 'espagne', nom: 'L’Espagne', de: 'de l’Espagne', drapeau: '🇪🇸', capitale: 'Madrid', lon: -3.7, lat: 40.4, animal: ['🐂', 'le taureau'], plat: ['🥘', 'la paella'], langue: 'l’espagnol',
    savais: 'En Espagne, on mange souvent le soir très tard, vers 21 heures ou même 22 heures.' },
  { cle: 'portugal', nom: 'Le Portugal', de: 'du Portugal', drapeau: '🇵🇹', capitale: 'Lisbonne', lon: -8, lat: 39.5, animal: ['🐓', 'le coq de Barcelos'], plat: ['🐟', 'la morue'], langue: 'le portugais',
    savais: 'On dit qu’il existe au Portugal une recette de morue pour chaque jour de l’année !' },
  { cle: 'royaume-uni', nom: 'Le Royaume-Uni', de: 'du Royaume-Uni', drapeau: '🇬🇧', capitale: 'Londres', lon: -1.5, lat: 52.5, animal: ['🦁', 'le lion'], plat: ['🐟', 'le fish and chips'], langue: 'l’anglais',
    savais: 'Big Ben, à Londres, c’est le nom de la grosse cloche de la tour, pas de la tour elle-même !' },
  { cle: 'grece', nom: 'La Grèce', de: 'de la Grèce', drapeau: '🇬🇷', capitale: 'Athènes', lon: 22, lat: 39, animal: ['🦉', 'la chouette'], plat: ['🥗', 'la salade grecque'], langue: 'le grec',
    savais: 'Les premiers Jeux olympiques ont eu lieu en Grèce, il y a plus de 2 700 ans.' },
  { cle: 'maroc', nom: 'Le Maroc', de: 'du Maroc', drapeau: '🇲🇦', capitale: 'Rabat', lon: -6.8, lat: 32, animal: ['🐪', 'le dromadaire'], plat: ['🍲', 'le couscous'], langue: 'l’arabe et l’amazigh',
    savais: 'Au Maroc, on accueille souvent les invités avec un thé à la menthe.' },
  { cle: 'egypte', nom: 'L’Égypte', de: 'de l’Égypte', drapeau: '🇪🇬', capitale: 'Le Caire', lon: 30, lat: 27, animal: ['🐊', 'le crocodile du Nil'], plat: ['🫘', 'le foul, une purée de fèves'], langue: 'l’arabe',
    savais: 'Les pyramides de Gizeh, près du Caire, ont plus de 4 500 ans !' },
  { cle: 'kenya', nom: 'Le Kenya', de: 'du Kenya', drapeau: '🇰🇪', capitale: 'Nairobi', lon: 37.9, lat: 0.5, animal: ['🦁', 'le lion'], plat: ['🌽', 'l’ugali, une purée de maïs'], langue: 'le swahili et l’anglais',
    savais: 'Juste à côté de Nairobi, la capitale, il y a un parc national avec des lions et des girafes !' },
  { cle: 'inde', nom: 'L’Inde', de: 'de l’Inde', drapeau: '🇮🇳', capitale: 'New Delhi', lon: 78, lat: 22, animal: ['🐅', 'le tigre'], plat: ['🍛', 'le curry'], langue: 'l’hindi, l’anglais et beaucoup d’autres langues',
    savais: 'L’Inde a plus de 20 langues officielles !' },
  { cle: 'chine', nom: 'La Chine', de: 'de la Chine', drapeau: '🇨🇳', capitale: 'Pékin', lon: 104, lat: 35, animal: ['🐼', 'le panda'], plat: ['🥟', 'les raviolis'], langue: 'le chinois',
    savais: 'La Grande Muraille de Chine est si longue qu’il faudrait des mois pour la parcourir à pied.' },
  { cle: 'japon', nom: 'Le Japon', de: 'du Japon', drapeau: '🇯🇵', capitale: 'Tokyo', lon: 138, lat: 36.5, animal: ['🐒', 'le macaque des neiges'], plat: ['🍣', 'les sushis'], langue: 'le japonais',
    savais: 'Au Japon, on enlève ses chaussures avant d’entrer dans une maison.' },
  { cle: 'australie', nom: 'L’Australie', de: 'de l’Australie', drapeau: '🇦🇺', capitale: 'Canberra', lon: 134, lat: -25, animal: ['🦘', 'le kangourou'], plat: ['🍰', 'la pavlova, un gâteau meringué'], langue: 'l’anglais',
    savais: 'En Australie, Noël tombe en plein été : on le fête parfois à la plage !' },
  { cle: 'bresil', nom: 'Le Brésil', de: 'du Brésil', drapeau: '🇧🇷', capitale: 'Brasília', lon: -52, lat: -10, animal: ['🦜', 'l’ara, un grand perroquet'], plat: ['🫘', 'la feijoada, un plat de haricots noirs'], langue: 'le portugais',
    savais: 'La forêt amazonienne, au Brésil, est la plus grande forêt tropicale du monde.' },
  { cle: 'canada', nom: 'Le Canada', de: 'du Canada', drapeau: '🇨🇦', capitale: 'Ottawa', lon: -100, lat: 57, animal: ['🦫', 'le castor'], plat: ['🍟', 'la poutine, des frites au fromage'], langue: 'l’anglais et le français',
    savais: 'La feuille du drapeau, c’est une feuille d’érable : avec la sève de cet arbre, on fait le sirop d’érable.' },
  { cle: 'mexique', nom: 'Le Mexique', de: 'du Mexique', drapeau: '🇲🇽', capitale: 'Mexico', lon: -102, lat: 23.5, animal: ['🦅', 'l’aigle royal'], plat: ['🌮', 'les tacos'], langue: 'l’espagnol',
    savais: 'Le chocolat vient du Mexique : il y a très longtemps, les Aztèques buvaient déjà du cacao.' },
];
export const pays = (cle) => PAYS.find((p) => p.cle === cle);

export const presentation = (p, age) => `${p.nom}. Voici son drapeau. Sa capitale est ${p.capitale}. Un animal de ce pays : ${p.animal[1]}. Un plat typique : ${p.plat[1]}.${age > 7 ? ` On y parle ${p.langue}.` : ''} Le savais-tu ? ${p.savais}`;

// Les 3 questions d'un pays. 7 ans et moins : drapeau, animal, plat, 3 choix. Grands : 3 parmi drapeau, capitale, animal, plat, langue, 4 choix.
export function questions(cle, age, aleatoire = Math.random) {
  const p = pays(cle), n = age <= 7 ? 3 : 4;
  const autres = (f) => melanger([...new Set(PAYS.filter((x) => x !== p).map(f))].filter((v) => v !== f(p)), aleatoire).slice(0, n - 1);
  const types = {
    drapeau: [`Quel est le drapeau ${p.de} ?`, p.drapeau, autres((x) => x.drapeau)],
    capitale: [`Quelle est la capitale ${p.de} ?`, p.capitale, autres((x) => x.capitale)],
    animal: [`Quel animal avons-nous découvert ${p.de.replace(/^de la |^de l’|^du /, (m) => ({ 'de la ': 'en ', 'de l’': 'en ', 'du ': 'au ' }[m]))} ?`, p.animal[1], autres((x) => x.animal[1])],
    plat: [`Quel est le plat typique que nous avons découvert ${p.de.replace(/^de la |^de l’|^du /, (m) => ({ 'de la ': 'en ', 'de l’': 'en ', 'du ': 'au ' }[m]))} ?`, p.plat[1], autres((x) => x.plat[1])],
    langue: [`Quelle langue parle-t-on ${p.de.replace(/^de la |^de l’|^du /, (m) => ({ 'de la ': 'en ', 'de l’': 'en ', 'du ': 'au ' }[m]))} ?`, p.langue, autres((x) => x.langue)],
  };
  const choisis = age <= 7 ? ['drapeau', 'animal', 'plat'] : melanger(Object.keys(types), aleatoire).slice(0, 3);
  return choisis.map((t) => {
    const [texte, bonne, faux] = types[t];
    return { mode: 'choix', type: t, texte: `${cle}:${t}`, titre: texte, consigne: texte, reponse: bonne, choix: melanger([bonne, ...faux], aleatoire), solution: `La bonne réponse : ${bonne}.`, savaisTu: t === 'drapeau' ? null : p.savais };
  });
}

// Le tampon : au moins 2 bonnes réponses sur 3, une seule fois par pays. Renvoie true si c'est un nouveau tampon.
export function tamponner(profil, cle, bonnes) {
  profil.passeport ??= [];
  if (bonnes < BONNES_POUR_TAMPON || profil.passeport.includes(cle)) return false;
  profil.passeport.push(cle);
  return true;
}

// ---------- La carte du monde (simplifiée, à la main) : 1 degré = 2 unités, viewBox 0 0 720 300 (de 75° N à 75° S) ----------
const xy = (lon, lat) => [((lon + 180) * 2).toFixed(1), ((75 - lat) * 2).toFixed(1)];
const CONTINENTS = [
  [[-168, 66], [-140, 70], [-95, 72], [-80, 62], [-60, 55], [-55, 48], [-70, 43], [-80, 30], [-82, 25], [-97, 18], [-90, 15], [-83, 9], [-78, 8], [-105, 22], [-112, 30], [-118, 34], [-124, 40], [-125, 48], [-135, 58], [-150, 60], [-165, 60]],
  [[-50, 75], [-20, 75], [-20, 70], [-45, 60], [-55, 68]],
  [[-80, 10], [-62, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -45], [-68, -55], [-75, -50], [-73, -35], [-71, -18], [-81, -5]],
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [5, 58], [10, 63], [20, 70], [30, 70], [40, 68], [40, 48], [30, 45], [28, 41], [22, 37], [15, 38], [12, 44], [8, 44], [3, 42], [-5, 36]],
  [[-6, 50], [2, 51], [0, 54], [-3, 59], [-6, 57]],
  [[-17, 21], [-10, 30], [-5, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 12], [40, -2], [40, -15], [35, -25], [28, -33], [18, -34], [12, -17], [9, -1], [5, 5], [-8, 4], [-17, 14]],
  [[28, 41], [36, 36], [45, 30], [57, 25], [67, 25], [72, 21], [77, 8], [80, 15], [88, 22], [92, 21], [98, 16], [100, 13], [104, 1], [106, 10], [109, 20], [122, 30], [122, 40], [130, 43], [140, 48], [142, 58], [160, 60], [180, 66], [180, 72], [140, 73], [100, 75], [70, 73], [60, 68], [40, 68], [40, 48], [30, 45]],
  [[130, 31], [135, 34], [141, 38], [142, 45], [140, 41], [133, 34]],
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -25], [151, -34], [145, -38], [138, -35], [131, -31], [115, -34]],
];

// La carte, avec un point par pays (tamponnés : verts) et l'avion (déplacé par l'app en changeant son « transform »)
export function dessinerCarte(tampons = [], avionSur = 'suisse') {
  const terres = CONTINENTS.map((c) => `<path d="M${c.map(([lo, la]) => xy(lo, la).join(' ')).join(' L')}Z"/>`).join('');
  const points = PAYS.map((p) => { const [x, y] = xy(p.lon, p.lat); return `<circle cx="${x}" cy="${y}" r="4.5" fill="${tampons.includes(p.cle) ? '#1e8e3e' : '#e05252'}" stroke="#fff" stroke-width="1.5"/>`; }).join('');
  const [ax, ay] = xy(pays(avionSur).lon, pays(avionSur).lat);
  return `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" class="carte-monde" role="img" aria-label="La carte du monde">
    <rect width="720" height="300" rx="14" fill="#7fc4e8"/><g fill="#9fd36a" stroke="#6aa040" stroke-width="2" stroke-linejoin="round">${terres}</g>${points}
    <g class="avion" style="transform: translate(${ax}px, ${ay}px)"><text x="0" y="0" font-size="30" text-anchor="middle" dominant-baseline="central">✈️</text></g></svg>`;
}
export const position = (cle) => xy(pays(cle).lon, pays(cle).lat);

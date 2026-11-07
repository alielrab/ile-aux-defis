// Le musée des dinosaures (île du savoir) : reconstituer le squelette de chaque dinosaure comme un puzzle (4 pièces),
// lire sa fiche (taille, époque, ce qu'il mangeait), puis un quiz fait à partir des fiches.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('dinos', age);
export const ETOILES_SQUELETTE = 2; // la première fois qu'on reconstitue un squelette

const REGIMES = { plantes: 'Des plantes', viande: 'De la viande', poissons: 'Surtout des poissons', tout: 'De tout : plantes et petits animaux' };
const EPOQUES = { trias: 'Le Trias', jurassique: 'Le Jurassique', cretace: 'Le Crétacé' };

// forme : bipede ou quadrupede ; tete, cou, dos, queue, pattes : variantes du dessin ; taille : échelle du dessin.
// longueur en mètres (environ), il y a combien de millions d'années, trait : « Quel dinosaure … ? »
export const DINOS = [
  { cle: 'trex', nom: 'Le Tyrannosaure', forme: 'bipede', tete: 'grosse', bras: 'minuscules', longueur: 12, poids: 'environ 8 tonnes', epoque: 'cretace', ilya: 'il y a 68 à 66 millions d’années', regime: 'viande',
    trait: 'avait de tout petits bras et une énorme tête', savais: 'Ses dents pouvaient être aussi longues qu’une banane !' },
  { cle: 'triceratops', nom: 'Le Tricératops', forme: 'quadrupede', tete: 'collerette', longueur: 9, poids: 'environ 8 tonnes', epoque: 'cretace', ilya: 'il y a 68 à 66 millions d’années', regime: 'plantes',
    trait: 'avait trois cornes et une grande collerette', savais: 'Son nom veut dire « tête à trois cornes ».' },
  { cle: 'stegosaure', nom: 'Le Stégosaure', forme: 'quadrupede', dos: 'plaques', queue: 'piquants', longueur: 9, poids: 'environ 5 tonnes', epoque: 'jurassique', ilya: 'il y a environ 150 millions d’années', regime: 'plantes',
    trait: 'avait de grandes plaques sur le dos', savais: 'Il était aussi long qu’un bus, mais son cerveau était à peine plus gros qu’une noix !' },
  { cle: 'diplodocus', nom: 'Le Diplodocus', forme: 'quadrupede', cou: 'tres-long', queue: 'fouet', longueur: 26, poids: 'environ 15 tonnes', epoque: 'jurassique', ilya: 'il y a environ 150 millions d’années', regime: 'plantes',
    trait: 'avait une queue très longue, comme un fouet', savais: 'Il était aussi long que deux bus mis bout à bout !' },
  { cle: 'brachiosaure', nom: 'Le Brachiosaure', forme: 'quadrupede', cou: 'haut', pattes: 'avant-longues', longueur: 22, poids: 'environ 40 tonnes', epoque: 'jurassique', ilya: 'il y a environ 150 millions d’années', regime: 'plantes',
    trait: 'avait des pattes avant plus longues que celles de derrière', savais: 'Avec son long cou dressé, il était aussi haut qu’un immeuble de quatre étages.' },
  { cle: 'velociraptor', nom: 'Le Vélociraptor', forme: 'bipede', tete: 'longue', taille: 0.55, longueur: 2, poids: 'environ 15 kilos', epoque: 'cretace', ilya: 'il y a environ 75 millions d’années', regime: 'viande',
    trait: 'était petit comme une dinde et avait des plumes', savais: 'Il avait une grande griffe recourbée à chaque pied.' },
  { cle: 'ankylosaure', nom: 'L’Ankylosaure', forme: 'quadrupede', dos: 'armure', queue: 'massue', longueur: 7, poids: 'environ 6 tonnes', epoque: 'cretace', ilya: 'il y a 68 à 66 millions d’années', regime: 'plantes',
    trait: 'avait une massue au bout de la queue', savais: 'Son dos était couvert d’une armure de plaques d’os, comme un char.' },
  { cle: 'spinosaure', nom: 'Le Spinosaure', forme: 'bipede', tete: 'longue', dos: 'voile', longueur: 14, poids: 'environ 7 tonnes', epoque: 'cretace', ilya: 'il y a environ 95 millions d’années', regime: 'poissons',
    trait: 'avait une grande voile sur le dos', savais: 'Il passait beaucoup de temps dans l’eau, comme un crocodile géant.' },
  { cle: 'parasaurolophus', nom: 'Le Parasaurolophus', forme: 'bipede', tete: 'crete', longueur: 9, poids: 'environ 3 tonnes', epoque: 'cretace', ilya: 'il y a environ 75 millions d’années', regime: 'plantes',
    trait: 'avait une longue crête creuse sur la tête', savais: 'Sa crête était creuse : il pouvait souffler dedans pour faire des sons, comme une trompette.' },
  { cle: 'iguanodon', nom: 'L’Iguanodon', forme: 'bipede', tete: 'bec', longueur: 10, poids: 'environ 3 tonnes', epoque: 'cretace', ilya: 'il y a environ 125 millions d’années', regime: 'plantes',
    trait: 'avait un pouce en forme de pointe', savais: 'C’est un des tout premiers dinosaures découverts, il y a 200 ans.' },
  { cle: 'allosaure', nom: 'L’Allosaure', forme: 'bipede', tete: 'grosse', longueur: 9, poids: 'environ 2 tonnes', epoque: 'jurassique', ilya: 'il y a environ 150 millions d’années', regime: 'viande',
    trait: 'était le grand chasseur du Jurassique, avec de petites cornes au-dessus des yeux', savais: 'Il vivait à la même époque que le Stégosaure et le Diplodocus.' },
  { cle: 'pachycephalosaure', nom: 'Le Pachycéphalosaure', forme: 'bipede', tete: 'dome', taille: 0.8, longueur: 4.5, poids: 'environ 400 kilos', epoque: 'cretace', ilya: 'il y a environ 68 millions d’années', regime: 'plantes',
    trait: 'avait un crâne en forme de dôme, très épais', savais: 'Le dessus de son crâne était aussi épais qu’un gros livre : environ 25 centimètres d’os !' },
  { cle: 'compsognathus', nom: 'Le Compsognathus', forme: 'bipede', tete: 'longue', taille: 0.4, longueur: 1, poids: 'environ 3 kilos', epoque: 'jurassique', ilya: 'il y a environ 150 millions d’années', regime: 'viande',
    trait: 'était petit comme un poulet', savais: 'Il mangeait de petits lézards et des insectes.' },
  { cle: 'argentinosaure', nom: 'L’Argentinosaure', forme: 'quadrupede', cou: 'tres-long', queue: 'fouet', longueur: 35, poids: 'environ 70 tonnes', epoque: 'cretace', ilya: 'il y a environ 95 millions d’années', regime: 'plantes',
    trait: 'était un des plus grands animaux qui aient marché sur la Terre', savais: 'Il pesait autant que dix éléphants !' },
  { cle: 'plateosaure', nom: 'Le Plateosaurus', forme: 'bipede', cou: 'long', tete: 'petite', longueur: 8, poids: 'environ 700 kilos', epoque: 'trias', ilya: 'il y a environ 210 millions d’années', regime: 'plantes',
    trait: 'a vécu en Suisse : on a trouvé beaucoup de ses squelettes à Frick, en Argovie', savais: 'On peut voir ses squelettes au musée des dinosaures de Frick, en Suisse !' },
  { cle: 'gallimimus', nom: 'Le Gallimimus', forme: 'bipede', cou: 'long', tete: 'bec', taille: 0.8, longueur: 6, poids: 'environ 400 kilos', epoque: 'cretace', ilya: 'il y a environ 70 millions d’années', regime: 'tout',
    trait: 'courait très vite, comme une autruche', savais: 'Il n’avait pas de dents, mais un bec, comme les oiseaux.' },
];
export const dino = (cle) => DINOS.find((d) => d.cle === cle);
export const PIECES = ['tete', 'corps', 'queue', 'pattes'];
export const NOMS_PIECES = { tete: 'la tête', corps: 'le corps', queue: 'la queue', pattes: 'les pattes' };

// La fiche, lue à voix haute
export function fiche(d, age) {
  const r = REGIMES[d.regime].toLowerCase(), base = `${d.nom} mesurait environ ${String(d.longueur).replace('.', ',')} mètres de long. Il mangeait ${r.replace(/^des |^de la |^surtout des |^de tout/, (m) => m)}.`;
  return age <= 7 ? `${base} Il ${d.trait}.` : `${base} Il pesait ${d.poids}. Il vivait au ${EPOQUES[d.epoque].replace(/^Le /, '')}, ${d.ilya}. Il ${d.trait}.`;
}

// Quiz : des questions fabriquées à partir des fiches. 7 ans et moins : régime et « quel dinosaure… ? », 3 choix. Grands : aussi la taille et l'époque, 4 choix.
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const petits = age <= 7, n = petits ? 3 : 4;
  const possibles = DINOS.flatMap((d) => [['regime', d], ['trait', d], ...(petits ? [] : [['taille', d], ['epoque', d]])]);
  const [type, d] = parmiLesNouveaux(possibles, ([t, x]) => `${t}:${x.cle}`, vus, aleatoire);
  const autresDinos = melanger(DINOS.filter((x) => x !== d), aleatoire);
  let texte, bonne, autres;
  if (type === 'regime') { texte = `Que mangeait ${d.nom.replace(/^Le /, 'le ').replace(/^L’/, 'l’')} ?`; bonne = REGIMES[d.regime]; autres = Object.values(REGIMES).filter((r) => r !== bonne); }
  else if (type === 'trait') { texte = `Quel dinosaure ${d.trait} ?`; bonne = d.nom; autres = autresDinos.map((x) => x.nom); }
  else if (type === 'taille') {
    texte = `Combien mesurait ${d.nom.replace(/^Le /, 'le ').replace(/^L’/, 'l’')}, de la tête à la queue ?`;
    const m = (x) => `Environ ${String(x).replace('.', ',')} mètre${x >= 2 ? 's' : ''}`;
    bonne = m(d.longueur);
    autres = [...new Set(DINOS.map((x) => x.longueur).filter((x) => Math.abs(x - d.longueur) >= Math.max(1, d.longueur * 0.3)))].sort((a, b) => Math.abs(a - d.longueur) - Math.abs(b - d.longueur)).slice(0, 5).map(m);
  } else { texte = `À quelle époque vivait ${d.nom.replace(/^Le /, 'le ').replace(/^L’/, 'l’')} ?`; bonne = EPOQUES[d.epoque]; autres = [...Object.values(EPOQUES).filter((e) => e !== bonne), 'L’époque des mammouths']; }
  const choix = melanger([bonne, ...melanger(autres, aleatoire).slice(0, n - 1)], aleatoire);
  return { mode: 'choix', texte: `${type}:${d.cle}`, titre: texte, consigne: texte, reponse: bonne, choix, dino: d.cle, solution: `La bonne réponse : ${bonne}.`, savaisTu: d.savais };
}

// ---------- Squelettes (viewBox 0 0 320 200, le sol à y = 186) ----------
const OS = '#f3ead2', TRAIT = '#8a6a4a';
const os = (d, ep = 7) => `<path d="${d}" fill="none" stroke="${TRAIT}" stroke-width="${ep + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${OS}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cotes = (cx, cy, rx, ry, n = 6) => Array.from({ length: n }, (_, i) => { const x = cx - rx + ((i + 0.5) * 2 * rx) / n; return os(`M${x} ${cy - ry * 0.8} Q${x + 6} ${cy} ${x} ${cy + ry * 0.8}`, 4); }).join('');
const crane = (x, y, l, h, dents = false) => `<path d="M${x} ${y} q${l * 0.1} ${-h} ${l * 0.55} ${-h} q${l * 0.45} 0 ${l * 0.45} ${h * 0.75} q0 ${h * 0.25} ${-l * 0.2} ${h * 0.35} h${-l * 0.8}z" fill="${OS}" stroke="${TRAIT}" stroke-width="3"/>
  <circle cx="${x + l * 0.62}" cy="${y - h * 0.45}" r="${Math.max(3, h * 0.16)}" fill="${TRAIT}"/>${dents ? Array.from({ length: 5 }, (_, i) => `<path d="M${x + l * (0.15 + i * 0.13)} ${y + h * 0.05} l3 7 l3 -7" fill="#fff" stroke="${TRAIT}" stroke-width="1.5"/>`).join('') : ''}`;

// Les 4 pièces d'un squelette : { tete, corps, queue, pattes } (chacune est un bout de SVG)
export function pieces(d) {
  if (d.forme === 'bipede') {
    const cou = d.cou === 'long';
    const [hx, hy] = cou ? [62, 44] : [86, 72]; // où est la tête
    const tete = { grosse: crane(hx - 40, hy, 62, 36, true), longue: crane(hx - 36, hy, 54, 20, true), petite: crane(hx - 22, hy, 34, 18), bec: crane(hx - 30, hy, 44, 20) + `<path d="M${hx - 30} ${hy - 4} l-10 6 l10 2z" fill="${OS}" stroke="${TRAIT}" stroke-width="2"/>`,
      crete: crane(hx - 30, hy, 44, 22) + os(`M${hx + 6} ${hy - 18} Q${hx + 40} ${hy - 36} ${hx + 64} ${hy - 30}`, 6), dome: crane(hx - 28, hy, 44, 22) + `<path d="M${hx - 16} ${hy - 20} Q${hx} ${hy - 48} ${hx + 16} ${hy - 20}z" fill="${OS}" stroke="${TRAIT}" stroke-width="3"/>` }[d.tete ?? 'longue'];
    return {
      tete: tete + os(`M${hx + 14} ${hy - 4} Q${hx + 40} ${cou ? 60 : 84} 128 96`, 6),
      corps: `<ellipse cx="160" cy="104" rx="42" ry="26" fill="none" stroke="${TRAIT}" stroke-width="3" stroke-dasharray="4 4"/>` + os('M120 96 Q160 84 200 98', 7) + cotes(160, 108, 30, 18)
        + (d.dos === 'voile' ? `<path d="M128 92 Q160 18 196 92Z" fill="#e8c9a0" stroke="${TRAIT}" stroke-width="3"/>${[136, 148, 160, 172, 184].map((x) => os(`M${x} 92 L${x + 2} ${92 - (40 - Math.abs(160 - x) * 1.1)}`, 3)).join('')}` : '')
        + os(`M136 112 L${d.bras === 'minuscules' ? '132 124' : '124 138'}`, 4),
      queue: os('M200 98 Q250 104 312 128', 8),
      pattes: os('M150 118 L156 150 L146 184 L162 186', 8) + os('M174 116 L182 150 L172 184 L188 186', 8),
    };
  }
  const long = d.cou === 'tres-long', haut = d.cou === 'haut', avantLongues = d.pattes === 'avant-longues';
  const [hx, hy] = long ? [30, 70] : haut ? [72, 22] : [70, 108];
  const tete = d.tete === 'collerette'
    ? `<path d="M${hx + 30} ${hy - 30} A34 34 0 0 1 ${hx + 30} ${hy + 34}" fill="#e8c9a0" stroke="${TRAIT}" stroke-width="3"/>` + crane(hx - 22, hy + 8, 48, 26) + `<path d="M${hx - 4} ${hy - 12} l-14 -22 l8 24z M${hx + 10} ${hy - 16} l-6 -24 l10 22z M${hx - 18} ${hy} l-10 -8 l6 12z" fill="#fff" stroke="${TRAIT}" stroke-width="2"/>`
    : crane(hx - 16, hy + 6, long || haut ? 30 : 38, long || haut ? 16 : 20);
  return {
    tete: tete + os(long ? `M${hx + 12} ${hy} Q70 60 112 96` : haut ? `M${hx + 10} ${hy + 2} Q100 40 112 92` : `M${hx + 18} ${hy} Q96 100 112 100`, long || haut ? 9 : 8),
    corps: `<ellipse cx="165" cy="106" rx="56" ry="30" fill="none" stroke="${TRAIT}" stroke-width="3" stroke-dasharray="4 4"/>` + os(avantLongues ? 'M110 92 Q165 80 220 104' : 'M110 100 Q165 80 220 100', 8) + cotes(165, 110, 44, 22, 7)
      + (d.dos === 'plaques' ? [120, 142, 164, 186, 206].map((x, i) => `<path d="M${x - 9} ${92 - (i === 2 ? 4 : 0)} L${x} ${62 - (i === 2 ? 10 : i % 2 ? 4 : 0)} L${x + 9} ${92 - (i === 2 ? 4 : 0)}Z" fill="#e8b878" stroke="${TRAIT}" stroke-width="2.5"/>`).join('') : '')
      + (d.dos === 'armure' ? Array.from({ length: 10 }, (_, i) => `<circle cx="${122 + i * 9.5}" cy="${86 + (i % 2) * 6}" r="5" fill="#e8c9a0" stroke="${TRAIT}" stroke-width="2"/>`).join('') : ''),
    queue: os(d.queue === 'fouet' ? 'M218 100 Q270 104 318 70' : 'M218 102 Q262 110 300 140', d.queue === 'fouet' ? 6 : 9)
      + (d.queue === 'massue' ? `<ellipse cx="302" cy="142" rx="14" ry="10" fill="#e8c9a0" stroke="${TRAIT}" stroke-width="3"/>` : '')
      + (d.queue === 'piquants' ? `<path d="M286 128 l12 -22 l2 24z M296 136 l20 -10 l-14 18z" fill="#fff" stroke="${TRAIT}" stroke-width="2"/>` : ''),
    pattes: [[124, avantLongues ? 186 : 184], [146, 184], [192, 184], [210, 184]].map(([x, y], i) => os(`M${x} ${i < 2 && avantLongues ? 96 : 116} L${x + (i % 2 ? 4 : -2)} ${150} L${x} ${y}`, 9)).join(''),
  };
}

// Le squelette : les pièces posées en entier ; les autres en pointillés (ou en surbrillance pour la place à remplir)
export function dessinerSquelette(d, posees = PIECES, aRemplir = null) {
  const p = pieces(d), s = d.taille ?? 1;
  const morceaux = PIECES.map((k) => {
    if (posees.includes(k)) return `<g class="piece-posee">${p[k]}</g>`;
    return `<g class="piece-vide${k === aRemplir ? ' a-remplir' : ''}" opacity="${k === aRemplir ? 0.55 : 0.18}">${p[k]}</g>`;
  }).join('');
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="squelette" role="img" aria-label="Le squelette ${d.nom.replace(/^Le |^L’/, 'du ')}">
    <rect width="320" height="200" rx="12" fill="#4a3a5a"/><rect y="186" width="320" height="14" fill="#6a5040"/>
    <g transform="translate(160 186) scale(${s}) translate(-160 -186)">${morceaux}</g></svg>`;
}

// Une pièce seule (dans la réserve du puzzle), cadrée sur tout le squelette
export const dessinerPiece = (d, k) => `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(160 186) scale(${d.taille ?? 1}) translate(-160 -186)">${pieces(d)[k]}</g></svg>`;

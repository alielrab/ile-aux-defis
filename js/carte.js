// Carte de l'île en SVG : la mer, la plage, les arbres, le village des filles au centre,
// un bâtiment par mini-jeu et les magasins (coiffeur, boutique, meubles, refuge).
import { dessinerAvatar } from './avatar.js';
import { CROYANCES, batiment } from './croyances.js';

const echapper = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Les lieux de l'île. type : jeu ou magasin. ouvert : false = un badge « Bientôt ». x, y : bas du bâtiment.
export const LIEUX = [
  { id: 'calcul', type: 'jeu', nom: "L'école", detail: 'Calcul', ouvert: true, x: 190, y: 285 },
  { id: 'coiffeur', type: 'magasin', nom: 'Le coiffeur', detail: 'coiffures et couleurs', ouvert: true, x: 400, y: 285 },
  { id: 'heure', type: 'jeu', nom: "La tour\nde l'horloge", detail: "lire l'heure", ouvert: true, x: 610, y: 285 },
  { id: 'syllabes', type: 'jeu', nom: 'La bibliothèque', detail: 'la chasse aux syllabes', ouvert: true, x: 185, y: 465 },
  { id: 'espace', type: 'jeu', nom: "L'observatoire", detail: 'le système solaire', ouvert: true, x: 615, y: 465 },
  { id: 'mode', type: 'magasin', nom: 'La boutique', detail: 'vêtements et bijoux', ouvert: true, x: 160, y: 630 },
  { id: 'corps', type: 'jeu', nom: "L'hôpital", detail: 'le corps humain', ouvert: true, x: 640, y: 630 },
  { id: 'meubles', type: 'magasin', nom: 'Le magasin\nde meubles', detail: 'meubles, jouets, murs et pièces', ouvert: true, x: 225, y: 800 },
  { id: 'cuisine', type: 'jeu', nom: 'Le\nrestaurant', detail: 'la cuisine de l’île', ouvert: true, x: 400, y: 800 },
  { id: 'refuge', type: 'magasin', nom: 'Le refuge', detail: 'animaux à adopter', ouvert: true, x: 575, y: 800 },
];

// Texte avec contour blanc ; « \n » = deuxième ligne. largeurMax : au-delà, le texte rétrécit.
function etiquette(x, y, texte, taille = 28, largeurMax = Infinity) {
  return texte.split('\n').map((ligne, i) => {
    const largeur = (t) => ligne.length * t * 0.6; // un caractère ≈ 0,6 × la taille de police
    let t = taille;
    if (largeur(t) > largeurMax) t = Math.max(18, Math.floor(largeurMax / (ligne.length * 0.6)));
    const serre = largeur(t) > largeurMax ? ` textLength="${largeurMax}" lengthAdjust="spacingAndGlyphs"` : '';
    return `<text x="${x}" y="${y + i * taille}" class="etiquette" font-size="${t}" text-anchor="middle"${serre}>${echapper(ligne)}</text>`;
  }).join('');
}
const bientot = (x, y) =>
  `<g class="panneau"><rect x="${x - 50}" y="${y - 21}" width="100" height="30" rx="10" fill="#fff" stroke="#c98a3a" stroke-width="3"/>${etiquette(x, y, 'Bientôt', 20)}</g>`;

const palmier = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 0 Q6 -40 -4 -80" stroke="#9a6a3a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M-4 -80 Q-40 -96 -62 -70 Q-36 -84 -4 -80Z M-4 -80 Q30 -104 58 -78 Q28 -88 -4 -80Z M-4 -80 Q-20 -116 -50 -112 Q-22 -102 -4 -80Z M-4 -80 Q14 -118 40 -116 Q14 -100 -4 -80Z" fill="#3fa34d"/>
  <circle cx="-8" cy="-78" r="5" fill="#7a4a20"/><circle cx="2" cy="-76" r="5" fill="#7a4a20"/></g>`;
const arbre = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-6" y="-18" width="12" height="22" fill="#8a5a30"/>
  <circle cx="0" cy="-34" r="24" fill="#3e9a48"/><circle cx="-16" cy="-24" r="16" fill="#47ad52"/><circle cx="16" cy="-24" r="16" fill="#47ad52"/></g>`;
const fleurs = (pts) => pts.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x}" cy="${y}" r="2" fill="#fff6a0"/>`).join('');
const fenetre = (x, y, l = 24, h = 24) => `<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="3" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>`;
// Auvent rayé de magasin, de x1 à x2
const auvent = (x1, x2, y, c1, c2) => {
  const n = 6, l = (x2 - x1) / n;
  return Array.from({ length: n }, (_, i) => `<path d="M${x1 + i * l} ${y} h${l} v18 a${l / 2} ${l / 2} 0 0 1 ${-l} 0Z" fill="${i % 2 ? c2 : c1}"/>`).join('');
};

// Bâtiments : dessinés autour de (0, 0) = milieu du bas. [dessin, échelle]
const BATIMENTS = {
  // l'école, la tour et l'hôpital gardent leurs anciennes coordonnées, recentrées
  calcul: [`<g transform="translate(-235 -340)"><rect x="150" y="235" width="170" height="105" rx="6" fill="#ef8f6e"/>
    <path d="M138 240 L235 180 L332 240Z" fill="#b8473a"/>
    <rect x="222" y="148" width="26" height="40" fill="#ef8f6e"/><path d="M216 150 L235 128 L254 150Z" fill="#b8473a"/>
    <circle cx="235" cy="170" r="7" fill="#f2c230"/>
    <line x1="235" y1="128" x2="235" y2="100" stroke="#555" stroke-width="3"/><path d="M235 100 L262 108 L235 116Z" fill="#4a90d9"/>
    ${fenetre(170, 258, 26, 26)}${fenetre(280, 258, 26, 26)}
    <rect x="218" y="290" width="34" height="50" rx="4" fill="#7a4a30"/>
    <text x="235" y="230" font-size="22" text-anchor="middle" fill="#fff" font-weight="700">1+2</text></g>`, 0.8],
  heure: [`<g transform="translate(-572 -340)"><rect x="535" y="135" width="74" height="205" rx="4" fill="#d9c7a8"/>
    <path d="M525 140 L572 70 L619 140Z" fill="#6a5acd"/><circle cx="572" cy="66" r="6" fill="#f2c230"/>
    <circle cx="572" cy="185" r="28" fill="#fff" stroke="#6a5acd" stroke-width="5"/>
    <line x1="572" y1="185" x2="572" y2="166" stroke="#333" stroke-width="4" stroke-linecap="round"/>
    <line x1="572" y1="185" x2="586" y2="191" stroke="#333" stroke-width="5" stroke-linecap="round"/>
    <rect x="560" y="240" width="24" height="30" rx="12" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <rect x="556" y="292" width="32" height="48" rx="16" fill="#7a4a30"/></g>`, 0.85],
  corps: [`<g transform="translate(-560 -660)"><rect x="470" y="560" width="180" height="100" rx="6" fill="#fafafa" stroke="#dfe6ee" stroke-width="3"/>
    <rect x="462" y="550" width="196" height="16" rx="6" fill="#e05252"/>
    <rect x="540" y="507" width="40" height="40" rx="8" fill="#fff" stroke="#e05252" stroke-width="3"/>
    <rect x="555" y="513" width="10" height="28" fill="#e05252"/><rect x="546" y="522" width="28" height="10" fill="#e05252"/>
    ${[488, 616].map((x) => `<rect x="${x}" y="583" width="26" height="26" rx="3" fill="#bfe6ff" stroke="#9cc" stroke-width="2"/>`).join('')}
    <rect x="540" y="610" width="40" height="50" rx="4" fill="#7fb8e0"/></g>`, 0.7],
  syllabes: [`<rect x="-80" y="-4" width="160" height="6" fill="#cbbb9a"/>
    <rect x="-72" y="-92" width="144" height="90" rx="4" fill="#efe3c8"/>
    ${[-60, -36, 26, 50].map((x) => `<rect x="${x}" y="-86" width="10" height="80" fill="#fffaf0" stroke="#d8c9a8" stroke-width="2"/>`).join('')}
    <rect x="-80" y="-98" width="160" height="10" rx="3" fill="#d4c3a3"/><path d="M-84 -96 L0 -134 L84 -96Z" fill="#8e6ad8"/>
    <path d="M-18 -110 Q-9 -117 0 -110 Q9 -117 18 -110 V-100 Q9 -106 0 -100 Q-9 -106 -18 -100Z" fill="#fff" stroke="#5a3a90" stroke-width="2"/>
    <rect x="-15" y="-50" width="30" height="50" rx="15" fill="#7a4a30"/>`, 1],
  espace: [`<rect x="-58" y="-62" width="116" height="62" rx="4" fill="#e8ebf2"/>
    <path d="M-62 -62 A62 62 0 0 1 62 -62Z" fill="#5b6bb8"/><path d="M-9 -122 H9 L11 -64 H-11Z" fill="#2b3566"/>
    <rect x="-2" y="-150" width="14" height="46" rx="4" fill="#9aa3ad" transform="rotate(35 5 -110)"/>
    <path d="M-52 -118 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z M54 -132 l2 5 5 1 -4 3 1 5 -4 -2 -4 2 1 -5 -4 -3 5 -1z" fill="#ffd84a"/>
    ${fenetre(-48, -46, 18, 18)}${fenetre(30, -46, 18, 18)}<rect x="-12" y="-36" width="24" height="36" rx="12" fill="#7a4a30"/>`, 0.82],
  cuisine: [`<rect x="-70" y="-96" width="140" height="96" rx="6" fill="#fff1d6"/>
    <rect x="-76" y="-108" width="152" height="16" rx="5" fill="#c0392b"/>${auvent(-72, 72, -92, '#e05252', '#fff')}
    <g stroke="#cfcfd8" stroke-width="2" fill="#fff"><rect x="-14" y="-126" width="28" height="12" rx="2"/><circle cx="-10" cy="-130" r="10"/><circle cx="10" cy="-130" r="10"/><circle cx="0" cy="-137" r="12"/></g>
    <rect x="-58" y="-62" width="58" height="44" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <circle cx="-29" cy="-40" r="13" fill="#fff" stroke="#ddd" stroke-width="2"/><circle cx="-29" cy="-40" r="7" fill="#f2c27a"/>
    <path d="M-50 -52 V-30 M-8 -52 V-30" stroke="#9aa3ad" stroke-width="3" stroke-linecap="round"/>
    <rect x="16" y="-56" width="34" height="56" rx="4" fill="#7a4a30"/>`, 0.85],
  coiffeur: [`<rect x="-58" y="-96" width="116" height="96" rx="6" fill="#d9c2f5"/>
    <rect x="-64" y="-108" width="128" height="16" rx="5" fill="#9b6ad8"/>${auvent(-60, 60, -92, '#ff7aa8', '#fff')}
    <rect x="-46" y="-62" width="50" height="40" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <text x="-21" y="-30" font-size="30" text-anchor="middle">✂️</text>
    <rect x="14" y="-50" width="30" height="50" rx="4" fill="#7a4a30"/>
    <g transform="translate(70 -10)"><rect x="-7" y="-60" width="14" height="60" rx="7" fill="#fff" stroke="#bbb" stroke-width="2"/>
    ${[-54, -40, -26, -12].map((y) => `<path d="M-7 ${y} l14 -8 v6 l-14 8z" fill="#e03a3a"/>`).join('')}<circle cy="-64" r="7" fill="#4a90d9"/></g>`, 1],
  mode: [`<rect x="-58" y="-100" width="116" height="100" rx="6" fill="#ffd1e3"/>
    <rect x="-64" y="-112" width="128" height="16" rx="5" fill="#e0457b"/>${auvent(-60, 60, -96, '#2bb3a0', '#fff')}
    <rect x="-48" y="-66" width="56" height="48" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <text x="-34" y="-28" font-size="26" text-anchor="middle">👗</text><text x="-6" y="-30" font-size="20" text-anchor="middle">💍</text>
    <rect x="16" y="-52" width="30" height="52" rx="4" fill="#7a4a30"/>`, 1],
  meubles: [`<rect x="-76" y="-96" width="152" height="96" rx="6" fill="#f3d9a4"/>
    <path d="M-86 -92 L0 -132 L86 -92Z" fill="#9a6334"/>
    <rect x="-64" y="-72" width="78" height="54" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <text x="-25" y="-28" font-size="38" text-anchor="middle">🛋️</text>
    <rect x="28" y="-56" width="34" height="56" rx="4" fill="#7a4a30"/><text x="0" y="-100" font-size="20" text-anchor="middle">🧸</text>`, 1],
  refuge: [`<rect x="-66" y="-84" width="132" height="84" rx="6" fill="#c98b4f"/>
    ${[-70, -56, -42, -28, -14].map((y) => `<line x1="-66" y1="${y}" x2="66" y2="${y}" stroke="#a8703c" stroke-width="2"/>`).join('')}
    <path d="M-76 -80 L0 -122 L76 -80Z" fill="#5cb85c"/>
    <circle cy="-98" r="14" fill="#fff"/><text y="-91" font-size="18" text-anchor="middle">🐾</text>
    <rect x="-52" y="-62" width="44" height="36" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <text x="-30" y="-32" font-size="26" text-anchor="middle">🐶</text>
    <rect x="12" y="-50" width="32" height="50" rx="16" fill="#7a4a30"/>
    <text x="84" y="-2" font-size="30" text-anchor="middle">🐱</text>`, 1],
};

const maison = (x, y, toit, mur) => `<g transform="translate(${x} ${y})">
  <rect x="-38" y="-40" width="76" height="58" rx="4" fill="${mur}"/>
  <path d="M-48 -36 L0 -78 L48 -36Z" fill="${toit}"/>
  <rect x="-10" y="-10" width="20" height="28" rx="3" fill="#7a4a30"/>
  <rect x="-30" y="-28" width="16" height="16" rx="2" fill="#bfe6ff"/><rect x="14" y="-28" width="16" height="16" rx="2" fill="#bfe6ff"/></g>`;
const COULEURS_MAISONS = [['#e86fa8', '#fff1f6'], ['#6a8fe0', '#eef3ff'], ['#3fb27f', '#ecfbf3'], ['#f0a030', '#fff6e6']];

function lieu(l) {
  const [dessin, s] = l.dessin ?? BATIMENTS[l.id];
  const nom = l.nom.replace('\n', ' ');
  return `<g class="lieu${l.ouvert ? '' : ' ferme'}" role="button" tabindex="0" data-lieu="${l.id}"
    aria-label="${echapper(`${nom} : ${l.detail}${l.ouvert ? '' : ', bientôt'}`)}">
    <title>${echapper(nom)}</title><g transform="translate(${l.x} ${l.y}) scale(${s})">${dessin}</g>
    ${etiquette(l.x, l.y + 30, l.nom, 28, 230)}${l.ouvert ? '' : bientot(l.x, l.y - 40)}</g>`;
}

// Le lieu de croyance choisi par les parents, au milieu du village (rien si aucun choix)
export function lieuCroyance(famille) {
  if (!famille) return null;
  return { id: 'croyance', type: 'jeu', nom: CROYANCES[famille].lieu, detail: 'croyances et cultures', ouvert: true, x: 400, y: 440, dessin: [batiment(famille), 0.62] };
}

// Place pour 4 maisons au village, entre la boutique et l'hôpital : [écart entre maisons, taille]
const RANGEE = { 1: [0, 1], 2: [160, 1], 3: [108, 0.8], 4: [84, 0.68] };

// profils : les enfants ; joueuse : celle qui joue (seule sa maison s'ouvre) ; famille : la croyance choisie par les parents
// Plus de 4 enfants : on montre la maison de la joueuse et 3 autres.
export function dessinerIle(profils, joueuse, famille = null) {
  const lieux = [...LIEUX, lieuCroyance(famille)].filter(Boolean);
  const visibles = profils.length <= 4 ? profils : [joueuse, ...profils.filter((p) => p.id !== joueuse.id).slice(0, 3)];
  const [ecart, taille] = RANGEE[visibles.length] ?? [0, 1];
  const maisons = visibles.map((p, i) => {
    const x = 400 + (i - (visibles.length - 1) / 2) * ecart, y = 560, [toit, mur] = COULEURS_MAISONS[profils.indexOf(p) % COULEURS_MAISONS.length];
    const tete = dessinerAvatar(p.avatar, 'tete').replace('<svg ', `<svg x="${x - 24}" y="${y - 30}" width="48" height="48" `); // à sa porte
    const aElle = p.id === joueuse.id;
    return `<g class="lieu maison${aElle ? '' : ' autre'}" ${aElle ? `role="button" tabindex="0" data-lieu="maison" aria-label="${echapper(`Ma maison (${p.prenom})`)}"` : 'aria-hidden="true"'}>
      <g transform="translate(${x} ${y}) scale(${taille}) translate(${-x} ${-y})">${maison(x, y, toit, mur)}${tete}</g>${etiquette(x, y + 46 * taille, aElle ? 'Ma maison' : p.prenom, 26, Math.min(112, ecart - 12 || 112))}</g>`;
  }).join('');
  const [fx, fy] = [400, 640]; // la fontaine, au bout de la place du village
  const chemins = lieux.map((l) => `<path d="M${fx} ${fy} Q${(fx + l.x) / 2} ${(fy + l.y) / 2 + 20} ${l.x} ${l.y}"/>`).join('');

  return `<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg" class="carte-ile" role="group" aria-label="Carte de l'île">
  <defs>
    <linearGradient id="mer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fdcea"/><stop offset="1" stop-color="#2a9fc0"/></linearGradient>
  </defs>
  <rect width="800" height="900" fill="url(#mer)"/>
  <g class="vagues" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round">
    ${[[60, 70], [640, 40], [690, 850], [30, 700], [330, 870], [740, 330], [20, 330], [720, 560]].map(([x, y]) =>
      `<path d="M${x} ${y} q12 -10 24 0 t24 0 t24 0"/>`).join('')}
  </g>
  <g class="nuage" fill="#fff" opacity=".9"><ellipse cx="120" cy="60" rx="46" ry="18"/><ellipse cx="146" cy="48" rx="30" ry="18"/></g>
  <circle cx="735" cy="70" r="38" fill="#ffd84a"/><circle cx="735" cy="70" r="50" fill="#ffd84a" opacity=".3"/>
  <g class="bateau" transform="translate(62 872)"><path d="M-40 0 L40 0 L28 18 L-28 18Z" fill="#c0603a"/>
    <line x1="0" y1="0" x2="0" y2="-56" stroke="#5a3a20" stroke-width="4"/><path d="M2 -54 L36 -8 L2 -8Z" fill="#fff"/></g>
  <g transform="translate(745 760)"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#ff9a3c"/><path d="M14 0 L28 -9 L28 9Z" fill="#ff9a3c"/><circle cx="-7" cy="-2" r="2" fill="#333"/></g>

  <g transform="translate(400 450) scale(1.05 1.2) translate(-400 -420)">
  <path d="M400 112 C565 104 722 225 716 420 C710 612 560 732 400 726 C228 720 84 610 86 420 C88 228 240 120 400 112Z" fill="#fff" opacity=".6" transform="translate(400 420) scale(1.03) translate(-400 -420)"/>
  <path d="M400 112 C565 104 722 225 716 420 C710 612 560 732 400 726 C228 720 84 610 86 420 C88 228 240 120 400 112Z" fill="#f6dc9a"/>
  <path d="M400 165 C540 158 664 258 660 420 C656 580 536 676 400 672 C256 670 142 576 142 420 C142 262 262 170 400 165Z" fill="#8fd16a"/>
  <ellipse cx="290" cy="400" rx="60" ry="26" fill="#7cc35a"/><ellipse cx="520" cy="390" rx="56" ry="24" fill="#7cc35a"/>
  </g>

  <g stroke="#ecd59a" stroke-width="18" fill="none" stroke-linecap="round">${chemins}</g>
  <circle cx="${fx}" cy="${fy}" r="28" fill="#ecd59a"/><circle cx="${fx}" cy="${fy}" r="11" fill="#7fdcea" stroke="#b9b9c9" stroke-width="5"/>

  ${palmier(92, 420, 0.7)}${palmier(718, 400, 0.7)}${palmier(110, 740, 0.7)}${palmier(690, 745, 0.7)}${palmier(295, 215, 0.7)}${palmier(505, 210, 0.7)}
  ${famille ? '' : arbre(400, 445, 0.75)}${arbre(300, 430, 0.5)}${arbre(500, 430, 0.5)}
  ${fleurs([[330, 380, '#ff7aa8'], [470, 385, '#ffd84a'], [255, 640, '#b06ae0'], [545, 640, '#ff7aa8'], [320, 710, '#ffd84a'], [705, 480, '#b06ae0'], [95, 480, '#ffd84a']])}

  ${lieux.map(lieu).join('')}
  ${maisons}
</svg>`;
}

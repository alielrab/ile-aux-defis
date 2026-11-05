// Les cartes en SVG : l'archipel (les îles reliées par le bateau) et chaque île avec ses lieux.
// Les îles (noms, prix, positions) sont dans js/archipel.js.
import { dessinerAvatar } from './avatar.js';
import { CROYANCES, batiment } from './croyances.js';
import { ILES, EMPLACEMENTS_LIBRES, ile, ileOuverte, prixIle } from './archipel.js';

const echapper = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Les lieux de l'archipel. ile : l'île où il se trouve (voir js/archipel.js). type : jeu ou magasin.
// ouvert : false = un badge « Bientôt ». x, y : bas du bâtiment, sur la carte de son île.
export const LIEUX = [
  // L'île du village : les maisons, les magasins, le marché et le chantier
  { id: 'coiffeur', ile: 'village', type: 'magasin', nom: 'Le coiffeur', detail: 'coiffures et couleurs', ouvert: true, x: 190, y: 300 },
  { id: 'mode', ile: 'village', type: 'magasin', nom: 'La boutique', detail: 'vêtements et bijoux', ouvert: true, x: 400, y: 285 },
  { id: 'meubles', ile: 'village', type: 'magasin', nom: 'Le magasin\nde meubles', detail: 'meubles, jouets, murs et pièces', ouvert: true, x: 610, y: 300 },
  { id: 'marche', ile: 'village', type: 'jeu', nom: 'Le marché', detail: 'payer en francs suisses', ouvert: true, x: 190, y: 480 },
  { id: 'refuge', ile: 'village', type: 'magasin', nom: 'Le refuge', detail: 'animaux à adopter', ouvert: true, x: 610, y: 480 },
  { id: 'chantier', ile: 'village', type: 'jeu', nom: 'Le chantier', detail: 'construire', ouvert: false, x: 400, y: 800 },
  // L'île du savoir
  { id: 'calcul', ile: 'savoir', type: 'jeu', nom: "L'école", detail: 'Calcul', ouvert: true, x: 200, y: 330 },
  { id: 'heure', ile: 'savoir', type: 'jeu', nom: "La tour\nde l'horloge", detail: "lire l'heure", ouvert: true, x: 600, y: 330 },
  { id: 'syllabes', ile: 'savoir', type: 'jeu', nom: 'La bibliothèque', detail: 'la chasse aux syllabes', ouvert: true, x: 200, y: 590 },
  { id: 'espace', ile: 'savoir', type: 'jeu', nom: "L'observatoire", detail: 'le système solaire', ouvert: true, x: 600, y: 590 },
  { id: 'corps', ile: 'savoir', type: 'jeu', nom: "L'hôpital", detail: 'le corps humain', ouvert: true, x: 400, y: 780 },
  // L'île des créateurs
  { id: 'cuisine', ile: 'createurs', type: 'jeu', nom: 'Le\nrestaurant', detail: 'la cuisine de l’île', ouvert: true, x: 230, y: 400 },
  { id: 'peinture', ile: 'createurs', type: 'jeu', nom: "L'atelier\nde peinture", detail: 'colorier et peindre', ouvert: true, x: 570, y: 400 },
  { id: 'bd', ile: 'createurs', type: 'jeu', nom: "L'atelier BD", detail: 'inventer des bandes dessinées', ouvert: false, x: 230, y: 680 },
  { id: 'musique', ile: 'createurs', type: 'jeu', nom: 'La salle\nde musique', detail: 'composer des mélodies', ouvert: false, x: 570, y: 680 },
  // L'île du cœur (le lieu de culte s'ajoute quand les parents l'ont choisi : voir lieuCroyance)
  { id: 'confiance', ile: 'coeur', type: 'jeu', nom: 'La maison\nde la confiance', detail: 'mes droits et ma sécurité', ouvert: false, x: 230, y: 420 },
  { id: 'emotions', ile: 'coeur', type: 'jeu', nom: 'La météo\ndes émotions', detail: 'reconnaître ses émotions', ouvert: true, x: 570, y: 420 },
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
  marche: [`<rect x="-62" y="-64" width="124" height="64" rx="4" fill="#c98b4f"/>
    <rect x="-70" y="-30" width="140" height="12" rx="3" fill="#9a6334"/>
    <rect x="-66" y="-112" width="6" height="84" fill="#7a4a28"/><rect x="60" y="-112" width="6" height="84" fill="#7a4a28"/>
    <rect x="-72" y="-120" width="144" height="12" rx="4" fill="#1f8a7a"/>${auvent(-70, 70, -108, '#2bb3a0', '#fff')}
    <circle cx="-44" cy="-38" r="9" fill="#e74c3c"/><circle cx="-28" cy="-40" r="9" fill="#f39c12"/><circle cx="-12" cy="-38" r="9" fill="#2ecc71"/>
    <circle cx="10" cy="-39" r="9" fill="#e74c3c"/><circle cx="26" cy="-38" r="9" fill="#f1c40f"/>
    <rect x="34" y="-68" width="30" height="20" rx="3" fill="#fff" stroke="#2b2b3a" stroke-width="2" transform="rotate(-8 49 -58)"/>
    <text x="49" y="-53" font-size="11" font-weight="800" text-anchor="middle" fill="#2b2b3a" transform="rotate(-8 49 -58)">CHF</text>`, 0.8],
  // Les lieux « Bientôt » de l'archipel
  chantier: [`<rect x="-70" y="-36" width="140" height="36" fill="#e8d4a8"/>
    ${[-60, -36, -12, 12, 36, 60].map((x) => `<rect x="${x - 3}" y="-40" width="6" height="40" fill="#f0a030"/>`).join('')}
    <path d="M-70 -24 H70" stroke="#f0a030" stroke-width="5"/><path d="M-70 -24 H70" stroke="#2b2b3a" stroke-width="5" stroke-dasharray="10 10"/>
    <path d="M30 -40 V-150 M30 -150 H-60 M-50 -150 V-110" stroke="#f2c230" stroke-width="7" fill="none"/>
    <path d="M30 -150 L52 -128 M30 -128 L52 -150" stroke="#f2c230" stroke-width="3"/><rect x="-60" y="-110" width="22" height="16" fill="#c0603a"/>
    <path d="M-50 0 L-40 -22 L-30 0Z" fill="#f0602a"/>`, 0.72],
  peinture: [`<rect x="-62" y="-90" width="124" height="90" rx="6" fill="#fff4e0"/>
    <path d="M-70 -86 L0 -124 L70 -86Z" fill="#e86fa8"/>
    <rect x="-48" y="-66" width="50" height="40" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>
    <path d="M-42 -32 L-23 -62 L-4 -32" fill="none" stroke="#7a4a30" stroke-width="3"/>
    <ellipse cx="-23" cy="-50" rx="16" ry="11" fill="#f6e0b0" stroke="#c09050" stroke-width="2"/>
    ${[['#e74c3c', -31, -53], ['#3498db', -23, -47], ['#f1c40f', -15, -53]].map(([c, x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>`).join('')}
    <rect x="16" y="-52" width="30" height="52" rx="4" fill="#7a4a30"/>`, 0.95],
  bd: [`<rect x="-62" y="-86" width="124" height="86" rx="6" fill="#e3f0ff"/>
    <rect x="-68" y="-98" width="136" height="16" rx="5" fill="#4a90d9"/>
    <path d="M-40 -150 h80 a14 14 0 0 1 14 14 v20 a14 14 0 0 1 -14 14 h-50 l-14 14 v-14 h-16 a14 14 0 0 1 -14 -14 v-20 a14 14 0 0 1 14 -14Z" fill="#fff" stroke="#2b2b3a" stroke-width="3"/>
    <text x="0" y="-120" font-size="22" font-weight="800" text-anchor="middle" fill="#2b2b3a">BD !</text>
    ${[-50, -18].map((x) => `<rect x="${x}" y="-70" width="28" height="30" fill="#fff" stroke="#2b2b3a" stroke-width="2"/>`).join('')}
    <rect x="18" y="-52" width="30" height="52" rx="4" fill="#7a4a30"/>`, 0.95],
  musique: [`<rect x="-66" y="-80" width="132" height="80" rx="6" fill="#efe4ff"/>
    <path d="M-74 -76 Q0 -130 74 -76Z" fill="#8e6ad8"/>
    <path d="M-10 -100 V-136 L18 -142 V-108" stroke="#2b2b3a" stroke-width="4" fill="none"/><ellipse cx="-15" cy="-100" rx="8" ry="6" fill="#2b2b3a"/><ellipse cx="13" cy="-108" rx="8" ry="6" fill="#2b2b3a"/>
    ${[-54, -40, -26, -12, 2, 16].map((x, i) => `<rect x="${x}" y="-58" width="13" height="30" fill="#fff" stroke="#2b2b3a"/>${i % 3 !== 2 ? `<rect x="${x + 9}" y="-58" width="8" height="18" fill="#2b2b3a"/>` : ''}`).join('')}
    <rect x="34" y="-50" width="26" height="50" rx="4" fill="#7a4a30"/>`, 0.95],
  confiance: [`<rect x="-60" y="-84" width="120" height="84" rx="6" fill="#fff1f6"/>
    <path d="M-70 -80 L0 -124 L70 -80Z" fill="#e05a8a"/>
    <path d="M0 -52 C-24 -70 -36 -46 0 -26 C36 -46 24 -70 0 -52Z" fill="#e74c3c"/>
    <path d="M-20 0 V-22 A20 20 0 0 1 20 -22 V0Z" fill="#7a4a30"/>
    <circle cx="-44" cy="-50" r="9" fill="#bfe6ff" stroke="#fff" stroke-width="3"/><circle cx="44" cy="-50" r="9" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>`, 0.95],
  emotions: [`<rect x="-62" y="-80" width="124" height="80" rx="6" fill="#fffbe6"/>
    <rect x="-68" y="-92" width="136" height="16" rx="5" fill="#f2a654"/>
    <path d="M-60 -110 A60 50 0 0 1 60 -110" fill="none" stroke="#e74c3c" stroke-width="6"/><path d="M-50 -110 A50 40 0 0 1 50 -110" fill="none" stroke="#f1c40f" stroke-width="6"/><path d="M-40 -110 A40 30 0 0 1 40 -110" fill="none" stroke="#3498db" stroke-width="6"/>
    ${[[-36, '#ffd84a', 'M-42 -46 q6 6 12 0'], [0, '#7ad0f0', 'M-6 -42 q6 -6 12 0'], [36, '#ff9a7a', 'M30 -44 h12']].map(([x, c, b]) => `<circle cx="${x}" cy="-50" r="14" fill="${c}"/><circle cx="${x - 5}" cy="-54" r="2" fill="#2b2b3a"/><circle cx="${x + 5}" cy="-54" r="2" fill="#2b2b3a"/><path d="${b}" stroke="#2b2b3a" stroke-width="2" fill="none"/>`).join('')}
    <rect x="-12" y="-28" width="24" height="28" rx="4" fill="#7a4a30"/>`, 0.95],
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

// Le lieu de culte choisi par les parents, sur l'île du cœur (rien si aucun choix)
export function lieuCroyance(famille) {
  if (!famille) return null;
  return { id: 'croyance', ile: 'coeur', type: 'jeu', nom: CROYANCES[famille].lieu, detail: 'croyances et cultures', ouvert: true, x: 400, y: 720, dessin: [batiment(famille), 0.75] };
}

// Les lieux d'une île
export const lieuxDe = (ileId, famille = null) => [...LIEUX, lieuCroyance(famille)].filter((l) => l && l.ile === ileId);

// Place pour 4 maisons au village, entre le marché et le refuge : [écart entre maisons, taille]
const RANGEE = { 1: [0, 1], 2: [160, 1], 3: [108, 0.8], 4: [84, 0.68] };
const Y_MAISONS = 590;

// Les maisons des enfants (île du village). Plus de 4 enfants : la maison de la joueuse et 3 autres.
function maisons(profils, joueuse) {
  const visibles = profils.length <= 4 ? profils : [joueuse, ...profils.filter((p) => p.id !== joueuse.id).slice(0, 3)];
  const [ecart, taille] = RANGEE[visibles.length] ?? [0, 1];
  return visibles.map((p, i) => {
    const x = 400 + (i - (visibles.length - 1) / 2) * ecart, y = Y_MAISONS, [toit, mur] = COULEURS_MAISONS[profils.indexOf(p) % COULEURS_MAISONS.length];
    const tete = dessinerAvatar(p.avatar, 'tete').replace('<svg ', `<svg x="${x - 24}" y="${y - 30}" width="48" height="48" `); // à sa porte
    const aElle = p.id === joueuse.id;
    return `<g class="lieu maison${aElle ? '' : ' autre'}" ${aElle ? `role="button" tabindex="0" data-lieu="maison" aria-label="${echapper(`Ma maison (${p.prenom})`)}"` : 'aria-hidden="true"'}>
      <g transform="translate(${x} ${y}) scale(${taille}) translate(${-x} ${-y})">${maison(x, y, toit, mur)}${tete}</g>${etiquette(x, y + 46 * taille, aElle ? 'Ma maison' : p.prenom, 26, Math.min(112, ecart - 12 || 112))}</g>`;
  }).join('');
}

const MER = `<defs><linearGradient id="mer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fdcea"/><stop offset="1" stop-color="#2a9fc0"/></linearGradient></defs>
  <rect width="800" height="900" fill="url(#mer)"/>`;
const vagues = (pts) => `<g class="vagues" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round">
  ${pts.map(([x, y]) => `<path d="M${x} ${y} q12 -10 24 0 t24 0 t24 0"/>`).join('')}</g>`;
const FORME = 'M400 112 C565 104 722 225 716 420 C710 612 560 732 400 726 C228 720 84 610 86 420 C88 228 240 120 400 112Z';
const HERBE = 'M400 165 C540 158 664 258 660 420 C656 580 536 676 400 672 C256 670 142 576 142 420 C142 262 262 170 400 165Z';
const voilier = (s = 1) => `<g transform="scale(${s})"><path d="M-40 0 L40 0 L28 18 L-28 18Z" fill="#c0603a"/>
  <line x1="0" y1="0" x2="0" y2="-56" stroke="#5a3a20" stroke-width="4"/><path d="M2 -54 L36 -8 L2 -8Z" fill="#fff"/><path d="M-2 -50 L-26 -10 H-2Z" fill="#ffd84a"/></g>`;

// La carte d'une île. ileId : 'village', 'savoir'… ; profils : les enfants ; joueuse : celle qui joue ; famille : la croyance des parents
export function dessinerIle(ileId, profils, joueuse, famille = null) {
  const info = ile(ileId), lieux = lieuxDe(ileId, famille);
  const [fx, fy] = ileId === 'village' ? [400, 470] : [400, 520]; // la fontaine, au milieu des chemins
  const chemins = lieux.map((l) => `<path d="M${fx} ${fy} Q${(fx + l.x) / 2} ${(fy + l.y) / 2 + 20} ${l.x} ${l.y}"/>`).join('');
  return `<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg" class="carte-ile" role="group" aria-label="${echapper(info.nom)}">
  ${MER}${vagues([[60, 70], [640, 40], [690, 850], [30, 700], [330, 870], [740, 330], [20, 330], [720, 560]])}
  <g class="nuage" fill="#fff" opacity=".9"><ellipse cx="120" cy="60" rx="46" ry="18"/><ellipse cx="146" cy="48" rx="30" ry="18"/></g>
  <circle cx="735" cy="70" r="38" fill="#ffd84a"/><circle cx="735" cy="70" r="50" fill="#ffd84a" opacity=".3"/>
  <g transform="translate(745 760)"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#ff9a3c"/><path d="M14 0 L28 -9 L28 9Z" fill="#ff9a3c"/><circle cx="-7" cy="-2" r="2" fill="#333"/></g>
  <g transform="translate(400 450) scale(1.05 1.2) translate(-400 -420)">
  <path d="${FORME}" fill="#fff" opacity=".6" transform="translate(400 420) scale(1.03) translate(-400 -420)"/>
  <path d="${FORME}" fill="#f6dc9a"/><path d="${HERBE}" fill="${info.herbe}"/>
  </g>
  ${etiquette(400, 150, info.nom, 34)}
  <g stroke="#ecd59a" stroke-width="18" fill="none" stroke-linecap="round">${chemins}</g>
  <circle cx="${fx}" cy="${fy}" r="28" fill="#ecd59a"/><circle cx="${fx}" cy="${fy}" r="11" fill="#7fdcea" stroke="#b9b9c9" stroke-width="5"/>
  ${palmier(92, 420, 0.7)}${palmier(718, 400, 0.7)}${palmier(110, 740, 0.7)}${palmier(690, 745, 0.7)}
  ${fleurs([[330, 380, '#ff7aa8'], [470, 385, '#ffd84a'], [255, 640, '#b06ae0'], [545, 640, '#ff7aa8'], [705, 480, '#b06ae0'], [95, 480, '#ffd84a']])}
  ${lieux.map(lieu).join('')}
  ${ileId === 'village' ? maisons(profils, joueuse) : ''}${ileId === 'coeur' && !famille ? arbre(400, 720, 1.2) : ''}
  <g class="lieu port" role="button" tabindex="0" data-lieu="archipel" aria-label="Le bateau : aller vers une autre île">
    <title>Le bateau</title><g transform="translate(95 850)">${voilier(1.3)}</g>${etiquette(95, 890, "L'archipel", 24)}</g>
</svg>`;
}

// La carte de l'archipel : les îles en petit, reliées par le bateau. Une île fermée montre son prix.
// aConfirmer : l'île touchée une fois (on touche encore pour la débloquer)
export function dessinerArchipel(joueuse, aConfirmer = null) {
  const routes = ILES.filter((i) => i.id !== 'village').map((i) => {
    const v = ile('village');
    return `<path d="M${v.x} ${v.y} Q${(v.x + i.x) / 2 + 40} ${(v.y + i.y) / 2 - 30} ${i.x} ${i.y}"/>`;
  }).join('');
  const iles = ILES.map((i) => {
    const ouverte = ileOuverte(joueuse, i.id), prix = prixIle(i.id);
    const vitrine = i.vitrine.map((b, k) => {
      const x = (k - (i.vitrine.length - 1) / 2) * 70;
      const dessin = b === 'maison' ? maison(0, 0, '#e86fa8', '#fff1f6') : BATIMENTS[b][0];
      return `<g transform="translate(${x} 20) scale(${b === 'maison' ? 0.5 : 0.36})">${dessin}</g>`;
    }).join('');
    const ferme = ouverte ? '' : `<ellipse rx="150" ry="110" fill="#fff" opacity=".55"/>
      <g transform="translate(0 -14)"><rect x="-22" y="-6" width="44" height="34" rx="6" fill="#c9a227"/><path d="M-13 -6 V-18 A13 13 0 0 1 13 -18 V-6" fill="none" stroke="#c9a227" stroke-width="7"/></g>
      <g transform="translate(0 46)"><rect x="-58" y="-24" width="116" height="36" rx="18" fill="#fff" stroke="#c9a227" stroke-width="3"/>${etiquette(0, 4, `⭐ ${prix}`, 26)}</g>
      ${aConfirmer === i.id ? `<g transform="translate(0 -70)"><rect x="-110" y="-24" width="220" height="34" rx="12" fill="#ffd84a"/>${etiquette(0, 2, 'Touche encore !', 22)}</g>` : ''}`;
    const quoi = ouverte ? 'ouverte' : `fermée, ${prix} étoiles pour la débloquer`;
    return `<g class="ile${ouverte ? '' : ' fermee'}" role="button" tabindex="0" data-ile="${i.id}" aria-label="${echapper(`${i.nom} : ${quoi}`)}">
      <title>${echapper(i.nom)}</title><g transform="translate(${i.x} ${i.y})">
      <ellipse rx="158" ry="118" fill="#fff" opacity=".5"/><ellipse rx="150" ry="110" fill="#f6dc9a"/><ellipse rx="122" ry="86" fill="${i.herbe}"/>
      ${vitrine}${ferme}</g>${etiquette(i.x, i.y + 150, i.nom, 28)}</g>`;
  }).join('');
  const futures = EMPLACEMENTS_LIBRES.map(([x, y]) => `<g aria-hidden="true" opacity=".7"><ellipse cx="${x}" cy="${y}" rx="90" ry="50" fill="#fff" opacity=".5" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>
    ${etiquette(x, y + 8, 'Bientôt…', 22)}</g>`).join('');
  return `<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg" class="carte-ile archipel" role="group" aria-label="L'archipel">
  ${MER}${vagues([[60, 470], [690, 470], [330, 140], [120, 860], [620, 860], [740, 120], [30, 160]])}
  ${etiquette(400, 70, "L'archipel", 40)}
  <g stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="4 14" stroke-linecap="round" opacity=".85">${routes}</g>
  ${futures}${iles}
  <g transform="translate(400 300)" aria-hidden="true">${voilier(0.9)}</g>
</svg>`;
}

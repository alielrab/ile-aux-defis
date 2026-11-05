// Le lieu de croyance du village, choisi par les parents (espace parents) : son bâtiment, ses onglets et ses petites questions.
// Dessins des bâtiments : seulement des formes et des symboles. Les histoires illustrées sont dans js/recits.js.
import { CONTENUS } from './croyances-contenu.js';
import { melanger, etoilesDuJeu, parmiLesNouveaux } from './partie.js';

export { CONTENUS };
export const CROYANCES = {
  catholique: { nom: 'Christianisme catholique', contenu: 'catholique', lieu: "L'église" },
  protestant: { nom: 'Christianisme protestant', contenu: 'protestant', lieu: 'Le temple' },
  orthodoxe: { nom: 'Christianisme orthodoxe', contenu: 'orthodoxe', lieu: "L'église orthodoxe" },
  islam: { nom: 'Islam', contenu: 'islam', lieu: 'La mosquée' },
  judaisme: { nom: 'Judaïsme', contenu: 'judaisme', lieu: 'La synagogue' },
  bouddhisme: { nom: 'Bouddhisme', contenu: 'bouddhisme', lieu: 'Le temple bouddhiste' },
  hindouisme: { nom: 'Hindouisme', contenu: 'hindouisme', lieu: 'Le temple hindou' },
  autre: { nom: 'Autre croyance', contenu: 'sagesse', lieu: 'La maison des sages' },
  athee: { nom: 'Non croyant / athée', contenu: 'sagesse', lieu: 'La maison des sages' },
};
// Ce que les enfants peuvent découvrir dans l'onglet « Autres cultures » (choisi par les parents)
// Afficher les personnages religieux dessinés ? Par défaut non pour l'islam, où les prophètes (dont Noé, Abraham, Moïse, Jésus)
// ne sont pas représentés. Le parent peut changer ce réglage. Dieu, lui, n'est jamais dessiné.
export const illustrationsParDefaut = (famille) => famille !== 'islam';

export const RELIGIONS = ['catholique', 'protestant', 'orthodoxe', 'islam', 'judaisme', 'bouddhisme', 'hindouisme'];

export const etoilesParBonneReponse = (age) => etoilesDuJeu('croyance', age);

// Petites questions de l'onglet « Ma foi » (ou « Les grandes questions »). reglage : { age, croyance }
export function question({ age, croyance }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const petits = age <= 7;
  const banque = CONTENUS[CROYANCES[croyance].contenu].questions.filter((q) => !petits || !q[4]);
  const [texte, bonne, autres, savaisTu] = parmiLesNouveaux(banque, (q) => q[0], vus, aleatoire);
  const choix = melanger([bonne, ...melanger(autres, aleatoire).slice(0, petits ? 2 : 3)], aleatoire);
  return { mode: 'choix', texte, titre: texte, consigne: texte, reponse: bonne, choix, solution: `La bonne réponse : ${bonne}.`, savaisTu };
}

// Les bâtiments, dessinés autour de (0, 0) = milieu du bas (comme ceux de js/carte.js)
const porte = '<path d="M-11 0 V-22 A11 11 0 0 1 11 -22 V0Z" fill="#7a4a30"/>';
const vitraux = (c) => `<path d="M-38 -26 V-42 A6 6 0 0 1 -26 -42 V-26Z M26 -26 V-42 A6 6 0 0 1 38 -42 V-26Z" fill="${c}" stroke="#fff" stroke-width="2"/>`;
const eglise = (mur, toit, croix) => `<rect x="-48" y="-66" width="96" height="66" rx="3" fill="${mur}"/>
  <path d="M-56 -62 L0 -96 L56 -62Z" fill="${toit}"/>
  <rect x="-14" y="-132" width="28" height="56" fill="${mur}"/><path d="M-20 -130 L0 -160 L20 -130Z" fill="${toit}"/>
  <circle cx="0" cy="-106" r="7" fill="#bfe6ff" stroke="#fff" stroke-width="2"/>${croix}${vitraux('#9fd0f5')}${porte}`;
const CROIX = '<rect x="-2" y="-182" width="4" height="24" fill="#c9a227"/><rect x="-9" y="-176" width="18" height="4" fill="#c9a227"/>';

export const BATIMENTS = {
  catholique: eglise('#f4ead8', '#9b4a3a', CROIX),
  protestant: eglise('#ffffff', '#5a6b7a', CROIX.replaceAll('#c9a227', '#4a4a4a')),
  orthodoxe: `<rect x="-48" y="-62" width="96" height="62" rx="3" fill="#fbf3e4"/>
    <rect x="-14" y="-92" width="28" height="32" fill="#fbf3e4"/>
    <path d="M-17 -90 Q-20 -114 0 -128 Q20 -114 17 -90Z" fill="#2f6fd0"/>
    ${[-36, 36].map((x) => `<rect x="${x - 7}" y="-80" width="14" height="18" fill="#fbf3e4"/><path d="M${x - 9} -78 Q${x - 11} -94 ${x} -102 Q${x + 11} -94 ${x + 9} -78Z" fill="#e0b13a"/>`).join('')}
    <g stroke="#c9a227" stroke-width="3" stroke-linecap="round"><path d="M0 -128 V-152 M-5 -147 H5 M-9 -141 H9 M-6 -132 L6 -136"/></g>
    ${vitraux('#f2c230')}${porte}`,
  islam: `<rect x="-50" y="-58" width="88" height="58" rx="3" fill="#f6f0e2"/>
    <path d="M-40 -58 A34 34 0 0 1 28 -58Z" fill="#2bb3a0"/><path d="M-6 -92 V-104" stroke="#c9a227" stroke-width="3"/>
    <path d="M-6 -118 a8 8 0 1 0 7 12 a6 6 0 1 1 -7 -12Z" fill="#c9a227"/>
    <rect x="44" y="-136" width="14" height="136" fill="#f6f0e2" stroke="#e2d6bd" stroke-width="2"/><rect x="40" y="-104" width="22" height="6" rx="2" fill="#2bb3a0"/>
    <path d="M42 -136 L51 -156 L60 -136Z" fill="#2bb3a0"/>
    <path d="M-34 -24 V-38 A6 6 0 0 1 -22 -38 V-24Z M10 -24 V-38 A6 6 0 0 1 22 -38 V-24Z" fill="#9fd0f5" stroke="#fff" stroke-width="2"/>
    <path d="M-17 0 V-22 A11 11 0 0 1 5 -22 V0Z" fill="#7a4a30"/>`,
  judaisme: `<rect x="-52" y="-74" width="104" height="74" rx="4" fill="#efe6d2"/>
    <path d="M-58 -72 Q0 -112 58 -72Z" fill="#6a8fbf"/>
    <path d="M0 -102 L12 -81 H-12Z M0 -74 L12 -95 H-12Z" fill="none" stroke="#2f5fa8" stroke-width="3" stroke-linejoin="round"/>
    ${[-36, -18, 18, 36].map((x) => `<path d="M${x - 5} -28 V-48 A5 5 0 0 1 ${x + 5} -48 V-28Z" fill="#9fd0f5" stroke="#fff" stroke-width="2"/>`).join('')}${porte}`,
  bouddhisme: `<rect x="-36" y="-50" width="72" height="50" fill="#f8e6c4"/>
    <path d="M-56 -48 Q-30 -56 0 -58 Q30 -56 56 -48 L44 -60 H-44Z" fill="#c0392b"/>
    <rect x="-26" y="-88" width="52" height="30" fill="#f8e6c4"/>
    <path d="M-44 -86 Q-22 -92 0 -94 Q22 -92 44 -86 L34 -96 H-34Z" fill="#c0392b"/>
    <rect x="-16" y="-118" width="32" height="24" fill="#f8e6c4"/>
    <path d="M-30 -116 Q0 -124 30 -116 L20 -128 H-20Z" fill="#c0392b"/><path d="M0 -128 V-146" stroke="#c9a227" stroke-width="3"/>
    <g transform="translate(0 -74)" stroke="#c9a227" stroke-width="2" fill="none"><circle r="9"/>${[0, 45, 90, 135].map((a) => `<line x1="-9" x2="9" transform="rotate(${a})"/>`).join('')}</g>
    ${porte}`,
  hindouisme: `<rect x="-46" y="-50" width="92" height="50" rx="3" fill="#f6dfc0"/>
    <path d="M-26 -48 Q-26 -110 0 -142 Q26 -110 26 -48Z" fill="#e8873a"/>
    ${[-64, -82, -100, -118].map((y) => `<path d="M${-22 + (y + 64) / 6} ${y} H${22 - (y + 64) / 6}" stroke="#c46a22" stroke-width="3"/>`).join('')}
    <path d="M0 -142 V-162" stroke="#7a4a28" stroke-width="2"/><path d="M0 -162 L16 -156 L0 -150Z" fill="#ff9933"/>
    <rect x="-56" y="-56" width="112" height="8" rx="3" fill="#c46a22"/>${porte}`,
  sagesse: `<rect x="-50" y="-70" width="100" height="70" rx="4" fill="#e7f0e3"/>
    <path d="M-60 -66 L0 -108 L60 -66Z" fill="#4f8a5b"/>
    <path d="M-20 -46 Q-10 -54 0 -46 Q10 -54 20 -46 V-30 Q10 -38 0 -30 Q-10 -38 -20 -30Z" fill="#fff" stroke="#3a6a45" stroke-width="2"/>
    <g transform="translate(0 -84)"><circle r="9" fill="#b98a58"/><circle cx="-4" cy="-1" r="3" fill="#fff"/><circle cx="4" cy="-1" r="3" fill="#fff"/><circle cx="-4" cy="-1" r="1.4" fill="#2b2b3a"/><circle cx="4" cy="-1" r="1.4" fill="#2b2b3a"/><path d="M-2 3 L0 6 L2 3Z" fill="#f2a654"/></g>
    ${porte}`,
};
export const batiment = (cle) => BATIMENTS[cle] ?? BATIMENTS[CROYANCES[cle].contenu];

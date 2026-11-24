// Les pièces de la maison en SVG (vue de face, 800 × 520), et les aperçus des objets des magasins.
import { dessinerAvatar, CHEVEUX, teinte } from './avatar.js';
import { MEUBLES, JOUETS, USTENSILES, COULEURS_LIT, ANIMAUX, HABITS_ANIMAUX, ACCESSOIRES_ANIMAUX } from './catalogue.js';
import { dessinerOeuvre } from './jeux/peinture.js';

const PIECE_DE = Object.fromEntries(Object.entries({ ...MEUBLES, ...JOUETS, ...USTENSILES }).map(([cle, o]) => [cle, o.piece]));

// Une image du nouveau style, si elle a été préparée (images/liste.js, voir images/PLAN.md) ; sinon null : on garde le dessin.
export const image = (chemin) => ((globalThis.IMAGES ?? []).includes(`images/${chemin}.webp`) ? `images/${chemin}.webp` : null);

const N = '#2b2b3a'; // yeux, nez, roues
const ombre = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="4" fill="#000" opacity=".12"/>`;
// Un cheval du manège, tourné vers la droite (s = 1) ou la gauche (s = -1)
const cheval = (x, y, c, s) => `<line x1="${x}" y1="356" x2="${x}" y2="414" stroke="#d9b44a" stroke-width="3"/>
  <path d="M${x - 15 * s} ${y - 2} q${-7 * s} 4 ${-4 * s} 14" stroke="#7a4a28" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M${x - 9} ${y + 4} l-3 13 M${x + 9} ${y + 4} l3 13" stroke="${teinte(c, -0.15)}" stroke-width="4.5" stroke-linecap="round"/>
  <ellipse cx="${x}" cy="${y}" rx="16" ry="9" fill="${c}"/>
  <path d="M${x + 9 * s} ${y - 5} L${x + 15 * s} ${y - 20} L${x + 25 * s} ${y - 15} L${x + 17 * s} ${y - 1}Z" fill="${c}"/>
  <path d="M${x + 11 * s} ${y - 6} L${x + 14 * s} ${y - 19}" stroke="#7a4a28" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="${x + 19 * s}" cy="${y - 15}" r="1.8" fill="${N}"/>
  <path d="M${x - 6} ${y - 8} h12 v5 h-12z" fill="#e05252"/>`;

// Chaque objet a sa place fixe dans sa pièce. boite : le cadre de son aperçu dans les magasins.
const OBJETS = {
  // Chambre
  lit: { boite: '30 250 290 190', dessin: `
    <rect x="40" y="270" width="24" height="160" rx="6" fill="#9a6334"/>
    <rect x="50" y="340" width="260" height="60" rx="10" fill="#fff"/>
    <rect x="110" y="330" width="200" height="72" rx="12" fill="#f080b0"/>
    <rect x="70" y="318" width="60" height="30" rx="12" fill="#fdf3f7"/>
    <rect x="50" y="398" width="260" height="20" rx="4" fill="#9a6334"/>
    <rect x="296" y="330" width="16" height="100" rx="5" fill="#9a6334"/>` },
  bureau: { boite: '540 270 240 170', dessin: `
    <rect x="560" y="330" width="200" height="16" rx="4" fill="#c98b4f"/>
    <rect x="570" y="346" width="12" height="80" fill="#9a6334"/><rect x="738" y="346" width="12" height="80" fill="#9a6334"/>
    <rect x="690" y="346" width="60" height="50" rx="4" fill="#b07440"/><circle cx="720" cy="371" r="4" fill="#f2c230"/>
    <rect x="590" y="300" width="40" height="30" rx="3" fill="#4a90d9"/><rect x="640" y="310" width="34" height="20" rx="3" fill="#e05252"/>` },
  tapis: { boite: '270 420 300 80', dessin: `
    <ellipse cx="420" cy="460" rx="140" ry="30" fill="#6ac0d0"/><ellipse cx="420" cy="460" rx="105" ry="21" fill="#f5c542"/><ellipse cx="420" cy="460" rx="65" ry="12" fill="#f080b0"/>` },
  lampe: { boite: '560 0 120 140', dessin: `
    <line x1="620" y1="0" x2="620" y2="70" stroke="#555" stroke-width="3"/>
    <path d="M585 110 L600 70 L640 70 L655 110Z" fill="#f2c230"/><ellipse cx="620" cy="112" rx="14" ry="6" fill="#fff6c0"/>
    <path d="M590 114 L560 230 L680 230 L650 114Z" fill="#fff6c0" opacity=".35"/>` },
  etagere: { boite: '120 60 210 130', dessin: `
    <rect x="130" y="110" width="190" height="10" rx="2" fill="#9a6334"/><rect x="130" y="170" width="190" height="10" rx="2" fill="#9a6334"/>
    ${[['#e05252', 140, 26], ['#4a90d9', 160, 30], ['#5cb85c', 184, 22], ['#f2c230', 210, 28]].map(([c, x, h]) => `<rect x="${x}" y="${110 - h}" width="18" height="${h}" rx="2" fill="${c}"/>`).join('')}
    ${[['#8e6ad8', 150, 30], ['#f080b0', 172, 24], ['#2bb3a0', 260, 32], ['#e05252', 282, 26]].map(([c, x, h]) => `<rect x="${x}" y="${170 - h}" width="18" height="${h}" rx="2" fill="${c}"/>`).join('')}
    <circle cx="280" cy="94" r="14" fill="#f2c230"/>` },
  plante: { boite: '470 270 90 160', dessin: `
    <path d="M490 370 L540 370 L534 420 L496 420Z" fill="#e0805a"/>
    <path d="M515 370 Q470 330 488 290 Q505 330 515 370Z M515 370 Q560 330 545 285 Q525 330 515 370Z M515 370 Q515 310 515 280 Q530 320 515 370Z" fill="#3e9a48"/>` },
  ballon: { boite: '505 448 60 60', dessin: `${ombre(535, 501, 20)}
    <circle cx="535" cy="477" r="23" fill="#fff" stroke="${N}" stroke-width="2.5"/>
    <path d="M535 467 L545 474 L541 486 L529 486 L525 474Z" fill="${N}"/>
    <path d="M535 467 V455 M545 474 L557 470 M541 486 L548 497 M529 486 L522 497 M525 474 L513 470" stroke="${N}" stroke-width="2"/>` },
  ours: { boite: '220 284 60 64', dessin: `
    <circle cx="234" cy="296" r="8" fill="#b9773e"/><circle cx="266" cy="296" r="8" fill="#b9773e"/>
    <circle cx="234" cy="296" r="4" fill="#e7b483"/><circle cx="266" cy="296" r="4" fill="#e7b483"/>
    <ellipse cx="250" cy="327" rx="18" ry="17" fill="#b9773e"/><ellipse cx="250" cy="331" rx="10" ry="10" fill="#e7b483"/>
    <ellipse cx="232" cy="322" rx="6" ry="9" fill="#a8692f"/><ellipse cx="268" cy="322" rx="6" ry="9" fill="#a8692f"/>
    <ellipse cx="239" cy="342" rx="8" ry="5" fill="#a8692f"/><ellipse cx="261" cy="342" rx="8" ry="5" fill="#a8692f"/>
    <circle cx="250" cy="307" r="15" fill="#b9773e"/><ellipse cx="250" cy="312" rx="7" ry="5" fill="#e7b483"/>
    <circle cx="245" cy="303" r="2.2" fill="${N}"/><circle cx="255" cy="303" r="2.2" fill="${N}"/><ellipse cx="250" cy="310" rx="2.6" ry="2" fill="${N}"/>
    <path d="M242 319 L250 323 L258 319 L258 327 L250 323 L242 327Z" fill="#e05252"/>` },
  robot: { boite: '694 276 52 56', dessin: `
    <line x1="720" y1="283" x2="720" y2="292" stroke="#7a8597" stroke-width="2"/><circle cx="720" cy="282" r="3.5" fill="#e05252"/>
    <rect x="700" y="314" width="7" height="11" rx="3" fill="#a9b6c8"/><rect x="733" y="314" width="7" height="11" rx="3" fill="#a9b6c8"/>
    <rect x="711" y="325" width="7" height="5" fill="#5a6577"/><rect x="722" y="325" width="7" height="5" fill="#5a6577"/>
    <rect x="708" y="312" width="24" height="14" rx="3" fill="#8e9bb0"/><circle cx="720" cy="319" r="3" fill="#f2c230"/>
    <rect x="705" y="291" width="30" height="21" rx="5" fill="#a9b6c8"/>
    <circle cx="713" cy="300" r="3.8" fill="#6ac0d0"/><circle cx="727" cy="300" r="3.8" fill="#6ac0d0"/><rect x="713" y="306" width="14" height="2.5" rx="1" fill="#5a6577"/>` },
  // Salon
  bibliotheque: { boite: '30 140 160 260', dessin: `
    <rect x="40" y="150" width="140" height="240" rx="6" fill="#9a6334"/><rect x="50" y="160" width="120" height="220" fill="#7a4a28"/>
    ${[200, 260, 320].map((y) => `<rect x="50" y="${y}" width="120" height="8" fill="#9a6334"/>`).join('')}
    ${[[160, ['#e05252', '#4a90d9', '#f2c230', '#5cb85c', '#8e6ad8']], [220, ['#f080b0', '#2bb3a0', '#e05252', '#f2c230']], [280, ['#4a90d9', '#5cb85c', '#8e6ad8', '#e0805a', '#f080b0']], [340, ['#f2c230', '#e05252', '#2bb3a0']]]
      .map(([y, cs]) => cs.map((c, i) => `<rect x="${56 + i * 22}" y="${y + 8}" width="18" height="32" rx="2" fill="${c}"/>`).join('')).join('')}` },
  canape: { boite: '180 280 270 150', dessin: `
    <rect x="200" y="300" width="230" height="70" rx="22" fill="#5b84c4"/>
    <rect x="190" y="350" width="250" height="50" rx="16" fill="#6c96d6"/>
    <rect x="186" y="320" width="34" height="80" rx="14" fill="#4a72b0"/><rect x="410" y="320" width="34" height="80" rx="14" fill="#4a72b0"/>
    <rect x="230" y="320" width="50" height="36" rx="10" fill="#ffd257"/><rect x="350" y="320" width="50" height="36" rx="10" fill="#f080b0"/>
    <rect x="200" y="398" width="10" height="20" fill="#7a4a28"/><rect x="420" y="398" width="10" height="20" fill="#7a4a28"/>` },
  fauteuil: { boite: '600 300 150 140', dessin: `
    <rect x="620" y="320" width="110" height="60" rx="20" fill="#e0805a"/>
    <rect x="612" y="360" width="126" height="44" rx="14" fill="#ec9572"/>
    <rect x="606" y="340" width="26" height="64" rx="12" fill="#c96a46"/><rect x="718" y="340" width="26" height="64" rx="12" fill="#c96a46"/>
    <rect x="624" y="402" width="8" height="22" fill="#7a4a28"/><rect x="718" y="402" width="8" height="22" fill="#7a4a28"/>` },
  'table-basse': { boite: '320 420 210 70', dessin: `
    <rect x="330" y="432" width="190" height="14" rx="6" fill="#c98b4f"/>
    <rect x="345" y="446" width="10" height="34" fill="#9a6334"/><rect x="495" y="446" width="10" height="34" fill="#9a6334"/>
    <path d="M380 432 a14 8 0 0 1 28 0Z" fill="#fff"/><rect x="440" y="420" width="30" height="12" rx="3" fill="#4a90d9"/>` },
  tele: { boite: '590 190 180 140', dessin: `
    <rect x="600" y="200" width="160" height="100" rx="8" fill="#2b2b3a"/><rect x="610" y="210" width="140" height="80" rx="4" fill="#6ac0d0"/>
    <circle cx="650" cy="250" r="14" fill="#ffd84a"/><path d="M680 280 L700 245 L725 280Z" fill="#5cb85c"/>
    <rect x="672" y="300" width="16" height="16" fill="#555"/>` },
  lampadaire: { boite: '520 180 80 230', dessin: `
    <rect x="556" y="230" width="6" height="170" fill="#555"/><ellipse cx="559" cy="402" rx="24" ry="6" fill="#555"/>
    <path d="M532 236 L542 196 L576 196 L586 236Z" fill="#f2c230"/>` },
  // Salle de jeux
  'cerf-volant': { boite: '580 100 80 180', dessin: `
    <path d="M620 200 Q598 222 624 242 Q646 260 620 276" stroke="#555" stroke-width="2" fill="none"/>
    <path d="M612 216 l-8 -6 v12Z M628 248 l8 -6 v12Z" fill="#f080b0"/>
    <path d="M620 110 L652 150 L620 200 L588 150Z" fill="#e05252"/>
    <path d="M620 110 L652 150 H620Z" fill="#f2c230"/><path d="M588 150 H620 V200Z" fill="#4a90d9"/>
    <path d="M620 110 V200 M588 150 H652" stroke="#fff" stroke-width="2"/>` },
  toboggan: { boite: '60 260 230 190', dessin: `${ombre(175, 442, 105)}
    <rect x="214" y="388" width="8" height="52" fill="#3c78bd"/>
    <rect x="80" y="278" width="8" height="162" rx="3" fill="#4a90d9"/><rect x="120" y="278" width="8" height="162" rx="3" fill="#4a90d9"/>
    ${[306, 334, 362, 390, 418].map((y) => `<rect x="86" y="${y}" width="36" height="6" rx="2" fill="#4a90d9"/>`).join('')}
    <path d="M128 272 Q190 296 220 378 Q236 424 280 430 L280 444 Q226 442 208 390 Q182 318 128 290Z" fill="#e05252"/>
    <path d="M136 276 Q192 300 216 372" stroke="#f08080" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="74" y="268" width="62" height="12" rx="4" fill="#f2c230"/>` },
  manege: { boite: '584 290 132 146', dessin: `${ombre(650, 432, 58)}
    <rect x="594" y="414" width="112" height="16" rx="6" fill="#4a90d9"/><ellipse cx="650" cy="414" rx="56" ry="6" fill="#6ac0d0"/>
    ${cheval(618, 390, '#ffffff', 1)}${cheval(682, 382, '#f9c6da', -1)}
    <rect x="647" y="330" width="6" height="84" fill="#d9b44a"/>
    <path d="M588 352 L650 312 L712 352Z" fill="#e05252"/><path d="M650 312 L630 352 H650Z M650 312 L670 352 H690Z" fill="#fff"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<circle cx="${594 + i * 12.4}" cy="353" r="6.2" fill="${i % 2 ? '#fff' : '#f2c230'}"/>`).join('')}
    <path d="M650 312 V296" stroke="#555" stroke-width="2"/><path d="M650 296 L666 301 L650 306Z" fill="#f2c230"/>` },
  train: { boite: '508 410 104 96', dessin: `${ombre(560, 502, 46)}
    <circle cx="534" cy="426" r="6" fill="#fff" opacity=".85"/><circle cx="542" cy="414" r="8" fill="#fff" opacity=".7"/>
    <rect x="530" y="440" width="12" height="20" fill="${N}"/><rect x="527" y="436" width="18" height="6" rx="2" fill="${N}"/>
    <rect x="522" y="458" width="58" height="26" rx="10" fill="#4a90d9"/><circle cx="519" cy="471" r="5" fill="#f2c230"/>
    <rect x="576" y="442" width="30" height="42" rx="4" fill="#e05252"/><rect x="572" y="436" width="38" height="8" rx="3" fill="${N}"/>
    <rect x="583" y="450" width="16" height="12" rx="2" fill="#bfe6ff"/>
    <rect x="516" y="482" width="92" height="6" rx="2" fill="${N}"/>
    ${[532, 558, 592].map((x) => `<circle cx="${x}" cy="492" r="8" fill="${N}"/><circle cx="${x}" cy="492" r="3" fill="#aaa"/>`).join('')}` },
  // Le grenier (25 novembre 2026)
  lanterne: { boite: '470 0 60 112', dessin: `<path d="M500 0 V40" stroke="#555" stroke-width="3"/><rect x="482" y="40" width="36" height="52" rx="8" fill="#ffd84a" stroke="#7a4a28" stroke-width="4"/><rect x="478" y="36" width="44" height="8" rx="3" fill="#7a4a28"/><rect x="478" y="90" width="44" height="8" rx="3" fill="#7a4a28"/>` },
  'etagere-jeux': { boite: '40 60 170 120', dessin: `<rect x="40" y="60" width="170" height="120" rx="6" fill="#c98b4f"/><rect x="50" y="70" width="150" height="46" fill="#fbeedd"/><rect x="50" y="124" width="150" height="46" fill="#fbeedd"/>
    ${[[56, '#e05252'], [84, '#4a90d9'], [112, '#7ac943'], [140, '#f2c230'], [168, '#8e6ad8']].map(([x, c]) => `<rect x="${x}" y="84" width="24" height="32" fill="${c}"/><rect x="${x}" y="142" width="24" height="28" fill="${c}" opacity=".8"/>`).join('')}` },
  hamac: { boite: '540 110 240 100', dessin: `<path d="M548 120 Q660 240 772 120" fill="#f28c8c" stroke="#c0392b" stroke-width="4"/><path d="M548 120 Q660 200 772 120" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/><circle cx="548" cy="118" r="6" fill="#7a4a28"/><circle cx="772" cy="118" r="6" fill="#7a4a28"/>` },
  tipi: { boite: '30 200 220 250', dessin: `${ombre(140, 446, 104)}<path d="M140 206 L40 446 H240Z" fill="#fff4d6" stroke="#c98b4f" stroke-width="5" stroke-linejoin="round"/><path d="M140 300 L108 446 H172Z" fill="#7a4a28"/>
    <path d="M128 196 L152 226 M152 196 L128 226" stroke="#9a6334" stroke-width="5" stroke-linecap="round"/>${[[90, 380, '#e05252'], [190, 380, '#4a90d9'], [140, 262, '#f2c230']].map(([x, y, c]) => `<path d="M${x - 10} ${y} l10 -14 l10 14z" fill="${c}"/>`).join('')}` },
  telescope: { boite: '560 220 110 200', dessin: `${ombre(615, 416, 50)}<path d="M615 320 L585 414 M615 320 L645 414 M615 320 V414" stroke="#7a4a28" stroke-width="6" stroke-linecap="round"/>
    <path d="M572 300 L654 240" stroke="#3b5bb0" stroke-width="20" stroke-linecap="round"/><path d="M646 246 L662 234" stroke="#f2c230" stroke-width="24" stroke-linecap="round"/>` },
  malle: { boite: '40 440 150 72', dessin: `${ombre(115, 508, 72)}<rect x="46" y="466" width="138" height="42" rx="5" fill="#9a6334"/><path d="M46 468 Q115 428 184 468Z" fill="#7a4a28"/><rect x="106" y="460" width="18" height="16" rx="3" fill="#f2c230"/>
    <path d="M70 446 V508 M160 446 V508" stroke="#f2c230" stroke-width="5"/>` },
  'fauteuil-poire': { boite: '230 424 120 86', dessin: `${ombre(290, 506, 56)}<path d="M240 500 Q230 440 290 432 Q350 440 340 500 Q290 514 240 500Z" fill="#5cc08a" stroke="#3f9a6a" stroke-width="3"/><path d="M262 462 Q290 478 318 462" fill="none" stroke="#3f9a6a" stroke-width="3"/>` },
  'cheval-bascule': { boite: '600 400 150 110', dessin: `${ombre(675, 506, 70)}<path d="M612 500 Q675 520 738 500" fill="none" stroke="#c98b4f" stroke-width="8" stroke-linecap="round"/><path d="M640 496 V456 M706 496 V456" stroke="#9a6334" stroke-width="7"/>
    <ellipse cx="672" cy="448" rx="40" ry="18" fill="#e8c27a"/><path d="M700 444 L716 408 L736 420 L720 452Z" fill="#e8c27a"/><circle cx="724" cy="420" r="2.5" fill="${N}"/><path d="M704 440 L716 410" stroke="#7a4a28" stroke-width="6" stroke-linecap="round"/><rect x="660" y="430" width="24" height="10" fill="#e05252"/>` },
  // Ajouts du 24 novembre 2026 : sur les places restées libres
  'carte-monde': { boite: '510 70 160 100', dessin: `<rect x="510" y="70" width="160" height="100" rx="4" fill="#9a6334"/><rect x="516" y="76" width="148" height="88" fill="#9fdcf5"/>
    <path d="M532 100 q14 -14 30 -4 q8 10 -4 22 q-14 8 -22 -2z M580 92 q20 -10 40 2 q10 16 -6 30 q-12 6 -22 -6 q-14 -8 -12 -26z M630 126 q12 -4 18 8 q-6 12 -18 6z" fill="#7ac943"/>` },
  coucou: { boite: '640 50 90 110', dessin: `<path d="M650 96 L685 56 L720 96Z" fill="#9a6334"/><rect x="656" y="94" width="58" height="46" fill="#c98b4f"/><circle cx="685" cy="116" r="15" fill="#fff" stroke="#7a4a28" stroke-width="3"/>
    <path d="M685 116 V106 M685 116 L693 120" stroke="${N}" stroke-width="2.5" stroke-linecap="round"/><path d="M672 140 V158 M698 140 V152" stroke="#7a4a28" stroke-width="3"/><circle cx="672" cy="160" r="4" fill="#7a4a28"/><circle cx="698" cy="154" r="4" fill="#7a4a28"/>` },
  piano: { boite: '24 400 170 112', dessin: `${ombre(109, 508, 82)}<rect x="30" y="410" width="158" height="96" rx="6" fill="#7a4a28"/><rect x="26" y="452" width="166" height="20" rx="3" fill="#5a3418"/>
    <rect x="34" y="456" width="150" height="12" fill="#fff"/>${[44, 56, 80, 92, 104, 128, 140, 164].map((x) => `<rect x="${x}" y="456" width="6" height="7" fill="${N}"/>`).join('')}` },
  'panier-basket': { boite: '40 60 110 130', dessin: `<rect x="46" y="64" width="98" height="72" rx="6" fill="#fff" stroke="#e05252" stroke-width="5"/><rect x="76" y="92" width="38" height="30" fill="none" stroke="#e05252" stroke-width="4"/>
    <ellipse cx="95" cy="138" rx="26" ry="7" fill="none" stroke="#f28c28" stroke-width="5"/><path d="M71 140 L80 184 H110 L119 140 M83 142 L88 184 M95 144 V184 M107 142 L102 184" stroke="#fff" stroke-width="2.5" fill="none"/>` },
  circuit: { boite: '30 446 190 64', dessin: `<ellipse cx="125" cy="478" rx="90" ry="28" fill="none" stroke="#555" stroke-width="16"/><ellipse cx="125" cy="478" rx="90" ry="28" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="8 8"/>
    <rect x="60" y="452" width="26" height="14" rx="5" fill="#e05252"/><rect x="160" y="490" width="26" height="14" rx="5" fill="#4a90d9"/>` },
  'bac-a-sable': { boite: '356 448 180 64', dessin: `<rect x="360" y="462" width="172" height="46" rx="8" fill="#c98b4f"/><rect x="370" y="470" width="152" height="32" rx="6" fill="#f2dca0"/>
    <path d="M400 500 L414 474 L428 500Z" fill="#e8c27a"/><rect x="470" y="478" width="18" height="22" rx="3" fill="#e05252"/><path d="M440 498 l16 -22" stroke="#4a90d9" stroke-width="5" stroke-linecap="round"/>` },
  // Nouveaux meubles de la chambre
  horloge: { boite: '30 60 72 72', dessin: `<circle cx="66" cy="96" r="30" fill="#fff" stroke="#c98b4f" stroke-width="6"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<circle cx="${(66 + 22 * Math.cos((i * Math.PI) / 6)).toFixed(1)}" cy="${(96 + 22 * Math.sin((i * Math.PI) / 6)).toFixed(1)}" r="2" fill="${N}"/>`).join('')}
    <path d="M66 96 V78 M66 96 L80 102" stroke="${N}" stroke-width="3" stroke-linecap="round"/>` },
  coffre: { boite: '40 420 164 90', dessin: `${ombre(122, 504, 76)}
    <rect x="52" y="452" width="140" height="50" rx="6" fill="#c98b4f"/><rect x="48" y="440" width="148" height="16" rx="6" fill="#9a6334"/>
    <rect x="112" y="458" width="20" height="10" rx="3" fill="#f2c230"/>
    <circle cx="80" cy="436" r="10" fill="#e05252"/><rect x="150" y="424" width="22" height="18" rx="3" fill="#4a90d9"/>` },
  pouf: { boite: '644 452 112 58', dessin: `${ombre(700, 506, 46)}
    <path d="M654 474 Q654 504 700 504 Q746 504 746 474Z" fill="#8e6ad8"/><ellipse cx="700" cy="474" rx="46" ry="14" fill="#b08ae8"/>` },
  guirlande: { boite: '0 0 800 60', dessin: `<path d="M0 16 Q100 46 200 16 T400 16 T600 16 T800 16" stroke="#555" stroke-width="2" fill="none"/>
    ${[50, 150, 250, 350, 450, 550, 650, 750].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 34 : 30}" r="7" fill="${['#ffd84a', '#ff7aa8', '#7ad0f0', '#7ac943'][i % 4]}"/>`).join('')}` },
  // Nouveaux meubles du salon
  'tapis-salon': { boite: '180 432 400 76', dessin: `<ellipse cx="380" cy="472" rx="190" ry="32" fill="#e0805a"/><ellipse cx="380" cy="472" rx="150" ry="22" fill="#f2c27a"/>
    <ellipse cx="380" cy="472" rx="104" ry="13" fill="#e0805a"/>` },
  miroir: { boite: '494 52 82 108', dessin: `<ellipse cx="535" cy="106" rx="36" ry="50" fill="#d9b44a"/><ellipse cx="535" cy="106" rx="28" ry="42" fill="#cfeaf7"/>
    <path d="M520 80 L536 70 M516 96 L544 76" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>` },
  'plante-salon': { boite: '728 286 72 158', dessin: `<path d="M742 400 H790 L784 440 H748Z" fill="#c96a46"/>
    <path d="M766 400 Q730 350 744 300 Q762 350 766 400Z M766 400 Q800 352 790 296 Q772 350 766 400Z M766 400 Q760 340 768 288 Q778 340 766 400Z" fill="#3e9a48"/>` },
  // Nouveaux meubles et jouets de la salle de jeux
  'tableau-noir': { boite: '682 72 114 126', dessin: `<rect x="688" y="78" width="104" height="112" rx="4" fill="#9a6334"/><rect x="696" y="86" width="88" height="96" fill="#2f5a3a"/>
    <path d="M708 110 l10 -10 10 10 M738 100 h20 M712 150 q14 -18 28 0 t28 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  cubes: { boite: '294 394 54 60', dessin: `${[[300, 426, '#e05252', 'A'], [322, 426, '#4a90d9', 'B'], [311, 404, '#f2c230', 'C']].map(([x, y, c, l]) => `<rect x="${x}" y="${y}" width="22" height="22" rx="3" fill="${c}"/><text x="${x + 11}" y="${y + 17}" font-size="15" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">${l}</text>`).join('')}` },
  'piscine-balles': { boite: '624 440 172 76', dessin: `<rect x="632" y="456" width="158" height="52" rx="22" fill="#4a90d9"/>
    ${[650, 672, 694, 716, 738, 760, 662, 684, 706, 728, 750].map((x, i) => `<circle cx="${x}" cy="${i > 5 ? 452 : 462}" r="10" fill="${['#e05252', '#f2c230', '#5cb85c', '#f080b0', '#8e6ad8'][i % 5]}"/>`).join('')}
    <rect x="632" y="468" width="158" height="40" rx="18" fill="#6ac0d0"/>` },
  // Cuisine complète
  frigo: { boite: '722 144 78 294', dessin: `${ombre(761, 432, 34)}<rect x="728" y="150" width="66" height="282" rx="8" fill="#f4f6f8" stroke="#b9c0c9" stroke-width="3"/>
    <path d="M728 250 H794" stroke="#b9c0c9" stroke-width="3"/><rect x="736" y="200" width="6" height="36" rx="3" fill="#9aa3ad"/><rect x="736" y="262" width="6" height="60" rx="3" fill="#9aa3ad"/>
    <circle cx="772" cy="180" r="6" fill="#e05252"/><rect x="760" y="270" width="18" height="14" rx="2" fill="#ffd84a"/>` },
  evier: { boite: '228 252 92 56', dessin: `<rect x="238" y="290" width="72" height="9" rx="3" fill="#9aa3ad"/><rect x="244" y="292" width="60" height="5" rx="2" fill="#6a7684"/>
    <path d="M292 291 V266 Q292 258 282 258 H272 V266" stroke="#9aa3ad" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="300" cy="284" r="4" fill="#4a90d9"/>` },
  placard: { boite: '18 34 206 94', dessin: `<rect x="24" y="40" width="194" height="80" rx="6" fill="#f3d9a4" stroke="#c98b4f" stroke-width="3"/>
    <path d="M121 40 V120" stroke="#c98b4f" stroke-width="3"/><circle cx="110" cy="86" r="4" fill="#9a6334"/><circle cx="132" cy="86" r="4" fill="#9a6334"/>` },
  'etagere-cuisine': { boite: '486 100 86 118', dessin: `<rect x="490" y="150" width="78" height="7" rx="2" fill="#9a6334"/><rect x="490" y="206" width="78" height="7" rx="2" fill="#9a6334"/>
    ${[[498, 118, '#f2c230'], [522, 122, '#e05252'], [546, 116, '#7ac943'], [500, 176, '#c96a46'], [526, 172, '#f080b0'], [550, 178, '#4a90d9']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="16" height="${(y > 160 ? 206 : 150) - y}" rx="3" fill="${c}" opacity=".85"/><rect x="${x - 1}" y="${y - 4}" width="18" height="5" rx="2" fill="#9a6334"/>`).join('')}` },
  'lave-vaisselle': { boite: '220 306 96 96', dessin: `<rect x="226" y="312" width="84" height="84" rx="5" fill="#eef1f4" stroke="#b9c0c9" stroke-width="3"/>
    <rect x="232" y="318" width="72" height="12" rx="3" fill="#cfd5dc"/><circle cx="244" cy="324" r="3" fill="#5cb85c"/><circle cx="256" cy="324" r="3" fill="#9aa3ad"/>
    <rect x="250" y="338" width="36" height="5" rx="2.5" fill="#9aa3ad"/>` },
  chaises: { boite: '14 392 312 116', dessin: `${[[22, 1], [318, -1]].map(([x, s]) => `<rect x="${s > 0 ? x : x - 36}" y="452" width="36" height="8" rx="3" fill="#c98b4f"/>
    <rect x="${s > 0 ? x : x - 6}" y="400" width="6" height="104" rx="3" fill="#9a6334"/><rect x="${s > 0 ? x + 30 : x - 36}" y="456" width="6" height="48" rx="3" fill="#9a6334"/>`).join('')}` },
  'table-cuisine': { boite: '50 404 242 104', dessin: `${ombre(170, 504, 100)}<rect x="62" y="420" width="216" height="12" rx="4" fill="#c98b4f"/>
    <rect x="74" y="432" width="9" height="70" fill="#9a6334"/><rect x="257" y="432" width="9" height="70" fill="#9a6334"/>
    <rect x="62" y="412" width="216" height="10" rx="3" fill="#f6efe0"/><path d="M62 417 H278" stroke="#e05252" stroke-width="3" stroke-dasharray="10 10"/>` },
  // Cuisine (objets gagnés en faisant les recettes pour de vrai)
  poele: { boite: '50 236 140 60', dessin: `
    <rect x="56" y="282" width="120" height="10" rx="3" fill="#3a3f4a"/><circle cx="85" cy="287" r="3" fill="#e05252"/><circle cx="150" cy="287" r="3" fill="#e05252"/>
    <ellipse cx="100" cy="276" rx="34" ry="8" fill="#2b2b3a"/><ellipse cx="100" cy="274" rx="26" ry="5" fill="#f2c27a"/>
    <rect x="132" y="271" width="44" height="7" rx="3.5" fill="#7a4a28"/>
    <path d="M92 258 q4 -8 0 -14 M104 256 q4 -8 0 -14" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8" stroke-linecap="round"/>` },
  four: { boite: '560 240 170 200', dessin: `
    <rect x="570" y="250" width="150" height="180" rx="10" fill="#e8ebef" stroke="#b9c0c9" stroke-width="3"/>
    <rect x="580" y="262" width="130" height="26" rx="5" fill="#cfd5dc"/>${[598, 628, 658, 688].map((x) => `<circle cx="${x}" cy="275" r="7" fill="#3a3f4a"/>`).join('')}
    <rect x="585" y="300" width="120" height="100" rx="8" fill="#3a3f4a"/><rect x="595" y="312" width="100" height="74" rx="6" fill="#ffb347" opacity=".85"/>
    <rect x="600" y="346" width="90" height="4" fill="#555"/>${[615, 645, 675].map((x) => `<circle cx="${x}" cy="340" r="7" fill="#b07440"/><circle cx="${x - 2}" cy="338" r="1.6" fill="#4a2a10"/>`).join('')}
    <rect x="600" y="292" width="90" height="6" rx="3" fill="#9aa3ad"/>` },
  corbeille: { boite: '345 130 112 70', dessin: `<g transform="translate(159 -96)">
    <circle cx="214" cy="260" r="13" fill="#e05252"/><circle cx="240" cy="254" r="13" fill="#ff9a3c"/><circle cx="266" cy="260" r="13" fill="#7ac943"/>
    <path d="M222 246 q20 -22 48 -10 q-14 6 -48 10Z" fill="#f2d24a"/>
    <path d="M196 264 H284 L272 292 H208Z" fill="#c98b4f"/><path d="M200 274 H280 M204 284 H276" stroke="#a8703c" stroke-width="3"/></g>` },
  moule: { boite: '590 214 110 40', dessin: `
    <path d="M604 250 L612 228 H678 L686 250Z" fill="#e05252"/><path d="M604 250 H686" stroke="#a83a3a" stroke-width="3"/>
    ${[620, 634, 648, 662, 676].map((x) => `<line x1="${x}" y1="230" x2="${x - 3}" y2="248" stroke="#c94444" stroke-width="2"/>`).join('')}
    <ellipse cx="645" cy="227" rx="34" ry="5" fill="#f6d79a"/>` },
  tablier: { boite: '220 100 100 140', dessin: `
    <circle cx="270" cy="112" r="5" fill="#9aa3ad"/><path d="M262 116 Q270 124 278 116" stroke="#555" stroke-width="2" fill="none"/>
    <path d="M250 122 H290 L292 150 Q306 152 308 166 L298 230 H242 L232 166 Q234 152 248 150Z" fill="#fff" stroke="#d6d6de" stroke-width="3"/>
    <rect x="254" y="172" width="32" height="24" rx="4" fill="#f080b0"/><path d="M232 166 L222 176 M308 166 L318 176" stroke="#f080b0" stroke-width="4" stroke-linecap="round"/>` },
  // Animaux : visibles dans la pièce où l'on est (ils suivent l'enfant)
  // Jardin
  pommier: { boite: '14 96 196 320', dessin: `${ombre(112, 408, 60)}
    <path d="M98 410 Q104 330 96 262 H128 Q120 330 126 410Z" fill="#9a6334"/><path d="M112 300 Q140 280 150 250" stroke="#9a6334" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="70" cy="210" r="52" fill="#4fa85a"/><circle cx="150" cy="200" r="56" fill="#4fa85a"/><circle cx="110" cy="158" r="58" fill="#5cb866"/><circle cx="112" cy="232" r="50" fill="#5cb866"/>
    ${[[62, 196], [98, 150], [142, 178], [166, 226], [110, 236], [76, 250], [132, 126]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#e05252"/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#fff" opacity=".7"/>`).join('')}` },
  cabane: { boite: '540 176 250 240', dessin: `${ombre(665, 408, 104)}
    <rect x="572" y="270" width="186" height="138" fill="#d9a86c"/>${[300, 330, 360, 390].map((y) => `<line x1="572" y1="${y}" x2="758" y2="${y}" stroke="#b9854c" stroke-width="3"/>`).join('')}
    <path d="M552 276 L665 186 L778 276Z" fill="#c0503c"/><path d="M552 276 H778" stroke="#983a2a" stroke-width="6" stroke-linecap="round"/>
    <rect x="640" y="326" width="52" height="82" rx="6" fill="#8a5a34"/><circle cx="682" cy="370" r="4" fill="#f2c230"/>
    <rect x="590" y="296" width="36" height="36" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="5"/><rect x="708" y="296" width="36" height="36" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="5"/>
    <path d="M656 226 l9 -14 l9 14Z" fill="#f2c230"/>` },
  balancoire: { boite: '196 214 150 216', dessin: `${ombre(270, 424, 66)}
    <path d="M212 422 L238 228 M328 422 L302 228" stroke="#c98b4f" stroke-width="10" stroke-linecap="round"/><rect x="226" y="222" width="88" height="12" rx="6" fill="#9a6334"/>
    <path d="M250 234 V356 M290 234 V356" stroke="#7a7f8a" stroke-width="3"/><rect x="240" y="354" width="60" height="11" rx="5" fill="#e05252"/>` },
  fleurs: { boite: '478 372 96 60', dessin: `<ellipse cx="526" cy="418" rx="44" ry="10" fill="#8a5a34"/>
    ${[[494, 400, '#f080b0'], [510, 388, '#ffd84a'], [526, 398, '#e05252'], [542, 386, '#b08ae8'], [558, 400, '#ff9f43']].map(([x, y, c]) => `<path d="M${x} ${y} V418" stroke="#3e9a48" stroke-width="3"/><path d="M${x} 410 q-8 -2 -9 -9" stroke="#3e9a48" stroke-width="3" fill="none"/>${[0, 72, 144, 216, 288].map((r) => `<circle cx="${x}" cy="${y - 6}" r="4.5" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="3.5" fill="#fff6c0"/>`).join('')}` },
  potager: { boite: '10 414 190 64', dessin: `<rect x="16" y="430" width="178" height="42" rx="8" fill="#8a5a34"/><rect x="16" y="430" width="178" height="42" rx="8" fill="none" stroke="#c98b4f" stroke-width="5"/>
    ${[40, 70, 100].map((x) => `<path d="M${x} 446 l-6 -14 M${x} 446 v-18 M${x} 446 l6 -14" stroke="#3e9a48" stroke-width="3.5" stroke-linecap="round"/><path d="M${x - 5} 446 h10 l-5 14Z" fill="#f28c28"/>`).join('')}
    ${[136, 168].map((x) => `<circle cx="${x}" cy="450" r="13" fill="#7cc458"/><circle cx="${x}" cy="450" r="7" fill="#a6dd82"/>`).join('')}` },
  piscine: { boite: '566 418 226 78', dessin: `<ellipse cx="680" cy="462" rx="108" ry="30" fill="#4a90d9"/><ellipse cx="680" cy="456" rx="96" ry="22" fill="#9fdcf5"/>
    <path d="M610 456 q10 -6 20 0 t20 0 M700 462 q10 -6 20 0 t20 0" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>
    <circle cx="654" cy="452" r="11" fill="#ffd84a"/><circle cx="654" cy="452" r="4.5" fill="#9fdcf5"/>` },
  trampoline: { boite: '192 424 156 84', dessin: `${ombre(270, 504, 70)}
    <path d="M214 462 V500 M326 462 V500 M250 470 V504 M290 470 V504" stroke="#7a7f8a" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="270" cy="456" rx="72" ry="20" fill="#4a90d9"/><ellipse cx="270" cy="455" rx="56" ry="14" fill="#2b2b3a"/>` },
  chat: { boite: '290 390 150 100', dessin: `
    <ellipse cx="370" cy="462" rx="50" ry="22" fill="#f2a654"/>
    <path d="M410 456 Q440 430 432 410" stroke="#f2a654" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="330" cy="440" r="26" fill="#f2a654"/>
    <path d="M310 424 L314 400 L328 418Z M350 424 L346 400 L332 418Z" fill="#f2a654"/>
    <circle cx="321" cy="438" r="4" fill="#2b2b3a"/><circle cx="339" cy="438" r="4" fill="#2b2b3a"/>
    <path d="M326 448 Q330 452 334 448" stroke="#7a3a20" stroke-width="2" fill="none"/><circle cx="330" cy="445" r="2.5" fill="#e8506a"/>` },
  chien: { boite: '196 428 106 84', dessin: `${ombre(252, 505, 44)}
    <path d="M284 482 Q300 464 292 450" stroke="#c98b4f" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="262" cy="482" rx="30" ry="20" fill="#c98b4f"/><ellipse cx="274" cy="497" rx="15" ry="8" fill="#b07440"/>
    <rect x="230" y="474" width="10" height="30" rx="5" fill="#c98b4f"/><rect x="244" y="476" width="10" height="28" rx="5" fill="#b8804a"/>
    <path d="M238 470 Q250 482 258 468" stroke="#e05252" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="249" cy="477" r="3.5" fill="#f2c230"/>
    <circle cx="232" cy="454" r="20" fill="#c98b4f"/><ellipse cx="217" cy="462" rx="12" ry="9" fill="#e7c08e"/>
    <ellipse cx="208" cy="457" rx="4.5" ry="3.5" fill="${N}"/><circle cx="227" cy="448" r="3" fill="${N}"/>
    <path d="M214 470 q3 8 7 0Z" fill="#e8506a"/>
    <path d="M240 437 Q258 441 252 470 Q240 462 235 444Z" fill="#7a4a28"/>` },
  lapin: { boite: '436 432 70 80', dessin: `${ombre(468, 507, 26)}
    <g stroke="#d8cfc2" stroke-width="1.5">
      <ellipse cx="480" cy="452" rx="5" ry="15" fill="#f7f4ef" transform="rotate(-10 480 452)"/><ellipse cx="491" cy="452" rx="5" ry="15" fill="#f7f4ef" transform="rotate(12 491 452)"/>
      <ellipse cx="466" cy="490" rx="23" ry="16" fill="#f7f4ef"/><circle cx="444" cy="486" r="6" fill="#fff"/>
      <ellipse cx="472" cy="504" rx="12" ry="4" fill="#ece6dc"/><circle cx="486" cy="475" r="12.5" fill="#f7f4ef"/>
    </g>
    <ellipse cx="480" cy="452" rx="2" ry="10" fill="#f6b6c8" transform="rotate(-10 480 452)"/><ellipse cx="491" cy="452" rx="2" ry="10" fill="#f6b6c8" transform="rotate(12 491 452)"/>
    <circle cx="490" cy="472" r="2.3" fill="${N}"/><circle cx="497.5" cy="478" r="2.2" fill="#e8506a"/>` },
  hamster: { boite: '92 470 56 42', dessin: `${ombre(120, 508, 22)}
    <circle cx="107" cy="481" r="5.5" fill="#d48a3e"/><circle cx="131" cy="480" r="5.5" fill="#d48a3e"/>
    <ellipse cx="120" cy="494" rx="22" ry="15" fill="#e8a65a"/><ellipse cx="121" cy="500" rx="13" ry="8" fill="#fbe3c0"/>
    <ellipse cx="111" cy="507" rx="5" ry="2.5" fill="#fbe3c0"/><ellipse cx="131" cy="507" rx="5" ry="2.5" fill="#fbe3c0"/>
    <circle cx="112" cy="489" r="2.3" fill="${N}"/><circle cx="128" cy="489" r="2.3" fill="${N}"/><circle cx="120" cy="494" r="1.9" fill="#e8506a"/>
    <circle cx="106" cy="495" r="3.5" fill="#f6a0a0" opacity=".6"/><circle cx="134" cy="495" r="3.5" fill="#f6a0a0" opacity=".6"/>` },
  poisson: { boite: '690 400 100 110', dessin: `
    <rect x="712" y="470" width="56" height="34" rx="4" fill="#9a6334"/>
    <circle cx="740" cy="440" r="34" fill="#bfe6ff" opacity=".8" stroke="#fff" stroke-width="4"/>
    <path d="M726 446 Q740 430 754 446 Q740 462 726 446Z M752 446 L764 437 V455Z" fill="#f28c28"/>
    <circle cx="733" cy="443" r="2" fill="${N}"/><path d="M742 440 q4 6 0 12" stroke="#ffd0a0" stroke-width="2" fill="none"/>
    <circle cx="722" cy="428" r="2.5" fill="#fff" opacity=".9"/><circle cx="727" cy="418" r="1.8" fill="#fff" opacity=".9"/>` },
};

// La fenêtre des pièces de la maison (pas au jardin)
const FENETRE = `<rect x="330" y="60" width="150" height="130" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="10"/>
    <line x1="405" y1="60" x2="405" y2="190" stroke="#fff" stroke-width="6"/><line x1="330" y1="125" x2="480" y2="125" stroke="#fff" stroke-width="6"/>
    <circle cx="450" cy="92" r="14" fill="#ffd84a"/>`;
const nuage = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="46" ry="15" fill="#fff"/><circle cx="${x - 16}" cy="${y - 10}" r="16" fill="#fff"/><circle cx="${x + 12}" cy="${y - 15}" r="20" fill="#fff"/>`;
const DECOR = {
  // dehors : le ciel, une haie et de l'herbe (pas de mur, pas de papier peint, pas de fenêtre)
  jardin: { mur: '#bfe6ff', sol: '#8fd36a', lattes: '#7cc458', dehors: true, fond: `
    <circle cx="704" cy="70" r="36" fill="#ffd84a"/><circle cx="704" cy="70" r="48" fill="#ffd84a" opacity=".3"/>${nuage(250, 80)}${nuage(520, 120)}
    ${[...Array(15)].map((_, i) => `<circle cx="${i * 58}" cy="${352 + (i % 2) * 8}" r="42" fill="${i % 2 ? '#58a85a' : '#63b565'}"/>`).join('')}
    <rect y="356" width="800" height="40" fill="#58a85a"/><rect y="388" width="800" height="132" fill="#8fd36a"/>
    ${[[60, 470], [230, 410], [380, 498], [520, 440], [640, 404], [750, 480]].map(([x, y]) => `<path d="M${x} ${y} l-5 -12 M${x} ${y} v-15 M${x} ${y} l5 -12" stroke="#6fb84e" stroke-width="3" stroke-linecap="round"/>`).join('')}` },
  chambre: { mur: '#fbeedd', sol: '#d9a86c', lattes: '#c48f55' },
  salon: { mur: '#f6e2c8', sol: '#b07a48', lattes: '#97663a' },
  jeux: { mur: '#e4f3ff', sol: '#9ed69a', lattes: '#86c482' },
  grenier: { mur: '#f3e3c8', sol: '#c9a06a', lattes: '#a8824e' },
  cuisine: { mur: '#fff4e2', sol: '#e3cfae', lattes: '#cdb48c', fond: `
    <rect x="20" y="70" width="300" height="200" fill="#ffffff" opacity=".5"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${20 + i * 60}" y1="70" x2="${20 + i * 60}" y2="270" stroke="#e7d6c0" stroke-width="2"/><line x1="20" y1="${70 + i * 40}" x2="320" y2="${70 + i * 40}" stroke="#e7d6c0" stroke-width="2"/>`).join('')}
    <rect x="20" y="300" width="300" height="104" fill="#9fc9e8"/><rect x="14" y="290" width="312" height="14" rx="4" fill="#d9b48a"/>
    ${[30, 128, 226].map((x) => `<rect x="${x}" y="314" width="84" height="80" rx="6" fill="#b6d7ef"/><rect x="${x + 36}" y="326" width="12" height="4" rx="2" fill="#5a7ea0"/>`).join('')}` },
};
// La place du tableau (dessin de l'atelier de peinture) sur le mur de chaque pièce : [x, y, largeur]
const CADRE = { chambre: [690, 62, 92], salon: [206, 60, 112], jeux: [200, 70, 112], cuisine: [698, 66, 88], grenier: [452, 150, 76] };
function tableau(profil, piece) {
  const d = (profil.dessins ?? []).find((x) => x.id === profil.maison.tableaux?.[piece]);
  if (!d || !CADRE[piece]) return '';
  const [x, y, l] = CADRE[piece], h = l * 0.75;
  return `<rect x="${x - 7}" y="${y - 7}" width="${l + 14}" height="${h + 14}" rx="3" fill="#b07440"/><rect x="${x - 3}" y="${y - 3}" width="${l + 6}" height="${h + 6}" fill="#e8c890"/>
    ${dessinerOeuvre(d).replace('<svg ', `<svg x="${x}" y="${y}" width="${l}" height="${h}" `)}`;
}
const ORDRE = ['placard', 'etagere-cuisine', 'frigo', 'lave-vaisselle', 'evier', 'tablier', 'poele', 'corbeille', 'four', 'moule', 'chaises', 'table-cuisine',
  'guirlande', 'horloge', 'tapis', 'etagere', 'lit', 'bureau', 'lampe', 'plante', 'ours', 'robot', 'coffre', 'pouf',
  'bibliotheque', 'miroir', 'tele', 'lampadaire', 'plante-salon', 'canape', 'fauteuil', 'tapis-salon', 'table-basse',
  'tableau-noir', 'cerf-volant', 'toboggan', 'manege', 'cubes', 'piscine-balles',
  'pommier', 'cabane', 'balancoire', 'fleurs', 'potager', 'piscine', 'trampoline',
  'carte-monde', 'coucou', 'piano', 'panier-basket', 'circuit', 'bac-a-sable',
  'lanterne', 'etagere-jeux', 'hamac', 'tipi', 'telescope', 'malle', 'fauteuil-poire', 'cheval-bascule'];
const DEVANT = ['ballon', 'train']; // devant l'enfant

// Papier peint : un motif SVG (id unique par dessin, car plusieurs aperçus sont sur la même page).
function papier(cle, id, defaut) {
  const motifs = {
    rayures: `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fde6ef"/><rect width="18" height="40" fill="#f9c6da"/></pattern>`,
    pois: `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#e8f2ff"/><circle cx="11" cy="11" r="6" fill="#8fbcf0"/><circle cx="33" cy="33" r="6" fill="#8fbcf0"/></pattern>`,
    etoiles: `<pattern id="${id}" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="#3a3f78"/><path d="M18 8 L21 16 L29 16 L23 21 L25 29 L18 24 L11 29 L13 21 L7 16 L15 16Z" fill="#ffd84a"/><circle cx="52" cy="48" r="3" fill="#fff"/><circle cx="44" cy="14" r="2" fill="#fff"/></pattern>`,
    coeurs: `<pattern id="${id}" width="56" height="56" patternUnits="userSpaceOnUse"><rect width="56" height="56" fill="#fff0f4"/>${[[14, 12], [42, 40]].map(([x, y]) => `<path transform="translate(${x - 25} ${y - 24})" d="M25 20 C25 12 14 12 14 20 C14 27 25 33 25 36 C25 33 36 27 36 20 C36 12 25 12 25 20Z" fill="#f48fb1"/>`).join('')}</pattern>`,
    nuages: `<pattern id="${id}" width="120" height="90" patternUnits="userSpaceOnUse"><rect width="120" height="90" fill="#cfeaff"/>${[[30, 26], [90, 68]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="9" fill="#fff"/><circle cx="${x - 8}" cy="${y - 6}" r="9" fill="#fff"/><circle cx="${x + 6}" cy="${y - 9}" r="11" fill="#fff"/>`).join('')}</pattern>`,
    jungle: `<pattern id="${id}" width="64" height="72" patternUnits="userSpaceOnUse"><rect width="64" height="72" fill="#c9e6b8"/>${[[16, 18, -12], [48, 54, 10]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="8" ry="14" fill="#3e9a48"/><path d="M${x} ${y - 12} V${y + 12}" stroke="#2e7d32" stroke-width="2"/></g>`).join('')}</pattern>`,
    'arc-en-ciel': `<pattern id="${id}" width="40" height="132" patternUnits="userSpaceOnUse">${['#ffc9c9', '#ffe0b8', '#fff3b0', '#c9efc4', '#c4e3fb', '#dccbf5'].map((c, i) => `<rect y="${i * 22}" width="40" height="22" fill="${c}"/>`).join('')}</pattern>`,
  };
  if (!cle) return { defs: '', fond: defaut };
  const unis = { menthe: '#bfe8d4', lavande: '#e3d4f7' };
  if (unis[cle]) return { defs: '', fond: unis[cle] };
  return { defs: motifs[cle], fond: `url(#${id})` };
}


// ---------- Les animaux de la maison ----------
// Les animaux posés se rangent sur ces emplacements, le long du sol (milieu du bas), dans l'ordre où on les a posés.
// shortcut: 5 animaux visibles au plus à la fois ; les suivants attendent d'être placés à la place d'un autre.
const PLACES_ANIMAUX = [[150, 512], [285, 512], [560, 512], [690, 512], [420, 516]];
const echapper = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Où poser un vêtement, sur le dessin d'origine de chaque espèce : tête, cou, corps [x, y, rx, ry]
const ANCRES = {
  chat: { tete: [330, 414], cou: [344, 462], corps: [372, 462, 40, 18] },
  chien: { tete: [232, 436], cou: [248, 474], corps: [264, 482, 24, 16] },
  lapin: { tete: [486, 462], cou: [478, 488], corps: [464, 490, 18, 13] },
  hamster: { tete: [120, 476], cou: [120, 486], corps: [120, 496, 16, 10] },
  perroquet: { tete: [34, 18], cou: [32, 44], corps: [30, 64, 11, 18] },
  tortue: { tete: [84, 25], cou: [76, 38], corps: [44, 28, 24, 12] },
};
const ANIMAUX_EN_PLUS = {
  perroquet: { boite: '8 8 54 100', dessin: `${ombre(34, 104, 18)}
    <path d="M24 84 L16 106 L34 100Z" fill="#3498db"/><ellipse cx="30" cy="62" rx="15" ry="26" fill="#2ecc71"/>
    <path d="M18 56 Q14 80 28 88 Q24 70 30 52Z" fill="#27ae60"/><ellipse cx="34" cy="70" rx="7" ry="10" fill="#e74c3c"/>
    <circle cx="34" cy="30" r="13" fill="#2ecc71"/><circle cx="38" cy="29" r="6" fill="#fff"/><circle cx="39" cy="29" r="2.4" fill="${N}"/>
    <path d="M45 28 Q58 30 50 42 Q47 36 45 36Z" fill="#f39c12"/><path d="M26 88 V96 M34 88 V96" stroke="#e67e22" stroke-width="3" stroke-linecap="round"/>` },
  tortue: { boite: '4 2 96 56', dessin: `${ombre(48, 52, 40)}
    <ellipse cx="22" cy="46" rx="8" ry="5" fill="#9ccc65"/><ellipse cx="64" cy="46" rx="8" ry="5" fill="#9ccc65"/><path d="M10 32 L2 36 L10 38Z" fill="#9ccc65"/>
    <circle cx="84" cy="34" r="10" fill="#9ccc65"/><circle cx="88" cy="31" r="2" fill="${N}"/><path d="M86 38 q4 2 7 -1" stroke="#5a7a3a" stroke-width="1.5" fill="none"/>
    <ellipse cx="44" cy="30" rx="34" ry="20" fill="#4caf50"/><path d="M44 12 L56 22 L52 36 L36 36 L32 22Z M20 26 L32 22 M68 26 L56 22 M24 40 L36 36 M64 40 L52 36" stroke="#2e7d32" stroke-width="2.5" fill="none"/>` },
  // le poisson sans son bocal (quand il a un aquarium)
  'poisson-seul': { boite: '690 400 100 110', dessin: `<path d="M726 446 Q740 430 754 446 Q740 462 726 446Z M752 446 L764 437 V455Z" fill="#f28c28"/>
    <circle cx="733" cy="443" r="2" fill="${N}"/><path d="M742 440 q4 6 0 12" stroke="#ffd0a0" stroke-width="2" fill="none"/>
    <circle cx="722" cy="428" r="2.5" fill="#fff" opacity=".9"/><circle cx="727" cy="418" r="1.8" fill="#fff" opacity=".9"/>` },
};
const boiteDe = (o) => o.boite.split(' ').map(Number);

// Les vêtements d'un animal, dessinés sur ses ancres (dans les coordonnées de son dessin d'origine)
function habitAnimal(espece, cle) {
  const h = HABITS_ANIMAUX[cle], a = ANCRES[espece];
  if (!h || !a) return '';
  const c = h.couleur;
  if (h.forme === 'pull') { const [x, y, rx, ry] = a.corps; return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity=".95"/><path d="M${x - rx * 0.7} ${y - 3} H${x + rx * 0.7} M${x - rx * 0.7} ${y + 4} H${x + rx * 0.7}" stroke="#fff" stroke-width="2.5" opacity=".7"/>`; }
  if (h.forme === 'collier') { const [x, y] = a.cou; return `<ellipse cx="${x}" cy="${y}" rx="10" ry="4" fill="none" stroke="${c}" stroke-width="4"/><circle cx="${x}" cy="${y + 5}" r="3.2" fill="#f2c230" stroke="#b8860b"/>`; }
  if (h.forme === 'noeud') { const [x, y] = a.tete; return `<g transform="translate(${x + 8} ${y + 2})"><path d="M0 0 L-10 -6 L-10 6Z M0 0 L10 -6 L10 6Z" fill="${c}"/><circle r="3" fill="${c}" stroke="#fff"/></g>`; }
  const [x, y] = a.tete; // chapeau de fête
  return `<path d="M${x - 9} ${y + 2} L${x} ${y - 22} L${x + 9} ${y + 2}Z" fill="${c}"/><circle cx="${x}" cy="${y - 23}" r="3.5" fill="#ffd84a"/><circle cx="${x - 3}" cy="${y - 6}" r="1.6" fill="#fff"/><circle cx="${x + 3}" cy="${y - 13}" r="1.6" fill="#fff"/>`;
}

// Les accessoires des animaux, à côté de l'animal qui s'en sert (cx, by : le milieu du bas de sa place)
const DESSINS_ACC = {
  panier: (cx, by) => `<ellipse cx="${cx}" cy="${by - 6}" rx="62" ry="14" fill="#9a6334"/><ellipse cx="${cx}" cy="${by - 12}" rx="55" ry="9" fill="#f6c8d8"/><path d="M${cx - 60} ${by - 4} Q${cx} ${by + 10} ${cx + 60} ${by - 4}" stroke="#7a4a28" stroke-width="2" fill="none"/>`,
  coussin: (cx, by) => `<ellipse cx="${cx}" cy="${by - 5}" rx="54" ry="11" fill="#8e6ad8"/><ellipse cx="${cx}" cy="${by - 8}" rx="40" ry="6" fill="#b08ae8"/>`,
  gamelle: (cx, by) => `<path d="M${cx + 46} ${by - 16} H${cx + 78} L${cx + 74} ${by - 2} H${cx + 50}Z" fill="#e05252"/><ellipse cx="${cx + 62}" cy="${by - 16}" rx="16" ry="4" fill="#c98b4f"/>`,
  os: (cx, by) => `<g transform="translate(${cx - 62} ${by - 8})"><rect x="-12" y="-3" width="24" height="6" fill="#fffaf0"/>${[[-12, -3], [-12, 3], [12, -3], [12, 3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fffaf0" stroke="#e0d8c8"/>`).join('')}</g>`,
  pelote: (cx, by) => `<circle cx="${cx - 60}" cy="${by - 12}" r="12" fill="#e86fa8"/><path d="M${cx - 70} ${by - 16} Q${cx - 60} ${by - 6} ${cx - 50} ${by - 16} M${cx - 68} ${by - 6} Q${cx - 60} ${by - 18} ${cx - 52} ${by - 6} M${cx - 48} ${by - 10} Q${cx - 30} ${by} ${cx - 20} ${by - 2}" stroke="#c94a88" stroke-width="2" fill="none"/>`,
  roue: (cx, by) => `<path d="M${cx - 76} ${by} L${cx - 62} ${by - 30} L${cx - 48} ${by}" stroke="#9aa3ad" stroke-width="4" fill="none"/><circle cx="${cx - 62}" cy="${by - 32}" r="27" fill="none" stroke="#5b9ae0" stroke-width="5"/>${[0, 45, 90, 135].map((a) => `<path d="M${cx - 62} ${by - 32} l${(25 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(25 * Math.sin((a * Math.PI) / 180)).toFixed(1)} M${cx - 62} ${by - 32} l${(-25 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(-25 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" stroke="#5b9ae0" stroke-width="2"/>`).join('')}`,
  griffoir: () => `<rect x="744" y="498" width="52" height="10" rx="3" fill="#c98b4f"/><rect x="760" y="364" width="20" height="136" fill="#e8d4a8"/>${[380, 400, 420, 440, 460, 480].map((y) => `<path d="M760 ${y} H780" stroke="#c09050" stroke-width="3"/>`).join('')}<rect x="748" y="354" width="44" height="12" rx="3" fill="#c98b4f"/><circle cx="790" cy="380" r="6" fill="#e86fa8"/><path d="M790 366 V374" stroke="#555"/>`,
  laisse: () => `<circle cx="30" cy="300" r="5" fill="#9aa3ad"/><path d="M30 300 Q20 340 36 372 Q46 392 30 404" stroke="#e05252" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="410" rx="9" ry="7" fill="none" stroke="#e05252" stroke-width="4"/>`,
  perchoir: (cx, by) => `<rect x="${cx - 4}" y="${by - 64}" width="8" height="64" fill="#9a6334"/><rect x="${cx - 30}" y="${by - 66}" width="60" height="7" rx="3" fill="#c98b4f"/><ellipse cx="${cx}" cy="${by - 2}" rx="26" ry="6" fill="#7a4a28"/>`,
  aquarium: (cx, by) => `<rect x="${cx - 74}" y="${by - 22}" width="148" height="22" fill="#7a4a28"/><rect x="${cx - 70}" y="${by - 122}" width="140" height="100" rx="6" fill="#9fdcf5" stroke="#e8f6ff" stroke-width="5"/>
    <rect x="${cx - 67}" y="${by - 38}" width="134" height="14" fill="#e8c27a"/><path d="M${cx - 50} ${by - 26} Q${cx - 58} ${by - 60} ${cx - 46} ${by - 80} M${cx + 52} ${by - 26} Q${cx + 44} ${by - 54} ${cx + 56} ${by - 70}" stroke="#3a9a4a" stroke-width="5" fill="none"/>`,
};
// pour une place d'animal : où l'accessoire se met par rapport à lui
// Un meuble en image, à la place de son dessin (null s'il n'a pas d'image). Il garde son emplacement : posé au sol, ou centré s'il est au mur.
const COTES = { 'table-basse': [150], lit: [250], frigo: [190, -22], 'table-cuisine': [180], lampe: [84, 12, 186],
  tele: [200, 0, 40], horloge: [96], guirlande: [440, 0, 40], 'plante-salon': [158, -6], chaises: [150, 150], 'etagere-cuisine': [130],
  fleurs: [110], miroir: [120], potager: [160], ballon: [70], train: [130], poele: [100], corbeille: [84, 0, 6], cubes: [80], manege: [170], 'tableau-noir': [170, -39, 180] }; // le tableau noir est sur un chevalet : par terre, derrière le manège // la télé est sur un meuble : posée par terre, derrière le fauteuil // [côté du carré de l'image, décalage vers la droite, vers le bas], quand l'ancien emplacement ne convient pas
function meubleImage(cle, fichier = cle) {
  const img = image(`maison/${fichier}`);
  if (!img) return null;
  const [bx, by, bw, bh] = boiteDe(OBJETS[cle]);
  if (cle.startsWith('tapis')) return `<image href="${img}" x="${bx}" y="${by}" width="${bw}" height="${bh}" preserveAspectRatio="none"/>`; // vu d'en haut, aplati sur le sol
  const [cote, dx = 0, dy = 0] = COTES[cle] ?? [Math.max(bw, bh)], auMur = by + bh < 380;
  return `<image href="${img}" x="${bx + bw / 2 - cote / 2 + dx}" y="${(auMur ? by + bh / 2 - cote / 2 : by + bh - cote) + dy}" width="${cote}" height="${cote}" preserveAspectRatio="${auMur ? 'xMidYMid' : 'xMidYMax'} meet"/>`;
}
// Le lit : une image par couleur de couverture (maison/lit pour le rose du départ)
const fichierLit = (couleur) => (couleur && couleur !== 'rose' ? `lit-${couleur}` : 'lit');

// Un chapeau ou un nœud sur la tête d'un animal en image. [x, y, taille] en parts du carré de l'image : le bas du chapeau (le nœud est centré au même endroit).
const TETES = { chat: [0.36, 0.13, 0.30], chien: [0.62, 0.08, 0.30], lapin: [0.68, 0.27, 0.24], 'lapin-brun': [0.60, 0.30, 0.22], 'lapin-gris': [0.60, 0.30, 0.22],
  hamster: [0.48, 0.16, 0.28], tortue: [0.80, 0.27, 0.20], perroquet: [0.54, 0.07, 0.26] };
function habitImage(cle, espece, habit, x0, y0, cote) {
  const h = HABITS_ANIMAUX[habit], t = TETES[cle] ?? TETES[espece], img = h && image(`animaux/habit-${habit}`);
  // shortcut: colliers et pulls ne se portent pas encore sur un animal en image (collier à refaire sans fond blanc, pull vu de face).
  if (!img || !t || !['chapeau', 'noeud'].includes(h.forme)) return '';
  const l = t[2] * cote * (h.forme === 'noeud' ? 0.8 : 1), x = x0 + t[0] * cote - l / 2;
  return h.forme === 'chapeau' ? `<image href="${img}" x="${x}" y="${y0 + t[1] * cote - l}" width="${l}" height="${l}" preserveAspectRatio="xMidYMax meet"/>`
    : `<image href="${img}" x="${x}" y="${y0 + (t[1] - 0.02) * cote - l / 2}" width="${l}" height="${l}"/>`;
}
// Un accessoire en image : [écart depuis le milieu de l'animal, largeur, hauteur, enfoncement dans le sol]. Sans image : son dessin.
const PLACES_ACC = { gamelle: [40, 52, 40], pelote: [-84, 38, 38], coussin: [-62, 124, 72, 8], aquarium: [-76, 152, 122], griffoir: [-42, 70, 150], laisse: [-756, 52, 110, -104],
  panier: [-66, 132, 80, 10], os: [-92, 46, 30], roue: [-98, 62, 62], perchoir: [-36, 72, 70] }; // la laisse est accrochée au mur de gauche
const accessoire = (k, cx, by) => {
  const img = image(`animaux/acc-${k}`), p = PLACES_ACC[k];
  return img && p ? `<image href="${img}" x="${cx + p[0]}" y="${by - p[2] + (p[3] ?? 0)}" width="${p[1]}" height="${p[2]}" preserveAspectRatio="xMidYMax meet"/>` : DESSINS_ACC[k](cx, by);
};
const ACC_FIXES = ['griffoir', 'laisse']; // accrochés au mur ou dans le coin, pas sous un animal

function animauxDeLaPiece(profil) {
  const places = profil.maison.places;
  const poses = places.filter((id) => id.startsWith('animal:') && ANIMAUX[id.slice(7)]).slice(0, PLACES_ANIMAUX.length);
  const accs = places.filter((id) => id.startsWith('acc-animal:')).map((id) => id.slice(11)).filter((k) => ACCESSOIRES_ANIMAUX[k]);
  const especeDe = (id) => ANIMAUX[id.slice(7)].espece;
  const placeDe = (k) => { const i = poses.findIndex((id) => ACCESSOIRES_ANIMAUX[k].pour.includes(especeDe(id))); return PLACES_ANIMAUX[Math.max(0, i)]; };
  const avecAccessoire = (k, id) => accs.includes(k) && poses.find((x) => ACCESSOIRES_ANIMAUX[k].pour.includes(especeDe(x))) === id;
  // un perroquet en image est déjà sur une branche : son perchoir se met à côté de lui
  const aCote = (k) => (k === 'perchoir' && poses.some((id) => especeDe(id) === 'perroquet' && image(`animaux/${id.slice(7)}`)) ? -86 : 0);
  const dessous = accs.map((k) => { const [x, y] = ACC_FIXES.includes(k) ? [768, 508] : placeDe(k); return accessoire(k, x + aCote(k), y); }).join(''); // les fixes : dans le coin droit
  const animaux = poses.map((id, i) => {
    const a = ANIMAUX[id.slice(7)], [sx, sy] = PLACES_ANIMAUX[i];
    const base = a.espece === 'poisson' && avecAccessoire('aquarium', id) ? 'poisson-seul' : a.espece;
    const o = OBJETS[base] ?? ANIMAUX_EN_PLUS[base];
    const [bx, by, bw, bh] = boiteDe(o);
    const dy = a.espece === 'poisson' && base === 'poisson-seul' ? (image('animaux/acc-aquarium') ? 14 : -24) : 0; // le poisson nage au milieu de l'aquarium
    // un poisson qui a un aquarium y nage (petit dessin) : son image le montre déjà dans un bocal
    const img = base === 'poisson-seul' ? null : image(`animaux/${id.slice(7)}`);
    const monte = a.espece === 'perroquet' && !img && avecAccessoire('perchoir', id) ? 62 : 0; // le perroquet dessiné se pose sur son perchoir (en image, il a déjà sa branche)
    const cote = Math.min(130, Math.max(80, Math.max(bw, bh) * (a.espece === 'poisson' ? 1 : 1.2))); // une image est carrée (le bocal, déjà gros, n'est pas agrandi) : un peu plus grande que le dessin, pour qu'on voie l'animal
    let dessin = img ? `${ombre(bx + bw / 2, by + bh - 3, cote * 0.36)}<image href="${img}" x="${bx + bw / 2 - cote / 2}" y="${by + bh - cote}" width="${cote}" height="${cote}" preserveAspectRatio="xMidYMax meet"/>${habitImage(id.slice(7), a.espece, profil.habits?.[id], bx + bw / 2 - cote / 2, by + bh - cote, cote)}` : o.dessin + (a.taches ?? '') + habitAnimal(a.espece, profil.habits?.[id]);
    if (!img) for (const [de, vers] of Object.entries(a.couleurs ?? {})) dessin = dessin.replaceAll(de, vers);
    const nom = profil.noms?.[id];
    return `<g transform="translate(${sx - (bx + bw / 2)} ${sy - (by + bh) - monte + dy})">${dessin}</g>`
      + (nom ? `<text x="${sx}" y="${sy - (img ? cote + (HABITS_ANIMAUX[profil.habits?.[id]]?.forme === 'chapeau' ? 26 : 0) : bh) - monte - 8}" class="nom-animal" font-size="20" font-weight="800" text-anchor="middle" fill="#2b2b3a" stroke="#fff" stroke-width="5" paint-order="stroke" font-family="sans-serif">${echapper(nom)}</text>` : '');
  }).join('');
  return dessous + animaux;
}

// Objets posés (meuble:lit, jouet:ours…) : on dessine ceux de cette pièce ; les animaux et leurs accessoires suivent l'enfant partout.
export function dessinerPiece(profil, piece = profil.maison.piece) {
  const deco = DECOR[piece] ?? DECOR.chambre;
  const { defs, fond } = papier(profil.maison.papiers[piece], 'papier-piece', deco.mur);
  const poses = new Set(profil.maison.places.map((id) => id.split(':')).filter(([type, cle]) => type === 'animal' || PIECE_DE[cle] === piece).map(([, cle]) => cle));
  const lit = COULEURS_LIT[profil.maison.lit]?.couleur ?? COULEURS_LIT.rose.couleur;
  const dessins = (cles) => cles.filter((c) => poses.has(c)).map((c) => (c === 'lit' ? meubleImage('lit', fichierLit(profil.maison.lit)) ?? OBJETS.lit.dessin.replace('#f080b0', lit) : (c === 'lampe' && !poses.has('bureau') ? null : meubleImage(c)) ?? OBJETS[c].dessin)).join(''); // la lampe en image se pose sur le bureau ; sans bureau, la suspension dessinée
  const avatar = dessinerAvatar(profil.avatar, 'entier', profil.age).replace('<svg ', '<svg x="345" y="196" width="150" height="244" ');
  const img = image(`maison/piece-${piece}`); // la pièce en image : sol et fenêtre, mur transparent (le papier peint reste derrière) ; le jardin en entier
  return `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" class="piece-svg" role="img" aria-label="${poses.size ? 'La pièce et tes objets' : 'La pièce, encore vide'}">
    <defs>${defs}</defs>
    <rect width="800" height="390" fill="${deco.dehors ? deco.mur : fond}"/>
    ${img ? `<image href="${img}" width="800" height="520" preserveAspectRatio="none"/>` : `<rect y="380" width="800" height="140" fill="${deco.sol}"/>
    ${deco.dehors ? '' : `${FENETRE}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${i * 160}" y1="390" x2="${i * 160 - 60}" y2="520" stroke="${deco.lattes}" stroke-width="3"/>`).join('')}
    <rect y="372" width="800" height="16" fill="${teinte(deco.mur, -0.05)}"/>`}`}
    ${img && deco.dehors ? '' : deco.fond ?? ''}
    ${tableau(profil, piece)}
    ${dessins(ORDRE)}
    ${avatar}
    ${dessins(DEVANT)}${animauxDeLaPiece(profil)}
  </svg>`;
}

// Aperçu d'un objet en magasin. profil : pour montrer vêtements, coiffures et bijoux sur son propre avatar.
export function apercu(a, profil) {
  const mini = (boite, dessin) => `<svg viewBox="${boite}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${dessin}</svg>`;
  const enImage = (chemin) => image(chemin) && mini('0 0 100 100', `<image href="${image(chemin)}" width="100" height="100"/>`);
  if (['meuble', 'jouet', 'ustensile'].includes(a.type) && enImage(`maison/${a.cle}`)) return enImage(`maison/${a.cle}`);
  if (a.type === 'lit' && enImage(`maison/${fichierLit(a.cle)}`)) return enImage(`maison/${fichierLit(a.cle)}`);
  if (OBJETS[a.cle] && ['meuble', 'jouet', 'ustensile'].includes(a.type)) return mini(OBJETS[a.cle].boite, OBJETS[a.cle].dessin);
  if (a.type === 'animal') {
    const img = image(`animaux/${a.cle}`);
    if (img) return mini('0 0 100 100', `<image href="${img}" width="100" height="100"/>`);
    const an = ANIMAUX[a.cle], o = OBJETS[an.espece] ?? ANIMAUX_EN_PLUS[an.espece];
    let d = o.dessin;
    for (const [de, vers] of Object.entries(an.couleurs ?? {})) d = d.replaceAll(de, vers);
    return mini(o.boite, d + (an.taches ?? ''));
  }
  if (a.type === 'habit-animal' && image(`animaux/habit-${a.cle}`)) return mini('0 0 100 100', `<image href="${image(`animaux/habit-${a.cle}`)}" width="100" height="100"/>`);
  if (a.type === 'habit-animal') return mini(OBJETS.chien.boite, OBJETS.chien.dessin + habitAnimal('chien', a.cle));
  if (a.type === 'acc-animal') {
    const img = image(`animaux/acc-${a.cle}`);
    if (img) return mini('0 0 100 100', `<image href="${img}" width="100" height="100"/>`);
    if (a.cle === 'griffoir') return mini('740 350 60 162', DESSINS_ACC.griffoir());
    if (a.cle === 'laisse') return mini('14 292 40 128', DESSINS_ACC.laisse());
    // cadrage serré de chaque accessoire, dessiné au milieu (100) du bas (100) d'une place d'animal
    const cadre = { panier: '34 78 132 32', coussin: '42 82 116 26', gamelle: '140 76 48 28', os: '24 82 52 28', pelote: '26 76 60 30', roue: '6 38 66 64', perchoir: '64 30 72 74', aquarium: '20 -28 160 130' }[a.cle];
    return mini(cadre, DESSINS_ACC[a.cle](100, 100));
  }
  if (a.type === 'lit') return mini(OBJETS.lit.boite, OBJETS.lit.dessin.replace('#f080b0', COULEURS_LIT[a.cle].couleur));
  if (a.type === 'papier') {
    const { defs, fond } = papier(a.cle, `papier-${a.cle}`, '#fbeedd');
    return mini('0 0 100 100', `<defs>${defs}</defs><rect width="100" height="100" rx="12" fill="${fond}"/>`);
  }
  if (a.type === 'piece') {
    const d = DECOR[a.cle];
    const objet = OBJETS[{ chambre: 'lit', salon: 'canape', jeux: 'toboggan', cuisine: 'four', jardin: 'pommier', grenier: 'tipi' }[a.cle]]; // un objet typique de la pièce
    return mini('0 0 800 520', `<rect width="800" height="390" fill="${d.mur}"/><rect y="380" width="800" height="140" fill="${d.sol}"/>
      ${d.dehors ? d.fond : '<rect x="330" y="60" width="150" height="130" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="10"/>'}${objet.dessin}`);
  }
  if (a.type === 'cheveux') return mini('0 0 100 100', `<circle cx="50" cy="50" r="34" fill="${CHEVEUX[a.cle]}"/>`);
  if (a.type === 'accessoire') {
    const acc = [...new Set([...(profil.avatar.accessoires ?? []), a.cle])];
    return dessinerAvatar({ ...profil.avatar, accessoires: acc }, ['collier', 'bracelet', 'echarpe', 'sac', 'montre'].includes(a.cle) ? 'corps' : 'tete');
  }
  return dessinerAvatar({ ...profil.avatar, [a.type]: a.cle }, a.type === 'tenue' || a.type === 'chaussures' ? 'corps' : 'tete');
}

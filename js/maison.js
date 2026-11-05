// Les pièces de la maison en SVG (vue de face, 800 × 520), et les aperçus des objets des magasins.
import { dessinerAvatar, CHEVEUX, teinte } from './avatar.js';
import { MEUBLES, JOUETS, USTENSILES } from './catalogue.js';
import { dessinerOeuvre } from './jeux/peinture.js';

const PIECE_DE = Object.fromEntries(Object.entries({ ...MEUBLES, ...JOUETS, ...USTENSILES }).map(([cle, o]) => [cle, o.piece]));

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
  corbeille: { boite: '186 226 112 70', dessin: `
    <circle cx="214" cy="260" r="13" fill="#e05252"/><circle cx="240" cy="254" r="13" fill="#ff9a3c"/><circle cx="266" cy="260" r="13" fill="#7ac943"/>
    <path d="M222 246 q20 -22 48 -10 q-14 6 -48 10Z" fill="#f2d24a"/>
    <path d="M196 264 H284 L272 292 H208Z" fill="#c98b4f"/><path d="M200 274 H280 M204 284 H276" stroke="#a8703c" stroke-width="3"/>` },
  moule: { boite: '590 214 110 40', dessin: `
    <path d="M604 250 L612 228 H678 L686 250Z" fill="#e05252"/><path d="M604 250 H686" stroke="#a83a3a" stroke-width="3"/>
    ${[620, 634, 648, 662, 676].map((x) => `<line x1="${x}" y1="230" x2="${x - 3}" y2="248" stroke="#c94444" stroke-width="2"/>`).join('')}
    <ellipse cx="645" cy="227" rx="34" ry="5" fill="#f6d79a"/>` },
  tablier: { boite: '220 100 100 140', dessin: `
    <circle cx="270" cy="112" r="5" fill="#9aa3ad"/><path d="M262 116 Q270 124 278 116" stroke="#555" stroke-width="2" fill="none"/>
    <path d="M250 122 H290 L292 150 Q306 152 308 166 L298 230 H242 L232 166 Q234 152 248 150Z" fill="#fff" stroke="#d6d6de" stroke-width="3"/>
    <rect x="254" y="172" width="32" height="24" rx="4" fill="#f080b0"/><path d="M232 166 L222 176 M308 166 L318 176" stroke="#f080b0" stroke-width="4" stroke-linecap="round"/>` },
  // Animaux : visibles dans la pièce où l'on est (ils suivent l'enfant)
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

const DECOR = {
  chambre: { mur: '#fbeedd', sol: '#d9a86c', lattes: '#c48f55' },
  salon: { mur: '#f6e2c8', sol: '#b07a48', lattes: '#97663a' },
  jeux: { mur: '#e4f3ff', sol: '#9ed69a', lattes: '#86c482' },
  cuisine: { mur: '#fff4e2', sol: '#e3cfae', lattes: '#cdb48c', fond: `
    <rect x="20" y="70" width="300" height="200" fill="#ffffff" opacity=".5"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${20 + i * 60}" y1="70" x2="${20 + i * 60}" y2="270" stroke="#e7d6c0" stroke-width="2"/><line x1="20" y1="${70 + i * 40}" x2="320" y2="${70 + i * 40}" stroke="#e7d6c0" stroke-width="2"/>`).join('')}
    <rect x="20" y="300" width="300" height="104" fill="#9fc9e8"/><rect x="14" y="290" width="312" height="14" rx="4" fill="#d9b48a"/>
    ${[30, 128, 226].map((x) => `<rect x="${x}" y="314" width="84" height="80" rx="6" fill="#b6d7ef"/><rect x="${x + 36}" y="326" width="12" height="4" rx="2" fill="#5a7ea0"/>`).join('')}` },
};
// La place du tableau (dessin de l'atelier de peinture) sur le mur de chaque pièce : [x, y, largeur]
const CADRE = { chambre: [690, 62, 92], salon: [206, 60, 112], jeux: [200, 70, 112], cuisine: [698, 66, 88] };
function tableau(profil, piece) {
  const d = (profil.dessins ?? []).find((x) => x.id === profil.maison.tableaux?.[piece]);
  if (!d || !CADRE[piece]) return '';
  const [x, y, l] = CADRE[piece], h = l * 0.75;
  return `<rect x="${x - 7}" y="${y - 7}" width="${l + 14}" height="${h + 14}" rx="3" fill="#b07440"/><rect x="${x - 3}" y="${y - 3}" width="${l + 6}" height="${h + 6}" fill="#e8c890"/>
    ${dessinerOeuvre(d).replace('<svg ', `<svg x="${x}" y="${y}" width="${l}" height="${h}" `)}`;
}
const ORDRE = ['tablier', 'poele', 'corbeille', 'four', 'moule', 'tapis', 'etagere', 'lampe', 'lit', 'bureau', 'plante', 'ours', 'robot', 'bibliotheque', 'tele', 'lampadaire', 'canape', 'fauteuil', 'table-basse', 'cerf-volant', 'toboggan', 'manege'];
const DEVANT = ['ballon', 'train']; // devant l'enfant

// Papier peint : un motif SVG (id unique par dessin, car plusieurs aperçus sont sur la même page).
function papier(cle, id, defaut) {
  const motifs = {
    rayures: `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fde6ef"/><rect width="18" height="40" fill="#f9c6da"/></pattern>`,
    pois: `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#e8f2ff"/><circle cx="11" cy="11" r="6" fill="#8fbcf0"/><circle cx="33" cy="33" r="6" fill="#8fbcf0"/></pattern>`,
    etoiles: `<pattern id="${id}" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="#3a3f78"/><path d="M18 8 L21 16 L29 16 L23 21 L25 29 L18 24 L11 29 L13 21 L7 16 L15 16Z" fill="#ffd84a"/><circle cx="52" cy="48" r="3" fill="#fff"/><circle cx="44" cy="14" r="2" fill="#fff"/></pattern>`,
  };
  if (!cle) return { defs: '', fond: defaut };
  if (cle === 'menthe') return { defs: '', fond: '#bfe8d4' };
  return { defs: motifs[cle], fond: `url(#${id})` };
}

// Objets posés (meuble:lit, jouet:ours, animal:chat…) : on dessine ceux de cette pièce, et les animaux partout.
export function dessinerPiece(profil, piece = profil.maison.piece) {
  const deco = DECOR[piece] ?? DECOR.chambre;
  const { defs, fond } = papier(profil.maison.papiers[piece], 'papier-piece', deco.mur);
  const poses = new Set(profil.maison.places.map((id) => id.split(':')).filter(([type, cle]) => type === 'animal' || PIECE_DE[cle] === piece).map(([, cle]) => cle));
  const dessins = (cles) => cles.filter((c) => poses.has(c)).map((c) => OBJETS[c].dessin).join('');
  const animaux = ['poisson', 'hamster', 'chien', 'chat', 'lapin'];
  const avatar = dessinerAvatar(profil.avatar, 'entier', profil.age).replace('<svg ', '<svg x="345" y="196" width="150" height="244" ');
  return `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" class="piece-svg" role="img" aria-label="${poses.size ? 'La pièce et tes objets' : 'La pièce, encore vide'}">
    <defs>${defs}</defs>
    <rect width="800" height="390" fill="${fond}"/>
    <rect x="330" y="60" width="150" height="130" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="10"/>
    <line x1="405" y1="60" x2="405" y2="190" stroke="#fff" stroke-width="6"/><line x1="330" y1="125" x2="480" y2="125" stroke="#fff" stroke-width="6"/>
    <circle cx="450" cy="92" r="14" fill="#ffd84a"/>
    <rect y="380" width="800" height="140" fill="${deco.sol}"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${i * 160}" y1="390" x2="${i * 160 - 60}" y2="520" stroke="${deco.lattes}" stroke-width="3"/>`).join('')}
    <rect y="372" width="800" height="16" fill="${teinte(deco.mur, -0.05)}"/>
    ${deco.fond ?? ''}
    ${tableau(profil, piece)}
    ${dessins(ORDRE)}
    ${avatar}
    ${dessins(DEVANT)}${dessins(animaux)}
  </svg>`;
}

// Aperçu d'un objet en magasin. profil : pour montrer vêtements, coiffures et bijoux sur son propre avatar.
export function apercu(a, profil) {
  const mini = (boite, dessin) => `<svg viewBox="${boite}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${dessin}</svg>`;
  if (OBJETS[a.cle] && ['meuble', 'jouet', 'animal', 'ustensile'].includes(a.type)) return mini(OBJETS[a.cle].boite, OBJETS[a.cle].dessin);
  if (a.type === 'papier') {
    const { defs, fond } = papier(a.cle, `papier-${a.cle}`, '#fbeedd');
    return mini('0 0 100 100', `<defs>${defs}</defs><rect width="100" height="100" rx="12" fill="${fond}"/>`);
  }
  if (a.type === 'piece') {
    const d = DECOR[a.cle];
    const objet = OBJETS[{ chambre: 'lit', salon: 'canape', jeux: 'toboggan', cuisine: 'four' }[a.cle]]; // un objet typique de la pièce
    return mini('0 0 800 520', `<rect width="800" height="390" fill="${d.mur}"/><rect y="380" width="800" height="140" fill="${d.sol}"/>
      <rect x="330" y="60" width="150" height="130" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="10"/>${objet.dessin}`);
  }
  if (a.type === 'cheveux') return mini('0 0 100 100', `<circle cx="50" cy="50" r="34" fill="${CHEVEUX[a.cle]}"/>`);
  if (a.type === 'accessoire') {
    const acc = [...new Set([...(profil.avatar.accessoires ?? []), a.cle])];
    return dessinerAvatar({ ...profil.avatar, accessoires: acc }, ['collier', 'bracelet'].includes(a.cle) ? 'corps' : 'tete');
  }
  return dessinerAvatar({ ...profil.avatar, [a.type]: a.cle }, a.type === 'tenue' ? 'corps' : 'tete');
}

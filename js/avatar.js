// Avatar enfant dessiné en SVG (contours, ombres, reflets), à partir de : peau, yeux, coiffure, couleur
// des cheveux, tenue, accessoires (bijoux, sac…), chaussures et chapeau. Il s'adapte à l'âge (plus jeune = plus petite, tête plus grosse).

export const PEAUX = {
  'tres-claire': '#fde7d6', claire: '#f6cfb0', doree: '#e6b088', mate: '#c98e62', brune: '#9a6342', foncee: '#6b4430',
};
export const CHEVEUX = {
  noir: '#2e2220', brun: '#5e3b26', chatain: '#94623a', blond: '#edc76a', roux: '#cc5a2c',
  rose: '#f07eb4', bleu: '#5b8ee6', violet: '#9b6ad8',
  platine: '#f3e2b0', auburn: '#8f3b1b', vert: '#4cc38a', turquoise: '#2bc4c4',
};
export const YEUX = {
  marron: '#6b4226', noisette: '#9a7330', bleus: '#3f86d8', verts: '#3f9d5e', gris: '#7d8d99', noirs: '#2a2230',
};
export const COIFFURES = {
  courts: 'Courts', carre: 'Carré', longs: 'Longs', boucles: 'Bouclés', queue: 'Queue de cheval',
  tresses: 'Tresses', chignon: 'Chignon', afro: 'Afro', couettes: 'Couettes', macarons: 'Deux macarons', ondules: 'Longs ondulés',
  'mi-longs': 'Mi-longs', frange: 'Frange droite', 'tresse-cote': 'Tresse sur le côté', chignons: 'Deux chignons hauts',
};
// Ce qui se gagne chez le coiffeur (prix en étoiles). Le reste est au choix dès le départ.
export const PRIX_LOOK = {
  coiffure: { couettes: 12, macarons: 12, ondules: 15, 'mi-longs': 10, frange: 12, 'tresse-cote': 14, chignons: 15 },
  cheveux: { rose: 10, bleu: 10, violet: 10, platine: 10, auburn: 10, vert: 12, turquoise: 12 },
};
// forme : robe, jupe, short ou pantalon. Avec un prix : à gagner à la boutique.
export const TENUES = {
  'tshirt-bleu': { nom: 'T-shirt bleu', forme: 'short', haut: '#4a90d9', bas: '#3b5b8c' },
  'robe-rose': { nom: 'Robe rose', forme: 'robe', haut: '#f27aa8', col: true },
  'sweat-vert': { nom: 'Sweat vert', forme: 'pantalon', haut: '#5cc08a', bas: '#4a5a8a' },
  'salopette-jaune': { nom: 'Salopette jaune', forme: 'pantalon', haut: '#ffffff', bas: '#f2c230', bretelles: true },
  'robe-jaune': { nom: 'Robe jaune', forme: 'robe', haut: '#ffd257', col: true },
  'tshirt-rouge': { nom: 'T-shirt rouge et jupe', forme: 'jupe', haut: '#e05252', bas: '#5b7fd6' },
  'pull-violet': { nom: 'Pull violet', forme: 'pantalon', haut: '#9b7ae0', bas: '#3b5b8c' },
  'tshirt-turquoise': { nom: 'T-shirt turquoise', forme: 'short', haut: '#2bb3a0', bas: '#f2f2f2' },
  princesse: { nom: 'Robe de princesse', forme: 'robe', haut: '#a066d8', motif: 'etoiles', col: true, prix: 25 },
  heroine: { nom: 'Super-héroïne', forme: 'pantalon', haut: '#3a6fd8', bas: '#3a6fd8', cape: '#e03a3a', motif: 'eclair', prix: 25 },
  sport: { nom: 'Maillot de foot', forme: 'short', haut: '#e03a3a', bas: '#ffffff', motif: 'numero', prix: 15 },
  pyjama: { nom: 'Pyjama à pois', forme: 'pantalon', haut: '#9fd3f5', bas: '#9fd3f5', motif: 'pois', prix: 15 },
  fleurs: { nom: 'Robe à fleurs', forme: 'robe', haut: '#8fd3a8', motif: 'fleurs', col: true, prix: 18 },
  danseuse: { nom: 'Tenue de danseuse', forme: 'robe', haut: '#ffc2dc', motif: 'paillettes', prix: 20 },
  mariniere: { nom: 'Marinière', forme: 'pantalon', haut: '#ffffff', bas: '#e05252', motif: 'rayures', prix: 15 },
  jean: { nom: 'Veste en jean', forme: 'jupe', haut: '#5b84c4', bas: '#2e3f66', motif: 'boutons', prix: 18 },
  'sweat-orange': { nom: 'Sweat orange', forme: 'pantalon', haut: '#f39c12', bas: '#3b5b8c', prix: 12 },
  'short-fleuri': { nom: 'Short fleuri', forme: 'short', haut: '#ffd257', bas: '#4a90d9', motif: 'fleurs', prix: 14 },
  'jupe-pois': { nom: 'Jupe à pois', forme: 'jupe', haut: '#e05252', bas: '#2e3f66', motif: 'pois', prix: 15 },
  'robe-rayee': { nom: 'Robe à rayures', forme: 'robe', haut: '#7ad0f0', motif: 'rayures', col: true, prix: 18 },
  'tenue-ski': { nom: 'Tenue de ski', forme: 'pantalon', haut: '#e05252', bas: '#2e3f66', motif: 'boutons', prix: 20 },
  'ensemble-rose': { nom: 'Ensemble à paillettes', forme: 'pantalon', haut: '#ff8fb8', bas: '#ff8fb8', motif: 'paillettes', prix: 22 },
  'robe-nuit': { nom: 'Robe nuit étoilée', forme: 'robe', haut: '#2e3f78', motif: 'etoiles', col: true, prix: 25 },
  'robe-soiree': { nom: 'Robe de soirée', forme: 'robe', haut: '#c0392b', motif: 'paillettes', prix: 30 },
};
// Bijoux et accessoires : on peut en porter plusieurs à la fois. Tous à gagner à la boutique.
export const ACCESSOIRES = {
  'boucles-oreilles': { nom: "Boucles d'oreilles", prix: 6 },
  bracelet: { nom: 'Bracelets', prix: 6 },
  'serre-tete': { nom: 'Serre-tête', prix: 6 },
  noeud: { nom: 'Gros nœud', prix: 6 },
  collier: { nom: 'Collier de perles', prix: 8 },
  lunettes: { nom: 'Lunettes', prix: 8 },
  couronne: { nom: 'Couronne', prix: 20 },
  barrettes: { nom: 'Barrettes', prix: 6 },
  echarpe: { nom: 'Écharpe', prix: 10 },
  montre: { nom: 'Montre', prix: 12 },
  'lunettes-soleil': { nom: 'Lunettes de soleil', prix: 12 },
  sac: { nom: 'Sac à main', prix: 15 },
};
// Chaussures (une paire à la fois) : les baskets rouges sont celles du départ
export const CHAUSSURES = {
  'baskets-rouges': { nom: 'Baskets rouges', forme: 'basket', couleur: '#e2445c', prix: 0 },
  'baskets-bleues': { nom: 'Baskets bleues', forme: 'basket', couleur: '#4a90d9', prix: 10 },
  sandales: { nom: 'Sandales', forme: 'sandale', couleur: '#c98b4f', prix: 10 },
  ballerines: { nom: 'Ballerines', forme: 'ballerine', couleur: '#ff8fb8', prix: 12 },
  'bottes-pluie': { nom: 'Bottes de pluie', forme: 'botte', couleur: '#f2c230', prix: 12 },
  'bottes-cuir': { nom: 'Bottes en cuir', forme: 'botte', couleur: '#7a4a28', prix: 16 },
  'baskets-or': { nom: 'Baskets dorées', forme: 'basket', couleur: '#e6b422', prix: 20 },
};
// Chapeaux (un à la fois, ou aucun)
export const CHAPEAUX = {
  casquette: { nom: 'Casquette', couleur: '#e05252', prix: 10 },
  bonnet: { nom: 'Bonnet à pompon', couleur: '#5b9ae0', prix: 10 },
  beret: { nom: 'Béret', couleur: '#c0392b', prix: 12 },
  'chapeau-paille': { nom: 'Chapeau de paille', couleur: '#e8c27a', prix: 14 },
  'couronne-fleurs': { nom: 'Couronne de fleurs', couleur: '#ff8fb8', prix: 16 },
  sorciere: { nom: 'Chapeau de sorcière', couleur: '#6a4ab0', prix: 18 },
};

const gratuits = (liste, prix = {}) => Object.keys(liste).filter((k) => !prix[k]);
export const TENUES_DE_DEPART = Object.keys(TENUES).filter((k) => !TENUES[k].prix);
export const COIFFURES_DE_DEPART = gratuits(COIFFURES, PRIX_LOOK.coiffure);
export const CHEVEUX_DE_DEPART = gratuits(CHEVEUX, PRIX_LOOK.cheveux);

export const AVATAR_PAR_DEFAUT = { peau: 'claire', yeux: 'marron', coiffure: 'longs', cheveux: 'chatain', tenue: 'tshirt-bleu', accessoires: [] };
export const AGE_MIN = 3, AGE_MAX = 14;

export function avatarValide(a) {
  const acc = a?.accessoires ?? [];
  return !!a && a.peau in PEAUX && a.yeux in YEUX && a.coiffure in COIFFURES && a.cheveux in CHEVEUX && a.tenue in TENUES
    && Array.isArray(acc) && acc.every((x) => x in ACCESSOIRES) && new Set(acc).size === acc.length
    && (a.chaussures == null || a.chaussures in CHAUSSURES) && (a.chapeau == null || a.chapeau in CHAPEAUX);
}

// Éclaircir (k > 0) ou assombrir (k < 0) une couleur #rrggbb
export function teinte(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const L = 'stroke-linecap="round" stroke-linejoin="round"';

// Contour en « nuage » : relie les points (sens des aiguilles d'une montre) par des arcs bombés vers l'extérieur.
function nuage(points, bombe = 0.62) {
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i <= points.length; i++) {
    const [x1, y1] = points[i - 1], [x2, y2] = points[i % points.length];
    const r = (Math.hypot(x2 - x1, y2 - y1) * bombe).toFixed(1);
    d += ` A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return `${d}Z`;
}
// Points sur une ellipse, d'un angle à l'autre (degrés, 0 = à droite, sens horaire à l'écran)
const ellipse = (cx, cy, rx, ry, de, a, n) => Array.from({ length: n + 1 }, (_, i) => {
  const t = ((de + ((a - de) * i) / n) * Math.PI) / 180;
  return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
});

function coiffure(style, c) {
  const o = teinte(c, -0.4), r = teinte(c, 0.35);
  const trait = `fill="${c}" stroke="${o}" stroke-width="3" ${L}`;
  const reflet = (d) => `<path d="${d}" fill="none" stroke="${r}" stroke-width="5" opacity=".75" ${L}/>`;
  const calotte = `<path d="M57 126 C50 64 88 40 120 40 C152 40 190 64 183 126 C176 100 152 84 120 84 C88 84 64 100 57 126Z" ${trait}/>`
    + `<path d="M120 42 Q117 62 114 84" fill="none" stroke="${o}" stroke-width="2.5" ${L}/>`
    + reflet('M80 62 Q94 50 108 48') + reflet('M132 48 Q150 52 162 66');
  const frangeCote = `<path d="M57 124 C52 66 90 42 124 42 C162 42 190 68 183 120 C172 96 152 82 132 78 C116 96 90 110 57 124Z" ${trait}/>`
    + reflet('M86 58 Q110 46 140 52');
  const tire = `<path d="M57 124 C50 64 88 40 120 40 C154 40 188 62 183 124 C176 92 150 74 120 74 C92 74 64 92 57 124Z" ${trait}/>` + reflet('M84 56 Q110 44 146 50');
  const elastique = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#ff5d8f" stroke="#c43a68" stroke-width="2.5"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#ffd0e0"/>`;
  const boucle = (x, y, sens = 1) => `<path d="M${x} ${y} a6 6 0 1 ${sens > 0 ? 1 : 0} ${8 * sens} 5" fill="none" stroke="${o}" stroke-width="2.4" opacity=".7" ${L}/>`;

  const tresse = (x, dir) => Array.from({ length: 6 }, (_, i) => {
    const y = 150 + i * 18;
    return `<ellipse cx="${x + (i % 2 ? 4 : -4) * dir}" cy="${y}" rx="${13 - i * 0.6}" ry="12" transform="rotate(${(i % 2 ? 28 : -28) * dir} ${x} ${y})" ${trait}/>`;
  }).join('') + `<path d="M${x - 6} 262 Q${x} 280 ${x + 6} 262" ${trait}/>` + elastique(x, 258);

  switch (style) {
    case 'mi-longs': return {
      derriere: `<path d="M54 116 C50 58 90 38 120 38 C152 38 192 58 186 116 L190 214 Q174 224 160 216 L80 216 Q66 224 50 214Z" ${trait}/>`,
      devant: frangeCote,
    };
    case 'frange': return {
      derriere: `<path d="M56 110 C52 56 90 38 122 38 C158 38 190 58 186 110 L192 238 C194 256 178 266 164 258 L152 250 L90 250 L76 258 C62 266 46 256 48 238Z" ${trait}/>`,
      devant: `<path d="M57 124 C52 62 90 40 120 40 C152 40 188 62 183 124 L178 104 Q120 96 62 104Z" ${trait}/>` + reflet('M84 58 Q110 46 146 52'),
    };
    case 'tresse-cote': return { derriere: `<path d="M150 60 C190 70 192 120 180 150" fill="none" stroke="${c}" stroke-width="16" ${L}/>` + tresse(182, -1), devant: tire };
    case 'chignons': return {
      derriere: `<circle cx="80" cy="42" r="22" ${trait}/><circle cx="160" cy="42" r="22" ${trait}/>`
        + `<path d="M70 38 Q80 28 92 36 M170 38 Q160 28 148 36" fill="none" stroke="${o}" stroke-width="2.5" ${L}/>`,
      devant: calotte,
    };
    case 'longs': return {
      derriere: `<path d="M56 110 C52 56 90 38 122 38 C158 38 190 58 186 110 L192 238 C194 256 178 266 164 258 L152 250 L90 250 L76 258 C62 266 46 256 48 238Z" ${trait}/>`
        + `<path d="M62 150 L58 236 M178 150 L184 236" stroke="${o}" stroke-width="2.5" opacity=".5" fill="none" ${L}/>`,
      devant: frangeCote,
    };
    case 'ondules': return {
      derriere: `<path d="M56 110 C52 56 90 38 122 38 C158 38 190 58 186 110 C196 140 180 160 192 184 C204 208 186 226 196 250 C186 266 168 262 160 256 L80 256 C72 262 54 266 44 250 C54 226 36 208 48 184 C60 160 44 140 56 110Z" ${trait}/>`
        + `<path d="M58 140 C66 160 52 176 60 196 C68 214 56 228 62 244 M182 140 C174 160 188 176 180 196 C172 214 184 228 178 244" stroke="${o}" stroke-width="2.5" opacity=".5" fill="none" ${L}/>`,
      devant: frangeCote,
    };
    case 'carre': return {
      derriere: `<path d="M54 116 C50 58 90 38 120 38 C152 38 192 58 186 116 L190 182 Q176 192 160 186 L80 186 Q64 192 50 182Z" ${trait}/>`,
      devant: `<path d="M57 124 C52 62 90 40 120 40 C152 40 188 62 183 124 L178 98 Q120 88 62 98Z" ${trait}/>` + reflet('M84 58 Q110 46 146 52'),
    };
    case 'boucles': {
      const frange = nuage([...ellipse(120, 116, 68, 76, 194, 346, 10), [176, 102], [158, 92], [139, 88], [120, 91], [101, 88], [82, 92], [64, 102]], 0.5);
      return {
        derriere: `<path d="${nuage(ellipse(120, 138, 88, 112, 180, 540, 28), 0.58)}" ${trait}/>`
          + [[44, 150, 1], [42, 184, 1], [50, 216, 1], [62, 240, 1], [188, 150, -1], [192, 184, -1], [184, 216, -1], [172, 240, -1]].map(([x, y, d]) => boucle(x, y, d)).join(''),
        devant: `<path d="${frange}" ${trait}/>`
          + [[78, 72, 1], [100, 58, 1], [124, 54, 1], [146, 60, -1], [166, 74, -1], [86, 86, 1], [152, 86, -1]].map(([x, y, d]) => boucle(x, y, d)).join('')
          + reflet('M96 50 Q110 44 124 46'),
      };
    }
    case 'afro': return {
      derriere: `<path d="${nuage(ellipse(120, 104, 98, 88, 180, 540, 26), 0.6)}" ${trait}/>`,
      devant: `<path d="${nuage([...ellipse(120, 110, 66, 72, 188, 352, 10), [176, 98], [150, 84], [120, 82], [90, 84], [64, 98]], 0.55)}" ${trait}/>` + reflet('M84 52 Q100 40 118 40'),
    };
    case 'couettes': return {
      derriere: `<path d="M58 96 C30 104 18 150 26 186 C30 204 48 206 52 190 C58 160 52 130 66 106Z" ${trait}/>`
        + `<path d="M182 96 C210 104 222 150 214 186 C210 204 192 206 188 190 C182 160 188 130 174 106Z" ${trait}/>`
        + reflet('M36 140 Q32 160 36 178') + reflet('M204 140 Q208 160 204 178'),
      devant: calotte + elastique(62, 100) + elastique(178, 100),
    };
    case 'macarons': return {
      derriere: `<circle cx="62" cy="58" r="26" ${trait}/><circle cx="178" cy="58" r="26" ${trait}/>`
        + `<path d="M50 54 Q62 40 76 50 M190 54 Q178 40 164 50" fill="none" stroke="${o}" stroke-width="2.5" ${L}/>`,
      devant: calotte,
    };
    case 'queue': return {
      derriere: `<path d="M168 60 C214 62 222 120 206 170 C198 196 210 222 190 236 C192 206 178 186 184 150 C188 118 182 92 160 80Z" ${trait}/>` + reflet('M200 100 Q210 130 200 170'),
      devant: tire + `<path d="M72 96 Q96 70 132 70 M150 74 Q170 84 176 102" fill="none" stroke="${o}" stroke-width="2" opacity=".6" ${L}/>` + elastique(170, 74),
    };
    case 'tresses': return { derriere: tresse(58, 1) + tresse(182, -1), devant: calotte };
    case 'chignon': return {
      derriere: `<circle cx="120" cy="34" r="26" ${trait}/><path d="M104 28 Q120 14 136 28" fill="none" stroke="${o}" stroke-width="2.5" ${L}/>` + reflet('M108 20 Q118 14 128 18'),
      devant: tire,
    };
    case 'courts': default: return {
      derriere: `<path d="M54 120 C50 58 90 38 120 38 C152 38 192 58 186 120 C188 150 182 172 170 178 L70 178 C58 172 52 150 54 120Z" ${trait}/>`,
      devant: frangeCote,
    };
  }
}

// Motifs dessinés sur le haut de la tenue
const MOTIFS = {
  etoiles: () => [[100, 226], [140, 236], [118, 280], [96, 290], [146, 288]].map(([x, y]) =>
    `<path d="M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y - 2} L${x + 3} ${y + 1} L${x + 4} ${y + 6} L${x} ${y + 3} L${x - 4} ${y + 6} L${x - 3} ${y + 1} L${x - 6} ${y - 2} L${x - 2} ${y - 2}Z" fill="#ffd84a"/>`).join(''),
  eclair: () => '<path d="M124 214 L106 240 L118 240 L110 262 L134 232 L122 232 L130 214Z" fill="#ffd84a" stroke="#c99a10" stroke-width="2" stroke-linejoin="round"/>',
  numero: () => '<text x="120" y="250" font-size="30" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">10</text>',
  pois: () => [[98, 220], [126, 232], [146, 216], [104, 250], [140, 254], [120, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join(''),
  fleurs: () => [[100, 230], [138, 228], [96, 284], [124, 270], [150, 290]].map(([x, y]) =>
    `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(5 * Math.cos((a * Math.PI) / 180)).toFixed(1)}" cy="${(5 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" r="3.6" fill="#fff"/>`).join('')}<circle r="3" fill="#ffd84a"/></g>`).join(''),
  paillettes: () => [[96, 224], [118, 214], [142, 226], [106, 280], [134, 286], [120, 300], [90, 300], [150, 298]].map(([x, y]) =>
    `<path d="M${x} ${y - 5} L${x + 1.5} ${y - 1.5} L${x + 5} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 5} L${x - 1.5} ${y + 1.5} L${x - 5} ${y} L${x - 1.5} ${y - 1.5}Z" fill="#fff"/>`).join(''),
  rayures: () => [216, 230, 244, 258].map((y) => `<path d="M84 ${y} H156" stroke="#2e4f9a" stroke-width="6"/>`).join(''),
  boutons: () => '<path d="M120 204 V266" stroke="#2e3f66" stroke-width="2.5"/>' + [222, 240, 258].map((y) => `<circle cx="126" cy="${y}" r="3" fill="#f2c230"/>`).join(''),
};

// Une paire de chaussures : le pied gauche, et son miroir pour le pied droit
function chaussures(cle) {
  const { forme, couleur } = CHAUSSURES[cle] ?? CHAUSSURES['baskets-rouges'], o = teinte(couleur, -0.3), r = teinte(couleur, 0.35);
  const pied = {
    basket: `<path d="M86 366 Q86 354 102 356 Q114 356 114 368 Q114 376 100 376 L90 376 Q84 376 86 366Z" fill="${couleur}" stroke="${o}" stroke-width="2.5"/><path d="M90 360 q6 -3 12 -2" stroke="${r}" stroke-width="2.5" fill="none" ${L}/><path d="M86 372 H114" stroke="#fff" stroke-width="2.5"/>`,
    botte: `<path d="M90 332 H113 V364 Q116 376 102 376 H90 Q84 376 86 366Z" fill="${couleur}" stroke="${o}" stroke-width="2.5" ${L}/><path d="M90 340 H113" stroke="${r}" stroke-width="3"/>`,
    ballerine: `<path d="M88 368 Q88 361 102 362 Q112 363 112 370 Q112 376 100 376 L92 376 Q86 376 88 368Z" fill="${couleur}" stroke="${o}" stroke-width="2.5"/><path d="M94 364 Q102 359 110 364" stroke="${o}" stroke-width="2" fill="none"/><circle cx="102" cy="364" r="2.5" fill="${r}"/>`,
    sandale: `<path d="M86 372 H114 V377 H86Z" fill="${o}"/><path d="M90 372 L98 360 L106 372 M96 366 H108" stroke="${couleur}" stroke-width="4" fill="none" ${L}/>`,
  }[forme];
  return pied + `<g transform="translate(240 0) scale(-1 1)">${pied}</g>`;
}

// Un chapeau, posé sur les cheveux
function chapeau(cle) {
  const h = CHAPEAUX[cle];
  if (!h) return '';
  const c = h.couleur, o = teinte(c, -0.3), r = teinte(c, 0.3);
  return {
    casquette: `<path d="M62 80 C64 36 92 26 120 26 C148 26 176 36 178 80Z" fill="${c}" stroke="${o}" stroke-width="3"/><path d="M120 72 Q168 64 198 80 Q170 88 120 80Z" fill="${o}"/><circle cx="120" cy="28" r="5" fill="${r}"/>`,
    bonnet: `<path d="M58 86 C58 30 90 16 120 16 C150 16 182 30 182 86Z" fill="${c}" stroke="${o}" stroke-width="3"/><rect x="54" y="74" width="132" height="20" rx="10" fill="${r}" stroke="${o}" stroke-width="2"/><circle cx="120" cy="14" r="11" fill="#fff" stroke="#ddd" stroke-width="2"/>`,
    beret: `<ellipse cx="112" cy="50" rx="62" ry="22" fill="${c}" stroke="${o}" stroke-width="3" transform="rotate(-8 112 50)"/><path d="M114 28 V20" stroke="${o}" stroke-width="4" ${L}/>`,
    'chapeau-paille': `<ellipse cx="120" cy="62" rx="90" ry="16" fill="${c}" stroke="${o}" stroke-width="3"/><path d="M78 62 C78 20 162 20 162 62Z" fill="${c}" stroke="${o}" stroke-width="3"/><path d="M80 54 Q120 62 160 54" stroke="#e05252" stroke-width="7" fill="none"/>`,
    'couronne-fleurs': [[64, 92], [76, 70], [94, 56], [120, 50], [146, 56], [164, 70], [176, 92]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${['#ff8fb8', '#ffd84a', '#ffffff', '#b08ae8'][i % 4]}" stroke="#d07090" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3" fill="#f2a654"/>`).join(''),
    sorciere: `<ellipse cx="120" cy="66" rx="82" ry="14" fill="${c}" stroke="${o}" stroke-width="3"/><path d="M84 64 L136 0 L156 64Z" fill="${c}" stroke="${o}" stroke-width="3" ${L}/><path d="M88 56 Q120 62 152 56" stroke="#ffd84a" stroke-width="6" fill="none"/>`,
  }[cle];
}

function corps(t, p, acc, aux = 'baskets-rouges') {
  const po = teinte(p, -0.25);
  const clair = (c) => (c === '#ffffff' || c === '#f2f2f2' ? '#d8d8e0' : c);
  const o = teinte(clair(t.haut), -0.25);
  const bas = t.bas ?? t.haut, basO = teinte(clair(bas), -0.3);
  const membre = (d, couleur, contour, ep = 19) =>
    `<path d="${d}" fill="none" stroke="${contour}" stroke-width="${ep + 5}" ${L}/><path d="${d}" fill="none" stroke="${couleur}" stroke-width="${ep}" ${L}/>`;
  const jambeC = t.forme === 'pantalon' ? bas : p, jambeO = t.forme === 'pantalon' ? basO : po;
  const jambes = membre('M104 296 L102 360', jambeC, jambeO) + membre('M136 296 L138 360', jambeC, jambeO)
    + (t.forme === 'pantalon' ? '' : '<path d="M93 350 h18 v14 h-18z M129 350 h18 v14 h-18z" fill="#fff" stroke="#d8d8e0" stroke-width="2"/>');
  const pieds = chaussures(aux);
  const bras = membre('M78 216 Q60 244 54 274', p, po, 16) + membre('M162 216 Q180 244 186 274', p, po, 16)
    + `<circle cx="53" cy="278" r="10.5" fill="${p}" stroke="${po}" stroke-width="2.5"/><circle cx="187" cy="278" r="10.5" fill="${p}" stroke="${po}" stroke-width="2.5"/>`
    + (acc.includes('bracelet') ? '<path d="M45 266 Q54 272 63 266 M177 266 Q186 272 195 266" fill="none" stroke="#f2c230" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="270" r="3" fill="#ff5d8f"/><circle cx="186" cy="270" r="3" fill="#5bc0eb"/>' : '');
  const manches = `<path d="M84 202 Q64 208 60 234 Q74 242 86 234 Z" fill="${t.haut}" stroke="${o}" stroke-width="2.5" ${L}/>
    <path d="M156 202 Q176 208 180 234 Q166 242 154 234 Z" fill="${t.haut}" stroke="${o}" stroke-width="2.5" ${L}/>`;
  const col = t.col ? '<path d="M100 198 Q108 214 120 204 Q132 214 140 198 Q120 192 100 198Z" fill="#fff" stroke="#d9d9e2" stroke-width="2.5" stroke-linejoin="round"/>' : '';
  let habit;
  if (t.forme === 'robe') {
    habit = `<path d="M84 202 Q120 192 156 202 L162 246 L178 304 Q120 320 62 304 L78 246Z" fill="${t.haut}" stroke="${o}" stroke-width="3" ${L}/>
      <path d="M80 250 Q120 260 160 250" fill="none" stroke="${o}" stroke-width="3" ${L}/>
      <path d="M92 274 L88 306 M120 268 V312 M148 274 L152 306" stroke="${o}" stroke-width="2" opacity=".5" ${L}/>`;
  } else {
    const dessous = t.forme === 'jupe'
      ? `<path d="M80 262 L160 262 L176 304 Q120 316 64 304Z" fill="${bas}" stroke="${basO}" stroke-width="3" ${L}/><path d="M100 266 L94 306 M120 266 V310 M140 266 L146 306" stroke="${basO}" stroke-width="2" opacity=".6" ${L}/>`
      : t.forme === 'short'
        ? `<path d="M82 258 L158 258 L160 296 L124 298 L120 284 L116 298 L80 296Z" fill="${bas}" stroke="${basO}" stroke-width="3" ${L}/>`
        : `<path d="M82 258 L158 258 L160 306 L124 306 L120 290 L116 306 L80 306Z" fill="${bas}" stroke="${basO}" stroke-width="3" ${L}/>`;
    const bretelles = t.bretelles
      ? `<path d="M92 226 H148 V262 H92Z" fill="${bas}" stroke="${basO}" stroke-width="3" ${L}/><path d="M94 204 L96 228 M146 204 L144 228" stroke="${bas}" stroke-width="7" ${L}/><circle cx="97" cy="230" r="3" fill="#fff"/><circle cx="143" cy="230" r="3" fill="#fff"/>`
      : '';
    habit = dessous + `<path d="M84 202 Q120 192 156 202 L162 266 Q120 274 78 266Z" fill="${t.haut}" stroke="${o}" stroke-width="3" ${L}/>
      <path d="M106 198 Q120 210 134 198" fill="none" stroke="${o}" stroke-width="3" ${L}/>${bretelles}`;
  }
  const collier = acc.includes('collier')
    ? [-15, -9, -3, 3, 9, 15].map((dx) => `<circle cx="${120 + dx}" cy="${(212 - Math.abs(dx) * 0.3).toFixed(1)}" r="3.4" fill="#fffaf0" stroke="#d8cdb8" stroke-width="1.2"/>`).join('')
    : '';
  const cape = t.cape ? `<path d="M84 200 L46 340 Q120 360 194 340 L156 200Z" fill="${t.cape}" stroke="${teinte(t.cape, -0.3)}" stroke-width="3" ${L}/>` : '';
  const echarpe = acc.includes('echarpe') ? '<path d="M96 196 Q120 212 144 196 L146 208 Q120 224 94 208Z" fill="#e05252" stroke="#a83a3a" stroke-width="2"/><path d="M130 210 L138 248 L126 250 L122 214Z" fill="#c0392b" stroke="#a83a3a" stroke-width="2"/>' : '';
  const sac = acc.includes('sac') ? '<path d="M150 204 Q172 240 180 280" stroke="#8a2a3a" stroke-width="4" fill="none"/><rect x="168" y="276" width="30" height="24" rx="6" fill="#c0392b" stroke="#8a2a3a" stroke-width="2.5"/><rect x="180" y="282" width="6" height="5" rx="1" fill="#f2c230"/>' : '';
  const montre = acc.includes('montre') ? '<rect x="178" y="258" width="17" height="10" rx="3" fill="#2b2b3a"/><circle cx="186.5" cy="263" r="4" fill="#fff"/><path d="M186.5 263 V260.5" stroke="#2b2b3a" stroke-width="1.2"/>' : '';
  return { arriere: cape, avant: jambes + pieds + habit + (MOTIFS[t.motif]?.() ?? '') + col + collier + echarpe + sac + bras + montre + manches };
}

function visage(a, p) {
  const po = teinte(p, -0.25), sourcil = teinte(CHEVEUX[a.cheveux], -0.25), iris = YEUX[a.yeux];
  const oeil = (x) => `<ellipse cx="${x}" cy="130" rx="12" ry="14.5" fill="#fff" stroke="${po}" stroke-width="1.5"/>
    <circle cx="${x + 1}" cy="132" r="9.5" fill="${iris}"/><circle cx="${x + 1}" cy="132" r="9.5" fill="url(#iris)" opacity=".35"/>
    <circle cx="${x + 1}" cy="133" r="4.6" fill="#1a1418"/>
    <circle cx="${x + 4.5}" cy="127.5" r="3.4" fill="#fff"/><circle cx="${x - 2.5}" cy="136.5" r="1.6" fill="#fff"/>
    <path d="M${x - 13} 124 Q${x} 112 ${x + 13} 123" fill="none" stroke="#2a1d1a" stroke-width="3.2" ${L}/>`;
  return `
    <ellipse cx="57" cy="132" rx="10" ry="13" fill="${p}" stroke="${po}" stroke-width="3"/><path d="M57 126 q-4 6 0 12" stroke="${po}" stroke-width="2" fill="none" ${L}/>
    <ellipse cx="183" cy="132" rx="10" ry="13" fill="${p}" stroke="${po}" stroke-width="3"/><path d="M183 126 q4 6 0 12" stroke="${po}" stroke-width="2" fill="none" ${L}/>
    <path d="M58 122 C58 72 88 52 120 52 C152 52 182 72 182 122 C182 164 156 188 120 188 C84 188 58 164 58 122Z" fill="${p}" stroke="${po}" stroke-width="3"/>
    ${oeil(96)}${oeil(144)}
    <path d="M84 108 Q96 102 106 107 M134 107 Q144 102 156 108" fill="none" stroke="${sourcil}" stroke-width="3.5" ${L}/>
    <path d="M118 146 Q123 151 117 154" fill="none" stroke="${po}" stroke-width="2.5" ${L}/>
    <ellipse cx="80" cy="156" rx="11" ry="7" fill="#ff7f8a" opacity=".3"/><ellipse cx="160" cy="156" rx="11" ry="7" fill="#ff7f8a" opacity=".3"/>
    <path d="M106 162 Q120 176 134 162 Q120 167 106 162Z" fill="#a8383c" stroke="#7a2228" stroke-width="2" ${L}/>
    <path d="M113 168 Q120 173 127 168 Q120 166 113 168Z" fill="#f2848a"/>`;
}

// Accessoires portés sur la tête (dessinés par-dessus les cheveux)
function accessoiresTete(acc) {
  let s = '';
  if (acc.includes('boucles-oreilles')) s += '<circle cx="57" cy="149" r="5" fill="#f2c230" stroke="#b8860b" stroke-width="1.5"/><circle cx="183" cy="149" r="5" fill="#f2c230" stroke="#b8860b" stroke-width="1.5"/>';
  if (acc.includes('lunettes')) s += `<g fill="#ffffff22" stroke="#c0392b" stroke-width="3.5"><circle cx="96" cy="131" r="17"/><circle cx="144" cy="131" r="17"/></g><path d="M113 129 Q120 124 127 129 M79 128 L62 124 M161 128 L178 124" fill="none" stroke="#c0392b" stroke-width="3.5" ${L}/>`;
  if (acc.includes('serre-tete')) s += `<path d="M60 104 C64 56 92 44 120 44 C148 44 176 56 180 104" fill="none" stroke="#ff5d8f" stroke-width="8" ${L}/>`;
  if (acc.includes('noeud')) s += '<g transform="translate(160 60) rotate(20)"><path d="M0 0 L-24 -14 L-24 14Z M0 0 L24 -14 L24 14Z" fill="#ff5d8f" stroke="#c43a68" stroke-width="2.5" stroke-linejoin="round"/><circle r="6" fill="#ff8fb0" stroke="#c43a68" stroke-width="2.5"/></g>';
  if (acc.includes('lunettes-soleil')) s += `<g fill="#2b2b3a" fill-opacity=".85" stroke="#2b2b3a" stroke-width="3"><rect x="78" y="118" width="36" height="26" rx="10"/><rect x="126" y="118" width="36" height="26" rx="10"/></g><path d="M114 128 H126 M79 126 L62 122 M161 126 L178 122" fill="none" stroke="#2b2b3a" stroke-width="3.5" ${L}/>`;
  if (acc.includes('barrettes')) s += '<rect x="80" y="64" width="18" height="7" rx="3" fill="#5bc0eb" transform="rotate(-30 89 67)"/><rect x="96" y="56" width="18" height="7" rx="3" fill="#ffd84a" transform="rotate(-20 105 59)"/>';
  if (acc.includes('couronne')) s += '<path d="M88 46 L84 14 L102 30 L120 8 L138 30 L156 14 L152 46Z" fill="#ffd84a" stroke="#c99a10" stroke-width="3" stroke-linejoin="round"/><circle cx="120" cy="34" r="5" fill="#e0457b"/><circle cx="100" cy="38" r="3.5" fill="#5bc0eb"/><circle cx="140" cy="38" r="3.5" fill="#5bc0eb"/>';
  return s;
}

const CADRES = { entier: '0 0 240 390', tete: '24 0 192 200', corps: '30 186 180 200' };

// Proportions selon l'âge : plus jeune = plus petite, tête plus grosse, corps plus court.
export function proportions(age) {
  const k = Math.min(1, Math.max(0, (age - 4) / 8)); // 0 à 4 ans, 1 à 12 ans
  return { k, taille: 0.82 + 0.18 * k, tete: 1.1 - 0.16 * k, corps: 0.78 + 0.26 * k };
}

export function dessinerAvatar(a, cadre = 'entier', age = 8) {
  if (!avatarValide(a)) a = AVATAR_PAR_DEFAUT;
  const acc = a.accessoires ?? [];
  const peau = PEAUX[a.peau];
  const { derriere, devant } = coiffure(a.coiffure, CHEVEUX[a.cheveux]);
  const { arriere, avant } = corps(TENUES[a.tenue], peau, acc, a.chaussures);
  // les aperçus (tête, tenue) gardent des proportions fixes ; l'âge ne change que le personnage entier
  const p = cadre === 'entier' ? proportions(age) : { taille: 1, tete: 1, corps: 1 };
  const pieds = 196 + (378 - 196) * p.corps;
  const tete = `translate(120 196) scale(${p.tete}) translate(-120 -196)`;
  const tout = `translate(120 378) scale(${p.taille}) translate(-120 ${-pieds})`; // pieds toujours en bas
  return `<svg viewBox="${CADRES[cadre]}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="avatar-svg">
    <defs><radialGradient id="iris" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient></defs>
    ${cadre === 'entier' ? '<ellipse cx="120" cy="380" rx="56" ry="8" fill="#000" opacity=".12"/>' : ''}
    <g transform="${tout}">
      <g transform="${tete}">${derriere}</g>
      <g transform="translate(0 196) scale(1 ${p.corps}) translate(0 -196)">
        ${arriere}
        <path d="M108 176 h24 v26 q-12 8 -24 0z" fill="${peau}" stroke="${teinte(peau, -0.25)}" stroke-width="3"/>
        ${avant}
      </g>
      <g transform="${tete}">${visage(a, peau)}${devant}${accessoiresTete(acc)}${chapeau(a.chapeau)}</g>
    </g>
  </svg>`;
}

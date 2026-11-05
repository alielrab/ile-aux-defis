// L'atelier de peinture : peinture libre au doigt, coloriage, coloriage magique (sons pour les petits, calculs pour les grands),
// une galerie de 12 dessins au plus, des tableaux accrochés dans la maison, de nouveaux dessins à débloquer avec des étoiles.
import { melanger, etoilesDuJeu } from '../partie.js';

export const GALERIE_MAX = 12; // les peintures libres sont de petites images : la place sur la tablette est limitée
export const etoilesParZone = (age) => etoilesDuJeu('peinture', age); // coloriage magique seulement

// [clé, nom (dit à voix haute), couleur]
export const COULEURS = [
  ['rouge', 'rouge', '#e74c3c'], ['orange', 'orange', '#f39c12'], ['jaune', 'jaune', '#f7d038'], ['vert', 'vert', '#4caf50'],
  ['bleuClair', 'bleu ciel', '#8fd3f4'], ['bleu', 'bleu', '#2f6fd0'], ['bleuFonce', 'bleu nuit', '#1d2a5a'], ['violet', 'violet', '#8e44ad'],
  ['rose', 'rose', '#f48fb1'], ['marron', 'marron', '#8a5a30'], ['beige', 'beige', '#f0d9a8'], ['gris', 'gris', '#b0b7c0'],
  ['noir', 'noir', '#2b2b3a'], ['blanc', 'blanc', '#ffffff'],
];
export const couleur = (cle) => COULEURS.find(([c]) => c === cle);

// Les dessins à colorier (viewBox 0 0 400 300). zones : [id, forme SVG, couleur « vraie » (coloriage magique), [x, y] de l'étiquette].
// deco : les petits détails dessinés par-dessus (yeux, tiges), qu'on ne colorie pas. prix : en étoiles (0 = dès le départ).
const R = (x, y, l, h) => `<rect x="${x}" y="${y}" width="${l}" height="${h}"/>`;
const C = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
const E = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
const P = (d) => `<path d="${d}"/>`;

export const MODELES = {
  maison: { nom: 'La maison', prix: 0, zones: [
    ['ciel', R(0, 0, 400, 215), 'bleuClair', [55, 40]], ['soleil', C(335, 55, 32), 'jaune', [335, 56]],
    ['herbe', R(0, 215, 400, 85), 'vert', [60, 262]], ['chemin', P('M188 240 H218 L248 300 H160Z'), 'beige', [204, 282]],
    ['mur', R(120, 130, 165, 110), 'rose', [150, 225]], ['toit', P('M104 136 L202 66 L300 136Z'), 'rouge', [202, 113]],
    ['porte', R(186, 178, 36, 62), 'marron', [204, 212]], ['fenetre1', R(132, 152, 38, 34), 'bleuClair', [151, 170]],
    ['fenetre2', R(236, 152, 38, 34), 'bleuClair', [255, 170]]],
    deco: '<circle cx="214" cy="212" r="3" fill="#2b2b3a"/><path d="M151 152 V186 M132 169 H170 M255 152 V186 M236 169 H274" stroke="#2b2b3a" stroke-width="2"/>' },
  poisson: { nom: 'Le poisson', prix: 0, zones: [
    ['eau', R(0, 0, 400, 255), 'bleuClair', [320, 40]], ['sable', R(0, 255, 400, 45), 'beige', [330, 280]],
    ['algue', P('M40 255 Q20 200 45 160 Q60 200 50 255Z'), 'vert', [42, 215]],
    ['queue', P('M292 150 L372 92 L372 208Z'), 'jaune', [346, 150]], ['corps', E(190, 150, 112, 66), 'orange', [205, 168]],
    ['nageoire1', P('M165 92 L212 52 L238 96Z'), 'rouge', [207, 81]], ['nageoire2', P('M168 208 L204 248 L228 206Z'), 'rouge', [203, 222]],
    ['bulle1', C(95, 55, 20), 'blanc', [95, 56]], ['bulle2', C(60, 105, 16), 'blanc', [60, 106]]],
    deco: '<circle cx="118" cy="138" r="13" fill="#fff" stroke="#2b2b3a" stroke-width="3"/><circle cx="114" cy="138" r="6" fill="#2b2b3a"/><path d="M84 168 Q100 180 116 170" stroke="#2b2b3a" stroke-width="3" fill="none"/>' },
  fleur: { nom: 'La fleur', prix: 0, zones: [
    ['ciel', R(0, 0, 400, 230), 'bleuClair', [50, 40]], ['herbe', R(0, 230, 400, 70), 'vert', [330, 270]],
    ['feuille1', P('M200 200 Q150 170 120 200 Q160 222 200 200Z'), 'vert', [155, 200]], ['feuille2', P('M200 180 Q250 150 280 180 Q240 202 200 180Z'), 'vert', [245, 180]],
    ...[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i * Math.PI) / 3, x = Math.round(200 + 46 * Math.cos(a)), y = Math.round(100 + 46 * Math.sin(a));
      return [`petale${i + 1}`, C(x, y, 30), i % 2 ? 'violet' : 'rose', [x + Math.round(12 * Math.cos(a)), y + Math.round(12 * Math.sin(a))]];
    }),
    ['coeur', C(200, 100, 28), 'jaune', [200, 101]], ['pot', P('M160 240 H240 L228 298 H172Z'), 'orange', [200, 272]]],
    deco: '<path d="M200 178 V240" stroke="#2e7d32" stroke-width="7"/>' },
  papillon: { nom: 'Le papillon', prix: 5, zones: [
    ['ciel', R(0, 0, 400, 250), 'bleuClair', [45, 35]], ['herbe', R(0, 250, 400, 50), 'vert', [60, 278]],
    ['aile1', E(140, 105, 70, 58), 'violet', [118, 92]], ['aile2', E(260, 105, 70, 58), 'violet', [282, 92]],
    ['aile3', E(150, 190, 52, 42), 'rose', [140, 198]], ['aile4', E(250, 190, 52, 42), 'rose', [260, 198]],
    ['tache1', C(150, 120, 20), 'jaune', [150, 121]], ['tache2', C(250, 120, 20), 'jaune', [250, 121]]],
    deco: '<ellipse cx="200" cy="148" rx="12" ry="70" fill="#2b2b3a"/><path d="M196 82 Q180 40 165 35 M204 82 Q220 40 235 35" stroke="#2b2b3a" stroke-width="4" fill="none"/>' },
  fusee: { nom: 'La fusée', prix: 5, zones: [
    ['nuit', R(0, 0, 400, 300), 'bleuFonce', [50, 270]], ['lune', C(320, 70, 40), 'jaune', [330, 75]],
    ['flamme', P('M172 230 Q200 300 228 230Z'), 'orange', [200, 252]],
    ['aileron1', P('M168 170 L130 232 H172Z'), 'rouge', [158, 214]], ['aileron2', P('M232 170 L270 232 H228Z'), 'rouge', [242, 214]],
    ['corps', P('M168 90 H232 V232 H168Z'), 'gris', [200, 210]], ['nez', P('M168 92 Q200 20 232 92Z'), 'rouge', [200, 72]],
    ['hublot', C(200, 135, 24), 'bleuClair', [200, 136]]],
    deco: '<g fill="#fff">' + [[60, 50], [110, 120], [70, 180], [300, 160], [350, 230], [260, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('') + '</g>' },
  bateau: { nom: 'Le bateau', prix: 5, zones: [
    ['ciel', R(0, 0, 400, 200), 'bleuClair', [50, 40]], ['soleil', C(335, 55, 30), 'jaune', [335, 56]],
    ['mer', R(0, 200, 400, 100), 'bleu', [60, 268]], ['coque', P('M100 200 H300 L270 245 H130Z'), 'marron', [200, 225]],
    ['voile1', P('M195 60 V190 H120Z'), 'blanc', [170, 160]], ['voile2', P('M205 75 V190 H275Z'), 'rouge', [228, 160]],
    ['drapeau', P('M200 40 L232 50 L200 60Z'), 'vert', [212, 51]]],
    deco: '<path d="M200 40 V200" stroke="#5a3a20" stroke-width="5"/>' },
  glace: { nom: 'La glace', prix: 8, zones: [
    ['fond', R(0, 0, 400, 300), 'bleuClair', [50, 270]], ['cornet', P('M150 170 H250 L200 292Z'), 'beige', [200, 205]],
    ['boule1', C(165, 155, 42), 'rose', [150, 160]], ['boule2', C(235, 155, 42), 'marron', [250, 160]],
    ['boule3', C(200, 100, 44), 'vert', [200, 108]], ['cerise', C(200, 48, 16), 'rouge', [200, 49]]],
    deco: '<path d="M200 33 Q210 15 225 12" stroke="#2e7d32" stroke-width="3" fill="none"/><path d="M168 182 L232 230 M232 182 L176 240 M184 182 L222 262" stroke="#c09050" stroke-width="2"/>' },
  arcenciel: { nom: "L'arc-en-ciel", prix: 8, zones: [
    ['ciel', R(0, 0, 400, 300), 'bleuClair', [45, 40]],
    ...['rouge', 'orange', 'jaune', 'vert', 'bleu'].map((c, i) => {
      const r1 = 170 - i * 26, r2 = r1 - 26;
      return [`bande${i + 1}`, P(`M${200 - r1} 260 A${r1} ${r1} 0 0 1 ${200 + r1} 260 H${200 + r2} A${r2} ${r2} 0 0 0 ${200 - r2} 260Z`), c, [200, 260 - r1 + 15]];
    }),
    ['nuage1', P('M20 262 Q20 225 60 230 Q75 200 105 222 Q140 220 135 262Z'), 'gris', [78, 248]],
    ['nuage2', P('M265 262 Q262 225 300 230 Q318 200 345 222 Q385 220 380 262Z'), 'gris', [322, 248]]] },
};

// Débloquer un dessin avec ses étoiles (comme dans les magasins)
export const modeleOuvert = (profil, cle) => MODELES[cle].prix === 0 || (profil.modeles ?? []).includes(cle);
export function debloquerModele(profil, cle) {
  if (modeleOuvert(profil, cle)) throw new Error('Ce dessin est déjà à toi.');
  const prix = MODELES[cle].prix;
  if (profil.etoiles < prix) throw new Error(`Il te faut ${prix} étoiles.`);
  profil.etoiles -= prix;
  profil.modeles = [...(profil.modeles ?? []), cle];
}

// ---------- Coloriage magique ----------
const SONS = ['a', 'i', 'o', 'u', 'é', 'ou', 'on', 'an']; // au moins autant que de couleurs dans un dessin
const CONSONNES = ['m', 'l', 'p', 'r', 't', 's', 'n', 'b', 'd', 'f', 'v'];
const entre = (a, b, aleatoire) => a + Math.floor(aleatoire() * (b - a + 1));

// Une opération dont le résultat est n, selon l'âge (8 ans : additions et soustractions ; 9 ans et plus : aussi les tables)
function calculPour(n, age, aleatoire) {
  const facteurs = [];
  for (let a = 2; a <= 10; a++) if (n % a === 0 && n / a >= 2 && n / a <= 10) facteurs.push(a);
  const forme = aleatoire();
  if (age >= 9 && facteurs.length && forme < 0.5) { const a = facteurs[Math.floor(aleatoire() * facteurs.length)]; return `${a} × ${n / a}`; }
  if (forme < 0.75) { const a = entre(1, n - 1, aleatoire); return `${a} + ${n - a}`; }
  const b = entre(1, 9, aleatoire); return `${n + b} − ${b}`;
}

// Pour chaque couleur du dessin, une étiquette sur la palette ; pour chaque zone, une étiquette qui y mène.
// Petits (7 ans et moins) : la palette montre un son (« o »), la zone une syllabe qui le contient (« mo »).
// Grands : la palette montre un nombre, la zone un calcul qui donne ce nombre.
export function magique(cle, age, aleatoire = Math.random) {
  const m = MODELES[cle], couleurs = [...new Set(m.zones.map((z) => z[2]))];
  const petits = age <= 7;
  const valeurs = petits ? melanger(SONS, aleatoire).slice(0, couleurs.length)
    : melanger([6, 8, 10, 12, 14, 15, 16, 18, 20, 24], aleatoire).slice(0, couleurs.length);
  const palette = Object.fromEntries(couleurs.map((c, i) => [c, String(valeurs[i])]));
  const deja = new Set();
  const zones = Object.fromEntries(m.zones.map(([id, , c]) => {
    let texte;
    for (let essai = 0; essai < 50 && (!texte || deja.has(texte)); essai++) {
      texte = petits ? `${CONSONNES[Math.floor(aleatoire() * CONSONNES.length)]}${palette[c]}` : calculPour(Number(palette[c]), age, aleatoire);
    }
    deja.add(texte);
    return [id, texte];
  }));
  return { palette, zones }; // palette : couleur → étiquette ; zones : zone → étiquette
}

export const bonneCouleur = (cle, zone, c) => MODELES[cle].zones.find(([id]) => id === zone)?.[2] === c;
export const etoilesMagique = (cle, age) => Math.round(MODELES[cle].zones.length * etoilesParZone(age) * 2) / 2;

// ---------- Dessins ----------
// Un dessin de modèle : remplissage = { zone: '#couleur' }. etiquettes = { zone: texte } (coloriage magique, zones pas encore justes).
export function dessinerModele(cle, remplissage = {}, etiquettes = {}, { cliquable = false } = {}) {
  const m = MODELES[cle];
  const zones = m.zones.map(([id, forme, , [lx, ly]]) => {
    const fond = remplissage[id] ?? '#ffffff';
    const zone = forme.replace('/>', ` fill="${fond}" stroke="#2b2b3a" stroke-width="2.5"${cliquable ? ` data-zone="${id}" class="zone"` : ''}/>`);
    const texte = etiquettes[id] ? `<text x="${lx}" y="${ly + 6}" class="etiquette-zone" font-size="17" font-weight="800" text-anchor="middle" fill="#2b2b3a" stroke="#fff" stroke-width="4" paint-order="stroke" pointer-events="none">${etiquettes[id]}</text>` : '';
    return zone + texte;
  });
  // les étiquettes passent au-dessus de toutes les zones
  const formes = zones.map((z) => z.replace(/<text[\s\S]*$/, '')).join(''), textes = zones.map((z) => z.match(/<text[\s\S]*$/)?.[0] ?? '').join('');
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="dessin" role="img" aria-label="${m.nom}">${formes}${m.deco ?? ''}${textes}</svg>`;
}

// Un dessin de la galerie, en SVG (pour la galerie, les tableaux de la maison et l'impression).
// dessin : { id, type: 'libre', image } ou { id, type: 'modele', modele, remplissage }
export function dessinerOeuvre(d) {
  if (d.type === 'libre') return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="dessin" role="img" aria-label="Ma peinture"><image href="${d.image}" width="400" height="300"/></svg>`;
  return dessinerModele(d.modele, d.remplissage);
}

// ---------- Galerie et tableaux ----------
export function ajouterOeuvre(profil, oeuvre) {
  profil.dessins ??= [];
  if (profil.dessins.length >= GALERIE_MAX) throw new Error(`Ta galerie est pleine (${GALERIE_MAX} dessins). Enlève un dessin pour faire de la place.`);
  const d = { id: `d${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`, ...oeuvre };
  profil.dessins.push(d);
  return d;
}

export function enleverOeuvre(profil, id) {
  profil.dessins = (profil.dessins ?? []).filter((d) => d.id !== id);
  for (const [piece, d] of Object.entries(profil.maison.tableaux ?? {})) if (d === id) delete profil.maison.tableaux[piece];
}

// Un tableau par pièce, à une place libre du mur
export function accrocher(profil, id, piece) {
  profil.maison.tableaux ??= {};
  if (profil.maison.tableaux[piece] === id) delete profil.maison.tableaux[piece]; // décrocher
  else profil.maison.tableaux[piece] = id;
}

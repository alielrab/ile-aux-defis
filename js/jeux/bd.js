// L'atelier BD : inventer une petite bande dessinée (3 cases pour les 7 ans et moins, 4 pour les grands).
// Dans chaque case : un décor, un personnage à gauche et à droite, une bulle pour chacun, un autocollant.
// Les BD sont gardées dans le profil (8 au plus) ; on peut les relire à voix haute et les imprimer.

export const BD_MAX = 8;
export const TEXTE_MAX = 40;
export const nombreDeCases = (age) => (age <= 7 ? 3 : 4);

// Des phrases toutes faites, lues à voix haute (pour celles qui ne savent pas encore bien écrire)
export const PHRASES = ['Bonjour !', 'Oh non !', 'Hourra !', 'Regarde !', 'J’ai faim !', 'Au secours !', 'On joue ?', 'Je t’aime !',
  'Miam !', 'Zzz…', 'Bravo !', 'J’ai peur !', 'C’est magique !', 'Viens vite !', 'Merci !', 'Au revoir !'];
// Des personnages dessinés en grand (emoji) : [clé, image, nom]
export const CREATURES = [['chien', '🐶', 'le chien'], ['chat', '🐱', 'le chat'], ['lapin', '🐰', 'le lapin'], ['licorne', '🦄', 'la licorne'],
  ['dragon', '🐉', 'le dragon'], ['dinosaure', '🦖', 'le dinosaure'], ['robot', '🤖', 'le robot'], ['extraterrestre', '👽', "l'extraterrestre"]];
export const AUTOCOLLANTS = ['⭐', '❤️', '🌈', '🎁', '⚽', '🍦', '🎈', '💡', '❓', '❗', '💤', '🎵'];

const echapper = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Les décors (viewBox 0 0 300 240) : [nom, dessin]
export const DECORS = {
  plage: ['La plage', `<rect width="300" height="240" fill="#9fdcf5"/><circle cx="250" cy="50" r="24" fill="#ffd84a"/>
    <rect y="140" width="300" height="40" fill="#2a8fc0"/><path d="M0 140 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#bfe6ff" stroke-width="3"/>
    <rect y="180" width="300" height="60" fill="#f6dc9a"/>`],
  foret: ['La forêt', `<rect width="300" height="240" fill="#bfe8c8"/><rect y="190" width="300" height="50" fill="#6fae4a"/>
    ${[[30, 1], [95, 0.8], [210, 0.9], [275, 1.1]].map(([x, s]) => `<g transform="translate(${x} 195) scale(${s})"><rect x="-6" y="-40" width="12" height="40" fill="#7a4a30"/><path d="M-34 -36 L0 -110 L34 -36Z" fill="#2e7d4a"/><path d="M-26 -70 L0 -130 L26 -70Z" fill="#3a9a5a"/></g>`).join('')}`],
  espace: ['L’espace', `<rect width="300" height="240" fill="#141a3a"/>
    ${[[20, 30], [70, 80], [140, 20], [180, 60], [260, 30], [240, 120], [40, 150], [120, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('')}
    <circle cx="240" cy="70" r="30" fill="#e8873a"/><ellipse cx="240" cy="70" rx="46" ry="9" fill="none" stroke="#f2c27a" stroke-width="4"/>
    <path d="M0 210 Q150 170 300 210 V240 H0Z" fill="#9aa3ad"/><circle cx="60" cy="215" r="8" fill="#7a8390"/><circle cx="200" cy="205" r="6" fill="#7a8390"/>`],
  maison: ['La maison', `<rect width="300" height="240" fill="#fbeedd"/><rect y="185" width="300" height="55" fill="#d9a86c"/>
    <rect x="115" y="30" width="70" height="60" rx="4" fill="#bfe6ff" stroke="#fff" stroke-width="6"/><path d="M150 30 V90 M115 60 H185" stroke="#fff" stroke-width="4"/>
    <rect x="20" y="40" width="50" height="40" fill="#e8c890" stroke="#b07440" stroke-width="4"/><circle cx="45" cy="60" r="10" fill="#f48fb1"/>`],
  ecole: ['L’école', `<rect width="300" height="240" fill="#f3e6cf"/><rect y="185" width="300" height="55" fill="#b98a58"/>
    <rect x="60" y="25" width="180" height="90" rx="4" fill="#2f6b45" stroke="#9a6334" stroke-width="8"/>
    <text x="150" y="80" font-size="30" text-anchor="middle" fill="#fff" font-family="sans-serif">2 + 2 = 4</text>`],
  ville: ['La ville', `<rect width="300" height="240" fill="#bfe6ff"/><rect y="195" width="300" height="45" fill="#9aa3ad"/>
    ${[[0, 90, '#e8873a'], [55, 60, '#5b84c4'], [110, 110, '#f2c230'], [175, 70, '#e05252'], [235, 100, '#8e6ad8']].map(([x, h, c]) => `<rect x="${x}" y="${195 - h - 60}" width="58" height="${h + 60}" fill="${c}"/>${[0, 1, 2].map((i) => `<rect x="${x + 10}" y="${195 - h - 45 + i * 34}" width="14" height="16" fill="#fff8d0"/><rect x="${x + 34}" y="${195 - h - 45 + i * 34}" width="14" height="16" fill="#fff8d0"/>`).join('')}`).join('')}`],
  nuit: ['La nuit', `<rect width="300" height="240" fill="#1d2a5a"/><path d="M262 30 A22 22 0 1 0 262 74 A17 17 0 1 1 262 30Z" fill="#fff4c2"/>
    ${[[30, 40], [90, 20], [160, 50], [200, 25], [120, 90], [50, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff8d0"/>`).join('')}
    <path d="M0 200 Q100 160 200 190 T300 180 V240 H0Z" fill="#2e4a3a"/>`],
  neige: ['La neige', `<rect width="300" height="240" fill="#d8ecf8"/><path d="M0 150 L70 60 L130 140 L190 50 L300 160 V240 H0Z" fill="#9ab0c8"/>
    <path d="M58 76 L70 60 L84 78 Z M178 66 L190 50 L204 70Z" fill="#fff"/><path d="M0 190 Q150 160 300 190 V240 H0Z" fill="#fff"/>
    ${[[30, 30], [110, 40], [240, 30], [270, 100], [150, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('')}`],
};

// Une BD vide : le premier décor, personne
export function nouvelleBD(age) {
  return { titre: '', cases: Array.from({ length: nombreDeCases(age) }, (_, i) => ({ decor: Object.keys(DECORS)[i % 3], perso: [null, null], bulles: ['', ''], autocollant: null })) };
}

// Le texte d'une bulle : une phrase toute faite ou tapée, sans espaces en trop, 40 caractères au plus
export const nettoyer = (t) => String(t ?? '').replace(/\s+/g, ' ').trim().slice(0, TEXTE_MAX);

export function ajouterBD(profil, bd) {
  profil.bds ??= [];
  if (profil.bds.length >= BD_MAX) throw new Error(`Tu as déjà ${BD_MAX} BD. Enlève-en une pour faire de la place.`);
  if (!bd.cases.some((c) => c.perso.some(Boolean) || c.bulles.some(Boolean))) throw new Error('Ta BD est encore vide : ajoute un personnage ou une bulle !');
  const garde = { id: `b${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`, titre: nettoyer(bd.titre), cases: bd.cases.map((c) => ({ ...c, bulles: c.bulles.map(nettoyer) })) };
  profil.bds.push(garde);
  return garde;
}
export const enleverBD = (profil, id) => { profil.bds = (profil.bds ?? []).filter((b) => b.id !== id); };

// Ce qu'on lit à voix haute. nomDe(id) : le nom d'un personnage (« Léa », « le dragon »)
export function texteALire(bd, nomDe) {
  const cases = bd.cases.map((c, i) => {
    const dits = [0, 1].filter((k) => c.bulles[k]).map((k) => `${c.perso[k] ? nomDe(c.perso[k]) : 'Quelqu’un'} dit : ${c.bulles[k]}`);
    return `Case ${i + 1}. ${dits.length ? dits.join(' ') : 'Personne ne parle.'}`;
  });
  return [bd.titre, ...cases].filter(Boolean).join(' ');
}

// Couper le texte d'une bulle en lignes (17 caractères environ par ligne, 3 lignes au plus)
export function lignes(texte, largeur = 17) {
  const res = [];
  for (const mot of texte.split(' ')) {
    if (res.length && (res.at(-1) + ' ' + mot).length <= largeur) res[res.length - 1] += ` ${mot}`;
    else res.push(mot);
  }
  return res.slice(0, 3);
}

// Une case (viewBox 0 0 300 240). dessinPerso(id, x, y, largeur, hauteur) : le SVG d'un personnage, fourni par l'app.
export function dessinerCase(c, dessinPerso, { cliquable = false, numero = 0 } = {}) {
  const PLACES = [[22, 66, 104, 168], [174, 66, 104, 168]];
  const perso = c.perso.map((id, k) => (id ? dessinPerso(id, ...PLACES[k]) : '')).join('');
  const bulles = c.bulles.map((t, k) => {
    if (!t) return '';
    const l = lignes(t), h = 14 + l.length * 17, x = k ? 154 : 6, cx = x + 70;
    const queue = k ? `M${cx + 6} ${8 + h} L${cx + 26} ${8 + h + 16} L${cx + 22} ${8 + h}Z` : `M${cx - 22} ${8 + h} L${cx - 26} ${8 + h + 16} L${cx - 6} ${8 + h}Z`;
    return `<g class="bulle-bd"><rect x="${x}" y="8" width="140" height="${h}" rx="14" fill="#fff" stroke="#2b2b3a" stroke-width="2.5"/>
      <path d="${queue}" fill="#fff" stroke="#2b2b3a" stroke-width="2.5" stroke-linejoin="round"/><rect x="${cx - 24}" y="${4 + h}" width="44" height="6" fill="#fff"/>
      ${l.map((ligne, i) => `<text x="${cx}" y="${28 + i * 17}" font-size="15" font-weight="700" text-anchor="middle" fill="#2b2b3a" font-family="sans-serif">${echapper(ligne)}</text>`).join('')}</g>`;
  }).join('');
  const auto = c.autocollant ? `<text x="150" y="${c.bulles.some(Boolean) ? 120 : 50}" font-size="40" text-anchor="middle">${echapper(c.autocollant)}</text>` : '';
  return `<svg viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" class="case-bd${cliquable ? ' cliquable' : ''}" role="img" aria-label="Case ${numero + 1}">
    ${DECORS[c.decor]?.[1] ?? DECORS.plage[1]}${perso}${auto}${bulles}<rect width="300" height="240" fill="none" stroke="#2b2b3a" stroke-width="6"/></svg>`;
}

// Une créature : un grand emoji, en bas de sa place
export function dessinCreature(cle, x, y, l, h) {
  const [, image] = CREATURES.find(([k]) => k === cle) ?? [];
  return image ? `<text x="${x + l / 2}" y="${y + h - 14}" font-size="${l * 0.95}" text-anchor="middle">${image}</text>` : '';
}

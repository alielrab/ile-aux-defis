// La tour de l'horloge : lire l'heure sur une horloge à aiguilles, ou la régler avec le doigt.
// Une heure = t minutes après 12 h, de 0 à 719 (horloge de 12 heures).
import { choixAutour, etoilesDuJeu } from '../partie.js';

// Deux niveaux : 7 ans et moins = heures pile et demies ; 8 ans et plus = quarts d'heure et 5 minutes près.
export const niveau = (age) => (age <= 7 ? 1 : 2);
export const etoilesParBonneReponse = (age) => etoilesDuJeu('heure', age);

const DOUZE = 720;
const mod = (t) => ((t % DOUZE) + DOUZE) % DOUZE;

// 210 → « 3 h 30 », 0 → « 12 h »
export function ecrire(t) {
  const h = Math.floor(t / 60) || 12, m = t % 60;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

// Ce que dit la voix : « 3 heures et demie », « 4 heures moins le quart »…
export function dire(t) {
  const h = Math.floor(t / 60) || 12, m = t % 60;
  const heures = (n) => `${n} heure${n > 1 ? 's' : ''}`;
  if (m === 0) return heures(h);
  if (m === 15) return `${heures(h)} et quart`;
  if (m === 30) return `${heures(h)} et demie`;
  if (m === 45) return `${heures((h % 12) + 1)} moins le quart`;
  return `${heures(h)} ${m}`;
}

export const angleMinutes = (t) => (t % 60) * 6;
export const angleHeures = (t) => (Math.floor(t / 60) % 12) * 30 + (t % 60) * 0.5;

// La grande aiguille pointe vers `angle` (degrés, 0 = midi) : minutes arrondies au pas.
export const minutesDepuisAngle = (angle, pas) => (Math.round(angle / 6 / pas) * pas) % 60;

// Nouvelles minutes ; quand la grande aiguille passe le 12, l'heure avance (ou recule), comme une vraie horloge.
export function avecMinutes(t, m) {
  const avant = t % 60;
  let h = Math.floor(t / 60);
  if (avant >= 45 && m < 15) h++;
  else if (avant < 15 && m >= 45) h--;
  return mod(h * 60 + m);
}

// La petite aiguille pointe vers `angle` : l'heure la plus proche, minutes gardées.
export function avecHeure(t, angle) {
  const m = t % 60;
  return mod(Math.round((angle - m * 0.5) / 30) * 60 + m);
}

// Les aiguilles inversées : l'erreur la plus courante (3 h 00 lu « 12 h 15 »).
function inversee(t) {
  const h = Math.floor(t / 60), m = t % 60;
  return m % 5 ? t : (m / 5) * 60 + h * 5;
}

// Les aiguilles de départ, loin de la réponse : la grande à 20–40 minutes, la petite à 3 heures ou plus.
function depart(t, pas, entre) {
  const decalages = [20, 25, 30, 35, 40].filter((m) => m % pas === 0);
  return mod(t + 60 * entre(3, 8) + decalages[entre(0, decalages.length - 1)] * (entre(0, 1) ? 1 : -1));
}

// reglage : { age }
export function question({ age }, aleatoire = Math.random) {
  const niv = niveau(age);
  const entre = (min, max) => min + Math.floor(aleatoire() * (max - min + 1));
  const pas = niv === 1 ? 30 : aleatoire() < 0.5 ? 15 : 5;
  const m = niv === 1 ? (aleatoire() < 0.6 ? 0 : 30) : pas * entre(0, 60 / pas - 1);
  const t = entre(0, 11) * 60 + m;

  if (aleatoire() < 0.5) {
    const pieges = [t + 60, t - 60, inversee(t), t + pas, t - pas, t + 120, t - 120, t + 30].map(mod)
      .filter((p) => niv === 2 || p % 30 === 0); // 7 ans et moins : que des heures pile et demies
    return {
      mode: 'lire', texte: `lire ${t}`, titre: 'Quelle heure est-il ?', reponse: t,
      consigne: `Quelle heure est-il ?${niv === 1 ? ' La petite aiguille montre les heures.' : ''}`,
      choix: choixAutour(t, pieges, niv === 1 ? 3 : 4, aleatoire, 0, DOUZE - 1),
      solution: `Il est ${dire(t)}.`,
    };
  }
  return {
    mode: 'regler', texte: `regler ${t}`, titre: `Mets l'horloge sur ${ecrire(t)}`, reponse: t,
    consigne: `Fais tourner les aiguilles pour mettre l'horloge sur ${dire(t)}. Puis touche : c'est l'heure !`,
    depart: depart(t, niv === 1 ? 15 : 5, entre),
    pas: niv === 1 ? 15 : 5, // la grande aiguille saute de 15 ou de 5 minutes
    solution: `Il fallait mettre ${dire(t)}.`,
  };
}

// La grande horloge (300 × 300). Petite aiguille rouge = heures, grande aiguille bleue = minutes.
export function dessinerHorloge(t, deplacable = false) {
  const point = (deg, r) => [150 + r * Math.sin((deg * Math.PI) / 180), 150 - r * Math.cos((deg * Math.PI) / 180)].map((v) => v.toFixed(1));
  const traits = Array.from({ length: 60 }, (_, i) => {
    const gros = i % 5 === 0, [x1, y1] = point(i * 6, gros ? 116 : 124), [x2, y2] = point(i * 6, 131);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${gros ? '#2b2b3a' : '#a7a29a'}" stroke-width="${gros ? 4 : 2}" stroke-linecap="round"/>`;
  }).join('');
  const chiffres = Array.from({ length: 12 }, (_, i) => {
    const [x, y] = point((i + 1) * 30, 96);
    return `<text x="${x}" y="${(Number(y) + 11).toFixed(1)}" font-size="31" font-weight="800" text-anchor="middle" fill="#2b2b3a">${i + 1}</text>`;
  }).join('');
  const aiguille = (id, angle, long, ep, c) => `<g data-aiguille="${id}" transform="rotate(${angle} 150 150)">
    <line x1="150" y1="166" x2="150" y2="${150 - long}" stroke="${c}" stroke-width="${ep}" stroke-linecap="round"/>
    <path d="M${150 - ep} ${150 - long + 10} L150 ${150 - long - 8} L${150 + ep} ${150 - long + 10}Z" fill="${c}"/></g>`;
  return `<svg class="horloge${deplacable ? ' deplacable' : ''}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img"
    aria-label="${deplacable ? `L'horloge indique ${ecrire(t)}` : 'Horloge'}">
    <circle cx="150" cy="150" r="148" fill="#c99a3c"/><circle cx="150" cy="150" r="141" fill="#a87a26"/>
    <circle cx="150" cy="150" r="136" fill="#fffdf5"/>
    ${traits}${chiffres}
    ${aiguille('h', angleHeures(t), 66, 11, '#d94040')}${aiguille('m', angleMinutes(t), 108, 7, '#3467c8')}
    <circle cx="150" cy="150" r="10" fill="#2b2b3a"/><circle cx="150" cy="150" r="4" fill="#f2c230"/>
  </svg>`;
}

// Faire tourner les aiguilles avec le doigt (ou la souris). On attrape l'aiguille la plus proche du doigt.
export function brancherHorloge(svg, depart, pas) {
  let t = depart, prise = null;
  const placer = () => {
    svg.querySelector('[data-aiguille=h]').setAttribute('transform', `rotate(${angleHeures(t)} 150 150)`);
    svg.querySelector('[data-aiguille=m]').setAttribute('transform', `rotate(${angleMinutes(t)} 150 150)`);
    svg.setAttribute('aria-label', `L'horloge indique ${ecrire(t)}`);
  };
  const position = (ev) => {
    const r = svg.getBoundingClientRect();
    const x = ev.clientX - r.left - r.width / 2, y = ev.clientY - r.top - r.height / 2;
    return { angle: ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360, distance: (Math.hypot(x, y) / r.width) * 300 };
  };
  const bouger = (ev) => {
    const { angle } = position(ev);
    t = prise === 'm' ? avecMinutes(t, minutesDepuisAngle(angle, pas)) : avecHeure(t, angle);
    placer();
  };
  svg.addEventListener('pointerdown', (ev) => {
    const { angle, distance } = position(ev);
    const ecart = (a) => Math.abs(((angle - a + 540) % 360) - 180);
    const eh = ecart(angleHeures(t)), em = ecart(angleMinutes(t));
    prise = Math.abs(eh - em) < 25 ? (distance < 80 ? 'h' : 'm') : eh < em ? 'h' : 'm';
    svg.setPointerCapture(ev.pointerId);
    bouger(ev);
  });
  svg.addEventListener('pointermove', (ev) => prise && bouger(ev));
  for (const e of ['pointerup', 'pointercancel']) svg.addEventListener(e, () => (prise = null));
  const regler = (n) => { t = mod(n); placer(); };
  return {
    lire: () => t,
    regler,
    decaler: (n) => regler(t + n),
    bloquer: () => { prise = null; svg.classList.remove('deplacable'); svg.style.pointerEvents = 'none'; },
  };
}

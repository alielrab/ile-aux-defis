// Ce que l'app dit pendant les jeux à questions : on tire beaucoup de questions et on note chaque texte dit
// (la question lue, la correction, le « savais-tu »). Sert à voix/couverture.mjs (mesurer) et à voix/lister-phrases.mjs (lister ce qui manque).
import { phrases } from '../js/voix-cle.js';
import { accorder } from '../js/genre.js';

const js = (f) => import(new URL(`../js/${f}`, import.meta.url));
const [calcul, heure, corps, syllabes, dictee, robot, suisse, nature, espace, marche, emotions, atlas, dinos, urgences, route, tri, veto, fractions, croyance, enigmes] = await Promise.all(
  ['jeux/calcul.js', 'jeux/heure.js', 'jeux/corps.js', 'jeux/syllabes.js', 'jeux/dictee.js', 'jeux/robot.js', 'jeux/suisse.js', 'jeux/nature.js', 'jeux/espace.js', 'jeux/marche.js', 'jeux/emotions.js', 'jeux/atlas.js', 'jeux/dinos.js', 'jeux/urgences.js', 'jeux/route.js', 'jeux/tri.js', 'jeux/veto.js', 'jeux/fractions.js', 'croyances.js', 'jeux/enigmes.js'].map(js));
const { CROYANCES } = croyance;

const JEUX = { calcul, heure, corps, syllabes, dictee, robot, suisse, naturaliste: nature.naturaliste, potager: nature.potager, secours: nature.secours, espace, marche, emotions, atlas, dinos, urgences, route, tri, veto, fractions, croyance, intrus: enigmes.intrus, suites: enigmes.suites };
// Comme aDire dans js/app.js
function aDire(jeu, q) {
  if (jeu === 'marche') return marche.aDire(q);
  const ou = (l) => (l.length > 1 ? `${l.slice(0, -1).join(', ')}, ou ${l.at(-1)} ?` : l[0]);
  if (jeu === 'emotions') return `${q.consigne} ${ou(q.choix.map(emotions.nom))}`;
  if (jeu === 'urgences') return `${q.consigne} ${ou(q.choix.map(urgences.libelle))}`;
  if (jeu === 'veto') return veto.aDire(q);
  if (jeu === 'fractions') return fractions.aDire(q);
  if (jeu === 'intrus' || jeu === 'suites') return q.consigne;
  if (jeu === 'passeport' && q.type === 'drapeau') return q.consigne;
  if (q.mode === 'ingredient') return q.consigne;
  if (q.mode === 'choix') return `${q.consigne} ${ou(q.choix)}`;
  if (q.mode === 'lire') return `${q.consigne} ${ou(q.choix.map(heure.dire))}`;
  return q.consigne;
}
let x = 7; const hasard = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);

// Le calcul et le marché disent des nombres qui changent à chaque question (des milliers de phrases possibles) : ils gardent la voix de la tablette.
const SANS_VOIX = ['calcul', 'marche'];
const [passeport, cuisine] = await Promise.all([js('jeux/passeport.js'), js('jeux/cuisine.js')]);
// Ce que l'app dit pour une question : la question lue, puis la suite après une erreur et après une bonne réponse
function noter(textes, jeu, q) {
  const correction = q.solution ?? `La bonne réponse est ${q.reponse}.`, savais = q.savaisTu && `Le savais-tu ? ${q.savaisTu}`;
  for (const t of [aDire(jeu, q), [q.trouve, correction, savais].filter(Boolean).join(' '), [q.trouve, savais].filter(Boolean).join(' ')]) for (const g of ['fille', 'garcon']) if (t) textes.add(accorder(t, g));
}
// Tous les textes dits, par jeu : { calcul: Set, heure: Set, … }
export function textesDits() {
  const tout = {};
  for (const [jeu, module] of Object.entries(JEUX)) {
    if (SANS_VOIX.includes(jeu)) continue;
    const textes = (tout[jeu] = new Set());
    const reglages = jeu === 'croyance' ? Object.keys(CROYANCES).map((c) => ({ croyance: c })) : jeu === 'calcul' ? Object.keys(calcul.OPERATIONS).map((o) => ({ operation: o })) : jeu === 'atlas' ? Object.keys(atlas.SYSTEMES).map((s) => ({ systeme: s })) : [{}];
    for (const r of reglages) for (const age of [6, 9]) for (let i = 0; i < (jeu === 'heure' ? 8000 : 600); i++) { // l'heure : toutes les heures finissent par sortir
      let q;
      try { q = module.question({ age, patients: [], ...r }, hasard, i % 10, new Set()); } catch { continue; }
      noter(textes, jeu, q);
    }
  }
  // les questions qui ne sont pas tirées au hasard : celles de chaque pays du passeport, et les étapes de chaque recette
  tout.passeport = new Set(); tout.cuisine = new Set();
  for (const age of [6, 9]) {
    for (const p of passeport.PAYS) for (let i = 0; i < 20; i++) for (const q of passeport.questions(p.cle, age)) noter(tout.passeport, 'passeport', q);
    for (const r of Object.keys(cuisine.RECETTES)) for (const q of cuisine.etapes(r, age)) noter(tout.cuisine, 'cuisine', q);
  }
  return tout;
}
// Les morceaux à enregistrer pour un texte : ses phrases ; une liste de réponses donne chaque réponse ; « La bonne réponse est X. » donne le début et X.
export const DEBUTS = ['La bonne réponse est', 'La bonne réponse :'];
export function morceaux(texte) {
  return phrases(texte).flatMap((p) => {
    const d = DEBUTS.find((x) => p.startsWith(`${x} `));
    if (d) return [d, p.slice(d.length + 1).replace(/\.$/, '')];
    if (/, ou .+ \?$/.test(p)) { const m = p.slice(0, -2).split(', '); m.push(m.pop().replace(/^ou /, '')); return ['ou', ...m]; }
    return [p];
  });
}

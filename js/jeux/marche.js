// Le marché : payer et rendre la monnaie en francs suisses. Tous les montants sont en centimes (entiers, pas d'arrondi).
// 7 ans et moins : pièces de 1, 2 et 5 francs, prix ronds jusqu'à 10 francs. 8 ans et plus : centimes, billets, rendre la monnaie.
import { melanger, etoilesDuJeu } from '../partie.js';

export const niveau = (age) => (age <= 7 ? 1 : 2);
export const etoilesParBonneReponse = (age) => etoilesDuJeu('marche', age);

// Les pièces et billets suisses : [valeur en centimes, sorte, couleur]. Les dessins ne sont pas des copies des vrais billets.
export const ARGENT = [
  [5, 'piece', '#e0b84a'], [10, 'piece', '#cfd3d8'], [20, 'piece', '#cfd3d8'], [50, 'piece', '#cfd3d8'],
  [100, 'piece', '#cfd3d8'], [200, 'piece', '#cfd3d8'], [500, 'piece', '#cfd3d8'],
  [1000, 'billet', '#f2c230'], [2000, 'billet', '#e0524a'], [5000, 'billet', '#4caf6a'],
];
const PIECES_PETITS = [100, 200, 500];
const ARGENT_GRANDS = [5, 10, 20, 50, 100, 200, 500, 1000, 2000];

// [image, nom, prix le plus bas, prix le plus haut] en centimes : des prix réalistes (une poire ne coûte pas 13 francs)
export const ARTICLES = [
  ['🍎', 'la pomme', 50, 200], ['🍌', 'la banane', 50, 200], ['🥐', 'le croissant', 100, 300], ['🥛', 'le lait', 100, 300],
  ['🧀', 'le fromage', 300, 1200], ['🍫', 'le chocolat', 100, 500], ['🍞', 'le pain', 200, 500], ['🥕', 'les carottes', 100, 400],
  ['🥚', 'les œufs', 300, 700], ['🍦', 'la glace', 200, 600], ['🧃', 'le jus', 100, 400], ['🍒', 'les cerises', 300, 800],
  ['🍇', 'le raisin', 200, 600], ['🍐', 'la poire', 50, 200], ['🍯', 'le miel', 500, 1200], ['📕', 'le livre', 800, 1900],
  ['✏️', 'les crayons', 200, 1000], ['💐', 'les fleurs', 500, 1500], ['🎈', 'le ballon', 300, 1500], ['🧸', "l'ourson", 800, 1900],
  ['🍓', 'les fraises', 300, 700], ['🥨', 'le bretzel', 100, 400], ['🍋', 'le citron', 50, 200], ['🥒', 'le concombre', 100, 300],
];

// 300 → « Fr. 3.– » ; 740 → « Fr. 7.40 » (comme sur les étiquettes en Suisse)
export const ecrire = (c) => `Fr. ${Math.floor(c / 100)}.${c % 100 ? String(c % 100).padStart(2, '0') : '–'}`;
// 300 → « 3 francs » ; 740 → « 7 francs 40 » ; 50 → « 50 centimes »
export function dire(c) {
  const f = Math.floor(c / 100), r = c % 100;
  if (!f) return `${r} centimes`;
  return `${f} franc${f > 1 ? 's' : ''}${r ? ` ${r}` : ''}`;
}
// Nom d'une pièce ou d'un billet : « une pièce de 2 francs », « un billet de 10 francs »
const nomArgent = (v) => (v >= 1000 ? `un billet de ${dire(v)}` : `une pièce de ${dire(v)}`);

// La façon la plus simple de faire un montant (les plus grosses pièces d'abord), avec les valeurs permises.
export function decomposer(montant, valeurs) {
  const res = [];
  for (const v of [...valeurs].sort((a, b) => b - a)) while (montant >= v) { res.push(v); montant -= v; }
  return montant === 0 ? res : null;
}

const entre = (a, b, aleatoire) => a + Math.floor(aleatoire() * (b - a + 1));
const parmi = (l, aleatoire) => l[Math.floor(aleatoire() * l.length)];

// 4 choix (3 à 7 ans et moins) proches de la bonne réponse : les erreurs qu'on fait vraiment
function choixProches(bonne, pieges, n, aleatoire) {
  const ok = [...new Set(pieges)].filter((p) => p > 0 && p !== bonne);
  const autres = melanger(ok, aleatoire).slice(0, n - 1);
  for (let k = 1; autres.length < n - 1; k++) for (const p of [bonne + 100 * k, bonne - 100 * k]) if (p > 0 && autres.length < n - 1 && !autres.includes(p)) autres.push(p);
  return melanger([bonne, ...autres], aleatoire);
}

// reglage : { age } ; numero : la place dans la partie
export function question({ age }, aleatoire = Math.random) {
  const [image, nom, bas, haut] = parmi(ARTICLES, aleatoire);
  const petits = niveau(age) === 1, n = petits ? 3 : 4;
  const mode = petits ? parmi(['compter', 'payer', 'payer'], aleatoire) : parmi(['compter', 'payer', 'rendre'], aleatoire);
  const Nom = nom[0].toUpperCase() + nom.slice(1), coute = nom.startsWith('les ') ? 'coûtent' : 'coûte';

  if (mode === 'compter') {
    const pieces = petits
      ? Array.from({ length: entre(2, 4, aleatoire) }, () => parmi(PIECES_PETITS, aleatoire))
      : Array.from({ length: entre(3, 6, aleatoire) }, () => parmi([5, 10, 20, 50, 100, 200, 500, 1000], aleatoire));
    pieces.sort((a, b) => b - a);
    const total = pieces.reduce((a, b) => a + b, 0);
    const texte = `Combien d'argent y a-t-il dans le porte-monnaie ? (${pieces.join('+')})`;
    const pieges = petits ? [total + 100, total - 100, total + 200, total - 200]
      : [total + 10, total - 10, total + 100, total - 100, total + 50, total - 50, total + pieces.at(-1), total - pieces.at(-1)];
    return { mode, texte, titre: "Combien d'argent y a-t-il ?", consigne: "Combien d'argent y a-t-il dans le porte-monnaie ?", pieces, reponse: total,
      choix: choixProches(total, pieges, n, aleatoire), solution: `Il y a ${ecrire(total)}.` };
  }

  if (mode === 'payer') {
    const valeurs = petits ? PIECES_PETITS : ARGENT_GRANDS;
    const prix = petits ? entre(Math.max(1, Math.ceil(bas / 100)), Math.min(10, Math.floor(haut / 100)), aleatoire) * 100 // petits : francs ronds, 10 au plus
      : entre(bas / 5, haut / 5, aleatoire) * 5; // grands : au 5 centimes
    const exemple = decomposer(prix, valeurs).map((v) => dire(v)).join(' + ');
    return { mode, texte: `${Nom} ${coute} ${ecrire(prix)}. Paie juste.`, titre: `${Nom} ${coute} ${ecrire(prix)}`, image, prix, valeurs, reponse: prix,
      consigne: `${Nom} ${coute} ${dire(prix)}. Touche les pièces${petits ? '' : ' et les billets'} pour payer le bon prix, puis touche « Payer ».`,
      solution: `Il fallait donner ${dire(prix)}, par exemple : ${exemple}.` };
  }

  // rendre la monnaie : on paie avec un billet ou une pièce plus grande que le prix
  const prix = entre(bas / 10, haut / 10, aleatoire) * 10; // au 10 centimes
  const donne = [100, 200, 500, 1000, 2000, 5000].find((v) => v > prix && (v >= 1000 || aleatoire() < 0.6)) ?? 5000;
  const rendu = donne - prix;
  const f = Math.floor(prix / 100), r = prix % 100;
  // Les erreurs qu'on fait vraiment (pour 7.40 payés avec 10 francs, la bonne réponse est 2.60) :
  // oublier la retenue (3.60), recopier les centimes du prix (3.40), se tromper de 10 centimes.
  const pieges = [rendu + 100, r ? (donne / 100 - f) * 100 + r : rendu + 50, rendu - 10, rendu + 10, rendu - 100];
  return { mode, texte: `${Nom} ${coute} ${ecrire(prix)}. Tu paies avec ${nomArgent(donne)}. Combien te rend-on ?`, image, prix, donne, reponse: rendu,
    titre: `${Nom} ${coute} ${ecrire(prix)}`, consigne: `${Nom} ${coute} ${dire(prix)}. Tu paies avec ${nomArgent(donne)}. Combien la marchande te rend-elle ?`,
    choix: choixProches(rendu, pieges, n, aleatoire), solution: `On te rend ${dire(rendu)} : ${dire(prix)} + ${dire(rendu)} = ${dire(donne)}.` };
}

// Ce qui est lu à voix haute : la consigne, puis les réponses possibles
export function aDire(q) {
  if (!q.choix) return q.consigne;
  const l = q.choix.map(dire);
  return `${q.consigne} ${l.slice(0, -1).join(', ')}, ou ${l.at(-1)} ?`;
}

// ---------- Dessins ----------
const RAYON = { 5: 17, 10: 19, 20: 21, 50: 17, 100: 23, 200: 27, 500: 31 }; // tailles relatives des vraies pièces
export function dessinArgent(v) {
  const [, sorte, couleur] = ARGENT.find(([x]) => x === v);
  const texte = v >= 100 ? `${v / 100}` : `${v}`, unite = v >= 100 ? 'Fr.' : 'c';
  if (sorte === 'billet') {
    return `<svg viewBox="0 0 120 64" class="argent billet" aria-hidden="true"><rect x="2" y="2" width="116" height="60" rx="6" fill="${couleur}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>
      <rect x="10" y="10" width="20" height="20" fill="#fff" opacity=".7"/><path d="M17 20 h6 M20 17 v6" stroke="#e0524a" stroke-width="3"/>
      <text x="80" y="42" font-size="26" font-weight="800" text-anchor="middle" fill="#2b2b3a">${texte}</text><text x="80" y="56" font-size="10" text-anchor="middle" fill="#2b2b3a">FRANCS</text></svg>`;
  }
  const r = RAYON[v];
  return `<svg viewBox="-32 -32 64 64" class="argent piece" aria-hidden="true"><circle r="${r}" fill="${couleur}" stroke="rgba(0,0,0,.3)" stroke-width="2"/>
    <circle r="${r - 4}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.5"/>
    <text y="${v >= 100 ? 2 : 4}" font-size="${r * 0.8}" font-weight="800" text-anchor="middle" fill="#3a3a3a">${texte}</text>${v >= 100 ? `<text y="${r * 0.62}" font-size="${r * 0.35}" text-anchor="middle" fill="#3a3a3a">${unite}</text>` : ''}</svg>`;
}

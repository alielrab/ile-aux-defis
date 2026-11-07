// Les fractions en pizza (île du savoir) : partager des pizzas et des gâteaux en parts égales.
// 7 ans et moins : moitiés et quarts, parts égales ou pas. 8 ans et plus : vraies fractions (tiers, huitièmes…), comparaisons.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('fractions', age);

const NOMS = { 2: ['demi', 'demis'], 3: ['tiers', 'tiers'], 4: ['quart', 'quarts'], 5: ['cinquième', 'cinquièmes'], 6: ['sixième', 'sixièmes'], 7: ['septième', 'septièmes'], 8: ['huitième', 'huitièmes'] };
const NOMBRES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit'];
// « 3/8 » → « trois huitièmes » ; 1/2 → « un demi »
export function dire(f) {
  const [n, d] = f.split('/').map(Number);
  return NOMS[d] ? `${NOMBRES[n]} ${NOMS[d][n > 1 ? 1 : 0]}` : `${NOMBRES[n]} sur ${NOMBRES[d]}`; // 2/1 : « deux sur un »
}
// Le texte d'un bouton : « 1/2 », et en mots pour les petits
export const libelle = (f, age) => (age <= 7 ? `${f} : ${dire(f)}` : f);

// ---------- Dessins (viewBox 0 0 120 120) ----------
// Une pizza ronde en d parts (pareilles si egales, sinon une grosse et des petites) ; garnies : les parts avec du jambon
export function pizza(d, garnies = [], { egales = true, cliquable = false, gateau = false } = {}) {
  const angles = egales ? Array.from({ length: d + 1 }, (_, i) => (360 * i) / d) : [0, 200, ...Array.from({ length: d - 1 }, (_, i) => 200 + (160 * (i + 1)) / (d - 1))].slice(0, d + 1);
  const pt = (a, r = 52) => [60 + r * Math.sin((a * Math.PI) / 180), 60 - r * Math.cos((a * Math.PI) / 180)];
  const parts = angles.slice(0, d).map((a, i) => {
    const b = angles[i + 1], [x1, y1] = pt(a), [x2, y2] = pt(b), grand = b - a > 180 ? 1 : 0, mil = pt((a + b) / 2, 30);
    const garnie = garnies.includes(i);
    const fond = gateau ? (garnie ? '#f48fb1' : '#f6d79a') : garnie ? '#e8a04a' : '#f7d27a';
    const deco = garnie ? (gateau ? `<circle cx="${mil[0].toFixed(1)}" cy="${mil[1].toFixed(1)}" r="5" fill="#e74c3c"/>` : `<circle cx="${mil[0].toFixed(1)}" cy="${mil[1].toFixed(1)}" r="6" fill="#e8708a"/><circle cx="${(mil[0] + 7).toFixed(1)}" cy="${(mil[1] + 6).toFixed(1)}" r="3" fill="#3a9a4a"/>`) : '';
    return `<g${cliquable ? ` class="part" data-part="${i}" role="button" tabindex="0" aria-label="Part ${i + 1}${garnie ? ', garnie' : ''}"` : ''}><path d="M60 60 L${x1.toFixed(1)} ${y1.toFixed(1)} A52 52 0 ${grand} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z" fill="${fond}" stroke="#a8702a" stroke-width="2.5"/>${deco}</g>`;
  }).join('');
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="pizza" aria-hidden="${!cliquable}"><circle cx="60" cy="60" r="57" fill="${gateau ? '#c98b4f' : '#e0a050'}"/>${parts}</svg>`;
}

// reglage : { age }
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const petits = age <= 7, n = petits ? 3 : 4;
  const parmi = (l) => l[Math.floor(aleatoire() * l.length)];
  const gateau = aleatoire() < 0.4, chose = gateau ? 'le gâteau' : 'la pizza', laChose = gateau ? 'du gâteau' : 'de la pizza';
  const types = petits ? ['garnir', 'garnir', 'egales', 'combien', 'partage'] : ['garnir', 'lire', 'lire', 'comparer', 'egale', 'partage'];
  const type = parmi(types);
  // Garnir une partie : toucher les parts, puis valider (réponse : le nombre de parts)
  if (type === 'garnir') {
    const [k, d] = parmi(petits ? [[1, 2], [2, 4], [1, 4], [3, 4]] : [[3, 8], [5, 8], [2, 3], [1, 3], [3, 4], [5, 6], [2, 6]]);
    const quoi = petits ? (k * 2 === d ? 'la moitié' : `${NOMBRES[k] === 'un' ? 'un' : NOMBRES[k]} ${NOMS[d][k > 1 ? 1 : 0]}`) : dire(`${k}/${d}`);
    const garniture = gateau ? 'de la crème' : 'du jambon';
    const texte = `Mets ${garniture} sur ${quoi} ${laChose}.`;
    return { mode: 'garnir', texte, titre: texte, consigne: `${texte} Touche les parts, puis touche « C’est prêt ».`, d, gateau, reponse: k, fraction: `${k}/${d}`,
      solution: `Il fallait garnir ${k} part${k > 1 ? 's' : ''} sur ${d}.`, savaisTu: k * 2 === d ? `La moitié, c’est ${k} part${k > 1 ? 's' : ''} sur ${d} : autant de parts garnies que de parts sans rien.` : `${dire(`${k}/${d}`).replace(/^./, (c) => c.toUpperCase())} : on coupe en ${d} parts égales, et on en prend ${k}.` };
  }
  // 6 ans : quelle pizza est coupée en parts égales ?
  if (type === 'egales') {
    const d = parmi([2, 4]);
    const texte = `Quel dessin montre ${chose} coupé${gateau ? '' : 'e'} en ${NOMBRES[d]} parts égales ?`;
    return { mode: 'dessins', texte: `egales:${d}:${gateau}`, titre: texte, consigne: texte, reponse: 'egales',
      choix: melanger(['egales', 'inegales', d === 2 ? 'trois' : 'deux'], aleatoire), dessins: { egales: pizza(d, [], { gateau }), inegales: pizza(d, [], { egales: false, gateau }), trois: pizza(3, [], { gateau }), deux: pizza(2, [], { gateau }) },
      libelles: { egales: 'Ce dessin', inegales: 'Ce dessin', trois: 'Ce dessin', deux: 'Ce dessin' }, solution: 'Des parts égales ont toutes la même taille.', savaisTu: 'Pour partager équitablement, toutes les parts doivent avoir la même taille.' };
  }
  if (type === 'combien') {
    const d = parmi([2, 3, 4, 6, 8]);
    const texte = `${chose[0].toUpperCase()}${chose.slice(1)} est coupé${gateau ? '' : 'e'} en parts égales. Combien de parts y a-t-il ?`;
    const choix = melanger([d, ...melanger([2, 3, 4, 5, 6, 8].filter((x) => x !== d), aleatoire).slice(0, n - 1)], aleatoire).map(String);
    return { mode: 'choix', texte: `combien:${d}:${gateau}`, titre: texte, consigne: texte, dessin: pizza(d, [], { gateau }), reponse: String(d), choix, solution: `Il y a ${d} parts.`, savaisTu: `Si on la partage entre ${d} enfants, chacun a une part.` };
  }
  if (type === 'partage') {
    const d = parmi(petits ? [2, 4] : [3, 4, 6, 8]);
    const texte = `On partage ${chose} entre ${NOMBRES[d]} enfants, en parts égales. Quelle part a chaque enfant ?`;
    const bonne = `1/${d}`;
    const choix = melanger([bonne, ...melanger(['1/2', '1/3', '1/4', '1/6', '1/8', `${d}/1`].filter((x) => x !== bonne), aleatoire).slice(0, n - 1)], aleatoire);
    return { mode: 'fraction', texte: `partage:${d}:${gateau}`, titre: texte, consigne: texte, dessin: pizza(d, [0], { gateau }), reponse: bonne, choix,
      solution: `Chaque enfant a ${dire(bonne)}.`, savaisTu: d === 2 ? 'Un demi, c’est la moitié.' : `Plus on partage entre beaucoup d’enfants, plus les parts sont petites.` };
  }
  if (type === 'lire') {
    const d = parmi([3, 4, 6, 8]), k = 1 + Math.floor(aleatoire() * (d - 1));
    const texte = `Quelle fraction ${laChose} est garnie ?`;
    const bonne = `${k}/${d}`, pieges = [`${d - k}/${d}`, `${k}/${d - k}`, `${d}/${k}`, `${k + 1 < d ? k + 1 : k - 1}/${d}`].filter((x) => x !== bonne && !x.startsWith('0'));
    return { mode: 'fraction', texte: `lire:${k}/${d}:${gateau}`, titre: texte, consigne: texte, dessin: pizza(d, Array.from({ length: k }, (_, i) => i), { gateau }), reponse: bonne,
      choix: melanger([bonne, ...[...new Set(pieges)].slice(0, n - 1)], aleatoire), solution: `${k} parts garnies sur ${d} : ${dire(bonne)}.`, savaisTu: 'Le nombre du bas dit en combien de parts on a coupé ; le nombre du haut, combien on en prend.' };
  }
  if (type === 'comparer') {
    const [a, b] = melanger(parmi([['1/2', '1/3'], ['1/2', '1/4'], ['1/3', '1/4'], ['1/4', '1/8'], ['3/4', '1/4'], ['2/3', '1/3'], ['1/2', '3/8']]), aleatoire);
    const valeur = (f) => { const [x, y] = f.split('/').map(Number); return x / y; };
    const bonne = valeur(a) > valeur(b) ? a : b;
    const texte = 'Quelle part est la plus grande ?';
    return { mode: 'fraction', texte: `comparer:${[a, b].sort().join('-')}`, titre: texte, consigne: `Qu’est-ce qui est le plus grand : ${dire(a)} ou ${dire(b)} ?`, reponse: bonne, choix: [a, b],
      solution: `${dire(bonne).replace(/^./, (c) => c.toUpperCase())} est plus grand.`, savaisTu: 'Avec un même nombre de parts prises, plus on coupe en beaucoup de parts, plus chaque part est petite : un quart est plus petit qu’un demi.' };
  }
  // egale : une fraction égale à un demi
  const texte = 'Quelle fraction est égale à la moitié ?';
  return { mode: 'fraction', texte: `egale:${numero}`, titre: texte, consigne: texte, dessin: pizza(2, [0], { gateau }), reponse: '2/4', choix: melanger(['2/4', '1/3', '3/4', '2/3'].slice(0, n), aleatoire),
    solution: 'Deux quarts, c’est la moitié.', savaisTu: 'Deux quarts, trois sixièmes, quatre huitièmes : c’est toujours la moitié !' };
}

export const aDire = (q) => (q.mode === 'fraction' ? `${q.consigne} ${q.choix.map(dire).join(', ou ')} ?` : q.consigne);

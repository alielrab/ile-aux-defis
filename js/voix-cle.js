// La voix enregistrée : retrouver le fichier audio d'une phrase. Sert à l'app (js/voix.js) et aux scripts de voix/.
// Le nom du fichier vient du texte lui-même : si le texte change d'une lettre, l'app repasse à la voix de la tablette.
export const normaliser = (t) => String(t).replace(/\s+/g, ' ').trim();
export function cle(texte) { // cyrb53 : court, rapide, le même dans le navigateur et dans node
  let a = 0xdeadbeef, b = 0x41c6ce57;
  for (const c of normaliser(texte)) {
    const n = c.codePointAt(0);
    a = Math.imul(a ^ n, 2654435761);
    b = Math.imul(b ^ n, 1597334677);
  }
  a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
  b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
  return (4294967296 * (2097151 & b) + (a >>> 0)).toString(36);
}
// « Bravo ! Tu gagnes 2 étoiles. » → ['Bravo !', 'Tu gagnes 2 étoiles.'] (« ! » et « ? » sont précédés d'une espace en français)
export function phrases(texte) {
  const liste = [];
  let debut = true;
  for (const mot of normaliser(texte).split(' ')) {
    if (debut || /^[!?»:;]+$/.test(mot)) liste.push(liste.length && !debut ? `${liste.pop()} ${mot}` : mot);
    else liste.push(`${liste.pop()} ${mot}`);
    debut = /[.!?…]»?$/.test(mot);
  }
  return liste.filter(Boolean);
}
// Une phrase sans voix à elle, mais faite de morceaux qui en ont une. Renvoie les fichiers, ou null.
// « Le cœur, le foie, ou le poumon ? » (les réponses proposées) → chaque réponse, avec « ou » avant la dernière.
// « La bonne réponse est le cœur. » → « La bonne réponse est », puis « le cœur ».
// « Le crâne. » (un nom suivi d'un point, au début d'une fiche) → la voix de « Le crâne ».
export const DEBUTS = ['La bonne réponse est', 'La bonne réponse :', 'Tu es sur :'];
function composer(phrase, pretes) {
  const a = (t) => pretes.has(cle(t));
  for (const d of DEBUTS) if (phrase.startsWith(`${d} `) && a(d)) {
    const reste = phrase.slice(d.length + 1);
    for (const r of [reste, reste.replace(/\.$/, '')]) if (a(r)) return [cle(d), cle(r)];
  }
  if (phrase.endsWith('.') && a(phrase.slice(0, -1))) return [cle(phrase.slice(0, -1))];
  if (!/, ou .+ \?$/.test(phrase)) return null;
  const mots = phrase.slice(0, -2).split(', '), liste = [];
  mots.push(mots.pop().replace(/^ou /, ''));
  for (let i = 0; i < mots.length;) { // une réponse peut contenir une virgule : on prend le plus long morceau connu
    let j = mots.length;
    while (j > i && !a(mots.slice(i, j).join(', '))) j--;
    if (j === i) return null;
    if (j === mots.length && i > 0 && a('ou')) liste.push(cle('ou'));
    liste.push(cle(mots.slice(i, j).join(', ')));
    i = j;
  }
  return liste;
}
// Les fichiers à jouer pour dire ce texte : on prend à chaque fois le plus long morceau enregistré. null s'il manque un morceau.
export function fichiers(texte, pretes) {
  const p = phrases(texte), liste = [];
  for (let i = 0; i < p.length;) {
    let j = p.length;
    while (j > i && !pretes.has(cle(p.slice(i, j).join(' ')))) j--;
    if (j === i) {
      const morceaux = composer(p[i], pretes);
      if (!morceaux) return null;
      liste.push(...morceaux);
      i++;
      continue;
    }
    liste.push(cle(p.slice(i, j).join(' ')));
    i = j;
  }
  return liste.length ? liste : null;
}

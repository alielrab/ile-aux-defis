// Prépare les demandes de voix pour Higgsfield (ElevenLabs v4), à partir de voix/phrases.csv, et réécrit voix/liste.js.
// Lancer : node voix/lots.mjs [dossier de sortie] [filtre] [phrases par lot, 25 ; 12 pour rattraper les mots seuls refusés]. Filtre sur « id;source », ex. "^labo|^message" ou "^(?!bibliotheque\.syllabe)"]
// Sans dossier : seulement voix/liste.js (la liste des voix prêtes dans voix/audio/).
// Les phrases qui ont déjà leur fichier dans voix/audio/ sont sautées : relancer le script donne ce qui reste à faire.
// Un lot = un seul fichier audio de plusieurs phrases ; voix/aligner.py le redécoupe ensuite (dans le bac à sable Higgsfield).
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { cle } from '../js/voix-cle.js';

const VOIX = { voice_type: 'element', voice_id: '0aa4a36d-2dd6-4dad-a0a5-6a4b5bb1a039' }; // la voix choisie (« française énergique »)
const [sortie, filtre = '.', parLot = 25] = process.argv.slice(2);

// Les nombres en lettres : la voix lit mal les chiffres (« 7 » devenait « sette »)
const PETITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const DIZAINES = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
export function enLettres(n) {
  if (n < 20) return PETITS[n];
  if (n < 100) {
    const d = Math.floor(n / 10), u = n % 10, reste = d === 7 || d === 9 ? u + 10 : u;
    if (reste === 0) return d === 8 ? 'quatre-vingts' : DIZAINES[d];
    return `${DIZAINES[d]}${(reste === 1 || reste === 11) && d < 8 ? ' et ' : '-'}${PETITS[reste]}`;
  }
  if (n < 1000) { const c = Math.floor(n / 100), r = n % 100; return `${c > 1 ? `${PETITS[c]} ` : ''}cent${c > 1 && !r ? 's' : ''}${r ? ` ${enLettres(r)}` : ''}`; }
  if (n < 1000000) { const m = Math.floor(n / 1000), r = n % 1000; return `${m > 1 ? `${enLettres(m)} ` : ''}mille${r ? ` ${enLettres(r)}` : ''}`; }
  return String(n);
}
// Le texte donné à la voix : nombres en lettres, signes dits en mots
export const aDire = (t) => t.replace(/(\d+)er\b/g, (_, n) => (n === '1' ? 'premier' : `${enLettres(+n)}ième`)).replace(/(\d+),(\d+)/g, (_, a, b) => `${enLettres(+a)} virgule ${enLettres(+b)}`)
  .replace(/[−-](?=\d)/g, 'moins ').replace(/\d+/g, (n) => (n.length > 6 ? n : enLettres(+n))).replace(/%/g, ' pour cent').replace(/[«»"]/g, '').replace(/\s+/g, ' ').trim();

const pretes = existsSync('voix/audio') ? readdirSync('voix/audio').filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)).sort() : [];
writeFileSync('voix/liste.js', `// Les phrases qui ont une voix enregistrée dans voix/audio/ (écrit par voix/lots.mjs).\nexport const VOIX_PRETES = new Set(${JSON.stringify(pretes)});\n`);
console.log(`${pretes.length} voix prêtes dans voix/audio`);

if (sortie) {
  const re = new RegExp(filtre), vus = new Set(pretes);
  // csv simple : id;source;texte, le texte entre guillemets s'il contient ; ou "
  const textes = readFileSync('voix/phrases.csv', 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/).slice(1).map((l) => { // \r : git peut rendre le fichier avec des fins de ligne Windows
    const [, id, source, t] = l.match(/^([^;]*);([^;]*);(.*)$/);
    return [id, source, t.startsWith('"') ? t.slice(1, -1).replaceAll('""', '"') : t];
  }).filter(([id, source, t]) => re.test(`${id};${source}`) && /\p{L}/u.test(t) && !/\d\/\d/.test(t) && !vus.has(cle(t)) && vus.add(cle(t))).map(([, , t]) => t);

  const lots = [[]];
  for (const t of textes) { // au plus 25 phrases et 1500 lettres par lot : la voix reste régulière
    const l = lots.at(-1);
    if (l.length >= parLot || (l.length && l.join('').length + t.length > 1500)) lots.push([t]); else l.push(t);
  }
  mkdirSync(sortie, { recursive: true });
  const pleins = lots.filter((l) => l.length);
  for (let i = 0; i < pleins.length; i += 8) { // 8 lots par envoi (Higgsfield en fabrique 8 à la fois au plus)
    const paquet = pleins.slice(i, i + 8).map((l, k) => [i + k + 1, l]);
    writeFileSync(`${sortie}/envoi-${i / 8 + 1}.json`, JSON.stringify({
      requests: paquet.map(([index, l]) => ({ index, params: { model: 'elevenlabs_v4', prompt: 'Voix chaleureuse pour enfants, en français', use_unlim: false, dialogue: l.map((t) => ({ text: aDire(t), ...VOIX })) } })),
      cles: Object.fromEntries(paquet.map(([index, l]) => [index, l.map(cle)])), // pour voix/aligner.py : le nom du fichier de chaque phrase
    }));
  }
  console.log(`${textes.length} phrases, ${textes.join('').length} lettres, ${pleins.length} lots, ${Math.ceil(pleins.length / 8)} envois dans ${sortie}`);
}

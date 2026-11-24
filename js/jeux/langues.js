// L'école des langues (île du savoir) : l'allemand et l'anglais, par thèmes.
// « Écoute et touche » : on entend le mot, on touche l'image. Dès 8 ans, aussi « Comment dit-on… ? » : on lit le mot.
// Révision : les mots ratés sont gardés dans le profil et reviennent en tête de la partie suivante, jusqu'à être réussis.
import { melanger, etoilesDuJeu } from '../partie.js';
import { QUESTIONS_PAR_PARTIE } from '../reglages.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('langues', age);

// i : la place de la langue dans chaque mot ci-dessous ; lang : la voix ; pour : « en allemand »
export const LANGUES = {
  allemand: { nom: 'L’allemand', pour: 'en allemand', lang: 'de-DE', drapeau: '🇩🇪', i: 0 },
  anglais: { nom: 'L’anglais', pour: 'en anglais', lang: 'en-GB', drapeau: '🇬🇧', i: 1 },
};

// Chaque mot : [en français, image, [allemand, prononciation], [anglais, prononciation]] ; la prononciation « à la française » sert si la tablette n'a pas la voix
export const THEMES = [
  { cle: 'couleurs', nom: 'Les couleurs', image: '🎨', mots: [
    ['rouge', '🔴', ['rot', 'rôt'], ['red', 'rèd']],
    ['bleu', '🔵', ['blau', 'blaou'], ['blue', 'blou']],
    ['vert', '🟢', ['grün', 'grûn'], ['green', 'grîn']],
    ['jaune', '🟡', ['gelb', 'guèlp'], ['yellow', 'yè-lo']],
    ['noir', '⚫', ['schwarz', 'chvarts'], ['black', 'blak']],
    ['blanc', '⚪', ['weiß', 'vaïss'], ['white', 'ouaït']],
    ['orange', '🟠', ['orange', 'o-ranj'], ['orange', 'o-rinj']],
    ['violet', '🟣', ['lila', 'li-la'], ['purple', 'peur-peul']],
  ] },
  { cle: 'animaux', nom: 'Les animaux', image: '🐾', mots: [
    ['le chien', '🐶', ['der Hund', 'dèr hount'], ['dog', 'dog']],
    ['le chat', '🐱', ['die Katze', 'di ka-tsé'], ['cat', 'kat']],
    ['le cheval', '🐴', ['das Pferd', 'das pfèrt'], ['horse', 'horss']],
    ['la vache', '🐮', ['die Kuh', 'di kou'], ['cow', 'kaou']],
    ['l’oiseau', '🐦', ['der Vogel', 'dèr fo-guel'], ['bird', 'beurd']],
    ['le poisson', '🐟', ['der Fisch', 'dèr fich'], ['fish', 'fich']],
    ['le lapin', '🐰', ['der Hase', 'dèr ha-zé'], ['rabbit', 'ra-bit']],
    ['la souris', '🐭', ['die Maus', 'di maous'], ['mouse', 'maouss']],
  ] },
  { cle: 'nombres', nom: 'Les nombres', image: '🔢', mots: [
    ['un', '1️⃣', ['eins', 'aïnss'], ['one', 'ouann']],
    ['deux', '2️⃣', ['zwei', 'tsvaï'], ['two', 'tou']],
    ['trois', '3️⃣', ['drei', 'draï'], ['three', 'sri']],
    ['quatre', '4️⃣', ['vier', 'fir'], ['four', 'for']],
    ['cinq', '5️⃣', ['fünf', 'funf'], ['five', 'faïv']],
    ['six', '6️⃣', ['sechs', 'zèks'], ['six', 'siks']],
    ['sept', '7️⃣', ['sieben', 'zi-bèn'], ['seven', 'sè-vèn']],
    ['dix', '🔟', ['zehn', 'tsén'], ['ten', 'tèn']],
  ] },
  { cle: 'famille', nom: 'La famille', image: '👨‍👩‍👧', mots: [
    ['la maman', '👩', ['die Mama', 'di ma-ma'], ['mum', 'meum']],
    ['le papa', '👨', ['der Papa', 'dèr pa-pa'], ['dad', 'dad']],
    ['la sœur', '👧', ['die Schwester', 'di chvès-ter'], ['sister', 'sis-teur']],
    ['le frère', '👦', ['der Bruder', 'dèr brou-der'], ['brother', 'bra-zeur']],
    ['la grand-mère', '👵', ['die Oma', 'di o-ma'], ['grandma', 'grann-ma']],
    ['le grand-père', '👴', ['der Opa', 'dèr o-pa'], ['grandpa', 'grann-pa']],
    ['le bébé', '👶', ['das Baby', 'das bé-bi'], ['baby', 'bé-bi']],
  ] },
  { cle: 'nourriture', nom: 'À table', image: '🍽️', mots: [
    ['la pomme', '🍎', ['der Apfel', 'dèr ap-fel'], ['apple', 'a-peul']],
    ['le pain', '🍞', ['das Brot', 'das brôt'], ['bread', 'brèd']],
    ['le lait', '🥛', ['die Milch', 'di milch'], ['milk', 'milk']],
    ['le fromage', '🧀', ['der Käse', 'dèr kè-zé'], ['cheese', 'tchiz']],
    ['la banane', '🍌', ['die Banane', 'di ba-na-né'], ['banana', 'ba-na-na']],
    ['l’œuf', '🥚', ['das Ei', 'das aï'], ['egg', 'èg']],
    ['l’eau', '💧', ['das Wasser', 'das vas-ser'], ['water', 'ouo-teu']],
    ['la glace', '🍦', ['das Eis', 'das aïss'], ['ice cream', 'aïss krim']],
  ] },
  { cle: 'ecole', nom: 'À l’école', image: '🏫', mots: [
    ['l’école', '🏫', ['die Schule', 'di chou-lé'], ['school', 'skoul']],
    ['le livre', '📖', ['das Buch', 'das bouH'], ['book', 'bouk']],
    ['le cahier', '📓', ['das Heft', 'das hèft'], ['notebook', 'nôt-bouk']],
    ['le crayon', '✏️', ['der Bleistift', 'dèr blaï-chtift'], ['pencil', 'pèn-sil']],
    ['les ciseaux', '✂️', ['die Schere', 'di ché-ré'], ['scissors', 'si-zeurz']],
    ['la règle', '📏', ['das Lineal', 'das li-né-al'], ['ruler', 'rou-leur']],
    ['le sac d’école', '🎒', ['der Schulranzen', 'dèr choul-ran-tsen'], ['school bag', 'skoul bag']],
    ['la maîtresse', '👩‍🏫', ['die Lehrerin', 'di lé-ré-rin'], ['teacher', 'ti-tcheur']],
  ] },
];
export const theme = (cle) => THEMES.find((t) => t.cle === cle);

const REVISION_MAX = 3; // au plus 3 mots ratés repris en tête de partie

// Une question sur un mot. mode : 'ecoute' (entendre, toucher l'image) ou 'lire' (lire, toucher le mot écrit)
export function question(t, mot, langue, mode, aleatoire = Math.random) {
  const L = LANGUES[langue], [fr, image] = mot, [ecrit, dire] = mot[2 + L.i];
  const autres = melanger(t.mots.filter((m) => m !== mot), aleatoire).slice(0, 3);
  const base = { fr, mot: ecrit, dire, lang: L.lang, solution: `« ${ecrit} », c’est ${fr}.` };
  if (mode === 'lire') {
    const titre = `Comment dit-on « ${fr} » ${L.pour} ?`;
    return { ...base, mode, texte: titre, titre, consigne: titre, image, reponse: ecrit, choix: melanger([ecrit, ...autres.map((m) => m[2 + L.i][0])], aleatoire) };
  }
  return { ...base, mode, texte: `écoute:${fr}`, titre: 'Écoute bien… Touche la bonne image !', consigne: 'Écoute bien, et touche la bonne image.', image: '👂', reponse: image, choix: melanger([image, ...autres.map((m) => m[1])], aleatoire) };
}

// Les 10 questions : d'abord les mots ratés de ce thème (révision), puis les autres mélangés, en reprenant du début s'il en manque.
// Dès 8 ans, une question sur deux se lit.
export function questions({ age, langue, theme: cle, rates = [] }, aleatoire = Math.random) {
  const t = theme(cle);
  const revoir = melanger(t.mots.filter((m) => rates.includes(m[0])), aleatoire).slice(0, REVISION_MAX);
  const suite = melanger(t.mots.filter((m) => !revoir.includes(m)), aleatoire);
  const ordre = [...revoir, ...suite];
  while (ordre.length < QUESTIONS_PAR_PARTIE) ordre.push(...melanger(t.mots, aleatoire));
  return ordre.slice(0, QUESTIONS_PAR_PARTIE).map((m, n) => question(t, m, langue, age > 7 && n % 2 ? 'lire' : 'ecoute', aleatoire));
}

// Les mots ratés, par langue : un mot raté s'ajoute, un mot réussi s'en va
export function noter(profil, langue, fr, juste) {
  const l = ((profil.langues ??= {})[langue] ??= []);
  const i = l.indexOf(fr);
  if (juste && i >= 0) l.splice(i, 1);
  if (!juste && i < 0) l.push(fr);
}
export const aRevoir = (profil, langue, cle) => (profil.langues?.[langue] ?? []).filter((fr) => theme(cle).mots.some((m) => m[0] === fr));

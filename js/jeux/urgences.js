// Les numéros d'urgence (île de la sécurité) : 144 ambulance, 117 police, 118 pompiers. Qui appeler, et quoi dire.
// Ton rassurant : les secours sont des personnes gentilles dont le métier est d'aider. À FAIRE RELIRE PAR UN PARENT.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('urgences', age);

export const NUMEROS = [
  { numero: '144', nom: 'L’ambulance', image: '🚑', couleur: '#e05252', quand: 'Quand quelqu’un est très malade ou gravement blessé, et qu’il faut vite un médecin.' },
  { numero: '117', nom: 'La police', image: '🚓', couleur: '#2f6fd0', quand: 'Quand quelqu’un fait quelque chose de dangereux ou d’interdit, ou qu’il y a un accident sur la route.' },
  { numero: '118', nom: 'Les pompiers', image: '🚒', couleur: '#e8873a', quand: 'Quand il y a du feu, de la fumée, de l’eau qui inonde, ou quelqu’un de coincé.' },
];
export const PAS_URGENT = 'pas';
export const REPONSES = { 144: '🚑 144 : l’ambulance', 117: '🚓 117 : la police', 118: '🚒 118 : les pompiers', pas: '🙋 Pas une urgence : je demande à un adulte' };

// Ce qu'on dit au téléphone, dans l'ordre
export const QUOI_DIRE = [
  ['👋', 'Qui ?', 'Je dis mon prénom et mon nom.'],
  ['📍', 'Où ?', 'Je dis où je suis : la rue, le numéro de la maison et la ville.'],
  ['❗', 'Quoi ?', 'Je dis ce qui se passe, avec des mots simples.'],
  ['📞', 'Et après ?', 'Je reste au téléphone et je réponds aux questions. C’est la personne des secours qui dit quand raccrocher.'],
];
export const RASSURER = 'Les secours sont des personnes gentilles, dont le métier est d’aider. Ils ont l’habitude : même si tu as un peu peur, ils vont t’aider à expliquer. Avec tes parents, apprends ton adresse par cœur !';

// [situation, image, bonne réponse (numéro ou « pas »), le savais-tu]
export const SITUATIONS = [
  ['Grand-papa est tombé dans le jardin, et il n’arrive plus à se relever.', '👴', '144', 'Les ambulanciers savent soigner, et ils emmènent à l’hôpital si c’est nécessaire.'],
  ['Papa s’est allongé par terre et ne répond plus quand tu lui parles.', '🛋️', '144', 'Au téléphone, l’ambulancier t’expliquera ce que tu peux faire en attendant. Tu n’es pas seul, tu n’es pas seule.'],
  ['La voisine est tombée dans l’escalier et s’est fait très mal.', '🩹', '144', 'Reste près d’elle si tu peux, et ouvre la porte quand l’ambulance arrive.'],
  ['Quelqu’un a beaucoup de mal à respirer et devient tout pâle.', '😮‍💨', '144', 'Quand quelqu’un respire mal, il faut vite appeler : les secours arrivent rapidement.'],
  ['Tu vois de la fumée qui sort de la fenêtre d’une maison.', '🏠', '118', 'Les pompiers arrivent avec leur grand camion rouge et de l’eau pour éteindre le feu.'],
  ['Un feu a démarré dans la cuisine.', '🔥', '118', 'D’abord, tu sors de la maison avec tout le monde. Ensuite, tu appelles le 118, depuis dehors.'],
  ['Après un gros orage, l’eau inonde la cave.', '🌊', '118', 'Les pompiers aident aussi quand l’eau inonde une maison.'],
  ['Un chien est tombé dans un trou et n’arrive pas à en sortir.', '🐕', '118', 'Les pompiers aident aussi quand une personne ou un animal est coincé.'],
  ['Tu vois quelqu’un casser la vitre d’une voiture pour prendre un sac.', '🚗', '117', 'Tu ne t’approches pas : tu appelles la police de loin, ou tu préviens un adulte.'],
  ['Deux voitures se sont touchées au carrefour. Personne n’est blessé, mais elles bloquent la route.', '🚦', '117', 'S’il y a des blessés, on appelle aussi l’ambulance au 144.'],
  ['Une personne que tu ne connais pas te suit dans la rue, et ça te fait peur.', '🚶', '117', 'Va dans un magasin ou chez quelqu’un que tu connais, et demande de l’aide. Tu peux aussi appeler le 117.'],
  ['Tu as perdu ton doudou.', '🧸', 'pas', 'Ce n’est pas une urgence : un adulte de la maison peut t’aider à le chercher.'],
  ['Tu t’es fait une petite égratignure au genou.', '🦵', 'pas', 'Un pansement et un câlin suffisent ! Les secours sont pour les blessures graves.'],
  ['Ton ami ne veut plus jouer avec toi.', '😢', 'pas', 'C’est triste, mais ce n’est pas une urgence. Tu peux en parler à un adulte.'],
  ['Tu as envie d’entendre la voix des pompiers, juste pour rire.', '😜', 'pas', 'Appeler les secours pour rire, c’est interdit : pendant ce temps, quelqu’un qui a vraiment besoin d’aide pourrait attendre.'],
];

// [question, bonne réponse, [autres], le savais-tu, grand ?]
export const QUESTIONS = [
  ['Quel numéro appelles-tu pour une ambulance ?', '144', ['117', '118', '112 345'], 'Pour retenir : 144, c’est le numéro de l’ambulance.'],
  ['Quel numéro appelles-tu pour les pompiers ?', '118', ['144', '117', '1 000'], 'Les pompiers éteignent les feux, mais ils aident aussi dans beaucoup d’autres situations.'],
  ['Quel numéro appelles-tu pour la police ?', '117', ['118', '144', '0'], 'La police aide aussi les enfants perdus.'],
  ['Au téléphone, que dis-tu en premier ?', 'Qui je suis : mon prénom et mon nom', ['Une blague', 'Mon dessin animé préféré', 'Rien du tout'], 'Qui ? Où ? Quoi ? : trois questions pour bien expliquer.'],
  ['Pourquoi faut-il dire où tu es ?', 'Pour que les secours puissent venir', ['Pour faire la conversation', 'Pour gagner un prix', 'Ce n’est pas utile'], 'Apprends ton adresse avec tes parents : la rue, le numéro et la ville.'],
  ['Que dis-tu pour expliquer où tu es ?', 'Mon adresse : la rue, le numéro et la ville', ['Ma couleur préférée', 'Le nom de mon chat', 'L’heure qu’il est'], 'Si tu ne sais pas l’adresse, décris ce que tu vois : un magasin, une école, un panneau.'],
  ['Quand tu as tout expliqué, que fais-tu ?', 'Je reste au téléphone et je réponds aux questions', ['Je raccroche tout de suite', 'Je pars jouer', 'Je rappelle pour vérifier'], 'C’est la personne des secours qui dit quand on peut raccrocher.'],
  ['Comment parles-tu à la personne des secours ?', 'Calmement, en répondant à ses questions', ['En criant très fort', 'En chuchotant', 'En chantant'], 'Respire un bon coup : la personne au téléphone est là pour t’aider.'],
  ['Il y a le feu dans la maison. Que fais-tu d’abord ?', 'Je sors de la maison, puis j’appelle', ['Je cherche mes jouets', 'Je me cache sous le lit', 'J’ouvre toutes les fenêtres'], 'Ne te cache jamais pendant un feu : sors vite et retrouve un adulte.'],
  ['Qui sont les secours ?', 'Des personnes gentilles dont le métier est d’aider', ['Des gens qui grondent', 'Des personnes qu’il faut craindre', 'Des robots'], 'Ambulanciers, policiers et pompiers ont tous appris à aider.'],
  ['Quel numéro d’urgence marche dans toute l’Europe ?', 'Le 112', ['Le 911', 'Le 100', 'Le 999'], 'Le 112 marche dans toute l’Europe, même en Suisse. Le 911, c’est en Amérique.', true],
  ['Faut-il de l’argent ou du crédit sur le téléphone pour appeler les secours ?', 'Non, les numéros d’urgence sont gratuits', ['Oui, c’est très cher', 'Seulement le dimanche', 'Il faut une pièce de 5 francs'], 'On peut appeler les secours gratuitement, même d’un téléphone sans crédit.', true],
  ['Tu as appelé les secours par erreur. Que fais-tu ?', 'Je reste en ligne et je dis que c’est une erreur', ['Je raccroche et je me cache', 'Je fais une blague', 'Je ne dis rien'], 'Si tu raccroches, les secours vont rappeler pour vérifier que tout va bien.', true],
];

// 10 questions : surtout des situations (« Qui appeler ? »), et des questions sur quoi dire. 4 choix pour tout le monde.
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const petits = age <= 7;
  if (aleatoire() < 0.6) {
    const [texte, image, bonne, savais] = parmiLesNouveaux(SITUATIONS, (s) => s[0], vus, aleatoire);
    return { mode: 'situation', texte, titre: texte, image, consigne: `${texte} Qui appelles-tu ?`, reponse: bonne, choix: ['144', '117', '118', 'pas'],
      solution: `La bonne réponse : ${REPONSES[bonne]}.`, savaisTu: savais };
  }
  const [texte, bonne, autres, savais] = parmiLesNouveaux(QUESTIONS.filter((q) => !petits || !q[4]), (q) => q[0], vus, aleatoire);
  return { mode: 'choix', texte, titre: texte, consigne: texte, reponse: bonne, choix: melanger([bonne, ...autres], aleatoire), solution: `La bonne réponse : ${bonne}.`, savaisTu: savais };
}
export const libelle = (v) => REPONSES[v] ?? v;

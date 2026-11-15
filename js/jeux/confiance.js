// La maison de la confiance (île du cœur). Thème 1 : « Fait ou avis ? » (texte relu dans relecture/fait-ou-avis.md).
// Règle du lieu : aucune pénalité. Une réponse à revoir donne une explication douce ; les étoiles récompensent
// le fait d'aller au bout d'une étape, jamais les bonnes réponses. À FAIRE RELIRE PAR UN PARENT.
import { melanger } from '../partie.js';

// Les thèmes du lieu, dans l'ordre choisi par les parents. ouvert : false = « Bientôt ».
export const THEMES = [
  { cle: 'fait-avis', nom: 'Fait ou avis ?', image: '🔎', ouvert: true },
  { cle: 'emotions', nom: 'Mes émotions me parlent', image: '💛', ouvert: false },
  { cle: 'droits', nom: 'Mes droits', image: '📜', ouvert: false },
  { cle: 'inconnus', nom: 'Les inconnus', image: '🚶', ouvert: false },
  { cle: 'corps', nom: 'Mon corps m’appartient', image: '🛡️', ouvert: false },
];

export const INTRO = 'Un fait, c’est quelque chose de vrai pour tout le monde : on peut le vérifier. Un avis, c’est ce que quelqu’un pense ou ressent : une autre personne peut penser autrement. « Il pleut » est un fait : on peut regarder par la fenêtre. « La pluie, c’est nul » est un avis.';

// [phrase, réponse, explication]
export const PHRASES = [
  ['Un chat a quatre pattes.', 'fait', 'On peut compter ses pattes.'],
  ['Les chats sont plus mignons que les chiens.', 'avis', 'Certains préfèrent les chiens !'],
  ['Le ciel est bleu quand il fait beau.', 'fait', 'Tout le monde peut le voir.'],
  ['Le bleu est la plus belle couleur.', 'avis', 'Chacun a sa couleur préférée.'],
  ['Une semaine a sept jours.', 'fait', 'On peut les compter sur le calendrier.'],
  ['Le lundi est le pire jour de la semaine.', 'avis', 'Certains aiment bien le lundi.'],
  ['Les fraises sont des fruits.', 'fait', 'C’est vrai pour tout le monde.'],
  ['Les fraises sont meilleures que les bananes.', 'avis', 'Ça dépend des goûts.'],
  ['En hiver, il fait plus froid qu’en été.', 'fait', 'On peut le mesurer avec un thermomètre.'],
  ['L’hiver est la meilleure saison.', 'avis', 'D’autres préfèrent l’été.'],
  ['La Suisse a des montagnes.', 'fait', 'On peut les voir et les compter.'],
  ['La montagne, c’est plus beau que la mer.', 'avis', 'Chacun a son paysage préféré.'],
  ['Un vélo a deux roues.', 'fait', 'On peut les compter.'],
  ['Le foot est le sport le plus amusant.', 'avis', 'D’autres préfèrent la danse ou la natation.'],
  ['Les épinards sont verts.', 'fait', 'Tout le monde voit la même couleur.'],
  ['Les épinards, c’est dégoûtant.', 'avis', 'Certaines personnes adorent les épinards !'],
];
export const AVANT_LES_BLESSANTES = 'Attention : parfois, quelqu’un dit un avis méchant comme si c’était un fait.';
// [phrase, réponse, explication, grand ?] : les deux « faits » dits pour se moquer sont pour les 8 ans et plus
export const BLESSANTES = [
  ['« Tu es moche. »', 'avis', 'Un avis méchant ne dit rien de vrai sur toi.'],
  ['« Ton dessin est nul. »', 'avis', 'C’est ce que pense une personne. Ton dessin peut plaire à beaucoup d’autres.'],
  ['« Tu es {nul|nulle} en foot. »', 'avis', 'Personne n’est « nul » : on apprend en s’entraînant.'],
  ['« Personne ne t’aime. »', 'avis', 'Ce n’est pas un fait, et ce n’est pas vrai : pense aux personnes qui t’aiment.'],
  ['« Tes habits sont ridicules. »', 'avis', 'Chacun a ses goûts. Tu as le droit d’aimer tes habits.'],
  ['« Tu cours comme une tortue. »', 'avis', 'C’est une moquerie, pas un fait. Chacun court à sa vitesse.'],
  ['« Tu portes des lunettes. »', 'fait', 'C’est un fait, et il n’y a rien de mal à ça. Si quelqu’un le dit pour se moquer, c’est la moquerie qui n’est pas gentille.', true],
  ['« Tu es {le plus petit|la plus petite} de la classe. »', 'fait', 'C’est peut-être un fait. Être {petit|petite} n’est ni bien ni mal : ça ne dit pas qui tu es.', true],
];
export const NOMS = { fait: 'un fait', avis: 'un avis' };

// Étape 1 : 8 phrases à trier. D'abord 6 phrases amusantes, puis 2 phrases blessantes.
export function tri(age, aleatoire = Math.random) {
  const blessantes = BLESSANTES.filter((b) => age > 7 || !b[3]);
  return [...melanger(PHRASES, aleatoire).slice(0, 6), ...melanger(blessantes, aleatoire).slice(0, 2)]
    .map(([texte, reponse, explication], i) => ({ texte, reponse, explication, blessante: i >= 6 }));
}
// Ce qu'on dit après une réponse : jamais « faux »
export const retour = (q, choix) => `${choix === q.reponse ? 'Oui !' : `C’est plutôt ${NOMS[q.reponse]}.`} ${q.explication}`;

// Étape 2 : dans la cour de récré. Plusieurs réactions sont bonnes ; une seule est à revoir, avec douceur.
export const REACTIONS = [
  'Je ne le crois pas : c’est son avis, pas un fait.',
  'Je réponds calmement : « C’est ton avis. »',
  'Je m’éloigne et je vais jouer avec quelqu’un d’autre.',
  'J’en parle à un adulte de confiance.',
];
export const A_REVOIR = 'Je lui dis quelque chose de méchant aussi.';
export const DOUCEUR = 'On comprend que tu aies envie de répondre. Mais une méchanceté de plus ne répare rien, et tu te sentirais moins bien après. Regarde ce que tu peux faire à la place.';
// [situation, ça se répète ?]
export const SITUATIONS = [
  ['À la récré, Léo dit à Sami : « Tu cours trop lentement, tu es nul. »'],
  ['Dans le vestiaire, quelqu’un dit à Inès : « Ton pull est moche. »'],
  ['En classe, un enfant regarde le dessin de Noé et dit : « C’est n’importe quoi, ton dessin. »'],
  ['À la cantine, une fille dit à Lina : « Tu manges bizarrement. »'],
  ['Pendant un jeu, on dit à Malik : « On ne veut pas de toi, tu joues mal. »'],
  ['Tous les jours, le même enfant se moque du prénom d’Aya.', true],
];
// 7 ans et moins : on ne nomme pas le harcèlement, on dit seulement d'en parler
export const quandCaSeRepete = (age) => (age > 7
  ? 'Quand ça se répète, ou quand ça fait mal, ça s’appelle du harcèlement. Ce n’est jamais ta faute. Il faut toujours en parler à un adulte de confiance.'
  : 'Quand ça se répète, ce n’est jamais ta faute. Il faut toujours en parler à un adulte de confiance.');
// 3 situations par partie ; celle qui se répète vient en dernier
export function recre(aleatoire = Math.random) {
  const [repete] = SITUATIONS.filter((s) => s[1]);
  return [...melanger(SITUATIONS.filter((s) => !s[1]), aleatoire).slice(0, 2), repete].map(([texte, seRepete]) => ({ texte, seRepete: !!seRepete }));
}

// Étape 3 : le miroir. Des phrases vraies sur soi, autant qu'on veut. Rien n'est enregistré.
export const MIROIR = [
  'Je sais faire rire quelqu’un.', 'J’ai déjà aidé quelqu’un.', 'J’ai appris quelque chose de nouveau cette année.',
  'Je suis {un bon ami|une bonne amie}.', 'Je sais dire pardon.', 'Je prends soin d’un animal ou d’une plante.',
  'J’essaie encore quand c’est difficile.', 'Quelqu’un m’aime très fort.', 'Je sais faire quelque chose que je ne savais pas faire avant.',
  'J’ai de bonnes idées.', 'Je sais écouter.', 'Je sais partager.',
];
export const APRES_LE_MIROIR = 'Tout ça, ce sont des faits sur toi. Un avis méchant ne peut pas les effacer.';

export const FIN = 'Un avis méchant ne dit rien de vrai sur toi. Si ça se répète ou si ça te fait mal, parles-en à un adulte de confiance. Tu peux aussi appeler le 147 : c’est gratuit, jour et nuit, et des adultes sont là pour écouter les enfants. Et maintenant, si tu en parlais avec un adulte de ta famille ?';

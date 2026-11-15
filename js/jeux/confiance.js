// La maison de la confiance (île du cœur). Thème 1 : « Fait ou avis ? » (texte relu dans relecture/fait-ou-avis.md).
// Règle du lieu : aucune pénalité. Une réponse à revoir donne une explication douce ; les étoiles récompensent
// le fait d'aller au bout d'une étape, jamais les bonnes réponses. Thèmes 1, 2 et 3 relus et validés par un parent le 15 novembre 2026 ; chaque nouveau thème est à faire relire avant d'être ouvert.
import { melanger } from '../partie.js';

// Les thèmes du lieu, dans l'ordre choisi par les parents. ouvert : false = « Bientôt ».
export const THEMES = [
  { cle: 'fait-avis', nom: 'Fait ou avis ?', image: '🔎', ouvert: true },
  { cle: 'emotions', nom: 'Mes émotions me parlent', image: '💛', ouvert: true },
  { cle: 'droits', nom: 'Mes droits', image: '📜', ouvert: true },
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
// [situation, ça se répète ?]. On s'adresse à l'enfant (« te dit »), comme les réactions qui sont à la première personne.
// « Imagine » garde de la distance ; aucun prénom, ni celui de l'enfant ni celui d'un camarade.
export const SITUATIONS = [
  ['Imagine : à la récré, un enfant te dit : « Tu cours trop lentement, tu es {nul|nulle}. »'],
  ['Imagine : dans le vestiaire, quelqu’un te dit : « Ton pull est moche. »'],
  ['Imagine : en classe, un enfant regarde ton dessin et dit : « C’est n’importe quoi, ton dessin. »'],
  ['Imagine : à la cantine, une fille te dit : « Tu manges bizarrement. »'],
  ['Imagine : pendant un jeu, on te dit : « On ne veut pas de toi, tu joues mal. »'],
  ['Imagine : à la piscine, quelqu’un te dit : « Tu nages comme un caillou. »'],
  ['Imagine : un enfant regarde tes chaussures et dit : « Elles sont trop moches. »'],
  ['Imagine : à la récré, on te dit : « Tu es trop {petit|petite} pour jouer avec nous. »'],
  ['Imagine : en classe, tu te trompes en lisant, et un enfant rit : « Tu ne sais même pas lire ! »'],
  ['Imagine : à un anniversaire, quelqu’un te dit : « Ton cadeau est nul. »'],
  ['Imagine : au parc, un enfant te dit : « Ton vélo, c’est un vélo de bébé. »'],
  ['Imagine : quelqu’un te dit : « Tu as une drôle de voix. »'],
  ['Imagine : tu as pleuré, et on te dit : « Tu pleures tout le temps, tu es un bébé. »'],
  ['Imagine : tous les jours, le même enfant se moque de ton prénom.', true],
  ['Imagine : chaque matin dans le bus, les mêmes enfants rient quand tu montes.', true],
  ['Imagine : à chaque récré, le même groupe te dit : « Va-t’en, on ne joue pas avec toi. »', true],
];
// 7 ans et moins : on ne nomme pas le harcèlement, on dit seulement d'en parler
export const quandCaSeRepete = (age) => (age > 7
  ? 'Quand ça se répète, ou quand ça fait mal, ça s’appelle du harcèlement. Ce n’est jamais ta faute. Il faut toujours en parler à un adulte de confiance.'
  : 'Quand ça se répète, ce n’est jamais ta faute. Il faut toujours en parler à un adulte de confiance.');
// 3 situations par partie ; une de celles qui se répètent vient en dernier
export function recre(aleatoire = Math.random) {
  const [repete] = melanger(SITUATIONS.filter((s) => s[1]), aleatoire);
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

// ---------- Thème 2 : « Mes émotions me parlent » (texte d'origine : relecture/mes-emotions.md) ----------
// L'angle n'est pas celui de la météo des émotions (reconnaître une émotion) : ici, une émotion est un message qui protège.
// Les situations sur le corps (bisou obligé, bras) et sur l'adulte qui demande un secret sont gardées pour le thème 5.
export const INTRO_EMOTIONS = 'Tes émotions sont comme des petits messagers. Chacune vient te dire quelque chose d’important. Aucune émotion n’est interdite : même la colère et la peur ont le droit d’être là. Ce qui compte, c’est de les écouter, et de savoir quoi faire ensuite.';

// [émotion (le visage de la météo des émotions), nom, son message, explication, grand ?]
export const MESSAGES = [
  ['peur', 'La peur', '« Attention, il y a peut-être un danger. »', 'La peur te protège. Elle te dit de t’arrêter et d’aller vers un adulte de confiance.'],
  ['colere', 'La colère', '« Quelque chose n’est pas juste pour moi. »', 'La colère te dit que quelqu’un a dépassé une limite. On peut le dire avec des mots, sans taper.'],
  ['tristesse', 'La tristesse', '« J’ai besoin de réconfort. »', 'La tristesse te dit que tu as besoin d’un câlin ou de parler à quelqu’un.'],
  ['joie', 'La joie', '« C’est bon pour moi, j’en veux encore. »', 'La joie te montre ce qui te fait du bien, et les personnes avec qui tu te sens bien.'],
  ['degout', 'Le dégoût', '« Ça, je n’en veux pas. »', 'Le dégoût te protège de ce qui pourrait te rendre malade.'],
  ['timidite', 'La gêne', '« Ça me met mal à l’aise, je veux que ça s’arrête. »', 'La gêne est un vrai signal. Tu n’as pas besoin de savoir pourquoi pour avoir le droit de dire stop.', true],
];
// Étape 1 : pour chaque émotion, retrouver son message parmi ceux des autres (3 choix à 7 ans et moins, 4 ensuite)
export function messages(age, aleatoire = Math.random) {
  const liste = MESSAGES.filter((m) => age > 7 || !m[4]);
  return melanger(liste, aleatoire).map(([emotion, nom, reponse, explication]) => ({
    emotion, texte: `${nom} : que vient-elle te dire ?`.replace('Le dégoût : que vient-elle', 'Le dégoût : que vient-il'), reponse, explication,
    choix: melanger([reponse, ...melanger(liste.filter((m) => m[2] !== reponse), aleatoire).slice(0, age > 7 ? 3 : 2).map((m) => m[2])], aleatoire),
  }));
}
export const retourMessage = (q, choix) => `${choix === q.reponse ? 'Oui !' : `Son message, c’est plutôt : ${q.reponse}`} ${q.explication}`;

export const OUI_NON_INTRO = 'Ton corps te parle aussi. Quand quelque chose te fait du bien, c’est tout doux et tout chaud : c’est un oui. Quand quelque chose ne va pas, ça serre dans le ventre, le cœur bat vite, on a envie de partir : c’est un non. Ton non a toujours raison de se faire entendre.';
// [situation, « oui » ou « non », explication]
export const OUI_NON = [
  ['Mamie te fait un câlin et tu en as très envie.', 'oui', 'Un câlin que tu veux, ça fait du bien.'],
  ['Ton ami te chatouille et vous riez tous les deux.', 'oui', 'Tant que tout le monde s’amuse, c’est un jeu.'],
  ['Ton ami continue de te chatouiller alors que tu as dit « arrête ».', 'non', 'Quand on dit stop, le jeu s’arrête. Sinon, ce n’est plus un jeu.'],
  ['Papa prépare une surprise pour l’anniversaire de maman et te demande de ne rien dire.', 'oui', 'C’est une surprise : elle fait plaisir, et elle sera bientôt dite.'],
  ['Quelqu’un te dit : « Ne le dis à personne, sinon tu auras des ennuis. »', 'non', 'Un secret qui fait peur ou qui serre le ventre, on a toujours le droit de le raconter.'],
  ['Tu joues à ton jeu préféré avec ta cousine.', 'oui', 'Jouer avec quelqu’un qu’on aime, ça fait du bien.'],
  ['Un grand de l’école te demande de lui donner ton goûter, sinon il se fâche.', 'non', 'Ce n’est pas juste. Tu peux en parler à la maîtresse ou à un parent.'],
  ['Ta maîtresse te félicite devant toute la classe.', 'oui', 'Ça fait chaud au cœur, même si on rougit un peu.'],
  ['Quelqu’un regarde par-dessus ton épaule ce que tu écris et se moque.', 'non', 'Tu as le droit de dire : « Arrête, je n’aime pas ça. »'],
  ['Tu te blottis dans ton lit avec ton doudou.', 'oui', 'C’est un moment tout doux, rien que pour toi.'],
];
// Étape 2 : 8 situations à trier
export const ouiNon = (aleatoire = Math.random) => melanger(OUI_NON, aleatoire).slice(0, 8).map(([texte, reponse, explication]) => ({ texte, reponse, explication }));
// Jamais « faux » : chacun ressent les choses à sa façon
export const retourOuiNon = (q, choix) => `${choix === q.reponse ? 'Oui !' : `Chacun ressent les choses à sa façon. Pour beaucoup d’enfants, ça ferait plutôt « ${q.reponse} ». Écoute pourquoi.`} ${q.explication}`;

// Étape 3 : quand ça fait « non ». Quatre gestes, toujours les mêmes ; un seul choix est à revoir, avec douceur.
export const GESTES = [
  'Je m’arrête et j’écoute ce que je ressens.',
  'Je dis « non » ou « stop », bien fort.',
  'Je m’éloigne.',
  'J’en parle à un adulte de confiance.',
];
export const ATTENDRE = 'Je ne dis rien et j’attends que ça passe.';
export const DOUCEUR_ATTENDRE = 'On comprend : parfois on n’ose pas. Mais garder ça pour soi, c’est lourd. Regarde ce que tu peux faire à la place.';
export const QUAND_NON = [
  'Imagine : un copain te pousse pour que tu sautes de très haut, et tu as peur.',
  'Imagine : une grande te demande de lui prêter ton vélo, et tu n’en as pas envie.',
  'Imagine : on te demande de garder un secret qui te serre le ventre.',
  'Imagine : dans un jeu, tout le monde rit sauf toi, et ça te fait mal.',
];
export const quandNon = (aleatoire = Math.random) => melanger(QUAND_NON, aleatoire).slice(0, 3).map((texte) => ({ texte }));

export const FIN_EMOTIONS = 'Tes émotions sont tes alliées. Quand ça fait « non », écoute-les. Tu n’as pas besoin d’expliquer pourquoi : ressentir « non », ça suffit. Et tu n’es jamais {seul|seule} : il y a toujours un adulte de confiance à qui parler. Et maintenant, si tu en parlais avec un adulte de ta famille ?';

// ---------- Thème 3 : « Mes droits » (texte d'origine : relecture/mes-droits.md, relu par un parent) ----------
// Source : la Convention relative aux droits de l'enfant (ONU, 1989), dite avec des mots d'enfant.
export const INTRO_DROITS = 'Tous les enfants du monde ont des droits. Un droit, c’est quelque chose dont tu as besoin pour grandir, et que personne ne peut t’enlever. Tu n’as pas besoin de les mériter : tu les as parce que tu es un enfant. Et tous les autres enfants ont exactement les mêmes.';

// clé : [nom, dit avec des mots d'enfant, grand ?]
export const DROITS = {
  protection: ['Être {protégé|protégée}', 'J’ai le droit d’être en sécurité. Personne n’a le droit de me faire du mal.'],
  soins: ['Être {soigné|soignée}', 'J’ai le droit d’être {soigné|soignée} quand je suis malade ou {blessé|blessée}.'],
  ecole: ['Aller à l’école', 'J’ai le droit d’apprendre.'],
  jeu: ['Jouer et me reposer', 'J’ai le droit de jouer, de rêver et de dormir.'],
  toit: ['Manger et avoir un toit', 'J’ai le droit de manger à ma faim et d’avoir une maison.'],
  famille: ['Avoir un nom et une famille', 'J’ai le droit d’avoir un prénom, et des personnes qui prennent soin de moi.'],
  avis: ['Donner mon avis', 'J’ai le droit de dire ce que je pense, et qu’on m’écoute.'],
  respect: ['Être {respecté|respectée} comme je suis', 'J’ai les mêmes droits que tous les enfants, quelles que soient ma couleur de peau, ma langue, ma religion, que je sois une fille ou un garçon, ou que j’aie un handicap.'],
  secret: ['Avoir mon jardin secret', 'J’ai le droit d’avoir des choses à moi : mon journal, mes pensées.', true],
};
const droitsPour = (age) => Object.keys(DROITS).filter((k) => age > 7 || !DROITS[k][2]);

export const DROIT_ENVIE_INTRO = 'Un droit, c’est ce dont tous les enfants ont besoin. Une envie, c’est ce qui fait plaisir, mais dont on peut se passer.';
export const NOMS_DROITS = { droit: 'un droit', envie: 'une envie' };
// [phrase, « droit » ou « envie », explication]
export const DROIT_ENVIE = [
  ['Aller à l’école.', 'droit', 'Tous les enfants ont le droit d’apprendre.'],
  ['Avoir une tablette rien qu’à moi.', 'envie', 'C’est agréable, mais on peut grandir sans.'],
  ['Être {soigné|soignée} quand je suis malade.', 'droit', 'Tous les enfants ont le droit d’être soignés.'],
  ['Manger des bonbons tous les jours.', 'envie', 'Tu as le droit de manger à ta faim. Les bonbons, c’est en plus !'],
  ['Avoir un endroit où dormir.', 'droit', 'Tous les enfants ont le droit d’avoir un toit.'],
  ['Me coucher à minuit.', 'envie', 'Tu as le droit de te reposer. L’heure du coucher, ce sont tes parents qui la choisissent.'],
  ['Jouer.', 'droit', 'Oui, jouer est un vrai droit !'],
  ['Avoir le jouet que j’ai vu à la télé.', 'envie', 'Tu as le droit de jouer, pas d’avoir tous les jouets.'],
  ['Dire ce que je pense.', 'droit', 'Tu as le droit de donner ton avis, et qu’on t’écoute.'],
  ['Décider de tout à la maison.', 'envie', 'Donner son avis ne veut pas dire décider de tout : les adultes écoutent, puis choisissent ce qui est bon pour toi.'],
  ['Être en sécurité.', 'droit', 'Personne n’a le droit de te faire du mal.'],
  ['Ne jamais ranger ma chambre.', 'envie', 'Bien essayé ! Ranger, ça fait partie de la vie ensemble.'],
  ['Avoir un prénom.', 'droit', 'Dès ta naissance, tu as le droit d’avoir un prénom rien qu’à toi.'],
  ['Avoir des personnes qui prennent soin de moi.', 'droit', 'Tous les enfants ont le droit d’avoir une famille ou des adultes qui veillent sur eux.'],
];
// Étape 1 : 8 phrases à trier
export const droitOuEnvie = (aleatoire = Math.random) => melanger(DROIT_ENVIE, aleatoire).slice(0, 8).map(([texte, reponse, explication]) => ({ texte, reponse, explication }));
export const retourDroitEnvie = (q, choix) => `${choix === q.reponse ? 'Oui !' : `C’est plutôt ${NOMS_DROITS[q.reponse]}.`} ${q.explication}`;

// [situation, le droit respecté]
export const RESPECTES = [
  ['Tu as de la fièvre, et on t’emmène chez le médecin.', 'soins'],
  ['Chaque matin, tu vas à l’école.', 'ecole'],
  ['Après les devoirs, tu vas jouer dehors.', 'jeu'],
  ['À la maison, on te demande ce que tu préfères pour les vacances, et on t’écoute.', 'avis'],
  ['Le soir, il y a un repas chaud et un lit pour toi.', 'toit'],
  ['Quand tu traverses, un adulte te donne la main.', 'protection'],
  ['On t’appelle par ton prénom, et quelqu’un vient te chercher à l’école.', 'famille'],
  ['Dans ta classe, une élève en fauteuil roulant fait la sortie avec tout le monde.', 'respect'],
  ['Personne ne lit ton journal sans te le demander.', 'secret'],
];
// Étape 2 : 6 situations ; retrouver le droit parmi 3 (7 ans et moins) ou 4
export function respectes(age, aleatoire = Math.random) {
  const cles = droitsPour(age);
  return melanger(RESPECTES.filter(([, d]) => cles.includes(d)), aleatoire).slice(0, 6).map(([texte, reponse]) => ({
    texte, reponse, choix: melanger([reponse, ...melanger(cles.filter((k) => k !== reponse), aleatoire).slice(0, age > 7 ? 3 : 2)], aleatoire),
  }));
}
export const retourRespecte = (q, choix) => `${choix === q.reponse ? 'Oui !' : `C’est plutôt le droit : ${DROITS[q.reponse][0].toLowerCase()}.`} ${DROITS[q.reponse][1]}`;

// Étape 3 : quand un droit n'est pas respecté. Quatre bonnes idées, toujours les mêmes ; un seul choix est à revoir.
export const IDEES_DROITS = [
  'Je dis avec des mots : « Ce n’est pas juste. »',
  'Je reste près de l’enfant à qui ça arrive.',
  'J’en parle à un adulte de confiance.',
  'Je me rappelle que ce n’est pas ma faute.',
];
export const NORMAL = 'Je me dis que c’est normal, et je ne fais rien.';
export const DOUCEUR_NORMAL = 'Parfois, on ne sait pas quoi faire, et c’est normal d’hésiter. Mais un droit qui n’est pas respecté, ce n’est jamais « normal ». Regarde ce que tu peux faire à la place.';
// [situation, grand ?]
export const PAS_RESPECTES = [
  ['Imagine : à la récré, un enfant est toujours mis de côté parce qu’il ne parle pas encore bien français.'],
  ['Imagine : dans un jeu, on dit à une fille : « Toi, tu ne peux pas jouer, c’est un jeu de garçons. »'],
  ['Imagine : en classe, on rit dès qu’un enfant prend la parole, et il n’ose plus rien dire.'],
  ['Imagine : un enfant te raconte qu’il a souvent faim à l’école parce qu’il n’a pas de goûter.'],
  ['Imagine : quelqu’un lit ton journal devant tout le monde pour se moquer.', true],
];
export const pasRespectes = (age, aleatoire = Math.random) => melanger(PAS_RESPECTES.filter((s) => age > 7 || !s[1]), aleatoire).slice(0, 3).map(([texte]) => ({ texte }));

export const DROITS_DES_AUTRES = 'Tous les enfants ont les mêmes droits que toi. Alors, quand tu respectes les autres, tu respectes leurs droits : tu les laisses jouer, tu les écoutes, tu ne leur fais pas de mal. Avoir des droits, ça ne veut pas dire tout décider. Les adultes qui t’aiment t’écoutent, puis choisissent ce qui est bon pour toi.';
export const FIN_DROITS = 'Tes droits sont à toi, pour toujours. Personne ne peut te les enlever. Si un jour quelque chose ne te semble pas juste, ou si quelqu’un te fait du mal, parles-en à un adulte de confiance. Tu peux aussi appeler le 147 : c’est gratuit, jour et nuit, et des adultes sont là pour écouter les enfants. Et maintenant, si tu en parlais avec un adulte de ta famille ?';

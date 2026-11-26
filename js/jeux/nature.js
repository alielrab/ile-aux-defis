// L'île de la nature : deux quiz. La cabane nature (le petit naturaliste : animaux, plantes, arbres) et le potager (fruits, légumes, saisons).
// 7 ans et moins : les questions faciles, 3 choix. Dès 8 ans : toutes les questions, 4 choix.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';
import { questionsDesFiches } from './nature-fiches.js';

// [image, question, bonne réponse, les autres réponses]
export const NATURALISTE = { faciles: [
  ['🦔', 'Quel est cet animal ?', 'Le hérisson', ['La taupe', 'Le castor', 'La marmotte']],
  ['🦊', 'Quel est cet animal ?', 'Le renard', ['Le loup', 'Le chien', 'Le blaireau']],
  ['🦉', 'Quel est cet oiseau ?', 'Le hibou', ['L’aigle', 'Le pigeon', 'Le corbeau']],
  ['🐿️', 'Quel est cet animal ?', 'L’écureuil', ['La souris', 'Le lapin', 'Le castor']],
  ['🦋', 'Quel est cet insecte ?', 'Le papillon', ['L’abeille', 'La libellule', 'La coccinelle']],
  ['🐞', 'Quel est cet insecte ?', 'La coccinelle', ['Le scarabée', 'La fourmi', 'L’araignée']],
  ['🐝', 'Quel insecte fabrique le miel ?', 'L’abeille', ['La guêpe', 'La mouche', 'Le papillon']],
  ['🌻', 'Quelle est cette fleur ?', 'Le tournesol', ['La rose', 'La tulipe', 'La marguerite']],
  ['🌷', 'Quelle est cette fleur ?', 'La tulipe', ['La rose', 'Le tournesol', 'Le muguet']],
  ['🍄', 'Qu’est-ce que c’est ?', 'Un champignon', ['Une fleur', 'Un fruit', 'Un caillou']],
  ['🐸', 'Comment s’appelle le bébé de la grenouille ?', 'Le têtard', ['Le poussin', 'Le chaton', 'Le veau']],
  ['🐛', 'En quoi la chenille se transforme-t-elle ?', 'En papillon', ['En abeille', 'En escargot', 'En oiseau']],
  ['🌳', 'Que perdent beaucoup d’arbres en automne ?', 'Leurs feuilles', ['Leurs racines', 'Leur tronc', 'Leurs branches']],
  ['🐌', 'Que porte l’escargot sur son dos ?', 'Sa coquille', ['Son nid', 'Ses ailes', 'Son sac']],
  ['🕷️', 'Combien de pattes a une araignée ?', 'Huit', ['Six', 'Quatre', 'Dix']],
  ['🐜', 'Combien de pattes a un insecte, comme la fourmi ?', 'Six', ['Quatre', 'Huit', 'Dix']],
], difficiles: [
  ['🌰', 'De quel arbre vient le gland ?', 'Le chêne', ['Le sapin', 'Le bouleau', 'Le marronnier']],
  ['🌲', 'Quel arbre garde ses aiguilles tout l’hiver ?', 'Le sapin', ['Le chêne', 'Le hêtre', 'Le cerisier']],
  ['🍂', 'Quel arbre des Alpes perd ses aiguilles en automne ?', 'Le mélèze', ['Le sapin', 'L’épicéa', 'Le pin']],
  ['🦇', 'Quel mammifère sait voler ?', 'La chauve-souris', ['L’écureuil', 'Le hérisson', 'La marmotte']],
  ['🦌', 'Comment appelle-t-on ce que le cerf porte sur la tête, et qui tombe chaque année ?', 'Les bois', ['Les défenses', 'Les griffes', 'Les antennes']],
  ['🦔', 'Que font la marmotte et le hérisson pendant l’hiver ?', 'Ils hibernent', ['Ils migrent', 'Ils chassent', 'Ils pondent']],
  ['🐦', 'Comment appelle-t-on le voyage des oiseaux vers les pays chauds ?', 'La migration', ['L’hibernation', 'La mue', 'La ponte']],
  ['🌱', 'Par où la plante boit-elle l’eau du sol ?', 'Par ses racines', ['Par ses feuilles', 'Par ses fleurs', 'Par ses fruits']],
  ['☀️', 'De quoi une plante a-t-elle besoin pour pousser ?', 'D’eau, de lumière et d’air', ['De sucre et de sel', 'De bruit', 'De froid et de nuit']],
  ['🐝', 'Que transportent les abeilles de fleur en fleur ?', 'Le pollen', ['Le miel', 'Les graines', 'La sève']],
  ['🦅', 'Quel grand rapace niche dans les Alpes ?', 'L’aigle royal', ['Le perroquet', 'Le manchot', 'Le flamant rose']],
  ['🐺', 'Quel animal vit en meute ?', 'Le loup', ['Le renard', 'Le hérisson', 'Le lynx']],
  ['🪵', 'Comment connaît-on l’âge d’un arbre coupé ?', 'En comptant les cernes du tronc', ['En mesurant ses feuilles', 'En comptant ses branches', 'En pesant ses fruits']],
  ['🐾', 'Quel félin sauvage aux oreilles pointues vit dans les forêts suisses ?', 'Le lynx', ['Le tigre', 'Le lion', 'Le guépard']],
  ['🦫', 'Quel animal construit des barrages sur les rivières ?', 'Le castor', ['La loutre', 'Le canard', 'Le hérisson']],
] };

// Les images (images/potager/<nom>.webp) à la place des emojis des quiz. Les emojis restent dans les questions : les voix enregistrées en dépendent.
export const IMAGES = { '🥕': 'carotte', '🍓': 'fraise', '🎃': 'courge', '🍅': 'tomate', '🥬': 'salade', '🌱': 'pousse-1', '🍎': 'pomme', '🍒': 'cerises', '🌰': 'graine',
  '🪱': 'ver', '🥔': 'pomme-de-terre', '🍏': 'pommier', '🐌': 'salade-grignotee', '🐞': 'coccinelle', '🐝': 'abeille', '♻️': 'compost', '🥦': 'brocoli', '🌽': 'mais',
  '❄️': 'neige', '🍇': 'raisin', '💧': 'arrosoir', '🌻': 'tournesol' };
export const POTAGER = { faciles: [
  ['🥕', 'Quelle partie de la carotte mange-t-on ?', 'La racine', ['La fleur', 'La feuille', 'La graine']],
  ['🍓', 'En quelle saison cueille-t-on les fraises ?', 'Au printemps et en été', ['En automne', 'En hiver', 'Toute l’année']],
  ['🎃', 'En quelle saison récolte-t-on les courges ?', 'En automne', ['Au printemps', 'En hiver', 'Au début de l’été']],
  ['🍎', 'En quelle saison cueille-t-on les pommes ?', 'En automne', ['Au printemps', 'En hiver', 'Au début de l’été']],
  ['🍒', 'En quelle saison cueille-t-on les cerises ?', 'En été', ['En automne', 'En hiver', 'À Noël']],
  ['🌱', 'Que faut-il donner à une plante pour qu’elle pousse ?', 'De l’eau', ['Du lait', 'Du jus', 'Du sirop']],
  ['🌰', 'Que met-on dans la terre pour faire pousser une plante ?', 'Une graine', ['Un caillou', 'Une feuille', 'Un bâton']],
  ['🪱', 'Quel petit animal aide le jardin en creusant la terre ?', 'Le ver de terre', ['La limace', 'La mouche', 'Le moustique']],
  ['🍅', 'De quelle couleur est une tomate bien mûre ?', 'Rouge', ['Verte', 'Bleue', 'Blanche']],
  ['🥔', 'Où poussent les pommes de terre ?', 'Sous la terre', ['Dans les arbres', 'Sur des buissons', 'Dans l’eau']],
  ['🍏', 'Où poussent les pommes ?', 'Sur un arbre', ['Sous la terre', 'Dans l’eau', 'Sur une liane']],
  ['🐌', 'Quel animal aime grignoter les salades du potager ?', 'La limace', ['L’abeille', 'Le ver de terre', 'La coccinelle']],
  ['🥬', 'Quelle partie de la salade mange-t-on ?', 'Les feuilles', ['Les racines', 'Les graines', 'Les fleurs']],
], difficiles: [
  ['🐞', 'Quel insecte aide le jardinier en mangeant les pucerons ?', 'La coccinelle', ['La limace', 'La mouche', 'Le moustique']],
  ['🐝', 'Pourquoi les abeilles sont-elles utiles au potager ?', 'Elles portent le pollen de fleur en fleur', ['Elles arrosent les plantes', 'Elles mangent les limaces', 'Elles creusent la terre']],
  ['♻️', 'Que fabrique-t-on avec les épluchures et les feuilles mortes ?', 'Du compost', ['Du plastique', 'Du verre', 'Du sable']],
  ['🥦', 'Quelle partie du brocoli mange-t-on ?', 'Les fleurs en bouton', ['Les racines', 'Les graines', 'L’écorce']],
  ['🌽', 'Quelle partie du maïs mange-t-on ?', 'Les graines', ['Les racines', 'Les feuilles', 'Les fleurs']],
  ['❄️', 'Quel légume récolte-t-on même en hiver ?', 'Le poireau', ['La tomate', 'La courgette', 'Le concombre']],
  ['🍅', 'En quelle saison récolte-t-on les tomates en Suisse ?', 'En été', ['En hiver', 'Au début du printemps', 'À Noël']],
  ['🌱', 'Que fait une graine quand elle commence à pousser ?', 'Elle germe', ['Elle fane', 'Elle gèle', 'Elle mûrit']],
  ['🍇', 'En quelle saison fait-on les vendanges, la récolte du raisin ?', 'En automne', ['Au printemps', 'En hiver', 'Au début de l’été']],
  ['💧', 'Quand vaut-il mieux arroser le potager en été ?', 'Le soir ou tôt le matin', ['En plein midi', 'Jamais', 'Seulement quand il pleut']],
  ['🥕', 'Lequel est un légume-racine ?', 'Le radis', ['La tomate', 'La salade', 'Le haricot']],
  ['🌻', 'Vers quoi les jeunes tournesols se tournent-ils ?', 'Vers le soleil', ['Vers la lune', 'Vers le sol', 'Vers le nord']],
] };

// Un jeu de quiz à partir d'une banque { faciles, difficiles }
export const quiz = (nom, banque) => ({
  etoilesParBonneReponse: (age) => etoilesDuJeu(nom, age),
  question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
    const petits = age <= 7;
    const [image, titre, bonne, autres] = parmiLesNouveaux(petits ? banque.faciles : [...banque.faciles, ...banque.difficiles], (q) => `${q[0]}${q[1]}`, vus, aleatoire);
    const choix = melanger([bonne, ...melanger(autres, aleatoire).slice(0, petits ? 2 : 3)], aleatoire);
    return { mode: 'choix', texte: `${image}${titre}`, titre, consigne: titre, image, reponse: bonne, choix, solution: `La bonne réponse : ${bonne}.` };
  },
});
// Les premiers secours (île de la sécurité). Les gestes simples, et toujours : prévenir un adulte. À faire relire par un parent ou un soignant.
export const SECOURS = { faciles: [
  ['🩹', 'Tu t’es écorché le genou. Que fais-tu d’abord ?', 'Je nettoie avec de l’eau', ['Je mets de la terre dessus', 'Je frotte très fort', 'Je ne fais rien et je cours']],
  ['👃', 'Ton nez saigne. Comment te mets-tu ?', 'Assis, la tête penchée en avant, en pinçant le nez', ['La tête en arrière', 'Allongé sur le dos', 'La tête en bas']],
  ['🔥', 'Tu t’es brûlé le doigt. Que fais-tu ?', 'Je le passe longtemps sous l’eau fraîche', ['Je mets du beurre', 'Je frotte fort', 'Je le cache']],
  ['🐝', 'Une abeille t’a piqué. Que fais-tu ?', 'Je préviens un adulte', ['Je gratte très fort', 'Je ne dis rien', 'Je cours après l’abeille']],
  ['📞', 'Quelqu’un est gravement blessé. Quel numéro appelle-t-on en Suisse ?', 'Le 144', ['Le 123', 'Le 000', 'Le 999']],
  ['🤕', 'Un copain est tombé et ne se relève pas. Que fais-tu ?', 'Je vais vite chercher un adulte', ['Je le tire par le bras', 'Je lui donne à boire', 'Je rentre chez moi']],
  ['💊', 'Tu trouves des médicaments sur la table. Que fais-tu ?', 'Je n’y touche pas et je préviens un adulte', ['J’en goûte un', 'J’en donne au chat', 'Je les cache']],
  ['🧼', 'Avant de soigner un bobo, que fait-on ?', 'On se lave les mains', ['On se coiffe', 'On met ses chaussures', 'On ferme les yeux']],
  ['🩹', 'À quoi sert un pansement ?', 'À protéger la plaie des saletés', ['À faire joli', 'À tenir chaud', 'À rien du tout']],
  ['🧊', 'Tu t’es cogné, et une bosse arrive. Que fais-tu ?', 'Je mets du froid, dans un linge', ['Je mets du chaud', 'Je frotte très fort', 'Je saute sur place']],
  ['😮', 'Quelqu’un s’étouffe en mangeant et ne peut plus parler. Que fais-tu ?', 'J’appelle tout de suite un adulte', ['Je lui donne à boire', 'Je ris', 'J’attends que ça passe']],
  ['🧴', 'Tu vois une bouteille de produit pour nettoyer. Que fais-tu ?', 'Je n’y touche pas : c’est dangereux', ['Je la sens de près', 'Je goûte', 'Je la vide dans un verre']],
], difficiles: [
  ['📞', 'Au 144, que dis-tu en premier ?', 'Où je suis, et ce qui s’est passé', ['Mon plat préféré', 'Le nom de mon chat', 'Rien : j’attends']],
  ['📞', 'Au téléphone avec le 144, quand peux-tu raccrocher ?', 'Quand la personne au téléphone me le dit', ['Tout de suite', 'Quand j’en ai envie', 'Après dix secondes']],
  ['🔥', 'Combien de temps garde-t-on une brûlure sous l’eau fraîche ?', 'Au moins dix minutes', ['Dix secondes', 'Une minute', 'Le temps de compter jusqu’à trois']],
  ['🤕', 'Quelqu’un est tombé de haut et a très mal au dos. Que fais-tu ?', 'Je ne le déplace pas, et j’appelle un adulte ou le 144', ['Je l’aide à se relever vite', 'Je le porte jusqu’à la maison', 'Je lui masse le dos']],
  ['☠️', 'Quel numéro appelle-t-on en Suisse si quelqu’un a avalé un produit dangereux ?', 'Le 145', ['Le 118', 'Le 117', 'Le 147']],
  ['🩸', 'Une plaie saigne beaucoup. Que fait-on ?', 'On appuie dessus avec un linge propre, et on appelle un adulte', ['On regarde et on attend', 'On la passe au sèche-cheveux', 'On met du sable']],
  ['⚡', 'Quelqu’un touche un fil électrique et reste collé. Que fais-tu ?', 'Je ne le touche pas, et j’appelle vite un adulte', ['Je le tire par la main', 'Je verse de l’eau', 'Je touche le fil aussi']],
  ['🚲', 'Qu’est-ce qui protège ta tête à vélo ?', 'Le casque', ['La casquette', 'Les lunettes', 'Le bonnet']],
  ['🌞', 'Il fait très chaud, et tu as mal à la tête. Que fais-tu ?', 'Je me mets à l’ombre et je bois de l’eau', ['Je cours au soleil', 'Je mets un gros pull', 'Je ne bois rien']],
  ['😴', 'Une personne est par terre et ne répond pas quand on lui parle. Que fais-tu ?', 'J’appelle tout de suite un adulte ou le 144', ['Je la laisse dormir', 'Je lui fais une blague', 'Je pars jouer']],
  ['🧊', 'Pourquoi ne met-on pas un glaçon directement sur la peau ?', 'Il peut abîmer la peau', ['Il est trop mouillé', 'Il fond trop vite', 'Il chatouille']],
  ['🧰', 'Que trouve-t-on dans une trousse de secours ?', 'Des pansements et du désinfectant', ['Des bonbons', 'Des crayons de couleur', 'Des pièces de monnaie']],
] };
export const secours = quiz('secours', SECOURS);
// Le quiz de la cabane nature pose aussi des questions tirées des fiches des animaux et des plantes
export const naturaliste = quiz('naturaliste', { faciles: [...NATURALISTE.faciles, ...questionsDesFiches(false)], difficiles: [...NATURALISTE.difficiles, ...questionsDesFiches(true)] });
export const potager = quiz('potager', POTAGER);

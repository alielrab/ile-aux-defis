// L'île de la nature : deux quiz. La cabane nature (le petit naturaliste : animaux, plantes, arbres) et le potager (fruits, légumes, saisons).
// 7 ans et moins : les questions faciles, 3 choix. Dès 8 ans : toutes les questions, 4 choix.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

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
const quiz = (nom, banque) => ({
  etoilesParBonneReponse: (age) => etoilesDuJeu(nom, age),
  question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
    const petits = age <= 7;
    const [image, titre, bonne, autres] = parmiLesNouveaux(petits ? banque.faciles : [...banque.faciles, ...banque.difficiles], (q) => `${q[0]}${q[1]}`, vus, aleatoire);
    const choix = melanger([bonne, ...melanger(autres, aleatoire).slice(0, petits ? 2 : 3)], aleatoire);
    return { mode: 'choix', texte: `${image}${titre}`, titre, consigne: titre, image, reponse: bonne, choix, solution: `La bonne réponse : ${bonne}.` };
  },
});
export const naturaliste = quiz('naturaliste', NATURALISTE);
export const potager = quiz('potager', POTAGER);

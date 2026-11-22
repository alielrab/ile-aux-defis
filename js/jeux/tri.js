// Le centre de tri (île de la sécurité) : mettre chaque déchet dans la bonne poubelle, avec le tri suisse
// (PET et piles rapportés au magasin, sac poubelle taxé). Les règles changent un peu d'une commune à l'autre. À FAIRE RELIRE PAR UN PARENT.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('tri', age);

export const POUBELLES = ['Le verre', 'Le PET', 'Le papier et le carton', 'L’alu et le fer-blanc', 'Le compost', 'Le sac poubelle', 'Le retour au magasin', 'Le conteneur à habits'];

// [le déchet, sa poubelle, le savais-tu, image, grand ?]
export const DECHETS = [
  ['la bouteille de vin vide', 'Le verre', 'Le verre se refond sans fin : une vieille bouteille peut redevenir une bouteille neuve.', '🍾'],
  ['le pot de confiture vide', 'Le verre', 'On enlève d’abord le couvercle en métal : lui va avec l’alu et le fer-blanc.', '🫙'],
  ['la bouteille d’eau en plastique PET', 'Le PET', 'On rapporte les bouteilles PET au magasin. Avec, on fabrique de nouvelles bouteilles… et même des pulls polaires !', '💧'],
  ['le journal', 'Le papier et le carton', 'Avec le vieux papier, on fabrique du papier neuf, et on coupe moins d’arbres.', '📰'],
  ['la boîte en carton', 'Le papier et le carton', 'On l’aplatit avant de la jeter : elle prend beaucoup moins de place.', '📦'],
  ['le vieux cahier', 'Le papier et le carton', 'Le papier peut être recyclé plusieurs fois avant que ses fibres deviennent trop courtes.', '📓'],
  ['la boîte de conserve vide', 'L’alu et le fer-blanc', 'Le fer-blanc est attiré par un aimant : c’est comme ça qu’on le sépare de l’alu au centre de tri.', '🥫'],
  ['la canette de boisson', 'L’alu et le fer-blanc', 'Une canette recyclée peut redevenir une canette en quelques semaines.', '🥤'],
  ['le trognon de pomme', 'Le compost', 'Dans le compost, les petites bêtes et les vers transforment les restes en terre pour le jardin.', '🍎'],
  ['la peau de banane', 'Le compost', 'Les épluchures deviennent du compost, un très bon engrais pour les plantes.', '🍌'],
  ['les feuilles mortes', 'Le compost', 'Les feuilles mortes nourrissent la terre : dans la forêt, personne ne les ramasse !', '🍂'],
  ['le papier de bonbon', 'Le sac poubelle', 'Les emballages sales ou mélangés ne se recyclent pas : ils vont dans le sac poubelle.', '🍬'],
  ['le mouchoir usagé', 'Le sac poubelle', 'Un mouchoir sale ne va pas au papier : il va dans le sac poubelle.', '🤧'],
  ['la pile usagée', 'Le retour au magasin', 'Les piles contiennent des produits dangereux pour la nature : on les rapporte dans la boîte à piles du magasin.', '🔋'],
  ['le t-shirt devenu trop petit', 'Le conteneur à habits', 'Les habits en bon état servent encore à d’autres personnes. Les autres deviennent des chiffons.', '👕'],
  ['les baskets trop petites', 'Le conteneur à habits', 'Les chaussures vont aussi au conteneur à habits, attachées par paires.', '👟'],
  // Pour les grands
  ['l’ampoule qui ne marche plus', 'Le retour au magasin', 'Les ampoules basse consommation et LED contiennent des matières à récupérer : on les rapporte au magasin.', '💡', true],
  ['le vieux téléphone', 'Le retour au magasin', 'Un téléphone contient un peu d’or et d’argent ! Tout magasin qui en vend doit reprendre les vieux appareils.', '📱', true],
  ['le pot de yaourt vide', 'Le sac poubelle', 'Dans beaucoup de communes, les pots de yaourt vont au sac poubelle. Certaines ont une collecte des plastiques : renseigne-toi !', '🥛', true],
  ['la boîte à pizza grasse', 'Le sac poubelle', 'Le carton plein de gras abîme le papier recyclé : une boîte à pizza sale va dans le sac poubelle.', '🍕', true],
  ['la bouteille d’huile en verre', 'Le verre', 'Au conteneur, on trie le verre par couleur : blanc, brun et vert.', '🫒', true],
  ['les coquilles d’œufs', 'Le compost', 'Les coquilles d’œufs apportent du calcium à la terre du jardin.', '🥚', true],
];

// 10 questions, 4 poubelles proposées ; les déchets « grand » sont pour les 8 ans et plus.
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const [dechet, poubelle, savais, image] = parmiLesNouveaux(DECHETS.filter((d) => age > 7 || !d[4]), (d) => d[0], vus, aleatoire);
  const autres = melanger(POUBELLES.filter((p) => p !== poubelle), aleatoire).slice(0, 3);
  const texte = `Où va ${dechet} ?`;
  return { mode: 'choix', texte, titre: texte, image, consigne: texte, reponse: poubelle, choix: melanger([poubelle, ...autres], aleatoire), solution: `${poubelle} !`, savaisTu: savais };
}

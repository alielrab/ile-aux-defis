// Le code de la route (île de la sécurité) : à pied, à vélo, à trottinette et en voiture, avec les règles suisses
// (passages piétons jaunes, « roues arrêtées »). À FAIRE RELIRE PAR UN PARENT.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('route', age);

// [question, bonne réponse, [autres], le savais-tu, image, grand ?]
export const QUESTIONS = [
  // À pied
  ['Avant de traverser la route, que fais-tu ?', 'Je m’arrête, je regarde, j’écoute, puis je traverse', ['Je cours très vite', 'Je ferme les yeux', 'Je traverse en regardant mes pieds'], 'S’arrêter, regarder, écouter, traverser : quatre gestes, toujours dans cet ordre.', '🚸'],
  ['Où traverses-tu la route ?', 'Sur le passage pour piétons', ['Entre deux voitures garées', 'Au milieu du virage', 'N’importe où'], 'En Suisse, les passages pour piétons sont des bandes jaunes.', '🚶'],
  ['Le petit bonhomme du feu est rouge. Que fais-tu ?', 'J’attends sur le trottoir', ['Je traverse vite', 'Je traverse si aucune voiture ne vient', 'Je traverse en courant'], 'Même s’il n’y a pas de voiture, on attend le bonhomme vert : les plus petits te regardent et font comme toi.', '🚦'],
  ['Le petit bonhomme du feu est vert. Que fais-tu ?', 'Je regarde quand même, puis je traverse', ['Je traverse sans regarder', 'J’attends qu’il redevienne rouge', 'Je traverse en reculant'], 'Un conducteur peut ne pas avoir vu le feu : on regarde toujours avant d’avancer.', '🚦'],
  ['Une voiture ralentit devant le passage pour piétons. Quand traverses-tu ?', 'Quand ses roues sont complètement arrêtées', ['Dès qu’elle ralentit', 'Quand elle klaxonne', 'Avant qu’elle arrive'], 'Roues arrêtées, je peux y aller : tant que les roues tournent, on attend.', '🚗'],
  ['Comment traverses-tu la route ?', 'En marchant, sans courir', ['En courant le plus vite possible', 'En sautant à cloche-pied', 'En jouant avec mon téléphone'], 'En courant, on peut tomber, et les conducteurs ont moins de temps pour te voir.', '🚶'],
  ['Ton ballon roule sur la route. Que fais-tu ?', 'Je m’arrête et je demande à un adulte', ['Je cours le chercher', 'Je crie pour arrêter les voitures', 'Je le suis sans regarder'], 'Un ballon se remplace. Toi, non !', '⚽'],
  ['Sur le trottoir, où marches-tu ?', 'Du côté des maisons, loin de la route', ['Tout au bord de la route', 'Un pied sur la route', 'En équilibre sur la bordure'], 'Les voitures passent tout près du bord : côté maisons, on est plus tranquille.', '🏠'],
  ['Pourquoi ne traverse-t-on pas entre deux voitures garées ?', 'Parce que les conducteurs ne me voient pas', ['Parce que c’est sale', 'Parce que les voitures dorment', 'Parce que c’est trop loin'], 'Si tu ne vois pas la route, les conducteurs ne te voient pas non plus.', '🚙'],
  ['Il fait nuit. Comment t’habilles-tu pour être bien vu des voitures ?', 'Avec des habits clairs et des bandes qui brillent', ['Tout en noir', 'Avec un grand chapeau', 'Avec des lunettes de soleil'], 'Les bandes réfléchissantes renvoient la lumière des phares : on te voit de très loin.', '🌙'],
  ['Tu descends du bus et tu dois traverser. Que fais-tu ?', 'J’attends que le bus soit parti', ['Je passe juste devant le bus', 'Je passe juste derrière le bus', 'Je traverse en courant'], 'Le bus est si grand qu’il te cache : quand il est parti, tu vois bien la route, et on te voit.', '🚌'],
  ['Il n’y a pas de trottoir. Où marches-tu ?', 'Au bord gauche de la route, face aux voitures', ['Au milieu de la route', 'Au bord droit, dos aux voitures', 'En zigzag'], 'À gauche, tu vois les voitures arriver en face de toi.', '🛣️', true],
  // À vélo et à trottinette
  ['Que mets-tu sur la tête pour faire du vélo ?', 'Un casque bien attaché', ['Une casquette', 'Rien du tout', 'Un bonnet de bain'], 'Le casque protège ta tête si tu tombes. Il doit être bien serré sous le menton.', '🚲'],
  ['À vélo, comment montres-tu que tu vas tourner ?', 'Je tends le bras du côté où je tourne', ['Je crie très fort', 'Je ferme les yeux', 'Je ne montre rien'], 'Ton bras, c’est ton clignotant !', '🚲'],
  ['À trottinette sur le trottoir, comment roules-tu ?', 'Doucement, en faisant attention aux piétons', ['Le plus vite possible', 'En slalomant entre les gens', 'En fermant les yeux'], 'Sur le trottoir, ce sont les piétons qui passent en premier.', '🛴'],
  ['Qu’est-ce qui doit bien marcher sur ton vélo avant de partir ?', 'Les freins', ['Le porte-bagages', 'Les autocollants', 'La couleur'], 'Avant de rouler : freins, pneus gonflés, sonnette et lumières.', '🚲'],
  ['La nuit, quelles lumières faut-il sur ton vélo ?', 'Une blanche devant et une rouge derrière', ['Une rouge devant et une blanche derrière', 'Aucune', 'Une verte de chaque côté'], 'Blanc devant, rouge derrière : comme les voitures.', '💡', true],
  ['À vélo, de quel côté de la route roules-tu ?', 'À droite', ['À gauche', 'Au milieu', 'Ça dépend des jours'], 'En Suisse, on roule à droite, à vélo comme en voiture.', '🚲', true],
  // Les panneaux
  ['Que veut dire ce panneau rouge à huit côtés ?', 'Stop : il faut s’arrêter complètement', ['On peut aller plus vite', 'La route est fermée', 'Il y a un magasin'], 'Le panneau stop est le seul panneau à huit côtés : on le reconnaît même de dos.', '🛑'],
  ['Que veut dire un panneau rond et rouge avec une barre blanche ?', 'Sens interdit : on n’entre pas par là', ['Passage pour piétons', 'Parking', 'Fin de la route'], 'Ce panneau est pour les voitures et les vélos. À pied, sur le trottoir, tu peux passer.', '⛔', true],
  ['Que veut dire un panneau en triangle avec un bord rouge ?', 'Attention, danger', ['Il faut s’arrêter', 'Il y a une piste cyclable', 'On peut se garer'], 'Triangle au bord rouge : attention. Rond au bord rouge : interdit. Rond bleu : obligatoire.', '⚠️', true],
  ['Que veut dire un panneau rond et bleu avec un vélo ?', 'Une piste pour les vélos', ['Vélos interdits', 'Un magasin de vélos', 'Une course de vélos'], 'Sur la piste cyclable, les vélos roulent à l’abri des voitures.', '🚴', true],
  // En voiture
  ['En voiture, que fais-tu avant que la voiture démarre ?', 'J’attache ma ceinture', ['J’ouvre la fenêtre', 'Je me mets debout', 'Je détache mon siège'], 'La ceinture, c’est pour tout le monde, même pour un tout petit trajet.', '🚗'],
  ['De quel côté descends-tu de la voiture ?', 'Du côté du trottoir', ['Du côté de la route', 'Par le coffre', 'Par la fenêtre'], 'Côté trottoir, aucune voiture ne peut passer près de toi.', '🚪'],
];

// 10 questions, 4 choix pour tout le monde ; les questions « grand » sont pour les 8 ans et plus.
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const [texte, bonne, autres, savais, image] = parmiLesNouveaux(QUESTIONS.filter((q) => age > 7 || !q[5]), (q) => q[0], vus, aleatoire);
  return { mode: 'choix', texte, titre: texte, image, consigne: texte, reponse: bonne, choix: melanger([bonne, ...autres], aleatoire), solution: `La bonne réponse : ${bonne}.`, savaisTu: savais };
}

// Le vétérinaire (île du village) : soigner des animaux malades ou blessés, et connaître les besoins de chaque animal.
// Les patients : les animaux de l'enfant (avec leur prénom, depuis le refuge) ou ceux de la clinique.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';
import { ANIMAUX } from '../catalogue.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('veto', age);

// Les patients de la clinique, quand l'enfant n'a pas encore d'animal
export const PATIENTS_CLINIQUE = [['animal:chien', 'Filou'], ['animal:chat', 'Mistigri'], ['animal:lapin', 'Pompon'], ['animal:hamster', 'Noisette'], ['animal:tortue', 'Caramel'], ['animal:perroquet', 'Coco']];

// Les besoins de chaque animal (les fiches) et son bon repas
export const FICHES = {
  chien: { nom: 'Le chien', repas: 'Des croquettes pour chien', besoins: 'Le chien a besoin de croquettes pour chien, d’eau fraîche tous les jours, et surtout de promenades : il aime courir et jouer.', savais: 'Le chocolat est dangereux pour les chiens : il ne faut jamais leur en donner.' },
  chat: { nom: 'Le chat', repas: 'Des croquettes pour chat', besoins: 'Le chat a besoin de croquettes pour chat, d’eau fraîche, d’un coin calme pour dormir et d’un griffoir pour ses griffes.', savais: 'Un chat dort environ 15 heures par jour !' },
  lapin: { nom: 'Le lapin', repas: 'Du foin et des légumes', besoins: 'Le lapin mange surtout du foin, et aussi des légumes. Il a besoin de place pour sauter et de compagnie.', savais: 'Les dents du lapin poussent toute sa vie : ronger du foin les use.' },
  hamster: { nom: 'Le hamster', repas: 'Des graines', besoins: 'Le hamster mange des graines et un peu de légumes. Il dort le jour et court la nuit : il aime sa roue !', savais: 'Le hamster transporte sa nourriture dans ses joues, comme dans des poches.' },
  tortue: { nom: 'La tortue', repas: 'De la salade et des légumes', besoins: 'La tortue de terre mange des feuilles, de la salade et des légumes. Elle a besoin de soleil pour se réchauffer.', savais: 'En hiver, la tortue de terre hiberne : elle dort pendant tout l’hiver.' },
  perroquet: { nom: 'Le perroquet', repas: 'Des graines et des fruits', besoins: 'Le perroquet mange des graines et des fruits. Il a besoin de voler un peu, de jouets et qu’on lui parle.', savais: 'Le perroquet apprend des mots en imitant ce qu’il entend.' },
  poisson: { nom: 'Le poisson rouge', repas: 'Des paillettes pour poisson', besoins: 'Le poisson rouge mange des paillettes, un tout petit peu à la fois. Son eau doit être changée régulièrement.', savais: 'Un poisson rouge peut vivre plus de 10 ans s’il est bien soigné !' },
};

// Les problèmes et leur bon soin : [clé, image, symptôme (avec {nom}), bon soin, [autres choix], le savais-tu, espèces concernées]
const TOUS = ['chien', 'chat', 'lapin', 'hamster', 'tortue', 'perroquet'];
const PROBLEMES = [
  ['patte', '🩹', '{nom} boite : sa patte est blessée.', '🩹 Bander la patte', ['🏃 Le faire courir', '🛁 Lui donner un bain', '🍫 Lui donner du chocolat'], 'Un bandage tient la patte au chaud et la protège pendant qu’elle guérit.', TOUS],
  ['coupure', '🤕', '{nom} a une petite coupure sur le dos.', '🧴 Nettoyer et mettre un pansement', ['☀️ Le laisser au soleil', '🎀 Mettre un nœud dessus', '🍬 Lui donner un bonbon'], 'On nettoie d’abord la coupure, pour enlever les microbes.', ['chien', 'chat', 'lapin', 'hamster']],
  ['fievre', '🌡️', '{nom} est tout chaud et très fatigué.', '🌡️ Prendre sa température', ['🎾 Jouer à la balle', '🍦 Lui donner une glace', '🎵 Lui chanter une chanson très fort'], 'Chez le chien et le chat, la température normale est d’environ 38,5 °C : un peu plus que chez nous.', ['chien', 'chat', 'lapin']],
  ['soif', '💧', '{nom} a très soif. Que lui donnes-tu ?', '💧 De l’eau fraîche', ['🥛 Du lait', '🧃 Du sirop', '🥤 Du soda'], 'Les chats et les chiens adultes digèrent mal le lait : l’eau fraîche est la meilleure boisson.', ['chien', 'chat', 'lapin', 'hamster']],
  ['faim', '🍽️', '{nom} a faim. Que lui donnes-tu ?', null, null, null, [...TOUS, 'poisson']],
];
const REPAS = Object.fromEntries(Object.entries(FICHES).map(([k, f]) => [k, f.repas]));

// [question, bonne, [autres], le savais-tu, espèce] : pour les 8 ans et plus
const BESOINS = [
  ['Combien de temps un chat dort-il par jour ?', 'Environ 15 heures', ['Environ 2 heures', 'Environ 6 heures', 'Toute la journée sans se réveiller'], 'chat'],
  ['Pourquoi le lapin doit-il ronger du foin ?', 'Pour user ses dents, qui poussent tout le temps', ['Pour se faire les griffes', 'Pour construire un nid', 'Pour avoir plus chaud'], 'lapin'],
  ['Pourquoi faut-il promener son chien tous les jours ?', 'Pour qu’il se dépense et fasse ses besoins', ['Pour qu’il apprenne à lire', 'Pour qu’il dorme moins', 'Ce n’est pas utile'], 'chien'],
  ['Que fait la tortue de terre en hiver ?', 'Elle hiberne : elle dort tout l’hiver', ['Elle part en voyage', 'Elle change de carapace', 'Elle mange deux fois plus'], 'tortue'],
  ['Quand le hamster est-il le plus actif ?', 'La nuit', ['Le matin', 'À midi', 'Jamais'], 'hamster'],
  ['Comment un perroquet apprend-il des mots ?', 'En imitant ce qu’il entend', ['En lisant', 'En regardant des images', 'Il les sait en naissant'], 'perroquet'],
  ['Que faut-il faire pour l’eau du poisson rouge ?', 'La changer régulièrement', ['Ne jamais la changer', 'Y mettre du sirop', 'La faire bouillir'], 'poisson'],
  ['Quel aliment est dangereux pour un chien ?', 'Le chocolat', ['Les croquettes pour chien', 'L’eau fraîche', 'Un os à mâcher'], 'chien'],
];

// Le texte d'un choix sans son image (pour la voix)
export const libelle = (c) => c.replace(/^[^\p{L}]+/u, '');
export const aDire = (q) => `${q.consigne} ${q.choix.map(libelle).join(', ou ')} ?`;

const espece = (id) => ANIMAUX[id.slice(7)]?.espece ?? id.slice(7);

// reglage : { age, patients: [[id, nom], …] }
export function question({ age, patients = PATIENTS_CLINIQUE }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const petits = age <= 7, n = petits ? 3 : 4;
  if (!petits && aleatoire() < 0.3) {
    const [texte, bonne, autres, esp] = parmiLesNouveaux(BESOINS, (q) => q[0], vus, aleatoire);
    return { mode: 'choix', type: 'besoin', texte, titre: texte, consigne: texte, espece: esp, reponse: bonne, choix: melanger([bonne, ...autres], aleatoire), solution: `La bonne réponse : ${bonne}.`, savaisTu: FICHES[esp].savais };
  }
  const cas = patients.flatMap(([id, nom]) => PROBLEMES.filter((p) => p[6].includes(espece(id))).map((p) => [id, nom, p]));
  const [id, nom, [cle, symptome, texte, bon, autres, savais]] = parmiLesNouveaux(cas, ([i, , p]) => `${i}:${p[0]}`, vus, aleatoire);
  const esp = espece(id), consigne = texte.replace('{nom}', nom);
  const bonne = cle === 'faim' ? REPAS[esp] : bon;
  const faux = cle === 'faim' ? [...Object.values(REPAS).filter((r) => r !== bonne), 'Du chocolat', 'Des bonbons'] : autres;
  return { mode: 'soin', type: cle, texte: `${id}:${cle}`, titre: consigne, consigne: consigne.endsWith('?') ? consigne : `${consigne} Que fais-tu ?`, patient: id, symptome, espece: esp,
    reponse: bonne, choix: melanger([bonne, ...melanger(faux, aleatoire).slice(0, n - 1)], aleatoire), solution: `La bonne réponse : ${libelle(bonne).toLowerCase()}.`,
    savaisTu: cle === 'faim' ? FICHES[esp].savais : savais };
}

// Les patients : les animaux de l'enfant (avec leur prénom), sinon ceux de la clinique ; « seul » : un seul animal à soigner
export function patients(profil, seul = null) {
  const miens = (profil.objets ?? []).filter((id) => id.startsWith('animal:')).map((id) => [id, profil.noms?.[id] ?? null]);
  if (seul) return miens.filter(([id]) => id === seul).map(([id, nom]) => [id, nom ?? 'ton animal']);
  return miens.length ? miens.map(([id, nom]) => [id, nom ?? 'ton animal']) : PATIENTS_CLINIQUE;
}

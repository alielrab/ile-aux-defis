// L'explorateur de la Suisse (à l'aéroport) : un quiz sur les cantons, les villes, les langues, les lacs et les montagnes.
// 7 ans et moins : les questions faciles et les langues, 3 choix. Dès 8 ans : aussi les chefs-lieux et les questions difficiles, 4 choix.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('suisse', age);

// Les 26 cantons : [nom, « du canton de… », chef-lieu, langue principale]
export const CANTONS = [
  ['Zurich', 'de Zurich', 'Zurich', 'allemand'], ['Berne', 'de Berne', 'Berne', 'allemand'], ['Lucerne', 'de Lucerne', 'Lucerne', 'allemand'], ['Uri', 'd’Uri', 'Altdorf', 'allemand'],
  ['Schwytz', 'de Schwytz', 'Schwytz', 'allemand'], ['Obwald', 'd’Obwald', 'Sarnen', 'allemand'], ['Nidwald', 'de Nidwald', 'Stans', 'allemand'], ['Glaris', 'de Glaris', 'Glaris', 'allemand'],
  ['Zoug', 'de Zoug', 'Zoug', 'allemand'], ['Fribourg', 'de Fribourg', 'Fribourg', 'français'], ['Soleure', 'de Soleure', 'Soleure', 'allemand'], ['Bâle-Ville', 'de Bâle-Ville', 'Bâle', 'allemand'],
  ['Bâle-Campagne', 'de Bâle-Campagne', 'Liestal', 'allemand'], ['Schaffhouse', 'de Schaffhouse', 'Schaffhouse', 'allemand'], ['Appenzell Rhodes-Extérieures', 'd’Appenzell Rhodes-Extérieures', 'Herisau', 'allemand'],
  ['Appenzell Rhodes-Intérieures', 'd’Appenzell Rhodes-Intérieures', 'Appenzell', 'allemand'], ['Saint-Gall', 'de Saint-Gall', 'Saint-Gall', 'allemand'], ['Grisons', 'des Grisons', 'Coire', 'allemand'],
  ['Argovie', 'd’Argovie', 'Aarau', 'allemand'], ['Thurgovie', 'de Thurgovie', 'Frauenfeld', 'allemand'], ['Tessin', 'du Tessin', 'Bellinzone', 'italien'], ['Vaud', 'de Vaud', 'Lausanne', 'français'],
  ['Valais', 'du Valais', 'Sion', 'français'], ['Neuchâtel', 'de Neuchâtel', 'Neuchâtel', 'français'], ['Genève', 'de Genève', 'Genève', 'français'], ['Jura', 'du Jura', 'Delémont', 'français'],
];
const LANGUES = { allemand: 'L’allemand', français: 'Le français', italien: 'L’italien' };
// Pour la question des langues : des cantons où une seule langue domine nettement (pas les cantons bilingues ni les Grisons)
const UNE_LANGUE = ['Zurich', 'Lucerne', 'Saint-Gall', 'Argovie', 'Uri', 'Bâle-Ville', 'Tessin', 'Vaud', 'Neuchâtel', 'Genève', 'Jura'];

// [image, question, bonne réponse, les autres réponses]
export const FACILES = [
  ['🚩', 'Quelles sont les couleurs du drapeau suisse ?', 'Rouge et blanc', ['Bleu et jaune', 'Vert et blanc', 'Noir et rouge']],
  ['🚩', 'Quelle forme a le drapeau suisse ?', 'Un carré', ['Un triangle', 'Un rond', 'Un long rectangle']],
  ['💰', 'Avec quelle monnaie paie-t-on en Suisse ?', 'Le franc suisse', ['L’euro', 'Le dollar', 'La livre']],
  ['🏔️', 'Quelle montagne suisse célèbre a la forme d’une pyramide ?', 'Le Cervin', ['Le Säntis', 'Le Pilate', 'Le Moléson']],
  ['🏛️', 'Dans quelle ville travaille le gouvernement de la Suisse ?', 'Berne', ['Zurich', 'Genève', 'Lausanne']],
  ['🗣️', 'Combien de langues nationales la Suisse a-t-elle ?', 'Quatre', ['Deux', 'Trois', 'Cinq']],
  ['🐾', 'Quel animal des montagnes siffle pour prévenir du danger ?', 'La marmotte', ['Le bouquetin', 'Le chamois', 'La vache']],
  ['🐕', 'Quel chien de montagne célèbre vient du col du Grand-Saint-Bernard ?', 'Le saint-bernard', ['Le caniche', 'Le teckel', 'Le dalmatien']],
  ['🌼', 'Quelle petite fleur blanche pousse très haut dans les Alpes ?', 'L’edelweiss', ['La tulipe', 'Le tournesol', 'Le coquelicot']],
  ['💧', 'Au bord de quel lac se trouve la ville de Genève ?', 'Le lac Léman', ['Le lac de Neuchâtel', 'Le lac de Constance', 'Le lac Majeur']],
  ['⛰️', 'Quelles grandes montagnes couvrent une grande partie de la Suisse ?', 'Les Alpes', ['Les Pyrénées', 'L’Himalaya', 'Les Andes']],
  ['🫕', 'Dans quel plat suisse trempe-t-on du pain dans du fromage fondu ?', 'La fondue', ['La pizza', 'La paella', 'Les sushis']],
  ['🎆', 'Quel jour est la fête nationale suisse ?', 'Le 1er août', ['Le 14 juillet', 'Le 1er janvier', 'Le 25 décembre']],
];
export const DIFFICILES = [
  ['🗺️', 'Combien de cantons la Suisse compte-t-elle ?', '26', ['20', '23', '30']],
  ['🏙️', 'Quelle est la plus grande ville de Suisse ?', 'Zurich', ['Berne', 'Genève', 'Bâle']],
  ['🏔️', 'Quel est le plus haut sommet de Suisse ?', 'La pointe Dufour', ['Le Cervin', 'L’Eiger', 'Le Säntis']],
  ['💧', 'Quel est le plus grand lac entièrement en Suisse ?', 'Le lac de Neuchâtel', ['Le lac Léman', 'Le lac de Constance', 'Le lac des Quatre-Cantons']],
  ['🧊', 'Quel est le plus long glacier des Alpes ?', 'Le glacier d’Aletsch', ['Le glacier du Rhône', 'La mer de Glace', 'Le glacier de Morteratsch']],
  ['🌊', 'Quel grand fleuve naît dans les Alpes suisses et traverse Bâle ?', 'Le Rhin', ['Le Rhône', 'Le Danube', 'La Seine']],
  ['🌊', 'Quel fleuve traverse le lac Léman ?', 'Le Rhône', ['Le Rhin', 'L’Aar', 'Le Tessin']],
  ['🌊', 'Quelle rivière fait une boucle autour de la vieille ville de Berne ?', 'L’Aar', ['La Sarine', 'La Limmat', 'La Reuss']],
  ['⛰️', 'Quelles montagnes se trouvent au nord-ouest de la Suisse, à la frontière avec la France ?', 'Le Jura', ['Les Alpes', 'Les Vosges', 'Les Pyrénées']],
  ['📜', 'Selon la tradition, en quelle année la Suisse est-elle née ?', '1291', ['1515', '1848', '1789']],
  ['🗺️', 'Quel est le plus petit pays voisin de la Suisse ?', 'Le Liechtenstein', ['L’Autriche', 'L’Italie', 'La France']],
  ['🗺️', 'Combien de pays touchent la Suisse ?', 'Cinq', ['Trois', 'Quatre', 'Six']],
  ['🗣️', 'Quelle langue nationale n’est parlée que dans les Grisons ?', 'Le romanche', ['L’italien', 'Le français', 'L’allemand']],
  ['⛲', 'Dans quelle ville un grand jet d’eau jaillit-il du lac ?', 'Genève', ['Lausanne', 'Lucerne', 'Zurich']],
  ['🌉', 'Dans quelle ville se trouve le pont de la Chapelle, un vieux pont en bois ?', 'Lucerne', ['Berne', 'Bâle', 'Fribourg']],
];

// Toutes les questions possibles pour un âge : { cle, image, titre, bonne, autres }
export function banque(age) {
  const fait = ([image, titre, bonne, autres]) => ({ cle: titre, image, titre, bonne, autres });
  const langues = CANTONS.filter((c) => UNE_LANGUE.includes(c[0])).map(([nom, de, , langue]) => ({
    cle: `langue:${nom}`, image: '🗣️', titre: `Quelle langue parle-t-on surtout dans le canton ${de} ?`, bonne: LANGUES[langue], autres: [...Object.values(LANGUES).filter((l) => l !== LANGUES[langue]), 'L’espagnol'] }));
  if (age <= 7) return [...FACILES.map(fait), ...langues];
  // les chefs-lieux : seulement quand la ville ne porte pas le nom du canton (sinon la question donne la réponse)
  const autresVilles = CANTONS.filter(([nom, , ville]) => !nom.startsWith(ville));
  const chefsLieux = autresVilles.flatMap(([nom, de, ville]) => [
    { cle: `chef-lieu:${nom}`, image: '🏛️', titre: `Quel est le chef-lieu du canton ${de} ?`, bonne: ville, autres: autresVilles.map((c) => c[2]).filter((v) => v !== ville) },
    { cle: `canton:${ville}`, image: '🗺️', titre: `De quel canton ${ville} est-elle le chef-lieu ?`, bonne: nom, autres: autresVilles.map((c) => c[0]).filter((n) => n !== nom) },
  ]);
  return [...FACILES.map(fait), ...DIFFICILES.map(fait), ...langues, ...chefsLieux];
}

export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const q = parmiLesNouveaux(banque(age), (x) => x.cle, vus, aleatoire);
  const choix = melanger([q.bonne, ...melanger(q.autres, aleatoire).slice(0, age <= 7 ? 2 : 3)], aleatoire);
  return { mode: 'choix', texte: q.cle, titre: q.titre, consigne: q.titre, image: q.image, reponse: q.bonne, choix, solution: `La bonne réponse : ${q.bonne}.` };
}

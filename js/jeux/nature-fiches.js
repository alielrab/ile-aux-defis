// Les fiches de la cabane nature : des animaux (où ils vivent, ce qu'ils mangent, leur famille) et des plantes
// (comestible ou non, ses bienfaits, comment on la prépare). Le quiz de la cabane pose aussi des questions tirées de ces fiches.
// À faire relire par un parent, surtout les plantes. La règle d'or est rappelée sur chaque fiche de plante.

export const REGLE_D_OR = 'On ne cueille et on ne goûte jamais une plante, une baie ou un champignon sans un adulte qui la connaît bien. Si quelqu’un en a mangé par erreur, on appelle le 145.';

// Les familles d'animaux, avec leur définition
export const FAMILLES = {
  mammifere: ['un mammifère', 'Un mammifère a des poils, et la maman nourrit ses petits avec son lait.'],
  oiseau: ['un oiseau', 'Un oiseau a des plumes, un bec et deux ailes. Il pond des œufs.'],
  reptile: ['un reptile', 'Un reptile a la peau sèche, couverte d’écailles. Il a besoin du soleil pour se réchauffer.'],
  amphibien: ['un amphibien', 'Un amphibien naît dans l’eau, puis vit aussi sur la terre. Sa peau reste humide.'],
  insecte: ['un insecte', 'Un insecte a six pattes, et son corps est en trois parties. Souvent, il a des ailes.'],
  poisson: ['un poisson', 'Un poisson vit dans l’eau. Il respire avec des branchies et nage avec ses nageoires.'],
  mollusque: ['un mollusque', 'Un mollusque a le corps mou. Souvent, une coquille le protège.'],
};
export const MILIEUX = { foret: 'Dans la forêt', jardin: 'Dans les jardins et les haies', montagne: 'Dans la montagne', eau: 'Dans les mares, les lacs et les rivières', champs: 'Dans les prairies et les champs', abri: 'Dans les grottes et les greniers' };
export const REGIMES = { insectes: 'Des insectes et des petites bêtes', plantes: 'Des plantes', viande: 'D’autres animaux', tout: 'Un peu de tout', nectar: 'Le nectar des fleurs' };

// [clé, nom, image, famille, milieu, régime, en détail, « le savais-tu ? »]
export const ANIMAUX = [
  ['renard', 'Le renard', '🦊', 'mammifere', 'foret', 'tout', 'Il mange des souris, des fruits et des insectes.', 'Le renard entend une souris bouger sous la neige !'],
  ['herisson', 'Le hérisson', '🦔', 'mammifere', 'jardin', 'insectes', 'Il mange des insectes, des limaces et des vers.', 'Le hérisson a environ 6000 piquants. Il se met en boule quand il a peur.'],
  ['ecureuil', 'L’écureuil', '🐿️', 'mammifere', 'foret', 'plantes', 'Il mange des noisettes, des glands et des graines.', 'L’écureuil cache des noisettes pour l’hiver, et il en oublie : elles deviennent des arbres !'],
  ['cerf', 'Le cerf', '🦌', 'mammifere', 'foret', 'plantes', 'Il mange de l’herbe, des feuilles et des bourgeons.', 'Les bois du cerf tombent chaque année, puis repoussent.'],
  ['chauve-souris', 'La chauve-souris', '🦇', 'mammifere', 'abri', 'insectes', 'Elle mange des moustiques et des papillons de nuit.', 'C’est le seul mammifère qui vole. Elle dort la tête en bas.'],
  ['lievre', 'Le lièvre', '🐇', 'mammifere', 'champs', 'plantes', 'Il mange de l’herbe, des plantes et de l’écorce.', 'Le lièvre peut courir aussi vite qu’une voiture en ville.'],
  ['loup', 'Le loup', '🐺', 'mammifere', 'montagne', 'viande', 'Il chasse des cerfs et des chevreuils.', 'Les loups vivent en famille : on dit une meute.'],
  ['castor', 'Le castor', '🦫', 'mammifere', 'eau', 'plantes', 'Il mange de l’écorce, des branches et des plantes.', 'Le castor coupe des arbres avec ses dents pour construire des barrages.'],
  ['hibou', 'Le hibou', '🦉', 'oiseau', 'foret', 'viande', 'Il chasse des souris et des petits animaux, la nuit.', 'Le hibou peut tourner la tête presque tout autour de lui.'],
  ['aigle', 'L’aigle royal', '🦅', 'oiseau', 'montagne', 'viande', 'Il chasse des marmottes et des lièvres.', 'L’aigle voit un lièvre à plus d’un kilomètre.'],
  ['canard', 'Le canard', '🦆', 'oiseau', 'eau', 'tout', 'Il mange des plantes d’eau, des graines et des petites bêtes.', 'Les plumes du canard ne se mouillent pas : l’eau glisse dessus.'],
  ['grenouille', 'La grenouille', '🐸', 'amphibien', 'eau', 'insectes', 'Elle attrape des mouches et des insectes avec sa langue.', 'Le bébé de la grenouille s’appelle le têtard : il vit dans l’eau.'],
  ['lezard', 'Le lézard', '🦎', 'reptile', 'jardin', 'insectes', 'Il mange des insectes et des araignées.', 'Si on attrape sa queue, elle se détache, puis elle repousse.'],
  ['couleuvre', 'La couleuvre', '🐍', 'reptile', 'eau', 'viande', 'Elle mange des grenouilles et des petits poissons.', 'La couleuvre n’est pas dangereuse pour nous. On la laisse tranquille.'],
  ['abeille', 'L’abeille', '🐝', 'insecte', 'champs', 'nectar', 'Elle récolte le nectar et le pollen des fleurs.', 'Pour un pot de miel, les abeilles visitent des millions de fleurs.'],
  ['coccinelle', 'La coccinelle', '🐞', 'insecte', 'jardin', 'insectes', 'Elle mange des pucerons.', 'Une coccinelle peut manger plus de cent pucerons par jour.'],
  ['papillon', 'Le papillon', '🦋', 'insecte', 'champs', 'nectar', 'Il boit le nectar des fleurs avec sa trompe.', 'Avant d’être un papillon, il était une chenille.'],
  ['escargot', 'L’escargot', '🐌', 'mollusque', 'jardin', 'plantes', 'Il mange des feuilles et des plantes tendres.', 'L’escargot a des milliers de dents minuscules sur sa langue.'],
  ['truite', 'La truite', '🐟', 'poisson', 'eau', 'insectes', 'Elle mange des insectes et des petites bêtes de la rivière.', 'La truite aime l’eau très fraîche et très propre.'],
];

export const STATUTS = {
  comestible: ['Oui, elle est comestible', '✅'],
  cuite: ['Oui, mais seulement cuite', '🍲'],
  non: ['Non, elle ne se mange pas', '🚫'],
  dangereuse: ['Non, elle est dangereuse', '☠️'],
};
// [clé, nom, image, statut, bienfait ou intérêt, préparation (ou comment en profiter), attention]
// L'image d'une plante dangereuse ne montre jamais un fruit qui donne envie (pas de cerises pour la belladone).
export const PLANTES = [
  ['menthe', 'La menthe', '🌿', 'comestible', 'Elle rafraîchit et aide à bien digérer.', 'En tisane : quelques feuilles dans de l’eau chaude. Ou dans une salade de fruits.', ''],
  ['camomille', 'La camomille', '🌼', 'comestible', 'Elle calme et aide à s’endormir.', 'En tisane : les fleurs séchées dans de l’eau chaude.', ''],
  ['thym', 'Le thym', '🌿', 'comestible', 'Il fait du bien quand on a le rhume ou mal à la gorge.', 'En tisane avec du miel, ou dans les plats.', ''],
  ['pissenlit', 'Le pissenlit', '🌼', 'comestible', 'Il est plein de vitamines.', 'Les jeunes feuilles en salade, bien lavées.', 'On ne le cueille pas au bord des routes.'],
  ['fraise-des-bois', 'La fraise des bois', '🍓', 'comestible', 'Elle est pleine de vitamine C.', 'On la mange crue, bien lavée.', 'On lave toujours les baies cueillies près du sol.'],
  ['myrtille', 'La myrtille', '🫐', 'comestible', 'Elle est pleine de vitamines.', 'Crue, en tarte ou en confiture, bien lavée.', 'D’autres baies foncées sont dangereuses : seul un adulte sait les reconnaître.'],
  ['noisetier', 'Le noisetier', '🌰', 'comestible', 'Les noisettes donnent beaucoup d’énergie.', 'On casse la coquille et on mange la noisette.', ''],
  ['ortie', 'L’ortie', '🌱', 'cuite', 'Elle est très riche en fer et en vitamines.', 'En soupe, toujours cuite. Un adulte la cueille avec des gants.', 'Crue, elle pique très fort !'],
  ['sureau', 'Le sureau noir', '🌿', 'cuite', 'Ses fleurs et ses baies donnent des sirops.', 'Les fleurs en sirop. Les baies seulement cuites, en confiture.', 'Les baies crues donnent mal au ventre.'],
  ['sapin', 'Le sapin', '🌲', 'non', 'Il abrite les oiseaux et sent bon la forêt.', 'On ne le mange pas : on le regarde et on le sent.', ''],
  ['tulipe', 'La tulipe', '🌷', 'non', 'Elle est jolie à regarder au printemps.', 'On ne la mange pas : on l’admire dans le jardin.', 'Son bulbe ressemble à un oignon, mais il rend malade.'],
  ['marronnier', 'Le marronnier', '🌳', 'dangereuse', 'Ses marrons sont beaux pour bricoler.', 'On ne les mange jamais.', 'Le marron du marronnier n’est pas une châtaigne : il rend malade.'],
  ['muguet', 'Le muguet', '🌸', 'dangereuse', 'Il sent très bon au mois de mai.', 'On ne le mange jamais. On se lave les mains après l’avoir touché.', 'Toute la plante est toxique, même l’eau du vase.'],
  ['if', 'L’if', '🌲', 'dangereuse', 'C’est un arbre toujours vert, souvent dans les haies.', 'On ne mange jamais ses petites boules rouges.', 'Ses aiguilles et ses graines sont très toxiques.'],
  ['belladone', 'La belladone', '🌿', 'dangereuse', 'C’est une plante sauvage des bois.', 'On ne la touche pas et on ne la mange jamais.', 'Ses baies noires ressemblent à des cerises, mais elles sont très dangereuses.'],
  ['houx', 'Le houx', '🌿', 'dangereuse', 'Il décore la maison en hiver.', 'On ne mange jamais ses baies rouges.', 'Ses baies rendent malade.'],
  ['amanite', 'L’amanite tue-mouches', '🍄', 'dangereuse', 'C’est un champignon, pas une plante. Il est rouge à points blancs.', 'On ne le touche pas et on ne le mange jamais.', 'Beaucoup de champignons sont dangereux : on n’en cueille jamais sans un adulte qui les connaît.'],
];

export const animal = (cle) => ANIMAUX.find((a) => a[0] === cle);
export const plante = (cle) => PLANTES.find((p) => p[0] === cle);
const le = (nom) => nom.replace(/^La /, 'la ').replace(/^Le /, 'le ').replace(/^L’/, 'l’');

// La fiche, lue à voix haute
export function ficheAnimal([, nom, , famille, milieu, , detail, savais]) {
  return `${nom} est ${FAMILLES[famille][0]}. ${FAMILLES[famille][1]} Où vit cet animal ? ${MILIEUX[milieu]}. Que mange cet animal ? ${detail} Le savais-tu ? ${savais}`;
}
export function fichePlante([, nom, , statut, bienfait, preparation, attention]) {
  return `${nom}. Peut-on la manger ? ${STATUTS[statut][0]}. ${bienfait} ${preparation} ${attention ? `Attention : ${attention} ` : ''}${REGLE_D_OR}`;
}

// Les questions tirées des fiches, au format des quiz : [image, question, bonne réponse, les autres réponses]
const autres = (table, bonne, lire = (v) => v) => Object.entries(table).filter(([k]) => k !== bonne).map(([, v]) => lire(v));
export function questionsDesFiches(difficiles) {
  if (!difficiles) return [
    ...ANIMAUX.map(([, nom, image, , milieu]) => [image, `Où vit surtout ${le(nom)} ?`, MILIEUX[milieu], autres(MILIEUX, milieu).slice(0, 3)]),
    ...PLANTES.filter((p) => ['comestible', 'dangereuse'].includes(p[3])).map(([, nom, image, statut]) => [image, `Peut-on manger ${le(nom)} ?`, STATUTS[statut][0], autres(STATUTS, statut, (v) => v[0])]),
  ];
  return [
    ...ANIMAUX.map(([, nom, image, famille]) => [image, `À quelle famille appartient ${le(nom)} ?`, `C’est ${FAMILLES[famille][0]}`, autres(FAMILLES, famille, (v) => `C’est ${v[0]}`).slice(0, 3)]),
    ...ANIMAUX.map(([, nom, image, , , regime]) => [image, `Que mange surtout ${le(nom)} ?`, REGIMES[regime], autres(REGIMES, regime).slice(0, 3)]),
    ...PLANTES.filter((p) => ['cuite', 'non'].includes(p[3])).map(([, nom, image, statut]) => [image, `Peut-on manger ${le(nom)} ?`, STATUTS[statut][0], autres(STATUTS, statut, (v) => v[0])]),
  ];
}

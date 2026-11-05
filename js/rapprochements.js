// « Ce qui nous rapproche, ce qui nous différencie » : des cartes qui comparent les croyances choisies par les parents.
// Chaque croyance est décrite du point de vue de ceux qui y croient (« Pour les chrétiens… »), sans dire qui a raison.
// À FAIRE RELIRE PAR UN PARENT. grand : seulement pour les 8 ans et plus (les différences demandent plus de recul).

// Les groupes comparés : les trois branches chrétiennes n'en font qu'un ; « sagesse » = familles non croyantes.
const GROUPE = { catholique: 'chretien', protestant: 'chretien', orthodoxe: 'chretien', islam: 'islam', judaisme: 'judaisme', hindouisme: 'hindouisme', bouddhisme: 'bouddhisme', athee: 'sagesse' }; // « autre croyance » : pas de ligne à son nom
const ORDRE = ['judaisme', 'chretien', 'islam', 'hindouisme', 'bouddhisme', 'sagesse'];
export const POUR = { chretien: 'Pour les chrétiens', judaisme: 'Pour les juifs', islam: 'Pour les musulmans', hindouisme: 'Pour les hindous', bouddhisme: 'Pour les bouddhistes', sagesse: 'Pour beaucoup de personnes non croyantes' };

export const POINTS = [
  { image: '⛺', titre: 'Abraham, un ancêtre commun', type: 'commun',
    intro: "Les juifs, les chrétiens et les musulmans voient tous Abraham comme un ancêtre dans la foi. C'est pour cela qu'on les appelle les « religions abrahamiques ».",
    pour: {
      judaisme: 'Abraham est le premier ancêtre du peuple juif, celui qui a fait alliance avec Dieu.',
      chretien: "Abraham est le modèle de celui qui fait confiance à Dieu, même sans tout comprendre.",
      islam: 'Ibrahim est un très grand prophète. Avec son fils Ismaïl, il a construit la Kaaba, à La Mecque.' } },
  { image: '🌈', titre: 'Des personnages en commun', type: 'commun',
    intro: 'Certaines histoires sont racontées dans plusieurs religions, parfois avec des noms un peu différents.',
    pour: {
      judaisme: 'Noé, Moïse et Jonas sont dans la Bible hébraïque. Moïse est le plus grand des prophètes.',
      chretien: 'Noé, Moïse et Jonas sont dans la Bible. Marie est la mère de Jésus.',
      islam: 'Nouh (Noé), Moussa (Moïse) et Younous (Jonas) sont des prophètes. Maryam (Marie) est très respectée : un chapitre du Coran porte son nom.' } },
  { image: '🙏', titre: 'La prière et la méditation', type: 'commun',
    pour: {
      judaisme: 'On prie trois fois par jour. Le « Chema Israël » est une prière très importante.',
      chretien: 'On prie seul ou ensemble, par exemple avec le « Notre Père », la prière que Jésus a apprise à ses amis.',
      islam: 'On prie cinq fois par jour, tourné vers La Mecque.',
      hindouisme: "On prie au temple ou devant un petit autel à la maison, avec des fleurs, de l'encens et une lampe : c'est la puja.",
      bouddhisme: "On médite pour calmer son esprit. Beaucoup récitent aussi des textes ou des chants.",
      sagesse: 'On peut aussi prendre un moment de calme, pour réfléchir ou dire merci.' } },
  { image: '🌙', titre: 'Le jeûne', type: 'commun',
    intro: 'Jeûner, c’est se priver de manger pendant un temps, pour penser à l’essentiel. Les enfants et les personnes malades ne jeûnent pas.',
    pour: {
      judaisme: 'À Yom Kippour, le jour du Grand Pardon, les adultes ne mangent pas et ne boivent pas pendant environ 25 heures.',
      chretien: 'Pendant le Carême, les quarante jours avant Pâques, beaucoup mangent moins ou se privent de quelque chose.',
      islam: 'Pendant le mois de ramadan, les adultes ne mangent pas et ne boivent pas du lever au coucher du soleil.',
      hindouisme: 'Beaucoup jeûnent certains jours de fête, ou ne mangent pas de viande.',
      bouddhisme: 'Beaucoup de moines ne mangent rien après midi.' } },
  { image: '🤲', titre: 'Le partage', type: 'commun',
    pour: {
      judaisme: 'La tsedaka : donner aux pauvres est une question de justice.',
      chretien: 'Jésus a dit que ce qu’on fait pour le plus petit, c’est pour lui qu’on le fait.',
      islam: "La zakat : donner chaque année une part de ce qu'on a aux pauvres est un des cinq piliers de l'islam.",
      hindouisme: 'Le don, appelé dana, est un devoir : offrir à manger à celui qui a faim.',
      bouddhisme: 'La générosité est la première des qualités à cultiver.',
      sagesse: 'La solidarité : s’entraider pour que personne ne reste seul.' } },
  { image: '✨', titre: "La règle d'or", type: 'commun',
    intro: 'Presque toutes les religions et les sagesses disent la même chose, avec leurs propres mots :',
    pour: {
      judaisme: 'Le sage Hillel a dit : « Ce que tu n’aimes pas qu’on te fasse, ne le fais pas aux autres. »',
      chretien: 'Jésus a dit : « Tout ce que vous voudriez que les autres fassent pour vous, faites-le pour eux. »',
      islam: "Le prophète Mohammed a dit : « Aucun de vous n'est vraiment croyant tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même. »",
      hindouisme: 'Le Mahabharata dit : « Ne fais pas aux autres ce qui te ferait du mal à toi. »',
      bouddhisme: 'Un texte bouddhiste dit : « Ne blesse pas les autres avec ce qui te blesse toi-même. »',
      sagesse: "C'est aussi la base pour bien vivre ensemble, qu'on croie en Dieu ou non." } },

  { image: '✝️', titre: 'Qui est Jésus ?', type: 'difference', grand: true,
    pour: {
      chretien: "Jésus est le Fils de Dieu. Il est mort et revenu à la vie : c'est le cœur de leur foi.",
      islam: "Issa (Jésus) est un très grand prophète, né de Maryam. Mais il n'est pas le fils de Dieu.",
      judaisme: "Jésus était un homme juif qui a vécu il y a environ 2 000 ans. Ils ne le considèrent pas comme le Messie qu'ils attendent." } },
  { image: '☀️', titre: 'Un seul Dieu, ou le divin sous plusieurs formes ?', type: 'difference', grand: true,
    pour: {
      judaisme: 'Il y a un seul Dieu : « Écoute, Israël, l’Éternel est un. »',
      chretien: 'Il y a un seul Dieu, qui est à la fois Père, Fils et Saint-Esprit.',
      islam: "Il y a un seul Dieu, Allah, et rien ne lui ressemble.",
      hindouisme: 'Le divin se montre sous beaucoup de formes, comme Ganesh, Shiva, Vishnou ou Lakshmi.',
      bouddhisme: "Bouddha n'est pas un dieu : c'est un sage qui montre un chemin vers l'éveil et la paix.",
      sagesse: "Dieu n'existe pas, ou on ne peut pas le savoir. On cherche des réponses dans la réflexion et la science." } },
  { image: '📅', titre: 'Le jour de la prière', type: 'difference', grand: true,
    pour: {
      judaisme: 'Le shabbat, du vendredi soir au samedi soir.',
      chretien: 'Le dimanche, jour où Jésus est revenu à la vie.',
      islam: 'Le vendredi, avec la grande prière de midi à la mosquée.',
      hindouisme: 'Pas de jour fixe : on prie chaque jour, et certains jours sont consacrés à une divinité.',
      bouddhisme: 'Pas de jour fixe. Dans certains pays, on va au temple les jours de pleine lune et de nouvelle lune.' } },
  { image: '📚', titre: 'Les livres saints', type: 'difference', grand: true,
    pour: {
      judaisme: 'La Torah et toute la Bible hébraïque, puis le Talmud, qui les explique.',
      chretien: "La Bible : l'Ancien Testament, et le Nouveau Testament qui raconte la vie de Jésus.",
      islam: 'Le Coran, en arabe, révélé au prophète Mohammed.',
      hindouisme: 'Des textes très anciens : les Védas, la Bhagavad-Gita, et de grands récits comme le Ramayana.',
      bouddhisme: "Beaucoup de textes qui rassemblent l'enseignement de Bouddha, comme le Dhammapada." } },
];

export const CONCLUSION = "Chacun peut croire différemment, ou ne pas croire, et tout le monde peut se respecter. Personne ici ne dit qui a raison : c'est à chaque famille d'en parler. Tu as des questions ? Parles-en avec tes parents, ils seront contents d'en discuter avec toi.";

// Les groupes à comparer : la croyance de la famille et les religions à découvrir choisies par les parents.
export function groupes({ famille, decouvrir }) {
  const presents = new Set([famille, ...decouvrir].map((k) => GROUPE[k]).filter(Boolean));
  return ORDRE.filter((g) => presents.has(g));
}

// Les cartes à montrer : seulement les lignes des groupes choisis, et une carte n'apparaît que si au moins deux groupes en parlent.
export function cartes(croyance, age) {
  const g = groupes(croyance);
  return POINTS.filter((p) => !p.grand || age >= 8)
    .map((p) => ({ ...p, lignes: g.filter((k) => p.pour[k]).map((k) => [POUR[k], p.pour[k]]) }))
    .filter((p) => p.lignes.length >= 2);
}

export const disponible = (croyance) => groupes(croyance).length >= 2;

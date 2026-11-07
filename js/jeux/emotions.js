// La météo des émotions (île du cœur) : reconnaître les émotions sur un visage et dans des situations de la vie,
// avec un conseil doux après chaque réponse ; et « Ma météo du jour » (rien n'est enregistré : c'est une donnée sensible).
// À FAIRE RELIRE PAR UN PARENT.
import { melanger, etoilesDuJeu, parmiLesNouveaux } from '../partie.js';
import { PEAUX } from '../avatar.js';

export const etoilesParBonneReponse = (age) => etoilesDuJeu('emotions', age);

// grand : seulement pour les 8 ans et plus
export const EMOTIONS = {
  joie: { nom: 'La joie' }, tristesse: { nom: 'La tristesse' }, colere: { nom: 'La colère' }, peur: { nom: 'La peur' },
  surprise: { nom: 'La surprise' }, degout: { nom: 'Le dégoût' },
  fierte: { nom: 'La fierté', grand: true }, jalousie: { nom: 'La jalousie', grand: true }, ennui: { nom: "L'ennui", grand: true },
  timidite: { nom: 'La timidité', grand: true }, inquietude: { nom: "L'inquiétude", grand: true }, deception: { nom: 'La déception', grand: true },
};
// Des émotions trop proches pour être proposées ensemble (il y aurait deux bonnes réponses)
const PROCHES = [['joie', 'fierte'], ['joie', 'surprise'], ['tristesse', 'deception'], ['peur', 'inquietude'], ['peur', 'timidite'], ['peur', 'surprise'],
  ['jalousie', 'colere'], ['jalousie', 'tristesse'], ['ennui', 'tristesse'], ['deception', 'colere'], ['inquietude', 'timidite'], ['timidite', 'fierte'], ['timidite', 'joie']];
export const proches = (a, b) => PROCHES.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

// Ce qui aide, pour chaque émotion (dit après la réponse)
export const CONSEILS = {
  joie: 'La joie, ça donne envie de sourire, de rire et de la partager avec les autres !',
  tristesse: "Quand on est triste, ça fait du bien de pleurer, de faire un câlin, ou d'en parler à quelqu'un.",
  colere: 'La colère, c’est normal. On peut dire « Je suis {fâché|fâchée} », respirer lentement, sans taper ni casser.',
  peur: 'Quand on a peur, on peut appeler un adulte, allumer la lumière ou serrer son doudou.',
  surprise: 'La surprise arrive d’un coup, et elle passe très vite !',
  degout: 'Le dégoût nous protège : il nous dit de ne pas toucher ou manger ce qui pourrait nous rendre malades.',
  fierte: "Être fier de soi, c'est reconnaître ses efforts. Tu as le droit d'être {fier|fière} de toi !",
  jalousie: 'La jalousie arrive à tout le monde. Ça aide d’en parler, au lieu de la garder pour soi.',
  ennui: "L'ennui aide parfois à inventer de nouveaux jeux : laisse venir les idées !",
  timidite: 'Être timide, ce n’est pas grave. On peut commencer par un sourire, ou dire bonjour tout doucement.',
  inquietude: "Quand on s'inquiète, on peut en parler à un adulte : à deux, on trouve souvent une solution.",
  deception: 'La déception passe. On peut dire ce qu’on ressent, puis penser à autre chose de joyeux.',
};

// [situation, émotion]
export const SITUATIONS = [
  ['Nora souffle les bougies de son gâteau d’anniversaire, entourée de ses amis.', 'joie'],
  ['Tom a perdu son doudou et ne le retrouve nulle part.', 'tristesse'],
  ['Malik a construit une grande tour, et quelqu’un la fait tomber exprès.', 'colere'],
  ['Emma entend un gros bruit bizarre dans le noir.', 'peur'],
  ['Yanis ouvre la porte, et toute sa famille crie : « Surprise ! »', 'surprise'],
  ['Chloé goûte une soupe froide qui sent très mauvais.', 'degout'],
  ['Luca joue au parc avec son meilleur ami, sous le soleil.', 'joie'],
  ['Aya voit sa meilleure amie partir habiter dans une autre ville.', 'tristesse'],
  ['Hugo attend son tour depuis longtemps, et quelqu’un passe devant lui.', 'colere'],
  ['Lou voit un gros chien qui aboie très fort vers elle.', 'peur'],
  ['Samuel trouve un cadeau caché sous son oreiller, sans savoir qui l’a mis là.', 'surprise'],
  ['Jade marche pieds nus dans une flaque de boue gluante.', 'degout'],
  ['Tom reçoit un petit chaton à câliner.', 'joie'],
  ['Nora casse son jouet préféré par accident.', 'tristesse'],
  ['Malik se fait gronder pour une bêtise qu’il n’a pas faite.', 'colere'],
  ['Emma fait un cauchemar pendant la nuit.', 'peur'],
  ['Chloé trouve un ver tout mou dans sa pomme.', 'degout'],
  ['Yanis voit un magicien faire sortir un lapin de son chapeau.', 'surprise'],
  ['Hugo regarde l’oiseau qu’il soignait s’envoler, guéri, et il ne le reverra plus.', 'tristesse'],
  ['Lou danse avec toute sa famille à une grande fête.', 'joie'],
  ['Hugo a réussi tout seul son puzzle de 500 pièces.', 'fierte', true],
  ['Lou voit sa sœur recevoir un cadeau, et elle n’en a pas.', 'jalousie', true],
  ['Samuel attend dans la voiture depuis une heure, sans rien à faire.', 'ennui', true],
  ['Jade doit chanter seule devant toute la classe, et elle devient toute rouge.', 'timidite', true],
  ['Tom a une évaluation demain et pense qu’il ne connaît pas sa leçon.', 'inquietude', true],
  ['Nora attendait la sortie au zoo, mais elle est annulée à cause de la pluie.', 'deception', true],
  ['Malik a enfin appris à faire du vélo sans les petites roues.', 'fierte', true],
  ['Emma voit son meilleur ami jouer avec un autre enfant pendant toute la récré.', 'jalousie', true],
  ['Yanis arrive dans une nouvelle école où il ne connaît personne, et il n’ose pas parler.', 'timidite', true],
  ['Le chat de Chloé n’est pas rentré à la maison depuis ce matin.', 'inquietude', true],
  ['Luca a reçu le jeu qu’il voulait tant, mais il ne marche pas.', 'deception', true],
  ['Aya regarde la pluie tomber un dimanche, sans aucune idée de jeu.', 'ennui', true],
];

// Les émotions qu'on sait dessiner sur un visage
export const VISAGES = ['joie', 'tristesse', 'colere', 'peur', 'surprise', 'degout', 'ennui', 'timidite', 'fierte', 'inquietude'];

// « Ma météo du jour » : [clé, image, temps, réponse]
export const METEO = [
  ['joie', '☀️', 'Le soleil : la joie', "Super ! Garde ce soleil avec toi, et partage-le : un sourire, ça se donne !"],
  ['calme', '⛅', 'Quelques nuages : le calme', 'Un jour calme, c’est bien aussi. Tu peux te reposer, lire ou dessiner tranquillement.'],
  ['tristesse', '🌧️', 'La pluie : la tristesse', "C'est normal d'être triste parfois. Un câlin, un dessin ou en parler à un adulte de confiance peut aider. Après la pluie, le soleil revient."],
  ['colere', '⛈️', "L'orage : la colère", 'La colère, c’est comme un orage : ça passe. Viens respirer avec moi pour la calmer doucement.'],
  ['peur', '🌫️', 'Le brouillard : la peur ou l’inquiétude', 'Quand tout est flou et qu’on a peur, on peut en parler à un adulte de confiance. Tu n’es pas {seul|seule}.'],
];

const nomsSet = (age) => Object.keys(EMOTIONS).filter((e) => age > 7 || !EMOTIONS[e].grand);

// Une question : un visage (« Quelle émotion montre ce visage ? ») ou une situation (« Comment se sent Tom ? »)
export function question({ age }, aleatoire = Math.random, numero = 0, vus = new Set()) {
  const possibles = nomsSet(age), n = age <= 7 ? 3 : 4;
  const situations = SITUATIONS.filter((s) => age > 7 || !s[2]);
  const visages = VISAGES.filter((e) => possibles.includes(e)).map((e, i) => [`visage:${e}:${i}`, e]);
  const avecVisage = aleatoire() < 0.35;
  const [texte, reponse] = avecVisage ? parmiLesNouveaux(visages, (v) => v[0], vus, aleatoire) : parmiLesNouveaux(situations, (s) => s[0], vus, aleatoire);
  const pieges = melanger(possibles.filter((e) => e !== reponse && !proches(e, reponse)), aleatoire).slice(0, n - 1);
  const choix = melanger([reponse, ...pieges], aleatoire);
  const prenom = texte.match(/^(?:Le chat de )?([A-ZÉ][a-zé]+)/)?.[1];
  const consigne = avecVisage ? 'Quelle émotion montre ce visage ?' : `${texte} Que ressent ${prenom} ?`;
  return { mode: avecVisage ? 'visage' : 'situation', texte, titre: avecVisage ? 'Quelle émotion montre ce visage ?' : texte, consigne, reponse, choix,
    peau: Object.values(PEAUX)[Math.floor(aleatoire() * Object.keys(PEAUX).length)],
    solution: `C'est ${EMOTIONS[reponse].nom.toLowerCase()}.`, savaisTu: CONSEILS[reponse] };
}

export const nom = (e) => EMOTIONS[e].nom;

// ---------- Visages ----------
const N = '#2b2b3a';
const yeuxPoints = '<circle cx="72" cy="92" r="6"/><circle cx="128" cy="92" r="6"/>';
const grandsYeux = (r = 13, pupille = 5) => `<circle cx="72" cy="92" r="${r}" fill="#fff" stroke="${N}" stroke-width="3"/><circle cx="128" cy="92" r="${r}" fill="#fff" stroke="${N}" stroke-width="3"/><circle cx="72" cy="94" r="${pupille}"/><circle cx="128" cy="94" r="${pupille}"/>`;
const sourcils = (g, d) => `<path d="${g}" stroke="${N}" stroke-width="6" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${N}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
const joues = (c = '#f4a0a0', o = 0.6) => `<circle cx="56" cy="122" r="12" fill="${c}" opacity="${o}"/><circle cx="144" cy="122" r="12" fill="${c}" opacity="${o}"/>`;
const TRAITS = {
  joie: `${joues()}<path d="M60 94 Q72 80 84 94 M116 94 Q128 80 140 94" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M62 124 Q100 170 138 124Z" fill="${N}"/><path d="M78 146 Q100 160 122 146 Q100 136 78 146Z" fill="#e86f6f"/>`,
  tristesse: `${sourcils('M56 76 L84 68', 'M144 76 L116 68')}${yeuxPoints}<path d="M74 150 Q100 128 126 150" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M70 104 q-6 12 0 18 q6 -6 0 -18Z" fill="#5ab8e0"/>`,
  colere: `${joues('#e05252', 0.5)}${sourcils('M54 68 L86 82', 'M146 68 L114 82')}${yeuxPoints}<path d="M74 146 Q100 130 126 146" stroke="${N}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  peur: `${sourcils('M54 72 L86 62', 'M146 72 L114 62')}${grandsYeux(14, 4)}<rect x="72" y="128" width="56" height="28" rx="12" fill="${N}"/><path d="M76 142 H124" stroke="#fff" stroke-width="4"/><path d="M160 60 q-8 14 0 20 q8 -6 0 -20Z" fill="#7ad0f0"/>`,
  surprise: `${sourcils('M56 66 Q72 54 88 66', 'M112 66 Q128 54 144 66')}${grandsYeux(12, 5)}<ellipse cx="100" cy="142" rx="14" ry="18" fill="${N}"/>`,
  degout: `${sourcils('M54 76 L86 84', 'M114 72 Q128 64 146 72')}<path d="M62 94 H82 M118 92 H138" stroke="${N}" stroke-width="5" stroke-linecap="round"/><path d="M90 112 l6 -4 M110 112 l-6 -4" stroke="${N}" stroke-width="3"/><path d="M68 140 q8 -10 16 0 t16 0 t16 0 t16 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96 142 q6 18 14 0Z" fill="#e86f6f"/>`,
  ennui: `<path d="M60 90 H84 M116 90 H140" stroke="${N}" stroke-width="5" stroke-linecap="round"/><path d="M62 90 Q72 100 82 90 M118 90 Q128 100 138 90" fill="${N}"/><path d="M80 142 H120" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
  timidite: `${joues('#f08080', 0.9)}<path d="M60 92 Q72 98 84 92 M116 92 Q128 98 140 92" stroke="${N}" stroke-width="4" fill="none"/><circle cx="68" cy="102" r="5"/><circle cx="124" cy="102" r="5"/><path d="M86 138 Q100 146 114 138" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  fierte: `${joues()}<path d="M60 92 Q72 82 84 92 M116 92 Q128 82 140 92" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M70 128 Q100 152 130 128" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M168 40 l4 10 10 2 -8 6 2 10 -8 -6 -8 6 2 -10 -8 -6 10 -2Z" fill="#ffd84a"/>`,
  inquietude: `${sourcils('M56 74 L84 66', 'M144 74 L116 66')}${yeuxPoints}<path d="M74 142 q6 -8 13 0 t13 0 t13 0 t13 0" stroke="${N}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};

export function visage(emotion, peau = '#f2c9a0') {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="visage" role="img" aria-label="Un visage">
    <circle cx="100" cy="104" r="80" fill="${peau}" stroke="${N}" stroke-width="3"/>
    <path d="M28 88 Q30 24 100 22 Q170 24 172 88 Q150 50 100 48 Q50 50 28 88Z" fill="#5a3a20"/>
    <g fill="${N}">${TRAITS[emotion]}</g></svg>`;
}

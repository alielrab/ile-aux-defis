// Le calendrier de l'Avent : en décembre, une case par jour (1 à 24) avec un « Le savais-tu ? » sur l'hiver
// ou un petit défi à faire en vrai. Neutre (pas de religion), comme le reste de l'app.
// On ouvre les cases des jours déjà passés (on peut rattraper un oubli) ; les étoiles, une seule fois par case.

export const ETOILES_CASE = 2, ETOILES_DERNIERE = 5;

// [emoji, titre, texte] : le titre dit si c'est un défi ou un « le savais-tu ».
export const JOURS = [
  ['❄️', 'Le savais-tu ?', 'Chaque flocon de neige a six branches, et il n’y en a jamais deux pareils.'],
  ['💌', 'Petit défi', 'Fais un dessin pour quelqu’un que tu aimes, et offre-le-lui.'],
  ['🦔', 'Le savais-tu ?', 'Le hérisson dort tout l’hiver : il hiberne jusqu’au printemps.'],
  ['🥾', 'Petit défi', 'Aide à ranger les chaussures et les bottes de l’entrée.'],
  ['🍪', 'Petit défi', 'Prépare des biscuits avec un adulte, ou fais-en en pâte à modeler.'],
  ['🐦', 'Petit défi', 'Avec un adulte, donne à manger aux oiseaux : quand il fait froid, ils ont faim.'],
  ['⛷️', 'Le savais-tu ?', 'En Suisse, beaucoup d’enfants apprennent à skier dès 3 ou 4 ans.'],
  ['🤗', 'Petit défi', 'Dis « merci » à trois personnes aujourd’hui.'],
  ['🐻‍❄️', 'Le savais-tu ?', 'Sous ses poils blancs, l’ours polaire a la peau noire : elle garde mieux la chaleur du soleil.'],
  ['🧸', 'Petit défi', 'Range tes jouets sans qu’on te le demande.'],
  ['🌲', 'Le savais-tu ?', 'Le sapin garde ses aiguilles vertes même en plein hiver.'],
  ['🎶', 'Petit défi', 'Chante une chanson à ta famille.'],
  ['⛄', 'Petit défi', 'Construis un bonhomme de neige… ou dessine-le, si la neige n’est pas là.'],
  ['🌙', 'Le savais-tu ?', 'Le 21 décembre est le jour le plus court de l’année : c’est la nuit la plus longue.'],
  ['📚', 'Petit défi', 'Demande à un adulte de te lire une histoire, ou lis-en une à ton tour.'],
  ['🦌', 'Le savais-tu ?', 'Les rennes ont des poils jusque sous les sabots, pour ne pas glisser sur la neige.'],
  ['🧩', 'Petit défi', 'Fais un puzzle ou un jeu de société en famille.'],
  ['🍊', 'Le savais-tu ?', 'Les mandarines de l’hiver sont pleines de vitamine C, qui aide le corps à rester en forme.'],
  ['💡', 'Petit défi', 'Éteins la lumière des pièces vides : on économise l’énergie.'],
  ['🐿️', 'Le savais-tu ?', 'L’écureuil cache des noisettes pour l’hiver. Il en oublie, et elles deviennent des arbres !'],
  ['✨', 'Petit défi', 'Ce soir, regarde les étoiles avec un adulte : c’est la nuit la plus longue de l’année.'],
  ['🎨', 'Petit défi', 'Décore ta fenêtre avec des flocons en papier découpé.'],
  ['💝', 'Petit défi', 'Fais un câlin à chaque personne de ta famille.'],
  ['🎁', 'Bravo !', 'Tu as ouvert tout le calendrier. Joyeuses fêtes et belles vacances d’hiver !'],
];

// Le calendrier se montre en décembre seulement
export const enSaison = (date) => date.getMonth() === 11;
// Le nombre de cases qu'on peut ouvrir à cette date (0 hors de décembre)
export const ouvrables = (date) => (enSaison(date) ? Math.min(date.getDate(), JOURS.length) : 0);

// Ouvre la case `jour` pour cet enfant. Les étoiles la première fois seulement. Renvoie le gain, ou null si la case est encore fermée.
export function ouvrir(profil, jour, date) {
  if (!Number.isInteger(jour) || jour < 1 || jour > ouvrables(date)) return null;
  profil.avent ??= [];
  if (profil.avent.includes(jour)) return 0;
  profil.avent.push(jour);
  const gain = jour === JOURS.length ? ETOILES_DERNIERE : ETOILES_CASE;
  profil.etoiles += gain;
  return gain;
}

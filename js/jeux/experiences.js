// Le labo des expériences (île des créateurs) : de petites expériences à faire pour de vrai, à la maison, avec un adulte.
// Pour chacune : le matériel, les étapes, une question « devine d'abord ! », puis l'explication.
// Choisies sans feu, sans produit dangereux et sans eau bouillante. Sources (reformulées) : Alloprof, « 10 activités scientifiques à faire à la maison »,
// et Les Savants Fous, « 15 expériences scientifiques faciles à faire à la maison ». À faire relire par un parent.
export const ETOILES_EXPERIENCE = 2; // la première fois qu'on devine puis qu'on lit l'explication
export const REGLE = 'Fais toujours tes expériences avec un adulte. On ne goûte rien, et on range tout à la fin.';

// devine : [la question, la bonne réponse, deux autres réponses]. adulte : ce que l'adulte fait lui-même.
export const EXPERIENCES = [
  { cle: 'poivre', nom: 'Le poivre qui s’enfuit', image: '🌶️', duree: '5 minutes',
    materiel: ['Une assiette creuse', 'De l’eau', 'Du poivre moulu', 'Du liquide vaisselle'],
    etapes: ['Verse de l’eau dans l’assiette.', 'Saupoudre du poivre partout sur l’eau.', 'Trempe le bout de ton doigt dans le liquide vaisselle.', 'Touche l’eau au milieu de l’assiette, et regarde !'],
    devine: ['Que va faire le poivre quand ton doigt touche l’eau ?', 'Il file vers les bords', 'Il coule au fond', 'Il ne bouge pas'],
    explication: 'L’eau a une sorte de peau invisible qui tient le poivre. Le savon casse cette peau au milieu : elle se retire vers les bords et emporte le poivre. Les scientifiques appellent ça la tension de surface.' },
  { cle: 'lait', nom: 'Le lait magique', image: '🥛', duree: '10 minutes',
    materiel: ['Une assiette creuse', 'Du lait entier', 'Des colorants alimentaires', 'Du liquide vaisselle', 'Un coton-tige'],
    etapes: ['Verse du lait dans l’assiette.', 'Dépose quelques gouttes de colorants, de plusieurs couleurs.', 'Trempe le coton-tige dans le liquide vaisselle.', 'Touche le lait avec le coton-tige, et regarde !'],
    devine: ['Que vont faire les couleurs ?', 'Elles se mettent à danser', 'Elles disparaissent', 'Elles restent immobiles'],
    explication: 'Le savon court après le gras du lait. En bougeant, il pousse les colorants dans tous les sens : c’est pour ça qu’ils dansent.' },
  { cle: 'oeuf', nom: 'L’œuf qui flotte', image: '🥚', duree: '10 minutes',
    materiel: ['Deux grands verres d’eau', 'Du sel', 'Une cuillère', 'Deux œufs crus'],
    etapes: ['Pose doucement un œuf dans le premier verre d’eau. Regarde ce qu’il fait.', 'Dans le deuxième verre, mets 5 cuillères de sel.', 'Mélange bien jusqu’à ce que le sel disparaisse.', 'Pose doucement le deuxième œuf dans l’eau salée, et regarde !'],
    devine: ['Que fait l’œuf dans l’eau très salée ?', 'Il flotte', 'Il coule', 'Il se casse'],
    explication: 'L’eau salée est plus lourde que l’eau douce : elle porte mieux l’œuf. C’est pour ça qu’on flotte si bien dans la mer !' },
  { cle: 'eau-voyage', nom: 'L’eau qui voyage', image: '💧', duree: '10 minutes, puis une heure d’attente',
    materiel: ['Deux verres', 'De l’eau', 'Du colorant alimentaire', 'Une feuille d’essuie-tout', 'Un gros livre'],
    etapes: ['Remplis un verre d’eau et ajoute du colorant.', 'Pose ce verre sur le gros livre, et le verre vide à côté, plus bas.', 'Plie l’essuie-tout en longue bande.', 'Mets un bout dans le verre plein, et l’autre bout dans le verre vide.', 'Attends une heure, et regarde !'],
    devine: ['Que va faire l’eau colorée ?', 'Elle passe dans l’autre verre', 'Elle reste dans son verre', 'Elle devient blanche'],
    explication: 'L’eau grimpe dans les petits trous du papier, comme elle monte dans une éponge. Puis elle redescend de l’autre côté. Ça s’appelle la capillarité.' },
  { cle: 'volcan', nom: 'Le volcan', image: '🌋', duree: '15 minutes',
    materiel: ['Une petite bouteille', 'Un plateau', '3 cuillères de bicarbonate de soude', 'Du vinaigre blanc', 'Du liquide vaisselle', 'Du colorant rouge'],
    etapes: ['Pose la bouteille sur le plateau.', 'Mets le bicarbonate dans la bouteille.', 'Ajoute un peu de liquide vaisselle et du colorant.', 'Verse le vinaigre d’un coup, recule d’un pas, et regarde !'],
    devine: ['Que va-t-il se passer ?', 'Une mousse monte et déborde', 'La bouteille se vide', 'Rien du tout'],
    explication: 'Le vinaigre et le bicarbonate fabriquent ensemble un gaz, le gaz carbonique. Le savon l’emprisonne dans des milliers de bulles : la mousse déborde comme la lave d’un volcan.' },
  { cle: 'ballon-gonfle', nom: 'Le ballon qui se gonfle tout seul', image: '🎈', duree: '10 minutes',
    materiel: ['Une petite bouteille', 'Un ballon de baudruche', 'Du vinaigre blanc', '2 cuillères de bicarbonate de soude', 'Un entonnoir'],
    etapes: ['Verse du vinaigre dans la bouteille, jusqu’au tiers.', 'Avec l’entonnoir, mets le bicarbonate dans le ballon.', 'Enfile le ballon sur le goulot, sans faire tomber la poudre.', 'Redresse le ballon pour que la poudre tombe dans la bouteille, et regarde !'],
    devine: ['Que va faire le ballon ?', 'Il se gonfle', 'Il s’envole', 'Il change de couleur'],
    explication: 'Le vinaigre et le bicarbonate fabriquent du gaz carbonique. Le gaz ne peut pas sortir : il prend de la place et gonfle le ballon.' },
  { cle: 'ballon-magique', nom: 'Le ballon aimant', image: '⚡', duree: '5 minutes',
    materiel: ['Un ballon de baudruche gonflé', 'Un pull en laine, ou tes cheveux bien secs', 'Des petits bouts de papier'],
    etapes: ['Frotte fort le ballon sur le pull ou sur tes cheveux.', 'Approche le ballon des petits bouts de papier.', 'Essaie aussi près d’un tout petit filet d’eau du robinet, et regarde !'],
    devine: ['Que font les petits papiers ?', 'Ils sautent sur le ballon', 'Ils s’envolent loin du ballon', 'Ils ne bougent pas'],
    explication: 'En frottant, le ballon se charge d’électricité statique. Cette électricité attire les choses légères, comme le papier, et même le filet d’eau.' },
  { cle: 'haricot', nom: 'Le haricot dans le bocal', image: '🌱', duree: '10 minutes, puis quelques jours',
    materiel: ['Un bocal en verre', 'Du coton', 'Des haricots secs ou des lentilles', 'De l’eau'],
    etapes: ['Mets du coton mouillé dans le bocal.', 'Glisse les graines entre le coton et le verre, pour bien les voir.', 'Pose le bocal près d’une fenêtre.', 'Garde le coton mouillé, et regarde chaque jour !'],
    devine: ['Qu’est-ce qui sort de la graine en premier ?', 'Une petite racine', 'Une fleur', 'Un fruit'],
    explication: 'Dans la graine, il y a tout ce qu’il faut pour commencer une plante. Avec de l’eau et de la chaleur, elle se réveille : d’abord la racine, puis la tige et les feuilles.' },
  { cle: 'celeri', nom: 'Le céleri qui boit les couleurs', image: '🥬', duree: '10 minutes, puis quelques heures',
    materiel: ['Des branches de céleri avec leurs feuilles', 'Des verres d’eau', 'Du colorant alimentaire'],
    etapes: ['Mets beaucoup de colorant dans un verre d’eau.', 'Pose une branche de céleri dans le verre.', 'Attends quelques heures.', 'Regarde les feuilles. Puis demande à un adulte de couper la tige, et regarde dedans !'],
    devine: ['Que va-t-il arriver aux feuilles ?', 'Elles prennent la couleur de l’eau', 'Elles tombent', 'Elles deviennent blanches'],
    explication: 'La plante boit l’eau par de tout petits tuyaux, jusqu’aux feuilles. Le colorant voyage avec l’eau : on voit le chemin que l’eau prend dans la plante.', adulte: 'Un adulte coupe la tige.' },
  { cle: 'arc-en-ciel', nom: 'L’arc-en-ciel dans l’assiette', image: '🌈', duree: '10 minutes',
    materiel: ['Une assiette creuse', 'De l’eau', 'Un petit miroir', 'Du soleil ou une lampe de poche', 'Une feuille blanche'],
    etapes: ['Remplis l’assiette d’eau.', 'Pose le miroir penché, à moitié dans l’eau.', 'Tourne l’assiette pour que le soleil éclaire le miroir.', 'Cherche le reflet sur le mur ou sur la feuille blanche, et regarde !'],
    devine: ['Que vois-tu sur la feuille ?', 'Toutes les couleurs de l’arc-en-ciel', 'Seulement du blanc', 'Seulement du noir'],
    explication: 'La lumière du soleil a l’air blanche, mais elle est faite de toutes les couleurs mélangées. En passant dans l’eau, les couleurs se séparent, comme dans un arc-en-ciel.' },
  { cle: 'coquille', nom: 'La coquille qui disparaît', image: '🥚', duree: '5 minutes, puis un jour d’attente',
    materiel: ['Un œuf dur', 'Un verre', 'Du vinaigre blanc', 'Une petite assiette'],
    etapes: ['Pose l’œuf dur dans le verre.', 'Recouvre-le de vinaigre. Regarde les petites bulles !', 'Couvre le verre avec l’assiette et mets-le au frigo.', 'Le lendemain, sors l’œuf, rince-le, et regarde !'],
    devine: ['Qu’est devenue la coquille ?', 'Elle a disparu', 'Elle est plus dure', 'Elle est devenue bleue'],
    explication: 'Le vinaigre est un acide. Il ronge doucement le calcaire de la coquille, qui part en petites bulles. Il reste l’œuf, tout mou, dans sa fine peau.', adulte: 'Un adulte cuit l’œuf dur avant.' },
  { cle: 'bonbons', nom: 'Les bonbons arc-en-ciel', image: '🍬', duree: '5 minutes',
    materiel: ['Une assiette blanche', 'Des bonbons ronds de toutes les couleurs', 'De l’eau tiède'],
    etapes: ['Range les bonbons en rond, tout autour de l’assiette.', 'Verse doucement l’eau tiède au milieu, jusqu’aux bonbons.', 'Ne touche plus à rien, et regarde !'],
    devine: ['Que vont faire les couleurs ?', 'Elles avancent vers le milieu en rayons', 'Elles se mélangent en marron tout de suite', 'Elles restent sur les bonbons'],
    explication: 'La couche de couleur des bonbons est faite de sucre et de colorant. L’eau tiède la fait fondre. Chaque couleur avance vers le milieu sans se mélanger tout de suite avec sa voisine.' },
];
export const experience = (cle) => EXPERIENCES.find((e) => e.cle === cle);

// L'enfant a deviné puis lu l'explication : des étoiles la première fois. Renvoie les étoiles gagnées.
export function terminer(profil, cle) {
  if (!experience(cle)) throw new Error('Expérience inconnue.');
  const faites = (profil.experiences ??= []);
  if (faites.includes(cle)) return 0;
  faites.push(cle);
  profil.etoiles += ETOILES_EXPERIENCE;
  return ETOILES_EXPERIENCE;
}
// La fiche, lue à voix haute (sans la réponse à deviner)
export const lire = (e) => `${e.nom}. Il te faut : ${e.materiel.join(', ')}. ${e.etapes.map((t, i) => `Étape ${i + 1}. ${t}`).join(' ')}${e.adulte ? ` ${e.adulte}` : ''} ${REGLE}`;

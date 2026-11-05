// Les histoires des religions, racontées pour les enfants, illustrées, lues à voix haute, suivies de 2 ou 3 questions.
// À FAIRE RELIRE PAR UN PARENT (et, pour une version publique, par un représentant de chaque tradition).
//
// Structure (la même pour toutes les religions) : RECITS[tradition] = [{ cle, titre, source, texte: [phrases…],
//   decor: [[élément, x, y, taille]], personnages: [[x, y, taille, couleur, variante]], questions: [[question, bonne, [3 autres], savaisTu]] }]
// Pour ajouter les histoires d'une autre religion : une nouvelle clé dans RECITS, et la relier dans TRADITION.
//
// Règles des dessins :
// - Dieu n'est JAMAIS représenté (aucun élément de dessin ne le représente, quel que soit le réglage).
// - Les personnages (prophètes, Jésus, Marie…) ne sont dessinés que si la famille l'a choisi (réglage de l'espace parents).
//   Sinon, on ne montre que le décor, les symboles et les objets.
import { melanger } from './partie.js';

export const TRADITION = { catholique: 'chretien', protestant: 'chretien', orthodoxe: 'chretien', judaisme: 'judaisme', islam: 'islam', hindouisme: 'hindouisme', bouddhisme: 'bouddhisme' };
export const recitsDe = (contenu) => RECITS[TRADITION[contenu]] ?? [];

export const RECITS = {
  chretien: [
    { cle: 'creation', titre: 'La création du monde', source: 'Genèse 1 et 2',
      texte: ['Au tout début, raconte la Bible, Dieu crée le monde en six jours.',
        'Il sépare la lumière de la nuit, puis il fait le ciel, la mer et la terre.',
        'Il fait pousser les plantes et les arbres, et il allume le soleil, la lune et les étoiles.',
        'Il crée les poissons, les oiseaux et tous les animaux.',
        "Enfin, il crée l'homme et la femme, Adam et Ève, et leur confie la terre. Il voit que tout cela est très bon.",
        'Le septième jour, il se repose.'],
      decor: [['soleil', 60, 45, 1], ['lune', 270, 40, 1], ['etoiles', 0, 0, 1], ['lac', 0, 0, 1], ['poissons', 250, 185, 1], ['arbre', 110, 150, 1], ['palmier', 175, 150, 0.9], ['fleurs', 40, 150, 1], ['oiseau', 150, 70, 1], ['oiseau', 190, 55, 0.8], ['brebis', 75, 150, 0.8]],
      personnages: [],
      questions: [
        ['En combien de jours Dieu crée-t-il le monde, selon la Bible ?', '6', ['3', '7', '10'], "Le septième jour est un jour de repos : c'est de là que vient la semaine de sept jours."],
        ['Que fait Dieu le septième jour ?', 'Il se repose', ['Il crée les animaux', 'Il allume les étoiles', 'Il crée la mer'], 'Pour les juifs, ce jour de repos est le shabbat ; pour beaucoup de chrétiens, c’est le dimanche.'],
        ["Comment s'appellent le premier homme et la première femme ?", 'Adam et Ève', ['Abraham et Sarah', 'Marie et Joseph', 'David et Ruth'], "Le nom « Adam » rappelle le mot hébreu qui veut dire « terre »."]] },

    { cle: 'arche', titre: "L'arche de Noé", source: 'Genèse 6 à 9',
      texte: ['Noé est un homme bon. Dieu lui demande de construire un immense bateau, l’arche, car un grand déluge va arriver.',
        "Noé obéit. Il fait monter dans l'arche sa famille et un couple de chaque animal.",
        'Il pleut pendant quarante jours et quarante nuits !',
        "Quand la pluie s'arrête, Noé lâche une colombe. Elle revient avec un rameau d'olivier dans le bec : la terre sèche n'est plus loin.",
        "Quand tout le monde sort de l'arche, un arc-en-ciel apparaît : c'est la promesse de Dieu qu'il n'y aura plus jamais de déluge."],
      decor: [['arcenciel', 160, 150, 1], ['mer', 0, 0, 1], ['arche', 150, 150, 1], ['oiseau', 245, 60, 1, 'colombe'], ['lion', 95, 128, 0.55], ['brebis', 205, 128, 0.6]],
      personnages: [[150, 128, 0.55, '#7a5a3a', 'baton']],
      questions: [
        ['Combien de jours a-t-il plu ?', '40', ['7', '12', '100'], 'Le chiffre 40 revient souvent dans la Bible : il veut dire « un long moment ».'],
        ['Que rapporte la colombe dans son bec ?', "Un rameau d'olivier", ['Un poisson', 'Une fleur', 'Une pierre'], "Depuis, la colombe avec un rameau d'olivier est un symbole de paix dans le monde entier."],
        ['Quel signe apparaît dans le ciel à la fin ?', 'Un arc-en-ciel', ['Une étoile filante', 'Une comète', 'Un nuage en forme de cœur'], "L'arc-en-ciel est le signe d'une promesse entre Dieu et les hommes."]] },

    { cle: 'abraham', titre: 'Abraham et les étoiles', source: 'Genèse 12, 15 et 21',
      texte: ['Abraham et sa femme Sarah vivent sous des tentes, avec leurs troupeaux.',
        'Dieu demande à Abraham de partir vers un pays nouveau, et Abraham lui fait confiance.',
        "Une nuit, Dieu lui dit : « Regarde le ciel et compte les étoiles, si tu peux. Ta famille sera aussi nombreuse qu'elles ! »",
        "Mais Abraham et Sarah sont déjà très vieux, et ils n'ont pas d'enfant.",
        'Pourtant, quelques années plus tard, Sarah a un bébé : Isaac. Elle en rit de joie !'],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 1.4], ['lune', 270, 40, 0.8], ['tente', 95, 150, 1], ['palmier', 270, 150, 0.8], ['brebis', 215, 150, 0.7], ['brebis', 240, 158, 0.6]],
      personnages: [[160, 150, 0.8, '#6b4f8a', 'baton'], [185, 150, 0.72, '#b0603a', 'voile']],
      questions: [
        ['Que demande Dieu à Abraham de compter ?', 'Les étoiles', ['Ses moutons', 'Les arbres', 'Les nuages'], 'Abraham est appelé « le père des croyants » par les juifs, les chrétiens et les musulmans.'],
        ["Comment s'appelle le fils d'Abraham et de Sarah ?", 'Isaac', ['Joseph', 'Moïse', 'David'], "Le prénom Isaac veut dire « il rit », comme Sarah qui a ri de joie."],
        ['Où vivent Abraham et Sarah ?', 'Sous des tentes', ['Dans un château', 'Dans un bateau', 'Dans une grotte'], "Ils sont nomades : ils se déplacent avec leurs troupeaux pour trouver de l'herbe et de l'eau."]] },

    { cle: 'joseph', titre: 'Joseph et ses frères', source: 'Genèse 37 à 45',
      texte: ['Jacob a douze fils. Il offre à Joseph, son préféré, un magnifique manteau de toutes les couleurs.',
        "Les frères de Joseph sont jaloux. Ils le vendent à des marchands, qui l'emmènent en Égypte.",
        'Là-bas, Joseph explique les rêves du pharaon : sept années de bonnes récoltes vont arriver, puis sept années de famine.',
        'Le pharaon le charge de remplir les greniers de blé.',
        'Pendant la famine, les frères de Joseph viennent en Égypte pour acheter à manger. Joseph les reconnaît… et il leur pardonne.',
        'Toute la famille est de nouveau réunie.'],
      decor: [['desert', 0, 0, 1], ['soleil', 270, 40, 0.9], ['pyramide', 250, 150, 1], ['palmier', 45, 150, 0.8], ['epis', 110, 150, 1], ['tunique', 190, 120, 1]],
      personnages: [[150, 150, 0.75, '#c0392b', 'tunique'], [80, 150, 0.7, '#7a6a4a'], [225, 150, 0.7, '#5a6a7a']],
      questions: [
        ['Que reçoit Joseph de son père ?', 'Un manteau de toutes les couleurs', ['Une épée', 'Un cheval', 'Une couronne'], 'Ce manteau montrait que Joseph était le fils préféré : c’est ce qui a rendu ses frères jaloux.'],
        ['Combien de fils a Jacob ?', '12', ['3', '7', '10'], "Les douze fils de Jacob sont à l'origine des douze tribus d'Israël."],
        ['Que fait Joseph quand il retrouve ses frères ?', 'Il leur pardonne', ['Il les chasse', 'Il se cache', 'Il se moque d’eux'], 'Pardonner, ce n’est pas oublier : c’est choisir de ne plus garder la colère.']] },

    { cle: 'moise', titre: 'Moïse et la mer Rouge', source: 'Exode 14 et 15',
      texte: ["Le peuple d'Israël est esclave en Égypte. Dieu choisit Moïse pour le conduire vers la liberté.",
        "Le pharaon finit par les laisser partir, puis il change d'avis et lance son armée derrière eux.",
        "Devant le peuple, il y a la mer Rouge : impossible d'aller plus loin !",
        "Moïse lève son bâton et étend la main au-dessus de l'eau. Un grand vent souffle toute la nuit, et la mer s'ouvre en deux.",
        "Le peuple traverse à pied sec, entre deux murs d'eau. Quand l'armée veut les suivre, l'eau revient, et elle ne peut pas les rattraper.",
        'Le peuple est libre, et il chante de joie.'],
      decor: [['desert', 0, 0, 1], ['merOuverte', 160, 150, 1], ['nuage', 70, 40, 0.8]],
      personnages: [[160, 160, 0.75, '#6b4f8a', 'baton'], [130, 175, 0.5, '#b0603a', 'voile'], [190, 175, 0.5, '#5a7a4a'], [160, 190, 0.45, '#c09040', 'enfant']],
      questions: [
        ['Que se passe-t-il quand Moïse étend la main sur la mer ?', "La mer s'ouvre en deux", ['La mer gèle', 'Il se met à pleuvoir', 'Un pont apparaît'], 'Chaque année, à la fête de Pessa’h, les juifs se souviennent de cette sortie d’Égypte.'],
        ['Quelle mer le peuple traverse-t-il ?', 'La mer Rouge', ['La mer Noire', 'La Méditerranée', 'La mer Morte'], "La mer Rouge sépare l'Afrique et l'Arabie."],
        ['Où le peuple était-il esclave ?', 'En Égypte', ['En Grèce', 'À Rome', 'En Suisse'], 'Après la mer, le peuple marchera quarante ans dans le désert.']] },

    { cle: 'david', titre: 'David et Goliath', source: '1 Samuel 17',
      texte: ['David est un jeune berger. Il garde les moutons de son père et il joue de la harpe.',
        'Un jour, l’armée des Philistins arrive avec un géant, Goliath, qui se moque de tout le monde. Aucun soldat n’ose l’affronter.',
        'David, lui, n’a pas peur : il fait confiance à Dieu.',
        "Il refuse l'armure du roi, bien trop lourde, et prend seulement sa fronde et cinq pierres bien lisses, ramassées dans la rivière.",
        'Avec une seule pierre, il fait tomber le géant.',
        'Plus tard, David deviendra roi.'],
      decor: [['collines', 0, 0, 1], ['soleil', 60, 40, 0.8], ['riviere', 0, 0, 1], ['pierres', 120, 172, 1], ['fronde', 95, 150, 1], ['brebis', 40, 150, 0.6]],
      personnages: [[110, 150, 0.6, '#5a8a4a', 'enfant'], [240, 150, 1.25, '#6a6a6a', 'casque']],
      questions: [
        ['Quel est le métier de David quand il est jeune ?', 'Berger', ['Pêcheur', 'Charpentier', 'Boulanger'], 'David jouait si bien de la harpe que le roi Saül l’appelait pour se calmer.'],
        ['Combien de pierres ramasse-t-il dans la rivière ?', '5', ['1', '3', '10'], 'Une fronde est une lanière qui lance une pierre très loin en la faisant tourner.'],
        ['Que deviendra David plus tard ?', 'Roi', ['Pharaon', 'Capitaine', 'Marchand'], 'On dit encore « David contre Goliath » quand un petit affronte un très grand.']] },

    { cle: 'samuel', titre: "Samuel entend qu'on l'appelle", source: '1 Samuel 3',
      texte: ['Samuel est un petit garçon qui vit au temple avec le vieux prêtre Éli.',
        "Une nuit, alors que la lampe brille encore, il entend une voix qui l'appelle : « Samuel ! »",
        "Il court vers Éli : « Me voici, tu m'as appelé ? » — « Non, je ne t'ai pas appelé. Retourne te coucher. »",
        "Cela arrive trois fois. Alors Éli comprend : c'est Dieu qui appelle Samuel.",
        'La fois suivante, Samuel répond : « Parle, ton serviteur écoute. »',
        'Samuel grandira et deviendra un grand prophète.'],
      decor: [['interieur', 0, 0, 1], ['fenetreNuit', 160, 70, 1], ['colonne', 30, 150, 1], ['colonne', 290, 150, 1], ['lampe', 160, 128, 1], ['lit', 85, 150, 1]],
      personnages: [[100, 150, 0.6, '#4a7ab0', 'enfant'], [235, 150, 0.85, '#7a6a5a', 'baton']],
      questions: [
        ['Combien de fois Samuel court-il vers Éli ?', '3', ['1', '2', '7'], 'Samuel a cru que c’était Éli, car il ne connaissait pas encore la voix de Dieu.'],
        ['Qui appelle Samuel, selon la Bible ?', 'Dieu', ['Sa maman', 'Le vieux prêtre Éli', 'Un ami'], 'Le prénom Samuel veut dire « Dieu a entendu ».'],
        ['Que répond Samuel à la fin ?', '« Parle, ton serviteur écoute »', ['« Laisse-moi dormir »', '« Qui es-tu ? »', '« Je ne suis pas là »'], 'Écouter vraiment, c’est se taire pour laisser parler l’autre.']] },

    { cle: 'jonas', titre: 'Jonas et le grand poisson', source: 'Livre de Jonas',
      texte: ['Dieu demande à Jonas d’aller dans la grande ville de Ninive, pour dire aux habitants de changer leur façon de vivre.',
        "Mais Jonas n'a pas envie : il prend un bateau qui part dans l'autre direction !",
        'Une terrible tempête se lève. Jonas comprend que c’est à cause de lui, et il demande aux marins de le jeter à la mer. La tempête se calme aussitôt.',
        'Un énorme poisson avale Jonas, qui reste trois jours et trois nuits dans son ventre.',
        'Jonas prie, et le poisson le dépose sur la plage.',
        "Cette fois, Jonas va à Ninive. Les habitants l'écoutent et changent leur façon de vivre, et Dieu leur pardonne."],
      decor: [['mer', 0, 0, 1], ['nuage', 230, 40, 1], ['bateau', 240, 130, 0.9], ['grandPoisson', 120, 160, 1]],
      personnages: [[175, 150, 0.45, '#8a6a3a']],
      questions: [
        ['Où Dieu envoie-t-il Jonas ?', 'À Ninive', ['À Bethléem', 'En Égypte', 'À Jérusalem'], "Ninive était une très grande ville de l'Antiquité, dans l'actuel Irak."],
        ['Qui avale Jonas ?', 'Un énorme poisson', ['Un lion', 'Un crocodile', 'Un aigle'], 'On dit souvent « la baleine de Jonas », mais la Bible parle d’un grand poisson.'],
        ['Combien de temps Jonas reste-t-il dans le ventre du poisson ?', '3 jours et 3 nuits', ['1 heure', '7 jours', '40 jours'], "Jonas est aussi un prophète pour les musulmans, qui l'appellent Younous."]] },

    { cle: 'daniel', titre: 'Daniel dans la fosse aux lions', source: 'Daniel 6',
      texte: ['Daniel est un homme sage qui conseille le roi Darius. Il prie Dieu trois fois par jour, devant sa fenêtre.',
        "Des conseillers jaloux poussent le roi à faire une loi : pendant trente jours, interdit de prier quelqu'un d'autre que le roi !",
        'Daniel continue de prier. Alors on le jette dans une fosse pleine de lions.',
        'Le roi, qui aime Daniel, ne dort pas de la nuit. Au matin, il court à la fosse : Daniel est sain et sauf !',
        '« Dieu a envoyé son ange, et il a fermé la gueule des lions », dit Daniel. Le roi est rempli de joie.'],
      decor: [['fosse', 160, 150, 1], ['soleil', 270, 45, 0.8], ['lion', 85, 160, 0.9], ['lion', 235, 165, 0.8], ['lion', 200, 185, 0.6]],
      personnages: [[155, 175, 0.7, '#4a6a9a']],
      questions: [
        ['Combien de fois par jour Daniel prie-t-il ?', '3', ['1', '5', '10'], 'Daniel priait tourné vers Jérusalem, sa ville, loin de là.'],
        ['Où jette-t-on Daniel ?', 'Dans une fosse aux lions', ['Dans un puits', 'Dans la mer', 'Dans une forêt'], 'Une fosse est un grand trou creusé dans la terre.'],
        ['Comment va Daniel au matin ?', 'Il est sain et sauf', ['Il est blessé', 'Il est très malade', 'Il a disparu'], "« Sain et sauf » veut dire : sans aucune blessure."]] },

    { cle: 'naissance', titre: 'La naissance de Jésus', source: 'Luc 2 et Matthieu 2',
      texte: ["L'empereur demande à tout le monde d'aller se faire compter dans la ville de sa famille.",
        'Marie, qui attend un bébé, et Joseph partent pour Bethléem.',
        "Il n'y a plus de place pour eux à l'auberge. C'est dans une étable que Jésus naît, et Marie le couche dans une mangeoire.",
        'Dans les champs, des anges annoncent la bonne nouvelle à des bergers, qui viennent voir le bébé.',
        "Plus tard, des mages venus d'Orient suivent une étoile, et ils apportent de l'or, de l'encens et de la myrrhe."],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 0.8], ['etoileBrillante', 160, 30, 1], ['etable', 160, 150, 1], ['mangeoire', 160, 150, 1], ['ane', 235, 150, 0.7], ['brebis', 70, 150, 0.6]],
      personnages: [[125, 150, 0.7, '#3a6ab0', 'voile'], [195, 150, 0.75, '#8a6a3a', 'baton'], [160, 140, 0.6, '#f4ead8', 'bebe']],
      questions: [
        ['Où Jésus naît-il, selon la Bible ?', 'Dans une étable', ['Dans un palais', 'Dans un bateau', 'Dans une tente'], 'Une étable est un abri pour les animaux, comme une petite écurie.'],
        ['Où Marie couche-t-elle le bébé ?', 'Dans une mangeoire', ['Dans un panier', 'Dans un berceau en or', 'Dans un hamac'], "Une mangeoire, c'est le bac où mangent les animaux. On y mettait de la paille pour le bébé."],
        ['Que suivent les mages ?', 'Une étoile', ['Une rivière', 'Un oiseau', 'Une carte'], "Dans beaucoup de crèches de Noël, on met une étoile au-dessus de l'étable."]] },

    { cle: 'enfants', titre: 'Jésus et les enfants', source: 'Marc 10',
      texte: ['Des parents amènent leurs enfants à Jésus pour qu’il les bénisse.',
        'Les disciples veulent les renvoyer : « Laissez le maître tranquille, il est bien trop occupé ! »',
        "Mais Jésus n'est pas d'accord. Il dit : « Laissez les enfants venir à moi, ne les en empêchez pas. Le royaume de Dieu est à ceux qui leur ressemblent. »",
        'Il prend les enfants dans ses bras et il les bénit.'],
      decor: [['collines', 0, 0, 1], ['soleil', 60, 40, 0.9], ['arbre', 260, 150, 1.1], ['fleurs', 40, 160, 1], ['fleurs', 200, 170, 0.8]],
      personnages: [[150, 150, 0.85, '#f4ead8', 'jesus'], [105, 160, 0.5, '#e8873a', 'enfant'], [190, 162, 0.5, '#5a9ad0', 'enfant'], [125, 172, 0.45, '#d05a8a', 'enfant']],
      questions: [
        ['Que veulent faire les disciples ?', 'Renvoyer les enfants', ['Jouer avec eux', 'Leur donner à manger', 'Leur raconter une histoire'], 'À l’époque, les enfants comptaient peu aux yeux des grands.'],
        ['Que fait Jésus ?', 'Il prend les enfants dans ses bras et les bénit', ['Il les renvoie chez eux', "Il s'en va", 'Il leur fait la leçon'], 'Bénir, c’est souhaiter du bien à quelqu’un de la part de Dieu.']] },

    { cle: 'cana', titre: 'Les noces de Cana', source: 'Jean 2',
      texte: ['Jésus, sa mère Marie et ses disciples sont invités à un mariage, à Cana.',
        'Pendant la fête, il n’y a plus de vin ! Marie le dit à Jésus.',
        "Jésus demande aux serviteurs de remplir d'eau six grandes jarres de pierre, jusqu'au bord.",
        "Puis il leur dit d'en apporter au responsable du repas. L'eau est devenue du vin, et c'est même le meilleur !",
        "C'est le premier miracle de Jésus raconté dans l'Évangile de Jean."],
      decor: [['interieur', 0, 0, 1], ['guirlande', 0, 0, 1], ['table', 220, 150, 1], ['jarres', 95, 150, 1]],
      personnages: [[180, 150, 0.8, '#f4ead8', 'jesus'], [250, 150, 0.75, '#3a6ab0', 'voile'], [45, 150, 0.7, '#9a8a6a']],
      questions: [
        ['À quelle fête Jésus est-il invité ?', 'Un mariage', ['Un anniversaire', 'Une fête de village', 'Un baptême'], 'Un mariage, autrefois, pouvait durer une semaine entière !'],
        ['Combien de jarres les serviteurs remplissent-ils ?', '6', ['2', '3', '12'], 'Chaque jarre contenait environ 100 litres : une énorme quantité !'],
        ["Que devient l'eau ?", 'Du vin', ['Du lait', 'Du miel', 'De la glace'], 'Un miracle est un événement extraordinaire, que les croyants voient comme un signe de Dieu.']] },

    { cle: 'tempete', titre: 'La tempête apaisée', source: 'Marc 4',
      texte: ['Un soir, Jésus et ses disciples traversent le lac en barque.',
        "Jésus, fatigué, s'endort à l'arrière, la tête sur un coussin.",
        'Soudain, une grosse tempête se lève : le vent souffle, et les vagues remplissent la barque !',
        'Les disciples ont très peur et réveillent Jésus : « Maître, nous allons couler ! »',
        'Jésus se lève, il parle au vent et dit à la mer : « Silence, calme-toi ! » Aussitôt, tout devient calme.',
        'Il demande à ses amis : « Pourquoi avez-vous peur ? Vous n’avez pas confiance ? »'],
      decor: [['orage', 0, 0, 1], ['nuageOrage', 80, 40, 1], ['nuageOrage', 230, 35, 1.1], ['eclair', 255, 60, 1], ['mer', 0, 0, 1], ['barque', 160, 140, 1.2]],
      personnages: [[150, 128, 0.55, '#f4ead8', 'jesus'], [115, 128, 0.5, '#7a6a4a'], [190, 128, 0.5, '#5a6a8a']],
      questions: [
        ['Que fait Jésus quand la tempête commence ?', 'Il dort', ['Il pêche', 'Il rame', 'Il chante'], 'Ce lac, en Galilée, est connu pour ses tempêtes qui arrivent très vite.'],
        ['Que dit Jésus à la mer ?', '« Silence, calme-toi ! »', ['« Plus fort ! »', '« Au revoir ! »', '« Attends-moi ! »'], 'Cette histoire rappelle aux chrétiens d’avoir confiance quand ils ont peur.']] },

    { cle: 'pains', titre: 'Cinq pains et deux poissons', source: 'Jean 6',
      texte: ["Une grande foule a suivi Jésus pour l'écouter, sur une colline au bord du lac.",
        'Le soir arrive, et tout le monde a faim.',
        "Les disciples ne trouvent qu'un jeune garçon, qui a cinq pains d'orge et deux poissons. « Qu'est-ce que c'est, pour tant de monde ? »",
        "Jésus fait asseoir la foule dans l'herbe, il remercie Dieu, et il fait distribuer les pains et les poissons.",
        'Tout le monde mange à sa faim : environ cinq mille hommes !',
        'Avec les restes, on remplit douze paniers.'],
      decor: [['collines', 0, 0, 1], ['lac', 0, 0, 1], ['panier', 230, 158, 1], ['pains', 230, 146, 1], ['poissons', 120, 172, 0.9]],
      personnages: [[160, 150, 0.85, '#f4ead8', 'jesus'], [200, 158, 0.5, '#d08a3a', 'enfant'], [60, 160, 0.55, '#7a8a5a'], [90, 165, 0.5, '#9a6a8a', 'voile']],
      questions: [
        ['Combien de pains a le garçon ?', '5', ['2', '7', '12'], "Le pain d'orge était le pain des gens simples, moins cher que le pain de blé."],
        ['Combien de poissons a-t-il ?', '2', ['1', '5', '12'], 'C’est le seul miracle raconté dans les quatre Évangiles.'],
        ['Combien de paniers remplit-on avec les restes ?', '12', ['2', '5', '100'], "Jésus demande de ramasser les restes, pour que rien ne soit perdu."]] },

    { cle: 'semeur', titre: 'Le semeur', source: 'Matthieu 13',
      texte: ['Jésus raconte une histoire. Un semeur sort pour semer ses graines.',
        'Certaines tombent sur le chemin : les oiseaux les mangent.',
        "D'autres tombent sur des pierres : elles poussent vite, mais elles sèchent au soleil, car elles n'ont pas de racines.",
        "D'autres tombent dans les épines, qui les étouffent.",
        "Mais certaines tombent dans la bonne terre : elles poussent et donnent beaucoup d'épis.",
        "Jésus explique : la parole de Dieu est comme une graine. Elle grandit dans le cœur de celui qui l'écoute bien."],
      decor: [['champ', 0, 0, 1], ['soleil', 270, 40, 0.9], ['oiseau', 60, 70, 0.9], ['oiseau', 95, 55, 0.7], ['pierres', 70, 165, 1.2], ['epines', 135, 150, 1], ['epis', 250, 150, 1.1]],
      personnages: [[190, 150, 0.8, '#8a7a4a', 'sac']],
      questions: [
        ['Qui mange les graines tombées sur le chemin ?', 'Les oiseaux', ['Les fourmis', 'Les moutons', 'Les poules'], "Une parabole est une histoire inventée pour faire comprendre une idée."],
        ['Où les graines poussent-elles le mieux ?', 'Dans la bonne terre', ['Sur les pierres', 'Dans les épines', 'Sur le chemin'], "À l'époque, on semait à la main, en lançant les graines devant soi."]] },

    { cle: 'samaritain', titre: 'Le bon Samaritain', source: 'Luc 10',
      texte: ["Quelqu'un demande à Jésus : « Qui est mon prochain ? » Jésus répond par une histoire.",
        "Un homme voyage sur la route de Jérusalem à Jéricho. Des voleurs l'attaquent et le laissent blessé au bord du chemin.",
        "Un prêtre passe… et continue sa route. Un autre homme du temple passe aussi, sans s'arrêter.",
        "Puis arrive un Samaritain, un étranger. Il s'arrête, il soigne les blessures, il installe l'homme sur son âne et l'emmène dans une auberge, où il paie pour qu'on prenne soin de lui.",
        'Jésus dit : « Va, et toi aussi, fais comme lui. »'],
      decor: [['desert', 0, 0, 1], ['soleil', 60, 40, 0.8], ['route', 0, 0, 1], ['auberge', 265, 150, 1], ['palmier', 25, 150, 0.7], ['ane', 200, 158, 0.85]],
      personnages: [[150, 160, 0.8, '#3a8a8a'], [115, 168, 0.55, '#9a8a7a', 'assis']],
      questions: [
        ["Combien de personnes passent sans s'arrêter ?", '2', ['1', '3', '5'], 'Le prochain, ce n’est pas seulement un ami : c’est toute personne qui a besoin d’aide.'],
        ["Qui s'arrête pour aider le blessé ?", 'Un Samaritain, un étranger', ['Un prêtre', 'Un soldat', 'Un roi'], "Aujourd'hui, on appelle « bon Samaritain » une personne qui aide un inconnu."],
        ['Où le Samaritain emmène-t-il le blessé ?', 'Dans une auberge', ['À l’hôpital', 'Dans une grotte', 'Au marché'], 'Une auberge, c’est comme un petit hôtel où les voyageurs dorment et mangent.']] },

    { cle: 'brebis', titre: 'La brebis perdue', source: 'Luc 15',
      texte: ["Un berger a cent brebis. Un soir, en les comptant, il s'aperçoit qu'il en manque une !",
        'Il laisse les quatre-vingt-dix-neuf autres en sécurité, et il part chercher celle qui est perdue, dans les collines et les ronces.',
        'Quand il la retrouve enfin, il la met sur ses épaules, tout joyeux.',
        "De retour chez lui, il invite ses amis : « Réjouissez-vous avec moi, j'ai retrouvé ma brebis ! »",
        'Jésus explique que Dieu se réjouit de la même façon pour chaque personne qui revient vers lui.'],
      decor: [['collines', 0, 0, 1], ['soleil', 270, 40, 0.8], ['epines', 250, 150, 0.9], ['brebis', 50, 150, 0.6], ['brebis', 75, 158, 0.55], ['brebis', 40, 165, 0.5], ['brebis', 95, 168, 0.5]],
      personnages: [[175, 150, 0.8, '#7a5a3a', 'baton']],
      questions: [
        ['Combien de brebis a le berger ?', '100', ['10', '50', '1 000'], 'Une brebis est un mouton femelle.'],
        ['Combien de brebis a-t-il perdues ?', '1', ['2', '10', '99'], 'Chaque brebis compte pour le berger, même une seule sur cent.'],
        ['Comment le berger porte-t-il la brebis retrouvée ?', 'Sur ses épaules', ['Dans un panier', 'Sur un âne', 'Dans une brouette'], "Les bergers portent souvent ainsi un agneau fatigué ou blessé."]] },

    { cle: 'prodigue', titre: 'Le fils qui revient', source: 'Luc 15',
      texte: ['Un père a deux fils. Le plus jeune demande sa part de l’héritage, et il part très loin.',
        'Là-bas, il dépense tout son argent en fêtes. Bientôt, il n’a plus rien, et une famine arrive.',
        "Il doit garder des cochons, et il a tellement faim qu'il voudrait manger leur nourriture.",
        'Il se dit : « Je vais rentrer et demander pardon à mon père. »',
        'Son père le voit arriver de loin. Il court vers lui et le serre dans ses bras.',
        "Il lui donne un beau vêtement, une bague, et il organise une grande fête : « Mon fils était perdu, et il est retrouvé ! »"],
      decor: [['collines', 0, 0, 1], ['soleil', 60, 40, 0.8], ['chemin', 0, 0, 1], ['maison', 255, 150, 1], ['arbre', 40, 150, 0.9], ['bague', 200, 70, 1]],
      personnages: [[175, 155, 0.85, '#6a5a8a', 'baton'], [140, 158, 0.75, '#9a8a6a']],
      questions: [
        ['Que fait le jeune fils avec son argent ?', 'Il le dépense en fêtes', ['Il achète une maison', 'Il le donne aux pauvres', 'Il le cache'], "On l'appelle souvent « le fils prodigue » : prodigue veut dire « qui dépense sans compter »."],
        ['Que fait le père en le voyant arriver ?', 'Il court le serrer dans ses bras', ['Il ferme la porte', 'Il se fâche', 'Il fait semblant de ne pas le voir'], 'Le père n’attend même pas que son fils ait fini de demander pardon.'],
        ['Que donne le père à son fils ?', 'Une bague et un beau vêtement', ['Une épée', 'Un cheval', 'Un coffre de pièces'], 'La bague montrait qu’il faisait de nouveau partie de la famille.']] },

    { cle: 'zachee', titre: 'Zachée dans l’arbre', source: 'Luc 19',
      texte: ["Zachée habite à Jéricho. Il est chef des collecteurs d'impôts et très riche, mais personne ne l'aime, car il a souvent pris trop d'argent aux gens.",
        'Un jour, Jésus traverse la ville. Zachée veut le voir, mais il est trop petit, et la foule est trop grande.',
        'Alors il grimpe dans un sycomore, un grand arbre.',
        'Arrivé sous l’arbre, Jésus lève les yeux : « Zachée, descends vite ! Aujourd’hui, je viens chez toi. »',
        "Zachée est si heureux qu'il change de vie : il donne la moitié de ses biens aux pauvres, et il rend quatre fois ce qu'il a pris."],
      decor: [['ville', 0, 0, 1], ['soleil', 270, 40, 0.8], ['sycomore', 200, 150, 1]],
      personnages: [[205, 88, 0.45, '#b0603a'], [120, 150, 0.85, '#f4ead8', 'jesus'], [70, 155, 0.6, '#7a8a6a'], [45, 158, 0.6, '#9a6a5a', 'voile']],
      questions: [
        ['Pourquoi Zachée grimpe-t-il dans l’arbre ?', 'Il est trop petit pour voir Jésus', ['Pour cueillir des fruits', 'Pour se cacher des voleurs', 'Pour regarder le coucher du soleil'], "Le sycomore est un figuier aux branches basses, facile à grimper."],
        ['Dans quel arbre grimpe-t-il ?', 'Un sycomore', ['Un sapin', 'Un pommier', 'Un palmier'], 'Jéricho est l’une des plus vieilles villes du monde.'],
        ["Combien de fois rend-il ce qu'il a pris ?", '4 fois', ['2 fois', '10 fois', '100 fois'], 'Changer de vie, c’est aussi réparer le mal qu’on a fait.']] },

    { cle: 'paques', titre: 'Le matin de Pâques', source: 'Luc 24 et Jean 20',
      texte: ['Jésus est mort sur une croix, un vendredi. Ses amis l’ont déposé dans un tombeau creusé dans la roche, fermé par une grosse pierre ronde. Ils sont très tristes.',
        'Le dimanche matin, très tôt, des femmes, dont Marie de Magdala, vont au tombeau.',
        'Surprise : la pierre est roulée, et le tombeau est vide !',
        '« Il n’est pas ici, il est ressuscité ! », leur annonce un ange.',
        'Plus tard, Jésus apparaît à ses amis. C’est cette bonne nouvelle que les chrétiens fêtent à Pâques.'],
      decor: [['aube', 0, 0, 1], ['soleil', 270, 70, 0.9], ['tombeau', 150, 150, 1], ['fleurs', 40, 160, 1], ['fleurs', 260, 165, 0.8], ['arbre', 285, 150, 0.7]],
      personnages: [[60, 155, 0.7, '#6a5a8a', 'voile'], [90, 158, 0.65, '#b0603a', 'voile']],
      questions: [
        ['Qu’est-ce qui fermait le tombeau ?', 'Une grosse pierre ronde', ['Une porte en bois', 'Un rideau', 'Une grille'], 'À l’époque, on fermait les tombeaux taillés dans la roche en roulant une grosse pierre devant.'],
        ['Que trouvent les femmes en arrivant ?', 'Le tombeau vide', ['Un trésor', 'Des fleurs fanées', 'Une lettre'], 'Pâques est la plus grande fête des chrétiens.'],
        ['Quel jour les femmes vont-elles au tombeau ?', 'Le dimanche matin', ['Le vendredi soir', 'Le lundi', 'Le samedi midi'], "C'est pour ça que, pour les chrétiens, le dimanche est le jour du Seigneur."]] },
  ],

  // Dans la tradition juive. Personnages (Esther, Hillel…) seulement si la famille l'a choisi.
  judaisme: [
    { cle: 'hanoucca', titre: "Hanoucca et la petite fiole d'huile", source: 'Livres des Maccabées et Talmud',
      texte: ['Dans la tradition juive, on raconte qu’il y a plus de 2 000 ans, un roi étranger avait interdit aux juifs de pratiquer leur religion, et il avait abîmé le Temple de Jérusalem.',
        'Un petit groupe courageux, les Maccabées, a résisté et a pu reprendre le Temple.',
        "Pour rallumer le grand chandelier, il fallait de l'huile très pure. On n'en trouva qu'une petite fiole, assez pour un seul jour.",
        "Mais la lumière a brillé huit jours entiers, le temps de préparer de l'huile nouvelle !",
        "C'est pour cela que, pendant Hanoucca, on allume une bougie de plus chaque soir, pendant huit soirs."],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 0.8], ['temple', 160, 150, 1], ['menorah', 160, 120, 1], ['fiole', 225, 150, 1]],
      personnages: [[95, 150, 0.7, '#3a6ab0'], [255, 150, 0.6, '#8a6a3a', 'enfant']],
      questions: [
        ['Combien de jours la petite fiole d’huile a-t-elle brillé ?', '8 jours', ['1 jour', '3 jours', '40 jours'], 'C’est pour ça que Hanoucca dure huit jours.'],
        ['Que fait-on chaque soir de Hanoucca ?', 'On allume une bougie de plus', ['On éteint toutes les lumières', 'On plante un arbre', 'On se déguise'], "Les beignets et les galettes de pommes de terre sont cuits dans l'huile, pour rappeler la fiole."],
        ["Comment s'appelle le petit groupe courageux de l'histoire ?", 'Les Maccabées', ['Les Vikings', 'Les Mousquetaires', 'Les Romains'], 'Le mot Hanoucca veut dire « inauguration » : le Temple a été inauguré de nouveau.']] },

    { cle: 'esther', titre: 'La reine Esther', source: "Livre d'Esther",
      texte: ['Dans la tradition juive, on raconte l’histoire d’Esther, une jeune femme juive devenue reine de Perse, l’épouse du roi Assuérus.',
        'Un ministre très orgueilleux, Haman, voulait faire du mal à tous les juifs du royaume.',
        "Esther avait peur : on n'avait pas le droit d'aller voir le roi sans être appelé. Mais elle a trouvé le courage d'y aller.",
        'Elle a invité le roi à un festin, et elle lui a tout raconté. Le roi l’a écoutée, et le peuple juif a été sauvé.',
        'À Pourim, on lit cette histoire à la synagogue. Les enfants se déguisent, on fait du bruit avec des crécelles quand on entend le nom de Haman, et on offre des gâteaux.'],
      decor: [['interieur', 0, 0, 1], ['colonne', 30, 150, 1], ['colonne', 290, 150, 1], ['trone', 220, 150, 1], ['table', 100, 150, 0.8]],
      personnages: [[150, 150, 0.8, '#8a4ab0', 'couronne'], [220, 140, 0.8, '#b03a3a', 'couronne']],
      questions: [
        ["Qu'a fait Esther pour sauver son peuple ?", 'Elle a eu le courage de parler au roi', ['Elle s’est cachée', 'Elle a quitté le pays', 'Elle a construit un mur'], 'Esther est un modèle de courage dans la tradition juive.'],
        ['Que font les enfants à Pourim ?', 'Ils se déguisent', ['Ils jeûnent toute la journée', 'Ils plantent des arbres', 'Ils dorment à la synagogue'], 'On offre aussi des gâteaux en forme de triangle, les oreilles d’Haman.'],
        ['Dans quel pays Esther était-elle reine ?', 'En Perse', ['En Égypte', 'En Grèce', 'À Rome'], "La Perse, c'est à peu près l'Iran d'aujourd'hui."]] },

    { cle: 'pessah', titre: 'Pessah : le pain qui n’a pas eu le temps de lever', source: 'Exode 12',
      texte: ['Dans la tradition juive, on raconte que le peuple hébreu était esclave en Égypte depuis très longtemps.',
        'Moïse a demandé au pharaon : « Laisse partir mon peuple ! » Le pharaon a refusé bien des fois, puis il a fini par accepter.',
        "Il fallait partir très vite, si vite que la pâte du pain n'a pas eu le temps de lever : on l'a cuite toute plate.",
        "Chaque année, à Pessah, les familles juives se réunissent pour le Seder, un repas de fête où l’on raconte cette sortie d'Égypte.",
        'On mange de la matsa, le pain plat, et le plus jeune enfant pose des questions qui commencent par : « Pourquoi cette nuit est-elle différente de toutes les autres nuits ? »'],
      decor: [['interieur', 0, 0, 1], ['fenetreNuit', 160, 60, 1], ['table', 160, 150, 1.4], ['matsa', 160, 112, 1]],
      personnages: [[80, 150, 0.8, '#3a6ab0'], [240, 150, 0.75, '#b0603a', 'voile'], [110, 158, 0.5, '#5a9a5a', 'enfant']],
      questions: [
        ['Pourquoi le pain de Pessah est-il tout plat ?', "On est parti si vite qu'il n'a pas eu le temps de lever", ['Parce qu’on l’a écrasé', 'Parce qu’il n’y avait pas de four', 'Parce qu’on préfère le pain plat'], 'Ce pain plat s’appelle la matsa.'],
        ['Comment s’appelle le repas de fête de Pessah ?', 'Le Seder', ['L’iftar', 'Le réveillon', 'Le brunch'], 'Seder veut dire « ordre » : le repas suit un ordre précis.'],
        ['Qui pose les questions pendant le Seder ?', 'Le plus jeune enfant', ['Le grand-père', 'Le voisin', 'Personne'], 'Les enfants ont une grande place dans cette fête.']] },

    { cle: 'moise-bebe', titre: 'Moïse dans sa corbeille', source: 'Exode 2',
      texte: ["Dans la tradition juive, on raconte qu'en Égypte, le pharaon avait ordonné qu'on ne laisse pas grandir les bébés garçons des Hébreux.",
        'Une maman hébreue a caché son petit garçon pendant trois mois. Puis elle l’a déposé dans une corbeille enduite de goudron, parmi les roseaux du Nil.',
        'Sa grande sœur, Myriam, surveillait de loin. La fille du pharaon est venue se baigner : elle a vu la corbeille, et elle a eu pitié du bébé.',
        'Myriam s’est approchée : « Veux-tu que j’aille chercher une nourrice ? » Et elle est allée chercher… sa propre maman !',
        "La princesse a appelé l'enfant Moïse, ce qui veut dire « tiré des eaux »."],
      decor: [['jour', 0, 0, 1], ['soleil', 270, 40, 0.8], ['lac', 0, 0, 1], ['roseaux', 70, 175, 1], ['roseaux', 230, 172, 0.9], ['corbeille', 150, 178, 1], ['palmier', 290, 160, 0.8]],
      personnages: [[150, 172, 0.5, '#f4ead8', 'bebe'], [40, 160, 0.55, '#d0803a', 'enfant'], [255, 160, 0.75, '#e8c24a', 'couronne']],
      questions: [
        ['Où la maman dépose-t-elle la corbeille ?', 'Parmi les roseaux du Nil', ['Dans une grotte', 'Sur une montagne', 'Dans le désert'], 'Le Nil est un des plus longs fleuves du monde.'],
        ['Qui surveille le bébé de loin ?', 'Sa grande sœur Myriam', ['Son grand-père', 'Un soldat', 'Un chat'], 'Myriam deviendra une prophétesse importante.'],
        ['Que veut dire le nom « Moïse » ?', 'Tiré des eaux', ['Petit roi', 'Fort comme un lion', 'Né au printemps'], 'C’est la fille du pharaon qui lui a donné ce nom.']] },

    { cle: 'hillel', titre: 'Hillel et la Torah sur un pied', source: 'Talmud, traité Shabbat',
      texte: ['Dans la tradition juive, on raconte qu’un homme est venu voir un sage, Hillel, avec une drôle de demande :',
        '« Explique-moi toute la Torah pendant que je tiens sur un pied ! »',
        'Hillel ne s’est pas fâché. Il a souri et lui a répondu :',
        '« Ce que tu n’aimes pas qu’on te fasse, ne le fais pas aux autres. C’est toute la Torah. Le reste, c’est l’explication : va, et étudie ! »'],
      decor: [['desert', 0, 0, 1], ['soleil', 60, 40, 0.8], ['maison', 260, 150, 1], ['rouleau', 160, 70, 1]],
      personnages: [[130, 150, 0.85, '#6a5a8a', 'baton'], [195, 150, 0.8, '#3a8a8a', 'unPied']],
      questions: [
        ['Que demande l’homme à Hillel ?', "D'expliquer toute la Torah sur un pied", ['De lui prêter de l’argent', 'De lui apprendre à danser', 'De lui construire une maison'], 'Hillel était connu pour sa patience et sa douceur.'],
        ['Que répond Hillel ?', "« Ce que tu n'aimes pas qu'on te fasse, ne le fais pas aux autres »", ['« Va-t’en ! »', '« Reviens demain »', '« C’est trop difficile »'], "Cette phrase ressemble à la « règle d'or » qu'on trouve dans beaucoup de religions et de sagesses."]] },
  ],

  // Selon la tradition musulmane. Les prophètes ne sont jamais dessinés : seulement les décors et les objets.
  islam: [
    { cle: 'nouh', titre: "Nouh et l'arche", source: 'Coran, sourates 11 et 71',
      texte: ['Les musulmans racontent que le prophète Nouh a appelé son peuple, pendant très longtemps, à croire en un Dieu unique et à faire le bien.',
        "Très peu de gens l'ont écouté. Alors Dieu lui a demandé de construire une arche.",
        'Les gens se moquaient de lui : « Un bateau, ici, loin de la mer ? » Nouh a continué patiemment.',
        "Quand le grand déluge est arrivé, Nouh est monté dans l'arche avec les croyants et un couple de chaque animal.",
        "L'arche s'est posée sur une montagne, le mont Joudi. Pour les musulmans, cette histoire enseigne la patience et la confiance en Dieu."],
      decor: [['mer', 0, 0, 1], ['nuage', 70, 40, 0.8], ['montagne', 250, 150, 1], ['arche', 140, 150, 1], ['brebis', 110, 128, 0.5], ['lion', 175, 128, 0.5]],
      personnages: [],
      questions: [
        ['Que construit Nouh ?', 'Une arche, un grand bateau', ['Une tour', 'Un pont', 'Une maison'], 'Le Coran dit que Nouh a appelé son peuple pendant presque mille ans !'],
        ["Sur quelle montagne l'arche s'est-elle posée, selon le Coran ?", 'Le mont Joudi', ['Le Cervin', 'Le mont Blanc', 'L’Everest'], 'Nouh est appelé Noé par les juifs et les chrétiens.'],
        ['Que faisaient les gens en voyant Nouh construire ?', 'Ils se moquaient de lui', ['Ils l’aidaient tous', 'Ils applaudissaient', 'Ils dormaient'], 'Nouh a continué avec patience, même quand on se moquait.']] },

    { cle: 'ibrahim', titre: 'Ibrahim regarde le ciel', source: 'Coran, sourate 6',
      texte: ['Les musulmans racontent que le jeune Ibrahim vivait parmi des gens qui adoraient des statues.',
        'Une nuit, il vit une étoile briller et pensa : « Est-ce elle, mon Seigneur ? » Mais l’étoile disparut.',
        'Puis il vit la lune se lever, toute brillante. Mais la lune aussi disparut.',
        'Au matin, il vit le soleil, si grand et si chaud. Mais le soir, le soleil se coucha.',
        'Alors Ibrahim comprit : celui qu’il veut adorer, c’est Celui qui a créé les étoiles, la lune et le soleil, et qui ne disparaît jamais.',
        'Plus tard, avec son fils Ismaïl, il construisit la Kaaba, à La Mecque.'],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 1], ['etoileBrillante', 60, 40, 0.7], ['lune', 160, 50, 1], ['soleilCouchant', 270, 150, 1], ['palmier', 40, 150, 0.8], ['tente', 120, 150, 0.7]],
      personnages: [],
      questions: [
        ['Que regarde Ibrahim dans le ciel ?', 'Une étoile, la lune et le soleil', ['Des avions', 'Des oiseaux', 'Un arc-en-ciel'], 'Ibrahim est appelé Abraham par les juifs et les chrétiens.'],
        ["Qu'a-t-il compris à la fin ?", "Qu'il faut adorer Celui qui a créé le ciel", ['Que le soleil est le plus fort', 'Que la nuit est trop longue', 'Qu’il faut dormir le jour'], 'Pour les musulmans, Ibrahim est un modèle de réflexion et de foi.'],
        ['Qu’a-t-il construit avec son fils Ismaïl ?', 'La Kaaba, à La Mecque', ['Une pyramide', 'Un grand bateau', 'Une tour très haute'], 'Les musulmans du monde entier se tournent vers la Kaaba pour prier.']] },

    { cle: 'younous', titre: 'Younous et le grand poisson', source: 'Coran, sourates 21 et 37',
      texte: ['Les musulmans racontent que le prophète Younous est parti, fâché, loin de son peuple qui ne l’écoutait pas.',
        "Il est monté sur un bateau. Une tempête s'est levée, et Younous s'est retrouvé dans la mer, où un grand poisson l'a avalé.",
        "Dans le noir, au fond du ventre du poisson, il a prié Dieu et demandé pardon : « Il n'y a de dieu que Toi. Gloire à Toi ! »",
        'Dieu a entendu sa prière : le poisson l’a déposé sur le rivage, et une plante a poussé pour le protéger du soleil.',
        "Younous est retourné vers son peuple, qui, cette fois, l'a écouté."],
      decor: [['mer', 0, 0, 1], ['nuage', 230, 40, 1], ['bateau', 250, 130, 0.8], ['grandPoisson', 120, 165, 1], ['plante', 40, 150, 1]],
      personnages: [],
      questions: [
        ['Où Younous prie-t-il ?', 'Dans le ventre du grand poisson', ['Au sommet d’une montagne', 'Dans un palais', 'Dans une forêt'], 'Younous est appelé Jonas par les juifs et les chrétiens.'],
        ['Que se passe-t-il après sa prière ?', 'Le poisson le dépose sur le rivage', ['Le poisson l’emmène au fond de la mer', 'Il se transforme en poisson', 'Il reste dans le poisson pour toujours'], 'Pour les musulmans, cette histoire montre qu’on peut toujours demander pardon.']] },

    { cle: 'fourmi', titre: 'La fourmi et le prophète Soulaymane', source: 'Coran, sourate 27',
      texte: ['Les musulmans racontent que le prophète Soulaymane était un roi très sage, qui comprenait le langage des animaux.',
        'Un jour, il traversait une vallée avec sa grande armée. Une petite fourmi les vit arriver et cria aux autres :',
        '« Fourmis, rentrez vite dans vos maisons, pour que Soulaymane et son armée ne vous écrasent pas sans le savoir ! »',
        "Soulaymane l'entendit et sourit. Il remercia Dieu, et il fit attention à ne pas abîmer leur maison.",
        'Un chapitre du Coran s’appelle même « Les fourmis ». L’histoire montre qu’il faut respecter même les plus petits.'],
      decor: [['desert', 0, 0, 1], ['soleil', 270, 40, 0.8], ['collines', 0, 0, 1], ['fourmiliere', 90, 160, 1], ['fourmis', 140, 175, 1], ['drapeaux', 250, 140, 1]],
      personnages: [],
      questions: [
        ['Quel petit animal parle dans cette histoire ?', 'Une fourmi', ['Une abeille', 'Une coccinelle', 'Une souris'], 'Soulaymane est appelé Salomon par les juifs et les chrétiens.'],
        ['Que fait Soulaymane en entendant la fourmi ?', 'Il sourit et fait attention', ['Il se fâche', 'Il continue sans écouter', 'Il a peur'], 'Le Coran raconte que Soulaymane comprenait aussi les oiseaux.']] },

    { cle: 'ramadan', titre: 'Le ramadan et la fête de l’Aïd', source: 'Coran, sourates 96 et 2',
      texte: ['Les musulmans racontent que le prophète Mohammed aimait méditer dans une grotte, sur la montagne de Hira, près de La Mecque.',
        "Une nuit du mois de ramadan, l'ange Jibril lui apparut et lui dit : « Lis ! » Ce furent les premiers mots du Coran.",
        "C'est pour cela que, chaque année, pendant le mois de ramadan, les musulmans adultes jeûnent du lever au coucher du soleil.",
        "Le soir, on rompt le jeûne en famille, souvent avec des dattes et de l'eau : c'est l'iftar. On pense aussi aux personnes qui ont faim.",
        "À la fin du mois, quand on voit le fin croissant de la nouvelle lune, c'est l'Aïd el-Fitr : on met de beaux habits, on prie ensemble, on rend visite à la famille, et on donne aux pauvres."],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 1], ['croissant', 250, 45, 1], ['montagne', 90, 150, 1], ['grotte', 90, 150, 1], ['dattes', 210, 158, 1], ['lanterne', 170, 120, 1]],
      personnages: [],
      questions: [
        ['Quel est le premier mot du Coran, selon les musulmans ?', '« Lis ! »', ['« Mange ! »', '« Cours ! »', '« Dors ! »'], "C'est pour cela que lire et apprendre sont très importants dans l'islam."],
        ['Avec quoi rompt-on souvent le jeûne, le soir ?', "Des dattes et de l'eau", ['Du chocolat chaud', 'De la soupe froide', 'Du pop-corn'], "Le repas du soir s'appelle l'iftar."],
        ["Qu'est-ce qui annonce l'Aïd el-Fitr ?", 'Le fin croissant de la nouvelle lune', ['Un arc-en-ciel', 'La première neige', 'Une étoile filante'], 'Le calendrier musulman suit la lune : le ramadan avance de onze jours environ chaque année.']] },
  ],

  // Selon les traditions hindoues. Les divinités ne sont pas dessinées : seulement leurs symboles et les décors.
  hindouisme: [
    { cle: 'ganesh', titre: 'Ganesh fait le tour du monde', source: 'Récits des Pouranas',
      texte: ['Les hindous racontent une histoire de Ganesh, le dieu à tête d’éléphant, et de son frère Kartikeya.',
        'Leurs parents, Shiva et Parvati, leur proposent un concours : celui qui fera le premier le tour du monde gagnera un fruit délicieux.',
        'Kartikeya saute aussitôt sur son paon et s’envole à toute vitesse autour de la Terre.',
        'Ganesh, lui, n’a qu’une petite souris pour monture. Il réfléchit… puis il fait tranquillement trois fois le tour de ses parents.',
        '« Vous êtes mon monde tout entier », leur dit-il. Ses parents, émus, lui donnent le fruit.',
        "Ganesh est le dieu de la sagesse : les hindous le prient au début d'une chose nouvelle, comme une rentrée scolaire."],
      decor: [['jour', 0, 0, 1], ['soleil', 60, 40, 0.8], ['collines', 0, 0, 1], ['paon', 250, 70, 1], ['souris', 120, 158, 1], ['mangue', 180, 140, 1], ['lotus', 60, 165, 1]],
      personnages: [],
      questions: [
        ['Comment Ganesh fait-il « le tour du monde » ?', 'Il fait le tour de ses parents', ['Il prend un avion', 'Il nage autour de la Terre', 'Il court très vite'], 'La monture de Ganesh est une souris, et celle de Kartikeya un paon.'],
        ['De quoi Ganesh est-il le dieu ?', 'De la sagesse', ['De la mer', 'Du vent', 'De la neige'], 'Ganesh aime les modaks, de petits gâteaux sucrés.'],
        ['Quel animal est la monture de Ganesh ?', 'Une souris', ['Un cheval', 'Un tigre', 'Un aigle'], 'Une grande fête lui est consacrée chaque année : Ganesh Chaturthi.']] },

    { cle: 'rama-sita', titre: 'Rama et Sita', source: 'Le Ramayana',
      texte: ['Les hindous racontent la grande histoire du prince Rama et de son épouse Sita.',
        'Rama, Sita et son frère Lakshmana doivent vivre longtemps dans la forêt, loin de leur royaume.',
        "Un jour, le roi-démon Ravana enlève Sita et l'emmène sur son île, Lanka.",
        "Rama la cherche partout. Hanuman, le roi des singes, très fort et très fidèle, l'aide à la retrouver.",
        "Les singes construisent un pont de pierres sur la mer jusqu'à l'île. Rama libère Sita : le bien est plus fort que le mal."],
      decor: [['jour', 0, 0, 1], ['mer', 0, 0, 1], ['pont', 160, 152, 1], ['ile', 280, 150, 1], ['singe', 120, 145, 0.8], ['singe', 175, 145, 0.7], ['palmier', 30, 150, 0.8]],
      personnages: [],
      questions: [
        ['Qui aide Rama à retrouver Sita ?', 'Hanuman, le roi des singes', ['Un dragon', 'Un aigle géant', 'Un pêcheur'], 'Hanuman est très aimé en Inde pour sa force et sa fidélité.'],
        ["Comment arrive-t-on jusqu'à l'île de Lanka ?", 'Par un pont de pierres construit par les singes', ['En avion', 'En nageant', 'À dos d’éléphant'], 'Cette histoire s’appelle le Ramayana. Elle est racontée et jouée dans toute l’Asie.'],
        ['Que nous apprend cette histoire, pour les hindous ?', 'Le bien est plus fort que le mal', ['Il faut avoir peur de la mer', 'Les singes sont paresseux', 'Il ne faut jamais voyager'], 'Le Ramayana est l’un des plus longs poèmes du monde.']] },

    { cle: 'diwali', titre: 'Diwali : des lumières pour le retour de Rama', source: 'Le Ramayana',
      texte: ['Les hindous racontent qu’après avoir libéré Sita, Rama est enfin rentré chez lui, à Ayodhya, après quatorze années d’absence.',
        "La nuit était sans lune. Pour l'accueillir et lui montrer le chemin, les habitants ont allumé des milliers de petites lampes à huile.",
        "C'est pour cela qu'à Diwali, la fête des lumières, on allume des diyas partout dans la maison et dans les rues.",
        'On fait aussi de grands dessins colorés devant la porte, les rangolis, on partage des sucreries, et on fait de beaux feux d’artifice.',
        'Diwali fête la victoire de la lumière sur l’obscurité.'],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 0.8], ['ville', 0, 0, 1], ['diyas', 160, 168, 1], ['rangoli', 90, 180, 1], ['feuArtifice', 240, 50, 1]],
      personnages: [[255, 160, 0.7, '#e8873a', 'voile'], [215, 165, 0.5, '#c0392b', 'enfant']],
      questions: [
        ['Pourquoi allume-t-on des lampes à Diwali ?', 'Pour fêter le retour de Rama', ['Parce qu’il y a une panne', 'Pour faire peur aux animaux', 'Pour sécher le linge'], 'Diwali vient d’un mot qui veut dire « rangée de lampes ».'],
        ["Combien d'années Rama est-il resté loin de chez lui ?", '14 ans', ['1 an', '5 ans', '100 ans'], 'Diwali dure souvent cinq jours.'],
        ["Comment s'appellent les dessins colorés devant la porte ?", 'Les rangolis', ['Les mandalas de sable', 'Les graffitis', 'Les mosaïques'], 'On les fait avec des poudres colorées, du riz ou des pétales.']] },

    { cle: 'krishna-beurre', titre: 'Krishna, le petit voleur de beurre', source: 'Bhagavata Purana',
      texte: ['Les hindous racontent que Krishna, quand il était petit, vivait dans un village de bergers, chez sa maman Yashoda.',
        'Il adorait le beurre ! Les mamans du village suspendaient les pots de beurre très haut, pour qu’il ne les attrape pas.',
        'Mais Krishna et ses amis grimpaient les uns sur les autres pour les atteindre… et ils partageaient le beurre avec les singes !',
        'Yashoda le grondait, mais personne ne pouvait rester fâché longtemps contre ce petit garçon si joyeux.',
        "Pour les hindous, Krishna est un dieu plein d'amour. On fête sa naissance à Janmashtami : dans certaines villes, des pyramides de jeunes gens attrapent un pot suspendu très haut !"],
      decor: [['jour', 0, 0, 1], ['soleil', 270, 40, 0.8], ['maison', 90, 150, 1.2], ['potSuspendu', 200, 40, 1], ['singe', 255, 150, 0.6], ['vache', 40, 150, 0.7]],
      personnages: [],
      questions: [
        ['Qu’est-ce que le petit Krishna adorait ?', 'Le beurre', ['Le chocolat', 'Les bonbons', 'La soupe'], 'On l’appelle parfois « Makhan chor » : le voleur de beurre.'],
        ['Avec qui partageait-il le beurre ?', 'Avec ses amis et les singes', ['Avec personne', 'Avec les poissons', 'Avec le roi'], 'Krishna joue aussi de la flûte.'],
        ["Comment s'appelle la fête de la naissance de Krishna ?", 'Janmashtami', ['Diwali', 'Holi', 'Vesak'], 'Ce jour-là, on décore souvent un petit berceau.']] },

    { cle: 'krishna-montagne', titre: 'Krishna et la montagne-parapluie', source: 'Bhagavata Purana',
      texte: ['Les hindous racontent qu’un jour, une pluie terrible s’est abattue sur le village de Krishna. Elle ne s’arrêtait plus !',
        'Les bergers, les enfants et les vaches avaient peur : tout allait être inondé.',
        "Alors Krishna, encore un jeune garçon, a soulevé la colline de Govardhan du bout d'un seul doigt, comme un immense parapluie.",
        'Tout le village s’est abrité dessous pendant sept jours, jusqu’à ce que la pluie s’arrête.',
        'Pour les hindous, cette histoire montre que Krishna protège ceux qui lui font confiance.'],
      decor: [['orage', 0, 0, 1], ['nuageOrage', 70, 30, 1], ['nuageOrage', 240, 25, 1], ['pluie', 0, 0, 1], ['montagneLevee', 160, 70, 1], ['vache', 110, 150, 0.7], ['vache', 215, 152, 0.6]],
      personnages: [[150, 155, 0.6, '#8a6a3a'], [180, 158, 0.5, '#b0603a', 'enfant']],
      questions: [
        ['Que soulève Krishna ?', 'Une colline', ['Un éléphant', 'Une maison', 'Un arbre'], 'Cette colline s’appelle Govardhan.'],
        ['Combien de jours le village reste-t-il à l’abri ?', '7 jours', ['1 jour', '3 jours', '100 jours'], 'Chaque année, une fête rappelle cette histoire, juste après Diwali.']] },
  ],

  // Selon les traditions bouddhistes. Le prince Siddhartha n'est dessiné que si la famille l'a choisi.
  bouddhisme: [
    { cle: 'siddhartha', titre: 'Le prince Siddhartha sort du palais', source: 'Vie du Bouddha',
      texte: ["Les bouddhistes racontent qu'il y a environ 2 500 ans, un prince nommé Siddhartha vivait dans un magnifique palais.",
        'Son père voulait qu’il ne voie jamais rien de triste. Siddhartha avait tout : de beaux jardins, des habits, de la musique.',
        'Un jour, il sortit du palais. Il vit une personne très âgée, une personne malade, des gens en deuil, puis un sage qui méditait, calme et paisible.',
        'Siddhartha comprit que la vieillesse et la maladie touchent tout le monde, même les princes.',
        'Il décida de quitter le palais pour chercher comment aider les êtres à moins souffrir.'],
      decor: [['jour', 0, 0, 1], ['palais', 90, 150, 1], ['chemin', 0, 0, 1], ['arbre', 270, 150, 0.9], ['lotus', 200, 172, 1]],
      personnages: [[175, 155, 0.8, '#e8c24a', 'couronne'], [250, 160, 0.6, '#d0702a', 'assis']],
      questions: [
        ['Où vivait le prince Siddhartha ?', 'Dans un magnifique palais', ['Dans une grotte', 'Sur un bateau', 'Dans une cabane'], 'Siddhartha deviendra le Bouddha.'],
        ['Que découvre Siddhartha en sortant ?', 'Que la vieillesse et la maladie touchent tout le monde', ['Que la ville est vide', 'Qu’il neige', 'Que tout le monde est riche'], 'Les bouddhistes appellent cela les « quatre rencontres ».'],
        ['Pourquoi quitte-t-il le palais ?', 'Pour chercher comment moins souffrir', ['Pour aller à la plage', 'Pour devenir plus riche', 'Parce qu’il s’ennuyait'], 'Il avait environ 29 ans.']] },

    { cle: 'eveil', titre: "L'éveil sous l'arbre", source: 'Vie du Bouddha',
      texte: ['Les bouddhistes racontent que Siddhartha a cherché pendant des années, en méditant et en mangeant très peu.',
        'Il comprit que se priver de tout ne l’aidait pas : il fallait un chemin du milieu, ni trop ni trop peu.',
        'Il s’assit sous un grand figuier et promit de rester là jusqu’à ce qu’il comprenne.',
        'Après une longue nuit de méditation, au lever du jour, il devint le Bouddha, « l’Éveillé ».',
        "Il passa ensuite le reste de sa vie à enseigner la bienveillance, la paix et l’attention à tous ceux qui voulaient l'écouter."],
      decor: [['aube', 0, 0, 1], ['soleil', 270, 80, 0.8], ['etoiles', 0, 0, 0.5], ['sycomore', 160, 150, 1], ['lotus', 60, 170, 1], ['lotus', 250, 172, 0.8]],
      personnages: [[160, 152, 0.75, '#d0702a', 'assis']],
      questions: [
        ['Sous quoi Siddhartha médite-t-il ?', 'Un grand figuier', ['Un parapluie', 'Un pont', 'Une tente'], "On l'appelle l'arbre de la Bodhi, l'arbre de l'Éveil."],
        ['Que veut dire « Bouddha » ?', "L'Éveillé", ['Le Grand', 'Le Rapide', 'Le Riche'], 'Ce n’est pas un prénom : c’est un titre.'],
        ['Qu’est-ce que le « chemin du milieu » ?', 'Ni trop, ni trop peu', ['Marcher au milieu de la route', 'Ne rien faire', 'Toujours en faire plus'], 'Les bouddhistes fêtent l’éveil du Bouddha à Vesak.']] },

    { cle: 'singes-pont', titre: 'Le roi des singes fait un pont', source: 'Contes des Jatakas',
      texte: ['Les bouddhistes racontent les Jatakas, des contes sur les vies passées du Bouddha. Dans l’un d’eux, il était le roi d’un grand groupe de singes.',
        'Ses singes vivaient dans un manguier, au bord d’une rivière. Un jour, les archers d’un roi les encerclèrent.',
        "Le roi des singes sauta par-dessus la rivière, attacha une liane à un arbre, et se fit lui-même pont, en s'accrochant à la branche avec ses mains.",
        'Les quatre-vingt mille singes traversèrent sur son dos et furent sauvés. Mais lui était épuisé et blessé.',
        "Le roi des hommes, très ému, le fit soigner. Il comprit qu'un bon chef prend soin de ceux qui comptent sur lui."],
      decor: [['jour', 0, 0, 1], ['riviere', 0, 0, 1], ['manguier', 50, 150, 1], ['arbre', 280, 150, 1], ['lianePont', 0, 0, 1], ['singe', 150, 78, 0.6], ['singe', 200, 72, 0.55], ['singe', 105, 85, 0.5]],
      personnages: [],
      questions: [
        ['Que fait le roi des singes pour sauver les autres ?', 'Il fait un pont avec son corps', ['Il se cache', 'Il appelle les éléphants', 'Il construit un bateau'], 'Les Jatakas sont plus de 500 contes !'],
        ['Que comprend le roi des hommes ?', 'Un bon chef prend soin des autres', ['Il faut chasser les singes', 'Les rivières sont dangereuses', 'Les mangues sont meilleures'], 'Dans les Jatakas, les animaux enseignent souvent la générosité.']] },

    { cle: 'singe-crocodile', titre: 'Le singe et le crocodile', source: 'Contes des Jatakas',
      texte: ['Les bouddhistes racontent qu’un singe très malin vivait près d’une rivière, et qu’il aimait sauter sur une île pour manger des fruits.',
        "Un crocodile voulait l'attraper. Il lui proposa : « Monte sur mon dos, je t'emmène sur l'île ! »",
        'Au milieu de la rivière, le crocodile avoua : « En vérité, je veux ton cœur ! » Le singe ne paniqua pas. Il répondit calmement :',
        "« Oh, quel dommage ! Je laisse toujours mon cœur accroché dans l'arbre. Ramène-moi, et je te le donnerai ! »",
        'Le crocodile le ramena… et le singe sauta dans son arbre, sain et sauf. Garder son calme aide à trouver une solution !'],
      decor: [['jour', 0, 0, 1], ['soleil', 270, 40, 0.8], ['lac', 0, 0, 1], ['manguier', 60, 150, 1], ['crocodile', 190, 175, 1], ['singe', 200, 167, 0.6]],
      personnages: [],
      questions: [
        ['Que veut le crocodile ?', 'Le cœur du singe', ['Des mangues', 'Une maison', 'Un ami pour jouer'], 'Ce conte est connu dans toute l’Asie, et même au-delà.'],
        ['Comment le singe s’en sort-il ?', 'Il garde son calme et invente une ruse', ['Il crie très fort', 'Il nage très vite', 'Il appelle sa maman'], 'Les bouddhistes cherchent à garder l’esprit calme, même quand on a peur.']] },

    { cle: 'lievre', titre: 'Le lièvre dans la lune', source: 'Contes des Jatakas',
      texte: ['Les bouddhistes racontent qu’un lièvre vivait dans la forêt avec ses amis : un singe, un chacal et une loutre.',
        'Un jour, un vieillard affamé arriva. Le singe lui apporta des fruits, le chacal du lait, la loutre des poissons.',
        "Le lièvre, lui, ne savait cueillir que de l'herbe. Il voulut tout de même offrir le plus beau des cadeaux : il proposa de se donner lui-même, et sauta vers le feu.",
        'Mais les flammes ne le brûlèrent pas : elles étaient fraîches comme la neige ! Le vieillard était en réalité un être céleste venu tester sa générosité.',
        'Pour que tout le monde se souvienne de ce cœur généreux, il dessina le lièvre sur la lune. Regarde la pleine lune : tu le verras peut-être !'],
      decor: [['nuit', 0, 0, 1], ['etoiles', 0, 0, 1], ['pleineLune', 240, 55, 1], ['arbre', 50, 150, 1], ['feu', 160, 158, 1], ['lievre', 120, 158, 1]],
      personnages: [],
      questions: [
        ['Avec qui vivait le lièvre ?', 'Un singe, un chacal et une loutre', ['Un lion et un tigre', 'Des poules', 'Personne'], 'Ce conte enseigne la générosité.'],
        ['Où voit-on le lièvre, à la fin ?', 'Sur la lune', ['Dans la mer', 'Sous la terre', 'Dans un arbre'], 'Au Japon et en Chine aussi, on raconte qu’un lapin vit sur la lune !']] },
  ],

};

// Les 2 ou 3 questions d'une histoire, dans l'ordre. 7 ans et moins : 3 choix ; sinon 4.
export function questions(recit, age, aleatoire = Math.random) {
  return recit.questions.map(([texte, bonne, autres, savaisTu]) => ({
    mode: 'choix', texte, titre: texte, consigne: texte, reponse: bonne, savaisTu, solution: `La bonne réponse : ${bonne}.`,
    choix: melanger([bonne, ...melanger(autres, aleatoire).slice(0, age <= 7 ? 2 : 3)], aleatoire),
  }));
}

export const texteALire = (recit) => `${recit.titre}. ${recit.texte.join(' ')}`;

// ---------- Dessins (viewBox 0 0 320 200, le sol vers y = 150) ----------
const FONDS = {
  jour: ['#9fdcf5', '#e4f6ff', '#8fd16a'], nuit: ['#1d2a5a', '#3a4a8a', '#4a6a3a'], desert: ['#ffd9a0', '#fff1d6', '#e8c27a'],
  orage: ['#4a5568', '#7a8598', '#3a6a8a'], aube: ['#ffb38a', '#ffe6c4', '#8fc16a'], interieur: ['#e9d9bd', '#f6ecd8', '#b98a58'],
};
const ciel = ([haut, bas, sol], id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient></defs>
  <rect width="320" height="200" fill="url(#${id})"/><rect y="150" width="320" height="50" fill="${sol}"/>`;
const g = (x, y, s, contenu) => `<g transform="translate(${x} ${y}) scale(${s})">${contenu}</g>`;

// Chaque élément : (x, y, s, variante) → SVG. Uniquement des décors, des objets, des animaux. Rien qui représente Dieu.
const ELEMENTS = {
  soleil: (x, y, s) => g(x, y, s, '<circle r="26" fill="#ffd84a" opacity=".35"/><circle r="18" fill="#ffd84a"/>'),
  lune: (x, y, s) => g(x, y, s, '<path d="M8 -16 A18 18 0 1 0 8 16 A14 14 0 1 1 8 -16Z" fill="#fff4c2"/>'),
  etoiles: (x, y, s) => [[30, 25], [90, 15], [130, 40], [200, 20], [240, 50], [300, 25], [60, 60], [170, 65]]
    .map(([a, b]) => `<circle cx="${a}" cy="${b}" r="${1.6 * s}" fill="#fff8d0"/>`).join(''),
  etoileBrillante: (x, y, s) => g(x, y, s, `<path d="M0 -16 L4 -4 L16 0 L4 4 L0 22 L-4 4 L-16 0 L-4 -4Z" fill="#ffe680"/><circle r="5" fill="#fff"/>`),
  nuage: (x, y, s) => g(x, y, s, '<ellipse rx="30" ry="12" fill="#fff"/><ellipse cx="-14" cy="-8" rx="16" ry="12" fill="#fff"/><ellipse cx="10" cy="-10" rx="18" ry="13" fill="#fff"/>'),
  nuageOrage: (x, y, s) => g(x, y, s, '<ellipse rx="36" ry="14" fill="#5a6070"/><ellipse cx="-16" cy="-9" rx="20" ry="14" fill="#5a6070"/><ellipse cx="12" cy="-12" rx="22" ry="15" fill="#666d7e"/>'),
  eclair: (x, y, s) => g(x, y, s, '<path d="M0 0 L-10 22 L-2 22 L-8 42 L10 14 L2 14 L8 0Z" fill="#ffe14a"/>'),
  arcenciel: (x, y, s) => g(x, y, s, ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#8e44ad']
    .map((c, i) => `<path d="M${-130 + i * 7} 0 A${130 - i * 7} ${110 - i * 7} 0 0 1 ${130 - i * 7} 0" fill="none" stroke="${c}" stroke-width="7"/>`).join('')),
  mer: () => '<rect y="145" width="320" height="55" fill="#2a8fc0"/><path d="M0 150 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#bfe6ff" stroke-width="3"/>',
  lac: () => '<path d="M0 168 Q160 150 320 168 V200 H0Z" fill="#3aa0d0"/>',
  riviere: () => '<path d="M0 182 Q90 168 160 180 T320 176 V190 Q240 186 160 192 T0 196Z" fill="#5ab8e0"/>',
  merOuverte: (x, y, s) => g(x, y, s, `<rect x="-160" y="-60" width="135" height="110" fill="#2a8fc0"/><rect x="25" y="-60" width="135" height="110" fill="#2a8fc0"/>
    <path d="M-25 -60 q-8 20 0 40 t0 40 t0 30 M25 -60 q8 20 0 40 t0 40 t0 30" fill="none" stroke="#bfe6ff" stroke-width="4"/>
    <path d="M-25 50 L-10 -60 H10 L25 50Z" fill="#e8c27a"/>`),
  collines: () => '<path d="M0 150 Q60 100 130 140 T260 120 T320 135 V150 H0Z" fill="#7cc35a"/>',
  champ: () => '<rect y="150" width="320" height="50" fill="#a07a4a"/><path d="M0 170 H320 M0 185 H320" stroke="#8a6a3a" stroke-width="3"/>',
  route: () => '<path d="M-10 200 Q140 165 330 158 V170 Q150 178 40 200Z" fill="#d8b884"/>',
  chemin: () => '<path d="M60 200 Q160 165 250 152 L262 156 Q180 172 110 200Z" fill="#e0c79a"/>',
  ville: () => ['#e8d4a8', '#d8c094', '#efdcb4', '#d0b080'].map((c, i) => `<rect x="${i * 80}" y="${95 + (i % 2) * 15}" width="70" height="${55 - (i % 2) * 15}" fill="${c}"/><rect x="${i * 80 + 25}" y="${120}" width="14" height="18" fill="#7a5a3a"/>`).join(''),
  guirlande: () => '<path d="M0 20 Q80 50 160 20 T320 20" fill="none" stroke="#c9a227" stroke-width="2"/>' + [40, 100, 160, 220, 280].map((a, i) => `<circle cx="${a}" cy="${i % 2 ? 36 : 30}" r="5" fill="${['#e74c3c', '#f1c40f', '#3498db'][i % 3]}"/>`).join(''),
  fenetreNuit: (x, y, s) => g(x, y, s, '<rect x="-24" y="-30" width="48" height="56" rx="24" fill="#1d2a5a" stroke="#b98a58" stroke-width="4"/><circle cx="-8" cy="-10" r="1.6" fill="#fff"/><circle cx="9" cy="2" r="1.6" fill="#fff"/><circle cx="0" cy="-18" r="1.3" fill="#fff"/>'),
  colonne: (x, y, s) => g(x, y, s, '<rect x="-10" y="-150" width="20" height="150" fill="#f4ead8"/><rect x="-14" y="-150" width="28" height="8" fill="#d8c3a0"/><rect x="-14" y="-8" width="28" height="8" fill="#d8c3a0"/>'),
  lampe: (x, y, s) => g(x, y, s, '<circle cy="-14" r="16" fill="#ffd84a" opacity=".35"/><path d="M-14 0 Q0 8 14 0 L18 -4 H-12Z" fill="#c98a3a"/><path d="M0 -6 Q-5 -14 0 -22 Q5 -14 0 -6Z" fill="#ff9a3c"/><rect x="-4" y="0" width="8" height="22" fill="#9a6a3a"/>'),
  lit: (x, y, s) => g(x, y, s, '<rect x="-40" y="-16" width="80" height="16" rx="3" fill="#9a6a3a"/><rect x="-40" y="-22" width="70" height="8" rx="3" fill="#f4ead8"/><ellipse cx="30" cy="-22" rx="10" ry="6" fill="#fff"/>'),
  table: (x, y, s) => g(x, y, s, '<rect x="-55" y="-34" width="110" height="8" fill="#9a6a3a"/><rect x="-50" y="-26" width="6" height="26" fill="#7a4a30"/><rect x="44" y="-26" width="6" height="26" fill="#7a4a30"/><circle cx="-25" cy="-40" r="6" fill="#e8873a"/><circle cx="10" cy="-40" r="6" fill="#c0392b"/><path d="M30 -46 h10 l-2 12 h-6Z" fill="#8a2a4a"/>'),
  jarres: (x, y, s) => g(x, y, s, [-45, -27, -9, 9, 27, 45].map((a) => `<path d="M${a - 7} 0 Q${a - 11} -18 ${a - 5} -30 H${a + 5} Q${a + 11} -18 ${a + 7} 0Z" fill="#b8a080" stroke="#8a7050" stroke-width="1.5"/><ellipse cx="${a}" cy="-30" rx="5" ry="2" fill="#8a2a4a"/>`).join('')),
  arbre: (x, y, s) => g(x, y, s, '<rect x="-5" y="-40" width="10" height="40" fill="#7a4a30"/><circle cy="-50" r="24" fill="#4a9a4a"/><circle cx="-14" cy="-40" r="14" fill="#5aaa52"/><circle cx="14" cy="-42" r="15" fill="#5aaa52"/>'),
  sycomore: (x, y, s) => g(x, y, s, '<path d="M-8 0 L-6 -50 L-30 -70 M-6 -50 L20 -72 M0 0 L-2 -60" stroke="#7a4a30" stroke-width="10" stroke-linecap="round" fill="none"/><ellipse cy="-82" rx="62" ry="30" fill="#4a9a4a"/><ellipse cx="-30" cy="-70" rx="26" ry="16" fill="#5aaa52"/><ellipse cx="34" cy="-72" rx="26" ry="16" fill="#5aaa52"/>'),
  palmier: (x, y, s) => g(x, y, s, '<path d="M0 0 Q4 -30 0 -60" stroke="#8a5a30" stroke-width="7" fill="none"/>' + [-60, -20, 20, 60, 100, 140].map((a) => `<path d="M0 -60 q${Math.cos(a * Math.PI / 180) * 18} -10 ${Math.cos(a * Math.PI / 180) * 34} ${Math.sin(a * Math.PI / 180) * 14 + 6}" stroke="#3a9a4a" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')),
  fleurs: (x, y, s) => g(x, y, s, [[0, '#e74c3c'], [14, '#f1c40f'], [28, '#e86fa8'], [42, '#fff']].map(([a, c]) => `<path d="M${a} 0 V-12" stroke="#3a8a3a" stroke-width="2"/><circle cx="${a}" cy="-14" r="4" fill="${c}"/>`).join('')),
  epis: (x, y, s) => g(x, y, s, [-20, -8, 4, 16, 28].map((a) => `<path d="M${a} 0 V-34" stroke="#c9a227" stroke-width="2"/><ellipse cx="${a}" cy="-38" rx="4" ry="9" fill="#e8c24a"/>`).join('')),
  epines: (x, y, s) => g(x, y, s, '<ellipse cy="-12" rx="28" ry="14" fill="#5a7a3a"/><path d="M-24 -18 l-6 -6 M-10 -24 l-2 -8 M6 -25 l3 -8 M20 -20 l7 -5 M28 -10 l8 -2" stroke="#3a4a2a" stroke-width="2"/>'),
  pierres: (x, y, s) => g(x, y, s, '<ellipse rx="7" ry="5" fill="#9a9a9a"/><ellipse cx="14" cy="2" rx="6" ry="4" fill="#b0b0b0"/><ellipse cx="-12" cy="3" rx="5" ry="4" fill="#8a8a8a"/><ellipse cx="4" cy="-6" rx="5" ry="4" fill="#a8a8a8"/><ellipse cx="24" cy="-3" rx="4" ry="3" fill="#999"/>'),
  fronde: (x, y, s) => g(x, y, s, '<path d="M-20 -30 Q-10 -6 0 -10 Q10 -6 20 -30" fill="none" stroke="#7a4a30" stroke-width="2"/><ellipse cy="-10" rx="6" ry="4" fill="#9a7a5a"/>'),
  tente: (x, y, s) => g(x, y, s, '<path d="M-50 0 L0 -50 L50 0Z" fill="#c8a070"/><path d="M-50 0 L0 -50 L-20 0Z" fill="#b08858"/><path d="M-6 0 L0 -26 L6 0Z" fill="#5a3a20"/>'),
  maison: (x, y, s) => g(x, y, s, '<rect x="-34" y="-46" width="68" height="46" fill="#efdcb4"/><rect x="-38" y="-52" width="76" height="8" fill="#c8a070"/><rect x="-8" y="-24" width="16" height="24" fill="#7a5a3a"/><rect x="14" y="-38" width="12" height="10" fill="#7a5a3a"/>'),
  auberge: (x, y, s) => g(x, y, s, '<rect x="-40" y="-56" width="80" height="56" fill="#efdcb4"/><rect x="-44" y="-62" width="88" height="8" fill="#c8a070"/><rect x="-10" y="-28" width="20" height="28" fill="#7a5a3a"/><rect x="-30" y="-46" width="12" height="10" fill="#ffd84a"/><rect x="18" y="-46" width="12" height="10" fill="#ffd84a"/>'),
  pyramide: (x, y, s) => g(x, y, s, '<path d="M-60 0 L0 -70 L60 0Z" fill="#e0b870"/><path d="M0 -70 L60 0 L20 0Z" fill="#c89a50"/>'),
  etable: (x, y, s) => g(x, y, s, '<rect x="-80" y="-70" width="160" height="70" fill="#8a5a30"/><path d="M-92 -66 L0 -100 L92 -66Z" fill="#6a3a20"/><rect x="-66" y="-58" width="132" height="58" fill="#f0d8a8"/><path d="M-66 0 L-50 -8 L-30 0 L-10 -6 L10 0 L30 -7 L50 0 L66 -6 V0Z" fill="#e8c24a"/>'),
  mangeoire: (x, y, s) => g(x, y, s, '<path d="M-20 -14 L20 -14 L14 0 H-14Z" fill="#9a6a3a"/><path d="M-20 -14 Q-10 -20 0 -16 Q10 -20 20 -14" fill="#e8c24a"/>'),
  fosse: (x, y, s) => g(x, y, s, '<rect x="-160" y="-5" width="320" height="55" fill="#8a6a4a"/><path d="M-160 -5 Q-120 -14 -80 -6 T0 -8 T80 -6 T160 -10 V0 H-160Z" fill="#6a5038"/>'),
  aube: () => '',
  tombeau: (x, y, s) => g(x, y, s, '<path d="M-70 0 Q-70 -70 0 -76 Q70 -70 70 0Z" fill="#9a8a7a"/><ellipse cx="-10" cy="-22" rx="18" ry="22" fill="#2a2420"/><circle cx="40" cy="-22" r="22" fill="#b0a090" stroke="#8a7a6a" stroke-width="3"/>'),
  arche: (x, y, s) => g(x, y, s, '<path d="M-90 -20 H90 L70 6 H-70Z" fill="#8a5a30"/><rect x="-60" y="-50" width="120" height="30" fill="#a8703a"/><path d="M-68 -50 L0 -72 L68 -50Z" fill="#6a3a20"/><rect x="-50" y="-42" width="12" height="10" fill="#4a2a10"/><rect x="38" y="-42" width="12" height="10" fill="#4a2a10"/><path d="M-90 -12 H90" stroke="#6a3a20" stroke-width="2"/>'),
  bateau: (x, y, s) => g(x, y, s, '<path d="M-40 0 H40 L28 16 H-28Z" fill="#8a5a30"/><path d="M0 0 V-50" stroke="#5a3a20" stroke-width="3"/><path d="M2 -48 L32 -10 H2Z" fill="#f4ead8"/>'),
  barque: (x, y, s) => g(x, y, s, '<path d="M-60 -6 H60 L44 14 H-44Z" fill="#8a5a30"/><path d="M-60 -6 H60" stroke="#6a3a20" stroke-width="3"/>'),
  grandPoisson: (x, y, s) => g(x, y, s, '<ellipse rx="70" ry="26" fill="#4a6a9a"/><path d="M62 0 L98 -22 L94 0 L98 22Z" fill="#4a6a9a"/><ellipse cy="8" rx="56" ry="14" fill="#7a9aca"/><circle cx="-46" cy="-8" r="5" fill="#fff"/><circle cx="-47" cy="-8" r="2.4" fill="#1a2a3a"/><path d="M-70 4 Q-58 10 -48 6" stroke="#2a3a5a" stroke-width="2" fill="none"/>'),
  poissons: (x, y, s) => g(x, y, s, [[0, 0], [24, 6]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="10" ry="5" fill="#9ab0c8"/><path d="M${a + 8} ${b} l8 -5 v10Z" fill="#9ab0c8"/><circle cx="${a - 5}" cy="${b - 1}" r="1.2" fill="#1a2a3a"/>`).join('')),
  pains: (x, y, s) => g(x, y, s, [-16, -8, 0, 8, 16].map((a, i) => `<ellipse cx="${a}" cy="${i % 2 ? -4 : 0}" rx="7" ry="5" fill="#d9a04a" stroke="#a8702a"/>`).join('')),
  panier: (x, y, s) => g(x, y, s, '<path d="M-24 -10 H24 L18 10 H-18Z" fill="#c09050"/><path d="M-24 -10 H24 M-20 -2 H20 M-18 5 H18" stroke="#9a6a30" stroke-width="2"/><path d="M-18 -10 Q0 -32 18 -10" fill="none" stroke="#9a6a30" stroke-width="3"/>'),
  tunique: (x, y, s) => g(x, y, s, '<path d="M-14 -24 L-28 -14 L-22 -6 L-14 -12 L-16 20 H16 L14 -12 L22 -6 L28 -14 L14 -24 Q0 -18 -14 -24Z" fill="#e74c3c"/><path d="M-15 -8 H15" stroke="#f1c40f" stroke-width="5"/><path d="M-15 2 H15" stroke="#2ecc71" stroke-width="5"/><path d="M-16 12 H16" stroke="#3498db" stroke-width="5"/>'),
  bague: (x, y, s) => g(x, y, s, '<circle r="12" fill="none" stroke="#e8c24a" stroke-width="5"/><path d="M-6 -14 L0 -22 L6 -14Z" fill="#7ad0f0"/>'),
  oiseau: (x, y, s, v) => g(x, y, s, `<path d="M-12 0 Q-6 -8 0 0 Q6 -8 12 0" fill="none" stroke="${v === 'colombe' ? '#fff' : '#3a3a4a'}" stroke-width="3"/>${v === 'colombe' ? '<path d="M10 -2 l8 -2 l-2 4" stroke="#3a9a4a" stroke-width="2" fill="none"/>' : ''}`),
  brebis: (x, y, s, v) => g(x, y, s, `<ellipse cy="-18" rx="20" ry="13" fill="#fff" stroke="#ddd"/><circle cx="18" cy="-24" r="7" fill="#3a3a3a"/>${v === 'epaules' ? '' : '<path d="M-10 -6 V2 M10 -6 V2" stroke="#3a3a3a" stroke-width="3"/>'}`),
  ane: (x, y, s) => g(x, y, s, '<ellipse cy="-30" rx="28" ry="14" fill="#9a8a7a"/><path d="M22 -36 L34 -54 L42 -50 L32 -32Z" fill="#9a8a7a"/><path d="M34 -54 l-2 -10 M40 -52 l2 -10" stroke="#7a6a5a" stroke-width="3"/><path d="M-18 -18 V0 M-6 -18 V0 M10 -18 V0 M20 -18 V0" stroke="#7a6a5a" stroke-width="4"/>'),
  lion: (x, y, s) => g(x, y, s, '<ellipse cy="-24" rx="30" ry="14" fill="#e0a840"/><circle cx="-28" cy="-34" r="18" fill="#b8742a"/><circle cx="-28" cy="-34" r="11" fill="#e0a840"/><circle cx="-32" cy="-36" r="1.6" fill="#2a1a0a"/><circle cx="-24" cy="-36" r="1.6" fill="#2a1a0a"/><path d="M-30 -30 q2 2 4 0" stroke="#2a1a0a" fill="none"/><path d="M-20 -12 V0 M-8 -12 V0 M10 -12 V0 M20 -12 V0" stroke="#c88a30" stroke-width="5"/><path d="M28 -26 q12 -2 12 -14" stroke="#c88a30" stroke-width="3" fill="none"/>'),
  temple: (x, y, s) => g(x, y, s, '<rect x="-80" y="-60" width="160" height="60" fill="#efe2c4"/><path d="M-90 -58 H90 L80 -72 H-80Z" fill="#d8c094"/>' + [-60, -30, 30, 60].map((a) => `<rect x="${a - 5}" y="-56" width="10" height="56" fill="#f8efd8"/>`).join('') + '<rect x="-14" y="-30" width="28" height="30" fill="#7a5a3a"/>'),
  menorah: (x, y, s) => g(x, y, s, '<rect x="-3" y="-30" width="6" height="34" fill="#c9a227"/><rect x="-16" y="4" width="32" height="5" rx="2" fill="#c9a227"/>' + [-32, -24, -16, -8, 0, 8, 16, 24, 32].map((a) => `<path d="M${a} -30 V${a === 0 ? -42 : -34}" stroke="#c9a227" stroke-width="3"/><path d="M${a} ${a === 0 ? -44 : -36} q-3 -6 0 -10 q3 4 0 10Z" fill="#ff9a3c"/>`).join('') + '<path d="M-32 -30 Q0 -10 32 -30" fill="none" stroke="#c9a227" stroke-width="3"/>'),
  fiole: (x, y, s) => g(x, y, s, '<path d="M-6 0 Q-12 -14 -4 -22 V-30 H4 V-22 Q12 -14 6 0Z" fill="#c8e0a0" stroke="#7a9a4a" stroke-width="1.5"/><rect x="-5" y="-34" width="10" height="5" fill="#8a6a3a"/>'),
  trone: (x, y, s) => g(x, y, s, '<rect x="-24" y="-70" width="48" height="70" rx="4" fill="#c9a227"/><rect x="-18" y="-40" width="36" height="20" fill="#b03a3a"/>'),
  matsa: (x, y, s) => g(x, y, s, '<rect x="-24" y="-8" width="48" height="16" rx="2" fill="#f0d8a0" stroke="#c8a060"/><path d="M-18 -4 h36 M-18 0 h36 M-18 4 h36" stroke="#c8a060" stroke-dasharray="2 3"/>'),
  roseaux: (x, y, s) => g(x, y, s, [-12, -4, 4, 12].map((a) => `<path d="M${a} 0 Q${a - 2} -20 ${a + 2} -40" stroke="#5a8a3a" stroke-width="3" fill="none"/><ellipse cx="${a + 2}" cy="-40" rx="2.5" ry="7" fill="#8a5a30"/>`).join('')),
  corbeille: (x, y, s) => g(x, y, s, '<path d="M-22 -10 H22 Q20 6 0 8 Q-20 6 -22 -10Z" fill="#c09050" stroke="#8a6030" stroke-width="2"/><path d="M-20 -4 H20" stroke="#8a6030"/>'),
  rouleau: (x, y, s) => g(x, y, s, '<rect x="-30" y="-16" width="60" height="32" fill="#f8efd8"/><rect x="-36" y="-22" width="8" height="44" rx="4" fill="#8a5a30"/><rect x="28" y="-22" width="8" height="44" rx="4" fill="#8a5a30"/><path d="M-22 -8 h44 M-22 -2 h44 M-22 4 h36 M-22 10 h40" stroke="#5a4a3a" stroke-width="1.5"/>'),
  montagne: (x, y, s) => g(x, y, s, '<path d="M-80 0 L-10 -90 L10 -70 L60 -40 L90 0Z" fill="#9a8a7a"/><path d="M-10 -90 L5 -72 L-20 -70Z" fill="#fff"/>'),
  grotte: (x, y, s) => g(x, y, s, '<ellipse cx="-10" cy="-18" rx="14" ry="16" fill="#2a2420"/>'),
  soleilCouchant: (x, y, s) => g(x, y, s, '<path d="M-26 0 A26 26 0 0 1 26 0Z" fill="#ff9a3c"/>'),
  croissant: (x, y, s) => g(x, y, s, '<path d="M4 -16 A16 16 0 1 0 4 16 A12 12 0 1 1 4 -16Z" fill="#fff4c2"/>'),
  pleineLune: (x, y, s) => g(x, y, s, '<circle r="34" fill="#fff4c2"/><path d="M-10 4 q-6 -16 2 -20 q4 -2 4 6 q8 -4 10 6 q4 10 -6 14 q-8 2 -10 -6Z" fill="#e6d8a0"/>'),
  dattes: (x, y, s) => g(x, y, s, '<ellipse cy="0" rx="24" ry="6" fill="#d8c094"/>' + [-14, -5, 4, 13].map((a, i) => `<ellipse cx="${a}" cy="${-5 - (i % 2) * 3}" rx="5" ry="3" fill="#7a3a1a"/>`).join('')),
  lanterne: (x, y, s) => g(x, y, s, '<path d="M0 -40 V-30" stroke="#8a6a3a" stroke-width="2"/><path d="M-10 -30 H10 L14 -10 L10 6 H-10 L-14 -10Z" fill="#c9a227"/><path d="M-8 -26 H8 L10 -10 L8 2 H-8 L-10 -10Z" fill="#ffe680"/>'),
  plante: (x, y, s) => g(x, y, s, '<path d="M0 0 V-30" stroke="#3a8a3a" stroke-width="3"/><ellipse cx="-14" cy="-30" rx="16" ry="8" fill="#5aaa52"/><ellipse cx="14" cy="-36" rx="16" ry="8" fill="#4a9a4a"/>'),
  fourmiliere: (x, y, s) => g(x, y, s, '<path d="M-30 0 Q0 -30 30 0Z" fill="#b08858"/><ellipse cy="-4" rx="5" ry="3" fill="#5a3a20"/>'),
  fourmis: (x, y, s) => g(x, y, s, [0, 16, 32, 48].map((a) => `<g transform="translate(${a} ${a % 32 ? -3 : 0})"><circle r="2.5" fill="#2a1a10"/><circle cx="4" r="2" fill="#2a1a10"/><circle cx="-4" r="3" fill="#2a1a10"/></g>`).join('')),
  drapeaux: (x, y, s) => g(x, y, s, [0, 1, 2].map((i) => `<path d="M${i * 20} 0 V-40" stroke="#5a4a3a" stroke-width="2"/><path d="M${i * 20} -40 l14 5 l-14 5Z" fill="${['#2bb3a0', '#c9a227', '#c0392b'][i]}"/>`).join('')),
  paon: (x, y, s) => g(x, y, s, '<path d="M0 0 Q-30 -30 -40 0 Q-30 20 0 0Z" fill="#2a8a7a"/><circle cx="-24" cy="-4" r="3" fill="#2a4aa0"/><circle cx="-32" cy="4" r="3" fill="#2a4aa0"/><ellipse cx="6" cy="0" rx="10" ry="6" fill="#2a4aa0"/><path d="M14 -2 V-12" stroke="#2a4aa0" stroke-width="3"/><circle cx="14" cy="-14" r="3" fill="#2a4aa0"/>'),
  souris: (x, y, s) => g(x, y, s, '<ellipse cy="-6" rx="12" ry="7" fill="#9a8a8a"/><circle cx="12" cy="-9" r="5" fill="#9a8a8a"/><circle cx="12" cy="-14" r="3" fill="#c8a0a0"/><circle cx="14" cy="-9" r="1" fill="#1a1a1a"/><path d="M-12 -6 q-10 -2 -14 4" stroke="#9a8a8a" stroke-width="2" fill="none"/>'),
  mangue: (x, y, s) => g(x, y, s, '<ellipse rx="10" ry="13" fill="#f0a020" transform="rotate(20)"/><path d="M2 -12 q4 -6 10 -6" stroke="#3a8a3a" stroke-width="3" fill="none"/>'),
  lotus: (x, y, s) => g(x, y, s, '<ellipse cy="2" rx="18" ry="4" fill="#3a9a5a"/><path d="M0 0 Q-10 -10 0 -22 Q10 -10 0 0Z M0 0 Q-20 -6 -16 -16 Q-6 -10 0 0Z M0 0 Q20 -6 16 -16 Q6 -10 0 0Z" fill="#f4a0c0"/>'),
  pont: (x, y, s) => g(x, y, s, '<path d="M-110 0 Q0 -14 110 0 V6 Q0 -8 -110 6Z" fill="#9a8a7a"/>' + [-90, -60, -30, 0, 30, 60, 90].map((a) => `<ellipse cx="${a}" cy="${-4 + Math.abs(a) / 30}" rx="12" ry="5" fill="#b0a090" stroke="#7a6a5a"/>`).join('')),
  ile: (x, y, s) => g(x, y, s, '<ellipse rx="44" ry="12" fill="#e8c27a"/><path d="M-10 -6 V-40" stroke="#8a5a30" stroke-width="5"/><ellipse cx="-10" cy="-42" rx="22" ry="8" fill="#3a9a4a"/>'),
  singe: (x, y, s) => g(x, y, s, '<ellipse cy="-14" rx="10" ry="12" fill="#8a5a30"/><circle cy="-32" r="9" fill="#8a5a30"/><ellipse cy="-30" rx="6" ry="5" fill="#e0b48a"/><circle cx="-3" cy="-33" r="1.2" fill="#1a1a1a"/><circle cx="3" cy="-33" r="1.2" fill="#1a1a1a"/><path d="M10 -10 q14 0 12 -18" stroke="#8a5a30" stroke-width="3" fill="none"/>'),
  diyas: (x, y, s) => g(x, y, s, [-60, -30, 0, 30, 60].map((a) => `<path d="M${a - 10} 0 Q${a} 8 ${a + 10} 0Z" fill="#c0603a"/><path d="M${a} -2 q-4 -8 0 -14 q4 6 0 14Z" fill="#ffb02a"/><circle cx="${a}" cy="-8" r="10" fill="#ffd84a" opacity=".25"/>`).join('')),
  rangoli: (x, y, s) => g(x, y, s, '<ellipse rx="30" ry="10" fill="#e74c3c"/><ellipse rx="22" ry="7" fill="#f1c40f"/><ellipse rx="13" ry="4" fill="#3498db"/><ellipse rx="5" ry="2" fill="#fff"/>'),
  feuArtifice: (x, y, s) => g(x, y, s, Array.from({ length: 12 }, (_, i) => `<path d="M0 0 L${(Math.cos(i * Math.PI / 6) * 22).toFixed(1)} ${(Math.sin(i * Math.PI / 6) * 22).toFixed(1)}" stroke="${['#f1c40f', '#e86fa8', '#7ad0f0'][i % 3]}" stroke-width="3" stroke-linecap="round"/>`).join('')),
  potSuspendu: (x, y, s) => g(x, y, s, '<path d="M0 -40 V0" stroke="#8a6a3a" stroke-width="2"/><path d="M-14 4 Q-18 24 0 28 Q18 24 14 4Z" fill="#c0603a"/><ellipse cy="4" rx="14" ry="4" fill="#f4ead8"/>'),
  vache: (x, y, s) => g(x, y, s, '<ellipse cy="-28" rx="28" ry="14" fill="#f4ead8" stroke="#ccc"/><ellipse cx="-6" cy="-30" rx="8" ry="6" fill="#8a6a4a"/><ellipse cx="30" cy="-34" rx="10" ry="8" fill="#f4ead8" stroke="#ccc"/><path d="M26 -42 l-4 -6 M34 -42 l4 -6" stroke="#c9a227" stroke-width="2"/><path d="M-18 -16 V0 M-6 -16 V0 M10 -16 V0 M20 -16 V0" stroke="#bbb" stroke-width="4"/>'),
  pluie: () => Array.from({ length: 24 }, (_, i) => `<path d="M${(i * 41) % 320} ${20 + (i * 23) % 80} l-4 12" stroke="#bfe6ff" stroke-width="2"/>`).join(''),
  montagneLevee: (x, y, s) => g(x, y, s, '<path d="M-110 20 Q-60 -40 0 -46 Q60 -40 110 20Z" fill="#7a8a5a"/><path d="M-110 20 Q0 8 110 20" fill="none" stroke="#5a6a3a" stroke-width="4"/>'),
  palais: (x, y, s) => g(x, y, s, '<rect x="-60" y="-50" width="120" height="50" fill="#f4e4c4"/><path d="M-30 -50 Q-30 -80 0 -92 Q30 -80 30 -50Z" fill="#e8873a"/><path d="M-60 -50 Q-60 -64 -48 -70 Q-36 -64 -36 -50Z M36 -50 Q36 -64 48 -70 Q60 -64 60 -50Z" fill="#e8873a"/><path d="M-10 0 V-20 Q0 -30 10 -20 V0Z" fill="#7a4a30"/>'),
  manguier: (x, y, s) => g(x, y, s, '<rect x="-6" y="-50" width="12" height="50" fill="#7a4a30"/><ellipse cy="-70" rx="46" ry="30" fill="#3a8a3a"/>' + [[-20, -66], [8, -78], [24, -62], [-6, -56]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="4" ry="6" fill="#f0a020"/>`).join('')),
  lianePont: () => '<path d="M70 78 Q160 92 270 72" fill="none" stroke="#5a8a3a" stroke-width="4"/>',
  crocodile: (x, y, s) => g(x, y, s, '<path d="M-50 0 Q-20 -14 30 -8 L60 -4 L30 2 Q-20 8 -50 0Z" fill="#5a8a3a"/><path d="M-40 -6 l4 -5 l4 5 l4 -5 l4 5 l4 -5 l4 5" fill="#4a7a2a"/><circle cx="22" cy="-10" r="2" fill="#1a1a1a"/>'),
  lievre: (x, y, s) => g(x, y, s, '<ellipse cy="-12" rx="14" ry="10" fill="#c8b8a8"/><circle cx="12" cy="-20" r="7" fill="#c8b8a8"/><ellipse cx="10" cy="-34" rx="3" ry="10" fill="#c8b8a8"/><ellipse cx="16" cy="-33" rx="3" ry="10" fill="#c8b8a8"/><circle cx="15" cy="-21" r="1.2" fill="#1a1a1a"/><circle cx="-14" cy="-12" r="4" fill="#fff"/>'),
  feu: (x, y, s) => g(x, y, s, '<path d="M-20 0 H20" stroke="#7a4a30" stroke-width="5"/><path d="M-14 0 Q-16 -20 -4 -32 Q-2 -18 4 -22 Q2 -34 10 -38 Q18 -20 14 0Z" fill="#ff7a2a"/><path d="M-6 0 Q-6 -12 0 -18 Q6 -10 6 0Z" fill="#ffd84a"/>'),
  orage: () => '', nuit: () => '', desert: () => '', interieur: () => '', jour: () => '',
};

// Un personnage : une silhouette simple (robe et tête, sans visage détaillé), dessinée seulement si la famille l'a choisi.
const PEAUX = ['#c68a5a', '#a86a3e', '#e0b48a', '#8a5a34'];
function personnage([x, y, s, couleur, variante = ''], i) {
  const peau = PEAUX[i % PEAUX.length], h = variante === 'enfant' ? 0.7 : 1;
  if (variante === 'bebe') return g(x, y, s, `<g class="personnage"><ellipse cy="-6" rx="12" ry="6" fill="${couleur}"/><circle cx="-10" cy="-8" r="5" fill="${peau}"/></g>`);
  const corps = variante === 'assis'
    ? `<path d="M-14 0 L-10 -24 H10 L22 0Z" fill="${couleur}"/><circle cy="-32" r="9" fill="${peau}"/>`
    : `<path d="M-14 0 L-9 -${44 * h} H9 L14 0Z" fill="${couleur}"/><circle cy="-${52 * h}" r="${10 * Math.sqrt(h)}" fill="${peau}"/>`;
  const extra = {
    voile: `<path d="M-12 -${48 * h} Q0 -${70 * h} 12 -${48 * h} L13 -${30 * h} H-13Z" fill="${couleur}" opacity=".85"/>`,
    baton: `<path d="M18 0 V-70 q0 -8 -6 -8" stroke="#7a4a30" stroke-width="3" fill="none"/>`,
    casque: '<path d="M-10 -56 Q0 -70 10 -56Z" fill="#9a9a9a"/><rect x="18" y="-60" width="4" height="60" fill="#7a7a7a"/>',
    tunique: '<path d="M-12 -12 H12 M-11 -22 H11 M-10 -32 H10" stroke="#f1c40f" stroke-width="3"/><path d="M-11 -17 H11 M-10 -27 H10" stroke="#3498db" stroke-width="3"/>',
    jesus: `<path d="M-12 -${50} Q0 -${68} 12 -${50} L11 -${40} H-11Z" fill="#6a4a2a"/><path d="M-9 -${44} L9 0" stroke="#c0392b" stroke-width="4"/>`,
    sac: '<path d="M10 -36 q12 4 10 18 q-10 2 -14 -6Z" fill="#c8a070"/>',
    couronne: `<path d="M-9 -${60 * h} l3 -8 l3 5 l3 -7 l3 7 l3 -5 l3 8Z" fill="#e8c24a"/>`,
    unPied: '<path d="M14 -20 l10 -8" stroke="#3a8a8a" stroke-width="5" stroke-linecap="round"/>',
  }[variante] ?? '';
  return g(x, y, s, `<g class="personnage">${corps}${extra}</g>`);
}

// L'image d'une histoire. avecPersonnages : réglage de la famille (espace parents).
export function illustration(recit, avecPersonnages) {
  const fond = recit.decor.find(([e]) => e in FONDS)?.[0] ?? 'jour';
  const decor = recit.decor.map(([e, x, y, s, v]) => ELEMENTS[e](x, y, s, v)).join('');
  const gens = avecPersonnages ? recit.personnages.map(personnage).join('') : '';
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="illustration-recit" role="img" aria-label="${recit.titre.replace(/"/g, '&quot;')}">${ciel(FONDS[fond], `ciel-${recit.cle}`)}${decor}${gens}</svg>`;
}

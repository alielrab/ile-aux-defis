# Idées pour plus tard

À ne pas construire pour la V1 (voir `SPEC.md`). Chaque idée deviendra un lieu d'une île de l'archipel (voir `js/archipel.js` pour ajouter une île).

## Mini-jeux

| Idée | Le principe |
|---|---|
| Dictée magique | **Fait** (dans la bibliothèque) : un mot est lu à voix haute, l'enfant l'écrit en touchant les lettres |
| Langues | Voir « Les langues » plus bas : l'école des langues et les mots de voyage |
| Syllabes | Assembler des syllabes pour apprendre à lire |
| Explorateur de la Suisse | **Commencé** (quiz à l'aéroport : cantons, chefs-lieux, langues, lacs, montagnes). Reste : la carte des cantons à toucher |
| Petit naturaliste | **Fait** (cabane nature, île de la nature) : quiz sur les animaux, les plantes et les arbres |
| Code avec un robot | **Fait** (atelier des robots, île des créateurs) : programmer un robot avec des flèches pour atteindre l'étoile |
| Défi entre sœurs | **Fait** (défi à deux, salle de jeux) : 5 questions chacun, à son niveau |
| Aide à la maison | **Fait** (missions de la maison, île du cœur). Missions réelles (ranger sa chambre, mettre la table) validées par un parent avec le code, qui rapportent des étoiles |
| Atelier d'écriture | **Commencé** (bibliothèque) : tracer les majuscules au doigt, dans le bon sens. Reste : les minuscules et les mots |
| Potager | **Commencé** (île de la nature) : quiz sur les fruits, les légumes et les saisons. Reste : semer, arroser, voir pousser |
| Le glacier de la plage | **Commencé** (île de la nature, sans la monnaie). Jeu d'arcade : servir les commandes des clients le plus vite possible, avec des niveaux qui accélèrent ; pour les 9 ans, rendre la monnaie en francs suisses (voir le marché) |
| Jeux de réflexion | Labyrinthe **fait** (île de la nature). Reste le tangram. Tangram, labyrinthes (le Memory est fait, dans la salle de jeux) |

## Les langues (à construire plus tard)
Un mini-jeu de langues à deux niveaux.

**1. L'école des langues** (île du savoir) — **commencée** (`js/jeux/langues.js`) : allemand et anglais, 6 thèmes, « Écoute et touche », « Comment dit-on… ? » dès 8 ans, révision des mots ratés. Reste : la langue de famille, les paires, les petites scènes.
- Un parcours complet pour l'**allemand** et l'**anglais**, plus une **langue de famille** au choix dans l'espace parents.
- Thèmes : couleurs, animaux, famille, école, nourriture, nombres…
- Mini-jeux :
  - **Écoute et touche** : entendre le mot, choisir l'image ;
  - **Paires** français-langue ;
  - **Petites scènes du quotidien** : commander une glace, se présenter, demander son chemin ;
  - **Révision intelligente** : les mots ratés reviennent plus souvent.
- Niveaux adaptés à l'âge.

**2. Les mots de voyage** : fait, voir plus bas.

## Nouvelles îles (à construire plus tard)
- **L'île de la mer** : l'aquarium et les fonds marins (poissons, coraux, baleines, protéger la mer).

## Île du cœur : « Grandir ensemble » (à construire plus tard)
Un lieu sur le vivre-ensemble. Comme la maison de la confiance : pas de pénalité, des explications douces, une invitation à en parler avec un parent.
- **Le volcan de la colère** : reconnaître la colère qui monte, et ce qui la fait redescendre (respirer, s'éloigner, dire avec des mots).
- **Savoir perdre** : un jeu où l'on perd parfois. Les étoiles récompensent le bon comportement (féliciter l'autre, rester calme, rejouer), **pas la victoire**.
- **Le bocal de patience** : attendre son tour, attendre une récompense ; le bocal se remplit quand on patiente.
- **Le droit à l'erreur** : se tromper, c'est apprendre ; des histoires d'erreurs célèbres qui ont mené à des découvertes.
- **« Et si j'avais tort ? »** : changer d'avis quand on apprend quelque chose de nouveau, écouter l'autre.
- **La boîte à excuses** : comment s'excuser vraiment (dire ce qu'on a fait, réparer), et accepter des excuses.
- **Mission politesse** : bonjour, merci, s'il te plaît, au revoir, dans des situations de tous les jours.
- **Dans les chaussures de l'autre** : imaginer ce que ressent l'autre (lien avec la météo des émotions).
- À garder en tête : le respect des adultes reste compatible avec « mon corps m'appartient ». On peut être poli **et** dire non à un adulte qui met mal à l'aise, puis en parler à un adulte de confiance (voir la maison de la confiance).

## Voix de qualité (à construire plus tard)
Remplacer la voix de la tablette par des fichiers audio pré-enregistrés pour les phrases fixes ; la voix de la tablette reste pour les phrases qui changent (prénoms, nombres). La liste de toutes les phrases fixes est dans `voix/phrases.csv` (générée par `node voix/lister-phrases.mjs`) : chaque phrase a un identifiant, qui servira de nom de fichier audio.

## Fait (2026-11-22)
- **Le calendrier de l'Avent** : bouton 🎄 en haut de l'île, en décembre seulement ; 24 cases (« Le savais-tu ? » sur l'hiver ou petit défi à faire en vrai), 2 étoiles par case et 5 le 24, rattrapage possible des jours oubliés (`js/jeux/avent.js`).
- **Les mots de voyage** : chaque tampon du passeport débloque 6 mots dans la langue du pays (bonjour, merci, au revoir, oui, non, s'il te plaît), avec la prononciation « à la française » et un 🔊 (voix de la langue si la tablette l'a, sinon la prononciation lue en français). Le livret compte les mots appris (`MOTS` dans `js/jeux/passeport.js`).
- **Le centre de tri** (île de la sécurité) : 22 déchets à mettre dans la bonne poubelle parmi 8 (verre, PET, papier et carton, alu et fer-blanc, compost, sac poubelle, retour au magasin, habits), 6 réservés aux 8 ans et plus (`js/jeux/tri.js`, à faire relire : les règles varient selon les communes).

## Fait (2026-11-05)
- Boutique en francs suisses → **le marché** (voir SPEC.md).
- **L'atelier de peinture** (île des créateurs, voir SPEC.md).
- **L'atelier BD** (île des créateurs, voir SPEC.md).
- **Le musée des dinosaures** et **le passeport du monde** (île du savoir), **les numéros d'urgence** (île de la sécurité) : voir SPEC.md.
- **La météo des émotions** (île du cœur, voir SPEC.md) — à faire relire par un parent.
- **Archipel** : îles du village, du savoir, des créateurs et du cœur, reliées par un bateau (voir SPEC.md). Les idées ci-dessous ont déjà leur place réservée (« Bientôt ») : chantier, peinture, BD, musique, maison de la confiance, météo des émotions.
- Lieu de croyance du village, choisi par les parents (voir SPEC.md) : idée d'origine, « Ma foi » et « Autres cultures ».

## La maison de la confiance (à construire plus tard)
Un lieu calme sur l'île, sur les droits de l'enfant et la sécurité. **Pas d'étoiles perdues ni de pénalité** : une réponse à revoir donne seulement une explication douce, et chaque thème finit par une invitation à en parler avec un parent.
- **Mes droits** : les droits de l'enfant expliqués simplement.
- **Mon corps m'appartient** : la règle du maillot de bain (personne ne touche ce que le maillot cache, sauf pour soigner ou laver, et toujours en le disant), le droit de dire non, la différence entre une surprise (qui fait plaisir et finit par être dite) et un secret qui met mal à l'aise (qu'on a le droit de raconter).
- **Prudence avec les inconnus** : des situations illustrées (« Un monsieur te propose de voir des chatons dans sa voiture… »), avec la bonne façon de réagir.
- **Mes adultes de confiance** : choisir avec un parent qui sont ses adultes de confiance ; savoir qu'on peut appeler le **147** (Pro Juventute, gratuit, jour et nuit).
- **Jeu « Fait ou avis ? »** :
  1. Trier des phrases entre faits et avis : d'abord des exemples neutres et amusants (« Le ciel est bleu » / « Le bleu est la plus belle couleur »), puis des remarques blessantes (« Tu es moche » = un avis, pas un fait).
  2. Des situations de cour de récré : reconnaître l'avis, puis choisir une réaction (ne pas y croire, répondre « C'est ton avis », s'éloigner, en parler à un adulte).
  3. Un miroir où l'enfant liste des faits positifs sur elle-même.
  - Message clé : un avis méchant ne dit rien de vrai sur toi. Si ça se répète ou que ça fait mal, c'est du harcèlement : on en parle toujours à un adulte de confiance.
- Contenu à baser sur les approches de **Protection de l'enfance Suisse** et de **Pro Juventute**, et **à faire relire par un parent avant utilisation**.

## Commercialisation (à long terme)
Rien de tout ça n'est construit. Le code est seulement préparé :
- toute la sauvegarde passe par `js/store.js` (`charger` / `sauver`) ;
- chaque enfant a un identifiant unique ;
- la croyance est rangée à part, sur l'appareil.

- **Comptes parents** : un compte par famille (e-mail + mot de passe, ou connexion Google/Apple), créé par un adulte. Les enfants n'ont jamais de compte ni d'e-mail. Le code à 4 chiffres reste pour l'espace parents sur la tablette.
- **Synchronisation en ligne** : retrouver les profils sur plusieurs appareils (tablette, téléphone).
  - On remplacera `charger` / `sauver` dans `store.js` par un envoi au serveur, en gardant la sauvegarde locale pour jouer hors ligne.
  - Si les deux appareils ont changé : garder la version la plus récente, profil par profil.
- **Protection des données des enfants (Suisse et Europe)** :
  - **Lois** : nLPD en Suisse, RGPD en Europe. Le consentement d'un parent est obligatoire (article 8 du RGPD : moins de 16 ans selon les pays, 13 ans au minimum).
  - **Données** : en garder le moins possible (prénom ou surnom, âge, progrès). Pas de photo, pas de position, pas de publicité, pas de pistage.
  - **Hébergement** : en Suisse ou dans l'UE.
  - **Droits des parents** : voir, exporter et supprimer toutes les données en un geste.
  - **Documents** : une politique de confidentialité simple et un registre des traitements.
  - **Voix enregistrées** : elles restent sur l'appareil, sauf choix explicite du parent.
- **Croyance religieuse gardée uniquement sur l'appareil** : c'est une donnée sensible (article 9 du RGPD, et donnée « sensible » selon la nLPD). Elle n'est jamais envoyée au serveur, ni dans les sauvegardes en ligne. C'est déjà le cas : elle est rangée à part, sous la clé `ile-aux-defis-appareil`.
- **Règles Google Play et App Store pour les apps enfants** :
  - **Google Play** : programme « Familles » (Designed for Families), questionnaire sur le public visé, uniquement des SDK de pub et de statistiques certifiés pour les familles (ou aucun).
  - **App Store** : catégorie « Enfants » (Kids Category), pas de liens ni d'achats sans contrôle parental (« parental gate »), pas de pub comportementale ni de statistiques tierces.
  - **Pour les deux** : une politique de confidentialité en ligne. Les achats éventuels passent par un parent.
  - **L'app actuelle** est une PWA. Pour les magasins d'apps, il faudra l'emballer (TWA pour Google Play, Capacitor pour l'App Store).
- **Relecture des contenus par des professionnels** :
  - **Questions sur le corps** : un médecin ou une infirmière scolaire.
  - **Pédagogie** : un ou une enseignante, pour le calcul, la lecture et l'heure, selon le Plan d'études romand.
  - **Croyances** : un représentant de chaque religion présentée, et quelqu'un de neutre pour « Autres cultures ».
  - **Maison de la confiance** : Protection de l'enfance Suisse / Pro Juventute.
  - **Textes lus à voix haute** : relecture de l'orthographe et de la prononciation.

## Maison
- Nouvelles pièces
- Placement libre des meubles (glisser-déposer)

# Spec : L'Île aux Défis (V1)

## Hypothèses (à corriger avant le plan)

1. App web statique (HTML/CSS/JS, **aucun framework, aucune étape de build**), installable comme une vraie app (PWA) : icône sur l'écran d'accueil, plein écran, sans barre du navigateur. Compatible **Android (Chrome)** en priorité, et iPad (Safari).
2. Hébergée sur **GitHub Pages**. Il faut internet **une seule fois** pour l'installer. Ensuite elle marche 100 % hors-ligne (service worker).
3. Les données (profils, étoiles, objets) restent **sur la tablette** (localStorage). Pas de compte, pas de serveur, rien n'est envoyé.
4. Une seule tablette partagée par les enfants de la famille. Pas de synchronisation entre appareils (préparée dans `js/store.js`, voir IDEES.md « Commercialisation »).
5. Langue : français uniquement. La fille de 6 ans lit peu : **les consignes sont lues à voix haute** (synthèse vocale du système, qui marche hors-ligne) et les réponses passent par des images/boutons, pas du texte à taper.
6. Graphismes : dessins SVG faits maison (île, bâtiments, personnages). Pas d'images sous licence, pas d'artiste.
7. Appareils : tablette Android ou iPad en priorité (au doigt), mais l'affichage s'adapte aussi au **téléphone** (portrait et paysage) et à l'**ordinateur** (souris). Aucune orientation imposée.

## Objectif

Une app éducative pour deux filles (6 et 9 ans). Une carte d'île : chaque lieu est un mini-jeu. Les mini-jeux rapportent des étoiles. Les étoiles achètent des décorations pour sa maison sur l'île.

**Réussite V1** : chaque fille choisit son profil, joue aux 3 mini-jeux à un niveau adapté à son âge, gagne des étoiles, et décore sa maison, sans aide d'un adulte et sans internet.

## Modules (V1)

| Module | Rôle | Dépend de |
|---|---|---|
| `profils` | Autant de profils que d'enfants (« Ajouter un enfant » dans l'espace parents ; jusqu'à 4 maisons sur la carte), prénom, âge, avatar humain, code parent, écran parent (dont voix enregistrées), sauvegarde locale | — |
| `ile` | Carte illustrée de l'île : un bâtiment par mini-jeu + le village des maisons | profils |
| `jeu-calcul` | L'école : les 4 opérations, difficulté selon l'âge | profils |
| `jeu-heure` | Lire l'heure sur une horloge à aiguilles | profils |
| `jeu-corps` | Parties du corps | profils |
| `maison` | Une pièce, boutique, achat et placement des objets | profils |

Ordre de construction : profils → ile → un mini-jeu de bout en bout (étoiles incluses) → maison → les 2 autres mini-jeux.

## Exigences

### Profils
- **Première ouverture** : le parent choisit un code à 4 chiffres, puis chaque fille crée son personnage : prénom, âge, couleur de peau (6), couleur des yeux (6), coiffure (8 dont bouclés), couleur des cheveux (5), vêtements (8 tenues de départ). Les couettes, les cheveux roses et 4 tenues spéciales (princesse, super-héroïne, foot, pyjama) ne sont pas au départ : elles se gagnent à la boutique. Aperçu en direct.
- **Modifier mon avatar** : bouton sous chaque profil, sur l'écran « Qui joue ? ». Peau et yeux libres ; coiffure, cheveux et tenue parmi ce qu'elle possède (départ + achats). Prénom et âge : écran parent.
- **Avatar** (option A, choisie le 2026-11-04) : enfant dessiné en SVG fait maison, avec contours, ombres et reflets, en entier (corps visible). Il s'adapte à l'âge : plus jeune = plus petite, tête plus grosse, corps plus court. Quand l'âge est mis à jour dans l'écran parent, l'avatar grandit. Coiffures, couleurs, tenues et bijoux achetés s'appliquent à cet avatar ; plusieurs bijoux à la fois.
- Écran d'accueil : 2 grosses tuiles (prénom + avatar). Un appui = on entre.

### Fille ou garçon
- **À la création d'un profil**, on choisit « une fille » ou « un garçon ». Le choix est obligatoire et reste modifiable dans l'espace parents. Les profils créés avant sont des filles.
- **Le personnage de départ** est proposé selon ce choix (garçon : coupe courte et polo vert) et reste entièrement modifiable.
- **Nouvelles coiffures et tenues de départ**, gratuites et proposées à tous : très courts, mèche sur le côté, hérissés ; polo vert, chemise à carreaux, sweat gris, t-shirt à rayures.
- **Boutiques** : tous les objets restent accessibles à tous, sans rien classer « pour filles » ou « pour garçons ».
- **Accord des textes** (`js/genre.js`) : les textes s'écrivent avec des marques « {masculin|féminin} », par exemple « Tu es trop {fort|forte} ! ». Les phrases dites à voix haute s'accordent toutes au genre du profil, dans `parler` ; les textes affichés aussi (question, bulle de réponse, météo du jour).
- **« Bienvenue ! »** (formule d'accueil) reste invariable : c'est la bonne orthographe pour une fille comme pour un garçon.
- **La liste des phrases à enregistrer** (`voix/phrases.csv`) donne les deux versions des phrases qui s'accordent (`….garcon` et `….fille`).

### L'archipel
- **Carte de l'archipel** (`js/archipel.js`, dessins dans `js/carte.js`) : des îles thématiques reliées par un bateau, et deux emplacements « Bientôt… » pour les prochaines îles.
  - Après le choix du profil, on arrive sur cette carte. On touche une île pour y aller.
  - Sur chaque île, le voilier « L'archipel » ramène à la carte. Les boutons « retour » des jeux et des magasins ramènent sur l'île où l'on était.
- **Les îles** :
  - **L'île du village** (ouverte dès le départ) : les maisons des enfants (sa tête à la porte, « Ma maison » ou le prénom), le coiffeur, la boutique, le magasin de meubles, le refuge, le marché, et le chantier (bientôt).
  - **L'île du savoir** (ouverte dès le départ) : l'école, la bibliothèque, l'observatoire, l'hôpital, la tour de l'horloge, le musée des dinosaures, l'aéroport (le passeport du monde).
  - **L'île des créateurs** : le restaurant ; l'atelier de peinture, l'atelier BD et la salle de musique (bientôt).
  - **L'île de la sécurité** (ouverte à tous, prix 0) : les numéros d'urgence ; le code de la route (bientôt).
  - **L'île du cœur** : la maison de la confiance et la météo des émotions (bientôt) ; le lieu de culte choisi par les parents (sinon, un grand arbre).
- **Débloquer une île** : chaque enfant débloque les îles fermées avec ses propres étoiles. On touche une première fois (« Touche encore ! »), puis une deuxième pour payer.
  - Le prix est réglable dans `PRIX_ILES` (`js/reglages.js`), 20 étoiles par défaut. À 0, l'île est ouverte pour tout le monde.
  - Les îles débloquées sont gardées dans le profil (`iles`). Les anciens profils reçoivent une liste vide, et rien d'autre ne change. « Remettre à zéro » referme les îles.
- **Lieux** : on touche un lieu pour y entrer. Un lieu pas encore prêt affiche « Bientôt » et le dit à voix haute. Seule la maison de la joueuse en cours s'ouvre.
- **Ajouter une île** : une entrée dans `ILES` (`js/archipel.js`), ses lieux dans `LIEUX` (`js/carte.js`, avec `ile: '…'`), et son prix dans `PRIX_ILES`.
- **Pas de niveau à régler** : la difficulté de chaque jeu dépend de l'âge du profil.
- **Espace parents** (bouton « 👪 Espace parents » sous les profils), protégé par le code à 4 chiffres : changer prénom et âge, remettre un profil à zéro (étoiles, achats, maison ; on garde prénom, âge, peau et yeux ; deux appuis pour confirmer), changer le code. L'avatar se modifie avec « Modifier mon avatar ». Le code est un verrou anti-fausse-manip, pas une sécurité forte.
- **Croyance de la famille** (espace parents) : christianisme catholique, protestant, orthodoxe, islam, judaïsme, bouddhisme, hindouisme, autre, ou non croyant / athée ; et les autres religions que les enfants peuvent découvrir (aucune possible). Un bâtiment apparaît alors au milieu du village : l'église, le temple, l'église orthodoxe, la mosquée, la synagogue, le temple bouddhiste, le temple hindou, ou la maison des sages (valeurs et grandes questions) pour « autre » et « non croyant ». Sans choix, pas de bâtiment.
  - Trois onglets :
    - **« Ma foi »** (ou « Les grandes questions ») : présentation, fêtes, histoires, symboles et des petites questions (10 par partie, étoiles).
    - **« Autres cultures »** : seulement les religions cochées par les parents, ton neutre et descriptif (« Les musulmans racontent que… »).
    - **« Ce qui nous rapproche »** : visible dès que deux croyances différentes sont choisies (`js/rapprochements.js`).
      - Points communs : Abraham, personnages partagés, prière, jeûne, partage, règle d'or.
      - Pour les 8 ans et plus, les différences : qui est Jésus, un seul Dieu ou plusieurs formes du divin, jour de prière, livres saints.
      - Chaque croyance est présentée du point de vue de ceux qui y croient. Seules les religions choisies apparaissent. Fin : « Chacun peut croire différemment et se respecter », avec une invitation à en parler avec ses parents.
  - **Histoires illustrées** (`js/recits.js`, même structure pour toutes les religions) : chaque histoire est lue en entier à voix haute, avec un bouton 🔊 pour réécouter, puis suivie de 2 ou 3 questions qui donnent des étoiles.
    - Christianisme : 20 histoires bibliques.
    - Judaïsme, islam, hindouisme, bouddhisme : 5 histoires chacun.
  - **Illustrations des personnages religieux** (réglage de l'espace parents, gardé sur l'appareil) :
    - Réglé automatiquement selon la croyance : non pour l'islam, oui pour les autres. Le parent peut le modifier.
    - S'applique partout, y compris dans « Autres cultures ». Sans illustration : seulement des décors, des symboles et des objets.
    - **Jamais dessinés, quel que soit le réglage** : Dieu, les prophètes dans les histoires de l'islam, les divinités hindoues.
  - Adapté à l'âge (3 choix et questions plus simples pour 7 ans et moins), « Le savais-tu ? » partout, chaque carte peut être écoutée. Contenu dans `js/croyances-contenu.js`, **à faire relire par un parent**.
- **Enregistrer ma voix** (dans l'écran parent) : chaque parent enregistre au micro ses propres phrases de félicitations et d'encouragement, les réécoute, les refait ou les supprime. S'il en existe, l'app les joue au hasard à la place de la voix de synthèse pour ces moments-là. Les enregistrements restent sur l'appareil (IndexedDB), 6 secondes au plus chacun. Les messages de série (« 3 de suite ! ») restent dits par la voix de synthèse. Il faut l'app en https (GitHub Pages) pour que le micro soit autorisé.

### Mini-jeux (règles communes)
- Une partie = **10 questions**, réponse par choix multiple (3 ou 4 gros boutons).
- Bonne réponse : retour visuel + son + félicitation variée tirée au hasard (« Bravo ! », « Super ! », « Tu es trop forte ! »…), jamais deux fois la même d'affilée. Séries : message spécial à 3, 5, 7 et 10 bonnes réponses d'affilée.
- Mauvaise réponse : encouragement gentil (« Presque ! », « Pas grave, on continue ! ») puis la bonne réponse, sans punition.
- Quitter une partie en cours ne donne pas d'étoiles (validé).
- Fin de partie : 1 étoile par bonne réponse, +2 bonus si 10/10. Total affiché avec animation.
- Tout le texte est lu à voix haute : consignes, réponses proposées (sauf calcul et syllabes, où lire fait partie de l'exercice), « Le savais-tu ? », infos des planètes, rayons des magasins, recettes. Bouton 🔊 pour réécouter sur chaque écran qui parle.
- Une question (ou un mot) ne revient pas tant que toutes les autres n'ont pas été posées, même d'une partie à l'autre (gardé dans le profil, par jeu, opération et âge).
- Consigne lue à voix haute (bouton 🔊 pour la réécouter). Par défaut, la voix française la plus naturelle de l'appareil (voix « naturelles » ou « premium » en priorité ; hors-ligne, seulement les voix installées). Ton plus enjoué pour les félicitations.

| Jeu | Petite (6 ans) | Grande (9 ans) |
|---|---|---|
| Calcul | Les 4 opérations, petits nombres, avec images (objets à compter, barrer, grouper, partager) | Les 4 opérations jusqu'à 100, tables de 2 à 10 |

**École (Calcul)** : on choisit l'opération (additions, soustractions, multiplications, divisions) avant la partie. Difficulté par âge : ≤ 6 ans / 7–8 ans / ≥ 9 ans (détail dans `js/jeux/calcul.js`). Étoiles par bonne réponse selon l'âge et l'opération, réglables dans **`js/reglages.js`** :

| | Addition | Soustraction | Multiplication | Division |
|---|---|---|---|---|
| 7 ans et moins | 1 | 1,5 | 2 | 2 |
| 8 ans et plus | 0,5 | 0,5 | 1 | 1 |

Bonus sans-faute (+2) et nombre de questions (10) aussi dans `js/reglages.js`. Les étoiles peuvent être des demi-étoiles (affichées « 7,5 »).

Chaque jeu a le décor de son lieu. Calcul = salle de classe : la question à la craie sur un tableau vert, une maîtresse qui parle dans une bulle, les réponses sur des pupitres.

**Tour de l'horloge (Heure)** : murs de pierre, un horloger, une grande horloge (petite aiguille rouge = heures, grande bleue = minutes). Deux sortes de questions, au hasard : lire l'heure (3 ou 4 choix « 3 h 30 ») et régler l'horloge en faisant tourner les aiguilles avec le doigt (ou avec les boutons ◀ ▶), puis « C'est l'heure ! ». Quand la grande aiguille passe le 12, l'heure avance, comme une vraie horloge. 7 ans et moins : heures pile et demies, 3 choix. 8 ans et plus : quarts d'heure et 5 minutes près, 4 choix.

**Musée des dinosaures** (`js/jeux/dinos.js`, île du savoir) : 16 dinosaures, dont le Plateosaurus, trouvé en Suisse à Frick.
- **Le puzzle** : on choisit un dinosaure et on reconstitue son squelette en 4 pièces (tête, corps, queue, pattes). La place à remplir brille, et on touche la bonne pièce dans la réserve. Une mauvaise pièce tremble, sans pénalité.
- **La fiche** : longueur, ce qu'il mangeait, et en plus pour les grands le poids et l'époque. Elle est lue à voix haute, avec un « Le savais-tu ? ».
- **Étoiles** : le premier squelette de chaque dinosaure rapporte 2 ⭐ (`ETOILES_SQUELETTE`).
- **Le quiz** : 10 questions faites à partir des fiches. 7 ans et moins : ce qu'il mangeait, et « Quel dinosaure… ? », avec 3 choix. Grands : aussi la taille et l'époque, avec 4 choix.

**Passeport du monde** (`js/jeux/passeport.js`, île du savoir, « L'aéroport ») : 20 pays (la Suisse et ses voisins, puis l'Europe et le monde).
- **Le voyage** : sur la carte du monde, l'avion vole jusqu'au pays choisi. On choisit le pays dans une liste de boutons, car les pays d'Europe sont trop serrés sur la carte pour un doigt.
- **La fiche** : drapeau, capitale, un animal, un plat typique, la langue, et un « Le savais-tu ? ».
- **Le petit quiz** : 3 questions. 7 ans et moins : drapeau, animal, plat, avec 3 choix. Grands : 3 questions au hasard parmi drapeau, capitale, animal, plat et langue, avec 4 choix. Les drapeaux proposés ne sont pas lus à voix haute.
- **Le passeport** : au moins 2 bonnes réponses ajoutent le tampon du pays dans « Mon passeport ».
- Les drapeaux sont des emojis : ils s'affichent sur la tablette Android, mais en lettres sur un ordinateur Windows.

**Numéros d'urgence** (`js/jeux/urgences.js`, île de la sécurité) — **à faire relire par un parent** :
- **Découvrir** : les 3 numéros, 144 (l'ambulance), 117 (la police) et 118 (les pompiers), avec quand les appeler ; puis « Au téléphone, je dis » : Qui ? Où ? Quoi ? et rester au téléphone. Ton rassurant : les secours sont des personnes gentilles dont le métier est d'aider.
- **« Qui appeler ? »** : 10 questions, 4 choix (144, 117, 118, ou « Pas une urgence : je demande à un adulte »).
  - 15 situations illustrées, dont 4 qui ne sont pas des urgences (dont « appeler pour rire, c'est interdit »).
  - Des questions sur quoi dire et quoi faire : sortir de la maison avant d'appeler en cas de feu, rester en ligne.
  - Pour les grands : le 112 et la gratuité des appels.

**Hôpital : l'atlas du corps** (`js/jeux/atlas.js`) — c'est ce qui s'ouvre en entrant à l'hôpital.
- **8 pages** : le squelette, les muscles, le cœur et le sang, la respiration, la digestion, le cerveau et les nerfs, les 5 sens, les dents et la peau.
- **Sur chaque page**, un corps dessiné : on touche un os ou un organe (ou son nom, en bouton, sous la fiche) pour ouvrir sa fiche, lue à voix haute, avec un « Le savais-tu ? ». Fiche simple à 7 ans et moins, détaillée à 8 ans et plus.
- **Découvrir toute une page** la première fois rapporte 3 ⭐ (`ETOILES_ATLAS` dans `reglages.js`). Les fiches vues sont cochées et gardées dans le profil (`atlas`).
- **« Je teste mes connaissances »** : 10 questions sur ce système seulement, tirées des fiches, toujours 4 choix plausibles. 10 questions simples et 10 détaillées par page, jamais du niveau « où est ta tête ».
- **« Le grand quiz du corps »** : l'ancien jeu de l'hôpital (décrit ci-dessous) reste accessible depuis l'atlas.

**Hôpital (Corps), le grand quiz** : cabinet médical (carrelage, croix, tableau des lettres), une docteure avec un stéthoscope, un patient. Surtout des questions de culture sur le corps (`js/jeux/corps-questions.js`, faciles à compléter), chacune suivie d'un « Le savais-tu ? ». 7 ans et moins : les 3 premières questions, on touche une partie sur le patient (« Touche le genou », « Avec quoi entends-tu la musique ? ») ; ensuite 43 questions faciles. 8 ans et plus : 57 questions plus poussées (os, organes, sang, nerfs, records du corps…). Toujours 4 choix, avec des mauvaises réponses plausibles et proches de la bonne (206 os : 186, 226, 260). Chiffres arrondis « environ », vérifiés pour des enfants.

**Bibliothèque (Syllabes)** : l'image du mot apparaît floue mais en couleurs (reconnaissable) ; on touche les syllabes dans l'ordre pour former le mot ; une mauvaise syllabe tremble (on peut réessayer, mais la question compte comme une erreur). Le mot trouvé est dit à voix haute, l'image devient nette, avec un « Le savais-tu ? ». Mots dans `js/jeux/syllabes-mots.js`. 7 ans et moins : 111 mots de 2 syllabes, 1 syllabe intruse. 8 ans et plus : 103 mots de 3 à 5 syllabes, 2 syllabes pièges qui se ressemblent (pa/ba, on/an, gnon/gmon…). Les images sont des emojis.

**Observatoire (Système solaire)** : trois onglets. *Voyage* : une fusée vole de planète en planète (Soleil, 8 planètes et la Lune) ; pour chacune, 3 infos amusantes et « ton poids là-bas » (on tape son poids, gardé dans le profil ; aussi modifiable dans l'espace parents). *Les tailles* : toutes les planètes à la même échelle. *Quiz* : 10 questions (30 faciles à 3 choix, 32 difficiles à 4 choix) avec « Le savais-tu ? » ; c'est là qu'on gagne les étoiles.

**Marché (francs suisses)** (`js/jeux/marche.js`) : un étal sur la place du village, avec une marchande.
- **Pièces et billets suisses** : 5, 10, 20, 50 centimes, 1, 2, 5 francs, et billets de 10, 20, 50 francs. Ils sont dessinés simplement (valeur et couleur), sans copier les vrais billets.
- **Prix** : réalistes pour chaque article, affichés comme en magasin (« Fr. 3.– », « Fr. 7.40 ») et lus à voix haute (« 7 francs 40 »).
- **7 ans et moins** : pièces de 1, 2 et 5 francs, prix ronds jusqu'à 10 francs.
  - *Compter* le porte-monnaie, avec 3 choix.
  - *Payer juste* : on touche les pièces, la voix annonce le total, puis on touche « Payer » (et « Enlever » pour corriger).
- **8 ans et plus** : avec les centimes et les billets.
  - *Payer juste*.
  - *Compter* le porte-monnaie.
  - *Rendre la monnaie*, avec 4 choix qui reprennent les vraies erreurs : oublier la retenue (3.60 au lieu de 2.60), recopier les centimes du prix (3.40).
- **Étoiles** : 1,5 par bonne réponse à 7 ans et moins, 1 au-delà.

**Atelier de peinture** (`js/jeux/peinture.js`, île des créateurs) :
- **Peinture libre** au doigt : 14 couleurs, 3 tailles de pinceau, une gomme, des boutons « Annuler » et « Tout effacer » (deux appuis).
- **Coloriage** : on choisit une couleur, puis on touche une partie du dessin, avec un bouton « Annuler ».
- **Coloriage magique** : chaque couleur de la palette porte une étiquette, et chaque zone du dessin aussi.
  - 7 ans et moins : la palette montre un son (« o »), la zone une syllabe qui le contient (« mo »). Toucher une zone la fait lire à voix haute.
  - 8 ans : additions et soustractions ; 9 ans et plus : aussi les tables de multiplication.
  - Une mauvaise couleur fait trembler la zone, et la voix répète le calcul ou la syllabe. Le dessin fini rapporte 0,5 ⭐ par zone (réglable : `peinture` dans `reglages.js`). La peinture libre et le coloriage simple ne rapportent pas d'étoiles.
- **8 dessins** : maison, poisson et fleur dès le départ ; papillon, fusée et bateau à 5 ⭐ ; glace et arc-en-ciel à 8 ⭐ (deux appuis pour débloquer).
- **Ma galerie** : 12 dessins au plus par enfant. Les peintures libres sont gardées en petites images d'environ 10 Ko. On peut accrocher un dessin dans une pièce de sa maison (un tableau par pièce, encadré au mur ; toucher encore pour le décrocher), l'imprimer ou l'enlever (deux appuis).
- **Imprimer** : le coloriage vide (pour le coloriage magique : avec les étiquettes et la légende des couleurs), la peinture en cours, ou un dessin de la galerie.

**Atelier BD** (`js/jeux/bd.js`, île des créateurs) : inventer une petite bande dessinée de 3 cases (7 ans et moins) ou 4 cases (8 ans et plus), avec un titre.
- **Dans chaque case** (on touche une case pour la modifier) :
  - un décor parmi 8 : plage, forêt, espace, maison, école, ville, nuit, neige ;
  - un personnage à gauche et un à droite : les enfants de la famille (leurs avatars), les personnages de l'île (maîtresse, docteure, marchande…) et 8 créatures (chien, chat, lapin, licorne, dragon, dinosaure, robot, extraterrestre) ;
  - une bulle pour chacun : une phrase toute faite (16, lues à voix haute quand on les touche) ou un texte tapé (40 caractères au plus) ;
  - un autocollant (étoile, cœur, arc-en-ciel…).
- **« Lire ma BD »** : la voix raconte la BD (« Case 1. Zoé dit : Regarde ! »).
- **« Mes BD »** : 8 BD au plus par enfant, à relire, imprimer (2 cases par ligne) ou enlever (deux appuis). Une BD vide n'est pas gardée.
- C'est un jeu de création : pas d'étoiles.

**Météo des émotions** (`js/jeux/emotions.js`, île du cœur) — **à faire relire par un parent** :
- **Ma météo du jour** : « Quel temps fait-il dans ton cœur ? »
  - Cinq temps : soleil (joie), nuages (calme), pluie (tristesse), orage (colère), brouillard (peur ou inquiétude).
  - L'app répond avec douceur et propose d'en parler à un adulte de confiance.
  - **Rien n'est enregistré** : c'est une donnée sensible.
- **Respirer avec moi** : une bulle grandit (« Inspire par le nez… ») et rétrécit (« Souffle doucement… »), 3 fois 4 secondes, avec la voix. L'exercice s'arrête dès qu'on quitte l'écran.
- **Devine l'émotion** : 10 questions, 1 ⭐ par bonne réponse.
  - Des visages dessinés (10 émotions, couleurs de peau variées) et 32 situations de la vie (« Tom a perdu son doudou… Que ressent Tom ? »). Après chaque réponse, un conseil (« Quand on est triste, ça fait du bien de… »).
  - 7 ans et moins : joie, tristesse, colère, peur, surprise, dégoût, avec 3 choix.
  - 8 ans et plus : en plus, fierté, jalousie, ennui, timidité, inquiétude, déception, avec 4 choix.
  - Deux émotions proches (peur et inquiétude, tristesse et déception…) ne sont jamais proposées ensemble.

**Restaurant (Cuisine)** : 5 recettes (crêpes, cookies, salade de fruits, gâteau au yaourt, pain perdu). En jeu : à chaque étape, choisir l'ingrédient suivant (la carte de la recette est affichée ; pour 6 ans, la voix dit lequel), puis peser sur une balance avec des boutons (6 ans : par 50 g ; 9 ans : par 10 g). À la fin, le plat réussi, un « Le savais-tu ? » et la vraie recette débloquée (ingrédients, étapes, consignes de sécurité). Quand on l'a faite pour de vrai, un parent tape son code : +10 étoiles (`BONUS_RECETTE_REELLE`) et un objet pour la cuisine de la maison (poêle à crêpes, four, corbeille de fruits, moule à gâteau, tablier de chef), une seule fois par recette.

Étoiles par bonne réponse des autres jeux, dans `js/reglages.js` (`ETOILES_AUTRES_JEUX`) :

| | Heure | Corps | Syllabes | Système solaire | Cuisine (par étape) |
|---|---|---|---|---|---|
| 7 ans et moins | 1,5 | 1 | 1 | 1 | 1 |
| 8 ans et plus | 1 | 1 | 1 | 1 | 0,5 |

### Maison et magasins
- La maison : la chambre et la cuisine au départ (la cuisine se remplit avec les objets gagnés au restaurant) ; le salon et la salle de jeux s'achètent (30 ⭐ chacun) au magasin de meubles. On passe d'une pièce à l'autre, on place ou range ses objets, papier peint au choix par pièce. Vue de face.
- On achète dans les magasins de l'île (pas dans la maison). Catalogue dans `js/catalogue.js` et `js/avatar.js` (prix modifiables), 131 objets payants :
  - **Magasin de meubles** : 27 meubles, dont une cuisine complète (frigo, évier, table, chaises, étagère à bocaux, placard, lave-vaisselle) ; 9 jouets ; 4 papiers peints ; 2 pièces ; 6 couleurs de lit (rayon « Couleurs du lit », le rose est celui du départ).
  - **Boutique** : 16 tenues spéciales, 12 bijoux et accessoires (sac, montre, barrettes, lunettes de soleil, écharpe…), 6 paires de chaussures (rayon « Chaussures », les baskets rouges sont celles du départ) et 6 chapeaux (rayon « Chapeaux », on le met ou on l'enlève).
  - **Coiffeur** : 7 coiffures et 7 couleurs à gagner, en plus de celles du départ.
  - **Refuge** : 13 animaux (chiots, chatons, lapins de plusieurs couleurs, dalmatien, hamster, tortue, perroquet, poisson rouge), 6 vêtements pour animaux (pulls, nœud, colliers, chapeau de fête) et 10 accessoires (gamelle, os, pelote, laisse, coussin, roue, perchoir, panier, griffoir, aquarium).
- **Animaux** : à l'adoption, l'enfant leur donne un prénom (15 lettres au plus), affiché au-dessus de l'animal et modifiable (« ✏️ Prénom »). Le bouton « 👕 » change le vêtement de l'animal parmi ceux qu'on a. Les animaux posés se rangent sur 5 places le long du sol ; leurs accessoires se mettent à côté du premier animal qui s'en sert (la laisse et le griffoir au mur ; le perroquet se pose sur son perchoir ; le poisson nage dans l'aquarium).
- **Tout débloquer** coûte 1 836 ⭐ (1 765 dans les magasins, 31 pour les dessins à colorier, 40 pour les îles), soit environ 150 parties : un objectif à long terme.
- Un meuble ou jouet du salon ou de la salle de jeux ne s'achète qu'après la pièce (bouton « 🔒 Salon »).
- Meubles, jouets et animaux sont tous dessinés en SVG dans le même style (pas d'emojis).
- Les animaux suivent l'enfant : ils apparaissent dans la pièce affichée. Les animaux n'existent que comme animaux de compagnie.
- Objet acheté = gardé pour toujours, et installé (ou porté) tout de suite. Chaque objet a sa place fixe dans sa pièce (pas de glisser-déposer libre en V1).
- Chez le coiffeur et à la boutique, les coiffures, couleurs et tenues du départ sont aussi proposées, pour pouvoir changer quand on veut.
- Achat en deux appuis (« Acheter ? » puis confirmer) pour éviter les achats par erreur.
- Impossible d'acheter sans assez d'étoiles (bouton grisé, prix visible).

### Hors périmètre V1 (prévu plus tard)
Voir `IDEES.md` pour les mini-jeux et la maison. Aussi : musique de fond, progression de niveau automatique, export/sauvegarde des données.

## Stack technique
- HTML + CSS + JavaScript (modules ES natifs). Aucune dépendance.
- `manifest.json` + `sw.js` (service worker) pour l'installation et le hors-ligne.
- `localStorage` pour les données.
- `speechSynthesis` (voix française du système) pour la lecture des consignes.

## Commandes
```
Lancer en local :  npx serve .            (ou: python -m http.server 8000)
Tests :            node --test tests/
Déployer :         git push  (GitHub Pages sur la branche main)
```

## Structure du projet
```
index.html          → page unique, contient tous les écrans
style.css
manifest.json, sw.js, icons/ (192 et 512 px, exigées par Android pour l installation)
js/
  app.js            → navigation entre écrans
  store.js          → profils, étoiles, objets (localStorage)
  jeux/calcul.js, heure.js, corps.js
  maison.js         → boutique + pièce
  catalogue.js      → liste des objets et prix
tests/              → tests de la logique pure (questions, étoiles, achats)
```

## Style de code
```js
// Chaque mini-jeu exporte une fonction pure qui génère une question (ici, ancienne version simplifiée).
export function question(niveau, aleatoire = Math.random) {
  const entre = (min, max) => min + Math.floor(aleatoire() * (max - min + 1));
  if (niveau === 1) {
    const a = entre(0, 10), b = entre(0, 10 - a);
    return { texte: `${a} + ${b}`, reponse: a + b };
  }
  const a = entre(2, 10), b = entre(1, 10);
  return { texte: `${a} × ${b}`, reponse: a * b };
}
```
- Noms en français (domaine) ; code simple, sans classes inutiles.
- Logique (questions, étoiles, achats) séparée de l'affichage, pour être testable.

## Tests
- `node:test` (intégré à Node, rien à installer) sur la logique pure : génération des questions par niveau, calcul des étoiles, achat refusé si pas assez d'étoiles, sauvegarde/rechargement du profil.
- Test manuel sur la vraie tablette : installation, mode avion, un tour complet par profil.

## Limites
- **Toujours** : tout fonctionne hors-ligne ; zones tactiles ≥ 60 px ; affichage correct de 360 px (téléphone) à 1920 px (ordinateur) de large, sans défilement horizontal ; aucune donnée ne quitte la tablette.
- **Demander d'abord** : ajouter une dépendance, un framework ou une étape de build ; tout ce qui touche à internet (pubs, analytics, polices en ligne).
- **Jamais** : pubs, achats réels, liens externes accessibles aux enfants, collecte de données, chronomètre stressant ou punition en cas d'erreur.

## Critères de réussite
1. Installée sur la tablette, l'app se lance et fonctionne entièrement **en mode avion**.
2. Les profils existent ; les étoiles et objets de l'un ne bougent pas quand un autre joue.
3. Chaque mini-jeu propose des questions différentes selon l'âge (vérifié par test).
4. Une partie de 10 questions donne le bon nombre d'étoiles (vérifié par test).
5. On peut acheter et placer un meuble, un papier peint, une tenue et l'animal ; ils sont toujours là après fermeture de l'app.
6. La fille de 6 ans peut faire un tour complet (profil → jeu → achat) **sans savoir lire**.

## Décisions (validées le 2026-11-04)
1. Tablettes : Android en priorité, iPad compatible. Installable sur l'écran d'accueil.
2. Hébergement : GitHub Pages.
3. ~~Niveau 1 : additions au lieu des multiplications.~~ Remplacé (2026-11-04) : les 4 opérations pour les deux, difficulté et étoiles selon l'âge.
4. Prénoms et avatars choisis à la première ouverture.
5. Code parent à 4 chiffres pour les réglages et la remise à zéro.

## Points d'attention
- Android : la voix française hors-ligne dépend des données vocales de « Synthèse vocale Google » installées sur la tablette (à vérifier une fois en mode avion).
- iPad : les données ne sont pas effacées seulement si l'app est lancée depuis l'icône de l'écran d'accueil.

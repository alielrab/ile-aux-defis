# Idées pour plus tard

À ne pas construire pour la V1 (voir `SPEC.md`). Chaque idée deviendra un lieu d'une île de l'archipel (voir `js/archipel.js` pour ajouter une île).

## Mini-jeux

| Idée | Le principe |
|---|---|
| Dictée magique | Un mot est lu à voix haute, l'enfant l'écrit |
| Allemand | Vocabulaire de base, avec images et prononciation |
| Syllabes | Assembler des syllabes pour apprendre à lire |
| Explorateur de la Suisse | Cantons, villes, montagnes, lacs sur la carte |
| Petit naturaliste | Reconnaître des animaux, des plantes et des arbres |
| Code avec un robot | Programmer un robot avec des flèches pour atteindre un but |
| Atelier BD | Composer une petite bande dessinée (cases, personnages, bulles) |
| Compositeur de musique | Créer une mélodie sur une grille de notes |
| Météo des émotions | Nommer et reconnaître ses émotions |
| Défi entre sœurs | Les deux sœurs jouent au même défi, chacune à son niveau |
| Calendrier de l'Avent | Une case par jour en décembre, avec une surprise ou un mini-défi |
| Aide à la maison | Missions réelles (ranger sa chambre, mettre la table) validées par un parent avec le code, qui rapportent des étoiles |

## Fait (2026-11-05)
- Boutique en francs suisses → **le marché** (voir SPEC.md).
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

## L'atelier de peinture (à construire plus tard)
Un atelier sur l'île pour dessiner et colorier au doigt.
- **Coloriage libre** : une palette de couleurs, plusieurs tailles de pinceau, une gomme et un bouton pour annuler.
- **Coloriage magique** : chaque zone du dessin porte un calcul ou un son, et chaque couleur de la palette porte une réponse. L'enfant colorie la zone avec la couleur de la bonne réponse. Le contenu suit l'âge :
  - pour la petite : des sons ou des syllabes (comme à la bibliothèque) ;
  - pour la grande : des calculs (comme à l'école).
- **Ma galerie** : un dessin fini s'accroche comme un tableau au mur de la maison, dans la pièce choisie.
- **Nouveaux dessins** : de nouveaux modèles à colorier se débloquent avec les étoiles, comme dans les magasins.
- **Imprimer** : un bouton pour imprimer le modèle vide (à colorier sur papier) ou le dessin fini.

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

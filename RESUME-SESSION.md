# Résumé pour la prochaine session (26 novembre 2026)

À coller au début de la prochaine conversation : « Lis RESUME-SESSION.md et continue. »

## Où on en est
- Branche de travail : `jardin-route-voix`. Elle est fusionnée dans `main` à chaque « oui, commite et envoie ».
- Version du cache (`sw.js`) : `ile-76`. Il faut la monter à chaque envoi.
- 168 tests, tous verts (`npm test`).
- Tout est en ligne sur `main` (dernier envoi : le 26 novembre, commit `728f21e`).
- L'app en ligne : https://alielrab.github.io/ile-aux-defis/ (GitHub Pages, branche `main`).

## Façon de travailler (préférences)
- Tout en français, avec des mots simples.
- **L'app se joue surtout sur téléphone** (demandé le 26 novembre) : chaque jeu doit tenir sur un seul écran, sans défiler. La carte et les listes (boutiques, fiches, menus) peuvent défiler. Pour mesurer : fenêtre de 360 x 720 dans le navigateur, et `document.documentElement.scrollHeight - innerHeight` doit donner 0. Les réglages « téléphone » sont à la fin de `style.css` (`@media (max-width: 759px)`).
- **Des images Higgsfield partout, pas de dessins ni d'emojis** (redit le 26 novembre), et des textes bien centrés dans les cartes.
- À la fin de chaque tâche, demander « Je commite et j'envoie sur main ? ». **Jamais de commit sans un « oui » pour ce travail-là.** Sur « oui » :
  1. commiter sur `jardin-route-voix` (message en français) et envoyer la branche ;
  2. mettre `main` à jour en avance rapide (fast-forward) ;
  3. relancer les tests et envoyer `main`.
- `tests/pwa.test.js` régénère `voix/phrases.csv` : le commiter avec le reste.
- Un nouveau `js/jeux/*.js` doit être ajouté à `FICHIERS` dans `sw.js` (vérifié par un test).
- Un nouveau champ de profil se met à deux endroits dans `js/store.js` : `charger` et `ajouterProfil` (sinon un test casse).
- **Les images sont toujours faites avec Higgsfield** (voir plus bas). Sans image, l'app garde l'ancien dessin.
  - On pose l'image dans `images/originaux/…`, puis `node images/preparer.mjs`.
  - `node images/lister-images.mjs` régénère `images/liste.csv`, la liste des images attendues.
- Règles de contenu :
  - ne jamais représenter Dieu ni les prophètes ;
  - chaque histoire a une scène sans personne (`images/recits/<clé>.webp`) ; depuis le 25 novembre, 28 histoires ont aussi une scène avec les personnages (`<clé>-gens.webp`, faite avec Higgsfield à partir de la scène sans personne), montrée **seulement** si la famille a laissé « personnages » coché (décoché par défaut pour l'islam). Les histoires de l'islam et celles où une divinité serait le personnage n'ont pas de scène avec personnages, et Dieu n'est jamais montré ;
  - le contenu reste neutre côté religion ;
  - **maison de la confiance** : tout texte sensible va d'abord dans `relecture/*.md`, et le parent le lit avant qu'il soit ouvert. Pas de mises en situation gênantes : des principes simples, et « parles-en à un adulte de confiance » ;
  - une plante dangereuse n'est jamais montrée avec un fruit appétissant ;
  - les expériences : sans feu, sans produit dangereux, sans eau bouillante, toujours avec un adulte.
- Vérifier dans le navigateur avec le serveur « ile » (port 8123).
  - Le profil de test s'appelle « Test », code 1234.
  - En cas de vieux cache : désinscrire le service worker, vider les caches, puis recharger.
- Ne jamais écrire dans un fichier le mot de passe de la base Supabase.

## Les îles et leurs jeux
- **Île du savoir** (8 places, pleine) : calcul, fractions, syllabes (la bibliothèque : lecture, dictée magique, atelier d'écriture), heure (la tour de l'horloge), musée (dinosaures en images), espace, corps (l'hôpital en images), aéroport (passeport, mots de voyage, école des langues, explorateur de la Suisse).
- **Village** (8 places, plein) : chantier, coiffeur, marché, memory (salle de jeux), meubles, mode, refuge, vétérinaire.
- **Île des créateurs** (20 ⭐, 6 places, 1 libre) : restaurant, atelier de peinture, atelier BD, salle de musique, **labo des expériences**.
- **Île de la sécurité** (4 places, pleine) : route, urgences, centre de tri, premiers secours.
- **Île du cœur** (20 ⭐, 4 places, pleine) : maison de la confiance (5 thèmes), émotions, missions de la maison, lieu de culte.
- Pour un nouveau jeu : le ranger dans un bâtiment existant (pastille « N jeux »), ou changer la carte d'une île, ou ouvrir une nouvelle île.
- **Île de la nature** (20 ⭐, 4 places, 1 libre) : cabane nature (fiches et quiz), mon potager, glacier de la plage.
- **Île des méninges** (gratuite, 6 places, 2 libres en bas) : la tour des énigmes (ouverte avec 3 jeux : trouve l'intrus, les suites logiques, les potions du laboratoire avec 12 niveaux à débloquer par âge ; `js/jeux/enigmes.js` ; l'intrus montre 100 images Higgsfield avec le mot écrit dessous, `images/enigmes/<clé>.webp`, référence de style : `images/nature/renard.webp`, et il faut écrire « NO face, no eyes, no mouth » dans la demande, sinon les objets ont un visage ; les 3 cartes de la tour, les 10 formes des suites (`forme-<nom>.webp`, `IMAGES_FORMES` dans `js/app.js`) et la fiole sont aussi des images Higgsfield ; la fiole est une image de verre vide à l'intérieur blanc, posée par-dessus les couleurs en `mix-blend-mode: multiply` et étirée par `border-image`, donc pas de `filter` sur `.fiole` ; il reste 7 jeux et l'énigme du jour, décrits dans `IDEES.md`), le défi à deux, l'atelier des robots, le labyrinthe. Ces trois jeux ont été déménagés le 25 novembre : il reste une place vide sur l'île de la nature et une sur l'île des créateurs.
- **Archipel** : 1 place « Bientôt » en bas à droite pour une future île.
- Sur la carte : pastille « N jeux » sur les bâtiments qui en cachent plusieurs, et médailles (bronze 1, argent 5, or 15 parties, `profil.parties`).
- La liste exacte est dans `js/carte.js` (`LIEUX`, `EMPLACEMENTS`, `JEUX_DU_LIEU`).

## Fait pendant la session du 24 et 25 novembre
- École des langues (allemand, anglais, 6 thèmes en images), dinosaures en images, nom donné aux animaux achetés.
- **Compte en ligne** (Supabase, projet à Francfort) : un compte parent par e-mail, une ligne par enfant, pour jouer en même temps sur plusieurs appareils (`js/en-ligne.js`, `js/config-en-ligne.js`, `serveur/supabase.sql` déjà lancé). La croyance et les voix enregistrées ne quittent jamais l'appareil.
- Jeux : dictée magique, atelier des robots, explorateur de la Suisse, cabane nature, potager, labyrinthe, glacier (avec monnaie à rendre dès 8 ans), missions de la maison, défi à deux, atelier d'écriture, premiers secours.
- Maison de la confiance : thème 4 « Les inconnus » (avec le mot de passe secret de la famille) et thème 5 « Mon corps m'appartient » (six principes, sans situations).
- Boutique : 17 articles, 7 bijoux et accessoires, une nouvelle pièce « le grenier » (40 ⭐) avec 8 meubles et jouets.
- Cabane nature : 19 fiches d'animaux en images et 17 fiches de plantes (`js/jeux/nature-fiches.js`).
- Nouvelle carte de l'île des créateurs à 6 places, tour de l'horloge recentrée.
- **Hôpital en images** : 8 pages du corps (`images/corps/`, 640x1024, jamais rognées), plus 3 vues de dos (cerveau, squelette, muscles) avec un bouton « 🔄 Voir de dos ». Les places des organes sont dans `SUR_IMAGE` (`js/jeux/atlas.js`) ; un troisième élément `'dos'` met l'organe sur la vue de dos. Le cervelet et la moelle sont de dos ; l'intestin a été redessiné dans le ventre.
- **Labo des expériences** (`js/jeux/experiences.js`) : 12 expériences à faire pour de vrai (matériel, étapes, « devine d'abord », explication, 2 ⭐ la première fois). Sources : Alloprof et Les Savants Fous.
- **Labo, tuto en images** : une image par étape (`images/experiences/<cle>-<n>.webp`, 400x400, les 47 sont faites ; Higgsfield : `aspect_ratio: 1:1`, main à manche jaune, jamais le résultat sur l'image). En bas de chaque fiche, « Tu l'as faite pour de vrai ? » : un parent tape son code, +10 ⭐ une seule fois (`validerVraie`, `profil.vraies`). **Pas de vidéo** : deux essais Higgsfield (56 crédits chacun) ne montraient pas le bon résultat, on a abandonné.

## La voix enregistrée (fait le 25 novembre)
- L'app joue une voix enregistrée (`voix/audio/<clé>.mp3`, 8 370 fichiers, 141 Mo depuis le 25 novembre au soir ; 4 741 avant) quand **tout** le texte à dire est connu, sinon la voix de la tablette (`parler` dans `js/voix.js`). Le nom du fichier vient du texte (`js/voix-cle.js`) : un texte qui change d'une lettre repasse à la voix de la tablette, il faut refaire sa voix.
- Un parent qui a choisi une voix de la tablette dans les réglages garde cette voix-là.
- Voix choisie par le parent : « française énergique », une voix copiée sur la voix française « Hélène » et dite par ElevenLabs v4 (identifiant dans `voix/lots.mjs`). Elle est sur le **nouveau compte Higgsfield** (3 000 crédits au départ, 1 690 après). Les voix toutes faites d'ElevenLabs ont un accent québécois ; celles d'Inworld sont fades.
- Pour ajouter des voix : `node voix/lister-phrases.mjs` (la liste), `node voix/lots.mjs <dossier> [filtre] [12]` (les envois, 8 lots chacun), envoyer l'archive dans le bac à sable Higgsfield, `generate_audio_batch` avec `requests: {ref: "sandbox:~/…/envoi-N.json#/requests"}`, puis `python3 aligner.py envoi-N.json` dans le bac à sable (découpe et vérifie avec la reconnaissance vocale), rapatrier `pret/` dans `voix/audio/`, et `node voix/lots.mjs` pour refaire `voix/liste.js`.
- Appris : écrire les nombres en lettres (« 7 » était lu « sette ») ; « [long pause] » ne marche qu'une fois sur cinq ; 8 fabrications à la fois au plus ; les mots seuls se découpent mal (lots de 12).
- **Découvert le 25 novembre au soir** : `parler` exige que *tout* le texte ait sa voix, sinon tout passe à la voix de la tablette. Or une question de quiz est lue avec ses réponses (« … ? A, B, ou C ? ») et la correction dit « La bonne réponse est X. » : ces phrases-là n'existaient pas en un bloc, donc presque tous les quiz parlaient avec la tablette. Corrigé dans `js/voix-cle.js` (`composer`) : une liste de réponses se joue réponse par réponse (avec « ou »), et « La bonne réponse est X. » se joue en deux morceaux.
- `node voix/couverture.mjs [jeu]` mesure, jeu par jeu, ce qui parle encore avec la tablette (il tire des centaines de questions, voir `voix/simuler.mjs`). `voix/lister-phrases.mjs` s'en sert pour ajouter à `phrases.csv` les morceaux qui manquent.
- **Le calcul et le marché gardent la voix de la tablette** : ils disent des nombres qui changent à chaque question (des milliers de phrases possibles). Les phrases avec un prénom ou un score aussi.
- Pour la découpe : lancer `aligner.py` sur une machine « xl » du bac à sable (4 processeurs), deux envois à la fois ; il compare « 8h30 » et « huit heures et demie », « 3 kg » et « trois kilos » sous la même forme. `lots.mjs` mélange les phrases (des phrases qui se ressemblent dans le même lot se découpent mal), accepte « courtes » ou « longues » en 4e argument, et écrit « une heure », « une étoile » (la voix disait « un heure »).
- **Mots courts** (1 ou 2 mots) : la reconnaissance vocale se trompe trop, on les découpe d'après les silences avec `voix/aligner-courts.py` (lots de 12 ; un lot est gardé seulement s'il y a autant de morceaux que de mots). Un sondage de 40 mots réécoutés était bon.
- **Reste sans voix après ce soir** (mesuré par `couverture.mjs`) : environ 50 heures dites (« dix heures vingt-cinq » : trop semblables pour être découpées, 3 tours essayés), les réponses qui sont un drapeau, « Le 1er août », et quelques bouts de phrase entre guillemets.
- **Pas encore de voix** : les syllabes (exprès), environ 180 mots seuls refusés par le contrôle, les phrases avec un prénom ou un calcul, et les jeux qui ne sont pas dans `voix/lister-phrases.mjs` (cabane nature, Suisse, langues, premiers secours, potager, missions, etc.).

## Les rendez-vous, le résumé parents et la suite de la tour (fait le 25 novembre, soir)
- **Rendez-vous** (`js/suivi.js`, `profil.rdv`) : bouton 🔥 en haut de l'île. Série de jours (+1 ⭐ par jour, 10 ⭐ le 7e jour de suite), coffre de la semaine (5 à 15 ⭐, un par semaine du lundi au dimanche), énigme du jour (+3 ⭐, la même pour tous les enfants du même âge, `enigmeDuJour` dans `js/jeux/enigmes.js`).
- **Résumé de la semaine** dans l'espace parents, sous chaque enfant : parties, jours joués, jeux les plus joués, « bien réussi » (8 sur 10 ou plus) et « à revoir » (moins de 5 sur 10). Il vient de `profil.journal`, rempli par `compterPartie` ; on garde 4 semaines.
- **Tour des énigmes, 7 nouveaux jeux** (`js/jeux/logique.js`, écrans dans `js/app.js`, niveaux dans `profil.niveaux`) : sudoku, taquin, parking bloqué pour tous ; tour à déplacer, code des couleurs, dessins cachés, déduction dès 8 ans. 2 ⭐ la première fois qu'un niveau est réussi. Les niveaux du parking ont été cherchés par un programme et sont écrits en dur ; un test les revérifie.
- Visuels Higgsfield : `images/enigmes/carte-<jeu>.webp`, et pour le parking `auto-rouge`, `auto`, `auto-camion` (vus du dessus, le nez à droite ; l'app tourne et recolore l'image bleue). Le format 1024x512 est refusé : demander du 1:1.
- **Pas de voix enregistrée** pour ces écrans : ils parlent avec la voix de la tablette.

## Retours du test sur téléphone (fait le 26 novembre)
- **Voix** : « La Terre. » (un nom suivi d'un point) joue la voix de « La Terre » ; « Tu es sur : … » se joue en deux morceaux (`composer` dans `js/voix-cle.js`). `voix/lister-phrases.mjs` ramasse aussi les phrases fixes des textes à trous (un `parler` dont le texte contient une partie variable). 8 422 voix. Il manque encore « Voici ta maison ! » et « Malle aux trésors ».
- **Police** : plus d'écriture attachée (« cursive » sur Android) ; tout prend la police de l'app.
- **Boutique** : on ne récite plus le rayon ; toucher un objet dit son nom.
- **Code des couleurs** : la même couleur peut être cachée plusieurs fois, c'est voulu par le parent, et la consigne le dit avec un exemple. Boutons carrés (`.jeton`) à la place des chevalets, qui se chevauchaient.
- **Dessins cachés** : consigne plus claire, et le nombre passe au vert quand sa ligne ou sa colonne est bonne.
- **Atelier BD** : aperçu de la case toujours visible, étapes numérotées, passage automatique au personnage après le décor, bouton « Case suivante ». Décors, créatures et autocollants en images (`images/bd/`, `dessinDecor` et `imageAutocollant` dans `js/jeux/bd.js`).
- **Observatoire** : astres, fusée et ciel en images (`images/espace/`, aussi pour le memory des planètes). Dans « Les tailles », les petites planètes sont aussi montrées à la loupe.
- **Glacier** : la question de monnaie remplace le cornet et les boutons (tout tient sur l'écran).
- **Cartes de menu** : texte centré, plus de mot coupé par un tiret ; images `images/vignettes/` (potager, cabane, bibliothèque, météo, missions, labo). Les vignettes du labo ne montrent **jamais le résultat** de l'expérience (l'enfant doit d'abord deviner).
- **Météo des émotions** : le choix du jour est gardé (`profil.meteo`, `noterMeteo` dans `js/suivi.js`), un baromètre de la semaine s'affiche, et le résumé des parents a une ligne « Sa météo du cœur ». L'enfant est prévenu que ses parents la voient.
- **Potager et numéros d'urgence en images** (26 novembre, après-midi) : `images/potager/` (12 légumes, `terre`, `pousse-1` à `pousse-3`) et `images/urgences/` (23 images, sans personne ; la table `IMAGES` de `js/jeux/urgences.js` dit quelle image remplace quel emoji). Les emojis restent dans les textes des urgences, parce que les voix enregistrées en dépendent : on les enlève seulement à l'écran (`sansEmoji`). Petite image dans un texte : `enImage` dans `js/app.js`, classe `.pictogramme`.

## Pas encore fait
- **Restaurant en images** (26 novembre) : `images/restaurant/` (15 ingrédients nommés par leur clé, et 5 plats `plat-<recette>`), dans le jeu, sur la balance, sur la carte des recettes et sur le plat réussi.
- **Quiz du potager en images** (26 novembre) : 16 images de plus dans `images/potager/` ; la table `IMAGES` de `js/jeux/nature.js` dit quelle image remplace quel emoji (les emojis restent dans les questions, pour les voix).
- **Fêtes et symboles du lieu de croyance en images** (26 novembre) : 50 images dans `images/croyance/`, seulement des objets, des lieux et des symboles (aucune personne, aucune divinité). La table `IMAGES` de `js/croyances-contenu.js` relie le nom de la fête ou du symbole (sans la date) à son image. À faire relire par un parent pour chaque religion.
- **Maison de la confiance en images** (26 novembre) : une image par thème dans `images/confiance/<clé du thème>.webp`, sur le bouton du thème et dans son titre. Les textes n'ont pas changé.
- **Tous les emojis restants en images** (26 novembre, soir) : `habillerEmojis` dans `js/app.js` regarde tout ce qui s'affiche et met une image à la place de chaque emoji (l'emoji reste dans la page, caché, classe `.emoji-cache`). L'image vient d'un dossier existant (table `IMAGES_EMOJIS` : énigmes, restaurant, nature, BD…) ou de `images/emoji/<code de l'emoji>.webp` (318 images, 192 px). La liste des sujets est dans `images/emojis.txt` (emoji|o objet, a animal ou personne, f drapeau|sujet) : pour un nouvel emoji, ajouter une ligne, générer l'image, la ranger dans `images/originaux/emoji/<code>.png`. Les textes n'ont pas changé (les voix en dépendent).
- **Tour des énigmes : des niveaux en plus** (26 novembre, soir) : ajoutés à la fin de chaque jeu, donc les niveaux déjà réussis restent réussis. Sudoku 18 niveaux (les petits finissent en 6x6, les grands en 9x9), taquin 16 (4x4 pour les petits, 5x5 pour les grands), parking 16 (jusqu'à 12 glissades pour les petits, 24 pour les grands), tour 6 (8 disques), code des couleurs 11 (6 pastilles), dessins cachés 18 (7 cases de côté), déduction 18 (5 enfants et 5 animaux). Tout est dans `js/jeux/logique.js`.
- **Emojis encore en place** : dans les dessins seulement (un emoji dans un dessin SVG ne peut pas devenir une image de cette façon) : les bâtiments de secours de la carte et la BD quand leur image manque. Les flèches ◀ ▶ ↩ restent des signes de texte. À relire : les 20 drapeaux (une image générée peut se tromper).
- Vérifier sur un vrai téléphone : les quiz après une réponse (une longue bulle de correction peut faire dépasser l'écran), la monnaie du glacier.
- Tangram ; minuscules dans l'atelier d'écriture ; flèche « répéter » des robots ; carte des cantons à toucher ; langue de famille.
- Île de la mer, île du cœur « Grandir ensemble ». Voir `IDEES.md`.

## À vérifier ou à faire relire par un parent
- Compte en ligne : le lien de l'e-mail de confirmation a donné une page 404 GitHub (cause inconnue) ; mot de passe oublié ; suppression du compte ; synchro entre deux vrais appareils.
- Jamais testé sur un vrai appareil : le tracé des lettres, la vitesse du glacier, les voix.
- Le potager n'a été testé que le premier jour (il faut 3 jours d'arrosage).
- Hôpital : les ronds à toucher ont été regardés de près seulement sur la digestion et le cerveau de dos.
- Textes à relire : mots des langues et prononciations, Suisse (cantons, lacs, montagnes), premiers secours, fiches des animaux et des plantes, saisons du potager, expériences, tracé des lettres, règles du tri, mots de voyage (arabe du Maroc et d'Égypte, suisse allemand).

## Higgsfield (visuels)
- **Nouveau compte depuis le 25 novembre** : les identifiants d'images de référence ci-dessous sont ceux de l'ancien compte. Sur le nouveau, on renvoie une image du projet comme référence (`media_upload` d'un PNG tiré de `images/ile/…webp`, rôle `image_references`) : c'est ce qui a servi pour l'île des méninges (référence : `fond-nature`, même disposition des 4 places) et ses bâtiments (référence : `labo`).
- Modèle `gpt_image_2_6`, qualité `medium`, fond `transparent`, `use_unlim: false`. Environ 1,25 crédit par image en 1k. Vérifier le solde en début de session (environ 680 crédits le 26 novembre : les voix du 25 au soir en ont coûté 710, bien plus que prévu, compter 4 crédits par lot de 25 phrases).
- Pour beaucoup d'images : écrire les demandes dans un fichier du bac à sable (`sandbox_exec`), puis `generate_image_batch` avec `requests: {ref: "sandbox:~/…/lot-N.json#/requests"}`. Référence de style pour les objets : `9860fc41-b72b-414c-aec5-34ec7a433aa7` (le renard).
- Au plus 8 tâches en même temps. Plus grand côté 1024 en 1k. 1024x512 et 576x1008 sont refusés (trop allongés) ; 640x1024 et 1024x640 passent.
- Les images de corps d'enfant non habillé sont refusées : partir d'une base habillée. Les muscles passent seulement en silhouette bleue.
- Images de référence (identifiants de médias) : style `1defc350-58f7-49ed-9d8f-18eb9d977c29`, bâtiment `d00af870-f96f-4f55-b4af-f2474cd41483`, meuble `16efbdd8-6b24-4117-8013-5bceb8c0728c`, avatar `55524c93-b0cf-4d69-ac4e-2c8fff1f591f`, pièce `ecedbf18-dc49-4c2f-96aa-9c0571b04844`, île à 6 places `2c3bc223-2b33-486f-aab9-5fb66c3de87d`.
- **Calques d'avatar** : faire modifier `images/avatar-base/maitre.png` (768x1024, « change seulement… »), puis `bash images/calque-avatar.sh plein.png images/originaux/avatar/<nom>.png 48 1` (1 pour une tenue, 0 pour chaussures, chapeau ou accessoire), puis `node images/preparer.mjs`. S'il manque un calque, tout l'avatar repasse en dessin.
- Voile blanc autour d'une image : couper l'alpha sous 200.

## Petits défauts connus
- Le chapeau de sorcière et le chapeau de fête sont petits ; un peu de crâne visible avec les macarons ; un fin liseré de peau longe certains pantalons.
- Erreur console sans gravité sur la carte : `<text> textLength` négatif dans `etiquette()` de `js/carte.js`.
- Nettoyage proposé, pas validé : supprimer les anciens lots de `images/` (30, 44, 45, 45bis, 45ter, 46) et `images/ile_aux_defis_lot_47_avatar_higgsfield/travail/` (114 Mo).

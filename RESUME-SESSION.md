# Résumé pour la prochaine session (25 novembre 2026)

À coller au début de la prochaine conversation : « Lis RESUME-SESSION.md et continue. »

## Où on en est
- Branche de travail : `jardin-route-voix`. Elle est fusionnée dans `main` à chaque « oui, commite et envoie ».
- Version du cache (`sw.js`) : `ile-58`. Il faut la monter à chaque envoi.
- 154 tests, tous verts (`npm test`).
- L'app en ligne : https://alielrab.github.io/ile-aux-defis/ (GitHub Pages, branche `main`).

## Façon de travailler (préférences)
- Tout en français, avec des mots simples.
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
  - les scènes d'histoires sont sans personnages ;
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
- **Village** (8 places, plein) : chantier, coiffeur, marché, memory (salle de jeux, avec le défi à deux), meubles, mode, refuge, vétérinaire.
- **Île des créateurs** (20 ⭐, 6 places, pleine) : restaurant, atelier de peinture, atelier BD, salle de musique, atelier des robots, **labo des expériences**.
- **Île de la sécurité** (4 places, pleine) : route, urgences, centre de tri, premiers secours.
- **Île du cœur** (20 ⭐, 4 places, pleine) : maison de la confiance (5 thèmes), émotions, missions de la maison, lieu de culte.
- Pour un nouveau jeu : le ranger dans un bâtiment existant (pastille « N jeux »), ou changer la carte d'une île, ou ouvrir une nouvelle île.
- **Île de la nature** (20 ⭐, 4 places, pleine) : cabane nature (fiches et quiz), mon potager, labyrinthe, glacier de la plage.
- **Archipel** : 2 places « Bientôt » en bas pour de futures îles.
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
- L'app joue une voix enregistrée (`voix/audio/<clé>.mp3`, 4 698 fichiers, 92 Mo) quand **tout** le texte à dire est connu, sinon la voix de la tablette (`parler` dans `js/voix.js`). Le nom du fichier vient du texte (`js/voix-cle.js`) : un texte qui change d'une lettre repasse à la voix de la tablette, il faut refaire sa voix.
- Un parent qui a choisi une voix de la tablette dans les réglages garde cette voix-là.
- Voix choisie par le parent : « française énergique », une voix copiée sur la voix française « Hélène » et dite par ElevenLabs v4 (identifiant dans `voix/lots.mjs`). Elle est sur le **nouveau compte Higgsfield** (3 000 crédits au départ, 1 690 après). Les voix toutes faites d'ElevenLabs ont un accent québécois ; celles d'Inworld sont fades.
- Pour ajouter des voix : `node voix/lister-phrases.mjs` (la liste), `node voix/lots.mjs <dossier> [filtre] [12]` (les envois, 8 lots chacun), envoyer l'archive dans le bac à sable Higgsfield, `generate_audio_batch` avec `requests: {ref: "sandbox:~/…/envoi-N.json#/requests"}`, puis `python3 aligner.py envoi-N.json` dans le bac à sable (découpe et vérifie avec la reconnaissance vocale), rapatrier `pret/` dans `voix/audio/`, et `node voix/lots.mjs` pour refaire `voix/liste.js`.
- Appris : écrire les nombres en lettres (« 7 » était lu « sette ») ; « [long pause] » ne marche qu'une fois sur cinq ; 8 fabrications à la fois au plus ; les mots seuls se découpent mal (lots de 12).
- **Pas encore de voix** : les syllabes (exprès), environ 180 mots seuls refusés par le contrôle, les 6 phrases « Bienvenue sur l'île… » (dans la liste, pas fabriquées), les phrases avec un prénom ou un calcul, et les jeux qui ne sont pas dans `voix/lister-phrases.mjs` (cabane nature, Suisse, langues, premiers secours, potager, missions, etc.).

## Pas encore fait
- Tangram ; minuscules dans l'atelier d'écriture ; flèche « répéter » des robots ; carte des cantons à toucher ; langue de famille.
- Île de la mer, île du cœur « Grandir ensemble ». Voir `IDEES.md`.

## À vérifier ou à faire relire par un parent
- Compte en ligne : le lien de l'e-mail de confirmation a donné une page 404 GitHub (cause inconnue) ; mot de passe oublié ; suppression du compte ; synchro entre deux vrais appareils.
- Jamais testé sur un vrai appareil : le tracé des lettres, la vitesse du glacier, les voix.
- Le potager n'a été testé que le premier jour (il faut 3 jours d'arrosage).
- Hôpital : les ronds à toucher ont été regardés de près seulement sur la digestion et le cerveau de dos.
- Textes à relire : mots des langues et prononciations, Suisse (cantons, lacs, montagnes), premiers secours, fiches des animaux et des plantes, saisons du potager, expériences, tracé des lettres, règles du tri, mots de voyage (arabe du Maroc et d'Égypte, suisse allemand).

## Higgsfield (visuels)
- Modèle `gpt_image_2_6`, qualité `medium`, fond `transparent`, `use_unlim: false`. Environ 1,25 crédit par image en 1k. Vérifier le solde en début de session.
- Au plus 8 tâches en même temps. Plus grand côté 1024 en 1k. 1024x512 et 576x1008 sont refusés (trop allongés) ; 640x1024 et 1024x640 passent.
- Les images de corps d'enfant non habillé sont refusées : partir d'une base habillée. Les muscles passent seulement en silhouette bleue.
- Images de référence (identifiants de médias) : style `1defc350-58f7-49ed-9d8f-18eb9d977c29`, bâtiment `d00af870-f96f-4f55-b4af-f2474cd41483`, meuble `16efbdd8-6b24-4117-8013-5bceb8c0728c`, avatar `55524c93-b0cf-4d69-ac4e-2c8fff1f591f`, pièce `ecedbf18-dc49-4c2f-96aa-9c0571b04844`, île à 6 places `2c3bc223-2b33-486f-aab9-5fb66c3de87d`.
- **Calques d'avatar** : faire modifier `images/avatar-base/maitre.png` (768x1024, « change seulement… »), puis `bash images/calque-avatar.sh plein.png images/originaux/avatar/<nom>.png 48 1` (1 pour une tenue, 0 pour chaussures, chapeau ou accessoire), puis `node images/preparer.mjs`. S'il manque un calque, tout l'avatar repasse en dessin.
- Voile blanc autour d'une image : couper l'alpha sous 200.

## Petits défauts connus
- Le chapeau de sorcière et le chapeau de fête sont petits ; un peu de crâne visible avec les macarons ; un fin liseré de peau longe certains pantalons.
- Erreur console sans gravité sur la carte : `<text> textLength` négatif dans `etiquette()` de `js/carte.js`.
- Nettoyage proposé, pas validé : supprimer les anciens lots de `images/` (30, 44, 45, 45bis, 45ter, 46) et `images/ile_aux_defis_lot_47_avatar_higgsfield/travail/` (114 Mo).

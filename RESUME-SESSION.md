# Résumé pour la prochaine session (24 novembre 2026)

À coller au début de la prochaine conversation : « Lis RESUME-SESSION.md et continue. »

## Où on en est
- Branche de travail : `jardin-route-voix`. Elle est fusionnée dans `main` à chaque fois que la personne dit « Oui, commite et envoie ».
- Version du cache (`sw.js`) : `ile-43`. Il faut la monter à chaque envoi.
- 131 tests, tous verts (`npm test`).
- Faits pendant cette session :
  - les visuels des lots 37 à 50 : intérieurs, îles, maison, avatar en 175 calques, 30 articles, 6 couleurs de cheveux, personnages, 40 scènes d'histoires, calendrier de l'Avent ;
  - les **mots de voyage** du passeport ;
  - le **centre de tri** (`js/jeux/tri.js`, île de la sécurité).

## Façon de travailler (préférences)
- Tout en français, avec des mots simples.
- À la fin de chaque tâche, demander « Je commite et j'envoie sur main ? ». Sur « oui » :
  1. commiter sur `jardin-route-voix` (message en français) et envoyer la branche ;
  2. mettre `main` à jour en avance rapide (fast-forward) ;
  3. relancer les tests et envoyer `main`.
- `tests/pwa.test.js` régénère `voix/phrases.csv` : le commiter avec le reste.
- Un nouveau `js/jeux/*.js` doit être ajouté à `FICHIERS` dans `sw.js` (vérifié par un test).
- Les visuels :
  1. Les lots arrivent dans `images/`. On les copie dans `images/originaux/`, puis on lance `node images/preparer.mjs`.
  2. `node images/lister-images.mjs` régénère `images/liste.csv`, la liste des images attendues.
  3. Sans image, l'app garde l'ancien dessin.
- Règles de contenu :
  - ne jamais représenter Dieu ni les prophètes ;
  - les scènes d'histoires sont sans personnages ;
  - le contenu reste neutre côté religion (l'Avent est sans religion).
- Vérifier dans le navigateur avec le serveur « ile » (port 8123).
  - Le profil de test a le code 1234.
  - En cas de vieux cache : désinscrire le service worker, vider les caches, puis recharger.

## En attente
- **Atelier des robots** (24 nov.) : île des créateurs (`js/jeux/robot.js`). Visuel attendu : `images/ile/robot.webp`. Un 5e emplacement a été ajouté sur l'île en image (à ajuster si le bâtiment tombe mal). Suite possible : une flèche « répéter ».
- **Dictée magique** (24 nov.) : dans la bibliothèque, qui propose maintenant deux jeux (`js/jeux/dictee.js`). L'île du savoir est pleine : 9 lieux pour 8 emplacements en image.
- **Compte en ligne (Supabase)** (24 nov.) : activé (projet à Francfort, `js/config-en-ligne.js`, `serveur/supabase.sql` lancé, Site URL réglée). Chaque enfant est une ligne à part, pour jouer en même temps sur plusieurs appareils. **À vérifier** : le lien de l'e-mail de confirmation a donné une page 404 GitHub (cause inconnue, Supabase était en panne ce soir-là) ; « Se connecter » après ce lien, le mot de passe oublié, la synchro entre deux vrais appareils et la suppression du compte.
- **Dinosaures en images** (24 nov.) : 16 images Higgsfield (`images/dinos/`), à toucher dans la galerie du musée et dans les questions « Quel dinosaure… ? » du quiz. Les 6 thèmes de l’école des langues sont aussi en images (`images/langues/`).
- **L'école des langues** (24 nov.) : allemand et anglais, 6 thèmes, révision des mots ratés (`js/jeux/langues.js`). À faire relire par un parent (mots et prononciations). Visuel attendu : `images/ile/langues.webp`. Suite possible : langue de famille (espace parents), paires, petites scènes.
- Deux visuels manquent pour le centre de tri : `images/ile/tri.webp` (le bâtiment) et `images/decors/tri.webp` (l'intérieur). Ils sont dans `liste.csv` ; d'ici là, le dessin et la classe servent de secours.
- À faire relire par un parent : les règles du tri, qui varient selon les communes, et les mots de voyage dans les 20 langues (surtout l'arabe du Maroc et d'Égypte et le suisse allemand).
- Nettoyage proposé, pas encore validé : supprimer les anciens lots de `images/` (30, 44, 45, 45bis, 45ter, 46) et `images/ile_aux_defis_lot_47_avatar_higgsfield/travail/` (114 Mo).
- Petits défauts connus :
  - le chapeau de sorcière et le chapeau de fête sont petits ;
  - un peu de crâne visible avec les macarons ;
  - un fin liseré de peau longe certains pantalons ;
  - erreur console sans gravité sur la carte : `<text> textLength` négatif dans `etiquette()` de `js/carte.js`.

## Higgsfield (visuels)
- Il reste environ 730 crédits. GPT Image 2.6 coûte 1,25 crédit par image en 1k.
- Au plus 8 tâches en même temps. La taille doit être un multiple de 16 (1024 px au plus en 1k).
- Les images de corps d'enfant non habillé sont refusées : toujours partir d'une base habillée.

## Prochaines idées (voir IDEES.md)
- L'école des langues (allemand, anglais, langue de famille) : la grande suite des mots de voyage.
- D'autres mini-jeux en attente :
  - Dictée magique ;
  - Explorateur de la Suisse ;
  - Petit naturaliste ;
  - Code avec un robot ;
  - Aide à la maison ;
  - Potager ;
  - Le glacier de la plage ;
  - Tangram et labyrinthes.
- L'île de la mer, l'île du cœur « Grandir ensemble », des voix pré-enregistrées (`voix/phrases.csv`).

# Tâches V1

- [x] 1. Squelette, store et profils
  - Acceptation : à la première ouverture, le parent choisit un code à 4 chiffres, puis 2 profils sont créés (prénom, avatar parmi ~8, niveau). Ensuite l'accueil montre 2 tuiles et tout est gardé après rechargement.
  - Vérif : `node --test tests/` (store : création, sauvegarde, rechargement, profils séparés) + essai dans le navigateur
  - Fichiers : `index.html`, `style.css`, `js/app.js`, `js/store.js`, `tests/store.test.js`

- [x] 2. Carte de l'île
  - Acceptation : 4 lieux (Calcul, Heure, Corps, Maison) en gros boutons ; prénom, avatar et étoiles visibles ; bouton pour changer de profil.
  - Vérif : essai manuel en largeur téléphone (360 px), tablette et ordinateur
  - Fichiers : `index.html`, `style.css`, `js/app.js`

- [x] 3. Moteur de partie + jeu Calcul
  - Acceptation : 10 questions, 3 ou 4 choix ; niveau 1 additions ≤ 10 avec objets à compter, niveau 2 tables 2–10 ; consigne lue à voix haute + bouton 🔊 ; 1 étoile par bonne réponse, +2 si 10/10, ajoutées au bon profil.
  - Vérif : `node --test tests/` (questions par niveau, choix sans doublon contenant la bonne réponse, calcul des étoiles)
  - Fichiers : `js/partie.js`, `js/jeux/calcul.js`, `tests/calcul.test.js`, `tests/partie.test.js`, `js/app.js`
  - **Point de contrôle 1**

- [x] Retours du test 1 : voix plus vivante (félicitations variées, séries, encouragements, meilleure voix), carte illustrée, avatars humains selon l'âge

- [x] Retours du test 2 : cheveux bouclés, couleur des yeux, plus de tenues, couettes et rose à gagner, salle de classe pour Calcul

- [x] 4. Maison et boutique

- [x] Retours du point de contrôle 2 : boutique visible (panneau sur la carte, pièce moins haute), « Modifier mon avatar », école à 4 opérations avec étoiles réglables (`js/reglages.js`)

- [x] Avatars redessinés (option A) : contours, ombres, 11 coiffures, 8 couleurs, 16 tenues, 7 bijoux, adaptés à l'âge
- [x] Magasins sur l'île : coiffeur, boutique (vêtements, bijoux), magasin de meubles (meubles, jouets, murs, pièces), refuge (animaux). La maison sert à placer ses objets, pièce par pièce.
- [x] Plus d'objets : 12 meubles, 7 jouets, 2 pièces (salon, salle de jeux), 5 animaux, 8 tenues, 7 bijoux, 3 coiffures, 3 couleurs
  - Acceptation : catalogue de ~6 meubles, 4 papiers peints, 4 tenues, 1 animal avec prix ; achat refusé si pas assez d'étoiles (bouton grisé) ; meuble posé sur un emplacement fixe ; papier peint, tenue et animal visibles ; tout reste après rechargement.
  - Vérif : `node --test tests/` (achat accepté/refusé, débit des étoiles, objet non rachetable)
  - Fichiers : `js/catalogue.js`, `js/maison.js`, `js/store.js`, `tests/maison.test.js`, `style.css`
  - **Point de contrôle 2**

- [x] Jouets et animaux dessinés en SVG (plus d'emojis), même style que les meubles

- [x] 5. Jeu Heure
  - Acceptation : horloge à aiguilles en SVG ; niveau 1 heures pile et demi-heures, niveau 2 quarts d'heure et 5 minutes près ; réponses au format « 3 h 30 ».
  - Vérif : `node --test tests/` (heures générées par niveau, angles des aiguilles)
  - Fichiers : `js/jeux/heure.js`, `tests/heure.test.js`

- [x] 6. Jeu Corps
  - Acceptation : personnage en SVG ; « Touche le/la … » ; ~10 parties au niveau 1, ~20 + organes au niveau 2 ; zones de toucher assez grandes.
  - Vérif : `node --test tests/` (listes par niveau) + essai au doigt sur tablette
  - Fichiers : `js/jeux/corps.js`, `tests/corps.test.js`

- [x] Hôpital : questions de culture (23 faciles, 45 difficiles) avec « Le savais-tu ? » ; horloge : aiguilles de départ loin de la réponse
- [x] Bibliothèque (syllabes), observatoire (système solaire, poids sur les planètes), restaurant (5 recettes, vraie recette validée par un parent, objets de cuisine)

- [x] Lecture complète à voix haute + boutons 🔊 ; listes agrandies (111/103 mots, 43/50 questions d'hôpital, 30/32 de l'observatoire) ; pas de répétition avant d'avoir tout vu
- [x] Lieu de croyance (espace parents + bâtiment au village + « Ma foi » / « Autres cultures ») — contenu à faire relire par un parent

- [x] 7. Écran parent
  - Acceptation : accès par code à 4 chiffres ; modifier prénom/âge/avatar/niveau (l'avatar grandit avec l'âge) ; remettre un profil à zéro (avec confirmation) ; changer le code ; **Enregistrer ma voix** : enregistrer, réécouter, refaire, supprimer des félicitations et encouragements au micro, joués au hasard à la place de la synthèse vocale.
  - Vérif : `node --test tests/` (code juste/faux, remise à zéro d'un seul profil)
  - Fichiers : `js/app.js`, `js/store.js`, `js/enregistrements.js`, `tests/store.test.js`, `index.html`

- [x] 8. Installation (PWA) et mise en ligne — en ligne sur https://alielrab.github.io/ile-aux-defis/ ; reste : essai sur la tablette (mode avion)
- [x] Hôpital : 4 choix pour tous, mauvaises réponses plausibles, questions plus poussées pour 8 ans et plus (43 / 57)
- [x] Profils illimités (« Ajouter un enfant »), identifiants uniques, croyance gardée sur l'appareil (prêt pour une synchronisation future)
  - Acceptation : `manifest.json` (plein écran, orientation libre, icônes 192/512), `sw.js` met tous les fichiers en cache ; Chrome Android propose « Installer l'application » ; publiée sur GitHub Pages.
  - Vérif : sur la tablette Android (et un téléphone), installer, passer en mode avion, fermer et relancer, faire un tour complet avec chaque profil
  - Fichiers : `manifest.json`, `sw.js`, `icons/`, `index.html`
  - **Point de contrôle 3**

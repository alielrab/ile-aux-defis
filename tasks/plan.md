# Plan : L'Île aux Défis (V1)

Source : `SPEC.md`. Liste des tâches : `tasks/todo.md`.

## Approche
Construire par tranches verticales : chaque étape donne quelque chose de jouable sur la tablette. On commence par un mini-jeu complet avec les étoiles, puis la maison qui dépense ces étoiles, puis les deux autres jeux sur le même moteur.

## Composants et dépendances
```
store.js (profils, étoiles, objets, code parent)
  ├─ app.js (navigation entre écrans) ── accueil / première ouverture / écran parent
  ├─ ile (carte)
  ├─ partie.js (moteur commun : 10 questions, étoiles, voix) ── calcul.js, heure.js, corps.js
  └─ maison.js + catalogue.js (boutique, pièce, tenue, animal)
sw.js + manifest.json (installation, hors-ligne) : indépendants, à la fin
```

## Ordre
1. Squelette + store + profils (première ouverture)
2. Carte de l'île
3. Moteur de partie + jeu Calcul → **point de contrôle 1** : une fille joue et gagne des étoiles
4. Maison + boutique → **point de contrôle 2** : la boucle jouer → acheter → décorer marche
5. Jeu Heure
6. Jeu Corps
7. Écran parent
8. PWA + mise en ligne GitHub Pages → **point de contrôle 3** : test réel sur la tablette Android, en mode avion

Les étapes 5, 6 et 7 sont indépendantes entre elles.

## Risques
| Risque | Parade |
|---|---|
| Petites parties du corps (poignet, cheville) difficiles à toucher au doigt | Zones de toucher plus larges que le dessin ; au niveau 2, choix par boutons au lieu du toucher si besoin |
| Pas de voix française hors-ligne sur la tablette | Le jeu reste jouable sans le son (icônes + texte) ; vérifié au point de contrôle 3 |
| Après une mise à jour, la tablette garde l'ancienne version en cache | Numéro de version dans `sw.js`, changé à chaque mise en ligne |
| Données effacées (cache vidé, désinstallation) | Accepté en V1 (l'export est hors périmètre) ; à signaler aux parents |

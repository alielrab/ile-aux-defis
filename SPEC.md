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

### Île
- Carte illustrée : la mer autour (vagues, bateau, poisson), une plage, des palmiers et des arbres, un village au centre avec la maison de chaque fille (sa tête à la porte, « Ma maison » ou le prénom de la sœur).
- Un bâtiment par mini-jeu : l'école (Calcul), la tour de l'horloge (Heure), l'hôpital (Corps), la bibliothèque (Syllabes), l'observatoire (Système solaire), le restaurant (Cuisine). On touche un lieu pour y entrer. Un lieu pas encore prêt affiche « Bientôt » et le dit à voix haute.
- Quatre magasins : **le coiffeur** (coiffures, couleurs), **la boutique** (vêtements, bijoux), **le magasin de meubles** (meubles, jouets, papiers peints, nouvelles pièces), **le refuge** (animaux à adopter).
- Seule la maison de la joueuse en cours s'ouvre.
- **Pas de niveau à régler** : la difficulté de chaque jeu dépend de l'âge du profil.
- **Espace parents** (bouton « 👪 Espace parents » sous les profils), protégé par le code à 4 chiffres : changer prénom et âge, remettre un profil à zéro (étoiles, achats, maison ; on garde prénom, âge, peau et yeux ; deux appuis pour confirmer), changer le code. L'avatar se modifie avec « Modifier mon avatar ». Le code est un verrou anti-fausse-manip, pas une sécurité forte.
- **Croyance de la famille** (espace parents) : christianisme catholique, protestant, orthodoxe, islam, judaïsme, bouddhisme, hindouisme, autre, ou non croyant / athée ; et les autres religions que les enfants peuvent découvrir (aucune possible). Un bâtiment apparaît alors au milieu du village : l'église, le temple, l'église orthodoxe, la mosquée, la synagogue, le temple bouddhiste, le temple hindou, ou la maison des sages (valeurs et grandes questions) pour « autre » et « non croyant ». Sans choix, pas de bâtiment.
  - Deux onglets : « Ma foi » (ou « Les grandes questions ») avec présentation, fêtes, histoires, symboles et des petites questions (10 par partie, étoiles) ; « Autres cultures », seulement les religions cochées par les parents, ton neutre et descriptif, sans quiz.
  - Aucune représentation de Dieu ni des prophètes : seulement des bâtiments, des symboles et des objets.
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

**Hôpital (Corps)** : cabinet médical (carrelage, croix, tableau des lettres), une docteure avec un stéthoscope, un patient. Surtout des questions de culture sur le corps (`js/jeux/corps-questions.js`, faciles à compléter), chacune suivie d'un « Le savais-tu ? ». 7 ans et moins : les 3 premières questions, on touche une partie sur le patient (« Touche le genou », « Avec quoi entends-tu la musique ? ») ; ensuite 43 questions faciles. 8 ans et plus : 57 questions plus poussées (os, organes, sang, nerfs, records du corps…). Toujours 4 choix, avec des mauvaises réponses plausibles et proches de la bonne (206 os : 186, 226, 260). Chiffres arrondis « environ », vérifiés pour des enfants.

**Bibliothèque (Syllabes)** : l'image du mot apparaît en ombre ; on touche les syllabes dans l'ordre pour former le mot ; une mauvaise syllabe tremble (on peut réessayer, mais la question compte comme une erreur). Le mot trouvé est dit à voix haute, l'image se dévoile, avec un « Le savais-tu ? ». Mots dans `js/jeux/syllabes-mots.js`. 7 ans et moins : 111 mots de 2 syllabes, 1 syllabe intruse. 8 ans et plus : 103 mots de 3 à 5 syllabes, 2 syllabes pièges qui se ressemblent (pa/ba, on/an, gnon/gmon…). Les images sont des emojis.

**Observatoire (Système solaire)** : trois onglets. *Voyage* : une fusée vole de planète en planète (Soleil, 8 planètes et la Lune) ; pour chacune, 3 infos amusantes et « ton poids là-bas » (on tape son poids, gardé dans le profil ; aussi modifiable dans l'espace parents). *Les tailles* : toutes les planètes à la même échelle. *Quiz* : 10 questions (30 faciles à 3 choix, 32 difficiles à 4 choix) avec « Le savais-tu ? » ; c'est là qu'on gagne les étoiles.

**Restaurant (Cuisine)** : 5 recettes (crêpes, cookies, salade de fruits, gâteau au yaourt, pain perdu). En jeu : à chaque étape, choisir l'ingrédient suivant (la carte de la recette est affichée ; pour 6 ans, la voix dit lequel), puis peser sur une balance avec des boutons (6 ans : par 50 g ; 9 ans : par 10 g). À la fin, le plat réussi, un « Le savais-tu ? » et la vraie recette débloquée (ingrédients, étapes, consignes de sécurité). Quand on l'a faite pour de vrai, un parent tape son code : +10 étoiles (`BONUS_RECETTE_REELLE`) et un objet pour la cuisine de la maison (poêle à crêpes, four, corbeille de fruits, moule à gâteau, tablier de chef), une seule fois par recette.

Étoiles par bonne réponse des autres jeux, dans `js/reglages.js` (`ETOILES_AUTRES_JEUX`) :

| | Heure | Corps | Syllabes | Système solaire | Cuisine (par étape) |
|---|---|---|---|---|---|
| 7 ans et moins | 1,5 | 1 | 1 | 1 | 1 |
| 8 ans et plus | 1 | 1 | 1 | 1 | 0,5 |

### Maison et magasins
- La maison : la chambre et la cuisine au départ (la cuisine se remplit avec les objets gagnés au restaurant) ; le salon et la salle de jeux s'achètent (30 ⭐ chacun) au magasin de meubles. On passe d'une pièce à l'autre, on place ou range ses objets, papier peint au choix par pièce. Vue de face.
- On achète dans les magasins de l'île (pas dans la maison). Catalogue dans `js/catalogue.js` (prix modifiables) : 12 meubles (6 pour la chambre, 6 pour le salon), 7 jouets, 4 papiers peints, 2 pièces, 5 animaux, 8 tenues spéciales, 7 bijoux et accessoires, 3 coiffures et 3 couleurs de cheveux.
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

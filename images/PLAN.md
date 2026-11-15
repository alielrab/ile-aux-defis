# Nouveau style visuel : le plan

**Rien n'est remplacé dans l'app.** Ce document est à relire ; je ne touche au code qu'après ton accord.

Le style visé est celui de `maquette.png.jpg` : illustration 3D douce, animaux presque réalistes, cartes crème, cadre de feuilles tropicales.

## 1. La liste des images

La liste complète est dans [liste.csv](liste.csv) (s'ouvre dans Excel) : une ligne par image, avec l'étape, le nom du fichier, la taille finale, fond transparent ou non, et le sujet.
Elle est fabriquée à partir du catalogue de l'app (`node images/lister-images.mjs`) : si on ajoute un objet, la liste suit.

| Étape | Contenu | Images | Poids estimé |
|---|---|---|---|
| 1 | Refuge : 18 animaux, 11 vêtements, 10 accessoires, cadre de feuilles, étoile | 42 | 1,1 Mo |
| 2 | Maison : 31 meubles, 12 jouets, 5 objets de cuisine, 6 couleurs de lit, 5 pièces | 59 | 2,4 Mo |
| 3 | Archipel : 6 fonds, 24 bâtiments, maison, 8 lieux de culte, bateau, palmier | 41 | 1,9 Mo |
| 4 | Intérieurs des 23 lieux et 11 personnages (maîtresse, horloger, docteure…) | 34 | 3,0 Mo |
| 5 | Personnage en calques (voir le point 3) | 141 | 6,2 Mo |
| | **Total** | **317** | **14,5 Mo** |

L'app pèse aujourd'hui 0,8 Mo. Les poids sont des estimations en WebP ; on mesurera le vrai chiffre à l'étape 1.

**Tailles.** Tu génères toujours en grand (1024 × 1024, ou 1536 × 1024 pour un décor) ; un petit script réduit ensuite à la taille de la liste et convertit en WebP.

**Ce qui reste dessiné par le code**, parce que c'est précis, interactif ou coloré à la demande :
- les papiers peints (motifs) et les couleurs de cheveux ;
- l'horloge, les fractions en pizza, les pièces de monnaie, la grue folle, la grille de musique ;
- les squelettes de dinosaures, l'atlas du corps, les dessins à colorier, l'atelier BD ;
- les illustrations des 40 histoires du lieu de croyance (à décider plus tard : ce sont 40 scènes de plus).

## 2. Le modèle de prompt

Les outils d'images comprennent mieux l'anglais. Remplace seulement `[SUJET]`.

**Objet, animal, vêtement (fond transparent)**

```
[SUJET], cute stylized 3D illustration for a children's educational game,
soft rounded shapes, semi-realistic fur and materials, big friendly eyes,
warm soft studio lighting from the top left, gentle shading,
warm pastel colour palette, clean Pixar-like render.
Single subject, centered, fully visible, three-quarter front view.
No text, no frame, no floor, no cast shadow. Transparent background.
Square image, 1024x1024.
```

**Bâtiment de l'île** : même prompt, avec `seen from the front and slightly from above, standing on a small round patch of grass` à la place de `three-quarter front view`.

**Intérieur d'un lieu (fond plein)**

```
Interior of [SUJET], cute stylized 3D illustration for a children's
educational game, warm soft lighting, warm pastel colour palette,
clean Pixar-like render. Wide view from the front, empty space in the
middle of the floor, no characters, no text. 1536x1024.
```

**À ne jamais oublier**
- **Référence de style** : donne à l'outil une image recadrée de la maquette (seulement la partie maquette, sans la capture du téléphone) à chaque génération. C'est ce qui garde le même style d'une image à l'autre, bien plus que le texte.
- **Par familles** : génère tous les chats d'un coup, puis tous les chiens. Les couleurs d'un même animal (chaton roux, gris, blanc, noir) : demande « same kitten, same pose, grey fur » à partir de la première image.
- **Fond transparent** : tous les outils ne savent pas le faire. Sinon, génère sur fond blanc uni et passe l'image dans un outil qui enlève le fond. L'ombre au sol est ajoutée par l'app.
- **Même vue pour les meubles** : de face, un peu d'en haut, lumière en haut à gauche. Sinon la pièce aura l'air d'un collage.

## 3. Le personnage personnalisable

**Le problème.** Aujourd'hui, le code combine 6 peaux, 6 yeux, 18 coiffures, 12 couleurs de cheveux, 36 tenues, 12 chaussures, 9 chapeaux et 12 accessoires. Cela fait des milliards de combinaisons : impossible d'avoir une image par combinaison. Il faut des calques qui se superposent au pixel près, et c'est exactement ce que les outils d'images font mal.

**Ma proposition : une « poupée de papier » en 5 calques, faite en dernier.**

| Calque | Images | Comment |
|---|---|---|
| Corps et visage | 36 | 6 peaux × 6 yeux, chauve, en sous-vêtements unis. Une seule pose, de face, bras un peu écartés. |
| Cheveux | 36 | 18 coiffures × 2 (devant et derrière la tête), en gris clair. **Le code les teinte** dans les 12 couleurs : pas 216 images. |
| Tenue | 36 | Chaque tenue seule, dans la même pose exacte. |
| Chaussures, chapeau | 21 | Idem. |
| Accessoires | 12 | Idem (lunettes, collier, sac…). |

**Ce que tu perds par rapport à aujourd'hui**
- **L'âge** : le personnage ne change plus de proportions entre 3 et 14 ans ; il est seulement plus petit ou plus grand.
- **Les expressions** : la météo des émotions dessine 12 visages sur le personnage. Elle garderait l'ancien dessin, ou il faudrait 12 visages de plus par peau.

**Comment obtenir des calques alignés**
- Générer d'abord **un** corps de référence, puis utiliser un outil d'édition d'image : « same character, same pose, change only the outfit to … ».
- Découper ensuite la tenue (ou la demander seule, sur le même cadre).
- Prévoir des retouches à la main : c'est la partie la plus longue du projet.

**Je te conseille un essai avant de t'engager** : 1 corps, 3 coiffures, 3 tenues. Si les calques ne s'alignent pas proprement, on garde le personnage dessiné par le code, et je le rapproche du nouveau style avec plus d'ombres et de reflets.

En attendant l'étape 5, le personnage actuel restera à côté des nouveaux animaux. Les deux styles ne se ressembleront pas : c'est le prix d'un remplacement petit à petit.

## 4. Le remplacement, petit à petit

**Le principe.** Tu déposes une image dans `images/`, au nom indiqué dans la liste. L'app l'utilise si elle existe ; sinon elle garde le dessin actuel. On peut donc remplacer une image à la fois, et rien ne casse s'il en manque.

Les images prennent la place exacte des dessins actuels (mêmes emplacements dans les pièces, mêmes cartes dans les magasins) : pas de mise en page à refaire.

**Comment déposer une image (c'est prêt)**
1. Enregistre l'image d'origine dans `images/originaux/`, au nom de la liste. Exemple : `images/originaux/animaux/chat.png`.
2. Lance `node images/preparer.mjs` : l'image est réduite, convertie en WebP, et l'app l'utilise.
Pour l'instant, seuls les animaux sont branchés (cartes du refuge, maison, vétérinaire).

**Étape 1 — le refuge (essai en vraie grandeur)**
1. Tu génères **3 animaux seulement** : lapin blanc, chaton roux, tortue.
2. J'ajoute le mécanisme « image si elle existe », le script de réduction en WebP, et le cadre de feuilles sur l'écran du refuge.
3. On regarde sur la tablette : le style, la netteté, le poids, le fond transparent.
4. Si c'est bon : les 15 autres animaux, les accessoires, les vêtements, l'intérieur du refuge.

**Point délicat du refuge : les vêtements des animaux.** Un collier ou un chapeau se pose facilement sur une image. Un pull doit épouser le corps de chaque animal : soit une image de pull par espèce (6 espèces × 5 couleurs), soit le pull devient une cape ou un foulard. À décider à l'essai.

**Étapes suivantes** : la maison (2), l'archipel (3), les intérieurs (4), le personnage (5). Une étape = un enregistrement dans git, donc on peut revenir en arrière.

**Garder l'app légère et hors ligne**
- **Format** : WebP, taille de la liste, jamais l'image d'origine. Une image de 1024 px pèse 1,5 Mo en PNG et environ 35 Ko une fois réduite.
- **Hors ligne** : toutes les images sont mises en cache à l'installation, comme le reste. Il faudra donc du wifi pour la première ouverture (14,5 Mo à la fin, 1,1 Mo après l'étape 1).
- **Plafond** : je propose 20 Mo au total. Au-delà, on baisse la qualité ou on enlève des images.
- **La maquette** (`maquette.png.jpg`, 0,9 Mo) ne part pas dans l'app.

## Ce que j'attends de toi

1. D'accord pour commencer par l'essai de 3 animaux ?
2. Quel outil d'images vas-tu utiliser ? (Cela décide du fond transparent et de l'édition « même personnage, autre tenue ».)
3. Le personnage : on tente les calques à la fin, ou on garde le dessin actuel amélioré ?

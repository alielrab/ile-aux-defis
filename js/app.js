import { nouvelEtat, ajouterProfil, charger, sauver, modifierProfil, remettreAZero, changerCode, reglerCroyance } from './store.js';
import * as croyance from './croyances.js';
import * as recits from './recits.js';
import * as rapprochements from './rapprochements.js';
import {
  PEAUX, CHEVEUX, YEUX, COIFFURES, TENUES, TENUES_DE_DEPART, COIFFURES_DE_DEPART, CHEVEUX_DE_DEPART,
  AVATAR_PAR_DEFAUT, AGE_MIN, AGE_MAX, dessinerAvatar,
} from './avatar.js';
import { dessinerIle, dessinerArchipel, LIEUX } from './carte.js';
import { ile, ileOuverte, prixIle, debloquerIle } from './archipel.js';
import { CATALOGUE, MAGASINS, PIECES, article, possede, estUtilise, acheter, utiliser, modifierAvatar, pieceManquante } from './catalogue.js';
import { dessinerPiece, apercu } from './maison.js';
import { BONUS_RECETTE_REELLE, ETOILES_ATLAS } from './reglages.js';
import { nouvellePartie, questionEnCours, repondre, terminee, etoilesGagnees, formatEtoiles } from './partie.js';
import * as calcul from './jeux/calcul.js';
import * as heure from './jeux/heure.js';
import * as corps from './jeux/corps.js';
import * as syllabes from './jeux/syllabes.js';
import * as espace from './jeux/espace.js';
import * as cuisine from './jeux/cuisine.js';
import * as marche from './jeux/marche.js';
import * as peinture from './jeux/peinture.js';
import * as emotions from './jeux/emotions.js';
import * as bd from './jeux/bd.js';
import * as atlas from './jeux/atlas.js';
import * as voixParents from './enregistrements.js';
import { parler, taire, bip, repeter } from './voix.js';
import { messageReponse } from './messages.js';

let etat = charger();
let joueuse = null;
navigator.storage?.persist?.(); // demande au navigateur de ne pas effacer les données tout seul

const $ = (s) => document.querySelector(s);

function montrer(nom) {
  for (const e of document.querySelectorAll('[data-ecran]')) e.hidden = e.dataset.ecran !== nom;
  $(`[data-ecran="${nom}"] h1`).focus();
}

function enregistrer() {
  const ok = sauver(etat);
  $('#alerte').hidden = ok;
  $('#alerte').textContent = ok ? '' : "Attention : ce navigateur n'enregistre pas les progrès (navigation privée ?).";
}

function demarrer() {
  if (!etat) return montrer('code');
  if (etat.profils.length === 0) return ouvrirProfil(); // les autres enfants : « Ajouter un enfant » dans l'espace parents
  afficherAccueil();
}

// Première ouverture : code parent
$('#form-code').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = ev.target;
  const erreur = f.querySelector('.erreur');
  if (f.code.value !== f.code2.value) return (erreur.textContent = 'Les deux codes sont différents.');
  try {
    etat = nouvelEtat(f.code.value);
  } catch (e) {
    return (erreur.textContent = e.message);
  }
  enregistrer();
  demarrer();
});

// Création d'un personnage (première ouverture, ou « Ajouter un enfant » dans l'espace parents)
const formProfil = $('#form-profil');
formProfil.age.append(new Option('Choisis…', ''), ...Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => new Option(`${AGE_MIN + i} ans`, AGE_MIN + i)));

const avatarDuFormulaire = () => Object.fromEntries(['peau', 'yeux', 'coiffure', 'cheveux', 'tenue'].map((k) => [k, formProfil[k].value]));

// Une rangée de grosses tuiles à choisir. dessin(valeur) : le contenu visuel de la tuile. choisi : la valeur cochée.
function remplirOptions(nom, valeurs, nomLisible, dessin, choisi = AVATAR_PAR_DEFAUT[nom]) {
  formProfil.querySelector(`[data-options="${nom}"]`).replaceChildren(...valeurs.map((v) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="${nom}"><span></span>`;
    Object.assign(label.firstChild, { value: v, defaultChecked: v === choisi }); // reste coché après reset()
    label.firstChild.setAttribute('aria-label', nomLisible(v));
    label.lastChild.innerHTML = dessin(v);
    return label;
  }));
}
const pastille = (couleur) => `<i class="pastille" style="background:${couleur}"></i>`;

// Création : les choix de départ. Modification : tout ce que la joueuse possède (dont ses achats).
function preparerOptions(profil) {
  const choisi = profil?.avatar ?? AVATAR_PAR_DEFAUT;
  const aElle = (type, depart) => (profil ? CATALOGUE.filter((a) => a.type === type && possede(profil, a)).map((a) => a.cle) : depart);
  remplirOptions('peau', Object.keys(PEAUX), (v) => `Peau ${v.replace('-', ' ')}`, (v) => pastille(PEAUX[v]), choisi.peau);
  remplirOptions('yeux', Object.keys(YEUX), (v) => `Yeux ${v}`, (v) => pastille(YEUX[v]), choisi.yeux);
  remplirOptions('cheveux', aElle('cheveux', CHEVEUX_DE_DEPART), (v) => `Cheveux ${v.replace('chatain', 'châtain')}`, (v) => pastille(CHEVEUX[v]), choisi.cheveux);
  remplirOptions('coiffure', aElle('coiffure', COIFFURES_DE_DEPART), (v) => COIFFURES[v], () => '', choisi.coiffure);
  remplirOptions('tenue', aElle('tenue', TENUES_DE_DEPART), (v) => TENUES[v].nom, () => '', choisi.tenue);
}
let profilModifie = null; // null = création d'un nouveau profil

// Les aperçus de coiffures et de tenues reprennent la peau et les cheveux choisis
function majApercus() {
  const a = avatarDuFormulaire();
  for (const input of formProfil.querySelectorAll('[name="coiffure"]')) input.nextSibling.innerHTML = dessinerAvatar({ ...a, coiffure: input.value }, 'tete');
  for (const input of formProfil.querySelectorAll('[name="tenue"]')) input.nextSibling.innerHTML = dessinerAvatar({ ...a, tenue: input.value }, 'corps');
  $('#apercu').innerHTML = dessinerAvatar(a, 'entier', profilModifie?.age ?? Number(formProfil.age.value));
}

formProfil.addEventListener('change', majApercus);

function ouvrirProfil(profil = null) {
  profilModifie = profil;
  preparerOptions(profil);
  formProfil.reset();
  formProfil.querySelector('.erreur').textContent = '';
  for (const e of formProfil.querySelectorAll('.seulement-creation')) e.hidden = !!profil; // prénom et âge : écran parent
  $('#annuler-profil').hidden = !profil && etat.profils.length === 0;
  $('#valider-profil').textContent = profil ? "C'est bon !" : "C'est moi !";
  $('#titre-profil').textContent = profil ? `${profil.prenom}, modifie ton personnage`
    : 'Crée ton personnage';
  majApercus();
  montrer('profil');
}
$('#annuler-profil').addEventListener('click', () => afficherAccueil());

formProfil.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = ev.target;
  try {
    if (profilModifie) modifierAvatar(profilModifie, avatarDuFormulaire());
    else ajouterProfil(etat, { prenom: f.prenom.value, age: Number(f.age.value) || undefined, avatar: avatarDuFormulaire() });
  } catch (e) {
    return (f.querySelector('.erreur').textContent = e.message);
  }
  enregistrer();
  demarrer();
});

// Accueil : qui joue ?
function afficherAccueil() {
  $('#tuiles').replaceChildren(...etat.profils.map((p) => {
    const carte = document.createElement('div');
    carte.className = 'profil';
    carte.innerHTML = `<button class="tuile"><span class="avatar">${dessinerAvatar(p.avatar, 'entier', p.age)}</span><span class="prenom"></span></button>
      <button class="modifier">✏️ Modifier mon avatar</button>`;
    carte.querySelector('.prenom').textContent = p.prenom;
    carte.querySelector('.tuile').addEventListener('click', () => { ileCourante = null; ouvrirIle(p); parler("Voici l'archipel ! Choisis une île.", { ton: 1.1 }); });
    carte.querySelector('.modifier').addEventListener('click', () => ouvrirProfil(p));
    return carte;
  }));
  montrer('accueil');
}

// L'archipel : ileCourante = l'île où se trouve la joueuse (null = la carte de l'archipel).
// Les boutons « retour » des jeux et des magasins ramènent sur l'île où l'on était.
let ileCourante = null, ileAConfirmer = null;
function ouvrirIle(p = joueuse) {
  joueuse = p;
  ileAConfirmer = null;
  $('#ile-joueuse').innerHTML = `<span class="mini-avatar">${dessinerAvatar(p.avatar, 'tete')}</span><span></span>`;
  $('#ile-joueuse').lastChild.textContent = p.prenom;
  $('#ile-etoiles').textContent = `⭐ ${formatEtoiles(p.etoiles)}`;
  $('#carte').innerHTML = ileCourante ? dessinerIle(ileCourante, etat.profils, p, etat.croyance.famille) : dessinerArchipel(p);
  $('[data-ecran="ile"] h1').textContent = ileCourante ? ile(ileCourante).nom : "L'archipel";
  montrer('ile');
}

$('#changer').addEventListener('click', afficherAccueil);

function choisirIle(id) {
  const i = ile(id), prix = prixIle(id);
  if (ileOuverte(joueuse, id)) {
    ileCourante = id;
    ouvrirIle();
    return parler(`Bienvenue sur ${i.nom.replace(/^L'île/, "l'île")} !`, { ton: 1.1 });
  }
  if (joueuse.etoiles < prix) {
    return parler(`${i.nom} coûte ${prix} étoiles. Tu en as ${formatEtoiles(joueuse.etoiles)}. Continue à jouer pour en gagner !`);
  }
  if (ileAConfirmer !== id) {
    $('#carte').innerHTML = dessinerArchipel(joueuse, id);
    ileAConfirmer = id;
    return parler(`${i.nom} coûte ${prix} étoiles. Touche encore pour la débloquer.`);
  }
  debloquerIle(joueuse, id);
  enregistrer();
  ileCourante = id;
  ouvrirIle();
  parler(`Bravo ! Tu as débloqué ${i.nom.replace(/^L'île/, "l'île")} !`, { ton: 1.15 });
}

// On touche un lieu pour y entrer (clavier : Entrée ou Espace)
function entrerLieu(cible) {
  const id = cible?.dataset.lieu, ileId = cible?.dataset.ile;
  if (ileId) return choisirIle(ileId);
  if (!id) return;
  if (id === 'archipel') { ileCourante = null; ouvrirIle(); return parler("Voici l'archipel ! Choisis une île.", { ton: 1.1 }); }
  if (id === 'maison') return ouvrirLieu('maison');
  if (id === 'croyance') return ouvrirCroyance();
  if (id === 'peinture') return ouvrirAtelier();
  if (id === 'emotions') return ouvrirEmotions();
  if (id === 'bd') return ouvrirBD();
  const l = LIEUX.find((x) => x.id === id);
  if (!l.ouvert) return parler(`${l.nom.replace('\n', ' ')} ouvre bientôt !`, { ton: 1.1 });
  if (l.type === 'magasin') return ouvrirLieu(id);
  if (id === 'calcul') return ouvrirOperations();
  if (id === 'espace') return ouvrirObservatoire();
  if (id === 'corps') return ouvrirAtlas();
  if (id === 'cuisine') return ouvrirRestaurant();
  lancerJeu(id);
}
$('#carte').addEventListener('click', (ev) => entrerLieu(ev.target.closest('[data-lieu], [data-ile]')));
$('#carte').addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' && ev.key !== ' ') return;
  ev.preventDefault();
  entrerLieu(ev.target.closest('[data-lieu], [data-ile]'));
});

// La maison (placer ses objets) et les magasins de l'île (acheter) : le même écran.
const DANS_LA_MAISON = ['meuble', 'jouet', 'animal', 'papier', 'ustensile'];
let vue = null; // 'maison' ou l'id d'un magasin
let onglet = 0; // magasin : n° du rayon ; maison : la pièce affichée est profil.maison.piece
let aConfirmer = null; // achat : 1er appui = « Acheter ? », 2e appui = on achète (évite les achats par erreur)

function ouvrirLieu(id) {
  vue = id;
  onglet = 0;
  aConfirmer = null;
  const m = MAGASINS[id];
  $('#lieu-titre').textContent = m ? m.nom : `La maison de ${joueuse.prenom}`;
  $('#lieu-message').textContent = '';
  afficherLieu();
  montrer('lieu');
  parler(`${m ? `Bienvenue ${m.nom.replace(/^Le /, 'au ').replace(/^La /, 'à la ')} !` : 'Voici ta maison !'} ${direRayon()}`, { ton: 1.1 });
}

function bouton(texte, actif, action) {
  const b = document.createElement('button');
  b.textContent = texte;
  b.setAttribute('aria-pressed', actif);
  b.addEventListener('click', action);
  return b;
}

function afficherLieu() {
  const m = MAGASINS[vue];
  $('#lieu-joueuse').innerHTML = `<span class="mini-avatar">${dessinerAvatar(joueuse.avatar, 'tete')}</span>`;
  $('#lieu-etoiles').textContent = `⭐ ${formatEtoiles(joueuse.etoiles)}`;
  const avecAvatar = m?.apercu === 'avatar';
  $('#lieu-apercu').className = `lieu-apercu ${avecAvatar ? 'avatar-grand' : 'piece'}`;
  $('#lieu-apercu').innerHTML = avecAvatar ? dessinerAvatar(joueuse.avatar, 'entier', joueuse.age) : dessinerPiece(joueuse);

  let articles;
  if (m) {
    $('#onglets').setAttribute('aria-label', 'Rayons du magasin');
    $('#onglets').replaceChildren(...m.rayons.map(([nom], i) =>
      bouton(nom, i === onglet, () => { onglet = i; aConfirmer = null; $('#lieu-message').textContent = ''; afficherLieu(); parler(direRayon()); })));
    articles = CATALOGUE.filter((a) => m.rayons[onglet][1].includes(a.type));
  } else {
    // la maison : une pièce à la fois, avec les objets qu'elle possède pour cette pièce
    const piece = joueuse.maison.piece;
    $('#onglets').setAttribute('aria-label', 'Pièces de la maison');
    $('#onglets').replaceChildren(...CATALOGUE.filter((a) => a.type === 'piece' && possede(joueuse, a)).map((a) =>
      bouton(a.nom, a.cle === piece, () => { utiliser(joueuse, a.id); enregistrer(); afficherLieu(); })));
    articles = CATALOGUE.filter((a) => DANS_LA_MAISON.includes(a.type) && a.prix !== 0 && possede(joueuse, a)
      && (!a.piece || a.piece === piece));
    $('#lieu-message').textContent = articles.length ? ''
      : piece === 'cuisine' ? 'Fais une recette du restaurant pour de vrai avec un parent : tu gagneras des objets pour ta cuisine !'
        : "Cette pièce est vide : va au magasin de meubles ou au refuge sur l'île !";
  }
  $('#rayon').replaceChildren(...articles.map(carteArticle));
}

// Ce qu'on voit dans le rayon (ou la pièce), à voix haute
const direRayon = () => {
  const noms = [...$('#rayon').querySelectorAll('.nom')].map((n) => n.textContent);
  return noms.length ? `Il y a : ${noms.join(', ')}.` : $('#lieu-message').textContent;
};

function carteArticle(a) {
  const carte = document.createElement('div');
  carte.className = 'article';
  carte.innerHTML = `<div class="apercu-article">${apercu(a, joueuse)}</div><span class="nom"></span><button class="action"></button>`;
  carte.querySelector('.nom').textContent = a.nom;
  const b = carte.querySelector('.action');
  const aMoi = possede(joueuse, a), enPlace = aMoi && estUtilise(joueuse, a);
  const porte = ['tenue', 'coiffure', 'cheveux', 'lit'].includes(a.type);
  const manque = !aMoi && pieceManquante(joueuse, a);
  if (aMoi) {
    b.textContent = a.type === 'piece' ? (enPlace ? 'Tu y es ✓' : 'Y aller')
      : enPlace ? (porte ? (a.type === 'lit' ? 'Choisi ✓' : 'Porté ✓') : a.type === 'accessoire' || a.type === 'papier' ? 'Enlever' : 'Ranger')
        : a.type === 'lit' ? 'Choisir' : porte || a.type === 'accessoire' || a.type === 'papier' ? 'Mettre' : 'Placer';
    b.disabled = enPlace && (porte || a.type === 'piece');
    b.classList.toggle('en-place', enPlace);
  } else if (manque) {
    b.textContent = `🔒 ${manque}`;
    b.disabled = true;
    b.setAttribute('aria-label', `${a.nom} : achète d'abord la pièce ${manque}`);
  } else if (joueuse.etoiles < a.prix) {
    b.textContent = `⭐ ${a.prix}`;
    b.disabled = true;
    b.setAttribute('aria-label', `${a.nom} : ${a.prix} étoiles, il t'en manque ${formatEtoiles(a.prix - joueuse.etoiles)}`);
  } else {
    const confirmer = aConfirmer === a.id;
    b.textContent = confirmer ? `Acheter ? ⭐ ${a.prix}` : `⭐ ${a.prix}`;
    b.classList.add(confirmer ? 'confirmer' : 'acheter');
    b.setAttribute('aria-label', confirmer ? `Oui, acheter ${a.nom} pour ${a.prix} étoiles` : `Acheter ${a.nom} pour ${a.prix} étoiles`);
  }
  carte.classList.toggle('a-moi', aMoi);
  b.addEventListener('click', () => toucherArticle(a));
  return carte;
}

function toucherArticle(a) {
  const message = $('#lieu-message');
  if (possede(joueuse, a)) {
    utiliser(joueuse, a.id);
    aConfirmer = null;
    message.textContent = '';
  } else if (aConfirmer !== a.id) {
    aConfirmer = a.id;
    message.textContent = `Touche encore pour acheter : ${a.nom}.`;
    parler(`Tu veux ${a.nom} ? Touche encore pour confirmer.`);
  } else {
    acheter(joueuse, a.id);
    aConfirmer = null;
    message.textContent = `Bravo, ${a.nom} est à toi !`;
    bip(true);
    parler(`Bravo ! ${a.nom}, c'est à toi !`, { ton: 1.15 });
  }
  if (a.piece) joueuse.maison.piece = a.piece; // montrer la pièce où l'objet est posé
  enregistrer();
  afficherLieu();
}

$('#lieu-retour').addEventListener('click', () => ouvrirIle());

// L'école : on choisit l'opération avant la partie
let operation = 'addition';
function ouvrirOperations() {
  $('#operations-etoiles').textContent = `⭐ ${formatEtoiles(joueuse.etoiles)}`;
  $('#operations').replaceChildren(...Object.entries(calcul.OPERATIONS).map(([op, { nom, signe }]) => {
    const b = document.createElement('button');
    b.className = 'operation';
    const gain = formatEtoiles(calcul.etoilesParBonneReponse(joueuse.age, op));
    b.innerHTML = `<span class="signe" aria-hidden="true">${signe}</span><span>${nom}</span><small>+${gain} ⭐ par bonne réponse</small>`;
    b.addEventListener('click', () => { operation = op; lancerJeu('calcul'); });
    return b;
  }));
  montrer('operations');
  parler('Que veux-tu faire ? Additions, soustractions, multiplications ou divisions ?', { ton: 1.1 });
}
$('#operations-retour').addEventListener('click', () => ouvrirIle());

// Partie de mini-jeu
const JEUX = { calcul, heure, corps, syllabes, espace, cuisine, marche, emotions, atlas, croyance, recit: croyance }; // recit : les questions d'une histoire
// Le personnage de chaque lieu, à côté du tableau : la maîtresse, l'horloger, la docteure.
const PERSONNAGES = {
  calcul: { peau: 'doree', yeux: 'noisette', coiffure: 'chignon', cheveux: 'brun', tenue: 'pull-violet' },
  heure: { peau: 'mate', yeux: 'marron', coiffure: 'courts', cheveux: 'noir', tenue: 'salopette-jaune', accessoires: ['lunettes'] },
  corps: { peau: 'brune', yeux: 'noirs', coiffure: 'queue', cheveux: 'noir', tenue: 'tshirt-turquoise', accessoires: [] },
  syllabes: { peau: 'claire', yeux: 'verts', coiffure: 'carre', cheveux: 'roux', tenue: 'robe-jaune', accessoires: ['lunettes'] },
  espace: { peau: 'foncee', yeux: 'noirs', coiffure: 'afro', cheveux: 'noir', tenue: 'heroine', accessoires: [] },
  croyance: { peau: 'mate', yeux: 'noisette', coiffure: 'longs', cheveux: 'brun', tenue: 'pull-violet', accessoires: [] },
  cuisine: { peau: 'tres-claire', yeux: 'bleus', coiffure: 'courts', cheveux: 'blond', tenue: 'mariniere', accessoires: [] },
  marche: { peau: 'brune', yeux: 'marron', coiffure: 'chignon', cheveux: 'noir', tenue: 'salopette-jaune', accessoires: [] },
  emotions: { peau: 'doree', yeux: 'verts', coiffure: 'longs', cheveux: 'roux', tenue: 'pull-violet', accessoires: [] },
};
let recette = 'crepes'; // la recette du restaurant en cours
const majuscule = (t) => t[0].toUpperCase() + t.slice(1);
let jeu, partie, horloge = null;

function lancerJeu(nom) {
  jeu = nom;
  const cle = `${nom}:${nom === 'calcul' ? operation : nom === 'croyance' ? etat.croyance.famille : nom === 'atlas' ? systemeAtlas : ''}:${joueuse.age}`, vus = new Set(joueuse.vus[cle] ?? []);
  partie = nom === 'cuisine'
    ? { questions: cuisine.etapes(recette, joueuse.age), index: 0, bonnes: 0, serie: 0 } // les étapes de la recette, dans l'ordre
    : nom === 'recit'
    ? { questions: recits.questions(recitOuvert, joueuse.age), index: 0, bonnes: 0, serie: 0 } // les questions de l'histoire, dans l'ordre
    : nouvellePartie(JEUX[nom].question, { operation, age: joueuse.age, croyance: etat.croyance.famille, systeme: systemeAtlas }, Math.random, vus);
  joueuse.vus[cle] = [...vus]; // une question ne revient pas tant que les autres n'ont pas été posées
  enregistrer();
  const lieu = { recit: 'croyance', atlas: 'corps' }[nom] ?? nom;
  $('#salle').dataset.decor = lieu;
  $('#maitre-dessin').innerHTML = nom === 'corps' ? corps.docteure(PERSONNAGES.corps, 14) : dessinerAvatar(PERSONNAGES[lieu], 'entier', 14);
  montrer('jeu');
  afficherQuestion();
}

function boutonsReponses(valeurs, libelle = String, texte = false) {
  $('#reponses').style.gridTemplateColumns = `repeat(${texte ? Math.min(2, valeurs.length) : valeurs.length}, minmax(0, 1fr))`;
  $('#reponses').replaceChildren(...valeurs.map((v) => {
    const b = document.createElement('button');
    b.className = texte ? 'reponse texte' : 'reponse';
    b.textContent = libelle(v);
    b.dataset.v = v;
    b.addEventListener('click', () => choisir(v));
    return b;
  }));
}

function afficherQuestion() {
  const q = questionEnCours(partie);
  $('#progression').textContent = `Question ${partie.index + 1} / ${partie.questions.length}`;
  $('#question').textContent = jeu === 'calcul' ? `${q.texte} = ?` : q.titre;
  $('#retour').textContent = partie.index === 0 ? `À toi, ${joueuse.prenom} !` : '';
  $('#retour').classList.remove('longue');
  $('#aide').setAttribute('aria-hidden', jeu === 'calcul'); // les images du calcul : décoratives
  horloge = null;
  if (jeu === 'calcul') {
    $('#aide').innerHTML = calcul.illustration(q.aide); // emojis seulement, pas de texte saisi
    boutonsReponses(q.choix);
  } else if (jeu === 'heure') {
    $('#aide').innerHTML = heure.dessinerHorloge(q.mode === 'lire' ? q.reponse : q.depart, q.mode === 'regler');
    if (q.mode === 'lire') boutonsReponses(q.choix, heure.ecrire);
    else afficherReglage(q);
  } else if (jeu === 'syllabes') {
    afficherSyllabes(q);
  } else if (jeu === 'marche') {
    afficherMarche(q);
  } else if (jeu === 'emotions') {
    $('#aide').innerHTML = q.mode === 'visage' ? emotions.visage(q.reponse, q.peau) : '';
    boutonsReponses(q.choix, emotions.nom, true);
  } else if (jeu === 'espace' || jeu === 'croyance' || jeu === 'recit' || jeu === 'atlas') {
    $('#aide').innerHTML = jeu === 'recit' ? recits.illustration(recitOuvert, etat.croyance.illustrations) : '';
    boutonsReponses(q.choix, String, true);
  } else if (jeu === 'cuisine') {
    if (q.mode === 'ingredient') {
      $('#aide').innerHTML = cuisine.carte(q.recette, q.etape);
      boutonsReponses(q.choix, (id) => `${cuisine.INGREDIENTS[id][1]} ${majuscule(cuisine.INGREDIENTS[id][0])}`, true);
    } else afficherPesee(q);
  } else {
    $('#aide').innerHTML = `<div class="patient${q.mode === 'choix' ? ' petit-patient' : ''}">${dessinerAvatar(corps.PATIENT, 'entier', corps.AGE_PATIENT)}</div>`;
    if (q.mode === 'choix') boutonsReponses(q.choix, String, true);
    else {
      $('#reponses').replaceChildren();
      $('#aide svg').addEventListener('click', toucherPatient);
    }
  }
  $('#ecouter').disabled = false;
  $('#question').focus();
  parler(aDire(q));
}

// Régler l'horloge : avec le doigt sur les aiguilles, ou avec les boutons (plus précis, et au clavier).
function afficherReglage(q) {
  horloge = heure.brancherHorloge($('#aide svg'), q.depart, q.pas);
  const bouton = (texte, classe, decalage, nom) => {
    const b = document.createElement('button');
    b.className = `regler ${classe}`;
    b.textContent = texte;
    b.setAttribute('aria-label', nom);
    b.addEventListener('click', () => horloge.decaler(decalage));
    return b;
  };
  const valider = document.createElement('button');
  valider.className = 'reponse valider';
  valider.textContent = "C'est l'heure ! ✓";
  valider.addEventListener('click', () => choisir(horloge.lire()));
  $('#reponses').style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  $('#reponses').replaceChildren(
    bouton('◀ heures', 'h', -60, "Petite aiguille : reculer d'une heure"), bouton('heures ▶', 'h', 60, "Petite aiguille : avancer d'une heure"),
    bouton('◀ minutes', 'm', -q.pas, `Grande aiguille : reculer de ${q.pas} minutes`), bouton('minutes ▶', 'm', q.pas, `Grande aiguille : avancer de ${q.pas} minutes`),
    valider);
}

// La bibliothèque : on touche les syllabes dans l'ordre ; une erreur fait trembler la syllabe (on peut réessayer).
function afficherSyllabes(q) {
  let place = 0, erreur = false;
  $('#aide').innerHTML = `<div class="mot-image ombre" aria-hidden="true">${q.image}</div>
    <div class="cases">${q.syllabes.map(() => '<span class="case"></span>').join('')}</div>`;
  $('#reponses').style.gridTemplateColumns = `repeat(${Math.min(q.tuiles.length, 3)}, minmax(0, 1fr))`;
  $('#reponses').replaceChildren(...q.tuiles.map((t) => {
    const b = document.createElement('button');
    b.className = 'reponse syllabe';
    b.textContent = t;
    b.addEventListener('click', () => {
      if (t !== q.syllabes[place]) {
        erreur = true;
        bip(false);
        b.classList.remove('tremble');
        void b.offsetWidth; // relancer l'animation
        b.classList.add('tremble');
        return;
      }
      $('#aide .cases').children[place].textContent = t;
      b.disabled = true;
      b.classList.add('utilisee');
      if (++place === q.syllabes.length) {
        $('#aide .mot-image').classList.remove('ombre');
        choisir(erreur ? '' : q.reponse);
      }
    });
    return b;
  }));
}

// Le restaurant : peser un ingrédient sur la balance avec les boutons, puis « C'est pesé ! »
let pesee = 0;
function afficherPesee(q) {
  pesee = 0;
  const dessiner = () => ($('#aide').innerHTML = cuisine.dessinerBalance(pesee, q.image));
  dessiner();
  const boutons = q.boutons.map((g) => {
    const b = document.createElement('button');
    b.className = 'regler';
    b.textContent = `${g > 0 ? '+' : '−'} ${Math.abs(g)} g`;
    b.addEventListener('click', () => { pesee = Math.max(0, Math.min(500, pesee + g)); dessiner(); });
    return b;
  });
  const valider = document.createElement('button');
  valider.className = 'reponse valider';
  valider.textContent = "C'est pesé ! ✓";
  valider.addEventListener('click', () => choisir(pesee));
  $('#reponses').style.gridTemplateColumns = `repeat(${boutons.length}, minmax(0, 1fr))`;
  $('#reponses').replaceChildren(...boutons, valider);
}

// Le marché : compter le porte-monnaie, payer le bon prix (on touche les pièces), rendre la monnaie.
function afficherMarche(q) {
  const etal = q.image ? `<div class="etal"><span class="produit" aria-hidden="true">${q.image}</span><span class="etiquette-prix">${marche.ecrire(q.prix)}</span></div>` : '';
  const pieces = (l) => l.map(marche.dessinArgent).join('');
  if (q.mode === 'compter') {
    $('#aide').innerHTML = `<div class="marche-aide"><div class="porte-monnaie">${pieces(q.pieces)}</div></div>`;
    return boutonsReponses(q.choix, marche.ecrire, true);
  }
  if (q.mode === 'rendre') {
    $('#aide').innerHTML = `<div class="marche-aide">${etal}<p class="paie-avec">Tu paies avec : ${marche.dessinArgent(q.donne)}</p></div>`;
    return boutonsReponses(q.choix, marche.ecrire, true);
  }
  // payer : on pose des pièces sur le comptoir, puis « Payer »
  const donnees = [];
  $('#aide').innerHTML = `<div class="marche-aide">${etal}<div class="comptoir" aria-live="polite"></div><p class="total"></p></div>`;
  const maj = () => {
    const total = donnees.reduce((a, b) => a + b, 0);
    $('#aide .comptoir').innerHTML = pieces(donnees);
    $('#aide .total').textContent = `Tu donnes : ${marche.ecrire(total)}`;
    payer.disabled = !total;
    return total;
  };
  const boutons = q.valeurs.map((v) => {
    const b = document.createElement('button');
    b.className = 'argent-bouton';
    b.innerHTML = marche.dessinArgent(v);
    b.setAttribute('aria-label', `Ajouter ${marche.dire(v)}`);
    b.addEventListener('click', () => { donnees.push(v); parler(`Tu donnes ${marche.dire(maj())}`); });
    return b;
  });
  const enlever = document.createElement('button');
  enlever.className = 'reponse';
  enlever.textContent = '↩️ Enlever';
  enlever.addEventListener('click', () => { donnees.pop(); maj(); });
  const payer = document.createElement('button');
  payer.className = 'reponse valider';
  payer.textContent = 'Payer ✓';
  payer.addEventListener('click', () => choisir(donnees.reduce((a, b) => a + b, 0)));
  $('#reponses').style.gridTemplateColumns = `repeat(${Math.min(boutons.length, 5)}, minmax(0, 1fr))`;
  $('#reponses').replaceChildren(...boutons, enlever, payer);
  enlever.classList.toggle('large', boutons.length <= 3);
  payer.classList.toggle('large', boutons.length <= 3);
  maj();
}

// L'hôpital : on touche une partie du corps du patient. À côté du patient, rien ne se passe.
function toucherPatient(ev) {
  const q = questionEnCours(partie);
  const svg = ev.currentTarget, age = corps.AGE_PATIENT;
  const { x, y } = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(svg.getScreenCTM().inverse());
  const choix = corps.touche(q.reponse, x, y, age) ? q.reponse : corps.partieTouchee(x, y, age);
  if (!choix) return;
  svg.removeEventListener('click', toucherPatient);
  svg.insertAdjacentHTML('beforeend', corps.marques(q.reponse, 'juste', age) + (choix === q.reponse ? '' : corps.marques(choix, 'faux', age)));
  choisir(choix);
}

async function choisir(choix) {
  const q = questionEnCours(partie);
  const p = partie;
  const juste = repondre(partie, choix);
  $('#ecouter').disabled = true; // la question suivante n'est pas encore affichée
  for (const b of $('#reponses').querySelectorAll('button')) {
    b.disabled = true;
    if (b.dataset.v === String(q.reponse)) b.classList.add('juste');
    else if (!juste && b.dataset.v === String(choix)) b.classList.add('faux');
  }
  if (horloge) {
    horloge.bloquer();
    horloge.regler(q.reponse); // montre la bonne heure
    $('#aide svg').classList.add(juste ? 'juste' : 'faux');
  }
  if (q.mode === 'peser' && !juste) $('#aide').innerHTML = cuisine.dessinerBalance(q.reponse, q.image); // la bonne pesée
  bip(juste);
  const m = messageReponse(juste, partie.serie);
  const ici = jeu === 'corps' && q.mode === 'toucher' ? `Ça, c'est ${corps.PARTIES[choix].nom}. ` : '';
  const correction = juste ? '' : ici + (q.solution ?? `La bonne réponse est ${q.reponse}.`);
  const suite = [q.trouve, correction, q.savaisTu && `Le savais-tu ? ${q.savaisTu}`].filter(Boolean).join(' ');
  $('#retour').textContent = `${m.texte} ${suite}`.trim();
  $('#retour').classList.toggle('longue', suite.length > 60);
  // on passe à la suite quand la phrase est finie, et pas avant un temps minimum pour voir la correction
  await Promise.all([reagir(m, juste, suite), new Promise((r) => setTimeout(r, q.savaisTu ? 3000 : juste ? 1000 : 2000))]);
  if (p !== partie || $('[data-ecran="jeu"]').hidden) return; // partie quittée entre-temps
  terminee(partie) ? finirPartie() : afficherQuestion();
}

// La voix d'un parent si elle a été enregistrée pour ce moment-là, sinon la voix de synthèse.
async function reagir(m, juste, suite) {
  if (m.type === 'serie' || !(await voixParents.jouerAuHasard(m.type))) await parler(m.texte, { ton: juste ? 1.15 : 1 });
  if (suite && !$('[data-ecran="jeu"]').hidden) await parler(suite);
}

function finirPartie() {
  const gain = etoilesGagnees(partie.bonnes, JEUX[jeu].etoilesParBonneReponse(joueuse.age, operation), partie.questions.length);
  joueuse.etoiles += gain;
  enregistrer();
  const parfait = partie.bonnes === partie.questions.length;
  $('#fin-titre').textContent = parfait ? `Parfait, ${joueuse.prenom} !` : `Bien joué, ${joueuse.prenom} !`;
  $('#fin-score').textContent = `${partie.bonnes} bonnes réponses sur ${partie.questions.length}`;
  $('#fin-etoiles').textContent = `+${formatEtoiles(gain)} ⭐`;
  $('#fin-extra').replaceChildren();
  let fin = `Tu gagnes ${formatEtoiles(gain)} étoile${gain > 1 ? 's' : ''} !${parfait ? ' Avec le bonus du sans-faute !' : ''}`;
  if (jeu === 'cuisine') { // le plat réussi, et la vraie recette débloquée
    const r = cuisine.RECETTES[recette];
    cuisine.debloquer(joueuse, recette);
    enregistrer();
    $('#fin-titre').textContent = `${r.nom} : c'est réussi, ${joueuse.prenom} !`;
    $('#fin-extra').innerHTML = `<div class="plat-reussi" aria-hidden="true">${r.plat}</div>
      <p>Recette débloquée ! Fais-la pour de vrai avec un parent : tu gagneras ${BONUS_RECETTE_REELLE} étoiles et un objet pour ta cuisine.</p>
      <p class="savais">Le savais-tu ? ${r.savaisTu}</p><button class="gros secondaire">📖 Voir la vraie recette</button>`;
    $('#fin-extra button').addEventListener('click', () => ouvrirRestaurant(recette));
    fin += ` Recette débloquée ! Le savais-tu ? ${r.savaisTu}`;
  }
  if (jeu === 'atlas' || jeu === 'corps') {
    $('#fin-extra').innerHTML = '<button class="gros secondaire">📖 Retour à l’atlas</button>';
    $('#fin-extra button').addEventListener('click', () => { afficherAtlas(jeu === 'atlas' ? systemeAtlas : null); montrer('atlas'); });
  }
  if (jeu === 'emotions') {
    $('#fin-extra').innerHTML = '<button class="gros secondaire">☁️ Ma météo du jour</button>';
    $('#fin-extra button').addEventListener('click', () => { afficherEmotions(); montrer('emotions'); });
  }
  if (jeu === 'recit') { // retour aux histoires
    $('#fin-extra').innerHTML = '<button class="gros secondaire">📚 Les autres histoires</button>';
    $('#fin-extra button').addEventListener('click', () => { recitOuvert = null; afficherCroyance(); montrer('croyance'); });
  }
  montrer('fin');
  parler(fin, { ton: 1.15 });
}

$('#quitter').addEventListener('click', () => { partie = null; taire(); voixParents.arreter(); ouvrirIle(); });
$('#ecouter').addEventListener('click', () => parler(aDire(questionEnCours(partie))));
for (const b of document.querySelectorAll('.reecouter')) b.addEventListener('click', () => repeter());

// La consigne, puis les réponses proposées à voix haute (pour celles qui ne lisent pas encore bien)
function aDire(q) {
  if (jeu === 'marche') return marche.aDire(q);
  const ou = (l) => (l.length > 1 ? `${l.slice(0, -1).join(', ')}, ou ${l.at(-1)} ?` : l[0]);
  if (jeu === 'emotions') return `${q.consigne} ${ou(q.choix.map(emotions.nom))}`;
  if (q.mode === 'choix') return `${q.consigne} ${ou(q.choix)}`;
  if (q.mode === 'lire') return `${q.consigne} ${ou(q.choix.map(heure.dire))}`;
  if (q.mode === 'ingredient') return `${q.consigne} ${ou(q.choix.map((id) => cuisine.INGREDIENTS[id][0]))}`;
  return q.consigne;
}
$('#rejouer').addEventListener('click', () => lancerJeu(jeu));
$('#retour-ile').addEventListener('click', () => ouvrirIle());
for (const b of document.querySelectorAll('.retour-ile')) b.addEventListener('click', () => { taire(); arreterRespiration(); ouvrirIle(); });
const etoilesJoueuse = () => { for (const e of document.querySelectorAll('.etoiles-joueuse')) e.textContent = `⭐ ${formatEtoiles(joueuse.etoiles)}`; };

// L'observatoire : voyage en fusée, tailles des planètes, quiz (les étoiles se gagnent au quiz)
let astre = 3; // la Terre
function ouvrirObservatoire() {
  etoilesJoueuse();
  afficherObservatoire('voyage');
  montrer('observatoire');
  const a = espace.ASTRES[astre];
  parler(`Bienvenue à l'observatoire ! Touche une planète pour y aller en fusée. Tu es sur : ${a.nom}. ${a.faits.join(' ')}`, { ton: 1.1 });
}

function afficherObservatoire(vue) {
  for (const b of $('#obs-onglets').children) b.setAttribute('aria-pressed', b.dataset.vue === vue);
  if (vue === 'tailles') {
    $('#obs-vue').innerHTML = `<p class="info">Les planètes à la même échelle. Le Soleil est si gros qu'on n'en voit qu'un petit bout !</p>
      <div class="defile">${espace.dessinerTailles()}</div>`;
    return parler("Voici les planètes à la même échelle. Jupiter est la plus grosse. Le Soleil est si gros qu'on n'en voit qu'un bout !");
  }
  $('#obs-vue').innerHTML = `${espace.dessinerVoyage(astre)}
    <div class="obs-nav"><button class="rond" data-aller="-1" aria-label="Astre précédent">◀</button><h2 id="obs-nom"></h2><button class="rond" data-aller="1" aria-label="Astre suivant">▶</button></div>
    <div class="carte obs-carte"><ul id="obs-faits"></ul>
      <label class="obs-poids">Ton poids sur Terre (en kilos) <input id="obs-poids" type="number" inputmode="numeric" min="8" max="150" step="1"></label>
      <p id="obs-resultat" class="obs-resultat" role="status"></p></div>`;
  $('#obs-poids').value = joueuse.poids ?? '';
  $('#obs-poids').addEventListener('input', (ev) => {
    const n = Number(ev.target.value);
    if (Number.isInteger(n) && n >= 8 && n <= 150) { joueuse.poids = n; enregistrer(); }
    montrerAstre(false);
  });
  for (const b of $('#obs-vue').querySelectorAll('[data-aller]')) b.addEventListener('click', () => allerA((astre + Number(b.dataset.aller) + espace.ASTRES.length) % espace.ASTRES.length));
  for (const g of $('#obs-vue').querySelectorAll('[data-astre]')) {
    g.addEventListener('click', () => allerA(Number(g.dataset.astre)));
    g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); allerA(Number(g.dataset.astre)); } });
  }
  montrerAstre(false);
}

function allerA(i) {
  astre = i;
  $('#obs-vue .fusee').style.transform = `translate(${(1000 / espace.ASTRES.length) * (i + 0.5)}px, 62px)`; // la fusée s'envole
  montrerAstre(true);
}

function montrerAstre(dire) {
  const a = espace.ASTRES[astre];
  $('#obs-nom').textContent = a.nom;
  $('#obs-faits').replaceChildren(...a.faits.map((f) => Object.assign(document.createElement('li'), { textContent: f })));
  const poids = Number($('#obs-poids').value);
  $('#obs-resultat').textContent = a.pasDePoids ?? (poids >= 8 && poids <= 150
    ? `Ici, tu pèserais comme ${espace.poidsSur(a, poids)} kg sur Terre${a.gravite > 1 ? ' : plus lourd !' : a.gravite < 1 ? ' : plus léger !' : '.'}`
    : 'Écris ton poids pour savoir combien tu pèserais ici.');
  if (dire) parler(`${a.nom}. ${a.faits.join(' ')} ${$('#obs-resultat').textContent}`);
}

for (const b of $('#obs-onglets').children) b.addEventListener('click', () => (b.dataset.vue === 'quiz' ? lancerJeu('espace') : afficherObservatoire(b.dataset.vue)));

// Le lieu de croyance : « Ma foi » (ou « Les grandes questions ») et « Autres cultures » (choisies par les parents)
let ongletCroyance = 'foi', culture = null, recitOuvert = null; // recitOuvert : l'histoire en cours de lecture
function ouvrirCroyance() {
  etoilesJoueuse();
  ongletCroyance = 'foi';
  recitOuvert = null;
  culture = etat.croyance.decouvrir[0] ?? null;
  afficherCroyance(true);
  montrer('croyance');
}

function afficherCroyance(dire = false) {
  const { famille, decouvrir } = etat.croyance, c = croyance.CROYANCES[famille], sagesse = c.contenu === 'sagesse';
  $('#croyance-titre').textContent = c.lieu;
  const onglets = [['foi', sagesse ? '💭 Les grandes questions' : '🙏 Ma foi'], ...(decouvrir.length ? [['autres', '🌍 Autres cultures']] : []),
    ...(rapprochements.disponible(etat.croyance) ? [['ensemble', '🤝 Ce qui nous rapproche']] : [])];
  $('#croyance-onglets').replaceChildren(...onglets.map(([k, nom]) => bouton(nom, k === ongletCroyance, () => { ongletCroyance = k; recitOuvert = null; afficherCroyance(true); })));
  const vue = $('#croyance-vue');
  vue.replaceChildren();
  let texte;
  if (recitOuvert) {
    texte = afficherRecit(vue, recitOuvert);
  } else if (ongletCroyance === 'ensemble') {
    texte = afficherRapprochements(vue);
  } else if (ongletCroyance === 'autres') {
    const choix = document.createElement('div');
    choix.className = 'onglets';
    choix.setAttribute('aria-label', 'Religions à découvrir');
    choix.replaceChildren(...decouvrir.map((k) => bouton(croyance.CROYANCES[k].nom, k === culture, () => { culture = k; recitOuvert = null; afficherCroyance(true); })));
    vue.append(choix);
    texte = contenuCroyance(vue, croyance.CROYANCES[culture].contenu, false);
  } else {
    texte = contenuCroyance(vue, c.contenu, sagesse);
    const quiz = document.createElement('button');
    quiz.className = 'gros';
    quiz.textContent = '⭐ Petites questions';
    quiz.addEventListener('click', () => lancerJeu('croyance'));
    vue.append(quiz);
  }
  if (dire) parler(texte);
}

// Présentation, fêtes, histoires, symboles : des cartes, chacune avec son bouton 🔊. Renvoie la présentation (lue à l'arrivée).
function contenuCroyance(vue, cle, sagesse) {
  const c = croyance.CONTENUS[cle];
  const p = document.createElement('p');
  p.className = 'carte presentation';
  p.textContent = c.presentation;
  vue.append(p);
  const rubrique = (titre, elements, versCarte) => {
    const h = document.createElement('h2');
    h.textContent = titre;
    const grille = document.createElement('div');
    grille.className = 'cartes-croyance';
    grille.replaceChildren(...elements.map((e) => {
      const [image, nom, texte, savais] = versCarte(e);
      const carte = document.createElement('div');
      carte.className = 'carte carte-croyance';
      carte.innerHTML = `<div class="tete-carte"><span class="symbole" aria-hidden="true"></span><h3></h3><button class="rond" aria-label="Écouter">🔊</button></div><p></p>${savais ? '<p class="savais"></p>' : ''}`;
      carte.querySelector('.symbole').textContent = image;
      carte.querySelector('h3').textContent = nom;
      carte.querySelector('p').textContent = texte;
      if (savais) carte.querySelector('.savais').textContent = `Le savais-tu ? ${savais}`;
      carte.querySelector('button').addEventListener('click', () => parler(`${nom}. ${texte}${savais ? ` Le savais-tu ? ${savais}` : ''}`));
      return carte;
    }));
    vue.append(h, grille);
  };
  rubrique(sagesse ? '🎉 Fêtes de chez nous' : '🎉 Fêtes', c.fetes, (f) => f);
  const histoires = recits.recitsDe(cle);
  if (histoires.length) vue.append(titreRubrique('📚 Histoires'), tuilesRecits(histoires));
  else if (c.histoires) rubrique('💭 Grandes questions', c.histoires, ([titre, texte]) => ['💭', titre, texte]);
  rubrique('✨ Symboles', c.symboles, (s) => s);
  return c.presentation;
}

const titreRubrique = (texte) => Object.assign(document.createElement('h2'), { textContent: texte });

// Les histoires : une tuile par histoire (son image et son titre). Les personnages ne sont dessinés que si la famille l'a choisi.
function tuilesRecits(liste) {
  const grille = document.createElement('div');
  grille.className = 'tuiles-recits';
  grille.replaceChildren(...liste.map((r) => {
    const b = document.createElement('button');
    b.className = 'tuile-recit';
    b.innerHTML = `${recits.illustration(r, etat.croyance.illustrations)}<span></span>`;
    b.lastChild.textContent = r.titre;
    b.addEventListener('click', () => { recitOuvert = r; afficherCroyance(true); window.scrollTo(0, 0); });
    return b;
  }));
  return grille;
}

// Une histoire : l'image, le texte (lu en entier à voix haute), puis les petites questions.
function afficherRecit(vue, r) {
  const retour = document.createElement('button');
  retour.className = 'gros secondaire';
  retour.textContent = '← Toutes les histoires';
  retour.addEventListener('click', () => { recitOuvert = null; afficherCroyance(); });
  const carte = document.createElement('article');
  carte.className = 'carte recit';
  carte.innerHTML = `<div class="tete-carte"><h2></h2><button class="rond" aria-label="Réécouter l'histoire">🔊</button></div>
    ${recits.illustration(r, etat.croyance.illustrations)}<div class="texte-recit"></div><p class="source"></p>`;
  carte.querySelector('h2').textContent = r.titre;
  carte.querySelector('.texte-recit').replaceChildren(...r.texte.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
  carte.querySelector('.source').textContent = `D'après : ${r.source}`;
  carte.querySelector('button').addEventListener('click', () => parler(recits.texteALire(r)));
  const quiz = document.createElement('button');
  quiz.className = 'gros';
  quiz.textContent = `⭐ ${r.questions.length} petites questions`;
  quiz.addEventListener('click', () => lancerJeu('recit'));
  vue.append(retour, carte, quiz);
  return recits.texteALire(r);
}

// Ce qui nous rapproche, ce qui nous différencie : seulement les croyances choisies par les parents.
function afficherRapprochements(vue) {
  const toutes = rapprochements.cartes(etat.croyance, joueuse.age);
  const intro = document.createElement('p');
  intro.className = 'carte presentation';
  intro.textContent = "Les religions et les façons de penser ont des choses en commun, et d'autres qui sont différentes. Ici, chacune est racontée comme la voient ceux qui y croient.";
  vue.append(intro);
  for (const [type, titre] of [['commun', '🤝 Ce qui nous rapproche'], ['difference', '🧭 Ce qui nous différencie']]) {
    const liste = toutes.filter((p) => p.type === type);
    if (!liste.length) continue;
    const grille = document.createElement('div');
    grille.className = 'cartes-croyance';
    grille.replaceChildren(...liste.map((p) => {
      const carte = document.createElement('div');
      carte.className = 'carte carte-croyance';
      carte.innerHTML = `<div class="tete-carte"><span class="symbole" aria-hidden="true"></span><h3></h3><button class="rond" aria-label="Écouter">🔊</button></div>${p.intro ? '<p></p>' : ''}<ul class="points-de-vue"></ul>`;
      carte.querySelector('.symbole').textContent = p.image;
      carte.querySelector('h3').textContent = p.titre;
      if (p.intro) carte.querySelector('p').textContent = p.intro;
      carte.querySelector('ul').replaceChildren(...p.lignes.map(([qui, quoi]) => {
        const li = document.createElement('li');
        li.innerHTML = '<strong></strong> ';
        li.firstChild.textContent = `${qui} :`;
        li.append(quoi);
        return li;
      }));
      carte.querySelector('button').addEventListener('click', () => parler([p.titre, p.intro, ...p.lignes.map(([qui, quoi]) => `${qui} : ${quoi}`)].filter(Boolean).join(' ')));
      return carte;
    }));
    vue.append(titreRubrique(titre), grille);
  }
  const fin = document.createElement('p');
  fin.className = 'carte presentation conclusion';
  fin.textContent = `💛 ${rapprochements.CONCLUSION}`;
  vue.append(fin);
  return `Ce qui nous rapproche, ce qui nous différencie. ${intro.textContent} Touche le haut-parleur d'une carte pour l'écouter. ${rapprochements.CONCLUSION}`;
}

// L'atelier de peinture : peinture libre, coloriage, coloriage magique, galerie (accrocher dans la maison, imprimer).
let atelier = null; // la vue en cours : { mode: 'accueil' | 'choisir' | 'colorier' | 'libre' | 'galerie' | 'fini', … }
const el = (tag, props = {}, ...enfants) => { const e = Object.assign(document.createElement(tag), props); e.append(...enfants); return e; };
const gros = (texte, action, classe = 'gros') => { const b = el('button', { className: classe, textContent: texte }); b.addEventListener('click', action); return b; };
const ditCalcul = (t) => t.replace('×', 'fois').replace('−', 'moins').replace('+', 'plus');

function ouvrirAtelier() {
  etoilesJoueuse();
  afficherAtelier({ mode: 'accueil' });
  montrer('atelier');
  parler("Bienvenue à l'atelier de peinture ! Tu peux peindre avec ton doigt, colorier un dessin, ou faire un coloriage magique. Tes dessins vont dans ta galerie, et tu peux les accrocher dans ta maison.", { ton: 1.1 });
}

function afficherAtelier(vue) {
  atelier = vue;
  etoilesJoueuse();
  const v = $('#atelier-vue');
  v.replaceChildren();
  if (vue.mode !== 'accueil') v.append(gros('← L’atelier', () => { afficherAtelier({ mode: 'accueil' }); parler("Que veux-tu faire ?"); }, 'gros secondaire retour-atelier'));
  ({ accueil: vueAccueilAtelier, choisir: vueChoisirModele, colorier: vueColorier, libre: vueLibre, galerie: vueGalerie, fini: vueFini })[vue.mode](v, vue);
}

function vueAccueilAtelier(v) {
  const n = joueuse.dessins.length;
  v.append(el('div', { className: 'atelier-menu' },
    gros('🖌️ Peinture libre', () => { afficherAtelier({ mode: 'libre' }); parler('Choisis une couleur et peins avec ton doigt !'); }),
    gros('🖍️ Coloriage', () => { afficherAtelier({ mode: 'choisir', magique: false }); parler('Quel dessin veux-tu colorier ?'); }),
    gros('✨ Coloriage magique', () => { afficherAtelier({ mode: 'choisir', magique: true }); parler(`Coloriage magique ! Chaque couleur a ${joueuse.age <= 7 ? 'un son' : 'un nombre'}. Quel dessin veux-tu ?`); }),
    gros(`🖼️ Ma galerie (${n} / ${peinture.GALERIE_MAX})`, () => { afficherAtelier({ mode: 'galerie' }); parler(n ? 'Voici ta galerie. Tu peux accrocher un dessin dans ta maison.' : "Ta galerie est vide. Fais un dessin, il viendra ici !"); })));
}

// Choisir un dessin à colorier ; un dessin fermé montre son prix (deux appuis pour le débloquer)
function vueChoisirModele(v, vue) {
  v.append(el('div', { className: 'modeles' }, ...Object.entries(peinture.MODELES).map(([cle, m]) => {
    const ouvert = peinture.modeleOuvert(joueuse, cle);
    const b = el('button', { className: `modele${ouvert ? '' : ' ferme'}` });
    b.innerHTML = `${peinture.dessinerModele(cle)}<span></span>`;
    b.lastChild.textContent = ouvert ? m.nom : vue.aConfirmer === cle ? 'Touche encore !' : `${m.nom} · ⭐ ${m.prix}`;
    b.addEventListener('click', () => {
      if (ouvert) return commencerColoriage(cle, vue.magique);
      if (joueuse.etoiles < m.prix) return parler(`${m.nom} coûte ${m.prix} étoiles. Tu en as ${formatEtoiles(joueuse.etoiles)}. Continue à jouer !`);
      if (vue.aConfirmer !== cle) { afficherAtelier({ ...vue, aConfirmer: cle }); return parler(`${m.nom} coûte ${m.prix} étoiles. Touche encore pour le débloquer.`); }
      peinture.debloquerModele(joueuse, cle);
      enregistrer();
      parler(`Bravo ! ${m.nom} est à toi !`, { ton: 1.15 });
      commencerColoriage(cle, vue.magique);
    });
    return b;
  })));
}

function commencerColoriage(cle, magique) {
  const vue = { mode: 'colorier', cle, magique, remplissage: {}, historique: [], couleur: null, justes: new Set(), etiq: magique ? peinture.magique(cle, joueuse.age) : null };
  afficherAtelier(vue);
  parler(magique
    ? (joueuse.age <= 7 ? "Touche une couleur pour écouter son son. Puis colorie les parties où tu entends ce son. Touche une partie pour l'écouter."
      : 'Colorie chaque partie avec la couleur du résultat de son calcul.')
    : 'Choisis une couleur, puis touche une partie du dessin pour la colorier.');
}

function vueColorier(v, vue) {
  const { cle, magique, etiq } = vue, m = peinture.MODELES[cle];
  const etiquettes = magique ? Object.fromEntries(Object.entries(etiq.zones).filter(([z]) => !vue.justes.has(z))) : {};
  const zoneDessin = el('div', { className: 'toile-cadre' });
  zoneDessin.innerHTML = peinture.dessinerModele(cle, vue.remplissage, etiquettes, { cliquable: true });
  zoneDessin.addEventListener('click', (ev) => {
    const z = ev.target.closest('[data-zone]')?.dataset.zone;
    if (!z) return;
    const texte = magique ? etiq.zones[z] : null;
    if (!vue.couleur) return parler(magique && !vue.justes.has(z) ? (joueuse.age <= 7 ? texte : `${ditCalcul(texte)} ?`) : "Choisis d'abord une couleur.");
    if (magique) {
      if (vue.justes.has(z)) return;
      if (!peinture.bonneCouleur(cle, z, vue.couleur)) {
        bip(false);
        ev.target.classList.add('tremble');
        return parler(joueuse.age <= 7 ? `Pas cette couleur ! Écoute bien : ${texte}.` : `Pas encore ! Combien font ${ditCalcul(texte)} ?`);
      }
      vue.justes.add(z);
      bip(true);
    } else vue.historique.push([z, vue.remplissage[z]]);
    vue.remplissage[z] = peinture.couleur(vue.couleur)[2];
    if (magique && vue.justes.size === m.zones.length) return finirMagique(vue);
    afficherAtelier(vue);
  });
  const couleurs = magique ? Object.keys(etiq.palette) : peinture.COULEURS.map(([c]) => c);
  const palette = el('div', { className: 'palette', role: 'group', ariaLabel: 'Couleurs' }, ...couleurs.map((c) => {
    const [, nom, hex] = peinture.couleur(c);
    const b = el('button', { className: 'pot', ariaLabel: magique ? `${nom} : ${etiq.palette[c]}` : nom });
    b.style.background = hex;
    b.setAttribute('aria-pressed', c === vue.couleur);
    if (magique) b.append(el('span', { textContent: etiq.palette[c] }));
    b.addEventListener('click', () => { vue.couleur = c; afficherAtelier(vue); parler(magique ? (joueuse.age <= 7 ? etiq.palette[c] : `${nom} : ${etiq.palette[c]}`) : nom); });
    return b;
  }));
  const actions = el('div', { className: 'actions-atelier' });
  if (!magique) actions.append(gros('↩️ Annuler', () => { const [z, avant] = vue.historique.pop() ?? []; if (z) { if (avant) vue.remplissage[z] = avant; else delete vue.remplissage[z]; afficherAtelier(vue); } }, 'gros secondaire'));
  actions.append(gros('🖨️ Imprimer', () => imprimerColoriage(vue), 'gros secondaire'));
  if (!magique) actions.append(gros('✅ Terminé', () => garderOeuvre({ type: 'modele', modele: cle, remplissage: { ...vue.remplissage } })));
  v.append(el('h2', { textContent: m.nom }), zoneDessin, palette, actions);
}

function finirMagique(vue) {
  const gain = peinture.etoilesMagique(vue.cle, joueuse.age);
  joueuse.etoiles += gain;
  let galerie = true;
  try { peinture.ajouterOeuvre(joueuse, { type: 'modele', modele: vue.cle, remplissage: { ...vue.remplissage } }); } catch { galerie = false; }
  enregistrer();
  afficherAtelier({ mode: 'fini', cle: vue.cle, remplissage: vue.remplissage, gain, galerie });
  parler(`Bravo ${joueuse.prenom} ! Ton coloriage magique est fini. Tu gagnes ${formatEtoiles(gain)} étoiles !${galerie ? ' Il est dans ta galerie.' : ' Ta galerie est pleine : enlève un dessin pour garder les prochains.'}`, { ton: 1.15 });
}

function vueFini(v, vue) {
  const d = el('div', { className: 'toile-cadre' });
  d.innerHTML = peinture.dessinerModele(vue.cle, vue.remplissage);
  v.append(el('h2', { textContent: `Bravo, ${joueuse.prenom} !` }), el('p', { className: 'gain', textContent: `+${formatEtoiles(vue.gain)} ⭐` }), d,
    el('div', { className: 'actions-atelier' }, gros('🖼️ Ma galerie', () => afficherAtelier({ mode: 'galerie' })),
      gros('✨ Un autre', () => afficherAtelier({ mode: 'choisir', magique: true }), 'gros secondaire')));
}

// Peinture libre au doigt (ou à la souris)
function vueLibre(v, vue) {
  vue.traits ??= [];
  vue.couleur ??= 'bleu';
  vue.taille ??= 14;
  const toile = el('canvas', { width: 800, height: 600, className: 'toile' });
  const ctx = toile.getContext('2d');
  const tracer = (t) => {
    ctx.strokeStyle = t.c; ctx.fillStyle = t.c; ctx.lineWidth = t.l; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (t.p.length === 1) { ctx.beginPath(); ctx.arc(t.p[0][0], t.p[0][1], t.l / 2, 0, Math.PI * 2); ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(...t.p[0]); for (const p of t.p.slice(1)) ctx.lineTo(...p); ctx.stroke();
  };
  const redessiner = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 800, 600); for (const t of vue.traits) tracer(t); };
  redessiner();
  const pos = (ev) => { const r = toile.getBoundingClientRect(); return [((ev.clientX - r.left) * 800) / r.width, ((ev.clientY - r.top) * 600) / r.height]; };
  let trait = null;
  toile.addEventListener('pointerdown', (ev) => {
    toile.setPointerCapture(ev.pointerId);
    trait = { c: vue.gomme ? '#ffffff' : peinture.couleur(vue.couleur)[2], l: vue.gomme ? vue.taille * 1.6 : vue.taille, p: [pos(ev)] };
    vue.traits.push(trait);
    tracer(trait);
  });
  toile.addEventListener('pointermove', (ev) => { if (!trait) return; trait.p.push(pos(ev)); tracer({ ...trait, p: trait.p.slice(-2) }); });
  for (const fin of ['pointerup', 'pointercancel']) toile.addEventListener(fin, () => { trait = null; });
  const majOutils = () => { for (const b of v.querySelectorAll('[data-outil]')) b.setAttribute('aria-pressed', b.dataset.outil === (vue.gomme ? 'gomme' : String(vue.taille))); for (const b of v.querySelectorAll('.pot')) b.setAttribute('aria-pressed', !vue.gomme && b.dataset.c === vue.couleur); };
  const palette = el('div', { className: 'palette', role: 'group', ariaLabel: 'Couleurs' }, ...peinture.COULEURS.map(([c, nom, hex]) => {
    const b = el('button', { className: 'pot', ariaLabel: nom });
    b.dataset.c = c;
    b.style.background = hex;
    b.addEventListener('click', () => { vue.couleur = c; vue.gomme = false; majOutils(); parler(nom); });
    return b;
  }));
  const outil = (texte, cle, nom, action) => { const b = gros(texte, () => { action(); majOutils(); parler(nom); }, 'outil'); b.dataset.outil = cle; b.setAttribute('aria-label', nom); return b; };
  const outils = el('div', { className: 'outils', role: 'group', ariaLabel: 'Pinceaux' },
    outil('•', '6', 'Pinceau fin', () => { vue.taille = 6; vue.gomme = false; }),
    outil('●', '14', 'Pinceau moyen', () => { vue.taille = 14; vue.gomme = false; }),
    outil('⬤', '28', 'Gros pinceau', () => { vue.taille = 28; vue.gomme = false; }),
    outil('🧽', 'gomme', 'La gomme', () => { vue.gomme = true; }));
  const actions = el('div', { className: 'actions-atelier' },
    gros('↩️ Annuler', () => { vue.traits.pop(); redessiner(); }, 'gros secondaire'),
    gros(vue.aEffacer ? 'Vraiment ? Toucher encore' : '🗑️ Tout effacer', () => {
      if (!vue.aEffacer) { vue.aEffacer = true; afficherAtelier(vue); return parler('Tout effacer ? Touche encore pour confirmer.'); }
      afficherAtelier({ mode: 'libre', couleur: vue.couleur, taille: vue.taille });
    }, 'gros secondaire'),
    gros('🖨️ Imprimer', () => imprimer(`<img src="${toile.toDataURL('image/png')}" alt="Ma peinture">`, 'Ma peinture'), 'gros secondaire'),
    gros('✅ Terminé', () => {
      if (!vue.traits.length) return parler("Ta feuille est encore blanche. Peins quelque chose d'abord !");
      const petit = el('canvas', { width: 400, height: 300 }); // une petite image, pour garder de la place sur la tablette
      petit.getContext('2d').drawImage(toile, 0, 0, 400, 300);
      garderOeuvre({ type: 'libre', image: petit.toDataURL('image/jpeg', 0.75) });
    }));
  v.append(el('div', { className: 'toile-cadre' }, toile), palette, outils, actions);
  majOutils();
}

function garderOeuvre(oeuvre) {
  try {
    peinture.ajouterOeuvre(joueuse, oeuvre);
  } catch (e) {
    return parler(e.message);
  }
  enregistrer();
  afficherAtelier({ mode: 'galerie' });
  parler('Bravo ! Ton dessin est dans ta galerie. Tu peux l’accrocher dans ta maison.', { ton: 1.15 });
}

// La galerie : accrocher dans une pièce de la maison (une par pièce), imprimer, enlever (deux appuis)
function vueGalerie(v, vue) {
  const pieces = Object.keys(PIECES).filter((k) => possede(joueuse, article(`piece:${k}`)));
  if (!joueuse.dessins.length) v.append(el('p', { className: 'carte presentation', textContent: 'Ta galerie est vide. Fais un dessin : il viendra ici !' }));
  v.append(el('div', { className: 'galerie' }, ...joueuse.dessins.map((d, i) => {
    const carte = el('div', { className: 'carte oeuvre' });
    carte.innerHTML = peinture.dessinerOeuvre(d);
    const ou = pieces.filter((k) => joueuse.maison.tableaux[k] === d.id).map((k) => PIECES[k].nom.toLowerCase());
    if (ou.length) carte.append(el('p', { className: 'accroche', textContent: `🖼️ Accroché : ${ou.join(', ')}` }));
    const choix = el('div', { className: 'accrocher', role: 'group', ariaLabel: 'Accrocher dans' }, ...pieces.map((k) => {
      const b = gros(PIECES[k].nom, () => {
        peinture.accrocher(joueuse, d.id, k);
        enregistrer();
        afficherAtelier({ mode: 'galerie' });
        parler(joueuse.maison.tableaux[k] === d.id ? `Ton dessin est accroché dans ${PIECES[k].nom.toLowerCase()} !` : 'Dessin décroché.');
      }, 'petit');
      b.setAttribute('aria-pressed', joueuse.maison.tableaux[k] === d.id);
      return b;
    }));
    carte.append(el('p', { className: 'consigne-accrocher', textContent: 'Accrocher dans :' }), choix, el('div', { className: 'actions-atelier' },
      gros('🖨️', () => imprimer(peinture.dessinerOeuvre(d), `Dessin de ${joueuse.prenom}`), 'petit'),
      gros(vue.aEnlever === d.id ? 'Vraiment ?' : '🗑️', () => {
        if (vue.aEnlever !== d.id) { afficherAtelier({ mode: 'galerie', aEnlever: d.id }); return parler('Enlever ce dessin ? Touche encore pour confirmer.'); }
        peinture.enleverOeuvre(joueuse, d.id);
        enregistrer();
        afficherAtelier({ mode: 'galerie' });
      }, 'petit')));
    carte.querySelector('svg').setAttribute('aria-label', `Dessin ${i + 1}`);
    return carte;
  })));
}

// Imprimer : on montre seulement ce qui est dans #impression (voir @media print dans style.css)
function imprimer(contenu, titre) {
  $('#impression').innerHTML = `<h1></h1>${contenu}`;
  $('#impression h1').textContent = titre;
  window.print();
}
// Le coloriage à imprimer : le dessin vide (avec les étiquettes et la légende des couleurs pour le coloriage magique)
function imprimerColoriage(vue) {
  const m = peinture.MODELES[vue.cle];
  const legende = vue.magique ? `<ul class="legende">${Object.entries(vue.etiq.palette).map(([c, t]) => {
    const [, nom, hex] = peinture.couleur(c);
    return `<li><span style="background:${hex}"></span><strong>${t}</strong> = ${nom}</li>`;
  }).join('')}</ul>` : '';
  imprimer(peinture.dessinerModele(vue.cle, {}, vue.magique ? vue.etiq.zones : {}) + legende, vue.magique ? `Coloriage magique : ${m.nom}` : `Coloriage : ${m.nom}`);
}

// La météo des émotions : « Ma météo du jour » (rien n'est enregistré), respirer ensemble, et « Devine l'émotion » (jeu à étoiles)
let respiration = null; // le minuteur de l'exercice de respiration en cours
function arreterRespiration() { clearTimeout(respiration); respiration = null; }

function ouvrirEmotions() {
  etoilesJoueuse();
  afficherEmotions();
  montrer('emotions');
  parler("Bienvenue à la météo des émotions ! Quel temps fait-il dans ton cœur aujourd'hui ? Tu peux aussi jouer à deviner les émotions.", { ton: 1.1 });
}

function afficherEmotions(choix = null) {
  arreterRespiration();
  const v = $('#emotions-vue');
  v.replaceChildren(el('h2', { textContent: "☁️ Quel temps fait-il dans ton cœur aujourd'hui ?" }));
  v.append(el('div', { className: 'meteo' }, ...emotions.METEO.map(([cle, image, nom, reponse]) => {
    const b = el('button', { className: 'temps' }, el('span', { className: 'image-temps', textContent: image, ariaHidden: 'true' }), el('span', { textContent: nom }));
    b.setAttribute('aria-pressed', cle === choix);
    b.addEventListener('click', () => { afficherEmotions(cle); parler(`${nom}. ${reponse}`); });
    return b;
  })));
  if (choix) {
    const [, , , reponse] = emotions.METEO.find(([c]) => c === choix);
    v.append(el('p', { className: 'carte presentation', textContent: reponse }));
  }
  v.append(gros('🫧 Respirer avec moi', () => respirer(v)), gros("⭐ Devine l'émotion", () => { arreterRespiration(); lancerJeu('emotions'); }));
}

// Respiration guidée : 3 fois « inspire » (4 secondes), « souffle » (4 secondes), avec une bulle qui grandit et rétrécit
function respirer(v) {
  arreterRespiration();
  v.querySelector('.bulle-respiration')?.remove();
  const bulle = el('div', { className: 'bulle-respiration', role: 'status' }, el('span', { textContent: 'On y va ?' }));
  v.append(bulle);
  bulle.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const etapes = ['Inspire par le nez…', 'Souffle doucement…', 'Inspire par le nez…', 'Souffle doucement…', 'Inspire par le nez…', 'Souffle doucement…', 'Bravo ! Tu te sens plus calme ?'];
  let i = 0;
  const suite = () => {
    if (!document.body.contains(bulle) || $('[data-ecran="emotions"]').hidden) return arreterRespiration(); // on a quitté l'écran
    const t = etapes[i];
    bulle.firstChild.textContent = t;
    bulle.className = `bulle-respiration ${t.startsWith('Inspire') ? 'gonfle' : t.startsWith('Souffle') ? 'degonfle' : ''}`;
    parler(t.replace('…', ''));
    if (++i < etapes.length) respiration = setTimeout(suite, 4000);
  };
  parler('Viens respirer avec moi. Regarde la bulle.');
  respiration = setTimeout(suite, 2500);
}

// L'atelier BD : inventer une bande dessinée, la relire à voix haute, l'imprimer
const NOMS_ILE = { calcul: 'la maîtresse', heure: "l'horloger", corps: 'la docteure', syllabes: 'la bibliothécaire', espace: "l'astronome", cuisine: 'le cuisinier', marche: 'la marchande' };
// Tous les personnages qu'on peut mettre dans une case : la famille, les personnages de l'île, les créatures
function personnagesBD() {
  return [
    ...etat.profils.map((p) => [`profil:${p.id}`, p.prenom]),
    ...Object.entries(NOMS_ILE).map(([k, nom]) => [`ile:${k}`, nom]),
    ...bd.CREATURES.map(([k, , nom]) => [`creature:${k}`, nom]),
  ];
}
const nomBD = (id) => personnagesBD().find(([k]) => k === id)?.[1] ?? 'Quelqu’un';
function dessinPersoBD(id, x, y, l, h) {
  const [type, cle] = id.split(/:(.*)/);
  if (type === 'creature') return bd.dessinCreature(cle, x, y, l, h);
  const svg = type === 'profil' ? (() => { const p = etat.profils.find((q) => String(q.id) === cle); return p && dessinerAvatar(p.avatar, 'entier', p.age); })()
    : PERSONNAGES[cle] && (cle === 'corps' ? corps.docteure(PERSONNAGES.corps, 14) : dessinerAvatar(PERSONNAGES[cle], 'entier', 14));
  return svg ? svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${l}" height="${h}" `) : '';
}

let bdVue = null;
function ouvrirBD() {
  etoilesJoueuse();
  afficherBD({ mode: 'accueil' });
  montrer('bd');
  parler("Bienvenue à l'atelier BD ! Invente une petite histoire en cases : choisis un décor, des personnages et ce qu'ils disent.", { ton: 1.1 });
}

function afficherBD(vue) {
  bdVue = vue;
  const v = $('#bd-vue');
  v.replaceChildren();
  if (vue.mode !== 'accueil') v.append(gros('← L’atelier BD', () => afficherBD({ mode: 'accueil' }), 'gros secondaire retour-atelier'));
  ({ accueil: vueAccueilBD, editer: vueEditerBD, mes: vueMesBD })[vue.mode](v, vue);
}

function vueAccueilBD(v) {
  v.append(el('div', { className: 'atelier-menu' },
    gros('✏️ Nouvelle BD', () => {
      afficherBD({ mode: 'editer', bd: bd.nouvelleBD(joueuse.age), caseActive: 0, onglet: 'decor' });
      parler(`Ta BD a ${bd.nombreDeCases(joueuse.age)} cases. Commence par choisir le décor de la première case.`);
    }),
    gros(`📚 Mes BD (${joueuse.bds.length} / ${bd.BD_MAX})`, () => { afficherBD({ mode: 'mes' }); parler(joueuse.bds.length ? 'Voici tes BD.' : "Tu n'as pas encore de BD. Invente-en une !"); })));
}

const bande = (b, { cliquable = false, active = -1 } = {}) => {
  const d = el('div', { className: 'bande' });
  d.innerHTML = b.cases.map((c, i) => bd.dessinerCase(c, dessinPersoBD, { cliquable, numero: i }).replace('class="case-bd', `data-case="${i}" class="case-bd${i === active ? ' active' : ''}`)).join('');
  return d;
};

function vueEditerBD(v, vue) {
  const b = vue.bd, c = b.cases[vue.caseActive];
  const titre = el('input', { className: 'titre-bd', placeholder: 'Le titre de ma BD', maxLength: bd.TEXTE_MAX, value: b.titre });
  titre.setAttribute('aria-label', 'Le titre de ma BD');
  titre.addEventListener('input', () => { b.titre = titre.value; });
  const zoneBande = bande(b, { cliquable: true, active: vue.caseActive });
  zoneBande.addEventListener('click', (ev) => {
    const i = ev.target.closest('[data-case]')?.dataset.case;
    if (i === undefined) return;
    afficherBD({ ...vue, caseActive: Number(i) });
    parler(`Case ${Number(i) + 1}.`);
  });
  const onglets = el('div', { className: 'onglets', role: 'group', ariaLabel: 'Que veux-tu changer ?' },
    ...[['decor', '🏞️ Décor'], ['0', '⬅️ À gauche'], ['1', '➡️ À droite'], ['auto', '⭐ Autocollant']].map(([k, nom]) =>
      bouton(nom, k === vue.onglet, () => afficherBD({ ...vue, onglet: k }))));
  const panneau = el('div', { className: 'panneau-bd' });
  // un bouton de choix : un dessin (ou rien) et un nom
  const choisir = (actif, dessin, nom, action) => { const x = el('button', { className: 'choix-bd' }); x.innerHTML = `${dessin}<span></span>`; x.lastChild.textContent = nom; x.setAttribute('aria-pressed', actif); x.addEventListener('click', action); return x; };
  const maj = (dire) => { afficherBD(vue); if (dire) parler(dire); };
  if (vue.onglet === 'decor') {
    panneau.append(el('div', { className: 'grille-bd' }, ...Object.entries(bd.DECORS).map(([k, [nom, dessin]]) =>
      choisir(c.decor === k, `<svg viewBox="0 0 300 240" aria-hidden="true">${dessin}</svg>`, nom, () => { c.decor = k; maj(nom); }))));
  } else if (vue.onglet === 'auto') {
    panneau.append(el('div', { className: 'grille-bd petite' }, choisir(!c.autocollant, '', 'Aucun', () => { c.autocollant = null; maj('Aucun autocollant.'); }),
      ...bd.AUTOCOLLANTS.map((a) => choisir(c.autocollant === a, `<span class="autocollant" aria-hidden="true">${a}</span>`, '', () => { c.autocollant = a; maj(); }))));
  } else {
    const k = Number(vue.onglet);
    panneau.append(el('h3', { textContent: 'Qui ?' }), el('div', { className: 'grille-bd' },
      choisir(!c.perso[k], '', 'Personne', () => { c.perso[k] = null; maj('Personne.'); }),
      ...personnagesBD().map(([id, nom]) => choisir(c.perso[k] === id, `<svg viewBox="0 0 104 168" aria-hidden="true">${dessinPersoBD(id, 0, 0, 104, 168)}</svg>`, nom, () => { c.perso[k] = id; maj(nom); }))));
    const texte = el('input', { className: 'texte-bulle', placeholder: 'Ou écris ici…', maxLength: bd.TEXTE_MAX, value: c.bulles[k] });
    texte.setAttribute('aria-label', 'Ce que dit le personnage');
    texte.addEventListener('change', () => { c.bulles[k] = bd.nettoyer(texte.value); maj(c.bulles[k]); });
    panneau.append(el('h3', { textContent: 'Que dit-il ? Que dit-elle ?' }), el('div', { className: 'phrases' },
      gros('Rien', () => { c.bulles[k] = ''; maj('Pas de bulle.'); }, `petit${c.bulles[k] ? '' : ' choisi'}`),
      ...bd.PHRASES.map((p) => gros(p, () => { c.bulles[k] = p; maj(p); }, `petit${c.bulles[k] === p ? ' choisi' : ''}`))), texte);
  }
  const actions = el('div', { className: 'actions-atelier' },
    gros('🔊 Lire ma BD', () => parler(bd.texteALire(b, nomBD)), 'gros secondaire'),
    gros('🖨️ Imprimer', () => imprimerBD(b), 'gros secondaire'),
    gros('✅ Terminé', () => {
      try { bd.ajouterBD(joueuse, b); } catch (e) { return parler(e.message); }
      enregistrer();
      afficherBD({ mode: 'mes' });
      parler('Bravo ! Ta BD est rangée dans « Mes BD ». Veux-tu l’écouter ?', { ton: 1.15 });
    }));
  v.append(titre, zoneBande, el('h2', { textContent: `Case ${vue.caseActive + 1}` }), onglets, panneau, actions);
}

function vueMesBD(v, vue) {
  if (!joueuse.bds.length) v.append(el('p', { className: 'carte presentation', textContent: "Tu n'as pas encore de BD. Invente-en une !" }));
  for (const b of [...joueuse.bds].reverse()) {
    v.append(el('div', { className: 'carte une-bd' }, el('h3', { textContent: b.titre || 'Ma BD' }), bande(b), el('div', { className: 'actions-atelier' },
      gros('🔊 Lire', () => parler(bd.texteALire(b, nomBD)), 'petit'),
      gros('🖨️ Imprimer', () => imprimerBD(b), 'petit'),
      gros(vue.aEnlever === b.id ? 'Vraiment ?' : '🗑️ Enlever', () => {
        if (vue.aEnlever !== b.id) { afficherBD({ mode: 'mes', aEnlever: b.id }); return parler('Enlever cette BD ? Touche encore pour confirmer.'); }
        bd.enleverBD(joueuse, b.id);
        enregistrer();
        afficherBD({ mode: 'mes' });
      }, 'petit'))));
  }
}

const imprimerBD = (b) => imprimer(`<div class="bande">${b.cases.map((c, i) => bd.dessinerCase(c, dessinPersoBD, { numero: i })).join('')}</div>`, bd.nettoyer(b.titre) || `La BD de ${joueuse.prenom}`);

// L'hôpital : l'atlas du corps (une page par système, des fiches à découvrir, un quiz par page) et le grand quiz du corps
let systemeAtlas = 'squelette', organeAtlas = null;
function ouvrirAtlas() {
  etoilesJoueuse();
  afficherAtlas(null);
  montrer('atlas');
  parler("Bienvenue à l'hôpital ! Voici l'atlas du corps. Choisis une page pour découvrir ton corps.", { ton: 1.1 });
}

// systeme : null = la liste des pages
function afficherAtlas(systeme, dire = false) {
  const v = $('#atlas-vue');
  v.replaceChildren();
  if (!systeme) {
    v.append(el('div', { className: 'atelier-menu' }, ...Object.entries(atlas.SYSTEMES).map(([k, s]) => {
      const vus = joueuse.atlas?.[k]?.length ?? 0, fini = vus === s.organes.length;
      return gros(`${s.image} ${s.nom}${fini ? ' ✓' : vus ? ` (${vus}/${s.organes.length})` : ''}`, () => { systemeAtlas = k; organeAtlas = null; afficherAtlas(k, true); }, `gros${fini ? ' secondaire' : ''}`);
    })), gros('⭐ Le grand quiz du corps', () => lancerJeu('corps'), 'gros secondaire'));
    return;
  }
  const s = atlas.SYSTEMES[systeme], vus = joueuse.atlas?.[systeme] ?? [];
  const o = s.organes.find((x) => x.id === organeAtlas);
  const corpsSvg = el('div', { className: 'atlas-dessin' });
  corpsSvg.innerHTML = atlas.dessinerSysteme(systeme, vus, organeAtlas);
  const ouvrir = (id) => {
    organeAtlas = id;
    const complet = atlas.decouvrir(joueuse, systeme, id);
    if (complet) joueuse.etoiles += ETOILES_ATLAS;
    enregistrer();
    afficherAtlas(systeme);
    const org = s.organes.find((x) => x.id === id);
    parler(`${org.nom}. ${atlas.fiche(org, joueuse.age)} Le savais-tu ? ${org.savais}${complet ? ` Bravo, tu as découvert toute la page ! Tu gagnes ${ETOILES_ATLAS} étoiles.` : ''}`);
  };
  corpsSvg.addEventListener('click', (ev) => { const id = ev.target.closest('[data-organe]')?.dataset.organe; if (id) ouvrir(id); });
  corpsSvg.addEventListener('keydown', (ev) => { const id = ev.target.closest('[data-organe]')?.dataset.organe; if (id && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ouvrir(id); } });
  const noms = el('div', { className: 'phrases' }, ...s.organes.map((x) => {
    const b = gros(`${vus.includes(x.id) ? '✓ ' : ''}${x.nom}`, () => ouvrir(x.id), `petit${x.id === organeAtlas ? ' choisi' : ''}`);
    return b;
  }));
  const carte = o
    ? el('div', { className: 'carte carte-croyance' }, el('div', { className: 'tete-carte' }, el('h3', { textContent: o.nom }),
        gros('🔊', () => parler(`${o.nom}. ${atlas.fiche(o, joueuse.age)} Le savais-tu ? ${o.savais}`), 'rond')),
      el('p', { textContent: atlas.fiche(o, joueuse.age) }), el('p', { className: 'savais', textContent: `Le savais-tu ? ${o.savais}` }))
    : el('p', { className: 'carte presentation', textContent: s.intro });
  v.append(gros('← L’atlas', () => afficherAtlas(null), 'gros secondaire retour-atelier'), el('h2', { textContent: `${s.image} ${s.nom}` }),
    el('p', { className: 'progres-atlas', textContent: `${vus.length} / ${s.organes.length} découvertes${vus.length === s.organes.length ? ' ✓' : ` · découvre tout pour gagner ${ETOILES_ATLAS} ⭐`}` }),
    el('div', { className: 'atlas-page' }, corpsSvg, el('div', { className: 'atlas-fiche' }, carte, noms)),
    gros('🧠 Je teste mes connaissances', () => lancerJeu('atlas')));
  if (dire) parler(`${s.nom}. ${s.intro}`);
}

// Le restaurant : les 5 recettes, et la vraie recette à faire avec un parent (validée avec le code parent)
function ouvrirRestaurant(cle = null) {
  etoilesJoueuse();
  afficherRestaurant(cle);
  montrer('restaurant');
  if (!cle) parler(`Bienvenue au restaurant ! Quelle recette veux-tu cuisiner ? ${Object.values(cuisine.RECETTES).map((r) => r.nom).join(', ')}.`, { ton: 1.1 });
  else direRecette(cle);
}

function direRecette(cle) {
  const r = cuisine.RECETTES[cle];
  parler(`${r.nom}, pour ${r.vraie.pour}. Toujours avec un adulte. Les ingrédients : ${r.vraie.ingredients.join(', ')}. Les étapes : ${r.vraie.etapes.join(' ')}`);
}

function afficherRestaurant(cle) {
  $('#recettes').replaceChildren(...Object.entries(cuisine.RECETTES).map(([k, r]) => {
    const statut = joueuse.recettes[k];
    const c = document.createElement('div');
    c.className = 'article recette';
    c.innerHTML = `<div class="apercu-article plat" aria-hidden="true">${r.plat}</div><span class="nom"></span>
      <small>${statut === 'faite' ? '✅ Faite pour de vrai' : statut ? '📖 À faire avec un parent' : 'À cuisiner'}</small>
      <button class="action acheter">Cuisiner</button>${statut ? '<button class="action">📖 La recette</button>' : ''}`;
    c.querySelector('.nom').textContent = r.nom;
    const [cuisiner, voir] = c.querySelectorAll('button');
    cuisiner.addEventListener('click', () => { recette = k; lancerJeu('cuisine'); });
    voir?.addEventListener('click', () => { afficherRestaurant(k); $('#vraie-recette').scrollIntoView({ behavior: 'smooth' }); direRecette(k); });
    return c;
  }));
  const r = cuisine.RECETTES[cle], statut = joueuse.recettes[cle];
  $('#vraie-recette').hidden = !r || !statut;
  if (!r || !statut) return;
  const objet = article(`ustensile:${r.objet}`).nom;
  $('#vraie-recette').innerHTML = `<h2>${r.plat} ${r.nom} <small>(${r.vraie.pour})</small></h2>
    <p class="attention">⚠️ Toujours avec un adulte : le four, la poêle et les couteaux, c'est lui qui s'en occupe.</p>
    <h3>Ingrédients</h3><ul>${r.vraie.ingredients.map((x) => `<li>${x}</li>`).join('')}</ul>
    <h3>Étapes</h3><ol>${r.vraie.etapes.map((x) => `<li>${x}</li>`).join('')}</ol>
    ${statut === 'faite' ? `<p class="erreur ok">✅ Recette faite pour de vrai ! Gagné pour ta cuisine : ${objet}.</p>`
      : `<form class="valider-recette" novalidate><p>Vous l'avez faite ensemble ? Un parent tape son code pour valider : +${BONUS_RECETTE_REELLE} ⭐ et un objet pour la cuisine (${objet}).</p>
        <label>Code parent <input name="code" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>
        <p class="erreur" role="status"></p><button class="gros">Valider la recette</button></form>`}`;
  $('#vraie-recette form')?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const message = ev.target.querySelector('.erreur');
    if (ev.target.code.value !== etat.code) return noter(message, "Ce n'est pas le bon code.");
    cuisine.validerRecette(joueuse, cle);
    enregistrer();
    etoilesJoueuse();
    afficherRestaurant(cle);
    bip(true);
    parler(`Bravo ! Tu gagnes ${BONUS_RECETTE_REELLE} étoiles, et un cadeau pour ta cuisine : ${objet} !`, { ton: 1.15 });
  });
}

// Espace parents (code à 4 chiffres) : prénom et âge, remise à zéro, voix enregistrées, code.
$('#ouvrir-parents').addEventListener('click', () => {
  $('#form-parents-code').reset();
  $('#form-parents-code .erreur').textContent = '';
  montrer('parents-code');
});
for (const b of document.querySelectorAll('.retour-accueil')) b.addEventListener('click', () => { micro?.arreter(); voixParents.arreter(); afficherAccueil(); });

$('#form-parents-code').addEventListener('submit', (ev) => {
  ev.preventDefault();
  if (ev.target.code.value !== etat.code) return ($('#form-parents-code .erreur').textContent = "Ce n'est pas le bon code.");
  afficherParents();
});

// Un message sous un formulaire : en vert si tout s'est bien passé, en rouge sinon.
const noter = (el, texte, ok = false) => { el.textContent = texte; el.classList.toggle('ok', ok); };

let aRemettreAZero = null; // 1er appui = « Vraiment ? », 2e appui = on efface

function afficherParents(message = null) {
  aRemettreAZero = null;
  $('#parents-profils').replaceChildren(...etat.profils.map((p) => {
    const f = document.createElement('form');
    f.className = 'carte parents-carte';
    f.noValidate = true;
    f.innerHTML = `<div class="parents-tete"><span class="mini-avatar">${dessinerAvatar(p.avatar, 'tete')}</span><h2></h2></div>
      <label>Prénom <input name="prenom" maxlength="20" autocomplete="off"></label>
      <label>Âge <select name="age"></select></label>
      <label>Poids en kilos <small>(facultatif, pour l'observatoire)</small> <input name="poids" type="number" inputmode="numeric" min="8" max="150"></label>
      <p class="info-profil"></p>
      <p class="erreur" role="status"></p>
      <div class="actions"><button class="gros">Enregistrer</button><button type="button" class="gros secondaire zero">Remettre à zéro</button></div>`;
    f.querySelector('h2').textContent = p.prenom;
    f.prenom.value = p.prenom;
    f.poids.value = p.poids ?? '';
    f.age.append(...Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => new Option(`${AGE_MIN + i} ans`, AGE_MIN + i, false, AGE_MIN + i === p.age)));
    f.querySelector('.info-profil').textContent = `⭐ ${formatEtoiles(p.etoiles)} étoiles, ${p.objets.length} achat${p.objets.length > 1 ? 's' : ''}`;
    const info = f.querySelector('.erreur');
    if (message?.profil === p) noter(info, message.texte, true);
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      try {
        modifierProfil(p, { prenom: f.prenom.value, age: Number(f.age.value), poids: f.poids.value === '' ? null : Number(f.poids.value) });
      } catch (e) {
        return noter(info, e.message);
      }
      enregistrer();
      afficherParents({ profil: p, texte: 'Enregistré ✓' });
    });
    f.querySelector('.zero').addEventListener('click', (ev) => {
      if (aRemettreAZero !== p) {
        aRemettreAZero = p;
        ev.target.textContent = 'Vraiment ? Toucher encore';
        noter(info, `Les étoiles, les achats et la maison de ${p.prenom} seront effacés.`);
        return;
      }
      remettreAZero(p);
      enregistrer();
      afficherParents({ profil: p, texte: 'Remis à zéro ✓' });
    });
    return f;
  }));
  if (message) return; // on reste où on est sur la page
  afficherReglageCroyance();
  $('#form-nouveau-code').reset();
  $('#form-nouveau-code .erreur').textContent = '';
  voixMessage('');
  afficherVoix();
  montrer('parents');
}

$('#ajouter-enfant').addEventListener('click', () => ouvrirProfil());

$('#form-nouveau-code').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = ev.target, message = f.querySelector('.erreur');
  if (f.code.value !== f.code2.value) return noter(message, 'Les deux codes sont différents.');
  try {
    changerCode(etat, f.code.value);
  } catch (e) {
    return noter(message, e.message);
  }
  enregistrer();
  f.reset();
  noter(message, 'Nouveau code enregistré ✓', true);
});

// Croyance de la famille et religions à découvrir
function afficherReglageCroyance() {
  const f = $('#form-croyance'), { famille, decouvrir } = etat.croyance;
  f.famille.replaceChildren(new Option('— Pas de lieu pour l’instant —', ''),
    ...Object.entries(croyance.CROYANCES).map(([k, c]) => new Option(c.nom, k, false, k === famille)));
  $('#religions').replaceChildren(...croyance.RELIGIONS.map((k) => {
    const l = document.createElement('label');
    l.innerHTML = '<input type="checkbox" name="decouvrir"> <span></span>';
    Object.assign(l.firstChild, { value: k, checked: decouvrir.includes(k) });
    l.lastChild.textContent = croyance.CROYANCES[k].nom;
    return l;
  }));
  f.illustrations.checked = etat.croyance.illustrations;
  const majCases = () => { for (const c of f.querySelectorAll('[name=decouvrir]')) c.disabled = !f.famille.value || c.value === f.famille.value; };
  f.famille.onchange = () => { majCases(); f.illustrations.checked = croyance.illustrationsParDefaut(f.famille.value || null); }; // réglé selon la croyance, modifiable
  majCases();
  noter(f.querySelector('.erreur'), '');
}
$('#form-croyance').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = ev.target;
  try {
    reglerCroyance(etat, f.famille.value || null, [...f.querySelectorAll('[name=decouvrir]:checked:not(:disabled)')].map((c) => c.value), f.illustrations.checked);
  } catch (e) {
    return noter(f.querySelector('.erreur'), e.message);
  }
  enregistrer();
  afficherReglageCroyance();
  noter(f.querySelector('.erreur'), etat.croyance.famille ? `Enregistré ✓ ${croyance.CROYANCES[etat.croyance.famille].lieu} est dans le village.` : 'Enregistré ✓ Pas de lieu de croyance au village.', true);
});

// Enregistrer ma voix
let micro = null; // { type, id, arreter } pendant un enregistrement ; id : la phrase qu'on refait
const voixMessage = (texte, ok = false) => noter($('#voix-message'), texte, ok);

async function afficherVoix() {
  const phrases = await voixParents.lister();
  for (const type of ['felicitation', 'encouragement']) {
    const liste = phrases.filter((p) => p.type === type);
    $(`#voix-${type}`).replaceChildren(...liste.map((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>Phrase ${i + 1}</span><button class="petit">▶️ Écouter</button><button class="petit">🔁 Refaire</button><button class="petit">🗑️ Supprimer</button>`;
      const [ecouter, refaire, suppr] = li.querySelectorAll('button');
      ecouter.addEventListener('click', () => voixParents.ecouter(p.audio));
      refaire.addEventListener('click', () => basculerMicro(type, p.id));
      suppr.addEventListener('click', async () => { await voixParents.supprimer(p.id); afficherVoix(); });
      if (micro?.id === p.id) refaire.textContent = '⏹️ Arrêter';
      else refaire.disabled = suppr.disabled = !!micro;
      return li;
    }));
    if (!liste.length) $(`#voix-${type}`).innerHTML = '<li class="vide">Pas encore de phrase : la voix de synthèse parle.</li>';
  }
  for (const b of document.querySelectorAll('.enregistrer')) {
    const ici = micro && !micro.id && micro.type === b.dataset.type;
    b.textContent = ici ? '⏹️ Arrêter' : '🎙️ Enregistrer';
    b.disabled = !voixParents.microDisponible() || (!!micro && !ici);
  }
  if (!voixParents.microDisponible()) voixMessage("Ce navigateur ne permet pas d'enregistrer (il faut ouvrir l'app en https, comme sur GitHub Pages).");
}

// 1er appui : on enregistre ; 2e appui (ou au bout de 6 secondes) : on arrête et on garde la phrase.
async function basculerMicro(type, id = null) {
  if (micro) return micro.arreter();
  voixMessage('');
  try {
    const rec = await voixParents.enregistrer();
    micro = { type, id, arreter: rec.arreter };
    afficherVoix();
    voixMessage('🔴 Parlez maintenant… puis touchez « Arrêter ».', true);
    const son = await rec.son;
    micro = null;
    if (son.size < 1000) voixMessage("L'enregistrement est vide, réessayez.");
    else {
      await (id ? voixParents.remplacer(id, type, son) : voixParents.ajouter(type, son));
      voixMessage('Phrase enregistrée ✓', true);
    }
  } catch (e) {
    micro = null;
    voixMessage(e?.name === 'NotAllowedError' ? "L'accès au micro a été refusé : autorisez-le dans les réglages du navigateur." : `Impossible d'enregistrer : ${e?.message ?? e}`);
  }
  afficherVoix();
}
for (const b of document.querySelectorAll('.enregistrer')) b.addEventListener('click', () => basculerMicro(b.dataset.type));

demarrer();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

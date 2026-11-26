import { nouvelEtat, ajouterProfil, charger, sauver, modifierProfil, remettreAZero, changerCode, reglerCroyance, reglerSuivante, reglerLecture } from './store.js';
import * as croyance from './croyances.js';
import * as recits from './recits.js';
import * as rapprochements from './rapprochements.js';
import {
  AVATAR_DE_DEPART,
  PEAUX, CHEVEUX, YEUX, COIFFURES, TENUES, TENUES_DE_DEPART, COIFFURES_DE_DEPART, CHEVEUX_DE_DEPART,
  AVATAR_PAR_DEFAUT, AGE_MIN, AGE_MAX, dessinerAvatar,
} from './avatar.js';
import { dessinerIle, dessinerArchipel, LIEUX } from './carte.js';
import { ile, ileOuverte, prixIle, debloquerIle } from './archipel.js';
import { CATALOGUE, MAGASINS, PIECES, article, possede, estUtilise, acheter, utiliser, modifierAvatar, pieceManquante, nommer, changerHabit, sePorte, HABITS_ANIMAUX, aConstruire } from './catalogue.js';
import { dessinerPiece, apercu, image } from './maison.js';
import { BONUS_RECETTE_REELLE, ETOILES_ATLAS, ETOILES_CONFIANCE } from './reglages.js';
import { melanger, nouvellePartie, questionEnCours, repondre, terminee, etoilesGagnees, formatEtoiles } from './partie.js';
import * as calcul from './jeux/calcul.js';
import * as heure from './jeux/heure.js';
import * as corps from './jeux/corps.js';
import * as syllabes from './jeux/syllabes.js';
import * as dictee from './jeux/dictee.js';
import * as robot from './jeux/robot.js';
import * as suisse from './jeux/suisse.js';
import * as nature from './jeux/nature.js';
import * as missions from './jeux/missions.js';
import * as labyrinthe from './jeux/labyrinthe.js';
import * as glacier from './jeux/glacier.js';
import * as ecriture from './jeux/ecriture.js';
import * as jardinage from './jeux/jardinage.js';
import * as fiches from './jeux/nature-fiches.js';
import * as experiences from './jeux/experiences.js';
import * as enigmes from './jeux/enigmes.js';
import * as espace from './jeux/espace.js';
import * as cuisine from './jeux/cuisine.js';
import * as marche from './jeux/marche.js';
import * as peinture from './jeux/peinture.js';
import * as emotions from './jeux/emotions.js';
import * as bd from './jeux/bd.js';
import * as atlas from './jeux/atlas.js';
import * as dinos from './jeux/dinos.js';
import * as passeport from './jeux/passeport.js';
import * as urgences from './jeux/urgences.js';
import * as route from './jeux/route.js';
import * as tri from './jeux/tri.js';
import * as langues from './jeux/langues.js';
import * as musique from './jeux/musique.js';
import * as chantier from './jeux/chantier.js';
import * as confiance from './jeux/confiance.js';
import * as veto from './jeux/veto.js';
import * as fractions from './jeux/fractions.js';
import * as memory from './jeux/memory.js';
import * as avent from './jeux/avent.js';
import * as voixParents from './enregistrements.js';
import { parler, taire, bip, fanfare, notes, repeter, attendreSilence, choisirGenre, appliquerVoix, voixFrancaises, parlerLangue } from './voix.js';
import { accorder } from './genre.js';
import { messageReponse } from './messages.js';
import * as enLigne from './en-ligne.js';
import * as suivi from './suivi.js';
import * as logique from './jeux/logique.js';

let etat = charger();
appliquerVoix(etat?.reglages);
let joueuse = null;
navigator.storage?.persist?.(); // demande au navigateur de ne pas effacer les données tout seul

const $ = (s) => document.querySelector(s);

// Un intérieur en image (images/decors) en fond d'un lieu ; sans image, l'ancien décor reste.
function poserDecor(el, nom) {
  const img = image(`decors/${nom}`);
  el.style.background = img ? `url("${img}") center / cover` : '';
  el.classList.toggle('decor-image', Boolean(img));
}
const DECORS_ECRANS = { memory: 'memory', musique: 'musique', chantier: 'chantier', bd: 'bd', atelier: 'peinture', musee: 'musee', veto: 'veto',
  urgences: 'urgences', langues: 'langues', bibliotheque: 'syllabes', emotions: 'emotions', observatoire: 'espace', restaurant: 'cuisine', passeport: 'aeroport', atlas: 'corps' }; // les lieux qui ont leur propre écran : l'image remplit la fenêtre (#decor)

function montrer(nom) {
  for (const e of document.querySelectorAll('[data-ecran]')) e.hidden = e.dataset.ecran !== nom;
  poserDecor($('#decor'), DECORS_ECRANS[nom] ?? (nom === 'lieu' ? vue : null)); // un magasin porte le nom de son image ; la maison n'en a pas
  $(`[data-ecran="${nom}"] h1`).focus();
}

function enregistrer() {
  const ok = sauver(etat);
  $('#alerte').hidden = ok;
  $('#alerte').textContent = ok ? '' : "Attention : ce navigateur n'enregistre pas les progrès (navigation privée ?).";
  clearTimeout(aSynchroniser);
  aSynchroniser = setTimeout(synchroniserEnLigne, 4000); // on regroupe les changements avant de les envoyer
}

// Le compte parent en ligne : on synchronise au démarrage, quelques secondes après un changement, en quittant l'app et au retour du réseau.
let aSynchroniser = null, erreurEnLigne = '';
async function synchroniserEnLigne() {
  if (!enLigne.disponible() || !enLigne.session() || !etat) return;
  try {
    const r = await enLigne.synchroniser(etat);
    erreurEnLigne = '';
    if (r && enLigne.appliquer(etat, r)) {
      sauver(etat);
      if (!$('[data-ecran="accueil"]').hidden) afficherAccueil();
    }
  } catch (e) {
    erreurEnLigne = e.message;
  }
  if (!$('[data-ecran="parents"]').hidden) afficherCompte($('#compte-en-ligne'));
}
addEventListener('online', synchroniserEnLigne);
document.addEventListener('visibilitychange', synchroniserEnLigne);
setInterval(() => { if (!document.hidden) synchroniserEnLigne(); }, 60_000); // les progrès des frères et sœurs qui jouent sur un autre appareil

function demarrer() {
  if (!etat) { afficherCompte($('#compte-code'), true); return montrer('code'); }
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
function preparerOptions(profil, depart = AVATAR_PAR_DEFAUT) {
  const choisi = profil?.avatar ?? depart;
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

formProfil.addEventListener('change', (ev) => {
  if (ev.target.name === 'genre' && !profilModifie) { // un personnage de départ selon le genre ; tout reste modifiable
    preparerOptions(null, AVATAR_DE_DEPART[ev.target.value]);
    for (const i of formProfil.querySelectorAll('.options input[type=radio]:not([name=genre])')) i.checked = i.defaultChecked;
  }
  majApercus();
});

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
    else {
      if (!f.genre.value) throw new Error('Choisis : fille ou garçon.');
      ajouterProfil(etat, { prenom: f.prenom.value, age: Number(f.age.value) || undefined, avatar: avatarDuFormulaire(), genre: f.genre.value });
    }
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
// Accorder un texte affiché au genre de l'enfant qui joue (les phrases dites le sont dans parler)
const acc = (t) => accorder(t, joueuse?.genre);

function ouvrirIle(p = joueuse) {
  joueuse = p;
  choisirGenre(p.genre ?? 'fille');
  ileAConfirmer = null;
  const visite = suivi.visiter(p); // le premier passage du jour : la série de jours, et des étoiles
  if (visite.nouveau) { enregistrer(); parler(`Bonjour ${p.prenom} ! ${visite.serie > 1 ? `${visite.serie} jours de suite ! ` : ''}Tu gagnes ${visite.gain} étoile${visite.gain > 1 ? 's' : ''}.`, { ton: 1.1 }); }
  $('#rdv').textContent = `🔥 ${visite.serie}`;
  $('#rdv').setAttribute('aria-label', `Mes rendez-vous : ${visite.serie} jour${visite.serie > 1 ? 's' : ''} de suite`);
  $('#rdv').classList.toggle('a-voir', suivi.coffrePret(p) || !suivi.enigmeFaite(p)); // un point rouge : il reste un cadeau aujourd'hui
  $('#ile-joueuse').innerHTML = `<span class="mini-avatar">${dessinerAvatar(p.avatar, 'tete')}</span><span></span>`;
  $('#ile-joueuse').lastChild.textContent = p.prenom;
  $('#ile-etoiles').textContent = `⭐ ${formatEtoiles(p.etoiles)}`;
  $('#carte').innerHTML = ileCourante ? dessinerIle(ileCourante, etat.profils, p, etat.croyance.famille) : dessinerArchipel(p);
  $('[data-ecran="ile"] h1').textContent = ileCourante ? ile(ileCourante).nom : "L'archipel";
  $('#avent').hidden = !avent.enSaison(new Date()); // le calendrier de l'Avent, en décembre seulement
  montrer('ile');
}

$('#changer').addEventListener('click', afficherAccueil);
$('#avent').addEventListener('click', ouvrirAvent);
$('#rdv').addEventListener('click', () => ouvrirRendezVous());

// Le calendrier de l'Avent : 24 cases ; on ouvre celles des jours passés, la case montre son image et son texte
function ouvrirAvent() {
  afficherAvent();
  montrer('avent');
  parler('Le calendrier de l’Avent ! Chaque jour de décembre, une nouvelle case s’ouvre.');
}
function afficherAvent() {
  etoilesJoueuse();
  const n = avent.ouvrables(new Date()), faites = joueuse.avent ?? [];
  $('#avent-vue').replaceChildren(el('div', { className: 'avent-grille' }, ...avent.JOURS.map(([emoji], i) => {
    const j = i + 1, faite = faites.includes(j), img = image(`avent/${j}`);
    const b = el('button', { className: `avent-case${faite ? ' faite' : ''}`, disabled: j > n,
      ariaLabel: `${j} décembre${faite ? ', déjà ouverte' : j > n ? ', pas encore' : ''}` });
    b.innerHTML = faite ? (img ? `<img src="${img}" alt="">` : `<span class="avent-emoji">${emoji}</span>`) : `<span class="avent-num">${j}</span>`;
    b.addEventListener('click', () => ouvrirCaseAvent(j));
    return b;
  })));
}
function ouvrirCaseAvent(j) {
  const gain = avent.ouvrir(joueuse, j, new Date());
  if (gain === null) return;
  if (gain) enregistrer();
  etoilesJoueuse();
  const [emoji, titre, texte] = avent.JOURS[j - 1], img = image(`avent/${j}`);
  $('#avent-vue').replaceChildren(el('h2', { textContent: `${j} décembre` }),
    img ? el('img', { className: 'avent-image', src: img, alt: '' }) : el('div', { className: 'avent-image avent-emoji', textContent: emoji }),
    el('p', { className: 'carte presentation' }, el('strong', { textContent: `${titre} ` }), texte),
    ...(gain ? [el('p', { className: 'gain', textContent: `+${gain} ⭐` })] : []),
    gros('← Le calendrier', afficherAvent, 'gros secondaire'));
  parler(`${titre} ${texte}`);
}

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
  if (id === 'musee') return ouvrirMusee();
  if (id === 'aeroport') return ouvrirPasseport();
  if (id === 'syllabes') return ouvrirBibliotheque();
  if (id === 'missions') return ouvrirMissions();
  if (id === 'potager') return ouvrirPotager();
  if (id === 'naturaliste') return ouvrirCabane();
  if (id === 'labo') return ouvrirLabo();
  if (id === 'defi') return ouvrirDefi();
  if (id === 'enigmes') return ouvrirEnigmes();
  if (id === 'labyrinthe') return ouvrirLabyrinthe();
  if (id === 'glacier') return ouvrirGlacier();
  if (id === 'urgences') return ouvrirUrgences();
  if (id === 'musique') return ouvrirMusique();
  if (id === 'chantier') return ouvrirChantier();
  if (id === 'confiance') return ouvrirConfiance();
  if (id === 'veto') return ouvrirVeto();
  if (id === 'memory') return ouvrirMemory();
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
const DANS_LA_MAISON = ['meuble', 'jouet', 'animal', 'papier', 'ustensile', 'acc-animal'];
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
    $('#onglets').replaceChildren(...CATALOGUE.filter((a) => a.type === 'piece' && possede(joueuse, a) && !aConstruire(joueuse, a.cle)).map((a) =>
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
  return noms.length ? '' : $('#lieu-message').textContent; // on ne récite plus tout le rayon : toucher un objet dit son nom
};

function carteArticle(a) {
  const carte = document.createElement('div');
  carte.className = 'article';
  carte.innerHTML = `<div class="apercu-article">${apercu(a, joueuse)}</div><span class="nom"></span><button class="action"></button>`;
  const prenom = a.type === 'animal' && joueuse.noms?.[a.id];
  carte.querySelector('.nom').textContent = prenom ? `${a.nom} « ${prenom} »` : a.nom;
  const b = carte.querySelector('.action');
  const aMoi = possede(joueuse, a), enPlace = aMoi && estUtilise(joueuse, a);
  const porte = ['tenue', 'coiffure', 'cheveux', 'lit', 'chaussures'].includes(a.type);
  const manque = !aMoi && pieceManquante(joueuse, a);
  if (aMoi && a.type === 'piece' && aConstruire(joueuse, a.cle)) {
    b.textContent = '🏗️ À construire';
    b.disabled = true;
    b.setAttribute('aria-label', `${a.nom} : va la construire au chantier, avec une tour de ${chantier.HAUTEURS[a.cle]} étages`);
  } else if (aMoi) {
    b.textContent = a.type === 'piece' ? (enPlace ? 'Tu y es ✓' : 'Y aller')
      : enPlace ? (porte ? (a.type === 'lit' ? 'Choisi ✓' : 'Porté ✓') : ['accessoire', 'papier', 'chapeau'].includes(a.type) ? 'Enlever' : 'Ranger')
        : a.type === 'lit' ? 'Choisir' : porte || ['accessoire', 'papier', 'chapeau'].includes(a.type) ? 'Mettre' : 'Placer';
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
  if (aMoi && a.type === 'habit-animal') { // il se met sur un animal, dans la maison
    b.textContent = sePorte(a.cle) ? 'À toi ✓' : 'Dans ta collection ✓';
    b.disabled = true;
  }
  carte.classList.toggle('a-moi', aMoi);
  b.addEventListener('click', () => toucherArticle(a));
  if (aMoi && a.type === 'animal') { // son prénom, et ses vêtements
    const outils = document.createElement('div');
    outils.className = 'outils-animal';
    outils.append(gros('✏️ Prénom', () => demanderPrenom(a), 'petit'));
    const soigner = gros('🩺', () => ouvrirVeto(a.id), 'petit');
    soigner.setAttribute('aria-label', `Soigner ${joueuse.noms?.[a.id] ?? a.nom.toLowerCase()} chez le vétérinaire`);
    outils.append(soigner);
    const habits = Object.keys(HABITS_ANIMAUX).some((k) => sePorte(k) && joueuse.objets.includes(`habit-animal:${k}`));
    if (habits && a.cle !== 'poisson') {
      const habiller = gros('👕', () => {
        const h = changerHabit(joueuse, a.id);
        enregistrer();
        afficherLieu();
        parler(h ? HABITS_ANIMAUX[h].nom : 'Sans vêtement.');
      }, 'petit');
      habiller.setAttribute('aria-label', 'Changer son vêtement');
      outils.append(habiller);
    }
    carte.append(outils);
  }
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
    parler(a.nom);
  } else {
    acheter(joueuse, a.id);
    aConfirmer = null;
    message.textContent = `Bravo, ${a.nom} est à toi !`;
    bip(true);
    parler(`Bravo ! ${a.nom}`, { ton: 1.15 });
  }
  if (a.piece) joueuse.maison.piece = a.piece; // montrer la pièce où l'objet est posé
  enregistrer();
  afficherLieu();
  if (a.type === 'animal' && !joueuse.noms?.[a.id] && possede(joueuse, a)) demanderPrenom(a); // tout juste adopté : lui donner un prénom
}

// Donner (ou changer) le prénom d'un animal : une fenêtre au milieu de l'écran, avec l'animal
function demanderPrenom(a) {
  const champ = el('input', { className: 'champ-prenom', maxLength: 15, value: joueuse.noms?.[a.id] ?? '', placeholder: 'Son prénom', autocomplete: 'off' });
  champ.setAttribute('aria-label', `Le prénom de l'animal : ${a.nom.toLowerCase()}`);
  const dessin = el('div', { className: 'apercu-prenom' });
  dessin.innerHTML = apercu(a, joueuse);
  const fenetre = el('dialog', { className: 'fenetre-prenom' });
  const fermer = () => { fenetre.close(); fenetre.remove(); };
  const valider = () => {
    const nom = nommer(joueuse, a.id, champ.value);
    if (!nom) return champ.focus();
    enregistrer();
    fermer();
    afficherLieu();
    $('#lieu-message').textContent = `${a.nom} s'appelle ${nom} !`;
    parler(`Bienvenue, ${nom} !`, { ton: 1.15 });
  };
  champ.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') valider(); });
  fenetre.addEventListener('close', () => fenetre.remove());
  fenetre.append(dessin, el('h2', { textContent: a.nom }), el('p', { textContent: 'Quel prénom veux-tu lui donner ?' }), champ,
    el('div', { className: 'actions-prenom' }, gros('✔️ C’est son prénom !', valider), gros('Plus tard', fermer, 'gros secondaire')));
  document.body.append(fenetre);
  fenetre.showModal();
  champ.focus();
  parler('Quel prénom veux-tu lui donner ?');
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
const JEUX = { calcul, heure, corps, syllabes, dictee, robot, suisse, naturaliste: nature.naturaliste, potager: nature.potager, secours: nature.secours, espace, cuisine, marche, emotions, atlas, dinos, passeport, urgences, route, tri, langues, veto, fractions, croyance, recit: croyance, intrus: enigmes.intrus, suites: enigmes.suites }; // recit : les questions d'une histoire
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
  veto: { peau: 'claire', yeux: 'marron', coiffure: 'queue', cheveux: 'chatain', tenue: 'tshirt-turquoise', accessoires: ['lunettes'] },
  tri: { peau: 'brune', yeux: 'noisette', coiffure: 'tresses', cheveux: 'noir', tenue: 'salopette-jaune', accessoires: [] },
  langues: { peau: 'claire', yeux: 'bleus', coiffure: 'carre', cheveux: 'blond', tenue: 'mariniere', accessoires: [] },
  nature: { peau: 'mate', yeux: 'verts', coiffure: 'queue', cheveux: 'chatain', tenue: 'salopette-jaune', accessoires: [] },
  robot: { peau: 'doree', yeux: 'marron', coiffure: 'courts', cheveux: 'noir', tenue: 'tshirt-turquoise', accessoires: ['lunettes'] },
  fractions: { peau: 'mate', yeux: 'noirs', coiffure: 'tres-courts', cheveux: 'noir', tenue: 'mariniere', accessoires: [] },
  enigmes: { peau: 'claire', yeux: 'verts', coiffure: 'longs', cheveux: 'noir', tenue: 'pull-violet', accessoires: ['lunettes'] },
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
    : nom === 'langues'
    ? { questions: langues.questions({ age: joueuse.age, langue: langueEcole, theme: themeEcole, rates: langues.aRevoir(joueuse, langueEcole, themeEcole) }), index: 0, bonnes: 0, serie: 0 } // les mots ratés d'abord
    : nom === 'passeport'
    ? { questions: passeport.questions(paysCourant, joueuse.age), index: 0, bonnes: 0, serie: 0 } // les 3 questions du pays
    : nouvellePartie(JEUX[nom].question, { operation, age: joueuse.age, croyance: etat.croyance.famille, systeme: systemeAtlas, patients: veto.patients(joueuse, animalVeto) }, Math.random, vus);
  if (nom !== 'robot') joueuse.vus[cle] = [...vus]; // (les niveaux du robot sont tirés au hasard : rien à retenir) // une question ne revient pas tant que les autres n'ont pas été posées
  enregistrer();
  const lieu = { recit: 'croyance', atlas: 'corps', dinos: 'musee', dictee: 'syllabes', suisse: 'passeport', naturaliste: 'nature', potager: 'nature', secours: 'urgences', intrus: 'enigmes', suites: 'enigmes' }[nom] ?? nom;
  $('#salle').dataset.decor = lieu;
  poserDecor($('#salle'), lieu === 'passeport' ? 'aeroport' : lieu);
  const perso = image(`personnages/${lieu}`); // le personnage en image du nouveau style ; sinon son dessin
  $('#maitre-dessin').innerHTML = perso ? `<img src="${perso}" alt="">` : nom === 'corps' ? corps.docteure(PERSONNAGES.corps, 14) : dessinerAvatar(PERSONNAGES[lieu], 'entier', 14);
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
  $('#question').textContent = jeu === 'calcul' ? `${q.texte} = ?` : acc(q.titre);
  $('#question').classList.toggle('longue', $('#question').textContent.length > 28); // une longue question s'écrit plus petit : le jeu doit tenir sur un écran de téléphone
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
  } else if (jeu === 'syllabes' || jeu === 'dictee') {
    afficherSyllabes(q);
  } else if (jeu === 'marche') {
    afficherMarche(q);
  } else if (jeu === 'robot') {
    afficherRobot(q);
  } else if (jeu === 'dinos') {
    const parImage = q.texte.startsWith('trait:'); // « Quel dinosaure… ? » : on touche son image (sans montrer la réponse au-dessus)
    $('#aide').innerHTML = parImage ? '' : dinos.dessinerSquelette(dinos.dino(q.dino));
    boutonsReponses(q.choix, String, true);
    if (parImage) for (const b of $('#reponses').children) { b.classList.add('reponse-dino'); b.innerHTML = `${portraitDino(dinos.DINOS.find((d) => d.nom === b.dataset.v))}<span>${b.dataset.v}</span>`; }
  } else if (jeu === 'passeport') {
    $('#aide').innerHTML = `<div class="ingredient-a-trouver" aria-hidden="true">${q.type === 'drapeau' ? '🏳️' : passeport.pays(paysCourant).drapeau}</div>`;
    boutonsReponses(q.choix, String, true);
  } else if (jeu === 'urgences') {
    $('#aide').innerHTML = q.image ? `<div class="ingredient-a-trouver" aria-hidden="true">${enImage('urgences', urgences.IMAGES[q.image], q.image)}</div>` : '';
    boutonsReponses(q.choix, urgences.libelle, true);
    for (const b of $('#reponses').children) if (image(`urgences/${b.dataset.v}`)) b.innerHTML = `${enImage('urgences', b.dataset.v)} <span>${urgences.sansEmoji(b.textContent)}</span>`;
  } else if (['route', 'tri', 'suisse', 'naturaliste', 'potager', 'secours'].includes(jeu)) {
    $('#aide').innerHTML = `<div class="ingredient-a-trouver" aria-hidden="true">${jeu === 'potager' ? enImage('potager', nature.IMAGES[q.image], q.image) : q.image}</div>`;
    boutonsReponses(q.choix, String, true);
  } else if (jeu === 'intrus' || jeu === 'suites') { // les réponses sont des images ou des nombres : de gros boutons, sans texte à lire
    $('#aide').innerHTML = q.image ? `<div class="suite-logique" role="img" aria-label="La suite">${enFormes(q.image)}</div>` : '';
    boutonsReponses(q.choix, String, jeu === 'intrus');
    for (const b of $('#reponses').children) habillerEnigme(b, jeu, q);
  } else if (jeu === 'langues') {
    $('#aide').innerHTML = `<div class="ingredient-a-trouver" aria-hidden="true">${q.image}</div>`;
    boutonsReponses(q.choix, String, q.mode === 'lire');
    if (q.mode === 'ecoute') for (const b of $('#reponses').children) b.classList.add('reponse-image');
  } else if (jeu === 'veto') {
    const dessin = apercu(article(q.patient ?? `animal:${q.espece}`));
    $('#aide').innerHTML = `<div class="patient-veto" aria-hidden="true">${dessin}${q.symptome ? `<span class="symptome">${q.symptome}</span>` : ''}</div>`;
    boutonsReponses(q.choix, String, true);
  } else if (jeu === 'fractions') {
    afficherFractions(q);
  } else if (jeu === 'emotions') {
    $('#aide').innerHTML = q.mode === 'visage' ? emotions.visage(q.reponse, q.peau) : '';
    boutonsReponses(q.choix, emotions.nom, true);
  } else if (jeu === 'espace' || jeu === 'croyance' || jeu === 'recit' || jeu === 'atlas') {
    $('#aide').innerHTML = jeu === 'recit' ? recits.illustration(recitOuvert, etat.croyance.illustrations) : '';
    boutonsReponses(q.choix, String, true);
  } else if (jeu === 'cuisine') {
    if (q.mode === 'ingredient') { // on voit l'ingrédient, on l'entend ; on lit les mots (sans images) pour trouver le bon
      $('#aide').innerHTML = `<div class="ingredient-a-trouver" aria-hidden="true">${enImage('restaurant', q.id, q.image)}</div>`;
      boutonsReponses(q.choix, majuscule, true);
    } else afficherPesee(q);
  } else {
    $('#aide').innerHTML = `<div class="patient${q.mode === 'choix' ? ' petit-patient' : ''}">${dessinerAvatar(corps.PATIENT, 'entier', corps.AGE_PATIENT, true)}</div>`;
    if (q.mode === 'choix') boutonsReponses(q.choix, String, true);
    else {
      $('#reponses').replaceChildren();
      $('#aide svg').addEventListener('click', toucherPatient);
    }
  }
  $('#ecouter').disabled = false;
  $('#question').focus();
  direQuestion(q);
}
// L'école des langues : la consigne en français, puis le mot avec la voix de sa langue
const direQuestion = (q) => (jeu === 'langues' && q.mode === 'ecoute' ? parler(q.consigne).then(() => parlerLangue(q.mot, q.lang, q.dire)) : parler(aDire(q)));

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
  $('#aide').innerHTML = `<div class="mot-image${q.cache ? '' : ' ombre'}" aria-hidden="true">${q.cache ?? q.image}</div>
    <div class="cases${q.cache ? ' lettres' : ''}">${q.syllabes.map(() => '<span class="case"></span>').join('')}</div>`;
  $('#reponses').style.gridTemplateColumns = `repeat(${Math.min(q.tuiles.length, q.colonnes ?? 3)}, minmax(0, 1fr))`;
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
        $('#aide .mot-image').textContent = q.image; // la dictée : l'image du mot apparaît à la fin
        choisir(erreur ? '' : q.reponse);
      }
    });
    return b;
  }));
}

// L'atelier des robots : on prépare les flèches, puis le robot les suit, case après case
function afficherRobot(q) {
  let programme = [], erreur = false, enRoute = false;
  const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
  const encore = () => !$('[data-ecran="jeu"]').hidden && partie && questionEnCours(partie) === q; // la partie n'a pas été quittée
  const grille = el('div', { className: 'grille-robot', role: 'img', ariaLabel: 'La grille : le robot, l’étoile et les rochers' });
  grille.style.gridTemplateColumns = `repeat(${q.taille}, 1fr)`;
  const liste = el('p', { className: 'programme-robot', role: 'status' });
  const dessiner = ([rx, ry] = q.depart, cogne = false) => {
    grille.replaceChildren(...Array.from({ length: q.taille ** 2 }, (_, i) => {
      const x = i % q.taille, y = Math.floor(i / q.taille);
      const ici = x === rx && y === ry;
      return el('span', { textContent: ici ? (cogne ? '💥' : '🤖') : x === q.but[0] && y === q.but[1] ? '⭐' : q.rochers.some((r) => r[0] === x && r[1] === y) ? '🪨' : '' });
    }));
    liste.textContent = programme.length ? programme.map((f) => robot.FLECHES[f][2]).join(' ') : 'Touche les flèches…';
  };
  const lancer = async () => {
    if (!programme.length) return parler('Touche d’abord les flèches.');
    enRoute = true;
    const r = robot.executer(q, programme);
    for (const c of r.chemin) { dessiner(c); await attendre(350); if (!encore()) return; }
    if (r.gagne) return choisir(erreur ? '' : q.reponse);
    erreur = true;
    bip(false);
    if (r.cogne >= 0) dessiner(r.chemin.at(-1), true);
    $('#retour').textContent = r.cogne >= 0 ? 'Aïe, le robot s’est cogné ! Essaie un autre chemin.' : 'Le robot n’est pas arrivé à l’étoile. Essaie encore !';
    parler($('#retour').textContent);
    await attendre(1200);
    if (!encore()) return;
    programme = [];
    enRoute = false;
    dessiner();
  };
  const bouton = (texte, nom, action, classe = '') => {
    const b = el('button', { className: `reponse robot-touche ${classe}`, textContent: texte, ariaLabel: nom });
    b.addEventListener('click', () => { if (!enRoute) action(); });
    return b;
  };
  const fleche = (f, nom) => bouton(robot.FLECHES[f][2], nom, () => { if (programme.length < robot.PROGRAMME_MAX) { programme.push(f); dessiner(); } });
  $('#aide').replaceChildren(grille, liste);
  $('#reponses').style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
  $('#reponses').replaceChildren(
    bouton('⌫', 'Effacer la dernière flèche', () => { programme.pop(); dessiner(); }), fleche('haut', 'En haut'), bouton('▶️', 'Lancer le robot', lancer, 'lancer'),
    fleche('gauche', 'À gauche'), fleche('bas', 'En bas'), fleche('droite', 'À droite'));
  dessiner();
}

// Le restaurant : peser un ingrédient sur la balance avec les boutons, puis « C'est pesé ! »
let pesee = 0;
function afficherPesee(q) {
  pesee = 0;
  const dessiner = () => ($('#aide').innerHTML = cuisine.dessinerBalance(pesee, q.image, image(`restaurant/${q.id}`)));
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

// La pizzeria : garnir des parts (on les touche, puis « C'est prêt »), choisir un dessin, ou une fraction
function afficherFractions(q) {
  $('#aide').setAttribute('aria-hidden', 'false');
  if (q.mode === 'garnir') {
    const garnies = new Set();
    const pret = el('button', { className: 'reponse valider large', textContent: 'C’est prêt ✓' });
    const dessiner = () => {
      $('#aide').innerHTML = `<div class="pizza-cadre">${fractions.pizza(q.d, [...garnies], { cliquable: true, gateau: q.gateau })}</div><p class="total">${garnies.size} part${garnies.size > 1 ? 's' : ''} sur ${q.d}</p>`;
      for (const g of $('#aide').querySelectorAll('.part')) {
        const toucher = () => { if (pret.disabled) return; const k = Number(g.dataset.part); garnies.has(k) ? garnies.delete(k) : garnies.add(k); dessiner(); };
        g.addEventListener('click', toucher);
        g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toucher(); } });
      }
    };
    dessiner();
    pret.addEventListener('click', () => choisir(garnies.size));
    $('#reponses').style.gridTemplateColumns = '1fr';
    return $('#reponses').replaceChildren(pret);
  }
  if (q.mode === 'dessins') {
    $('#aide').innerHTML = '';
    $('#reponses').style.gridTemplateColumns = `repeat(${q.choix.length}, minmax(0, 1fr))`;
    return $('#reponses').replaceChildren(...q.choix.map((v, i) => {
      const b = el('button', { className: 'reponse dessin-pizza' });
      b.innerHTML = q.dessins[v];
      b.dataset.v = v;
      b.setAttribute('aria-label', `Dessin ${i + 1}`);
      b.addEventListener('click', () => choisir(v));
      return b;
    }));
  }
  $('#aide').innerHTML = q.dessin ? `<div class="pizza-cadre">${q.dessin}</div>` : '';
  boutonsReponses(q.choix, q.mode === 'fraction' ? (f) => fractions.libelle(f, joueuse.age) : String, q.mode === 'fraction');
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
  if (jeu === 'langues') { langues.noter(joueuse, langueEcole, q.fr, juste); enregistrer(); } // gardé même si on quitte la partie
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
  if (q.mode === 'peser' && !juste) $('#aide').innerHTML = cuisine.dessinerBalance(q.reponse, q.image, image(`restaurant/${q.id}`)); // la bonne pesée
  bip(juste);
  const m = messageReponse(juste, partie.serie);
  const ici = jeu === 'corps' && q.mode === 'toucher' ? `Ça, c'est ${corps.PARTIES[choix].nom}. ` : '';
  const correction = juste ? '' : ici + (q.solution ?? `La bonne réponse est ${q.reponse}.`);
  const suite = [q.trouve, correction, q.savaisTu && `Le savais-tu ? ${q.savaisTu}`].filter(Boolean).join(' ');
  $('#retour').textContent = urgences.sansEmoji(acc(`${m.texte} ${suite}`.trim()));
  $('#retour').classList.toggle('longue', suite.length > 60);
  const passer = () => {
    if (p !== partie || $('[data-ecran="jeu"]').hidden) return; // partie quittée entre-temps
    terminee(partie) ? finirPartie() : afficherQuestion();
  };
  if (etat.reglages?.suivante === 'bouton') { // réglage des parents : l'enfant passe à la suite quand elle veut
    const suivante = el('button', { className: 'reponse valider large', textContent: terminee(partie) ? 'Voir mon résultat ➜' : 'Question suivante ➜' });
    suivante.addEventListener('click', () => { taire(); voixParents.arreter(); passer(); });
    $('#reponses').append(suivante);
    return reagir(m, juste, suite);
  }
  // sinon : quand la voix a vraiment fini (et pas avant un temps minimum pour voir la correction), puis une seconde de pause
  await Promise.all([reagir(m, juste, suite), new Promise((r) => setTimeout(r, q.savaisTu ? 3000 : juste ? 1000 : 2000))]);
  await attendreSilence();
  await new Promise((r) => setTimeout(r, 1000));
  passer();
}

// La voix d'un parent si elle a été enregistrée pour ce moment-là, sinon la voix de synthèse.
async function reagir(m, juste, suite) {
  if (m.type === 'serie' || !(await voixParents.jouerAuHasard(m.type))) await parler(m.texte, { ton: juste ? 1.15 : 1 });
  if (suite && !$('[data-ecran="jeu"]').hidden) await parler(suite);
}

function finirPartie() {
  const gain = etoilesGagnees(partie.bonnes, JEUX[jeu].etoilesParBonneReponse(joueuse.age, operation), partie.questions.length);
  joueuse.etoiles += gain;
  compterPartie(jeu, joueuse, partie.bonnes, partie.questions.length);
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
    $('#fin-extra').innerHTML = `<div class="plat-reussi" aria-hidden="true">${enImage('restaurant', `plat-${recette}`, r.plat)}</div>
      <p>Recette débloquée ! Fais-la pour de vrai avec un parent : tu gagneras ${BONUS_RECETTE_REELLE} étoiles et un objet pour ta cuisine.</p>
      <p class="savais">Le savais-tu ? ${r.savaisTu}</p><button class="gros secondaire">📖 Voir la vraie recette</button>`;
    $('#fin-extra button').addEventListener('click', () => ouvrirRestaurant(recette));
    fin += ` Recette débloquée ! Le savais-tu ? ${r.savaisTu}`;
  }
  if (jeu === 'passeport') { // le tampon du pays, avec au moins 2 bonnes réponses
    const p = passeport.pays(paysCourant), tampon = passeport.tamponner(joueuse, paysCourant, partie.bonnes);
    enregistrer();
    fin += tampon ? ` Nouveau tampon pour ${p.nom.toLowerCase().replace(/^l’/, 'l’')} dans ton passeport ! Et tu débloques 6 mots en ${passeport.MOTS[paysCourant].langue}.` : partie.bonnes < passeport.BONNES_POUR_TAMPON ? ' Il faut 2 bonnes réponses pour le tampon : réessaie !' : '';
    $('#fin-extra').innerHTML = `<p class="gain">${tampon ? `${p.drapeau} Nouveau tampon ! 🗣️ +6 mots` : ''}</p><button class="gros secondaire">${tampon ? '🗣️ Mes nouveaux mots' : '📘 Mon passeport'}</button>`;
    $('#fin-extra button').addEventListener('click', () => { afficherPasseport(tampon ? 'pays' : 'livret'); montrer('passeport'); });
  }
  if (jeu === 'syllabes' || jeu === 'dictee') {
    $('#fin-extra').innerHTML = '<button class="gros secondaire">📚 Retour à la bibliothèque</button>';
    $('#fin-extra button').addEventListener('click', () => ouvrirBibliotheque());
  }
  if (jeu === 'suisse') {
    $('#fin-extra').innerHTML = '<button class="gros secondaire">🛫 Retour à l’aéroport</button>';
    $('#fin-extra button').addEventListener('click', () => ouvrirPasseport());
  }
  if (jeu === 'langues') {
    $('#fin-extra').innerHTML = '<button class="gros secondaire">🗣️ Retour à l’école des langues</button>';
    $('#fin-extra button').addEventListener('click', () => ouvrirLangues());
  }
  if (jeu === 'veto') {
    $('#fin-extra').innerHTML = '<button class="gros secondaire">🩺 Retour à la clinique</button>';
    $('#fin-extra button').addEventListener('click', () => ouvrirVeto());
  }
  if (jeu === 'dinos' || jeu === 'urgences') {
    $('#fin-extra').innerHTML = `<button class="gros secondaire">${jeu === 'dinos' ? '🦴 Retour au musée' : '📞 Les numéros d’urgence'}</button>`;
    $('#fin-extra button').addEventListener('click', () => { if (jeu === 'dinos') { afficherMusee(); montrer('musee'); } else ouvrirUrgences(); });
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
  $('[data-ecran="fin"]').classList.toggle('parfait', parfait); // des confettis pour un sans-faute
  montrer('fin');
  fanfare();
  parler(fin, { ton: 1.15 });
}

$('#quitter').addEventListener('click', () => { partie = null; taire(); voixParents.arreter(); ouvrirIle(); });
$('#ecouter').addEventListener('click', () => direQuestion(questionEnCours(partie)));
for (const b of document.querySelectorAll('.reecouter')) b.addEventListener('click', () => repeter());

// La consigne, puis les réponses proposées à voix haute (pour celles qui ne lisent pas encore bien)
function aDire(q) {
  if (jeu === 'marche') return marche.aDire(q);
  const ou = (l) => (l.length > 1 ? `${l.slice(0, -1).join(', ')}, ou ${l.at(-1)} ?` : l[0]);
  if (jeu === 'emotions') return `${q.consigne} ${ou(q.choix.map(emotions.nom))}`;
  if (jeu === 'urgences') return `${q.consigne} ${ou(q.choix.map(urgences.libelle))}`;
  if (jeu === 'veto') return veto.aDire(q);
  if (jeu === 'fractions') return fractions.aDire(q);
  if (jeu === 'passeport' && q.type === 'drapeau') return q.consigne; // les drapeaux ne se lisent pas : ce serait donner la réponse
  if (jeu === 'langues') return q.consigne; // les mots étrangers ne se lisent pas avec la voix française
  if (jeu === 'intrus' || jeu === 'suites') return q.consigne; // les réponses sont des images : rien à lire
  if (q.mode === 'choix') return `${q.consigne} ${ou(q.choix)}`;
  if (q.mode === 'lire') return `${q.consigne} ${ou(q.choix.map(heure.dire))}`;
  if (q.mode === 'ingredient') return q.consigne; // les mots des boutons ne sont pas lus : c'est à l'enfant de les lire
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
    $('#obs-vue').innerHTML = `<p class="info">Les planètes à la même échelle. Le Soleil est si gros qu'on n'en voit qu'un petit bout ! Les plus petites sont minuscules : on les voit aussi 🔍 à la loupe, dans un rond au-dessus.</p>
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
      carte.querySelector('.symbole').innerHTML = enImage('croyance', croyance.imageDe(nom), image);
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
  const pieces = Object.keys(PIECES).filter((k) => k !== 'jardin' && possede(joueuse, article(`piece:${k}`))); // pas de tableau au jardin
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
  v.append(el('div', { className: 'meteo' }, ...emotions.METEO.map(([cle, emoji, nom, reponse]) => {
    const src = image(`vignettes/meteo-${cle}`);
    const b = el('button', { className: 'temps' }, src ? el('img', { src, alt: '', className: 'image-temps' }) : el('span', { className: 'image-temps', textContent: emoji, ariaHidden: 'true' }), el('span', { textContent: nom }));
    b.setAttribute('aria-pressed', cle === choix);
    b.addEventListener('click', () => { suivi.noterMeteo(joueuse, cle); enregistrer(); afficherEmotions(cle); parler(`${nom}. ${reponse}`); });
    return b;
  })));
  // le baromètre : la météo choisie chaque jour de la semaine (le dernier choix du jour compte) ; les parents la voient aussi, et on le dit à l'enfant
  const semaine = suivi.meteoSemaine(joueuse);
  if (semaine.some(([, m]) => m)) v.append(el('div', { className: 'carte barometre' }, el('strong', { textContent: 'Mon baromètre de la semaine' }),
    el('div', { className: 'jours-meteo' }, ...semaine.map(([jourSemaine, m]) => {
      const [, emoji, nom] = emotions.METEO.find(([c]) => c === m) ?? [], src = m && image(`vignettes/meteo-${m}`);
      return el('span', { title: nom ?? 'pas encore choisi' }, el('small', { textContent: jourSemaine }), m ? (src ? el('img', { src, alt: nom }) : el('span', { textContent: emoji })) : el('span', { textContent: '·', ariaHidden: 'true' }));
    })), el('small', { textContent: 'Tes parents peuvent voir ton baromètre, pour en parler avec toi.' })));
  if (choix) {
    const [, , , reponse] = emotions.METEO.find(([c]) => c === choix);
    v.append(el('p', { className: 'carte presentation', textContent: acc(reponse) }));
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
    ...[['decor', '1 · 🏞️ Décor'], ['0', '2 · ⬅️ À gauche'], ['1', '3 · ➡️ À droite'], ['auto', '4 · ⭐ Autocollant']].map(([k, nom]) =>
      bouton(nom, k === vue.onglet, () => afficherBD({ ...vue, onglet: k }))));
  const panneau = el('div', { className: 'panneau-bd' });
  // un bouton de choix : un dessin (ou rien) et un nom
  const choisir = (actif, dessin, nom, action) => { const x = el('button', { className: 'choix-bd' }); x.innerHTML = `${dessin}<span></span>`; x.lastChild.textContent = nom; x.setAttribute('aria-pressed', actif); x.addEventListener('click', action); return x; };
  const maj = (dire) => { afficherBD(vue); if (dire) parler(dire); };
  if (vue.onglet === 'decor') {
    panneau.append(el('div', { className: 'grille-bd' }, ...Object.entries(bd.DECORS).map(([k, [nom, dessin]]) =>
      choisir(c.decor === k, `<svg viewBox="0 0 300 240" aria-hidden="true">${bd.dessinDecor(k)}</svg>`, nom, () => { c.decor = k; afficherBD({ ...vue, onglet: '0' }); parler(nom); })))); // le décor choisi, on passe au personnage : sinon l'enfant ne voit pas quoi faire ensuite
  } else if (vue.onglet === 'auto') {
    panneau.append(el('div', { className: 'grille-bd petite' }, choisir(!c.autocollant, '', 'Aucun', () => { c.autocollant = null; maj('Aucun autocollant.'); }),
      ...bd.AUTOCOLLANTS.map((a) => choisir(c.autocollant === a, bd.imageAutocollant(a) ? `<img class="autocollant" src="${bd.imageAutocollant(a)}" alt="">` : `<span class="autocollant" aria-hidden="true">${a}</span>`, '', () => { c.autocollant = a; maj(); }))));
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
  // la case qu'on est en train de faire, toujours sous les yeux : sur un téléphone, la bande est plus haut, hors de l'écran
  const apercu = el('div', { className: 'apercu-bd' });
  apercu.innerHTML = bd.dessinerCase(c, dessinPersoBD, { numero: vue.caseActive });
  const actions = el('div', { className: 'actions-atelier' },
    ...(vue.caseActive + 1 < b.cases.length ? [gros('➜ Case suivante', () => { afficherBD({ ...vue, caseActive: vue.caseActive + 1, onglet: 'decor' }); parler(`Case ${vue.caseActive + 2}.`); })] : []),
    gros('🔊 Lire ma BD', () => parler(bd.texteALire(b, nomBD)), 'gros secondaire'),
    gros('🖨️ Imprimer', () => imprimerBD(b), 'gros secondaire'),
    gros('✅ Terminé', () => {
      try { bd.ajouterBD(joueuse, b); } catch (e) { return parler(e.message); }
      enregistrer();
      afficherBD({ mode: 'mes' });
      parler('Bravo ! Ta BD est rangée dans « Mes BD ». Veux-tu l’écouter ?', { ton: 1.15 });
    }));
  v.append(titre, zoneBande, el('h2', { textContent: `Case ${vue.caseActive + 1} sur ${b.cases.length}` }), apercu, onglets, panneau, actions);
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
let faceAtlas = 'devant'; // la face du personnage montrée dans une page de l'atlas
function ouvrirAtlas() {
  etoilesJoueuse();
  afficherAtlas(null);
  montrer('atlas');
  parler("Bienvenue à l'hôpital ! Voici l'atlas du corps. Choisis une page pour découvrir ton corps.", { ton: 1.1 });
}

// systeme : null = la liste des pages
function afficherAtlas(systeme, dire = false) {
  etoilesJoueuse(); // les étoiles gagnées en découvrant une page s'affichent tout de suite
  const v = $('#atlas-vue');
  v.replaceChildren();
  if (!systeme) {
    v.append(el('div', { className: 'galerie-cartes' }, ...Object.entries(atlas.SYSTEMES).map(([k, s]) => {
      const vus = joueuse.atlas?.[k]?.length ?? 0, fini = vus === s.organes.length, src = image(`corps/${k}`);
      const b = el('button', { className: `carte-image carte-corps${fini ? ' choisi' : ''}` });
      b.innerHTML = `${src ? `<img src="${src}" alt="">` : `<span class="emoji-theme" aria-hidden="true">${s.image}</span>`}<span>${s.nom}<br><small>${fini ? '✓ Tout découvert' : `${vus} / ${s.organes.length}`}</small></span>`;
      b.addEventListener('click', () => { systemeAtlas = k; organeAtlas = null; faceAtlas = 'devant'; afficherAtlas(k, true); });
      return b;
    })), gros('⭐ Le grand quiz du corps', () => lancerJeu('corps'), 'gros secondaire'));
    return;
  }
  const s = atlas.SYSTEMES[systeme], vus = joueuse.atlas?.[systeme] ?? [];
  const o = s.organes.find((x) => x.id === organeAtlas);
  const corpsSvg = el('div', { className: 'atlas-dessin' });
  corpsSvg.innerHTML = atlas.dessinerSysteme(systeme, vus, organeAtlas, faceAtlas);
  const ouvrir = (id) => {
    organeAtlas = id;
    faceAtlas = atlas.faceDe(systeme, id); // on tourne le personnage pour voir cet organe
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
    el('div', { className: 'atlas-page' }, el('div', { className: 'atlas-colonne' }, corpsSvg, ...(atlas.aDeuxFaces(systeme) ? [gros(faceAtlas === 'dos' ? '🔄 Voir de face' : '🔄 Voir de dos', () => { faceAtlas = faceAtlas === 'dos' ? 'devant' : 'dos'; organeAtlas = null; afficherAtlas(systeme); parler(faceAtlas === 'dos' ? 'Voici le dos.' : 'Voici le devant.'); }, 'gros secondaire')] : [])), el('div', { className: 'atlas-fiche' }, carte, noms)),
    gros('🧠 Je teste mes connaissances', () => lancerJeu('atlas')));
  if (dire) parler(`${s.nom}. ${s.intro}`);
}

// Le musée des dinosaures : reconstituer un squelette (puzzle), lire sa fiche, puis le quiz
let puzzle = null; // { cle, posees: [], ordre: [] }
// L'image du dinosaure (images/dinos/…) ; sans image, son squelette
const portraitDino = (d) => { const src = image(`dinos/${d.cle}`); return src ? `<img src="${src}" alt="">` : dinos.dessinerSquelette(d).replace('role="img"', 'aria-hidden="true"'); };
function ouvrirMusee() {
  etoilesJoueuse();
  afficherMusee();
  montrer('musee');
  parler('Bienvenue au musée des dinosaures ! Choisis un dinosaure pour reconstituer son squelette.', { ton: 1.1 });
}
function afficherMusee() {
  puzzle = null;
  etoilesJoueuse();
  const v = $('#musee-vue');
  v.replaceChildren(el('p', { className: 'carte presentation', textContent: `Tu as reconstitué ${joueuse.dinos.length} squelettes sur ${dinos.DINOS.length}. Le premier squelette de chaque dinosaure rapporte ${dinos.ETOILES_SQUELETTE} ⭐.` }),
    el('div', { className: 'galerie-cartes' }, ...dinos.DINOS.map((d) => {
      const b = el('button', { className: `carte-image${joueuse.dinos.includes(d.cle) ? ' choisi' : ''}` });
      b.innerHTML = `${portraitDino(d)}<span>${joueuse.dinos.includes(d.cle) ? '✓ ' : ''}${d.nom}</span>`;
      b.addEventListener('click', () => commencerPuzzle(d.cle));
      return b;
    })),
    gros('⭐ Le quiz des dinosaures', () => lancerJeu('dinos')));
}
function commencerPuzzle(cle) {
  puzzle = { cle, posees: [], ordre: melanger(dinos.PIECES) };
  afficherPuzzle();
  parler(`${dinos.dino(cle).nom}. Reconstitue son squelette ! Regarde la place qui brille, et choisis la bonne pièce.`);
}
function afficherPuzzle() {
  const d = dinos.dino(puzzle.cle), aRemplir = puzzle.ordre.find((k) => !puzzle.posees.includes(k));
  if (!aRemplir) return afficherFicheDino(d);
  const v = $('#musee-vue');
  const dessin = el('div', { className: 'toile-cadre' });
  dessin.innerHTML = dinos.dessinerSquelette(d, puzzle.posees, aRemplir);
  const reserve = el('div', { className: 'reserve-pieces' }, ...melanger(dinos.PIECES.filter((k) => !puzzle.posees.includes(k))).map((k) => {
    const b = el('button', { className: 'piece-dino', ariaLabel: dinos.NOMS_PIECES[k] });
    b.innerHTML = dinos.dessinerPiece(d, k);
    b.addEventListener('click', () => {
      if (k !== aRemplir) { bip(false); b.classList.add('tremble'); return parler('Ce n’est pas la bonne pièce. Regarde bien la forme qui brille !'); }
      puzzle.posees.push(k);
      bip(true);
      afficherPuzzle();
      if (puzzle.ordre.some((x) => !puzzle.posees.includes(x))) parler(`Bravo, ${dinos.NOMS_PIECES[k]} !`);
    });
    return b;
  }));
  v.replaceChildren(gros('← Le musée', afficherMusee, 'gros secondaire retour-atelier'), el('h2', { textContent: d.nom }), dessin,
    el('p', { className: 'consigne-puzzle', textContent: 'Quelle pièce va à la place qui brille ?' }), reserve);
}
function afficherFicheDino(d) {
  const nouveau = !joueuse.dinos.includes(d.cle);
  if (nouveau) { joueuse.dinos.push(d.cle); joueuse.etoiles += dinos.ETOILES_SQUELETTE; enregistrer(); }
  etoilesJoueuse();
  const texte = dinos.fiche(d, joueuse.age);
  const dessin = el('div', { className: 'toile-cadre' });
  dessin.innerHTML = dinos.dessinerSquelette(d);
  $('#musee-vue').replaceChildren(gros('← Le musée', afficherMusee, 'gros secondaire retour-atelier'), el('h2', { textContent: d.nom }), dessin,
    el('div', { className: 'carte carte-croyance' }, el('div', { className: 'tete-carte' }, el('h3', { textContent: 'Sa fiche' }), gros('🔊', () => parler(`${texte} Le savais-tu ? ${d.savais}`), 'rond')),
      el('p', { textContent: texte }), el('p', { className: 'savais', textContent: `Le savais-tu ? ${d.savais}` })),
    el('div', { className: 'actions-atelier' }, gros('🦴 Un autre dinosaure', afficherMusee, 'gros secondaire'), gros('⭐ Le quiz des dinosaures', () => lancerJeu('dinos'))));
  parler(`Bravo, le squelette est complet !${nouveau ? ` Tu gagnes ${dinos.ETOILES_SQUELETTE} étoiles.` : ''} ${texte} Le savais-tu ? ${d.savais}`, { ton: 1.1 });
}

// Le vétérinaire : soigner ses animaux (ou ceux de la clinique) et lire les fiches des animaux
let animalVeto = null; // un seul animal à soigner (depuis le refuge ou la clinique), sinon tous
function ouvrirVeto(seul = null) {
  animalVeto = seul;
  taire();
  etoilesJoueuse();
  if (seul) return lancerJeu('veto');
  afficherVeto();
  montrer('veto');
  const miens = veto.patients(joueuse).filter(([id]) => joueuse.objets.includes(id));
  parler(miens.length ? 'Bienvenue chez le vétérinaire ! Tes animaux ont besoin de toi. Choisis qui soigner, ou lis les fiches des animaux.'
    : 'Bienvenue chez le vétérinaire ! Les animaux de la clinique ont besoin de toi. Tu peux aussi lire les fiches des animaux.', { ton: 1.1 });
}
function afficherVeto() {
  const v = $('#veto-vue');
  const miens = veto.patients(joueuse).filter(([id]) => joueuse.objets.includes(id));
  const vignette = (id, texte, action) => {
    const b = el('button', { className: 'carte-animal-veto' });
    b.innerHTML = `${apercu(article(id))}<span>${echapperHtml(texte)}</span>`;
    b.addEventListener('click', action);
    return b;
  };
  v.replaceChildren(
    el('p', { className: 'carte presentation', textContent: miens.length ? 'Tes animaux du refuge viennent se faire soigner ici. Touche un animal pour le soigner.' : 'Pas encore d’animal ? Les animaux de la clinique t’attendent. Tu peux en adopter un au refuge, sur l’île du village.' }),
    miens.length ? el('div', { className: 'animaux-veto' }, ...miens.map(([id, nom]) => vignette(id, `🩺 ${nom === 'ton animal' ? article(id).nom : nom}`, () => ouvrirVeto(id)))) : '',
    gros(miens.length ? '🩺 Soigner tous mes animaux' : '🩺 Soigner les animaux de la clinique', () => lancerJeu('veto')),
    el('h2', { textContent: '📋 Les fiches des animaux' }),
    el('div', { className: 'animaux-veto' }, ...Object.keys(veto.FICHES).map((k) => vignette(`animal:${k}`, veto.FICHES[k].nom, () => afficherFicheVeto(k)))));
}
function afficherFicheVeto(k) {
  const f = veto.FICHES[k], dessin = el('div', { className: 'patient-veto' });
  dessin.innerHTML = apercu(article(`animal:${k}`));
  const texte = `${f.nom}. ${f.besoins} Son repas : ${f.repas.toLowerCase()}. Le savais-tu ? ${f.savais}`;
  $('#veto-vue').replaceChildren(gros('← La clinique', afficherVeto, 'gros secondaire retour-atelier'), el('h2', { textContent: f.nom }), dessin,
    el('div', { className: 'carte carte-croyance' }, el('div', { className: 'tete-carte' }, el('h3', { textContent: 'Ses besoins' }), gros('🔊', () => parler(texte), 'rond')),
      el('p', { textContent: f.besoins }), el('p', { textContent: `🍽️ Son repas : ${f.repas.toLowerCase()}.` }), el('p', { className: 'savais', textContent: `Le savais-tu ? ${f.savais}` })));
  parler(texte);
}
const echapperHtml = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Le Memory : choisir un thème, seul ou à deux (avec un autre enfant de la famille, ou un invité), puis retrouver les paires
let memo = null, joueursMemory = null;
function ouvrirMemory() {
  taire();
  etoilesJoueuse();
  joueursMemory = [joueuse];
  afficherChoixMemory();
  montrer('memory');
  parler('Bienvenue dans la salle de jeux ! Choisis : tu joues seul ou à deux ? Puis choisis les cartes.', { ton: 1.1 });
}
function afficherChoixMemory() {
  const autres = etat.profils.filter((p) => p.id !== joueuse.id);
  const invite = { id: null, prenom: 'Joueur 2', age: joueuse.age } // pas d'étoiles pour un invité;
  const avec = joueursMemory[1];
  $('#memory-vue').replaceChildren(
    el('h2', { textContent: 'Qui joue ?' }),
    el('div', { className: 'phrases' },
      gros(acc('🙂 {Seul|Seule}'), () => { joueursMemory = [joueuse]; afficherChoixMemory(); }, `petit${avec ? '' : ' choisi'}`),
      ...[...autres, invite].map((p) => gros(`👫 À deux avec ${p.id ? p.prenom : 'quelqu’un d’autre'}`, () => { joueursMemory = [joueuse, p]; afficherChoixMemory(); parler(`À deux avec ${p.id ? p.prenom : 'quelqu’un d’autre'} !`); }, `petit${avec && avec.id === p.id ? ' choisi' : ''}`))),
    el('h2', { textContent: 'Le Memory : quelles cartes ?' }),
    el('div', { className: 'themes-memory' }, ...Object.entries(memory.THEMES).map(([k, t]) => gros(`${t.image} ${t.nom}`, () => commencerMemory(k)))),
    el('p', { className: 'carte presentation', textContent: `${memory.nbPaires(Math.min(...joueursMemory.map((j) => j.age)))} paires à trouver. Chaque paire rapporte des étoiles${avec ? ' à celui ou celle qui la trouve' : ''} !` }));
}
function commencerMemory(theme) {
  clearTimeout(attenteMemory);
  attenteMemory = null;
  memo = memory.nouvellePartie(theme, joueursMemory.map((j) => ({ id: j.id, prenom: j.prenom, age: j.age })));
  afficherMemory();
  parler(memo.joueurs.length > 1 ? `C'est parti ! ${memo.joueurs[0].prenom} commence. Retourne deux cartes pour trouver une paire.` : 'C’est parti ! Retourne deux cartes pour trouver une paire.', { ton: 1.1 });
}
function afficherMemory(message = '') {
  const p = memo, cartes = memory.THEMES[p.theme].cartes(), infos = Object.fromEntries(cartes.map((c) => [c.cle, c]));
  const colonnes = p.cartes.length <= 12 ? 4 : 5;
  const grille = el('div', { className: 'grille-memory' });
  grille.style.gridTemplateColumns = `repeat(${colonnes}, minmax(0, 1fr))`;
  p.cartes.forEach((c, i) => {
    const visible = c.trouvee !== null || p.ouvertes.includes(i);
    const b = el('button', { className: `carte-memory${visible ? ' retournee' : ''}${c.trouvee !== null ? ` trouvee joueur${c.trouvee}` : ''}` });
    b.innerHTML = visible ? `<span class="face">${infos[c.cle].dessin}<small>${echapperHtml(infos[c.cle].nom)}</small></span>` : '<span class="dos" aria-hidden="true">🏝️</span>';
    b.setAttribute('aria-label', visible ? infos[c.cle].nom : `Carte ${i + 1}, cachée`);
    b.disabled = c.trouvee !== null;
    b.addEventListener('click', () => retournerMemory(i));
    grille.append(b);
  });
  const scores = p.joueurs.length > 1
    ? el('div', { className: 'scores-memory' }, ...p.joueurs.map((j, k) => el('span', { className: `score joueur${k}${p.tour === k ? ' a-toi' : ''}`, textContent: `${p.tour === k ? '👉 ' : ''}${j.prenom} : ${p.paires[k]}` })))
    : el('p', { className: 'scores-memory', textContent: `Paires : ${p.paires[0]} / ${p.cartes.length / 2} · Essais : ${p.coups}` });
  $('#memory-vue').replaceChildren(gros('← Changer de jeu', afficherChoixMemory, 'gros secondaire retour-atelier'), scores, grille, el('p', { className: 'savais message-memory', textContent: message }));
}
let attenteMemory = null;
function retournerMemory(i) {
  if (attenteMemory) return; // deux cartes ratées encore visibles
  const p = memo, r = memory.retourner(p, i);
  if (r === 'non') return;
  const c = memory.carte(p.theme, p.cartes[i].cle);
  if (r === 'premiere') { afficherMemory(); return parler(c.nom); }
  if (r === 'ratee') {
    afficherMemory();
    bip(false);
    const suivant = p.joueurs[(p.tour + 1) % p.joueurs.length];
    parler(p.joueurs.length > 1 ? `${c.nom}. Pas pareil ! À toi, ${suivant.prenom}.` : `${c.nom}. Pas pareil ! Essaie encore.`);
    attenteMemory = setTimeout(() => { attenteMemory = null; if (memo !== p) return; memory.cacher(p); afficherMemory(); }, 1600);
    return;
  }
  bip(true);
  const qui = p.joueurs.length > 1 ? ` pour ${p.joueurs[p.tour].prenom}` : '';
  if (r === 'paire') {
    afficherMemory(`Le savais-tu ? ${c.savais}`);
    return parler(`Une paire${qui} : ${c.nom} ! Le savais-tu ? ${c.savais}${p.joueurs.length > 1 ? ' Tu rejoues !' : ''}`, { ton: 1.1 });
  }
  finirMemory(c);
}
function finirMemory(derniere) {
  const p = memo, gains = memory.etoiles(p), g = memory.gagnant(p);
  p.joueurs.forEach((j, k) => { const profil = etat.profils.find((x) => x.id === j.id); if (profil) profil.etoiles += gains[k]; });
  enregistrer();
  etoilesJoueuse();
  const titre = p.joueurs.length === 1 ? `Bravo ${joueuse.prenom} : toutes les paires en ${p.coups} essais !` : g === null ? 'Égalité ! Bravo à vous deux !' : `${p.joueurs[g].prenom} gagne ! Bravo à vous deux !`;
  const detail = p.joueurs.map((j, k) => `${j.prenom} : ${p.paires[k]} paire${p.paires[k] > 1 ? 's' : ''}${j.id ? `, +${formatEtoiles(gains[k])} ⭐` : ''}`).join(' · ');
  $('#memory-vue').replaceChildren(el('h2', { textContent: titre }), el('p', { className: 'carte presentation', textContent: detail }),
    el('p', { className: 'savais', textContent: `Dernière paire : ${derniere.nom}. Le savais-tu ? ${derniere.savais}` }),
    el('div', { className: 'actions-atelier' }, gros('🔁 Rejouer', () => commencerMemory(p.theme)), gros('🃏 Autres cartes', afficherChoixMemory, 'gros secondaire')));
  parler(`${titre} ${detail.replaceAll('⭐', 'étoiles').replaceAll('·', '.')}. Dernière paire : ${derniere.nom}. Le savais-tu ? ${derniere.savais}`, { ton: 1.15 });
}

// Le passeport du monde : la carte et l'avion, la fiche d'un pays, le livret des tampons
let paysCourant = 'suisse';
function ouvrirPasseport() {
  etoilesJoueuse();
  afficherPasseport('carte');
  montrer('passeport');
  parler('Bienvenue à l’aéroport ! Choisis un pays : l’avion t’y emmène.', { ton: 1.1 });
}
function afficherPasseport(vue) {
  etoilesJoueuse();
  const v = $('#passeport-vue'), tampons = joueuse.passeport;
  const carte = el('div', { className: 'toile-cadre' });
  carte.innerHTML = passeport.dessinerCarte(tampons, paysCourant);
  if (vue === 'livret') {
    const mots = passeport.motsDebloques(joueuse);
    v.replaceChildren(gros('← La carte', () => afficherPasseport('carte'), 'gros secondaire retour-atelier'), el('h2', { textContent: `📘 Mon passeport : ${tampons.length} / ${passeport.PAYS.length}` }),
      el('p', { className: 'savais', textContent: `🗣️ ${mots} mot${mots > 1 ? 's' : ''} de voyage appris. Touche un tampon pour les réécouter.` }),
      el('div', { className: 'livret' }, ...passeport.PAYS.map((p) => {
        const a = tampons.includes(p.cle);
        const t = el(a ? 'button' : 'div', { className: `tampon${a ? '' : ' vide'}` }, el('span', { className: 'drapeau', textContent: a ? p.drapeau : '?' }), el('span', { textContent: a ? p.nom : '…' }));
        if (a) t.addEventListener('click', () => { paysCourant = p.cle; afficherPasseport('pays'); });
        return t;
      })));
    return parler(`Ton passeport a ${tampons.length} tampon${tampons.length > 1 ? 's' : ''} et ${mots} mot${mots > 1 ? 's' : ''} de voyage.`);
  }
  if (vue === 'pays') {
    const p = passeport.pays(paysCourant);
    v.replaceChildren(gros('← La carte', () => afficherPasseport('carte'), 'gros secondaire retour-atelier'), carte,
      el('div', { className: 'carte fiche-pays' }, el('div', { className: 'tete-carte' }, el('span', { className: 'drapeau-grand', textContent: p.drapeau }), el('h2', { textContent: p.nom }),
        gros('🔊', () => parler(passeport.presentation(p, joueuse.age)), 'rond')),
      el('ul', {}, el('li', { textContent: `🏛️ Capitale : ${p.capitale}` }), el('li', { textContent: `${p.animal[0]} Un animal : ${p.animal[1]}` }),
        el('li', { textContent: `${p.plat[0]} Un plat : ${p.plat[1]}` }), el('li', { textContent: `🗣️ On y parle ${p.langue}` })),
      el('p', { className: 'savais', textContent: `Le savais-tu ? ${p.savais}` })),
      carteMots(p, tampons.includes(p.cle)),
      gros(tampons.includes(p.cle) ? '✈️ Petit quiz (déjà tamponné ✓)' : '✈️ Petit quiz pour gagner le tampon', () => lancerJeu('passeport')));
    return parler(passeport.presentation(p, joueuse.age));
  }
  v.replaceChildren(carte, el('div', { className: 'actions-atelier' }, gros(`📘 Mon passeport (${tampons.length} / ${passeport.PAYS.length})`, () => afficherPasseport('livret'), 'gros secondaire'),
    gros('🏔️ L’explorateur de la Suisse', () => lancerJeu('suisse')), gros('🗣️ L’école des langues', () => ouvrirLangues())),
    el('div', { className: 'phrases' }, ...passeport.PAYS.map((p) => gros(`${p.drapeau} ${p.nom}${tampons.includes(p.cle) ? ' ✓' : ''}`, () => voyager(p.cle), `petit${tampons.includes(p.cle) ? ' choisi' : ''}`))));
}
// Les 6 mots de voyage du pays : débloqués par le tampon, chacun avec sa prononciation et un 🔊
function carteMots(p, ouvert) {
  const m = passeport.MOTS[p.cle], titre = el('h3', { textContent: `🗣️ Mes mots en ${m.langue}` });
  if (!ouvert) return el('div', { className: 'carte fiche-pays' }, titre, el('p', { textContent: `🔒 Gagne le tampon pour débloquer ${m.mots.length} mots en ${m.langue} : bonjour, merci, au revoir…` }));
  return el('div', { className: 'carte fiche-pays' }, titre, el('ul', { className: 'mots-voyage' }, ...m.mots.map((x) =>
    el('li', {}, gros('🔊', () => parlerLangue(x.mot, m.lang, x.dire), 'rond'),
      el('span', {}, el('strong', { textContent: `${x.fr} : ${x.mot}` }), x.latin ? ` (${x.latin})` : '', el('br'), el('em', { textContent: `on dit « ${x.dire} »` }))))));
}
// L'avion vole jusqu'au pays, puis on découvre sa fiche
function voyager(cle) {
  const avion = $('#passeport-vue .avion');
  const [x, y] = passeport.position(cle);
  paysCourant = cle;
  if (avion) avion.style.transform = `translate(${x}px, ${y}px)`;
  parler(`En route pour ${passeport.pays(cle).nom.replace(/^La |^Le |^L’/, (m) => m.toLowerCase())} !`);
  setTimeout(() => { if (!$('[data-ecran="passeport"]').hidden) afficherPasseport('pays'); }, 1500);
}

// ---------- Un écran libre, pour les jeux qui ne sont pas des questions (labyrinthe, glacier, missions, écriture, défi) ----------
function ouvrirLibre(titre, decor = null) {
  taire();
  etoilesJoueuse();
  $('#libre-titre').textContent = titre;
  montrer('libre');
  poserDecor($('#decor'), decor);
  return $('#libre-vue');
}
const libreOuvert = (titre) => !$('[data-ecran="libre"]').hidden && $('#libre-titre').textContent === titre;
const gagnerEtoiles = (n, profil = joueuse) => { profil.etoiles += n; enregistrer(); etoilesJoueuse(); };
// Une partie finie de plus dans ce jeu : c'est ce qui fait gagner les médailles de la carte
function compterPartie(nom, profil = joueuse, bonnes = null, questions = null) { (profil.parties ??= {})[nom] = (profil.parties[nom] ?? 0) + 1; suivi.noterPartie(profil, nom, bonnes, questions); } // et le journal de la semaine, pour les parents

// Les missions de la maison : l'enfant annonce, un parent valide avec le code
function ouvrirMissions(dire = true) {
  const v = ouvrirLibre('Les missions de la maison');
  const regle = `Fais une vraie mission à la maison, puis touche-la. Un parent valide avec son code, et tu gagnes ${missions.ETOILES_MISSION} étoiles. Chaque mission, une fois par jour.`;
  v.replaceChildren(el('p', { className: 'carte presentation', textContent: regle }), el('div', { className: 'galerie-cartes' }, ...missions.MISSIONS.map((x) => {
    const e = missions.etat(joueuse, x.cle);
    const b = el('button', { className: `carte-image${e === 'faite' ? ' choisi' : ''}` });
    b.innerHTML = `${imageFiche('vignettes', `mission-${x.cle}`, x.image)}<span>${x.nom}<br><small>${e === 'faite' ? `✓ Fait ! +${missions.ETOILES_MISSION} ⭐` : e === 'attente' ? '⏳ Un parent valide' : `+${missions.ETOILES_MISSION} ⭐`}</small></span>`;
    b.disabled = e === 'faite';
    b.addEventListener('click', () => {
      if (e === 'attente') return validerMission(x);
      missions.annoncer(joueuse, x.cle);
      enregistrer();
      ouvrirMissions(false);
      parler(`Bravo ! Demande à un parent de valider : ${x.nom}.`);
    });
    return b;
  })));
  if (dire) parler(`Les missions de la maison. ${regle}`, { ton: 1.1 });
}
function validerMission(x) {
  const champ = el('input', { className: 'champ-prenom', type: 'password', inputMode: 'numeric', maxLength: 4, autocomplete: 'off', placeholder: 'Code parent' });
  champ.setAttribute('aria-label', 'Code parent');
  const message = el('p', { className: 'erreur', role: 'status' });
  const fenetre = el('dialog', { className: 'fenetre-prenom' });
  const repondre = (oui) => {
    if (champ.value !== etat.code) return noter(message, 'Code incorrect.');
    const gain = missions.valider(joueuse, x.cle, oui);
    if (gain) compterPartie('missions');
    enregistrer();
    fenetre.close();
    ouvrirMissions(false);
    parler(gain ? `Mission réussie ! Tu gagnes ${gain} étoiles.` : 'Pas encore : tu pourras réessayer.', { ton: 1.1 });
    if (gain) bip(true);
  };
  fenetre.append(el('h2', { textContent: `${x.image} ${x.nom}` }), el('p', { textContent: 'Pour un parent : la mission est-elle faite ?' }), champ, message,
    el('div', { className: 'actions-prenom' }, gros('✔️ Oui, c’est fait', () => repondre(true)), gros('Pas encore', () => repondre(false), 'gros secondaire'), gros('Annuler', () => fenetre.close(), 'petit')));
  fenetre.addEventListener('close', () => fenetre.remove());
  document.body.append(fenetre);
  fenetre.showModal();
  champ.focus();
}

// Le labyrinthe : aller jusqu'au drapeau, avec les flèches ou en touchant une case voisine
let niveauLaby = 0;
function ouvrirLabyrinthe() {
  niveauLaby = 0;
  jouerLabyrinthe();
  parler('Le labyrinthe ! Trouve le chemin jusqu’au drapeau. Touche les flèches, ou une case à côté de toi.', { ton: 1.1 });
}
function jouerLabyrinthe() {
  const v = ouvrirLibre('Le labyrinthe');
  const l = labyrinthe.creer(labyrinthe.taille(joueuse.age, niveauLaby));
  let pos = l.depart, fini = false;
  const message = el('p', { className: 'carte score-grue', role: 'status', textContent: `Labyrinthe ${niveauLaby + 1} : va jusqu’au drapeau !` });
  const grille = el('div', { className: 'grille-laby', role: 'img', ariaLabel: 'Le labyrinthe' });
  grille.style.gridTemplateColumns = `repeat(${l.taille}, 1fr)`;
  const suite = el('div', { className: 'actions-atelier' });
  const aller = (d) => {
    if (fini) return;
    const n = labyrinthe.avancer(l, pos, d);
    if (n[0] === pos[0] && n[1] === pos[1]) return bip(false);
    pos = n;
    dessiner();
    if (pos[0] !== l.sortie[0] || pos[1] !== l.sortie[1]) return;
    fini = true;
    niveauLaby++;
    compterPartie('labyrinthe');
    const gain = labyrinthe.etoilesParLabyrinthe(joueuse.age);
    gagnerEtoiles(gain);
    bip(true);
    message.textContent = `Bravo, tu as trouvé la sortie ! +${formatEtoiles(gain)} ⭐`;
    suite.replaceChildren(gros('🌽 Un autre labyrinthe', jouerLabyrinthe));
    parler(`Bravo, tu as trouvé la sortie ! Tu gagnes ${formatEtoiles(gain)} étoiles.`, { ton: 1.15 });
  };
  const dessiner = () => grille.replaceChildren(...l.ouvert.map((o, i) => {
    const x = i % l.taille, y = Math.floor(i / l.taille);
    const c = el('span', { textContent: x === pos[0] && y === pos[1] ? '🙂' : x === l.sortie[0] && y === l.sortie[1] ? '🚩' : '' });
    for (const d of Object.keys(labyrinthe.DIRECTIONS)) if (!o.includes(d)) c.classList.add(`mur-${d}`);
    c.addEventListener('click', () => { const d = Object.entries(labyrinthe.DIRECTIONS).find(([, [dx, dy]]) => pos[0] + dx === x && pos[1] + dy === y)?.[0]; if (d) aller(d); });
    return c;
  }));
  const touche = (d, texte, nom) => { const b = el('button', { className: 'reponse robot-touche', textContent: texte, ariaLabel: nom }); b.addEventListener('click', () => aller(d)); return b; };
  v.replaceChildren(message, suite, grille, el('div', { className: 'pave-fleches' }, el('span'), touche('haut', '⬆️', 'En haut'), el('span'), touche('gauche', '⬅️', 'À gauche'), touche('bas', '⬇️', 'En bas'), touche('droite', '➡️', 'À droite')));
  dessiner();
}

// Le glacier de la plage : servir les commandes avant la fin du temps
function ouvrirGlacier() {
  const v = ouvrirLibre('Le glacier de la plage');
  const regle = 'Regarde la glace que veut le client. Touche les parfums pour empiler les boules dans le même ordre, de bas en haut, puis touche Servir. Attention au temps : tu as 3 cœurs !';
  v.replaceChildren(el('p', { className: 'carte presentation', textContent: regle }), gros('🍦 Jouer', jouerGlacier));
  parler(`Le glacier de la plage. ${regle}`, { ton: 1.1 });
}
function jouerGlacier() {
  taire();
  const v = $('#libre-vue'), age = joueuse.age, parfum = (cle) => glacier.PARFUMS.find((p) => p.cle === cle);
  let servies = 0, vies = glacier.VIES, cornet = [], cmd = [], visage = '🧒', fin = 0, total = 1;
  const score = el('p', { className: 'carte score-grue', role: 'status' });
  const client = el('div', { className: 'client-glacier' }), barre = el('div', { className: 'barre-temps' }, el('i')), monCornet = el('div', { className: 'cornet' }), parfums = el('div', { className: 'parfums' });
  const pile = (l) => `<span class="pile">${[...l].reverse().map((c) => `<i class="boule" style="background:${parfum(c).couleur}"></i>`).join('')}<i class="cone"></i></span>`;
  const dessiner = () => {
    score.textContent = `${'❤️'.repeat(vies)}${'🤍'.repeat(glacier.VIES - vies)}   🍦 ${servies}`;
    client.innerHTML = `<span class="tete" aria-hidden="true">${visage}</span><span class="bulle-glace" role="img" aria-label="Le client veut, de bas en haut : ${cmd.map((c) => parfum(c).nom).join(', ')}">${pile(cmd)}</span>`;
    monCornet.innerHTML = pile(cornet);
    monCornet.setAttribute('aria-label', `Ton cornet : ${cornet.map((c) => parfum(c).nom).join(', ') || 'vide'}`);
    parfums.replaceChildren(...glacier.PARFUMS.slice(0, glacier.nbParfums(age, glacier.niveau(servies))).map((p) => {
      const b = el('button', { className: 'parfum', ariaLabel: `Une boule ${p.nom}`, title: p.nom });
      b.style.background = p.couleur;
      b.addEventListener('click', () => { if (cornet.length < 4) { cornet.push(p.cle); dessiner(); } });
      return b;
    }));
  };
  const nouveau = () => {
    cmd = glacier.commande(age, servies);
    cornet = [];
    visage = glacier.CLIENTS[Math.floor(Math.random() * glacier.CLIENTS.length)];
    total = glacier.temps(age, glacier.niveau(servies)) * 1000;
    fin = performance.now() + total;
    monCornet.hidden = actions.hidden = false;
    dessiner();
  };
  const finir = () => {
    clearInterval(minuteur);
    const gain = servies * glacier.etoilesParGlace(age);
    if (gain) { compterPartie('glacier'); gagnerEtoiles(gain); }
    const texte = `Tu as servi ${servies} glace${servies > 1 ? 's' : ''} !${gain ? ` +${formatEtoiles(gain)} ⭐` : ''}`;
    v.replaceChildren(el('p', { className: 'carte score-grue', role: 'status', textContent: texte }), gros('🍦 Rejouer', jouerGlacier));
    parler(`C’est fini ! Tu as servi ${servies} glace${servies > 1 ? 's' : ''}.${gain ? ` Tu gagnes ${formatEtoiles(gain)} étoiles.` : ''}`, { ton: 1.1 });
  };
  const perdre = () => { vies--; bip(false); if (vies <= 0) finir(); else nouveau(); };
  // Dès 8 ans : après chaque glace, on rend la monnaie (2 francs la boule)
  const monnaie = () => {
    const prix = cmd.length * 2, donne = [5, 10, 20].filter((b) => b > prix)[Math.floor(Math.random() * (prix < 5 ? 2 : 1))] ?? 10, rendu = donne - prix;
    const choix = melanger([...new Set([rendu, rendu + 1, Math.max(1, rendu - 1), rendu + 2])]).slice(0, 3);
    if (!choix.includes(rendu)) choix[0] = rendu;
    fin = Infinity; // le temps s'arrête pendant le calcul
    monCornet.hidden = actions.hidden = true; // la question de monnaie prend la place du cornet et des boutons : tout tient sur l'écran d'un téléphone
    const texte = `La glace coûte ${prix} francs. Le client donne ${donne} francs. Combien lui rends-tu ?`;
    parfums.replaceChildren(el('p', { className: 'carte question-defi', textContent: `💰 ${texte}` }), el('div', { className: 'reponses-defi' }, ...melanger(choix).map((c) => {
      const b = el('button', { className: 'gros secondaire', textContent: `${c} franc${c > 1 ? 's' : ''}` });
      b.addEventListener('click', () => { if (c === rendu) { servies++; bip(true); nouveau(); } else perdre(); });
      return b;
    })));
    parler(texte);
  };
  const servir = () => { if (!glacier.juste(cmd, cornet)) return perdre(); if (age >= 8) return monnaie(); servies++; bip(true); nouveau(); };
  const minuteur = setInterval(() => {
    if (!libreOuvert('Le glacier de la plage') || !v.contains(barre)) return clearInterval(minuteur); // on a quitté le jeu
    const reste = fin - performance.now();
    barre.firstChild.style.width = `${Math.max(0, (reste / total) * 100)}%`;
    if (reste <= 0) perdre();
  }, 100);
  const actions = el('div', { className: 'actions-atelier' }, gros('↩️ Vider le cornet', () => { cornet = []; dessiner(); }, 'gros secondaire'), gros('🔔 Servir !', servir));
  v.replaceChildren(score, client, barre, monCornet, parfums, actions);
  nouveau();
}

// Le labo des expériences : choisir une expérience, la préparer, deviner, puis lire l'explication
function ouvrirLabo(cle = null) {
  const v = ouvrirLibre('Le labo des expériences'), faites = joueuse.experiences ?? [];
  if (cle === null) {
    v.replaceChildren(el('p', { className: 'carte presentation regle-d-or', textContent: `🧪 ${experiences.REGLE}` }),
      el('div', { className: 'galerie-cartes' }, ...experiences.EXPERIENCES.map((e) => {
        const b = el('button', { className: `carte-image${faites.includes(e.cle) ? ' choisi' : ''}` });
        b.innerHTML = `${imageFiche('vignettes', `labo-${e.cle}`, e.image)}<span>${e.nom}<br><small>${faites.includes(e.cle) ? '✓ Faite' : `⏱️ ${e.duree}`}</small></span>`;
        b.addEventListener('click', () => ouvrirLabo(e.cle));
        return b;
      })));
    return parler(`Le labo des expériences ! ${experiences.REGLE} Choisis une expérience.`, { ton: 1.1 });
  }
  const e = experiences.experience(cle), [question, bonne, ...autres] = e.devine;
  const reponse = el('div', { className: 'carte fiche-nature', role: 'status' });
  const deviner = el('div', { className: 'reponses-defi' }, ...melanger([bonne, ...autres]).map((c) => {
    const b = el('button', { className: 'gros secondaire', textContent: c });
    b.addEventListener('click', () => {
      for (const x of deviner.children) { x.disabled = true; if (x.textContent === bonne) x.classList.add('choisi'); }
      const gain = experiences.terminer(joueuse, e.cle);
      if (gain) { compterPartie('experiences'); enregistrer(); etoilesJoueuse(); } // les étoiles sont déjà ajoutées par terminer()
      const debut = c === bonne ? 'Bien deviné !' : `En vrai : ${bonne.toLowerCase()}. C’est en essayant qu’on découvre !`;
      reponse.replaceChildren(el('dl', {}, el('dt', { textContent: '💡 Pourquoi ?' }), el('dd', { textContent: e.explication })),
        el('p', { className: 'savais', textContent: gain ? `+${gain} ⭐ Maintenant, fais l’expérience pour de vrai !` : 'Maintenant, fais l’expérience pour de vrai !' }));
      bip(true);
      parler(`${debut} ${e.explication}${gain ? ` Tu gagnes ${gain} étoiles.` : ''} Maintenant, fais l’expérience pour de vrai, avec un adulte !`);
    });
    return b;
  }));
  // L'expérience faite pour de vrai : un parent valide avec son code
  const vraie = el('div', { className: 'carte fiche-nature' });
  if ((joueuse.vraies ?? []).includes(e.cle)) vraie.append(el('p', { className: 'erreur ok', textContent: '✅ Expérience faite pour de vrai !' }));
  else {
    const code = el('input', { type: 'password', inputMode: 'numeric', maxLength: 4, autocomplete: 'off' }), message = el('p', { className: 'erreur', role: 'status' });
    const form = el('form', { className: 'valider-recette', noValidate: true },
      el('p', { textContent: `Vous l’avez faite ensemble ? Un parent tape son code pour valider : +${experiences.ETOILES_VRAIE} ⭐.` }),
      el('label', { textContent: 'Code parent ' }, code), message, el('button', { className: 'gros', textContent: 'Valider l’expérience' }));
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (code.value !== etat.code) return noter(message, "Ce n'est pas le bon code.");
      const gain = experiences.validerVraie(joueuse, e.cle);
      enregistrer();
      etoilesJoueuse();
      vraie.replaceChildren(el('p', { className: 'erreur ok', textContent: `✅ Expérience faite pour de vrai ! +${gain} ⭐` }));
      bip(true);
      parler(`Bravo, tu as fait l’expérience pour de vrai ! Tu gagnes ${gain} étoiles.`, { ton: 1.15 });
    });
    vraie.append(el('h2', { textContent: '🧪 Tu l’as faite pour de vrai ?' }), form);
  }
  const tete = el('div', { className: 'tete-fiche' });
  tete.innerHTML = imageFiche('vignettes', `labo-${e.cle}`, e.image);
  v.replaceChildren(
    el('div', { className: 'carte fiche-nature' }, tete, el('h2', { textContent: e.nom }),
      el('dl', {}, el('dt', { textContent: `⏱️ ${e.duree}` }), el('dt', { textContent: '🧺 Il te faut' }), el('dd', {}, el('ul', {}, ...e.materiel.map((m) => el('li', { textContent: m })))),
        el('dt', { textContent: '👣 Les étapes' }), el('dd', {}, el('ol', {}, ...e.etapes.map((t, i) => { const li = el('li', { textContent: t }), src = image(`experiences/${e.cle}-${i + 1}`); if (src) li.append(el('img', { src, alt: '' })); return li; }))),
        ...(e.adulte ? [el('dt', { textContent: '🧑 Avec un adulte' }), el('dd', { textContent: e.adulte })] : []))),
    el('div', { className: 'actions-atelier' }, gros('🔊 Écouter', () => parler(experiences.lire(e)), 'gros secondaire'), gros('← Les expériences', () => ouvrirLabo())),
    el('h2', { textContent: `🤔 Devine d’abord : ${question}` }), deviner, reponse, vraie);
  parler(`${experiences.lire(e)} Devine d’abord : ${question}`);
}

// La tour des énigmes (île des méninges) : les jeux de logique
const IMAGES_FORMES = { '🔴': 'rouge', '🔵': 'bleu', '🟡': 'jaune', '🟢': 'vert', '🟣': 'violet', '🟠': 'orange', '⭐': 'etoile', '❤️': 'coeur', '🔺': 'triangle', '🟦': 'carre' };
function enFormes(texte) { // les formes des suites logiques : l'image à la place de l'emoji, quand elle existe
  return String(texte).split(' ').map((m) => { const src = IMAGES_FORMES[m] && image(`enigmes/forme-${IMAGES_FORMES[m]}`); return src ? `<img src="${src}" alt="${m}">` : m; }).join(' ');
}
function habillerEnigme(b, nom, q) { // le bouton d'une réponse de l'intrus ou d'une suite
  if (nom === 'intrus') { // l'image, et son mot dessous pour s'habituer à le lire
    const [mot, emoji, ailleurs] = enigmes.OBJETS[b.dataset.v], src = image(ailleurs ?? `enigmes/${b.dataset.v}`);
    b.classList.add('reponse-objet');
    b.replaceChildren(src ? el('img', { src, alt: '' }) : el('span', { className: 'emoji-objet', textContent: emoji, ariaHidden: 'true' }), el('span', { textContent: mot }));
  } else if (typeof q.reponse === 'string') { b.classList.add('reponse-image'); b.innerHTML = enFormes(b.dataset.v); } // des formes : en grand
}
// Mes rendez-vous : la série de jours, le coffre de la semaine, l'énigme du jour
function ouvrirRendezVous(dire = true) {
  const v = ouvrirLibre('Mes rendez-vous'), serie = suivi.serieEnCours(joueuse), dansLaSemaine = serie % 7, reste = 7 - dansLaSemaine;
  const coffre = gros(suivi.coffrePret(joueuse) ? '🎁 Ouvrir le coffre de la semaine' : '🎁 Coffre ouvert : le prochain arrive lundi', () => {
    const gain = suivi.ouvrirCoffre(joueuse);
    enregistrer(); etoilesJoueuse(); fanfare();
    ouvrirRendezVous(false);
    parler(`Dans le coffre, il y avait ${gain} étoiles !`, { ton: 1.15 });
  });
  coffre.disabled = !suivi.coffrePret(joueuse);
  const enigme = gros(suivi.enigmeFaite(joueuse) ? '🧩 Énigme du jour faite : reviens demain' : `🧩 L’énigme du jour (+${suivi.ETOILES_ENIGME} ⭐)`, () => ouvrirEnigmeDuJour());
  enigme.disabled = suivi.enigmeFaite(joueuse);
  v.replaceChildren(
    el('p', { className: 'carte presentation', textContent: `Tu es ${acc('{venu|venue}')} ${serie} jour${serie > 1 ? 's' : ''} de suite. Encore ${reste} jour${reste > 1 ? 's' : ''} et tu gagnes ${suivi.ETOILES_SEPTIEME} étoiles !` }),
    el('div', { className: 'serie-jours', role: 'img', ariaLabel: `${dansLaSemaine} jours sur 7` }, ...Array.from({ length: 7 }, (_, i) => el('span', { className: i < dansLaSemaine ? 'fait' : '', textContent: i === 6 ? '⭐' : i < dansLaSemaine ? '🔥' : String(i + 1) }))),
    el('div', { className: 'actions-atelier' }, coffre, enigme));
  if (dire) parler(`Tu es ${acc('{venu|venue}')} ${serie} jour${serie > 1 ? 's' : ''} de suite. Encore ${reste} jour${reste > 1 ? 's' : ''} et tu gagnes ${suivi.ETOILES_SEPTIEME} étoiles !`);
}
function ouvrirEnigmeDuJour() {
  const v = ouvrirLibre('L’énigme du jour'), q = enigmes.enigmeDuJour(joueuse.age, suivi.jour());
  if (suivi.enigmeFaite(joueuse)) return ouvrirRendezVous();
  const message = el('p', { className: 'carte score-grue', role: 'status', textContent: q.consigne });
  const suite = el('div', { className: 'actions-atelier' });
  const reponses = el('div', { className: 'reponses-enigme' }, ...q.choix.map((c) => {
    const b = el('button', { className: 'reponse', textContent: String(c) });
    b.dataset.v = c;
    habillerEnigme(b, q.jeu, q);
    b.addEventListener('click', () => {
      const juste = c === q.reponse, gain = suivi.repondreEnigme(joueuse, juste);
      for (const x of reponses.children) { x.disabled = true; if (x.dataset.v === String(q.reponse)) x.classList.add('juste'); else if (x === b) x.classList.add('faux'); }
      compterPartie('enigme-du-jour', joueuse, juste ? 1 : 0, 1);
      enregistrer(); etoilesJoueuse(); bip(juste);
      message.textContent = juste ? `Bravo ! +${gain} ⭐. ${q.solution}` : `Pas cette fois. ${q.solution} Une nouvelle énigme t’attend demain !`;
      suite.replaceChildren(gros('← Mes rendez-vous', () => ouvrirRendezVous(false)));
      parler(message.textContent.replace('+', 'Tu gagnes ').replace(' ⭐', ' étoiles'), { ton: juste ? 1.15 : 1 });
    });
    return b;
  }));
  v.replaceChildren(message, ...(q.image ? [el('div', { className: 'suite-logique carte', role: 'img', ariaLabel: 'La suite', innerHTML: enFormes(q.image) })] : []), reponses, suite);
  parler(q.consigne);
}
function ouvrirEnigmes() {
  const v = ouvrirLibre('La tour des énigmes');
  const carte = (emoji, nom, detail, action, src = image(`enigmes/carte-${emoji}`)) => {
    const b = el('button', { className: 'carte-image' });
    b.innerHTML = `${src ? `<img src="${src}" alt="">` : '<span class="emoji-theme" aria-hidden="true">🧩</span>'}<span>${nom}<br><small>${detail}</small></span>`;
    b.addEventListener('click', action);
    return b;
  };
  v.replaceChildren(el('div', { className: 'galerie-cartes grandes' },
    carte('intrus', 'Trouve l’intrus', 'L’image qui ne va pas avec les autres', () => lancerJeu('intrus')),
    carte('suites', 'Les suites logiques', 'Qu’est-ce qui vient après ?', () => lancerJeu('suites')),
    carte('potions', 'Les potions du laboratoire', 'Une seule couleur par fiole', () => ouvrirPotions()),
    ...logique.jeuxPourAge(joueuse.age).map((j) => carte(j, logique.JEUX_LOGIQUE[j][0], logique.JEUX_LOGIQUE[j][1], () => ouvrirNiveaux(j))),
    ...(suivi.enigmeFaite(joueuse) ? [] : [carte('jour', 'L’énigme du jour', `Une seule par jour : +${suivi.ETOILES_ENIGME} ⭐`, () => ouvrirEnigmeDuJour())])));
  parler('La tour des énigmes ! Choisis un jeu.', { ton: 1.1 });
}
// Les potions du laboratoire : d'abord le choix du niveau (un niveau réussi ouvre le suivant), puis le niveau
const COULEURS_POTIONS = [['#e8483f', '●'], ['#3d7be0', '▲'], ['#f2c230', '■'], ['#3aa860', '★'], ['#a05ad6', '◆'], ['#f08a2c', '♥'], ['#35b8c8', '✚'], ['#e86fa8', '☾'], ['#8a6a4a', '✿']]; // la couleur et un signe, pour ceux qui confondent les couleurs
function ouvrirPotions(dire = true) {
  const v = ouvrirLibre('Les potions du laboratoire'), faits = enigmes.potionsReussies(joueuse), niveaux = enigmes.niveauxPotions(joueuse.age);
  v.replaceChildren(
    el('p', { className: 'carte presentation', textContent: 'Verse les potions d’une fiole à l’autre, jusqu’à avoir une seule couleur par fiole. On verse seulement sur la même couleur, ou dans une fiole vide.' }),
    el('div', { className: 'niveaux-potions' }, ...niveaux.map((_, n) => {
      const b = el('button', { className: `gros${n < faits ? ' secondaire' : ''}`, textContent: n < faits ? `✓ ${n + 1}` : n === faits ? `${n + 1}` : `🔒 ${n + 1}`, disabled: n > faits });
      b.setAttribute('aria-label', `Niveau ${n + 1}${n < faits ? ', réussi' : n > faits ? ', fermé' : ''}`);
      b.addEventListener('click', () => jouerPotions(n));
      return b;
    })),
    el('div', { className: 'actions-atelier' }, gros('← La tour des énigmes', () => ouvrirEnigmes(), 'gros secondaire')));
  if (dire) parler('Les potions du laboratoire ! Verse les potions d’une fiole à l’autre, jusqu’à avoir une seule couleur par fiole. Choisis un niveau.', { ton: 1.1 });
}
function jouerPotions(n) {
  const v = ouvrirLibre('Les potions du laboratoire'), depart = enigmes.potionsDuNiveau(n, joueuse.age), { hauteur } = depart;
  let etat = depart.etat, choisie = null, coups = 0, fini = false;
  const message = el('p', { className: 'carte score-grue', role: 'status', textContent: `Niveau ${n + 1} : touche une fiole, puis celle où tu veux verser.` });
  const table = el('div', { className: 'fioles' }), suite = el('div', { className: 'actions-atelier' });
  const toucher = (i) => {
    if (fini) return;
    if (choisie === null) { if (etat[i].length) choisie = i; return dessiner(); }
    const apres = i === choisie ? null : enigmes.verser(etat, choisie, i, hauteur);
    if (i !== choisie && !apres) bip(false);
    choisie = null;
    if (!apres) return dessiner();
    etat = apres;
    coups++;
    dessiner();
    if (!enigmes.potionsTriees(etat, hauteur)) return;
    fini = true;
    const gain = enigmes.terminerPotion(joueuse, n);
    compterPartie('potions');
    enregistrer();
    etoilesJoueuse();
    bip(true);
    message.textContent = `Bravo, tout est trié en ${coups} coups !${gain ? ` +${gain} ⭐` : ''}`;
    suite.replaceChildren(...(n + 1 < enigmes.niveauxPotions(joueuse.age).length ? [gros('🧪 Niveau suivant', () => jouerPotions(n + 1))] : []), gros('← Les niveaux', () => ouvrirPotions(false), 'gros secondaire'));
    parler(`Bravo, tout est trié !${gain ? ` Tu gagnes ${gain} étoiles.` : ''}`, { ton: 1.15 });
  };
  const dessiner = () => table.replaceChildren(...etat.map((f, i) => {
    const b = el('button', { className: `fiole${i === choisie ? ' choisie' : ''}` });
    b.style.setProperty('--hauteur', hauteur);
    b.setAttribute('aria-label', `Fiole ${i + 1} : ${f.length ? `${f.length} couche${f.length > 1 ? 's' : ''}` : 'vide'}${i === choisie ? ', choisie' : ''}`);
    b.append(...f.map((c) => { const s = el('span', { textContent: COULEURS_POTIONS[c][1] }); s.style.background = COULEURS_POTIONS[c][0]; return s; }));
    b.addEventListener('click', () => toucher(i));
    return b;
  }));
  suite.replaceChildren(gros('↺ Recommencer', () => jouerPotions(n), 'gros secondaire'), gros('← Les niveaux', () => ouvrirPotions(false), 'gros secondaire'));
  v.replaceChildren(message, table, suite);
  dessiner();
}

// La tour des énigmes, suite : les jeux à niveaux (règles et niveaux dans js/jeux/logique.js)
function ouvrirNiveaux(nom, dire = true) {
  const [titre, but, , total] = logique.JEUX_LOGIQUE[nom], v = ouvrirLibre(titre), faits = logique.niveauxFaits(joueuse, nom);
  v.replaceChildren(
    el('p', { className: 'carte presentation', textContent: `${but}.` }),
    el('div', { className: 'niveaux-potions' }, ...Array.from({ length: total }, (_, n) => {
      const b = el('button', { className: `gros${n < faits ? ' secondaire' : ''}`, textContent: n < faits ? `✓ ${n + 1}` : n === faits ? `${n + 1}` : `🔒 ${n + 1}`, disabled: n > faits });
      b.setAttribute('aria-label', `Niveau ${n + 1}${n < faits ? ', réussi' : n > faits ? ', fermé' : ''}`);
      b.addEventListener('click', () => JOUER_LOGIQUE[nom](n));
      return b;
    })),
    el('div', { className: 'actions-atelier' }, gros('← La tour des énigmes', () => ouvrirEnigmes(), 'gros secondaire')));
  if (dire) parler(`${titre} ! ${but}. Choisis un niveau.`, { ton: 1.1 });
}
// Le cadre d'un niveau : la consigne en haut, les boutons en bas. gagner(texte) : le niveau est réussi.
function cadreNiveau(nom, n, consigne) {
  const v = ouvrirLibre(logique.JEUX_LOGIQUE[nom][0]);
  const message = el('p', { className: 'carte score-grue', role: 'status', textContent: `Niveau ${n + 1} : ${consigne}` });
  const suite = el('div', { className: 'actions-atelier' }, gros('↺ Recommencer', () => JOUER_LOGIQUE[nom](n), 'gros secondaire'), gros('← Les niveaux', () => ouvrirNiveaux(nom, false), 'gros secondaire'));
  const dire = (texte, juste = false) => { message.textContent = texte; bip(juste); };
  const gagner = (texte) => {
    const gain = logique.terminerNiveau(joueuse, nom, n);
    compterPartie(nom);
    enregistrer();
    etoilesJoueuse();
    fanfare();
    message.textContent = `${texte}${gain ? ` +${gain} ⭐` : ''}`;
    suite.replaceChildren(...(n + 1 < logique.JEUX_LOGIQUE[nom][3] ? [gros('➜ Niveau suivant', () => JOUER_LOGIQUE[nom](n + 1))] : []), gros('← Les niveaux', () => ouvrirNiveaux(nom, false), 'gros secondaire'));
    parler(`${texte}${gain ? ` Tu gagnes ${gain} étoiles.` : ''}`, { ton: 1.15 });
  };
  return { v, message, suite, dire, gagner };
}
const imageOuTexte = (chemin, texte) => { const src = image(chemin); return src ? el('img', { src, alt: texte }) : el('span', { textContent: texte }); };

const FRUITS_SUDOKU = [['pomme', '🍎'], ['banane', '🍌'], ['fraise', '🍓'], ['raisin', '🍇']];
function jouerSudoku(n) {
  const s = logique.sudokuDuNiveau(n, joueuse.age), grille = s.depart.map((l) => [...l]);
  const c = cadreNiveau('sudoku', n, s.images ? 'touche une case vide, puis le fruit qui va dedans.' : 'touche une case vide, puis le chiffre qui va dedans.');
  const symbole = (v) => (s.images ? imageOuTexte(`enigmes/${FRUITS_SUDOKU[v][0]}`, FRUITS_SUDOKU[v][1]) : el('span', { textContent: String(v + 1) }));
  const table = el('div', { className: 'sudoku' }), palette = el('div', { className: 'palette-sudoku' });
  let choisie = null, fini = false;
  table.style.setProperty('--taille', s.taille);
  const dessiner = () => table.replaceChildren(...grille.flatMap((l, r) => l.map((v, col) => {
    const b = el('button', { className: `${s.depart[r][col] !== null ? 'donnee' : ''}${choisie === r * s.taille + col ? ' choisie' : ''}${(col + 1) % s.carre[1] === 0 && col + 1 < s.taille ? ' bord-droit' : ''}${(r + 1) % s.carre[0] === 0 && r + 1 < s.taille ? ' bord-bas' : ''}`, disabled: v !== null || fini });
    b.setAttribute('aria-label', `Ligne ${r + 1}, colonne ${col + 1}${v === null ? ', vide' : ''}`);
    if (v !== null) b.append(symbole(v));
    b.addEventListener('click', () => { choisie = r * s.taille + col; dessiner(); });
    return b;
  })));
  palette.append(...Array.from({ length: s.taille }, (_, v) => {
    const b = el('button', { className: 'jeton' }, symbole(v));
    b.addEventListener('click', () => {
      if (fini) return;
      if (choisie === null) return c.dire('Touche d’abord une case vide.');
      const r = Math.floor(choisie / s.taille), col = choisie % s.taille;
      if (s.solution[r][col] !== v) return c.dire('Pas celui-là : regarde bien la ligne, la colonne et le carré.');
      grille[r][col] = v;
      choisie = null;
      bip(true);
      fini = grille.every((l) => l.every((x) => x !== null));
      dessiner();
      if (fini) c.gagner('Bravo, la grille est finie !');
    });
    return b;
  }));
  c.v.replaceChildren(c.message, table, palette, c.suite);
  dessiner();
}

const IMAGES_TAQUIN = ['renard', 'hibou', 'ecureuil', 'herisson', 'grenouille', 'papillon', 'coccinelle', 'canard', 'cerf', 'loup', 'lievre', 'castor'];
function jouerTaquin(n) {
  const t = logique.taquinDuNiveau(n, joueuse.age), src = image(`nature/${IMAGES_TAQUIN[n % IMAGES_TAQUIN.length]}`);
  const c = cadreNiveau('taquin', n, 'touche une case à côté du trou pour la faire glisser.');
  const table = el('div', { className: 'taquin' });
  let cases = t.cases, coups = 0, fini = false;
  table.style.setProperty('--cote', t.cote);
  const dessiner = () => table.replaceChildren(...cases.map((v, i) => {
    const trou = v === cases.length - 1 && !fini, b = el('button', { className: trou ? 'trou' : '', disabled: trou || fini });
    if (!trou) {
      if (src) Object.assign(b.style, { backgroundImage: `url(${src})`, backgroundPosition: `${((v % t.cote) / (t.cote - 1)) * 100}% ${(Math.floor(v / t.cote) / (t.cote - 1)) * 100}%` });
      b.append(el('small', { textContent: String(v + 1) }));
      b.setAttribute('aria-label', `Case ${v + 1}`);
    }
    b.addEventListener('click', () => {
      const s = logique.glisser(cases, i);
      if (!s) return bip(false);
      cases = s;
      coups++;
      fini = logique.taquinRange(cases);
      dessiner();
      if (fini) c.gagner(`Bravo, l’image est refaite en ${coups} coups !`);
    });
    return b;
  }));
  c.v.replaceChildren(c.message, table, c.suite);
  dessiner();
}

function jouerParking(n) {
  const c = cadreNiveau('parking', n, 'touche un véhicule, puis une flèche. Fais sortir la voiture rouge par la droite.');
  const table = el('div', { className: 'parking' }), fleches = el('div', { className: 'actions-atelier' });
  let vehicules = logique.parkingDuNiveau(n, joueuse.age), choisi = 0, coups = 0, fini = false;
  const bouger = (pas) => {
    if (fini) return;
    const s = logique.deplacer(vehicules, choisi, pas);
    if (!s) return bip(false);
    vehicules = s;
    coups++;
    fini = logique.parkingLibre(vehicules);
    dessiner();
    if (fini) c.gagner(`Bravo, la voiture rouge est sortie en ${coups} coups !`);
  };
  const dessiner = () => {
    table.replaceChildren(el('span', { className: 'sortie', textContent: '➜', ariaHidden: 'true' }), ...vehicules.map(([r, col, l, d], i) => {
      const src = image(`enigmes/${i === 0 ? 'auto-rouge' : l === 3 ? 'auto-camion' : 'auto'}`);
      const b = el('button', { className: `vehicule ${d}${i === 0 ? ' rouge' : ''}${i === choisi ? ' choisi' : ''}${src ? ' en-image' : ''}`, disabled: fini });
      Object.assign(b.style, { gridRow: `${r + 1} / span ${d === 'v' ? l : 1}`, gridColumn: `${col + 1} / span ${d === 'h' ? l : 1}` });
      b.style.setProperty('--teinte', `${[0, -110, 60, -150, -40, 90, -75, 30][i % 8]}deg`); // l'image est bleue : on la tourne vers d'autres couleurs, jamais vers le rouge
      b.style.setProperty('--long', l);
      if (src) b.append(el('img', { src, alt: '' }));
      b.setAttribute('aria-label', `${i === 0 ? 'La voiture rouge' : l === 3 ? 'Un camion' : 'Une voiture'}${i === choisi ? ', choisie' : ''}`);
      b.addEventListener('click', () => { choisi = i; dessiner(); });
      return b;
    }));
    const couche = vehicules[choisi][3] === 'h';
    fleches.replaceChildren(gros(couche ? '◀' : '▲', () => bouger(-1)), gros(couche ? '▶' : '▼', () => bouger(1)));
    fleches.children[0].setAttribute('aria-label', couche ? 'Vers la gauche' : 'Vers le haut');
    fleches.children[1].setAttribute('aria-label', couche ? 'Vers la droite' : 'Vers le bas');
  };
  c.v.replaceChildren(c.message, table, fleches, c.suite);
  dessiner();
}

function jouerTour(n) {
  const c = cadreNiveau('tour', n, `touche un piquet, puis celui où tu veux poser le disque. On peut le faire en ${logique.coupsMinTour(n)} coups.`);
  const table = el('div', { className: 'tour-disques' });
  let piquets = logique.tourDuNiveau(n), choisi = null, coups = 0, fini = false;
  table.style.setProperty('--disques', logique.TOURS[n]);
  const dessiner = () => table.replaceChildren(...piquets.map((p, i) => {
    const b = el('button', { className: `piquet${i === choisi ? ' choisi' : ''}`, disabled: fini }, ...p.map((d) => { const s = el('span'); s.style.setProperty('--d', d); return s; }));
    b.setAttribute('aria-label', `Piquet ${i + 1} : ${p.length ? `${p.length} disque${p.length > 1 ? 's' : ''}` : 'vide'}${i === choisi ? ', choisi' : ''}`);
    b.addEventListener('click', () => {
      if (choisi === null) { if (p.length) choisi = i; return dessiner(); }
      const s = i === choisi ? null : logique.poser(piquets, choisi, i);
      if (i !== choisi && !s) c.dire('Un grand disque ne va jamais sur un petit.');
      choisi = null;
      if (!s) return dessiner();
      piquets = s;
      coups++;
      fini = logique.tourFinie(piquets);
      dessiner();
      if (fini) c.gagner(`Bravo, la tour est déplacée en ${coups} coups !`);
    });
    return b;
  }));
  c.v.replaceChildren(c.message, table, c.suite);
  dessiner();
}

const COULEURS_CODE = [['rouge', '🔴'], ['bleu', '🔵'], ['jaune', '🟡'], ['vert', '🟢'], ['violet', '🟣'], ['orange', '🟠']];
function jouerCode(n) {
  const [longueur, couleurs, essais] = logique.CODES[n], secret = logique.nouveauCode(n);
  const c = cadreNiveau('code', n, `trouve les ${longueur} couleurs cachées et leur ordre, en ${essais} essais. Attention : la même couleur peut être cachée plusieurs fois, par exemple rouge, rouge, bleu !`);
  const bille = (v) => imageOuTexte(`enigmes/forme-${COULEURS_CODE[v][0]}`, COULEURS_CODE[v][1]);
  const historique = el('ol', { className: 'essais-code' }), ligne = el('div', { className: 'essai-code en-cours' }), palette = el('div', { className: 'palette-sudoku' });
  let essai = [], faits = 0, fini = false;
  const dessiner = () => ligne.replaceChildren(...Array.from({ length: longueur }, (_, i) => el('span', {}, ...(essai[i] === undefined ? [] : [bille(essai[i])]))));
  palette.append(...Array.from({ length: couleurs }, (_, v) => {
    const b = el('button', { className: 'jeton' }, bille(v));
    b.setAttribute('aria-label', COULEURS_CODE[v][0]);
    b.addEventListener('click', () => {
      if (fini) return;
      essai.push(v);
      dessiner();
      if (essai.length < longueur) return;
      const [bien, mal] = logique.indicesCode(secret, essai);
      historique.append(el('li', {}, el('span', { className: 'essai-code' }, ...essai.map((x) => el('span', {}, bille(x)))), el('span', { textContent: `${bien} bien placée${bien > 1 ? 's' : ''}, ${mal} à déplacer` })));
      faits++;
      essai = [];
      dessiner();
      if (bien === longueur) { fini = true; return c.gagner(`Bravo, tu as trouvé le code en ${faits} essai${faits > 1 ? 's' : ''} !`); }
      if (faits >= essais) { fini = true; ligne.replaceChildren(...secret.map((x) => el('span', {}, bille(x)))); return c.dire('Plus d’essais ! Voici le code. Recommence : un nouveau code t’attend.'); }
      c.dire(`${bien} bien placée${bien > 1 ? 's' : ''}, ${mal} à déplacer. Encore ${essais - faits} essai${essais - faits > 1 ? 's' : ''}.`, bien > 0);
    });
    return b;
  }), gros('⌫', () => { essai.pop(); dessiner(); }, 'gros secondaire'));
  palette.lastChild.setAttribute('aria-label', 'Effacer la dernière couleur');
  c.v.replaceChildren(c.message, historique, ligne, palette, c.suite);
  dessiner();
}

function jouerDessins(n) {
  const d = logique.dessinDuNiveau(n), cases = d.cases.map((l) => l.map(() => false));
  const c = cadreNiveau('dessins', n, 'le nombre à gauche dit combien de cases colorier dans la ligne, celui du haut dans la colonne. Quand un nombre devient vert, c’est bon !');
  const table = el('div', { className: 'dessin-cache' });
  let fini = false;
  table.style.setProperty('--taille', cases.length);
  const dessiner = () => table.replaceChildren(el('span'), ...d.colonnes.map((x, col) => el('span', { className: `nombres haut${String(logique.nombresDe(cases.map((l) => l[col]))) === String(x) ? ' juste' : ''}`, textContent: x.join('\n') })),
    ...cases.flatMap((l, r) => [el('span', { className: `nombres${String(logique.nombresDe(l)) === String(d.lignes[r]) ? ' juste' : ''}`, textContent: d.lignes[r].join(' ') }), ...l.map((v, col) => {
      const b = el('button', { className: v ? 'coloriee' : '', disabled: fini });
      b.setAttribute('aria-label', `Ligne ${r + 1}, colonne ${col + 1}${v ? ', coloriée' : ''}`);
      b.addEventListener('click', () => {
        cases[r][col] = !v;
        fini = logique.dessinJuste(d, cases);
        dessiner();
        if (fini) c.gagner(`Bravo ! Le dessin caché, c’était ${d.nom}.`);
      });
      return b;
    })]));
  c.v.replaceChildren(c.message, table, c.suite);
  dessiner();
}

function jouerDeduction(n) {
  const d = logique.deductionDuNiveau(n), marques = Array.from({ length: d.taille }, () => Array(d.taille).fill(''));
  const c = cadreNiveau('deduction', n, 'chaque enfant a un animal différent. Touche une case : une fois pour « non », deux fois pour « oui ».');
  const table = el('div', { className: 'grille-deduction' });
  let fini = false;
  table.style.setProperty('--taille', d.taille);
  const dessiner = () => table.replaceChildren(el('span'), ...logique.ANIMAUX.slice(0, d.taille).map((a) => el('span', { className: 'tete' }, imageOuTexte(`enigmes/${a}`, a))),
    ...marques.flatMap((l, e) => [el('span', { className: 'tete', textContent: logique.ENFANTS[e] }), ...l.map((m, a) => {
      const b = el('button', { className: m === '✓' ? 'oui' : m === '✗' ? 'non' : '', textContent: m, disabled: fini });
      b.setAttribute('aria-label', `${logique.ENFANTS[e]} et ${logique.ARTICLES[logique.ANIMAUX[a]]} : ${m === '✓' ? 'oui' : m === '✗' ? 'non' : 'pas encore choisi'}`);
      b.addEventListener('click', () => { marques[e][a] = m === '' ? '✗' : m === '✗' ? '✓' : ''; dessiner(); });
      return b;
    })]));
  const verifier = gros('✔ Vérifier', () => {
    const choix = marques.map((l) => (l.filter((m) => m === '✓').length === 1 ? l.indexOf('✓') : null));
    if (choix.includes(null)) return c.dire('Il faut un seul « oui » pour chaque enfant.');
    if (!logique.deductionJuste(d, choix)) return c.dire('Ce n’est pas encore ça. Relis bien les indices.');
    fini = true;
    verifier.remove();
    dessiner();
    c.gagner('Bravo, tu as tout trouvé !');
  });
  c.v.replaceChildren(c.message, el('ul', { className: 'carte indices-deduction' }, ...d.indices.map((t) => el('li', { textContent: t }))), table, c.suite);
  c.suite.prepend(verifier); // sur la même ligne que les autres boutons : tout tient sur un écran de téléphone
  dessiner();
  parler(d.indices.join(' '));
}
const JOUER_LOGIQUE = { sudoku: jouerSudoku, taquin: jouerTaquin, parking: jouerParking, tour: jouerTour, code: jouerCode, dessins: jouerDessins, deduction: jouerDeduction };

// La cabane nature : les fiches des animaux et des plantes, et le quiz
function ouvrirCabane() {
  const v = ouvrirLibre('La cabane nature');
  const carte = (emoji, nom, detail, action) => {
    const b = el('button', { className: 'carte-image' });
    b.innerHTML = `${imageFiche('vignettes', VIGNETTES[nom], emoji)}<span>${nom}<br><small>${detail}</small></span>`;
    b.addEventListener('click', action);
    return b;
  };
  v.replaceChildren(el('div', { className: 'galerie-cartes grandes' },
    carte('🐾', 'Les animaux', 'Où ils vivent, ce qu’ils mangent', () => afficherFiches('animaux')),
    carte('🌿', 'Les plantes', 'Celles qu’on mange, celles qu’on ne touche pas', () => afficherFiches('plantes')),
    carte('❓', 'Le quiz de la nature', 'Teste ce que tu sais', () => lancerJeu('naturaliste'))));
  parler('La cabane nature ! Choisis : les animaux, les plantes, ou le quiz.', { ton: 1.1 });
}
// L'image d'une carte de menu (images/vignettes), d'après son nom
const VIGNETTES = { 'Les animaux': 'nature-animaux', 'Les plantes': 'nature-plantes', 'Le quiz de la nature': 'nature-quiz', 'Mon potager': 'potager-jardin', 'Le quiz du potager': 'potager-quiz', 'La chasse aux syllabes': 'biblio-syllabes', 'La dictée magique': 'biblio-dictee' };
const enImage = (dossier, cle, emoji) => { const src = cle && image(`${dossier}/${cle}`); return src ? `<img class="pictogramme" src="${src}" alt="">` : emoji; }; // une petite image dans un texte, à la place d'un emoji
const imageFiche = (dossier, cle, emoji) => { const src = image(`${dossier}/${cle}`); return src ? `<img src="${src}" alt="">` : `<span class="emoji-theme" aria-hidden="true">${emoji}</span>`; };
// Les emojis qui restent dans les textes : à l'écran, leur image à la place. L'emoji reste dans la page, caché : le code qui relit un texte le retrouve.
const RE_EMOJI = /\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*️?|[\u{1F1E6}-\u{1F1FF}]{2}/gu;
const sansVariante = (e) => e.replace(/️/g, '');
const IMAGES_EMOJIS = new Map([ // les images qui existent déjà ; pour les autres emojis : images/emoji/<code>.webp
  ['⭐', 'interface/etoile'], ['🚑', 'urgences/144'], ['🚓', 'urgences/117'], ['🚒', 'urgences/118'], ['✅', 'emoji/2714'], ['♥', 'bd/auto-coeur'], ['🟫', 'potager/terre'],
  ['🍅', 'potager/tomate'], ['🎃', 'potager/courge'], ['🌻', 'potager/tournesol'], ['🪱', 'potager/ver'], ['🪐', 'espace/saturne'], ['🔎', 'confiance/fait-avis'], ['💛', 'confiance/emotions'], ['📜', 'confiance/droits'], ['🛡', 'confiance/corps'],
  ...fiches.ANIMAUX.map(([cle, , e]) => [e, `nature/${cle}`]),
  ...Object.entries(IMAGES_FORMES).map(([e, n]) => [e, `enigmes/forme-${n}`]),
  ...Object.entries(bd.NOMS_AUTOCOLLANTS).map(([e, n]) => [e, `bd/auto-${n}`]),
  ...Object.entries(cuisine.INGREDIENTS).map(([cle, [, e]]) => [e, `restaurant/${cle}`]),
  ...Object.entries(enigmes.OBJETS).map(([cle, [, e, ailleurs]]) => [e, ailleurs ?? `enigmes/${cle}`]),
].map(([e, chemin]) => [sansVariante(e), chemin]));
const imageEmoji = (e) => image(IMAGES_EMOJIS.get(sansVariante(e)) ?? `emoji/${[...sansVariante(e)].map((c) => c.codePointAt(0).toString(16)).join('-')}`);
function habillerEmojis(racine) {
  const marche = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT), textes = racine.nodeType === 3 ? [racine] : [];
  while (marche.nextNode()) textes.push(marche.currentNode);
  for (const t of textes) {
    if (!t.parentElement || t.parentElement.closest('svg, script, style, textarea, select, .emoji-cache')) continue; // (pas d'image possible dans un dessin ou une liste déroulante)
    const morceaux = [];
    let fin = 0;
    for (const m of t.data.matchAll(RE_EMOJI)) {
      const src = imageEmoji(m[0]);
      if (!src) continue;
      morceaux.push(t.data.slice(fin, m.index), el('img', { className: 'image-emoji', src, alt: '' }), el('span', { className: 'emoji-cache', textContent: m[0] }));
      fin = m.index + m[0].length;
    }
    if (fin) t.replaceWith(...morceaux, t.data.slice(fin));
  }
}
new MutationObserver((changements) => {
  for (const c of changements) for (const n of c.type === 'characterData' ? [c.target] : c.addedNodes) if (n.nodeType === 1 || n.nodeType === 3) habillerEmojis(n);
}).observe(document.body, { childList: true, subtree: true, characterData: true });
function afficherFiches(quoi, cle = null) {
  const v = ouvrirLibre('La cabane nature'), animaux = quoi === 'animaux', liste = animaux ? fiches.ANIMAUX : fiches.PLANTES;
  if (cle === null) {
    v.replaceChildren(...(animaux ? [] : [el('p', { className: 'carte presentation regle-d-or', textContent: `⚠️ ${fiches.REGLE_D_OR}` })]),
      el('div', { className: 'galerie-cartes' }, ...liste.map((f) => {
        const b = el('button', { className: 'carte-image' });
        b.innerHTML = `${imageFiche(animaux ? 'nature' : 'plantes', f[0], f[2])}<span>${f[1]}${animaux ? '' : `<br><small>${fiches.STATUTS[f[3]][1]}</small>`}</span>`;
        b.addEventListener('click', () => afficherFiches(quoi, f[0]));
        return b;
      })), gros('← La cabane', ouvrirCabane, 'gros secondaire'));
    return parler(animaux ? 'Les animaux. Touche un animal pour le découvrir.' : `Les plantes. ${fiches.REGLE_D_OR} Touche une plante pour la découvrir.`);
  }
  const f = liste.find((x) => x[0] === cle), texte = animaux ? fiches.ficheAnimal(f) : fiches.fichePlante(f);
  const lignes = animaux
    ? [['🏷️ Sa famille', `C’est ${fiches.FAMILLES[f[3]][0]}. ${fiches.FAMILLES[f[3]][1]}`], ['🏡 Où vit cet animal ?', `${fiches.MILIEUX[f[4]]}.`], ['🍽️ Que mange cet animal ?', f[6]], ['💡 Le savais-tu ?', f[7]]]
    : [[`${fiches.STATUTS[f[3]][1]} Peut-on la manger ?`, `${fiches.STATUTS[f[3]][0]}.`], ...(['comestible', 'cuite'].includes(f[3]) ? [['💚 À quoi sert-elle ?', f[4]], ['🥣 Comment la prépare-t-on ?', f[5]]] : [['🔎 À savoir', f[4]], ['✋ Que fait-on ?', f[5]]]), ...(f[6] ? [['⚠️ Attention', f[6]]] : []), ['👨‍👩‍👧 La règle d’or', fiches.REGLE_D_OR]];
  const tete = el('div', { className: 'tete-fiche' });
  tete.innerHTML = imageFiche(animaux ? 'nature' : 'plantes', f[0], f[2]);
  v.replaceChildren(el('div', { className: `carte fiche-nature${animaux ? '' : ` plante-${f[3]}`}` }, tete, el('h2', { textContent: f[1] }),
    el('dl', {}, ...lignes.flatMap(([t, d]) => [el('dt', { textContent: t }), el('dd', { textContent: d })]))),
    el('div', { className: 'actions-atelier' }, gros('🔊 Écouter', () => parler(texte), 'gros secondaire'), gros(animaux ? '← Les animaux' : '← Les plantes', () => afficherFiches(quoi))));
  parler(texte);
}

// Mon potager : semer ce qui est de saison, arroser une fois par jour, récolter après 3 arrosages
function ouvrirPotager() {
  const v = ouvrirLibre('Le potager');
  const carte = (emoji, nom, detail, action) => {
    const b = el('button', { className: 'carte-image' });
    b.innerHTML = `${imageFiche('vignettes', VIGNETTES[nom], emoji)}<span>${nom}<br><small>${detail}</small></span>`;
    b.addEventListener('click', action);
    return b;
  };
  v.replaceChildren(el('div', { className: 'galerie-cartes grandes' },
    carte('🌱', 'Mon potager', 'Sème, arrose et récolte', () => afficherJardinage()), carte('❓', 'Le quiz du potager', 'Fruits, légumes et saisons', () => lancerJeu('potager'))));
  parler('Le potager ! Choisis : ton potager à toi, ou le quiz.', { ton: 1.1 });
}
function afficherJardinage(message = null, graines = null) {
  const v = ouvrirLibre('Le potager'), jour = missions.aujourdhui(), cs = jardinage.carres(joueuse);
  const regle = `Sème ce qui est de saison, puis arrose une fois par jour. Après ${jardinage.ARROSAGES} jours d’arrosage, tu récoltes et tu gagnes ${jardinage.ETOILES_RECOLTE} étoiles.`;
  const info = el('p', { className: 'carte presentation', role: 'status', textContent: message ?? regle });
  const dire = (t) => { afficherJardinage(t); parler(t); };
  const plots = el('div', { className: 'galerie-cartes' }, ...cs.map((c, i) => {
    const b = el('button', { className: `carte-image${jardinage.pret(c) ? ' choisi' : ''}` });
    const l = c && jardinage.legume(c.legume);
    b.innerHTML = c ? `${imageFiche('potager', jardinage.nomImage(c), jardinage.image(c))}<span>${l.nom}<br><small>${jardinage.pret(c) ? 'À récolter !' : c.arrose === jour ? 'Arrosé aujourd’hui' : `À arroser (${c.arrosages} / ${jardinage.ARROSAGES})`}</small></span>`
      : `${imageFiche('potager', 'terre', '🟫')}<span>Carré vide<br><small>Touche pour semer</small></span>`;
    b.addEventListener('click', () => {
      if (!c) return afficherJardinage(`Que veux-tu semer dans le carré ${i + 1} ?`, i);
      if (jardinage.pret(c)) {
        const gain = jardinage.recolter(joueuse, i);
        compterPartie('jardinage');
        enregistrer();
        bip(true);
        return dire(`Bravo, tu as récolté : ${l.nom.toLowerCase()} ! Tu gagnes ${gain} étoiles.`);
      }
      if (!jardinage.arroser(joueuse, i, jour)) return dire('Tu as déjà arrosé ce carré aujourd’hui. Reviens demain !');
      enregistrer();
      dire(jardinage.pret(cs[i]) ? `${l.nom} : c’est prêt ! Touche encore pour récolter.` : 'Merci pour l’eau ! Ça pousse. Reviens demain pour arroser encore.');
    });
    return b;
  }));
  const choix = graines === null ? [] : [el('h2', { textContent: 'Les graines' }), el('div', { className: 'phrases' }, ...jardinage.LEGUMES.map((l) => {
    const ok = jardinage.deSaison(jour).includes(l);
    const b = gros(`${l.nom}${ok ? '' : ' (pas la saison)'}`, () => { jardinage.semer(joueuse, graines, l.cle, jour); enregistrer(); dire(`${l.nom} : c’est semé ! ${l.note ?? 'Maintenant, arrose.'}`); }, 'petit');
    b.insertAdjacentHTML('afterbegin', `${enImage('potager', l.cle, l.image)} `);
    b.disabled = !ok;
    return b;
  }))];
  v.replaceChildren(info, plots, ...choix, gros('← Le potager', ouvrirPotager, 'gros secondaire'));
  if (message === null) parler(`Mon potager. ${regle}`, { ton: 1.1 });
}

// Le défi à deux (salle de jeux) : chacun répond à 5 questions de son âge, chacun son tour
const JEUX_DEFI = {
  calcul: ['➕ Le calcul', (age) => calcul.question({ operation: 'addition', age })],
  naturaliste: ['🌿 La nature', (age, vus) => nature.naturaliste.question({ age }, Math.random, 0, vus)],
  potager: ['🥕 Le potager', (age, vus) => nature.potager.question({ age }, Math.random, 0, vus)],
  suisse: ['🏔️ La Suisse', (age, vus) => suisse.question({ age }, Math.random, 0, vus)],
};
const QUESTIONS_DEFI = 5;
function ouvrirDefi(adversaire = null) {
  const v = ouvrirLibre('Le défi à deux');
  const autres = etat.profils.filter((p) => p.id !== joueuse.id);
  if (!autres.length) {
    v.replaceChildren(el('p', { className: 'carte presentation', textContent: 'Pour un défi, il faut deux enfants. Un parent peut ajouter un enfant dans l’espace parents.' }));
    return parler('Pour un défi, il faut deux enfants.');
  }
  adversaire ??= autres[0];
  v.replaceChildren(
    el('p', { className: 'carte presentation', textContent: `Chacun répond à ${QUESTIONS_DEFI} questions de son âge, chacun son tour. Le gagnant reçoit 3 étoiles, l’autre 1. À égalité : 2 étoiles chacun.` }),
    el('h2', { textContent: 'Contre qui ?' }),
    el('div', { className: 'phrases' }, ...autres.map((p) => gros(p.prenom, () => ouvrirDefi(p), `petit${p === adversaire ? ' choisi' : ''}`))),
    el('h2', { textContent: 'Quel défi ?' }),
    el('div', { className: 'actions-atelier' }, ...Object.entries(JEUX_DEFI).map(([cle, [nom]]) => gros(nom, () => jouerDefi(adversaire, cle)))));
  parler(`Le défi à deux ! ${joueuse.prenom} contre ${adversaire.prenom}. Choisis un défi.`, { ton: 1.1 });
}
function jouerDefi(adversaire, cle) {
  const v = $('#libre-vue'), joueurs = [joueuse, adversaire], scores = [0, 0], vus = [new Set(), new Set()];
  let tour = 0;
  const suivant = () => {
    if (!libreOuvert('Le défi à deux')) return;
    if (tour >= QUESTIONS_DEFI * 2) return finir();
    const k = tour % 2, j = joueurs[k], q = JEUX_DEFI[cle][1](j.age, vus[k]);
    vus[k].add(q.texte);
    const titre = q.titre ?? `${q.texte} = ?`;
    const reponses = el('div', { className: 'reponses-defi' }, ...q.choix.map((c) => {
      const b = el('button', { className: 'gros secondaire', textContent: String(c) });
      b.addEventListener('click', () => {
        const juste = String(c) === String(q.reponse);
        if (juste) scores[k]++;
        bip(juste);
        for (const x of reponses.children) { x.disabled = true; if (x.textContent === String(q.reponse)) x.classList.add('choisi'); }
        tour++;
        setTimeout(suivant, 1300);
      });
      return b;
    }));
    v.replaceChildren(el('p', { className: 'carte score-grue', role: 'status', textContent: `${joueurs[0].prenom} ${scores[0]} – ${scores[1]} ${joueurs[1].prenom}` }),
      el('h2', { textContent: `À toi, ${j.prenom} ! (${Math.floor(tour / 2) + 1} / ${QUESTIONS_DEFI})` }),
      el('p', { className: 'carte question-defi', textContent: `${q.image ? `${q.image} ` : ''}${titre}` }), reponses);
    parler(`${j.prenom}. ${q.titre ?? ditCalcul(q.texte)}`);
  };
  const finir = () => {
    const [a, b] = scores, gains = a === b ? [2, 2] : a > b ? [3, 1] : [1, 3];
    joueurs.forEach((j, i) => { j.etoiles += gains[i]; compterPartie('defi', j); });
    enregistrer();
    etoilesJoueuse();
    const texte = a === b ? `Égalité, ${a} partout ! 2 étoiles chacun.` : `${joueurs[a > b ? 0 : 1].prenom} gagne, ${Math.max(a, b)} à ${Math.min(a, b)} ! 3 étoiles, et 1 étoile pour ${joueurs[a > b ? 1 : 0].prenom}.`;
    v.replaceChildren(el('p', { className: 'carte score-grue', role: 'status', textContent: `🏆 ${texte}` }), gros('🤝 Un autre défi', () => ouvrirDefi(adversaire)));
    bip(true);
    parler(`Bravo à vous deux ! ${texte}`, { ton: 1.15 });
  };
  taire();
  suivant();
}

// L'atelier d'écriture : suivre chaque trait de la lettre avec le doigt, à partir du point vert
let lettreEcriture = 0;
function ouvrirEcriture() {
  lettreEcriture = 0;
  tracerLettre();
  parler('L’atelier d’écriture ! Pose ton doigt sur le point vert, et suis le trait.', { ton: 1.1 });
}
function tracerLettre() {
  const v = ouvrirLibre('L’atelier d’écriture', 'syllabes');
  const lettres = ecriture.alphabet(joueuse.age), lettre = lettres[lettreEcriture % lettres.length], traits = ecriture.LETTRES[lettre].map(ecriture.reperes);
  let t = 0, fait = 0, appuie = false;
  const message = el('p', { className: 'carte score-grue', role: 'status', textContent: `Écris la lettre ${lettre} : pars du point vert.` });
  const ardoise = el('div', { className: 'ardoise', role: 'img', ariaLabel: `La lettre ${lettre} à tracer` });
  const ligne = (p) => p.map((c) => c.map((n) => n.toFixed(1)).join(',')).join(' ');
  const dessiner = () => {
    const ici = t < traits.length ? traits[t][Math.min(fait, traits[t].length - 1)] : null;
    ardoise.innerHTML = `<svg viewBox="-15 -15 130 135" aria-hidden="true">${traits.map((p, i) => `<polyline points="${ligne(p)}" class="guide${i < t ? ' fini' : ''}"/>`).join('')}
      ${ici ? `${fait > 1 ? `<polyline points="${ligne(traits[t].slice(0, fait))}" class="trace"/>` : ''}<circle cx="${ici[0]}" cy="${ici[1]}" r="7" class="depart"/>` : ''}</svg>`;
  };
  const toucher = (ev) => {
    if (!appuie || t >= traits.length) return;
    const r = ardoise.firstElementChild.getBoundingClientRect();
    const n = ecriture.suivre(traits[t], fait, ((ev.clientX - r.left) / r.width) * 130 - 15, ((ev.clientY - r.top) / r.height) * 135 - 15);
    if (n === fait) return;
    fait = n;
    if (fait >= traits[t].length) { t++; fait = 0; appuie = false; }
    dessiner();
    if (t < traits.length) return;
    const gain = ecriture.etoilesParLettre(joueuse.age);
    compterPartie('ecriture');
    gagnerEtoiles(gain);
    bip(true);
    message.textContent = `Bravo, tu as écrit la lettre ${lettre} ! +${formatEtoiles(gain)} ⭐`;
    parler(`Bravo ! Tu as écrit la lettre ${lettre}.`, { ton: 1.15 });
  };
  ardoise.addEventListener('pointerdown', (ev) => { appuie = true; ardoise.setPointerCapture(ev.pointerId); toucher(ev); });
  ardoise.addEventListener('pointermove', toucher);
  for (const e of ['pointerup', 'pointercancel']) ardoise.addEventListener(e, () => { appuie = false; });
  v.replaceChildren(message, ardoise, el('div', { className: 'actions-atelier' },
    gros('↩️ Recommencer', tracerLettre, 'gros secondaire'), gros('➡️ Une autre lettre', () => { lettreEcriture++; tracerLettre(); })));
  dessiner();
}

// La bibliothèque : trois jeux de mots
function ouvrirBibliotheque() {
  etoilesJoueuse();
  const carte = (emoji, nom, detail, nomJeu) => {
    const b = el('button', { className: 'carte-image' });
    b.innerHTML = `${imageFiche('vignettes', VIGNETTES[nom], emoji)}<span>${nom}<br><small>${detail}</small></span>`;
    b.addEventListener('click', () => lancerJeu(nomJeu));
    return b;
  };
  const ecrire = el('button', { className: 'carte-image' });
  ecrire.innerHTML = `${imageFiche('vignettes', 'biblio-ecriture', '🖍️')}<span>L’atelier d’écriture<br><small>Trace les lettres avec ton doigt</small></span>`;
  ecrire.addEventListener('click', ouvrirEcriture);
  $('#bibliotheque-vue').replaceChildren(el('div', { className: 'galerie-cartes grandes' },
    carte('🧩', 'La chasse aux syllabes', 'Forme le mot de l’image', 'syllabes'),
    carte('✏️', 'La dictée magique', 'Écris le mot que tu entends', 'dictee'), ecrire));
  montrer('bibliotheque');
  parler('Bienvenue à la bibliothèque ! Choisis : la chasse aux syllabes, la dictée magique, ou l’atelier d’écriture.', { ton: 1.1 });
}

// L'école des langues : on choisit la langue, puis le thème ; les mots ratés reviennent (« à revoir »)
let langueEcole = 'allemand', themeEcole = 'couleurs';
function ouvrirLangues() {
  etoilesJoueuse();
  const L = langues.LANGUES[langueEcole];
  $('#langues-vue').replaceChildren(
    el('div', { className: 'phrases' }, ...Object.entries(langues.LANGUES).map(([cle, l]) =>
      gros(`${l.drapeau} ${l.nom}`, () => { langueEcole = cle; ouvrirLangues(); }, `gros${cle === langueEcole ? ' choisi' : ' secondaire'}`))),
    el('h2', { textContent: `Choisis un thème pour apprendre ${L.nom.replace(/^L’/, 'l’')} :` }),
    el('div', { className: 'galerie-cartes' }, ...langues.THEMES.map((t) => {
      const n = langues.aRevoir(joueuse, langueEcole, t.cle).length, src = image(`langues/${t.cle}`);
      const b = el('button', { className: 'carte-image' });
      b.innerHTML = `${src ? `<img src="${src}" alt="">` : `<span class="emoji-theme" aria-hidden="true">${t.image}</span>`}<span>${t.nom}${n ? `<br>🔁 ${n} à revoir` : ''}</span>`;
      b.addEventListener('click', () => { themeEcole = t.cle; lancerJeu('langues'); });
      return b;
    })));
  montrer('langues');
  parler(`L'école des langues ! Tu apprends ${L.nom.replace(/^L’/, 'l’')}. Choisis un thème : ${langues.THEMES.map((t) => t.nom).join(', ')}.`, { ton: 1.1 });
}

// La maison de la confiance : un thème à la fois. Aucune pénalité, jamais de « faux » ; les étoiles récompensent une étape finie, la première fois.
function ouvrirConfiance() {
  etoilesJoueuse();
  const accueil = 'Ici, on apprend à se sentir bien et en sécurité. Il n’y a pas de mauvaise réponse : on apprend ensemble.';
  const ouvrir = { 'fait-avis': ouvrirFaitAvis, emotions: ouvrirEmotionsConfiance, droits: ouvrirDroits, inconnus: ouvrirInconnus, corps: ouvrirCorps };
  $('#confiance-vue').replaceChildren(el('p', { className: 'carte presentation', textContent: accueil }),
    ...confiance.THEMES.map((t) => {
      const b = gros(`${t.nom}${t.ouvert ? '' : ' (bientôt)'}`, ouvrir[t.cle], t.ouvert ? 'gros' : 'gros secondaire');
      b.insertAdjacentHTML('afterbegin', `${enImage('confiance', t.cle, t.image)} `);
      b.disabled = !t.ouvert;
      return b;
    }));
  montrer('confiance');
  parler(`La maison de la confiance. ${accueil}`);
}
// Le menu d'un thème : son explication, ses étapes (avec une coche quand elles sont finies), son message à retenir
function menuTheme(theme, titre, intro, etapes, fin) {
  const h = el('h2', { textContent: titre.replace(/^\S+ /, '') }); // le titre arrive avec son emoji devant : on met l'image à la place
  h.insertAdjacentHTML('afterbegin', `${enImage('confiance', theme, titre.split(' ')[0])} `);
  $('#confiance-vue').replaceChildren(h, el('p', { className: 'carte presentation', textContent: intro }),
    ...etapes.map(([cle, nom, jouer], i) => gros(`${i + 1}. ${nom}${joueuse.confiance?.[`${theme}:${cle}`] ? ' ✓' : ''}`, jouer)),
    el('p', { className: 'carte presentation', textContent: acc(fin) }), gros('← Les autres thèmes', ouvrirConfiance, 'gros secondaire'));
  parler(intro);
}
// La fin d'une étape : ses étoiles la première fois, puis retour au thème
function finEtapeConfiance(theme, etape, texte, retour) {
  joueuse.confiance ??= {};
  const premiere = !joueuse.confiance[`${theme}:${etape}`];
  joueuse.confiance[`${theme}:${etape}`] = true;
  if (premiere) joueuse.etoiles += ETOILES_CONFIANCE;
  enregistrer();
  etoilesJoueuse();
  const dit = `${texte}${premiere ? ` Tu gagnes ${ETOILES_CONFIANCE} étoiles pour être {allé|allée} au bout.` : ''}`;
  $('#confiance-vue').replaceChildren(el('p', { className: 'carte presentation', role: 'status', textContent: acc(dit) }), gros('Continuer', retour));
  fanfare();
  parler(dit, { ton: 1.1 });
}
// Une suite de questions à choix : après chaque réponse, une explication (jamais « faux »), puis « Suivant ».
// q : { texte, choix: [[valeur, libellé]], aide (dessin), avant (dit avant la question) }
function jouerChoix({ questions, mot, retour, question = '', fin }) {
  let i = 0;
  const poser = () => {
    if (i === questions.length) return fin();
    const q = questions[i];
    const explication = el('p', { className: 'carte presentation', role: 'status' });
    const boutons = el('div', { className: q.choix.length > 2 ? 'choix-confiance' : 'actions' }, ...q.choix.map(([valeur, libelle]) => gros(acc(libelle), () => {
      const t = retour(q, valeur);
      explication.textContent = acc(t);
      boutons.replaceChildren(gros('Suivant ➜', () => { i++; poser(); }));
      parler(t);
    }, q.choix.length > 2 ? 'gros secondaire' : 'gros')));
    const aide = el('div', { className: 'aide-confiance', ariaHidden: 'true' });
    aide.innerHTML = q.aide ?? ''; // un dessin fabriqué par l'app, jamais du texte saisi
    $('#confiance-vue').replaceChildren(el('p', { className: 'etape-confiance', textContent: `${mot} ${i + 1} sur ${questions.length}` }),
      ...(q.avant ? [el('p', { className: 'carte presentation', textContent: q.avant })] : []), ...(q.aide ? [aide] : []), el('p', { className: 'carte phrase-confiance', textContent: acc(q.texte) }), boutons, explication);
    parler(`${q.avant ?? ''}${q.texte} ${question}`);
  };
  poser();
}
// Une suite de situations : plusieurs réactions sont bonnes et on les montre toutes ; une seule est à revoir, avec douceur.
function jouerReactions({ situations, bonnes, aRevoir, douceur, apres = () => '', fin }) {
  let i = 0;
  const poser = () => {
    if (i === situations.length) return fin();
    const s = situations[i];
    const explication = el('p', { className: 'carte presentation', role: 'status' });
    const choix = el('div', { className: 'choix-confiance' }, ...melanger([...bonnes, aRevoir]).map((r) => gros(r, () => {
      const t = `${r === aRevoir ? douceur : 'Oui, c’est une bonne idée ! Les trois autres marchent aussi.'}${apres(s)}`;
      explication.textContent = t;
      for (const x of choix.children) { x.disabled = true; x.classList.toggle('bonne-idee', x.textContent !== aRevoir); } // on montre toutes les bonnes idées
      choix.after(gros('Suivant ➜', () => { i++; poser(); }));
      parler(t);
    }, 'gros secondaire')));
    $('#confiance-vue').replaceChildren(el('p', { className: 'etape-confiance', textContent: `Situation ${i + 1} sur ${situations.length}` }),
      el('p', { className: 'carte phrase-confiance', textContent: acc(s.texte) }), el('h2', { textContent: 'Que peux-tu faire ?' }), choix, explication);
    parler(`${s.texte} Que peux-tu faire ?`);
  };
  poser();
}

// Thème 1 : « Fait ou avis ? »
function ouvrirFaitAvis() {
  const finir = (etape, texte) => finEtapeConfiance('fait-avis', etape, texte, ouvrirFaitAvis);
  menuTheme('fait-avis', '🔎 Fait ou avis ?', confiance.INTRO, [
    ['tri', 'Je trie : fait ou avis ?', () => jouerChoix({
      questions: confiance.tri(joueuse.age).map((q, i, l) => ({ ...q, choix: [['fait', 'C’est un fait'], ['avis', 'C’est un avis']], avant: q.blessante && !l[i - 1].blessante ? `${confiance.AVANT_LES_BLESSANTES} ` : '' })),
      mot: 'Phrase', retour: confiance.retour, question: 'Est-ce un fait, ou un avis ?', fin: () => finir('tri', 'Bravo ! Tu sais reconnaître un fait et un avis.') })],
    ['recre', 'Dans la cour de récré', () => jouerReactions({
      situations: confiance.recre(), bonnes: confiance.REACTIONS, aRevoir: confiance.A_REVOIR, douceur: confiance.DOUCEUR,
      apres: (s) => (s.seRepete ? ` ${confiance.quandCaSeRepete(joueuse.age)}` : ''),
      fin: () => finir('recre', `Tu connais quatre bonnes façons de réagir. ${confiance.REACTIONS.join(' ')}`) })],
    ['miroir', 'Mon miroir', () => miroirFaitAvis(finir)],
  ], confiance.FIN);
}
function miroirFaitAvis(finir) {
  const choisies = new Set(); // rien n'est enregistré
  const miroir = el('div', { className: 'miroir-confiance' });
  miroir.innerHTML = dessinerAvatar(joueuse.avatar, 'tete');
  const fini = gros('J’ai fini', () => finir('miroir', `${confiance.APRES_LE_MIROIR} ${confiance.FIN}`));
  fini.disabled = true;
  $('#confiance-vue').replaceChildren(el('h2', { textContent: 'Qu’est-ce qui est vrai pour toi ?' }), miroir,
    el('div', { className: 'choix-confiance' }, ...confiance.MIROIR.map((phrase) => {
      const b = gros(acc(phrase), () => {
        if (!choisies.delete(phrase)) { choisies.add(phrase); parler(phrase); }
        b.setAttribute('aria-pressed', choisies.has(phrase));
        b.classList.toggle('bonne-idee', choisies.has(phrase));
        fini.disabled = !choisies.size;
      }, 'gros secondaire');
      b.setAttribute('aria-pressed', 'false');
      return b;
    })), fini);
  parler('Regarde-toi dans le miroir. Touche tout ce qui est vrai pour toi.');
}

// Thème 2 : « Mes émotions me parlent ». Une émotion est un message qui protège.
function ouvrirEmotionsConfiance() {
  const finir = (etape, texte) => finEtapeConfiance('emotions', etape, texte, ouvrirEmotionsConfiance);
  menuTheme('emotions', '💛 Mes émotions me parlent', confiance.INTRO_EMOTIONS, [
    ['messages', 'Le message de chaque émotion', () => jouerChoix({
      questions: confiance.messages(joueuse.age).map((q) => ({ ...q, choix: q.choix.map((c) => [c, c]), aide: emotions.visage(q.emotion, PEAUX[joueuse.avatar.peau]) })),
      mot: 'Émotion', retour: confiance.retourMessage, fin: () => finir('messages', 'Bravo ! Tu sais écouter le message de tes émotions.') })],
    ['oui-non', 'Le oui et le non dans mon corps', () => jouerChoix({
      questions: confiance.ouiNon().map((q, i) => ({ ...q, choix: [['oui', 'Ça fait oui'], ['non', 'Ça fait non']], avant: i ? '' : `${confiance.OUI_NON_INTRO} ` })),
      mot: 'Situation', retour: confiance.retourOuiNon, question: 'Ça fait oui, ou ça fait non ?', fin: () => finir('oui-non', 'Tu sais écouter le oui et le non dans ton corps.') })],
    ['gestes', 'Quand ça fait non', () => jouerReactions({
      situations: confiance.quandNon(), bonnes: confiance.GESTES, aRevoir: confiance.ATTENDRE, douceur: confiance.DOUCEUR_ATTENDRE,
      fin: () => finir('gestes', `Tu connais les quatre gestes. ${confiance.GESTES.join(' ')} ${confiance.FIN_EMOTIONS}`) })],
  ], confiance.FIN_EMOTIONS);
}

// Thème 3 : « Mes droits »
function ouvrirDroits() {
  const finir = (etape, texte) => finEtapeConfiance('droits', etape, texte, ouvrirDroits);
  menuTheme('droits', '📜 Mes droits', confiance.INTRO_DROITS, [
    ['tri', 'Un droit, ou une envie ?', () => jouerChoix({
      questions: confiance.droitOuEnvie().map((q, i) => ({ ...q, choix: [['droit', 'C’est un droit'], ['envie', 'C’est une envie']], avant: i ? '' : `${confiance.DROIT_ENVIE_INTRO} ` })),
      mot: 'Phrase', retour: confiance.retourDroitEnvie, question: 'Est-ce un droit, ou une envie ?', fin: () => finir('tri', 'Bravo ! Tu sais reconnaître un droit.') })],
    ['respectes', 'Quel droit est respecté ?', () => jouerChoix({
      questions: confiance.respectes(joueuse.age).map((q) => ({ ...q, choix: q.choix.map((k) => [k, confiance.DROITS[k][0]]) })),
      mot: 'Situation', retour: confiance.retourRespecte, question: 'Quel droit est respecté ?', fin: () => finir('respectes', 'Bravo ! Tu connais tes droits.') })],
    ['idees', 'Et si un droit n’est pas respecté ?', () => jouerReactions({
      situations: confiance.pasRespectes(joueuse.age), bonnes: confiance.IDEES_DROITS, aRevoir: confiance.NORMAL, douceur: confiance.DOUCEUR_NORMAL,
      fin: () => finir('idees', `${confiance.DROITS_DES_AUTRES} ${confiance.FIN_DROITS}`) })],
  ], `${confiance.DROITS_DES_AUTRES} ${confiance.FIN_DROITS}`);
}

function ouvrirInconnus() {
  const finir = (etape, texte) => finEtapeConfiance('inconnus', etape, texte, ouvrirInconnus);
  menuTheme('inconnus', '🚶 Les inconnus', confiance.INTRO_INCONNUS, [
    ['accord', 'C’est d’accord, ou je demande d’abord ?', () => jouerChoix({
      questions: confiance.accordOuDemande(joueuse.age).map((q) => ({ ...q, choix: [['accord', 'C’est d’accord'], ['demande', 'Je demande d’abord']] })),
      mot: 'Situation', retour: confiance.retourAccord, question: 'C’est d’accord, ou tu demandes d’abord à tes parents ?', fin: () => finir('accord', 'Bravo ! Tu sais quand demander à tes parents.') })],
    ['souci', 'Pas de souci, ou je dis non ?', () => jouerChoix({
      questions: confiance.souciOuNon(joueuse.age).map((q, i) => ({ ...q, choix: [['souci', 'Pas de souci'], ['non', 'Je dis non et je m’éloigne']], avant: i ? '' : `${confiance.SOUCI_INTRO} ` })),
      mot: 'Situation', retour: confiance.retourSouci, question: 'Pas de souci, ou tu dis non ?', fin: () => finir('souci', 'Bravo ! Tu peux être {poli|polie} et dire non.') })],
    ['idees', 'Qu’est-ce que je peux faire ?', () => jouerReactions({
      situations: confiance.situationsInconnus(joueuse.age), bonnes: confiance.IDEES_INCONNUS, aRevoir: confiance.RESTER, douceur: confiance.DOUCEUR_RESTER,
      fin: () => finir('idees', `${confiance.CRIER} ${confiance.FIN_INCONNUS}`) })],
  ], confiance.FIN_INCONNUS);
}

// « Mon corps m'appartient » : six principes à écouter, sans question ni mise en situation (choix du parent)
function ouvrirCorps() {
  menuTheme('corps', '🛡️ Mon corps m’appartient', confiance.INTRO_CORPS, [
    ['principes', 'J’écoute les principes', () => jouerChoix({
      questions: confiance.principes().map((q) => ({ ...q, choix: [['ok', '🔊 Explique-moi']] })),
      mot: 'Principe', retour: (q) => q.explication,
      fin: () => finEtapeConfiance('corps', 'principes', `${confiance.ADULTES_DE_CONFIANCE} ${confiance.FIN_CORPS}`, ouvrirCorps) })],
  ], `${confiance.ADULTES_DE_CONFIANCE} ${confiance.FIN_CORPS}`);
}

// Le chantier : « La grue folle ». On empile des blocs ; une tour assez haute construit les pièces achetées.
function ouvrirChantier() {
  etoilesJoueuse();
  const c = joueuse.chantier ??= chantier.chantierVide();
  const objectifs = c.aConstruire.map((k) => `${chantier.NOMS[k]} (${chantier.HAUTEURS[k]} étages)`);
  const regle = 'La grue balance un bloc. Touche l’écran au bon moment pour le lâcher, et monte la tour la plus haute possible !';
  const suite = `${c.record ? ` Ton record : ${c.record} étage${c.record > 1 ? 's' : ''}.` : ''}${objectifs.length ? ` À construire : ${objectifs.join(', ')}.` : ''}`;
  $('#chantier-vue').replaceChildren(el('p', { className: 'carte presentation', textContent: regle + suite }), gros('🏗️ Jouer', jouerGrue));
  montrer('chantier');
  parler(`La grue folle. ${regle}${suite}`, { ton: 1.1 });
}

function jouerGrue() {
  taire();
  const H = 44, L = chantier.LARGEUR, SOL = 470, HAUT = 70; // hauteur d'un bloc, sol et bloc suspendu (dans un dessin de 400 × 520)
  const COULEURS = ['#f2a654', '#6ac0d0', '#f080b0', '#8fd36a', '#b08ae8', '#f2c230'];
  const tour = []; // le milieu de chaque bloc posé, par rapport au milieu de l'écran
  let phase = 0, x = 0, chute = null, rate = null, avant = performance.now();
  const score = el('p', { className: 'carte score-grue', role: 'status', textContent: 'Touche pour lâcher le bloc !' });
  const scene = el('button', { className: 'scene-grue', ariaLabel: 'Lâcher le bloc' });
  $('#chantier-vue').replaceChildren(score, scene);
  const bloc = (cx, y, i, tourne = 0) => `<g transform="translate(${200 + cx} ${y}) rotate(${tourne})"><rect x="${-L / 2}" width="${L}" height="${H}" rx="5" fill="${COULEURS[i % COULEURS.length]}" stroke="#2b2b3a" stroke-opacity=".25" stroke-width="3"/>
    ${[-26, 0, 26].map((f) => `<rect x="${f - 8}" y="12" width="16" height="20" rx="3" fill="#fff" opacity=".85"/>`).join('')}</g>`;
  const dessiner = () => {
    const cam = Math.max(0, tour.length - 5) * H; // la tour descend quand elle devient haute
    scene.innerHTML = `<svg viewBox="0 0 400 520" aria-hidden="true"><rect y="${SOL + cam}" width="400" height="520" fill="#c9a36a"/>
      ${tour.map((cx, i) => [cx, SOL - (i + 1) * H + cam, i]).filter(([, y]) => y < 520).map(([cx, y, i]) => bloc(cx, y, i)).join('')}
      <rect x="26" y="20" width="12" height="520" fill="#f2c230"/><rect x="20" y="20" width="368" height="12" rx="4" fill="#f2c230"/>
      ${rate === null ? `<rect x="${190 + x}" y="26" width="20" height="12" rx="3" fill="#555"/><line x1="${200 + x}" y1="38" x2="${200 + x}" y2="${HAUT + (chute ?? 0)}" stroke="#555" stroke-width="3"/>${bloc(x, HAUT + (chute ?? 0), tour.length)}`
    : bloc(rate, SOL - (tour.length + 1) * H + cam + 14, tour.length, rate > tour.at(-1) ? 24 : -24)}</svg>`;
  };
  const finir = () => {
    const n = tour.length, r = chantier.finir(joueuse, n);
    if (n) compterPartie('chantier');
    enregistrer();
    etoilesJoueuse();
    const pieces = r.construites.map((k) => chantier.NOMS[k]).join(', ');
    const texte = `Ta tour fait ${n} étage${n > 1 ? 's' : ''} ! Tu gagnes ${formatEtoiles(r.gain)} étoile${r.gain > 1 ? 's' : ''}.${r.record ? ' Nouveau record !' : ''}${pieces ? ` Tu as construit : ${pieces} ! Va voir dans ta maison.` : ''}`;
    score.textContent = texte;
    $('#chantier-vue').append(gros('🏗️ Rejouer', jouerGrue), gros('Retour au chantier', ouvrirChantier, 'gros secondaire'));
    if (pieces || r.record) fanfare(); else bip(false);
    parler(texte, { ton: 1.1 });
  };
  const image = (t) => {
    if (!scene.isConnected || $('[data-ecran="chantier"]').hidden) return; // on a quitté le chantier
    const dt = Math.min(0.05, (t - avant) / 1000);
    avant = t;
    if (chute === null) {
      phase += dt * chantier.vitesse(tour.length, joueuse.age);
      x = Math.sin(phase) * chantier.AMPLITUDE;
    } else {
      chute += dt * 900;
      const cam = Math.max(0, tour.length - 5) * H;
      if (chute >= SOL - (tour.length + 1) * H + cam - HAUT) { // le bloc arrive sur la tour (le premier tient toujours : il se pose par terre)
        if (!tour.length || chantier.tient(tour.at(-1), x, joueuse.age)) {
          tour.push(x);
          chute = null;
          notes([[262 * 2 ** (Math.min(tour.length, 24) / 12), 0, 0.25]]); // chaque étage sonne un peu plus aigu
          score.textContent = `${tour.length} étage${tour.length > 1 ? 's' : ''}`;
        } else {
          rate = x;
          dessiner();
          return finir();
        }
      }
    }
    dessiner();
    requestAnimationFrame(image);
  };
  const lacher = (ev) => { ev.preventDefault(); if (chute === null && rate === null) chute = 0; };
  scene.addEventListener('pointerdown', lacher); // au toucher, pas au relâcher : c'est un jeu de rythme
  scene.addEventListener('keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') lacher(ev); });
  requestAnimationFrame(image);
  scene.focus();
}

// La salle de musique : une grille (une ligne par note, une colonne par temps). La mélodie est gardée dans le profil.
function ouvrirMusique() {
  etoilesJoueuse();
  const v = $('#musique-vue');
  const melodie = () => joueuse.melodie ?? musique.melodieVide();
  const dessiner = () => v.replaceChildren(
    el('div', { className: 'grille-musique carte', role: 'group', ariaLabel: 'La grille des notes' },
      ...musique.NOTES.map((n, note) => [el('span', { className: 'nom-note', textContent: n.nom }), ...melodie().map((choisie, temps) => {
        const b = el('button', { className: 'case-note', ariaLabel: `${n.nom}, temps ${temps + 1}`, ariaPressed: String(choisie === note) });
        b.dataset.temps = temps;
        if (choisie === note) b.style.background = n.couleur;
        b.addEventListener('click', () => {
          joueuse.melodie = musique.basculer(melodie(), temps, note);
          enregistrer();
          taire();
          if (joueuse.melodie[temps] === note) notes([[n.frequence, 0, 0.5]]);
          dessiner();
        });
        return b;
      })]).reverse().flat()), // la note la plus aiguë en haut
    gros('▶️ Écouter ma mélodie', () => {
      taire();
      notes(musique.aJouer(melodie()));
      for (let t = 0; t <= musique.TEMPS; t++) { // la colonne jouée s'allume
        setTimeout(() => { for (const c of v.querySelectorAll('.case-note')) c.classList.toggle('joue', Number(c.dataset.temps) === t); }, t * musique.DUREE * 1000);
      }
    }),
    gros('🗑️ Tout effacer', () => { joueuse.melodie = musique.melodieVide(); enregistrer(); dessiner(); }, 'gros secondaire'));
  dessiner();
  montrer('musique');
  parler('La salle de musique. Touche les cases pour poser des notes, puis écoute ta mélodie !', { ton: 1.1 });
}

// Les numéros d'urgence : découvrir, puis « Qui appeler ? »
function ouvrirUrgences() {
  etoilesJoueuse();
  const v = $('#urgences-vue');
  v.replaceChildren(el('p', { className: 'carte presentation', textContent: urgences.RASSURER }),
    el('div', { className: 'numeros' }, ...urgences.NUMEROS.map((n) => {
      const c = el('button', { className: 'numero-urgence' }, el('span', { className: 'image-numero', innerHTML: enImage('urgences', n.numero, n.image) }), el('strong', { textContent: n.numero }), el('span', { className: 'nom-numero', textContent: n.nom }), el('small', { textContent: n.quand }));
      c.style.borderColor = n.couleur;
      c.addEventListener('click', () => parler(`${n.numero}. ${n.nom}. ${n.quand}`));
      return c;
    })),
    el('h2', { textContent: '📞 Au téléphone, je dis :' }),
    el('ol', { className: 'quoi-dire carte' }, ...urgences.QUOI_DIRE.map(([image, titre, texte]) => el('li', {}, el('span', { innerHTML: `${enImage('urgences', urgences.IMAGES[image], image)} ` }), el('strong', { textContent: `${titre} ` }), texte))),
    gros('🔊 Écouter', () => parler(`${urgences.RASSURER} Au téléphone, je dis : ${urgences.QUOI_DIRE.map(([, t, x]) => `${t} ${x}`).join(' ')}`), 'gros secondaire'),
    gros('⭐ Qui appeler ?', () => lancerJeu('urgences')));
  montrer('urgences');
  parler(`Les numéros d'urgence. 144 : l'ambulance. 117 : la police. 118 : les pompiers. ${urgences.RASSURER}`, { ton: 1.05 });
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
    c.innerHTML = `<div class="apercu-article plat" aria-hidden="true">${imageFiche('restaurant', `plat-${k}`, r.plat)}</div><span class="nom"></span>
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
  $('#vraie-recette').innerHTML = `<h2>${enImage('restaurant', `plat-${cle}`, r.plat)} ${r.nom} <small>(${r.vraie.pour})</small></h2>
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
      <label>Fille ou garçon <select name="genre"><option value="fille">Fille</option><option value="garcon">Garçon</option></select></label>
      <label>Poids en kilos <small>(facultatif, pour l'observatoire)</small> <input name="poids" type="number" inputmode="numeric" min="8" max="150"></label>
      <p class="info-profil"></p>
      <ul class="resume-semaine"></ul>
      <p class="erreur" role="status"></p>
      <div class="actions"><button class="gros">Enregistrer</button><button type="button" class="gros secondaire zero">Remettre à zéro</button></div>`;
    f.querySelector('h2').textContent = p.prenom;
    f.prenom.value = p.prenom;
    f.poids.value = p.poids ?? '';
    f.genre.value = p.genre ?? 'fille';
    f.age.append(...Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => new Option(`${AGE_MIN + i} ans`, AGE_MIN + i, false, AGE_MIN + i === p.age)));
    f.querySelector('.info-profil').textContent = `⭐ ${formatEtoiles(p.etoiles)} étoiles, ${p.objets.length} achat${p.objets.length > 1 ? 's' : ''}`;
    const r = suivi.resume(p), liste = (l) => l.join(', ');
    f.querySelector('.resume-semaine').append(...[
      `Cette semaine : ${r.parties} partie${r.parties > 1 ? 's' : ''} en ${r.jours} jour${r.jours > 1 ? 's' : ''} (${r.partiesAvant} la semaine d’avant). Série en cours : ${r.serie} jour${r.serie > 1 ? 's' : ''} de suite.`,
      r.plusJoues.length && `Le plus joué : ${liste(r.plusJoues)}.`,
      r.reussis.length && `Bien réussi : ${liste(r.reussis)}.`,
      r.aRevoir.length && `À revoir ensemble : ${liste(r.aRevoir)}.`,
      r.meteo.length && `Sa météo du cœur : ${liste(r.meteo.map(([j, m]) => `${j} ${emotions.METEO.find(([c]) => c === m)?.[2].split(' : ')[1] ?? m}`))}.`,
    ].filter(Boolean).map((t) => el('li', { textContent: t })));
    const info = f.querySelector('.erreur');
    if (message?.profil === p) noter(info, message.texte, true);
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      try {
        modifierProfil(p, { prenom: f.prenom.value, age: Number(f.age.value), poids: f.poids.value === '' ? null : Number(f.poids.value), genre: f.genre.value });
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
  for (const r of $('#form-suivante').elements.suivante) r.checked = r.value === (etat.reglages?.suivante ?? 'auto');
  noter($('#form-suivante .erreur'), '');
  afficherLecture();
  $('#form-nouveau-code').reset();
  $('#form-nouveau-code .erreur').textContent = '';
  voixMessage('');
  afficherVoix();
  afficherCompte($('#compte-en-ligne'));
  montrer('parents');
}

// La carte « Compte en ligne » (espace parents), et sur un appareil neuf « Vous avez déjà un compte ? » (écran du code)
const quand = (t) => new Date(t).toLocaleString('fr-CH', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
function afficherCompte(boite, appareilNeuf = false) {
  boite.hidden = !enLigne.disponible();
  if (boite.hidden) return;
  const message = el('p', { className: 'erreur', role: 'status' });
  const boutons = (actifs) => { for (const b of boite.querySelectorAll('button')) b.disabled = !actifs; };
  const attendre = async (action) => {
    boutons(false);
    noter(message, 'Un instant…', true);
    try { await action(); } catch (e) { noter(message, e.message); }
    boutons(true);
  };
  const s = enLigne.session();
  if (s && !appareilNeuf) {
    let aSupprimer = false;
    boite.replaceChildren(el('h2', { textContent: '☁️ Compte en ligne' }),
      el('p', { textContent: `Connecté avec ${enLigne.email() ?? 'votre compte'}. Les profils se retrouvent sur tous les appareils où vous vous connectez.` }),
      el('p', { className: 'info-profil', textContent: s.derniere ? `Dernière synchronisation : ${quand(s.derniere)}.` : 'Pas encore synchronisé.' }), message,
      el('div', { className: 'actions' },
        gros('🔄 Synchroniser maintenant', () => attendre(async () => { await synchroniserEnLigne(); if (erreurEnLigne) throw new Error(erreurEnLigne); afficherCompte(boite); })),
        gros('Se déconnecter', () => attendre(async () => { await enLigne.deconnecter(); afficherCompte(boite); }), 'gros secondaire')),
      gros('Supprimer le compte et les données en ligne', (ev) => {
        if (!aSupprimer) {
          aSupprimer = true;
          ev.target.textContent = 'Vraiment ? Toucher encore';
          return noter(message, 'Le compte et les profils en ligne seront effacés pour toujours. Les profils de cet appareil restent.');
        }
        attendre(async () => { await enLigne.supprimerCompte(); afficherCompte(boite); noter(boite.querySelector('.erreur'), 'Compte supprimé ✓', true); });
      }, 'petit'));
    if (erreurEnLigne) noter(message, `Synchronisation impossible : ${erreurEnLigne}`);
    return;
  }
  const f = el('form', { className: 'form-compte', noValidate: true });
  f.innerHTML = `<label>E-mail du parent <input name="email" type="email" autocomplete="username" required></label>
    <label>Mot de passe <small>(8 caractères au moins)</small> <input name="mdp" type="password" autocomplete="current-password" required></label>
    <label class="case-reglage"><input type="checkbox" name="accord"> <span>Je suis le parent (ou le responsable légal) et j’accepte la <a href="politique.html" target="_blank">politique de confidentialité</a>.</span></label>`;
  f.addEventListener('submit', (ev) => ev.preventDefault());
  if (appareilNeuf) f.accord.closest('label').hidden = true;
  const connecte = async () => {
    if (!appareilNeuf) { await synchroniserEnLigne(); if (erreurEnLigne) throw new Error(erreurEnLigne); return afficherCompte(boite); }
    const r = await enLigne.synchroniser(null); // appareil neuf : on reprend les profils en ligne
    if (!r) return noter(message, 'Connecté ✓ Aucun profil en ligne pour ce compte : choisissez un code pour commencer.', true);
    sauver(r);
    etat = charger();
    appliquerVoix(etat?.reglages);
    demarrer();
  };
  boite.replaceChildren(el('h2', { textContent: appareilNeuf ? '☁️ Vous avez déjà un compte ?' : '☁️ Compte en ligne' }),
    el('p', { textContent: appareilNeuf ? 'Connectez-vous pour retrouver les profils de vos enfants.'
      : 'Gardez les profils en ligne pour les retrouver sur la tablette, le téléphone ou l’ordinateur. Serveurs en Europe. La croyance de la famille et les voix enregistrées restent sur cet appareil.' }),
    f, message,
    el('div', { className: 'actions' },
      gros('Se connecter', () => attendre(async () => { await enLigne.connecter(f.email.value, f.mdp.value); await connecte(); })),
      ...(appareilNeuf ? [] : [gros('Créer un compte', () => attendre(async () => {
        if (!f.accord.checked) throw new Error('Cochez la case pour accepter la politique de confidentialité.');
        if (await enLigne.creerCompte(f.email.value, f.mdp.value)) await connecte();
        else noter(message, 'Presque fini : ouvrez l’e-mail reçu et cliquez sur le lien pour confirmer le compte.', true);
      }), 'gros secondaire')])),
    gros('Mot de passe oublié ?', () => attendre(async () => { await enLigne.oublie(f.email.value); noter(message, 'Un e-mail vous a été envoyé pour choisir un nouveau mot de passe.', true); }), 'petit'));
}

// Après un lien reçu par e-mail : compte confirmé, ou choisir un nouveau mot de passe
function lienEnLigne() {
  if (!enLigne.disponible()) return;
  const quoi = enLigne.lienRecu();
  if (quoi === 'confirme') {
    $('#alerte').hidden = false;
    $('#alerte').textContent = 'Compte confirmé ✓ Les profils de cet appareil sont maintenant gardés en ligne.';
    setTimeout(() => ($('#alerte').hidden = true), 6000);
  }
  if (quoi !== 'nouveau-mot-de-passe') return;
  const champ = el('input', { className: 'champ-prenom', type: 'password', autocomplete: 'new-password', placeholder: 'Nouveau mot de passe' });
  const message = el('p', { className: 'erreur', role: 'status' });
  const fenetre = el('dialog', { className: 'fenetre-prenom' });
  fenetre.append(el('h2', { textContent: 'Nouveau mot de passe' }), el('p', { textContent: '8 caractères au moins.' }), champ, message,
    el('div', { className: 'actions-prenom' }, gros('Enregistrer', async () => {
      try { await enLigne.changerMotDePasse(champ.value); fenetre.close(); } catch (e) { noter(message, e.message); }
    }), gros('Annuler', () => fenetre.close(), 'gros secondaire')));
  fenetre.addEventListener('close', () => fenetre.remove());
  document.body.append(fenetre);
  fenetre.showModal();
}

$('#ajouter-enfant').addEventListener('click', () => ouvrirProfil());

// La voix qui lit : choisie parmi les voix françaises de l'appareil, et sa vitesse
function afficherLecture() {
  const f = $('#form-lecture').elements, r = etat.reglages ?? {};
  f.voix.replaceChildren(new Option('Automatique (la meilleure trouvée)', ''), ...voixFrancaises().map((x) => new Option(`${x.name}${x.localService ? '' : ' (avec internet)'}`, x.name)));
  f.voix.value = r.voix ?? '';
  if (f.voix.selectedIndex < 0) f.voix.value = ''; // la voix choisie n'est pas sur cet appareil
  f.vitesse.value = r.vitesse ?? 'normale';
  noter($('#form-lecture .erreur'), '');
}
$('#form-lecture').addEventListener('change', () => {
  const f = $('#form-lecture').elements;
  reglerLecture(etat, { voix: f.voix.value || null, vitesse: f.vitesse.value });
  enregistrer();
  appliquerVoix(etat.reglages);
  noter($('#form-lecture .erreur'), 'Enregistré ✓', true);
});
// les voix de l'appareil arrivent parfois après l'ouverture de la page
globalThis.speechSynthesis?.addEventListener?.('voiceschanged', () => { if (!$('[data-ecran="parents"]').hidden) afficherLecture(); });
$('#essayer-voix').addEventListener('click', () => parler('Bonjour ! Je suis la voix de l’Île aux Défis. Combien font trois fois quatre ?'));
$('.confettis').replaceChildren(...['🎉', '⭐', '🎊', '✨', '🌟', '🎈', '⭐', '🎉', '✨', '🎊', '🌟', '🎈', '⭐'].map((c, i) => {
  const s = el('span', { textContent: c });
  s.style.cssText = `left:${i * 7.7}%;animation-delay:${((i * 5) % 13) * 0.12}s`;
  return s;
}));

$('#form-suivante').addEventListener('change', (ev) => {
  reglerSuivante(etat, ev.target.value);
  enregistrer();
  noter($('#form-suivante .erreur'), 'Enregistré ✓', true);
});

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

// Un bouton de retour (« ← … ») fait toujours taire la voix : l'écran qu'on quitte ne doit pas continuer à parler.
// En phase de capture : avant l'action du bouton, qui peut dire le nouvel écran.
document.addEventListener('click', (e) => {
  const b = e.target.closest?.('button, a');
  if (b && (b.textContent.trim().startsWith('←') || /retour|quitter/.test(`${b.className} ${b.id}`))) { taire(); voixParents.arreter(); }
}, true);
habillerEmojis(document.body);
lienEnLigne();
demarrer();
synchroniserEnLigne();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

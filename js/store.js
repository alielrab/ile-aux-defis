// Données de l'app : code parent + les profils des enfants, gardés dans le navigateur (localStorage).
// C'est le SEUL fichier qui lit et écrit les données : pour des comptes parents et une synchronisation en ligne,
// on remplacera charger/sauver ici (voir IDEES.md, « Commercialisation ») sans toucher au reste de l'app.
// Deux parts : CLE = ce qui pourra être synchronisé ; CLE_APPAREIL = ce qui ne quitte jamais l'appareil (la croyance).
import { CROYANCES, RELIGIONS, illustrationsParDefaut } from './croyances.js';
import { avatarValide, AGE_MIN, AGE_MAX, AVATAR_PAR_DEFAUT, TENUES_DE_DEPART, COIFFURES_DE_DEPART, CHEVEUX_DE_DEPART } from './avatar.js';

const CLE = 'ile-aux-defis';
const CLE_APPAREIL = 'ile-aux-defis-appareil';
const VERSION = 2; // v2 : avatars humains (la v1 avec des emojis n'a servi qu'aux essais, on la recommence)

function verifierCode(code) {
  if (!/^\d{4}$/.test(code)) throw new Error('Le code doit avoir 4 chiffres.');
  return code;
}

export const nouvelEtat = (code) => ({ version: VERSION, code: verifierCode(code), profils: [], croyance: { famille: null, decouvrir: [], illustrations: true } });

// Espace parents : la croyance de la famille (le lieu du village) et les autres religions que les enfants peuvent découvrir.
// illustrations : afficher les personnages religieux dessinés (réglé selon la croyance, modifiable par le parent).
export function reglerCroyance(etat, famille, decouvrir, illustrations = illustrationsParDefaut(famille)) {
  if (famille !== null && !(famille in CROYANCES)) throw new Error('Croyance inconnue.');
  if (!decouvrir.every((x) => RELIGIONS.includes(x))) throw new Error('Religion inconnue.');
  etat.croyance = { famille, decouvrir: famille ? decouvrir.filter((x) => x !== famille) : [], illustrations: !!illustrations };
}

export function changerCode(etat, code) {
  etat.code = verifierCode(code);
}

function verifierPrenomAge(prenom, age) {
  prenom = String(prenom ?? '').trim();
  if (!prenom || prenom.length > 20) throw new Error('Écris un prénom (20 lettres maximum).');
  if (!Number.isInteger(age) || age < AGE_MIN || age > AGE_MAX) throw new Error(`Choisis un âge entre ${AGE_MIN} et ${AGE_MAX} ans.`);
  return prenom;
}

// Écran parent : changer le prénom et l'âge (l'avatar grandit avec l'âge).
// poids (kg, facultatif) : pour l'observatoire. null = pas de poids.
export function modifierProfil(profil, { prenom, age, poids = profil.poids ?? null }) {
  if (poids !== null && !(Number.isInteger(poids) && poids >= 8 && poids <= 150)) throw new Error('Le poids doit être un nombre entier de kilos, entre 8 et 150.');
  profil.prenom = verifierPrenomAge(prenom, age);
  profil.age = age;
  profil.poids = poids;
}

// Écran parent : on repart de zéro (étoiles, achats, maison, îles et dessins à colorier débloqués). La galerie de dessins et les BD sont gardées. On garde le prénom, l'âge, la peau et les yeux.
export function remettreAZero(profil) {
  Object.assign(profil, { etoiles: 0, objets: [], maison: maisonVide(), recettes: {}, iles: [], modeles: [] });
  const a = profil.avatar;
  if (!TENUES_DE_DEPART.includes(a.tenue)) a.tenue = AVATAR_PAR_DEFAUT.tenue;
  if (!COIFFURES_DE_DEPART.includes(a.coiffure)) a.coiffure = AVATAR_PAR_DEFAUT.coiffure;
  if (!CHEVEUX_DE_DEPART.includes(a.cheveux)) a.cheveux = AVATAR_PAR_DEFAUT.cheveux;
  a.accessoires = [];
}

export const maisonVide = () => ({ piece: 'chambre', papiers: {}, places: [], tableaux: {} });

// Un identifiant unique, valable aussi entre plusieurs appareils une fois synchronisés.
const nouvelId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export function ajouterProfil(etat, { prenom, age, avatar }) {
  prenom = verifierPrenomAge(prenom, age);
  if (!avatarValide(avatar)) throw new Error('Termine ton personnage.');
  const profil = { id: nouvelId(), prenom, age, avatar: { accessoires: [], ...avatar }, etoiles: 0, objets: [], maison: maisonVide(), recettes: {}, vus: {}, iles: [], dessins: [], modeles: [], bds: [] };
  etat.profils.push(profil);
  return profil;
}

export function charger(stockage = globalThis.localStorage) {
  try {
    const etat = JSON.parse(stockage.getItem(CLE));
    if (etat?.version !== VERSION) return null;
    // la croyance est sur l'appareil ; avant, elle était avec le reste (on la reprend de là une dernière fois)
    etat.croyance = JSON.parse(stockage.getItem(CLE_APPAREIL))?.croyance ?? etat.croyance ?? { famille: null, decouvrir: [] };
    etat.croyance.illustrations ??= illustrationsParDefaut(etat.croyance.famille);
    for (const p of etat.profils) {
      // compléter les profils créés pendant les premiers essais
      p.avatar.yeux ??= 'marron';
      p.avatar.accessoires ??= [];
      p.recettes ??= {}; // restaurant : 'debloquee' puis 'faite'
      p.vus ??= {}; // questions déjà posées, par jeu (pour ne pas les reposer trop tôt)
      p.iles ??= []; // îles de l'archipel débloquées avec des étoiles (rien d'autre ne change dans le profil)
      p.dessins ??= []; // atelier de peinture : la galerie
      p.modeles ??= []; // atelier de peinture : les dessins à colorier débloqués
      p.bds ??= []; // atelier BD : les bandes dessinées
      p.maison ??= maisonVide();
      p.maison.piece ??= 'chambre';
      p.maison.tableaux ??= {}; // un dessin de la galerie accroché par pièce
      p.maison.papiers ??= { chambre: p.maison.papier ?? null }; // avant : un seul papier peint
      delete p.maison.papier;
    }
    return etat;
  } catch {
    return null; // stockage bloqué ou données illisibles : on repart de zéro
  }
}

// Renvoie false si le navigateur refuse d'enregistrer (navigation privée, stockage plein).
export function sauver(etat, stockage = globalThis.localStorage) {
  try {
    const { croyance, ...synchronisable } = etat;
    stockage.setItem(CLE, JSON.stringify(synchronisable));
    stockage.setItem(CLE_APPAREIL, JSON.stringify({ croyance }));
    return true;
  } catch {
    return false;
  }
}

// Le compte parent en ligne (Supabase, serveurs en Europe) : retrouver les profils sur tous les appareils.
// Seule la partie synchronisable de l'état part en ligne : jamais la croyance, qui reste sur l'appareil (voir store.js).
// Sans réseau, l'app marche comme avant ; la synchronisation reprend dès que le réseau revient.
import { SUPABASE_URL, SUPABASE_CLE } from './config-en-ligne.js';

const CLE_SESSION = 'ile-aux-defis-session'; // la connexion du parent sur cet appareil
const CLE_COPIE = 'ile-aux-defis-copie'; // ce qui a été synchronisé la dernière fois : pour savoir ce qui a changé ici depuis

export const disponible = () => Boolean(SUPABASE_URL && SUPABASE_CLE);

const lire = (cle) => { try { return JSON.parse(localStorage.getItem(cle)); } catch { return null; } };
const ecrire = (cle, v) => { try { v == null ? localStorage.removeItem(cle) : localStorage.setItem(cle, JSON.stringify(v)); } catch { /* stockage bloqué */ } };

export const session = () => lire(CLE_SESSION);
export const email = () => session()?.user?.email ?? null;

// ---------- La fusion (sans réseau : testée dans tests/en-ligne.test.js) ----------
// Le même objet donne toujours le même texte, quel que soit l'ordre des clés (la base de données les réordonne)
const texte = (v) => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x));
const sansMaj = ({ maj, ...reste }) => texte(reste);
const partieParent = (e) => texte({ code: e.code, reglages: e.reglages });

// Ce qui a changé ici depuis la dernière synchronisation reçoit l'heure d'aujourd'hui.
export function dater(local, copie, maintenant = Date.now()) {
  for (const p of local.profils) if (sansMaj(p) !== copie?.profils?.[p.id]) p.maj = maintenant;
  if (partieParent(local) !== copie?.parent) local.majParent = maintenant;
}

// Profil par profil, la version la plus récente gagne. Les profils d'un seul côté sont gardés (rien n'est jamais supprimé).
export function fusionner(local, distant) {
  if (!distant) return structuredClone(local);
  if (!local) return structuredClone(distant);
  const parent = (distant.majParent ?? 0) > (local.majParent ?? 0) ? distant : local;
  const ici = new Map(local.profils.map((p) => [p.id, p]));
  const profils = local.profils.map((p) => { const d = distant.profils.find((x) => x.id === p.id); return d && (d.maj ?? 0) > (p.maj ?? 0) ? d : p; });
  for (const d of distant.profils) if (!ici.has(d.id)) profils.push(d);
  return structuredClone({ ...local, code: parent.code, reglages: parent.reglages, majParent: parent.majParent, profils });
}

// Ce qu'il faut envoyer : la partie parent et les enfants dont la version fusionnée n'est pas celle déjà en ligne
export function aEnvoyer(resultat, distant) {
  const { profils, ...parent } = resultat;
  const { profils: enLigne = [], ...parentEnLigne } = distant ?? {};
  const deja = new Map(enLigne.map((p) => [p.id, texte(p)]));
  return {
    envoyerParent: distant && texte(parent) === texte(parentEnLigne) ? null : parent,
    envoyerEnfants: profils.filter((p) => deja.get(p.id) !== texte(p)),
  };
}

export const copieDe = (e) => ({ parent: partieParent(e), profils: Object.fromEntries(e.profils.map((p) => [p.id, sansMaj(p)])) });

// Met le résultat dans l'état de l'app sans changer les objets en cours d'usage (la joueuse reste le même objet).
export function appliquer(etat, resultat) {
  let change = false;
  for (const r of resultat.profils) {
    const p = etat.profils.find((x) => x.id === r.id);
    if (!p) { etat.profils.push(r); change = true; } else if (texte(p) !== texte(r)) {
      for (const k of Object.keys(p)) delete p[k];
      Object.assign(p, r);
      change = true;
    }
  }
  if (partieParent(etat) !== partieParent(resultat)) change = true;
  Object.assign(etat, { code: resultat.code, reglages: resultat.reglages, majParent: resultat.majParent });
  return change;
}

// ---------- Le réseau ----------
async function appel(chemin, { methode = 'GET', corps, jeton, entetes = {} } = {}) {
  const r = await fetch(`${SUPABASE_URL}${chemin}`, {
    method: methode,
    headers: { apikey: SUPABASE_CLE, 'Content-Type': 'application/json', ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}), ...entetes },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  const texte = await r.text();
  const donnees = texte ? JSON.parse(texte) : null;
  if (!r.ok) throw new Error(traduire(donnees?.msg ?? donnees?.error_description ?? donnees?.message ?? `Erreur ${r.status}`));
  return donnees;
}

function traduire(m) {
  if (/invalid login credentials/i.test(m)) return 'E-mail ou mot de passe incorrect.';
  if (/email not confirmed/i.test(m)) return 'Confirmez d’abord votre e-mail : cliquez sur le lien reçu.';
  if (/already registered|already been registered/i.test(m)) return 'Un compte existe déjà avec cet e-mail : connectez-vous.';
  if (/password should be at least/i.test(m)) return 'Le mot de passe doit avoir au moins 8 caractères.';
  if (/rate limit|too many/i.test(m)) return 'Trop d’essais : attendez quelques minutes.';
  if (/failed to fetch|network/i.test(m)) return 'Pas de connexion Internet.';
  return m;
}

const garder = (s) => { ecrire(CLE_SESSION, { access_token: s.access_token, refresh_token: s.refresh_token, expire: Date.now() + (s.expires_in ?? 3600) * 1000, user: { id: s.user?.id, email: s.user?.email } }); };

// Un jeton encore valable (renouvelé s'il expire bientôt), ou null si on n'est pas connecté.
async function jeton() {
  const s = session();
  if (!s) return null;
  if (s.expire - Date.now() > 60_000) return s.access_token;
  try {
    garder(await appel('/auth/v1/token?grant_type=refresh_token', { methode: 'POST', corps: { refresh_token: s.refresh_token } }));
  } catch (e) {
    if (!/connexion Internet/.test(e.message)) deconnecterIci(); // session refusée par le serveur : il faut se reconnecter
    throw e;
  }
  return session().access_token;
}

const verifier = (adresse, motDePasse) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) throw new Error('Écrivez une adresse e-mail valide.');
  if (String(motDePasse).length < 8) throw new Error('Le mot de passe doit avoir au moins 8 caractères.');
};

// Créer le compte. Renvoie true si on est connecté tout de suite, false s'il faut d'abord confirmer l'e-mail.
export async function creerCompte(adresse, motDePasse) {
  verifier(adresse, motDePasse);
  const r = await appel('/auth/v1/signup', { methode: 'POST', corps: { email: adresse.trim(), password: motDePasse } });
  if (r?.access_token) { garder(r); return true; }
  return false;
}

export async function connecter(adresse, motDePasse) {
  verifier(adresse, motDePasse);
  garder(await appel('/auth/v1/token?grant_type=password', { methode: 'POST', corps: { email: adresse.trim(), password: motDePasse } }));
}

export async function oublie(adresse) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) throw new Error('Écrivez votre adresse e-mail.');
  await appel('/auth/v1/recover', { methode: 'POST', corps: { email: adresse.trim() } });
}

export async function changerMotDePasse(motDePasse) {
  if (String(motDePasse).length < 8) throw new Error('Le mot de passe doit avoir au moins 8 caractères.');
  await appel('/auth/v1/user', { methode: 'PUT', corps: { password: motDePasse }, jeton: await jeton() });
}

// Se déconnecter : les données restent sur cet appareil, mais ne se synchronisent plus.
function deconnecterIci() { ecrire(CLE_SESSION, null); ecrire(CLE_COPIE, null); }
export async function deconnecter() {
  const s = session();
  deconnecterIci();
  if (s) await appel('/auth/v1/logout', { methode: 'POST', jeton: s.access_token }).catch(() => {});
}

// Supprimer le compte et toutes les données en ligne (les données de cet appareil restent).
export async function supprimerCompte() {
  await appel('/rest/v1/rpc/supprimer_compte', { methode: 'POST', corps: {}, jeton: await jeton() });
  deconnecterIci();
}

// Le lien reçu par e-mail (confirmation, mot de passe oublié) revient sur l'app avec la session dans l'adresse.
// Renvoie 'confirme', 'nouveau-mot-de-passe' ou null.
export function lienRecu() {
  const h = new URLSearchParams(location.hash.slice(1));
  if (!h.get('access_token')) return null;
  garder({ access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expires_in: Number(h.get('expires_in')) || 3600, user: {} });
  history.replaceState(null, '', location.pathname + location.search);
  return h.get('type') === 'recovery' ? 'nouveau-mot-de-passe' : 'confirme';
}

// Compléter l'e-mail et l'identifiant après un lien reçu par e-mail
async function completerUtilisateur(t) {
  const s = session();
  if (s?.user?.id) return s.user.id;
  const u = await appel('/auth/v1/user', { jeton: t });
  ecrire(CLE_SESSION, { ...session(), user: { id: u.id, email: u.email } });
  return u.id;
}

// La synchronisation : on lit la version en ligne, on fusionne avec celle d'ici, on renvoie le résultat en ligne.
// etat : l'état d'ici (sans la croyance), ou null sur un appareil neuf. Renvoie l'état fusionné, ou null si pas connecté.
let enCours = null;
export function synchroniser(etat) {
  enCours ??= (async () => {
    try {
      const t = await jeton();
      if (!t) return null;
      const id = await completerUtilisateur(t);
      const ici = etat ? (({ croyance, ...reste }) => structuredClone(reste))(etat) : null;
      if (ici) dater(ici, lire(CLE_COPIE));
      const [parents, enfants] = await Promise.all([
        appel(`/rest/v1/parents?select=donnees&id=eq.${id}`, { jeton: t }),
        appel(`/rest/v1/profils?select=donnees&famille=eq.${id}`, { jeton: t }),
      ]);
      const distant = parents.length || enfants.length ? { ...parents[0]?.donnees, profils: enfants.map((e) => e.donnees) } : null;
      const resultat = fusionner(ici, distant);
      if (!resultat) return null; // rien ici, rien en ligne
      // On n'envoie que ce qui est plus récent ici : un enfant qui joue sur un autre appareil n'est pas touché.
      const { envoyerParent, envoyerEnfants } = aEnvoyer(resultat, distant);
      if (envoyerParent || envoyerEnfants.length) {
        await appel('/rest/v1/rpc/envoyer', { methode: 'POST', jeton: t, corps: { parent: envoyerParent, enfants: envoyerEnfants } });
      }
      ecrire(CLE_COPIE, copieDe(resultat));
      ecrire(CLE_SESSION, { ...session(), derniere: Date.now() });
      return resultat;
    } finally {
      enCours = null;
    }
  })();
  return enCours;
}

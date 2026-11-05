// La voix des parents : phrases enregistrées au micro, gardées sur l'appareil (IndexedDB, trop gros pour localStorage).
// type : 'felicitation' ou 'encouragement'.
const BASE = 'ile-aux-defis-voix', TABLE = 'phrases';

function action(mode, faire) {
  return new Promise((ok, ko) => {
    const ouverture = indexedDB.open(BASE, 1);
    ouverture.onupgradeneeded = () => ouverture.result.createObjectStore(TABLE, { keyPath: 'id', autoIncrement: true });
    ouverture.onerror = () => ko(ouverture.error);
    ouverture.onsuccess = () => {
      const db = ouverture.result, tx = db.transaction(TABLE, mode), requete = faire(tx.objectStore(TABLE));
      tx.oncomplete = () => { db.close(); ok(requete.result); };
      tx.onerror = tx.onabort = () => { db.close(); ko(tx.error); };
    };
  });
}

let memoire = null; // les phrases, chargées une fois
export async function lister() {
  memoire ??= await action('readonly', (t) => t.getAll()).catch(() => []);
  return memoire;
}
const changer = async (faire) => { await action('readwrite', faire); memoire = null; };
export const ajouter = (type, audio) => changer((t) => t.add({ type, audio }));
export const remplacer = (id, type, audio) => changer((t) => t.put({ id, type, audio }));
export const supprimer = (id) => changer((t) => t.delete(id));

let enCours = null;
export const arreter = () => enCours?.pause();

// Joue un enregistrement. Se termine à la fin du son (true), ou tout de suite (false) s'il ne peut pas jouer.
export function ecouter(audio) {
  arreter();
  return new Promise((fini) => {
    const son = (enCours = new Audio(URL.createObjectURL(audio)));
    const fin = (ok) => { clearTimeout(secours); URL.revokeObjectURL(son.src); fini(ok); };
    const secours = setTimeout(() => fin(true), 10000);
    son.onended = son.onpause = () => fin(true);
    son.onerror = () => fin(false);
    son.play().catch(() => fin(false));
  });
}

// Une phrase de ce type au hasard (jamais deux fois la même d'affilée). false s'il n'y en a pas : la voix de synthèse prend le relais.
let derniere = null;
export async function jouerAuHasard(type) {
  const liste = (await lister()).filter((p) => p.type === type);
  if (!liste.length) return false;
  const possibles = liste.length > 1 ? liste.filter((p) => p.id !== derniere) : liste;
  const p = possibles[Math.floor(Math.random() * possibles.length)];
  derniere = p.id;
  return ecouter(p.audio);
}

export const microDisponible = () => !!(navigator.mediaDevices?.getUserMedia && globalThis.MediaRecorder);

// Commence un enregistrement (le navigateur demande l'accès au micro la première fois).
// Renvoie { arreter } ; arreter() donne le son (Blob). S'arrête tout seul après dureeMax.
export async function enregistrer(dureeMax = 6000) {
  const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(flux), morceaux = [];
  rec.ondataavailable = (e) => e.data.size && morceaux.push(e.data);
  const son = new Promise((ok) => {
    rec.onstop = () => { flux.getTracks().forEach((p) => p.stop()); ok(new Blob(morceaux, { type: rec.mimeType })); };
  });
  rec.start();
  const minuteur = setTimeout(() => rec.state !== 'inactive' && rec.stop(), dureeMax);
  return {
    son,
    arreter() { clearTimeout(minuteur); if (rec.state !== 'inactive') rec.stop(); return son; },
  };
}

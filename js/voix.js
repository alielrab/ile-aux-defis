// Voix (synthèse vocale du système) et petits sons. Marche sans internet si une voix française est installée.
import { accorder } from './genre.js';

// Le genre de l'enfant qui joue : toutes les phrases dites s'accordent (« Tu es trop {fort|forte} ! »)
let genre = 'fille';
export const choisirGenre = (g) => { genre = g; };

// La voix française la plus naturelle disponible. Hors-ligne, seulement les voix installées sur l'appareil.
export function choisirVoix(voix, enLigne = true) {
  const score = (v) =>
    (/natural|neural|premium|enhanced|amélioré|naturel/i.test(v.name) ? 20 : 0) +
    (v.lang.toLowerCase().replace('_', '-') === 'fr-fr' ? 10 : 0) +
    (/google/i.test(v.name) ? 5 : 0) +
    (/compact/i.test(v.name) ? -5 : 0) +
    (v.localService ? 1 : 0);
  return voix
    .filter((v) => v.lang?.toLowerCase().startsWith('fr') && (enLigne || v.localService))
    .sort((a, b) => score(b) - score(a))[0] ?? null;
}

// Réglages des parents : une voix choisie parmi celles de l'appareil (sinon la meilleure trouvée), et la vitesse
export const VITESSES = { lente: 0.85, normale: 1, rapide: 1.15 };
let preferee = null, allure = 1;
export const appliquerVoix = ({ voix = null, vitesse = 'normale' } = {}) => { preferee = voix; allure = VITESSES[vitesse] ?? 1; };
export const voixFrancaises = (voix = globalThis.speechSynthesis?.getVoices() ?? []) => voix.filter((v) => v.lang?.toLowerCase().startsWith('fr'));

// Ton : 1 = normal, plus haut = plus enjoué. Se termine quand la phrase est dite (ou après un délai de secours).
let derniere = { texte: '', ton: 1 };
// Redire la dernière phrase (bouton 🔊 « réécouter »)
export const repeter = () => parler(derniere.texte, { ton: derniere.ton });

export function parler(texte, { ton = 1, vitesse = 0.95 } = {}) {
  texte = accorder(texte, genre);
  derniere = { texte, ton };
  return new Promise((fini) => {
    const synth = globalThis.speechSynthesis;
    if (!synth) return setTimeout(fini, 600);
    synth.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR';
    const voix = synth.getVoices();
    u.voice = voix.find((x) => x.name === preferee) ?? choisirVoix(voix, navigator.onLine);
    u.pitch = ton;
    u.rate = vitesse * allure;
    const secours = setTimeout(fini, 1500 + texte.length * 80); // certains navigateurs oublient l'événement de fin
    u.onend = u.onerror = () => { clearTimeout(secours); fini(); };
    synth.speak(u);
  });
}

export const taire = () => globalThis.speechSynthesis?.cancel();

// Dire un mot étranger (mots de voyage) avec une voix de sa langue ; sans cette voix sur l'appareil, lire la prononciation « à la française »
export function parlerLangue(mot, lang, prononciation) {
  const synth = globalThis.speechSynthesis;
  const voix = synth?.getVoices() ?? [];
  const norme = (l) => l?.toLowerCase().replace('_', '-');
  const v = voix.find((x) => norme(x.lang) === lang.toLowerCase()) ?? voix.find((x) => norme(x.lang)?.startsWith(lang.slice(0, 2)));
  if (!v) return parler(prononciation.replaceAll('-', ''));
  synth.cancel();
  const u = new SpeechSynthesisUtterance(mot);
  u.lang = v.lang; u.voice = v; u.rate = 0.8 * allure;
  synth.speak(u);
}

// Attendre que la voix ait vraiment fini : sur certaines tablettes, la fin de la phrase est annoncée trop tôt.
export async function attendreSilence(max = 20000) {
  const synth = globalThis.speechSynthesis, debut = Date.now();
  while (synth?.speaking && Date.now() - debut < max) await new Promise((r) => setTimeout(r, 150));
}

let audio;
// Des notes douces, comme un xylophone : [fréquence, début (s), durée (s)]
export function notes(liste, type = 'triangle') {
  try {
    audio ??= new AudioContext();
    const t0 = audio.currentTime;
    for (const [frequence, debut, duree] of liste) {
      const o = audio.createOscillator(), g = audio.createGain(), t = t0 + debut;
      o.type = type;
      o.frequency.value = frequence;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + duree);
      o.connect(g).connect(audio.destination);
      o.start(t);
      o.stop(t + duree);
    }
  } catch { /* pas de son, pas grave */ }
}
// Juste : deux notes qui montent. À revoir : deux notes graves qui descendent, sans agresser.
export const bip = (juste) => (juste ? notes([[784, 0, 0.18], [1047, 0.1, 0.4]]) : notes([[330, 0, 0.22], [262, 0.14, 0.32]], 'sine'));
// La fin d'une partie : do, mi, sol, do
export const fanfare = () => notes([[523, 0, 0.2], [659, 0.12, 0.2], [784, 0.24, 0.2], [1047, 0.36, 0.6]]);

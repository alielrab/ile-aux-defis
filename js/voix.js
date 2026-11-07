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
    u.voice = choisirVoix(synth.getVoices(), navigator.onLine);
    u.pitch = ton;
    u.rate = vitesse;
    const secours = setTimeout(fini, 1500 + texte.length * 80); // certains navigateurs oublient l'événement de fin
    u.onend = u.onerror = () => { clearTimeout(secours); fini(); };
    synth.speak(u);
  });
}

export const taire = () => globalThis.speechSynthesis?.cancel();

// Attendre que la voix ait vraiment fini : sur certaines tablettes, la fin de la phrase est annoncée trop tôt.
export async function attendreSilence(max = 20000) {
  const synth = globalThis.speechSynthesis, debut = Date.now();
  while (synth?.speaking && Date.now() - debut < max) await new Promise((r) => setTimeout(r, 150));
}

let audio;
export function bip(juste) {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
    o.frequency.setValueAtTime(juste ? 660 : 330, t);
    if (juste) o.frequency.setValueAtTime(880, t + 0.12);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g).connect(audio.destination);
    o.start(t);
    o.stop(t + 0.35);
  } catch { /* pas de son, pas grave */ }
}

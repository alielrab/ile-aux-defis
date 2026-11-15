// La salle de musique (île des créateurs) : composer une mélodie sur une grille, une note par temps.
// shortcut: 8 temps et une seule mélodie gardée par enfant, à agrandir si elles veulent des morceaux plus longs.
export const NOTES = [ // du grave à l'aigu
  { nom: 'do', frequence: 262, couleur: '#e05252' }, { nom: 'ré', frequence: 294, couleur: '#f28c28' },
  { nom: 'mi', frequence: 330, couleur: '#f2c230' }, { nom: 'fa', frequence: 349, couleur: '#5cb85c' },
  { nom: 'sol', frequence: 392, couleur: '#2bb3a0' }, { nom: 'la', frequence: 440, couleur: '#4a90d9' },
  { nom: 'si', frequence: 494, couleur: '#8e6ad8' }, { nom: 'do aigu', frequence: 523, couleur: '#f080b0' },
];
export const TEMPS = 8;
export const DUREE = 0.4; // secondes par temps
export const melodieVide = () => Array(TEMPS).fill(null);

// Toucher une case : c'est la note de ce temps. Toucher encore la même : on l'enlève.
export function basculer(melodie, temps, note) {
  const m = [...melodie];
  m[temps] = m[temps] === note ? null : note;
  return m;
}

// Les notes à jouer : [fréquence, début (s), durée (s)]. Un temps vide est un silence.
export const aJouer = (melodie) => melodie.flatMap((n, i) => (NOTES[n] ? [[NOTES[n].frequence, i * DUREE, DUREE * 1.2]] : []));

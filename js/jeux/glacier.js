// Le glacier de la plage (île de la nature) : servir les glaces des clients, de plus en plus vite.
// Le client commande des boules dans un ordre ; on les empile dans le cornet, puis on sert. 3 cœurs : une erreur ou un client parti en coûte un.
import { etoilesDuJeu } from '../partie.js';

export const etoilesParGlace = (age) => etoilesDuJeu('glacier', age);
export const VIES = 3;

export const PARFUMS = [
  { cle: 'fraise', nom: 'fraise', couleur: '#f58aa5' }, { cle: 'chocolat', nom: 'chocolat', couleur: '#7a4a2b' }, { cle: 'vanille', nom: 'vanille', couleur: '#fbeeb0' },
  { cle: 'citron', nom: 'citron', couleur: '#f6dc3c' }, { cle: 'pistache', nom: 'pistache', couleur: '#a8d58a' }, { cle: 'myrtille', nom: 'myrtille', couleur: '#6a6fd0' },
];
export const CLIENTS = ['🧒', '👧', '👦', '👩', '👨', '👵', '👴', '🧑'];

// niveau : 0, 1, 2… (il monte toutes les 3 glaces servies)
export const niveau = (servies) => Math.floor(servies / 3);
// Les parfums proposés : 3 au début (4 dès 8 ans), jusqu'à 6
export const nbParfums = (age, niv) => Math.min((age <= 7 ? 3 : 4) + Math.floor(niv / 2), PARFUMS.length);
// Le nombre de boules : 1 ou 2 au début, jusqu'à 3 (4 dès 8 ans)
export const nbBoulesMax = (age, niv) => Math.min(2 + Math.floor(niv / 2), age <= 7 ? 3 : 4);
// Le temps pour servir, en secondes : de plus en plus court, mais jamais moins de 6 s (5 s dès 8 ans)
export const temps = (age, niv) => Math.max(age <= 7 ? 6 : 5, (age <= 7 ? 16 : 13) - niv * 1.5);

// Une commande : les parfums, du bas du cornet vers le haut
export function commande(age, servies, aleatoire = Math.random) {
  const niv = niveau(servies), n = 1 + Math.floor(aleatoire() * nbBoulesMax(age, niv));
  return Array.from({ length: n }, () => PARFUMS[Math.floor(aleatoire() * nbParfums(age, niv))].cle);
}
export const juste = (commandee, servie) => commandee.length === servie.length && commandee.every((p, i) => p === servie[i]);

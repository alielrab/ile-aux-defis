// Le Memory (salle de jeux, île du village) : retrouver les paires de cartes, seul ou à deux sur la même tablette.
// Les cartes viennent des thèmes de l'île : animaux du refuge, planètes, dinosaures, drapeaux du passeport.
import { melanger, etoilesDuJeu } from '../partie.js';
import { article, ANIMAUX } from '../catalogue.js';
import { apercu } from '../maison.js';
import { ASTRES, dessinerAstre } from './espace.js';
import { DINOS, dessinerSquelette } from './dinos.js';
import { PAYS } from './passeport.js';
import { FICHES } from './veto.js';

export const etoilesParPaire = (age) => etoilesDuJeu('memory', age);
export const nbPaires = (age) => (age <= 7 ? 6 : 10);

const svgAstre = (a) => `<svg viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="ombre-astre" cx=".35" cy=".35" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>${dessinerAstre(a, 0, 0, a.cle === 'saturne' ? 28 : 44)}</svg>`;

// Chaque thème : ses cartes { cle, nom, dessin, savais }
export const THEMES = {
  animaux: { nom: 'Les animaux', image: '🐾', cartes: () => Object.entries(ANIMAUX).map(([cle, a]) => ({ cle, nom: a.nom, dessin: apercu(article(`animal:${cle}`)), savais: FICHES[a.espece].savais })) },
  planetes: { nom: 'Les planètes', image: '🪐', cartes: () => ASTRES.map((a) => ({ cle: a.cle, nom: a.nom, dessin: svgAstre(a), savais: a.faits[0] })) },
  dinos: { nom: 'Les dinosaures', image: '🦕', cartes: () => DINOS.map((d) => ({ cle: d.cle, nom: d.nom, dessin: dessinerSquelette(d), savais: d.savais })) },
  drapeaux: { nom: 'Les drapeaux', image: '🏳️', cartes: () => PAYS.map((p) => ({ cle: p.cle, nom: p.nom, dessin: `<span class="drapeau-carte">${p.drapeau}</span>`, savais: p.savais })) },
};
export const carte = (theme, cle) => THEMES[theme].cartes().find((c) => c.cle === cle);

// joueurs : [{ id, prenom, age }] (1 ou 2). Le nombre de cartes : selon le plus jeune.
export function nouvellePartie(theme, joueurs, aleatoire = Math.random) {
  const age = Math.min(...joueurs.map((j) => j.age));
  const cles = melanger(THEMES[theme].cartes().map((c) => c.cle), aleatoire).slice(0, nbPaires(age));
  return { theme, joueurs, tour: 0, paires: joueurs.map(() => 0), coups: 0, ouvertes: [],
    cartes: melanger([...cles, ...cles], aleatoire).map((cle) => ({ cle, trouvee: null })) };
}

// Retourner la carte i. Renvoie : 'non' (impossible), 'premiere', 'paire', 'fini' (dernière paire) ou 'ratee'.
// Après 'ratee', les deux cartes restent visibles : cacher() les retourne et passe au joueur suivant.
export function retourner(p, i) {
  const c = p.cartes[i];
  if (!c || c.trouvee !== null || p.ouvertes.includes(i) || p.ouvertes.length >= 2) return 'non';
  p.ouvertes.push(i);
  if (p.ouvertes.length === 1) return 'premiere';
  p.coups++;
  const [a, b] = p.ouvertes.map((k) => p.cartes[k]);
  if (a.cle !== b.cle) return 'ratee';
  a.trouvee = b.trouvee = p.tour; // trouvée par ce joueur, qui rejoue
  p.paires[p.tour]++;
  p.ouvertes = [];
  return p.cartes.every((x) => x.trouvee !== null) ? 'fini' : 'paire';
}
export function cacher(p) {
  p.ouvertes = [];
  p.tour = (p.tour + 1) % p.joueurs.length;
}

// Les étoiles de chaque joueur : ses paires × le tarif de son âge (arrondi à la demi-étoile)
export const etoiles = (p) => p.joueurs.map((j, k) => Math.round(p.paires[k] * etoilesParPaire(j.age) * 2) / 2);
// Le gagnant à deux : l'indice du joueur, ou null en cas d'égalité
export const gagnant = (p) => (p.paires.length < 2 || p.paires[0] === p.paires[1] ? null : p.paires[0] > p.paires[1] ? 0 : 1);

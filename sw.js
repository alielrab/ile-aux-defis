// Garde l'app en cache pour qu'elle marche hors ligne. Changer VERSION à chaque mise en ligne.
const VERSION = 'ile-12';
const FICHIERS = [
  './', 'index.html', 'style.css', 'manifest.json', 'icons/icone-192.png', 'icons/icone-512.png',
  'js/app.js', 'js/archipel.js', 'js/avatar.js', 'js/carte.js', 'js/catalogue.js', 'js/croyances-contenu.js', 'js/croyances.js',
  'js/enregistrements.js', 'js/genre.js', 'js/maison.js', 'js/messages.js', 'js/partie.js', 'js/rapprochements.js', 'js/recits.js', 'js/reglages.js', 'js/store.js', 'js/voix.js',
  'js/jeux/atlas.js', 'js/jeux/bd.js', 'js/jeux/calcul.js', 'js/jeux/corps-questions.js', 'js/jeux/corps.js', 'js/jeux/cuisine.js', 'js/jeux/dinos.js', 'js/jeux/passeport.js', 'js/jeux/urgences.js', 'js/jeux/veto.js', 'js/jeux/fractions.js', 'js/jeux/memory.js', 'js/jeux/emotions.js', 'js/jeux/espace.js',
  'js/jeux/heure.js', 'js/jeux/marche.js', 'js/jeux/peinture.js', 'js/jeux/syllabes-mots.js', 'js/jeux/syllabes.js',
];

{
  self.addEventListener('install', (e) => e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())));
  self.addEventListener('activate', (e) => e.waitUntil(
    caches.keys().then((cles) => Promise.all(cles.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
  // Le cache d'abord (hors ligne), puis mise à jour en arrière-plan pour la prochaine ouverture.
  self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(caches.open(VERSION).then(async (c) => {
      const enCache = await c.match(e.request, { ignoreSearch: true });
      const reseau = fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; });
      if (enCache) { reseau.catch(() => {}); return enCache; }
      return reseau;
    }));
  });
}

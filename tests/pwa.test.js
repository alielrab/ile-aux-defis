import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

test('sw.js met en cache tous les fichiers de l’app, et ils existent', () => {
  const sw = readFileSync('sw.js', 'utf8');
  const listes = [...sw.matchAll(/'([^']+\.(?:js|css|html|json|png))'/g)].map((m) => m[1]);
  const js = [...readdirSync('js').filter((f) => f.endsWith('.js')).map((f) => `js/${f}`),
    ...readdirSync('js/jeux').map((f) => `js/jeux/${f}`)];
  for (const f of [...js, 'index.html', 'style.css', 'manifest.json']) assert.ok(listes.includes(f), `${f} manque dans sw.js`);
  for (const f of listes) assert.ok(existsSync(f), `${f} n’existe pas`);
  for (const i of JSON.parse(readFileSync('manifest.json', 'utf8')).icons) assert.ok(existsSync(i.src));
});

test('la liste des phrases à enregistrer se génère, sans phrase variable ni doublon', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['voix/lister-phrases.mjs']);
  const lignes = readFileSync('voix/phrases.csv', 'utf8').trim().split('\n').slice(1);
  assert.ok(lignes.length > 3000);
  assert.ok(!lignes.some((l) => l.includes('${')));
  const ids = lignes.map((l) => l.split(';')[0]);
  assert.equal(new Set(ids).size, ids.length);
});

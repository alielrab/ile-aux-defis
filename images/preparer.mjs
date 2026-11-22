// Prépare les images du nouveau style (voir images/PLAN.md).
// 1. Dépose tes images d'origine dans images/originaux/, au nom de la liste : images/originaux/animaux/chat.png
// 2. Lance : node images/preparer.mjs
// Chaque image est réduite à la taille de images/liste.csv et convertie en WebP (avec ffmpeg), puis images/liste.js
// est réécrit : c'est la liste des images que l'app utilise à la place de ses dessins, et qu'elle garde hors ligne.
// Un voile presque transparent autour du sujet est effacé, les marges vides sont rognées, et une image n'est jamais agrandie.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const fichiers = (dossier, ext) => (existsSync(dossier) ? readdirSync(dossier, { recursive: true }).map((f) => String(f).replaceAll('\\', '/')).filter((f) => ext.test(f)) : []);
const tailles = Object.fromEntries(readFileSync('images/liste.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')).map(([, fichier, taille]) => [fichier, taille]));

for (const f of fichiers('images/originaux', /\.(png|jpe?g|webp)$/i)) {
  const cible = `images/${f.replace(/\.\w+$/, '')}.webp`, taille = tailles[cible];
  if (!taille) { console.log(`✖ ${f} : ce nom n'est pas dans images/liste.csv, image ignorée`); continue; }
  mkdirSync(dirname(cible), { recursive: true });
  // le cadre du sujet, d'après la transparence (rien si l'image n'a pas de fond transparent)
  const detecte = spawnSync('ffmpeg', ['-hide_banner', '-i', `images/originaux/${f}`, '-vf', 'alphaextract,bbox=min_val=56', '-frames:v', '1', '-f', 'null', '-'], { encoding: 'utf8' });
  const rogner = /\/(fond-|piece-)|^avatar\//.test(f) ? null : /crop=[\d:]+/.exec(detecte.stderr ?? '')?.[0]; // un fond d'île, une pièce ou un calque d'avatar n'est pas rogné : on y place des choses en parts de l'image
  const [l, h] = taille.split('x');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `images/originaux/${f}`,
    '-vf', `${rogner ? `format=rgba,lut=a='if(lt(val,56),0,val)',${rogner},` : ''}scale='min(${l},iw)':'min(${h},ih)':force_original_aspect_ratio=decrease`, '-c:v', 'libwebp', '-quality', '80', cible]);
  console.log(`✔ ${cible} (au plus ${taille}, ${Math.round(statSync(cible).size / 1024)} Ko)`);
}

const pretes = fichiers('images', /\.webp$/).map((f) => `images/${f}`).filter((f) => tailles[f]).sort(); // seulement les noms de la liste : un dossier déposé à côté ne compte pas
writeFileSync('images/liste.js', `// Fabriqué par images/preparer.mjs : ne pas modifier à la main.\nself.IMAGES = ${JSON.stringify(pretes, null, 1)};\n`);
console.log(`${pretes.length} image(s) dans l'app, ${Math.round(pretes.reduce((s, f) => s + statSync(f).size, 0) / 1024)} Ko en tout. Pense à changer VERSION dans sw.js avant la mise en ligne.`);

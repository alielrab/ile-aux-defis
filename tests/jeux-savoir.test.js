import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as dinos from '../js/jeux/dinos.js';
import * as passeport from '../js/jeux/passeport.js';
import * as urgences from '../js/jeux/urgences.js';
import * as route from '../js/jeux/route.js';
import * as musique from '../js/jeux/musique.js';
import * as tri from '../js/jeux/tri.js';
import * as chantier from '../js/jeux/chantier.js';
import * as confiance from '../js/jeux/confiance.js';
import { nouvellePartie } from '../js/partie.js';
import { graine } from './hasard.js';

test('musée : au moins 15 dinosaures, chacun avec ses 4 pièces, sa fiche et son « Le savais-tu ? »', () => {
  assert.ok(dinos.DINOS.length >= 15);
  assert.equal(new Set(dinos.DINOS.map((d) => d.cle)).size, dinos.DINOS.length);
  for (const d of dinos.DINOS) {
    const p = dinos.pieces(d);
    assert.deepEqual(Object.keys(p).sort(), [...dinos.PIECES].sort(), d.cle);
    for (const k of dinos.PIECES) assert.ok(p[k].includes('<path') || p[k].includes('<ellipse'), `${d.cle} ${k}`);
    assert.ok(d.savais && d.trait && d.longueur > 0 && d.ilya, d.cle);
    assert.match(dinos.fiche(d, 9), /mètres[\s\S]*pesait[\s\S]*vivait/);
    assert.match(dinos.dessinerSquelette(d, ['tete'], 'queue'), /a-remplir/);
  }
});

test('musée : quiz fait à partir des fiches ; 3 choix et pas de taille ni d’époque à 6 ans ; 4 choix à 9 ans', () => {
  for (const [age, n] of [[6, 3], [9, 4]]) {
    for (let g = 1; g < 15; g++) {
      for (const q of nouvellePartie(dinos.question, { age }, graine(g + age)).questions) {
        assert.equal(new Set(q.choix).size, n, q.titre);
        assert.ok(q.choix.includes(q.reponse) && q.savaisTu);
        if (age === 6) assert.match(q.texte, /^(regime|trait):/);
      }
    }
  }
});

test('passeport : 20 pays dont la Suisse et ses voisins ; 3 questions ; le tampon à 2 bonnes réponses, une seule fois', () => {
  assert.equal(passeport.PAYS.length, 20);
  for (const c of ['suisse', 'france', 'allemagne', 'italie', 'autriche', 'liechtenstein']) assert.ok(passeport.pays(c), c);
  for (const p of passeport.PAYS) for (const k of ['drapeau', 'capitale', 'savais', 'langue']) assert.ok(p[k], `${p.cle} ${k}`);
  for (const age of [6, 9]) {
    for (const p of passeport.PAYS) {
      const qs = passeport.questions(p.cle, age, graine(age));
      assert.equal(qs.length, 3);
      for (const q of qs) assert.ok(q.choix.length === (age === 6 ? 3 : 4) && new Set(q.choix).size === q.choix.length && q.choix.includes(q.reponse), `${p.cle} ${q.type}`);
      if (age === 6) assert.deepEqual(qs.map((q) => q.type), ['drapeau', 'animal', 'plat']);
    }
  }
  const profil = {};
  assert.equal(passeport.tamponner(profil, 'japon', 1), false);
  assert.equal(passeport.tamponner(profil, 'japon', 2), true);
  assert.equal(passeport.tamponner(profil, 'japon', 3), false);
  assert.deepEqual(profil.passeport, ['japon']);
  assert.match(passeport.dessinerCarte(['japon']), /class="avion"/);
});

test('urgences : 144, 117, 118 ; des situations pour chaque numéro et des cas qui ne sont pas des urgences ; quoi dire', () => {
  assert.deepEqual(urgences.NUMEROS.map((n) => n.numero), ['144', '117', '118']);
  for (const r of ['144', '117', '118', 'pas']) assert.ok(urgences.SITUATIONS.filter((s) => s[2] === r).length >= 3, r);
  assert.equal(urgences.QUOI_DIRE.length, 4);
  for (const age of [6, 9]) {
    for (let g = 1; g < 10; g++) {
      for (const q of nouvellePartie(urgences.question, { age }, graine(g)).questions) {
        assert.equal(q.choix.length, 4);
        assert.ok(q.choix.includes(q.reponse) && q.savaisTu, q.titre);
        if (q.mode === 'situation') assert.ok(q.image);
      }
    }
  }
  assert.ok(!urgences.SITUATIONS.some(([t]) => /mort|sang|tué|cadavre/i.test(t)), 'jamais effrayant');
});

test('centre de tri : 10 déchets différents, 4 poubelles dont la bonne ; les déchets des grands seulement dès 8 ans', () => {
  for (const d of tri.DECHETS) assert.ok(tri.POUBELLES.includes(d[1]) && d[2] && d[3], d[0]);
  const grands = new Set(tri.DECHETS.filter((d) => d[4]).map((d) => `Où va ${d[0]} ?`));
  for (const age of [6, 9]) {
    for (let g = 1; g < 10; g++) {
      const { questions } = nouvellePartie(tri.question, { age }, graine(g));
      assert.equal(new Set(questions.map((q) => q.texte)).size, 10);
      for (const q of questions) {
        assert.equal(new Set(q.choix).size, 4);
        assert.ok(q.choix.includes(q.reponse) && q.savaisTu && q.image, q.titre);
        if (age === 6) assert.ok(!grands.has(q.texte), q.titre);
      }
    }
  }
});

test('code de la route : 10 questions différentes, 4 choix, une image ; les questions des grands seulement dès 8 ans', () => {
  assert.equal(new Set(route.QUESTIONS.map((q) => q[0])).size, route.QUESTIONS.length);
  assert.ok(route.QUESTIONS.filter((q) => !q[5]).length >= 15);
  const grandes = new Set(route.QUESTIONS.filter((q) => q[5]).map((q) => q[0]));
  for (const age of [6, 9]) {
    for (let g = 1; g < 10; g++) {
      const { questions } = nouvellePartie(route.question, { age }, graine(g));
      assert.equal(new Set(questions.map((q) => q.texte)).size, 10);
      for (const q of questions) {
        assert.equal(new Set(q.choix).size, 4);
        assert.ok(q.choix.includes(q.reponse) && q.savaisTu && q.image, q.titre);
        if (age === 6) assert.ok(!grandes.has(q.texte), q.titre);
      }
    }
  }
});

test('musique : 8 notes du grave à l’aigu ; une note par temps, toucher encore l’enlève ; les silences ne sont pas joués', () => {
  assert.equal(musique.NOTES.length, 8);
  assert.ok(musique.NOTES.every((n, i) => i === 0 || n.frequence > musique.NOTES[i - 1].frequence));
  let m = musique.melodieVide();
  m = musique.basculer(m, 0, 0);
  m = musique.basculer(m, 2, 4);
  m = musique.basculer(m, 2, 7); // remplace le sol
  assert.deepEqual(m, [0, null, 7, null, null, null, null, null]);
  assert.deepEqual(musique.aJouer(m).map(([f, debut]) => [f, debut]), [[262, 0], [523, 2 * musique.DUREE]]);
  assert.deepEqual(musique.basculer(m, 0, 0)[0], null);
  assert.deepEqual(musique.aJouer([99, 'x', null]), []); // un enregistrement abîmé ne casse rien
});

test('grue folle : plus lent et plus tolérant à 6 ans ; étoiles par étage, record, pièces construites à la bonne hauteur', () => {
  assert.ok(chantier.vitesse(0, 6) < chantier.vitesse(0, 9) && chantier.vitesse(5, 9) > chantier.vitesse(0, 9));
  assert.equal(chantier.vitesse(100, 9), chantier.vitesse(1000, 9)); // la vitesse ne monte pas sans fin
  const ecart = chantier.LARGEUR * 0.7;
  assert.ok(chantier.tient(0, ecart, 6) && !chantier.tient(0, ecart, 9) && chantier.tient(10, -20, 9));
  const p = { age: 6, etoiles: 0, chantier: { record: 4, aConstruire: ['salon', 'jardin'] } };
  assert.deepEqual(chantier.finir(p, 6), { gain: 6, record: true, construites: ['salon'] }); // 5 étages pour le salon, 8 pour le jardin
  assert.deepEqual([p.etoiles, p.chantier], [6, { record: 6, aConstruire: ['jardin'] }]);
  const ancien = { age: 9, etoiles: 1 }; // un profil d'avant le chantier
  assert.deepEqual(chantier.finir(ancien, 3), { gain: 1.5, record: true, construites: [] });
  assert.deepEqual(chantier.finir(ancien, 2).record, false);
  assert.deepEqual(Object.keys(chantier.HAUTEURS).sort(), ['jardin', 'jeux', 'salon']); // toutes les pièces à vendre
});

test('maison de la confiance, fait ou avis : 6 phrases amusantes puis 2 blessantes ; jamais « faux » ; rien de trop dur à 6 ans', () => {
  assert.equal(confiance.PHRASES.filter((p) => p[1] === 'fait').length, confiance.PHRASES.filter((p) => p[1] === 'avis').length);
  for (const age of [6, 9]) {
    for (let g = 1; g < 10; g++) {
      const q = confiance.tri(age, graine(g));
      assert.equal(q.length, 8);
      assert.deepEqual(q.map((x) => x.blessante), [false, false, false, false, false, false, true, true]);
      assert.equal(new Set(q.map((x) => x.texte)).size, 8);
      if (age === 6) assert.ok(q.every((x) => !/lunettes|de la classe/.test(x.texte)), 'les faits dits pour se moquer : 8 ans et plus');
    }
  }
  const q = confiance.tri(9, graine(1))[0], autre = q.reponse === 'fait' ? 'avis' : 'fait';
  assert.match(confiance.retour(q, q.reponse), /^Oui !/);
  assert.match(confiance.retour(q, autre), /^C’est plutôt un (fait|avis)\./);
  assert.ok(![confiance.DOUCEUR, ...confiance.BLESSANTES.map((b) => b[2])].some((t) => /faux|mauvaise réponse|perdu/i.test(t)));
  const r = confiance.recre(graine(3));
  assert.deepEqual(r.map((s) => s.seRepete), [false, false, true]); // la situation qui se répète vient en dernier
  assert.match(confiance.quandCaSeRepete(9), /harcèlement/);
  assert.doesNotMatch(confiance.quandCaSeRepete(6), /harcèlement/);
  assert.ok(confiance.SITUATIONS.every(([t]) => /^Imagine : /.test(t) && / (te|ton|tes|tu) /.test(t) && !/Léo|Sami|Inès|Noé|Lina|Malik|Aya/.test(t)), 'on s’adresse à l’enfant, sans aucun prénom');
  assert.ok(confiance.SITUATIONS.length >= 15 && confiance.SITUATIONS.filter((s) => s[1]).length >= 3);
  assert.equal(new Set(confiance.SITUATIONS.map((s) => s[0])).size, confiance.SITUATIONS.length);
  assert.equal(confiance.REACTIONS.length, 4);
  assert.match(confiance.FIN, /147/);
  assert.deepEqual(confiance.THEMES.filter((t) => t.ouvert).map((t) => t.cle), ['fait-avis', 'emotions', 'droits']); // un thème à la fois, relu avant d'ouvrir
});

test('maison de la confiance, mes émotions : le message de chaque émotion, le oui et le non, les quatre gestes ; jamais « faux »', async () => {
  const { EMOTIONS } = await import('../js/jeux/emotions.js');
  for (const [age, n, choix] of [[6, 5, 3], [9, 6, 4]]) {
    const m = confiance.messages(age, graine(age));
    assert.equal(m.length, n); // la gêne : 8 ans et plus
    for (const q of m) {
      assert.ok(EMOTIONS[q.emotion], q.emotion); // un visage existe
      assert.equal(new Set(q.choix).size, choix);
      assert.ok(q.choix.includes(q.reponse));
      assert.match(confiance.retourMessage(q, q.reponse), /^Oui !/);
      assert.match(confiance.retourMessage(q, q.choix.find((c) => c !== q.reponse)), /^Son message, c’est plutôt/);
    }
  }
  const o = confiance.ouiNon(graine(2));
  assert.equal(new Set(o.map((q) => q.texte)).size, 8);
  assert.ok(confiance.OUI_NON.filter((q) => q[1] === 'oui').length >= 4 && confiance.OUI_NON.filter((q) => q[1] === 'non').length >= 4);
  assert.match(confiance.retourOuiNon(o[0], o[0].reponse === 'oui' ? 'non' : 'oui'), /^Chacun ressent les choses à sa façon/);
  assert.equal(confiance.GESTES.length, 4);
  assert.equal(confiance.quandNon(graine(1)).length, 3);
  const tout = [confiance.DOUCEUR_ATTENDRE, confiance.FIN_EMOTIONS, ...confiance.OUI_NON.map((q) => q[2]), ...confiance.MESSAGES.map((m) => m[3])].join(' ');
  assert.doesNotMatch(tout, /faux|mauvaise réponse|perdu|bisou/i); // le bisou obligé et le corps : gardés pour le thème 5
});

test('maison de la confiance, mes droits : droit ou envie, le droit respecté, les quatre idées ; le respect pour tous les âges', () => {
  const t = confiance.droitOuEnvie(graine(1));
  assert.equal(new Set(t.map((q) => q.texte)).size, 8);
  assert.match(confiance.retourDroitEnvie(t[0], t[0].reponse), /^Oui !/);
  assert.match(confiance.retourDroitEnvie(t[0], t[0].reponse === 'droit' ? 'envie' : 'droit'), /^C’est plutôt une? (droit|envie)\./);
  assert.ok(confiance.RESPECTES.every(([, d]) => confiance.DROITS[d]) && new Set(confiance.RESPECTES.map((r) => r[1])).size === Object.keys(confiance.DROITS).length);
  let respectA6 = false;
  for (const [age, choix] of [[6, 3], [9, 4]]) {
    for (let g = 1; g < 12; g++) {
      const qs = confiance.respectes(age, graine(g));
      assert.equal(qs.length, 6);
      for (const q of qs) {
        assert.equal(new Set(q.choix).size, choix);
        assert.ok(q.choix.includes(q.reponse));
        if (age === 6) { assert.ok(!q.choix.includes('secret'), 'le jardin secret : 8 ans et plus'); respectA6 ||= q.choix.includes('respect'); }
        assert.match(confiance.retourRespecte(q, q.reponse), /^Oui ! J’/);
      }
    }
  }
  assert.ok(respectA6, 'être respecté comme je suis : pour tous les âges');
  assert.equal(confiance.IDEES_DROITS.length, 4);
  assert.equal(confiance.pasRespectes(6, graine(2)).length, 3);
  assert.ok(confiance.pasRespectes(6, graine(2)).every((s) => !/journal/.test(s.texte)));
  assert.match(confiance.FIN_DROITS, /147/);
  assert.doesNotMatch([confiance.DOUCEUR_NORMAL, ...confiance.DROIT_ENVIE.map((q) => q[2])].join(' '), /faux|mauvaise réponse|perdu/i);
});

test('mots de voyage : 6 mots par pays, dans l’ordre bonjour… s’il te plaît, débloqués par le tampon', () => {
  for (const p of passeport.PAYS) {
    const m = passeport.MOTS[p.cle];
    assert.ok(m && m.langue && /^[a-z]{2}-[A-Z]{2}$/.test(m.lang), p.cle);
    assert.deepEqual(m.mots.map((x) => x.fr), passeport.MOTS_FR, p.cle);
    for (const x of m.mots) assert.ok(x.mot && x.dire, `${p.cle} ${x.fr}`);
  }
  const profil = { passeport: [] };
  assert.equal(passeport.motsDebloques(profil), 0);
  passeport.tamponner(profil, 'japon', 3);
  assert.equal(passeport.motsDebloques(profil), 6);
});

# Découpe le fichier audio de chaque lot en une phrase par fichier, et vérifie que la voix a bien dit le texte.
# Tourne dans le bac à sable Higgsfield (faster-whisper et ffmpeg y sont installés), à côté de envoi-N.json (écrit par voix/lots.mjs)
# et des audios audio/eN-<index>.mp3 :   python3 aligner.py envoi-N.json   ->   pret/<clé>.mp3 et rapport-N.json (les phrases refusées)
# Une phrase est refusée si ce qu'on entend dans son morceau ne ressemble pas assez au texte : elle sera refaite au prochain envoi.
import sys, json, re, os, subprocess, unicodedata, difflib
from faster_whisper import WhisperModel

PETITS = 'zéro un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize dix-sept dix-huit dix-neuf'.split()
DIZAINES = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt']
def lettres(n):  # comme enLettres dans voix/lots.mjs : la reconnaissance écrit souvent « 7 » quand la voix dit « sept »
    if n < 20: return PETITS[n]
    if n < 100:
        d, u = divmod(n, 10); r = u + 10 if d in (7, 9) else u
        if r == 0: return DIZAINES[d]
        return DIZAINES[d] + (' et ' if r in (1, 11) and d < 8 else '-') + PETITS[r]
    if n < 1000:
        c, r = divmod(n, 100); return (PETITS[c] + ' ' if c > 1 else '') + 'cent' + (' ' + lettres(r) if r else '')
    if n < 1000000:
        m, r = divmod(n, 1000); return (lettres(m) + ' ' if m > 1 else '') + 'mille' + (' ' + lettres(r) if r else '')
    return str(n)
def norm(w):
    w = re.sub(r'\d+', lambda m: lettres(int(m.group())) if len(m.group()) < 7 else m.group(), w.lower())
    w = unicodedata.normalize('NFD', w.replace('œ', 'oe'))
    return re.sub(r'[^a-z0-9]', '', ''.join(c for c in w if unicodedata.category(c) != 'Mn'))

envoi = sys.argv[1]; n = re.search(r'(\d+)', os.path.basename(envoi)).group(1)
donnees = json.load(open(envoi)); os.makedirs('pret', exist_ok=True)
model = WhisperModel('small', device='cpu', compute_type='int8')
refus, faits = [], 0
for req in donnees['requests']:
    idx = req['index']; audio = f'audio/e{n}-{idx}.mp3'; cles = donnees['cles'][str(idx)]
    tours = [t['text'] for t in req['params']['dialogue']]
    if not os.path.exists(audio): refus += [[idx, i, 0, t, 'pas de fichier audio'] for i, t in enumerate(tours)]; continue
    exp, debut_tour = [], []
    for t in tours:
        debut_tour.append(len(exp)); exp += [x for x in (norm(w) for w in t.split()) if x]
    segs, info = model.transcribe(audio, language='fr', word_timestamps=True, condition_on_previous_text=False)
    duree = info.duration; rec = []  # les mots entendus : [texte normalisé, début, fin]
    for s in segs:
        if 'sous-titres' in s.text.lower() or 'amara' in s.text.lower(): continue  # une phrase que la reconnaissance invente sur du silence
        for w in s.words:
            m = w.word.strip()
            if rec and (m[:1] in "'’-" or rec[-1][3][-1:] in "'’-"): rec[-1] = [rec[-1][0] + norm(m), rec[-1][1], w.end, rec[-1][3] + m]  # « l » + « 'eau » = un seul mot
            elif norm(m): rec.append([norm(m), w.start, w.end, m])
    j = subprocess.run(['ffmpeg', '-hide_banner', '-i', audio, '-af', 'silencedetect=noise=-35dB:d=0.1', '-f', 'null', '-'], capture_output=True, text=True).stderr
    sd = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', j)]; se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', j)]
    sil = list(zip(sd, se + [duree] * (len(sd) - len(se))))
    carte = {}
    for a, b, taille in difflib.SequenceMatcher(None, exp, [r[0] for r in rec], autojunk=False).get_matching_blocks():
        for k in range(taille): carte[a + k] = b + k
    coupes, d = [], 0.0
    if sil and sil[0][0] < 0.05: d = max(0.0, sil[0][1] - 0.04)
    for k in debut_tour[1:]:  # la frontière avant le premier mot du tour suivant
        if k - 1 in carte and k in carte and carte[k] == carte[k - 1] + 1: r = carte[k]
        else:  # mots mal reconnus autour : le plus grand trou entre les deux mots sûrs les plus proches
            avant = max([i for i in carte if i < k], default=None); apres = min([i for i in carte if i >= k], default=None)
            ra = carte[avant] if avant is not None else -1; rb = carte[apres] if apres is not None else len(rec)
            r = max(range(ra + 1, rb + 1), key=lambda x: (rec[x][1] if x < len(rec) else duree) - (rec[x - 1][2] if x > 0 else 0)) if rb > ra else rb
        g0 = rec[r - 1][2] if r > 0 else 0.0; g1 = rec[r][1] if r < len(rec) else duree
        proches = [s for s in sil if s[1] > g0 - 0.15 and s[0] < g1 + 0.15]
        if proches:
            s = max(proches, key=lambda s: min(s[1], g1 + 0.15) - max(s[0], g0 - 0.15))
            fin, suiv = min(s[0] + 0.12, s[1]), max(s[1] - 0.04, s[0])
        else: fin = suiv = (g0 + g1) / 2
        coupes.append([d, fin]); d = suiv
    coupes.append([d, min(duree, sil[-1][0] + 0.15) if sil and sil[-1][1] >= duree - 0.05 else duree])
    for i, (t, (a, b)) in enumerate(zip(tours, coupes)):
        entendu = [w for w in rec if a <= (w[1] + w[2]) / 2 <= b]
        score = difflib.SequenceMatcher(None, norm(t), ''.join(w[0] for w in entendu), autojunk=False).ratio()
        rythme = (b - a) / max(1, len(t))  # secondes par lettre
        if score < 0.85 or not 0.03 <= rythme <= 0.3: refus.append([idx, i, round(score, 2), t, ' '.join(w[3] for w in entendu)]); continue
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', audio, '-ac', '1', '-ar', '24000', '-b:a', '40k', f'pret/{cles[i]}.mp3'], check=True)
        faits += 1
    print(idx, len(tours), 'phrases', flush=True)
json.dump(refus, open(f'rapport-{n}.json', 'w'), ensure_ascii=False)
print(f'{faits} phrases prêtes, {len(refus)} refusées', flush=True)

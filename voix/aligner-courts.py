# Découpe un lot de mots courts (1 ou 2 mots par phrase) d'après les silences seulement : la reconnaissance vocale se trompe trop sur un mot seul.
# On garde un lot seulement si on entend exactement autant de morceaux que de phrases demandées ; sinon tout le lot est refusé.
# Tourne à côté de envoi-N.json et de audio/eN-<index>.mp3, comme aligner.py :  python3 aligner-courts.py envoi-N.json [--tout]
# Sans --tout, on ne refait que les phrases refusées par aligner.py (rapport-N.json).
import sys, json, re, os, subprocess

envoi = sys.argv[1]; n = re.search(r'(\d+)', os.path.basename(envoi)).group(1)
donnees = json.load(open(envoi)); os.makedirs('pret', exist_ok=True)
refusees = None if '--tout' in sys.argv or not os.path.exists(f'rapport-{n}.json') else {(r[0], r[1]) for r in json.load(open(f'rapport-{n}.json'))}
reste, faits = [], 0

def morceaux(audio, d):
    j = subprocess.run(['ffmpeg', '-hide_banner', '-i', audio, '-af', f'silencedetect=noise=-35dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    duree = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio], capture_output=True, text=True).stdout)
    sd = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', j)]; se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', j)]
    sil = list(zip(sd, se + [duree] * (len(sd) - len(se))))
    voix, t = [], 0.0
    for a, b in sil:
        if a - t > 0.08: voix.append([t, a])
        t = b
    if duree - t > 0.08: voix.append([t, duree])
    return voix, duree

for req in donnees['requests']:
    idx = req['index']; audio = f'audio/e{n}-{idx}.mp3'; cles = donnees['cles'][str(idx)]
    tours = [t['text'] for t in req['params']['dialogue']]
    if not os.path.exists(audio): reste += [[idx, i, t, 'pas de fichier audio'] for i, t in enumerate(tours)]; continue
    bon = None
    for d in (0.2, 0.28, 0.14, 0.36):
        voix, duree = morceaux(audio, d)
        if len(voix) == len(tours) and all(0.03 <= (b - a) / max(1, len(t)) <= 0.4 for (a, b), t in zip(voix, tours)): bon = voix; break
    if not bon: reste += [[idx, i, t, f'{len(voix)} morceaux pour {len(tours)} phrases'] for i, t in enumerate(tours)]; continue
    for i, (a, b) in enumerate(bon):
        if refusees is not None and (idx, i) not in refusees: continue
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, a - 0.04):.3f}', '-to', f'{min(duree, b + 0.12):.3f}', '-i', audio, '-ac', '1', '-ar', '24000', '-b:a', '40k', f'pret/{cles[i]}.mp3'], check=True)
        faits += 1
json.dump(reste, open(f'reste-{n}.json', 'w'), ensure_ascii=False)
print(f'{faits} phrases prêtes par les silences, {len(reste)} encore refusées', flush=True)

#!/bin/bash
# Fabrique un calque d'avatar à partir de l'image entière renvoyée par Higgsfield (le personnage de base, modifié) :
# on garde ce qui a changé par rapport au personnage de base. Le résultat va dans images/originaux/avatar/<nom>.png, puis node images/preparer.mjs.
# calque.sh <plein.png> <sortie.png> [seuil] [1 = ajouter la zone des habits beiges (tenues), 0 = non (chaussures, chapeaux)]
T="$(dirname "$0")/avatar-base" # maitre.png : le personnage de base ; beige-base.png : la zone des habits beiges
ffmpeg -y -loglevel error -i "$1" -i "$T/maitre.png" -i "$T/beige-base.png" -filter_complex "
[0]scale=768:1024,format=rgba,split=3[p1][p2][p3];[p2]alphaextract,format=gray,lut=y='if(gt(val,40),val,0)'[A];
[p1]format=rgb24[prgb];[1]scale=768:1024,format=rgb24[b];
[prgb][b]blend=all_mode=difference,colorchannelmixer=rr=1:rg=1:rb=1:gr=1:gg=1:gb=1:br=1:bg=1:bb=1,format=gray,lut=y='if(gt(val,${3:-48}),255,0)'[D];
[2]scale=768:1024,format=rgba,alphaextract,format=gray,lut=y='val*${4:-1}'[R];[D][R]blend=all_mode=lighten[DR];[DR]erosion,dilation,dilation,erosion[C];
[C][A]blend=all_mode=darken,gblur=sigma=0.6,format=gray[M];[p3]format=rgb24[c];[c][M]alphamerge" -frames:v 1 "$2"

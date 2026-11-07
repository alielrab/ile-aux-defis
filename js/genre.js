// Fille ou garçon : on le choisit à la création du profil. Les textes s'accordent avec des marques « {masculin|féminin} » :
// « Tu es trop {fort|forte} ! » → « Tu es trop fort ! » pour un garçon, « Tu es trop forte ! » pour une fille.
// Les objets des boutiques restent les mêmes pour tous : seuls les textes et l'avatar de départ changent.
export const GENRES = { fille: 'une fille', garcon: 'un garçon' };
export const accorder = (texte, genre) => String(texte ?? '').replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, masculin, feminin) => (genre === 'garcon' ? masculin : feminin));

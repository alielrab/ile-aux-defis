// Hasard reproductible pour les tests (pas un fichier de test : node --test ne le lance pas seul).
export function graine(n) {
  return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648);
}

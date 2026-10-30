/**
 * Wrap a word -> phoneme-string map in a case-insensitive lookup.
 * The stored value is a space-separated phoneme string (e.g. "K AE T");
 * lookup returns it as an array, or null when the word is unknown.
 * @param {Record<string,string>} entries
 * @returns {{ lookup(word: string): string[] | null }}
 */
export function createDictionary(entries) {
  return {
    lookup(word) {
      const value = entries[String(word).toLowerCase()];
      if (value === undefined) return null;
      return value.split(' ').filter(Boolean);
    },
  };
}

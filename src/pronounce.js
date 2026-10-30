import { soundOut } from './g2p.js?v=20261029a';

// Longest name we'll process. Guards the generator against combinatorial
// blow-up on absurd input.
export const MAX_NAME_LEN = 30;

// Token inserted between words so the generator can re-emit the space and
// capitalize each word. It is not a real ARPABET phoneme.
export const WORD_BREAK = ' ';

/**
 * Turn a name into stressless ARPABET phonemes: dictionary first, then the
 * grapheme-to-phoneme fallback, word by word. The name is truncated to
 * MAX_NAME_LEN and words are separated by WORD_BREAK tokens. `source` is
 * 'dict' only when every word was found in the dictionary.
 * @param {string} name
 * @param {{ lookup(word: string): string[] | null }} dict
 * @returns {{ phonemes: string[], source: 'dict' | 'soundout' }}
 */
export function pronounce(name, dict) {
  const trimmed = String(name).trim().slice(0, MAX_NAME_LEN);
  if (!trimmed) return { phonemes: [], source: 'soundout' };

  const words = trimmed.split(/\s+/);
  const phonemes = [];
  let allFromDict = true;

  words.forEach((word, i) => {
    if (i > 0) phonemes.push(WORD_BREAK);
    const fromDict = dict.lookup(word);
    if (fromDict && fromDict.length > 0) {
      phonemes.push(...fromDict);
    } else {
      allFromDict = false;
      phonemes.push(...soundOut(word));
    }
  });

  return { phonemes, source: allFromDict ? 'dict' : 'soundout' };
}

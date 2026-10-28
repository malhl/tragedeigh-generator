import { soundOut } from './g2p.js';

// Longest name we'll process. Guards the generator against combinatorial
// blow-up on absurd input.
export const MAX_NAME_LEN = 30;

/**
 * Turn a name into stressless ARPABET phonemes: dictionary first, then the
 * grapheme-to-phoneme fallback. The name is truncated to MAX_NAME_LEN first.
 * @param {string} name
 * @param {{ lookup(word: string): string[] | null }} dict
 * @returns {{ phonemes: string[], source: 'dict' | 'soundout' }}
 */
export function pronounce(name, dict) {
  const trimmed = String(name).slice(0, MAX_NAME_LEN);
  const fromDict = dict.lookup(trimmed);
  if (fromDict && fromDict.length > 0) {
    return { phonemes: fromDict, source: 'dict' };
  }
  return { phonemes: soundOut(trimmed), source: 'soundout' };
}

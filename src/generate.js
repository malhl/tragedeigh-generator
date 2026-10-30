import { spellingsFor } from './arpabet.js';
import { WORD_BREAK } from './pronounce.js';

// A tiny binary max-heap keyed by numeric `score`.
class MaxHeap {
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(item) {
    const a = this.items;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (a[parent].score >= a[i].score) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      i = parent;
    }
  }
  pop() {
    const a = this.items;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let largest = i;
        if (l < a.length && a[l].score > a[largest].score) largest = l;
        if (r < a.length && a[r].score > a[largest].score) largest = r;
        if (largest === i) break;
        [a[largest], a[i]] = [a[i], a[largest]];
        i = largest;
      }
    }
    return top;
  }
}

function capitalizeWords(text) {
  return text.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

// A word break contributes a literal space and nothing to the score.
const BREAK_OPTION = { spelling: ' ', weight: 0, sources: [] };

/**
 * @typedef {{phoneme: string, spelling: string, weight: number, sources: string[]}} Part
 * @typedef {{spelling: string, score: number, parts: Part[]}} Result
 */

/**
 * Enumerate the highest-scoring respellings of a name without generating every
 * permutation. Each phoneme's spelling options (from spellingsFor) are sorted
 * most-obscure first; a best-first search over the index lattice emits
 * combinations in descending total weight. The exact input spelling and any
 * duplicate output spellings are skipped.
 *
 * @param {string} name
 * @param {string[]} phonemes
 * @param {{limit?: number}} [opts]
 * @returns {Result[]}
 */
export function generateTragedeighs(name, phonemes, opts = {}) {
  const limit = opts.limit ?? 100;
  if (!phonemes || phonemes.length === 0) return [];

  const optionsPerPhoneme = phonemes.map((p) =>
    p === WORD_BREAK ? [BREAK_OPTION] : spellingsFor(p),
  );
  const target = String(name).toLowerCase();

  const scoreOf = (choice) =>
    choice.reduce((sum, idx, p) => sum + optionsPerPhoneme[p][idx].weight, 0);

  const heap = new MaxHeap();
  const start = new Array(phonemes.length).fill(0);
  const visited = new Set([start.join(',')]);
  heap.push({ choice: start, score: scoreOf(start) });

  const results = [];
  const seenSpellings = new Set();

  while (heap.size > 0 && results.length < limit) {
    const { choice, score } = heap.pop();

    const parts = choice.map((idx, p) => {
      const o = optionsPerPhoneme[p][idx];
      return { phoneme: phonemes[p].replace(/\d+$/, ''), spelling: o.spelling, weight: o.weight, sources: o.sources };
    });
    const spelling = capitalizeWords(parts.map((pt) => pt.spelling).join(''));

    if (spelling.toLowerCase() !== target && !seenSpellings.has(spelling)) {
      seenSpellings.add(spelling);
      results.push({ spelling, score, parts });
    }

    // Push neighbors: step one phoneme to its next (lower- or equal-weight) option.
    for (let p = 0; p < choice.length; p++) {
      const next = choice[p] + 1;
      if (next < optionsPerPhoneme[p].length) {
        const neighbor = choice.slice();
        neighbor[p] = next;
        const key = neighbor.join(',');
        if (!visited.has(key)) {
          visited.add(key);
          heap.push({ choice: neighbor, score: scoreOf(neighbor) });
        }
      }
    }
  }

  return results;
}

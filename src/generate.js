import { spellingsFor } from './arpabet.js?v=20261029b';
import { WORD_BREAK } from './pronounce.js?v=20261029b';

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
 * Greedily align the input's own spelling to its sounds, so we know how each
 * sound is already written. Returns the grapheme per phoneme (null for word
 * breaks), or all-null if the spelling can't be fully explained by the known
 * spellings — in which case nothing is excluded.
 * @param {string} name
 * @param {string[]} phonemes
 * @returns {Array<string|null>}
 */
export function inputGraphemes(name, phonemes) {
  const list = phonemes || [];
  const none = () => new Array(list.length).fill(null);
  const text = String(name).toLowerCase();
  const graphemes = none();
  let pos = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] === WORD_BREAK) {
      while (pos < text.length && /\s/.test(text[pos])) pos += 1;
      continue;
    }
    const candidates = spellingsFor(list[i])
      .map((o) => o.spelling)
      .sort((a, b) => b.length - a.length); // longest match first
    const match = candidates.find((s) => text.startsWith(s, pos));
    if (match === undefined) return none();
    graphemes[i] = match;
    pos += match.length;
  }
  return pos === text.length ? graphemes : none();
}

// A sound's spelling options, minus the way the input already spells it — but
// never emptied (if that was the only option, keep it).
function optionsFor(phoneme, excludeSpelling) {
  const opts = spellingsFor(phoneme);
  if (!excludeSpelling) return opts;
  const filtered = opts.filter((o) => o.spelling !== excludeSpelling);
  return filtered.length ? filtered : opts;
}

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

  const graphemes = inputGraphemes(name, phonemes);
  const optionsPerPhoneme = phonemes.map((p, i) =>
    p === WORD_BREAK ? [BREAK_OPTION] : optionsFor(p, graphemes[i]),
  );
  const target = String(name).toLowerCase();

  // Diversity: every kept result must differ from every other kept result in
  // at least `minDiff` sounds, so the list isn't one base name with a single
  // sound nudged. Relax to the number of real sounds so short names (which
  // can't differ in 2 positions) still return results.
  const soundCount = phonemes.filter((p) => p !== WORD_BREAK).length;
  const minDiff = Math.max(1, Math.min(opts.minDiff ?? 1, soundCount));
  const differsEnough = (parts) =>
    results.every((kept) => {
      let diff = 0;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].spelling !== kept.parts[i].spelling) diff += 1;
      }
      return diff >= minDiff;
    });

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

    if (spelling.toLowerCase() !== target && !seenSpellings.has(spelling) && differsEnough(parts)) {
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

/**
 * The ghoti-style per-sound menu: one entry per real sound (word breaks
 * skipped), each with all the ways to spell it and the words that justify them.
 * @param {string[]} phonemes
 * @returns {Array<{phoneme: string, options: Array<{spelling: string, weight: number, sources: string[]}>}>}
 */
export function buildBreakdown(phonemes, name = '') {
  const graphemes = inputGraphemes(name, phonemes);
  return (phonemes || [])
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p !== WORD_BREAK)
    .map(({ p, i }) => ({
      phoneme: p.replace(/\d+$/, ''),
      options: optionsFor(p, graphemes[i]),
    }));
}

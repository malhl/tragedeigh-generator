// A pragmatic rule-based grapheme-to-phoneme fallback for names the
// dictionary doesn't know. It is deliberately "close enough" — the whole
// point of a tragedeigh is playful, not phonetically exact.
//
// Each entry maps a grapheme to one or more ARPABET phonemes. The scanner
// tries the longest grapheme that matches at the current position, so
// multi-letter graphemes ('sh', 'eigh') win over their single letters.

const GRAPHEME_MAP = {
  // 4+ letters
  eigh: ['EY'],
  ough: ['AO'],
  // 3 letters
  igh: ['AY'],
  tch: ['CH'],
  sch: ['SH'],
  // 2 letters — vowel teams
  ai: ['EY'],
  ay: ['EY'],
  ea: ['IY'],
  ee: ['IY'],
  ie: ['IY'],
  oa: ['OW'],
  oo: ['UW'],
  ou: ['AW'],
  ow: ['AW'],
  oy: ['OY'],
  oi: ['OY'],
  au: ['AO'],
  aw: ['AO'],
  ew: ['UW'],
  ue: ['UW'],
  // 2 letters — r-controlled
  ar: ['AA', 'R'],
  er: ['ER'],
  ir: ['ER'],
  ur: ['ER'],
  or: ['AO', 'R'],
  // 2 letters — consonant digraphs
  sh: ['SH'],
  ch: ['CH'],
  th: ['TH'],
  ph: ['F'],
  gh: ['G'],
  ck: ['K'],
  ng: ['NG'],
  qu: ['K', 'W'],
  wh: ['W'],
  kn: ['N'],
  wr: ['R'],
  // single vowels
  a: ['AE'],
  e: ['EH'],
  i: ['IH'],
  o: ['AA'],
  u: ['AH'],
  // single consonants
  b: ['B'],
  c: ['K'],
  d: ['D'],
  f: ['F'],
  g: ['G'],
  h: ['HH'],
  j: ['JH'],
  k: ['K'],
  l: ['L'],
  m: ['M'],
  n: ['N'],
  p: ['P'],
  q: ['K'],
  r: ['R'],
  s: ['S'],
  t: ['T'],
  v: ['V'],
  w: ['W'],
  x: ['K', 'S'],
  y: ['Y'],
  z: ['Z'],
};

// Graphemes sorted longest-first so the scanner greedily matches the longest.
const GRAPHEMES = Object.keys(GRAPHEME_MAP).sort((a, b) => b.length - a.length);

/**
 * Sound a name out from its spelling into stressless ARPABET phonemes.
 * Lowercases input and strips anything that isn't a–z. Unmatched letters are skipped.
 * @param {string} name
 * @returns {string[]}
 */
export function soundOut(name) {
  const letters = String(name).toLowerCase().replace(/[^a-z]/g, '');
  const phonemes = [];
  let i = 0;
  while (i < letters.length) {
    let matched = null;
    for (const g of GRAPHEMES) {
      if (letters.startsWith(g, i)) {
        matched = g;
        break;
      }
    }
    if (matched) {
      phonemes.push(...GRAPHEME_MAP[matched]);
      i += matched.length;
    } else {
      i += 1; // unknown letter; skip it
    }
  }
  return phonemes;
}

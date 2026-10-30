// ARPABET phoneme -> the English ways to spell that sound.
// weight: how obscure/cursed the spelling is (1 = ordinary, higher = more unhinged).
// sources: common everyday words where that spelling makes that sound, most-common first.
// The data is intentionally unsorted; spellingsFor() sorts by weight descending.

export const SPELLINGS = {
  // ---- Vowels ----
  AA: [
    { spelling: 'o', weight: 1, sources: ['hot', 'top'] },
    { spelling: 'a', weight: 1, sources: ['father', 'spa'] },
    { spelling: 'ah', weight: 3, sources: ['bah', 'hurrah'] },
  ],
  AE: [
    { spelling: 'a', weight: 1, sources: ['cat', 'man'] },
    { spelling: 'ai', weight: 5, sources: ['plaid'] },
    { spelling: 'au', weight: 6, sources: ['laugh'] },
  ],
  AH: [
    { spelling: 'u', weight: 1, sources: ['hut', 'sun'] },
    { spelling: 'a', weight: 1, sources: ['about', 'sofa'] },
    { spelling: 'o', weight: 3, sources: ['son', 'ton'] },
    { spelling: 'e', weight: 3, sources: ['the', 'taken'] },
    { spelling: 'ou', weight: 5, sources: ['touch', 'young'] },
    { spelling: 'oo', weight: 6, sources: ['blood', 'flood'] },
  ],
  AO: [
    { spelling: 'o', weight: 1, sources: ['dog', 'off'] },
    { spelling: 'aw', weight: 2, sources: ['saw', 'draw'] },
    { spelling: 'au', weight: 2, sources: ['haul', 'fault'] },
    { spelling: 'a', weight: 3, sources: ['ball', 'tall'] },
    { spelling: 'oa', weight: 5, sources: ['broad'] },
    { spelling: 'augh', weight: 7, sources: ['caught', 'taught'] },
    { spelling: 'ough', weight: 7, sources: ['bought', 'thought'] },
  ],
  AW: [
    { spelling: 'ow', weight: 1, sources: ['cow', 'now'] },
    { spelling: 'ou', weight: 2, sources: ['out', 'loud'] },
    { spelling: 'ough', weight: 8, sources: ['bough', 'drought'] },
  ],
  AY: [
    { spelling: 'i', weight: 1, sources: ['hide', 'time'] },
    { spelling: 'y', weight: 2, sources: ['my', 'sky'] },
    { spelling: 'ie', weight: 4, sources: ['pie', 'tie'] },
    { spelling: 'ai', weight: 5, sources: ['aisle'] },
    { spelling: 'ye', weight: 5, sources: ['dye', 'rye'] },
    { spelling: 'igh', weight: 6, sources: ['high', 'sigh'] },
    { spelling: 'uy', weight: 7, sources: ['buy', 'guy'] },
    { spelling: 'eigh', weight: 8, sources: ['height', 'sleight'] },
  ],
  EH: [
    { spelling: 'e', weight: 1, sources: ['red', 'bed'] },
    { spelling: 'ea', weight: 3, sources: ['bread', 'head'] },
    { spelling: 'a', weight: 4, sources: ['many', 'any'] },
    { spelling: 'ai', weight: 5, sources: ['said'] },
    { spelling: 'ie', weight: 6, sources: ['friend'] },
    { spelling: 'eo', weight: 8, sources: ['leopard'] },
  ],
  ER: [
    { spelling: 'er', weight: 1, sources: ['her', 'term'] },
    { spelling: 'ur', weight: 1, sources: ['hurt', 'turn'] },
    { spelling: 'ir', weight: 2, sources: ['bird', 'girl'] },
    { spelling: 'or', weight: 3, sources: ['word', 'work'] },
    { spelling: 'ear', weight: 4, sources: ['earth', 'learn'] },
    { spelling: 'our', weight: 6, sources: ['journey', 'courtesy'] },
    { spelling: 'yr', weight: 7, sources: ['myrtle', 'myrrh'] },
  ],
  EY: [
    { spelling: 'a', weight: 1, sources: ['able', 'lady'] },
    { spelling: 'ay', weight: 2, sources: ['day', 'play'] },
    { spelling: 'ai', weight: 2, sources: ['rain', 'wait'] },
    { spelling: 'ey', weight: 3, sources: ['they', 'grey'] },
    { spelling: 'ei', weight: 4, sources: ['vein', 'rein'] },
    { spelling: 'ea', weight: 5, sources: ['steak', 'great'] },
    { spelling: 'ae', weight: 6, sources: ['sundae', 'reggae'] },
    { spelling: 'et', weight: 7, sources: ['ballet', 'buffet'] },
    { spelling: 'eigh', weight: 8, sources: ['eight', 'weigh', 'sleigh'] },
  ],
  IH: [
    { spelling: 'i', weight: 1, sources: ['it', 'pin'] },
    { spelling: 'y', weight: 2, sources: ['gym', 'myth'] },
    { spelling: 'e', weight: 4, sources: ['pretty', 'wicked'] },
    { spelling: 'u', weight: 5, sources: ['busy', 'minute'] },
    { spelling: 'ui', weight: 6, sources: ['build', 'guild'] },
    { spelling: 'o', weight: 7, sources: ['women'] },
  ],
  IY: [
    { spelling: 'ee', weight: 1, sources: ['see', 'tree'] },
    { spelling: 'ea', weight: 1, sources: ['eat', 'sea'] },
    { spelling: 'e', weight: 2, sources: ['me', 'be'] },
    { spelling: 'y', weight: 2, sources: ['happy', 'baby'] },
    { spelling: 'ie', weight: 3, sources: ['chief', 'field'] },
    { spelling: 'i', weight: 3, sources: ['ski', 'kiwi'] },
    { spelling: 'ei', weight: 4, sources: ['seize', 'protein'] },
    { spelling: 'ey', weight: 4, sources: ['key', 'money'] },
    { spelling: 'ae', weight: 6, sources: ['algae', 'larvae'] },
    { spelling: 'eo', weight: 8, sources: ['people'] },
  ],
  OW: [
    { spelling: 'o', weight: 1, sources: ['go', 'no'] },
    { spelling: 'oa', weight: 2, sources: ['boat', 'road'] },
    { spelling: 'ow', weight: 2, sources: ['snow', 'grow'] },
    { spelling: 'oe', weight: 4, sources: ['toe', 'foe'] },
    { spelling: 'ew', weight: 5, sources: ['sew'] },
    { spelling: 'ough', weight: 7, sources: ['dough', 'though'] },
    { spelling: 'eau', weight: 8, sources: ['bureau', 'plateau'] },
  ],
  OY: [
    { spelling: 'oy', weight: 1, sources: ['toy', 'boy'] },
    { spelling: 'oi', weight: 1, sources: ['oil', 'coin'] },
  ],
  UH: [
    { spelling: 'oo', weight: 1, sources: ['book', 'good'] },
    { spelling: 'u', weight: 2, sources: ['put', 'full'] },
    { spelling: 'ou', weight: 5, sources: ['would', 'should'] },
    { spelling: 'o', weight: 5, sources: ['wolf', 'woman'] },
  ],
  UW: [
    { spelling: 'oo', weight: 1, sources: ['too', 'moon'] },
    { spelling: 'u', weight: 2, sources: ['flu', 'truth'] },
    { spelling: 'ue', weight: 2, sources: ['blue', 'true'] },
    { spelling: 'ew', weight: 3, sources: ['flew', 'new'] },
    { spelling: 'ou', weight: 3, sources: ['soup', 'group'] },
    { spelling: 'o', weight: 3, sources: ['do', 'who'] },
    { spelling: 'ui', weight: 4, sources: ['fruit', 'juice'] },
    { spelling: 'oe', weight: 6, sources: ['shoe', 'canoe'] },
    { spelling: 'ough', weight: 8, sources: ['through'] },
  ],

  // ---- Consonants ----
  B: [
    { spelling: 'b', weight: 1, sources: ['bat', 'cab'] },
  ],
  CH: [
    { spelling: 'ch', weight: 1, sources: ['chip', 'much'] },
    { spelling: 'tch', weight: 2, sources: ['watch', 'match'] },
    { spelling: 't', weight: 4, sources: ['nature', 'future'] },
    { spelling: 'c', weight: 6, sources: ['cello'] },
  ],
  D: [
    { spelling: 'd', weight: 1, sources: ['dog', 'sad'] },
  ],
  DH: [
    { spelling: 'th', weight: 1, sources: ['this', 'that'] },
  ],
  F: [
    { spelling: 'f', weight: 1, sources: ['fan', 'leaf'] },
    { spelling: 'ph', weight: 3, sources: ['phone', 'graph'] },
    { spelling: 'gh', weight: 6, sources: ['laugh', 'cough'] },
  ],
  G: [
    { spelling: 'g', weight: 1, sources: ['go', 'bag'] },
    { spelling: 'gu', weight: 4, sources: ['guard', 'guest'] },
    { spelling: 'gh', weight: 5, sources: ['ghost', 'ghoul'] },
  ],
  HH: [
    { spelling: 'h', weight: 1, sources: ['hat', 'ahead'] },
    { spelling: 'wh', weight: 4, sources: ['who', 'whole'] },
    { spelling: 'j', weight: 7, sources: ['jalapeno'] },
  ],
  JH: [
    { spelling: 'j', weight: 1, sources: ['jam', 'jump'] },
    { spelling: 'g', weight: 2, sources: ['gem', 'giant'] },
    { spelling: 'dge', weight: 3, sources: ['bridge', 'edge'] },
    { spelling: 'dg', weight: 4, sources: ['judgment', 'budget'] },
  ],
  K: [
    { spelling: 'c', weight: 1, sources: ['cat', 'cup'] },
    { spelling: 'k', weight: 1, sources: ['kit', 'ask'] },
    { spelling: 'ck', weight: 2, sources: ['back', 'duck'] },
    { spelling: 'ch', weight: 4, sources: ['school', 'echo'] },
    { spelling: 'q', weight: 5, sources: ['quay'] },
    { spelling: 'que', weight: 6, sources: ['plaque', 'opaque'] },
  ],
  L: [
    { spelling: 'l', weight: 1, sources: ['lip', 'pal'] },
  ],
  M: [
    { spelling: 'm', weight: 1, sources: ['man', 'ham'] },
    { spelling: 'mb', weight: 4, sources: ['lamb', 'thumb'] },
    { spelling: 'mn', weight: 6, sources: ['autumn', 'column'] },
  ],
  N: [
    { spelling: 'n', weight: 1, sources: ['no', 'pin'] },
    { spelling: 'kn', weight: 4, sources: ['knee', 'knife'] },
    { spelling: 'gn', weight: 5, sources: ['gnat', 'sign'] },
    { spelling: 'pn', weight: 7, sources: ['pneumonia'] },
  ],
  NG: [
    { spelling: 'ng', weight: 1, sources: ['sing', 'long'] },
    { spelling: 'n', weight: 3, sources: ['sink', 'think'] },
    { spelling: 'ngue', weight: 7, sources: ['tongue', 'meringue'] },
  ],
  P: [
    { spelling: 'p', weight: 1, sources: ['pen', 'map'] },
  ],
  R: [
    { spelling: 'r', weight: 1, sources: ['run', 'car'] },
    { spelling: 'wr', weight: 4, sources: ['write', 'wrong'] },
    { spelling: 'rh', weight: 6, sources: ['rhyme', 'rhythm'] },
  ],
  S: [
    { spelling: 's', weight: 1, sources: ['sun', 'bus'] },
    { spelling: 'c', weight: 2, sources: ['city', 'ice'] },
    { spelling: 'sc', weight: 4, sources: ['scene', 'science'] },
    { spelling: 'ps', weight: 7, sources: ['psalm', 'psychology'] },
  ],
  SH: [
    { spelling: 'sh', weight: 1, sources: ['ship', 'wish'] },
    { spelling: 'ti', weight: 4, sources: ['nation', 'motion'] },
    { spelling: 'ci', weight: 4, sources: ['special', 'social'] },
    { spelling: 'ch', weight: 5, sources: ['chef', 'machine'] },
    { spelling: 's', weight: 6, sources: ['sugar', 'sure'] },
  ],
  T: [
    { spelling: 't', weight: 1, sources: ['top', 'cat'] },
    { spelling: 'ed', weight: 4, sources: ['walked', 'jumped'] },
    { spelling: 'th', weight: 6, sources: ['thyme', 'Thomas'] },
    { spelling: 'bt', weight: 7, sources: ['debt', 'doubt'] },
  ],
  TH: [
    { spelling: 'th', weight: 1, sources: ['thin', 'bath'] },
  ],
  V: [
    { spelling: 'v', weight: 1, sources: ['van', 'have'] },
    { spelling: 'f', weight: 5, sources: ['of'] },
    { spelling: 'ph', weight: 7, sources: ['Stephen'] },
  ],
  W: [
    { spelling: 'w', weight: 1, sources: ['win', 'away'] },
    { spelling: 'wh', weight: 2, sources: ['what', 'wheel'] },
    { spelling: 'o', weight: 6, sources: ['one', 'once'] },
  ],
  Y: [
    { spelling: 'y', weight: 1, sources: ['yes', 'yard'] },
    { spelling: 'i', weight: 4, sources: ['onion', 'union'] },
    { spelling: 'll', weight: 6, sources: ['quesadilla', 'tortilla'] },
    { spelling: 'j', weight: 7, sources: ['hallelujah', 'fjord'] },
  ],
  Z: [
    { spelling: 's', weight: 1, sources: ['is', 'was'] },
    { spelling: 'z', weight: 1, sources: ['zoo', 'zip'] },
    { spelling: 'se', weight: 3, sources: ['rose', 'cheese'] },
    { spelling: 'x', weight: 5, sources: ['xylophone'] },
  ],
  ZH: [
    { spelling: 's', weight: 2, sources: ['measure', 'pleasure'] },
    { spelling: 'si', weight: 4, sources: ['vision', 'television'] },
    { spelling: 'g', weight: 5, sources: ['genre', 'beige'] },
    { spelling: 'z', weight: 6, sources: ['azure', 'seizure'] },
  ],
};

/**
 * Return the spelling options for an ARPABET phoneme, most-obscure first.
 * Strips a trailing stress digit (e.g. "EY1" -> "EY"). For a phoneme that
 * isn't in the table, falls back to spelling it with its own lowercased letters.
 * @param {string} phoneme
 * @returns {Array<{spelling: string, weight: number, sources: string[]}>}
 */
export function spellingsFor(phoneme) {
  const key = String(phoneme).replace(/\d+$/, '');
  const options = SPELLINGS[key];
  if (!options) {
    return [{ spelling: key.toLowerCase(), weight: 1, sources: [] }];
  }
  return [...options].sort((a, b) => b.weight - a.weight);
}

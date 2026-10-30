import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPELLINGS, spellingsFor } from '../src/arpabet.js';

test('spellingsFor strips stress digits, sorts by weight desc, and knows eigh', () => {
  const ey = spellingsFor('EY1');
  // sorted descending by weight
  for (let i = 1; i < ey.length; i++) {
    assert.ok(ey[i - 1].weight >= ey[i].weight, 'options must be weight-descending');
  }
  const eigh = ey.find((o) => o.spelling === 'eigh');
  assert.ok(eigh, "EY must offer the 'eigh' spelling");
  assert.ok(eigh.sources.includes('eight'), "'eigh' sources must include 'eight'");
});

test("F offers 'ph', more obscure than plain 'f', sourced from phone", () => {
  const f = spellingsFor('F');
  const ph = f.find((o) => o.spelling === 'ph');
  const plain = f.find((o) => o.spelling === 'f');
  assert.ok(ph, "F must offer 'ph'");
  assert.ok(plain, "F must offer 'f'");
  assert.equal(ph.sources[0], 'phone');
  assert.ok(ph.weight > plain.weight, "'ph' must be more obscure than 'f'");
});

test('every option is a nonempty spelling with a positive weight', () => {
  for (const [phoneme, options] of Object.entries(SPELLINGS)) {
    assert.ok(options.length > 0, `${phoneme} has no options`);
    for (const o of options) {
      assert.equal(typeof o.spelling, 'string');
      assert.ok(o.spelling.length > 0, `${phoneme} has an empty spelling`);
      assert.equal(typeof o.weight, 'number');
      assert.ok(o.weight > 0, `${phoneme} has a non-positive weight`);
      assert.ok(Array.isArray(o.sources), `${phoneme} sources must be an array`);
    }
  }
});

test('an unknown phoneme falls back to its own lowercased letters', () => {
  assert.deepEqual(spellingsFor('ZZ'), [{ spelling: 'zz', weight: 1, sources: [] }]);
});

test('no-op doubled letters are dropped (they do not change the sound)', () => {
  // A doubled consonant sounds identical to the single letter, so it is not a
  // real respelling — only padding that inflates the combinatorial space.
  const spellingsOf = (p) => spellingsFor(p).map((o) => o.spelling);
  assert.ok(!spellingsOf('L').includes('ll'), "L must not offer 'll'");
  assert.ok(!spellingsOf('R').includes('rr'), "R must not offer 'rr'");
  assert.ok(!spellingsOf('S').includes('ss'), "S must not offer 'ss'");
  assert.ok(!spellingsOf('AA').includes('aa'), "AA must not offer 'aa'");
  assert.ok(!spellingsOf('B').includes('bb'), "B must not offer 'bb'");
});

test('doubled letters that DO change the sound are kept', () => {
  const spellingsOf = (p) => spellingsFor(p).map((o) => o.spelling);
  // Spanish 'll' makes the "y" sound (quesadilla), which a single 'l' does not.
  const y = spellingsFor('Y');
  const ll = y.find((o) => o.spelling === 'll');
  assert.ok(ll, "Y must offer 'll'");
  assert.ok(ll.sources.includes('quesadilla'));
  // Vowel teams that change the sound stay (ee != a lone e, oo != a lone o).
  assert.ok(spellingsOf('IY').includes('ee'), "IY must keep 'ee'");
  assert.ok(spellingsOf('UW').includes('oo'), "UW must keep 'oo'");
});

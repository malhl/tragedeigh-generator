import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateTragedeighs } from '../src/generate.js';

test('results are ranked most-obscure first, capped, well-formed', () => {
  const results = generateTragedeighs('fish', ['F', 'IH', 'SH'], { limit: 5 });

  assert.equal(results.length, 5, 'honors the limit');
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i - 1].score >= results[i].score, 'scores descend');
  }
  for (const r of results) {
    assert.match(r.spelling, /^[A-Z][a-z]*$/, 'first letter capitalized, rest lowercase');
    assert.equal(r.parts.length, 3, 'one part per phoneme');
    for (const p of r.parts) assert.ok(Array.isArray(p.sources));
  }
  const spellings = results.map((r) => r.spelling);
  assert.equal(new Set(spellings).size, spellings.length, 'no duplicate spellings');
});

test('the exact input spelling is excluded', () => {
  // SH has 5 spellings; the identity "sh" (-> "Sh") must be dropped, leaving 4.
  const results = generateTragedeighs('sh', ['SH'], { limit: 100 });
  assert.equal(results.length, 4);
  for (const r of results) {
    assert.notEqual(r.spelling.toLowerCase(), 'sh');
  }
});

test('no phonemes yields no results', () => {
  assert.deepEqual(generateTragedeighs('x', [], {}), []);
});

test('a word break keeps a space and capitalizes each word', () => {
  // " " is the word-break token pronounce() inserts between words.
  const results = generateTragedeighs('a b', ['AE', ' ', 'B'], { limit: 5 });
  assert.ok(results.length > 0);
  for (const r of results) {
    assert.match(r.spelling, /^[A-Z][a-z]*( [A-Z][a-z]*)+$/);
  }
});

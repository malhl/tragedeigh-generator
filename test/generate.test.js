import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateTragedeighs, buildBreakdown } from '../src/generate.js';

const soundDiff = (a, b) =>
  a.parts.reduce((n, pt, i) => n + (pt.spelling !== b.parts[i].spelling ? 1 : 0), 0);

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

test('minDiff keeps results at least that many sounds apart', () => {
  const results = generateTragedeighs('fish', ['F', 'IH', 'SH'], { limit: 50, minDiff: 2 });
  assert.ok(results.length >= 2, 'should still produce several diverse results');
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      assert.ok(soundDiff(results[i], results[j]) >= 2, 'every pair differs in >= 2 sounds');
    }
  }
});

test('minDiff never strands a single-sound name with zero results', () => {
  // With one phoneme no two results can differ in 2 positions; the filter must
  // relax to the number of sounds rather than reject everything.
  const results = generateTragedeighs('sh', ['SH'], { limit: 100, minDiff: 2 });
  assert.ok(results.length >= 2);
});

test('buildBreakdown lists each sound with its spelling options and sources', () => {
  const breakdown = buildBreakdown(['F', ' ', 'SH']);
  assert.equal(breakdown.length, 2, 'word-break slots are skipped');
  assert.equal(breakdown[0].phoneme, 'F');
  assert.ok(breakdown[0].options.some((o) => o.spelling === 'ph' && o.sources.includes('phone')));
  assert.equal(breakdown[1].phoneme, 'SH');
});

test('a word break keeps a space and capitalizes each word', () => {
  // " " is the word-break token pronounce() inserts between words.
  const results = generateTragedeighs('a b', ['AE', ' ', 'B'], { limit: 5 });
  assert.ok(results.length > 0);
  for (const r of results) {
    assert.match(r.spelling, /^[A-Z][a-z]*( [A-Z][a-z]*)+$/);
  }
});

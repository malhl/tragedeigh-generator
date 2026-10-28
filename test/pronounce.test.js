import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pronounce, MAX_NAME_LEN } from '../src/pronounce.js';

// Stub dictionary: knows only "kay".
const dict = { lookup: (w) => (w.toLowerCase() === 'kay' ? ['K', 'EY'] : null) };

test('a known name comes from the dictionary', () => {
  assert.deepEqual(pronounce('kay', dict), { phonemes: ['K', 'EY'], source: 'dict' });
});

test('an unknown name falls back to sounding it out and still yields phonemes', () => {
  const result = pronounce('xzqj', dict);
  assert.equal(result.source, 'soundout');
  assert.ok(result.phonemes.length >= 1);
});

test('over-long input is truncated to MAX_NAME_LEN before processing', () => {
  // "a" -> one phoneme each via the fallback, so length reveals the cap.
  const result = pronounce('a'.repeat(100), dict);
  assert.equal(result.source, 'soundout');
  assert.equal(result.phonemes.length, MAX_NAME_LEN);
});

test('multi-word names are pronounced word by word via the dictionary', () => {
  const twoWords = {
    lookup: (w) =>
      ({ mary: ['M', 'EH', 'R', 'IY'], jane: ['JH', 'EY', 'N'] }[w.toLowerCase()] || null),
  };
  assert.deepEqual(pronounce('Mary Jane', twoWords), {
    phonemes: ['M', 'EH', 'R', 'IY', ' ', 'JH', 'EY', 'N'],
    source: 'dict',
  });
});

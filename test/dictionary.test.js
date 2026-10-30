import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDictionary } from '../src/dictionary.js';

const dict = createDictionary({ kayleigh: 'K EY L AH', cat: 'K AE T' });

test('lookup is case-insensitive and splits phonemes into an array', () => {
  assert.deepEqual(dict.lookup('Kayleigh'), ['K', 'EY', 'L', 'AH']);
  assert.deepEqual(dict.lookup('CAT'), ['K', 'AE', 'T']);
});

test('a miss returns null', () => {
  assert.equal(dict.lookup('nope'), null);
});

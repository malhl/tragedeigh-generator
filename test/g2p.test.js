import { test } from 'node:test';
import assert from 'node:assert/strict';
import { soundOut } from '../src/g2p.js';

test('a digraph beats two single letters', () => {
  assert.deepEqual(soundOut('sh'), ['SH']);
});

test("'ph' sounds like F", () => {
  assert.deepEqual(soundOut('ph'), ['F']);
});

test('a simple CVCC word sounds out left to right', () => {
  assert.deepEqual(soundOut('fish'), ['F', 'IH', 'SH']);
});

test('case is lowered and non-letters are stripped', () => {
  assert.deepEqual(soundOut('Fish!!'), ['F', 'IH', 'SH']);
});

test('empty input yields no phonemes', () => {
  assert.deepEqual(soundOut(''), []);
});

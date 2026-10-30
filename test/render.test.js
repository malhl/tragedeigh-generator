import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTragedeighHTML } from '../src/render.js';

const pick = (spelling, score) => ({
  spelling,
  score,
  parts: [{ phoneme: 'F', spelling: 'ph', weight: 3, sources: ['phone'] }],
});

const breakdown = [
  { phoneme: 'F', options: [{ spelling: 'ph', weight: 3, sources: ['phone', 'graph'] }] },
  { phoneme: 'SH', options: [{ spelling: 'sh', weight: 1, sources: ['ship'] }] },
];

test('no sounds renders an empty state', () => {
  assert.match(renderTragedeighHTML({ picks: [], breakdown: [] }), /no-results/);
});

test('each pick shows its spelling, score and a copy affordance', () => {
  const html = renderTragedeighHTML({ picks: [pick('Pheesh', 42)], breakdown });
  assert.match(html, /Pheesh/);
  assert.match(html, /42/);
  assert.match(html, /copy/);
});

test('the breakdown shows one block per sound with spellings and source words', () => {
  const html = renderTragedeighHTML({ picks: [], breakdown });
  assert.equal(html.split('class="sound"').length - 1, 2, 'one block per sound');
  assert.match(html, /ph/);
  assert.match(html, /phone, graph/);
});

test('interpolated text is HTML-escaped in both sections', () => {
  const html = renderTragedeighHTML({
    picks: [pick('<script>x', 9)],
    breakdown: [{ phoneme: 'F', options: [{ spelling: '<x>', weight: 1, sources: ['a<y'] }] }],
  });
  assert.ok(!html.includes('<script>x'), 'pick data markup must not survive');
  assert.ok(html.includes('&lt;script&gt;x'));
  assert.ok(!html.includes('<x>'), 'breakdown spelling markup must not survive');
  assert.ok(!html.includes('a<y'), 'breakdown source markup must not survive');
  assert.ok(html.includes('&lt;x&gt;'));
});

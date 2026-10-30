import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTragedeighHTML, renderGhotiPoster } from '../src/render.js';

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

test('the breakdown shows one block per sound: examples left, spelling right', () => {
  const html = renderTragedeighHTML({ picks: [], breakdown });
  assert.equal(html.split('class="sound"').length - 1, 2, 'one block per sound');
  assert.match(html, /class="spell">ph</, 'the spelling sits on the right');
  assert.ok(html.includes('class="examples"'), 'examples column present');
  assert.ok(html.includes('<u>ph</u>'), 'sound letters underlined in the example word');
});

const ghotiPick = {
  spelling: 'Pheesh',
  score: 9,
  parts: [
    { phoneme: 'F', spelling: 'ph', weight: 3, sources: ['phone', 'graph'] },
    { phoneme: 'IY', spelling: 'ee', weight: 1, sources: ['see'] },
    { phoneme: 'SH', spelling: 'sh', weight: 1, sources: ['ship'] },
  ],
};

test('the ghoti poster shows the name, big spellings, and underlined source letters', () => {
  const html = renderGhotiPoster('Fish', ghotiPick);
  assert.match(html, /Fish/, 'shows the original name');
  assert.match(html, />ph</, 'big spelling tile present');
  assert.ok(html.includes('<u>ph</u>'), "underlines 'ph' in phone");
  assert.ok(html.includes('<u>ee</u>'), "underlines 'ee' in see");
});

test('the poster treats a word break as a gap, not a tile', () => {
  const pick = {
    spelling: 'A B',
    parts: [
      { phoneme: 'AE', spelling: 'a', weight: 1, sources: ['cat'] },
      { phoneme: ' ', spelling: ' ', weight: 0, sources: [] },
      { phoneme: 'B', spelling: 'b', weight: 1, sources: ['bat'] },
    ],
  };
  const html = renderGhotiPoster('a b', pick);
  assert.match(html, /ghoti-gap/);
  assert.equal(html.split('ghoti-big').length - 1, 2, 'two tiles, break skipped');
});

test('the poster underlines nothing when the spelling is not in the source word', () => {
  const pick = { spelling: 'X', parts: [{ phoneme: 'K', spelling: 'q', weight: 1, sources: ['bazaar'] }] };
  const html = renderGhotiPoster('x', pick);
  assert.match(html, /bazaar/);
  assert.ok(!html.includes('<u>'), 'no underline when no match');
});

test('the poster escapes interpolated data', () => {
  const pick = { spelling: '<b>', parts: [{ phoneme: 'F', spelling: '<i>', weight: 1, sources: ['a<i>z'] }] };
  const html = renderGhotiPoster('<name>', pick);
  assert.ok(!html.includes('<i>'), 'spelling markup must not survive');
  assert.ok(!html.includes('<name>'), 'name markup must not survive');
  assert.ok(html.includes('&lt;i&gt;'));
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

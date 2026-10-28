import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderResultsHTML } from '../src/render.js';

const mkResult = (spelling, score) => ({
  spelling,
  score,
  parts: [{ phoneme: 'F', spelling: 'ph', weight: 3, sources: ['phone', 'graph'] }],
});

const countOccurrences = (haystack, needle) => haystack.split(needle).length - 1;

test('empty results render an empty state', () => {
  assert.match(renderResultsHTML([]), /no-results/);
});

test('provenance is shown for the top 5 rows only', () => {
  const results = Array.from({ length: 7 }, (_, i) => mkResult('Name' + i, 20 - i));
  const html = renderResultsHTML(results);
  assert.equal(countOccurrences(html, 'class="provenance"'), 5);
});

test('interpolated text is HTML-escaped', () => {
  const html = renderResultsHTML([mkResult('<script>x', 9)]);
  assert.ok(!html.includes('<script>x'), 'raw markup must not survive');
  assert.ok(html.includes('&lt;script&gt;x'), 'it must appear escaped');
});

test('each row shows its score and a copy affordance', () => {
  const html = renderResultsHTML([mkResult('Pheesh', 42)]);
  assert.match(html, /42/);
  assert.match(html, /copy/);
});

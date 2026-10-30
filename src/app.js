// Thin glue: wire the DOM to the engine modules. All the logic worth testing
// lives in the imported modules; this file only moves data between them and
// the page.

import { createDictionary } from './dictionary.js';
import { pronounce } from './pronounce.js';
import { generateTragedeighs, buildBreakdown } from './generate.js';
import { renderTragedeighHTML } from './render.js';

const form = document.getElementById('form');
const input = document.getElementById('name');
const go = document.getElementById('go');
const status = document.getElementById('status');
const results = document.getElementById('results');

const PICKS_LIMIT = 12;
const PICKS_MIN_DIFF = 2;
let dict = null;
let current = null; // { name, picks, breakdown } for the last search

async function init() {
  try {
    const res = await fetch('./data/cmudict.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    dict = createDictionary(await res.json());
    input.disabled = false;
    go.disabled = false;
    status.textContent = '';
    input.focus();
  } catch (err) {
    status.textContent = 'Could not load the pronunciation dictionary. Try reloading.';
    console.error(err);
  }
}

function run(event) {
  event.preventDefault();
  if (!dict) return;

  const name = input.value.trim();
  if (!name) {
    current = null;
    results.innerHTML = renderTragedeighHTML({ picks: [], breakdown: [] });
    status.textContent = '';
    return;
  }

  const { phonemes, source } = pronounce(name, dict);
  const picks = generateTragedeighs(name, phonemes, {
    limit: PICKS_LIMIT,
    minDiff: PICKS_MIN_DIFF,
  });
  const breakdown = buildBreakdown(phonemes);
  current = { name, picks, breakdown };
  results.innerHTML = renderTragedeighHTML({ name, picks, breakdown, selected: 0 });
  status.textContent =
    breakdown.length === 0
      ? `Couldn't sound out "${name}".`
      : `${breakdown.length} sound${breakdown.length === 1 ? '' : 's'} in "${name}" ` +
        `(${source === 'dict' ? 'from the dictionary' : 'sounded out'}).`;
}

function onResultsClick(event) {
  const button = event.target.closest('.copy');
  if (button) {
    const spelling = button.dataset.spelling;
    const done = navigator.clipboard?.writeText(spelling);
    if (done && typeof done.then === 'function') {
      done.then(
        () => flash(button, 'copied!'),
        () => flash(button, 'failed'),
      );
    } else {
      flash(button, 'copy unavailable');
    }
    return;
  }

  // Clicking a pick row re-renders the ghoti poster for that pick.
  const row = event.target.closest('.result');
  if (row && current) {
    const selected = Number(row.dataset.index);
    results.innerHTML = renderTragedeighHTML({ ...current, selected });
  }
}

function flash(button, text) {
  button.textContent = text;
  setTimeout(() => (button.textContent = 'copy'), 1200);
}

form.addEventListener('submit', run);
results.addEventListener('click', onResultsClick);
init();

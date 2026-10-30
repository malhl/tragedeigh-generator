// Thin glue: wire the DOM to the engine modules. All the logic worth testing
// lives in the imported modules; this file only moves data between them and
// the page.

import { createDictionary } from './dictionary.js';
import { pronounce } from './pronounce.js';
import { generateTragedeighs } from './generate.js';
import { renderResultsHTML } from './render.js';

const form = document.getElementById('form');
const input = document.getElementById('name');
const go = document.getElementById('go');
const status = document.getElementById('status');
const results = document.getElementById('results');

const RESULT_LIMIT = 100;
let dict = null;

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
    results.innerHTML = renderResultsHTML([]);
    status.textContent = '';
    return;
  }

  const { phonemes, source } = pronounce(name, dict);
  const list = generateTragedeighs(name, phonemes, { limit: RESULT_LIMIT });
  results.innerHTML = renderResultsHTML(list);
  status.textContent =
    list.length === 0
      ? `Couldn't sound out "${name}".`
      : `${list.length} tragedeigh${list.length === 1 ? '' : 's'} for "${name}" ` +
        `(${source === 'dict' ? 'from the dictionary' : 'sounded out'}).`;
}

function onResultsClick(event) {
  const button = event.target.closest('.copy');
  if (!button) return;
  const spelling = button.dataset.spelling;
  navigator.clipboard?.writeText(spelling).then(
    () => {
      button.textContent = 'copied!';
      setTimeout(() => (button.textContent = 'copy'), 1200);
    },
    () => {
      button.textContent = 'failed';
      setTimeout(() => (button.textContent = 'copy'), 1200);
    },
  );
}

form.addEventListener('submit', run);
results.addEventListener('click', onResultsClick);
init();

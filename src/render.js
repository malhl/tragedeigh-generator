// Pure rendering: the engine's output -> an HTML string. No DOM access, so it's
// testable in Node. app.js injects the returned string into the page.

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPick(pick) {
  const spelling = escapeHtml(pick.spelling);
  return (
    `<li class="result">` +
    `<span class="spelling">${spelling}</span>` +
    `<span class="score" title="obscurity score">${escapeHtml(pick.score)}</span>` +
    `<button class="copy" type="button" data-spelling="${spelling}">copy</button>` +
    `</li>`
  );
}

function renderSound(sound) {
  const options = sound.options
    .map((o) => {
      const words = o.sources.map(escapeHtml).join(', ');
      const src = words ? `<span class="src">${words}</span>` : '';
      return `<li class="option"><b>${escapeHtml(o.spelling)}</b>${src}</li>`;
    })
    .join('');
  return (
    `<div class="sound">` +
    `<span class="phoneme">${escapeHtml(sound.phoneme)}</span>` +
    `<ul class="options">${options}</ul>` +
    `</div>`
  );
}

/**
 * @param {{ picks: import('./generate.js').Result[],
 *           breakdown: Array<{phoneme: string, options: Array<{spelling: string, sources: string[]}>}> }} model
 * @returns {string}
 */
export function renderTragedeighHTML({ picks, breakdown }) {
  if (!breakdown || breakdown.length === 0) {
    return `<p class="no-results">No tragedeighs yet — type a name above.</p>`;
  }

  const picksSection =
    picks && picks.length > 0
      ? `<section class="picks"><h2>Top picks</h2>` +
        `<ol class="results">${picks.map(renderPick).join('')}</ol></section>`
      : '';

  const breakdownSection =
    `<section class="breakdown"><h2>Every sound, and how to spell it</h2>` +
    breakdown.map(renderSound).join('') +
    `</section>`;

  return picksSection + breakdownSection;
}

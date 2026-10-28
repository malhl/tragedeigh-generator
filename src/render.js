// Pure rendering: Result[] -> HTML string. No DOM access, so it's testable
// in Node. app.js injects the returned string into the page.

const PROVENANCE_ROWS = 5;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderProvenance(parts) {
  const items = parts
    .filter((p) => p.sources && p.sources.length > 0)
    .map((p) => {
      const words = p.sources.map(escapeHtml).join(', ');
      return `<li><b>${escapeHtml(p.spelling)}</b> — like ${words}</li>`;
    })
    .join('');
  if (!items) return '';
  return `<ul class="provenance">${items}</ul>`;
}

function renderRow(result, rank) {
  const spelling = escapeHtml(result.spelling);
  const provenance = rank < PROVENANCE_ROWS ? renderProvenance(result.parts) : '';
  return (
    `<li class="result">` +
    `<div class="result-head">` +
    `<span class="spelling">${spelling}</span>` +
    `<span class="score" title="obscurity score">${escapeHtml(result.score)}</span>` +
    `<button class="copy" type="button" data-spelling="${spelling}">copy</button>` +
    `</div>` +
    provenance +
    `</li>`
  );
}

/**
 * @param {import('./generate.js').Result[]} results
 * @returns {string}
 */
export function renderResultsHTML(results) {
  if (!results || results.length === 0) {
    return `<p class="no-results">No tragedeighs yet — type a name above.</p>`;
  }
  const rows = results.map((r, i) => renderRow(r, i)).join('');
  return `<ol class="results">${rows}</ol>`;
}

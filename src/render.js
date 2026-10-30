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

function renderPick(pick, index, active) {
  const spelling = escapeHtml(pick.spelling);
  return (
    `<li class="result${active ? ' active' : ''}" data-index="${index}">` +
    `<span class="spelling">${spelling}</span>` +
    `<span class="score" title="obscurity score">${escapeHtml(pick.score)}</span>` +
    `<button class="copy" type="button" data-spelling="${spelling}">copy</button>` +
    `</li>`
  );
}

// Render a source word with the letters that make the sound underlined, e.g.
// spelling "ph" + "phone" -> "<u>ph</u>one". Picks the first source that
// actually contains the spelling; if none do, shows the first word plain.
function markSourceWord(spelling, sources) {
  const needle = spelling.toLowerCase();
  const word = sources.find((w) => w.toLowerCase().includes(needle)) ?? sources[0] ?? '';
  return underlineIn(word, spelling);
}

/**
 * Render one chosen respelling as a ghoti-style poster: the original name in
 * brackets, then a tile per sound (big spelling, a bracket, and a source word
 * with the sound-letters underlined). Word breaks render as gaps.
 * @param {string} name
 * @param {import('./generate.js').Result} pick
 * @returns {string}
 */
export function renderGhotiPoster(name, pick) {
  const tiles = pick.parts
    .map((part) => {
      if (part.spelling === ' ') return `<span class="ghoti-gap"></span>`;
      return (
        `<div class="ghoti-tile">` +
        `<span class="ghoti-big">${escapeHtml(part.spelling)}</span>` +
        `<span class="ghoti-bracket"></span>` +
        `<span class="ghoti-word">${markSourceWord(part.spelling, part.sources)}</span>` +
        `</div>`
      );
    })
    .join('');
  return (
    `<figure class="ghoti">` +
    `<figcaption class="ghoti-name">[ ${escapeHtml(name)} ]</figcaption>` +
    `<div class="ghoti-row">${tiles}</div>` +
    `<figcaption class="ghoti-result">${escapeHtml(pick.spelling)}</figcaption>` +
    `</figure>`
  );
}

// Underline the occurrence of `spelling` within `word`, e.g. "ph"+"phone"
// -> "<u>ph</u>one". Returns the word escaped and unmarked if it isn't present.
function underlineIn(word, spelling) {
  const needle = String(spelling).toLowerCase();
  const at = String(word).toLowerCase().indexOf(needle);
  if (at < 0) return escapeHtml(word);
  return (
    escapeHtml(word.slice(0, at)) +
    `<u>${escapeHtml(word.slice(at, at + spelling.length))}</u>` +
    escapeHtml(word.slice(at + spelling.length))
  );
}

function renderSound(sound) {
  const options = sound.options
    .map((o) => {
      const examples = o.sources.map((w) => underlineIn(w, o.spelling)).join(', ');
      return (
        `<li class="option">` +
        `<span class="examples">${examples}</span>` +
        `<span class="spell">${escapeHtml(o.spelling)}</span>` +
        `</li>`
      );
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
export function renderTragedeighHTML({ name = '', picks = [], breakdown = [], selected = 0 }) {
  if (!breakdown || breakdown.length === 0) {
    return `<p class="no-results">No tragedeighs yet — type a name above.</p>`;
  }

  const hasPicks = picks && picks.length > 0;
  const selectedIndex = Math.min(Math.max(selected, 0), hasPicks ? picks.length - 1 : 0);

  const posterSection = hasPicks
    ? `<section class="poster-area">${renderGhotiPoster(name, picks[selectedIndex])}</section>`
    : '';

  const picksSection = hasPicks
    ? `<section class="picks"><h2>Top picks <span class="hint">(tap one to see it)</span></h2>` +
      `<ol class="results">${picks
        .map((p, i) => renderPick(p, i, i === selectedIndex))
        .join('')}</ol></section>`
    : '';

  const breakdownSection =
    `<section class="breakdown"><h2>Every sound, and how to spell it</h2>` +
    breakdown.map(renderSound).join('') +
    `</section>`;

  return (
    `<div class="layout">` +
    `<div class="col col-left">${breakdownSection}</div>` +
    `<div class="col col-right">${posterSection}${picksSection}</div>` +
    `</div>`
  );
}

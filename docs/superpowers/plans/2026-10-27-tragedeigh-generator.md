# Tragedeigh Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static browser page that turns any typed name into up to 100 phonetically-faithful cursed respellings, ranked most-obscure first.

**Architecture:** Pure-function ES modules (no bundler) that both the browser and Node's test runner import directly. A name is turned into ARPABET phonemes via a bundled CMU dictionary with a grapheme-to-phoneme fallback; each phoneme is re-spelled from a weighted table; a best-first search enumerates the highest-scoring spelling combinations without generating every permutation. A thin `app.js` wires DOM events to these modules.

**Tech Stack:** Vanilla HTML/CSS/JS, native ES modules, `node --test` + `node:assert` for tests (zero install), no build step for the shipped site.

**Spec:** `README.md` (the project README is the design doc)

## Global Constraints

- Static hosting only (GitHub Pages); no server-side code and no runtime API/network calls.
- No framework, bundler, or build step for the shipped site; ship ES modules the browser loads natively.
- Dev-only tooling (test runner, dict-build script) is allowed and must not be required to serve the site.
- Phoneme data derives from the CMU Pronouncing Dictionary (freely redistributable).
- Respellings use plain English letters only — no accents or diacritics.
- Hard cap of 100 results; the exact input spelling is excluded; duplicate output spellings are removed.
- Output capitalizes the first letter only; the obscurity score is the raw sum of the weights used.
- Page must be mobile-friendly with light and dark modes.

## Review Focus

- **Empty / whitespace-only input** → render a gentle empty state, never crash. (Task 6)
- **Non-letter characters (digits, punctuation, emoji)** → stripped before sounding out; no crash. (Task 2)
- **Unknown name with odd letters (e.g. `xzqj`)** → fallback still yields ≥1 result. (Tasks 4, 5)
- **Over-long input** → input is truncated to a max length so the search can't blow up. (Task 4)
- **A phoneme absent from the spelling table** → `spellingsFor` returns a sensible default spelling rather than dropping the sound. (Task 1)

---

### Task 1: ARPABET spelling table

**Files:**
- Create: `src/arpabet.js`
- Create: `package.json` (`"type": "module"`, `"test": "node --test"`)
- Test: `test/arpabet.test.js`

**Interfaces:**
- Produces: `SPELLINGS` — a `Record<string, Array<{spelling: string, weight: number, sources: string[]}>>` keyed by stressless ARPABET phoneme; higher `weight` = more obscure; `sources` are common everyday words that spell that sound that way, most-common first.
- Produces: `spellingsFor(phoneme: string) -> Array<{spelling, weight, sources}>` — strips any trailing stress digit from `phoneme`, returns that phoneme's options sorted by `weight` descending; for a phoneme not in `SPELLINGS`, returns a single default option `{spelling: <lowercased phoneme letters>, weight: 1, sources: []}`.

The contents of `SPELLINGS` are the creative core — the implementer fills in the full set of English spellings and obscurity weights for each of the ~39 ARPABET phonemes, guided by the spec. The tests below pin only the structure and a few well-known entries.

- [ ] **Step 1: Write the failing test**

```js
// test/arpabet.test.js — assertions:
// spellingsFor('EY1') is sorted by weight desc and includes a 'eigh' option with sources containing 'eight'
// spellingsFor('F') includes { spelling: 'ph', sources starting ['phone', ...] } with weight > the 'f' option's weight
// every option across SPELLINGS has a nonempty string spelling and a positive number weight
// spellingsFor('ZZ') (not in table) === [{ spelling: 'zz', weight: 1, sources: [] }]
```

- [ ] **Step 2: Run test to verify it fails** — `node --test test/arpabet.test.js` → FAIL (module missing).
- [ ] **Step 3: Implement `SPELLINGS` and `spellingsFor` in `src/arpabet.js`.** Populate every ARPABET phoneme with its English spellings and weights; sort in `spellingsFor`, not in the data.
- [ ] **Step 4: Run test to verify it passes** — `node --test test/arpabet.test.js` → PASS.
- [ ] **Step 5: Commit** — `feat: add ARPABET spelling table`.

---

### Task 2: Grapheme-to-phoneme fallback

**Files:**
- Create: `src/g2p.js`
- Test: `test/g2p.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `soundOut(name: string) -> string[]` — lowercases input, strips every character that is not `a–z`, then scans left-to-right with **longest-grapheme-first** matching against an internal grapheme→phoneme table (multi-letter graphemes like `sh`, `ch`, `th`, `ph`, `ai`, `ee`, `igh` tried before single letters), returning stressless ARPABET phonemes. Unmatched letters are skipped.

The grapheme→phoneme table's breadth is the implementer's; the longest-match scan and the cases below are fixed.

- [ ] **Step 1: Write the failing test**

```js
// test/g2p.test.js — assertions:
// soundOut('sh') deepEqual ['SH']            (digraph beats two singles)
// soundOut('ph') deepEqual ['F']
// soundOut('fish') deepEqual ['F','IH','SH']
// soundOut('Fish!!') deepEqual ['F','IH','SH']   (case + non-letters stripped)
// soundOut('') deepEqual []
```

- [ ] **Step 2: Run test to verify it fails** — `node --test test/g2p.test.js` → FAIL.
- [ ] **Step 3: Implement `soundOut` in `src/g2p.js`** using a longest-match scan over the grapheme table.
- [ ] **Step 4: Run test to verify it passes** → PASS.
- [ ] **Step 5: Commit** — `feat: add grapheme-to-phoneme fallback`.

---

### Task 3: Dictionary loader + build script

**Files:**
- Create: `src/dictionary.js`
- Create: `scripts/build-dict.mjs`
- Create: `data/cmudict.json` (generated by the script)
- Test: `test/dictionary.test.js`

**Interfaces:**
- Produces: `createDictionary(entries: Record<string,string>) -> { lookup(word: string): string[] | null }` — `lookup` lowercases `word`, and on a hit splits the stored space-separated phoneme string into an array; miss returns `null`.
- `scripts/build-dict.mjs` (dev-only, run with `node`): downloads `cmudict-0.7b`, and for each entry lowercases the word, keeps only the primary pronunciation (drops `WORD(1)` alternates), strips trailing stress digits from phonemes, and writes `data/cmudict.json` as `{ word: "P H O N E M E S" }`.

Tests use a tiny injected `entries` object, never the generated file.

- [ ] **Step 1: Write the failing test**

```js
// test/dictionary.test.js — with entries { kayleigh: 'K EY L AH', cat: 'K AE T' }:
// lookup('Kayleigh') deepEqual ['K','EY','L','AH']   (case-insensitive)
// lookup('CAT') deepEqual ['K','AE','T']
// lookup('nope') === null
```

- [ ] **Step 2: Run test to verify it fails** → FAIL.
- [ ] **Step 3: Implement `createDictionary` in `src/dictionary.js`.**
- [ ] **Step 4: Run test to verify it passes** → PASS.
- [ ] **Step 5: Write and run `scripts/build-dict.mjs`** to produce `data/cmudict.json`; verify the file exists and `kayleigh` maps to a stress-digit-free string.
- [ ] **Step 6: Commit** — `feat: add CMU dictionary loader and build script` (include `data/cmudict.json`).

---

### Task 4: pronounce()

**Files:**
- Create: `src/pronounce.js`
- Test: `test/pronounce.test.js`

**Interfaces:**
- Consumes: `createDictionary` (Task 3), `soundOut` (Task 2).
- Produces: `pronounce(name: string, dict: {lookup}) -> { phonemes: string[], source: 'dict' | 'soundout' }` — truncates `name` to at most `MAX_NAME_LEN` (exported const, 30) characters before processing; tries `dict.lookup`; on `null` uses `soundOut`; `source` records which path produced the phonemes.

- [ ] **Step 1: Write the failing test**

```js
// test/pronounce.test.js — with a stub dict whose lookup returns ['K','EY'] for 'kay' else null:
// pronounce('kay', dict) deepEqual { phonemes: ['K','EY'], source: 'dict' }
// pronounce('xzqj', dict).source === 'soundout' and phonemes.length >= 1
// pronounce('a'.repeat(100), dict) processes at most MAX_NAME_LEN chars (assert via a dict stub spy or soundout length bound)
```

- [ ] **Step 2: Run test to verify it fails** → FAIL.
- [ ] **Step 3: Implement `pronounce` and `MAX_NAME_LEN` in `src/pronounce.js`.**
- [ ] **Step 4: Run test to verify it passes** → PASS.
- [ ] **Step 5: Commit** — `feat: add pronounce with dict + fallback and length cap`.

---

### Task 5: Tragedeigh generator

**Files:**
- Create: `src/generate.js`
- Test: `test/generate.test.js`

**Interfaces:**
- Consumes: `spellingsFor` (Task 1).
- Produces: `generateTragedeighs(name: string, phonemes: string[], opts?: {limit?: number}) -> Result[]`, `limit` default 100. `Result = { spelling: string, score: number, parts: Array<{phoneme: string, spelling: string, weight: number, sources: string[]}> }`.
  - For each phoneme, options come from `spellingsFor`.
  - Results are produced in **descending `score`** (sum of chosen option weights) using a **best-first search**: a max-heap seeded with the all-highest-weight combination; popping a combination yields a result and pushes its neighbors (each one phoneme stepped to its next-lower-weight option), with a visited-set so each combination is emitted once. This returns the top `limit` without enumerating all permutations.
  - `spelling` is the concatenated option spellings with only the first letter capitalized.
  - Skip any result whose `spelling` equals `name` case-insensitively; skip duplicate `spelling` values.
  - Stop once `limit` kept results are collected.

- [ ] **Step 1: Write the failing test**

```js
// test/generate.test.js — using a fake spellingsFor via dependency or a known phoneme set:
// results are sorted by score descending (each score >= the next)
// results.length <= limit (pass limit: 5 over a phoneme set with many combos → exactly 5)
// no result.spelling equals the input name (case-insensitive)
// no two results share the same spelling
// every result.spelling has an uppercase first char and lowercase remainder
// each result.parts length === phonemes.length and part.sources is an array
```

- [ ] **Step 2: Run test to verify it fails** → FAIL.
- [ ] **Step 3: Implement `generateTragedeighs` in `src/generate.js`** with the best-first heap described above.
- [ ] **Step 4: Run test to verify it passes** → PASS.
- [ ] **Step 5: Commit** — `feat: add best-first tragedeigh generator`.

---

### Task 6: Result rendering (pure)

**Files:**
- Create: `src/render.js`
- Test: `test/render.test.js`

**Interfaces:**
- Consumes: `Result` (Task 5).
- Produces: `renderResultsHTML(results: Result[]) -> string` — returns an HTML string: an empty-state message when `results` is empty; otherwise one row per result showing the `spelling`, its `score`, and a copy button carrying the spelling; for the **first 5** rows only, a provenance block listing, per part, the part's `spelling` and its `sources`. All interpolated text is HTML-escaped.

- [ ] **Step 1: Write the failing test**

```js
// test/render.test.js:
// renderResultsHTML([]) contains an empty-state marker (e.g. 'no-results')
// for 7 results, provenance markers appear exactly 5 times (top 5 only)
// a result spelling containing '<' is escaped (no raw '<script' injection)
// each row contains its score and a copy affordance
```

- [ ] **Step 2: Run test to verify it fails** → FAIL.
- [ ] **Step 3: Implement `renderResultsHTML` (and a private `escapeHtml`) in `src/render.js`.**
- [ ] **Step 4: Run test to verify it passes** → PASS.
- [ ] **Step 5: Commit** — `feat: add result rendering`.

---

### Task 7: Page + app glue + deploy

**Files:**
- Create: `index.html`, `styles.css`, `src/app.js`
- Create: `.nojekyll` (lets GitHub Pages serve `src/` and `data/` untouched)

**Interfaces:**
- Consumes: `pronounce` (Task 4), `createDictionary` (Task 3), `generateTragedeighs` (Task 5), `renderResultsHTML` (Task 6).
- `app.js` (thin glue, no unit tests): on load, `fetch('./data/cmudict.json')` → `createDictionary`; on submit, read the input, `pronounce` → `generateTragedeighs` → `renderResultsHTML` into the results container; wire copy buttons (clipboard). Shows a loading state until the dictionary resolves.

- [ ] **Step 1: Build `index.html`** — one input + submit, a results container, `<script type="module" src="./src/app.js">`, viewport meta for mobile, links `styles.css`.
- [ ] **Step 2: Build `styles.css`** — clean playful layout, mobile-first, light/dark via `prefers-color-scheme`.
- [ ] **Step 3: Implement `src/app.js`** wiring the modules as above.
- [ ] **Step 4: Verify in a browser** — serve the folder (`node --test` unaffected; use any static server or open via a local server because ES modules need http). Confirm: typing `Kayleigh` yields a ranked list ≤100 with scores, top-5 provenance, working copy buttons; empty input shows the empty state; a made-up name still returns results.
- [ ] **Step 5: Commit** — `feat: add page, app glue, and GitHub Pages config`.

---

## Notes for deployment

GitHub Pages: enable Pages on the default branch root. The `.nojekyll` file ensures `src/` and `data/` are served as-is. All asset paths are relative (`./...`) so the site works from a project subpath (`user.github.io/repo/`).

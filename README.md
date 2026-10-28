# Tragedeigh Generator

Type a name. Get back up to 100 maximally-cursed respellings of it, ranked
from most unhinged to tamest, each one technically legal English.

A **tragedeigh** is a name respelled so the sounds stay the same but the
letters go feral — `Kayleigh` instead of `Kaylee`, because `eigh` is a real
(deranged) English spelling of the "ay" sound (see: `eight`, `weigh`,
`sleigh`). This tool takes any name, figures out its sounds, and re-spells
each sound the weirdest way English allows.

It is a single static page with no server and no build step. It drops onto
GitHub Pages as-is.

---

## What it does

1. You type a name into one input box and hit go.
2. The page works out the name's **phonemes** (its sounds).
3. For each sound, it swaps in alternative English spellings from a weighted
   table — tame spellings (`ay`) score low, deranged ones (`eigh`, `ph`,
   silent letters) score high.
4. It mixes one spelling per sound into full respelled names, removes
   duplicates, scores each by total obscurity, and shows the top 100 ranked
   **most-obscure first**.

Everything runs in the browser. No API calls, no key, no network dependency
at runtime.

## How a name becomes sounds

Two stages, in order:

1. **Bundled CMU Pronouncing Dictionary.** ~134,000 words and names with their
   phonemes (ARPABET), shipped inside the site (~1 MB gzipped). This is the
   same data the Datamuse API serves, so bundling it means no live calls.
   Covers real names and common words instantly.
2. **Sound-it-out fallback (grapheme-to-phoneme).** For invented or rare names
   the dictionary doesn't have — which is most of what a tragedeigh tool gets
   fed — a rule-based engine sounds the name out from its spelling. This
   guarantees *every* input produces a result.

## What each result shows

- **Every row:** the respelled name and a small **obscurity score** (a plain
  number — higher is more cursed).
- **A copy button** on each row.
- **Top 5 only — provenance.** For each weird spelling used in that name, show
  the most common everyday words that spelling-of-that-sound comes from. So
  `eigh` is justified by `eight, weigh, sleigh`; `ph` by `phone, graph`. Proof
  the madness is real English.

## Look and feel

- Clean, playful, mobile-friendly.
- Light and dark mode.
- The score shown as a plain number (optionally dressed up as a small meter).

---

## Goals

- Given any typed name, produce a ranked list of up to 100 phonetically-faithful
  respellings, most-obscure first.
- Work for invented names, not just dictionary ones.
- Run entirely client-side as a static page suitable for GitHub Pages.
- Justify the top results with real source words, so the output is demonstrably
  legitimate English rather than random letters.

## Non-goals

- No live API calls at runtime.
- No framework, bundler, or build step unless one proves necessary.
- No accounts, saving, or sharing features.
- Not trying to nail a single "correct" pronunciation — tragedeighs are
  playful; "sounds close enough" is the bar.

## Anti-goals (these would make it a failure even if it ran)

- Output that doesn't actually sound like the input name.
- A spelling in the table that can't be backed by a real English word.
- A page so heavy it's slow to load on a phone.
- An input that produces nothing (every name must yield results).

## Constraints

- Static hosting only (GitHub Pages). No server-side code.
- Total page weight should stay reasonable on mobile; the dictionary is the
  heaviest asset and should be compressed and loaded efficiently.
- Dictionary data must come from a freely redistributable source (CMUdict is).

---

## Decisions already made

- **Data source:** bundled CMU Pronouncing Dictionary + grapheme-to-phoneme
  fallback. No live API.
- **Ranking:** most-obscure first, hard cap at 100 results, duplicates removed.
- **Scoring:** each (sound → spelling) option carries an obscurity weight; a
  name's score is the sum of the weights of the spellings it uses.
- **Provenance:** example source words are curated per (sound, spelling) pair
  and shown for the top 5 results only.
- **Stack:** vanilla HTML/CSS/JS, effectively one page plus data files, no build
  step.
- **Input:** a single name; tolerates spaces.

## Left to the builder

- The exact phoneme → spellings table and the obscurity weights (the creative
  core — which spellings exist for each ARPABET sound and how cursed each is).
- The curated source-word examples per spelling, and how "most common" is
  decided (e.g., a small built-in frequency ranking).
- The grapheme-to-phoneme ruleset for the fallback.
- How the dictionary is stored and loaded (format, compression, lazy-loading).
- The combination strategy that keeps results under 100 without missing the
  most-obscure ones (e.g., greedy by weight rather than generating every
  permutation).
- Exact visual design within the "clean, playful, mobile-friendly, light/dark"
  guidance.

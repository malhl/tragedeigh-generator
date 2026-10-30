// Dev-only. Downloads the CMU Pronouncing Dictionary and writes a compact
// word -> "P H O N E M E S" JSON map to data/cmudict.json.
//
//   node scripts/build-dict.mjs
//
// Transformations:
//  - words lowercased
//  - only the primary pronunciation kept (alternates look like "word(2)")
//  - stress digits stripped from phonemes ("AE1" -> "AE")
//  - lines after a "#" comment and trailing comments ignored

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SOURCE =
  'https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outPath = join(root, 'data', 'cmudict.json');

async function main() {
  console.log(`Downloading ${SOURCE} ...`);
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const text = await res.text();

  const map = {};
  let kept = 0;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.split('#')[0].trim(); // drop trailing comments
    if (!line) continue;
    const tokens = line.split(/\s+/);
    const rawWord = tokens[0];
    if (/\(\d+\)$/.test(rawWord)) continue; // skip alternate pronunciations

    const word = rawWord.toLowerCase();
    const phonemes = tokens
      .slice(1)
      .map((p) => p.replace(/\d+$/, ''))
      .join(' ');
    if (!phonemes) continue;
    if (map[word] === undefined) {
      map[word] = phonemes;
      kept += 1;
    }
  }

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(map));
  console.log(`Wrote ${kept} entries to ${outPath}`);
  console.log(`  sanity: kayleigh -> ${map.kayleigh ?? '(missing)'}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

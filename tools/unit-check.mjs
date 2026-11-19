// unit-check.mjs — Leonida Platinum's own checks, run in plain Node.
//
// Verifies the data against the official list in app/data/trophies.json
// (including that the file is still byte-identical to the kit's, by sha256),
// the editorial data in app/guides.js (guide length, kind split, targets,
// missable quotes, roadmap coverage), and the tracker rules in app/store.js
// (save/load and export/import round trips, junk filtering, counter clamp
// and auto-earn, spoiler masking and the rule that search cannot see through
// the shield). Exits non-zero if anything fails.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GUIDE, KIND_LABELS, KIND_OF, MISSABLES, ROADMAP, TARGETS } from '../app/guides.js';
import {
  counterOf, demoState, displayName, emptyState, exportState, filterTrophies,
  isEarned, isMasked, loadState, parseImport, progress, saveState, setCounter,
} from '../app/store.js';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const rawData = readFileSync(join(repoRoot, 'app', 'data', 'trophies.json'));
const doc = JSON.parse(rawData.toString('utf8'));
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const ids = trophies.map((t) => t.id);

let passed = 0;
let failed = 0;
function check(name, condition) {
  if (condition) { passed += 1; console.log(`ok   ${name}`); }
  else { failed += 1; console.log(`FAIL ${name}`); }
}

// --- the official data file -------------------------------------------------
check('trophies.json is byte-identical to the kit file (sha256)',
  createHash('sha256').update(rawData).digest('hex')
    === 'ad1c0f2aeadaa934aab06a27de182deb10ff70615007ddc070d50d7a0b4aa444');
check('55 trophies', trophies.length === 55);
check('ids run 1..55 in order', ids.every((id, i) => id === i + 1));
const gradeCount = (g) => trophies.filter((t) => t.grade === g).length;
check('grade split is 1 platinum / 2 gold / 6 silver / 46 bronze',
  gradeCount('platinum') === 1 && gradeCount('gold') === 2
  && gradeCount('silver') === 6 && gradeCount('bronze') === 46);

// --- editorial data -----------------------------------------------------------
check('every trophy has a guide', trophies.every((t) => typeof GUIDE[t.id] === 'string'));
const minGuide = Math.min(...trophies.map((t) => GUIDE[t.id].length));
check(`every guide is at least 200 characters (shortest: ${minGuide})`, minGuide >= 200);
check('every trophy has a known kind',
  trophies.every((t) => KIND_LABELS[KIND_OF[t.id]] !== undefined));
check('13 story trophies',
  trophies.filter((t) => KIND_OF[t.id] === 'story').length === 13);
check('kinds cover all 55 exactly once',
  Object.keys(KIND_OF).length === 55);

check('19 numeric targets', Object.keys(TARGETS).length === 19);
check('targets point at real trophies with positive targets',
  Object.entries(TARGETS).every(([id, s]) => byId.has(Number(id)) && s.target > 0));
check('spot targets: 250 stunts, 42 range golds, 500 choices',
  TARGETS[15].target === 250 && TARGETS[17].target === 42 && TARGETS[48].target === 500);
check('spot targets: $250,000 laundered, $100,000 spent, 8 garages',
  TARGETS[52].target === 250000 && TARGETS[53].target === 100000 && TARGETS[54].target === 8);

check('exactly 4 missable flags, on trophies 37, 44, 48, 49',
  MISSABLES.map((m) => m.id).join(',') === '37,44,48,49');
const OFFICIAL_QUOTES = {
  37: 'Make an unscheduled departure at VCIA.',
  44: 'Enjoy a cocktail with a view on Ocean Beach.',
  48: 'Choices made (for better or worse).',
  49: "Second time's the charm.",
};
check('each missable quote matches the official description byte-for-byte',
  MISSABLES.every((m) => byId.get(m.id).description === OFFICIAL_QUOTES[m.id]));

check('roadmap has 7 stages', ROADMAP.length === 7);
const roadIds = ROADMAP.flatMap((s) => s.ids);
check('roadmap covers 55/55 trophies exactly once',
  roadIds.length === 55 && new Set(roadIds).size === 55
  && ids.every((id) => roadIds.includes(id)));
check('every roadmap stage carries a rationale note',
  ROADMAP.every((s) => s.note.length >= 40 && s.ids.length > 0));

// --- the demo seed --------------------------------------------------------------
const demo = demoState();
check('seed earns exactly 13 trophies', demo.earned.length === 13);
check('seed trophies are all real and its counters sit inside their targets',
  demo.earned.every((id) => byId.has(id))
  && Object.entries(demo.counters).every(([id, v]) => v > 0 && v < TARGETS[id].target));
check('seed leaves the spoiler shield on', demo.spoilers === true);

// --- store: persistence ---------------------------------------------------------
function fakeStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
  };
}
const storage = fakeStorage();
saveState(storage, demo);
const loaded = loadState(storage);
check('save/load round trip preserves the state',
  JSON.stringify(loaded) === JSON.stringify(demo));
check('loading empty storage gives a clean state',
  JSON.stringify(loadState(fakeStorage())) === JSON.stringify(emptyState()));

// --- store: export / import ------------------------------------------------------
const roundTripped = parseImport(exportState(demo), ids);
check('export/import round trip preserves the state',
  JSON.stringify(roundTripped) === JSON.stringify(demo));
let threw = false;
try { parseImport('this is not json{', ids); } catch { threw = true; }
check('import rejects invalid JSON with an error', threw);
threw = false;
try { parseImport('{"unrelated": true}', ids); } catch { threw = true; }
check('import rejects a JSON object that is not a save', threw);
const cleaned = parseImport('{"earned":[2,999,"x",3],"counters":{"15":99999,"77":5}}', ids);
check('import filters junk ids and clamps counters',
  cleaned.earned.join(',') === '2,3' && cleaned.counters[15] === 250 && !('77' in cleaned.counters));

// --- store: counter rules ---------------------------------------------------------
const s = emptyState();
check('counter clamps at its target and auto-earns',
  setCounter(s, 15, 99999) === 250 && counterOf(s, 15) === 250 && isEarned(s, 15));
check('counter clamps at zero', setCounter(s, 15, -4) === 0 && counterOf(s, 15) === 0);
check('counter ignores trophies without targets', setCounter(s, 2, 5) === 0);

// --- store: progress ----------------------------------------------------------------
const p = progress(trophies, demo);
check('progress on the seed: 13 of 55, per-grade totals intact',
  p.earned === 13 && p.total === 55
  && p.perGrade.platinum.total === 1 && p.perGrade.gold.total === 2
  && p.perGrade.silver.total === 6 && p.perGrade.bronze.total === 46);

// --- store: filters and the spoiler shield -------------------------------------------
check('grade filter: silver shows 6',
  filterTrophies(trophies, demo, { grade: 'silver' }).length === 6);
check('kind filter: story shows 13',
  filterTrophies(trophies, demo, { kind: 'story' }).length === 13);
check('missable-only filter shows 4',
  filterTrophies(trophies, demo, { missableOnly: true }).length === 4);
const story5 = byId.get(5);
check('unearned story trophy is masked while the shield is on',
  isMasked(story5, demo) && displayName(story5, demo).startsWith('Hidden story trophy'));
check('earned story trophy is not masked', !isMasked(byId.get(2), demo));
check('search cannot see through the shield',
  !filterTrophies(trophies, demo, { query: story5.name }).some((t) => t.id === 5));
check('search finds the same trophy once the shield is off',
  filterTrophies(trophies, { ...demo, spoilers: false }, { query: story5.name })
    .some((t) => t.id === 5));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

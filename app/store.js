// store.js — Leonida Platinum's tracker core.
//
// State shape: { earned: number[], counters: { [id]: number }, spoilers: bool }.
// Everything here is pure or takes its storage as an argument, so the same
// code runs in the browser (with localStorage) and in the unit checks (with a
// fake). The counter rules: a counter clamps into [0, target], and reaching
// its target earns the trophy automatically; unticking an earned trophy is
// always a manual act.

import { GUIDE, KIND_OF, MISSABLES, TARGETS } from './guides.js';

export const STORAGE_KEY = 'leonida-platinum-v1';

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export function emptyState() {
  return { earned: [], counters: {}, spoilers: true };
}

// The deterministic demo state used for screenshots (?seed=): thirteen
// trophies earned, five counters part way, the spoiler shield on.
export function demoState() {
  return {
    earned: [2, 3, 4, 8, 10, 16, 20, 21, 22, 29, 44, 46, 51],
    counters: { 15: 87, 17: 19, 31: 12, 35: 23, 52: 64000 },
    spoilers: true,
  };
}

export function isEarned(state, id) {
  return state.earned.includes(id);
}

export function toggleEarned(state, id) {
  state.earned = isEarned(state, id)
    ? state.earned.filter((x) => x !== id)
    : [...state.earned, id].sort((a, b) => a - b);
  return state;
}

// Set a counter, clamped to its target; reaching the target auto-earns.
// Returns the value actually stored.
export function setCounter(state, id, value) {
  const spec = TARGETS[id];
  if (!spec) return 0;
  let v = Math.floor(Number(value));
  if (!Number.isFinite(v)) v = 0;
  v = Math.max(0, Math.min(spec.target, v));
  state.counters[id] = v;
  if (v >= spec.target && !isEarned(state, id)) state.earned.push(id);
  return v;
}

export function counterOf(state, id) {
  return state.counters[id] ?? 0;
}

export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return sanitise(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, quotas); the tracker keeps
    // working in memory for the session.
  }
}

// Keep only what a state is allowed to hold: known trophy ids in earned,
// counters for trophies that have targets, clamped into range, and a boolean
// spoiler setting. Used by both load and import.
export function sanitise(value, validIds) {
  const state = emptyState();
  if (!value || typeof value !== 'object') return state;
  const known = validIds ? new Set(validIds) : null;
  if (Array.isArray(value.earned)) {
    for (const id of value.earned) {
      if (Number.isInteger(id) && (!known || known.has(id)) && !state.earned.includes(id)) {
        state.earned.push(id);
      }
    }
    state.earned.sort((a, b) => a - b);
  }
  if (value.counters && typeof value.counters === 'object') {
    for (const [key, v] of Object.entries(value.counters)) {
      const id = Number(key);
      if (TARGETS[id] && Number.isFinite(Number(v))) {
        state.counters[id] = Math.max(0, Math.min(TARGETS[id].target, Math.floor(Number(v))));
      }
    }
  }
  if (typeof value.spoilers === 'boolean') state.spoilers = value.spoilers;
  return state;
}

export function exportState(state) {
  return JSON.stringify(
    { app: 'leonida-platinum', version: 1, ...state },
    null,
    2,
  );
}

// Parse an imported save. Throws an Error with a readable message on anything
// that is not a plausible Leonida Platinum save; junk entries inside an
// otherwise valid save are filtered by sanitise().
export function parseImport(text, validIds) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error('That is not valid JSON — the file may be truncated or not a save at all.');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('That JSON is not a save object.');
  }
  if (!Array.isArray(value.earned) && !(value.counters && typeof value.counters === 'object')) {
    throw new Error('That save has neither an earned list nor counters — nothing to import.');
  }
  return sanitise(value, validIds);
}

export function progress(trophies, state) {
  const perGrade = {};
  for (const grade of GRADES) perGrade[grade] = { earned: 0, total: 0 };
  let earned = 0;
  for (const trophy of trophies) {
    perGrade[trophy.grade].total += 1;
    if (isEarned(state, trophy.id)) {
      earned += 1;
      perGrade[trophy.grade].earned += 1;
    }
  }
  return {
    earned,
    total: trophies.length,
    pct: trophies.length ? Math.round((earned / trophies.length) * 100) : 0,
    perGrade,
  };
}

const MISSABLE_IDS = new Set(MISSABLES.map((m) => m.id));

export function isMissable(id) {
  return MISSABLE_IDS.has(id);
}

// The spoiler shield: an unearned story trophy is masked while spoilers are
// on. Masking replaces name, description and guide with a placeholder, and —
// importantly — search never sees through it.
export function isMasked(trophy, state) {
  return state.spoilers && KIND_OF[trophy.id] === 'story' && !isEarned(state, trophy.id);
}

export function displayName(trophy, state) {
  return isMasked(trophy, state)
    ? `Hidden story trophy (${trophy.grade})`
    : trophy.name;
}

export function displayDescription(trophy, state) {
  return isMasked(trophy, state)
    ? 'Masked by the spoiler shield until you earn it.'
    : trophy.description;
}

export function displayGuide(trophy, state) {
  return isMasked(trophy, state)
    ? 'This guide is hidden while the spoiler shield is on and the trophy is unearned. Earn it in game, or turn the shield off above, to read it.'
    : GUIDE[trophy.id];
}

// filters: { grade, kind, status, missableOnly, hideEarned, query }.
// Returns the trophies that pass, in list order.
export function filterTrophies(trophies, state, filters) {
  const q = (filters.query ?? '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (filters.grade && filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.kind && filters.kind !== 'all' && KIND_OF[trophy.id] !== filters.kind) return false;
    if (filters.status === 'earned' && !isEarned(state, trophy.id)) return false;
    if (filters.status === 'unearned' && isEarned(state, trophy.id)) return false;
    if (filters.missableOnly && !isMissable(trophy.id)) return false;
    if (filters.hideEarned && isEarned(state, trophy.id)) return false;
    if (q) {
      const haystack = isMasked(trophy, state)
        ? `${displayName(trophy, state)} ${trophy.grade} ${KIND_OF[trophy.id]}`
        : `${trophy.name} ${trophy.description} ${GUIDE[trophy.id]} ${trophy.grade} ${KIND_OF[trophy.id]}`;
      if (!haystack.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

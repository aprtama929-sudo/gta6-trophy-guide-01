// app.js — Leonida Platinum's interface.
//
// Loads the official trophy data, renders the checklist with its detail pane,
// the roadmap and the missables view, and wires every control to the tracker
// core in store.js. Hash routes: #/ (checklist), #/guide/<n> (checklist with
// a trophy open), #/roadmap, #/missables, #/grade/<grade> (checklist filtered
// by grade). A ?seed= parameter loads the deterministic demo state used for
// screenshots. When the first render is on screen, window.__shotReady is set.

import { GUIDE, KIND_LABELS, KIND_OF, MISSABLES, ROADMAP, TARGETS } from './guides.js';
import {
  counterOf, demoState, displayDescription, displayGuide, displayName, emptyState,
  exportState, filterTrophies, isEarned, isMasked, isMissable, loadState,
  parseImport, progress, saveState, setCounter, toggleEarned,
} from './store.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const fmt = (n) => n.toLocaleString('en-US');

let trophies = [];
let byId = new Map();
let state = emptyState();
let selectedId = null;
const filters = { grade: 'all', kind: 'all', status: 'all', missableOnly: false, hideEarned: false, query: '' };

function persist() {
  saveState(window.localStorage, state);
}

function sourcesLine(trophy) {
  const parts = ['name, description and grade — Exophase'];
  parts.push(TARGETS[trophy.id]
    ? 'numeric target — PSNProfiles'
    : 'community discussion — PSNProfiles');
  return `Sources: ${parts.join('; ')}. Honesty note: GTA VI is not out yet, so this guide is our own advice reasoned from the official trophy description — it has not been checked in the game.`;
}

function renderHeader() {
  const p = progress(trophies, state);
  $('bigCount').textContent = String(p.earned);
  $('pctLine').textContent = `${p.pct}% earned`;
  $('progressBar').style.width = `${p.pct}%`;
  $('gradeTallies').innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `<li><span class="swatch ${g}"></span>${g}: ${p.perGrade[g].earned}/${p.perGrade[g].total}</li>`)
    .join('');
}

function counterMiniHtml(trophy) {
  const spec = TARGETS[trophy.id];
  if (!spec) return '';
  const v = counterOf(state, trophy.id);
  const pct = Math.min(100, Math.round((v / spec.target) * 100));
  return `<div class="counter-mini">
    <button type="button" data-act="dec" data-id="${trophy.id}" aria-label="decrease">−</button>
    <span>${fmt(v)} / ${fmt(spec.target)} ${esc(spec.unit)}</span>
    <span class="bar"><span class="bar-fill" style="width:${pct}%"></span></span>
    <button type="button" data-act="inc" data-id="${trophy.id}" aria-label="increase">+</button>
  </div>`;
}

function renderList() {
  const shown = filterTrophies(trophies, state, filters);
  $('listMeta').textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  $('trophyList').innerHTML = shown.map((trophy) => `
    <li class="trophy${isEarned(state, trophy.id) ? ' earned' : ''}${selectedId === trophy.id ? ' selected' : ''}" data-row="${trophy.id}">
      <input class="tick" type="checkbox" data-act="toggle" data-id="${trophy.id}" ${isEarned(state, trophy.id) ? 'checked' : ''} aria-label="mark earned">
      <div>
        <h3><a href="#/guide/${trophy.id}">${esc(displayName(trophy, state))}</a></h3>
        <p class="desc">${esc(displayDescription(trophy, state))}</p>
      </div>
      <div class="meta">
        ${isMissable(trophy.id) ? '<span class="badge-missable">missable?</span>' : ''}
        <span>${esc(KIND_LABELS[KIND_OF[trophy.id]])}</span>
        <span><span class="swatch ${trophy.grade}"></span>${trophy.grade}</span>
      </div>
      ${counterMiniHtml(trophy)}
    </li>`).join('');
  renderDetail();
}

function renderDetail() {
  const box = $('detail');
  const trophy = selectedId != null ? byId.get(selectedId) : null;
  if (!trophy) {
    box.innerHTML = `<h2>Pick a trophy</h2>
      <p class="kindline">Its full guide, sources and counter live here.</p>
      <p class="guide">Select any trophy on the left to read the guide we wrote for it. Story trophies you have not earned yet stay behind the spoiler shield until you tick them off — or turn the shield off above.</p>`;
    return;
  }
  const spec = TARGETS[trophy.id];
  const v = counterOf(state, trophy.id);
  const missable = MISSABLES.find((m) => m.id === trophy.id);
  box.innerHTML = `
    <span class="swatch ${trophy.grade}"></span> <span>${trophy.grade}</span>
    <h2>${esc(displayName(trophy, state))}</h2>
    <p class="kindline">${esc(KIND_LABELS[KIND_OF[trophy.id]])} · trophy #${trophy.id} of 55</p>
    <div class="official"><span class="label">Official description</span><p>${esc(displayDescription(trophy, state))}</p></div>
    ${missable && !isMasked(trophy, state) ? `<p class="missable-note"><strong>Possibly missable — unconfirmed inference.</strong> ${esc(missable.why)}</p>` : ''}
    <p class="guide">${esc(displayGuide(trophy, state))}</p>
    ${spec ? `<div class="counter-box">
        <button type="button" data-act="dec" data-id="${trophy.id}">−</button>
        <input type="number" data-counter-input="${trophy.id}" value="${v}" min="0" max="${spec.target}" aria-label="${esc(spec.label)}">
        <button type="button" data-act="inc" data-id="${trophy.id}">+</button>
        <span>${fmt(v)} / ${fmt(spec.target)} ${esc(spec.unit)} — ${esc(spec.label)}</span>
        <span class="bar"><span class="bar-fill" style="width:${Math.min(100, Math.round((v / spec.target) * 100))}%"></span></span>
      </div>` : ''}
    <button type="button" class="earn-btn" data-act="toggle" data-id="${trophy.id}">${isEarned(state, trophy.id) ? 'Mark as not earned' : 'Mark as earned'}</button>
    <p class="sources">${esc(sourcesLine(trophy))}</p>`;
}

function renderRoadmap() {
  $('roadmap').innerHTML = ROADMAP.map((stage, i) => {
    const done = stage.ids.filter((id) => isEarned(state, id)).length;
    return `<article class="stage">
      <h3>Stage ${i + 1} — ${esc(stage.title)}</h3>
      <p class="stage-meta">${done} of ${stage.ids.length} earned</p>
      <p class="note">${esc(stage.note)}</p>
      <div class="chips">${stage.ids.map((id) => {
        const trophy = byId.get(id);
        return `<a class="chip${isEarned(state, id) ? ' earned' : ''}" href="#/guide/${id}"><span class="swatch ${trophy.grade}"></span>${esc(displayName(trophy, state))}</a>`;
      }).join('')}</div>
    </article>`;
  }).join('');
}

function renderMissables() {
  $('missables').innerHTML = MISSABLES.map((m) => {
    const trophy = byId.get(m.id);
    return `<article class="missable-card">
      <span class="flag-label">Unconfirmed inference — not fact</span>
      <h3><a href="#/guide/${trophy.id}">${esc(trophy.name)}</a> <span class="swatch ${trophy.grade}"></span></h3>
      <blockquote>“${esc(trophy.description)}”</blockquote>
      <p>${esc(m.why)}</p>
      <p>Our advice: do it early, and keep a manual save from before the moment it might belong to.</p>
    </article>`;
  }).join('');
}

function render() {
  renderHeader();
  const view = currentView();
  $('view-list').hidden = view !== 'list';
  $('view-roadmap').hidden = view !== 'roadmap';
  $('view-missables').hidden = view !== 'missables';
  $('toolbar').style.display = view === 'list' ? '' : 'none';
  document.querySelectorAll('.tabs a').forEach((a) => {
    a.classList.toggle('active', a.dataset.tab === view);
  });
  if (view === 'list') renderList();
  if (view === 'roadmap') renderRoadmap();
  if (view === 'missables') renderMissables();
}

function currentView() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/roadmap')) return 'roadmap';
  if (hash.startsWith('#/missables')) return 'missables';
  return 'list';
}

function applyRoute() {
  const hash = location.hash || '#/';
  const guideMatch = hash.match(/^#\/guide\/(\d+)$/);
  const gradeMatch = hash.match(/^#\/grade\/(platinum|gold|silver|bronze)$/);
  if (guideMatch) {
    selectedId = Number(guideMatch[1]);
  } else if (gradeMatch) {
    filters.grade = gradeMatch[1];
    $('fGrade').value = filters.grade;
  }
  render();
  if (guideMatch) {
    const row = document.querySelector(`[data-row="${selectedId}"]`);
    if (row) row.scrollIntoView({ block: 'nearest' });
  }
}

// One delegated click handler for every dynamic control.
document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-act]');
  if (!el) return;
  const id = Number(el.dataset.id);
  if (el.dataset.act === 'toggle' && el.type !== 'checkbox') {
    toggleEarned(state, id);
    persist();
    render();
  } else if (el.dataset.act === 'inc' || el.dataset.act === 'dec') {
    const spec = TARGETS[id];
    if (!spec) return;
    const step = spec.target >= 10000 ? 1000 : 1;
    setCounter(state, id, counterOf(state, id) + (el.dataset.act === 'inc' ? step : -step));
    persist();
    render();
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('[data-act="toggle"]') && el.type === 'checkbox') {
    toggleEarned(state, Number(el.dataset.id));
    persist();
    render();
  }
  if (el.matches('[data-counter-input]')) {
    setCounter(state, Number(el.dataset.counterInput), el.value);
    persist();
    render();
  }
});

function msg(text) {
  $('importMsg').textContent = text;
}

function wireControls() {
  const kindSelect = $('fKind');
  for (const [key, label] of Object.entries(KIND_LABELS)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = label;
    kindSelect.appendChild(opt);
  }
  $('search').addEventListener('input', (e) => { filters.query = e.target.value; renderList(); });
  $('fGrade').addEventListener('change', (e) => { filters.grade = e.target.value; renderList(); });
  $('fKind').addEventListener('change', (e) => { filters.kind = e.target.value; renderList(); });
  $('fStatus').addEventListener('change', (e) => { filters.status = e.target.value; renderList(); });
  $('fMissable').addEventListener('change', (e) => { filters.missableOnly = e.target.checked; renderList(); });
  $('fHideEarned').addEventListener('change', (e) => { filters.hideEarned = e.target.checked; renderList(); });
  $('spoilerToggle').addEventListener('change', (e) => {
    state.spoilers = e.target.checked;
    persist();
    render();
  });
  $('btnExport').addEventListener('click', () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leonida-platinum-save.json';
    a.click();
    URL.revokeObjectURL(a.href);
    msg('Save downloaded.');
  });
  $('btnCopy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(exportState(state));
      msg('Save copied to the clipboard.');
    } catch {
      msg('Clipboard unavailable in this browser — use the download instead.');
    }
  });
  $('fileImport').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state = parseImport(await file.text(), trophies.map((t) => t.id));
      $('spoilerToggle').checked = state.spoilers;
      persist();
      render();
      msg('Save imported.');
    } catch (err) {
      msg(`Import failed: ${err.message}`);
    }
    e.target.value = '';
  });
  $('btnPaste').addEventListener('click', () => {
    try {
      state = parseImport($('pasteBox').value, trophies.map((t) => t.id));
      $('spoilerToggle').checked = state.spoilers;
      persist();
      render();
      msg('Save imported.');
    } catch (err) {
      msg(`Import failed: ${err.message}`);
    }
  });
  $('btnReset').addEventListener('click', () => {
    if (!window.confirm('Reset the tracker? Every tick and counter goes back to zero.')) return;
    state = emptyState();
    $('spoilerToggle').checked = state.spoilers;
    persist();
    render();
    msg('Tracker reset.');
  });
  window.addEventListener('hashchange', applyRoute);
}

async function boot() {
  const doc = await (await fetch('data/trophies.json')).json();
  trophies = doc.trophies;
  byId = new Map(trophies.map((t) => [t.id, t]));
  if (new URLSearchParams(location.search).has('seed')) {
    state = demoState();
    persist();
  } else {
    state = loadState(window.localStorage);
  }
  $('spoilerToggle').checked = state.spoilers;
  wireControls();
  applyRoute();
  requestAnimationFrame(() => { window.__shotReady = true; });
}

boot();

import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playTone, playClick, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="50" width="92" height="56" rx="12" fill="#e0a458" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="45" cy="58" rx="14" ry="8" fill="#6b5544"/>
  <rect x="68" y="52" width="24" height="14" rx="4" fill="#6b5544"/>
  <circle cx="30" cy="30" r="14" fill="#e88a9a"/>
  <rect x="60" y="18" width="26" height="26" rx="6" fill="#7fb99e"/>
</svg>`;

interface ShapeDef {
  id: string;
  color: string;
  note: number;
  /** Startposition auf dem Boden, bevor/nachdem die Form aus der Kiste geholt wird. */
  restX: number;
  restY: number;
  /** Umriss mit Gesicht — für die lose Form auf dem Boden. */
  svg: string;
  /** Reiner Umriss ohne Gesicht — fürs Loch in der Kiste. */
  path: string;
}

const SHAPES: ShapeDef[] = [
  {
    id: 'kreis',
    color: '#e88a9a',
    note: 0,
    restX: 14,
    restY: 80,
    path: '<circle cx="50" cy="50" r="42"/>',
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#e88a9a"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'quadrat',
    color: '#7fb99e',
    note: 2,
    restX: 33,
    restY: 88,
    path: '<rect x="8" y="8" width="84" height="84" rx="16"/>',
    svg: `<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="16" fill="#7fb99e"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'dreieck',
    color: '#f4c86b',
    note: 4,
    restX: 52,
    restY: 80,
    path: '<path d="M50 10 L92 88 L8 88 Z" stroke-linejoin="round"/>',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 10 L92 88 L8 88 Z" fill="#f4c86b" stroke-linejoin="round"/><circle cx="40" cy="66" r="4.5" fill="#4a4032"/><circle cx="60" cy="66" r="4.5" fill="#4a4032"/><path d="M40 76 Q50 82 60 76" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'stern',
    color: '#7ea3c9',
    note: 5,
    restX: 71,
    restY: 88,
    path: '<path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z"/>',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z" fill="#7ea3c9"/><circle cx="42" cy="48" r="4" fill="#4a4032"/><circle cx="58" cy="48" r="4" fill="#4a4032"/><path d="M42 58 Q50 63 58 58" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'herz',
    color: '#c896d8',
    note: 7,
    restX: 88,
    restY: 78,
    path: '<path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z"/>',
    svg: `<svg viewBox="0 0 100 100"><path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z" fill="#c896d8"/><circle cx="40" cy="34" r="4.5" fill="#4a4032"/><circle cx="60" cy="34" r="4.5" fill="#4a4032"/><path d="M40 44 Q50 50 60 44" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  },
];

interface ShapeState {
  id: string;
  xPct: number;
  yPct: number;
  placed: boolean;
}

interface SorterState {
  shapes: ShapeState[];
}

const STATE_KEY = 'sortierer';
const STATE_VERSION = 1;

function defaultShapes(): ShapeState[] {
  return SHAPES.map((s) => ({ id: s.id, xPct: s.restX, yPct: s.restY, placed: false }));
}

let state: SorterState = { shapes: defaultShapes() };
let stageEl: HTMLElement | null = null;
let cleanup: Array<() => void> = [];

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function stateOf(id: string): ShapeState {
  return state.shapes.find((s) => s.id === id) ?? { id, xPct: 50, yPct: 80, placed: false };
}

function persist(): void {
  saveState<SorterState>(STATE_KEY, STATE_VERSION, state);
}

function mount(container: HTMLElement): void {
  cleanup = [];
  const loaded = loadState<SorterState>(STATE_KEY, STATE_VERSION, { shapes: defaultShapes() });
  // Fehlende/zusätzliche Einträge robust gegen künftige Änderungen an SHAPES abfangen.
  state = { shapes: SHAPES.map((s) => loaded.shapes.find((x) => x.id === s.id) ?? { id: s.id, xPct: s.restX, yPct: s.restY, placed: false }) };

  container.innerHTML = `
    <div class="sorter-stage">
      <div class="sorter-box">
        ${SHAPES.map(
          (s) => `
          <div class="sorter-hole" data-hole="${s.id}">
            <svg class="hole-cut" viewBox="0 0 100 100">${s.path}</svg>
            <div class="hole-fuellung" data-fill="${s.id}" style="--fill-color:${s.color}">${s.svg}</div>
          </div>
        `,
        ).join('')}
      </div>
      <div class="sorter-boden" id="sorterBoden">
        ${SHAPES.map(
          (s) => `<div class="sorter-form" data-shape="${s.id}" style="left:${s.restX}%;top:${s.restY}%">${s.svg}</div>`,
        ).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('.sorter-stage')!;

  SHAPES.forEach((s) => {
    const formEl = container.querySelector<HTMLElement>(`.sorter-form[data-shape="${s.id}"]`)!;
    const holeEl = container.querySelector<HTMLElement>(`.sorter-hole[data-hole="${s.id}"]`)!;
    const fillEl = container.querySelector<HTMLElement>(`.hole-fuellung[data-fill="${s.id}"]`)!;
    applyShapeVisual(s.id, formEl, fillEl);
    setupDrag(s, formEl);
    setupPop(s, holeEl, formEl, fillEl);
  });
}

function applyShapeVisual(id: string, formEl: HTMLElement, fillEl: HTMLElement): void {
  const st = stateOf(id);
  formEl.style.left = `${st.xPct}%`;
  formEl.style.top = `${st.yPct}%`;
  formEl.classList.toggle('versteckt', st.placed);
  fillEl.classList.toggle('gefuellt', st.placed);
}

function setupDrag(def: ShapeDef, formEl: HTMLElement): void {
  let dragging = false;
  let moved = 0;
  let startX = 0;
  let startY = 0;

  on(formEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    const st = stateOf(def.id);
    if (st.placed) return;
    dragging = true;
    moved = 0;
    startX = pe.clientX;
    startY = pe.clientY;
    formEl.classList.add('greift');
    try {
      formEl.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
  });

  on(formEl, 'pointermove', (e) => {
    if (!dragging || !stageEl) return;
    const pe = e as PointerEvent;
    moved = Math.max(moved, Math.hypot(pe.clientX - startX, pe.clientY - startY));
    const r = stageEl.getBoundingClientRect();
    const st = stateOf(def.id);
    st.xPct = clamp(((pe.clientX - r.left) / r.width) * 100, 3, 97);
    st.yPct = clamp(((pe.clientY - r.top) / r.height) * 100, 3, 97);
    formEl.style.left = `${st.xPct}%`;
    formEl.style.top = `${st.yPct}%`;
  });

  const end = (e: Event) => {
    if (!dragging) return;
    dragging = false;
    const pe = e as PointerEvent;
    formEl.classList.remove('greift');
    try {
      formEl.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }

    if (moved < 6) {
      // Kurzer Tipp statt Ziehen: nicht einsortieren, nur ein kleines Wackeln.
      wackeln(formEl);
      playClick(420);
      persist();
      return;
    }

    const holeEl = stageEl?.querySelector<HTMLElement>(`.sorter-hole[data-hole="${def.id}"]`);
    if (holeEl && stageEl) {
      const hr = holeEl.getBoundingClientRect();
      const hx = hr.left + hr.width / 2;
      const hy = hr.top + hr.height / 2;
      const dist = Math.hypot(pe.clientX - hx, pe.clientY - hy);
      if (dist < 60) {
        const fillEl = stageEl.querySelector<HTMLElement>(`.hole-fuellung[data-fill="${def.id}"]`)!;
        const st = stateOf(def.id);
        st.placed = true;
        applyShapeVisual(def.id, formEl, fillEl);
        thunk(fillEl, def.note);
        persist();
        return;
      }
    }

    persist();
  };

  on(formEl, 'pointerup', end);
  on(formEl, 'pointercancel', end);
}

function setupPop(def: ShapeDef, holeEl: HTMLElement, formEl: HTMLElement, fillEl: HTMLElement): void {
  on(holeEl, 'pointerdown', (e) => {
    const st = stateOf(def.id);
    if (!st.placed) return;
    e.preventDefault();
    st.placed = false;
    st.xPct = def.restX;
    st.yPct = def.restY;
    applyShapeVisual(def.id, formEl, fillEl);
    pop(formEl);
    playTone({ freq: PENTATONIC_HZ[def.note % PENTATONIC_HZ.length] * 1.5, duration: 0.18, attack: 0.005, release: 0.25, type: 'triangle', gain: 0.24 });
    persist();
  });
}

function thunk(fillEl: HTMLElement, note: number): void {
  fillEl.classList.remove('plumpst');
  void fillEl.offsetWidth;
  fillEl.classList.add('plumpst');
  playTone({ freq: PENTATONIC_HZ[note % PENTATONIC_HZ.length], duration: 0.22, attack: 0.004, release: 0.3, type: 'sine', gain: 0.32 });
  window.setTimeout(() => fillEl.classList.remove('plumpst'), 400);
}

function pop(formEl: HTMLElement): void {
  formEl.classList.remove('huepft');
  void formEl.offsetWidth;
  formEl.classList.add('huepft');
  window.setTimeout(() => formEl.classList.remove('huepft'), 500);
}

function wackeln(formEl: HTMLElement): void {
  formEl.classList.remove('wackelt');
  void formEl.offsetWidth;
  formEl.classList.add('wackelt');
  window.setTimeout(() => formEl.classList.remove('wackelt'), 400);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  stageEl = null;
  state = { shapes: defaultShapes() };
}

export const sortierer: Toy = {
  id: 'sortierer',
  accent: '#e0a458',
  tileIcon,
  mount,
  unmount,
};

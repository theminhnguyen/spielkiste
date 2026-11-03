import type { Toy } from './types';
import { playClick, playGlide, playTone, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="8" y="8" width="104" height="104" rx="22" fill="#2a3558"/>
  <circle cx="70" cy="56" r="34" fill="#f6e7c4"/>
  <circle cx="70" cy="62" r="16" fill="#8a8fa0"/>
  <path d="M58 48 L56 32 L66 44 Z M82 48 L84 32 L74 44 Z" fill="#8a8fa0"/>
  <circle cx="64" cy="58" r="3" fill="#f7d570"/><circle cx="76" cy="58" r="3" fill="#f7d570"/>
  <path d="M18 104 L40 82" stroke="#e0a458" stroke-width="12" stroke-linecap="round"/>
  <path d="M36 86 L48 74" stroke="#f7d570" stroke-width="14" stroke-linecap="round"/>
</svg>`;

/**
 * Dinge im dunklen Zimmer. Position in % der Bühne, Breite in vmin — so passt
 * das Zimmer hoch- wie querkant. `y` ist der Mittelpunkt, bei `unten` die
 * Unterkante (Dinge, die auf dem Boden stehen; der Boden beginnt bei 70 %). Die Gruppe `.lp-bewegt` in
 * jedem Bild bewegt sich, wenn das Licht darauf fällt (style.css).
 */
const DINGE = [
  {
    id: 'mond',
    x: 62,
    y: 22,
    b: 26,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="4" y="4" width="92" height="92" rx="6" fill="#c9a37e"/>
      <rect x="10" y="10" width="80" height="80" fill="#34407a"/>
      <g class="lp-bewegt"><path d="M60 24 a22 22 0 1 0 14 38 a17 17 0 1 1 -14 -38 Z" fill="#f6e7b4"/></g>
      <g class="lp-sterne" fill="#fdf6ea"><circle cx="24" cy="24" r="2.4"/><circle cx="34" cy="64" r="2"/><circle cx="76" cy="78" r="2.2"/><circle cx="20" cy="80" r="1.8"/></g>
      <path d="M50 10 V90 M10 50 H90" stroke="#c9a37e" stroke-width="5"/>
    </svg>`,
  },
  {
    id: 'uhr',
    x: 33,
    y: 20,
    b: 15,
    svg: `<svg viewBox="0 0 100 140" width="100%" height="100%">
      <g class="lp-bewegt"><path d="M50 70 V118" stroke="#a9835e" stroke-width="4"/><circle cx="50" cy="122" r="11" fill="#f4c86b"/></g>
      <path d="M50 4 L92 34 V74 H8 V34 Z" fill="#b48a62"/>
      <circle cx="50" cy="44" r="24" fill="#fffaf2"/>
      <path d="M50 44 V28 M50 44 L62 50" stroke="#4a4032" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'eule',
    x: 86,
    y: 40,
    b: 22,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="0" y="80" width="100" height="10" rx="3" fill="#a9835e"/>
      <ellipse cx="50" cy="54" rx="28" ry="30" fill="#b48a62"/>
      <ellipse cx="50" cy="64" rx="18" ry="18" fill="#e2c3a0"/>
      <path d="M26 30 L30 16 L40 28 Z M74 30 L70 16 L60 28 Z" fill="#b48a62"/>
      <circle cx="39" cy="44" r="11" fill="#fffaf2"/><circle cx="61" cy="44" r="11" fill="#fffaf2"/>
      <circle cx="39" cy="44" r="5.5" fill="#4a4032"/><circle cx="61" cy="44" r="5.5" fill="#4a4032"/>
      <g class="lp-bewegt"><rect x="27" y="32" width="24" height="24" rx="11" fill="#b48a62"/><rect x="49" y="32" width="24" height="24" rx="11" fill="#b48a62"/></g>
      <path d="M46 54 L54 54 L50 62 Z" fill="#f4a24e"/>
      <path d="M40 82 V76 M46 82 V76 M54 82 V76 M60 82 V76" stroke="#f4a24e" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'katze',
    x: 18,
    y: 95,
    unten: true,
    b: 20,
    svg: `<svg viewBox="0 0 100 80" width="100%" height="100%">
      <g class="lp-bewegt">
        <path d="M80 60 C96 56 98 40 90 34" stroke="#8a8fa0" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="58" cy="60" rx="28" ry="16" fill="#8a8fa0"/>
        <circle cx="30" cy="46" r="20" fill="#8a8fa0"/>
        <path d="M14 36 L12 16 L28 30 Z M46 36 L48 16 L32 30 Z" fill="#8a8fa0"/>
        <path d="M17 32 L16 22 L25 30 Z M43 32 L44 22 L35 30 Z" fill="#f2b8c6"/>
        <ellipse cx="23" cy="45" rx="4" ry="5" fill="#f7d570"/><ellipse cx="37" cy="45" rx="4" ry="5" fill="#f7d570"/>
        <ellipse cx="23" cy="45" rx="1.6" ry="4" fill="#2c3e50"/><ellipse cx="37" cy="45" rx="1.6" ry="4" fill="#2c3e50"/>
        <path d="M28 53 L32 53 L30 56 Z" fill="#e88a9a"/>
      </g>
    </svg>`,
  },
  {
    id: 'bett',
    x: 24,
    y: 92,
    unten: true,
    b: 44,
    deko: true,
    svg: `<svg viewBox="0 0 200 110" width="100%" height="100%">
      <rect x="4" y="10" width="14" height="96" rx="5" fill="#b48a62"/>
      <rect x="182" y="40" width="14" height="66" rx="5" fill="#b48a62"/>
      <rect x="10" y="48" width="180" height="26" rx="8" fill="#7ea3c9"/>
      <path d="M60 40 H186 V66 H60 Z" fill="#e88a9a"/>
      <path d="M60 50 H186 M60 58 H186" stroke="#f2b8c6" stroke-width="3"/>
      <ellipse cx="40" cy="44" rx="22" ry="10" fill="#fffaf2"/>
    </svg>`,
  },
  {
    id: 'teddy',
    x: 55,
    y: 90,
    unten: true,
    b: 18,
    svg: `<svg viewBox="0 0 100 110" width="100%" height="100%">
      <circle cx="28" cy="18" r="10" fill="#9a6b45"/><circle cx="72" cy="18" r="10" fill="#9a6b45"/>
      <ellipse cx="50" cy="80" rx="30" ry="28" fill="#9a6b45"/>
      <ellipse cx="50" cy="84" rx="16" ry="16" fill="#e2c3a0"/>
      <circle cx="50" cy="38" r="26" fill="#9a6b45"/>
      <ellipse cx="50" cy="46" rx="11" ry="8" fill="#e2c3a0"/>
      <circle cx="41" cy="34" r="3.6" fill="#4a4032"/><circle cx="59" cy="34" r="3.6" fill="#4a4032"/>
      <ellipse cx="50" cy="43" rx="4" ry="3" fill="#4a4032"/>
      <path d="M45 50 Q50 54 55 50" stroke="#4a4032" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="74" rx="9" ry="14" fill="#9a6b45"/>
      <g class="lp-bewegt"><ellipse cx="80" cy="66" rx="9" ry="14" fill="#9a6b45"/></g>
      <ellipse cx="32" cy="104" rx="11" ry="7" fill="#9a6b45"/><ellipse cx="68" cy="104" rx="11" ry="7" fill="#9a6b45"/>
    </svg>`,
  },
  {
    id: 'fisch',
    x: 80,
    y: 88,
    unten: true,
    b: 20,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="20" y="86" width="60" height="12" rx="3" fill="#a9835e"/>
      <path d="M26 20 H74 C96 34 96 76 74 88 H26 C4 76 4 34 26 20 Z" fill="#cfe7f5" opacity="0.9"/>
      <path d="M12 46 C30 40 70 40 88 46 C94 64 86 80 74 88 H26 C14 80 6 64 12 46 Z" fill="#7ec8d8"/>
      <g class="lp-bewegt">
        <path d="M34 62 C40 52 58 52 64 62 C58 72 40 72 34 62 Z" fill="#f4a24e"/>
        <path d="M64 62 L76 54 L76 70 Z" fill="#f4a24e"/>
        <circle cx="42" cy="60" r="2.4" fill="#2c3e50"/>
      </g>
      <g class="lp-blasen" fill="#fffaf2"><circle cx="40" cy="44" r="3"/><circle cx="46" cy="34" r="2.4"/><circle cx="42" cy="26" r="2"/></g>
    </svg>`,
  },
  {
    id: 'maus',
    x: 93,
    y: 70.5,
    unten: true,
    b: 12,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M8 100 V58 C8 30 92 30 92 58 V100 Z" fill="#3b3226"/>
      <g class="lp-bewegt">
        <circle cx="32" cy="58" r="11" fill="#b9b3ad"/><circle cx="68" cy="58" r="11" fill="#b9b3ad"/>
        <circle cx="32" cy="58" r="6" fill="#f2b8c6"/><circle cx="68" cy="58" r="6" fill="#f2b8c6"/>
        <ellipse cx="50" cy="78" rx="22" ry="20" fill="#cdc7c1"/>
        <circle cx="42" cy="74" r="3.6" fill="#2c3e50"/><circle cx="58" cy="74" r="3.6" fill="#2c3e50"/>
        <circle cx="50" cy="84" r="3.4" fill="#e88a9a"/>
      </g>
    </svg>`,
  },
] as const;

type DingId = (typeof DINGE)[number]['id'];

/** Lichtkegel-Radius in vmin — muss zu --lp-r in style.css passen. */
const LICHT_VMIN = 30;
/** Ein Ding gilt als angeleuchtet, wenn es so weit in den Lichtkegel ragt. */
const TREFFER_ANTEIL = 0.75;
/** Frühestens nach dieser Zeit reagiert dasselbe Ding erneut. */
const RUHE_MS = 1600;

interface DingRt {
  id: DingId;
  el: HTMLElement;
  x: number;
  y: number;
  hell: boolean;
  zuletzt: number;
}

let stageEl: HTMLElement | null = null;
let dunkelEl: HTMLElement | null = null;
let dinge: DingRt[] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let resizeObs: ResizeObserver | null = null;
let aktivePointer = new Set<number>();
/** Lichtposition in % der Bühne — überlebt Drehen und Größenänderung. */
let lichtX = 50;
let lichtY = 50;

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function later(fn: () => void, ms: number): number {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
  return id;
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  aktivePointer = new Set();
  // Das Licht beginnt auf dem Teddy — beim Öffnen ist gleich jemand zu sehen.
  lichtX = 55;
  lichtY = 78;

  container.innerHTML = `
    <div class="lampe-stage" id="lampeStage" style="--lp-r:${LICHT_VMIN}vmin">
      <div class="lp-wand"></div>
      <div class="lp-boden"></div>
      ${DINGE.map(
        (d) =>
          `<div class="lp-ding lp-${d.id}${'unten' in d ? ' unten' : ''}" data-id="${d.id}" style="left:${d.x}%;top:${d.y}%;width:${d.b}vmin">${d.svg}</div>`,
      ).join('')}
      <div class="lp-dunkel" id="lampeDunkel"></div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#lampeStage')!;
  dunkelEl = container.querySelector<HTMLElement>('#lampeDunkel')!;
  dinge = DINGE.filter((d) => !('deko' in d)).map((d) => ({
    id: d.id,
    el: container.querySelector<HTMLElement>(`.lp-ding[data-id="${d.id}"]`)!,
    x: 0,
    y: 0,
    hell: false,
    zuletzt: 0,
  }));

  // Größen nie nur einmal beim Mount messen (Bühne kann noch 0×0 sein) —
  // siehe CLAUDE.md, „Klang-Kleckse in der Ecke".
  resizeObs = new ResizeObserver(() => {
    messen();
    setzeLicht();
  });
  resizeObs.observe(stageEl);
  messen();
  setzeLicht();

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    aktivePointer.add(pe.pointerId);
    leuchte(pe.clientX, pe.clientY);
    // Antippen eines schon beleuchteten Dings lässt es gleich noch einmal reagieren.
    const ding = dinge.find((d) => d.el.contains(pe.target as Node));
    if (ding && ding.hell && performance.now() - ding.zuletzt > 600) reagieren(ding);
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    if (!aktivePointer.has(pe.pointerId)) return;
    leuchte(pe.clientX, pe.clientY);
  });
  const end = (e: Event) => aktivePointer.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

/**
 * Ding-Mittelpunkte in Bühnenkoordinaten. Über clientWidth auf die echte
 * Bühnengröße zurückgerechnet — stimmt also auch, während die Spielansicht
 * noch hineinzoomt (siehe CLAUDE.md).
 */
function messen(): void {
  if (!stageEl) return;
  const sr = stageEl.getBoundingClientRect();
  const s = stageEl.clientWidth / (sr.width || 1);
  for (const d of dinge) {
    const r = d.el.getBoundingClientRect();
    d.x = (r.left - sr.left + r.width / 2) * s;
    d.y = (r.top - sr.top + r.height / 2) * s;
  }
}

function leuchte(clientX: number, clientY: number): void {
  if (!stageEl) return;
  const r = stageEl.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return;
  lichtX = ((clientX - r.left) / r.width) * 100;
  lichtY = ((clientY - r.top) / r.height) * 100;
  setzeLicht();
}

/** Die Dunkel-Ebene ist doppelt so groß wie die Bühne, ihr Loch sitzt in der Mitte — nur verschieben, nie neu malen. */
function setzeLicht(): void {
  if (!stageEl || !dunkelEl) return;
  const w = stageEl.clientWidth;
  const h = stageEl.clientHeight;
  const px = (lichtX / 100) * w;
  const py = (lichtY / 100) * h;
  dunkelEl.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;

  const radius = (Math.min(w, h) * LICHT_VMIN) / 100;
  const now = performance.now();
  for (const d of dinge) {
    const nah = Math.hypot(d.x - px, d.y - py) < radius * TREFFER_ANTEIL;
    if (nah && !d.hell && now - d.zuletzt > RUHE_MS) reagieren(d);
    d.hell = nah;
  }
}

function reagieren(d: DingRt): void {
  d.zuletzt = performance.now();
  d.el.classList.remove('wach');
  void d.el.offsetWidth;
  d.el.classList.add('wach');
  later(() => d.el.classList.remove('wach'), 1500);
  KLANG[d.id]();
}

const KLANG: Record<DingId, () => void> = {
  mond: () => {
    [5, 7].forEach((n, i) => later(() => playTone({ freq: PENTATONIC_HZ[n] * 2, duration: 0.1, attack: 0.01, release: 0.8, gain: 0.08 }), i * 160));
  },
  uhr: () => {
    [0, 380, 760].forEach((ms, i) => later(() => playClick(i % 2 === 0 ? 1250 : 950), ms));
  },
  eule: () => {
    // „Huhu" — zwei weiche, tiefe Rufe.
    playGlide(420, 380, 0.22, 0.14);
    later(() => playGlide(400, 340, 0.4, 0.14), 320);
  },
  katze: () => {
    // „Miau" — hoch, kurz steigend, lang fallend.
    playGlide(520, 820, 0.18, 0.12, 'triangle');
    later(() => playGlide(820, 430, 0.42, 0.12, 'triangle'), 170);
  },
  bett: () => {},
  teddy: () => {
    playGlide(150, 110, 0.5, 0.18, 'triangle');
  },
  fisch: () => {
    [0, 140, 280].forEach((ms, i) => later(() => playGlide(260 + i * 80, 620 + i * 120, 0.09, 0.12), ms));
  },
  maus: () => {
    [0, 150].forEach((ms) => later(() => playTone({ freq: 1870, duration: 0.05, attack: 0.005, release: 0.06, gain: 0.1 }), ms));
  },
};

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  resizeObs?.disconnect();
  resizeObs = null;
  aktivePointer = new Set();
  dinge = [];
  stageEl = null;
  dunkelEl = null;
}

export const lampe: Toy = {
  id: 'lampe',
  name: 'Taschenlampe',
  accent: '#f7d570',
  tileIcon,
  mount,
  unmount,
};

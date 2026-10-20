import type { Toy } from './types';
import { playTone, playWhoosh } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <line x1="6" y1="20" x2="114" y2="20" stroke="#a9835e" stroke-width="3"/>
  <circle cx="60" cy="72" r="26" fill="#c9a37e"/>
  <circle cx="40" cy="50" r="10" fill="#c9a37e"/><circle cx="80" cy="50" r="10" fill="#c9a37e"/>
  <circle cx="51" cy="70" r="4" fill="#4a4032"/><circle cx="69" cy="70" r="4" fill="#4a4032"/>
  <ellipse cx="60" cy="81" rx="7" ry="4.5" fill="#8a7255"/>
  <path d="M18 22 H102 V40 C90 46 30 46 18 40 Z" fill="#e88a9a"/>
  <rect x="34" y="16" width="6" height="12" rx="2" fill="#f4c86b"/><rect x="80" y="16" width="6" height="12" rx="2" fill="#f4c86b"/>
</svg>`;

/**
 * Tiere als Kopf mit einer winkenden Pfote (Gruppe `.kk-pfote`). viewBox
 * 0 0 120 120, Kopf mittig, Pfote rechts unten.
 */
const TIERE: Record<string, string> = {
  baer: `
    <circle cx="34" cy="34" r="15" fill="#c9a37e"/><circle cx="86" cy="34" r="15" fill="#c9a37e"/>
    <circle cx="34" cy="34" r="7" fill="#e2c3a0"/><circle cx="86" cy="34" r="7" fill="#e2c3a0"/>
    <circle cx="60" cy="62" r="38" fill="#c9a37e"/>
    <ellipse cx="60" cy="76" rx="16" ry="12" fill="#e2c3a0"/>
    <circle cx="46" cy="56" r="5" fill="#4a4032"/><circle cx="74" cy="56" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="71" rx="6" ry="4.5" fill="#4a4032"/>
    <path d="M53 81 Q60 87 67 81" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="kk-pfote"><ellipse cx="100" cy="92" rx="13" ry="15" fill="#c9a37e"/><ellipse cx="100" cy="95" rx="7" ry="8" fill="#e2c3a0"/></g>`,
  hase: `
    <ellipse cx="44" cy="22" rx="10" ry="24" fill="#f3e7db"/><ellipse cx="76" cy="22" rx="10" ry="24" fill="#f3e7db"/>
    <ellipse cx="44" cy="24" rx="5" ry="16" fill="#f2b8c6"/><ellipse cx="76" cy="24" rx="5" ry="16" fill="#f2b8c6"/>
    <circle cx="60" cy="66" r="34" fill="#f3e7db"/>
    <circle cx="48" cy="62" r="5" fill="#4a4032"/><circle cx="72" cy="62" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="74" rx="5" ry="3.5" fill="#e88a9a"/>
    <path d="M60 78 V83 M53 83 Q60 88 67 83" stroke="#4a4032" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g class="kk-pfote"><ellipse cx="98" cy="94" rx="12" ry="14" fill="#f3e7db"/></g>`,
  katze: `
    <path d="M26 50 L22 16 L52 40 Z" fill="#e0a458"/><path d="M94 50 L98 16 L68 40 Z" fill="#e0a458"/>
    <path d="M30 44 L28 26 L46 40 Z" fill="#f2b8c6"/><path d="M90 44 L92 26 L74 40 Z" fill="#f2b8c6"/>
    <ellipse cx="60" cy="66" rx="36" ry="32" fill="#e0a458"/>
    <circle cx="47" cy="62" r="5" fill="#4a4032"/><circle cx="73" cy="62" r="5" fill="#4a4032"/>
    <path d="M56 72 L64 72 L60 77 Z" fill="#e88a9a"/>
    <path d="M51 80 Q56 84 60 79 Q64 84 69 80" stroke="#8a5a2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M28 72 H40 M28 78 H40 M80 72 H92 M80 78 H92" stroke="#8a5a2e" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <g class="kk-pfote"><ellipse cx="100" cy="94" rx="12" ry="14" fill="#e0a458"/></g>`,
  hund: `
    <ellipse cx="60" cy="64" rx="34" ry="34" fill="#e8d2b4"/>
    <ellipse cx="28" cy="58" rx="12" ry="24" fill="#a9835e" transform="rotate(14 28 58)"/>
    <ellipse cx="92" cy="58" rx="12" ry="24" fill="#a9835e" transform="rotate(-14 92 58)"/>
    <circle cx="70" cy="50" r="10" fill="#a9835e" opacity="0.55"/>
    <circle cx="48" cy="58" r="5" fill="#4a4032"/><circle cx="72" cy="58" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="72" rx="7" ry="5" fill="#4a4032"/>
    <path d="M60 77 V82 M52 82 Q60 90 68 82" stroke="#4a4032" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M56 84 Q60 94 64 84 Z" fill="#e88a9a"/>
    <g class="kk-pfote"><ellipse cx="100" cy="94" rx="12" ry="14" fill="#e8d2b4"/></g>`,
  maus: `
    <circle cx="32" cy="36" r="18" fill="#b9b3ad"/><circle cx="88" cy="36" r="18" fill="#b9b3ad"/>
    <circle cx="32" cy="36" r="10" fill="#f2b8c6"/><circle cx="88" cy="36" r="10" fill="#f2b8c6"/>
    <ellipse cx="60" cy="68" rx="30" ry="28" fill="#cdc7c1"/>
    <circle cx="49" cy="63" r="4.6" fill="#4a4032"/><circle cx="71" cy="63" r="4.6" fill="#4a4032"/>
    <circle cx="60" cy="76" r="5" fill="#e88a9a"/>
    <path d="M40 76 H50 M40 81 H50 M70 76 H80 M70 81 H80" stroke="#8a8078" stroke-width="2" stroke-linecap="round"/>
    <g class="kk-pfote"><ellipse cx="96" cy="94" rx="11" ry="13" fill="#cdc7c1"/></g>`,
  ente: `
    <circle cx="60" cy="60" r="34" fill="#f7d570"/>
    <path d="M58 22 C54 14 60 8 64 14 C66 10 72 12 68 20 Z" fill="#f7d570"/>
    <circle cx="48" cy="54" r="5" fill="#4a4032"/><circle cx="72" cy="54" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="72" rx="16" ry="8" fill="#f4a56b"/>
    <path d="M46 72 Q60 78 74 72" stroke="#e0864a" stroke-width="2" fill="none"/>
    <circle cx="40" cy="68" r="5" fill="#f4a56b" opacity="0.45"/><circle cx="80" cy="68" r="5" fill="#f4a56b" opacity="0.45"/>
    <g class="kk-pfote"><path d="M88 96 C94 80 112 80 112 92 C112 102 100 108 88 96 Z" fill="#f2c45a"/></g>`,
  frosch: `
    <circle cx="40" cy="34" r="16" fill="#7fb99e"/><circle cx="80" cy="34" r="16" fill="#7fb99e"/>
    <circle cx="40" cy="32" r="9" fill="#fffaf2"/><circle cx="80" cy="32" r="9" fill="#fffaf2"/>
    <circle cx="41" cy="33" r="5" fill="#4a4032"/><circle cx="81" cy="33" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="66" rx="40" ry="30" fill="#7fb99e"/>
    <path d="M36 70 Q60 92 84 70" stroke="#3f6b4c" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="62" r="5" fill="#e88a9a" opacity="0.5"/><circle cx="84" cy="62" r="5" fill="#e88a9a" opacity="0.5"/>
    <g class="kk-pfote"><ellipse cx="102" cy="94" rx="12" ry="12" fill="#7fb99e"/><circle cx="96" cy="84" r="4" fill="#7fb99e"/><circle cx="104" cy="82" r="4" fill="#7fb99e"/><circle cx="111" cy="86" r="4" fill="#7fb99e"/></g>`,
  pinguin: `
    <ellipse cx="60" cy="62" rx="34" ry="36" fill="#3f4a5c"/>
    <path d="M60 34 C40 34 34 54 36 70 C38 88 50 96 60 96 C70 96 82 88 84 70 C86 54 80 34 60 34 Z" fill="#fffaf2"/>
    <circle cx="50" cy="56" r="4.6" fill="#3f4a5c"/><circle cx="70" cy="56" r="4.6" fill="#3f4a5c"/>
    <path d="M52 66 L68 66 L60 75 Z" fill="#f4a56b"/>
    <circle cx="44" cy="70" r="5" fill="#f2b8c6" opacity="0.6"/><circle cx="76" cy="70" r="5" fill="#f2b8c6" opacity="0.6"/>
    <g class="kk-pfote"><ellipse cx="98" cy="88" rx="9" ry="18" fill="#3f4a5c" transform="rotate(-24 98 88)"/></g>`,
};
const TIER_NAMEN = Object.keys(TIERE);

const TUECHER = [
  { farbe: '#e88a9a', muster: '#f2b8c6' },
  { farbe: '#7ea3c9', muster: '#a9c4e0' },
  { farbe: '#f4c86b', muster: '#fae3a6' },
  { farbe: '#7fb99e', muster: '#acd6c0' },
  { farbe: '#c896d8', muster: '#dfc1ea' },
  { farbe: '#e0a458', muster: '#efc895' },
];

/** Wie lange ein Tier herausguckt, bevor das Tuch wieder herunterfällt. */
const OFFEN_MS = 2400;

interface Versteck {
  cell: HTMLElement;
  tierEl: HTMLElement;
  tier: string;
  offen: boolean;
  zuTimer: number | null;
}

let stageEl: HTMLElement | null = null;
let verstecke: Versteck[] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let pointerZelle = new Map<number, number>();
let lastRufAt = 0;

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

function tierSvg(name: string): string {
  return `<svg viewBox="0 0 120 120" width="100%" height="100%">${TIERE[name]}</svg>`;
}

/** Zufälliges Tier, das gerade in keinem anderen Versteck sitzt — damit es überrascht. */
function anderesTier(ausser: string): string {
  const belegt = new Set(verstecke.map((v) => v.tier));
  const frei = TIER_NAMEN.filter((t) => t !== ausser && !belegt.has(t));
  const pool = frei.length > 0 ? frei : TIER_NAMEN.filter((t) => t !== ausser);
  return pool[Math.floor(Math.random() * pool.length)];
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  pointerZelle = new Map();
  verstecke = [];

  const start = [...TIER_NAMEN].sort(() => Math.random() - 0.5).slice(0, TUECHER.length);
  container.innerHTML = `
    <div class="kuckuck-stage" id="kuckuckStage">
      <div class="kuckuck-raster">
        ${TUECHER.map(
          (t, i) => `
          <div class="kk-versteck" data-i="${i}">
            <div class="kk-leine"></div>
            <div class="kk-tier">${tierSvg(start[i])}</div>
            <div class="kk-tuch" style="--tuch:${t.farbe};--muster:${t.muster}"></div>
            <span class="kk-klammer l"></span><span class="kk-klammer r"></span>
          </div>`,
        ).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#kuckuckStage')!;
  verstecke = [...container.querySelectorAll<HTMLElement>('.kk-versteck')].map((cell, i) => ({
    cell,
    tierEl: cell.querySelector<HTMLElement>('.kk-tier')!,
    tier: start[i],
    offen: false,
    zuTimer: null,
  }));

  // Wie bei den Trommeln: Jeder Patscher trifft das nächstgelegene Versteck,
  // es gibt keine toten Flächen dazwischen.
  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    const i = naechstesVersteck(pe.clientX, pe.clientY);
    pointerZelle.set(pe.pointerId, i);
    aufdecken(i);
  });
  // Wischen über mehrere Tücher deckt jedes auf, über das der Finger fährt.
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    if (!pointerZelle.has(pe.pointerId)) return;
    const i = verstecktUnter(pe.clientX, pe.clientY);
    if (i !== pointerZelle.get(pe.pointerId)) {
      pointerZelle.set(pe.pointerId, i);
      if (i >= 0) aufdecken(i);
    }
  });
  const end = (e: Event) => pointerZelle.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

function naechstesVersteck(x: number, y: number): number {
  let best = 0;
  let bestD = Infinity;
  verstecke.forEach((v, i) => {
    const r = v.cell.getBoundingClientRect();
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

function verstecktUnter(x: number, y: number): number {
  return verstecke.findIndex((v) => {
    const r = v.cell.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  });
}

function aufdecken(i: number): void {
  const v = verstecke[i];
  if (!v) return;
  if (v.zuTimer !== null) {
    window.clearTimeout(v.zuTimer);
    timers.delete(v.zuTimer);
  }
  const warOffen = v.offen;
  v.offen = true;
  v.cell.classList.add('offen');
  // Winken neu starten — auch wenn das Tier schon herausguckt.
  v.tierEl.classList.remove('winkt');
  void v.tierEl.offsetWidth;
  v.tierEl.classList.add('winkt');

  const now = performance.now();
  if (now - lastRufAt > 320) {
    lastRufAt = now;
    if (!warOffen) playWhoosh();
    // „Kuck-uck": große Terz abwärts, wie bei der Kuckucksuhr.
    later(() => playTone({ freq: 659.25, duration: 0.14, attack: 0.02, release: 0.22, gain: 0.24 }), 120);
    later(() => playTone({ freq: 523.25, duration: 0.22, attack: 0.02, release: 0.3, gain: 0.22 }), 330);
  }

  v.zuTimer = later(() => {
    v.zuTimer = null;
    v.offen = false;
    v.cell.classList.remove('offen');
    v.tierEl.classList.remove('winkt');
    // Erst wenn das Tuch wieder ganz unten ist, heimlich ein neues Tier
    // dahintersetzen — beim nächsten Mal guckt jemand anderes heraus.
    later(() => {
      if (v.offen) return;
      v.tier = anderesTier(v.tier);
      v.tierEl.innerHTML = tierSvg(v.tier);
    }, 600);
  }, OFFEN_MS);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  pointerZelle = new Map();
  verstecke = [];
  stageEl = null;
}

export const kuckuck: Toy = {
  id: 'kuckuck',
  name: 'Kuckuck',
  accent: '#e88a9a',
  tileIcon,
  mount,
  unmount,
};

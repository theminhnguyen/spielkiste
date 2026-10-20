import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playWhoosh, playGlide, playTone, playZipSound, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="26" y="10" width="68" height="100" rx="32" fill="#f6efe3" stroke="#e0d2bc" stroke-width="3"/>
  <rect x="34" y="18" width="52" height="84" rx="25" fill="#cfe7f5"/>
  <rect x="34" y="62" width="52" height="40" fill="#6fa8c9"/>
  <path d="M34 62 H86 V78 C76 92 44 92 34 78 Z" fill="#6fa8c9"/>
  <circle cx="50" cy="40" r="11" fill="#fff"/>
  <circle cx="62" cy="36" r="13" fill="#fff"/>
  <circle cx="72" cy="42" r="9" fill="#fff"/>
  <ellipse cx="60" cy="84" rx="13" ry="6" fill="#4f6f8f"/>
</svg>`;

/** Wolken-Mittelpunkte in % der Fensterfläche — überlappend, damit sie zusammen alles verdecken. */
const WOLKEN: Array<[number, number]> = [
  [20, 14], [62, 10], [88, 26],
  [12, 38], [50, 34], [86, 50],
  [24, 62], [66, 66],
  [16, 88], [58, 90], [90, 84],
];

const SZENEN = ['meer', 'berge', 'stadt', 'insel'] as const;
type Szene = (typeof SZENEN)[number];

const SZENE_SVG: Record<Szene, string> = {
  meer: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="190" fill="#cfe7f5"/>
      <rect y="140" width="300" height="50" fill="#e4f2fa"/>
      <circle cx="226" cy="74" r="26" fill="#f7d570"/>
      <rect y="186" width="300" height="214" fill="#6fa8c9"/>
      <rect y="300" width="300" height="100" fill="#5f97ba"/>
      <path d="M20 230 q10 -6 20 0 M180 220 q10 -6 20 0 M240 260 q10 -6 20 0 M40 350 q10 -6 20 0 M200 370 q10 -6 20 0" stroke="#e4f2fa" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      <g class="sz-boot">
        <path d="M44 214 H96 L88 226 H52 Z" fill="#a9835e"/>
        <path d="M70 212 V176 L94 210 Z" fill="#fffaf2"/>
        <path d="M68 212 V184 L50 210 Z" fill="#e88a9a"/>
      </g>
      <g class="sz-fontaene">
        <path d="M150 262 C146 240 140 230 128 226 M150 262 C150 236 150 226 150 216 M150 262 C154 240 160 230 172 226" stroke="#fffaf2" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="126" cy="222" r="5" fill="#fffaf2"/><circle cx="150" cy="210" r="6" fill="#fffaf2"/><circle cx="174" cy="222" r="5" fill="#fffaf2"/>
      </g>
      <g class="sz-wal">
        <path d="M86 300 C86 272 126 258 168 262 C204 266 224 282 224 298 C224 314 204 324 168 324 C126 324 86 320 86 300 Z" fill="#4f6f8f"/>
        <path d="M222 296 L252 276 L246 300 L254 322 Z" fill="#4f6f8f"/>
        <path d="M100 308 C126 322 176 324 210 310 C190 324 120 326 100 308 Z" fill="#cfe2ee"/>
        <circle cx="122" cy="290" r="5" fill="#fffaf2"/><circle cx="123" cy="290" r="2.6" fill="#2c3e50"/>
        <path d="M104 302 q10 6 20 2" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  berge: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d8ecf6"/>
      <circle cx="60" cy="70" r="22" fill="#f7d570"/>
      <path d="M-20 260 L60 140 L120 220 L190 120 L260 210 L320 160 L320 300 L-20 300 Z" fill="#b9c7d6"/>
      <path d="M-20 300 L50 190 L110 260 L170 170 L240 250 L320 200 L320 330 L-20 330 Z" fill="#8fa5b8"/>
      <path d="M50 190 L66 214 L58 210 L50 220 L42 210 L36 212 Z M170 170 L190 200 L180 196 L170 206 L160 196 L152 198 Z" fill="#fffaf2"/>
      <rect y="300" width="300" height="100" fill="#9ec99f"/>
      <path d="M-10 340 C60 320 120 360 180 340 C230 324 270 350 310 336 L310 352 C270 366 230 340 180 356 C120 376 60 336 -10 356 Z" fill="#7ec8d8"/>
      <g fill="#7fb99e"><path d="M30 300 l10 -24 l10 24 z"/><path d="M250 304 l9 -22 l9 22 z"/><path d="M270 300 l8 -20 l8 20 z"/></g>
      <g><rect x="196" y="312" width="22" height="16" fill="#fffaf2"/><path d="M193 313 L207 300 L221 313 Z" fill="#e88a9a"/><rect x="226" y="316" width="16" height="12" fill="#fffaf2"/><path d="M224 317 L234 307 L244 317 Z" fill="#e0a458"/></g>
      <g class="sz-voegel">
        <path d="M0 0 q8 -8 16 0 q8 -8 16 0" transform="translate(20 110)" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M0 0 q6 -6 12 0 q6 -6 12 0" transform="translate(54 96)" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M0 0 q7 -7 14 0 q7 -7 14 0" transform="translate(40 130)" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  stadt: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#2a3558"/>
      <g class="sz-sterne" fill="#fdf6ea">
        <circle cx="40" cy="60" r="2.5"/><circle cx="100" cy="40" r="2"/><circle cx="160" cy="80" r="2.5"/><circle cx="70" cy="130" r="2"/><circle cx="140" cy="150" r="1.8"/><circle cx="260" cy="140" r="2.2"/><circle cx="30" cy="190" r="1.8"/>
      </g>
      <path d="M232 52 a30 30 0 1 0 22 50 a24 24 0 1 1 -22 -50 Z" fill="#f4e7b8"/>
      <g fill="#3b4670">
        <rect x="0" y="250" width="50" height="150"/><rect x="56" y="210" width="44" height="190"/><rect x="106" y="270" width="40" height="130"/>
        <rect x="152" y="190" width="52" height="210"/><rect x="210" y="240" width="40" height="160"/><rect x="256" y="220" width="44" height="180"/>
      </g>
      <g class="sz-fenster">
        <rect x="10" y="266" width="10" height="12"/><rect x="30" y="296" width="10" height="12"/><rect x="66" y="226" width="10" height="12"/>
        <rect x="82" y="256" width="10" height="12"/><rect x="66" y="296" width="10" height="12"/><rect x="116" y="286" width="10" height="12"/>
        <rect x="164" y="206" width="10" height="12"/><rect x="184" y="236" width="10" height="12"/><rect x="164" y="276" width="10" height="12"/>
        <rect x="220" y="256" width="10" height="12"/><rect x="266" y="236" width="10" height="12"/><rect x="282" y="276" width="10" height="12"/>
      </g>
      <rect y="380" width="300" height="20" fill="#232c4a"/>
    </svg>`,
  insel: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="200" fill="#cfe9f2"/>
      <circle cx="80" cy="80" r="24" fill="#f7d570"/>
      <rect y="196" width="300" height="204" fill="#7cc7c4"/>
      <rect y="320" width="300" height="80" fill="#5fb3b0"/>
      <ellipse cx="150" cy="300" rx="96" ry="24" fill="#f1d9a6"/>
      <path d="M150 296 C148 260 156 236 170 212" stroke="#a9835e" stroke-width="9" fill="none" stroke-linecap="round"/>
      <g fill="#7fb99e">
        <path d="M170 212 C150 196 126 200 114 212 C134 206 152 208 170 212 Z"/>
        <path d="M170 212 C188 194 214 196 226 208 C206 204 188 206 170 212 Z"/>
        <path d="M170 212 C160 186 170 170 186 166 C178 180 174 196 170 212 Z"/>
        <path d="M170 212 C176 230 196 238 210 236 C194 230 182 222 170 212 Z"/>
      </g>
      <g><rect x="96" y="276" width="26" height="18" fill="#e0a458"/><path d="M90 278 L109 262 L128 278 Z" fill="#a9835e"/></g>
      <g class="sz-delfin">
        <path d="M0 0 C10 -18 34 -22 52 -12 L62 -20 L60 -8 C64 -4 66 0 64 4 C44 8 18 8 0 0 Z" fill="#7ea3c9"/>
        <circle cx="46" cy="-8" r="2.2" fill="#2c3e50"/>
      </g>
      <path d="M30 240 q10 -6 20 0 M220 250 q10 -6 20 0 M60 360 q10 -6 20 0 M230 350 q10 -6 20 0" stroke="#e8f6f5" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    </svg>`,
};

/** Wolke in einem Farbton — überlappende Wolken in leicht verschiedenen Weißtönen wirken plastisch. */
function wolkeSvg(farbe: string): string {
  return `
<svg viewBox="0 0 200 120" width="100%" height="100%">
  <g fill="${farbe}">
    <circle cx="60" cy="70" r="38"/><circle cx="102" cy="52" r="46"/><circle cx="146" cy="70" r="36"/>
    <circle cx="28" cy="88" r="26"/><circle cx="172" cy="88" r="25"/>
    <rect x="28" y="70" width="146" height="44" rx="22"/>
  </g>
</svg>`;
}
const WOLKEN_FARBEN = ['#ffffff', '#f3f7fb', '#e9f0f6', '#fbfcfe'];

interface FensterState {
  szene: number;
}
const STATE_KEY = 'fenster';
const STATE_VERSION = 1;

/** Ohne Berührung so lange warten, bis die Wolken zurückziehen. */
const RUECKKEHR_MS = 6000;
/** Dauer, bis alle Wolken wieder da sind (Staffelung + Übergang). */
const RUECKKEHR_DAUER_MS = WOLKEN.length * 220 + 2700;

interface WolkeRt {
  el: HTMLElement;
  x: number;
  y: number;
  weg: boolean;
}

let stageEl: HTMLElement | null = null;
let innenEl: HTMLElement | null = null;
let dunstEl: HTMLElement | null = null;
let rolloEl: HTMLElement | null = null;
let szenenEls: HTMLElement[] = [];
let wolken: WolkeRt[] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let rueckkehrTimer: number | null = null;
let szene = 0;
let ganzFrei = false;
let rolloUnten = false;
let lastRolloAt = 0;
let lastWhooshAt = 0;
let lastFeierAt = 0;
let aktivePointer = new Set<number>();

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

/** Timer fürs Aufräumen merken — gefeuerte vergessen sich selbst (siehe trommeln.ts). */
function later(fn: () => void, ms: number): number {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
  return id;
}

function clearLater(id: number | null): void {
  if (id === null) return;
  window.clearTimeout(id);
  timers.delete(id);
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  aktivePointer = new Set();
  rueckkehrTimer = null;
  ganzFrei = false;
  rolloUnten = false;
  szene = loadState<FensterState>(STATE_KEY, STATE_VERSION, { szene: 0 }).szene % SZENEN.length;

  container.innerHTML = `
    <div class="fenster-stage" id="fensterStage">
      <div class="fenster">
        <div class="fenster-innen" id="fensterInnen">
          ${SZENEN.map((s, i) => `<div class="fenster-szene sz-${s}${i === szene ? ' aktiv' : ''}">${SZENE_SVG[s]}</div>`).join('')}
          <div class="fenster-dunst" id="fensterDunst"></div>
          ${WOLKEN.map(
            ([x, y], i) => `
            <div class="fenster-wolke" style="left:${x}%;top:${y}%" data-i="${i}">
              <div class="fenster-wolke-innen" style="animation-delay:${(-i * 1.3).toFixed(1)}s">${wolkeSvg(WOLKEN_FARBEN[i % WOLKEN_FARBEN.length])}</div>
            </div>`,
          ).join('')}
          <div class="fenster-rollo" id="fensterRollo"><span class="fenster-rollo-griff"></span></div>
          <div class="fenster-schatten"></div>
        </div>
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#fensterStage')!;
  innenEl = container.querySelector<HTMLElement>('#fensterInnen')!;
  dunstEl = container.querySelector<HTMLElement>('#fensterDunst')!;
  rolloEl = container.querySelector<HTMLElement>('#fensterRollo')!;
  szenenEls = [...container.querySelectorAll<HTMLElement>('.fenster-szene')];
  wolken = WOLKEN.map(([x, y], i) => ({
    el: container.querySelector<HTMLElement>(`.fenster-wolke[data-i="${i}"]`)!,
    x,
    y,
    weg: false,
  }));
  updateDunst();

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    aktivePointer.add(pe.pointerId);
    beruehrt(pe.clientX, pe.clientY, true);
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    if (!aktivePointer.has(pe.pointerId)) return;
    beruehrt(pe.clientX, pe.clientY, false);
  });
  const end = (e: Event) => aktivePointer.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

/**
 * Fingerposition in % der Fensterfläche. Tipps außerhalb des Fensters werden
 * an den Fensterrand gezogen — so wirkt auch ein Patscher auf die Kabinenwand.
 */
function imFenster(clientX: number, clientY: number): { x: number; y: number; drin: boolean } {
  const r = innenEl!.getBoundingClientRect();
  const x = ((clientX - r.left) / r.width) * 100;
  const y = ((clientY - r.top) / r.height) * 100;
  const drin = x >= 0 && x <= 100 && y >= 0 && y <= 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)), drin };
}

function beruehrt(clientX: number, clientY: number, neu: boolean): void {
  if (!innenEl) return;
  const p = imFenster(clientX, clientY);
  const now = performance.now();

  // Rollo: unten → jeder neue Tipp zieht es hoch. Oben → ein Tipp auf den
  // sichtbaren Streifen (oberste ~14 %) zieht es herunter.
  if (neu && now - lastRolloAt > 700) {
    if (rolloUnten) {
      setRollo(false);
      return;
    }
    if (p.drin && p.y < 14) {
      setRollo(true);
      return;
    }
  }
  if (rolloUnten) return;

  planeRueckkehr();

  let weggeschoben = 0;
  const r = innenEl.getBoundingClientRect();
  // Reichweite in % der längeren Fensterseite: Ein Finger räumt eine Bahn
  // frei, ein Patscher mit der ganzen Hand gleich ein großes Stück.
  const reichweite = 20;
  for (const w of wolken) {
    if (w.weg) continue;
    const dx = (w.x - p.x) * (r.width / 100);
    const dy = (w.y - p.y) * (r.height / 100);
    const d = Math.hypot(dx, dy);
    if (d > (reichweite / 100) * Math.max(r.width, r.height)) continue;
    const n = d < 1 ? { x: Math.random() - 0.5, y: Math.random() - 0.5 } : { x: dx / d, y: dy / d };
    const len = Math.hypot(n.x, n.y) || 1;
    const weit = Math.max(r.width, r.height) * 1.1;
    w.el.style.setProperty('--wx', `${((n.x / len) * weit).toFixed(0)}px`);
    w.el.style.setProperty('--wy', `${((n.y / len) * weit).toFixed(0)}px`);
    w.el.style.removeProperty('--delay');
    w.el.classList.add('weg');
    w.weg = true;
    weggeschoben++;
  }

  if (weggeschoben > 0 && now - lastWhooshAt > 140) {
    lastWhooshAt = now;
    playWhoosh();
  }
  updateDunst();

  const uebrig = wolken.filter((w) => !w.weg).length;
  if (uebrig <= 1 && !ganzFrei) {
    ganzFrei = true;
    later(feiern, 450);
  } else if (ganzFrei && neu && p.drin && uebrig <= 3) {
    // Freie Sicht: Antippen der Landschaft lässt sie noch einmal „feiern".
    feiern();
  }
}

/** Dunst über der Landschaft: dicht, solange viele Wolken da sind — verdeckt Lücken zwischen ihnen. */
function updateDunst(): void {
  if (!dunstEl) return;
  const da = wolken.filter((w) => !w.weg).length;
  const anteil = Math.max(0, (da - 2) / (wolken.length - 2));
  dunstEl.style.opacity = (anteil * 0.92).toFixed(2);
}

function feiern(): void {
  const now = performance.now();
  if (now - lastFeierAt < 1600) return;
  lastFeierAt = now;
  const el = szenenEls[szene];
  if (!el) return;
  el.classList.remove('feiert');
  void el.offsetWidth;
  el.classList.add('feiert');
  later(() => el.classList.remove('feiert'), 2600);

  const s = SZENEN[szene];
  if (s === 'meer') {
    playGlide(170, 115, 0.7, 0.24);
    later(() => playGlide(115, 190, 0.6, 0.2), 650);
  } else if (s === 'berge') {
    [0, 160, 380].forEach((ms, i) => later(() => playGlide(1700 + i * 200, 2500 + i * 150, 0.09, 0.07), ms));
  } else if (s === 'stadt') {
    [5, 6, 7, 5].forEach((note, i) =>
      later(() => playTone({ freq: PENTATONIC_HZ[note], duration: 0.2, attack: 0.01, release: 0.6, gain: 0.16 }), i * 180),
    );
  } else {
    playWhoosh();
    later(() => playGlide(420, 900, 0.3, 0.12), 300);
  }
}

/** Nach einer Weile ohne Berührung ziehen die Wolken zurück — und danach kommt eine neue Landschaft. */
function planeRueckkehr(): void {
  clearLater(rueckkehrTimer);
  rueckkehrTimer = later(() => {
    rueckkehrTimer = null;
    const zurueck = wolken.filter((w) => w.weg);
    if (zurueck.length === 0) return;
    zurueck.forEach((w, i) => {
      w.el.style.setProperty('--delay', `${i * 220}ms`);
      w.el.classList.remove('weg');
      w.weg = false;
    });
    updateDunst();
    if (ganzFrei) {
      later(naechsteSzene, RUECKKEHR_DAUER_MS);
    }
  }, RUECKKEHR_MS);
}

function naechsteSzene(): void {
  // Nur wechseln, wenn die Wolken wirklich wieder zu sind — sonst sähe das
  // Kind den Wechsel.
  if (wolken.some((w) => w.weg)) return;
  ganzFrei = false;
  szenenEls[szene]?.classList.remove('aktiv');
  szene = (szene + 1) % SZENEN.length;
  szenenEls[szene]?.classList.add('aktiv');
  saveState<FensterState>(STATE_KEY, STATE_VERSION, { szene });
}

function setRollo(unten: boolean): void {
  rolloUnten = unten;
  lastRolloAt = performance.now();
  rolloEl?.classList.toggle('unten', unten);
  playZipSound(!unten);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  rueckkehrTimer = null;
  aktivePointer = new Set();
  wolken = [];
  szenenEls = [];
  stageEl = null;
  innenEl = null;
  dunstEl = null;
  rolloEl = null;
}

export const fenster: Toy = {
  id: 'fenster',
  name: 'Flugzeugfenster',
  accent: '#7ea3c9',
  tileIcon,
  mount,
  unmount,
};

import type { Toy } from './types';
import { playBounce, playGlide, playGurgle, playRustle, playSplash } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M10 62 H110 V74 C110 96 94 106 76 106 H44 C26 106 10 96 10 74 Z" fill="#fffaf2"/>
  <path d="M18 66 H102 V74 C102 90 90 98 76 98 H44 C30 98 18 90 18 74 Z" fill="#7ec8d8"/>
  <rect x="6" y="56" width="108" height="10" rx="5" fill="#fffaf2"/>
  <circle cx="60" cy="40" r="13" fill="#f7d570"/>
  <path d="M40 58 C40 46 52 42 62 48 C72 44 84 48 82 58 Z" fill="#f7d570"/>
  <path d="M71 38 L82 40 L71 44 Z" fill="#f4a24e"/>
  <circle cx="63" cy="37" r="2.4" fill="#4a4032"/>
  <circle cx="26" cy="54" r="7" fill="#fffaf2"/><circle cx="36" cy="52" r="5" fill="#fffaf2"/><circle cx="94" cy="54" r="6" fill="#fffaf2"/>
</svg>`;

/** Ente (viewBox 0 0 100 90), Wasserlinie bei y ≈ 72. */
function enteSvg(farbe: string, schnabel: string): string {
  return `<svg viewBox="0 0 100 90" width="100%" height="100%">
    <path d="M12 52 C12 40 26 36 40 44 C46 32 70 30 84 40 C96 50 92 76 70 80 H32 C18 80 12 66 12 52 Z" fill="${farbe}"/>
    <circle cx="40" cy="30" r="20" fill="${farbe}"/>
    <path d="M14 30 C14 24 22 24 24 28 L24 36 C20 38 14 36 14 30 Z" fill="${schnabel}"/>
    <circle cx="34" cy="25" r="3.6" fill="#4a4032"/><circle cx="35" cy="24" r="1.2" fill="#fffaf2"/>
    <path d="M52 52 C60 46 74 48 78 56 C70 62 58 62 52 52 Z" fill="#000" opacity="0.08"/>
  </svg>`;
}

const BOOT = `<svg viewBox="0 0 100 90" width="100%" height="100%">
  <path d="M50 10 V60" stroke="#a9835e" stroke-width="4"/>
  <path d="M52 12 L84 54 H52 Z" fill="#fffaf2"/>
  <path d="M48 20 L22 54 H48 Z" fill="#e88a9a"/>
  <path d="M8 60 H92 L80 80 H20 Z" fill="#7ea3c9"/>
  <circle cx="34" cy="69" r="3.6" fill="#fffaf2"/><circle cx="50" cy="69" r="3.6" fill="#fffaf2"/><circle cx="66" cy="69" r="3.6" fill="#fffaf2"/>
</svg>`;

/** Schwimmende Sachen: x in % der Wasserbreite, b = Breite in vmin. */
const SPIELZEUG = [
  { art: 'ente', x: 24, b: 15, svg: enteSvg('#f7d570', '#f4a24e') },
  { art: 'ente', x: 46, b: 10, svg: enteSvg('#f7d570', '#f4a24e') },
  { art: 'boot', x: 66, b: 14, svg: BOOT },
  { art: 'ente', x: 84, b: 11, svg: enteSvg('#f2b8c6', '#e88a9a') },
];

const SCHAUM_MAX = 14;
const BLASEN_MAX = 8;

type Wasserstand = 'voll' | 'leert' | 'leer' | 'fuellt';

interface SpielzeugRt {
  bahn: HTMLElement;
  el: HTMLElement;
  art: string;
  x: number;
}

interface Zug {
  t: SpielzeugRt;
  startX: number;
  gezogen: boolean;
}

let stageEl: HTMLElement | null = null;
let wanneEl: HTMLElement | null = null;
let wasserEl: HTMLElement | null = null;
let schaumEl: HTMLElement | null = null;
let hahnEl: HTMLElement | null = null;
let spielzeug: SpielzeugRt[] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let zuege = new Map<number, Zug>();
let stand: Wasserstand = 'voll';
let lastSplashAt = 0;

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

function retrigger(el: HTMLElement, klasse: string, ms: number): void {
  el.classList.remove(klasse);
  void el.offsetWidth;
  el.classList.add(klasse);
  later(() => el.classList.remove(klasse), ms);
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  zuege = new Map();
  stand = 'voll';

  container.innerHTML = `
    <div class="bad-stage" id="badStage">
      <div class="bw-hahn" id="bwHahn">
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect x="70" y="10" width="24" height="30" rx="6" fill="#c9d6e3"/>
          <path d="M80 26 H30 C20 26 14 32 14 42 V52 H30 V44 C30 40 32 38 36 38 H80 Z" fill="#c9d6e3"/>
          <rect x="74" y="0" width="16" height="12" rx="4" fill="#7ea3c9"/>
          <rect x="10" y="50" width="24" height="8" rx="3" fill="#a9bccf"/>
        </svg>
        <div class="bw-strahl"></div>
      </div>
      <div class="bw-wanne" id="bwWanne">
        <div class="bw-innen">
          <div class="bw-strahl-innen" id="bwStrahlInnen"></div>
          <div class="bw-wasser" id="bwWasser">
            <div class="bw-welle"></div>
            <div class="bw-schaum" id="bwSchaum"></div>
            ${SPIELZEUG.map(
              (s, i) => `
              <div class="bw-bahn" data-i="${i}" style="--x:${s.x}">
                <div class="bw-ding bw-${s.art}" style="width:${s.b}vmin">
                  <div class="bw-wipp" style="animation-delay:${(-i * 0.9).toFixed(1)}s">${s.svg}</div>
                </div>
              </div>`,
            ).join('')}
          </div>
        </div>
        <div class="bw-rand"></div>
        <div class="bw-stoepsel" id="bwStoepsel">
          <svg viewBox="0 0 40 120" width="100%" height="100%">
            <path d="M20 0 V92" stroke="#a9bccf" stroke-width="4" stroke-dasharray="6 3"/>
            <rect x="6" y="90" width="28" height="22" rx="8" fill="#5f6b7a"/>
          </svg>
        </div>
        <div class="bw-fuss l"></div><div class="bw-fuss r"></div>
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#badStage')!;
  wanneEl = container.querySelector<HTMLElement>('#bwWanne')!;
  wasserEl = container.querySelector<HTMLElement>('#bwWasser')!;
  schaumEl = container.querySelector<HTMLElement>('#bwSchaum')!;
  hahnEl = container.querySelector<HTMLElement>('#bwHahn')!;
  spielzeug = [...container.querySelectorAll<HTMLElement>('.bw-bahn')].map((bahn, i) => ({
    bahn,
    el: bahn.querySelector<HTMLElement>('.bw-ding')!,
    art: SPIELZEUG[i].art,
    x: SPIELZEUG[i].x,
  }));
  // Etwas Schaum gibt es von Anfang an.
  [12, 18, 58, 90].forEach((x) => neueSchaumblase(x));

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    const ziel = pe.target as Element;

    const ding = spielzeug.find((t) => t.el.contains(ziel));
    if (ding && (stand === 'voll' || stand === 'fuellt')) {
      try {
        stageEl?.setPointerCapture(pe.pointerId);
      } catch {
        /* Pointer bereits inaktiv */
      }
      zuege.set(pe.pointerId, { t: ding, startX: pe.clientX, gezogen: false });
      quietschen(ding);
      return;
    }
    const blase = ziel.closest<HTMLElement>('.bw-blase');
    if (blase && schaumEl?.contains(blase)) {
      platzen(blase);
      return;
    }
    if (ziel.closest('#bwHahn')) {
      wasserLaufen();
      return;
    }
    if (ziel.closest('#bwStoepsel')) {
      retrigger(ziel.closest<HTMLElement>('#bwStoepsel')!, 'gezogen', 600);
      ablassen();
      return;
    }
    if (wanneEl && pe.clientY >= wanneEl.getBoundingClientRect().top - 20) {
      patschen(pe.clientX);
    } else {
      seifenblase(pe.clientX, pe.clientY);
    }
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    const z = zuege.get(pe.pointerId);
    if (!z || !wasserEl) return;
    if (!z.gezogen && Math.abs(pe.clientX - z.startX) < 10) return;
    z.gezogen = true;
    z.t.bahn.classList.add('zieht');
    const r = wasserEl.getBoundingClientRect();
    setzeX(z.t, ((pe.clientX - r.left) / r.width) * 100);
  });
  const end = (e: Event) => {
    const z = zuege.get((e as PointerEvent).pointerId);
    if (!z) return;
    zuege.delete((e as PointerEvent).pointerId);
    z.t.bahn.classList.remove('zieht');
  };
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

function setzeX(t: SpielzeugRt, x: number): void {
  t.x = Math.max(9, Math.min(91, x));
  t.bahn.style.setProperty('--x', t.x.toFixed(1));
}

function quietschen(t: SpielzeugRt): void {
  retrigger(t.el, 'gedrueckt', 500);
  if (t.art === 'ente') {
    playGlide(1050, 1500, 0.08, 0.12, 'triangle');
    later(() => playGlide(1500, 1150, 0.12, 0.1, 'triangle'), 80);
  } else {
    // Boot: „Tuut".
    playGlide(300, 290, 0.35, 0.12, 'triangle');
  }
}

/** Platscher an der Wasseroberfläche über dem Finger: Tropfen, Ring, und die Sachen in der Nähe schaukeln weg. */
function patschen(clientX: number): void {
  if (!stageEl || !wasserEl) return;
  if (stand === 'leer') {
    einlassen();
    return;
  }
  if (stand !== 'voll' && stand !== 'fuellt') return;

  const wr = wasserEl.getBoundingClientRect();
  const sr = stageEl.getBoundingClientRect();
  const s = stageEl.clientWidth / (sr.width || 1);
  const xPct = Math.max(2, Math.min(98, ((clientX - wr.left) / wr.width) * 100));

  // Tropfen auf der Bühne (nicht im Wasser), damit sie über den Wannenrand fliegen dürfen.
  if (stageEl.querySelectorAll('.bw-spritzer').length < 6) {
    const sp = document.createElement('div');
    sp.className = 'bw-spritzer';
    sp.style.left = `${((wr.left + (wr.width * xPct) / 100 - sr.left) * s).toFixed(1)}px`;
    sp.style.top = `${((wr.top - sr.top) * s).toFixed(1)}px`;
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('span');
      d.className = 'bw-tropfen';
      d.style.setProperty('--dx', `${((i - 2.5) * 3 + (Math.random() - 0.5) * 3).toFixed(1)}vmin`);
      d.style.setProperty('--dy', `${(-8 - Math.random() * 8).toFixed(1)}vmin`);
      sp.appendChild(d);
    }
    stageEl.appendChild(sp);
    later(() => sp.remove(), 800);
  }

  const ring = document.createElement('div');
  ring.className = 'bw-ring';
  ring.style.left = `${xPct}%`;
  wasserEl.appendChild(ring);
  later(() => ring.remove(), 900);

  for (const t of spielzeug) {
    if ([...zuege.values()].some((z) => z.t === t)) continue;
    const dx = t.x - xPct;
    if (Math.abs(dx) < 20) {
      setzeX(t, t.x + Math.sign(dx || Math.random() - 0.5) * (20 - Math.abs(dx)) * 0.9);
      retrigger(t.el, 'schaukelt', 1200);
    }
  }

  const now = performance.now();
  if (now - lastSplashAt > 90) {
    lastSplashAt = now;
    playSplash();
  }
}

function neueSchaumblase(xPct: number): void {
  if (!schaumEl || schaumEl.childElementCount >= SCHAUM_MAX) return;
  const b = document.createElement('div');
  b.className = 'bw-blase';
  b.style.left = `${xPct.toFixed(1)}%`;
  b.style.setProperty('--g', `${(5 + Math.random() * 4).toFixed(1)}vmin`);
  schaumEl.appendChild(b);
}

function platzen(b: HTMLElement): void {
  if (b.classList.contains('platzt')) return;
  b.classList.add('platzt');
  playBounce(1300 + Math.random() * 400, 0.16);
  later(() => b.remove(), 260);
}

/** Wasserhahn: Strahl läuft kurz, plätschert, und es gibt neuen Schaum. */
function wasserLaufen(): void {
  if (!hahnEl) return;
  if (stand === 'leer') {
    einlassen();
    return;
  }
  strahlMessen();
  retrigger(hahnEl, 'laeuft', 1400);
  playRustle(0.09, 1.1);
  [0, 300, 600].forEach((ms) => later(() => neueSchaumblase(70 + Math.random() * 24), ms));
}

/** Stöpsel ziehen: Wasser gurgelt ab, die Sachen sinken mit. Danach läuft es von selbst wieder ein. */
function ablassen(): void {
  if (!wasserEl || stand !== 'voll') return;
  stand = 'leert';
  wasserEl.classList.add('leer');
  playGurgle(2.2);
  later(() => {
    stand = 'leer';
    schaumEl?.replaceChildren();
    later(() => {
      if (stand === 'leer') einlassen();
    }, 1500);
  }, 2400);
}

function einlassen(): void {
  if (!wasserEl || !hahnEl || stand !== 'leer') return;
  stand = 'fuellt';
  strahlMessen();
  hahnEl.classList.add('laeuft');
  wasserEl.classList.remove('leer');
  [0, 900, 1800].forEach((ms) => later(() => playRustle(0.08, 1.0), ms));
  later(() => {
    stand = 'voll';
    hahnEl?.classList.remove('laeuft');
    [20, 50, 80].forEach((x) => neueSchaumblase(x));
  }, 2700);
}

/**
 * Der Strahl hat zwei Teile: vom Hahn bis zum Wannenrand (über allem) und in
 * der Wanne bis zum Boden — dieser liegt hinter dem Wasser, endet also immer
 * genau an der Oberfläche, auch während das Wasser steigt.
 */
function strahlMessen(): void {
  const strahl = hahnEl?.querySelector<HTMLElement>('.bw-strahl');
  const innen = wanneEl?.querySelector<HTMLElement>('.bw-innen');
  const strahlInnen = wanneEl?.querySelector<HTMLElement>('#bwStrahlInnen');
  if (!strahl || !innen || !strahlInnen || !stageEl) return;
  const sr = stageEl.getBoundingClientRect();
  const s = stageEl.clientWidth / (sr.width || 1);
  const st = strahl.getBoundingClientRect();
  const ir = innen.getBoundingClientRect();
  strahl.style.setProperty('--strahl', `${Math.max(0, (ir.top - st.top) * s).toFixed(0)}px`);
  strahlInnen.style.left = `${((st.left - ir.left) * s - innen.clientLeft).toFixed(0)}px`;
  strahlInnen.style.width = `${(st.width * s).toFixed(0)}px`;
}

/** Klick über der Wanne: eine Seifenblase steigt auf. */
function seifenblase(clientX: number, clientY: number): void {
  if (!stageEl) return;
  if (stageEl.querySelectorAll('.bw-seifenblase').length >= BLASEN_MAX) return;
  const sr = stageEl.getBoundingClientRect();
  const s = stageEl.clientWidth / (sr.width || 1);
  const b = document.createElement('div');
  b.className = 'bw-seifenblase';
  b.style.left = `${((clientX - sr.left) * s).toFixed(1)}px`;
  b.style.top = `${((clientY - sr.top) * s).toFixed(1)}px`;
  stageEl.appendChild(b);
  playGlide(380, 820, 0.12, 0.1);
  later(() => b.remove(), 2600);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  zuege = new Map();
  spielzeug = [];
  stageEl = null;
  wanneEl = null;
  wasserEl = null;
  schaumEl = null;
  hahnEl = null;
}

export const badewanne: Toy = {
  id: 'badewanne',
  name: 'Badewanne',
  accent: '#7ec8d8',
  tileIcon,
  mount,
  unmount,
};

import type { Toy } from './types';
import { playClick, playDrum, playGlide, playRustle, playTone, playWhoosh } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <ellipse cx="38" cy="26" rx="9" ry="22" fill="#f3e7db"/><ellipse cx="66" cy="26" rx="9" ry="22" fill="#f3e7db"/>
  <ellipse cx="38" cy="28" rx="4.5" ry="14" fill="#f2b8c6"/><ellipse cx="66" cy="28" rx="4.5" ry="14" fill="#f2b8c6"/>
  <circle cx="52" cy="66" r="30" fill="#f3e7db"/>
  <circle cx="42" cy="60" r="4.5" fill="#4a4032"/><circle cx="62" cy="60" r="4.5" fill="#4a4032"/>
  <ellipse cx="52" cy="80" rx="9" ry="7" fill="#7a4a3a"/>
  <path d="M76 98 L112 70 C116 66 110 60 106 64 L72 92 Z" fill="#f4a24e"/>
  <path d="M106 64 C108 56 114 54 116 50 M108 66 C116 64 118 60 120 58" stroke="#7fb99e" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`;

/**
 * Tiere (viewBox 0 0 200 200). Jedes hat ein geschlossenes (`.ft-maul-zu`)
 * und ein offenes Maul (`.ft-maul-auf`) — style.css blendet um. Das Maul sitzt
 * immer bei (100|150); dorthin fliegt das Futter.
 */
const TIERE = {
  hase: {
    lieblingsfutter: 'karotte',
    svg: `
      <ellipse cx="74" cy="44" rx="16" ry="40" fill="#f3e7db"/><ellipse cx="126" cy="44" rx="16" ry="40" fill="#f3e7db"/>
      <ellipse cx="74" cy="48" rx="8" ry="28" fill="#f2b8c6"/><ellipse cx="126" cy="48" rx="8" ry="28" fill="#f2b8c6"/>
      <circle cx="100" cy="122" r="62" fill="#f3e7db"/>
      <circle cx="78" cy="110" r="8" fill="#4a4032"/><circle cx="122" cy="110" r="8" fill="#4a4032"/>
      <circle cx="80" cy="107" r="2.6" fill="#fffaf2"/><circle cx="124" cy="107" r="2.6" fill="#fffaf2"/>
      <circle cx="64" cy="134" r="9" fill="#f2b8c6" opacity="0.6"/><circle cx="136" cy="134" r="9" fill="#f2b8c6" opacity="0.6"/>
      <ellipse cx="100" cy="130" rx="7" ry="5" fill="#e88a9a"/>`,
  },
  hund: {
    lieblingsfutter: 'knochen',
    svg: `
      <circle cx="100" cy="112" r="64" fill="#e8d2b4"/>
      <ellipse cx="46" cy="104" rx="20" ry="44" fill="#a9835e" transform="rotate(14 46 104)"/>
      <ellipse cx="154" cy="104" rx="20" ry="44" fill="#a9835e" transform="rotate(-14 154 104)"/>
      <circle cx="122" cy="88" r="17" fill="#a9835e" opacity="0.5"/>
      <circle cx="80" cy="100" r="8" fill="#4a4032"/><circle cx="120" cy="100" r="8" fill="#4a4032"/>
      <circle cx="82" cy="97" r="2.6" fill="#fffaf2"/><circle cx="122" cy="97" r="2.6" fill="#fffaf2"/>
      <ellipse cx="100" cy="134" rx="30" ry="24" fill="#f3e4cf"/>
      <ellipse cx="100" cy="124" rx="11" ry="8" fill="#4a4032"/>`,
  },
  affe: {
    lieblingsfutter: 'banane',
    svg: `
      <circle cx="40" cy="108" r="22" fill="#a9835e"/><circle cx="160" cy="108" r="22" fill="#a9835e"/>
      <circle cx="40" cy="108" r="12" fill="#e9c9a3"/><circle cx="160" cy="108" r="12" fill="#e9c9a3"/>
      <circle cx="100" cy="108" r="62" fill="#a9835e"/>
      <path d="M100 74 C76 58 52 76 58 102 C50 124 66 168 100 168 C134 168 150 124 142 102 C148 76 124 58 100 74 Z" fill="#e9c9a3"/>
      <circle cx="82" cy="100" r="8" fill="#4a4032"/><circle cx="118" cy="100" r="8" fill="#4a4032"/>
      <circle cx="84" cy="97" r="2.6" fill="#fffaf2"/><circle cx="120" cy="97" r="2.6" fill="#fffaf2"/>
      <circle cx="94" cy="126" r="2.6" fill="#7a5a3e"/><circle cx="106" cy="126" r="2.6" fill="#7a5a3e"/>`,
  },
  maus: {
    lieblingsfutter: 'kaese',
    svg: `
      <circle cx="50" cy="66" r="34" fill="#b9b3ad"/><circle cx="150" cy="66" r="34" fill="#b9b3ad"/>
      <circle cx="50" cy="66" r="20" fill="#f2b8c6"/><circle cx="150" cy="66" r="20" fill="#f2b8c6"/>
      <ellipse cx="100" cy="120" rx="56" ry="54" fill="#cdc7c1"/>
      <circle cx="80" cy="110" r="8" fill="#4a4032"/><circle cx="120" cy="110" r="8" fill="#4a4032"/>
      <circle cx="82" cy="107" r="2.6" fill="#fffaf2"/><circle cx="122" cy="107" r="2.6" fill="#fffaf2"/>
      <circle cx="100" cy="132" r="8" fill="#e88a9a"/>
      <path d="M48 128 H72 M48 138 H72 M128 128 H152 M128 138 H152" stroke="#8a8078" stroke-width="3" stroke-linecap="round"/>`,
  },
  baer: {
    lieblingsfutter: 'apfel',
    svg: `
      <circle cx="50" cy="56" r="24" fill="#b48a62"/><circle cx="150" cy="56" r="24" fill="#b48a62"/>
      <circle cx="50" cy="56" r="12" fill="#e2c3a0"/><circle cx="150" cy="56" r="12" fill="#e2c3a0"/>
      <circle cx="100" cy="112" r="66" fill="#b48a62"/>
      <ellipse cx="100" cy="138" rx="32" ry="26" fill="#e2c3a0"/>
      <circle cx="78" cy="100" r="8" fill="#4a4032"/><circle cx="122" cy="100" r="8" fill="#4a4032"/>
      <circle cx="80" cy="97" r="2.6" fill="#fffaf2"/><circle cx="124" cy="97" r="2.6" fill="#fffaf2"/>
      <ellipse cx="100" cy="126" rx="11" ry="8" fill="#4a4032"/>`,
  },
} as const;
type TierName = keyof typeof TIERE;
const TIER_NAMEN = Object.keys(TIERE) as TierName[];

/** Maul bei (100|150): zu ein Lächeln, auf ein rundes Maul mit Zunge. */
const MAUL = `
  <path class="ft-maul-zu" d="M84 146 Q100 160 116 146" stroke="#4a4032" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g class="ft-maul-auf">
    <ellipse cx="100" cy="152" rx="20" ry="17" fill="#7a3e3a"/>
    <ellipse cx="100" cy="162" rx="12" ry="7" fill="#e88a9a"/>
  </g>`;

/** Futter (viewBox 0 0 100 100). */
const FUTTER = {
  karotte: `
    <path d="M30 34 C42 26 58 30 64 42 L40 92 C36 98 30 96 30 88 Z" fill="#f4a24e"/>
    <path d="M36 50 H48 M34 64 H44 M33 78 H40" stroke="#d9823a" stroke-width="3" stroke-linecap="round"/>
    <path d="M48 32 C44 18 52 8 58 6 M52 34 C56 20 68 16 76 16 M54 36 C64 30 76 32 84 36" stroke="#7fb99e" stroke-width="6" stroke-linecap="round" fill="none"/>`,
  knochen: `
    <g transform="rotate(-30 50 50)">
      <g stroke="#c9b79a" stroke-width="5">
        <rect x="24" y="40" width="52" height="20" rx="8"/>
        <circle cx="22" cy="40" r="12"/><circle cx="22" cy="60" r="12"/><circle cx="78" cy="40" r="12"/><circle cx="78" cy="60" r="12"/>
      </g>
      <rect x="24" y="40" width="52" height="20" rx="8" fill="#f6efe3"/>
      <circle cx="22" cy="40" r="12" fill="#f6efe3"/><circle cx="22" cy="60" r="12" fill="#f6efe3"/>
      <circle cx="78" cy="40" r="12" fill="#f6efe3"/><circle cx="78" cy="60" r="12" fill="#f6efe3"/>
      <path d="M30 46 H70" stroke="#e3d6c2" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  banane: `
    <path d="M18 30 C20 64 48 86 84 74 C88 72 88 66 84 66 C54 70 34 56 28 28 C27 22 18 22 18 30 Z" fill="#f7d570"/>
    <path d="M28 34 C36 58 54 68 80 68" stroke="#e8bf4a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M18 30 L16 20 L24 22 Z" fill="#8a7255"/>`,
  kaese: `
    <path d="M10 70 L84 36 L90 74 Z" fill="#f7d570"/>
    <path d="M10 70 L90 74 L90 84 L10 80 Z" fill="#e8bf4a"/>
    <circle cx="56" cy="62" r="6" fill="#e8bf4a"/><circle cx="74" cy="54" r="4" fill="#e8bf4a"/><circle cx="38" cy="68" r="4" fill="#e8bf4a"/>`,
  apfel: `
    <path d="M50 30 C36 20 14 26 14 52 C14 76 32 92 50 86 C68 92 86 76 86 52 C86 26 64 20 50 30 Z" fill="#e8746a"/>
    <path d="M30 44 C28 52 30 60 34 64" stroke="#f3a99f" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M50 30 C50 22 52 16 56 12" stroke="#8a7255" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M54 20 C60 10 72 10 76 14 C70 22 60 24 54 20 Z" fill="#7fb99e"/>`,
} as const;
type FutterName = keyof typeof FUTTER;
const FUTTER_NAMEN = Object.keys(FUTTER) as FutterName[];

/** So viele Happen, dann ist das Tier satt und das nächste kommt. */
const HAPPEN_BIS_SATT = 3;

interface Zug {
  futter: FutterName;
  ghost: HTMLElement;
  item: HTMLElement;
  startX: number;
  startY: number;
  gezogen: boolean;
}

let stageEl: HTMLElement | null = null;
let wrapEl: HTMLElement | null = null;
let tierEl: HTMLElement | null = null;
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let zuege = new Map<number, Zug>();
let tier: TierName = 'hase';
let reihe: TierName[] = [];
let happen = 0;
let wechselt = false;
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

/** Klasse neu starten, damit eine CSS-Animation auch beim zweiten Mal wieder abläuft. */
function retrigger(el: HTMLElement, klasse: string, ms: number): void {
  el.classList.remove(klasse);
  void el.offsetWidth;
  el.classList.add(klasse);
  later(() => el.classList.remove(klasse), ms);
}

function tierSvg(name: TierName): string {
  return `<svg viewBox="0 0 200 200" width="100%" height="100%">${TIERE[name].svg}${MAUL}</svg>`;
}

/** Nächstes Tier aus einer gemischten Runde, nie zweimal hintereinander dasselbe. */
function naechstesTier(): TierName {
  if (reihe.length === 0) {
    reihe = [...TIER_NAMEN].sort(() => Math.random() - 0.5);
    if (reihe[0] === tier) reihe.push(reihe.shift()!);
  }
  return reihe.shift()!;
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  zuege = new Map();
  reihe = [];
  happen = 0;
  wechselt = false;
  tier = naechstesTier();

  container.innerHTML = `
    <div class="fuettern-stage" id="fuetternStage">
      <div class="ft-buehne">
        <div class="ft-tier-wrap" id="ftWrap"><div class="ft-tier" id="ftTier">${tierSvg(tier)}</div></div>
      </div>
      <div class="ft-teller">
        ${FUTTER_NAMEN.map((f) => `<div class="ft-futter" data-futter="${f}"><svg viewBox="0 0 100 100" width="100%" height="100%">${FUTTER[f]}</svg></div>`).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#fuetternStage')!;
  wrapEl = container.querySelector<HTMLElement>('#ftWrap')!;
  tierEl = container.querySelector<HTMLElement>('#ftTier')!;

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    const item = (pe.target as Element).closest<HTMLElement>('.ft-futter');
    if (item) {
      startZug(pe, item);
      return;
    }
    if (wrapEl && imTier(pe.clientX, pe.clientY)) streicheln();
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    const z = zuege.get(pe.pointerId);
    if (!z) return;
    if (Math.hypot(pe.clientX - z.startX, pe.clientY - z.startY) > 14) z.gezogen = true;
    setzeGhost(z.ghost, pe.clientX, pe.clientY);
    // Vorfreude: Kommt das Futter in die Nähe, macht das Tier das Maul auf.
    tierEl?.classList.toggle('offen', [...zuege.values()].some((zz) => zz.gezogen) && nahAmMaul(pe.clientX, pe.clientY));
  });
  const ende = (e: Event) => {
    const pe = e as PointerEvent;
    const z = zuege.get(pe.pointerId);
    if (!z) return;
    zuege.delete(pe.pointerId);
    z.item.classList.remove('gehalten');
    // Angetippt (nicht gezogen) oder beim Tier losgelassen: Futter fliegt ins Maul.
    if (!wechselt && (!z.gezogen || (e.type === 'pointerup' && nahAmMaul(pe.clientX, pe.clientY)))) {
      fressen(z);
    } else {
      zurueck(z);
    }
  };
  on(stageEl, 'pointerup', ende);
  on(stageEl, 'pointercancel', ende);
}

function startZug(pe: PointerEvent, item: HTMLElement): void {
  if (!stageEl) return;
  try {
    stageEl.setPointerCapture(pe.pointerId);
  } catch {
    /* Pointer bereits inaktiv */
  }
  const futter = item.dataset.futter as FutterName;
  const ghost = document.createElement('div');
  ghost.className = 'ft-ghost';
  const groesse = item.clientWidth;
  ghost.style.width = `${groesse}px`;
  ghost.style.height = `${groesse}px`;
  ghost.innerHTML = item.innerHTML;
  stageEl.appendChild(ghost);
  setzeGhost(ghost, pe.clientX, pe.clientY);
  item.classList.add('gehalten');
  zuege.set(pe.pointerId, { futter, ghost, item, startX: pe.clientX, startY: pe.clientY, gezogen: false });
  playClick(620);
}

/**
 * Bildschirm- in Bühnenkoordinaten. Über clientWidth zurückgerechnet, damit
 * es auch stimmt, solange die Spielansicht noch hineinzoomt (siehe CLAUDE.md).
 */
function aufBuehne(clientX: number, clientY: number): { x: number; y: number } {
  const r = stageEl!.getBoundingClientRect();
  const s = stageEl!.clientWidth / (r.width || 1);
  return { x: (clientX - r.left) * s, y: (clientY - r.top) * s };
}

function setzeGhost(ghost: HTMLElement, clientX: number, clientY: number): void {
  const p = aufBuehne(clientX, clientY);
  ghost.style.setProperty('--tx', `${p.x.toFixed(1)}px`);
  ghost.style.setProperty('--ty', `${p.y.toFixed(1)}px`);
}

/** Maulmitte in Bildschirmkoordinaten (Maul sitzt bei 75 % der Tierhöhe). */
function maulPunkt(): { x: number; y: number } {
  const r = tierEl!.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.75 };
}

function nahAmMaul(clientX: number, clientY: number): boolean {
  if (!tierEl) return false;
  const r = tierEl.getBoundingClientRect();
  const m = maulPunkt();
  // Großzügig: das ganze Tier zählt, nicht nur das Maul.
  return imTier(clientX, clientY) || Math.hypot(clientX - m.x, clientY - m.y) < r.width * 0.55;
}

function imTier(clientX: number, clientY: number): boolean {
  const r = tierEl!.getBoundingClientRect();
  return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
}

function fressen(z: Zug): void {
  if (!tierEl) return;
  const m = maulPunkt();
  tierEl.classList.add('offen');
  z.ghost.classList.add('fliegt');
  void z.ghost.offsetWidth;
  setzeGhost(z.ghost, m.x, m.y);
  z.ghost.classList.add('weg');
  playWhoosh();

  later(() => {
    z.ghost.remove();
    if (!tierEl) return;
    tierEl.classList.remove('offen');
    retrigger(tierEl, 'kaut', 1000);
    [0, 230, 460].forEach((ms) =>
      later(() => {
        playDrum(150, 0.14, 0.1);
        playRustle(0.07, 0.09);
      }, ms),
    );
    const lieblings = TIERE[tier].lieblingsfutter === z.futter;
    happen++;
    later(() => {
      if (!tierEl) return;
      // Lieblingsfutter: freut sich doppelt — hüpft höher und ruft zweimal.
      retrigger(tierEl, lieblings ? 'jubelt' : 'huepft', 900);
      rufen(lieblings ? 2 : 1);
      if (happen >= HAPPEN_BIS_SATT) later(tierWechsel, 1100);
    }, 950);
  }, 380);
}

function zurueck(z: Zug): void {
  const r = z.item.getBoundingClientRect();
  z.ghost.classList.add('fliegt');
  void z.ghost.offsetWidth;
  setzeGhost(z.ghost, r.left + r.width / 2, r.top + r.height / 2);
  later(() => z.ghost.remove(), 380);
  tierEl?.classList.remove('offen');
}

function streicheln(): void {
  if (!tierEl || wechselt) return;
  retrigger(tierEl, 'huepft', 900);
  rufen(1);
}

/** Satt: Das Tier hüpft noch einmal, geht nach links hinaus, das nächste kommt von rechts. */
function tierWechsel(): void {
  if (!wrapEl || !tierEl || wechselt) return;
  wechselt = true;
  happen = 0;
  wrapEl.classList.add('geht');
  playGlide(500, 260, 0.35, 0.1);
  later(() => {
    if (!wrapEl || !tierEl) return;
    tier = naechstesTier();
    tierEl.innerHTML = tierSvg(tier);
    wrapEl.classList.remove('geht');
    wrapEl.classList.add('kommt');
    void wrapEl.offsetWidth;
    wrapEl.classList.remove('kommt');
    later(() => {
      wechselt = false;
      rufen(1);
    }, 650);
  }, 650);
}

/** Tierlaut, synthetisiert. */
function rufen(mal: number): void {
  const now = performance.now();
  if (now - lastRufAt < 300) return;
  lastRufAt = now;
  for (let i = 0; i < mal; i++) later(() => TIER_LAUT[tier](), i * 520);
}

const TIER_LAUT: Record<TierName, () => void> = {
  hase: () => {
    [0, 90, 180].forEach((ms) => later(() => playGlide(1300, 1700, 0.05, 0.08), ms));
  },
  hund: () => {
    playGlide(330, 190, 0.13, 0.22, 'triangle');
    later(() => playGlide(330, 190, 0.13, 0.22, 'triangle'), 200);
  },
  affe: () => {
    [0, 150].forEach((ms) => later(() => playGlide(300, 420, 0.1, 0.16, 'triangle'), ms));
    [320, 460].forEach((ms) => later(() => playGlide(450, 760, 0.12, 0.16, 'triangle'), ms));
  },
  maus: () => {
    [0, 140].forEach((ms) => later(() => playTone({ freq: 1760, duration: 0.05, attack: 0.005, release: 0.06, gain: 0.12 }), ms));
  },
  baer: () => {
    playGlide(140, 100, 0.6, 0.22, 'triangle');
  },
};

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  zuege = new Map();
  stageEl = null;
  wrapEl = null;
  tierEl = null;
}

export const fuettern: Toy = {
  id: 'fuettern',
  name: 'Tiere füttern',
  accent: '#f4a24e',
  tileIcon,
  mount,
  unmount,
};

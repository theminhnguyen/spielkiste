import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playRustle, playWhoosh, playTone } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M10 98 Q34 62 60 66 Q88 60 110 98 Z" fill="#e0a458"/>
  <path d="M22 98 Q40 76 58 80 Q74 76 92 98 Z" fill="#d9824f"/>
  <path d="M44 86 Q52 74 62 84 Q56 92 44 86 Z" fill="#f4c86b"/>
  <path d="M78 18 C92 26 94 42 80 54 C66 44 66 28 78 18 Z" fill="#c96f5a" transform="rotate(28 80 36)"/>
  <path d="M30 28 C40 34 40 46 32 52 C22 46 22 34 30 28 Z" fill="#f4c86b" transform="rotate(-24 31 40)"/>
</svg>`;

const BLATT_FARBEN = ['#e0a458', '#d9824f', '#f4c86b', '#c96f5a', '#b8a05a', '#e8b06a'];
const BLATT_FORMEN = ['blatt-ahorn', 'blatt-oval', 'blatt-rund'];

/** Oberkante des Bodens als Anteil der Bühnenhöhe. */
const GROUND = 0.8;
const IGEL_X = 0.3;
/** Starthaufen: Mitte (Anteil der Breite) und Anzahl Blätter — der erste deckt den Igel zu. */
const START_HAUFEN: Array<[number, number]> = [
  [IGEL_X, 30],
  [0.6, 24],
  [0.86, 24],
];

const GRAVITY = 600;
const DRAG_UP = 1.6;
const DRAG_DOWN = 4.2;
const DRAG_X = 1.4;
const SWAY = 260;
const MAX_SPEED = 2200;
/** Reichweite eines Patschers (Windstoß), in px bei Maßstab 1. */
const GUST_RADIUS = 230;
/** Radius der „Hand" beim Wischen, in px bei Maßstab 1. */
const HAND_RADIUS = 75;
const BIN_WIDTH = 18;
/** Höhe einer Blattlage im Haufen, in px bei Maßstab 1. */
const LAYER = 13;
const MAX_WIRBEL = 8;

interface Leaf {
  i: number;
  el: HTMLElement;
  size: number;
  baseSize: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  phase: number;
  phaseSpeed: number;
  onGround: boolean;
  bin: number;
  dirty: boolean;
}

interface HandPointer {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}

interface LaubState {
  /** Liegende Blätter in Stapel-Reihenfolge (unten zuerst): [Blatt-Index, x in %] */
  liegen: Array<[number, number]>;
}

const STATE_KEY = 'laub';
const STATE_VERSION = 1;
const LEAF_COUNT = START_HAUFEN.reduce((sum, [, n]) => sum + n, 0);

let stageEl: HTMLElement | null = null;
let wirbelEl: HTMLElement | null = null;
let igelEl: HTMLElement | null = null;
let leaves: Leaf[] = [];
let stacks: Leaf[][] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;
let lastFrameT = 0;
let stageW = 0;
let stageH = 0;
let scale = 1;
let placed = false;
let hands = new Map<number, HandPointer>();
let wirbelCount = 0;
let lastRustleAt = 0;
let igelWachTimer: number | null = null;
let saved: LaubState | null = null;

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

/**
 * Merkt sich laufende Timer fürs Aufräumen beim Verlassen — und vergisst sie
 * wieder, sobald sie gefeuert haben. Sonst wüchse die Liste bei jedem Schlag
 * und bliebe beim Dauerhämmern über die ganze Sitzung liegen.
 */
function later(fn: () => void, ms: number): number {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
  return id;
}

const SYMBOLE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="blatt-ahorn" viewBox="0 0 100 100">
      <path d="M50 4 L58 28 L78 16 L72 40 L95 42 L77 57 L86 76 L61 68 L55 88 L50 92 L45 88 L39 68 L14 76 L23 57 L5 42 L28 40 L22 16 L42 28 Z" fill="currentColor"/>
      <path d="M50 98 L50 20 M50 60 L24 46 M50 60 L76 46" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </symbol>
    <symbol id="blatt-oval" viewBox="0 0 100 100">
      <path d="M50 4 C80 24 86 62 50 92 C14 62 20 24 50 4 Z" fill="currentColor"/>
      <path d="M50 98 L50 12 M50 40 L34 28 M50 40 L66 28 M50 60 L32 48 M50 60 L68 48" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </symbol>
    <symbol id="blatt-rund" viewBox="0 0 100 100">
      <path d="M50 8 C82 10 94 46 72 74 C62 86 54 90 50 92 C46 90 38 86 28 74 C6 46 18 10 50 8 Z" fill="currentColor"/>
      <path d="M50 98 L50 18 M50 50 L28 36 M50 50 L72 36" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </symbol>
  </defs>
</svg>`;

const BAUM_SVG = `
<svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
  <path d="M88 300 L92 150 L70 112 M92 170 L124 128 M92 150 L96 96" stroke="#a9835e" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M84 300 L88 150 L112 150 L116 300 Z" fill="#a9835e"/>
  <circle cx="100" cy="74" r="48" fill="#e8b06a"/>
  <circle cx="58" cy="104" r="40" fill="#e0a458"/>
  <circle cx="146" cy="100" r="40" fill="#d9824f"/>
  <circle cx="80" cy="140" r="34" fill="#f4c86b"/>
  <circle cx="128" cy="144" r="32" fill="#e8b06a"/>
  <circle cx="112" cy="58" r="22" fill="#f4c86b" opacity="0.8"/>
</svg>`;

const IGEL_SVG = `
<svg viewBox="0 0 120 76" width="100%" height="100%">
  <ellipse cx="58" cy="72" rx="50" ry="5" fill="rgba(90,70,40,0.18)"/>
  <path d="M8 70 L6 56 L14 50 L10 38 L22 36 L22 22 L34 26 L40 12 L50 22 L60 8 L66 22 L78 14 L80 28 L92 26 L90 40 L98 44 L96 70 Z" fill="#8a6a4a"/>
  <path d="M84 70 Q86 44 102 46 Q114 50 116 62 Q110 70 84 70 Z" fill="#e8cfa8"/>
  <circle cx="116" cy="61" r="3.5" fill="#4a4032"/>
  <g class="igel-auge-zu"><path d="M98 54 Q102 57 106 54" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
  <g class="igel-auge-auf"><circle cx="102" cy="54" r="3.5" fill="#4a4032"/><circle cx="103" cy="53" r="1.1" fill="#fff"/></g>
  <ellipse cx="96" cy="63" rx="4" ry="2.5" fill="#f2b8c6" opacity="0.7"/>
</svg>`;

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  hands = new Map();
  placed = false;
  wirbelCount = 0;
  stageW = 0;
  stageH = 0;
  igelWachTimer = null;

  const loaded = loadState<LaubState | null>(STATE_KEY, STATE_VERSION, null);
  saved = loaded && Array.isArray(loaded.liegen) && loaded.liegen.length === LEAF_COUNT ? loaded : null;

  container.innerHTML = `
    <div class="laub-stage" id="laubStage">
      ${SYMBOLE}
      <div class="laub-himmel"></div>
      <div class="laub-huegel"></div>
      <div class="laub-baum">${BAUM_SVG}</div>
      <div class="laub-boden"></div>
      <div class="laub-igel" id="laubIgel">${IGEL_SVG}</div>
      <div class="laub-blaetter" id="laubBlaetter"></div>
      <div class="laub-wirbel" id="laubWirbel"></div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#laubStage')!;
  wirbelEl = container.querySelector<HTMLElement>('#laubWirbel')!;
  igelEl = container.querySelector<HTMLElement>('#laubIgel')!;
  const blaetterEl = container.querySelector<HTMLElement>('#laubBlaetter')!;

  leaves = [];
  for (let i = 0; i < LEAF_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'laub-blatt';
    el.style.color = BLATT_FARBEN[i % BLATT_FARBEN.length];
    el.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%"><use href="#${BLATT_FORMEN[i % BLATT_FORMEN.length]}"/></svg>`;
    blaetterEl.appendChild(el);
    leaves.push({
      i,
      el,
      size: 0,
      baseSize: 54 + ((i * 37) % 22),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      vrot: 0,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 2.4 + Math.random() * 1.6,
      onGround: false,
      bin: -1,
      dirty: true,
    });
  }

  // Erst platzieren, wenn die Bühne eine echte Größe hat (kann beim ersten
  // Öffnen noch 0×0 sein) — und bei Drehen/Split View neu aufschichten.
  resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(stageEl);

  on(stageEl, 'pointerdown', (e) => onPointerDown(e as PointerEvent));
  on(stageEl, 'pointermove', (e) => onPointerMove(e as PointerEvent));
  on(stageEl, 'pointerup', (e) => hands.delete((e as PointerEvent).pointerId));
  on(stageEl, 'pointercancel', (e) => hands.delete((e as PointerEvent).pointerId));
}

/* ---------- Boden & Haufen ---------- */

function groundTop(): number {
  return stageH * GROUND;
}

function binCount(): number {
  return Math.max(1, Math.ceil(stageW / (BIN_WIDTH * scale)));
}

function binOf(x: number): number {
  return Math.max(0, Math.min(stacks.length - 1, Math.floor(x / (BIN_WIDTH * scale))));
}

function binCenter(b: number): number {
  return (b + 0.5) * BIN_WIDTH * scale;
}

/** Mittelpunkt-Höhe eines liegenden Blatts auf Lage `layer` (0 = ganz unten). */
function restY(layer: number): number {
  return groundTop() - layer * LAYER * scale - scale * 6;
}

/**
 * Legt ein Blatt auf den Boden. Ist der Haufen an dieser Stelle zu steil,
 * rutscht es zur niedrigeren Nachbarspalte (wie bei einem Sandhaufen) — so
 * entstehen von selbst runde Haufen statt Türmchen.
 *
 * @param fromAir true = landet aus dem Flug: bleibt möglichst dort liegen,
 *   wo es aufkommt, und behält seine Drehung — sonst springt es sichtbar.
 */
function land(leaf: Leaf, startBin: number, fromAir = false): void {
  let b = startBin;
  for (let k = 0; k < 24; k++) {
    const h = stacks[b].length;
    const left = b > 0 ? stacks[b - 1].length : Infinity;
    const right = b < stacks.length - 1 ? stacks[b + 1].length : Infinity;
    if (h - Math.min(left, right) < 2) break;
    if (left < right) b -= 1;
    else if (right < left) b += 1;
    else b += Math.random() < 0.5 ? -1 : 1;
  }
  stacks[b].push(leaf);
  leaf.onGround = true;
  leaf.bin = b;
  const bw = BIN_WIDTH * scale;
  if (fromAir) {
    // Nur so weit verschieben, dass es in seiner (ggf. gerutschten) Spalte liegt.
    leaf.x = Math.max(b * bw, Math.min((b + 1) * bw, leaf.x));
  } else {
    leaf.x = binCenter(b) + (Math.random() - 0.5) * bw * 0.8;
    leaf.rot = (Math.random() - 0.5) * 70 + (Math.random() < 0.5 ? 0 : 180);
  }
  leaf.y = restY(stacks[b].length - 1);
  leaf.vx = 0;
  leaf.vy = 0;
  leaf.vrot = 0;
  leaf.dirty = true;
}

/** Hebt ein liegendes Blatt ab. Was darüber lag, fällt nach — und zu steile Nachbarn rutschen nach. */
function liftOff(leaf: Leaf): void {
  if (!leaf.onGround) return;
  const b = leaf.bin;
  const stack = stacks[b];
  const idx = stack.indexOf(leaf);
  leaf.onGround = false;
  leaf.bin = -1;
  if (idx < 0) return;
  const above = stack.splice(idx);
  above.shift();
  above.forEach((l) => {
    l.onGround = false;
    l.bin = -1;
    l.vy = 0;
    l.vx = (Math.random() - 0.5) * 40;
  });
  for (const nb of [b - 1, b + 1]) {
    if (nb < 0 || nb >= stacks.length) continue;
    while (stacks[nb].length - stacks[b].length > 3) {
      const top = stacks[nb].pop()!;
      top.onGround = false;
      top.bin = -1;
      top.vy = 0;
      top.vx = (nb < b ? 1 : -1) * 60;
    }
  }
}

/* ---------- Platzieren & Größe ---------- */

function onResize(): void {
  if (!stageEl) return;
  // Layout-Maße statt getBoundingClientRect — beim Öffnen zoomt die
  // Spielansicht noch hinein, siehe gleichnamige Stelle in baelle.ts.
  const w = stageEl.clientWidth;
  const h = stageEl.clientHeight;
  if (w < 1 || h < 1) return;
  const oldW = stageW;
  const oldH = stageH;

  // Liegende Blätter in Stapel-Reihenfolge merken (unten zuerst), damit die
  // Haufen nach dem Drehen an derselben relativen Stelle neu entstehen.
  const order = placed ? groundOrder().map((l) => [l.i, (l.x / oldW) * 100] as [number, number]) : null;

  stageW = w;
  stageH = h;
  scale = Math.max(0.55, Math.min(1.2, Math.min(stageW, stageH) / 834));
  stacks = Array.from({ length: binCount() }, () => []);

  leaves.forEach((l) => {
    l.size = l.baseSize * scale;
    l.el.style.width = `${l.size.toFixed(1)}px`;
    l.el.style.height = `${l.size.toFixed(1)}px`;
  });

  if (!placed) {
    if (saved) {
      saved.liegen.forEach(([idx, xPct]) => {
        const leaf = leaves[idx];
        if (leaf) land(leaf, binOf((xPct / 100) * stageW));
      });
      // Falls ein Index fehlt (sollte nicht vorkommen): unten in der Mitte ablegen.
      leaves.forEach((l) => {
        if (!l.onGround) land(l, binOf(stageW / 2));
      });
    } else {
      let i = 0;
      for (const [center, count] of START_HAUFEN) {
        for (let k = 0; k < count; k++, i++) {
          const spread = (Math.random() + Math.random() - 1) * 50 * scale;
          land(leaves[i], binOf(center * stageW + spread));
        }
      }
    }
    placed = true;
    stageEl.classList.add('bereit');
  } else {
    order?.forEach(([idx, xPct]) => land(leaves[idx], binOf((xPct / 100) * stageW)));
    leaves.forEach((l) => {
      if (l.onGround) return;
      l.x = Math.max(l.size / 2, Math.min(stageW - l.size / 2, l.x * (stageW / oldW)));
      l.y = l.y * (stageH / oldH);
      l.dirty = true;
    });
  }

  placeIgel();
  render();
}

/** Alle liegenden Blätter, Lage für Lage von unten nach oben. */
function groundOrder(): Leaf[] {
  const result: Leaf[] = [];
  const maxH = stacks.reduce((m, s) => Math.max(m, s.length), 0);
  for (let layer = 0; layer < maxH; layer++) {
    for (const s of stacks) if (s[layer]) result.push(s[layer]);
  }
  return result;
}

function placeIgel(): void {
  if (!igelEl) return;
  const w = 120 * scale;
  const h = 76 * scale;
  igelEl.style.width = `${w.toFixed(1)}px`;
  igelEl.style.height = `${h.toFixed(1)}px`;
  igelEl.style.transform = `translate(${(IGEL_X * stageW - w / 2).toFixed(1)}px, ${(groundTop() - h + 4 * scale).toFixed(1)}px)`;
}

/* ---------- Eingabe ---------- */

/** Bildschirm- in Bühnenkoordinaten — rechnet einen laufenden Öffnen-Zoom heraus. */
function toStage(clientX: number, clientY: number): { x: number; y: number } {
  const rect = stageEl!.getBoundingClientRect();
  const sx = rect.width > 0 ? stageEl!.clientWidth / rect.width : 1;
  const sy = rect.height > 0 ? stageEl!.clientHeight / rect.height : 1;
  return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
}

function onPointerDown(pe: PointerEvent): void {
  pe.preventDefault();
  if (!stageEl || !placed) return;
  try {
    stageEl.setPointerCapture(pe.pointerId);
  } catch {
    /* Pointer bereits inaktiv */
  }
  const p = toStage(pe.clientX, pe.clientY);
  hands.set(pe.pointerId, { x: p.x, y: p.y, vx: 0, vy: 0, t: performance.now() });

  if ((pe.target as Element).closest?.('.laub-igel')) igelWach();

  // Windstoß: Reicht nach unten weiter als nach oben — ein Patscher in die
  // Luft über einem Haufen wirbelt ihn trotzdem auf. So hat jeder Tipp eine
  // sichtbare Wirkung, auch weit weg vom Boden.
  const radius = GUST_RADIUS * scale;
  // Nach unten so weit gestaucht, dass selbst ein Tipp ganz oben im Himmel
  // die Blätter darunter noch erreicht — wichtig im Hochformat und auf dem
  // iPhone, wo der Himmel viel höher ist als der Windstoß weit reicht.
  const downScale = Math.min(0.4, (0.8 * radius) / Math.max(1, groundTop()));
  let count = 0;
  for (const l of leaves) {
    const dx = l.x - p.x;
    const dy = l.y - p.y;
    const eff = Math.hypot(dx, dy > 0 ? dy * downScale : dy);
    if (eff >= radius) continue;
    const f = 1 - eff / radius;
    let dirX = Math.abs(dx) < 4 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(dx);
    // Blätter nahe einer Seitenwand wehen zur Mitte zurück statt gegen die
    // Wand — sonst sammelt sich mit der Zeit alles an den Rändern.
    if ((l.x < stageW * 0.15 && dirX < 0) || (l.x > stageW * 0.85 && dirX > 0)) dirX *= -0.7;
    liftOff(l);
    // Am Rand des Windstoßs nur ein kleiner Hüpfer, in der Mitte fliegt es hoch.
    l.vx += (dirX * (100 + 500 * f) * (0.6 + Math.random() * 0.7) + (Math.random() - 0.5) * 120) * scale;
    l.vy = Math.min(l.vy, -(250 + 1050 * f) * (0.75 + Math.random() * 0.4) * scale);
    l.vrot = (Math.random() - 0.5) * 900;
    limitSpeed(l);
    count++;
  }

  wirbel(p.x, p.y);
  if (count > 0) rustle(count);
  else if (performance.now() - lastRustleAt > 120) {
    lastRustleAt = performance.now();
    playWhoosh();
  }
  wake();
}

function onPointerMove(pe: PointerEvent): void {
  const hand = hands.get(pe.pointerId);
  if (!hand || !placed) return;
  const p = toStage(pe.clientX, pe.clientY);
  const now = performance.now();
  const dt = Math.max(8, now - hand.t) / 1000;
  hand.vx = hand.vx * 0.4 + ((p.x - hand.x) / dt) * 0.6;
  hand.vy = hand.vy * 0.4 + ((p.y - hand.y) / dt) * 0.6;
  hand.x = p.x;
  hand.y = p.y;
  hand.t = now;

  const speed = Math.hypot(hand.vx, hand.vy);
  if (speed < 120 * scale) return;

  const handR = HAND_RADIUS * scale;
  let count = 0;
  for (const l of leaves) {
    if (Math.hypot(l.x - p.x, l.y - p.y) >= handR) continue;
    if (l.onGround) {
      liftOff(l);
      l.vx = hand.vx * 0.6 + (Math.random() - 0.5) * 80 * scale;
      l.vy = Math.min(hand.vy * 0.3, 0) - (300 + Math.random() * 300) * scale;
      l.vrot = (Math.random() - 0.5) * 700;
      count++;
    } else {
      l.vx += hand.vx * 0.35;
      l.vy += hand.vy * 0.35;
    }
    limitSpeed(l);
  }
  if (count > 0) rustle(count);
  wake();
}

function limitSpeed(l: Leaf): void {
  const max = MAX_SPEED * scale;
  const s = Math.hypot(l.vx, l.vy);
  if (s > max) {
    l.vx *= max / s;
    l.vy *= max / s;
  }
}

function rustle(count: number): void {
  const now = performance.now();
  if (now - lastRustleAt < 80) return;
  lastRustleAt = now;
  playRustle(Math.min(0.3, 0.1 + count * 0.012), 0.22 + Math.min(0.16, count * 0.01));
}

/** Kleiner Windwirbel an der Fingerstelle — sichtbare Antwort auf jeden Tipp. */
function wirbel(x: number, y: number): void {
  if (!wirbelEl || wirbelCount >= MAX_WIRBEL) return;
  const w = document.createElement('span');
  w.className = 'laub-wirbelchen';
  w.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
  w.innerHTML = `<svg viewBox="0 0 80 80" width="100%" height="100%"><path d="M14 40 C14 20 40 12 54 24 C66 34 58 52 44 50 C34 48 34 36 42 34" fill="none" stroke="rgba(255,250,242,0.9)" stroke-width="6" stroke-linecap="round"/></svg>`;
  wirbelEl.appendChild(w);
  wirbelCount++;
  later(() => {
    w.remove();
    wirbelCount = Math.max(0, wirbelCount - 1);
  }, 700);
}

/** Igel wird wach: blinzelt, hüpft und schnüffelt — und schläft nach kurzer Zeit wieder ein. */
function igelWach(): void {
  if (!igelEl) return;
  igelEl.classList.add('wach');
  igelEl.classList.remove('hopst');
  void igelEl.offsetWidth;
  igelEl.classList.add('hopst');
  playTone({ freq: 880, duration: 0.04, attack: 0.004, release: 0.06, type: 'triangle', gain: 0.14 });
  later(() => playTone({ freq: 988, duration: 0.04, attack: 0.004, release: 0.06, type: 'triangle', gain: 0.14 }), 120);
  if (igelWachTimer !== null) {
    window.clearTimeout(igelWachTimer);
    timers.delete(igelWachTimer);
  }
  igelWachTimer = later(() => {
    igelEl?.classList.remove('wach');
    igelWachTimer = null;
  }, 2200);
}

/* ---------- Physik ---------- */

function wake(): void {
  if (rafId !== null) return;
  lastFrameT = performance.now();
  rafId = requestAnimationFrame(frame);
}

function frame(t: number): void {
  const dt = Math.min(0.033, Math.max(0.001, (t - lastFrameT) / 1000));
  lastFrameT = t;
  step(dt);
  render();

  // Ein ruhig aufliegender Finger hält die Schleife nicht wach — Bewegungen
  // wecken sie in onPointerMove ohnehin wieder auf.
  if (leaves.some((l) => !l.onGround)) {
    rafId = requestAnimationFrame(frame);
  } else {
    rafId = null;
    persist();
  }
}

function step(dt: number): void {
  const g = GRAVITY * scale;
  for (const l of leaves) {
    if (l.onGround) continue;
    l.vy += g * dt;
    l.vy *= Math.exp(-(l.vy < 0 ? DRAG_UP : DRAG_DOWN) * dt);
    l.vx *= Math.exp(-DRAG_X * dt);
    l.phase += l.phaseSpeed * dt;
    if (l.vy > 0) {
      // Segeln: sanftes Hin-und-her-Pendeln beim Herabfallen.
      l.vx += Math.cos(l.phase) * SWAY * scale * dt;
      const target = Math.sin(l.phase) * 40;
      l.rot += (target - l.rot) * Math.min(1, 3 * dt) + l.vrot * dt;
    } else {
      l.rot += l.vrot * dt;
    }
    l.vrot *= Math.exp(-1.5 * dt);
    l.x += l.vx * dt;
    l.y += l.vy * dt;

    const half = l.size / 2;
    if (l.x < half) {
      l.x = half;
      l.vx = Math.abs(l.vx) * 0.4;
    } else if (l.x > stageW - half) {
      l.x = stageW - half;
      l.vx = -Math.abs(l.vx) * 0.4;
    }
    if (l.y < half) {
      l.y = half;
      l.vy = Math.abs(l.vy) * 0.2;
    }

    const b = binOf(l.x);
    if (l.vy >= 0 && l.y >= restY(stacks[b].length)) land(l, b, true);
    l.dirty = true;
  }
}

/** Nur geänderte Blätter schreiben, ausschließlich über `transform` (kein Reflow). */
function render(): void {
  for (const l of leaves) {
    if (!l.dirty) continue;
    l.dirty = false;
    l.el.style.transform = `translate(${(l.x - l.size / 2).toFixed(1)}px, ${(l.y - l.size / 2).toFixed(1)}px) rotate(${l.rot.toFixed(1)}deg)`;
  }
}

function persist(): void {
  if (!placed || stageW === 0) return;
  const liegen = groundOrder().map((l) => [l.i, (l.x / stageW) * 100] as [number, number]);
  // Fliegende Blätter landen ungefähr dort, wo sie gerade sind.
  leaves.forEach((l) => {
    if (!l.onGround) liegen.push([l.i, (l.x / stageW) * 100]);
  });
  saveState<LaubState>(STATE_KEY, STATE_VERSION, { liegen });
}

function unmount(): void {
  persist();
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  igelWachTimer = null;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  resizeObserver?.disconnect();
  resizeObserver = null;
  hands = new Map();
  leaves = [];
  stacks = [];
  stageEl = null;
  wirbelEl = null;
  igelEl = null;
  placed = false;
  saved = null;
}

export const laub: Toy = {
  id: 'laub',
  accent: '#e0a458',
  tileIcon,
  mount,
  unmount,
};

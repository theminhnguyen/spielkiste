import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playBounce } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="44" cy="50" r="28" fill="#e88a9a"/>
  <path d="M44 22 A28 28 0 0 1 72 50 L44 50 Z" fill="#fdf6ea"/>
  <path d="M44 78 A28 28 0 0 1 16 50 L44 50 Z" fill="#f4c86b"/>
  <circle cx="44" cy="50" r="5" fill="#fdf6ea"/>
  <circle cx="84" cy="80" r="21" fill="#7ea3c9"/>
  <path d="M84 59 A21 21 0 0 1 105 80 L84 80 Z" fill="#fdf6ea"/>
  <path d="M84 101 A21 21 0 0 1 63 80 L84 80 Z" fill="#7fb99e"/>
  <circle cx="84" cy="80" r="4" fill="#fdf6ea"/>
</svg>`;

interface BallDef {
  /** Grundradius in px bei einer iPad-großen Bühne */
  r: number;
  colors: [string, string, string];
  freq: number;
  xPct: number;
  yPct: number;
}

// Größere Bälle klingen tiefer. Tonhöhen aus der C-Pentatonik.
const BALL_DEFS: BallDef[] = [
  { r: 94, colors: ['#e88a9a', '#fdf6ea', '#f4c86b'], freq: 196.0, xPct: 24, yPct: 30 },
  { r: 82, colors: ['#7ea3c9', '#fdf6ea', '#7fb99e'], freq: 261.63, xPct: 62, yPct: 24 },
  { r: 72, colors: ['#f4c86b', '#fdf6ea', '#e88a9a'], freq: 293.66, xPct: 82, yPct: 58 },
  { r: 88, colors: ['#7fb99e', '#fdf6ea', '#c896d8'], freq: 220.0, xPct: 44, yPct: 64 },
  { r: 66, colors: ['#c896d8', '#fdf6ea', '#7ea3c9'], freq: 329.63, xPct: 18, yPct: 76 },
  { r: 78, colors: ['#e0a458', '#fdf6ea', '#7ea3c9'], freq: 246.94, xPct: 72, yPct: 84 },
  { r: 62, colors: ['#e88a9a', '#fdf6ea', '#7fb99e'], freq: 392.0, xPct: 40, yPct: 20 },
];

/** Bremsung pro Sekunde (anteilig) und Rollbremse in px/s² — ein kräftig geschubster Ball rollt gut 2–3 s aus. */
const FRICTION = 1.0;
const ROLL_DECEL = 90;
const WALL_BOUNCE = 0.72;
const BALL_BOUNCE = 0.86;
const MAX_SPEED = 2600;
/** Reichweite eines Patschers neben einem Ball (Druckwelle), in px bei Maßstab 1. */
const PUSH_REACH = 120;
/** Radius der „Hand" beim Wischen, in px bei Maßstab 1. */
const HAND_RADIUS = 44;
const MAX_WELLEN = 10;

interface Ball {
  def: BallDef;
  el: HTMLElement;
  muster: HTMLElement;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  squash: number;
  squashDir: number;
  lastSoundAt: number;
  /** Position ohne Geschwindigkeit geändert (z. B. von der Hand weggeschoben) — muss neu gezeichnet werden. */
  dirty: boolean;
}

interface HandPointer {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}

interface BaelleState {
  /** Positionen in Prozent der Bühne, Reihenfolge wie BALL_DEFS */
  pos: Array<[number, number]>;
}

const STATE_KEY = 'baelle';
const STATE_VERSION = 1;

let stageEl: HTMLElement | null = null;
let wellenEl: HTMLElement | null = null;
let balls: Ball[] = [];
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
let wellenCount = 0;
let lastAnySoundAt = 0;
let savedPos: Array<[number, number]> | null = null;
/** Zurück-Knopf als runder Pfosten in Bühnenkoordinaten (siehe measureObstacle). */
let obstacle: { x: number; y: number; r: number } | null = null;

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

/**
 * Merkt sich laufende Timer fürs Aufräumen beim Verlassen — und vergisst sie
 * wieder, sobald sie gefeuert haben. Sonst wüchse die Liste bei jedem Schlag
 * und bliebe beim Dauerhämmern über die ganze Sitzung liegen.
 */
function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

function persist(): void {
  if (!placed || stageW === 0 || stageH === 0) return;
  saveState<BaelleState>(STATE_KEY, STATE_VERSION, {
    pos: balls.map((b) => [(b.x / stageW) * 100, (b.y / stageH) * 100]),
  });
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  hands = new Map();
  placed = false;
  wellenCount = 0;
  stageW = 0;
  stageH = 0;

  const saved = loadState<BaelleState | null>(STATE_KEY, STATE_VERSION, null);
  savedPos = saved && Array.isArray(saved.pos) && saved.pos.length === BALL_DEFS.length ? saved.pos : null;

  container.innerHTML = `
    <div class="baelle-stage" id="baelleStage">
      <div class="baelle-teppich"></div>
      <div class="baelle-wellen" id="baelleWellen"></div>
      <div class="baelle-layer">
        ${BALL_DEFS.map(
          (d, i) => `
          <div class="ball" data-i="${i}">
            <div class="ball-muster" style="--c1:${d.colors[0]};--c2:${d.colors[1]};--c3:${d.colors[2]}"></div>
            <div class="ball-glanz"></div>
          </div>`,
        ).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#baelleStage')!;
  wellenEl = container.querySelector<HTMLElement>('#baelleWellen')!;
  balls = BALL_DEFS.map((def, i) => {
    const el = container.querySelector<HTMLElement>(`.ball[data-i="${i}"]`)!;
    return {
      def,
      el,
      muster: el.querySelector<HTMLElement>('.ball-muster')!,
      r: def.r,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      spin: Math.random() * Math.PI * 2,
      squash: 0,
      squashDir: 0,
      lastSoundAt: -Infinity,
      dirty: true,
    };
  });

  // Die Bühne kann beim allerersten Öffnen noch 0×0 messen (siehe
  // Klang-Kleckse) — die Bälle werden deshalb erst platziert, sobald der
  // ResizeObserver eine echte Größe meldet, und bei Drehen/Split View
  // anteilig mitgenommen.
  resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(stageEl);

  on(stageEl, 'pointerdown', (e) => onPointerDown(e as PointerEvent));
  on(stageEl, 'pointermove', (e) => onPointerMove(e as PointerEvent));
  on(stageEl, 'pointerup', (e) => hands.delete((e as PointerEvent).pointerId));
  on(stageEl, 'pointercancel', (e) => hands.delete((e as PointerEvent).pointerId));
}

function onResize(): void {
  if (!stageEl) return;
  // clientWidth/-Height statt getBoundingClientRect: Beim Öffnen zoomt die
  // Spielansicht noch hinein (transform: scale), und der ResizeObserver
  // meldet sich genau in dieser Phase — die Rect-Maße wären dann ~8 % zu
  // klein, und da ein Zoom keinen weiteren Resize auslöst, blieben die Wände
  // die ganze Sitzung zu eng.
  const w = stageEl.clientWidth;
  const h = stageEl.clientHeight;
  if (w < 1 || h < 1) return;
  const oldW = stageW;
  const oldH = stageH;
  stageW = w;
  stageH = h;
  // Maßstab an der kürzeren Seite: Auf dem iPhone werden die Bälle kleiner,
  // auf dem iPad bleiben sie bei ihrer Grundgröße.
  scale = Math.max(0.55, Math.min(1.2, Math.min(stageW, stageH) / 834));

  balls.forEach((b, i) => {
    b.r = b.def.r * scale;
    b.el.style.width = `${(b.r * 2).toFixed(1)}px`;
    b.el.style.height = `${(b.r * 2).toFixed(1)}px`;
    if (!placed) {
      const [xPct, yPct] = savedPos?.[i] ?? [b.def.xPct, b.def.yPct];
      b.x = (xPct / 100) * stageW;
      b.y = (yPct / 100) * stageH;
    } else if (oldW > 0 && oldH > 0) {
      b.x *= stageW / oldW;
      b.y *= stageH / oldH;
    }
    b.x = clamp(b.x, b.r, stageW - b.r);
    b.y = clamp(b.y, b.r, stageH - b.r);
  });

  measureObstacle();
  // Gespeicherte, Start- oder nach dem Drehen umgerechnete Positionen können
  // sich überlappen — ein paar Trennschritte ohne Ton räumen das auf.
  for (let k = 0; k < 20; k++) separateOverlaps();
  if (!placed) {
    placed = true;
    stageEl.classList.add('bereit');
  }
  render(true);
}

/**
 * Der Zurück-Knopf liegt über der Bühne. Rollt ein Ball darunter, patscht
 * das Kind beim Hinterherhauen auf den Knopf und landet unabsichtlich im
 * Spielzimmer — deshalb prallen die Bälle von ihm ab wie von einem Pfosten.
 */
function measureObstacle(): void {
  const back = document.querySelector<HTMLElement>('.back-button');
  if (!stageEl || !back || back.offsetWidth === 0) {
    obstacle = null;
    return;
  }
  // Layout-Positionen statt getBoundingClientRect: Der Knopf liegt außerhalb
  // der Spielansicht und zoomt beim Öffnen nicht mit — über toStage()
  // umgerechnet säße der Pfosten sonst ~30 px daneben.
  const b = layoutOffset(back);
  const s = layoutOffset(stageEl);
  obstacle = {
    x: b.x - s.x + back.offsetWidth / 2,
    y: b.y - s.y + back.offsetHeight / 2,
    r: back.offsetWidth / 2 + 10,
  };
}

/** Position im Layout (Summe der offsetLeft/-Top) — unabhängig von laufenden Transforms. */
function layoutOffset(el: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function pushOutOfObstacle(b: Ball): number {
  if (!obstacle) return 0;
  const dx = b.x - obstacle.x;
  const dy = b.y - obstacle.y;
  const d = Math.hypot(dx, dy);
  const minD = b.r + obstacle.r;
  if (d >= minD) return 0;
  const nx = d < 0.001 ? 1 : dx / d;
  const ny = d < 0.001 ? 1 : dy / d;
  b.x = obstacle.x + nx * minD;
  b.y = obstacle.y + ny * minD;
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return 0;
  b.vx -= (1 + WALL_BOUNCE) * vn * nx;
  b.vy -= (1 + WALL_BOUNCE) * vn * ny;
  return -vn;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/* ---------- Eingabe ---------- */

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

  welle(p.x, p.y);
  const reach = PUSH_REACH * scale;

  for (const b of balls) {
    const dx = b.x - p.x;
    const dy = b.y - p.y;
    const d = Math.hypot(dx, dy);
    let nx: number;
    let ny: number;
    if (d < 1) {
      const a = Math.random() * Math.PI * 2;
      nx = Math.cos(a);
      ny = Math.sin(a);
    } else {
      nx = dx / d;
      ny = dy / d;
    }

    if (d < b.r) {
      // Direkt auf den Ball gehauen: Er schießt vom Finger weg.
      const kick = 950 + 350 * Math.random();
      b.vx += nx * kick;
      b.vy += ny * kick;
      squash(b, 0.2, Math.atan2(ny, nx));
      sound(b, 0.32);
    } else if (d < b.r + reach) {
      // Daneben gepatscht: Druckwelle schubst nahe Bälle weg.
      const falloff = 1 - (d - b.r) / reach;
      const push = 650 * falloff;
      b.vx += nx * push;
      b.vy += ny * push;
      squash(b, 0.1 * falloff, Math.atan2(ny, nx));
    }
    limitSpeed(b);
  }
  wake();
}

function onPointerMove(pe: PointerEvent): void {
  const hand = hands.get(pe.pointerId);
  if (!hand || !placed) return;
  const p = toStage(pe.clientX, pe.clientY);
  const now = performance.now();
  const dt = Math.max(8, now - hand.t) / 1000;
  // Leicht geglättete Handgeschwindigkeit — einzelne Ausreißer-Events sollen
  // keinen Ball quer über den Bildschirm katapultieren.
  hand.vx = hand.vx * 0.4 + ((p.x - hand.x) / dt) * 0.6;
  hand.vy = hand.vy * 0.4 + ((p.y - hand.y) / dt) * 0.6;
  hand.x = p.x;
  hand.y = p.y;
  hand.t = now;

  const handR = HAND_RADIUS * scale;
  let touched = false;
  for (const b of balls) {
    const dx = b.x - p.x;
    const dy = b.y - p.y;
    const d = Math.hypot(dx, dy);
    const minD = b.r + handR;
    if (d >= minD) continue;
    const nx = d < 1 ? 1 : dx / d;
    const ny = d < 1 ? 0 : dy / d;
    // Ball aus der Hand herausschieben, damit er nie unter dem Finger klemmt.
    b.x = p.x + nx * minD;
    b.y = p.y + ny * minD;
    b.dirty = true;
    // Abprallen an der bewegten Hand wie an einem Schläger.
    const rel = (b.vx - hand.vx) * nx + (b.vy - hand.vy) * ny;
    if (rel < 0) {
      b.vx -= 1.6 * rel * nx;
      b.vy -= 1.6 * rel * ny;
      if (-rel > 250) {
        squash(b, Math.min(0.2, -rel / 4000), Math.atan2(ny, nx));
        sound(b, Math.min(0.32, 0.12 + -rel / 6000));
      }
    }
    limitSpeed(b);
    touched = true;
  }
  if (touched) wake();
}

/** Bildschirm- in Bühnenkoordinaten — rechnet einen laufenden Öffnen-Zoom heraus. */
function toStage(clientX: number, clientY: number): { x: number; y: number } {
  const rect = stageEl!.getBoundingClientRect();
  const sx = rect.width > 0 ? stageEl!.clientWidth / rect.width : 1;
  const sy = rect.height > 0 ? stageEl!.clientHeight / rect.height : 1;
  return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
}

function limitSpeed(b: Ball): void {
  const s = Math.hypot(b.vx, b.vy);
  if (s > MAX_SPEED) {
    b.vx *= MAX_SPEED / s;
    b.vy *= MAX_SPEED / s;
  }
}

function squash(b: Ball, amount: number, dir: number): void {
  if (amount > b.squash) {
    b.squash = amount;
    b.squashDir = dir;
  }
}

function sound(b: Ball, gain: number): void {
  const now = performance.now();
  // Pro Ball und insgesamt gedrosselt: Fünf Finger auf einem Ball sind ein
  // Bonk, kein Stapel aus fünf gleichzeitigen.
  if (now - b.lastSoundAt < 70 || now - lastAnySoundAt < 35) return;
  b.lastSoundAt = now;
  lastAnySoundAt = now;
  playBounce(b.def.freq, gain);
}

/** Sichtbare Antwort auf jeden Patscher, auch wenn kein Ball in der Nähe ist. */
function welle(x: number, y: number): void {
  if (!wellenEl || wellenCount >= MAX_WELLEN) return;
  const w = document.createElement('span');
  w.className = 'baelle-welle';
  w.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
  wellenEl.appendChild(w);
  wellenCount++;
  later(() => {
    w.remove();
    wellenCount = Math.max(0, wellenCount - 1);
  }, 650);
}

/* ---------- Physik ---------- */

function wake(): void {
  if (rafId !== null) return;
  lastFrameT = performance.now();
  rafId = requestAnimationFrame(frame);
}

function frame(t: number): void {
  // Begrenztes dt: Nach einer Pause (App im Hintergrund) springt nichts.
  const dt = Math.min(0.033, Math.max(0.001, (t - lastFrameT) / 1000));
  lastFrameT = t;
  const substeps = dt > 0.017 ? 2 : 1;
  for (let i = 0; i < substeps; i++) step(dt / substeps);
  render(false);

  // Ein ruhig aufliegender Finger hält die Schleife bewusst nicht wach —
  // Fingerbewegungen wecken sie in onPointerMove ohnehin wieder auf.
  const moving = balls.some((b) => Math.abs(b.vx) > 3 || Math.abs(b.vy) > 3 || b.squash > 0.002);
  if (moving) {
    rafId = requestAnimationFrame(frame);
  } else {
    rafId = null;
    persist();
  }
}

function step(dt: number): void {
  const f = Math.exp(-FRICTION * dt);
  const roll = ROLL_DECEL * scale * dt;
  for (const b of balls) {
    // Luftwiderstand (anteilig) plus gleichmäßige Rollbremse — ohne die
    // Rollbremse kriecht ein Ball am Ende sekundenlang kaum sichtbar weiter.
    const s = Math.hypot(b.vx, b.vy);
    if (s > 0) {
      const ns = Math.max(0, s * f - roll);
      b.vx *= ns / s;
      b.vy *= ns / s;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.spin += (b.vx * dt) / b.r;
    b.squash *= Math.exp(-11 * dt);
    walls(b);
  }
  collide();
  // Das Auseinanderschieben bei Zusammenstößen kann einen Ball an der Wand
  // leicht über den Rand drücken — vor dem Zeichnen wieder hereinholen.
  for (const b of balls) {
    b.x = clamp(b.x, b.r, stageW - b.r);
    b.y = clamp(b.y, b.r, stageH - b.r);
  }
}

function walls(b: Ball): void {
  let impact = 0;
  let dir = 0;
  if (b.x < b.r) {
    b.x = b.r;
    if (b.vx < 0) {
      impact = -b.vx;
      b.vx = -b.vx * WALL_BOUNCE;
      dir = 0;
    }
  } else if (b.x > stageW - b.r) {
    b.x = stageW - b.r;
    if (b.vx > 0) {
      impact = b.vx;
      b.vx = -b.vx * WALL_BOUNCE;
      dir = Math.PI;
    }
  }
  if (b.y < b.r) {
    b.y = b.r;
    if (b.vy < 0) {
      impact = Math.max(impact, -b.vy);
      b.vy = -b.vy * WALL_BOUNCE;
      dir = Math.PI / 2;
    }
  } else if (b.y > stageH - b.r) {
    b.y = stageH - b.r;
    if (b.vy > 0) {
      impact = Math.max(impact, b.vy);
      b.vy = -b.vy * WALL_BOUNCE;
      dir = -Math.PI / 2;
    }
  }
  const postImpact = pushOutOfObstacle(b);
  if (postImpact > impact && obstacle) {
    impact = postImpact;
    dir = Math.atan2(b.y - obstacle.y, b.x - obstacle.x);
  }
  if (impact > 140) {
    squash(b, Math.min(0.22, impact / 5000), dir);
    // Wand-Bonk etwas tiefer und leiser als ein Treffer mit der Hand.
    const now = performance.now();
    if (now - b.lastSoundAt >= 70 && now - lastAnySoundAt >= 35) {
      b.lastSoundAt = now;
      lastAnySoundAt = now;
      playBounce(b.def.freq * 0.75, Math.min(0.26, 0.06 + impact / 7000));
    }
  }
}

function collide(): void {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      const minD = a.r + b.r;
      if (d >= minD || d < 0.001) continue;
      const nx = dx / d;
      const ny = dy / d;
      // Masse ~ Fläche: Große Bälle schubsen kleine weiter als umgekehrt.
      const ma = a.r * a.r;
      const mb = b.r * b.r;
      const overlap = minD - d;
      a.x -= nx * overlap * (mb / (ma + mb));
      a.y -= ny * overlap * (mb / (ma + mb));
      b.x += nx * overlap * (ma / (ma + mb));
      b.y += ny * overlap * (ma / (ma + mb));

      const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn >= 0) continue;
      const j2 = (-(1 + BALL_BOUNCE) * vn) / (1 / ma + 1 / mb);
      a.vx -= (j2 / ma) * nx;
      a.vy -= (j2 / ma) * ny;
      b.vx += (j2 / mb) * nx;
      b.vy += (j2 / mb) * ny;

      if (-vn > 160) {
        const amount = Math.min(0.18, -vn / 5000);
        squash(a, amount, Math.atan2(ny, nx));
        squash(b, amount, Math.atan2(ny, nx));
        const now = performance.now();
        if (now - lastAnySoundAt >= 35 && now - a.lastSoundAt >= 70) {
          a.lastSoundAt = now;
          b.lastSoundAt = now;
          lastAnySoundAt = now;
          playBounce((a.def.freq + b.def.freq) / 2, Math.min(0.28, 0.08 + -vn / 6000));
        }
      }
    }
  }
}

/** Nur Positionen trennen (ohne Geschwindigkeit/Ton) — für die Startaufstellung. */
function separateOverlaps(): void {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let d = Math.hypot(dx, dy);
      if (d < 0.001) {
        dx = 1;
        dy = 0;
        d = 1;
      }
      const minD = a.r + b.r + 2;
      if (d >= minD) continue;
      const push = (minD - d) / 2;
      a.x -= (dx / d) * push;
      a.y -= (dy / d) * push;
      b.x += (dx / d) * push;
      b.y += (dy / d) * push;
    }
  }
  balls.forEach((b) => {
    pushOutOfObstacle(b);
    b.x = clamp(b.x, b.r, stageW - b.r);
    b.y = clamp(b.y, b.r, stageH - b.r);
  });
}

/**
 * Ausschließlich über `transform` (kein left/top) — jeder Frame löst nur
 * Compositing aus, keinen Layout-Reflow. Das Muster dreht sich auf einem
 * eigenen inneren Element, der Glanzpunkt bleibt fest (Lichtquelle oben links).
 */
function render(force: boolean): void {
  for (const b of balls) {
    if (!force && !b.dirty && b.vx === 0 && b.vy === 0 && b.squash < 0.002) continue;
    b.dirty = false;
    const s = b.squash;
    const deg = (b.squashDir * 180) / Math.PI;
    b.el.style.transform =
      `translate(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px) ` +
      `rotate(${deg.toFixed(1)}deg) scale(${(1 - s).toFixed(3)}, ${(1 + s * 0.6).toFixed(3)}) rotate(${(-deg).toFixed(1)}deg)`;
    b.muster.style.transform = `rotate(${((b.spin * 180) / Math.PI).toFixed(1)}deg)`;
  }
}

function unmount(): void {
  persist();
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  resizeObserver?.disconnect();
  resizeObserver = null;
  hands = new Map();
  balls = [];
  stageEl = null;
  wellenEl = null;
  placed = false;
  savedPos = null;
  obstacle = null;
}

export const baelle: Toy = {
  id: 'baelle',
  accent: '#7ea3c9',
  tileIcon,
  mount,
  unmount,
};

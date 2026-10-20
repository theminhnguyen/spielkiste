import type { Toy } from './types';
import { playGlide } from '../audio';
import { onRuheWechsel } from '../ruhe';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="10" y="16" width="100" height="88" rx="18" fill="#bfe3ee"/>
  <path d="M10 84 C34 76 58 90 82 82 C94 78 104 80 110 84 V86 C110 96 102 104 92 104 H28 C18 104 10 96 10 86 Z" fill="#e9d6a6"/>
  <path d="M30 98 C26 84 34 76 30 62" stroke="#7fb99e" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g transform="translate(46 40)"><ellipse cx="22" cy="14" rx="18" ry="11" fill="#f4a56b"/><path d="M6 14 L-6 4 L-6 24 Z" fill="#f4a56b"/><circle cx="31" cy="11" r="2.8" fill="#2c3e50"/></g>
  <circle cx="88" cy="36" r="4" fill="none" stroke="#fffaf2" stroke-width="2"/>
  <circle cx="94" cy="26" r="3" fill="none" stroke="#fffaf2" stroke-width="2"/>
</svg>`;

interface FischDef {
  farbe: string;
  flosse: string;
  streifen: string | null;
  /** Länge in px bei Maßstab 1 */
  laenge: number;
}

const FISCHE: FischDef[] = [
  { farbe: '#f4a56b', flosse: '#e0864a', streifen: '#fffaf2', laenge: 120 },
  { farbe: '#7ea3c9', flosse: '#5f86ad', streifen: null, laenge: 104 },
  { farbe: '#f4c86b', flosse: '#d4a64a', streifen: '#e88a9a', laenge: 96 },
  { farbe: '#e88a9a', flosse: '#c96f7e', streifen: null, laenge: 110 },
  { farbe: '#7fb99e', flosse: '#5f9a80', streifen: '#fffaf2', laenge: 92 },
  { farbe: '#c896d8', flosse: '#a978bb', streifen: null, laenge: 100 },
  { farbe: '#f4a56b', flosse: '#e0864a', streifen: null, laenge: 84 },
];

function fischSvg(d: FischDef): string {
  return `
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g class="aq-schwanz"><path d="M22 30 L2 12 Q8 30 2 48 Z" fill="${d.flosse}"/></g>
      <path d="M40 12 Q52 2 64 10 Z" fill="${d.flosse}"/>
      <ellipse cx="54" cy="30" rx="36" ry="21" fill="${d.farbe}"/>
      ${d.streifen ? `<path d="M44 11 Q38 30 44 49 M58 9 Q52 30 58 51" stroke="${d.streifen}" stroke-width="5" fill="none" opacity="0.85"/>` : ''}
      <path d="M50 38 Q56 48 62 38 Z" fill="${d.flosse}"/>
      <circle cx="74" cy="24" r="6" fill="#fffaf2"/><circle cx="76" cy="24" r="3.4" fill="#2c3e50"/>
      <path d="M80 36 Q84 39 87 35" stroke="#2c3e50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </svg>`;
}

interface Fisch {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  zx: number;
  zy: number;
  zielBis: number;
  fliehtBis: number;
  blick: 1 | -1;
  tempo: number;
}

interface Finger {
  x: number;
  y: number;
}

const MAX_WELLEN = 8;

let stageEl: HTMLElement | null = null;
let effekteEl: HTMLElement | null = null;
let fische: Fisch[] = [];
let finger = new Map<number, Finger>();
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;
let lastFrameT = 0;
let stageW = 0;
let stageH = 0;
let scale = 1;
let placed = false;
let pausiert = false;
let wellenCount = 0;
let lastBlubAt = 0;

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  finger = new Map();
  placed = false;
  pausiert = false;
  wellenCount = 0;
  stageW = 0;
  stageH = 0;

  container.innerHTML = `
    <div class="aquarium-stage" id="aquariumStage">
      <div class="aq-licht"></div>
      <div class="aq-boden">
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M0 30 C60 10 120 40 200 24 C270 10 330 34 400 20 V100 H0 Z" fill="#e9d6a6"/>
          <path d="M0 60 C80 48 160 70 240 58 C310 48 360 64 400 56 V100 H0 Z" fill="#dcc48f"/>
        </svg>
      </div>
      <div class="aq-steine">
        <span class="aq-stein s1"></span><span class="aq-stein s2"></span><span class="aq-stein s3"></span>
      </div>
      ${[8, 22, 70, 86]
        .map(
          (x, i) => `
        <div class="aq-pflanze" style="left:${x}%;animation-delay:${(-i * 1.1).toFixed(1)}s;--h:${[34, 26, 30, 22][i]}%">
          <svg viewBox="0 0 40 160" preserveAspectRatio="none" width="100%" height="100%">
            <path d="M20 160 C10 120 30 90 18 50 C12 30 22 12 20 0" stroke="${i % 2 ? '#7fb99e' : '#5f9a80'}" stroke-width="10" fill="none" stroke-linecap="round"/>
          </svg>
        </div>`,
        )
        .join('')}
      ${[14, 48, 78].map((x, i) => `<div class="aq-blasenstrom" style="left:${x}%;animation-delay:${(-i * 1.7).toFixed(1)}s"><span></span><span></span><span></span></div>`).join('')}
      <div class="aq-fische" id="aqFische">
        ${FISCHE.map((d, i) => `<div class="aq-fisch" data-i="${i}">${fischSvg(d)}</div>`).join('')}
      </div>
      <div class="aq-effekte" id="aqEffekte"></div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#aquariumStage')!;
  effekteEl = container.querySelector<HTMLElement>('#aqEffekte')!;
  fische = FISCHE.map((d, i) => ({
    el: container.querySelector<HTMLElement>(`.aq-fisch[data-i="${i}"]`)!,
    w: d.laenge,
    h: d.laenge * 0.6,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    zx: 0,
    zy: 0,
    zielBis: 0,
    fliehtBis: 0,
    blick: Math.random() < 0.5 ? 1 : -1,
    tempo: 38 + Math.random() * 26,
  }));

  // Platzieren erst mit echter Bühnengröße (kann beim Öffnen 0×0 sein), bei
  // Drehen anteilig mitnehmen — Layout-Maße statt getBoundingClientRect
  // (siehe Fallen in CLAUDE.md).
  resizeObserver = new ResizeObserver(() => onResize());
  resizeObserver.observe(stageEl);

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    if (!placed) return;
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    const p = toStage(pe.clientX, pe.clientY);
    finger.set(pe.pointerId, p);
    patscher(p.x, p.y);
    wake();
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    if (!finger.has(pe.pointerId)) return;
    finger.set(pe.pointerId, toStage(pe.clientX, pe.clientY));
  });
  const end = (e: Event) => finger.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);

  // Akku schonen: Die Fische schwimmen sonst ununterbrochen — im Ruhezustand
  // hält die Schleife an, der erste Tipp weckt sie wieder.
  cleanup.push(
    onRuheWechsel((ruhe) => {
      pausiert = ruhe;
      if (!ruhe) wake();
    }),
  );
}

function onResize(): void {
  if (!stageEl) return;
  const w = stageEl.clientWidth;
  const h = stageEl.clientHeight;
  if (w < 1 || h < 1) return;
  const oldW = stageW;
  const oldH = stageH;
  stageW = w;
  stageH = h;
  scale = Math.max(0.55, Math.min(1.25, Math.min(w, h) / 834));
  fische.forEach((f, i) => {
    const d = FISCHE[i];
    f.w = d.laenge * scale;
    f.h = f.w * 0.6;
    f.el.style.width = `${f.w.toFixed(1)}px`;
    f.el.style.height = `${f.h.toFixed(1)}px`;
    if (!placed) {
      f.x = w * (0.15 + Math.random() * 0.7);
      f.y = h * (0.15 + Math.random() * 0.55);
      neuesZiel(f, 0);
    } else if (oldW > 0 && oldH > 0) {
      f.x *= w / oldW;
      f.y *= h / oldH;
      f.zx *= w / oldW;
      f.zy *= h / oldH;
    }
  });
  if (!placed) {
    placed = true;
    stageEl.classList.add('bereit');
  }
  render();
  wake();
}

function toStage(clientX: number, clientY: number): Finger {
  const rect = stageEl!.getBoundingClientRect();
  const sx = rect.width > 0 ? stageEl!.clientWidth / rect.width : 1;
  const sy = rect.height > 0 ? stageEl!.clientHeight / rect.height : 1;
  return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
}

function grenzen(): { x0: number; x1: number; y0: number; y1: number } {
  return { x0: stageW * 0.06, x1: stageW * 0.94, y0: stageH * 0.1, y1: stageH * 0.76 };
}

function neuesZiel(f: Fisch, jetzt: number): void {
  const g = grenzen();
  f.zx = g.x0 + Math.random() * (g.x1 - g.x0);
  f.zy = g.y0 + Math.random() * (g.y1 - g.y0);
  f.zielBis = jetzt + 4000 + Math.random() * 5000;
}

/** Patscher: nahe Fische flitzen weg, dazu Wellenring, Blasen und ein „Blub". */
function patscher(x: number, y: number): void {
  const now = performance.now();
  const radius = 300 * scale;
  for (const f of fische) {
    const dx = f.x - x;
    const dy = f.y - y;
    const d = Math.hypot(dx, dy);
    if (d > radius) continue;
    const n = d < 1 ? { x: Math.random() - 0.5, y: Math.random() - 0.5 } : { x: dx / d, y: dy / d };
    const len = Math.hypot(n.x, n.y) || 1;
    const kraft = (420 + 260 * (1 - d / radius)) * scale;
    f.vx = (n.x / len) * kraft;
    f.vy = (n.y / len) * kraft;
    f.fliehtBis = now + 900;
  }
  welle(x, y);
  if (now - lastBlubAt > 90) {
    lastBlubAt = now;
    playGlide(240 + Math.random() * 60, 680 + Math.random() * 160, 0.09, 0.2);
  }
}

function welle(x: number, y: number): void {
  if (!effekteEl || wellenCount >= MAX_WELLEN) return;
  const el = document.createElement('span');
  el.className = 'aq-welle';
  el.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
  el.innerHTML = '<i></i><b></b><b></b><b></b>';
  effekteEl.appendChild(el);
  wellenCount++;
  later(() => {
    el.remove();
    wellenCount = Math.max(0, wellenCount - 1);
  }, 1300);
}

function wake(): void {
  if (rafId !== null || pausiert || !placed) return;
  lastFrameT = performance.now();
  rafId = requestAnimationFrame(frame);
}

function frame(t: number): void {
  const elapsed = Math.min(0.1, Math.max(0.001, (t - lastFrameT) / 1000));
  lastFrameT = t;
  const schritte = Math.ceil(elapsed / 0.02);
  for (let i = 0; i < schritte; i++) step(elapsed / schritte, t);
  render();
  rafId = pausiert ? null : requestAnimationFrame(frame);
}

function step(dt: number, jetzt: number): void {
  const g = grenzen();
  const fingerListe = [...finger.values()];
  fische.forEach((f, i) => {
    if (jetzt < f.fliehtBis) {
      // Wegflitzen: nur bremsen, nicht lenken.
      const brems = Math.exp(-2.2 * dt);
      f.vx *= brems;
      f.vy *= brems;
    } else {
      let zx = f.zx;
      let zy = f.zy;
      let tempo = f.tempo * scale;
      if (fingerListe.length > 0) {
        // Zum nächsten Finger schwimmen und im Kreis um ihn herum bleiben —
        // jeder Fisch an seinem eigenen Platz, damit sie sich nicht stapeln.
        let best = fingerListe[0];
        let bestD = Infinity;
        for (const fp of fingerListe) {
          const d = Math.hypot(fp.x - f.x, fp.y - f.y);
          if (d < bestD) {
            bestD = d;
            best = fp;
          }
        }
        const winkel = (i / fische.length) * Math.PI * 2 + jetzt / 2400;
        const abstand = (70 + (i % 3) * 30) * scale;
        zx = best.x + Math.cos(winkel) * abstand;
        zy = best.y + Math.sin(winkel) * abstand * 0.6;
        tempo = 170 * scale;
      } else if (jetzt > f.zielBis || Math.hypot(f.zx - f.x, f.zy - f.y) < 30 * scale) {
        neuesZiel(f, jetzt);
      }
      const dx = zx - f.x;
      const dy = zy - f.y;
      const d = Math.hypot(dx, dy) || 1;
      // Kurz vor dem Ziel langsamer werden, sonst pendeln sie hin und her.
      const soll = tempo * Math.min(1, d / (60 * scale));
      const wx = (dx / d) * soll;
      const wy = (dy / d) * soll;
      const lenk = Math.min(1, dt * 1.6);
      f.vx += (wx - f.vx) * lenk;
      f.vy += (wy - f.vy) * lenk;
    }
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    // Weiche Wände: zurück ins Becken, ohne harten Abprall.
    if (f.x < g.x0) f.vx += (g.x0 - f.x) * dt * 6;
    if (f.x > g.x1) f.vx -= (f.x - g.x1) * dt * 6;
    if (f.y < g.y0) f.vy += (g.y0 - f.y) * dt * 6;
    if (f.y > g.y1) f.vy -= (f.y - g.y1) * dt * 6;
    f.x = Math.max(f.w / 2, Math.min(stageW - f.w / 2, f.x));
    f.y = Math.max(f.h / 2, Math.min(stageH - f.h / 2, f.y));
    // Blickrichtung mit Spielraum wechseln, sonst flackert sie bei kleinen
    // Seitwärtsbewegungen hin und her.
    if (f.vx > 12) f.blick = 1;
    else if (f.vx < -12) f.blick = -1;
  });
}

/** Nur transform, jeder Fisch auf eigener GPU-Ebene (will-change in style.css). */
function render(): void {
  for (const f of fische) {
    const neigung = Math.max(-18, Math.min(18, (Math.atan2(f.vy, Math.abs(f.vx) + 1) * 180) / Math.PI));
    f.el.style.transform =
      `translate(${(f.x - f.w / 2).toFixed(1)}px, ${(f.y - f.h / 2).toFixed(1)}px) ` +
      // rotate wirkt vor dem Spiegeln (rechts in der Kette zuerst) — so neigt
      // sich der Kopf in beiden Blickrichtungen in Schwimmrichtung.
      `scaleX(${f.blick}) rotate(${neigung.toFixed(1)}deg)`;
  }
}

function unmount(): void {
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
  finger = new Map();
  fische = [];
  stageEl = null;
  effekteEl = null;
  placed = false;
}

export const aquarium: Toy = {
  id: 'aquarium',
  name: 'Aquarium',
  accent: '#7ec8d8',
  tileIcon,
  mount,
  unmount,
};

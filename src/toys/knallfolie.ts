import type { Toy } from './types';
import { playDrum, playPop } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="8" y="8" width="104" height="104" rx="18" fill="#e3f0f5"/>
  <g>
    <circle cx="32" cy="32" r="14" fill="#bfe3f0"/><circle cx="60" cy="32" r="14" fill="#f6d2dc"/><circle cx="88" cy="32" r="14" fill="#fbe6b0"/>
    <circle cx="46" cy="60" r="14" fill="#cfe8d4"/><circle cx="74" cy="60" r="14" fill="#e2d4f0"/>
    <circle cx="32" cy="88" r="14" fill="#fbe6b0"/><circle cx="60" cy="88" r="11" fill="#d5e3ea"/><circle cx="88" cy="88" r="14" fill="#bfe3f0"/>
  </g>
  <g fill="#fff" opacity="0.8">
    <circle cx="27" cy="27" r="4"/><circle cx="55" cy="27" r="4"/><circle cx="83" cy="27" r="4"/>
    <circle cx="41" cy="55" r="4"/><circle cx="69" cy="55" r="4"/><circle cx="27" cy="83" r="4"/><circle cx="83" cy="83" r="4"/>
  </g>
  <path d="M54 82 L66 94 M66 82 L54 94" stroke="#a9bccf" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const FARBEN = ['#bfe3f0', '#f6d2dc', '#fbe6b0', '#cfe8d4', '#e2d4f0'];

/** Zwei Hex-Farben mischen (Anteil a von der ersten) — statt CSS color-mix, das ältere iPads nicht kennen. */
function mischen(f1: string, f2: string, a: number): string {
  const k = (f: string, i: number) => parseInt(f.slice(1 + i * 2, 3 + i * 2), 16);
  const kanal = (i: number) => Math.round(k(f1, i) * a + k(f2, i) * (1 - a)).toString(16).padStart(2, '0');
  return `#${kanal(0)}${kanal(1)}${kanal(2)}`;
}

/** Je Farbe: prall, Schattenrand, platt. */
const TOENE = FARBEN.map((f) => `--kf:${f};--kf-rand:${mischen(f, '#6a7f8c', 0.8)};--kf-platt:${mischen(f, '#e1eef3', 0.45)}`);

/** Nach so langer Zeit ist eine geplatzte Blase wieder prall (plus Zufall, damit es nicht im Gleichtakt passiert). */
const NACHWACHSEN_MS = 5000;
const NACHWACHSEN_ZUFALL_MS = 4000;

interface Blase {
  el: HTMLElement;
  x: number;
  y: number;
  platt: boolean;
  timer: number | null;
  wackeltAt: number;
}

let stageEl: HTMLElement | null = null;
let blasen: Blase[] = [];
let durchmesser = 100;
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let resizeObs: ResizeObserver | null = null;
let letzterPunkt = new Map<number, { x: number; y: number }>();
let lastPopAt = 0;
let lastDumpfAt = 0;
let gebautFuer = '';

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
  letzterPunkt = new Map();
  blasen = [];
  gebautFuer = '';

  container.innerHTML = `<div class="knall-stage" id="knallStage"></div>`;
  stageEl = container.querySelector<HTMLElement>('#knallStage')!;

  // Raster erst bauen, wenn die Bühne eine Größe hat, und nach Drehen neu
  // (siehe CLAUDE.md: nie nur einmal beim Mount messen).
  resizeObs = new ResizeObserver(() => aufbauen());
  resizeObs.observe(stageEl);
  aufbauen();

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    const p = aufBuehne(pe.clientX, pe.clientY);
    letzterPunkt.set(pe.pointerId, p);
    // Eine ganze Hand meldet eine große Kontaktfläche — dann platzt entsprechend mehr.
    // Getroffen ist jede Blase, die die Kontaktfläche berührt.
    const kontakt = Math.max(pe.width || 0, pe.height || 0) / 2 + durchmesser * 0.4;
    const n = knallen(p.x, p.y, Math.max(durchmesser * 0.6, kontakt));
    if (n === 0) dumpf(p.x, p.y);
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    const von = letzterPunkt.get(pe.pointerId);
    if (!von) return;
    const bis = aufBuehne(pe.clientX, pe.clientY);
    // Schnelles Wischen springt weit — die Strecke dazwischen abtasten, damit
    // keine Blase auf dem Weg übersprungen wird.
    const dist = Math.hypot(bis.x - von.x, bis.y - von.y);
    const schritte = Math.max(1, Math.ceil(dist / (durchmesser * 0.4)));
    for (let i = 1; i <= schritte; i++) {
      const t = i / schritte;
      knallen(von.x + (bis.x - von.x) * t, von.y + (bis.y - von.y) * t, durchmesser * 0.5);
    }
    letzterPunkt.set(pe.pointerId, bis);
  });
  const end = (e: Event) => letzterPunkt.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

/** Bildschirm- in Bühnenkoordinaten, auch während die Spielansicht noch hineinzoomt. */
function aufBuehne(clientX: number, clientY: number): { x: number; y: number } {
  const r = stageEl!.getBoundingClientRect();
  const s = stageEl!.clientWidth / (r.width || 1);
  return { x: (clientX - r.left) * s, y: (clientY - r.top) * s };
}

/** Wabenraster über die ganze Bühne; Blasen am Rand dürfen angeschnitten sein, wie bei echter Folie. */
function aufbauen(): void {
  if (!stageEl) return;
  const w = stageEl.clientWidth;
  const h = stageEl.clientHeight;
  if (w === 0 || h === 0) return;
  const schluessel = `${w}x${h}`;
  if (schluessel === gebautFuer) return;
  gebautFuer = schluessel;

  for (const b of blasen) {
    if (b.timer === null) continue;
    window.clearTimeout(b.timer);
    timers.delete(b.timer);
  }
  durchmesser = Math.max(64, Math.min(130, Math.min(w, h) / 6.2));
  const dx = durchmesser * 1.1;
  const dy = durchmesser * 0.96;
  const spalten = Math.ceil(w / dx) + 1;
  const zeilen = Math.ceil(h / dy) + 1;
  const x0 = (w - (spalten - 1) * dx) / 2;
  const y0 = (h - (zeilen - 1) * dy) / 2;

  const teile: string[] = [];
  const pos: Array<[number, number]> = [];
  for (let z = 0; z < zeilen; z++) {
    for (let s = 0; s < spalten; s++) {
      const x = x0 + s * dx + (z % 2 === 1 ? dx / 2 : 0) - dx / 4;
      const y = y0 + z * dy;
      pos.push([x, y]);
      const toene = TOENE[Math.floor(Math.random() * TOENE.length)];
      teile.push(
        `<div class="kf-blase" style="left:${(x - durchmesser / 2).toFixed(1)}px;top:${(y - durchmesser / 2).toFixed(1)}px;${toene}"><div class="kf-flach"></div><div class="kf-kugel"></div></div>`,
      );
    }
  }
  stageEl.style.setProperty('--kf-d', `${durchmesser.toFixed(1)}px`);
  stageEl.innerHTML = teile.join('');
  const els = stageEl.querySelectorAll<HTMLElement>('.kf-blase');
  blasen = pos.map(([x, y], i) => ({ el: els[i], x, y, platt: false, timer: null, wackeltAt: 0 }));
}

/** Lässt alle prallen Blasen im Umkreis platzen; gibt die Anzahl zurück. */
function knallen(x: number, y: number, radius: number): number {
  let n = 0;
  for (const b of blasen) {
    if (b.platt) continue;
    if (Math.hypot(b.x - x, b.y - y) > radius) continue;
    b.platt = true;
    b.el.classList.add('platt', 'platzt');
    n++;
    b.timer = later(() => nachwachsen(b), NACHWACHSEN_MS + Math.random() * NACHWACHSEN_ZUFALL_MS);
    later(() => b.el.classList.remove('platzt'), 400);
  }
  if (n > 0) {
    const now = performance.now();
    if (now - lastPopAt > 28) {
      lastPopAt = now;
      playPop(Math.min(0.32, 0.16 + n * 0.03));
      // Viele auf einmal (Patscher mit der Hand): ein knatterndes Nachknallen.
      if (n >= 3) later(() => playPop(0.14), 35);
      if (n >= 6) later(() => playPop(0.12), 75);
    }
  }
  return n;
}

function nachwachsen(b: Blase): void {
  b.timer = null;
  b.platt = false;
  b.el.classList.remove('platt');
}

/** Nur schon Geplatztes getroffen: die Folie wackelt und macht ein dumpfes Geräusch — kein Tipp bleibt ohne Antwort. */
function dumpf(x: number, y: number): void {
  const now = performance.now();
  for (const b of blasen) {
    if (Math.hypot(b.x - x, b.y - y) > durchmesser * 0.9 || now - b.wackeltAt < 300) continue;
    b.wackeltAt = now;
    b.el.classList.remove('wackelt');
    void b.el.offsetWidth;
    b.el.classList.add('wackelt');
  }
  if (now - lastDumpfAt > 80) {
    lastDumpfAt = now;
    playDrum(120, 0.12, 0.12);
  }
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  resizeObs?.disconnect();
  resizeObs = null;
  letzterPunkt = new Map();
  blasen = [];
  stageEl = null;
}

export const knallfolie: Toy = {
  id: 'knallfolie',
  name: 'Knallfolie',
  accent: '#bfe3f0',
  tileIcon,
  mount,
  unmount,
};

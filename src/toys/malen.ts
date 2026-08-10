import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playClick } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`;

const COLORS = ['#e88a9a', '#7fb99e', '#f4c86b', '#7ea3c9', '#e0a458', '#6b5d4a'];

interface MalenState {
  dataUrl: string | null;
}

const STATE_KEY = 'malen';
const STATE_VERSION = 1;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let stageEl: HTMLElement | null = null;
let currentColor = COLORS[0];
let drawing = false;
let lastX = 0;
let lastY = 0;
let cleanup: Array<() => void> = [];
let resizeTimer: number | null = null;

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function mount(container: HTMLElement): void {
  cleanup = [];
  drawing = false;
  currentColor = COLORS[0];

  container.innerHTML = `
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${COLORS.map((c, i) => `<button class="malen-swatch${i === 0 ? ' selected' : ''}" data-color="${c}" style="--swatch-color:${c}" aria-hidden="true"></button>`).join('')}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#malenStage')!;
  canvas = container.querySelector<HTMLCanvasElement>('#malenCanvas')!;
  ctx = canvas.getContext('2d');

  fitCanvas();
  restoreImage();

  on(canvas, 'pointerdown', onPointerDown);
  on(canvas, 'pointermove', onPointerMove);
  on(canvas, 'pointerup', onPointerUp);
  on(canvas, 'pointercancel', onPointerUp);

  const swatches = container.querySelectorAll<HTMLButtonElement>('.malen-swatch');
  swatches.forEach((sw) => {
    on(sw, 'pointerdown', (e) => {
      e.preventDefault();
      currentColor = sw.dataset.color ?? COLORS[0];
      swatches.forEach((s) => s.classList.remove('selected'));
      sw.classList.add('selected');
      playClick(500);
    });
  });

  const newSheetBtn = container.querySelector<HTMLButtonElement>('#malenNewSheet')!;
  on(newSheetBtn, 'pointerdown', (e) => {
    e.preventDefault();
    crumpleAndClear();
  });

  const onResize = () => {
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      fitCanvas();
      restoreImage();
    }, 200);
  };
  on(window, 'resize', onResize);
}

function fitCanvas(): void {
  if (!canvas || !stageEl) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = stageEl.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 22;
  }
}

function restoreImage(): void {
  const state = loadState<MalenState>(STATE_KEY, STATE_VERSION, { dataUrl: null });
  if (!state.dataUrl || !canvas || !ctx) return;
  const img = new Image();
  img.onload = () => {
    if (!ctx || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
  };
  img.src = state.dataUrl;
}

function persistImage(): void {
  if (!canvas) return;
  try {
    const dataUrl = canvas.toDataURL('image/png');
    saveState<MalenState>(STATE_KEY, STATE_VERSION, { dataUrl });
  } catch {
    /* Speicher voll — Zeichnung bleibt nur für die Sitzung erhalten */
  }
}

function getPos(e: PointerEvent): { x: number; y: number } {
  const rect = canvas!.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function onPointerDown(e: Event): void {
  const pe = e as PointerEvent;
  pe.preventDefault();
  if (!canvas || !ctx) return;
  try {
    canvas.setPointerCapture(pe.pointerId);
  } catch {
    /* Pointer bereits inaktiv — Malen funktioniert trotzdem über normales Bubbling */
  }
  drawing = true;
  const { x, y } = getPos(pe);
  lastX = x;
  lastY = y;
  ctx.strokeStyle = currentColor;
  ctx.fillStyle = currentColor;
  ctx.beginPath();
  ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
}

function onPointerMove(e: Event): void {
  if (!drawing || !ctx) return;
  const pe = e as PointerEvent;
  const { x, y } = getPos(pe);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX = x;
  lastY = y;
}

function onPointerUp(e: Event): void {
  if (!drawing) return;
  drawing = false;
  const pe = e as PointerEvent;
  if (canvas && pe.pointerId !== undefined) {
    try {
      canvas.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
  }
  persistImage();
}

function crumpleAndClear(): void {
  if (!canvas || !ctx || !stageEl) return;

  const snapshot = canvas.toDataURL('image/png');
  const overlay = document.createElement('img');
  overlay.src = snapshot;
  overlay.className = 'malen-crumple-overlay';
  overlay.style.width = canvas.style.width;
  overlay.style.height = canvas.style.height;
  stageEl.appendChild(overlay);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  saveState<MalenState>(STATE_KEY, STATE_VERSION, { dataUrl: null });
  playClick(300);

  // Forced Reflow statt requestAnimationFrame: rAF wird in Hintergrund-/
  // verdeckten Tabs gedrosselt und feuert dort nicht zuverlässig (siehe
  // main.ts-Historie). Das synchrone Auslesen von offsetWidth zwingt den
  // Browser, den "Vorher"-Zustand zu committen, bevor die Klasse (und damit
  // der CSS-Transition-Übergang) gesetzt wird — funktioniert unabhängig
  // von rAF-Timing.
  void overlay.offsetWidth;
  overlay.classList.add('crumpling');

  window.setTimeout(() => {
    overlay.remove();
  }, 550);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer);
    resizeTimer = null;
  }
  canvas = null;
  ctx = null;
  stageEl = null;
}

export const malen: Toy = {
  id: 'malen',
  accent: '#7ea3c9',
  tileIcon,
  mount,
  unmount,
};

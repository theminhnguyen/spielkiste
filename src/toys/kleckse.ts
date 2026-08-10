import type { Toy } from './types';
import { playTone, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`;

interface BlobDef {
  id: number;
  color: string;
  note: number;
  xPct: number;
  yPct: number;
  radiusPx: number;
}

const BLOB_DEFS: BlobDef[] = [
  { id: 0, color: '#e88a9a', note: 0, xPct: 22, yPct: 30, radiusPx: 58 },
  { id: 1, color: '#7fb99e', note: 1, xPct: 50, yPct: 22, radiusPx: 62 },
  { id: 2, color: '#f4c86b', note: 2, xPct: 78, yPct: 32, radiusPx: 56 },
  { id: 3, color: '#7ea3c9', note: 3, xPct: 30, yPct: 68, radiusPx: 60 },
  { id: 4, color: '#e0a458', note: 4, xPct: 58, yPct: 74, radiusPx: 58 },
  { id: 5, color: '#c896d8', note: 5, xPct: 80, yPct: 66, radiusPx: 54 },
];

interface BlobRuntime {
  def: BlobDef;
  el: HTMLElement;
  xPct: number;
  yPct: number;
  grabbed: boolean;
  lastX: number;
  lastY: number;
  lastT: number;
}

let stageEl: HTMLElement | null = null;
let blobs: BlobRuntime[] = [];
let cleanup: Array<() => void> = [];
let collidingPairs = new Set<string>();

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function mount(container: HTMLElement): void {
  cleanup = [];
  collidingPairs = new Set();

  container.innerHTML = `
    <div class="kleckse-stage" id="kleckseStage">
      ${BLOB_DEFS.map(
        (b) => `
        <div class="klecks" data-id="${b.id}" style="--blob-color:${b.color}; width:${b.radiusPx * 2}px; height:${b.radiusPx * 2}px;">
          <div class="klecks-face">
            <div class="klecks-eyes">
              <div class="klecks-eye" style="animation-delay:${(b.id * 0.9 + 1).toFixed(2)}s"></div>
              <div class="klecks-eye" style="animation-delay:${(b.id * 0.9 + 1).toFixed(2)}s"></div>
            </div>
            <div class="klecks-mouth"></div>
          </div>
        </div>
      `,
      ).join('')}
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#kleckseStage')!;
  blobs = BLOB_DEFS.map((def) => ({
    def,
    el: container.querySelector<HTMLElement>(`.klecks[data-id="${def.id}"]`)!,
    xPct: def.xPct,
    yPct: def.yPct,
    grabbed: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
  }));

  blobs.forEach((blob) => {
    applyTransform(blob);
    setupBlob(blob);
  });
}

/**
 * Positioniert den Klecks ausschließlich über `transform` (kein left/top) —
 * damit löst jede Bewegung nur Compositing aus, kein Layout-Reflow. Wichtig
 * beim Multi-Touch-Patschen, wo mehrere Finger gleichzeitig ziehen können.
 */
function applyTransform(blob: BlobRuntime, scaleX = 1, scaleY = 1): void {
  if (!stageEl) return;
  const rect = stageEl.getBoundingClientRect();
  const x = (blob.xPct / 100) * rect.width - blob.def.radiusPx;
  const y = (blob.yPct / 100) * rect.height - blob.def.radiusPx;
  blob.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
}

function setupBlob(blob: BlobRuntime): void {
  const el = blob.el;

  on(el, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      el.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv — Griff funktioniert trotzdem über normales Bubbling */
    }
    blob.grabbed = true;
    blob.lastX = pe.clientX;
    blob.lastY = pe.clientY;
    blob.lastT = performance.now();
    el.classList.add('grabbed');
    playTone({
      freq: PENTATONIC_HZ[blob.def.note % PENTATONIC_HZ.length],
      duration: 0.35,
      gain: 0.35,
    });
    squish(blob, 1.18);
  });

  on(el, 'pointermove', (e) => {
    if (!blob.grabbed || !stageEl) return;
    const pe = e as PointerEvent;
    const rect = stageEl.getBoundingClientRect();
    const now = performance.now();
    const dt = Math.max(1, now - blob.lastT);
    const vx = (pe.clientX - blob.lastX) / dt;
    const vy = (pe.clientY - blob.lastY) / dt;
    blob.lastX = pe.clientX;
    blob.lastY = pe.clientY;
    blob.lastT = now;

    blob.xPct = clamp(((pe.clientX - rect.left) / rect.width) * 100, 6, 94);
    blob.yPct = clamp(((pe.clientY - rect.top) / rect.height) * 100, 8, 92);
    applyJelly(blob, vx, vy);
    checkCollisions(blob);
  });

  function endDrag(e: Event): void {
    if (!blob.grabbed) return;
    blob.grabbed = false;
    el.classList.remove('grabbed');
    const pe = e as PointerEvent;
    if (pe.pointerId !== undefined) {
      try {
        el.releasePointerCapture(pe.pointerId);
      } catch {
        /* bereits freigegeben */
      }
    }
    applyTransform(blob, 1, 1);
  }

  on(el, 'pointerup', endDrag);
  on(el, 'pointercancel', endDrag);
}

function applyJelly(blob: BlobRuntime, vx: number, vy: number): void {
  const speed = Math.min(Math.hypot(vx, vy) * 6, 0.28);
  const angle = Math.atan2(vy, vx);
  const stretchX = 1 + speed * Math.abs(Math.cos(angle));
  const stretchY = 1 - speed * Math.abs(Math.cos(angle)) * 0.6 + speed * Math.abs(Math.sin(angle)) * 0.1;
  applyTransform(blob, stretchX, stretchY);
}

function squish(blob: BlobRuntime, amount: number): void {
  applyTransform(blob, amount, amount);
  window.setTimeout(() => {
    if (!blob.el.classList.contains('grabbed')) {
      applyTransform(blob, 1, 1);
    }
  }, 160);
}

function pairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function checkCollisions(moved: BlobRuntime): void {
  if (!stageEl) return;
  const rect = stageEl.getBoundingClientRect();
  const mx = (moved.xPct / 100) * rect.width;
  const my = (moved.yPct / 100) * rect.height;

  for (const other of blobs) {
    if (other.def.id === moved.def.id) continue;
    const ox = (other.xPct / 100) * rect.width;
    const oy = (other.yPct / 100) * rect.height;
    const dist = Math.hypot(mx - ox, my - oy);
    const threshold = moved.def.radiusPx * 0.75 + other.def.radiusPx * 0.75;
    const key = pairKey(moved.def.id, other.def.id);

    if (dist < threshold) {
      if (!collidingPairs.has(key)) {
        collidingPairs.add(key);
        playTone({
          freq: PENTATONIC_HZ[moved.def.note % PENTATONIC_HZ.length],
          duration: 0.25,
          gain: 0.22,
        });
        playTone({
          freq: PENTATONIC_HZ[other.def.note % PENTATONIC_HZ.length],
          duration: 0.25,
          gain: 0.22,
        });
        squish(other, 1.1);
      }
    } else {
      collidingPairs.delete(key);
    }
  }
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  blobs = [];
  stageEl = null;
  collidingPairs = new Set();
}

export const kleckse: Toy = {
  id: 'kleckse',
  accent: '#e88a9a',
  tileIcon,
  mount,
  unmount,
};

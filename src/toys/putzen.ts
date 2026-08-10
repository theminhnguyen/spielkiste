import type { Toy } from './types';
import { playTone, playWhoosh, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`;

interface Motiv {
  /** Untergrund, der zum Vorschein kommt */
  clean: string;
  /** Farbe der Schmutzschicht */
  dirt: string;
  /** Farbe der Sprenkel in der Schmutzschicht */
  fleck: string;
}

const MOTIVE: Motiv[] = [
  {
    // Hund
    clean: `<svg viewBox="0 0 200 200">
      <ellipse cx="100" cy="132" rx="62" ry="48" fill="#e0a458"/>
      <circle cx="100" cy="82" r="46" fill="#eab77a"/>
      <ellipse cx="58" cy="66" rx="16" ry="26" fill="#c98f4e" transform="rotate(-18 58 66)"/>
      <ellipse cx="142" cy="66" rx="16" ry="26" fill="#c98f4e" transform="rotate(18 142 66)"/>
      <circle cx="85" cy="78" r="6" fill="#4a4032"/>
      <circle cx="115" cy="78" r="6" fill="#4a4032"/>
      <ellipse cx="100" cy="96" rx="10" ry="7" fill="#4a4032"/>
      <path d="M100 103 Q100 112 90 114" stroke="#4a4032" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M100 103 Q100 112 110 114" stroke="#4a4032" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`,
    dirt: '#8a6b4a',
    fleck: '#6d5238',
  },
  {
    // Fenster mit Aussicht
    clean: `<svg viewBox="0 0 200 200">
      <rect x="18" y="18" width="164" height="164" rx="10" fill="#bfe6ee"/>
      <circle cx="146" cy="56" r="22" fill="#f7d570"/>
      <path d="M18 148 Q60 108 100 148 Q140 112 182 148 L182 182 L18 182 Z" fill="#9ec99f"/>
      <ellipse cx="62" cy="52" rx="24" ry="13" fill="#fffaf2"/>
      <ellipse cx="86" cy="58" rx="17" ry="10" fill="#fffaf2"/>
      <rect x="18" y="18" width="164" height="164" rx="10" fill="none" stroke="#cbb98a" stroke-width="10"/>
      <rect x="95" y="18" width="10" height="164" fill="#cbb98a"/>
      <rect x="18" y="95" width="164" height="10" fill="#cbb98a"/>
    </svg>`,
    dirt: '#9aa38f',
    fleck: '#7d8673',
  },
  {
    // Auto
    clean: `<svg viewBox="0 0 200 200">
      <rect x="24" y="96" width="152" height="48" rx="16" fill="#e88a9a"/>
      <path d="M52 96 L68 62 H132 L150 96 Z" fill="#f2a9b6"/>
      <rect x="72" y="68" width="24" height="24" rx="4" fill="#cfeaf5"/>
      <rect x="106" y="68" width="24" height="24" rx="4" fill="#cfeaf5"/>
      <circle cx="62" cy="148" r="20" fill="#4a4032"/>
      <circle cx="62" cy="148" r="8" fill="#a89a82"/>
      <circle cx="140" cy="148" r="20" fill="#4a4032"/>
      <circle cx="140" cy="148" r="8" fill="#a89a82"/>
      <circle cx="34" cy="112" r="7" fill="#f7d570"/>
    </svg>`,
    dirt: '#7d6b52',
    fleck: '#5f5040',
  },
];

const BRUSH_RADIUS = 34;
/** Ab so viel freigeriebener Fläche gilt das Motiv als sauber. */
const CLEAN_THRESHOLD = 0.82;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let stageEl: HTMLElement | null = null;
let motivIndex = 0;
let isClean = false;
let cleanup: Array<() => void> = [];
let resizeTimer: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let sparkleTimers: number[] = [];

/** Pro Finger die letzte Position — mehrere Hände dürfen gleichzeitig wischen. */
const strokes = new Map<number, { x: number; y: number }>();

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function mount(container: HTMLElement): void {
  cleanup = [];
  strokes.clear();
  sparkleTimers = [];
  motivIndex = 0;
  isClean = false;

  container.innerHTML = `
    <div class="putzen-stage" id="putzenStage">
      <div class="putzen-motiv" id="putzenMotiv"></div>
      <canvas class="putzen-canvas" id="putzenCanvas"></canvas>
      <div class="putzen-funkeln" id="putzenFunkeln"></div>
      <button class="putzen-next" id="putzenNext" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M24 8 A16 16 0 1 1 12 14" fill="none" stroke="#8a7255" stroke-width="4" stroke-linecap="round"/>
          <path d="M8 6 L12 15 L21 12" fill="none" stroke="#8a7255" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#putzenStage')!;
  canvas = container.querySelector<HTMLCanvasElement>('#putzenCanvas')!;

  showMotiv(container, 0);

  on(canvas, 'pointerdown', onDown);
  on(canvas, 'pointermove', onMove);
  on(canvas, 'pointerup', onUp);
  on(canvas, 'pointercancel', onUp);

  const nextBtn = container.querySelector<HTMLButtonElement>('#putzenNext')!;
  on(nextBtn, 'pointerdown', (e) => {
    e.preventDefault();
    showMotiv(container, motivIndex + 1);
    playWhoosh();
  });

  // Zwei Quellen bewusst kombiniert: Der ResizeObserver greift auch bei
  // iPad-Split-View/Stage Manager (Fläche ändert sich ohne Geräte-Drehung),
  // wird aber über die Frame-Schleife zugestellt und fällt damit aus, wenn
  // die App im Hintergrund gedrosselt wird. window.resize deckt genau diese
  // Lücke beim Drehen ab. Beide laufen in denselben entprellten Refit.
  let lastW = stageEl.clientWidth;
  let lastH = stageEl.clientHeight;

  const refitIfChanged = () => {
    if (!stageEl) return;
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    // Bei Größenänderung wird neu verschmutzt — den halb geputzten Stand exakt
    // umzurechnen wäre aufwendig und für das Spielgefühl ohne Wert.
    resizeTimer = window.setTimeout(() => fitAndDirty(), 220);
  };

  resizeObserver = new ResizeObserver(refitIfChanged);
  resizeObserver.observe(stageEl);
  on(window, 'resize', refitIfChanged);
  on(window, 'orientationchange', refitIfChanged);
}

function showMotiv(container: HTMLElement, index: number): void {
  motivIndex = ((index % MOTIVE.length) + MOTIVE.length) % MOTIVE.length;
  isClean = false;
  stageEl?.classList.remove('sauber');
  const motivEl = container.querySelector<HTMLElement>('#putzenMotiv')!;
  motivEl.innerHTML = MOTIVE[motivIndex].clean;
  fitAndDirty();
}

function fitAndDirty(): void {
  if (!canvas || !stageEl) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // clientWidth/Height statt getBoundingClientRect(): Beim Öffnen läuft noch der
  // scale(0.92)→scale(1)-Übergang der Spielzeug-Ansicht, und der Rect wäre dann
  // um den Skalierungsfaktor zu klein — die Schmutzschicht würde den Rand nicht
  // abdecken. Layout-Maße sind von Transforms unabhängig.
  const w = stageEl.clientWidth;
  const h = stageEl.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  paintDirt(w, h);
}

function paintDirt(w: number, h: number): void {
  if (!ctx) return;
  const motiv = MOTIVE[motivIndex];
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = motiv.dirt;
  ctx.fillRect(0, 0, w, h);

  // Unregelmäßige Sprenkel, damit die Schicht nicht wie eine glatte Fläche wirkt.
  ctx.fillStyle = motiv.fleck;
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 6 + Math.random() * 26;
    ctx.globalAlpha = 0.18 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.6 + Math.random() * 0.7), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function posOf(e: PointerEvent): { x: number; y: number } {
  const c = canvas!;
  const rect = c.getBoundingClientRect();
  // Rect ist die *visuelle* Größe. Läuft noch der Öffnungs-Übergang, ist sie
  // skaliert — deshalb zurück in den Zeichen-Koordinatenraum rechnen.
  const sx = rect.width === 0 ? 1 : c.clientWidth / rect.width;
  const sy = rect.height === 0 ? 1 : c.clientHeight / rect.height;
  return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
}

function onDown(e: Event): void {
  const pe = e as PointerEvent;
  pe.preventDefault();
  if (!canvas || !ctx) return;
  try {
    canvas.setPointerCapture(pe.pointerId);
  } catch {
    /* Pointer bereits inaktiv */
  }
  const p = posOf(pe);
  strokes.set(pe.pointerId, p);
  wipeAt(p.x, p.y);
  rub();
}

function onMove(e: Event): void {
  const pe = e as PointerEvent;
  const last = strokes.get(pe.pointerId);
  if (!last || !ctx) return;
  const p = posOf(pe);
  wipeLine(last.x, last.y, p.x, p.y);
  strokes.set(pe.pointerId, p);
  rub();
}

function onUp(e: Event): void {
  const pe = e as PointerEvent;
  if (!strokes.has(pe.pointerId)) return;
  strokes.delete(pe.pointerId);
  if (canvas) {
    try {
      canvas.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
  }
  checkClean();
}

/** Radiert die Schmutzschicht an einer Stelle weg. */
function wipeAt(x: number, y: number): void {
  if (!ctx) return;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

function wipeLine(x1: number, y1: number, x2: number, y2: number): void {
  if (!ctx) return;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = BRUSH_RADIUS * 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

let lastRubAt = 0;

/** Leises Schrubbeln, bewusst gedrosselt statt bei jedem Pointermove. */
function rub(): void {
  const now = performance.now();
  if (now - lastRubAt < 130) return;
  lastRubAt = now;
  playTone({ freq: 180 + Math.random() * 90, duration: 0.05, attack: 0.01, release: 0.1, type: 'triangle', gain: 0.07 });
}

/** Stichprobenraster statt aller Pixel — reicht für die Schwelle und ist billig. */
function cleanRatio(): number {
  if (!canvas || !ctx) return 0;
  const cols = 24;
  const rows = 24;
  let clear = 0;
  let total = 0;
  const stepX = canvas.width / cols;
  const stepY = canvas.height / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = Math.min(canvas.width - 1, Math.floor(i * stepX + stepX / 2));
      const y = Math.min(canvas.height - 1, Math.floor(j * stepY + stepY / 2));
      const alpha = ctx.getImageData(x, y, 1, 1).data[3];
      if (alpha < 40) clear++;
      total++;
    }
  }
  return total === 0 ? 0 : clear / total;
}

function checkClean(): void {
  if (isClean) return;
  if (cleanRatio() < CLEAN_THRESHOLD) return;
  isClean = true;

  // Rest wegwischen, damit keine Schmutzinseln stehen bleiben.
  if (ctx && canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  }

  stageEl?.classList.add('sauber');
  [0, 130, 260].forEach((delay, i) => {
    const id = window.setTimeout(() => {
      playTone({ freq: PENTATONIC_HZ[i + 3], duration: 0.3, attack: 0.01, release: 0.5, gain: 0.24 });
    }, delay);
    sparkleTimers.push(id);
  });
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (resizeTimer !== null) {
    window.clearTimeout(resizeTimer);
    resizeTimer = null;
  }
  sparkleTimers.forEach((id) => window.clearTimeout(id));
  sparkleTimers = [];
  strokes.clear();
  canvas = null;
  ctx = null;
  stageEl = null;
}

export const putzen: Toy = {
  id: 'putzen',
  accent: '#7ec8d8',
  tileIcon,
  mount,
  unmount,
};

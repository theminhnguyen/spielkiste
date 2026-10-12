import './style.css';
import { unlockAudio, playTone, isAudioReady } from './audio';
import { renderElternbereich, loadSettings } from './eltern';
import type { Toy } from './toys/types';
import { brett } from './toys/brett';
import { kleckse } from './toys/kleckse';
import { malen } from './toys/malen';
import { sortierer } from './toys/sortierer';
import { blasen } from './toys/blasen';
import { putzen } from './toys/putzen';
import { sticker } from './toys/sticker';
import { wimmelbild } from './toys/wimmelbild';
import { gutenacht } from './toys/gutenacht';
import { trommeln } from './toys/trommeln';
import { baelle } from './toys/baelle';
import { laub } from './toys/laub';

loadSettings();

const toys: Toy[] = [
  brett,
  kleckse,
  malen,
  sortierer,
  blasen,
  putzen,
  sticker,
  wimmelbild,
  gutenacht,
  trommeln,
  baelle,
  laub,
];

const app = document.querySelector<HTMLDivElement>('#app')!;

const backArrow = `
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const gateRingRadius = 18;
const gateCircumference = 2 * Math.PI * gateRingRadius;

const gateIcon = `
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${gateRingRadius}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${gateRingRadius}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${gateCircumference}" stroke-dashoffset="${gateCircumference}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`;

app.innerHTML = `
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${gateIcon}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${backArrow}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v${__APP_VERSION__} · ${__COMMIT_HASH__}</div>
`;

const spielzimmerEl = document.querySelector<HTMLDivElement>('#spielzimmer')!;
const tilesEl = document.querySelector<HTMLDivElement>('#tiles')!;
const toyViewEl = document.querySelector<HTMLDivElement>('#toyView')!;
const toyStageEl = document.querySelector<HTMLDivElement>('#toyStage')!;
const backButtonEl = document.querySelector<HTMLButtonElement>('#backButton')!;
const elternGateEl = document.querySelector<HTMLButtonElement>('#elternGate')!;
const elternOverlayEl = document.querySelector<HTMLDivElement>('#elternOverlay')!;
const elternPanelWrapEl = document.querySelector<HTMLDivElement>('#elternPanelWrap')!;

let activeToy: Toy | null = null;
let isAnimating = false;

function renderTiles(): void {
  tilesEl.innerHTML = '';
  toys.forEach((toy, i) => {
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.style.setProperty('--accent', toy.accent);
    // Versetzter Atem-Rhythmus, damit die Kacheln nicht im Gleichtakt pulsieren.
    btn.style.animationDelay = `${((i * 0.7) % 4.5).toFixed(2)}s`;
    btn.innerHTML = toy.tileIcon;
    btn.setAttribute('aria-hidden', 'true');
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      openToy(toy);
    });
    tilesEl.appendChild(btn);
  });
}

function openToy(toy: Toy): void {
  if (isAnimating || activeToy) return;
  isAnimating = true;
  activeToy = toy;

  toy.mount(toyStageEl);
  spielzimmerEl.classList.add('hidden');
  backButtonEl.classList.add('visible');
  toyViewEl.classList.add('active');

  window.setTimeout(() => {
    isAnimating = false;
  }, 450);
}

function closeToy(): void {
  if (isAnimating || !activeToy) return;
  isAnimating = true;

  toyViewEl.classList.remove('active');
  spielzimmerEl.classList.remove('hidden');
  backButtonEl.classList.remove('visible');

  window.setTimeout(() => {
    activeToy?.unmount?.();
    toyStageEl.innerHTML = '';
    activeToy = null;
    isAnimating = false;
  }, 450);
}

/* ---------- Zurück-Knopf: nur ein bewusster Einzelfinger-Tipp ---------- */

// Beim Patschen mit der ganzen Hand landet leicht ein Finger auf dem Knopf.
// Deshalb gilt nur ein kurzer Tipp mit genau einem Finger, losgelassen auf
// dem Knopf. Kommt kurz davor oder währenddessen ein weiterer Finger irgendwo
// auf den Bildschirm, ist es ein Patscher und zählt nicht. Bewusst über
// Zeitfenster statt über eine Liste aktiver Finger gelöst: Ein verlorenes
// pointerup könnte den Knopf sonst dauerhaft blockieren.
const BACK_MULTI_WINDOW_MS = 150;
const BACK_MAX_PRESS_MS = 1200;
const BACK_MAX_MOVE_PX = 40;

/** Der Finger, der vor dem aktuellen aufgesetzt wurde (egal wo). */
// Alle Zeiten sind Event-Zeitstempel (e.timeStamp = wann der Finger das Glas
// berührt hat), nicht der Zeitpunkt, zu dem der Handler läuft: Ist Safari
// gerade mit Zeichnen beschäftigt, kommt das Loslassen verspätet an — ein
// kurzer Tipp sähe sonst wie langes Drücken aus und würde verworfen.
let prevPointerDown = { id: -1, at: -Infinity };
let lastPointerDown = { id: -1, at: -Infinity };
let backPress: { id: number; at: number; x: number; y: number; valid: boolean } | null = null;

// Capture-Phase: läuft vor jedem anderen Handler, auch vor dem des Knopfs.
document.addEventListener(
  'pointerdown',
  (e) => {
    if (backPress && e.pointerId !== backPress.id) backPress.valid = false;
    prevPointerDown = lastPointerDown;
    lastPointerDown = { id: e.pointerId, at: e.timeStamp };
  },
  { capture: true },
);

function releaseBackPress(): void {
  backPress = null;
  backButtonEl.classList.remove('gedrueckt');
}

backButtonEl.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const now = e.timeStamp;
  const otherFingerJustNow = prevPointerDown.id !== e.pointerId && now - prevPointerDown.at < BACK_MULTI_WINDOW_MS;
  // Liegt schon ein anderer Finger auf dem Knopf, zählt der zweite auch nicht.
  const alreadyPressed = backPress !== null;
  backPress = { id: e.pointerId, at: now, x: e.clientX, y: e.clientY, valid: !otherFingerJustNow && !alreadyPressed };
  backButtonEl.classList.add('gedrueckt');
  try {
    backButtonEl.setPointerCapture(e.pointerId);
  } catch {
    /* Pointer bereits inaktiv */
  }
});

backButtonEl.addEventListener('pointerup', (e) => {
  const press = backPress;
  releaseBackPress();
  if (!press || press.id !== e.pointerId || !press.valid) return;
  const r = backButtonEl.getBoundingClientRect();
  const onButton = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  const quick = e.timeStamp - press.at < BACK_MAX_PRESS_MS;
  const still = Math.hypot(e.clientX - press.x, e.clientY - press.y) < BACK_MAX_MOVE_PX;
  if (onButton && quick && still) closeToy();
});

backButtonEl.addEventListener('pointercancel', releaseBackPress);

/* ---------- Eltern-Gate: 3 Sekunden halten ---------- */

const GATE_HOLD_MS = 3000;
let gateTimer: number | null = null;

function startGateHold(): void {
  if (gateTimer !== null) return;
  elternGateEl.classList.add('charging');
  gateTimer = window.setTimeout(() => {
    gateTimer = null;
    elternGateEl.classList.remove('charging');
    openEltern();
  }, GATE_HOLD_MS);
}

function cancelGateHold(): void {
  if (gateTimer !== null) {
    window.clearTimeout(gateTimer);
    gateTimer = null;
  }
  elternGateEl.classList.remove('charging');
}

elternGateEl.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  startGateHold();
});
elternGateEl.addEventListener('pointerup', cancelGateHold);
elternGateEl.addEventListener('pointercancel', cancelGateHold);
elternGateEl.addEventListener('pointerleave', cancelGateHold);

function openEltern(): void {
  renderElternbereich(elternPanelWrapEl);
  elternOverlayEl.classList.add('active');
}

function closeEltern(): void {
  elternOverlayEl.classList.remove('active');
}

elternOverlayEl.addEventListener('pointerdown', (e) => {
  if (e.target === elternOverlayEl) closeEltern();
});

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('.eltern-close')) closeEltern();
});

/* ---------- Touch-Härtung ---------- */

document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());

/* ---------- Audio-Unlock ---------- */

let audioUnlockAttempted = false;
document.addEventListener(
  'pointerdown',
  () => {
    unlockAudio();
    if (!audioUnlockAttempted) {
      audioUnlockAttempted = true;
      window.setTimeout(() => {
        if (isAudioReady()) {
          playTone({ freq: 523.25, duration: 0.15, gain: 0.25 });
        }
      }, 80);
    }
  },
  { once: false },
);

renderTiles();

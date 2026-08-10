import type { Toy } from './types';
import { playTone, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`;

const BUBBLE_TINTS = [
  'rgba(126, 200, 216, 0.55)',
  'rgba(200, 182, 224, 0.55)',
  'rgba(244, 200, 107, 0.45)',
  'rgba(232, 138, 154, 0.45)',
  'rgba(127, 185, 158, 0.5)',
];

/** Höchstzahl gleichzeitiger Blasen — hält die Compositor-Last vorhersehbar. */
const MAX_BUBBLES = 14;
const SPAWN_INTERVAL_MS = 900;

let stageEl: HTMLElement | null = null;
let cleanup: Array<() => void> = [];
let spawnTimer: number | null = null;
let popTimers: number[] = [];

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function mount(container: HTMLElement): void {
  cleanup = [];
  popTimers = [];

  container.innerHTML = `
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#blasenLayer')!;
  const wand = container.querySelector<HTMLElement>('#blasenWand')!;

  // Startfüllung, damit sofort etwas da ist statt einer leeren Fläche.
  for (let i = 0; i < 6; i++) spawnBubble(0.3 + Math.random() * 0.5);

  spawnTimer = window.setInterval(() => spawnBubble(), SPAWN_INTERVAL_MS);
  cleanup.push(() => {
    if (spawnTimer !== null) window.clearInterval(spawnTimer);
    spawnTimer = null;
  });

  // Antippen irgendwo auf der Fläche: Blase unter dem Finger zerplatzt.
  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    const bubble = (pe.target as HTMLElement).closest<HTMLElement>('.blase');
    if (!bubble) return;
    pe.preventDefault();
    popBubble(bubble);
  });

  // Pusten: Zauberstab antippen schickt einen Schwung neuer Blasen los.
  on(wand, 'pointerdown', (e) => {
    e.preventDefault();
    wand.classList.remove('puff');
    void wand.offsetWidth;
    wand.classList.add('puff');
    for (let i = 0; i < 5; i++) {
      window.setTimeout(() => spawnBubble(0, true), i * 110);
    }
    playTone({ freq: 220, duration: 0.28, attack: 0.06, release: 0.35, type: 'sine', gain: 0.12 });
  });
}

/**
 * @param progress 0 = startet unten, >0 startet weiter oben (nur für die Startfüllung)
 * @param fromWand true = steigt aus dem Zauberstab statt vom unteren Rand
 */
function spawnBubble(progress = 0, fromWand = false): void {
  if (!stageEl) return;
  if (stageEl.childElementCount >= MAX_BUBBLES) return;

  const size = 42 + Math.random() * 58;
  const tint = BUBBLE_TINTS[Math.floor(Math.random() * BUBBLE_TINTS.length)];
  const xPct = fromWand ? 14 + Math.random() * 16 : 6 + Math.random() * 88;
  const drift = (Math.random() * 2 - 1) * 40;
  const duration = 9000 + Math.random() * 5000;

  const el = document.createElement('div');
  el.className = 'blase';
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${xPct}%`;
  el.style.setProperty('--tint', tint);
  el.style.setProperty('--drift', `${drift}px`);
  el.style.animationDuration = `${duration}ms`;
  // Negatives Delay: die Blase startet mitten in ihrer Aufstiegsanimation.
  el.style.animationDelay = `${-progress * duration}ms`;
  el.innerHTML = '<span class="blase-glanz"></span>';

  el.addEventListener('animationend', () => el.remove());
  stageEl.appendChild(el);
}

function popBubble(el: HTMLElement): void {
  if (el.classList.contains('platzt')) return;
  el.classList.add('platzt');

  const note = PENTATONIC_HZ[Math.floor(Math.random() * PENTATONIC_HZ.length)];
  playTone({ freq: note * 2, duration: 0.06, attack: 0.002, release: 0.16, type: 'sine', gain: 0.22 });

  const id = window.setTimeout(() => el.remove(), 340);
  popTimers.push(id);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  if (spawnTimer !== null) {
    window.clearInterval(spawnTimer);
    spawnTimer = null;
  }
  popTimers.forEach((id) => window.clearTimeout(id));
  popTimers = [];
  stageEl = null;
}

export const blasen: Toy = {
  id: 'blasen',
  accent: '#7ec8d8',
  tileIcon,
  mount,
  unmount,
};

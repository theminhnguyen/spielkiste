import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playTone, playClick, playWhoosh, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`;

interface StickerArt {
  id: string;
  svg: string;
  /** Grundgröße in Pixeln */
  size: number;
  note: number;
}

const ART: StickerArt[] = [
  {
    id: 'hase',
    size: 106,
    note: 0,
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,
  },
  {
    id: 'baum',
    size: 125,
    note: 1,
    svg: `<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`,
  },
  {
    id: 'blume',
    size: 94,
    note: 2,
    svg: `<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`,
  },
  {
    id: 'sonne',
    size: 101,
    note: 3,
    svg: `<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'wolke',
    size: 120,
    note: 4,
    svg: `<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`,
  },
  {
    id: 'vogel',
    size: 91,
    note: 5,
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'pilz',
    size: 88,
    note: 6,
    svg: `<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`,
  },
  {
    id: 'stern',
    size: 81,
    note: 7,
    svg: `<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`,
  },
];

interface Placed {
  art: string;
  xPct: number;
  yPct: number;
  /** Leichte Zufallsdrehung, damit die Szene handgemacht wirkt */
  rot: number;
}

interface StickerState {
  placed: Placed[];
}

const STATE_KEY = 'sticker';
const STATE_VERSION = 1;
/** Deckel gegen unbegrenztes Wachsen bei ausdauerndem Spielen. */
const MAX_PLACED = 60;

let placed: Placed[] = [];
let stageEl: HTMLElement | null = null;
let sceneEl: HTMLElement | null = null;
let trayEl: HTMLElement | null = null;
let cleanup: Array<() => void> = [];

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function artById(id: string): StickerArt {
  return ART.find((a) => a.id === id) ?? ART[0];
}

function persist(): void {
  saveState<StickerState>(STATE_KEY, STATE_VERSION, { placed });
}

function mount(container: HTMLElement): void {
  cleanup = [];
  placed = loadState<StickerState>(STATE_KEY, STATE_VERSION, { placed: [] }).placed;

  container.innerHTML = `
    <div class="sticker-stage" id="stickerStage">
      <div class="sticker-szene" id="stickerSzene">
        <div class="szene-himmel"></div>
        <div class="szene-huegel h1"></div>
        <div class="szene-huegel h2"></div>
        <div class="szene-wiese"></div>
        <div class="sticker-platziert" id="stickerPlatziert"></div>
      </div>
      <button class="sticker-clear" id="stickerClear" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <line x1="38" y1="6" x2="20" y2="24" stroke="#a9835e" stroke-width="4" stroke-linecap="round"/>
          <path d="M20 24 L8 30 A20 20 0 0 0 30 40 Z" fill="#e0a458" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M12 32 L16 39 M18 28 L22 36 M24 26 L27 34" stroke="#fdf6ea" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="sticker-tray" id="stickerTray">
        ${ART.map(
          (a) => `<div class="tray-item" data-art="${a.id}" style="width:${a.size * 0.62}px;height:${a.size * 0.62}px">${a.svg}</div>`,
        ).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#stickerStage')!;
  sceneEl = container.querySelector<HTMLElement>('#stickerSzene')!;
  trayEl = container.querySelector<HTMLElement>('#stickerTray')!;

  renderPlaced();
  setupClear(container);

  trayEl.querySelectorAll<HTMLElement>('.tray-item').forEach((item) => {
    on(item, 'pointerdown', (e) => startDragFromTray(e as PointerEvent, item));
  });
}

function renderPlaced(): void {
  const layer = document.getElementById('stickerPlatziert');
  if (!layer) return;
  layer.innerHTML = '';
  placed.forEach((p, index) => {
    const art = artById(p.art);
    const el = document.createElement('div');
    el.className = 'sticker';
    el.dataset.index = String(index);
    el.style.width = `${art.size}px`;
    el.style.height = `${art.size}px`;
    el.style.left = `${p.xPct}%`;
    el.style.top = `${p.yPct}%`;
    el.style.setProperty('--rot', `${p.rot}deg`);
    el.innerHTML = art.svg;
    layer.appendChild(el);
    attachPlacedHandlers(el, index);
  });
}

/**
 * Handler direkt am Element statt über das cleanup-Array: renderPlaced() baut
 * die Sticker bei jeder Änderung neu auf, die Liste würde sonst mitwachsen.
 */
function attachPlacedHandlers(el: HTMLElement, index: number): void {
  let dragging = false;
  let moved = 0;
  let startX = 0;
  let startY = 0;

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    moved = 0;
    startX = e.clientX;
    startY = e.clientY;
    el.classList.add('greift');
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
  });

  el.addEventListener('pointermove', (e) => {
    if (!dragging || !sceneEl) return;
    moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY));
    const r = sceneEl.getBoundingClientRect();
    const p = placed[index];
    if (!p) return;
    p.xPct = clamp(((e.clientX - r.left) / r.width) * 100, 2, 98);
    p.yPct = clamp(((e.clientY - r.top) / r.height) * 100, 2, 98);
    el.style.left = `${p.xPct}%`;
    el.style.top = `${p.yPct}%`;
  });

  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('greift');
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* bereits freigegeben */
    }

    // Über der Ablage losgelassen = Sticker kommt zurück in die Kiste.
    if (trayEl && overTray(e.clientX, e.clientY)) {
      placed.splice(index, 1);
      persist();
      renderPlaced();
      playClick(300);
      return;
    }

    if (moved < 10) {
      // Kurzer Tipp: wackeln und klingen, nicht verschieben.
      el.classList.remove('wackelt');
      void el.offsetWidth;
      el.classList.add('wackelt');
      const art = artById(placed[index]?.art ?? ART[0].id);
      playTone({ freq: PENTATONIC_HZ[art.note % PENTATONIC_HZ.length], duration: 0.3, gain: 0.28 });
    }
    persist();
  };

  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

/**
 * Szene leerräumen: alle Sticker fliegen mit sanfter Verzögerung nach rechts
 * aus dem Bild, dann wird der Zustand geleert. Verhindert, dass sich die
 * Wiese unbegrenzt füllt.
 */
function setupClear(root: HTMLElement): void {
  const btn = root.querySelector<HTMLButtonElement>('#stickerClear')!;
  on(btn, 'pointerdown', (e) => {
    e.preventDefault();
    if (placed.length === 0) return;
    clearAllStickers();
  });
}

function clearAllStickers(): void {
  const layer = document.getElementById('stickerPlatziert');
  if (!layer) return;
  const stickerEls = [...layer.querySelectorAll<HTMLElement>('.sticker')];
  // Verzögerung pro Sticker gedeckelt, damit sich das Wegfliegen bei vielen
  // platzierten Stickern nicht unnötig in die Länge zieht.
  stickerEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 25, 500)}ms`;
    void el.offsetWidth;
    el.classList.add('wegfegen');
  });
  playWhoosh();

  window.setTimeout(
    () => {
      placed = [];
      persist();
      renderPlaced();
    },
    500 + Math.min(stickerEls.length * 25, 500),
  );
}

function overTray(x: number, y: number): boolean {
  if (!trayEl) return false;
  const r = trayEl.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function startDragFromTray(e: PointerEvent, item: HTMLElement): void {
  e.preventDefault();
  if (!stageEl) return;
  const art = artById(item.dataset.art ?? '');

  try {
    item.setPointerCapture(e.pointerId);
  } catch {
    /* Pointer bereits inaktiv */
  }

  const ghost = document.createElement('div');
  ghost.className = 'sticker-ghost';
  ghost.style.width = `${art.size}px`;
  ghost.style.height = `${art.size}px`;
  ghost.innerHTML = art.svg;
  stageEl.appendChild(ghost);

  const move = (clientX: number, clientY: number) => {
    const r = stageEl!.getBoundingClientRect();
    ghost.style.left = `${clientX - r.left}px`;
    ghost.style.top = `${clientY - r.top}px`;
  };
  move(e.clientX, e.clientY);
  playClick(560);

  let dropped = false;

  function onMove(ev: Event): void {
    const pe = ev as PointerEvent;
    move(pe.clientX, pe.clientY);
  }

  function onUp(ev: Event): void {
    if (dropped) return;
    dropped = true;
    const pe = ev as PointerEvent;
    try {
      item.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
    item.removeEventListener('pointermove', onMove);
    item.removeEventListener('pointerup', onUp);
    item.removeEventListener('pointercancel', onUp);
    ghost.remove();
    dropSticker(art, pe.clientX, pe.clientY);
  }

  item.addEventListener('pointermove', onMove);
  item.addEventListener('pointerup', onUp);
  item.addEventListener('pointercancel', onUp);
}

function dropSticker(art: StickerArt, clientX: number, clientY: number): void {
  if (!sceneEl) return;
  // Über der Ablage losgelassen: nichts platzieren, das Kind hat es sich anders überlegt.
  if (overTray(clientX, clientY)) return;

  const r = sceneEl.getBoundingClientRect();
  if (clientY > r.bottom || clientY < r.top) return;

  if (placed.length >= MAX_PLACED) placed.shift();

  placed.push({
    art: art.id,
    xPct: clamp(((clientX - r.left) / r.width) * 100, 2, 98),
    yPct: clamp(((clientY - r.top) / r.height) * 100, 2, 98),
    rot: Math.round((Math.random() * 2 - 1) * 9),
  });
  persist();
  renderPlaced();
  playTone({ freq: PENTATONIC_HZ[art.note % PENTATONIC_HZ.length], duration: 0.28, gain: 0.3 });
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  placed = [];
  stageEl = null;
  sceneEl = null;
  trayEl = null;
}

export const sticker: Toy = {
  id: 'sticker',
  accent: '#9ec99f',
  tileIcon,
  mount,
  unmount,
};

import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playTone, playClick, playWhoosh } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="30" y="70" width="60" height="26" rx="8" fill="#7fb99e"/>
  <rect x="38" y="42" width="44" height="26" rx="8" fill="#f4a56b"/>
  <rect x="46" y="16" width="28" height="24" rx="8" fill="#e88a9a"/>
</svg>`;

type Shape = 'square' | 'round' | 'wide' | 'peak' | 'tall';

interface BlockDef {
  shape: Shape;
  color: string;
}

const SHELF: BlockDef[] = [
  { shape: 'square', color: '#e88a9a' },
  { shape: 'round', color: '#7fb99e' },
  { shape: 'wide', color: '#f4c86b' },
  { shape: 'peak', color: '#7ea3c9' },
  { shape: 'tall', color: '#e0a458' },
];

const SHAPE_WIDTH: Record<Shape, number> = {
  square: 78,
  round: 78,
  wide: 108,
  peak: 78,
  tall: 60,
};
const BLOCK_HEIGHT = 52;

interface Tower {
  xPct: number;
  blocks: BlockDef[];
  toppled: boolean;
  toppleDir: 1 | -1;
}

interface SteineState {
  towers: Tower[];
}

const STATE_KEY = 'steine';
const STATE_VERSION = 1;

let towers: Tower[] = [];
let stageEl: HTMLElement | null = null;
let towersLayer: HTMLElement | null = null;
let cleanup: Array<() => void> = [];

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function persist(): void {
  saveState<SteineState>(STATE_KEY, STATE_VERSION, { towers });
}

function blockShapeHtml(def: BlockDef): string {
  const w = SHAPE_WIDTH[def.shape];
  const faceGap = def.shape === 'tall' ? 4 : 8;
  const roof =
    def.shape === 'peak'
      ? `<div class="steine-roof" style="border-bottom-color:${def.color}"></div>`
      : '';
  const radius = def.shape === 'round' ? '50px' : '14px';
  return `
    <div class="steine-block-body" style="width:${w}px;height:${BLOCK_HEIGHT}px;background:${def.color};border-radius:${radius};">
      ${roof}
      <div class="steine-face" style="gap:${faceGap}px;">
        <div class="steine-eyes"><span></span><span></span></div>
        <div class="steine-mouth"></div>
      </div>
    </div>
  `;
}

function mount(container: HTMLElement): void {
  cleanup = [];
  const state = loadState<SteineState>(STATE_KEY, STATE_VERSION, { towers: [] });
  towers = state.towers;

  container.innerHTML = `
    <div class="steine-stage" id="steineStage">
      <div class="steine-floor"></div>
      <div class="steine-towers" id="steineTowers"></div>
      <div class="steine-shelf" id="steineShelf">
        ${SHELF.map(
          (def, i) => `
          <div class="steine-shelf-item" data-shape-index="${i}">
            ${blockShapeHtml(def)}
          </div>
        `,
        ).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#steineStage')!;
  towersLayer = container.querySelector<HTMLElement>('#steineTowers')!;

  renderTowers();
  setupShelf(container);
}

function renderTowers(): void {
  if (!towersLayer) return;
  towersLayer.innerHTML = '';

  towers.forEach((tower, towerIndex) => {
    const towerEl = document.createElement('div');
    towerEl.className = 'steine-tower' + (tower.toppled ? ' toppled' : '');
    towerEl.style.left = `${tower.xPct}%`;
    towerEl.style.setProperty('--topple-dir', String(tower.toppleDir));

    const stackEl = document.createElement('div');
    stackEl.className = 'steine-stack';
    tower.blocks.forEach((block) => {
      const blockEl = document.createElement('div');
      blockEl.className = 'steine-placed-block';
      blockEl.innerHTML = blockShapeHtml(block);
      stackEl.appendChild(blockEl);
    });
    towerEl.appendChild(stackEl);
    towersLayer!.appendChild(towerEl);

    setupTowerInteraction(towerEl, towerIndex);
  });
}

function setupTowerInteraction(towerEl: HTMLElement, towerIndex: number): void {
  // towerEl wird bei jedem renderTowers() komplett neu erzeugt (innerHTML-Reset),
  // daher hier bewusst kein Eintrag im modul-weiten cleanup-Array — sonst würde
  // die Liste bei häufigem Spielen unbegrenzt mit toten Referenzen wachsen.
  let startX = 0;
  let startY = 0;
  let startT = 0;
  let moved = 0;

  towerEl.addEventListener('pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    pe.stopPropagation();
    startX = pe.clientX;
    startY = pe.clientY;
    startT = performance.now();
    moved = 0;
    try {
      towerEl.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
  });

  towerEl.addEventListener('pointermove', (e) => {
    const pe = e as PointerEvent;
    moved = Math.max(moved, Math.hypot(pe.clientX - startX, pe.clientY - startY));
  });

  towerEl.addEventListener('pointerup', (e) => {
    const pe = e as PointerEvent;
    try {
      towerEl.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
    const dt = performance.now() - startT;
    const tower = towers[towerIndex];
    if (!tower) return;

    const isSwipe = moved > 45 && dt < 600;

    if (tower.toppled) {
      if (moved < 12) {
        tower.toppled = false;
        persist();
        renderTowers();
        playClick(600);
      }
      return;
    }

    if (isSwipe) {
      tower.toppled = true;
      tower.toppleDir = pe.clientX - startX >= 0 ? 1 : -1;
      persist();
      renderTowers();
      playWhoosh();
    } else if (moved < 12) {
      giggleWobble(towerEl);
    }
  });
}

function giggleWobble(towerEl: HTMLElement): void {
  towerEl.classList.remove('wobble');
  void towerEl.offsetWidth;
  towerEl.classList.add('wobble');
  [0, 90, 180].forEach((delay, i) => {
    window.setTimeout(() => {
      playTone({ freq: 500 + i * 120, duration: 0.08, attack: 0.005, release: 0.1, type: 'triangle', gain: 0.22 });
    }, delay);
  });
  window.setTimeout(() => towerEl.classList.remove('wobble'), 700);
}

function setupShelf(container: HTMLElement): void {
  const items = container.querySelectorAll<HTMLElement>('.steine-shelf-item');
  items.forEach((item, index) => {
    on(item, 'pointerdown', (e) => startShelfDrag(e as PointerEvent, item, index));
  });
}

function startShelfDrag(e: PointerEvent, shelfItem: HTMLElement, shapeIndex: number): void {
  e.preventDefault();
  if (!stageEl) return;
  try {
    shelfItem.setPointerCapture(e.pointerId);
  } catch {
    /* Pointer bereits inaktiv */
  }

  const def = SHELF[shapeIndex];
  const floating = document.createElement('div');
  floating.className = 'steine-floating-block';
  floating.innerHTML = blockShapeHtml(def);
  stageEl.appendChild(floating);

  const moveFloating = (clientX: number, clientY: number) => {
    const rect = stageEl!.getBoundingClientRect();
    floating.style.left = `${clientX - rect.left}px`;
    floating.style.top = `${clientY - rect.top}px`;
  };
  moveFloating(e.clientX, e.clientY);
  playClick(420);

  function onMove(ev: Event): void {
    const pe = ev as PointerEvent;
    moveFloating(pe.clientX, pe.clientY);
  }

  function onUp(ev: Event): void {
    const pe = ev as PointerEvent;
    try {
      shelfItem.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
    shelfItem.removeEventListener('pointermove', onMove);
    shelfItem.removeEventListener('pointerup', onUp);
    shelfItem.removeEventListener('pointercancel', onUp);
    floating.remove();
    dropBlock(def, pe.clientX, pe.clientY);
  }

  shelfItem.addEventListener('pointermove', onMove);
  shelfItem.addEventListener('pointerup', onUp);
  shelfItem.addEventListener('pointercancel', onUp);
}

const SNAP_RANGE_X = 55;
const SNAP_RANGE_Y = 90;

function dropBlock(def: BlockDef, clientX: number, clientY: number): void {
  if (!stageEl) return;
  const rect = stageEl.getBoundingClientRect();
  const dropXPct = ((clientX - rect.left) / rect.width) * 100;

  const floorY = rect.height - 24;

  let targetTower: Tower | null = null;
  for (const tower of towers) {
    if (tower.toppled) continue;
    const towerScreenX = rect.left + (tower.xPct / 100) * rect.width;
    const topY = rect.top + floorY - tower.blocks.length * BLOCK_HEIGHT;
    if (Math.abs(clientX - towerScreenX) < SNAP_RANGE_X && Math.abs(clientY - topY) < SNAP_RANGE_Y) {
      targetTower = tower;
      break;
    }
  }

  if (targetTower) {
    targetTower.blocks.push(def);
    playThud(targetTower.blocks.length);
  } else {
    const xPct = Math.max(10, Math.min(90, dropXPct));
    towers.push({ xPct, blocks: [def], toppled: false, toppleDir: 1 });
    playThud(1);
  }

  persist();
  renderTowers();
}

function playThud(height: number): void {
  const freq = Math.max(140, 240 - height * 10);
  playTone({ freq, duration: 0.08, attack: 0.004, release: 0.12, type: 'sine', gain: 0.3 });
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  stageEl = null;
  towersLayer = null;
  towers = [];
}

export const steine: Toy = {
  id: 'steine',
  accent: '#7fb99e',
  tileIcon,
  mount,
  unmount,
};

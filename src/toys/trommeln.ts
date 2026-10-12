import type { Toy } from './types';
import { playDrum } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M14 58 V86 A26 9 0 0 0 66 86 V58 Z" fill="#e88a9a"/>
  <ellipse cx="40" cy="58" rx="26" ry="9" fill="#fdf6ea" stroke="#c96f7e" stroke-width="3"/>
  <path d="M60 40 V70 A23 8 0 0 0 106 70 V40 Z" fill="#7ea3c9"/>
  <ellipse cx="83" cy="40" rx="23" ry="8" fill="#fdf6ea" stroke="#5f86ad" stroke-width="3"/>
  <circle cx="36" cy="22" r="4" fill="#f4c86b"/>
  <circle cx="52" cy="30" r="3" fill="#7fb99e"/>
  <circle cx="86" cy="16" r="3.5" fill="#e88a9a"/>
</svg>`;

interface DrumDef {
  id: number;
  freq: number;
  decay: number;
  /** Größe relativ zur Rasterzelle (1 = größte Trommel) */
  size: number;
  body: string;
  rim: string;
}

// Tonhöhen aus derselben C-Pentatonik wie der Rest der Spielkiste, eine
// Oktave tiefer — alle Kombinationen klingen zusammen gut.
const DRUMS: DrumDef[] = [
  { id: 0, freq: 98.0, decay: 0.8, size: 1.0, body: '#e88a9a', rim: '#c96f7e' },
  { id: 1, freq: 130.81, decay: 0.65, size: 0.95, body: '#7ea3c9', rim: '#5f86ad' },
  { id: 2, freq: 164.81, decay: 0.55, size: 0.9, body: '#7fb99e', rim: '#5f9a80' },
  { id: 3, freq: 196.0, decay: 0.45, size: 0.86, body: '#f4c86b', rim: '#d4a64a' },
];

const PUNKT_FARBEN = ['#e88a9a', '#7ea3c9', '#7fb99e', '#f4c86b', '#c896d8', '#e0a458'];

/** Fenster, in dem mehrere Finger als ein gemeinsamer Patscher zählen. */
const COMBO_MS = 90;
/** Höchstzahl gleichzeitig klingender Trommelschläge — schützt vor Übersteuern beim Dauerhämmern. */
const MAX_VOICES = 6;
/** Höchstzahl hüpfender Punkte auf der ganzen Bühne. */
const MAX_PUNKTE = 40;

interface DrumRuntime {
  def: DrumDef;
  cell: HTMLElement;
  drum: HTMLElement;
  punkte: HTMLElement;
  lastHitAt: number;
  combo: number;
  bummTimer: number | null;
}

let stageEl: HTMLElement | null = null;
let drums: DrumRuntime[] = [];
let cleanup: Array<() => void> = [];
let timers: number[] = [];
let activeVoices = 0;
let punktCount = 0;
/** Pro Finger: über welcher Trommel er gerade ist (-1 = keine), für Wisch-Wirbel. */
let pointerDrum = new Map<number, number>();

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function later(fn: () => void, ms: number): number {
  const id = window.setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function drumSvg(d: DrumDef): string {
  // Zickzack-Spannschnur über den Kessel
  const zick: string[] = [];
  for (let i = 0; i <= 8; i++) {
    const x = 18 + i * 20.5;
    zick.push(`${x.toFixed(1)},${i % 2 === 0 ? 78 : 140}`);
  }
  return `
    <svg viewBox="0 0 200 190" width="100%" height="100%">
      <ellipse cx="100" cy="176" rx="86" ry="10" fill="rgba(90,70,40,0.14)"/>
      <path d="M16 62 V148 A84 26 0 0 0 184 148 V62 Z" fill="${d.body}"/>
      <polyline points="${zick.join(' ')}" fill="none" stroke="#fdf6ea" stroke-width="4" stroke-linejoin="round" opacity="0.75"/>
      <path d="M16 140 A84 26 0 0 0 184 140" fill="none" stroke="${d.rim}" stroke-width="9"/>
      <g class="trommel-gesicht">
        <g class="gesicht-wach">
          <circle cx="78" cy="104" r="6" fill="#4a4032"/>
          <circle cx="122" cy="104" r="6" fill="#4a4032"/>
          <path d="M90 118 Q100 126 110 118" stroke="#4a4032" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g>
        <g class="gesicht-bumm">
          <path d="M71 106 Q78 98 85 106" stroke="#4a4032" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M115 106 Q122 98 129 106" stroke="#4a4032" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="100" cy="122" rx="9" ry="8" fill="#4a4032"/>
        </g>
      </g>
      <g class="trommel-fell">
        <ellipse cx="100" cy="62" rx="84" ry="28" fill="#fdf6ea" stroke="${d.rim}" stroke-width="8"/>
        <ellipse cx="100" cy="60" rx="64" ry="18" fill="#f6ead6"/>
        <ellipse class="fell-welle" cx="100" cy="62" rx="70" ry="23" fill="none" stroke="${d.rim}" stroke-width="4"/>
      </g>
    </svg>`;
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = [];
  activeVoices = 0;
  punktCount = 0;
  pointerDrum = new Map();

  container.innerHTML = `
    <div class="trommel-stage" id="trommelStage">
      <div class="trommel-raster">
        ${DRUMS.map(
          (d) => `
          <div class="trommel-zelle" data-id="${d.id}">
            <div class="trommel" style="--groesse:${d.size}">
              <div class="trommel-wackel">${drumSvg(d)}</div>
            </div>
            <div class="trommel-punkte"></div>
          </div>`,
        ).join('')}
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#trommelStage')!;
  drums = DRUMS.map((def) => {
    const cell = container.querySelector<HTMLElement>(`.trommel-zelle[data-id="${def.id}"]`)!;
    return {
      def,
      cell,
      drum: cell.querySelector<HTMLElement>('.trommel')!,
      punkte: cell.querySelector<HTMLElement>('.trommel-punkte')!,
      lastHitAt: -Infinity,
      combo: 0,
      bummTimer: null,
    };
  });

  // Ein einziger Listener auf der ganzen Bühne: Jeder Patscher trifft die
  // nächstgelegene Trommel — es gibt keine toten Flächen dazwischen, auch ein
  // Handballen am Rand löst etwas aus.
  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    const nearest = nearestDrum(pe.clientX, pe.clientY);
    if (!nearest) return;
    pointerDrum.set(pe.pointerId, nearest.def.id);
    hitDrum(nearest);
  });

  // Wischen über mehrere Trommeln spielt einen Wirbel: Jede Trommel, in die
  // ein Finger neu hineinwischt, wird angeschlagen.
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    if (!pointerDrum.has(pe.pointerId)) return;
    const inside = drumUnder(pe.clientX, pe.clientY);
    const insideId = inside ? inside.def.id : -1;
    if (insideId !== pointerDrum.get(pe.pointerId)) {
      pointerDrum.set(pe.pointerId, insideId);
      if (inside) hitDrum(inside);
    }
  });

  const end = (e: Event) => {
    const pe = e as PointerEvent;
    pointerDrum.delete(pe.pointerId);
  };
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

function cellCenter(d: DrumRuntime): { x: number; y: number; r: number } {
  // Die Zelle wird nie transformiert (nur die Trommel darin wackelt), und
  // offsetWidth ignoriert Transforms — beide Maße sind deshalb auch mitten in
  // einer Wackel-Animation stabil.
  const r = d.cell.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: d.drum.offsetWidth / 2 };
}

function nearestDrum(x: number, y: number): DrumRuntime | null {
  let best: DrumRuntime | null = null;
  let bestDist = Infinity;
  for (const d of drums) {
    const c = cellCenter(d);
    const dist = Math.hypot(x - c.x, y - c.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  return best;
}

function drumUnder(x: number, y: number): DrumRuntime | null {
  for (const d of drums) {
    const c = cellCenter(d);
    if (Math.hypot(x - c.x, y - c.y) < c.r * 0.95) return d;
  }
  return null;
}

function hitDrum(d: DrumRuntime): void {
  const now = performance.now();
  const sameSlap = now - d.lastHitAt < COMBO_MS;
  d.combo = sameSlap ? d.combo + 1 : 1;
  d.lastHitAt = now;
  const staerke = Math.min(d.combo, 4);

  // Ton: Der erste Finger eines Patschers schlägt die Trommel an, der zweite
  // legt einmal eine tiefere Schicht drunter („mehr Finger = mehr Bumm").
  // Weitere Finger im selben Patscher verstärken nur noch das Bild — sonst
  // würden fünf Finger fünf gleichzeitige Schläge übereinanderstapeln.
  if (d.combo === 1) {
    voice(() => playDrum(d.def.freq, 0.42, d.def.decay), d.def.decay);
  } else if (d.combo === 2) {
    voice(() => playDrum(d.def.freq * 0.75, 0.3, d.def.decay * 1.1), d.def.decay);
  }

  bumm(d, staerke);
  punkte(d, 2 + staerke * 2);
}

function voice(play: () => void, decay: number): void {
  if (activeVoices >= MAX_VOICES) return;
  activeVoices++;
  play();
  later(() => {
    activeVoices = Math.max(0, activeVoices - 1);
  }, decay * 1000);
}

/** Trommel federt, Fell schwingt, Gesicht macht „Oh!" — Klassen-Neustart per Reflow statt rAF. */
function bumm(d: DrumRuntime, staerke: number): void {
  d.drum.style.setProperty('--staerke', String(staerke));
  d.drum.classList.remove('bumm');
  void d.drum.offsetWidth;
  d.drum.classList.add('bumm');
  // Pro Trommel nur ein Aufräum-Timer: Beim schnellen Hämmern würde sonst
  // der Timer eines früheren Schlags die Animation des nächsten abschneiden.
  if (d.bummTimer !== null) window.clearTimeout(d.bummTimer);
  d.bummTimer = later(() => {
    d.drum.classList.remove('bumm');
    d.bummTimer = null;
  }, 560);
}

function punkte(d: DrumRuntime, anzahl: number): void {
  const drumSize = d.drum.offsetWidth;
  // Die Punkte starten auf dem Fell. Bei den oberen Trommeln ist darüber nur
  // wenig Platz — Sprunghöhe so begrenzen, dass sie im Bild bleiben.
  const cell = d.cell.getBoundingClientRect();
  const stageTop = stageEl?.getBoundingClientRect().top ?? 0;
  const fellY = cell.top + cell.height / 2 - drumSize * 0.2;
  const maxRise = Math.max(40, fellY - stageTop - 24);
  for (let i = 0; i < anzahl; i++) {
    if (punktCount >= MAX_PUNKTE) return;
    const p = document.createElement('span');
    p.className = 'trommel-punkt';
    const size = 12 + Math.random() * 10;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = PUNKT_FARBEN[Math.floor(Math.random() * PUNKT_FARBEN.length)];
    // Start auf dem Fell (oberes Drittel der Trommel), Flug nach oben und seitlich.
    p.style.setProperty('--sx', `${((Math.random() - 0.5) * drumSize * 0.6).toFixed(0)}px`);
    p.style.setProperty('--dx', `${((Math.random() - 0.5) * drumSize * 0.7).toFixed(0)}px`);
    const rise = Math.min((0.3 + Math.random() * 0.4) * drumSize, maxRise * (0.7 + Math.random() * 0.3));
    p.style.setProperty('--dy', `${(-rise).toFixed(0)}px`);
    p.style.top = `calc(50% - ${(drumSize * 0.2).toFixed(0)}px)`;
    d.punkte.appendChild(p);
    punktCount++;
    later(() => {
      p.remove();
      punktCount = Math.max(0, punktCount - 1);
    }, 760);
  }
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = [];
  activeVoices = 0;
  punktCount = 0;
  pointerDrum = new Map();
  drums = [];
  stageEl = null;
}

export const trommeln: Toy = {
  id: 'trommeln',
  accent: '#e88a9a',
  tileIcon,
  mount,
  unmount,
};

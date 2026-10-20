import type { Toy } from './types';
import { getAudioTime, playMusicBoxNote, playClick } from '../audio';
import { meldeAktivitaet } from '../ruhe';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <line x1="60" y1="8" x2="60" y2="24" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="60" cy="28" rx="40" ry="8" fill="none" stroke="#a9835e" stroke-width="3"/>
  <line x1="28" y1="30" x2="28" y2="50" stroke="#c9b79a" stroke-width="2"/>
  <line x1="60" y1="36" x2="60" y2="58" stroke="#c9b79a" stroke-width="2"/>
  <line x1="92" y1="30" x2="92" y2="48" stroke="#c9b79a" stroke-width="2"/>
  <path d="M28 50 l4 9 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 z" fill="#f4c86b"/>
  <path d="M68 56 a12 12 0 1 0 6 20 a9 9 0 1 1 -6 -20 Z" fill="#f4e7b8"/>
  <circle cx="92" cy="56" r="8" fill="#fffaf2"/>
  <rect x="34" y="90" width="52" height="22" rx="6" fill="#e0a458"/>
  <rect x="34" y="90" width="52" height="7" rx="3" fill="#c98a45"/>
  <circle cx="92" cy="101" r="5" fill="#a9835e"/>
</svg>`;

/** [MIDI-Note, Dauer in Schlägen]. Gemeinfreie Kinderlieder, als Spieluhr eine Oktave hoch. */
type Melodie = Array<[number, number]>;

// C4 = 60. Alle Melodien in C-Dur, damit sie ohne Bruch ineinander übergehen.
const MELODIEN: Melodie[] = [
  // Brahms, „Guten Abend, gut' Nacht" (Wiegenlied op. 49 Nr. 4, 1868)
  [
    [76, 0.5], [76, 0.5], [79, 2],
    [76, 0.5], [76, 0.5], [79, 2],
    [76, 0.5], [79, 0.5], [84, 1], [83, 1.5], [81, 0.5], [81, 1], [79, 1],
    [74, 0.5], [76, 0.5], [77, 1], [74, 1], [74, 0.5], [76, 0.5], [77, 2],
    [74, 0.5], [77, 0.5], [83, 0.5], [81, 0.5], [79, 1], [83, 1], [84, 2],
    [72, 0.5], [72, 0.5], [84, 2], [81, 0.5], [77, 0.5], [79, 2],
    [76, 0.5], [72, 0.5], [77, 1], [79, 1], [81, 1], [79, 2],
    [72, 0.5], [72, 0.5], [84, 2], [81, 0.5], [77, 0.5], [79, 2],
    [76, 0.5], [72, 0.5], [77, 1], [76, 1], [74, 1], [72, 3],
  ],
  // „Morgen kommt der Weihnachtsmann" / „Ah, vous dirai-je, maman" (18. Jh.)
  [
    [72, 1], [72, 1], [79, 1], [79, 1], [81, 1], [81, 1], [79, 2],
    [77, 1], [77, 1], [76, 1], [76, 1], [74, 1], [74, 1], [72, 2],
    [79, 1], [79, 1], [77, 1], [77, 1], [76, 1], [76, 1], [74, 2],
    [79, 1], [79, 1], [77, 1], [77, 1], [76, 1], [76, 1], [74, 2],
    [72, 1], [72, 1], [79, 1], [79, 1], [81, 1], [81, 1], [79, 2],
    [77, 1], [77, 1], [76, 1], [76, 1], [74, 1], [74, 1], [72, 3],
  ],
  // „Alle meine Entchen" (Volkslied)
  [
    [72, 1], [74, 1], [76, 1], [77, 1], [79, 2], [79, 2],
    [81, 1], [81, 1], [81, 1], [81, 1], [79, 3],
    [81, 1], [81, 1], [81, 1], [81, 1], [79, 3],
    [77, 1], [77, 1], [77, 1], [77, 1], [76, 2], [76, 2],
    [74, 1], [74, 1], [74, 1], [74, 1], [72, 3],
  ],
];

/** Sekunden pro Schlag bei voll aufgezogener Spieluhr. */
const SCHLAG_S = 0.5;
/** Pause zwischen zwei Liedern, in Schlägen. */
const LIED_PAUSE = 3;
/** Aufzug-Vorrat: höchstens so viele Sekunden Musik. */
const MAX_ENERGIE = 240;
const ENERGIE_PRO_TIPP = 30;

const MOBILE_TEILE = [
  { cls: 'mond', svg: `<path d="M26 4 a22 22 0 1 0 16 36 a17 17 0 1 1 -16 -36 Z" fill="#f4e7b8"/>` },
  { cls: 'stern', svg: `<path d="M24 2 l6 14 l15 1 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -1 z" fill="#f4c86b"/>` },
  { cls: 'wolke', svg: `<g fill="#fffaf2"><circle cx="16" cy="28" r="11"/><circle cx="28" cy="20" r="13"/><circle cx="38" cy="29" r="10"/><rect x="10" y="26" width="32" height="12" rx="6"/></g>` },
  { cls: 'schaf', svg: `<g><circle cx="18" cy="24" r="10" fill="#fffaf2"/><circle cx="28" cy="20" r="11" fill="#fffaf2"/><circle cx="34" cy="28" r="9" fill="#fffaf2"/><circle cx="22" cy="32" r="9" fill="#fffaf2"/><ellipse cx="40" cy="22" rx="6" ry="7" fill="#4a4032"/><circle cx="42" cy="21" r="1.4" fill="#fffaf2"/><rect x="18" y="38" width="3" height="6" fill="#4a4032"/><rect x="30" y="38" width="3" height="6" fill="#4a4032"/></g>` },
  { cls: 'herz', svg: `<path d="M24 42 C8 30 4 20 10 13 C15 7 22 9 24 15 C26 9 33 7 38 13 C44 20 40 30 24 42 Z" fill="#e88a9a"/>` },
];

interface Teil {
  el: HTMLElement;
  phase: number;
}

let stageEl: HTMLElement | null = null;
let dunkelEl: HTMLElement | null = null;
let kurbelEl: HTMLElement | null = null;
let boxEl: HTMLElement | null = null;
let teile: Teil[] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let rafId: number | null = null;
let lastFrameT = 0;
let schedulerId: number | null = null;

let energie = 0;
let winkel = 0;
let omega = 0;
let kurbelWinkel = 0;
let lied = 0;
let noteIdx = 0;
let naechsteNoteZeit: number | null = null;
let letzteAktivMeldung = 0;
let letzteDunkelUpdate = 0;
let lastPointer = new Map<number, { x: number; y: number }>();

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

function midiHz(m: number): number {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  lastPointer = new Map();
  energie = 0;
  winkel = 0;
  omega = 0;
  noteIdx = 0;
  naechsteNoteZeit = null;

  container.innerHTML = `
    <div class="spieluhr-stage" id="spieluhrStage">
      <div class="spieluhr-sterne">
        ${Array.from({ length: 14 }, (_, i) => `<span style="left:${(i * 37) % 97 + 1}%;top:${(i * 53) % 60 + 4}%;animation-delay:${(-i * 0.7).toFixed(1)}s"></span>`).join('')}
      </div>
      <div class="spieluhr-mobile">
        <div class="spieluhr-haken"></div>
        <div class="spieluhr-ring"></div>
        ${MOBILE_TEILE.map(
          (t) => `
          <div class="spieluhr-teil ${t.cls}">
            <div class="spieluhr-faden"></div>
            <div class="spieluhr-figur"><svg viewBox="0 0 48 48" width="100%" height="100%">${t.svg}</svg></div>
          </div>`,
        ).join('')}
      </div>
      <div class="spieluhr-box" id="spieluhrBox">
        <svg viewBox="0 0 200 110" width="100%" height="100%">
          <rect x="10" y="30" width="170" height="74" rx="12" fill="#e0a458"/>
          <rect x="10" y="30" width="170" height="20" rx="8" fill="#c98a45"/>
          <rect x="24" y="62" width="142" height="30" rx="8" fill="#eab676"/>
          <circle cx="54" cy="77" r="6" fill="#f4c86b"/><circle cx="95" cy="77" r="6" fill="#e88a9a"/><circle cx="136" cy="77" r="6" fill="#7ea3c9"/>
          <rect x="178" y="58" width="12" height="12" rx="3" fill="#a9835e"/>
        </svg>
        <div class="spieluhr-kurbel" id="spieluhrKurbel">
          <svg viewBox="0 0 60 60" width="100%" height="100%">
            <circle cx="30" cy="30" r="7" fill="#a9835e"/>
            <rect x="27" y="6" width="6" height="26" rx="3" fill="#a9835e"/>
            <circle cx="30" cy="8" r="7" fill="#e88a9a"/>
          </svg>
        </div>
      </div>
      <div class="spieluhr-dunkel" id="spieluhrDunkel"></div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#spieluhrStage')!;
  dunkelEl = container.querySelector<HTMLElement>('#spieluhrDunkel')!;
  kurbelEl = container.querySelector<HTMLElement>('#spieluhrKurbel')!;
  boxEl = container.querySelector<HTMLElement>('#spieluhrBox')!;
  teile = [...container.querySelectorAll<HTMLElement>('.spieluhr-teil')].map((el, i) => ({
    el,
    phase: (i / MOBILE_TEILE.length) * Math.PI * 2,
  }));
  render();
  updateDunkel(true);

  // Aufziehen: Jeder Tipp irgendwo zieht auf, Kreisen/Wischen zieht weiter auf.
  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    lastPointer.set(pe.pointerId, { x: pe.clientX, y: pe.clientY });
    aufziehen(ENERGIE_PRO_TIPP);
    hopsen();
    playClick(820);
    later(() => playClick(760), 70);
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    const last = lastPointer.get(pe.pointerId);
    if (!last) return;
    const d = Math.hypot(pe.clientX - last.x, pe.clientY - last.y);
    lastPointer.set(pe.pointerId, { x: pe.clientX, y: pe.clientY });
    // Ca. 1 Sekunde Musik pro 40 px Bewegung — Kreisen wirkt wie Kurbeln.
    if (d > 0) aufziehen(d / 40);
  });
  const end = (e: Event) => lastPointer.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);

  schedulerId = window.setInterval(planeNoten, 30);
}

function aufziehen(sekunden: number): void {
  const warStill = energie <= 0;
  energie = Math.min(MAX_ENERGIE, energie + sekunden);
  if (warStill) {
    naechsteNoteZeit = null;
    noteIdx = 0;
  }
  updateDunkel(true);
  wake();
}

function hopsen(): void {
  if (!boxEl) return;
  boxEl.classList.remove('hopst');
  void boxEl.offsetWidth;
  boxEl.classList.add('hopst');
}

/** Tempo und Lautstärke sinken, wenn die Spieluhr abläuft — wie bei einer echten. */
function tempoFaktor(): number {
  return Math.max(0.55, Math.min(1, energie / 20));
}

function lautFaktor(): number {
  return Math.max(0.3, Math.min(1, energie / 30));
}

/**
 * Plant die Noten ~150 ms im Voraus auf der Audio-Uhr — so bleibt der Rhythmus
 * auch dann gleichmäßig, wenn der Bildschirm einmal kurz stockt.
 */
function planeNoten(): void {
  if (energie <= 0) return;
  const jetzt = getAudioTime();
  if (jetzt === null) return;
  if (naechsteNoteZeit === null || naechsteNoteZeit < jetzt - 0.2) naechsteNoteZeit = jetzt + 0.08;
  while (naechsteNoteZeit < jetzt + 0.15) {
    const melodie = MELODIEN[lied];
    if (noteIdx >= melodie.length) {
      naechsteNoteZeit += (LIED_PAUSE * SCHLAG_S) / tempoFaktor();
      lied = (lied + 1) % MELODIEN.length;
      noteIdx = 0;
      continue;
    }
    const [midi, schlaege] = melodie[noteIdx];
    playMusicBoxNote(midiHz(midi), naechsteNoteZeit, 0.2 * lautFaktor());
    naechsteNoteZeit += (schlaege * SCHLAG_S) / tempoFaktor();
    noteIdx++;
  }
}

/** Abdunkeln: hell, solange aufgezogen; je weiter sie abläuft, desto dunkler. */
function updateDunkel(sofort = false): void {
  if (!dunkelEl) return;
  const now = performance.now();
  if (!sofort && now - letzteDunkelUpdate < 400) return;
  letzteDunkelUpdate = now;
  const hell = Math.max(0, Math.min(1, energie / 45));
  dunkelEl.style.opacity = (0.62 * (1 - hell)).toFixed(2);
}

function wake(): void {
  if (rafId !== null) return;
  lastFrameT = performance.now();
  rafId = requestAnimationFrame(frame);
}

function frame(t: number): void {
  const dt = Math.min(0.1, Math.max(0.001, (t - lastFrameT) / 1000));
  lastFrameT = t;

  if (energie > 0) {
    energie = Math.max(0, energie - dt);
    // Solange Musik spielt, nicht in den Akku-Ruhezustand fallen — das Kind
    // schläft dazu vielleicht gerade ein, ohne den Bildschirm zu berühren.
    if (t - letzteAktivMeldung > 10_000) {
      letzteAktivMeldung = t;
      meldeAktivitaet();
    }
  }
  const zielOmega = energie > 0 ? 0.5 * tempoFaktor() : 0;
  omega += (zielOmega - omega) * Math.min(1, dt * 0.8);
  winkel += omega * dt;
  kurbelWinkel -= omega * dt * 2.2;
  render();
  updateDunkel();

  if (energie > 0 || omega > 0.002) {
    rafId = requestAnimationFrame(frame);
  } else {
    rafId = null;
    omega = 0;
    updateDunkel(true);
  }
}

/**
 * Das Mobile dreht sich: Die Figuren laufen auf einer flachen Ellipse — vorn
 * größer und vor den anderen, hinten kleiner und blasser. Nur transform,
 * opacity und z-index, jede Figur auf eigener GPU-Ebene (siehe style.css).
 */
function render(): void {
  for (const teil of teile) {
    const a = winkel + teil.phase;
    const x = Math.sin(a) * 34;
    const tiefe = (Math.cos(a) + 1) / 2;
    const s = 0.72 + 0.28 * tiefe;
    teil.el.style.transform = `translateX(${x.toFixed(2)}vmin) scale(${s.toFixed(3)})`;
    teil.el.style.opacity = (0.55 + 0.45 * tiefe).toFixed(2);
    teil.el.style.zIndex = String(Math.round(tiefe * 10));
  }
  if (kurbelEl) kurbelEl.style.transform = `rotate(${((kurbelWinkel * 180) / Math.PI).toFixed(1)}deg)`;
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
  if (schedulerId !== null) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }
  energie = 0;
  teile = [];
  lastPointer = new Map();
  stageEl = null;
  dunkelEl = null;
  kurbelEl = null;
  boxEl = null;
}

export const spieluhr: Toy = {
  id: 'spieluhr',
  name: 'Spieluhr',
  accent: '#7ea3c9',
  tileIcon,
  mount,
  unmount,
};

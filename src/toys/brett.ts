import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playTone, startSustainedTone, playZipSound, playWhoosh, PENTATONIC_HZ } from '../audio';
import type { SustainedTone } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`;

interface BrettState {
  switchOn: boolean;
  knobStep: number;
  sliderValue: number;
  zipperOpen: boolean;
  doorIndex: number;
  curtainOpen: boolean;
  veloOpen: boolean;
  beads: number[];
  kaleidoStep: number;
}

const STATE_KEY = 'brett';
// v2: sieben zusätzliche Module (Vorhang, Klett, Perlen, Kaleidoskop …).
// Ältere v1-Stände fallen über state.ts still auf den Startzustand zurück.
const STATE_VERSION = 2;

const defaultState: BrettState = {
  switchOn: false,
  knobStep: 0,
  sliderValue: 0.3,
  zipperOpen: false,
  doorIndex: 0,
  curtainOpen: false,
  veloOpen: false,
  beads: [0.08, 0.28, 0.48, 0.68],
  kaleidoStep: 0,
};

const ANIMALS = [
  `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,
  `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,
  `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`,
];

let state: BrettState = { ...defaultState };
let cleanup: Array<() => void> = [];
let sliderTone: SustainedTone | null = null;
let windmillTimers: number[] = [];
let windmillRotation = 0;

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function persist(): void {
  saveState(STATE_KEY, STATE_VERSION, state);
}

function mount(container: HTMLElement): void {
  state = loadState(STATE_KEY, STATE_VERSION, { ...defaultState });
  cleanup = [];
  sliderTone = null;
  windmillTimers = [];
  windmillRotation = 0;

  container.innerHTML = `
    <div class="brett-stage">
      <div class="brett-board">
        <div class="brett-mod brett-switch" data-mod="switch">
          <svg class="lamp" viewBox="0 0 60 60" width="44" height="44">
            <circle class="lamp-glow" cx="30" cy="30" r="24"/>
            <circle class="lamp-bulb" cx="30" cy="30" r="13"/>
          </svg>
          <div class="switch-track">
            <div class="switch-lever"></div>
          </div>
        </div>

        <div class="brett-mod brett-knob" data-mod="knob">
          <div class="knob-dial">
            <div class="knob-pointer"></div>
          </div>
        </div>

        <div class="brett-mod brett-buttons" data-mod="buttons">
          <button class="press-btn" data-note="0" style="--btn-color:#e88a9a" aria-hidden="true"></button>
          <button class="press-btn" data-note="2" style="--btn-color:#7fb99e" aria-hidden="true"></button>
          <button class="press-btn" data-note="4" style="--btn-color:#f4c86b" aria-hidden="true"></button>
        </div>

        <div class="brett-mod brett-slider" data-mod="slider">
          <div class="slider-track">
            <div class="slider-fill"></div>
            <div class="slider-handle"></div>
          </div>
        </div>

        <div class="brett-mod brett-zipper" data-mod="zipper">
          <div class="zipper-track">
            <div class="zipper-gap"></div>
            <div class="zipper-flap zipper-flap-left"></div>
            <div class="zipper-flap zipper-flap-right"></div>
            <div class="zipper-pull"></div>
          </div>
        </div>

        <div class="brett-mod brett-windmill" data-mod="windmill">
          <svg class="windmill-blades" viewBox="0 0 100 100" width="68" height="68">
            <g>
              <ellipse cx="50" cy="28" rx="12" ry="20" fill="#e88a9a"/>
              <ellipse cx="72" cy="50" rx="20" ry="12" fill="#7fb99e"/>
              <ellipse cx="50" cy="72" rx="12" ry="20" fill="#f4c86b"/>
              <ellipse cx="28" cy="50" rx="20" ry="12" fill="#7ea3c9"/>
            </g>
          </svg>
          <div class="windmill-hub"></div>
        </div>

        <div class="brett-mod brett-door" data-mod="door">
          <div class="door-frame">
            <div class="door-animal">${ANIMALS[state.doorIndex % ANIMALS.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>

        <div class="brett-mod brett-gears" data-mod="gears">
          <svg class="gear g-big" viewBox="0 0 100 100" width="66" height="66">${gearSvg('#7fb99e')}</svg>
          <svg class="gear g-small" viewBox="0 0 100 100" width="44" height="44">${gearSvg('#e0a458')}</svg>
        </div>

        <div class="brett-mod brett-bell" data-mod="bell">
          <div class="bell-body">
            <svg viewBox="0 0 100 100" width="58" height="58">
              <path d="M50 14 C30 14 26 34 26 52 L20 68 H80 L74 52 C74 34 70 14 50 14 Z" fill="#f4c86b" stroke="#c99a3c" stroke-width="3"/>
              <circle cx="50" cy="78" r="7" fill="#c99a3c"/>
              <circle cx="50" cy="11" r="5" fill="#c99a3c"/>
            </svg>
          </div>
        </div>

        <div class="brett-mod brett-curtain" data-mod="curtain">
          <div class="curtain-window">
            <div class="curtain-scene"><span class="curtain-sun"></span><span class="curtain-hill"></span></div>
            <div class="curtain-cloth left"></div>
            <div class="curtain-cloth right"></div>
          </div>
        </div>

        <div class="brett-mod brett-crank" data-mod="crank">
          <div class="crank-box">
            <div class="crank-pop">${ANIMALS[0]}</div>
          </div>
          <div class="crank-handle"><span></span></div>
        </div>

        <div class="brett-mod brett-kaleido" data-mod="kaleido">
          <svg class="kaleido-disc" viewBox="-50 -50 100 100" width="86" height="86">
            <circle cx="0" cy="0" r="46" fill="#fdf6ea" stroke="#c896d8" stroke-width="3"/>
            <g class="kaleido-petals"></g>
          </svg>
        </div>

        <div class="brett-mod brett-velcro" data-mod="velcro">
          <div class="velcro-base">
            <div class="velcro-hidden"></div>
            <div class="velcro-strap"><i></i><i></i><i></i></div>
          </div>
        </div>

        <div class="brett-mod brett-beads" data-mod="beads">
          <div class="beads-wire">
            ${state.beads.map((_, i) => `<span class="bead b${i}" data-bead="${i}"></span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  setupSwitch(container);
  setupKnob(container);
  setupButtons(container);
  setupSlider(container);
  setupZipper(container);
  setupWindmill(container);
  setupDoor(container);
  setupGears(container);
  setupBell(container);
  setupCurtain(container);
  setupCrank(container);
  setupKaleido(container);
  setupVelcro(container);
  setupBeads(container);
}

function gearSvg(color: string): string {
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 360) / 8;
    return `<rect x="44" y="2" width="12" height="18" rx="3" fill="${color}" transform="rotate(${a} 50 50)"/>`;
  }).join('');
  return `${teeth}<circle cx="50" cy="50" r="34" fill="${color}"/><circle cx="50" cy="50" r="11" fill="#fffaf2"/>`;
}

function setupSwitch(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-switch')!;
  applySwitchVisual(mod);
  on(mod, 'pointerdown', (e) => {
    (e as PointerEvent).preventDefault();
    state.switchOn = !state.switchOn;
    applySwitchVisual(mod);
    playTone({
      freq: state.switchOn ? 440 : 330,
      duration: 0.05,
      attack: 0.002,
      release: 0.1,
      type: 'square',
      gain: 0.25,
    });
    persist();
  });
}

function applySwitchVisual(mod: HTMLElement): void {
  mod.classList.toggle('on', state.switchOn);
}

function setupKnob(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-knob')!;
  const dial = mod.querySelector<HTMLElement>('.knob-dial')!;
  applyKnobVisual(dial);

  let dragging = false;

  function angleToStep(clientX: number, clientY: number): number {
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return Math.round(deg / 45) % 8;
  }

  on(mod, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    dragging = true;
    try {
      mod.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv — Drehen funktioniert trotzdem über normales Bubbling */
    }
    updateFromPointer(pe.clientX, pe.clientY);
  });

  on(mod, 'pointermove', (e) => {
    if (!dragging) return;
    const pe = e as PointerEvent;
    updateFromPointer(pe.clientX, pe.clientY);
  });

  function endDrag(e: Event): void {
    if (!dragging) return;
    dragging = false;
    const pe = e as PointerEvent;
    if (pe.pointerId !== undefined) {
      try {
        mod.releasePointerCapture(pe.pointerId);
      } catch {
        /* bereits freigegeben */
      }
    }
  }

  on(mod, 'pointerup', endDrag);
  on(mod, 'pointercancel', endDrag);

  function updateFromPointer(x: number, y: number): void {
    const step = angleToStep(x, y);
    if (step !== state.knobStep) {
      state.knobStep = step;
      applyKnobVisual(dial);
      playTone({
        freq: PENTATONIC_HZ[step % PENTATONIC_HZ.length],
        duration: 0.04,
        attack: 0.002,
        release: 0.08,
        type: 'triangle',
        gain: 0.25,
      });
      persist();
    }
  }
}

function applyKnobVisual(dial: HTMLElement): void {
  dial.style.transform = `rotate(${state.knobStep * 45}deg)`;
}

function setupButtons(root: HTMLElement): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>('.press-btn');
  buttons.forEach((btn) => {
    on(btn, 'pointerdown', (e) => {
      e.preventDefault();
      const note = Number(btn.dataset.note ?? '0');
      playTone({ freq: PENTATONIC_HZ[note % PENTATONIC_HZ.length], duration: 0.3, gain: 0.4 });
      btn.classList.add('pressed');
      window.setTimeout(() => btn.classList.remove('pressed'), 260);
    });
  });
}

function setupSlider(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-slider')!;
  const track = mod.querySelector<HTMLElement>('.slider-track')!;
  const handle = mod.querySelector<HTMLElement>('.slider-handle')!;
  const fill = mod.querySelector<HTMLElement>('.slider-fill')!;
  applySliderVisual(handle, fill);

  let dragging = false;

  function valueFromX(clientX: number): number {
    const rect = track.getBoundingClientRect();
    const v = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, v));
  }

  function freqFromValue(v: number): number {
    const minFreq = 220;
    const maxFreq = 880;
    return minFreq * Math.pow(maxFreq / minFreq, v);
  }

  on(mod, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    dragging = true;
    try {
      mod.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv — Ziehen funktioniert trotzdem über normales Bubbling */
    }
    state.sliderValue = valueFromX(pe.clientX);
    applySliderVisual(handle, fill);
    sliderTone = startSustainedTone(freqFromValue(state.sliderValue));
  });

  on(mod, 'pointermove', (e) => {
    if (!dragging) return;
    const pe = e as PointerEvent;
    state.sliderValue = valueFromX(pe.clientX);
    applySliderVisual(handle, fill);
    sliderTone?.update(freqFromValue(state.sliderValue));
  });

  function endDrag(e: Event): void {
    if (!dragging) return;
    dragging = false;
    sliderTone?.stop();
    sliderTone = null;
    const pe = e as PointerEvent;
    if (pe.pointerId !== undefined) {
      try {
        mod.releasePointerCapture(pe.pointerId);
      } catch {
        /* bereits freigegeben */
      }
    }
    persist();
  }

  on(mod, 'pointerup', endDrag);
  on(mod, 'pointercancel', endDrag);
}

function applySliderVisual(handle: HTMLElement, fill: HTMLElement): void {
  const pct = state.sliderValue * 100;
  handle.style.left = `${pct}%`;
  fill.style.width = `${pct}%`;
}

function setupZipper(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-zipper')!;
  const track = mod.querySelector<HTMLElement>('.zipper-track')!;
  const pull = mod.querySelector<HTMLElement>('.zipper-pull')!;
  applyZipperVisual(mod);

  let dragging = false;
  let startY = 0;
  let moved = 0;

  on(mod, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    dragging = true;
    moved = 0;
    startY = pe.clientY;
    try {
      mod.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv — Ziehen funktioniert trotzdem über normales Bubbling */
    }
  });

  on(mod, 'pointermove', (e) => {
    if (!dragging) return;
    const pe = e as PointerEvent;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (pe.clientY - rect.top) / rect.height));
    moved += Math.abs(pe.clientY - startY);
    startY = pe.clientY;
    pull.style.top = `${ratio * 100}%`;
  });

  function endDrag(e: Event): void {
    if (!dragging) return;
    dragging = false;
    const pe = e as PointerEvent;
    if (pe.pointerId !== undefined) {
      try {
        mod.releasePointerCapture(pe.pointerId);
      } catch {
        /* bereits freigegeben */
      }
    }

    const rect = track.getBoundingClientRect();
    const pullRect = pull.getBoundingClientRect();
    const ratio = (pullRect.top + pullRect.height / 2 - rect.top) / rect.height;
    const wasOpen = state.zipperOpen;
    const nowOpen = moved < 6 ? !state.zipperOpen : ratio > 0.5;

    if (nowOpen !== wasOpen) {
      state.zipperOpen = nowOpen;
      playZipSound(nowOpen);
      persist();
    }
    applyZipperVisual(mod);
  }

  on(mod, 'pointerup', endDrag);
  on(mod, 'pointercancel', endDrag);
}

function applyZipperVisual(mod: HTMLElement): void {
  mod.classList.toggle('open', state.zipperOpen);
  const pull = mod.querySelector<HTMLElement>('.zipper-pull')!;
  pull.style.top = state.zipperOpen ? '100%' : '0%';
}

function setupWindmill(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-windmill')!;
  const blades = mod.querySelector<HTMLElement>('.windmill-blades')!;
  blades.style.transform = `rotate(${windmillRotation}deg)`;

  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    spinWindmill(blades);
  });
}

function spinWindmill(blades: HTMLElement): void {
  windmillTimers.forEach((id) => window.clearTimeout(id));
  windmillTimers = [];

  const extraTurns = 3 + Math.random() * 2;
  windmillRotation += extraTurns * 360;
  const duration = 2200 + Math.random() * 400;

  blades.style.transition = `transform ${duration}ms cubic-bezier(0.13, 0.7, 0.25, 1)`;
  blades.style.transform = `rotate(${windmillRotation}deg)`;

  const tickCount = 12;
  for (let i = 0; i < tickCount; i++) {
    const t = i / tickCount;
    const delay = duration * (1 - Math.pow(1 - t, 2.2));
    const id = window.setTimeout(() => {
      playTone({ freq: 700, duration: 0.02, attack: 0.001, release: 0.04, type: 'triangle', gain: 0.12 });
    }, delay);
    windmillTimers.push(id);
  }
}

function setupDoor(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-door')!;
  const animalEl = mod.querySelector<HTMLElement>('.door-animal')!;
  applyDoorVisual(mod);

  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    const opening = !mod.classList.contains('open');
    if (opening) {
      state.doorIndex = (state.doorIndex + 1) % ANIMALS.length;
      animalEl.innerHTML = ANIMALS[state.doorIndex];
      persist();
    }
    mod.classList.toggle('open', opening);
    playWhoosh();
  });
}

function applyDoorVisual(mod: HTMLElement): void {
  mod.classList.remove('open');
}

/* ---------- Zahnräder: eines ziehen, beide drehen mit ---------- */

function setupGears(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-gears')!;
  const big = mod.querySelector<HTMLElement>('.g-big')!;
  const small = mod.querySelector<HTMLElement>('.g-small')!;
  let dragging = false;
  let lastAngle = 0;
  let rotation = 0;
  let lastTickAt = 0;

  function angleAt(x: number, y: number): number {
    const r = mod.getBoundingClientRect();
    return (Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * 180) / Math.PI;
  }

  function render(): void {
    big.style.transform = `rotate(${rotation}deg)`;
    // Gegenläufig und schneller — so wirkt der Zahneingriff plausibel.
    small.style.transform = `rotate(${-rotation * 1.5}deg)`;
  }
  render();

  on(mod, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    dragging = true;
    lastAngle = angleAt(pe.clientX, pe.clientY);
    try {
      mod.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
  });

  on(mod, 'pointermove', (e) => {
    if (!dragging) return;
    const pe = e as PointerEvent;
    const a = angleAt(pe.clientX, pe.clientY);
    let delta = a - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle = a;
    rotation += delta;
    render();

    const now = performance.now();
    if (Math.abs(delta) > 6 && now - lastTickAt > 90) {
      lastTickAt = now;
      playTone({ freq: 320, duration: 0.02, attack: 0.002, release: 0.05, type: 'square', gain: 0.1 });
    }
  });

  function endDrag(e: Event): void {
    if (!dragging) return;
    dragging = false;
    const pe = e as PointerEvent;
    try {
      mod.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
  }
  on(mod, 'pointerup', endDrag);
  on(mod, 'pointercancel', endDrag);
}

/* ---------- Klingel ---------- */

function setupBell(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-bell')!;
  const body = mod.querySelector<HTMLElement>('.bell-body')!;

  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    body.classList.remove('ring');
    void body.offsetWidth;
    body.classList.add('ring');
    // Zwei Teiltöne übereinander ergeben den glockigen Klang.
    playTone({ freq: 1046.5, duration: 0.5, attack: 0.004, release: 0.9, type: 'sine', gain: 0.22 });
    playTone({ freq: 1567.98, duration: 0.35, attack: 0.004, release: 0.7, type: 'sine', gain: 0.1 });
  });
}

/* ---------- Vorhang ---------- */

function setupCurtain(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-curtain')!;
  applyCurtainVisual(mod);

  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.curtainOpen = !state.curtainOpen;
    applyCurtainVisual(mod);
    playWhoosh();
    persist();
  });
}

function applyCurtainVisual(mod: HTMLElement): void {
  mod.classList.toggle('open', state.curtainOpen);
}

/* ---------- Kurbel: drehen bis das Tierchen herausspringt ---------- */

function setupCrank(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-crank')!;
  const handle = mod.querySelector<HTMLElement>('.crank-handle')!;
  const pop = mod.querySelector<HTMLElement>('.crank-pop')!;
  let dragging = false;
  let lastAngle = 0;
  let rotation = 0;
  let turned = 0;
  let popped = false;
  let lastTickAt = 0;

  function angleAt(x: number, y: number): number {
    const r = handle.getBoundingClientRect();
    return (Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * 180) / Math.PI;
  }

  on(mod, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    if (popped) {
      // Zweite Berührung schließt die Kiste wieder — beliebig oft wiederholbar.
      popped = false;
      turned = 0;
      mod.classList.remove('popped');
      return;
    }
    dragging = true;
    lastAngle = angleAt(pe.clientX, pe.clientY);
    try {
      mod.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
  });

  on(mod, 'pointermove', (e) => {
    if (!dragging || popped) return;
    const pe = e as PointerEvent;
    const a = angleAt(pe.clientX, pe.clientY);
    let delta = a - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle = a;
    rotation += delta;
    turned += Math.abs(delta);
    handle.style.transform = `rotate(${rotation}deg)`;

    const now = performance.now();
    if (now - lastTickAt > 120) {
      lastTickAt = now;
      const step = Math.floor(turned / 45) % PENTATONIC_HZ.length;
      playTone({ freq: PENTATONIC_HZ[step], duration: 0.05, attack: 0.003, release: 0.1, type: 'triangle', gain: 0.16 });
    }

    if (turned > 540) {
      popped = true;
      dragging = false;
      pop.innerHTML = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      mod.classList.add('popped');
      playTone({ freq: 880, duration: 0.18, attack: 0.005, release: 0.3, type: 'sine', gain: 0.3 });
    }
  });

  function endDrag(e: Event): void {
    if (!dragging) return;
    dragging = false;
    const pe = e as PointerEvent;
    try {
      mod.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
  }
  on(mod, 'pointerup', endDrag);
  on(mod, 'pointercancel', endDrag);
}

/* ---------- Kaleidoskop ---------- */

const KALEIDO_COLORS = ['#e88a9a', '#7fb99e', '#f4c86b', '#7ea3c9', '#e0a458', '#c896d8'];

function setupKaleido(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-kaleido')!;
  const disc = mod.querySelector<HTMLElement>('.kaleido-disc')!;
  const petals = mod.querySelector<SVGGElement>('.kaleido-petals')!;
  renderKaleido(petals);
  disc.style.transform = `rotate(${state.kaleidoStep * 30}deg)`;

  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.kaleidoStep += 1;
    disc.style.transform = `rotate(${state.kaleidoStep * 30}deg)`;
    renderKaleido(petals);
    playTone({
      freq: PENTATONIC_HZ[state.kaleidoStep % PENTATONIC_HZ.length],
      duration: 0.25,
      attack: 0.01,
      release: 0.4,
      type: 'sine',
      gain: 0.2,
    });
    persist();
  });
}

/** Sechsfach gespiegelte Blütenblätter — jede Drehung würfelt neue Farben. */
function renderKaleido(petals: SVGGElement): void {
  const seed = state.kaleidoStep;
  let out = '';
  for (let i = 0; i < 6; i++) {
    const c = KALEIDO_COLORS[(seed + i) % KALEIDO_COLORS.length];
    const c2 = KALEIDO_COLORS[(seed * 2 + i + 3) % KALEIDO_COLORS.length];
    out += `<g transform="rotate(${i * 60})">
      <ellipse cx="0" cy="-24" rx="9" ry="16" fill="${c}" opacity="0.85"/>
      <circle cx="0" cy="-38" r="5" fill="${c2}"/>
    </g>`;
  }
  petals.innerHTML = out;
}

/* ---------- Klettverschluss ---------- */

function setupVelcro(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-velcro')!;
  applyVelcroVisual(mod);

  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.veloOpen = !state.veloOpen;
    applyVelcroVisual(mod);
    playZipSound(state.veloOpen);
    persist();
  });
}

function applyVelcroVisual(mod: HTMLElement): void {
  mod.classList.toggle('open', state.veloOpen);
}

/* ---------- Perlenschieber ---------- */

function setupBeads(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.brett-beads')!;
  const wire = mod.querySelector<HTMLElement>('.beads-wire')!;
  const beadEls = [...mod.querySelectorAll<HTMLElement>('.bead')];

  beadEls.forEach((el, i) => {
    el.style.left = `${state.beads[i] * 100}%`;
  });

  // Pro Finger ein Eintrag: mehrere Perlen lassen sich gleichzeitig schieben.
  const active = new Map<number, number>();

  on(wire, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    const target = (pe.target as HTMLElement).closest<HTMLElement>('.bead');
    if (!target) return;
    pe.preventDefault();
    const idx = Number(target.dataset.bead);
    active.set(pe.pointerId, idx);
    try {
      wire.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
  });

  on(wire, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    const idx = active.get(pe.pointerId);
    if (idx === undefined) return;
    const r = wire.getBoundingClientRect();
    const v = Math.max(0.02, Math.min(0.94, (pe.clientX - r.left) / r.width));
    const prev = state.beads[idx];
    state.beads[idx] = v;
    beadEls[idx].style.left = `${v * 100}%`;
    if (Math.abs(v - prev) > 0.04) {
      playTone({
        freq: PENTATONIC_HZ[idx % PENTATONIC_HZ.length] * 2,
        duration: 0.03,
        attack: 0.002,
        release: 0.07,
        type: 'triangle',
        gain: 0.12,
      });
    }
  });

  function endDrag(e: Event): void {
    const pe = e as PointerEvent;
    if (!active.has(pe.pointerId)) return;
    active.delete(pe.pointerId);
    try {
      wire.releasePointerCapture(pe.pointerId);
    } catch {
      /* bereits freigegeben */
    }
    persist();
  }
  on(wire, 'pointerup', endDrag);
  on(wire, 'pointercancel', endDrag);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  sliderTone?.stop();
  sliderTone = null;
  windmillTimers.forEach((id) => window.clearTimeout(id));
  windmillTimers = [];
}

export const brett: Toy = {
  id: 'brett',
  accent: '#e0a458',
  tileIcon,
  mount,
  unmount,
};

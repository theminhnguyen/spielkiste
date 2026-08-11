import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playTone, playClick, playWhoosh, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`;

interface WimmelState {
  tuerOffen: boolean;
  vorhangOffen: boolean;
  flaggeOben: boolean;
}

const STATE_KEY = 'wimmelbild';
const STATE_VERSION = 1;
const defaultState: WimmelState = { tuerOffen: false, vorhangOffen: false, flaggeOben: false };

let state: WimmelState = { ...defaultState };
let cleanup: Array<() => void> = [];
let timers: number[] = [];
let busy = new Set<string>();

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function persist(): void {
  saveState<WimmelState>(STATE_KEY, STATE_VERSION, state);
}

function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(fn, ms);
  timers.push(id);
}

/** Einfache Tipp-Reaktion: Klasse an, kurz warten, Klasse wieder ab — ignoriert
 * weitere Tipps, solange die Animation noch läuft, damit nichts kaputtspringt. */
function bindBurst(
  root: HTMLElement,
  selector: string,
  opts: { className: string; duration: number; onTrigger?: (el: HTMLElement) => void; sound?: () => void },
): void {
  const el = root.querySelector<HTMLElement>(selector)!;
  const key = selector;
  on(el, 'pointerdown', (e) => {
    e.preventDefault();
    if (busy.has(key)) return;
    busy.add(key);
    el.classList.remove(opts.className);
    void el.offsetWidth;
    el.classList.add(opts.className);
    opts.onTrigger?.(el);
    opts.sound?.();
    later(() => {
      el.classList.remove(opts.className);
      busy.delete(key);
    }, opts.duration);
  });
}

function mount(container: HTMLElement): void {
  state = loadState<WimmelState>(STATE_KEY, STATE_VERSION, { ...defaultState });
  cleanup = [];
  timers = [];
  busy = new Set();

  container.innerHTML = `
    <div class="wimmel-stage">
      <div class="wimmel-szene">
        <div class="w-himmel"></div>
        <div class="w-huegel h1"></div>
        <div class="w-huegel h2"></div>
        <div class="w-wiese"></div>

        <div class="w-item w-sonne" data-item="sonne" style="left:88%;top:11%">
          <svg viewBox="0 0 100 100"><g class="sonne-strahlen" stroke="#f4c86b" stroke-width="7" stroke-linecap="round">
            <line x1="50" y1="6" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="94"/>
            <line x1="6" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="94" y2="50"/>
            <line x1="18" y1="18" x2="28" y2="28"/><line x1="72" y1="72" x2="82" y2="82"/>
            <line x1="18" y1="82" x2="28" y2="72"/><line x1="72" y1="28" x2="82" y2="18"/>
          </g><circle cx="50" cy="50" r="25" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/>
          <circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M42 57 Q50 64 58 57" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
        </div>

        <div class="w-item w-wolke" data-item="wolke" style="left:16%;top:15%">
          <svg viewBox="0 0 100 60"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3">
            <ellipse cx="30" cy="38" rx="22" ry="17"/><ellipse cx="58" cy="38" rx="19" ry="15"/><ellipse cx="44" cy="26" rx="19" ry="17"/>
          </g></svg>
        </div>

        <div class="w-vogelhaus" data-item="vogelhaus" style="left:45%;top:40%">
          <svg viewBox="0 0 60 60"><path d="M6 24 L30 6 L54 24 Z" fill="#e88a9a"/><rect x="10" y="24" width="40" height="30" rx="4" fill="#f3e7db" stroke="#c9a37e" stroke-width="2"/><circle cx="30" cy="38" r="7" fill="#8a7255"/></svg>
          <div class="w-vogel">
            <svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/></svg>
          </div>
        </div>

        <div class="w-haus" style="left:12%;top:46%">
          <div class="w-schornstein" data-item="schornstein">
            <span class="rauch r1"></span><span class="rauch r2"></span><span class="rauch r3"></span>
          </div>
          <div class="w-dach"></div>
          <div class="w-wand">
            <div class="w-fenster" data-item="fenster">
              <div class="fenster-innen"><div class="fenster-gesicht"></div></div>
              <div class="fenster-vorhang links"></div>
              <div class="fenster-vorhang rechts"></div>
            </div>
            <div class="w-tuer" data-item="tuer">
              <div class="tuer-katze">
                <svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
              </div>
              <div class="tuer-panel"></div>
            </div>
          </div>
        </div>

        <div class="w-baum" style="left:36%;top:50%">
          <div class="baum-stamm"></div>
          <div class="baum-krone"></div>
          <div class="w-apfel" data-item="apfel">
            <svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="15" fill="#e88a9a"/><rect x="18" y="4" width="4" height="10" rx="2" fill="#7fb99e"/></svg>
          </div>
        </div>

        <div class="w-schaukel" data-item="schaukel" style="left:64%;top:58%">
          <svg class="schaukel-rahmen" viewBox="0 0 100 90"><path d="M6 88 L30 10 M94 88 L70 10 M30 10 L70 10" stroke="#a9835e" stroke-width="6" stroke-linecap="round" fill="none"/></svg>
          <div class="schaukel-sitz">
            <span class="seil links"></span><span class="seil rechts"></span>
            <span class="brett"></span>
          </div>
        </div>

        <div class="w-blume" style="left:84%;top:76%">
          <svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>
          <div class="w-biene" data-item="biene">
            <svg viewBox="0 0 60 40"><ellipse cx="30" cy="20" rx="18" ry="13" fill="#f4c86b"/><path d="M16 20 A14 13 0 0 1 44 20" fill="none" stroke="#4a4032" stroke-width="4"/><ellipse cx="12" cy="12" rx="9" ry="7" fill="#eaf5fb" opacity="0.85"/><ellipse cx="20" cy="6" rx="9" ry="7" fill="#eaf5fb" opacity="0.85"/></svg>
          </div>
        </div>

        <div class="w-maulwurfshuegel" data-item="maulwurf" style="left:20%;top:86%">
          <div class="huegel-erde"></div>
          <div class="w-maulwurf-tier">
            <svg viewBox="0 0 100 90"><ellipse cx="50" cy="50" rx="34" ry="30" fill="#8a7d72"/><ellipse cx="50" cy="70" rx="14" ry="10" fill="#f3c9c9"/><circle cx="38" cy="42" r="4" fill="#2c2620"/><circle cx="62" cy="42" r="4" fill="#2c2620"/></svg>
          </div>
        </div>

        <div class="w-briefkasten" data-item="briefkasten" style="left:92%;top:70%">
          <svg viewBox="0 0 60 90"><rect x="24" y="30" width="8" height="50" fill="#a9835e"/><path d="M6 30 a18 18 0 0 1 36 0 v14 h-36 z" fill="#7ea3c9"/><rect x="6" y="44" width="36" height="4" fill="#5f80a3"/></svg>
          <div class="briefkasten-flagge"></div>
        </div>

        <div class="w-teich" style="left:56%;top:88%">
          <div class="teich-wasser"></div>
          <div class="w-frosch" data-item="frosch">
            <svg viewBox="0 0 100 80"><ellipse cx="50" cy="50" rx="34" ry="24" fill="#7fb99e"/><circle cx="30" cy="26" r="12" fill="#7fb99e"/><circle cx="70" cy="26" r="12" fill="#7fb99e"/><circle cx="30" cy="24" r="5" fill="#fffaf2"/><circle cx="70" cy="24" r="5" fill="#fffaf2"/><circle cx="30" cy="24" r="2.5" fill="#2c2620"/><circle cx="70" cy="24" r="2.5" fill="#2c2620"/><path d="M32 56 Q50 66 68 56" stroke="#4a7a5c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
          </div>
        </div>

        <div class="w-schnecke" data-item="schnecke" style="left:38%;top:92%">
          <svg viewBox="0 0 100 70"><circle cx="66" cy="34" r="24" fill="#e0a458"/><path d="M66 34 m-16 0 a16 16 0 1 1 32 0 a12 12 0 1 1 -24 0 a8 8 0 1 1 16 0" fill="none" stroke="#a9835e" stroke-width="3"/><ellipse cx="26" cy="52" rx="24" ry="11" fill="#f3e7db"/><g class="schnecke-fuehler"><line x1="16" y1="44" x2="10" y2="28" stroke="#f3e7db" stroke-width="5" stroke-linecap="round"/><circle cx="10" cy="28" r="4" fill="#f3e7db"/><line x1="26" y1="44" x2="24" y2="26" stroke="#f3e7db" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="26" r="4" fill="#f3e7db"/></g></svg>
        </div>

        <div class="w-marienkaefer" data-item="marienkaefer" style="left:8%;top:95%">
          <svg viewBox="0 0 60 60"><ellipse cx="30" cy="32" rx="22" ry="20" fill="#e0574a"/><path d="M30 12 v40" stroke="#2c2620" stroke-width="2.5"/><circle cx="30" cy="14" r="9" fill="#2c2620"/><circle cx="20" cy="24" r="3.5" fill="#2c2620"/><circle cx="40" cy="24" r="3.5" fill="#2c2620"/><circle cx="22" cy="40" r="3.5" fill="#2c2620"/><circle cx="38" cy="40" r="3.5" fill="#2c2620"/></svg>
        </div>
      </div>
    </div>
  `;

  setupSonne(container);
  setupWolke(container);
  setupSchornstein(container);
  setupTuer(container);
  setupFenster(container);
  setupApfel(container);
  setupVogel(container);
  setupSchaukel(container);
  setupBiene(container);
  setupMaulwurf(container);
  setupBriefkasten(container);
  setupFrosch(container);
  setupSchnecke(container);
  setupMarienkaefer(container);
}

function setupSonne(root: HTMLElement): void {
  bindBurst(root, '.w-sonne', {
    className: 'strahlt',
    duration: 700,
    sound: () => {
      playTone({ freq: 1046.5, duration: 0.35, attack: 0.01, release: 0.5, type: 'sine', gain: 0.22 });
      playTone({ freq: 1567.98, duration: 0.25, attack: 0.01, release: 0.4, type: 'sine', gain: 0.1 });
    },
  });
}

function setupWolke(root: HTMLElement): void {
  bindBurst(root, '.w-wolke', { className: 'zieht-vorbei', duration: 2400, sound: () => playWhoosh() });
}

function setupSchornstein(root: HTMLElement): void {
  bindBurst(root, '.w-schornstein', {
    className: 'pufft',
    duration: 1400,
    sound: () => playTone({ freq: 260, duration: 0.15, attack: 0.01, release: 0.3, type: 'sine', gain: 0.16 }),
  });
}

function setupTuer(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.w-tuer')!;
  mod.classList.toggle('offen', state.tuerOffen);
  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.tuerOffen = !state.tuerOffen;
    mod.classList.toggle('offen', state.tuerOffen);
    playWhoosh();
    if (state.tuerOffen) {
      playTone({ freq: 587.33, duration: 0.12, attack: 0.005, release: 0.15, type: 'triangle', gain: 0.2 });
      later(() => playTone({ freq: 493.88, duration: 0.18, attack: 0.005, release: 0.25, type: 'triangle', gain: 0.2 }), 130);
    }
    persist();
  });
}

function setupFenster(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.w-fenster')!;
  mod.classList.toggle('offen', state.vorhangOffen);
  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.vorhangOffen = !state.vorhangOffen;
    mod.classList.toggle('offen', state.vorhangOffen);
    playWhoosh();
    persist();
  });
}

function setupApfel(root: HTMLElement): void {
  bindBurst(root, '.w-apfel', {
    className: 'faellt',
    duration: 900,
    sound: () => playTone({ freq: 220, duration: 0.09, attack: 0.004, release: 0.14, type: 'sine', gain: 0.28 }),
  });
}

function setupVogel(root: HTMLElement): void {
  bindBurst(root, '.w-vogelhaus', {
    className: 'fliegt',
    duration: 1600,
    sound: () => {
      [0, 90, 180].forEach((delay, i) => {
        later(() => playTone({ freq: PENTATONIC_HZ[(4 + i) % PENTATONIC_HZ.length], duration: 0.14, attack: 0.005, release: 0.2, type: 'triangle', gain: 0.22 }), delay);
      });
    },
  });
}

function setupSchaukel(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.w-schaukel')!;
  const sitz = mod.querySelector<HTMLElement>('.schaukel-sitz')!;
  const key = 'schaukel';
  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    if (busy.has(key)) return;
    busy.add(key);
    sitz.classList.remove('schwingt');
    void sitz.offsetWidth;
    sitz.classList.add('schwingt');
    [0, 350, 700, 1050].forEach((delay) => {
      later(() => playTone({ freq: 380, duration: 0.05, attack: 0.005, release: 0.1, type: 'sine', gain: 0.1 }), delay);
    });
    later(() => {
      sitz.classList.remove('schwingt');
      busy.delete(key);
    }, 2200);
  });
}

function setupBiene(root: HTMLElement): void {
  bindBurst(root, '.w-biene', {
    className: 'summt',
    duration: 1300,
    sound: () => playTone({ freq: 660, duration: 0.5, attack: 0.02, release: 0.4, type: 'sawtooth', gain: 0.06 }),
  });
}

function setupMaulwurf(root: HTMLElement): void {
  bindBurst(root, '.w-maulwurfshuegel', {
    className: 'guckt',
    duration: 1200,
    sound: () => playTone({ freq: 180, duration: 0.12, attack: 0.005, release: 0.2, type: 'sine', gain: 0.24 }),
  });
}

function setupBriefkasten(root: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.w-briefkasten')!;
  mod.classList.toggle('offen', state.flaggeOben);
  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.flaggeOben = !state.flaggeOben;
    mod.classList.toggle('offen', state.flaggeOben);
    playClick(state.flaggeOben ? 700 : 500);
    persist();
  });
}

function setupFrosch(root: HTMLElement): void {
  bindBurst(root, '.w-frosch', {
    className: 'huepft',
    duration: 700,
    sound: () => playTone({ freq: 200, duration: 0.1, attack: 0.004, release: 0.16, type: 'square', gain: 0.18 }),
  });
}

function setupSchnecke(root: HTMLElement): void {
  bindBurst(root, '.w-schnecke', {
    className: 'streckt',
    duration: 900,
    sound: () => playClick(520),
  });
}

function setupMarienkaefer(root: HTMLElement): void {
  bindBurst(root, '.w-marienkaefer', {
    className: 'fliegt-los',
    duration: 1100,
    sound: () => playTone({ freq: 900, duration: 0.3, attack: 0.02, release: 0.3, type: 'sawtooth', gain: 0.05 }),
  });
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = [];
  busy = new Set();
}

export const wimmelbild: Toy = {
  id: 'wimmelbild',
  accent: '#9ec99f',
  tileIcon,
  mount,
  unmount,
};

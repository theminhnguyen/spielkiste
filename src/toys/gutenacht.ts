import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playTone, playWhoosh } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`;

interface AnimalDef {
  id: string;
  wach: string;
  schlaeft: string;
  bettFarbe: string;
}

const ANIMALS: AnimalDef[] = [
  {
    id: 'baer',
    bettFarbe: '#e0a458',
    wach: `<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,
    schlaeft: `<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,
  },
  {
    id: 'hase',
    bettFarbe: '#e88a9a',
    wach: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,
    schlaeft: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,
  },
  {
    id: 'katze',
    bettFarbe: '#7ea3c9',
    wach: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    schlaeft: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  },
];

interface NachtState {
  lampeAn: boolean;
  schlaeft: boolean[];
}

const STATE_KEY = 'gutenacht';
const STATE_VERSION = 1;
const defaultState: NachtState = { lampeAn: true, schlaeft: [false, false, false] };

let state: NachtState = { ...defaultState };
let cleanup: Array<() => void> = [];
let timers: number[] = [];

function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(fn, ms);
  timers.push(id);
}

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

function persist(): void {
  saveState<NachtState>(STATE_KEY, STATE_VERSION, state);
}

function mount(container: HTMLElement): void {
  state = loadState<NachtState>(STATE_KEY, STATE_VERSION, { ...defaultState, schlaeft: [...defaultState.schlaeft] });
  cleanup = [];

  container.innerHTML = `
    <div class="nacht-stage">
      <div class="nacht-szene" id="nachtSzene">
        <div class="n-wand"></div>
        <div class="n-fenster">
          <div class="n-fenster-himmel">
            <div class="n-mond"></div>
            <span class="n-stern s1"></span><span class="n-stern s2"></span><span class="n-stern s3"></span>
            <span class="n-stern s4"></span><span class="n-stern s5"></span><span class="n-stern s6"></span>
          </div>
        </div>
        <div class="n-lampe" data-item="lampe">
          <svg viewBox="0 0 60 100" width="100%" height="100%">
            <line x1="30" y1="40" x2="30" y2="94" stroke="#a9835e" stroke-width="4"/>
            <circle class="lampe-glow" cx="30" cy="26" r="26"/>
            <path d="M8 30 L52 30 L44 4 L16 4 Z" fill="#e0a458"/>
            <circle class="lampe-birne" cx="30" cy="30" r="8"/>
          </svg>
        </div>

        <div class="n-betten">
          ${ANIMALS.map(
            (a, i) => `
            <div class="n-bett${state.schlaeft[i] ? ' schlaeft' : ''}" style="--bett-farbe:${a.bettFarbe}">
              <div class="bett-rahmen"></div>
              <div class="n-tier${state.schlaeft[i] ? ' schlaeft' : ''}" data-item="tier${i}" data-idx="${i}">
                <div class="tier-wach">${a.wach}</div>
                <div class="tier-schlaeft">${a.schlaeft}</div>
              </div>
              <div class="n-decke"></div>
            </div>
          `,
          ).join('')}
        </div>
      </div>
    </div>
  `;

  const szene = container.querySelector<HTMLElement>('#nachtSzene')!;
  szene.classList.toggle('dunkel', !state.lampeAn);

  setupLampe(container, szene);
  setupTiere(container);
}

function setupLampe(root: HTMLElement, szene: HTMLElement): void {
  const mod = root.querySelector<HTMLElement>('.n-lampe')!;
  on(mod, 'pointerdown', (e) => {
    e.preventDefault();
    state.lampeAn = !state.lampeAn;
    szene.classList.toggle('dunkel', !state.lampeAn);
    playTone({
      freq: state.lampeAn ? 480 : 320,
      duration: 0.18,
      attack: 0.01,
      release: 0.3,
      type: 'sine',
      gain: 0.18,
    });
    persist();
  });
}

function setupTiere(root: HTMLElement): void {
  const tiere = root.querySelectorAll<HTMLElement>('.n-tier');
  tiere.forEach((tier) => {
    const idx = Number(tier.dataset.idx);
    on(tier, 'pointerdown', (e) => {
      e.preventDefault();
      const einschlafen = !state.schlaeft[idx];
      state.schlaeft[idx] = einschlafen;
      tier.classList.toggle('schlaeft', einschlafen);
      tier.closest('.n-bett')?.classList.toggle('schlaeft', einschlafen);
      if (einschlafen) {
        playWhoosh();
        playTone({ freq: 392, duration: 0.2, attack: 0.01, release: 0.4, type: 'sine', gain: 0.16 });
        later(() => {
          playTone({ freq: 294, duration: 0.3, attack: 0.01, release: 0.5, type: 'sine', gain: 0.14 });
        }, 220);
      } else {
        playTone({ freq: 440, duration: 0.1, attack: 0.005, release: 0.2, type: 'triangle', gain: 0.2 });
        later(() => {
          playTone({ freq: 587.33, duration: 0.16, attack: 0.005, release: 0.25, type: 'triangle', gain: 0.2 });
        }, 110);
      }
      persist();
    });
  });
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = [];
  state = { ...defaultState, schlaeft: [...defaultState.schlaeft] };
}

export const gutenacht: Toy = {
  id: 'gutenacht',
  accent: '#7ea3c9',
  tileIcon,
  mount,
  unmount,
};

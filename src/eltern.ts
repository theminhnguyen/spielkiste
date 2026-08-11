import { getVolume, setVolume, playClick } from './audio';
import { loadState, saveState, clearAllState } from './state';

interface SettingsState {
  volume: number;
}

const SETTINGS_KEY = 'settings';
const SETTINGS_VERSION = 1;

export function loadSettings(): void {
  const state = loadState<SettingsState>(SETTINGS_KEY, SETTINGS_VERSION, { volume: 0.6 });
  setVolume(state.volume);
}

function persistVolume(v: number): void {
  saveState<SettingsState>(SETTINGS_KEY, SETTINGS_VERSION, { volume: v });
}

export function renderElternbereich(container: HTMLElement): void {
  container.innerHTML = `
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version ${__APP_VERSION__} · ${__COMMIT_HASH__}</p>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(getVolume() * 100)}" class="eltern-volume" />
      </label>

      <div class="eltern-reset-zone">
        <button class="eltern-reset-btn">Alles zurücksetzen</button>
        <div class="eltern-reset-confirm" hidden>
          <p>Wirklich alle gespeicherten Spielstände löschen (Bild, Sticker, Schalterstellungen)?</p>
          <div class="eltern-reset-actions">
            <button class="eltern-reset-cancel">Abbrechen</button>
            <button class="eltern-reset-confirm-btn">Ja, zurücksetzen</button>
          </div>
        </div>
      </div>

      <button class="eltern-close">Schließen</button>
    </div>
  `;

  const volumeInput = container.querySelector<HTMLInputElement>('.eltern-volume')!;
  volumeInput.addEventListener('input', () => {
    const v = Number(volumeInput.value) / 100;
    setVolume(v);
  });
  volumeInput.addEventListener('change', () => {
    persistVolume(Number(volumeInput.value) / 100);
    playClick(500);
  });

  const resetBtn = container.querySelector<HTMLButtonElement>('.eltern-reset-btn')!;
  const resetConfirm = container.querySelector<HTMLElement>('.eltern-reset-confirm')!;
  const resetCancel = container.querySelector<HTMLButtonElement>('.eltern-reset-cancel')!;
  const resetConfirmBtn = container.querySelector<HTMLButtonElement>('.eltern-reset-confirm-btn')!;

  resetBtn.addEventListener('click', () => {
    resetBtn.hidden = true;
    resetConfirm.hidden = false;
  });
  resetCancel.addEventListener('click', () => {
    resetConfirm.hidden = true;
    resetBtn.hidden = false;
  });
  resetConfirmBtn.addEventListener('click', () => {
    clearAllState();
    window.location.reload();
  });
}

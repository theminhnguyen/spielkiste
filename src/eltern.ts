import { getVolume, setVolume, playClick, playTone, getAudioDebugInfo, unlockAudio } from './audio';
import { loadState, saveState, clearAllState } from './state';
import type { Toy } from './toys/types';

interface SettingsState {
  volume: number;
  /** Nachtflug-Modus: alles deutlich gedimmt (neu in v1.2 — fehlt in älteren Ständen). */
  nacht?: boolean;
  /** IDs der Spielzeuge, die auf der Startseite ausgeblendet sind. */
  versteckt?: string[];
}

const SETTINGS_KEY = 'settings';
// Version bleibt 1: Neue Felder sind optional, ältere gespeicherte Stände
// (nur volume) bleiben damit gültig — sonst wäre die Lautstärke weg.
const SETTINGS_VERSION = 1;

let settings: SettingsState = { volume: 0.6 };

export function loadSettings(): void {
  settings = loadState<SettingsState>(SETTINGS_KEY, SETTINGS_VERSION, { volume: 0.6 });
  setVolume(settings.volume);
}

function persist(): void {
  saveState<SettingsState>(SETTINGS_KEY, SETTINGS_VERSION, settings);
}

export function isNachtModus(): boolean {
  return settings.nacht === true;
}

export function getVersteckteSpiele(): string[] {
  return Array.isArray(settings.versteckt) ? settings.versteckt : [];
}

interface ElternOptions {
  toys: Toy[];
  /** Nach jeder Änderung an Nachtmodus oder sichtbaren Spielen aufgerufen. */
  onChange: () => void;
}

export function renderElternbereich(container: HTMLElement, opts: ElternOptions): void {
  const versteckt = new Set(getVersteckteSpiele());

  container.innerHTML = `
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version ${__APP_VERSION__} · ${__COMMIT_HASH__}</p>

      <section class="eltern-offline">
        <p class="eltern-offline-status">Prüfe Offline-Speicher …</p>
      </section>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(getVolume() * 100)}" class="eltern-volume" />
      </label>

      <label class="eltern-schalter">
        <input type="checkbox" class="eltern-nacht" ${isNachtModus() ? 'checked' : ''} />
        <span class="eltern-schalter-text">
          <strong>Nachtflug-Modus</strong>
          <small>Dimmt alle Spiele stark ab — blendet in der dunklen Kabine nicht und schont den Akku.</small>
        </span>
      </label>

      <section class="eltern-spiele">
        <h2>Spiele auf der Startseite</h2>
        <p>Antippen blendet ein Spiel aus oder wieder ein.</p>
        <div class="eltern-spiele-liste">
          ${opts.toys
            .map(
              (t) => `
            <button class="eltern-spiel${versteckt.has(t.id) ? ' aus' : ''}" data-id="${t.id}">
              <span class="eltern-spiel-icon">${t.tileIcon}</span>
              <span class="eltern-spiel-name">${t.name}</span>
            </button>`,
            )
            .join('')}
        </div>
        <p class="eltern-spiele-hinweis" hidden>Mindestens ein Spiel muss sichtbar bleiben.</p>
      </section>

      <div class="eltern-audio-diag">
        <button class="eltern-test-ton">Test-Ton abspielen</button>
        <p class="eltern-audio-status"></p>
      </div>

      <div class="eltern-reset-zone">
        <button class="eltern-reset-btn">Spielstände zurücksetzen</button>
        <div class="eltern-reset-confirm" hidden>
          <p>Wirklich alle gespeicherten Spielstände löschen (Bild, Sticker, Schalterstellungen)? Lautstärke, Nachtflug-Modus und ausgeblendete Spiele bleiben erhalten.</p>
          <div class="eltern-reset-actions">
            <button class="eltern-reset-cancel">Abbrechen</button>
            <button class="eltern-reset-confirm-btn">Ja, zurücksetzen</button>
          </div>
        </div>
      </div>

      <button class="eltern-close">Schließen</button>
    </div>
  `;

  /* Lautstärke */
  const volumeInput = container.querySelector<HTMLInputElement>('.eltern-volume')!;
  volumeInput.addEventListener('input', () => {
    setVolume(Number(volumeInput.value) / 100);
  });
  volumeInput.addEventListener('change', () => {
    settings.volume = Number(volumeInput.value) / 100;
    persist();
    playClick(500);
  });

  /* Nachtflug-Modus */
  const nachtInput = container.querySelector<HTMLInputElement>('.eltern-nacht')!;
  nachtInput.addEventListener('change', () => {
    settings.nacht = nachtInput.checked;
    persist();
    opts.onChange();
  });

  /* Spiele ein-/ausblenden */
  const hinweisEl = container.querySelector<HTMLElement>('.eltern-spiele-hinweis')!;
  container.querySelectorAll<HTMLButtonElement>('.eltern-spiel').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id!;
      if (versteckt.has(id)) {
        versteckt.delete(id);
      } else {
        if (opts.toys.length - versteckt.size <= 1) {
          hinweisEl.hidden = false;
          return;
        }
        versteckt.add(id);
      }
      hinweisEl.hidden = true;
      btn.classList.toggle('aus', versteckt.has(id));
      settings.versteckt = [...versteckt];
      persist();
      opts.onChange();
    });
  });

  /* Offline-Check */
  const offlineEl = container.querySelector<HTMLElement>('.eltern-offline-status')!;
  void pruefeOffline().then(({ ok, text }) => {
    offlineEl.textContent = text;
    offlineEl.classList.toggle('ok', ok);
    offlineEl.classList.toggle('fehlt', !ok);
  });

  /* Ton-Diagnose */
  const statusEl = container.querySelector<HTMLElement>('.eltern-audio-status')!;
  function refreshAudioStatus(): void {
    statusEl.textContent = getAudioDebugInfo();
  }
  refreshAudioStatus();
  window.setTimeout(refreshAudioStatus, 400);

  const testTonBtn = container.querySelector<HTMLButtonElement>('.eltern-test-ton')!;
  testTonBtn.addEventListener('click', () => {
    unlockAudio();
    playTone({ freq: 523.25, duration: 0.3, attack: 0.01, release: 0.3, gain: 0.4 });
    refreshAudioStatus();
    window.setTimeout(refreshAudioStatus, 400);
  });

  /* Zurücksetzen */
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
    clearAllState([SETTINGS_KEY]);
    window.location.reload();
  });
}

/**
 * Prüft, ob die App wirklich komplett offline auf diesem Gerät liegt: Der
 * Service Worker muss die Seite steuern, und alle Dateien, die diese Seite
 * gerade benutzt (Skript, Stylesheet, Startseite), müssen im Offline-Speicher
 * liegen. Vor dem Abflug einmal ansehen genügt.
 */
async function pruefeOffline(): Promise<{ ok: boolean; text: string }> {
  const nochmal = 'Noch nicht offline bereit: App einmal mit Internet öffnen, ganz schließen und erneut öffnen — dann hier nachsehen.';
  try {
    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      return { ok: false, text: 'Dieser Browser kann die App nicht offline speichern. Bitte über Safari zum Home-Bildschirm hinzufügen.' };
    }
    if (!navigator.serviceWorker.controller) return { ok: false, text: nochmal };

    const cacheName = (await caches.keys()).find((k) => k.includes('precache'));
    if (!cacheName) return { ok: false, text: nochmal };
    const cache = await caches.open(cacheName);
    const gespeichert = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));

    const benoetigt = [
      ...[...document.querySelectorAll<HTMLScriptElement>('script[src]')].map((s) => s.src),
      ...[...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((l) => l.href),
      new URL('index.html', document.baseURI).href,
    ].map((u) => new URL(u).pathname);

    const fehlt = benoetigt.filter((p) => !gespeichert.has(p));
    if (fehlt.length > 0) return { ok: false, text: nochmal };
    return { ok: true, text: `Bereit für offline ✓ — alle ${gespeichert.size} Dateien sind auf diesem Gerät gespeichert.` };
  } catch {
    return { ok: false, text: nochmal };
  }
}

/**
 * Akku schonen: Wird eine Weile nichts angetippt, wechselt die App in den
 * Ruhezustand — alle CSS-Daueranimationen halten an (Klasse `ruhe` auf <html>,
 * siehe style.css) und Spielzeuge mit eigenen Schleifen pausieren über
 * onRuheWechsel(). Die erste Berührung weckt alles sofort wieder.
 *
 * Spielzeuge, die ohne Berührung bewusst weiterlaufen sollen (Spieluhr beim
 * Einschlafen), melden sich währenddessen mit meldeAktivitaet().
 */

const RUHE_NACH_MS = 90_000;
const PRUEF_INTERVALL_MS = 5_000;

let lastActive = performance.now();
let inRuhe = false;
const listeners = new Set<(ruhe: boolean) => void>();

function setRuhe(ruhe: boolean): void {
  if (ruhe === inRuhe) return;
  inRuhe = ruhe;
  document.documentElement.classList.toggle('ruhe', ruhe);
  listeners.forEach((fn) => fn(ruhe));
}

export function meldeAktivitaet(): void {
  lastActive = performance.now();
  setRuhe(false);
}

export function istInRuhe(): boolean {
  return inRuhe;
}

/** Meldet Wechsel in den Ruhezustand (true) und zurück (false). Rückgabe: Abmelden. */
export function onRuheWechsel(fn: (ruhe: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initRuhe(): void {
  // Capture-Phase: läuft vor den Handlern der Spielzeuge — die sehen beim
  // ersten Tipp nach der Ruhe also schon wieder den Wachzustand.
  document.addEventListener('pointerdown', meldeAktivitaet, { capture: true });
  window.setInterval(() => {
    if (!inRuhe && performance.now() - lastActive > RUHE_NACH_MS) setRuhe(true);
  }, PRUEF_INTERVALL_MS);
}

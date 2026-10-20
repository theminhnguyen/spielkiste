const PREFIX = 'spielkiste:';

interface Versioned<T> {
  v: number;
  data: T;
}

export function loadState<T>(key: string, version: number, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Versioned<T>;
    if (parsed.v !== version) return fallback;
    return parsed.data;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, version: number, data: T): void {
  try {
    const payload: Versioned<T> = { v: version, data };
    localStorage.setItem(PREFIX + key, JSON.stringify(payload));
  } catch {
    // Speicher voll oder deaktiviert — Zustand bleibt einfach ungespeichert.
  }
}

/** Löscht alle gespeicherten Stände der Spielkiste — außer den Schlüsseln in `keep`. */
export function clearAllState(keep: string[] = []): void {
  try {
    const keepFull = new Set(keep.map((k) => PREFIX + k));
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX) && !keepFull.has(k)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignorieren
  }
}

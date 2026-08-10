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

export function clearAllState(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignorieren
  }
}

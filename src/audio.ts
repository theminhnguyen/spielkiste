let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let unlocked = false;
let silentAudioEl: HTMLAudioElement | null = null;
/** Letzter Fehler beim Freischalten — nur für die Diagnose im Elternbereich. */
let lastError: string | null = null;

function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) {
      lastError = 'AudioContext wird vom Browser nicht unterstützt';
      return null;
    }
    ctx = new Ctor();
    // Robuster als nur auf resume() zu warten: manche iOS-Versionen liefern
    // den Zustandswechsel zuverlässiger über dieses Event als über das
    // Promise von resume().
    ctx.onstatechange = () => {
      if (ctx?.state === 'running') unlocked = true;
    };
    masterGain = ctx.createGain();
    masterGain.gain.value = getVolume();
    masterGain.connect(ctx.destination);
    return ctx;
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err);
    ctx = null;
    return null;
  }
}

/**
 * Winziges lautloses WAV (1 Sample) als Data-URL — selbst erzeugt, keine
 * externe Datei. Wird ausschließlich gebraucht, um Safari auf iOS/iPadOS
 * dazu zu bringen, die "playback"-Audio-Session-Kategorie zu aktivieren
 * (siehe unlockAudio()).
 */
function createSilentWavDataUrl(): string {
  const bytes = new Uint8Array(45);
  const view = new DataView(bytes.buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 37, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // 1 Kanal
  view.setUint32(24, 8000, true); // Sample-Rate
  view.setUint32(28, 8000, true); // Byte-Rate
  view.setUint16(32, 1, true); // Block-Align
  view.setUint16(34, 8, true); // Bits pro Sample
  writeStr(36, 'data');
  view.setUint32(40, 1, true);
  view.setUint8(44, 128); // ein stilles Sample (Mittelwert bei 8-Bit unsigned)

  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export function unlockAudio(): void {
  // Wichtig: `unlocked` erst setzen, wenn der Context nachweislich läuft.
  // Vorher wurde die Freischaltung nach dem ersten Versuch dauerhaft
  // übersprungen — falls resume() bei diesem einen Versuch nicht rechtzeitig
  // durchlief (auf iOS keine Seltenheit), blieb der Ton für die gesamte
  // Sitzung stumm, ganz gleich wie oft danach getippt wurde.
  if (unlocked) return;
  try {
    const c = ensureContext();
    if (!c) return;

    if (c.state === 'running') {
      unlocked = true;
    } else if (c.state !== 'closed') {
      // Safari/WebKit auf iOS kennt neben "suspended" noch den
      // nicht-standardisierten Zustand "interrupted" (Audio-Session von
      // außen unterbrochen, z. B. beim ersten Erzeugen im Hintergrund
      // eines Gesten-Handlers). Der frühere Code rief resume() nur bei
      // "suspended" auf — "interrupted" landete im Fehlerzweig und wurde
      // nie wieder verlassen, ganz gleich wie oft man tippte. resume()
      // hebt beide Zustände auf, daher hier bewusst nicht auf den exakten
      // Zustandsnamen prüfen, sondern auf alles außer "running"/"closed".
      c.resume()
        .then(() => {
          if (c.state === 'running') unlocked = true;
        })
        .catch((err) => {
          lastError = `resume() abgelehnt (Zustand war "${c.state}"): ${err instanceof Error ? err.message : String(err)}`;
          /* nächster Tipp versucht es erneut, siehe oben */
        });
    } else {
      lastError = `AudioContext im Zustand "${c.state}"`;
    }

    // iOS/iPadOS Safari kann Web-Audio-Töne dämpfen, solange die Seite noch
    // kein natives <audio>/<video> abgespielt hat (sonst "ambient" statt
    // "playback" Audio-Session-Kategorie). Ein kurzes, lautloses <audio>-
    // Element aus derselben Touch-Geste heraus abzuspielen wechselt die
    // Kategorie — schadet nicht, auch falls das nicht die Ursache war.
    if (!silentAudioEl) {
      silentAudioEl = new Audio(createSilentWavDataUrl());
      silentAudioEl.volume = 0.01;
      silentAudioEl.setAttribute('playsinline', 'true');
    }
    try {
      silentAudioEl.currentTime = 0;
    } catch {
      /* vor dem ersten Laden ignorierbar */
    }
    silentAudioEl.play().catch((err) => {
      lastError = `stilles <audio> abgelehnt: ${err instanceof Error ? err.message : String(err)}`;
    });
  } catch (err) {
    lastError = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  }
}

/**
 * Menschenlesbarer Diagnose-Text für den Elternbereich — damit sich ein
 * Ton-Problem auf einem Gerät, das wir nicht selbst in der Hand haben,
 * anhand des angezeigten Texts eingrenzen lässt.
 */
export function getAudioDebugInfo(): string {
  const parts: string[] = [];
  parts.push(ctx ? `Status: ${ctx.state}` : 'Status: noch nicht gestartet');
  parts.push(unlocked ? 'freigeschaltet: ja' : 'freigeschaltet: nein');
  parts.push(`Lautstärke: ${Math.round(volume * 100)}%`);
  const supportsAudioContext = !!(window.AudioContext ?? (window as any).webkitAudioContext);
  parts.push(`AudioContext unterstützt: ${supportsAudioContext ? 'ja' : 'nein'}`);
  if (lastError) parts.push(`letzter Fehler: ${lastError}`);
  return parts.join(' · ');
}

let volume = 0.6;

export function getVolume(): number {
  return volume;
}

export function setVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = volume;
}

export function isAudioReady(): boolean {
  return !!ctx && ctx.state === 'running';
}

/**
 * Pentatonische Skala (C-Dur-Pentatonik) — jede Kombination klingt harmonisch.
 */
export const PENTATONIC_HZ = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

interface ToneOptions {
  freq: number;
  duration?: number;
  attack?: number;
  release?: number;
  type?: OscillatorType;
  gain?: number;
}

export function playTone(opts: ToneOptions): void {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return;
  const { freq, duration = 0.5, attack = 0.02, release = 0.35, type = 'sine', gain = 0.5 } = opts;

  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;

  const env = c.createGain();
  env.gain.setValueAtTime(0, c.currentTime);
  env.gain.linearRampToValueAtTime(gain, c.currentTime + attack);
  env.gain.linearRampToValueAtTime(0, c.currentTime + attack + duration + release);

  osc.connect(env);
  env.connect(masterGain);

  osc.start();
  osc.stop(c.currentTime + attack + duration + release + 0.05);
}

export function playClick(freq = 440): void {
  playTone({ freq, duration: 0.03, attack: 0.002, release: 0.08, type: 'triangle', gain: 0.3 });
}

/**
 * Anhaltender Ton für Glissando-artige Bedienelemente (z. B. Schieberegler).
 * start() liefert ein Handle mit update(freq) und stop().
 */
export interface SustainedTone {
  update(freq: number): void;
  stop(): void;
}

export function startSustainedTone(freq: number, gain = 0.28): SustainedTone | null {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return null;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  const env = c.createGain();
  env.gain.setValueAtTime(0, c.currentTime);
  env.gain.linearRampToValueAtTime(gain, c.currentTime + 0.05);

  osc.connect(env);
  env.connect(masterGain);
  osc.start();

  let stopped = false;

  return {
    update(newFreq: number) {
      if (stopped) return;
      osc.frequency.linearRampToValueAtTime(newFreq, c.currentTime + 0.06);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      env.gain.cancelScheduledValues(c.currentTime);
      env.gain.setValueAtTime(env.gain.value, c.currentTime);
      env.gain.linearRampToValueAtTime(0, c.currentTime + 0.15);
      osc.stop(c.currentTime + 0.2);
    },
  };
}

let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(c: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const length = c.sampleRate * 0.5;
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

/**
 * Reißverschluss-Geräusch: gefiltertes Rauschen mit Frequenz-Sweep.
 */
export function playZipSound(opening: boolean): void {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return;

  const source = c.createBufferSource();
  source.buffer = getNoiseBuffer(c);

  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 8;
  const from = opening ? 700 : 2200;
  const to = opening ? 2200 : 700;
  filter.frequency.setValueAtTime(from, c.currentTime);
  filter.frequency.linearRampToValueAtTime(to, c.currentTime + 0.35);

  const env = c.createGain();
  env.gain.setValueAtTime(0, c.currentTime);
  env.gain.linearRampToValueAtTime(0.18, c.currentTime + 0.03);
  env.gain.linearRampToValueAtTime(0, c.currentTime + 0.38);

  source.connect(filter);
  filter.connect(env);
  env.connect(masterGain);

  source.start();
  source.stop(c.currentTime + 0.4);
}

/**
 * Weicher, tiefer Trommelschlag: Sinus mit kurzem Tonhöhen-Abfall (der
 * typische „Bumm"), eine Oberton-Schicht und ein Hauch gefiltertes Rauschen
 * fürs Fell. Die Oberton-Schicht ist wichtig, weil Tablet-Lautsprecher unter
 * ~150 Hz kaum etwas wiedergeben — ohne sie wäre eine tiefe Trommel am iPad
 * fast stumm.
 */
export function playDrum(freq: number, gain = 0.4, decay = 0.55): void {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return;
  const t = c.currentTime;
  const g = Math.max(0.001, gain);

  const body = c.createOscillator();
  body.type = 'sine';
  body.frequency.setValueAtTime(freq * 2.2, t);
  body.frequency.exponentialRampToValueAtTime(freq, t + 0.07);
  const bodyEnv = c.createGain();
  bodyEnv.gain.setValueAtTime(0.0001, t);
  bodyEnv.gain.exponentialRampToValueAtTime(g, t + 0.006);
  bodyEnv.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  body.connect(bodyEnv);
  bodyEnv.connect(masterGain);
  body.start(t);
  body.stop(t + decay + 0.05);

  const over = c.createOscillator();
  over.type = 'triangle';
  over.frequency.setValueAtTime(freq * 4, t);
  over.frequency.exponentialRampToValueAtTime(freq * 2, t + 0.05);
  const overEnv = c.createGain();
  overEnv.gain.setValueAtTime(0.0001, t);
  overEnv.gain.exponentialRampToValueAtTime(g * 0.35, t + 0.005);
  overEnv.gain.exponentialRampToValueAtTime(0.0001, t + decay * 0.45);
  over.connect(overEnv);
  overEnv.connect(masterGain);
  over.start(t);
  over.stop(t + decay * 0.45 + 0.05);

  const noise = c.createBufferSource();
  noise.buffer = getNoiseBuffer(c);
  const lowpass = c.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 900;
  const noiseEnv = c.createGain();
  noiseEnv.gain.setValueAtTime(g * 0.5, t);
  noiseEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  noise.connect(lowpass);
  lowpass.connect(noiseEnv);
  noiseEnv.connect(masterGain);
  noise.start(t, Math.random() * 0.3);
  noise.stop(t + 0.1);
}

/**
 * Kurzes, weiches „Bonk" eines Balls — Sinus mit schnellem Tonhöhen-Abfall.
 */
export function playBounce(freq: number, gain = 0.25): void {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return;
  const t = c.currentTime;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.8, t);
  osc.frequency.exponentialRampToValueAtTime(freq, t + 0.04);
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(Math.max(0.001, gain), t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(env);
  env.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.26);
}

/**
 * Laub-Rascheln: hoch gefiltertes Rauschen mit unregelmäßig springender
 * Lautstärke, damit es nach vielen kleinen Blättern klingt statt nach einem
 * gleichmäßigen Zischen.
 */
export function playRustle(gain = 0.15, duration = 0.3): void {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return;
  const t = c.currentTime;

  const source = c.createBufferSource();
  source.buffer = getNoiseBuffer(c);
  const highpass = c.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 1800;
  const bandpass = c.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 3000 + Math.random() * 2000;
  bandpass.Q.value = 0.7;

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const at = t + (duration * i) / steps;
    const fade = 1 - i / steps;
    env.gain.linearRampToValueAtTime(gain * fade * (0.4 + Math.random() * 0.6), at + 0.012);
  }
  env.gain.linearRampToValueAtTime(0, t + duration + 0.04);

  source.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(env);
  env.connect(masterGain);
  source.start(t, Math.random() * Math.max(0, 0.5 - duration - 0.05));
  source.stop(t + duration + 0.06);
}

/**
 * Weiches Rauschen für das Türchen-Öffnen (kurzes "Whoosh").
 */
export function playWhoosh(): void {
  const c = ctx;
  if (!c || !masterGain || c.state !== 'running') return;

  const source = c.createBufferSource();
  source.buffer = getNoiseBuffer(c);

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, c.currentTime);
  filter.frequency.linearRampToValueAtTime(1400, c.currentTime + 0.25);

  const env = c.createGain();
  env.gain.setValueAtTime(0, c.currentTime);
  env.gain.linearRampToValueAtTime(0.14, c.currentTime + 0.05);
  env.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);

  source.connect(filter);
  filter.connect(env);
  env.connect(masterGain);

  source.start();
  source.stop(c.currentTime + 0.32);
}

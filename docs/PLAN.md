# Spielkiste — Produkt- & Technikplan

Ziel: Eine ruhige, komplett offline nutzbare Spiel-App für eine 2-Jährige auf dem
iPad, nach den in [RECHERCHE-POKPOK.md](RECHERCHE-POKPOK.md) beschriebenen
Prinzipien — mit eigenem Namen, eigenen Grafiken und eigenen Sounds.

## 1. Grundsatzentscheidung: PWA statt nativer App

**Entscheidung: Web-App (PWA), installiert über Safari → „Zum Home-Bildschirm".**

Begründung:
- Eine native iOS-App bräuchte für eine dauerhafte Installation das Apple Developer
  Program (99 €/Jahr). Mit kostenlosem Apple-Account läuft eine selbst installierte
  App nach 7 Tagen ab und müsste wöchentlich neu per Mac aufs iPad — für eine
  Kleinkind-App unbrauchbar. → Verstößt gegen die Kostenlos-Regel bzw. Alltagstauglichkeit.
- Die PWA ist kostenlos (GitHub Pages), startet vom Home-Bildschirm im Vollbild ohne
  Browser-UI und funktioniert nach dem ersten Laden komplett offline (Service Worker).
- Verifiziert: Für Home-Screen-Web-Apps gilt Safaris 7-Tage-Löschregel für
  Website-Daten **nicht** — Offline-Cache und Spielstände bleiben dauerhaft erhalten.
- Akzeptierte Grenze: Die Home-Wischgeste kann die App verlassen. Lösung ist iPadOS'
  eingebauter **Geführter Zugriff** (sperrt Gesten, Eltern entsperren per Code) —
  steht in der Eltern-Anleitung.

## 2. Produktumfang V1

**Spielzimmer (Home) + 4 Spielzeuge + versteckter Elternbereich.** Kein Onboarding,
kein Startbildschirm, kein Menü — App öffnet direkt das Spielzimmer.

### 2.1 Spielzimmer
- Gemütlicher Raum (warme Abendlicht-Stimmung), die 4 Spielzeuge liegen als große
  Objekte darin und „atmen" sanft (Idle-Animation).
- Tipp auf ein Spielzeug → weicher Zoom-Übergang hinein.
- In jedem Spielzeug: **großer, sanft pulsierender Zurück-Kreis oben links**
  (≥ 96 px), Tipp → zurück ins Spielzimmer. Einziges Navigationselement der App.

### 2.2 Spielzeug „Fummelbrett" (Herzstück für Alter 2)
Ein Brett voller Bedienelemente, alle mit sofortiger Klang- und Licht-Reaktion:
- Kippschalter → Lämpchen geht an/aus (weiches „Klack")
- Großer Drehknopf → rastet mit leisen Ticks
- Schieberegler → Ton gleitet mit (Glissando)
- 3 große bunte Drucktasten → weiche Töne, leuchten beim Druck
- Reißverschluss → auf-/zuziehen mit „Ratsch"-Geräusch
- Windrädchen → anschnipsen, dreht sich aus, klickert leise
- Klappe/Türchen → dahinter lugt abwechselnd ein Tierchen hervor (ruhige Überraschung)

### 2.3 Spielzeug „Klang-Kleckse"
- 6 weiche Kleckse mit Gesichtern (blinzeln gelegentlich)
- Antippen: quetscht sich + sanfter Ton (**pentatonische Skala** → jede Kombination
  klingt harmonisch, es gibt keine „falschen" Töne)
- Ziehen: folgt dem Finger mit Wabbel-Effekt (Feder-Dämpfer-Animation)
- Zusammenstoßen: beide klingen leise zusammen
- Mehrere Kleckse gleichzeitig greifbar (Multi-Touch)

### 2.4 Spielzeug „Malen"
- Ganzseitige Leinwand, dicker weicher Pinselstrich (Canvas 2D)
- 6 große Farbkleckse als Palette (nur Farben, keine Icons/Text)
- „Neues Blatt": Papierknüll-Objekt — Blatt knüllt sich mit Animation zusammen,
  frisches erscheint (keine Bestätigungsdialoge)
- Das letzte Bild bleibt gespeichert und ist beim nächsten Öffnen wieder da

### 2.5 Spielzeug „Stapelsteine"
- Regal mit weichen Bausteinen (verschiedene Formen, freundliche Gesichter)
- Auf die Bühne ziehen, einfaches Snap-Stapeln (kein Physik-Engine — Wackeln und
  weiches Purzeln sind vordefinierte Animationen)
- Tipp auf einen Turm: wackelt + kichert leise; kräftiges Wischen: purzelt weich um
- Die Szene bleibt gespeichert

### 2.6 Elternbereich (einziger Bereich mit Text, auf Deutsch)
- Zugang: kleines unauffälliges Symbol in einer Ecke des Spielzimmers,
  **3 Sekunden gedrückt halten** (für 2-Jährige praktisch nicht auslösbar)
- Inhalt: Lautstärke / Ton an-aus, Version (aus package.json + Commit-Hash),
  Kurzanleitung (Installation, Flugmodus-Test, Geführter Zugriff), „Alles zurücksetzen"

## 3. Designregeln (verbindlich für die Umsetzung)

1. **Kein Text, keine Zahlen, keine Menüs** im Kinderbereich — nirgends.
2. **Keine Level, Punkte, Timer, Belohnungen, Fehlermeldungen.** Nichts kann falsch
   bedient werden; jede Eingabe führt zu einer sinnvollen Reaktion.
3. **Farben:** warm und gedeckt (Pastell, moderate Sättigung), keine grellen
   Neonfarben, keine harten Blinkeffekte.
4. **Animationen:** langsam und weich (ca. 300–700 ms, ease-out). Nichts zappelt
   dauerhaft schnell.
5. **Sound:** leise und weich (sanfter Attack, langes Release), pentatonisch, nie
   plötzlich laut; zentraler Master-Gain mit Limiter-Charakter. Stille ist ok.
6. **Touch-Ziele ≥ 88×88 px.** Reaktion bereits bei `pointerdown`, nicht erst beim
   Loslassen (gefühlte Sofortigkeit).
7. **Multi-Touch-tolerant:** Patschen mit der ganzen Hand darf nie zu Fehlern,
   Sprüngen oder verlorenem Zustand führen.
8. **Alles reagiert:** möglichst keine „toten" Flächen — auch Deko gibt mindestens
   eine kleine visuelle Antwort.
9. **Kein Netzwerkzugriff zur Laufzeit:** keine CDNs, keine Webfonts, keine
   Analytics. 100 % der Assets im Precache.
10. **Zustand bleibt erhalten** (Schalterstellungen, Bild, Steine) — Wiedererkennen
    beim nächsten Öffnen ist Teil des Spielgefühls.

## 4. Technik

- **Stack:** Vite + TypeScript, **kein Framework** (wenige Abhängigkeiten, langlebig,
  einfach zu warten). Rendering: SVG + CSS-Transforms für Spielzeuge, Canvas 2D fürs
  Malen.
- **Eingabe:** Pointer Events mit `pointerId`-Tracking (Multi-Touch sauber pro
  Finger). Global: `touch-action: none`, `user-select: none`,
  `overscroll-behavior: none`, `gesturestart`/Doppeltipp-Zoom unterbinden.
- **Audio:** eine `AudioContext`, Unlock beim ersten `pointerdown` (iOS-Pflicht).
  Alle Sounds synthetisiert (Oszillatoren, Filter, Hüllkurven) — keine Audiodateien
  nötig, kein Lizenzthema, winziger Build.
- **PWA:** `vite-plugin-pwa` (Workbox-Precache aller Assets), Web-App-Manifest
  (`display: standalone`, Icons 180/192/512, Theme-Farbe), iOS-Metatags
  (`apple-mobile-web-app-capable`, `apple-touch-icon`), `viewport-fit=cover`.
- **Persistenz:** `localStorage`, versioniertes JSON pro Spielzeug; Zeichnung als
  Data-URL. Defekte/volle Daten → stiller Reset auf Anfangszustand (nie crashen).
- **Struktur:**
  ```
  src/
    main.ts        App-Shell, Spielzimmer, Navigation, Eltern-Gate
    audio.ts       AudioContext, Synth-Bausteine, Master-Gain
    state.ts       Laden/Speichern (versioniert, fehlertolerant)
    toys/
      brett.ts     Fummelbrett
      kleckse.ts   Klang-Kleckse
      malen.ts     Malen
      steine.ts    Stapelsteine
    eltern.ts      Elternbereich
  ```
- **Hosting/Deploy:** öffentliches GitHub-Repo `spielkiste`, GitHub Pages aus Branch
  `gh-pages` (Deploy = gebautes `dist/` pushen; bewusst **ohne** GitHub Actions).
  `base`-Pfad in Vite auf `/spielkiste/`.
- **Beide Orientierungen:** Layout funktioniert quer und hochkant (iOS ignoriert
  Orientierungssperren im Manifest ohnehin).

## 5. iPad-Einrichtung (macht der Nutzer einmalig, Anleitung liegt der App bei)

1. Safari → Live-URL öffnen → Teilen-Symbol → **„Zum Home-Bildschirm"**.
2. App einmal **mit** Internet öffnen (Cache lädt sich voll), danach Flugmodus-Test:
   App schließen, Flugmodus an, App öffnen — alles muss funktionieren.
3. Einstellungen → Bedienungshilfen → **Geführter Zugriff** aktivieren; beim Spielen
   dreifach auf die obere Taste drücken, um die App zu sperren (Kind kann sie dann
   nicht verlassen).

## 6. Später (V2-Ideen — in V1 NICHT bauen)

Stadt (ab ca. 3 J.), Wimmelbuch, Tag/Nacht-Wechsel im Spielzimmer, Jahreszeiten,
Radio/Klang-Sequencer, weitere Fummelbrett-Module, Produktkarte auf minh.studio.

## 7. Rechtliches

Eigener Name („Spielkiste", Arbeitstitel), eigene Grafiken (selbst gebaute SVGs),
eigene synthetisierte Sounds. Von Pok Pok übernehmen wir nur die freien Ideen
(ruhig, offen, ohne Text, Spielzimmer-Metapher). Private Nutzung in der Familie.

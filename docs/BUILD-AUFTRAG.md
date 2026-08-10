# Build-Auftrag: Spielkiste (für die Umsetzungs-Session, Sonnet 5)

## Auftrag

Baue die App „Spielkiste" exakt nach [PLAN.md](PLAN.md) — Phase für Phase, in der
Reihenfolge unten. **Teste jede Phase selbst** mit den Browser-Preview-Tools, behebe
gefundene Fehler sofort und arbeite weiter, **bis die Definition of Done (unten)
vollständig erfüllt ist.** Arbeite autonom: umsetzen, committen, direkt auf `main`
pushen — ohne Rückfrage pro Schritt. Kommunikation und Commits auf Deutsch.

Lies vor Beginn: `CLAUDE.md` (Projektregeln) und `docs/PLAN.md` (was gebaut wird).

## Arbeitsregeln

- **Nur kostenlose Dienste** (GitHub Pages). Nichts einrichten, das eine Kreditkarte
  oder ein Bezahl-Abo verlangt. Falls doch nötig: stoppen und fragen.
- **Keine externen Assets** (Bilder, Sounds, Fonts, 3D-Modelle) aus dem Internet
  einbauen ohne vorherige AskUserQuestion mit genauer URL. Standard: Grafiken selbst
  als SVG, Sounds selbst per Web Audio synthetisieren, Systemschrift im Elternbereich.
- **Abhängigkeiten minimal halten:** Vite, TypeScript, vite-plugin-pwa — mehr nur
  mit guter Begründung; ab dem zweiten zusätzlichen Laufzeit-Paket per
  AskUserQuestion fragen.
- **Nach jeder Phase:** Akzeptanzkriterien nachweisen → Prüf-Durchgang (Bugs,
  Unlogik, Performance, toter Code) → Fixes → Commit + Push. Erst dann weiter.
- **Bei Grundsatzentscheidungen** (Namensänderung, Physik-Engine, Architekturwechsel)
  kurz per AskUserQuestion fragen; alles andere selbst entscheiden.

## Phasen

### P0 — Gerüst & Deploy-Pipeline ✅ erledigt
- Projekt liegt unter `~/Downloads/outputs/spielkiste` (verschoben aus
  `~/Downloads/spielkiste`, weil der Preview-Server-Spawn nur im `outputs`-Baum
  zuverlässig funktioniert — siehe Hinweis in CLAUDE.md).
- Vite-Projekt (vanilla-ts-Basis) angelegt, `vite-plugin-pwa` eingerichtet,
  `.gitignore`, `vite.config.ts` mit `base: '/spielkiste/'`.
- Dev-Server-Config liegt zentral in `~/Downloads/outputs/.claude/launch.json`
  unter dem Namen `spielkiste-dev` (nicht projektlokal — dort wird sie nicht
  gefunden).
- GitHub-Repo: https://github.com/theminhnguyen/spielkiste — `main` gepusht.
- Deploy-Skript `npm run deploy` (Paket `gh-pages`) eingerichtet und einmal
  ausgeführt; GitHub Pages läuft automatisch auf Branch `gh-pages`. **Kein
  GitHub-Actions-Workflow.**
- Eigene SVG-Icon-Grafik (`public/icons/icon.svg`) gebaut, mit macOS-Bordmittel
  `sips` (kein externes Tool, keine Abhängigkeit) zu PNG 180/192/512 gerendert.
- Platzhalterseite mit sichtbarer Version (package.json-Version + Commit-Hash,
  zur Build-Zeit per `vite.config.ts`-`define` injiziert).
- **Akzeptanz — bestätigt:** Dev-Server läuft (Konsole leer), `npm run build`
  fehlerfrei, `npm run preview` zeigt aktiven Service Worker + ladendes Manifest
  (3 Icons). Live-URL: https://theminhnguyen.github.io/spielkiste/

### P1 — App-Shell: Spielzimmer & Navigation
- Vollbild-Layout ohne Scrollen, funktioniert quer und hochkant.
- Spielzimmer mit 4 Platzhalter-Spielzeugen (einfache SVG-Formen reichen hier),
  Zoom-Übergang hinein/heraus, pulsierender Zurück-Kreis oben links.
- Eltern-Gate: Ecksymbol 3 s halten → (noch leerer) Elternbereich mit Version.
- Touch-Härtung: `touch-action: none`, `user-select: none`,
  `overscroll-behavior: none`, kein Pinch-/Doppeltipp-Zoom.
- Audio-Grundgerüst: AudioContext-Unlock beim ersten `pointerdown`, ein leiser
  Bestätigungston als Machbarkeitsnachweis.
- **Akzeptanz:** Per `computer`-Klicks: in alle 4 Spielzeuge hinein- und wieder
  hinausnavigieren. `resize_window` 768×1024 **und** 1024×768 ohne Layout-Bruch
  (Screenshots als Beleg). Eltern-Gate öffnet erst nach Halten, nicht bei kurzem
  Tipp. Konsole überall leer.

### P2 — Fummelbrett
- Alle 7 Elemente aus PLAN.md §2.2 mit Klang + Animation; Zustand persistiert.
- **Akzeptanz:** Jedes Element einzeln per `computer` bedienen (Klick/Drag) und die
  Zustandsänderung nachweisen (read_page/Screenshot; z. B. Schalter-Lampe an).
  Seite neu laden → Schalterstellungen wiederhergestellt. Konsole leer.

### P3 — Klang-Kleckse
- 6 Kleckse: Tipp = Squish + pentatonischer Ton; Ziehen mit Wabbel-Feder;
  Kollisionsklang; sauberes Multi-Pointer-Handling (`pointerId`-Map).
- **Akzeptanz:** Drag verschiebt einen Klecks nachweisbar (Position vorher/nachher
  per `javascript_tool` auslesen). Schnelle wiederholte Taps/Drags erzeugen keine
  Fehler. Konsole leer.

### P4 — Malen
- Canvas-Leinwand, 6 Farbkleckse, dicker weicher Strich, Papierknüll-„neues Blatt",
  Bild persistiert als Data-URL.
- **Akzeptanz:** Ein per `computer`-Drag gemalter Strich hinterlässt Pixel
  (Canvas-Pixeldaten per `javascript_tool` prüfen). Farbwechsel wirkt auf den
  nächsten Strich. Neu laden → Bild noch da. Neues Blatt leert die Leinwand.

### P5 — Stapelsteine
- Regal, Drag auf die Bühne, Snap-Stapeln, Wackeln/weiches Umfallen, Persistenz.
- **Akzeptanz:** Stein per Drag platzierbar, zweiter Stein rastet auf dem ersten
  ein, Wisch wirft den Turm um (Animation endet in stabilem Zustand). Neu laden →
  Szene erhalten. Konsole leer.

### P6 — Feinschliff & Härtung
- Idle-Animationen im Spielzimmer, weiche Übergänge überall, Lautstärkeregler und
  „Alles zurücksetzen" im Elternbereich, App-Icons (180/192/512) + Splash-Farbe.
- Robustheit: defekter/voller localStorage → stiller Reset statt Crash; App bleibt
  bedienbar, wenn Audio nicht startet (z. B. Stummschalter).
- Performance-Pass strukturell: Animationen nur über `transform`/`opacity`,
  keine Layout-Thrashing-Loops, `requestAnimationFrame` sauber, DOM klein halten.
  **FPS nicht im Preview-Tab messen** (versteckter Tab drosselt die GPU) —
  strukturell begründen, Gerätetest macht der Nutzer.
- Großer Prüf-Durchgang: Bugs, Unlogik, toter Code — sofort fixen.
- **Akzeptanz:** Alle vorherigen Phasen-Checks laufen erneut grün (Regression).

### P7 — End-to-End & Release
- Prod-Build; per `npm run preview` einen kompletten Durchlauf machen: alle 4
  Spielzeuge bedienen, zurück, Elternbereich, Reload-Persistenz.
- Offline-Nachweis: Precache-Manifest enthält **alle** Assets (`caches.keys()` +
  Inhalte per `javascript_tool` inspizieren); nach der Erstladung entstehen beim
  Navigieren/Spielen **keine weiteren Netzwerk-Requests**
  (`read_network_requests`).
- `npm run deploy`; Live-URL im Browser-Tab öffnen: App lädt, SW registriert.
- `ELTERN-ANLEITUNG.md` schreiben (Installation am iPad, Erstladung mit Internet,
  Flugmodus-Test, Geführten Zugriff einrichten) und README aktualisieren.
- Abschlussbericht an den Nutzer: was gebaut wurde, Live-URL, Screenshots, und die
  **Gerätetest-Checkliste** (das Einzige, was nur der Nutzer am echten iPad kann):
  1. Installieren („Zum Home-Bildschirm"), 2. einmal online öffnen,
  3. Flugmodus-Test, 4. Multi-Touch-Patsch-Test in jedem Spielzeug,
  5. Lautstärke-Empfinden, 6. Geführter Zugriff.

## Teststrategie (gilt für alle Phasen)

- Dev-Server **immer** über die Preview-Tools starten (`.claude/launch.json`),
  nie per Bash.
- Nach jeder Änderung: `read_console_messages` (muss leer sein), `read_page`,
  gezielte Interaktionen per `computer`, Screenshot als Beleg.
- Viewports: 768×1024 und 1024×768 (iPad); zusätzlich einmal schmal (Robustheit).
- Multi-Touch ist im Preview nicht real simulierbar → Code-Disziplin erzwingen:
  jeder Pointer in einer `pointerId`-Map, kein globaler „aktueller Finger",
  `pointercancel` überall behandeln. Am Ende prüft der Nutzer am Gerät.
- Offline-Verhalten wie in P7 beschrieben nachweisen (Precache + keine
  Laufzeit-Requests) — DevTools-Offline-Modus steht im Preview nicht zur Verfügung.

## Definition of Done (erst wenn ALLES erfüllt ist, ist der Auftrag fertig)

1. Live-URL auf GitHub Pages erreichbar, App lädt dort fehlerfrei.
2. Spielzimmer + alle 4 Spielzeuge vollständig bedienbar, Navigation hin und zurück.
3. Jede vorgesehene Interaktion gibt sichtbares und (bei aktivem Ton) hörbares
   Feedback.
4. Kinderbereich ohne jeden Text; Elternbereich nur über 3-Sekunden-Gate.
5. Zustand überlebt Reload: Fummelbrett-Stellungen, Bild, Steine-Szene.
6. Service-Worker-Precache vollständig; nach Erstladung keine Netzwerk-Requests.
7. Konsole in allen Screens leer (keine Errors, keine Warnings aus eigenem Code).
8. Beide Orientierungen ohne Layout-Bruch.
9. Version (package.json + Commit-Hash) im Elternbereich sichtbar.
10. `ELTERN-ANLEITUNG.md` vorhanden, README aktualisiert (Status, Live-URL).
11. Alles committet und gepusht; Abschlussbericht mit Screenshots und
    Gerätetest-Checkliste an den Nutzer.

## Wenn etwas schiefgeht

Fehler selbst debuggen, fixen, Phase-Tests wiederholen — nicht an den Nutzer
zurückgeben. Nur bei echten Weichenstellungen oder Kosten-/Asset-Fragen
AskUserQuestion verwenden. Niemals Testergebnisse beschönigen: Was rot ist, wird
als rot berichtet und dann repariert.

# Spielkiste — Projektregeln für Claude

Dies ist eine Offline-PWA-Spiel-App für ein 2-jähriges Kind (iPad).

**Stand (12.10.2026, v1.1.1): fertig.** Alle Phasen aus
[docs/BUILD-AUFTRAG.md](docs/BUILD-AUFTRAG.md) sind abgeschlossen, live auf
https://theminhnguyen.github.io/spielkiste/. Der Build-Auftrag ist damit nur noch
Hintergrund — neue Arbeit kommt als konkreter Wunsch des Nutzers, nicht als „nächste Phase".
12 Spielzeuge (Fummelbrett, Klang-Kleckse, Malen, Formen-Sortierer, Seifenblasen, Putzen,
Sticker-Szene, Wimmelbild, Gute-Nacht-Szene, dazu für gröberes Spielen Patsch-Trommeln,
Bälle schubsen, Laubhaufen); die Stapelsteine wurden auf Wunsch entfernt.
Eltern-Anleitung: [ELTERN-ANLEITUNG.md](ELTERN-ANLEITUNG.md).
Produkt- und Designentscheidungen stehen in [docs/PLAN.md](docs/PLAN.md).

## Wichtigste Regeln (Kurzfassung)

1. **Deutsch** — Kommunikation und Commit-Messages auf Deutsch.
2. **Autonom arbeiten** — selbst umsetzen, committen und direkt auf `main` pushen.
   Der Nutzer hat keine Programmiererfahrung; niemals „führe diesen Befehl aus".
3. **Kostenlos** — nur Free-Tiers (GitHub Pages). Nichts, was eine Kreditkarte braucht.
4. **Eigene Assets** — alle Grafiken selbst als SVG bauen, alle Sounds mit Web Audio
   synthetisieren. **Keine** Dateien/Assets aus dem Internet einbauen, ohne vorher per
   AskUserQuestion mit genauer URL zu fragen. Nichts von Pok Pok kopieren (Name,
   Grafiken, Sounds) — nur die Prinzipien sind Vorbild.
5. **Kind-UI ohne Text** — im Kinderbereich niemals Text, Menüs, Belohnungen, Timer
   oder Fehlerzustände. Details: PLAN.md, Abschnitt „Designregeln".
6. **Test am Ende jeder Phase** — Akzeptanzkriterien aus dem BUILD-AUFTRAG mit den
   Browser-Preview-Tools nachweisen (Konsole leer, Screenshot als Beleg), erst dann
   committen und zur nächsten Phase.
7. **Performance nicht im Preview-Tab messen** — der versteckte Tab drosselt die GPU
   (Faktor ~15 Streuung). FPS-Aussagen nur strukturell begründen (wenige DOM-Nodes,
   CSS-Transforms statt Layout, requestAnimationFrame-Disziplin); die echte Messung
   macht der Nutzer am iPad.
8. **Version hochzählen** — bei jeder Änderung `version` in `package.json` erhöhen;
   sie steht unten im Elternbereich, so sieht der Nutzer am iPad, ob das Update da ist.

## Fallen, die schon zugeschlagen haben

- **Ton auf dem iPad stumm:** WebKit kennt neben `suspended` den Zustand `interrupted`.
  `resume()` bei jedem Zustand außer `running`/`closed` versuchen und „entsperrt" erst
  merken, wenn der Context wirklich läuft. Die Ton-Diagnose im Elternbereich zeigt den
  Zustand — bei Ton-Problemen den Nutzer bitten, den Text abzuschreiben.
- **Klang-Kleckse in der Ecke:** Positionen nie nur einmal beim Mount aus der gemessenen
  Bühnengröße setzen (kann 0×0 sein) → `ResizeObserver`.
- **Bühne beim Öffnen 8 % zu klein gemessen:** Der ResizeObserver meldet sich, während die
  Spielansicht noch hineinzoomt (`transform: scale(0.92)`). Für Größen deshalb
  `clientWidth`/`clientHeight` nehmen, nie `getBoundingClientRect()` — ein Zoom löst keinen
  weiteren Resize aus, der Fehler bliebe die ganze Sitzung.
- **Physik-Spiele (Bälle, Laub) im Preview-Tab:** Ist der Tab verdeckt, steht
  `requestAnimationFrame` still. Für Logik-Tests in der Seite `requestAnimationFrame` durch
  `setTimeout(…, 16)` ersetzen (nur im Test, nicht im Code).
- **`requestAnimationFrame` feuert im versteckten Preview-Tab nicht zuverlässig** →
  Übergänge per Klassen-Toggle nach `void el.offsetWidth` statt rAF.
- **Wisch-Gesten:** Zeit- und Distanz-Schwellen dürfen keine tote Zone zwischen „Tipp"
  und „Wisch" lassen; mit echten Drag-Gesten testen, nicht mit synthetischen Events.

## Befehle

```bash
npm run dev      # Dev-Server (über die Preview-Tools starten, nicht via Bash)
npm run build    # Produktions-Build nach dist/
npm run preview  # Produktions-Build lokal testen (Service Worker aktiv)
npm run deploy   # dist/ auf Branch gh-pages veröffentlichen
```

## Hinweis: Projektpfad & Preview-Server

Das Projekt liegt unter `~/Downloads/outputs/spielkiste` (nicht direkt `~/Downloads/spielkiste`),
weil der Preview-Server-Spawn-Mechanismus (`preview_start` mit `name`) nur im
`outputs`-Baum sicher funktioniert. Falls `preview_start {name: "spielkiste-dev"}`
mit einem `getcwd`/`EPERM`-Fehler scheitert (Sandbox-Problem, betraf in der
Build-Session auch andere, längst funktionierende Configs): Workaround ist, den
Dev-Server selbst per `Bash` im Hintergrund zu starten
(`nohup npm run dev -- --port 5173 --strictPort > /tmp/spielkiste-dev.log 2>&1 &`)
und dann `preview_start` mit `{url: "http://localhost:5173/spielkiste/"}` statt
`{name: ...}` aufzurufen, um nur den Browser-Tab zu öffnen.

# Spielkiste — Projektregeln für Claude

Dies ist eine Offline-PWA-Spiel-App für ein 2-jähriges Kind (iPad).
**Der komplette Arbeitsauftrag steht in [docs/BUILD-AUFTRAG.md](docs/BUILD-AUFTRAG.md)**
— zuerst lesen, dann Phase für Phase abarbeiten.
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

## Befehle

```bash
npm run dev      # Dev-Server (über die Preview-Tools starten, nicht via Bash)
npm run build    # Produktions-Build nach dist/
npm run preview  # Produktions-Build lokal testen (Service Worker aktiv)
npm run deploy   # dist/ auf Branch gh-pages veröffentlichen
```

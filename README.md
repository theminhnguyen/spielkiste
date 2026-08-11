# Spielkiste 🧸

Eine ruhige, werbefreie Spiel-App für 2-Jährige — inspiriert von den Design-Prinzipien
von Pok Pok (Montessori, low-stimulation, open-ended play), aber komplett eigenständig
umgesetzt mit eigenen Grafiken und Sounds.

**Status: Fertig (v1.0.0)** — alle Phasen aus [docs/BUILD-AUFTRAG.md](docs/BUILD-AUFTRAG.md)
abgeschlossen. Spielzimmer + 9 Spielzeuge (Fummelbrett, Klang-Kleckse, Malen,
Formen-Sortierer, Seifenblasen, Putzen, Sticker-Szene, Wimmelbild,
Gute-Nacht-Szene), komplett offlinefähig, Zustand bleibt gespeichert — auch
praktisch für lange Flüge.

**Live:** https://theminhnguyen.github.io/spielkiste/

**Einrichtung am iPad:** siehe [ELTERN-ANLEITUNG.md](ELTERN-ANLEITUNG.md)
(Installation, Flugmodus-Test, Geführter Zugriff).

## Eckdaten

| | |
|---|---|
| Zielgerät | iPad (Safari → „Zum Home-Bildschirm") |
| Zielgruppe | 2 Jahre (ohne Lesen, ohne Sprache) |
| Offline | Ja, komplett (Service Worker, keine Serveranbindung) |
| Kosten | 0 € (GitHub Pages, keine Accounts, keine Werbung, kein Tracking) |
| Technik | PWA — Vite + TypeScript, SVG/Canvas, Web Audio (synthetisierte Sounds) |

## Dokumente

- [ELTERN-ANLEITUNG.md](ELTERN-ANLEITUNG.md) — Installation am iPad, Flugmodus-Test, Geführter Zugriff
- [docs/RECHERCHE-POKPOK.md](docs/RECHERCHE-POKPOK.md) — Wie Pok Pok funktioniert (Recherche mit Quellen)
- [docs/PLAN.md](docs/PLAN.md) — Produkt- und Technikplan für den Nachbau
- [docs/BUILD-AUFTRAG.md](docs/BUILD-AUFTRAG.md) — Arbeitsauftrag für die Build-Session (Sonnet 5): Phasen, Tests, Definition of Done

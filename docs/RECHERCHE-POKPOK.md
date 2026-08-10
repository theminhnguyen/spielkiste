# Recherche: Wie funktioniert Pok Pok?

Stand: 2026-08-10. Zusammengetragen aus Hersteller-Seite, App-Store-Eintrag und
unabhängigen Reviews (Quellen unten).

## Was ist Pok Pok?

Pok Pok („Pok Pok | Montessori Preschool", früher „Pok Pok Playroom") ist eine
Apple-Design-Award-prämierte iOS/Android-App für Kinder von 2–7 Jahren. Sie versteht
sich nicht als Spielesammlung, sondern als **digitales Spielzimmer**: eine Sammlung
von „digitalen Spielzeugen", die Kinder frei und ohne Ziel erkunden. Abo-Modell,
keine Werbung, COPPA-konform, keine Datenweitergabe an Dritte.

## Die Kern-Designprinzipien

Das ist der eigentliche Wert der App — und das, was wir nachbauen wollen:

1. **Open-ended play (Montessori):** Keine Level, kein Gewinnen/Verlieren, keine
   Aufgaben, keine Belohnungen, keine Fortschrittsbalken. Kinder experimentieren im
   eigenen Tempo und können nichts falsch machen — jedes Spielzeug reagiert auf viele
   Arten sinnvoll.
2. **Low stimulation:** Keine grellen Farben, keine Blinkeffekte, keine lauten
   Dopamin-Feedback-Loops. Handgezeichnete Optik, gedeckte Farben, **langsame
   Animationen**, leise handaufgenommene Geräusche. Bewusst ruhig, um nicht zu
   überreizen.
3. **Keine Sprache, kein Text:** Die Kinder-UI kommt komplett ohne Wörter aus —
   funktioniert in jedem Alter und jeder Sprache, kein Lesen nötig.
4. **Keine Menüs:** Kinder sehen nie ein Menü, eine Werbung oder einen Kaufdialog —
   nur Spielzeuge.
5. **Ursache & Wirkung:** Alles reagiert sofort und nachvollziehbar auf Berührung —
   tippen, ziehen, wischen, drehen. Genau richtig für 2-Jährige (Feinmotorik,
   Ursache-Wirkung, sensorische Erkundung).

## Navigation

- Startbildschirm = das **Spielzimmer**: Die Spielzeuge liegen als große Objekte da,
  Antippen öffnet sie (mit Zoom-Übergang).
- Zurück geht es über einen **großen, dauerhaft sichtbaren, sanft pulsierenden Kreis
  oben links** — ein einziges, immer gleiches Navigationselement.
- Reviews berichten, dass schon sehr junge Kinder die App ohne jede Erklärung bedienen.

## Die Spielzeuge (Auswahl)

Die sechs Original-Spielzeuge zum Launch, später stetig erweitert:

| Spielzeug | Funktionsweise |
|---|---|
| **Busy Board** | Fummelbrett mit Schaltern, Schiebern, Drehknöpfen, Knöpfen — drücken, kneifen, schieben, schnipsen. Reines Ursache-Wirkung-Spielzeug, der Liebling der Kleinsten. |
| **Musical Blobs** | Weiche Formen, die man über die Fläche zieht; beim Antippen und Zusammenstoßen entstehen sanfte Töne. |
| **Drawing** | Freies Fingermalen mit dicken Strichen und ruhiger Farbpalette. |
| **Silly Blocks** | Alberne Bausteine zum Stapeln und Umwerfen, mit Wackel-Animationen. |
| **Busy Book** | Wimmelbuch-Seiten mit vielen kleinen berührbaren Details. |
| **Town** | Vereinfachte Stadt (Laden, Post, Feuerwehr, Spielplatz, Fluss, Bauernhof …), in der Figuren und Fahrzeuge bewegt werden. |

Spätere Erweiterungen: House, Islands, Radio, Marble Machine, Sequencer, Shapes,
World Puzzle, Dinosaurs u. a. — plus (im „Montessori Preschool"-Rebrand) Lern-Toys
wie Phonics und Number Journey für ältere Kinder.

## Was davon für eine 2-Jährige relevant ist

Für Alter 2 tragen vor allem: **Busy Board** (Ursache-Wirkung, Feinmotorik),
**Musical Blobs** (sensorisch, klingt immer harmonisch), **Drawing** (Kritzelphase)
und **Silly Blocks** (stapeln/umwerfen). Town und Busy Book entfalten sich eher ab
3–4 Jahren. Wichtig außerdem: 2-Jährige patschen mit der ganzen Hand → die App muss
**Multi-Touch tolerieren**, ohne kaputtzugehen.

## Technischer Nebenfund (wichtig für unseren Offline-Ansatz)

Safaris 7-Tage-Löschregel für Website-Daten gilt **nicht** für Web-Apps, die auf dem
Home-Bildschirm installiert sind — deren Speicher (Service-Worker-Cache, localStorage)
bleibt dauerhaft erhalten ([WebKit-Blog](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)).
Damit ist eine PWA als dauerhafte Offline-Kinder-App auf dem iPad tragfähig.

## Quellen

- Hersteller: [playpokpok.com](https://playpokpok.com/) · [FAQ](https://playpokpok.com/faqs/)
- [App Store: Pok Pok | Montessori Preschool](https://apps.apple.com/us/app/pok-pok-montessori-preschool/id1550204730)
- [MacStories: „A Delightful Digital Toybox for Kids"](https://www.macstories.net/reviews/pok-pok-playroom-a-delightful-digital-toybox-for-kids/)
- [9to5Mac: Hands-on mit Pok Pok Playroom](https://9to5mac.com/2021/05/20/hands-on-with-pok-pok-playroom-kids-app/)
- [Common Sense Media Review](https://www.commonsensemedia.org/app-reviews/pok-pok-playroom)
- [Educational App Store Review](https://www.educationalappstore.com/app/pok-pok)
- [GamerDad Review](http://www.gamerdad.com/blog/2021/06/09/pok-pok-playroom-mobile/)
- [SuperParent-Interview mit den Machern](https://www.superparent.com/pok-pok-playroom-lets-kids-create-their-own-fun-on-mobile-with-open-ended-toys-interview/)
- [parent.tech Review](https://www.parent.tech/p/review-pok-pok-the-calm-creative-kids-game-collection-every-parent-needs-to-know-about)
- [TechCrunch: Series A / Android-Launch](https://techcrunch.com/2024/06/18/now-a-series-a-startup-kids-app-and-digital-toy-pok-pok-is-coming-to-android)

## Rechtlicher Rahmen für den Nachbau

Wir bauen **die Prinzipien** nach (ruhig, offen, ohne Text — Ideen sind nicht
geschützt), aber mit **eigenem Namen, eigenen Grafiken, eigenen Sounds**. Nichts aus
der Pok-Pok-App wird kopiert oder nachgezeichnet. Die App ist privat für die eigene
Familie.

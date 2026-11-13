# Changelog B_77 Website

## 2026-11-13 · Startseite: Copy-Feinschliff

Drei sichtbare Textstellen der Startseite angepasst, keine Struktur-, Technik-
oder SEO-Änderung.

- Intro-Ladeanzeige: "VERTRIEB IN BEWEGUNG" wird zu "VERTRIEB IN AKTION".
- Hero-Zeile ohne Standort-/Jahreszusatz: "Vertriebsberatung für den Mittelstand." (Siegen und "seit 2017" bleiben in Meta-Tags, Menü-Fußzeile und Claims-Band erhalten).
- Haltungs-Absatz neu formuliert, Highlight von "Marktanteil" auf "Anteil am Markt".

## 2026-11-09 · Relaunch der Marketing-Seiten

Neues Erscheinungsbild für Startseite und alle 42 Unterseiten. Inhalt, Farbwelt
und Schriftcharakter bleiben, der Auftritt wird moderner und ganzflächig, Fokus
auf der Leistung statt auf dem Bürobild. Das Intro bleibt erhalten.

- Helles Kachel-Layout, Satoshi als Hausschrift, Neon #E5FF00 nur auf dunklen Flächen, auf Hell neutrales Grau.
- Startseite mit scroll-gebundenem Hero (Kollaps in den Neon-Punkt), rotierende Frontal-Turbine im Credo, Count-up-Zahlen, Future-of-Sales mit 3D-Roboter.
- Intro-Overlay mit Failsafe: `<noscript>`-Ausblendung, Guard gegen schwarzen Blocker ohne JS/Config, `prefers-reduced-motion` überspringt die Animation.
- DSGVO: Schriften lokal (17 woff2, kein Fontshare/Google-Abruf), Smooth-Scroll (Lenis) lokal, Spline-Roboter samt WASM lokal, keine Tracker, keine externen Ladereferenzen.
- SEO: `noindex` von der Startseite entfernt, vollständige Heads (canonical, description, OG/Twitter, OG-Bild, Favicon) auf allen 43 Seiten, saubere Clean-URLs über `vercel.json`.
- Sprache: keine langen Gedankenstriche als Pause, Floskel "aus einer Hand" ersetzt.

Infrastruktur unverändert (`vercel.json`, `middleware.js`, `api/`, Kundenmappen).

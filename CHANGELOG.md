# Changelog B_77 Website

## 2026-11-14 · Lokale SEO Phase 3: Umland-Stadtseiten vertieft

Elf Stadtseiten im Siegener Einzugsgebiet von nahezu wortgleichen Vorlagen
(Doorway-Risiko, rund 60 Prozent Textüberschneidung) auf eigenständige, lokal
belegte Inhalte umgebaut. Keine Design-, Schema- oder Strukturänderung, nur der
sichtbare Inhalt je Stadt.

- Überarbeitet: Kreuztal, Hilchenbach, Attendorn, Netphen, Bad Berleburg, Lennestadt, Olpe, Dillenburg, Gummersbach, Meschede, Arnsberg.
- Je Seite echte regionale Substanz (reale Branchencluster und prägende Industrie als Regionskontext, nicht als Kundenbehauptung), stadtspezifische Abschnittsüberschriften und FAQ, aufgebrochenes statt templatehaftes Textgerüst.
- Sachliche Altfehler behoben: verstümmelte Geografie und Entfernungen, "Schwarzwald-Tempo" (Hilchenbach), falsche Branche "Optik/Feinmechanik" für Dillenburg (gehört nach Wetzlar), falsch verortete Firma (Gummersbach).
- Zweifach durch das Critic-Gate (ss-critic) geführt (Pilot und Ausroll), Fakten je Stadt geprüft. Sie-Form, kein Em-Dash, Design-System und strukturierte Daten unverändert.

## 2026-11-14 · Impressum und Datenschutz vervollständigt

- Impressum: Handelsregister ergänzt (Amtsgericht Siegen, HRB 13092), Pflichtangabe für die GmbH nach § 5 TMG.
- Datenschutz: Hosting-Anbieter benannt (Vercel Inc., USA) samt USA-Übermittlung und EU-Standardvertragsklauseln; Rechtsgrundlagen für Server-Logfiles (Art. 6 Abs. 1 lit. f) und Kontaktanfragen (lit. b bzw. f) ergänzt; zuständige Aufsichtsbehörde (LDI NRW) genannt.

## 2026-11-13 · GA4 mit Consent-Banner, SEO-Auszeichnung, 2 Artikel

Der bislang nur lokal (uncommitted) gepflegte Consent-/GA4- und SEO-Umbau ist
jetzt im Repo, damit git-basierte Deploys ihn nicht mehr entfernen. Entspricht
dem bereits live getesteten Stand auf www.b77.de.

- Webanalyse: Google Analytics 4 (G-N6KF1KY957), ausschließlich nach aktiver Einwilligung. Eigenes Dark-Consent-Banner (`assets/b77-consent.js`), gleichwertiges "Ablehnen", gtag.js lädt erst nach "Akzeptieren", Wahl in localStorage, Widerruf jederzeit über die Cookie-Einstellungen. Ersetzt das alte, ungated `css/analytics.js` (entfernt).
- Datenschutz: Impressum um den GA4-Abschnitt ergänzt (Google Ireland, EU-US DPF, Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG) samt Widerruf-Link, Stand November 2026.
- SEO: schema.org JSON-LD (ProfessionalService/Service/WebSite) auf allen Seiten, 2 neue Fachartikel (Vertrieb auslagern oder aufbauen, Interim-Vertriebsleitung) mit Verlinkung und sitemap.xml.
- Future-of-Sales-Roboter: Safari-Poster-Fix (`robot-still.v2.jpg`, Karte auf #000).

Die Zeile "keine Tracker" aus dem Eintrag vom 2026-11-09 gilt damit nicht mehr;
GA lädt aber weiterhin nur nach aktiver Zustimmung.

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

# Changelog B_77 Website

## 2026-11-16 · Trailer: Satz in Szene 4 neu formuliert

Szene 4 sagt jetzt „Wir haben lange von diesem Erbe profitieren können.“ Die Zeile ist neu eingesungen. Quelle, Lesefassung und Trailer sind angeglichen.

## 2026-11-15 · Sicherheit: Content-Security-Policy, Google Fonts entfernt, Trailer-Quelle im Repo

Alle Seiten bekommen eine Content-Security-Policy (Stufe 1), die fremde Skripte, Verbindungen und Einbettungen sperrt. Die Mahlo-Seiten laden Schriften lokal statt von Google. Die Quelle des Trailers liegt in `trailer-quelle/` und wird nicht ausgeliefert.

## 2026-11-15 · Trailer: KI-Hinweis, neue Zeile 2, nur der Film

Der Trailer zeigt den Hinweis „KI-generierte Bilder und Stimme“ dezent oben links und in der Endkarte. Zeile 2 spricht „Weltmarktführer“, mit neuer Tonaufnahme. Die Lesefassung mit internen Notizen entfällt auf der Live-Seite.

## 2026-11-15 · Trailer: sichtbarer Ton-Hinweis

Blockiert der Browser den Ton ohne vorherigen Klick, zeigt der Trailer oben einen pulsierenden Hinweis „Ton an: einmal tippen“. Ein Tipp irgendwo schaltet den Sprecher sofort mit der aktuellen Zeile ein und blendet den Hinweis aus. Erlaubt der Browser Ton, erscheint kein Hinweis.

## 2026-11-15 · Trailer startet immer sofort

Kein Abspiel-Knopf mehr: Der Trailer startet immer von selbst. Blockiert der Browser Ton ohne Klick, läuft der Film trotzdem, und der Sprecher setzt beim ersten Klick, Tippen oder Tastendruck mit der aktuellen Zeile ein.

## 2026-11-15 · Trailer: Ton standardmäßig an

Der Sprecherton im Trailer ist jetzt von Anfang an eingeschaltet und lässt sich über den Schalter oben rechts ausschalten. Erlaubt der Browser keinen Ton ohne Klick (Safari, iPhone), startet der Film nicht stumm, sondern zeigt „Film mit Ton abspielen ▶“ und läuft nach dem Klick mit Ton.

## 2026-11-15 · Trailer „Ärmel hoch“ unter /trailer

Das Manifest-Intro als eigenständige Seite b77.de/trailer: sechs Bildszenen,
optional mit Sprecherton (standardmäßig aus), Endkarte mit Logo und Claim.

- Neuer Ordner `trailer/` mit nur den benötigten Dateien (6 Bilder, Logo, 6 lokale Schriften, 6 Tonspuren), keine externen Einbindungen, nicht in der sitemap.
- Endkarte mobil korrigiert: Logo steht mittig über dem Claim. Kopfleiste mit Link zur Startseite und zum Impressum.

## 2026-11-15 · SEO Phase 4, Welle 1: Ratgeber-Hub und 5 Fachartikel

Start der nationalen Content-Offensive. Die Pillar-Seite /vertriebsberatung wird
zum Hub, der auf einen wachsenden Ratgeber verlinkt, plus fünf neue Fachartikel
mit echter Vertriebspraxis statt Füllstoff.

- Neue On-Site-Artikel (BlogPosting-Schema, Breadcrumb auf die passende Leistungsseite, interne Verlinkung): "Was kostet eine Vertriebsberatung?", "Woran erkennt man eine gute Vertriebsberatung?", "Vertriebsberatung, Training oder Interim: was wann passt", "Vertrieb im Mittelstand aufbauen: Schritte und Fehler", "Aktiver Vertrieb statt Warten auf Anfragen".
- Pillar /vertriebsberatung um einen Ratgeber-Hub ergänzt, der Autorität an die Artikel verteilt; die 5 URLs in sitemap.xml aufgenommen.
- Durch das Critic-Gate (ss-critic) geführt: PASS auf Substanz, Nacharbeit am Handwerk (einheitliche Anführungszeichen, Kachel-Rhythmus) erledigt. Sie-Form, kein Em-Dash.

## 2026-11-15 · Lokale SEO: 9 große und fernere Stadtseiten (Hybrid)

Die neun verbleibenden Stadtseiten außerhalb des Siegener Umlands von der alten
Doorway-Vorlage auf eine ehrliche Hybrid-Lösung umgebaut. Nur sichtbarer Inhalt
je Stadt, keine Design-, Schema- oder Strukturänderung.

- Echte Lokalseiten mit verifiziertem Industrieanker: Dortmund (Wilo), Wuppertal (Knipex, Bayer), Wetzlar (Optik/Leica), Hagen (C.D. Wälzholz), Iserlohn (Märkischer Metallcluster), Marburg (Pharma/Life-Sciences).
- Ehrlich überregional statt vorgetäuschtem Standort: Köln, Düsseldorf, Bonn (realer Marktkontext, Positionierung "aus Siegen, überregional", kein fingiertes lokales Büro).
- Altfehler behoben: falsche Entfernungen und Branchen (Hagen "Batterietechnik", Düsseldorf "130 km"), unehrliche Nähe-Behauptung und Meta-"ganz nah dran", unbelegte "über 25 Jahre Erfahrung", Hagen "gehört zu Südwestfalen" (ist kreisfrei).
- Durch das Critic-Gate (ss-critic) geführt: PASS nach Nacharbeit (Fakten, Ehrlichkeit, Doorway-Fingerabdruck). Sie-Form, kein Em-Dash, Design und strukturierte Daten unverändert.

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

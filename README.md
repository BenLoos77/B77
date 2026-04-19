# b77.de — Vertriebsberatung Siegen

Modernes Redesign der B_77 Webseite mit drei Themes und automatischem Tag/Nacht-Wechsel
sowie WM-Edition während der Fußball-WM 2026.

## Struktur

```
.
├── index.html                    Startseite
├── ueber.html                    Über B_77 (mit Portrait)
├── vertriebsberatung.html        SEO-Landingpage Vertriebsberatung
├── vertriebsoptimierung.html     Leistung 1 – Strategie & Struktur
├── aktiver-vertrieb.html         Leistung 2 – Umsetzung im Markt
├── vertriebsaufbau.html          SEO-Landingpage Vertriebsaufbau
├── neukundengewinnung.html       SEO-Landingpage Neukundengewinnung
├── blog.html                     Blog-Übersicht
├── blog-vorm-wind.html           Beispiel-Artikel
├── kontakt.html                  Kontakt + Formular
├── impressum.html                Impressum & Datenschutz
├── css/
│   ├── styles.v2.css             Zentrales Stylesheet
│   ├── scripts.v2.js             Theme-Toggle + Spielkalender
│   └── analytics.js              GA4 + Cookie-Consent
├── assets/                       Logos, Portrait, Pixel-Flagge
├── sitemap.xml
├── robots.txt
└── vercel.json                   Clean URLs + Caching
```

## Google Analytics 4 aktivieren

1. analytics.google.com → einloggen → Konto anlegen
2. Property "B_77" (Zeitzone Berlin, EUR)
3. Datenstream "Web" → URL https://b77.de
4. Mess-ID kopieren (Format G-XXXXXXXXXX)
5. In css/analytics.js Zeile 9 den Platzhalter ersetzen:
     const GA_MEASUREMENT_ID = 'G-DEINE_ECHTE_ID';
6. git commit && git push → Vercel deployt automatisch

GA wird erst nach "Akzeptieren" im Cookie-Banner geladen. DSGVO-konform.

## Google Search Console

1. search.google.com/search-console → Property hinzufügen
2. URL-Präfix: https://b77.de
3. Verifizieren (HTML-Meta-Tag oder DNS bei IONOS)
4. Sitemap einreichen: https://b77.de/sitemap.xml

## Google Business Profile

1. business.google.com → Unternehmen hinzufügen
2. Name: B_77 Vertriebsberatung
3. Kategorie: Unternehmensberater
4. Adresse: Wallhausenstraße 1, 57072 Siegen
5. Servicegebiet: NRW, Hessen, deutschlandweit
6. Verifizierung per Postkarte (5-14 Tage)

## SEO drin

- Title, Description, Keywords pro Seite
- Open Graph + Twitter Cards
- JSON-LD Structured Data (ProfessionalService Siegen)
- Canonical-URLs
- Sitemap + robots.txt
- Clean URLs via Vercel

## Spielkalender pflegen

In css/scripts.v2.js → MATCHES-Array → score: [2, 1] eintragen.

## Impressum

Noch zu ergänzen: Umsatzsteuer-ID (aktuell DE XXX XXX XXX)

## Theme-Automatik

- WM-Zeitraum (11.06.-19.07.2026): WM-Edition Default
- Außerhalb, Berliner Zeit:
  - 07:00-20:00 → Light
  - 20:00-07:00 → Dark
- Manueller Klick überschreibt Automatik

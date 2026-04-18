# b77.de — Vertriebsberatung Siegen

Modernes Redesign der B_77 Webseite mit drei Themes:
- **Dark** (Default)
- **Light**
- **WM** (Edition zur Fußball-WM 2026 mit Spielkalender)

Während der WM (11.06.–19.07.2026) schaltet die Seite automatisch in den WM-Modus,
sofern der Besucher noch keine eigene Theme-Wahl getroffen hat.

## Aufbau

```
.
├── index.html                    Startseite
├── ueber.html                    Über B_77
├── vertriebsoptimierung.html     Leistung 1
├── aktiver-vertrieb.html         Leistung 2
├── blog.html                     Blog-Übersicht
├── blog-vorm-wind.html           Beispiel-Artikel
├── kontakt.html                  Kontakt + Formular
├── impressum.html                Impressum & Datenschutz
├── css/
│   ├── styles.css                Zentrales Stylesheet
│   └── scripts.js                Theme-Toggle + Spielkalender
├── assets/                       Logos + Pixel-Flagge
└── vercel.json                   Vercel-Konfiguration
```

## Deployment auf Vercel

### Option 1: Via GitHub

1. Repository auf GitHub pushen
2. Auf [vercel.com](https://vercel.com) einloggen
3. "Add New Project" → GitHub-Repo auswählen
4. Framework Preset: **Other** (es ist reines HTML/CSS/JS)
5. Build-Settings leer lassen (keine Build-Schritte nötig)
6. "Deploy" klicken

Vercel erkennt die `vercel.json` automatisch und aktiviert saubere URLs
(z. B. `/kontakt` statt `/kontakt.html`).

### Option 2: Direkt mit Vercel CLI

```bash
npm i -g vercel
cd b77-deploy
vercel
```

### Custom Domain

Nach dem Deploy unter "Settings → Domains" die Domain `b77.de` hinzufügen
und den CNAME-Eintrag bei deinem Registrar auf `cname.vercel-dns.com` setzen.

## Spielkalender pflegen

Alle Spieldaten stehen in `css/scripts.js` im Array `MATCHES`.

**Ergebnis nachtragen:**
```javascript
{ g:'E', home:'GER', away:'CUR', date:'2026-06-14', time:'19:00',
  venue:'NRG Stadium', city:'Houston', de:true,
  score: [3, 1]   // ← hinzufügen: Endstand 3:1
}
```

**K.o.-Paarung ergänzen:** `home:'TBD', away:'TBD'` durch echte Ländercodes ersetzen.

## Kontaktformular

Das Formular auf `kontakt.html` zeigt aktuell nur eine JS-Alert-Nachricht. Für einen
echten Mail-Versand empfehle ich:

- [Formspree](https://formspree.io) (kostenlos bis 50 Mails/Monat)
- [Netlify Forms](https://www.netlify.com/products/forms) falls Hosting auf Netlify
- Vercel Serverless Function mit Nodemailer/Resend

Dazu in `kontakt.html` das `<form>`-Tag anpassen:
```html
<form action="https://formspree.io/f/DEIN_KEY" method="POST" class="contact-form">
```
und den `onsubmit`-Handler entfernen.

## Impressum-Daten

In `impressum.html` müssen noch ergänzt werden:
- Umsatzsteuer-ID

## Lizenz

Privat. Alle Rechte bei Benjamin Loos / B_77.

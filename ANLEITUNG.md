# B_77 Update — Quoodix + Sales Intelligence + Cyan-Migration

## Was sich ändert

1. **NEU:** Sales-Intelligence-Anteaser (Magazin) — direkt nach Quoodix-Block
2. **GEÄNDERT:** Vertriebs-Check-Teaser — Rot wird durch Cyan ersetzt
   (Rot ist nicht in der B_77-Markenwelt — Cyan kommt von Quoodix
   und Sales Intelligence)
3. **GEÄNDERT:** Easter-Egg-Button (67) — Cyan statt Rot

## Was zu tun ist

### 1. index.html ersetzen
Die index.html aus diesem Paket auf GitHub hochladen — überschreibt die alte.
Sales-Intelligence-Anteaser ist bereits eingebaut, Cache-Buster auf v=20260509a.

### 2. CSS in styles.v2.css ergänzen
Drei CSS-Dateien sind in diesem Paket. Alle drei Inhalte ans ENDE deiner
`css/styles.v2.css` anhängen, in dieser Reihenfolge:

  1. **`quoodix-styles.css`** (falls noch nicht drin)
  2. **`sales-intelligence-styles.css`** (NEU)
  3. **`check-teaser-cyan-override.css`** (überschreibt das Rot mit Cyan)

Falls die `quoodix-styles.css` vom letzten Mal schon drin ist, einfach
nur die anderen beiden ergänzen.

### 3. Commit & Push
Beides committen, Vercel deployt automatisch.

### 4. Im Inkognito testen
Auf b77.de scrollen → zwischen Services und Vertriebs-Check sind jetzt
ZWEI Anteaser-Sektionen: Quoodix (schwarz mit Cyan-Glow) und
Sales Intelligence (cremig-hell mit Cyan-Akzenten).
Vertriebs-Check und 67-Button sind jetzt Cyan statt Rot.

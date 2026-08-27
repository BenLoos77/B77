# B_77 — Identity · Richtung 1 „DER GRUNDSATZ"

**Rebrand 2026 · SEVEN SEVEN │ DESIGN (Ida · ss-identity)**
Territorium: T1 — Der Grundsatz (reduziert · editorial · stille Autorität).
Anriss: **Nachfrage wird gemacht.**

Dateien in diesem Ordner:
`tokens.css` · `wortmarke.svg` · `wortmarke-reversed.svg` · `monogramm.svg` · `specimen.html`

---

## 1. Die Marke

**Die Idee in einem Satz:** Der Unterstrich aus `B_77` ist keine Type — er ist die
**rote Aktiv-Linie**, die tragende Grundlinie, auf der das Lockup steht. Die Lücke
zwischen `B` und `77` hält die Position des Unterstrichs; das Auge rekonstruiert
`B_77` aus dem Grund. Die Linie endet rechts in einem kurzen **Aufstrich** — der
Korrekturmarke der Druckvorstufe: die Aussage ist *aktiv*, nicht dekoriert.

**Signature move:** die rote Grundlinie, mutig eingesetzt — als Boden unter der
Marke, unter jeder Leitaussage (Anriss) und als Emphase-Unterstreichung. Immer
*unter* der Aussage, nie darüber: Nachfrage entsteht auf dieser Basis.

**Fassungen**
- `wortmarke.svg` — primär, Tinte auf transparent.
- `wortmarke-reversed.svg` — negativ, Papier auf Tinte; die Linie bleibt rot.
- `monogramm.svg` — kompakt „B_" (B auf der Aktiv-Linie) für Favicon, App-Icon,
  Avatar, Stempel. Optisch quadratisch.

**Konstruktion / Optik:** Grotesk-Lockup (Ziel **Söhne Medium**), Grundlinie flush
unter dem B-Stamm bis zum Rechtsterminal. Ausrichtung ist **optisch**, nicht
metrisch — die Linie sitzt auf der Schrift-Grundlinie, der Terminal ist bündig mit
der rechten Glyphenkante. Produktions-Master: Glyphen aus der **echten Söhne** in
Pfade wandeln; die im SVG genutzte System-Grotesk (`Helvetica Neue`/Arial) ist der
offline-sichere Platzhalter, **kein** `font-family="var(--…)"` (fällt still auf
Serife zurück).

**Schutzraum:** ringsum ≥ Höhe des `B` (Cap-Height). **Mindestgröße:** Wortmarke
≥ 96 px / 24 mm Breite; Monogramm ≥ 24 px. Darunter Aufstrich weglassen, Linie
bleibt.

---

## 2. Farbe — Papier & Tinte, ein Korrekturzeichen

| Rolle | Token | Hex | Einsatz |
|---|---|---|---|
| Basis / Werkdruck-Papier | `--paper` | `#E7E5DE` | Grundfläche |
| Karte / erhaben | `--card` | `#F5F4F0` | Zitat-Inseln, Panels |
| Tinte / Text | `--ink` | `#1C1B18` | Text, Headlines |
| **Korrekturrot** | `--accent` | `#CE2417` | Aktiv-Linie, Marke, Großtext |
| Rot-Tinte (Text) | `--accent-ink` | `#B01F13` | Rot *wenn* Fließtext-Emphase |
| Hairline / Raster | `--hairline` | `#B8B4AA` | Rules — **nie** Text |
| Meta-Tinte | `--ink-70` | `#514F4A` | Marginalien, Labels |
| Trennlinie | `--border` | `#C9C6BD` | ruhige Rules auf Papier |

**Kontrast (WCAG, geprüft):**
- `ink` auf `paper` — **13.7 : 1** ✓ (Body/AAA)
- `ink` auf `card` — **15.7 : 1** ✓
- `paper` auf `ink` (negativ) — **13.7 : 1** ✓
- `accent #CE2417` auf `paper` — **4.28 : 1** → **nur** Großtext (≥ 24 px/19 px bold)
  & Nicht-Text. Bewusst kein Fließtext.
- `accent-ink #B01F13` auf `paper` — **5.46 : 1** ✓ — die einzige rote Textfarbe.
- `ink-70` auf `paper` — **6.5 : 1** ✓ (Meta).
- `hairline #B8B4AA` auf `paper` — 1.64 : 1 → **niemals** Text, nur Rules.

**Regel:** Das Rot ist Korrektursprache. Es taucht selten und mit Bedeutung auf —
eine Linie, eine unterstrichene Wahrheit. Sitzt es dekorativ, ist es der verbotene
AI-Editorial-Reflex.

---

## 3. Typografie — Klim, journalistische Kraft

| Rolle | Zielschrift (kommerziell) | Web-Substitut (Specimen) |
|---|---|---|
| Display | **Tiempos Headline** (Klim) | **Fraunces** (variabel, `opsz`) |
| Text / Meta | **Söhne** (Klim) | **Inter** |

Beide Zielschriften aus **einem Haus (Klim)** = eine Hand. Fraunces trägt als
Substitut die Redaktionskraft und liefert optisches Sizing; Inter steht für Söhnes
ruhige Neo-Grotesk. Substitute sind **nur** fürs offline-Rendern — im Lizenz-Build
Tiempos + Söhne einsetzen.

**Skala (dramatische Sprünge):** Meta 12 · Caption 13 · **Body 18** · Lead 22 ·
H4 28 · H3 40 · H2 64 · H1 104 · Display `clamp(4rem, 12vw, 11rem)`.
**Laufweite:** Display −0.021em · Head −0.012em · Meta-Versal +0.14em.
**Zeilenhöhe:** Display 0.96 · Body 1.62 · Maß 66–68 ch.
**Ziffern:** `tabular-nums` überall, wo Zahlen fluchten (Kennzahlen, Specs).
**Signature-Headline:** Display-Serife, Gewicht 340, der Anriss steht **auf** der
roten Aktiv-Linie (`.anriss::after`).

---

## 4. Die Grundlinie im System

- Unter jeder Leitaussage: durchgezogene Aktiv-Linie in Korrekturrot,
  Gewicht `--rule-active: 3px` (Text) bzw. `--rule-mark` (Marke). **Immer darunter.**
- Emphase eines Wortes = rote Korrektur-Unterstreichung (`.korr`), **nie** Fettung,
  **nie** Kursiv-Schrei.
- Seiten-Raster: eine durchlaufende Grundlinie (`--rule-baseline`, `--ink-70`),
  an der Kapitelmarken, Marginalien & Seitenzahlen hängen.
- Hairlines/Rules **systematisch**: `--rule-hair` 1px · `--rule-baseline` 2px ·
  `--rule-active` 3px. Keine Ad-hoc-Stärken.

---

## 5. Anwendung

- **Button:** Label steht auf der roten Aktiv-Linie; Hover verstärkt die Linie
  (3 → 6 px), nichts springt. `:focus-visible` = Tinten-Outline, Offset 6 px.
- **Zitat:** Display-Serife auf `--card`-Insel, Quelle als Versal-Meta.
- **Kennzahl:** Display-Serife, `tabular-nums`, Einheit klein in `--accent-ink`;
  Label hängt an einem kurzen roten Grundstrich.

---

## 6. Do / Don't

**Do**
- Rot als Linie/Marke/Korrektur — selten, bedeutungstragend.
- Der Satz groß, ruhig, allein. Type ist der Held.
- Papier warm-grau `#E7E5DE`, nie Creme.
- Optische Ausrichtung; systematische Hairlines; echte „ " – Zeichen.

**Don't**
- ❌ Rot `#CE2417` als Fließtext (4.3 : 1) — dafür `#B01F13`.
- ❌ Aktiv-Linie *über* die Aussage setzen.
- ❌ Emphase durch Bold/Italic statt roter Unterstreichung.
- ❌ Creme `#F4F1EA` + Serife + Terrakotta (AI-Editorial-Reflex, Bible §9).
- ❌ `font-family="var(--…)"` im SVG (still-fallback auf Serife).
- ❌ `#B8B4AA` als Text. Drop-Shadows. Runde Ecken.

---

## 7. Handoff — für UI (Juno) & Front-End (ss-frontend)

Verbindliche Tokens/Fonts aus `tokens.css` — **exakt** übernehmen:

- **Farbe:** `--paper #E7E5DE` · `--card #F5F4F0` · `--ink #1C1B18` ·
  `--accent #CE2417` (Linie/Marke/Großtext) · `--accent-ink #B01F13` (rote
  Textemphase) · `--ink-70 #514F4A` (Meta) · `--hairline #B8B4AA` (nur Rules) ·
  `--border #C9C6BD`.
- **Schrift:** `--font-display` = Fraunces *(Ziel: Tiempos Headline)* mit
  `font-optical-sizing:auto`; `--font-text` = Inter *(Ziel: Söhne)*. Im
  Produktions-Build Tiempos + Söhne lizenzieren und die Stacks vorn ergänzen.
- **Aktiv-Linie:** `--rule-active 3px` (Emphase), `--rule-baseline 2px`,
  `--rule-hair 1px`; Farbe `--accent`. Immer *unter* der Aussage. Emphase-Muster
  = `.korr` (rote Unterstreichung), nicht Bold.
- **Ziffern:** `font-variant-numeric: tabular-nums` bei allen fluchtenden Zahlen.
- **Motion:** `--ease-set` (setzt sich wie im Druck), UI 200 ms, Linien-Reveal
  520 ms; `prefers-reduced-motion` respektieren.
- **Marken-Assets:** `wortmarke.svg` / `-reversed` / `monogramm.svg`; Schutzraum
  = 1× Cap-Height; Mindestbreite Wortmarke 96 px.

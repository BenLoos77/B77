# B_77 · Google Ads Startkit (Search, lokal Siegen)

> Fertig zum Einfügen, sobald das Google-Ads-Konto aktiv ist. Budget ~200 €/Monat → **eine** enge Such-Kampagne, Fokus **Siegen + Umland**. Kein Performance Max.
> Ziel-Landingpage: **https://b77.de/vertriebsberatung-siegen**

---

## 1 · Kampagnen-Einstellungen

| Einstellung | Wert |
|---|---|
| Kampagnentyp | **Suchnetzwerk** (nur Google-Suche, **Displaynetzwerk AUS**) |
| Ziel | Leads / „Ohne Zielvorhaben" |
| Tagesbudget | **6,50 €** (≈ 200 €/Monat) |
| Gebotsstrategie | Start: **Klicks maximieren** mit max. CPC-Limit **2,50 €**. Nach ~15–20 Conversions → **Conversions maximieren / Ziel-CPA** |
| Region | **Siegen + Umkreis 25 km** (Radius-Targeting um 57074). Später: „Personen in diesem Gebiet" (nicht „interessiert an") |
| Sprache | Deutsch |
| Werbezeiten | Mo–Fr 07:00–19:00 (B2B) |
| Netzwerkpartner | AUS |
| Conversion | Nur **„Kontaktanfrage"** als primäres Ziel werten (Rest „sekundär") |

---

## 2 · Anzeigengruppen + Keywords

**Wichtig:** Keywords als **Phrase** `"..."` und **Exact** `[...]` — **kein** Broad Match bei kleinem Budget.

### Anzeigengruppe A — „Vertriebsberatung Siegen"
```
"vertriebsberatung siegen"
[vertriebsberatung siegen]
"vertriebsberater siegen"
[vertriebsberater siegen]
"vertriebsberatung siegerland"
"vertriebsberatung nrw"
```

### Anzeigengruppe B — „Vertrieb Mittelstand / Beratung"
```
"vertriebsberatung mittelstand"
"vertriebsberater mittelstand"
"vertriebsberatung industrie"
"vertriebsberatung b2b"
"externe vertriebsleitung"
"vertrieb optimieren beratung"
```

*(Optional Anzeigengruppe C später: „Vertriebsaufbau", „Neukundengewinnung Beratung" — erst wenn Budget/Daten es hergeben.)*

---

## 3 · Auszuschließende Keywords (Negativliste)
```
-job -jobs -stelle -stellenangebot -gehalt -ausbildung -praktikum -studium
-kostenlos -gratis -vorlage -muster -pdf -definition -bedeutung -wikipedia
-buch -seminar -weiterbildung -ihk -zertifikat -crm -software -tool -gebraucht
-praktikant -werkstudent -teilzeit
```
→ Als **Negativ-Keyword-Liste** „B_77 Grund-Ausschluss" anlegen und für alle Kampagnen nutzen.

---

## 4 · Responsive Search Ad (RSA)

**Finale URL:** `https://b77.de/vertriebsberatung-siegen`
**Angezeigte Pfade:** `/Siegen` · `/Erstgespraech`

### Anzeigentitel (max. 30 Zeichen — 15 Stück)
1. Vertriebsberatung Siegen
2. Vertrieb, der aktiv verkauft
3. B_77 – aus Siegen, für Sie
4. Mittelstand & Industrie
5. Ehrlicher Blick von außen
6. 25+ Jahre Vertriebspraxis
7. Vertrieb systematisch aufbauen
8. Kostenfreies Erstgespräch
9. Vertriebsberater im Siegerland
10. Mehr qualifizierte Termine
11. Vom Zufall zur Systematik
12. Neukunden planbar gewinnen
13. Vertriebsberatung Mittelstand
14. Vor Ort in Siegen
15. Jetzt Erstgespräch sichern

### Textzeilen (max. 90 Zeichen — 4 Stück)
1. Externe Vertriebsberatung für den Mittelstand in Siegen & Umgebung. Klar, ehrlich, umsetzbar.
2. Wir bauen Ihren Vertrieb systematisch auf: Strategie, Neukunden, aktive Marktbearbeitung.
3. Aus über 25 Jahren Praxis – direkt vor Ort im Siegerland. Kostenfreies Erstgespräch vereinbaren.
4. Schluss mit Verkaufen unter Wert. Mehr Termine, sauberere Pipeline, planbare Abschlüsse.

> Tipp: 1–2 Titel **anpinnen** (Position 1: „Vertriebsberatung Siegen"), Rest frei rotieren lassen.

---

## 5 · Assets / Erweiterungen (alle anlegen — steigern Qualität & CTR)

**Sitelinks:**
- Leistungen → https://b77.de/leistungen
- Vertriebsaufbau → https://b77.de/vertriebsaufbau
- Neukundengewinnung → https://b77.de/neukundengewinnung
- Über B_77 → https://b77.de/ueber

**Callouts:** Kostenfreies Erstgespräch · 25+ Jahre Praxis · Mittelstand & Industrie · Vor Ort in Siegen · Ehrlich & umsetzbar

**Snippets:** Typ „Dienstleistungen" → Vertriebsstrategie, Vertriebsaufbau, Neukundengewinnung, Vertriebsoptimierung, Interim-Vertriebsleitung

**Anruferweiterung:** +49 271 89027837 (Mo–Fr 08:30–18:00)
**Standort:** via Google Business Profile verknüpfen (sobald angelegt)

---

## 6 · Reihenfolge zum Scharfschalten
1. Conversion-Tracking steht (send_to in `css/analytics.js` eingetragen, deployt) ✅ Voraussetzung
2. Kampagne + Anzeigengruppen + Keywords + Negativliste anlegen
3. RSA + alle Assets einfügen
4. Region + Budget + Gebot „Klicks maximieren"
5. **Kampagne zunächst nur kurz live** → nach 1–2 Wochen: Suchbegriffe-Bericht prüfen, schlechte Terms als Negativ ergänzen
6. Ab ~15–20 Conversions → Gebotsstrategie auf **Conversions** umstellen

---

## Offene Voraussetzungen (Nutzer)
- [ ] Google-Ads-Konto aktivieren (pausierte Kampagne + Zahlungsprofil)
- [ ] Conversion-Aktion „Kontaktanfrage" → `send_to`-Wert an B_77-Setup geben
- [ ] Google Business Profile Siegen (für Standort-Asset & Local SEO)
- [ ] Kontaktformular an Backend anbinden (Brevo o. ä.), damit Leads real ankommen

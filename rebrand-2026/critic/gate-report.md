# Gate-Report — Rebrand B_77 2026 · drei CI-Richtungen
**Critic:** Ruth (Design Critic, QA-Gate) · SEVEN SEVEN │ DESIGN
**Prüfung:** adversarial gegen Strategie-Spine „Nachfrage wird gemacht.", Hauser-Lacour-Latte, AI-Optik-Verbot, Kontrast.
**Stand:** intern — vor Vorlage an Ben.

---

## Richtung 1 — DER GRUNDSATZ · **PASS**
Papier/Tinte + Korrekturrot, Tiempos/Söhne, Operator-Portrait. On-Brief: die rote Aktiv-Linie IST der ausgezogene Unterstrich, trägt (steht unter der Aussage), ist nicht Deko. Eigenständig ggü. R2/R3 (Serife, warmes Papier, Mensch statt Maschine). Kontrast sauber: Tinte #1C1B18 auf Papier #E7E5DE ≈ 13:1; Token trennt korrekt --accent #CE2417 (nur Linie/Großtext, ≈4.3:1) von --accent-ink #B01F13 (Textrot, 5.5:1). Keine AI-Tells im Bild. Kein Block.

Polish (nicht gate-blockend):
1. imagery/richtung-1.jpg — Brief wollte „Blick knapp an der Kamera vorbei, kein Stockfoto-Lächeln". Mann blickt frontal, leichtes Lächeln. Nächste Runde: Blick abwenden, Mimik neutralisieren.
2. #CE2417 darf nie normale Textgröße werden (4.3:1 < 4.5). Token ist richtig gebaut — beim Build durchhalten.

---

## Richtung 2 — DIE OFFENSIVE · **REWORK**
Graphit + Zündungs-Orange, GT America Compressed, Getriebe-Makro. Konzept trägt, Kontrast im Token sauber (Off-White auf Base 16:1). ABER ein Craft-Block in der Wortmarke:

1. **wortmarke.svg — Lockup bricht auseinander.** Das „B" endet bei x≈158, die erste „7" beginnt erst bei x=560: ein Innenraum von ~400 Einheiten gegen eine Glyphenbreite von 118. Ergebnis liest als „B  …  77", zwei getrennte Elemente, nicht als EIN Mark. Der Unterstrich ist eine Zeichenbreite, kein Halbmeter Leere. **Fix:** 77 nach links rücken, Innenabstand auf ~1 Glyphenbreite (Unterstrich-Maß) ziehen, Traktionslinie entsprechend kürzen. Ohne das steht R2 im Vergleich unfair „ungebaut" da.

Watch (dem CD/Ben transparent machen, kein Block):
2. imagery/richtung-2.jpg — fotoreal und premium, aber der literale Erst-Zug: „MOTOR" → Foto eines Motors. Liest als Automotive/Aggregat, nicht sofort als Vertrieb; das Risiko-Doc benennt es selbst. Handwerklich kein AI-Tell (Bild ist sauber, nur ein paar rote Streu-Bokeh rechts). Sollte Ben bewusst als „Metapher, nicht Auto" vorgelegt bekommen.

---

## Richtung 3 — DIE VERTRIEBSINTELLIGENZ · **REWORK**
Diatype-Mono, Achse mit Tick-Marken, veredeltes Lime. Stärkstes, distinktivstes Unterstrich-System (vermessene Achse + Passer + lebender Wert). Token-Hygiene vorbildlich (Lime nie Text, immer Fläche mit Graphit-Ink 14:1; Cyan/Rot nur Raster). ABER der Gate-Hero fällt genau in Bens Allergie:

1. **imagery/richtung-3.jpg — gravierte Mikro-Schrift ist AI-Kauderwelsch.** „SO Al", „9V4E", gespiegelte/zerbrochene Glyphen — der klassische KI-Fake-Text-Tell, und das ausgerechnet in der Richtung, deren Risiko „am nächsten an Bens AI-Optik-Allergie" ist. Für ein Gate-Hero nicht tragbar. **Fix (schnellster Weg):** eng auf die Lime-/Schieberegler-/Achsen-Zone croppen, sodass keine lesbar-gemeinte Gravur mehr im Bild ist; sonst textfrei neu rendern (Skala nur als Ticks, keine Wort-Gravur). Bis dahin nicht vor Ben.

Watch:
2. Bild-Grün zieht ins Chartreuse und ist heller/greller als Token-Lime #DCF500 — beim Neu-Render Richtung Token ziehen, damit es als Messwert liest, nicht als „Gamer-RGB".

---

## GESAMTURTEIL — bereit fürs Gate: **NEIN (noch nicht)**
Craft-Niveau, Eigenständigkeit und Kontrast halten über alle drei. Zwei kleine, konkrete Fixes stehen zwischen jetzt und einer fairen Vorlage an Ben:

**Kürzeste Fix-Liste:**
1. **R3-Hero** croppen auf die Lime-/Achsen-Zone (garbled Gravur raus) — oder textfrei neu rendern. *(ss-image)*
2. **R2-Wortmarke** enger setzen: Innenabstand B↔77 auf ~1 Glyphenbreite, Traktionslinie kürzen. *(ss-identity)*

Danach: gate-ready. R1 ist bereits vorlagefähig.

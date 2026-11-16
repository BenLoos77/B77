# Trailer-Quelle „Ärmel hoch“

Quelle für b77.de/trailer. Dieser Ordner wird **nicht** ausgeliefert (siehe `.vercelignore`).

## Bauen

Im Repo-Root:

    python3 trailer-quelle/build-trailer.py .

Das schreibt `trailer/` neu: die Seite mit absoluten Pfaden und nur die benötigten Dateien. Die Live-Fassung enthält keine Lesefassung mit internen Notizen.

## Veröffentlichen

1. Commit auf einem Feature-Branch, Vercel baut eine Vorschau.
2. Vorschau prüfen (geschützt, z. B. mit `vercel curl /trailer --deployment <url>`).
3. Erst nach Freigabe auf `monolith` mergen und promoten.

## Dateien

- `aermel-hoch.html`: Film, Quelle der Seite
- `build-trailer.py`: baut `trailer/`
- `assets/`: Schriften, Logo, Bilder und die Sprecherspur (`vo-helmut/aermel-hoch-vo.mp3`). Die Einzelzeilen `zeile1` bis `zeile6` sind nur noch Archiv und gehen nicht mehr in den Build.

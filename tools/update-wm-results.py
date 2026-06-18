#!/usr/bin/env python3
"""
Aktualisiert wm-results.json mit den aktuellen WM-2026-Ergebnissen.

Quelle: football-data.org (v4, Wettbewerb "WC"). Läuft in der GitHub Action
(tools/.. → Repo-Wurzel). Schreibt Ergebnisse + Live-Status in UNSEREN
Team-Kürzeln; das Frontend (css/scripts.v2.js) matcht sie über das Team-Paar
in den hinterlegten MATCHES.

Token via Umgebungsvariable FOOTBALL_DATA_TOKEN (GitHub-Secret).
"""

from __future__ import annotations

import json
import os
import sys
import unicodedata
import urllib.request
from datetime import datetime, date
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "wm-results.json"
BERLIN = ZoneInfo("Europe/Berlin")
API = "https://api.football-data.org/v4/competitions/WC/matches"

# WM-Zeitraum (mit etwas Puffer) — außerhalb läuft das Skript leer durch.
WINDOW = (date(2026, 6, 1), date(2026, 7, 20))

# Unsere 48 Team-Kürzel (= FIFA-Codes, wie im MATCHES-Array)
CODES = {
    "MEX","RSA","KOR","CZE","CAN","BIH","QAT","SUI","BRA","MAR","HAI","SCO",
    "USA","PAR","AUS","TUR","GER","CUR","CIV","ECU","NED","JPN","SWE","TUN",
    "BEL","EGY","IRN","NZL","ESP","CPV","KSA","URU","FRA","SEN","IRQ","NOR",
    "ARG","ALG","AUT","JOR","POR","COD","UZB","COL","ENG","CRO","GHA","PAN",
}

# Robuster Fallback über den Ländernamen (football-data.org liefert nicht
# immer dasselbe Kürzel wie die FIFA). Schlüssel sind normalisiert.
_NAME_ALIASES = {
    "MEX": ["mexico"],
    "RSA": ["southafrica"],
    "KOR": ["southkorea", "korearepublic", "republicofkorea"],
    "CZE": ["czechrepublic", "czechia"],
    "CAN": ["canada"],
    "BIH": ["bosniaandherzegovina", "bosniaherzegovina", "bosnia"],
    "QAT": ["qatar"],
    "SUI": ["switzerland"],
    "BRA": ["brazil"],
    "MAR": ["morocco"],
    "HAI": ["haiti"],
    "SCO": ["scotland"],
    "USA": ["unitedstates", "usa", "unitedstatesofamerica"],
    "PAR": ["paraguay"],
    "AUS": ["australia"],
    "TUR": ["turkey", "turkiye"],
    "GER": ["germany"],
    "CUR": ["curacao"],
    "CIV": ["ivorycoast", "cotedivoire"],
    "ECU": ["ecuador"],
    "NED": ["netherlands", "holland"],
    "JPN": ["japan"],
    "SWE": ["sweden"],
    "TUN": ["tunisia"],
    "BEL": ["belgium"],
    "EGY": ["egypt"],
    "IRN": ["iran", "iranislamicrepublic", "islamicrepublicofiran"],
    "NZL": ["newzealand"],
    "ESP": ["spain"],
    "CPV": ["capeverde", "caboverde"],
    "KSA": ["saudiarabia"],
    "URU": ["uruguay"],
    "FRA": ["france"],
    "SEN": ["senegal"],
    "IRQ": ["iraq"],
    "NOR": ["norway"],
    "ARG": ["argentina"],
    "ALG": ["algeria"],
    "AUT": ["austria"],
    "JOR": ["jordan"],
    "POR": ["portugal"],
    "COD": ["drcongo", "congodr", "democraticrepublicofthecongo", "congodemocraticrepublic"],
    "UZB": ["uzbekistan"],
    "COL": ["colombia"],
    "ENG": ["england"],
    "CRO": ["croatia"],
    "GHA": ["ghana"],
    "PAN": ["panama"],
}


def normalize(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return "".join(c for c in s.lower() if c.isalnum())


NAME_TO_CODE = {}
for code, names in _NAME_ALIASES.items():
    for n in names:
        NAME_TO_CODE[normalize(n)] = code


def resolve(team: dict) -> str | None:
    tla = (team.get("tla") or "").upper()
    if tla in CODES:
        return tla
    return NAME_TO_CODE.get(normalize(team.get("name", "")))


def main() -> int:
    today = datetime.now(BERLIN).date()
    if not (WINDOW[0] <= today <= WINDOW[1]):
        print(f"[WM] {today} außerhalb des WM-Zeitraums — nichts zu tun.")
        return 0

    token = os.environ.get("FOOTBALL_DATA_TOKEN")
    if not token:
        print("[WM] FEHLER: FOOTBALL_DATA_TOKEN nicht gesetzt.", file=sys.stderr)
        return 1

    req = urllib.request.Request(API, headers={"X-Auth-Token": token})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            payload = json.load(r)
    except Exception as e:  # noqa: BLE001
        print(f"[WM] FEHLER beim API-Abruf: {e}", file=sys.stderr)
        return 1

    results = []
    skipped = []
    for mt in payload.get("matches", []):
        status = mt.get("status")
        if status not in ("FINISHED", "IN_PLAY", "PAUSED"):
            continue
        ft = (mt.get("score") or {}).get("fullTime") or {}
        hs, as_ = ft.get("home"), ft.get("away")
        if hs is None or as_ is None:
            continue
        home = resolve(mt.get("homeTeam") or {})
        away = resolve(mt.get("awayTeam") or {})
        if not home or not away:
            skipped.append(f"{(mt.get('homeTeam') or {}).get('name')} - {(mt.get('awayTeam') or {}).get('name')}")
            continue
        utc = mt.get("utcDate", "")
        try:
            local_date = datetime.fromisoformat(utc.replace("Z", "+00:00")).astimezone(BERLIN).date().isoformat()
        except Exception:  # noqa: BLE001
            local_date = utc[:10]
        results.append({
            "home": home, "away": away,
            "hs": int(hs), "as": int(as_),
            "live": status in ("IN_PLAY", "PAUSED"),
            "status": status,
            "date": local_date,
        })

    results.sort(key=lambda x: (x["date"], x["home"]))

    # Nur schreiben, wenn sich die Ergebnisse geändert haben (sonst würde der
    # wechselnde Zeitstempel bei jedem Lauf einen leeren Commit auslösen).
    if OUT.exists():
        try:
            if json.loads(OUT.read_text(encoding="utf-8")).get("matches") == results:
                print(f"[WM] {len(results)} Ergebnisse — unverändert, kein Commit.")
                return 0
        except Exception:  # noqa: BLE001
            pass

    out = {
        "updated": datetime.now(BERLIN).replace(microsecond=0).isoformat(),
        "matches": results,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[WM] {len(results)} Ergebnisse geschrieben.")
    if skipped:
        print(f"[WM] Nicht zugeordnet ({len(skipped)}): {', '.join(skipped)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())

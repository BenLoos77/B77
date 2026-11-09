// ------------------------------------------------------------------
// Passwortschutz für Kundenmappen
//
// Jede Mappe in MAPPEN ist samt allem darunter gesperrt, bis jemand ihr
// Passwort eingibt: Seiten, Bilder, Schriften, PDF, Excel. Danach merkt sich
// ein signiertes Cookie die Freigabe für 30 Tage.
//
// Geprüft wird das Passwort in api/kunden-login.js: die Edge-Laufzeit sieht
// den Rumpf einer POST-Anfrage nicht (getestet mit `vercel dev`, 2026-09-16).
// Hier hängt nur das Schloss: Cookie da und richtig, oder Anmeldeseite.
// GEHEIMNIS_VORGABE muss mit api/kunden-login.js übereinstimmen.
//
// Zwei Wegformen, weil Mahlo ausdrücklich unter b77.de/mahlo liegen soll:
// /kunden/<mappe>/… und /<mappe>/…. Wer eine Mappe hinzufügt, trägt sie in
// MAPPEN ein, ergänzt den Hash in api/kunden-login.js und — bei einer Mappe
// direkt unter der Wurzel — den Pfad im matcher.
//
// Das ist eine Türsperre, kein Benutzerkonto: ein Passwort je Mappe, geteilt
// mit den Menschen, die die Unterlagen sehen sollen.
// ------------------------------------------------------------------

export const config = { matcher: ['/kunden/:pfad*', '/mahlo', '/mahlo/:pfad*'] };

const MAPPEN = {
  zimmermann: {
    basis: '/kunden/zimmermann',
    titel: 'sales engine · Zimmermann Rhönradmischer',
    hinweis: 'Präsentation für Zimmermann Rhönradbau. Das Passwort haben Sie von B_77 erhalten.'
  },
  mahlo: {
    basis: '/mahlo',
    titel: 'Mandat Mahlo · Unterlagen',
    hinweis: 'Berichte, Tabellen und Arbeitsdateien zum Vertriebsmandat der Mahlo GmbH + Co. KG. Das Passwort haben Sie von B_77 erhalten.'
  }
};

/** Aus dem Weg die Mappe lesen: /kunden/<mappe>/… oder /<mappe>/…. */
function mappeAusWeg(pfad) {
  const teile = pfad.split('/').filter(Boolean);
  return (teile[0] === 'kunden' ? teile[1] : teile[0]) || '';
}

const GEHEIMNIS_VORGABE = '7f1f28758c75025a389167d072aee239be7013f0fa02ef5b0506068b371fcee4';
const TAGE = 30;

async function sha256(text) {
  const roh = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(roh)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Cookie-Wert einer Mappe: an Mappe und Geheimnis gebunden, nicht ratbar. */
async function marke(mappe) {
  return sha256(`${geheimnis()}:${mappe}`);
}

function geheimnis() {
  return process.env.KUNDEN_GATE_SECRET || GEHEIMNIS_VORGABE;
}

/** Einen Cookie-Wert aus dem Kopf lesen, ohne Framework. */
function keks(kopf, name) {
  for (const teil of kopf.split(';')) {
    const i = teil.indexOf('=');
    if (i > 0 && teil.slice(0, i).trim() === name) return teil.slice(i + 1).trim();
  }
  return '';
}

/** Vergleich ohne frühen Abbruch, damit die Laufzeit nichts verrät. */
function gleich(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

function seite({ mappe, titel, hinweis, fehler }) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${titel} · B_77</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{min-height:100vh;display:grid;place-items:center;padding:24px;
    background:linear-gradient(155deg,#232320,#131311);color:#F1ECE4;
    font:16px/1.55 -apple-system,system-ui,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
  .karte{width:100%;max-width:440px}
  .marke{font-weight:900;letter-spacing:-.05em;font-size:30px}
  .signal{width:120px;height:10px;border-radius:999px;background:#E5FF00;margin:22px 0 28px}
  h1{font-size:27px;font-weight:800;letter-spacing:-.03em;line-height:1.1}
  p.hinweis{margin-top:12px;color:rgba(241,236,228,.62);font-size:15px}
  form{margin-top:26px;display:grid;gap:12px}
  label{font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(241,236,228,.55)}
  input{width:100%;padding:14px 16px;border-radius:14px;border:1px solid rgba(241,236,228,.18);
    background:rgba(241,236,228,.06);color:#F1ECE4;font-size:17px}
  input:focus{outline:none;border-color:#E5FF00;box-shadow:0 0 0 4px rgba(229,255,0,.14)}
  button{margin-top:4px;padding:14px 22px;border:0;border-radius:999px;background:#E5FF00;color:#1C1A17;
    font-size:16px;font-weight:700;cursor:pointer}
  button:hover{background:#F1ECE4}
  .fehler{margin-top:4px;color:#FFB4AB;font-size:14.5px}
  footer{margin-top:34px;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:.14em;
    text-transform:uppercase;color:rgba(241,236,228,.4)}
</style></head><body>
<main class="karte">
  <p class="marke">B_77</p>
  <div class="signal"></div>
  <h1>${titel}</h1>
  <p class="hinweis">${hinweis}</p>
  <form method="post" action="/api/kunden-login" autocomplete="on">
    <input type="hidden" name="mappe" value="${mappe}">
    <label for="pw">Passwort</label>
    <input id="pw" name="passwort" type="password" autocomplete="current-password" autofocus required>
    ${fehler ? `<p class="fehler">${fehler}</p>` : ''}
    <button type="submit">Ansehen</button>
  </form>
  <footer>B_77 · Vertriebsberatung für den Mittelstand</footer>
</main></body></html>`;
}

function antwortSeite(inhalt, status = 401) {
  return new Response(inhalt, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' }
  });
}

export default async function middleware(anfrage) {
  const url = new URL(anfrage.url);
  const mappe = mappeAusWeg(url.pathname);
  const eintrag = MAPPEN[mappe];
  if (!eintrag) return new Response('Nicht gefunden.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });

  const erwartet = await marke(mappe);
  const cookie = keks(anfrage.headers.get('cookie') || '', `b77_kunde_${mappe}`);
  const offen = gleich(cookie, erwartet);

  if (!offen) {
    const fehler = url.searchParams.has('fehler') ? 'Das Passwort stimmt nicht.' : '';
    return antwortSeite(seite({ ...eintrag, mappe, fehler }));
  }

  // Freigegeben: nichts zurückgeben, dann liefert Vercel die Datei aus.
  // Kein fetch(anfrage) — das liefe wieder durch diese Middleware.
  return undefined;
}

// ------------------------------------------------------------------
// Anmeldung für die Kundenmappen unter /kunden/…
//
// Die Middleware (middleware.js) prüft nur das Cookie; den Rumpf einer
// POST-Anfrage bekommt sie in der Edge-Laufzeit nicht zu sehen. Deshalb
// nimmt diese Funktion das Passwort entgegen, prüft es und setzt das Cookie.
//
// WICHTIG: GEHEIMNIS_VORGABE und die Hashes müssen mit middleware.js
// übereinstimmen. Beides steht nur an diesen zwei Stellen.
// ------------------------------------------------------------------

const crypto = require("node:crypto");

const MAPPEN = {
  // SHA-256 des jeweiligen Passworts, nie der Klartext. "basis" ist der Weg,
  // unter dem die Mappe liegt — er bestimmt Cookie-Pfad und Rückleitung und
  // muss mit MAPPEN in middleware.js übereinstimmen.
  zimmermann: {
    hash: "41f6c97a1a2699f503ac594a29329259bd6bfda89025c43b5b70296127478978",
    basis: "/kunden/zimmermann"
  },
  mahlo: {
    hash: "6896eae98d61dd3653bbcdcea43aa6c7880a2f848de66a76813b414557f6257b",
    basis: "/mahlo"
  }
};

const GEHEIMNIS_VORGABE = "7f1f28758c75025a389167d072aee239be7013f0fa02ef5b0506068b371fcee4";
const TAGE = 30;

const sha256 = (text) => crypto.createHash("sha256").update(String(text), "utf8").digest("hex");
const marke = (mappe) => sha256(`${process.env.KUNDEN_GATE_SECRET || GEHEIMNIS_VORGABE}:${mappe}`);

function gleich(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).send("Nur POST.");
  }

  const daten = typeof req.body === "string" ? Object.fromEntries(new URLSearchParams(req.body)) : (req.body || {});
  const mappe = String(daten.mappe || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const eingabe = String(daten.passwort || "");
  const eintrag = MAPPEN[mappe];
  if (!eintrag) return res.status(404).send("Nicht gefunden.");

  const soll = process.env[`KUNDEN_PW_${mappe.toUpperCase()}`];
  const richtig = soll ? gleich(eingabe, soll) : gleich(sha256(eingabe), eintrag.hash);
  if (!richtig) {
    res.setHeader("cache-control", "no-store");
    return res.redirect(303, `${eintrag.basis}?fehler=1`);
  }

  res.setHeader("set-cookie",
    `b77_kunde_${mappe}=${marke(mappe)}; Path=${eintrag.basis}; Max-Age=${TAGE * 86400}; HttpOnly; Secure; SameSite=Lax`);
  res.setHeader("cache-control", "no-store");
  return res.redirect(303, eintrag.basis);
};

/* ============================================================
   B_77 — KI-Check (Monolith)
   In sich geschlossene Quiz-Logik: 21 Fragen entlang 6 Vertriebs-
   phasen, 0–3-Scoring je Frage, prozentuale Auswertung (KI-Reife),
   Top-3-schwächste-Phasen-Empfehlungen. Reines S/W — schwache
   Phasen werden über Mono-Label/Klasse markiert, nicht über Farbe.
   Struktur analog check.js (Vertriebs-Check), gleiche DOM-Hooks.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'b77_kicheck_v1';
  var PHASES = ['Lead & Recherche', 'Erstansprache', 'Qualifizierung', 'Angebot', 'Verhandlung', 'Nachbetreuung'];

  // p = Phasen-Index (0–5), t = Frage, h = Hinweis, o = Optionen (Reihenfolge = Score 0..3)
  var QUESTIONS = [
    { p: 0, t: 'Wie identifizieren Sie heute neue Zielkunden?', h: 'Bewertet wird, wie systematisch Sie Lead-Quellen erschließen.', o: [{ t: 'Wir warten auf eingehende Anfragen und Empfehlungen', s: 0 }, { t: 'Manuelle Recherche durch Vertriebsmitarbeiter (LinkedIn, Branchenverzeichnisse)', s: 1 }, { t: 'Strukturierte Listen aus CRM und gekauften Datenquellen', s: 2 }, { t: 'Wir nutzen KI-Tools für automatisierte Account-Anreicherung', s: 3 }] },
    { p: 0, t: 'Wie viel Zeit verbringt ein Vertriebsmitarbeiter pro Woche mit Account-Recherche?', h: 'Recherche-Zeit ist meist der größte Hebel für KI-Einsatz.', o: [{ t: 'Mehr als 8 Stunden', s: 0 }, { t: '4 bis 8 Stunden', s: 1 }, { t: '1 bis 4 Stunden', s: 2 }, { t: 'Unter 1 Stunde – KI übernimmt das meiste', s: 3 }] },
    { p: 0, t: 'Wie aktuell ist Ihre Datenbasis zu potenziellen Kunden?', h: 'Veraltete Daten kosten Conversion und Vertrauen.', o: [{ t: 'Nicht gepflegt oder stark veraltet', s: 0 }, { t: 'Manuelle Updates, sporadisch', s: 1 }, { t: 'Halbjährliche bis quartalsweise Aktualisierung', s: 2 }, { t: 'Kontinuierlich aktualisiert durch automatisierte Datenfeeds', s: 3 }] },
    { p: 1, t: 'Wie personalisieren Sie Ihre Erstansprache (E-Mail, LinkedIn)?', h: 'Personalisierung entscheidet über Antwortraten – manuell vs. KI-gestützt.', o: [{ t: 'Standard-Templates für alle Empfänger', s: 0 }, { t: 'Manuelle Anpassung pro Person (Name, Unternehmen)', s: 1 }, { t: 'Manuelle Recherche mit personalisiertem Aufhänger', s: 2 }, { t: 'KI-generierte Outreach mit echter Recherche-Tiefe', s: 3 }] },
    { p: 1, t: 'Wie hoch ist Ihre durchschnittliche Antwortrate bei Cold Outreach?', h: 'Mittelstands-Benchmark 2026: 8–12% mit Personalisierung, 18–25% mit KI-Tiefe.', o: [{ t: 'Unter 3 Prozent oder unbekannt', s: 0 }, { t: '3 bis 8 Prozent', s: 1 }, { t: '8 bis 15 Prozent', s: 2 }, { t: 'Über 15 Prozent', s: 3 }] },
    { p: 1, t: 'Wie ist Ihre Follow-up-Sequenz strukturiert?', h: 'Konsequente Follow-ups sind der größte Pipeline-Hebel.', o: [{ t: 'Ad-hoc, abhängig von Mitarbeiter-Disziplin', s: 0 }, { t: 'Manuelle Wiedervorlagen im CRM', s: 1 }, { t: 'Automatisierte E-Mail-Sequenzen', s: 2 }, { t: 'KI-gesteuerte Sequenz mit Verhaltens-Triggern', s: 3 }] },
    { p: 1, t: 'Wie definieren Sie Ihre Zielgruppen-Ansprache?', h: 'Segmentierung bestimmt, wie zielgerichtet KI eingesetzt werden kann.', o: [{ t: 'Eine einheitliche Ansprache für alle', s: 0 }, { t: 'Grobe Segmentierung nach Branche/Größe', s: 1 }, { t: 'Klar definierte Personas mit eigenen Botschaften', s: 2 }, { t: 'Dynamische Segmente, KI-optimiert in Echtzeit', s: 3 }] },
    { p: 2, t: 'Wie qualifizieren Sie eingehende Leads?', h: 'Schnelle Qualifizierung verkürzt den Sales Cycle erheblich.', o: [{ t: 'Alle Leads laufen ungefiltert an den Vertrieb', s: 0 }, { t: 'Manuelle Vorqualifizierung durch SDR-Team oder Innendienst', s: 1 }, { t: 'Lead-Scoring im CRM mit definierten Kriterien', s: 2 }, { t: 'KI-Scoring mit Verhaltens- und Firmensignalen', s: 3 }] },
    { p: 2, t: 'Nutzen Sie Chatbots oder Conversational AI auf Ihrer Website?', h: 'Chatbots übernehmen Erstberatung und vorqualifizieren rund um die Uhr.', o: [{ t: 'Nein, nur Kontaktformular', s: 0 }, { t: 'Einfacher Live-Chat während Bürozeiten', s: 1 }, { t: 'Regelbasierter Chatbot für Standardfragen', s: 2 }, { t: 'KI-Chatbot mit dynamischer Qualifizierungs-Logik', s: 3 }] },
    { p: 2, t: 'Wie analysieren Sie Buying Center und Entscheider?', h: 'Wer entscheidet wirklich? Wer beeinflusst still?', o: [{ t: 'Wir sprechen mit dem ersten Ansprechpartner und hoffen', s: 0 }, { t: 'Wir fragen aktiv nach weiteren Stakeholdern', s: 1 }, { t: 'Strukturiertes Buying-Center-Mapping pro Account', s: 2 }, { t: 'KI-gestützte Analyse aus LinkedIn-Daten und Org-Charts', s: 3 }] },
    { p: 3, t: 'Wie lange braucht ein Angebot bei Ihnen vom Anfrage-Eingang bis zum Versand?', h: 'Geschwindigkeit ist heute ein Wettbewerbsfaktor.', o: [{ t: 'Länger als eine Woche', s: 0 }, { t: '3 bis 7 Werktage', s: 1 }, { t: '1 bis 2 Werktage', s: 2 }, { t: 'Unter 24 Stunden – durch teils automatisierte Erstellung', s: 3 }] },
    { p: 3, t: 'Wie greifen Vertriebsmitarbeiter auf Produktdaten, Preise und Verfügbarkeiten zu?', h: 'RAG-Systeme reduzieren Angebotsfehler dramatisch.', o: [{ t: 'Anrufe bei Kollegen, Excel-Listen, ERP-Suche', s: 0 }, { t: 'CRM mit verlinkten Dokumenten und Preislisten', s: 1 }, { t: 'Eigenes Angebots-Tool mit Produktkatalog-Integration', s: 2 }, { t: 'RAG-System oder KI-Assistent mit Echtzeit-Datenzugriff', s: 3 }] },
    { p: 3, t: 'Wie sind Ihre Angebote inhaltlich aufgebaut?', h: 'Standardisierte, datengestützte Angebote performen messbar besser.', o: [{ t: 'Jeder Vertriebler hat seine eigene Vorlage', s: 0 }, { t: 'Einheitliches Layout, manuell befüllt', s: 1 }, { t: 'Vorlagen mit dynamischen Textbausteinen', s: 2 }, { t: 'KI-generierter Angebotstext, angepasst pro Kunde', s: 3 }] },
    { p: 4, t: 'Wie bereiten Sie Verhandlungstermine vor?', h: 'Vorbereitungs-Qualität korreliert direkt mit Closing Rate.', o: [{ t: 'Aus dem Bauch, mit dem was wir wissen', s: 0 }, { t: 'Standardisiertes Briefing aus CRM-Notizen', s: 1 }, { t: 'Strukturierter Briefing-Prozess mit Kollegen-Input', s: 2 }, { t: 'KI-generierte Briefings inkl. Verhandlungshebel und Risiken', s: 3 }] },
    { p: 4, t: 'Werden Vertriebsgespräche systematisch ausgewertet?', h: 'Conversation Intelligence ist ab 10+ Vertriebsmitarbeitern ein echter Hebel.', o: [{ t: 'Nein, jeder verlässt sich auf das eigene Gefühl', s: 0 }, { t: 'Gelegentliches Coaching durch den Vorgesetzten', s: 1 }, { t: 'Strukturiertes Peer-Review oder Coaching-System', s: 2 }, { t: 'Conversation Intelligence wie Gong oder MS Copilot', s: 3 }] },
    { p: 4, t: 'Wie genau ist Ihr Sales Forecast?', h: 'KI-Forecasts erreichen Mittelstands-Benchmarks von 85–92% Genauigkeit.', o: [{ t: 'Wir machen keinen verlässlichen Forecast', s: 0 }, { t: 'Forecast-Genauigkeit unter 60 Prozent', s: 1 }, { t: 'Forecast-Genauigkeit 60–80 Prozent', s: 2 }, { t: 'Forecast-Genauigkeit über 80 Prozent', s: 3 }] },
    { p: 4, t: 'Wie gehen Sie mit Einwänden im Vertriebsgespräch um?', h: 'Strukturiertes Einwandmanagement ist gut, KI-Coaching macht es planbar.', o: [{ t: 'Erfahrungsbasiert, jeder Vertriebler macht es anders', s: 0 }, { t: 'Wir haben dokumentierte Einwand-Antworten', s: 1 }, { t: 'Regelmäßige Trainings mit Rollenspielen', s: 2 }, { t: 'KI-gestütztes Coaching basierend auf Call-Analyse', s: 3 }] },
    { p: 5, t: 'Wie systematisch betreuen Sie Bestandskunden für Cross- und Upselling?', h: 'Bestandskunden-Wachstum ist oft der unterschätzte Hebel.', o: [{ t: 'Anlassbezogen, wenn wir Kapazitäten haben', s: 0 }, { t: 'Jährliche Account-Reviews mit Top-Kunden', s: 1 }, { t: 'Strukturierter Account-Plan mit definierten Touchpoints', s: 2 }, { t: 'KI-getriebene Nachfass-Logik mit Predictive Signals', s: 3 }] },
    { p: 5, t: 'Erfassen Sie Nutzungs- oder Verbrauchsdaten Ihrer Produkte/Leistungen beim Kunden?', h: 'Predictive Maintenance erzeugt Service- und Cross-Selling-Anlässe automatisch.', o: [{ t: 'Nein', s: 0 }, { t: 'Teilweise, manuelle Auswertung', s: 1 }, { t: 'Ja, mit Dashboards für Vertrieb und Service', s: 2 }, { t: 'Ja, mit KI-Vorhersage auf Service-/Cross-Selling-Bedarf', s: 3 }] },
    { p: 5, t: 'Wie messen Sie Kundenzufriedenheit?', h: 'Frühzeitige Signale verhindern Abwanderung.', o: [{ t: 'Wir merken es, wenn Kunden abspringen', s: 0 }, { t: 'Sporadische NPS- oder Zufriedenheits-Umfragen', s: 1 }, { t: 'Regelmäßige strukturierte Erhebungen mit Maßnahmen', s: 2 }, { t: 'KI-Sentiment-Analyse aus Calls und E-Mails', s: 3 }] },
    { p: 5, t: 'Wie aktivieren Sie Empfehlungen durch zufriedene Kunden?', h: 'Empfehlungs-Akquise hat die höchsten Conversion-Raten – und wird selten systematisch betrieben.', o: [{ t: 'Wir freuen uns, wenn jemand uns empfiehlt', s: 0 }, { t: 'Wir fragen aktiv nach Empfehlungen am Projektende', s: 1 }, { t: 'Strukturiertes Referenz-Programm mit Anreizen', s: 2 }, { t: 'KI-identifizierte Promotoren mit automatisierter Empfehlungs-Logik', s: 3 }] }
  ];

  // Empfehlung je Phase (Index 0–5)
  var RECS = [
    { title: 'Lead-Recherche automatisieren', text: 'Starten Sie mit einem Tool wie HubSpot Breeze oder Apollo.io. Ziel: Account-Recherche von Stunden auf Minuten reduzieren. Erste messbare Effekte typischerweise nach 4–6 Wochen.' },
    { title: 'Erstansprache personalisieren – mit Recherche-Tiefe', text: 'Setzen Sie Dealcode (DACH/DSGVO-konform) oder vergleichbare Tools ein, um Outreach-Sequenzen mit echter Personalisierung zu fahren. Antwortraten verdoppeln sich typischerweise.' },
    { title: 'Lead-Qualifizierung und Buying-Center systematisieren', text: 'Lead-Scoring im CRM einführen oder ausbauen, ergänzt um einen Chatbot wie moin.ai für die 24/7-Vorqualifizierung. Vertrieb spricht nur noch mit qualifizierten Leads.' },
    { title: 'Angebotszeiten radikal verkürzen', text: 'RAG-Setup oder Microsoft Copilot für Angebotsvorbereitung, kombiniert mit standardisierten Textbausteinen. Ziel: Angebot in unter 24 Stunden – bei konsistenter Qualität.' },
    { title: 'Verhandlungs-Qualität messbar machen', text: 'Conversation Intelligence wie Gong einführen. Coaching wird datengestützt, Forecast-Genauigkeit steigt typischerweise um 15–25 Prozentpunkte.' },
    { title: 'Bestandskunden zum Wachstumsmotor machen', text: 'Predictive-Maintenance-Daten und KI-Sentiment-Analyse nutzen, um Cross-Selling- und Service-Leads automatisch zu erzeugen. Größter unterschätzter Hebel.' }
  ];
  var REC_HREF = '/ki-im-vertrieb', REC_LINK = 'KI im Vertrieb →';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function initCheck() {
    var root = document.getElementById('vc');
    if (!root) return;

    var state = { phase: 'intro', idx: 0, answers: {} };
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var s = JSON.parse(raw); if (s && s.answers) { state.idx = s.idx || 0; state.answers = s.answers; } }
    } catch (e) {}

    var elIntro = document.getElementById('phase-intro');
    var elQuiz = document.getElementById('phase-quiz');
    var elResult = document.getElementById('phase-result');

    function persist() { try { localStorage.setItem(KEY, JSON.stringify({ idx: state.idx, answers: state.answers })); } catch (e) {} }
    function answeredCount() { return Object.keys(state.answers).length; }

    function show(phase) {
      state.phase = phase;
      elIntro.classList.toggle('active', phase === 'intro');
      elQuiz.classList.toggle('active', phase === 'quiz');
      elResult.classList.toggle('active', phase === 'result');
    }

    function syncIntro() {
      var startBtn = document.getElementById('check-start');
      var resetLink = document.getElementById('check-reset-intro');
      var has = answeredCount() > 0;
      if (startBtn) startBtn.querySelector('.lbl').textContent = has ? 'KI-Check fortsetzen' : 'KI-Check starten';
      if (resetLink) resetLink.style.display = has ? '' : 'none';
    }

    function renderQuiz() {
      var q = QUESTIONS[state.idx];
      var cur = state.answers[state.idx];
      elQuiz.querySelector('.dim').textContent = 'Phase 0' + (q.p + 1) + ' · ' + PHASES[q.p];
      elQuiz.querySelector('.qnum').textContent = 'Frage ' + (state.idx + 1) + ' / ' + QUESTIONS.length;
      elQuiz.querySelector('.q-bar i').style.width = Math.round((state.idx / QUESTIONS.length) * 100) + '%';
      elQuiz.querySelector('.q-text').textContent = q.t;
      var hint = elQuiz.querySelector('.q-hint');
      if (hint) hint.textContent = q.h || '';
      var opts = elQuiz.querySelector('.q-opts');
      opts.innerHTML = '';
      q.o.forEach(function (opt, idx) {
        var b = document.createElement('button');
        b.className = 'q-opt' + (cur === idx ? ' sel' : '');
        b.innerHTML = '<span class="on">' + opt.s + '</span><span>' + esc(opt.t) + '</span>';
        b.addEventListener('click', function () { answer(idx); });
        opts.appendChild(b);
      });
      elQuiz.querySelector('.q-back').style.visibility = state.idx > 0 ? 'visible' : 'hidden';
    }

    function answer(idx) {
      state.answers[state.idx] = idx;
      if (state.idx >= QUESTIONS.length - 1) { persist(); renderResult(); show('result'); window.scrollTo(0, 0); }
      else { state.idx++; persist(); renderQuiz(); window.scrollTo(0, 0); }
    }

    function scores() {
      var phaseS = [0, 0, 0, 0, 0, 0], phaseM = [0, 0, 0, 0, 0, 0], total = 0, max = QUESTIONS.length * 3;
      QUESTIONS.forEach(function (q, i) {
        var sel = state.answers[i];
        var sc = (sel == null) ? 0 : q.o[sel].s;
        total += sc; phaseS[q.p] += sc; phaseM[q.p] += 3;
      });
      return {
        pct: Math.round(total / max * 100),
        phasePct: phaseS.map(function (sv, i) { return Math.round(sv / phaseM[i] * 100); })
      };
    }

    function renderResult() {
      var r = scores();
      document.getElementById('r-score').textContent = r.pct;
      var tn, td;
      if (r.pct < 25) { tn = 'Einstieg'; td = 'Ihr Vertrieb arbeitet überwiegend ohne KI-Unterstützung. Das größte Potenzial liegt genau hier – schon kleine Schritte bringen messbare Effekte.'; }
      else if (r.pct < 50) { tn = 'Aufbau'; td = 'Erste KI-Bausteine sind erkennbar, aber das System ist noch nicht durchgängig. Jetzt entscheidet sich, ob aus Werkzeugen ein Prozess wird.'; }
      else if (r.pct < 75) { tn = 'Etabliert'; td = 'Sie nutzen KI an mehreren Stellen im Vertriebsprozess. Der nächste Sprung kommt aus Integration und Datenqualität – nicht aus mehr Tools.'; }
      else { tn = 'Fortgeschritten'; td = 'Sie gehören zu den KI-affinen Vertriebsorganisationen im Mittelstand. Der Fokus verschiebt sich von Adoption zu Differenzierung.'; }
      document.getElementById('r-tier').textContent = tn;
      document.getElementById('r-tier-desc').textContent = td;

      var dimsEl = document.getElementById('r-dims');
      dimsEl.innerHTML = '';
      PHASES.forEach(function (name, i) {
        var pct = r.phasePct[i], weak = pct < 50;
        var row = document.createElement('div');
        row.className = 'dimrow' + (weak ? ' weak' : '');
        row.innerHTML = '<div class="top"><span class="name">Phase 0' + (i + 1) + ' · ' + esc(name) + '</span>' +
          '<span class="val">' + pct + ' / 100</span></div>' +
          '<div class="track"><i style="width:' + pct + '%"></i></div>';
        dimsEl.appendChild(row);
      });

      // Top-3 schwächste Phasen
      var order = PHASES.map(function (n, i) { return { i: i, pct: r.phasePct[i] }; }).sort(function (a, b) { return a.pct - b.pct; });
      var recsEl = document.getElementById('r-recs');
      recsEl.innerHTML = '';
      order.slice(0, 3).forEach(function (o) {
        var rc = RECS[o.i];
        var el = document.createElement('div');
        el.className = 'rec';
        el.innerHTML = '<div><h3>' + esc(rc.title) + '</h3><p>' + esc(rc.text) + '</p></div>' +
          '<a class="b77-noprint" href="' + REC_HREF + '">' + esc(REC_LINK) + '</a>';
        recsEl.appendChild(el);
      });
    }

    function reset() {
      try { localStorage.removeItem(KEY); } catch (e) {}
      state.idx = 0; state.answers = {}; syncIntro(); show('intro');
    }

    // Controls verdrahten
    var startBtn = document.getElementById('check-start');
    if (startBtn) startBtn.addEventListener('click', function () { renderQuiz(); show('quiz'); });
    var backBtn = elQuiz.querySelector('.q-back');
    if (backBtn) backBtn.addEventListener('click', function () { if (state.idx > 0) { state.idx--; renderQuiz(); } });
    [document.getElementById('check-reset-intro'), elQuiz.querySelector('.q-cancel'), document.getElementById('r-restart')].forEach(function (b) {
      if (b) b.addEventListener('click', function (e) { e.preventDefault(); reset(); });
    });
    var printBtn = document.getElementById('r-print');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    syncIntro();
    show('intro');
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', initCheck);
  else initCheck();
})();

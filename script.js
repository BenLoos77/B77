/* ============================================================
   B_77 — Site scripts: nav, contact form, Vertriebs-Check
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var burger = document.querySelector('.nav__burger');
    var menu = document.querySelector('.nav__mobile');
    if (!burger || !menu) return;
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.textContent = open ? '\u2715' : '\u2630';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      var ok = document.getElementById('form-success');
      if (ok) ok.classList.add('show');
    });
  }

  /* ---------- Vertriebs-Check ---------- */
  var KEY = 'b77_check_v1';
  var DIMS = [
    { key: 'A', name: 'Positionierung & Markt' },
    { key: 'B', name: 'Prozesse & Pipeline' },
    { key: 'C', name: 'CRM & Daten' },
    { key: 'D', name: 'Aktive Marktbearbeitung' },
    { key: 'E', name: 'Führung & Steuerung' }
  ];
  var QUESTIONS = [
    { d: 0, t: 'Unsere Zielkunden sind klar definiert und im Vertrieb tatsächlich anwendbar.' },
    { d: 0, t: 'Unsere Positionierung ist für Entscheider sofort relevant und unterscheidbar.' },
    { d: 0, t: 'Wir wissen, in welchen Märkten unser Angebot den größten Hebel hat.' },
    { d: 0, t: 'Unser Nutzenversprechen ist klar formuliert und im Team einheitlich.' },
    { d: 0, t: 'Wir bearbeiten unsere Zielmärkte bewusst — statt auf Anfragen zu warten.' },
    { d: 1, t: 'Unser Vertriebsprozess ist von Erstkontakt bis Abschluss klar definiert.' },
    { d: 1, t: 'Verantwortlichkeiten und Übergaben im Vertrieb sind eindeutig geregelt.' },
    { d: 1, t: 'Leads werden bei uns nach klaren Kriterien qualifiziert.' },
    { d: 1, t: 'Unsere Pipeline ist transparent und unsere Forecasts sind realistisch.' },
    { d: 1, t: 'Angebote werden konsequent und zeitnah nachverfolgt.' },
    { d: 2, t: 'Wir nutzen ein CRM als Steuerungsinstrument, nicht nur als Datenspeicher.' },
    { d: 2, t: 'Das CRM wird im Alltag diszipliniert und vollständig gepflegt.' },
    { d: 2, t: 'Wir treffen Vertriebsentscheidungen auf Basis verlässlicher Daten.' },
    { d: 2, t: 'Relevante Vertriebskennzahlen sind für uns jederzeit verfügbar.' },
    { d: 2, t: 'Wir setzen passende Tools bzw. KI ein, um Routinearbeit zu reduzieren.' },
    { d: 3, t: 'Wir sprechen neue Entscheider systematisch und proaktiv an.' },
    { d: 3, t: 'Wir kennen das Buying Center unserer Zielkunden inkl. stiller Einflussnehmer.' },
    { d: 3, t: 'Wir erzeugen aktiv Bedarf, statt nur bestehende Nachfrage zu verarbeiten.' },
    { d: 3, t: 'Verhandlungen führen wir strukturiert bis zum Abschluss.' },
    { d: 3, t: 'Bestandskunden bauen wir gezielt aus — Cross-/Up-Selling, Empfehlungen.' },
    { d: 4, t: 'Vertrieb ist bei uns Chefsache und wird aktiv gesteuert.' },
    { d: 4, t: 'Wir steuern mit KPIs, die wirklich steuern — nicht nur messen.' },
    { d: 4, t: 'Vertriebsziele sind klar, verbindlich und werden nachgehalten.' },
    { d: 4, t: 'Unser Vertriebsteam entwickelt sich kontinuierlich weiter.' },
    { d: 4, t: 'Wir wissen jederzeit, wo wir stehen und wo wir nachsteuern müssen.' }
  ];
  var SCALE = ['Trifft nicht zu', 'Eher nicht', 'Teils / teils', 'Eher ja', 'Trifft voll zu'];
  var RECMAP = {
    A: { title: 'Positionierung schärfen', text: 'Zielkunden, Märkte und Nutzenversprechen klar und vertrieblich anwendbar machen.', href: 'vertriebsoptimierung.html', link: 'Vertriebsoptimierung →' },
    B: { title: 'Prozesse & Pipeline strukturieren', text: 'Klare Stufen, Qualifizierungskriterien, verbindliche Nachverfolgung und transparente Forecasts.', href: 'vertriebsoptimierung.html', link: 'Vertriebsoptimierung →' },
    C: { title: 'CRM-Disziplin & Daten aufbauen', text: 'CRM als Steuerungsinstrument etablieren und Routinearbeit mit passenden Tools bzw. KI reduzieren.', href: 'ki-im-vertrieb.html', link: 'KI im Vertrieb →' },
    D: { title: 'Den Markt aktiv bearbeiten', text: 'Entscheider systematisch ansprechen, Bedarf aktiv erzeugen und Abschlüsse herbeiführen.', href: 'aktiver-vertrieb.html', link: 'Aktiver Vertrieb →' },
    E: { title: 'Führung & Steuerung stärken', text: 'Vertrieb zur Chefsache machen, mit echten KPIs steuern und Ziele verbindlich nachhalten.', href: 'vertriebsoptimierung.html', link: 'Vertriebsoptimierung →' }
  };

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
      if (startBtn) startBtn.querySelector('.lbl').textContent = has ? 'Check fortsetzen' : 'Vertriebs-Check starten';
      if (resetLink) resetLink.style.display = has ? '' : 'none';
    }

    function renderQuiz() {
      var q = QUESTIONS[state.idx];
      var cur = state.answers[state.idx];
      elQuiz.querySelector('.dim').textContent = DIMS[q.d].name;
      elQuiz.querySelector('.qnum').textContent = 'Frage ' + (state.idx + 1) + ' / ' + QUESTIONS.length;
      elQuiz.querySelector('.q-bar i').style.width = Math.round((state.idx / QUESTIONS.length) * 100) + '%';
      elQuiz.querySelector('.q-text').textContent = q.t;
      var opts = elQuiz.querySelector('.q-opts');
      opts.innerHTML = '';
      SCALE.forEach(function (label, val) {
        var b = document.createElement('button');
        b.className = 'q-opt' + (cur === val ? ' sel' : '');
        b.innerHTML = '<span class="on">' + val + '</span><span>' + esc(label) + '</span>';
        b.addEventListener('click', function () { answer(val); });
        opts.appendChild(b);
      });
      elQuiz.querySelector('.q-back').style.visibility = state.idx > 0 ? 'visible' : 'hidden';
    }

    function answer(val) {
      state.answers[state.idx] = val;
      if (state.idx >= QUESTIONS.length - 1) { persist(); renderResult(); show('result'); window.scrollTo(0, 0); }
      else { state.idx++; persist(); renderQuiz(); window.scrollTo(0, 0); }
    }

    function scores() {
      var dimSum = [0, 0, 0, 0, 0], total = 0;
      QUESTIONS.forEach(function (q, i) { var v = state.answers[i] || 0; dimSum[q.d] += v; total += v; });
      return { overall: total, dimPct: dimSum.map(function (s) { return Math.round((s / 20) * 100); }) };
    }

    function renderResult() {
      var r = scores();
      document.getElementById('r-score').textContent = r.overall;
      var tn, td;
      if (r.overall <= 40) { tn = 'Reaktiver Vertrieb'; td = 'Ihr Vertrieb verwaltet überwiegend Nachfrage. Der Hebel durch Struktur und aktive Marktbearbeitung ist groß.'; }
      else if (r.overall <= 60) { tn = 'Im Aufbau'; td = 'Das Fundament steht in Teilen — es gibt aber deutliche Lücken, die planbares Wachstum bremsen.'; }
      else if (r.overall <= 80) { tn = 'Strukturiert'; td = 'Ihr Vertrieb arbeitet solide. Mit gezielten Maßnahmen holen Sie das letzte Drittel heraus.'; }
      else { tn = 'Vertriebsaktiv'; td = 'Sie gestalten Ihren Markt aktiv. Jetzt geht es um Feinjustierung und Konsequenz.'; }
      document.getElementById('r-tier').textContent = tn;
      document.getElementById('r-tier-desc').textContent = td;

      var dimsEl = document.getElementById('r-dims');
      dimsEl.innerHTML = '';
      DIMS.forEach(function (d, i) {
        var pct = r.dimPct[i], weak = pct < 60, col = weak ? 'var(--accent)' : 'var(--ink)';
        var row = document.createElement('div');
        row.className = 'dimrow';
        row.innerHTML = '<div class="top"><span class="name">' + esc(d.name) + '</span>' +
          '<span class="val" style="color:' + col + '">' + pct + ' / 100</span></div>' +
          '<div class="track"><i style="width:' + pct + '%;background:' + col + '"></i></div>';
        dimsEl.appendChild(row);
      });

      var weakKeys = DIMS.filter(function (d, i) { return r.dimPct[i] < 60; }).map(function (d) { return d.key; });
      var recs = weakKeys.length === 0
        ? [{ title: 'Feinjustierung & Konsequenz', text: 'Ihr Vertrieb ist breit aufgestellt. Sichern Sie das Niveau über alle Dimensionen ab und justieren Sie gezielt nach.', href: 'kontakt.html', link: 'Sparring vereinbaren →' }]
        : weakKeys.map(function (k) { return RECMAP[k]; });
      var recsEl = document.getElementById('r-recs');
      recsEl.innerHTML = '';
      recs.forEach(function (rc) {
        var el = document.createElement('div');
        el.className = 'rec';
        el.innerHTML = '<div><h3>' + esc(rc.title) + '</h3><p>' + esc(rc.text) + '</p></div>' +
          '<a class="b77-noprint" href="' + rc.href + '">' + esc(rc.link) + '</a>';
        recsEl.appendChild(el);
      });
    }

    function reset() {
      try { localStorage.removeItem(KEY); } catch (e) {}
      state.idx = 0; state.answers = {}; syncIntro(); show('intro');
    }

    // wire controls
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

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initForm();
    initCheck();
  });
})();

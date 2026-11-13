/* B_77 · Cookie-Consent + Google Analytics 4
   GA wird AUSSCHLIESSLICH nach ausdruecklicher Einwilligung geladen.
   Vor "Akzeptieren" geht nichts an Google (kein Script, keine Pings, keine Cookies).
   Markengerechtes Banner, gleichwertiges "Ablehnen", gespeicherte Wahl, jederzeit widerrufbar. */
(function () {
  'use strict';

  var GA_ID    = 'G-N6KF1KY957';   // GA4-Property b77.de
  var KEY      = 'b77_consent';     // 'granted' | 'denied'
  var VER_KEY  = 'b77_consent_ver';
  var VERSION  = '2026-11-10';      // bei Aenderung der Datenschutz-Lage erhoehen -> neue Abfrage

  /* ---------- Einwilligung speichern/lesen ---------- */
  function getConsent() {
    try {
      if (localStorage.getItem(VER_KEY) !== VERSION) return null;
      var v = localStorage.getItem(KEY);
      return (v === 'granted' || v === 'denied') ? v : null;
    } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); localStorage.setItem(VER_KEY, VERSION); } catch (e) {}
  }

  /* ---------- Google Analytics erst nach Einwilligung laden ---------- */
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    /* Consent Mode v2: hier erteilt, weil der Nutzer aktiv zugestimmt hat */
    gtag('consent', 'default', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
      analytics_storage: 'granted', functionality_storage: 'granted', security_storage: 'granted'
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('config', GA_ID);
  }

  /* ---------- Oeffentliche Event-Hilfe (feuert nur bei Einwilligung) ---------- */
  window.b77Track = function (name, params) {
    try { if (getConsent() === 'granted' && window.gtag) gtag('event', name, params || {}); } catch (e) {}
  };
  /* Lead-Event beim Absenden des Kontaktformulars */
  document.addEventListener('submit', function (e) {
    var t = e.target;
    if (t && (t.id === 'contact-form' || t.id === 'cform' ||
        (t.classList && t.classList.contains('cform')))) {
      window.b77Track('generate_lead', { form_id: t.id || 'contact' });
    }
  }, true);

  /* ---------- Banner (markengerecht, self-contained) ---------- */
  var STYLE = '' +
    '.b77c{position:fixed;z-index:100000;left:clamp(14px,3vw,28px);bottom:clamp(14px,3vw,28px);' +
    'width:min(430px,calc(100vw - 28px));background:#141311;color:#F2F1EC;' +
    'border:1px solid rgba(242,241,236,.14);border-radius:20px;padding:22px 24px 20px;' +
    'box-shadow:0 22px 60px rgba(0,0,0,.42);font-family:"Satoshi",-apple-system,system-ui,sans-serif;' +
    'opacity:0;transform:translateY(16px);transition:opacity .4s ease,transform .45s cubic-bezier(.2,.8,.2,1);}' +
    '.b77c.b77c--in{opacity:1;transform:none;}' +
    '.b77c-tag{font-family:"Space Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.14em;' +
    'text-transform:uppercase;color:#E5FF00;display:flex;align-items:center;gap:8px;margin:0 0 12px;}' +
    '.b77c-tag::before{content:"";width:7px;height:7px;border-radius:50%;background:#E5FF00;}' +
    '.b77c-title{font-size:16px;font-weight:650;letter-spacing:-.01em;line-height:1.3;margin:0 0 8px;}' +
    '.b77c-text{font-size:13.5px;line-height:1.55;color:rgba(242,241,236,.74);margin:0 0 18px;}' +
    '.b77c-text a{color:#F2F1EC;text-decoration:underline;text-underline-offset:2px;' +
    'text-decoration-color:rgba(242,241,236,.4);}' +
    '.b77c-text a:hover{text-decoration-color:#E5FF00;}' +
    '.b77c-row{display:flex;gap:10px;}' +
    '.b77c-btn{flex:1;appearance:none;-webkit-appearance:none;border:0;cursor:pointer;font-family:inherit;' +
    'font-size:13.5px;font-weight:700;padding:12px 18px;border-radius:999px;' +
    'transition:transform .2s ease,background .2s ease,border-color .2s ease;}' +
    '.b77c-btn:focus-visible{outline:2px solid #E5FF00;outline-offset:2px;}' +
    '.b77c-reject{background:transparent;color:#F2F1EC;border:1px solid rgba(242,241,236,.28);}' +
    '.b77c-reject:hover{border-color:rgba(242,241,236,.6);transform:translateY(-1px);}' +
    '.b77c-accept{background:#E5FF00;color:#141311;}' +
    '.b77c-accept:hover{transform:translateY(-1px);}' +
    '@media (max-width:520px){.b77c{left:12px;right:12px;bottom:12px;width:auto;padding:20px 20px 18px;}}' +
    '@media (prefers-reduced-motion:reduce){.b77c{transition:opacity .2s ease;transform:none;}' +
    '.b77c.b77c--in{transform:none;}.b77c-btn:hover{transform:none;}}';

  function injectStyle() {
    if (document.getElementById('b77c-style')) return;
    var st = document.createElement('style');
    st.id = 'b77c-style';
    st.textContent = STYLE;
    document.head.appendChild(st);
  }

  var bannerEl = null;
  function removeBanner() {
    if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl);
    bannerEl = null;
  }
  function showBanner() {
    if (bannerEl) return;
    injectStyle();
    var w = document.createElement('div');
    w.className = 'b77c';
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-label', 'Cookie-Einwilligung');
    w.setAttribute('aria-live', 'polite');
    w.innerHTML =
      '<p class="b77c-tag">Datenschutz</p>' +
      '<p class="b77c-title">D&uuml;rfen wir mitz&auml;hlen?</p>' +
      '<p class="b77c-text">Wir messen mit Google Analytics anonymisiert, wie diese Seite genutzt wird, ' +
      'ausschlie&szlig;lich mit Ihrer Einwilligung. Mehr dazu in der ' +
      '<a href="/impressum">Datenschutzerkl&auml;rung</a>.</p>' +
      '<div class="b77c-row">' +
      '<button type="button" class="b77c-btn b77c-reject">Ablehnen</button>' +
      '<button type="button" class="b77c-btn b77c-accept">Akzeptieren</button>' +
      '</div>';
    document.body.appendChild(w);
    bannerEl = w;
    w.querySelector('.b77c-accept').addEventListener('click', accept);
    w.querySelector('.b77c-reject').addEventListener('click', reject);
    requestAnimationFrame(function () { w.classList.add('b77c--in'); });
  }

  function accept() { setConsent('granted'); removeBanner(); loadGA(); }
  function reject() { setConsent('denied'); removeBanner(); }

  /* ---------- Oeffentliche API + Widerruf ---------- */
  window.b77Consent = { open: showBanner, accept: accept, reject: reject, state: getConsent };

  /* Jedes Element mit [data-b77-consent] oder ein Link auf #cookie-einstellungen oeffnet das Banner wieder */
  document.addEventListener('click', function (e) {
    var trg = e.target && e.target.closest
      ? e.target.closest('[data-b77-consent],a[href$="#cookie-einstellungen"]') : null;
    if (trg) { e.preventDefault(); showBanner(); }
  });

  /* ---------- Start ---------- */
  function init() {
    var c = getConsent();
    if (c === 'granted') loadGA();
    else if (c === 'denied') { /* nichts laden */ }
    else showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

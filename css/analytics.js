// B_77 - Analytics & Cookie-Consent
// Google Analytics 4 wird nur geladen, WENN der User ausdrücklich zustimmt.
// Vor Zustimmung: KEINE Cookies, KEIN Tracking, DSGVO-konform.

(function() {
  'use strict';

  // ============================================================
  // KONFIGURATION - HIER DEINE MEASUREMENT-ID EINTRAGEN
  // ============================================================
  const GA_MEASUREMENT_ID = 'G-N6KF1KY957';
  // ============================================================

  const CONSENT_KEY = 'b77-consent-v1';

  // Consent prüfen
  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch(e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch(e) {}
  }

  // GA4 laden (nur nach Zustimmung)
  function loadGA() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      console.info('[B_77 Analytics] Keine Measurement-ID gesetzt, GA nicht geladen.');
      return;
    }
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,          // IP-Anonymisierung (DSGVO-Empfehlung)
      cookie_flags: 'SameSite=None;Secure'
    });
  }

  // Banner-Styling — selbst-enthalten, im neuen B_77-Design (Weiß/Orange/Archivo)
  function injectConsentStyle() {
    if (document.getElementById('b77-consent-style')) return;
    var s = document.createElement('style');
    s.id = 'b77-consent-style';
    s.textContent =
      "#b77-consent{position:fixed;left:24px;right:24px;bottom:24px;z-index:99999;display:flex;justify-content:center;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity .35s ease,transform .35s cubic-bezier(.2,.8,.2,1);}" +
      "#b77-consent.visible{opacity:1;transform:none;}" +
      "#b77-consent .b77-consent-inner{pointer-events:auto;background:#fff;border:1px solid rgba(20,17,13,.16);border-radius:16px;box-shadow:0 24px 60px -22px rgba(20,17,13,.45);max-width:700px;width:100%;padding:28px 30px;display:flex;gap:30px;align-items:center;flex-wrap:wrap;font-family:'Archivo',system-ui,sans-serif;}" +
      "#b77-consent .b77-consent-inner::before{content:'';position:absolute;}" +
      "#b77-consent .b77-consent-text{flex:1;min-width:240px;font-size:14.5px;line-height:1.6;color:#4A4A46;}" +
      "#b77-consent .b77-consent-text strong{display:block;font-family:'Archivo',sans-serif;font-weight:800;font-size:17px;color:#14110D;margin-bottom:7px;letter-spacing:-.01em;}" +
      "#b77-consent .b77-consent-text strong::before{content:'';display:inline-block;width:18px;height:4px;background:var(--accent,#F23B12);vertical-align:middle;margin-right:10px;}" +
      "#b77-consent a{color:var(--accent,#F23B12);text-decoration:underline;text-underline-offset:2px;font-weight:600;}" +
      "#b77-consent .b77-consent-buttons{display:flex;gap:12px;flex-shrink:0;}" +
      "#b77-consent .b77-btn{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;padding:13px 24px;border-radius:999px;cursor:pointer;border:1.5px solid;transition:all .2s;white-space:nowrap;}" +
      "#b77-consent .b77-btn.primary{background:var(--accent,#F23B12);border-color:var(--accent,#F23B12);color:#14110D;}" +
      "#b77-consent .b77-btn.primary:hover{background:#14110D;border-color:#14110D;color:#fff;}" +
      "#b77-consent .b77-btn.secondary{background:transparent;border-color:rgba(20,17,13,.28);color:#14110D;}" +
      "#b77-consent .b77-btn.secondary:hover{border-color:#14110D;background:#14110D;color:#fff;}" +
      "@media(max-width:640px){#b77-consent{left:14px;right:14px;bottom:14px;}#b77-consent .b77-consent-inner{padding:22px;gap:18px;}#b77-consent .b77-consent-buttons{width:100%;}#b77-consent .b77-btn{flex:1;text-align:center;}}";
    document.head.appendChild(s);
  }

  // Banner erstellen
  function showBanner() {
    if (document.getElementById('b77-consent')) return;
    injectConsentStyle();

    const banner = document.createElement('div');
    banner.id = 'b77-consent';
    banner.innerHTML = `
      <div class="b77-consent-inner">
        <div class="b77-consent-text">
          <strong>Cookies &amp; Analyse.</strong>
          Wir nutzen Google Analytics, um zu verstehen, wie Besucher unsere Seite nutzen
          und sie kontinuierlich zu verbessern. Dafür werden Cookies gesetzt.
          Notwendige Funktionen (z.&nbsp;B. Theme-Einstellung) funktionieren auch ohne Zustimmung.
          Mehr in der <a href="/impressum">Datenschutzerklärung</a>.
        </div>
        <div class="b77-consent-buttons">
          <button id="b77-consent-decline" class="b77-btn secondary">Ablehnen</button>
          <button id="b77-consent-accept" class="b77-btn primary">Akzeptieren</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('b77-consent-accept').addEventListener('click', () => {
      setConsent('accepted');
      loadGA();
      hideBanner();
    });
    document.getElementById('b77-consent-decline').addEventListener('click', () => {
      setConsent('declined');
      hideBanner();
    });

    // Sichtbar machen mit Animation
    requestAnimationFrame(() => banner.classList.add('visible'));
  }

  function hideBanner() {
    const banner = document.getElementById('b77-consent');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
  }

  // Init
  const consent = getConsent();
  if (consent === 'accepted') {
    loadGA();
  } else if (consent !== 'declined') {
    // Banner zeigen nach kurzem Delay (damit Seite erst lädt)
    setTimeout(showBanner, 800);
  }

  // Public API: Nutzer kann Consent nachträglich ändern (z.B. Link im Footer)
  window.b77Consent = {
    reset: function() {
      try { localStorage.removeItem(CONSENT_KEY); } catch(e) {}
      showBanner();
    },
    status: getConsent
  };
})();

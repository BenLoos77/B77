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

  // Banner erstellen
  function showBanner() {
    if (document.getElementById('b77-consent')) return;

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

// B_77 - gemeinsames Theme- und Interaktions-Script für alle Seiten

(function() {
  'use strict';

  const htmlEl = document.documentElement;
  const navLogo = document.getElementById('navLogo');
  const footLogo = document.getElementById('footLogo');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    // WM-Modus nutzt dunkles Logo (weißer Hintergrund), sonst Logik wie bei dark/light
    const logoFile = theme === 'dark' ? 'assets/B77_Logo_white.png' : 'assets/B77_Logo_black.png';
    if (navLogo) navLogo.src = logoFile;
    if (footLogo) footLogo.src = logoFile;
    document.querySelectorAll('.theme-tabs button').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
    try { localStorage.setItem('b77-theme', theme); } catch(e) {}
  }

  // Regelwerk:
  // 1. Während der WM (11.06.–19.07.2026): IMMER WM-Modus (Gewinner-Override).
  //    Ausnahme: Nutzer hat während der WM aktiv ein anderes Theme gewählt – dann gewinnt seine Wahl.
  // 2. Außerhalb der WM: automatischer Tag/Nacht-Wechsel nach Berliner Ortszeit
  //    (07:00–20:00 = Light, 20:00–07:00 = Dark).
  //    Ausnahme: Nutzer hat aktiv was gewählt – dann gewinnt seine Wahl.
  //
  // Wenn der Nutzer manuell auf einen der drei Buttons klickt, wird seine Wahl
  // gespeichert und hebelt die Automatik aus.

  function isDuringWM(now) {
    const wmStart = new Date('2026-06-11T00:00:00');
    const wmEnd   = new Date('2026-07-20T23:59:59');
    return now >= wmStart && now <= wmEnd;
  }

  function autoThemeForNow(now) {
    if (isDuringWM(now)) return 'wm';
    // Berliner Stunde ermitteln (DST-aware dank Intl)
    const hourStr = new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit', hour12: false, timeZone: 'Europe/Berlin'
    }).format(now);
    const hour = parseInt(hourStr, 10);
    // 07:00 bis 19:59 = Light, sonst Dark
    return (hour >= 7 && hour < 20) ? 'light' : 'dark';
  }

  // Initial: gespeicherte Wahl, sonst Automatik
  let initial = 'dark';
  try {
    const saved = localStorage.getItem('b77-theme');
    if (['light','dark','wm'].includes(saved)) {
      initial = saved;
    } else {
      initial = autoThemeForNow(new Date());
    }
  } catch(e) {
    initial = autoThemeForNow(new Date());
  }
  applyTheme(initial);

  // Auto-Wechsel zur vollen Stunde, solange Nutzer KEINE eigene Wahl getroffen hat
  setInterval(() => {
    try {
      if (localStorage.getItem('b77-theme')) return; // Nutzer hat gewählt → nicht anfassen
    } catch(e) {}
    const next = autoThemeForNow(new Date());
    if (next !== document.documentElement.getAttribute('data-theme')) {
      applyTheme(next);
      // applyTheme speichert standardmäßig in localStorage – bei Auto-Wechsel wollen wir das NICHT,
      // damit die Automatik weiterlaufen kann. Daher löschen wir den Eintrag direkt wieder:
      try { localStorage.removeItem('b77-theme'); } catch(e) {}
    }
  }, 60 * 1000); // jede Minute prüfen

  document.querySelectorAll('.theme-tabs button').forEach(b =>
    b.addEventListener('click', () => applyTheme(b.dataset.theme))
  );

  // Scroll reveal für Elemente mit .reveal oder den Standard-Content-Blöcken
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.mission h2, .service, .post, .stat, .quote p, .cta-section h2, .blog-item, .pillar, .content-grid .body > *').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  // Smooth Scroll für interne Anker
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', ev => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          ev.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();


// ==========================================================================
// WM-SPIELKALENDER
// ==========================================================================

// Flaggen als CSS-Gradients (kompakt, ohne externe Bilder)
const FLAGS = {
  'MEX':'linear-gradient(90deg,#006847 0 33.33%,#FFF 33.33% 66.66%,#CE1126 66.66% 100%)',
  'RSA':'linear-gradient(180deg,#007749 0 20%,#FFF 20% 28%,#000 28% 48%,#FFB81C 48% 56%,#DE3831 56% 76%,#002395 76% 100%)',
  'KOR':'linear-gradient(180deg,#FFF 0 100%)',
  'CZE':'linear-gradient(180deg,#FFF 0 50%,#D7141A 50% 100%)',
  'CAN':'linear-gradient(90deg,#D52B1E 0 25%,#FFF 25% 75%,#D52B1E 75% 100%)',
  'SUI':'linear-gradient(180deg,#D52B1E 0 100%)',
  'QAT':'linear-gradient(90deg,#FFF 0 22%,#8D1B3D 22% 100%)',
  'BIH':'linear-gradient(135deg,#002F6C 0 100%)',
  'BRA':'linear-gradient(180deg,#009739 0 100%)',
  'MAR':'linear-gradient(180deg,#C1272D 0 100%)',
  'SCO':'linear-gradient(45deg,#005EB8 0 40%,#FFF 40% 60%,#005EB8 60% 100%)',
  'HAI':'linear-gradient(180deg,#00209F 0 50%,#D21034 50% 100%)',
  'USA':'linear-gradient(180deg,#B22234 0 15%,#FFF 15% 30%,#B22234 30% 45%,#FFF 45% 60%,#B22234 60% 75%,#FFF 75% 90%,#B22234 90% 100%)',
  'PAR':'linear-gradient(180deg,#D52B1E 0 33%,#FFF 33% 66%,#0038A8 66% 100%)',
  'AUS':'linear-gradient(135deg,#012169 0 50%,#FFFFFF 50% 60%,#E4002B 60% 100%)',
  'TUR':'linear-gradient(180deg,#E30A17 0 100%)',
  'GER':'linear-gradient(180deg,#000 0 33.33%,#DD0000 33.33% 66.66%,#FFCE00 66.66% 100%)',
  'CUR':'linear-gradient(180deg,#002B7F 0 40%,#F9E814 40% 60%,#002B7F 60% 100%)',
  'CIV':'linear-gradient(90deg,#F77F00 0 33.33%,#FFF 33.33% 66.66%,#009E60 66.66% 100%)',
  'ECU':'linear-gradient(180deg,#FFDD00 0 50%,#034EA2 50% 75%,#EF3340 75% 100%)',
  'NED':'linear-gradient(180deg,#AE1C28 0 33.33%,#FFF 33.33% 66.66%,#21468B 66.66% 100%)',
  'JPN':'radial-gradient(circle at 50% 50%,#BC002D 22%,#FFFFFF 23% 100%)',
  'POL':'linear-gradient(180deg,#FFF 0 50%,#DC143C 50% 100%)',
  'TUN':'linear-gradient(180deg,#E70013 0 100%)',
  'BEL':'linear-gradient(90deg,#000 0 33.33%,#FAE042 33.33% 66.66%,#ED2939 66.66% 100%)',
  'EGY':'linear-gradient(180deg,#CE1126 0 33%,#FFF 33% 66%,#000 66% 100%)',
  'IRN':'linear-gradient(180deg,#239F40 0 33%,#FFF 33% 66%,#DA0000 66% 100%)',
  'NZL':'linear-gradient(180deg,#012169 0 100%)',
  'ESP':'linear-gradient(180deg,#AA151B 0 25%,#F1BF00 25% 75%,#AA151B 75% 100%)',
  'CPV':'linear-gradient(180deg,#003893 0 50%,#FFF 50% 55%,#CF2027 55% 62%,#FFF 62% 67%,#003893 67% 100%)',
  'KSA':'linear-gradient(180deg,#006C35 0 100%)',
  'URU':'linear-gradient(180deg,#0038A8 0 50%,#FFF 50% 100%)',
  'FRA':'linear-gradient(90deg,#002395 0 33.33%,#FFF 33.33% 66.66%,#ED2939 66.66% 100%)',
  'SEN':'linear-gradient(90deg,#00853F 0 33%,#FDEF42 33% 66%,#E31B23 66% 100%)',
  'IRQ':'linear-gradient(180deg,#CE1126 0 33%,#FFF 33% 66%,#000 66% 100%)',
  'NOR':'linear-gradient(90deg,#EF2B2D 0 30%,#002868 30% 40%,#FFF 40% 44%,#002868 44% 56%,#FFF 56% 60%,#002868 60% 70%,#EF2B2D 70% 100%)',
  'ARG':'linear-gradient(180deg,#74ACDF 0 33.33%,#FFF 33.33% 66.66%,#74ACDF 66.66% 100%)',
  'ALG':'linear-gradient(90deg,#006233 0 50%,#FFF 50% 100%)',
  'AUT':'linear-gradient(180deg,#ED2939 0 33%,#FFF 33% 66%,#ED2939 66% 100%)',
  'JOR':'linear-gradient(180deg,#000 0 33%,#FFF 33% 66%,#007A3D 66% 100%)',
  'POR':'linear-gradient(90deg,#006600 0 40%,#FF0000 40% 100%)',
  'COD':'linear-gradient(180deg,#007FFF 0 100%)',
  'UZB':'linear-gradient(180deg,#0099B5 0 33%,#FFF 33% 66%,#1EB53A 66% 100%)',
  'COL':'linear-gradient(180deg,#FCD116 0 50%,#003893 50% 75%,#CE1126 75% 100%)',
  'ENG':'linear-gradient(0deg,#FFF 48%,#CF142B 48% 52%,#FFF 52%)',
  'CRO':'repeating-linear-gradient(90deg,#FF0000 0 14px,#FFF 14px 28px)',
  'GHA':'linear-gradient(180deg,#CE1126 0 33%,#FCD116 33% 66%,#006B3F 66% 100%)',
  'PAN':'conic-gradient(from 0deg at 50% 50%,#005AAA 0 25%,#FFF 25% 50%,#D21034 50% 75%,#FFF 75% 100%)',
  'TBD':'linear-gradient(180deg,#E0E0E0 0 100%)',
};

// Länder-Namen
const NAMES = {
  'MEX':'Mexiko','RSA':'Südafrika','KOR':'Südkorea','CZE':'Tschechien',
  'CAN':'Kanada','SUI':'Schweiz','QAT':'Katar','BIH':'Bosnien-Herz.',
  'BRA':'Brasilien','MAR':'Marokko','SCO':'Schottland','HAI':'Haiti',
  'USA':'USA','PAR':'Paraguay','AUS':'Australien','TUR':'Türkei',
  'GER':'Deutschland','CUR':'Curaçao','CIV':'Elfenbeinküste','ECU':'Ecuador',
  'NED':'Niederlande','JPN':'Japan','POL':'Polen','TUN':'Tunesien',
  'BEL':'Belgien','EGY':'Ägypten','IRN':'Iran','NZL':'Neuseeland',
  'ESP':'Spanien','CPV':'Kap Verde','KSA':'Saudi-Arabien','URU':'Uruguay',
  'FRA':'Frankreich','SEN':'Senegal','IRQ':'Irak','NOR':'Norwegen',
  'ARG':'Argentinien','ALG':'Algerien','AUT':'Österreich','JOR':'Jordanien',
  'POR':'Portugal','COD':'DR Kongo','UZB':'Usbekistan','COL':'Kolumbien',
  'ENG':'England','CRO':'Kroatien','GHA':'Ghana','PAN':'Panama',
  'TBD':'wird ausgelost'
};

// Gruppen-Zuordnung
const GROUPS = {
  A:['MEX','RSA','KOR','CZE'],
  B:['CAN','SUI','QAT','BIH'],
  C:['BRA','MAR','SCO','HAI'],
  D:['USA','PAR','AUS','TUR'],
  E:['GER','CUR','CIV','ECU'],
  F:['NED','JPN','POL','TUN'],
  G:['BEL','EGY','IRN','NZL'],
  H:['ESP','CPV','KSA','URU'],
  I:['FRA','SEN','IRQ','NOR'],
  J:['ARG','ALG','AUT','JOR'],
  K:['POR','COD','UZB','COL'],
  L:['ENG','CRO','GHA','PAN'],
};

// Alle 72 Gruppenspiele + K.o.-Platzhalter.
// Die Anstoßzeiten sind als typische Slots angesetzt (MESZ).
// Du kannst jeden Eintrag leicht editieren — auch Ergebnis nachtragen: score: [2,1]
const MATCHES = [
  // Gruppe A
  { g:'A', home:'MEX', away:'RSA', date:'2026-06-11', time:'21:00', venue:'Aztekenstadion', city:'Mexiko-Stadt', note:'Eröffnungsspiel' },
  { g:'A', home:'KOR', away:'CZE', date:'2026-06-17', time:'19:00', venue:'Mercedes-Benz Stadium', city:'Atlanta' },
  { g:'A', home:'MEX', away:'KOR', date:'2026-06-17', time:'22:00', venue:'Aztekenstadion', city:'Mexiko-Stadt' },
  { g:'A', home:'CZE', away:'RSA', date:'2026-06-22', time:'19:00', venue:'SoFi Stadium', city:'Los Angeles' },
  { g:'A', home:'MEX', away:'CZE', date:'2026-06-24', time:'21:00', venue:'Estadio Akron', city:'Guadalajara' },
  { g:'A', home:'RSA', away:'KOR', date:'2026-06-24', time:'21:00', venue:'Gillette Stadium', city:'Boston' },

  // Gruppe B
  { g:'B', home:'CAN', away:'QAT', date:'2026-06-12', time:'22:00', venue:'BMO Field', city:'Toronto' },
  { g:'B', home:'SUI', away:'BIH', date:'2026-06-16', time:'21:00', venue:'Arrowhead Stadium', city:'Kansas City' },
  { g:'B', home:'CAN', away:'SUI', date:'2026-06-18', time:'22:00', venue:'BC Place', city:'Vancouver' },
  { g:'B', home:'QAT', away:'BIH', date:'2026-06-21', time:'19:00', venue:'NRG Stadium', city:'Houston' },
  { g:'B', home:'CAN', away:'BIH', date:'2026-06-24', time:'18:00', venue:'BMO Field', city:'Toronto' },
  { g:'B', home:'SUI', away:'QAT', date:'2026-06-24', time:'18:00', venue:'Hard Rock Stadium', city:'Miami' },

  // Gruppe C
  { g:'C', home:'BRA', away:'HAI', date:'2026-06-13', time:'22:00', venue:'Mercedes-Benz Stadium', city:'Atlanta' },
  { g:'C', home:'MAR', away:'SCO', date:'2026-06-15', time:'22:00', venue:'Lincoln Financial Field', city:'Philadelphia' },
  { g:'C', home:'BRA', away:'SCO', date:'2026-06-19', time:'22:00', venue:'SoFi Stadium', city:'Los Angeles' },
  { g:'C', home:'MAR', away:'HAI', date:'2026-06-21', time:'22:00', venue:'Estadio Akron', city:'Guadalajara' },
  { g:'C', home:'BRA', away:'MAR', date:'2026-06-25', time:'19:00', venue:'Gillette Stadium', city:'Boston' },
  { g:'C', home:'HAI', away:'SCO', date:'2026-06-25', time:'19:00', venue:'Lincoln Financial Field', city:'Philadelphia' },

  // Gruppe D
  { g:'D', home:'USA', away:'PAR', date:'2026-06-12', time:'19:00', venue:'SoFi Stadium', city:'Los Angeles' },
  { g:'D', home:'AUS', away:'TUR', date:'2026-06-16', time:'01:00', venue:'Levi\'s Stadium', city:'San Francisco Bay' },
  { g:'D', home:'USA', away:'AUS', date:'2026-06-19', time:'19:00', venue:'Lumen Field', city:'Seattle' },
  { g:'D', home:'PAR', away:'TUR', date:'2026-06-21', time:'22:00', venue:'NRG Stadium', city:'Houston' },
  { g:'D', home:'USA', away:'TUR', date:'2026-06-25', time:'22:00', venue:'SoFi Stadium', city:'Los Angeles' },
  { g:'D', home:'AUS', away:'PAR', date:'2026-06-25', time:'22:00', venue:'Lumen Field', city:'Seattle' },

  // Gruppe E — Deutschland
  { g:'E', home:'GER', away:'CUR', date:'2026-06-14', time:'19:00', venue:'NRG Stadium', city:'Houston', de:true },
  { g:'E', home:'CIV', away:'ECU', date:'2026-06-14', time:'22:00', venue:'Arrowhead Stadium', city:'Kansas City' },
  { g:'E', home:'GER', away:'CIV', date:'2026-06-20', time:'22:00', venue:'BMO Field', city:'Toronto', de:true },
  { g:'E', home:'CUR', away:'ECU', date:'2026-06-20', time:'19:00', venue:'Lincoln Financial Field', city:'Philadelphia' },
  { g:'E', home:'GER', away:'ECU', date:'2026-06-25', time:'22:00', venue:'MetLife Stadium', city:'New York/New Jersey', de:true },
  { g:'E', home:'CIV', away:'CUR', date:'2026-06-25', time:'22:00', venue:'AT&T Stadium', city:'Dallas' },

  // Gruppe F
  { g:'F', home:'NED', away:'TUN', date:'2026-06-13', time:'19:00', venue:'MetLife Stadium', city:'New York/New Jersey' },
  { g:'F', home:'JPN', away:'POL', date:'2026-06-15', time:'19:00', venue:'BMO Field', city:'Toronto' },
  { g:'F', home:'NED', away:'POL', date:'2026-06-19', time:'19:00', venue:'Hard Rock Stadium', city:'Miami' },
  { g:'F', home:'JPN', away:'TUN', date:'2026-06-21', time:'22:00', venue:'Levi\'s Stadium', city:'San Francisco Bay' },
  { g:'F', home:'NED', away:'JPN', date:'2026-06-26', time:'19:00', venue:'MetLife Stadium', city:'New York/New Jersey' },
  { g:'F', home:'POL', away:'TUN', date:'2026-06-26', time:'19:00', venue:'BC Place', city:'Vancouver' },

  // Gruppe G
  { g:'G', home:'BEL', away:'NZL', date:'2026-06-13', time:'19:00', venue:'Levi\'s Stadium', city:'San Francisco Bay' },
  { g:'G', home:'EGY', away:'IRN', date:'2026-06-15', time:'22:00', venue:'AT&T Stadium', city:'Dallas' },
  { g:'G', home:'BEL', away:'IRN', date:'2026-06-20', time:'19:00', venue:'Gillette Stadium', city:'Boston' },
  { g:'G', home:'EGY', away:'NZL', date:'2026-06-22', time:'22:00', venue:'Hard Rock Stadium', city:'Miami' },
  { g:'G', home:'BEL', away:'EGY', date:'2026-06-26', time:'22:00', venue:'Mercedes-Benz Stadium', city:'Atlanta' },
  { g:'G', home:'IRN', away:'NZL', date:'2026-06-26', time:'22:00', venue:'Arrowhead Stadium', city:'Kansas City' },

  // Gruppe H
  { g:'H', home:'ESP', away:'CPV', date:'2026-06-13', time:'22:00', venue:'Lumen Field', city:'Seattle' },
  { g:'H', home:'KSA', away:'URU', date:'2026-06-16', time:'22:00', venue:'Estadio BBVA', city:'Monterrey' },
  { g:'H', home:'ESP', away:'KSA', date:'2026-06-20', time:'01:00', venue:'BC Place', city:'Vancouver' },
  { g:'H', home:'CPV', away:'URU', date:'2026-06-22', time:'19:00', venue:'Lincoln Financial Field', city:'Philadelphia' },
  { g:'H', home:'ESP', away:'URU', date:'2026-06-27', time:'19:00', venue:'Lumen Field', city:'Seattle' },
  { g:'H', home:'KSA', away:'CPV', date:'2026-06-27', time:'19:00', venue:'Estadio BBVA', city:'Monterrey' },

  // Gruppe I
  { g:'I', home:'FRA', away:'IRQ', date:'2026-06-14', time:'22:00', venue:'MetLife Stadium', city:'New York/New Jersey' },
  { g:'I', home:'SEN', away:'NOR', date:'2026-06-16', time:'19:00', venue:'Levi\'s Stadium', city:'San Francisco Bay' },
  { g:'I', home:'FRA', away:'NOR', date:'2026-06-20', time:'22:00', venue:'AT&T Stadium', city:'Dallas' },
  { g:'I', home:'SEN', away:'IRQ', date:'2026-06-22', time:'22:00', venue:'Mercedes-Benz Stadium', city:'Atlanta' },
  { g:'I', home:'FRA', away:'SEN', date:'2026-06-27', time:'22:00', venue:'Hard Rock Stadium', city:'Miami' },
  { g:'I', home:'NOR', away:'IRQ', date:'2026-06-27', time:'22:00', venue:'Gillette Stadium', city:'Boston' },

  // Gruppe J
  { g:'J', home:'ARG', away:'JOR', date:'2026-06-15', time:'01:00', venue:'SoFi Stadium', city:'Los Angeles' },
  { g:'J', home:'ALG', away:'AUT', date:'2026-06-17', time:'22:00', venue:'Lincoln Financial Field', city:'Philadelphia' },
  { g:'J', home:'ARG', away:'AUT', date:'2026-06-21', time:'01:00', venue:'NRG Stadium', city:'Houston' },
  { g:'J', home:'ALG', away:'JOR', date:'2026-06-23', time:'22:00', venue:'BMO Field', city:'Toronto' },
  { g:'J', home:'ARG', away:'ALG', date:'2026-06-27', time:'22:00', venue:'MetLife Stadium', city:'New York/New Jersey' },
  { g:'J', home:'AUT', away:'JOR', date:'2026-06-27', time:'22:00', venue:'Lumen Field', city:'Seattle' },

  // Gruppe K
  { g:'K', home:'POR', away:'COD', date:'2026-06-15', time:'22:00', venue:'AT&T Stadium', city:'Dallas' },
  { g:'K', home:'UZB', away:'COL', date:'2026-06-17', time:'01:00', venue:'BC Place', city:'Vancouver' },
  { g:'K', home:'POR', away:'COL', date:'2026-06-21', time:'22:00', venue:'Mercedes-Benz Stadium', city:'Atlanta' },
  { g:'K', home:'UZB', away:'COD', date:'2026-06-23', time:'19:00', venue:'Estadio Akron', city:'Guadalajara' },
  { g:'K', home:'POR', away:'UZB', date:'2026-06-27', time:'22:00', venue:'SoFi Stadium', city:'Los Angeles' },
  { g:'K', home:'COL', away:'COD', date:'2026-06-27', time:'22:00', venue:'Arrowhead Stadium', city:'Kansas City' },

  // Gruppe L
  { g:'L', home:'ENG', away:'PAN', date:'2026-06-16', time:'19:00', venue:'Hard Rock Stadium', city:'Miami' },
  { g:'L', home:'CRO', away:'GHA', date:'2026-06-18', time:'19:00', venue:'Levi\'s Stadium', city:'San Francisco Bay' },
  { g:'L', home:'ENG', away:'GHA', date:'2026-06-22', time:'22:00', venue:'MetLife Stadium', city:'New York/New Jersey' },
  { g:'L', home:'CRO', away:'PAN', date:'2026-06-23', time:'22:00', venue:'Lumen Field', city:'Seattle' },
  { g:'L', home:'ENG', away:'CRO', date:'2026-06-26', time:'22:00', venue:'AT&T Stadium', city:'Dallas' },
  { g:'L', home:'GHA', away:'PAN', date:'2026-06-26', time:'22:00', venue:'Gillette Stadium', city:'Boston' },

  // K.o.-Runde
  { g:'', ko:'Sechzehntelfinale', home:'TBD', away:'TBD', date:'2026-06-28', time:'tba', venue:'wird zugeordnet', city:'USA / Mexiko / Kanada' },
  { g:'', ko:'Achtelfinale',       home:'TBD', away:'TBD', date:'2026-07-04', time:'tba', venue:'wird zugeordnet', city:'USA / Mexiko / Kanada' },
  { g:'', ko:'Viertelfinale',      home:'TBD', away:'TBD', date:'2026-07-09', time:'tba', venue:'wird zugeordnet', city:'USA' },
  { g:'', ko:'Halbfinale',         home:'TBD', away:'TBD', date:'2026-07-14', time:'tba', venue:'AT&T Stadium',    city:'Arlington, Dallas' },
  { g:'', ko:'Halbfinale',         home:'TBD', away:'TBD', date:'2026-07-15', time:'tba', venue:'Mercedes-Benz',    city:'Atlanta' },
  { g:'', ko:'Spiel um Platz 3',   home:'TBD', away:'TBD', date:'2026-07-18', time:'tba', venue:'Hard Rock Stadium', city:'Miami' },
  { g:'', ko:'Finale',             home:'TBD', away:'TBD', date:'2026-07-19', time:'21:00', venue:'MetLife Stadium', city:'New York/New Jersey' },
].map((m, i) => ({ id:'m'+(i+1), score:null, tv:'ARD / ZDF / MagentaTV', ...m,
  stage: m.ko ? m.ko : ('Gruppe '+m.g),
  phase: m.ko ? 'ko' : 'group'
}));

// Helfer
function matchStatus(m) {
  if (m.score) return 'done';
  const now = new Date();
  const t = m.time && m.time !== 'tba' ? m.time : '20:00';
  const matchDate = new Date(`${m.date}T${t}:00`);
  const matchEnd = new Date(matchDate.getTime() + 2.25*60*60*1000);
  if (now >= matchDate && now <= matchEnd) return 'live';
  if (now > matchEnd) return 'done';
  return 'upcoming';
}
const DAYNAMES = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const MONTHSSHORT = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
function formatDate(d) {
  const [y,m,day] = d.split('-');
  const dt = new Date(`${d}T12:00:00`);
  return `${DAYNAMES[dt.getDay()]} ${parseInt(day,10)}. ${MONTHSSHORT[parseInt(m,10)-1]}`;
}
function formatDateLong(d) {
  const [y,m,day] = d.split('-');
  const dt = new Date(`${d}T12:00:00`);
  return `${DAYNAMES[dt.getDay()]}, ${parseInt(day,10)}. ${MONTHSSHORT[parseInt(m,10)-1]} ${y}`;
}
function flag(code) {
  return `<span class="wm-team-flag" style="background:${FLAGS[code] || FLAGS.TBD}"></span>`;
}

// ----------- Render -----------
function renderMatches(filter = 'de', value = null) {
  const list = document.getElementById('wm-cal-list');
  if (!list) return;

  let filtered = MATCHES;
  if (filter === 'de') filtered = MATCHES.filter(m => m.de);
  else if (filter === 'group') filtered = MATCHES.filter(m => m.phase === 'group');
  else if (filter === 'ko') filtered = MATCHES.filter(m => m.phase === 'ko');
  else if (filter === 'date') filtered = MATCHES.filter(m => m.date === value);
  else if (filter === 'group-letter') filtered = MATCHES.filter(m => m.g === value);

  // Nach Datum/Uhrzeit sortieren
  filtered = [...filtered].sort((a,b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const ta = a.time === 'tba' ? '99:99' : a.time;
    const tb = b.time === 'tba' ? '99:99' : b.time;
    return ta.localeCompare(tb);
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="wm-empty">Keine Spiele in dieser Auswahl.</div>';
    return;
  }

  // Bei "Deutschland" und "K.o." ist die Gruppierung nach Datum nicht nötig —
  // einfach alle Karten in einem Grid nebeneinander
  const ungrouped = (filter === 'de' || filter === 'ko' || filter === 'group-letter');

  if (ungrouped) {
    list.innerHTML = `
      <div class="wm-cal-day">
        <div class="wm-cal-daymatches">
          ${filtered.map(m => renderMatchCard(m)).join('')}
        </div>
      </div>
    `;
    attachMatchHandlers(list);
    return;
  }

  // Gruppiere nach Datum für bessere Übersicht
  const byDate = {};
  filtered.forEach(m => { (byDate[m.date] = byDate[m.date] || []).push(m); });

  list.innerHTML = Object.keys(byDate).sort().map(date => {
    const matches = byDate[date];
    return `
      <div class="wm-cal-day">
        <div class="wm-cal-dayhead">${formatDateLong(date)}</div>
        <div class="wm-cal-daymatches">
          ${matches.map(m => renderMatchCard(m)).join('')}
        </div>
      </div>
    `;
  }).join('');

  attachMatchHandlers(list);
}

function renderMatchCard(m) {
  const status = matchStatus(m);
  const scoreOrVs = m.score
    ? `<span class="wm-match-score">${m.score[0]} : ${m.score[1]}</span>`
    : `<span class="wm-match-vs">vs.</span>`;
  const statusLabel = status === 'live' ? 'Live' : status === 'done' ? 'Beendet' : (m.time && m.time !== 'tba' ? m.time + ' MESZ' : 'TBD');
  return `
    <button class="wm-match ${m.de ? 'highlight' : ''}" data-match="${m.id}" aria-label="${NAMES[m.home]} gegen ${NAMES[m.away]}">
      <div class="wm-match-meta">
        <span class="wm-match-stage">${m.stage}${m.note ? ' · ' + m.note : ''}</span>
        <span class="wm-match-status ${status}">${statusLabel}</span>
      </div>
      <div class="wm-match-teams">
        <div class="wm-team">
          ${flag(m.home)}
          <span class="wm-team-name">${NAMES[m.home]}</span>
        </div>
        ${scoreOrVs}
        <div class="wm-team away">
          <span class="wm-team-name">${NAMES[m.away]}</span>
          ${flag(m.away)}
        </div>
      </div>
      <div class="wm-match-foot">
        <span>${m.venue}</span>
        <span>${m.city}</span>
      </div>
    </button>
  `;
}

function attachMatchHandlers(list) {
  list.querySelectorAll('.wm-match').forEach(btn => {
    btn.addEventListener('click', () => openMatch(btn.dataset.match));
  });
}

// ----------- Modal -----------
function openMatch(id) {
  const m = MATCHES.find(x => x.id === id);
  if (!m) return;
  const modal = document.getElementById('wm-modal');
  const body = document.getElementById('wm-modal-body');
  const status = matchStatus(m);

  const scoreHTML = m.score
    ? `<div class="wm-modal-score">${m.score[0]} : ${m.score[1]}</div>
       <div class="wm-modal-score-label">Endstand</div>`
    : status === 'live'
    ? `<div class="wm-modal-score upcoming" style="color:#DD0000">Live</div>`
    : `<div class="wm-modal-score upcoming">vs.</div>
       <div class="wm-modal-score-label">Anpfiff ${m.time && m.time !== 'tba' ? m.time : 'TBD'}</div>`;

  body.innerHTML = `
    <div class="wm-modal-stage">${m.stage}${m.note ? ' · ' + m.note : ''}</div>
    <div class="wm-modal-date">${formatDateLong(m.date)}${m.time && m.time !== 'tba' ? ' · ' + m.time + ' MESZ' : ''}</div>
    <div class="wm-modal-teams">
      <div class="wm-modal-team">
        <span class="flag" style="background:${FLAGS[m.home] || FLAGS.TBD}"></span>
        <span class="name">${NAMES[m.home]}</span>
      </div>
      <div class="wm-modal-score-wrap">${scoreHTML}</div>
      <div class="wm-modal-team">
        <span class="flag" style="background:${FLAGS[m.away] || FLAGS.TBD}"></span>
        <span class="name">${NAMES[m.away]}</span>
      </div>
    </div>
    <div class="wm-modal-info">
      <div class="wm-modal-info-item">
        <div class="k">Stadion</div>
        <div class="v">${m.venue}</div>
      </div>
      <div class="wm-modal-info-item">
        <div class="k">Ort</div>
        <div class="v">${m.city}</div>
      </div>
      <div class="wm-modal-info-item">
        <div class="k">Übertragung</div>
        <div class="v">${m.tv}</div>
      </div>
      <div class="wm-modal-info-item">
        <div class="k">Phase</div>
        <div class="v">${m.stage}</div>
      </div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMatch() {
  const modal = document.getElementById('wm-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ----------- Init -----------
if (document.getElementById('wm-cal-list')) {
  // Alle Filter-Buttons durchdelegieren
  const mainFilters = document.querySelectorAll('.wm-filter');
  mainFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      mainFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Sub-Filter für "Nach Gruppe" und "Nach Datum" ein-/ausblenden
      document.querySelectorAll('.wm-subfilter').forEach(el => el.classList.remove('visible'));
      const sub = btn.dataset.sub;
      if (sub) {
        const el = document.getElementById(sub);
        if (el) el.classList.add('visible');
      }
      const f = btn.dataset.filter;
      if (f === 'group-by-letter') {
        // Default: Gruppe A
        const first = document.querySelector('#wm-groups-sub .wm-sub-btn');
        if (first) {
          document.querySelectorAll('#wm-groups-sub .wm-sub-btn').forEach(b => b.classList.remove('active'));
          first.classList.add('active');
          renderMatches('group-letter', first.dataset.value);
        }
      } else if (f === 'by-date') {
        const first = document.querySelector('#wm-dates-sub .wm-sub-btn');
        if (first) {
          document.querySelectorAll('#wm-dates-sub .wm-sub-btn').forEach(b => b.classList.remove('active'));
          first.classList.add('active');
          renderMatches('date', first.dataset.value);
        }
      } else {
        renderMatches(f);
      }
    });
  });

  // Sub-Filter Handler (Gruppen A-L)
  document.querySelectorAll('#wm-groups-sub .wm-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#wm-groups-sub .wm-sub-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMatches('group-letter', btn.dataset.value);
    });
  });

  // Sub-Filter Handler (Daten)
  document.querySelectorAll('#wm-dates-sub .wm-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#wm-dates-sub .wm-sub-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMatches('date', btn.dataset.value);
    });
  });

  // Modal-Close
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeMatch);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMatch();
  });

  // Start: Deutschland
  renderMatches('de');
}

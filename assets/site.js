(function(){
  var b = document.getElementById('burger');
  var m = document.getElementById('menu');
  if (!b || !m) return;
  var open = false;
  function set(state){
    open = state;
    document.body.classList.toggle('menu-open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    m.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  b.addEventListener('click', function(){ set(!open); });
  m.addEventListener('click', function(e){ if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && open) set(false); });
})();

/* Kontaktformular — mailto-Interim (kein Backend, wie live) */
(function(){
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    function val(sel){ var el = form.querySelector(sel); return el ? el.value.trim() : ''; }
    var texts = form.querySelectorAll('input[type="text"]');
    var name = texts[0] ? texts[0].value.trim() : '';
    var company = texts[1] ? texts[1].value.trim() : '';
    var email = val('input[type="email"]');
    var tel = val('input[type="tel"]');
    var message = val('textarea');
    var subject = 'Anfrage Erstgespräch' + (name ? ' – ' + name : '');
    var body = ['Name: ' + name, 'Unternehmen: ' + company, 'E-Mail: ' + email,
                'Telefon: ' + tel, '', 'Nachricht:', message].join('\n');
    window.location.href = 'mailto:kontakt@b77.de?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.style.display = 'none';
    var ok = document.getElementById('form-success');
    if (ok) ok.classList.add('show');
  });
})();

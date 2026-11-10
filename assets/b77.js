/* B_77: geteiltes Verhalten für Unterseiten, Smooth-Scroll, Reveals, Burger-Menü */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Smooth-Scroll (Lenis). In Opera deaktiviert: dort kollidiert Lenis mit dem eingebauten Smooth-Scroll und macht die Seite kaum scrollbar. */
  var isOpera = /OPR\//.test(navigator.userAgent) || !!window.opr || (navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(function(b){return b.brand==='Opera';}));
  if(!reduce && window.Lenis && !isOpera){
    try{ var lenis=window.lenis=new Lenis({lerp:0.09}); (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(); }catch(e){}
  }

  /* Scroll-Reveals */
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12});
    document.querySelectorAll('[data-r]').forEach(function(el){io.observe(el);});
  } else {
    document.querySelectorAll('[data-r]').forEach(function(el){el.classList.add('in');});
  }

  /* Burger-Menü */
  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  function toggleMenu(open){
    if(!menu||!burger) return;
    var o=(open===undefined)?!menu.classList.contains('open'):open;
    menu.classList.toggle('open',o); burger.classList.toggle('open',o);
    burger.setAttribute('aria-expanded',o); menu.setAttribute('aria-hidden',!o);
    document.body.style.overflow=o?'hidden':'';
  }
  if(burger){
    burger.addEventListener('click',function(){toggleMenu();});
    var menuClose=document.getElementById('menu-close');
    if(menuClose) menuClose.addEventListener('click',function(){toggleMenu(false);});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){toggleMenu(false);});});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') toggleMenu(false); });
  }

  /* Sticky-Header: dezenter Balken blendet beim Scrollen ein (Logo + Burger bleiben lesbar) */
  var navEl=document.querySelector('header.nav');
  if(navEl){
    var onNavScroll=function(){ navEl.classList.toggle('nav--scrolled', window.pageYOffset>40); };
    window.addEventListener('scroll',onNavScroll,{passive:true});
    onNavScroll();
  }

  /* Kontakt-Formular: mailto-Absenden (kein Server, keine Drittweitergabe) */
  var cform=document.getElementById('contact-form');
  if(cform){
    var okBox=document.getElementById('form-success');
    cform.addEventListener('submit',function(e){
      e.preventDefault();
      if(cform.checkValidity && !cform.checkValidity()){ if(cform.reportValidity) cform.reportValidity(); return; }
      var g=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
      var name=g('cf-name'), firma=g('cf-firma'), mail=g('cf-mail'), tel=g('cf-tel'), msg=g('cf-msg');
      var subj='Erstgespräch-Anfrage'+(name?' · '+name:'')+(firma?' ('+firma+')':'');
      var body='Name: '+name+'\nUnternehmen: '+firma+'\nE-Mail: '+mail+'\nTelefon: '+tel+'\n\nWorum geht es:\n'+msg+'\n';
      window.location.href='mailto:kontakt@b77.de?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
      cform.style.display='none';
      if(okBox) okBox.classList.add('is-visible');
    });
  }
})();

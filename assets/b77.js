/* B_77: geteiltes Verhalten für Unterseiten, Smooth-Scroll, Reveals, Burger-Menü */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Smooth-Scroll (Lenis) */
  if(!reduce && window.Lenis){
    try{ var lenis=new Lenis({lerp:0.09}); (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(); }catch(e){}
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
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){toggleMenu(false);});});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') toggleMenu(false); });
  }
})();

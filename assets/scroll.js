/* B_77 — Scroll-Basis: Reveal, Fortschrittsbalken, Count-up, sanfte Parallax.
   Vanilla, GPU-schonend (transform/opacity), respektiert prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) return;

  function inCheck(el) { return el.closest && el.closest('.checkpage'); }

  /* ---- Scroll-Reveal (gestaffelt in Grids) ---- */
  var grids = document.querySelectorAll('.grid, .stats, .mag, .chips, .ki');
  Array.prototype.forEach.call(grids, function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) {
      if (inCheck(c)) return;
      c.classList.add('reveal');
      c.style.setProperty('--rd', (i * 70) + 'ms');
    });
    g.setAttribute('data-reveal-children', '');
  });
  var blocks = document.querySelectorAll('.phead .wrap > *, main section .wrap > *');
  Array.prototype.forEach.call(blocks, function (el) {
    if (inCheck(el)) return;
    if (el.classList.contains('reveal') || el.hasAttribute('data-reveal-children')) return;
    el.classList.add('reveal');
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---- Count-up (In Zahlen) ---- */
  function countUp(nEl) {
    var lead = nEl.firstChild;
    if (!lead || lead.nodeType !== 3) return;
    var m = String(nEl.getAttribute('data-target') || '').match(/(\d+)(\D*)/);
    if (!m) return;
    var target = +m[1], suf = m[2] || '', dur = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      lead.textContent = Math.round(target * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var stats = document.querySelectorAll('.stat .n');
  if (stats.length) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); sio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(stats, function (el) {
      var lead = el.firstChild;
      if (lead && lead.nodeType === 3) {
        el.setAttribute('data-target', lead.textContent.trim());
        lead.textContent = '0';
      }
      sio.observe(el);
    });
  }

  /* ---- Sanfte Bild-Parallax (Hero + media) ---- */
  var pxEls = [];
  document.querySelectorAll('.hero__card img, .media img').forEach(function (img) {
    pxEls.push(img);
    img.style.willChange = 'transform';
  });
  var ticking = false;
  function px() {
    var vh = window.innerHeight, vc = vh / 2;
    for (var i = 0; i < pxEls.length; i++) {
      var img = pxEls[i], r = img.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) continue;
      var c = r.top + r.height / 2, off = (c - vc) / vh;
      var y = (-off * 22).toFixed(1);
      img.style.transform = 'scale(1.08) translateY(' + y + 'px)';
    }
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(px); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { px(); }, { passive: true });
  px();
})();

/* ============================================================
   B_77 — Monolith: Bewegung
   1) Decode-Scramble auf den Leistungs-Zeilen (eigene Buchstaben)
   2) Dezentes Scroll-Reveal pro Sektion
   3) Mobile-Nav (Burger)
   prefers-reduced-motion: alles überspringen, Endzustand sofort.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1) (entfernt) Decode-Scramble --------------------------------- */
  // Der Buchstaben-Scramble beim Hover wurde entfernt (kein „Gewackel").
  // Der schwarze Flächen-Hover für Links lebt jetzt rein in CSS (a.il-row:hover).
  function initDecode() {}

  /* ---- 2) Scroll-Reveal -------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add("in"); });
      return;
    }
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
    // Bereits sichtbare Sektionen sofort zeigen.
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(targets, function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("in");
      });
    });
  }

  /* ---- 3) Mobile-Nav ----------------------------------------------- */
  function initNav() {
    var burger = document.querySelector(".nav__burger");
    var menu = document.querySelector(".nav__mobile");
    if (!burger || !menu) return;
    var nav = burger.closest(".nav");
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      if (nav) nav.classList.toggle("nav--menu-open", open);
      burger.textContent = open ? "Schließen" : "Menü";
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- 4) Floating-Nav: über dem Poster transparent, ab dem hellen Bereich solide ---- */
  function initFloatingNav() {
    var nav = document.querySelector(".nav--floating");
    if (!nav) return;
    var hero = document.querySelector(".hero-poster, .hb, .ph");
    function upd() {
      var th = hero ? hero.offsetHeight - nav.offsetHeight - 4 : 240;
      nav.classList.toggle("is-solid", (window.scrollY || window.pageYOffset) > th);
    }
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd, { passive: true });
  }

  /* ---- 5) Kinetic-Grid: interaktiver Raster-Hintergrund (Monolith, hell) ----
     Fixer, transparenter Overlay-Canvas ganz hinten (z-index:-1). Scheint durch
     alle transparenten hellen Sektionen; dunkle Sektionen und der Footer decken
     ihn ab. Dunkle Linien auf Weiss, warpt zum Cursor, Ripple bei Klick. */
  function initGrid() {
    if (!document.body) return;
    var canvas = document.createElement("canvas");
    canvas.className = "mono-grid";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var CELL = 56, INFLUENCE = 260, MAX_WARP = 22, LERP = 0.09;
    var W = 0, H = 0, dpr = 1;
    var mouse = { x: -9999, y: -9999 }, target = { x: -9999, y: -9999 };
    var ripples = [];
    var LB = [15,15,15,0.085], LA = [15,15,15,0.55];  /* Linie: Ruhe / aktiv */
    var NB = [15,15,15,0.13],  NA = [15,15,15,0.9];   /* Knoten: Ruhe / aktiv */
    var staticMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || window.matchMedia("(hover: none)").matches;

    function lerp(a,b,t){ return a+(b-a)*t; }
    function col(base, active, t){
      var r=Math.round(lerp(base[0],active[0],t)), g=Math.round(lerp(base[1],active[1],t)), b=Math.round(lerp(base[2],active[2],t));
      return "rgba("+r+","+g+","+b+","+lerp(base[3],active[3],t).toFixed(3)+")";
    }
    function resize(){
      W = window.innerWidth; H = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W*dpr); canvas.height = Math.round(H*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    window.addEventListener("resize", function(){ resize(); if (staticMode) draw(0); }, { passive:true });

    function warp(gx, gy, c, r, cols, rows){
      var em = 1.5;
      var pin = Math.pow(Math.min(c/em,(cols-1-c)/em,1),2) * Math.pow(Math.min(r/em,(rows-1-r)/em,1),2);
      var dx = gx-mouse.x, dy = gy-mouse.y, dist = Math.sqrt(dx*dx+dy*dy);
      var prox = Math.max(0, 1-dist/INFLUENCE) * pin;
      var rx=0, ry=0;
      for (var i=0;i<ripples.length;i++){
        var rp=ripples[i], rdx=gx-rp.x, rdy=gy-rp.y, rd=Math.sqrt(rdx*rdx+rdy*rdy), ww=55, diff=rd-rp.radius;
        if (Math.abs(diff)<ww){
          var str=(1-Math.abs(diff)/ww)*rp.opacity*16*pin, ang=Math.atan2(rdy,rdx), sign=diff<0?-1:1;
          rx += Math.cos(ang)*str*sign*-1; ry += Math.sin(ang)*str*sign*-1;
        }
      }
      if (dist<INFLUENCE && dist>0 && pin>0){
        var t=dist/INFLUENCE, eased=t<0.01?0:(1-t)*(1-t)*Math.min(1,dist/60), wa=eased*MAX_WARP*pin, a=Math.atan2(dy,dx);
        return { x: gx-Math.cos(a)*wa+rx, y: gy-Math.sin(a)*wa+ry, p: prox };
      }
      return { x: gx+rx, y: gy+ry, p: prox };
    }

    function draw(now){
      ctx.clearRect(0,0,W,H);
      for (var i=ripples.length-1;i>=0;i--){
        var age=(now-ripples[i].born)/1000;
        ripples[i].radius=Math.max(0,age*420); ripples[i].opacity=Math.max(0,1-age*1.2);
        if (ripples[i].opacity<=0) ripples.splice(i,1);
      }
      var cols=Math.max(2,Math.ceil(W/CELL))+1, rows=Math.max(2,Math.ceil(H/CELL))+1;
      var cw=W/(cols-1), ch=H/(rows-1), P=[], PR=[];
      for (var r=0;r<rows;r++){ P[r]=[]; PR[r]=[]; for (var c=0;c<cols;c++){ var w=warp(c*cw,r*ch,c,r,cols,rows); P[r][c]={x:w.x,y:w.y}; PR[r][c]=w.p; } }
      function seg(p1,p2,a,b){ var t=((a+b)/2); t=t*t*(3-2*t); ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.strokeStyle=col(LB,LA,t); ctx.lineWidth=lerp(0.7,1.4,t); ctx.stroke(); }
      for (var r=0;r<rows;r++) for (var c=0;c<cols-1;c++) seg(P[r][c],P[r][c+1],PR[r][c],PR[r][c+1]);
      for (var c=0;c<cols;c++) for (var r=0;r<rows-1;r++) seg(P[r][c],P[r+1][c],PR[r][c],PR[r+1][c]);
      for (var r=0;r<rows;r++) for (var c=0;c<cols;c++){
        var p=P[r][c], t=PR[r][c]; t=t*t*(3-2*t); var rad=lerp(1.5,3.0,t);
        if (t>0.3){
          var gr=rad+lerp(0,6,(t-0.3)/0.7), grd=ctx.createRadialGradient(p.x,p.y,rad*0.5,p.x,p.y,gr);
          grd.addColorStop(0,"rgba(15,15,15,"+(t*0.22).toFixed(3)+")"); grd.addColorStop(1,"rgba(15,15,15,0)");
          ctx.beginPath(); ctx.arc(p.x,p.y,gr,0,6.283185); ctx.fillStyle=grd; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.x,p.y,rad,0,6.283185); ctx.fillStyle=col(NB,NA,t); ctx.fill();
      }
      for (var i=0;i<ripples.length;i++){ var rr=ripples[i]; ctx.beginPath(); ctx.arc(rr.x,rr.y,Math.max(0,rr.radius),0,6.283185); ctx.strokeStyle="rgba(15,15,15,"+(rr.opacity*0.22).toFixed(3)+")"; ctx.lineWidth=1.3; ctx.stroke(); }
    }

    if (staticMode){ draw(0); return; }
    window.addEventListener("mousemove", function(e){ target.x=e.clientX; target.y=e.clientY; }, { passive:true });
    window.addEventListener("click", function(e){ ripples.push({ x:e.clientX, y:e.clientY, radius:0, opacity:1, born:performance.now() }); });
    (function loop(now){ mouse.x=lerp(mouse.x,target.x,LERP); mouse.y=lerp(mouse.y,target.y,LERP); draw(now||0); requestAnimationFrame(loop); })(performance.now());
  }

  /* ---- 6) Spline-3D einbetten (robust, kein First-Load-Race) ----
     Jedes Element mit data-spline="<szene-url>" bekommt einen <spline-viewer>.
     Wichtig: Der Viewer wird erst erzeugt, wenn das Custom-Element definiert ist
     (customElements.whenDefined) — sonst rendert er beim ersten (kalten) Laden
     nicht. Nach dem Laden: Badge entfernen + Resize-Nudge fuer korrekte Groesse. */
  function initSpline() {
    var mounts = document.querySelectorAll("[data-spline]");
    if (!mounts.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var scriptAdded = false;
    function ensureScript() {
      if (scriptAdded) return;
      if (window.customElements && customElements.get("spline-viewer")) return;
      scriptAdded = true;
      var s = document.createElement("script");
      s.type = "module";
      s.src = "/assets/spline/spline-viewer.js";  /* selbst-gehostet (keine externe CDN, blocker-sicher) */
      document.head.appendChild(s);
    }

    function mountOne(el) {
      if (el.__splined) return;
      el.__splined = true;
      ensureScript();
      function go() {
        var v = document.createElement("spline-viewer");
        v.setAttribute("url", el.getAttribute("data-spline"));
        v.setAttribute("loading-anim-type", "none");
        el.appendChild(v);
        function killBadge() {
          try {
            var root = v.shadowRoot;
            if (!root) return false;
            var logo = root.querySelector("#logo") || root.querySelector('a[href*="spline.design"]');
            if (logo) { logo.remove(); return true; }
          } catch (e) {}
          return false;
        }
        v.addEventListener("load", function () {
          killBadge();
          try { window.dispatchEvent(new Event("resize")); } catch (e) {}
        });
        var tries = 0, iv = setInterval(function () { if (killBadge() || ++tries > 60) clearInterval(iv); }, 100);
      }
      if (window.customElements) { customElements.whenDefined("spline-viewer").then(go); }
      else { go(); }
    }

    // WICHTIG: nur mounten, wenn das Element wirklich (fast) im Viewport ist —
    // niemals blind offscreen. Sonst initialisiert der Spline-Viewer verdeckt
    // (z.B. unter dem Fold hinter dem Intro) und bleibt leer. Der Viewer wird
    // erst erzeugt, wenn die Box beim Scrollen sichtbar wird -> rendert sofort.
    Array.prototype.forEach.call(mounts, function (el) {
      function near() {
        var r = el.getBoundingClientRect();
        return r.top < (window.innerHeight * 1.25) && r.bottom > (-window.innerHeight * 0.25);
      }
      var done = false, io = null, poll = null;
      function cleanup() {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
        if (io) io.disconnect();
        if (poll) clearInterval(poll);
      }
      function fire() { if (done) return; done = true; cleanup(); mountOne(el); }
      function check() { if (!done && near()) fire(); }
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) fire(); });
        }, { rootMargin: "150px" });
        io.observe(el);
      }
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check, { passive: true });
      poll = setInterval(check, 600); // Fallback-Poll (kein blindes Offscreen-Mounten)
      check(); // sofort, falls schon sichtbar (z.B. FoS-Hero)
    });
  }

  function init() { initDecode(); initReveal(); initNav(); initFloatingNav(); initGrid(); initSpline(); }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();

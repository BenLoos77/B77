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

  /* ---- 1) Decode-Scramble ------------------------------------------ */
  // Der Titel decodiert sich aus SEINEN EIGENEN Buchstaben (kein Gibberish).
  function scramble(el, pool, step) {
    var finalText = el.dataset.final || (el.dataset.final = el.textContent);
    var src = pool || finalText.replace(/\s+/g, "").split("");
    var it = 0;
    clearInterval(el._iv);
    el._iv = setInterval(function () {
      el.textContent = finalText.split("").map(function (c, i) {
        return c === " " ? " "
          : (i < it ? finalText[i] : src[(Math.random() * src.length) | 0]);
      }).join("");
      if (it >= finalText.length) { clearInterval(el._iv); el.textContent = finalText; }
      it += (step || 0.5);
    }, 32);
  }

  function initDecode() {
    var rows = document.querySelectorAll(".il-row");
    Array.prototype.forEach.call(rows, function (row) {
      var label = row.querySelector(".il-title");
      var idx = row.querySelector(".il-idx");
      if (!label) return;
      // Endzustand vormerken (für Reduced-Motion-Fallback)
      label.dataset.final = label.textContent;
      if (idx) idx.dataset.final = idx.textContent;
      if (reduce) return;
      row.addEventListener("mouseenter", function () {
        scramble(label);
        if (idx) scramble(idx, "0123456789".split(""), 0.7);
      });
    });
  }

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
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.textContent = open ? "Schließen" : "Menü";
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- 4) Floating-Nav: über dem Poster transparent, ab dem hellen Bereich solide ---- */
  function initFloatingNav() {
    var nav = document.querySelector(".nav--floating");
    if (!nav) return;
    var hero = document.querySelector(".hero-poster");
    function upd() {
      var th = hero ? hero.offsetHeight - nav.offsetHeight - 4 : 240;
      nav.classList.toggle("is-solid", (window.scrollY || window.pageYOffset) > th);
    }
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd, { passive: true });
  }

  function init() { initDecode(); initReveal(); initNav(); initFloatingNav(); }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();

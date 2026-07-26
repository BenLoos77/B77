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

  function init() { initDecode(); initReveal(); initNav(); initFloatingNav(); }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();

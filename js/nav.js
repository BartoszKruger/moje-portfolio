/* ══════════════════════════════════════════════════════════════
   NAVIGATION — Header scroll effects & mobile navigation
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // ── Active section tracking (home view) ──
  const sections = ['about', 'projects', 'contact'];
  const navAnchors = {};
  document.querySelectorAll('a[data-nav]').forEach(a => {
    navAnchors[a.dataset.nav] = a;
  });

  let ticking = false;
  function updateActiveOnScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const viewHome = document.getElementById('view-home');
        if (!viewHome || !viewHome.classList.contains('view--active')) return;

        const scrollPos = window.scrollY + 160;
        let activeSection = null;

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollPos) {
            activeSection = id;
          }
        }

        Object.entries(navAnchors).forEach(([key, anchor]) => {
          anchor.classList.toggle('nav--active', key === activeSection);
        });

        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });

  // ── Mobile hamburger ──
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('header__hamburger--active');
      navLinks.classList.toggle('header__nav--open');
    });

    // Close on navigation link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('header__hamburger--active');
        navLinks.classList.remove('header__nav--open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('header__hamburger--active');
        navLinks.classList.remove('header__nav--open');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hamburger.classList.remove('header__hamburger--active');
        navLinks.classList.remove('header__nav--open');
      }
    });
  }
})();

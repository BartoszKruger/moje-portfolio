/* ══════════════════════════════════════════════════════════════
   ANIMATIONS — Modernist Scroll Reveal & Micro-Interactions
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Scroll Reveal via IntersectionObserver ──
  function initScrollReveal() {
    const selectors = [
      '.hero-wrap',
      '.skills-row',
      '.project-window',
      '.detail-card',
      '.physics-card',
      '.qa-item',
      '.viewport-card',
      '.pdf-card',
      '.module-item',
      '.contact-wrap'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    elements.forEach((el) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal')) : [el];
        const siblingIndex = siblings.indexOf(el);
        el.style.transitionDelay = `${siblingIndex * 40}ms`;
      }
      observer.observe(el);
    });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  // Expose for router to re-trigger on view change
  window.initScrollReveal = initScrollReveal;
})();

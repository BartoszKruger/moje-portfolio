/* ════════════════════════════════════════
   SPA ROUTER — Hash-based view routing
   ════════════════════════════════════════ */
(function () {
  'use strict';

  const views = {
    home: document.getElementById('view-home'),
    'cuckoo-clock': document.getElementById('view-cuckoo-clock'),
    'free-fall': document.getElementById('view-free-fall'),
  };

  let currentView = 'home';

  /**
   * Navigate to a view.
   * @param {string} viewName - 'home', 'cuckoo-clock', 'free-fall'
   * @param {object} opts
   * @param {boolean} opts.pushState - whether to update URL hash
   * @param {string}  opts.scrollTo  - section ID to scroll to (home view only)
   */
  function navigateTo(viewName, opts = {}) {
    const { pushState = true, scrollTo = null } = opts;

    // Validate view exists
    if (!views[viewName]) viewName = 'home';

    // Hide all views
    Object.values(views).forEach(v => v.classList.remove('view--active'));

    // Show target view
    views[viewName].classList.add('view--active');
    currentView = viewName;

    // Scroll handling
    if (scrollTo && viewName === 'home') {
      // Delay to let DOM paint
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Update URL hash
    if (pushState) {
      const hash = viewName === 'home' ? (scrollTo ? `#${scrollTo}` : '') : `#project/${viewName}`;
      history.pushState({ view: viewName, scrollTo }, '', hash || window.location.pathname);
    }

    // Update nav active states
    updateNavActive(viewName, scrollTo);

    // Re-trigger scroll-based animations
    if (window.initScrollReveal) window.initScrollReveal();
  }

  function updateNavActive(viewName, section) {
    document.querySelectorAll('.header__nav-link[data-nav], .nav__links a[data-nav]').forEach(a => {
      a.classList.remove('nav--active');
      if (viewName === 'home' && a.dataset.nav === section) {
        a.classList.add('nav--active');
      }
    });
  }

  // Parse hash on load
  function parseHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('project/')) {
      return { view: hash.replace('project/', ''), scrollTo: null };
    }
    // It's a section anchor on home
    return { view: 'home', scrollTo: hash || null };
  }

  // ── Event Delegation ──

  // Project cards & back links → navigate to detail page or home
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-route]');
    if (!card) return;

    e.preventDefault();
    const route = card.dataset.route;
    const targetScroll = card.dataset.scroll || (route === 'home' ? 'projects' : null);

    if (route === 'home') {
      navigateTo('home', { scrollTo: targetScroll });
    } else {
      navigateTo(route);
    }
  });

  // Keyboard accessibility for project cards
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('[data-route]');
      if (card && card.tagName !== 'BUTTON' && card.tagName !== 'A') {
        e.preventDefault();
        navigateTo(card.dataset.route);
      }
    }
  });

  // Nav section links — smooth scroll on home, navigate back if on detail page
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't interfere with data-route links
      if (link.dataset.route) return;

      e.preventDefault();
      const section = link.dataset.nav;

      if (currentView !== 'home') {
        navigateTo('home', { scrollTo: section });
      } else {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', `#${section}`);
          updateNavActive('home', section);
        }
      }

      // Close mobile menu if open
      document.getElementById('navLinks')?.classList.remove('header__nav--open');
      document.getElementById('hamburger')?.classList.remove('header__hamburger--active');
    });
  });

  // Gallery thumbnail clicks — swap hero image
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.gallery__thumb');
    if (!thumb) return;

    const gallery = thumb.closest('.project-detail__gallery');
    if (!gallery) return;

    const heroImg = gallery.querySelector('.gallery__hero img');
    const heroWrap = gallery.querySelector('.gallery__hero');
    const newSrc = thumb.dataset.lightbox;

    if (heroImg && newSrc) {
      heroImg.src = newSrc;
      heroWrap.dataset.lightbox = newSrc;
      gallery.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('gallery__thumb--active'));
      thumb.classList.add('gallery__thumb--active');
    }
  });

  // Back/forward browser navigation
  window.addEventListener('popstate', (e) => {
    const state = e.state;
    if (state) {
      navigateTo(state.view, { pushState: false, scrollTo: state.scrollTo });
    } else {
      const { view, scrollTo } = parseHash();
      navigateTo(view, { pushState: false, scrollTo });
    }
  });

  // Initial route
  const initial = parseHash();
  navigateTo(initial.view, { pushState: false, scrollTo: initial.scrollTo });

  // Expose for other modules
  window.navigateTo = navigateTo;
})();

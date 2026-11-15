/* ════════════════════════════════════════
   LIGHTBOX — Full-resolution image viewer with captions
   ════════════════════════════════════════ */
(function () {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  function openLightbox(src, caption = '') {
    lightboxImage.src = src;
    lightboxImage.alt = caption || 'Full resolution view';
    
    if (lightboxCaption) {
      if (caption) {
        lightboxCaption.textContent = caption;
        lightboxCaption.style.display = 'block';
      } else {
        lightboxCaption.textContent = '';
        lightboxCaption.style.display = 'none';
      }
    }

    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap focus
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Clear image after transition
    setTimeout(() => {
      lightboxImage.src = '';
      if (lightboxCaption) lightboxCaption.textContent = '';
    }, 300);
  }

  // Open on click of any [data-lightbox] element
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox]');
    if (!trigger) return;

    // Don't open lightbox for gallery thumbs (they swap hero preview if present)
    if (trigger.classList.contains('gallery__thumb')) return;

    e.preventDefault();
    e.stopPropagation();
    const src = trigger.dataset.lightbox;
    const caption = trigger.dataset.caption || trigger.getAttribute('title') || trigger.querySelector('img')?.alt || '';
    openLightbox(src, caption);
  });

  // Close
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content') || e.target === lightbox.querySelector('.lightbox__figure')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });

  // Expose
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
})();

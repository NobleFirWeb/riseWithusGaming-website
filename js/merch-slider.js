/* ═══════════════════════════════════════════════════
   Rise With Us Gaming — Reusable GSAP Draggable Slider
   Powers both the merch slider and the video slider.

   createSlider(config):
     trackId      — id of the scrolling track div
     viewportId   — id of the overflow:hidden container
     prevId       — id of the ‹ button
     nextId       — id of the › button
     cardClass    — class name used to find individual cards
     cardsVisible — function(windowWidth) → number of visible cards
     setCardSizes — optional function to resize cards on init/resize
═══════════════════════════════════════════════════ */

function createSlider({ trackId, viewportId, prevId, nextId, cardClass, visibleFn, sizeFn }) {

  const track    = document.getElementById(trackId);
  const viewport = document.getElementById(viewportId);
  const prevBtn  = document.getElementById(prevId);
  const nextBtn  = document.getElementById(nextId);
  const cards    = track ? Array.from(track.querySelectorAll('.' + cardClass)) : [];

  if (!track || !viewport || !cards.length || !prevBtn || !nextBtn) return;

  // ── Card sizing (optional) ────────────────────────
  function setCardSizes() {
    if (typeof sizeFn === 'function') {
      sizeFn(cards, viewport, visibleFn);
    }
  }

  function cardStep() {
    return cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || 16);
  }

  function maxNegX() {
    return -(track.scrollWidth - viewport.offsetWidth);
  }

  function clampX(x) {
    return Math.max(maxNegX(), Math.min(0, x));
  }

  let currentX = 0;

  // ── GSAP Draggable ────────────────────────────────
  const [draggable] = Draggable.create(track, {
    type: 'x',
    edgeResistance: 0.9,
    bounds: viewport,
    onDragStart() { viewport.style.cursor = 'grabbing'; },
    onDragEnd() {
      viewport.style.cursor = 'grab';
      currentX = this.x;
      snapToNearest();
    },
  });

  function snapToNearest() {
    const step    = cardStep();
    const snapped = Math.round(currentX / step) * step;
    currentX = clampX(snapped);
    gsap.to(track, {
      x: currentX,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => { draggable.update(); updateArrows(); },
    });
  }

  function slideTo(x) {
    currentX = clampX(x);
    gsap.to(track, {
      x: currentX,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => { draggable.update(); updateArrows(); },
    });
  }

  function updateArrows() {
    const atStart = currentX >= -1;
    const atEnd   = currentX <= maxNegX() + 1;
    gsap.to(prevBtn, { opacity: atStart ? 0.3 : 1, duration: 0.2 });
    gsap.to(nextBtn, { opacity: atEnd   ? 0.3 : 1, duration: 0.2 });
    prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
    nextBtn.style.pointerEvents = atEnd   ? 'none' : 'auto';
  }

  prevBtn.addEventListener('click', () => slideTo(currentX + cardStep()));
  nextBtn.addEventListener('click', () => slideTo(currentX - cardStep()));

  // ── Resize ────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setCardSizes();
      currentX = clampX(currentX);
      gsap.set(track, { x: currentX });
      draggable.applyBounds(viewport);
      draggable.update();
      updateArrows();
    }, 100);
  });

  // ── Init ──────────────────────────────────────────
  setCardSizes();
  gsap.set(track, { x: 0 });
  updateArrows();
}


/* ───────────────────────────────────────────────────
   MERCH SLIDER
   4 cards desktop · 2 tablet · 1 mobile
─────────────────────────────────────────────────── */
function initMerchSlider() {
  createSlider({
    trackId:    'merch-track',
    viewportId: 'merch-viewport',
    prevId:     'merch-prev',
    nextId:     'merch-next',
    cardClass:  'merch-card',
    visibleFn:  (w) => w < 640 ? 1 : w < 1024 ? 2 : 4,
    sizeFn: (cards, viewport, visibleFn) => {
      const n   = visibleFn(window.innerWidth);
      const gap = 16;
      const w   = Math.floor((viewport.offsetWidth - (n - 1) * gap) / n);
      cards.forEach(c => { c.style.width = w + 'px'; });
    },
  });
}


/* ───────────────────────────────────────────────────
   VIDEO SLIDER
   3 cards desktop · 2 tablet · 1 mobile
─────────────────────────────────────────────────── */
function initVideoSlider() {
  createSlider({
    trackId:    'video-track',
    viewportId: 'video-viewport',
    prevId:     'video-prev',
    nextId:     'video-next',
    cardClass:  'video-card',
    visibleFn:  (w) => w < 640 ? 1 : w < 1024 ? 2 : 3,
    sizeFn: (cards, viewport, visibleFn) => {
      const n   = visibleFn(window.innerWidth);
      const gap = 24; // 1.5rem
      const w   = Math.floor((viewport.offsetWidth - (n - 1) * gap) / n);
      cards.forEach(c => { c.style.width = w + 'px'; });
    },
  });
}


/* ───────────────────────────────────────────────────
   Boot both sliders after DOM is ready
─────────────────────────────────────────────────── */
(function () {
  function boot() {
    if (typeof Draggable === 'undefined' || typeof gsap === 'undefined') {
      requestAnimationFrame(boot);
      return;
    }
    initMerchSlider();
    initVideoSlider();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

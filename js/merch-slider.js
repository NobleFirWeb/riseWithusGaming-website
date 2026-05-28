/* ═══════════════════════════════════════════════════
   Rise With Us Gaming — Merch Slider
   GSAP Draggable horizontal carousel
   • Desktop  (≥1024px) : 4 cards visible, arrow steps 1 card
   • Tablet   (640–1023px): 2 cards visible, arrow steps 1 card
   • Mobile   (<640px)  : 1 card visible,  arrow steps 1 card
═══════════════════════════════════════════════════ */

(function () {

  function initMerchSlider() {
    const track    = document.getElementById('merch-track');
    const viewport = document.getElementById('merch-viewport');
    const prevBtn  = document.getElementById('merch-prev');
    const nextBtn  = document.getElementById('merch-next');
    const cards    = track ? Array.from(track.querySelectorAll('.merch-card')) : [];

    if (!track || !viewport || !cards.length || !prevBtn || !nextBtn) return;

    // ── Responsive helpers ────────────────────────────
    function cardsVisible() {
      const w = window.innerWidth;
      if (w < 640)  return 1;
      if (w < 1024) return 2;
      return 4;
    }

    function setCardSizes() {
      const n   = cardsVisible();
      const gap = 16; // 1rem
      const vw  = viewport.offsetWidth;
      // Each card fills an equal share of the viewport minus the gaps between visible cards
      const w   = Math.floor((vw - (n - 1) * gap) / n);
      cards.forEach(c => {
        c.style.width = w + 'px';
        // Also resize the placeholder icon proportionally
        const icon = c.querySelector('svg.w-20');
        if (icon) {
          const sz = Math.max(48, Math.round(w * 0.22));
          icon.style.width  = sz + 'px';
          icon.style.height = sz + 'px';
        }
      });
    }

    function cardStep() {
      // Width of one card + one gap
      return cards[0].offsetWidth + 16;
    }

    function maxNegX() {
      // How far left we can scroll
      return -(track.scrollWidth - viewport.offsetWidth);
    }

    function clampX(x) {
      return Math.max(maxNegX(), Math.min(0, x));
    }

    // ── State ─────────────────────────────────────────
    let currentX = 0;

    // ── GSAP Draggable ────────────────────────────────
    const [draggable] = Draggable.create(track, {
      type: 'x',
      edgeResistance: 0.9,
      bounds: viewport,          // use the viewport element as bounds
      onDragStart() {
        viewport.style.cursor = 'grabbing';
      },
      onDragEnd() {
        viewport.style.cursor = 'grab';
        currentX = this.x;
        snapToNearest();
        updateArrows();
      },
    });

    // ── Snap to nearest card boundary after drag ──────
    function snapToNearest() {
      const step = cardStep();
      const snapped = Math.round(currentX / step) * step;
      currentX = clampX(snapped);
      gsap.to(track, {
        x: currentX,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          draggable.update();
          updateArrows();
        },
      });
    }

    // ── Arrow navigation ──────────────────────────────
    function slideTo(x) {
      currentX = clampX(x);
      gsap.to(track, {
        x: currentX,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          draggable.update();
          updateArrows();
        },
      });
    }

    prevBtn.addEventListener('click', () => slideTo(currentX + cardStep()));
    nextBtn.addEventListener('click', () => slideTo(currentX - cardStep()));

    // ── Arrow opacity feedback ────────────────────────
    function updateArrows() {
      const atStart = currentX >= -1;
      const atEnd   = currentX <= maxNegX() + 1;
      gsap.to(prevBtn, { opacity: atStart ? 0.3 : 1, duration: 0.2 });
      gsap.to(nextBtn, { opacity: atEnd   ? 0.3 : 1, duration: 0.2 });
      prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      nextBtn.style.pointerEvents = atEnd   ? 'none' : 'auto';
    }

    // ── Resize handler ────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setCardSizes();
        // Re-clamp position in case viewport got wider
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

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMerchSlider);
  } else {
    initMerchSlider();
  }

})();

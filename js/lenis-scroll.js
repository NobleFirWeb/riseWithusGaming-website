/* ═══════════════════════════════════════════════════
   Rise With Us Gaming — Lenis Smooth Scroll
   Wired into GSAP ticker so ScrollTrigger stays in sync.
═══════════════════════════════════════════════════ */

(function () {

  // Wait for both Lenis and GSAP to be available
  function init() {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') {
      requestAnimationFrame(init);
      return;
    }

    const lenis = new Lenis({
      // How long (seconds) a scroll gesture takes to settle
      duration: 0.2,

      // Smooth cubic ease — feels natural, not floaty
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

      // Don't override native touch scroll on mobile — feels wrong there
      smoothTouch: false,

      // Sync with browser's native wheel direction
      wheelMultiplier: 1,

      // Prevent Lenis from capturing touch on mobile (let CSS handle it)
      touchMultiplier: 1.5,

      // Keep infinite scroll from fighting the page
      infinite: false,
    });

    // ── Wire Lenis into GSAP's ticker ────────────────
    // This is the critical step — without it, ScrollTrigger
    // reads stale scroll positions and animations fire early/late.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis wants ms
    });

    // Disable GSAP's own lag smoothing so Lenis is the sole authority
    gsap.ticker.lagSmoothing(0);

    // ── Expose globally so other scripts can pause/resume ─
    // e.g. when a modal opens: window.lenis.stop()
    //      when it closes:     window.lenis.start()
    window.lenis = lenis;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

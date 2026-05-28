/* Rise With Us Gaming — Main JS */
/* GSAP + Alpine.js interactions */

document.addEventListener('DOMContentLoaded', () => {

  // ── Register GSAP ScrollTrigger ────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ── Navbar scroll behavior ─────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => navbar.classList.add('nav-scrolled'),
      onLeaveBack: () => navbar.classList.remove('nav-scrolled'),
    });
  }

  // ── Generic scroll-triggered fade-up elements ──────
  gsap.utils.toArray('.gsap-fade-up').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  gsap.utils.toArray('.gsap-fade-in').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      }
    });
  });

  gsap.utils.toArray('.gsap-scale-in').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      }
    });
  });

  // ── Staggered card animations ─────────────────────
  gsap.utils.toArray('.gsap-stagger-group').forEach(group => {
    const cards = group.querySelectorAll('.gsap-stagger-item');
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
      }
    });
  });

});

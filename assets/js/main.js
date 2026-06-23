/* ============================================================
   THE THIRD SPACE — main.js
   ============================================================ */

/* ── Utility: detect current page ── */
const currentPath = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';

/* ── NAV: sticky transparent → cream on scroll ── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  /* On cafe pages, nav should always be solid (cream back-nav is behind it) */
  const alwaysSolid = !!document.querySelector('.cafe-back-nav');

  function updateNav() {
    if (alwaysSolid || window.scrollY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* Hamburger */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active link */
  nav.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPath) link.classList.add('active');
  });
}

/* ── PAGE TRANSITIONS ── */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  /* On page load: if arriving from transition, slide out */
  if (sessionStorage.getItem('tts-transition') === 'in') {
    sessionStorage.removeItem('tts-transition');
    overlay.style.transform = 'scaleY(1)';
    overlay.style.transformOrigin = 'top';
    overlay.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { overlay.style.transform = 'scaleY(0)'; });
    });
  }

  /* On internal link click: slide in, then navigate */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      sessionStorage.setItem('tts-transition', 'in');
      overlay.style.transformOrigin = 'bottom';
      overlay.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
      overlay.style.transform = 'scaleY(1)';
      setTimeout(() => { window.location.href = href; }, 520);
    });
  });
}

/* ── SCROLL ARROW ── */
function initScrollArrow() {
  const arrow = document.querySelector('.scroll-arrow');
  if (!arrow) return;
  arrow.addEventListener('click', () => {
    const firstSection = document.querySelector('.section');
    if (firstSection) firstSection.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── BEHIND THE LENS: random rotations ── */
function initBtlRotations() {
  const photos = document.querySelectorAll('.btl-photo');
  photos.forEach(photo => {
    const angle = (Math.random() * 8 - 4).toFixed(2);
    photo.style.transform = `rotate(${angle}deg)`;
    photo.dataset.rotation = angle;
  });
}

/* ── GSAP ANIMATIONS ── */
function initGsap() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Hero text stagger */
  const heroWords = document.querySelectorAll('.hero-animate');
  if (heroWords.length) {
    gsap.fromTo(heroWords,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
    );
  }

  /* Section headings fade up on scroll */
  document.querySelectorAll('.scroll-fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Cafe cards stagger */
  const cafeSections = document.querySelectorAll('.cafe-grid, .cafes-page-grid');
  cafeSections.forEach(grid => {
    const cards = grid.querySelectorAll('.cafe-card');
    if (!cards.length) return;
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  });

  /* BTL photos snap to rotation on scroll */
  document.querySelectorAll('.btl-photo').forEach((photo, i) => {
    const angle = photo.dataset.rotation || 0;
    gsap.fromTo(photo,
      { opacity: 0, y: 40, rotate: 0 },
      {
        opacity: 1, y: 0, rotate: parseFloat(angle), duration: 0.7, delay: i * 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: photo, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Team member cards */
  document.querySelectorAll('.team-member').forEach((member, i) => {
    gsap.fromTo(member,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.55, delay: (i % 4) * 0.07,
        ease: 'power2.out',
        scrollTrigger: { trigger: member, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initPageTransitions();
  initScrollArrow();
  initBtlRotations();
  initGsap();
});

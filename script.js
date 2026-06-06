// === Mobile detect (used to disable heavy effects) ===
const isMobile = matchMedia('(max-width: 768px)').matches
  || matchMedia('(hover: none) and (pointer: coarse)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// === NAV scrolled state (rAF throttled) ===
const nav = document.querySelector('.nav');
let lastScrollY = 0;
let scrollTicking = false;

function onScroll() {
  lastScrollY = window.scrollY;
  if (!scrollTicking) {
    requestAnimationFrame(handleScroll);
    scrollTicking = true;
  }
}

function handleScroll() {
  if (lastScrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  if (!isMobile && !reduceMotion) updateParallax();
  updateProcessLine();
  scrollTicking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });

// === Reveal on scroll ===
const revealTargets = document.querySelectorAll(
  '.about__portrait, .about__content, .case, .step, .plan, .qa, .cta__panel, .section-head, .marquee, .trust__label, .result, .benefit, .growth-card, .funnel__step, .philosophy__panel, .howitworks__panel, .skills__list li'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const delay = target.dataset.delay || (i % 4) * 80;
      setTimeout(() => target.classList.add('in'), delay);
      io.unobserve(target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

revealTargets.forEach(el => io.observe(el));

// === Parallax (desktop only, rAF throttled) ===
const parallaxEls = document.querySelectorAll('[data-parallax]');
function updateParallax() {
  const vh = window.innerHeight;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax);
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) return;
    const offsetFromCenter = rect.top + rect.height / 2 - vh / 2;
    el.style.transform = `translate3d(0, ${offsetFromCenter * speed * -1}px, 0)`;
  });
}

// === Cases slider buttons ===
const rail = document.getElementById('casesRail');
document.querySelectorAll('.slider-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = parseInt(btn.dataset.dir, 10);
    const cardWidth = rail.querySelector('.case').offsetWidth + 28;
    rail.scrollBy({ left: dir * cardWidth * 1.2, behavior: 'smooth' });
  });
});

// === Process line fill on scroll ===
const processLineFill = document.querySelector('.process__line-fill');
const processSection = document.querySelector('.process__rail');

function updateProcessLine() {
  if (!processSection || !processLineFill || isMobile) return;
  const rect = processSection.getBoundingClientRect();
  const vh = window.innerHeight;
  const start = vh * 0.8;
  const end = vh * 0.2;
  let progress = (start - rect.top) / (start - end + rect.height * 0.3);
  progress = Math.max(0, Math.min(1, progress));
  processLineFill.setAttribute('x2', 1200 * progress);
}
updateProcessLine();

// === Smooth scroll for nav anchors + close mobile menu ===
const navMenu = document.querySelector('.nav');
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.body.classList.remove('nav-open');
      }
    }
  });
});

// === FAQ: close others when one opens ===
const qas = document.querySelectorAll('.qa');
qas.forEach(qa => {
  qa.addEventListener('toggle', () => {
    if (qa.open) {
      qas.forEach(other => { if (other !== qa) other.open = false; });
    }
  });
});

// === Mobile nav toggle ===
const navToggle = document.querySelector('.nav__toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

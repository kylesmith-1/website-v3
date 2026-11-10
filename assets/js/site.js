(() => {
  'use strict';

  /* Nav: shadow on scroll, mobile menu, active link */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const toTop = document.querySelector('.to-top');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('i').className = open ? 'bi bi-x-lg' : 'bi bi-list';
  };
  navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  const sectionLinks = new Map();
  nav.querySelectorAll('.nav__links a[href^="#"]').forEach((a) => {
    const section = document.querySelector(a.getAttribute('href'));
    if (section) sectionLinks.set(section, a);
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((a) => a.classList.remove('is-active'));
      sectionLinks.get(entry.target).classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sectionLinks.forEach((_, section) => spy.observe(section));
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) sectionLinks.forEach((a) => a.classList.remove('is-active'));
  }, { rootMargin: '-45% 0px -50% 0px' }).observe(document.querySelector('#hero'));

  /* Scroll reveal */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  /* Expandable job cards */
  document.querySelectorAll('.job').forEach((job) => {
    const toggle = job.querySelector('.job__toggle');
    const details = job.querySelector('.job__details');
    const name = job.querySelector('.job__name').textContent;
    details.inert = true;
    toggle.addEventListener('click', () => {
      const open = job.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} details for ${name}`);
      details.inert = !open;
    });
  });

  /* Typing effect on the hero tagline */
  const typed = document.querySelector('.typed');
  if (typed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const text = typed.textContent;
    let char = 0;
    let deleting = false;
    typed.textContent = '';

    const tick = () => {
      char += deleting ? -1 : 1;
      typed.textContent = text.slice(0, char);

      let delay = deleting ? 50 : 100;
      if (!deleting && char === text.length) {
        deleting = true;
        delay = 2000;
      } else if (deleting && char === 0) {
        deleting = false;
        delay = 400;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 700);
  }

  /* Footer year */
  document.querySelector('.year').textContent = new Date().getFullYear();
})();

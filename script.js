// Highlands Solutions — interactions

// Sticky navbar shrink on scroll
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 24) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));


// Floating chat launcher → scroll to contact for now (placeholder)
const launcher = document.querySelector('.chat-launcher');
if (launcher) {
  launcher.addEventListener('click', () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Year in footer
const yr = document.getElementById('yr');
if (yr) yr.textContent = String(new Date().getFullYear());

// Sticky scroll showcase — sync left text + right image with scroll position
(function initScrollShowcase() {
  const tracks = document.querySelectorAll('.scroll-tracks .scroll-track');
  const panels = document.querySelectorAll('.scroll-showcase-left .scroll-panel');
  const imgs = document.querySelectorAll('.scroll-showcase-right .scroll-img');
  if (!tracks.length || !panels.length || !imgs.length) return;
  const setActive = (idx) => {
    const key = String(idx);
    panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === key));
    imgs.forEach((img) => img.classList.toggle('active', img.dataset.panel === key));
  };
  const obs = new IntersectionObserver(
    (entries) => {
      // Use the entry whose center is closest to the viewport center
      let best = null;
      let bestRatio = 0;
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio >= bestRatio) {
          best = e.target;
          bestRatio = e.intersectionRatio;
        }
      });
      if (best) setActive(best.dataset.panel);
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] }
  );
  tracks.forEach((t) => obs.observe(t));
})();

// Mobile scroll showcase: flatten into paired text + image blocks
(function initMobileShowcase() {
  if (window.innerWidth >= 900) return;
  document.querySelectorAll('.scroll-showcase').forEach((showcase) => {
    const panels = [...showcase.querySelectorAll('.scroll-panel')];
    const imgs   = [...showcase.querySelectorAll('.scroll-img')];
    if (!panels.length || !imgs.length) return;

    const wrap = document.createElement('div');
    wrap.className = 'scroll-mobile-pairs';

    panels.forEach((panel, i) => {
      const pair = document.createElement('div');
      pair.className = 'scroll-mobile-pair';

      const textClone = panel.cloneNode(true);
      textClone.classList.remove('active');
      pair.appendChild(textClone);

      if (imgs[i]) {
        const imgClone = imgs[i].cloneNode(true);
        imgClone.classList.remove('active');
        pair.appendChild(imgClone);
      }
      wrap.appendChild(pair);
    });

    showcase.insertBefore(wrap, showcase.firstChild);
  });
})();

// Hero chat — chip toggle (VA mock)
document.querySelectorAll('.hero-mock .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document
      .querySelectorAll('.hero-mock .chip')
      .forEach((c) => c.classList.remove('chip-active'));
    chip.classList.add('chip-active');
  });
});

// Hero mocks — vertical slide cycle
(function initHeroMocks() {
  const mocks = document.querySelectorAll('.hero-mock');
  if (!mocks.length) return;

  let current = 0;

  const show = (idx) => {
    const prev = current;
    mocks[prev].classList.remove('hero-mock-active');
    mocks[prev].classList.add('hero-mock-exit');
    setTimeout(() => mocks[prev].classList.remove('hero-mock-exit'), 560);
    mocks[idx].classList.add('hero-mock-active');
    current = idx;
  };

  setInterval(() => show((current + 1) % mocks.length), 4500);
})();

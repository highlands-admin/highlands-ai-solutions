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

// Case study metrics — count up when the results rail scrolls into view
(function initCaseCounters() {
  const els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const format = (value, decimals) => {
    const [int, frac] = value.toFixed(decimals).split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return frac ? `${grouped}.${frac}` : grouped;
  };

  const run = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (Number.isNaN(target)) return;
    if (reduced) {
      el.textContent = format(target, decimals);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = format(target * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = format(0, decimals);
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        run(e.target);
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => obs.observe(el));
})();

// Screenshot showcase lightbox — click any shot card to view full size
(function initShotLightbox() {
  const cards = [...document.querySelectorAll('.shot-card')];
  if (!cards.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Screenshot viewer');
  overlay.innerHTML = `
    <button class="lb-close" type="button" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
    </button>
    <div class="lb-stage">
      <button class="lb-prev" type="button" aria-label="Previous screenshot">
        <svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <img alt="" />
      <button class="lb-next" type="button" aria-label="Next screenshot">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="lb-caption"><span class="lb-title"></span><span class="lb-counter"></span></div>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('.lb-stage img');
  const lbTitle = overlay.querySelector('.lb-title');
  const lbCounter = overlay.querySelector('.lb-counter');
  let current = 0;
  let lastFocus = null;

  const show = (idx) => {
    current = (idx + cards.length) % cards.length;
    const card = cards[current];
    const img = card.querySelector('img');
    const title = card.querySelector('.shot-cap h4');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbTitle.textContent = title ? title.textContent : (img.alt || '');
    lbCounter.textContent = `${current + 1} / ${cards.length}`;
  };

  const open = (idx) => {
    lastFocus = document.activeElement;
    show(idx);
    overlay.classList.add('is-open');
    document.body.classList.add('lb-lock');
    overlay.querySelector('.lb-close').focus();
  };

  const close = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('lb-lock');
    if (lastFocus) lastFocus.focus();
  };

  cards.forEach((card, i) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  overlay.querySelector('.lb-close').addEventListener('click', close);
  overlay.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  overlay.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

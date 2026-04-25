import './style.css';

// --- Nav: apparaît quand on scroll hors du hero ---
(function initNav() {
  const nav = document.getElementById('main-nav');
  const hero = document.querySelector('.hero');
  if (!nav || !hero) return;

  function checkNav() {
    const rect = hero.getBoundingClientRect();
    nav.classList.toggle('nav--visible', rect.bottom < window.innerHeight * 0.5);
  }
  window.addEventListener('scroll', checkNav, { passive: true });
  checkNav();
})();

// --- Slogan aléatoire ---
(function initSlogan() {
  const slogansByLang = {
    fr: [
      "On n'a pas fini de vous chauffer",
      "Encore un collectif d'allumés",
      "Y a pas de fumée sans teuf",
      "Faire teuf de tout bois",
    ],
    en: [
      "We're not done heating you up",
      "Just another bunch of firestarters",
      "No smoke without a rave",
      "Making a party out of anything",
    ],
  };
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const slogans = slogansByLang[lang];
  const el = document.getElementById('slogan');
  if (el) el.textContent = slogans[Math.floor(Math.random() * slogans.length)];
})();

// --- Video rotation dans le hero ---
(function initVideoRotation() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  const videos = [
    '/videos/piedra.mp4',
    '/videos/holbox.mp4',
    '/videos/microclimat.mp4',
    '/videos/pink.mp4',
    '/videos/vryche.mp4',
  ];
  let current = 0;

  // Forcer la lecture sur mobile (iOS/Android bloquent l'autoplay sans interaction)
  function tryPlay() {
    video.play().catch(() => {});
  }
  tryPlay();
  document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  document.addEventListener('pointerdown', tryPlay, { once: true, passive: true });

  video.addEventListener('ended', () => {
    current = (current + 1) % videos.length;
    video.src = videos[current];
    video.load();
    video.play().catch(() => {});
  });
})();

// --- Panels ---
(function initPanels() {
  const panelsEl = document.getElementById('panels');
  const panels = document.querySelectorAll('.panel');
  if (!panels.length) return;

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  function revealPhotos(panel) {
    panel.querySelectorAll('.photo-strip__item').forEach(function(item, i) {
      item.classList.remove('is-revealed');
      setTimeout(function() { item.classList.add('is-revealed'); }, 900 + i * 100);
    });
  }

  function activatePanel(panel) {
    if (panel.classList.contains('panel--active')) return;
    panels.forEach(p => p.classList.remove('panel--active'));
    panel.classList.add('panel--active');
    revealPhotos(panel);
  }

  // --- Desktop: click on collapsed panel to expand ---
  panels.forEach(function(panel) {
    panel.addEventListener('click', function() {
      if (!isMobile() && !panel.classList.contains('panel--active')) {
        activatePanel(panel);
      }
    });
  });

  // --- Scroll carousel to a panel (mobile) ---
  function scrollToPanel(panel) {
    if (!panelsEl) return;
    const idx = Array.from(panels).indexOf(panel);
    panelsEl.scrollTo({ left: idx * panelsEl.offsetWidth, behavior: 'smooth' });
  }

  // --- Nav links and hero links with data-panel target ---
  document.querySelectorAll('[data-panel]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      const target = document.getElementById(link.dataset.panel);
      if (!target) return;
      e.preventDefault();
      if (isMobile()) {
        // 1. Scroll page to panels section
        panelsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 2. Then scroll carousel horizontally to the right panel
        setTimeout(function() { scrollToPanel(target); }, 350);
      } else {
        activatePanel(target);
        panelsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Mobile: IntersectionObserver syncs panel--active as user swipes ---
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      if (!isMobile()) return;
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          activatePanel(entry.target);
          updateDots();
        }
      });
    }, { root: panelsEl, threshold: 0.5 });

    panels.forEach(function(panel) { observer.observe(panel); });
  }

  // --- Mobile dots navigation ---
  function buildDots() {
    if (!panelsEl) return;
    const existing = document.querySelector('.panels-dots');
    if (existing) existing.remove();

    const dotsEl = document.createElement('div');
    dotsEl.className = 'panels-dots';

    panels.forEach(function(panel, i) {
      const dot = document.createElement('button');
      dot.className = 'panels-dot' + (panel.classList.contains('panel--active') ? ' panels-dot--active' : '');
      dot.setAttribute('aria-label', 'Panneau ' + (i + 1));
      dot.addEventListener('click', function() {
        panelsEl.scrollTo({ left: i * panelsEl.offsetWidth, behavior: 'smooth' });
      });
      dotsEl.appendChild(dot);
    });

    panelsEl.insertAdjacentElement('afterend', dotsEl);
  }

  function updateDots() {
    const dots = document.querySelectorAll('.panels-dot');
    const activeIdx = Array.from(panels).findIndex(p => p.classList.contains('panel--active'));
    dots.forEach(function(dot, i) {
      dot.classList.toggle('panels-dot--active', i === activeIdx);
    });
  }

  // Build dots only on mobile, rebuild on resize crossing breakpoint
  let wasMobile = isMobile();
  if (wasMobile) buildDots();

  window.addEventListener('resize', function() {
    const nowMobile = isMobile();
    if (nowMobile && !wasMobile) buildDots();
    if (!nowMobile && wasMobile) {
      const dotsEl = document.querySelector('.panels-dots');
      if (dotsEl) dotsEl.remove();
    }
    wasMobile = nowMobile;
  });

  // --- Reveal photos in the first active panel on load ---
  const firstActive = document.querySelector('.panel--active');
  if (firstActive) {
    revealPhotos(firstActive);
  }
})();

// --- Photo strip drag ---
(function initPhotoStripDrag() {
  document.querySelectorAll('.photo-strip__track').forEach(function(track) {
    let isDown = false, startX = 0, scrollLeft = 0;

    track.addEventListener('mousedown', function(e) {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', function() { isDown = false; });
    track.addEventListener('mouseup', function() { isDown = false; });
    track.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });
})();

// --- Mobile nav plein écran ---
(function initMobileNav() {
  const burger = document.getElementById('nav-burger');
  const mobileNav = document.getElementById('nav-mobile');
  if (!burger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function() {
    burger.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  mobileNav.querySelectorAll('.nav-mobile__link').forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });
})();

// --- Lightbox ---
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function() { lightboxImg.src = ''; }, 400);
  }

  document.querySelectorAll('.photo-strip__item[data-src]').forEach(function(btn) {
    btn.addEventListener('click', function() { open(btn.dataset.src, btn.dataset.alt); });
  });

  lightbox.addEventListener('click', function(e) { if (e.target === lightbox) close(); });
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });
})();

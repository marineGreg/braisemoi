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

  video.addEventListener('ended', () => {
    current = (current + 1) % videos.length;
    video.src = videos[current];
    video.load();
    video.play().catch(() => {});
  });
})();

// --- Scroll animations ---
(function initScrollAnimations() {
  const sections = document.querySelectorAll('.artiste');
  if (!sections.length) return;

  function checkVisibility() {
    const vh = window.innerHeight;
    sections.forEach(function(section) {
      if (section.classList.contains('is-visible')) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < vh * 0.85 && rect.bottom > 0) {
        section.classList.add('is-visible');
        revealPhotoItems(section);
      }
    });
  }

  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility, { passive: true });
  checkVisibility();
})();

function revealPhotoItems(section) {
  section.querySelectorAll('.photo-strip__item').forEach(function(item, i) {
    setTimeout(function() {
      item.classList.add('is-revealed');
    }, 1400 + i * 120);
  });
}

// --- Watermark parallax ---
(function initWatermarkParallax() {
  const watermarks = document.querySelectorAll('.artiste__watermark');
  if (!watermarks.length) return;

  function update() {
    watermarks.forEach(function(wm, i) {
      const section = wm.closest('.artiste');
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const direction = i % 2 === 0 ? 1 : -1;
      const offset = (progress - 0.5) * 600 * direction;
      wm.style.transform = `translateX(${offset}px)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
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

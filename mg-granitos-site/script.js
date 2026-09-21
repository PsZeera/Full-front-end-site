/* ═══════════════════════════════════════════
   MG GRANITOS — Interactive Features v2
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Theme Toggle ── */
  var root = document.documentElement;
  var toggleBtn = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');

  function getPreferredTheme() {
    var saved = localStorage.getItem('mg-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('mg-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  setTheme(getPreferredTheme());

  toggleBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  /* ── Mobile Menu ── */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    nav.classList.toggle('open');
    menuBtn.classList.toggle('active');
    overlay.classList.toggle('visible');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav.classList.contains('open')) toggleMenu();
    });
  });

  /* ── Scroll Reveal (stagger) ── */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var parent = entry.target.parentElement;
        var siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        var idx = siblings.indexOf(entry.target);
        var delay = idx >= 0 ? idx * 90 : 0;

        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ── Counter Animation ── */
  var counters = document.querySelectorAll('.counter');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { counterObserver.observe(c); });

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 2000;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = Math.floor(eased * target);
      el.textContent = '+' + current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = '+' + target;
    }
    requestAnimationFrame(step);
  }

  /* ── Filter Projects ── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projects = document.querySelectorAll('.project');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;

      projects.forEach(function (p) {
        var match = filter === 'all' || p.dataset.cat === filter;
        if (match) {
          p.classList.remove('hidden');
          p.style.display = '';
        } else {
          p.classList.add('hidden');
          setTimeout(function () {
            if (p.classList.contains('hidden')) p.style.display = 'none';
          }, 350);
        }
      });
    });
  });

  /* ── Lightbox ── */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentProjectIndex = 0;
  var projectImages = [];

  projects.forEach(function (p, i) {
    var img = p.querySelector('img');
    if (img) {
      projectImages.push({ src: img.src, alt: img.alt, index: i });
      p.addEventListener('click', function () {
        openLightbox(i);
      });
    }
  });

  function openLightbox(index) {
    currentProjectIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    var item = projectImages[currentProjectIndex];
    if (item) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    currentProjectIndex = (currentProjectIndex - 1 + projectImages.length) % projectImages.length;
    updateLightboxImage();
  });

  lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
    currentProjectIndex = (currentProjectIndex + 1) % projectImages.length;
    updateLightboxImage();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* ── Active Nav on Scroll ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link:not(.btn-nav-cta)');

  function updateActiveNav() {
    var scrollY = window.scrollY + 140;
    var current = '';
    sections.forEach(function (s) {
      if (scrollY >= s.offsetTop) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── Header Background + Shadow on Scroll ── */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.style.boxShadow = 'var(--shadow-sm)';
      header.classList.add('scrolled');
    } else {
      header.style.boxShadow = 'none';
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── Scroll Progress Bar ── */
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });

  /* ── Parallax Hero Background ── */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < 800) {
        heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
      }
    }, { passive: true });
  }

  /* ── Magnetic Hover on Service Items ── */
  var serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(function (item) {
    item.addEventListener('mousemove', function (e) {
      var rect = item.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      item.style.transform = 'translateY(-3px) rotateX(' + (-y * 0.05) + 'deg) rotateY(' + (x * 0.05) + 'deg)';
    });
    item.addEventListener('mouseleave', function () {
      item.style.transform = '';
    });
  });

  /* ── Smooth Tilt on Material Cards ── */
  var matCards = document.querySelectorAll('.mat-card');
  matCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-4px) perspective(600px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Smooth Tilt on Project Cards ── */
  var projectCards = document.querySelectorAll('.project');
  projectCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-4px) perspective(600px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Footer Year ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Float WhatsApp show/hide on scroll ── */
  var floatWhats = document.getElementById('floatWhats');
  if (floatWhats) {
    floatWhats.style.opacity = '0';
    floatWhats.style.pointerEvents = 'none';
    floatWhats.style.transition = 'opacity .3s, transform .3s';

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        floatWhats.style.opacity = '1';
        floatWhats.style.pointerEvents = 'auto';
      } else {
        floatWhats.style.opacity = '0';
        floatWhats.style.pointerEvents = 'none';
      }
    }, { passive: true });
  }

  /* ── Contact Card Ripple Effect ── */
  var contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      var ripple = document.createElement('span');
      ripple.className = 'card-ripple';
      var rect = card.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      card.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  /* ── Text Scramble Effect on Section Labels ── */
  var labels = document.querySelectorAll('.section-label');
  var labelObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  labels.forEach(function (l) { labelObserver.observe(l); });

  function scrambleText(el) {
    var original = el.textContent;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var iterations = 0;
    var maxIterations = 8;

    var interval = setInterval(function () {
      el.textContent = original.split('').map(function (char, i) {
        if (i < iterations) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      iterations += 1;
      if (iterations > original.length) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 40);
  }

  /* ── Typing Effect on Hero H1 ── */
  var heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    heroH1.style.opacity = '1';
  }

})();

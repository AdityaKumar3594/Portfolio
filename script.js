/* ===== REDUCED MOTION CHECK ===== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== THEME TOGGLE ===== */
(function () {
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('.theme-icon');
  let dark = false;

  // Restore saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    dark = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.textContent = '○';
    btn.setAttribute('aria-label', 'Switch to light mode');
  }

  btn.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
    icon.textContent = dark ? '○' : '◑';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
})();

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navMobile.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}, { passive: true });

/* ===== ACTIVE NAV ===== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== REVEAL ON SCROLL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || i * 80;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  if (prefersReducedMotion) {
    // Just show the final value immediately
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    el.textContent = isDecimal ? (target / 100).toFixed(2) : Math.floor(target) + suffix;
    return;
  }
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = isDecimal
      ? (current / 100).toFixed(2)
      : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ===== RATING BAR ANIMATION ===== */
document.querySelectorAll('.rating-fill').forEach(bar => {
  const pct = bar.style.getPropertyValue('--pct') ||
    getComputedStyle(bar).getPropertyValue('--pct');
  bar.style.width = '0%';
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (prefersReducedMotion) {
          bar.style.transition = 'none';
        }
        bar.style.width = pct;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  barObserver.observe(bar);
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 5000);
});

/* ===== TYPEWRITER HERO ===== */
(function () {
  const target = document.getElementById('typewriter-target');
  const cursor = document.getElementById('heroCursor');
  if (!target) return;

  const lines = [
    'Teaching machines\nto reason, one\n',
    'system at a time.'
  ];
  // Full text with rust accent on last line
  const fullText = 'Teaching machines\nto reason, one\nsystem at a time.';

  if (prefersReducedMotion) {
    // Render immediately without animation
    target.innerHTML = 'Teaching machines<br>to reason, one<br><span class="accent">system at a time.</span>';
    if (cursor) cursor.style.display = 'none';
    return;
  }

  const chars = fullText.split('');
  let i = 0;
  const accentStart = fullText.lastIndexOf('system at a time.');

  function type() {
    if (i <= chars.length) {
      const typed = chars.slice(0, i).join('');
      const withBreaks = typed
        .replace(/\n/g, '<br>')
        .replace(
          /(system at a time\.?)$/,
          '<span class="accent">$1</span>'
        );
      target.innerHTML = withBreaks;
      i++;
      setTimeout(type, 48 + Math.random() * 20);
    } else {
      // Blink cursor 3 times then fade
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        blinks++;
        if (blinks >= 6) {
          clearInterval(blinkInterval);
          if (cursor) cursor.classList.add('fade-out');
          setTimeout(() => { if (cursor) cursor.style.display = 'none'; }, 500);
        }
      }, 450);
    }
  }

  // Start after brief delay so page paint settles
  setTimeout(type, 400);
})();

/* ===== END ===== */

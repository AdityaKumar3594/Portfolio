/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
let isDark = true;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☀' : '🌙';
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

/* ===== ACTIVE NAV ===== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ===== REVEAL ON SCROLL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.textContent.includes('.');
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;
    if (isDecimal) {
      el.textContent = (current / 100).toFixed(2);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
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

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 5000);
});

/* ===== HERO CANVAS — Neural Network Particles ===== */
(function() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
    const nodeColor = isDarkMode ? '139,92,246' : '99,102,241';
    const lineColor = isDarkMode ? '139,92,246' : '99,102,241';

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor},${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeColor},${p.opacity})`;
      ctx.fill();

      // Update position
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  init();
})();

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== RATING BAR ANIMATION ===== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue('--pct') ||
        getComputedStyle(entry.target).getPropertyValue('--pct');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.rating-fill').forEach(bar => {
  const pct = bar.style.getPropertyValue('--pct');
  bar.style.width = '0%';
  setTimeout(() => barObserver.observe(bar), 100);
});

/* ===== SKILLS SECTION — EXPLODING CHIP ANIMATION ===== */
(function () {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;

  // Resize canvas to match section
  function resizeCanvas() {
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Colour map per chip class
  const colorMap = {
    'chip-primary': ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    'chip-blue':    ['#6366f1', '#818cf8', '#a5b4fc'],
    'chip-green':   ['#10b981', '#34d399', '#6ee7b7'],
    'chip-orange':  ['#f59e0b', '#fbbf24', '#fde68a'],
    'chip-purple':  ['#ec4899', '#f472b6', '#fbcfe8'],
    'chip-cyan':    ['#06b6d4', '#22d3ee', '#67e8f9'],
  };

  function getChipColors(chip) {
    for (const [cls, cols] of Object.entries(colorMap)) {
      if (chip.classList.contains(cls)) return cols;
    }
    return ['#8b5cf6', '#a78bfa', '#c4b5fd'];
  }

  // Particle types: spark, shard, ring, dot
  function spawnParticles(x, y, colors) {
    const count = 38;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 5.5;
      const type = ['spark', 'shard', 'dot', 'ring'][Math.floor(Math.random() * 4)];
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.022 + Math.random() * 0.018,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: type === 'shard' ? (3 + Math.random() * 5) : (2 + Math.random() * 3),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        type,
        gravity: 0.08 + Math.random() * 0.06,
      });
    }
    // Extra bright core burst
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * (1 + Math.random() * 2),
        vy: Math.sin(angle) * (1 + Math.random() * 2),
        life: 1,
        decay: 0.04,
        color: '#ffffff',
        size: 1.5 + Math.random() * 2,
        rotation: 0, rotSpeed: 0,
        type: 'dot',
        gravity: 0.03,
      });
    }
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.type === 'spark') {
      // Elongated spark line
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size * 0.5;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-p.vx * 2.5, -p.vy * 2.5);
      ctx.stroke();
    } else if (p.type === 'shard') {
      // Triangle shard
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.6, p.size * 0.5);
      ctx.lineTo(-p.size * 0.6, p.size * 0.5);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'ring') {
      // Hollow ring
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Glowing dot
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      drawParticle(p);
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.97;
      p.life -= p.decay;
      p.rotation += p.rotSpeed;
    });
    if (particles.length > 0) {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
    }
  }

  function triggerExplosion(chip) {
    if (chip.classList.contains('exploding')) return;

    const colors = getChipColors(chip);
    const rect = chip.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Origin = centre of chip relative to canvas
    const cx = rect.left - canvasRect.left + rect.width / 2;
    const cy = rect.top - canvasRect.top + rect.height / 2;

    // Shockwave on parent card
    const card = chip.closest('.skill-group');
    if (card) {
      card.classList.remove('shockwave');
      void card.offsetWidth; // reflow
      card.classList.add('shockwave');
      setTimeout(() => card.classList.remove('shockwave'), 700);
    }

    // Explode chip
    chip.classList.add('exploding');
    spawnParticles(cx, cy, colors);
    if (!animId) animId = requestAnimationFrame(loop);

    // Reform chip after explosion finishes
    setTimeout(() => {
      chip.classList.remove('exploding');
      chip.classList.add('reforming');
      setTimeout(() => chip.classList.remove('reforming'), 520);
    }, 450);
  }

  // Attach click to every chip
  document.querySelectorAll('.chip').forEach(chip => {
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => triggerExplosion(chip));
  });

  // Auto-demo: explode chips one by one when section enters viewport
  let demoDone = false;
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !demoDone) {
        demoDone = true;
        const chips = [...document.querySelectorAll('.chip')];
        chips.forEach((chip, i) => {
          setTimeout(() => triggerExplosion(chip), 300 + i * 120);
        });
        demoObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) demoObserver.observe(skillsSection);
})();

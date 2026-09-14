// ── Trailing Bot ────────────────────────────────────────────────────────────
(function () {
  const bot = document.getElementById('trailBot');
  // Disable on touch devices
  if (!bot || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let botX = mouseX;
  let botY = mouseY;
  let botAngle = 0;
  const LERP = 0.08; // Lower = more delay/lag

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    bot.classList.add('visible');
  }, { passive: true });

  document.addEventListener('mouseleave', () => bot.classList.remove('visible'));
  document.addEventListener('mouseenter', () => bot.classList.add('visible'));

  function tick() {
    const dx = mouseX - botX;
    const dy = mouseY - botY;
    
    // Smooth follow
    botX += dx * LERP;
    botY += dy * LERP;

    // Point in the direction of movement
    const speed = Math.sqrt(dx * dx + dy * dy);
    if (speed > 1) {
      // +90 because our SVG drawing naturally faces "up"
      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      
      // Calculate shortest rotation path
      let deltaAngle = targetAngle - botAngle;
      deltaAngle = (deltaAngle + 540) % 360 - 180;
      botAngle += deltaAngle * 0.15; // Smooth rotation
    }

    // Offset by half width/height (16px) to center it on cursor
    bot.style.transform = `translate(${botX - 16}px, ${botY - 16}px) rotate(${botAngle}deg)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ── Vanta Interactive 3D Birds ──────────────────────────────────────────────
if (typeof VANTA !== 'undefined') {
  VANTA.BIRDS({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0x171721, // onyx
    color1: 0x5266eb, // cobalt
    color2: 0x3d4fd6, // dark cobalt
    colorMode: "variance",
    birdSize: 1.40,
    wingSpan: 26.00,
    speedLimit: 4.50,
    separation: 40.00,
    alignment: 20.00,
    cohesion: 20.00,
    quantity: 4.0 // Elegant quantity, not too distracting
  });
}

// Mobile nav
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll progress bar
const progress = document.getElementById('scrollProgress');
addEventListener('scroll', () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}, { passive: true });

// Scroll reveals
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated stat counters
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count || 0, t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count').forEach(el => cio.observe(el));

// Event filters
const chips = document.querySelectorAll('.chip');
const events = document.querySelectorAll('.event');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    events.forEach(el => {
      el.style.display = (f === 'all' || el.dataset.type === f) ? '' : 'none';
    });
  });
});

// Fake registration
document.querySelectorAll('[data-register]').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.register;
    btn.textContent = 'Registered ✓';
    btn.disabled = true;
    alert(`You're registered for ${name}! (demo - connect backend later)`);
  });
});

// Join form -> localStorage demo
const joinForm = document.getElementById('joinForm');
const joinMsg = document.getElementById('joinMsg');
joinForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(joinForm).entries());
  const existing = JSON.parse(localStorage.getItem('iste_members') || '[]');
  existing.push({ ...data, at: new Date().toISOString() });
  localStorage.setItem('iste_members', JSON.stringify(existing));
  joinMsg.textContent = `Thanks ${data.name}! Application saved locally. Total demo signups: ${existing.length}`;
  joinForm.reset();
});

// Contact form demo
const contactForm = document.getElementById('contactForm');
const contactMsg = document.getElementById('contactMsg');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  contactMsg.textContent = 'Message noted! We usually reply within 2 days. (demo)';
  contactForm.reset();
});

// Countdown to HackNight 2026 (Oct 12)
const countdownEl = document.getElementById('countdown');
const target = new Date('2026-10-12T09:00:00');
function tick() {
  const diff = target - new Date();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  if (diff <= 0) {
    if (countdownEl) countdownEl.textContent = 'HackNight is live!';
    set('cd-d', '0'); set('cd-h', '0'); set('cd-m', '0');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff % 86400000 / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  if (countdownEl) countdownEl.textContent = `${d}d ${h}h ${m}m to HackNight`;
  set('cd-d', d); set('cd-h', h); set('cd-m', m);
}
setInterval(tick, 30000); tick();

// ---- interactive set (Refero-inspired) ----
const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cursor spotlight (hero)
const hero = document.querySelector('.hero');
const spot = document.getElementById('spotlight');
if (hero && spot && !calmMotion) {
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    spot.style.left = `${e.clientX - r.left}px`;
    spot.style.top = `${e.clientY - r.top}px`;
  });
}

// 3D tilt on launch panel + lift cards
if (!calmMotion) {
  document.querySelectorAll('.launch-panel, #about .card, #eventGrid .event').forEach(el => {
    el.classList.add('tilt');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  // Magnetic primary buttons and links
  document.querySelectorAll('.cta-row .btn, .launch-panel .btn, #navLinks a').forEach(btn => {
    btn.classList.add('magnetic');
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${(x * 0.25).toFixed(1)}px, ${(y * 0.25).toFixed(1)}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });

  // --- Osmo-style Text Scramble ---
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
      this.originalHtml = el.innerHTML;
      // Strip HTML tags for the scrambling calculation
      this.originalText = el.innerText || el.textContent;
      this.update = this.update.bind(this);
    }
    scramble() {
      if(this.isAnimating) return;
      this.isAnimating = true;
      const length = this.originalText.length;
      const promise = new Promise(resolve => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const char = this.originalText[i];
        if(char === ' ' || char === '\n') {
          this.queue.push({ char, isSpace: true });
          continue;
        }
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from: char, to: char, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise.then(() => { this.isAnimating = false; });
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let item = this.queue[i];
        if (item.isSpace) {
          output += item.char === '\n' ? '<br/>' : ' ';
          complete++;
          continue;
        }
        if (this.frame >= item.end) {
          complete++;
          output += item.to;
        } else if (this.frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
          }
          output += `<span style="color:var(--cobalt);opacity:0.8">${item.char}</span>`;
        } else {
          output += item.from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.el.innerHTML = this.originalHtml;
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }
  
  const h1 = document.querySelector('.hero h1');
  if (h1) {
    const scrambler = new TextScramble(h1);
    h1.addEventListener('mouseenter', () => scrambler.scramble());
  }

  // --- Osmo-style Ambient Cursor Glow ---
  const orb = document.createElement('div');
  orb.className = 'ambient-glow';
  document.body.appendChild(orb);
  let orbX = window.innerWidth / 2, orbY = window.innerHeight / 2;
  let mX = orbX, mY = orbY;
  
  window.addEventListener('mousemove', e => {
    mX = e.clientX; mY = e.clientY;
  });
  
  function renderOrb() {
    orbX += (mX - orbX) * 0.08;
    orbY += (mY - orbY) * 0.08;
    orb.style.transform = `translate(calc(${orbX}px - 50%), calc(${orbY}px - 50%))`;
    requestAnimationFrame(renderOrb);
  }
  renderOrb();
}

// FAQ accordion (single-open)
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q')?.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Scroll signatures: hide-nav + velocity marquee
const navBar = document.querySelector('.nav');
const track = document.querySelector('.marquee-track');
let lastY = scrollY, velTimer = null;
addEventListener('scroll', () => {
  const y = scrollY;
  if (navBar && !calmMotion) navBar.classList.toggle('hide', y > 300 && y > lastY);
  lastY = y;
  
  if (track && !calmMotion) {
    const anims = track.getAnimations();
    if (anims.length) {
      anims[0].playbackRate = 4; // smoothly speed up
      clearTimeout(velTimer);
      velTimer = setTimeout(() => { anims[0].playbackRate = 1; }, 150);
    }
  }
}, { passive: true });
const spyLinks = document.querySelectorAll('#navLinks a[href^="#"]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// ---- deep interaction layer ----
if (!calmMotion) {
  // Card glow follows the cursor (Huly radial bleed)
  document.querySelectorAll('.card, .ph').forEach(el => {
    el.classList.add('glow');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Hero parallax: copy drifts slower than panel
  const plxCopy = document.querySelector('.hero-copy');
  const plxVis = document.querySelector('.hero-visual');
  let plxTick = false;
  addEventListener('scroll', () => {
    if (plxTick) return;
    plxTick = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      if (y < innerHeight && plxCopy) plxCopy.style.transform = `translateY(${y * 0.08}px)`;
      if (y < innerHeight && plxVis) plxVis.style.transform = `translateY(${y * -0.05}px)`;
      plxTick = false;
    });
  }, { passive: true });

  // Click ripple on buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const rip = document.createElement('span');
      rip.className = 'ripple';
      rip.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 650);
    });
  });
}

// Back-to-top
const toTop = document.getElementById('toTop');
addEventListener('scroll', () => {
  toTop?.classList.toggle('show', scrollY > 600);
}, { passive: true });
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: calmMotion ? 'auto' : 'smooth' }));

// Copy email with feedback
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy || '';
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    const old = btn.textContent;
    btn.textContent = 'Copied ✓';
    setTimeout(() => { btn.textContent = old; }, 1600);
  });
});

// Countdown minute-tick pulse on the boxes
let lastMin = null;
setInterval(() => {
  const m = document.getElementById('cd-m');
  if (m && m.textContent !== lastMin) {
    lastMin = m.textContent;
    document.querySelectorAll('.cd-box').forEach(b => {
      b.classList.remove('tick');
      void b.offsetWidth;
      b.classList.add('tick');
    });
  }
}, 1000);



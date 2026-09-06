// Mobile nav
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

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
  if (!countdownEl) return;
  const diff = target - new Date();
  if (diff <= 0) { countdownEl.textContent = 'HackNight is live!'; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff % 86400000 / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  countdownEl.textContent = `${d}d ${h}h ${m}m to HackNight`;
}
setInterval(tick, 30000); tick();

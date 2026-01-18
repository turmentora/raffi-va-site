// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Testimonial slider
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let current = 0;

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
}
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}
function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}
if (prevBtn && nextBtn && slides.length) {
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  setInterval(nextSlide, 7000); // auto-rotate every 7s
}

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Availability badge (simple local counter demo)
const availability = document.querySelector('.availability');
if (availability) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
  const taken = Number(localStorage.getItem(`clients-${monthKey}`) || 0);
  const slots = Math.max(0, 2 - taken);
  availability.textContent = slots > 0
    ? `Taking on ${slots} new client${slots > 1 ? 's' : ''} this month`
    : 'Fully booked this month';
}

// Skills filter
const filterButtons = document.querySelectorAll('.filter-btn');
const skills = document.querySelectorAll('.skill');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    skills.forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? 'block' : 'none';
    });
  });
});



// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
// Highlight featured pricing card
const featuredCard = document.querySelector('.price-card.featured');
if (featuredCard) {
  featuredCard.style.transform = 'scale(1.03)';
  featuredCard.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
}

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const rootEl = document.documentElement;
const storedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');
rootEl.dataset.theme = initialTheme;
if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', String(initialTheme === 'light'));
  themeToggle.addEventListener('click', () => {
    const nextTheme = rootEl.dataset.theme === 'light' ? 'dark' : 'light';
    rootEl.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'light'));
  });
}

// Inline contact success state
const formStatus = document.querySelector('.form-status');
const contactForm = document.getElementById('contact-form');
const urlParams = new URLSearchParams(window.location.search);
if (formStatus && urlParams.get('sent') === '1') {
  formStatus.textContent = 'Thanks — your message has been sent.';
  formStatus.classList.add('success');
}
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', () => {
    formStatus.textContent = 'Sending...';
    formStatus.classList.remove('success', 'error');
  });
}
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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (!prefersReducedMotion) {
    setInterval(nextSlide, 8000);
  }
}

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
});

// Inline contact success state
const formStatus = document.querySelector('.form-status');
const contactForm = document.getElementById('contact-form');
const leadForm = document.querySelector('.lead-form');
const urlParams = new URLSearchParams(window.location.search);
if (formStatus && urlParams.get('sent') === '1') {
  formStatus.textContent = 'Thanks — your message has been sent.';
}
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', () => {
    formStatus.textContent = 'Sending...';
  });
}
if (leadForm) {
  leadForm.addEventListener('submit', () => {
    if (!isGtagReady()) return;
    gtag('event', 'sign_up', {
      method: 'lead_magnet'
    });
  });
}

// GA4 ecommerce events (pricing plans)
function isGtagReady() {
  return typeof window.gtag === 'function';
}

// CTA click tracking
document.querySelectorAll('[data-cta]').forEach((cta) => {
  cta.addEventListener('click', () => {
    if (!isGtagReady()) return;
    gtag('event', 'cta_click', {
      cta_id: cta.getAttribute('data-cta') || cta.textContent?.trim() || 'unknown'
    });
  });
});

// Thank-you conversion event
if (isGtagReady() && window.location.pathname.endsWith('thank-you.html')) {
  gtag('event', 'generate_lead', {
    currency: 'GBP',
    value: 1
  });
}

function getPricingItems() {
  return Array.from(document.querySelectorAll('.price-card')).map((card, index) => ({
    item_id: card.dataset.itemId || `plan-${index + 1}`,
    item_name: card.dataset.itemName || card.querySelector('h3')?.textContent?.trim() || `Plan ${index + 1}`,
    item_category: card.dataset.itemCategory || 'Service Plan',
    price: Number(card.dataset.itemPrice || 0),
    index: index + 1
  }));
}

if (isGtagReady()) {
  const pricingItems = getPricingItems();
  if (pricingItems.length) {
    gtag('event', 'view_item_list', {
      item_list_id: 'pricing-plans',
      item_list_name: 'Pricing Plans',
      items: pricingItems
    });

    document.querySelectorAll('.price-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        const item = pricingItems[index];
        if (!item) return;
        gtag('event', 'select_item', {
          item_list_id: 'pricing-plans',
          item_list_name: 'Pricing Plans',
          items: [item]
        });
      });
    });
  }
}
// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 600);
});

// ===== PROGRESS BAR =====
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
function handleScroll() {
  header.classList.toggle('scrolled', window.scrollY > 50);
  updateProgress();

  // Back to top visibility
  const backToTop = document.getElementById('backToTop');
  backToTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', handleScroll);

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav.classList.toggle('open');
});

// Close menu on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    nav.classList.remove('open');
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL REVEAL =====
function initReveal() {
  const revealElements = document.querySelectorAll(
    '.service-card, .dif, .pcard, .about__left, .about__content, .about__highlight, .contact__info, .contact__form, .tcard, .bcard, .faq-item, .calc__card'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));
}
initReveal();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
animateCounters();

// ===== CONTACT FORM + SUCCESS MODAL =====
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

function closeModal() {
  successModal.classList.remove('active');
}
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) closeModal();
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = contactForm.querySelectorAll('[required]');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#ff4757';
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      }, { once: true });
    }
  });

  if (valid) {
    successModal.classList.add('active');
    contactForm.reset();
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== DARK / LIGHT MODE =====
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('bs-theme');
if (storedTheme === 'dark') {
  document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('bs-theme', isDark ? 'dark' : 'light');
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== CALCULATOR =====
const calcBtn = document.getElementById('calcBtn');
const calcRevenueInput = document.getElementById('calcRevenue');
const calcEbitdaInput = document.getElementById('calcEbitda');
const calcGrowthInput = document.getElementById('calcGrowth');
const calcSector = document.getElementById('calcSector');
const calcValue = document.getElementById('calcValue');
const calcRange = document.getElementById('calcRange');
const calcResults = document.getElementById('calcResults');
const calcMultiple = document.getElementById('calcMultiple');
const calcEbitdaMultiple = document.getElementById('calcEbitdaMultiple');
const calcMarginEl = document.getElementById('calcMargin');

function formatCurrency(value) {
  return 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

function formatInput(input) {
  let raw = input.value.replace(/\D/g, '');
  if (raw) {
    input.value = parseInt(raw, 10).toLocaleString('pt-BR');
  }
}

calcRevenueInput.addEventListener('input', () => formatInput(calcRevenueInput));
calcEbitdaInput.addEventListener('input', () => formatInput(calcEbitdaInput));

calcBtn.addEventListener('click', () => {
  const rawRevenue = calcRevenueInput.value.replace(/\D/g, '');
  const rawEbitda = calcEbitdaInput.value.replace(/\D/g, '');
  const revenue = parseFloat(rawRevenue) || 0;
  const ebitda = parseFloat(rawEbitda) || 0;
  const growth = parseFloat(calcGrowthInput.value) || 0;
  const baseMultiple = parseFloat(calcSector.value) || 2;

  if (revenue <= 0) {
    calcValue.textContent = 'Informe o faturamento';
    calcRange.textContent = '';
    calcResults.classList.add('active');
    return;
  }

  // Growth bonus to multiple
  const growthBonus = growth > 30 ? 1.5 : growth > 15 ? 1 : growth > 5 ? 0.5 : 0;
  // Margin bonus
  const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
  const marginBonus = margin > 25 ? 1 : margin > 15 ? 0.5 : 0;

  const lowMultiple = baseMultiple + growthBonus + marginBonus;
  const highMultiple = lowMultiple + 2;
  const midMultiple = (lowMultiple + highMultiple) / 2;
  const midValue = revenue * midMultiple;
  const lowValue = revenue * lowMultiple;
  const highValue = revenue * highMultiple;

  const ebitdaMult = ebitda > 0 ? (midValue / ebitda) : 0;

  calcValue.textContent = formatCurrency(midValue);
  calcRange.textContent = formatCurrency(lowValue) + ' — ' + formatCurrency(highValue);
  calcMultiple.textContent = midMultiple.toFixed(1) + 'x';
  calcEbitdaMultiple.textContent = ebitdaMult > 0 ? ebitdaMult.toFixed(1) + 'x' : '—';
  calcMarginEl.textContent = margin > 0 ? margin.toFixed(1) + '%' : '—';
  calcResults.classList.add('active');
});

// ===== PARALLAX ON HERO IMAGE =====
const heroImg = document.querySelector('.hero__img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.05)';
    }
  });
}

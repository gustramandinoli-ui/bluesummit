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

// ===== SCROLL REVEAL (STAGGERED) =====
function initReveal() {
  const revealElements = document.querySelectorAll(
    '.service-card, .dif, .pcard, .about__left, .about__content, .about__highlight, .contact__info, .contact__form, .tcard, .bcard, .faq-item, .process__step'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  // Add stagger classes to grouped elements
  document.querySelectorAll('.services__grid, .pricing__grid, .diff-row').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('stagger-' + Math.min(i + 1, 4));
    });
  });

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
    const formData = new FormData(contactForm);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    }).then(() => {
      successModal.classList.add('active');
      contactForm.reset();
    }).catch(() => {
      successModal.classList.add('active');
      contactForm.reset();
    });
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

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('bs-theme', isDark ? 'dark' : 'light');
  });
}

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

// ===== PARALLAX ON HERO IMAGE (desktop only) =====
const heroImg = document.querySelector('.hero__img');
if (heroImg && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.05)';
    }
  });
}



// ===== TESTIMONIALS CAROUSEL =====
(function() {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !dotsContainer) return;
  const cards = track.querySelectorAll('.tcard');
  const total = cards.length;
  let current = 0;
  let autoplayTimer;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => d.classList.toggle('active', i === current));
    resetAutoplay();
  }

  document.querySelector('.carousel__btn--prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.carousel__btn--next')?.addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 5000);
  }
  resetAutoplay();
})();

// ===== COOKIE CONSENT BANNER (LGPD) =====
(function() {
  const banner = document.getElementById('cookieBanner');
  if (!banner || localStorage.getItem('bs-cookie-consent')) return;
  setTimeout(() => banner.classList.add('visible'), 1500);

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('bs-cookie-consent', 'accepted');
    banner.classList.remove('visible');
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('bs-cookie-consent', 'declined');
    banner.classList.remove('visible');
  });
})();

// ===== NEWSLETTER POPUP (EXIT INTENT) =====
(function() {
  const overlay = document.getElementById('newsletterOverlay');
  const closeBtn = document.getElementById('newsletterClose');
  const form = document.getElementById('newsletterForm');
  if (!overlay) return;
  let shown = false;

  function showPopup() {
    if (shown || sessionStorage.getItem('bs-newsletter-shown') || localStorage.getItem('bs-newsletter-sub')) return;
    shown = true;
    sessionStorage.setItem('bs-newsletter-shown', '1');
    overlay.classList.add('active');
  }

  // Exit intent — mouse leaves viewport top
  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 0) showPopup();
  });

  function closePopup() {
    overlay.classList.remove('active');
  }

  closeBtn?.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('bs-newsletter-sub', '1');
    overlay.querySelector('.newsletter-popup__title').textContent = 'Inscrito com sucesso!';
    overlay.querySelector('.newsletter-popup__text').textContent = 'Você receberá nossos insights em breve.';
    form.style.display = 'none';
    overlay.querySelector('.newsletter-popup__note').style.display = 'none';
    setTimeout(closePopup, 2500);
  });
})();



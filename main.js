/* ─── Lenis Smooth Scroll ─────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ─── Preloader ───────────────────────────────────────────────────── */
const preloader = document.getElementById('preloader');
const fill = document.querySelector('.preloader-fill');

let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 18 + 4;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
    fill.style.width = '100%';
    setTimeout(revealPage, 400);
  }
  fill.style.width = loadProgress + '%';
}, 60);

function revealPage() {
  gsap.to(preloader, {
    yPercent: -100,
    duration: 0.9,
    ease: 'power3.inOut',
    onComplete: () => {
      preloader.style.display = 'none';
      startHeroAnimation();
    },
  });
}

/* ─── Hero Animation ──────────────────────────────────────────────── */
function startHeroAnimation() {
  const heroLines = document.querySelectorAll('.hero-line');
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroFooter = document.querySelector('.hero-footer');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to(heroLines, {
    y: '0%',
    duration: 1.1,
    stagger: 0.12,
  })
  .to(heroEyebrow, {
    opacity: 1,
    y: 0,
    duration: 0.7,
  }, '-=0.5')
  .to(heroFooter, {
    opacity: 1,
    y: 0,
    duration: 0.7,
  }, '-=0.4');
}

/* ─── Custom Cursor ───────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
  });

  function followCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(followCursor);
  }
  followCursor();

  const hoverEls = document.querySelectorAll('a, button, .project-card, .time-slot, .dot');
  hoverEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-grow');
      follower.classList.add('follower-grow');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-grow');
      follower.classList.remove('follower-grow');
    });
  });
}

/* ─── Nav Scroll Behaviour ────────────────────────────────────────── */
const nav = document.getElementById('nav');

lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 60);
});

/* ─── Burger Menu ─────────────────────────────────────────────────── */
const burger = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
    gsap.to(spans[1], { rotation: -45, y: -6, duration: 0.3 });
    lenis.stop();
  } else {
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    lenis.start();
  }
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    lenis.start();
  });
});

/* ─── ScrollTrigger Reveal ────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

// Generic [data-reveal] elements
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});

// Section titles
document.querySelectorAll('.section-title').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  });
});

// Story blocks stagger
const storyBlocks = document.querySelectorAll('.story-block');
storyBlocks.forEach((block, i) => {
  gsap.to(block, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: block,
      start: 'top 85%',
    },
    delay: i * 0.08,
  });
});

// Process steps stagger
const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach((step, i) => {
  gsap.to(step, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: step,
      start: 'top 88%',
    },
    delay: i * 0.08,
  });
});

/* ─── Project Cards Reveal ────────────────────────────────────────── */
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
      },
      delay: (i % 2) * 0.12,
    }
  );
});

/* ─── Discipline Panel Reveal ─────────────────────────────────────── */
const disciplinePanels = document.querySelectorAll('.discipline-content[data-reveal]');
disciplinePanels.forEach((panel) => {
  gsap.to(panel, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: panel,
      start: 'top 80%',
    },
  });
});

/* ─── Parallax on About Image ─────────────────────────────────────── */
const aboutImg = document.querySelector('.about-img');
if (aboutImg) {
  gsap.to(aboutImg, {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

/* ─── Horizontal Number Counter for Stats ────────────────────────── */
function animateCounter(el, target) {
  const isDecimalOrPlus = String(target).includes('+');
  const num = parseInt(target);
  let count = 0;
  const duration = 1400;
  const step = Math.ceil(duration / (num * 16));

  const interval = setInterval(() => {
    count++;
    el.textContent = count + (isDecimalOrPlus ? '+' : '');
    if (count >= num) {
      el.textContent = target;
      clearInterval(interval);
    }
  }, step);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

ScrollTrigger.create({
  trigger: '.about-stats',
  start: 'top 85%',
  onEnter: () => {
    if (!statsAnimated) {
      statsAnimated = true;
      statNums.forEach((el) => animateCounter(el, el.textContent.trim()));
    }
  },
});

/* ─── Testimonials Slider ─────────────────────────────────────────── */
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentSlide = 0;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goToSlide(i));
});

// Auto-advance
setInterval(() => goToSlide(currentSlide + 1), 5000);

/* ─── Time Slot Selection ─────────────────────────────────────────── */
const timeSlots = document.querySelectorAll('.time-slot');
timeSlots.forEach((slot) => {
  slot.addEventListener('click', () => {
    timeSlots.forEach((s) => s.classList.remove('active'));
    slot.classList.add('active');
  });
});

/* ─── Booking Form Submission ─────────────────────────────────────── */
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = bookingForm.querySelector('.btn-submit');
  const btnText = btn.querySelector('span');
  btnText.textContent = 'Sending…';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  // Simulate submission — replace with real API call (e.g. Resend, Formspree, etc.)
  setTimeout(() => {
    bookingForm.classList.add('hidden');
    formSuccess.classList.remove('hidden');

    gsap.fromTo(formSuccess,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, 1200);
});

/* ─── Smooth anchor scroll via Lenis ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  });
});

/* ─── Schedule section scroll-reveal ─────────────────────────────── */
const scheduleEls = document.querySelectorAll('#schedule [data-reveal]');
scheduleEls.forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: i * 0.15,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  });
});

/* ─── Subtle grid parallax on hero scroll ────────────────────────── */
const heroGrid = document.querySelector('.hero-bg-grid');
if (heroGrid) {
  gsap.to(heroGrid, {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

/* ===========================
   PORTFOLIO SCRIPT.JS
=========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Hamburger Mobile Menu ────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

/* ── Helper: open / close state ── */
function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';   // prevent background scroll
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function isOpen() {
  return hamburger.classList.contains('open');
}

/* ── Toggle on hamburger click ── */
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  isOpen() ? closeMenu() : openMenu();
});

/* ── Close on nav link click ── */
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

/* ── Close on outside click ── */
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMenu();
  }
});

/* ── Close on Escape key ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen()) closeMenu();
});

// Select all tab buttons and all panels once
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels  = document.querySelectorAll('.tab-panel');

// Add a click listener to every button
tabButtons.forEach(function(btn) {
  btn.addEventListener('click', function() {

    // 1. Remove active state from every button and panel
    tabButtons.forEach(function(b) { b.classList.remove('active'); });
    tabPanels.forEach(function(p)  { p.classList.remove('active'); });

    // 2. Activate the clicked button
    btn.classList.add('active');

    // 3. Show the matching panel (data-target matches panel id)
    const targetId = btn.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');

  });
});



  // ─── Custom Cursor ───────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth trailing cursor
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity = '1';
  });
  
  


  // ─── Nav Scroll Behavior ─────────────────────────────────
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });


  // ─── Smooth Scroll for Nav Links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── Intersection Observer — Reveal on Scroll ────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep it visible
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  // Add reveal class to elements we want to animate
  const revealTargets = [
    '.project-card',
    '.about-text',
    '.about-skills',
    '.skill-group',
    '.stat',
    '.section-header',
    '.contact-inner',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (el.closest('.stats-row') || el.closest('.about-skills')) {
        el.style.transitionDelay = `${i * 0.08}s`;
      }
      revealObserver.observe(el);
    });
  });


  // ─── Animated Stat Counters ───────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }


  // ─── Project Card Tilt Effect ─────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });


  // ─── Marquee Pause on Hover ───────────────────────────────
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

  // ─── Nav Link Active State on Scroll ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));


  // ─── Subtle Parallax on Hero ──────────────────────────────
  const heroTitle = document.querySelector('.hero-title');
  const heroNumber = document.querySelector('.hero-number');

  if (heroTitle) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroTitle.style.transform = `translateY(${scrollY * 0.15}px)`;
        if (heroNumber) {
          heroNumber.style.transform = `translateY(calc(-50% + ${scrollY * 0.08}px))`;
        }
      }
    }, { passive: true });
  }


  // ─── Page load fade-in ───────────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });


  // ─── Contact email magnetic hover ────────────────────────
  const emailLink = document.querySelector('.contact-email');

  if (emailLink) {
    emailLink.addEventListener('mousemove', (e) => {
      const rect = emailLink.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      emailLink.style.transform = `translate(${x}px, ${y}px)`;
      emailLink.style.transition = 'transform 0.15s ease';
    });

    emailLink.addEventListener('mouseleave', () => {
      emailLink.style.transform = 'translate(0, 0)';
      emailLink.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

});

// ===== MYSTIFY ME — Cinematic 3D JavaScript =====
(() => {
  'use strict';

  // ===== CURSOR GLOW =====
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('visible');
  });

  // Smooth follow
  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ===== PARTICLES =====
  const particlesContainer = document.getElementById('particles');
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = 50 + Math.random() * 50 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    particle.style.width = (2 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 8000);
  }

  setInterval(createParticle, 400);

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== 3D CARD TILT EFFECT =====
  const chocoCards = document.querySelectorAll('.choco-card');

  chocoCards.forEach(card => {
    const inner = card.querySelector('.choco-card-inner');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;

      // Move glow to mouse position
      const glow = card.querySelector('.choco-card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.12), transparent 60%)`;
        glow.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      const glow = card.querySelector('.choco-card-glow');
      if (glow) glow.style.opacity = '0';
    });
  });

  // ===== 3D TILT FOR STORY & MIXINS IMAGES =====
  const tiltImages = document.querySelectorAll('.story-image-wrapper, .mixins-image-wrapper');

  tiltImages.forEach(wrapper => {
    const img = wrapper.querySelector('img');

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -6;
      const rotateY = (x - centerX) / centerX * 6;

      img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = [
    ...document.querySelectorAll('.choco-card'),
    ...document.querySelectorAll('.feature-item'),
    ...document.querySelectorAll('.mixin-chip'),
  ];

  const sectionReveals = document.querySelectorAll('#story .story-container, #chocolates .section-header, #mixins .mixins-right, #mixins .mixins-left, #order .order-left, #order .order-right, #features, #quote');

  sectionReveals.forEach(el => {
    el.classList.add('reveal-section');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el, i) => {
    el.dataset.delay = (i % 6) * 80;
    revealObserver.observe(el);
  });

  sectionReveals.forEach(el => revealObserver.observe(el));

  // ===== MIX-IN CHIPS INTERACTION =====
  const mixinChips = document.querySelectorAll('.mixin-chip');
  
  // Load saved mixins
  let savedMixins = [];
  try {
    savedMixins = JSON.parse(localStorage.getItem('mystifyMixins') || '[]');
  } catch (e) {}

  function updateMixinsStorage() {
    const selected = [...document.querySelectorAll('.mixin-chip.selected')].map(c => c.textContent);
    localStorage.setItem('mystifyMixins', JSON.stringify(selected));
  }

  mixinChips.forEach(chip => {
    // Initial render
    if (savedMixins.includes(chip.textContent)) {
      chip.classList.add('selected');
      chip.style.background = 'rgba(212, 175, 55, 0.15)';
      chip.style.borderColor = 'rgba(212, 175, 55, 0.3)';
      chip.style.color = '#f0d67b';
    }

    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      if (chip.classList.contains('selected')) {
        chip.style.background = 'rgba(212, 175, 55, 0.15)';
        chip.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        chip.style.color = '#f0d67b';
      } else {
        chip.style.background = '';
        chip.style.borderColor = '';
        chip.style.color = '';
      }
      updateMixinsStorage();
    });
  });

  // ===== CHOCOLATE POURING SIMULATION (Base Selection) =====
  const orderButtons = document.querySelectorAll('.choco-order-btn');
  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.dataset.product;
      const price = btn.dataset.price;
      
      localStorage.setItem('mystifyBase', product);
      
      // Determine Liquid Color
      let liquidColor = '#3c1f11'; // Dark default
      if (product.toLowerCase().includes('white')) liquidColor = '#f5e6d3';
      else if (product.toLowerCase().includes('milk')) liquidColor = '#8b4a2b';
      
      // Create Liquid Overlay
      const pourLayer = document.createElement('div');
      pourLayer.style.position = 'fixed';
      pourLayer.style.bottom = '0';
      pourLayer.style.left = '0';
      pourLayer.style.width = '100%';
      pourLayer.style.height = '0%';
      pourLayer.style.backgroundColor = liquidColor;
      pourLayer.style.zIndex = '99999';
      pourLayer.style.transition = 'all 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
      pourLayer.style.boxShadow = `0 -20px 40px ${liquidColor}`;
      // Gooey slight wave effect trick via border radius
      pourLayer.style.borderTopLeftRadius = '40% 20px';
      pourLayer.style.borderTopRightRadius = '60% 30px';
      
      document.body.appendChild(pourLayer);
      
      // Trigger animation
      setTimeout(() => {
        pourLayer.style.height = '120%'; // Overshoot to fill screen
      }, 50);
      
      // Redirect to mixins after fill
      setTimeout(() => {
        window.location.href = '/mixins';
      }, 1300);
    });
  });

  // ===== Auto-fill Order Form =====
  const formMessage = document.getElementById('form-message');
  if (formMessage) {
    const savedBase = localStorage.getItem('mystifyBase');
    let loadedMixins = [];
    try {
      loadedMixins = JSON.parse(localStorage.getItem('mystifyMixins') || '[]');
    } catch (e) {}

    // Only auto-fill if the text box is empty (or we are arriving fresh)
    if (!formMessage.value.trim()) {
      let draftContent = [];
      if (savedBase) {
        draftContent.push(`Base: ${savedBase}`);
      }
      if (loadedMixins.length > 0) {
        draftContent.push(`Mix-ins: ${loadedMixins.join(', ')}`);
      }
      
      if (draftContent.length > 0) {
        formMessage.value = 'Hi Mystify Me, I would like to order:\n' + draftContent.join('\n');
      }
    }
  }

  // Update WhatsApp direct link on order page dynamically
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn && formMessage) {
    function updateWhatsAppLink() {
      let msg = formMessage.value || 'Hi Mystify Me, I would like to order chocolates!';
      whatsappBtn.href = `https://wa.me/918209951190?text=${encodeURIComponent(msg)}`;
    }
    updateWhatsAppLink();
    formMessage.addEventListener('input', updateWhatsAppLink);
  }

  // ===== CONTACT FORM =====
  // Handled inline via sendToWhatsApp in order.ejs

  // ===== SMOOTH ANCHOR =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== PARALLAX ON HERO IMAGE =====
  const heroBgImg = document.getElementById('hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      heroBgImg.style.transform = `scale(${1.08 + scroll * 0.0002}) translateY(${scroll * 0.15}px)`;
    }
  }, { passive: true });
  }

  // ===== CONSOLE BRANDING =====
  console.log('%c✨ Mystify Me', 'font-size: 24px; font-weight: bold; color: #D4AF37; font-family: serif;');
  console.log('%cHandcrafted Artisan Chocolates · Jaipur', 'font-size: 11px; color: #9a8e7e;');

  // ===== UNIVERSAL VIBE CODING INTERACTIONS =====
  let lastX = 0, lastY = 0;
  window.addEventListener('mousemove', (e) => {
    const dist = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
    if (dist > 75) {
      lastX = e.clientX; 
      lastY = e.clientY;
      
      // Spawn Ripple
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = (e.clientY + window.scrollY) + 'px';
      ripple.style.width = '80px'; 
      ripple.style.height = '80px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1500);
      
      // Wobble floating chocolates globally
      document.querySelectorAll('.floating-choco').forEach(choco => {
        const cRect = choco.getBoundingClientRect();
        const cDist = Math.sqrt(Math.pow(e.clientX - (cRect.left+cRect.width/2), 2) + Math.pow(e.clientY - (cRect.top+cRect.height/2), 2));
        if (cDist < 250) {
          choco.style.transform = `scale(1.15) rotate(${(Math.random()*20 - 10)}deg) translate(${(Math.random()*10 - 5)}px, ${(Math.random()*10 - 5)}px)`;
          choco.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
          setTimeout(() => choco.style.transform = '', 400);
        }
      });
    }
  }, { passive: true });

})();

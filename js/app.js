// Script principal
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialisation des traductions
  await i18n.loadTranslations();

  // 2. Gestionnaire de changement de langue
  document.querySelectorAll('.lang-switch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.dataset.lang;
      i18n.setLang(lang);
    });
  });

  // 3. Menu mobile (hamburger)
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Fermer le menu après clic sur un lien
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // 4. Formulaire de contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);

      // Ajouter le type de formulaire pour tracking
      formData.append('_formType', 'contact');

      // Envoyer la notification Telegram
      if (typeof sendTelegramMessage !== 'undefined') {
        await sendTelegramMessage(formData);
      }

      // Tracker l'événement formulaire
      if (typeof trackFormSubmit !== 'undefined') {
        trackFormSubmit(formData);
      }

      // Feedback utilisateur
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '✓ Envoyé';
      submitBtn.disabled = true;
      contactForm.reset();

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  // 5. Tracking des clics sur les boutons importants
  // Sélecteurs des éléments à tracker
  const trackableSelectors = [
    { selector: '.btn, .btn-product, .btn-outline', location: 'generic' },
    { selector: '.btn-whatsapp', location: 'whatsapp' },
    { selector: 'a[href*="wa.me"]', location: 'whatsapp' },
    { selector: 'a[href="contact.html"]', location: 'nav' },
    { selector: '.lang-switch', location: 'nav' }
  ];

  trackableSelectors.forEach(item => {
    document.querySelectorAll(item.selector).forEach(el => {
      el.addEventListener('click', (e) => {
        // Ignorer les ancres internes
        const href = el.getAttribute('href');
        if (href && href.startsWith('#')) return;

        // Déterminer le texte du bouton
        let buttonText = '';
        if (el.tagName === 'BUTTON' || el.tagName === 'A') {
          buttonText = el.innerText.trim() || el.getAttribute('data-i18n') || 'unknown';
        } else {
          buttonText = el.innerText.trim();
        }

        // Déterminer l'emplacement précis si possible
        let location = item.location;
        if (location === 'generic') {
          if (el.closest('.hero')) location = 'hero';
          else if (el.closest('.product-section')) location = 'product_card';
          else if (el.closest('footer')) location = 'footer';
          else if (el.closest('.contact-info-block')) location = 'contact_block';
          else if (el.closest('.catalog-hero')) location = 'catalog_hero';
          else location = 'other';
        }

        // Appeler la fonction de tracking globale
        if (typeof trackEvent !== 'undefined') {
          trackEvent('cta_click', {
            button_text: buttonText,
            button_location: location,
            extra: { href: el.href || null }
          });
        }
      });
    });
  });

  // 6. Animations au scroll (fade-in)
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  // 7. Défilement fluide pour les ancres
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
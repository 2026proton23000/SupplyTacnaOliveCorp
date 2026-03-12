const TRACKING_URL = 'https://script.google.com/macros/s/AKfycbz7grflykVef5z7sJU92OuaWSqtKSTEuv3S2f0W50o5qfvPpwXSLN3FEMQQDrrZN4B6UQ/exec';

// Génération ou récupération d'un identifiant de session
function getSessionId() {
  let sessionId = localStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
}

// Helper : extraire le navigateur simplifié
function getSimpleUserAgent() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
}

// Helper : résolution d'écran
function getScreenSize() {
  return `${window.screen.width}x${window.screen.height}`;
}

// Fonction principale de tracking
async function trackEvent(eventType, eventData = {}) {
  try {
    const params = new URLSearchParams({
      session_id: getSessionId(),
      event_type: eventType,
      page: window.location.pathname,
      page_title: document.title,
      language: typeof i18n !== 'undefined' ? i18n.currentLang : 'fr',
      referrer: document.referrer || '(direct)',
      user_agent: getSimpleUserAgent(),
      screen_size: getScreenSize(),
      ...eventData
    });
    
    // Envoi silencieux
    fetch(TRACKING_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    }).catch(err => console.warn('Tracking error:', err));
  } catch (e) {
    console.warn('Tracking failed', e);
  }
}

// Track page view automatique
trackEvent('page_view');

// Track form submission (appelée depuis app.js)
function trackFormSubmit(formData) {
  trackEvent('form_submit', {
    form_type: formData.get('_formType') || 'contact',
    form_country: formData.get('country') || '',
    form_message_length: (formData.get('message') || '').length,
    extra: JSON.stringify({ name_provided: !!formData.get('name') })
  });
}

// Track clic sur CTA (appelée depuis app.js)
function trackCtaClick(buttonText, location, extra = {}) {
  trackEvent('cta_click', {
    button_text: buttonText,
    button_location: location,
    extra: JSON.stringify(extra)
  });
}

// Track clic WhatsApp spécifique
function trackWhatsAppClick() {
  trackCtaClick('WhatsApp', 'whatsapp_button');
}

// Exposer les fonctions globalement pour app.js
window.trackEvent = trackEvent;
window.trackFormSubmit = trackFormSubmit;
window.trackCtaClick = trackCtaClick;
window.trackWhatsAppClick = trackWhatsAppClick;
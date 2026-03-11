// Tracking vers Google Sheets (version enrichie)
const TRACKING_URL = 'https://script.google.com/macros/s/AKfycbydvc54j1Uiirw-dW2vf23UWhmxeTgNOS9Q-JXPN6clGeKBLzz34ifT807T4mw0khttps://script.google.com/macros/s/AKfycbwwgIYlizK7eeZgzjmgLzmV_GRsN-zNkhKZ2CQMHmTC6Pe2ZzOLX47ILaPpSWI2klV7/execKrS/exec';

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
    const data = {
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      event_type: eventType,
      page: window.location.pathname,
      page_title: document.title,
      language: typeof i18n !== 'undefined' ? i18n.currentLang : 'fr',
      referrer: document.referrer || '(direct)',
      user_agent: getSimpleUserAgent(),
      screen_size: getScreenSize(),
      ...eventData
    };
    
    // Envoi silencieux
    fetch(TRACKING_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
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
    extra: { name_provided: !!formData.get('name') }
  });
}
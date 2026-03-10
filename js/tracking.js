// Tracking vers Google Sheets (via Apps Script webhook)
const TRACKING_URL = 'https://script.google.com/macros/s/AKfycbws5ZUnAio5WfjclYInGiVSMYUEaIWCoJrD82XpQbpjWuQ1nO46_u9lgRXiZ6DQgqdc/exec';

async function trackEvent(eventName, eventData = {}) {
  try {
    const data = {
      event: eventName,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      language: i18n.currentLang,
      ...eventData
    };
    // Envoi silencieux (fire and forget)
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

// Track page view
trackEvent('page_view', { title: document.title });

// Track form submission
function trackFormSubmit(formData) {
  trackEvent('form_submit', {
    form_type: formData.get('_formType') || 'contact',
    ...Object.fromEntries(formData)
  });
}
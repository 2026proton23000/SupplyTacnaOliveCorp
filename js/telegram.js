// Envoi des notifications Telegram
const TELEGRAM_TOKEN = '8144991223:AAGs60-oFtaZQmQUPnHPNMULGGb_SU6uSI8';
const TELEGRAM_CHAT_ID = '6051665667';

async function sendTelegramMessage(formData) {
  const data = Object.fromEntries(formData);
  // Construction du message
  const message = `
🔔 *Nouvelle demande de contact*
🌐 Langue: ${i18n.currentLang}
📄 Page: ${window.location.pathname}

👤 *Nom*: ${data.name || 'Non renseigné'}
📧 *Email*: ${data.email || 'Non renseigné'}
🌍 *Pays*: ${data.country || 'Non renseigné'}
💬 *Message*: ${data.message || 'Non renseigné'}
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.description);
    console.log('Telegram message sent');
  } catch (error) {
    console.error('Telegram error:', error);
  }
}
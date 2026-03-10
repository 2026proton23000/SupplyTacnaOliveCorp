// Gestion de l'internationalisation
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'fr';
    this.translations = {};
  }

  async loadTranslations() {
    try {
      const response = await fetch(`data/translations/${this.currentLang}.json`);
      this.translations = await response.json();
      this.updatePageContent();
    } catch (error) {
      console.error('Erreur chargement traductions', error);
    }
  }

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.loadTranslations();
  }

  t(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations) || key;
  }

  updatePageContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    document.documentElement.lang = this.currentLang;
  }
}

const i18n = new I18n();
window.i18n = i18n;
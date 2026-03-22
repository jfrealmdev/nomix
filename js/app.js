import store from './store.js';
import router from './router.js';
import i18n from './i18n.js';
import { initNav } from '../components/nav.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';
import { injectCurrencyToggle } from '../components/currency-toggle.js';

// Views
import renderDashboard from './views/dashboard.js';
import renderTransactions from './views/transactions.js';
import renderScan from './views/scan.js';
import renderAnalytics from './views/analytics.js';
import renderSettings from './views/settings.js';

function init() {
  // Seed mock data on first run
  store.seed();

  // Initialize i18n
  const settings = store.getSettings();
  i18n.init(settings.language || 'es');

  // Register routes
  router.on('/dashboard', renderDashboard);
  router.on('/transactions', renderTransactions);
  router.on('/scan', renderScan);
  router.on('/analytics', renderAnalytics);
  router.on('/settings', renderSettings);

  // Init navigation
  initNav();

  // PWA
  registerServiceWorker();
  setupInstallPrompt();

  // Re-render Lucide icons and currency toggle after route changes
  window.addEventListener('route:changed', () => {
    requestAnimationFrame(() => {
      injectCurrencyToggle();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Start router (after event listeners are registered so initial route triggers toggle injection)
  router.init();

  // Re-render current view on language change
  window.addEventListener('lang:changed', () => {
    store.updateSettings({ language: i18n.getLang() });
    router.reload();
    requestAnimationFrame(() => {
      if (window.lucide) window.lucide.createIcons();
    });
  });
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

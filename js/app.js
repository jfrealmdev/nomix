import store from './store.js';
import router from './router.js';
import { initNav } from '../components/nav.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';

// Views
import renderDashboard from './views/dashboard.js';
import renderTransactions from './views/transactions.js';
import renderScan from './views/scan.js';
import renderAnalytics from './views/analytics.js';
import renderSettings from './views/settings.js';

function init() {
  // Seed mock data on first run
  store.seed();

  // Register routes
  router.on('/dashboard', renderDashboard);
  router.on('/transactions', renderTransactions);
  router.on('/scan', renderScan);
  router.on('/analytics', renderAnalytics);
  router.on('/settings', renderSettings);

  // Init navigation
  initNav();

  // Start router
  router.init();

  // PWA
  registerServiceWorker();
  setupInstallPrompt();

  // Re-render Lucide icons after route changes
  window.addEventListener('route:changed', () => {
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

import toast from '../components/toast.js';

let deferredPrompt = null;
let refreshing = false;
let waitingWorker = null;
let swRegistration = null;

const applyUpdate = (showNotification = false) => {
  if (!waitingWorker) return;
  if (showNotification) {
    toast.show({ message: 'Actualizando...', type: 'info', duration: 1500 });
  }
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  waitingWorker = null;
};

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('./sw.js')
    .then(reg => {
      swRegistration = reg;

      // Check for updates on every page load
      reg.update();

      // Already-waiting worker from previous session: apply immediately
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorker = reg.waiting;
        applyUpdate(false);
      }

      // Detect new service worker installing
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorker = newWorker;
          }
        });
      });
    })
    .catch(err => {
      console.log('SW registration failed:', err);
    });

  // Reload when new SW takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  // Auto-apply update on in-app navigation
  window.addEventListener('hashchange', () => {
    if (waitingWorker) applyUpdate(false);
  });

  // Check for updates + auto-apply when tab regains focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (swRegistration) swRegistration.update();
      if (waitingWorker) applyUpdate(true);
    }
  });

  // Periodic update checks every 60s
  setInterval(() => {
    if (swRegistration) swRegistration.update();
  }, 60 * 1000);
}

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install suggestion after a short delay (first visit only)
    const dismissed = localStorage.getItem('nomix:install-dismissed');
    if (!dismissed) {
      setTimeout(() => {
        if (!deferredPrompt) return;
        toast.show({
          message: 'Instala Nomix en tu dispositivo',
          type: 'info',
          duration: 8000,
          action: {
            label: 'Instalar',
            handler: () => promptInstall()
          }
        });
      }, 3000);
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    toast.show({ message: 'Nomix instalado correctamente', type: 'success' });
  });
}

export function canInstall() {
  return !!deferredPrompt;
}

export async function promptInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  if (outcome === 'dismissed') {
    localStorage.setItem('nomix:install-dismissed', '1');
  }
  return outcome === 'accepted';
}

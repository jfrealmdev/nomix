import toast from '../components/toast.js';

let deferredPrompt = null;

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      console.log('SW registered:', reg.scope);

      // Check for updates on every page load
      reg.update();

      // Detect new service worker installing
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          // New SW installed and waiting — notify user
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            toast.show({
              message: 'Nueva versión disponible',
              type: 'info',
              duration: 8000,
              action: {
                label: 'Actualizar',
                handler: () => window.location.reload()
              }
            });
          }
        });
      });
    })
    .catch(err => {
      console.log('SW registration failed:', err);
    });

  // Reload when new SW takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Only auto-reload if there was a previous controller (update scenario)
    if (navigator.serviceWorker.controller) {
      window.location.reload();
    }
  });
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

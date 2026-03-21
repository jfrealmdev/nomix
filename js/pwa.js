import toast from '../components/toast.js';

let deferredPrompt = null;
let refreshing = false;
let waitingWorker = null;
let swRegistration = null;
let updateBannerDismissed = false;
let pendingUpdate = null; // { version, date, notes }

// --- Update Banner ---

const showUpdateBanner = (versionInfo) => {
  // Remove existing banner if any
  removeUpdateBanner();

  const app = document.getElementById('app');
  if (!app) return;

  const banner = document.createElement('div');
  banner.className = 'update-banner';
  banner.id = 'update-banner';
  banner.setAttribute('role', 'alert');

  const content = document.createElement('div');
  content.className = 'update-banner__content';

  const header = document.createElement('div');
  header.className = 'update-banner__header';
  header.innerHTML = `
    <i data-lucide="refresh-cw" style="width:18px;height:18px"></i>
    <strong>Nueva versión ${versionInfo.version} disponible</strong>
  `;

  content.appendChild(header);

  if (versionInfo.notes && versionInfo.notes.length > 0) {
    const notesList = document.createElement('ul');
    notesList.className = 'update-banner__notes';
    versionInfo.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      notesList.appendChild(li);
    });
    content.appendChild(notesList);
  }

  const actions = document.createElement('div');
  actions.className = 'update-banner__actions';

  const updateBtn = document.createElement('button');
  updateBtn.className = 'btn btn-primary update-banner__btn';
  updateBtn.textContent = 'Actualizar ahora';
  updateBtn.addEventListener('click', () => {
    applyUpdate();
  });

  const dismissBtn = document.createElement('button');
  dismissBtn.className = 'btn-icon update-banner__dismiss';
  dismissBtn.setAttribute('aria-label', 'Cerrar');
  dismissBtn.innerHTML = '<i data-lucide="x"></i>';
  dismissBtn.addEventListener('click', () => {
    updateBannerDismissed = true;
    removeUpdateBanner();
  });

  actions.appendChild(updateBtn);
  banner.appendChild(content);
  banner.appendChild(actions);
  banner.appendChild(dismissBtn);

  app.insertBefore(banner, app.firstChild);

  // Render Lucide icons in banner
  if (window.lucide) window.lucide.createIcons({ nodes: [banner] });
};

const removeUpdateBanner = () => {
  const existing = document.getElementById('update-banner');
  if (existing) existing.remove();
};

// --- Update Application ---

const applyUpdate = () => {
  if (!waitingWorker) {
    // No waiting worker yet — force reload to pick up new assets
    window.location.reload();
    return;
  }
  toast.show({ message: 'Actualizando...', type: 'info', duration: 1500 });
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  waitingWorker = null;
};

const onUpdateAvailable = (versionInfo) => {
  pendingUpdate = versionInfo;
  if (!updateBannerDismissed) {
    showUpdateBanner(versionInfo);
  }
};

// --- Version Check ---

const checkVersionUpdate = async () => {
  try {
    const response = await fetch(`./version.json?t=${Date.now()}`);
    if (!response.ok) return;
    const remote = await response.json();
    const currentVersion = localStorage.getItem('nomix:app-version');

    if (currentVersion && currentVersion !== remote.version) {
      onUpdateAvailable(remote);
    }
  } catch {
    // Network error — skip silently
  }
};

const saveCurrentVersion = async () => {
  try {
    const response = await fetch(`./version.json?t=${Date.now()}`);
    if (!response.ok) return;
    const data = await response.json();
    localStorage.setItem('nomix:app-version', data.version);
  } catch {
    // Ignore
  }
};

// --- Service Worker Registration ---

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  // Save current version on first load
  saveCurrentVersion();

  navigator.serviceWorker.register('./sw.js')
    .then(reg => {
      swRegistration = reg;

      // Check for SW updates on every page load
      reg.update();

      // Already-waiting worker from previous session
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorker = reg.waiting;
        // Don't auto-apply — check version and show banner
        checkVersionUpdate();
      }

      // Detect new service worker installing
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorker = newWorker;
            // New SW ready — check version and show banner
            checkVersionUpdate();
          }
        });
      });
    })
    .catch(err => {
      console.log('SW registration failed:', err);
    });

  // Reload when new SW takes control (after user clicks "Actualizar ahora")
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    // Update stored version before reload
    if (pendingUpdate) {
      localStorage.setItem('nomix:app-version', pendingUpdate.version);
    }
    window.location.reload();
  });

  // On in-app navigation: re-show banner if dismissed and update still pending
  window.addEventListener('hashchange', () => {
    if (pendingUpdate && updateBannerDismissed) {
      updateBannerDismissed = false;
      showUpdateBanner(pendingUpdate);
    }
  });

  // Check for updates when tab regains focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (swRegistration) swRegistration.update();
      checkVersionUpdate();
    }
  });

  // Periodic update checks every 30s
  setInterval(() => {
    if (swRegistration) swRegistration.update();
    checkVersionUpdate();
  }, 30 * 1000);

  // Listen for BroadcastChannel messages from SW
  try {
    const updateChannel = new BroadcastChannel('nomix-updates');
    updateChannel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_ACTIVATED') {
        // New SW activated — check version
        checkVersionUpdate();
      }
    });
  } catch {
    // BroadcastChannel not supported — polling is the fallback
  }
}

// --- Install Prompt ---

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

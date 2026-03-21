import router from '../js/router.js';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'home', label: 'Inicio' },
  { path: '/transactions', icon: 'list', label: 'Movimientos' },
  { path: '/scan', icon: 'scan', label: 'Escanear', isFab: true },
  { path: '/analytics', icon: 'bar-chart-2', label: 'Análisis' },
  { path: '/settings', icon: 'settings', label: 'Ajustes' },
];

function createIcon(name) {
  const el = document.createElement('i');
  el.setAttribute('data-lucide', name);
  return el;
}

export function renderBottomNav() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  nav.innerHTML = '';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Navegación principal');

  NAV_ITEMS.forEach(item => {
    const btn = document.createElement('button');
    btn.className = item.isFab ? 'nav-fab' : 'nav-item';
    btn.setAttribute('aria-label', item.label);
    btn.dataset.path = item.path;

    const icon = createIcon(item.icon);
    btn.appendChild(icon);

    if (!item.isFab) {
      const label = document.createElement('span');
      label.textContent = item.label;
      btn.appendChild(label);
    }

    btn.addEventListener('click', () => router.navigate(item.path));
    nav.appendChild(btn);
  });

  updateActiveNav(router.getCurrentPath());
}

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = '';
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'Navegación principal');

  // Logo
  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.textContent = 'N';
  sidebar.appendChild(logo);

  NAV_ITEMS.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-item';
    btn.dataset.path = item.path;

    const icon = createIcon(item.icon);
    btn.appendChild(icon);

    const label = document.createElement('span');
    label.textContent = item.label;
    btn.appendChild(label);

    btn.addEventListener('click', () => router.navigate(item.path));
    sidebar.appendChild(btn);
  });

  updateActiveNav(router.getCurrentPath());
}

export function updateActiveNav(path) {
  // Bottom nav
  document.querySelectorAll('#bottom-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === path);
  });
  // Sidebar
  document.querySelectorAll('#sidebar .sidebar-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === path);
  });
}

export function initNav() {
  renderBottomNav();
  renderSidebar();

  window.addEventListener('route:changed', (e) => {
    updateActiveNav(e.detail.path);
  });

  // Re-create icons after rendering
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

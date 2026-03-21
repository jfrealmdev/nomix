import router from '../js/router.js';
import i18n from '../js/i18n.js';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'home', labelKey: 'nav.home' },
  { path: '/transactions', icon: 'file-text', labelKey: 'nav.transactions' },
  { path: '/scan', icon: 'plus-circle', labelKey: 'nav.add', isFab: true },
  { path: '/analytics', icon: 'trending-up', labelKey: 'nav.analytics' },
  { path: '/settings', icon: 'settings', labelKey: 'nav.settings' },
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
  nav.setAttribute('aria-label', i18n.t('nav.aria'));

  NAV_ITEMS.forEach(item => {
    const label = i18n.t(item.labelKey);
    const btn = document.createElement('button');
    btn.className = item.isFab ? 'nav-fab' : 'nav-item';
    btn.setAttribute('aria-label', label);
    btn.dataset.path = item.path;

    const icon = createIcon(item.icon);
    btn.appendChild(icon);

    if (!item.isFab) {
      const span = document.createElement('span');
      span.textContent = label;
      btn.appendChild(span);
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
  sidebar.setAttribute('aria-label', i18n.t('nav.aria'));

  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.textContent = 'N';
  sidebar.appendChild(logo);

  NAV_ITEMS.forEach(item => {
    const label = i18n.t(item.labelKey);
    const btn = document.createElement('button');
    btn.className = 'sidebar-item';
    btn.dataset.path = item.path;

    const icon = createIcon(item.icon);
    btn.appendChild(icon);

    const span = document.createElement('span');
    span.textContent = label;
    btn.appendChild(span);

    btn.addEventListener('click', () => router.navigate(item.path));
    sidebar.appendChild(btn);
  });

  updateActiveNav(router.getCurrentPath());
}

export function updateActiveNav(path) {
  document.querySelectorAll('#bottom-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === path);
  });
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

  window.addEventListener('lang:changed', () => {
    renderBottomNav();
    renderSidebar();
    if (window.lucide) window.lucide.createIcons();
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

import store from '../store.js';
import { formatCurrency, getCategoryById } from '../utils.js';
import modal from '../../components/modal.js';
import toast from '../../components/toast.js';
import router from '../router.js';
import { canInstall, promptInstall } from '../pwa.js';

export default function renderSettings(container) {
  const topBar = document.getElementById('top-bar');
  topBar.innerHTML = `<div class="top-bar__greeting">Ajustes</div>`;

  const settings = store.getSettings();
  const accounts = store.getAccounts();
  const categories = store.getCategories();
  const budgets = store.getBudgets();

  container.innerHTML = '';

  // Profile
  const profile = document.createElement('div');
  profile.className = 'settings-group';
  profile.innerHTML = `<div class="settings-group__title">Perfil</div>`;

  const profileCard = document.createElement('div');
  profileCard.className = 'card mb-4';
  profileCard.style.display = 'flex';
  profileCard.style.alignItems = 'center';
  profileCard.style.gap = 'var(--space-4)';
  profileCard.innerHTML = `
    <div class="top-bar__avatar" style="width:56px;height:56px;font-size:22px;">${settings.name.charAt(0)}</div>
    <div>
      <div style="font-family:var(--font-display);font-weight:600;font-size:18px;">${settings.name}</div>
      <div style="color:var(--color-text-muted);font-size:13px;">Cuenta personal</div>
    </div>
  `;
  profile.appendChild(profileCard);

  // Currency selector
  const currencyItem = createSettingItem('💱', 'Moneda', settings.currency);
  currencyItem.addEventListener('click', () => {
    const content = document.createElement('div');
    const currencies = ['GTQ', 'USD', 'MXN', 'EUR'];
    currencies.forEach(cur => {
      const btn = document.createElement('button');
      btn.className = `settings-item ${cur === settings.currency ? 'chip-active' : ''}`;
      btn.style.width = '100%';
      btn.innerHTML = `<span>${cur}</span>${cur === settings.currency ? '<span style="color:var(--color-accent);">✓</span>' : ''}`;
      btn.addEventListener('click', () => {
        store.updateSettings({ currency: cur });
        modal.close();
        toast.show({ message: `Moneda cambiada a ${cur}`, type: 'success' });
        renderSettings(container);
      });
      content.appendChild(btn);
    });

    modal.open({ title: 'Seleccionar moneda', content, isSheet: true });
  });
  profile.appendChild(currencyItem);
  container.appendChild(profile);

  // Bank Accounts
  const accGroup = document.createElement('div');
  accGroup.className = 'settings-group';
  accGroup.innerHTML = `<div class="settings-group__title">Cuentas Bancarias</div>`;

  accounts.forEach(acc => {
    const item = createSettingItem(
      acc.type === 'credit' ? '💳' : '🏦',
      acc.name,
      `${acc.number} · ${formatCurrency(acc.balance)}`
    );
    accGroup.appendChild(item);
  });

  const addAccBtn = document.createElement('button');
  addAccBtn.className = 'btn btn-ghost btn-block mt-4 mb-4';
  addAccBtn.textContent = '+ Agregar Cuenta';
  addAccBtn.addEventListener('click', () => {
    toast.show({ message: 'Función disponible próximamente', type: 'info' });
  });
  accGroup.appendChild(addAccBtn);
  container.appendChild(accGroup);

  // Categories
  const catGroup = document.createElement('div');
  catGroup.className = 'settings-group';
  catGroup.innerHTML = `<div class="settings-group__title">Categorías</div>`;

  categories.forEach(cat => {
    const item = createSettingItem(cat.icon, cat.name, '');
    item.querySelector('.settings-item__value').innerHTML = `<span style="width:12px;height:12px;border-radius:50%;background:${cat.color};display:inline-block;"></span>`;
    catGroup.appendChild(item);
  });
  container.appendChild(catGroup);

  // Budgets
  if (budgets.length > 0) {
    const budgetGroup = document.createElement('div');
    budgetGroup.className = 'settings-group';
    budgetGroup.innerHTML = `<div class="settings-group__title">Presupuestos mensuales</div>`;

    const spending = store.getCategorySpending();
    budgets.forEach(budget => {
      const cat = getCategoryById(budget.categoryId);
      const spent = spending.find(s => s.id === budget.categoryId)?.total || 0;
      const pct = Math.min((spent / budget.limit) * 100, 100);
      const isOver = spent > budget.limit;

      const item = document.createElement('div');
      item.className = 'card mb-2';
      item.style.padding = 'var(--space-4)';
      item.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:13px;">
          <span>${cat.icon} ${cat.name}</span>
          <span style="font-family:var(--font-mono);color:${isOver ? 'var(--color-danger)' : 'var(--color-text-muted)'};">
            ${formatCurrency(spent)} / ${formatCurrency(budget.limit)}
          </span>
        </div>
        <div class="progress">
          <div class="progress-bar" style="width:${pct}%;background:${isOver ? 'var(--color-danger)' : cat.color};"></div>
        </div>
      `;
      budgetGroup.appendChild(item);
    });
    container.appendChild(budgetGroup);
  }

  // Notifications
  const notifGroup = document.createElement('div');
  notifGroup.className = 'settings-group';
  notifGroup.innerHTML = `<div class="settings-group__title">Notificaciones</div>`;

  const notifItem = document.createElement('div');
  notifItem.className = 'settings-item';
  notifItem.innerHTML = `
    <span class="settings-item__label">🔔 Alertas de gastos</span>
    <input type="checkbox" class="toggle" ${settings.notifications ? 'checked' : ''}>
  `;
  notifItem.querySelector('.toggle').addEventListener('change', (e) => {
    store.updateSettings({ notifications: e.target.checked });
    toast.show({ message: e.target.checked ? 'Notificaciones activadas' : 'Notificaciones desactivadas', type: 'info' });
  });
  notifGroup.appendChild(notifItem);
  container.appendChild(notifGroup);

  // Data
  const dataGroup = document.createElement('div');
  dataGroup.className = 'settings-group';
  dataGroup.innerHTML = `<div class="settings-group__title">Datos</div>`;

  const exportItem = createSettingItem('📤', 'Exportar datos', 'CSV');
  exportItem.addEventListener('click', () => {
    // Mock CSV export
    const txs = store.getTransactions();
    let csv = 'Fecha,Comercio,Categoría,Monto,Cuenta\n';
    txs.forEach(tx => {
      const cat = getCategoryById(tx.categoryId);
      csv += `${tx.date},${tx.merchant},${cat.name},${tx.amount},${tx.accountId}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nomix-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.show({ message: 'Datos exportados', type: 'success' });
  });
  dataGroup.appendChild(exportItem);

  const clearItem = createSettingItem('🗑️', 'Borrar todos los datos', '');
  clearItem.querySelector('.settings-item__label').style.color = 'var(--color-danger)';
  clearItem.addEventListener('click', () => {
    modal.open({
      title: '¿Borrar todos los datos?',
      content: '<p style="color:var(--color-text-muted);">Esta acción eliminará todas tus transacciones, cuentas y configuraciones. No se puede deshacer.</p>',
      actions: [
        { label: 'Cancelar', variant: 'ghost' },
        {
          label: 'Borrar todo', variant: 'danger', handler: () => {
            store.clearAll();
            store.seed();
            toast.show({ message: 'Datos restaurados', type: 'success' });
            router.navigate('/dashboard');
          }
        }
      ]
    });
  });
  dataGroup.appendChild(clearItem);
  container.appendChild(dataGroup);

  // App (Install)
  if (canInstall()) {
    const appGroup = document.createElement('div');
    appGroup.className = 'settings-group';
    appGroup.innerHTML = `<div class="settings-group__title">Aplicación</div>`;

    const installItem = createSettingItem('📲', 'Instalar Nomix', '');
    installItem.addEventListener('click', async () => {
      const accepted = await promptInstall();
      if (accepted) {
        toast.show({ message: 'Nomix instalado correctamente', type: 'success' });
        renderSettings(container);
      } else {
        toast.show({ message: 'Instalación cancelada', type: 'info' });
      }
    });
    appGroup.appendChild(installItem);
    container.appendChild(appGroup);
  }

  // About
  const aboutGroup = document.createElement('div');
  aboutGroup.className = 'settings-group';
  aboutGroup.innerHTML = `<div class="settings-group__title">Sobre Nomix</div>`;

  const aboutItem = document.createElement('div');
  aboutItem.className = 'card';
  aboutItem.style.padding = 'var(--space-4)';
  aboutItem.innerHTML = `
    <div style="text-align:center;">
      <div style="font-family:var(--font-display);font-weight:700;font-size:24px;color:var(--color-accent);margin-bottom:var(--space-2);">Nomix</div>
      <div style="color:var(--color-text-muted);font-size:13px;">Versión 1.0.0 — Prototipo</div>
      <div style="color:var(--color-text-dim);font-size:12px;margin-top:var(--space-2);">Tu gestor de finanzas personales</div>
    </div>
  `;
  aboutGroup.appendChild(aboutItem);
  container.appendChild(aboutGroup);
}

function createSettingItem(icon, label, value) {
  const item = document.createElement('div');
  item.className = 'settings-item';
  item.innerHTML = `
    <span class="settings-item__label">${icon} ${label}</span>
    <span class="settings-item__value">${value} <i data-lucide="chevron-right" style="width:16px;height:16px;opacity:0.5;"></i></span>
  `;

  if (window.lucide) {
    requestAnimationFrame(() => window.lucide.createIcons({ nodes: [item] }));
  }

  return item;
}

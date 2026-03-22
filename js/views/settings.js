import store from '../store.js';
import i18n from '../i18n.js';
import { formatCurrency, getCategoryById } from '../utils.js';
import modal from '../../components/modal.js';
import toast from '../../components/toast.js';
import router from '../router.js';
import { canInstall, promptInstall } from '../pwa.js';

export default function renderSettings(container) {
  const topBar = document.getElementById('top-bar');
  topBar.innerHTML = `
    <div class="top-bar__brand">
      <div class="top-bar__logo">N</div>
      <span class="top-bar__name">Nomix</span>
    </div>
    <div class="top-bar__actions">
      <button class="btn-icon" aria-label="Notifications"><i data-lucide="bell"></i></button>
      <div class="top-bar__avatar">${store.getSettings().name.charAt(0)}</div>
    </div>
  `;

  const settings = store.getSettings();
  const accounts = store.getAccounts();
  const categories = store.getCategories();
  const budgets = store.getBudgets();

  container.innerHTML = '';

  // Profile
  const profile = document.createElement('div');
  profile.className = 'settings-group';
  profile.innerHTML = `<div class="settings-group__title">${i18n.t('settings.profile')}</div>`;

  const profileCard = document.createElement('div');
  profileCard.className = 'card mb-4';
  profileCard.style.display = 'flex';
  profileCard.style.alignItems = 'center';
  profileCard.style.gap = 'var(--space-4)';
  profileCard.innerHTML = `
    <div class="top-bar__avatar" style="width:56px;height:56px;font-size:22px;">${settings.name.charAt(0)}</div>
    <div>
      <div style="font-family:var(--font-display);font-weight:600;font-size:18px;">${settings.name}</div>
      <div style="color:var(--color-text-muted);font-size:13px;">${i18n.t('settings.personalAccount')}</div>
    </div>
  `;
  profile.appendChild(profileCard);

  // Language selector
  const langItem = createSettingItem('🌐', i18n.t('settings.language'), i18n.getLang() === 'es' ? 'Español' : 'English');
  langItem.addEventListener('click', () => {
    const content = document.createElement('div');
    const langs = [{ code: 'es', label: 'Español' }, { code: 'en', label: 'English' }];
    langs.forEach(l => {
      const btn = document.createElement('button');
      btn.className = `settings-item ${l.code === i18n.getLang() ? 'chip-active' : ''}`;
      btn.style.width = '100%';
      btn.innerHTML = `<span>${l.label}</span>${l.code === i18n.getLang() ? '<span style="color:var(--color-accent);">✓</span>' : ''}`;
      btn.addEventListener('click', () => {
        i18n.setLang(l.code);
        modal.close();
      });
      content.appendChild(btn);
    });
    modal.open({ title: i18n.t('settings.selectLanguage'), content, isSheet: true });
  });
  profile.appendChild(langItem);

  // Currency selector
  const currencyItem = createSettingItem('💱', i18n.t('settings.currency'), settings.currency);
  currencyItem.addEventListener('click', () => {
    const content = document.createElement('div');
    const currencies = ['DOP', 'USD'];
    currencies.forEach(cur => {
      const btn = document.createElement('button');
      btn.className = `settings-item ${cur === settings.currency ? 'chip-active' : ''}`;
      btn.style.width = '100%';
      btn.innerHTML = `<span>${i18n.t(`currency.${cur}`)}</span>${cur === settings.currency ? '<span style="color:var(--color-accent);">✓</span>' : ''}`;
      btn.addEventListener('click', () => {
        store.updateSettings({ currency: cur });
        modal.close();
        toast.show({ message: i18n.t('settings.currencyChanged', { currency: cur }), type: 'success' });
        renderSettings(container);
      });
      content.appendChild(btn);
    });
    modal.open({ title: i18n.t('settings.selectCurrency'), content, isSheet: true });
  });
  profile.appendChild(currencyItem);

  // Exchange rate
  const rateItem = createSettingItem('📊', i18n.t('settings.exchangeRate'), i18n.t('settings.exchangeRateLabel', { rate: settings.exchangeRate || 61 }));
  rateItem.addEventListener('click', () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="margin-bottom:var(--space-4);">
        <label style="display:block;font-size:13px;color:var(--color-text-muted);margin-bottom:var(--space-2);">1 USD =</label>
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <input type="number" class="input" id="exchange-rate-input" value="${settings.exchangeRate || 61}" step="0.01" min="1" style="flex:1;">
          <span style="font-weight:600;">DOP</span>
        </div>
      </div>
    `;
    modal.open({
      title: i18n.t('settings.exchangeRate'),
      content,
      isSheet: true,
      actions: [
        { label: i18n.t('common.cancel'), variant: 'ghost' },
        {
          label: i18n.t('common.save'), variant: 'accent', handler: () => {
            const rate = parseFloat(content.querySelector('#exchange-rate-input').value);
            if (rate > 0) {
              store.updateSettings({ exchangeRate: rate });
              toast.show({ message: i18n.t('settings.exchangeRateUpdated'), type: 'success' });
              renderSettings(container);
            }
          }
        }
      ]
    });
  });
  profile.appendChild(rateItem);
  container.appendChild(profile);

  // Bank Accounts
  const accGroup = document.createElement('div');
  accGroup.className = 'settings-group';
  accGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.bankAccounts')}</div>`;

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
  addAccBtn.textContent = '+ ' + i18n.t('settings.addAccount');
  addAccBtn.addEventListener('click', () => toast.show({ message: i18n.t('settings.comingSoon'), type: 'info' }));
  accGroup.appendChild(addAccBtn);
  container.appendChild(accGroup);

  // Categories
  const catGroup = document.createElement('div');
  catGroup.className = 'settings-group';
  catGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.categories')}</div>`;

  categories.forEach(cat => {
    const catName = i18n.t(`category.${cat.id}`) !== `category.${cat.id}` ? i18n.t(`category.${cat.id}`) : cat.name;
    const item = createSettingItem(cat.icon, catName, '');
    item.querySelector('.settings-item__value').innerHTML = `<span style="width:12px;height:12px;border-radius:50%;background:${cat.color};display:inline-block;"></span>`;
    catGroup.appendChild(item);
  });
  container.appendChild(catGroup);

  // Budgets
  if (budgets.length > 0) {
    const budgetGroup = document.createElement('div');
    budgetGroup.className = 'settings-group';
    budgetGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.monthlyBudgets')}</div>`;

    const spending = store.getCategorySpending();
    budgets.forEach(budget => {
      const cat = getCategoryById(budget.categoryId);
      const catName = i18n.t(`category.${cat.id}`) !== `category.${cat.id}` ? i18n.t(`category.${cat.id}`) : cat.name;
      const spent = spending.find(s => s.id === budget.categoryId)?.total || 0;
      const pct = Math.min((spent / budget.limit) * 100, 100);
      const isOver = spent > budget.limit;

      const item = document.createElement('div');
      item.className = 'card mb-2';
      item.style.padding = 'var(--space-4)';
      item.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:13px;">
          <span>${cat.icon} ${catName}</span>
          <span style="font-family:var(--font-mono);color:${isOver ? 'var(--color-danger)' : 'var(--color-text-muted)'};">
            ${formatCurrency(spent)} / ${formatCurrency(budget.limit)}
          </span>
        </div>
        <div class="progress"><div class="progress-bar" style="width:${pct}%;background:${isOver ? 'var(--color-danger)' : cat.color};"></div></div>
      `;
      budgetGroup.appendChild(item);
    });
    container.appendChild(budgetGroup);
  }

  // Notifications
  const notifGroup = document.createElement('div');
  notifGroup.className = 'settings-group';
  notifGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.notifications')}</div>`;

  const notifItem = document.createElement('div');
  notifItem.className = 'settings-item';
  notifItem.innerHTML = `
    <span class="settings-item__label">🔔 ${i18n.t('settings.expenseAlerts')}</span>
    <input type="checkbox" class="toggle" ${settings.notifications ? 'checked' : ''}>
  `;
  notifItem.querySelector('.toggle').addEventListener('change', (e) => {
    store.updateSettings({ notifications: e.target.checked });
    toast.show({ message: e.target.checked ? i18n.t('settings.notifEnabled') : i18n.t('settings.notifDisabled'), type: 'info' });
  });
  notifGroup.appendChild(notifItem);
  container.appendChild(notifGroup);

  // Data
  const dataGroup = document.createElement('div');
  dataGroup.className = 'settings-group';
  dataGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.data')}</div>`;

  const exportItem = createSettingItem('📤', i18n.t('settings.exportData'), 'CSV');
  exportItem.addEventListener('click', () => {
    const txs = store.getTransactions();
    let csv = i18n.t('csv.header') + '\n';
    txs.forEach(tx => {
      const cat = getCategoryById(tx.categoryId);
      const catName = i18n.t(`category.${cat.id}`) !== `category.${cat.id}` ? i18n.t(`category.${cat.id}`) : cat.name;
      csv += `${tx.date},${tx.merchant},${catName},${tx.amount},${tx.accountId}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nomix-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.show({ message: i18n.t('settings.exported'), type: 'success' });
  });
  dataGroup.appendChild(exportItem);

  const clearItem = createSettingItem('🗑️', i18n.t('settings.deleteAll'), '');
  clearItem.querySelector('.settings-item__label').style.color = 'var(--color-danger)';
  clearItem.addEventListener('click', () => {
    modal.open({
      title: i18n.t('settings.deleteConfirmTitle'),
      content: `<p style="color:var(--color-text-muted);">${i18n.t('settings.deleteConfirmMsg')}</p>`,
      actions: [
        { label: i18n.t('common.cancel'), variant: 'ghost' },
        {
          label: i18n.t('settings.deleteBtn'), variant: 'danger', handler: () => {
            store.clearAll();
            store.seed();
            toast.show({ message: i18n.t('settings.dataRestored'), type: 'success' });
            router.navigate('/dashboard');
          }
        }
      ]
    });
  });
  dataGroup.appendChild(clearItem);
  container.appendChild(dataGroup);

  // Install
  if (canInstall()) {
    const appGroup = document.createElement('div');
    appGroup.className = 'settings-group';
    appGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.app')}</div>`;

    const installItem = createSettingItem('📲', i18n.t('settings.installNomix'), '');
    installItem.addEventListener('click', async () => {
      const accepted = await promptInstall();
      toast.show({ message: accepted ? i18n.t('settings.installed') : i18n.t('settings.installCancelled'), type: accepted ? 'success' : 'info' });
      if (accepted) renderSettings(container);
    });
    appGroup.appendChild(installItem);
    container.appendChild(appGroup);
  }

  // About
  const aboutGroup = document.createElement('div');
  aboutGroup.className = 'settings-group';
  aboutGroup.innerHTML = `<div class="settings-group__title">${i18n.t('settings.about')}</div>`;

  const aboutItem = document.createElement('div');
  aboutItem.className = 'card';
  aboutItem.style.padding = 'var(--space-4)';
  aboutItem.innerHTML = `
    <div style="text-align:center;">
      <div style="font-family:var(--font-display);font-weight:700;font-size:24px;color:var(--color-accent);margin-bottom:var(--space-2);">Nomix</div>
      <div style="color:var(--color-text-muted);font-size:13px;">${i18n.t('settings.version')}</div>
      <div style="color:var(--color-text-dim);font-size:12px;margin-top:var(--space-2);">${i18n.t('settings.tagline')}</div>
    </div>
  `;
  aboutGroup.appendChild(aboutItem);
  container.appendChild(aboutGroup);

  if (window.lucide) window.lucide.createIcons({ nodes: [container] });
}

function createSettingItem(icon, label, value) {
  const item = document.createElement('div');
  item.className = 'settings-item';
  item.innerHTML = `
    <span class="settings-item__label">${icon} ${label}</span>
    <span class="settings-item__value">${value} <i data-lucide="chevron-right" style="width:16px;height:16px;opacity:0.5;"></i></span>
  `;
  if (window.lucide) requestAnimationFrame(() => window.lucide.createIcons({ nodes: [item] }));
  return item;
}

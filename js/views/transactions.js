import store from '../store.js';
import i18n from '../i18n.js';
import { formatCurrency, getMonthName, groupTransactionsByDate, getDateGroupDateLabel } from '../utils.js';
import { createTransactionRow } from '../../components/card.js';

const PAGE_SIZE = 20;

export default function renderTransactions(container) {
  let timeFilter = 'week'; // week | month | year | custom
  let searchQuery = '';
  let page = 1;

  function getDateRange() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (timeFilter === 'week') {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      return { start, end: now };
    }
    if (timeFilter === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end: now };
    }
    if (timeFilter === 'year') {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end: now };
    }
    // custom — show all
    return { start: new Date(2000, 0, 1), end: now };
  }

  function getFilteredTxs() {
    let txs = store.getTransactions();
    const { start, end } = getDateRange();

    txs = txs.filter(t => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      txs = txs.filter(t => {
        const catName = (i18n.t(`category.${t.categoryId}`) || '').toLowerCase();
        return t.merchant.toLowerCase().includes(q) || catName.includes(q);
      });
    }

    return txs;
  }

  function render() {
    container.innerHTML = '';

    // Top bar
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

    // Search
    const searchWrap = document.createElement('div');
    searchWrap.className = 'search-wrapper mb-4';
    searchWrap.innerHTML = `
      <i data-lucide="search"></i>
      <input type="search" class="search-input" placeholder="${i18n.t('transactions.search')}" value="${searchQuery}">
    `;
    container.appendChild(searchWrap);

    const searchInput = searchWrap.querySelector('input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      page = 1;
      renderList();
    });

    // Time filter chips
    const filterRow = document.createElement('div');
    filterRow.className = 'filter-row mb-4';

    const timeFilters = [
      { id: 'week', labelKey: 'transactions.week' },
      { id: 'month', labelKey: 'transactions.month' },
      { id: 'year', labelKey: 'transactions.year' },
      { id: 'custom', labelKey: 'transactions.custom', icon: 'calendar' },
    ];

    timeFilters.forEach(f => {
      const chip = document.createElement('button');
      chip.className = `chip ${timeFilter === f.id ? 'chip-active' : ''}`;
      if (f.icon) {
        chip.innerHTML = `<i data-lucide="${f.icon}" style="width:14px;height:14px"></i> ${i18n.t(f.labelKey)}`;
      } else {
        chip.textContent = i18n.t(f.labelKey);
      }
      chip.addEventListener('click', () => {
        timeFilter = f.id;
        page = 1;
        render();
      });
      filterRow.appendChild(chip);
    });
    container.appendChild(filterRow);

    // Transaction list
    const listContainer = document.createElement('div');
    listContainer.id = 'tx-list';
    container.appendChild(listContainer);

    renderList();

    if (window.lucide) window.lucide.createIcons({ nodes: [container, topBar] });
  }

  function renderList() {
    const listContainer = document.getElementById('tx-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const txs = getFilteredTxs();
    const paged = txs.slice(0, page * PAGE_SIZE);

    if (paged.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <div class="empty-state__title">${i18n.t('common.noResults')}</div>
          <p style="color:var(--color-text-muted)">${i18n.t('transactions.noResults')}</p>
        </div>
      `;
      return;
    }

    // Group by date
    const groups = groupTransactionsByDate(paged);
    groups.forEach(group => {
      const header = document.createElement('div');
      header.className = 'date-group-header';
      header.innerHTML = `
        <span class="date-group-header__label">${group.label}</span>
        <span class="date-group-header__date">${getDateGroupDateLabel(group.date)}</span>
      `;
      listContainer.appendChild(header);

      group.txs.forEach(tx => {
        listContainer.appendChild(createTransactionRow(tx));
      });
    });

    // Loading indicator
    if (paged.length < txs.length) {
      const loading = document.createElement('div');
      loading.className = 'loading-indicator';
      loading.innerHTML = `
        <div class="spinner-sm"></div>
        <span>${i18n.t('transactions.loadingOlder')}</span>
      `;
      listContainer.appendChild(loading);

      // Simple scroll-based load more
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          page++;
          renderList();
        }
      });
      observer.observe(loading);
    }
  }

  render();
}

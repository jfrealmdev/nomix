import store from '../store.js';
import { formatCurrency, getMonthName, groupTransactionsByDate, generateId, getCategoryById } from '../utils.js';
import { createTransactionRow } from '../../components/card.js';
import modal from '../../components/modal.js';
import toast from '../../components/toast.js';
import router from '../router.js';

const PAGE_SIZE = 20;

export default function renderTransactions(container) {
  let filter = 'all'; // all | expense | income
  let categoryFilter = null;
  let searchQuery = '';
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let page = 1;

  function getFilteredTxs() {
    let txs = store.getTransactions();

    // Month filter
    txs = txs.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Type filter
    if (filter === 'expense') txs = txs.filter(t => t.amount < 0);
    if (filter === 'income') txs = txs.filter(t => t.amount > 0);

    // Category filter
    if (categoryFilter) txs = txs.filter(t => t.categoryId === categoryFilter);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      txs = txs.filter(t => t.merchant.toLowerCase().includes(q));
    }

    return txs;
  }

  function render() {
    container.innerHTML = '';

    // Top bar
    const topBar = document.getElementById('top-bar');
    topBar.innerHTML = `
      <div class="top-bar__greeting">Movimientos</div>
      <button class="btn-icon" id="add-tx-btn" aria-label="Agregar transacción"><i data-lucide="plus"></i></button>
    `;

    // Search
    const searchWrap = document.createElement('div');
    searchWrap.className = 'search-wrapper mb-4';
    searchWrap.innerHTML = `
      <i data-lucide="search"></i>
      <input type="search" class="search-input" placeholder="Buscar movimiento..." value="${searchQuery}">
    `;
    container.appendChild(searchWrap);

    const searchInput = searchWrap.querySelector('input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      page = 1;
      renderList();
    });

    // Filter chips
    const filterRow = document.createElement('div');
    filterRow.className = 'filter-row mb-3';

    const filters = [
      { id: 'all', label: 'Todos' },
      { id: 'expense', label: 'Gastos' },
      { id: 'income', label: 'Ingresos' },
    ];

    filters.forEach(f => {
      const chip = document.createElement('button');
      chip.className = `chip ${filter === f.id ? 'chip-active' : ''}`;
      chip.textContent = f.label;
      chip.addEventListener('click', () => {
        filter = f.id;
        categoryFilter = null;
        page = 1;
        render();
      });
      filterRow.appendChild(chip);
    });

    // Category chips
    const categories = store.getCategories().filter(c => c.id !== 'income');
    categories.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = `chip ${categoryFilter === cat.id ? 'chip-active' : ''}`;
      chip.textContent = `${cat.icon} ${cat.name}`;
      chip.addEventListener('click', () => {
        categoryFilter = categoryFilter === cat.id ? null : cat.id;
        page = 1;
        render();
      });
      filterRow.appendChild(chip);
    });

    container.appendChild(filterRow);

    // Month picker
    const monthPicker = document.createElement('div');
    monthPicker.className = 'month-picker mb-4';
    monthPicker.innerHTML = `
      <button aria-label="Mes anterior"><i data-lucide="chevron-left"></i></button>
      <span>${getMonthName(currentMonth)} ${currentYear}</span>
      <button aria-label="Mes siguiente"><i data-lucide="chevron-right"></i></button>
    `;

    const [prevBtn, , nextBtn] = monthPicker.children;
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      page = 1;
      render();
    });
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      page = 1;
      render();
    });
    container.appendChild(monthPicker);

    // Transaction list container
    const listContainer = document.createElement('div');
    listContainer.id = 'tx-list';
    container.appendChild(listContainer);

    renderList();

    // Add tx button
    document.getElementById('add-tx-btn')?.addEventListener('click', openQuickAdd);

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
          <div class="empty-state__title">0 resultados</div>
          <p style="color:var(--color-text-muted)">No se encontraron movimientos con estos filtros</p>
        </div>
      `;
      return;
    }

    const groups = groupTransactionsByDate(paged);
    Object.entries(groups).forEach(([label, groupTxs]) => {
      const header = document.createElement('div');
      header.className = 'date-group-header';
      header.textContent = label;
      listContainer.appendChild(header);

      groupTxs.forEach(tx => {
        listContainer.appendChild(createTransactionRow(tx, true));
      });
    });

    // Load more
    if (paged.length < txs.length) {
      const loadMore = document.createElement('button');
      loadMore.className = 'btn btn-ghost btn-block mt-4';
      loadMore.textContent = `Cargar más (${txs.length - paged.length} restantes)`;
      loadMore.addEventListener('click', () => {
        page++;
        renderList();
      });
      listContainer.appendChild(loadMore);
    }
  }

  function openQuickAdd() {
    const form = document.createElement('div');

    const categories = store.getCategories();
    const accounts = store.getAccounts();

    form.innerHTML = `
      <div class="form-group">
        <div class="toggle-group mb-4">
          <button class="toggle-group__btn active-expense" data-type="expense">Gasto</button>
          <button class="toggle-group__btn" data-type="income">Ingreso</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Monto</label>
        <input type="number" class="input" id="tx-amount" placeholder="0.00" step="0.01" min="0" inputmode="decimal">
      </div>
      <div class="form-group">
        <label class="form-label">Descripción</label>
        <input type="text" class="input" id="tx-merchant" placeholder="Nombre del comercio">
      </div>
      <div class="form-group">
        <label class="form-label">Categoría</label>
        <div class="category-grid" id="tx-category-grid">
          ${categories.map(c => `
            <button class="category-option" data-id="${c.id}">
              <span class="category-option__icon">${c.icon}</span>
              <span>${c.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1">
          <label class="form-label">Fecha</label>
          <input type="date" class="input" id="tx-date" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group" style="flex:1">
          <label class="form-label">Cuenta</label>
          <select class="select" id="tx-account">
            ${accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
          </select>
        </div>
      </div>
    `;

    // Toggle type
    let txType = 'expense';
    const toggleBtns = form.querySelectorAll('.toggle-group__btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        txType = btn.dataset.type;
        toggleBtns.forEach(b => {
          b.className = 'toggle-group__btn';
          if (b.dataset.type === txType) {
            b.classList.add(txType === 'income' ? 'active-income' : 'active-expense');
          }
        });
      });
    });

    // Category select
    let selectedCategory = null;
    form.querySelectorAll('.category-option').forEach(opt => {
      opt.addEventListener('click', () => {
        form.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedCategory = opt.dataset.id;
      });
    });

    modal.open({
      title: 'Nuevo Movimiento',
      content: form,
      isSheet: true,
      actions: [
        { label: 'Cancelar', variant: 'ghost' },
        {
          label: 'Guardar', variant: 'accent', handler: () => {
            const amount = parseFloat(form.querySelector('#tx-amount').value);
            const merchant = form.querySelector('#tx-merchant').value;
            const date = form.querySelector('#tx-date').value;
            const accountId = form.querySelector('#tx-account').value;

            if (!amount || !merchant || !selectedCategory) {
              toast.show({ message: 'Completa todos los campos', type: 'error' });
              return;
            }

            store.addTransaction({
              id: generateId(),
              date: new Date(date).toISOString(),
              merchant,
              categoryId: selectedCategory,
              accountId,
              amount: txType === 'expense' ? -Math.abs(amount) : Math.abs(amount),
              note: '',
            });

            toast.show({ message: 'Movimiento guardado', type: 'success' });
            render();
          }
        },
      ]
    });
  }

  render();
}

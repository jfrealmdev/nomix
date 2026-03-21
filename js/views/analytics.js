import store from '../store.js';
import { formatCurrency, getMonthName } from '../utils.js';
import { createBarChart, createLineChart, destroyAllCharts } from '../../components/chart-widget.js';

export default function renderAnalytics(container) {
  const topBar = document.getElementById('top-bar');
  topBar.innerHTML = `<div class="top-bar__greeting">Análisis</div>`;

  let period = 'month'; // week | month | quarter | year

  function render() {
    container.innerHTML = '';
    destroyAllCharts();

    // Period selector
    const pills = document.createElement('div');
    pills.className = 'tab-pills mb-6';
    const periods = [
      { id: 'week', label: 'Semana' },
      { id: 'month', label: 'Mes' },
      { id: 'quarter', label: '3 Meses' },
      { id: 'year', label: 'Año' },
    ];
    periods.forEach(p => {
      const btn = document.createElement('button');
      btn.className = `tab-pill ${period === p.id ? 'active' : ''}`;
      btn.textContent = p.label;
      btn.addEventListener('click', () => {
        period = p.id;
        render();
      });
      pills.appendChild(btn);
    });
    container.appendChild(pills);

    const txs = store.getTransactions();
    const now = new Date();

    // Get period range
    let startDate;
    switch (period) {
      case 'week':
        startDate = new Date(now); startDate.setDate(now.getDate() - 7); break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case 'quarter':
        startDate = new Date(now); startDate.setMonth(now.getMonth() - 3); break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1); break;
    }

    const periodTxs = txs.filter(t => new Date(t.date) >= startDate);
    const income = periodTxs.filter(t => t.amount > 0);
    const expenses = periodTxs.filter(t => t.amount < 0);
    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);

    // 1. Income vs Expense Bar Chart
    renderIncomeExpenseChart(periodTxs);

    // 2. Category Breakdown
    renderCategoryBreakdown(expenses);

    // 3. Spending Trend
    renderSpendingTrend(expenses, startDate, now);

    // 4. Top Merchants
    renderTopMerchants(expenses);

    // 5. Savings Rate
    renderSavingsRate(totalIncome, totalExpense);

    // 6. AI Insight
    renderInsightCard();
  }

  function renderIncomeExpenseChart(periodTxs) {
    const card = document.createElement('div');
    card.className = 'card mb-6';
    card.innerHTML = '<h3 class="section-title mb-4">Ingresos vs Gastos</h3>';

    const chartWrap = document.createElement('div');
    chartWrap.style.height = '240px';
    const canvas = document.createElement('canvas');
    canvas.id = 'analytics-bar';
    chartWrap.appendChild(canvas);
    card.appendChild(chartWrap);
    container.appendChild(card);

    // Group by period
    const groups = {};
    periodTxs.forEach(tx => {
      const d = new Date(tx.date);
      let key;
      if (period === 'week') {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        key = days[d.getDay()];
      } else if (period === 'month') {
        key = `Sem ${Math.ceil(d.getDate() / 7)}`;
      } else {
        key = getMonthName(d.getMonth()).substring(0, 3);
      }
      if (!groups[key]) groups[key] = { income: 0, expenses: 0 };
      if (tx.amount > 0) groups[key].income += tx.amount;
      else groups[key].expenses += Math.abs(tx.amount);
    });

    const labels = Object.keys(groups);
    requestAnimationFrame(() => {
      createBarChart(canvas, {
        labels,
        income: labels.map(l => groups[l].income),
        expenses: labels.map(l => groups[l].expenses),
      });
    });
  }

  function renderCategoryBreakdown(expenses) {
    const categories = store.getCategories().filter(c => c.id !== 'income');
    const catSpending = {};
    expenses.forEach(tx => {
      catSpending[tx.categoryId] = (catSpending[tx.categoryId] || 0) + Math.abs(tx.amount);
    });

    const sorted = categories
      .map(c => ({ ...c, total: catSpending[c.id] || 0 }))
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total);

    if (sorted.length === 0) return;

    const maxVal = sorted[0].total;

    const card = document.createElement('div');
    card.className = 'card mb-6';
    card.innerHTML = '<h3 class="section-title mb-4">Gastos por categoría</h3>';

    sorted.forEach(cat => {
      const pct = (cat.total / maxVal * 100).toFixed(0);
      const row = document.createElement('div');
      row.style.cssText = 'margin-bottom:var(--space-3);';
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);font-size:13px;">
          <span>${cat.icon} ${cat.name}</span>
          <span style="font-family:var(--font-mono);color:var(--color-text-muted);">${formatCurrency(cat.total)}</span>
        </div>
        <div class="progress">
          <div class="progress-bar" style="width:${pct}%;background:${cat.color};"></div>
        </div>
      `;
      card.appendChild(row);
    });

    container.appendChild(card);
  }

  function renderSpendingTrend(expenses, startDate, endDate) {
    const card = document.createElement('div');
    card.className = 'card mb-6';
    card.innerHTML = '<h3 class="section-title mb-4">Tendencia de gastos</h3>';

    const chartWrap = document.createElement('div');
    chartWrap.style.height = '200px';
    const canvas = document.createElement('canvas');
    canvas.id = 'analytics-line';
    chartWrap.appendChild(canvas);
    card.appendChild(chartWrap);
    container.appendChild(card);

    // Group by day
    const days = {};
    const labels = [];
    const d = new Date(startDate);
    while (d <= endDate) {
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      d.setDate(d.getDate() + 1);
    }

    expenses.forEach(tx => {
      const key = new Date(tx.date).toISOString().split('T')[0];
      if (days[key] !== undefined) days[key] += Math.abs(tx.amount);
    });

    const values = Object.values(days);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const averageValues = values.map(() => avg);

    // Limit labels to ~15 for readability
    const step = Math.max(1, Math.floor(labels.length / 15));
    const filteredLabels = labels.map((l, i) => i % step === 0 ? l : '');

    requestAnimationFrame(() => {
      createLineChart(canvas, {
        labels: filteredLabels,
        values,
        averageValues,
        label: 'Gastos diarios',
      });
    });
  }

  function renderTopMerchants(expenses) {
    const merchantTotals = {};
    expenses.forEach(tx => {
      merchantTotals[tx.merchant] = (merchantTotals[tx.merchant] || 0) + Math.abs(tx.amount);
    });

    const sorted = Object.entries(merchantTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (sorted.length === 0) return;

    const maxVal = sorted[0][1];

    const card = document.createElement('div');
    card.className = 'card mb-6';
    card.innerHTML = '<h3 class="section-title mb-4">Comercios principales</h3>';

    sorted.forEach(([name, total], i) => {
      const pct = (total / maxVal * 100).toFixed(0);
      const row = document.createElement('div');
      row.style.cssText = 'margin-bottom:var(--space-3);';
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);font-size:13px;">
          <span><span style="color:var(--color-text-dim);margin-right:var(--space-2);">#${i + 1}</span>${name}</span>
          <span style="font-family:var(--font-mono);color:var(--color-text-muted);">${formatCurrency(total)}</span>
        </div>
        <div class="progress">
          <div class="progress-bar" style="width:${pct}%;background:var(--color-accent);opacity:${1 - i * 0.15};"></div>
        </div>
      `;
      card.appendChild(row);
    });

    container.appendChild(card);
  }

  function renderSavingsRate(totalIncome, totalExpense) {
    const rate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;
    const saved = totalIncome - totalExpense;

    const card = document.createElement('div');
    card.className = 'card mb-6';
    card.style.textAlign = 'center';

    card.innerHTML = `
      <h3 class="section-title mb-4">Tasa de ahorro</h3>
      <div style="font-family:var(--font-display);font-weight:700;font-size:48px;color:${rate >= 0 ? 'var(--color-accent)' : 'var(--color-danger)'};">
        ${rate.toFixed(0)}%
      </div>
      <p style="color:var(--color-text-muted);font-size:14px;margin-top:var(--space-2);">
        ${rate >= 0 ? 'Ahorraste' : 'Gastaste de más'} ${formatCurrency(Math.abs(saved))} este periodo
      </p>
    `;

    container.appendChild(card);
  }

  function renderInsightCard() {
    const insights = [
      'Gastaste 34% más en restaurantes esta semana vs. tu promedio. ¿Quieres ver opciones para reducir este gasto?',
      'Tu gasto en transporte bajó un 12% este mes. ¡Sigue así!',
      'Llevas 3 meses consecutivos ahorrando más del 20% de tus ingresos. ¡Excelente hábito!',
      'Los servicios representan el 25% de tus gastos fijos. Revisa si puedes optimizar alguno.',
    ];

    const card = document.createElement('div');
    card.className = 'insight-card mb-6 animate-fade-in';
    card.innerHTML = `
      <div class="insight-card__icon">💡</div>
      <div class="insight-card__text">${insights[Math.floor(Math.random() * insights.length)]}</div>
    `;
    container.appendChild(card);
  }

  render();
}

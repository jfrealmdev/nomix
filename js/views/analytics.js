import store from '../store.js';
import i18n from '../i18n.js';
import { formatCurrency, getMonthName } from '../utils.js';
import { createBarChart, createLineChart, destroyAllCharts } from '../../components/chart-widget.js';

export default function renderAnalytics(container) {
  const topBar = document.getElementById('top-bar');
  const settings = store.getSettings();
  topBar.innerHTML = `
    <div class="top-bar__brand">
      <div class="top-bar__logo">N</div>
      <span class="top-bar__name">Nomix</span>
    </div>
    <div class="top-bar__actions">
      <button class="btn-icon" aria-label="Notifications"><i data-lucide="bell"></i></button>
      <div class="top-bar__avatar">${settings.name.charAt(0)}</div>
    </div>
  `;

  function render() {
    container.innerHTML = '';
    destroyAllCharts();

    const txs = store.getTransactions();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const monthTxs = txs.filter(t => new Date(t.date) >= monthStart);
    const prevMonthTxs = txs.filter(t => { const d = new Date(t.date); return d >= prevMonthStart && d < monthStart; });

    const monthIncome = monthTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const monthExpense = monthTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const monthlySavings = monthIncome - monthExpense;

    const prevIncome = prevMonthTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevMonthTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const prevSavings = prevIncome - prevExpense;

    const savingsChange = prevSavings > 0 ? ((monthlySavings - prevSavings) / prevSavings * 100) : 0;

    // 1. Monthly Savings Card
    renderMonthlySavings(monthlySavings, savingsChange, prevSavings);

    // 2. Annual Savings Goal
    renderAnnualGoal(monthlySavings);

    // 3. Cash Flow Chart (6 months)
    renderCashFlowChart(txs, now);

    // 4. Category Breakdown
    renderCategoryBreakdown(monthTxs);

    // 5. AI Insight
    renderAIInsight();

    // 6. Create Report
    renderCreateReport();

    if (window.lucide) window.lucide.createIcons({ nodes: [container, topBar] });
  }

  function renderMonthlySavings(savings, changePercent, prevAmount) {
    const card = document.createElement('div');
    card.className = 'card savings-card mb-4';

    const isPositive = changePercent >= 0;
    card.innerHTML = `
      <div class="savings-card__label">${i18n.t('analytics.monthlySavings')}</div>
      <div class="savings-card__amount">${formatCurrency(savings)}</div>
      <div class="savings-card__change ${isPositive ? 'positive' : 'negative'}">
        <i data-lucide="${isPositive ? 'trending-up' : 'trending-down'}" style="width:16px;height:16px"></i>
        ${Math.abs(changePercent).toFixed(1)}%
        <span class="savings-card__vs">${i18n.t('analytics.vsPrevMonth', { amount: formatCurrency(prevAmount) })}</span>
      </div>
    `;
    container.appendChild(card);
  }

  function renderAnnualGoal(monthlySavings) {
    const annualGoal = 500000; // DOP goal
    const monthsElapsed = new Date().getMonth() + 1;
    const projected = monthlySavings * 12;
    const currentSaved = monthlySavings * monthsElapsed;
    const pct = Math.min(100, (currentSaved / annualGoal * 100));

    const card = document.createElement('div');
    card.className = 'card mb-4';
    card.innerHTML = `
      <div class="goal-card__label">${i18n.t('analytics.annualGoal')}</div>
      <div class="goal-card__row">
        <span class="goal-card__pct">${pct.toFixed(0)}%</span>
        <span class="goal-card__amounts">${formatCurrency(currentSaved)} / ${formatCurrency(annualGoal)}</span>
      </div>
      <div class="progress mb-3">
        <div class="progress-bar" style="width:${pct}%;"></div>
      </div>
      <p class="goal-card__motivation">${i18n.t('analytics.goalMotivation', { months: '2' })}</p>
    `;
    container.appendChild(card);
  }

  function renderCashFlowChart(txs, now) {
    const card = document.createElement('div');
    card.className = 'card mb-4';
    card.innerHTML = `
      <h3 class="section-title">${i18n.t('analytics.cashFlow')}</h3>
      <p style="font-size:12px;color:var(--color-text-muted);margin-bottom:var(--space-4);">${i18n.t('analytics.cashFlowSubtitle')}</p>
      <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);">
        <span class="chart-legend-item"><span class="chart-legend-dot" style="background:var(--color-accent);"></span> ${i18n.t('analytics.incomeLabel')}</span>
        <span class="chart-legend-item"><span class="chart-legend-dot" style="background:var(--color-expense);"></span> ${i18n.t('analytics.expensesLabel')}</span>
      </div>
    `;

    const chartWrap = document.createElement('div');
    chartWrap.style.height = '240px';
    const canvas = document.createElement('canvas');
    canvas.id = 'analytics-bar';
    chartWrap.appendChild(canvas);
    card.appendChild(chartWrap);
    container.appendChild(card);

    // 6 months of data
    const labels = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthLabel = i18n.t(`months.upper.${m.getMonth()}`);
      labels.push(monthLabel);

      const mTxs = txs.filter(t => { const d = new Date(t.date); return d >= m && d <= mEnd; });
      incomeData.push(mTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0));
      expenseData.push(mTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0));
    }

    requestAnimationFrame(() => {
      createBarChart(canvas, {
        labels,
        income: incomeData,
        expenses: expenseData,
      });
    });
  }

  function renderCategoryBreakdown(monthTxs) {
    const expenses = monthTxs.filter(t => t.amount < 0);
    const categories = store.getCategories().filter(c => c.id !== 'income');
    const catSpending = {};
    expenses.forEach(tx => { catSpending[tx.categoryId] = (catSpending[tx.categoryId] || 0) + Math.abs(tx.amount); });
    const totalExpense = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);

    const sorted = categories.map(c => ({ ...c, total: catSpending[c.id] || 0 }))
      .filter(c => c.total > 0).sort((a, b) => b.total - a.total).slice(0, 4);

    if (sorted.length === 0) return;

    const section = document.createElement('div');
    section.className = 'mb-4';
    section.innerHTML = `
      <div class="section-header mb-3">
        <h2 class="section-title">${i18n.t('analytics.categoryBreakdown')}</h2>
        <a class="section-link" href="#">${i18n.t('common.viewAll')}</a>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'category-breakdown-grid';

    const catIcons = { food: 'shopping-cart', transport: 'car', health: 'heart', entertain: 'gamepad-2', restaurant: 'utensils', services: 'zap', shopping: 'shopping-bag' };

    sorted.forEach(cat => {
      const pct = totalExpense > 0 ? ((cat.total / totalExpense) * 100).toFixed(0) : 0;
      const catName = i18n.t(`category.${cat.id}`) !== `category.${cat.id}` ? i18n.t(`category.${cat.id}`) : cat.name;
      const iconName = catIcons[cat.id] || 'circle';
      const cardEl = document.createElement('div');
      cardEl.className = 'category-breakdown-card';
      cardEl.innerHTML = `
        <div class="category-breakdown-card__icon"><i data-lucide="${iconName}"></i></div>
        <div class="category-breakdown-card__name">${catName}</div>
        <div class="category-breakdown-card__pct">${pct}%</div>
        <div class="category-breakdown-card__amount">${formatCurrency(cat.total)}</div>
      `;
      grid.appendChild(cardEl);
    });

    section.appendChild(grid);
    container.appendChild(section);
  }

  function renderAIInsight() {
    const insights = [
      { key: 'ai.insight1', params: { category: i18n.t('category.food'), percent: '15', amount: formatCurrency(27450) } },
      { key: 'ai.insight2', params: {} },
      { key: 'ai.insight3', params: {} },
      { key: 'ai.insight4', params: {} },
    ];
    const insight = insights[Math.floor(Math.random() * insights.length)];

    const card = document.createElement('div');
    card.className = 'ai-insight-card mb-4';
    card.innerHTML = `
      <div class="ai-insight-card__header">
        <span class="ai-insight-card__icon">✨</span>
        <span class="ai-insight-card__title">${i18n.t('analytics.aiAnalysis')}</span>
      </div>
      <p class="ai-insight-card__text">${i18n.t(insight.key, insight.params)}</p>
      <button class="btn btn-accent btn-lg btn-block ai-insight-card__cta">${i18n.t('analytics.viewSavingsPlan')}</button>
    `;
    container.appendChild(card);
  }

  function renderCreateReport() {
    const card = document.createElement('div');
    card.className = 'card create-report-card mb-6';
    card.innerHTML = `
      <div class="create-report-card__icon"><i data-lucide="plus" style="width:32px;height:32px;color:var(--color-text-dim);"></i></div>
      <div class="create-report-card__title">${i18n.t('analytics.createReport')}</div>
      <p class="create-report-card__subtitle">${i18n.t('analytics.customizeReports')}</p>
    `;
    container.appendChild(card);
  }

  render();
}

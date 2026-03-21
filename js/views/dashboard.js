import store from '../store.js';
import i18n from '../i18n.js';
import { formatCurrency, formatCurrencyParts, getGreeting } from '../utils.js';
import { createAccountCard, createTransactionRow } from '../../components/card.js';
import { createDonutChart } from '../../components/chart-widget.js';

function animateCountUp(el, target, duration = 800) {
  const start = performance.now();
  const parts = formatCurrencyParts(target);

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = formatCurrencyParts(target * eased);
    el.innerHTML = `${current.symbol}<span class="balance-integer">${current.integer}</span>.<span class="balance-decimal">${current.decimal}</span>`;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function renderDashboard(container) {
  const settings = store.getSettings();
  const summary = store.getSummary();
  const accounts = store.getAccounts();
  const spending = store.getCategorySpending();
  const recentTxs = store.getTransactions().slice(0, 5);

  // Top bar with logo, bell, avatar
  const topBar = document.getElementById('top-bar');
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

  // Greeting + Balance
  const greetingSection = document.createElement('div');
  greetingSection.className = 'mb-6';

  const greeting = document.createElement('div');
  greeting.className = 'dashboard-greeting';
  greeting.textContent = i18n.t('greeting.hello', { name: settings.name });

  const balanceLabel = document.createElement('div');
  balanceLabel.className = 'dashboard-balance-label';
  balanceLabel.textContent = i18n.t('dashboard.balanceTotal');

  const balanceParts = formatCurrencyParts(summary.totalBalance);
  const balanceNum = document.createElement('div');
  balanceNum.className = 'dashboard-balance';
  balanceNum.innerHTML = `${balanceParts.symbol}<span class="balance-integer">${balanceParts.integer}</span>.<span class="balance-decimal">${balanceParts.decimal}</span>`;

  greetingSection.appendChild(greeting);
  greetingSection.appendChild(balanceLabel);
  greetingSection.appendChild(balanceNum);
  container.appendChild(greetingSection);

  // Animate balance
  setTimeout(() => animateCountUp(balanceNum, summary.totalBalance), 100);

  // Account Cards Carousel
  const accSection = document.createElement('div');
  accSection.className = 'mb-6';

  const carousel = document.createElement('div');
  carousel.className = 'scroll-x';
  accounts.forEach(acc => carousel.appendChild(createAccountCard(acc)));
  accSection.appendChild(carousel);
  container.appendChild(accSection);

  // Monthly Expenses Donut
  if (spending.length > 0) {
    const donutSection = document.createElement('div');
    donutSection.className = 'card mb-6';

    const donutHeader = document.createElement('div');
    donutHeader.className = 'section-header';
    donutHeader.innerHTML = `<h2 class="section-title">${i18n.t('dashboard.monthExpenses')}</h2>`;
    donutSection.appendChild(donutHeader);

    const chartRow = document.createElement('div');
    chartRow.className = 'donut-row';

    const chartWrap = document.createElement('div');
    chartWrap.className = 'chart-container donut-chart-wrap';
    chartWrap.style.position = 'relative';

    const canvas = document.createElement('canvas');
    canvas.id = 'dashboard-donut';
    chartWrap.appendChild(canvas);

    // Center label
    const centerLabel = document.createElement('div');
    centerLabel.className = 'chart-center-label';
    centerLabel.innerHTML = `
      <div class="chart-center-label__text">${i18n.t('dashboard.total')}</div>
      <div class="chart-center-label__amount">${formatCurrency(summary.monthExpense)}</div>
    `;
    chartWrap.appendChild(centerLabel);
    chartRow.appendChild(chartWrap);

    // Legend (right side)
    const legend = document.createElement('div');
    legend.className = 'chart-legend chart-legend--side';
    const totalSpending = spending.reduce((s, c) => s + c.total, 0);
    spending.slice(0, 4).forEach(cat => {
      const pct = totalSpending > 0 ? ((cat.total / totalSpending) * 100).toFixed(0) : 0;
      const catName = i18n.t(`category.${cat.id}`) !== `category.${cat.id}` ? i18n.t(`category.${cat.id}`) : cat.name;
      legend.innerHTML += `
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background:${cat.color}"></span>
          <span class="chart-legend-label">${catName}</span>
          <span class="chart-legend-pct">${pct}%</span>
        </div>
      `;
    });
    chartRow.appendChild(legend);
    donutSection.appendChild(chartRow);
    container.appendChild(donutSection);

    requestAnimationFrame(() => {
      createDonutChart(canvas, {
        labels: spending.map(c => i18n.t(`category.${c.id}`) !== `category.${c.id}` ? i18n.t(`category.${c.id}`) : c.name),
        values: spending.map(c => c.total),
        colors: spending.map(c => c.color),
      });
    });
  }

  // Recent Transactions
  const txSection = document.createElement('div');
  txSection.className = 'mb-6';
  txSection.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${i18n.t('dashboard.recentTx')}</h2>
      <a class="section-link" href="#/transactions">${i18n.t('dashboard.viewAll')}</a>
    </div>
  `;

  const txList = document.createElement('div');
  recentTxs.forEach(tx => txList.appendChild(createTransactionRow(tx)));
  txSection.appendChild(txList);
  container.appendChild(txSection);

  if (window.lucide) window.lucide.createIcons({ nodes: [container, topBar] });
}

import store from '../store.js';
import { formatCurrency, getGreeting } from '../utils.js';
import { createAccountCard, createAddAccountCard, createTransactionRow } from '../../components/card.js';
import { createDonutChart } from '../../components/chart-widget.js';
import router from '../router.js';

function animateCountUp(el, target, duration = 800) {
  const start = performance.now();
  const format = (v) => formatCurrency(v);

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = format(target * eased);
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

  // Top bar
  const topBar = document.getElementById('top-bar');
  topBar.innerHTML = `
    <div class="top-bar__greeting">${getGreeting()}, ${settings.name} 👋</div>
    <div class="top-bar__avatar">${settings.name.charAt(0)}</div>
  `;

  // Balance Hero Card
  const hero = document.createElement('div');
  hero.className = 'hero-card mb-6';

  const balanceLabel = document.createElement('div');
  balanceLabel.style.cssText = 'font-size:13px;color:var(--color-text-muted);margin-bottom:var(--space-2);';
  balanceLabel.textContent = 'Balance Total';

  const balanceNum = document.createElement('div');
  balanceNum.style.cssText = 'font-family:var(--font-display);font-weight:700;font-size:clamp(36px,8vw,52px);margin-bottom:var(--space-2);';
  balanceNum.textContent = formatCurrency(0);

  const changePercent = summary.changePercent;
  const changeEl = document.createElement('div');
  changeEl.className = changePercent <= 0 ? 'pill pill-income' : 'pill pill-expense';
  changeEl.style.marginBottom = 'var(--space-4)';
  changeEl.textContent = `${changePercent <= 0 ? '↓' : '↑'} ${Math.abs(changePercent).toFixed(1)}% este mes`;

  const pills = document.createElement('div');
  pills.style.cssText = 'display:flex;gap:var(--space-3);';
  pills.innerHTML = `
    <span class="pill pill-income">💰 Ingresos ${formatCurrency(summary.monthIncome)}</span>
    <span class="pill pill-expense">💸 Gastos ${formatCurrency(summary.monthExpense)}</span>
  `;

  hero.appendChild(balanceLabel);
  hero.appendChild(balanceNum);
  hero.appendChild(changeEl);
  hero.appendChild(pills);
  container.appendChild(hero);

  // Animate balance
  setTimeout(() => animateCountUp(balanceNum, summary.totalBalance), 100);

  // Accounts Carousel
  const accSection = document.createElement('div');
  accSection.className = 'mb-6';
  accSection.innerHTML = `<div class="section-header"><h2 class="section-title">Cuentas</h2></div>`;

  const carousel = document.createElement('div');
  carousel.className = 'scroll-x';
  accounts.forEach(acc => carousel.appendChild(createAccountCard(acc)));
  carousel.appendChild(createAddAccountCard());
  accSection.appendChild(carousel);
  container.appendChild(accSection);

  // Spending Donut
  if (spending.length > 0) {
    const donutSection = document.createElement('div');
    donutSection.className = 'card mb-6';

    const donutHeader = document.createElement('div');
    donutHeader.className = 'section-header';
    donutHeader.innerHTML = '<h2 class="section-title">Gastos del mes</h2>';
    donutSection.appendChild(donutHeader);

    const chartWrap = document.createElement('div');
    chartWrap.className = 'chart-container';
    chartWrap.style.height = '220px';
    chartWrap.style.position = 'relative';

    const canvas = document.createElement('canvas');
    canvas.id = 'dashboard-donut';
    chartWrap.appendChild(canvas);

    // Center label
    const centerLabel = document.createElement('div');
    centerLabel.className = 'chart-center-label';
    centerLabel.innerHTML = `
      <div class="chart-center-label__amount">${formatCurrency(summary.monthExpense)}</div>
      <div class="chart-center-label__text">Total</div>
    `;
    chartWrap.appendChild(centerLabel);

    donutSection.appendChild(chartWrap);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    const totalSpending = spending.reduce((s, c) => s + c.total, 0);
    spending.forEach(cat => {
      const pct = totalSpending > 0 ? ((cat.total / totalSpending) * 100).toFixed(0) : 0;
      legend.innerHTML += `
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background:${cat.color}"></span>
          <span>${cat.icon} ${cat.name}</span>
          <span style="color:var(--color-text-muted);font-family:var(--font-mono);font-size:12px">${formatCurrency(cat.total)} (${pct}%)</span>
        </div>
      `;
    });
    donutSection.appendChild(legend);
    container.appendChild(donutSection);

    // Render chart after DOM
    requestAnimationFrame(() => {
      createDonutChart(canvas, {
        labels: spending.map(c => c.name),
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
      <h2 class="section-title">Movimientos recientes</h2>
      <a class="section-link" href="#/transactions">Ver todas →</a>
    </div>
  `;

  const txList = document.createElement('div');
  recentTxs.forEach(tx => txList.appendChild(createTransactionRow(tx)));
  txSection.appendChild(txList);
  container.appendChild(txSection);

  // Lucide icons
  if (window.lucide) window.lucide.createIcons({ nodes: [container] });
}

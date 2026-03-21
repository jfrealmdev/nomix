import { formatCurrency, formatDate, getCategoryById, getAccountById } from '../js/utils.js';

export function createAccountCard(account) {
  const card = document.createElement('div');
  card.className = 'account-card';
  card.style.background = `linear-gradient(135deg, ${account.color}, ${account.color}88)`;

  const typeLabels = { checking: 'Cuenta Corriente', credit: 'Tarjeta de Crédito', savings: 'Cuenta de Ahorro' };

  card.innerHTML = `
    <div>
      <div class="account-card__bank">${account.name}</div>
      <div class="account-card__type">${typeLabels[account.type] || account.type}</div>
    </div>
    <div>
      <div class="account-card__number">${account.number}</div>
      <div class="account-card__balance">${formatCurrency(account.balance)}</div>
    </div>
  `;

  return card;
}

export function createAddAccountCard() {
  const card = document.createElement('button');
  card.className = 'account-card-add';
  card.innerHTML = `<i data-lucide="plus"></i> <span>Agregar cuenta</span>`;
  return card;
}

export function createTransactionRow(tx, showAccount = false) {
  const category = getCategoryById(tx.categoryId);
  const isIncome = tx.amount > 0;

  const row = document.createElement('div');
  row.className = 'tx-row';

  const icon = document.createElement('div');
  icon.className = 'tx-icon';
  icon.style.background = category.color + '22';
  icon.textContent = category.icon;

  const info = document.createElement('div');
  info.className = 'tx-info';

  const merchant = document.createElement('div');
  merchant.className = 'tx-merchant';
  merchant.textContent = tx.merchant;

  const meta = document.createElement('div');
  meta.className = 'tx-category';
  let metaText = category.name + ' · ' + formatDate(tx.date);
  if (showAccount) {
    const acc = getAccountById(tx.accountId);
    metaText += ' · ' + acc.name;
  }
  meta.textContent = metaText;

  info.appendChild(merchant);
  info.appendChild(meta);

  const amount = document.createElement('div');
  amount.className = `tx-amount ${isIncome ? 'income' : 'expense'}`;
  amount.textContent = (isIncome ? '+' : '-') + formatCurrency(tx.amount);

  row.appendChild(icon);
  row.appendChild(info);
  row.appendChild(amount);

  return row;
}

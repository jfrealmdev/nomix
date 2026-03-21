import { MOCK_ACCOUNTS, MOCK_CATEGORIES, MOCK_TRANSACTIONS, MOCK_BUDGETS } from './mock-data.js';

const PREFIX = 'nomix:';

function getKey(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setKey(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('store:changed', { detail: { key } }));
}

function seed() {
  if (getKey('seeded')) return;
  setKey('accounts', MOCK_ACCOUNTS);
  setKey('categories', MOCK_CATEGORIES);
  setKey('transactions', MOCK_TRANSACTIONS);
  setKey('budgets', MOCK_BUDGETS);
  setKey('settings', {
    currency: 'GTQ',
    name: 'Ana',
    theme: 'dark',
    notifications: true,
  });
  setKey('seeded', true);
}

const store = {
  get(key) {
    return getKey(key);
  },

  set(key, value) {
    setKey(key, value);
  },

  seed,

  getTransactions() {
    const txs = getKey('transactions') || [];
    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addTransaction(tx) {
    const txs = getKey('transactions') || [];
    txs.push(tx);
    setKey('transactions', txs);
  },

  addTransactions(newTxs) {
    const txs = getKey('transactions') || [];
    txs.push(...newTxs);
    setKey('transactions', txs);
  },

  getAccounts() {
    return getKey('accounts') || [];
  },

  getCategories() {
    return getKey('categories') || [];
  },

  getBudgets() {
    return getKey('budgets') || [];
  },

  getSettings() {
    return getKey('settings') || { currency: 'GTQ', name: 'Ana', theme: 'dark', notifications: true };
  },

  updateSettings(partial) {
    const current = this.getSettings();
    setKey('settings', { ...current, ...partial });
  },

  getSummary() {
    const accounts = this.getAccounts();
    const txs = this.getTransactions();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthTxs = txs.filter(t => new Date(t.date) >= monthStart);
    const monthIncome = monthTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const monthExpense = monthTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

    // Previous month for comparison
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = monthStart;
    const prevMonthTxs = txs.filter(t => {
      const d = new Date(t.date);
      return d >= prevMonthStart && d < prevMonthEnd;
    });
    const prevExpense = prevMonthTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const changePercent = prevExpense > 0 ? ((monthExpense - prevExpense) / prevExpense * 100) : 0;

    const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome * 100) : 0;

    return { totalBalance, monthIncome, monthExpense, savingsRate, changePercent };
  },

  getCategorySpending() {
    const txs = this.getTransactions();
    const categories = this.getCategories();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTxs = txs.filter(t => new Date(t.date) >= monthStart && t.amount < 0);

    return categories
      .filter(c => c.id !== 'income')
      .map(cat => {
        const total = monthTxs
          .filter(t => t.categoryId === cat.id)
          .reduce((s, t) => s + Math.abs(t.amount), 0);
        return { ...cat, total };
      })
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total);
  },

  clearAll() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent('store:changed', { detail: { key: 'all' } }));
  }
};

export default store;

import store from './store.js';
import i18n from './i18n.js';

export function formatCurrency(amount, currency = null) {
  const cur = currency || store.getSettings().currency || 'DOP';
  const abs = Math.abs(amount);
  const locale = i18n.getLocale();

  const formatted = abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (cur === 'DOP') return `RD$ ${formatted}`;
  if (cur === 'USD') return `US$ ${formatted}`;
  return `${cur} ${formatted}`;
}

export function convertCurrency(amount, from, to) {
  const settings = store.getSettings();
  const rate = settings.exchangeRate || 61;
  if (from === to) return amount;
  if (from === 'DOP' && to === 'USD') return amount / rate;
  if (from === 'USD' && to === 'DOP') return amount * rate;
  return amount;
}

export function formatCurrencyParts(amount, currency = null) {
  const cur = currency || store.getSettings().currency || 'DOP';
  const abs = Math.abs(amount);
  const locale = i18n.getLocale();

  const formatted = abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts = formatted.split(locale === 'es-DO' ? '.' : '.');
  const symbol = cur === 'DOP' ? 'RD$' : cur === 'USD' ? 'US$' : cur;

  return { symbol, integer: parts[0] || '0', decimal: parts[1] || '00' };
}

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today - target) / 86400000);

  if (diff === 0) return i18n.t('common.today');
  if (diff === 1) return i18n.t('common.yesterday');

  const month = i18n.t(`months.short.${date.getMonth()}`);
  return `${date.getDate()} ${month}. ${date.getFullYear()}`;
}

export function formatDateShort(isoDate) {
  const date = new Date(isoDate);
  const month = i18n.t(`months.short.${date.getMonth()}`);
  return `${date.getDate()} ${month}`;
}

export function formatTime(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleTimeString(i18n.getLocale(), { hour: '2-digit', minute: '2-digit' });
}

export function getDateGroupLabel(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today - target) / 86400000);

  if (diff === 0) return i18n.t('common.today');
  if (diff === 1) return i18n.t('common.yesterday');

  const month = i18n.t(`months.long.${date.getMonth()}`);
  return `${date.getDate()} de ${month}`;
}

export function getDateGroupDateLabel(isoDate) {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = i18n.t(`months.upper.${date.getMonth()}`);
  return `${day} ${month}`;
}

export function groupTransactionsByDate(txs) {
  const groups = {};
  txs.forEach(tx => {
    const label = getDateGroupLabel(tx.date);
    if (!groups[label]) groups[label] = { label, date: tx.date, txs: [] };
    groups[label].txs.push(tx);
  });
  return Object.values(groups);
}

export function getCategoryById(id) {
  const categories = store.getCategories();
  return categories.find(c => c.id === id) || { id: 'unknown', name: i18n.t('category.other'), icon: '❓', color: '#666' };
}

export function getAccountById(id) {
  const accounts = store.getAccounts();
  return accounts.find(a => a.id === id) || { id: 'unknown', name: i18n.t('category.unknown'), number: '••0000' };
}

export function generateId() {
  return 'tx' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getMonthName(monthIndex) {
  return i18n.t(`months.long.${monthIndex}`);
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return i18n.t('greeting.morning');
  if (hour < 18) return i18n.t('greeting.afternoon');
  return i18n.t('greeting.evening');
}

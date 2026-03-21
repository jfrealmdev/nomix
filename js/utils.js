import store from './store.js';

export function formatCurrency(amount, currency = null) {
  const cur = currency || store.getSettings().currency || 'GTQ';
  const abs = Math.abs(amount);

  if (cur === 'GTQ') {
    return `Q ${abs.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const symbols = { USD: '$', EUR: '€', MXN: '$' };
  const symbol = symbols[cur] || cur + ' ';
  return `${symbol}${abs.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today - target) / 86400000);

  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';

  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${date.getDate()} ${months[date.getMonth()]}. ${date.getFullYear()}`;
}

export function formatDateShort(isoDate) {
  const date = new Date(isoDate);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export function formatTime(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
}

export function getDateGroupLabel(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today - target) / 86400000);

  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${date.getDate()} de ${months[date.getMonth()]}`;
}

export function groupTransactionsByDate(txs) {
  const groups = {};
  txs.forEach(tx => {
    const label = getDateGroupLabel(tx.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });
  return groups;
}

export function getCategoryById(id) {
  const categories = store.getCategories();
  return categories.find(c => c.id === id) || { id: 'unknown', name: 'Otro', icon: '❓', color: '#666' };
}

export function getAccountById(id) {
  const accounts = store.getAccounts();
  return accounts.find(a => a.id === id) || { id: 'unknown', name: 'Desconocida', number: '••0000' };
}

export function generateId() {
  return 'tx' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getMonthName(monthIndex) {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return months[monthIndex];
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

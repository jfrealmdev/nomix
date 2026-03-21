import store from './store.js';

const STORAGE_KEY = 'nomix:exchangeRateData';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const DEFAULT_RATE = 61;

function getCachedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedData(rate) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    rate,
    fetchedAt: new Date().toISOString()
  }));
}

function isStale(cached) {
  if (!cached || !cached.fetchedAt) return true;
  return Date.now() - new Date(cached.fetchedAt).getTime() > TTL_MS;
}

async function fetchRate() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  const rate = data?.usd?.dop;
  if (!rate || typeof rate !== 'number') throw new Error('Invalid rate data');
  return rate;
}

export async function ensureFreshRate() {
  const cached = getCachedData();
  const currentRate = cached?.rate || store.getSettings().exchangeRate || DEFAULT_RATE;

  if (!isStale(cached)) {
    return { rate: cached.rate, stale: false };
  }

  try {
    const rate = await fetchRate();
    setCachedData(rate);
    store.updateSettings({ exchangeRate: rate });
    return { rate, stale: false };
  } catch {
    return { rate: currentRate, stale: true };
  }
}

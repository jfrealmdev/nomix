import store from '../js/store.js';
import router from '../js/router.js';
import i18n from '../js/i18n.js';
import toast from './toast.js';
import { ensureFreshRate } from '../js/exchange-rate.js';

const CURRENCIES = ['DOP', 'USD'];

function createToggle() {
  const current = store.getSettings().currency || 'DOP';

  const wrapper = document.createElement('div');
  wrapper.className = 'currency-toggle';
  wrapper.setAttribute('role', 'radiogroup');
  wrapper.setAttribute('aria-label', i18n.t('settings.currency'));

  CURRENCIES.forEach(cur => {
    const btn = document.createElement('button');
    btn.className = 'currency-toggle__btn' + (cur === current ? ' active' : '');
    btn.textContent = cur;
    btn.dataset.currency = cur;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', cur === current ? 'true' : 'false');

    btn.addEventListener('click', async () => {
      if (cur === store.getSettings().currency) return;

      const { rate, stale } = await ensureFreshRate();

      if (stale) {
        toast.show({
          message: i18n.t('currency.staleWarning'),
          type: 'info',
          duration: 4000
        });
      }

      store.updateSettings({ currency: cur, exchangeRate: rate });
      router.reload();
    });

    wrapper.appendChild(btn);
  });

  return wrapper;
}

export function injectCurrencyToggle() {
  const actions = document.querySelector('#top-bar .top-bar__actions');
  if (!actions) return;
  if (actions.querySelector('.currency-toggle')) return;

  actions.insertBefore(createToggle(), actions.firstChild);
}

const toastRoot = () => document.getElementById('toast-root');

const toast = {
  show({ message, type = 'success', duration = 3000, action = null }) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    const text = document.createElement('span');
    text.textContent = message;
    el.appendChild(text);

    if (action) {
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.gap = 'var(--space-3)';
      const btn = document.createElement('button');
      btn.textContent = action.label;
      btn.style.cssText = 'background:none;border:1px solid currentColor;color:inherit;padding:2px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:12px;font-weight:600;white-space:nowrap;';
      btn.addEventListener('click', () => {
        el.remove();
        action.handler();
      });
      el.appendChild(btn);
    }

    toastRoot().appendChild(el);

    const autoDismiss = duration === 0 ? 0 : (action ? Math.max(duration, 6000) : duration);
    if (autoDismiss > 0) {
      setTimeout(() => {
        el.classList.add('toast-exit');
        el.addEventListener('animationend', () => el.remove(), { once: true });
        setTimeout(() => el.remove(), 300);
      }, autoDismiss);
    }
  }
};

export default toast;

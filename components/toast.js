const toastRoot = () => document.getElementById('toast-root');

const toast = {
  show({ message, type = 'success', duration = 3000 }) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    toastRoot().appendChild(el);

    setTimeout(() => {
      el.classList.add('toast-exit');
      el.addEventListener('animationend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
};

export default toast;

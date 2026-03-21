const modalRoot = () => document.getElementById('modal-root');

let currentModal = null;

const modal = {
  open({ title, content, actions = [], isSheet = false }) {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'modal-content';

    if (isSheet) {
      const handle = document.createElement('div');
      handle.className = 'modal-handle';
      wrapper.appendChild(handle);
    }

    if (title) {
      const header = document.createElement('div');
      header.className = 'modal-header';

      const titleEl = document.createElement('h3');
      titleEl.className = 'modal-title';
      titleEl.textContent = title;
      header.appendChild(titleEl);

      const closeBtn = document.createElement('button');
      closeBtn.className = 'btn-icon';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = '<i data-lucide="x"></i>';
      closeBtn.addEventListener('click', () => this.close());
      header.appendChild(closeBtn);

      wrapper.appendChild(header);
    }

    const body = document.createElement('div');
    body.className = 'modal-body';
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
    wrapper.appendChild(body);

    if (actions.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      actions.forEach(({ label, handler, variant = 'ghost' }) => {
        const btn = document.createElement('button');
        btn.className = `btn btn-${variant}`;
        btn.textContent = label;
        btn.style.flex = '1';
        btn.addEventListener('click', () => {
          if (handler) handler();
          this.close();
        });
        footer.appendChild(btn);
      });
      wrapper.appendChild(footer);
    }

    backdrop.appendChild(wrapper);
    modalRoot().appendChild(backdrop);
    currentModal = backdrop;

    // Lucide icons
    if (window.lucide) window.lucide.createIcons({ nodes: [wrapper] });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // ESC to close
    const escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', escHandler);
    backdrop._escHandler = escHandler;
  },

  close() {
    if (!currentModal) return;

    if (currentModal._escHandler) {
      document.removeEventListener('keydown', currentModal._escHandler);
    }

    currentModal.remove();
    currentModal = null;
    document.body.style.overflow = '';
  },

  isOpen() {
    return !!currentModal;
  }
};

export default modal;

const routes = {};
let currentPath = null;

function getPath() {
  return window.location.hash.slice(1) || '/dashboard';
}

const router = {
  on(path, handler) {
    routes[path] = handler;
  },

  navigate(path) {
    window.location.hash = '#' + path;
  },

  getCurrentPath() {
    return currentPath;
  },

  init() {
    const handleRoute = () => {
      const path = getPath();
      if (path === currentPath) return;

      const container = document.getElementById('view-container');
      if (!container) return;

      // Exit animation
      container.classList.remove('view-enter');
      container.classList.add('view-exit');

      const render = () => {
        currentPath = path;
        container.innerHTML = '';
        container.classList.remove('view-exit');
        container.classList.add('view-enter');

        const handler = routes[path];
        if (handler) {
          handler(container);
        } else {
          // Fallback to dashboard
          const dashHandler = routes['/dashboard'];
          if (dashHandler) {
            currentPath = '/dashboard';
            dashHandler(container);
          }
        }

        // Update nav
        window.dispatchEvent(new CustomEvent('route:changed', { detail: { path: currentPath } }));
      };

      // Short delay for exit animation
      if (currentPath) {
        setTimeout(render, 150);
      } else {
        render();
      }
    };

    window.addEventListener('hashchange', handleRoute);

    // Initial route
    if (!window.location.hash) {
      window.location.hash = '#/dashboard';
    } else {
      handleRoute();
    }
  }
};

export default router;

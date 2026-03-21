# CLAUDE.md

## Project Overview

Nomix is a mobile-first Progressive Web App (PWA) for personal finance management. Built with vanilla JavaScript (ES6 modules), it runs entirely client-side with localStorage for persistence. The UI is in Spanish, localized for Guatemala (GTQ currency).

## Project Structure

```
nomix/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (network-first strategy)
├── version.json            # App version manifest (version, date, release notes)
├── css/
│   ├── tokens.css          # Design tokens (colors, spacing, typography)
│   ├── base.css            # Resets and base styles
│   ├── components.css      # Component styles
│   ├── layout.css          # Layout and grid
│   └── animations.css      # Transitions and animations
├── js/
│   ├── app.js              # App initialization
│   ├── router.js           # Hash-based client-side routing
│   ├── store.js            # localStorage state management
│   ├── utils.js            # Formatting and helper utilities
│   ├── pwa.js              # PWA install and SW management
│   ├── mock-data.js        # Demo data seeding
│   └── views/
│       ├── dashboard.js    # Home/overview
│       ├── transactions.js # Transaction list with filters
│       ├── scan.js         # Receipt/statement scanning (mock)
│       ├── analytics.js    # Charts and spending analysis
│       └── settings.js     # User preferences
├── components/
│   ├── nav.js              # Bottom navigation and FAB
│   ├── card.js             # Account/transaction cards
│   ├── chart-widget.js     # Chart.js wrapper
│   ├── modal.js            # Modal/sheet dialogs
│   └── toast.js            # Toast notifications
└── assets/icons/           # PWA icons
```

## Tech Stack

- **Vanilla JavaScript** (ES6 modules) — no framework
- **Chart.js 4.4.7** — data visualization (CDN)
- **Lucide Icons** — icon system (CDN)
- **CSS3** — custom properties, flexbox, grid
- **localStorage** — client-side persistence
- **Service Worker** — offline support

## Running the App

No build step required. Serve static files with any HTTP server:

```bash
python -m http.server 8000
# or
npx http-server
```

## No Build/Test Infrastructure

- No `package.json`, no bundler, no test framework
- No linting or formatting config files

## Code Conventions

- **ES6 modules** with explicit imports/exports
- **camelCase** for JS functions and variables
- **kebab-case** for CSS classes (BEM-like: `.component__element--modifier`)
- **Arrow functions** preferred
- **Template literals** for HTML generation
- Function naming: `render*` for views, `create*` for component factories, `get*` for data accessors
- All UI text is in Spanish

## Design System

- Dark theme: background `#080D1A`, accent `#00E5C4`
- Spacing scale: 4px base unit (`--space-1` through `--space-12`)
- Fonts: DM Sans (headlines), Inter (body), JetBrains Mono (monospace)
- Mobile-first responsive design with `clamp()` for fluid typography

## Key Patterns

- **State**: singleton `store` wrapping localStorage with custom events (`store:changed`, `route:changed`)
- **Routing**: hash-based (`#/dashboard`, `#/transactions`, etc.)
- **Components**: pure DOM creation, no virtual DOM
- **PWA**: installable, offline-capable, caches all static assets

## Deployment / Cache Versioning

When making any code change, you MUST update **both** of the following:

1. **`CACHE_NAME` in `sw.js`**: Increment the version (e.g., `'nomix-v8'` → `'nomix-v9'`). This triggers the browser to install a new service worker and refresh the precache.

2. **`version.json`**: Update the `version`, `date`, and `notes` fields. This is what the user sees in the update banner. Example:
   ```json
   {
     "version": "1.2.0",
     "date": "2026-03-22",
     "notes": [
       "Descripción breve del cambio 1",
       "Descripción breve del cambio 2"
     ]
   }
   ```

### How Updates Work

- The app polls `version.json` every 30 seconds (cache-busted) and also checks on tab focus
- The SW uses a BroadcastChannel (`nomix-updates`) to notify clients instantly when activated
- When a new version is detected, a **persistent banner** appears at the top of the app showing the version and release notes
- The user must click "Actualizar ahora" to apply — updates are never forced silently
- If the user dismisses the banner, it reappears on the next in-app navigation
- `version.json` is always fetched from the network (never served from SW cache) to ensure freshness

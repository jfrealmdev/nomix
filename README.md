# Nomix - Gestor de Finanzas Personales

Nomix es una aplicación web progresiva (PWA) para la gestión de finanzas personales. Diseñada con un enfoque mobile-first, permite administrar cuentas, transacciones, presupuestos y analíticas de gastos desde cualquier dispositivo.

## Capturas de Pantalla

La aplicación cuenta con un diseño oscuro moderno con acentos en teal (`#00E5C4`).

## Funcionalidades

- **Dashboard** — Vista general de saldos, carrusel de cuentas, desglose de gastos y transacciones recientes
- **Transacciones** — Listado filtrable con búsqueda, vista mensual y creación/edición de movimientos
- **Escaneo** — Simulación de OCR de recibos y carga de estados de cuenta bancarios
- **Analíticas** — Tendencias de gasto por período con gráficos de barras y líneas
- **Configuración** — Preferencias de usuario (nombre, moneda, tema, notificaciones)
- **PWA** — Instalable en dispositivos móviles, funciona sin conexión

## Tecnologías

| Tecnología | Uso |
|---|---|
| JavaScript (ES6 modules) | Lógica de la aplicación |
| CSS3 (Custom Properties) | Estilos y diseño responsivo |
| Chart.js 4.4.7 | Visualización de datos |
| Lucide Icons | Sistema de iconos |
| Service Worker | Soporte offline y caché |
| localStorage | Persistencia de datos |

## Inicio Rápido

No se requiere proceso de build. Sirve los archivos estáticos con cualquier servidor HTTP:

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server
```

Luego abre `http://localhost:8000` en tu navegador.

## Estructura del Proyecto

```
nomix/
├── index.html          # Punto de entrada
├── manifest.json       # Configuración PWA
├── sw.js               # Service Worker
├── css/                # Estilos (tokens, base, componentes, layout, animaciones)
├── js/                 # Lógica de la app (router, store, utils, vistas)
├── components/         # Componentes reutilizables (nav, cards, charts, modals, toasts)
└── assets/icons/       # Iconos de la PWA
```

## Arquitectura

- **Estado**: Objeto singleton `store` sobre localStorage con eventos personalizados
- **Ruteo**: Basado en hash (`#/dashboard`, `#/transactions`, etc.)
- **Componentes**: Módulos ES6 que crean y manipulan el DOM directamente
- **PWA**: Estrategia cache-first para assets estáticos

## Convenciones de Código

- `camelCase` para funciones y variables en JavaScript
- `kebab-case` para clases CSS (estilo BEM)
- Prefijos de funciones: `render*` (vistas), `create*` (componentes), `get*` (accesores)
- Interfaz en español, localizada para Guatemala (moneda GTQ)

## Licencia

Este proyecto es privado y de uso personal.

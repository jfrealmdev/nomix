const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.transactions': 'Movimientos',
    'nav.add': 'Añadir',
    'nav.analytics': 'Análisis',
    'nav.settings': 'Ajustes',
    'nav.aria': 'Navegación principal',

    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.delete': 'Borrar',
    'common.today': 'Hoy',
    'common.yesterday': 'Ayer',
    'common.viewAll': 'Ver todas',
    'common.loading': 'Cargando...',
    'common.noResults': '0 resultados',
    'common.retry': 'Reintentar',
    'common.confirm': 'Confirmar',

    // Months
    'months.short.0': 'ene', 'months.short.1': 'feb', 'months.short.2': 'mar',
    'months.short.3': 'abr', 'months.short.4': 'may', 'months.short.5': 'jun',
    'months.short.6': 'jul', 'months.short.7': 'ago', 'months.short.8': 'sep',
    'months.short.9': 'oct', 'months.short.10': 'nov', 'months.short.11': 'dic',
    'months.long.0': 'Enero', 'months.long.1': 'Febrero', 'months.long.2': 'Marzo',
    'months.long.3': 'Abril', 'months.long.4': 'Mayo', 'months.long.5': 'Junio',
    'months.long.6': 'Julio', 'months.long.7': 'Agosto', 'months.long.8': 'Septiembre',
    'months.long.9': 'Octubre', 'months.long.10': 'Noviembre', 'months.long.11': 'Diciembre',
    'months.upper.0': 'ENE', 'months.upper.1': 'FEB', 'months.upper.2': 'MAR',
    'months.upper.3': 'ABR', 'months.upper.4': 'MAY', 'months.upper.5': 'JUN',
    'months.upper.6': 'JUL', 'months.upper.7': 'AGO', 'months.upper.8': 'SEP',
    'months.upper.9': 'OCT', 'months.upper.10': 'NOV', 'months.upper.11': 'DIC',

    // Days
    'days.short.0': 'Dom', 'days.short.1': 'Lun', 'days.short.2': 'Mar',
    'days.short.3': 'Mié', 'days.short.4': 'Jue', 'days.short.5': 'Vie', 'days.short.6': 'Sáb',

    // Greetings
    'greeting.morning': 'Buenos días',
    'greeting.afternoon': 'Buenas tardes',
    'greeting.evening': 'Buenas noches',
    'greeting.hello': '¡Hola, {name}!',

    // Dashboard
    'dashboard.balanceTotal': 'BALANCE TOTAL',
    'dashboard.income': 'Ingresos',
    'dashboard.expenses': 'Gastos',
    'dashboard.accounts': 'Cuentas',
    'dashboard.monthExpenses': 'Gastos del mes',
    'dashboard.total': 'TOTAL',
    'dashboard.recentTx': 'Transacciones',
    'dashboard.viewAll': 'Ver todas',
    'dashboard.thisMonth': 'este mes',

    // Transactions
    'transactions.title': 'Movimientos',
    'transactions.search': 'Buscar comercio o categoría...',
    'transactions.all': 'Todos',
    'transactions.expensesOnly': 'Gastos',
    'transactions.incomeOnly': 'Ingresos',
    'transactions.week': 'Semana',
    'transactions.month': 'Mes',
    'transactions.year': 'Año',
    'transactions.custom': 'Personalizado',
    'transactions.prevMonth': 'Mes anterior',
    'transactions.nextMonth': 'Mes siguiente',
    'transactions.noResults': 'No se encontraron movimientos con estos filtros',
    'transactions.loadMore': 'Cargar más',
    'transactions.loadingOlder': 'Cargando movimientos anteriores',

    // Add Transaction (Manual tab)
    'add.title': 'NUEVO MOVIMIENTO',
    'add.expense': 'Gasto',
    'add.income': 'Ingreso',
    'add.amount': 'MONTO DEL MOVIMIENTO',
    'add.description': 'DESCRIPCIÓN',
    'add.descPlaceholder': '¿En qué gastaste?',
    'add.category': 'CATEGORÍA',
    'add.date': 'FECHA',
    'add.account': 'CUENTA ORIGEN',
    'add.save': 'Guardar Movimiento',
    'add.fillAll': 'Completa todos los campos',
    'add.saved': 'Movimiento guardado',

    // Scan
    'scan.scanReceipt': 'Escanear Recibo',
    'scan.uploadStatement': 'Cargar Estado',
    'scan.manual': 'Manual',
    'scan.pointAtReceipt': 'Apunta al recibo',
    'scan.gallery': 'Galería',
    'scan.capture': 'Capturar',
    'scan.flash': 'Flash',
    'scan.cameraError': 'No se pudo acceder a la cámara',
    'scan.takePhoto': 'Tomar foto',
    'scan.analyzing': 'Analizando recibo…',
    'scan.extractedData': 'Datos extraídos',
    'scan.merchant': 'Comercio',
    'scan.date': 'Fecha',
    'scan.total': 'Total',
    'scan.category': 'Categoría',
    'scan.viewItems': 'Ver artículos',
    'scan.confirmSave': 'Confirmar y Guardar',
    'scan.dragStatement': 'Arrastra tu estado de cuenta aquí',
    'scan.orTapSelect': 'o toca para seleccionar',
    'scan.fileFormats': 'PDF, CSV, XLS — Hasta 10MB',
    'scan.compatibleFormats': 'Formatos compatibles:',
    'scan.processingFile': 'Procesando archivo...',
    'scan.analysisResults': 'Resultados del análisis',
    'scan.txFound': 'transacciones encontradas',
    'scan.period': 'Periodo:',
    'scan.dateHeader': 'Fecha',
    'scan.descHeader': 'Descripción',
    'scan.amountHeader': 'Monto',
    'scan.typeHeader': 'Tipo',
    'scan.preview': 'Vista previa (primeras 5)',
    'scan.reviewEdit': 'Revisar y Editar',
    'scan.importAll': 'Importar Todo',
    'scan.importSuccess': '¡Importación exitosa!',
    'scan.txImported': 'transacciones importadas correctamente',
    'scan.viewTx': 'Ver movimientos',
    'scan.txImportedToast': 'transacciones importadas',
    'scan.txSaved': 'Transacción guardada',
    'scan.fileTooLarge': 'El archivo excede 10MB',

    // Analytics
    'analytics.title': 'Análisis',
    'analytics.monthlySavings': 'AHORRO MENSUAL',
    'analytics.vsPrevMonth': 'vs. mes anterior ({amount})',
    'analytics.annualGoal': 'META DE AHORRO ANUAL',
    'analytics.goalMotivation': 'Estás en camino de alcanzar tu meta {months} antes de lo previsto.',
    'analytics.cashFlow': 'Flujo de Efectivo',
    'analytics.cashFlowSubtitle': 'Comparativa semestral Ingresos vs Gastos',
    'analytics.incomeLabel': 'Ingresos',
    'analytics.expensesLabel': 'Gastos',
    'analytics.categoryBreakdown': 'Desglose por Categoría',
    'analytics.aiAnalysis': 'Análisis de IA',
    'analytics.viewSavingsPlan': 'Ver Plan de Ahorro',
    'analytics.createReport': 'Crear nuevo reporte',
    'analytics.customizeReports': 'Personaliza tus visualizaciones de datos',
    'analytics.savingsRate': 'Tasa de ahorro',
    'analytics.youSaved': 'Ahorraste',
    'analytics.youOverspent': 'Gastaste de más',
    'analytics.thisPeriod': 'este periodo',
    'analytics.topMerchants': 'Comercios principales',
    'analytics.spendingTrend': 'Tendencia de gastos',
    'analytics.dailyExpenses': 'Gastos diarios',
    'analytics.average': 'Promedio',
    'analytics.week': 'Semana',
    'analytics.month': 'Mes',
    'analytics.threeMonths': '3 Meses',
    'analytics.year': 'Año',
    'analytics.weekPrefix': 'Sem ',
    'analytics.incomeVsExpenses': 'Ingresos vs Gastos',
    'analytics.spendingByCategory': 'Gastos por categoría',

    // Settings
    'settings.title': 'Ajustes',
    'settings.profile': 'Perfil',
    'settings.personalAccount': 'Cuenta personal',
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Seleccionar idioma',
    'settings.currency': 'Moneda',
    'settings.selectCurrency': 'Seleccionar moneda',
    'settings.currencyChanged': 'Moneda cambiada a {currency}',
    'settings.exchangeRate': 'Tasa de cambio',
    'settings.exchangeRateLabel': '1 USD = {rate} DOP',
    'settings.exchangeRateUpdated': 'Tasa de cambio actualizada',
    'settings.bankAccounts': 'Cuentas Bancarias',
    'settings.addAccount': 'Agregar Cuenta',
    'settings.comingSoon': 'Función disponible próximamente',
    'settings.categories': 'Categorías',
    'settings.monthlyBudgets': 'Presupuestos mensuales',
    'settings.notifications': 'Notificaciones',
    'settings.expenseAlerts': 'Alertas de gastos',
    'settings.notifEnabled': 'Notificaciones activadas',
    'settings.notifDisabled': 'Notificaciones desactivadas',
    'settings.data': 'Datos',
    'settings.exportData': 'Exportar datos',
    'settings.exported': 'Datos exportados',
    'settings.deleteAll': 'Borrar todos los datos',
    'settings.deleteConfirmTitle': '¿Borrar todos los datos?',
    'settings.deleteConfirmMsg': 'Esta acción eliminará todas tus transacciones, cuentas y configuraciones. No se puede deshacer.',
    'settings.deleteBtn': 'Borrar todo',
    'settings.dataRestored': 'Datos restaurados',
    'settings.app': 'Aplicación',
    'settings.installNomix': 'Instalar Nomix',
    'settings.installed': 'Nomix instalado correctamente',
    'settings.installCancelled': 'Instalación cancelada',
    'settings.about': 'Sobre Nomix',
    'settings.version': 'Versión 1.0.0 — Prototipo',
    'settings.tagline': 'Tu gestor de finanzas personales',

    // Account types
    'accountType.checking': 'Cuenta Corriente',
    'accountType.credit': 'Tarjeta de Crédito',
    'accountType.savings': 'Cuenta de Ahorro',
    'accountType.limit': 'LÍMITE',

    // Categories
    'category.food': 'Alimentación',
    'category.transport': 'Transporte',
    'category.health': 'Salud',
    'category.entertain': 'Entretenimiento',
    'category.restaurant': 'Restaurantes',
    'category.services': 'Servicios',
    'category.shopping': 'Compras',
    'category.income': 'Ingresos',
    'category.other': 'Otro',
    'category.unknown': 'Desconocida',

    // Short category labels for add form
    'category.short.food': 'COMIDA',
    'category.short.transport': 'TRANSP.',
    'category.short.health': 'SALUD',
    'category.short.entertain': 'OCIO',
    'category.short.restaurant': 'BARES',
    'category.short.services': 'LUZ/GAS',
    'category.short.shopping': 'COMPRAS',
    'category.short.other': 'OTROS',

    // Currency
    'currency.DOP': 'Peso Dominicano (RD$)',
    'currency.USD': 'Dólar Estadounidense (US$)',
    'currency.staleWarning': 'Tasa de cambio desactualizada. Se muestra con la última tasa disponible.',

    // AI Insights
    'ai.insight1': 'Tus gastos en {category} han disminuido un {percent}% respecto al promedio de los últimos 3 meses. Si mantienes este ritmo, podrías aumentar tu fondo de emergencia en {amount} adicionales para final de año.',
    'ai.insight2': 'Tu gasto en transporte bajó un 12% este mes. ¡Sigue así!',
    'ai.insight3': 'Llevas 3 meses consecutivos ahorrando más del 20% de tus ingresos. ¡Excelente hábito!',
    'ai.insight4': 'Los servicios representan el 25% de tus gastos fijos. Revisa si puedes optimizar alguno.',

    // CSV export
    'csv.header': 'Fecha,Comercio,Categoría,Monto,Cuenta',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.transactions': 'Transactions',
    'nav.add': 'Add',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.aria': 'Main navigation',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.delete': 'Delete',
    'common.today': 'Today',
    'common.yesterday': 'Yesterday',
    'common.viewAll': 'View all',
    'common.loading': 'Loading...',
    'common.noResults': '0 results',
    'common.retry': 'Retry',
    'common.confirm': 'Confirm',

    // Months
    'months.short.0': 'Jan', 'months.short.1': 'Feb', 'months.short.2': 'Mar',
    'months.short.3': 'Apr', 'months.short.4': 'May', 'months.short.5': 'Jun',
    'months.short.6': 'Jul', 'months.short.7': 'Aug', 'months.short.8': 'Sep',
    'months.short.9': 'Oct', 'months.short.10': 'Nov', 'months.short.11': 'Dec',
    'months.long.0': 'January', 'months.long.1': 'February', 'months.long.2': 'March',
    'months.long.3': 'April', 'months.long.4': 'May', 'months.long.5': 'June',
    'months.long.6': 'July', 'months.long.7': 'August', 'months.long.8': 'September',
    'months.long.9': 'October', 'months.long.10': 'November', 'months.long.11': 'December',
    'months.upper.0': 'JAN', 'months.upper.1': 'FEB', 'months.upper.2': 'MAR',
    'months.upper.3': 'APR', 'months.upper.4': 'MAY', 'months.upper.5': 'JUN',
    'months.upper.6': 'JUL', 'months.upper.7': 'AUG', 'months.upper.8': 'SEP',
    'months.upper.9': 'OCT', 'months.upper.10': 'NOV', 'months.upper.11': 'DEC',

    // Days
    'days.short.0': 'Sun', 'days.short.1': 'Mon', 'days.short.2': 'Tue',
    'days.short.3': 'Wed', 'days.short.4': 'Thu', 'days.short.5': 'Fri', 'days.short.6': 'Sat',

    // Greetings
    'greeting.morning': 'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening': 'Good evening',
    'greeting.hello': 'Hello, {name}!',

    // Dashboard
    'dashboard.balanceTotal': 'TOTAL BALANCE',
    'dashboard.income': 'Income',
    'dashboard.expenses': 'Expenses',
    'dashboard.accounts': 'Accounts',
    'dashboard.monthExpenses': 'Monthly expenses',
    'dashboard.total': 'TOTAL',
    'dashboard.recentTx': 'Transactions',
    'dashboard.viewAll': 'View all',
    'dashboard.thisMonth': 'this month',

    // Transactions
    'transactions.title': 'Transactions',
    'transactions.search': 'Search merchant or category...',
    'transactions.all': 'All',
    'transactions.expensesOnly': 'Expenses',
    'transactions.incomeOnly': 'Income',
    'transactions.week': 'Week',
    'transactions.month': 'Month',
    'transactions.year': 'Year',
    'transactions.custom': 'Custom',
    'transactions.prevMonth': 'Previous month',
    'transactions.nextMonth': 'Next month',
    'transactions.noResults': 'No transactions found with these filters',
    'transactions.loadMore': 'Load more',
    'transactions.loadingOlder': 'Loading older transactions',

    // Add Transaction
    'add.title': 'NEW TRANSACTION',
    'add.expense': 'Expense',
    'add.income': 'Income',
    'add.amount': 'TRANSACTION AMOUNT',
    'add.description': 'DESCRIPTION',
    'add.descPlaceholder': 'What did you spend on?',
    'add.category': 'CATEGORY',
    'add.date': 'DATE',
    'add.account': 'SOURCE ACCOUNT',
    'add.save': 'Save Transaction',
    'add.fillAll': 'Please fill in all fields',
    'add.saved': 'Transaction saved',

    // Scan
    'scan.scanReceipt': 'Scan Receipt',
    'scan.uploadStatement': 'Upload Statement',
    'scan.manual': 'Manual',
    'scan.pointAtReceipt': 'Point at the receipt',
    'scan.gallery': 'Gallery',
    'scan.capture': 'Capture',
    'scan.flash': 'Flash',
    'scan.cameraError': 'Could not access camera',
    'scan.takePhoto': 'Take photo',
    'scan.analyzing': 'Analyzing receipt…',
    'scan.extractedData': 'Extracted data',
    'scan.merchant': 'Merchant',
    'scan.date': 'Date',
    'scan.total': 'Total',
    'scan.category': 'Category',
    'scan.viewItems': 'View items',
    'scan.confirmSave': 'Confirm & Save',
    'scan.dragStatement': 'Drag your statement here',
    'scan.orTapSelect': 'or tap to select',
    'scan.fileFormats': 'PDF, CSV, XLS — Up to 10MB',
    'scan.compatibleFormats': 'Compatible formats:',
    'scan.processingFile': 'Processing file...',
    'scan.analysisResults': 'Analysis results',
    'scan.txFound': 'transactions found',
    'scan.period': 'Period:',
    'scan.dateHeader': 'Date',
    'scan.descHeader': 'Description',
    'scan.amountHeader': 'Amount',
    'scan.typeHeader': 'Type',
    'scan.preview': 'Preview (first 5)',
    'scan.reviewEdit': 'Review & Edit',
    'scan.importAll': 'Import All',
    'scan.importSuccess': 'Import successful!',
    'scan.txImported': 'transactions imported successfully',
    'scan.viewTx': 'View transactions',
    'scan.txImportedToast': 'transactions imported',
    'scan.txSaved': 'Transaction saved',
    'scan.fileTooLarge': 'File exceeds 10MB',

    // Analytics
    'analytics.title': 'Analytics',
    'analytics.monthlySavings': 'MONTHLY SAVINGS',
    'analytics.vsPrevMonth': 'vs. previous month ({amount})',
    'analytics.annualGoal': 'ANNUAL SAVINGS GOAL',
    'analytics.goalMotivation': 'You\'re on track to reach your goal {months} ahead of schedule.',
    'analytics.cashFlow': 'Cash Flow',
    'analytics.cashFlowSubtitle': 'Semester comparison Income vs Expenses',
    'analytics.incomeLabel': 'Income',
    'analytics.expensesLabel': 'Expenses',
    'analytics.categoryBreakdown': 'Category Breakdown',
    'analytics.aiAnalysis': 'AI Analysis',
    'analytics.viewSavingsPlan': 'View Savings Plan',
    'analytics.createReport': 'Create new report',
    'analytics.customizeReports': 'Customize your data visualizations',
    'analytics.savingsRate': 'Savings rate',
    'analytics.youSaved': 'You saved',
    'analytics.youOverspent': 'You overspent',
    'analytics.thisPeriod': 'this period',
    'analytics.topMerchants': 'Top merchants',
    'analytics.spendingTrend': 'Spending trend',
    'analytics.dailyExpenses': 'Daily expenses',
    'analytics.average': 'Average',
    'analytics.week': 'Week',
    'analytics.month': 'Month',
    'analytics.threeMonths': '3 Months',
    'analytics.year': 'Year',
    'analytics.weekPrefix': 'Wk ',
    'analytics.incomeVsExpenses': 'Income vs Expenses',
    'analytics.spendingByCategory': 'Spending by category',

    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.personalAccount': 'Personal account',
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select language',
    'settings.currency': 'Currency',
    'settings.selectCurrency': 'Select currency',
    'settings.currencyChanged': 'Currency changed to {currency}',
    'settings.exchangeRate': 'Exchange rate',
    'settings.exchangeRateLabel': '1 USD = {rate} DOP',
    'settings.exchangeRateUpdated': 'Exchange rate updated',
    'settings.bankAccounts': 'Bank Accounts',
    'settings.addAccount': 'Add Account',
    'settings.comingSoon': 'Feature coming soon',
    'settings.categories': 'Categories',
    'settings.monthlyBudgets': 'Monthly budgets',
    'settings.notifications': 'Notifications',
    'settings.expenseAlerts': 'Expense alerts',
    'settings.notifEnabled': 'Notifications enabled',
    'settings.notifDisabled': 'Notifications disabled',
    'settings.data': 'Data',
    'settings.exportData': 'Export data',
    'settings.exported': 'Data exported',
    'settings.deleteAll': 'Delete all data',
    'settings.deleteConfirmTitle': 'Delete all data?',
    'settings.deleteConfirmMsg': 'This action will delete all your transactions, accounts, and settings. This cannot be undone.',
    'settings.deleteBtn': 'Delete all',
    'settings.dataRestored': 'Data restored',
    'settings.app': 'Application',
    'settings.installNomix': 'Install Nomix',
    'settings.installed': 'Nomix installed successfully',
    'settings.installCancelled': 'Installation cancelled',
    'settings.about': 'About Nomix',
    'settings.version': 'Version 1.0.0 — Prototype',
    'settings.tagline': 'Your personal finance manager',

    // Account types
    'accountType.checking': 'Checking Account',
    'accountType.credit': 'Credit Card',
    'accountType.savings': 'Savings Account',
    'accountType.limit': 'LIMIT',

    // Categories
    'category.food': 'Food',
    'category.transport': 'Transport',
    'category.health': 'Health',
    'category.entertain': 'Entertainment',
    'category.restaurant': 'Restaurants',
    'category.services': 'Utilities',
    'category.shopping': 'Shopping',
    'category.income': 'Income',
    'category.other': 'Other',
    'category.unknown': 'Unknown',

    // Short category labels
    'category.short.food': 'FOOD',
    'category.short.transport': 'TRANSP.',
    'category.short.health': 'HEALTH',
    'category.short.entertain': 'LEISURE',
    'category.short.restaurant': 'DINING',
    'category.short.services': 'BILLS',
    'category.short.shopping': 'SHOPPING',
    'category.short.other': 'OTHER',

    // Currency
    'currency.DOP': 'Dominican Peso (RD$)',
    'currency.USD': 'US Dollar (US$)',
    'currency.staleWarning': 'Exchange rate outdated. Displaying with the last available rate.',

    // AI Insights
    'ai.insight1': 'Your spending on {category} has decreased by {percent}% compared to the 3-month average. If you keep this pace, you could add {amount} to your emergency fund by year-end.',
    'ai.insight2': 'Your transport spending dropped 12% this month. Keep it up!',
    'ai.insight3': 'You\'ve been saving over 20% of your income for 3 consecutive months. Excellent habit!',
    'ai.insight4': 'Utilities represent 25% of your fixed expenses. Check if you can optimize any.',

    // CSV export
    'csv.header': 'Date,Merchant,Category,Amount,Account',
  }
};

let currentLang = 'es';

const i18n = {
  t(key, params = {}) {
    const dict = translations[currentLang] || translations.es;
    let str = dict[key] || translations.es[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return str;
  },

  getLang() {
    return currentLang;
  },

  setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang } }));
  },

  init(lang) {
    currentLang = lang || 'es';
    document.documentElement.lang = currentLang;
  },

  getLocale() {
    return currentLang === 'es' ? 'es-DO' : 'en-US';
  }
};

export default i18n;

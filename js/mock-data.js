// Mock accounts (Dominican Republic context, DOP currency)
export const MOCK_ACCOUNTS = [
  { id: 'acc1', name: 'Banco Popular', type: 'checking', number: '••9823', balance: 45200.00, color: '#4F46E5', currency: 'DOP' },
  { id: 'acc2', name: 'Visa Gold', type: 'credit', number: '••4582', balance: -12340.50, limit: 150000, color: '#DC2626', currency: 'DOP' },
  { id: 'acc3', name: 'Banreservas Ahorros', type: 'savings', number: '••7714', balance: 128500.00, color: '#059669', currency: 'DOP' }
];

// Categories
export const MOCK_CATEGORIES = [
  { id: 'food',       name: 'Alimentación',     icon: '🛒', color: '#F97316' },
  { id: 'transport',  name: 'Transporte',       icon: '🚗', color: '#3B82F6' },
  { id: 'health',     name: 'Salud',            icon: '💊', color: '#10B981' },
  { id: 'entertain',  name: 'Entretenimiento',  icon: '🎬', color: '#8B5CF6' },
  { id: 'restaurant', name: 'Restaurantes',     icon: '🍽️', color: '#EF4444' },
  { id: 'services',   name: 'Servicios',        icon: '⚡', color: '#F59E0B' },
  { id: 'shopping',   name: 'Compras',          icon: '🛍️', color: '#EC4899' },
  { id: 'income',     name: 'Ingresos',         icon: '💰', color: '#00E5C4' }
];

// Helper to generate dates relative to today
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

// 60 transactions spread over ~90 days (amounts in DOP)
export const MOCK_TRANSACTIONS = [
  // Today
  { id: 'tx001', date: daysAgo(0), merchant: 'Supermercado Nacional', categoryId: 'food', accountId: 'acc1', amount: -2450.00, note: 'Compras semanales' },
  { id: 'tx002', date: daysAgo(0), merchant: 'Uber', categoryId: 'transport', accountId: 'acc2', amount: -385.00, note: '' },
  { id: 'tx003', date: daysAgo(0), merchant: 'Netflix', categoryId: 'entertain', accountId: 'acc2', amount: -790.00, note: 'Suscripción mensual' },

  // Yesterday
  { id: 'tx004', date: daysAgo(1), merchant: 'Buen Provecho', categoryId: 'restaurant', accountId: 'acc2', amount: -950.00, note: 'Almuerzo' },
  { id: 'tx005', date: daysAgo(1), merchant: 'Gasolinera Shell', categoryId: 'transport', accountId: 'acc1', amount: -3200.00, note: 'Tanque lleno' },

  // 2 days ago
  { id: 'tx006', date: daysAgo(2), merchant: 'Depósito de Nómina', categoryId: 'income', accountId: 'acc1', amount: 65000.00, note: 'Depósito nómina' },
  { id: 'tx007', date: daysAgo(2), merchant: 'Farmacia Carol', categoryId: 'health', accountId: 'acc1', amount: -1850.00, note: 'Medicinas' },

  // 3 days ago
  { id: 'tx008', date: daysAgo(3), merchant: 'Plaza Lama', categoryId: 'shopping', accountId: 'acc2', amount: -4500.00, note: 'Artículos para el hogar' },
  { id: 'tx009', date: daysAgo(3), merchant: 'Café Santo Domingo', categoryId: 'restaurant', accountId: 'acc1', amount: -280.00, note: '' },

  // 4 days ago
  { id: 'tx010', date: daysAgo(4), merchant: 'EDENORTE', categoryId: 'services', accountId: 'acc1', amount: -3100.00, note: 'Factura luz enero' },
  { id: 'tx011', date: daysAgo(4), merchant: 'Altice', categoryId: 'services', accountId: 'acc1', amount: -2200.00, note: 'Internet + celular' },

  // 5 days ago
  { id: 'tx012', date: daysAgo(5), merchant: 'Bravo Supermercado', categoryId: 'food', accountId: 'acc1', amount: -5200.00, note: 'Compras quincenales' },
  { id: 'tx013', date: daysAgo(5), merchant: 'Caribbean Cinemas', categoryId: 'entertain', accountId: 'acc2', amount: -1400.00, note: 'Boletos + palomitas' },

  // 6-7 days ago
  { id: 'tx014', date: daysAgo(6), merchant: 'Panadería La Competencia', categoryId: 'food', accountId: 'acc1', amount: -450.00, note: 'Pan y pasteles' },
  { id: 'tx015', date: daysAgo(7), merchant: 'Freelance Web', categoryId: 'income', accountId: 'acc3', amount: 25000.00, note: 'Proyecto freelance' },
  { id: 'tx016', date: daysAgo(7), merchant: 'Jumbo', categoryId: 'food', accountId: 'acc1', amount: -3400.00, note: '' },

  // Week 2
  { id: 'tx017', date: daysAgo(8), merchant: 'McDonald\'s', categoryId: 'restaurant', accountId: 'acc2', amount: -680.00, note: '' },
  { id: 'tx018', date: daysAgo(9), merchant: 'Agua Crystal', categoryId: 'services', accountId: 'acc1', amount: -500.00, note: 'Botellón' },
  { id: 'tx019', date: daysAgo(10), merchant: 'Claro', categoryId: 'services', accountId: 'acc1', amount: -2800.00, note: 'Internet hogar' },
  { id: 'tx020', date: daysAgo(11), merchant: 'La Sirena', categoryId: 'food', accountId: 'acc1', amount: -1950.00, note: '' },
  { id: 'tx021', date: daysAgo(12), merchant: 'PedidosYa', categoryId: 'restaurant', accountId: 'acc2', amount: -890.00, note: 'Cena' },
  { id: 'tx022', date: daysAgo(13), merchant: 'Parque Olímpico', categoryId: 'entertain', accountId: 'acc1', amount: -1200.00, note: 'Cancha de fútbol' },
  { id: 'tx023', date: daysAgo(14), merchant: 'Gasolinera Propagas', categoryId: 'transport', accountId: 'acc1', amount: -2800.00, note: '' },

  // Week 3
  { id: 'tx024', date: daysAgo(15), merchant: 'Depósito extra', categoryId: 'income', accountId: 'acc1', amount: 15000.00, note: 'Bono' },
  { id: 'tx025', date: daysAgo(16), merchant: 'PriceSmart', categoryId: 'shopping', accountId: 'acc2', amount: -8900.00, note: 'Membresía + compras' },
  { id: 'tx026', date: daysAgo(17), merchant: 'Farmacia Los Hidalgos', categoryId: 'health', accountId: 'acc1', amount: -2100.00, note: '' },
  { id: 'tx027', date: daysAgo(18), merchant: 'Domino\'s Pizza', categoryId: 'restaurant', accountId: 'acc2', amount: -1450.00, note: 'Pizza familiar' },
  { id: 'tx028', date: daysAgo(19), merchant: 'Supermercado Nacional', categoryId: 'food', accountId: 'acc1', amount: -4230.00, note: 'Súper' },
  { id: 'tx029', date: daysAgo(20), merchant: 'Spotify', categoryId: 'entertain', accountId: 'acc2', amount: -549.00, note: 'Suscripción' },
  { id: 'tx030', date: daysAgo(21), merchant: 'Taxi Caribe', categoryId: 'transport', accountId: 'acc1', amount: -550.00, note: '' },

  // Month 2
  { id: 'tx031', date: daysAgo(25), merchant: 'Depósito de Nómina', categoryId: 'income', accountId: 'acc1', amount: 65000.00, note: 'Depósito nómina' },
  { id: 'tx032', date: daysAgo(26), merchant: 'Supermercado Nacional', categoryId: 'food', accountId: 'acc1', amount: -3450.00, note: '' },
  { id: 'tx033', date: daysAgo(27), merchant: 'EDENORTE', categoryId: 'services', accountId: 'acc1', amount: -3350.00, note: 'Factura luz' },
  { id: 'tx034', date: daysAgo(28), merchant: 'Dentista Dra. Pérez', categoryId: 'health', accountId: 'acc1', amount: -5000.00, note: 'Limpieza dental' },
  { id: 'tx035', date: daysAgo(30), merchant: 'Altice', categoryId: 'services', accountId: 'acc1', amount: -2200.00, note: 'Internet + celular' },
  { id: 'tx036', date: daysAgo(31), merchant: 'Plaza Lama', categoryId: 'shopping', accountId: 'acc2', amount: -6500.00, note: 'Decoración' },
  { id: 'tx037', date: daysAgo(32), merchant: 'Adrián Tropical', categoryId: 'restaurant', accountId: 'acc2', amount: -2200.00, note: 'Cena familiar' },
  { id: 'tx038', date: daysAgo(33), merchant: 'Gasolinera Shell', categoryId: 'transport', accountId: 'acc1', amount: -3300.00, note: '' },
  { id: 'tx039', date: daysAgo(35), merchant: 'Bravo Supermercado', categoryId: 'food', accountId: 'acc1', amount: -4780.00, note: '' },
  { id: 'tx040', date: daysAgo(36), merchant: 'Netflix', categoryId: 'entertain', accountId: 'acc2', amount: -790.00, note: 'Suscripción' },
  { id: 'tx041', date: daysAgo(38), merchant: 'Claro', categoryId: 'services', accountId: 'acc1', amount: -2800.00, note: 'Internet' },
  { id: 'tx042', date: daysAgo(40), merchant: 'Uber', categoryId: 'transport', accountId: 'acc2', amount: -380.00, note: '' },

  // Month 3
  { id: 'tx043', date: daysAgo(45), merchant: 'Buen Provecho', categoryId: 'restaurant', accountId: 'acc2', amount: -750.00, note: '' },
  { id: 'tx044', date: daysAgo(48), merchant: 'La Sirena', categoryId: 'food', accountId: 'acc1', amount: -2560.00, note: '' },
  { id: 'tx045', date: daysAgo(50), merchant: 'Freelance Diseño', categoryId: 'income', accountId: 'acc3', amount: 32000.00, note: 'Proyecto branding' },
  { id: 'tx046', date: daysAgo(52), merchant: 'Farmacia Carol', categoryId: 'health', accountId: 'acc1', amount: -980.00, note: '' },
  { id: 'tx047', date: daysAgo(55), merchant: 'Depósito de Nómina', categoryId: 'income', accountId: 'acc1', amount: 65000.00, note: 'Depósito nómina' },
  { id: 'tx048', date: daysAgo(56), merchant: 'EDENORTE', categoryId: 'services', accountId: 'acc1', amount: -2750.00, note: '' },
  { id: 'tx049', date: daysAgo(58), merchant: 'Panadería La Competencia', categoryId: 'food', accountId: 'acc1', amount: -520.00, note: '' },
  { id: 'tx050', date: daysAgo(60), merchant: 'Jumbo', categoryId: 'food', accountId: 'acc1', amount: -3980.00, note: '' },
  { id: 'tx051', date: daysAgo(62), merchant: 'Caribbean Cinemas', categoryId: 'entertain', accountId: 'acc2', amount: -1500.00, note: '' },
  { id: 'tx052', date: daysAgo(65), merchant: 'Gasolinera Propagas', categoryId: 'transport', accountId: 'acc1', amount: -3100.00, note: '' },
  { id: 'tx053', date: daysAgo(67), merchant: 'PriceSmart', categoryId: 'shopping', accountId: 'acc2', amount: -7200.00, note: '' },
  { id: 'tx054', date: daysAgo(70), merchant: 'Altice', categoryId: 'services', accountId: 'acc1', amount: -2200.00, note: '' },
  { id: 'tx055', date: daysAgo(72), merchant: 'McDonald\'s', categoryId: 'restaurant', accountId: 'acc2', amount: -550.00, note: '' },
  { id: 'tx056', date: daysAgo(75), merchant: 'PedidosYa', categoryId: 'restaurant', accountId: 'acc2', amount: -1100.00, note: '' },
  { id: 'tx057', date: daysAgo(78), merchant: 'Spotify', categoryId: 'entertain', accountId: 'acc2', amount: -549.00, note: '' },
  { id: 'tx058', date: daysAgo(80), merchant: 'Taxi Caribe', categoryId: 'transport', accountId: 'acc1', amount: -400.00, note: '' },
  { id: 'tx059', date: daysAgo(85), merchant: 'Supermercado Nacional', categoryId: 'food', accountId: 'acc1', amount: -5150.00, note: '' },
  { id: 'tx060', date: daysAgo(88), merchant: 'Dentista Dra. Pérez', categoryId: 'health', accountId: 'acc1', amount: -4000.00, note: '' },
];

// Bank statement rows for upload demo (87 entries)
export const MOCK_STATEMENT_ROWS = (() => {
  const merchants = [
    'SUPERMERCADO NACIONAL', 'BRAVO SUPERMERCADOS', 'GASOLINERA SHELL', 'UBER *TRIP',
    'NETFLIX.COM', 'BUEN PROVECHO', 'FARMACIA CAROL', 'ALTICE DOMINICANA',
    'PLAZA LAMA', 'PRICESMART', 'CAFE SANTO DOMINGO', 'EDENORTE',
    'MCDONALDS', 'PANADERIA LA COMPETENCIA', 'DOMINOS PIZZA', 'CLARO RD',
    'SPOTIFY', 'PEDIDOSYA', 'LA SIRENA', 'CARIBBEAN CINEMAS',
    'JUMBO', 'SUP NACIONAL ONLINE', 'BANRESERVAS',
    'AGUA CRYSTAL', 'TAXI CARIBE EXPRESS'
  ];
  const rows = [];
  for (let i = 0; i < 87; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(i * 60 / 87));
    const merchant = merchants[i % merchants.length];
    const isIncome = i % 20 === 0;
    rows.push({
      id: `stmt${String(i + 1).padStart(3, '0')}`,
      date: d.toISOString().split('T')[0],
      description: merchant,
      amount: isIncome ? +(Math.random() * 50000 + 30000).toFixed(2) : -(Math.random() * 5000 + 200).toFixed(2),
      type: isIncome ? 'credit' : 'debit',
      balance: +(Math.random() * 100000 + 20000).toFixed(2)
    });
  }
  return rows;
})();

// Receipt OCR result (mock)
export const MOCK_RECEIPT_RESULT = {
  merchant: 'Supermercado Nacional',
  date: new Date().toISOString().split('T')[0],
  total: 2345.00,
  currency: 'DOP',
  categoryId: 'food',
  items: [
    { name: 'Leche Entera 1L', qty: 2, price: 185.00 },
    { name: 'Pan Integral', qty: 1, price: 240.00 },
    { name: 'Pollo Entero', qty: 1, price: 450.00 },
    { name: 'Arroz 5lb', qty: 1, price: 280.00 },
    { name: 'Habichuela Roja 2lb', qty: 2, price: 150.00 },
    { name: 'Aceite La Famosa 1L', qty: 1, price: 320.00 },
    { name: 'Huevos (docena)', qty: 1, price: 220.00 },
    { name: 'Tomate lb', qty: 3, price: 85.00 },
  ]
};

// Monthly budget defaults (DOP)
export const MOCK_BUDGETS = [
  { categoryId: 'food', limit: 25000 },
  { categoryId: 'transport', limit: 15000 },
  { categoryId: 'restaurant', limit: 10000 },
  { categoryId: 'entertain', limit: 8000 },
  { categoryId: 'services', limit: 15000 },
  { categoryId: 'health', limit: 10000 },
  { categoryId: 'shopping', limit: 12000 },
];

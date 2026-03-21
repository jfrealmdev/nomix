// Mock accounts
export const MOCK_ACCOUNTS = [
  { id: 'acc1', name: 'Banco Santander', type: 'checking', number: '••9823', balance: 8450.30, color: '#4F46E5', currency: 'GTQ' },
  { id: 'acc2', name: 'Visa Platinum', type: 'credit', number: '••4521', balance: -1234.50, limit: 15000, color: '#DC2626', currency: 'GTQ' },
  { id: 'acc3', name: 'BAC Ahorros', type: 'savings', number: '••7714', balance: 5234.00, color: '#059669', currency: 'GTQ' }
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

// 60 transactions spread over ~90 days
export const MOCK_TRANSACTIONS = [
  // Today
  { id: 'tx001', date: daysAgo(0), merchant: 'Supermercado La Colonia', categoryId: 'food', accountId: 'acc1', amount: -234.50, note: 'Compras semanales' },
  { id: 'tx002', date: daysAgo(0), merchant: 'Uber', categoryId: 'transport', accountId: 'acc2', amount: -45.00, note: '' },
  { id: 'tx003', date: daysAgo(0), merchant: 'Netflix', categoryId: 'entertain', accountId: 'acc2', amount: -129.00, note: 'Suscripción mensual' },

  // Yesterday
  { id: 'tx004', date: daysAgo(1), merchant: 'Pollo Campero', categoryId: 'restaurant', accountId: 'acc2', amount: -89.50, note: 'Almuerzo' },
  { id: 'tx005', date: daysAgo(1), merchant: 'Gasolinera Shell', categoryId: 'transport', accountId: 'acc1', amount: -350.00, note: 'Tanque lleno' },

  // 2 days ago
  { id: 'tx006', date: daysAgo(2), merchant: 'Salario Mensual', categoryId: 'income', accountId: 'acc1', amount: 8500.00, note: 'Depósito nómina' },
  { id: 'tx007', date: daysAgo(2), merchant: 'Farmacia Galeno', categoryId: 'health', accountId: 'acc1', amount: -156.00, note: 'Medicinas' },

  // 3 days ago
  { id: 'tx008', date: daysAgo(3), merchant: 'Cemaco', categoryId: 'shopping', accountId: 'acc2', amount: -425.00, note: 'Artículos para el hogar' },
  { id: 'tx009', date: daysAgo(3), merchant: 'Café Barista', categoryId: 'restaurant', accountId: 'acc1', amount: -35.00, note: '' },

  // 4 days ago
  { id: 'tx010', date: daysAgo(4), merchant: 'Empresa Eléctrica', categoryId: 'services', accountId: 'acc1', amount: -285.00, note: 'Factura luz enero' },
  { id: 'tx011', date: daysAgo(4), merchant: 'Tigo', categoryId: 'services', accountId: 'acc1', amount: -199.00, note: 'Plan celular' },

  // 5 days ago
  { id: 'tx012', date: daysAgo(5), merchant: 'Walmart', categoryId: 'food', accountId: 'acc1', amount: -567.80, note: 'Compras quincenales' },
  { id: 'tx013', date: daysAgo(5), merchant: 'Cinépolis', categoryId: 'entertain', accountId: 'acc2', amount: -120.00, note: 'Boletos + palomitas' },

  // 6-7 days ago
  { id: 'tx014', date: daysAgo(6), merchant: 'San Martín Bakery', categoryId: 'food', accountId: 'acc1', amount: -48.00, note: 'Pan y pasteles' },
  { id: 'tx015', date: daysAgo(7), merchant: 'Freelance Web', categoryId: 'income', accountId: 'acc3', amount: 2500.00, note: 'Proyecto freelance' },
  { id: 'tx016', date: daysAgo(7), merchant: 'MaxiDespensa', categoryId: 'food', accountId: 'acc1', amount: -312.00, note: '' },

  // Week 2
  { id: 'tx017', date: daysAgo(8), merchant: 'McDonald\'s', categoryId: 'restaurant', accountId: 'acc2', amount: -65.00, note: '' },
  { id: 'tx018', date: daysAgo(9), merchant: 'Agua Pura Salvavidas', categoryId: 'services', accountId: 'acc1', amount: -80.00, note: 'Garrafón' },
  { id: 'tx019', date: daysAgo(10), merchant: 'Claro', categoryId: 'services', accountId: 'acc1', amount: -299.00, note: 'Internet hogar' },
  { id: 'tx020', date: daysAgo(11), merchant: 'Despensa Familiar', categoryId: 'food', accountId: 'acc1', amount: -189.50, note: '' },
  { id: 'tx021', date: daysAgo(12), merchant: 'Uber Eats', categoryId: 'restaurant', accountId: 'acc2', amount: -95.00, note: 'Cena' },
  { id: 'tx022', date: daysAgo(13), merchant: 'Plaza Futeca', categoryId: 'entertain', accountId: 'acc1', amount: -180.00, note: 'Cancha de fútbol' },
  { id: 'tx023', date: daysAgo(14), merchant: 'Gasolinera Puma', categoryId: 'transport', accountId: 'acc1', amount: -275.00, note: '' },

  // Week 3
  { id: 'tx024', date: daysAgo(15), merchant: 'Depósito extra', categoryId: 'income', accountId: 'acc1', amount: 1500.00, note: 'Bono' },
  { id: 'tx025', date: daysAgo(16), merchant: 'PriceSmart', categoryId: 'shopping', accountId: 'acc2', amount: -890.00, note: 'Membresía + compras' },
  { id: 'tx026', date: daysAgo(17), merchant: 'Farmacia Cruz Verde', categoryId: 'health', accountId: 'acc1', amount: -210.00, note: '' },
  { id: 'tx027', date: daysAgo(18), merchant: 'Domino\'s Pizza', categoryId: 'restaurant', accountId: 'acc2', amount: -145.00, note: 'Pizza familiar' },
  { id: 'tx028', date: daysAgo(19), merchant: 'La Torre', categoryId: 'food', accountId: 'acc1', amount: -423.00, note: 'Súper' },
  { id: 'tx029', date: daysAgo(20), merchant: 'Spotify', categoryId: 'entertain', accountId: 'acc2', amount: -54.99, note: 'Suscripción' },
  { id: 'tx030', date: daysAgo(21), merchant: 'Taxi Amarillo', categoryId: 'transport', accountId: 'acc1', amount: -55.00, note: '' },

  // Month 2
  { id: 'tx031', date: daysAgo(25), merchant: 'Salario Mensual', categoryId: 'income', accountId: 'acc1', amount: 8500.00, note: 'Depósito nómina' },
  { id: 'tx032', date: daysAgo(26), merchant: 'Supermercado La Colonia', categoryId: 'food', accountId: 'acc1', amount: -345.00, note: '' },
  { id: 'tx033', date: daysAgo(27), merchant: 'Empresa Eléctrica', categoryId: 'services', accountId: 'acc1', amount: -310.00, note: 'Factura luz' },
  { id: 'tx034', date: daysAgo(28), merchant: 'Dentista Dr. López', categoryId: 'health', accountId: 'acc1', amount: -500.00, note: 'Limpieza dental' },
  { id: 'tx035', date: daysAgo(30), merchant: 'Tigo', categoryId: 'services', accountId: 'acc1', amount: -199.00, note: 'Plan celular' },
  { id: 'tx036', date: daysAgo(31), merchant: 'Cemaco', categoryId: 'shopping', accountId: 'acc2', amount: -650.00, note: 'Decoración' },
  { id: 'tx037', date: daysAgo(32), merchant: 'Los Cebollines', categoryId: 'restaurant', accountId: 'acc2', amount: -220.00, note: 'Cena familiar' },
  { id: 'tx038', date: daysAgo(33), merchant: 'Gasolinera Shell', categoryId: 'transport', accountId: 'acc1', amount: -330.00, note: '' },
  { id: 'tx039', date: daysAgo(35), merchant: 'Walmart', categoryId: 'food', accountId: 'acc1', amount: -478.00, note: '' },
  { id: 'tx040', date: daysAgo(36), merchant: 'Netflix', categoryId: 'entertain', accountId: 'acc2', amount: -129.00, note: 'Suscripción' },
  { id: 'tx041', date: daysAgo(38), merchant: 'Claro', categoryId: 'services', accountId: 'acc1', amount: -299.00, note: 'Internet' },
  { id: 'tx042', date: daysAgo(40), merchant: 'Uber', categoryId: 'transport', accountId: 'acc2', amount: -38.00, note: '' },

  // Month 3
  { id: 'tx043', date: daysAgo(45), merchant: 'Pollo Campero', categoryId: 'restaurant', accountId: 'acc2', amount: -75.00, note: '' },
  { id: 'tx044', date: daysAgo(48), merchant: 'Despensa Familiar', categoryId: 'food', accountId: 'acc1', amount: -256.00, note: '' },
  { id: 'tx045', date: daysAgo(50), merchant: 'Freelance Diseño', categoryId: 'income', accountId: 'acc3', amount: 3200.00, note: 'Proyecto branding' },
  { id: 'tx046', date: daysAgo(52), merchant: 'Farmacia Galeno', categoryId: 'health', accountId: 'acc1', amount: -98.00, note: '' },
  { id: 'tx047', date: daysAgo(55), merchant: 'Salario Mensual', categoryId: 'income', accountId: 'acc1', amount: 8500.00, note: 'Depósito nómina' },
  { id: 'tx048', date: daysAgo(56), merchant: 'Empresa Eléctrica', categoryId: 'services', accountId: 'acc1', amount: -275.00, note: '' },
  { id: 'tx049', date: daysAgo(58), merchant: 'San Martín Bakery', categoryId: 'food', accountId: 'acc1', amount: -52.00, note: '' },
  { id: 'tx050', date: daysAgo(60), merchant: 'MaxiDespensa', categoryId: 'food', accountId: 'acc1', amount: -398.00, note: '' },
  { id: 'tx051', date: daysAgo(62), merchant: 'Cinépolis', categoryId: 'entertain', accountId: 'acc2', amount: -150.00, note: '' },
  { id: 'tx052', date: daysAgo(65), merchant: 'Gasolinera Puma', categoryId: 'transport', accountId: 'acc1', amount: -310.00, note: '' },
  { id: 'tx053', date: daysAgo(67), merchant: 'PriceSmart', categoryId: 'shopping', accountId: 'acc2', amount: -720.00, note: '' },
  { id: 'tx054', date: daysAgo(70), merchant: 'Tigo', categoryId: 'services', accountId: 'acc1', amount: -199.00, note: '' },
  { id: 'tx055', date: daysAgo(72), merchant: 'McDonald\'s', categoryId: 'restaurant', accountId: 'acc2', amount: -55.00, note: '' },
  { id: 'tx056', date: daysAgo(75), merchant: 'Uber Eats', categoryId: 'restaurant', accountId: 'acc2', amount: -110.00, note: '' },
  { id: 'tx057', date: daysAgo(78), merchant: 'Spotify', categoryId: 'entertain', accountId: 'acc2', amount: -54.99, note: '' },
  { id: 'tx058', date: daysAgo(80), merchant: 'Taxi Amarillo', categoryId: 'transport', accountId: 'acc1', amount: -40.00, note: '' },
  { id: 'tx059', date: daysAgo(85), merchant: 'La Torre', categoryId: 'food', accountId: 'acc1', amount: -515.00, note: '' },
  { id: 'tx060', date: daysAgo(88), merchant: 'Dentista Dr. López', categoryId: 'health', accountId: 'acc1', amount: -400.00, note: '' },
];

// Bank statement rows for upload demo (87 entries)
export const MOCK_STATEMENT_ROWS = (() => {
  const merchants = [
    'SUPERMERCADO LA COLONIA', 'WALMART GT', 'GASOLINERA SHELL', 'UBER *TRIP',
    'NETFLIX.COM', 'POLLO CAMPERO', 'FARMACIA GALENO', 'TIGO GUATEMALA',
    'CEMACO', 'PRICESMART', 'CAFE BARISTA', 'EMPRESA ELECTRICA',
    'MCDONALDS', 'SAN MARTIN BAKERY', 'DOMINOS PIZZA', 'CLARO GT',
    'SPOTIFY', 'UBER EATS', 'DESPENSA FAMILIAR', 'CINEPOLIS',
    'MAXIDESPENSA', 'LA TORRE SUPERMERCADO', 'BAC CREDOMATIC',
    'AGUA SALVAVIDAS', 'TAXI AMARILLO EXPRESS'
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
      amount: isIncome ? +(Math.random() * 5000 + 3000).toFixed(2) : -(Math.random() * 500 + 20).toFixed(2),
      type: isIncome ? 'credit' : 'debit',
      balance: +(Math.random() * 10000 + 2000).toFixed(2)
    });
  }
  return rows;
})();

// Receipt OCR result (mock)
export const MOCK_RECEIPT_RESULT = {
  merchant: 'Supermercado La Colonia',
  date: new Date().toISOString().split('T')[0],
  total: 234.50,
  currency: 'GTQ',
  categoryId: 'food',
  items: [
    { name: 'Leche Entera 1L', qty: 2, price: 18.50 },
    { name: 'Pan Integral', qty: 1, price: 24.00 },
    { name: 'Pollo Entero', qty: 1, price: 45.00 },
    { name: 'Arroz 5lb', qty: 1, price: 28.00 },
    { name: 'Frijol Negro 2lb', qty: 2, price: 15.00 },
    { name: 'Aceite Ideal 1L', qty: 1, price: 32.00 },
    { name: 'Huevos (docena)', qty: 1, price: 22.00 },
    { name: 'Tomate Roma lb', qty: 3, price: 8.50 },
  ]
};

// Monthly budget defaults
export const MOCK_BUDGETS = [
  { categoryId: 'food', limit: 3000 },
  { categoryId: 'transport', limit: 1500 },
  { categoryId: 'restaurant', limit: 1000 },
  { categoryId: 'entertain', limit: 800 },
  { categoryId: 'services', limit: 2000 },
  { categoryId: 'health', limit: 1000 },
  { categoryId: 'shopping', limit: 1500 },
];

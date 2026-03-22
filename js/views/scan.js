import store from '../store.js';
import i18n from '../i18n.js';
import { formatCurrency, generateId } from '../utils.js';
import { MOCK_RECEIPT_RESULT, MOCK_STATEMENT_ROWS } from '../mock-data.js';
import toast from '../../components/toast.js';
import router from '../router.js';

export default function renderScan(container) {
  const topBar = document.getElementById('top-bar');
  const settings = store.getSettings();

  topBar.innerHTML = `
    <div class="top-bar__brand">
      <button class="btn-icon" id="scan-close-btn" aria-label="${i18n.t('common.close')}"><i data-lucide="x"></i></button>
      <span class="top-bar__name" style="font-weight:700;">NOMIX</span>
    </div>
    <div class="top-bar__actions">
      <div class="top-bar__avatar">${settings.name.charAt(0)}</div>
    </div>
  `;

  document.getElementById('scan-close-btn')?.addEventListener('click', () => router.navigate('/dashboard'));

  let activeTab = 'camera';

  function render() {
    container.innerHTML = '';

    // 3-tab pills
    const tabs = document.createElement('div');
    tabs.className = 'tab-pills mb-6';
    tabs.innerHTML = `
      <button class="tab-pill ${activeTab === 'camera' ? 'active' : ''}" data-tab="camera">${i18n.t('scan.scanReceipt')}</button>
      <button class="tab-pill ${activeTab === 'upload' ? 'active' : ''}" data-tab="upload">${i18n.t('scan.uploadStatement')}</button>
      <button class="tab-pill ${activeTab === 'manual' ? 'active' : ''}" data-tab="manual">${i18n.t('scan.manual')}</button>
    `;
    tabs.querySelectorAll('.tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });
    container.appendChild(tabs);

    if (activeTab === 'camera') renderCameraTab();
    else if (activeTab === 'upload') renderUploadTab();
    else renderManualTab();
  }

  // ===== CAMERA TAB =====
  function renderCameraTab() {
    const section = document.createElement('div');

    const scanner = document.createElement('div');
    scanner.className = 'scanner-container mb-4';

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    scanner.appendChild(video);

    const overlay = document.createElement('div');
    overlay.className = 'scanner-overlay';
    overlay.innerHTML = `
      <div class="scanner-corner scanner-corner--tl"></div>
      <div class="scanner-corner scanner-corner--tr"></div>
      <div class="scanner-corner scanner-corner--bl"></div>
      <div class="scanner-corner scanner-corner--br"></div>
    `;
    scanner.appendChild(overlay);

    const hint = document.createElement('div');
    hint.className = 'scanner-hint';
    hint.textContent = i18n.t('scan.pointAtReceipt');
    scanner.appendChild(hint);

    section.appendChild(scanner);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'scanner-controls';

    const galleryBtn = document.createElement('button');
    galleryBtn.className = 'btn-icon';
    galleryBtn.innerHTML = '<i data-lucide="image"></i>';
    galleryBtn.setAttribute('aria-label', i18n.t('scan.gallery'));

    const captureBtn = document.createElement('button');
    captureBtn.className = 'capture-btn';
    captureBtn.setAttribute('aria-label', i18n.t('scan.capture'));

    const flashBtn = document.createElement('button');
    flashBtn.className = 'btn-icon';
    flashBtn.innerHTML = '<i data-lucide="zap"></i>';
    flashBtn.setAttribute('aria-label', i18n.t('scan.flash'));

    controls.appendChild(galleryBtn);
    controls.appendChild(captureBtn);
    controls.appendChild(flashBtn);
    scanner.appendChild(controls);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    fileInput.style.display = 'none';
    section.appendChild(fileInput);

    container.appendChild(section);

    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
      } catch {
        scanner.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:var(--space-4);padding:var(--space-6);">
            <i data-lucide="camera-off" style="width:48px;height:48px;color:var(--color-text-dim);"></i>
            <p style="color:var(--color-text-muted);text-align:center;">${i18n.t('scan.cameraError')}</p>
            <button class="btn btn-accent" id="fallback-camera-btn">${i18n.t('scan.takePhoto')}</button>
          </div>
        `;
        document.getElementById('fallback-camera-btn')?.addEventListener('click', () => fileInput.click());
        if (window.lucide) window.lucide.createIcons({ nodes: [scanner] });
      }
    }

    function stopCamera() {
      if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    }

    captureBtn.addEventListener('click', () => {
      if (stream) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        canvas.getContext('2d').drawImage(video, 0, 0);
        stopCamera();
        showReview(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        fileInput.click();
      }
    });

    galleryBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { stopCamera(); showReview(ev.target.result); };
      reader.readAsDataURL(file);
    });

    startCamera();

    const cleanup = () => { stopCamera(); window.removeEventListener('route:changed', cleanup); };
    window.addEventListener('route:changed', cleanup);

    if (window.lucide) window.lucide.createIcons({ nodes: [section] });
  }

  function showReview(imageDataUrl) {
    container.innerHTML = '';

    const preview = document.createElement('div');
    preview.className = 'card mb-4';
    preview.innerHTML = `<img src="${imageDataUrl}" style="width:100%;border-radius:var(--radius-sm);max-height:300px;object-fit:cover;">`;
    container.appendChild(preview);

    const loading = document.createElement('div');
    loading.className = 'card mb-4';
    loading.style.textAlign = 'center';
    loading.style.padding = 'var(--space-8)';
    loading.innerHTML = `<div class="spinner" style="margin:0 auto var(--space-4);"></div><p style="color:var(--color-text-muted);">${i18n.t('scan.analyzing')}</p>`;
    container.appendChild(loading);

    setTimeout(() => { loading.remove(); showExtractedData(); }, 2000);
  }

  function showExtractedData() {
    const result = MOCK_RECEIPT_RESULT;
    const catName = i18n.t(`category.${result.categoryId}`);

    const card = document.createElement('div');
    card.className = 'card mb-4 animate-scale-in';
    card.innerHTML = `
      <h3 style="font-family:var(--font-display);font-weight:600;font-size:16px;margin-bottom:var(--space-4);">${i18n.t('scan.extractedData')}</h3>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--color-text-muted);">${i18n.t('scan.merchant')}</span><span style="font-weight:500;">${result.merchant}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--color-text-muted);">${i18n.t('scan.date')}</span><span>${result.date}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--color-text-muted);">${i18n.t('scan.total')}</span><span style="font-family:var(--font-mono);font-weight:500;font-size:18px;color:var(--color-accent);">${formatCurrency(result.total)}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--color-text-muted);">${i18n.t('scan.category')}</span><span>🛒 ${catName}</span></div>
      </div>
      <details style="margin-top:var(--space-4);"><summary style="cursor:pointer;color:var(--color-accent);font-size:13px;">${i18n.t('scan.viewItems')} (${result.items.length})</summary>
        <div style="margin-top:var(--space-3);">${result.items.map(item => `
          <div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border);font-size:13px;"><span>${item.name} x${item.qty}</span><span style="font-family:var(--font-mono);">${formatCurrency(item.qty * item.price)}</span></div>
        `).join('')}</div>
      </details>
    `;
    container.appendChild(card);

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:var(--space-3);';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-ghost';
    retryBtn.style.flex = '1';
    retryBtn.textContent = i18n.t('common.retry');
    retryBtn.addEventListener('click', () => render());

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-accent';
    confirmBtn.style.flex = '1';
    confirmBtn.textContent = i18n.t('scan.confirmSave');
    confirmBtn.addEventListener('click', () => {
      store.addTransaction({
        id: generateId(), date: new Date(result.date).toISOString(),
        merchant: result.merchant, categoryId: result.categoryId,
        accountId: 'acc1', amount: -result.total, note: '',
      });
      toast.show({ message: i18n.t('scan.txSaved'), type: 'success' });
      router.navigate('/dashboard');
    });

    actions.appendChild(retryBtn);
    actions.appendChild(confirmBtn);
    container.appendChild(actions);
  }

  // ===== UPLOAD TAB =====
  function renderUploadTab() {
    const section = document.createElement('div');

    const zone = document.createElement('div');
    zone.className = 'upload-zone mb-6';
    zone.innerHTML = `
      <div class="upload-zone__icon">📄</div>
      <div class="upload-zone__title">${i18n.t('scan.dragStatement')}</div>
      <p class="upload-zone__hint">${i18n.t('scan.orTapSelect')}</p>
      <p class="upload-zone__hint">${i18n.t('scan.fileFormats')}</p>
    `;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.csv,.xlsx,.xls,.txt';
    fileInput.style.display = 'none';

    zone.addEventListener('click', () => fileInput.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('dragover'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });

    section.appendChild(zone);
    section.appendChild(fileInput);

    const formats = document.createElement('div');
    formats.className = 'mb-4';
    formats.innerHTML = `
      <p style="font-size:13px;color:var(--color-text-muted);margin-bottom:var(--space-3);">${i18n.t('scan.compatibleFormats')}</p>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
        ${['Banco Popular', 'Banreservas', 'BHD León', 'Scotiabank', 'BAC', 'American Express', 'Visa', 'Mastercard'].map(b => `<span class="chip">${b}</span>`).join('')}
      </div>
    `;
    section.appendChild(formats);
    container.appendChild(section);
  }

  function handleFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      toast.show({ message: i18n.t('scan.fileTooLarge'), type: 'error' });
      return;
    }

    container.innerHTML = '';
    const ext = file.name.split('.').pop().toLowerCase();
    const typeIcons = { pdf: '📕', csv: '📊', xlsx: '📗', xls: '📗', txt: '📝' };

    const fileCard = document.createElement('div');
    fileCard.className = 'card mb-4';
    fileCard.innerHTML = `
      <div style="display:flex;align-items:center;gap:var(--space-3);">
        <span style="font-size:32px;">${typeIcons[ext] || '📄'}</span>
        <div>
          <div style="font-weight:500;">${file.name}</div>
          <div style="font-size:12px;color:var(--color-text-muted);">${(file.size / 1024).toFixed(1)} KB · ${ext.toUpperCase()}</div>
        </div>
      </div>
    `;
    container.appendChild(fileCard);

    const progressCard = document.createElement('div');
    progressCard.className = 'card mb-4';
    progressCard.innerHTML = `
      <p style="font-size:14px;margin-bottom:var(--space-3);">${i18n.t('scan.processingFile')}</p>
      <div class="progress"><div class="progress-bar" id="upload-progress" style="width:0%;"></div></div>
      <p style="font-size:12px;color:var(--color-text-muted);margin-top:var(--space-2);" id="progress-text">0%</p>
    `;
    container.appendChild(progressCard);

    const bar = progressCard.querySelector('#upload-progress');
    const text = progressCard.querySelector('#progress-text');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) { progress = 100; clearInterval(interval); setTimeout(() => showParsedResults(), 300); }
      bar.style.width = progress + '%';
      text.textContent = Math.floor(progress) + '%';
    }, 200);
  }

  function showParsedResults() {
    container.innerHTML = '';
    const rows = MOCK_STATEMENT_ROWS;
    const firstDate = rows[rows.length - 1].date;
    const lastDate = rows[0].date;

    const summary = document.createElement('div');
    summary.className = 'card mb-4 animate-scale-in';
    summary.innerHTML = `
      <h3 style="font-family:var(--font-display);font-weight:600;font-size:16px;margin-bottom:var(--space-3);">${i18n.t('scan.analysisResults')}</h3>
      <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
        <div class="pill pill-income" style="font-size:14px;padding:var(--space-2) var(--space-3);">${rows.length} ${i18n.t('scan.txFound')}</div>
        <div class="badge">${i18n.t('scan.period')} ${firstDate} — ${lastDate}</div>
      </div>
    `;
    container.appendChild(summary);

    const table = document.createElement('div');
    table.className = 'card mb-4';
    table.innerHTML = `
      <h4 style="font-size:14px;font-weight:500;margin-bottom:var(--space-3);">${i18n.t('scan.preview')}</h4>
      <div style="overflow-x:auto;">
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <thead><tr style="border-bottom:1px solid var(--color-border);color:var(--color-text-muted);">
            <th style="text-align:left;padding:var(--space-2);">${i18n.t('scan.dateHeader')}</th>
            <th style="text-align:left;padding:var(--space-2);">${i18n.t('scan.descHeader')}</th>
            <th style="text-align:right;padding:var(--space-2);">${i18n.t('scan.amountHeader')}</th>
            <th style="text-align:center;padding:var(--space-2);">${i18n.t('scan.typeHeader')}</th>
          </tr></thead>
          <tbody>${rows.slice(0, 5).map(r => `
            <tr style="border-bottom:1px solid var(--color-border);">
              <td style="padding:var(--space-2);white-space:nowrap;">${r.date}</td>
              <td style="padding:var(--space-2);">${r.description}</td>
              <td style="padding:var(--space-2);text-align:right;font-family:var(--font-mono);color:${r.amount > 0 ? 'var(--color-income)' : 'var(--color-expense)'};">${formatCurrency(r.amount)}</td>
              <td style="padding:var(--space-2);text-align:center;"><span class="pill ${r.type === 'credit' ? 'pill-income' : 'pill-expense'}">${r.type === 'credit' ? i18n.t('add.income') : i18n.t('add.expense')}</span></td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
    container.appendChild(table);

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:var(--space-3);';

    const reviewBtn = document.createElement('button');
    reviewBtn.className = 'btn btn-ghost';
    reviewBtn.style.flex = '1';
    reviewBtn.textContent = i18n.t('scan.reviewEdit');
    reviewBtn.addEventListener('click', () => render());

    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-accent';
    importBtn.style.flex = '1';
    importBtn.textContent = i18n.t('scan.importAll');
    importBtn.addEventListener('click', () => {
      const txs = rows.map((r, idx) => ({
        id: generateId() + idx, date: new Date(r.date).toISOString(),
        merchant: r.description, categoryId: r.amount > 0 ? 'income' : ['food', 'transport', 'services', 'restaurant', 'shopping'][idx % 5],
        accountId: 'acc1', amount: r.amount, note: '',
      }));
      store.addTransactions(txs);

      container.innerHTML = `
        <div class="card" style="text-align:center;padding:var(--space-10);">
          <div style="font-size:48px;margin-bottom:var(--space-4);">✅</div>
          <h3 style="font-family:var(--font-display);font-weight:600;font-size:20px;margin-bottom:var(--space-3);">${i18n.t('scan.importSuccess')}</h3>
          <p style="color:var(--color-text-muted);margin-bottom:var(--space-6);">${rows.length} ${i18n.t('scan.txImported')}</p>
          <button class="btn btn-accent btn-lg" onclick="location.hash='#/transactions'">${i18n.t('scan.viewTx')}</button>
        </div>
      `;
      toast.show({ message: `${rows.length} ${i18n.t('scan.txImportedToast')}`, type: 'success' });
    });

    actions.appendChild(reviewBtn);
    actions.appendChild(importBtn);
    container.appendChild(actions);
  }

  // ===== MANUAL TAB =====
  function renderManualTab() {
    const section = document.createElement('div');
    section.className = 'manual-add-form';

    let txType = 'expense';
    let selectedCategory = null;

    const categories = store.getCategories();
    const accounts = store.getAccounts();

    const catIcons = {
      food: '🛒', transport: '🚗', health: '💊', entertain: '🎬',
      restaurant: '🍽️', services: '⚡', shopping: '🛍️', income: '💰'
    };

    section.innerHTML = `
      <div class="add-header">${i18n.t('add.title')}</div>

      <div class="type-toggle mb-6">
        <button class="type-toggle__btn type-toggle__btn--expense active" data-type="expense">
          <i data-lucide="arrow-down-circle" style="width:16px;height:16px"></i> ${i18n.t('add.expense')}
        </button>
        <button class="type-toggle__btn type-toggle__btn--income" data-type="income">
          <i data-lucide="arrow-up-circle" style="width:16px;height:16px"></i> ${i18n.t('add.income')}
        </button>
      </div>

      <div class="add-amount-label">${i18n.t('add.amount')}</div>
      <div class="add-amount-display mb-6">
        <span class="add-amount-symbol">$</span>
        <input type="number" class="add-amount-input" id="manual-amount" placeholder="0.00" step="0.01" min="0" inputmode="decimal">
      </div>

      <div class="add-field-label">${i18n.t('add.description')}</div>
      <div class="add-input-row mb-6">
        <i data-lucide="align-left" style="width:18px;height:18px;color:var(--color-text-dim);"></i>
        <input type="text" class="add-text-input" id="manual-merchant" placeholder="${i18n.t('add.descPlaceholder')}">
      </div>

      <div class="add-field-label">${i18n.t('add.category')}</div>
      <div class="add-category-grid mb-6" id="manual-category-grid"></div>

      <div class="add-field-label">${i18n.t('add.date')}</div>
      <div class="add-select-row mb-4">
        <i data-lucide="calendar" style="width:18px;height:18px;color:var(--color-accent);"></i>
        <input type="date" class="add-select-input" id="manual-date" value="${new Date().toISOString().split('T')[0]}">
      </div>

      <div class="add-field-label">${i18n.t('add.account')}</div>
      <div class="add-select-row mb-6">
        <span style="font-size:18px;">🏦</span>
        <select class="add-select-input" id="manual-account">
          ${accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
        </select>
      </div>

      <button class="btn btn-accent btn-lg btn-block add-save-btn" id="manual-save">
        <i data-lucide="check-circle" style="width:20px;height:20px"></i> ${i18n.t('add.save')}
      </button>
    `;

    container.appendChild(section);

    // Category grid
    function renderCategoryGrid(type) {
      const grid = section.querySelector('#manual-category-grid');
      const cats = categories.filter(c => type === 'income' ? c.id === 'income' : c.id !== 'income');
      grid.innerHTML = cats.map(c => `
        <button class="add-category-btn" data-id="${c.id}">
          <span class="add-category-btn__icon">${catIcons[c.id] || '❓'}</span>
          <span class="add-category-btn__label">${i18n.t(`category.short.${c.id}`) !== `category.short.${c.id}` ? i18n.t(`category.short.${c.id}`) : c.name.toUpperCase()}</span>
        </button>
      `).join('');

      grid.querySelectorAll('.add-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          grid.querySelectorAll('.add-category-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedCategory = btn.dataset.id;
        });
      });
    }

    renderCategoryGrid('expense');

    // Type toggle
    const toggleBtns = section.querySelectorAll('.type-toggle__btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        txType = btn.dataset.type;
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = null;
        renderCategoryGrid(txType);
        if (window.lucide) window.lucide.createIcons({ nodes: [section] });
      });
    });

    // Save
    section.querySelector('#manual-save').addEventListener('click', () => {
      const amount = parseFloat(section.querySelector('#manual-amount').value);
      const merchant = section.querySelector('#manual-merchant').value;
      const date = section.querySelector('#manual-date').value;
      const accountId = section.querySelector('#manual-account').value;

      if (!amount || !merchant || !selectedCategory) {
        toast.show({ message: i18n.t('add.fillAll'), type: 'error' });
        return;
      }

      store.addTransaction({
        id: generateId(),
        date: new Date(date).toISOString(),
        merchant,
        categoryId: selectedCategory,
        accountId,
        amount: txType === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        note: '',
      });

      toast.show({ message: i18n.t('add.saved'), type: 'success' });
      router.navigate('/transactions');
    });

    if (window.lucide) window.lucide.createIcons({ nodes: [section] });
  }

  render();
  if (window.lucide) window.lucide.createIcons({ nodes: [topBar] });
}

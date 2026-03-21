import store from '../store.js';
import { formatCurrency, generateId } from '../utils.js';
import { MOCK_RECEIPT_RESULT, MOCK_STATEMENT_ROWS } from '../mock-data.js';
import toast from '../../components/toast.js';
import router from '../router.js';

export default function renderScan(container) {
  const topBar = document.getElementById('top-bar');
  topBar.innerHTML = `<div class="top-bar__greeting">Escanear / Cargar</div>`;

  let activeTab = 'camera';

  function render() {
    container.innerHTML = '';

    // Sub-tabs
    const tabs = document.createElement('div');
    tabs.className = 'tab-pills mb-6';
    tabs.innerHTML = `
      <button class="tab-pill ${activeTab === 'camera' ? 'active' : ''}" data-tab="camera">📷 Escanear Recibo</button>
      <button class="tab-pill ${activeTab === 'upload' ? 'active' : ''}" data-tab="upload">📄 Cargar Estado</button>
    `;
    tabs.querySelectorAll('.tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });
    container.appendChild(tabs);

    if (activeTab === 'camera') {
      renderCameraTab();
    } else {
      renderUploadTab();
    }
  }

  function renderCameraTab() {
    const section = document.createElement('div');

    // Scanner container
    const scanner = document.createElement('div');
    scanner.className = 'scanner-container mb-4';

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    scanner.appendChild(video);

    // Scanner overlay with corner brackets
    const overlay = document.createElement('div');
    overlay.className = 'scanner-overlay';
    overlay.innerHTML = `
      <div class="scanner-corner scanner-corner--tl"></div>
      <div class="scanner-corner scanner-corner--tr"></div>
      <div class="scanner-corner scanner-corner--bl"></div>
      <div class="scanner-corner scanner-corner--br"></div>
    `;
    scanner.appendChild(overlay);

    // Hint text
    const hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;bottom:20%;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.7);font-size:14px;text-align:center;';
    hint.textContent = 'Apunta al recibo';
    scanner.appendChild(hint);

    section.appendChild(scanner);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'scanner-controls';

    // Gallery button
    const galleryBtn = document.createElement('button');
    galleryBtn.className = 'btn-icon';
    galleryBtn.innerHTML = '<i data-lucide="image"></i>';
    galleryBtn.setAttribute('aria-label', 'Galería');

    // Capture button
    const captureBtn = document.createElement('button');
    captureBtn.className = 'capture-btn';
    captureBtn.setAttribute('aria-label', 'Capturar');

    // Flash button
    const flashBtn = document.createElement('button');
    flashBtn.className = 'btn-icon';
    flashBtn.innerHTML = '<i data-lucide="zap"></i>';
    flashBtn.setAttribute('aria-label', 'Flash');

    controls.appendChild(galleryBtn);
    controls.appendChild(captureBtn);
    controls.appendChild(flashBtn);
    section.appendChild(controls);

    // Hidden file input fallback
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    fileInput.style.display = 'none';
    section.appendChild(fileInput);

    container.appendChild(section);

    // Camera logic
    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        video.srcObject = stream;
      } catch {
        // Fallback - show file input button
        scanner.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:var(--space-4);padding:var(--space-6);">
            <i data-lucide="camera-off" style="width:48px;height:48px;color:var(--color-text-dim);"></i>
            <p style="color:var(--color-text-muted);text-align:center;">No se pudo acceder a la cámara</p>
            <button class="btn btn-accent" id="fallback-camera-btn">📷 Tomar foto</button>
          </div>
        `;
        document.getElementById('fallback-camera-btn')?.addEventListener('click', () => fileInput.click());
        if (window.lucide) window.lucide.createIcons({ nodes: [scanner] });
      }
    }

    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
      }
    }

    function capturePhoto() {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      showReview(dataUrl);
    }

    captureBtn.addEventListener('click', () => {
      if (stream) {
        capturePhoto();
      } else {
        fileInput.click();
      }
    });

    galleryBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        stopCamera();
        showReview(ev.target.result);
      };
      reader.readAsDataURL(file);
    });

    startCamera();

    // Cleanup on route change
    const cleanup = () => {
      stopCamera();
      window.removeEventListener('route:changed', cleanup);
    };
    window.addEventListener('route:changed', cleanup);

    if (window.lucide) window.lucide.createIcons({ nodes: [section] });
  }

  function showReview(imageDataUrl) {
    container.innerHTML = '';

    // Image preview
    const preview = document.createElement('div');
    preview.className = 'card mb-4';
    preview.innerHTML = `<img src="${imageDataUrl}" style="width:100%;border-radius:var(--radius-sm);max-height:300px;object-fit:cover;">`;
    container.appendChild(preview);

    // Loading state
    const loading = document.createElement('div');
    loading.className = 'card mb-4';
    loading.style.textAlign = 'center';
    loading.style.padding = 'var(--space-8)';
    loading.innerHTML = `
      <div class="spinner" style="margin:0 auto var(--space-4);"></div>
      <p style="color:var(--color-text-muted);">Analizando recibo…</p>
    `;
    container.appendChild(loading);

    // Mock OCR delay
    setTimeout(() => {
      loading.remove();
      showExtractedData();
    }, 2000);
  }

  function showExtractedData() {
    const result = MOCK_RECEIPT_RESULT;

    const card = document.createElement('div');
    card.className = 'card mb-4 animate-scale-in';

    card.innerHTML = `
      <h3 style="font-family:var(--font-display);font-weight:600;font-size:16px;margin-bottom:var(--space-4);">Datos extraídos</h3>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        <div style="display:flex;justify-content:space-between;">
          <span style="color:var(--color-text-muted);">Comercio</span>
          <span style="font-weight:500;">${result.merchant}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:var(--color-text-muted);">Fecha</span>
          <span>${result.date}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:var(--color-text-muted);">Total</span>
          <span style="font-family:var(--font-mono);font-weight:500;font-size:18px;color:var(--color-accent);">${formatCurrency(result.total)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:var(--color-text-muted);">Categoría</span>
          <span>🛒 Alimentación</span>
        </div>
      </div>
      <details style="margin-top:var(--space-4);">
        <summary style="cursor:pointer;color:var(--color-accent);font-size:13px;">Ver artículos (${result.items.length})</summary>
        <div style="margin-top:var(--space-3);">
          ${result.items.map(item => `
            <div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border);font-size:13px;">
              <span>${item.name} x${item.qty}</span>
              <span style="font-family:var(--font-mono);">${formatCurrency(item.qty * item.price)}</span>
            </div>
          `).join('')}
        </div>
      </details>
    `;

    container.appendChild(card);

    // Action buttons
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:var(--space-3);';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-ghost';
    retryBtn.style.flex = '1';
    retryBtn.textContent = 'Reintentar';
    retryBtn.addEventListener('click', () => render());

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-accent';
    confirmBtn.style.flex = '1';
    confirmBtn.textContent = 'Confirmar y Guardar';
    confirmBtn.addEventListener('click', () => {
      store.addTransaction({
        id: generateId(),
        date: new Date(result.date).toISOString(),
        merchant: result.merchant,
        categoryId: result.categoryId,
        accountId: 'acc1',
        amount: -result.total,
        note: 'Escaneado con cámara',
      });
      toast.show({ message: 'Transacción guardada', type: 'success' });
      router.navigate('/dashboard');
    });

    actions.appendChild(retryBtn);
    actions.appendChild(confirmBtn);
    container.appendChild(actions);
  }

  function renderUploadTab() {
    const section = document.createElement('div');

    // Upload zone
    const zone = document.createElement('div');
    zone.className = 'upload-zone mb-6';
    zone.innerHTML = `
      <div class="upload-zone__icon">📄</div>
      <div class="upload-zone__title">Arrastra tu estado de cuenta aquí</div>
      <p class="upload-zone__hint">o toca para seleccionar</p>
      <p class="upload-zone__hint">PDF, CSV, XLS — Hasta 10MB</p>
    `;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.csv,.xlsx,.xls,.txt';
    fileInput.style.display = 'none';

    zone.addEventListener('click', () => fileInput.click());

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });

    section.appendChild(zone);
    section.appendChild(fileInput);

    // Compatible formats
    const formats = document.createElement('div');
    formats.className = 'mb-4';
    formats.innerHTML = `
      <p style="font-size:13px;color:var(--color-text-muted);margin-bottom:var(--space-3);">Formatos compatibles:</p>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
        ${['Banco Santander', 'BBVA', 'Banorte', 'Banamex', 'Banco de Guatemala', 'Banrural', 'BAC', 'American Express', 'Visa', 'Mastercard']
          .map(b => `<span class="chip">${b}</span>`).join('')}
      </div>
    `;
    section.appendChild(formats);
    container.appendChild(section);
  }

  function handleFile(file) {
    // Validate size
    if (file.size > 10 * 1024 * 1024) {
      toast.show({ message: 'El archivo excede 10MB', type: 'error' });
      return;
    }

    container.innerHTML = '';

    // File info
    const typeIcons = { pdf: '📕', csv: '📊', xlsx: '📗', xls: '📗', txt: '📝' };
    const ext = file.name.split('.').pop().toLowerCase();

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

    // Progress bar
    const progressCard = document.createElement('div');
    progressCard.className = 'card mb-4';
    progressCard.innerHTML = `
      <p style="font-size:14px;margin-bottom:var(--space-3);">Procesando archivo...</p>
      <div class="progress">
        <div class="progress-bar" id="upload-progress" style="width:0%;"></div>
      </div>
      <p style="font-size:12px;color:var(--color-text-muted);margin-top:var(--space-2);" id="progress-text">0%</p>
    `;
    container.appendChild(progressCard);

    // Animate progress
    const bar = progressCard.querySelector('#upload-progress');
    const text = progressCard.querySelector('#progress-text');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => showParsedResults(), 300);
      }
      bar.style.width = progress + '%';
      text.textContent = Math.floor(progress) + '%';
    }, 200);
  }

  function showParsedResults() {
    container.innerHTML = '';

    const rows = MOCK_STATEMENT_ROWS;

    // Summary
    const summary = document.createElement('div');
    summary.className = 'card mb-4 animate-scale-in';

    const firstDate = rows[rows.length - 1].date;
    const lastDate = rows[0].date;

    summary.innerHTML = `
      <h3 style="font-family:var(--font-display);font-weight:600;font-size:16px;margin-bottom:var(--space-3);">Resultados del análisis</h3>
      <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
        <div class="pill pill-income" style="font-size:14px;padding:var(--space-2) var(--space-3);">
          ${rows.length} transacciones encontradas
        </div>
        <div class="badge">Periodo: ${firstDate} — ${lastDate}</div>
      </div>
    `;
    container.appendChild(summary);

    // Preview table
    const table = document.createElement('div');
    table.className = 'card mb-4';
    table.innerHTML = `
      <h4 style="font-size:14px;font-weight:500;margin-bottom:var(--space-3);">Vista previa (primeras 5)</h4>
      <div style="overflow-x:auto;">
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border);color:var(--color-text-muted);">
              <th style="text-align:left;padding:var(--space-2);">Fecha</th>
              <th style="text-align:left;padding:var(--space-2);">Descripción</th>
              <th style="text-align:right;padding:var(--space-2);">Monto</th>
              <th style="text-align:center;padding:var(--space-2);">Tipo</th>
            </tr>
          </thead>
          <tbody>
            ${rows.slice(0, 5).map(r => `
              <tr style="border-bottom:1px solid var(--color-border);">
                <td style="padding:var(--space-2);white-space:nowrap;">${r.date}</td>
                <td style="padding:var(--space-2);">${r.description}</td>
                <td style="padding:var(--space-2);text-align:right;font-family:var(--font-mono);color:${r.amount > 0 ? 'var(--color-income)' : 'var(--color-expense)'};">
                  ${formatCurrency(r.amount)}
                </td>
                <td style="padding:var(--space-2);text-align:center;">
                  <span class="pill ${r.type === 'credit' ? 'pill-income' : 'pill-expense'}">${r.type === 'credit' ? 'Ingreso' : 'Gasto'}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.appendChild(table);

    // Actions
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:var(--space-3);';

    const reviewBtn = document.createElement('button');
    reviewBtn.className = 'btn btn-ghost';
    reviewBtn.style.flex = '1';
    reviewBtn.textContent = 'Revisar y Editar';
    reviewBtn.addEventListener('click', () => render());

    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-accent';
    importBtn.style.flex = '1';
    importBtn.textContent = 'Importar Todo';
    importBtn.addEventListener('click', () => {
      // Convert statement rows to transactions
      const txs = rows.map((r, i) => ({
        id: generateId() + i,
        date: new Date(r.date).toISOString(),
        merchant: r.description,
        categoryId: r.amount > 0 ? 'income' : ['food', 'transport', 'services', 'restaurant', 'shopping'][i % 5],
        accountId: 'acc1',
        amount: r.amount,
        note: 'Importado desde estado de cuenta',
      }));

      store.addTransactions(txs);

      // Success screen
      container.innerHTML = `
        <div class="card" style="text-align:center;padding:var(--space-10);">
          <div style="font-size:48px;margin-bottom:var(--space-4);">✅</div>
          <h3 style="font-family:var(--font-display);font-weight:600;font-size:20px;margin-bottom:var(--space-3);">¡Importación exitosa!</h3>
          <p style="color:var(--color-text-muted);margin-bottom:var(--space-6);">${rows.length} transacciones importadas correctamente</p>
          <button class="btn btn-accent btn-lg" onclick="location.hash='#/transactions'">Ver movimientos</button>
        </div>
      `;

      toast.show({ message: `${rows.length} transacciones importadas`, type: 'success' });
    });

    actions.appendChild(reviewBtn);
    actions.appendChild(importBtn);
    container.appendChild(actions);
  }

  render();
}

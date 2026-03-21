const darkThemeDefaults = {
  color: '#EFF2F7',
  borderColor: 'rgba(255,255,255,0.07)',
  font: { family: "'Inter', sans-serif" },
};

function applyDarkTheme() {
  if (!window.Chart) return;
  Chart.defaults.color = darkThemeDefaults.color;
  Chart.defaults.borderColor = darkThemeDefaults.borderColor;
  Chart.defaults.font.family = darkThemeDefaults.font.family;
}

// Track chart instances for cleanup
const chartInstances = new Map();

function destroyChart(canvasId) {
  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }
}

export function createDonutChart(canvas, data) {
  applyDarkTheme();
  const id = canvas.id || Math.random().toString(36);
  destroyChart(id);

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: data.colors,
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#162038',
          titleFont: { family: "'DM Sans', sans-serif", weight: 600 },
          bodyFont: { family: "'JetBrains Mono', monospace" },
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        }
      },
      animation: {
        animateRotate: true,
        duration: 800,
      }
    }
  });

  chartInstances.set(id, chart);
  return chart;
}

export function createBarChart(canvas, data) {
  applyDarkTheme();
  const id = canvas.id || Math.random().toString(36);
  destroyChart(id);

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Ingresos',
          data: data.income,
          backgroundColor: '#00E5C4',
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        },
        {
          label: 'Gastos',
          data: data.expenses,
          backgroundColor: '#FF4D6D',
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            font: { size: 11 },
            callback: (v) => v >= 1000 ? (v / 1000) + 'k' : v,
          },
          beginAtZero: true,
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 16,
            font: { size: 12 },
          }
        },
        tooltip: {
          backgroundColor: '#162038',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        }
      },
      animation: { duration: 600 },
    }
  });

  chartInstances.set(id, chart);
  return chart;
}

export function createLineChart(canvas, data) {
  applyDarkTheme();
  const id = canvas.id || Math.random().toString(36);
  destroyChart(id);

  const datasets = [{
    label: data.label || 'Gastos',
    data: data.values,
    borderColor: '#00E5C4',
    backgroundColor: 'rgba(0,229,196,0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#00E5C4',
    borderWidth: 2,
  }];

  if (data.averageValues) {
    datasets.push({
      label: 'Promedio',
      data: data.averageValues,
      borderColor: '#7A8BA0',
      borderDash: [5, 5],
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
      tension: 0,
    });
  }

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            font: { size: 11 },
            callback: (v) => v >= 1000 ? (v / 1000) + 'k' : v,
          },
          beginAtZero: true,
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            padding: 16,
            font: { size: 12 },
          }
        },
        tooltip: {
          backgroundColor: '#162038',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        }
      },
      animation: { duration: 600 },
    }
  });

  chartInstances.set(id, chart);
  return chart;
}

export function destroyAllCharts() {
  chartInstances.forEach(chart => chart.destroy());
  chartInstances.clear();
}

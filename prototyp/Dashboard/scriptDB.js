if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html";
}

// Widget-Definitionen
const AVAILABLE_WIDGETS = [
  {
    id: 'buchungen',
    name: 'Gesamtzahl der Buchungen',
    type: 'stat',
    enabled: true,
    data: {
      number: '1.245',
      label: '+12,5%'
    }
  },
  {
    id: 'umsatz',
    name: 'Umsatz',
    type: 'stat',
    enabled: true,
    data: {
      number: '€45.200',
      label: 'Diesen Monat'
    }
  },
  {
    id: 'gewinn',
    name: 'Gewinn',
    type: 'stat',
    enabled: true,
    data: {
      number: '+12,5%',
      label: 'Monat über Monat'
    }
  },
  {
    id: 'finanzubersicht',
    name: 'Finanzübersicht',
    type: 'chart',
    enabled: true,
    large: true
  },
  {
    id: 'ausgaben',
    name: 'Ausgaben',
    type: 'stat',
    enabled: true,
    data: {
      number: '€12.400',
      label: 'Diesen Monat'
    }
  }
];

// Widget-Konfiguration aus localStorage laden
function loadWidgetConfig() {
  const saved = localStorage.getItem('dashboardWidgets');
  if (saved) {
    const config = JSON.parse(saved);
    AVAILABLE_WIDGETS.forEach(widget => {
      widget.enabled = config[widget.id] !== false;
    });
  }
}

// Widget-Konfiguration speichern
function saveWidgetConfig() {
  const config = {};
  AVAILABLE_WIDGETS.forEach(widget => {
    config[widget.id] = widget.enabled;
  });
  localStorage.setItem('dashboardWidgets', JSON.stringify(config));
}

// Dashboard rendern
function renderDashboard() {
  const grid = document.getElementById('dashboardGrid');
  grid.innerHTML = '';

  AVAILABLE_WIDGETS.forEach(widget => {
    if (!widget.enabled) return;

    const widgetEl = document.createElement('div');
    widgetEl.className = `widget ${widget.type === 'stat' ? 'widget-stat' : ''} ${widget.large ? 'widget-large' : ''}`;
    widgetEl.id = `widget-${widget.id}`;

    if (widget.type === 'stat') {
      widgetEl.innerHTML = `
        <div class="widget-header">
          <h3>${widget.name}</h3>
        </div>
        <div class="widget-content">
          <div class="stat-number">${widget.data.number}</div>
          <div class="stat-label">${widget.data.label}</div>
        </div>
      `;
    } else if (widget.type === 'chart') {
      widgetEl.innerHTML = `
        <div class="widget-header">
          <h3>${widget.name}</h3>
          <div class="widget-controls">
            <button class="chart-btn" onclick="FinancialChart.setView(0)">Jahr</button>
            <button class="chart-btn" onclick="FinancialChart.setView(1)">Quartal</button>
            <button class="chart-btn active" onclick="FinancialChart.setView(2)">Monat</button>
          </div>
        </div>
        <div class="widget-content" style="height: 300px;">
          <p id="chartViewLabel" style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Monatliche Ansicht</p>
          <canvas id="financialChart" style="height: 250px;"></canvas>
        </div>
      `;
    }

    grid.appendChild(widgetEl);
  });

  // Chart initialisieren, wenn vorhanden
  if (AVAILABLE_WIDGETS.find(w => w.id === 'finanzubersicht' && w.enabled)) {
    FinancialChart.init();
  }
}

// Modal für Widget-Verwaltung öffnen
function openWidgetManager() {
  const modal = document.getElementById('widgetModal');
  const container = document.getElementById('widgetCheckboxes');
  container.innerHTML = '';

  AVAILABLE_WIDGETS.forEach(widget => {
    const label = document.createElement('label');
    label.className = 'widget-checkbox-label';
    label.innerHTML = `
      <input type="checkbox" class="widget-checkbox" data-widget-id="${widget.id}" ${widget.enabled ? 'checked' : ''}>
      <span>${widget.name}</span>
    `;
    container.appendChild(label);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

// Modal schließen
function closeWidgetManager() {
  const modal = document.getElementById('widgetModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

// Widgets speichern
function saveWidgets() {
  const checkboxes = document.querySelectorAll('.widget-checkbox');
  checkboxes.forEach(checkbox => {
    const widgetId = checkbox.dataset.widgetId;
    const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
    if (widget) {
      widget.enabled = checkbox.checked;
    }
  });

  saveWidgetConfig();
  renderDashboard();
  closeWidgetManager();
}

// Financial Chart Module
const FinancialChart = {
  data: {
    einnahmen: [
      [0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,350,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,700,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    ausgaben: [
      [0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,70,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },

  chart: null,
  currentView: 2,

  getYearData: function(arr) {
    return arr.map(row => row.reduce((a, b) => a + b, 0));
  },

  getQuarterData: function(arr) {
    return [0,1,2,3].map(q => arr.slice(q*3, q*3+3).flat().reduce((a,b)=>a+b,0));
  },

  getMonthData: function(arr) {
    return arr[0];
  },

  setView: function(viewType) {
    this.currentView = viewType;
    let xData, yDataE, yDataA, viewLabel;

    switch(viewType) {
      case 0: // Year
        xData = Array.from({length: 12}, (_, i) => i + 1);
        yDataE = this.getYearData(this.data.einnahmen);
        yDataA = this.getYearData(this.data.ausgaben);
        viewLabel = 'Jährliche Ansicht';
        break;
      case 1: // Quarter
        xData = ['Q1','Q2','Q3','Q4'];
        yDataE = this.getQuarterData(this.data.einnahmen);
        yDataA = this.getQuarterData(this.data.ausgaben);
        viewLabel = 'Vierteljährliche Ansicht';
        break;
      case 2: // Month
        xData = Array.from({length: 31}, (_, i) => i + 1);
        yDataE = this.getMonthData(this.data.einnahmen);
        yDataA = this.getMonthData(this.data.ausgaben);
        viewLabel = 'Monatliche Ansicht';
        break;
    }

    // Update chart
    const yMin = Math.min(...yDataE, ...yDataA);
    const yMax = Math.max(...yDataE, ...yDataA);
    
    this.chart.data.labels = xData;
    this.chart.data.datasets[0].data = yDataE;
    this.chart.data.datasets[1].data = yDataA;
    this.chart.options.scales.yAxes[0].ticks.min = yMin;
    this.chart.options.scales.yAxes[0].ticks.max = yMax;
    this.chart.update();

    // Update label
    const label = document.getElementById('chartViewLabel');
    if (label) label.textContent = viewLabel;

    // Update button states
    document.querySelectorAll('.chart-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === viewType);
    });
  },

  init: function() {
    const canvas = document.getElementById('financialChart');
    if (!canvas) return;

    const yDataE = this.getMonthData(this.data.einnahmen);
    const yDataA = this.getMonthData(this.data.ausgaben);
    const yMin = Math.min(...yDataE, ...yDataA);
    const yMax = Math.max(...yDataE, ...yDataA);

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: Array.from({length: 31}, (_, i) => i + 1),
        datasets: [
          {
            label: 'Einnahmen',
            fill: false,
            lineTension: 0.2,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderColor: 'rgba(76, 175, 80, 0.8)',
            pointBackgroundColor: 'rgba(76, 175, 80, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            data: yDataE
          },
          {
            label: 'Ausgaben',
            fill: false,
            lineTension: 0.2,
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderColor: 'rgba(244, 67, 54, 0.8)',
            pointBackgroundColor: 'rgba(244, 67, 54, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            data: yDataA
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: true, position: 'top'},
        scales: {
          yAxes: [{ticks: {min: yMin, max: yMax, beginAtZero: true}}]
        }
      }
    });
  }
};

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "../Login Page/LoginPage.html";
}

document.addEventListener('DOMContentLoaded', function () {
  // Widget-Konfiguration laden
  loadWidgetConfig();
  
  // Dashboard rendern
  renderDashboard();

  // Edit Widgets Button
  const editBtn = document.getElementById('editWidgetsBtn');
  if (editBtn) {
    editBtn.addEventListener('click', openWidgetManager);
  }

  // Modal Buttons
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('widgetModal');

  if (saveBtn) saveBtn.addEventListener('click', saveWidgets);
  if (cancelBtn) cancelBtn.addEventListener('click', closeWidgetManager);
  if (closeBtn) closeBtn.addEventListener('click', closeWidgetManager);

  // Modal schließen wenn außerhalb geklickt
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeWidgetManager();
      }
    });
  }

  // Profile Dropdown
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (!profileBtn || !profileDropdown) return;

  profileBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const opened = profileDropdown.classList.toggle('open');
    profileBtn.setAttribute('aria-expanded', opened);
    profileDropdown.setAttribute('aria-hidden', !opened);
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('open');
      profileBtn.setAttribute('aria-expanded', 'false');
      profileDropdown.setAttribute('aria-hidden', 'true');
    }
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      profileDropdown.classList.remove('open');
      profileBtn.setAttribute('aria-expanded', 'false');
      profileDropdown.setAttribute('aria-hidden', 'true');
      closeWidgetManager();
    }
  });
});

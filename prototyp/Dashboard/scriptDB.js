if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html";
}

// Global State
let allTransactions = [];
let selectedYear = 2026;
let selectedMonth = 2; // Februar
let selectedQuarter = 1; // Q1
let selectedDay = 1; // Tag
let currentViewType = 'month'; // 'month', 'quarter', 'year', 'day'

// JSON-Daten laden
async function loadTransactionData() {
  try {
    const response = await fetch('../Buchungen/data.json');
    const data = await response.json();
    allTransactions = data.transactions;
    return data;
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return null;
  }
}

// Hilfsfunktion: Daten nach Zeitraum filtern
function getTransactionsByTimeRange() {
  const filtered = allTransactions.filter(tx => {
    const txDate = new Date(tx.date);
    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth() + 1;
    const txQuarter = Math.ceil(txMonth / 3);
    
    if (currentViewType === 'month') {
      return txYear === selectedYear && txMonth === selectedMonth;
    } else if (currentViewType === 'quarter') {
      return txYear === selectedYear && txQuarter === selectedQuarter;
    } else if (currentViewType === 'year') {
      return txYear === selectedYear;
    }
    return true;
  });
  return filtered;
}

// Einnahmen berechnen
function calculateIncome() {
  const transactions = getTransactionsByTimeRange();
  return transactions
    .filter(tx => tx.type === 'Einnahme')
    .reduce((sum, tx) => sum + tx.amount, 0);
}

// Ausgaben berechnen
function calculateExpenses() {
  const transactions = getTransactionsByTimeRange();
  return transactions
    .filter(tx => tx.type === 'Ausgabe')
    .reduce((sum, tx) => sum + tx.amount, 0);
}

// Ergebnis berechnen
function calculateResult() {
  return calculateIncome() - calculateExpenses();
}

// Widget-Definitionen
const AVAILABLE_WIDGETS = [
  {
    id: 'einnahmen',
    name: 'Einnahmen',
    type: 'stat',
    enabled: true
  },
  {
    id: 'ausgaben',
    name: 'Ausgaben',
    type: 'stat',
    enabled: true
  },
  {
    id: 'ergebnis',
    name: 'Gewinn/Verlust',
    type: 'stat',
    enabled: true
  },
  {
    id: 'ubersicht',
    name: 'Finanzübersicht',
    type: 'chart',
    enabled: true,
    large: true
  },
  {
    id: 'differenz',
    name: 'Monat vs Vormonat',
    type: 'comparison',
    enabled: true
  },
  {
    id: 'letzte_buchungen',
    name: 'Letzte 5 Buchungen',
    type: 'list',
    enabled: true
  },
  {
    id: 'zahlungen',
    name: 'Anstehende Zahlungen',
    type: 'list',
    enabled: true
  },
  {
    id: 'widget_settings',
    name: 'Widget-Einstellungen',
    type: 'settings',
    enabled: true
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

  // Berechnete Werte
  const income = calculateIncome();
  const expenses = calculateExpenses();
  const result = calculateResult();
  const filteredTransactions = getTransactionsByTimeRange();
  const lastTransactions = filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Zeitraum-Label
  let timeLabel = '';
  if (currentViewType === 'day') {
    const months = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    timeLabel = `${selectedDay}. ${months[selectedMonth]} ${selectedYear}`;
  } else if (currentViewType === 'month') {
    const months = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    timeLabel = `${months[selectedMonth]} ${selectedYear}`;
  } else if (currentViewType === 'quarter') {
    timeLabel = `Q${selectedQuarter} ${selectedYear}`;
  } else {
    timeLabel = `${selectedYear}`;
  }

  AVAILABLE_WIDGETS.forEach(widget => {
    if (!widget.enabled) return;

    const widgetEl = document.createElement('div');
    widgetEl.className = `widget ${widget.type === 'stat' ? 'widget-stat' : ''} ${widget.large ? 'widget-large' : ''}`;
    widgetEl.id = `widget-${widget.id}`;

    if (widget.type === 'stat') {
      let number = '€0';
      let label = timeLabel;

      if (widget.id === 'einnahmen') {
        number = `€${income.toLocaleString('de-DE')}`;
      } else if (widget.id === 'ausgaben') {
        number = `€${expenses.toLocaleString('de-DE')}`;
      } else if (widget.id === 'ergebnis') {
        number = `€${result.toLocaleString('de-DE')}`;
        label = 'Bilanz';
      }

      widgetEl.innerHTML = `
        <div class="widget-header">
          <h3>${widget.name}</h3>
        </div>
        <div class="widget-content">
          <div class="stat-number">${number}</div>
          <div class="stat-label">${label}</div>
        </div>
      `;
    } else if (widget.type === 'chart') {
      // Verfügbare Tage für den ausgewählten Monat berechnen
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dayOptions = Array.from({length: daysInMonth}, (_, i) => i + 1);
      
      widgetEl.innerHTML = `
        <div class="widget-header">
          <h3>${widget.name}</h3>
          <div class="widget-controls">
            <button class="chart-btn ${currentViewType === 'day' ? 'active' : ''}" onclick="setChartView('day')" data-view="day">Tag</button>
            <button class="chart-btn ${currentViewType === 'month' ? 'active' : ''}" onclick="setChartView('month')" data-view="month">Monat</button>
            <button class="chart-btn ${currentViewType === 'quarter' ? 'active' : ''}" onclick="setChartView('quarter')" data-view="quarter">Quartal</button>
            <button class="chart-btn ${currentViewType === 'year' ? 'active' : ''}" onclick="setChartView('year')" data-view="year">Jahr</button>
          </div>
        </div>
        <div class="widget-content chart-widget-content">
          <div class="time-selector">
            <label>Wählen Sie:</label>
            <select id="yearSelector" onchange="changeYear(this.value)">
              ${[2024, 2025, 2026].map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
            <select id="monthSelector" onchange="changeMonth(this.value)" style="display: ${currentViewType === 'month' || currentViewType === 'day' ? 'inline-block' : 'none'}">
              ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'].map((m, i) => `<option value="${i+1}" ${i+1 === selectedMonth ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
            <select id="daySelector" onchange="changeDay(this.value)" style="display: ${currentViewType === 'day' ? 'inline-block' : 'none'}">
              ${dayOptions.map(d => `<option value="${d}" ${d === selectedDay ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
            <select id="quarterSelector" onchange="changeQuarter(this.value)" style="display: ${currentViewType === 'quarter' ? 'inline-block' : 'none'}">
              ${[1, 2, 3, 4].map(q => `<option value="${q}" ${q === selectedQuarter ? 'selected' : ''}>Q${q}</option>`).join('')}
            </select>
          </div>
          <p id="chartViewLabel" style="margin: 8px 0 16px 0; color: #666; font-size: 13px;">Jährliche Ansicht</p>
          <div class="chart-container">
            <canvas id="overviewChart"></canvas>
          </div>
        </div>
      `;
    } else if (widget.type === 'comparison') {
      const comparison = calculateMonthComparison();
      const trend = comparison.currentMonth >= comparison.previousMonth ? '📈' : '📉';
      const diff = Math.abs(comparison.currentMonth - comparison.previousMonth);
      const percent = comparison.previousMonth > 0 ? ((diff / comparison.previousMonth) * 100).toFixed(1) : '0';
      
      widgetEl.innerHTML = `
        <div class="widget-header">
          <h3>${widget.name}</h3>
        </div>
        <div class="widget-content">
          <div class="comparison-container">
            <div class="comparison-item">
              <span class="comparison-label">Vormonat</span>
              <span class="comparison-value">€${comparison.previousMonth.toLocaleString('de-DE')}</span>
            </div>
            <div class="comparison-item">
              <span class="comparison-label">Diesen Monat</span>
              <span class="comparison-value">€${comparison.currentMonth.toLocaleString('de-DE')}</span>
            </div>
            <div class="comparison-item">
              <span class="comparison-label">Differenz ${trend}</span>
              <span class="comparison-value ${comparison.currentMonth >= comparison.previousMonth ? 'positive' : 'negative'}">€${diff.toLocaleString('de-DE')} (${percent}%)</span>
            </div>
          </div>
        </div>
      `;
    } else if (widget.type === 'list') {
      if (widget.id === 'letzte_buchungen') {
        widgetEl.innerHTML = `
          <div class="widget-header">
            <h3>${widget.name}</h3>
          </div>
          <div class="widget-content">
            <div class="transaction-list">
              ${lastTransactions.length > 0 ? lastTransactions.map(tx => `
                <div class="transaction-item">
                  <div class="transaction-info">
                    <span class="transaction-date">${new Date(tx.date).toLocaleDateString('de-DE')}</span>
                    <span class="transaction-desc">${tx.description}</span>
                  </div>
                  <span class="transaction-amount ${tx.type === 'Einnahme' ? 'income' : 'expense'}">
                    ${tx.type === 'Einnahme' ? '+' : '-'}€${tx.amount.toLocaleString('de-DE')}
                  </span>
                </div>
              `).join('') : '<div style="color: #999; padding: 12px;">Keine Buchungen verfügbar</div>'}
            </div>
          </div>
        `;
      } else if (widget.id === 'zahlungen') {
        widgetEl.innerHTML = `
          <div class="widget-header">
            <h3>${widget.name}</h3>
          </div>
          <div class="widget-content">
            <div class="payment-list">
              ${(allTransactions.length > 0 ? allTransactions.slice(0, 4) : []).map(payment => `
                <div class="payment-item">
                  <div class="payment-info">
                    <span class="payment-date">${new Date(payment.date).toLocaleDateString('de-DE')}</span>
                    <span class="payment-desc">${payment.description}</span>
                  </div>
                  <span class="payment-amount">€${payment.amount.toLocaleString('de-DE')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    } else if (widget.type === 'settings') {
      widgetEl.innerHTML = `
        <div class="widget-header">
          <h3>⚙️ ${widget.name}</h3>
        </div>
        <div class="widget-content">
          <p style="text-align: center; color: #666; font-size: 13px; margin: 0 0 12px 0;">Verwalten Sie Ihre Dashboard-Widgets</p>
          <button id="editWidgetsBtn" class="btn btn-primary" style="width: 100%; padding: 10px; cursor: pointer;" onclick="openWidgetManager()">
            Widgets bearbeiten
          </button>
        </div>
      `;
    }

    grid.appendChild(widgetEl);
  });

  // Chart initialisieren, wenn vorhanden
  if (AVAILABLE_WIDGETS.find(w => w.id === 'ubersicht' && w.enabled)) {
    setTimeout(() => {
      OverviewChart.init();
      
      // Chart View Label aktualisieren
      const chartViewLabel = document.getElementById('chartViewLabel');
      if (chartViewLabel) {
        let label = '';
        if (currentViewType === 'day') {
          const months = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
          label = `Ansicht: ${selectedDay}. ${months[selectedMonth]} ${selectedYear} (täglich)`;
        } else if (currentViewType === 'month') {
          const months = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
          label = `Ansicht: ${months[selectedMonth]} ${selectedYear} (täglich)`;
        } else if (currentViewType === 'quarter') {
          label = `Ansicht: Q${selectedQuarter} ${selectedYear} (monatlich)`;
        } else {
          label = `Ansicht: ${selectedYear} (monatlich)`;
        }
        chartViewLabel.textContent = label;
      }
    }, 100);
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
    const isSettingsWidget = widget.id === 'widget_settings';
    label.innerHTML = `
      <input type="checkbox" class="widget-checkbox" data-widget-id="${widget.id}" ${widget.enabled ? 'checked' : ''} ${isSettingsWidget ? 'disabled' : ''}>
      <span>${widget.name}${isSettingsWidget ? ' (erforderlich)' : ''}</span>
    `;
    label.style.opacity = isSettingsWidget ? '0.6' : '1';
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

// Funktionen für Benutzer-Interaktionen
function setChartView(viewType) {
  currentViewType = viewType;
  
  // Selector anzeigen/verstecken
  document.getElementById('monthSelector').style.display = (viewType === 'month' || viewType === 'day') ? 'inline-block' : 'none';
  document.getElementById('daySelector').style.display = viewType === 'day' ? 'inline-block' : 'none';
  document.getElementById('quarterSelector').style.display = viewType === 'quarter' ? 'inline-block' : 'none';
  
  // Buttons aktivieren
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewType);
  });
  
  renderDashboard();
}

function changeYear(year) {
  selectedYear = parseInt(year);
  renderDashboard();
}

function changeMonth(month) {
  selectedMonth = parseInt(month);
  renderDashboard();
}

function changeQuarter(quarter) {
  selectedQuarter = parseInt(quarter);
  renderDashboard();
}

// Monatvergleich berechnen
function calculateMonthComparison() {
  if (currentViewType !== 'month') {
    return { currentMonth: 0, previousMonth: 0 };
  }
  
  // Aktueller Monat
  const currentMonthTx = allTransactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === selectedYear && 
           (txDate.getMonth() + 1) === selectedMonth &&
           tx.type === 'Einnahme';
  }).reduce((sum, tx) => sum + tx.amount, 0);
  
  // Vorheriger Monat
  let prevMonth = selectedMonth - 1;
  let prevYear = selectedYear;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear--;
  }
  
  const previousMonthTx = allTransactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === prevYear && 
           (txDate.getMonth() + 1) === prevMonth &&
           tx.type === 'Einnahme';
  }).reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    currentMonth: currentMonthTx,
    previousMonth: previousMonthTx
  };
}

// Chart-Daten generieren
function generateChartData() {
  let labels = [];
  let einnahmenData = [];
  let ausgabenData = [];
  
  if (currentViewType === 'day') {
    // Stündliche Daten für den Tag
    labels = Array.from({length: 24}, (_, i) => `${i}:00`);
    
    const dayTransactions = allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === selectedYear &&
             (txDate.getMonth() + 1) === selectedMonth &&
             txDate.getDate() === selectedDay;
    });
    
    // Für alle 24 Stunden Daten generieren (pro Stunde)
    for (let hour = 0; hour < 24; hour++) {
      const hourTransactions = dayTransactions.filter(tx => {
        const txTime = new Date(tx.date);
        return txTime.getHours() === hour;
      });
      einnahmenData.push(hourTransactions.filter(tx => tx.type === 'Einnahme').reduce((s, tx) => s + tx.amount, 0));
      ausgabenData.push(hourTransactions.filter(tx => tx.type === 'Ausgabe').reduce((s, tx) => s + tx.amount, 0));
    }
  } else if (currentViewType === 'month') {
    // Tägliche Daten für den Monat
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    labels = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTransactions = allTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === selectedYear &&
               (txDate.getMonth() + 1) === selectedMonth &&
               txDate.getDate() === day;
      });
      
      einnahmenData.push(dayTransactions.filter(tx => tx.type === 'Einnahme').reduce((s, tx) => s + tx.amount, 0));
      ausgabenData.push(dayTransactions.filter(tx => tx.type === 'Ausgabe').reduce((s, tx) => s + tx.amount, 0));
    }
  } else if (currentViewType === 'quarter') {
    // Monatliche Daten für das Quartal
    const startMonth = (selectedQuarter - 1) * 3 + 1;
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    
    for (let i = 0; i < 3; i++) {
      const month = startMonth + i;
      labels.push(monthNames[month - 1].substring(0, 3));
      
      const monthTransactions = allTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === selectedYear && (txDate.getMonth() + 1) === month;
      });
      
      einnahmenData.push(monthTransactions.filter(tx => tx.type === 'Einnahme').reduce((s, tx) => s + tx.amount, 0));
      ausgabenData.push(monthTransactions.filter(tx => tx.type === 'Ausgabe').reduce((s, tx) => s + tx.amount, 0));
    }
  } else if (currentViewType === 'year') {
    // Monatliche Daten für das Jahr
    labels = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    
    for (let month = 1; month <= 12; month++) {
      const monthTransactions = allTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === selectedYear && (txDate.getMonth() + 1) === month;
      });
      
      einnahmenData.push(monthTransactions.filter(tx => tx.type === 'Einnahme').reduce((s, tx) => s + tx.amount, 0));
      ausgabenData.push(monthTransactions.filter(tx => tx.type === 'Ausgabe').reduce((s, tx) => s + tx.amount, 0));
    }
  }
  
  return { labels, einnahmenData, ausgabenData };
}

// Chart-Module
const OverviewChart = {
  chart: null,

  init: function() {
    const canvas = document.getElementById('overviewChart');
    if (!canvas) return;

    const chartData = generateChartData();
    
    // Y-Achse optimal skalieren
    let yMax = Math.max(
      Math.max(...chartData.einnahmenData, 0),
      Math.max(...chartData.ausgabenData, 0)
    );
    
    // Wenn yMax zu klein ist, setzen wir ein Mindestmaximum
    if (yMax === 0) yMax = 1000;
    
    // Skalierung mit 10% Puffer oben für bessere Lesbarkeit
    yMax = yMax * 1.1;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartData.labels,
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
            data: chartData.einnahmenData
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
            data: chartData.ausgabenData
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: true, position: 'top'},
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: yMax,
              beginAtZero: true,
              callback: function(value) {
                return '€' + value.toLocaleString('de-DE');
              }
            }
          }]
        }
      }
    });
  }
};

function changeDay(day) {
  selectedDay = parseInt(day);
  renderDashboard();
}

function logout() {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "../Login Page/LoginPage.html";
}

document.addEventListener('DOMContentLoaded', async function () {
  // Navigation markieren
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    const currentPage = window.location.pathname.split('/').pop();
    const linkPage = href.split('/').pop();
    if (currentPage === linkPage) {
      link.classList.add('active');
    }
  });

  // Transaktionsdaten laden
  await loadTransactionData();
  
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

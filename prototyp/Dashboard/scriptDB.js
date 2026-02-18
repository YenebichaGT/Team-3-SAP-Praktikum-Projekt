if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "../Login Page/LoginPage.html"; // Redirect to login if not logged in
}

// Widget Factory - Easy widget creation
const WidgetFactory = {
  createStatWidget: function(title, number, label) {
    const widget = document.createElement('div');
    widget.className = 'widget widget-stat';
    widget.innerHTML = `
      <div class="widget-header">
        <h3>${title}</h3>
      </div>
      <div class="widget-content">
        <div class="stat-number">${number}</div>
        <div class="stat-label">${label}</div>
      </div>
    `;
    return widget;
  },

  createTextWidget: function(title, content) {
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.innerHTML = `
      <div class="widget-header">
        <h3>${title}</h3>
      </div>
      <div class="widget-content">
        ${typeof content === 'string' ? `<p>${content}</p>` : ''}
      </div>
    `;
    return widget;
  },

  createChartWidget: function(title, svgContent, isLarge = true) {
    const widget = document.createElement('div');
    widget.className = `widget ${isLarge ? 'widget-large' : ''}`;
    widget.innerHTML = `
      <div class="widget-header">
        <h3>${title}</h3>
      </div>
      <div class="widget-content">
        <div class="chart-placeholder">
          ${svgContent}
        </div>
      </div>
    `;
    return widget;
  },

  addToGrid: function(widget, gridSelector = '.dashboard-grid') {
    const grid = document.querySelector(gridSelector);
    if (grid) {
      grid.appendChild(widget);
    }
  }
};

// Financial Chart Module - Data & Functionality
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
        viewLabel = 'Yearly View';
        break;
      case 1: // Quarter
        xData = [1,2,3,4];
        yDataE = this.getQuarterData(this.data.einnahmen);
        yDataA = this.getQuarterData(this.data.ausgaben);
        viewLabel = 'Quarterly View';
        break;
      case 2: // Month
        xData = Array.from({length: 31}, (_, i) => i + 1);
        yDataE = this.getMonthData(this.data.einnahmen);
        yDataA = this.getMonthData(this.data.ausgaben);
        viewLabel = 'Monthly View';
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
    document.getElementById('chartViewLabel').textContent = viewLabel;

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
            label: 'Income (Einnahmen)',
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
            label: 'Expenses (Ausgaben)',
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
    sessionStorage.removeItem("loggedIn"); // Remove login flag
    window.location.href = "../Login Page/LoginPage.html"; // Redirect to login
}

document.addEventListener('DOMContentLoaded', function () {
	// Initialize Financial Chart
	FinancialChart.init();

	const btn = document.getElementById('profileBtn');
	const dropdown = document.getElementById('profileDropdown');

	if (!btn || !dropdown) return;

	btn.addEventListener('click', function (e) {
		e.stopPropagation();
		const opened = dropdown.classList.toggle('open');
		btn.setAttribute('aria-expanded', opened);
		dropdown.setAttribute('aria-hidden', !opened);
	});

	// Close when clicking outside
	document.addEventListener('click', function (e) {
		if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
			dropdown.classList.remove('open');
			btn.setAttribute('aria-expanded', 'false');
			dropdown.setAttribute('aria-hidden', 'true');
		}
	});

	// Close on ESC
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			dropdown.classList.remove('open');
			btn.setAttribute('aria-expanded', 'false');
			dropdown.setAttribute('aria-hidden', 'true');
		}
	});
});

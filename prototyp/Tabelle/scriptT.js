// Global state
let allTransactions = [];
let filteredTransactions = [];
let isEditMode = false;
let allCategories = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function () {
    // Set today's date as default for new transaction form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newDate').value = today;

    // Load data
    await loadData();
    populateFilters();
    renderTable();
    updateSummary();

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('addModal');
        if (event.target == modal) {
            closeAddModal();
        }
    }
});

/**
 * Load transaction data from JSON
 */
async function loadData() {
    try {
        const response = await fetch('../Buchungen/data.json');
        const data = await response.json();
        allTransactions = data.transactions;
        filteredTransactions = [...allTransactions];
        console.log('Data loaded:', allTransactions.length, 'transactions');
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        showMessage('Fehler beim Laden der Daten: ' + error.message, 'error');
    }
}

/**
 * Populate filter dropdowns
 */
function populateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    allCategories = [...new Set(allTransactions.map(t => t.category))].sort();
    
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

/**
 * Apply filters to table
 */
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    filteredTransactions = allTransactions.filter(tx => {
        let match = true;
        if (typeFilter && tx.type !== typeFilter) match = false;
        if (categoryFilter && tx.category !== categoryFilter) match = false;
        return match;
    });

    renderTable();
}

/**
 * Toggle edit mode
 */
function toggleEditMode() {
    isEditMode = !isEditMode;
    // Only update button text if it exists (for iframe parent control)
    const editBtn = document.getElementById('editBtnText');
    if (editBtn) {
        if (isEditMode) {
            editBtn.textContent = '✓ Bearbeitungsmodus aus';
        } else {
            editBtn.textContent = '✏️ Bearbeitungsmodus an';
        }
    }
    if (isEditMode) {
        document.body.classList.add('edit-mode');
    } else {
        document.body.classList.remove('edit-mode');
        // Save any inline changes
        saveAllChanges();
    }
    renderTable();
}

/**
 * Render the table with current data
 */
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    if (filteredTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Keine Transaktionen gefunden</td></tr>';
        return;
    }

    // Sort by date descending (newest first)
    const sorted = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach((transaction, idx) => {
        const row = document.createElement('tr');

        if (isEditMode) {
            // Edit mode - make fields editable
            row.innerHTML = `
                <td>
                    <input type="date" value="${transaction.date.split('T')[0]}" 
                           class="edit-input" data-field="date" data-index="${idx}">
                </td>
                <td>
                    <select class="edit-input" data-field="type" data-index="${idx}">
                        <option value="Einnahme" ${transaction.type === 'Einnahme' ? 'selected' : ''}>Einnahme</option>
                        <option value="Ausgabe" ${transaction.type === 'Ausgabe' ? 'selected' : ''}>Ausgabe</option>
                    </select>
                </td>
                <td>
                    <input type="text" value="${transaction.description}" 
                           class="edit-input" data-field="description" data-index="${idx}">
                </td>
                <td>
                    <input type="number" value="${transaction.amount}" step="0.01"
                           class="edit-input" data-field="amount" data-index="${idx}">
                </td>
                <td>
                    <input type="text" value="${transaction.category}" 
                           class="edit-input" data-field="category" data-index="${idx}">
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger" onclick="deleteTransaction(${idx})">🗑️ Löschen</button>
                    </div>
                </td>
            `;
        } else {
            // View mode - display as text
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.type}</td>
                <td>${transaction.description}</td>
                <td style="text-align: right; font-weight: bold;">${formatCurrency(transaction.amount)}</td>
                <td>${transaction.category || '-'} </td>
                ${isEditMode ? `<td><button class="btn btn-danger" onclick="deleteTransaction(${idx})">🗑️ Löschen</button></td>` : ''}
            `;
        }

        tbody.appendChild(row);
    });
}

/**
 * Save all inline changes
 */
function saveAllChanges() {
    const inputs = document.querySelectorAll('.edit-input');
    let hasChanges = false;

    inputs.forEach(input => {
        const idx = parseInt(input.dataset.index);
        const field = input.dataset.field;
        let value = input.value;

        // Convert value to appropriate type
        if (field === 'amount') {
            value = parseFloat(value);
        }

        if (allTransactions[idx][field] !== value) {
            allTransactions[idx][field] = value;
            hasChanges = true;
        }
    });

    if (hasChanges) {
        syncDataWithBackend();
        updateSummary();
        notifyDashboard();
    }
}

/**
 * Delete a transaction
 */
function deleteTransaction(index) {
    if (!confirm('Sind Sie sicher, dass Sie diese Transaktion löschen möchten?')) {
        return;
    }

    const originalIndex = allTransactions.findIndex(t => t === filteredTransactions[index]);
    if (originalIndex > -1) {
        allTransactions.splice(originalIndex, 1);
    }

    syncDataWithBackend();
    applyFilters();
    updateSummary();
    notifyDashboard();
    showMessage('Transaktion gelöscht!', 'success');
}

/**
 * Open add transaction modal
 */
function openAddModal() {
    document.getElementById('addModal').classList.add('show');
    document.getElementById('addForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newDate').value = today;
}

/**
 * Close add transaction modal
 */
function closeAddModal() {
    document.getElementById('addModal').classList.remove('show');
    document.getElementById('addForm').reset();
}

/**
 * Save new transaction
 */
function saveNewTransaction(event) {
    event.preventDefault();

    const newTransaction = {
        date: document.getElementById('newDate').value + 'T12:00:00',
        type: document.getElementById('newType').value,
        description: document.getElementById('newDescription').value,
        amount: parseFloat(document.getElementById('newAmount').value),
        category: document.getElementById('newCategory').value || 'Sonstiges'
    };

    allTransactions.push(newTransaction);
    syncDataWithBackend();
    applyFilters();
    updateSummary();
    closeAddModal();
    notifyDashboard();
    showMessage('Transaktion hinzugefügt!', 'success');
}

/**
 * Sync data with backend
 */
async function syncDataWithBackend() {
    try {
        // Store in localStorage for dashboard to pick up
        localStorage.setItem('transactionsUpdated', Date.now().toString());
        localStorage.setItem('allTransactions', JSON.stringify(allTransactions));

        // Try to save via backend if available
        // You can implement PHP backend here
        console.log('Data synced');
    } catch (error) {
        console.error('Sync error:', error);
    }
}

/**
 * Notify dashboard of changes
 */
function notifyDashboard() {
    // Trigger event that dashboard can listen to
    const event = new Event('transactionsChanged');
    window.dispatchEvent(event);

    // Also store in localStorage
    localStorage.setItem('transactionsUpdated', Date.now().toString());
}

/**
 * Refresh data from server
 */
async function refreshData() {
    await loadData();
    applyFilters();
    updateSummary();
    showMessage('Daten aktualisiert!', 'success');
}

/**
 * Update summary cards
 */
function updateSummary() {
    const container = document.getElementById('summaryContainer');

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Filter for current month
    const monthTransactions = allTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() + 1 === currentMonth && txDate.getFullYear() === currentYear;
    });

    const income = monthTransactions
        .filter(tx => tx.type === 'Einnahme')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = monthTransactions
        .filter(tx => tx.type === 'Ausgabe')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = income - expenses;

    const monthName = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
        .format(now);

    container.innerHTML = `
        <div class="summary-card">
            <h3>Gesamtzahl</h3>
            <div class="amount">${filteredTransactions.length}</div>
        </div>
        <div class="summary-card income">
            <h3>Einnahmen (${monthName})</h3>
            <div class="amount">${formatCurrency(income)}</div>
        </div>
        <div class="summary-card expenses">
            <h3>Ausgaben (${monthName})</h3>
            <div class="amount">${formatCurrency(expenses)}</div>
        </div>
        <div class="summary-card balance">
            <h3>Bilanz (${monthName})</h3>
            <div class="amount">${formatCurrency(balance)}</div>
        </div>
    `;
}

/**
 * Show status message
 */
function showMessage(message, type = 'success') {
    const msgElement = document.getElementById('statusMessage');
    msgElement.textContent = message;
    msgElement.className = `status-message ${type}`;

    setTimeout(() => {
        msgElement.className = 'status-message';
    }, 4000);
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

let transactions = [];
        let currentFilter = 'all';
        let currentSort = 'date-desc';
        let chart = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadFromStorage();
            initChart();
            updateDisplay();
        });

        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const description = document.getElementById('description');
            const amount = document.getElementById('amount');
            const type = document.getElementById('type');

            // Validation
            let isValid = true;

            if (!description.value.trim()) {
                showError('description');
                isValid = false;
            } else {
                hideError('description');
            }

            if (!amount.value || parseFloat(amount.value) <= 0) {
                showError('amount');
                isValid = false;
            } else {
                hideError('amount');
            }

            if (!type.value) {
                showError('type');
                isValid = false;
            } else {
                hideError('type');
            }

            if (!isValid) return;

            // Add transaction
            const transaction = {
                id: Date.now(),
                description: description.value.trim(),
                amount: parseFloat(amount.value),
                type: type.value,
                date: new Date().toISOString()
            };

            transactions.push(transaction);

            // Save to localStorage
            saveToStorage();

            // Reset form
            document.getElementById('transactionForm').reset();

            // Update display
            updateDisplay();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                updateTransactionsList();
            });
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            currentSort = e.target.value;
            updateTransactionsList();
        });

        function showError(field) {
            const input = document.getElementById(field);
            const error = document.getElementById(field + 'Error');
            input.classList.add('error');
            error.style.display = 'block';
        }

        function hideError(field) {
            const input = document.getElementById(field);
            const error = document.getElementById(field + 'Error');
            input.classList.remove('error');
            error.style.display = 'none';
        }

        function updateDisplay() {
            updateBalances();
            updateTransactionsList();
            updateChart();
        }

        function updateBalances() {
            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const balance = income - expense;

            document.getElementById('totalBalance').textContent = `৳${balance.toFixed(2)}`;
            document.getElementById('totalIncome').textContent = `৳${income.toFixed(2)}`;
            document.getElementById('totalExpense').textContent = `৳${expense.toFixed(2)}`;
        }

        function updateTransactionsList() {
            const list = document.getElementById('transactionsList');

            let filtered = transactions.filter(t => {
                if (currentFilter === 'all') return true;
                return t.type === currentFilter;
            });

            // Sort
            filtered.sort((a, b) => {
                switch (currentSort) {
                    case 'date-desc':
                        return new Date(b.date) - new Date(a.date);
                    case 'date-asc':
                        return new Date(a.date) - new Date(b.date);
                    case 'amount-desc':
                        return b.amount - a.amount;
                    case 'amount-asc':
                        return a.amount - b.amount;
                    default:
                        return 0;
                }
            });

            if (filtered.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
                        </svg>
                        <p>No transactions yet. Start by adding one!</p>
                    </div>
                `;
                return;
            }

            // Group by month and year
            const grouped = {};
            filtered.forEach(t => {
                const date = new Date(t.date);
                const monthYear = date.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                });
                if (!grouped[monthYear]) {
                    grouped[monthYear] = [];
                }
                grouped[monthYear].push(t);
            });

            // Build HTML with month headers
            let html = '';
            Object.keys(grouped).forEach(monthYear => {
                const monthTransactions = grouped[monthYear];
                const monthIncome = monthTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                const monthExpense = monthTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                html += `
                    <div class="month-header">
                        <h3>${monthYear}</h3>
                        <div class="month-summary">
                            <span class="month-income">Income: ${monthIncome.toFixed(2)}</span>
                            <span class="month-expense">Expenses: ${monthExpense.toFixed(2)}</span>
                            <span class="month-balance">Balance: ${(monthIncome - monthExpense).toFixed(2)}</span>
                        </div>
                    </div>
                `;

                monthTransactions.forEach(t => {
                    const date = new Date(t.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    html += `
                        <div class="transaction-item ${t.type}">
                            <div class="transaction-info">
                                <div class="transaction-description">${t.description}</div>
                                <div class="transaction-date">${formattedDate}</div>
                            </div>
                            <span class="transaction-amount ${t.type}">
                                ${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </span>
                            <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
                        </div>
                    `;
                });
            });

            list.innerHTML = html;
        }

        function deleteTransaction(id) {
            transactions = transactions.filter(t => t.id !== id);
            saveToStorage();
            updateDisplay();
        }

        function initChart() {
            const ctx = document.getElementById('expenseChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Income', 'Expenses'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: ['#10b981', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 14
                                }
                            }
                        }
                    }
                }
            });
        }

        function updateChart() {
            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            chart.data.datasets[0].data = [income, expense];
            chart.update();
        }

        const BIN_URL = "https://api.jsonbin.io/v3/b/68e4e4f743b1c97be95d4ffb"; // Replace with your Bin URL
        const API_KEY = "$2a$10$s1q8gCZeUMlje86yaeTVd.oR/pmniEkYOfqd4EMQ47eqBSy9/MO06"; // Replace with your API Key

        async function loadFromStorage() {
            try {
                const res = await fetch(BIN_URL + "/latest", {
                    headers: {
                        "X-Master-Key": API_KEY
                    }
                });
                const data = await res.json();
                transactions = data.record || [];
                updateDisplay();
            } catch (e) {
                console.error("Error loading from JSONBin:", e);
                transactions = [];
            }
        }

        async function saveToStorage() {
            console.log(transactions)
            try {
                await fetch(BIN_URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": '$2a$10$CjzmyVb.FtGz5tv8.HWiwe/DapG8cFscDxf0jU1WkDELV90MLHHem'
                    },
                    body: JSON.stringify(transactions)
                });
            } catch (e) {
                console.error("Error saving to JSONBin:", e);
            }
        }
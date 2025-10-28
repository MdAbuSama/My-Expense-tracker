# Expense Tracker

A simple and intuitive personal finance web application to help you track income, expenses, and understand where your money goes.

## Features

- ✅ Add new transactions (income or expense)
- 🗑️ Delete transactions you no longer need
- 💾 Persistent storage using Json DB Server
- 📊 Spending overview chart (Chart.js)
- 📱 Responsive design for mobile and desktop
- 🎨 Clean and user-friendly interface

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js (for charts)
- Json DB Server

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or external dependencies required

### Installation

1. Clone the repository:
```powershell
git clone https://github.com/MdAbuSama/My-Expense-tracker.git
```

2. Navigate to the project directory:
```powershell
cd "My-Expense-tracker"
```

3. Open `index.html` in your web browser:
```powershell
start index.html
```

Or simply double-click the `index.html` file in your file explorer.

## Usage

1. **Adding a Transaction**: Enter a description and amount in the form and click "Add transaction" or press Enter. Use negative amounts for expenses (e.g., -50) and positive for income (e.g., 200).
2. **Deleting a Transaction**: Click the delete icon next to a transaction in the history to remove it.
3. **Viewing Summary**: The top cards show your Total Balance, Income, and Expenses. The chart gives a visual breakdown of spending.

## Project Structure

```
My-Expense-tracker/
│
├── index.html          # Main HTML file
├── style.css           # Styling and layout
├── script.js           # Application logic (transactions, localStorage, Chart.js)
└── README.md           # Project documentation
```

## Features in Detail

### Persistent Storage
All transactions are stored in Json DB Server, so your data persists between device chabges without a backend.

### Spending Overview (Chart)
A Chart.js chart displays a quick visual of income vs expenses and helps you spot trends.

### Responsive Design
The UI adapts to different screen sizes so you can manage expenses on desktops and mobile devices.

## Screenshots

![Expense Tracker Screenshot](./expence%20tracker.png)

## Future Enhancements

- [ ] Edit transactions
- [ ] Categorize transactions (e.g., Food, Transport, Bills)
- [ ] Add transaction dates and filtering
- [ ] Export/import transactions (CSV/JSON)
- [ ] Add authentication and cloud sync
- [ ] Dark mode toggle
- [ ] Analytics and spending reports

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Md Abu Sama**
- GitHub: [@MdAbuSama](https://github.com/MdAbuSama)

## Acknowledgments

- Inspired by simple budget and expense trackers found around the web.
- Built as a lightweight learning project.
- Visit : [Expence Tracker](https://mdabusama.github.io/My-Expense-tracker/)

---

⭐ If you found this project helpful, please consider giving it a star!
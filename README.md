# Finance Dashboard (RBAC)

A modern personal finance dashboard built with **React + Vite** that supports **role-based access control (RBAC)**, transaction management, budgeting, and analytics.

## Overview

This project helps track income and expenses with a clean dashboard UI and in-app role switching:

- **Admin** role: full access (add, edit, delete transactions, budget management)
- **Viewer** role: read-only access (view dashboards and reports)

All data is persisted in browser `localStorage` for a smooth demo/development experience without backend setup.

---

## Key Features

### 1) Role-Based Access Control (RBAC)

- Two roles available in the sidebar:
  - `admin`
  - `viewer`
- Role is persisted in `localStorage`
- UI and route access are role-aware:
  - `Add Transaction` route is hidden/blocked for viewers
  - Viewer banner appears in read-only mode

### 2) Transaction Management

- Add new transactions
- Edit existing transactions
- Delete transactions
- Track both:
  - `income`
  - `expense`
- Categories, dates, notes, and recurring flags supported

### 3) Budget Tracking

- Set and update budget
- Compare expenses against budget
- Quick visual understanding of spending progress

### 4) Dashboard + Analytics

- Total income
- Total expenses
- Net balance
- Category-level and trend insights with charts

### 5) Good UX Basics

- Search/filter support
- Modal-based editing
- Toast notifications
- Smooth UI transitions (Framer Motion)

---

## Tech Stack

### Frontend

- **React 18**
- **Vite 5**
- **React Router DOM 6**

### UI / DX Libraries

- `react-icons`
- `react-toastify`
- `framer-motion`

### Forms + Validation

- `react-hook-form`
- `yup`
- `@hookform/resolvers`

### Data + Utilities

- `axios`
- `date-fns`
- `uuid`
- `recharts`

---

## Project Structure

```text
finance-app-rbac/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── constants.js
│   ├── components/
│   │   ├── BudgetCard.jsx
│   │   ├── Charts.jsx
│   │   ├── EditModal.jsx
│   │   ├── Filters.jsx
│   │   ├── SearchBar.jsx
│   │   └── TransactionCard.jsx
│   ├── context/
│   │   └── FinanceContext.jsx
│   ├── hooks/
│   │   ├── useBudget.js
│   │   ├── useCurrency.js
│   │   ├── useDebounce.js
│   │   └── useTransactions.js
│   ├── pages/
│   │   ├── AddTransaction.jsx
│   │   ├── Analytics.jsx
│   │   ├── Budget.jsx
│   │   ├── Dashboard.jsx
│   │   └── Transactions.jsx
│   ├── services/
│   │   └── api.js
│   └── utils/
│       └── currencyFormatter.js
└── README.md
```

---

## RBAC Behavior Summary

### Admin

Can:

- View all pages
- Add transaction
- Edit transaction
- Delete transaction
- Update budget

### Viewer

Can:

- View dashboard, transactions, budget, analytics

Cannot:

- Access `Add Transaction`
- Perform mutating actions (add/edit/delete)

---

## Routing

Defined in `src/App.jsx`:

- `/dashboard`
- `/transactions`
- `/transactions/new` *(admin-only in UI + route guard)*
- `/budget`
- `/analytics`

Root `/` redirects to `/dashboard`.

---

## State Management

Global app state is handled via React Context in `src/context/FinanceContext.jsx`.

Stored values include:

- `transactions`
- `budget`
- `role`
- computed totals:
  - `totalIncome`
  - `totalExpense`
  - `netBalance`

Mutations exposed by context:

- `addTransaction()`
- `updateTransaction()`
- `deleteTransaction()`
- `setBudget()`
- `setRole()`

Persistence:

- `transactions`, `budget`, and `role` are synced to `localStorage`

---

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm (comes with Node)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Then open the local URL shown in terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

---

## Demo Notes

- The app seeds sample transactions on first load.
- To reset demo data, clear browser local storage for this site.
- Role can be switched from the sidebar to test access restrictions quickly.

---

## Scripts

From `package.json`:

- `npm run dev` → start Vite dev server
- `npm run build` → create production build

---

## Recommended Next Improvements

- Add unit tests (context logic + RBAC guards)
- Add end-to-end tests for role switching flows
- Add backend auth and persistent database
- Add export/import transactions (CSV)
- Add recurring transaction automation logic

---

## License

No license file is currently configured in this repository.
If you plan to open-source it, add a `LICENSE` file (e.g., MIT).

---

## Author

Built by **Mitansh**.

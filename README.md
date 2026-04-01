# Finance Hub

A clean, modern finance dashboard built with React, Vite, Tailwind CSS, and Recharts.

This project focuses on a practical dashboard experience: clear balance visibility, category-based spending insights, role-based controls, dark mode, responsive layout, and a lightweight frontend architecture that is easy to extend.

## Highlights

- Dashboard overview with:
  - Total balance
  - Total income
  - Total expenses
- Interactive data visualization:
  - Balance trend line chart
  - Category-wise spending pie chart
- Transaction management:
  - Search by category, description, or type
  - Filter by income or expense
  - Sort by date or amount
- Frontend-only role switching:
  - `Admin` can add, edit, and delete transactions
  - `Viewer` has read-only access
- Smart insights:
  - Highest spending category
  - Month-over-month expense comparison
  - Savings rate summary
- Dark mode with Tailwind `class` strategy
- INR currency formatting across the UI
- Local persistence with `localStorage`
- Responsive layout with polished empty states

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts
- Context API for state management

## Features In Detail

### 1. Dashboard Overview

The main dashboard surfaces the most important financial signals first:

- total balance
- total income
- total expenses
- balance trend over time
- spending distribution by category

### 2. Transaction Table

The transaction history section supports:

- text search
- income/expense filtering
- date and amount sorting
- admin-only edit and delete actions

### 3. Role-Based UI

The interface includes a role switcher for frontend permission simulation:

- `Admin`
  - can add transactions
  - can edit transactions
  - can delete transactions
- `Viewer`
  - can only inspect data
  - does not see edit controls

### 4. Insights

Insights are calculated dynamically from the transaction dataset and include:

- highest spending category
- current vs last month expense comparison
- savings rate

### 5. Dark Mode

Dark mode is implemented using Tailwind's `darkMode: 'class'` strategy.

- theme preference is persisted in `localStorage`
- the `dark` class is applied to the root HTML element
- major surfaces support light and dark themes consistently

### 6. Chart Optimization

The chart layer is optimized to keep the dashboard snappy:

- Recharts is lazy-loaded
- chart modules are imported selectively
- Vite splits chart code into dedicated chunks

## Project Structure

```text
src/
  components/
    Charts.jsx
    EmptyState.jsx
    InsightCard.jsx
    RoleSwitcher.jsx
    Sidebar.jsx
    SummaryCard.jsx
    TransactionModal.jsx
    TransactionTable.jsx
  context/
    FinanceContext.jsx
  data/
    mockData.js
  pages/
    Dashboard.jsx
  utils/
    formatters.js
    insights.js
  App.jsx
  index.css
  main.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, typically:

```text
http://127.0.0.1:5173
```

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## State Management

The app uses a single Context-based store in `FinanceContext.jsx` to manage:

- transactions
- filters
- active role
- theme
- derived dashboard metrics

This keeps the codebase simple and scalable without introducing unnecessary abstraction.

## Data & Persistence

- mock transactions are seeded from `src/data/mockData.js`
- transaction edits are persisted in `localStorage`
- role and theme preferences are also persisted in `localStorage`

## Currency

The dashboard is currently configured to display all monetary values in `INR`.

## Build Status

The app builds successfully with Vite production build output.

## Possible Next Improvements

- backend integration for real transaction data
- authentication and real RBAC
- export to CSV or PDF
- recurring transactions
- budget goals and alerts

## License

This project is available for personal and educational use.

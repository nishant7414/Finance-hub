# Zorvyn – Finance Hub

A clean, modern **Finance Dashboard UI** built using React, Vite, Tailwind CSS, and Recharts.

This project was developed as part of a frontend evaluation assignment to demonstrate UI design thinking, component structuring, and effective state management. The focus is on building a clear, interactive, and intuitive dashboard experience rather than a production-ready backend system.

---

## 🎯 Objective

The goal of this project is to design and implement a finance dashboard that allows users to:

* View an overall financial summary  
* Explore and manage transactions  
* Understand spending patterns through insights and visualizations  

This project emphasizes **frontend architecture, UI/UX decisions, and interaction design**.

---

## ✨ Key Features

### 📊 Dashboard Overview

* Summary cards:
  * Total Balance  
  * Total Income  
  * Total Expenses  

* Time-based visualization:
  * Balance trend (line chart)

* Category-based visualization:
  * Spending breakdown (pie chart)

---

### 💳 Transactions Section

* Displays:
  * Date  
  * Amount  
  * Category  
  * Type (Income/Expense)

* Features:
  * Search (category, description, type)  
  * Filtering (income/expense)  
  * Sorting (date, amount)

---

### 🔐 Role-Based UI (Frontend Simulation)

* Role switching via UI toggle:

  * **Admin**
    * Add, edit, delete transactions  

  * **Viewer**
    * Read-only access  

* Demonstrates conditional rendering and access control logic on frontend

---

### 📈 Insights Section

* Dynamically generated insights:
  * Highest spending category  
  * Month-over-month comparison  
  * Savings rate  

---

### 🧠 State Management

* Centralized state using **Context API**

* Manages:
  * Transactions  
  * Filters  
  * User role  
  * Theme  

* Keeps architecture simple yet scalable

---

### 🎨 UI & UX

* Clean, modern dashboard layout  
* Responsive across devices  
* Smooth animations and micro-interactions  
* Handles empty states gracefully  
* Consistent visual hierarchy  

---

## ⚡ Enhancements Implemented

* 🌙 Dark mode (Tailwind class strategy)  
* 💾 LocalStorage persistence (transactions, role, theme)  
* 📊 Optimized charts (lazy loading + chunk splitting)  
* 🎬 Framer Motion animations for premium UI feel  
* 💱 INR currency formatting  

---

## 🛠 Tech Stack

* React (Vite)  
* Tailwind CSS  
* Recharts  
* Framer Motion  
* Context API  

---

## 📂 Project Structure

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
  main.jsx
````

---

### ⚙️ Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🧪 Approach

This project was built with the following approach:

* Focus on **clarity over complexity**
* Break UI into **reusable components**
* Keep state management **simple and centralized**
* Use **mock data** to simulate real-world scenarios
* Prioritize **user experience and readability**

---

## 💡 Key Design Decisions

* Chose **Context API over Redux** to keep the project lightweight, reduce boilerplate, and maintain ease of understanding for a scoped application
* Selected **Recharts** for its quick integration, composability, and flexibility in building custom-styled visualizations
* Prioritized **UI clarity and usability** instead of introducing unnecessary architectural complexity
* Designed **dark mode early** to ensure visual consistency and avoid retrofitting styles later in development

---

## ⚠️ Current Limitations

* Data is persisted using **localStorage**, which resets if browser data is cleared
* Insights are based on **basic derived calculations** and can be extended with more advanced analytics logic

---

## 📊 How Requirements Are Met

| Requirement        | Implementation                  |
| ------------------ | ------------------------------- |
| Dashboard Overview | Summary cards + charts          |
| Transactions       | Table with search, filter, sort |
| Role-Based UI      | Admin/Viewer toggle             |
| Insights           | Derived from transaction data   |
| State Management   | Context API                     |
| UI/UX              | Responsive + clean + animated   |

---

## 🚀 Possible Improvements

* Backend/API integration
* Authentication & real RBAC
* Export to CSV/PDF
* Budget tracking & alerts
* Advanced analytics

---

## 📌 Important Note

This project is built for evaluation purposes. It focuses on demonstrating **problem-solving, UI design, and frontend development skills**, rather than production-level completeness.

---

## 📄 License

For personal and educational use.


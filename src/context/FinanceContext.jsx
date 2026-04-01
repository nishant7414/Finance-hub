import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { mockTransactions } from '../data/mockData'
import { generateInsights } from '../utils/insights'

const FinanceContext = createContext(null)

const STORAGE_KEYS = {
  transactions: 'finance-dashboard-transactions',
  role: 'finance-dashboard-role',
  theme: 'finance-dashboard-theme',
}

const defaultFilters = {
  search: '',
  type: 'all',
  sortBy: 'date-desc',
}

const readStorage = (key, fallbackValue) => {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  const storedValue = window.localStorage.getItem(key)

  if (!storedValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

const getInitialTheme = () => {
  const storedTheme = readStorage(STORAGE_KEYS.theme, null)

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }

  return 'light'
}

const createTransactionId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`

const sortTransactions = (transactions, sortBy) => {
  const sorted = [...transactions]

  sorted.sort((left, right) => {
    if (sortBy === 'date-asc') {
      return new Date(left.date) - new Date(right.date)
    }

    if (sortBy === 'amount-desc') {
      return right.amount - left.amount
    }

    if (sortBy === 'amount-asc') {
      return left.amount - right.amount
    }

    return new Date(right.date) - new Date(left.date)
  })

  return sorted
}

const getBalanceHistory = (transactions) => {
  const ascending = [...transactions].sort(
    (left, right) => new Date(left.date) - new Date(right.date),
  )

  let runningBalance = 0

  return ascending.map((transaction) => {
    runningBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount

    return {
      date: transaction.date,
      balance: runningBalance,
      label: `${transaction.category} - ${transaction.date}`,
    }
  })
}

const getSpendingBreakdown = (transactions) => {
  const categoryTotals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') {
      return accumulator
    }

    accumulator[transaction.category] =
      (accumulator[transaction.category] ?? 0) + transaction.amount

    return accumulator
  }, {})

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value)
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() =>
    readStorage(STORAGE_KEYS.transactions, mockTransactions),
  )
  const [filters, setFilters] = useState(defaultFilters)
  const [role, setRole] = useState(() => readStorage(STORAGE_KEYS.role, 'admin'))
  const [theme, setTheme] = useState(getInitialTheme)
  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(role))
  }, [role])

  useEffect(() => {
    const rootElement = window.document.documentElement

    rootElement.classList.toggle('dark', theme === 'dark')
    rootElement.style.colorScheme = theme
    window.localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
  }, [theme])

  const totals = useMemo(
    () =>
      transactions.reduce(
        (summary, transaction) => {
          if (transaction.type === 'income') {
            summary.income += transaction.amount
            summary.balance += transaction.amount
          } else {
            summary.expenses += transaction.amount
            summary.balance -= transaction.amount
          }

          return summary
        },
        { balance: 0, income: 0, expenses: 0 },
      ),
    [transactions],
  )

  const filteredTransactions = useMemo(() => {
    const matchingTransactions = transactions.filter((transaction) => {
      const matchesType =
        filters.type === 'all' ? true : transaction.type === filters.type
      const searchTarget =
        `${transaction.category} ${transaction.description} ${transaction.type}`.toLowerCase()
      const matchesSearch = deferredSearch ? searchTarget.includes(deferredSearch) : true

      return matchesType && matchesSearch
    })

    return sortTransactions(matchingTransactions, filters.sortBy)
  }, [transactions, filters.type, filters.sortBy, deferredSearch])

  const dashboardMetrics = useMemo(
    () => ({
      totals,
      balanceHistory: getBalanceHistory(transactions),
      spendingBreakdown: getSpendingBreakdown(transactions),
      insights: generateInsights(transactions),
    }),
    [transactions, totals],
  )

  const updateFilter = (key, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  const resetFilters = () => setFilters(defaultFilters)

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const addTransaction = (payload) => {
    setTransactions((currentTransactions) =>
      sortTransactions(
        [
          {
            id: createTransactionId(),
            ...payload,
          },
          ...currentTransactions,
        ],
        'date-desc',
      ),
    )
  }

  const updateTransaction = (transactionId, payload) => {
    setTransactions((currentTransactions) =>
      sortTransactions(
        currentTransactions.map((transaction) =>
          transaction.id === transactionId ? { ...transaction, ...payload } : transaction,
        ),
        'date-desc',
      ),
    )
  }

  const deleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
  }

  const value = {
    transactions,
    filteredTransactions,
    filters,
    role,
    setRole,
    theme,
    setTheme,
    toggleTheme,
    updateFilter,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    ...dashboardMetrics,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export const useFinance = () => {
  const context = useContext(FinanceContext)

  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }

  return context
}

import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
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
  category: [],
  type: 'all',
  dateRange: 'all',
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

  return 'dark'
}

const getInitialTransactions = () => {
  const storedTransactions = readStorage(STORAGE_KEYS.transactions, null)

  if (!Array.isArray(storedTransactions)) {
    return sortTransactions(mockTransactions, 'date-desc')
  }

  const mergedTransactions = new Map(mockTransactions.map((transaction) => [transaction.id, transaction]))

  storedTransactions.forEach((transaction) => {
    mergedTransactions.set(transaction.id, transaction)
  })

  return sortTransactions([...mergedTransactions.values()], 'date-desc')
}

const getInitialState = () => ({
  transactions: getInitialTransactions(),
  role: readStorage(STORAGE_KEYS.role, 'admin'),
  theme: getInitialTheme(),
  filters: defaultFilters,
})

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

const isWithinDateRange = (dateValue, dateRange) => {
  if (dateRange === 'all') {
    return true
  }

  const transactionDate = new Date(dateValue)
  const now = new Date()

  if (dateRange === '30d') {
    const start = new Date(now)
    start.setDate(now.getDate() - 30)
    return transactionDate >= start
  }

  if (dateRange === '90d') {
    const start = new Date(now)
    start.setDate(now.getDate() - 90)
    return transactionDate >= start
  }

  if (dateRange === '6m') {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    return transactionDate >= start
  }

  return true
}

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload,
      }
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      }
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      }
    case 'TOGGLE_CATEGORY': {
      const currentCategories = state.filters.category
      const category = action.payload
      const nextCategories = currentCategories.includes(category)
        ? currentCategories.filter((value) => value !== category)
        : [...currentCategories, category]

      return {
        ...state,
        filters: {
          ...state.filters,
          category: nextCategories,
        },
      }
    }
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: defaultFilters,
      }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: sortTransactions(
          [
            {
              id: createTransactionId(),
              ...action.payload,
            },
            ...state.transactions,
          ],
          'date-desc',
        ),
      }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: sortTransactions(
          state.transactions.map((transaction) =>
            transaction.id === action.payload.id
              ? { ...transaction, ...action.payload.values }
              : transaction,
          ),
          'date-desc',
        ),
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        ),
      }
    default:
      return state
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, undefined, getInitialState)
  const deferredSearch = useDeferredValue(state.filters.search.trim().toLowerCase())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(state.transactions))
  }, [state.transactions])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(state.role))
  }, [state.role])

  useEffect(() => {
    const rootElement = window.document.documentElement

    rootElement.classList.toggle('dark', state.theme === 'dark')
    rootElement.style.colorScheme = state.theme
    window.localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state.theme))
  }, [state.theme])

  const totals = useMemo(
    () =>
      state.transactions.reduce(
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
    [state.transactions],
  )

  const availableCategories = useMemo(
    () => [...new Set(state.transactions.map((transaction) => transaction.category))].sort(),
    [state.transactions],
  )

  const filteredTransactions = useMemo(() => {
    const matchingTransactions = state.transactions.filter((transaction) => {
      const matchesSearch = deferredSearch
        ? (transaction.description ?? '').toLowerCase().includes(deferredSearch)
        : true
      const matchesType =
        state.filters.type === 'all' ? true : transaction.type === state.filters.type
      const matchesCategory =
        state.filters.category.length === 0
          ? true
          : state.filters.category.includes(transaction.category)
      const matchesDateRange = isWithinDateRange(transaction.date, state.filters.dateRange)

      return matchesSearch && matchesType && matchesCategory && matchesDateRange
    })

    return sortTransactions(matchingTransactions, state.filters.sortBy)
  }, [
    state.transactions,
    state.filters.type,
    state.filters.category,
    state.filters.dateRange,
    state.filters.sortBy,
    deferredSearch,
  ])

  const insights = useMemo(() => generateInsights(state.transactions), [state.transactions])
  const spendingBreakdown = useMemo(
    () => getSpendingBreakdown(state.transactions),
    [state.transactions],
  )
  const overviewBalanceHistory = useMemo(
    () => insights.monthlySeries.map((item) => ({ label: item.label, balance: item.balance })),
    [insights.monthlySeries],
  )
  const recentTransactions = useMemo(
    () => sortTransactions(state.transactions, 'date-desc').slice(0, 5),
    [state.transactions],
  )

  const updateFilter = (key, value) => {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: { key, value },
    })
  }

  const toggleCategory = (category) => {
    dispatch({
      type: 'TOGGLE_CATEGORY',
      payload: category,
    })
  }

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' })
  }

  const setRole = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role })
  }

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  const toggleTheme = () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark')
  }

  const addTransaction = (payload) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload,
    })
  }

  const updateTransaction = (transactionId, values) => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: {
        id: transactionId,
        values,
      },
    })
  }

  const deleteTransaction = (transactionId) => {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: transactionId,
    })
  }

  const value = {
    transactions: state.transactions,
    filteredTransactions,
    recentTransactions,
    filters: state.filters,
    role: state.role,
    theme: state.theme,
    totals,
    insights,
    availableCategories,
    spendingBreakdown,
    monthlySeries: insights.monthlySeries,
    overviewBalanceHistory,
    updateFilter,
    toggleCategory,
    resetFilters,
    setRole,
    setTheme,
    toggleTheme,
    addTransaction,
    updateTransaction,
    deleteTransaction,
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


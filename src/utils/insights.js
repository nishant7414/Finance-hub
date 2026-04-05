const monthLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: '2-digit',
})

const getRangeChange = (currentValue, previousValue) => {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100
  }

  return Math.round(((currentValue - previousValue) / Math.abs(previousValue)) * 100)
}

const getMonthWindow = (baseDate = new Date(), monthOffset = 0) => {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1)
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset + 1, 1)

  return {
    start,
    end,
    label: monthLabelFormatter.format(start),
  }
}

const getRangeTotals = (transactions, startDate, endDate) =>
  transactions.reduce(
    (totals, transaction) => {
      const transactionDate = new Date(transaction.date)

      if (transactionDate < startDate || transactionDate >= endDate) {
        return totals
      }

      if (transaction.type === 'income') {
        totals.income += transaction.amount
      } else {
        totals.expenses += transaction.amount
      }

      return totals
    },
    { income: 0, expenses: 0 },
  )

const getSavingsRate = ({ income, expenses }) =>
  income === 0 ? 0 : Math.round(((income - expenses) / income) * 100)

export const getHighestSpendingCategory = (transactions) => {
  const totalsByCategory = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') {
      return accumulator
    }

    accumulator[transaction.category] =
      (accumulator[transaction.category] ?? 0) + transaction.amount

    return accumulator
  }, {})

  return Object.entries(totalsByCategory).reduce(
    (highest, [category, amount]) =>
      amount > highest.amount ? { category, amount } : highest,
    { category: 'No expenses yet', amount: 0 },
  )
}

export const getTopExpenseCategories = (transactions, limit = 3) => {
  const categoryTotals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') {
      return accumulator
    }

    accumulator[transaction.category] =
      (accumulator[transaction.category] ?? 0) + transaction.amount

    return accumulator
  }, {})

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, limit)
}

export const buildMonthlySeries = (transactions, monthCount = 6, baseDate = new Date()) => {
  const oldestStart = new Date(baseDate.getFullYear(), baseDate.getMonth() - (monthCount - 1), 1)

  let runningBalance = transactions.reduce((balance, transaction) => {
    const transactionDate = new Date(transaction.date)

    if (transactionDate >= oldestStart) {
      return balance
    }

    return balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount)
  }, 0)

  return Array.from({ length: monthCount }, (_, index) => {
    const monthOffset = index - (monthCount - 1)
    const monthWindow = getMonthWindow(baseDate, monthOffset)
    const totals = getRangeTotals(transactions, monthWindow.start, monthWindow.end)
    const net = totals.income - totals.expenses

    runningBalance += net

    return {
      key: `${monthWindow.start.getFullYear()}-${monthWindow.start.getMonth()}`,
      label: monthWindow.label,
      income: totals.income,
      expenses: totals.expenses,
      net,
      savingsRate: getSavingsRate(totals),
      balance: runningBalance,
    }
  })
}

export const getMonthlyComparison = (transactions, baseDate = new Date()) => {
  const currentWindow = getMonthWindow(baseDate, 0)
  const previousWindow = getMonthWindow(baseDate, -1)
  const current = getRangeTotals(transactions, currentWindow.start, currentWindow.end)
  const previous = getRangeTotals(transactions, previousWindow.start, previousWindow.end)

  current.net = current.income - current.expenses
  previous.net = previous.income - previous.expenses
  current.savingsRate = getSavingsRate(current)
  previous.savingsRate = getSavingsRate(previous)

  return {
    current,
    previous,
    incomeChange: getRangeChange(current.income, previous.income),
    expenseChange: getRangeChange(current.expenses, previous.expenses),
    savingsRateChange: getRangeChange(current.savingsRate, previous.savingsRate),
  }
}

export const generateInsights = (transactions, baseDate = new Date()) => {
  const monthlySeries = buildMonthlySeries(transactions, 6, baseDate)
  const highestCategory = getHighestSpendingCategory(transactions)
  const topCategories = getTopExpenseCategories(transactions)
  const totalExpenses = transactions.reduce(
    (total, transaction) =>
      transaction.type === 'expense' ? total + transaction.amount : total,
    0,
  )
  const monthlyComparison = getMonthlyComparison(transactions, baseDate)

  return {
    highestCategory,
    topCategories,
    totalExpenses,
    highestCategoryShare:
      totalExpenses === 0 ? 0 : Math.round((highestCategory.amount / totalExpenses) * 100),
    monthlyComparison,
    savingsRate: monthlyComparison.current.savingsRate,
    monthlySeries,
  }
}

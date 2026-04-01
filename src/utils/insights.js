const getMonthBounds = (baseDate = new Date()) => {
  const currentStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const nextStart = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1)
  const previousStart = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1)

  return { currentStart, nextStart, previousStart }
}

const getExpenseTotalForRange = (transactions, startDate, endDate) =>
  transactions.reduce((total, transaction) => {
    const transactionDate = new Date(transaction.date)

    if (
      transaction.type === 'expense' &&
      transactionDate >= startDate &&
      transactionDate < endDate
    ) {
      return total + transaction.amount
    }

    return total
  }, 0)

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

export const getMonthlyComparison = (transactions, baseDate = new Date()) => {
  const { currentStart, nextStart, previousStart } = getMonthBounds(baseDate)
  const currentTotal = getExpenseTotalForRange(transactions, currentStart, nextStart)
  const previousTotal = getExpenseTotalForRange(transactions, previousStart, currentStart)
  const difference = currentTotal - previousTotal
  const percentageChange =
    previousTotal === 0
      ? currentTotal > 0
        ? 100
        : 0
      : Math.round((difference / previousTotal) * 100)

  return {
    currentTotal,
    previousTotal,
    difference,
    percentageChange,
    direction:
      difference > 0 ? 'increased' : difference < 0 ? 'decreased' : 'stayed flat',
  }
}

export const generateInsights = (transactions) => {
  const income = transactions.reduce(
    (total, transaction) =>
      transaction.type === 'income' ? total + transaction.amount : total,
    0,
  )
  const expenses = transactions.reduce(
    (total, transaction) =>
      transaction.type === 'expense' ? total + transaction.amount : total,
    0,
  )

  const highestCategory = getHighestSpendingCategory(transactions)
  const monthlyComparison = getMonthlyComparison(transactions)
  const savingsRate = income === 0 ? 0 : Math.round(((income - expenses) / income) * 100)

  return {
    highestCategory,
    monthlyComparison,
    savingsRate,
    cards: [
      {
        id: 'highest-category',
        title: 'Highest spending category',
        value: highestCategory.category,
        description:
          highestCategory.amount > 0
            ? `${highestCategory.category} leads your outflow.`
            : 'Add expense entries to unlock this insight.',
        tone: 'teal',
        amount: highestCategory.amount,
      },
      {
        id: 'monthly-comparison',
        title: 'Month over month',
        value: `${Math.abs(monthlyComparison.percentageChange)}%`,
        description: `Spending ${monthlyComparison.direction} compared with last month.`,
        tone: monthlyComparison.difference > 0 ? 'amber' : 'slate',
        amount: monthlyComparison.currentTotal,
      },
      {
        id: 'savings-rate',
        title: 'Savings rate',
        value: `${savingsRate}%`,
        description:
          savingsRate >= 20
            ? 'Healthy breathing room between income and expenses.'
            : 'A tighter margin this cycle, worth watching.',
        tone: savingsRate >= 20 ? 'teal' : 'amber',
        amount: income - expenses,
      },
    ],
  }
}

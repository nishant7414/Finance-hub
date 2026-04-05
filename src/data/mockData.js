const formatDate = (date) => date.toISOString().split('T')[0]

const createMonthDate = (baseDate, monthOffset, day) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, day)

const today = new Date()
const monthOffsets = [-5, -4, -3, -2, -1, 0]

const recurringTransactions = [
  {
    day: 1,
    category: 'Salary',
    description: 'Primary salary credit',
    type: 'income',
    baseAmount: 88750,
    monthStep: 1200,
  },
  {
    day: 3,
    category: 'Investments',
    description: 'Portfolio dividend payout',
    type: 'income',
    baseAmount: 12800,
    monthStep: 450,
  },
  {
    day: 5,
    category: 'Housing',
    description: 'Rent and maintenance payment',
    type: 'expense',
    baseAmount: 25000,
    monthStep: 0,
  },
  {
    day: 7,
    category: 'Freelance',
    description: 'Retainer payment from design client',
    type: 'income',
    baseAmount: 16200,
    monthStep: 750,
  },
  {
    day: 8,
    category: 'Food & Dining',
    description: 'Groceries and dining out',
    type: 'expense',
    baseAmount: 6400,
    monthStep: 180,
  },
  {
    day: 11,
    category: 'Transport',
    description: 'Fuel, metro, and cab rides',
    type: 'expense',
    baseAmount: 3100,
    monthStep: 120,
  },
  {
    day: 14,
    category: 'Healthcare',
    description: 'Medicines and preventive care',
    type: 'expense',
    baseAmount: 2400,
    monthStep: 80,
  },
  {
    day: 17,
    category: 'Entertainment',
    description: 'Streaming, movies, and events',
    type: 'expense',
    baseAmount: 2250,
    monthStep: 110,
  },
  {
    day: 20,
    category: 'Utilities',
    description: 'Internet, mobile, and electricity',
    type: 'expense',
    baseAmount: 3950,
    monthStep: 95,
  },
  {
    day: 22,
    category: 'Insurance',
    description: 'Health and vehicle insurance premium',
    type: 'expense',
    baseAmount: 1950,
    monthStep: 70,
  },
  {
    day: 24,
    category: 'Shopping',
    description: 'Home and personal purchases',
    type: 'expense',
    baseAmount: 4700,
    monthStep: 160,
  },
  {
    day: 26,
    category: 'Subscriptions',
    description: 'Software, cloud, and app subscriptions',
    type: 'expense',
    baseAmount: 1450,
    monthStep: 65,
  },
]

const specialTransactions = [
  {
    monthOffset: -5,
    day: 27,
    category: 'Investments',
    description: 'Quarterly bonus investment deposit',
    type: 'income',
    amount: 22000,
  },
  {
    monthOffset: -5,
    day: 29,
    category: 'Housing',
    description: 'Furniture upgrade for home office',
    type: 'expense',
    amount: 7800,
  },
  {
    monthOffset: -4,
    day: 27,
    category: 'Food & Dining',
    description: 'Festival dinner and hosting spend',
    type: 'expense',
    amount: 9800,
  },
  {
    monthOffset: -4,
    day: 29,
    category: 'Shopping',
    description: 'Seasonal wardrobe refresh',
    type: 'expense',
    amount: 6900,
  },
  {
    monthOffset: -3,
    day: 27,
    category: 'Transport',
    description: 'Outstation trip and airport transfers',
    type: 'expense',
    amount: 7600,
  },
  {
    monthOffset: -2,
    day: 27,
    category: 'Healthcare',
    description: 'Comprehensive health screening',
    type: 'expense',
    amount: 9100,
  },
  {
    monthOffset: -1,
    day: 27,
    category: 'Entertainment',
    description: 'Concert tickets and weekend events',
    type: 'expense',
    amount: 8400,
  },
  {
    monthOffset: 0,
    day: 27,
    category: 'Investments',
    description: 'Performance incentive payout',
    type: 'income',
    amount: 26000,
  },
]

const generatedTransactions = monthOffsets.flatMap((monthOffset, monthIndex) =>
  recurringTransactions.map((template, templateIndex) => ({
    id: `txn-${monthIndex + 1}-${templateIndex + 1}`,
    date: formatDate(createMonthDate(today, monthOffset, template.day)),
    amount: template.baseAmount + monthIndex * template.monthStep,
    category: template.category,
    description: template.description,
    type: template.type,
  })),
)

const mockTransactions = [...generatedTransactions]

specialTransactions.forEach((transaction, index) => {
  mockTransactions.push({
    id: `special-${index + 1}`,
    date: formatDate(createMonthDate(today, transaction.monthOffset, transaction.day)),
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    type: transaction.type,
  })
})

export const seedSummary = {
  transactionCount: mockTransactions.length,
  monthsCovered: monthOffsets.length,
}

export { mockTransactions }

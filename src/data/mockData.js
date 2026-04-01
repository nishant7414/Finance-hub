const formatDate = (date) => date.toISOString().split('T')[0]

const addDays = (date, offset) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + offset)
  return nextDate
}

const today = new Date()

const seedTransactions = [
  {
    id: 'txn-1',
    date: formatDate(addDays(today, -47)),
    amount: 4200,
    category: 'Salary',
    description: 'Primary salary deposit',
    type: 'income',
  },
  {
    id: 'txn-2',
    date: formatDate(addDays(today, -43)),
    amount: 1240,
    category: 'Rent',
    description: 'Apartment rent payment',
    type: 'expense',
  },
  {
    id: 'txn-3',
    date: formatDate(addDays(today, -39)),
    amount: 210,
    category: 'Insurance',
    description: 'Health insurance premium',
    type: 'expense',
  },
  {
    id: 'txn-4',
    date: formatDate(addDays(today, -36)),
    amount: 540,
    category: 'Freelance',
    description: 'Client payment for landing page work',
    type: 'income',
  },
  {
    id: 'txn-5',
    date: formatDate(addDays(today, -33)),
    amount: 124,
    category: 'Utilities',
    description: 'Electricity and water bill',
    type: 'expense',
  },
  {
    id: 'txn-6',
    date: formatDate(addDays(today, -30)),
    amount: 156,
    category: 'Shopping',
    description: 'Home office accessories',
    type: 'expense',
  },
  {
    id: 'txn-7',
    date: formatDate(addDays(today, -28)),
    amount: 4200,
    category: 'Salary',
    description: 'Primary salary deposit',
    type: 'income',
  },
  {
    id: 'txn-8',
    date: formatDate(addDays(today, -24)),
    amount: 260,
    category: 'Travel',
    description: 'Weekend train and hotel booking',
    type: 'expense',
  },
  {
    id: 'txn-9',
    date: formatDate(addDays(today, -19)),
    amount: 118,
    category: 'Groceries',
    description: 'Monthly grocery stock-up',
    type: 'expense',
  },
  {
    id: 'txn-10',
    date: formatDate(addDays(today, -16)),
    amount: 76,
    category: 'Entertainment',
    description: 'Streaming and movie night',
    type: 'expense',
  },
  {
    id: 'txn-11',
    date: formatDate(addDays(today, -12)),
    amount: 320,
    category: 'Investments',
    description: 'ETF dividend payout',
    type: 'income',
  },
  {
    id: 'txn-12',
    date: formatDate(addDays(today, -10)),
    amount: 58,
    category: 'Transport',
    description: 'Fuel and metro card top-up',
    type: 'expense',
  },
  {
    id: 'txn-13',
    date: formatDate(addDays(today, -8)),
    amount: 4200,
    category: 'Salary',
    description: 'Primary salary deposit',
    type: 'income',
  },
  {
    id: 'txn-14',
    date: formatDate(addDays(today, -6)),
    amount: 132,
    category: 'Utilities',
    description: 'Internet and phone bill',
    type: 'expense',
  },
  {
    id: 'txn-15',
    date: formatDate(addDays(today, -4)),
    amount: 1240,
    category: 'Rent',
    description: 'Apartment rent payment',
    type: 'expense',
  },
  {
    id: 'txn-16',
    date: formatDate(addDays(today, -2)),
    amount: 92,
    category: 'Groceries',
    description: 'Fresh produce and pantry refill',
    type: 'expense',
  },
  {
    id: 'txn-17',
    date: formatDate(addDays(today, -1)),
    amount: 44,
    category: 'Dining',
    description: 'Coffee and lunch meetings',
    type: 'expense',
  },
  {
    id: 'txn-18',
    date: formatDate(today),
    amount: 680,
    category: 'Freelance',
    description: 'Quick turnaround design sprint',
    type: 'income',
  },
]

export const mockTransactions = seedTransactions.sort(
  (left, right) => new Date(right.date) - new Date(left.date),
)

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const formatCurrency = (value) => currencyFormatter.format(value)

export const formatAmount = (value, type) =>
  `${type === 'expense' ? '-' : '+'}${formatCurrency(Math.abs(value))}`

export const formatDisplayDate = (value) => dateFormatter.format(new Date(value))

export const todayAsInput = () => new Date().toISOString().split('T')[0]

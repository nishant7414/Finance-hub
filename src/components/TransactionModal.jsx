import { useEffect, useState } from 'react'
import { todayAsInput } from '../utils/formatters'

const createEmptyForm = () => ({
  date: todayAsInput(),
  amount: '',
  category: '',
  description: '',
  type: 'expense',
})

export default function TransactionModal({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(createEmptyForm)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormData(
      initialValues
        ? {
            ...initialValues,
            amount: String(initialValues.amount),
          }
        : createEmptyForm(),
    )
  }, [initialValues, isOpen])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      category: formData.category.trim(),
      description: formData.description.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="panel w-full max-w-2xl p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">{mode === 'edit' ? 'Update entry' : 'New entry'}</span>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Keep the ledger fresh with a clear category, amount, and date.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Date</span>
            <input
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Amount
            </span>
            <input
              required
              min="1"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="field"
              placeholder="1200"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Category
            </span>
            <input
              required
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="field"
              placeholder="Groceries"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Type</span>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="field"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Description
            </span>
            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="field resize-none"
              placeholder="Optional note about this transaction"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="action-button border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-button bg-slate-900 text-white hover:bg-slate-800 dark:bg-aurora dark:hover:bg-teal-500"
            >
              {mode === 'edit' ? 'Save changes' : 'Create transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

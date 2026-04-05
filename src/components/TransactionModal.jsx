import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { buttonHover, buttonTap, motionEase, springTransition } from '../utils/motion'
import { todayAsInput } from '../utils/formatters'

const createEmptyForm = () => ({
  date: todayAsInput(),
  amount: '',
  category: '',
  description: '',
  type: 'expense',
})

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: motionEase,
    },
  },
}

const modalVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    transition: {
      duration: 0.18,
      ease: motionEase,
    },
  },
}

export default function TransactionModal({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSubmit,
}) {
  const { availableCategories } = useFinance()
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
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
          <motion.button
            type="button"
            aria-label="Close transaction modal"
            onClick={onClose}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <div className="relative flex min-h-full items-start justify-center sm:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              onClick={(event) => event.stopPropagation()}
              className="panel max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto p-5 will-change-transform sm:p-7"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="section-label">{mode === 'edit' ? 'Update Entry' : 'New Entry'}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Capture the date, description, category, and amount so your dashboard stays accurate.
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  transition={springTransition}
                  className="action-button w-full border border-slate-200/80 bg-white/90 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900 sm:w-auto"
                >
                  Close
                </motion.button>
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
                    placeholder="12000"
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
                    list="transaction-categories"
                    value={formData.category}
                    onChange={handleChange}
                    className="field"
                    placeholder="Food & Dining"
                  />
                  <datalist id="transaction-categories">
                    {availableCategories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
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
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    transition={springTransition}
                    className="action-button w-full border border-slate-200/80 bg-white/90 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900 sm:w-auto"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    transition={springTransition}
                    className="action-button w-full bg-indigo-500 text-white shadow-[0_18px_40px_-22px_rgba(99,102,241,0.85)] hover:bg-indigo-400 sm:w-auto"
                  >
                    {mode === 'edit' ? 'Save Changes' : 'Create Transaction'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

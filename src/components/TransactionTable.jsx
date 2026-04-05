import { motion } from 'framer-motion'
import EmptyState from './EmptyState'
import { formatCurrency, formatDisplayDate } from '../utils/formatters'
import { buttonHover, buttonTap, fadeUp, rowHover, sectionStagger, springTransition } from '../utils/motion'

const typeFilterOptions = [
  { value: 'all', label: 'All types' },
  { value: 'income', label: 'Income only' },
  { value: 'expense', label: 'Expense only' },
]

const dateRangeOptions = [
  { value: 'all', label: 'All time' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '6m', label: 'Last 6 months' },
]

const sortOptions = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Amount high to low' },
  { value: 'amount-asc', label: 'Amount low to high' },
]

const tableDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formatTableDate = (value) => tableDateFormatter.format(new Date(value))

function CategoryChip({ category, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={() => onClick(category)}
      whileHover={buttonHover}
      whileTap={buttonTap}
      transition={springTransition}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
        active
          ? 'border-indigo-500/25 bg-indigo-500/10 text-indigo-500 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-200'
          : 'border-slate-200/80 bg-slate-100/90 text-slate-500 hover:bg-slate-200 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-900'
      }`}
    >
      {category}
    </motion.button>
  )
}

function TransactionTypeBadge({ type }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
        type === 'income'
          ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300'
          : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300'
      }`}
    >
      {type}
    </span>
  )
}

function MobileTransactionCard({ transaction, role, onEdit, onDelete }) {
  return (
    <motion.article
      whileHover={rowHover}
      transition={springTransition}
      className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-sm will-change-transform dark:border-white/10 dark:bg-slate-900/75"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-950 dark:text-white">
            {transaction.description || transaction.category}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{transaction.category}</p>
        </div>

        <p
          className={`shrink-0 text-base font-semibold ${
            transaction.type === 'income'
              ? 'text-emerald-500 dark:text-emerald-300'
              : 'text-rose-500 dark:text-rose-300'
          }`}
        >
          {formatCurrency(transaction.amount)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TransactionTypeBadge type={transaction.type} />
        <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          {transaction.category}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{formatTableDate(transaction.date)}</p>

      {role === 'admin' ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            onClick={() => onEdit(transaction)}
            whileHover={buttonHover}
            whileTap={buttonTap}
            transition={springTransition}
            className="rounded-2xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onDelete(transaction.id)}
            whileHover={buttonHover}
            whileTap={buttonTap}
            transition={springTransition}
            className="rounded-2xl bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-500 transition-colors duration-200 hover:bg-rose-500/20 dark:text-rose-300"
          >
            Delete
          </motion.button>
        </div>
      ) : null}
    </motion.article>
  )
}

export default function TransactionTable({
  transactions,
  filters,
  availableCategories,
  onFilterChange,
  onToggleCategory,
  onResetFilters,
  role,
  onEdit,
  onDelete,
  onCreate,
}) {
  const hasFilters =
    filters.search ||
    filters.category.length > 0 ||
    filters.type !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.sortBy !== 'date-desc'

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={sectionStagger(0.04)}
      className="panel overflow-hidden"
    >
      <motion.div variants={fadeUp} className="border-b border-slate-200/70 px-5 py-5 dark:border-white/10 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="section-label">Ledger</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Transactions
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Search by description, filter by category, type, and date range, then sort the ledger the way you need.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {role === 'admin' ? (
              <motion.button
                type="button"
                onClick={onCreate}
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={springTransition}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-22px_rgba(99,102,241,0.95)] transition-colors duration-200 hover:from-indigo-400 hover:to-blue-400"
              >
                Add Transaction
              </motion.button>
            ) : null}

            <motion.button
              type="button"
              onClick={onResetFilters}
              whileHover={buttonHover}
              whileTap={buttonTap}
              transition={springTransition}
              className={`inline-flex items-center rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                hasFilters
                  ? 'border-indigo-500/25 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-200'
                  : 'border-slate-200/80 bg-white/90 text-slate-600 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              Clear Filters
            </motion.button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_220px_220px_220px]">
          <label className="space-y-2 lg:col-span-2 xl:col-span-1">
            <span className="section-label">Search Description</span>
            <input
              type="text"
              value={filters.search}
              onChange={(event) => onFilterChange('search', event.target.value)}
              placeholder="Search by description"
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="section-label">Type</span>
            <select
              value={filters.type}
              onChange={(event) => onFilterChange('type', event.target.value)}
              className="field"
            >
              {typeFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="section-label">Date Range</span>
            <select
              value={filters.dateRange}
              onChange={(event) => onFilterChange('dateRange', event.target.value)}
              className="field"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="section-label">Sort</span>
            <select
              value={filters.sortBy}
              onChange={(event) => onFilterChange('sortBy', event.target.value)}
              className="field"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <CategoryChip
                key={category}
                category={category}
                active={filters.category.includes(category)}
                onClick={onToggleCategory}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {transactions.length === 0 ? (
        <motion.div variants={fadeUp} className="p-5 sm:p-6">
          <EmptyState
            title="No transactions match this view"
            description={
              hasFilters
                ? 'Try clearing one or more filters to bring matching transactions back into view.'
                : 'Create your first transaction to populate the ledger.'
            }
            actionLabel={role === 'admin' && !hasFilters ? 'Add transaction' : undefined}
            onAction={role === 'admin' && !hasFilters ? onCreate : undefined}
          />
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="grid gap-3 p-5 md:hidden sm:p-6">
            {transactions.map((transaction) => (
              <MobileTransactionCard
                key={transaction.id}
                transaction={transaction}
                role={role}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Description
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Amount
                    </th>
                    {role === 'admin' ? (
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                        Actions
                      </th>
                    ) : null}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
                  {transactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      whileHover={rowHover}
                      transition={springTransition}
                      className="will-change-transform transition-colors duration-200 hover:bg-slate-50/85 dark:hover:bg-slate-900/65"
                    >
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {formatTableDate(transaction.date)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="min-w-[220px]">
                          <p className="text-sm font-semibold text-slate-950 dark:text-white">
                            {transaction.description || 'No description added'}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Logged on {formatDisplayDate(transaction.date)}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <TransactionTypeBadge type={transaction.type} />
                      </td>
                      <td
                        className={`whitespace-nowrap px-6 py-5 text-right text-sm font-semibold ${
                          transaction.type === 'income'
                            ? 'text-emerald-500 dark:text-emerald-300'
                            : 'text-rose-500 dark:text-rose-300'
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </td>
                      {role === 'admin' ? (
                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <motion.button
                              type="button"
                              onClick={() => onEdit(transaction)}
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                              transition={springTransition}
                              className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => onDelete(transaction.id)}
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                              transition={springTransition}
                              className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-500 transition-colors duration-200 hover:bg-rose-500/20 dark:text-rose-300"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      ) : null}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  )
}

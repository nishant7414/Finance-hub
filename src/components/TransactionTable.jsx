import EmptyState from './EmptyState'
import { formatAmount, formatDisplayDate } from '../utils/formatters'

const typeFilterOptions = [
  { value: 'all', label: 'All types' },
  { value: 'income', label: 'Income only' },
  { value: 'expense', label: 'Expense only' },
]

const sortOptions = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Amount high to low' },
  { value: 'amount-asc', label: 'Amount low to high' },
]

export default function TransactionTable({
  transactions,
  filters,
  onFilterChange,
  onResetFilters,
  role,
  onEdit,
  onDelete,
  onCreate,
}) {
  const hasFilters = filters.search || filters.type !== 'all' || filters.sortBy !== 'date-desc'

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">Transactions</span>
            <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
              Transaction history
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Search, filter, and sort records to inspect cash flow quickly.
            </p>
          </div>

          {role === 'admin' ? (
            <button
              type="button"
              onClick={onCreate}
              className="action-button bg-slate-900 text-white hover:bg-slate-800 dark:bg-aurora dark:hover:bg-teal-500"
            >
              Add transaction
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_220px_220px_auto]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Search
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(event) => onFilterChange('search', event.target.value)}
              placeholder="Search category, description, or type"
              className="field"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Filter
            </span>
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Sort
            </span>
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

          <div className="flex items-end">
            <button
              type="button"
              onClick={onResetFilters}
              disabled={!hasFilters}
              className="action-button w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No transactions match this view"
            description={
              hasFilters
                ? 'Try resetting the search and filters to reveal more records.'
                : 'Create your first transaction to populate the ledger.'
            }
            actionLabel={role === 'admin' && !hasFilters ? 'Add transaction' : undefined}
            onAction={role === 'admin' && !hasFilters ? onCreate : undefined}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[26px] border border-slate-200/90 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/70">
              <thead className="bg-slate-50/90 dark:bg-slate-900/80">
                <tr className="text-left">
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Date
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Category
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Type
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Amount
                  </th>
                  {role === 'admin' ? (
                    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formatDisplayDate(transaction.date)}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {transaction.category}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {transaction.description || 'No description added'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                          transaction.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-4 text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </td>
                    {role === 'admin' ? (
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(transaction)}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(transaction.id)}
                            className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

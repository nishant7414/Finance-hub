import { useMemo, useState } from 'react'
import Charts from '../components/Charts'
import InsightCard from '../components/InsightCard'
import Sidebar from '../components/Sidebar'
import SummaryCard from '../components/SummaryCard'
import TransactionModal from '../components/TransactionModal'
import TransactionTable from '../components/TransactionTable'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const {
    totals,
    filters,
    filteredTransactions,
    transactions,
    role,
    setRole,
    updateFilter,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    balanceHistory,
    spendingBreakdown,
    insights,
  } = useFinance()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const monthlyMessage = useMemo(() => {
    const comparison = insights.monthlyComparison

    if (comparison.previousTotal === 0 && comparison.currentTotal === 0) {
      return 'No monthly expense movement yet.'
    }

    if (comparison.previousTotal === 0) {
      return `Spending increased by ${comparison.percentageChange}% from a zero baseline.`
    }

    return `Spending ${comparison.direction} by ${Math.abs(
      comparison.percentageChange,
    )}% compared with last month.`
  }, [insights.monthlyComparison])

  const closeModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(false)
  }

  const openCreateModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleSubmitTransaction = (payload) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload)
    } else {
      addTransaction(payload)
    }

    closeModal()
  }

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <Sidebar
            role={role}
            onRoleChange={setRole}
            onAddTransaction={openCreateModal}
            totalBalance={totals.balance}
            transactionCount={transactions.length}
          />

          <main className="space-y-6">
            <section className="panel overflow-hidden p-6 sm:p-8">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
                <div>
                  <span className="eyebrow">Dashboard overview</span>
                  <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                    Clear finance signals, without the clutter.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                    Watch balance movement, inspect category pressure, and manage
                    transactions from one clean workspace.
                  </p>
                </div>

                <div className="rounded-[28px] border border-aurora/10 bg-gradient-to-br from-aurora/10 via-white to-ember/10 p-5 dark:border-aurora/20 dark:from-aurora/15 dark:via-slate-900 dark:to-ember/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Latest insight
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {monthlyMessage}
                  </p>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Highest spend is currently in{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {insights.highestCategory.category}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <SummaryCard
                title="Total Balance"
                value={formatCurrency(totals.balance)}
                subtitle="Net position after subtracting all expenses from income."
                accent="teal"
              />
              <SummaryCard
                title="Total Income"
                value={formatCurrency(totals.income)}
                subtitle="All incoming cash flow tracked across salary, freelance, and dividends."
                accent="slate"
              />
              <SummaryCard
                title="Total Expenses"
                value={formatCurrency(totals.expenses)}
                subtitle="Every outgoing transaction grouped into your tracked categories."
                accent="amber"
              />
            </section>

            <Charts
              balanceData={balanceHistory}
              spendingData={spendingBreakdown}
              canCreateTransaction={role === 'admin'}
              onAdd={openCreateModal}
            />

            <section className="panel p-5 sm:p-6">
              <div>
                <span className="eyebrow">Insights</span>
                <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
                  Smart signals
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Dynamic highlights generated directly from the transaction data.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {insights.cards.map((card) => (
                  <InsightCard key={card.id} {...card} />
                ))}
              </div>
            </section>

            <TransactionTable
              transactions={filteredTransactions}
              filters={filters}
              onFilterChange={updateFilter}
              onResetFilters={resetFilters}
              role={role}
              onEdit={handleEditTransaction}
              onDelete={deleteTransaction}
              onCreate={openCreateModal}
            />
          </main>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        mode={editingTransaction ? 'edit' : 'create'}
        initialValues={editingTransaction}
        onClose={closeModal}
        onSubmit={handleSubmitTransaction}
      />
    </div>
  )
}

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Charts from '../components/Charts'
import SummaryCard from '../components/SummaryCard'
import { useTransactionModalActions } from '../components/AppShell'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, formatDisplayDate } from '../utils/formatters'
import { cardHover, fadeUp, rowHover, sectionStagger, springTransition } from '../utils/motion'

const getTrendTone = (value) => (value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral')

const formatTrend = (value) => {
  const rounded = Math.round(value * 10) / 10
  const decimals = Number.isInteger(rounded) ? 0 : 1
  const sign = rounded > 0 ? '+' : ''

  return `${sign}${rounded.toFixed(decimals)}%`
}

export default function Dashboard() {
  const {
    insights,
    overviewBalanceHistory,
    recentTransactions,
    role,
    spendingBreakdown,
    totals,
  } = useFinance()
  const { openCreateModal } = useTransactionModalActions()

  const summaryCards = useMemo(() => {
    const current = insights.monthlyComparison.current
    const previous = insights.monthlyComparison.previous
    const currentBalance = overviewBalanceHistory.at(-1)?.balance ?? totals.balance
    const previousBalance = overviewBalanceHistory.at(-2)?.balance ?? currentBalance
    const balanceChange =
      previousBalance === 0
        ? currentBalance === 0
          ? 0
          : 100
        : ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100
    const expenseTrend = -insights.monthlyComparison.expenseChange

    return [
      {
        title: 'Total Balance',
        value: formatCurrency(totals.balance),
        subtitle: 'Your net position across all tracked income and expense records.',
        icon: 'balance',
        trendLabel: formatTrend(balanceChange),
        trendTone: getTrendTone(balanceChange),
      },
      {
        title: 'Monthly Income',
        value: formatCurrency(current.income),
        subtitle: 'Income booked in the current month compared with last month.',
        icon: 'income',
        trendLabel: formatTrend(insights.monthlyComparison.incomeChange),
        trendTone: getTrendTone(insights.monthlyComparison.incomeChange),
      },
      {
        title: 'Monthly Expenses',
        value: formatCurrency(current.expenses),
        subtitle: 'Expense movement this month with healthier drops treated as positive.',
        icon: 'expense',
        trendLabel: formatTrend(expenseTrend),
        trendTone: getTrendTone(expenseTrend),
      },
      {
        title: 'Savings Rate',
        value: `${insights.savingsRate}%`,
        subtitle: 'Current-month savings rate based on income versus expenses.',
        icon: 'rate',
        trendLabel: formatTrend(insights.monthlyComparison.savingsRateChange),
        trendTone: getTrendTone(insights.monthlyComparison.savingsRateChange),
      },
    ]
  }, [insights, overviewBalanceHistory, totals.balance])

  return (
    <motion.div initial="hidden" animate="visible" variants={sectionStagger(0.04)} className="space-y-6">
      <motion.section variants={sectionStagger(0.02)} className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </motion.section>

      <Charts
        balanceData={overviewBalanceHistory}
        spendingData={spendingBreakdown}
        canCreateTransaction={role === 'admin'}
        onAdd={openCreateModal}
      />

      <motion.section variants={sectionStagger(0.08)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <motion.article
          variants={fadeUp}
          whileHover={cardHover}
          transition={springTransition}
          className="panel p-5 will-change-transform sm:p-6"
        >
          <p className="section-label">Highlight</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Highest Spending Category
          </h2>

          <div className="mt-6 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-500 dark:bg-rose-500/20 dark:text-rose-300">
                  Top Expense Driver
                </span>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {insights.highestCategory.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Share of total spend</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {insights.highestCategoryShare}%
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="section-label">Amount</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                  {formatCurrency(insights.highestCategory.amount)}
                </p>
              </div>

              <Link
                to="/insights"
                className="inline-flex items-center rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                View insights
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {insights.topCategories.map((category) => (
              <span
                key={category.category}
                className="rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300"
              >
                {category.category}
              </span>
            ))}
          </div>
        </motion.article>

        <motion.article
          variants={fadeUp}
          whileHover={cardHover}
          transition={springTransition}
          className="panel p-5 will-change-transform sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Activity</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Recent Transactions
              </h2>
            </div>

            <Link
              to="/transactions"
              className="inline-flex items-center rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Open ledger
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                whileHover={rowHover}
                transition={springTransition}
                className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200/70 bg-slate-50/80 px-4 py-3 will-change-transform dark:border-white/10 dark:bg-slate-950/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {transaction.category} � {formatDisplayDate(transaction.date)}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-sm font-semibold ${
                    transaction.type === 'income'
                      ? 'text-emerald-500 dark:text-emerald-300'
                      : 'text-rose-500 dark:text-rose-300'
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.article>
      </motion.section>
    </motion.div>
  )
}
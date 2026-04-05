import { motion } from 'framer-motion'
import { Suspense, lazy, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { buttonHover, buttonTap, fadeIn, fadeUp, sectionStagger, springTransition } from '../utils/motion'
import EmptyState from './EmptyState'
import { formatCurrency } from '../utils/formatters'

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6']

const compactNumberFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatCompactCurrency = (value) => `?${compactNumberFormatter.format(Math.abs(value))}`
const currencyTooltipFormatter = (value) => formatCurrency(value)

const BalanceLineChart = lazy(async () => {
  const [
    { LineChart },
    { Line },
    { XAxis },
    { YAxis },
    { CartesianGrid },
    { ResponsiveContainer },
    { Tooltip },
  ] = await Promise.all([
    import('recharts/es6/chart/LineChart.js'),
    import('recharts/es6/cartesian/Line.js'),
    import('recharts/es6/cartesian/XAxis.js'),
    import('recharts/es6/cartesian/YAxis.js'),
    import('recharts/es6/cartesian/CartesianGrid.js'),
    import('recharts/es6/component/ResponsiveContainer.js'),
    import('recharts/es6/component/Tooltip.js'),
  ])

  function BalanceLineChartComponent({ data, palette }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={palette.gridColor} strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: palette.axisColor, fontSize: 12 }}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tickLine={false}
            axisLine={false}
            tick={{ fill: palette.axisColor, fontSize: 12 }}
          />
          <Tooltip
            formatter={currencyTooltipFormatter}
            contentStyle={palette.tooltipContentStyle}
            labelStyle={{ color: palette.tooltipLabelColor }}
            itemStyle={{ color: palette.tooltipValueColor }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={palette.lineColor}
            strokeWidth={3}
            dot={{ r: 4, fill: palette.dotFill, stroke: palette.dotStroke, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: palette.dotFill, stroke: palette.dotStroke, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return { default: BalanceLineChartComponent }
})

const SpendingDonutChart = lazy(async () => {
  const [{ PieChart }, { Pie }, { Cell }, { ResponsiveContainer }, { Tooltip }] =
    await Promise.all([
      import('recharts/es6/chart/PieChart.js'),
      import('recharts/es6/polar/Pie.js'),
      import('recharts/es6/component/Cell.js'),
      import('recharts/es6/component/ResponsiveContainer.js'),
      import('recharts/es6/component/Tooltip.js'),
    ])

  function SpendingDonutChartComponent({ data, palette }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={currencyTooltipFormatter}
            contentStyle={palette.tooltipContentStyle}
            labelStyle={{ color: palette.tooltipLabelColor }}
            itemStyle={{ color: palette.tooltipValueColor }}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return { default: SpendingDonutChartComponent }
})

function ChartFallback() {
  return <div className="chart-fallback" />
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

export default function Charts({ balanceData, spendingData, canCreateTransaction, onAdd }) {
  const { theme } = useFinance()
  const isDark = theme === 'dark'
  const totalSpending = useMemo(
    () => spendingData.reduce((sum, item) => sum + item.value, 0),
    [spendingData],
  )

  const chartPalette = {
    axisColor: isDark ? '#94a3b8' : '#64748b',
    gridColor: isDark ? 'rgba(51, 65, 85, 0.55)' : 'rgba(148, 163, 184, 0.35)',
    lineColor: '#6366f1',
    dotFill: isDark ? '#818cf8' : '#4f46e5',
    dotStroke: isDark ? '#f8fafc' : '#ffffff',
    tooltipLabelColor: isDark ? '#cbd5e1' : '#334155',
    tooltipValueColor: isDark ? '#f8fafc' : '#0f172a',
    tooltipContentStyle: {
      borderRadius: '18px',
      border: isDark ? '1px solid rgba(51, 65, 85, 0.9)' : '1px solid rgba(203, 213, 225, 0.9)',
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
      boxShadow: '0 18px 50px -28px rgba(15, 23, 42, 0.35)',
    },
  }

  return (
    <motion.section variants={sectionStagger(0.06)} className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)]">
      <motion.article variants={fadeUp} className="panel min-w-0 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="section-label">Last 6 Months</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Balance Trend
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              A clean view of how your balance has changed across the last six months.
            </p>
          </div>

          {canCreateTransaction ? (
            <motion.button
              type="button"
              onClick={onAdd}
              whileHover={buttonHover}
              whileTap={buttonTap}
              transition={springTransition}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-500 transition-colors duration-200 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <PlusIcon />
            </motion.button>
          ) : null}
        </div>

        {balanceData.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              compact
              title="No balance trend yet"
              description="Create a few transactions and the six-month balance curve will appear here."
              actionLabel={canCreateTransaction ? 'Add transaction' : undefined}
              onAction={canCreateTransaction ? onAdd : undefined}
            />
          </div>
        ) : (
          <motion.div
            variants={fadeIn}
            className="mt-6 rounded-[26px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60 sm:p-5"
          >
            <div className="h-[280px] sm:h-[320px]">
              <Suspense fallback={<ChartFallback />}>
                <BalanceLineChart data={balanceData} palette={chartPalette} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </motion.article>

      <motion.article variants={fadeUp} className="panel min-w-0 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label">Expense Mix</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Spending Breakdown
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Understand which categories absorb the largest share of your expenses.
            </p>
          </div>
        </div>

        {spendingData.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              compact
              title="No expense categories yet"
              description="Once you add expense transactions, your category-wise spending donut will show up here."
              actionLabel={canCreateTransaction ? 'Add expense' : undefined}
              onAction={canCreateTransaction ? onAdd : undefined}
            />
          </div>
        ) : (
          <>
            <motion.div
              variants={fadeIn}
              className="mt-6 rounded-[26px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60 sm:p-5"
            >
              <div className="relative h-[280px] sm:h-[320px]">
                <Suspense fallback={<ChartFallback />}>
                  <SpendingDonutChart data={spendingData} palette={chartPalette} />
                </Suspense>

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="section-label">Total Spend</p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                      {formatCurrency(totalSpending)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3">
              {spendingData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.article>
    </motion.section>
  )
}

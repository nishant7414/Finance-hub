import { motion } from 'framer-motion'
import { Suspense, lazy, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { fadeIn, fadeUp, sectionStagger, springTransition } from '../utils/motion'
import EmptyState from './EmptyState'
import { formatCurrency } from '../utils/formatters'

const compactNumberFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatCompactCurrency = (value) => `?${compactNumberFormatter.format(Math.abs(value))}`
const currencyTooltipFormatter = (value) => formatCurrency(value)
const rateTooltipFormatter = (value) => `${value}%`

const MonthlyComparisonChart = lazy(async () => {
  const [
    { BarChart },
    { Bar },
    { XAxis },
    { YAxis },
    { CartesianGrid },
    { ResponsiveContainer },
    { Tooltip },
  ] = await Promise.all([
    import('recharts/es6/chart/BarChart.js'),
    import('recharts/es6/cartesian/Bar.js'),
    import('recharts/es6/cartesian/XAxis.js'),
    import('recharts/es6/cartesian/YAxis.js'),
    import('recharts/es6/cartesian/CartesianGrid.js'),
    import('recharts/es6/component/ResponsiveContainer.js'),
    import('recharts/es6/component/Tooltip.js'),
  ])

  function MonthlyComparisonChartComponent({ data, palette }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
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
          <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return { default: MonthlyComparisonChartComponent }
})

const SavingsRateTrendChart = lazy(async () => {
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

  function SavingsRateTrendChartComponent({ data, palette }) {
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
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: palette.axisColor, fontSize: 12 }}
          />
          <Tooltip
            formatter={rateTooltipFormatter}
            contentStyle={palette.tooltipContentStyle}
            labelStyle={{ color: palette.tooltipLabelColor }}
            itemStyle={{ color: palette.tooltipValueColor }}
          />
          <Line
            type="monotone"
            dataKey="savingsRate"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, fill: '#818cf8', stroke: palette.dotStroke, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#818cf8', stroke: palette.dotStroke, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return { default: SavingsRateTrendChartComponent }
})

function ChartFallback() {
  return <div className="chart-fallback" />
}

export default function InsightsPanel({ insights, monthlySeries }) {
  const { theme } = useFinance()
  const hasMonthlyData = useMemo(
    () => monthlySeries.some((item) => item.income > 0 || item.expenses > 0),
    [monthlySeries],
  )
  const isDark = theme === 'dark'
  const chartPalette = {
    axisColor: isDark ? '#94a3b8' : '#64748b',
    gridColor: isDark ? 'rgba(51, 65, 85, 0.55)' : 'rgba(148, 163, 184, 0.35)',
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
    <motion.div initial="hidden" animate="visible" variants={sectionStagger(0.04)} className="space-y-6">
      <motion.section variants={sectionStagger(0.06)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <motion.article variants={fadeUp} className="panel p-5 sm:p-6">
          <p className="section-label">Top Driver</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Highest Spending Category
          </h2>

          <div className="mt-6 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
            <span className="inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-500 dark:bg-rose-500/20 dark:text-rose-300">
              {insights.highestCategoryShare}% of total expenses
            </span>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              {insights.highestCategory.category}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              This category currently contributes the largest expense load in your dashboard.
            </p>
            <p className="mt-6 text-2xl font-semibold text-slate-950 dark:text-white">
              {formatCurrency(insights.highestCategory.amount)}
            </p>
          </div>
        </motion.article>

        <motion.article variants={fadeUp} className="panel p-5 sm:p-6">
          <p className="section-label">Ranking</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Top 3 Expense Categories
          </h2>

          {insights.topCategories.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                compact
                title="No expense ranking yet"
                description="Once expense transactions exist, the top categories will be ranked here automatically."
              />
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {insights.topCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={springTransition}
                  className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200/70 bg-slate-50/80 px-4 py-4 will-change-transform dark:border-white/10 dark:bg-slate-950/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-sm font-bold text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">
                        {category.category}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Ranked by total expense amount
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {formatCurrency(category.amount)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.article>
      </motion.section>

      <motion.section variants={sectionStagger(0.08)} className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <motion.article variants={fadeUp} className="panel p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-label">Month over Month</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Income vs Expenses
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Income
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1.5 font-semibold text-rose-500 dark:bg-rose-500/20 dark:text-rose-300">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Expenses
              </span>
            </div>
          </div>

          {hasMonthlyData ? (
            <motion.div variants={fadeIn} className="mt-6 rounded-[26px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60 sm:p-5">
              <div className="h-[300px] sm:h-[340px]">
                <Suspense fallback={<ChartFallback />}>
                  <MonthlyComparisonChart data={monthlySeries} palette={chartPalette} />
                </Suspense>
              </div>
            </motion.div>
          ) : (
            <div className="mt-6">
              <EmptyState
                compact
                title="No monthly comparison yet"
                description="Add more transactions across time and the monthly income-versus-expense comparison will appear here."
              />
            </div>
          )}
        </motion.article>

        <motion.article variants={fadeUp} className="panel p-5 sm:p-6">
          <div>
            <p className="section-label">Trendline</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Savings Rate Trend
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Track how efficiently income is being converted into savings month by month.
            </p>
          </div>

          {hasMonthlyData ? (
            <motion.div variants={fadeIn} className="mt-6 rounded-[26px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60 sm:p-5">
              <div className="h-[300px] sm:h-[340px]">
                <Suspense fallback={<ChartFallback />}>
                  <SavingsRateTrendChart data={monthlySeries} palette={chartPalette} />
                </Suspense>
              </div>
            </motion.div>
          ) : (
            <div className="mt-6">
              <EmptyState
                compact
                title="No savings-rate trend yet"
                description="Once monthly income and expenses exist, the savings-rate trend will be charted here automatically."
              />
            </div>
          )}
        </motion.article>
      </motion.section>
    </motion.div>
  )
}

import { Suspense, lazy } from 'react'
import { useFinance } from '../context/FinanceContext'
import EmptyState from './EmptyState'
import { formatCurrency, formatDisplayDate } from '../utils/formatters'

const PIE_COLORS = ['#0f766e', '#f97316', '#2563eb', '#eab308', '#334155', '#14b8a6']

const chartTooltipFormatter = (value) => formatCurrency(value)

const BalanceTrendChart = lazy(async () => {
  const [
    { LineChart },
    { Line },
    { XAxis },
    { YAxis },
    { ResponsiveContainer },
    { Tooltip },
  ] = await Promise.all([
    import('recharts/es6/chart/LineChart.js'),
    import('recharts/es6/cartesian/Line.js'),
    import('recharts/es6/cartesian/XAxis.js'),
    import('recharts/es6/cartesian/YAxis.js'),
    import('recharts/es6/component/ResponsiveContainer.js'),
    import('recharts/es6/component/Tooltip.js'),
  ])

  function BalanceTrendChartComponent({ data, palette }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDisplayDate(value).split(',')[0]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: palette.axisColor, fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: palette.axisColor, fontSize: 12 }}
          />
          <Tooltip
            formatter={chartTooltipFormatter}
            labelFormatter={(value) => formatDisplayDate(value)}
            cursor={{ stroke: palette.cursorColor, strokeDasharray: '4 4' }}
            contentStyle={palette.tooltipContentStyle}
            labelStyle={{ color: palette.tooltipLabelColor }}
            itemStyle={{ color: palette.tooltipValueColor }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={palette.lineColor}
            strokeWidth={3}
            dot={{ r: 4, fill: palette.lineColor }}
            activeDot={{ r: 6, fill: palette.lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return { default: BalanceTrendChartComponent }
})

const SpendingPieChart = lazy(async () => {
  const [
    { PieChart },
    { Pie },
    { Cell },
    { Legend },
    { ResponsiveContainer },
    { Tooltip },
  ] = await Promise.all([
    import('recharts/es6/chart/PieChart.js'),
    import('recharts/es6/polar/Pie.js'),
    import('recharts/es6/component/Cell.js'),
    import('recharts/es6/component/Legend.js'),
    import('recharts/es6/component/ResponsiveContainer.js'),
    import('recharts/es6/component/Tooltip.js'),
  ])

  function SpendingPieChartComponent({ data, palette }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={chartTooltipFormatter}
            contentStyle={palette.tooltipContentStyle}
            labelStyle={{ color: palette.tooltipLabelColor }}
            itemStyle={{ color: palette.tooltipValueColor }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span style={{ color: palette.legendColor }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return { default: SpendingPieChartComponent }
})

function ChartFallback() {
  return <div className="chart-fallback" />
}

export default function Charts({ balanceData, spendingData, canCreateTransaction, onAdd }) {
  const { theme } = useFinance()
  const isDark = theme === 'dark'
  const chartPalette = {
    axisColor: isDark ? '#94a3b8' : '#64748b',
    legendColor: isDark ? '#cbd5e1' : '#475569',
    lineColor: '#14b8a6',
    cursorColor: isDark ? '#334155' : '#cbd5e1',
    tooltipLabelColor: isDark ? '#cbd5e1' : '#334155',
    tooltipValueColor: isDark ? '#f8fafc' : '#0f172a',
    tooltipContentStyle: {
      borderRadius: '18px',
      border: isDark ? '1px solid rgba(51, 65, 85, 0.9)' : '1px solid rgba(226, 232, 240, 0.9)',
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
      boxShadow: '0 18px 50px -28px rgba(15, 23, 42, 0.35)',
    },
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <article className="panel p-5 sm:p-6">
        <div className="mb-5">
          <span className="eyebrow">Balance trend</span>
          <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
            Balance over time
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A running view of how income and expenses moved your balance.
          </p>
        </div>

        {balanceData.length === 0 ? (
          <EmptyState
            compact
            title="No balance history yet"
            description="Add a few transactions to unlock your cash flow trend line."
            actionLabel={canCreateTransaction ? 'Add transaction' : undefined}
            onAction={canCreateTransaction ? onAdd : undefined}
          />
        ) : (
          <div className="rounded-[24px] bg-slate-50/70 p-2 dark:bg-slate-950/50">
            <div className="h-[290px]">
              <Suspense fallback={<ChartFallback />}>
                <BalanceTrendChart data={balanceData} palette={chartPalette} />
              </Suspense>
            </div>
          </div>
        )}
      </article>

      <article className="panel p-5 sm:p-6">
        <div>
          <span className="eyebrow">Spend mix</span>
          <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
            Category-wise spending
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Expense categories broken down to spotlight where most money goes.
          </p>
        </div>

        {spendingData.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              compact
              title="No expense data yet"
              description="Once you log expenses, the spending split will appear here."
              actionLabel={canCreateTransaction ? 'Add expense' : undefined}
              onAction={canCreateTransaction ? onAdd : undefined}
            />
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] bg-slate-50/70 p-2 dark:bg-slate-950/50">
            <div className="h-[290px]">
              <Suspense fallback={<ChartFallback />}>
                <SpendingPieChart data={spendingData} palette={chartPalette} />
              </Suspense>
            </div>
          </div>
        )}
      </article>
    </section>
  )
}

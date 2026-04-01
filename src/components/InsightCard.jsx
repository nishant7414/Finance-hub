import { formatCurrency } from '../utils/formatters'

const toneStyles = {
  teal: 'border-aurora/20 bg-aurora/5 dark:border-aurora/30 dark:bg-aurora/10',
  amber: 'border-amber-200 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-500/10',
  slate: 'border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900/60',
}

export default function InsightCard({ title, value, description, amount, tone }) {
  return (
    <article
      className={`rounded-3xl border p-5 transition duration-200 hover:-translate-y-0.5 ${
        toneStyles[tone] ?? toneStyles.slate
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        Insight
      </p>
      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-4 font-display text-3xl font-bold text-slate-950 dark:text-slate-50">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      <p className="mt-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {formatCurrency(amount)}
      </p>
    </article>
  )
}

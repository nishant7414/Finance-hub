export default function SummaryCard({ title, value, subtitle, accent }) {
  const accentStyles = {
    teal: 'bg-aurora/10 text-aurora dark:bg-aurora/20 dark:text-teal-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  }

  return (
    <article className="panel h-full p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 break-words font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
            {value}
          </p>
        </div>

        <span
          className={`inline-flex rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
            accentStyles[accent] ?? accentStyles.slate
          }`}
        >
          Live
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p>
    </article>
  )
}

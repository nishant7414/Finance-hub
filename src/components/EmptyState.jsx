export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center rounded-3xl border border-dashed border-slate-300/90 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-950/50 ${
        compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'
      }`}
    >
      <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg shadow-sm dark:bg-slate-900 dark:text-slate-200">
        +
      </span>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="action-button mt-4 bg-slate-900 text-white hover:bg-slate-800 dark:bg-aurora dark:hover:bg-teal-500"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

function EmptyIllustration() {
  return (
    <svg viewBox="0 0 120 96" fill="none" className="h-20 w-28 text-indigo-500/80 dark:text-indigo-300/80">
      <rect x="10" y="28" width="100" height="54" rx="16" fill="currentColor" opacity="0.08" />
      <rect x="22" y="54" width="14" height="16" rx="4" fill="currentColor" opacity="0.32" />
      <rect x="44" y="42" width="14" height="28" rx="4" fill="currentColor" opacity="0.52" />
      <rect x="66" y="32" width="14" height="38" rx="4" fill="currentColor" opacity="0.72" />
      <path d="m18 26 20-8 16 6 18-12 18 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  )
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center rounded-[28px] border border-dashed border-slate-300/80 bg-slate-50/80 dark:border-white/10 dark:bg-slate-900/50 ${
        compact ? 'p-5' : 'p-8'
      }`}
    >
      <EmptyIllustration />
      <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="action-button mt-5 bg-indigo-500 text-white shadow-[0_18px_40px_-22px_rgba(99,102,241,0.85)] hover:bg-indigo-400"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

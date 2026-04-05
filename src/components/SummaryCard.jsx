import { motion } from 'framer-motion'
import { cardHover, fadeUp, springTransition } from '../utils/motion'

function BalanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M7 9c0-2.2 2.24-4 5-4s5 1.8 5 4-2.24 4-5 4-5 1.8-5 4 2.24 4 5 4 5-1.8 5-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IncomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 15l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5v10" strokeLinecap="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  )
}

function ExpenseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 9l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19V9" strokeLinecap="round" />
      <path d="M5 5h14" strokeLinecap="round" />
    </svg>
  )
}

function RateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5a7 7 0 1 0 7 7" strokeLinecap="round" />
      <path d="M19 5v6h-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10 13 2-2 2 1 2-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const iconMap = {
  balance: BalanceIcon,
  income: IncomeIcon,
  expense: ExpenseIcon,
  rate: RateIcon,
}

const iconStyles = {
  balance: 'bg-indigo-500/12 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300',
  income: 'bg-emerald-500/12 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300',
  expense: 'bg-rose-500/12 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300',
  rate: 'bg-sky-500/12 text-sky-500 dark:bg-sky-500/20 dark:text-sky-300',
}

const trendStyles = {
  positive: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300',
  negative: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300',
  neutral: 'bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-300',
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon = 'balance',
  trendLabel,
  trendTone = 'neutral',
  className = '',
}) {
  const Icon = iconMap[icon] ?? BalanceIcon

  return (
    <motion.article
      variants={fadeUp}
      whileHover={cardHover}
      transition={springTransition}
      className={`panel p-5 will-change-transform sm:p-6 ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`inline-flex h-14 w-14 items-center justify-center rounded-[18px] ${
            iconStyles[icon] ?? iconStyles.balance
          }`}
        >
          <Icon />
        </span>

        {trendLabel ? (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${
              trendStyles[trendTone] ?? trendStyles.neutral
            }`}
          >
            {trendLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-8">
        <p className="text-[2.15rem] font-bold tracking-tight text-slate-950 dark:text-white sm:text-[2.35rem]">
          {value}
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </motion.article>
  )
}

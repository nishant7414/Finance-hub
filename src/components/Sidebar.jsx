import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { springTransition } from '../utils/motion'
import { formatCurrency } from '../utils/formatters'

const navigationItems = [
  { to: '/', label: 'Dashboard', key: 'dashboard' },
  { to: '/transactions', label: 'Transactions', key: 'transactions' },
  { to: '/insights', label: 'Insights', key: 'insights' },
]

function LogoIcon() {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_20px_40px_-18px_rgba(99,102,241,0.9)]">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4 4 8l8 4 8-4-8-4Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m4 12 8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m4 16 8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6 18 18" strokeLinecap="round" />
      <path d="M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

function NavIcon({ name }) {
  if (name === 'transactions') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="6" width="16" height="12" rx="2.5" />
        <path d="M4 10h16" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'insights') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 18V9" strokeLinecap="round" />
        <path d="M12 18V5" strokeLinecap="round" />
        <path d="M19 18v-7" strokeLinecap="round" />
        <path d="M4 18h16" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="6" height="14" rx="2" />
      <rect x="14" y="9" width="6" height="10" rx="2" />
      <path d="M14 5h6v2.5h-6z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Sidebar({ isOpen, onClose, totalBalance, transactionCount }) {
  return (
    <>
      <button
        type="button"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/65 transition xl:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] shrink-0 border-r border-white/10 bg-[#0b1120]/95 px-5 py-5 text-slate-100 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.8)] backdrop-blur-xl transition-transform duration-300 xl:sticky xl:top-0 xl:h-screen xl:translate-x-0 xl:px-6 xl:py-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* TOP */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <LogoIcon />
              <div>
                <p className="font-display text-2xl font-bold tracking-tight text-white">Zorvyn</p>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Finance Hub
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.96 }}
              transition={springTransition}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-slate-400 xl:hidden"
            >
              <CloseIcon />
            </motion.button>
          </div>

          {/* NAV */}
          <nav className="mt-10 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative block overflow-hidden rounded-[22px] px-4 py-3.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        transition={springTransition}
                        className="absolute inset-0 rounded-[22px] bg-white/10"
                      />
                    )}

                    <motion.span
                      animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.4 }}
                      transition={springTransition}
                      className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400"
                    />

                    <motion.span className="relative z-10 flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                        <NavIcon name={item.key} />
                      </span>
                      <span>{item.label}</span>
                    </motion.span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* BOTTOM */}
          <div className="mt-auto space-y-4 pt-8">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Total Balance
              </p>
              <p className="mt-3 text-2xl font-bold text-white">
                {formatCurrency(totalBalance)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {transactionCount} transactions synced across the dashboard.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-500/10 to-emerald-500/5 p-4">
              <p className="text-sm font-semibold text-white">Built for fast review</p>
              <p className="mt-2 text-sm text-slate-400">
                Switch between overview, transactions, and insights without losing your filters or theme.
              </p>
            </div>

            {/* 🔥 PERSONAL TOUCH */}
            <div className="text-xs text-slate-500 pt-4">
              Built by Nishant
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
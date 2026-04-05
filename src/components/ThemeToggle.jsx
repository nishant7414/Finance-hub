import { motion } from 'framer-motion'
import { useFinance } from '../context/FinanceContext'
import { buttonHover, buttonTap, springTransition } from '../utils/motion'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 15.5A7.5 7.5 0 0 1 8.5 5a8.5 8.5 0 1 0 10.5 10.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" strokeLinecap="round" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useFinance()

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={buttonHover}
      whileTap={buttonTap}
      transition={springTransition}
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </motion.button>
  )
}

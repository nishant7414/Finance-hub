import { motion } from 'framer-motion'
import { buttonHover, buttonTap, springTransition } from '../utils/motion'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
]

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4.4 3 8.4 7 9 4-0.6 7-4.6 7-9V6l-7-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 12 1.5 1.5 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function RoleSwitcher({ role, onChange }) {
  return (
    <motion.label
      whileHover={buttonHover}
      whileTap={buttonTap}
      transition={springTransition}
      className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2.5 text-sm text-slate-600 transition-colors duration-200 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
    >
      <ShieldIcon />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:inline">
        Role
      </span>
      <select
        value={role}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Switch role"
        className="min-w-[92px] bg-transparent text-sm font-semibold text-current outline-none"
      >
        {roles.map((roleOption) => (
          <option key={roleOption.value} value={roleOption.value} className="text-slate-900">
            {roleOption.label}
          </option>
        ))}
      </select>
    </motion.label>
  )
}

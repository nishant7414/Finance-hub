import { useFinance } from '../context/FinanceContext'

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
]

export default function RoleSwitcher({ role, onChange }) {
  const { theme, toggleTheme } = useFinance()

  return (
    <div className="panel-muted p-2">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Access
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Viewer can inspect. Admin can manage records.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 sm:w-auto"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {roles.map((roleOption) => {
          const active = role === roleOption.value

          return (
            <button
              key={roleOption.value}
              type="button"
              onClick={() => onChange(roleOption.value)}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                active
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 dark:bg-aurora dark:shadow-aurora/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {roleOption.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

import RoleSwitcher from './RoleSwitcher'
import { formatCurrency } from '../utils/formatters'

export default function Sidebar({
  role,
  onRoleChange,
  onAddTransaction,
  totalBalance,
  transactionCount,
}) {
  return (
    <aside className="overflow-hidden rounded-[28px] bg-[var(--sidebar)] text-slate-100 shadow-panel xl:sticky xl:top-6 xl:self-start xl:rounded-[32px]">
      <div className="relative h-full p-5 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-aurora/20 via-transparent to-ember/15" />

        <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-1 xl:gap-6">
          <div className="md:col-span-2 xl:col-span-1">
            <span className="eyebrow border-white/15 bg-white/10 text-slate-200">
              Finance hub
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-3xl">
              Orbit Ledger
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A focused command center for balances, spending patterns, and transaction
              control.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Current balance
            </p>
            <p className="mt-3 font-display text-4xl font-bold text-white">
              {formatCurrency(totalBalance)}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {transactionCount} tracked transactions across your dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <RoleSwitcher role={role} onChange={onRoleChange} />

            <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Workspace mode
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {role === 'admin'
                  ? 'You can add, update, and remove transactions.'
                  : 'You are in view-only mode. Editing controls are hidden.'}
              </p>

              {role === 'admin' ? (
                <button
                  type="button"
                  onClick={onAddTransaction}
                  className="action-button mt-5 w-full bg-white text-slate-900 hover:bg-slate-100"
                >
                  Add transaction
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

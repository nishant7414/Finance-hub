import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import RoleSwitcher from './RoleSwitcher'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import TransactionModal from './TransactionModal'
import { useFinance } from '../context/FinanceContext'
import { buttonHover, buttonTap, cardHover, fadeUp, springTransition } from '../utils/motion'
import { formatCurrency } from '../utils/formatters'

const pageMeta = {
  '/': {
    eyebrow: 'Dashboard',
    title: 'Financial Overview',
    description: 'Track balances, monthly movement, and category-level spending in one place.',
  },
  '/transactions': {
    eyebrow: 'Transactions',
    title: 'Transaction Ledger',
    description: 'Search, filter, sort, and manage every income and expense record.',
  },
  '/insights': {
    eyebrow: 'Insights',
    title: 'Financial Insights',
    description: 'Spot spending leaders, compare monthly performance, and monitor savings rate trends.',
  },
}

const escapeCsvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 16V4" strokeLinecap="round" />
      <path d="M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h14" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

export default function AppShell() {
  const location = useLocation()
  const {
    addTransaction,
    filteredTransactions,
    insights,
    role,
    setRole,
    totals,
    transactions,
    updateTransaction,
  } = useFinance()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  const activeMeta = pageMeta[location.pathname] ?? pageMeta['/']

  const headerMetrics = useMemo(
    () => [
      { label: 'Balance', value: formatCurrency(totals.balance) },
      { label: 'Savings Rate', value: `${insights.savingsRate}%` },
      { label: 'Transactions', value: String(filteredTransactions.length) },
    ],
    [filteredTransactions.length, insights.savingsRate, totals.balance],
  )

  const closeModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(false)
  }

  const openCreateModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleSubmitTransaction = (payload) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload)
    } else {
      addTransaction(payload)
    }
    closeModal()
  }

  const handleExport = () => {
    if (role !== 'admin' || filteredTransactions.length === 0) return

    const rows = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...filteredTransactions.map((transaction) => [
        transaction.date,
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.amount,
      ]),
    ]

    const csvContent = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')
    const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const fileUrl = window.URL.createObjectURL(file)

    const link = document.createElement('a')
    link.href = fileUrl
    link.setAttribute('download', 'finance-dashboard-transactions.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(fileUrl)
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          totalBalance={totals.balance}
          transactionCount={transactions.length}
        />

        <div className="flex min-w-0 flex-1 flex-col bg-[#020617]">

          {/* 🔥 PREMIUM HEADER */}
          <header className="sticky top-0 z-20 border-b border-white/10 
          bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#020617] 
          backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]">

            {/* subtle overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>

            <div className="relative flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
              
              {/* LEFT */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-start gap-3">
                
                <motion.button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  transition={springTransition}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl 
                  border border-white/10 bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <MenuIcon />
                </motion.button>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    {activeMeta.eyebrow}
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-[2.35rem]">
                    {activeMeta.title}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm text-gray-400">
                    {activeMeta.description}
                  </p>
                </div>
              </motion.div>

              {/* RIGHT */}
              <div className="flex flex-col gap-3 xl:items-end">

                {/* METRICS */}
                <div className="hidden md:flex flex-wrap items-center gap-3">
                  {headerMetrics.map((metric) => (
                    <motion.div
                      key={metric.label}
                      whileHover={cardHover}
                      transition={springTransition}
                      className="rounded-2xl border border-white/10 
                      bg-white/10 px-4 py-3 backdrop-blur-md"
                    >
                      <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                        {metric.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {metric.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                  <RoleSwitcher role={role} onChange={setRole} />
                  <ThemeToggle />

                  {role === 'admin' && (
                    <motion.button
                      onClick={handleExport}
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      transition={springTransition}
                      className="inline-flex items-center gap-2 rounded-2xl 
                      border border-white/10 bg-white/10 px-4 py-2.5 
                      text-sm font-semibold text-white 
                      hover:bg-white/20 transition-all"
                    >
                      <ExportIcon />
                      Export CSV
                    </motion.button>
                  )}

                  {role === 'admin' && (
                    <motion.button
                      onClick={openCreateModal}
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      transition={springTransition}
                      className="inline-flex items-center gap-2 rounded-2xl 
                      bg-gradient-to-r from-indigo-500 to-blue-500 
                      px-5 py-3 text-sm font-semibold text-white 
                      hover:from-indigo-400 hover:to-blue-400 transition-all"
                    >
                      <PlusIcon />
                      Add Transaction
                    </motion.button>
                  )}
                </div>

              </div>
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 px-4 py-5 sm:px-6 xl:px-8 xl:py-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                <Outlet context={{ openCreateModal, openEditModal }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        mode={editingTransaction ? 'edit' : 'create'}
        initialValues={editingTransaction}
        onClose={closeModal}
        onSubmit={handleSubmitTransaction}
      />
    </div>
  )
}

export function useTransactionModalActions() {
  return useOutletContext()
}
import TransactionTable from '../components/TransactionTable'
import { useTransactionModalActions } from '../components/AppShell'
import { useFinance } from '../context/FinanceContext'

export default function TransactionsPage() {
  const {
    availableCategories,
    deleteTransaction,
    filteredTransactions,
    filters,
    role,
    resetFilters,
    toggleCategory,
    updateFilter,
  } = useFinance()
  const { openCreateModal, openEditModal } = useTransactionModalActions()

  return (
    <TransactionTable
      transactions={filteredTransactions}
      filters={filters}
      availableCategories={availableCategories}
      onFilterChange={updateFilter}
      onToggleCategory={toggleCategory}
      onResetFilters={resetFilters}
      role={role}
      onEdit={openEditModal}
      onDelete={deleteTransaction}
      onCreate={openCreateModal}
    />
  )
}

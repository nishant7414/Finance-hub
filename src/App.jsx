import Dashboard from './pages/Dashboard'
import { FinanceProvider } from './context/FinanceContext'

export default function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  )
}

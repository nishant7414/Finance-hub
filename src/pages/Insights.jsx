import InsightsPanel from '../components/InsightsPanel'
import { useFinance } from '../context/FinanceContext'

export default function InsightsPage() {
  const { insights, monthlySeries } = useFinance()

  return <InsightsPanel insights={insights} monthlySeries={monthlySeries} />
}

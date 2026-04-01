// hooks/useBudget.js
// Custom hook for budget calculations.
// All the math is in one place — no need to repeat it in every component.

import { useFinance } from '../context/FinanceContext'

export function useBudget() {
  const { budget, setBudget, totalExpense } = useFinance()

  const remaining   = budget - totalExpense
  const percentUsed = budget > 0 ? (totalExpense / budget) * 100 : 0

  // Returns a color based on how much budget is used
  function getBarColor() {
    if (percentUsed > 80) return 'var(--red)'
    if (percentUsed > 60) return 'var(--yellow)'
    return 'var(--green)'
  }

  return { budget, setBudget, totalExpense, remaining, percentUsed, getBarColor }
}

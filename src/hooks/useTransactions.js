// hooks/useTransactions.js
// A custom hook that just grabs transaction-related things from context.
// Why? So components don't need to import useFinance + remember what's inside.
// They just call useTransactions() and get what they need.

import { useFinance } from '../context/FinanceContext'

export function useTransactions() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useFinance()
  return { transactions, addTransaction, deleteTransaction, updateTransaction }
}

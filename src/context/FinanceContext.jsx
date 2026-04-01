// context/FinanceContext.jsx
//
// This file creates a "global store" for the whole app.
// Instead of passing data through props on every component,
// any component can call useFinance() and get the data directly.

import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'  // generates a unique id like "a3f2-..."

// Step 1: Create an empty context (like an empty box we'll fill later)
const FinanceContext = createContext()

// ── Role definitions ────────────────────────────────────────
// viewer: read-only access (cannot add, edit, or delete)
// admin:  full access (can add, edit, delete, change budget)
export const ROLES = {
  ADMIN:  'admin',
  VIEWER: 'viewer',
}

// ── Starting data so the app isn't empty on first load ──────
const STARTING_TRANSACTIONS = [
  { id: uuidv4(), title: 'Monthly Salary',    amount: 45000, category: 'Salary',        type: 'income',  date: '2025-03-01', notes: '',              recurring: true  },
  { id: uuidv4(), title: 'Netflix',           amount: 649,   category: 'Subscriptions', type: 'expense', date: '2025-03-02', notes: 'Monthly plan',  recurring: true  },
  { id: uuidv4(), title: 'Swiggy order',      amount: 380,   category: 'Food',          type: 'expense', date: '2025-03-05', notes: 'Dinner',        recurring: false },
  { id: uuidv4(), title: 'Gym membership',    amount: 1500,  category: 'Health',        type: 'expense', date: '2025-03-06', notes: '',              recurring: true  },
  { id: uuidv4(), title: 'Electricity bill',  amount: 1200,  category: 'Utilities',     type: 'expense', date: '2025-03-10', notes: 'March bill',    recurring: true  },
  { id: uuidv4(), title: 'Freelance project', amount: 12000, category: 'Freelance',     type: 'income',  date: '2025-03-12', notes: 'UI design gig', recurring: false },
  { id: uuidv4(), title: 'Zomato',            amount: 250,   category: 'Food',          type: 'expense', date: '2025-03-14', notes: 'Lunch',         recurring: false },
  { id: uuidv4(), title: 'Metro pass',        amount: 500,   category: 'Travel',        type: 'expense', date: '2025-03-15', notes: 'Monthly pass',  recurring: true  },
  { id: uuidv4(), title: 'Amazon order',      amount: 1800,  category: 'Shopping',      type: 'expense', date: '2025-03-18', notes: 'Books',         recurring: false },
  { id: uuidv4(), title: 'Movie tickets',     amount: 600,   category: 'Entertainment', type: 'expense', date: '2025-03-20', notes: 'Weekend',       recurring: false },
]

// Step 2: Create the Provider component.
// This wraps the whole app and gives every child access to the data.
export function FinanceProvider({ children }) {

  // Load saved transactions from localStorage, or use starting data
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : STARTING_TRANSACTIONS
  })

  // Load saved budget or default to 50000
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget')
    return saved ? JSON.parse(saved) : 50000
  })

  // ── Role state ────────────────────────────────────────────
  // Persisted to localStorage so it survives refreshes
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || ROLES.ADMIN
  })

  useEffect(() => {
    localStorage.setItem('role', role)
  }, [role])

  // Convenience flag: is the current user an admin?
  const isAdmin = role === ROLES.ADMIN

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  // Save to localStorage whenever budget changes
  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget))
  }, [budget])

  // Add a new transaction to the list
  function addTransaction(newData) {
    const transactionWithId = { ...newData, id: uuidv4() }
    setTransactions([transactionWithId, ...transactions])  // add to top
  }

  // Remove a transaction by its id
  function deleteTransaction(id) {
    const remaining = transactions.filter((t) => t.id !== id)
    setTransactions(remaining)
  }

  // Update an existing transaction
  function updateTransaction(id, updatedData) {
    const updated = transactions.map((t) => {
      if (t.id === id) {
        return { ...t, ...updatedData }  // merge old + new data
      }
      return t
    })
    setTransactions(updated)
  }

  // Calculate totals (these are computed from transactions, not stored)
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const netBalance   = totalIncome - totalExpense

  // Step 3: Put all the data and functions into one object
  const contextValue = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    budget,
    setBudget,
    totalIncome,
    totalExpense,
    netBalance,
    role,
    setRole,
    isAdmin,
  }

  // Step 4: Provide it to all children
  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  )
}

// Step 5: Export a simple hook so components can use the context
// Usage: const { transactions } = useFinance()
export function useFinance() {
  return useContext(FinanceContext)
}

// pages/Dashboard.jsx
// Shows a summary of your finances:
// - 4 stat cards (income, expenses, balance, top category)
// - A pie chart of spending
// - Budget progress
// - 5 most recent transactions

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { useBudget } from '../hooks/useBudget'
import { formatINR, formatDate } from '../utils/currencyFormatter'
import { SpendingPieChart } from '../components/Charts'
import BudgetCard from '../components/BudgetCard'
import { EXPENSE_CATEGORIES, CAT_EMOJI } from '../constants'

export default function Dashboard() {
  const { transactions, totalIncome, totalExpense, netBalance } = useFinance()
  const navigate = useNavigate()

  // ── Find the top spending category ──────────────────────
  // For each expense category, add up how much was spent
  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => {
    const total = transactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
    return { name: cat, value: total }
  }).filter((c) => c.value > 0)  // remove categories with 0 spending

  // Sort to find the highest one
  const topCategory = [...categoryTotals].sort((a, b) => b.value - a.value)[0]

  // ── 5 most recent transactions ───────────────────────────
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div>
      <div className="page-title">
        Dashboard <span className="sub">/ overview</span>
      </div>

      {/* ── 4 Stat Cards ─────────────────────────────────── */}
      <div className="grid-4">

        <div className="card">
          <div className="card-label">Total Income</div>
          <div className="card-value" style={{ color: 'var(--green)' }}>
            {formatINR(totalIncome)}
          </div>
          <div className="card-sub">All time</div>
        </div>

        <div className="card">
          <div className="card-label">Total Expenses</div>
          <div className="card-value" style={{ color: 'var(--red)' }}>
            {formatINR(totalExpense)}
          </div>
          <div className="card-sub">All time</div>
        </div>

        <div className="card">
          <div className="card-label">Net Balance</div>
          <div className="card-value" style={{ color: netBalance >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {formatINR(netBalance)}
          </div>
          <div className="card-sub">
            {netBalance >= 0 ? "You're doing great 🎉" : 'Overspending ⚠️'}
          </div>
        </div>

        <div className="card">
          <div className="card-label">Top Category</div>
          <div className="card-value" style={{ fontSize: 18 }}>
            {topCategory ? `${CAT_EMOJI[topCategory.name]} ${topCategory.name}` : '—'}
          </div>
          <div className="card-sub">
            {topCategory ? formatINR(topCategory.value) + ' spent' : 'No expenses yet'}
          </div>
        </div>

      </div>

      {/* ── Charts + Recent ───────────────────────────────── */}
      <div className="grid-2">

        {/* Left: Pie chart */}
        <div className="card">
          <div className="section-title">Spending by Category</div>
          <SpendingPieChart data={categoryTotals} />
        </div>

        {/* Right: Budget + recent transactions */}
        <div className="card">
          <div className="section-title">Budget Overview</div>
          <BudgetCard />

          <div className="section-title" style={{ marginTop: 28 }}>
            Recent Transactions
          </div>

          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💳</div>
              No transactions yet.
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="tx-row" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <span style={{ fontSize: 20 }}>{CAT_EMOJI[tx.category]}</span>
                <div className="tx-info">
                  <div className="tx-title">{tx.title}</div>
                  <div className="tx-meta">{formatDate(tx.date)}</div>
                </div>
                <span
                  className="tx-amount"
                  style={{ color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                </span>
              </div>
            ))
          )}

          <button
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() => navigate('/transactions')}
          >
            View all transactions →
          </button>

        </div>
      </div>
    </div>
  )
}

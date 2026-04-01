// pages/Budget.jsx
// Set your monthly budget and see spending per category.
// Budget editing is restricted to Admin role.

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useBudget } from '../hooks/useBudget'
import { useFinance } from '../context/FinanceContext'
import { formatINR } from '../utils/currencyFormatter'
import { EXPENSE_CATEGORIES, CAT_COLORS, CAT_EMOJI } from '../constants'

export default function Budget() {
  const { budget, setBudget, remaining, percentUsed, getBarColor, totalExpense } = useBudget()
  const { transactions, isAdmin } = useFinance()

  // Local state for the budget input field
  const [inputValue, setInputValue] = useState(budget)

  function saveBudget() {
    if (!isAdmin) return  // guard: viewers cannot save
    if (!inputValue || Number(inputValue) <= 0) {
      toast.error('Please enter a valid budget amount')
      return
    }
    setBudget(Number(inputValue))
    toast.success('Budget saved ✅')
  }

  // Calculate how much was spent in each expense category
  const categoryBreakdown = EXPENSE_CATEGORIES.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
    return { cat, spent }
  })
    .filter((c) => c.spent > 0)          // only show categories with spending
    .sort((a, b) => b.spent - a.spent)   // highest first

  // Cap bar width at 100%
  const barWidth = Math.min(percentUsed, 100)

  return (
    <div>
      <div className="page-title">
        Budget Tracker <span className="sub">/ monthly</span>
      </div>

      <div className="grid-2">

        {/* ── Left: Set budget + overview ──────────────── */}
        <div className="card">
          <div className="section-title">Set Monthly Budget</div>

          <div className="form-group">
            <label className="form-label">Monthly Budget (₹)</label>
            <input
              className="form-input"
              type="number"
              value={inputValue}
              onChange={(e) => isAdmin && setInputValue(e.target.value)}
              placeholder="e.g. 50000"
              disabled={!isAdmin}
              style={!isAdmin ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={saveBudget}
            disabled={!isAdmin}
            style={!isAdmin ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
            title={!isAdmin ? 'Switch to Admin to edit budget' : ''}
          >
            {isAdmin ? 'Save Budget' : '🔒 Save Budget (Admin only)'}
          </button>

          {/* Budget progress */}
          <div style={{ marginTop: 28 }}>
            <div className="section-title">Budget Overview</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              <span>Spent: {formatINR(totalExpense)}</span>
              <span style={{ color: getBarColor(), fontFamily: 'JetBrains Mono, monospace' }}>
                {percentUsed.toFixed(1)}% used
              </span>
            </div>

            <div className="progress-wrap" style={{ height: 12 }}>
              <div
                className="progress-fill"
                style={{ width: `${barWidth}%`, background: getBarColor() }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Remaining</span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                fontSize: 20,
                color: remaining >= 0 ? 'var(--green)' : 'var(--red)',
              }}>
                {formatINR(remaining)}
              </span>
            </div>

            {/* Warning when over 80% */}
            {percentUsed > 80 && (
              <div style={{
                marginTop: 14,
                padding: '10px 14px',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--red)',
              }}>
                ⚠️ You've used over 80% of your budget!
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Spending per category ─────────────── */}
        <div className="card">
          <div className="section-title">Spending by Category</div>

          {categoryBreakdown.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💸</div>
              No expenses recorded yet.
            </div>
          ) : (
            categoryBreakdown.map((item) => {
              // What % of the total budget did this category use?
              const catPercent = budget > 0 ? Math.min((item.spent / budget) * 100, 100) : 0

              return (
                <div key={item.cat} style={{ marginBottom: 16 }}>

                  {/* Category name + amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{CAT_EMOJI[item.cat]} {item.cat}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatINR(item.spent)}
                    </span>
                  </div>

                  {/* Progress bar with category color */}
                  <div className="progress-wrap">
                    <div
                      className="progress-fill"
                      style={{ width: `${catPercent}%`, background: CAT_COLORS[item.cat] }}
                    />
                  </div>

                  {/* % of budget used */}
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    {catPercent.toFixed(1)}% of budget
                  </div>

                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}

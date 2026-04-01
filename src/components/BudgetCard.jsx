// components/BudgetCard.jsx
// Reusable card that shows budget progress.
// Used on both the Dashboard and Budget pages.

import React from 'react'
import { useBudget } from '../hooks/useBudget'
import { formatINR } from '../utils/currencyFormatter'

export default function BudgetCard() {
  const { budget, totalExpense, remaining, percentUsed, getBarColor } = useBudget()

  // Cap the bar at 100% even if user overspends
  const barWidth = Math.min(percentUsed, 100)

  return (
    <div>
      {/* Spent vs Budget text */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
        <span>{formatINR(totalExpense)} spent of {formatINR(budget)}</span>
        <span style={{ color: getBarColor(), fontFamily: 'JetBrains Mono, monospace' }}>
          {percentUsed.toFixed(1)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-wrap">
        <div
          className="progress-fill"
          style={{ width: `${barWidth}%`, background: getBarColor() }}
        />
      </div>

      {/* Remaining amount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Remaining</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          color: remaining >= 0 ? 'var(--green)' : 'var(--red)',
        }}>
          {formatINR(remaining)}
        </span>
      </div>
    </div>
  )
}

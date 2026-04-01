// pages/Analytics.jsx
// Shows 4 charts and a live currency converter using the exchange rate API.
//
// date-fns: used to group transactions by month for the line chart

import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { useFinance } from '../context/FinanceContext'
import { getExchangeRates } from '../services/api'
import { formatINR } from '../utils/currencyFormatter'
import {
  SpendingPieChart,
  IncomeExpenseBarChart,
  MonthlyTrendLineChart,
  CategoryBarChart,
} from '../components/Charts'
import { EXPENSE_CATEGORIES } from '../constants'

// Currencies we can convert to
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AED']

export default function Analytics() {
  const { transactions, totalIncome, totalExpense, netBalance } = useFinance()

  // ── Currency API state ────────────────────────────────────
  const [rates, setRates]               = useState(null)          // exchange rates object
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [isLoading, setIsLoading]       = useState(false)
  const [apiError, setApiError]         = useState(null)

  // Fetch exchange rates when the page loads
  useEffect(() => {
    setIsLoading(true)
    getExchangeRates()
      .then((fetchedRates) => {
        setRates(fetchedRates)
        setApiError(null)
      })
      .catch(() => {
        setApiError('Could not load exchange rates. Check your internet connection.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])  // empty array means this only runs once, on mount

  // Convert an INR amount to the selected currency
  function convert(inrAmount) {
    if (!rates || !rates[selectedCurrency]) return '—'
    const converted = inrAmount * rates[selectedCurrency]
    return converted.toFixed(2)
  }

  // ── Build chart data ──────────────────────────────────────

  // Pie chart data: total spent per expense category
  const pieData = EXPENSE_CATEGORIES.map((cat) => ({
    name:  cat,
    value: transactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0),
  })).filter((item) => item.value > 0)

  // Bar chart data: income vs expenses (single grouped bar)
  const barData = [
    { name: 'This Period', Income: totalIncome, Expenses: totalExpense }
  ]

  // Horizontal bar chart: expense amount per category
  const categoryData = EXPENSE_CATEGORIES.map((cat) => ({
    name:   cat,
    amount: transactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0),
  }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  // Line chart data: group by month using date-fns
  // We build an object like: { "Mar 25": { month: "Mar 25", Income: 45000, Expenses: 8000 } }
  const monthlyMap = {}
  transactions.forEach((tx) => {
    // format() from date-fns converts "2025-03-15" → "Mar 25"
    const monthKey = format(parseISO(tx.date), 'MMM yy')

    // Create entry if it doesn't exist yet
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { month: monthKey, Income: 0, Expenses: 0 }
    }

    // Add to the right total
    if (tx.type === 'income')  monthlyMap[monthKey].Income   += tx.amount
    if (tx.type === 'expense') monthlyMap[monthKey].Expenses += tx.amount
  })

  // Convert the object to an array and sort by date
  const trendData = Object.values(monthlyMap).sort((a, b) => {
    return new Date('01 ' + a.month) - new Date('01 ' + b.month)
  })

  return (
    <div>
      <div className="page-title">
        Analytics <span className="sub">/ deep dive</span>
      </div>

      {/* ── Currency Converter ────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">💱 Live Currency Conversion</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

          <span style={{ fontSize: 13, color: 'var(--muted)' }}>View totals in:</span>

          <select
            className="form-select"
            style={{ width: 120 }}
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Loading and error states */}
          {isLoading && <span style={{ fontSize: 13, color: 'var(--muted)' }}>Loading rates...</span>}
          {apiError  && <span style={{ fontSize: 13, color: 'var(--red)' }}>{apiError}</span>}

          {/* Show converted totals once rates are loaded */}
          {rates && !isLoading && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Income',   value: totalIncome  },
                { label: 'Expenses', value: totalExpense },
                { label: 'Balance',  value: netBalance   },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'inline-flex',
                  gap: 6,
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--muted)',
                }}>
                  {label}: <span style={{ color: 'var(--text)' }}>{selectedCurrency} {convert(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Pie + Bar side by side ────────────────────────── */}
      <div className="grid-2">
        <div className="card">
          <div className="section-title">🍩 Spending by Category</div>
          <SpendingPieChart data={pieData} />
        </div>

        <div className="card">
          <div className="section-title">📊 Income vs Expenses</div>
          <IncomeExpenseBarChart data={barData} />
        </div>
      </div>

      {/* ── Monthly trend line chart ──────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">📈 Monthly Spending Trend</div>
        <MonthlyTrendLineChart data={trendData} />
      </div>

      {/* ── Category breakdown horizontal bar ─────────────── */}
      <div className="card">
        <div className="section-title">💸 Expense Breakdown by Category</div>
        <CategoryBarChart data={categoryData} />
      </div>

    </div>
  )
}

// components/Charts.jsx
// All chart components live here.
// We use the "recharts" library — it takes an array of data and draws the chart.

import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import { CAT_COLORS } from '../constants'
import { formatINR } from '../utils/currencyFormatter'

// Shared tooltip style (the popup when you hover on a chart)
const tooltipStyle = {
  background: '#1a1d27',
  border: '1px solid #2e3250',
  borderRadius: 8,
  color: '#e8eaf6',
  fontSize: 13,
}

// ─────────────────────────────────────────────────────────────
// 1. Pie Chart — shows expense split by category
//    data format: [{ name: 'Food', value: 1200 }, ...]
// ─────────────────────────────────────────────────────────────
export function SpendingPieChart({ data }) {
  if (data.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>No expense data yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"     // which field is the number
          nameKey="name"      // which field is the label
          cx="50%"            // center X
          cy="50%"            // center Y
          outerRadius={90}
          innerRadius={50}    // makes it a donut
        >
          {/* Give each slice its category color */}
          {data.map((item, index) => (
            <Cell key={index} fill={CAT_COLORS[item.name] || '#6c8ffd'} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatINR(value)} contentStyle={tooltipStyle} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. Bar Chart — Income vs Expenses side by side
//    data format: [{ name: 'This Month', Income: 45000, Expenses: 8000 }]
// ─────────────────────────────────────────────────────────────
export function IncomeExpenseBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3250" />
        <XAxis dataKey="name" tick={{ fill: '#7c82a8', fontSize: 12 }} axisLine={false} />
        <YAxis tick={{ fill: '#7c82a8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => '₹' + v} />
        <Tooltip formatter={(value) => formatINR(value)} contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Income"   fill="var(--green)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expenses" fill="var(--red)"   radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. Line Chart — Monthly spending trend over time
//    data format: [{ month: 'Jan 25', Income: 45000, Expenses: 8000 }, ...]
// ─────────────────────────────────────────────────────────────
export function MonthlyTrendLineChart({ data }) {
  if (data.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Not enough data for a trend yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3250" />
        <XAxis dataKey="month" tick={{ fill: '#7c82a8', fontSize: 12 }} axisLine={false} />
        <YAxis tick={{ fill: '#7c82a8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => '₹' + v} />
        <Tooltip formatter={(value) => formatINR(value)} contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Income"   stroke="var(--green)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Expenses" stroke="var(--red)"   strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─────────────────────────────────────────────────────────────
// 4. Horizontal Bar — Expense breakdown by category
//    data format: [{ name: 'Food', amount: 1200 }, ...]
// ─────────────────────────────────────────────────────────────
export function CategoryBarChart({ data }) {
  if (data.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>No expense data yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <XAxis
          type="number"
          tick={{ fill: '#7c82a8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => '₹' + v}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#e8eaf6', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip formatter={(value) => formatINR(value)} contentStyle={tooltipStyle} />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
          {data.map((item, index) => (
            <Cell key={index} fill={CAT_COLORS[item.name] || '#6c8ffd'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

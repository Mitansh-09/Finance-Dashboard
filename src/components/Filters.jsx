// components/Filters.jsx
// Dropdowns for filtering and sorting transactions.
// Receives `filters` object and `setFilters` function as props.

import React from 'react'
import { ALL_CATEGORIES } from '../constants'

export default function Filters({ filters, setFilters }) {

  // Helper: update one field in the filters object
  function update(field, value) {
    setFilters({ ...filters, [field]: value })
  }

  return (
    <>
      {/* Filter by category */}
      <select
        className="form-select"
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="All">All Categories</option>
        {ALL_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Filter by type */}
      <select
        className="form-select"
        value={filters.type}
        onChange={(e) => update('type', e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Date range: From */}
      <input
        className="form-input"
        type="date"
        style={{ width: 150 }}
        value={filters.dateFrom}
        onChange={(e) => update('dateFrom', e.target.value)}
        title="From date"
      />

      {/* Date range: To */}
      <input
        className="form-input"
        type="date"
        style={{ width: 150 }}
        value={filters.dateTo}
        onChange={(e) => update('dateTo', e.target.value)}
        title="To date"
      />

      {/* Sort */}
      <select
        className="form-select"
        value={filters.sortBy}
        onChange={(e) => update('sortBy', e.target.value)}
      >
        <option value="date">Sort: Date</option>
        <option value="amount">Sort: Amount</option>
        <option value="category">Sort: Category</option>
      </select>
    </>
  )
}

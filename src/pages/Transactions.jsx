// pages/Transactions.jsx
// Shows all transactions with search, filter, sort, edit and delete.
// Add / Edit / Delete actions are restricted to Admin role.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdAdd } from 'react-icons/md'
import { useTransactions } from '../hooks/useTransactions'
import { useDebounce } from '../hooks/useDebounce'
import { useFinance } from '../context/FinanceContext'
import TransactionCard from '../components/TransactionCard'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'
import EditModal from '../components/EditModal'

export default function Transactions() {
  const { transactions, deleteTransaction, updateTransaction } = useTransactions()
  const { isAdmin } = useFinance()
  const navigate = useNavigate()

  // ── Search state ─────────────────────────────────────────
  // searchRaw: what the user is typing right now
  // search: the debounced version (updates after 300ms pause)
  const [searchRaw, setSearchRaw] = useState('')
  const search = useDebounce(searchRaw, 300)

  // ── Filter + Sort state ───────────────────────────────────
  const [filters, setFilters] = useState({
    category: 'All',
    type:     'All',
    dateFrom: '',
    dateTo:   '',
    sortBy:   'date',
  })

  // ── Edit modal state ──────────────────────────────────────
  // null means modal is closed, a transaction object means it's open
  const [editingTransaction, setEditingTransaction] = useState(null)

  // ── Step 1: Filter transactions ───────────────────────────
  const filtered = transactions.filter((tx) => {
    const query = search.toLowerCase()

    // Does title or notes contain the search query?
    const matchesSearch =
      tx.title.toLowerCase().includes(query) ||
      tx.notes.toLowerCase().includes(query)

    // Does category match the filter?
    const matchesCategory =
      filters.category === 'All' || tx.category === filters.category

    // Does type match the filter?
    const matchesType =
      filters.type === 'All' || tx.type === filters.type

    // Is the date within the selected range?
    const matchesDateFrom = !filters.dateFrom || tx.date >= filters.dateFrom
    const matchesDateTo   = !filters.dateTo   || tx.date <= filters.dateTo

    return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo
  })

  // ── Step 2: Sort filtered transactions ────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (filters.sortBy === 'date')     return new Date(b.date) - new Date(a.date)
    if (filters.sortBy === 'amount')   return b.amount - a.amount
    if (filters.sortBy === 'category') return a.category.localeCompare(b.category)
    return 0
  })

  // ── Delete handler ────────────────────────────────────────
  function handleDelete(id) {
    deleteTransaction(id)
    toast.success('Transaction deleted')
  }

  // ── Save edit handler ─────────────────────────────────────
  function handleSave(id, updatedData) {
    updateTransaction(id, updatedData)
    toast.success('Transaction updated ✅')
  }

  return (
    <div>
      {/* Title + Add button */}
      <div className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>
          Transactions <span className="sub">/ {sorted.length} records</span>
        </span>
        {/* Add button only visible to Admin */}
        {isAdmin && (
          <button
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => navigate('/transactions/new')}
          >
            <MdAdd style={{ fontSize: 18 }} /> Add New
          </button>
        )}
      </div>

      {/* Search + Filter bar */}
      <div className="filter-bar">
        <SearchBar value={searchRaw} onChange={setSearchRaw} />
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      {/* Transaction list */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            No transactions match your filters.
          </div>
        ) : (
          sorted.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              onEdit={setEditingTransaction}   // opens the edit modal
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Edit modal — only shown when editingTransaction is not null */}
      {editingTransaction && (
        <EditModal
          tx={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

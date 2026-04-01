// components/TransactionCard.jsx
// Displays one transaction row with edit and delete buttons.
// Edit/Delete are hidden for Viewer role.

import React from 'react'
import { MdEdit, MdDelete } from 'react-icons/md'
import { CAT_EMOJI } from '../constants'
import { formatINR, formatDate } from '../utils/currencyFormatter'
import { useFinance } from '../context/FinanceContext'

export default function TransactionCard({ tx, onEdit, onDelete }) {
  const { isAdmin } = useFinance()
  // Pick icon background color based on income or expense
  const iconBg = tx.type === 'income'
    ? 'rgba(74,222,128,0.12)'
    : 'rgba(248,113,113,0.12)'

  // Pick amount color
  const amountColor = tx.type === 'income' ? 'var(--green)' : 'var(--red)'

  // Amount text: +₹45,000 or -₹380
  const amountText = (tx.type === 'income' ? '+' : '-') + formatINR(tx.amount)

  return (
    <div className="tx-row">

      {/* Category emoji icon */}
      <div className="tx-icon" style={{ background: iconBg }}>
        {CAT_EMOJI[tx.category] || '💰'}
      </div>

      {/* Title, recurring badge, date + category */}
      <div className="tx-info">
        <div className="tx-title">
          {tx.title}
          {tx.recurring && (
            <span className="badge badge-recurring">↻ recurring</span>
          )}
        </div>
        <div className="tx-meta">
          {formatDate(tx.date)} · {tx.category}
          {tx.notes ? ` · ${tx.notes}` : ''}
        </div>
      </div>

      {/* income / expense badge */}
      <span className={`badge badge-${tx.type}`} style={{ marginRight: 10 }}>
        {tx.type}
      </span>

      {/* Amount */}
      <span className="tx-amount" style={{ color: amountColor }}>
        {amountText}
      </span>

      {/* Edit and Delete buttons — Admin only */}
      {isAdmin && (
        <div className="tx-actions">
          <button className="btn-icon" onClick={() => onEdit(tx)} title="Edit">
            <MdEdit />
          </button>
          <button className="btn-icon danger" onClick={() => onDelete(tx.id)} title="Delete">
            <MdDelete />
          </button>
        </div>
      )}

    </div>
  )
}

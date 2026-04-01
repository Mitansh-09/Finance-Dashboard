// components/EditModal.jsx
// A popup (modal) that lets you edit an existing transaction.
//
// react-hook-form — manages the form fields and values
// yup             — defines the validation rules (required, positive number, etc.)

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants'

const schema = yup.object({
  title:     yup.string().required('Title is required'),
  amount:    yup.number().typeError('Must be a number').positive('Must be greater than 0').required('Amount is required'),
  category:  yup.string().required(),
  date:      yup.string().required('Date is required'),
  type:      yup.string().required(),
  notes:     yup.string(),
  recurring: yup.boolean(),
})

export default function EditModal({ tx, onClose, onSave }) {

  // useForm gives us: register (connect inputs), handleSubmit, watch (read value), setValue, formState (errors)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),  // connect yup rules to the form
    defaultValues: {
      title:     tx.title,
      amount:    tx.amount,
      category:  tx.category,
      date:      tx.date,
      type:      tx.type,
      notes:     tx.notes,
      recurring: tx.recurring,
    },
  })

  // watch('type') reads the current value of the "type" field in real time
  const currentType = watch('type')

  // When the type switches (income ↔ expense), reset category to a valid one
  useEffect(() => {
    const validCategories = currentType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
    const currentCategory = watch('category')
    if (!validCategories.includes(currentCategory)) {
      setValue('category', validCategories[0])
    }
  }, [currentType])

  // Called when the form is submitted with no errors
  function onSubmit(data) {
    onSave(tx.id, { ...data, amount: Number(data.amount) })
    onClose()
  }

  return (
    // Dark overlay behind the modal
    <div className="modal-overlay" onClick={onClose}>


      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">✏️ Edit Transaction</div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

      
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn expense ${currentType === 'expense' ? 'active' : ''}`}
                onClick={() => setValue('type', 'expense')}
              >
                💸 Expense
              </button>
              <button
                type="button"
                className={`type-btn income ${currentType === 'income' ? 'active' : ''}`}
                onClick={() => setValue('type', 'income')}
              >
                💰 Income
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title</label>
              {/* {...register('title')} connects this input to react-hook-form */}
              <input className="form-input" {...register('title')} />
              {/* Show error message if validation fails */}
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input className="form-input" type="number" {...register('amount')} />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>
          </div>

          {/* ── Category + Date ──────────────────────── */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" {...register('category')}>
                {(currentType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" {...register('date')} />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
          </div>

          {/* ── Notes ───────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" {...register('notes')} />
          </div>

          {/* ── Recurring checkbox ───────────────────── */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="edit-recurring"
              {...register('recurring')}
              style={{ accentColor: 'var(--purple)', width: 16, height: 16 }}
            />
            <label htmlFor="edit-recurring" style={{ fontSize: 14, cursor: 'pointer' }}>
              ↻ Recurring transaction
            </label>
          </div>

          {/* ── Buttons ──────────────────────────────── */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  )
}

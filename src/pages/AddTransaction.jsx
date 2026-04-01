// pages/AddTransaction.jsx
// The form for adding a new transaction.
//
// react-hook-form: manages all form field values and submission
// yup:             defines rules like "title is required", "amount must be positive"
// date-fns:        used to get today's date in the right format

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useTransactions } from '../hooks/useTransactions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants'

// ── Step 1: Define validation rules with yup ─────────────────
const schema = yup.object({
  title:     yup.string().required('Title is required').min(2, 'At least 2 characters'),
  amount:    yup.number()
                .typeError('Enter a valid number')
                .positive('Must be greater than 0')
                .required('Amount is required'),
  category:  yup.string().required('Category is required'),
  date:      yup.string().required('Date is required'),
  type:      yup.string().required(),
  notes:     yup.string(),       // optional
  recurring: yup.boolean(),
})

export default function AddTransaction() {
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()

  // ── Step 2: Set up react-hook-form ───────────────────────
  const {
    register,           // connects an input to the form
    handleSubmit,       // wraps your onSubmit — runs validation first
    watch,              // lets you read a field's current value
    setValue,           // lets you manually set a field's value
    reset,              // clears the form back to defaults
    formState: { errors, isSubmitSuccessful },
    // errors: object with error messages if validation fails
    // isSubmitSuccessful: true after a successful submit
  } = useForm({
    resolver: yupResolver(schema),   // plug in our yup rules
    defaultValues: {
      title:     '',
      amount:    '',
      category:  'Food',
      date:      format(new Date(), 'yyyy-MM-dd'),  // today's date, e.g. "2025-03-25"
      type:      'expense',
      notes:     '',
      recurring: false,
    },
  })

  // Read the current value of the "type" field live
  const currentType = watch('type')

  // When type changes (income ↔ expense), switch category to a valid one
  useEffect(() => {
    const validCategories = currentType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
    const currentCategory = watch('category')
    if (!validCategories.includes(currentCategory)) {
      setValue('category', validCategories[0])
    }
  }, [currentType])

  // After successful submit: show toast + reset the form
  useEffect(() => {
    if (isSubmitSuccessful) {
      toast.success('Transaction added! 🎉')
      reset({
        title:     '',
        amount:    '',
        category:  'Food',
        date:      format(new Date(), 'yyyy-MM-dd'),
        type:      'expense',
        notes:     '',
        recurring: false,
      })
    }
  }, [isSubmitSuccessful])

  // ── Step 3: Submit handler ───────────────────────────────
  // This only runs if ALL validations pass
  function onSubmit(data) {
    addTransaction({ ...data, amount: Number(data.amount) })
    // toast and reset are handled by the useEffect above
  }

  return (
    <div>
      <div className="page-title">
        Add Transaction <span className="sub">/ new entry</span>
      </div>

      <div className="card" style={{ maxWidth: 580 }}>

        {/* handleSubmit(onSubmit) — yup validates first, then calls onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* ── Income / Expense toggle ──────────────────── */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
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

          {/* ── Title + Amount ───────────────────────────── */}
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label">Title *</label>
              {/* {...register('title')} tells react-hook-form to track this input */}
              <input
                className="form-input"
                placeholder="e.g. Netflix subscription"
                {...register('title')}
              />
              {/* Show error if title is empty or too short */}
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                className="form-input"
                type="number"
                placeholder="0"
                min="0"
                {...register('amount')}
              />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>

          </div>

          {/* ── Category + Date ──────────────────────────── */}
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" {...register('category')}>
                {/* Show expense or income categories depending on type */}
                {(currentType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                className="form-input"
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>

          </div>

          {/* ── Notes ───────────────────────────────────── */}
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Any extra details about this transaction..."
              {...register('notes')}
            />
          </div>

          {/* ── Recurring checkbox ───────────────────────── */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="recurring"
              {...register('recurring')}
              style={{ accentColor: 'var(--purple)', width: 16, height: 16 }}
            />
            <label htmlFor="recurring" style={{ fontSize: 14, cursor: 'pointer' }}>
              ↻ Mark as recurring (e.g. rent, subscriptions)
            </label>
          </div>

          {/* ── Submit + Navigate ────────────────────────── */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary">
              Add Transaction
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/transactions')}
            >
              View All →
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

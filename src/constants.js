// constants.js
// All shared data used across the app lives here.
// If you want to add a new category, just add it here.

export const EXPENSE_CATEGORIES = [
  'Food', 'Travel', 'Rent', 'Shopping',
  'Entertainment', 'Health', 'Utilities', 'Subscriptions',
]

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Other']

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

// Color for each category (used in charts)
export const CAT_COLORS = {
  Food:          '#f87171',
  Travel:        '#fbbf24',
  Rent:          '#a78bfa',
  Shopping:      '#6c8ffd',
  Entertainment: '#34d399',
  Health:        '#f472b6',
  Utilities:     '#60a5fa',
  Subscriptions: '#fb923c',
  Salary:        '#4ade80',
  Freelance:     '#a3e635',
  Other:         '#94a3b8',
}

// Emoji for each category (shown in transaction rows)
export const CAT_EMOJI = {
  Food:          '🍔',
  Travel:        '✈️',
  Rent:          '🏠',
  Shopping:      '🛒',
  Entertainment: '🎬',
  Health:        '💊',
  Utilities:     '⚡',
  Subscriptions: '📱',
  Salary:        '💼',
  Freelance:     '💻',
  Other:         '📦',
}

// utils/currencyFormatter.js
// Simple helper functions for formatting values

// Turns 45000 → "₹45,000"
export function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN')
}

// Turns "2025-03-15" → "15 Mar 2025"
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

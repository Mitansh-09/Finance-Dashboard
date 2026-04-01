// hooks/useCurrency.js
// Formats numbers into rupee strings.

export function useCurrency() {

  // 45000 → "₹45,000"
  function fmt(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN')
  }

  return { fmt }
}

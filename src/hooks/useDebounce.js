// hooks/useDebounce.js
// Debounce means: "wait until the user stops typing before doing something".
// Without this, the filter would run on every single keystroke.
// With 300ms delay, it only runs after the user pauses for 0.3 seconds.

import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 300) {
  // This holds the "delayed" copy of the value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Start a timer. After `delay` ms, update the debounced value.
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // If the user types again before the timer fires,
    // cancel the old timer and start a fresh one.
    return () => clearTimeout(timer)

  }, [value, delay])  // re-run whenever value or delay changes

  return debouncedValue
}

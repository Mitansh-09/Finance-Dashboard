// components/SearchBar.jsx
// A simple search input with a search icon inside it.

import React from 'react'
import { MdSearch } from 'react-icons/md'

export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {/* Search icon placed inside the input visually */}
      <MdSearch style={{
        position: 'absolute',
        left: 10,
        color: 'var(--muted)',
        fontSize: 18,
        pointerEvents: 'none',  // so clicking the icon still focuses the input
      }} />

      <input
        className="form-input"
        style={{ paddingLeft: 34 }}   // make room for the icon
        placeholder="Search title or notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

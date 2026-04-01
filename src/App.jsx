// App.jsx
// Sets up the sidebar + all page routes.

import React from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { MdDashboard, MdReceiptLong, MdAddCircleOutline, MdSavings, MdBarChart, MdAdminPanelSettings, MdVisibility } from 'react-icons/md'
import { useFinance, ROLES } from './context/FinanceContext'

// Import all pages
import Dashboard      from './pages/Dashboard'
import Transactions   from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Budget         from './pages/Budget'
import Analytics      from './pages/Analytics'

// Sidebar navigation links
const NAV_LINKS = [
  { to: '/dashboard',        icon: <MdDashboard />,        label: 'Dashboard'       },
  { to: '/transactions',     icon: <MdReceiptLong />,      label: 'Transactions'    },
  { to: '/transactions/new', icon: <MdAddCircleOutline />, label: 'Add Transaction' },
  { to: '/budget',           icon: <MdSavings />,          label: 'Budget'          },
  { to: '/analytics',        icon: <MdBarChart />,         label: 'Analytics'       },
]

function Sidebar() {
  const { role, setRole, isAdmin } = useFinance()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        fi<span>nance</span>
      </div>

      <nav>
        {NAV_LINKS.map((link) => {
          // Hide "Add Transaction" route for Viewer role
          if (link.to === '/transactions/new' && !isAdmin) return null
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {link.icon}
              <span className="nav-label">{link.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* ── Role Switcher ──────────────────────────────────── */}
      {/* Sits at the bottom of the sidebar for easy demo switching */}
      <div className="role-switcher">
        <div className="role-label">
          <span className="nav-label">Current Role</span>
        </div>
        <button
          className={`role-btn ${role === ROLES.ADMIN ? 'active' : ''}`}
          onClick={() => setRole(ROLES.ADMIN)}
          title="Admin – full access"
        >
          <MdAdminPanelSettings />
          <span className="nav-label">Admin</span>
        </button>
        <button
          className={`role-btn viewer ${role === ROLES.VIEWER ? 'active' : ''}`}
          onClick={() => setRole(ROLES.VIEWER)}
          title="Viewer – read only"
        >
          <MdVisibility />
          <span className="nav-label">Viewer</span>
        </button>
        {/* Badge shown in collapsed sidebar mode */}
        <div className="role-badge-mini" title={`Role: ${role}`}>
          {isAdmin ? <MdAdminPanelSettings style={{ color: 'var(--accent)' }} /> : <MdVisibility style={{ color: 'var(--yellow)' }} />}
        </div>
      </div>
    </aside>
  )
}

export default function App() {
  const { isAdmin } = useFinance()

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        {/* Viewer mode banner */}
        {!isAdmin && (
          <div className="viewer-banner">
            <MdVisibility />
            <span>
              <strong>Viewer Mode</strong> — read-only access. Switch to <strong>Admin</strong> in the sidebar to add, edit, or delete transactions.
            </span>
          </div>
        )}

        <Routes>
          {/* Redirect "/" to "/dashboard" automatically */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Each route maps a URL to a page component */}
          <Route path="/dashboard"        element={<Dashboard />}      />
          <Route path="/transactions"     element={<Transactions />}   />
          <Route path="/transactions/new" element={isAdmin ? <AddTransaction /> : <Navigate to="/transactions" replace />} />
          <Route path="/budget"           element={<Budget />}         />
          <Route path="/analytics"        element={<Analytics />}      />
        </Routes>
      </main>
    </div>
  )
}

// main.jsx
// This is the entry point — React starts here.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // enables URL routing
import App from './App'
import { FinanceProvider } from './context/FinanceContext'
import { ToastContainer } from 'react-toastify'   // popup notifications
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter: makes React Router work */}
    <BrowserRouter>
      {/* FinanceProvider: gives all components access to global state */}
      <FinanceProvider>
        <App />
        {/* ToastContainer: shows toast notifications (like "Transaction added!") */}
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          theme="dark"
          toastStyle={{
            background: '#1a1d27',
            border: '1px solid #2e3250',
            color: '#e8eaf6',
          }}
        />
      </FinanceProvider>
    </BrowserRouter>
  </React.StrictMode>
)

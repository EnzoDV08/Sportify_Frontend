import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import viteLogo from '../assets/vite.svg'
import reactLogo from '../assets/react.svg'
import '../Style/App.css'
import AdminDashboard from './AdminDashboard'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={viteLogo} alt="Vite Logo" className="loading-logo" />
        <PropagateLoader color="#0078d7" size={15} />
        <p className="loading-text">Loading the future... 🚀</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

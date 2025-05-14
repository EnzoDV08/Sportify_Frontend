import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../Components/Sidebar'
import AdminDashboard from './AdminDashboard'
import '../Style/App.css' 

function App() {
  return (
    <BrowserRouter>
      <div className="layout-container">
        <Sidebar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App








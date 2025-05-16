import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import CompanySignUp from './pages/CompanySignUp';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/SignUp';

const AppRoutes = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/company-signup';

  return (
    <div className="layout-container">
      {!hideSidebar && <Sidebar />}
      <div className="page-content">
        <Routes>
          <Route path="/company-signup" element={<CompanySignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

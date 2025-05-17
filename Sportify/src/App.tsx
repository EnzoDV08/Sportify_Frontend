import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Components/Sidebar';
import CompanySignUp from './pages/CompanySignUp';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import AuthLayout from './pages/AuthLayout';

const AppRoutes = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const hideSidebar = location.pathname.startsWith('/auth');

  return (
    <div className={`layout-container ${!hideSidebar ? 'main-app-layout' : ''}`}>
      {!hideSidebar && <Sidebar />}
      <div className="page-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {!isLoggedIn ? (
              <>
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="signup" element={<Signup />} />
                  <Route path="login" element={<Login />} />
                  <Route path="company-signup" element={<CompanySignUp />} />
                </Route>
                <Route path="*" element={<Navigate to="/auth/signup" />} />
              </>
            ) : (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/home" />} />
              </>
            )}
          </Routes>
        </AnimatePresence>
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


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';

import { AuthProvider } from './contexts/AuthContext';
import { RentalProvider } from './contexts/RentalContext';
import AdminPages from './pages/admin/AdminPages';
import './styles/admin/admin.css';

// Existing Pages
import GuestBrowse from './pages/GuestBrowse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import RentalHome from './pages/RentalHome';

// Rental/Seller Protected Route
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <RentalProvider>
         
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<GuestBrowse />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Seller Routes */}
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Renter Routes */}
                <Route
                  path="/rental"
                  element={
                    <ProtectedRoute requiredRole="renter">
                      <RentalHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/rental/*"
                  element={
                    <ProtectedRoute requiredRole="renter">
                      <RentalHome />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes - All go to AdminPages (dashboard) */}
                <Route path="/admin" element={<AdminPages />} />
                <Route path="/admin/*" element={<AdminPages />} />
                <Route path="/admin/login" element={<AdminPages />} />
                <Route path="/admin/register" element={<AdminPages />} />
                <Route path="/admin/dashboard" element={<AdminPages />} />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
           
          </RentalProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
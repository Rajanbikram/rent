import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import GuestBrowse from './pages/GuestBrowse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import RentalHome from './pages/RentalHome'; // ✅ NEW

// Simplified Protected Route - Uses localStorage directly
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  console.log('🔒 ProtectedRoute:', { hasToken: !!token, userRole, requiredRole });

  if (!token) {
    console.log('❌ No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`❌ Wrong role: ${userRole} !== ${requiredRole}`);
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Access granted!');
  return children;
};

function App() {
  return (
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

      {/* ✅ NEW: Protected Renter Routes */}
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

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
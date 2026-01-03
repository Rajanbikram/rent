import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/Authcontext';
import { RentalProvider } from './contexts/RentalContext'; // ✅ NEW

// Existing Pages
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import GuestBrowse from './pages/GuestBrowse';

// ✅ NEW: Rental Pages
import RentalHome from './pages/RentalHome';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <RentalProvider> {/* ✅ NEW: Wrap with RentalProvider */}
        <Router>
          <Routes>
            {/* Public Routes - Marketplace */}
            <Route path="/" element={<ProductsPage />} />
            <Route path="/browse" element={<GuestBrowse />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* ✅ NEW: Public Rental Routes */}
            <Route path="/rental" element={<RentalHome />} />
            <Route path="/rental/browse" element={<RentalHome />} />
            
            {/* Protected Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute requiredRole="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* ✅ NEW: Protected Rental Routes (Optional - if you want auth-only features) */}
            <Route
              path="/rental/my-rentals"
              element={
                <ProtectedRoute>
                  <RentalHome />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </RentalProvider> {/* ✅ NEW: Close RentalProvider */}
    </AuthProvider>
  );
}

export default App;
"// Dec 31: Added comment" 

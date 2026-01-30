import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { RentalProvider } from './contexts/RentalContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPages from './pages/admin/AdminPages';
import './styles/admin/admin.css';

// Existing Pages
import GuestBrowse from './pages/GuestBrowse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import RentalHome from './pages/RentalHome';

// ✅ Route guard component
function RouteGuard({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    console.log('📍 Current route:', location.pathname);
  }, [location]);
  
  return children;
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <RentalProvider>
            <RouteGuard>
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/" 
                  element={
                    <div>
                      <GuestBrowse />
                    </div>
                  } 
                />
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

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPages />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Login/Register (public) */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin/register" element={<RegisterPage />} />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </RouteGuard>
          </RentalProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Simple check - NO API calls, NO verification
  // Just trust localStorage until backend says otherwise (401/403)
  
  // No token = redirect to login
  if (!token) {
    console.log('❌ No token - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role match if required
  if (requiredRole && userRole !== requiredRole) {
    console.log(`❌ Role mismatch: need ${requiredRole}, have ${userRole}`);
    return <Navigate to="/login" replace />;
  }

  // All good - render the protected content
  console.log('✅ Protected route access granted');
  return children;
};

export default ProtectedRoute;
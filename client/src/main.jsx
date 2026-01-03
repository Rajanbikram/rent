import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RentalProvider } from './contexts/RentalContext'; // ✅ ADDED
import App from './App.jsx';
import './index.css';

// ✅ Toast functionality moved here
const Root = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, title, message, type }]);
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <RentalProvider showToast={showToast}> {/* ✅ ADDED */}
          <App />
        </RentalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
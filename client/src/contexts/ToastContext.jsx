import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/admin/Toast';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((title, message, duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} title={toast.title} message={toast.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
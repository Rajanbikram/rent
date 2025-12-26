import React from 'react';

const Toast = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast ${toast.variant}`}
          onClick={() => onRemove(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className="toast-title">{toast.title}</div>
          {toast.description && (
            <div className="toast-description">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toast;
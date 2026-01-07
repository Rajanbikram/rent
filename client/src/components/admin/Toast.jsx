import React from 'react';

function Toast({ title, message }) {
  return (
    <div className="toast">
      <div className="toast-title">{title}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
}

export default Toast;
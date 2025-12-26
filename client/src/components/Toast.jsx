import React, { useEffect } from 'react';

const Toast = ({ title, description, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 min-w-[280px] animate-fade-in">
      <div className="font-semibold">{title}</div>
      {description && (
        <div className="text-sm opacity-95 mt-1.5">
          {description}
        </div>
      )}
    </div>
  );
};

export default Toast;
import React from 'react';

const styleMap = {
  error: 'bg-red-100 border border-red-400 text-red-700',
  success: 'bg-green-100 border border-green-400 text-green-700',
  info: 'bg-blue-100 border border-blue-400 text-blue-700',
};

export default function Alert({ message, type = 'error', className = '' }) {
  return (
    <div className={`${styleMap[type]} px-4 py-3 rounded ${className}`}>
      {message}
    </div>
  );
}

import React from 'react';

export default function Button({
  children,
  onClick,
  disabled = false,
  className = '',
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-indigo-600 text-white font-semibold
        py-2 px-4 rounded-md
        hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
        flex justify-center items-center
        ${className}
      `}
    >
      {children}
    </button>
  );
}

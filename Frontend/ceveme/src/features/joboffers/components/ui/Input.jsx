import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg bg-ivorymedium border border-cloudlight text-slatedark placeholder-clouddark focus:outline-none focus:ring-2 focus:ring-feedbackfocus ${className}`}
      {...props}
    />
  );
}

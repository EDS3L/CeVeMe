import React from 'react';

export default function Select({ className = '', ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-lg bg-ivorymedium border border-cloudlight text-slatedark focus:outline-none focus:ring-2 focus:ring-feedbackfocus ${className}`}
      {...props}
    />
  );
}

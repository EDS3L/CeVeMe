import React from 'react';

export default function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full px-4 py-2
        border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-indigo-300
        transition
      "
    />
  );
}

import React from 'react';

export default function Card({ className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl bg-ivorylight border border-basewhite/50 shadow-sm ${className}`}
      {...props}
    />
  );
}

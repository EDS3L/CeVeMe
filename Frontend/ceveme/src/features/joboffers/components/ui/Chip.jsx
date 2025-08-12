import React from 'react';

export default function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-ivorymedium border border-cloudlight text-slatedark">
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded hover:bg-ivorylight"
          aria-label="Usuń"
        >
          ×
        </button>
      )}
    </span>
  );
}

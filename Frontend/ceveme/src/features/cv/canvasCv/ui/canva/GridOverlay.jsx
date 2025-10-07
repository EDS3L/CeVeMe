import React from 'react';

export default function GridOverlay({ show = true }) {
  if (!show) return null;
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,.04) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,.04) 1px, transparent 1px)`,
        backgroundSize: '10mm 10mm, 10mm 10mm',
      }}
    />
  );
}

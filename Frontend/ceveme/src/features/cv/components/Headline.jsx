import React from 'react';

export default function Headline({ text = '' }) {
  if (!text) return null;
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-extrabold text-slatedark">{text}</h1>
    </div>
  );
}

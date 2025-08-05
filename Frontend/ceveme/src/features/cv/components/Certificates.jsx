import React from 'react';

export default function Certificates({ items }) {
  if (!items.length) return null;
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Certyfikaty</h2>
      <ul className="list-disc list-inside text-gray-700">
        {items.map((cert, i) => (
          <li key={i}>{cert}</li>
        ))}
      </ul>
    </section>
  );
}

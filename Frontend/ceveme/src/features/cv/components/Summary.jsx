import React from 'react';

export default function Summary({ text }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Podsumowanie</h2>
      <p className="text-gray-700">{text}</p>
    </section>
  );
}

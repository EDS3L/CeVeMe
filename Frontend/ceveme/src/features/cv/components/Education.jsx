import React from 'react';

export default function Experience({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Doświadczenie</h2>
      {items.map((exp, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-medium">
            {exp.period} – {exp.company}
          </p>
          <p>
            <strong>{exp.title}</strong>
            {exp.location && `, ${exp.location}`}
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-1">
            {Array.isArray(exp.achievements)
              ? exp.achievements.map((a, i) => <li key={i}>{a}</li>)
              : null}
          </ul>
        </div>
      ))}
    </section>
  );
}

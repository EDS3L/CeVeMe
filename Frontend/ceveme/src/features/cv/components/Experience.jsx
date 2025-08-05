import React from 'react';

export default function Experience({ items }) {
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
            {exp.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

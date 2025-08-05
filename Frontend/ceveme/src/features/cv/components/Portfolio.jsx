import React from 'react';

export default function Portfolio({ items }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Projekty</h2>
      {items.map((p, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-medium">
            {p.name} <span className="text-sm italic">({p.type})</span>
          </p>
          <p className="text-gray-700">{p.description}</p>
          <p className="text-sm">
            <strong>Technologie:</strong> {p.technologies.join(', ')}
          </p>
          {p.url && (
            <p className="text-sm">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Link do projektu
              </a>
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

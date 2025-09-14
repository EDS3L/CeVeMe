import React from 'react';
import { TEMPLATES } from '../../services/templates';

export default function TemplatesPanel({ setDocument }) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Szablony</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        {TEMPLATES.map((t) => (
          <button
            key={[t.id]}
            onClick={() => setDocument(t.build())}
            style={{
              padding: '10px',
              border: '1px solid rgba(0,0,0,.08)',
              borderRadius: 8,
              textAlign: 'left',
              background: '#fff',
            }}
          >
            <div style={{ fontWeight: 700 }}>{[t.name]}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Zastosuj</div>
          </button>
        ))}
      </div>
    </div>
  );
}

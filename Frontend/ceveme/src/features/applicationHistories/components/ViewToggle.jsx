// src/pages/applicationHistory/components/ViewToggle.jsx
import React from 'react';
import { Rows, LayoutGrid } from 'lucide-react';

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 backdrop-blur-lg shadow-sm p-1">
        <button
          type="button"
          aria-pressed={value === 'card'}
          onClick={() => onChange('card')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            value === 'card' ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid size={16} />
          <span>Karty</span>
        </button>
        <button
          type="button"
          aria-pressed={value === 'table'}
          onClick={() => onChange('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            value === 'table' ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Rows size={16} />
          <span>Tabela</span>
        </button>
      </div>
    </div>
  );
}

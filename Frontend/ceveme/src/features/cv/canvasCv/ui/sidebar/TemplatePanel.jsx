import React from 'react';

export default function TemplatesPanel({ setDocument, data, func, title }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 pb-2">
        <button
          onClick={() => {
            const doc = func(data);
            setDocument(doc);
          }}
          className="p-3 border border-black/10 rounded-lg text-left bg-white hover:bg-slate-50"
        >
          <div className="font-bold">{title}</div>
          <div className="text-xs text-slate-500">Zastosuj</div>
        </button>
      </div>
    </div>
  );
}

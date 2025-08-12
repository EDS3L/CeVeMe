import React from 'react';

export default function Suggestions({ items = [], onPick }) {
  if (!items.length) return null;
  return (
    <div className="absolute mt-2 w-full rounded-xl border border-basewhite/50 bg-ivorylight shadow-xl overflow-hidden z-50">
      <ul className="max-h-72 overflow-auto divide-y divide-basewhite/40">
        {items.map((it, i) => (
          <li
            key={`${it.type}-${it.label}-${i}`}
            className="px-4 py-2 hover:bg-ivorymedium cursor-pointer flex items-center justify-between"
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(it);
            }}
          >
            <span className="text-slatedark">
              {it.type === 'city' ? 'Miasto:' : 'Technologia:'}{' '}
              <strong>{it.label}</strong>
            </span>
            <span className="text-clouddark text-sm">{it.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

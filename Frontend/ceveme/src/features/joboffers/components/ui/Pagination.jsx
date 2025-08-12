import React from 'react';

function rangeWithEllipsis(current, total, delta = 1) {
  const range = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return Array.from(new Set(range));
}

export default function Pagination({ current, total, onChange }) {
  const pages = rangeWithEllipsis(current, total, 2);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        className="px-3 py-2 rounded-lg bg-ivorymedium border border-cloudlight text-slatedark disabled:opacity-50"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        Poprzednia
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className="px-2 text-clouddark">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-2 rounded-lg border ${
              p === current
                ? 'text-basewhite bg-gradient-to-r from-bookcloth to-kraft border-transparent'
                : 'bg-ivorymedium border-cloudlight text-slatedark hover:bg-ivorylight'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        className="px-3 py-2 rounded-lg bg-ivorymedium border border-cloudlight text-slatedark disabled:opacity-50"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >
        Następna
      </button>
    </nav>
  );
}

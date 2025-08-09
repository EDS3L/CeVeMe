import React from 'react';

/**
 * FieldChip
 * - absolutnie pozycjonowany „chip”
 * - animuje transform: translate(...) z pozycji źródłowej do docelowej
 */
export default function FieldChip({
  label,
  from = { x: 0, y: 0, w: 140, h: 36 },
  to = { x: 0, y: 0 },
  go = false,
  delay = 0,
}) {
  const tx = go ? to.x - from.x : 0;
  const ty = go ? to.y - from.y : 0;

  return (
    <div
      className="absolute rounded-md border border-[rgba(0,0,0,0.06)] shadow
                 bg-[var(--color-basewhite)] text-[var(--color-slatedark)]
                 px-3 h-9 flex items-center select-none"
      style={{
        left: from.x,
        top: from.y,
        width: from.w,
        transform: `translate(${tx}px, ${ty}px)`,
        transition: `transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 300ms ease`,
        opacity: 1,
      }}
    >
      <span className="text-sm font-medium truncate">{label}</span>
    </div>
  );
}

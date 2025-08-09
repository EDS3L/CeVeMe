import React from 'react';

export default function DropChip({
  label,
  to = { x: 0, y: 0, w: 160, h: 40 },
  go = false,
  delay = 0,
  duration = 900, // czas spadania + bounce
  stay = 250, // ile chip „leży” zanim zniknie
  wide = false,
}) {
  const style = {
    left: to.x,
    top: to.y,
    width: wide ? Math.max(to.w, 240) : Math.max(to.w, 180),
    '--dy': '96px', // start nad miejscem docelowym
    '--shadow': '0 14px 28px rgba(0,0,0,0.12)',
    '--shadow-sm': '0 6px 16px rgba(0,0,0,0.08)',
    animation: go
      ? `dropIn ${duration}ms ${delay}ms cubic-bezier(.2,.9,.2,1) forwards,
         chipHold ${stay}ms ${delay + duration}ms linear forwards,
         chipOut 320ms ${delay + duration + stay}ms ease forwards`
      : 'none',
  };

  return (
    <div
      className="absolute z-10 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[var(--color-basewhite)]
                 text-[var(--color-slatedark)] shadow-md px-4 h-10 lg:h-11 flex items-center
                 text-sm lg:text-base font-semibold select-none"
      style={style}
    >
      <span className="truncate">{label}</span>

      <style>{`
        @keyframes dropIn {
          0%   { transform: translateY(calc(-1 * var(--dy))) scale(0.98); opacity: 0; box-shadow: var(--shadow-sm); filter: blur(1px); }
          60%  { transform: translateY(6px) scale(1.02);  opacity: 1; box-shadow: var(--shadow); }
          82%  { transform: translateY(-3px) scale(0.999); }
          100% { transform: translateY(0) scale(1);       opacity: 1; box-shadow: var(--shadow-sm); filter: blur(0); }
        }
        @keyframes chipHold { from { opacity: 1 } to { opacity: 1 } }
        @keyframes chipOut { from { opacity: 1 } to { opacity: 0 } }
      `}</style>
    </div>
  );
}

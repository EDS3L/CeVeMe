import React from 'react';

export default function FieldChip({
  label,
  from = { x: 0, y: 0, w: 140, h: 36 },
  to = { x: 0, y: 0 },
  go = false,
  delay = 0,
  duration = 900,
  mode = 'fall', // 'fall' = spadanie z odbiciem; 'linear' = zwykły lot
}) {
  const tx = to.x - from.x;
  const ty = to.y - from.y;

  const commonStyle = {
    left: from.x,
    top: from.y,
    width: from.w,
  };

  const motionStyle =
    mode === 'fall'
      ? {
          // animacja przez keyframes, z użyciem CSS variables
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          animation: go
            ? `chip-fall ${duration}ms ${delay}ms forwards`
            : 'none',
          opacity: go ? 1 : 0,
        }
      : {
          transform: `translate(${go ? tx : 0}px, ${go ? ty : 0}px)`,
          transition: `transform ${duration}ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 300ms ease`,
          opacity: go ? 1 : 0,
        };

  return (
    <div
      className="absolute rounded-md border border-[rgba(0,0,0,0.06)] shadow
                 bg-[var(--color-basewhite)] text-[var(--color-slatedark)]
                 px-3 h-9 flex items-center select-none"
      style={{ ...commonStyle, ...motionStyle }}
    >
      <span className="text-sm font-medium truncate">{label}</span>

      {/* Keyframes dla efektu spadania z lekkim odbiciem */}
      <style>{`
        @keyframes chip-fall {
          0%   { transform: translate(0, -18px); opacity: 0; }
          25%  { transform: translate(calc(var(--tx) * .35), -6px); opacity: 1; }
          60%  { transform: translate(calc(var(--tx) * .9), calc(var(--ty) + 12px)); }
          82%  { transform: translate(var(--tx), calc(var(--ty) - 6px)); }
          100% { transform: translate(var(--tx), var(--ty)); }
        }
      `}</style>
    </div>
  );
}

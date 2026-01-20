import React from "react";

export default function DropChip({
  label,
  to = { x: 0, y: 0, w: 160, h: 40 },
  go = false,
  delay = 0,
  duration = 1200,
  stay = 400,
  wide = false,
}) {
  const chipWidth = wide ? Math.max(to.w, 260) : Math.max(to.w, 200);

  const style = {
    left: to.x,
    top: to.y,
    width: chipWidth,
    "--dy": "140px",
    "--shadow": "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
    "--shadow-sm": "0 8px 20px rgba(0,0,0,0.06)",
    "--glow": "0 0 40px rgba(166, 124, 82, 0.25)",
    animation: go
      ? `dropIn ${duration}ms ${delay}ms cubic-bezier(.16,1,.3,1) forwards, chipGlow ${duration * 0.5}ms ${delay + duration * 0.4}ms ease-out forwards, chipHold ${stay}ms ${delay + duration}ms linear forwards, chipOut 600ms ${delay + duration + stay}ms ease-out forwards`
      : "none",
  };

  return (
    <div
      className="absolute z-10 rounded-xl border-2 border-[rgba(166,124,82,0.3)] bg-gradient-to-br from-white via-[var(--color-ivorylight)] to-white text-[var(--color-slatedark)] shadow-xl px-5 h-12 lg:h-14 flex items-center gap-3 text-base lg:text-lg font-bold select-none backdrop-blur-sm"
      style={style}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-bookcloth)] animate-pulse shadow-md"></span>
      <span className="truncate">{label}</span>

      <style>{`
        @keyframes dropIn {
          0%   { transform: translateY(calc(-1 * var(--dy))) scale(0.85) rotate(-3deg); opacity: 0; box-shadow: var(--shadow-sm); filter: blur(3px); }
          35%  { transform: translateY(12px) scale(1.04) rotate(1deg); opacity: 1; box-shadow: var(--shadow); filter: blur(0); }
          55%  { transform: translateY(-6px) scale(0.98) rotate(-0.5deg); }
          75%  { transform: translateY(3px) scale(1.01) rotate(0.2deg); }
          90%  { transform: translateY(-1px) scale(1); }
          100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; box-shadow: var(--shadow-sm); }
        }
        @keyframes chipGlow {
          0%   { box-shadow: var(--shadow-sm); }
          40%  { box-shadow: var(--shadow), var(--glow); }
          100% { box-shadow: var(--shadow-sm); }
        }
        @keyframes chipHold { from { opacity: 1 } to { opacity: 1 } }
        @keyframes chipOut { 
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.92) translateY(-12px); filter: blur(2px); }
        }
      `}</style>
    </div>
  );
}

// ui/canva/Handles.tsx / .jsx
import React from 'react';
const dots = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export default function Handles({ framePx, onStartResize, rotation = 0 }) {
  const { x, y, w, h } = framePx;
  const cx = x + w / 2,
    cy = y + h / 2;
  const pos = {
    n: { left: cx, top: y },
    s: { left: cx, top: y + h },
    e: { left: x + w, top: cy },
    w: { left: x, top: cy },
    nw: { left: x, top: y },
    ne: { left: x + w, top: y },
    sw: { left: x, top: y + h },
    se: { left: x + w, top: y + h },
  };

  // widoczne kółko 8×8, ale „hit area” 16×16 — wygodny chwyt, subtelny wygląd
  return (
    <>
      {dots.map((k) => (
        <div
          key={k}
          onMouseDown={(e) => onStartResize(e, k)}
          className="absolute"
          style={{
            left: pos[k].left - 8,
            top: pos[k].top - 8,
            width: 16,
            height: 16,
            cursor: `${k}-resize`,
          }}
        >
          <div
            className="absolute rounded-full bg-white"
            style={{
              left: 4,
              top: 4,
              width: 8,
              height: 8,
              boxShadow: '0 0 0 1.5px rgba(59,130,246,0.9)',
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>
      ))}
    </>
  );
}

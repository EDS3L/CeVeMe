import React from 'react';

const dots = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export default function Handles({ framePx, onStartResize, rotation = 0 }) {
  const { x, y, w, h } = framePx;
  const centerX = x + w / 2,
    centerY = y + h / 2;
  const pos = {
    n: { left: centerX, top: y },
    s: { left: centerX, top: y + h },
    e: { left: x + w, top: centerY },
    w: { left: x, top: centerY },
    nw: { left: x, top: y },
    ne: { left: x + w, top: y },
    sw: { left: x, top: y + h },
    se: { left: x + w, top: y + h },
  };
  return (
    <>
      {dots.map((k) => (
        <div
          key={k}
          onMouseDown={(e) => onStartResize(e, k)}
          className="absolute bg-white border-2 border-blue-600 rounded shadow-sm"
          style={{
            left: pos[k].left - 5,
            top: pos[k].top - 5,
            width: 10,
            height: 10,
            cursor: `${k}-resize`,
            transform: `rotate(${rotation}deg)`,
          }}
        />
      ))}
    </>
  );
}

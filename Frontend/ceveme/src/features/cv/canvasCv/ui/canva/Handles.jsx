import React from 'react';

const dots = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const cursorMap = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
};

export default function Handles({
  framePx,
  onStartResize,
  rotation = 0,
  zIndex = 1100,
}) {
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

  const HIT = 18;
  const DOT = 6;
  const OFFSET = HIT / 2;

  return (
    <>
      {dots.map((k) => (
        <div
          key={k}
          onMouseDown={(e) => onStartResize(e, k)}
          className="absolute"
          style={{
            left: pos[k].left - OFFSET,
            top: pos[k].top - OFFSET,
            width: HIT,
            height: HIT,
            cursor: cursorMap[k] || 'move',
            zIndex,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              left: (HIT - DOT) / 2,
              top: (HIT - DOT) / 2,
              width: DOT,
              height: DOT,
              background: '#e5e7eb',
              boxShadow: '0 0 0 1.25px rgba(100,116,139,0.95)',
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>
      ))}
    </>
  );
}

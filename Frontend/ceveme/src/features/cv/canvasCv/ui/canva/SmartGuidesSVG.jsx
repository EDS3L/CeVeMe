import React from 'react';

/** mm→px */
const mm = (v, p) => v * p;

/** Estetyczne, ostre linie pomocnicze jako SVG (lepsze niż <div>) */
export default function SmartGuidesSVG({
  guides,
  pxPerMm,
  pageWidthMm,
  pageHeightMm,
}) {
  if (!guides || guides.length === 0) return null;

  const W = mm(pageWidthMm, pxPerMm);
  const H = mm(pageHeightMm, pxPerMm);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ zIndex: 1000 }}
    >
      {/* defs – gradient glow i strzałki */}
      <defs>
        <filter id="guideGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="arrowTip"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <rect
            x="0"
            y="0"
            width="6"
            height="6"
            transform="rotate(45 3 3)"
            fill="rgba(168,85,247,0.95)"
          />
        </marker>
      </defs>

      {/* Linie wyrównania */}
      {guides
        .filter((g) => g.type === 'line')
        .map((g, i) => {
          const isV = g.orientation === 'vertical';
          const x = isV ? mm(g.position, pxPerMm) : 0;
          const y = !isV ? mm(g.position, pxPerMm) : 0;
          return (
            <g key={`line-${i}`} filter="url(#guideGlow)">
              <line
                x1={isV ? x : 0}
                y1={isV ? 0 : y}
                x2={isV ? x : W}
                y2={isV ? H : y}
                stroke="rgba(59,130,246,0.95)"
                strokeWidth="1.25"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </g>
          );
        })}

      {/* Odstępy */}
      {guides
        .filter((g) => g.type === 'spacing')
        .map((g, i) => {
          const isV = g.orientation === 'vertical';
          const p = mm(g.position, pxPerMm);
          const s = Math.min(mm(g.start, pxPerMm), mm(g.end, pxPerMm));
          const e = Math.max(mm(g.start, pxPerMm), mm(g.end, pxPerMm));
          const mid = (s + e) / 2;

          const x1 = isV ? p : s;
          const y1 = isV ? s : p;
          const x2 = isV ? p : e;
          const y2 = isV ? e : p;

          return (
            <g key={`space-${i}`} filter="url(#guideGlow)">
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(168,85,247,0.95)"
                strokeWidth="1.25"
                markerStart="url(#arrowTip)"
                markerEnd="url(#arrowTip)"
              />
              <rect
                x={isV ? p + 8 : mid - 18}
                y={isV ? mid - 9 : p + 8}
                width="36"
                height="18"
                rx="6"
                ry="6"
                fill="rgba(168,85,247,0.95)"
              />
              <text
                x={isV ? p + 26 : mid}
                y={isV ? mid + 5 : p + 20}
                textAnchor={isV ? 'middle' : 'middle'}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
                fontSize="12"
                fill="#fff"
              >
                {g.distance?.toFixed?.(1)}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

import React, { useMemo } from 'react';

/** mm → px */
const mm = (v, p) => v * p;

function bboxOf(frames) {
  if (!frames.length) return null;
  const xs = frames.map((f) => f.x);
  const ys = frames.map((f) => f.y);
  const xe = frames.map((f) => f.x + f.w);
  const ye = frames.map((f) => f.y + f.h);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(...xe) - x;
  const h = Math.max(...ye) - y;
  return { x, y, w, h };
}

/**
 * Minimalny zestaw prowadnic “jak w Canvie” (bez green center-to-center):
 * - 1x pion i 1x poziom (wyrównanie do krawędzi/środka), jeśli w zasięgu snap
 * - 4x spacing (krawędź–krawędź) do najbliższego sąsiada: lewo/prawo/góra/dół
 */
function computeSmartGuides({
  nodes = [],
  selectedIds = [],
  movingFrame = null,
  pageWidthMm,
  pageHeightMm,
  snapThresholdMm = 0.8,
  minOverlapRatio = 0.2,
}) {
  if (!nodes.length || (!selectedIds.length && !movingFrame)) return [];

  // 1) Referencja: podgląd drag/resize → bbox grupy → pojedynczy
  let ref;
  if (movingFrame) {
    ref = movingFrame;
  } else if (selectedIds.length >= 2) {
    const frames = nodes
      .filter((n) => selectedIds.includes(n.id))
      .map((n) => n.frame);
    ref = bboxOf(frames);
  } else {
    const n = nodes.find((n) => n.id === selectedIds[0]);
    ref = n?.frame || null;
  }
  if (!ref) return [];

  const others = nodes.filter((n) => !selectedIds.includes(n.id));

  const refL = ref.x;
  const refR = ref.x + ref.w;
  const refT = ref.y;
  const refB = ref.y + ref.h;
  const refCX = ref.x + ref.w / 2;
  const refCY = ref.y + ref.h / 2;

  const overlap = (a1, a2, b1, b2) =>
    Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
  const overlapV = (o) => overlap(refT, refB, o.y, o.y + o.h);
  const overlapH = (o) => overlap(refL, refR, o.x, o.x + o.w);

  const hasEnoughV = (o) =>
    overlapV(o) >= minOverlapRatio * Math.min(ref.h, o.h);
  const hasEnoughH = (o) =>
    overlapH(o) >= minOverlapRatio * Math.min(ref.w, o.w);

  // 2) Najbliżsi sąsiedzi krawędziowi (L/R/T/B)
  let bestLeft = null,
    bestRight = null,
    bestTop = null,
    bestBottom = null;

  // 3) Wyrównanie (max 1 pion/poziom)
  let bestV = null,
    bestH = null;

  const considerAlign = (diff, kind, pos) => {
    if (Math.abs(diff) > snapThresholdMm) return null;
    return { kind, pos, diff: Math.abs(diff) };
  };

  for (const o of others) {
    const f = o.frame;
    const oL = f.x,
      oR = f.x + f.w,
      oCX = f.x + f.w / 2;
    const oT = f.y,
      oB = f.y + f.h,
      oCY = f.y + f.h / 2;

    // ——— Spacing: lewo/prawo (wystarczający overlap w pionie)
    if (hasEnoughV(f) && oR <= refL) {
      const gap = refL - oR;
      if (!bestLeft || gap < bestLeft.gap) {
        const yFrom = Math.max(refT, oT);
        const yTo = Math.min(refB, oB);
        bestLeft = {
          orientation: 'horizontal',
          gap,
          start: oR,
          end: refL,
          position: (yFrom + yTo) / 2,
        };
      }
    }
    if (hasEnoughV(f) && oL >= refR) {
      const gap = oL - refR;
      if (!bestRight || gap < bestRight.gap) {
        const yFrom = Math.max(refT, oT);
        const yTo = Math.min(refB, oB);
        bestRight = {
          orientation: 'horizontal',
          gap,
          start: refR,
          end: oL,
          position: (yFrom + yTo) / 2,
        };
      }
    }

    // ——— Spacing: góra/dół (wystarczający overlap w poziomie)
    if (hasEnoughH(f) && oB <= refT) {
      const gap = refT - oB;
      if (!bestTop || gap < bestTop.gap) {
        const xFrom = Math.max(refL, oL);
        const xTo = Math.min(refR, oR);
        bestTop = {
          orientation: 'vertical',
          gap,
          start: oB,
          end: refT,
          position: (xFrom + xTo) / 2,
        };
      }
    }
    if (hasEnoughH(f) && oT >= refB) {
      const gap = oT - refB;
      if (!bestBottom || gap < bestBottom.gap) {
        const xFrom = Math.max(refL, oL);
        const xTo = Math.min(refR, oR);
        bestBottom = {
          orientation: 'vertical',
          gap,
          start: refB,
          end: oT,
          position: (xFrom + xTo) / 2,
        };
      }
    }

    // ——— Wyrównanie (snap)
    const candV = [
      considerAlign(refL - oL, 'left', oL),
      considerAlign(refR - oR, 'right', oR),
      considerAlign(refCX - oCX, 'v-center', oCX),
    ].filter(Boolean);
    for (const c of candV) if (!bestV || c.diff < bestV.diff) bestV = c;

    const candH = [
      considerAlign(refT - oT, 'top', oT),
      considerAlign(refB - oB, 'bottom', oB),
      considerAlign(refCY - oCY, 'h-center', oCY),
    ].filter(Boolean);
    for (const c of candH) if (!bestH || c.diff < bestH.diff) bestH = c;
  }

  const guides = [];

  // Spacingi krawędziowe
  if (bestLeft)
    guides.push({
      type: 'spacing',
      orientation:
        'vertical' === bestLeft.orientation ? 'vertical' : 'horizontal',
      position: bestLeft.position,
      start: bestLeft.start,
      end: bestLeft.end,
      distance: bestLeft.gap,
    });
  if (bestRight)
    guides.push({
      type: 'spacing',
      orientation:
        'vertical' === bestRight.orientation ? 'vertical' : 'horizontal',
      position: bestRight.position,
      start: bestRight.start,
      end: bestRight.end,
      distance: bestRight.gap,
    });
  if (bestTop)
    guides.push({
      type: 'spacing',
      orientation: 'vertical',
      position: bestTop.position,
      start: bestTop.start,
      end: bestTop.end,
      distance: bestTop.gap,
    });
  if (bestBottom)
    guides.push({
      type: 'spacing',
      orientation: 'vertical',
      position: bestBottom.position,
      start: bestBottom.start,
      end: bestBottom.end,
      distance: bestBottom.gap,
    });

  // Wyrównanie (po 1 linii)
  if (bestV) {
    guides.push({
      type: 'line',
      orientation: 'vertical',
      position: Math.max(0, Math.min(pageWidthMm, bestV.pos)),
    });
  }
  if (bestH) {
    guides.push({
      type: 'line',
      orientation: 'horizontal',
      position: Math.max(0, Math.min(pageHeightMm, bestH.pos)),
    });
  }

  return guides;
}

/**
 * SmartGuidesSVG (bez zielonych center-to-center):
 * - Jeśli przekażesz `guides`, tylko narysuje (legacy).
 * - Jeśli przekażesz `nodes` + `selectedIds` (+ `movingFrame`), policzy i narysuje (smart).
 */
export default function SmartGuidesSVG({
  // RENDER
  pxPerMm,
  pageWidthMm,
  pageHeightMm,
  yMapMm = (y) => y,

  // LEGACY
  guides = null,

  // SMART
  nodes = null,
  selectedIds = [],
  movingFrame = null,
  snapThresholdMm = 0.8,
  minOverlapRatio = 0.2,
}) {
  const computed = useMemo(() => {
    if (guides && guides.length) return guides;
    if (!nodes || !selectedIds?.length) return [];
    return computeSmartGuides({
      nodes,
      selectedIds,
      movingFrame,
      pageWidthMm,
      pageHeightMm,
      snapThresholdMm,
      minOverlapRatio,
    });
  }, [
    guides,
    nodes,
    selectedIds,
    movingFrame,
    pageWidthMm,
    pageHeightMm,
    snapThresholdMm,
    minOverlapRatio,
  ]);

  if (!computed || computed.length === 0) return null;

  const W = mm(pageWidthMm, pxPerMm);
  const H = mm(pageHeightMm, pxPerMm);
  const xPx = (valMm) => mm(valMm, pxPerMm);
  const yPx = (valMm) => mm(yMapMm(valMm), pxPerMm);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ zIndex: 1000 }}
    >
      <defs>
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
            fill="rgba(147,51,234,0.95)"
          />
        </marker>
      </defs>

      {/* ALIGN LINES */}
      {computed
        .filter((g) => g.type === 'line')
        .map((g, i) => {
          const isV = g.orientation === 'vertical';
          const x = isV ? xPx(g.position) : 0;
          const y = !isV ? yPx(g.position) : 0;
          return (
            <line
              key={`align-${i}`}
              x1={isV ? x : 0}
              y1={isV ? 0 : y}
              x2={isV ? x : W}
              y2={isV ? H : y}
              stroke="rgba(59,130,246,0.95)"
              strokeWidth="1"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          );
        })}

      {/* EDGE SPACING (L/R/T/B) */}
      {computed
        .filter((g) => g.type === 'spacing')
        .map((g, i) => {
          const isV = g.orientation === 'vertical';
          if (isV) {
            const x = xPx(g.position);
            const y1 = yPx(Math.min(g.start, g.end));
            const y2 = yPx(Math.max(g.start, g.end));
            const mid = (y1 + y2) / 2;
            return (
              <g key={`spv-${i}`}>
                <line
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={y2}
                  stroke="rgba(147,51,234,0.95)"
                  strokeWidth="1"
                  markerStart="url(#arrowTip)"
                  markerEnd="url(#arrowTip)"
                />
                <rect
                  x={x + 7}
                  y={mid - 9}
                  width="36"
                  height="18"
                  rx="6"
                  ry="6"
                  fill="rgba(147,51,234,0.95)"
                />
                <text
                  x={x + 7 + 18}
                  y={mid + 4.5}
                  textAnchor="middle"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
                  fontSize="11"
                  fill="#fff"
                >
                  {g.distance?.toFixed?.(1)}
                </text>
              </g>
            );
          } else {
            const y = yPx(g.position);
            const x1 = xPx(Math.min(g.start, g.end));
            const x2 = xPx(Math.max(g.start, g.end));
            const mid = (x1 + x2) / 2;
            return (
              <g key={`sph-${i}`}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="rgba(147,51,234,0.95)"
                  strokeWidth="1"
                  markerStart="url(#arrowTip)"
                  markerEnd="url(#arrowTip)"
                />
                <rect
                  x={mid - 18}
                  y={y + 7}
                  width="36"
                  height="18"
                  rx="6"
                  ry="6"
                  fill="rgba(147,51,234,0.95)"
                />
                <text
                  x={mid}
                  y={y + 19}
                  textAnchor="middle"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
                  fontSize="11"
                  fill="#fff"
                >
                  {g.distance?.toFixed?.(1)}
                </text>
              </g>
            );
          }
        })}
    </svg>
  );
}

// hooks/useSmartGuides.js
import { useMemo } from 'react';

export const SNAP_THRESHOLD_MM = 2;
export const SPACING_TOLERANCE_MM = 1;
export const CORNER_THRESHOLD_MM = 2;
export const MAX_RENDERED_GUIDES_PER_AXIS = 2;

function deg2rad(d) {
  return (d * Math.PI) / 180;
}

function getAlignmentPoints(node) {
  const { x, y, w, h } = node.frame;
  return {
    left: x,
    right: x + w,
    top: y,
    bottom: y + h,
    centerX: x + w / 2,
    centerY: y + h / 2,
  };
}

function getCornerPoints(node) {
  const { x, y, w, h, rotation = 0 } = node.frame;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rad = deg2rad(rotation);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const corners = [
    ['topLeft', { x: -w / 2, y: -h / 2 }],
    ['topRight', { x:  w / 2, y: -h / 2 }],
    ['bottomRight', { x:  w / 2, y:  h / 2 }],
    ['bottomLeft', { x: -w / 2, y:  h / 2 }],
  ];
  const out = {};
  for (const [k, p] of corners) {
    const rx = p.x * cos - p.y * sin + cx;
    const ry = p.x * sin + p.y * cos + cy;
    out[k] = { x: rx, y: ry };
  }
  return out;
}

function findClosestAlignment(draggedPoints, targetPoints, threshold) {
  const out = [];

  // pion (X)
  for (const [dk, dv] of Object.entries(draggedPoints)) {
    if (!['left', 'right', 'centerX'].includes(dk)) continue;
    for (const [tk, tv] of Object.entries(targetPoints)) {
      if (!['left', 'right', 'centerX'].includes(tk)) continue;
      const d = Math.abs(dv - tv);
      if (d <= threshold) {
        out.push({
          type: 'line',
          orientation: 'vertical',
          position: tv,
          distance: d,
          dragKey: dk,
          targetKey: tk,
          snapOffset: tv - dv,
        });
      }
    }
  }

  // poziom (Y)
  for (const [dk, dv] of Object.entries(draggedPoints)) {
    if (!['top', 'bottom', 'centerY'].includes(dk)) continue;
    for (const [tk, tv] of Object.entries(targetPoints)) {
      if (!['top', 'bottom', 'centerY'].includes(tk)) continue;
      const d = Math.abs(dv - tv);
      if (d <= threshold) {
        out.push({
          type: 'line',
          orientation: 'horizontal',
          position: tv,
          distance: d,
          dragKey: dk,
          targetKey: tk,
          snapOffset: tv - dv,
        });
      }
    }
  }

  return out;
}

/**
 * POPRAWIONE: równe odstępy + zgodne współrzędne dla SmartGuidesSVG.
 * - oś X: orientation 'horizontal', start/end = X, position = Y(środek wspólnego odcinka)
 * - oś Y: orientation 'vertical',   start/end = Y, position = X(środek wspólnego odcinka)
 */
function findEqualSpacing(draggedNode, otherNodes, threshold) {
  const res = [];
  const d = draggedNode.frame;
  const c = { x: d.x + d.w / 2, y: d.y + d.h / 2 };
  const byX = [...otherNodes].sort((a, b) => a.frame.x - b.frame.x);
  const byY = [...otherNodes].sort((a, b) => a.frame.y - b.frame.y);

  // pomocnicze
  const overlap = (a1, a2, b1, b2) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));

  // OŚ X
  for (let i = 0; i < byX.length - 1; i++) {
    const A = byX[i], B = byX[i + 1];
    const Dy1 = d.y, Dy2 = d.y + d.h;
    const Ay1 = A.frame.y, Ay2 = A.frame.y + A.frame.h;
    const By1 = B.frame.y, By2 = B.frame.y + B.frame.h;

    if (c.x > A.frame.x + A.frame.w && c.x < B.frame.x) {
      const gapAD = d.x - (A.frame.x + A.frame.w);
      const gapDB = B.frame.x - (d.x + d.w);
      if (Math.abs(gapAD - gapDB) <= threshold) {
        const yFrom = Math.max(Dy1, Math.max(Ay1, By1));
        const yTo   = Math.min(Dy2, Math.min(Ay2, By2));
        const yPos  = (yFrom + yTo) / 2;
        const avg   = (gapAD + gapDB) / 2;

        res.push(
          {
            type: 'spacing',
            orientation: 'horizontal',
            start: A.frame.x + A.frame.w,
            end:   d.x,
            position: yPos,
            distance: avg,
            snapOffset: 0,
          },
          {
            type: 'spacing',
            orientation: 'horizontal',
            start: d.x + d.w,
            end:   B.frame.x,
            position: yPos,
            distance: avg,
            snapOffset: 0,
          }
        );
      }
    }

    // wariant „przed A”
    const gapAB = B.frame.x - (A.frame.x + A.frame.w);
    const gapToDragged = Math.abs(gapAB - (d.x - (A.frame.x + A.frame.w)));
    if (gapToDragged <= threshold && c.x < A.frame.x) {
      const yFrom = Math.max(Dy1, Ay1);
      const yTo   = Math.min(Dy2, Ay2);
      const yPos  = (yFrom + yTo) / 2;

      res.push({
        type: 'spacing',
        orientation: 'horizontal',
        start: d.x + d.w,
        end:   A.frame.x,
        position: yPos,
        distance: gapAB,
        snapOffset: 0,
      });
    }
  }

  // OŚ Y
  for (let i = 0; i < byY.length - 1; i++) {
    const A = byY[i], B = byY[i + 1];
    const Dx1 = d.x, Dx2 = d.x + d.w;
    const Ax1 = A.frame.x, Ax2 = A.frame.x + A.frame.w;
    const Bx1 = B.frame.x, Bx2 = B.frame.x + B.frame.w;

    if (c.y > A.frame.y + A.frame.h && c.y < B.frame.y) {
      const gapAD = d.y - (A.frame.y + A.frame.h);
      const gapDB = B.frame.y - (d.y + d.h);
      if (Math.abs(gapAD - gapDB) <= threshold) {
        const xFrom = Math.max(Dx1, Math.max(Ax1, Bx1));
        const xTo   = Math.min(Dx2, Math.min(Ax2, Bx2));
        const xPos  = (xFrom + xTo) / 2;
        const avg   = (gapAD + gapDB) / 2;

        res.push(
          {
            type: 'spacing',
            orientation: 'vertical',
            start: A.frame.y + A.frame.h,
            end:   d.y,
            position: xPos,
            distance: avg,
            snapOffset: 0,
          },
          {
            type: 'spacing',
            orientation: 'vertical',
            start: d.y + d.h,
            end:   B.frame.y,
            position: xPos,
            distance: avg,
            snapOffset: 0,
          }
        );
      }
    }

    // wariant „nad A”
    const gapAB = B.frame.y - (A.frame.y + A.frame.h);
    const gapToDraggedY = Math.abs(gapAB - (d.y - (A.frame.y + A.frame.h)));
    if (gapToDraggedY <= threshold && c.y < A.frame.y) {
      const xFrom = Math.max(Dx1, Ax1);
      const xTo   = Math.min(Dx2, Ax2);
      const xPos  = (xFrom + xTo) / 2;

      res.push({
        type: 'spacing',
        orientation: 'vertical',
        start: d.y + d.h,
        end:   A.frame.y,
        position: xPos,
        distance: gapAB,
        snapOffset: 0,
      });
    }
  }

  return res;
}

/**
 * Najbliższe krawędzie L/R/T/B – po 1 miarce na stronę (przy sensownym overlap).
 */
function findNearestEdgeSpacing(draggedNode, otherNodes, minOverlapRatio = 0.2) {
  const res = [];
  const d = draggedNode.frame;

  const refL = d.x, refR = d.x + d.w, refT = d.y, refB = d.y + d.h;

  const overlap = (a1, a2, b1, b2) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
  const enoughV = (o) => overlap(refT, refB, o.y, o.y + o.h) >= minOverlapRatio * Math.min(d.h, o.h);
  const enoughH = (o) => overlap(refL, refR, o.x, o.x + o.w) >= minOverlapRatio * Math.min(d.w, o.w);

  let bestLeft = null, bestRight = null, bestTop = null, bestBottom = null;

  for (const n of otherNodes) {
    const f = n.frame;

    // lewo
    if (f.x + f.w <= refL && enoughV(f)) {
      const gap = refL - (f.x + f.w);
      if (!bestLeft || gap < bestLeft.gap) {
        const y1 = Math.max(refT, f.y);
        const y2 = Math.min(refB, f.y + f.h);
        bestLeft = { gap, start: f.x + f.w, end: refL, posY: (y1 + y2) / 2 };
      }
    }

    // prawo
    if (f.x >= refR && enoughV(f)) {
      const gap = f.x - refR;
      if (!bestRight || gap < bestRight.gap) {
        const y1 = Math.max(refT, f.y);
        const y2 = Math.min(refB, f.y + f.h);
        bestRight = { gap, start: refR, end: f.x, posY: (y1 + y2) / 2 };
      }
    }

    // góra
    if (f.y + f.h <= refT && enoughH(f)) {
      const gap = refT - (f.y + f.h);
      if (!bestTop || gap < bestTop.gap) {
        const x1 = Math.max(refL, f.x);
        const x2 = Math.min(refR, f.x + f.w);
        bestTop = { gap, start: f.y + f.h, end: refT, posX: (x1 + x2) / 2 };
      }
    }

    // dół
    if (f.y >= refB && enoughH(f)) {
      const gap = f.y - refB;
      if (!bestBottom || gap < bestBottom.gap) {
        const x1 = Math.max(refL, f.x);
        const x2 = Math.min(refR, f.x + f.w);
        bestBottom = { gap, start: refB, end: f.y, posX: (x1 + x2) / 2 };
      }
    }
  }

  if (bestLeft) res.push({
    type: 'spacing',
    orientation: 'horizontal',
    start: bestLeft.start,
    end:   bestLeft.end,
    position: bestLeft.posY,
    distance: bestLeft.gap,
    snapOffset: 0,
  });
  if (bestRight) res.push({
    type: 'spacing',
    orientation: 'horizontal',
    start: bestRight.start,
    end:   bestRight.end,
    position: bestRight.posY,
    distance: bestRight.gap,
    snapOffset: 0,
  });
  if (bestTop) res.push({
    type: 'spacing',
    orientation: 'vertical',
    start: bestTop.start,
    end:   bestTop.end,
    position: bestTop.posX,
    distance: bestTop.gap,
    snapOffset: 0,
  });
  if (bestBottom) res.push({
    type: 'spacing',
    orientation: 'vertical',
    start: bestBottom.start,
    end:   bestBottom.end,
    position: bestBottom.posX,
    distance: bestBottom.gap,
    snapOffset: 0,
  });

  return res;
}

function findCornerSnap(draggedNode, otherNodes, threshold) {
  const dC = getCornerPoints(draggedNode);
  let best = null;

  for (const n of otherNodes) {
    const tC = getCornerPoints(n);
    for (const [dk, dv] of Object.entries(dC)) {
      for (const [tk, tv] of Object.entries(tC)) {
        const dx = tv.x - dv.x;
        const dy = tv.y - dv.y;
        if (Math.abs(dx) <= threshold && Math.abs(dy) <= threshold) {
          const dist = Math.hypot(dx, dy);
          if (!best || dist < best.distance) {
            best = {
              type: 'corner',
              position: { x: tv.x, y: tv.y },
              distance: dist,
              dragKey: dk,
              targetKey: tk,
              snapOffset: { x: dx, y: dy },
            };
          }
        }
      }
    }
  }
  return best;
}

export function computeSmartGuides(draggedNode, allNodes, pageSize) {
  if (!draggedNode) return { guides: [], snapOffset: { x: 0, y: 0 } };

  const others = allNodes.filter(
    (n) => n.id !== draggedNode.id && n.visible !== false && !n.lock
  );
  if (others.length === 0) return { guides: [], snapOffset: { x: 0, y: 0 } };

  const draggedPoints = getAlignmentPoints(draggedNode);

  // cele: inne węzły + wirtualne krawędzie/środek strony
  const targets = others.map(getAlignmentPoints);
  if (pageSize?.pageWidthMm && pageSize?.pageHeightMm) {
    targets.push({
      left: 0,
      right: pageSize.pageWidthMm,
      centerX: pageSize.pageWidthMm / 2,
      top: 0,
      bottom: pageSize.pageHeightMm,
      centerY: pageSize.pageHeightMm / 2,
    });
  }

  let allLines = [];
  for (const t of targets) {
    allLines.push(...findClosestAlignment(draggedPoints, t, SNAP_THRESHOLD_MM));
  }

  const V = allLines
    .filter((g) => g.orientation === 'vertical')
    .sort((a, b) => a.distance - b.distance);
  const H = allLines
    .filter((g) => g.orientation === 'horizontal')
    .sort((a, b) => a.distance - b.distance);

  const bestV = V[0];
  const bestH = H[0];

  const guides = [];
  let snapX = 0, snapY = 0;

  // snap do narożników (jeśli bliżej niż linie)
  const bestCorner = findCornerSnap(draggedNode, others, CORNER_THRESHOLD_MM);
  const worstBestLineDist = Math.max(
    bestV?.distance ?? Infinity,
    bestH?.distance ?? Infinity
  );

  if (bestCorner && bestCorner.distance < worstBestLineDist) {
    guides.push(bestCorner);
    snapX = bestCorner.snapOffset.x;
    snapY = bestCorner.snapOffset.y;
  } else {
    if (bestV) {
      guides.push(...V.slice(0, MAX_RENDERED_GUIDES_PER_AXIS));
      snapX = bestV.snapOffset;
    }
    if (bestH) {
      guides.push(...H.slice(0, MAX_RENDERED_GUIDES_PER_AXIS));
      snapY = bestH.snapOffset;
    }
  }

  // spacing: równe odstępy (dopasowane do SVG) + najbliższe krawędzie
  guides.push(...findEqualSpacing(draggedNode, others, SPACING_TOLERANCE_MM));
  guides.push(...findNearestEdgeSpacing(draggedNode, others, 0.2));

  return { guides, snapOffset: { x: snapX, y: snapY } };
}

export function useSmartGuides(draggedNode, allNodes, isDragging, pageSize) {
  return useMemo(() => {
    if (!isDragging || !draggedNode)
      return { guides: [], snapOffset: { x: 0, y: 0 } };
    return computeSmartGuides(draggedNode, allNodes, pageSize);
  }, [draggedNode, allNodes, isDragging, pageSize]);
}

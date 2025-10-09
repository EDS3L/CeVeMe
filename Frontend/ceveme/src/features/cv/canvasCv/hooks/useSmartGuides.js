// hooks/useSmartGuides.ts / .js
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
    ['topRight', { x: w / 2, y: -h / 2 }],
    ['bottomRight', { x: w / 2, y: h / 2 }],
    ['bottomLeft', { x: -w / 2, y: h / 2 }],
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

  for (const [dk, dv] of Object.entries(draggedPoints)) {
    if (!['left', 'right', 'centerX'].includes(dk)) continue;
    for (const [tk, tv] of Object.entries(targetPoints)) {
      if (!['left', 'right', 'centerX'].includes(tk)) continue;
      const d = Math.abs(dv - tv);
      if (d <= threshold)
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

  for (const [dk, dv] of Object.entries(draggedPoints)) {
    if (!['top', 'bottom', 'centerY'].includes(dk)) continue;
    for (const [tk, tv] of Object.entries(targetPoints)) {
      if (!['top', 'bottom', 'centerY'].includes(tk)) continue;
      const d = Math.abs(dv - tv);
      if (d <= threshold)
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

  return out;
}

function findEqualSpacing(draggedNode, otherNodes, threshold) {
  const res = [];
  const d = draggedNode.frame;
  const c = { x: d.x + d.w / 2, y: d.y + d.h / 2 };
  const byX = [...otherNodes].sort((a, b) => a.frame.x - b.frame.x);
  const byY = [...otherNodes].sort((a, b) => a.frame.y - b.frame.y);

  // OŚ X
  for (let i = 0; i < byX.length - 1; i++) {
    const A = byX[i],
      B = byX[i + 1];
    const gapAB = B.frame.x - (A.frame.x + A.frame.w);

    if (c.x > A.frame.x + A.frame.w && c.x < B.frame.x) {
      const gapAD = d.x - (A.frame.x + A.frame.w);
      const gapDB = B.frame.x - (d.x + d.w);
      if (Math.abs(gapAD - gapDB) <= threshold) {
        const avg = (gapAD + gapDB) / 2;
        res.push(
          {
            type: 'spacing',
            orientation: 'vertical',
            start: A.frame.x + A.frame.w,
            end: d.x,
            position: c.x,
            distance: avg,
            snapOffset: 0,
          },
          {
            type: 'spacing',
            orientation: 'vertical',
            start: d.x + d.w,
            end: B.frame.x,
            position: c.x,
            distance: avg,
            snapOffset: 0,
          }
        );
      }
    }

    // dopasowanie do gapAB gdy przeciągany jest PRZED A
    const gapToDragged = Math.abs(gapAB - (d.x - (A.frame.x + A.frame.w)));
    if (gapToDragged <= threshold && c.x < A.frame.x) {
      res.push({
        type: 'spacing',
        orientation: 'vertical',
        start: d.x + d.w,
        end: A.frame.x,
        position: c.x,
        distance: gapAB,
      });
    }
  }

  // OŚ Y
  for (let i = 0; i < byY.length - 1; i++) {
    const A = byY[i],
      B = byY[i + 1];

    if (c.y > A.frame.y + A.frame.h && c.y < B.frame.y) {
      const gapAD = d.y - (A.frame.y + A.frame.h);
      const gapDB = B.frame.y - (d.y + d.h);
      if (Math.abs(gapAD - gapDB) <= threshold) {
        const avg = (gapAD + gapDB) / 2;
        res.push(
          {
            type: 'spacing',
            orientation: 'horizontal',
            start: A.frame.y + A.frame.h,
            end: d.y,
            position: c.y,
            distance: avg,
          },
          {
            type: 'spacing',
            orientation: 'horizontal',
            start: d.y + d.h,
            end: B.frame.y,
            position: c.y,
            distance: avg,
          }
        );
      }
    }

    // nowy przypadek: przeciągany NAD A -> dopasuj do gapAB
    const gapAB = B.frame.y - (A.frame.y + A.frame.h);
    const gapToDraggedY = Math.abs(gapAB - (d.y - (A.frame.y + A.frame.h)));
    if (gapToDraggedY <= threshold && c.y < A.frame.y) {
      res.push({
        type: 'spacing',
        orientation: 'horizontal',
        start: d.y + d.h,
        end: A.frame.y,
        position: c.y,
        distance: gapAB,
      });
    }
  }
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
  let snapX = 0,
    snapY = 0;

  // snap do narożników (kątów) — jeśli bliżej niż najlepsze pojedyncze linie
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

  guides.push(...findEqualSpacing(draggedNode, others, SPACING_TOLERANCE_MM));
  return { guides, snapOffset: { x: snapX, y: snapY } };
}

export function useSmartGuides(draggedNode, allNodes, isDragging, pageSize) {
  return useMemo(() => {
    if (!isDragging || !draggedNode)
      return { guides: [], snapOffset: { x: 0, y: 0 } };
    return computeSmartGuides(draggedNode, allNodes, pageSize);
  }, [draggedNode, allNodes, isDragging, pageSize]);
}

import { useMemo } from 'react';

export const SNAP_THRESHOLD_MM = 2;
export const SPACING_TOLERANCE_MM = 1;

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
  }
  return res;
}

export function computeSmartGuides(draggedNode, allNodes) {
  if (!draggedNode) return { guides: [], snapOffset: { x: 0, y: 0 } };
  const others = allNodes.filter(
    (n) => n.id !== draggedNode.id && n.visible !== false && !n.lock
  );
  if (others.length === 0) return { guides: [], snapOffset: { x: 0, y: 0 } };

  const draggedPoints = getAlignmentPoints(draggedNode);
  let all = [];
  for (const node of others)
    all.push(
      ...findClosestAlignment(
        draggedPoints,
        getAlignmentPoints(node),
        SNAP_THRESHOLD_MM
      )
    );

  const V = all
    .filter((g) => g.orientation === 'vertical')
    .sort((a, b) => a.distance - b.distance);
  const H = all
    .filter((g) => g.orientation === 'horizontal')
    .sort((a, b) => a.distance - b.distance);

  const bestV = V[0],
    bestH = H[0];
  const guides = [];
  let snapX = 0,
    snapY = 0;
  if (bestV) {
    guides.push(bestV);
    snapX = bestV.snapOffset;
  }
  if (bestH) {
    guides.push(bestH);
    snapY = bestH.snapOffset;
  }

  guides.push(...findEqualSpacing(draggedNode, others, SPACING_TOLERANCE_MM));
  return { guides, snapOffset: { x: snapX, y: snapY } };
}

export function useSmartGuides(draggedNode, allNodes, isDragging) {
  return useMemo(() => {
    if (!isDragging || !draggedNode)
      return { guides: [], snapOffset: { x: 0, y: 0 } };
    return computeSmartGuides(draggedNode, allNodes);
  }, [draggedNode, allNodes, isDragging]);
}

/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useCallback } from 'react';
import { mmRound } from '../../../utils/mmRound';
import { computeSmartGuides } from '../../../hooks/useSmartGuides';
import { A4 } from '../../../core/mm';

/**
 * Pomocnik: koryguje Y tak, by [y, y+h] NIE przecinało granicy stron (k * pageH).
 * - Jeżeli node jest wyższy niż strona, nie korygujemy (nie da się zmieścić).
 * - Jeżeli przecina granicę, przesuwamy cały prostokąt na górę lub na dół (mniejszy ruch).
 */
function snapYAwayFromPageGaps(y, h, pageH) {
  if (h >= pageH - 0.1) return { y, applied: false };
  if (h <= 0) return { y, applied: false };

  const kStart = Math.floor((y + 1e-6) / pageH);
  const kEnd = Math.floor((y + h - 1e-6) / pageH);
  if (kStart === kEnd) return { y, applied: false };

  const k = kStart + 1;
  const boundary = k * pageH;

  const shiftUp = y + h - boundary;
  const shiftDown = boundary - y;

  if (Math.abs(shiftUp) <= Math.abs(shiftDown)) {
    return { y: y - shiftUp, applied: true };
  }
  return { y: y + shiftDown, applied: true };
}

export default function useDragNode(
  doc,
  pxPerMm,
  scale,
  viewZoom,
  updateNode,
  pageHeightForGuidesMm,
  contentRef
) {
  const dragRef = useRef(null);

  const [dragPreview, setDragPreview] = useState({});
  const dragPreviewRef = useRef({});
  const setDragPreviewBoth = (preview) => {
    dragPreviewRef.current = preview || {};
    setDragPreview(preview || {});
  };

  const [guides, setGuides] = useState([]);

  const clientToViewMm = (e) => {
    const el = contentRef?.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const denom = pxPerMm * scale * (viewZoom || 1);
    return { x: xPx / denom, y: yPx / denom };
  };

  const onMouseMoveDrag = useCallback(
    (e) => {
      const s = dragRef.current;
      if (!s) return;

      const { x: curViewX, y: curViewY } = clientToViewMm(e);

      const dxMm = curViewX - s.startMouseViewX;
      const dyMm = curViewY - s.startMouseViewY;

      // ——— GRUPA
      if (s.isGroup) {
        let movedBBox = {
          x: s.groupStartBBox.x + dxMm,
          y: s.groupStartBBox.y + dyMm,
          w: s.groupStartBBox.w,
          h: s.groupStartBBox.h,
          rotation: 0,
        };

        const otherNodes = s
          .allNodes()
          .filter((n) => !s.groupIds.includes(n.id));
        const { guides, snapOffset } = computeSmartGuides(
          { id: '__group__', type: 'group-virtual', frame: movedBBox },
          otherNodes,
          { pageWidthMm: A4.widthMm, pageHeightMm: pageHeightForGuidesMm }
        );
        setGuides(guides);

        movedBBox.x += snapOffset.x || 0;
        movedBBox.y += snapOffset.y || 0;

        const snapY = snapYAwayFromPageGaps(
          movedBBox.y,
          movedBBox.h,
          A4.heightMm
        );
        if (snapY.applied) movedBBox.y = snapY.y;

        const preview = {};
        const shiftY =
          movedBBox.y - (s.groupStartBBox.y + dyMm + (snapOffset.y || 0));
        const shiftX = snapOffset.x || 0;
        for (const id of s.groupIds) {
          const f0 = s.groupStartFrames[id];
          preview[id] = {
            x: mmRound(f0.x + dxMm + shiftX),
            y: mmRound(f0.y + dyMm + shiftY),
            w: f0.w,
            h: f0.h,
            rotation: f0.rotation || 0,
          };
        }
        setDragPreviewBoth(preview);
        return;
      }

      // ——— POJEDYNCZY
      const node = s.nodeRef();
      if (!node) return;

      const candidate = {
        ...node,
        frame: {
          x: s.startX + dxMm,
          y: s.startY + dyMm,
          w: node.frame.w,
          h: node.frame.h,
          rotation: node.frame.rotation || 0,
        },
      };

      const { guides, snapOffset } = computeSmartGuides(
        candidate,
        s.allNodes(),
        { pageWidthMm: A4.widthMm, pageHeightMm: pageHeightForGuidesMm }
      );
      setGuides(guides);

      let nx = candidate.frame.x + (snapOffset.x || 0);
      let ny = candidate.frame.y + (snapOffset.y || 0);

      const snapY = snapYAwayFromPageGaps(ny, candidate.frame.h, A4.heightMm);
      if (snapY.applied) ny = snapY.y;

      setDragPreviewBoth({
        [s.id]: {
          x: mmRound(nx),
          y: mmRound(ny),
          w: candidate.frame.w,
          h: candidate.frame.h,
          rotation: candidate.frame.rotation || 0,
        },
      });
    },
    [pxPerMm, scale, viewZoom, pageHeightForGuidesMm]
  );

  const onMouseUpDrag = useCallback(() => {
    const s = dragRef.current;
    if (!s) return;

    const preview = dragPreviewRef.current || {};

    if (s.isGroup) {
      for (const id of s.groupIds) {
        const p = preview[id];
        if (!p) continue;
        updateNode(id, {
          frame: { ...s.groupStartFrames[id], x: p.x, y: p.y },
        });
      }
    } else {
      const node = s.nodeRef();
      const p = preview[s.id];
      if (node && p) {
        updateNode(s.id, { frame: { ...node.frame, x: p.x, y: p.y } });
      }
    }

    dragRef.current = null;
    setDragPreviewBoth({}); // <— WAŻNE: czyścimy na pusty obiekt, NIE tablicę
    setGuides([]);

    window.removeEventListener('mousemove', onMouseMoveDrag);
    window.removeEventListener('mouseup', onMouseUpDrag);
  }, [updateNode, onMouseMoveDrag]);

  const startDrag = useCallback(
    (e, node, _setSelectedId, group) => {
      e.stopPropagation();

      const { x: startViewX, y: startViewY } = clientToViewMm(e);

      if (group && group.ids?.length >= 2) {
        dragRef.current = {
          isGroup: true,
          id: '__group__',
          groupIds: [...group.ids],
          groupStartFrames: { ...group.frames },
          groupStartBBox: { ...group.bbox },
          startMouseViewX: startViewX,
          startMouseViewY: startViewY,
          allNodes: () => doc.nodes,
        };
      } else {
        dragRef.current = {
          isGroup: false,
          id: node.id,
          startMouseViewX: startViewX,
          startMouseViewY: startViewY,
          startX: node.frame.x,
          startY: node.frame.y,
          nodeRef: () => doc.nodes.find((n) => n.id === node.id),
          allNodes: () => doc.nodes,
        };
      }

      setDragPreviewBoth({});
      window.addEventListener('mousemove', onMouseMoveDrag);
      window.addEventListener('mouseup', onMouseUpDrag, { once: true });
    },
    [doc, onMouseMoveDrag, onMouseUpDrag]
  );

  return { dragPreview, guides, startDrag };
}

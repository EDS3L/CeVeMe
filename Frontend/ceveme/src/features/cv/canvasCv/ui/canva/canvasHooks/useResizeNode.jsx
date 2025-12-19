/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useCallback, useState } from 'react';
import { mmRound } from '../../../utils/mmRound';
import { A4 } from '../../../core/mm';

/**
 * Jeżeli wynikowy [y,y+h] przecina granicę, dopasuj do najbliższej strony.
 */
function adjustFrameNoCrossing({ x, y, w, h }, dir, pageH) {
  if (h >= pageH - 0.1) return { x, y, w, h };

  const kTop = Math.floor((y + 1e-6) / pageH);
  const kBottom = Math.floor((y + h - 1e-6) / pageH);
  if (kTop === kBottom) return { x, y, w, h };

  const k = kTop + 1;
  const boundary = k * pageH;
  const bottom = y + h;

  const hasN = dir.includes('n');
  const hasS = dir.includes('s');

  const fitAbove = () => {
    const newY = boundary - h;
    return { x, y: newY, w, h };
  };
  const fitBelow = () => {
    const newY = boundary;
    return { x, y: newY, w, h };
  };

  if (hasS && !hasN) {
    const maxH = Math.max(1, boundary - y - 0.1);
    return { x, y, w, h: Math.min(h, maxH) };
  }
  if (hasN && !hasS) {
    const newY = boundary;
    const newH = Math.max(1, bottom - newY);
    return { x, y: newY, w, h: newH };
  }

  const a = fitAbove();
  const b = fitBelow();
  const deltaA = Math.abs(a.y - y);
  const deltaB = Math.abs(b.y - y);
  return deltaA <= deltaB ? a : b;
}

export default function useResizeNode(
  pxPerMm,
  scale,
  viewZoom,
  updateNode,
  setLayoutFrozen,
  contentRef
) {
  const resizeRef = useRef(null);

  const [resizePreview, setResizePreview] = useState({});
  const resizePreviewRef = useRef({});
  const setResizePreviewBoth = (preview) => {
    resizePreviewRef.current = preview || {};
    setResizePreview(preview || {});
  };

  const clientToViewMm = (e) => {
    const el = contentRef?.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const denom = pxPerMm * scale * (viewZoom || 1);
    return { x: xPx / denom, y: yPx / denom };
  };

  const onMouseMoveResize = useCallback(
    (e) => {
      const r = resizeRef.current;
      if (!r) return;

      const { x: curViewX, y: curViewY } = clientToViewMm(e);

      const dxMm = curViewX - r.startMouseViewX;
      const dyMm = curViewY - r.startMouseViewY;

      if (r.isGroup) {
        let { x, y, w, h } = r.groupStartBBox;

        switch (r.dir) {
          case 'e':
            w = Math.max(5, r.groupStartBBox.w + dxMm);
            break;
          case 's':
            h = Math.max(5, r.groupStartBBox.h + dyMm);
            break;
          case 'se':
            w = Math.max(5, r.groupStartBBox.w + dxMm);
            h = Math.max(5, r.groupStartBBox.h + dyMm);
            break;
          case 'w':
            x = r.groupStartBBox.x + dxMm;
            w = Math.max(5, r.groupStartBBox.w - dxMm);
            break;
          case 'n':
            y = r.groupStartBBox.y + dyMm;
            h = Math.max(5, r.groupStartBBox.h - dyMm);
            break;
          case 'nw':
            x = r.groupStartBBox.x + dxMm;
            y = r.groupStartBBox.y + dyMm;
            w = Math.max(5, r.groupStartBBox.w - dxMm);
            h = Math.max(5, r.groupStartBBox.h - dyMm);
            break;
          case 'ne':
            y = r.groupStartBBox.y + dyMm;
            w = Math.max(5, r.groupStartBBox.w + dxMm);
            h = Math.max(5, r.groupStartBBox.h - dyMm);
            break;
          case 'sw':
            x = r.groupStartBBox.x + dxMm;
            w = Math.max(5, r.groupStartBBox.w - dxMm);
            h = Math.max(5, r.groupStartBBox.h + dyMm);
            break;
          default:
            break;
        }

        ({ x, y, w, h } = adjustFrameNoCrossing(
          { x, y, w, h },
          r.dir,
          A4.heightMm
        ));

        const scaleX = w / r.groupStartBBox.w;
        const scaleY = h / r.groupStartBBox.h;

        const preview = {};
        for (const id of r.groupIds) {
          const f0 = r.groupStartFrames[id];
          const relX = f0.x - r.groupStartBBox.x;
          const relY = f0.y - r.groupStartBBox.y;
          const nx = x + relX * scaleX;
          const ny = y + relY * scaleY;
          const nw = Math.max(1, f0.w * scaleX);
          const nh = Math.max(1, f0.h * scaleY);
          preview[id] = {
            x: mmRound(nx),
            y: mmRound(ny),
            w: mmRound(nw),
            h: mmRound(nh),
            rotation: f0.rotation || 0,
          };
        }
        setResizePreviewBoth(preview);
        return;
      }

      const f0 = r.frame;
      let { x, y, w, h } = f0;

      switch (r.dir) {
        case 'e':
          w = Math.max(5, f0.w + dxMm);
          break;
        case 's':
          h = Math.max(5, f0.h + dyMm);
          break;
        case 'se':
          w = Math.max(5, f0.w + dxMm);
          h = Math.max(5, f0.h + dyMm);
          break;
        case 'w':
          x = f0.x + dxMm;
          w = Math.max(5, f0.w - dxMm);
          break;
        case 'n':
          y = f0.y + dyMm;
          h = Math.max(5, f0.h - dyMm);
          break;
        case 'nw':
          x = f0.x + dxMm;
          y = f0.y + dyMm;
          w = Math.max(5, f0.w - dxMm);
          h = Math.max(5, f0.h - dyMm);
          break;
        case 'ne':
          y = f0.y + dyMm;
          w = Math.max(5, f0.w + dxMm);
          h = Math.max(5, f0.h - dyMm);
          break;
        case 'sw':
          x = f0.x + dxMm;
          w = Math.max(5, f0.w - dxMm);
          h = Math.max(5, f0.h + dyMm);
          break;
        default:
          break;
      }

      ({ x, y, w, h } = adjustFrameNoCrossing(
        { x, y, w, h },
        r.dir,
        A4.heightMm
      ));

      setResizePreviewBoth({
        [r.id]: {
          x: mmRound(x),
          y: mmRound(y),
          w: mmRound(w),
          h: mmRound(h),
          rotation: f0.rotation || 0,
        },
      });
    },
    [pxPerMm, scale, viewZoom]
  );

  const onMouseUpResize = useCallback(() => {
    const r = resizeRef.current;
    if (!r) return;

    const preview = resizePreviewRef.current || {};

    if (r.isGroup) {
      for (const id of r.groupIds) {
        const p = preview[id];
        if (!p) continue;
        updateNode(id, {
          frame: { ...r.groupStartFrames[id], x: p.x, y: p.y, w: p.w, h: p.h },
        });
      }
    } else {
      const p = preview[r.id];
      if (p) updateNode(r.id, { frame: p });
    }

    resizeRef.current = null;
    setResizePreviewBoth({});
    window.removeEventListener('mousemove', onMouseMoveResize);
    setLayoutFrozen(false);
  }, [updateNode, onMouseMoveResize, setLayoutFrozen]);

  const startResize = useCallback(
    (e, dir, node, group) => {
      e.stopPropagation();
      setLayoutFrozen(true);

      const { x: startViewX, y: startViewY } = clientToViewMm(e);

      if (group && group.ids?.length >= 2) {
        resizeRef.current = {
          isGroup: true,
          dir,
          groupIds: [...group.ids],
          groupStartFrames: { ...group.frames },
          groupStartBBox: { ...group.bbox },
          startMouseViewX: startViewX,
          startMouseViewY: startViewY,
        };
      } else {
        resizeRef.current = {
          isGroup: false,
          id: node.id,
          dir,
          frame: { ...node.frame },
          startMouseViewX: startViewX,
          startMouseViewY: startViewY,
        };
      }

      setResizePreviewBoth({});
      window.addEventListener('mousemove', onMouseMoveResize);
      window.addEventListener('mouseup', onMouseUpResize, { once: true });
    },
    [onMouseMoveResize, onMouseUpResize, setLayoutFrozen]
  );

  return { startResize, resizePreview };
}

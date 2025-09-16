import React, { useCallback, useMemo, useRef } from 'react';
import useCanvasScale from '../../hooks/useCanvasScale';
import { A4 } from '../../core/mm';
import NodeView from './NodeView';
import Handles from './Handles';
import GridOverlay from './GridOverlay';

export default function Canvas({
  doc,
  selectedId,
  setSelectedId,
  updateNode,
  pageRef,
  showGrid = false,
}) {
  const wrapperRef = useRef(null);
  const { scale, pxPerMm } = useCanvasScale(A4, wrapperRef, {
    min: 1,
    max: 5,
  });

  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const pageStyle = useMemo(
    () => ({
      width: `${A4.widthMm}mm`,
      // width: `full`,

      height: `${A4.heightMm}mm`,
      transform: `scale(${scale})`,
    }),
    [scale]
  );

  const onMouseDownNode = useCallback(
    (e, node) => {
      e.stopPropagation();
      if (node.lock) return;
      setSelectedId(node.id);
      dragRef.current = {
        id: node.id,
        mx: e.clientX,
        my: e.clientY,
        x: node.frame.x,
        y: node.frame.y,
      };
      window.addEventListener('mousemove', onMouseMoveDrag);
      window.addEventListener('mouseup', onMouseUpDrag, { once: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSelectedId]
  );

  const onMouseMoveDrag = useCallback(
    (e) => {
      const s = dragRef.current;
      if (!s) return;
      const denom = pxPerMm * scale;
      const dxMm = (e.clientX - s.mx) / denom;
      const dyMm = (e.clientY - s.my) / denom;
      updateNode(s.id, { frame: { x: s.x + dxMm, y: s.y + dyMm } });
    },
    [pxPerMm, scale, updateNode]
  );

  const onMouseUpDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener('mousemove', onMouseMoveDrag);
  }, [onMouseMoveDrag]);

  const startResize = useCallback((e, dir, node) => {
    e.stopPropagation();
    resizeRef.current = {
      id: node.id,
      dir,
      mx: e.clientX,
      my: e.clientY,
      frame: { ...node.frame },
    };
    window.addEventListener('mousemove', onMouseMoveResize);
    window.addEventListener('mouseup', onMouseUpResize, { once: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseMoveResize = useCallback(
    (e) => {
      const r = resizeRef.current;
      if (!r) return;
      const denom = pxPerMm * scale;
      const dxMm = (e.clientX - r.mx) / denom;
      const dyMm = (e.clientY - r.my) / denom;
      let { x, y, w, h } = r.frame;
      switch (r.dir) {
        case 'e':
          w = Math.max(5, r.frame.w + dxMm);
          break;
        case 's':
          h = Math.max(5, r.frame.h + dyMm);
          break;
        case 'se':
          w = Math.max(5, r.frame.w + dxMm);
          h = Math.max(5, r.frame.h + dyMm);
          break;
        case 'w':
          x = r.frame.x + dxMm;
          w = Math.max(5, r.frame.w - dxMm);
          break;
        case 'n':
          y = r.frame.y + dyMm;
          h = Math.max(5, r.frame.h - dyMm);
          break;
        case 'nw':
          x = r.frame.x + dxMm;
          y = r.frame.y + dyMm;
          w = Math.max(5, r.frame.w - dxMm);
          h = Math.max(5, r.frame.h - dyMm);
          break;
        case 'ne':
          y = r.frame.y + dyMm;
          w = Math.max(5, r.frame.w + dxMm);
          h = Math.max(5, r.frame.h - dyMm);
          break;
        case 'sw':
          x = r.frame.x + dxMm;
          w = Math.max(5, r.frame.w - dxMm);
          h = Math.max(5, r.frame.h + dyMm);
          break;
        default:
          break;
      }
      updateNode(r.id, { frame: { x, y, w, h } });
    },
    [pxPerMm, scale, updateNode]
  );

  const onMouseUpResize = useCallback(() => {
    resizeRef.current = null;
    window.removeEventListener('mousemove', onMouseMoveResize);
  }, [onMouseMoveResize]);

  const onChangeText = useCallback(
    (id, text) => updateNode(id, { text }),
    [updateNode]
  );

  const selectedNode = doc.nodes.find((n) => n.id === selectedId) || null;

  const framePx = selectedNode
    ? {
        x: selectedNode.frame.x * pxPerMm,
        y: selectedNode.frame.y * pxPerMm,
        w: selectedNode.frame.w * pxPerMm,
        h: selectedNode.frame.h * pxPerMm,
      }
    : null;

  return (
    <div
      className="w-full h-full flex justify-center items-center bg-slate-50 p-6"
      ref={wrapperRef}
      onMouseDown={() => setSelectedId(null)}
    >
      <div
        ref={pageRef}
        id="cv-page"
        className="relative  bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
        style={pageStyle}
      >
        {showGrid && <GridOverlay show />}
        {doc.nodes
          .filter((n) => n.visible !== false)
          .map((node) => (
            <NodeView
              key={node.id}
              node={node}
              pxPerMm={pxPerMm}
              selected={selectedId === node.id}
              onMouseDownNode={onMouseDownNode}
              onChangeText={onChangeText}
            />
          ))}
        {selectedNode && !selectedNode.lock && framePx && (
          <>
            <div
              className="absolute pointer-events-none border border-dashed border-blue-600"
              style={{
                left: framePx.x,
                top: framePx.y,
                width: framePx.w,
                height: framePx.h,
              }}
            />
            <Handles
              framePx={framePx}
              rotation={selectedNode.frame.rotation || 0}
              onStartResize={(e, dir) => startResize(e, dir, selectedNode)}
            />
          </>
        )}
      </div>
    </div>
  );
}

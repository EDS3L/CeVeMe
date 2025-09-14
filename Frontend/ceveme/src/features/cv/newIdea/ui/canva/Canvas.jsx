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
    min: 0.2,
    max: 5,
  });

  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const pageStyle = useMemo(
    () => ({
      width: `${A4.widthMm}mm`,
      height: `${A4.heightMm}mm`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      boxShadow: '0 20px 50px rgba(0,0,0,.12)',
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,.05)',
    }),
    [scale]
  );

  const onMouseDownNode = useCallback(
    (e, node) => {
      e.stopPropagation();
      if (node.lock) return;
      setSelectedId(node.id);
      const start = {
        id: node.id,
        mx: e.clientX,
        my: e.clientY,
        x: node.frame.x,
        y: node.frame.y,
      };
      dragRef.current = start;
      window.addEventListener('mousemove', onMouseMoveDrag);
      window.addEventListener('mouseup', onMouseUpDrag, { once: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setSelectedId]
  );

  const onMouseMoveDrag = useCallback(
    (e) => {
      const s = dragRef.current;
      if (!s) return;
      const dxMm = (e.clientX - s.mx) / pxPerMm;
      const dyMm = (e.clientY - s.my) / pxPerMm;
      updateNode(s.id, { frame: { x: s.x + dxMm, y: s.y + dyMm } });
    },
    [pxPerMm, updateNode]
  );

  const onMouseUpDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener('mousemove', onMouseMoveDrag);
  }, [onMouseMoveDrag]);

  const startResize = useCallback((e, dir, node) => {
    e.stopPropagation();
    const { frame } = node;
    resizeRef.current = {
      id: node.id,
      dir,
      mx: e.clientX,
      my: e.clientY,
      frame: { ...frame },
    };
    window.addEventListener('mousemove', onMouseMoveResize);
    window.addEventListener('mouseup', onMouseUpResize, { once: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseMoveResize = useCallback(
    (e) => {
      const r = resizeRef.current;
      if (!r) return;
      const dxMm = (e.clientX - r.mx) / pxPerMm;
      const dyMm = (e.clientY - r.my) / pxPerMm;
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
    [pxPerMm, updateNode]
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
      className="canvas-wrapper"
      ref={wrapperRef}
      onMouseDown={() => setSelectedId(null)}
    >
      <div ref={pageRef} id="cv-page" style={pageStyle}>
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
        {selectedNode && !selectedNode.lock && (
          <>
            <div
              style={{
                position: 'absolute',
                left: framePx.x,
                top: framePx.y,
                width: framePx.w,
                height: framePx.h,
                border: '1.5px dashed #2563eb',
                pointerEvents: 'none',
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

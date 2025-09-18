import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import useCanvasScale from '../../hooks/useCanvasScale';
import { A4 } from '../../core/mm';
import NodeView from './NodeView';
import Handles from './Handles';
import GridOverlay from './GridOverlay';
import { maxContentYMm } from '../../utils/overflow';

export default function Canvas({
  doc,
  selectedId,
  setSelectedId,
  updateNode,
  pageRef,
  showGrid = false,
  overflowPeek = false,
  onMetricsChange = () => {},
}) {
  const wrapperRef = useRef(null);
  const { scale, pxPerMm } = useCanvasScale(A4, wrapperRef, { min: 1, max: 5 });

  useEffect(() => {
    onMetricsChange({ scale, pxPerMm });
  }, [scale, pxPerMm, onMetricsChange]);

  const [layoutFrozen, setLayoutFrozen] = useState(false);
  const liveContentMaxY = useMemo(
    () => maxContentYMm(doc) || A4.heightMm,
    [doc]
  );

  const [frozen, setFrozen] = useState({
    contentMaxY: liveContentMaxY,
    overflowPeekSnapshot: overflowPeek,
  });

  useEffect(() => {
    if (!layoutFrozen) {
      setFrozen({
        contentMaxY: liveContentMaxY,
        overflowPeekSnapshot: overflowPeek,
      });
    }
  }, [layoutFrozen, liveContentMaxY, overflowPeek]);

  const contentMaxY = layoutFrozen ? frozen.contentMaxY : liveContentMaxY;
  const effectiveOverflowPeek = layoutFrozen
    ? frozen.overflowPeekSnapshot
    : overflowPeek;

  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const extendedHeightMm = useMemo(
    () => Math.max(A4.heightMm, contentMaxY + 6 /* bufor */),
    [contentMaxY]
  );

  const PAGE_BUFFER_MM = 1;

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil((contentMaxY + PAGE_BUFFER_MM) / A4.heightMm)),
    [contentMaxY]
  );

  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i),
    [pageCount]
  );

  const pageWrapperPx = useMemo(
    () => ({
      w: Math.ceil(A4.widthMm * pxPerMm * scale),
      h: Math.ceil(A4.heightMm * pxPerMm * scale + 10),
    }),
    [pxPerMm, scale]
  );

  const peekWrapperPx = useMemo(
    () => ({
      w: Math.ceil(A4.widthMm * pxPerMm * scale),
      h: Math.ceil(extendedHeightMm * pxPerMm * scale + 10),
    }),
    [pxPerMm, scale, extendedHeightMm]
  );

  const nodeOverlapsPage = useCallback((node, pageIndex) => {
    const top = node.frame.y;
    const bottom = node.frame.y + node.frame.h;
    const pageTop = pageIndex * A4.heightMm;
    const pageBottom = pageTop + A4.heightMm;
    return bottom > pageTop && top < pageBottom;
  }, []);

  const singlePageStyle = useMemo(
    () => ({
      width: `${A4.widthMm}mm`,
      height: `${A4.heightMm}mm`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    }),
    [scale]
  );

  const peekPageStyle = useMemo(
    () => ({
      width: `${A4.widthMm}mm`,
      height: `${extendedHeightMm}mm`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    }),
    [scale, extendedHeightMm]
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
    setLayoutFrozen(false);
  }, [onMouseMoveDrag]);

  const onMouseDownNode = useCallback(
    (e, node) => {
      e.stopPropagation();
      if (node.lock) return;
      setSelectedId(node.id);

      setLayoutFrozen(true);
      setFrozen({
        contentMaxY: liveContentMaxY,
        overflowPeekSnapshot: overflowPeek,
      });

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
    [
      setSelectedId,
      liveContentMaxY,
      overflowPeek,
      onMouseMoveDrag,
      onMouseUpDrag,
    ]
  );

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
    setLayoutFrozen(false);
  }, [onMouseMoveResize]);

  const startResize = useCallback(
    (e, dir, node) => {
      e.stopPropagation();
      setLayoutFrozen(true);
      setFrozen({
        contentMaxY: liveContentMaxY,
        overflowPeekSnapshot: overflowPeek,
      });

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
    },
    [liveContentMaxY, overflowPeek]
  );

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

  const overflowMm = Math.max(0, contentMaxY - A4.heightMm);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onMouseMoveDrag);
      window.removeEventListener('mousemove', onMouseMoveResize);
    };
  }, [onMouseMoveDrag, onMouseMoveResize]);

  return (
    <div
      className="w-full h-full flex justify-center items-start bg-slate-50 overflow-auto"
      ref={wrapperRef}
      onMouseDown={() => setSelectedId(null)}
    >
      <div className="flex flex-col items-center ">
        {!effectiveOverflowPeek &&
          pages.map((pageIndex) => {
            const pageOffsetMm = pageIndex * A4.heightMm;
            return (
              <div
                key={`wrap-${pageIndex}`}
                className="relative"
                style={{ width: pageWrapperPx.w, height: pageWrapperPx.h }}
              >
                <div
                  key={pageIndex}
                  ref={pageIndex === 0 ? pageRef : null}
                  className="relative bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
                  style={singlePageStyle}
                >
                  {showGrid && <GridOverlay show />}

                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 "
                      style={{ transform: `translateY(-${pageOffsetMm}mm)` }}
                    >
                      {doc.nodes
                        .filter(
                          (n) =>
                            n.visible !== false &&
                            nodeOverlapsPage(n, pageIndex)
                        )
                        .map((node) => (
                          <NodeView
                            key={`${node.id}@p${pageIndex}`}
                            node={node}
                            pxPerMm={pxPerMm}
                            selected={selectedId === node.id}
                            onMouseDownNode={onMouseDownNode}
                            onChangeText={onChangeText}
                          />
                        ))}

                      {selectedNode &&
                        !selectedNode.lock &&
                        nodeOverlapsPage(selectedNode, pageIndex) && (
                          <>
                            <div
                              className="absolute pointer-events-none border border-dashed border-blue-600"
                              style={{
                                left: selectedNode.frame.x * pxPerMm,
                                top: selectedNode.frame.y * pxPerMm,
                                width: selectedNode.frame.w * pxPerMm,
                                height: selectedNode.frame.h * pxPerMm,
                              }}
                            />
                            <Handles
                              framePx={{
                                x: selectedNode.frame.x * pxPerMm,
                                y: selectedNode.frame.y * pxPerMm,
                                w: selectedNode.frame.w * pxPerMm,
                                h: selectedNode.frame.h * pxPerMm,
                              }}
                              rotation={selectedNode.frame.rotation || 0}
                              onStartResize={(e, dir) =>
                                startResize(e, dir, selectedNode)
                              }
                            />
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {effectiveOverflowPeek && (
          <div
            className="relative"
            style={{ width: peekWrapperPx.w, height: peekWrapperPx.h }}
          >
            <div
              ref={pageRef}
              id="cv-page"
              className="relative bg-white rounded-xl shadow-2xl ring-1 ring-black/5"
              style={peekPageStyle}
            >
              {showGrid && <GridOverlay show />}

              <>
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${A4.heightMm}mm`,
                    height: 0,
                    borderTop: '1px dashed rgba(239, 68, 68, 0.9)',
                  }}
                />
                {extendedHeightMm > A4.heightMm && (
                  <div
                    aria-hidden
                    className="absolute inset-x-0 pointer-events-none"
                    style={{
                      top: `${A4.heightMm}mm`,
                      height: `${extendedHeightMm - A4.heightMm}mm`,
                      background:
                        'repeating-linear-gradient(0deg, rgba(239,68,68,.06), rgba(239,68,68,.06) 6mm, rgba(239,68,68,0) 6mm, rgba(239,68,68,0) 12mm)',
                    }}
                  />
                )}
              </>

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
                    onStartResize={(e, dir) =>
                      startResize(e, dir, selectedNode)
                    }
                  />
                </>
              )}

              {effectiveOverflowPeek && overflowMm > 0 && (
                <div
                  className="absolute right-2"
                  style={{ top: `${A4.heightMm - 8}mm` }}
                >
                  <span className="px-2 py-1 rounded bg-white/90 border border-red-200 text-xs text-red-700 font-semibold shadow-sm">
                    +{overflowMm.toFixed(1)} mm
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

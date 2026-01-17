/* eslint-disable react-hooks/exhaustive-deps */
// Canvas.jsx
import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import useCanvasScale from "../../hooks/useCanvasScale";
import { A4 } from "../../core/mm";
import NodeView from "./NodeView";
import Handles from "./Handles";
import GridOverlay from "./GridOverlay";
import SmartGuidesSVG from "./SmartGuidesSVG";
import ContextMenu from "./ContextMenu";
import DrawingToolbar from "./DrawingToolbar";
import { maxContentYMm } from "../../utils/overflow";
import useDragNode from "./canvasHooks/useDragNode";
import useResizeNode from "./canvasHooks/useResizeNode";
import useZoom from "./canvasHooks/useZoom";
import useDrawingTool from "./canvasHooks/useDrawingTool";

const LAYER_Z = {
  page: 0,
  nodes: 10,
  groupOverlay: 950,
  guides: 1000,
  handles: 1100,
  marquee: 1200,
  drawing: 1300,
  loading: 2000,
};

function bboxOfFrames(frames) {
  if (!frames.length) return null;
  const xs = frames.map((f) => f.x);
  const ys = frames.map((f) => f.y);
  const xe = frames.map((f) => f.x + f.w);
  const ye = frames.map((f) => f.y + f.h);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(...xe) - x;
  const h = Math.max(...ye) - y;
  return { x, y, w, h, rotation: 0 };
}

/** anti-gap dla Y: jeżeli [y,y+h] przecina granicę strony, przesuń na górę lub dół */
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

const genId = () => "n_" + Math.random().toString(36).slice(2, 10);

export default function Canvas({
  doc,
  selectedIds,
  setSelectedIds,
  activeGroupIds,
  setActiveGroupIds,
  setSelectedId,
  updateNode,
  removeNode,
  setDocument,
  pageRef,
  showGrid = false,
  onMetricsChange = () => {},
  onFitToScreenReady = () => {},
  onAddText,
  onAddRect,
  onAddImage,
  onAddIcon,
  onOpenIconPicker,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  overflowPeek, // eslint-disable-line no-unused-vars
}) {
  const safeDoc = useMemo(() => {
    if (!doc || !Array.isArray(doc.nodes)) return { nodes: [] };
    return doc;
  }, [doc]);

  const nodes = safeDoc.nodes;

  const isGrouped = activeGroupIds?.length > 0;
  const groupSet = useMemo(
    () => new Set(isGrouped ? activeGroupIds : []),
    [isGrouped, activeGroupIds],
  );

  const groupNodes = useMemo(
    () => (isGrouped ? nodes.filter((n) => n && groupSet.has(n.id)) : []),
    [isGrouped, nodes, groupSet],
  );

  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  const { scale, pxPerMm } = useCanvasScale(A4, wrapperRef, { min: 1, max: 5 });

  const [layoutFrozen, setLayoutFrozen] = useState(false);
  const liveContentMaxY = useMemo(
    () => maxContentYMm(doc) || A4.heightMm,
    [doc],
  );
  const frozenState = useMemo(
    () => ({ contentMaxY: liveContentMaxY }),
    [liveContentMaxY],
  );
  const contentMaxY = layoutFrozen ? frozenState.contentMaxY : liveContentMaxY;

  const PAGE_GAP_MM = 8;
  const pageCount = Math.max(1, Math.ceil(contentMaxY / A4.heightMm));
  const contentMaxYWithGaps = contentMaxY + (pageCount - 1) * PAGE_GAP_MM;
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  const viewZoomRef = useRef(1);
  const [viewZoom, _setViewZoom, fitToScreen] = useZoom(
    wrapperRef,
    0.5,
    2,
    0.1,
    () => {
      const el = wrapperRef.current;
      if (!el) return { left: 0, top: 0 };
      const vz = viewZoomRef.current || 1;
      const visualW = A4.widthMm * pxPerMm * vz;
      const visualH = contentMaxYWithGaps * pxPerMm * vz;
      const left = Math.max(0, (el.clientWidth - visualW) / 2);
      const top = Math.max(0, (el.clientHeight - visualH) / 2);
      return { left, top };
    },
    A4,
    pxPerMm,
  );
  useEffect(() => {
    viewZoomRef.current = viewZoom;
  }, [viewZoom]);

  useEffect(() => {
    onFitToScreenReady(fitToScreen);
  }, [fitToScreen, onFitToScreenReady]);

  const logicYToViewYmm = (yMm) =>
    yMm + Math.floor(yMm / A4.heightMm) * PAGE_GAP_MM;
  const mmToPxX = (mm) => mm * pxPerMm;
  const mmToPxY = (mm) => logicYToViewYmm(mm) * pxPerMm;
  const heightPxFromMmRect = useCallback(
    (yMm, hMm) => mmToPxY(yMm + hMm) - mmToPxY(yMm),
    [mmToPxY],
  );

  const {
    dragPreview,
    guides: dragGuides,
    startDrag,
  } = useDragNode(
    doc,
    pxPerMm,
    scale,
    viewZoom,
    updateNode,
    contentMaxY,
    contentRef,
    PAGE_GAP_MM,
  );
  const { resizePreview, startResize } = useResizeNode(
    pxPerMm,
    scale,
    viewZoom,
    updateNode,
    setLayoutFrozen,
    contentRef,
    PAGE_GAP_MM,
  );

  const PAGE_SPAN_MM = A4.heightMm + PAGE_GAP_MM;
  const clientToViewMm = useCallback(
    (e) => {
      const el = contentRef?.current;
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const xPx = e.clientX - r.left;
      const yPx = e.clientY - r.top;
      const denom = pxPerMm * (viewZoom || 1);
      return { x: xPx / denom, y: yPx / denom };
    },
    [pxPerMm, viewZoom],
  );

  const viewToLogicYmm = useCallback(
    (yViewMm) => {
      const gapsBefore = Math.floor(yViewMm / PAGE_SPAN_MM);
      return yViewMm - gapsBefore * PAGE_GAP_MM;
    },
    [PAGE_SPAN_MM],
  );

  const [drawingToolActive, setDrawingToolActive] = useState(false);
  const drawing = useDrawingTool(
    pxPerMm,
    viewZoom,
    contentRef,
    setDocument,
    drawingToolActive,
    clientToViewMm,
    viewToLogicYmm,
  );

  useEffect(() => {
    if (
      !drawingToolActive ||
      drawing.drawingMode !== "polygon" ||
      !drawing.isDrawing
    ) {
      return;
    }

    const handleMouseMove = (e) => {
      drawing.continueDrawing(e);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [
    drawingToolActive,
    drawing.drawingMode,
    drawing.isDrawing,
    drawing.continueDrawing,
  ]);

  const activeGuides = dragGuides;

  const displayFrameOf = useCallback(
    (n) => {
      if (!n) return null;
      return resizePreview[n.id] || dragPreview[n.id] || n.frame;
    },
    [dragPreview, resizePreview],
  );

  const groupBBox = useMemo(() => {
    if (!isGrouped) return null;
    const frames = groupNodes.map((n) => displayFrameOf(n)).filter(Boolean);
    return bboxOfFrames(frames);
  }, [isGrouped, groupNodes, displayFrameOf]);

  const toggleOrSingleSelect = (e, node) => {
    const isToggle = e.metaKey || e.ctrlKey || e.shiftKey;

    if (isToggle) {
      setSelectedIds((prev) => {
        const next = prev.includes(node.id)
          ? prev.filter((id) => id !== node.id)
          : [...prev, node.id];

        setSelectedId && setSelectedId(node.id);
        setActiveGroupIds(next.length >= 2 ? next : null);
        return next;
      });
    } else {
      setSelectedIds([node.id]);
      setSelectedId && setSelectedId(node.id);
      setActiveGroupIds(null);
    }
  };

  const nodeInGroup = (id) => isGrouped && groupSet.has(id);

  const lastClickRef = useRef({ x: 0, y: 0, nodeId: null, time: 0 });

  const findNodesAtPoint = useCallback(
    (xMm, yMm) => {
      return nodes.filter((n) => {
        if (!n || !n.frame) return false;
        const f = n.frame;
        return xMm >= f.x && xMm <= f.x + f.w && yMm >= f.y && yMm <= f.y + f.h;
      });
    },
    [nodes],
  );

  const selectBestNode = useCallback(
    (nodesAtPoint, clickedNode, isCycling) => {
      if (nodesAtPoint.length === 0) return null;
      if (nodesAtPoint.length === 1) return nodesAtPoint[0];

      // Sortuj według z-index (indeksu w tablicy nodes) - najwyższy z-index pierwszy
      const sorted = [...nodesAtPoint].sort((a, b) => {
        const zA = a.frame?.zIndex ?? nodes.indexOf(a);
        const zB = b.frame?.zIndex ?? nodes.indexOf(b);
        return zB - zA; // Wyższy z-index = pierwszy (na wierzchu)
      });

      // Jeśli cycling (wielokrotne kliknięcie w to samo miejsce), przechodź przez elementy
      if (isCycling && clickedNode) {
        const currentIdx = sorted.findIndex((n) => n.id === clickedNode.id);
        if (currentIdx !== -1) {
          const nextIdx = (currentIdx + 1) % sorted.length;
          return sorted[nextIdx];
        }
      }

      // Domyślnie zwróć element na wierzchu (najwyższy z-index)
      return sorted[0];
    },
    [nodes],
  );

  const onMouseDownNode = (e, node) => {
    if (drawingToolActive) {
      e.preventDefault();
      e.stopPropagation();

      drawing.startDrawing(e);

      if (drawing.drawingMode === "polygon") {
        return;
      }

      const onDrawMove = (me) => drawing.continueDrawing(me);
      const onDrawUp = () => {
        drawing.finishDrawing();
        window.removeEventListener("mousemove", onDrawMove);
        window.removeEventListener("mouseup", onDrawUp);
      };

      window.addEventListener("mousemove", onDrawMove);
      window.addEventListener("mouseup", onDrawUp);
      return;
    }

    const isToggle = e.metaKey || e.ctrlKey || e.shiftKey;
    const now = Date.now();
    const lastClick = lastClickRef.current;

    const isSameSpot =
      Math.abs(e.clientX - lastClick.x) < 5 &&
      Math.abs(e.clientY - lastClick.y) < 5;
    const isQuickClick = now - lastClick.time < 500;
    const isCycling =
      isSameSpot && isQuickClick && lastClick.nodeId === selectedIds[0];

    const clickPos = clientToViewMm(e);
    const nodesAtPoint = findNodesAtPoint(
      clickPos.x,
      viewToLogicYmm(clickPos.y),
    );

    // ZAWSZE wybierz najlepszy węzeł (na wierzchu), ignorując który został kliknięty w DOM
    let targetNode = node;
    if (nodesAtPoint.length > 0) {
      const currentlySelected = nodes.find((n) => n.id === selectedIds[0]);
      targetNode =
        selectBestNode(nodesAtPoint, currentlySelected, isCycling) || node;
    }

    lastClickRef.current = {
      x: e.clientX,
      y: e.clientY,
      nodeId: targetNode.id,
      time: now,
    };

    toggleOrSingleSelect(e, targetNode);

    if (isToggle) {
      e.stopPropagation();
      return;
    }

    if (nodeInGroup(targetNode.id)) {
      const frames = Object.fromEntries(
        groupNodes.map((n) => [n.id, { ...n.frame }]),
      );
      const bbox = groupBBox || bboxOfFrames(groupNodes.map((n) => n.frame));
      startDrag(e, targetNode, null, { ids: activeGroupIds, frames, bbox });
    } else {
      startDrag(e, targetNode, () => {}, null);
    }
  };

  const onStartResize = (e, dir, selectedNode) => {
    if (isGrouped) {
      const frames = Object.fromEntries(
        groupNodes.map((n) => [n.id, { ...n.frame }]),
      );
      const bbox = groupBBox || bboxOfFrames(groupNodes.map((n) => n.frame));
      startResize(e, dir, selectedNode, { ids: activeGroupIds, frames, bbox });
    } else {
      startResize(e, dir, selectedNode, null);
    }
  };

  const onChangeText = (id, text) => updateNode(id, { text });

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    selectedIds.forEach((id) => removeNode(id));
    setSelectedIds([]);
    setSelectedId && setSelectedId(null);
    setActiveGroupIds(null);
  }, [
    selectedIds,
    removeNode,
    setSelectedIds,
    setSelectedId,
    setActiveGroupIds,
  ]);

  const handleBringToFront = useCallback(() => {
    if (selectedIds.length === 0) return;
    setDocument((prev) => {
      const selectedSet = new Set(selectedIds);
      const selected = prev.nodes.filter((n) => selectedSet.has(n.id));
      const rest = prev.nodes.filter((n) => !selectedSet.has(n.id));
      return { ...prev, nodes: [...rest, ...selected] };
    });
  }, [selectedIds, setDocument]);

  const handleSendToBack = useCallback(() => {
    if (selectedIds.length === 0) return;
    setDocument((prev) => {
      const selectedSet = new Set(selectedIds);
      const selected = prev.nodes.filter((n) => selectedSet.has(n.id));
      const rest = prev.nodes.filter((n) => !selectedSet.has(n.id));
      return { ...prev, nodes: [...selected, ...rest] };
    });
  }, [selectedIds, setDocument]);

  const handleBringForward = useCallback(() => {
    if (selectedIds.length !== 1) return;
    const id = selectedIds[0];
    setDocument((prev) => {
      const idx = prev.nodes.findIndex((n) => n.id === id);
      if (idx === -1 || idx === prev.nodes.length - 1) return prev;
      const newNodes = [...prev.nodes];
      [newNodes[idx], newNodes[idx + 1]] = [newNodes[idx + 1], newNodes[idx]];
      return { ...prev, nodes: newNodes };
    });
  }, [selectedIds, setDocument]);

  const handleSendBackward = useCallback(() => {
    if (selectedIds.length !== 1) return;
    const id = selectedIds[0];
    setDocument((prev) => {
      const idx = prev.nodes.findIndex((n) => n.id === id);
      if (idx <= 0) return prev;
      const newNodes = [...prev.nodes];
      [newNodes[idx], newNodes[idx - 1]] = [newNodes[idx - 1], newNodes[idx]];
      return { ...prev, nodes: newNodes };
    });
  }, [selectedIds, setDocument]);

  const [marquee, setMarquee] = useState(null);

  const onMouseDownBackground = (e) => {
    if (drawingToolActive) {
      console.log("[Drawing] Mouse down in drawing mode, calling startDrawing");
      drawing.startDrawing(e);

      if (drawing.drawingMode === "polygon") {
        return;
      }

      const onDrawMove = (me) => drawing.continueDrawing(me);
      const onDrawUp = () => {
        console.log("[Drawing] Mouse up, calling finishDrawing");
        drawing.finishDrawing();
        window.removeEventListener("mousemove", onDrawMove);
        window.removeEventListener("mouseup", onDrawUp);
      };

      window.addEventListener("mousemove", onDrawMove);
      window.addEventListener("mouseup", onDrawUp);
      return;
    }

    if (
      e.target !== contentRef.current &&
      contentRef.current &&
      !contentRef.current.contains(e.target)
    )
      return;

    const { x, y } = clientToViewMm(e);
    const yLogic = viewToLogicYmm(y);

    const isAdditive = e.shiftKey || e.ctrlKey || e.metaKey;
    if (!isAdditive) {
      setSelectedIds([]);
      setSelectedId && setSelectedId(null);
      setActiveGroupIds(null);
    }

    const useIntersects = e.altKey;
    setMarquee({
      x1: x,
      y1: yLogic,
      x2: x,
      y2: yLogic,
      useIntersects,
      isAdditive,
    });

    const onMove = (me) => {
      const { x: mx, y: my } = clientToViewMm(me);
      setMarquee((prev) =>
        prev ? { ...prev, x2: mx, y2: viewToLogicYmm(my) } : null,
      );
    };

    const onUp = () => {
      setMarquee((curr) => {
        if (curr) {
          const minx = Math.min(curr.x1, curr.x2);
          const maxx = Math.max(curr.x1, curr.x2);
          const miny = Math.min(curr.y1, curr.y2);
          const maxy = Math.max(curr.y1, curr.y2);

          const sortedNodes = [...nodes].filter(Boolean).sort((a, b) => {
            const zA = a.frame?.zIndex ?? nodes.indexOf(a);
            const zB = b.frame?.zIndex ?? nodes.indexOf(b);
            return zB - zA;
          });

          const hit = sortedNodes
            .filter((n) => {
              if (!n) return false;
              const f = n.frame;
              const nx1 = f.x,
                ny1 = f.y,
                nx2 = f.x + f.w,
                ny2 = f.y + f.h;

              if (curr.useIntersects) {
                return !(nx2 < minx || nx1 > maxx || ny2 < miny || ny1 > maxy);
              } else {
                return nx1 >= minx && nx2 <= maxx && ny1 >= miny && ny2 <= maxy;
              }
            })
            .map((n) => n.id);

          const finalHit = curr.isAdditive
            ? [...new Set([...selectedIds, ...hit])]
            : hit;

          setSelectedIds(finalHit);
          setSelectedId &&
            setSelectedId(
              finalHit.length ? finalHit[finalHit.length - 1] : null,
            );
          setActiveGroupIds(finalHit.length >= 2 ? [...finalHit] : null);
        }
        return null;
      });

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
  };

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;

      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedIds([]);
        setSelectedId && setSelectedId(null);
        setActiveGroupIds(null);
        return;
      }

      if (!mod) return;
      if (e.key.toLowerCase() === "g" && !e.shiftKey) {
        e.preventDefault();
        if (selectedIds.length >= 2) setActiveGroupIds([...selectedIds]);
      }
      if (e.key.toLowerCase() === "g" && e.shiftKey) {
        e.preventDefault();
        setActiveGroupIds(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIds, setActiveGroupIds]);

  useEffect(() => {
    onMetricsChange({ scale, pxPerMm });
  }, [scale, pxPerMm, onMetricsChange]);

  const clipboardRef = useRef({ nodes: [], bump: 0 });
  const isEditable = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (el.isContentEditable) return true;
    if (el.closest?.('[contenteditable="true"]')) return true;
    if (el.getAttribute?.("role") === "textbox") return true;
    return false;
  };

  const getSelectionIds = () => {
    if (isGrouped) return [...activeGroupIds];
    if (selectedIds?.length)
      return [selectedIds[selectedIds.length - 1], ...selectedIds.slice(0, -1)];
    return [];
  };

  const handleGlobalKeys = useCallback(
    (e) => {
      const active = document.activeElement;
      if (isEditable(active)) return;

      const mod = e.ctrlKey || e.metaKey;

      // DELETE / BACKSPACE
      if (e.key === "Delete" || e.key === "Backspace") {
        const ids = getSelectionIds();
        if (!ids.length) return;
        e.preventDefault();
        for (const id of ids) removeNode(id);
        setSelectedIds([]);
        setActiveGroupIds(null);
        setSelectedId && setSelectedId(null);
        return;
      }

      // LAYER CONTROLS (Ctrl+] / Ctrl+[)
      if (mod && e.key === "]") {
        e.preventDefault();
        if (e.shiftKey) {
          handleBringToFront();
        } else {
          handleBringForward();
        }
        return;
      }
      if (mod && e.key === "[") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSendToBack();
        } else {
          handleSendBackward();
        }
        return;
      }

      // COPY
      if (mod && e.key.toLowerCase() === "c") {
        const ids = getSelectionIds();
        if (!ids.length) return;
        e.preventDefault();
        const map = new Map(nodes.filter(Boolean).map((n) => [n.id, n]));
        const toCopy = ids
          .map((id) => map.get(id))
          .filter(Boolean)
          .map((n) => JSON.parse(JSON.stringify(n)));
        clipboardRef.current = { nodes: toCopy, bump: 0 };
        return;
      }

      // PASTE
      if (mod && e.key.toLowerCase() === "v") {
        const clip = clipboardRef.current;
        if (!clip.nodes || clip.nodes.length === 0) return;
        e.preventDefault();

        const bump = (clip.bump || 0) + 1;
        clipboardRef.current.bump = bump;

        const OFFSET_MM = 4 * bump;
        const newNodes = [];
        const newIds = [];

        const safeClone = (n) => {
          const id = genId();
          const frame = { ...n.frame };
          frame.x = (frame.x || 0) + OFFSET_MM;
          frame.y = (frame.y || 0) + OFFSET_MM;
          const fix = snapYAwayFromPageGaps(frame.y, frame.h, A4.heightMm);
          if (fix.applied) frame.y = fix.y;

          const cloned = { ...n, id, frame };
          return { id, node: cloned };
        };

        for (const n of clip.nodes) {
          const { id, node } = safeClone(n);
          newNodes.push(node);
          newIds.push(id);
        }

        setDocument((prev) => {
          const base = typeof prev === "function" ? prev() : prev;
          return {
            ...base,
            nodes: [...(base.nodes || []).filter(Boolean), ...newNodes],
          };
        });

        setSelectedIds(newIds);
        setActiveGroupIds(newIds.length >= 2 ? [...newIds] : null);
        setSelectedId && setSelectedId(newIds[newIds.length - 1]);
        return;
      }
    },
    [
      nodes,
      isGrouped,
      selectedIds,
      activeGroupIds,
      removeNode,
      setDocument,
      setSelectedIds,
      setActiveGroupIds,
      setSelectedId,
      handleBringToFront,
      handleSendToBack,
      handleBringForward,
      handleSendBackward,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [handleGlobalKeys]);

  const mmPageStyle = (hMm) => ({
    width: `${A4.widthMm}mm`,
    height: `${hMm}mm`,
    position: "relative",
    background: "white",
    boxShadow: `0 0 0 1px rgba(0,0,0,0.05)`,
    borderRadius: "4px",
    overflow: "hidden",
    zIndex: LAYER_Z.page,
  });

  // Bieżące "guttery" (centrowanie) w pikselach layoutu
  const guttersNow = (() => {
    const el = wrapperRef.current;
    if (!el) return { left: 0, top: 0 };
    const visualW = A4.widthMm * pxPerMm * viewZoom;
    const visualH = contentMaxYWithGaps * pxPerMm * viewZoom;
    const left = Math.max(0, (el.clientWidth - visualW) / 2);
    const top = Math.max(0, (el.clientHeight - visualH) / 2);
    return { left, top };
  })();

  // Handler kliknięcia w wrapper (poza obszarem stron) - czyści selekcję
  const onClickOutside = useCallback(
    (e) => {
      // Sprawdź czy kliknięto poza contentRef (obszar stron)
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        setSelectedIds([]);
        setSelectedId && setSelectedId(null);
        setActiveGroupIds(null);
      }
    },
    [setSelectedIds, setSelectedId, setActiveGroupIds],
  );

  // Pomocnik do konwersji punktów ścieżki na SVG path w trakcie rysowania
  const currentDrawingPath = useMemo(() => {
    if (!drawing.currentPath?.points || drawing.currentPath.points.length < 1)
      return null;
    const pts = drawing.currentPath.points;

    // W trybie polygon potrzebujemy tylko 1 punkt, żeby pokazać linię do kursora
    if (pts.length === 1 && !drawing.currentPath.previewPoint) {
      return null;
    }

    let d = `M ${mmToPxX(pts[0].x)} ${mmToPxY(pts[0].y)}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${mmToPxX(pts[i].x)} ${mmToPxY(pts[i].y)}`;
    }

    // W trybie polygon - dodaj linię do aktualnej pozycji kursora
    if (drawing.currentPath.previewPoint && drawing.drawingMode === "polygon") {
      const preview = drawing.currentPath.previewPoint;
      d += ` L ${mmToPxX(preview.x)} ${mmToPxY(preview.y)}`;
    }

    // Zamknij ścieżkę jeśli jesteśmy blisko startu
    if (drawing.currentPath.nearStart) {
      d += " Z";
    }
    return d;
  }, [drawing.currentPath, drawing.drawingMode, mmToPxX, mmToPxY]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full overflow-auto bg-slate-50 relative"
      onClick={onClickOutside}
    >
      {/* Drawing Toolbar */}
      <div className="absolute top-2 left-2 z-50">
        <DrawingToolbar
          isActive={drawingToolActive}
          onToggle={() => setDrawingToolActive(!drawingToolActive)}
          drawingMode={drawing.drawingMode}
          setDrawingMode={drawing.setDrawingMode}
          strokeColor={drawing.strokeColor}
          setStrokeColor={drawing.setStrokeColor}
          fillColor={drawing.fillColor}
          setFillColor={drawing.setFillColor}
          strokeWidth={drawing.strokeWidth}
          setStrokeWidth={drawing.setStrokeWidth}
          onCancel={() => {
            drawing.cancelDrawing();
            setDrawingToolActive(false);
          }}
        />
      </div>
      {/* pad-container: NIE jest skalowany – dodaje paddingi dla wizualnego centrowania */}
      <div
        style={{
          paddingLeft: guttersNow.left,
          paddingRight: guttersNow.left,
          paddingTop: guttersNow.top,
          paddingBottom: guttersNow.top,
          minWidth: "100%",
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* właściwa zawartość, skalowana od lewego-górnego rogu */}
        <div
          style={{
            transform: `scale(${viewZoom})`,
            transformOrigin: "top left",
            width: "fit-content",
          }}
        >
          <div
            ref={contentRef}
            onMouseDown={onMouseDownBackground}
            onDoubleClick={(e) => {
              if (drawingToolActive && drawing.drawingMode === "polygon") {
                drawing.handleDoubleClick(e);
              }
            }}
            onContextMenu={handleContextMenu}
            style={{
              position: "relative",
              width: `${A4.widthMm}mm`,
              height: `${contentMaxYWithGaps}mm`,
              cursor: drawingToolActive ? "crosshair" : "default",
            }}
          >
            {pages.map((pageIndex) => (
              <div
                key={`page-${pageIndex}`}
                className="absolute left-0"
                style={{
                  top: `${pageIndex * (A4.heightMm + PAGE_GAP_MM)}mm`,
                  width: `${A4.widthMm}mm`,
                  height: `${A4.heightMm}mm`,
                }}
              >
                <div
                  ref={pageIndex === 0 ? pageRef : null}
                  className="relative w-full h-full"
                  style={mmPageStyle(A4.heightMm)}
                >
                  {showGrid && <GridOverlay show />}
                </div>
              </div>
            ))}

            {/* Nody */}
            {nodes.filter(Boolean).map((node, index) => {
              // Ukryte elementy nie są renderowane
              if (node.visible === false) return null;
              const df = displayFrameOf(node) || node.frame;
              if (!df) return null;
              // z-index bazuje na jawnej wartości z frame lub indeksie w tablicy
              // Dodajemy LAYER_Z.nodes aby być powyżej stron
              const nodeZIndex = LAYER_Z.nodes + (node.frame?.zIndex ?? index);
              return (
                <NodeView
                  key={node.id}
                  node={{
                    ...node,
                    frame: { ...df, rotation: df.rotation || 0 },
                  }}
                  mmToPxX={mmToPxX}
                  mmToPxY={mmToPxY}
                  selected={selectedIds.includes(node.id)}
                  onMouseDownNode={onMouseDownNode}
                  onChangeText={onChangeText}
                  zIndex={nodeZIndex}
                />
              );
            })}

            {/* Grupa + uchwyty */}
            {isGrouped && groupBBox && (
              <>
                {/* Overlay grupy - tylko wizualizacja, przepuszcza kliknięcia */}
                <div
                  style={{
                    position: "absolute",
                    left: mmToPxX(groupBBox.x),
                    top: mmToPxY(groupBBox.y),
                    width: mmToPxX(groupBBox.w),
                    height: heightPxFromMmRect(groupBBox.y, groupBBox.h),
                    background: "transparent",
                    border: "1px dashed rgba(100,116,139,.85)",
                    borderRadius: 2,
                    zIndex: LAYER_Z.groupOverlay,
                    pointerEvents: "none", // Przepuszcza kliknięcia do elementów pod spodem
                  }}
                  title="Grupa elementów"
                />

                <Handles
                  framePx={{
                    x: mmToPxX(groupBBox.x),
                    y: mmToPxY(groupBBox.y),
                    w: mmToPxX(groupBBox.w),
                    h: heightPxFromMmRect(groupBBox.y, groupBBox.h),
                  }}
                  rotation={0}
                  onStartResize={(e, dir) => {
                    const any = nodes.find((n) => n && groupSet.has(n.id));
                    const frames = Object.fromEntries(
                      groupNodes.map((n) => [n.id, { ...n.frame }]),
                    );
                    const bbox = groupBBox;
                    startResize(e, dir, any, {
                      ids: activeGroupIds,
                      frames,
                      bbox,
                    });
                  }}
                  zIndex={LAYER_Z.handles}
                />
              </>
            )}

            {/* PROWADNICE */}
            {activeGuides && activeGuides.length > 0 && (
              <SmartGuidesSVG
                guides={activeGuides}
                pxPerMm={pxPerMm}
                pageWidthMm={A4.widthMm}
                pageHeightMm={contentMaxYWithGaps}
                yMapMm={logicYToViewYmm}
              />
            )}

            {/* Uchwyty pojedynczego */}
            {!isGrouped &&
              selectedIds.length === 1 &&
              (() => {
                const selectedNode = nodes.find(
                  (n) => n && n.id === selectedIds[0],
                );
                if (!selectedNode || selectedNode.lock) return null;
                const df = displayFrameOf(selectedNode) || selectedNode.frame;
                return (
                  <Handles
                    framePx={{
                      x: mmToPxX(df.x),
                      y: mmToPxY(df.y),
                      w: mmToPxX(df.w),
                      h: heightPxFromMmRect(df.y, df.h),
                    }}
                    rotation={df.rotation || 0}
                    onStartResize={(e, dir) =>
                      onStartResize(e, dir, selectedNode)
                    }
                    zIndex={LAYER_Z.handles}
                  />
                );
              })()}

            {/* Marquee */}
            {marquee &&
              (() => {
                const x = Math.min(marquee.x1, marquee.x2);
                const y = Math.min(marquee.y1, marquee.y2);
                const w = Math.abs(marquee.x2 - marquee.x1);
                const h = Math.abs(marquee.y2 - marquee.y1);
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: mmToPxX(x),
                      top: mmToPxY(y),
                      width: mmToPxX(w),
                      height: heightPxFromMmRect(y, h),
                      border: "1px dashed rgba(37,99,235,.9)",
                      background: "rgba(59,130,246,.08)",
                      pointerEvents: "none",
                      zIndex: LAYER_Z.marquee,
                    }}
                  />
                );
              })()}

            {/* Drawing preview */}
            {drawing.isDrawing && currentDrawingPath && (
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: LAYER_Z.drawing,
                }}
              >
                <path
                  d={currentDrawingPath}
                  fill={
                    drawing.currentPath?.nearStart
                      ? drawing.fillColor !== "none"
                        ? drawing.fillColor + "40"
                        : "rgba(59,130,246,0.1)"
                      : "none"
                  }
                  stroke={drawing.strokeColor}
                  strokeWidth={drawing.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Punkt startowy - wizualna podpowiedź zamknięcia */}
                {drawing.currentPath?.points?.length >= 1 && (
                  <circle
                    cx={mmToPxX(drawing.currentPath.points[0].x)}
                    cy={mmToPxY(drawing.currentPath.points[0].y)}
                    r={drawing.currentPath.nearStart ? 8 : 4}
                    fill={
                      drawing.currentPath.nearStart
                        ? "#22c55e"
                        : drawing.strokeColor
                    }
                    opacity={drawing.currentPath.nearStart ? 0.8 : 0.5}
                  />
                )}
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onAddText={onAddText}
          onAddRect={onAddRect}
          onAddImage={onAddImage}
          onAddIcon={onOpenIconPicker || onAddIcon}
          onFitToScreen={() => {
            // fitToScreen is handled by useZoom, we pass a dummy or let parent handle
          }}
          onUndo={onUndo}
          onRedo={onRedo}
          onDelete={handleDeleteSelected}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          canUndo={canUndo}
          canRedo={canRedo}
          hasSelection={selectedIds.length > 0}
        />
      )}
    </div>
  );
}

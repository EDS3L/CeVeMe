import { useRef, useState, useCallback } from "react";
import { uid } from "../../../core/model";

export default function useDrawingTool(
  pxPerMm,
  viewZoom,
  contentRef,
  setDocument,
  isToolActive = false,
  clientToMm = null,
  viewToLogicY = null
) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const [drawingMode, setDrawingMode] = useState("freehand");
  const [strokeColor, setStrokeColor] = useState("#0f172a");
  const [fillColor, setFillColor] = useState("none");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const pathPointsRef = useRef([]);
  const startTimeRef = useRef(0);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef(null);
  const finishDrawingRef = useRef(null);

  const CLOSE_THRESHOLD_MM = 3;

  const getPosition = useCallback(
    (e) => {
      if (clientToMm) {
        return clientToMm(e);
      }
      const el = contentRef?.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const xPx = e.clientX - rect.left;
      const yPx = e.clientY - rect.top;
      const denom = pxPerMm * (viewZoom || 1);
      return { x: xPx / denom, y: yPx / denom };
    },
    [clientToMm, pxPerMm, viewZoom, contentRef]
  );

  const distance = useCallback((p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }, []);

  const simplifyPath = useCallback((points, tolerance = 0.8) => {
    if (points.length <= 2) return points;

    const sqDist = (p1, p2) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    const sqDistToLine = (p, v, w) => {
      const l2 = sqDist(v, w);
      if (l2 === 0) return sqDist(p, v);
      let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      return sqDist(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
    };

    const rdp = (pts, start, end, tol) => {
      let maxDist = 0;
      let maxIdx = start;
      for (let i = start + 1; i < end; i++) {
        const d = sqDistToLine(pts[i], pts[start], pts[end]);
        if (d > maxDist) {
          maxDist = d;
          maxIdx = i;
        }
      }
      if (Math.sqrt(maxDist) > tol) {
        const left = rdp(pts, start, maxIdx, tol);
        const right = rdp(pts, maxIdx, end, tol);
        return [...left.slice(0, -1), ...right];
      }
      return [pts[start], pts[end]];
    };

    return rdp(points, 0, points.length - 1, tolerance);
  }, []);

  const smoothPath = useCallback((points, iterations = 2) => {
    if (points.length < 3) return points;

    let result = [...points];

    for (let iter = 0; iter < iterations; iter++) {
      const smoothed = [];
      smoothed.push(result[0]);

      for (let i = 0; i < result.length - 1; i++) {
        const p0 = result[i];
        const p1 = result[i + 1];

        smoothed.push({
          x: p0.x * 0.75 + p1.x * 0.25,
          y: p0.y * 0.75 + p1.y * 0.25,
        });
        smoothed.push({
          x: p0.x * 0.25 + p1.x * 0.75,
          y: p0.y * 0.25 + p1.y * 0.75,
        });
      }

      smoothed.push(result[result.length - 1]);
      result = smoothed;
    }

    return result;
  }, []);

  const pointsToSmoothSvgPath = useCallback((points, closed = false) => {
    if (points.length < 2) return "";

    let d = "M " + points[0].x.toFixed(2) + " " + points[0].y.toFixed(2);

    if (points.length === 2) {
      d += " L " + points[1].x.toFixed(2) + " " + points[1].y.toFixed(2);
      return d;
    }

    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      d +=
        " Q " +
        p1.x.toFixed(2) +
        " " +
        p1.y.toFixed(2) +
        " " +
        midX.toFixed(2) +
        " " +
        midY.toFixed(2);
    }

    const last = points[points.length - 1];
    d += " L " + last.x.toFixed(2) + " " + last.y.toFixed(2);

    if (closed) {
      d += " Z";
    }

    return d;
  }, []);

  const computeBounds = useCallback((points, padding = 1) => {
    if (points.length === 0) return { x: 0, y: 0, w: 10, h: 10 };

    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

    for (const p of points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }

    const x = minX - padding;
    const y = minY - padding;
    const w = Math.max(maxX - minX + padding * 2, 5);
    const h = Math.max(maxY - minY + padding * 2, 5);

    return { x, y, w, h };
  }, []);

  const normalizePoints = useCallback((points, bounds) => {
    return points.map((p) => ({
      x: ((p.x - bounds.x) / bounds.w) * 100,
      y: ((p.y - bounds.y) / bounds.h) * 100,
    }));
  }, []);

  const startDrawing = useCallback(
    (e) => {
      if (!isToolActive) return;
      if (e.button !== 0) return;

      const pos = getPosition(e);

      if (
        drawingMode === "polygon" &&
        isDrawingRef.current &&
        startPointRef.current
      ) {
        const distToStart = distance(pos, startPointRef.current);

        if (
          distToStart < CLOSE_THRESHOLD_MM &&
          pathPointsRef.current.length >= 3
        ) {
          if (finishDrawingRef.current) {
            finishDrawingRef.current(true);
          }
          return;
        }

        pathPointsRef.current.push(pos);
        setCurrentPath((prev) =>
          prev ? { ...prev, points: [...pathPointsRef.current] } : null
        );
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      pathPointsRef.current = [pos];
      startPointRef.current = pos;
      startTimeRef.current = Date.now();
      isDrawingRef.current = true;
      setIsDrawing(true);
      setCurrentPath({
        points: [pos],
        strokeColor,
        fillColor,
        strokeWidth,
        mode: drawingMode,
        closed: false,
      });

      e.preventDefault();
      e.stopPropagation();
    },
    [
      isToolActive,
      getPosition,
      strokeColor,
      fillColor,
      strokeWidth,
      drawingMode,
      distance,
      CLOSE_THRESHOLD_MM,
    ]
  );

  const continueDrawing = useCallback(
    (e) => {
      if (!isDrawingRef.current) return;

      const pos = getPosition(e);

      if (drawingMode === "polygon") {
        const nearStart =
          startPointRef.current &&
          distance(pos, startPointRef.current) < CLOSE_THRESHOLD_MM &&
          pathPointsRef.current.length >= 3;

        setCurrentPath((prev) =>
          prev
            ? {
                ...prev,
                nearStart,
                previewPoint: pos, 
              }
            : null
        );
        return;
      }

      const lastPoint = pathPointsRef.current[pathPointsRef.current.length - 1];

      const minDist = 0.5;
      const dist = distance(pos, lastPoint);

      if (dist >= minDist) {
        pathPointsRef.current.push(pos);

        const nearStart =
          startPointRef.current &&
          distance(pos, startPointRef.current) < CLOSE_THRESHOLD_MM &&
          pathPointsRef.current.length >= 3;

        setCurrentPath((prev) =>
          prev
            ? {
                ...prev,
                points: [...pathPointsRef.current],
                nearStart,
              }
            : null
        );
      }
    },
    [getPosition, drawingMode, distance, CLOSE_THRESHOLD_MM]
  );

  const finishDrawing = useCallback(
    (forceClose = false) => {
      if (!isDrawingRef.current || pathPointsRef.current.length < 2) {
        isDrawingRef.current = false;
        setIsDrawing(false);
        setCurrentPath(null);
        pathPointsRef.current = [];
        startPointRef.current = null;
        return;
      }

      const shouldClose =
        forceClose ||
        (startPointRef.current &&
          pathPointsRef.current.length >= 3 &&
          distance(
            pathPointsRef.current[pathPointsRef.current.length - 1],
            startPointRef.current
          ) < CLOSE_THRESHOLD_MM);

      let processedPoints = simplifyPath(pathPointsRef.current, 0.5);
      processedPoints = smoothPath(processedPoints, 1);

      const logicPoints = viewToLogicY
        ? processedPoints.map((p) => ({ x: p.x, y: viewToLogicY(p.y) }))
        : processedPoints;

      const bounds = computeBounds(logicPoints, 0.5);
      const normalized = normalizePoints(logicPoints, bounds);
      const svgPath = pointsToSmoothSvgPath(normalized, shouldClose);

      const newNode = {
        id: uid("draw"),
        type: "drawing",
        frame: {
          x: bounds.x,
          y: bounds.y,
          w: bounds.w,
          h: bounds.h,
          rotation: 0,
        },
        style: {
          strokeColor: strokeColor,
          fillColor: shouldClose ? fillColor : "none",
          strokeWidth: strokeWidth,
          opacity: 1,
        },
        svgPath,
        points: normalized,
        closed: shouldClose,
        originalPoints: logicPoints,
        visible: true,
        lock: false,
      };

      setDocument((prev) => {
        const currentNodes = prev?.nodes || [];
        return {
          ...prev,
          nodes: [...currentNodes, newNode],
        };
      });

      isDrawingRef.current = false;
      setIsDrawing(false);
      setCurrentPath(null);
      pathPointsRef.current = [];
      startPointRef.current = null;
    },
    [
      simplifyPath,
      smoothPath,
      computeBounds,
      normalizePoints,
      pointsToSmoothSvgPath,
      strokeColor,
      fillColor,
      strokeWidth,
      setDocument,
      viewToLogicY,
      distance,
      CLOSE_THRESHOLD_MM,
    ]
  );

  finishDrawingRef.current = finishDrawing;

  const cancelDrawing = useCallback(() => {
    isDrawingRef.current = false;
    setIsDrawing(false);
    setCurrentPath(null);
    pathPointsRef.current = [];
    startPointRef.current = null;
  }, []);

  const handleDoubleClick = useCallback(
    (e) => {
      if (!isToolActive || drawingMode !== "polygon" || !isDrawingRef.current)
        return;

      e.preventDefault();
      e.stopPropagation();

      if (pathPointsRef.current.length >= 3) {
        finishDrawing(true);
      } else {
        cancelDrawing();
      }
    },
    [isToolActive, drawingMode, finishDrawing, cancelDrawing]
  );

  return {
    isDrawing,
    currentPath,
    drawingMode,
    strokeColor,
    fillColor,
    strokeWidth,

    setDrawingMode,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,

    startDrawing,
    continueDrawing,
    finishDrawing,
    cancelDrawing,
    handleDoubleClick,

    CLOSE_THRESHOLD_MM,
  };
}

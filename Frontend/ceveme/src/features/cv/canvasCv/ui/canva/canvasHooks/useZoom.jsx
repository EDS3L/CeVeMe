// canvasHooks/useZoom.js
import { useEffect, useRef, useState, useCallback } from "react";

export default function useZoom(
  wrapperRef,
  min = 0.5,
  max = 4,
  step = 0.12,
  getGutters = () => ({ left: 0, top: 0 }),
  pageSize = { widthMm: 210, heightMm: 297 },
  pxPerMm = 3.7795
) {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const initializedRef = useRef(false);
  zoomRef.current = zoom;

  const fitToScreen = useCallback(
    (padding = 40) => {
      const el = wrapperRef?.current;
      if (!el) return;

      const containerWidth = el.clientWidth - padding * 2;
      const containerHeight = el.clientHeight - padding * 2;

      const pageWidthPx = pageSize.widthMm * pxPerMm;
      const pageHeightPx = pageSize.heightMm * pxPerMm;

      const scaleX = containerWidth / pageWidthPx;
      const scaleY = containerHeight / pageHeightPx;

      const optimalZoom = Math.min(scaleX, scaleY, max);
      const clampedZoom = Math.max(min, Math.min(max, optimalZoom));

      setZoom(clampedZoom);

      requestAnimationFrame(() => {
        const scaledWidth = pageWidthPx * clampedZoom;
        const scaledHeight = pageHeightPx * clampedZoom;

        const scrollLeft = Math.max(0, (scaledWidth - el.clientWidth) / 2);
        const scrollTop = Math.max(0, (scaledHeight - el.clientHeight) / 2);

        el.scrollLeft = scrollLeft;
        el.scrollTop = scrollTop;
      });
    },
    [wrapperRef, pageSize, pxPerMm, min, max]
  );

  useEffect(() => {
    if (initializedRef.current) return;

    const el = wrapperRef?.current;
    if (!el) return;

    const timer = setTimeout(() => {
      fitToScreen(60);
      initializedRef.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, [wrapperRef, fitToScreen]);

  useEffect(() => {
    const el = wrapperRef?.current;
    if (!el) return;

    const clamp = (v) => Math.min(max, Math.max(min, v));

    const normalizeDelta = (e) => {
      const L = 100;
      if (e.deltaMode === 1) return e.deltaY * L; // per-line
      if (e.deltaMode === 2) return e.deltaY * el.clientHeight; // per-page
      return e.deltaY; // pixel
    };

    const clampScroll = (node, left, top) => {
      const maxL = Math.max(0, node.scrollWidth - node.clientWidth);
      const maxT = Math.max(0, node.scrollHeight - node.clientHeight);
      node.scrollLeft = Math.min(maxL, Math.max(0, left));
      node.scrollTop = Math.min(maxT, Math.max(0, top));
    };

    const setZoomAnchored = (next, clientX, clientY) => {
      const prev = zoomRef.current;
      if (next === prev) return;

      const rect = el.getBoundingClientRect();
      const vx = clientX - rect.left;
      const vy = clientY - rect.top;

      const { left: padL = 0, top: padT = 0 } = getGutters?.() || {};

      // współrzędne kotwicy w układzie layout (nie-skaluje-transform)
      const anchorX = (el.scrollLeft + vx - padL) / prev;
      const anchorY = (el.scrollTop + vy - padT) / prev;

      setZoom(next);

      // Po reflow ustaw scroll tak, żeby anchor pozostał pod kursorem
      requestAnimationFrame(() => {
        const targetLeft = anchorX * next + padL - vx;
        const targetTop = anchorY * next + padT - vy;
        clampScroll(el, targetLeft, targetTop);
      });
    };

    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();

      const prev = zoomRef.current;
      const delta = normalizeDelta(e);
      const factor = Math.exp(-delta * 0.0015);
      const next = clamp(prev * factor);

      setZoomAnchored(next, e.clientX, e.clientY);
    };

    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const prev = zoomRef.current;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + el.clientWidth / 2;
      const cy = rect.top + el.clientHeight / 2;

      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        const next = clamp(prev * (1 + step));
        setZoomAnchored(next, cx, cy);
      } else if (e.key === "-") {
        e.preventDefault();
        const next = clamp(prev * (1 - step));
        setZoomAnchored(next, cx, cy);
      } else if (e.key === "0") {
        e.preventDefault();
        setZoomAnchored(1, cx, cy);
      } else if (e.key === "9") {
        // Ctrl/Cmd + 9 = Fit to screen
        e.preventDefault();
        fitToScreen(60);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [wrapperRef, min, max, step, getGutters, fitToScreen]);

  return [zoom, setZoom, fitToScreen];
}

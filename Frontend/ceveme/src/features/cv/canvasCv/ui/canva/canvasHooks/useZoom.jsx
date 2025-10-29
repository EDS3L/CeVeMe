// canvasHooks/useZoom.js
import { useEffect, useRef, useState } from 'react';

/**
 * Zoom z kotwicą dokładnie pod kursorem (Ctrl/Cmd + scroll),
 * z uwzględnieniem dynamicznych "gutterów" (paddingów) centrowania.
 *
 * WAŻNE: Skalowany wewnętrzny kontener musi mieć CSS: transformOrigin: 'top left'.
 *
 * @param {React.RefObject<HTMLElement>} wrapperRef  scroll-container
 * @param {number} min
 * @param {number} max
 * @param {number} step
 * @param {() => {left:number, top:number}} getGutters  Zwraca aktualne paddingi (w px, layout), nie skalowane transformem
 */
export default function useZoom(
  wrapperRef,
  min = 0.5,
  max = 4,
  step = 0.12,
  getGutters = () => ({ left: 0, top: 0 })
) {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  zoomRef.current = zoom;

  useEffect(() => {
    const el = wrapperRef?.current;
    if (!el) return;

    const clamp = (v) => Math.min(max, Math.max(min, v));

    const normalizeDelta = (e) => {
      // normalizacja deltaY dla różnych deltaMode
      const L = 100;
      if (e.deltaMode === 1) return e.deltaY * L; // per-line
      if (e.deltaMode === 2) return e.deltaY * el.clientHeight; // per-page
      return e.deltaY; // pixel
    };

    const clampScroll = (node, left, top) => {
      const maxL = Math.max(0, node.scrollWidth - node.clientWidth);
      const maxT = Math.max(0, node.scrollHeight - node.clientHeight);
      node.scrollLeft = Math.min(maxL, Math.max(0, left));
      node.scrollTop  = Math.min(maxT, Math.max(0, top));
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
      const anchorY = (el.scrollTop  + vy - padT) / prev;

      setZoom(next);

      // Po reflow ustaw scroll tak, żeby anchor pozostał pod kursorem
      requestAnimationFrame(() => {
        const targetLeft = anchorX * next + padL - vx;
        const targetTop  = anchorY * next + padT - vy;
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
      const cy = rect.top  + el.clientHeight / 2;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        const next = clamp(prev * (1 + step));
        setZoomAnchored(next, cx, cy);
      } else if (e.key === '-') {
        e.preventDefault();
        const next = clamp(prev * (1 - step));
        setZoomAnchored(next, cx, cy);
      } else if (e.key === '0') {
        e.preventDefault();
        setZoomAnchored(1, cx, cy);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [wrapperRef, min, max, step, getGutters]);

  return [zoom, setZoom];
}

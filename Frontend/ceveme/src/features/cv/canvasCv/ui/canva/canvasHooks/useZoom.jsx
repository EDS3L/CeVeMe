/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';

export default function useZoom(wrapperRef, min = 0.5, max = 4, step = 0.12) {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    const el = wrapperRef?.current;
    if (!el) return;

    const clamp = (v) => Math.min(max, Math.max(min, v));

    const onWheel = (e) => {
      // Zoom tylko z CTRL/Cmd (jak prosiłeś)
      const isZoomGesture = e.ctrlKey || e.metaKey;
      if (!isZoomGesture) return;

      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const prev = zoomRef.current;

      // Skala wykładnicza = płynniejsza
      const factor = Math.exp(-e.deltaY * 0.0016);
      const next = clamp(prev * factor);

      // Kotwice względem aktualnego scrolla
      const sx = el.scrollLeft;
      const sy = el.scrollTop;
      const anchorX = (sx + mouseX) / prev;
      const anchorY = (sy + mouseY) / prev;

      setZoom(next);

      // Utrzymujemy punkt pod kursorem w miejscu
      requestAnimationFrame(() => {
        el.scrollLeft = anchorX * next - mouseX;
        el.scrollTop = anchorY * next - mouseY;
      });
    };

    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom((z) => clamp(z * (1 + step)));
        return;
      }
      if (e.key === '-') {
        e.preventDefault();
        setZoom((z) => clamp(z * (1 - step)));
        return;
      }
      if (e.key === '0') {
        e.preventDefault();
        setZoom(1);
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [wrapperRef, min, max, step]);

  return [zoom, setZoom];
}

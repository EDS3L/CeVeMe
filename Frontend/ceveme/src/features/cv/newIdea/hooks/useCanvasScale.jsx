import { useEffect, useState } from 'react';
import { measurePxPerMm } from '../core/mm';

export default function useCanvasScale(
  pageSizeMm,
  containerRef,
  { min = 0.2, max = 3 } = {}
) {
  const [pxPerMm, setPxPerMm] = useState(3.7795);
  const [scale, setScale] = useState(1);
  const recompute = () => {
    if (!containerRef.current) return;
    const c = containerRef.current.getBoundingClientRect();
    const p = measurePxPerMm();
    setPxPerMm(p);
    const pagePxW = pageSizeMm.widthMm * p;
    const pagePxH = pageSizeMm.heightMm * p;
    const s = Math.min(c.width / pagePxW, c.height / pagePxH);
    setScale(Math.max(min, Math.min(max, s)));
  };
  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [pageSizeMm]);
  return { scale, pxPerMm, recompute };
}

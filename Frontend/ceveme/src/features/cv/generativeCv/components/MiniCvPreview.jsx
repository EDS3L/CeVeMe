import React, { useEffect, useRef, useState } from 'react';

export default function MiniCvPreview({
  component: PreviewComponent,
  cvData,
  width = 340,
}) {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const recompute = () => {
    const w = wrapperRef.current?.clientWidth || width;
    const h = Math.round((w * 297) / 210);
    if (!innerRef.current) return;
    const sw = innerRef.current.scrollWidth || 1;
    const sh = innerRef.current.scrollHeight || 1;
    const s = Math.min(w / sw, h / sh);
    setScale(s * 0.995);
  };

  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [PreviewComponent, cvData]);

  return (
    <div
      ref={wrapperRef}
      style={{ width: '100%', maxWidth: width, aspectRatio: '210 / 297' }}
      className="rounded-xl bg-[var(--color-basewhite)]
                 border border-[color:rgba(0,0,0,0.06)]
                 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden relative"
    >
      <div
        ref={innerRef}
        style={{
          width: '210mm',
          height: '297mm',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <PreviewComponent cvData={cvData} />
      </div>
    </div>
  );
}

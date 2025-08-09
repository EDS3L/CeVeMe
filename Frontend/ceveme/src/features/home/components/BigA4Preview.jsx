import React, { useRef } from 'react';
import { useA4Fit } from '../hooks/useA4Fit';

export default function BigA4Preview({ component: Preview, cvData }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const scale = useA4Fit(innerRef, wrapRef);

  return (
    <div
      ref={wrapRef}
      className="relative rounded-xl border border-[rgba(0,0,0,0.06)] bg-[var(--color-basewhite)]
                 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
      style={{ width: 'min(100%, 980px)', aspectRatio: '210/297' }}
    >
      <div
        ref={innerRef}
        style={{
          width: '210mm',
          height: '297mm',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          inset: 0,
        }}
        className="transition-transform duration-300"
      >
        <Preview cvData={cvData} />
      </div>
    </div>
  );
}

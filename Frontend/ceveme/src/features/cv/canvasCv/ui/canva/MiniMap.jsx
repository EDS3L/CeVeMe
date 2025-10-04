import React, { useMemo, useRef } from 'react';
import { maxContentYMm } from '../../utils/overflow';
import { A4 } from '../../core/mm';

export default function MiniMap({ doc, onJumpToMm = () => {} }) {
  const ref = useRef(null);
  const pageW = doc?.page?.widthMm ?? A4.widthMm;
  const pageH = doc?.page?.heightMm ?? A4.heightMm;
  const maxY = useMemo(() => Math.max(pageH, maxContentYMm(doc)), [doc, pageH]);

  const widthPx = 120;
  const scale = widthPx / pageW;
  const a4HeightPx = pageH * scale;
  const fullHeightPx = maxY * scale;

  const onClick = (e) => {
    const box = ref.current.getBoundingClientRect();
    const yPx = e.clientY - box.top;
    const yMm = yPx / scale;
    onJumpToMm(Math.max(0, yMm - 10));
  };

  return (
    <div className="inline-block">
      <div className="text-xs font-semibold mb-1 text-slate-700">Podgląd</div>
      <div
        ref={ref}
        onClick={onClick}
        className="relative rounded-md border border-black/15 bg-white cursor-pointer"
        style={{ width: widthPx, height: fullHeightPx }}
        title="Kliknij, aby przewinąć"
      >
        <div
          className="absolute left-0 right-0 rounded-md"
          style={{
            top: 0,
            height: a4HeightPx,
            border: '1px dashed rgba(100,116,139,.8)',
            boxSizing: 'border-box',
          }}
        />
        {fullHeightPx > a4HeightPx && (
          <div
            className="absolute left-0 right-0 rounded-b-md"
            style={{
              top: a4HeightPx,
              height: fullHeightPx - a4HeightPx,
              background:
                'repeating-linear-gradient(0deg, rgba(239,68,68,.08), rgba(239,68,68,.08) 6px, rgba(239,68,68,0) 6px, rgba(239,68,68,0) 12px)',
            }}
          />
        )}
        <div className="absolute right-1 bottom-1 text-[10px] bg-white/90 border border-black/10 rounded px-1">
          {maxY - pageH > 0 ? `+${(maxY - pageH).toFixed(1)}mm` : 'OK'}
        </div>
      </div>
    </div>
  );
}

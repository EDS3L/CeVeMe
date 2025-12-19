import React from 'react';

/** Rysuje linie pomocnicze w px (z konwersją mm→px przez pxPerMm) */
export default function SmartGuides({ guides, pxPerMm }) {
  if (!guides || guides.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1000 }}
    >
      {guides.map((guide, idx) => {
        if (guide.type === 'line') {
          const isV = guide.orientation === 'vertical';
          return (
            <div
              key={`line-${idx}`}
              className="absolute"
              style={{
                left: isV ? `${guide.position * pxPerMm}px` : 0,
                top: !isV ? `${guide.position * pxPerMm}px` : 0,
                width: isV ? '1px' : '100%',
                height: !isV ? '1px' : '100%',
                background: 'rgba(59,130,246,0.95)',
                boxShadow: '0 0 2px rgba(59,130,246,0.5)',
              }}
            />
          );
        }

        if (guide.type === 'spacing') {
          const isV = guide.orientation === 'vertical';
          const start = guide.start * pxPerMm;
          const end = guide.end * pxPerMm;
          const pos = guide.position * pxPerMm;
          const length = Math.abs(end - start);
          const from = Math.min(start, end);
          const to = Math.max(start, end);

          return (
            <React.Fragment key={`spacing-${idx}`}>
              <div
                className="absolute"
                style={{
                  [isV ? 'left' : 'top']: `${pos}px`,
                  [isV ? 'top' : 'left']: `${from}px`,
                  [isV ? 'width' : 'height']: '1px',
                  [isV ? 'height' : 'width']: `${length}px`,
                  background: 'rgba(168,85,247,0.85)',
                }}
              />
              <div
                className="absolute"
                style={{
                  [isV ? 'left' : 'top']: `${pos - 3}px`,
                  [isV ? 'top' : 'left']: `${from - 3}px`,
                  width: 6,
                  height: 6,
                  transform: 'rotate(45deg)',
                  background: 'rgba(168,85,247,0.85)',
                }}
              />
              <div
                className="absolute"
                style={{
                  [isV ? 'left' : 'top']: `${pos - 3}px`,
                  [isV ? 'top' : 'left']: `${to - 3}px`,
                  width: 6,
                  height: 6,
                  transform: 'rotate(45deg)',
                  background: 'rgba(168,85,247,0.85)',
                }}
              />
              <div
                className="absolute px-1.5 py-0.5 rounded text-white"
                style={{
                  [isV ? 'left' : 'top']: `${pos + 6}px`,
                  [isV ? 'top' : 'left']: `${(from + to) / 2 - 10}px`,
                  background: 'rgba(168,85,247,0.95)',
                  fontSize: 10,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {guide.distance?.toFixed?.(1)}
              </div>
            </React.Fragment>
          );
        }

        return null;
      })}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Suggest = ({ items = [], onPick, anchorRef }) => {
  const [style, setStyle] = useState(null);

  useEffect(() => {
    if (!anchorRef?.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      setStyle({
        position: 'absolute',
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 50,
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef, items]);

  if (!items.length || !anchorRef?.current) return null;

  return createPortal(
    <div
      style={style}
      className="rounded-xl border border-basewhite/50 bg-ivorylight shadow-xl overflow-hidden"
    >
      <ul className="max-h-72 overflow-auto divide-y divide-basewhite/40">
        {items.map((it, i) => (
          <li
            key={`${it.type}-${it.label}-${i}`}
            className="px-4 py-2 hover:bg-ivorymedium cursor-pointer flex items-center justify-between"
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(it);
            }}
          >
            <span className="text-slatedark">
              {it.type === 'city' ? 'Miasto:' : 'Technologia:'}{' '}
              <strong>{it.label}</strong>
            </span>
            <span className="text-clouddark text-sm">{it.count}</span>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
};

export default Suggest;

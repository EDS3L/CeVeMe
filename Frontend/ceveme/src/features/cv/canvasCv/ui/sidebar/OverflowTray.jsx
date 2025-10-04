import React, { useMemo } from 'react';
import {
  getOverflowList,
  clampFrameIntoPage,
  fitWidthIntoPage,
} from '../../utils/overflow';
import { A4 } from '../../core/mm';

function Item({ item, onJump, onMoveInside, onFitWidth, onSelect }) {
  const { name, type, frame, over } = item;
  return (
    <div className="p-2 rounded-lg border border-black/10 bg-white flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-slate-500 lowercase">{type}</div>
          <div
            className="text-sm font-semibold text-slate-900 truncate"
            title={name}
          >
            {name || item.id}
          </div>
        </div>
        <button
          className="px-2 py-1 text-xs rounded border border-black/10 bg-white hover:bg-slate-50"
          onClick={onSelect}
          title="Zaznacz"
        >
          Zaznacz
        </button>
      </div>

      <div className="text-[11px] text-slate-600">
        x:{frame.x.toFixed(1)} y:{frame.y.toFixed(1)} w:{frame.w.toFixed(1)} h:
        {frame.h.toFixed(1)}
      </div>

      <div className="text-[11px] text-red-700">
        {over.top > 0 && (
          <span className="mr-2">↑ {over.top.toFixed(1)}mm</span>
        )}
        {over.right > 0 && (
          <span className="mr-2">→ {over.right.toFixed(1)}mm</span>
        )}
        {over.bottom > 0 && (
          <span className="mr-2">↓ {over.bottom.toFixed(1)}mm</span>
        )}
        {over.left > 0 && (
          <span className="mr-2">← {over.left.toFixed(1)}mm</span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          className="px-2 py-1 text-xs rounded border border-blue-600 text-blue-700 bg-blue-50 hover:bg-blue-100"
          onClick={onJump}
        >
          Skocz
        </button>
        <button
          className="px-2 py-1 text-xs rounded border border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          onClick={onMoveInside}
        >
          Przenieś na stronę
        </button>
        <button
          className="px-2 py-1 text-xs rounded border border-amber-600 text-amber-700 bg-amber-50 hover:bg-amber-100"
          onClick={onFitWidth}
        >
          Dopasuj szerokość
        </button>
      </div>
    </div>
  );
}

export default function OverflowTray({
  doc,
  updateNode,
  setSelectedId,
  onJumpToMm = () => {},
  margin = 0,
}) {
  const list = useMemo(() => getOverflowList(doc, margin), [doc, margin]);
  const pageW = doc?.page?.widthMm ?? A4.widthMm;
  const pageH = doc?.page?.heightMm ?? A4.heightMm;

  if (!list.length) {
    return (
      <div className="p-2 rounded-lg border border-black/10 bg-white text-sm text-slate-600">
        Brak elementów poza obszarem A4.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {list.map((it) => (
        <Item
          key={it.id}
          item={it}
          onSelect={() => setSelectedId(it.id)}
          onJump={() => onJumpToMm(Math.max(0, it.frame.y - 10))}
          onMoveInside={() => {
            const next = clampFrameIntoPage(it.frame, pageW, pageH - 1, margin);
            updateNode(it.id, { frame: next });
            setSelectedId(it.id);
          }}
          onFitWidth={() => {
            const next = fitWidthIntoPage(it.frame, pageW, margin);
            updateNode(it.id, { frame: next });
            setSelectedId(it.id);
          }}
        />
      ))}
    </div>
  );
}

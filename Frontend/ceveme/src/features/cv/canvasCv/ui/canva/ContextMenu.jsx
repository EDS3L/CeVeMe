import React from "react";

export default function ContextMenu({
  x,
  y,
  onClose,
  onAddText,
  onAddRect,
  onAddImage,
  onAddIcon,
  onFitToScreen,
  onUndo,
  onRedo,
  onDelete,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  canUndo,
  canRedo,
  hasSelection,
}) {
  const handleClick = (action) => {
    action?.();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      <div
        className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-black/10 py-1 min-w-[200px]"
        style={{ left: x, top: y }}
      >
        <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Dodaj element
        </div>
        <button
          onClick={() => handleClick(onAddText)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
        >
          <span>📝</span> Tekst
        </button>
        <button
          onClick={() => handleClick(onAddRect)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
        >
          <span>⬜</span> Prostokąt
        </button>
        <button
          onClick={() => handleClick(onAddImage)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
        >
          <span>🖼️</span> Obrazek
        </button>
        <button
          onClick={() => handleClick(onAddIcon)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
        >
          <span>⭐</span> Ikona
        </button>

        <div className="h-px bg-black/10 my-1" />

        <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Widok
        </div>
        <button
          onClick={() => handleClick(onFitToScreen)}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
        >
          <span>🔍</span> Dopasuj do ekranu
        </button>

        <div className="h-px bg-black/10 my-1" />

        <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Edycja
        </div>
        <button
          onClick={() => handleClick(onUndo)}
          disabled={!canUndo}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>↩️</span> Cofnij
          <span className="ml-auto text-xs text-slate-400">Ctrl+Z</span>
        </button>
        <button
          onClick={() => handleClick(onRedo)}
          disabled={!canRedo}
          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>↪️</span> Ponów
          <span className="ml-auto text-xs text-slate-400">Ctrl+Y</span>
        </button>

        {hasSelection && (
          <>
            <div className="h-px bg-black/10 my-1" />
            
            <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Warstwy
            </div>
            <button
              onClick={() => handleClick(onBringToFront)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
            >
              <span>⬆️</span> Na wierzch
              <span className="ml-auto text-xs text-slate-400">Ctrl+]</span>
            </button>
            <button
              onClick={() => handleClick(onSendToBack)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
            >
              <span>⬇️</span> Pod spód
              <span className="ml-auto text-xs text-slate-400">Ctrl+[</span>
            </button>
            <button
              onClick={() => handleClick(onBringForward)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
            >
              <span>↑</span> Warstwa wyżej
            </button>
            <button
              onClick={() => handleClick(onSendBackward)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2"
            >
              <span>↓</span> Warstwa niżej
            </button>

            <div className="h-px bg-black/10 my-1" />
            <button
              onClick={() => handleClick(onDelete)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <span>🗑️</span> Usuń zaznaczone
              <span className="ml-auto text-xs text-red-400">Del</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

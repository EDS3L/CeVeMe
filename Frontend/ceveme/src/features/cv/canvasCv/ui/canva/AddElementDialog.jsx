import React from 'react';

export default function AddElementDialog({
  open,
  onClose,
  onAddText,
  onAddImage,
  onAddRect,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 animate-[fadeIn_160ms_ease-out_forwards]"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="
          relative w-[380px] max-w-[92vw]
          bg-white rounded-2xl shadow-2xl border border-black/10
          opacity-0 translate-y-3 animate-[popIn_180ms_cubic-bezier(0.2,0.8,0.2,1)_forwards]
        "
      >
        <div className="p-5 border-b border-black/10">
          <div className="text-base font-bold">Dodaj element</div>
          <div className="text-sm text-slate-500">
            Wybierz co chcesz wstawić na stronę
          </div>
        </div>

        <div className="p-3 grid grid-cols-3 gap-3">
          {/* Karta: Tekst */}
          <button
            onClick={() => {
              onAddText?.();
              onClose?.();
            }}
            className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                       p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
              {/* Ikona „T” */}
              <span className="text-lg font-black tracking-wide group-hover:text-blue-600">
                T
              </span>
            </div>
            <div className="font-semibold">Tekst</div>
            <div className="text-xs text-slate-500">
              Nagłówek, akapit, opisy
            </div>
          </button>

          {/* Karta: Obraz */}
          <button
            onClick={() => {
              onAddImage?.();
              onClose?.();
            }}
            className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                       p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
              {/* Ikona obrazka */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 group-hover:text-blue-600"
              >
                <path
                  fill="currentColor"
                  d="M4 5h16v14H4zM7 9a2 2 0 104 0 2 2 0 00-4 0zm11 7l-4.5-6L9 15l-2-2-3 4h14z"
                />
              </svg>
            </div>
            <div className="font-semibold">Obraz</div>
            <div className="text-xs text-slate-500">Zdjęcia, grafiki</div>
          </button>

          {/* Karta: Prostokąt */}
          <button
            onClick={() => {
              onAddRect?.();
              onClose?.();
            }}
            className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                       p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
              {/* Ikona prostokąta */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 group-hover:text-blue-600"
              >
                <rect
                  x="4"
                  y="6"
                  width="16"
                  height="12"
                  rx="2"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="font-semibold">Prostokąt</div>
            <div className="text-xs text-slate-500">Tła, akcenty, ramki</div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="m-4 mt-0 mb-4 ml-auto block px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50"
        >
          Zamknij
        </button>
      </div>

      {/* Animacje (Tailwind + custom keyframes) */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

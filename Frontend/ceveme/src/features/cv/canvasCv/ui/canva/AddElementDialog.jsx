import React, { useState, useEffect } from "react";
import { CV_ICONS } from "../../core/model";

export default function AddElementDialog({
  open,
  onClose,
  onAddText,
  onAddImage,
  onAddRect,
  onAddIcon,
  initialShowIconPicker = false, 
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (open) {
      setShowIconPicker(initialShowIconPicker);
    }
  }, [open, initialShowIconPicker]);

  if (!open) return null;

  const iconList = Object.entries(CV_ICONS);

  const handleClose = () => {
    setShowIconPicker(false);
    onClose?.();
  };

  const handleAddIcon = (iconKey) => {
    onAddIcon?.(iconKey);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 animate-[fadeIn_160ms_ease-out_forwards]"
        onClick={handleClose}
      />
      {/* Panel */}
      <div
        className="
          relative w-[460px] max-w-[92vw]
          bg-white rounded-2xl shadow-2xl border border-black/10
          opacity-0 translate-y-3 animate-[popIn_180ms_cubic-bezier(0.2,0.8,0.2,1)_forwards]
        "
      >
        <div className="p-5 border-b border-black/10">
          <div className="text-base font-bold">
            {showIconPicker ? "Wybierz ikonę" : "Dodaj element"}
          </div>
          <div className="text-sm text-slate-500">
            {showIconPicker
              ? "Kliknij ikonę, aby dodać ją do CV"
              : "Wybierz co chcesz wstawić na stronę"}
          </div>
        </div>

        {!showIconPicker ? (
          <>
            <div className="p-3 grid grid-cols-4 gap-3">
              {/* Karta: Tekst */}
              <button
                onClick={() => {
                  onAddText?.();
                  handleClose();
                }}
                className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                           p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
                  <span className="text-lg font-black tracking-wide group-hover:text-blue-600">
                    T
                  </span>
                </div>
                <div className="font-semibold text-sm">Tekst</div>
                <div className="text-xs text-slate-500">Nagłówek, akapit</div>
              </button>

              {/* Karta: Obraz */}
              <button
                onClick={() => {
                  onAddImage?.();
                  handleClose();
                }}
                className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                           p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
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
                <div className="font-semibold text-sm">Obraz</div>
                <div className="text-xs text-slate-500">Zdjęcia, grafiki</div>
              </button>

              {/* Karta: Prostokąt */}
              <button
                onClick={() => {
                  onAddRect?.();
                  handleClose();
                }}
                className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                           p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
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
                <div className="font-semibold text-sm">Prostokąt</div>
                <div className="text-xs text-slate-500">Tła, ramki</div>
              </button>

              {/* Karta: Ikona */}
              <button
                onClick={() => setShowIconPicker(true)}
                className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                           p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center mb-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="font-semibold text-sm">Ikona</div>
                <div className="text-xs text-slate-500">Tel, mail, link</div>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="m-4 mt-0 mb-4 ml-auto block px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50"
            >
              Zamknij
            </button>
          </>
        ) : (
          <>
            {/* Icon Picker Grid */}
            <div className="p-4 grid grid-cols-5 gap-3">
              {iconList.map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => handleAddIcon(key)}
                  className="group rounded-xl border border-black/10 hover:border-blue-500 hover:shadow-md transition
                             p-3 flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={icon.name}
                >
                  <svg
                    viewBox={icon.viewBox}
                    className="w-6 h-6 text-slate-700 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={icon.path} />
                  </svg>
                  <div className="text-xs mt-1 text-slate-600 truncate max-w-full">
                    {icon.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 p-4 pt-0">
              <button
                onClick={() => setShowIconPicker(false)}
                className="px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50"
              >
                ← Wstecz
              </button>
              <button
                onClick={handleClose}
                className="ml-auto px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50"
              >
                Zamknij
              </button>
            </div>
          </>
        )}
      </div>

      {/* Animacje (Tailwind + custom keyframes) */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

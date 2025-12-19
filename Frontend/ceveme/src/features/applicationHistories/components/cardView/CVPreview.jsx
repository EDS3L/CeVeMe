import React, { useEffect } from 'react';
import { FileText, X } from 'lucide-react';

export default function CVPreview({ cvFile, expanded, onExpand }) {
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [expanded]);

  return (
    <>
      <button
        type="button"
        className={`relative flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 shadow-sm transition-all duration-300
          ${
            expanded
              ? 'hidden'
              : 'w-20 h-24 hover:shadow-md hover:scale-105 transform cursor-pointer'
          }`}
        onClick={() => onExpand(true)}
        aria-label="Otwórz podgląd CV"
      >
        <FileText size={36} className="text-indigo-400" />
        <span className="sr-only">Podgląd CV</span>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 p-4 md:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => onExpand(false)}
            aria-label="Zamknij podgląd"
          />
          <div className="relative w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <iframe
              src={cvFile}
              title="Podgląd CV"
              className="w-full h-full border-none"
              aria-live="polite"
            />
            <button
              className="absolute top-3 right-3 bg-slate-800/60 text-white hover:bg-slate-700/80 rounded-full shadow-lg p-2 z-20 transition-colors duration-200"
              onClick={() => onExpand(false)}
              aria-label="Zamknij podgląd CV"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

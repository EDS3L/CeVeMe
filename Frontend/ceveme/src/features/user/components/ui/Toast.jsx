import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ type = 'info', message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const cls =
    type === 'success'
      ? 'bg-manilla text-slatedark'
      : type === 'error'
      ? 'bg-feedbackerror text-basewhite'
      : 'bg-kraft text-slatedark';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 ${cls}`}
    >
      {type === 'success' ? (
        <CheckCircle2 size={20} strokeWidth={2} />
      ) : type === 'error' ? (
        <AlertCircle size={20} strokeWidth={2} />
      ) : (
        <span
          className="inline-block w-2 h-2 rounded-full bg-slatedark"
          aria-hidden
        />
      )}
      <span className="text-sm">{message}</span>
      <button
        className="ml-2 p-1 rounded hover:opacity-80"
        aria-label="Zamknij powiadomienie"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}

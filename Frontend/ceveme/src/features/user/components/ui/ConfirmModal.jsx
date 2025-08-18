import React from 'react';
import { X, Trash2 } from 'lucide-react';

export default function ConfirmModal({
  open,
  title,
  desc,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-baseblack/40" onClick={onCancel} />
      <div className="relative bg-basewhite text-slatedark rounded-2xl shadow-xl w-[92%] max-w-md p-5 border border-cloudlight">
        <div className="flex items-start justify-between">
          <h2 id="confirm-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            className="p-1 rounded hover:bg-ivorymedium/60"
            onClick={onCancel}
            aria-label="Zamknij"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <p id="confirm-desc" className="text-sm text-clouddark mt-2">
          {desc}
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 border border-cloudlight rounded-xl px-4 py-2 hover:bg-ivorymedium/60"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-feedbackerror text-basewhite hover:opacity-90"
          >
            <Trash2 size={18} strokeWidth={2} /> Usuń
          </button>
        </div>
      </div>
    </div>
  );
}

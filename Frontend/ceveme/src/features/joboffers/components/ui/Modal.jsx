import React, { useEffect } from 'react';

export default function Modal({
  open,
  onClose,
  children,
  widthClass = 'w-[min(94vw,1000px)]',
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-slatedark/70" onClick={onClose} />
      <div className="relative flex min-h-full items-start justify-center p-4">
        <div
          className={`relative ${widthClass} bg-ivorylight rounded-2xl border border-basewhite/50 shadow-2xl overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

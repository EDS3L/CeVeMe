import React, { useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import TemplateCard from './TemplateCard';

const TemplateModal = ({ isOpen, onClose, templates, onSelectTemplate }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      setTimeout(() => closeButtonRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => triggerRef.current?.focus(), 30);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleEscape]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleSelect = useCallback(
    (t) => {
      onSelectTemplate(t);
      onClose();
    },
    [onSelectTemplate, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-slatedark)]/70 backdrop-blur-sm p-3 md:p-4 animate-[fadeIn_200ms_ease-out]"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-[var(--color-ivorylight)] w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col animate-[scaleIn_200ms_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[var(--color-cloudlight)]">
          <h2
            id="modal-title"
            className="text-xl md:text-2xl font-bold text-[var(--color-slatedark)]"
          >
            Wybierz format CV
          </h2>
          <button
            ref={closeButtonRef}
            className="p-2 rounded-lg hover:bg-[var(--color-ivorydark)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)]"
            onClick={onClose}
            aria-label="Zamknij modal"
          >
            <X size={22} className="text-[var(--color-clouddark)]" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr items-stretch">
            {templates.map((t) => (
              <TemplateCard key={t.key} template={t} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      </div>

      {/* Animacje + preferencje ruchu */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
};

export default TemplateModal;

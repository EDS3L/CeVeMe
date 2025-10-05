import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export default function GenerateCvModal({
  open,
  onClose,
  email,
  onGenerateFromLink,
}) {
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    const onClick = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose?.();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  const handleGenerate = async () => {
    if (!link || busy) return;
    try {
      setBusy(true);
      await onGenerateFromLink?.(link.trim());
      onClose?.();
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Tło */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border"
        style={{
          background: 'var(--color-ivorylight)',
          borderColor: 'var(--color-cloudlight)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'var(--color-ivorymedium)' }}
        >
          <div
            className="text-lg font-bold"
            style={{ color: 'var(--color-slatedark)' }}
          >
            Wygeneruj CV
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm"
            style={{
              color: 'var(--color-slatedark)',
              background: 'var(--color-ivorylight)',
            }}
          >
            Zamknij
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div
            className="p-6 md:border-r"
            style={{ borderColor: 'var(--color-ivorydark)' }}
          >
            <div
              className="text-sm font-semibold uppercase tracking-wide mb-2"
              style={{ color: 'var(--color-clouddark)' }}
            >
              Wygeneruj CV z linku
            </div>

            <p
              className="text-sm mb-4"
              style={{ color: 'var(--color-slatelight)' }}
            >
              Wklej link do oferty pracy. System sprawdzi wymagania z oferty,
              porówna je z Twoim doświadczeniem i umiejętnościami, a następnie
              przygotuje dopasowane CV.
            </p>

            <div
              className="text-xs mb-2"
              style={{ color: 'var(--color-cloudmedium)' }}
            >
              Zalogowany e-mail:{' '}
              <span
                className="font-medium"
                style={{ color: 'var(--color-slatedark)' }}
              >
                {email || '—'}
              </span>
            </div>

            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--color-clouddark)' }}
            >
              Link do oferty pracy
            </label>
            <input
              type="url"
              placeholder="https://... (Pracuj, NoFluff, JustJoin, LinkedIn...)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border outline-none"
              style={{
                background: 'var(--color-basewhite)',
                borderColor: 'var(--color-ivorydark)',
                color: 'var(--color-slatedark)',
              }}
            />

            <button
              onClick={handleGenerate}
              disabled={!link || busy}
              className="mt-4 px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
              style={{
                background: 'var(--color-bookcloth)',
                color: 'var(--color-basewhite)',
                border: `1px solid var(--color-bookcloth)`,
              }}
            >
              {busy ? 'Generowanie…' : 'Generuj z linku'}
            </button>
          </div>

          <div className="p-6">
            <div
              className="text-sm font-semibold uppercase tracking-wide mb-2"
              style={{ color: 'var(--color-clouddark)' }}
            >
              Wygeneruj z oferty pracy
            </div>

            <p
              className="text-sm mb-3"
              style={{ color: 'var(--color-slatelight)' }}
            >
              Wybierz ofertę z naszej strony — mamy zaczytane ogłoszenia z
              najpopularniejszych portali. Nie musisz nic wklejać: system
              dopasuje CV automatycznie.
            </p>

            <div
              className="text-xs mb-3"
              style={{ color: 'var(--color-cloudmedium)' }}
            >
              Ten link zostanie zapisany i użyty później przy opcji „Generuj i
              zapisz” (historia aplikacji).
            </div>

            <Link to="/offers">
              <button
                className="px-4 py-2 rounded-lg font-semibold bg-kraft hover:opacity-90"
                style={{
                  background: 'var(--color-kraft)',
                  color: 'var(--color-basewhite)',
                  border: `1px solid var(--color-kraft)`,
                }}
              >
                Wybierz ofertę z listy
              </button>
            </Link>

            <div
              className="mt-6 text-xs"
              style={{ color: 'var(--color-cloudmedium)' }}
            ></div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

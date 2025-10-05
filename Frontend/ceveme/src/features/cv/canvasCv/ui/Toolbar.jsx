import React, { useState } from 'react';
import { exportDocumentToPdf, openPdfPrint } from '../services/exportVector';
import AddElementDialog from './canva/AddElementDialog';
import SaveMenu from './canva/SaveMenu';

const IconUndo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M7 7l-4 4 4 4V12h6a4 4 0 014 4v1h2v-1a6 6 0 00-6-6H7V7z"
    />
  </svg>
);
const IconRedo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M17 7v4h-6a6 6 0 00-6 6v1h2v-1a4 4 0 014-4h6v4l4-4-4-4z"
    />
  </svg>
);

export default function Toolbar({
  doc,
  addText,
  addImage,
  addRect,
  undo,
  redo,
  canUndo,
  canRedo,
  loading = false,
  showGrid = false,
  onToggleGrid = () => {},
  overflowPeek = false,
  onToggleOverflowPeek = () => {},
  overflowMm = 0,
  onGenerateAndSave,
  onOpenGenerateModal,
}) {
  const [addOpen, setAddOpen] = useState(false);

  const onAddImage = async () => {
    if (loading) return;
    const url = prompt('URL obrazka:');
    if (url) addImage(url);
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center gap-2 p-2 bg-white border-b border-black/10 overflow-x-auto">
        {/* LEWA GRUPA */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={loading}
            onClick={() => setAddOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
          >
            Dodaj
          </button>

          <div className="w-px h-7 bg-black/10" />

          <button
            disabled={!canUndo || loading}
            onClick={undo}
            className="px-2 py-2 rounded-lg border border-black/15 bg-white hover:bg-slate-50 disabled:opacity-60"
          >
            <IconUndo />
          </button>
          <button
            disabled={!canRedo || loading}
            onClick={redo}
            className="px-2 py-2 rounded-lg border border-black/15 bg-white hover:bg-slate-50 disabled:opacity-60"
          >
            <IconRedo />
          </button>

          <div className="w-px h-7 bg-black/10" />

          <button
            disabled={loading}
            onClick={onToggleGrid}
            className="px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50"
          >
            {showGrid ? 'Ukryj siatkę' : 'Pokaż siatkę'}
          </button>

          <button
            disabled={loading}
            onClick={onToggleOverflowPeek}
            className="px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50"
          >
            {overflowPeek
              ? 'Wyłącz podgląd przepełnienia'
              : 'Podgląd przepełnienia'}
          </button>

          {overflowMm > 0 && (
            <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-xs">
              Wystaje: +{overflowMm.toFixed(1)} mm
            </span>
          )}
        </div>

        {/* PRAWA GRUPA */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="px-3 py-2 rounded-lg text-white font-semibold border disabled:opacity-60"
            style={{
              background: 'var(--color-bookcloth)',
              borderColor: 'var(--color-bookcloth)',
            }}
            disabled={loading}
            onClick={onOpenGenerateModal}
          >
            {loading ? 'Pracuję…' : 'Wygeneruj CV'}
          </button>

          <SaveMenu
            disabled={loading}
            onGeneratePdf={() => exportDocumentToPdf(doc, 'CV.pdf')}
            onGenerateAndSave={onGenerateAndSave}
            onPrint={() => openPdfPrint(doc)}
          />
        </div>
      </div>

      <AddElementDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAddText={addText}
        onAddImage={onAddImage}
        onAddRect={addRect}
      />
    </>
  );
}

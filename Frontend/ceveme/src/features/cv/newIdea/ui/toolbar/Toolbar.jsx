import React from 'react';
import { exportPageToPdf, printPage } from '../../services/export';

const BTN =
  'px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed';
const BTN_PRIMARY =
  'px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold border border-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed';

export default function Toolbar({
  addText,
  addImage,
  addRect,
  undo,
  redo,
  canUndo,
  canRedo,
  save,
  load,
  pageRef,
  onGenerate,
  loading = false,
  showGrid = false,
  onToggleGrid = () => {},
}) {
  const onAddImage = async () => {
    if (loading) return;
    const url = prompt('URL obrazka:');
    if (url) addImage(url);
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-2 bg-white border-b border-black/10 overflow-x-auto">
      <div className="flex flex-wrap items-center gap-2">
        <button disabled={loading} onClick={addText} className={BTN}>
          + Tekst
        </button>
        <button disabled={loading} onClick={onAddImage} className={BTN}>
          + Obraz
        </button>
        <button disabled={loading} onClick={addRect} className={BTN}>
          + Prostokąt
        </button>
        <div className="w-px h-7 bg-black/10" />
        <button disabled={!canUndo || loading} onClick={undo} className={BTN}>
          Cofnij
        </button>
        <button disabled={!canRedo || loading} onClick={redo} className={BTN}>
          Ponów
        </button>
        <div className="w-px h-7 bg-black/10" />
        <button
          disabled={loading}
          onClick={() =>
            save() && alert('Zapisano do przeglądarki (localStorage)')
          }
          className={BTN}
        >
          Zapisz
        </button>
        <button
          disabled={loading}
          onClick={() => !load() && alert('Brak zapisu do wczytania')}
          className={BTN}
        >
          Wczytaj
        </button>
        <div className="w-px h-7 bg-black/10" />
        <button
          disabled={loading}
          onClick={() => exportPageToPdf(pageRef?.current, 'CV.pdf')}
          className={BTN}
        >
          Eksport PDF
        </button>
        <button
          disabled={loading}
          onClick={() => printPage(pageRef?.current)}
          className={BTN}
        >
          Drukuj
        </button>
        <div className="w-px h-7 bg-black/10" />
        <button disabled={loading} onClick={onToggleGrid} className={BTN}>
          {showGrid ? 'Ukryj siatkę' : 'Pokaż siatkę'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={BTN_PRIMARY}
          disabled={loading}
          onClick={() => typeof onGenerate === 'function' && onGenerate()}
        >
          {loading ? 'Generowanie...' : 'AI z linku'}
        </button>
      </div>
    </div>
  );
}

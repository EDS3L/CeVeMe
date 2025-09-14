import React from 'react';
import { exportPageToPdf, printPage } from '../../services/export';

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
    <div className="toolbar">
      <div className="toolbar-left">
        <button disabled={loading} onClick={addText}>
          + Tekst
        </button>
        <button disabled={loading} onClick={onAddImage}>
          + Obraz
        </button>
        <button disabled={loading} onClick={addRect}>
          + Prostokąt
        </button>
        <div className="separator" />
        <button disabled={!canUndo || loading} onClick={undo}>
          Cofnij
        </button>
        <button disabled={!canRedo || loading} onClick={redo}>
          Ponów
        </button>
        <div className="separator" />
        <button
          disabled={loading}
          onClick={() =>
            save() && alert('Zapisano do przeglądarki (localStorage)')
          }
        >
          Zapisz
        </button>
        <button
          disabled={loading}
          onClick={() => !load() && alert('Brak zapisu do wczytania')}
        >
          Wczytaj
        </button>
        <div className="separator" />
        <button
          disabled={loading}
          onClick={() => exportPageToPdf(pageRef?.current, 'CV.pdf')}
        >
          Eksport PDF
        </button>
        <button disabled={loading} onClick={() => printPage(pageRef?.current)}>
          Drukuj
        </button>
        <div className="separator" />
        <button disabled={loading} onClick={onToggleGrid}>
          {showGrid ? 'Ukryj siatkę' : 'Pokaż siatkę'}
        </button>
      </div>

      <div className="toolbar-right">
        <button
          className="primary"
          disabled={loading}
          onClick={() => typeof onGenerate === 'function' && onGenerate()}
        >
          {loading ? 'Generowanie...' : 'AI z linku'}
        </button>
      </div>
    </div>
  );
}

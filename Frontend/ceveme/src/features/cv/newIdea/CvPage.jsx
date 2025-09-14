import React, { useMemo, useRef, useCallback, useState } from 'react';
import useEngine from './hooks/useEngine';
import Canvas from './ui/canva/Canvas';
import InspectorPanel from './ui/sidebar/InspectorPanel';
import LayersPanel from './ui/sidebar/LayersPanel';
import TemplatesPanel from './ui/sidebar/TemplatesPanel';
import Toolbar from './ui/toolbar/Toolbar';
import { TEMPLATES } from './services/templates';
import ApiService from '../hooks/Gemini';
import { buildDocFromAI } from './services/aiToDoc';
import './style.css';
import Navbar from '../../../components/Navbar';

function isOurDocSchema(x) {
  return x && typeof x === 'object' && x.page && Array.isArray(x.nodes);
}

export default function App() {
  const initial = useMemo(() => TEMPLATES[0].build(), []);
  const engine = useEngine(initial);
  const {
    doc,
    setDocument,
    selectedId,
    setSelectedId,
    addText,
    addImage,
    addRect,
    updateNode,
    removeNode,
    reorder,
    undo,
    redo,
    canUndo,
    canRedo,
    save,
    load,
  } = engine;

  const pageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const handleGenerate = useCallback(async () => {
    const email = window.prompt('Email do CV:') || '';
    const link = window.prompt('Link (LinkedIn/portfolio):') || '';
    if (!email || !link) return;

    try {
      setLoading(true);
      const data = await ApiService.generateCv(email, link);
      const nextDoc = isOurDocSchema(data) ? data : buildDocFromAI(data);
      setDocument(nextDoc);
    } catch (e) {
      console.error('Nie udało się wygenerować CV:', e);
      alert('Nie udało się wygenerować CV (szczegóły w konsoli).');
    } finally {
      setLoading(false);
    }
  }, [setDocument]);

  const selectedNode = doc.nodes.find((n) => n.id === selectedId) || null;

  return (
    <div className="app">
      <Navbar />
      <Toolbar
        addText={addText}
        addImage={addImage}
        addRect={addRect}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        save={save}
        load={load}
        pageRef={pageRef}
        onGenerate={handleGenerate}
        loading={loading}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
      />

      <div className="layout">
        {/* Sidebar left */}
        <aside className="sidebar">
          <TemplatesPanel setDocument={setDocument} />
          <div className="separator-row" />
          <LayersPanel
            nodes={doc.nodes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            reorder={reorder}
            updateNode={updateNode}
          />
        </aside>

        {/* Canvas center */}
        <main className="canvas-area">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner" />
              <div>Generowanie CV...</div>
            </div>
          )}
          <Canvas
            doc={doc}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateNode={updateNode}
            pageRef={pageRef}
            showGrid={showGrid}
          />
        </main>

        {/* Inspector right */}
        <aside className="inspector">
          <InspectorPanel
            node={selectedNode}
            updateNode={updateNode}
            removeNode={removeNode}
          />
        </aside>
      </div>
    </div>
  );
}

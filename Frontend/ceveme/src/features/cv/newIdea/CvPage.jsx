import React, { useMemo, useRef, useCallback, useState } from 'react';
import useEngine from './hooks/useEngine';
import Canvas from './ui/canva/Canvas';
import InspectorPanel from './ui/sidebar/InspectorPanel';
import LayersPanel from './ui/sidebar/LayersPanel';
import Toolbar from './ui/toolbar/Toolbar';
import { TEMPLATES } from './services/templates';
import ApiService from '../hooks/Gemini';
import Navbar from '../../../components/Navbar';
import { buildSimpleCV } from './templates/SimpleCvTemplte';
import { buildDocFromAI } from './templates/aiToDoc';
import TemplatesPanel from './ui/sidebar/TemplatePanel';

import OverflowTray from './ui/sidebar/OverflowTray';
import MiniMap from './ui/canva/MiniMap';
import { extraBottomMm } from './utils/overflow';

function isOurDocSchema(x) {
  return x && typeof x === 'object' && x.page && Array.isArray(x.nodes);
}

function readCvData() {
  try {
    const raw = localStorage.getItem('JSON_CV_DATA');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const initial = useMemo(() => {
    const cv = readCvData() || {};
    const first = TEMPLATES[0];
    if (first && typeof first.build === 'function') return first.build(cv);
    return buildSimpleCV(cv);
  }, []);
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
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [cvData, setCvData] = useState(() => readCvData());

  const [overflowPeek, setOverflowPeek] = useState(false);
  const [metrics, setMetrics] = useState({ scale: 1, pxPerMm: 3.7795 });

  const cvTemplates = useMemo(
    () => [
      { key: 'classic-ai', title: 'Classic', func: buildDocFromAI },
      { key: 'sidebar-simple', title: 'Sidebar', func: buildSimpleCV },
    ],
    []
  );

  const handleGenerate = useCallback(async () => {
    const email = window.prompt('Email do CV:') || '';
    const link = window.prompt('Link (LinkedIn/portfolio):') || '';
    if (!email || !link) return;

    try {
      setLoading(true);
      const data = await ApiService.generateCv(email, link);
      const baseDoc = isOurDocSchema(data) ? data : buildSimpleCV(data);
      setDocument(baseDoc);
      localStorage.setItem('JSON_CV_DATA', JSON.stringify(data));
      setCvData(data);
    } catch (e) {
      console.error('Nie udało się wygenerować CV:', e);
      alert('Nie udało się wygenerować CV (szczegóły w konsoli).');
    } finally {
      setLoading(false);
    }
  }, [setDocument]);

  const selectedNode = doc.nodes.find((n) => n.id === selectedId) || null;

  const jumpToMm = useCallback(
    (yMm) => {
      const cont = scrollRef.current;
      const page = pageRef.current;
      if (!cont || !page) return;
      const yPx = yMm * metrics.pxPerMm * metrics.scale;
      const pageTop = page.offsetTop || 0;
      cont.scrollTo({ top: pageTop + yPx - 40, behavior: 'smooth' });
    },
    [metrics]
  );

  const overflowMm = useMemo(() => extraBottomMm(doc), [doc]);

  return (
    <div className="flex flex-col min-h-full">
      <Navbar showShadow={true} />

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
        overflowPeek={overflowPeek}
        onToggleOverflowPeek={() => setOverflowPeek((v) => !v)}
        overflowMm={overflowMm}
      />

      <div
        className="
          grid gap-3 p-3
          [grid-template-columns:280px_1fr_320px]
          max-[1400px]:[grid-template-columns:240px_1fr_280px]
          max-[1200px]:[grid-template-columns:240px_1fr]
          max-[1200px]:[grid-template-areas:'sidebar_canvas''inspector_inspector']
          max-[900px]:grid-cols-1
          max-[900px]:[grid-template-areas:'canvas''sidebar''inspector']
        "
      >
        {/* Sidebar left */}
        <aside className="bg-white border  border-black/10 rounded-xl p-3 min-h-[200px] [grid-area:unset] max-[1200px]:[grid-area:sidebar]">
          {cvTemplates.map((tpl) => (
            <TemplatesPanel
              key={tpl.key}
              setDocument={setDocument}
              data={cvData}
              func={tpl.func}
              title={tpl.title}
            />
          ))}

          <div className="mb-2 h-5 font-bold">Poza stroną</div>
          <OverflowTray
            doc={doc}
            updateNode={updateNode}
            setSelectedId={setSelectedId}
            onJumpToMm={jumpToMm}
          />

          <div className="h-px w-full bg-black/10 my-2" />

          <MiniMap doc={doc} onJumpToMm={jumpToMm} />

          <div className="h-px w-full bg-black/10 my-2" />
          <LayersPanel
            nodes={doc.nodes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            reorder={reorder}
            updateNode={updateNode}
          />

          <div className="h-px w-full bg-black/10 my-2" />
        </aside>

        {/* Canvas center */}
        <main
          ref={scrollRef}
          className="relative bg-slate-50 border p-3 border-black/20 rounded-xl w-full h-full md:min-h-[50vh] md:max-h-[1200px] overflow-auto flex  items-center justify-center [grid-area:unset] max-[1200px]:[grid-area:canvas]"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/75 z-20 flex flex-col items-center justify-center gap-2 font-bold text-slate-800">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
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
            overflowPeek={overflowPeek}
            onMetricsChange={setMetrics}
          />
        </main>

        {/* Inspector right */}
        <aside className="bg-white border border-black/10 rounded-xl p-3 min-h-[200px] [grid-area:unset] max-[1200px]:[grid-area:inspector]">
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

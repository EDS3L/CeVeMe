import React, { useState, useRef, useCallback, useMemo } from 'react';

import TemplateModal from './ui/sidebar/templateChooser/TemplateModal';
import TemplateSelectButton from './ui/sidebar/templateChooser/TemplateSelectButton';

import useEngine from './hooks/useEngine';
import Canvas from './ui/canva/Canvas';
import InspectorPanel from './ui/sidebar/InspectorPanel';
import LayersPanel from './ui/sidebar/LayersPanel';
import Toolbar from './ui/Toolbar';
import { TEMPLATES } from './services/templates';
import ApiService from '../generativeCv/hooks/Gemini';
import Navbar from '../../../components/Navbar';

import OverflowTray from './ui/sidebar/OverflowTray';
import MiniMap from './ui/canva/MiniMap';
import { extraBottomMm } from './utils/overflow';

import { buildBlackAndWhiteCV } from './templates/BlackAndWhite';
import { buildWhiteMinimalistCompactCV } from './templates/WhiteMinimalistNodes';
import { buildDocFromAI } from './templates/SideBarTemplate';
import { buildGrayAndWhite } from './templates/GrayAndWhiteSimple';

import { generatePdfBlob } from './services/exportVector';

import { useCvSave } from '../generativeCv/pages/hooks/useCvSave';

import useAuth from '../../../hooks/useAuth';

import GenerateCvModal from './ui/canva/GenerateCvModal';
import { buildModernTurquoiseCV } from './templates/modernTurquoiseCv';
import { buildWhiteElegantMinimalistCV } from './templates/WhiteElegantMinimalistCV';
import { buildPixelPerfectTealSidebarCV } from './templates/TealSidebarCV';
import { buildBlueCreativeCV } from './templates/BlueCreativeCV';

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
    const first = TEMPLATES?.[0];
    if (first && typeof first.build === 'function') return first.build(cv);
    return buildDocFromAI(cv);
  }, []);

  // Silnik edycji
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
  } = engine;

  const pageRef = useRef(null);
  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [cvData, setCvData] = useState(() => readCvData());

  const [overflowPeek, setOverflowPeek] = useState(false);
  const [metrics, setMetrics] = useState({ scale: 1, pxPerMm: 3.7795 });

  const { email } = useAuth();

  const [offerLink, setOfferLink] = useState(() => {
    try {
      return localStorage.getItem('CV_OFFER_LINK') || '';
    } catch {
      return '';
    }
  });

  // Modal wyboru szablonu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState(null);

  // Modal „Wygeneruj CV”
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const openGenerateModal = useCallback(() => setIsGenModalOpen(true), []);
  const closeGenerateModal = useCallback(() => setIsGenModalOpen(false), []);

  // Lista szablonów (do TemplateModal)
  const cvTemplates = useMemo(
    () => [
      {
        key: 'Menu CV',
        title: 'Panel boczny',
        func: buildDocFromAI,
        description:
          'Nowoczesny układ z bocznym panelem — świetny dla kreatywnych profesji.',
        sections: [
          'Profil',
          'Doświadczenie',
          'Umiejętności',
          'Edukacja',
          'Języki',
        ],
        style: 'Minimalistyczny z wyróżnionym sidebarem',
      },
      {
        key: 'black-and-white',
        title: 'Nowoczesny Biznesowy',
        func: buildBlackAndWhiteCV,
        description:
          'Elegancki czarno-biały design do zastosowań korporacyjnych.',
        sections: ['Header', 'O mnie', 'Kariera', 'Kompetencje', 'Certyfikaty'],
        style: 'Profesjonalny, stonowany, monochromatyczny',
      },
      {
        key: 'gray-and-white',
        title: 'Czysty Klasyczny',
        func: buildGrayAndWhite,
        description:
          'Klasyczny szablon z subtelnymi akcentami szarości, uniwersalny.',
        sections: [
          'Dane kontaktowe',
          'Doświadczenie',
          'Wykształcenie',
          'Umiejętności',
        ],
        style: 'Tradycyjny, czytelny, uniwersalny',
      },
      {
        key: 'White-Minimalist',
        title: 'White Minimalist [BETA]',
        func: buildWhiteMinimalistCompactCV,
        description: 'Ultra-minimalistyczny design ze sporą ilością bieli.',
        sections: ['Intro', 'Experience', 'Skills', 'Education'],
        style: 'Skandynawski minimalizm',
      },
      {
        key: 'modern-turquoise',
        title: 'Turkusowy Dwukolumnowy',
        func: buildModernTurquoiseCV,
        description:
          'Dwukolumnowy szablon z turkusową belką akcentową, białym arkuszem, okrągłym zdjęciem i „chipami” kontaktu.',
        sections: [
          'Nagłówek',
          'Doświadczenie',
          'O mnie',
          'Edukacja',
          'Umiejętności',
          'Referencje',
        ],
        style: 'Kreatywny, świeży, kontrastowy',
      },
      {
        key: 'white-elegant-minimalist',
        title: 'White Elegant Minimalist',
        func: buildWhiteElegantMinimalistCV,
        description:
          'Dwukolumnowy układ na jasnym tle z ciemną belką nagłówka (#555D50), beżowym panelem na zdjęcie i subtelnymi paskami akcentowymi. Wierne 1:1 odwzorowanie oryginalnego PDF.',
        sections: [
          'Nagłówek',
          'Doświadczenie',
          'Edukacja',
          'O mnie',
          'Software',
          'Referencje',
        ],
        style: 'Elegancki, minimalistyczny, wyrafinowany',
      },
      {
        key: 'UrbanLineCV',
        title: 'Urban Line',
        func: buildPixelPerfectTealSidebarCV,
        description:
          'Jednokolumnowy układ na jasnym tle z dużym nagłówkiem (imię + stanowisko) i kontaktami w linii, z subtelnym pionowym akcentem z nazwą miasta po lewej (“W A R S Z A W A”). Sekcje w wersalikach: Podsumowanie, Doświadczenie, Portfolio, Umiejętności, Edukacja, Języki. Layout 1:1 względem oryginału Maks Makowski – Programista Java.',
        sections: [
          'Nagłówek',
          'Podsumowanie',
          'Doświadczenie',
          'Portfolio',
          'Umiejętności',
          'Edukacja',
          'Języki',
        ],
        style: 'Klasyczny, czytelny, jednokolumnowy z pionowym akcentem',
      },
      {
        key: 'NavyDiagonalCV',
        title: 'Navy Diagonal',
        func: buildBlueCreativeCV,
        description:
          'Dwukolumnowy układ: szeroki lewy panel (Doświadczenie, Portfolio, Języki) + węższy prawy sidebar (Kontakt, O mnie, Edukacja, Umiejętności). Charakterystyczny granatowy, ukośny nagłówek z imieniem na środku i podtytułem „PROGRAMISTA JAVA”. Sekcje oddzielone delikatnymi liniami, listy kompetencji w trzech blokach (Technical / Tools & Technologies / Soft Skills). Wierne 1:1 odwzorowanie PDF.',
        sections: [
          'Nagłówek',
          'Doświadczenie',
          'Portfolio',
          'Języki',
          'Kontakt',
          'O mnie',
          'Edukacja',
          'Umiejętności',
        ],
        style: 'Nowoczesny, biznesowy, wyraźny kontrast, dwukolumnowy',
      },
    ],
    []
  );

  // Generowanie CV z linku (z modala) — wykorzystuje e-mail z useAuth
  const handleGenerateFromLink = useCallback(
    async (link) => {
      if (!email || !link) return;
      try {
        setLoading(true);
        setOfferLink(link);

        localStorage.setItem('CV_OFFER_LINK', link);

        const data = await ApiService.generateCv(email, link);
        const baseDoc = isOurDocSchema(data) ? data : '';
        setDocument(baseDoc);
        localStorage.setItem('JSON_CV_DATA', JSON.stringify(data));
        setCvData(data);
      } catch (e) {
        console.error('Nie udało się wygenerować CV:', e);
        alert('Nie udało się wygenerować CV (szczegóły w konsoli).');
      } finally {
        setLoading(false);
      }
    },
    [email, setDocument]
  );

  // (Opcjonalnie) wybór oferty z listy — podłącz swoje UI; tu przykład z alertem
  const handlePickOffer = useCallback(() => {
    // TODO: otwórz picker ofert i po wyborze wywołaj:
    // setOfferLink(wybranyLink); localStorage.setItem('CV_OFFER_LINK', wybranyLink);
    alert('Tu podłącz picker ofert. Po wyborze wywołaj setOfferLink(link).');
  }, []);

  // Zmiana szablonu
  const handleSelectTemplate = useCallback(
    (template) => {
      const newDoc = template.func(cvData);
      setDocument(newDoc);
      setSelectedTemplateName(template.title);
    },
    [cvData, setDocument]
  );

  // Hook zapisu — użyje aktualnego offerLink
  const { savingMode, handleSaveAndHistory } = useCvSave({
    cvData,
    offerLink,
    generatePdfBlob: () => generatePdfBlob(doc),
  });

  // Skok do pozycji (mm) w podglądzie
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

  // Przepełnienie strony (mm)
  const overflowMm = useMemo(() => extraBottomMm(doc), [doc]);

  return (
    <div className="flex flex-col min-h-full">
      <Navbar showShadow={true} />

      <Toolbar
        doc={doc}
        addText={addText}
        addImage={addImage}
        addRect={addRect}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        loading={loading || savingMode === 'uploadAndHistory'}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
        overflowPeek={overflowPeek}
        onToggleOverflowPeek={() => setOverflowPeek((v) => !v)}
        overflowMm={overflowMm}
        // zapis
        onGenerateAndSave={handleSaveAndHistory}
        // otwarcie modala „Wygeneruj CV”
        onOpenGenerateModal={openGenerateModal}
      />

      <div className="grid gap-3 p-3 [grid-template-columns:280px_1fr_320px] max-[1400px]:[grid-template-columns:240px_1fr_280px] max-[1200px]:[grid-template-columns:240px_1fr] max-[1200px]:[grid-template-areas:'sidebar_canvas''inspector_inspector'] max-[900px]:grid-cols-1 max-[900px]:[grid-template-areas:'canvas''sidebar''inspector']">
        {/* Sidebar lewy */}
        <aside className="bg-white border border-black/10 rounded-xl p-3 min-h-[200px] [grid-area:unset] max-[1200px]:[grid-area:sidebar]">
          <div className="mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-clouddark)]">
              Szablon
            </div>
            <TemplateSelectButton
              onClick={() => setIsModalOpen(true)}
              selectedTemplate={selectedTemplateName}
            />
          </div>

          <div className="h-px w-full bg-black/10 my-3" />

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

        {/* Canvas (środek) */}
        <main
          ref={scrollRef}
          className="relative bg-slate-50 border p-3 border-black/20 rounded-xl w-full h-full md:min-h-[50vh] md:max-h-[1200px] overflow-auto flex items-center justify-center [grid-area:unset] max-[1200px]:[grid-area:canvas]"
          aria-busy={loading ? 'true' : 'false'}
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

        {/* Inspector (prawy) */}
        {doc && (
          <aside className="bg-white border border-black/10 rounded-xl p-3 min-h-[200px] [grid-area:unset] max-[1200px]:[grid-area:inspector]">
            <InspectorPanel
              node={doc.nodes.find((n) => n.id === selectedId) || null}
              updateNode={updateNode}
              removeNode={removeNode}
            />
          </aside>
        )}
      </div>

      {/* Modal wyboru szablonu */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templates={cvTemplates}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Modal „Wygeneruj CV” */}
      <GenerateCvModal
        open={isGenModalOpen}
        onClose={closeGenerateModal}
        email={email}
        onGenerateFromLink={handleGenerateFromLink}
        onPickOffer={handlePickOffer}
      />
    </div>
  );
}

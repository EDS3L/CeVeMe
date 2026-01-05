import React, { useRef, useCallback, useMemo, useState } from "react";

import TemplateModal from "./ui/sidebar/templateChooser/TemplateModal";
import TemplateSelectButton from "./ui/sidebar/templateChooser/TemplateSelectButton";

import useEngine from "./hooks/useEngine";
import Canvas from "./ui/canva/Canvas";
import InspectorPanel from "./ui/sidebar/InspectorPanel";
import LayersPanel from "./ui/sidebar/LayersPanel";
import Toolbar from "./ui/Toolbar";
import { TEMPLATES } from "./services/templates";
import ApiService from "../generativeCv/hooks/Gemini";

import OverflowTray from "./ui/sidebar/OverflowTray";
import { extraBottomMm } from "./utils/overflow";

import { buildBlackAndWhiteCV } from "./templates/BlackAndWhite";
import { buildWhiteMinimalistCompactCV } from "./templates/WhiteMinimalistNodes";
import { buildDocFromAI } from "./templates/SidebarTemplate";
import { buildGrayAndWhite } from "./templates/GrayAndWhiteSimple";

import { generatePdfBlob } from "./services/exportVector";

import { useCvSave } from "../generativeCv/pages/hooks/useCvSave";

import useAuth from "../../../hooks/useAuth";

import GenerateCvModal from "./ui/canva/GenerateCvModal";
import InfoModal from "./ui/canva/InfoModal";
import { buildModernTurquoiseCV } from "./templates/modernTurquoiseCv";
import { buildWhiteElegantMinimalistCV } from "./templates/WhiteElegantMinimalistCV";
import { buildPixelPerfectTealSidebarCV } from "./templates/TealSidebarCV";
import { buildBlueCreativeCV } from "./templates/BlueCreativeCV";
import { buildPixelPerfectAttachmentCV } from "./templates/professionalResume";

function readCvData() {
  try {
    const raw = localStorage.getItem("JSON_CV_DATA");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const cvTemplates = useMemo(
    () => [
      {
        key: "Menu CV",
        title: "Panel boczny",
        func: buildDocFromAI,
        description:
          "Nowoczesny układ z bocznym panelem — świetny dla kreatywnych profesji.",
        sections: [
          "Profil",
          "Doświadczenie",
          "Umiejętności",
          "Edukacja",
          "Języki",
        ],
        style: "Minimalistyczny z wyróżnionym sidebarem",
      },
      {
        key: "black-and-white",
        title: "Nowoczesny Biznesowy",
        func: buildBlackAndWhiteCV,
        description:
          "Elegancki czarno-biały design do zastosowań korporacyjnych.",
        sections: ["Header", "O mnie", "Kariera", "Kompetencje", "Certyfikaty"],
        style: "Profesjonalny, stonowany, monochromatyczny",
      },
      {
        key: "gray-and-white",
        title: "Czysty Klasyczny",
        func: buildGrayAndWhite,
        description:
          "Klasyczny szablon z subtelnymi akcentami szarości, uniwersalny.",
        sections: [
          "Dane kontaktowe",
          "Doświadczenie",
          "Wykształcenie",
          "Umiejętności",
        ],
        style: "Tradycyjny, czytelny, uniwersalny",
      },
      {
        key: "white-minimalist",
        title: "White Minimalist",
        func: buildWhiteMinimalistCompactCV,
        description: "Ultra-minimalistyczny design ze sporą ilością bieli.",
        sections: ["Intro", "Experience", "Skills", "Education"],
        style: "Skandynawski minimalizm",
      },
      {
        key: "modern-turquoise",
        title: "Turkusowy Dwukolumnowy",
        func: buildModernTurquoiseCV,
        description:
          "Dwukolumnowy szablon z turkusowa belka akcentowa, bialym arkuszem, okraglym zdjeciem i chipami kontaktu.",
        sections: [
          "Naglowek",
          "Doswiadczenie",
          "O mnie",
          "Edukacja",
          "Umiejetnosci",
          "Referencje",
        ],
        style: "Kreatywny, swiezy, kontrastowy",
      },
      {
        key: "white-elegant-minimalist",
        title: "White Elegant Minimalist",
        func: buildWhiteElegantMinimalistCV,
        description:
          "Dwukolumnowy układ na jasnym tle z ciemną belką nagłówka (#555D50)...",
        sections: [
          "Nagłówek",
          "Doświadczenie",
          "Edukacja",
          "O mnie",
          "Software",
        ],
        style: "Elegancki, profesjonalny, dwukolumnowy",
      },
      {
        key: "teal-sidebar",
        title: "Teal Sidebar CV",
        func: buildPixelPerfectTealSidebarCV,
        description: "Nowoczesny szablon z turkusowym bocznym panelem.",
        sections: ["Sidebar", "Nagłówek", "Doświadczenie", "Edukacja"],
        style: "Nowoczesny z kolorowym sidebar",
      },
      {
        key: "blue-creative",
        title: "Blue Creative CV",
        func: buildBlueCreativeCV,
        description: "Kreatywny szablon z niebieskimi akcentami.",
        sections: [
          "Header",
          "Profil",
          "Doświadczenie",
          "Edukacja",
          "Umiejętności",
        ],
        style: "Kreatywny, nowoczesny, kolorowy",
      },
      {
        key: "professional-resume",
        title: "Professional Resume",
        func: buildPixelPerfectAttachmentCV,
        description: "Profesjonalne CV w klasycznym stylu.",
        sections: ["Header", "Podsumowanie", "Doświadczenie", "Edukacja"],
        style: "Klasyczny, profesjonalny",
      },
    ],
    []
  );

  const initial = useMemo(() => {
    const cv = readCvData() || {};
    const randomIndex = Math.floor(Math.random() * cvTemplates.length);
    const template = cvTemplates[randomIndex];
    if (template && typeof template.func === "function") {
      return template.build ? template.build(cv) : template.func(cv);
    }
    return buildDocFromAI(cv);
  }, [cvTemplates]);

  const engine = useEngine(initial);
  const {
    doc,
    setDocument,
    selectedId,
    setSelectedId,
    addText,
    addImage,
    addRect,
    addIcon,
    updateNode,
    removeNode,
    reorder,
    alignNodes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = engine;

  const pageRef = useRef(null);
  const scrollRef = useRef(null);
  const fitToScreenRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [cvData, setCvData] = useState(() => readCvData());

  const [overflowPeek, setOverflowPeek] = useState(false);
  const [metrics, setMetrics] = useState({ scale: 1, pxPerMm: 3.7795 });

  const [addDialogMode, setAddDialogMode] = useState("closed");

  const openIconPicker = useCallback(() => {
    setAddDialogMode("icons");
  }, []);

  const closeAddDialog = useCallback(() => {
    setAddDialogMode("closed");
  }, []);

  const handleFitToScreenReady = useCallback((fn) => {
    fitToScreenRef.current = fn;
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (fitToScreenRef.current) {
      fitToScreenRef.current(60);
    }
  }, []);

  const { email } = useAuth();

  const [offerLink, setOfferLink] = useState(() => {
    try {
      return localStorage.getItem("CV_OFFER_LINK") || "";
    } catch {
      return "";
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState(null);

  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [isTemplateWarningOpen, setIsTemplateWarningOpen] = useState(false);

  const openGenerateModal = useCallback(() => {
    if (!selectedTemplateName) {
      setIsTemplateWarningOpen(true);
      return;
    }
    setIsGenModalOpen(true);
  }, [selectedTemplateName]);
  const closeGenerateModal = useCallback(() => setIsGenModalOpen(false), []);

  const handleTemplateWarningConfirm = useCallback(() => {
    setIsTemplateWarningOpen(false);
    setIsModalOpen(true);
  }, []);

  const handleGenerateFromLink = useCallback(
    async (link) => {
      if (!email || !link) return;
      try {
        setLoading(true);
        setOfferLink(link);
        localStorage.setItem("CV_OFFER_LINK", link);
        const data = await ApiService.generateCv(email, link);

        localStorage.setItem("JSON_CV_DATA", JSON.stringify(data));
        setCvData(data);

        const selectedTemplate =
          cvTemplates.find((t) => t.title === selectedTemplateName) ||
          cvTemplates[0];

        const newDoc = selectedTemplate.func(data);
        setDocument(newDoc);

        if (!selectedTemplateName) {
          setSelectedTemplateName(selectedTemplate.title);
        }
      } catch (e) {
        console.error("Nie udało się wygenerować CV:", e);
        alert("Nie udało się wygenerować CV (szczegóły w konsoli).");
      } finally {
        setLoading(false);
      }
    },
    [email, setDocument, cvTemplates, selectedTemplateName]
  );

  const handlePickOffer = useCallback(() => {
    alert("Tu podłącz picker ofert. Po wyborze wywołaj setOfferLink(link).");
  }, []);

  const handleSelectTemplate = useCallback(
    (template) => {
      const newDoc = template.func(cvData);
      setDocument(newDoc);
      setSelectedTemplateName(template.title);
    },
    [cvData, setDocument]
  );

  const { savingMode, handleSaveAndHistory } = useCvSave({
    cvData,
    offerLink,
    generatePdfBlob: () => generatePdfBlob(doc),
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [activeGroupIds, setActiveGroupIds] = useState(null);

  const setSelectedIdSync = useCallback(
    (id) => {
      setSelectedId(id);
      setSelectedIds(id ? [id] : []);
      setActiveGroupIds(null);
    },
    [setSelectedId]
  );

  const setSelectedIdOnly = useCallback(
    (id) => {
      setSelectedId(id);
    },
    [setSelectedId]
  );

  const handleGroup = useCallback(() => {
    if (selectedIds.length >= 2) setActiveGroupIds([...selectedIds]);
  }, [selectedIds]);

  const handleUngroup = useCallback(() => setActiveGroupIds(null), []);

  const jumpToMm = useCallback(
    (yMm) => {
      const cont = scrollRef.current;
      const page = pageRef.current;
      if (!cont || !page) return;
      const yPx = yMm * metrics.pxPerMm * metrics.scale;
      const pageTop = page.offsetTop || 0;
      cont.scrollTo({ top: pageTop + yPx - 40, behavior: "smooth" });
    },
    [metrics]
  );

  const overflowMm = useMemo(() => extraBottomMm(doc), [doc]);
  const inspectorSelectedId = selectedIds.length
    ? selectedIds[selectedIds.length - 1]
    : selectedId;

  return (
    <div className="flex flex-col min-h-full">
      <Toolbar
        doc={doc}
        selectedIds={selectedIds}
        selectedId={inspectorSelectedId}
        addText={addText}
        addImage={addImage}
        addRect={addRect}
        addIcon={addIcon}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        loading={loading || savingMode === "uploadAndHistory"}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
        overflowPeek={overflowPeek}
        onToggleOverflowPeek={() => setOverflowPeek((v) => !v)}
        overflowMm={overflowMm}
        onGenerateAndSave={handleSaveAndHistory}
        onOpenGenerateModal={openGenerateModal}
        updateNode={updateNode}
        onFitToScreen={handleFitToScreen}
        alignNodes={alignNodes}
        addDialogMode={addDialogMode}
        onCloseAddDialog={closeAddDialog}
      />

      <div className="grid gap-3 p-3 [grid-template-columns:280px_1fr_320px] max-[1400px]:[grid-template-columns:240px_1fr_280px] max-[1200px]:[grid-template-columns:240px_1fr] max-[1200px]:[grid-template-areas:'sidebar_canvas''inspector_inspector'] max-[900px]:grid-cols-1 max-[900px]:[grid-template-areas:'canvas''sidebar''inspector']">
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
            setSelectedId={setSelectedIdSync}
            onJumpToMm={jumpToMm}
          />

          <div className="h-px w-full bg-black/10 my-2" />

          <LayersPanel
            nodes={doc.nodes}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            activeGroupIds={activeGroupIds}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            reorder={reorder}
            updateNode={updateNode}
          />

          <div className="h-px w-full bg-black/10 my-2" />
        </aside>

        <main
          ref={scrollRef}
          className="relative bg-slate-50 border p-3 border-black/20 rounded-xl w-full h-full md:min-h-[50vh] md:max-h-[1200px] overflow-auto flex items-center justify-center [grid-area:unset] max-[1200px]:[grid-area:canvas]"
          aria-busy={loading ? "true" : "false"}
        >
          {loading && (
            <div className="absolute inset-0 bg-white/75 z-20 flex flex-col items-center justify-center gap-2 font-bold text-slate-800">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              <div>Generowanie CV...</div>
            </div>
          )}
          <Canvas
            doc={doc}
            selectedIds={selectedIds}
            setDocument={setDocument}
            setSelectedIds={setSelectedIds}
            activeGroupIds={activeGroupIds}
            setActiveGroupIds={setActiveGroupIds}
            setSelectedId={setSelectedIdOnly}
            updateNode={updateNode}
            removeNode={removeNode}
            pageRef={pageRef}
            showGrid={showGrid}
            overflowPeek={overflowPeek}
            onMetricsChange={setMetrics}
            onFitToScreenReady={handleFitToScreenReady}
            onAddText={addText}
            onAddRect={addRect}
            onAddImage={addImage}
            onAddIcon={addIcon}
            onOpenIconPicker={openIconPicker}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </main>

        {doc && (
          <aside className="bg-white border border-black/10 rounded-xl p-3 min-h-[200px] [grid-area:unset] max-[1200px]:[grid-area:inspector]">
            <InspectorPanel
              node={doc.nodes.find((n) => n.id === inspectorSelectedId) || null}
              updateNode={updateNode}
              removeNode={removeNode}
              reorder={reorder}
              activeGroupIds={activeGroupIds}
            />
          </aside>
        )}
      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templates={cvTemplates}
        onSelectTemplate={handleSelectTemplate}
      />

      <GenerateCvModal
        open={isGenModalOpen}
        onClose={closeGenerateModal}
        email={email}
        onGenerateFromLink={handleGenerateFromLink}
        onPickOffer={handlePickOffer}
      />

      <InfoModal
        open={isTemplateWarningOpen}
        onClose={() => setIsTemplateWarningOpen(false)}
        title="Wybierz szablon"
        message="Zanim wygenerujesz CV, musisz najpierw wybrać szablon. Kliknij przycisk poniżej, aby wybrać jeden z dostępnych szablonów."
        buttonText="Wybierz szablon"
        onConfirm={handleTemplateWarningConfirm}
        icon="warning"
      />
    </div>
  );
}

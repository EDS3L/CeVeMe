// src/features/cv/pages/CvEditorPage.jsx
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useCvEditor } from '../hooks/useCvEditor';
import CvForm from '../components/CvForm';
import SidebarEditor from '../components/SidebarEditor';
import CVPreviewClassic from '../cvTypes/CVPreviewClassic';
import CVPreviewSidebar from '../cvTypes/CVPreviewSidebar';
import Navbar from '../components/CvNavbar';

/* ------------------------------------------------------------------ */
/*  WYDRUK – ZERO MARGINS                                             */
/* ------------------------------------------------------------------ */
const PAGE_STYLE = `
  @page { size: 210mm 297mm; margin: 0; }

  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; }

    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    /* Kontener z CV – skala nadpisywana inline style z Reacta */
    #cv-print {
      width: 210mm;
      transform-origin: top left;
    }

    #cv-print, #cv-print * {
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    .cv-section { break-inside: avoid; page-break-inside: avoid; }
    .no-print   { display: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/*  SKALOWANIE – KONSTANTY                                            */
/* ------------------------------------------------------------------ */
const PAGE_HEIGHT_PX = 1122; // ≈ 297 mm @ 96 DPI
const MAX_PAGES = 2;
const MIN_SCALE = 0.75;

/* ------------------------------------------------------------------ */
/*  DEFINICJE LAYOUTÓW                                                */
/* ------------------------------------------------------------------ */
const LAYOUTS = [
  { value: 'classic', label: 'Klasyczny', component: CVPreviewClassic },
  { value: 'sidebar', label: 'Z boczną kolumną', component: CVPreviewSidebar },
];

/* ------------------------------------------------------------------ */
/*  GŁÓWNY KOMPONENT                                                  */
/* ------------------------------------------------------------------ */
export default function CvEditorPage() {
  const {
    cvData,
    offerLink,
    setOfferLink,
    loading,
    error,
    handleGenerateCv,
    setCvData,
  } = useCvEditor();

  const [layout, setLayout] = useState('classic');
  const [scale, setScale] = useState(1);

  const previewRef = useRef(null);

  /* -------------------------------------------------------------- */
  /*  1) OBLICZANIE SKALI                                           */
  /* -------------------------------------------------------------- */
  const recomputeScale = () => {
    if (!previewRef.current) return;

    const { scrollHeight } = previewRef.current;
    const available = PAGE_HEIGHT_PX * MAX_PAGES;

    if (scrollHeight <= available) {
      setScale(1); // mieści się – 1 ×
    } else {
      // proporcjonalne zmniejszenie + mały margines bezpieczeństwa (0.98)
      const newScale = Math.max((available / scrollHeight) * 0.98, MIN_SCALE);
      setScale(parseFloat(newScale.toFixed(3))); // zaokrąglenie
    }
  };

  /* Wywołaj:
     – po każdej zmianie danych/layoutu,
     – przy każdej zmianie rozmiaru okna. */
  useLayoutEffect(recomputeScale, [cvData, layout]);
  useEffect(() => {
    window.addEventListener('resize', recomputeScale);
    return () => window.removeEventListener('resize', recomputeScale);
  }, []);

  /* -------------------------------------------------------------- */
  /*  2) PRINT HANDLER                                              */
  /* -------------------------------------------------------------- */
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    copyStyles: true,
    removeAfterPrint: true,
    pageStyle: PAGE_STYLE,
    documentTitle: cvData?.personalData?.name
      ? `CV_${cvData.personalData.name.replace(/\s+/g, '_')}`
      : 'CV',
  });

  const PreviewComponent =
    LAYOUTS.find((l) => l.value === layout)?.component || CVPreviewClassic;

  /* -------------------------------------------------------------- */
  /*  3) RENDER                                                     */
  /* -------------------------------------------------------------- */
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* ----------- 1. FORMULARZ GENEROWANIA DANYCH ----------- */}
        {!cvData ? (
          <div className="m-auto">
            <CvForm
              offerLink={offerLink}
              setOfferLink={setOfferLink}
              onGenerate={handleGenerateCv}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          /* ------------- 2. TRYB PODGLĄDU / EDYCJI -------------- */
          <>
            <SidebarEditor cvData={cvData} onDataChange={setCvData} />

            <div className="w-2/3 flex flex-col p-8 overflow-auto">
              {/* -------------- PANEL AKCJI (ukryty w PDF) ---------- */}
              <div className="mb-4 flex gap-4 items-center no-print">
                <label className="font-medium">Wybierz format CV:</label>

                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {LAYOUTS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handlePrint}
                  disabled={loading || !cvData}
                  className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded
                             hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Generowanie…' : 'Drukuj / Zapisz PDF'}
                </button>
              </div>

              {/* --------------- OBSZAR WYDRUKU -------------------- */}
              <div
                id="cv-print"
                ref={previewRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <PreviewComponent cvData={cvData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from '../../../../api';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { useCvEditor } from '../hooks/useCvEditor';
import CvForm from '../components/CvForm';
import SidebarEditor from '../components/SidebarEditor';
import CVPreviewClassic from '../cvTypes/CVPreviewClassic';
import CVPreviewSidebar from '../cvTypes/CVPreviewSidebar';
import CVPreviewHybrid from '../cvTypes/CVPreviewHybrid';
import CVPreviewProject from '../cvTypes/CVPreviewProject';
import CVPreviewAts from '../cvTypes/CVPreviewAts';
import { useSinglePageScale } from '../hooks/useSinglePageScale';
import LayoutPicker from '../components/LayoutPicker';
import Navbar from '../../../components/Navbar';
import { useLocation } from 'react-router-dom';

/* Druk: zero marginesów, overflow hidden TYLKO w druku */
const PAGE_STYLE = `
  @page { size: 210mm 297mm; margin: 0; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    #cv-page {
      width: 210mm; height: 297mm;
      overflow: hidden;
      background: white;
      position: relative;
    }
    #cv-page, #cv-page * {
      box-shadow: none !important;
    }
    .no-print { display: none !important; }
  }
`;

const LAYOUTS = [
  {
    value: 'ats',
    label: 'ATS',
    badge: 'ATS-first',
    desc: 'Jednokolumnowe, reverse-chronological. Zero tabel/ikon, standardowe punkty. Maksymalna zgodność z ATS.',
    component: CVPreviewAts,
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    badge: 'Human-first · ATS-safe',
    desc: 'Dwukolumnowy dla ludzi (skills/języki/certy w bocznej kolumnie), ale DOM linearny i ATS-bezpieczny.',
    component: CVPreviewHybrid,
  },
  {
    value: 'project',
    label: 'Project/Case',
    badge: 'Impact-first',
    desc: 'Wybrane projekty i efekty (STAR/CAR) na pierwszym planie. Idealne dla IT/produkt/design i juniorów.',
    component: CVPreviewProject,
  },
  {
    value: 'classic',
    label: 'Classic',
    desc: 'Klasyczny układ z wyraźnym podziałem na doświadczenie, projekty i umiejętności.',
    component: CVPreviewClassic,
  },
  {
    value: 'sidebar',
    label: 'Sidebar',
    desc: 'Zgrabny layout z boczną kolumną na kontakt, skills i certyfikaty.',
    component: CVPreviewSidebar,
  },
];

async function waitForImages(node) {
  if (!node) return;
  const imgs = Array.from(node.querySelectorAll('img'));
  if (!imgs.length) return;
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            const done = () => {
              img.onload = img.onerror = null;
              res();
            };
            img.onload = done;
            img.onerror = done;
          })
    )
  );
}
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const jwt = getCookie('jwt');

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
  const location = useLocation();

  const innerRef = useRef(null); // element skalowany
  const pageRef = useRef(null); // element drukowany

  /** Stan UI dla zapisu */
  const [savingMode, setSavingMode] = useState(null); // "upload" | "uploadAndHistory" | null

  useEffect(() => {
    if (location.state?.offerLink) {
      setOfferLink(location.state.offerLink);
    }
  }, [location.state?.offerLink]);

  useEffect(() => {
    if (offerLink) {
      handleGenerateCv();
    }
  }, [offerLink]);

  const { scale, tx, ty, recomputeNow } = useSinglePageScale(innerRef, {
    widthMm: 210,
    heightMm: 297,
    minF: 1,
    maxF: 4,
    iterations: 14,
  });

  const handlePrint = useReactToPrint({
    contentRef: pageRef,
    copyStyles: true,
    removeAfterPrint: true,
    pageStyle: PAGE_STYLE,
    documentTitle: cvData?.personalData?.name
      ? `CV_${cvData.personalData.name.replace(/\s+/g, '_')}`
      : 'CV',
    onBeforePrint: async () => {
      await waitForImages(innerRef.current);
      recomputeNow();
      await nextFrame();
      recomputeNow();
      await nextFrame();
    },
  });

  const PreviewComponent =
    LAYOUTS.find((l) => l.value === layout)?.component || CVPreviewClassic;

  const generatePdfBlob = async () => {
    await waitForImages(innerRef.current);
    recomputeNow();
    await nextFrame();
    recomputeNow();
    await nextFrame();

    const el = pageRef.current || document.getElementById('cv-page');
    if (!el)
      throw new Error('Nie znaleziono elementu CV do wygenerowania PDF.');

    const canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    return pdf.output('blob');
  };

  const uploadGeneratedPdf = async () => {
    const blob = await generatePdfBlob();
    const filename = cvData?.personalData?.name
      ? `CV_${cvData.personalData.name.replace(/\s+/g, '_')}.pdf`
      : 'CV.pdf';

    const formData = new FormData();
    formData.append('multipartFile', blob, filename);
    formData.append('jobOfferLink', offerLink || '');

    const response = await axios({
      url: `/api/users/upload/cvFile`,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data;
  };

  const saveToHistory = async () => {
    const response = await axios({
      url: `/api/applicationHistory/save`,
      method: 'POST',
      data: { jobOfferLink: offerLink || '' },
      headers: { Authorization: `Bearer ${jwt}` },
      withCredentials: true,
    });
    return response.data;
  };

  const handleSaveOnly = async () => {
    try {
      setSavingMode('upload');
      if (!offerLink) {
        toast.info('Podaj link do oferty, aby przypisać go do CV.');
      }
      await uploadGeneratedPdf();
      toast.success('CV zapisane pomyślnie.');
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Błąd podczas zapisywania CV.';
      toast.error(msg);
    } finally {
      setSavingMode(null);
    }
  };

  const handleSaveAndHistory = async () => {
    try {
      setSavingMode('uploadAndHistory');
      if (!offerLink) {
        toast.info('Podaj link do oferty, aby przypisać go do CV.');
      }
      await uploadGeneratedPdf();
      await saveToHistory();
      toast.success('CV zapisane i dodane do historii aplikacji.');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Błąd podczas zapisu CV lub dodawania do historii.';
      toast.error(msg);
    } finally {
      setSavingMode(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-ivorylight)] text-[var(--color-slatedark)]">
      <Navbar />

      <div className="flex-1 min-h-0">
        {!cvData ? (
          <div className="max-w-5xl mx-auto p-8">
            <CvForm
              offerLink={offerLink}
              setOfferLink={setOfferLink}
              onGenerate={handleGenerateCv}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="h-full flex min-h-0">
            {/* LEWY PANEL: SidebarEditor (stała szerokość + wewnętrzny scroll) */}
            <div className="flex flex-col w-[400px] min-w-[360px] max-w-[440px] bg-[var(--color-ivorymedium)] border-r border-[color:rgba(0,0,0,0.08)]">
              <div className="px-4 py-3 border-b border-[color:rgba(0,0,0,0.06)]">
                <h2 className="text-sm tracking-wide uppercase font-semibold text-[var(--color-clouddark)]">
                  Edytor CV
                </h2>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4">
                  <SidebarEditor cvData={cvData} onDataChange={setCvData} />
                </div>
              </div>
            </div>

            {/* PRAWY PANEL: Pasek akcji + picker + duży podgląd */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Sticky toolbar */}
              <div className="sticky top-0 z-10 border-b border-[color:rgba(0,0,0,0.06)] bg-[var(--color-ivorylight)]/90 backdrop-blur">
                <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-start gap-6">
                  <div className="flex-1">
                    <LayoutPicker
                      layouts={LAYOUTS}
                      value={layout}
                      onChange={setLayout}
                      cvData={cvData}
                    />
                  </div>

                  {/* Przyciski akcji */}
                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={handleSaveOnly}
                      disabled={loading || !cvData || !!savingMode}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md
                        bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] font-semibold
                        shadow-sm hover:bg-[var(--color-kraft)] focus:outline-none
                        focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
                      title="Zapisz wygenerowany PDF CV w systemie"
                    >
                      {savingMode === 'upload' ? 'Zapisywanie…' : 'Zapisz CV'}
                    </button>

                    <div className="relative group">
                      <button
                        onClick={handleSaveAndHistory}
                        disabled={loading || !cvData || !!savingMode}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md
                          bg-kraft text-[var(--color-basewhite)] font-semibold
                          shadow-sm hover:opacity-90 focus:outline-none
                          focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
                      >
                        {savingMode === 'uploadAndHistory'
                          ? 'Zapisywanie…'
                          : 'Zapisz i dodaj do historii'}
                      </button>
                      {/* Tooltip */}
                      <div
                        className="absolute right-0 mt-2 hidden group-hover:block
                          bg-[var(--color-basewhite)] text-[var(--color-slatedark)]
                          text-xs leading-snug max-w-xs p-3 rounded-md border
                          border-[color:rgba(0,0,0,0.08)] shadow-lg"
                        style={{ width: 260 }}
                      >
                        Po kliknięciu zapiszesz swoje CV (PDF) i dodatkowo
                        dodasz tę aplikację do historii aplikowanych ofert.
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      disabled={loading || !cvData}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md
                        bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] font-semibold
                        shadow-sm hover:bg-[var(--color-kraft)] focus:outline-none
                        focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
                    >
                      {loading ? 'Generowanie…' : 'Drukuj / PDF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Duży podgląd (centrum) */}
              <div className="flex-1 min-h-0 overflow-auto">
                <div className="mx-auto max-w-[1400px] px-6 py-8">
                  <div className="flex justify-center">
                    <div
                      id="cv-page"
                      ref={pageRef}
                      style={{
                        width: '210mm',
                        height: '297mm',
                        background: 'var(--color-basewhite)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                        position: 'relative',
                        overflow: 'visible',
                        borderRadius: 14,
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <div
                        id="cv-print"
                        ref={innerRef}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                          transformOrigin: 'top left',
                          willChange: 'transform',
                        }}
                      >
                        <PreviewComponent cvData={cvData} />
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs mt-4 text-[var(--color-clouddark)]/70">
                    Podgląd dopasowany do A4. Wydruk/PDF zachowuje układ 1×A4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

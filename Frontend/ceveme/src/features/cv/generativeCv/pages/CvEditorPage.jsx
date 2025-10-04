import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

import Navbar from '../../../../components/Navbar';
import LayoutPicker from '../components/LayoutPicker';
import CvForm from '../components/CvForm';
import SidebarEditor from '../components/SidebarEditor';

import { useCvEditor } from '../hooks/useCvEditor';
import { useSinglePageScale } from '../hooks/useSinglePageScale';

import { PAGE_STYLE } from './constants/pageStyle';
import { LAYOUTS, getLayoutComponent } from './constants/layouts';

import { usePdfExport } from './hooks/usePdfExport';
import { useCvSave } from './hooks/useCvSave';

import './../styles/CvEditorStyles.css';

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
  const [previewHeight, setPreviewHeight] = useState(0);

  const innerRef = useRef(null);
  const pageRef = useRef(null);

  const { scale, tx, ty, recomputeNow } = useSinglePageScale(innerRef, {
    widthMm: 210,
    heightMm: 297,
    minF: 1,
    maxF: 4,
    iterations: 14,
  });

  const getHeight = useCallback(() => {
    if (innerRef.current) {
      setPreviewHeight(innerRef.current.clientHeight);
    }
  }, []);

  const generateRef = useRef(handleGenerateCv);
  useEffect(() => {
    generateRef.current = handleGenerateCv;
  }, [handleGenerateCv]);

  useEffect(() => {
    if (location.state?.offerLink) {
      setOfferLink(location.state.offerLink);
    }
  }, [location.state?.offerLink, setOfferLink]);

  useEffect(() => {
    if (!offerLink) return;
    generateRef.current();
  }, [offerLink]);

  // Automatyczne przeliczanie skali ORAZ wysokości po zmianach
  useEffect(() => {
    const timer = setTimeout(() => {
      if (innerRef.current) {
        getHeight();
        recomputeNow();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [cvData, layout, recomputeNow, getHeight]);

  const generatePdfBlob = usePdfExport(innerRef, pageRef);

  const { savingMode, handleSaveAndHistory } = useCvSave({
    cvData,
    offerLink,
    generatePdfBlob,
  });

  const handlePrint = useReactToPrint({
    contentRef: pageRef,
    copyStyles: true,
    removeAfterPrint: true,
    pageStyle: PAGE_STYLE,
    documentTitle: cvData?.personalData?.name
      ? `CV_${cvData.personalData.name.replace(/\s+/g, '_')}`
      : 'CV',
  });

  const PreviewComponent = useMemo(() => getLayoutComponent(layout), [layout]);

  const handleGenerate = useCallback(() => {
    if (!offerLink) {
      toast.info('Podaj link do oferty, aby wygenerować dopasowane CV.');
      return;
    }
    generateRef.current();
  }, [offerLink]);

  const CvSizeAlert = () => {
    if (previewHeight === 0) return null;
    const isOverA4 = previewHeight > 1120;
    return (
      <div
        className={`mx-auto max-w-[1400px] px-6 py-3 ${
          isOverA4
            ? 'bg-red-50 border border-red-200'
            : 'bg-green-50 border border-green-200'
        } rounded-lg mb-4`}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isOverA4 ? 'bg-red-500' : 'bg-green-500'
            }`}
          ></div>
          <p
            className={`text-sm font-medium ${
              isOverA4 ? 'text-red-800' : 'text-green-800'
            }`}
          >
            {isOverA4
              ? `⚠️ CV jest za długie (${previewHeight}px), treść została automatycznie zacieśniona.`
              : `✅ Twoje CV mieści się na jednej kartce A4 (${previewHeight}px).`}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-ivorylight)] text-[var(--color-slatedark)]">
      <Navbar showShadow={true} />
      <div className="flex-1 min-h-0">
        {!cvData ? (
          <div className="max-w-5xl mx-auto p-8">
            <CvForm
              offerLink={offerLink}
              setOfferLink={setOfferLink}
              onGenerate={handleGenerate}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <div className="h-full flex min-h-0">
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
            <div className="flex-1 min-w-0 flex flex-col">
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
                  <div className="shrink-0 flex items-center gap-3">
                    <div className="relative group">
                      <button
                        onClick={handleSaveAndHistory}
                        disabled={loading || !cvData || !!savingMode}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md
                          bg-kraft text-[var(--color-basewhite)] font-semibold
                          shadow-sm hover:opacity-90 focus:outline-none
                          focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
                        aria-busy={savingMode ? 'true' : 'false'}
                        aria-live="polite"
                      >
                        {savingMode === 'uploadAndHistory'
                          ? 'Zapisywanie…'
                          : 'Zapisz i dodaj do historii'}
                      </button>
                    </div>
                    <button
                      onClick={handlePrint}
                      disabled={loading || !cvData}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md
                        bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] font-semibold
                        shadow-sm hover:bg-[var(--color-kraft)] focus:outline-none
                        focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
                    >
                      {loading ? 'Generowanie…' : 'Drukuj'}
                    </button>
                  </div>
                </div>
                <CvSizeAlert />
              </div>
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
                        overflow: 'hidden',
                        borderRadius: 14,
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <div
                        id="cv-print"
                        ref={innerRef}
                        className={previewHeight > 1120 ? 'condensed' : ''}
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

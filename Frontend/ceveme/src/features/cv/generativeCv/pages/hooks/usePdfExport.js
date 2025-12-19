import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function usePdfExport(innerRef, pageRef, recomputeNow) {
  return useCallback(async () => {
    const el = pageRef.current || document.getElementById('cv-page');
    if (!el)
      throw new Error('Nie znaleziono elementu CV do wygenerowania PDF.');

    const canvas = await html2canvas(el, {
      backgroundColor: '#fff',
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    return pdf.output('blob');
  }, [innerRef, pageRef, recomputeNow]);
}

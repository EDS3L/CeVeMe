import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPageToPdf(pageEl, filename = 'CV.pdf') {
  const el = pageEl || document.getElementById('cv-page');
  if (!el) throw new Error('Brak elementu strony do eksportu');

  const canvas = await html2canvas(el, {
    backgroundColor: '#fff',
    scale: 2,
    useCORS: true,
  });
  const img = canvas.toDataURL('image/jpeg', 0.92);
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, 'JPEG', 0, 0, w, h);
  pdf.save(filename);
}

export function printPage(pageEl) {
  const el = pageEl || document.getElementById('cv-page');
  if (!el) return;
  const win = window.open('', '_blank');
  if (!win) return;
  const html = `
    <html>
      <head>
        <title>Print</title>
        <style>
          @page { size: A4; margin: 0; }
          body, html { margin:0; padding:0; }
          #page { width:210mm; height:297mm; }
        </style>
      </head>
      <body>${el.outerHTML}</body>
    </html>`;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}

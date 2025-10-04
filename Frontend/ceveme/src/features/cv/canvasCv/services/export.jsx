import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPageToPdf(pageEl, filename = 'CV.pdf') {
  const src = pageEl || document.getElementById('cv-page');
  if (!src) throw new Error('Brak elementu strony do eksportu');

  const clone = src.cloneNode(true);
  Object.assign(clone.style, {
    transform: 'none',
    transformOrigin: 'top left',
    width: '210mm',
    height: '297mm',
    boxShadow: 'none',
    border: '0',
    margin: '0',
    background: '#fff',
    position: 'static',
  });

  const holder = document.createElement('div');
  Object.assign(holder.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    background: '#fff',
    padding: '0',
    margin: '0',
    zIndex: -1,
  });
  holder.appendChild(clone);
  document.body.appendChild(holder);

  const canvas = await html2canvas(clone, {
    backgroundColor: '#fff',
    scale: 3,
    useCORS: true,
    logging: false,
  });

  document.body.removeChild(holder);

  const img = canvas.toDataURL('image/jpeg', 0.95);
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
          html, body { margin:0; padding:0; background:#fff; }
          #cv-page {
            width:210mm !important;
            height:297mm !important;
            transform:none !important;
            box-shadow:none !important;
            border:none !important;
            margin:0 !important;
          }
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

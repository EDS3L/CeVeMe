export const PAGE_STYLE = `
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
    #cv-page, #cv-page * { box-shadow: none !important; }
    .no-print { display: none !important; }
  }
`;

import jsPDF from 'jspdf';
import 'jspdf/dist/polyfills.es.js';

const DEFAULT_DPI = 300;
const MM_PER_INCH = 25.4;
const PT_TO_MM = 25.4 / 72;
const ptToMm = (pt) => pt * PT_TO_MM;

// AKCENT z Twojego zrzutu: R=15, G=118, B=110 → #0F766E
const ACCENT_HEX = '#0F766E';

let fontsFetched = false;
let FONT_CACHE = { normalBase64: null, boldBase64: null };

/* ==================== wektorowe SVG dla ikon ==================== */
/* Uwaga: LinkedIn i GitHub używają 'currentColor', żeby można je było łatwo podbarwić */
const ICON_SVGS = {
  '☎': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2
           19.8 19.8 0 0 1-8.63-3.07
           19.5 19.5 0 0 1-6-6
           19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3
           a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.61a2 2 0 0 1-.45 2.11L8.09 9.91
           a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45
           c.84.26 1.71.45 2.61.57A2 2 0 0 1 22 16.92z"/>
</svg>`,
  '✉': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
  <path d="M3 7l9 6 9-6"/>
</svg>`,
  '📍': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 5.5-9 12-9 12s-9-6.5-9-12a9 9 0 1 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`,

  /* NOWE: LinkedIn – używamy symbolu 🔗 w danych jako „etykiety” LinkedIn */
  '🔗': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 7h3a5 5 0 1 1 0 10h-3"/>
  <path d="M9 17H6a5 5 0 1 1 0-10h3"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,

  /* NOWE: GitHub – używamy symbolu 🐙 w danych jako „etykiety” GitHuba */
  '🐙': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="currentColor">
  <path d="M12 2C6.477 2 2 6.477 2 12a10 10 0 0 0 6.838 9.488c.5.092.682-.217.682-.482
           0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34
           -.454-1.154-1.11-1.462-1.11-1.462-.908-.621.069-.608.069-.608
           1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833
           .091-.647.35-1.088.636-1.339-2.22-.252-4.555-1.11-4.555-4.943
           0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647
           0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844
           c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025
           .546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682
           0 3.842-2.339 4.687-4.566 4.936.359.309.678.919.678 1.852
           0 1.335-.012 2.411-.012 2.737 0 .267.18.579.688.48A10.001 10.001 0 0 0 22 12
           c0-5.523-4.477-10-10-10z"/>
</svg>`,
};
/* ==================================================================================== */

async function loadCustomFonts(pdf) {
  try {
    if (!fontsFetched) {
      const fontUrls = {
        normal: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf',
        bold: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf',
      };
      const [normalRes, boldRes] = await Promise.all([
        fetch(fontUrls.normal),
        fetch(fontUrls.bold),
      ]);
      const [normalBuffer, boldBuffer] = await Promise.all([
        normalRes.arrayBuffer(),
        boldRes.arrayBuffer(),
      ]);
      FONT_CACHE.normalBase64 = arrayBufferToBase64(normalBuffer);
      FONT_CACHE.boldBase64 = arrayBufferToBase64(boldBuffer);
      fontsFetched = true;
    }
    if (FONT_CACHE.normalBase64) {
      pdf.addFileToVFS('Roboto-Regular.ttf', FONT_CACHE.normalBase64);
      pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    }
    if (FONT_CACHE.boldBase64) {
      pdf.addFileToVFS('Roboto-Bold.ttf', FONT_CACHE.boldBase64);
      pdf.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    }
  } catch (error) {
    console.error('Błąd ładowania fontów:', error);
  }
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function fetchAsDataURL(src) {
  try {
    const res = await fetch(src, { mode: 'cors' });
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return src; // fallback
  }
}

function isSvgSource(srcOrDataUrl = '') {
  if (!srcOrDataUrl || typeof srcOrDataUrl !== 'string') return false;
  if (srcOrDataUrl.startsWith('data:image/svg+xml')) return true;
  try {
    const url = new URL(srcOrDataUrl, window.location.origin);
    return url.pathname.toLowerCase().endsWith('.svg');
  } catch {
    return srcOrDataUrl.toLowerCase().endsWith('.svg');
  }
}
async function fetchSvgText(src) {
  const res = await fetch(src, { mode: 'cors' });
  return await res.text();
}
async function rasterizeSvgToPngDataUrl(svgString, widthPx, heightPx) {
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(widthPx));
  canvas.height = Math.max(1, Math.floor(heightPx));
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas.toDataURL('image/png');
}

function detectUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = [];
  let lastIndex = 0,
    m;
  while ((m = urlRegex.exec(text)) !== null) {
    if (m.index > lastIndex)
      parts.push({ text: text.slice(lastIndex, m.index), isUrl: false });
    parts.push({ text: m[0], isUrl: true });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length)
    parts.push({ text: text.slice(lastIndex), isUrl: false });
  return parts.length ? parts : [{ text, isUrl: false }];
}

function getFontStyle(weight) {
  const w = parseInt(weight) || 400;
  return w >= 700 ? 'bold' : 'normal';
}
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
}
function mimeFromDataURL(dataUrl) {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/.exec(dataUrl || '');
  return m ? m[1] : null;
}

/* === prosty tint: podmień 'currentColor' na HEX === */
function tintSvg(svg, colorHex) {
  if (!colorHex) return svg;
  return svg.replace(/currentColor/gi, colorHex);
}

/* ===== ikonka inline (z obsługą koloru) ===== */
async function drawInlineIcon(
  pdf,
  iconChar,
  baselineX,
  baselineY,
  lineBoxTop,
  lineBoxHeight,
  fontMm,
  dpi,
  colorHex
) {
  const rawSvg = ICON_SVGS[iconChar];
  if (!rawSvg) return { drawn: false, advance: 0 };

  try {
    const pxPerMm = dpi / MM_PER_INCH;
    const iconSizeMm = Math.max(
      3,
      Math.min(lineBoxHeight * 0.95, fontMm * 1.05)
    );
    const sizePx = Math.max(12, Math.floor(iconSizeMm * pxPerMm));

    // jeśli podano kolor → wstrzyknij go w miejsca 'currentColor'
    const svg = tintSvg(rawSvg, colorHex);

    const dataUrl = await rasterizeSvgToPngDataUrl(svg, sizePx, sizePx);
    const iconY = lineBoxTop + (lineBoxHeight - iconSizeMm) / 2;
    pdf.addImage(dataUrl, 'PNG', baselineX, iconY, iconSizeMm, iconSizeMm);

    const gapMm = Math.max(0.6, fontMm * 0.25);
    return { drawn: true, advance: iconSizeMm + gapMm };
  } catch (e) {
    console.warn('Rasteryzacja ikony nie powiodła się:', e);
    const gapMm = Math.max(0.6, fontMm * 0.25);
    return { drawn: false, advance: gapMm };
  }
}

function tokenizeLineForIcons(line) {
  const tokens = [];
  let buf = '';
  for (const ch of line) {
    if (ICON_SVGS[ch]) {
      if (buf) {
        tokens.push({ type: 'text', value: buf });
        buf = '';
      }
      tokens.push({ type: 'icon', value: ch });
    } else buf += ch;
  }
  if (buf) tokens.push({ type: 'text', value: buf });
  return tokens;
}

function measureMixedLineWidth(pdf, line, fontMm, lineHeight) {
  const tokens = tokenizeLineForIcons(line);
  const iconSizeMm = Math.max(
    3,
    Math.min(fontMm * lineHeight * 0.95, fontMm * 1.05)
  );
  const gapMm = Math.max(0.6, fontMm * 0.25);
  let width = 0;
  for (const t of tokens)
    width += t.type === 'icon' ? iconSizeMm + gapMm : pdf.getTextWidth(t.value);
  return width;
}

/* ===== KOŁO: maska na canvasie (bez problemów z clip i CORS) ===== */
async function maskImageToCircleDataURL(srcDataUrl, sidePx) {
  const img = new Image();
  if (!/^data:|^blob:/i.test(srcDataUrl)) img.crossOrigin = 'anonymous';
  img.src = srcDataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = sidePx;
  canvas.height = sidePx;
  const ctx = canvas.getContext('2d');

  const scale = Math.max(sidePx / img.naturalWidth, sidePx / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  const dx = (sidePx - drawW) / 2;
  const dy = (sidePx - drawH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(sidePx / 2, sidePx / 2, sidePx / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

async function renderDocIntoPdf(pdf, doc, dpi = DEFAULT_DPI) {
  if (!doc || !doc.page) throw new Error('Brak dokumentu do renderu');
  await loadCustomFonts(pdf);

  const sortedNodes = [...doc.nodes].sort(
    (a, b) => (a.frame?.zIndex ?? 0) - (b.frame?.zIndex ?? 0)
  );

  for (const node of sortedNodes) {
    const { x, y, w, h } = node.frame || {};

    // SHAPE
    if (node.type === 'shape') {
      const fill = node.style?.fill?.color ?? 'none';
      const fillOpacity = node.style?.fill?.opacity ?? 1;
      const stroke = node.style?.stroke?.color ?? 'none';
      const strokeWidth = node.style?.stroke?.width ?? 0;
      const cornerRadius = node.style?.cornerRadius ?? 0;

      pdf.saveGraphicsState();

      if (fill !== 'none') {
        const rgb = hexToRgb(fill);
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        if (typeof pdf.GState === 'function' && fillOpacity < 1) {
          pdf.setGState(new pdf.GState({ opacity: fillOpacity }));
        }
      }
      if (stroke !== 'none' && strokeWidth > 0) {
        const rgb = hexToRgb(stroke);
        pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
        pdf.setLineWidth(strokeWidth);
      }
      const style =
        fill !== 'none' && stroke !== 'none' && strokeWidth > 0
          ? 'FD'
          : fill !== 'none'
          ? 'F'
          : 'S';
      if (cornerRadius > 0)
        pdf.roundedRect(x, y, w, h, cornerRadius, cornerRadius, style);
      else pdf.rect(x, y, w, h, style);

      pdf.restoreGraphicsState();
    }

    // IMAGE (SVG→PNG, koło przez maskę na canvasie, fallback)
    if (node.type === 'image' && node.src) {
      try {
        const pxPerMm = dpi / MM_PER_INCH;
        const widthPx = Math.max(1, Math.floor(w * pxPerMm));
        const heightPx = Math.max(1, Math.floor(h * pxPerMm));

        let dataUrl;
        if (isSvgSource(node.src)) {
          const svgText = await fetchSvgText(node.src);
          dataUrl = await rasterizeSvgToPngDataUrl(svgText, widthPx, heightPx);
        } else {
          dataUrl = await fetchAsDataURL(node.src);
        }

        const mime = mimeFromDataURL(dataUrl);
        const imgType = mime === 'image/png' ? 'PNG' : 'JPEG';
        const cornerRadius = node.style?.cornerRadius ?? 0;

        const circleByRadius =
          Math.abs(cornerRadius - Math.min(w, h) / 2) <= 0.6 ||
          cornerRadius >= Math.min(w, h) * 0.49;
        const clipCircle =
          node.style?.clipCircle === true ||
          node.style?.shape === 'circle' ||
          circleByRadius;

        if (clipCircle) {
          const sideMm = Math.min(w, h);
          const sidePx = Math.max(1, Math.floor(sideMm * pxPerMm));
          let masked = null;
          try {
            const ensured = dataUrl.startsWith('data:')
              ? dataUrl
              : await fetchAsDataURL(node.src);
            if (ensured && ensured.startsWith('data:'))
              masked = await maskImageToCircleDataURL(ensured, sidePx);
          } catch {
            masked = null;
          }

          const ix = x + (w - sideMm) / 2;
          const iy = y + (h - sideMm) / 2;

          if (masked) pdf.addImage(masked, 'PNG', ix, iy, sideMm, sideMm);
          else pdf.addImage(dataUrl, imgType, ix, iy, sideMm, sideMm); // awaryjnie kwadrat
        } else if (cornerRadius > 0) {
          pdf.saveGraphicsState();
          pdf.roundedRect(x, y, w, h, cornerRadius, cornerRadius);
          pdf.clip();
          pdf.addImage(dataUrl, imgType, x, y, w, h);
          pdf.restoreGraphicsState();
        } else {
          pdf.addImage(dataUrl, imgType, x, y, w, h);
        }
      } catch (e) {
        console.warn('Nie udało się dodać obrazu:', e);
      }
    }

    // TEXT (zawijanie / linki / ikonki inline / verticalAlign / node.link)
    if (node.type === 'text') {
      const txt = node.text || '';
      const style = node.textStyle || {};
      const fontPt = style.fontSize ?? 12;
      const fontMm = ptToMm(fontPt);
      const lineHeight = style.lineHeight ?? 1.35;
      const fontWeight = style.fontWeight ?? 400;
      const align = style.textAlign ?? 'left';
      const color = style.color ?? '#0f172a';
      const rgb = hexToRgb(color);

      pdf.setTextColor(rgb.r, rgb.g, rgb.b);
      pdf.setFontSize(fontPt);
      pdf.setFont(
        fontsFetched && (FONT_CACHE.normalBase64 || FONT_CACHE.boldBase64)
          ? 'Roboto'
          : 'helvetica',
        getFontStyle(fontWeight)
      );

      const lines = pdf.splitTextToSize(txt, w);
      const lhMm = fontMm * lineHeight;
      const defaultVAlign = lines.length <= 2 ? 'middle' : 'top';
      const vAlign = style.verticalAlign ?? defaultVAlign;

      const totalTextHeight = lines.length * lhMm;
      let startY = y + fontMm * 0.85;
      if (vAlign === 'middle')
        startY = y + (h - totalTextHeight) / 2 + fontMm * 0.85;
      else if (vAlign === 'bottom')
        startY = y + h - totalTextHeight + fontMm * 0.85;

      let currentY = startY;

      for (const partLine of lines) {
        const line = String(partLine);
        const lineTop = currentY - fontMm * 0.85;
        if (!line.trim()) {
          currentY += lhMm;
          continue;
        }

        const lineWidth = measureMixedLineWidth(pdf, line, fontMm, lineHeight);
        let currentX = x;
        if (align === 'center') currentX = x + (w - lineWidth) / 2;
        else if (align === 'right') currentX = x + w - lineWidth;

        const tokens = tokenizeLineForIcons(line);

        for (const t of tokens) {
          if (t.type === 'icon') {
            // Kolor ikon: jeśli node.iconColor istnieje → użyj (np. LinkedIn/GitHub)
            const colorHex =
              node.iconColor ||
              // awaryjnie: dla 🔗 i 🐙 użyj akcentu
              (t.value === '🔗' || t.value === '🐙' ? ACCENT_HEX : null);
            const { drawn, advance } = await drawInlineIcon(
              pdf,
              t.value,
              currentX,
              currentY,
              lineTop,
              lhMm,
              fontMm,
              dpi,
              colorHex
            );
            if (drawn) currentX += advance;
          } else {
            if (node.link) {
              const seg = t.value || '';
              if (seg) {
                pdf.textWithLink(seg, currentX, currentY, { url: node.link });
                const segWidth = pdf.getTextWidth(seg);
                pdf.setDrawColor(0, 102, 204);
                pdf.setLineWidth(0.1);
                pdf.line(
                  currentX,
                  currentY + fontMm * 0.15,
                  currentX + segWidth,
                  currentY + fontMm * 0.15
                );
                currentX += segWidth;
              }
            } else {
              const parts = detectUrls(t.value);
              for (const p of parts) {
                const partWidth = pdf.getTextWidth(p.text);
                if (p.isUrl) {
                  const originalColor = { ...rgb };
                  pdf.setTextColor(0, 102, 204);
                  pdf.textWithLink(p.text, currentX, currentY, { url: p.text });
                  pdf.setDrawColor(0, 102, 204);
                  pdf.setLineWidth(0.1);
                  pdf.line(
                    currentX,
                    currentY + fontMm * 0.15,
                    currentX + partWidth,
                    currentY + fontMm * 0.15
                  );
                  pdf.setTextColor(
                    originalColor.r,
                    originalColor.g,
                    originalColor.b
                  );
                } else if (p.text) {
                  pdf.text(p.text, currentX, currentY);
                }
                currentX += partWidth;
              }
            }
          }
        }
        currentY += lhMm;
      }
    }
  }
}

// === API: Blob PDF (do uploadu), zapis do pliku, druk PDF ===
export async function generatePdfBlob(doc, dpi = DEFAULT_DPI) {
  if (!doc || !doc.page) throw new Error('Brak dokumentu do eksportu');
  const { widthMm, heightMm } = doc.page;
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  });
  await renderDocIntoPdf(pdf, doc, dpi);
  return pdf.output('blob');
}

export async function exportDocumentToPdf(
  doc,
  filename = 'CV.pdf',
  dpi = DEFAULT_DPI
) {
  const blob = await generatePdfBlob(doc, dpi);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function openPdfPrint(doc, dpi = DEFAULT_DPI) {
  const blob = await generatePdfBlob(doc, dpi);
  const url = URL.createObjectURL(blob);
  const w = window.open('', '_blank');
  if (!w) return;
  const html = `
    <html>
      <head><title>Print</title></head>
      <body style="margin:0">
        <iframe src="${url}" style="border:0; width:100vw; height:100vh" id="__cv_print_iframe"></iframe>
        <script>
          const ifr = document.getElementById('__cv_print_iframe');
          ifr.onload = () => { try { ifr.contentWindow && ifr.contentWindow.focus(); ifr.contentWindow && ifr.contentWindow.print(); } catch(e) {} };
        </script>
      </body>
    </html>`;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

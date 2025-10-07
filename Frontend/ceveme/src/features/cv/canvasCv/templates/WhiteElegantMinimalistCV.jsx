// buildWhiteElegantMinimalistCV.js — final JS/JSX version (bez TypeScript):
// - Sekcyjne paski akcentowe i linie są idealnie „na siebie” (lekki overlap).
// - Telefon, e-mail (mailto), adres oraz WSZYSTKIE linki (z ikonami) POD „O MNIE”
//   w pionowych wierszach: ikona po lewej, tekst po prawej, klikalne.
// - Umiejętności wyraźnie zmniejszone i ściśnięte.
// - Sekcje układają się dynamicznie jedna pod drugą (osobne kursory lewej i prawej kolumny).
// - Wszystkie nagłówki po polsku.

import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildWhiteElegantMinimalistCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  /* ---------- Konwersja ---------- */
  const PT_TO_MM = 0.3527778;
  const pt = (v) => v * PT_TO_MM;

  /* ---------- Strona ---------- */
  const PAGE_W = 210.0;
  const PAGE_H = 297.0;

  /* ---------- Kolory ---------- */
  const COLORS = {
    pageBg: '#F8F7F2',
    banner: '#555D50', // oliwkowo-szary (belka + paski + ikony kontaktów pod „O MNIE”)
    primary: '#333132',
    muted: '#737373',
    line: '#636466',
    photoPanel: '#EDE2D9',
    white: '#FFFFFF',
  };

  /* ---------- Siatka (pt → mm) ---------- */
  const GRID = {
    // LEWA
    leftTextX: pt(40.656),
    leftLineX1: pt(59.962),
    leftLineX2: pt(330.297),
    leftTextRight: pt(330.296),
    leftTextW: pt(330.296 - 40.656),

    // PRAWA
    rightColX: pt(375.042),
    rightTextX: pt(392.041),
    rightLineX1A: pt(396.113),
    rightLineX1: pt(375.042),
    rightLineX2: pt(544.088),
    rightTextW: pt(544.088 - 392.041),

    // początek treści pod belką
    startY: pt(214.558),
  };

  /* ---------- Nagłówek ---------- */
  const HEADER = {
    banner: { x: 0, y: pt(0.223), w: pt(595.172), h: pt(178.204) },
    photoPanel: { x: 0, y: 0, w: pt(178.65), h: pt(178.65) },
    photoCircleD: pt(143.608),
    firstNameFrame: {
      x: pt(208.993),
      y: pt(30.701),
      w: pt(207.233),
      h: pt(61.468),
    },
    lastNameFrame: {
      x: pt(208.993),
      y: pt(76.461),
      w: pt(247.193),
      h: pt(55.327),
    },
  };

  /* ---------- Dekor nagłówków sekcji ---------- */
  const DECOR = {
    lineH: pt(0.75),
    barH: pt(1.926),
    barW: pt(66.067),
    gapTitleToBar: pt(8.0),
    // overlap: linia „wchodzi” pod pasek o ~0.3 pt, więc optycznie się stykają
    lineOverlap: pt(0.3),
    gapHeaderToContent: pt(6.5),
  };

  /* ---------- Style ---------- */
  const STYLES = {
    // Nagłówek
    firstName: {
      fontFamily: 'Open Sans, sans-serif',
      fontWeight: 700,
      fontSize: 45.137,
      color: COLORS.white,
      lineHeight: 1.362,
    },
    lastName: {
      fontFamily: 'Open Sans, sans-serif',
      fontWeight: 400,
      fontSize: 40.627,
      color: COLORS.white,
      lineHeight: 1.362,
    },

    // Tytuły sekcji
    section: {
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 700,
      fontSize: 14.0,
      color: COLORS.primary,
      lineHeight: 1.3,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // LEWA: Doświadczenie / Projekty
    roleTitle: {
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 700,
      fontSize: 10.001,
      color: COLORS.primary,
      lineHeight: 1.28,
    },
    company: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 500,
      fontSize: 10.001,
      color: COLORS.primary,
      lineHeight: 1.25,
    },
    description: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: 8.003,
      color: COLORS.muted,
      lineHeight: 1.3,
      textAlign: 'left',
    },
    dateRight: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: 10.999,
      color: COLORS.primary,
      lineHeight: 1.2,
      textAlign: 'right',
    },
    techMuted: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: 8.003,
      color: COLORS.muted,
      lineHeight: 1.25,
    },
    linkMuted: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 500,
      fontSize: 8.003,
      color: COLORS.primary,
      lineHeight: 1.2,
    },

    // PRAWA: O mnie / Linki / Umiejętności / Edukacja
    para: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: 8.003,
      color: COLORS.muted,
      lineHeight: 1.3,
    },

    // >>> Umiejętności – ZMNIEJSZONE I ŚCIŚNIĘTE <<<
    listItem: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 500,
      fontSize: 8.4,
      color: COLORS.primary,
      lineHeight: 1.12,
    },
    groupTitle: {
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 700,
      fontSize: 9.6,
      color: COLORS.primary,
      lineHeight: 1.18,
    },

    // Wiersze linków/kontaktu pod „O MNIE”
    linkRow: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 500,
      fontSize: 8.6,
      color: COLORS.primary,
      lineHeight: 1.18,
    },

    // Edukacja (prawa)
    eduCourse: {
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 700,
      fontSize: 10.001,
      color: COLORS.primary,
      lineHeight: 1.24,
    },
    eduInst: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 500,
      fontSize: 10.001,
      color: COLORS.primary,
      lineHeight: 1.18,
    },
    eduDate: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: 10.001,
      color: COLORS.primary,
      lineHeight: 1.18,
      textAlign: 'right',
    },

    // RODO
    gdpr: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 400,
      fontSize: 7.5,
      color: COLORS.muted,
      lineHeight: 1.2,
      textAlign: 'justify',
    },
  };

  /* ---------- Ikony SVG (ciemne, pod „O MNIE”) ---------- */
  const ICONS_DARK = {
    phone: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.banner}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2
           19.8 19.8 0 0 1-8.63-3.07
           19.5 19.5 0 0 1-6-6
           19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3
           a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.61a2 2 0 0 1-.45 2.11L8.09 9.91
           a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45
           c.84.26 1.71.45 2.61.57A2 2 0 0 1 22 16.92z"/>
</svg>`,
    mail: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.banner}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
  <path d="M3 7l9 6 9-6"/>
</svg>`,
    pin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.banner}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 5.5-9 12-9 12s-9-6.5-9-12a9 9 0 1 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`,
    globe: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.banner}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
</svg>`,
    linkedin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.banner}">
  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07C13.62 8.84 15.24 8 17.5 8 22.1 8 24 10.62 24 15.22V24h-5v-7.4c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.82 1.91-2.82 3.89V24H8z"/>
</svg>`,
    github: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.banner}">
  <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.66-.22.66-.48
  0-.24-.01-.87-.02-1.7-2.77.6-3.36-1.34-3.36-1.34-.46-1.15-1.12-1.46-1.12-1.46-.9-.62.07-.61.07-.61
  1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94
  0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84
  c.85 0 1.71.11 2.5.34 1.9-1.3 2.75-1.03 2.75-1.03.54 1.38.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68
  0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.73 0 .27.18.58.69.48A10 10 0 0 0 22 12
  C22 6.48 17.52 2 12 2z"/></svg>`,
  };
  const SVG = (k) =>
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent((ICONS_DARK[k] || ICONS_DARK.globe).trim());

  /* ---------- Helpery ---------- */
  const rect = (x, y, w, h, color) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color }, stroke: null },
      })
    );

  const hLine = (x1, y, x2, color = COLORS.line) =>
    nodes.push(
      createShapeNode({
        frame: { x: x1, y, w: x2 - x1, h: DECOR.lineH },
        style: { fill: { color }, stroke: null },
      })
    );

  const textBlock = (x, y, w, text, style, opts = {}) => {
    const t = String(text ?? '');
    if (!t.trim()) return 0;
    const h = Math.max(pt(3), measureTextHeightMm(t, w, style));
    let xx = x;
    if (style?.textAlign === 'right' || style?.textAlign === 'center') {
      const est = estimateTextWidthMm(t, style);
      if (style.textAlign === 'right') xx = x + w - est;
      else xx = x + (w - est) / 2;
    }
    const node = createTextNode({
      frame: { x: xx, y, w, h },
      text: t,
      textStyle: style,
    });
    if (opts.link) node.link = opts.link;
    nodes.push(node);
    return h;
  };

  const estimateTextWidthMm = (t, style) => {
    const fsPt = Number(style?.fontSize || 12);
    const avgCharMm = fsPt * PT_TO_MM * 0.5; // to samo przybliżenie co w innych builderach
    return avgCharMm * String(t).length;
  };

  // Nagłówek sekcji z overlapem
  const drawSectionHeader = ({ xTitle, yTitle, label, xLine1, xLine2 }) => {
    const titleH = textBlock(xTitle, yTitle, pt(160), label, STYLES.section);
    const barY = yTitle + titleH + DECOR.gapTitleToBar;
    rect(xTitle, barY, DECOR.barW, DECOR.barH, COLORS.banner);
    // linia „wchodzi” pod pasek
    const lineY = barY + DECOR.barH - DECOR.lineOverlap;
    hLine(xLine1, lineY, xLine2);
    return lineY + DECOR.gapHeaderToContent; // start treści
  };

  // Wiersz kontaktu: ikona + tekst (klikalne)
  const contactRow = ({
    x,
    y,
    iconKey,
    label,
    link,
    iconSizePt = 12,
    gapPt = 8,
    wText,
  }) => {
    const size = pt(iconSizePt);
    nodes.push(
      createImageNode({
        frame: { x, y: y - size * 0.1, w: size, h: size },
        src: SVG(iconKey),
      })
    ); // minimalne uniesienie
    const h = textBlock(
      x + size + pt(gapPt),
      y - pt(1),
      wText - size - pt(gapPt),
      label,
      STYLES.linkRow,
      link ? { link } : {}
    );
    return Math.max(h, size);
  };

  // Linki (pod „O MNIE”)
  const normalizeLinks = (raw) => {
    const arr = Array.isArray(raw) ? raw : [];
    const out = [];
    for (const l of arr) {
      const url = typeof l === 'string' ? l : l?.url || l?.href || '';
      if (!url) continue;
      let label = 'Strona';
      let icon = 'globe';
      try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        if (host.includes('linkedin')) {
          label = 'LinkedIn';
          icon = 'linkedin';
        } else if (host.includes('github')) {
          label = 'GitHub';
          icon = 'github';
        } else {
          label = host;
          icon = 'globe';
        }
      } catch {
        label = url;
        icon = 'globe';
      }
      out.push({ label, icon, link: url });
    }
    return out;
  };

  /* ---------- Tło + belka + panel foto ---------- */
  rect(0, 0, PAGE_W, PAGE_H, COLORS.pageBg);
  rect(
    HEADER.banner.x,
    HEADER.banner.y,
    HEADER.banner.w,
    HEADER.banner.h,
    COLORS.banner
  );
  rect(
    HEADER.photoPanel.x,
    HEADER.photoPanel.y,
    HEADER.photoPanel.w,
    HEADER.photoPanel.h,
    COLORS.photoPanel
  );

  // Zdjęcie — koło
  const photoSrc = api?.personalData?.images;
  if (photoSrc) {
    const d = HEADER.photoCircleD;
    const cx = HEADER.photoPanel.x + HEADER.photoPanel.w / 2;
    const cy = HEADER.photoPanel.y + HEADER.photoPanel.h / 2;
    nodes.push(
      createImageNode({
        frame: { x: cx - d / 2, y: cy - d / 2, w: d, h: d },
        src: photoSrc,
        style: { cornerRadius: d / 2 },
      })
    );
  }

  // Imię i NAZWISKO (rozstrzelone)
  const fullName = String(api?.personalData?.name || 'Mariana Anderson').trim();
  const parts = fullName.split(/\s+/);
  const last = parts.length > 1 ? parts.pop() : '';
  const first = parts.join(' ') || last;
  const spacedLast = last ? last.split('').join(' ') : '';

  textBlock(
    HEADER.firstNameFrame.x,
    HEADER.firstNameFrame.y,
    HEADER.firstNameFrame.w,
    first,
    STYLES.firstName
  );
  textBlock(
    HEADER.lastNameFrame.x,
    HEADER.lastNameFrame.y,
    HEADER.lastNameFrame.w,
    spacedLast,
    STYLES.lastName
  );

  // Podpis (opcjonalnie)
  if (api?.headline) {
    const headY = HEADER.lastNameFrame.y + HEADER.lastNameFrame.h - pt(5.5);
    textBlock(HEADER.lastNameFrame.x, headY, pt(260), api.headline, {
      ...STYLES.para,
      color: COLORS.white,
      fontSize: 10.6,
    });
  }

  /* ==========================================================
     KURSORY KOLUMN I RYSOWANIE SEKCJI (dynamiczne układanie)
     ========================================================== */
  let leftY = GRID.startY;
  let rightY = GRID.startY;

  /* ---------- LEWA: DOŚWIADCZENIE ---------- */
  {
    let yStart = drawSectionHeader({
      xTitle: GRID.leftTextX,
      yTitle: leftY,
      label: 'DOŚWIADCZENIE',
      xLine1: GRID.leftLineX1,
      xLine2: GRID.leftLineX2,
    });
    leftY = yStart;

    const leftDateW = pt(60.2);
    const leftTitleW = GRID.leftTextW - leftDateW - pt(8);

    const experiences = Array.isArray(api?.experience) ? api.experience : [];
    for (const exp of experiences) {
      const tH = textBlock(
        GRID.leftTextX,
        leftY,
        leftTitleW,
        exp?.title || '',
        STYLES.roleTitle
      );
      textBlock(
        GRID.leftTextRight - leftDateW,
        leftY,
        leftDateW,
        exp?.period || '',
        STYLES.dateRight
      );
      leftY += Math.max(tH, pt(12.6));

      leftY += textBlock(
        GRID.leftTextX,
        leftY,
        GRID.leftTextW,
        exp?.company || '',
        STYLES.company
      );

      if (exp?.jobDescription)
        leftY += textBlock(
          GRID.leftTextX,
          leftY,
          GRID.leftTextW,
          exp.jobDescription,
          STYLES.description
        );

      const ach = Array.isArray(exp?.achievements)
        ? exp.achievements.map((a) => a?.description).filter(Boolean)
        : [];
      if (ach.length)
        leftY += textBlock(
          GRID.leftTextX,
          leftY,
          GRID.leftTextW,
          ach.map((s) => `• ${s}`).join('\n'),
          STYLES.description
        );

      leftY += pt(12); // ciaśniej
    }
  }

  /* ---------- LEWA: PROJEKTY ---------- */
  {
    let yStart = drawSectionHeader({
      xTitle: GRID.leftTextX,
      yTitle: leftY,
      label: 'PROJEKTY',
      xLine1: GRID.leftLineX1,
      xLine2: GRID.leftLineX2,
    });
    leftY = yStart;

    const projects = Array.isArray(api?.portfolio)
      ? api.portfolio.filter(Boolean)
      : [];
    for (const p of projects) {
      leftY += textBlock(
        GRID.leftTextX,
        leftY,
        GRID.leftTextW,
        p?.name || 'Projekt',
        STYLES.roleTitle
      );

      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      if (tech)
        leftY += textBlock(
          GRID.leftTextX,
          leftY,
          GRID.leftTextW,
          tech,
          STYLES.techMuted
        );

      if (p?.description)
        leftY += textBlock(
          GRID.leftTextX,
          leftY,
          GRID.leftTextW,
          p.description,
          STYLES.description
        );

      if (p?.url) {
        let host = '';
        try {
          host = new URL(p.url).hostname.replace(/^www\./, '');
        } catch {
            console.log("")
        }
        leftY += textBlock(
          GRID.leftTextX,
          leftY,
          GRID.leftTextW,
          host || p.url,
          STYLES.linkMuted,
          { link: p.url }
        );
      }

      const ach = Array.isArray(p?.achievements)
        ? p.achievements.map((a) => a?.description).filter(Boolean)
        : [];
      if (ach.length)
        leftY += textBlock(
          GRID.leftTextX,
          leftY,
          GRID.leftTextW,
          ach.map((s) => `• ${s}`).join('\n'),
          STYLES.description
        );

      leftY += pt(10);
    }
  }

  /* ---------- PRAWA: O MNIE + KONTAKT/LINKI POD ---------- */
  {
    let yStart = drawSectionHeader({
      xTitle: GRID.rightColX,
      yTitle: rightY,
      label: 'O MNIE',
      xLine1: GRID.rightLineX1A,
      xLine2: GRID.rightLineX2,
    });
    rightY = yStart;

    if (api?.summary)
      rightY +=
        textBlock(
          GRID.rightTextX,
          rightY,
          GRID.rightTextW,
          api.summary,
          STYLES.para
        ) + pt(3.5);
    if (api?.summary2)
      rightY +=
        textBlock(
          GRID.rightTextX,
          rightY,
          GRID.rightTextW,
          api.summary2,
          STYLES.para
        ) + pt(3.5);

    // KONTAKTY + LINKI
    const pd = api?.personalData || {};
    const rows = [];

    if (pd.phoneNumber)
      rows.push({
        icon: 'phone',
        label: String(pd.phoneNumber),
        link: `tel:${String(pd.phoneNumber).replace(/\s+/g, '')}`,
      });
    if (pd.email)
      rows.push({
        icon: 'mail',
        label: String(pd.email),
        link: `mailto:${pd.email}`,
      });
    if (pd.city) rows.push({ icon: 'pin', label: String(pd.city) });

    for (const l of normalizeLinks(pd.links))
      rows.push({ icon: l.icon, label: l.label, link: l.link });

    const iconSizePt = 11.5;
    const gapV = pt(6.8);
    for (const r of rows) {
      const usedH = contactRow({
        x: GRID.rightTextX,
        y: rightY,
        iconKey: r.icon,
        label: r.label,
        link: r.link,
        iconSizePt,
        gapPt: 7,
        wText: GRID.rightTextW,
      });
      rightY += Math.max(usedH, pt(10.5)) + gapV;
    }
  }

  /* ---------- PRAWA: UMIEJĘTNOŚCI (mocno ściśnięte) ---------- */
  {
    let yStart = drawSectionHeader({
      xTitle: GRID.rightColX,
      yTitle: rightY,
      label: 'UMIEJĘTNOŚCI',
      xLine1: GRID.rightLineX1,
      xLine2: GRID.rightLineX2,
    });
    rightY = yStart;

    const groups = Array.isArray(api?.skills) ? api.skills : [];
    const get = (cat) =>
      groups
        .find((g) => (g?.category || '').toLowerCase() === cat.toLowerCase())
        ?.items?.map((i) => i?.name || i)
        .filter(Boolean) || [];

    const blocks = [
      { label: 'Techniczne', items: get('Technical') },
      { label: 'Narzędzia', items: get('Tools') },
      { label: 'Miękkie', items: get('Soft') },
    ].filter((b) => b.items.length);

    const bulletSize = pt(2.2);
    const bulletX = pt(381.044);
    const textX = GRID.rightTextX;
    const rowGap = pt(6.8);

    for (const block of blocks) {
      rightY +=
        textBlock(
          GRID.rightTextX,
          rightY,
          GRID.rightTextW,
          block.label,
          STYLES.groupTitle
        ) + pt(1.0);
      for (const it of block.items) {
        const tH = measureTextHeightMm(
          String(it),
          GRID.rightTextW,
          STYLES.listItem
        );
        const cy = rightY + (tH - bulletSize) / 2;
        nodes.push(
          createShapeNode({
            frame: { x: bulletX, y: cy, w: bulletSize, h: bulletSize },
            style: { fill: { color: COLORS.primary }, stroke: null },
          })
        );
        textBlock(textX, rightY, GRID.rightTextW, it, STYLES.listItem);
        rightY += Math.max(tH, pt(7.0)) + rowGap;
      }
      rightY += pt(3);
    }
  }

  /* ---------- PRAWA: EDUKACJA ---------- */
  {
    let yStart = drawSectionHeader({
      xTitle: GRID.rightColX,
      yTitle: rightY,
      label: 'EDUKACJA',
      xLine1: GRID.rightLineX1A,
      xLine2: GRID.rightLineX2,
    });
    rightY = yStart;

    const edus = Array.isArray(api?.educations) ? api.educations : [];
    for (const e of edus) {
      const course = [e?.degree, e?.specialization].filter(Boolean).join(' — ');
      if (course)
        rightY += textBlock(
          GRID.rightTextX,
          rightY,
          GRID.rightTextW,
          course,
          STYLES.eduCourse
        );

      const leftW = GRID.rightTextW * 0.62;
      const rightW = GRID.rightTextW - leftW;
      const ih = textBlock(
        GRID.rightTextX,
        rightY,
        leftW,
        e?.institution || '',
        STYLES.eduInst
      );
      textBlock(
        GRID.rightTextX + leftW,
        rightY,
        rightW,
        e?.period || '',
        STYLES.eduDate
      );
      rightY += Math.max(ih, pt(11));

      if (e?.description)
        rightY += textBlock(
          GRID.rightTextX,
          rightY,
          GRID.rightTextW,
          e.description,
          STYLES.para
        );

      rightY += pt(7.2);
    }
  }

  /* ---------- RODO (stopka) ---------- */
  const gdpr =
    api?.gdprClause || api?.personalData?.gdprClause || api?.gdpr || '';
  if (gdpr) {
    const x = GRID.leftTextX;
    const w = GRID.rightLineX2 - GRID.leftTextX;
    const bottomMargin = pt(16);
    const h = measureTextHeightMm(gdpr, w, STYLES.gdpr);
    const y = PAGE_H - bottomMargin - h;
    textBlock(x, y, w, gdpr, STYLES.gdpr);
  }

  /* ---------- Finalizacja ---------- */
  doc.nodes = nodes;
  doc.meta = { data: api, template: 'WhiteElegantMinimalistCV' };
  return doc;
}

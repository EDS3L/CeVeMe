// modernTurquoiseCv.js — białe SVG, klikalne chipy; poprawione dopasowanie ikon (LinkedIn/telefon)
import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildModernTurquoiseCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // --- Strona i siatka (mm) ---
  const PAGE_W = 210.08;
  const PAGE_H = 296.95;

  const CONTENT = { x: 9.21, y: 82.12, w: 191.67, h: 205.89 };
  const ACCENT = { x: CONTENT.x, y: CONTENT.y, w: CONTENT.w, h: 2.53 };

  // Siatka
  const COL_GAP = 16.49;
  const LEFT_COL = { x: 14.89, w: 110.0 };
  const CONTENT_R = CONTENT.x + CONTENT.w;
  const RIGHT_COL = {
    x: LEFT_COL.x + LEFT_COL.w + COL_GAP,
    w: Math.max(42, CONTENT_R - (LEFT_COL.x + LEFT_COL.w + COL_GAP)),
  };

  // --- Kolory ---
  const COLORS = {
    pageBg: '#F5F7FB',
    sheetBg: '#FFFFFF',
    accent: '#20BEC6',
    textDark: '#333132',
    textMuted: '#737373',
    headerDark: '#323B4B',
  };

  // --- Białe ikony SVG (data:) ---
  const ICON_SVGS = {
    phone: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
     fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
  <path d="M3 7l9 6 9-6"/>
</svg>`,
    pin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 5.5-9 12-9 12s-9-6.5-9-12a9 9 0 1 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`,
    globe: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
</svg>`,
    link: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 7h3a5 5 0 1 1 0 10h-3"/>
  <path d="M9 17H6a5 5 0 1 1 0-10h3"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,
    linkedin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07C13.62 8.84 15.24 8 17.5 8 22.1 8 24 10.62 24 15.22V24h-5v-7.4c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.82 1.91-2.82 3.89V24H8z"/>
</svg>`,
    github: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.66-.22.66-.48
  0-.24-.01-.87-.02-1.7-2.77.6-3.36-1.34-3.36-1.34-.46-1.15-1.12-1.46-1.12-1.46-.9-.62.07-.61.07-.61
  1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94
  0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84
  c.85 0 1.71.11 2.5.34 1.9-1.3 2.75-1.03 2.75-1.03.54 1.38.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68
  0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.73 0 .27.18.58.69.48A10 10 0 0 0 22 12
  C22 6.48 17.52 2 12 2z"/></svg>`,
    gitlab: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M22.65 13.39l-2.02-6.21a.7.7 0 0 0-1.33 0l-1.36 4.2H6.06l-1.36-4.2a.7.7 0 0 0-1.33 0L1.35 13.4a1.9 1.9 0 0 0 .69 2.1l9.02 6.53a1.9 1.9 0 0 0 2.2 0l9.02-6.53c.74-.54 1.05-1.5.7-2.11z"/></svg>`,
    twitter: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.54A4.48 4.48 0 0 0 22.4 1s-4.2 2-6.6 2c-3.87 0-6.6 3.53-5.75 7.25A12.94 12.94 0 0 1 1.64 3.16s-4 9 5 13a13 13 0 0 1-7.9 2.3c9 5.8 20 0 20-11.5 0-.18 0-.35-.02-.53A7.72 7.72 0 0 0 23 3z"/></svg>`,
    facebook: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.9h-2.34v7A10 10 0 0 0 22 12z"/></svg>`,
    instagram: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/></svg>`,
  };
  const SVG = (k) =>
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent((ICON_SVGS[k] || ICON_SVGS.link).trim());

  // --- Typografia (bez zmian merytorycznych) ---
  const FONTS = {
    garetBold52: {
      fontFamily: 'Garet, sans-serif',
      fontSize: 45,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.35,
    },
    garetReg45: {
      fontFamily: 'Garet, sans-serif',
      fontSize: 38,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.35,
    },
    garetReg12: {
      fontFamily: 'Garet, sans-serif',
      fontSize: 12.0,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.3,
    },

    section15: {
      fontFamily: 'Garet, sans-serif',
      fontSize: 15.01,
      fontWeight: 700,
      color: COLORS.headerDark,
      lineHeight: 1.45,
      textTransform: 'uppercase',
    },

    openSans8: {
      fontFamily: 'Open Sans, sans-serif',
      fontSize: 8.0,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.36,
    },
    openSans7_6: {
      fontFamily: 'Open Sans, sans-serif',
      fontSize: 7.6,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.28,
    },

    poppins11: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 11.0,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.4,
    },
    poppins10b: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 10.0,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.4,
    },
    poppins10: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 10.0,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.4,
    },
    poppins9b: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 9.0,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.4,
    },
    poppins8: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 8.0,
      fontWeight: 400,
      color: COLORS.textMuted,
      lineHeight: 1.4,
    },
    poppins8b: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 8.0,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.4,
    },
    poppins8_8b: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 8.79,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.4,
    },

    lato10b: {
      fontFamily: 'Lato, sans-serif',
      fontSize: 10.0,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.2,
    },
    lato11b_c: {
      fontFamily: 'Lato, sans-serif',
      fontSize: 10.6,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.18,
    },
    lato9b_c: {
      fontFamily: 'Lato, sans-serif',
      fontSize: 9.1,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.18,
    },
    lato12b: {
      fontFamily: 'Lato, sans-serif',
      fontSize: 12.0,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.2,
    },
  };

  // --- Helpers ---
  const rect = (x, y, w, h, color) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color }, stroke: null },
      })
    );

  const measureH = (t, w, style) =>
    Math.max(3.2, measureTextHeightMm(String(t ?? ''), w, style));

  const text = (x, y, w, t, style) => {
    const s = (t ?? '').toString();
    if (!s.trim()) return 0;
    const h = measureH(s, w, style);
    nodes.push(
      createTextNode({ frame: { x, y, w, h }, text: s, textStyle: style })
    );
    return h;
  };

  const imageCircle = (src, x, y, sizeMm) => {
    if (!src) return;
    nodes.push(
      createImageNode({
        frame: { x, y, w: sizeMm, h: sizeMm },
        src,
        style: { cornerRadius: sizeMm / 2 },
      })
    );
  };

  // === CHIP KONTAKTU: powiększona średnica + per-ikona skala, overlay-link ===
  const CHIP = { D: 6.0, GAP: 2.6, CHIP_GAP: 5.0 }; // ⬅ większe kółko

  // Różne SVG mają różne „optyczne” wypełnienie – delikatna korekta skali:
  const ICON_SCALE = {
    linkedin: 0.58,
    phone: 0.6,
    mail: 0.62,
    pin: 0.6,
    globe: 0.62,
    link: 0.62,
    github: 0.62,
    gitlab: 0.62,
    twitter: 0.62,
    facebook: 0.62,
    instagram: 0.62,
  };
  const fitInner = (key) => Math.max(3.2, CHIP.D * (ICON_SCALE[key] ?? 0.62)); // min zabezpiecza przed zbyt małą ikoną

  const contactChip = (cx, centerY, iconKey, label, labelW, link) => {
    if (!label) return { w: 0, h: 0 };

    const labelStyle = FONTS.openSans7_6;
    const labelH = measureH(label, labelW, labelStyle);
    const blockH = Math.max(CHIP.D, labelH);
    const topY = centerY - blockH / 2;

    // kółko
    const circleY = topY + (blockH - CHIP.D) / 2;
    nodes.push(
      createShapeNode({
        frame: { x: cx, y: circleY, w: CHIP.D, h: CHIP.D },
        style: {
          fill: { color: COLORS.headerDark },
          stroke: null,
          cornerRadius: CHIP.D / 2,
        },
      })
    );

    // ikona SVG (biała)
    const inner = fitInner(iconKey); // dopasowana do kółka
    nodes.push(
      createImageNode({
        frame: {
          x: cx + (CHIP.D - inner) / 2,
          y: circleY + (CHIP.D - inner) / 2,
          w: inner,
          h: inner,
        },
        src: SVG(iconKey),
      })
    );

    // overlay link na kółko (klik na samej ikonie)
    if (link) {
      const overlay = createTextNode({
        frame: { x: cx, y: circleY, w: CHIP.D, h: CHIP.D },
        text: ' ',
        textStyle: { fontSize: 1, color: 'transparent' },
      });
      overlay.link = link;
      nodes.push(overlay);
    }

    // etykieta (też klikalna)
    const labelX = cx + CHIP.D + CHIP.GAP;
    const labelY = topY + (blockH - labelH) / 2;
    const labelNode = createTextNode({
      frame: { x: labelX, y: labelY, w: labelW, h: labelH },
      text: label,
      textStyle: labelStyle,
    });
    if (link) labelNode.link = link;
    nodes.push(labelNode);

    return { w: CHIP.D + CHIP.GAP + labelW, h: blockH };
  };

  // Normalizacja linków z API – dobra etykieta + ikona
  const normalizeLinks = (raw) => {
    const out = [];
    const arr = Array.isArray(raw) ? raw : [];
    for (const l of arr) {
      const url = typeof l === 'string' ? l : l?.url || l?.href || '';
      if (!url) continue;
      let key = (typeof l === 'string' ? '' : l?.type || l?.name || '')
        .toString()
        .toLowerCase();
      let label = 'Strona';
      try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        if (host.includes('linkedin')) {
          key ||= 'linkedin';
          label = 'LinkedIn';
        } else if (host.includes('github')) {
          key ||= 'github';
          label = 'GitHub';
        } else if (host.includes('gitlab')) {
          key ||= 'gitlab';
          label = 'GitLab';
        } else if (host.includes('twitter') || host.includes('x.com')) {
          key ||= 'twitter';
          label = 'Twitter';
        } else if (host.includes('facebook')) {
          key ||= 'facebook';
          label = 'Facebook';
        } else if (host.includes('instagram')) {
          key ||= 'instagram';
          label = 'Instagram';
        } else {
          key ||= 'globe';
          label = 'Strona';
        }
      } catch {
        key ||= 'globe';
        label = 'Strona';
      }
      out.push({ key, label, url });
    }
    return out;
  };

  // --- Tło i arkusz ---
  rect(0, 0, PAGE_W, PAGE_H, COLORS.pageBg);
  rect(CONTENT.x, CONTENT.y, CONTENT.w, CONTENT.h, COLORS.sheetBg);
  rect(ACCENT.x, ACCENT.y, ACCENT.w, ACCENT.h, COLORS.accent);

  // --- HEADER ---
  const pd = api?.personalData || {};
  const fullName = (pd.name || '').trim();
  let first = '',
    last = '';
  if (fullName) {
    const parts = fullName.split(/\s+/);
    last = parts.length > 1 ? parts.pop() : '';
    first = parts.join(' ') || last;
  }

  // Foto (opcjonalnie)
  imageCircle(pd.images, 15.3, 14.8, 42.84);

  // Imię i nazwisko + tytuł
  const nameX = LEFT_COL.x + 57;
  let nameY = 15;
  if (first) nameY += text(nameX, nameY, 50, first, FONTS.garetBold52);
  if (last) nameY += text(nameX, nameY - 10, 50, last, FONTS.garetReg45);
  const headline = (api?.headline || '').trim();
  if (headline)
    // eslint-disable-next-line no-unused-vars
    nameY += text(nameX, nameY - 15, 120, headline, FONTS.garetReg12);

  // Pasek kontaktów — wszystkie pozycje, ciasno i klikalnie
  const chips = [];
  if (pd.phoneNumber)
    chips.push({
      icon: 'phone',
      label: pd.phoneNumber,
      link: `tel:${String(pd.phoneNumber).replace(/\s+/g, '')}`,
    });
  if (pd.email)
    chips.push({ icon: 'mail', label: pd.email, link: `mailto:${pd.email}` });
  if (pd.city) chips.push({ icon: 'pin', label: pd.city, link: '' });
  for (const l of normalizeLinks(pd.links)) {
    chips.push({ icon: l.key, label: l.label, link: l.url });
  }

  if (chips.length) {
    const centerY = CONTENT.y - 10; // oś paska chipów
    const areaX = CONTENT.x + 10;
    const areaW = CONTENT.w - 20;

    // policz labelW tak, aby całość zmieściła się w jednej linii (z większym D)
    const fixed =
      chips.length * (CHIP.D + CHIP.GAP) + (chips.length - 1) * CHIP.CHIP_GAP;
    const minLabel = 22;
    let labelW = Math.max(minLabel, (areaW - fixed) / chips.length);

    let total =
      chips.length * (CHIP.D + CHIP.GAP + labelW) +
      (chips.length - 1) * CHIP.CHIP_GAP;
    if (total > areaW) {
      labelW = minLabel;
      total =
        chips.length * (CHIP.D + CHIP.GAP + labelW) +
        (chips.length - 1) * CHIP.CHIP_GAP;
    }

    let cx = areaX + (areaW - total) / 2;
    for (const c of chips) {
      const used = contactChip(
        cx,
        centerY,
        c.icon,
        c.label,
        labelW,
        c.link || null
      );
      cx += used.w + CHIP.CHIP_GAP;
    }
  }

  // --- Treść (bez zmian) ---
  const SECTION_GAP = 3.2;
  const ITEM_GAP = 2.4;

  // LEWA: Doświadczenie + Projekty + Referencje
  let ly = CONTENT.y + ACCENT.h + 4;

  const experiences = Array.isArray(api?.experience)
    ? api.experience.filter(Boolean)
    : [];
  if (experiences.length) {
    ly +=
      text(
        LEFT_COL.x,
        ly,
        LEFT_COL.w,
        'DOŚWIADCZENIE ZAWODOWE',
        FONTS.section15
      ) + 1.0;

    for (const exp of experiences) {
      const title = (exp?.title || '').trim();
      const period = (exp?.period || '').trim();

      const leftW = LEFT_COL.w * 0.6;
      const rightW = LEFT_COL.w - leftW;
      const tH = text(LEFT_COL.x, ly, leftW, title, FONTS.poppins10);
      const pH = text(LEFT_COL.x + leftW, ly, rightW, period, {
        ...FONTS.poppins11,
        textAlign: 'right',
      });
      ly += Math.max(tH, pH);

      const companyLine =
        [exp?.company, exp?.location].filter(Boolean).join(' | ') ||
        exp?.company ||
        '';
      ly += text(LEFT_COL.x, ly, LEFT_COL.w, companyLine, FONTS.lato10b);

      if (exp?.jobDescription)
        ly += text(
          LEFT_COL.x,
          ly,
          LEFT_COL.w,
          exp.jobDescription,
          FONTS.poppins8
        );

      const ach = Array.isArray(exp?.achievements)
        ? exp.achievements.map((a) => a?.description).filter(Boolean)
        : [];
      if (ach.length)
        ly += text(
          LEFT_COL.x,
          ly,
          LEFT_COL.w,
          ach.map((s) => `• ${s}`).join('\n'),
          FONTS.poppins8
        );

      ly += ITEM_GAP;
    }
    ly += SECTION_GAP;
  }

  // PROJEKTY — LEWA
  const projects = Array.isArray(api?.portfolio)
    ? api.portfolio.filter(Boolean)
    : [];
  if (projects.length) {
    ly += text(LEFT_COL.x, ly, LEFT_COL.w, 'PROJEKTY', FONTS.section15) + 1.0;
    for (const p of projects) {
      if (p?.name)
        ly += text(LEFT_COL.x, ly, LEFT_COL.w, p.name, FONTS.lato10b);
      const techLine = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      if (techLine)
        ly += text(LEFT_COL.x, ly, LEFT_COL.w, techLine, FONTS.poppins8);
      const ach = (p?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean);
      if (ach.length)
        ly += text(
          LEFT_COL.x,
          ly,
          LEFT_COL.w,
          ach.map((s) => `• ${s}`).join('\n'),
          FONTS.poppins8
        );
      if (p?.url) ly += text(LEFT_COL.x, ly, LEFT_COL.w, p.url, FONTS.poppins8);
      ly += ITEM_GAP;
    }
    ly += SECTION_GAP;
  }

  // REFERENCJE
  const refs = Array.isArray(api?.references)
    ? api.references.filter(Boolean)
    : [];
  if (refs.length) {
    ly += text(LEFT_COL.x, ly, LEFT_COL.w, 'REFERENCJE', FONTS.section15) + 1.0;
    const gap = 6;
    const colW = (LEFT_COL.w - gap) / 2;
    let rx = LEFT_COL.x;
    let rmax = ly;
    for (let i = 0; i < Math.min(2, refs.length); i++) {
      const r = refs[i];
      let ry = ly + 2;
      ry += text(rx, ry, colW, r?.name || '', FONTS.lato12b);
      const role =
        [r?.company, r?.position].filter(Boolean).join(' / ') || r?.role || '';
      ry += text(rx, ry, colW, role, FONTS.lato10b) + 1.0;
      if (r?.phone)
        ry += text(rx, ry, colW, `Telefon: ${r.phone}`, FONTS.poppins8b);
      if (r?.email)
        ry += text(rx, ry, colW, `Email: ${r.email}`, FONTS.poppins8b);
      rmax = Math.max(rmax, ry);
      rx += colW + gap;
    }
    ly = rmax + SECTION_GAP;
  }

  // PRAWA kolumna
  let ry = CONTENT.y + ACCENT.h + 4;

  if ((api?.summary || '').trim()) {
    ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, 'O MNIE', FONTS.section15) + 1.0;
    ry +=
      text(RIGHT_COL.x, ry, RIGHT_COL.w, api.summary, FONTS.poppins8) +
      SECTION_GAP;
  }

  // EDUKACJA
  const EDU_ITEM_GAP = 1.2;
  const edus = Array.isArray(api?.educations)
    ? api.educations.filter(Boolean)
    : [];
  if (edus.length) {
    ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, 'EDUKACJA', FONTS.section15) + 1.0;
    for (const e of edus) {
      const course = [e?.degree, e?.specialization].filter(Boolean).join(' — ');
      if (course)
        ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, course, FONTS.lato11b_c);
      if (e?.institution)
        ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, e.institution, FONTS.lato9b_c);
      if (e?.period)
        ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, e.period, FONTS.poppins8_8b);
      ry += EDU_ITEM_GAP;
    }
    ry += SECTION_GAP;
  }

  // UMIEJĘTNOŚCI
  const groups = Array.isArray(api?.skills) ? api.skills : [];
  const listBy = (name) =>
    groups
      .find((g) => (g?.category || '').toLowerCase() === name.toLowerCase())
      ?.items?.map((i) => i?.name || i)
      .filter(Boolean) || [];
  const tech = listBy('Technical'),
    tools = listBy('Tools'),
    soft = listBy('Soft');

  if (tech.length || tools.length || soft.length) {
    ry +=
      text(RIGHT_COL.x, ry, RIGHT_COL.w, 'UMIEJĘTNOŚCI', FONTS.section15) + 1.0;
    if (tech.length) {
      ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, 'Techniczne', FONTS.poppins9b);
      ry +=
        text(
          RIGHT_COL.x,
          ry,
          RIGHT_COL.w,
          tech.map((s) => `• ${s}`).join('\n'),
          FONTS.poppins8
        ) + 1.0;
    }
    if (tools.length) {
      ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, 'Narzędzia', FONTS.poppins9b);
      ry +=
        text(
          RIGHT_COL.x,
          ry,
          RIGHT_COL.w,
          tools.map((s) => `• ${s}`).join('\n'),
          FONTS.poppins8
        ) + 1.0;
    }
    if (soft.length) {
      ry += text(RIGHT_COL.x, ry, RIGHT_COL.w, 'Miękkie', FONTS.poppins9b);
      ry +=
        text(
          RIGHT_COL.x,
          ry,
          RIGHT_COL.w,
          soft.map((s) => `• ${s}`).join('\n'),
          FONTS.poppins8
        ) + 1.0;
    }
    ry += SECTION_GAP;
  }

  // CERTYFIKATY
  const certs = Array.isArray(api?.certificates)
    ? api.certificates.filter(Boolean)
    : [];
  if (certs.length) {
    ry +=
      text(RIGHT_COL.x, ry, RIGHT_COL.w, 'CERTYFIKATY', FONTS.section15) + 1.0;
    for (const c of certs) {
      const meta = [c?.issuer, c?.data || c?.date].filter(Boolean).join(' • ');
      if (c?.name)
        ry += text(
          RIGHT_COL.x,
          ry,
          RIGHT_COL.w,
          `• ${c.name}`,
          FONTS.poppins8b
        );
      if (meta)
        ry += text(RIGHT_COL.x + 3, ry, RIGHT_COL.w - 3, meta, FONTS.poppins8);
      ry += 1.0;
    }
  }

  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

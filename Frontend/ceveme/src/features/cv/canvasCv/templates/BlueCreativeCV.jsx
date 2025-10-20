import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildBlueCreativeCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // --- Strona ---
  const PAGE_W = 210.0;
  const PAGE_H = 297.0;

  // --- Kolory (wg briefu) ---
  const COLORS = {
    headerLeft: '#2E465C',
    headerRight: '#2B4257',
    headerText: '#DDC6A4',
    text: '#333132',
    muted: '#6f7a86',
    rule: '#e6e9ee',
    bullet: '#9aa4af',
  };

  // --- Layout ---
  const HEADER_H = 50; // mniejszy, zwarty header (pełna szerokość, bez marginesu)
  const CONTENT_MARGIN_X = 5; // marginesy treści (nagłówek jest bez marginesu)
  const COL_GAP = 5;
  const LEFT_W = Math.floor((PAGE_W - 2 * CONTENT_MARGIN_X - COL_GAP) * 0.62);
  const RIGHT_W = PAGE_W - 2 * CONTENT_MARGIN_X - COL_GAP - LEFT_W;
  const LEFT_X = CONTENT_MARGIN_X;
  const RIGHT_X = CONTENT_MARGIN_X + LEFT_W + COL_GAP;
  const CONTENT_TOP = HEADER_H + 5;

  const SVG = (k) =>
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent((ICON_SVGS[k] || ICON_SVGS.link).trim());

  const ICON_SVGS = {
    phone: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
  <path d="M3 7l9 6 9-6"/>
</svg>`,
    link: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 7h3a5 5 0 1 1 0 10h-3M9 17H6a5 5 0 1 1 0-10h3"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,
    pin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 5.5-9 12-9 12s-9-6.5-9-12a9 9 0 1 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`,
  };

  // --- Style ---
  const NAME = {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: 24,
    color: COLORS.headerText,
    letterSpacing: 2.8,
    textAlign: 'center',
    lineHeight: 1.15,
  };
  const ROLE = {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: 9.5,
    color: COLORS.headerText,
    letterSpacing: 3.2,
    textAlign: 'center',
  };
  const SECTION = {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: 11.2,
    color: COLORS.text,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  };
  const SUBTITLE = {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: 8.9,
    color: COLORS.text,
  };
  const BODY = {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 400,
    fontSize: 8.2,
    color: COLORS.text,
    lineHeight: 1.42,
  };
  const BODY_MUTED = { ...BODY, color: COLORS.muted };
  const DATE_RIGHT = {
    ...BODY,
    fontWeight: 600,
    textAlign: 'right',
  };
  const LINK = {
    ...BODY,
    fontWeight: 600,
    color: COLORS.text,
  };

  // --- Helpers ---
  const hline = (x, y, w, h = 0.6, color = COLORS.rule) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color, opacity: 1 }, stroke: null },
      })
    );

  const text = (x, y, w, t, style = {}, opts = {}) => {
    const s = String(t ?? '');
    if (!s.trim()) return 0;
    const h = Math.max(3.2, measureTextHeightMm(s, w, style));

    const align = opts.align || style?.textAlign || style?.alignment || null;
    const textStyle = { ...(style || {}) };
    if (align) {
      textStyle.textAlign = align;
      textStyle.alignment = align;
      textStyle.align = align;
      textStyle.justify = align;
    }

    const node = createTextNode({
      frame: { x, y, w, h },
      text: s,
      textStyle,
    });

    if (align) {
      node.textAlign = align;
      node.alignment = align;
      node.align = align;
    }
    if (opts.link) node.link = opts.link;
    nodes.push(node);
    return h;
  };

  const bulletList = (x, y, w, items) => {
    if (!items?.length) return 0;
    const s = items.map((i) => `• ${i}`).join('\n');
    return text(x, y, w, s, BODY);
  };

  const hostFromUrl = (u) => {
    try {
      return new URL(u).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  };

  const formatPeriod = (raw) => {
    if (!raw) return '';
    const s = String(raw).trim();
    const parts = s.split(/\s*(?:–|—|-)\s*/);
    const fmt = parts
      .map((p) => {
        const t = p.trim().toLowerCase();
        if (!t) return '';
        if (t.includes('obec') || t.includes('present') || t.includes('now'))
          return 'obecnie';
        // YYYY-MM or YYYY.MM or YYYY/MM or YYYYMM
        let m = t.match(/^(\d{4})[.\-/]?(\d{1,2})$/);
        if (m) return `${m[2].padStart(2, '0')}.${m[1]}`;
        // MM-YYYY or MM.YYYY
        m = t.match(/^(\d{1,2})[.\-/]?(\d{4})$/);
        if (m) return `${m[1].padStart(2, '0')}.${m[2]}`;
        // YYYY only
        m = t.match(/^(\d{4})$/);
        if (m) return m[1];
        // fallback – try to parse patterns like YYYYMM
        m = t.match(/^(\d{4})(\d{2})$/);
        if (m) return `${m[2]}.${m[1]}`;
        return p.trim();
      })
      .filter(Boolean);
    return fmt.join(' - ');
  };

  // --- HEADER: dwa trójkąty prostokątne z przekątną ---
  {
    const headerSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${PAGE_W} ${HEADER_H}" preserveAspectRatio="none">
  <!-- lewy-dolny trójkąt -->
  <polygon points="0,${HEADER_H} 0,0 ${PAGE_W},${HEADER_H}"
           fill="#3d5163" stroke="none"/>
  <!-- prawy-górny trójkąt z lekkim nakładaniem -->
  <polygon points="${PAGE_W},0 ${PAGE_W},${HEADER_H} -1,0"
           fill="#4a6275" stroke="none"/>

</svg>`.trim();
    nodes.push(
      createImageNode({
        frame: { x: 0, y: 0, w: PAGE_W, h: HEADER_H },
        src:
          'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(headerSvg),
      })
    );
  }

  // Imię i nazwisko + stanowisko (środkowane na całą szerokość nagłówka)
  const fullName = String(
    api?.personalData?.name || 'Imię Nazwisko'
  ).toUpperCase();
  const role = String(api?.headline || '')
    .toUpperCase()
    .trim();

  // nagłówek używa całej szerokości strony, tekst wyśrodkowany bez nadmiernego letterSpacing
  const textAreaWidth = PAGE_W;
  const textStartX = 0;

  let headerY = (HEADER_H - 24) / 2;
  headerY += text(textStartX, headerY, textAreaWidth, fullName, {
    ...NAME,
    letterSpacing: 0,
    textAlign: 'center',
  });

  if (role) {
    // eslint-disable-next-line no-unused-vars
    headerY += text(textStartX, headerY - 1.5, textAreaWidth, role, {
      ...ROLE,
      letterSpacing: 0,
      textAlign: 'center',
    });
  }

  /* ===================== LEWA KOLUMNA ====================== */
  let ly = CONTENT_TOP;

  // DOŚWIADCZENIE
  ly += text(LEFT_X, ly, LEFT_W, 'Doświadczenie', SECTION);
  hline(LEFT_X, ly, LEFT_W);
  ly += 2;

  const experiences = Array.isArray(api?.experience) ? api.experience : [];
  for (const exp of experiences) {
    // tytuł + data po prawej
    const leftW = LEFT_W * 0.62;
    const rightW = LEFT_W - leftW;
    const tH = text(LEFT_X, ly, leftW, exp?.title || '', SUBTITLE);
    text(LEFT_X + leftW, ly, rightW, exp?.period || '', DATE_RIGHT);
    ly += Math.max(tH, 1.5);

    // firma + miasto (sub)
    const sub =
      [exp?.company, exp?.location].filter(Boolean).join(' • ') ||
      exp?.company ||
      '';
    if (sub) ly += text(LEFT_X, ly, LEFT_W, sub, BODY_MUTED);

    if (exp?.jobDescription)
      ly += text(LEFT_X, ly, LEFT_W, exp.jobDescription, BODY);

    const ach = Array.isArray(exp?.achievements)
      ? exp.achievements.map((a) => a?.description).filter(Boolean)
      : [];
    if (ach.length) ly += bulletList(LEFT_X, ly, LEFT_W, ach);

    ly += 2;
  }

  // PORTFOLIO
  ly += 2;
  ly += text(LEFT_X, ly, LEFT_W, 'Portfolio', SECTION);
  hline(LEFT_X, ly, LEFT_W);
  ly += 1;

  const projects = Array.isArray(api?.portfolio) ? api.portfolio : [];
  for (const p of projects) {
    if (p?.name) ly += text(LEFT_X, ly, LEFT_W, p.name, SUBTITLE);
    const tech = (p?.technologies || [])
      .map((t) => t?.name)
      .filter(Boolean)
      .join(' • ');
    if (tech) ly += text(LEFT_X, ly - 2, LEFT_W, tech, BODY_MUTED);
    if (p?.description) ly += text(LEFT_X, ly - 2, LEFT_W, p.description, BODY);

    if (p?.url) {
      const host = hostFromUrl(p.url) || p.url;
      ly += text(LEFT_X, ly - 2, LEFT_W, host, LINK, { link: p.url });
    }

    const pAch = (p?.achievements || [])
      .map((a) => a?.description)
      .filter(Boolean);
    if (pAch.length) ly += bulletList(LEFT_X, ly - 2, LEFT_W, pAch);

    ly += 1;
  }

  const langs = Array.isArray(api?.languages) ? api.languages : [];
  if (langs.length) {
    ly += text(LEFT_X, ly, LEFT_W, 'Języki', SECTION);
    hline(LEFT_X, ly, LEFT_W);
    ly += 1.5;

    const langLines = langs
      .map((l) => {
        const name = l?.language || l?.name || l?.lang || '';
        const level = l?.level || l?.proficiency || l?.levelName || '';
        if (!name) return null;
        return level ? `${name} — ${level}` : `${name}`;
      })
      .filter(Boolean)
      .join('\n');

    if (langLines) ly += text(LEFT_X, ly, LEFT_W, langLines, BODY) + 1;
    ly += 1;
  }

  /* ===================== PRAWA KOLUMNA ===================== */
  let ry = CONTENT_TOP;

  // KONTAKT
  ry += text(RIGHT_X, ry, RIGHT_W, 'Kontakt', SECTION);
  hline(RIGHT_X, ry, RIGHT_W);
  ry += 1.5;

  const pd = api?.personalData || {};
  const ICON_D = 4.6;
  const ICON_GAP = 2.5;
  if (pd.phoneNumber) {
    const t = String(pd.phoneNumber);
    const h = Math.max(
      3.2,
      measureTextHeightMm(t, RIGHT_W - ICON_D - ICON_GAP, BODY)
    );
    nodes.push(
      createImageNode({
        frame: { x: RIGHT_X, y: ry + (h - ICON_D) / 2, w: ICON_D, h: ICON_D },
        src: SVG('phone'),
        style: { cornerRadius: 0 },
      })
    );
    ry += text(
      RIGHT_X + ICON_D + ICON_GAP,
      ry,
      RIGHT_W - ICON_D - ICON_GAP,
      t,
      BODY,
      {
        link: `tel:${String(pd.phoneNumber).replace(/\s+/g, '')}`,
      }
    );
  }
  if (pd.email) {
    const t = String(pd.email);
    const h = Math.max(
      3.2,
      measureTextHeightMm(t, RIGHT_W - ICON_D - ICON_GAP, BODY)
    );
    nodes.push(
      createImageNode({
        frame: { x: RIGHT_X, y: ry + (h - ICON_D) / 2, w: ICON_D, h: ICON_D },
        src: SVG('mail'),
      })
    );
    ry += text(
      RIGHT_X + ICON_D + ICON_GAP,
      ry,
      RIGHT_W - ICON_D - ICON_GAP,
      t,
      BODY,
      {
        link: `mailto:${pd.email}`,
      }
    );
  }
  if (pd.city) {
    const t = String(pd.city);
    const h = Math.max(
      3.2,
      measureTextHeightMm(t, RIGHT_W - ICON_D - ICON_GAP, BODY)
    );
    nodes.push(
      createImageNode({
        frame: { x: RIGHT_X, y: ry + (h - ICON_D) / 2, w: ICON_D, h: ICON_D },
        src: SVG('pin'),
      })
    );
    ry += text(
      RIGHT_X + ICON_D + ICON_GAP,
      ry,
      RIGHT_W - ICON_D - ICON_GAP,
      t,
      BODY
    );
  }

  // dodatkowe linki (ikon nie dokładamy – prosty, elegancki wiersz)
  const links = Array.isArray(pd.links) ? pd.links : [];
  for (const l of links) {
    const url = typeof l === 'string' ? l : l?.url || l?.href || '';
    if (!url) continue;
    const host = hostFromUrl(url) || url;
    const key = host.includes('linkedin')
      ? 'linkedin'
      : host.includes('github')
      ? 'github'
      : host.includes('gitlab')
      ? 'gitlab'
      : 'link';
    const label = host;
    const h = Math.max(
      3.2,
      measureTextHeightMm(label, RIGHT_W - ICON_D - ICON_GAP, BODY)
    );
    nodes.push(
      createImageNode({
        frame: { x: RIGHT_X, y: ry + (h - ICON_D) / 2, w: ICON_D, h: ICON_D },
        src: SVG(key),
        style: { cornerRadius: 0 },
      })
    );
    ry += text(
      RIGHT_X + ICON_D + ICON_GAP,
      ry,
      RIGHT_W - ICON_D - ICON_GAP,
      label,
      LINK,
      { link: url }
    );
  }
  ry += 2;

  // O MNIE
  if (api?.summary || api?.summary2) {
    ry += text(RIGHT_X, ry, RIGHT_W, 'O mnie', SECTION);
    hline(RIGHT_X, ry, RIGHT_W);
    ry += 2;
    if (api.summary) ry += text(RIGHT_X, ry, RIGHT_W, api.summary, BODY);
    if (api.summary2) ry += text(RIGHT_X, ry, RIGHT_W, api.summary2, BODY);
    ry += 2;
  }

  // EDUKACJA (przeniesiona do prawej kolumny)
  const edus = Array.isArray(api?.educations) ? api.educations : [];
  if (edus.length) {
    ry += text(RIGHT_X, ry, RIGHT_W, 'Edukacja', SECTION) + 2;
    hline(RIGHT_X, ry, RIGHT_W);
    ry += 2;

    for (const e of edus) {
      const period = formatPeriod(e?.period);
      const leftW = Math.floor(RIGHT_W * 0.62);
      const rightW = RIGHT_W - leftW;
      const leftX = RIGHT_X;
      const rightX = RIGHT_X + leftW;

      const course = [e?.degree, e?.specialization].filter(Boolean).join(' — ');

      if (course) {
        const h = text(
          leftX,
          ry,
          leftW,
          course,
          { ...SUBTITLE, textAlign: 'left' },
          { align: 'left' }
        );
        if (period)
          text(
            rightX,
            ry,
            rightW,
            period,
            { ...DATE_RIGHT, textAlign: 'right' },
            { align: 'right' }
          );
        ry += h + 0.6;
      } else {
        if (period)
          ry +=
            text(
              rightX,
              ry,
              rightW,
              period,
              { ...DATE_RIGHT, textAlign: 'right' },
              { align: 'right' }
            ) + 0.8;
      }

      if (e?.institution)
        ry += text(
          leftX,
          ry,
          leftW,
          e.institution,
          { ...BODY_MUTED, textAlign: 'left' },
          { align: 'left' }
        );
    }
  }

  // --- UMIEJĘTNOŚCI (obok siebie, jedna kategoria pod drugą) ---
  const groups = Array.isArray(api?.skills) ? api.skills : [];

  ry += text(RIGHT_X, ry, RIGHT_W, 'Umiejętności', SECTION) + 2;
  hline(RIGHT_X, ry, RIGHT_W);
  ry += 2;

  groups.forEach((group) => {
    const catKey = (group?.category || '').toString().toLowerCase();
    const catLabel =
      catKey === 'technical'
        ? 'Techniczne'
        : catKey === 'tools'
        ? 'Narzędzia'
        : catKey === 'soft'
        ? 'Kompetencje miękkie'
        : group?.category || 'Inne';

    // elementy w jednej linii z separatorami " • "
    const items = (group?.items || [])
      .map((i) => (typeof i === 'string' ? i : i?.name))
      .filter(Boolean)
      .join(' • ');

    if (items) {
      const line = `${catLabel}: \n ${items}`;
      ry += text(RIGHT_X, ry, RIGHT_W, line, BODY);
    }
  });

  ry += 2;

  // pionowa linia rozdzielająca kolumny (jak w wzorcu)
  nodes.push(
    createShapeNode({
      frame: {
        x: CONTENT_MARGIN_X + LEFT_W + COL_GAP / 2 - 0.3,
        y: CONTENT_TOP,
        w: 0.6,
        h: PAGE_H - (CONTENT_TOP - 6) - 30,
      },
      style: { fill: { color: COLORS.rule }, stroke: null },
    })
  );

  // --- RODO (opcjonalnie, dół strony) ---
  const gdpr =
    api?.gdprClause || api?.personalData?.gdprClause || api?.gdpr || '';
  if (gdpr) {
    const x = LEFT_X;
    const w = PAGE_W - 10;
    const y = ry + 9;
    text(x, y, w, gdpr, { ...BODY_MUTED, fontSize: 7.4, textAlign: 'justify' });
  }

  // --- Finalizacja ---
  doc.nodes = nodes;
  doc.meta = { data: api, template: 'MorganMaxwellPL' };
  return doc;
}

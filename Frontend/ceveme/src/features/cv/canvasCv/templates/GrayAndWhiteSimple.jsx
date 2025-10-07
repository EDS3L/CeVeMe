import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export class GrayAndWhiteResume {
  // strona
  static PAGE = { W: 210, H: 297, MARGIN: 12 };
  static CONTENT_W =
    GrayAndWhiteResume.PAGE.W - 2 * GrayAndWhiteResume.PAGE.MARGIN;

  // kolumny
  static COLUMNS = { LEFT_RATIO: 0.4, GAP: 6, SEPARATOR_W: 0.6 };

  // odstępy (mm)
  static SPACING = { xs: 1.2, sm: 2.4, md: 4, lg: 5 };

  // kolory
  static COLORS = {
    primary: '#767676',
    text: '#727272',
    muted: '#8b8b8b',
    bg: '#f2f2f2',
    line: '#535353',
    iconBg: '#4b4b4b',
    iconFg: '#ffffff', // BIAŁE IKONY
  };

  // IKONY: użyjemy wektorów (SVG → data:) zamiast emoji
  static ICONS = {
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
    link: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 7h3a5 5 0 1 1 0 10h-3"/>
  <path d="M9 17H6a5 5 0 1 1 0-10h3"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,
    github: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="white">
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

  static STYLES = {
    nameFirst: {
      fontSize: 30, // było 32
      fontWeight: 400,
      color: '#767676',
      lineHeight: 1.05,
      fontFamily: 'Lora, serif',
    },
    nameLast: {
      fontSize: 30,
      fontWeight: 700,
      color: '#767676',
      lineHeight: 1.05,
      fontFamily: 'Lora, serif',
    },
    // tytuł przerzucony bardziej w prawo (mniejsza szerokość lewego bloku)
    title: {
      fontSize: 14.2,
      fontWeight: 600,
      color: '#727272',
      lineHeight: 1.15,
    },

    section: {
      fontSize: 13.5,
      fontWeight: 700,
      fontFamily: 'Lora, serif',
      color: '#767676',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    body: { fontSize: 8.5, color: '#727272', lineHeight: 1.45 },
    bodyMuted: { fontSize: 8.5, color: '#8b8b8b', lineHeight: 1.45 },

    compact: { fontSize: 8.8, color: '#727272', lineHeight: 1.25 },
    compactMuted: { fontSize: 8.8, color: '#8b8b8b', lineHeight: 1.25 },

    // kontakt — ciaśniejszy
    contact: { fontSize: 8.8, color: '#727272', lineHeight: 1.2 },

    rowTitle: {
      fontSize: 10.3,
      fontWeight: 700,
      color: '#727272',
      lineHeight: 1.28,
    },
    rowSubtle: { fontSize: 8.4, color: '#8b8b8b', lineHeight: 1.26 },

    legal: {
      fontSize: 8.5,
      color: '#727272',
      lineHeight: 1.28,
      textAlign: 'justify',
    },
  };

  // header/kontakt/zdjęcie – header 45
  static CONTACT = {
    ICON_SIZE: 5.0, // kółko mniejsze
    GAP: 3.2, // mniejszy odstęp
    TEXT_W: 68, // węższe pole tekstowe
    ROW_SPACING: 2.2, // ciaśniej w pionie
    UNDERLINE_H: 0.7,
    HEADER_H: 45,
  };

  // zmniejszam obszar nazwiska, żeby tytuł i linki nie „wchodziły” pod zdjęcie
  static LAYOUT = { NAME_TOP_OFFSET: -7, NAME_AREA_W_RATIO: 0.52 };

  static PHOTO = { SIZE: 23, GAP: 6 };

  constructor(api = {}) {
    this.api = api;
    this.doc = emptyDocument(A4);
    this.nodes = [];
    this.y = GrayAndWhiteResume.PAGE.MARGIN + GrayAndWhiteResume.SPACING.md;

    const canvas =
      typeof document !== 'undefined' ? document.createElement('canvas') : null;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  build() {
    this.#headerBackground();
    this.#header();
    this.#summary();
    this.#twoColumns();

    this.doc.nodes = this.nodes;
    this.doc.meta = { data: this.api };
    return this.doc;
  }

  /* ------------------------- HEADER ------------------------- */

  #headerBackground() {
    const H = GrayAndWhiteResume.CONTACT.HEADER_H;
    const { W } = GrayAndWhiteResume.PAGE;
    this.#rect(0, 0, W, H, GrayAndWhiteResume.COLORS.bg);
    this.#rect(0, H - 0.6, W, 1, GrayAndWhiteResume.COLORS.line);
  }

  #header() {
    const { HEADER_H, UNDERLINE_H } = GrayAndWhiteResume.CONTACT;
    const { NAME_TOP_OFFSET, NAME_AREA_W_RATIO } = GrayAndWhiteResume.LAYOUT;
    const { MARGIN, W: PAGE_W } = GrayAndWhiteResume.PAGE;
    const nameAreaW = PAGE_W * NAME_AREA_W_RATIO;

    const fullName = (this.api?.personalData?.name ?? 'Your Name').trim();
    const parts = fullName.split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() : '';
    const firstName = parts.join(' ') || lastName;

    const headerY = this.y + NAME_TOP_OFFSET;

    // zdjęcie (prawy górny róg) — naprawione 'src'
    const photoUrl = this.api?.personalData?.images;
    const photoSize = GrayAndWhiteResume.PHOTO.SIZE;
    const photoX = PAGE_W - MARGIN - photoSize;
    const photoY = headerY + GrayAndWhiteResume.SPACING.xs;

    // tło (okrąg) + obraz (jeśli jest url)
    this.nodes.push(
      createShapeNode({
        frame: { x: photoX, y: photoY, w: photoSize, h: photoSize },
        style: {
          fill: { color: '#ddd' },
          stroke: null,
          cornerRadius: photoSize / 2,
        },
      })
    );
    if (photoUrl) {
      this.nodes.push(
        createImageNode({
          frame: { x: photoX, y: photoY, w: photoSize, h: photoSize },
          src: photoUrl,
          style: {
            cornerRadius: photoSize / 2,
            shape: 'circle',
            clipCircle: true,
          },
        })
      );
    }

    // imię i nazwisko (po lewej)
    const firstH = this.#textBlock(
      MARGIN,
      headerY,
      nameAreaW,
      `${firstName}${lastName ? ' ' : ''}`,
      GrayAndWhiteResume.STYLES.nameFirst
    );

    const offsetPx = this.#textWidth(
      `${firstName} `,
      GrayAndWhiteResume.STYLES.nameFirst
    );
    const offset = Math.min(Math.max(offsetPx, 0), nameAreaW * 0.7);
    const lastH = this.#textBlock(
      MARGIN + (offset || nameAreaW * 0.7),
      headerY,
      nameAreaW,
      lastName,
      GrayAndWhiteResume.STYLES.nameLast
    );
    const nameH = Math.max(firstH, lastH);

    // podkreślenie tylko pod lewym blokiem (nie zachodzi na kontakt)
    this.#rect(
      MARGIN,
      headerY + nameH + GrayAndWhiteResume.SPACING.xs,
      nameAreaW,
      UNDERLINE_H,
      GrayAndWhiteResume.COLORS.line
    );

    // kontakt (po prawej, pod zdjęciem)
    const C = GrayAndWhiteResume.CONTACT;
    const contactRightEdge = photoX - GrayAndWhiteResume.PHOTO.GAP;
    // dynamicznie przytnij szerokość tekstu, aby na 100% się mieścił
    const maxTextW = Math.min(
      C.TEXT_W,
      contactRightEdge - MARGIN - C.ICON_SIZE - C.GAP
    );
    const iconX = contactRightEdge - C.ICON_SIZE;
    let cy = headerY + GrayAndWhiteResume.SPACING.xs;

    const pd = this.api?.personalData || {};

    // tel / mail / miasto
    if (pd.phoneNumber) {
      cy = this.#contactRow({
        iconX,
        y: cy,
        text: String(pd.phoneNumber),
        icon: 'phone',
        link: `tel:${String(pd.phoneNumber).replace(/\s+/g, '')}`,
        textW: maxTextW,
      });
    }
    if (pd.email) {
      cy = this.#contactRow({
        iconX,
        y: cy,
        text: String(pd.email),
        icon: 'mail',
        link: `mailto:${String(pd.email)}`,
        textW: maxTextW,
      });
    }
    if (pd.city) {
      cy = this.#contactRow({
        iconX,
        y: cy,
        text: String(pd.city),
        icon: 'pin',
        textW: maxTextW,
      });
    }

    // dodatkowe linki (krótkie etykiety, klikalne)
    const extra = this.#normalizeLinks(pd?.links);
    for (const item of extra) {
      const iconKey =
        item.key === 'github'
          ? 'github'
          : item.key === 'linkedin'
          ? 'link'
          : 'link';
      cy = this.#contactRow({
        iconX,
        y: cy,
        text: item.label,
        icon: iconKey,
        link: item.url,
        textW: maxTextW,
      });
    }

    // tytuł — lekko niżej, zostaje w LEWYM bloku (nie wchodzi pod zdjęcie/kontakt)
    this.y = headerY + nameH + GrayAndWhiteResume.SPACING.sm;
    const title = this.api?.headline || 'Your Title';
    this.y += this.#textBlock(
      MARGIN,
      this.y,
      nameAreaW,
      title,
      GrayAndWhiteResume.STYLES.title
    );

    // treść od dolnej krawędzi headera
    this.y =
      GrayAndWhiteResume.CONTACT.HEADER_H + GrayAndWhiteResume.SPACING.sm;
  }

  // jedna linia kontaktu: kółko + wektorowa ikona (białe) + tekst do prawej
  #contactRow({ iconX, y, text, icon, link, textW }) {
    const { ICON_SIZE, GAP, ROW_SPACING } = GrayAndWhiteResume.CONTACT;
    const centerY = y + ICON_SIZE / 2;

    // kółko
    this.nodes.push(
      createShapeNode({
        frame: {
          x: iconX,
          y: centerY - ICON_SIZE / 2,
          w: ICON_SIZE,
          h: ICON_SIZE,
        },
        style: {
          fill: { color: GrayAndWhiteResume.COLORS.iconBg },
          stroke: null,
          cornerRadius: ICON_SIZE / 2,
        },
      })
    );

    // IKONA SVG (biała) w środku kółka — rasteryzowana przez renderer (image node)
    const svg = GrayAndWhiteResume.ICONS[icon] || GrayAndWhiteResume.ICONS.link;
    const svgDataUrl =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
    const iconInner = ICON_SIZE * 0.62; // odrobinkę marginesu w kółku
    this.nodes.push(
      createImageNode({
        frame: {
          x: iconX + (ICON_SIZE - iconInner) / 2,
          y: centerY - iconInner / 2,
          w: iconInner,
          h: iconInner,
        },
        src: svgDataUrl,
      })
    );

    // Tekst: po lewej od kółka, wyrównany do PRAWEJ i wycentrowany pionowo do linii
    const style = {
      ...GrayAndWhiteResume.STYLES.contact,
      textAlign: 'right',
      verticalAlign: 'middle',
    };
    const measuredW = this.#textWidth(String(text), style) + 12.5;
    const w = Math.min(textW, measuredW);
    const h = Math.max(3, measureTextHeightMm(String(text), w, style));
    const textY = centerY - h / 2;
    const textX = iconX - GAP - w;
    const node = createTextNode({
      frame: { x: textX, y: textY, w, h },
      text: String(text),
      textStyle: style,
    });
    if (link) node.link = link;
    this.nodes.push(node);

    return centerY + ICON_SIZE / 2 + ROW_SPACING;
  }

  // etykiety linków: krótkie i czytelne
  #normalizeLinks(raw) {
    const out = [];
    const arr = Array.isArray(raw) ? raw : [];
    for (const l of arr) {
      const url = typeof l === 'string' ? l : l?.url || l?.href || '';
      if (!url) continue;
      let key = (typeof l === 'string' ? '' : l?.type || l?.name || '')
        .toString()
        .toLowerCase();
      let label = 'Strona www';
      try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        if (host.includes('linkedin')) {
          key ||= 'linkedin';
          label = 'LinkedIn';
        } else if (host.includes('github')) {
          key ||= 'github';
          label = 'GitHub';
        } else {
          label = 'Strona www';
          key ||= 'website';
        }
      } catch {
        /* noop */
      }
      out.push({ label, key, url });
    }
    return out;
  }

  /* ------------------------ SUMMARY ------------------------ */

  #summary() {
    if (!this.api?.summary) return;
    const { MARGIN } = GrayAndWhiteResume.PAGE;
    const W = GrayAndWhiteResume.CONTENT_W;

    this.y += this.#section({
      x: MARGIN,
      y: this.y,
      w: W,
      title: 'PODSUMOWANIE',
      align: 'left',
    });
    const summaryStyle = {
      ...GrayAndWhiteResume.STYLES.body,
      textAlign: 'justify',
    };
    this.y +=
      this.#textBlock(MARGIN, this.y, W, this.api.summary, summaryStyle) +
      GrayAndWhiteResume.SPACING.md;
  }

  /* ---------------------- DWIE KOLUMNY --------------------- */

  #twoColumns() {
    const { MARGIN, H } = GrayAndWhiteResume.PAGE;
    const { LEFT_RATIO, GAP, SEPARATOR_W } = GrayAndWhiteResume.COLUMNS;

    const totalW = GrayAndWhiteResume.CONTENT_W;
    const leftW = Math.floor(totalW * LEFT_RATIO);
    const rightW = totalW - leftW - GAP;

    const leftX = MARGIN;
    const rightX = MARGIN + leftW + GAP;

    const topY = this.y;
    const bottomY = H - MARGIN;

    this.#rect(
      leftX + leftW + (GAP - SEPARATOR_W) / 2,
      topY,
      SEPARATOR_W,
      bottomY - topY,
      GrayAndWhiteResume.COLORS.line
    );

    // prawa: Doświadczenie + RODO
    let ry = topY;
    ry += this.#section({
      x: rightX,
      y: ry,
      w: rightW,
      title: 'DOŚWIADCZENIE ZAWODOWE',
    });

    for (const exp of this.api?.experience || []) {
      ry +=
        this.#experience(rightX, ry, rightW, exp) +
        GrayAndWhiteResume.SPACING.lg;
    }

    const gdpr = this.api?.gdprClause || '';
    if (gdpr) {
      ry += this.#section({
        x: rightX,
        y: ry,
        w: rightW,
        title: 'KLAUZULA RODO',
      });
      ry += this.#textBlock(
        rightX,
        ry,
        rightW,
        gdpr,
        GrayAndWhiteResume.STYLES.legal
      );
    }

    // lewa: Edukacja / Umiejętności / Projekty / Certyfikaty / Języki
    let ly = topY;

    const educations = this.api?.educations || [];
    if (educations.length) {
      ly += this.#section({ x: leftX, y: ly, w: leftW, title: 'EDUKACJA' });
      for (const edu of educations)
        ly +=
          this.#education(leftX, ly, leftW, edu) +
          GrayAndWhiteResume.SPACING.sm;
      ly += GrayAndWhiteResume.SPACING.xs;
    }

    const skillsTech = this.#collectSkills(['Technical', 'Tools']).join(', ');
    const skillsSoft = this.#collectSkills(['Soft']).join(', ');
    if (skillsTech || skillsSoft) {
      ly += this.#section({ x: leftX, y: ly, w: leftW, title: 'UMIEJĘTNOŚCI' });
      ly +=
        this.#skillsInline(leftX, ly, leftW, skillsTech, skillsSoft) +
        GrayAndWhiteResume.SPACING.sm;
    }

    const projects = this.api?.portfolio || [];
    if (projects.length) {
      ly += this.#section({ x: leftX, y: ly, w: leftW, title: 'PROJEKTY' });
      for (const p of projects)
        ly +=
          this.#project(leftX, ly, leftW, p) + GrayAndWhiteResume.SPACING.md;
      ly += GrayAndWhiteResume.SPACING.xs;
    }

    const certificates = (this.api?.certificates || [])
      .map((c) => c?.name)
      .filter(Boolean);
    if (certificates.length) {
      ly += this.#section({ x: leftX, y: ly, w: leftW, title: 'CERTYFIKATY' });
      ly +=
        this.#bulletedList(
          leftX,
          ly,
          leftW,
          certificates,
          GrayAndWhiteResume.STYLES.compact
        ) + GrayAndWhiteResume.SPACING.xs;
    }

    const languagesLine = (this.api?.languages || [])
      .map((l) => [l?.language, l?.level].filter(Boolean).join(' — '))
      .filter(Boolean)
      .join(', ');
    if (languagesLine) {
      ly += this.#section({ x: leftX, y: ly, w: leftW, title: 'JĘZYKI' });
      ly +=
        this.#textBlock(
          leftX,
          ly,
          leftW,
          languagesLine,
          GrayAndWhiteResume.STYLES.compact
        ) + GrayAndWhiteResume.SPACING.xs;
    }
  }

  /* ------------------------ EDUKACJA ----------------------- */

  #education(x, y, w, edu) {
    let used = 0;
    const title = edu?.institution || '';
    const sub = [edu?.degree, edu?.specialization].filter(Boolean).join(' — ');

    used += this.#textBlock(
      x,
      y + used,
      w,
      title,
      GrayAndWhiteResume.STYLES.rowTitle
    );
    if (sub)
      used += this.#textBlock(
        x,
        y + used,
        w,
        sub,
        GrayAndWhiteResume.STYLES.compact
      );
    if (edu?.period)
      used += this.#textBlock(
        x,
        y + used,
        w,
        edu.period,
        GrayAndWhiteResume.STYLES.compactMuted
      );

    return used;
  }

  /* ---------------------- UMIEJĘTNOŚCI --------------------- */

  #collectSkills(categories) {
    const out = [];
    for (const cat of this.api?.skills || []) {
      if (!categories.includes(cat?.category)) continue;
      for (const it of cat.items || []) out.push(it?.name || it);
    }
    return out.filter(Boolean);
  }

  #skillsInline(x, y, w, tech, soft) {
    let used = 0;
    const style = GrayAndWhiteResume.STYLES.compact;
    if (tech)
      used +=
        this.#textBlock(x, y + used, w, `Techniczne: ${tech}`, style) +
        GrayAndWhiteResume.SPACING.xs;
    if (soft)
      used += this.#textBlock(x, y + used, w, `Miękkie: ${soft}`, style);
    return used;
  }

  /* ------------------------ PROJEKTY ----------------------- */

  #project(x, y, w, p) {
    let used = 0;
    const name = p?.name || 'Projekt';
    const tech = (p?.technologies || [])
      .map((t) => t?.name)
      .filter(Boolean)
      .join(' • ');
    const desc = p?.description || '';
    const url = p?.url || '';
    const ach = (p?.achievements || [])
      .map((a) => a?.description)
      .filter(Boolean);

    used += this.#textBlock(
      x,
      y + used,
      w,
      name,
      GrayAndWhiteResume.STYLES.rowTitle
    );
    if (tech)
      used += this.#textBlock(
        x,
        y + used,
        w,
        tech,
        GrayAndWhiteResume.STYLES.bodyMuted
      );
    if (desc)
      used +=
        this.#textBlock(x, y + used, w, desc, GrayAndWhiteResume.STYLES.body) +
        GrayAndWhiteResume.SPACING.xs;

    if (url) {
      let host = '';
      try {
        host = new URL(url).hostname.replace(/^www\./, '');
      } catch {
        console.log('');
      }
      const nodeText = host ? `URL: ${host}` : `URL: ${url}`;
      used += this.#textBlock(
        x,
        y + used,
        w,
        nodeText,
        GrayAndWhiteResume.STYLES.rowSubtle,
        { link: url }
      );
    }

    if (ach.length)
      used += this.#bulletedList(
        x,
        y + used,
        w,
        ach,
        GrayAndWhiteResume.STYLES.body
      );
    return used;
  }

  /* --------------------- DOŚWIADCZENIE --------------------- */

  #experience(x, y, w, exp) {
    let used = 0;

    const title = exp?.title || '';
    const sub = [exp?.company, exp?.period].filter(Boolean).join(' | ');
    const desc = exp?.jobDescription || '';
    const bullets = (exp?.achievements || [])
      .map((a) => a?.description)
      .filter(Boolean);

    used += this.#textBlock(
      x,
      y + used,
      w,
      title,
      GrayAndWhiteResume.STYLES.rowTitle
    );
    if (sub)
      used +=
        this.#textBlock(
          x,
          y + used,
          w,
          sub,
          GrayAndWhiteResume.STYLES.rowSubtle
        ) + GrayAndWhiteResume.SPACING.xs;
    if (desc)
      used +=
        this.#textBlock(x, y + used, w, desc, GrayAndWhiteResume.STYLES.body) +
        GrayAndWhiteResume.SPACING.xs;
    if (bullets.length)
      used += this.#bulletedList(
        x,
        y + used,
        w,
        bullets,
        GrayAndWhiteResume.STYLES.body
      );

    return used;
  }

  /* ----------------------- SEKCJE/UI ----------------------- */

  #section({
    x,
    y,
    w,
    title,
    style = GrayAndWhiteResume.STYLES.section,
    align = 'left',
  }) {
    const t = String(title).toUpperCase();
    const h = this.#textBlock(x, y, w, t, { ...style, textAlign: align });
    this.#line(x, y + h + GrayAndWhiteResume.SPACING.xs, w);
    return h + GrayAndWhiteResume.SPACING.md;
  }

  #line(x, y, w, h = 0.6) {
    this.nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: {
          fill: { color: GrayAndWhiteResume.COLORS.line },
          stroke: null,
        },
      })
    );
  }

  #rect(x, y, w, h, color) {
    this.nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color }, stroke: null },
      })
    );
  }

  // obraz (node typu "image"); renderer obsłuży cornerRadius + clipCircle

  // tekst z auto-pomiarem wysokości; respektuje textAlign; obsługa node.link
  #textBlock(x, y, w, text, style, opts = {}) {
    const t = String(text ?? '');
    const h = Math.max(3, measureTextHeightMm(t, w, style));
    let textX = x;

    const align = style?.textAlign;
    if (align === 'center' || align === 'right') {
      const textW = this.#textWidth(t, style);
      if (align === 'center') textX = x + (w - textW) / 2;
      if (align === 'right') textX = x + (w - textW);
    }

    const node = createTextNode({
      frame: { x: textX, y, w, h },
      text: t,
      textStyle: style,
    });
    if (opts.link) node.link = opts.link;
    this.nodes.push(node);

    return h;
  }

  #bulletedList(x, y, w, items, style) {
    const txt = items.map((s) => `• ${s}`).join('\n');
    return this.#textBlock(x, y, w, txt, style);
  }

  #textWidth(text = '', style = {}) {
    if (!this.ctx) {
      const fs = Number(style?.fontSize || 12);
      const avgCharMm = fs * 0.35278 * 0.5;
      return avgCharMm * String(text).length;
    }
    const fontSizePt = style?.fontSize ? `${style.fontSize}pt` : '12pt';
    const fontWeight = style?.fontWeight || 400;
    const fontFamily = style?.fontFamily || 'Inter, Arial, sans-serif';
    this.ctx.font = `${fontWeight} ${fontSizePt} ${fontFamily}`;
    const px = this.ctx.measureText(String(text)).width || 0;
    return px * 0.264583; // px -> mm
  }
}

// zgodny wrapper
export function buildGrayAndWhite(api = {}) {
  return new GrayAndWhiteResume(api).build();
}

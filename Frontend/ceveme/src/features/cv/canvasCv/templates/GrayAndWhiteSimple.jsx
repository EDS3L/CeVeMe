import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export class GrayAndWhiteResume {
  // strona
  static PAGE = { W: 210, H: 297, MARGIN: 12 };
  static CONTENT_W =
    GrayAndWhiteResume.PAGE.W - 2 * GrayAndWhiteResume.PAGE.MARGIN;

  // kolumny (lekko ciaśniej)
  static COLUMNS = { LEFT_RATIO: 0.4, GAP: 6, SEPARATOR_W: 0.6 };

  // odstępy (mm) – ciaśniejsze
  static SPACING = { xs: 1.5, sm: 3, md: 5, lg: 6 };

  // kolory
  static COLORS = {
    primary: '#767676',
    text: '#727272',
    muted: '#8b8b8b',
    bg: '#f2f2f2',
    line: '#535353',
    iconBg: '#4b4b4b',
    iconFg: '#ffffff',
  };

  // glify
  static GLYPHS = { phone: '☎', email: '✉', home: '🏠︎' };

  // style
  static STYLES = {
    nameFirst: {
      fontSize: 32,
      fontWeight: 400,
      color: '#767676',
      lineHeight: 1.05,
      fontFamily: 'Lora, serif',
    },
    nameLast: {
      fontSize: 32,
      fontWeight: 700,
      color: '#767676',
      lineHeight: 1.05,
      fontFamily: 'Lora, serif',
    },
    title: { fontSize: 16, fontWeight: 500, color: '#727272', lineHeight: 1.2 },

    section: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: 'Lora, serif',
      color: '#767676',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    body: { fontSize: 8.5, color: '#727272', lineHeight: 1.45 },
    bodyMuted: { fontSize: 8.5, color: '#8b8b8b', lineHeight: 1.45 },

    compact: { fontSize: 8.9, color: '#727272', lineHeight: 1.25 },
    compactMuted: { fontSize: 8.9, color: '#8b8b8b', lineHeight: 1.25 },

    contact: { fontSize: 10, color: '#727272', lineHeight: 1.4 },
    iconText: {
      fontSize: 12,
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1,
    },

    rowTitle: {
      fontSize: 10.5,
      fontWeight: 700,
      color: '#727272',
      lineHeight: 1.3,
    },
    rowSubtle: { fontSize: 8.5, color: '#8b8b8b', lineHeight: 1.3 },

    legal: {
      fontSize: 8.7,
      color: '#727272',
      lineHeight: 1.3,
      textAlign: 'justify',
    },
  };

  // header/kontakt/zdjęcie – header niższy (45)
  static CONTACT = {
    ICON_SIZE: 6,
    GAP: 5,
    TEXT_W: 90,
    ROW_SPACING: 4,
    UNDERLINE_H: 0.8,
    HEADER_H: 45,
  };

  static PHOTO = { SIZE: 24, GAP: 8 }; // okrągłe zdjęcie w prawym górnym rogu
  static LAYOUT = { NAME_TOP_OFFSET: -8, NAME_AREA_W_RATIO: 0.58 };

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

    // zdjęcie (prawy górny róg)
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
      this.#image(
        photoUrl,
        photoX,
        photoY,
        photoSize,
        photoSize,
        photoSize / 2
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

    this.#rect(
      MARGIN,
      headerY + nameH + GrayAndWhiteResume.SPACING.xs,
      nameAreaW,
      UNDERLINE_H,
      GrayAndWhiteResume.COLORS.line
    );

    // kontakt (prawa część, pod zdjęciem)
    const iconSize = GrayAndWhiteResume.CONTACT.ICON_SIZE;
    const contactRightEdge = photoX - GrayAndWhiteResume.PHOTO.GAP; // kontakt zaczyna się tuż przed zdjęciem
    const iconX = contactRightEdge - iconSize;
    let cy = headerY + GrayAndWhiteResume.SPACING.xs;

    const pd = this.api?.personalData || {};
    cy = pd.phoneNumber
      ? this.#contactRow(
          iconX,
          cy,
          pd.phoneNumber,
          GrayAndWhiteResume.GLYPHS.phone
        )
      : cy;
    cy = pd.email
      ? this.#contactRow(iconX, cy, pd.email, GrayAndWhiteResume.GLYPHS.email)
      : cy;
    // eslint-disable-next-line no-unused-vars
    cy = pd.city
      ? this.#contactRow(iconX, cy, pd.city, GrayAndWhiteResume.GLYPHS.home)
      : cy;

    // tytuł pod nazwiskiem
    this.y = headerY + nameH + GrayAndWhiteResume.SPACING.sm;
    const title = this.api?.headline || 'Your Title';
    this.y += this.#textBlock(
      MARGIN,
      this.y,
      nameAreaW,
      title,
      GrayAndWhiteResume.STYLES.title
    );

    // start treści niżej (header 45)
    this.y = HEADER_H + GrayAndWhiteResume.SPACING.sm;
  }

  #contactRow(iconX, y, text, glyph) {
    const { ICON_SIZE, GAP, TEXT_W, ROW_SPACING } = GrayAndWhiteResume.CONTACT;
    const centerY = y + ICON_SIZE / 2;

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

    this.nodes.push(
      createTextNode({
        frame: {
          x: iconX - 0.7,
          y: centerY - ICON_SIZE / 2 + ICON_SIZE - 6.4,
          w: ICON_SIZE,
          h: ICON_SIZE,
        },
        text: glyph,
        textStyle: GrayAndWhiteResume.STYLES.iconText,
      })
    );

    const style = { ...GrayAndWhiteResume.STYLES.contact, textAlign: 'right' };
    const h = measureTextHeightMm(String(text), TEXT_W, style);
    const textY = centerY - h / 2;
    const textX = iconX - TEXT_W - GAP;

    this.#textBlock(textX, textY, TEXT_W, String(text), style);
    return centerY + ICON_SIZE / 2 + ROW_SPACING;
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
      align: 'center',
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

    // prawa: Doświadczenie + RODO (RODO przeniesione tutaj, na dół)
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
    const url = p?.url ? `URL: ${p.url}` : '';
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
    if (url)
      used += this.#textBlock(
        x,
        y + used,
        w,
        url,
        GrayAndWhiteResume.STYLES.rowSubtle
      );
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

  // obraz (node typu "image"); renderer powinien obsługiwać cornerRadius
  #image(url, x, y, w, h, cornerRadius = 0) {
    this.nodes.push({
      type: 'image',
      frame: { x, y, w, h },
      url,
      style: cornerRadius ? { cornerRadius } : null,
    });
  }

  // tekst z auto-pomiarem wysokości; respektuje textAlign
  #textBlock(x, y, w, text, style) {
    const t = String(text ?? '');
    const h = measureTextHeightMm(t, w, style);
    let textX = x;

    const align = style?.textAlign;
    if (align === 'center' || align === 'right') {
      const textW = this.#textWidth(t, style);
      if (align === 'center') textX = x + (w - textW) / 2;
      if (align === 'right') textX = x + (w - textW);
    }

    this.nodes.push(
      createTextNode({
        frame: { x: textX, y, w, h },
        text: t,
        textStyle: style,
      })
    );

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

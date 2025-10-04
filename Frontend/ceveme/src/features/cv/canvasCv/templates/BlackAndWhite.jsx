import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildBlackAndWhiteCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // --- Wymiary i układ ---
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 5;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  const LEFT_COL_W = CONTENT_W * 0.33;
  const RIGHT_COL_W = CONTENT_W * 0.63;
  const COL_GAP = CONTENT_W * 0.02;
  const RIGHT_COL_X = MARGIN + LEFT_COL_W + COL_GAP;

  // --- Kolory i style ---
  const COLOR_PRIMARY = '#2d3748';
  const COLOR_BODY = '#4a5568';
  const COLOR_LIGHT = '#9aa4b2';
  const COLOR_LINE = '#e6eef6';

  const NAME_STYLE = { fontSize: 30, fontWeight: 700, color: COLOR_PRIMARY };
  const TITLE_STYLE = {
    fontSize: 10.5,
    fontWeight: 400,
    color: COLOR_BODY,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  };
  const LEFT_HEADER_STYLE = {
    fontSize: 11,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  };
  const RIGHT_HEADER_STYLE = {
    fontSize: 12,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    textTransform: 'uppercase',
  };
  const BODY_STYLE = {
    fontSize: 8.5,
    fontWeight: 400,
    color: COLOR_BODY,
    lineHeight: 1.35,
  };
  const BOLD_BODY_STYLE = {
    ...BODY_STYLE,
    fontWeight: 700,
    color: COLOR_PRIMARY,
  };
  const ITALIC_STYLE = { ...BODY_STYLE, fontStyle: 'italic' };
  const DATE_STYLE = { ...BODY_STYLE, color: COLOR_LIGHT, fontWeight: 700 };
  const CONTACT_STYLE = { ...BODY_STYLE, lineHeight: 1.35 };

  // --- Odstępy ---
  const GAP_SECTION = 2.5;
  const GAP_BLOCK = 2.2;
  const GAP_ITEM = 1.6;

  // --- Ikony linków ---
  const ICON_MAP = {
    linkedin: '🔗',
    github: '🐙',
    gitlab: '🦊',
    website: '🌐',
    facebook: '📘',
    instagram: '📷',
    twitter: '🐦',
  };

  // --- Pomocnicze rysowanie ---
  const addTextNode = (x, y, w, text, style = BODY_STYLE) => {
    const t = text || '';
    const h = Math.max(3.8, measureTextHeightMm(t, w, style));
    nodes.push(
      createTextNode({ frame: { x, y, w, h }, text: t, textStyle: style })
    );
    return h;
  };

  const addHLine = (x, y, w, thickness = 0.25, color = COLOR_LINE) => {
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h: thickness },
        style: { fill: { color, opacity: 1 }, stroke: null },
      })
    );
  };

  const addVLine = (x, y, h, thickness = 0.6, color = COLOR_LINE) => {
    nodes.push(
      createShapeNode({
        frame: { x, y, w: thickness, h },
        style: { fill: { color, opacity: 1 }, stroke: null },
      })
    );
  };

  const addTimelineCircle = (y) => {
    const R = 1.4;
    const cx = RIGHT_COL_X - COL_GAP / 2 - R;
    const cy = y - R;
    nodes.push(
      createShapeNode({
        frame: { x: cx, y: cy, w: 2 * R, h: 2 * R },
        style: {
          fill: { color: COLOR_PRIMARY, opacity: 1 },
          stroke: null,
          cornerRadius: R,
        },
      })
    );
  };

  // --- Nagłówek ---
  const name =
    (api && api.personalData && api.personalData.name) || 'Imię Nazwisko';
  const title = api.headline || '';
  const nameH = addTextNode(MARGIN, MARGIN, CONTENT_W, name, NAME_STYLE);
  addTextNode(MARGIN, MARGIN + nameH - 1, CONTENT_W, title, TITLE_STYLE);
  addHLine(MARGIN, MARGIN + nameH + 6, CONTENT_W, 0.5, COLOR_PRIMARY);

  let leftY = MARGIN + nameH + 12;
  let rightY = MARGIN + nameH + 10;

  // ======================
  // LEWA KOLUMNA
  // ======================

  // Kontakt
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Kontakt', LEFT_HEADER_STYLE) + 0.8;
  addHLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM;

  const rawLinks = Array.isArray(api?.personalData?.links)
    ? api.personalData.links
    : [];
  const normalizedLinks = rawLinks
    .map((l) => {
      if (!l) return null;
      const url = typeof l === 'string' ? l : l.url || l.href || '';
      const type = (typeof l === 'string' ? '' : l.type || l.name || '')
        .toString()
        .toLowerCase();
      const label =
        type ||
        (url.includes('linkedin.com') && 'LinkedIn') ||
        (url.includes('github.com') && 'GitHub') ||
        (url.includes('gitlab.com') && 'GitLab') ||
        (url.includes('instagram.com') && 'Instagram') ||
        (url.includes('facebook.com') && 'Facebook') ||
        'Strona www';
      const icon =
        ICON_MAP[type] ||
        (label === 'LinkedIn' && ICON_MAP.linkedin) ||
        (label === 'GitHub' && ICON_MAP.github) ||
        (label === 'GitLab' && ICON_MAP.gitlab) ||
        (label === 'Strona www' && ICON_MAP.website) ||
        '🔗';
      return `${icon} ${label}`;
    })
    .filter(Boolean);

  const contactLines = [
    api?.personalData?.phoneNumber
      ? `📞 ${api.personalData.phoneNumber}`
      : null,
    api?.personalData?.email ? `✉️ ${api.personalData.email}` : null,
    api?.personalData?.city ? `📍 ${api.personalData.city}` : null,
    ...normalizedLinks,
  ].filter(Boolean);

  if (contactLines.length) {
    leftY +=
      addTextNode(
        MARGIN,
        leftY,
        LEFT_COL_W,
        contactLines.join('\n'),
        CONTACT_STYLE
      ) + GAP_SECTION;
  }

  // Umiejętności — wszystkie kategorie osobno
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Umiejętności', LEFT_HEADER_STYLE) +
    0.8;
  addHLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM;

  const skills = Array.isArray(api?.skills) ? api.skills : [];
  skills.forEach((group) => {
    const catTitle =
      group?.category === 'Technical'
        ? 'Techniczne'
        : group?.category === 'Tools'
        ? 'Narzędzia'
        : group?.category === 'Soft'
        ? 'Kompetencje miękkie'
        : group?.category || 'Inne';

    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, catTitle, {
        ...BODY_STYLE,
        fontWeight: 700,
      }) - 0.8;

    const items = (group?.items || [])
      .map((s) => `• ${s?.name || s}`)
      .join('\n');
    if (items)
      leftY += addTextNode(MARGIN, leftY, LEFT_COL_W, items, BODY_STYLE);
    leftY += GAP_BLOCK;
  });
  leftY += GAP_SECTION;

  // Języki
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Języki', LEFT_HEADER_STYLE) + 0.8;
  addHLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM;

  const languages = (api?.languages || [])
    .map((l) => `• ${l.language} (${l.level})`)
    .join('\n');
  if (languages)
    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, languages, BODY_STYLE) +
      GAP_SECTION;

  // Edukacja — dane pod sobą
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Edukacja', LEFT_HEADER_STYLE) + 0.8;
  addHLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM;

  const educations = Array.isArray(api?.educations) ? api.educations : [];
  educations.forEach((edu) => {
    if (edu?.degree)
      leftY += addTextNode(
        MARGIN,
        leftY,
        LEFT_COL_W,
        edu.degree,
        BOLD_BODY_STYLE
      );
    if (edu?.specialization)
      leftY += addTextNode(
        MARGIN,
        leftY,
        LEFT_COL_W,
        edu.specialization,
        BODY_STYLE
      );
    if (edu?.institution)
      leftY += addTextNode(
        MARGIN,
        leftY,
        LEFT_COL_W,
        edu.institution,
        ITALIC_STYLE
      );
    if (edu?.period)
      leftY += addTextNode(MARGIN, leftY, LEFT_COL_W, edu.period, DATE_STYLE);
    leftY += GAP_BLOCK;
  });
  leftY += GAP_SECTION;

  // Certyfikaty — lewa kolumna
  const certs = Array.isArray(api?.certificates) ? api.certificates : [];
  if (certs.length) {
    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, 'Certyfikaty', LEFT_HEADER_STYLE) +
      0.8;
    addHLine(MARGIN, leftY, LEFT_COL_W);
    leftY += GAP_ITEM;

    certs.forEach((c) => {
      const line1 = c?.name ? `• ${c.name}` : null;
      const meta = [c?.issuer, c?.data].filter(Boolean).join(' • ');
      if (line1)
        leftY += addTextNode(MARGIN, leftY, LEFT_COL_W, line1, BOLD_BODY_STYLE);
      if (meta)
        leftY += addTextNode(MARGIN, leftY, LEFT_COL_W, meta, DATE_STYLE);
      if (c?.description)
        leftY += addTextNode(
          MARGIN,
          leftY,
          LEFT_COL_W,
          c.description,
          BODY_STYLE
        );
      leftY += GAP_BLOCK;
    });

    leftY += GAP_SECTION;
  }

  // ======================
  // PRAWA KOLUMNA
  // ======================

  // Pionowa oś czasu
  const timelineX = RIGHT_COL_X - COL_GAP / 2 - 0.8;
  addVLine(timelineX, rightY, PAGE_H - rightY - MARGIN - 18, 0.6, COLOR_LINE);

  // Profil
  addTimelineCircle(rightY + 5);
  rightY +=
    addTextNode(
      RIGHT_COL_X,
      rightY,
      RIGHT_COL_W,
      'Profil',
      RIGHT_HEADER_STYLE
    ) + GAP_BLOCK;
  const summary = api?.summary || '';
  if (summary)
    rightY +=
      addTextNode(RIGHT_COL_X, rightY, RIGHT_COL_W, summary, BODY_STYLE) +
      GAP_SECTION;

  // Doświadczenie
  addTimelineCircle(rightY + 5);
  rightY +=
    addTextNode(
      RIGHT_COL_X,
      rightY,
      RIGHT_COL_W,
      'Doświadczenie',
      RIGHT_HEADER_STYLE
    ) + GAP_BLOCK;

  const experiences = Array.isArray(api?.experience) ? api.experience : [];
  experiences.forEach((exp) => {
    addTimelineCircle(rightY + 3);

    const headerY = rightY;
    const companyH = addTextNode(
      RIGHT_COL_X,
      headerY,
      RIGHT_COL_W - 20,
      exp?.company || '',
      BOLD_BODY_STYLE
    );
    const periodText = exp?.period || '';
    addTextNode(RIGHT_COL_X + RIGHT_COL_W - 20, headerY, 20, periodText, {
      ...DATE_STYLE,
      textAlign: 'right',
    });

    rightY += companyH;

    if (exp?.title)
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        exp.title,
        ITALIC_STYLE
      );

    if (Array.isArray(exp?.achievements) && exp.achievements.length) {
      const bullets = exp.achievements
        .map((a) => `• ${a?.description || ''}`)
        .filter(Boolean)
        .join('\n');
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        bullets,
        BODY_STYLE
      );
    } else if (exp?.jobDescription) {
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        exp.jobDescription,
        BODY_STYLE
      );
    }

    rightY += GAP_BLOCK;
  });
  rightY += GAP_SECTION;

  // Projekty
  const projects = Array.isArray(api?.portfolio) ? api.portfolio : [];
  if (projects.length) {
    addTimelineCircle(rightY + 5);
    rightY +=
      addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        'Projekty',
        RIGHT_HEADER_STYLE
      ) + GAP_BLOCK;

    projects.forEach((p) => {
      addTimelineCircle(rightY + 3);
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        p?.name || 'Projekt',
        BOLD_BODY_STYLE
      );

      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      if (tech)
        rightY += addTextNode(
          RIGHT_COL_X,
          rightY,
          RIGHT_COL_W,
          tech,
          ITALIC_STYLE
        );

      if (p?.url)
        rightY += addTextNode(
          RIGHT_COL_X,
          rightY,
          RIGHT_COL_W,
          p.url,
          DATE_STYLE
        );

      const bullets = (p?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean);
      if (bullets.length) {
        rightY += addTextNode(
          RIGHT_COL_X,
          rightY,
          RIGHT_COL_W,
          bullets.map((b) => `• ${b}`).join('\n'),
          BODY_STYLE
        );
      }
      rightY += GAP_BLOCK;
    });

    rightY += GAP_SECTION;
  }

  // Klauzula RODO przy dole prawej kolumny
  const gdpr =
    api?.gdprClause || api?.personalData?.gdprClause || api?.gdpr || '';
  if (gdpr) {
    addTextNode(RIGHT_COL_X, PAGE_H - MARGIN - 18, RIGHT_COL_W, gdpr, {
      fontSize: 7.5,
      color: COLOR_BODY,
      lineHeight: 1.15,
      textAlign: 'justify',
    });
  }

  // --- Finalizacja ---
  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

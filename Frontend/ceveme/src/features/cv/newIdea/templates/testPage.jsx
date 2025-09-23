import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildTestPageCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // --- Wymiary i Układ ---
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 6;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  // Pionowa linia oddzielająca
  const LEFT_COL_W = CONTENT_W * 0.25; // Szerokość lewej kolumny dla nagłówków sekcji
  const RIGHT_COL_X = MARGIN + LEFT_COL_W;
  const LINE_THICKNESS = 0.5;

  // --- Kolory i Style ---
  const COLOR_PRIMARY = '#1e1e1e'; // Bardzo ciemny szary, prawie czarny
  const COLOR_BODY = '#4a5568'; // Możesz zachować ten szary lub użyć jaśniejszego
  const COLOR_LIGHT = '#a0aec0'; // Jasnoszary
  const COLOR_LINE = '#2e3729'; // Ciemny, prawie czarny kolor linii

  const NAME_STYLE = {
    fontSize: 32,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    textAlign: 'left',
  };
  const TITLE_STYLE = {
    fontSize: 11,
    fontWeight: 400,
    color: COLOR_BODY,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'left',
  };
  const LEFT_HEADER_STYLE = {
    fontSize: 12,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
  };
  const RIGHT_HEADER_STYLE = {
    fontSize: 14,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    textTransform: 'uppercase',
  };
  const BODY_STYLE = {
    fontSize: 9,
    fontWeight: 400,
    color: COLOR_BODY,
    lineHeight: 1.5,
  };
  const BOLD_BODY_STYLE = {
    ...BODY_STYLE,
    fontWeight: 700,
    color: COLOR_BODY,
  };
  const ITALIC_STYLE = { ...BODY_STYLE, fontStyle: 'italic' };
  const DATE_STYLE = {
    ...BODY_STYLE,
    color: COLOR_LIGHT,
    fontWeight: 700,
    textAlign: 'right',
  };
  const CONTACT_STYLE = {
    fontSize: 10,
    fontWeight: 400,
    color: COLOR_BODY,
    textAlign: 'left',
  };

  // --- Odstępy ---
  const GAP_SECTION = 10;
  const GAP_BLOCK = 6;
  const GAP_ITEM = 2;
  const INDENT = 3;

  // --- Funkcje Pomocnicze ---
  const addTextNode = (x, y, w, text, style = BODY_STYLE) => {
    const h = measureTextHeightMm(text, w, style);
    nodes.push(
      createTextNode({ frame: { x, y, w, h }, text, textStyle: style })
    );
    return h;
  };

  const addLine = (x, y, w, thickness = LINE_THICKNESS, color = COLOR_LINE) => {
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h: thickness },
        style: { fill: { color, opacity: 1 }, stroke: null },
      })
    );
  };

  // --- Budowa CV ---
  let y = MARGIN;

  // 1. Nagłówek (Imię i Tytuł)
  const name = api?.personalData?.name || 'ESTELLE DARCY';
  const title = api?.headline || 'ADMINISTRATIVE MANAGER';
  const headerH = addTextNode(MARGIN, y, CONTENT_W, name, NAME_STYLE);
  y += headerH + GAP_ITEM;

  // 2. Kontakt
  const contactText = `${
    api?.personalData?.email || 'hello@reallygreatsite.com'
  } | ${api?.personalData?.phoneNumber || '123-456-7890'} | ${
    api?.personalData?.city || '123 Anywhere St., Any City'
  }`;
  y +=
    addTextNode(MARGIN, y, CONTENT_W, contactText, CONTACT_STYLE) + GAP_SECTION;

  // 3. Pionowa linia
  addLine(
    RIGHT_COL_X - LINE_THICKNESS / 2,
    y,
    LINE_THICKNESS,
    PAGE_H - 2 * MARGIN - y + MARGIN,
    COLOR_LINE
  );

  // 4. Sekcja Summary
  addTextNode(MARGIN, y, LEFT_COL_W, 'SUMMARY', LEFT_HEADER_STYLE);
  const summary =
    api?.summary ||
    'Detail-oriented administrative professional with over three years of experience providing comprehensive support to executive teams and office operations. Proven track record of managing administrative tasks efficiently and maintaining strict confidentiality. Strong organizational skills coupled with excellent communication abilities to coordinate office activities and facilitate smooth workflow.';
  const summaryH = addTextNode(
    RIGHT_COL_X,
    y,
    CONTENT_W - LEFT_COL_W,
    summary,
    BODY_STYLE
  );
  y +=
    Math.max(
      summaryH,
      addTextNode(MARGIN, y, LEFT_COL_W, 'SUMMARY', LEFT_HEADER_STYLE)
    ) + GAP_SECTION;

  // 5. Sekcja Work Experience
  addTextNode(MARGIN, y, LEFT_COL_W, 'WORK EXPERIENCE', LEFT_HEADER_STYLE);
  let expY = y;
  const experiences = api?.experience || [];
  for (const exp of experiences) {
    const jobLine = `${exp.title || ''}, ${exp.company || ''}`;
    const jobH = addTextNode(
      RIGHT_COL_X,
      expY,
      CONTENT_W - LEFT_COL_W - 40,
      jobLine,
      BOLD_BODY_STYLE
    );
    addTextNode(
      RIGHT_COL_X + CONTENT_W - LEFT_COL_W - 40,
      expY,
      40,
      exp.period || '',
      DATE_STYLE
    );
    expY += jobH + GAP_ITEM;
    const achievements = exp.achievements || [];
    for (const ach of achievements) {
      const desc = ach.description || ach;
      expY +=
        addTextNode(
          RIGHT_COL_X + INDENT,
          expY,
          CONTENT_W - LEFT_COL_W - INDENT,
          `• ${desc}`,
          BODY_STYLE
        ) +
        GAP_ITEM / 2;
    }
    expY += GAP_BLOCK;
  }
  y = expY + GAP_SECTION;

  // 6. Sekcja Education
  addTextNode(MARGIN, y, LEFT_COL_W, 'EDUCATION', LEFT_HEADER_STYLE);
  let eduY = y;
  const educations = api?.educations || [];
  for (const edu of educations) {
    const degreeLine = `${edu.degree || ''}`;
    const degreeH = addTextNode(
      RIGHT_COL_X,
      eduY,
      CONTENT_W - LEFT_COL_W - 40,
      degreeLine,
      BOLD_BODY_STYLE
    );
    addTextNode(
      RIGHT_COL_X + CONTENT_W - LEFT_COL_W - 40,
      eduY,
      40,
      edu.period || '',
      DATE_STYLE
    );
    eduY += degreeH + GAP_ITEM / 2;
    if (edu.institution) {
      eduY +=
        addTextNode(
          RIGHT_COL_X,
          eduY,
          CONTENT_W - LEFT_COL_W,
          edu.institution,
          BODY_STYLE
        ) +
        GAP_ITEM / 2;
    }
    if (edu.major) {
      eduY +=
        addTextNode(
          RIGHT_COL_X + INDENT,
          eduY,
          CONTENT_W - LEFT_COL_W - INDENT,
          `• ${edu.major}`,
          BODY_STYLE
        ) +
        GAP_ITEM / 2;
    }
    if (edu.cgpa) {
      eduY +=
        addTextNode(
          RIGHT_COL_X + INDENT,
          eduY,
          CONTENT_W - LEFT_COL_W - INDENT,
          `• ${edu.cgpa}`,
          BODY_STYLE
        ) +
        GAP_ITEM / 2;
    }
    eduY += GAP_BLOCK;
  }
  y = eduY + GAP_SECTION;

  // 7. Sekcja Key Skills
  addTextNode(MARGIN, y, LEFT_COL_W, 'KEY SKILLS', LEFT_HEADER_STYLE);
  const skills = api?.skills?.[0]?.items?.map((s) => s.name || s) || [];
  const mid = Math.ceil(skills.length / 2);
  const leftSkills = skills
    .slice(0, mid)
    .map((s) => `• ${s}`)
    .join('\n');
  const rightSkills = skills
    .slice(mid)
    .map((s) => `• ${s}`)
    .join('\n');
  const skillsW = (CONTENT_W - LEFT_COL_W) / 2 - INDENT;
  const leftH = addTextNode(RIGHT_COL_X, y, skillsW, leftSkills, BODY_STYLE);
  addTextNode(
    RIGHT_COL_X + skillsW + INDENT * 2,
    y,
    skillsW,
    rightSkills,
    BODY_STYLE
  );
  y += leftH + GAP_SECTION;

  // --- Finalizacja ---
  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

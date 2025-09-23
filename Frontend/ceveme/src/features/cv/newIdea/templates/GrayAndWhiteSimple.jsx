import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';
import { AlignCenter } from 'lucide-react';

export function buildGreenAndWhite(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // Dimensions
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 15;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  // Colors
  const COLOR_PRIMARY = '#334155'; // slate-700
  const COLOR_TEXT = '#545454'; // slate-600
  const COLOR_MUTED = '#94a3b8'; // slate-400
  const COLOR_BG = '#f4f4f4'; // slate-50
  const COLOR_LINE = '#e2e8f0'; // slate-200

  // Styles
  const NAME_STYLE = {
    fontSize: 32,
    fontWeight: 600,
    color: COLOR_PRIMARY,
    lineHeight: 1.1,
  };
  const NAME_FIRST_STYLE = {
    fontSize: 32,
    fontWeight: 400,
    color: COLOR_PRIMARY,
    lineHeight: 1.05,
    fontFamily: 'Lora, serif',
  };
  const NAME_LAST_STYLE = {
    fontSize: 32,
    fontWeight: 700,
    color: COLOR_PRIMARY,
    lineHeight: 1.05,
    fontFamily: 'Lora, serif',
  };
  const UNDERLINE_H = 1.2;
  const CONTACT_ICON_BG = '#545454';
  const CONTACT_ICON_FG = '#ffffff';
  const CONTACT_ICON_SIZE = 8;
  const CONTACT_TEXT_W = 70;

  function addContactRowIconRight(iconX, yRow, text, glyph) {
    // ikona (po prawej)
    nodes.push(
      createShapeNode({
        frame: {
          x: iconX,
          y: yRow - CONTACT_ICON_SIZE / 2,
          w: CONTACT_ICON_SIZE,
          h: CONTACT_ICON_SIZE,
        },
        style: {
          fill: { color: CONTACT_ICON_BG },
          stroke: null,
          cornerRadius: CONTACT_ICON_SIZE / 2,
        },
      })
    );

    // glyph wewnątrz ikony (optyczne wyśrodkowanie)
    nodes.push(
      createTextNode({
        frame: {
          x: iconX,
          y: yRow - CONTACT_ICON_SIZE / 2 + CONTACT_ICON_SIZE * 0.12,
          w: CONTACT_ICON_SIZE,
          h: CONTACT_ICON_SIZE,
        },
        text: glyph,
        textStyle: {
          fontSize: 10,
          color: CONTACT_ICON_FG,
          textAlign: 'center',
          lineHeight: 1,
        },
      })
    );

    // tekst po lewej od ikony, wyrównany do prawej (przylega do ikony)
    const textX = iconX - CONTACT_TEXT_W - 8;
    addText(textX, yRow - 0.6, CONTACT_TEXT_W, text, {
      ...CONTACT_STYLE,
      textAlign: 'right',
    });

    return CONTACT_ICON_SIZE;
  }
  const ICON_BG = '#545454';
  const ICON_FG = '#ffffff';

  const ICON_TEXT_STYLE = {
    fontSize: 7,
    color: ICON_FG,
    textAlign: 'center',
    lineHeight: 1,
  };

  const TITLE_STYLE = {
    fontSize: 16,
    fontWeight: 500,
    color: COLOR_TEXT,
    lineHeight: 1.2,
    marginTop: '6mm',
  };

  const SECTION_STYLE = {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Lora, serif',
    color: COLOR_PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const BODY_STYLE = {
    fontSize: 9.5,
    color: COLOR_TEXT,
    lineHeight: 1.5,
  };

  const SUMMARY_STYLE = {
    fontSize: 16,
    color: COLOR_TEXT,
    textAlign: 'center',
    fontWeight: '300',
  };

  const CONTACT_STYLE = {
    fontSize: 10,
    color: COLOR_TEXT,
    lineHeight: 1.5,
    textAlign: 'left',
  };

  const HEADER_H = 50;
  const HEADER_BG_H = 65;

  // Header background
  nodes.push(
    createShapeNode({
      frame: { x: 0, y: 0, w: PAGE_W, h: HEADER_BG_H },
      style: {
        fill: { color: COLOR_BG },
        stroke: null,
      },
    })
  );

  //   // Photo
  //   if (api?.personalData?.images) {
  //     nodes.push(
  //       createImageNode({
  //         frame: { x: PAGE_W - MARGIN - 45, y: MARGIN, w: 45, h: 45 },
  //         src: api.personalData.images,
  //         style: { cornerRadius: 4 },
  //       })
  //     );
  //   }

  let y = MARGIN;

  const headerY = y;

  // rozbijamy imię i nazwisko, ostatni token pogrubiamy
  const fullName = api?.personalData?.name || 'Your Name';
  const nameParts = String(fullName).trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts.pop() : '';
  const firstName = nameParts.join(' ') || lastName;
  const _canvas =
    typeof document !== 'undefined' ? document.createElement('canvas') : null;
  const _ctx = _canvas ? _canvas.getContext('2d') : null;
  function measureTextWidth(text = '', style = {}) {
    if (!_ctx) return 0;
    const fontSizePt = style?.fontSize ? `${style.fontSize}pt` : '12pt';
    const fontWeight = style?.fontWeight || 400;
    const fontFamily = style?.fontFamily || 'Inter, Arial, sans-serif';
    _ctx.font = `${fontWeight} ${fontSizePt} ${fontFamily}`;
    const px = _ctx.measureText(String(text)).width || 0;
    return px * 0.264583;
  }
  const nameLeftW =
    PAGE_W - 2 * MARGIN - (CONTACT_TEXT_W + CONTACT_ICON_SIZE + 20);
  const firstH = addText(
    MARGIN,
    headerY,
    nameLeftW,
    firstName + (lastName ? ' ' : ''),
    NAME_FIRST_STYLE
  );

  const firstNameOffset = Math.min(
    Math.max(measureTextWidth(firstName + ' ', NAME_FIRST_STYLE), 0),
    nameLeftW * 0.6
  );
  const lastH = addText(
    MARGIN + firstNameOffset || nameLeftW * 0.6,
    headerY,
    nameLeftW,
    lastName,
    NAME_LAST_STYLE
  );
  const nameH = Math.max(firstH, lastH);
  y = headerY + nameH;

  const underlineW = nameLeftW;
  nodes.push(
    createShapeNode({
      frame: {
        x: MARGIN,
        y: headerY + nameH + 4,
        w: underlineW,
        h: UNDERLINE_H,
      },
      style: { fill: { color: COLOR_LINE }, stroke: null },
    })
  );

  const iconX = PAGE_W - MARGIN - CONTACT_ICON_SIZE;
  let cy = headerY + Math.max(0, (nameH - CONTACT_ICON_SIZE) / 2);

  if (api?.personalData?.phoneNumber) {
    addContactRowIconRight(iconX, cy, api.personalData.phoneNumber, '☎');
    cy += CONTACT_ICON_SIZE + 8;
  }
  if (api?.personalData?.email) {
    addContactRowIconRight(iconX, cy, api.personalData.email, '✉');
    cy += CONTACT_ICON_SIZE + 8;
  }
  if (api?.personalData?.city) {
    addContactRowIconRight(iconX, cy, api.personalData.city, '⌂');
    cy += CONTACT_ICON_SIZE + 8;
  }
  // Title (below name)
  y += 12; // Space after underline
  const title = api?.headline || 'Your Title';
  y += addText(MARGIN, y, PAGE_W - MARGIN - 90, title, TITLE_STYLE);
  y += 12;

  // dolna granica nagłówka
  nodes.push(
    createShapeNode({
      frame: { x: 0, y: HEADER_BG_H - 0.6, w: PAGE_W, h: 1 },
      style: { fill: { color: COLOR_LINE }, stroke: null },
    })
  );

  // Summary
  if (api?.summary) {
    y += addSection('SUMMARY', y, { textAlign: 'center' });
    y += addText(MARGIN, y, CONTENT_W, api.summary, BODY_STYLE);
    y += 15;
  }

  // Experience
  if (api?.experience?.length) {
    y += addSection('Experience', y);

    for (const exp of api.experience) {
      y += addExperience(exp, y);
      y += 8;
    }
    y += 7;
  }

  // Projects
  if (api?.portfolio?.length) {
    y += addSection('Projects', y);

    for (const proj of api.portfolio) {
      y += addProject(proj, y);
      y += 8;
    }
    y += 7;
  }

  // Education
  if (api?.educations?.length) {
    y += addSection('Education', y);

    for (const edu of api.educations) {
      y += addEducation(edu, y);
      y += 6;
    }
    y += 7;
  }

  // Skills
  if (api?.skills?.length) {
    y += addSection('Skills', y);
    y += addSkills(api.skills, y);
  }

  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;

  // Helper functions
  function addText(x, y, w, text, style) {
    const h = measureTextHeightMm(text, w, style);

    let textX = x;
    if (style.textAlign === 'center') {
      const textWidth = measureTextWidth(text, style);
      textX = x + (w - textWidth) / 2;
    } else if (style.textAlign === 'right') {
      const textWidth = measureTextWidth(text, style);
      textX = x + (w - textWidth);
    }

    nodes.push(
      createTextNode({
        frame: { x: textX, y, w, h },
        text,
        textStyle: style,
      })
    );
    return h;
  }

  function addSection(title, y, style = SECTION_STYLE) {
    const h = addText(MARGIN, y, CONTENT_W, title, style);
    addLine(MARGIN, y + h + 2);
    return h + 6;
  }

  function addLine(x, y) {
    nodes.push(
      createShapeNode({
        frame: { x, y, w: CONTENT_W, h: 0.5 },
        style: {
          fill: { color: COLOR_LINE },
          stroke: null,
        },
      })
    );
  }

  // Components
  function addExperience(exp, y) {
    let h = 0;

    // Title & Date
    const titleH = addText(
      MARGIN,
      y,
      CONTENT_W * 0.7,
      [exp.title, exp.company].filter(Boolean).join(' — '),
      { ...BODY_STYLE, fontWeight: 600 }
    );

    if (exp.period) {
      addText(MARGIN + CONTENT_W * 0.7, y, CONTENT_W * 0.3, exp.period, {
        ...BODY_STYLE,
        color: COLOR_MUTED,
        textAlign: 'right',
      });
    }

    h += titleH + 2;

    // Description
    if (exp.jobDescription) {
      h += addText(MARGIN, y + h, CONTENT_W, exp.jobDescription, BODY_STYLE);
      h += 2;
    }

    // Achievements
    const achievements = exp.achievements
      ?.map((a) => `• ${a.description}`)
      .filter(Boolean);
    if (achievements?.length) {
      h += addText(
        MARGIN,
        y + h,
        CONTENT_W,
        achievements.join('\n'),
        BODY_STYLE
      );
    }

    return h;
  }

  function addProject(proj, y) {
    let h = 0;

    // Title
    h += addText(MARGIN, y, CONTENT_W, proj.name || 'Project', {
      ...BODY_STYLE,
      fontWeight: 600,
    });
    h += 2;

    // Description
    if (proj.description) {
      h += addText(MARGIN, y + h, CONTENT_W, proj.description, BODY_STYLE);
      h += 2;
    }

    // Technologies
    const tech = proj.technologies?.map((t) => t.name).filter(Boolean);
    if (tech?.length) {
      h += addText(MARGIN, y + h, CONTENT_W, tech.join(' • '), {
        ...BODY_STYLE,
        color: COLOR_MUTED,
      });
    }

    return h;
  }

  function addEducation(edu, y) {
    let h = 0;

    // Degree & Date
    const degreeH = addText(
      MARGIN,
      y,
      CONTENT_W * 0.7,
      [edu.degree, edu.institution].filter(Boolean).join(' — '),
      { ...BODY_STYLE, fontWeight: 600 }
    );

    if (edu.period) {
      addText(MARGIN + CONTENT_W * 0.7, y, CONTENT_W * 0.3, edu.period, {
        ...BODY_STYLE,
        color: COLOR_MUTED,
        textAlign: 'right',
      });
    }

    h += degreeH;

    return h;
  }

  function addSkills(skills, y) {
    const categories = skills
      .map((cat) => ({
        name: cat.category || 'Skills',
        items: cat.items?.map((i) => i.name || i).filter(Boolean),
      }))
      .filter((cat) => cat.items?.length);

    let h = 0;

    for (const cat of categories) {
      h += addText(MARGIN, y + h, CONTENT_W, cat.name, {
        ...BODY_STYLE,
        fontWeight: 600,
      });
      h += 2;

      h += addText(MARGIN, y + h, CONTENT_W, cat.items.join(' • '), {
        ...BODY_STYLE,
        color: COLOR_MUTED,
      });
      h += 6;
    }

    return h;
  }
}

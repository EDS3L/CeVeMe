import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildGrayMinimalist(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // Colors
  const COLOR_BG = '#f8fafc'; // slate-50
  const COLOR_TEXT = '#334155'; // slate-700
  const COLOR_MUTED = '#64748b'; // slate-500
  const COLOR_LINE = '#e2e8f0'; // slate-200

  // Dimensions
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - 2 * MARGIN;
  const LEFT_COL_W = 35;
  const RIGHT_COL_W = CONTENT_W - LEFT_COL_W - 8;

  // Typography
  const HEADING_STYLE = {
    fontSize: 22,
    fontWeight: 700,
    color: COLOR_TEXT,
    letterSpacing: 0.3,
  };

  const SECTION_STYLE = {
    fontSize: 14,
    fontWeight: 700,
    color: COLOR_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 1,
  };

  const BODY_STYLE = {
    fontSize: 10,
    color: COLOR_TEXT,
    lineHeight: 1.5,
  };

  const MUTED_STYLE = {
    ...BODY_STYLE,
    color: COLOR_MUTED,
  };

  // Header
  const HEADER_H = 55;
  nodes.push(
    createShapeNode({
      frame: { x: 0, y: 0, w: PAGE_W, h: HEADER_H },
      style: {
        fill: { color: COLOR_BG },
        stroke: null,
      },
    })
  );

  let y = MARGIN;

  // Name & Title
  const name = api?.personalData?.name || 'Your Name';
  y += addText(MARGIN, y, PAGE_W - MARGIN - 50, name, HEADING_STYLE);
  y += 4;

  const title = api?.headline || 'Your Title';
  y += addText(MARGIN, y, PAGE_W - MARGIN - 50, title, {
    fontSize: 13,
    color: COLOR_TEXT,
  });

  // Contact info
  y += 8;
  const contactItems = [
    api?.personalData?.email,
    api?.personalData?.phoneNumber,
    api?.personalData?.city,
  ].filter(Boolean);

  const links = api?.personalData?.links || [];
  const formattedLinks = links.map((l) => l.url).filter(Boolean);

  if (contactItems.length || formattedLinks.length) {
    const allContacts = [...contactItems, ...formattedLinks];
    y += addText(MARGIN, y, CONTENT_W, allContacts.join(' • '), MUTED_STYLE);
  }

  y = HEADER_H + MARGIN;

  // Summary
  if (api?.summary) {
    y += addSection('Summary', y);
    y += addText(MARGIN, y, CONTENT_W, api.summary, BODY_STYLE);
    y += 15;
  }

  // Experience
  if (api?.experience?.length) {
    y += addSection('Professional Experience', y);

    for (const exp of api.experience) {
      y += addExperience(exp, y);
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

  // Certifications
  if (api?.certificates?.length) {
    y += addSection('Certifications', y);
    y += addCertifications(api.certificates, y);
  }

  doc.nodes = nodes;
  return doc;

  // Helper functions
  function addText(x, y, w, text, style) {
    const h = measureTextHeightMm(text, w, style);
    nodes.push(
      createTextNode({
        frame: { x, y, w, h },
        text,
        textStyle: style,
      })
    );
    return h;
  }

  function addSection(title, y) {
    const h = addText(MARGIN, y, CONTENT_W, title, SECTION_STYLE);
    addLine(MARGIN, y + h + 2);
    return h + 6;
  }

  function addLine(x, y) {
    nodes.push(
      createShapeNode({
        frame: { x, y, w: CONTENT_W, h: 0.4 },
        style: {
          fill: { color: COLOR_LINE },
          stroke: null,
        },
      })
    );
  }

  function addExperience(exp, y) {
    let h = 0;

    // Title & Company
    const titleH = addText(
      MARGIN,
      y,
      CONTENT_W - LEFT_COL_W,
      [exp.title, exp.company].filter(Boolean).join(' — '),
      { ...BODY_STYLE, fontWeight: 600 }
    );

    // Period
    if (exp.period) {
      addText(MARGIN + CONTENT_W - LEFT_COL_W, y, LEFT_COL_W, exp.period, {
        ...MUTED_STYLE,
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

  function addEducation(edu, y) {
    let h = 0;

    // Degree & Institution
    const degreeH = addText(
      MARGIN,
      y,
      CONTENT_W - LEFT_COL_W,
      [edu.degree, edu.institution].filter(Boolean).join(' — '),
      { ...BODY_STYLE, fontWeight: 600 }
    );

    // Period
    if (edu.period) {
      addText(MARGIN + CONTENT_W - LEFT_COL_W, y, LEFT_COL_W, edu.period, {
        ...MUTED_STYLE,
        textAlign: 'right',
      });
    }

    h += degreeH;

    // Specialization if exists
    if (edu.specialization) {
      h += 2;
      h += addText(MARGIN, y + h, CONTENT_W, edu.specialization, BODY_STYLE);
    }

    return h;
  }

  function addSkills(skills, y) {
    let h = 0;

    for (const category of skills) {
      // Category name
      h += addText(MARGIN, y + h, CONTENT_W, category.category || 'Skills', {
        ...BODY_STYLE,
        fontWeight: 600,
      });
      h += 2;

      // Skills list
      const skillItems = category.items
        ?.map((item) => item.name || item)
        .filter(Boolean);
      if (skillItems?.length) {
        h += addText(MARGIN, y + h, CONTENT_W, skillItems.join(' • '), {
          ...BODY_STYLE,
          color: COLOR_MUTED,
        });
        h += 6;
      }
    }

    return h;
  }

  function addCertifications(certificates, y) {
    let h = 0;

    for (const cert of certificates) {
      // Certificate name & issuer
      const certH = addText(
        MARGIN,
        y + h,
        CONTENT_W - LEFT_COL_W,
        [cert.name, cert.issuer].filter(Boolean).join(' — '),
        { ...BODY_STYLE, fontWeight: 600 }
      );

      // Date
      if (cert.date) {
        addText(MARGIN + CONTENT_W - LEFT_COL_W, y + h, LEFT_COL_W, cert.date, {
          ...MUTED_STYLE,
          textAlign: 'right',
        });
      }

      h += certH + 4;
    }

    return h;
  }
}

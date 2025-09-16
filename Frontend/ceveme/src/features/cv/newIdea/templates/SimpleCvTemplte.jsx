import { emptyDocument, createTextNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildSimpleCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - 2 * MARGIN;
  const LEFT_COL_W = CONTENT_W * 0.65; // Main content
  const RIGHT_COL_W = CONTENT_W * 0.32; // Contact/References
  const COL_GAP = CONTENT_W * 0.03;
  const RIGHT_COL_X = MARGIN + LEFT_COL_W + COL_GAP;

  // Exact styles from PDF
  const NAME_STYLE = {
    fontSize: 24,
    fontWeight: 800,
    color: '#000000',
    lineHeight: 1.1,
    textAlign: 'center',
    letterSpacing: 2,
  };

  const SUBTITLE_STYLE = {
    fontSize: 11,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.2,
    textAlign: 'center',
    letterSpacing: 4,
  };

  const SECTION_HEADER_STYLE = {
    fontSize: 11,
    fontWeight: 800,
    color: '#000000',
    lineHeight: 1.2,
    textTransform: 'uppercase',
  };

  const BODY_STYLE = {
    fontSize: 9.5,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.3,
  };

  const BOLD_STYLE = {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#000000',
    lineHeight: 1.3,
  };

  const COMPANY_STYLE = {
    fontSize: 9.5,
    fontWeight: 800,
    color: '#000000',
    lineHeight: 1.2,
    textTransform: 'uppercase',
  };

  const DATE_STYLE = {
    fontSize: 9,
    fontWeight: 700,
    color: '#000000',
    lineHeight: 1.2,
    textTransform: 'uppercase',
  };

  const CONTACT_HEADER_STYLE = {
    fontSize: 9,
    fontWeight: 800,
    color: '#000000',
    lineHeight: 1.2,
    textTransform: 'uppercase',
  };

  const CONTACT_STYLE = {
    fontSize: 8.5,
    fontWeight: 400,
    color: '#000000',
    lineHeight: 1.4,
  };

  // Compact spacing
  const GAP_SECTION = 8;
  const GAP_BLOCK = 4;
  const GAP_ITEM = 2;
  const GAP_TINY = 1;

  const addTextNode = (x, y, w, text, style = BODY_STYLE) => {
    const h = Math.max(3, measureTextHeightMm(text, w, style));
    nodes.push(
      createTextNode({
        frame: { x, y, w, h, rotation: 0 },
        text,
        textStyle: style,
      })
    );
    return h;
  };

  const addCenterTextNode = (y, text, style) => {
    return addTextNode(MARGIN, y, CONTENT_W, text, {
      ...style,
      textAlign: 'center',
    });
  };

  let y = 25;
  let rightY = 80; // Start right column lower

  // Header - Name and subtitle
  const name = (api?.personalData?.name || 'FULL NAME').toUpperCase();
  y += addCenterTextNode(y, name, NAME_STYLE) + GAP_TINY;

  const headline = api?.headline || 'Professional Title';
  y += addCenterTextNode(y, headline, SUBTITLE_STYLE) + GAP_SECTION * 1.5;

  // Right column - Contact Info
  addTextNode(
    RIGHT_COL_X,
    rightY,
    RIGHT_COL_W,
    'CONTACT INFO:',
    CONTACT_HEADER_STYLE
  );
  rightY += 12;

  const contactItems = [];
  if (api?.personalData?.phoneNumber)
    contactItems.push(api.personalData.phoneNumber);
  if (api?.personalData?.city) {
    const fullAddress = api.personalData.city;
    contactItems.push(fullAddress);
  }
  if (api?.personalData?.email) contactItems.push(api.personalData.email);
  if (Array.isArray(api?.personalData?.links)) {
    contactItems.push(
      ...api.personalData.links.map((link) =>
        link.includes('linkedin') ? `LinkedIn: ${link}` : link
      )
    );
  }

  if (contactItems.length > 0) {
    rightY +=
      addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        contactItems.join('\n'),
        CONTACT_STYLE
      ) + GAP_SECTION;
  }

  // Main content - About section
  if (api.summary) {
    y +=
      addTextNode(
        MARGIN,
        y,
        LEFT_COL_W,
        `ABOUT ${(
          api?.personalData?.name?.split(' ')[0] || 'CANDIDATE'
        ).toUpperCase()}`,
        SECTION_HEADER_STYLE
      ) + GAP_BLOCK;
    y +=
      addTextNode(MARGIN, y, LEFT_COL_W, api.summary, BODY_STYLE) + GAP_SECTION;
  }

  // Specialization from skills
  if (Array.isArray(api.skills) && api.skills.length > 0) {
    y +=
      addTextNode(
        MARGIN,
        y,
        LEFT_COL_W,
        'SPECIALIZATION',
        SECTION_HEADER_STYLE
      ) + GAP_BLOCK;

    const specialization =
      api.skills
        .map((cat) => {
          const items = (cat?.items || []).map((i) => i?.name).filter(Boolean);
          return items.length > 0 ? items.join(', ') : '';
        })
        .filter(Boolean)
        .join('. Most experience focuses on ') + '.';

    const specText = `Most of the candidate's experience has been focused on ${specialization}`;
    y += addTextNode(MARGIN, y, LEFT_COL_W, specText, BODY_STYLE) + GAP_SECTION;
  }

  // Right column - References (if certificates exist)
  if (Array.isArray(api.certificates) && api.certificates.length > 0) {
    rightY +=
      addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        'REFERENCES:',
        CONTACT_HEADER_STYLE
      ) + GAP_BLOCK;

    api.certificates.slice(0, 2).forEach((cert) => {
      if (cert?.name) {
        rightY +=
          addTextNode(RIGHT_COL_X, rightY, RIGHT_COL_W, cert.name, BOLD_STYLE) +
          GAP_TINY;
      }
      if (cert?.issuer) {
        rightY +=
          addTextNode(
            RIGHT_COL_X,
            rightY,
            RIGHT_COL_W,
            cert.issuer,
            CONTACT_STYLE
          ) + GAP_TINY;
      }
      if (api?.personalData?.phoneNumber) {
        rightY +=
          addTextNode(
            RIGHT_COL_X,
            rightY,
            RIGHT_COL_W,
            api.personalData.phoneNumber,
            CONTACT_STYLE
          ) + GAP_TINY;
      }
      if (api?.personalData?.email) {
        rightY +=
          addTextNode(
            RIGHT_COL_X,
            rightY,
            RIGHT_COL_W,
            api.personalData.email,
            CONTACT_STYLE
          ) + GAP_BLOCK;
      }
    });
  }

  // Professional Work
  if (Array.isArray(api.experience) && api.experience.length > 0) {
    y +=
      addTextNode(
        MARGIN,
        y,
        LEFT_COL_W,
        'PROFESSIONAL WORK',
        SECTION_HEADER_STYLE
      ) + GAP_BLOCK;

    api.experience.forEach((exp) => {
      if (exp?.title) {
        y +=
          addTextNode(MARGIN, y, LEFT_COL_W, exp.title, BOLD_STYLE) + GAP_TINY;
      }

      if (exp?.company) {
        y +=
          addTextNode(
            MARGIN,
            y,
            LEFT_COL_W,
            exp.company.toUpperCase(),
            COMPANY_STYLE
          ) + GAP_TINY;
      }

      if (exp?.period) {
        y +=
          addTextNode(
            MARGIN,
            y,
            LEFT_COL_W,
            exp.period.toUpperCase(),
            DATE_STYLE
          ) + GAP_ITEM;
      }

      // Combine job description and achievements into bullet points
      const bullets = [];
      if (exp?.jobDescription) bullets.push(exp.jobDescription);
      if (Array.isArray(exp?.achievements)) {
        bullets.push(
          ...exp.achievements.map((a) => a?.description).filter(Boolean)
        );
      }

      bullets.forEach((bullet) => {
        y +=
          addTextNode(MARGIN, y, LEFT_COL_W, `- ${bullet}`, BODY_STYLE) +
          GAP_TINY;
      });

      y += GAP_BLOCK;
    });
    y += GAP_ITEM;
  }

  // Academic Background
  if (Array.isArray(api.educations) && api.educations.length > 0) {
    y +=
      addTextNode(
        MARGIN,
        y,
        LEFT_COL_W,
        'ACADEMIC BACKGROUND',
        SECTION_HEADER_STYLE
      ) + GAP_BLOCK;

    api.educations.forEach((edu) => {
      if (edu?.institution) {
        y +=
          addTextNode(MARGIN, y, LEFT_COL_W, edu.institution, BOLD_STYLE) +
          GAP_TINY;
      }

      if (edu?.degree) {
        y +=
          addTextNode(
            MARGIN,
            y,
            LEFT_COL_W,
            edu.degree.toUpperCase(),
            COMPANY_STYLE
          ) + GAP_TINY;
      }

      if (edu?.period) {
        const graduationText =
          edu.period.includes('Expected') || edu.period.includes('EXPECTED')
            ? edu.period.toUpperCase()
            : `GRADUATED ${edu.period.toUpperCase()}`;
        y +=
          addTextNode(MARGIN, y, LEFT_COL_W, graduationText, DATE_STYLE) +
          GAP_ITEM;
      }

      // Add activities/achievements as bullet points
      const activities = [];
      if (edu?.specialization) activities.push(edu.specialization);

      // Add some standard academic activities if portfolio projects exist
      if (Array.isArray(api.portfolio) && api.portfolio.length > 0) {
        api.portfolio.slice(0, 3).forEach((project) => {
          if (project?.name) activities.push(project.name);
        });
      }

      activities.forEach((activity) => {
        y +=
          addTextNode(MARGIN, y, LEFT_COL_W, `- ${activity}`, BODY_STYLE) +
          GAP_TINY;
      });

      y += GAP_BLOCK;
    });
  }

  // GDPR at bottom in small text
  if (api.gdprClause) {
    const gdprStyle = { ...CONTACT_STYLE, fontSize: 7, color: '#666666' };
    const gdprHeight = measureTextHeightMm(
      api.gdprClause,
      CONTENT_W,
      gdprStyle
    );
    const gdprY = PAGE_H - MARGIN - gdprHeight - 5;

    addTextNode(MARGIN, gdprY, CONTENT_W, api.gdprClause, gdprStyle);
  }

  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

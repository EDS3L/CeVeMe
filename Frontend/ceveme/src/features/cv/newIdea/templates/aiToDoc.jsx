import {
  emptyDocument,
  createTextNode,
  createImageNode,
  createShapeNode,
} from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildDocFromAI(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 12;
  const HEADER_H = 36;
  const SIDEBAR_W = 64;
  const MAIN_X = SIDEBAR_W + MARGIN;
  const MAIN_W = PAGE_W - MAIN_X - MARGIN;

  const LABEL_STYLE = {
    fontSize: 11,
    fontWeight: 800,
    color: '#0f766e',
    lineHeight: 1.25,
  };
  const BODY_STYLE = {
    fontSize: 10,
    fontWeight: 400,
    color: '#0f172a',
    lineHeight: 1.45,
  };
  const SOFT_STYLE = {
    fontSize: 9,
    fontWeight: 400,
    color: '#0f172a',
    lineHeight: 1.35,
  };

  const GAP_SECTION = 5;
  const GAP_BLOCK = 3;

  const addTextNode = (x, y, w, text, style = BODY_STYLE) => {
    const h = Math.max(6, measureTextHeightMm(text, w, style));
    nodes.push(
      createTextNode({
        frame: { x, y, w, h, rotation: 0 },
        text,
        textStyle: style,
      })
    );
    return h;
  };
  const addLabelNode = (x, y, w, text) =>
    addTextNode(x, y, w, text, LABEL_STYLE);
  const addRule = (x, y, w) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h: 0.8, rotation: 0 },
        style: {
          fill: { color: '#e2e8f0', opacity: 1 },
          stroke: null,
          cornerRadius: 0,
        },
      })
    );

  // Pasek nagłówka
  nodes.push(
    createShapeNode({
      frame: { x: 0, y: 0, w: PAGE_W, h: HEADER_H, rotation: 0 },
      style: {
        fill: { color: '#f8fafc', opacity: 1 },
        stroke: null,
        cornerRadius: 12,
      },
    })
  );

  const name = api?.personalData?.name || 'Imię i nazwisko';
  const headline = api?.headline || ' ';

  addTextNode(MARGIN, 8, PAGE_W - 2 * MARGIN - 28, name, {
    ...BODY_STYLE,
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.15,
    color: '#0f172a',
  });
  addTextNode(MARGIN, 22, PAGE_W - 2 * MARGIN - 28, headline, {
    ...BODY_STYLE,
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    lineHeight: 1.25,
  });

  if (api?.personalData?.images) {
    nodes.push(
      createImageNode({
        frame: { x: PAGE_W - MARGIN - 24, y: 8, w: 24, h: 24, rotation: 0 },
        src: api.personalData.images,
        style: { cornerRadius: 999 },
      })
    );
  }

  // Sidebar tło
  nodes.push(
    createShapeNode({
      frame: {
        x: 0,
        y: HEADER_H,
        w: SIDEBAR_W,
        h: PAGE_H - HEADER_H,
        rotation: 0,
      },
      style: {
        fill: { color: '#eef2ff', opacity: 1 },
        stroke: null,
        cornerRadius: 0,
      },
    })
  );

  let sideY = HEADER_H + 6;

  // Kontakt
  addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, 'Kontakt', {
    ...LABEL_STYLE,
    color: '#3730a3',
  });
  sideY += GAP_BLOCK + 6;
  const contact = [
    api?.personalData?.phoneNumber && `📞  ${api.personalData.phoneNumber}`,
    api?.personalData?.email && `✉️  ${api.personalData.email}`,
    api?.personalData?.city && `📍  ${api.personalData.city}`,
    ...(Array.isArray(api?.personalData?.links)
      ? api.personalData.links.map((l) => `🔗 ${l}`)
      : []),
  ]
    .filter(Boolean)
    .join('\n');
  if (contact)
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, contact, SOFT_STYLE) +
      GAP_SECTION;
  addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
  sideY += GAP_SECTION;

  // Umiejętności
  sideY +=
    addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, 'Umiejętności', {
      ...LABEL_STYLE,
      color: '#3730a3',
    }) + GAP_BLOCK;
  if (Array.isArray(api.skills)) {
    const skillsBlocks = api.skills
      .map((cat) => {
        const category = cat?.category || 'Inne';
        const items = (cat?.items || [])
          .map((i) => i?.name)
          .filter(Boolean)
          .join(' • ');
        return items ? `${category}:\n${items}` : category;
      })
      .filter(Boolean)
      .join('\n\n');
    if (skillsBlocks)
      sideY +=
        addTextNode(
          MARGIN,
          sideY,
          SIDEBAR_W - 2 * MARGIN,
          skillsBlocks,
          SOFT_STYLE
        ) + GAP_SECTION;
  }
  addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
  sideY += GAP_SECTION;

  // Języki
  if (Array.isArray(api.languages) && api.languages.length) {
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, 'Języki', {
        ...LABEL_STYLE,
        color: '#3730a3',
      }) + GAP_BLOCK;
    const langText = api.languages
      .map((l) => `${l.language || ''}${l.level ? ` – ${l.level}` : ''}`)
      .join('\n');
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, langText, SOFT_STYLE) +
      GAP_SECTION;
    addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
    sideY += GAP_SECTION;
  }

  // Certyfikaty
  if (Array.isArray(api.certificates) && api.certificates.length) {
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, 'Certyfikaty', {
        ...LABEL_STYLE,
        color: '#3730a3',
      }) + GAP_BLOCK;
    const certText = api.certificates
      .map((c) => {
        const line = [c?.name, c?.issuer].filter(Boolean).join(' – ');
        return c?.data ? `${line} (${c.data})` : line;
      })
      .filter(Boolean)
      .join('\n');
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, certText, SOFT_STYLE) +
      GAP_SECTION;
    addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
    sideY += GAP_SECTION;
  }

  let y = HEADER_H + 6;

  // Podsumowanie
  if (api.summary) {
    y += addLabelNode(MAIN_X, y, MAIN_W, 'Podsumowanie') + GAP_BLOCK;
    y += addTextNode(MAIN_X, y, MAIN_W, api.summary, BODY_STYLE) + GAP_SECTION;
  }

  // Doświadczenie
  if (Array.isArray(api.experience) && api.experience.length) {
    y += addLabelNode(MAIN_X, y, MAIN_W, 'Doświadczenie') + GAP_BLOCK;
    for (const exp of api.experience) {
      const head =
        [exp?.title, exp?.company].filter(Boolean).join(' – ') +
        (exp?.period ? ` (${exp.period})` : '');
      if (head.trim())
        y +=
          addTextNode(MAIN_X, y, MAIN_W, head, {
            ...BODY_STYLE,
            fontWeight: 800,
          }) + 1.5;
      if (exp?.jobDescription)
        y +=
          addTextNode(MAIN_X, y, MAIN_W, exp.jobDescription, BODY_STYLE) + 1.5;
      const bullets = (exp?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean)
        .map((t) => `• ${t}`)
        .join('\n');
      if (bullets)
        y += addTextNode(MAIN_X, y, MAIN_W, bullets, BODY_STYLE) + GAP_BLOCK;
      y += 2;
    }
    y += GAP_SECTION;
  }

  // Edukacja
  if (Array.isArray(api.educations) && api.educations.length) {
    y += addLabelNode(MAIN_X, y, MAIN_W, 'Edukacja') + GAP_BLOCK;
    for (const ed of api.educations) {
      const top = [ed?.degree, ed?.institution].filter(Boolean).join(' – ');
      const spec = ed?.specialization ? `\n${ed.specialization}` : '';
      const per = ed?.period ? `\n${ed.period}` : '';
      const block = `${top}${spec}${per}`.trim();
      if (block)
        y += addTextNode(MAIN_X, y, MAIN_W, block, BODY_STYLE) + GAP_BLOCK;
    }
    y += GAP_SECTION;
  }

  // Projekty
  if (Array.isArray(api.portfolio) && api.portfolio.length) {
    y += addLabelNode(MAIN_X, y, MAIN_W, 'Projekty') + GAP_BLOCK;
    for (const p of api.portfolio) {
      const line1 = p?.name ? p.name : 'Projekt';
      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      const url = p?.url ? `\n${p.url}` : '';
      const text = `${line1}${tech ? `\n${tech}` : ''}${url}`;
      y += addTextNode(MAIN_X, y, MAIN_W, text, BODY_STYLE) + GAP_BLOCK;
    }
    y += GAP_SECTION;
  }

  // RODO
  if (api.gdprClause) {
    const rodoLabelH = measureTextHeightMm(
      'Klauzula RODO',
      MAIN_W,
      LABEL_STYLE
    );
    const rodoBodyH = measureTextHeightMm(api.gdprClause, MAIN_W, {
      ...BODY_STYLE,
      fontSize: 8,
      lineHeight: 1.25,
      color: '#334155',
    });
    const totalRodoH = rodoLabelH + GAP_BLOCK + rodoBodyH;
    const yRodo = Math.max(y + GAP_SECTION, PAGE_H - MARGIN - totalRodoH);

    addTextNode(MAIN_X, yRodo, MAIN_W, 'Klauzula RODO', LABEL_STYLE);
    addTextNode(
      MAIN_X,
      yRodo + rodoLabelH + GAP_BLOCK,
      MAIN_W,
      api.gdprClause,
      { ...BODY_STYLE, fontSize: 8, lineHeight: 1.25, color: '#334155' }
    );
  }

  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

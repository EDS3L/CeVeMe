// templates/GreenBlackATSNodes.js
// Zielono-czarne CV (ATS) w Twoim silniku (nodes): createTextNode/createShapeNode.
// Lewa kolumna: Kluczowe umiejętności, Edukacja, Języki, Certyfikaty
// Prawa kolumna: Podsumowanie, Doświadczenie, Projekty
// Dostosowane do JSON-a z links: [{type,url}], portfolio z achievements/technologies/url.

import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildGreenBlackATSCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // --- Wymiary (mm) i layout ---
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 12;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  const COL_GAP = 6;
  const LEFT_COL_W = Math.floor((CONTENT_W - COL_GAP) * 0.36); // ~36%
  const RIGHT_COL_W = CONTENT_W - COL_GAP - LEFT_COL_W; // ~64%
  const LEFT_X = MARGIN;
  const RIGHT_X = MARGIN + LEFT_COL_W + COL_GAP;

  // --- Kolory / style (dopasowane do PDF) ---
  const COLOR_PRIMARY = '#0f172a'; // bardzo ciemny
  const COLOR_BODY = '#111827';
  const COLOR_MUTED = '#374151';
  const COLOR_ACCENT = '#16a34a'; // zielony nagłówków sekcji
  const COLOR_RULE = '#10b981'; // jaśniejszy zielony (podkreślenia)

  const NAME_STYLE = { fontSize: 30, fontWeight: 800, color: COLOR_PRIMARY };
  const TITLE_STYLE = {
    fontSize: 12,
    fontWeight: 700,
    color: COLOR_MUTED,
    letterSpacing: 0.2,
  }; // bez uppercase jak w PDF
  const CONTACT_STYLE = {
    fontSize: 9.5,
    fontWeight: 500,
    color: COLOR_MUTED,
    lineHeight: 1.35,
  };

  const SECTION_HDR_STYLE = {
    fontSize: 11,
    fontWeight: 800,
    color: COLOR_ACCENT,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  };
  const BODY_STYLE = {
    fontSize: 10,
    fontWeight: 400,
    color: COLOR_BODY,
    lineHeight: 1.45,
  };
  const BODY_BOLD = { ...BODY_STYLE, fontWeight: 700, color: COLOR_PRIMARY };
  const BODY_MUTED = { ...BODY_STYLE, color: COLOR_MUTED };

  // --- Odstępy ---
  const GAP_HEADER = 6;
  const GAP_SECTION = 10;
  const GAP_BLOCK = 4;

  // --- Helpery ---
  const addText = (x, y, w, text, style = BODY_STYLE) => {
    const txt = text || '';
    const h = Math.max(6, measureTextHeightMm(txt, w, style));
    nodes.push(
      createTextNode({ frame: { x, y, w, h }, text: txt, textStyle: style })
    );
    return h;
  };

  const addRule = (x, y, w, h = 0.9, color = COLOR_RULE) => {
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color, opacity: 1 }, stroke: null, cornerRadius: 1 },
      })
    );
  };

  const addSectionHeader = (x, y, w, title) => {
    const hTitle = addText(x, y, w, title, SECTION_HDR_STYLE);
    const yLine = y + hTitle + 1.2;
    addRule(x, yLine, w, 0.9, COLOR_RULE);
    return yLine - y + 0.9; // łącznie nagłówek + linia
  };

  const addBullets = (x, y, w, items = [], style = BODY_STYLE) => {
    const text = items.map((t) => `• ${t}`).join('\n');
    return text ? addText(x, y, w, text, style) : 0;
  };

  // --- Normalizacja danych z Twojego JSON-a ---
  const pd = api?.personalData || {};
  const name = pd?.name || 'Imię i nazwisko';
  const headline = api?.headline || '';
  const phone =
    pd?.phoneNumber && !pd.phoneNumber.startsWith('+')
      ? `+48 ${pd.phoneNumber}`
      : pd?.phoneNumber || '';
  const email = pd?.email || '';
  const city = pd?.city || '';

  const linksRaw = Array.isArray(pd?.links) ? pd.links : [];
  const urlByType = (t) =>
    linksRaw.find((l) => (l?.type || '').toLowerCase() === t)?.url || '';
  const linkedIn = urlByType('linkedin') || urlByType('link');
  const github = urlByType('github');
  const linksFlat = linksRaw
    .map((l) => (typeof l === 'string' ? l : l?.url))
    .filter(Boolean);

  const skills = Array.isArray(api?.skills)
    ? api.skills.flatMap((cat) =>
        (cat?.items || []).map((i) => i?.name).filter(Boolean)
      )
    : [];

  const educations = Array.isArray(api?.educations) ? api.educations : [];
  const experiences = Array.isArray(api?.experience) ? api.experience : [];
  const languages = Array.isArray(api?.languages) ? api.languages : [];
  const certificates = (
    Array.isArray(api?.certificates) ? api.certificates : []
  )
    .map((c) => ({
      name: c?.name || '',
      issuer: c?.issuer || '',
      date: c?.date || c?.data || '',
    }))
    .filter((c) => c.name);

  const summary = api?.summary || '';
  const rodo = api?.gdprClause || '';

  const portfolio = Array.isArray(api?.portfolio) ? api.portfolio : [];
  // projekty: name, technologies[].name, achievements[].description, url

  // --- Nagłówek ---
  let y = MARGIN;
  y += addText(MARGIN, y, CONTENT_W, name, NAME_STYLE) + 2;
  if (headline)
    y += addText(MARGIN, y, CONTENT_W, headline, TITLE_STYLE) + GAP_HEADER;
  addRule(MARGIN, y, CONTENT_W, 1.2);
  y += 3;

  const contactBits = [
    email && `✉ ${email}`,
    phone && `☎ ${phone}`,
    city && `📍 ${city}`,
    linkedIn && `in ${linkedIn}`,
    github && `gh ${github}`,
  ].filter(Boolean);

  if (!linkedIn && !github && linksFlat.length) contactBits.push(linksFlat[0]);

  if (contactBits.length)
    y +=
      addText(MARGIN, y, CONTENT_W, contactBits.join('  |  '), CONTACT_STYLE) +
      GAP_SECTION;

  // --- Kolumny ---
  let leftY = y;
  let rightY = y;

  // Prawa: Podsumowanie
  if (summary) {
    rightY +=
      addSectionHeader(RIGHT_X, rightY, RIGHT_COL_W, 'Podsumowanie') +
      GAP_BLOCK;
    rightY +=
      addText(RIGHT_X, rightY, RIGHT_COL_W, summary, BODY_STYLE) + GAP_SECTION;
  }

  // Prawa: Doświadczenie
  if (experiences.length) {
    rightY +=
      addSectionHeader(RIGHT_X, rightY, RIGHT_COL_W, 'Doświadczenie zawodowe') +
      GAP_BLOCK;

    for (const exp of experiences) {
      const head = [exp?.title, exp?.company].filter(Boolean).join(' – ');
      const meta = [exp?.period || '', exp?.location || '']
        .filter(Boolean)
        .join('  |  ');

      let blockH = 0;
      if (head)
        blockH +=
          addText(RIGHT_X, rightY + blockH, RIGHT_COL_W, head, BODY_BOLD) + 1.2;
      if (meta)
        blockH +=
          addText(RIGHT_X, rightY + blockH, RIGHT_COL_W, meta, BODY_MUTED) +
          1.2;
      if (exp?.jobDescription)
        blockH +=
          addText(
            RIGHT_X,
            rightY + blockH,
            RIGHT_COL_W,
            exp.jobDescription,
            BODY_STYLE
          ) + 1.2;

      const bullets = (exp?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean);
      if (bullets.length)
        blockH += addBullets(
          RIGHT_X,
          rightY + blockH,
          RIGHT_COL_W,
          bullets,
          BODY_STYLE
        );

      rightY += blockH + GAP_BLOCK + 1.5;
    }
    rightY += GAP_SECTION;
  }

  // Prawa: Projekty (NOWA SEKCJA)
  if (portfolio.length) {
    rightY +=
      addSectionHeader(RIGHT_X, rightY, RIGHT_COL_W, 'Projekty') + GAP_BLOCK;

    for (const p of portfolio) {
      const nameLine = p?.name || 'Projekt';
      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      const url = p?.url || '';

      let blockH = 0;
      // Nazwa projektu (bold)
      blockH +=
        addText(RIGHT_X, rightY + blockH, RIGHT_COL_W, nameLine, BODY_BOLD) +
        1.0;
      // Technologie (muted, jedna linia jeśli się zmieści)
      if (tech)
        blockH +=
          addText(RIGHT_X, rightY + blockH, RIGHT_COL_W, tech, BODY_MUTED) +
          0.8;
      // URL (muted, pod technologiami)
      if (url)
        blockH +=
          addText(RIGHT_X, rightY + blockH, RIGHT_COL_W, url, BODY_MUTED) + 0.8;

      // Osiągnięcia jako bullet-list
      const pBullets = (p?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean);
      if (pBullets.length)
        blockH += addBullets(
          RIGHT_X,
          rightY + blockH,
          RIGHT_COL_W,
          pBullets,
          BODY_STYLE
        );

      rightY += blockH + GAP_BLOCK + 1.5;
    }
    rightY += GAP_SECTION;
  }

  // Lewa: Kluczowe umiejętności
  if (skills.length) {
    leftY +=
      addSectionHeader(LEFT_X, leftY, LEFT_COL_W, 'Kluczowe umiejętności') +
      GAP_BLOCK;
    leftY +=
      addBullets(LEFT_X, leftY, LEFT_COL_W, skills, BODY_STYLE) + GAP_SECTION;
  }

  // Lewa: Edukacja
  if (educations.length) {
    leftY +=
      addSectionHeader(LEFT_X, leftY, LEFT_COL_W, 'Edukacja') + GAP_BLOCK;

    for (const ed of educations) {
      const l1 = [ed?.degree, ed?.institution].filter(Boolean).join(' – ');
      const l2 = ed?.specialization || '';
      const l3 = ed?.period || '';

      let blockH = 0;
      if (l1)
        blockH +=
          addText(LEFT_X, leftY + blockH, LEFT_COL_W, l1, BODY_BOLD) + 1.0;
      if (l2)
        blockH +=
          addText(LEFT_X, leftY + blockH, LEFT_COL_W, l2, BODY_STYLE) + 0.8;
      if (l3)
        blockH += addText(LEFT_X, leftY + blockH, LEFT_COL_W, l3, BODY_MUTED);
      leftY += blockH + GAP_BLOCK + 1.5;
    }
    leftY += GAP_SECTION;
  }

  // Lewa: Języki
  if (languages.length) {
    leftY += addSectionHeader(LEFT_X, leftY, LEFT_COL_W, 'Języki') + GAP_BLOCK;
    const langLines = languages
      .map((l) => `${l?.language || ''}${l?.level ? ` – ${l.level}` : ''}`)
      .filter(Boolean);
    leftY +=
      addBullets(LEFT_X, leftY, LEFT_COL_W, langLines, BODY_STYLE) +
      GAP_SECTION;
  }

  // Lewa: Certyfikaty
  if (certificates.length) {
    leftY +=
      addSectionHeader(LEFT_X, leftY, LEFT_COL_W, 'Certyfikaty') + GAP_BLOCK;
    const certLines = certificates.map((c) => {
      const line = [c.name, c.issuer].filter(Boolean).join(' – ');
      return `${line}${c.date ? ` (${c.date})` : ''}`;
    });
    leftY +=
      addBullets(LEFT_X, leftY, LEFT_COL_W, certLines, BODY_STYLE) +
      GAP_SECTION;
  }

  // RODO – przyklej jak najniżej, nie wychodząc poza margines
  if (rodo) {
    const label = 'Klauzula RODO';
    const labelH = measureTextHeightMm(label, RIGHT_COL_W, SECTION_HDR_STYLE);
    const rodoStyle = {
      ...BODY_STYLE,
      fontSize: 8.5,
      lineHeight: 1.35,
      color: '#334155',
    };
    const rodoH = measureTextHeightMm(rodo, RIGHT_COL_W, rodoStyle);

    const total = labelH + 1.2 + 0.9 + 2 + rodoH;
    const yTop = Math.max(
      Math.max(leftY, rightY) + GAP_SECTION,
      PAGE_H - MARGIN - total
    );

    addText(RIGHT_X, yTop, RIGHT_COL_W, label, SECTION_HDR_STYLE);
    addRule(RIGHT_X, yTop + labelH + 1.2, RIGHT_COL_W, 0.9, COLOR_RULE);
    addText(
      RIGHT_X,
      yTop + labelH + 1.2 + 0.9 + 2,
      RIGHT_COL_W,
      rodo,
      rodoStyle
    );
  }

  // --- Finalizacja ---
  doc.nodes = nodes;
  doc.meta = { data: api, template: 'GreenBlackATSNodes' };
  return doc;
}

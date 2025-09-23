// templates/WhiteMinimalistCompactNodes.js
// Jedna strona A4, ciaśniejszy layout:
// - Nagłówek (opcjonalny avatar) + wiersz kontaktu
// - Doświadczenie (priorytet)
// - Projekty
// - POZIOMY pasek na samym dole: Edukacja (lewa połowa) + Umiejętności (prawa połowa)
// Zgodne z Twoim JSON-em (links: [{type,url}], portfolio itd.)

import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildWhiteMinimalistCompactCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // ----- Wymiary -----
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 8; // z 12mm na 10mm
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  // Wiersze 2-kolumnowe (metryka po lewej, opis po prawej)
  const ROW_GAP = 1; // z 5mm na 4mm
  const META_W = Math.floor(CONTENT_W * 0.33); // ciaśniej niż wcześniej
  const DESC_W = CONTENT_W - META_W - ROW_GAP;

  // ----- Kolory / style (minimal) -----
  const COLOR_NAME = '#8b5e3c';
  const COLOR_TEXT = '#0f172a';
  const COLOR_MUTED = '#6b7280';
  const COLOR_RULE = '#e5e7eb';

  // Delikatne ciaśniejsze fonty
  const NAME_STYLE = {
    fontSize: 24, // z 26 na 24
    fontWeight: 800,
    color: COLOR_NAME,
    lineHeight: 1.1,
  };
  const TITLE_STYLE = { fontSize: 10.5, fontWeight: 700, color: COLOR_TEXT };
  const CONTACT_STYLE = {
    fontSize: 9,
    fontWeight: 500,
    color: COLOR_MUTED,
    lineHeight: 1.3,
  };

  const SECTION_STYLE = { fontSize: 11, fontWeight: 800, color: COLOR_MUTED };
  const BODY = {
    fontSize: 9, // z 9.5 na 9
    fontWeight: 400,
    color: COLOR_TEXT,
    lineHeight: 1.35, // z 1.4 na 1.35
  };
  const BODY_MUTED = { ...BODY, color: COLOR_MUTED };
  const BODY_BOLD = { ...BODY, fontWeight: 700 };

  // ----- Odstępy (ciaśniej) -----
  const GAP_HEADER = 4; // z 4.5mm na 4mm
  const GAP_SECTION = 2; // z 7.5mm na 6mm
  const GAP_BETWEEN_ROWS = 3.5; // z 4.5mm na 3.5mm

  // ----- Helpery -----
  const measure = (text, w, style = BODY) =>
    Math.max(5.5, measureTextHeightMm(text || '', w, style));

  const addText = (x, y, w, text, style = BODY) => {
    const t = text || '';
    const h = measure(t, w, style);
    nodes.push(
      createTextNode({ frame: { x, y, w, h }, text: t, textStyle: style })
    );
    return h;
  };

  const addRule = (x, y, w, h = 0.6) => {
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: {
          fill: { color: COLOR_RULE, opacity: 1 },
          stroke: null,
          cornerRadius: 0.3,
        },
      })
    );
    return h;
  };

  const addSectionHeader = (x, y, title) => {
    const titleW = Math.min(58, CONTENT_W * 0.34);
    const h = addText(x, y, titleW, title, SECTION_STYLE);
    const lineX = x + titleW + 3;
    const lineW = CONTENT_W - titleW - 3;
    addRule(lineX, y + h / 2 + 0.6, lineW, 0.6);
    return Math.max(h, 5.5) + 2.5;
  };

  const bulletsText = (arr) => arr.map((s) => `• ${s}`).join('\n');

  // ----- Normalizacja danych -----
  const pd = api?.personalData || {};
  const name = pd?.name || 'Imię i nazwisko';
  const headline = api?.headline || '';

  const phone = pd?.phoneNumber
    ? pd.phoneNumber.startsWith('+')
      ? pd.phoneNumber
      : `+48 ${pd.phoneNumber}`
    : '';
  const email = pd?.email || '';
  const city = pd?.city || '';

  const linksRaw = Array.isArray(pd?.links) ? pd.links : [];
  const urlByType = (t) =>
    linksRaw.find((l) => (l?.type || '').toLowerCase() === t)?.url || '';
  const linkedIn = urlByType('linkedin') || urlByType('link') || '';
  const github = urlByType('github') || '';
  const linksFlat = linksRaw
    .map((l) => (typeof l === 'string' ? l : l?.url))
    .filter(Boolean);

  const experiences = Array.isArray(api?.experience) ? api.experience : [];
  const portfolio = Array.isArray(api?.portfolio) ? api.portfolio : [];
  const educations = Array.isArray(api?.educations) ? api.educations : [];
  const skills = Array.isArray(api?.skills)
    ? api.skills.flatMap((cat) =>
        (cat?.items || []).map((i) => i?.name).filter(Boolean)
      )
    : [];

  // ----- Pasek dolny (Edukacja + Umiejętności) – najpierw policz wysokość, żeby wiedzieć ile miejsca zostało na górę -----
  // Edukacja: 1–2 wpisy, skompresowane do linii „stopień — uczelnia (okres)”
  const EDU_MAX = 2;
  const eduLines = educations
    .slice(0, EDU_MAX)
    .map((ed) => {
      const a = [ed?.degree, ed?.institution].filter(Boolean).join(' — ');
      const b = ed?.period ? ` (${ed.period})` : '';
      return `${a}${b}`.trim();
    })
    .filter(Boolean);
  const eduText = bulletsText(eduLines);

  // Umiejętności: jedna zawijana linia z kropkami
  const skillsLine = skills.join(' • ');
  const BAR_INNER_GAP = 6;
  const BAR_LEFT_W = Math.floor((CONTENT_W - BAR_INNER_GAP) / 2);
  const BAR_RIGHT_W = CONTENT_W - BAR_INNER_GAP - BAR_LEFT_W;

  const BAR_LABEL_STYLE = SECTION_STYLE;
  const BAR_TEXT_STYLE = {
    ...BODY,
    fontSize: 9,
    lineHeight: 1.3,
    color: COLOR_TEXT,
  };

  const barEduLabelH = eduLines.length
    ? measure('Edukacja', BAR_LEFT_W, BAR_LABEL_STYLE)
    : 0;
  const barEduBodyH = eduLines.length
    ? measure(eduText, BAR_LEFT_W, BAR_TEXT_STYLE)
    : 0;

  const barSkillLabelH = skills.length
    ? measure('Umiejętności', BAR_RIGHT_W, BAR_LABEL_STYLE)
    : 0;
  const barSkillBodyH = skills.length
    ? measure(skillsLine, BAR_RIGHT_W, BAR_TEXT_STYLE)
    : 0;

  const barBlockH = Math.max(
    barEduLabelH + (barEduLabelH ? 1.5 : 0) + barEduBodyH,
    barSkillLabelH + (barSkillLabelH ? 1.5 : 0) + barSkillBodyH,
    0
  );

  const barTopRuleH = 0.6;
  const barPaddingTop = 3; // trochę oddechu pod linią
  const barTotalH = barBlockH ? barTopRuleH + barPaddingTop + barBlockH : 0;

  const BAR_TOP_Y = PAGE_H - MARGIN - barTotalH;

  // ----- Header -----
  let y = MARGIN;

  // Avatar (opcjonalnie)
  const AV_W = 28;
  const AV_GAP = 7;
  let nameX = MARGIN;
  if (pd?.images) {
    nodes.push(
      createImageNode({
        frame: { x: MARGIN, y, w: AV_W, h: AV_W },
        src: pd.images,
        style: { cornerRadius: 4 },
      })
    );
    nameX = MARGIN + AV_W + AV_GAP;
  }

  // Imię + stanowisko (ciaśniej)
  y += addText(nameX, y, CONTENT_W - (nameX - MARGIN), name, NAME_STYLE) + 1.2;
  if (api?.headline)
    y +=
      addText(nameX, y, CONTENT_W - (nameX - MARGIN), headline, TITLE_STYLE) +
      GAP_HEADER;

  // wiersz kontaktu
  const contactBits = [
    email && `${email}`,
    phone && `${phone}`,
    city && `${city}`,
    linkedIn && `${linkedIn}`,
    github && `${github}`,
    !linkedIn && !github && linksFlat.length ? linksFlat[0] : '',
  ].filter(Boolean);
  if (contactBits.length) {
    y +=
      addText(MARGIN, y, CONTENT_W, contactBits.join('  |  '), CONTACT_STYLE) +
      (GAP_SECTION - 2);
  }

  // maksymalna wysokość na treść nad paskiem
  const yStop = BAR_TOP_Y ? BAR_TOP_Y - 2 : PAGE_H - MARGIN;

  // ----- Doświadczenie (pierwsze) -----
  if (experiences.length) {
    const hSec = addSectionHeader(MARGIN, y, 'Doświadczenie zawodowe');
    let nextY = y + hSec;

    for (const exp of experiences) {
      const leftTop = nextY;
      let lh = 0;
      const roleCompany = [exp?.title, exp?.company]
        .filter(Boolean)
        .join(' — ');
      if (roleCompany)
        lh +=
          addText(MARGIN, leftTop + lh, META_W, roleCompany, BODY_BOLD) + 0.8;
      const meta = [exp?.period || '', exp?.location || '']
        .filter(Boolean)
        .join('  |  ');
      if (meta) lh += addText(MARGIN, leftTop + lh, META_W, meta, BODY_MUTED);

      const rightTop = nextY;
      let rh = 0;
      if (exp?.jobDescription)
        rh +=
          addText(
            MARGIN + META_W + ROW_GAP,
            rightTop + rh,
            DESC_W,
            exp.jobDescription,
            BODY
          ) + 0.8;
      const bullets = (exp?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean);
      if (bullets.length)
        rh += addText(
          MARGIN + META_W + ROW_GAP,
          rightTop + rh,
          DESC_W,
          bulletsText(bullets),
          BODY
        );

      const rowH = Math.max(lh, rh, 7);
      nextY += rowH + GAP_BETWEEN_ROWS;
      y = nextY;
    }
    y += GAP_SECTION;
  }

  // ----- Projekty (po doświadczeniu) -----
  if (portfolio.length && y < yStop - 6) {
    const hSec = addSectionHeader(MARGIN, y, 'Projekty');
    let nextY = y + hSec;

    for (const p of portfolio) {
      const leftTop = nextY;
      let lh = addText(
        MARGIN,
        leftTop,
        META_W,
        p?.name || 'Projekt',
        BODY_BOLD
      );

      const rightTop = nextY;
      let rh = 0;
      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      if (tech)
        rh +=
          addText(
            MARGIN + META_W + ROW_GAP,
            rightTop + rh,
            DESC_W,
            tech,
            BODY_MUTED
          ) + 0.6;
      const url = p?.url || '';
      if (url)
        rh +=
          addText(
            MARGIN + META_W + ROW_GAP,
            rightTop + rh,
            DESC_W,
            url,
            BODY_MUTED
          ) + 0.6;
      const pBullets = (p?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean);
      if (pBullets.length)
        rh += addText(
          MARGIN + META_W + ROW_GAP,
          rightTop + rh,
          DESC_W,
          bulletsText(pBullets),
          BODY
        );

      const rowH = Math.max(lh, rh, 6.5);
      nextY += rowH + GAP_BETWEEN_ROWS;
      y = nextY;
    }
  }

  // ----- Pasek dolny: separator + Edukacja (lewa) + Umiejętności (prawa) -----
  if (barTotalH > 0) {
    // linia oddzielająca pasek
    addRule(MARGIN, BAR_TOP_Y, CONTENT_W, 0.6);

    let by = BAR_TOP_Y + 3;

    // Edukacja
    if (eduLines.length) {
      const lh = addText(MARGIN, by, BAR_LEFT_W, 'Edukacja', BAR_LABEL_STYLE);
      by += lh + 1.2;
      addText(MARGIN, by, BAR_LEFT_W, eduText, BAR_TEXT_STYLE);
    }

    // Umiejętności
    let by2 = BAR_TOP_Y + 3;
    if (skills.length) {
      const lh2 = addText(
        MARGIN + BAR_LEFT_W + BAR_INNER_GAP,
        by2,
        BAR_RIGHT_W,
        'Umiejętności',
        BAR_LABEL_STYLE
      );
      by2 += lh2 + 1.2;
      addText(
        MARGIN + BAR_LEFT_W + BAR_INNER_GAP,
        by2,
        BAR_RIGHT_W,
        skillsLine,
        BAR_TEXT_STYLE
      );
    }
  }

  // ----- Finalizacja -----
  doc.nodes = nodes;
  doc.meta = { data: api, template: 'WhiteMinimalistCompact' };
  return doc;
}

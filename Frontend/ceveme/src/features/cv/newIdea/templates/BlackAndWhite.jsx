import { emptyDocument, createTextNode, createShapeNode } from '../core/model';
import { A4 } from '../core/mm';
import { measureTextHeightMm } from '../services/typeset';

export function buildBlackAndWhiteCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  // --- Wymiary i Układ ---
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 6;
  const CONTENT_W = PAGE_W - 2 * MARGIN;

  // Układ dwukolumnowy
  const LEFT_COL_W = CONTENT_W * 0.33;
  const RIGHT_COL_W = CONTENT_W * 0.64;
  const COL_GAP = CONTENT_W * 0.03;
  const RIGHT_COL_X = MARGIN + LEFT_COL_W + COL_GAP;

  // --- Kolory i Style ---
  const COLOR_PRIMARY = '#2d3748'; // Ciemnoszary/Niebieski
  const COLOR_BODY = '#4a5568'; // Szary tekst
  const COLOR_LIGHT = '#a0aec0'; // Jasnoszary
  const COLOR_LINE = '#e2e8f0'; // Kolor linii

  const NAME_STYLE = {
    fontSize: 32,
    fontWeight: 700,
    color: COLOR_PRIMARY,
  };
  const TITLE_STYLE = {
    fontSize: 11,
    fontWeight: 400,
    color: COLOR_BODY,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
    color: COLOR_PRIMARY,
  };
  const ITALIC_STYLE = { ...BODY_STYLE, fontStyle: 'italic' };
  const DATE_STYLE = { ...BODY_STYLE, color: COLOR_LIGHT, fontWeight: 700 };
  const CONTACT_STYLE = { ...BODY_STYLE, lineHeight: 1.55 };

  // --- Odstępy (ciaśniej) ---
  const GAP_SECTION = 4; // było 10
  const GAP_BLOCK = 3; // było 6
  const GAP_ITEM = 2;

  // --- Funkcje Pomocnicze ---
  const addTextNode = (x, y, w, text, style = BODY_STYLE) => {
    const t = text || '';
    const h = measureTextHeightMm(t, w, style);
    nodes.push(
      createTextNode({ frame: { x, y, w, h }, text: t, textStyle: style })
    );
    return h;
  };

  // pozioma linia (albo pionowa, gdy dajesz małe w i duże thickness = h)
  const addLine = (x, y, w, thickness = 0.25, color = COLOR_LINE) => {
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h: thickness },
        style: { fill: { color, opacity: 1 }, stroke: null },
      })
    );
  };

  const addTimelineCircle = (y) => {
    const R = 1.5; // Promień okręgu
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

  // --- Budowa CV ---
  // delikatnie „wyżej” (było +30), ale nadal poniżej linii nagłówka (która jest na MARGIN+28)
  let leftY = MARGIN + 24;
  let rightY = MARGIN + 23;

  // 1. Nagłówek (Imię i Tytuł)
  const name = api?.personalData?.name || 'AHMDD SAAH';
  const title = api?.headline || 'MARKETING MANAGER';
  const headerH = addTextNode(MARGIN, MARGIN, CONTENT_W, name, NAME_STYLE);
  addTextNode(MARGIN, MARGIN + 15 + headerH, CONTENT_W, title, TITLE_STYLE);
  addLine(MARGIN, MARGIN + 16, CONTENT_W, 0.5, COLOR_PRIMARY);

  // 2. Kolumna Lewa
  // 2.1 Kontakt
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Contact', LEFT_HEADER_STYLE) + 1;
  addLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM * 2;

  // link z JSON-a może być obiektem {type,url} – wyciągnij url
  const rawLink0 = api?.personalData?.links?.[0];
  const link0 =
    typeof rawLink0 === 'string'
      ? rawLink0
      : rawLink0?.url || 'www.example.com';

  const contactText = [
    `📞 ${api?.personalData?.phoneNumber || '+123-4234-7894'}`,
    `✉️ ${api?.personalData?.email || 'hello@ahmsaah.com'}`,
    `📍 ${api?.personalData?.city || '123 MySt, Any City'}`,
    `🌐 ${link0}`,
  ].join('\n');
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, contactText, CONTACT_STYLE) +
    GAP_SECTION;

  // 2.2 Umiejętności
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Skills', LEFT_HEADER_STYLE) + 1;
  addLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM * 2;
  const skills =
    api?.skills?.[0]?.items?.map((s) => `• ${s.name || s}`).join('\n') || '';
  if (skills) {
    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, skills, BODY_STYLE) + GAP_SECTION;
  }

  // 2.3 Języki
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Languages', LEFT_HEADER_STYLE) + 1;
  addLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM * 2;
  const languages =
    api?.languages?.map((l) => `• ${l.language} (${l.level})`).join('\n') || '';
  if (languages) {
    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, languages, BODY_STYLE) +
      GAP_SECTION;
  }

  // 2.4 Edukacja (przeniesiona do lewej kolumny)
  leftY +=
    addTextNode(MARGIN, leftY, LEFT_COL_W, 'Education', LEFT_HEADER_STYLE) + 1;
  addLine(MARGIN, leftY, LEFT_COL_W);
  leftY += GAP_ITEM * 2;

  const educations = api?.educations || [];
  for (const edu of educations) {
    leftY += addTextNode(
      MARGIN,
      leftY,
      LEFT_COL_W,
      edu.degree,
      BOLD_BODY_STYLE
    );
    addTextNode(MARGIN, leftY, LEFT_COL_W, edu.institution, ITALIC_STYLE);
    addTextNode(MARGIN, leftY - 3, LEFT_COL_W, edu.period || '', {
      ...DATE_STYLE,
      textAlign: 'right',
    });
    leftY += GAP_BLOCK;
  }
  leftY += GAP_SECTION;

  // 2.5 Referencje (opcjonalne)
  if (api?.references?.[0]) {
    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, 'Reference', LEFT_HEADER_STYLE) +
      1;
    addLine(MARGIN, leftY, LEFT_COL_W);
    leftY += GAP_ITEM * 2;
    const r = api.references[0];
    const refText = `${r.name || ''}\n${r.title || ''}\nPhone: ${
      r.phone || ''
    }\nEmail: ${r.email || ''}`;
    leftY +=
      addTextNode(MARGIN, leftY, LEFT_COL_W, refText.trim(), BODY_STYLE) +
      GAP_SECTION;
  }

  // 3. Główna linia osi czasu
  const timelineX = RIGHT_COL_X - COL_GAP / 2 - 0.5;
  addLine(timelineX, rightY, 1, 240, COLOR_LINE);

  // 4. Kolumna Prawa
  // 4.1 Profil (teraz bez sekcji edukacji)
  addTimelineCircle(rightY + 5);
  rightY +=
    addTextNode(
      RIGHT_COL_X,
      rightY,
      RIGHT_COL_W,
      'Profile',
      RIGHT_HEADER_STYLE
    ) + GAP_BLOCK;
  const summary = api?.summary || 'Short professional summary…';
  rightY +=
    addTextNode(RIGHT_COL_X, rightY, RIGHT_COL_W, summary, BODY_STYLE) +
    GAP_SECTION;

  // 4.2 Doświadczenie (przeniesione wyżej, bo usunęliśmy edukację)
  addTimelineCircle(rightY + 5); // kropka rowna z Experience
  rightY +=
    addTextNode(
      RIGHT_COL_X,
      rightY,
      RIGHT_COL_W,
      'Work Experience',
      RIGHT_HEADER_STYLE
    ) + GAP_BLOCK;

  const experiences = api?.experience || [];
  for (const exp of experiences) {
    addTimelineCircle(rightY + 3); //co to robi?
    rightY += addTextNode(
      RIGHT_COL_X,
      rightY, //period ulozenie
      RIGHT_COL_W,
      exp.company,
      BOLD_BODY_STYLE
    );
    addTextNode(RIGHT_COL_X, rightY, RIGHT_COL_W, `${exp.title}`, ITALIC_STYLE);
    addTextNode(RIGHT_COL_X, rightY - 4, RIGHT_COL_W, exp.period || '', {
      ...DATE_STYLE,
      textAlign: 'right',
    });
    rightY += 6; // dystans od period do opisu

    if (exp.achievements?.length) {
      const achievementsText = exp.achievements
        .map((a) => `• ${a.description}`)
        .join('\n');
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        achievementsText,
        BODY_STYLE
      );
    } else if (exp.jobDescription) {
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        exp.jobDescription,
        BODY_STYLE
      );
    }
    rightY += GAP_BLOCK;
  }
  rightY += GAP_SECTION;

  // 4.3 Projekty (NOWA SEKCJA – na osi czasu, przed edukacją)
  const projects = Array.isArray(api?.portfolio) ? api.portfolio : [];
  if (projects.length) {
    addTimelineCircle(rightY + 5);
    rightY +=
      addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        'Projects',
        RIGHT_HEADER_STYLE
      ) + GAP_BLOCK;

    for (const p of projects) {
      addTimelineCircle(rightY + 3);
      // nazwa projektu (bold)
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        p?.name || 'Project',
        BOLD_BODY_STYLE
      );

      // technologie (italic, jedna linia lub zawinięta)
      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(' • ');
      if (tech) {
        rightY += addTextNode(
          RIGHT_COL_X,
          rightY,
          RIGHT_COL_W,
          tech,
          ITALIC_STYLE
        );
      }

      // URL (jasny kolor)
      if (p?.url) {
        rightY += addTextNode(
          RIGHT_COL_X,
          rightY,
          RIGHT_COL_W,
          p.url,
          DATE_STYLE
        );
      }

      // krótkie osiągnięcia (bullets)
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
    }
    rightY += GAP_SECTION;
  }

  // --- Finalizacja ---
  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

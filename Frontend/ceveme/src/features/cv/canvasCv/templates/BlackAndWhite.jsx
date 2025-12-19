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

  // --- Pomocnicze rysowanie (z obsługą linków) ---
  const addTextNode = (x, y, w, text, style = BODY_STYLE, opts = {}) => {
    const t = text || '';
    const h = Math.max(3.8, measureTextHeightMm(t, w, style));
    const node = createTextNode({
      frame: { x, y, w, h },
      text: t,
      textStyle: style,
    });
    if (opts.link) node.link = opts.link; // << klikany węzeł
    nodes.push(node);
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

  // --- Normalizacja linków projektów (portfolio) ---
  const normalizeProjectLinks = (p = {}) => {
    const out = [];
    const seen = new Set();
    const push = (url, label) => {
      if (!url) return;
      const u = String(url);
      if (seen.has(u)) return;
      seen.add(u);
      let finalLabel = label;
      if (!finalLabel) {
        try {
          finalLabel = new URL(u).hostname.replace(/^www\./, '');
        } catch {
          finalLabel = u;
        }
      }
      out.push({ label: finalLabel, url: u });
    };

    // pojedyncze, najczęściej spotykane pola
    push(p.url, null);
    push(p.homepage, 'Strona');
    push(p.demo, 'Demo');
    push(p.live, 'Live');
    push(p.repository || p.repo || p.github, 'GitHub');
    push(p.docs || p.documentation, 'Dokumentacja');

    // tablica links: string lub obiekt {url|href, label|name|type}
    if (Array.isArray(p.links)) {
      for (const l of p.links) {
        if (!l) continue;
        const url = typeof l === 'string' ? l : l.url || l.href || '';
        if (!url) continue;
        const label =
          typeof l === 'string' ? '' : l.label || l.name || l.type || '';
        push(url, label || null);
      }
    }

    return out;
  };

  // --- Nagłówek ---
  const name = api?.personalData?.name || 'Imię Nazwisko';
  const title = api?.headline || '';
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

  // — linki z danych
  const rawLinks = Array.isArray(api?.personalData?.links)
    ? api.personalData.links
    : [];
  const normalizedLinks = rawLinks
    .map((l) => {
      if (!l) return null;
      const url = typeof l === 'string' ? l : l.url || l.href || '';
      if (!url) return null;
      const typeRaw = (typeof l === 'string' ? '' : l.type || l.name || '')
        .toString()
        .toLowerCase();

      const label =
        typeRaw ||
        (url.includes('linkedin.com') && 'LinkedIn') ||
        (url.includes('github.com') && 'GitHub') ||
        (url.includes('gitlab.com') && 'GitLab') ||
        (url.includes('instagram.com') && 'Instagram') ||
        (url.includes('facebook.com') && 'Facebook') ||
        'Strona www';

      const icon =
        ICON_MAP[typeRaw] ||
        (label === 'LinkedIn' && ICON_MAP.linkedin) ||
        (label === 'GitHub' && ICON_MAP.github) ||
        (label === 'GitLab' && ICON_MAP.gitlab) ||
        (label === 'Strona www' && ICON_MAP.website) ||
        '🔗';

      return { text: `${icon} ${label}`, link: url };
    })
    .filter(Boolean);

  // — telefon / e-mail / miasto (+ klik w tel/mail)
  const contactItems = [];
  if (api?.personalData?.phoneNumber) {
    const tel = String(api.personalData.phoneNumber);
    contactItems.push({
      text: `☎ ${tel}`,
      link: `tel:${tel.replace(/\s+/g, '')}`,
    });
  }
  if (api?.personalData?.email) {
    const mail = String(api.personalData.email);
    contactItems.push({ text: `✉ ${mail}`, link: `mailto:${mail}` }); // Uwaga: bez emoji-variant
  }
  if (api?.personalData?.city) {
    contactItems.push({ text: `📍 ${api.personalData.city}` }); // bez linku
  }
  // dołóż profile (LinkedIn/GitHub/...)
  contactItems.push(...normalizedLinks);

  // rysuj pojedyncze klikalne wiersze
  if (contactItems.length) {
    for (const item of contactItems) {
      leftY +=
        addTextNode(MARGIN, leftY, LEFT_COL_W, item.text, CONTACT_STYLE, {
          link: item.link,
        }) + 1.1;
    }
    leftY += GAP_SECTION;
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
      const meta = [c?.issuer, c?.data || c?.date].filter(Boolean).join(' • ');
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

    // >>> ZMIANA 1: zawsze pokaż opis doświadczenia (obsługa pól: jobDescription ORAZ description)
    const descParts = [];
    if (exp?.jobDescription) descParts.push(String(exp.jobDescription));
    if (exp?.description && exp.description !== exp.jobDescription)
      descParts.push(String(exp.description));
    if (descParts.length) {
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        descParts.join('\n\n'),
        BODY_STYLE
      );
    }

    // Bullets (osiągnięcia) – po opisach
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

      // Nazwa projektu klikalna, jeśli jest GŁÓWNY URL
      rightY += addTextNode(
        RIGHT_COL_X,
        rightY,
        RIGHT_COL_W,
        p?.name || 'Projekt',
        BOLD_BODY_STYLE,
        p?.url ? { link: p.url } : {}
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

      // >>> ZMIANA 2: dodatkowe linki z API (p.url, p.homepage, p.demo, p.live, p.repo/repository/github, p.docs, p.links[])
      const extraLinks = normalizeProjectLinks(p);
      if (extraLinks.length) {
        for (const ln of extraLinks) {
          rightY += addTextNode(
            RIGHT_COL_X,
            rightY,
            RIGHT_COL_W,
            ln.label,
            DATE_STYLE,
            { link: ln.url }
          );
        }
      }

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

  // Klauzula RODO przy dole prawej kolumny (pozostawiamy jak było)
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

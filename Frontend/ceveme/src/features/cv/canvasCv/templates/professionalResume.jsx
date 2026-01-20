// buildPixelPerfectAttachmentCV.js
// Replika layoutu z załącznika — lewy panel (Kontakt + Umiejętności + Wykształcenie + Języki),
// prawa kolumna (nagłówek + Podsumowanie + Doświadczenie + Projekty + RODO na dole).

import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from "../core/model";
import { A4 } from "../core/mm";
import { measureTextHeightMm } from "../services/typeset";

export function buildPixelPerfectAttachmentCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  /* ===== STRONA / SIATKA ===== */
  const PAGE = { W: 210, H: 297, M: 12 };

  // ⬅ poszerzony panel lewy + ciaśniejszy padding
  const LEFT_W = 72; // było 62
  const LEFT_X = PAGE.M;
  const GUTTER = 8; //odstep pomiedzy 2 kolumnami
  const RIGHT_X = LEFT_X + LEFT_W + GUTTER;
  const RIGHT_W = PAGE.W - RIGHT_X - PAGE.M;

  // podniesiony układ
  const TOP_Y = 5;
  const PANEL_TOP = 5;
  const PANEL_BOT = PAGE.H - PAGE.M;

  // ciaśniejszy padding wewnętrzny → szerszy tekst
  const INNER = { X: 6, Y: 7 }; // było 9/8

  /* ===== KOLORY / TYPO ===== */
  const COLORS = {
    page: "#FFFFFF",
    leftPanel: "#EEEEEE",
    leftPill: "#2E2E2E",
    textDark: "#222222",
    text: "#333132",
    muted: "#727272",
    hr: "#CFCFCF",
    iconDark: "#2E2E2E",
    iconFg: "#FFFFFF",
  };

  const FONTS = {
    lastName: {
      fontFamily: "Lora, Times, serif",
      fontSize: 44,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.08,
    },
    firstName: {
      fontFamily: "Lora, Times, serif",
      fontSize: 30,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.08,
    },
    subtitle: {
      fontFamily: "Lora, Times, serif",
      fontSize: 12.8,
      fontWeight: 400,
      fontStyle: "italic",
      color: COLORS.muted,
      lineHeight: 1.25,
    },
    summary: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 9.2,
      fontWeight: 400,
      color: COLORS.text,
      lineHeight: 1.45,
    },
    section: {
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: 11.4,
      fontWeight: 800,
      color: COLORS.textDark,
      lineHeight: 1.2,
      letterSpacing: 0.2,
      textTransform: "uppercase",
    },
    role: {
      fontFamily: "Poppins, Arial, sans-serif",
      fontSize: 10.5,
      fontWeight: 700,
      color: COLORS.textDark,
      lineHeight: 1.24,
    },
    meta: {
      fontFamily: "Poppins, Arial, sans-serif",
      fontSize: 9.2,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.22,
    },
    metaRight: {
      fontFamily: "Poppins, Arial, sans-serif",
      fontSize: 9.2,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.22,
      textAlign: "right",
    },
    body: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 9.0,
      fontWeight: 400,
      color: COLORS.text,
      lineHeight: 1.42,
    },
    bullets: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 9.0,
      fontWeight: 400,
      color: COLORS.text,
      lineHeight: 1.4,
    },
    leftPillLabel: {
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: 9.6,
      fontWeight: 800,
      color: "#FFFFFF",
      lineHeight: 1.2,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      textAlign: "center",
    },
    leftItem: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 9.0,
      fontWeight: 400,
      color: COLORS.textDark,
      lineHeight: 1.32,
    },
    leftMuted: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 8.6,
      fontWeight: 400,
      color: COLORS.muted,
      lineHeight: 1.24,
    },
    gdpr: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 8.2,
      fontWeight: 400,
      color: COLORS.muted,
      lineHeight: 1.34,
      textAlign: "justify",
    },
  };

  /* ===== HELPERY ===== */
  const rect = (x, y, w, h, color, cornerRadius = 0) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color }, stroke: null, cornerRadius },
      }),
    );

  const line = (x, y, w, h = 0.6) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color: COLORS.hr }, stroke: null },
      }),
    );

  const text = (x, y, w, s, style, opts = {}) => {
    const str = String(s ?? "");
    if (!str.trim()) return 0;
    const h = Math.max(3.2, measureTextHeightMm(str, w, style));
    const node = createTextNode({
      frame: { x, y, w, h },
      text: str,
      textStyle: style,
    });
    if (opts.link) node.link = opts.link;
    nodes.push(node);
    return h;
  };

  const bulletList = (x, y, w, arr, style = FONTS.bullets) => {
    const items = (arr || []).filter(Boolean);
    if (!items.length) return 0;
    return text(x, y, w, items.map((t) => `• ${t}`).join("\n"), style);
  };

  // --- PAGE BREAK HELPER ---
  // Śledź które strony mają już narysowany lewy panel
  const drawnPages = new Set([0]); // strona 0 jest rysowana na początku

  const checkPageBreak = (currentY, elementHeight, bottomMargin = 35) => {
    const currentPage = Math.floor(currentY / PAGE.H);
    const pageBottom = (currentPage + 1) * PAGE.H - bottomMargin;

    if (currentY + elementHeight > pageBottom) {
      const nextPage = currentPage + 1;
      const nextPageTop = nextPage * PAGE.H + TOP_Y;

      // Narysuj lewy panel na nowej stronie jeśli jeszcze nie narysowany
      if (!drawnPages.has(nextPage)) {
        drawnPages.add(nextPage);
        const panelY = nextPage * PAGE.H + PANEL_TOP;
        rect(
          LEFT_X,
          panelY,
          LEFT_W,
          PAGE.H - PANEL_TOP - PAGE.M,
          COLORS.leftPanel,
          10,
        );
      }

      return nextPageTop;
    }

    return currentY;
  };

  const svgData = (svg) =>
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim());

  const ICONS = {
    phone: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2
           19.8 19.8 0 0 1-8.63-3.07
           19.5 19.5 0 0 1-6-6
           19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3
           a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.61a2 2 0 0 1-.45 2.11L8.09 9.91
           a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45
           c.84.26 1.71.45 2.61.57A2 2 0 0 1 22 16.92z"/>
</svg>`,
    mail: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
  <path d="M3 7l9 6 9-6"/>
</svg>`,
    pin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 5.5-9 12-9 12s-9-6.5-9-12a9 9 0 1 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`,
    link: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 7h3a5 5 0 1 1 0 10h-3"/>
  <path d="M9 17H6a5 5 0 1 1 0-10h3"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,
    globe: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
</svg>`,
    github: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.iconFg}">
  <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.66-.22.66-.48
  0-.24-.01-.87-.02-1.7-2.77.6-3.36-1.34-3.36-1.34-.46-1.15-1.12-1.46-1.12-1.46
  -.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34
  -2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65
  0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.5.34 1.9-1.3 2.75-1.03 2.75-1.03
  .54 1.38.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85
  0 1.33-.01 2.41-.01 2.73 0 .27.18.58.69.48A10 10 0 0 0 22 12C22 6.48 17.52 2 12 2z"/>
</svg>`,
  };

  /* ===== TŁA ===== */
  rect(0, 0, PAGE.W, PAGE.H, COLORS.page);
  rect(LEFT_X, PANEL_TOP, LEFT_W, PANEL_BOT - PANEL_TOP, COLORS.leftPanel, 10);

  /* ===== HEADER PRAWY ===== */
  const pd = api?.personalData || {};
  const fullName = String(pd?.name || "").trim();
  let first = "",
    last = "";
  if (fullName) {
    const parts = fullName.split(/\s+/);
    last = parts.length > 1 ? parts.pop() : "";
    first = parts.join(" ") || last;
  }

  let hy = TOP_Y;
  if (last) hy += text(RIGHT_X, hy, RIGHT_W, last, FONTS.lastName);
  if (first) hy += text(RIGHT_X, hy - 6, RIGHT_W, first, FONTS.firstName);
  const subtitle = (api?.headline || "").trim();
  if (subtitle) hy += text(RIGHT_X, hy - 8, RIGHT_W, subtitle, FONTS.subtitle);

  // Podsumowanie
  let ry = hy;
  if (api?.summary) {
    ry += text(RIGHT_X, ry - 7, RIGHT_W, api.summary, FONTS.summary);
  }

  /* ===== SEKCJE ===== */
  const sectionHeader = (label, x, y, w) => {
    const up = String(label || "").toUpperCase();
    const hh = text(x, y, w, up, FONTS.section);
    line(x, y + hh + 2.4, w, 0.6);
    return hh + 5.2;
  };
  const sectionHeaderSize = (label, w) => {
    const up = String(label || "").toUpperCase();
    const hh = Math.max(3.2, measureTextHeightMm(up, w, FONTS.section));
    return hh + 5.2;
  };

  /* ===== PRAWA: DOŚWIADCZENIE + PROJEKTY ===== */
  const experiences = Array.isArray(api?.experience) ? api.experience : [];
  if (experiences.length) {
    ry = checkPageBreak(ry, 20);
    ry += sectionHeader("Doświadczenie zawodowe", RIGHT_X, ry, RIGHT_W);
    for (const exp of experiences) {
      // Sprawdź czy cały blok doświadczenia zmieści się (większy margines dla bloków)
      ry = checkPageBreak(ry, 40);

      const leftW = RIGHT_W * 0.62;
      const rightW = RIGHT_W - leftW;

      const tH = text(RIGHT_X, ry, leftW, exp?.title || "", FONTS.role);
      text(RIGHT_X + leftW, ry, rightW, exp?.period || "", FONTS.metaRight);
      ry += Math.max(tH, 6.8);

      const second = [exp?.company, exp?.location].filter(Boolean).join(" • ");
      if (second) ry += text(RIGHT_X, ry, RIGHT_W, second, FONTS.meta);

      if (exp?.jobDescription)
        ry += text(RIGHT_X, ry, RIGHT_W, exp.jobDescription, FONTS.body);

      const ach = Array.isArray(exp?.achievements)
        ? exp.achievements
            .map((a) => (typeof a === "string" ? a : a?.description))
            .filter(Boolean)
        : [];
      if (ach.length)
        ry += bulletList(RIGHT_X, ry, RIGHT_W, ach, FONTS.bullets);

      ry += 4;
    }
  }

  const normalizeProjectLinks = (p = {}) => {
    const out = [];
    const push = (url, label) => {
      if (!url) return;
      let lb = label;
      try {
        lb ||= new URL(url).hostname.replace(/^www\./, "");
      } catch {
        lb ||= String(url);
      }
      out.push({ url: String(url), label: lb });
    };
    push(p.url, "");
    push(p.homepage, "Strona");
    push(p.demo, "Demo");
    push(p.repository || p.repo || p.github, "Repozytorium");
    if (Array.isArray(p.links)) {
      for (const l of p.links) {
        const u = typeof l === "string" ? l : l?.url || l?.href || "";
        const lab =
          typeof l === "string" ? "" : l?.label || l?.name || l?.type || "";
        push(u, lab);
      }
    }
    return out;
  };

  const projects = Array.isArray(api?.portfolio) ? api.portfolio : [];
  if (projects.length) {
    ry = checkPageBreak(ry, 20);
    ry += sectionHeader("Projekty", RIGHT_X, ry, RIGHT_W);
    for (const p of projects) {
      // Sprawdź czy cały blok projektu zmieści się (większy margines dla bloków)
      ry = checkPageBreak(ry, 35);

      if (p?.name) ry += text(RIGHT_X, ry, RIGHT_W, p.name, FONTS.role);
      const tech = (p?.technologies || [])
        .map((t) => (typeof t === "string" ? t : t?.name))
        .filter(Boolean)
        .join(" • ");
      if (tech) ry += text(RIGHT_X, ry, RIGHT_W, tech, FONTS.meta);
      if (p?.description)
        ry += text(RIGHT_X, ry, RIGHT_W, p.description, FONTS.body);

      const links = normalizeProjectLinks(p);
      for (const l of links.slice(0, 3)) {
        ry += text(RIGHT_X, ry, RIGHT_W, l.label, FONTS.meta, { link: l.url });
      }

      const ach = (p?.achievements || [])
        .map((a) => (typeof a === "string" ? a : a?.description))
        .filter(Boolean);
      if (ach.length)
        ry += bulletList(RIGHT_X, ry, RIGHT_W, ach, FONTS.bullets);

      ry += 6;
    }
  }

  /* ===== LEWY PANEL ===== */
  const leftPill = (label, y) => {
    const padX = 8;
    const w = LEFT_W - 2 * INNER.X;
    const labelH = Math.max(
      3.2,
      measureTextHeightMm(
        label.toUpperCase(),
        w - padX * 2,
        FONTS.leftPillLabel,
      ),
    );
    const h = Math.max(12.5, labelH + 4);
    rect(LEFT_X + INNER.X, y, w, h, COLORS.leftPill, 6);
    text(
      LEFT_X + INNER.X + padX,
      y + (h - labelH) / 2,
      w - padX * 2,
      label,
      FONTS.leftPillLabel,
    );
    return h + 6.5;
  };

  const contactIconD = 6.4;

  const contactRow = (ly, iconKey, label, link) => {
    if (!label) return { nextY: ly, used: 0 };
    // kółko z ikoną (odrobinę niżej)
    rect(
      LEFT_X + INNER.X + 3,
      ly,
      contactIconD,
      contactIconD,
      COLORS.iconDark,
      contactIconD / 2,
    );
    nodes.push(
      createImageNode({
        frame: {
          x: LEFT_X + INNER.X + 3 + 1.2,
          y: ly + 1.6,
          w: contactIconD - 2.4,
          h: contactIconD - 2.4,
        },
        src: svgData(ICONS[iconKey] || ICONS.link),
        style: { cornerRadius: 0 },
      }),
    );
    const tx = LEFT_X + INNER.X + 3 + contactIconD + 5;
    const tw = LEFT_W - (tx - LEFT_X) - INNER.X; // ⬅ szerzej dzięki większemu LEFT_W i mniejszemu INNER.X
    const h = text(
      tx,
      ly + 0.2,
      tw,
      String(label),
      FONTS.leftItem,
      link ? { link } : {},
    );
    const used = Math.max(contactIconD, h) + 3.8;
    return { nextY: ly + used, used };
  };

  let ly = PANEL_TOP + INNER.Y;

  // KONTAKT
  ly = checkPageBreak(ly, 15);
  ly += leftPill("Kontakt", ly);

  const pdLinks = (raw) => {
    const out = [];
    const arr = Array.isArray(raw) ? raw : [];
    for (const l of arr) {
      const url = typeof l === "string" ? l : l?.url || l?.href || "";
      if (!url) continue;
      let key = "globe";
      let label = "Strona";
      try {
        const u = new URL(url);
        const h = u.hostname.replace(/^www\./, "");
        if (h.includes("github")) {
          key = "github";
          label = "GitHub";
        } else if (h.includes("linkedin")) {
          key = "link";
          label = "LinkedIn";
        } else {
          key = "globe";
          label = h;
        }
      } catch {
        /* empty */
      }
      out.push({ key, label, url });
    }
    return out;
  };

  if (pd?.phoneNumber) {
    const r = contactRow(
      ly,
      "phone",
      pd.phoneNumber,
      `tel:${pd.phoneNumber.replace(/\s+/g, "")}`,
    );
    ly = r.nextY;
  }
  if (pd?.email) {
    const r = contactRow(ly, "mail", pd.email, `mailto:${pd.email}`);
    ly = r.nextY;
  }
  if (pd?.city) {
    const r = contactRow(ly, "pin", pd.city, null);
    ly = r.nextY;
  }
  for (const l of pdLinks(pd?.links)) {
    const r = contactRow(ly, l.key, l.label, l.url);
    ly = r.nextY;
  }

  ly += 2;

  // ⇩ UMIEJĘTNOŚCI (z powrotem widoczne)
  const groups = Array.isArray(api?.skills) ? api.skills : [];
  const pick = (cats) =>
    groups
      .filter((g) =>
        cats.some((c) => (g?.category || "").toLowerCase() === c.toLowerCase()),
      )
      .flatMap((g) =>
        (g.items || [])
          .map((i) => (typeof i === "string" ? i : i?.name))
          .filter(Boolean),
      );

  let skillsAll = [
    ...pick(["technical", "technologies", "tech", "stack"]),
    ...pick(["tools"]),
    ...pick(["soft", "soft skills", "miękkie"]),
  ].filter(Boolean);

  // fallback: zbierz tech z portfolio, jeśli brak grup
  if (!skillsAll.length && Array.isArray(api?.portfolio)) {
    skillsAll = api.portfolio
      .flatMap((p) => p?.technologies || [])
      .map((t) => (typeof t === "string" ? t : t?.name))
      .filter(Boolean);
  }
  // deduplikacja
  skillsAll = Array.from(new Set(skillsAll));

  if (skillsAll.length) {
    ly = checkPageBreak(ly, 15);
    ly += leftPill("Umiejętności", ly);
    // szerzej (mniejsze odejmowanie marginesu)
    ly +=
      bulletList(
        LEFT_X + INNER.X + 3,
        ly,
        LEFT_W - 2 * INNER.X - 4,
        skillsAll,
        FONTS.leftItem,
      ) + 2;
  }

  // WYKSZTAŁCENIE (LEWA)
  const edus = Array.isArray(api?.educations) ? api.educations : [];
  if (edus.length) {
    ly = checkPageBreak(ly, 15);
    ly += leftPill("Wykształcenie", ly);
    for (const e of edus) {
      // Sprawdź czy cała pozycja edukacji zmieści się
      ly = checkPageBreak(ly, 15);

      if (e?.institution)
        ly += text(
          LEFT_X + INNER.X + 3,
          ly,
          LEFT_W - 2 * INNER.X - 4,
          e.institution,
          FONTS.leftItem,
        );
      const sub = [e?.degree, e?.specialization].filter(Boolean).join(" — ");
      if (sub)
        ly += text(
          LEFT_X + INNER.X + 3,
          ly,
          LEFT_W - 2 * INNER.X - 4,
          sub,
          FONTS.leftMuted,
        );
      if (e?.period)
        ly += text(
          LEFT_X + INNER.X + 3,
          ly,
          LEFT_W - 2 * INNER.X - 4,
          e.period,
          FONTS.leftMuted,
        );
      ly += 4;
    }
  }

  // JĘZYKI
  const languages = Array.isArray(api?.languages)
    ? api.languages
        .map((l) => [l?.language, l?.level].filter(Boolean).join(" — "))
        .filter(Boolean)
    : [];
  if (languages.length) {
    ly = checkPageBreak(ly, 15);
    ly += leftPill("Języki", ly);
    ly +=
      bulletList(
        LEFT_X + INNER.X + 3,
        ly,
        LEFT_W - 2 * INNER.X - 4,
        languages,
        FONTS.leftItem,
      ) + 2;
  }

  /* ===== RODO: PRAWA KOLUMNA, DÓŁ STRONY ===== */
  if (api?.gdprClause) {
    const headBlock = sectionHeaderSize("KLAUZULA RODO", RIGHT_W);
    const gdprH = Math.max(
      3.2,
      measureTextHeightMm(api.gdprClause, RIGHT_W, FONTS.gdpr),
    );
    const total = headBlock + gdprH;

    // Sprawdź czy RODO zmieści się na obecnej stronie
    ry = checkPageBreak(ry, total + 15);

    const consumed = sectionHeader("KLAUZULA RODO", RIGHT_X, ry, RIGHT_W);
    text(RIGHT_X, ry + consumed, RIGHT_W, api.gdprClause, FONTS.gdpr);
  }

  /* ===== META ===== */
  doc.nodes = nodes;
  doc.meta = { data: api, template: "PixelPerfectAttachmentCV" };
  return doc;
}

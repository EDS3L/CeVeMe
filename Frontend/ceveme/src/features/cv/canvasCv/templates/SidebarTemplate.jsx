import {
  emptyDocument,
  createTextNode,
  createImageNode,
  createShapeNode,
} from "../core/model";
import { A4 } from "../core/mm";
import { measureTextHeightMm } from "../services/typeset";

export function buildDocFromAI(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 8;
  const HEADER_H = 30;
  const SIDEBAR_W = 58;
  const MAIN_X = SIDEBAR_W + MARGIN;
  const MAIN_W = PAGE_W - MAIN_X - MARGIN;

  const LABEL_STYLE = {
    fontSize: 9,
    fontWeight: 800,
    color: "#0f766e",
    lineHeight: 1.15,
  };
  const BODY_STYLE = {
    fontSize: 8.5,
    fontWeight: 400,
    color: "#0f172a",
    lineHeight: 1.25,
  };
  const SOFT_STYLE = {
    fontSize: 8.5,
    fontWeight: 400,
    color: "#0f172a",
    lineHeight: 1.2,
  };

  // ikony do linków
  const ICON_MAP = {
    linkedin: "🔗",
    github: "🐙",
    gitlab: "🦊",
    facebook: "📘",
    instagram: "📷",
    twitter: "🐦",
    website: "🌐",
    homepage: "🌐",
  };

  const GAP_SECTION = 0.6;
  const GAP_BLOCK = 0.6;

  const checkPageBreak = (currentY, elementHeight, bottomMargin = 20) => {
    const currentPage = Math.floor(currentY / PAGE_H);
    const pageBottom = (currentPage + 1) * PAGE_H - bottomMargin;

    if (currentY + elementHeight > pageBottom) {
      const nextPageTop = (currentPage + 1) * PAGE_H + (HEADER_H + 4);
      return nextPageTop;
    }

    return currentY;
  };

  // helper: dodanie tekstu (z obsługą linka na całym węźle)
  const addTextNode = (x, y, w, text, style = BODY_STYLE, opts = {}) => {
    const h = Math.max(4, measureTextHeightMm(text, w, style));
    const node = createTextNode({
      frame: { x, y, w, h, rotation: 0 },
      text,
      textStyle: style,
    });
    if (opts.link) node.link = opts.link; // <<<<<<<<<<<<<< klikany link
    if (opts.vAlign) node.textStyle.verticalAlign = opts.vAlign; // ewentualne wymuszenie vAlign
    nodes.push(node);
    return h;
  };
  const addLabelNode = (x, y, w, text) =>
    addTextNode(x, y, w, text, LABEL_STYLE);
  const addRule = (x, y, w) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h: 0.8, rotation: 0 },
        style: {
          fill: { color: "#e2e8f0", opacity: 1 },
          stroke: null,
          cornerRadius: 0,
        },
      }),
    );

  // pasek nagłówka
  nodes.push(
    createShapeNode({
      frame: { x: 0, y: 0, w: PAGE_W, h: HEADER_H, rotation: 0 },
      style: { fill: { color: "#f8fafc", opacity: 1 }, stroke: null },
    }),
  );

  const name = api?.personalData?.name || "Imię i nazwisko";
  const headline = api?.headline || " ";

  addTextNode(MARGIN, 8, PAGE_W - 2 * MARGIN - 28, name, {
    ...BODY_STYLE,
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.12,
    color: "#0f172a",
  });
  addTextNode(MARGIN, 20, PAGE_W - 2 * MARGIN - 28, headline, {
    ...BODY_STYLE,
    fontSize: 11,
    fontWeight: 600,
    color: "#475569",
    lineHeight: 1.18,
  });

  if (api?.personalData?.images) {
    nodes.push(
      createImageNode({
        frame: { x: PAGE_W - MARGIN - 20, y: 8, w: 20, h: 20, rotation: 0 },
        src: api.personalData.images,
        style: { cornerRadius: 999, shape: "circle", clipCircle: true }, // <<<<<< okrąg
      }),
    );
  }

  // sidebar tło
  nodes.push(
    createShapeNode({
      frame: {
        x: 0,
        y: HEADER_H,
        w: SIDEBAR_W,
        h: PAGE_H - HEADER_H - 1,
        rotation: 0,
      },
      style: {
        fill: { color: "#eef2ff", opacity: 1 },
        stroke: null,
        cornerRadius: 0,
      },
    }),
  );

  let sideY = HEADER_H + 4;

  // Kontakt
  sideY = checkPageBreak(sideY, 15);
  addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, "Kontakt", {
    ...LABEL_STYLE,
    color: "#3730a3",
  });
  sideY += GAP_BLOCK + 6;

  // Telefon
  if (api?.personalData?.phoneNumber) {
    const tel = String(api.personalData.phoneNumber);
    sideY +=
      addTextNode(
        MARGIN,
        sideY,
        SIDEBAR_W - 2 * MARGIN,
        `☎ ${tel}`,
        SOFT_STYLE,
        { link: `tel:${tel.replace(/\s+/g, "")}`, vAlign: "middle" },
      ) + 1.2;
  }

  // E-mail
  if (api?.personalData?.email) {
    const mail = String(api.personalData.email);
    sideY +=
      addTextNode(
        MARGIN,
        sideY,
        SIDEBAR_W - 2 * MARGIN,
        `✉ ${mail}`,
        SOFT_STYLE,
        { link: `mailto:${mail}`, vAlign: "middle" },
      ) + 1.2;
  }

  // Miasto (bez linka)
  if (api?.personalData?.city) {
    sideY +=
      addTextNode(
        MARGIN,
        sideY,
        SIDEBAR_W - 2 * MARGIN,
        `📍 ${api.personalData.city}`,
        SOFT_STYLE,
        { vAlign: "middle" },
      ) + 1.2;
  }

  // Nazwa dla etykiety linku (ładne słowo zamiast pełnego URL)
  function titleForTypeOrDomain(url, rawType) {
    const TYPE_TITLES = {
      linkedin: "LinkedIn",
      github: "GitHub",
      gitlab: "GitLab",
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter",
      website: "Strona WWW",
      homepage: "Strona WWW",
    };
    if (rawType && TYPE_TITLES[rawType]) return TYPE_TITLES[rawType];
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");
      if (host.includes("linkedin.")) return "LinkedIn";
      if (host.includes("github.")) return "GitHub";
      if (host.includes("gitlab.")) return "GitLab";
      if (host.includes("instagram.")) return "Instagram";
      if (host.includes("facebook.")) return "Facebook";
      if (host.includes("twitter.")) return "Twitter";
      return host;
    } catch {
      return "Link";
    }
  }

  // Linki (LinkedIn, GitHub, itp.) — etykiety + klikalne URL-e
  if (Array.isArray(api?.personalData?.links)) {
    for (const l of api.personalData.links) {
      if (!l) continue;
      const url = typeof l === "string" ? l : l?.url;
      const rawType = (
        typeof l === "object" && l?.type ? String(l.type) : ""
      ).toLowerCase();
      if (!url) continue;

      const u = String(url);
      const lu = u.toLowerCase();
      const icon =
        ICON_MAP[rawType] ||
        (lu.includes("linkedin.com")
          ? ICON_MAP.linkedin
          : lu.includes("github.com")
            ? ICON_MAP.github
            : lu.includes("gitlab.com")
              ? ICON_MAP.gitlab
              : lu.includes("instagram.com")
                ? ICON_MAP.instagram
                : lu.includes("facebook.com")
                  ? ICON_MAP.facebook
                  : lu.includes("twitter.com")
                    ? ICON_MAP.twitter
                    : ICON_MAP.website);

      const label = titleForTypeOrDomain(u, rawType);

      sideY +=
        addTextNode(
          MARGIN,
          sideY,
          SIDEBAR_W - 2 * MARGIN,
          `${icon} ${label}`,
          SOFT_STYLE,
          { link: u, vAlign: "middle" }, // <<<<<<<<<<<<<< klikana etykieta
        ) + 1.2;
    }
  }

  sideY += GAP_SECTION;
  addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
  sideY += GAP_SECTION;

  // Umiejętności
  sideY = checkPageBreak(sideY, 15);
  sideY +=
    addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, "Umiejętności", {
      ...LABEL_STYLE,
      color: "#3730a3",
    }) + GAP_BLOCK;
  if (Array.isArray(api.skills)) {
    const skillsBlocks = api.skills
      .map((cat) => {
        const category = cat?.category || "Inne";
        const items = (cat?.items || [])
          .map((i) => i?.name)
          .filter(Boolean)
          .join(" • ");
        return items ? `${category}:\n${items}` : category;
      })
      .filter(Boolean)
      .join("\n\n");
    if (skillsBlocks)
      sideY +=
        addTextNode(MARGIN, sideY, 45, skillsBlocks, SOFT_STYLE) + GAP_SECTION;
  }
  addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
  sideY += GAP_SECTION;

  // Języki
  if (Array.isArray(api.languages) && api.languages.length) {
    sideY = checkPageBreak(sideY, 15);
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, "Języki", {
        ...LABEL_STYLE,
        color: "#3730a3",
      }) + GAP_BLOCK;
    const langText = api.languages
      .map((l) => `${l.language || ""}${l.level ? ` – ${l.level}` : ""}`)
      .join("\n");
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, langText, SOFT_STYLE) +
      GAP_SECTION;
    addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
    sideY += GAP_SECTION;
  }

  // Edukacja (lewa kolumna)
  if (Array.isArray(api.educations) && api.educations.length) {
    sideY = checkPageBreak(sideY, 15);
    sideY +=
      addTextNode(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN, "Edukacja", {
        ...LABEL_STYLE,
        color: "#3730a3",
      }) + GAP_BLOCK;
    for (const ed of api.educations) {
      sideY = checkPageBreak(sideY, 20);
      const top = [ed?.degree, ed?.institution].filter(Boolean).join(" – ");
      const spec = ed?.specialization ? `\n${ed.specialization}` : "";
      const per = ed?.period ? `\n${ed.period}` : "";
      const block = `${top}${spec}${per}`.trim();
      if (block)
        sideY +=
          addTextNode(
            MARGIN,
            sideY,
            SIDEBAR_W - 2 * MARGIN,
            block,
            SOFT_STYLE,
          ) + GAP_BLOCK;
    }
    addRule(MARGIN, sideY, SIDEBAR_W - 2 * MARGIN);
    sideY += GAP_SECTION;
  }

  // prawa kolumna
  let y = HEADER_H + 4;

  if (api.summary) {
    y = checkPageBreak(y, 15);
    y += addLabelNode(MAIN_X, y, MAIN_W, "Podsumowanie") + GAP_BLOCK;
    y += addTextNode(MAIN_X, y, MAIN_W, api.summary, BODY_STYLE) + GAP_SECTION;
  }

  if (Array.isArray(api.experience) && api.experience.length) {
    y = checkPageBreak(y, 15);
    y += addLabelNode(MAIN_X, y, MAIN_W, "Doświadczenie") + GAP_BLOCK;
    for (const exp of api.experience) {
      y = checkPageBreak(y, 25);
      const head =
        [exp?.title, exp?.company].filter(Boolean).join(" – ") +
        (exp?.period ? ` (${exp.period})` : "");
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
        .join("\n");
      if (bullets)
        y += addTextNode(MAIN_X, y, MAIN_W, bullets, BODY_STYLE) + GAP_BLOCK;
      y += 2;
    }
    y += GAP_SECTION;
  }

  if (Array.isArray(api.portfolio) && api.portfolio.length) {
    y = checkPageBreak(y, 15);
    y += addLabelNode(MAIN_X, y, MAIN_W, "Projekty") + GAP_BLOCK;
    for (const p of api.portfolio) {
      y = checkPageBreak(y, 25);
      const pname = p?.name ? p.name : "Projekt";
      const tech = (p?.technologies || [])
        .map((t) => t?.name)
        .filter(Boolean)
        .join(" • ");

      // nazwa projektu opcjonalnie klikalna (jeśli p.url istnieje)
      if (pname.trim())
        y +=
          addTextNode(
            MAIN_X,
            y,
            MAIN_W,
            pname,
            { ...BODY_STYLE, fontWeight: 800 },
            { link: p?.url },
          ) + 1.5;

      const bullets = (p?.achievements || [])
        .map((a) => a?.description)
        .filter(Boolean)
        .map((t) => `• ${t}`)
        .join("\n");
      if (bullets)
        y += addTextNode(MAIN_X, y, MAIN_W, bullets, BODY_STYLE) + 1.5;

      if (tech)
        y += addTextNode(MAIN_X, y, MAIN_W, tech, BODY_STYLE) + GAP_BLOCK;
      y += 2;
    }
    y += GAP_SECTION;
  }

  if (api.gdprClause) {
    const rodoLabelH = measureTextHeightMm(
      "Klauzula RODO",
      MAIN_W,
      LABEL_STYLE,
    );
    const rodoBodyH = measureTextHeightMm(api.gdprClause, MAIN_W, {
      ...BODY_STYLE,
      fontSize: 8,
      lineHeight: 1.25,
      color: "#334155",
    });
    const totalRodoH = rodoLabelH + GAP_BLOCK + rodoBodyH;
    const yRodo = Math.max(y + GAP_SECTION, PAGE_H - MARGIN - totalRodoH);

    addTextNode(MAIN_X, yRodo, MAIN_W, "Klauzula RODO", LABEL_STYLE);
    addTextNode(
      MAIN_X,
      yRodo + rodoLabelH + GAP_BLOCK,
      MAIN_W,
      api.gdprClause,
      { ...BODY_STYLE, fontSize: 8, lineHeight: 1.25, color: "#334155" },
    );
  }

  doc.nodes = nodes;
  doc.meta = { data: api };
  return doc;
}

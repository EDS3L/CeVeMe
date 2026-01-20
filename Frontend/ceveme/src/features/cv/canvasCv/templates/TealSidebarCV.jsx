import {
  emptyDocument,
  createTextNode,
  createShapeNode,
  createImageNode,
} from "../core/model";
import { A4 } from "../core/mm";
import { measureTextHeightMm } from "../services/typeset";

export function buildPixelPerfectTealSidebarCV(api = {}) {
  const doc = emptyDocument(A4);
  const nodes = [];

  /* ============ SIATKA / STRONA (mm) ============ */
  const PAGE_W = 210;
  const PAGE_H = 296;

  // Bez marginesów – layout do krawędzi
  const LEFT_X = 0;
  const RIGHT_W = 70.5; // szerokość paska jak w wzorcu
  const RIGHT_X = PAGE_W - RIGHT_W;
  const LEFT_W = PAGE_W - RIGHT_W;

  /* ============ KOLORY I STYLE ============ */
  const COLORS = {
    sheetBg: "#FFFFFF",
    text: "#333132",
    muted: "#727272",
    divider: "#D9DEE6",
    link: "#006666", // akcent/link
    sidebar: "#006666", // kolor paska
    sidebarLine: "rgba(255,255,255,0.45)",
    sidebarText: "#FFFFFF",
    sidebarMuted: "rgba(255,255,255,0.85)",
    contactShape: "rgba(255,255,255,0.06)",
  };

  const STYLES = {
    // Nagłówek (lewa)
    name: {
      fontFamily: "Montserrat, Inter, Arial, sans-serif",
      fontSize: 22.8,
      fontWeight: 800,
      color: COLORS.text,
      lineHeight: 1.16,
    },
    title: {
      fontFamily: "Montserrat, Inter, Arial, sans-serif",
      fontSize: 12.2,
      fontWeight: 600,
      color: COLORS.link,
      lineHeight: 1.2,
    },

    // Pasek kontaktu
    contact: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.9,
      fontWeight: 400,
      color: COLORS.muted,
      lineHeight: 1.2,
    },

    // Nagłówki sekcji (PL)
    section: {
      fontFamily: "Montserrat, Inter, Arial, sans-serif",
      fontSize: 10.8,
      fontWeight: 700,
      color: COLORS.muted,
      lineHeight: 1.18,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },

    // Treści
    summary: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.9,
      fontWeight: 400,
      color: COLORS.text,
      lineHeight: 1.45,
    },
    role: {
      fontFamily: "Poppins, Inter, Arial, sans-serif",
      fontSize: 10.1,
      fontWeight: 700,
      color: COLORS.text,
      lineHeight: 1.25,
    },
    period: {
      fontFamily: "Poppins, Inter, Arial, sans-serif",
      fontSize: 9.6,
      fontWeight: 400,
      color: COLORS.text,
      lineHeight: 1.2,
      textAlign: "right",
    },
    companyLink: {
      fontFamily: "Lato, Inter, Arial, sans-serif",
      fontSize: 10.0,
      fontWeight: 700,
      color: COLORS.link,
      lineHeight: 1.2,
    },
    cityMuted: {
      fontFamily: "Lato, Inter, Arial, sans-serif",
      fontSize: 9.6,
      fontWeight: 400,
      color: COLORS.muted,
      lineHeight: 1.1,
      textAlign: "right",
    },
    bullets: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.7,
      fontWeight: 400,
      color: COLORS.text,
      lineHeight: 1.4,
    },

    // Portfolio
    projName: {
      fontFamily: "Poppins, Inter, Arial, sans-serif",
      fontSize: 10.1,
      fontWeight: 700,
      color: COLORS.text,
      lineHeight: 1.22,
    },
    projTech: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.4,
      fontWeight: 400,
      color: COLORS.muted,
      lineHeight: 1.22,
    },
    linkMuted: {
      fontFamily: "Lato, Inter, Arial, sans-serif",
      fontSize: 8.6,
      fontWeight: 700,
      color: COLORS.link,
      lineHeight: 1.2,
    },

    // Sidebar
    sidebarHeader: {
      fontFamily: "Montserrat, Inter, Arial, sans-serif",
      fontSize: 10.3,
      fontWeight: 700,
      color: COLORS.sidebarText,
      lineHeight: 1.22,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    sidebarTitle: {
      fontFamily: "Poppins, Inter, Arial, sans-serif",
      fontSize: 9.7,
      fontWeight: 700,
      color: COLORS.sidebarText,
      lineHeight: 1.22,
    },
    sidebarText: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.3,
      fontWeight: 400,
      color: COLORS.sidebarMuted,
      lineHeight: 1.32,
    },
    sidebarList: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.3,
      fontWeight: 600,
      color: COLORS.sidebarText,
      lineHeight: 1.28,
    },

    // Edukacja (sidebar)
    eduCourse: {
      fontFamily: "Poppins, Inter, Arial, sans-serif",
      fontSize: 9.7,
      fontWeight: 700,
      color: COLORS.sidebarText,
      lineHeight: 1.2,
    },
    eduSchool: {
      fontFamily: "Lato, Inter, Arial, sans-serif",
      fontSize: 8.8,
      fontWeight: 700,
      color: COLORS.sidebarText,
      lineHeight: 1.18,
    },
    eduPeriod: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 8.2,
      fontWeight: 400,
      color: COLORS.sidebarMuted,
      lineHeight: 1.1,
    },

    // RODO (stopka)
    gdpr: {
      fontFamily: "Open Sans, Inter, Arial, sans-serif",
      fontSize: 7.4,
      fontWeight: 400,
      color: COLORS.muted,
      lineHeight: 1.2,
      textAlign: "justify",
    },
  };

  const SECTION = { hLine: 0.5, gapTitleToLine: 1.6, gapAfterLine: 4.2 };
  // zagęszczenie tylko dla lewej kolumny
  const SECTION_LEFT = { gapTitleToLine: 1.2, gapAfterLine: 2.8 };

  /* ============ HELPERY ============ */
  const rect = (x, y, w, h, color) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color, opacity: 1 }, stroke: null },
      }),
    );

  const hLine = (x, y, w, h = SECTION.hLine, color = COLORS.divider) =>
    nodes.push(
      createShapeNode({
        frame: { x, y, w, h },
        style: { fill: { color, opacity: 1 }, stroke: null },
      }),
    );

  const tblock = (x, y, w, text, style = {}, opts = {}) => {
    const s = String(text ?? "");
    if (!s.trim()) return 0;
    const h = Math.max(3.4, measureTextHeightMm(s, w, style));

    const textStyle = { ...(style || {}) };
    if (
      typeof textStyle.color === "string" &&
      /^rgba?\(/i.test(textStyle.color)
    ) {
      const m = textStyle.color.match(
        /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i,
      );
      if (m) {
        const toHex = (v) => Number(v).toString(16).padStart(2, "0");
        textStyle.color = `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
      }
    }
    if (opts.link) {
      textStyle.textDecoration = "none";
      textStyle.textDecorationLine = "none";
    }

    const node = createTextNode({
      frame: { x, y, w, h },
      text: s,
      textStyle,
    });
    if (opts.link) node.link = opts.link;
    nodes.push(node);
    return h;
  };

  const svgData = (svg) =>
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim());

  const ICONS = {
    phone: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
  <path d="M3 7l9 6 9-6"/>
</svg>`,
    link: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 7h3a5 5 0 1 1 0 10h-3M9 17H6a5 5 0 1 1 0-10h3"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,
    pin: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
  fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10c0 5.5-9 12-9 12s-9-6.5-9-12a9 9 0 1 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`,
  };

  const fmtPeriod = (raw) => String(raw || "").trim();

  const normalizeProjectLinks = (p = {}) => {
    const out = [];
    const add = (u, lab) => {
      if (!u) return;
      let label = lab || "";
      try {
        label ||= new URL(u).hostname.replace(/^www\./, "");
      } catch {
        label = String(u);
      }
      out.push({ url: String(u), label });
    };
    add(p.url, "");
    add(p.homepage, "Strona");
    add(p.demo, "Demo");
    add(p.repository || p.github || p.repo, "Repozytorium");
    if (Array.isArray(p.links)) {
      for (const l of p.links) {
        const u = typeof l === "string" ? l : l?.url || l?.href || "";
        const lab =
          typeof l === "string" ? "" : l?.label || l?.name || l?.type || "";
        add(u, lab);
      }
    }
    return out;
  };

  const checkPageBreak = (currentY, elementHeight, bottomMargin = 20) => {
    const currentPage = Math.floor(currentY / PAGE_H);
    const pageBottom = (currentPage + 1) * PAGE_H - bottomMargin;

    if (currentY + elementHeight > pageBottom) {
      const nextPageTop = (currentPage + 1) * PAGE_H + 8.0;
      return nextPageTop;
    }

    return currentY;
  };

  /* ============ TŁA ============ */
  rect(LEFT_X, 0, LEFT_W, PAGE_H, COLORS.sheetBg);
  rect(RIGHT_X, 0, RIGHT_W, PAGE_H, COLORS.sidebar);

  /* ============ DANE ============ */
  const pd = api?.personalData || {};
  const experiences = Array.isArray(api?.experience) ? api.experience : [];
  const projects = Array.isArray(api?.portfolio) ? api.portfolio : [];
  const educations = Array.isArray(api?.educations) ? api.educations : [];
  const languages = Array.isArray(api?.languages) ? api.languages : [];
  const strengths =
    Array.isArray(api?.strengths) && api.strengths.length
      ? api.strengths
      : (api?.awards || []).map((a) =>
          typeof a === "string"
            ? { title: a }
            : { title: a?.name, description: a?.description },
        );
  const pdLinks = Array.isArray(pd?.links) ? pd.links : [];

  /* ============ LEWA KOLUMNA (ZCIAŚNIONA) ============ */
  const LEFT_PAD = 5.0; // węższe wewnętrzne marginesy
  const Lx = LEFT_X + LEFT_PAD;
  const Lw = LEFT_W - 2 * LEFT_PAD;

  // „dense” style wyłącznie dla lewej kolumny
  const DENSE = {
    summary: { ...STYLES.summary, fontSize: 8.5, lineHeight: 1.35 },
    role: { ...STYLES.role, fontSize: 9.4, lineHeight: 1.18 },
    period: { ...STYLES.period, fontSize: 9.1 },
    companyLink: { ...STYLES.companyLink, fontSize: 9.3 },
    cityMuted: { ...STYLES.cityMuted, fontSize: 9.1 },
    bullets: { ...STYLES.bullets, fontSize: 8.3, lineHeight: 1.34 },
    projName: { ...STYLES.projName, fontSize: 9.4 },
    projTech: { ...STYLES.projTech, fontSize: 8.0 },
    linkMuted: { ...STYLES.linkMuted, fontSize: 8.2 },
  };

  let ly = 8.0;

  const fullName = String(pd?.name || "Imię Nazwisko").trim();
  const headline = String(api?.headline || "Stanowisko").trim();

  ly += tblock(Lx, ly, Lw, fullName.toUpperCase(), STYLES.name);
  ly += tblock(Lx, ly - 1.2, Lw, headline, STYLES.title) + 2.4;

  // PODSUMOWANIE
  ly = checkPageBreak(ly, 15);
  ly += tblock(Lx, ly, Lw, "PODSUMOWANIE", STYLES.section);
  ly += SECTION_LEFT.gapTitleToLine;
  hLine(Lx, ly, Lw);
  ly += SECTION_LEFT.gapAfterLine;
  if (api?.summary) ly += tblock(Lx, ly, Lw, api.summary, DENSE.summary) + 4.0;

  // DOŚWIADCZENIE ZAWODOWE
  ly = checkPageBreak(ly, 15);
  ly += tblock(Lx, ly, Lw, "DOŚWIADCZENIE ZAWODOWE", STYLES.section);
  ly += SECTION_LEFT.gapTitleToLine;
  hLine(Lx, ly, Lw);
  ly += SECTION_LEFT.gapAfterLine + 0.6;

  for (const exp of experiences) {
    ly = checkPageBreak(ly, 25);
    const leftW = Lw * 0.62;
    const rightW = Lw - leftW;

    const h1 = tblock(Lx, ly, leftW, exp?.title || "", DENSE.role);
    tblock(Lx + leftW, ly, rightW, fmtPeriod(exp?.period || ""), DENSE.period);
    ly += Math.max(h1, 6.2);

    const company = String(exp?.company || "").trim();
    const companyUrl =
      exp?.companyUrl ||
      exp?.url ||
      (typeof exp?.website === "string" ? exp.website : "");
    const ch = tblock(
      Lx,
      ly,
      leftW,
      company,
      DENSE.companyLink,
      companyUrl ? { link: companyUrl } : {},
    );
    tblock(
      Lx + leftW,
      ly,
      rightW,
      String(exp?.location || ""),
      DENSE.cityMuted,
    );
    ly += Math.max(ch, 5.0);

    if (exp?.jobDescription) {
      ly += tblock(Lx, ly, Lw, exp.jobDescription, DENSE.summary);
    }

    const bullets =
      Array.isArray(exp?.achievements) && exp.achievements.length
        ? exp.achievements
            .map((a) =>
              typeof a === "string" ? a : a?.description || a?.title,
            )
            .filter(Boolean)
        : [];
    if (bullets.length) {
      ly += tblock(
        Lx,
        ly,
        Lw,
        bullets.map((b) => `• ${b}`).join("\n"),
        DENSE.bullets,
      );
    }
    ly += 4.0;
  }

  // PORTFOLIO (zamiast EDUKACJI w lewej kolumnie)
  if (projects.length) {
    ly = checkPageBreak(ly, 15);
    ly += tblock(Lx, ly, Lw, "PORTFOLIO", STYLES.section);
    ly += SECTION_LEFT.gapTitleToLine;
    hLine(Lx, ly, Lw);
    ly += SECTION_LEFT.gapAfterLine + 0.8;

    for (const p of projects) {
      ly = checkPageBreak(ly, 25);
      const nm = p?.name || "Projekt";
      const nmLink = p?.url || p?.homepage || "";
      ly += tblock(
        Lx,
        ly,
        Lw,
        nm,
        DENSE.projName,
        nmLink ? { link: nmLink } : {},
      );

      const tech = (p?.technologies || [])
        .map((t) => (typeof t === "string" ? t : t?.name))
        .filter(Boolean)
        .join(" • ");
      if (tech) ly += tblock(Lx, ly, Lw, tech, DENSE.projTech);

      if (p?.description)
        ly += tblock(Lx, ly, Lw, p.description, DENSE.summary);

      const linksP = normalizeProjectLinks(p);
      for (const l of linksP.slice(0, 3)) {
        ly += tblock(Lx + 2, ly, Lw - 2, l.label, DENSE.linkMuted, {
          link: l.url,
        });
      }

      const ach =
        Array.isArray(p?.achievements) && p.achievements.length
          ? p.achievements
              .map((a) => (typeof a === "string" ? a : a?.description))
              .filter(Boolean)
          : [];
      if (ach.length)
        ly += tblock(
          Lx,
          ly,
          Lw,
          ach.map((s) => `• ${s}`).join("\n"),
          DENSE.bullets,
        );

      ly += 4.0;
    }
  }

  /* ============ PRAWY PASEK ============ */
  const PHOTO = { size: 38, top: 10 }; // rezerwacja miejsca u góry
  const photoSrc = pd?.images;
  const cx = RIGHT_X + RIGHT_W / 2 - PHOTO.size / 2;
  const cy = PHOTO.top;

  // placeholder / zdjęcie (okrąg)
  nodes.push(
    createShapeNode({
      frame: { x: cx, y: cy, w: PHOTO.size, h: PHOTO.size },
      style: {
        fill: { color: "rgba(255,255,255,0.18)", opacity: 1 },
        stroke: null,
        cornerRadius: PHOTO.size / 2,
      },
    }),
  );
  if (photoSrc) {
    nodes.push(
      createImageNode({
        frame: { x: cx, y: cy, w: PHOTO.size, h: PHOTO.size },
        src: photoSrc,
        style: { cornerRadius: PHOTO.size / 2 },
      }),
    );
  }

  let ry = cy + PHOTO.size + 8;

  const sidebarHeader = (label) => {
    const hh = tblock(
      RIGHT_X + 6,
      ry,
      RIGHT_W - 12,
      label,
      STYLES.sidebarHeader,
    );
    ry += hh + 2.2;
    rect(RIGHT_X + 6, ry, RIGHT_W - 12, 0.6, COLORS.sidebarLine);
    ry += 3.8;
  };

  // UMIEJĘTNOŚCI
  const skillGroup = (name) =>
    (api?.skills || [])
      .find((g) => (g?.category || "").toLowerCase() === name.toLowerCase())
      ?.items?.map((s) => (typeof s === "string" ? s : s?.name))
      .filter(Boolean) || [];

  const skillsTools = skillGroup("Tools").length
    ? skillGroup("Tools")
    : (Array.isArray(api?.portfolio) ? api.portfolio : [])
        .flatMap((p) => p?.technologies || [])
        .map((t) => (typeof t === "string" ? t : t?.name))
        .filter(Boolean);

  const skillsOS = skillGroup("Operating Systems").length
    ? skillGroup("Operating Systems")
    : skillGroup("OS");

  if (skillsTools.length || skillsOS.length) {
    sidebarHeader("UMIEJĘTNOŚCI");
    if (skillsTools.length) {
      ry +=
        tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          "Narzędzia",
          STYLES.sidebarTitle,
        ) + 1.2;
      ry +=
        tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          skillsTools.join(" • "),
          STYLES.sidebarList,
        ) + 4.8;
    }
    if (skillsOS.length) {
      ry +=
        tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          "Systemy operacyjne",
          STYLES.sidebarTitle,
        ) + 1.2;
      ry +=
        tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          skillsOS.join(" • "),
          STYLES.sidebarList,
        ) + 4.8;
    }
  }

  // MOCNE STRONY
  if (Array.isArray(strengths) && strengths.length) {
    sidebarHeader("MOCNE STRONY");
    for (const s of strengths.slice(0, 4)) {
      const title = typeof s === "string" ? s : s?.title || s?.name || "";
      const desc = typeof s === "object" ? s?.description || "" : "";
      if (title)
        ry += tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          `★ ${title}`,
          STYLES.sidebarTitle,
        );
      if (desc)
        ry += tblock(RIGHT_X + 6, ry, RIGHT_W - 12, desc, STYLES.sidebarText);
      ry += 5.6;
    }
  }

  // EDUKACJA
  if (educations.length) {
    sidebarHeader("EDUKACJA");
    for (const e of educations) {
      const course = [e?.degree, e?.specialization].filter(Boolean).join(" — ");
      if (course)
        ry += tblock(RIGHT_X + 6, ry, RIGHT_W - 12, course, STYLES.eduCourse);
      if (e?.institution)
        ry += tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          e.institution,
          STYLES.eduSchool,
        );
      const period = fmtPeriod(
        e?.period || `${e?.startDate || ""} – ${e?.endDate || "obecnie"}`,
      );
      if (period)
        ry += tblock(RIGHT_X + 6, ry, RIGHT_W - 12, period, STYLES.eduPeriod);
      ry += 5.0;
    }
  }

  // JĘZYKI
  if (languages.length) {
    sidebarHeader("JĘZYKI");
    const lines = languages
      .map((l) => [l?.language, l?.level].filter(Boolean).join(" — "))
      .filter(Boolean);
    if (lines.length) {
      ry +=
        tblock(
          RIGHT_X + 6,
          ry,
          RIGHT_W - 12,
          lines.join("\n"),
          STYLES.sidebarList,
        ) + 2.0;
    }
  }

  // KONTAKT
  const sidebarContacts = [];
  if (pd?.phoneNumber) {
    sidebarContacts.push({
      icon: "phone",
      label: String(pd.phoneNumber),
      link: `tel:${String(pd.phoneNumber).replace(/\s+/g, "")}`,
    });
  }
  if (pd?.email) {
    sidebarContacts.push({
      icon: "mail",
      label: String(pd.email),
      link: `mailto:${String(pd.email)}`,
    });
  }
  if (pd?.city) {
    sidebarContacts.push({ icon: "pin", label: String(pd.city) });
  }
  const HOST_LABELS = {
    "linkedin.com": "LinkedIn",
    "github.com": "GitHub",
    "gitlab.com": "GitLab",
    "facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "twitter.com": "Twitter",
    "medium.com": "Medium",
    "youtube.com": "YouTube",
    "stackoverflow.com": "StackOverflow",
  };
  for (const l of pdLinks) {
    const url = typeof l === "string" ? l : l?.url || l?.href || "";
    if (!url) continue;
    let label = "";
    let hostname = "";
    try {
      hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      for (const key of Object.keys(HOST_LABELS)) {
        if (hostname.includes(key)) {
          label = HOST_LABELS[key];
          break;
        }
      }
    } catch {
      /* ignore */
    }
    if (!label) label = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const icon = hostname.includes("github")
      ? "github"
      : hostname.includes("linkedin")
        ? "link"
        : hostname.includes("gitlab")
          ? "link"
          : hostname.includes("facebook")
            ? "link"
            : hostname.includes("instagram")
              ? "link"
              : "link";
    sidebarContacts.push({ icon, label, link: url });
  }

  // helper: ikonka dostosowana do paska (biały)
  const sidebarSvg = (k) =>
    svgData(
      (ICONS[k] || ICONS.link).replace(
        new RegExp(String(COLORS.muted), "g"),
        COLORS.sidebarText,
      ),
    );

  const parseColor = (c) => {
    if (!c) return { color: "#000000", opacity: 1 };
    const s = String(c).trim();
    const rgba = s.match(
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i,
    );
    if (rgba) {
      const r = Number(rgba[1]),
        g = Number(rgba[2]),
        b = Number(rgba[3]);
      const a = rgba[4] !== undefined ? Number(rgba[4]) : 1;
      const toHex = (v) => Number(v).toString(16).padStart(2, "0");
      return {
        color: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
        opacity: Number.isFinite(a) ? a : 1,
      };
    }
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s))
      return { color: s, opacity: 1 };
    return { color: s, opacity: 1 };
  };

  // render ładnej, ciasnej listy kontaktów jako "chipy" w pasku
  if (sidebarContacts.length) {
    ry += tblock(
      RIGHT_X + 6,
      ry,
      RIGHT_W - 12,
      "KONTAKT",
      STYLES.sidebarHeader,
    );
    ry += 2.2;
    rect(RIGHT_X + 6, ry, RIGHT_W - 12, 0.45, COLORS.sidebarLine);
    ry += 3.8;

    const CHIP_PAD_X = 3.2;
    const CHIP_PAD_Y = 2.0;
    const ICON_SIZE = 3.6;
    const CHIP_GAP = 4.0;
    const chipW = RIGHT_W - 12;

    for (const c of sidebarContacts) {
      const label = String(c.label || "");
      const textW = chipW - (CHIP_PAD_X * 2 + ICON_SIZE + 4);
      const th = Math.max(
        3.6,
        measureTextHeightMm(label, textW, STYLES.sidebarList),
      );
      const chipH = th + CHIP_PAD_Y * 2;

      const chipFill = parseColor(COLORS.contactShape);
      nodes.push(
        createShapeNode({
          frame: { x: RIGHT_X + 6, y: ry, w: chipW, h: chipH },
          style: {
            fill: { color: chipFill.color, opacity: chipFill.opacity },
            stroke: null,
            cornerRadius: 4,
          },
        }),
      );

      nodes.push(
        createImageNode({
          frame: {
            x: RIGHT_X + 6 + CHIP_PAD_X,
            y: ry + (chipH - ICON_SIZE) / 2,
            w: ICON_SIZE,
            h: ICON_SIZE,
          },
          src: sidebarSvg(c.icon),
          style: { cornerRadius: 0 },
        }),
      );

      const textX = RIGHT_X + 6 + CHIP_PAD_X + ICON_SIZE + 4;
      const opts = c.link ? { link: c.link } : {};
      tblock(
        textX,
        ry + CHIP_PAD_Y,
        textW,
        label,
        { ...STYLES.sidebarList, color: COLORS.sidebarText },
        opts,
      );

      ry += chipH + CHIP_GAP;
    }

    ry += 2.0;
  }

  /* ============ RODO NA SAMYM DOLE (LEWA KOLUMNA) ============ */
  const gdpr =
    api?.gdprClause || api?.personalData?.gdprClause || api?.gdpr || "";
  if (gdpr) {
    const bottomMargin = 6; // oddech od krawędzi
    const w = Lw;
    const h = Math.max(3.4, measureTextHeightMm(gdpr, w, STYLES.gdpr));
    const y = PAGE_H - bottomMargin - h;
    // Opcjonalna cienka linia nad klauzulą:
    // rect(Lx, y - 2, w, 0.4, COLORS.divider);
    tblock(Lx, y, w, gdpr, STYLES.gdpr);
  }

  /* ============ FINALIZACJA ============ */
  doc.nodes = nodes;
  doc.meta = { data: api, template: "PixelPerfectTealSidebarCV_PL" };
  return doc;
}

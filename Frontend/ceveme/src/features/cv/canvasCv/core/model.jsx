export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createTextNode(partial = {}) {
  return {
    id: uid("txt"),
    type: "text",
    frame: { x: 20, y: 20, w: 80, h: 20, rotation: 0 },
    text: "Nowy tekst",
    textStyle: {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 12,
      fontWeight: 700,
      color: "#0f172a",
      align: "left",
      lineHeight: 1.3,
    },
    style: { fill: null, stroke: null, cornerRadius: 0, shadow: null },
    lock: false,
    visible: true,
    ...partial,
  };
}

export function createImageNode(partial = {}) {
  return {
    id: uid("img"),
    type: "image",
    frame: { x: 20, y: 50, w: 60, h: 40, rotation: 0 },
    src: "https://picsum.photos/600/400",
    style: { fill: null, stroke: null, cornerRadius: 4, shadow: null },
    objectFit: "cover",
    lock: false,
    visible: true,
    ...partial,
  };
}

export function createShapeNode(partial = {}) {
  return {
    id: uid("shp"),
    type: "shape",
    frame: { x: 15, y: 15, w: 80, h: 30, rotation: 0 },
    style: {
      fill: { color: "#e2e8f0", opacity: 1 },
      stroke: { color: "#94a3b8", width: 0.6, dash: [] },
      cornerRadius: 4,
      shadow: null,
    },
    lock: false,
    visible: true,
    ...partial,
  };
}

export const CV_ICONS = {
  phone: {
    name: "Telefon",
    viewBox: "0 0 24 24",
    path: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  },
  mail: {
    name: "Email",
    viewBox: "0 0 24 24",
    path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  },
  location: {
    name: "Lokalizacja",
    viewBox: "0 0 24 24",
    path: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  },
  globe: {
    name: "Strona WWW",
    viewBox: "0 0 24 24",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  },

  linkedin: {
    name: "LinkedIn",
    viewBox: "0 0 24 24",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  },
  github: {
    name: "GitHub",
    viewBox: "0 0 24 24",
    path: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  },
  twitter: {
    name: "Twitter/X",
    viewBox: "0 0 24 24",
    path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  },
  instagram: {
    name: "Instagram",
    viewBox: "0 0 24 24",
    path: "M17.5 2h-11A4.5 4.5 0 0 0 2 6.5v11A4.5 4.5 0 0 0 6.5 22h11a4.5 4.5 0 0 0 4.5-4.5v-11A4.5 4.5 0 0 0 17.5 2z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01",
  },
  facebook: {
    name: "Facebook",
    viewBox: "0 0 24 24",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  youtube: {
    name: "YouTube",
    viewBox: "0 0 24 24",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z",
  },
  dribbble: {
    name: "Dribbble",
    viewBox: "0 0 24 24",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M8.56 2.75a12.93 12.93 0 0 0 4.3 6.42 17.93 17.93 0 0 0-8.6 1.94A9.97 9.97 0 0 1 8.56 2.75z M2 12c0-.29.01-.57.04-.85a17.48 17.48 0 0 1 9.47-2.23 16.92 16.92 0 0 1 2.19 3.37A17.24 17.24 0 0 0 4 17.7 9.96 9.96 0 0 1 2 12z",
  },
  behance: {
    name: "Behance",
    viewBox: "0 0 24 24",
    path: "M22 7h-7V5h7v2z M10 6.5a3.5 3.5 0 0 1 0 7h-4v-7h4z M10 17.5a3.5 3.5 0 0 1 0-7H6v7h4z M18 14.5c0-2.5-1.5-4.5-4-4.5s-4 2-4 4.5 1.5 4.5 4 4.5c2 0 3.5-1.5 4-3h-2.5c-.3.5-1 1-1.5 1-1 0-2-.8-2-2h6z",
  },

  calendar: {
    name: "Kalendarz",
    viewBox: "0 0 24 24",
    path: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18",
  },
  briefcase: {
    name: "Praca",
    viewBox: "0 0 24 24",
    path: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  },
  graduationCap: {
    name: "Edukacja",
    viewBox: "0 0 24 24",
    path: "M22 10l-10-5L2 10l10 5 10-5z M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5",
  },
  award: {
    name: "Nagroda",
    viewBox: "0 0 24 24",
    path: "M12 15l-2 5h4l-2-5z M8.21 13.89L7 23l5-3 5 3-1.21-9.12 M12 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14z",
  },
  certificate: {
    name: "Certyfikat",
    viewBox: "0 0 24 24",
    path: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M7 7h10 M7 11h10 M7 15h6 M15 17l2 2 4-4",
  },
  book: {
    name: "Książka",
    viewBox: "0 0 24 24",
    path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  },

  star: {
    name: "Gwiazdka",
    viewBox: "0 0 24 24",
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  code: {
    name: "Kod",
    viewBox: "0 0 24 24",
    path: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  },
  terminal: {
    name: "Terminal",
    viewBox: "0 0 24 24",
    path: "M4 17l6-6-6-6 M12 19h8",
  },
  database: {
    name: "Baza danych",
    viewBox: "0 0 24 24",
    path: "M12 2c4.97 0 9 1.79 9 4v12c0 2.21-4.03 4-9 4s-9-1.79-9-4V6c0-2.21 4.03-4 9-4z M3 6c0 2.21 4.03 4 9 4s9-1.79 9-4 M3 12c0 2.21 4.03 4 9 4s9-1.79 9-4",
  },
  cloud: {
    name: "Chmura",
    viewBox: "0 0 24 24",
    path: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  },
  settings: {
    name: "Ustawienia",
    viewBox: "0 0 24 24",
    path: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  },
  layers: {
    name: "Warstwy",
    viewBox: "0 0 24 24",
    path: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  },

  user: {
    name: "Użytkownik",
    viewBox: "0 0 24 24",
    path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  },
  users: {
    name: "Zespół",
    viewBox: "0 0 24 24",
    path: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  },
  heart: {
    name: "Serce",
    viewBox: "0 0 24 24",
    path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  },
  target: {
    name: "Cel",
    viewBox: "0 0 24 24",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  },
  flag: {
    name: "Flaga",
    viewBox: "0 0 24 24",
    path: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  },
  lightbulb: {
    name: "Pomysł",
    viewBox: "0 0 24 24",
    path: "M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z M9 21h6",
  },

  check: {
    name: "Ptaszek",
    viewBox: "0 0 24 24",
    path: "M20 6L9 17l-5-5",
  },
  checkCircle: {
    name: "Sukces",
    viewBox: "0 0 24 24",
    path: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  },
  plus: {
    name: "Plus",
    viewBox: "0 0 24 24",
    path: "M12 5v14 M5 12h14",
  },
  minus: {
    name: "Minus",
    viewBox: "0 0 24 24",
    path: "M5 12h14",
  },
  arrowRight: {
    name: "Strzałka prawo",
    viewBox: "0 0 24 24",
    path: "M5 12h14 M12 5l7 7-7 7",
  },
  arrowUp: {
    name: "Strzałka góra",
    viewBox: "0 0 24 24",
    path: "M12 19V5 M5 12l7-7 7 7",
  },
  externalLink: {
    name: "Link zewnętrzny",
    viewBox: "0 0 24 24",
    path: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  },
  download: {
    name: "Pobierz",
    viewBox: "0 0 24 24",
    path: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  },
  clock: {
    name: "Zegar",
    viewBox: "0 0 24 24",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2",
  },
  language: {
    name: "Język",
    viewBox: "0 0 24 24",
    path: "M5 8h14 M5 12h7 M2 3h7 M5.5 3v5 M12 21l3.5-7 3.5 7 M13 19h6 M15 11.5a3 3 0 0 1-6 0c0-1.66 1.34-3 3-3h3",
  },
  car: {
    name: "Samochód",
    viewBox: "0 0 24 24",
    path: "M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M5 17H3v-6l2-4h10l2 4v6h-2 M5 17h10 M6 7l2-4h8l2 4",
  },
  home: {
    name: "Dom",
    viewBox: "0 0 24 24",
    path: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  },
  coffee: {
    name: "Kawa",
    viewBox: "0 0 24 24",
    path: "M18 8h1a4 4 0 0 1 0 8h-1 M18 8H2v9a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8z M6 1v3 M10 1v3 M14 1v3",
  },
};

export function createIconNode(iconKey = "phone", partial = {}) {
  const iconDef = CV_ICONS[iconKey] || CV_ICONS.phone;
  return {
    id: uid("ico"),
    type: "icon",
    iconKey,
    frame: { x: 20, y: 20, w: 6, h: 6, rotation: 0 },
    style: {
      color: "#0f172a",
      strokeWidth: 2,
    },
    iconDef, 
    lock: false,
    visible: true,
    ...partial,
  };
}

export function emptyDocument(page = { widthMm: 210, heightMm: 297 }) {
  return {
    id: uid("doc"),
    page,
    nodes: [],
  };
}

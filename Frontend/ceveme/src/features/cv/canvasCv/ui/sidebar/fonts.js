// fontStacks.js
// Duża baza web-safe / systemowych font stacków.
// Każdy wpis ma: label (przyjazna nazwa), stack (pełny font-family), category, os (targets).

export const FONT_STACKS = [
  /* =========================
     SANS-SERIF — SYSTEM / WEB-SAFE
     ========================= */
  {
    label: 'System UI',
    category: 'sans',
    os: 'multi',
    stack:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
  },
  {
    label: 'San Francisco (Apple)',
    category: 'sans',
    os: 'macOS/iOS',
    stack:
      '-apple-system, "Helvetica Neue", Arial, "Apple Color Emoji", sans-serif',
  },
  {
    label: 'Segoe UI',
    category: 'sans',
    os: 'Windows',
    stack: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  {
    label: 'Segoe UI Variable',
    category: 'sans',
    os: 'Windows 11+',
    stack:
      '"Segoe UI Variable Text", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  {
    label: 'Roboto (fallback stack)',
    category: 'sans',
    os: 'Android+',
    stack: 'Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },
  {
    label: 'Arial',
    category: 'sans',
    os: 'multi',
    stack: 'Arial, Helvetica, sans-serif',
  },
  {
    label: 'Helvetica',
    category: 'sans',
    os: 'macOS',
    stack: 'Helvetica, Arial, sans-serif',
  },
  {
    label: 'Helvetica Neue',
    category: 'sans',
    os: 'macOS',
    stack: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  {
    label: 'Verdana',
    category: 'sans',
    os: 'multi',
    stack: 'Verdana, Geneva, Tahoma, sans-serif',
  },
  {
    label: 'Geneva',
    category: 'sans',
    os: 'macOS',
    stack: 'Geneva, Tahoma, Verdana, sans-serif',
  },
  {
    label: 'Tahoma',
    category: 'sans',
    os: 'Windows',
    stack: 'Tahoma, Geneva, sans-serif',
  },
  {
    label: 'Trebuchet MS',
    category: 'sans',
    os: 'multi',
    stack:
      '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Arial, sans-serif',
  },
  {
    label: 'Gill Sans',
    category: 'sans',
    os: 'macOS',
    stack: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
  },
  {
    label: 'Calibri',
    category: 'sans',
    os: 'Windows',
    stack: 'Calibri, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  {
    label: 'Candara',
    category: 'sans',
    os: 'Windows',
    stack: 'Candara, Calibri, "Segoe UI", Arial, sans-serif',
  },
  {
    label: 'Optima',
    category: 'sans',
    os: 'macOS',
    stack: 'Optima, Segoe, "Segoe UI", Candara, Calibri, Arial, sans-serif',
  },
  {
    label: 'Franklin Gothic',
    category: 'sans',
    os: 'Windows',
    stack: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
  },
  {
    label: 'Lucida Sans / Grande',
    category: 'sans',
    os: 'multi',
    stack:
      '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
  },
  {
    label: 'Impact / Haettenschweiler (bold display)',
    category: 'sans',
    os: 'Windows',
    stack: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  },
  {
    label: 'Futura (fallbacky)',
    category: 'sans',
    os: 'macOS',
    stack: 'Futura, "Trebuchet MS", Arial, sans-serif',
  },
  {
    label: 'Avenir (fallbacky)',
    category: 'sans',
    os: 'macOS',
    stack: 'Avenir, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  {
    label: 'Avenir Next (fallbacky)',
    category: 'sans',
    os: 'macOS',
    stack:
      '"Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  {
    label: 'Ubuntu (systemy Linux)',
    category: 'sans',
    os: 'Linux',
    stack: 'Ubuntu, Cantarell, "DejaVu Sans", "Noto Sans", Arial, sans-serif',
  },
  {
    label: 'Cantarell (GNOME)',
    category: 'sans',
    os: 'Linux',
    stack: 'Cantarell, "DejaVu Sans", "Noto Sans", Arial, sans-serif',
  },
  {
    label: 'DejaVu Sans',
    category: 'sans',
    os: 'Linux',
    stack: '"DejaVu Sans", "Liberation Sans", Arial, sans-serif',
  },
  {
    label: 'Liberation Sans',
    category: 'sans',
    os: 'Linux',
    stack: '"Liberation Sans", "DejaVu Sans", Arial, sans-serif',
  },
  {
    label: 'Noto Sans (system)',
    category: 'sans',
    os: 'multi',
    stack: '"Noto Sans", Arial, Helvetica, sans-serif',
  },

  /* =========================
     SERIF — SYSTEM / WEB-SAFE
     ========================= */
  {
    label: 'Georgia',
    category: 'serif',
    os: 'multi',
    stack: 'Georgia, "Times New Roman", Times, serif',
  },
  {
    label: 'Times New Roman',
    category: 'serif',
    os: 'multi',
    stack: '"Times New Roman", Times, Georgia, serif',
  },
  {
    label: 'Times',
    category: 'serif',
    os: 'multi',
    stack: 'Times, "Times New Roman", Georgia, serif',
  },
  {
    label: 'Cambria',
    category: 'serif',
    os: 'Windows',
    stack: 'Cambria, Georgia, "Times New Roman", Times, serif',
  },
  {
    label: 'Constantia',
    category: 'serif',
    os: 'Windows',
    stack: 'Constantia, Georgia, "Times New Roman", serif',
  },
  {
    label: 'Palatino / Book Antiqua',
    category: 'serif',
    os: 'multi',
    stack: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
  },
  {
    label: 'Baskerville',
    category: 'serif',
    os: 'macOS',
    stack: 'Baskerville, "Times New Roman", Times, serif',
  },
  {
    label: 'Garamond',
    category: 'serif',
    os: 'multi',
    stack: 'Garamond, "Times New Roman", Times, serif',
  },
  {
    label: 'Didot',
    category: 'serif',
    os: 'macOS',
    stack: 'Didot, "Bodoni MT", "Times New Roman", Times, serif',
  },
  {
    label: 'Bodoni MT',
    category: 'serif',
    os: 'Windows',
    stack: '"Bodoni MT", Didot, "Times New Roman", serif',
  },
  {
    label: 'Century Schoolbook',
    category: 'serif',
    os: 'Windows/macOS',
    stack: '"Century Schoolbook", Georgia, "Times New Roman", serif',
  },
  {
    label: 'Rockwell (slab)',
    category: 'serif',
    os: 'Windows',
    stack: 'Rockwell, "Courier New", Georgia, serif',
  },
  {
    label: 'Bookman Old Style',
    category: 'serif',
    os: 'Windows',
    stack: '"Bookman Old Style", Bookman, Georgia, serif',
  },

  /* =========================
     MONOSPACE — SYSTEM / WEB-SAFE
     ========================= */
  {
    label: 'Courier New',
    category: 'mono',
    os: 'multi',
    stack: '"Courier New", Courier, monospace',
  },
  {
    label: 'Courier',
    category: 'mono',
    os: 'multi',
    stack: 'Courier, "Courier New", monospace',
  },
  {
    label: 'Consolas',
    category: 'mono',
    os: 'Windows',
    stack:
      'Consolas, "Lucida Console", Monaco, "Courier New", Courier, monospace',
  },
  {
    label: 'Lucida Console',
    category: 'mono',
    os: 'Windows',
    stack: '"Lucida Console", Monaco, "Courier New", monospace',
  },
  {
    label: 'Monaco',
    category: 'mono',
    os: 'macOS',
    stack: 'Monaco, "Lucida Console", Consolas, monospace',
  },
  {
    label: 'Menlo',
    category: 'mono',
    os: 'macOS',
    stack:
      'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    label: 'SF Mono',
    category: 'mono',
    os: 'macOS',
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    label: 'DejaVu Sans Mono',
    category: 'mono',
    os: 'Linux',
    stack: '"DejaVu Sans Mono", "Liberation Mono", Menlo, Consolas, monospace',
  },
  {
    label: 'Liberation Mono',
    category: 'mono',
    os: 'Linux',
    stack: '"Liberation Mono", "DejaVu Sans Mono", Consolas, monospace',
  },
  {
    label: 'Andale Mono',
    category: 'mono',
    os: 'multi',
    stack: '"Andale Mono", Monaco, "Lucida Console", monospace',
  },

  /* =========================
     DISPLAY / DECORATIVE
     ========================= */
  {
    label: 'Arial Black',
    category: 'display',
    os: 'multi',
    stack: '"Arial Black", Arial, Helvetica, sans-serif',
  },
  {
    label: 'Impact',
    category: 'display',
    os: 'multi',
    stack: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  },
  {
    label: 'Copperplate',
    category: 'display',
    os: 'macOS',
    stack:
      'Copperplate, "Copperplate Gothic Light", "Palatino Linotype", Georgia, serif',
  },
  {
    label: 'Trajan (fallbacky)',
    category: 'display',
    os: 'Win/macOS',
    stack: 'Trajan, "Times New Roman", Times, serif',
  },

  /* =========================
     HANDWRITING / SCRIPT
     ========================= */
  {
    label: 'Comic Sans MS',
    category: 'handwriting',
    os: 'multi',
    stack: '"Comic Sans MS", "Comic Sans", "Trebuchet MS", cursive, sans-serif',
  },
  {
    label: 'Brush Script MT',
    category: 'handwriting',
    os: 'multi',
    stack: '"Brush Script MT", cursive',
  },
  {
    label: 'Lucida Handwriting',
    category: 'handwriting',
    os: 'Windows',
    stack: '"Lucida Handwriting", "Segoe Script", "Comic Sans MS", cursive',
  },
  {
    label: 'Bradley Hand',
    category: 'handwriting',
    os: 'macOS',
    stack: '"Bradley Hand", "Chalkboard SE", "Comic Sans MS", cursive',
  },
  {
    label: 'Chalkboard',
    category: 'handwriting',
    os: 'macOS',
    stack: '"Chalkboard", "Comic Sans MS", cursive',
  },
  {
    label: 'Chalkduster',
    category: 'handwriting',
    os: 'macOS',
    stack: 'Chalkduster, "Comic Sans MS", cursive',
  },
  {
    label: 'Segoe Script',
    category: 'handwriting',
    os: 'Windows',
    stack: '"Segoe Script", "Lucida Handwriting", cursive',
  },
  {
    label: 'Snell Roundhand',
    category: 'handwriting',
    os: 'macOS',
    stack: '"Snell Roundhand", "Brush Script MT", cursive',
  },
  {
    label: 'Papyrus',
    category: 'handwriting',
    os: 'multi',
    stack: 'Papyrus, "Palatino Linotype", Georgia, serif',
  },

  /* =========================
     SYMBOL / EMOJI
     ========================= */
  {
    label: 'Segoe UI Emoji',
    category: 'emoji',
    os: 'Windows',
    stack:
      '"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Apple Color Emoji"',
  },
  {
    label: 'Apple Color Emoji',
    category: 'emoji',
    os: 'macOS/iOS',
    stack: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"',
  },
  {
    label: 'Noto Color Emoji',
    category: 'emoji',
    os: 'Android/Linux',
    stack: '"Noto Color Emoji", "Segoe UI Emoji", "Apple Color Emoji"',
  },

  /* =========================
     CJK — CHIŃSKIE / JAPOŃSKIE / KOREAŃSKIE
     (tylko jeśli obecne w systemie; zapewniamy sensowne fallbacki)
     ========================= */
  // CHIŃSKIE (zh-CN / zh-TW)
  {
    label: 'Microsoft YaHei (SC)',
    category: 'cjk',
    os: 'Windows',
    stack:
      '"Microsoft YaHei", "Noto Sans CJK SC", "PingFang SC", "Hiragino Sans GB", "Heiti SC", Arial, sans-serif',
  },
  {
    label: 'Microsoft JhengHei (TC)',
    category: 'cjk',
    os: 'Windows',
    stack:
      '"Microsoft JhengHei", "PingFang TC", "Noto Sans CJK TC", "Heiti TC", Arial, sans-serif',
  },
  {
    label: 'SimSun (SC serif)',
    category: 'cjk',
    os: 'Windows',
    stack: 'SimSun, "Songti SC", "Noto Serif CJK SC", serif',
  },
  {
    label: 'PMingLiU / MingLiU (TC serif)',
    category: 'cjk',
    os: 'Windows',
    stack: 'PMingLiU, MingLiU, "Songti TC", "Noto Serif CJK TC", serif',
  },

  // JAPOŃSKIE
  {
    label: 'Meiryo',
    category: 'cjk',
    os: 'Windows',
    stack:
      'Meiryo, "Yu Gothic", "Hiragino Kaku Gothic Pro", "Noto Sans CJK JP", Osaka, Arial, sans-serif',
  },
  {
    label: 'Yu Gothic',
    category: 'cjk',
    os: 'Windows',
    stack:
      '"Yu Gothic", Meiryo, "Hiragino Kaku Gothic Pro", "Noto Sans CJK JP", Osaka, sans-serif',
  },
  {
    label: 'MS Gothic',
    category: 'cjk',
    os: 'Windows',
    stack:
      '"MS Gothic", "MS PGothic", "Noto Sans Mono CJK JP", monospace, sans-serif',
  },
  {
    label: 'Hiragino Sans',
    category: 'cjk',
    os: 'macOS',
    stack:
      '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans CJK JP", sans-serif',
  },
  {
    label: 'Hiragino Mincho (serif)',
    category: 'cjk',
    os: 'macOS',
    stack: '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif CJK JP", serif',
  },

  // KOREAŃSKIE
  {
    label: 'Malgun Gothic',
    category: 'cjk',
    os: 'Windows',
    stack:
      '"Malgun Gothic", Gulim, Dotum, "Apple SD Gothic Neo", "Noto Sans CJK KR", Arial, sans-serif',
  },
  {
    label: 'Gulim / Dotum',
    category: 'cjk',
    os: 'Windows',
    stack:
      'Gulim, Dotum, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans CJK KR", sans-serif',
  },
  {
    label: 'Apple SD Gothic Neo',
    category: 'cjk',
    os: 'macOS/iOS',
    stack:
      '"Apple SD Gothic Neo", "Nanum Gothic", "Noto Sans CJK KR", Arial, sans-serif',
  },

  /* =========================
     ARABIC / HEBREW / DEVANAGARI — WYBRANE STACKI SYSTEMOWE
     ========================= */
  {
    label: 'Geeza Pro (Arabic, macOS)',
    category: 'arabic',
    os: 'macOS',
    stack: '"Geeza Pro", "Noto Naskh Arabic", Tahoma, Arial, sans-serif',
  },
  {
    label: 'Arabic Typesetting (Windows)',
    category: 'arabic',
    os: 'Windows',
    stack:
      '"Arabic Typesetting", "Traditional Arabic", Tahoma, Arial, sans-serif',
  },
  {
    label: 'Arial (Arabic support)',
    category: 'arabic',
    os: 'multi',
    stack: 'Arial, Tahoma, "Noto Naskh Arabic", sans-serif',
  },

  {
    label: 'Arial Hebrew (Hebrew, macOS)',
    category: 'hebrew',
    os: 'macOS',
    stack: '"Arial Hebrew", Arial, "Noto Sans Hebrew", sans-serif',
  },
  {
    label: 'Narkisim (Hebrew, Windows)',
    category: 'hebrew',
    os: 'Windows',
    stack: 'Narkisim, "Arial Hebrew", Arial, "Noto Sans Hebrew", sans-serif',
  },

  {
    label: 'Kohinoor Devanagari (macOS)',
    category: 'devanagari',
    os: 'macOS',
    stack: '"Kohinoor Devanagari", "Noto Sans Devanagari", Arial, sans-serif',
  },
  {
    label: 'Mangal (Windows, Devanagari)',
    category: 'devanagari',
    os: 'Windows',
    stack: 'Mangal, "Noto Sans Devanagari", Arial, sans-serif',
  },
];

/* Ułatwienia (opcjonalne) */
// Zbiór samych stacków (np. do <datalist>)
export const FONT_STACKS_ONLY = FONT_STACKS.map((f) => f.stack);

// Zgrupowane po kategorii
export const FONT_STACKS_BY_CATEGORY = FONT_STACKS.reduce((acc, f) => {
  (acc[f.category] ||= []).push(f);
  return acc;
}, {});

// Domyślny export
export default FONT_STACKS;

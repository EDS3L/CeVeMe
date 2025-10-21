// fontStacks.js
// Zestaw tylko z Google Fonts (pierwszy człon stacka = nazwa z GF)

export const FONT_STACKS = [
  /* =========================
     SANS-SERIF — GOOGLE FONTS
     ========================= */
  {
    label: 'Inter',
    category: 'sans',
    os: 'google',
    stack: 'Inter, Arial, sans-serif',
  },
  {
    label: 'Roboto',
    category: 'sans',
    os: 'google',
    stack: 'Roboto, Arial, sans-serif',
  },
  {
    label: 'Open Sans',
    category: 'sans',
    os: 'google',
    stack: '"Open Sans", Arial, sans-serif',
  },
  {
    label: 'Montserrat',
    category: 'sans',
    os: 'google',
    stack: 'Montserrat, Arial, sans-serif',
  },
  {
    label: 'Poppins',
    category: 'sans',
    os: 'google',
    stack: 'Poppins, Arial, sans-serif',
  },
  {
    label: 'Lato',
    category: 'sans',
    os: 'google',
    stack: 'Lato, Arial, sans-serif',
  },
  {
    label: 'Nunito',
    category: 'sans',
    os: 'google',
    stack: 'Nunito, Arial, sans-serif',
  },
  {
    label: 'Source Sans 3',
    category: 'sans',
    os: 'google',
    stack: '"Source Sans 3", Arial, sans-serif',
  },
  {
    label: 'Work Sans',
    category: 'sans',
    os: 'google',
    stack: '"Work Sans", Arial, sans-serif',
  },
  {
    label: 'Mulish',
    category: 'sans',
    os: 'google',
    stack: 'Mulish, Arial, sans-serif',
  },
  {
    label: 'DM Sans',
    category: 'sans',
    os: 'google',
    stack: '"DM Sans", Arial, sans-serif',
  },
  {
    label: 'IBM Plex Sans',
    category: 'sans',
    os: 'google',
    stack: '"IBM Plex Sans", Arial, sans-serif',
  },
  {
    label: 'Rubik',
    category: 'sans',
    os: 'google',
    stack: 'Rubik, Arial, sans-serif',
  },
  {
    label: 'Raleway',
    category: 'sans',
    os: 'google',
    stack: 'Raleway, Arial, sans-serif',
  },
  {
    label: 'Ubuntu',
    category: 'sans',
    os: 'google',
    stack: 'Ubuntu, Arial, sans-serif',
  },
  {
    label: 'Urbanist',
    category: 'sans',
    os: 'google',
    stack: 'Urbanist, Arial, sans-serif',
  },

  /* =========================
     SERIF — GOOGLE FONTS
     ========================= */
  {
    label: 'Lora',
    category: 'serif',
    os: 'google',
    stack: 'Lora, Times, serif',
  },
  {
    label: 'Merriweather',
    category: 'serif',
    os: 'google',
    stack: 'Merriweather, Georgia, serif',
  },
  {
    label: 'Playfair Display',
    category: 'serif',
    os: 'google',
    stack: '"Playfair Display", Times, serif',
  },
  {
    label: 'Source Serif 4',
    category: 'serif',
    os: 'google',
    stack: '"Source Serif 4", Georgia, serif',
  },
  {
    label: 'PT Serif',
    category: 'serif',
    os: 'google',
    stack: '"PT Serif", Georgia, serif',
  },
  {
    label: 'Crimson Text',
    category: 'serif',
    os: 'google',
    stack: '"Crimson Text", Georgia, serif',
  },
  {
    label: 'Libre Baskerville',
    category: 'serif',
    os: 'google',
    stack: '"Libre Baskerville", Georgia, serif',
  },
  {
    label: 'Cormorant Garamond',
    category: 'serif',
    os: 'google',
    stack: '"Cormorant Garamond", Georgia, serif',
  },

  /* =========================
     MONOSPACE — GOOGLE FONTS
     ========================= */
  {
    label: 'Roboto Mono',
    category: 'mono',
    os: 'google',
    stack: '"Roboto Mono", ui-monospace, monospace',
  },
  {
    label: 'Source Code Pro',
    category: 'mono',
    os: 'google',
    stack: '"Source Code Pro", ui-monospace, monospace',
  },
  {
    label: 'Fira Code',
    category: 'mono',
    os: 'google',
    stack: '"Fira Code", ui-monospace, monospace',
  },
  {
    label: 'JetBrains Mono',
    category: 'mono',
    os: 'google',
    stack: '"JetBrains Mono", ui-monospace, monospace',
  },
  {
    label: 'Inconsolata',
    category: 'mono',
    os: 'google',
    stack: 'Inconsolata, ui-monospace, monospace',
  },
  {
    label: 'IBM Plex Mono',
    category: 'mono',
    os: 'google',
    stack: '"IBM Plex Mono", ui-monospace, monospace',
  },
  {
    label: 'Space Mono',
    category: 'mono',
    os: 'google',
    stack: '"Space Mono", ui-monospace, monospace',
  },

  /* =========================
     DISPLAY / DECORATIVE — GOOGLE FONTS
     ========================= */
  {
    label: 'Oswald',
    category: 'display',
    os: 'google',
    stack: 'Oswald, Arial, sans-serif',
  },
  {
    label: 'Bebas Neue',
    category: 'display',
    os: 'google',
    stack: '"Bebas Neue", Arial, sans-serif',
  },
  {
    label: 'Anton',
    category: 'display',
    os: 'google',
    stack: 'Anton, Arial, sans-serif',
  },
  {
    label: 'Righteous',
    category: 'display',
    os: 'google',
    stack: 'Righteous, Arial, sans-serif',
  },
  {
    label: 'Abril Fatface',
    category: 'display',
    os: 'google',
    stack: '"Abril Fatface", Georgia, serif',
  },
  {
    label: 'Bangers',
    category: 'display',
    os: 'google',
    stack: 'Bangers, Arial, sans-serif',
  },
  {
    label: 'Archivo Black',
    category: 'display',
    os: 'google',
    stack: '"Archivo Black", Arial, sans-serif',
  },
  {
    label: 'Staatliches',
    category: 'display',
    os: 'google',
    stack: 'Staatliches, Arial, sans-serif',
  },

  /* =========================
     HANDWRITING / SCRIPT — GOOGLE FONTS
     ========================= */
  {
    label: 'Caveat',
    category: 'handwriting',
    os: 'google',
    stack: 'Caveat, "Comic Sans MS", cursive',
  },
  {
    label: 'Dancing Script',
    category: 'handwriting',
    os: 'google',
    stack: '"Dancing Script", "Comic Sans MS", cursive',
  },
  {
    label: 'Pacifico',
    category: 'handwriting',
    os: 'google',
    stack: 'Pacifico, "Comic Sans MS", cursive',
  },
  {
    label: 'Great Vibes',
    category: 'handwriting',
    os: 'google',
    stack: '"Great Vibes", "Comic Sans MS", cursive',
  },
  {
    label: 'Satisfy',
    category: 'handwriting',
    os: 'google',
    stack: 'Satisfy, "Comic Sans MS", cursive',
  },
  {
    label: 'Courgette',
    category: 'handwriting',
    os: 'google',
    stack: 'Courgette, "Comic Sans MS", cursive',
  },

  /* =========================
     CJK — GOOGLE FONTS (Noto)
     ========================= */
  {
    label: 'Noto Sans JP',
    category: 'cjk',
    os: 'google',
    stack:
      '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
  },
  {
    label: 'Noto Serif JP',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Serif JP", "Yu Mincho", serif',
  },
  {
    label: 'Noto Sans KR',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  },
  {
    label: 'Noto Serif KR',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Serif KR", "Batang", serif',
  },
  {
    label: 'Noto Sans SC',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
  {
    label: 'Noto Serif SC',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Serif SC", "Songti SC", serif',
  },
  {
    label: 'Noto Sans TC',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
  },
  {
    label: 'Noto Serif TC',
    category: 'cjk',
    os: 'google',
    stack: '"Noto Serif TC", "Songti TC", serif',
  },
];

/* Ułatwienia (jak u Ciebie) */
export const FONT_STACKS_ONLY = FONT_STACKS.map((f) => f.stack);

export const FONT_STACKS_BY_CATEGORY = FONT_STACKS.reduce((acc, f) => {
  (acc[f.category] ||= []).push(f);
  return acc;
}, {});

export default FONT_STACKS;

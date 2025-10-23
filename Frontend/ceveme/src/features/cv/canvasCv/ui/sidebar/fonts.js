// src/fonts/fontStacks.js
// Zestaw tylko z Google Fonts (pierwszy człon stacka = nazwa z GF)

export const FONT_STACKS = [
  /* =========================
     SANS-SERIF — GOOGLE FONTS
     ========================= */
  { label: 'Inter', family: 'Inter', category: 'sans', os: 'google', stack: 'Inter, Arial, sans-serif' },
  { label: 'Roboto', family: 'Roboto', category: 'sans', os: 'google', stack: 'Roboto, Arial, sans-serif' },
  { label: 'Open Sans', family: 'Open Sans', category: 'sans', os: 'google', stack: '"Open Sans", Arial, sans-serif' },
  { label: 'Montserrat', family: 'Montserrat', category: 'sans', os: 'google', stack: 'Montserrat, Arial, sans-serif' },
  { label: 'Poppins', family: 'Poppins', category: 'sans', os: 'google', stack: 'Poppins, Arial, sans-serif' },
  { label: 'Lato', family: 'Lato', category: 'sans', os: 'google', stack: 'Lato, Arial, sans-serif' },
  { label: 'Nunito', family: 'Nunito', category: 'sans', os: 'google', stack: 'Nunito, Arial, sans-serif' },
  { label: 'Source Sans 3', family: 'Source Sans 3', category: 'sans', os: 'google', stack: '"Source Sans 3", Arial, sans-serif' },
  { label: 'Work Sans', family: 'Work Sans', category: 'sans', os: 'google', stack: '"Work Sans", Arial, sans-serif' },
  { label: 'Mulish', family: 'Mulish', category: 'sans', os: 'google', stack: 'Mulish, Arial, sans-serif' },
  { label: 'DM Sans', family: 'DM Sans', category: 'sans', os: 'google', stack: '"DM Sans", Arial, sans-serif' },
  { label: 'IBM Plex Sans', family: 'IBM Plex Sans', category: 'sans', os: 'google', stack: '"IBM Plex Sans", Arial, sans-serif' },
  { label: 'Rubik', family: 'Rubik', category: 'sans', os: 'google', stack: 'Rubik, Arial, sans-serif' },
  { label: 'Raleway', family: 'Raleway', category: 'sans', os: 'google', stack: 'Raleway, Arial, sans-serif' },
  { label: 'Ubuntu', family: 'Ubuntu', category: 'sans', os: 'google', stack: 'Ubuntu, Arial, sans-serif' },
  { label: 'Urbanist', family: 'Urbanist', category: 'sans', os: 'google', stack: 'Urbanist, Arial, sans-serif' },

  /* =========================
     SERIF — GOOGLE FONTS
     ========================= */
  { label: 'Lora', family: 'Lora', category: 'serif', os: 'google', stack: 'Lora, Times, serif' },
  { label: 'Merriweather', family: 'Merriweather', category: 'serif', os: 'google', stack: 'Merriweather, Georgia, serif' },
  { label: 'Playfair Display', family: 'Playfair Display', category: 'serif', os: 'google', stack: '"Playfair Display", Times, serif' },
  { label: 'Source Serif 4', family: 'Source Serif 4', category: 'serif', os: 'google', stack: '"Source Serif 4", Georgia, serif' },
  { label: 'PT Serif', family: 'PT Serif', category: 'serif', os: 'google', stack: '"PT Serif", Georgia, serif' },
  { label: 'Crimson Text', family: 'Crimson Text', category: 'serif', os: 'google', stack: '"Crimson Text", Georgia, serif' },
  { label: 'Libre Baskerville', family: 'Libre Baskerville', category: 'serif', os: 'google', stack: '"Libre Baskerville", Georgia, serif' },
  { label: 'Cormorant Garamond', family: 'Cormorant Garamond', category: 'serif', os: 'google', stack: '"Cormorant Garamond", Georgia, serif' },

  /* =========================
     MONOSPACE — GOOGLE FONTS
     ========================= */
  { label: 'Roboto Mono', family: 'Roboto Mono', category: 'mono', os: 'google', stack: '"Roboto Mono", ui-monospace, monospace' },
  { label: 'Source Code Pro', family: 'Source Code Pro', category: 'mono', os: 'google', stack: '"Source Code Pro", ui-monospace, monospace' },
  { label: 'Fira Code', family: 'Fira Code', category: 'mono', os: 'google', stack: '"Fira Code", ui-monospace, monospace' },
  { label: 'JetBrains Mono', family: 'JetBrains Mono', category: 'mono', os: 'google', stack: '"JetBrains Mono", ui-monospace, monospace' },
  { label: 'Inconsolata', family: 'Inconsolata', category: 'mono', os: 'google', stack: 'Inconsolata, ui-monospace, monospace' },
  { label: 'IBM Plex Mono', family: 'IBM Plex Mono', category: 'mono', os: 'google', stack: '"IBM Plex Mono", ui-monospace, monospace' },
  { label: 'Space Mono', family: 'Space Mono', category: 'mono', os: 'google', stack: '"Space Mono", ui-monospace, monospace' },

  /* =========================
     DISPLAY / DECORATIVE — GOOGLE FONTS
     ========================= */
  { label: 'Oswald', family: 'Oswald', category: 'display', os: 'google', stack: 'Oswald, Arial, sans-serif' },
  { label: 'Bebas Neue', family: 'Bebas Neue', category: 'display', os: 'google', stack: '"Bebas Neue", Arial, sans-serif' },
  { label: 'Anton', family: 'Anton', category: 'display', os: 'google', stack: 'Anton, Arial, sans-serif' },
  { label: 'Righteous', family: 'Righteous', category: 'display', os: 'google', stack: 'Righteous, Arial, sans-serif' },
  { label: 'Abril Fatface', family: 'Abril Fatface', category: 'display', os: 'google', stack: '"Abril Fatface", Georgia, serif' },
  { label: 'Bangers', family: 'Bangers', category: 'display', os: 'google', stack: 'Bangers, Arial, sans-serif' },
  { label: 'Archivo Black', family: 'Archivo Black', category: 'display', os: 'google', stack: '"Archivo Black", Arial, sans-serif' },
  { label: 'Staatliches', family: 'Staatliches', category: 'display', os: 'google', stack: 'Staatliches, Arial, sans-serif' },

  /* =========================
     HANDWRITING / SCRIPT — GOOGLE FONTS
     ========================= */
  { label: 'Caveat', family: 'Caveat', category: 'handwriting', os: 'google', stack: 'Caveat, "Comic Sans MS", cursive' },
  { label: 'Dancing Script', family: 'Dancing Script', category: 'handwriting', os: 'google', stack: '"Dancing Script", "Comic Sans MS", cursive' },
  { label: 'Pacifico', family: 'Pacifico', category: 'handwriting', os: 'google', stack: 'Pacifico, "Comic Sans MS", cursive' },
  { label: 'Great Vibes', family: 'Great Vibes', category: 'handwriting', os: 'google', stack: '"Great Vibes", "Comic Sans MS", cursive' },
  { label: 'Satisfy', family: 'Satisfy', category: 'handwriting', os: 'google', stack: 'Satisfy, "Comic Sans MS", cursive' },
  { label: 'Courgette', family: 'Courgette', category: 'handwriting', os: 'google', stack: 'Courgette, "Comic Sans MS", cursive' },

  /* =========================
     CJK — GOOGLE FONTS (Noto)
     ========================= */
  { label: 'Noto Sans JP', family: 'Noto Sans JP', category: 'cjk', os: 'google', stack: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif' },
  { label: 'Noto Serif JP', family: 'Noto Serif JP', category: 'cjk', os: 'google', stack: '"Noto Serif JP", "Yu Mincho", serif' },
  { label: 'Noto Sans KR', family: 'Noto Sans KR', category: 'cjk', os: 'google', stack: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif' },
  { label: 'Noto Serif KR', family: 'Noto Serif KR', category: 'cjk', os: 'google', stack: '"Noto Serif KR", "Batang", serif' },
  { label: 'Noto Sans SC', family: 'Noto Sans SC', category: 'cjk', os: 'google', stack: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif' },
  { label: 'Noto Serif SC', family: 'Noto Serif SC', category: 'cjk', os: 'google', stack: '"Noto Serif SC", "Songti SC", serif' },
  { label: 'Noto Sans TC', family: 'Noto Sans TC', category: 'cjk', os: 'google', stack: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif' },
  { label: 'Noto Serif TC', family: 'Noto Serif TC', category: 'cjk', os: 'google', stack: '"Noto Serif TC", "Songti TC", serif' },
];

/* Ułatwienia (jak u Ciebie) */
export const FONT_STACKS_ONLY = FONT_STACKS.map((f) => f.stack);

export const FONT_STACKS_BY_CATEGORY = FONT_STACKS.reduce((acc, f) => {
  (acc[f.category] ||= []).push(f);
  return acc;
}, {});

export default FONT_STACKS;

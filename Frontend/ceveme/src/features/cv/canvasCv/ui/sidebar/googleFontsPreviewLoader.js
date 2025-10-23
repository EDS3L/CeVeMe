// ⬇️ LEKKI LOADER DO PODGLĄDU — teraz z pełnym charsetem do preview + literami etykiety
const previewInflight = new Map(); // "Family|400|i0|text=..." -> Promise

function toCss2Family(f) {
  return String(f || '').trim().replace(/\s+/g, '+');
}
function normalizeWeight(w) {
  const n = parseInt(w, 10);
  if (Number.isFinite(n)) return Math.min(900, Math.max(100, n));
  return w === 'bold' ? 700 : 400;
}
function addPreconnects() {
  for (const href of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
    if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
      const l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = href;
      l.crossOrigin = 'anonymous';
      document.head.appendChild(l);
    }
  }
}

// Bazowy charset do podglądu: PL + EN + cyfry + kilka znaków interpunkcyjnych i spacja
const BASE_PREVIEW_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
  'ĄąĆćĘęŁłŃńÓóŚśŹźŻż' +
  '0123456789' +
  ' -_()[]{}.,:;!?„”"\'/\\+&@#%';

function uniqChars(s) {
  return Array.from(new Set(String(s || ''))).join('');
}

function injectCssLinkPreview(href) {
  if (document.querySelector(`link[data-gf-preview="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-gf-preview', href);
  document.head.appendChild(link);
}

function buildCssHrefPreview(family, weight = 400, italic = false, text = '') {
  const fam = toCss2Family(family);
  const w = normalizeWeight(weight);
  const axis = italic ? 'ital,wght@' : 'wght@';
  const vals = italic ? `1,${w}` : `${w}`;

  // Do subsetu bierzemy bazowy charset + to, co poda UI (np. etykieta + sample)
  const subset = uniqChars(BASE_PREVIEW_CHARSET + String(text || ''));
  const encoded = encodeURIComponent(subset);

  // display=swap -> fallback natychmiast, szybka podmiana na subset
  return `https://fonts.googleapis.com/css2?family=${fam}:${axis}${vals}&display=swap&text=${encoded}`;
}

/**
 * Ładuje LEKKI subset (tylko znaki z bazowego charsetu + `text`) jednej rodziny — do PODGLĄDU.
 * Uwaga: to nie ściąga kompletnych plików. Do pełnego użycia dalej wołaj ensureGoogleFont z loadera „pełnego”.
 */
export async function ensureGoogleFontPreview(
  family,
  { weight = 400, italic = false, text = '' } = {}
) {
  if (!family) return;
  addPreconnects();

  const key = `${family}|${normalizeWeight(weight)}|i${italic ? 1 : 0}|text=${text}`;
  if (previewInflight.has(key)) return previewInflight.get(key);

  const href = buildCssHrefPreview(family, weight, italic, text);
  injectCssLinkPreview(href);

  const p = (async () => {
    try {
      const s = `${italic ? 'italic ' : ''}${normalizeWeight(weight)} 1em "${family}"`;
      await document.fonts.load(s);
    } catch {}
  })();

  previewInflight.set(key, p);
  try {
    await p;
  } finally {
    previewInflight.delete(key);
  }
}

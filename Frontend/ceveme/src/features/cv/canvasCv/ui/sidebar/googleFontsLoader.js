// src/fonts/googleFontsLoader.js
const LS_KEY = 'GF_LAST_USED_V1'; // { family: { weights:[...], italic:true/false, ts:number }, ... }
const MAX_FAMILIES_REMEMBERED = 24; // LRU limit
const inflight = new Map(); // "Family|400,700|i0" -> Promise
const loaded = new Map(); // family -> {weights:Set<number>, italic:Set<0|1>}
let preconnected = false;

function toCss2Family(f) {
  return String(f || '')
    .trim()
    .replace(/\s+/g, '+');
}
function normalizeWeight(w) {
  const n = parseInt(w, 10);
  if (Number.isFinite(n)) return Math.min(900, Math.max(100, n));
  return w === 'bold' ? 700 : 400;
}
function weightsToParam(arr) {
  const uniq = [...new Set((arr || []).map(normalizeWeight))].sort(
    (a, b) => a - b
  );
  return uniq.length ? uniq : [400];
}
function buildCssHrefSingle(family, weights = [400], italic = false) {
  const fam = toCss2Family(family);
  const w = weightsToParam(weights);
  const axis = italic ? 'ital,wght@' : 'wght@';
  const vals = italic ? w.map((v) => `1,${v}`).join(';') : w.join(';');
  return `https://fonts.googleapis.com/css2?family=${fam}:${axis}${vals}&display=swap`;
}
function buildCssHrefMulti(requests /* [{family, weights, italic}] */) {
  const parts = requests.map((r) => {
    const fam = toCss2Family(r.family);
    const w = weightsToParam(r.weights);
    const axis = r.italic ? 'ital,wght@' : 'wght@';
    const vals = r.italic ? w.map((v) => `1,${v}`).join(';') : w.join(';');
    return `family=${fam}:${axis}${vals}`;
  });
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

function addPreconnects() {
  if (preconnected) return;
  preconnected = true;
  for (const href of [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]) {
    if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
      const l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = href;
      l.crossOrigin = 'anonymous';
      document.head.appendChild(l);
    }
  }
}

function injectCssLink(href) {
  if (document.querySelector(`link[data-gf="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-gf', href);
  document.head.appendChild(link);
}

async function waitVariant(family, weight = 400, italic = false) {
  const s = `${italic ? 'italic ' : ''}${normalizeWeight(
    weight
  )} 1em "${family}"`;
  try {
    await document.fonts.load(s);
  } catch {}
}

function keyFor(family, weights, italic) {
  return `${family}|${weightsToParam(weights).join(',')}|i${italic ? 1 : 0}`;
}

function readLRU() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    return {};
  }
}
function writeLRU(obj) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch {}
}
function remember(family, weights = [400], italic = false) {
  const lru = readLRU();
  const now = Date.now();
  const prev = lru[family] || { weights: [], italic: false, ts: 0 };
  const mergedWeights = [
    ...new Set([...(prev.weights || []), ...weightsToParam(weights)]),
  ];
  const mergedItalic = Boolean(prev.italic || italic);
  lru[family] = { weights: mergedWeights, italic: mergedItalic, ts: now };

  // LRU trim
  const entries = Object.entries(lru).sort((a, b) => b[1].ts - a[1].ts);
  const trimmed = entries.slice(0, MAX_FAMILIES_REMEMBERED);
  const out = Object.fromEntries(trimmed);
  writeLRU(out);
}

function markLoaded(family, weights = [400], italic = false) {
  const e = loaded.get(family) || { weights: new Set(), italic: new Set() };
  for (const w of weightsToParam(weights)) e.weights.add(w);
  e.italic.add(italic ? 1 : 0);
  loaded.set(family, e);
}

function isLoaded(family, weight = 400, italic = false) {
  const e = loaded.get(family);
  if (!e) return false;
  return e.weights.has(normalizeWeight(weight)) && e.italic.has(italic ? 1 : 0);
}

/** Ładuje jedną rodzinę (dedupe + cache + waitForFont) */
export async function ensureGoogleFont(
  family,
  weights = [400],
  italic = false
) {
  addPreconnects();
  const k = keyFor(family, weights, italic);
  if (inflight.has(k)) return inflight.get(k);

  // jeżeli wszystkie warianty są już załadowane – kończymy
  const allLoaded = weightsToParam(weights).every((w) =>
    isLoaded(family, w, italic)
  );
  if (allLoaded) return Promise.resolve();

  const href = buildCssHrefSingle(family, weights, italic);
  injectCssLink(href);

  const p = (async () => {
    // poczekaj na każdą odmianę
    await Promise.all(
      weightsToParam(weights).map((w) => waitVariant(family, w, italic))
    );
    markLoaded(family, weights, italic);
    remember(family, weights, italic);
  })();

  inflight.set(k, p);
  try {
    await p;
  } finally {
    inflight.delete(k);
  }
}

/** Ładuje hurtowo wiele rodzin w jednym CSS2 request (szybciej) */
export async function ensureManyGoogleFonts(
  requests /* [{family, weights, italic}] */
) {
  addPreconnects();
  const need = [];
  for (const r of requests) {
    const ws = weightsToParam(r.weights);
    const pending = ws.some((w) => !isLoaded(r.family, w, !!r.italic));
    if (pending)
      need.push({ family: r.family, weights: ws, italic: !!r.italic });
  }
  if (!need.length) return;

  const href = buildCssHrefMulti(need);
  injectCssLink(href);
  await Promise.all(
    need.flatMap((r) =>
      r.weights.map((w) => waitVariant(r.family, w, r.italic))
    )
  );
  for (const r of need) {
    markLoaded(r.family, r.weights, r.italic);
    remember(r.family, r.weights, r.italic);
  }
}

/** Skanuje Twój doc.nodes i robi warm-up wszystkich używanych rodzin/wag */
export async function warmupFontsFromDoc(doc) {
  if (!doc || !Array.isArray(doc.nodes)) return;
  const map = new Map(); // family -> {weights:Set, italic:boolean}
  for (const n of doc.nodes) {
    if (n.type !== 'text') continue;
    const ts = n.textStyle || {};
    const fam = (ts.fontFamily || '')
      .split(',')[0]
      ?.replace(/(^"|"$)/g, '')
      .trim();
    if (!fam) continue;
    const w = normalizeWeight(ts.fontWeight || 400);
    const i = (ts.fontStyle || 'normal') === 'italic';
    const rec = map.get(fam) || { weights: new Set(), italic: false };
    rec.weights.add(w);
    rec.italic = rec.italic || i;
    map.set(fam, rec);
  }
  const req = [...map.entries()].map(([family, v]) => ({
    family,
    weights: [...v.weights],
    italic: v.italic,
  }));
  await ensureManyGoogleFonts(req);
}

/** Z pamięci LRU preładuje ostatnio używane rodziny (idle) */
export function warmupFontsFromCacheIdle() {
  addPreconnects();
  const lru = readLRU();
  const req = Object.keys(lru)
    .sort((a, b) => lru[b].ts - lru[a].ts)
    .slice(0, 8) // nie przesadzaj
    .map((f) => ({
      family: f,
      weights: lru[f].weights,
      italic: lru[f].italic,
    }));
  if (!req.length) return;
  const run = () => ensureManyGoogleFonts(req).catch(() => {});
  if ('requestIdleCallback' in window)
    window.requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 300);
}

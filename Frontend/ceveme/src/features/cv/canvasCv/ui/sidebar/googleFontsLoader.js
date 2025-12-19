// googleFontsLoader.js — pełny loader ital,wght + lekki subsetowy podgląd

const loadedHrefs = new Set();
const previewInflight = new Map(); // "Family|400|i0|text=..." -> Promise

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
function addPreconnects() {
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
function injectCssLink(href, attr = 'data-gf') {
	if (loadedHrefs.has(href)) return;
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	link.setAttribute(attr, href);
	document.head.appendChild(link);
	loadedHrefs.add(href);
}

/** Pełny loader (użycie w dokumencie) */
export async function ensureGoogleFont(
	family,
	weights = [400, 700],
	italic = false
) {
	if (!family) return;
	addPreconnects();

	const uniq = Array.from(new Set(weights.map(normalizeWeight))).sort(
		(a, b) => a - b
	);
	const fam = toCss2Family(family);
	const axis = 'ital,wght@';
	const normalRow = `0,${uniq.join(';0,')}`; // roman
	const italicRow = `1,${uniq.join(';1,')}`; // italic
	const rows = italic ? `${normalRow};${italicRow}` : normalRow;

	const href = `https://fonts.googleapis.com/css2?family=${fam}:${axis}${rows}&display=swap`;
	injectCssLink(href, 'data-gf');

	const loads = [];
	for (const w of uniq) {
		loads.push(document.fonts.load(`${w} 1em "${family}"`));
		if (italic) loads.push(document.fonts.load(`italic ${w} 1em "${family}"`));
	}
	try {
		await Promise.allSettled(loads);
	} catch {}
}

/** 🔎 Lekki loader podglądu (subset przez &text=...) */
const BASE_PREVIEW_CHARSET =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
	'ĄąĆćĘęŁłŃńÓóŚśŹźŻż' +
	'0123456789' +
	' -_()[]{}.,:;!?„”"\'/\\+&@#%';

function uniqChars(s) {
	return Array.from(new Set(String(s || ''))).join('');
}

function buildCssHrefPreview(family, weight = 400, italic = false, text = '') {
	const fam = toCss2Family(family);
	const w = normalizeWeight(weight);
	const axis = italic ? 'ital,wght@' : 'wght@';
	const vals = italic ? `1,${w}` : `${w}`;
	const subset = uniqChars(BASE_PREVIEW_CHARSET + String(text || ''));
	const encoded = encodeURIComponent(subset);
	return `https://fonts.googleapis.com/css2?family=${fam}:${axis}${vals}&display=swap&text=${encoded}`;
}

export async function ensureGoogleFontPreview(
	family,
	{ weight = 400, italic = false, text = '' } = {}
) {
	if (!family) return;
	addPreconnects();
	const key = `${family}|${normalizeWeight(weight)}|i${
		italic ? 1 : 0
	}|text=${text}`;
	if (previewInflight.has(key)) return previewInflight.get(key);

	const href = buildCssHrefPreview(family, weight, italic, text);
	injectCssLink(href, 'data-gf-preview');

	const p = (async () => {
		try {
			const s = `${italic ? 'italic ' : ''}${normalizeWeight(
				weight
			)} 1em "${family}"`;
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

export default { ensureGoogleFont, ensureGoogleFontPreview };

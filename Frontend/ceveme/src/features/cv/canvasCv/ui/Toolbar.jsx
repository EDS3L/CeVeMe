import React, { useMemo, useRef, useState, useEffect } from 'react';
import { exportDocumentToPdf, openPdfPrint } from '../services/exportVector';
import AddElementDialog from './canva/AddElementDialog';
import SaveMenu from './canva/SaveMenu';
import { FONT_STACKS } from './sidebar/fonts';
import { ensureGoogleFont } from './sidebar/googleFontsLoader';
import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiItalic,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiFontSize2,
  RiPaletteLine,
  RiImageEditLine,
} from 'react-icons/ri';
import { FaFont } from 'react-icons/fa';

export default function Toolbar({
  doc,
  selectedId, // ⬅︎ dostajemy ID
  updateNode, // ⬅︎ i patcher
  addText,
  addImage,
  addRect,
  undo,
  redo,
  canUndo,
  canRedo,
  loading = false,
  showGrid = false,
  onToggleGrid = () => {},
  overflowMm = 0,
  onGenerateAndSave,
  onOpenGenerateModal,
}) {
  const [addOpen, setAddOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ⬇︎ WYLICZAMY ZAZNACZONY ELEMENT
  const n = useMemo(
    () =>
      (doc?.nodes || []).find((x) => String(x.id) === String(selectedId)) ||
      null,
    [doc?.nodes, selectedId]
  );

  const isText = n?.type === 'text';
  const isImage = n?.type === 'image';
  const isShape = n?.type === 'shape';

  const ts = useMemo(() => n?.textStyle || {}, [n]);
  const st = useMemo(() => n?.style || {}, [n]);

  const num = (v, d) => (typeof v === 'number' ? v : d);
  const patchText = (patch) => n && updateNode(n.id, { textStyle: patch });
  const patchStyle = (patch) => n && updateNode(n.id, { style: patch });
  const patchNode = (patch) => n && updateNode(n.id, patch);

  const changeFontSize = (delta) => {
    if (!isText) return;
    const next = Math.max(6, num(ts.fontSize, 12) + delta);
    patchText({ fontSize: next });
  };
  const toggleBold = () =>
    isText &&
    patchText({
      fontWeight:
        (typeof ts.fontWeight === 'number' ? ts.fontWeight : 400) >= 700
          ? 400
          : 700,
    });
  const toggleItalic = () =>
    isText &&
    patchText({ fontStyle: ts.fontStyle === 'italic' ? 'normal' : 'italic' });
  const setAlign = (align) => isText && patchText({ textAlign: align });

  const handleFontChange = async (e) => {
    if (!isText) return;
    const key = e.target.value;
    const item = FONT_STACKS.find((i) => i.label === key);
    if (!item) return;
    try {
      const wantItalic = ts.fontStyle === 'italic';
      const wantWeight =
        typeof ts.fontWeight === 'number' ? ts.fontWeight : 400;
      await ensureGoogleFont(item.family, [wantWeight, 700], wantItalic);
    } catch {}
    patchText({ fontFamily: item.stack });
  };

  const setSrcFromFile = async (file) => {
    if (!isImage || !file) return;
    try {
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      patchNode({ src: String(dataUrl) });
    } catch {
      const url = URL.createObjectURL(file);
      patchNode({ src: url });
    }
  };

  const IconBtn = ({ active, title, onClick, children }) => (
    <button
      onClick={onClick}
      title={title}
      className={`px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 ${
        active ? 'bg-slate-900 text-white hover:bg-slate-900' : ''
      }`}
    >
      <span className="w-5 h-5 inline-flex items-center justify-center">
        {children}
      </span>
    </button>
  );

  return (
    <>
      {/* fix na globalne resety svg */}
      <style>{`.toolbar svg{width:1.25rem;height:1.25rem;display:inline-block}.toolbar svg,.toolbar svg *{fill:currentColor!important;stroke:none!important}`}</style>

      <div className="toolbar sticky top-0 z-20 flex items-center gap-2 p-2 bg-white border-b border-black/10 overflow-x-auto">
        {/* LEWA */}
        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            onClick={() => setAddOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            Dodaj
          </button>

          <div className="w-px h-7 bg-black/10" />

          <button
            disabled={!canUndo || loading}
            onClick={undo}
            className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:bg-slate-900 hover:bg-slate-50 disabled:opacity-60"
            title="Cofnij"
          >
            <RiArrowGoBackLine />
          </button>
          <button
            disabled={!canRedo || loading}
            onClick={redo}
            className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            title="Ponów"
          >
            <RiArrowGoForwardLine />
          </button>

          <div className="w-px h-7 bg-black/10" />
          <button
            disabled={loading}
            onClick={onToggleGrid}
            className="px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            {showGrid ? 'Ukryj siatkę' : 'Pokaż siatkę'}
          </button>

          <span className="ml-2 px-2 py-1 text-[11px] rounded bg-slate-100 text-slate-600 border border-slate-200">
            sel: {selectedId ?? '—'} | found: {n ? 'yes' : 'no'}
            {n ? ` | type: ${n.type}` : ''}
          </span>
        </div>

        {/* ŚRODEK – KONTEKST */}
        <div className="flex items-center gap-2 mx-auto">
          {/* TEXT */}
          {isText && (
            <>
              <label className="flex items-center gap-2 px-2 py-1 rounded-lg border border-black/15 bg-white text-slate-700">
                <FaFont />
                <select
                  className="px-1 py-[6px] text-sm rounded-md outline-none"
                  value={
                    FONT_STACKS.find((i) => i.stack === n.textStyle?.fontFamily)
                      ?.label || ''
                  }
                  onChange={handleFontChange}
                >
                  <option value="">(system)</option>
                  {FONT_STACKS.map(({ label }) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="inline-flex items-stretch rounded-lg border border-black/15 overflow-hidden text-slate-700">
                <button
                  onClick={() => changeFontSize(-1)}
                  className="px-2 py-2 hover:bg-slate-50"
                  title="Mniejszy"
                >
                  −
                </button>
                <div className="px-2 py-2 flex items-center gap-1">
                  <RiFontSize2 />
                  <input
                    className="w-14 text-center rounded-md border border-black/10 px-2 py-[6px] text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                    type="number"
                    min={6}
                    value={num(ts.fontSize, 12)}
                    onChange={(e) =>
                      patchText({
                        fontSize: Math.max(6, +e.target.value || 12),
                      })
                    }
                  />
                </div>
                <button
                  onClick={() => changeFontSize(+1)}
                  className="px-2 py-2 hover:bg-slate-50"
                  title="Większy"
                >
                  +
                </button>
              </div>

              <label className="flex items-center gap-2 px-2 py-1 rounded-lg border border-black/15 bg-white text-slate-700">
                <RiBold />
                <select
                  className="px-1 py-[6px] text-sm rounded-md outline-none"
                  value={
                    typeof ts.fontWeight === 'number' ? ts.fontWeight : 400
                  }
                  onChange={(e) =>
                    patchText({ fontWeight: +e.target.value || 400 })
                  }
                >
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                    <option key={w} value={w}>
                      {w === 400
                        ? 'Normal (400)'
                        : w === 700
                        ? 'Bold (700)'
                        : w}
                    </option>
                  ))}
                </select>
              </label>

              <div className="inline-flex items-center gap-1">
                <IconBtn
                  onClick={toggleBold}
                  title="Pogrubienie"
                  active={
                    (typeof ts.fontWeight === 'number' ? ts.fontWeight : 400) >=
                    700
                  }
                >
                  <RiBold />
                </IconBtn>
                <IconBtn
                  onClick={toggleItalic}
                  title="Kursywa"
                  active={ts.fontStyle === 'italic'}
                >
                  <RiItalic />
                </IconBtn>
              </div>

              <div
                className="inline-flex items-stretch rounded-lg border border-black/15 overflow-hidden text-slate-700"
                title="Wyrównanie"
              >
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    (ts.textAlign || 'left') === 'left'
                      ? 'bg-slate-900 text-white hover:bg-slate-900'
                      : ''
                  }`}
                  onClick={() => setAlign('left')}
                  aria-label="Wyrównanie: left"
                >
                  <RiAlignLeft />
                </button>
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    (ts.textAlign || 'left') === 'center'
                      ? 'bg-slate-900 text-white hover:bg-slate-900'
                      : ''
                  }`}
                  onClick={() => setAlign('center')}
                  aria-label="Wyrównanie: center"
                >
                  <RiAlignCenter />
                </button>
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    (ts.textAlign || 'left') === 'right'
                      ? 'bg-slate-900 text-white hover:bg-slate-900'
                      : ''
                  }`}
                  onClick={() => setAlign('right')}
                  aria-label="Wyrównanie: right"
                >
                  <RiAlignRight />
                </button>
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    (ts.textAlign || 'left') === 'justify'
                      ? 'bg-slate-900 text-white hover:bg-slate-900'
                      : ''
                  }`}
                  onClick={() => setAlign('justify')}
                  aria-label="Wyrównanie: justify"
                >
                  <RiAlignJustify />
                </button>
              </div>

              <label
                className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                title="Kolor tekstu"
              >
                <RiPaletteLine />
                <input
                  type="color"
                  className="sr-only"
                  value={ts.color || '#0f172a'}
                  onChange={(e) => patchText({ color: e.target.value })}
                />
              </label>
            </>
          )}

          {/* IMAGE */}
          {isImage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    await setSrcFromFile(f);
                  }
                  e.target.value = '';
                }}
              />
              <button
                className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                title="Podmień obraz z pliku"
                onClick={() => fileInputRef.current?.click()}
              >
                <RiImageEditLine />
              </button>
              <select
                className="px-2 py-[6px] text-sm rounded-lg border border-black/15 bg-white outline-none"
                value={n.objectFit || 'cover'}
                onChange={(e) => patchNode({ objectFit: e.target.value })}
                title="Dopasowanie"
              >
                <option>cover</option>
                <option>contain</option>
                <option>fill</option>
                <option>none</option>
                <option>scale-down</option>
              </select>
              <input
                title="Zaokrąglenie (mm)"
                className="w-20 rounded-lg border border-black/15 px-2 py-[6px] text-sm outline-none"
                type="number"
                value={st.cornerRadius || 0}
                onChange={(e) => patchStyle({ cornerRadius: +e.target.value })}
              />
            </>
          )}

          {/* SHAPE */}
          {isShape && (
            <>
              <input
                title="Kolor wypełnienia"
                type="color"
                className="rounded-lg border border-black/15 px-1 py-[6px] text-sm outline-none"
                value={st.fill?.color || '#e2e8f0'}
                onChange={(e) =>
                  patchStyle({
                    fill: {
                      ...(st.fill || {}),
                      color: e.target.value,
                      opacity: st.fill?.opacity ?? 1,
                    },
                  })
                }
              />
              <input
                title="Krycie (0–1)"
                className="w-20 rounded-lg border border-black/15 px-2 py-[6px] text-sm outline-none"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={st.fill?.opacity ?? 1}
                onChange={(e) =>
                  patchStyle({
                    fill: { ...(st.fill || {}), opacity: +e.target.value },
                  })
                }
              />
              <input
                title="Kolor obrysu"
                type="color"
                className="rounded-lg border border-black/15 px-1 py-[6px] text-sm outline-none"
                value={st.stroke?.color || '#94a3b8'}
                onChange={(e) =>
                  patchStyle({
                    stroke: {
                      ...(st.stroke || {}),
                      color: e.target.value,
                      width: st.stroke?.width ?? 0.6,
                      dash: st.stroke?.dash || [],
                    },
                  })
                }
              />
              <input
                title="Grubość obrysu (mm)"
                className="w-24 rounded-lg border border-black/15 px-2 py-[6px] text-sm outline-none"
                type="number"
                step="0.1"
                value={st.stroke?.width ?? 0.6}
                onChange={(e) =>
                  patchStyle({
                    stroke: { ...(st.stroke || {}), width: +e.target.value },
                  })
                }
              />
              <input
                title="Promień narożników (mm)"
                className="w-24 rounded-lg border border-black/15 px-2 py-[6px] text-sm outline-none"
                type="number"
                value={st.cornerRadius || 0}
                onChange={(e) => patchStyle({ cornerRadius: +e.target.value })}
              />
            </>
          )}
        </div>

        {/* PRAWA */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="px-3 py-2 rounded-lg text-white font-semibold border disabled:opacity-60"
            style={{
              background: 'var(--color-bookcloth)',
              borderColor: 'var(--color-bookcloth)',
            }}
            disabled={loading}
            onClick={onOpenGenerateModal}
          >
            {loading ? 'Pracuję…' : 'Wygeneruj CV'}
          </button>
          <SaveMenu
            disabled={loading}
            onGeneratePdf={() => exportDocumentToPdf(doc, 'CV.pdf')}
            onGenerateAndSave={onGenerateAndSave}
            onPrint={() => openPdfPrint(doc)}
          />
        </div>
      </div>

      <AddElementDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAddText={addText}
        onAddImage={addImage}
        onAddRect={addRect}
      />
    </>
  );
}

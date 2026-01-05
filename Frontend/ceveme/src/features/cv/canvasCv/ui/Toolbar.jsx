import React, { useMemo, useRef, useState, useEffect } from "react";
import { exportDocumentToPdf, openPdfPrint } from "../services/exportVector";
import AddElementDialog from "./canva/AddElementDialog";
import SaveMenu from "./canva/SaveMenu";
import { FONT_STACKS } from "./sidebar/fonts";
import { ensureGoogleFont } from "./sidebar/googleFontsLoader";
import FontSelect from "./sidebar/FontSelect";
import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiItalic,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiFontSize,
  RiPaletteLine,
  RiImageEditLine,
} from "react-icons/ri";

export default function Toolbar(props) {
  const {
    doc,
    selectedIds = [],
    selectedId,
    updateNode,
    addText,
    addImage,
    addRect,
    addIcon,
    undo,
    redo,
    canUndo,
    canRedo,
    loading = false,
    showGrid = false,
    onToggleGrid = () => {},
    onGenerateAndSave,
    onOpenGenerateModal,
    onFitToScreen = () => {},
    alignNodes = () => {},
    addDialogMode = "closed",
    onCloseAddDialog = () => {},
  } = props;

  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const addOpen = addDialogMode !== "closed" || internalAddOpen;
  const showIconPickerInitially = addDialogMode === "icons";

  const handleCloseDialog = () => {
    setInternalAddOpen(false);
    onCloseAddDialog();
  };

  const fileInputRef = useRef(null);

  const nodes = useMemo(() => doc?.nodes || [], [doc?.nodes]);
  const selectedNodes = useMemo(
    () => nodes.filter((x) => selectedIds.includes(String(x.id))),
    [nodes, selectedIds]
  );
  const isMulti = selectedNodes.length >= 2;

  const selectedTextNodes = useMemo(
    () => selectedNodes.filter((n) => n.type === "text"),
    [selectedNodes]
  );
  const isTextAny = selectedTextNodes.length > 0;

  const n =
    useMemo(
      () => nodes.find((x) => String(x.id) === String(selectedId)) || null,
      [nodes, selectedId]
    ) || null;
  const isImage = n?.type === "image";
  const isShape = n?.type === "shape";
  const isDrawing = n?.type === "drawing";
  const ts = useMemo(() => n?.textStyle || {}, [n]);
  const st = useMemo(() => n?.style || {}, [n]);

  const num = (v, d) => (typeof v === "number" ? v : d);

  const patchManyText = (fnOrPatch) => {
    if (!isTextAny) return;
    selectedTextNodes.forEach((node) => {
      const prev = node.textStyle || {};
      const patch =
        typeof fnOrPatch === "function" ? fnOrPatch(node) : fnOrPatch;
      updateNode(node.id, { textStyle: { ...prev, ...(patch || {}) } });
    });
  };

  const every = (arr, pred) => arr.length > 0 && arr.every(pred);
  const getWeight = (node) =>
    typeof node.textStyle?.fontWeight === "number"
      ? node.textStyle.fontWeight
      : 400;

  const allBold = every(selectedTextNodes, (n) => getWeight(n) >= 700);
  const allItalic = every(
    selectedTextNodes,
    (n) => (n.textStyle?.fontStyle || "normal") === "italic"
  );
  const commonAlign = (() => {
    if (!isTextAny) return null;
    const first = selectedTextNodes[0].textStyle?.textAlign || "left";
    return every(
      selectedTextNodes,
      (n) => (n.textStyle?.textAlign || "left") === first
    )
      ? first
      : null;
  })();

  const commonFontFamily = useMemo(() => {
    if (!isTextAny || selectedTextNodes.length === 0) return "";
    const first = selectedTextNodes[0].textStyle?.fontFamily || "";
    if (!first) return "";
    return selectedTextNodes.every(
      (n) => (n.textStyle?.fontFamily || "") === first
    )
      ? first
      : "";
  }, [isTextAny, selectedTextNodes]);

  const isMixedFontFamily = isMulti && isTextAny && commonFontFamily === "";

  const computedSingleFontSize = !isMulti ? String(num(ts.fontSize, 12)) : "";
  const [fontSizeInput, setFontSizeInput] = useState(computedSingleFontSize);

  useEffect(() => {
    if (!isTextAny) {
      setFontSizeInput("");
      return;
    }
    if (isMulti) {
      setFontSizeInput("");
    } else {
      setFontSizeInput(String(num(ts.fontSize, 12)));
    }
  }, [isMulti, isTextAny, selectedId, ts.fontSize]);

  const commitFontSize = () => {
    if (!isTextAny) return;
    const v = Math.max(6, +fontSizeInput || 0);
    if (!Number.isFinite(v) || v <= 0) {
      setFontSizeInput(isMulti ? "" : String(num(ts.fontSize, 12)));
      return;
    }
    patchManyText({ fontSize: v });
    setFontSizeInput(String(v));
  };

  const changeFontSize = (delta) => {
    if (!isTextAny || delta === 0) return;
    patchManyText((node) => {
      const curr =
        typeof node.textStyle?.fontSize === "number"
          ? node.textStyle.fontSize
          : 12;
      return { fontSize: Math.max(6, curr + delta) };
    });
    if (!isMulti) {
      const next = Math.max(
        6,
        (parseFloat(fontSizeInput) || num(ts.fontSize, 12)) + delta
      );
      setFontSizeInput(String(next));
    }
  };

  const toggleBold = () => {
    if (!isTextAny) return;
    const want = allBold ? 400 : 700;
    patchManyText({ fontWeight: want });
  };

  const toggleItalic = () => {
    if (!isTextAny) return;
    const want = allItalic ? "normal" : "italic";
    patchManyText({ fontStyle: want });
  };

  const setAlign = (align) => {
    if (!isTextAny) return;
    patchManyText({ textAlign: align });
  };

  const handlePickFont = async (stack, opt) => {
    if (!isTextAny || !opt) return;
    try {
      await ensureGoogleFont(opt.family, [400, 700], true);
    } catch (e) {
      console.log(e);
    }
    patchManyText({ fontFamily: stack });
  };

  const patchTextColor = (color) => {
    if (!isTextAny) return;
    patchManyText({ color });
  };

  const patchStyle = (patch) =>
    n && updateNode(n.id, { style: { ...(n.style || {}), ...(patch || {}) } });
  const patchNode = (patch) => n && updateNode(n.id, patch);

  const IconBtn = ({ active, title, onClick, children }) => (
    <button
      onClick={onClick}
      title={title}
      className={`px-2 py-2 rounded-lg border border-black/15 ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="inline-flex items-center justify-center text-lg">
        {children}
      </span>
    </button>
  );

  const fontFamilyValueForUI = isMulti ? commonFontFamily : ts.fontFamily || "";

  return (
    <>
      <style>{`.toolbar svg{width:1.25rem;height:1.25rem;display:inline-block}.toolbar svg,.toolbar svg *{fill:currentColor!important;stroke:none!important}`}</style>

      <div className="toolbar sticky top-0 z-20 flex items-center gap-2 p-2 bg-white border-b border-black/10 overflow-x-auto">
        {/* LEWA */}
        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            onClick={() => setInternalAddOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            Dodaj
          </button>
          <div className="w-px h-7 bg-black/10" />
          <button
            disabled={!canUndo || loading}
            onClick={undo}
            className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            title="Cofnij"
          >
            <RiArrowGoBackLine />
          </button>
          <button
            disabled={!canRedo || loading}
            onClick={redo}
            className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60"
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
            {showGrid ? "Ukryj siatkę" : "Pokaż siatkę"}
          </button>
          <button
            disabled={loading}
            onClick={onFitToScreen}
            className="px-3 py-2 rounded-lg border border-black/15 bg-white text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-60"
            title="Dopasuj do ekranu (Ctrl+9)"
          >
            Dopasuj
          </button>
        </div>

        {/* ŚRODEK */}
        <div className="flex items-center gap-2 mx-auto">
          {/* TEKST */}
          {isTextAny && (
            <>
              {/* Font family — przy mixed pokazujemy overlay •••; gdy wspólna, pokazujemy nazwę */}
              <div className="relative mr-1">
                {isMixedFontFamily && (
                  <div
                    className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-500"
                    aria-hidden
                  >
                    • • •
                  </div>
                )}
                <FontSelect
                  options={FONT_STACKS}
                  valueStack={fontFamilyValueForUI}
                  weight={
                    typeof ts.fontWeight === "number" ? ts.fontWeight : 400
                  }
                  italic={ts.fontStyle === "italic"}
                  onChange={handlePickFont}
                  className="mr-1"
                  sample="Ważne Żółte Źdźbła 123"
                />
              </div>

              {/* Rozmiar — draft + commit */}
              <div className="inline-flex items-stretch rounded-lg border border-black/15 overflow-hidden text-slate-700">
                <button
                  onClick={() => changeFontSize(-1)}
                  className="px-2 py-2 hover:bg-slate-50"
                  title="Mniejszy (+/- działa na wszystkie teksty)"
                >
                  −
                </button>
                <div className="px-2 py-2 flex items-center gap-1">
                  <RiFontSize />
                  <input
                    type="number"
                    min={6}
                    value={fontSizeInput}
                    placeholder={isMulti ? "•••" : undefined}
                    onChange={(e) => setFontSizeInput(e.target.value)}
                    onBlur={commitFontSize}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitFontSize();
                        e.currentTarget.blur();
                      }
                      if (e.key === "Escape") {
                        setFontSizeInput(
                          isMulti ? "" : String(num(ts.fontSize, 12))
                        );
                        e.currentTarget.blur();
                      }
                    }}
                    className="w-14 text-center rounded-md border border-black/10 px-2 py-[6px] text-sm outline-none
               focus:ring-2 focus:ring-blue-500/40
               [&::-webkit-inner-spin-button]:appearance-none
               [&::-webkit-outer-spin-button]:appearance-none
               [&::-webkit-inner-spin-button]:m-0
               [&::-webkit-outer-spin-button]:m-0"
                    style={{
                      MozAppearance: "textfield",
                      appearance: "textfield",
                    }}
                  />
                </div>

                <button
                  onClick={() => changeFontSize(+1)}
                  className="px-2 py-2 hover:bg-slate-50"
                  title="Większy (+1 dla każdego zaznaczonego)"
                >
                  +
                </button>
              </div>

              <div className="inline-flex items-center gap-1">
                <IconBtn
                  onClick={toggleBold}
                  title="Pogrubienie (nadpisuje wszystkim)"
                  active={isTextAny && selectedTextNodes.length > 0 && allBold}
                >
                  <RiBold />
                </IconBtn>
                <IconBtn
                  onClick={toggleItalic}
                  title="Kursywa (nadpisuje wszystkim)"
                  active={
                    isTextAny && selectedTextNodes.length > 0 && allItalic
                  }
                >
                  <RiItalic />
                </IconBtn>
              </div>

              <div
                className="inline-flex items-stretch rounded-lg border border-black/15 overflow-hidden text-slate-700"
                title="Wyrównanie (ustawia wszystkim zaznaczonym tekstom)"
              >
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    (commonAlign || "left") === "left"
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : ""
                  }`}
                  onClick={() => setAlign("left")}
                  aria-label="Wyrównanie: left"
                >
                  <RiAlignLeft />
                </button>
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    commonAlign === "center"
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : ""
                  }`}
                  onClick={() => setAlign("center")}
                  aria-label="Wyrównanie: center"
                >
                  <RiAlignCenter />
                </button>
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    commonAlign === "right"
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : ""
                  }`}
                  onClick={() => setAlign("right")}
                  aria-label="Wyrównanie: right"
                >
                  <RiAlignRight />
                </button>
                <button
                  className={`px-2 py-2 border-r border-black/10 hover:bg-slate-50 ${
                    commonAlign === "justify"
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : ""
                  }`}
                  onClick={() => setAlign("justify")}
                  aria-label="Wyrównanie: justify"
                >
                  <RiAlignJustify />
                </button>
              </div>

              <label
                className="px-2 py-2 rounded-lg border border-black/15 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                title="Kolor tekstu (ustawia wszystkim zaznaczonym tekstom)"
              >
                <RiPaletteLine />
                <input
                  type="color"
                  className="sr-only"
                  value={isMulti ? "#0f172a" : ts.color || "#0f172a"}
                  onChange={(e) => patchTextColor(e.target.value)}
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
                  if (f)
                    await (async () => {
                      const dataUrl = await new Promise((res, rej) => {
                        const r = new FileReader();
                        r.onload = () => res(r.result);
                        r.onerror = rej;
                        r.readAsDataURL(f);
                      });
                      patchNode({ src: String(dataUrl) });
                    })().catch(() => {
                      const url = URL.createObjectURL(f);
                      patchNode({ src: url });
                    });
                  e.target.value = "";
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
                value={n.objectFit || "cover"}
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
                className="rounded-lg border border-black/15 px-1 py/[6px] text-sm outline-none"
                value={st.fill?.color || "#e2e8f0"}
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
                value={st.stroke?.color || "#94a3b8"}
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

          {/* DRAWING - figury rysowane */}
          {isDrawing && (
            <>
              <div className="w-px h-7 bg-black/10" />
              <span className="text-xs text-slate-500 font-medium">
                Figura:
              </span>
              <input
                title="Kolor obrysu"
                type="color"
                className="rounded-lg border border-black/15 px-1 py-[6px] text-sm outline-none w-10"
                value={st.strokeColor || "#0f172a"}
                onChange={(e) => patchStyle({ strokeColor: e.target.value })}
              />
              <div className="flex items-center gap-1">
                <input
                  title="Kolor wypełnienia"
                  type="color"
                  className="rounded-lg border border-black/15 px-1 py-[6px] text-sm outline-none w-10"
                  value={
                    st.fillColor === "none"
                      ? "#ffffff"
                      : st.fillColor || "#ffffff"
                  }
                  onChange={(e) => patchStyle({ fillColor: e.target.value })}
                />
                <button
                  title="Usuń wypełnienie"
                  className={`px-2 py-1 rounded text-xs ${
                    st.fillColor === "none"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                  onClick={() =>
                    patchStyle({
                      fillColor: st.fillColor === "none" ? "#e2e8f0" : "none",
                    })
                  }
                >
                  {st.fillColor === "none" ? "∅" : "●"}
                </button>
              </div>
              <input
                title="Grubość linii (px)"
                className="w-16 rounded-lg border border-black/15 px-2 py-[6px] text-sm outline-none"
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={st.strokeWidth || 2}
                onChange={(e) => patchStyle({ strokeWidth: +e.target.value })}
              />
              <input
                title="Przezroczystość (0–1)"
                className="w-16 rounded-lg border border-black/15 px-2 py-[6px] text-sm outline-none"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={st.opacity ?? 1}
                onChange={(e) => patchStyle({ opacity: +e.target.value })}
              />
            </>
          )}

          {/* WYRÓWNYWANIE POZYCYJNE (multi-select) */}
          {isMulti && (
            <>
              <div className="w-px h-7 bg-black/10" />
              <div
                className="inline-flex items-stretch rounded-lg border border-black/15 overflow-hidden text-slate-700"
                title="Wyrównanie pozycyjne elementów"
              >
                <button
                  className="px-2 py-2 border-r border-black/10 hover:bg-slate-50"
                  onClick={() => alignNodes(selectedIds, "left")}
                  title="Wyrównaj do lewej"
                >
                  <RiAlignLeft />
                </button>
                <button
                  className="px-2 py-2 border-r border-black/10 hover:bg-slate-50"
                  onClick={() => alignNodes(selectedIds, "center")}
                  title="Wyrównaj do środka (poziomo)"
                >
                  <RiAlignCenter />
                </button>
                <button
                  className="px-2 py-2 border-r border-black/10 hover:bg-slate-50"
                  onClick={() => alignNodes(selectedIds, "right")}
                  title="Wyrównaj do prawej"
                >
                  <RiAlignRight />
                </button>
                <button
                  className="px-2 py-2 border-r border-black/10 hover:bg-slate-50"
                  onClick={() => alignNodes(selectedIds, "top")}
                  title="Wyrównaj do góry"
                >
                  ⬆
                </button>
                <button
                  className="px-2 py-2 border-r border-black/10 hover:bg-slate-50"
                  onClick={() => alignNodes(selectedIds, "middle")}
                  title="Wyrównaj do środka (pionowo)"
                >
                  ⬍
                </button>
                <button
                  className="px-2 py-2 hover:bg-slate-50"
                  onClick={() => alignNodes(selectedIds, "bottom")}
                  title="Wyrównaj do dołu"
                >
                  ⬇
                </button>
              </div>
              {selectedIds.length >= 3 && (
                <div
                  className="inline-flex items-stretch rounded-lg border border-black/15 overflow-hidden text-slate-700"
                  title="Rozłóż równomiernie"
                >
                  <button
                    className="px-2 py-2 border-r border-black/10 hover:bg-slate-50 text-xs font-medium"
                    onClick={() => alignNodes(selectedIds, "distributeH")}
                    title="Rozłóż poziomo"
                  >
                    ↔
                  </button>
                  <button
                    className="px-2 py-2 hover:bg-slate-50 text-xs font-medium"
                    onClick={() => alignNodes(selectedIds, "distributeV")}
                    title="Rozłóż pionowo"
                  >
                    ↕
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* PRAWA */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="px-3 py-2 rounded-lg text-white font-semibold border disabled:opacity-60"
            style={{
              background: "var(--color-bookcloth)",
              borderColor: "var(--color-bookcloth)",
            }}
            disabled={loading}
            onClick={onOpenGenerateModal}
          >
            {loading ? "Pracuję…" : "Wygeneruj CV"}
          </button>
          <SaveMenu
            disabled={loading}
            onGeneratePdf={() => exportDocumentToPdf(doc, "CV.pdf")}
            onGenerateAndSave={onGenerateAndSave}
            onPrint={() => openPdfPrint(doc)}
          />
        </div>
      </div>

      <AddElementDialog
        open={addOpen}
        onClose={handleCloseDialog}
        onAddText={addText}
        onAddImage={addImage}
        onAddRect={addRect}
        onAddIcon={addIcon}
        initialShowIconPicker={showIconPickerInitially}
      />
    </>
  );
}

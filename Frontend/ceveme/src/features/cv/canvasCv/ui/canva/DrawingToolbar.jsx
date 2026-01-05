import React from "react";
import { RiPencilLine, RiShapeLine, RiEraserLine } from "react-icons/ri";
import { TbPolygon } from "react-icons/tb";

const COLORS = [
  "#0f172a",
  "#1e40af",
  "#dc2626",
  "#16a34a",
  "#ca8a04",
  "#7c3aed",
  "#db2777",
  "#64748b",
  "#ffffff",
];

const STROKE_WIDTHS = [1, 2, 3, 4, 6];

export default function DrawingToolbar({
  isActive,
  onToggle,
  drawingMode,
  setDrawingMode,
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  onCancel,
}) {
  if (!isActive) {
    return (
      <button
        onClick={onToggle}
        className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium flex items-center gap-2"
        title="Narzędzie rysowania"
      >
        <RiPencilLine className="w-5 h-5" />
        Rysuj
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-lg border border-slate-200">
      <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
        <button
          onClick={() => setDrawingMode("freehand")}
          className={`p-2 rounded ${
            drawingMode === "freehand"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-100"
          }`}
          title="Swobodne rysowanie"
        >
          <RiPencilLine className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDrawingMode("polygon")}
          className={`p-2 rounded ${
            drawingMode === "polygon"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-100"
          }`}
          title="Rysuj wielokąt (klik po klik)"
        >
          <TbPolygon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1 border-r border-slate-200 pr-2">
        <span className="text-[10px] text-slate-400 uppercase font-medium">Obrys</span>
        <div className="flex items-center gap-1">
          {COLORS.slice(0, 5).map((color) => (
            <button
              key={`stroke-${color}`}
              onClick={() => setStrokeColor(color)}
              className={`w-5 h-5 rounded-full border ${
                strokeColor === color
                  ? "ring-2 ring-blue-500 ring-offset-1"
                  : "border-slate-300"
              }`}
              style={{ backgroundColor: color }}
              title={`Obrys: ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 border-r border-slate-200 pr-2">
        <span className="text-[10px] text-slate-400 uppercase font-medium">Wypełnienie</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFillColor("none")}
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              fillColor === "none"
                ? "ring-2 ring-blue-500 ring-offset-1"
                : "border-slate-300"
            }`}
            style={{ backgroundColor: "#fff" }}
            title="Brak wypełnienia"
          >
            <span className="text-red-500 text-xs font-bold">∅</span>
          </button>
          {COLORS.slice(0, 4).map((color) => (
            <button
              key={`fill-${color}`}
              onClick={() => setFillColor(color)}
              className={`w-5 h-5 rounded-full border ${
                fillColor === color
                  ? "ring-2 ring-blue-500 ring-offset-1"
                  : "border-slate-300"
              }`}
              style={{ backgroundColor: color, opacity: 0.7 }}
              title={`Wypełnienie: ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 border-r border-slate-200 pr-2">
        <span className="text-[10px] text-slate-400 uppercase font-medium">Grubość</span>
        <div className="flex items-center gap-1">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              className={`w-6 h-6 rounded flex items-center justify-center ${
                strokeWidth === w
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }`}
              title={`${w}px`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: w * 1.5, height: w * 1.5 }}
              />
            </button>
          ))}
        </div>
      </div>

      {drawingMode === "polygon" && (
        <div className="text-xs text-slate-500 px-2 border-r border-slate-200">
          <div>Klikaj aby dodać punkty</div>
          <div className="text-blue-600">Kliknij blisko startu aby zamknąć</div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-sm font-medium"
        >
          Anuluj
        </button>
        <button
          onClick={onToggle}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          Zakończ
        </button>
      </div>
    </div>
  );
}

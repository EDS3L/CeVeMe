import { measurePxPerMm } from "../core/mm";

export function measureTextHeightMm(text = "", widthMm = 100, textStyle = {}) {
  const pxPerMm = measurePxPerMm();

  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  el.style.pointerEvents = "none";
  el.style.left = "-10000px";
  el.style.top = "-10000px";
  el.style.width = `${Math.max(1, widthMm) * pxPerMm}px`;
  el.style.padding = "4px";
  el.style.boxSizing = "border-box";

  const {
    fontFamily = "Inter, Arial, sans-serif",
    fontSize = 10,
    fontWeight = 400,
    lineHeight = 1.35,
    align = "left",
    color = "#0f172a",
  } = textStyle;

  el.style.fontFamily = fontFamily;
  el.style.fontSize = `${fontSize}pt`;
  el.style.fontWeight = String(fontWeight);
  el.style.lineHeight = String(lineHeight);
  el.style.textAlign = align;
  el.style.color = color;
  el.style.whiteSpace = "pre-wrap";
  el.style.wordBreak = "break-word";
  el.style.overflowWrap = "anywhere";
  el.style.hyphens = "auto";
  el.style.outline = "none";

  el.textContent = (text || "").trim();
  document.body.appendChild(el);
  const heightPx = el.scrollHeight;
  document.body.removeChild(el);

  const mm = heightPx / pxPerMm;
  return mm + 1.2;
}

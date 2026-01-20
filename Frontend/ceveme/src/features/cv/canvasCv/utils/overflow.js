export function contentBBoxMm(nodes = []) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const n of nodes) {
    if (!n || n.visible === false || !n.frame) continue;
    const { x = 0, y = 0, w = 0, h = 0 } = n.frame;
    if ([x, y, w, h].some((v) => typeof v !== "number" || Number.isNaN(v)))
      continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  }
  if (!isFinite(minX)) return null;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY, maxY };
}

export function getOverflowList(doc, margin = 0) {
  const pageW = doc?.page?.widthMm ?? 210;
  const pageH = doc?.page?.heightMm ?? 297;
  const list = [];
  for (const n of doc?.nodes || []) {
    if (!n || n.visible === false || !n.frame) continue;
    const { x = 0, y = 0, w = 0, h = 0 } = n.frame;
    const overTop = Math.max(0, margin - y);
    const overLeft = Math.max(0, margin - x);
    const overRight = Math.max(0, x + w - (pageW - margin));
    const overBottom = Math.max(0, y + h - (pageH - margin));
    const overflow =
      overTop > 0 || overLeft > 0 || overRight > 0 || overBottom > 0;
    if (!overflow) continue;

    const name =
      (n.type === "text" && (n.text || "").split("\n")[0]) ||
      (n.type === "image" && (n.src || "Obraz")) ||
      n.id;

    list.push({
      id: n.id,
      type: n.type,
      name: (name || "").trim(),
      frame: { x, y, w, h },
      over: {
        top: overTop,
        left: overLeft,
        right: overRight,
        bottom: overBottom,
      },
    });
  }
  return list.sort((a, b) => a.frame.y - b.frame.y);
}

export function extraBottomMm(doc) {
  const bb = contentBBoxMm(doc?.nodes || []);
  const pageH = doc?.page?.heightMm ?? 297;
  if (!bb) return 0;
  return Math.max(0, bb.maxY - pageH);
}

export function maxContentYMm(doc) {
  const bb = contentBBoxMm(doc?.nodes || []);
  return bb ? bb.maxY : 0;
}

export function clampFrameIntoPage(
  frame,
  pageW = 210,
  pageH = 297,
  margin = 0,
) {
  const out = { ...frame };
  out.x = Math.max(margin, Math.min(out.x, pageW - margin - out.w));
  out.y = Math.max(margin, Math.min(out.y, pageH - margin - out.h));
  if (out.w > pageW - 2 * margin) {
    out.w = Math.max(5, pageW - 2 * margin);
    out.x = margin;
  }
  return out;
}

export function fitWidthIntoPage(frame, pageW = 210, margin = 0) {
  const out = { ...frame };
  if (out.w > pageW - 2 * margin) {
    out.w = Math.max(5, pageW - 2 * margin);
    out.x = margin;
  } else {
    out.x = Math.max(margin, Math.min(out.x, pageW - margin - out.w));
  }
  return out;
}

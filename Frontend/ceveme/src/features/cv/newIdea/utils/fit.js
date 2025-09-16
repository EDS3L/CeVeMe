// utils/fit.js
export function fitDocToSinglePage(doc, { top = 0, bottom = 0 } = {}) {
  const pageH = doc.page?.heightMm ?? 297;
  const availH = Math.max(1, pageH - top - bottom);

  const maxY = doc.nodes.reduce((m, n) => {
    const f = n.frame || { y: 0, h: 0 };
    return Math.max(m, (f.y || 0) + (f.h || 0));
  }, 0);

  if (maxY <= availH) return doc; // mieści się – nic nie rób

  const f = availH / maxY;
  const scaled = {
    ...doc,
    nodes: doc.nodes.map((n) => {
      const frame = n.frame
        ? {
            x: (n.frame.x || 0) * f,
            y: (n.frame.y || 0) * f,
            w: Math.max(1, (n.frame.w || 0) * f),
            h: Math.max(1, (n.frame.h || 0) * f),
            rotation: n.frame.rotation || 0,
          }
        : n.frame;

      // style w mm
      const style = n.style ? { ...n.style } : undefined;
      if (style) {
        if (typeof style.cornerRadius === 'number')
          style.cornerRadius = Math.max(0, style.cornerRadius * f);
        if (style.stroke?.width != null) {
          style.stroke = {
            ...style.stroke,
            width: Math.max(0, style.stroke.width * f),
          };
        }
        // (opcjonalnie: cienie w px można zostawić jak są)
      }

      // font w pt – też skalujemy
      const textStyle = n.textStyle ? { ...n.textStyle } : undefined;
      if (textStyle && typeof textStyle.fontSize === 'number') {
        textStyle.fontSize = Math.max(6, textStyle.fontSize * f); // dolne minimum czytelności
        // lineHeight jest bezwymiarowe – zwykle nie ruszamy
      }

      return { ...n, frame, style, textStyle };
    }),
  };

  return scaled;
}

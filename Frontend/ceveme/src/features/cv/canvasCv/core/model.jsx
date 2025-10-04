export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createTextNode(partial = {}) {
  return {
    id: uid('txt'),
    type: 'text',
    frame: { x: 20, y: 20, w: 80, h: 20, rotation: 0 },
    text: 'Nowy tekst',
    textStyle: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 12,
      fontWeight: 700,
      color: '#0f172a',
      align: 'left',
      lineHeight: 1.3,
    },
    style: { fill: null, stroke: null, cornerRadius: 0, shadow: null },
    lock: false,
    visible: true,
    ...partial,
  };
}

export function createImageNode(partial = {}) {
  return {
    id: uid('img'),
    type: 'image',
    frame: { x: 20, y: 50, w: 60, h: 40, rotation: 0 },
    src: 'https://picsum.photos/600/400',
    style: { fill: null, stroke: null, cornerRadius: 4, shadow: null },
    objectFit: 'cover',
    lock: false,
    visible: true,
    ...partial,
  };
}

export function createShapeNode(partial = {}) {
  return {
    id: uid('shp'),
    type: 'shape',
    frame: { x: 15, y: 15, w: 80, h: 30, rotation: 0 },
    style: {
      fill: { color: '#e2e8f0', opacity: 1 },
      stroke: { color: '#94a3b8', width: 0.6, dash: [] },
      cornerRadius: 4,
      shadow: null,
    },
    lock: false,
    visible: true,
    ...partial,
  };
}

export function emptyDocument(page = { widthMm: 210, heightMm: 297 }) {
  return {
    id: uid('doc'),
    page,
    nodes: [],
  };
}

import {
  createTextNode,
  createImageNode,
  createShapeNode,
  emptyDocument,
} from '../core/model';

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    build() {
      const doc = emptyDocument();
      const headerBg = createShapeNode({
        frame: { x: 0, y: 0, w: 210, h: 35, rotation: 0 },
        style: {
          fill: { color: '#f1f5f9', opacity: 1 },
          stroke: null,
          cornerRadius: 0,
          shadow: null,
        },
      });
      const name = createTextNode({
        frame: { x: 20, y: 8, w: 120, h: 20 },
        text: 'Jan Kowalski',
        textStyle: {
          fontSize: 20,
          fontWeight: 800,
          color: '#0f172a',
          align: 'left',
          lineHeight: 1.2,
        },
      });
      const headline = createTextNode({
        frame: { x: 20, y: 20, w: 120, h: 12 },
        text: 'Frontend Developer',
        textStyle: { fontSize: 12, fontWeight: 500, color: '#475569' },
      });
      const avatar = createImageNode({
        frame: { x: 170, y: 5, w: 30, h: 30 },
        style: { fill: null, stroke: null, cornerRadius: 999 },
      });
      const summaryLabel = createTextNode({
        frame: { x: 20, y: 45, w: 170, h: 10 },
        text: 'Podsumowanie',
        textStyle: { fontSize: 12, fontWeight: 800, color: '#0f766e' },
      });
      const summary = createTextNode({
        frame: { x: 20, y: 55, w: 170, h: 30 },
        text: 'Krótki opis kompetencji i osiągnięć...',
        textStyle: {
          fontSize: 10,
          fontWeight: 400,
          color: '#0f172a',
          lineHeight: 1.4,
        },
      });
      doc.nodes = [headerBg, name, headline, avatar, summaryLabel, summary];
      return doc;
    },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    build() {
      const doc = emptyDocument();
      const sidebar = createShapeNode({
        frame: { x: 0, y: 0, w: 60, h: 297 },
        style: {
          fill: { color: '#eef2ff', opacity: 1 },
          stroke: null,
          cornerRadius: 0,
        },
      });
      const name = createTextNode({
        frame: { x: 70, y: 10, w: 120, h: 18 },
        text: 'Anna Nowak',
        textStyle: { fontSize: 18, fontWeight: 800, color: '#1e293b' },
      });
      const headline = createTextNode({
        frame: { x: 70, y: 23, w: 120, h: 10 },
        text: 'UI/UX Designer',
        textStyle: { fontSize: 12, fontWeight: 600, color: '#475569' },
      });
      const avatar = createImageNode({
        frame: { x: 12, y: 10, w: 36, h: 36 },
        style: { fill: null, stroke: null, cornerRadius: 999 },
      });
      const skillsLabel = createTextNode({
        frame: { x: 8, y: 52, w: 44, h: 8 },
        text: 'Umiejętności',
        textStyle: { fontSize: 10, fontWeight: 800, color: '#3730a3' },
      });
      const skills = createTextNode({
        frame: { x: 8, y: 60, w: 44, h: 50 },
        text: 'Figma • Prototypowanie • Badania • Heurystyki',
        textStyle: { fontSize: 9, lineHeight: 1.35, color: '#0f172a' },
      });
      doc.nodes = [sidebar, name, headline, avatar, skillsLabel, skills];
      return doc;
    },
  },
];

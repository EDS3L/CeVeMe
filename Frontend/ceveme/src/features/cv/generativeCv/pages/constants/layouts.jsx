import CVPreviewClassic from '../../cvTypes/CVPreviewClassic';
import CVPreviewSidebar from '../../cvTypes/CVPreviewSidebar';
import CVPreviewHybrid from '../../cvTypes/CVPreviewHybrid';
import CVPreviewProject from '../../cvTypes/CVPreviewProject';
import CVPreviewAts from '../../cvTypes/CVPreviewAts';

export const LAYOUTS = [
  {
    value: 'ats',
    label: 'ATS',
    badge: 'ATS-first',
    desc: 'Jednokolumnowe, reverse-chronological. Zero tabel/ikon, standardowe punkty. Maksymalna zgodność z ATS.',
    component: 'ats',
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    badge: 'Human-first · ATS-safe',
    desc: 'Dwukolumnowy dla ludzi (skills/języki/certy w bocznej kolumnie), ale DOM linearny i ATS-bezpieczny.',
    component: 'hybrid',
  },
  {
    value: 'project',
    label: 'Project/Case',
    badge: 'Impact-first',
    desc: 'Wybrane projekty i efekty (STAR/CAR) na pierwszym planie. Idealne dla IT/produkt/design i juniorów.',
    component: 'project',
  },
  {
    value: 'classic',
    label: 'Classic',
    desc: 'Klasyczny układ z wyraźnym podziałem na doświadczenie, projekty i umiejętności.',
    component: 'classic',
  },
  {
    value: 'sidebar',
    label: 'Sidebar',
    desc: 'Zgrabny layout z boczną kolumną na kontakt, skills i certyfikaty.',
    component: 'sidebar',
  },
];

const COMPONENTS = {
  ats: CVPreviewAts,
  hybrid: CVPreviewHybrid,
  project: CVPreviewProject,
  classic: CVPreviewClassic,
  sidebar: CVPreviewSidebar,
};

export function getLayoutComponent(value) {
  const key = LAYOUTS.find((l) => l.value === value)?.component || 'classic';
  return COMPONENTS[key] || CVPreviewClassic;
}
